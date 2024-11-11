import { Category, Product, Size } from "../types/interfaces";

// Mock de tamanhos de camisetas, calças e chapéus
const tShirtSizesMock: Size[] = [
  { id: "tshirt1", size: "PP" },
  { id: "tshirt2", size: "P" },
  { id: "tshirt3", size: "M" },
  { id: "tshirt4", size: "G" },
  { id: "tshirt5", size: "GG" },
];

const pantSizesMock: Size[] = [
  { id: "pant1", size: "44" },
  { id: "pant2", size: "45" },
  { id: "pant3", size: "46" },
  { id: "pant4", size: "47" },
  { id: "pant5", size: "48" },
];

const hatSizesMock: Size[] = [
  { id: "hat1", size: "P" },
  { id: "hat2", size: "M" },
  { id: "hat3", size: "G" },
];

// Mock de categorias com tamanhos
const categoriesMock: Category[] = [
  { id: "cat1", name: "Camiseta", sizes: tShirtSizesMock },
  { id: "cat2", name: "Calça", sizes: pantSizesMock },
  { id: "cat3", name: "Chapéu", sizes: hatSizesMock },
];

// Mock de produtos
export const productsMock: Product[] = [
  {
    id: "1",
    name: "Introspective T-SHIRT",
    category: categoriesMock[0],
    price: 49.9,
    promotionPrice: 39.9,
    productImages: [
      {
        id: "img1",
        url: "/products/t-shirt_1.png",
        alt: "Camiseta introspectiva com design minimalista",
      },
    ],
    description: "Uma camiseta introspectiva com design minimalista e conforto garantido.",
  },
  {
    id: "2",
    name: "Minimal T-SHIRT",
    category: categoriesMock[0],
    price: 49.9,
    productImages: [
      {
        id: "img2",
        url: "/products/t-shirt_2.png",
        alt: "Camiseta minimalista",
      },
    ],
    description: "Camiseta minimalista que combina estilo e simplicidade para o seu dia a dia.",
  },
  {
    id: "3",
    name: "Vintage T-SHIRT",
    category: categoriesMock[0],
    price: 49.9,
    productImages: [
      {
        id: "img3",
        url: "/products/t-shirt_3.png",
        alt: "Camiseta vintage estilo retrô",
      },
    ],
    description: "Camiseta com estilo vintage para quem gosta de uma pegada retrô e descolada.",
  },
  {
    id: "4",
    name: "Graphic T-SHIRT",
    category: categoriesMock[0],
    price: 49.9,
    productImages: [
      {
        id: "img4",
        url: "/products/t-shirt_4.png",
        alt: "Camiseta gráfica com estampas exclusivas",
      },
    ],
    description: "Camiseta gráfica com estampas exclusivas e design inovador.",
  },
  {
    id: "5",
    name: "Classic T-SHIRT",
    category: categoriesMock[0],
    price: 49.9,
    productImages: [
      {
        id: "img5",
        url: "/products/t-shirt_5.png",
        alt: "Camiseta clássica confortável",
      },
    ],
    description: "Camiseta clássica que combina com qualquer ocasião, confortável e duradoura.",
  },
  {
    id: "6",
    name: "Casual Pants 1",
    category: categoriesMock[1],
    price: 89.9,
    productImages: [
      {
        id: "img6",
        url: "/products/pants_1.png",
        alt: "Calça casual confortável",
      },
    ],
    description: "Calça casual para momentos relaxantes, com tecido confortável e durável.",
  },
  {
    id: "7",
    name: "Casual Pants 2",
    category: categoriesMock[1],
    price: 89.9,
    productImages: [
      {
        id: "img7",
        url: "/products/pants_2.png",
        alt: "Calça casual com excelente caimento",
      },
    ],
    description: "Estilo casual em uma calça confortável e com excelente caimento.",
  },
  {
    id: "8",
    name: "Casual Pants 3",
    category: categoriesMock[1],
    price: 89.9,
    productImages: [
      {
        id: "img8",
        url: "/products/pants_3.png",
        alt: "Calça casual prática e estilosa",
      },
    ],
    description: "Calça casual para quem busca praticidade e estilo em uma única peça.",
  },
  {
    id: "9",
    name: "Stylish Hat 1",
    category: categoriesMock[2],
    price: 29.9,
    productImages: [
      {
        id: "img9",
        url: "/products/hat_1.png",
        alt: "Chapéu estiloso para proteção e estilo",
      },
    ],
    description: "Chapéu estiloso que protege e completa seu visual com personalidade.",
  },
  {
    id: "10",
    name: "Stylish Hat 2",
    category: categoriesMock[2],
    price: 29.9,
    productImages: [
      {
        id: "img10",
        url: "/products/hat_2.png",
        alt: "Chapéu versátil para qualquer ocasião",
      },
    ],
    description: "Chapéu versátil para qualquer ocasião, oferecendo proteção e estilo.",
  },
];
