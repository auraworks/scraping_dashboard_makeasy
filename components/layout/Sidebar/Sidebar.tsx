"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuthStore } from "@/components/store/authStore";
import { useToast } from "@/components/hooks/useToast";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { id: "dashboard", label: "대시보드", href: "/dashboard" },
    { id: "sources", label: "정보원 관리", href: "/sources" },
    { id: "data", label: "데이터 관리", href: "/data" },
    { id: "logs", label: "로그 관리", href: "/logs" },
    
  ];

  const authPages = [
    { id: "signin", label: "로그인", href: "/auth/login" },
    { id: "signup", label: "회원가입", href: "/auth/register" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("로그아웃 성공", "로그인 페이지로 이동합니다.");
      router.push("/auth/login");
    } catch (error) {
      toast.error("로그아웃 실패", "다시 시도해주세요.");
    }
  };

  return (
    <aside className="w-64 bg-stone-50 h-screen max-h-screen sticky top-0 flex flex-col ">
      {/* 헤더 */}
      <div className="p-6 ">
        {/* <h1 className="text-xl font-bold text-gray-900">Makeasy</h1> */}
        <Image src="/logo_full.png" alt="Logo" width={200} height={50} />
      </div>

      {/* 메인 네비게이션 */}
      <nav className="p-4 flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* AUTH PAGES 섹션 */}

        {/* 문서 링크 */}
      </nav>

      {/* 로그아웃 버튼 */}
      <div className="p-4 ">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-start gap-2 px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
        >
          <IoLogOutOutline className="w-5 h-5" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
