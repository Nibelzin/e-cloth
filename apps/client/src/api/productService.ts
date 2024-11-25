import { Product, ProductFormData, ProductImage, updatedProductResponse } from "../types/types";

const apiUrl = import.meta.env.VITE_API_URL;

export async function getProductById(productId: string) {
  const response = await fetch(`${apiUrl}/api/product/${productId}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Erro ao buscar produto");

  const result = await response.json();

  return result;
}

export async function getProducts(
  itemsPerPage?: number,
  currentPage?: number,
  term?: string
) {
  const queryParams = new URLSearchParams();

  if (itemsPerPage) queryParams.append("itemsPerPage", String(itemsPerPage));
  if (currentPage) queryParams.append("page", String(currentPage));
  if (term) queryParams.append("term", term);

  const query = `?${queryParams.toString()}`;

  const response = await fetch(`${apiUrl}/api/search${query}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Erro ao buscar produtos");

  const result = (await response.json()) as {
    products: Product[];
    total: number;
  };

  return result;
}

export async function createProduct(productData: ProductFormData) {
  const response = await fetch(`${apiUrl}/api/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) throw new Error("Erro ao criar produto");

  const result = await response.json();

  return result;
}

export async function updateProduct(productData: ProductFormData) {
  const response = await fetch(`${apiUrl}/api/product`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if(!response.ok) throw new Error("Erro ao atualizar produto");

  const updatedProductAndImagesToRemove: updatedProductResponse = await response.json();

  await deleteProductImages(updatedProductAndImagesToRemove.imagesToRemove);

  return updatedProductAndImagesToRemove;
}

export async function createProductImages(productImagesData: FormData) {
  const response = await fetch(`${apiUrl}/api/product/images`, {
    method: "POST",
    body: productImagesData,
  });

  if (!response.ok) throw new Error("Erro fazer upload das imagens");

  const result = await response.json();


  return result;
}

export async function deleteProductImages(imagesToRemove: ProductImage[]) {

  const response = await fetch(`${apiUrl}/api/product/images`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imagesToRemove),
  });

  if (!response.ok) throw new Error("Erro ao deletar imagens");

  const result = await response.json();

  return result;
}

export async function softDeleteProduct(productId: string) {
  const response = await fetch(`${apiUrl}/api/product/${productId}/soft`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Erro ao deletar produto");

  const result = await response.json();

  return result;
}
