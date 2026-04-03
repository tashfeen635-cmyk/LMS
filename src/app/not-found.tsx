import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="size-10 text-muted-foreground" />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
          Page Not Found
        </h1>

        <p className="mt-3 text-muted-foreground">
          Oops! The page you&apos;re looking for doesn&apos;t exist. It may have
          been moved or the URL might be incorrect.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
