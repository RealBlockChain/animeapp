import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new Response(JSON.stringify({ error: "Missing url param" }), { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }, // Opcional, pero ayuda con algunos endpoints
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to fetch from Consumet" }), { status: 500 });
  }
}