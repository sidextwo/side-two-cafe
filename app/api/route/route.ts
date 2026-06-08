export const runtime = "nodejs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("RESEND KEY:", !!process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { order, notes, readyIn } = body;

    const orderList = order
      .map((item: string) => `• ${item}`)
      .join("\n");

    const result = await resend.emails.send({
      from: "Side Two Café <onboarding@resend.dev>",
      to: ["sidextwo@gmail.com"], // change if needed
      subject: "☕ New Side Two Café Order",
      text: `
SIDE TWO CAFÉ ORDER

Items:
${orderList}

Ready In:
${readyIn}

Notes:
${notes || "None"}

Submitted:
${new Date().toLocaleString()}
      `,
    });

    return Response.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error,
      },
      {
        status: 500,
      }
    );
  }
}