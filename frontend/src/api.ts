export type Role = "familia" | "trabajo";

export type FieldErrors = Partial<Record<"role" | "name" | "phone" | "form", string>>;

type ErrorBody = {
  detail?: string;
  role?: string[];
  name?: string[];
  phone?: string[];
};

export async function createLead(payload: {
  role: Role;
  name: string;
  phone: string;
}): Promise<void> {
  const response = await fetch("/api/leads/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return;
  }

  let body: ErrorBody = {};
  try {
    body = (await response.json()) as ErrorBody;
  } catch {
    body = {};
  }

  const fieldErrors: FieldErrors = {};
  if (body.name?.[0]) fieldErrors.name = body.name[0];
  if (body.phone?.[0]) fieldErrors.phone = body.phone[0];
  if (body.role?.[0]) fieldErrors.role = "Elige una puerta.";
  if (response.status === 429) {
    fieldErrors.form = "Ya recibimos tu mensaje. Te llamamos pronto.";
  } else if (!fieldErrors.name && !fieldErrors.phone && !fieldErrors.role) {
    fieldErrors.form = "No se pudo guardar. Inténtalo otra vez.";
  }

  const error = new Error(fieldErrors.form ?? "Revisa los datos.");
  (error as Error & { fieldErrors: FieldErrors }).fieldErrors = fieldErrors;
  throw error;
}
