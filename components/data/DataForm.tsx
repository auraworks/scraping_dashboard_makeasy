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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Database, FileText, Info, Tag, Activity } from "lucide-react";
import { IoMenu } from "react-icons/io5";

const dataSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  source: z.string().min(1, "출처를 입력해주세요."),
  category: z.string().min(1, "카테고리를 선택해주세요."),
  format: z.string().min(1, "포맷을 입력해주세요."),
  status: z.string().min(1, "상태를 선택해주세요."),
  content: z.string().optional(),
});

type DataFormValues = z.infer<typeof dataSchema>;

interface DataFormProps {
  initialData?: Partial<DataFormValues>;
  isEdit?: boolean;
}

export function DataForm({ initialData, isEdit = false }: DataFormProps) {
  const router = useRouter();
  
  const form = useForm<DataFormValues>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      title: initialData?.title || "",
      source: initialData?.source || "",
      category: initialData?.category || "경제",
      format: initialData?.format || "JSON",
      status: initialData?.status || "대기",
      content: initialData?.content || "",
    },
  });

  const onSubmit = (data: DataFormValues) => {
    console.log("Form Data:", data);
    alert(isEdit ? "데이터 정보가 수정되었습니다." : "새 데이터가 등록되었습니다.");
    router.back();
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-[2rem] ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              
              {/* Row 1 */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">데이터 제목</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="데이터 제목을 입력하세요" 
                        className="h-16 w-full rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row 2 */}
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">출처</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="예: 네이버 뉴스" 
                        className="h-16 w-full rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">데이터 포맷</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="예: JSON, CSV" 
                        className="h-16 w-full rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row 3 */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">카테고리</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-16 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6">
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                        <SelectItem value="경제" className="py-3 text-base">경제</SelectItem>
                        <SelectItem value="IT/과학" className="py-3 text-base">IT/과학</SelectItem>
                        <SelectItem value="라이프스타일" className="py-3 text-base">라이프스타일</SelectItem>
                        <SelectItem value="부동산" className="py-3 text-base">부동산</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">처리 상태</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-16 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6">
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                        <SelectItem value="처리완료" className="py-3 text-base">처리완료</SelectItem>
                        <SelectItem value="처리중" className="py-3 text-base">처리중</SelectItem>
                        <SelectItem value="대기" className="py-3 text-base">대기</SelectItem>
                        <SelectItem value="에러" className="py-3 text-base">에러</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              <div className="hidden md:block"></div>

              {/* Row 4 - Full Width Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 mt-4">
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">데이터 내용 (Preview)</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <div className="absolute top-6 right-6 z-10">
                          <Badge className="bg-primary-900/10 text-primary-900 border-none py-1.5 px-3 rounded-lg text-xs font-bold uppercase tracking-widest">
                            {form.watch("format") || "TEXT"}
                          </Badge>
                        </div>
                        <Textarea 
                          placeholder="수집된 데이터 내용..."
                          className="min-h-[300px] rounded-[1.5rem] bg-gray-50/50 border-none outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-inner p-8 text-base font-mono resize-y"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/data")}
              className="h-16 w-40 rounded-[1.5rem] border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 transition-all text-lg shadow-sm"
            >
              <IoMenu className="text-xl mr-2" />
              목록으로
            </Button>
            
            <div className="flex items-center gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                className="h-16 w-40 rounded-[1.5rem] border-none bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-all text-lg"
              >
                취소
              </Button>
              <Button 
                type="submit"
                className="h-16 w-40 rounded-[1.5rem] bg-primary-500 hover:bg-primary-600 text-white shadow-xl shadow-primary-500/20 font-bold text-lg transition-all active:scale-[0.98]"
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
