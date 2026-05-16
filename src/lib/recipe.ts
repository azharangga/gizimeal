import type { MenuRecommendation } from "@/lib/types";

// Heuristic recipe generator — used because the API only returns menu names
// and nutrient totals, not actual recipe steps. Produces plausible Indonesian
// cooking steps based on the menu name and matched ingredients.

const COMMON_PANTRY = [
  "Bawang putih 3 siung, cincang",
  "Bawang merah 2 siung, iris tipis",
  "Garam secukupnya",
  "Lada secukupnya",
  "Minyak goreng 1 sdm",
];

function detectMethod(name: string): "goreng" | "tumis" | "rebus" | "panggang" | "kukus" | "umum" {
  const n = name.toLowerCase();
  if (/(goreng|crispy)/.test(n)) return "goreng";
  if (/(tumis|cah|oseng)/.test(n)) return "tumis";
  if (/(rebus|sup|soto|sayur bening|bakso)/.test(n)) return "rebus";
  if (/(panggang|bakar|grill)/.test(n)) return "panggang";
  if (/(kukus|pepes|steam)/.test(n)) return "kukus";
  return "umum";
}

export function buildRecipe(menu: MenuRecommendation) {
  const method = detectMethod(menu.menu_name);
  const main = menu.matched_ingredients.length
    ? menu.matched_ingredients
    : ["bahan utama"];

  const ingredients: string[] = [
    ...main.map((m) => `${capitalize(m)} 200 gram, dipotong sesuai selera`),
    ...COMMON_PANTRY,
  ];

  const stepsByMethod: Record<string, string[]> = {
    goreng: [
      `Cuci bersih ${joinNice(main)} lalu tiriskan.`,
      "Bumbui dengan garam, lada, dan bawang putih cincang. Diamkan 10 menit agar bumbu meresap.",
      "Panaskan minyak goreng dengan api sedang.",
      `Goreng ${joinNice(main)} hingga berwarna keemasan dan matang merata.`,
      "Angkat, tiriskan, lalu sajikan selagi hangat.",
    ],
    tumis: [
      `Cuci dan potong ${joinNice(main)} sesuai selera.`,
      "Panaskan sedikit minyak, tumis bawang putih dan bawang merah hingga harum.",
      `Masukkan ${joinNice(main)}, aduk rata.`,
      "Tambahkan garam, lada, dan sedikit air. Masak hingga bahan matang dan bumbu meresap.",
      "Angkat dan sajikan hangat.",
    ],
    rebus: [
      "Didihkan air dalam panci secukupnya.",
      "Tumis bawang putih dan bawang merah hingga harum, masukkan ke dalam air rebusan.",
      `Masukkan ${joinNice(main)}, masak dengan api sedang sampai empuk.`,
      "Bumbui dengan garam dan lada secukupnya. Koreksi rasa.",
      "Sajikan selagi hangat dalam mangkuk.",
    ],
    panggang: [
      "Panaskan oven atau pan grill pada suhu sedang.",
      `Lumuri ${joinNice(main)} dengan bawang putih halus, garam, lada, dan sedikit minyak.`,
      "Diamkan minimal 15 menit agar bumbu meresap.",
      "Panggang hingga matang merata, balik sesekali agar tidak gosong.",
      "Sajikan dengan pelengkap sesuai selera.",
    ],
    kukus: [
      "Siapkan kukusan dan didihkan airnya.",
      `Bumbui ${joinNice(main)} dengan bawang putih halus, garam, dan lada.`,
      "Tata di atas kukusan, kukus selama 15–20 menit hingga matang.",
      "Angkat dan tiriskan.",
      "Sajikan hangat dengan pelengkap.",
    ],
    umum: [
      `Cuci bersih ${joinNice(main)} lalu siapkan bumbunya.`,
      "Tumis bawang putih dan bawang merah hingga harum.",
      `Masukkan ${joinNice(main)}, aduk hingga tercampur rata.`,
      "Tambahkan garam dan lada secukupnya. Masak hingga matang.",
      "Sajikan selagi hangat.",
    ],
  };

  const tips = [
    "Gunakan bahan segar agar nilai gizi lebih optimal.",
    "Batasi penggunaan minyak dan garam untuk menu lebih sehat.",
    "Tambahkan sayuran hijau sebagai pelengkap untuk porsi seimbang.",
  ];

  return {
    method,
    serving: "2 porsi",
    duration: estimateDuration(method),
    difficulty: "Mudah",
    ingredients,
    steps: stepsByMethod[method],
    tips,
  };
}

function joinNice(arr: string[]) {
  if (arr.length === 1) return arr[0];
  return arr.slice(0, -1).join(", ") + ", dan " + arr[arr.length - 1];
}

function estimateDuration(method: string) {
  switch (method) {
    case "panggang":
      return "30 menit";
    case "kukus":
      return "25 menit";
    case "rebus":
      return "25 menit";
    case "goreng":
      return "15 menit";
    case "tumis":
      return "15 menit";
    default:
      return "20 menit";
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
