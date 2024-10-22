import { Product } from "../types/interfaces";

export const productsMock: Product[] = [
    {
        id: "1",
        name: "Instrospectivo T-SHIRT",
        category: { id: "cat1", name: "Camiseta" },
        price: 49.90,
        promotionPrice: 39.90,
        imgs: ["/products/t-shirt_1.png"],
        description: "Uma camiseta introspectiva com design minimalista e conforto garantido."
    },
    {
        id: "2",
        name: "Minimal T-SHIRT",
        category: { id: "cat1", name: "Camiseta" },
        price: 49.90,
        imgs: ["/products/t-shirt_2.png"],
        description: "Camiseta minimalista que combina estilo e simplicidade para o seu dia a dia."
    },
    {
        id: "3",
        name: "Vintage T-SHIRT",
        category: { id: "cat1", name: "Camiseta" },
        price: 49.90,
        imgs: ["/products/t-shirt_3.png"],
        description: "Camiseta com estilo vintage para quem gosta de uma pegada retrô e descolada."
    },
    {
        id: "4",
        name: "Graphic T-SHIRT",
        category: { id: "cat1", name: "Camiseta" },
        price: 49.90,
        imgs: ["/products/t-shirt_4.png"],
        description: "Camiseta gráfica com estampas exclusivas e design inovador."
    },
    {
        id: "5",
        name: "Classic T-SHIRT",
        category: { id: "cat1", name: "Camiseta" },
        price: 49.90,
        imgs: ["/products/t-shirt_5.png"],
        description: "Camiseta clássica que combina com qualquer ocasião, confortável e duradoura."
    },
    {
        id: "6",
        name: "Casual Pants 1",
        category: { id: "cat2", name: "Calça" },
        price: 89.90,
        imgs: ["/products/pants_1.png"],
        description: "Calça casual para momentos relaxantes, com tecido confortável e durável."
    },
    {
        id: "7",
        name: "Casual Pants 2",
        category: { id: "cat2", name: "Calça" },
        price: 89.90,
        imgs: ["/products/pants_2.png"],
        description: "Estilo casual em uma calça confortável e com excelente caimento."
    },
    {
        id: "8",
        name: "Casual Pants 3",
        category: { id: "cat2", name: "Calça" },
        price: 89.90,
        imgs: ["/products/pants_3.png"],
        description: "Calça casual para quem busca praticidade e estilo em uma única peça."
    },
    {
        id: "9",
        name: "Stylish Hat 1",
        category: { id: "cat3", name: "Chapéu" },
        price: 29.90,
        imgs: ["/products/hat_1.png"],
        description: "Chapéu estiloso que protege e completa seu visual com personalidade."
    },
    {
        id: "10",
        name: "Stylish Hat 2",
        category: { id: "cat3", name: "Chapéu" },
        price: 29.90,
        imgs: ["/products/hat_2.png"],
        description: "Chapéu versátil para qualquer ocasião, oferecendo proteção e estilo."
    }
];
