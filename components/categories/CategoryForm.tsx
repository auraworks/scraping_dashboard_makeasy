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
import { useAddCategory, useRenameCategory } from "@/components/hooks/categories";
import { useToast } from "@/components/hooks/useToast";

const categorySchema = z.object({
    name: z.string().min(1, "유형명을 입력해주세요."),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
    initialData?: Partial<CategoryFormValues> & { id?: string | number };
    isEdit?: boolean;
}

export function CategoryForm({ initialData, isEdit = false }: CategoryFormProps) {
    const router = useRouter();
    const toast = useToast();

    const addCategoryMutation = useAddCategory();
    const renameCategoryMutation = useRenameCategory();

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: (initialData?.name as string) || "",
        },
    });

    const onSubmit = async (data: CategoryFormValues) => {
        if (isEdit) {
            const categoryId = initialData?.id as string;
            const newName = data.name;

            if (categoryId === newName) {
                router.push("/categories");
                return;
            }

            renameCategoryMutation.mutate(
                { id: categoryId, newName },
                {
                    onSuccess: () => {
                        toast.success("성공", "유형명이 수정되었습니다.");
                        router.push("/categories");
                        router.refresh();
                    },
                    onError: (error) => {
                        toast.error("오류", error.message || "수정 중 오류가 발생했습니다.");
                    },
                }
            );
        } else {
            addCategoryMutation.mutate(data.name, {
                onSuccess: () => {
                    toast.success("성공", "새 유형이 등록되었습니다.");
                    router.push("/categories");
                    router.refresh();
                },
                onError: (error) => {
                    toast.error("오류", error.message || "등록 중 오류가 발생했습니다.");
                },
            });
        }
    };

    const isLoading = addCategoryMutation.isPending || renameCategoryMutation.isPending;

    return (
        <div className="w-full ">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 gap-y-8">
                            {isEdit && (
                                <div className="space-y-2">
                                    <FormLabel className="text-base font-bold text-gray-400 ml-1">유형 ID</FormLabel>
                                    <Input
                                        disabled
                                        value={initialData?.id || "N/A"}
                                        className="h-14 w-full rounded-xl bg-gray-100 border-none text-lg font-bold text-gray-500 cursor-not-allowed opacity-100 px-5"
                                    />
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-bold text-gray-800 ml-1">
                                            {isEdit ? "이름" : "유형명"}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="예: 뉴스, 블로그"
                                                className="h-14 w-full rounded-xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-base font-medium px-5"
                                                disabled={isLoading}
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
                                disabled={isLoading}
                                className="h-14 w-28 rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20 font-bold text-base transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "처리중..." : isEdit ? "수정" : "등록"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
