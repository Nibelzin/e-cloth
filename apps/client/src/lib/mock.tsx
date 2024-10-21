import { Product } from "../types/interfaces";

export const productsMock: Product[] = [
    {
        id: "1",
        name: "Instrospectivo T-SHIRT",
        category: { id: "cat1", name: "Camiseta" },
        price: 49.90,
        imgs: ["/products/t-shirt_1.png"]
    },
    {
        id: "2",
        name: "Minimal T-SHIRT",
        category: { id: "cat1", name: "Camiseta" },
        price: 49.90,
        imgs: ["/products/t-shirt_2.png"]
    },
    {
        id: "3",
        name: "Vintage T-SHIRT",
        category: { id: "cat1", name: "Camiseta" },
        price: 49.90,
        imgs: ["/products/t-shirt_3.png"]
    },
    {
        id: "4",
        name: "Graphic T-SHIRT",
        category: { id: "cat1", name: "Camiseta" },
        price: 49.90,
        imgs: ["/products/t-shirt_4.png"]
    },
    {
        id: "5",
        name: "Classic T-SHIRT",
        category: { id: "cat1", name: "Camiseta" },
        price: 49.90,
        imgs: ["/products/t-shirt_5.png"]
    },
    {
        id: "6",
        name: "Casual Pants 1",
        category: { id: "cat2", name: "Calça" },
        price: 89.90,
        imgs: ["/products/pants_1.png"]
    },
    {
        id: "7",
        name: "Casual Pants 2",
        category: { id: "cat2", name: "Calça" },
        price: 89.90,
        imgs: ["/products/pants_2.png"]
    },
    {
        id: "8",
        name: "Casual Pants 3",
        category: { id: "cat2", name: "Calça" },
        price: 89.90,
        imgs: ["/products/pants_3.png"]
    },
    {
        id: "9",
        name: "Stylish Hat 1",
        category: { id: "cat3", name: "Chapéu" },
        price: 29.90,
        imgs: ["/products/hat_1.png"]
    },
    {
        id: "10",
        name: "Stylish Hat 2",
        category: { id: "cat3", name: "Chapéu" },
        price: 29.90,
        imgs: ["/products/hat_2.png"]
    }
];