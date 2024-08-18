import connectMongo from "../../../lib/mongodb";
import Message from "../../../models/Message";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectMongo();

  // Create a URL object from the request URL
  const url = new URL(req.url, process.env.BASE_URL);

  // Now you can safely access searchParams
  const searchParams = url.searchParams;

  const sender = searchParams.get("sender");
  const receiver = searchParams.get("receiver");

  const messages = await Message.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  })
    .populate("sender receiver")
    .exec();

  return NextResponse.json(messages, { status: 200 });
}
