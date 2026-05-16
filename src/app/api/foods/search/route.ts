import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || "https://cc26-psu393-gizimeal-api.hf.space";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Query minimal 2 karakter" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${API_BASE_URL}/foods/search?query=${encodeURIComponent(query)}`,
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error?.detail || error?.message || "Pencarian gagal" },
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
