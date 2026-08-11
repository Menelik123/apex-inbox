"use client";

import { useSession } from "next-auth/react";
import { Icons } from "@/components/shared/icons";

export default function ProjectSwitcher({ large = false }: { large?: boolean }) {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-2 px-1">
      <div className="flex size-6 items-center justify-center rounded-md bg-primary">
        <Icons.logo className="size-4 text-primary-foreground" />
      </div>
      <span className="font-semibold text-sm truncate max-w-[120px]">
        Apex Inbox
      </span>
    </div>
  );
}
