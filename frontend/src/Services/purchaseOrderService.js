import api from "../Api/api";
export const getPurchaseOrders = async () => { try { const res = await api.get("/api/v1/purchase-order"); return res.data.data; } catch (e) { throw new Error(e.response?.data?.message || "Something went wrong"); } };
export const createPurchaseOrder = async (d) => { try { const res = await api.post("/api/v1/purchase-order", d); return res.data.data; } catch (e) { throw new Error(e.response?.data?.message || "Something went wrong"); } };
export const updatePurchaseOrder = async (id, d) => { try { const res = await api.patch(`/api/v1/purchase-order/${id}`, d); return res.data.data; } catch (e) { throw new Error(e.response?.data?.message || "Something went wrong"); } };
export const deletePurchaseOrder = async (id) => { try { const res = await api.delete(`/api/v1/purchase-order/${id}`); return res.data; } catch (e) { throw new Error(e.response?.data?.message || "Something went wrong"); } };
