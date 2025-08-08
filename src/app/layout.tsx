import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { MoodThemeProvider } from "@/components/mood/mood-theme-provider";
import { OnboardingProvider } from "@/hooks/useOnboarding";
import { NotificationProvider } from "@/components/ui/notification-system";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Expense Tracker",
  description: "Track your expenses and manage your finances with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <OnboardingProvider>
                <MoodThemeProvider>
                  {children}
                  <Toaster richColors position="top-right" />
                </MoodThemeProvider>
              </OnboardingProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
