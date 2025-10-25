import Link from 'next/link';
import { cn } from "@/lib/utils";
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black p-6 text-center">
      <AlertTriangle className="h-16 w-16 text-blue-500 dark:text-blue-400" />
      
      <h1 className="mt-6 text-9xl font-bold text-neutral-800 dark:text-neutral-100">
        404
      </h1>

      <h2 className="mt-4 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
        Page Not Found
      </h2>

      <p className="mt-2 text-lg text-neutral-500 dark:text-neutral-400">
        Could not find the requested resource.
      </p>
      
      <Link
        href="/"
        className={cn(
          "mt-8 flex items-center gap-2 rounded-md text-sm font-medium transition-all duration-200",
          "justify-center",
          "p-3 md:py-2 md:px-4",
          "bg-neutral-100 dark:bg-[#1C212D] text-neutral-900 dark:text-blue-400 border border-neutral-200 dark:border-blue-500/20",
          "hover:bg-neutral-200 dark:hover:bg-[#1C212D]/80"
        )}
      >
        <Home className="h-5 w-5" />
        <span className="text-sm font-medium">Return Home</span>
      </Link>
    </div>
  )
}

export default NotFound;