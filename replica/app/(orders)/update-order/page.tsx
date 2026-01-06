"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Update() {
  const searchParams = useSearchParams();
  const id = searchParams.get("orderId");
  const [orderData, setOrderData] = useState<any>({});
  const [dangerousGoods, setDangerousGoods] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [rtoSearch, setRtoSearch] = useState("");
  const [pickupAddress, setPickupAddress] = useState(null);
  const [addresses, setAddresses] = useState<any[]>([]); //its pickup and rto address
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [productOrders, setProductOrders] = useState<any[]>([]);

  useEffect(() => {
    if (orderData?.productOrders) {
      setProductOrders(orderData.productOrders);
    }
  }, [orderData]);

  const [buyer, setBuyer] = useState({
    name: "",
    mobileNo: "",
    alternateNumber: "",
    email: "",
    customOrderNo: "",
  });
  const [buyerAddress, setBuyerAddress] = useState({
    buyerStreet: "",
    buyerPincode: "",
    buyerLandmark: "",
    buyerCity: "",
    buyerState: "",
    buyerCountry: "",
  });
  const [product, setProduct] = useState({
    pname: "",
    category: "",
    sku: "",
    hsn: "",
    quantity: "",
    price: "",
  });
  const [products, setProducts] = useState<any[]>([]);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [packageDetails, setPackageDetails] = useState({
    physicalWeight: "",
    length: "",
    breadth: "",
    height: "",
    volumetricWeight: "",
    applicableWeight: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"PREPAID" | "COD" | "">(
    ""
  );

  const [pickupId, setPickupId] = useState<string | null>(null);

  const [isRtoSame, setIsRtoSame] = useState(true);
  const [rtoId, setRtoId] = useState<string | null>(null);
  const [showRtoPicker, setShowRtoPicker] = useState(false);
  const [rtoAddresses, setRtoAddresses] = useState<any[]>([]);
  const l = Number(orderData?.package?.length);
  const b = Number(orderData?.package?.breadth);
  const h = Number(orderData?.package?.height);
  const pw = Number(orderData?.package?.physicalWeight);
  const isValid: boolean =
    Number(l) > 0.5 && Number(b) > 0.5 && Number(h) > 0.5;
  const volumetricWeight = isValid
    ? ((Number(l) * Number(b) * Number(h)) / 5000).toFixed(2)
    : null;

  const applicableWeight = Math.max(Number(pw), Number(volumetricWeight));

  const productHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProduct((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    console.log(product);
  };

  const addProduct = () => {
    const newProductOrder = {
      product: {
        pname: product.pname,
        category: product.category,
        sku: product.sku,
        hsn: Number(product.hsn),
      },
      quantity: Number(product.quantity),
      unitPrice: Number(product.price),
      totalPrice: Number(product.quantity) * Number(product.price),
    };

    // 🔁 UPDATE MODE
    if (editIndex !== null) {
      setProductOrders((prev) =>
        prev.map((item, i) => (i === editIndex ? newProductOrder : item))
      );
      setEditIndex(null);
    }
    // ➕ ADD MODE
    else {
      setProductOrders((prev) => [...prev, newProductOrder]);
    }

    // 🧹 Reset form
    setProduct({
      pname: "",
      category: "",
      sku: "",
      hsn: "",
      quantity: "",
      price: "",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAddresses(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const total = products.reduce((sum, p) => sum + Number(p.total), 0);

    setCalculatedTotal(total);
    setOrderTotal(total); // default value
  }, [products]);

  const fetchAddresses = async (query: string) => {
    const url =
      query.trim() === ""
        ? "/api/addAddress"
        : `/api/addAddress?q=${encodeURIComponent(query)}`;

    const res = await fetch(url);
    const data = await res.json();
    console.log(data);

    setAddresses(data.data || []);
  };

  //   update
  const updateOrder = () => {
    console.log(orderData);
  };

  const fetchOrders = async () => {
    const res = await fetch(`/api/create-order?orderId=${id}`);
    const data = await res.json();
    console.log(data);
    setOrderData({
      ...data,
      buyer: data.buyer ?? {},
      package: data.package ?? {},
    });
  };
  useEffect(() => {
    // const data;
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!showRtoPicker) return;

    const timer = setTimeout(async () => {
      const url =
        rtoSearch.trim() === ""
          ? "/api/addAddress"
          : `/api/addAddress?q=${encodeURIComponent(rtoSearch)}`;

      const res = await fetch(url);
      const data = await res.json();
      setRtoAddresses(data.data || []);
    }, 400);

    return () => clearTimeout(timer);
  }, [rtoSearch, showRtoPicker]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setOrderData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (
    section: "buyer" | "package",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setOrderData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  useEffect(() => {
    if (orderData?.pickupAddress) {
      setSearch(
        `${orderData.pickupAddress.street}, ${orderData.pickupAddress.city}, ${orderData.pickupAddress.state} - ${orderData.pickupAddress.pincode}, ${orderData.pickupAddress.country}`
      );
      setPickupId(orderData.pickupAddress.id);
    }
  }, [orderData]);
  useEffect(() => {
    if (orderData?.rtoAddress && !rtoSearch) {
      setRtoSearch(
        `${orderData.rtoAddress.street}, ${orderData.rtoAddress.city}, ${orderData.rtoAddress.state} - ${orderData.rtoAddress.pincode}, ${orderData.rtoAddress.country}`
      );
      setRtoId(orderData.rtoAddress.id);
    }
  }, [orderData]);

  return (
    <div className="min-h-screen bg-[#24303f] text-white w-full max-w-7xl mx-auto p-2">
      <div className="flex items-center mb-7 ">
        <h3 className="text-2xl font-semibold text-white">Quick Shipmenet</h3>
        <button className="ml-auto px-4 py-2 text-sm rounded-md border border-gray-300 ">
          <Link href={"/orders"}>Back</Link>
        </button>
      </div>
      <div className="pickup mb-10  relative">
        <p className="font-semibold">Pick-up from</p>
        <p>Where is the order being sent from?</p>
        <input
          type="text"
          value={search}
          className="lg:max-w-160 w-full border border-gray-300 px-3 py-1.5 bg-[#1d2a39] rounded-lg"
          onChange={(e) => {
            // console.log(selectedAddress.id);
            setSelectedAddress(null);
            setPickupId(null);
            setSearch(e.target.value);
          }}
        />
        <button>Search</button>
        {addresses.length > 0 && !selectedAddress && (
          <div className="absolute z-50 w-full border mt-1 rounded bg-[#24303f] text-white max-h-48 overflow-auto">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-2 hover:bg-[#1d2a39] cursor-pointer"
                onClick={() => {
                  setSelectedAddress(addr);
                  setPickupId(addr.id);

                  setSearch(
                    `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}, ${addr.country}`
                  );

                  setAddresses([]);
                }}
              >
                <p className="font-medium">{addr.tag}</p>
                <p className="text-sm text-gray-600">
                  {addr.street}, {addr.city}, {addr.state}
                </p>
              </div>
            ))}
          </div>
        )}
        <Link href={"/add-address"}>
          <p className="my-4">Add new pickup address</p>
        </Link>
        <label className="flex items-center gap-2 text-sm text-gray-600 m-2">
          <input
            type="checkbox"
            checked={isRtoSame}
            className=" border-gray-300 bg-white rounded-lg block "
            onChange={(e) => {
              const checked = e.target.checked;
              setIsRtoSame(checked);

              if (checked) {
                setRtoId(pickupId); // same as pickup
              } else {
                setShowRtoPicker(true); // open modal
              }
            }}
          />
          RTO (Return To Origin) Address is same as PickUp Address
        </label>
        {showRtoPicker && (
          <div className="w-full">
            <input
              type="text"
              value={rtoSearch}
              className="lg:max-w-160 w-full border border-gray-300 px-3 py-1.5 bg-[#1d2a39] rounded-lg"
              onChange={(e) => {
                // console.log(selectedAddress.id);
                setRtoAddresses([]);
                setRtoSearch(e.target.value);
                setRtoId(null);
              }}
            />

            {/* fetch */}
            {rtoAddresses.length > 0 && (
              <div className="absolute z-50 w-full border mt-1 rounded bg-[#24303f] text-white max-h-48 overflow-auto">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-2 hover:bg-[#1d2a39] cursor-pointer"
                    onClick={() => {
                      // setRtoAddresses(addr);
                      setRtoId(addr.id);

                      setRtoSearch(
                        `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}, ${addr.country}`
                      );

                      setRtoAddresses([]);
                      setShowRtoPicker(false);
                    }}
                  >
                    <p className="font-medium">{addr.tag}</p>
                    <p className="text-sm text-gray-600">
                      {addr.street}, {addr.city}, {addr.state}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-full bg-[#24303f]">
        <h3 className="font-extrabold text-xl">Add Buyer's Details</h3>
        <p className="font-bold">
          To whom is the order being delivered? (Buyer's Info)
        </p>
        <div className="flex flex-wrap gap-5">
          <div className="">
            <label htmlFor="" className="">
              Buyer's Name
            </label>
            <input
              name="name"
              onChange={(e) => handleNestedChange("buyer", e)}
              value={orderData?.buyer?.name || ""}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Enter Buyer's Name"
            />
          </div>
          <div className="">
            <label htmlFor="">Buyer's Number</label>
            <input
              name="mobileNo"
              onChange={(e) => handleNestedChange("buyer", e)}
              value={orderData?.buyer?.mobileNo}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Enter Buyer's Number"
            />
          </div>
          <div className="">
            <label htmlFor="">Alternate Number</label>
            <input
              name="alternateNumber"
              onChange={(e) => handleNestedChange("buyer", e)}
              value={orderData?.buyer?.alternateNo}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Enter Alternate Number"
            />
          </div>
          <div className="">
            <label htmlFor="">Email</label>
            <input
              name="email"
              onChange={(e) => handleNestedChange("buyer", e)}
              value={orderData?.buyer?.email}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Enter Email"
            />
          </div>
          <div className="">
            <label htmlFor="" className="">
              Custom Order No
            </label>
            <input
              name="customOrderNo"
              value={orderData?.buyer?.customOrderNo}
              onChange={(e) => handleNestedChange("buyer", e)}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Custom Order No"
            />
          </div>
        </div>
      </div>
      {/* buyers Address */}
      <div className="">
        <h3 className="my-4">
          Where is the order being delivered to? (Buyer's Address)
        </h3>
        <div className="flex flex-wrap gap-5 ">
          <div className="flex-1">
            <label htmlFor="" className="font-semibold">
              Complete Address
            </label>
            <input
              type="text"
              name="street"
              value={orderData?.buyer?.street}
              onChange={(e) => handleNestedChange("buyer", e)}
              className="w-full border border-gray-500 p-1 my-2  bg-[#1d2a39] rounded-lg"
              placeholder="House/Floor No, Building name or Street, Locality"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="" className="font-semibold">
              Buyer's Pincode <span className="text-red-500">*</span>
            </label>
            <input
              name="pincode"
              onChange={(e) => handleNestedChange("buyer", e)}
              value={orderData?.buyer?.pincode}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Enter Buyer's Pincode"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-5 my-4  ">
          <div>
            <label htmlFor="" className="font-semibold">
              Landmark
            </label>
            <input
              name="landmark"
              onChange={(e) => handleNestedChange("buyer", e)}
              value={orderData?.buyer?.landmark}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Landmark"
            />
          </div>

          <div>
            <label htmlFor="" className="font-semibold">
              Buyer's City
            </label>
            <input
              name="city"
              onChange={(e) => handleNestedChange("buyer", e)}
              value={orderData?.buyer?.city}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Buyer's City"
            />
          </div>

          <div>
            <label htmlFor="" className="font-semibold">
              Buyer's State
            </label>
            <input
              name="state"
              onChange={(e) => handleNestedChange("buyer", e)}
              value={orderData?.buyer?.state}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Buyer's State"
            />
          </div>

          <div>
            <label htmlFor="" className="font-semibold">
              Buyer's Country
            </label>
            <input
              name="country"
              onChange={(e) => handleNestedChange("buyer", e)}
              value={orderData?.buyer?.country}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Buyer's Country"
            />
          </div>
        </div>
      </div>
      {/* buyer address */}
      <hr />
      {/* product details */}
      <div className="my-4">
        <h3>Product Details</h3>
        <p>What is/are the product being shipped?</p>
        <div className="flex gap-5 ">
          <div className="flex-1">
            <label htmlFor="" className="font-semibold">
              Product Name
            </label>
            <input
              name="pname"
              value={product.pname}
              onChange={productHandler}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Product Name"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="" className="font-semibold">
              Category
            </label>
            <input
              name="category"
              value={product.category}
              onChange={productHandler}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Select Category"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="" className="font-semibold">
              SKU
            </label>
            <input
              name="sku"
              value={product.sku}
              onChange={productHandler}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Buyer's Country"
            />
          </div>
        </div>
        <div className="flex gap-5 ">
          <div className="flex-1">
            <label htmlFor="" className="font-semibold">
              HSN Code
            </label>
            <input
              name="hsn"
              value={product.hsn}
              onChange={productHandler}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="HSN Code"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="" className="font-semibold">
              Quantity
            </label>
            <input
              name="quantity"
              value={product.quantity}
              onChange={productHandler}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Quantity"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="" className="font-semibold">
              Unit Price
            </label>
            <input
              name="price"
              value={product.price}
              onChange={productHandler}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Unit Price"
            />
          </div>
        </div>
        <button
          className="px-3 py-1 my-3 rounded bg-[#a78bfa] text-white"
          type="button"
          onClick={addProduct}
        >
          {editIndex !== null ? "Update Product" : "Add Product"}
        </button>
      </div>{" "}
      {productOrders?.map((po: any, index: any) => (
        <div
          key={index}
          className="max-w-md bg-[#475569] text-white rounded-xl my-4"
        >
          {/* Header */}
          <div className="top flex mx-1 pt-2">
            <p className="font-bold">{po.product?.pname}</p>

            <div className="ml-auto">
              <button
                className="mx-2 text-blue-400"
                onClick={() => {
                  setEditIndex(index);
                  setProduct({
                    pname: po.product.pname,
                    category: po.product.category || "",
                    sku: po.product.sku,
                    hsn: po.product.hsn.toString(),
                    quantity: po.quantity.toString(),
                    price: po.unitPrice.toString(),
                  });
                }}
              >
                Edit
              </button>

              <button
                className="text-red-400"
                onClick={() => {
                  setProductOrders((prev) =>
                    prev.filter((_, i) => i !== index)
                  );

                  if (editIndex === index) {
                    setEditIndex(null);
                    setProduct({
                      pname: "",
                      category: "",
                      sku: "",
                      hsn: "",
                      quantity: "",
                      price: "",
                    });
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="border border-white my-1"></div>

          {/* Category (using SKU / HSN as placeholder) */}
          <div className="top flex px-2">
            <p className="font-light">SKU</p>
            <p className="ml-auto font-light">{po.product?.sku}</p>
          </div>

          {/* Quantity */}
          <div className="top flex px-2">
            <p className="font-light">Quantity</p>
            <p className="ml-auto font-light">{po.quantity}</p>
          </div>

          {/* Price */}
          <div className="top flex px-2">
            <p className="font-light">Price</p>
            <p className="ml-auto font-light">₹ {po.unitPrice}</p>
          </div>

          <div className="border border-white my-1"></div>

          {/* Total */}
          <div className="top flex px-2.5 py-2">
            <p className="font-bold">Total</p>
            <p className="ml-auto font-bold">₹ {po.totalPrice}</p>
          </div>
        </div>
      ))}
      {/* product end */}
      <div className="my-5">
        <h3 className="font-extrabold">Package Details</h3>
        <p className="font-bold mb-4">
          How much weight does your package contain?
        </p>
        <div className="flex gap-5">
          <div className="flex-1">
            <label htmlFor="" className="font-semibold">
              Physical Weight
            </label>
            <div className="flex items-center">
              <span className="bg-white py-1.5 px-2 border text-black">Kg</span>
              <input
                name="physicalWeight"
                value={orderData.package?.physicalWeight}
                onChange={(e) => handleNestedChange("package", e)}
                type="text"
                className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-r-lg"
                placeholder="0.00"
              />
            </div>
            <div className="text-gray-500 font-medium text-xs">
              <h3>(Max 3 digits after the decimal place)</h3>
              <p>Note: The minimum chargeable weight is 0.50 Kg</p>
            </div>
          </div>
          <div className="flex-1">
            <div>
              <label htmlFor="" className="font-semibold">
                Enter package dimensions (L*B*H) to calculate volumetric weight
              </label>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center">
                <span className="bg-white py-1.5 px-2 border text-black">
                  CM
                </span>

                <input
                  name="length"
                  value={orderData.package?.length}
                  onChange={(e) => handleNestedChange("package", e)}
                  type="text"
                  className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-r-lg"
                  placeholder="length"
                />
              </div>
              <div className="flex items-center">
                <span className="bg-white py-1.5 px-2 border text-black">
                  CM
                </span>

                <input
                  name="breadth"
                  value={orderData.package?.breadth}
                  onChange={(e) => handleNestedChange("package", e)}
                  type="text"
                  className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-r-lg"
                  placeholder="breadth"
                />
              </div>
              <div className="flex items-center">
                <span className="bg-white py-1.5 px-2 border text-black">
                  CM
                </span>

                <input
                  name="height"
                  value={orderData.package?.height}
                  onChange={(e) => handleNestedChange("package", e)}
                  type="text"
                  className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-r-lg"
                  placeholder="height"
                />
              </div>
            </div>
            <div className="text-gray-500 font-medium text-xs">
              <p>
                Note: Dimensions should be in centimeters only & values should
                be greater than 0.50 cm
              </p>
            </div>
          </div>

          {/* end pachage details */}
        </div>
        {isValid && (
          <div className="flex w-full text-center gap-2 flex-wrap">
            <div className="p-2 bg-pink-200 text-black flex-1 rounded-lg w-full min-w-60">
              <h1>Volumetric Weight: {volumetricWeight} kg</h1>
            </div>
            <div className="p-2 bg-green-200 text-black flex-1 rounded-lg w-full min-w-60">
              <h1>Applicable Weight: {applicableWeight} kg</h1>
            </div>
          </div>
        )}
        {/* <div className="my-6">
            <h3 className="font-extrabold">Dangerous Goods</h3>
            <p className="font-bold">
              Indicate whether the order contains any dangerous goods
            </p>
            <div className="space-x-3 my-3">
              <input type="radio" name="" value={"yes"} />
              <label htmlFor="">Yes</label>
              <input type="radio" />
              <label htmlFor="">No</label>
            </div> */}
        <div className="my-6">
          <h3 className="font-extrabold">Dangerous Goods</h3>
          <p className="font-bold">
            Indicate whether the order contains any dangerous goods
          </p>

          <div className="flex gap-6 my-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                // value={orderData.dangerous}
                name="dangerous"
                checked={orderData?.dangerous === true}
                onChange={() =>
                  setOrderData((prev: any) => ({ ...prev, dangerous: true }))
                }
              />
              Yes
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="dangerousGoods"
                // value={orderData?.dangerous}
                checked={orderData?.dangerous === false}
                onChange={() =>
                  setOrderData((prev: any) => ({ ...prev, dangerous: false }))
                }
              />
              No
            </label>
          </div>

          {/* </div> */}
        </div>
        <div className="my-6">
          <h3 className="font-extrabold">Payment Method</h3>
          <p className="font-bold">
            Select Mode of Payment that your buyer has chosen for the order
          </p>
          <div className="space-x-4 my-3 flex">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="PREPAID"
                // value={orderData.payment}
                checked={orderData?.payment === "PREPAID"}
                onChange={handleChange}
              />
              Prepaid
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="COD"
                // value={orderData.payment}
                checked={orderData?.payment === "COD"}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>
          </div>
        </div>
        {/* closing radio btns */}
        {/* <div className="max-w-6xl bg-white text-black my-8 flex p-2 ">
            <p className="font-semibold">Total Order Value</p>
            {/* <input
              className="font-bold ml-auto"
              contentEditable
              value={"₹ 200"}
            ></input> */}
        {/* </div> */}
        <div className="max-w-6xl bg-white text-black my-8 flex items-center p-3 rounded-lg">
          <p className="font-semibold">Total Order Value</p>

          <input
            type="number"
            className="ml-auto w-40 border border-gray-400 px-2 py-1 rounded text-right"
            name="totalOrderValue"
            value={orderData?.totalOrderValue || ""}
            onChange={handleChange}
          />
        </div>

        <div className="flex">
          <div></div>
          <div className="ml-auto mr-4">
            <button
              className="mx-4 px-4 py-2 bg-white text-black rounded-lg"
              onClick={updateOrder}
            >
              Update
            </button>
            <button className="mx-4 px-4 py-2 bg-red-500 rounded-lg text-white">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div> //root div
  );
}
