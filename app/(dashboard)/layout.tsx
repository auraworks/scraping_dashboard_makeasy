import Sidebar from "@/components/layout/Sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* 좌측 사이드바 */}
      <Sidebar />

      {/* 우측 콘텐츠 영역 */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-sm border border-contents">
          {children}
        </div>
      </main>
    </div>
  );
}
