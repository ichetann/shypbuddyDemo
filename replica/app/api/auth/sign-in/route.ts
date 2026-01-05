import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.log(body);

    if (!email || !password) {
      return NextResponse.json({
        status: 400,
        sucess: false,
        data: null,
        error: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        status: 400,
        sucess: false,
        data: null,
        error: "Invalid email or password",
      });
    }

    const isPassValid = await bcrypt.compare(password, user.password);

    if (!isPassValid) {
      return NextResponse.json({
        status: 400,
        sucess: false,
        data: null,
        error: "Wrong password",
      });
    }

    const { password: _, ...safeUser } = user;
    console.log(password);
    
    const res =NextResponse.json({
      status: 200,
      sucess: true,
      data: safeUser,
      error: null,
    });

    res.cookies.set("userId", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, 
  });

    return res;
  } catch (error) {
    return NextResponse.json({
      status: 400,
      sucess: false,
      data: null,
      error: error,
    });
  }
}
