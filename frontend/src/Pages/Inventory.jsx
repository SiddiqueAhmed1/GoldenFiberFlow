import { Package, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { getInventory, adjustInventory } from "../Services/inventoryService";
import LoadingSpinner from "../Components/LoadingSpinner";
import { toast } from "react-hot-toast";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400 dark:text-neutral-500">
    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-700/50 flex items-center justify-center">
      <Package size={32} strokeWidth={1.2} />
    </div>
    <p className="text-base font-semibold text-neutral-600 dark:text-neutral-300">No inventory records yet</p>
    <p className="text-sm">Inventory updates automatically when purchase orders are marked as Received</p>
  </div>
);

const AdjustModal = ({ item, handleClose, setInventory }) => {
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("add");
  const [loading, setLoading] = useState(false);

  const inp = "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition";

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || Number(quantity) <= 0) return toast.error("Enter a valid quantity");
    setLoading(true);
    try {
      const data = await adjustInventory({ productId: item.product._id, quantity: Number(quantity), type });
      setInventory((p) => p.map((i) => (i._id === item._id ? data : i)));
      toast.success(`Stock ${type === "add" ? "added" : "reduced"} successfully`);
      handleClose();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral-800 w-full max-w-sm rounded-2xl mx-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 p-5">
          <div>
            <h1 className="text-lg font-bold text-neutral-800 dark:text-white">Adjust Stock</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{item.product?.name} · Current: {item.currentStock} {item.unit}</p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-pointer transition">✕</button>
        </div>
        <div className="p-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">Type *</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setType("add")} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${type === "add" ? "bg-green-500 text-white" : "border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"}`}>
                  <Plus size={15} /> Add Stock
                </button>
                <button type="button" onClick={() => setType("subtract")} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${type === "subtract" ? "bg-red-500 text-white" : "border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"}`}>
                  <Minus size={15} /> Reduce Stock
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">Quantity (kg) *</label>
              <input required type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inp} placeholder="Enter quantity" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={handleClose} className="px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 text-sm rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium cursor-pointer transition disabled:opacity-60">
                {loading ? "Saving..." : "Adjust"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [adjustItem, setAdjustItem] = useState(null);

  useEffect(() => { getInventory().then(setInventory).catch((e) => toast.error(e.message)).finally(() => setLoading(false)); }, []);
  useEffect(() => {
    setFiltered(inventory.filter((i) =>
      (i.product?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (i.product?.grade || "").toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, inventory]);

  const stockStyle = (stock) => {
    if (stock <= 0) return "text-red-600 dark:text-red-400 font-bold";
    if (stock < 100) return "text-amber-600 dark:text-amber-400 font-semibold";
    return "text-green-600 dark:text-green-400 font-semibold";
  };

  return (
    <>
      <section className="p-5 md:p-8 min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white">Inventory</h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Track finished product stock levels</p>
            </div>
          </div>

          {/* summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Products", value: inventory.length, color: "from-amber-400 to-yellow-600" },
              { label: "In Stock", value: inventory.filter((i) => i.currentStock > 0).length, color: "from-green-400 to-emerald-600" },
              { label: "Out of Stock", value: inventory.filter((i) => i.currentStock <= 0).length, color: "from-red-400 to-red-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-neutral-800/70 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 p-4 shadow-sm">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{s.label}</p>
                <p className={`text-2xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent mt-1`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <input type="text" placeholder="Search by product name or grade..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:ring-2 focus:ring-amber-400 transition" />
          </div>

          <div className="bg-white dark:bg-neutral-800/70 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 overflow-hidden shadow-sm">
            {loading ? (<div className="flex justify-center py-20"><LoadingSpinner /></div>)
              : filtered.length === 0 ? (<EmptyState />)
              : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-700/40 border-b border-neutral-200 dark:border-neutral-700 text-left">
                        {["#", "Product", "Grade", "SKU", "Current Stock", "Unit", "Last Updated", "Adjust"].map((h) => (
                          <th key={h} className={`px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400 ${h === "Adjust" ? "text-center" : ""}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((item, i) => (
                        <tr key={item._id} className="border-t border-neutral-100 dark:border-neutral-700/40 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition">
                          <td className="px-5 py-3.5 text-neutral-400 dark:text-neutral-500">{i + 1}</td>
                          <td className="px-5 py-3.5 font-medium text-neutral-800 dark:text-neutral-100">{item.product?.name || "—"}</td>
                          <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">{item.product?.grade || "—"}</td>
                          <td className="px-5 py-3.5 font-mono text-xs text-amber-600 dark:text-amber-400">{item.product?.sku || "—"}</td>
                          <td className={`px-5 py-3.5 ${stockStyle(item.currentStock)}`}>{item.currentStock?.toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">{item.unit}</td>
                          <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{new Date(item.lastUpdated).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                          <td className="px-5 py-3.5 text-center">
                            <button onClick={() => setAdjustItem(item)} className="px-3 py-1.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 cursor-pointer transition">Adjust</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
          {!loading && inventory.length > 0 && <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">Showing {filtered.length} of {inventory.length} products</p>}
        </div>
      </section>
      {adjustItem && <AdjustModal item={adjustItem} handleClose={() => setAdjustItem(null)} setInventory={setInventory} />}
    </>
  );
};
export default Inventory;
