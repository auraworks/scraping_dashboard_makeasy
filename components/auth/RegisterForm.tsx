"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/components/store/authStore";
import { useToast } from "@/components/hooks/useToast";

export function RegisterForm() {
  const router = useRouter();
  const toast = useToast();
  const setUser = useAuthStore((state) => state.setUser);
  const authError = useAuthStore((state) => state.error);
  const setError = useAuthStore((state) => state.setError);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreedToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        toast.error("회원가입 실패", authError.message);
        return;
      }

      if (authData.user) {
        setUser({
          id: authData.user.id,
          email: authData.user.email || "",
          name: data.name,
        });
        toast.success("회원가입 성공", "대시보드로 이동합니다.");
        router.push("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다.";
      setError(errorMessage);
      toast.error("오류 발생", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
        <p className="text-gray-600">계정을 생성하여 시작하세요</p>
      </div>

      {/* 회원가입 폼 */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {authError}
            </div>
          )}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input
                    placeholder="홍길동"
                    type="text"
                    {...field}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your@mail.com"
                    type="email"
                    {...field}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    {...field}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    {...field}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreedToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-1 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary mt-0.5"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <label className="text-sm font-normal text-gray-600 cursor-pointer">
                    이용약관에 동의합니다
                  </label>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "계정 생성 중..." : "계정 생성"}
          </Button>
        </form>
      </Form>

      {/* 로그인 링크 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
