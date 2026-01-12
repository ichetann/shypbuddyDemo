// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const body = await req.json();
//   console.log(body);
  
//   const warehousePayload = {
//     name: "test_name",
//     email: "test@email.com",
//     phone: "9999999999",
//     address: "Street address",
//     city: "Mumbai",
//     state: "Maharashtra",
//     country: "India",
//     pin: "400001",
//     return_address: "Street address",
//     return_pin: "400001",
//     return_city: "Mumbai",
//     return_state: "Maharashtra",
//     return_country: "India",
//   };

//   try {
//     const res = await fetch(
//       `https://staging-express.delhivery.com/api/backend/clientwarehouse/create`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Token ${process.env.DELHIVERY_TOKEN}`,
//           "Content-Type": "application/json",
//           "Accept":"application/json"
//           //   ...headers
//         },
//         body: JSON.stringify(warehousePayload),
//       }
//     );

//     // const data = await res.json();

//     if (!res.ok) {
//       throw data;
//       console.log(data);
      
//     }

//     return NextResponse.json(
//           { message: data },
//           { status: 201 }
//         );;
//     // return res;
//   } catch (error: any) {
//     const errorMsg = JSON.stringify(error);

//     // ✅ IGNORE THIS SPECIFIC ERROR
//     if (
//       errorMsg.includes("already exists") &&
//       errorMsg.includes("CLIENT_STORES_CREATE")
//     ) {
//       console.log("Warehouse already exists → proceeding...");
//     //   return { ignored: true };
//     return NextResponse.json(
//           { message: error },
//           { status: 404 }
//         );
//     }
//   }
// }



// import { NextResponse } from "next/server";

// function safeParse(text: string) {
//   try {
//     return JSON.parse(text);
//   } catch {
//     return text; // fallback to raw text
//   }
// }

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const warehousePayload = await req.json();

    const res = await fetch(
      "https://staging-express.delhivery.com/api/backend/clientwarehouse/create/",
      {
        method: "POST",
        headers: {
          Authorization: `${process.env.DELHIVERY_API_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(warehousePayload),
      }
    );

    const text = await res.text();
    const data = safeParse(text);
    console.log(data);
    
    

    // Delhivery error
    if (!res.ok) {
      const errorMsg =
        typeof data === "string" ? data : JSON.stringify(data);

      // IGNORE duplicate warehouse
      if (
        errorMsg.includes("already exists") &&
        errorMsg.includes("CLIENT_STORES_CREATE")
      ) {
        return NextResponse.json(
          {
            success: true,
            ignored: true,
            message: "Warehouse already exists",
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: data,
        },
        { status: res.status }
      );
    }

    // ✅ Success
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

// 🔒 SAFE JSON PARSER
function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
