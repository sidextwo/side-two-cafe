export const runtime = "nodejs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("RESEND KEY:", !!process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  console.log("🔥 ROUTE HIT - NEW VERSION 2026");
  
    try {
    const body = await req.json();

    const { customerName, order, notes, readyIn } = body;
    
    console.log("ORDER RECEIVED:", {
  customerName,
  order,
  notes,
  readyIn,
});

    const orderList = order
      .map((item: string) => `• ${item}`)
      .join("\n");

    const result = await resend.emails.send({
      from: "Side Two Café <onboarding@resend.dev>",
      to: ["sidextwo@gmail.com"], // change if needed
      subject: `☕ ${customerName} ordered coffee`,
      text: `
SIDE TWO CAFÉ ORDER - TEST TEST

Name: ${customerName}

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