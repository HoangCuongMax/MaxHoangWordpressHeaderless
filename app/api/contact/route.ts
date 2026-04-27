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
    const name = cleanText(payload.name);
    const email = cleanText(payload.email);
    const company = cleanText(payload.company);
    const interest = cleanText(payload.interest);
    const message = cleanText(payload.message);
    const website = cleanText(payload.website);

    if (website) {
      return NextResponse.json({
        ok: true,
        message: "Thanks. Your message has been received."
      });
    }

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 }
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (message.length < 20) {
      return NextResponse.json(
        { error: "Please add a bit more detail to your message." },
        { status: 400 }
      );
    }

    const escapedMessage = escapeHtml(message).replaceAll("\n", "<br />");

    await sendSiteMail({
      subject: `New website enquiry from ${name}`,
      replyTo: email,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || "Not provided"}`,
        `Interest: ${interest || "Not provided"}`,
        "",
        message
      ].join("\n"),
      html: `
        <h1>New website enquiry</h1>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || "Not provided")}</p>
        <p><strong>Interest:</strong> ${escapeHtml(interest || "Not provided")}</p>
        <p><strong>Message:</strong></p>
        <p>${escapedMessage}</p>
      `
    });

    return NextResponse.json({
      ok: true,
      message: "Thanks. Your message has been sent and I will get back to you soon."
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to send your message right now.";

    return NextResponse.json(
      { error: message },
      {
        status: message.includes("not configured") ? 503 : 500
      }
    );
  }
}
