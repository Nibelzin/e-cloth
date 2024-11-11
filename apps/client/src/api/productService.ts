import { Product } from "../types/interfaces";

const apiUrl = import.meta.env.VITE_API_URL;

export async function getProducts() {
  const response = await fetch(`${apiUrl}/api/search`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Erro ao buscar produtos");

  const products: Product[] = await response.json();
  
  return products
}
