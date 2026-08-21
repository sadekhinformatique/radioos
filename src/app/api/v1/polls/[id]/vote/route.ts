import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError, apiNotFound } from "@/lib/api/response";
import { validateRequest, voteSchema } from "@/lib/api/validation";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validateRequest(voteSchema, { ...body, pollId: id });

    if (!validation.success) {
      return apiError("Données invalides", 400, validation.errors.map((e) => e.message).join(", "));
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      }
    );

    // Get poll
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("*")
      .eq("id", id)
      .single();

    if (pollError || !poll) {
      return apiNotFound("Sondage");
    }

    if (poll.status !== "active") {
      return apiError("Ce sondage n'est plus actif", 400);
    }

    // Check if poll is expired
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return apiError("Ce sondage a expiré", 400);
    }

    // Validate option index
    if (validation.data.optionIndex >= poll.options.length) {
      return apiError("Option invalide", 400);
    }

    // Get IP for deduplication (simple approach)
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    // Check if already voted (by IP)
    const { data: existingVote } = await supabase
      .from("poll_votes")
      .select("id")
      .eq("poll_id", id)
      .eq("voter_ip", ip)
      .single();

    if (existingVote) {
      return apiError("Vous avez déjà voté pour ce sondage", 409);
    }

    // Record vote
    const { error: voteError } = await supabase.from("poll_votes").insert({
      poll_id: id,
      option_index: validation.data.optionIndex,
      voter_ip: ip,
    });

    if (voteError) {
      return apiError("Erreur lors de l'enregistrement du vote", 500);
    }

    // Get updated results
    const { data: votes } = await supabase
      .from("poll_votes")
      .select("option_index")
      .eq("poll_id", id);

    const results = poll.options.map((_: string, index: number) => ({
      option: poll.options[index],
      votes: votes?.filter((v) => v.option_index === index).length || 0,
    }));

    const totalVotes = results.reduce((sum: number, r: { votes: number }) => sum + r.votes, 0);

    return apiSuccess({
      message: "Vote enregistré",
      results: results.map((r: { option: string; votes: number }) => ({
        ...r,
        percentage: totalVotes > 0 ? Math.round((r.votes / totalVotes) * 100) : 0,
      })),
      totalVotes,
    });
  } catch {
    return apiError("Erreur serveur", 500);
  }
}
