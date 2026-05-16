import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || "https://cc26-psu393-gizimeal-api.hf.space";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Backend tidak tersedia" },
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
