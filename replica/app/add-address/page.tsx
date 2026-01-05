"use client";
import { useState } from "react";
import { addressSchema } from "../(components)/validators/addressSchema";

export default function AddAddress() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [address, setAddress] = useState({
    tag: "",
    isDefault: false,
    mobileNo: "",
    street: "",
    landmark: "",
    pincode: 0,
    city: "",
    state: "",
    country: "",
  });
  const saveAddressHandler = async () => {
    try {
      
    
    console.log(address);
    const result = addressSchema.safeParse(address);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      Object.entries(result.error.flatten().fieldErrors).forEach(
        ([key, value]) => {
          if (value && value.length > 0) {
            fieldErrors[key] = value[0]; // exact message
          }
        }
      );

      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    // const res = await fetch("/api/addAddress", {
    //   method: "POST",
    //   headers: { "Content:Type": "application/json" },
    //   body: JSON.stringify(address),
    // });

    const res = await fetch("/api/addAddress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });

    const data = await res.json();
    console.log("Sucess", data);
    } catch (error) {
      console.log(error);
      
    }
  };
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add Address</h1>

        <button className="ml-auto px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">
          Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Tag & Contact Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Tag <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) =>
                  setAddress({ ...address, tag: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Home, Work, Warehouse…"
              />
              {errors.tag && (
                <p className="text-xs text-red-500 mt-1">{errors.tag}</p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                name="isDefault"
                checked={address.isDefault}
                onChange={(e) =>
                  setAddress({ ...address, isDefault: e.target.checked })
                }
              />
              Set as default address
            </label>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) =>
                setAddress({ ...address, mobileNo: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="10 digit mobile number"
            />
            {errors.mobileNo && (
              <p className="text-xs text-red-500 mt-1">{errors.mobileNo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="House / Flat / Street / Locality"
            />
            {errors.street && (
              <p className="text-xs text-red-500 mt-1">{errors.street}</p>
            )}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Address Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label htmlFor="" className="">
                Landmark
              </label>
              <input
                onChange={(e) =>
                  setAddress({ ...address, landmark: e.target.value })
                }
                className="rounded-md border border-gray-300 px-3 py-2"
                placeholder="Landmark"
              />
            </div>
            <div>
              <label htmlFor="">Pincode</label>
              <input
                onChange={(e) =>
                  setAddress({ ...address, pincode: +e.target.value })
                }
                className="rounded-md border border-gray-300 px-3 py-2"
                placeholder="Pincode *"
              />
              {errors.pincode && (
                <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="">City</label>

              <input
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                className="rounded-md border border-gray-300 px-3 py-2"
                placeholder="City *"
              />
              {errors.city && (
                <p className="text-xs text-red-500 mt-1">{errors.city}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="">State</label>

              <input
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                className="rounded-md border border-gray-300 px-3 py-2"
                placeholder="State *"
              />
              {errors.state && (
                <p className="text-xs text-red-500 mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="mt-6 max-w-sm">
            <div>
              <label htmlFor="">Country</label>

              <input
                onChange={(e) =>
                  setAddress({ ...address, country: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Country *"
              />
              {errors.country && (
                <p className="text-xs text-red-500 mt-1">{errors.country}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">
            Reset
          </button>

          <button
            className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={saveAddressHandler}
          >
            Verify & Save
          </button>
        </div>
      </div>
    </div>
  );
}
