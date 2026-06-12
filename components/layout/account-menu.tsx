"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccountMenu({
  email,
  align = "end",
}: {
  email: string;
  align?: "start" | "end";
}) {
  const { signOut } = useAuth();
  const t = useTranslations("auth");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="max-w-48 truncate text-sm text-muted-foreground hover:text-foreground transition-colors outline-none">
        {email}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuItem onClick={() => void signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
