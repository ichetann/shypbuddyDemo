import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  const userId = cookieStore.get("userId")?.value;
  console.log(userId);
  try {
    const body = await req.json();

    const {
      sellerId,
      pickupAddressId,
      rtoAddressId,

      buyer,
      packageDetails,

      products, // product data to be CREATED
      payment,
      dangerous,
    } = body;

    console.log(pickupAddressId);
    
    const order = await prisma.$transaction(async (tx) => {
      // 1️⃣ Create Buyer
      const createdBuyer = await tx.buyer.create({
        data: {
          name: buyer.name,
          mobileNo: buyer.mobileNo,
          alternateNo: buyer.alternateNo,
          email: buyer.email,
          street: buyer.street,
          pincode: buyer.pincode,
          city: buyer.city,
          state: buyer.state,
          country: buyer.country,
          sellerId: userId!,
        },
      });

      // 2️⃣ Create Package
      const createdPackage = await tx.package.create({
        data: {
          physicalWeight: packageDetails.physicalWeight,
          length: packageDetails.length,
          breadth: packageDetails.breadth,
          height: packageDetails.height,
          volumetricWeight: packageDetails.volumetricWeight,
          applicableWeight: packageDetails.applicableWeight,
        },
      });

      // 3️⃣ Create Products
      const createdProducts = await Promise.all(
        products.map((p: any) =>
          tx.product.create({
            data: {
              pname: p.pname,
              sku: p.sku,
              hsn: p.hsn,
              quantity: p.quantity,
              price: p.unitPrice,
              sellerId: userId!,
            },
          })
        )
      );

      
      const totalOrderValue = createdProducts.reduce(
        (sum, p, idx) => sum + p.price.toNumber() * products[idx].quantity,
        0
      );

      const createdOrder = await tx.order.create({
        data: {
          sellerId: userId!,
          pickupAddressId,
          rtoAddressId,
          buyerId: createdBuyer.id,
          packageId: createdPackage.id,
          payment,
          dangerous,
          totalOrderValue,

          productOrders: {
            create: createdProducts.map((product, idx) => ({
              productId: product.id,
              quantity: products[idx].quantity,
              unitPrice: products[idx].unitPrice,
              totalPrice: products[idx].quantity * products[idx].unitPrice,
            })),
          },
        },
      });

      return createdOrder;
    });

    return NextResponse.json(
      {sucess:true,
        message: "Order created successfully",
        data: order,
        error: null,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        sucess:false,
        message: "Failed to create order",
        data: null,
        error: error,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const orderId = searchParams.get("orderId");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    // Filter by Order ID
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          buyer: true,
          pickupAddress: true,
          rtoAddress: true,
          package: true,
          productOrders: {
            include: { product: true },
          },
        },
      });

      if (!order) {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(order);
    }

    // 🔹 2️⃣ Date filter
    const dateFilter: any = {};

    if (fromDate || toDate) {
      dateFilter.createdAt = {};
      if (fromDate) dateFilter.createdAt.gte = new Date(fromDate);
      if (toDate) dateFilter.createdAt.lte = new Date(toDate);
    }

    // 🔹 3️⃣ Fetch all / date-filtered orders
    const orders = await prisma.order.findMany({
      where: dateFilter,
      orderBy: { createdAt: "desc" },
      include: {
        buyer: true,
        pickupAddress: true,
        rtoAddress: true,
        package: true,
        productOrders: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(req :NextRequest){
  
}