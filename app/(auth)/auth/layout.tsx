import type { Metadata } from "next";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "관리자 페이지",
  description: "Inscript 관리자 페이지",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
