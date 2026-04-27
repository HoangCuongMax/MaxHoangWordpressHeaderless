import { NextResponse } from "next/server";
import { sendSiteMail } from "@/lib/mailer";

export const runtime = "nodejs";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const email = cleanText(payload.email);
    const website = cleanText(payload.website);

    if (website) {
      return NextResponse.json({
        ok: true,
        message: "Thanks. You are on the list."
      });
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await sendSiteMail({
      subject: `New monthly mailing list signup: ${email}`,
      replyTo: email,
      text: `New newsletter signup from ${email}`,
      html: `
        <h1>New monthly mailing list signup</h1>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p>This can be routed into Mailchimp later.</p>
      `
    });

    return NextResponse.json({
      ok: true,
      message: "You are on the monthly list."
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to save your email right now.";

    return NextResponse.json(
      { error: message },
      {
        status: message.includes("not configured") ? 503 : 500
      }
    );
  }
}
