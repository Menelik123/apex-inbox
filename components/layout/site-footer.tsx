import * as React from "react";
import Link from "next/link";

import { footerLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t", className)}>
      <div className="container flex max-w-6xl flex-col gap-10 py-12 sm:flex-row sm:gap-16">
        {/* Brand column */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-urban text-lg font-bold">
              {siteConfig.name}
            </span>
          </Link>
          <p className="mt-2 max-w-[200px] text-xs leading-relaxed text-muted-foreground">
            The AI Sales Action Inbox for Gmail.
          </p>
        </div>

        {/* Link columns */}
        <div className="flex flex-1 flex-wrap gap-8">
          {footerLinks.map((section) => (
            <div key={section.title} className="min-w-[120px]">
              <span className="text-sm font-medium text-foreground">
                {section.title}
              </span>
              <ul className="mt-4 list-inside space-y-3">
                {section.items?.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t py-4">
        <div className="container flex max-w-6xl items-center justify-between">
          {/* <span className="text-muted-foreground text-sm">
            Copyright &copy; 2024. All rights reserved.
          </span> */}
          <p className="text-left text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Apex Digital. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
