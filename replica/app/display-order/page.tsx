"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  id: string;
  createdAt: string;
  totalOrderValue: number;
  payment: string;
  status: string;
  buyer: {
    name: string;
    number: string;
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [orderId, setOrderId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔁 Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (orderId) params.append("orderId", orderId);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    const res = await fetch(`/api/create-order`);
    const data = await res.json();

    setOrders(Array.isArray(data) ? data : [data]);
    setLoading(false);
  };

  const filterHandler= async()=>{
    setLoading(true);

    const params = new URLSearchParams();
    if (orderId) params.append("orderId", orderId);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    const res = await fetch(`/api/orders?${params.toString()}`);
    const data = await res.json();

    setOrders(Array.isArray(data) ? data : [data]);
    setLoading(false);
  }

  // 🔹 Fetch ALL orders on page load
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#24303f] text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Orders</h1>
          <Link
            href="/create-order"
            className="ml-auto px-4 py-2 bg-[#a78bfa] rounded text-black font-semibold"
          >
            + Create Order
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-[#1d2a39] p-4 rounded-lg mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="px-3 py-2 rounded bg-[#24303f] border border-gray-500 w-full md:w-60"
          />

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 rounded bg-[#24303f] border border-gray-500"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 rounded bg-[#24303f] border border-gray-500"
          />

          <button
            onClick={filterHandler}
            className="px-4 py-2 bg-[#a78bfa] text-black rounded font-semibold"
          >
            Search
          </button>

          <button
            onClick={() => {
              setOrderId("");
              setFromDate("");
              setToDate("");
              fetchOrders();
            }}
            className="px-4 py-2 bg-gray-500 rounded"
          >
            Reset
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-[#1d2a39] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#334155]">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Buyer</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    No orders found
                  </td>
                </tr>
              )}

              {!loading &&
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-700 hover:bg-[#24303f]"
                  >
                    <td className="p-3 font-mono">{order.id}</td>
                    <td className="p-3">
                      <p className="font-semibold">{order.buyer.name}</p>
                      <p className="text-xs text-gray-400">
                        {order.buyer.number}
                      </p>
                    </td>
                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">{order.payment}</td>
                    <td className="p-3 font-semibold">
                      ₹ {order.totalOrderValue}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded bg-green-600 text-xs">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-[#a78bfa]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
