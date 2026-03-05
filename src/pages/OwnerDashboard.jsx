import { useState, useEffect, useContext } from "react";
import {
  itemsAPI,
  categoriesAPI,
  tablesAPI,
  ordersAPI,
  taxesAPI,
  authAPI, // ✅ Fixed Import
} from "../services/api";

import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Sidebar from "../components/dashboard/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import OrderHistory from "../components/Dashboard/OrderHistory"; // ✅ Import Earning History
import Modal from "../components/common/Modal";
import FormFields from "../components/common/FormFields";

import CategoryCard from "../components/dashboard/CategoryCard";
import ItemCard from "../components/dashboard/ItemCard";
import TableCard from "../components/dashboard/TableCard";
import TaxCard from "../components/dashboard/TaxCard";
import OrderCard from "../components/dashboard/OrderCard";
import StaffCard from "../components/dashboard/StaffCard";

import { Plus } from "lucide-react";

export default function OwnerDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [staff, setStaff] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
     setLoading(true);

const [
  statsRes,
  ordersRes,
  tablesRes,
  categoriesRes,
  itemsRes,
  taxesRes,
  staffRes
] = await Promise.all([
  ordersAPI.getStats(),
  ordersAPI.getAll(),
  tablesAPI.getAll(),
  categoriesAPI.getAll(),
  itemsAPI.getAll(),
  taxesAPI.getAll(),
  authAPI.getStaff(), // ✅ Correct method
]);;

      setStats(statsRes.data || {});
      setOrders((ordersRes.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setTables(tablesRes.data || []);
      setCategories(categoriesRes.data || []);
      setItems(itemsRes.data || []);
      setTaxes(taxesRes.data || []);
      setStaff(staffRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  // --- CRUD ---
  const openModal = (type, data = null) => {
    setModalType(type);
    setEditData(data);
    setFormData(data ? { ...data } : getInitialFormData(type));
    setShowModal(true);
  };

  const getInitialFormData = (type) => {
    switch (type) {
      case "item": return { name: "", price: "", category: "", type: "veg", description: "" };
      case "category": return { name: "" };
      case "table": return { name: "", capacity: "4" };
      case "tax": return { name: "", percentage: "" };
      case "staff": return { name: "", email: "", password: "", role: "staff" };
      default: return {};
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    try {
      setLoading(true);
      const apiMap = { category: categoriesAPI, item: itemsAPI, table: tablesAPI, tax: taxesAPI, staff:  authAPI };
      await apiMap[type].delete(id);
      toast.success("Deleted successfully");
      fetchAllData();
    } catch { toast.error("Delete failed"); } 
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiMap = { category: categoriesAPI, item: itemsAPI, table: tablesAPI, tax: taxesAPI, staff:  authAPI };
      const apiObj = apiMap[modalType];
      if (editData) { await apiObj.update(editData._id, formData); toast.success("Updated"); } 
      else { await apiObj.create(formData); toast.success("Created"); }
      setShowModal(false);
      fetchAllData();
    } catch (err) { toast.error(err.response?.data?.message || "Error"); } 
    finally { setLoading(false); }
  };

  if (loading && !showModal) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900"><div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-orange-500 rounded-full"></div></div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">

        {/* ================= DASHBOARD ================= */}
     {activeTab === "dashboard" && (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">
      Dashboard Overview
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <StatCard
        title="Total Revenue"
        value={stats.totalRevenue || 0}
        prefix="₹"
      />

      <StatCard
        title="Total Orders"
        value={stats.totalOrders || 0}
      />

      <StatCard
        title="Active Tables"
        value={tables.filter(t => t.status === "occupied").length}
        suffix={` / ${tables.length}`}
      />

      <StatCard
        title="Popular Item"
        value={stats.popularItem?.name || stats.popularItem || "N/A"}
      />

    </div>

    <DashboardCharts
      orders={orders || []}
      stats={stats || {}}
    />
  </div>
)}

        {/* ================= EARNING (HISTORY) ================= */}
        {activeTab === "earning" && (
          <OrderHistory /> // Shows Day/Month filters and stats
        )}

        {/* ================= ORDERS ================= */}
        {activeTab === "orders" && (
          <div className="mb-6">
             <h2 className="text-2xl font-bold mb-6  text-white">All Orders</h2>
             <div className="grid gap-4">
               {orders.map((order) => <OrderCard key={order._id} order={order} />)}
               {orders.length === 0 && <p className="text-gray-500">No orders found</p>}
             </div>
          </div>
        )}

        {/* ================= STAFF ================= */}
        {activeTab === "staff" && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold  text-white">Staff</h2>
              <button onClick={() => openModal("staff")} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Add Staff</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {staff.map((s) => <StaffCard key={s._id} staff={s} onEdit={(d) => openModal("staff", d)} onDelete={(id) => handleDelete(id, "staff")} />)}
            </div>
          </div>
        )}

        {/* ================= CATEGORIES ================= */}
        {activeTab === "categories" && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold  text-white">Categories</h2>
              <button onClick={() => openModal("category")} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Add Categories</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((c) => <CategoryCard key={c._id} category={c} onEdit={(d) => openModal("category", d)} onDelete={(id) => handleDelete(id, "category")} />)}
            </div>
          </div>
        )}

        {/* ================= ITEMS ================= */}
        {activeTab === "items" && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold  text-white">Menu Items</h2>
              <button onClick={() => openModal("item")} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Add Item</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((i) => <ItemCard key={i._id} item={i} onEdit={(d) => openModal("item", d)} onDelete={(id) => handleDelete(id, "item")} />)}
            </div>
          </div>
        )}

        {/* ================= TABLES ================= */}
        {activeTab === "tables" && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold  text-white">Tables</h2>
              <button onClick={() => openModal("table")} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Add Table</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {tables.map((t) => <TableCard key={t._id} table={t} onEdit={(d) => openModal("table", d)} onDelete={(id) => handleDelete(id, "table")} />)}
            </div>
          </div>
        )}

        {/* ================= TAXES ================= */}
        {activeTab === "taxes" && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold  text-white ">Taxes</h2>
              <button onClick={() => openModal("tax")} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Add Tax</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {taxes.map((t) => <TaxCard key={t._id} tax={t} onEdit={(d) => openModal("tax", d)} onDelete={(id) => handleDelete(id, "tax")} />)}
            </div>
          </div>
        )}

      </main>

      {showModal && (
        <Modal title={editData ? `Edit ${modalType}` : `Add ${modalType}`} onClose={() => setShowModal(false)} onSubmit={handleSubmit}>
          <FormFields type={modalType} data={formData} setData={setFormData} categories={categories} />
        </Modal>
      )}
    </div>
  );
}