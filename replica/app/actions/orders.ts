"use server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteOrder(orderId: string) {
  const res=await prisma.order.delete({
    where: { id: orderId },
  });

  return res;
  revalidatePath("/orders");
}


export async function createOrderAction(payload: any) {
  try {
    /* -------------------- AUTH -------------------- */
    const cookieStore =await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    /* -------------------- PAYLOAD -------------------- */
    const {
      pickupAddressId,
      rtoAddressId,
      buyer,
      packageDetails,
      products,
      payment,
      dangerous,
    } = payload;

    /* -------------------- TRANSACTION -------------------- */
    const order = await prisma.$transaction(async (tx) => {
      // 1️⃣ Buyer
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
          sellerId: userId,
        },
      });

      // 2️⃣ Package
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

      // 3️⃣ Products
      const createdProducts = await Promise.all(
        products.map((p: any) =>
          tx.product.create({
            data: {
              pname: p.pname,
              sku: p.sku,
              hsn: p.hsn,
              quantity: p.quantity,
              price: p.unitPrice,
              sellerId: userId,
            },
          })
        )
      );

      // 4️⃣ Order Value
      const totalOrderValue = createdProducts.reduce(
        (sum, product, idx) =>
          sum + product.price.toNumber() * products[idx].quantity,
        0
      );

      // 5️⃣ Order
      const createdOrder = await tx.order.create({
        data: {
          sellerId: userId,
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
              totalPrice:
                products[idx].quantity * products[idx].unitPrice,
            })),
          },
        },
        include: {
          buyer: true,
          package: true,
          productOrders: true,
        },
      });

      return createdOrder;
    });

    /* -------------------- REVALIDATE -------------------- */
    revalidatePath("/orders");

    return {
      success: true,
      message: "Order created successfully",
      data: order,
    };
  } catch (error: any) {
    console.error("Create order error:", error);

    return {
      success: false,
      message: "Failed to create order",
      error: error?.message || error,
    };
  }
}
