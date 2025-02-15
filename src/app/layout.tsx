import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soru-Cevap Yarışması",
  description: "Soru-Cevap Yarışmasına Hoşgeldiniz. Soruları yanıtlayın ve sınavı bitirin. Daha sonra cevaplarınızı kontrol edebilirsiniz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
