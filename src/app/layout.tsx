import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sortorium - Enterprise ERP & Management",
  description: "Enterprise level business management workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased text-slate-900">
        {children}
      </body>
    </html>
  );
}

