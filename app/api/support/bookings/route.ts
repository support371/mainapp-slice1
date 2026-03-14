import { NextResponse } from "next/server";
import { makeId } from "@/lib/utils/id";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ booking_id: makeId("bok"), event: "support_booking_created", input: body }, { status: 201 });
}
