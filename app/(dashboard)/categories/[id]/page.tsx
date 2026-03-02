import React from "react";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Fetching function from Supabase
async function getCategoryData(id: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data, error } = await supabase.rpc("get_enum_values", {
        p_type_name: "category",
    });

    if (error || !data) return null;

    const values = data as { value: string }[];
    const found = values.find((item) => item.value === decodeURIComponent(id));

    if (!found) return null;

    return { id: found.value, name: found.value };
}

interface EditCategoryPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { id } = await params;
    const initialData = await getCategoryData(id);

    if (!initialData) {
        return (
            <div className="p-8 w-full text-center">
                <h1 className="text-2xl font-bold text-gray-400">존재하지 않는 유형입니다.</h1>
            </div>
        );
    }

    return (
        <div className="p-8 w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">유형 정보 수정</h1>
                <p className="text-gray-500 text-lg">
                    유형명: <span className="text-primary-600 font-bold">"{decodeURIComponent(id)}"</span>의 정보를 수정합니다.
                </p>
            </div>
            <CategoryForm initialData={initialData} isEdit={true} />
        </div>
    );
}
