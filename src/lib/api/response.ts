import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export function apiSuccess<T>(data: T, status = 200, meta?: ApiResponse["meta"]) {
  const response: ApiResponse<T> = { success: true, data };
  if (meta) response.meta = meta;
  return NextResponse.json(response, { status });
}

export function apiError(error: string, status = 400, message?: string) {
  const response: ApiResponse = { success: false, error, message };
  return NextResponse.json(response, { status });
}

export function apiUnauthorized(error = "Non autorisé. Token manquant ou invalide.") {
  return apiError(error, 401);
}

export function apiForbidden(error = "Accès refusé. Permissions insuffisantes.") {
  return apiError(error, 403);
}

export function apiNotFound(resource = "Ressource") {
  return apiError(`${resource} non trouvé(e).`, 404);
}

export function apiServerError(error = "Erreur interne du serveur") {
  return apiError(error, 500);
}
