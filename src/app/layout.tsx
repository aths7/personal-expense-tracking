import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { MoodThemeProvider } from "@/components/mood/mood-theme-provider";
import { NotificationProvider } from "@/components/ui/notification-system";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "₹ Paisa Paisa - Personal Expense Tracker",
  description: "Track your expenses and manage your finances with ease. Your trusted companion for personal expense tracking and financial management.",
  keywords: ["expense tracker", "personal finance", "money management", "budgeting", "financial tracking", "paisa paisa"],
  authors: [{ name: "₹ Paisa Paisa" }],
  creator: "₹ Paisa Paisa",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Paisa Paisa",
  },
  openGraph: {
    title: "₹ Paisa Paisa - Personal Expense Tracker",
    description: "Track your expenses and manage your finances with ease",
    type: "website",
    locale: "en_US",
    siteName: "₹ Paisa Paisa",
  },
  twitter: {
    card: "summary_large_image",
    title: "₹ Paisa Paisa - Personal Expense Tracker",
    description: "Track your expenses and manage your finances with ease",
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Paisa Paisa',
    'application-name': 'Paisa Paisa',
    'msapplication-TileColor': '#6366f1',
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#6366f1",
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
                <MoodThemeProvider>
                  {children}
                  <InstallPrompt />
                  <Toaster 
                    richColors 
                    position="top-right" 
                    closeButton
                    duration={5000}
                    visibleToasts={5}
                    expand={true}
                    toastOptions={{
                      className: 'glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant',
                      style: {
                        backdropFilter: 'blur(12px)',
                      },
                      actionButtonStyle: {
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                      },
                      cancelButtonStyle: {
                        backgroundColor: 'var(--muted)',
                        color: 'var(--muted-foreground)',
                      }
                    }}
                  />
                </MoodThemeProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
