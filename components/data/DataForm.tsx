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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { IoMenu } from "react-icons/io5";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const dataSchema = z.object({
  dataId: z.string().optional(),
  country: z.string().optional(),
  sourceName: z.string().optional(),
  collectedAt: z.date().optional(),
  publishedAt: z.date().optional(),
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().optional(),
  sourceUrl: z.string().optional(),
  extraData: z.string().optional(),
  category: z.string().optional(),
});

type DataFormValues = z.infer<typeof dataSchema>;

interface DataFormProps {
  initialData?: Partial<DataFormValues> & {
    id?: number;
    collectedAt?: Date | string;
    publishedAt?: Date | string;
  };
  isEdit?: boolean;
}

export function DataForm({
  initialData,
  isEdit = false
}: DataFormProps) {
  const router = useRouter();

  // 카테고리 상태
  const [categories, setCategories] = React.useState<string[]>(
    initialData?.category ? initialData.category.split(',').filter(Boolean).map((c: string) => c.trim()) : []
  );
  const [categoryInput, setCategoryInput] = React.useState("");

  const form = useForm<DataFormValues>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      dataId: initialData?.dataId || "",
      country: initialData?.country || "",
      sourceName: initialData?.sourceName || "",
      collectedAt: initialData?.collectedAt instanceof Date ? initialData.collectedAt : undefined,
      publishedAt: initialData?.publishedAt instanceof Date ? initialData.publishedAt : undefined,
      title: initialData?.title || "",
      content: initialData?.content || "",
      sourceUrl: initialData?.sourceUrl || "",
      extraData: initialData?.extraData || "",
      category: initialData?.category || "",
    },
  });

  // initialData가 변경될 때 필드 동기화
  React.useEffect(() => {
    if (initialData?.dataId) form.setValue("dataId", initialData.dataId);
    if (initialData?.country) form.setValue("country", initialData.country);
    if (initialData?.sourceName) form.setValue("sourceName", initialData.sourceName);
    if (initialData?.collectedAt instanceof Date) form.setValue("collectedAt", initialData.collectedAt);
    if (initialData?.publishedAt instanceof Date) form.setValue("publishedAt", initialData.publishedAt);
    if (initialData?.title) form.setValue("title", initialData.title);
    if (initialData?.content) form.setValue("content", initialData.content);
    if (initialData?.sourceUrl) form.setValue("sourceUrl", initialData.sourceUrl);
    if (initialData?.extraData) form.setValue("extraData", initialData.extraData);
    if (initialData?.category) form.setValue("category", initialData.category);
  }, [initialData, form]);

  // 카테고리 추가
  const addCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && categoryInput.trim()) {
      e.preventDefault();
      if (!categories.includes(categoryInput.trim())) {
        const newCategories = [...categories, categoryInput.trim()];
        setCategories(newCategories);
        form.setValue('category', newCategories.join(', '));
      }
      setCategoryInput("");
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    const newCategories = categories.filter(c => c !== categoryToRemove);
    setCategories(newCategories);
    form.setValue('category', newCategories.join(', '));
  };

  const onSubmit = (data: DataFormValues) => {
    console.log("Form Data:", data);
    alert(isEdit ? "데이터 정보가 수정되었습니다." : "새 데이터가 등록되었습니다.");
    router.back();
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-[2rem] p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

              {/* Row 1: 데이터 ID, 정보원 ID */}
              <FormField
                control={form.control}
                name="dataId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">데이터 ID</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="예: 0000124012600001"
                        className="h-14 w-full rounded-xl bg-gray-100 border-none outline-none focus:ring-4 focus:ring-primary-500/30 text-base font-mono px-5 cursor-not-allowed opacity-70"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sourceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">정보원</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="정보원 이름"
                        className="h-14 w-full rounded-xl bg-gray-100 border-none outline-none focus:ring-4 focus:ring-primary-500/30 text-base font-medium px-5 cursor-not-allowed opacity-70"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row 2: 국가, 카테고리 */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">국가</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="국가"
                        className="h-14 w-full rounded-xl bg-gray-100 border-none outline-none focus:ring-4 focus:ring-primary-500/30 text-base font-medium px-5 cursor-not-allowed opacity-70"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">카테고리</FormLabel>
                    <div className="space-y-3">
                      <FormControl>
                        <Input
                          placeholder="카테고리 입력 후 Enter (예: 경제, IT/과학)"
                          value={categoryInput}
                          onChange={(e) => setCategoryInput(e.target.value)}
                          onKeyDown={addCategory}
                          className="h-14 w-full rounded-xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-base font-medium px-5"
                        />
                      </FormControl>
                      {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {categories.map((cat) => (
                            <Badge
                              key={cat}
                              variant="secondary"
                              className="bg-gray-100 text-gray-700 border-none px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 group hover:bg-gray-200 transition-colors"
                            >
                              {cat}
                              <button
                                type="button"
                                onClick={() => removeCategory(cat)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row 3: 수집일, 발행일 (DatePicker) */}
              <FormField
                control={form.control}
                name="collectedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">수집일</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-14 justify-start text-left font-normal bg-gray-50 border-none rounded-xl px-5 hover:bg-gray-100",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value instanceof Date ? format(field.value, "PPP", { locale: ko }) : <span>수집일 선택</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={ko}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">발행일</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-14 justify-start text-left font-normal bg-gray-50 border-none rounded-xl px-5 hover:bg-gray-100",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP", { locale: ko }) : <span>발행일 선택</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={ko}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row 4: 제목 (Full Width) */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">제목</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="제목을 입력하세요"
                        className="h-14 w-full rounded-xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-base font-medium px-5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row 5: 원문 URL */}
              <FormField
                control={form.control}
                name="sourceUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">원문 URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/article/..."
                        className="h-14 w-full rounded-xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-base font-mono px-5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row 6: 본문 (Full Width) */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 mt-2">
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">본문</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="수집된 본문 내용..."
                        className="min-h-[250px] rounded-xl bg-gray-50/50 border-none outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-inner p-5 text-base resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row 7: 확장 데이터 (Full Width) */}
              <FormField
                control={form.control}
                name="extraData"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">확장 데이터 (JSON)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-primary-500/10 text-primary-700 border-none py-1 px-3 rounded-lg text-xs font-bold uppercase tracking-wider">
                            JSON
                          </Badge>
                        </div>
                        <Textarea
                          placeholder='{"key": "value", "metadata": {...}}'
                          className="min-h-[150px] rounded-xl bg-gray-50/50 border-none outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-inner p-5 text-base font-mono resize-y"
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
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/data")}
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
