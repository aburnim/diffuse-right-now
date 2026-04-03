import { NextResponse } from "next/server";

const KV_KEY = "diffuse-scoreboard-state";

function kvAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function GET() {
  if (!kvAvailable()) {
    return NextResponse.json({ data: null, source: "none" });
  }

  try {
    const { kv } = await import("@vercel/kv");
    const data = await kv.get(KV_KEY);
    return NextResponse.json({ data, source: "kv" });
  } catch {
    return NextResponse.json({ data: null, source: "error" });
  }
}

export async function POST(request: Request) {
  if (!kvAvailable()) {
    return NextResponse.json({ data: null, source: "none" });
  }

  try {
    const { kv } = await import("@vercel/kv");
    const body = await request.json();
    await kv.set(KV_KEY, body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save" },
      { status: 500 }
    );
  }
}
