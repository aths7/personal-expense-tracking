import Link from 'next/link';

interface AuthFooterLinkProps {
  text: string;
  linkText: string;
  href: string;
}

export function AuthFooterLink({ text, linkText, href }: AuthFooterLinkProps) {
  return (
    <div className="text-sm text-center text-muted-foreground">
      {text}{' '}
      <Link
        href={href}
        className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline"
      >
        {linkText}
      </Link>
    </div>
  );
}