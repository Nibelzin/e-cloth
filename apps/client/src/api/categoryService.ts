import { Category } from "../types/types";


const apiUrl = import.meta.env.VITE_API_URL;

export async function getCategories(){

    const response = await fetch(`${apiUrl}/api/category`, {
        method: "GET"
    })

    if(!response.ok) throw new Error("Erro ao buscar categorias");

    const categories: Category[] = await response.json()

    return categories
}