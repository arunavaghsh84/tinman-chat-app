import connectMongo from "../../../lib/mongodb";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectMongo();

  const body = await req.json();

  const { nickname } = body;

  let user = await User.findOne({ nickname });

  if (!user) {
    user = await User.create({ nickname });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  return NextResponse.json({ token });
}
