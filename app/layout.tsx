import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "@/components/ui/Toast";
import { ModalContainer } from "@/components/ui/Modal";
import { QueryProvider } from "@/components/providers";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "UniCrawl - 범용 크롤링 데이터 대시보드",
    template: "%s | UniCrawl",
  },
  description:
    "다양한 데이터 소스에서 수집한 크롤링 데이터를 통합 관리하고 모니터링하는 대시보드",
  keywords: [
    "크롤링",
    "데이터 수집",
    "데이터 대시보드",
    "웹 스크래핑",
    "모니터링",
  ],
  authors: [{ name: "UniCrawl" }],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "UniCrawl - 범용 크롤링 데이터 대시보드",
    description:
      "다양한 데이터 소스에서 수집한 크롤링 데이터를 통합 관리하고 모니터링하는 대시보드",
    siteName: "UniCrawl",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <ToastContainer />
            <ModalContainer />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
