import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    tag,
    isDefault,
    mobileNo,
    street,
    landmark,
    pincode,
    city,
    state,
    country,
  } = body;

  const cookieStore = await cookies();

  const userId = cookieStore.get("userId")?.value;
  // console.log(userId);
  try {
    const address = await prisma.address.create({
      data: {
        tag,
        isDefault,
        mobileNo,
        street,
        landmark,
        pincode,
        city,
        state,
        country,
        sellerId: userId!,
      },
    });

    return NextResponse.json({
      message: "Address created sucessfully",
      data: address,
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      message: "something went wrong",
      data: null,
      status: 400,
      err: error,
    });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const cookieStore = await cookies();
    const sellerId = cookieStore.get("userId")?.value;

    if (!sellerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: {
        sellerId,
        OR: [
          { tag: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { street: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { isDefault: "desc" },
    });

    return NextResponse.json({
      status: 400,
      success: true,
      message: "something went wrong",
      data: addresses,
      err: null,
    });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      sucsess: false,

      message: "something went wrong",
      data: null,
      err: error,
    });
  }
}
