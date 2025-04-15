import { Client as QStashClient } from "@upstash/qstash";
import config from "@/lib/config";

// 👇 Export this if you want to use it elsewhere
export const workflowClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

export const sendEmail = async ({
  email,
  fullName,
  subject,
  message,
}: {
  email: string;
  fullName: string;
  subject: string;
  message: string;
}) => {
  await workflowClient.publishJSON({
    url: "https://api.emailjs.com/api/v1.0/email/send",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: {
        to_name: fullName,
        name: "JS Mastery Bot",
        email,
        message,
        subject,
      },
    },
  });
};
