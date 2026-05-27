import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — fetch user's prediction history
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("prediction_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Gagal memuat riwayat" }, { status: 503 });
  }
}

// POST — save a prediction to history
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const body = await request.json();

    const { error } = await supabase.from("prediction_history").insert({
      user_id: user.id,
      mode: body.mode,
      detected_items: body.detected_items,
      total_images: body.total_images,
      menu_recommendations: body.menu_recommendations,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan riwayat" }, { status: 503 });
  }
}

// DELETE — delete a history entry
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
    }

    const { error } = await supabase
      .from("prediction_history")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus riwayat" }, { status: 503 });
  }
}
