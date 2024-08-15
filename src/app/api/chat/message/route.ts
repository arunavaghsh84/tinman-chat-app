import connectMongo from "../../../lib/mongodb";
import Message from "../../../models/Message";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectMongo();

  const body = await req.json();

  const { sender, receiver, messageText } = body;

  const message = new Message({ sender, receiver, messageText });
  await message.save();

  await message.populate("sender receiver");

  return NextResponse.json({ message }, { status: 200 });
}
