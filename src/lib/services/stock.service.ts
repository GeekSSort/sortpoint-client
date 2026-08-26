import { StockItem, StockQueryFilter } from "@/types/stock";

export const initialStockData: StockItem[] = [
  {
    id: "stock-1",
    name: "Wireless Headphone",
    image: "/product_images/headphone (1).png",
    sku: "SONY-WH-1000XM5",
    warehouse: "Electronics",
    available: 45,
    reserved: 45,
    lowStock: 45,
    status: "In Stock",
  },
  {
    id: "stock-2",
    name: "Smart Watch Series 8",
    image: "/product_images/smart_watch.png",
    sku: "SONY-WH-1000XM5",
    warehouse: "Home & Living",
    available: 18,
    reserved: 18,
    lowStock: 18,
    status: "Low Stock",
  },
  {
    id: "stock-3",
    name: "Running Shoes",
    image: "/product_images/wireless_airbuds.png",
    sku: "SONY-WH-1000XM5",
    warehouse: "Accessories",
    available: 32,
    reserved: 32,
    lowStock: 32,
    status: "In Stock",
  },
  {
    id: "stock-4",
    name: "Laptop Backpack",
    image: "/product_images/usb_typec.png",
    sku: "SONY-WH-1000XM5",
    warehouse: "Footwear",
    available: 56,
    reserved: 56,
    lowStock: 56,
    status: "In Stock",
  },
  {
    id: "stock-5",
    name: "Polarized Sunglasses",
    image: "/product_images/wireless_mouse.png",
    sku: "SONY-WH-1000XM5",
    warehouse: "Bags",
    available: 0,
    reserved: 0,
    lowStock: 0,
    status: "Out of Stock",
  },
  {
    id: "stock-6",
    name: "Stainless Steel Bottle",
    image: "/product_images/steel_water_bottle.png",
    sku: "SONY-WH-1000XM5",
    warehouse: "Electronics",
    available: 7,
    reserved: 7,
    lowStock: 7,
    status: "Low Stock",
  },
  {
    id: "stock-7",
    name: "Mechanical Keyboard",
    image: "/product_images/keyboard.png",
    sku: "SONY-WH-1000XM5",
    warehouse: "Home & Living",
    available: 0,
    reserved: 0,
    lowStock: 0,
    status: "Out of Stock",
  },
  {
    id: "stock-8",
    name: "LED Desk Lamp",
    image: "/product_images/mobile.png",
    sku: "SONY-WH-1000XM5",
    warehouse: "Bags",
    available: 57,
    reserved: 57,
    lowStock: 57,
    status: "In Stock",
  },
  {
    id: "stock-9",
    name: "Smart Watch Series 8",
    image: "/product_images/smart_watch.png",
    sku: "SONY-WH-1000XM5",
    warehouse: "Home & Living",
    available: 190,
    reserved: 190,
    lowStock: 190,
    status: "In Stock",
  },
  {
    id: "stock-10",
    name: "Laptop Backpack",
    image: "/product_images/usb_typec.png",
    sku: "SONY-WH-1000XM5",
    warehouse: "Electronics",
    available: 100,
    reserved: 100,
    lowStock: 100,
    status: "In Stock",
  },
  {
    id: "stock-11",
    name: "Stainless Steel Bottle",
    image: "/product_images/steel_water_bottle.png",
    sku: "SONY-WH-1000XM5",
    warehouse: "Accessories",
    available: 45,
    reserved: 45,
    lowStock: 45,
    status: "In Stock",
  },
  {
    id: "stock-12",
    name: "LED Desk Lamp",
    image: "/product_images/bluetooth speaker.png",
    sku: "SONY-WH-1000XM5",
    warehouse: "Home & Living",
    available: 34,
    reserved: 34,
    lowStock: 34,
    status: "In Stock",
  },
  {
    id: "stock-13",
    name: "Polarized Sunglasses",
    image: "/product_images/wireless_mouse.png",
    sku: "SONY-WH-1000XM5",
    warehouse: "Electronics",
    available: 23,
    reserved: 23,
    lowStock: 23,
    status: "In Stock",
  },
];

export class StockService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

  /**
   * Fetch stock items with search and filters
   */
  static async getStock(params?: StockQueryFilter): Promise<{ data: StockItem[]; total: number }> {
    let list = [...initialStockData];

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.sku.toLowerCase().includes(q) ||
          s.warehouse.toLowerCase().includes(q)
      );
    }

    if (params?.status) {
      list = list.filter((s) => s.status.toLowerCase() === params.status?.toLowerCase());
    }

    if (params?.warehouse) {
      list = list.filter((s) => s.warehouse.toLowerCase() === params.warehouse?.toLowerCase());
    }

    return Promise.resolve({
      data: list,
      total: 50,
    });
  }
}

