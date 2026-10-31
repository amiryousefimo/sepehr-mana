import {ArrowLeft} from "lucide-react";
import type {Locale} from "@/lib/site";

export function PageBackLink({
  href,
  locale,
  label
}: {
  href: string;
  locale: Locale;
  label?: string;
}) {
  const text =
    label ?? (locale === "fa" ? "بازگشت به صفحه اصلی" : "Back to home");

  return (
    <a className="page-back-link" href={href}>
      <ArrowLeft aria-hidden="true" />
      {text}
    </a>
  );
}
