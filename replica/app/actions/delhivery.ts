"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { format } from "path";
// import { json } from "stream/consumers";

const DELHIVERY_URL = "https://staging-express.delhivery.com";
const DELHIVERY_TOKEN = process.env.DELHIVERY_API_TOKEN!;

function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// export async function wareHouse(params:type) {

// }

export async function createDelhiveryWarehouse(orderId: string) {
  try {
    console.log("in warehouse");

    /* 1️⃣ FETCH ORDER (NO API CALL) */
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
      return { success: false, message: "Order not found" };
    }

    if (order.status === "READY_TO_SHIP") {
      return { success: false, message: "Order already shipped" };
    }

    /* 2️⃣ CREATE WAREHOUSE */
    const warehousePayload = {
      name: order.buyer.name,
      email: order.buyer.email,
      phone: order.buyer.mobileNo,
      address: order?.pickupAddress?.street,
      city: order?.pickupAddress?.city,
      state: order?.pickupAddress?.state,
      country: order?.pickupAddress?.country,
      pin: String(order?.pickupAddress?.pincode),
      return_address: order?.rtoAddress?.street,
      return_city: order?.rtoAddress?.city,
      return_state: order?.rtoAddress?.state,
      return_country: order?.rtoAddress?.country,
      return_pin: String(order?.rtoAddress?.pincode),
    };

    const res = await fetch(
      `${DELHIVERY_URL}/api/backend/clientwarehouse/create/`,
      {
        method: "POST",
        headers: {
          Authorization: `${DELHIVERY_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(warehousePayload),
      }
    );

    const text = await res.text();
    const data = safeParse(text);

    // ❌ Delhivery error response
    if (!res.ok) {
      const errorMsg = typeof data === "string" ? data : JSON.stringify(data);

      // ✅ IGNORE DUPLICATE WAREHOUSE ERROR
      if (
        errorMsg.includes("already exists") &&
        errorMsg.includes("CLIENT_STORES_CREATE")
      ) {
        return {
          success: true,
          ignored: true,
          message: "Warehouse already exists",
        };
      }

      return {
        success: false,
        message: "Warehouse creation failed",
        error: data,
      };
    }

    // ✅ Success
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Create warehouse error:", error);

    return {
      success: false,
      message: error?.message || "Internal server error",
    };
  }
}

export async function createDelhiveryShipment(orderId: string) {
  console.log("id", orderId);

  // 1️⃣ Fetch order from DB
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
    return { success: false, message: "Order not found" };
  }

  const payload = {
    format: "json",
    shipments: [
      {
        name: order.buyer.name,
        add: order.pickupAddress?.street,
        city: order.pickupAddress?.city,
        state: order.pickupAddress?.state,
        country: order.pickupAddress?.country,
        pin: order.pickupAddress?.pincode,
        phone: order.pickupAddress?.mobileNo,

        order: order.id,
        payment_mode: order.payment, // COD / Prepaid
        cod_amount: order.payment === "COD" ? order.totalOrderValue : 0,
        total_amount: order.totalOrderValue,

        // products_desc: order.productName,
        quantity: order.productOrders[0]?.quantity,
        weight: Math.ceil(Number(order.package.physicalWeight) * 1000),

        return_add: order.rtoAddress?.street,
        return_city: order.rtoAddress?.city,
        return_state: order.rtoAddress?.state,
        return_pin: order.rtoAddress?.pincode,
        return_country: order.rtoAddress?.country,
        return_phone: order.rtoAddress?.mobileNo,
      },
    ],
    pickup_location: {
      name: order.buyer.name,
    },
  };

  const formBody = new URLSearchParams();
  formBody.append("format", "json");
  formBody.append("data", JSON.stringify(payload));
  // 3️⃣ Call Delhivery
  const res = await fetch(`${DELHIVERY_URL}/api/cmu/create.json`, {
    method: "POST",
    headers: {
      Authorization: `${DELHIVERY_TOKEN}`,
      //   "Content-Type": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: formBody.toString(),
  });

  const text = await res.text();
  const data = safeParse(text);
  console.log(data);

  if (!res.ok) {
    return {
      success: false,
      message: data,
    };
  }

  // 4️⃣ Extract waybill
  const waybill =
    typeof data === "object" ? data?.packages?.[0]?.waybill : null;

  if (!waybill) {
    return {
      success: false,
      message: "Waybill not generated",
    };
  }

  // 5️⃣ Update DB
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "READY_TO_SHIP",
      AWBNumber: waybill,
      deliveryPartner: "Delhivery",
    },
  });

  revalidatePath("/orders");
  return {
    success: true,
    waybill,
    data,
  };
}

export async function cancelDelhiveryShipment(orderId: string) {
  console.log("id:-", orderId);

  // 1️⃣ Fetch order
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (!order.AWBNumber) {
    throw new Error("AWB number not found for this order");
  }

  if (order.status !== "READY_TO_SHIP") {
    throw new Error("Only READY_TO_SHIP orders can be cancelled");
  }

  // 2️⃣ Prepare form body
  const formBody = new URLSearchParams();
  formBody.append("waybill", order.AWBNumber);
  formBody.append("cancellation", "true");

  // 3️⃣ Call Delhivery cancel API
  const res = await fetch(`${DELHIVERY_URL}/api/p/edit`, {
    method: "POST",
    headers: {
      Authorization: `${DELHIVERY_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: formBody.toString(),
  });

  const text = await res.text();
  const data = safeParse(text);

  // 4️⃣ Handle Delhivery failure
  if (!res.ok || data?.success === false) {
    return {
      success: false,
      message: data,
    };
  }

  // 5️⃣ Update DB
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "NEW",
      AWBNumber: "NULL",
    },
  });

  revalidatePath("/orders");
  return {
    success: true,
    message: "Shipment cancelled successfully",
    data,
  };
}
