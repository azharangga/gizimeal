import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Compass, Target, Layers, Github, Mail } from "lucide-react";
import { MedicalDisclaimer } from "@/components/common/MedicalDisclaimer";
import { PageHeader } from "@/components/common/PageHeader";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "Tentang GiziMeal" },
      {
        name: "description",
        content:
          "GiziMeal adalah capstone project CC26-PSU393 bertema Healthy Lives & Well-Being.",
      },
    ],
  }),
});

const PILLARS = [
  {
    icon: Target,
    title: "Masalah",
    items: [
      "Kurangnya pemahaman kebutuhan gizi harian",
      "Kesulitan menentukan menu gizi seimbang sehari-hari",
      "Minim literasi gizi di kalangan masyarakat",
    ],
  },
  {
    icon: Compass,
    title: "Solusi",
    items: [
      "Klasifikasi bahan makanan dari foto",
      "Rekomendasi menu gizi seimbang dengan skor AKG",
      "Dataset gambar & CSV gizi dari Kaggle, diverifikasi ulang dengan acuan AKG & Pedoman Gizi Seimbang",
      "Kalkulator BMR & TDEE Mifflin–St Jeor",
    ],
  },
  {
    icon: Layers,
    title: "Batasan",
    items: [
      "Sistem prototype edukasi",
      "Dataset terbatas pada 15 bahan utama",
      "Informasi gizi bersifat informatif",
      "Bukan pengganti konsultasi medis",
    ],
  },
];

const TEAM = [
  {
    name: "Azharangga Kusuma",
    cohortId: "CACC370D6Y0721",
    role: "AI Engineer & Project Manager",
    path: "AI Engineer",
    email: "CACC370D6Y0721@student.devacademy.id",
    github: "https://github.com/azharanggakusuma",
  },
  {
    name: "Putri Nabilla",
    cohortId: "CACC370D6X1171",
    role: "AI Engineer",
    path: "AI Engineer",
    email: "CACC370D6X1171@student.devacademy.id",
    github: "https://github.com/putribila",
  },
  {
    name: "Farina Setya Rahesti",
    cohortId: "CDCC796D6X0089",
    role: "Data Scientist",
    path: "Data Scientist",
    email: "CDCC796D6X0089@student.devacademy.id",
    github: "https://github.com/farinasetyarahesti",
  },
  {
    name: "Mahaputri Buana Devwitasari",
    cohortId: "CDCC796D6X0088",
    role: "Data Scientist",
    path: "Data Scientist",
    email: "CDCC796D6X0088@student.devacademy.id",
    github: "https://github.com/mahaputribuanaa",
  },
  {
    name: "M. Dava Arya Nada Putra",
    cohortId: "CFCC258D6Y1955",
    role: "Frontend Developer",
    path: "Full-Stack Web Developer",
    email: "CFCC258D6Y1955@student.devacademy.id",
    github: "https://github.com/mdavaarya",
  },
  {
    name: "Muhammad Ihsanul Dzaky",
    cohortId: "CFCC308D6Y1451",
    role: "Backend Developer",
    path: "Full-Stack Web Developer",
    email: "CFCC308D6Y1451@student.devacademy.id",
    github: "https://github.com/ihsanulDzaky",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-[1200px] px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 md:pt-20 md:pb-16">
          <PageHeader
            eyebrow="Tentang Kami"
            title="Edukasi gizi yang berbasis pedoman resmi."
            lead="GiziMeal adalah capstone project CC26-PSU393 bertema Healthy Lives & Well-Being. Platform ini menyatukan klasifikasi bahan otomatis dengan acuan Permenkes RI agar setiap rekomendasi dapat ditelusuri sumbernya."
          />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 md:py-20">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, items }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="bg-card p-7"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-foreground/85">
                  {items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Alur Sistem
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
              Bagaimana GiziMeal bekerja
            </h2>

            <ol className="mt-8 grid gap-3 md:grid-cols-5">
              {[
                "Pengguna mengunggah gambar bahan",
                "Frontend mengirim gambar ke REST API",
                "Backend menjalankan model klasifikasi",
                "API mengirim hasil prediksi & rekomendasi",
                "Hasil ditampilkan di halaman berikutnya",
              ].map((step, i) => (
                <li
                  key={step}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <span className="text-sm font-semibold text-primary tnum">
                    0{i + 1}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Tim Pengembang
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
                Siapa yang membangun GiziMeal
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Capstone project CC26-PSU393 yang dikerjakan oleh enam
                mahasiswa lintas learning path dari Coding Camp 2026 by DBS Foundation.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM.map((member, idx) => (
                <motion.article
                  key={member.cohortId}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden rounded-2xl border border-border-soft bg-card"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3.5">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                          {getInitials(member.name)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-[15px] font-semibold leading-tight tracking-tight">
                            {member.name}
                          </h3>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-1.5">
                        <a
                          href={`mailto:${member.email}`}
                          aria-label={`Email ${member.name}`}
                          title={member.email}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Mail className="h-4 w-4" strokeWidth={1.8} />
                        </a>
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`GitHub ${member.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Github className="h-4 w-4" strokeWidth={1.8} />
                        </a>
                      </div>
                    </div>

                    <dl className="mt-5 space-y-1.5 border-t border-border-soft pt-4 text-[12px]">
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground/70">
                          ID Cohort
                        </dt>
                        <dd className="tnum font-semibold text-foreground/85">
                          {member.cohortId}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground/70">
                          Learning Path
                        </dt>
                        <dd className="font-semibold text-foreground/85">
                          {member.path}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <MedicalDisclaimer />
          </div>
        </div>
      </section>
    </>
  );
}
