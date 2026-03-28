"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, Trash2, Mail, User, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/hooks/useToast";
import { useCreateAccount, useUpdateAccount, useDeleteAccount } from "@/components/hooks/accounts";
import type { AdminUser } from "@/components/hooks/accounts";

// ── Schemas ────────────────────────────────────────────────────────────────

const createSchema = z
  .object({
    email: z.string().email("올바른 이메일 형식을 입력해주세요."),
    name: z.string().optional(),
    password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

const editSchema = z
  .object({
    name: z.string().optional(),
    password: z.string().optional(),
    passwordConfirm: z.string().optional(),
    status: z.enum(["active", "banned"]),
  })
  .refine((d) => !d.password || d.password.length >= 8, {
    message: "비밀번호는 최소 8자 이상이어야 합니다.",
    path: ["password"],
  })
  .refine((d) => !d.password || d.password === d.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type CreateFormValues = z.infer<typeof createSchema>;
type EditFormValues = z.infer<typeof editSchema>;

// ── Shared styles (matching SourceForm) ────────────────────────────────────

const inputCls =
  "h-16 w-full rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6";

const disabledInputCls =
  "h-16 w-full rounded-2xl bg-gray-100 border-none text-lg font-medium text-gray-500 cursor-not-allowed opacity-100 px-6";

const labelCls =
  "text-base font-bold text-gray-800 ml-1 flex items-center gap-2";

// ── Props ──────────────────────────────────────────────────────────────────

interface AccountFormProps {
  initialData?: AdminUser;
  isEdit?: boolean;
}

// ── Password Input with toggle ─────────────────────────────────────────────

function PasswordInput({
  field,
  placeholder,
}: {
  field: React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> };
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...field}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={`${inputCls} pr-14`}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export default function AccountForm({ initialData, isEdit = false }: AccountFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();

  const isBanned =
    !!initialData?.banned_until && new Date(initialData.banned_until) > new Date();

  // ── Create form ────────────────────────────────────────────────────────

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { email: "", name: "", password: "", passwordConfirm: "" },
  });

  // ── Edit form ──────────────────────────────────────────────────────────

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: initialData?.user_metadata?.name ?? "",
      password: "",
      passwordConfirm: "",
      status: isBanned ? "banned" : "active",
    },
  });

  // ── Submit handlers ────────────────────────────────────────────────────

  const handleCreate = createForm.handleSubmit(async (values) => {
    try {
      const user = await createMutation.mutateAsync({
        email: values.email,
        password: values.password,
        name: values.name || undefined,
      });
      toast.success("계정 생성 완료", `${values.email} 계정이 생성되었습니다.`);
      router.push(`/accounts/${user.id}`);
    } catch (err) {
      toast.error("계정 생성 실패", (err as Error).message);
    }
  });

  const handleEdit = editForm.handleSubmit(async (values) => {
    if (!initialData) return;
    try {
      await updateMutation.mutateAsync({
        id: initialData.id,
        updates: {
          name: values.name,
          password: values.password || undefined,
          banned: values.status === "banned",
        },
      });
      toast.success("계정 수정 완료", "계정 정보가 업데이트되었습니다.");
      editForm.setValue("password", "");
      editForm.setValue("passwordConfirm", "");
    } catch (err) {
      toast.error("계정 수정 실패", (err as Error).message);
    }
  });

  const handleDelete = async () => {
    if (!initialData) return;
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    try {
      await deleteMutation.mutateAsync(initialData.id);
      toast.success("계정 삭제 완료", "계정이 삭제되었습니다.");
      router.push("/accounts");
    } catch (err) {
      toast.error("계정 삭제 실패", (err as Error).message);
      setDeleteConfirm(false);
    }
  };

  // ── Create Mode ────────────────────────────────────────────────────────

  if (!isEdit) {
    return (
      <div className="w-full">
        <Form {...createForm}>
          <form onSubmit={handleCreate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 items-start">

              {/* 이메일 */}
              <FormField
                control={createForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>
                      <Mail className="w-4 h-4 text-primary-500" /> 이메일
                    </FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="email"
                        placeholder="user@example.com"
                        className={inputCls}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* 이름 */}
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>
                      <User className="w-4 h-4 text-primary-500" /> 이름
                    </FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        placeholder="홍길동"
                        className={inputCls}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* 비밀번호 */}
              <FormField
                control={createForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>
                      <Lock className="w-4 h-4 text-primary-500" /> 비밀번호
                    </FormLabel>
                    <FormControl>
                      <PasswordInput field={field} placeholder="최소 8자" />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* 비밀번호 확인 */}
              <FormField
                control={createForm.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>
                      <ShieldCheck className="w-4 h-4 text-primary-500" /> 비밀번호 확인
                    </FormLabel>
                    <FormControl>
                      <PasswordInput field={field} placeholder="비밀번호 재입력" />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/accounts")}
                className="h-12 px-6 rounded-xl font-bold text-gray-500"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="h-12 px-8 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 shadow-lg shadow-primary-200"
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                계정 생성
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  // ── Edit Mode ──────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      <Form {...editForm}>
        <form onSubmit={handleEdit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 items-start">

            {/* 이메일 (읽기전용) */}
            <div className="space-y-2">
              <FormLabel className={labelCls}>
                <Mail className="w-4 h-4 text-primary-500" /> 이메일
              </FormLabel>
              <Input
                disabled
                value={initialData?.email ?? ""}
                className={disabledInputCls}
              />
            </div>

            {/* 이름 */}
            <FormField
              control={editForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>
                    <User className="w-4 h-4 text-primary-500" /> 이름
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="홍길동"
                      className={inputCls}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            {/* 계정 상태 */}
            <FormField
              control={editForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>
                    <ShieldCheck className="w-4 h-4 text-primary-500" /> 계정 상태
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full h-16 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-primary-500/30 focus:bg-white transition-all text-lg font-medium px-6">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                      <SelectItem value="active" className="py-3 text-base">활성</SelectItem>
                      <SelectItem value="banned" className="py-3 text-base">비활성 (차단)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            {/* 새 비밀번호 */}
            <FormField
              control={editForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>
                    <Lock className="w-4 h-4 text-primary-500" />
                    새 비밀번호
                    <span className="text-gray-400 font-normal text-sm ml-1">(선택)</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput field={field} placeholder="변경 시에만 입력" />
                  </FormControl>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            {/* 비밀번호 확인 */}
            <FormField
              control={editForm.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>
                    <ShieldCheck className="w-4 h-4 text-primary-500" />
                    비밀번호 확인
                    <span className="text-gray-400 font-normal text-sm ml-1">(선택)</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput field={field} placeholder="새 비밀번호 재입력" />
                  </FormControl>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />
          </div>

          {/* 버튼 */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className={`h-12 px-6 rounded-xl font-bold transition-all ${
                deleteConfirm
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "text-red-400 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {deleteConfirm ? "정말 삭제하시겠습니까?" : "계정 삭제"}
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/accounts")}
                className="h-12 px-6 rounded-xl font-bold text-gray-500"
              >
                목록으로
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="h-12 px-8 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 shadow-lg shadow-primary-200"
              >
                {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                저장
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
