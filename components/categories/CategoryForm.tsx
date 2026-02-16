"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { IoMenu } from "react-icons/io5";

const categorySchema = z.object({
    name: z.string().min(1, "카테고리명을 입력해주세요."),
    description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
    initialData?: Partial<CategoryFormValues> & { id?: number };
    isEdit?: boolean;
}

export function CategoryForm({ initialData, isEdit = false }: CategoryFormProps) {
    const router = useRouter();

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
        },
    });

    const onSubmit = (data: CategoryFormValues) => {
        console.log("Form Data:", data);
        alert(isEdit ? "카테고리 정보가 수정되었습니다." : "새 카테고리가 등록되었습니다.");
        router.back();
    };

    return (
        <div className="w-full ">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 gap-y-8">
                            {isEdit && (
                                <div className="space-y-2">
                                    <FormLabel className="text-base font-bold text-gray-400 ml-1">ID</FormLabel>
                                    <Input
                                        disabled
                                        value={`#${initialData?.id || "N/A"}`}
                                        className="h-14 w-full rounded-xl bg-gray-100 border-none text-lg font-mono font-bold text-gray-500 cursor-not-allowed opacity-100 px-5"
                                    />
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-bold text-gray-800 ml-1">유형명</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="예: 뉴스, 블로그"
                                                className="h-14 w-full rounded-xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-base font-medium px-5"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs font-medium" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-bold text-gray-800 ml-1">설명</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="카테고리에 대한 간략한 설명"
                                                className="h-14 w-full rounded-xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-base font-medium px-5"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs font-medium" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/categories")}
                            className="h-14 w-36 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 transition-all text-base shadow-sm"
                        >
                            <IoMenu className="text-lg mr-2" />
                            목록으로
                        </Button>

                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="h-14 w-28 rounded-xl border-none bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-all text-base"
                            >
                                취소
                            </Button>
                            <Button
                                type="submit"
                                className="h-14 w-28 rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20 font-bold text-base transition-all active:scale-[0.98]"
                            >
                                {isEdit ? "수정" : "등록"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
