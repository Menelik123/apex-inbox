"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SidebarNavItem } from "@/types";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Icons } from "@/components/shared/icons";

type EmailResult = {
  id: string;
  from: string;
  subject: string;
  time: string;
  category: string;
};

export function SearchCommand({ links }: { links: SidebarNavItem[] }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [emailResults, setEmailResults] = React.useState<EmailResult[]>([]);
  const [searching, setSearching] = React.useState(false);
  const router = useRouter();
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setEmailResults([]);
    }
  }, [open]);

  const handleQuery = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setEmailResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/emails?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setEmailResults((data.emails ?? []).slice(0, 8));
      } catch {}
      setSearching(false);
    }, 300);
  };

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-md bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-72",
        )}
        onClick={() => setOpen(true)}
        aria-label="Search emails"
      >
        <span className="inline-flex">
          Search
          <span className="hidden sm:inline-flex">
            &nbsp;emails, contacts...
          </span>
        </span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.45rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search emails and navigate"
      >
        <CommandInput
          placeholder="Search emails or navigate..."
          value={query}
          onValueChange={handleQuery}
        />
        <CommandList>
          {!searching && query.trim() && emailResults.length === 0 && (
            <CommandEmpty>
              No emails found for &ldquo;{query}&rdquo;
            </CommandEmpty>
          )}
          {searching && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {emailResults.length > 0 && (
            <CommandGroup heading="Emails">
              {emailResults.map((email) => (
                <CommandItem
                  key={email.id}
                  onSelect={() => {
                    runCommand(() => router.push("/dashboard"));
                  }}
                  className="flex flex-col items-start gap-0.5"
                >
                  <span className="w-full truncate text-sm font-medium">
                    {email.from}
                  </span>
                  <span className="w-full truncate text-xs text-muted-foreground">
                    {email.subject}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!query.trim() && (
            <>
              {links.map((section) => (
                <CommandGroup key={section.title} heading={section.title}>
                  {section.items.map((item) => {
                    const Icon = Icons[item.icon || "arrowRight"];
                    return (
                      <CommandItem
                        key={item.title}
                        onSelect={() => {
                          runCommand(() => router.push(item.href as string));
                        }}
                      >
                        <Icon className="mr-2 size-5" />
                        {item.title}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
