import React, { useEffect, useState } from "react";
import axios from "axios";

const AllPayments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/pay/getAllUserPayments");
        setOrders(response.data.userPayments);
        console.log(response.data.userPayments);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">ALL PAYMENTS</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{order.amount}</h2>
            <h2 className="text-xl font-semibold mb-2">DATE:{order.date}</h2>
            <p className="text-gray-700">Email: {order.user.email}</p>
            <p className="text-gray-700">id: {order.user._id}Rs</p>
            {/* <p className="text-gray-700">Status: {order.status}</p> */}
            {/* <p className="text-gray-700">Quantity: {order.quantity}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPayments;