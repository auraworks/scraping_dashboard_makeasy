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

const COUNTRIES = [
  "대한민국", "가나", "과테말라", "그리스", "나이지리아", "남아프리카공화국", "네덜란드", "뉴질랜드", "대만", "독일", "도미니카공화국", "라오스", "러시아", "루마니아", "리투아니아", "말레이시아", "멕시코", "모로코", "몽골", "미국", "미얀마", "베네수엘라", "베트남", "벨기에", "벨라루스", "브라질", "불가리아", "방글라데시", "사우디아라비아", "세르비아", "수단", "스리랑카", "스웨덴", "스위스", "스페인", "슬로바키아", "싱가포르", "아랍에미리트", "아르메니아", "아르헨티나", "아제르바이잔", "알제리", "에콰도르", "에티오피아", "영국", "오만", "오스트리아", "우간다", "우즈베키스탄", "우크라이나", "이라크", "이란", "이스라엘", "이집트", "이탈리아", "인도", "인도네시아", "일본", "중국", "짐바브웨", "체코", "칠레", "카자흐스탄", "카타르", "캄보디아", "캐나다", "케냐", "코스타리카", "코트디부아르", "콜롬비아", "쿠바", "쿠웨이트", "크로아티아", "키르기스스탄", "태국", "탄자니아", "터키 (튀르키예)", "튀니지", "파나마", "파라구아이", "파키스탄", "페루", "포르투갈", "폴란드", "프랑스", "핀란드", "필리핀", "헝가리", "호주", "홍콩"
].sort((a, b) => {
  if (a === "대한민국") return -1;
  if (b === "대한민국") return 1;
  return a.localeCompare(b, 'ko');
});

const TYPE_OPTIONS = [
  { id: 1, name: "뉴스", description: "주요 언론사 뉴스 기사" },
  { id: 2, name: "커뮤니티", description: "주요 커뮤니티 게시글" },
  { id: 3, name: "SNS", description: "소셜 미디어 피드" },
  { id: 4, name: "블로그", description: "개인 및 기업 블로그 포스트" },
  { id: 5, name: "카페", description: "네이버/다음 카페 게시글" },
  { id: 6, name: "기타", description: "기타 수집 데이터" },
];

const dataSchema = z.object({
  issueId: z.string().min(1, "이슈 ID를 입력해주세요."),
  country: z.string().min(1, "국가를 선택해주세요."),
  type: z.string().min(1, "유형을 입력해주세요."),
  collectedAt: z.date({ message: "수집일을 선택해주세요." }),
  publishedAt: z.date({ message: "발행일을 선택해주세요." }),
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().optional(),
  originalUrl: z.string().optional(),
  extendedData: z.string().optional(),
  category: z.string().min(1, "카테고리를 입력해주세요."),
});

type DataFormValues = z.infer<typeof dataSchema>;

interface DataFormProps {
  initialData?: Partial<DataFormValues> & { publishedAt?: Date | string };
  isEdit?: boolean;
}

export function DataForm({
  initialData,
  isEdit = false
}: DataFormProps) {
  const router = useRouter();

  // 유형 상태
  const [types, setTypes] = React.useState<string[]>(
    initialData?.type ? initialData.type.split(',').filter(Boolean).map((t: string) => t.trim()) : []
  );

  // 카테고리 상태
  const [categories, setCategories] = React.useState<string[]>(
    initialData?.category ? initialData.category.split(',').filter(Boolean).map((c: string) => c.trim()) : []
  );
  const [categoryInput, setCategoryInput] = React.useState("");

  // 발행일 상태
  const [publishedDate, setPublishedDate] = React.useState<Date | undefined>(
    initialData?.publishedAt instanceof Date
      ? initialData.publishedAt
      : undefined
  );

  const form = useForm<DataFormValues>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      issueId: initialData?.issueId || "",
      country: initialData?.country || "대한민국",
      type: initialData?.type || "",
      collectedAt: initialData?.collectedAt instanceof Date ? initialData.collectedAt : undefined,
      publishedAt: initialData?.publishedAt instanceof Date ? initialData.publishedAt : undefined,
      title: initialData?.title || "",
      content: initialData?.content || "",
      originalUrl: initialData?.originalUrl || "",
      extendedData: initialData?.extendedData || "",
      category: initialData?.category || "",
    },
  });

  // initialData가 변경될 때 필드 동기화
  React.useEffect(() => {
    if (initialData?.issueId) form.setValue("issueId", initialData.issueId);
    if (initialData?.collectedAt instanceof Date) form.setValue("collectedAt", initialData.collectedAt);
    if (initialData?.publishedAt instanceof Date) form.setValue("publishedAt", initialData.publishedAt);
  }, [initialData, form]);

  // 유형 추가
  const handleTypeSelect = (value: string) => {
    if (value && !types.includes(value)) {
      const newTypes = [...types, value];
      setTypes(newTypes);
      form.setValue('type', newTypes.join(', '));
    }
  };

  const removeType = (typeToRemove: string) => {
    const newTypes = types.filter(t => t !== typeToRemove);
    setTypes(newTypes);
    form.setValue('type', newTypes.join(', '));
  };

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

              {/* Row 1: 이슈 ID, 국가 */}
              <FormField
                control={form.control}
                name="issueId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">이슈 ID</FormLabel>
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">국가</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-14 rounded-xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-base font-medium px-5">
                          <SelectValue placeholder="국가 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-gray-100 shadow-xl max-h-[300px]">
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country} value={country} className="py-2.5 text-base">{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row 2: 유형 (Input + Badge) */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">유형</FormLabel>
                    <div className="space-y-3">
                      <Select onValueChange={handleTypeSelect}>
                        <FormControl>
                          <SelectTrigger className="h-14 w-full rounded-xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-base font-medium px-5">
                            <SelectValue placeholder="유형 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                          {TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.id} value={opt.name} className="py-2.5 text-base">
                              {opt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-400 ml-1 leading-relaxed">
                        데이터의 유형을 선택해 주세요. 여러 개의 유형을 선택하여 추가할 수 있습니다.
                      </p>
                      {types.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {types.map((type) => (
                            <Badge
                              key={type}
                              variant="secondary"
                              className="bg-primary-50 text-primary-600 border-none px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 group hover:bg-primary-100 transition-colors"
                            >
                              {type}
                              <button
                                type="button"
                                onClick={() => removeType(type)}
                                className="text-primary-400 hover:text-primary-600 transition-colors"
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

              {/* Row 3: 카테고리 (Input + Badge) */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
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
                      <p className="text-xs text-gray-400 ml-1 leading-relaxed">
                        데이터의 카테고리를 입력해 주세요. 여러 개의 카테고리를 입력하려면 단어 입력 후 <strong>엔터(Enter)</strong>를 눌러주세요.
                      </p>
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

              {/* Row 4: 수집일, 발행일 (DatePicker) */}
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
                          initialFocus
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
                          initialFocus
                          locale={ko}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row 5: 제목 (Full Width) */}
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

              {/* Row 6: 원문 URL */}
              <FormField
                control={form.control}
                name="originalUrl"
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

              {/* Row 7: 본문 (Full Width) */}
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

              {/* Row 8: 확장 데이터 (Full Width) */}
              <FormField
                control={form.control}
                name="extendedData"
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
