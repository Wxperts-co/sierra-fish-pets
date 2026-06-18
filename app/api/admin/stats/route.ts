import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { success: false, message: "Admin stats route not implemented." },
    { status: 501 }
  );
}
