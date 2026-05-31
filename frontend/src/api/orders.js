import client from "./client";

export const listOrders = async () => (await client.get("/orders")).data;
export const createOrder = async (payload) =>
    (await client.post("/orders", payload)).data;
export const deleteOrder = async (id) => client.delete(`/orders/${id}`);
