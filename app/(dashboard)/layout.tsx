"use client";

import Sidebar from "@/components/layout/Sidebar/Sidebar";
import { Suspense, useState } from "react";
import { Menu } from "lucide-react";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-stone-50 flex">
      {/* Drawer for mobile */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        {/* Mobile Header - visible on md and below */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <DrawerTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-gray-700" />
          </DrawerTrigger>
          <Link href="/dashboard">
            <Image src="/logo_full.png" alt="Logo" width={150} height={40} />
          </Link>
        </div>

        <DrawerContent side="left" className="w-64 p-0">
          <Sidebar onClose={() => setDrawerOpen(false)} showLogo={false} />
        </DrawerContent>
      </Drawer>

      {/* Desktop Sidebar - hidden on md and below */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:p-8 pt-16 md:pt-8 w-full h-full overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm border border-contents min-h-full">
          <Suspense fallback={<div className="p-8 text-gray-500">Loading...</div>}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
