import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSheet } from "@/components/cart/CartSheet";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <CartSheet />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
