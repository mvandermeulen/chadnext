"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Icons from "../shared/icons";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Icons.dashboard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Icons.settings,
  },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {<item.icon className=" mr-2 h-4 w-4" />} {item.title}
        </Link>
      ))}
    </nav>
  );
}
