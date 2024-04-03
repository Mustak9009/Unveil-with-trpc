"use client";
import { ArrowRight, Menu } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {LogoutLink} from '@kinde-oss/kinde-auth-nextjs/components';
export default function MobileNav({ isAuth }: { isAuth: boolean }) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const toggleOpen = () => setOpen((pre) => !pre);
  const pathName = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) toggleOpen();
  }, [pathName]);

  const closeCurrent = (href: string) => {
    if (href === pathName) {
      toggleOpen();
    }
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        toggleOpen();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  return (
    <div className="sm:hidden" ref={ref}>
      <Menu
        onClick={toggleOpen}
        className="relative z-50 w-5 h-5 text-zinc-700"
      />
      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 z-0 inset-0 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pb-8 pt-20">
            {!isAuth ? (
              <>
                <li>
                  <Link
                    onClick={() => closeCurrent("/sign-up")}
                    href="/sign-up"
                    className="flex items-center justify-between w-full font-semibold text-green-500"
                  >
                    Get started{" "}
                    <ArrowRight className="ml-2 w-5 h-5 self-center" />
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeCurrent("/sign-in")}
                    href="/sign-in"
                    className="flex items-center w-full font-semibold"
                  >
                    Sign in{" "}
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeCurrent("/pricing")}
                    href="/pricing"
                    className="flex items-center w-full font-semibold"
                  >
                    Pricing{" "}
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => closeCurrent("/admin")}
                    href="/admin"
                    className="flex items-center w-full font-semibold"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <LogoutLink className="flex items-center w-full font-semibold">
                      Sign out
                  </LogoutLink>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
