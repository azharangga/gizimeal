import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || "https://cc26-psu393-gizimeal-api.hf.space";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotRequestBody {
  message: string;
  history?: ChatMessage[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatbotRequestBody = await request.json();

    // Validasi field message
    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Field 'message' wajib diisi dan harus berupa string" },
        { status: 400 },
      );
    }

    const message = body.message.trim();

    if (message.length < 1 || message.length > 2000) {
      return NextResponse.json(
        { error: "Pesan harus antara 1 - 2000 karakter" },
        { status: 400 },
      );
    }

    // Validasi history jika ada
    if (body.history !== undefined && !Array.isArray(body.history)) {
      return NextResponse.json(
        { error: "Field 'history' harus berupa array" },
        { status: 400 },
      );
    }

    const history: ChatMessage[] = body.history || [];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${API_BASE_URL}/chatbot/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        history,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            error?.detail || error?.message || "Gagal mendapatkan respons AI",
        },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return NextResponse.json(
        {
          error:
            "Server terlalu lama merespons. Kemungkinan sedang cold-start, coba lagi dalam beberapa detik.",
        },
        { status: 504 },
      );
    }
    return NextResponse.json(
      { error: "Gagal terhubung ke server chatbot" },
      { status: 503 },
    );
  }
}
