import type {ReactNode} from "react";
import Link from "next/link";
import {LayoutDashboard, Mail, Users} from "lucide-react";
import {SignOutButton} from "@/app/admin/sign-out-button";
import {site} from "@/lib/site";

export const metadata = {
  title: "Admin — " + site.nameEn,
  robots: {index: false, follow: false}
};

export default function AdminLayout({children}: {children: ReactNode}) {
  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <span>CMS</span>
          <small>{site.nameEn}</small>
        </div>
        <nav className="admin__nav">
          <Link href="/admin" className="admin__nav-link">
            <LayoutDashboard aria-hidden="true" />
            Dashboard
          </Link>
          <Link href="/admin/submissions" className="admin__nav-link">
            <Mail aria-hidden="true" />
            Submissions
          </Link>
          <Link href="/admin/team" className="admin__nav-link">
            <Users aria-hidden="true" />
            Team
          </Link>
        </nav>
        <div className="admin__logout-form">
          <SignOutButton />
        </div>
      </aside>
      <main className="admin__main">
        {children}
      </main>
    </div>
  );
}
