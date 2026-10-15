"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FriendsIcon, HeartPinIcon, MapIcon, ProfileIcon } from "./icons";

const TABS = [
  { href: "/", label: "Map", Icon: MapIcon },
  { href: "/places", label: "My places", Icon: HeartPinIcon },
  { href: "/friends", label: "Friends", Icon: FriendsIcon },
  { href: "/profile", label: "Profile", Icon: ProfileIcon },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="relative z-30 border-t border-line bg-paper/95 pb-safe pl-safe pr-safe backdrop-blur">
      <ul className="mx-auto flex h-16 max-w-md items-stretch">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
                  active ? "text-thread" : "text-ink-faint active:text-ink-soft"
                }`}
              >
                <span
                  className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                    active ? "bg-blush" : ""
                  }`}
                >
                  <Icon className="size-[22px]" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
