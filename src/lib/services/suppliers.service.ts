import { SupplierRecord, SupplierQueryFilter, CreateSupplierPayload } from "@/types/suppliers";

export const initialSuppliersData: SupplierRecord[] = [
  {
    id: "sup-1",
    index: "01",
    name: "ABC Traders",
    avatar: "/image.png",
    phone: "+880 1912 345 680",
    mail: "info@abctraders.com",
    totalPurchases: 5000,
    totalPurchasesFormatted: "৳ 5,000",
    balance: 5000,
    balanceFormatted: "৳ 5,000",
    lastPurchase: "26 Aug 2026",
    status: "Active",
  },
  {
    id: "sup-2",
    index: "02",
    name: "XYZ Supplies",
    avatar: "/image.png",
    phone: "+880 1912 345 680",
    mail: "info@abctraders.com",
    totalPurchases: 5000,
    totalPurchasesFormatted: "৳ 5,000",
    balance: 5000,
    balanceFormatted: "৳ 5,000",
    lastPurchase: "26 Aug 2026",
    status: "Active",
  },
  {
    id: "sup-3",
    index: "03",
    name: "Global Enterprise",
    avatar: "/image.png",
    phone: "+880 1912 345 680",
    mail: "info@abctraders.com",
    totalPurchases: 5000,
    totalPurchasesFormatted: "৳ 5,000",
    balance: 5000,
    balanceFormatted: "৳ 5,000",
    lastPurchase: "26 Aug 2026",
    status: "Active",
  },
  {
    id: "sup-4",
    index: "04",
    name: "Rohan Traders",
    avatar: "/image.png",
    phone: "+880 1912 345 680",
    mail: "info@abctraders.com",
    totalPurchases: 5000,
    totalPurchasesFormatted: "৳ 5,000",
    balance: 5000,
    balanceFormatted: "৳ 5,000",
    lastPurchase: "26 Aug 2026",
    status: "Active",
  },
  {
    id: "sup-5",
    index: "04",
    name: "Nusrat Supplies",
    avatar: "/image.png",
    phone: "+880 1912 345 680",
    mail: "info@abctraders.com",
    totalPurchases: 5000,
    totalPurchasesFormatted: "৳ 5,000",
    balance: 5000,
    balanceFormatted: "৳ 5,000",
    lastPurchase: "26 Aug 2026",
    status: "Inactive",
  },
  {
    id: "sup-6",
    index: "06",
    name: "ABC Traders",
    avatar: "/image.png",
    phone: "+880 1912 345 680",
    mail: "info@abctraders.com",
    totalPurchases: 5000,
    totalPurchasesFormatted: "৳ 5,000",
    balance: 5000,
    balanceFormatted: "৳ 5,000",
    lastPurchase: "26 Aug 2026",
    status: "Active",
  },
  {
    id: "sup-7",
    index: "07",
    name: "Global Enterprise",
    avatar: "/image.png",
    phone: "+880 1912 345 680",
    mail: "info@abctraders.com",
    totalPurchases: 5000,
    totalPurchasesFormatted: "৳ 5,000",
    balance: 5000,
    balanceFormatted: "৳ 5,000",
    lastPurchase: "26 Aug 2026",
    status: "Active",
  },
  {
    id: "sup-8",
    index: "08",
    name: "Rohan Traders",
    avatar: "/image.png",
    phone: "+880 1912 345 680",
    mail: "info@abctraders.com",
    totalPurchases: 5000,
    totalPurchasesFormatted: "৳ 5,000",
    balance: 5000,
    balanceFormatted: "৳ 5,000",
    lastPurchase: "26 Aug 2026",
    status: "Inactive",
  },
  {
    id: "sup-9",
    index: "09",
    name: "Nusrat Supplies",
    avatar: "/image.png",
    phone: "+880 1912 345 680",
    mail: "info@abctraders.com",
    totalPurchases: 15600,
    totalPurchasesFormatted: "৳ 15,600",
    balance: 15600,
    balanceFormatted: "৳ 15,600",
    lastPurchase: "26 Aug 2026",
    status: "Active",
  },
  {
    id: "sup-10",
    index: "10",
    name: "Techno Mart",
    avatar: "/image.png",
    phone: "+880 1912 345 680",
    mail: "info@abctraders.com",
    totalPurchases: 1999,
    totalPurchasesFormatted: "৳ 1,999",
    balance: 1999,
    balanceFormatted: "৳ 1,999",
    lastPurchase: "26 Aug 2026",
    status: "Active",
  },
  {
    id: "sup-11",
    index: "11",
    name: "Biswas Traders",
    avatar: "/image.png",
    phone: "+880 1912 345 680",
    mail: "info@abctraders.com",
    totalPurchases: 2750,
    totalPurchasesFormatted: "৳ 2,750",
    balance: 2750,
    balanceFormatted: "৳ 2,750",
    lastPurchase: "26 Aug 2026",
    status: "Active",
  },
  {
    id: "sup-12",
    index: "12",
    name: "XYZ Supplies",
    avatar: "/image.png",
    phone: "+880 1912 345 680",
    mail: "info@abctraders.com",
    totalPurchases: 850,
    totalPurchasesFormatted: "৳ 850",
    balance: 850,
    balanceFormatted: "৳ 850",
    lastPurchase: "26 Aug 2026",
    status: "Inactive",
  },
  {
    id: "sup-13",
    index: "13",
    name: "Biswas Traders",
    avatar: "/image.png",
    phone: "+880 1912 345 680",
    mail: "info@abctraders.com",
    totalPurchases: 5000,
    totalPurchasesFormatted: "৳ 5,000",
    balance: 5000,
    balanceFormatted: "৳ 5,000",
    lastPurchase: "26 Aug 2026",
    status: "Active",
  },
];

export class SuppliersService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

  /**
   * Fetch suppliers with search & filters
   */
  static async getSuppliers(params?: SupplierQueryFilter): Promise<{ data: SupplierRecord[]; total: number }> {
    let list = [...initialSuppliersData];

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.phone.includes(q) ||
          s.mail.toLowerCase().includes(q)
      );
    }

    if (params?.status) {
      list = list.filter((s) => s.status.toLowerCase() === params.status?.toLowerCase());
    }

    return Promise.resolve({
      data: list,
      total: 50,
    });
  }

  /**
   * Create a new supplier in backend DB
   */
  static async createSupplier(payload: CreateSupplierPayload): Promise<SupplierRecord> {
    const newSupplier: SupplierRecord = {
      id: `sup-${Date.now()}`,
      index: "14",
      name: payload.name,
      avatar: "/image.png",
      phone: payload.phone,
      mail: payload.mail,
      totalPurchases: 0,
      totalPurchasesFormatted: "৳ 0",
      balance: 0,
      balanceFormatted: "৳ 0",
      lastPurchase: "Today",
      status: payload.status || "Active",
    };
    return Promise.resolve(newSupplier);
  }
}

