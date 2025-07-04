import { Inter } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({subsets : ["latin"]});
export const metadata = {
  title: "Spend-sible",
  description: "Your Personal Finance Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className= {`${inter.className}`}>
        <Header/>
        <main className="min-h-screen">{children}</main>
        <Toaster richColors/>
        <footer className="bg-blue-50 py-12">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>
              Made by  
             <a href="https://www.linkedin.com/in/sneha-kanodia-147114255/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1">
              Sneha Kanodia </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
   </ClerkProvider>
  );
}
