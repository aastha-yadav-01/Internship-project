import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ledger — reading & watchlist tracker",
  description: "A personal ledger for what you're reading and watching.",
};

const navLinks = [
  { href: "/", label: "Shelf" },
  { href: "/add", label: "Add" },
  { href: "/stats", label: "Stats" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6">
          <header className="flex items-center justify-between border-b border-[var(--color-border)] py-6">
            <Link href="/" className="font-serif text-xl tracking-tight text-ink">
              Ledger
            </Link>
            <nav className="flex gap-5 text-sm text-ink-soft">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-stamp"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </header>

          <main className="flex-1 py-10">{children}</main>

          <footer className="border-t border-[var(--color-border)] py-6 text-xs text-stone">
            <Link href="/health" className="hover:text-stamp">
              System status
            </Link>
          </footer>
        </div>
      </body>
    </html>
  );
}
