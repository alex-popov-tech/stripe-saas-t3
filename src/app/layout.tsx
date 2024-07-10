import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Header } from "./_components/header";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "NFT Icons",
  description: "Buy most unic and expensive icons ever!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{ duration: 4000 }}
        />
        <Header />
        {children}
      </body>
    </html>
  );
}
