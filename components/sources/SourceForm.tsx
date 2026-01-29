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
import { IoMenu } from "react-icons/io5";

const sourceSchema = z.object({
  name: z.string().min(1, "소스명을 입력해주세요."),
  url: z.string().url("올바른 URL을 입력해주세요."),
  type: z.string().min(1, "유형을 선택해주세요."),
  cycle: z.string().min(1, "수집 주기를 입력해주세요."),
  status: z.string().min(1, "상태를 선택해주세요."),
  description: z.string().optional(),
  selector_config: z.string().optional(),
});

type SourceFormValues = z.infer<typeof sourceSchema>;

interface SourceFormProps {
  initialData?: Partial<SourceFormValues>;
  isEdit?: boolean;
}

import { Badge } from "@/components/ui/badge";
import { Database, Settings, FileCode, Info } from "lucide-react";

export function SourceForm({ initialData, isEdit = false }: SourceFormProps) {
  const router = useRouter();
  
  const form = useForm<SourceFormValues>({
    resolver: zodResolver(sourceSchema),
    defaultValues: {
      name: initialData?.name || "",
      url: initialData?.url || "",
      type: initialData?.type || "뉴스",
      cycle: initialData?.cycle || "1시간",
      status: initialData?.status || "대기",
      description: initialData?.description || "",
      selector_config: initialData?.selector_config || "",
    },
  });

  const onSubmit = (data: SourceFormValues) => {
    console.log("Form Data:", data);
    alert(isEdit ? "소스 정보가 수정되었습니다." : "새 소스가 등록되었습니다.");
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">소스명</FormLabel>
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
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">수집 대상 URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://news.naver.com" 
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">매체 유형</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-16 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6">
                          <SelectValue placeholder="유형 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                        <SelectItem value="뉴스" className="py-3 text-base">뉴스</SelectItem>
                        <SelectItem value="커뮤니티" className="py-3 text-base">커뮤니티</SelectItem>
                        <SelectItem value="SNS" className="py-3 text-base">SNS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">수집 주기</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="예: 1시간, 30분" 
                        className="h-16 w-full rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row 3 - Full Width Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">상세 설명</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="해당 수집 소스에 대한 간략한 설명을 입력하세요." 
                        className="min-h-[120px] rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all resize-none p-6 text-lg font-medium"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row 4 - Status (half width but in its own row line for balance if needed, or put near others) */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">활성 상태</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-16 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6">
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                        <SelectItem value="수집중" className="py-3 text-base">수집중 (Active)</SelectItem>
                        <SelectItem value="대기" className="py-3 text-base">대기 (Idle)</SelectItem>
                        <SelectItem value="에러" className="py-3 text-base">에러 (Error)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
              
              <div className="hidden md:block"></div> {/* Spacer to keep 2 col for status */}

              {/* Row 5 - Full Width Data Schema */}
              
              
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/sources")}
              className="h-16 w-40 rounded-[1.5rem] border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 transition-all text-lg shadow-sm"
            >
                <IoMenu  className="text-xl"/>
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
