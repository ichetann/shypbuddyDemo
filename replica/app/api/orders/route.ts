
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);

//   const page = Math.max(1, Number(searchParams.get("page")) || 1);
//   const limit = Math.min(50, Number(searchParams.get("limit")) || 3);

//   const skip = (page - 1) * limit;

//   console.log(page,limit);
  
//   const [users, total] = await Promise.all([
//     prisma.order.findMany({
//       skip,
//       take: limit,
      
//       orderBy: {
//         createdAt: "asc",
//       },
//       include: {
//         buyer: true,
//         pickupAddress: true,
//         rtoAddress: true,
//         package: true,
//         productOrders: {
//           include: { product: true },
//         },
//       },
//     }),
//     prisma.order.count(),
//   ]);

//   return NextResponse.json({
//     data: users,
//     pagination: {
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//     },
//   });
// }

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // adjust path if needed

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');
  const hsn = searchParams.get('hsn');
  const sku = searchParams.get('sku');
  const address_tag = searchParams.get('address_tag'); // this is pickup address tag
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 50);

  try {
    const where: any = {};

    // Date range filter
    if (start_date || end_date) {
      where.createdAt = {};
      if (start_date) {
        where.createdAt.gte = new Date(start_date);
      }
      if (end_date) {
        const end = new Date(end_date);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    // HSN filter → search inside Product via Product_Orders
    if (hsn) {
      where.productOrders = {
        some: {
          product: {
            hsn: {
              equals: Number(hsn), // your hsn is Int in Product
            },
          },
        },
      };
    }

    // SKU filter → search inside Product
    if (sku) {
      where.productOrders = {
        ...(where.productOrders || {}),
        some: {
          product: {
            sku: {
              contains: sku,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    // Address Tag filter → pickup address tag
    if (address_tag) {
      where.pickupAddress = {
        tag: {
          contains: address_tag,
          mode: 'insensitive',
        },
      };
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          buyer: {
            select: {
              name: true,
              mobileNo: true,
              email: true,
              street: true,
              city: true,
              state: true,
              pincode: true,
            },
          },
          pickupAddress: {
            select: {
              tag: true,
              mobileNo: true,
              street: true,
              city: true,
              state: true,
            },
          },
          productOrders: {
            include: {
              product: {
                select: {
                  pname: true,
                  sku: true,
                  hsn: true,
                  price: true,
                },
              },
            },
          },
          package: {
            select: {
              applicableWeight: true,
              length: true,
              breadth: true,
              height: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),

      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders', error: error.message },
      { status: 500 }
    );
  }
}