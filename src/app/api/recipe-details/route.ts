import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || "https://cc26-psu393-gizimeal-api.hf.space";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const menuName = searchParams.get("menu_name");

  if (!menuName) {
    return NextResponse.json(
      { success: false, message: "Parameter menu_name wajib diisi" },
      { status: 400 }
    );
  }

  const prompt = `
    Berikan resep lengkap untuk masakan bernama: ${menuName}.
    Gunakan bahasa Indonesia yang ramah, mudah dipahami, dan berikan catatan gizi singkat.
    Berikan respons dalam format JSON dengan struktur persis seperti berikut tanpa ada kata-kata pengantar atau penutup lain:
    {
      "nama_masakan": "${menuName}",
      "bahan_bahan": ["bahan 1 beserta jumlahnya", "bahan 2", "..."],
      "cara_memasak": ["langkah 1", "langkah 2", "..."],
      "catatan_gizi": "catatan gizi singkat di sini"
    }
  `;

  try {
    const response = await fetch(`${API_BASE_URL}/chatbot/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        history: [],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Chatbot API Error Response:", errorText);
      throw new Error(`Chatbot API returned status ${response.status}`);
    }

    const result = await response.json();
    const replyText = result.reply;
    
    if (!replyText) {
      throw new Error("Tidak ada respon dari chatbot");
    }

    // Clean up markdown json wrapper if present
    const cleanedText = replyText.replace(/```json|```/gi, "").trim();
    const data = JSON.parse(cleanedText);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in getRecipeDetails API via Chatbot:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mendapatkan detail resep" },
      { status: 500 }
    );
  }
}
