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
import { Checkbox } from "@/components/ui/checkbox";
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
import { useCategories } from "@/components/hooks/categories";
import {
  useCreateSource,
  useUpdateSource,
} from "@/components/hooks/sources/mutations";
import { useToast } from "@/components/hooks/useToast";
import { Loader2, Box } from "lucide-react";
import type { Country, Json } from "@/types/database";

const COUNTRIES = [
  "가나",
  "과테말라",
  "그리스",
  "나이지리아",
  "남아프리카공화국",
  "네덜란드",
  "뉴질랜드",
  "대만",
  "독일",
  "도미니카공화국",
  "라오스",
  "러시아",
  "루마니아",
  "리투아니아",
  "말레이시아",
  "멕시코",
  "모로코",
  "몽골",
  "미국",
  "미얀마",
  "베네수엘라",
  "베트남",
  "벨기에",
  "벨라루스",
  "브라질",
  "불가리아",
  "방글라데시",
  "사우디아라비아",
  "세르비아",
  "수단",
  "스리랑카",
  "스웨덴",
  "스위스",
  "스페인",
  "슬로바키아",
  "싱가포르",
  "아랍에미리트",
  "아르메니아",
  "아르헨티나",
  "아제르바이잔",
  "알제리",
  "에콰도르",
  "에티오피아",
  "영국",
  "오만",
  "오스트리아",
  "우간다",
  "우즈베키스탄",
  "우크라이나",
  "이라크",
  "이란",
  "이스라엘",
  "이집트",
  "이탈리아",
  "인도",
  "인도네시아",
  "일본",
  "중국",
  "짐바브웨",
  "체코",
  "칠레",
  "카자흐스탄",
  "카타르",
  "캄보디아",
  "캐나다",
  "케냐",
  "코스타리카",
  "코트디부아르",
  "콜롬비아",
  "쿠바",
  "쿠웨이트",
  "크로아티아",
  "키르기스스탄",
  "태국",
  "탄자니아",
  "터키 (튀르키예)",
  "튀니지",
  "파나마",
  "파라과이",
  "파키스탄",
  "페루",
  "포르투갈",
  "폴란드",
  "프랑스",
  "핀란드",
  "필리핀",
  "헝가리",
  "호주",
  "홍콩",
].sort((a, b) => a.localeCompare(b, "ko"));

// Zod 스키마 - actions는 form에서 관리하지 않음 (별도 state 사용)
const sourceSchema = z.object({
  country: z.string().min(1, "국가를 선택해주세요."),
  name: z.string().min(1, "정보원명을 입력해주세요."),
  url: z.string().min(1, "URL을 입력해주세요."),
  type: z.string().optional(),
  cycle: z.string().optional(),
  status: z.string().min(1, "상태를 선택해주세요."),
  parsingPrompt: z.string().optional(),
  description: z.string().optional(),
  articleClass: z.string().optional(),
  contentClass: z
    .object({ type: z.enum(["XPath", "CSS"]), value: z.string() })
    .optional()
    .nullable(),
  isOneDepth: z.boolean(),
});

type SourceFormValues = z.infer<typeof sourceSchema>;

// Action 타입 정의
interface Action {
  type: "XPath" | "CSS";
  value: string;
  iteration?: number;
}

interface SourceFormProps {
  initialData?: {
    id?: number;
    country?: Country | null;
    name?: string | null;
    url?: string | null;
    category?: string[] | null;
    type?: string;
    frequency?: number | null;
    is_live?: boolean | null;
    actions?: Json | null;
    prompt?: string | null;
    article_class?: string | null;
    content_class?: Json | null;
    memo?: string | null;
    created_at?: string;
    last_collected?: string;
    source_id?: string | null;
    "1depth"?: boolean | null;
  };
  isEdit?: boolean;
}

import { Badge } from "@/components/ui/badge";
import {
  Database,
  Globe,
  Calendar,
  Clock,
  Hash,
  X,
  PlusCircle,
  ListOrdered,
  Brain,
} from "lucide-react";

// DB 데이터를 UI 형식으로 변환하는 함수들
const normalizeType = (t: string): "XPath" | "CSS" =>
  t?.toLowerCase() === "css" ? "CSS" : "XPath";

const parseActionsFromDB = (raw: unknown): Action[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((a) => a && typeof a === "object" && "value" in a)
    .map((a) => ({
      type: normalizeType((a as { type: string }).type),
      value: (a as { value: string }).value,
      iteration: (a as { iteration?: number }).iteration,
    }));
};

const parseContentClassFromDB = (
  raw: unknown,
): { type: "XPath" | "CSS"; value: string } | null => {
  const arr = Array.isArray(raw) ? raw : null;
  const first = arr?.[0];
  if (!first || typeof first !== "object" || !("value" in first)) return null;
  return {
    type: normalizeType((first as { type: string }).type),
    value: (first as { value: string }).value,
  };
};

export function SourceForm({ initialData, isEdit = false }: SourceFormProps) {
  const router = useRouter();
  // 유형1 (최상위 카테고리)
  const { data: cat1List = [], isLoading: isCat1Loading } = useCategories(null);
  // 유형2 (선택된 유형1의 하위 카테고리)
  const [selectedCat1Id, setSelectedCat1Id] = React.useState<string | null>(null);
  const { data: cat2List = [] } = useCategories(
    selectedCat1Id ?? undefined,
    { enabled: !!selectedCat1Id }
  );

  // 기존 데이터에서 유형1 복원
  React.useEffect(() => {
    if (initialData?.category && cat1List.length > 0 && !selectedCat1Id) {
      const cat1Names = cat1List.map(c => c.name);
      const matchedName = initialData.category.find(name => cat1Names.includes(name));
      if (matchedName) {
        const cat1 = cat1List.find(c => c.name === matchedName);
        if (cat1) setSelectedCat1Id(cat1.id);
      }
    }
  }, [initialData?.category, cat1List]);

  // ========== 독립 State 관리 (form과 분리) ==========
  // types: 카테고리 배열
  const [types, setTypes] = React.useState<string[]>(
    initialData?.category || [],
  );

  // actions: 동작 설정 배열
  const [actions, setActions] = React.useState<Action[]>(() =>
    parseActionsFromDB(initialData?.actions),
  );

  // contentClass: 컨텐츠 영역 설정
  const [contentClass, setContentClass] = React.useState<{
    type: "XPath" | "CSS";
    value: string;
  } | null>(() => parseContentClassFromDB(initialData?.content_class));

  // 현재 입력 중인 action 값
  const [currentActionType, setCurrentActionType] = React.useState<
    "XPath" | "CSS"
  >("XPath");
  const [currentActionValue, setCurrentActionValue] = React.useState("");
  const [currentIteration, setCurrentIteration] = React.useState<number>(1);

  // ========== initialData 변경 시 state 동기화 ==========
  React.useEffect(() => {
    if (initialData) {
      setTypes(initialData.category || []);
      setActions(parseActionsFromDB(initialData.actions));
      const cc = parseContentClassFromDB(initialData.content_class);
      setContentClass(cc);
      if (cc) {
        setCurrentActionType(cc.type);
      }
    }
  }, [initialData]);

  // ========== React Hook Form ==========
  const form = useForm<SourceFormValues>({
    resolver: zodResolver(sourceSchema),
    defaultValues: {
      country: initialData?.country ?? "대한민국",
      name: initialData?.name ?? "",
      url: initialData?.url ?? "",
      type: initialData?.category?.join(", ") ?? "",
      cycle: initialData?.frequency?.toString() ?? "",
      status: initialData?.is_live === true ? "수집함" : "수집안함",
      parsingPrompt: initialData?.prompt ?? "",
      description: initialData?.memo ?? "",
      articleClass: initialData?.article_class ?? "",
      contentClass: parseContentClassFromDB(initialData?.content_class),
      isOneDepth: initialData?.["1depth"] ?? false,
    },
  });

  // ========== 핸들러 함수들 ==========
  const handleCat1Select = (cat1Id: string) => {
    const cat1 = cat1List.find(c => c.id === cat1Id);
    if (!cat1) return;
    setSelectedCat1Id(cat1Id);
    setTypes([cat1.name]);
  };

  const handleCat2Select = (cat2Name: string) => {
    const cat1Names = cat1List.map(c => c.name);
    const cat1InTypes = types.find(t => cat1Names.includes(t));
    setTypes(cat1InTypes ? [cat1InTypes, cat2Name] : [cat2Name]);
  };

  const removeType = (typeToRemove: string) => {
    const cat1Names = cat1List.map(c => c.name);
    if (cat1Names.includes(typeToRemove)) {
      setSelectedCat1Id(null);
      setTypes([]);
      return;
    }
    setTypes(types.filter((t) => t !== typeToRemove));
  };

  const addAction = () => {
    if (currentActionValue.trim()) {
      setActions([
        ...actions,
        {
          type: currentActionType,
          value: currentActionValue.trim(),
          iteration: currentIteration || 1,
        },
      ]);
      setCurrentActionValue("");
      setCurrentIteration(1);
    }
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const updateAction = (index: number, updates: Partial<Action>) => {
    setActions(
      actions.map((action, i) =>
        i === index ? { ...action, ...updates } : action,
      ),
    );
  };

  const updateContentClass = (type: "XPath" | "CSS", value: string) => {
    if (value.trim()) {
      setContentClass({ type, value: value.trim() });
    } else {
      setContentClass(null);
    }
  };

  // ========== Mutations ==========
  const toast = useToast();

  const { mutate: createSource, isPending: isCreating } = useCreateSource({
    onSuccess: () => {
      toast.success("등록 완료", "새 정보원이 등록되었습니다.");
      router.push("/sources");
    },
    onError: (error) => {
      toast.error("등록 실패", error.message);
    },
  });

  const { mutate: updateSource, isPending: isUpdating } = useUpdateSource({
    onSuccess: () => {
      toast.success("수정 완료", "정보원 정보가 수정되었습니다.");
      router.push("/sources");
    },
    onError: (error) => {
      toast.error("수정 실패", error.message);
    },
  });

  const isLoadingSubmitting = isCreating || isUpdating;

  // ========== 폼 제출 ==========
  const onInvalidSubmit = () => {
    toast.error("입력 오류", "필수 항목을 모두 올바르게 입력해주세요.");
  };

  const onSubmit = (values: SourceFormValues) => {
    // DB 전송용 데이터 구성 - state 값을 직접 사용
    const dbData = {
      country: values.country as Country,
      name: values.name,
      url: values.url,
      category: types.length > 0 ? types : null,
      prompt: values.parsingPrompt || null,
      frequency:
        values.cycle === "일주일"
          ? 7
          : values.cycle === "월간"
            ? 30
            : values.cycle === "분기"
              ? 90
              : 1,
      is_live: values.status === "수집함",
      // actions state를 직접 사용
      actions:
        actions.length > 0
          ? actions.map((a, i) => ({
            type: a.type.toLowerCase(),
            value: a.value,
            sequence: i + 1,
            iteration: a.iteration || 1,
          }))
          : [],
      article_class: values.articleClass || null,
      // contentClass state를 직접 사용
      content_class: contentClass
        ? [
          {
            type: contentClass.type.toLowerCase(),
            value: contentClass.value,
            sequence: 1,
          },
        ]
        : null,
      source_id: initialData?.source_id || null,
      memo: values.description || null,
      "1depth": values.isOneDepth,
    };

    console.log("=== SUBMIT DEBUG ===");
    console.log("actions state:", actions);
    console.log("contentClass state:", contentClass);
    console.log("dbData.actions:", dbData.actions);
    console.log("dbData.content_class:", dbData.content_class);
    console.log("====================");

    if (isEdit && initialData?.id) {
      updateSource({ id: initialData.id, updates: dbData });
    } else {
      createSource(dbData);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
          className="space-y-8"
        >
          <div className="bg-white rounded-[2rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 items-start">
              {/* Row: ID & Registered Date & Last Collected (Only in Edit Mode) */}
              {isEdit && (
                <>
                  <div className="space-y-2">
                    <FormLabel className="text-base font-bold text-gray-400 ml-1 flex items-center gap-2">
                      <Hash className="w-4 h-4" /> 정보원 ID
                    </FormLabel>
                    <Input
                      disabled
                      value={`#${initialData?.id || "N/A"}`}
                      className="h-16 w-full rounded-2xl bg-gray-100 border-none text-lg font-mono font-bold text-gray-500 cursor-not-allowed opacity-100 px-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel className="text-base font-bold text-gray-400 ml-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> 등록일
                    </FormLabel>
                    <Input
                      disabled
                      value={initialData?.created_at || "N/A"}
                      className="h-16 w-full rounded-2xl bg-gray-100 border-none text-lg font-medium text-gray-500 cursor-not-allowed opacity-100 px-6"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <FormLabel className="text-base font-bold text-gray-400 ml-1 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> 마지막 수집일
                    </FormLabel>
                    <Input
                      disabled
                      value={initialData?.last_collected || "수집 내역 없음"}
                      className="h-16 w-full rounded-2xl bg-gray-100 border-none text-lg font-medium text-gray-500 cursor-not-allowed opacity-100 px-6"
                    />
                  </div>
                </>
              )}

              {/* Row: Country & Name */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary-500" /> 국가
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-16 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6">
                          <SelectValue placeholder="국가 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                        <SelectItem value="대한민국" className="py-3 text-base">
                          대한민국
                        </SelectItem>
                        {COUNTRIES.filter((c) => c !== "대한민국").map(
                          (country) => (
                            <SelectItem
                              key={country}
                              value={country}
                              className="py-3 text-base"
                            >
                              {country}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1 flex items-center gap-2">
                      <Database className="w-4 h-4 text-primary-500" /> 정보원명
                    </FormLabel>
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

              {/* Row: URL & Type */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">
                      URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
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
                name="type"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">
                      유형
                    </FormLabel>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        {/* 유형1 선택 */}
                        <Select onValueChange={handleCat1Select} value={selectedCat1Id || ""}>
                          <FormControl>
                            <SelectTrigger className="h-16 flex-1 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6">
                              <SelectValue placeholder="유형1 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                            {isCat1Loading ? (
                              <SelectItem value="_loading" disabled className="py-3 text-base text-gray-400">
                                로딩 중...
                              </SelectItem>
                            ) : cat1List.length === 0 ? (
                              <SelectItem value="_empty" disabled className="py-3 text-base text-gray-400">
                                등록된 유형이 없습니다
                              </SelectItem>
                            ) : (
                              cat1List.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id} className="py-3 text-base">
                                  {cat.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>

                        {/* 유형2 선택 */}
                        <Select
                          onValueChange={handleCat2Select}
                          disabled={!selectedCat1Id}
                          value={types.find(t => !cat1List.some(c => c.name === t)) ?? ""}
                        >
                          <SelectTrigger
                            className="h-16 flex-1 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!selectedCat1Id}
                          >
                            <SelectValue placeholder={selectedCat1Id ? "유형2 선택" : "유형1 먼저 선택"} />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                            {cat2List.length === 0 ? (
                              <SelectItem value="_empty" disabled className="py-3 text-base text-gray-400">
                                하위 유형이 없습니다
                              </SelectItem>
                            ) : (
                              cat2List.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name} className="py-3 text-base">
                                  {cat.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <p className="text-xs text-gray-400 ml-1 leading-relaxed">
                        유형1을 먼저 선택한 후, 세부 유형(유형2)을 선택할 수 있습니다.
                      </p>
                    </div>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row: Cycle & Status */}
              <FormField
                control={form.control}
                name="cycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">
                      수집 주기
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="예: 일주일, 1시간"
                        className="h-16 w-full rounded-2xl bg-gray-100 border-none text-lg font-medium text-gray-500 cursor-not-allowed px-6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">
                      상태
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-16 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6">
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                        <SelectItem value="수집함" className="py-3 text-base">
                          수집함
                        </SelectItem>
                        <SelectItem value="수집안함" className="py-3 text-base">
                          수집안함
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 pt-4">
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">
                      메모 및 상세 설명
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="해당 정보원에 대한 간략한 설명을 입력하세요."
                        className="min-h-[100px] rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all resize-none p-6 text-lg font-medium"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Row: Actions (Pagination Settings) */}
              <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100 mt-4">
                <div className="flex flex-col gap-1">
                  <FormLabel className="text-base font-extrabold text-gray-900 ml-1 flex items-center gap-2">
                    <ListOrdered className="w-5 h-5 text-primary-500" /> 동작
                    설정 (Actions)
                  </FormLabel>
                  <p className="text-xs text-gray-400 ml-1 text-red-500 font-bold">
                    XPATH 혹은 CSS를 넣어주세요.(가급적 NEXT버튼)
                  </p>
                </div>

                <div className="bg-gray-50/50 p-6 rounded-[1.5rem] border border-gray-100 flex flex-col md:flex-row items-end gap-3">
                  <div className="flex-shrink-0 w-full md:w-32 space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">
                      유형
                    </label>
                    <Select
                      value={currentActionType}
                      onValueChange={(v: "XPath" | "CSS") =>
                        setCurrentActionType(v)
                      }
                    >
                      <SelectTrigger className="h-14 bg-white rounded-xl border-none shadow-sm font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                        <SelectItem value="XPath" className="font-medium">
                          XPath
                        </SelectItem>
                        <SelectItem value="CSS" className="font-medium">
                          CSS
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-grow w-full space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">
                      선택자 값 (Selector)
                    </label>
                    <Input
                      placeholder={
                        currentActionType === "XPath"
                          ? "//button[@title='Next']"
                          : ".pagination-next"
                      }
                      value={currentActionValue}
                      onChange={(e) => setCurrentActionValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addAction();
                        }
                      }}
                      className="h-14 bg-white rounded-xl border-none shadow-sm text-base font-medium"
                    />
                  </div>
                  <div className="flex-shrink-0 w-full md:w-32 space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">
                      반복 횟수
                    </label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      value={currentIteration}
                      onChange={(e) =>
                        setCurrentIteration(parseInt(e.target.value) || 1)
                      }
                      className="h-14 bg-white rounded-xl border-none shadow-sm font-bold text-center"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={addAction}
                    className="h-14 w-14 p-0 hover:bg-transparent hover:scale-110 transition-transform flex-shrink-0 mt-auto"
                  >
                    <PlusCircle className="w-12 h-12 text-primary-500 stroke-[2.5px]" />
                  </Button>
                </div>

                {/* Stored Actions List */}
                {actions.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {actions.map((action, index) => (
                      <div
                        key={`${index}`}
                        className="group flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all animate-in fade-in slide-in-from-top-2"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold font-mono">
                          {index + 1}
                        </div>

                        <div className="flex-shrink-0 w-full md:w-32">
                          <Select
                            value={action.type}
                            onValueChange={(v: "XPath" | "CSS") =>
                              updateAction(index, { type: v })
                            }
                          >
                            <SelectTrigger className="h-10 bg-gray-50 rounded-xl border-none shadow-none font-bold text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                              <SelectItem value="XPath" className="text-xs">
                                XPath
                              </SelectItem>
                              <SelectItem value="CSS" className="text-xs">
                                CSS
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex-grow w-full">
                          <Input
                            value={action.value}
                            onChange={(e) =>
                              updateAction(index, { value: e.target.value })
                            }
                            className="h-10 bg-gray-50 rounded-xl border-none shadow-none text-xs font-mono font-medium"
                          />
                        </div>

                        <div className="flex-shrink-0 w-full md:w-24 flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={action.iteration || 1}
                            onChange={(e) =>
                              updateAction(index, {
                                iteration: parseInt(e.target.value) || 1,
                              })
                            }
                            className="h-10 bg-gray-50 rounded-xl border-none shadow-none font-bold text-xs text-center"
                          />
                          <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">회 반복</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeAction(index)}
                          className="flex-shrink-0 p-2 text-gray-300 hover:text-rose-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {actions.length === 0 && (
                  <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-[1.5rem]">
                    <p className="text-sm text-gray-300 font-medium italic">
                      등록된 동작이 없습니다.
                    </p>
                  </div>
                )}

                {/* Article Class Settings */}
                <div className="md:col-span-2 space-y-4 pt-6 border-t border-gray-100 mt-6">
                  <div className="flex flex-col gap-1">
                    <FormLabel className="text-base font-extrabold text-gray-900 ml-1 flex items-center gap-2">
                      <Hash className="w-5 h-5 text-primary-500" /> 아티클
                      클래스 설정 
                    </FormLabel>
                    <p className="text-xs text-gray-400 ml-1 text-red-500 font-bold">
                      클래스 네임을 넣어주세요
                    </p>
                  </div>

                  <div className="bg-gray-50/50 p-6 rounded-[1.5rem] border border-gray-100 flex flex-col md:flex-row items-end gap-3">
                    <div className="flex-shrink-0 w-full md:w-32 space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1">
                        유형
                      </label>
                      <Select value="CSS" disabled>
                        <SelectTrigger className="h-14 bg-white rounded-xl border-none shadow-sm font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                          <SelectItem value="CSS" className="font-medium">
                            클래스명
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-grow w-full space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1">
                        클래스 이름 (Class Name)
                      </label>
                      <FormField
                        control={form.control}
                        name="articleClass"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="예: article, post, news-item"
                                value={field.value || ""}
                                onChange={field.onChange}
                                className="h-14 bg-white rounded-xl border-none shadow-sm text-base font-medium"
                              />
                            </FormControl>
                            <FormMessage className="text-xs font-medium" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Content Class Settings */}
                <div className="md:col-span-2 space-y-4 pt-6 border-t border-gray-100 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <FormLabel className="text-base font-extrabold text-gray-900 ml-1 flex items-center gap-2">
                        <Box className="w-5 h-5 text-primary-500" /> 컨텐츠 영역
                        설정 
                      </FormLabel>
                      <p className="text-xs text-gray-400 ml-1 text-red-500 font-bold">
                        XPATH혹은 CSS를 넣어주세요
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="isOneDepth"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-3 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-bold text-gray-700 cursor-pointer">
                            1뎁스
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>


                  <div
                    className={`bg-gray-50/50 p-6 rounded-[1.5rem] border border-gray-100 flex flex-col md:flex-row items-end gap-3 transition-all duration-300 ${form.watch("isOneDepth")
                      ? "opacity-50 grayscale bg-gray-100 shadow-inner scale-[0.99] pointer-events-none"
                      : "opacity-100"
                      }`}
                  >
                    <div className="flex-shrink-0 w-full md:w-32 space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1">
                        유형
                      </label>
                      <Select
                        value={contentClass?.type || "XPath"}
                        onValueChange={(v: "XPath" | "CSS") =>
                          updateContentClass(v, contentClass?.value || "")
                        }
                      >
                        <SelectTrigger className="h-14 bg-white rounded-xl border-none shadow-sm font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                          <SelectItem value="XPath" className="font-medium">
                            XPath
                          </SelectItem>
                          <SelectItem value="CSS" className="font-medium">
                            CSS
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-grow w-full space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1">
                        선택자 값 (Selector)
                      </label>
                      <Input
                        placeholder={
                          contentClass?.type === "XPath"
                            ? "//div[@class='article-content']"
                            : ".article-content"
                        }
                        value={contentClass?.value || ""}
                        onChange={(e) =>
                          updateContentClass(
                            contentClass?.type || "XPath",
                            e.target.value,
                          )
                        }
                        className="h-14 bg-white rounded-xl border-none shadow-sm text-base font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Parsing Prompt */}
                <FormField
                  control={form.control}
                  name="parsingPrompt"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 pt-6 border-t border-gray-100 mt-6">
                      <div className="flex flex-col gap-1 mb-4">
                        <FormLabel className="text-base font-extrabold text-gray-900 ml-1 flex items-center gap-2">
                          <Brain className="w-5 h-5 text-primary-500" />{" "}
                          상세페이지 파싱 프롬프트
                        </FormLabel>
                        <p className="text-xs text-gray-400 ml-1 leading-relaxed">
                          상세페이지의 본문, 제목, 날짜 등을 추출하기 위한 AI
                          프롬프트를 설정합니다.
                          <br />
                          추출해야 할 데이터 필드와 파싱 규칙을 명확하게 입력해
                          주세요.
                        </p>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="예: 아래 HTML 구조에서 뉴스 제목은 h1.title, 본문은 div.content 내의 모든 p 태그입니다. 날짜는 span.date에서 YYYY-MM-DD 형식으로 추출해줘."
                          className="min-h-[180px] rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all p-6 text-lg font-medium leading-relaxed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />
              </div>
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
              <IoMenu className="text-xl" />
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
                disabled={isLoadingSubmitting}
                className="h-16 w-40 rounded-[1.5rem] bg-primary-500 hover:bg-primary-600 text-white shadow-xl shadow-primary-500/20 font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoadingSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : isEdit ? (
                  "수정"
                ) : (
                  "등록"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
