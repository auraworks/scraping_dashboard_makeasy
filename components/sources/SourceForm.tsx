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

const COUNTRIES = [
  "가나", "과테말라", "그리스", "나이지리아", "남아프리카공화국", "네덜란드", "뉴질랜드", "대만", "독일", "도미니카공화국", "라오스", "러시아", "루마니아", "리투아니아", "말레이시아", "멕시코", "모로코", "몽골", "미국", "미얀마", "베네수엘라", "베트남", "벨기에", "벨라루스", "브라질", "불가리아", "방글라데시", "사우디아라비아", "세르비아", "수단", "스리랑카", "스웨덴", "스위스", "스페인", "슬로바키아", "싱가포르", "아랍에미리트", "아르메니아", "아르헨티나", "아제르바이잔", "알제리", "에콰도르", "에티오피아", "영국", "오만", "오스트리아", "우간다", "우즈베키스탄", "우크라이나", "이라크", "이란", "이스라엘", "이집트", "이탈리아", "인도", "인도네시아", "일본", "중국", "짐바브웨", "체코", "칠레", "카자흐스탄", "카타르", "캄보디아", "캐나다", "케냐", "코스타리카", "코트디부아르", "콜롬비아", "쿠바", "쿠웨이트", "크로아티아", "키르기스스탄", "태국", "탄자니아", "터키 (튀르키예)", "튀니지", "파나마", "파라과이", "파키스탄", "페루", "포르투갈", "폴란드", "프랑스", "핀란드", "필리핀", "헝가리", "호주", "홍콩"
].sort((a, b) => a.localeCompare(b, 'ko'));

const actionSchema = z.object({
  type: z.enum(["XPath", "CSS"]),
  value: z.string().min(1, "값을 입력해주세요."),
});

const sourceSchema = z.object({
  country: z.string().min(1, "국가를 선택해주세요."),
  name: z.string().min(1, "정보원명을 입력해주세요."),
  url: z.string().url("올바른 URL을 입력해주세요."),
  type: z.string().min(1, "유형을 선택해주세요."),
  cycle: z.string().min(1, "수집 주기를 입력해주세요."),
  status: z.string().min(1, "상태를 선택해주세요."),
  actions: z.array(actionSchema),
  parsingPrompt: z.string().optional(),
  description: z.string().optional(),
});

type SourceFormValues = z.infer<typeof sourceSchema>;

interface SourceFormProps {
  initialData?: any;
  isEdit?: boolean;
}

import { Badge } from "@/components/ui/badge";
import {
  Database, Settings, FileCode, Info, Globe, Calendar,
  Clock, Hash, ChevronDown, X, MousePointer2, PlusCircle,
  GripVertical, ListOrdered, Code2, MessageSquareCode, Brain
} from "lucide-react";

export function SourceForm({ initialData, isEdit = false }: SourceFormProps) {
  const router = useRouter();
  const [types, setTypes] = React.useState<string[]>(
    initialData?.type ? initialData.type.split(',').filter(Boolean).map((t: string) => t.trim()) : []
  );
  const [typeInput, setTypeInput] = React.useState("");

  // Actions state for UI
  const [actions, setActions] = React.useState<{ type: "XPath" | "CSS", value: string }[]>(
    initialData?.actions || []
  );
  const [currentActionType, setCurrentActionType] = React.useState<"XPath" | "CSS">("XPath");
  const [currentActionValue, setCurrentActionValue] = React.useState("");

  const form = useForm<SourceFormValues>({
    resolver: zodResolver(sourceSchema),
    defaultValues: {
      country: initialData?.country || "대한민국",
      name: initialData?.name || "",
      url: initialData?.url || "",
      type: initialData?.type || "",
      cycle: initialData?.cycle || "일주일",
      status: initialData?.status || "대기",
      actions: initialData?.actions || [],
      parsingPrompt: initialData?.parsingPrompt || "",
      description: initialData?.description || "",
    },
  });

  const addType = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && typeInput.trim()) {
      e.preventDefault();
      if (!types.includes(typeInput.trim())) {
        const newTypes = [...types, typeInput.trim()];
        setTypes(newTypes);
        form.setValue('type', newTypes.join(', '));
      }
      setTypeInput("");
    }
  };

  const removeType = (typeToRemove: string) => {
    const newTypes = types.filter(t => t !== typeToRemove);
    setTypes(newTypes);
    form.setValue('type', newTypes.join(', '));
  };

  const addAction = () => {
    if (currentActionValue.trim()) {
      const newAction = { type: currentActionType, value: currentActionValue.trim() };
      const newActions = [...actions, newAction];
      setActions(newActions);
      form.setValue('actions', newActions);
      setCurrentActionValue("");
    }
  };

  const removeAction = (index: number) => {
    const newActions = actions.filter((_, i) => i !== index);
    setActions(newActions);
    form.setValue('actions', newActions);
  };

  const onSubmit = (data: SourceFormValues) => {
    console.log("Form Data:", data);
    alert(isEdit ? "정보원 정보가 수정되었습니다." : "새 정보원이 등록되었습니다.");
    router.back();
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-16 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6">
                          <SelectValue placeholder="국가 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-gray-100 shadow-2xl max-h-[300px]">
                        <SelectItem value="대한민국" className="py-3 text-base">대한민국</SelectItem>
                        {COUNTRIES.filter(c => c !== "대한민국").map((country) => (
                          <SelectItem key={country} value={country} className="py-3 text-base">
                            {country}
                          </SelectItem>
                        ))}
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
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">URL</FormLabel>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">매체 유형</FormLabel>
                    <div className="space-y-3">
                      <FormControl>
                        <Input
                          placeholder="유형 입력 후 Enter (예: 뉴스, 커뮤니티)"
                          value={typeInput}
                          onChange={(e) => setTypeInput(e.target.value)}
                          onKeyDown={addType}
                          className="h-16 w-full rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6"
                        />
                      </FormControl>
                      <p className="text-xs text-gray-400 ml-1 leading-relaxed">
                        해당 정보원의 매체 성격을 입력해 주세요. (예: 뉴스, 블로그, 카페 등)
                        여러 개의 유형을 입력하려면 단어 입력 후 <strong>엔터(Enter)</strong>를 눌러주세요.
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

              {/* Row: Cycle & Status */}
              <FormField
                control={form.control}
                name="cycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">수집 주기</FormLabel>
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
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">상태</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-16 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6">
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                        <SelectItem value="수집중" className="py-3 text-base">수집중</SelectItem>
                        <SelectItem value="대기" className="py-3 text-base">대기</SelectItem>
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
                    <FormLabel className="text-base font-bold text-gray-800 ml-1">메모 및 상세 설명</FormLabel>
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
                    <ListOrdered className="w-5 h-5 text-primary-500" /> 동작 설정 (Actions)
                  </FormLabel>
                  <p className="text-xs text-gray-400 ml-1">
                    페이지네이션 클릭 등 순차적으로 수행할 동작의 XPath 또는 CSS 선택자를 입력하세요.
                  </p>
                </div>

                <div className="bg-gray-50/50 p-6 rounded-[1.5rem] border border-gray-100 flex flex-col md:flex-row items-end gap-3">
                  <div className="flex-shrink-0 w-full md:w-32 space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">유형</label>
                    <Select
                      value={currentActionType}
                      onValueChange={(v: "XPath" | "CSS") => setCurrentActionType(v)}
                    >
                      <SelectTrigger className="h-14 bg-white rounded-xl border-none shadow-sm font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                        <SelectItem value="XPath" className="font-medium">XPath</SelectItem>
                        <SelectItem value="CSS" className="font-medium">CSS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-grow w-full space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">선택자 값 (Selector)</label>
                    <Input
                      placeholder={currentActionType === "XPath" ? "//button[@title='Next']" : ".pagination-next"}
                      value={currentActionValue}
                      onChange={(e) => setCurrentActionValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAction(); } }}
                      className="h-14 bg-white rounded-xl border-none shadow-sm text-base font-medium"
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
                        key={index}
                        className="group flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all animate-in fade-in slide-in-from-top-2"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold font-mono">
                          {index + 1}
                        </div>
                        <div className="flex-shrink-0 px-3 py-1 rounded-lg bg-primary-50 text-primary-700 text-xs font-extrabold uppercase tracking-tight">
                          {action.type}
                        </div>
                        <div className="flex-grow font-mono text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg truncate">
                          {action.value}
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
                    <p className="text-sm text-gray-300 font-medium italic">등록된 동작이 없습니다.</p>
                  </div>
                )}
              </div>

              {/* Parsing Prompt */}
              <FormField
                control={form.control}
                name="parsingPrompt"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 pt-6 border-t border-gray-100 mt-6">
                    <div className="flex flex-col gap-1 mb-4">
                      <FormLabel className="text-base font-extrabold text-gray-900 ml-1 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary-500" /> 상세페이지 파싱 프롬프트
                      </FormLabel>
                      <p className="text-xs text-gray-400 ml-1 leading-relaxed">
                        상세페이지의 본문, 제목, 날짜 등을 추출하기 위한 AI 프롬프트를 설정합니다.<br />
                        추출해야 할 데이터 필드와 파싱 규칙을 명확하게 입력해 주세요.
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

              {/* Description */}
              
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
