import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderDetailView from "../../../shared/components/OrderDetailView";

import { listOrders } from "../../services/orderService";

export default function AdminOrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let alive = true;

    const loadOrder = async () => {
      try {
        const orders = await listOrders();

        const found = orders.find(
          o => String(o._id || o.id) === String(orderId)
        );

        if (alive) setOrder(found || null);
      } catch (err) {
        console.error("Failed to load order", err);
        if (alive) setOrder(null);
      }
    };

    loadOrder();

    return () => {
      alive = false;
    };
  }, [orderId]);

  return <OrderDetailView order={order} role="admin" />;
}