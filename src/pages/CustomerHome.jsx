import { useState, useEffect, useMemo } from "react";
import { itemsAPI, categoriesAPI, tablesAPI, ordersAPI } from "../services/api";
import { toast } from "react-hot-toast";

import Header from "../components/home/Header";
import BannerSlider from "../components/home/BannerSlider";
import PopularSlider from "../components/home/PopularSlider";
import CategoryFilter from "../components/home/CategoryFilter";
import ItemCard from "../components/home/ItemCard";
import CartDrawer from "../components/home/CartDrawer";
import CheckoutForm from "../components/home/CheckoutForm";
import PaymentModal from "../components/home/PaymentModal";
import OrderSuccess from "../components/home/OrderSuccess";

import { ShoppingCart } from "lucide-react";

export default function CustomerHome() {
  // ---------------- DATA STATE ----------------
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);

  // ---------------- CART STATE ----------------
  const [cart, setCart] = useState([]);

  // ---------------- UI STATE ----------------
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [orderStatus, setOrderStatus] = useState("idle");

  // ---------------- CHECKOUT STATE ----------------
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    table: "",
  });

  const [orderType, setOrderType] = useState("dine-in");

  // ---------------- ORDER DATA ----------------
  const [currentOrder, setCurrentOrder] = useState(null);

  // ---------------- LOAD CART FROM STORAGE ----------------
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // ---------------- SAVE CART ----------------
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [itemsRes, catRes, tableRes] = await Promise.all([
        itemsAPI.getAll(),
        categoriesAPI.getAll(),
        tablesAPI.getAll(),
      ]);

      setItems(itemsRes.data || []);
      setCategories(catRes.data || []);
      setTables((tableRes.data || []).filter((t) => t.status === "available"));
    } catch (err) {
      console.error(err);
      setError("Failed to load menu");
      toast.error("Failed to load menu data");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FILTER ITEMS ----------------
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat =
        activeCat === "All" || item.category?._id === activeCat;

      const matchesType = !typeFilter || item.type === typeFilter;

      const matchesSearch =
        !search ||
        item.name?.toLowerCase().includes(search.toLowerCase());

      return matchesCat && matchesType && matchesSearch;
    });
  }, [items, activeCat, typeFilter, search]);

  // ---------------- CART TOTALS ----------------
  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    const taxRate = 0.05;
    const tax = subtotal * taxRate;

    return {
      subtotal,
      tax,
      total: subtotal + tax,
    };
  }, [cart]);

  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.qty, 0),
    [cart]
  );

  // ---------------- CART ACTIONS ----------------
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);

      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });

    toast.success(`${item.name} added to cart`);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, qty: item.qty + delta }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // ---------------- PLACE ORDER ----------------
  const handlePlaceOrder = async () => {
    if (orderStatus === "loading") return;

    if (!customerInfo.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (orderType === "dine-in" && !customerInfo.table) {
      toast.error("Please select a table");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setOrderStatus("loading");

    try {
      const orderData = {
        customerName: customerInfo.name.trim(),
        phone: customerInfo.phone.trim(),
        table: orderType === "dine-in" ? customerInfo.table : null,
        orderType: orderType,

        items: cart.map((item) => ({
          item: item._id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
        })),

        subtotal: cartTotals.subtotal,
        taxAmount: cartTotals.tax,
        totalAmount: cartTotals.total,

        paymentMethod: "cash",
        paymentStatus: "pending",
      };

      const response = await ordersAPI.create(orderData);

      setCurrentOrder(response.data || response);

      setOrderStatus("success");

      setCart([]);

      setCustomerInfo({
        name: "",
        phone: "",
        table: "",
      });

      setIsCartOpen(false);

      toast.success("Order placed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
      setOrderStatus("idle");
    }
  };

  // ---------------- LOADING UI ----------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // ---------------- ERROR UI ----------------
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
      <Header search={search} setSearch={setSearch} />

      <main className="max-w-2xl mx-auto p-4">
        <BannerSlider />

        <PopularSlider items={items} />

        {/* Sticky Category */}
        <div className="sticky top-0 z-30 bg-gray-50 py-2">
          <CategoryFilter
            categories={categories}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />
        </div>

        {/* Items */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No items found</p>
              <p className="text-sm text-gray-400">
                Try changing category or search
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} onAdd={addToCart} />
            ))
          )}
        </div>
      </main>

      {/* Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-md z-40">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Total (incl GST)</p>
              <p className="text-xl font-bold">
                ₹{cartTotals.total.toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              View Cart ({totalItems})
            </button>
          </div>
        </div>
      )}

      {/* CART */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        cartTotals={cartTotals}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        onCheckout={() => setIsPaymentOpen(true)}
      />

      {/* PAYMENT */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={cartTotals.total}
        orderData={{
          customerName: customerInfo.name,
          phone: customerInfo.phone,
          table: customerInfo.table,
          orderType: orderType,
        }}
        onPaymentSuccess={() => {
          setIsPaymentOpen(false);
          handlePlaceOrder();
        }}
      />

      {/* CHECKOUT */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="relative bg-white w-full max-w-md rounded-t-2xl shadow-xl p-6">
            <CheckoutForm
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
              tables={tables}
              orderType={orderType}
              setOrderType={setOrderType}
              onSubmit={() => setIsPaymentOpen(true)}
              loading={orderStatus === "loading"}
            />
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {orderStatus === "success" && currentOrder && (
        <OrderSuccess
          order={currentOrder}
          onHome={() => {
            setOrderStatus("idle");
            setCurrentOrder(null);
          }}
        />
      )}
    </div>
  );
}