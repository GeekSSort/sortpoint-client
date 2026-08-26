import { PurchaseRecord, PurchaseQueryFilter } from "@/types/purchases";

export const initialPurchasesData: PurchaseRecord[] = [
  {
    id: "po-1",
    purchaseId: "PO-2024-0056",
    supplier: { name: "ABC Traders", avatar: "/image.png" },
    purchaseDate: "31 May 2024",
    itemsCount: 15,
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentStatus: "Paid",
    status: "Received",
  },
  {
    id: "po-2",
    purchaseId: "PO-2024-0056",
    supplier: { name: "XYZ Supplies", avatar: "/image.png" },
    purchaseDate: "31 May 2024",
    itemsCount: 8,
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentStatus: "Due",
    status: "Pending",
  },
  {
    id: "po-3",
    purchaseId: "PO-2024-0056",
    supplier: { name: "Global Enterprise", avatar: "/image.png" },
    purchaseDate: "31 May 2024",
    itemsCount: 12,
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentStatus: "Paid",
    status: "Received",
  },
  {
    id: "po-4",
    purchaseId: "PO-2024-0056",
    supplier: { name: "Rohan Traders", avatar: "/image.png" },
    purchaseDate: "31 May 2024",
    itemsCount: 6,
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentStatus: "Paid",
    status: "Received",
  },
  {
    id: "po-5",
    purchaseId: "PO-2024-0056",
    supplier: { name: "Nusrat Supplies", avatar: "/image.png" },
    purchaseDate: "31 May 2024",
    itemsCount: 16,
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentStatus: "Due",
    status: "Pending",
  },
  {
    id: "po-6",
    purchaseId: "PO-2024-0056",
    supplier: { name: "ABC Traders", avatar: "/image.png" },
    purchaseDate: "31 May 2024",
    itemsCount: 23,
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentStatus: "Due",
    status: "Received",
  },
  {
    id: "po-7",
    purchaseId: "PO-2024-0056",
    supplier: { name: "Global Enterprise", avatar: "/image.png" },
    purchaseDate: "31 May 2024",
    itemsCount: 31,
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentStatus: "Due",
    status: "Pending",
  },
  {
    id: "po-8",
    purchaseId: "PO-2024-0056",
    supplier: { name: "Rohan Traders", avatar: "/image.png" },
    purchaseDate: "31 May 2024",
    itemsCount: 24,
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentStatus: "Paid",
    status: "Received",
  },
  {
    id: "po-9",
    purchaseId: "PO-2024-0056",
    supplier: { name: "Nusrat Supplies", avatar: "/image.png" },
    purchaseDate: "31 May 2024",
    itemsCount: 9,
    totalAmount: 15600,
    totalAmountFormatted: "৳ 15,600",
    paymentStatus: "Paid",
    status: "Received",
  },
  {
    id: "po-10",
    purchaseId: "PO-2024-0056",
    supplier: { name: "Techno Mart", avatar: "/image.png" },
    purchaseDate: "31 May 2024",
    itemsCount: 7,
    totalAmount: 1999,
    totalAmountFormatted: "৳ 1,999",
    paymentStatus: "Paid",
    status: "Pending",
  },
  {
    id: "po-11",
    purchaseId: "PO-2024-0056",
    supplier: { name: "Biswas Traders", avatar: "/image.png" },
    purchaseDate: "31 May 2024",
    itemsCount: 19,
    totalAmount: 2750,
    totalAmountFormatted: "৳ 2,750",
    paymentStatus: "Paid",
    status: "Received",
  },
  {
    id: "po-12",
    purchaseId: "PO-2024-0056",
    supplier: { name: "XYZ Supplies", avatar: "/image.png" },
    purchaseDate: "31 May 2024",
    itemsCount: 34,
    totalAmount: 850,
    totalAmountFormatted: "৳ 850",
    paymentStatus: "Paid",
    status: "Received",
  },
  {
    id: "po-13",
    purchaseId: "PO-2024-0056",
    supplier: { name: "Biswas Traders", avatar: "/image.png" },
    purchaseDate: "31 May 2024",
    itemsCount: 54,
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentStatus: "Paid",
    status: "Pending",
  },
];

export class PurchasesService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

  /**
   * Fetch purchase history records with search & filters
   */
  static async getPurchases(params?: PurchaseQueryFilter): Promise<{ data: PurchaseRecord[]; total: number }> {
    let list = [...initialPurchasesData];

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.purchaseId.toLowerCase().includes(q) ||
          p.supplier.name.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q) ||
          p.paymentStatus.toLowerCase().includes(q)
      );
    }

    if (params?.status) {
      list = list.filter((p) => p.status.toLowerCase() === params.status?.toLowerCase());
    }

    if (params?.paymentStatus) {
      list = list.filter((p) => p.paymentStatus.toLowerCase() === params.paymentStatus?.toLowerCase());
    }

    return Promise.resolve({
      data: list,
      total: 50,
    });
  }
}

