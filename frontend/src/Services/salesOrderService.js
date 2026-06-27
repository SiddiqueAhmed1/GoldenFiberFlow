import api from "../Api/api";
export const getSalesOrders = async () => { try { const res = await api.get("/api/v1/sales-order"); return res.data.data; } catch (e) { throw new Error(e.response?.data?.message || "Something went wrong"); } };
export const createSalesOrder = async (d) => { try { const res = await api.post("/api/v1/sales-order", d); return res.data.data; } catch (e) { throw new Error(e.response?.data?.message || "Something went wrong"); } };
export const updateSalesOrder = async (id, d) => { try { const res = await api.patch(`/api/v1/sales-order/${id}`, d); return res.data.data; } catch (e) { throw new Error(e.response?.data?.message || "Something went wrong"); } };
export const deleteSalesOrder = async (id) => { try { const res = await api.delete(`/api/v1/sales-order/${id}`); return res.data; } catch (e) { throw new Error(e.response?.data?.message || "Something went wrong"); } };
export const getSingleSalesOrder = async (id) => { try { const res = await api.get(`/api/v1/sales-order/${id}`); return res.data.data; } catch (e) { throw new Error(e.response?.data?.message || "Something went wrong"); } };
