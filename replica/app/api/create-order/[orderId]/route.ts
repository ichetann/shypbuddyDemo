import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function PUT(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const orderId =await params;
    const ogid =orderId.orderId;
    const body = await req.json();

    console.log("orderId",orderId);
    console.log("ogid",ogid);
    
    const {
      payment,
      dangerous,
      totalOrderValue,
      pickupAddressId,
      rtoAddressId,
      buyer,
      packageData,
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
        where: { id: packageData?.id },
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
        where: { orderId:String(ogid) },
      });

      // 4️⃣ Add updated products
      await tx.product_Orders.createMany({
        data: products.map((p: any) => ({
          orderId:ogid,
          productId: p.productId,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          totalPrice: p.quantity * p.unitPrice,
        })),
      });

      // 5️⃣ Update Order
      return await tx.order.update({
        where: { id: ogid },
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

//     const updatedOrder = await prisma.$transaction(async (tx) => {
//       // update order
//       const order = await tx.order.update({
//         where: { id: orderId },
//         data: {
//           payment: body.payment,
//           dangerous: body.dangerous,
//           totalOrderValue: body.totalOrderValue,
//           status: body.status
//         }
//       });

//       // example: replace products
//       if (body.productOrders) {
//         await tx.product_Orders.deleteMany({
//           where: { orderId }
//         });

//         await tx.product_Orders.createMany({
//           data: body.productOrders.map((p: any) => ({
//             orderId,
//             productId: p.productId,
//             quantity: p.quantity,
//             unitPrice: p.unitPrice,
//             totalPrice: p.totalPrice
//           }))
//         });
//       }

//       return order;
//     });

//     return NextResponse.json({
//       success: true,
//       data: updatedOrder
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }
