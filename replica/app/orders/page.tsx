"use client";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Orders() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false)
  const [orderId, setOrderId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchOrders = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (orderId) params.append("orderId", orderId);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    // const res = await fetch(`/api/create-order?${params.toString()}`);
    const res = await fetch(`/api/create-order`);
    const data = await res.json();

    setOrders(Array.isArray(data) ? data : [data]);
    setLoading(false);
  };

  const searchByOrderId = async () => {
    // setLoading(true);
    setSearching(true)
    console.log("in search");
    
    const params = new URLSearchParams();
    if (orderId) params.append("orderId", orderId);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    console.log(params);
    // params ? const res = await fetch(`/api/create-order?${params.toString()}`) :const res = await fetch(`/api/create-order`);
    // const res = await fetch(`/api/create-order?${params.toString()}`);
    // const data = await res.json();

    
    // setOrders(Array.isArray(data) ? data : [data]);
    // setLoading(false);
  };

  const editHandler =()=>{

  }
  useEffect(() => {
    fetchOrders();
    fetch(`/api/orders?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.data);
        setTotalPages(data.pagination.totalPages);
      });
    // fetchOrders();
  }, [page]);
  return (
    <div className=" ml-16 bg-[#1a222c] text-white max-w-8xl mr-4">
      <div className="flex items-center w-full">
        <h3 className="text-lg font-semibold">Forward Orders</h3>

        <div className="ml-220 flex gap-4">
          <button className="px-3 py-1 rounded bg-blue-500 text-white">
            <Link href={"/create-order"}>Add Orders</Link>
          </button>
          <button className="px-3 py-1 rounded bg-blue-500 text-white">
            Sync Orders
          </button>
          <button className="px-3 py-1 rounded bg-blue-500 text-white">
            Download Orders
          </button>
        </div>
      </div>

      <div className="mt-14 flex flex-col justify-between items-center gap-4 w-full">
        <div className="relative w-full flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center group">
          <select name="filterType" className="h-10 bg-[#24303f] text-white">
            <option value="">Order Id</option>
            <option value="">AWb number</option>
            <option value="">Phone no</option>
            <option value="">Custom order id</option>
          </select>
          <div className="flex relative w-full">
            <input
              type="text"
              className="border w-full  h-10"
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value)
                setSearching(true)
              }}
            />
            {/* <button className="">Clear</button>*/}
            <button className="">
              <Search
                className="absolute right-4 bottom-2"
                onClick={searchByOrderId}
              ></Search>
            </button>

            
            {searching &&
            <button
            onClick={() => {
              setOrderId("");
              setFromDate("");
              setToDate("");
              fetchOrders();
              setSearching(false)
            }}
            className="px-4 py-2 bg-gray-500 rounded absolute right-12 "
          >
            Reset
          </button>
            
            }
            
          </div>
          {/* 
          <div className="border w-full flex space-x-5 justify-center items-center">
            <button className="bg-black text-white p-2 rounded-lg">
              Download
            </button>
            <button className="bg-blue-400 text-white py-2 px-4 rounded-lg">
              Filters
            </button>
            <button className="bg-slate-600 py-2 px-4 rounded-lg">
              Bulk Actions
            </button>
          </div> */}
        </div>

        {/* <div className="flex justify-between w-full">
          <div className="all rounded-2xl bg-blue-200">
            ALL <span>0</span>
          </div>
          <div className="all bg-black text-white rounded-2xl">
            NEW <span>0</span>
          </div>
          <div className="all  bg-black text-white rounded-2xl">
            READY TO SHIP<span>0</span>
          </div>
          <div className="all  bg-black text-white rounded-2xl">
            MOVE TO SHIP <span>0</span>
          </div>
          <div className="all  bg-black text-white rounded-2xl">
            IN TRANSIT <span>0</span>
          </div>
          <div className="all  bg-black text-white rounded-2xl">
            OUT FOR DELHIVERY <span>0</span>
          </div>
          <div className="all  bg-black text-white rounded-2xl">
            DELIVERED <span>0</span>
          </div>
          <div className="all  bg-black text-white rounded-2xl">
            FAILED DELIVERY <span>0</span>
          </div>
          <div className="all  bg-black text-white rounded-2xl">
            RTO <span>0</span>
          </div>
          <div className="all  bg-black text-white rounded-2xl">
            RTO OUT FOR DELHIVERY <span>0</span>
          </div>
          <div className="all  bg-black text-white rounded-2xl">
            CANCELLED <span>0</span>
          </div>
        </div> */}
      </div>

      {/* <div className="bg-[#24303f]">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <p className="p-3 text-left">Order ID</p>
            <p className="p-3 text-left">Order Details</p>
            <p className="p-3 text-left">Customer Details</p>
            <p className="p-3 text-left">Payment</p>
            <p className="p-3 text-left">Package Details</p>
            <p className="p-3 text-left">Pickup </p>
            <p className="p-3 text-left">RTO </p>
            <p className="p-3 text-left">Shipping Details</p>
            <p className="p-3 text-left">status </p>
          </div>
        </div>
      </div> */}
      <div className="h-screen">
        <div className="grid grid-cols-10 w-full items-center p-4">
          <p className="grid-cols-1">Order ID</p>
          <p className="grid-cols-1">Order Details</p>
          <p className="grid-cols-1">Customer Details</p>
          <p className="grid-cols-1">Payment</p>
          <p className="grid-cols-1">Package Details</p>
          <p className="grid-cols-1">Pickup </p>
          <p className="grid-cols-1">RTO </p>
          <p className="grid-cols-1">Shipping Details</p>
          <p className="grid-cols-1">Status </p>
          <p className="grid-cols-1">Action </p>
        </div>

        {orders.map((order) => (
          <div key={order.id} className="bg-[#24303f] grid grid-cols-10 p-5">
            {/* <div className="w-full"> */}
            {/* <div className="flex items-center justify-between"> */}
            <p className="grid-cols-1">{order.id}</p>
            <p className="grid-cols-1">{order.productOrders?.product?.pname}</p>
            <p className="grid-cols-1">{order.buyer?.name}</p>
            <p className="grid-cols-1">{order.payment}</p>
            <p className="grid-cols-1">{order.package?.applicableWeight}</p>
            <p className="grid-cols-1">{order.pickupAddress?.tag} </p>
            <p className="grid-cols-1">{order.rtoAddress?.tag}</p>
            <p className="grid-cols-1">"NA"</p>
            <p className="grid-cols-1">{order.status}</p>
            <p className="grid-cols-1">
              <button className="bg-blue-500 px-2 grid-cols-1" ><Link href={{pathname:"/update-order",query:{orderId:order.id}}}>edit</Link></button>
            </p>
            {/* </div> */}
            {/* </div> */}
          </div>
        ))}
      </div>

      {/* pagination */}
      <div className="flex justify-center items-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
