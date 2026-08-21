import { NextRequest } from "next/server";
import { apiSuccess, apiUnauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getApiUser(request);

    if (!user) {
      return apiUnauthorized();
    }

    return apiSuccess({
      user: {
        id: user.auth.id,
        email: user.auth.email,
        fullName: user.profile?.full_name,
        role: user.profile?.role,
        avatarUrl: user.profile?.avatar_url,
        createdAt: user.auth.created_at,
      },
    });
  } catch {
    return apiUnauthorized();
  }
}
