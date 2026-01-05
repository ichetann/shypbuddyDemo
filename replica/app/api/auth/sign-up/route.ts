import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fname, lname, email, mobileNo, password } = body;

    console.log(body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user =await prisma.user.create({
      data: {
        fname,
        lname,
        email,
        mobileNo,
        password: hashedPassword,
      },
    });

    // data -- spec--args --data
    // const { password: _, ...safeUser } = user;

    return NextResponse.json({
      status: 200,
      sucess: true,
      data: user,
      error: null,
    });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      sucess: false,
      data: null,
      error: error,
    });
  }
}
