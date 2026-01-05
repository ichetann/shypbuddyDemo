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
  const [pickupAddress, setPickupAddress] = useState(null);
  const [addresses, setAddresses] = useState<any[]>([]); //its pickup and rto address
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
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
  const [product, setProduct] = useState<any>({
    name: "",
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

  const l = Number(packageDetails.length);
  const b = Number(packageDetails.breadth);
  const h = Number(packageDetails.height);
  const pw = Number(packageDetails.physicalWeight);
  const isValid: boolean =
    Number(l) > 0.5 && Number(b) > 0.5 && Number(h) > 0.5;
  const volumetricWeight = isValid
    ? ((Number(l) * Number(b) * Number(h)) / 5000).toFixed(2)
    : null;

    

  const applicableWeight = Math.max(Number(pw), Number(volumetricWeight));

  const buyerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setBuyer((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    console.log(buyer);
  };
  const addressHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setBuyerAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    console.log(buyerAddress);
  };
  const productHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(product);
  };

  const addProduct = () => {
    if (!product.name || !product.quantity || !product.price) {
      alert("Product name, quantity and price are required");
      return;
    }

    setProducts((prev) => [
      ...prev,
      {
        ...product,
        category: product.category,
        quantity: Number(product.quantity),
        price: Number(product.price),
        total: Number(product.quantity) * Number(product.price),
      },
    ]);

    console.log(products);

    setProduct({
      name: "",
      category: "",
      sku: "",
      hsn: "",
      quantity: "",
      price: "",
    });
  };

  const packageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPackageDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(packageDetails);
    // console.log();
  };

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       fetchAddresses(search);
  //     }, 500);

  //     return () => clearTimeout(timer);
  //   }, [search]);

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
  const updateOrder = () => {};

  const fetchOrders = async () => {
    const res = await fetch(`/api/create-order?orderId=${id}`);
    const data = await res.json();
    console.log(data);
    setOrderData(data);
  };
  useEffect(() => {
    // const data;
    fetchOrders();
  }, []);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  setOrderData((prev: any) => ({
    ...prev,
    [name]: value,
  }));
};


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
          value={
            // selectedAddress
            //   ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}, ${selectedAddress.country}`
            //   : search
            orderData.pickupAddress
              ? `${orderData?.pickupAddress?.street}, ${orderData?.pickupAddress?.city}, ${orderData?.pickupAddress?.state} - ${orderData?.pickupAddress?.pincode}, ${orderData?.pickupAddress?.country}`
              : search
          }
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
                  console.log(addr.id);

                  //   setPickupId(addr.id)
                  setSearch("");
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
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            className=" border-gray-300 bg-white rounded-lg"
          />
          RTO (Return To Origin) Address is same as PickUp Address
        </label>
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
              onChange={handleChange}
              value={orderData?.buyer?.name}
              type="text"
              className="w-full border border-gray-500 p-1 my-2 bg-[#1d2a39] rounded-lg"
              placeholder="Enter Buyer's Name"
            />
          </div>
          <div className="">
            <label htmlFor="">Buyer's Number</label>
            <input
              name="mobileNo"
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              name="buyer.street"
              value={orderData?.buyer?.street}
              onChange={addressHandler}
              className="w-full border border-gray-500 p-1 my-2  bg-[#1d2a39] rounded-lg"
              placeholder="House/Floor No, Building name or Street, Locality"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="" className="font-semibold">
              Buyer's Pincode <span className="text-red-500">*</span>
            </label>
            <input
              name="buyerPincode"
              onChange={addressHandler}
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
              name="buyerLandmark"
              onChange={addressHandler}
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
              name="buyerCity"
              onChange={addressHandler}
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
              name="buyerState"
              onChange={addressHandler}
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
              name="buyerCountry"
              onChange={addressHandler}
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
              name="name"
              value={product.name}
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
          Add Product
        </button>
      </div>{" "}
      {orderData?.productOrders?.map((po, index) => (
        <div
          key={po.productId}
          className="max-w-md bg-[#475569] text-white rounded-xl my-4"
        >
          {/* Header */}
          <div className="top flex mx-1 pt-2">
            <p className="font-bold">{po.product?.pname}</p>

            <div className="ml-auto">
              <button
                className="mx-2 text-red-400"
                onClick={() => {
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
                className="ml-auto text-red-400"
                onClick={() =>
                  setProducts((prev) => prev.filter((_, i) => i !== index))
                }
              >
                delete
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
                <span className="bg-white py-1.5 px-2 border text-black">
                  Kg
                </span>
                <input
                  name="physicalWeight"
                  value={orderData.package?.physicalWeight}
                  onChange={packageHandler}
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
                  Enter package dimensions (L*B*H) to calculate volumetric
                  weight
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
                    onChange={packageHandler}
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
                    onChange={packageHandler}
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
                    onChange={packageHandler}
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
                  value={orderData.dangerous}
                  name="dangerousGoods"
                  checked={dangerousGoods === true}
                  onChange={() => setDangerousGoods(true)}
                />
                Yes
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dangerousGoods"
                  value={orderData.dangerous}
                  checked={dangerousGoods === false}
                  onChange={() => setDangerousGoods(false)}
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
                  name="paymentMethod"
                //   value="PREPAID"
                value={orderData.payment}
                  checked={paymentMethod === "PREPAID"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as "PREPAID")
                  }
                />
                Prepaid
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                //   value="COD"
                value={orderData.payment}
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value as "COD")}
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
              value={orderTotal}
              onChange={(e) => setOrderTotal(Number(e.target.value))}
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
