import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || "https://cc26-psu393-gizimeal-api.hf.space";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/classes`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error?.detail || error?.message || "Gagal memuat kelas" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Gagal terhubung ke server" },
      { status: 503 },
    );
  }
}
