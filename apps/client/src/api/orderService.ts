import { Order } from "../types/types";

const apiUrl = import.meta.env.VITE_API_URL;

export async function createPaymentIntent(amount: number) {

    const response = await fetch(`${apiUrl}/api/stripe/create-payment-intent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount })
    });

    if (!response.ok) throw new Error("Erro ao criar pagamento");

    const result = await response.json();

    return result;
}

export async function createOrder(orderData: Order) {

    const response = await fetch(`${apiUrl}/api/order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    });

    if (!response.ok) throw new Error("Erro ao criar pedido");

    const result = await response.json();

    return result;
}