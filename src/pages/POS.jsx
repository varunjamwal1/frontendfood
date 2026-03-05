import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { itemsAPI, tablesAPI, ordersAPI } from "../services/api";

import ItemsPanel from "../components/staffDashboard/ItemsPanel";
import CartPanel from "../components/staffDashboard/CartPanel";
import CustomerModal from "../components/staffDashboard/CustomerModal";

const round = (num) => Number(num.toFixed(2));

export default function POS({ setReceipt }) {
  const { user } = useContext(AuthContext);
  const { cart, clearCart, subtotal, tax, total } = useCart();

  const [items, setItems] = useState([]);
  const [tables, setTables] = useState([]);

  const [orderType, setOrderType] = useState("dine-in");
  const [selectedTable, setSelectedTable] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsRes, tableRes] = await Promise.all([
          itemsAPI.getAll(),
          tablesAPI.getAll(),
        ]);

        setItems(itemsRes.data || []);
        setTables(tableRes.data || []);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const resetOrder = () => {
    clearCart();
    setSelectedTable("");
    setCustomerName("");
    setCustomerPhone("");
    setOrderType("dine-in");
  };

  const handleOrder = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    if (orderType === "dine-in" && !selectedTable)
      return toast.error("Select table");

    try {
      setPlacingOrder(true);

      const orderData = {
        orderType,
        customerName,
        phone: customerPhone,
        table: orderType === "dine-in" ? selectedTable : null,
        items: cart.map((item) => ({
          item: item._id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
        })),
        subtotal: round(subtotal),
   
        totalAmount: round(total),
        paymentMethod: "cash",
        paymentStatus: "paid",
        createdBy: user?.id,
      };

      const { data } = await ordersAPI.create(orderData);

      toast.success("Order placed!");
      setReceipt(data);
      resetOrder();
    } catch {
      toast.error("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-900 text-white">
      <ItemsPanel items={items} loading={loading} />

      <CartPanel
        orderType={orderType}
        setOrderType={setOrderType}
        tables={tables}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        total={round(total)}
        placingOrder={placingOrder}
        cart={cart}
        openCustomerModal={() => setShowCustomerModal(true)}
      />

      {showCustomerModal && (
        <CustomerModal
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          close={() => setShowCustomerModal(false)}
          confirm={handleOrder}
        />
      )}
    </div>
  );
}