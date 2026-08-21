"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/lib/supabase/actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);

    const result = await resetPassword(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Mot de passe oublié
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {sent
                ? "Un email de réinitialisation a été envoyé."
                : "Entrez votre email pour recevoir un lien de réinitialisation."}
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {sent ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Vérifiez votre boîte de réception ({email})
                </p>
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                  Le lien expire dans 1 heure
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
              >
                Renvoyer l&apos;email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
              />

              <Button type="submit" className="w-full" loading={loading}>
                Envoyer le lien
              </Button>
            </form>
          )}

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
