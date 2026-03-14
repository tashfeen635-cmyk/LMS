"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, Users, Shield } from "lucide-react";
import type { UserRole } from "@/types";
import useAuthStore from "@/stores/auth-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Role card configuration
// ---------------------------------------------------------------------------

interface RoleCard {
  role: UserRole;
  label: string;
  description: string;
  sampleUser: string;
  icon: typeof BookOpen;
  color: string;
  accent?: string;
}

const roles: RoleCard[] = [
  {
    role: "student",
    label: "Student",
    description: "Access courses, assignments, grades, and your schedule.",
    sampleUser: "Sarah Chen",
    icon: BookOpen,
    color: "#3b82f6",
  },
  {
    role: "teacher",
    label: "Teacher",
    description: "Manage classes, grade assignments, and track attendance.",
    sampleUser: "Dr. Robert Smith",
    icon: GraduationCap,
    color: "#8b5cf6",
  },
  {
    role: "parent",
    label: "Parent",
    description: "Monitor your child's progress, attendance, and messages.",
    sampleUser: "David Chen",
    icon: Users,
    color: "#10b981",
  },
  {
    role: "admin",
    label: "Admin",
    description: "Oversee users, courses, reports, and system settings.",
    sampleUser: "Principal Tom Henderson",
    icon: Shield,
    color: "#1e3a5f",
    accent: "#f97316",
  },
];

// ---------------------------------------------------------------------------
// Login Page
// ---------------------------------------------------------------------------

export default function LoginPage() {
  const router = useRouter();
  const { loginAsRole } = useAuthStore();
  const [loading, setLoading] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setLoading(role);
    loginAsRole(role);
    router.push(`/${role}/dashboard`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/25">
          <GraduationCap className="size-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome to School LMS
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Select a role to explore the learning management system
        </p>
      </div>

      {/* Role cards */}
      <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
        {roles.map((r) => {
          const Icon = r.icon;
          const isLoading = loading === r.role;
          const borderColor = r.accent ?? r.color;

          return (
            <Card
              key={r.role}
              className="group relative cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={
                {
                  "--card-border": borderColor,
                  borderColor: "transparent",
                } as React.CSSProperties
              }
              onClick={() => !loading && handleRoleSelect(r.role)}
            >
              {/* Colored top accent bar */}
              <div
                className="absolute inset-x-0 top-0 h-1 rounded-t-xl"
                style={{ backgroundColor: r.color }}
              />

              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: r.color }}
                  >
                    <Icon className="size-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{r.label}</CardTitle>
                    <CardDescription className="text-xs">
                      Sign in as{" "}
                      <span className="font-medium text-foreground">
                        {r.sampleUser}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {r.description}
                </p>

                {/* Loading indicator */}
                {isLoading && (
                  <div className="mt-3 flex items-center gap-2 text-sm font-medium" style={{ color: r.color }}>
                    <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Signing in...
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <p className="mt-10 text-xs text-muted-foreground">
        crafted with care Tashfeen Bin Riaz
      </p>
    </div>
  );
}
