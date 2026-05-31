import client from "./client";

export const listCustomers = async () => (await client.get("/customers")).data;
export const createCustomer = async (payload) =>
    (await client.post("/customers", payload)).data;
export const deleteCustomer = async (id) => client.delete(`/customers/${id}`);
