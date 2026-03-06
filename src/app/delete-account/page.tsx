import type { ReactNode } from 'react';
import Link from 'next/link';
import { LandingHeader } from '@/components/layout/landing-header';
import { LandingFooter } from '@/components/layout/landing-footer';

export const metadata = {
  title: 'How to Delete Your Account & Data — Paisa',
  description: 'Instructions for permanently deleting your Paisa account and all associated data.',
};

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-muted-foreground border-collapse">
        <thead>
          <tr className="border-b border-white/10 dark:border-white/5">
            {headers.map((h) => (
              <th key={h} className="text-left py-2 pr-4 last:pr-0 font-semibold text-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="py-2 pr-4 last:pr-0 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Divider() {
  return <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />;
}

function Step({ number, children }: { number: number; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary text-sm font-semibold flex items-center justify-center">
        {number}
      </div>
      <p className="text-muted-foreground leading-relaxed pt-0.5">{children}</p>
    </div>
  );
}

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-premium-gradient dark:bg-premium-gradient-dark">
      <LandingHeader />
      <main className="container mx-auto px-6 lg:px-8 py-16 max-w-4xl">
        <div className="glass-morphism dark:glass-morphism-dark rounded-3xl p-8 lg:p-12 space-y-8">

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-gradient-moonlight">How to Delete Your Account &amp; Data</h1>
            <p className="text-muted-foreground leading-relaxed">
              This page describes how users can permanently delete their Paisa account and all associated data.
            </p>
          </div>

          <Divider />

          {/* What Gets Deleted */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">What Gets Deleted</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you delete your account, the following is <span className="font-semibold text-foreground">permanently and irreversibly removed</span>:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-1">
              <li>Your Firebase Authentication account (email, password)</li>
              <li>Your user profile (name, profile photo)</li>
              <li>All wallets you created</li>
              <li>All transactions linked to those wallets</li>
              <li>All uploaded receipt images and wallet icons</li>
            </ul>
            <div className="mt-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
              This action cannot be undone.
            </div>
          </section>

          <Divider />

          {/* Steps to Delete In-App */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Steps to Delete Your Account In-App</h2>
            <div className="space-y-3">
              <Step number={1}>Open the <span className="font-medium text-foreground">Paisa</span> app and sign in if prompted.</Step>
              <Step number={2}>Tap the <span className="font-medium text-foreground">Profile</span> tab at the bottom of the screen.</Step>
              <Step number={3}>Tap <span className="font-medium text-foreground">Settings</span>.</Step>
              <Step number={4}>Tap <span className="font-medium text-foreground">Delete Account &amp; Data</span>.</Step>
              <Step number={5}>Read the confirmation message carefully.</Step>
              <Step number={6}>Tap <span className="font-medium text-foreground">Delete Everything</span> to confirm.</Step>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Your account and all data will be deleted immediately. You will be automatically signed out and returned to the welcome screen.
            </p>
          </section>

          <Divider />

          {/* Re-authentication */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">If You See &ldquo;Re-authentication Required&rdquo;</h2>
            <p className="text-muted-foreground leading-relaxed">
              For security, Firebase requires that your sign-in session is recent before allowing account deletion. If you see this message:
            </p>
            <div className="space-y-3">
              <Step number={1}>Tap <span className="font-medium text-foreground">OK</span> to dismiss the alert.</Step>
              <Step number={2}>Tap <span className="font-medium text-foreground">Logout</span> on the Profile screen.</Step>
              <Step number={3}>Sign back in with your email and password.</Step>
              <Step number={4}>Immediately go back to <span className="font-medium text-foreground">Profile → Settings → Delete Account &amp; Data</span>.</Step>
              <Step number={5}>Tap <span className="font-medium text-foreground">Delete Everything</span>.</Step>
            </div>
          </section>

          <Divider />

          {/* Alternative: Email */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Alternative: Request Deletion by Email</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you are unable to access the app, you can request manual deletion by contacting us:
            </p>
            <ul className="list-none text-muted-foreground leading-relaxed space-y-1">
              <li><span className="font-medium text-foreground">Email:</span> [your-contact-email@domain.com]</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">Include in your email:</p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-1">
              <li>The email address associated with your account</li>
              <li>Subject line: &ldquo;Account Deletion Request — Paisa&rdquo;</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              We will permanently delete your account and all associated data within <span className="font-medium text-foreground">7 business days</span> and send you a confirmation email.
            </p>
          </section>

          <Divider />

          {/* Third-Party Services */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Data Hosted on Third-Party Services</h2>
            <Table
              headers={['Service', 'Data stored', 'Deletion']}
              rows={[
                ['Firebase Authentication', 'Email, password hash, UID', 'Deleted automatically when you delete your account in-app'],
                ['Firebase Firestore', 'Profile, wallets, transactions', 'Deleted automatically when you delete your account in-app'],
                ['Cloudinary', 'Profile photos, wallet icons, receipt images', 'Deleted automatically when you delete your account in-app'],
                ['AsyncStorage (device)', 'Auth session token', 'Cleared automatically on sign-out'],
              ]}
            />
          </section>

          <Divider />

          {/* Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">For questions about data deletion or privacy:</p>
            <ul className="list-none text-muted-foreground leading-relaxed space-y-1">
              <li><span className="font-medium text-foreground">Email:</span> [your-contact-email@domain.com]</li>
              <li><span className="font-medium text-foreground">App:</span> Paisa (com.aths7.paisav5)</li>
            </ul>
          </section>

          <Divider />

          <div className="pt-2 flex flex-wrap gap-6">
            <Link href="/" className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium text-sm">
              &larr; Back to Home
            </Link>
            <Link href="/privacy-policy" className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium text-sm">
              Privacy Policy &rarr;
            </Link>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
