"use server";

import nodemailer from "nodemailer";

export async function sendInvite(proposalId: string, recipientEmail: string) {
  // Check if recipientEmail is provided
  if (!recipientEmail) {
    console.error("No recipient email provided");
    return { success: false, message: "No recipient email provided" };
  }

  // Validate email format
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  if (!isValidEmail(recipientEmail)) {
    console.error("Invalid recipient email format");
    return { success: false, message: "Invalid recipient email format" };
  }

  const transporter = nodemailer.createTransport({
    // Configure your email service here
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT || "587"),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: recipientEmail,
    subject: "Invitation to Join a Study Proposal",
    text: `You've been invited to join a study proposal. Please check out proposal ID: ${proposalId} for more details.`,
    html: `<p>You've been invited to join a study proposal. Please check out proposal ID: <strong>${proposalId}</strong> for more details.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Invite sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send invite" };
  }
}
