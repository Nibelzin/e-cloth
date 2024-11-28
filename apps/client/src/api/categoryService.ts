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

export async function createCategory(category: Category){
    
    const response = await fetch(`${apiUrl}/api/category`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(category)
    })

    if(!response.ok) throw new Error("Erro ao criar categoria");

    const newCategory: Category = await response.json()

    return newCategory
}