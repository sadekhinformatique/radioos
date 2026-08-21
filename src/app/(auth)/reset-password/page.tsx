"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Eye, EyeOff, Check } from "lucide-react";
import { updatePassword } from "@/lib/supabase/actions";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // If successful, updatePassword redirects to /dashboard
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Nouveau mot de passe
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choisissez un nouveau mot de passe pour votre compte
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="next" value="/dashboard" />

            <div className="relative">
              <Input
                label="Nouveau mot de passe"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                name="password"
                icon={<Lock className="h-4 w-4" />}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <Input
              label="Confirmer le mot de passe"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              name="confirmPassword"
              icon={<Lock className="h-4 w-4" />}
              required
            />

            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Le mot de passe doit contenir au moins 8 caractères.
              </p>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              <Check className="mr-2 h-4 w-4" />
              Mettre à jour le mot de passe
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
