"use client";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import OrderActions from "../(orders)/OrderActions";
import { deleteOrder } from "../actions/orders";
import { cancelDelhiveryShipment, createDelhiveryShipment, createDelhiveryWarehouse } from "../actions/delhivery";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";

interface Filters {
  startDate: string;
  endDate: string;
  hsn: string;
  sku: string;
  addressTag: string;
}

export default function Orders() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const router= useRouter()

  const [filters, setFilters] = useState<Filters>({
    startDate: "",
    endDate: "",
    hsn: "",
    sku: "",
    addressTag: "",
  });

  // For showing count on filter button
  const appliedFiltersCount = Object.values(filters).filter(Boolean).length;

  // Reset to page 1 whenever filters change
  useEffect(() => {
    fetchOrders(filters, 1); // Always go back to page 1 when applying new filters
  }, [filters]);

  const shipHandler= async(orderId:string)=>{
    console.log("in shiphandler");
    
    const warehouseRes=await createDelhiveryWarehouse(orderId);
    console.log("warehous res",warehouseRes);
    

    // if (!warehouseRes.success) {
        if (warehouseRes.success) {
          toast.success("Warehouse Created Sucessfully");
          const shipmentResponse = await createDelhiveryShipment(orderId);
          console.log(shipmentResponse);
          toast.success("Shipment Created Sucessfully");
        }else{
          console.log("something went wrong");  
          toast.error("something went wrong in warehouse creation");

        }
      
    // createDelhiveryShipment(orderId);
    fetchOrders(filters, 1)
    // redirect('/orders')
  }

  const fetchOrders = async (
    filters: Filters = {
      startDate: "",
      endDate: "",
      hsn: "",
      sku: "",
      addressTag: "",
    },

    newPage: number = page
  ) => {
    setLoading(true);

    // const isShipped = orders?.status === "READY_TO_SHIP";
    try {
      const params = new URLSearchParams();

      // Now TypeScript is 100% happy — no more "property does not exist" errors
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);
      if (filters.hsn) params.append("hsn", filters.hsn.trim());
      if (filters.sku) params.append("sku", filters.sku.trim());
      if (filters.addressTag)
        params.append("address_tag", filters.addressTag.trim());

      params.append("page", page.toString());
      params.append("limit", limit.toString());
      console.log(params);
      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();

      setOrders(data.orders || []);
      setTotalPages(data.pagination?.totalPages || 1); // ← THIS IS KEY
      setPage(newPage); // ← Update page state only after success
    } catch (err) {
      console.error(err);
      // toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // const fetchOrders = async () => {
  //   try {
  //     setLoading(true);

  //     const params = new URLSearchParams();
  //     if (orderId) params.append("orderId", orderId);
  //     if (fromDate) params.append("fromDate", fromDate);
  //     if (toDate) params.append("toDate", toDate);

  //     const res = await fetch(`/api/create-order?${params.toString()}`);
  //     // if (filters.startDate) params.append("start_date", filters.startDate);
  //     // if (filters.endDate) params.append("end_date", filters.endDate);
  //     // if (filters.hsn) params.append("hsn", filters.hsn);
  //     // if (filters.sku) params.append("sku", filters.sku);
  //     // if (filters.addressTag) params.append("address_tag", filters.addressTag);

  //     // const res = await fetch(`/api/orders?${params.toString()}`);
  //     const data = await res.json();

  //     setOrders(Array.isArray(data) ? data : [data]);
  //     setLoading(false);
  //   } catch (err) {
  //     // toast.error("Failed to fetch orders");
  //     console.log("Failed to fetch orders");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const searchByOrderId = async () => {
    // setLoading(true);
    setSearching(true);
    console.log("in search");

    const params = new URLSearchParams();
    if (orderId) params.append("orderId", orderId);
    // if (fromDate) params.append("fromDate", fromDate);
    // if (toDate) params.append("toDate", toDate);

    console.log(params);
    // params ? const res = await fetch(`/api/create-order?${params.toString()}`) :const res = await fetch(`/api/create-order`);
    const res = await fetch(`/api/create-order?${params.toString()}`);
    const data = await res.json();

    setOrders(Array.isArray(data) ? data : [data]);
    setLoading(false);
  };

  const editHandler = () => {};
  useEffect(() => {
    fetchOrders();
    // fetch(`/api/orders?page=${page}&limit=${limit}`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setOrders(data.data);
    //     setTotalPages(data.pagination.totalPages);
    //   });
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
                setOrderId(e.target.value);
                setSearching(true);
              }}
            />
            {/* <button className="">Clear</button>*/}
            <button className="">
              <Search
                className="absolute right-4 bottom-2"
                onClick={searchByOrderId}
              ></Search>
            </button>

            {searching && (
              <button
                onClick={() => {
                  setOrderId("");
                  setFromDate("");
                  setToDate("");
                  fetchOrders();
                  setSearching(false);
                }}
                className="px-4 py-2 bg-gray-500 rounded absolute right-12 "
              >
                Reset
              </button>
            )}
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

        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg transition border border-gray-700"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
          {appliedFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ml-1">
              {appliedFiltersCount}
            </span>
          )}
        </button>

        {/* Right Sidebar Filter Drawer - DARK MODE */}
        <div
          className={`fixed inset-0 z-50 ${
            filterOpen ? "visible" : "invisible"
          }`}
        >
          {/* Backdrop */}
          <div
            onClick={() => setFilterOpen(false)}
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              filterOpen ? "opacity-70" : "opacity-0"
            }`}
          />

          {/* Sidebar - Dark Theme */}
          <div
            className={`absolute right-0 top-0 h-full w-96 bg-gray-900 shadow-2xl transition-transform duration-300 ${
              filterOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Filters</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Filters Body */}
            <div className="p-6 space-y-7 overflow-y-auto h-full pb-32 text-gray-300">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-200">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value })
                    }
                    className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value })
                    }
                    className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* HSN */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-200">
                  HSN
                </label>
                <input
                  type="text"
                  placeholder="Enter HSN code"
                  value={filters.hsn}
                  onChange={(e) =>
                    setFilters({ ...filters, hsn: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-200">
                  SKU
                </label>
                <input
                  type="text"
                  placeholder="Enter SKU"
                  value={filters.sku}
                  onChange={(e) =>
                    setFilters({ ...filters, sku: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* Address Tag */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-200">
                  Address Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Home, Office, Gift"
                  value={filters.addressTag}
                  onChange={(e) =>
                    setFilters({ ...filters, addressTag: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => {
                  setFilters({
                    startDate: "",
                    endDate: "",
                    hsn: "",
                    sku: "",
                    addressTag: "",
                  });
                  fetchOrders();
                  setFilterOpen(false);
                }}
                className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition font-medium"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  fetchOrders(filters);
                  setFilterOpen(false);
                }}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
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

        {orders?.map((order, index) => (
          <div key={index} className="bg-[#24303f] grid grid-cols-10 p-5">
            {/* <div className="w-full"> */}
            {/* <div className="flex items-center justify-between"> */}
            <p className="grid-cols-1">{order.id}</p>
            <p className="grid-cols-1">{order.productOrders?.product?.pname}</p>
            <p className="grid-cols-1">{order.buyer?.name}</p>
            <p className="grid-cols-1">{order.payment}</p>
            <p className="grid-cols-1">{order.package?.applicableWeight}</p>
            <p className="grid-cols-1">{order.pickupAddress?.tag} </p>
            <p className="grid-cols-1">{order.rtoAddress?.tag}</p>
            <p className="grid-cols-1">
              {((order.deliveryPartner || "no partner") && order.AWBNumber) ||
                "NA"}
            </p>
            <p className="grid-cols-1">{order.status}</p>
            <p className="grid-cols-1">
              {/* <button className="bg-blue-500 px-2 grid-cols-1">
                <Link
                  href={{
                    pathname: "/update-order",
                    query: { orderId: order.id },
                  }}
                >
                  edit
                </Link>
              </button> */}
              <button
                className={`mx-4 px-4 py-2
                  ${
                    order.status === "READY_TO_SHIP"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#7c3aed] rounded-lg"
                  }
                  `}
                type="button"
                disabled={order.status === "READY_TO_SHIP"}
                onClick={()=>shipHandler(order.id)}
              >
                Ship
              </button>
              <OrderActions
                orderId={order.id}
                status={order.status}
                onDelete={async () => {
                  if (confirm("Delete this order?")) {
                    await deleteOrder(order.id);
                  }
                }}
                onCancel={async () => {
                  if (!confirm("Cancel this shipment?")) return;

                  const res = await cancelDelhiveryShipment(order.id);

                  if (!res.success) {
                    toast.error("Cancellation failed");
                    return;
                  }

                  toast.success("Shipment cancelled");
                  fetchOrders(filters, page);
                }}
              />
            </p>
            {/* </div> */}
            {/* </div> */}
          </div>
        ))}
      </div>

      {/* pagination
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
      </div> */}

      {/* Pagination - Perfect & Beautiful */}
      <div className="flex justify-center items-center gap-6 mt-10 pb-10">
        <button
          onClick={() => fetchOrders(filters, page - 1)}
          disabled={page === 1 || loading}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-3">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => fetchOrders(filters, i + 1)}
              disabled={loading}
              className={`w-10 h-10 rounded-lg font-medium transition ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => fetchOrders(filters, page + 1)}
          disabled={page === totalPages || loading}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
        >
          Next →
        </button>
      </div>

      {/* Page info */}
      <div className="text-center text-gray-400 text-sm mb-6">
        Showing page <strong>{page}</strong> of <strong>{totalPages}</strong>(
        {orders.length} orders this page)
      </div>
    </div>
  );
}
