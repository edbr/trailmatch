import { fetchOutdoorNews } from "@/app/_lib/fetchOutdoorNews";
import { NextResponse } from "next/server";

export async function GET() {
  const news = await fetchOutdoorNews();
  return NextResponse.json(news);
}
