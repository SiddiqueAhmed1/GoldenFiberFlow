import api from "../Api/api";
export const getInvoices = async () => { try { const res = await api.get("/api/v1/invoice"); return res.data.data; } catch (e) { throw new Error(e.response?.data?.message || "Something went wrong"); } };
export const createInvoice = async (d) => { try { const res = await api.post("/api/v1/invoice", d); return res.data.data; } catch (e) { throw new Error(e.response?.data?.message || "Something went wrong"); } };
export const updateInvoice = async (id, d) => { try { const res = await api.patch(`/api/v1/invoice/${id}`, d); return res.data.data; } catch (e) { throw new Error(e.response?.data?.message || "Something went wrong"); } };
export const deleteInvoice = async (id) => { try { const res = await api.delete(`/api/v1/invoice/${id}`); return res.data; } catch (e) { throw new Error(e.response?.data?.message || "Something went wrong"); } };
