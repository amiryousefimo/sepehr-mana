import type {ReactNode} from "react";
import "vazirmatn/Vazirmatn-Variable-font-face.css";
import "./globals.css";

// Root layout — provides <html> and <body> for all routes.
// The [locale] layout updates lang/dir client-side via LocaleAttributes.
// Admin routes inherit this shell and use their own inner layout.
export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
