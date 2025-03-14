import Link from "next/link"
import { Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4 md:mb-0">
            <Globe className="h-5 w-5 text-primary" />
            <span className="font-bold">Lingua</span>
          </div>
          <p className="text-center text-xs leading-5 text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Lingua. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

