import "@/styles/globals.css";

import { type Metadata } from "next";
import { pressStart2P } from "@/fonts";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "UX Hero",
  description: "UX Neighbor error mitigation app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${pressStart2P.className}`}>
      <body className="h-dvh grid grid-rows-[67px_1fr_45px]">
        <Nav />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
