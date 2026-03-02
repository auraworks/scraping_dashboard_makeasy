import { notFound } from "next/navigation";
import { DataForm } from "@/components/data/DataForm";
import { getDataById } from "@/components/hooks/datas/apis";

interface EditDataPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDataPage({ params }: EditDataPageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  const data = await getDataById(numericId);

  if (!data) {
    notFound();
  }

  // DataWithSource를 DataForm initialData 형식으로 변환
  const initialData = {
    id: data.id,
    dataId: data.data_id || "",
    country: data.sources?.country || "",
    sourceName: data.sources?.name || "",
    collectedAt: data.collected_at ? new Date(data.collected_at) : undefined,
    publishedAt: data.published_date ? new Date(data.published_date) : undefined,
    title: data.title || "",
    content: data.content || "",
    sourceUrl: data.source_url || "",
    extraData: data.extra_data ? JSON.stringify(data.extra_data, null, 2) : "",
    category: data.category || "",
  };

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">데이터 정보 수정</h1>
        <p className="text-gray-500 text-lg">
          데이터 ID: <span className="text-primary-600 font-mono font-bold">#{data.id}</span>의 정보를 확인하고 수정합니다.
        </p>
      </div>
      <DataForm initialData={initialData} isEdit={true} />
    </div>
  );
}
