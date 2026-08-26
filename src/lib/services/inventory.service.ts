import { InventoryProduct, InventoryQueryFilter } from "@/types/inventory";

export const initialInventoryProducts: InventoryProduct[] = [
  {
    id: "prod-1",
    index: "01",
    name: "Wireless Headphone",
    image: "/product_images/headphone (1).png",
    category: "Electronics",
    brand: "Decathlon",
    price: 5000,
    priceFormatted: "৳ 5,000",
    stock: 45,
    sku: "SONY-WH-1000XM5",
    status: "In Stock",
  },
  {
    id: "prod-2",
    index: "02",
    name: "Smart Watch Series 8",
    image: "/product_images/smart_watch.png",
    category: "Home & Living",
    brand: "Apple",
    price: 5000,
    priceFormatted: "৳ 5,000",
    stock: 18,
    sku: "SONY-WH-1000XM5",
    status: "Low Stock",
  },
  {
    id: "prod-3",
    index: "03",
    name: "Running Shoes",
    image: "/product_images/wireless_airbuds.png",
    category: "Accessories",
    brand: "Nike",
    price: 5000,
    priceFormatted: "৳ 5,000",
    stock: 32,
    sku: "SONY-WH-1000XM5",
    status: "In Stock",
  },
  {
    id: "prod-4",
    index: "04",
    name: "Laptop Backpack",
    image: "/product_images/usb_typec.png",
    category: "Footwear",
    brand: "Samsonite",
    price: 5000,
    priceFormatted: "৳ 5,000",
    stock: 56,
    sku: "SONY-WH-1000XM5",
    status: "In Stock",
  },
  {
    id: "prod-5",
    index: "04",
    name: "Polarized Sunglasses",
    image: "/product_images/wireless_mouse.png",
    category: "Bags",
    brand: "Sony",
    price: 5000,
    priceFormatted: "৳ 5,000",
    stock: 0,
    sku: "SONY-WH-1000XM5",
    status: "Out of Stock",
  },
  {
    id: "prod-6",
    index: "06",
    name: "Stainless Steel Bottle",
    image: "/product_images/steel_water_bottle.png",
    category: "Electronics",
    brand: "Ray-Ban",
    price: 5000,
    priceFormatted: "৳ 5,000",
    stock: 7,
    sku: "SONY-WH-1000XM5",
    status: "Low Stock",
  },
  {
    id: "prod-7",
    index: "07",
    name: "Mechanical Keyboard",
    image: "/product_images/keyboard.png",
    category: "Home & Living",
    brand: "Logitech",
    price: 5000,
    priceFormatted: "৳ 5,000",
    stock: 0,
    sku: "SONY-WH-1000XM5",
    status: "Out of Stock",
  },
  {
    id: "prod-8",
    index: "08",
    name: "LED Desk Lamp",
    image: "/product_images/mobile.png",
    category: "Bags",
    brand: "Philips",
    price: 5000,
    priceFormatted: "৳ 5,000",
    stock: 57,
    sku: "SONY-WH-1000XM5",
    status: "In Stock",
  },
  {
    id: "prod-9",
    index: "09",
    name: "Smart Watch Series 8",
    image: "/product_images/smart_watch.png",
    category: "Home & Living",
    brand: "Samsonite",
    price: 15600,
    priceFormatted: "৳ 15,600",
    stock: 190,
    sku: "SONY-WH-1000XM5",
    status: "In Stock",
  },
  {
    id: "prod-10",
    index: "10",
    name: "Laptop Backpack",
    image: "/product_images/usb_typec.png",
    category: "Electronics",
    brand: "Electronics",
    price: 1999,
    priceFormatted: "৳ 1,999",
    stock: 100,
    sku: "SONY-WH-1000XM5",
    status: "In Stock",
  },
  {
    id: "prod-11",
    index: "11",
    name: "Stainless Steel Bottle",
    image: "/product_images/steel_water_bottle.png",
    category: "Accessories",
    brand: "Philips",
    price: 2750,
    priceFormatted: "৳ 2,750",
    stock: 45,
    sku: "SONY-WH-1000XM5",
    status: "In Stock",
  },
  {
    id: "prod-12",
    index: "12",
    name: "LED Desk Lamp",
    image: "/product_images/bluetooth speaker.png",
    category: "Home & Living",
    brand: "Apple",
    price: 850,
    priceFormatted: "৳ 850",
    stock: 34,
    sku: "SONY-WH-1000XM5",
    status: "In Stock",
  },
  {
    id: "prod-13",
    index: "13",
    name: "Polarized Sunglasses",
    image: "/product_images/wireless_mouse.png",
    category: "Electronics",
    brand: "Decathlon",
    price: 5000,
    priceFormatted: "৳ 5,000",
    stock: 23,
    sku: "SONY-WH-1000XM5",
    status: "In Stock",
  },
];

export class InventoryService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

  /**
   * Fetch inventory products with search and filtering
   */
  static async getProducts(params?: InventoryQueryFilter): Promise<{ data: InventoryProduct[]; total: number }> {
    let list = [...initialInventoryProducts];

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (params?.status) {
      list = list.filter((p) => p.status.toLowerCase() === params.status?.toLowerCase());
    }

    if (params?.category) {
      list = list.filter((p) => p.category.toLowerCase() === params.category?.toLowerCase());
    }

    return Promise.resolve({
      data: list,
      total: 50,
    });
  }
}

