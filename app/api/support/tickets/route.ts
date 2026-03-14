import { NextResponse } from "next/server";
import { makeId } from "@/lib/utils/id";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ ticket_id: makeId("tkt"), event: "support_ticket_created", input: body }, { status: 201 });
}
