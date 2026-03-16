import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Plus, Percent, Wifi } from "lucide-react";

import { itemsAPI, categoriesAPI, tablesAPI, ordersAPI, taxesAPI, authAPI } from "../services/api";
import { AuthContext } from "../context/AuthContext";

import Sidebar from "../components/dashboard/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import OrderHistory from "../components/dashboard/OrderHistory";
import Modal from "../components/common/Modal";
import FormFields from "../components/common/FormFields";

import CategoryCard from "../components/dashboard/CategoryCard";
import ItemCard from "../components/dashboard/ItemCard";
import TableCard from "../components/dashboard/TableCard";
import TaxCard from "../components/dashboard/TaxCard";
import OrderCard from "../components/dashboard/OrderCard";
import StaffCard from "../components/dashboard/StaffCard";
import CafeStatusCard from "../components/dashboard/CafeStatusCard";

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

  const [cafeStatus, setCafeStatus] = useState({ isOnline: true, message: "", updatedAt: new Date() });
  const [statusLoading, setStatusLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({});

  // ================== FETCH DATA ==================
  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, tablesRes, categoriesRes, itemsRes, taxesRes, staffRes] = await Promise.all([
        ordersAPI.getStats(),
        ordersAPI.getAll(),
        tablesAPI.getAll(),
        categoriesAPI.getAll(),
        itemsAPI.getAll(),
        taxesAPI.getAll(),
        authAPI.getStaff(),
      ]);

      setStats(statsRes.data || {});
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      setTables(Array.isArray(tablesRes.data) ? tablesRes.data : []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      setItems(Array.isArray(itemsRes.data) ? itemsRes.data : []);
      setTaxes(Array.isArray(taxesRes.data) ? taxesRes.data : []);
      setStaff(Array.isArray(staffRes.data) ? staffRes.data : []);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error("Failed to load dashboard data. Using fallback.");
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    setTaxes([{ _id: "1", name: "GST", percentage: 18, description: "Goods & Services Tax" }]);
    setOrders([]);
    setTables([]);
    setCategories([]);
    setItems([]);
    setStaff([]);
  };

  // ================== CAFE STATUS ==================
  useEffect(() => {
    fetchCafeStatus();
    const interval = setInterval(fetchCafeStatus, 10000); // every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchCafeStatus = async () => {
    try {
      const res = await authAPI.getCafeStatus();
      setCafeStatus(res.data || { isOnline: true, message: "Ready" });
    } catch (err) {
      console.error("Cafe status fetch error:", err);
    }
  };

  const updateCafeStatus = async (isOnline, message) => {
    try {
      setStatusLoading(true);
      await authAPI.updateCafeStatus({ isOnline, message });
      toast.success(isOnline ? "Cafe is ONLINE!" : "Cafe is OFFLINE");
      fetchCafeStatus();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  // ================== MODAL & CRUD ==================
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
      const apiMap = { category: categoriesAPI, item: itemsAPI, table: tablesAPI, tax: taxesAPI, staff: authAPI };
      await apiMap[type].delete(id);
      toast.success("Deleted successfully");
      fetchAllData();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiMap = { category: categoriesAPI, item: itemsAPI, table: tablesAPI, tax: taxesAPI, staff: authAPI };
      const apiObj = apiMap[modalType];
      if (editData) await apiObj.update(editData._id, formData);
      else await apiObj.create(formData);
      toast.success(editData ? "Updated" : "Created");
      setShowModal(false);
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  if (loading && !showModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-orange-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Revenue" value={stats.totalRevenue || 0} prefix="₹" />
              <StatCard title="Total Orders" value={stats.totalOrders || 0} />
              <StatCard title="Active Tables" value={tables.filter(t => t.status === "occupied").length} suffix={` / ${tables.length}`} />
              <StatCard title="Popular Item" value={stats.popularItem?.name || "N/A"} />
            </div>
            <DashboardCharts orders={orders || []} stats={stats || {}} />
          </div>
        )}

        {/* CAFE ONLINE TAB */}
        {activeTab === "cafe-online" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700/50">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Wifi className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-white to-emerald-400 bg-clip-text mb-1">
                    Live Cafe Control
                  </h2>
                  <p className="text-slate-400 text-lg">Toggle online ordering & customer messaging</p>
                </div>
              </div>
              <CafeStatusCard
                cafeStatus={cafeStatus}
                onUpdateStatus={updateCafeStatus}
                loading={statusLoading}
                onRefresh={fetchCafeStatus}
              />
            </div>
          </div>
        )}

        {/* OTHER TABS */}
        {activeTab === "earning" && <OrderHistory />}
        {activeTab === "orders" && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-6 text-white">All Orders</h2>
            <div className="grid gap-4">{orders.map(o => <OrderCard key={o._id} order={o} />)}</div>
          </div>
        )}
        {activeTab === "staff" && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Staff</h2>
              <button onClick={() => openModal("staff")} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Add Staff</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{staff.map(s => <StaffCard key={s._id} staff={s} onEdit={d => openModal("staff", d)} onDelete={id => handleDelete(id, "staff")} />)}</div>
          </div>
        )}
        {activeTab === "categories" && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Categories</h2>
              <button onClick={() => openModal("category")} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Add Category</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{categories.map(c => <CategoryCard key={c._id} category={c} onEdit={d => openModal("category", d)} onDelete={id => handleDelete(id, "category")} />)}</div>
          </div>
        )}
        {activeTab === "items" && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Menu Items</h2>
              <button onClick={() => openModal("item")} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Add Item</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{items.map(i => <ItemCard key={i._id} item={i} onEdit={d => openModal("item", d)} onDelete={id => handleDelete(id, "item")} />)}</div>
          </div>
        )}
        {activeTab === "tables" && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Tables</h2>
              <button onClick={() => openModal("table")} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Add Table</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">{tables.map(t => <TableCard key={t._id} table={t} onEdit={d => openModal("table", d)} onDelete={id => handleDelete(id, "table")} />)}</div>
          </div>
        )}
        {activeTab === "taxes" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">Tax Configuration</h2>
              <button onClick={() => openModal("tax")} className="group flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border border-orange-500/30"><Plus size={20} /></button>
            </div>
            {Array.isArray(taxes) && taxes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{taxes.map(t => <TaxCard key={t._id} tax={t} onEdit={d => openModal("tax", d)} onDelete={id => handleDelete(id, "tax")} />)}</div>
            ) : (
              <div className="text-center py-20 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-2xl rounded-3xl border border-white/10">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-2 border-orange-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                  <Percent className="w-12 h-12 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-200 mb-4">No Taxes Configured</h3>
                <p className="text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed">Configure GST, service tax or other rates. They'll be automatically applied to all orders.</p>
                <button onClick={() => openModal("tax")} className="group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.05] transition-all duration-300 border border-emerald-500/30"><Plus className="w-6 h-6 inline mr-2 group-hover:rotate-12 transition-transform" /> Configure First Tax</button>
              </div>
            )}
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