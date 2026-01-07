// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { cookies } from "next/headers";


// export async function PUT(
//   req: Request,
//   { params }: { params: Promise<{ orderId: string }> }
//   // { params }: { params: { orderId: string } }
// ) {
//   try {
//     const orderId =await params;
//     const ogid =orderId.orderId;
//     const body = await req.json();

//     console.log("orderId",orderId);
//     console.log("ogid",ogid);
//     const cookieStore = await cookies();
    
//       const userId = cookieStore.get("userId")?.value;
//     // const orderId = params.orderId;
//     // const body = await req.json();
//     // console.log("orderId:", orderId);
    
    
//     const {
//       payment,
//       dangerous,
//       totalOrderValue,
//       pickupAddressId,
//       rtoAddressId,
//       buyer,
//       packageData,
//       productOrders,
//     } = body;

//     const updatedOrder = await prisma.$transaction(async (tx) => {
//       // 1️⃣ Update Buyer
//       await tx.buyer.update({
//         where: { id: buyer.id },
//         data: {
//           name: buyer.name,
//           mobileNo: buyer.mobileNo,
//           alternateNo: buyer.alternateNumber,
//           email: buyer.email,
//           street: buyer.street,
//           city: buyer.city,
//           state: buyer.state,
//           country: buyer.country,
//           pincode: buyer.pincode,
//           // landmark: buyer.landmark,
//           // customOrderNo: buyer.customOrderNo,
//         },
//       });

//       // 2️⃣ Update Package
//       await tx.package.update({
//         where: { id: packageData?.id },
//         data: {
//           physicalWeight:Number(packageData.physicalWeight) ,
//           length: packageData.length,
//           breadth: packageData.breadth,
//           height: packageData.height,
//           applicableWeight: packageData.applicableWeight,
//         },
//       });

//       // 3️⃣ Remove old product mappings
//       await tx.product_Orders.deleteMany({
//         where: { orderId:String(ogid) },
//       });

//       const createdProducts = await Promise.all(
//         productOrders.map((p: any) =>
//           tx.product.create({
//             data: {
//               pname: p.pname,
//               sku: p.sku,
//               hsn: p.hsn,
//               quantity: p.quantity,
//               price: p.unitPrice,
//               sellerId: userId!,
//             },
//           })
//         )
//       );

//       // 4️⃣ Add updated products

     

//       // await tx.product_Orders.createMany({
//       //   data: productOrders.map((p: any) => ({
//       //     orderId:ogid,
//       //     productId: p.productId,
//       //     quantity: p.quantity,
//       //     unitPrice: p.unitPrice,
//       //     totalPrice: p.quantity * p.unitPrice,
//       //   })),
//       // });

//       // 5️⃣ Update Order
//       return await tx.order.update({
//         where: { id: ogid },
//         data: {
//           payment,
//           dangerous,
//           totalOrderValue,
//           pickupAddressId,
//           rtoAddressId,
//            productOrders: {
//             create: createdProducts.map((product, idx) => ({
//               productId: product.id,
//               quantity: productOrders[idx].quantity,
//               unitPrice: productOrders[idx].unitPrice,
//               totalPrice: productOrders[idx].quantity * productOrders[idx].unitPrice,
//             })),
//           },
//         },
//         include: {
//           buyer: true,
//           package: true,
//           productOrders: {
//             include: { product: true },
//           },
//         },
//       });
//     });

//     return NextResponse.json({
//       success: true,
//       data: updatedOrder,
//     });
//   } catch (error: any) {
//     console.error("ORDER UPDATE ERROR:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }




// // export async function PUT(
// //   req: Request,
// //   { params }: { params: { orderId: string } }
// // ) {
// //   try {
// //     const orderId = params.orderId;
// //     const body = await req.json();

// //     const updatedOrder = await prisma.$transaction(async (tx) => {
// //       // update order
// //       const order = await tx.order.update({
// //         where: { id: orderId },
// //         data: {
// //           payment: body.payment,
// //           dangerous: body.dangerous,
// //           totalOrderValue: body.totalOrderValue,
// //           status: body.status
// //         }
// //       });

// //       // example: replace products
// //       if (body.productOrders) {
// //         await tx.product_Orders.deleteMany({
// //           where: { orderId }
// //         });

// //         await tx.product_Orders.createMany({
// //           data: body.productOrders.map((p: any) => ({
// //             orderId,
// //             productId: p.productId,
// //             quantity: p.quantity,
// //             unitPrice: p.unitPrice,
// //             totalPrice: p.totalPrice
// //           }))
// //         });
// //       }

// //       return order;
// //     });

// //     return NextResponse.json({
// //       success: true,
// //       data: updatedOrder
// //     });
// //   } catch (error: any) {
// //     return NextResponse.json(
// //       { success: false, message: error.message },
// //       { status: 500 }
// //     );
// //   }
// // }
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { Decimal } from "@prisma/client/runtime/client";
// import { Decimal } from "@prisma/client/runtime/library";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const orderId = await params;
    const ogid = orderId.orderId;
    const body = await req.json();

    console.log("Received body:", JSON.stringify(body, null, 2));

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      payment,
      dangerous,
      totalOrderValue,
      pickupAddressId,
      rtoAddressId,
      buyer,
      packageData,
      productOrders,
    } = body;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1️⃣ Update Buyer
      await tx.buyer.update({
        where: { id: buyer.id },
        data: {
          name: buyer.name,
          mobileNo: buyer.mobileNo,
          alternateNo: buyer.alternateNumber || null,
          email: buyer.email || null,
          street: buyer.street,
          city: buyer.city,
          state: buyer.state,
          country: buyer.country,
          pincode: Number(buyer.pincode),
        },
      });

      // 2️⃣ Update Package
      await tx.package.update({
        where: { id: packageData?.id },
        data: {
          physicalWeight: new Decimal(packageData.physicalWeight || 0),
          length: new Decimal(packageData.length || 0),
          breadth: new Decimal(packageData.breadth || 0),
          height: new Decimal(packageData.height || 0),
          volumetricWeight: new Decimal(packageData.volumetricWeight || 0),
          applicableWeight: new Decimal(packageData.applicableWeight || 0),
        },
      });

      // 3️⃣ Remove old product-order mappings
      await tx.product_Orders.deleteMany({
        where: { orderId: String(ogid) },
      });

      // 4️⃣ Create new products
      const createdProducts = await Promise.all(
        productOrders.map((p: any) => {
          const productData = p.product || p;

          return tx.product.create({
            data: {
              pname: productData.pname,
              sku: productData.sku || null,
              hsn: productData.hsn ? Number(productData.hsn) : null,
              quantity: Number(p.quantity),
              price: new Decimal(p.unitPrice || 0),
              sellerId: userId,
            },
          });
        })
      );

      // 5️⃣ Update Order (WITHOUT nested productOrders)
      await tx.order.update({
        where: { id: ogid },
        data: {
          payment,
          dangerous,
          totalOrderValue: new Decimal(totalOrderValue || 0),
          pickupAddressId,
          rtoAddressId,
        },
      });

      // 6️⃣ Create Product_Orders separately using createMany
      await tx.product_Orders.createMany({
        data: createdProducts.map((product, idx) => {
          const originalProduct = productOrders[idx];
          const productData = originalProduct.product || originalProduct;
          const category = productData.category || "";

          return {
            orderId: ogid,
            productId: product.id,
            quantity: Number(originalProduct.quantity),
            unitPrice: new Decimal(originalProduct.unitPrice || 0),
            totalPrice: new Decimal(
              Number(originalProduct.quantity) * Number(originalProduct.unitPrice)
            ),
            // category: category,
          };
        }),
      });

      // 7️⃣ Fetch and return the complete updated order
      return await tx.order.findUnique({
        where: { id: ogid },
        include: {
          buyer: true,
          package: true,
          productOrders: {
            include: { product: true },
          },
          pickupAddress: true,
          rtoAddress: true,
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