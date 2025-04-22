import { Product } from '../features/product/product.interface';

export const PRODUCT_SAMPLE_DATA: Product[] = [
  {
    id: 1,
    name: 'Burger',
    category: 'Food',
    price: 100,
    stock: 35,
    createdAt: 'Apr 21, 2025, 7:12:26 PM',
    updatedAt: 'Apr 21, 2025, 7:12:26 PM',
  },
  {
    id: 2,
    name: 'Smart Watch',
    category: 'Electronics',
    price: 1000,
    stock: 20,
    createdAt: 'Apr 20, 2025, 7:12:26 PM',
    updatedAt: 'Apr 21, 2025, 7:12:30 PM',
  },
  {
    id: 3,
    name: 'Bottle',
    category: 'Home',
    price: 150,
    stock: 300,
    createdAt: 'Apr 4, 2025, 7:12:26 PM',
    updatedAt: 'Apr 21, 2025, 7:15:00 PM',
  },
  {
    id: 4,
    name: 'Shirt',
    category: 'Clothing',
    price: 300,
    stock: 800,
    createdAt: 'Apr 9, 2025, 7:12:26 PM',
    updatedAt: 'Apr 21, 2025, 7:12:20 PM',
  },
];
