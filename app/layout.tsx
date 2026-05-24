import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
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
  title: "Reiseplanlegger",
  description: "Planlegg reisen din enkelt og effektivt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: next-themes sets the theme class (e.g. "dark")
    // on this element during hydration; without this prop React would log a
    // mismatch warning because the SSR output lacks the class.
    <html
      lang="no"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/*
        bg-white / dark:bg-gray-900 — page canvas
        text-gray-900 / dark:text-gray-50 — inherited base text colour
        Both classes respond instantly when next-themes adds/removes "dark"
        on <html> thanks to the @variant dark rule in globals.css.
      */}
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        {/* Skip link — keyboard users can bypass the header with one Tab press */}
        <a href="#main-content" className="skip-link">
          Hopp til hovedinnhold
        </a>
        {/*
          attribute="class": next-themes toggles class="dark" / class="light"
            on <html> so Tailwind's @variant dark rule fires.
          defaultTheme="system": respects OS preference until user overrides.
          enableSystem: allows "system" as a valid choice.
          disableTransitionOnChange: suppresses the colour-flash that would
            occur if CSS transitions were active during theme switch.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
