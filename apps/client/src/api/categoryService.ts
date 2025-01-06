import { Category, CategoryDTO } from "../types/types";

const apiUrl = import.meta.env.VITE_API_URL;

export async function getCategoryById(categoryId: string) {
    const response = await fetch(`${apiUrl}/api/category/${categoryId}`, {
        method: "GET",
    });
    
    if (!response.ok) throw new Error("Erro ao buscar categoria");
    
    const category: CategoryDTO = await response.json();
    
    return category;
}

export async function getCategories(
  itemsPerPage?: number,
  currentPage?: number,
  term?: string
) {
  const queryParams = new URLSearchParams();

  if (itemsPerPage) queryParams.append("itemsPerPage", String(itemsPerPage));
  if (currentPage) queryParams.append("page", String(currentPage));
  if (term) queryParams.append("term", term);

  const query = `?${queryParams.toString()}`;


  const response = await fetch(`${apiUrl}/api/search/category${query}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Erro ao buscar categorias");

  const result = (await response.json()) as {
    categories: CategoryDTO[];
    total: number;
  };

  return result;
}

export async function createCategory(category: Category) {
  const response = await fetch(`${apiUrl}/api/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) throw new Error("Erro ao criar categoria");

  const newCategory: Category = await response.json();

  return newCategory;
}

export async function updateCategory(category: Category) {
    const response = await fetch(`${apiUrl}/api/category`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
    });

    if (!response.ok) throw new Error("Erro ao atualizar categoria");

    const updatedCategory: Category = await response.json();
    
    return updatedCategory;
}

export async function deleteCategory(categoryId: string) {
    const response = await fetch(`${apiUrl}/api/category/${categoryId}`, {
        method: "DELETE",
    });
    
    if (!response.ok) throw new Error("Erro ao deletar categoria");
    
    return;
}
