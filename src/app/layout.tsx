import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NavBar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vincent Au",
  description: "Personal website of Vincent Au",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen bg-gradient-to-tr from-slate-900 to-slate-600">
            <NavBar />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
