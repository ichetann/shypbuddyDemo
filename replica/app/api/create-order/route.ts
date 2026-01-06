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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const id = await params;
    const orderId = id.orderId;
    const body = await req.json();

    if (orderId) {
      console.log(orderId);
      
    } else {
      console.log("not found");
      
    }
    

    const {
      payment,
      dangerous,
      totalOrderValue,
      pickupAddressId,
      rtoAddressId,
      buyer,
      package: packageData,
      products,
    } = body;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1️⃣ Update Buyer
      await tx.buyer.update({
        where: { id: buyer.id },
        data: {
          name: buyer.name,
          mobileNo: buyer.mobileNo,
          alternateNo: buyer.alternateNumber,
          email: buyer.email,
          street: buyer.street,
          city: buyer.city,
          state: buyer.state,
          country: buyer.country,
          pincode: buyer.pincode,
          // landmark: buyer.landmark,
          // customOrderNo: buyer.customOrderNo,
        },
      });

      // 2️⃣ Update Package
      await tx.package.update({
        where: { id: packageData.id },
        data: {
          physicalWeight: packageData.physicalWeight,
          length: packageData.length,
          breadth: packageData.breadth,
          height: packageData.height,
          applicableWeight: packageData.applicableWeight,
        },
      });

      // 3️⃣ Remove old product mappings
      await tx.product_Orders.deleteMany({
        where: { orderId },
      });

      // 4️⃣ Add updated products
      await tx.product_Orders.createMany({
        data: products.map((p: any) => ({
          orderId,
          productId: p.productId,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          totalPrice: p.quantity * p.unitPrice,
        })),
      });

      // 5️⃣ Update Order
      return await tx.order.update({
        where: { id: orderId },
        data: {
          payment,
          dangerous,
          totalOrderValue,
          pickupAddressId,
          rtoAddressId,
        },
        include: {
          buyer: true,
          package: true,
          productOrders: {
            include: { product: true },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error: any) {
    console.error("ORDER UPDATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}



// export async function PUT(
//   req: Request,
//   { params }: { params: { orderId: string } }
// ) {
//   try {
//     const orderId = params.orderId;
//     const body = await req.json();

//     console.log(orderId);
    
//     const {
//       status,
//       payment,
//       dangerous,
//       totalOrderValue,
//       pickupAddressId,
//       rtoAddressId,
//       products, // [{ productId, quantity, unitPrice }]
//     } = body;

//     const updatedOrder = await prisma.$transaction(async (tx) => {
//       // 1️⃣ Check order exists
//       const existingOrder = await tx.order.findUnique({
//         where: { id: orderId },
//       });

//       if (!existingOrder) {
//         throw new Error("Order not found");
//       }

//       // 2️⃣ Update order main fields
//       const order = await tx.order.update({
//         where: { id: orderId },
//         data: {
//           status,
//           payment,
//           dangerous,
//           totalOrderValue,
//           pickupAddressId,
//           rtoAddressId,
//         },
//       });

//       // 3️⃣ Update products if provided
//       if (Array.isArray(products) && products.length > 0) {
//         // delete old product mappings
//         await tx.product_Orders.deleteMany({
//           where: { orderId },
//         });

//         // create new product mappings
//         await tx.product_Orders.createMany({
//           data: products.map((p: any) => ({
//             orderId,
//             productId: p.productId,
//             quantity: p.quantity,
//             unitPrice: p.unitPrice,
//             totalPrice: p.quantity * p.unitPrice,
//           })),
//         });
//       }

//       return order;
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Order updated successfully",
//       data: updatedOrder,
//     });
//   } catch (error: any) {
//     console.error(error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message || "Failed to update order",
//       },
//       { status: 400 }
//     );
//   }
// }
