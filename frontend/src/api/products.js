import client from "./client";

export const listProducts = async () => (await client.get("/products")).data;
export const createProduct = async (payload) =>
    (await client.post("/products", payload)).data;
export const updateProduct = async (id, payload) =>
    (await client.put(`/products/${id}`, payload)).data;
export const deleteProduct = async (id) => client.delete(`/products/${id}`);
