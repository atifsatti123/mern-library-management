import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow"; // ✅ import the QStash-EmailJS version

type UserState = "non-active" | "active";

type InitialData = {
  email: string;
  fullName: string;
};

const getUserState = async (email: string): Promise<UserState> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) return "non-active";

  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const now = new Date();
  const diff = now.getTime() - lastActivityDate.getTime();

  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

  if (diff > THREE_DAYS && diff <= THIRTY_DAYS) return "non-active";
  return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  await context.run("new-signup", async () => {
    await sendEmail({
      email,
      fullName,
      subject: "Welcome to the platform!",
      message: `Hey ${fullName}, thanks for joining! 🚀`,
    });
  });

  await context.sleep("wait-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("email-non-active", async () => {
        await sendEmail({
          email,
          fullName,
          subject: "Are you still there?",
          message: `Hi ${fullName}, we noticed you’ve been inactive for a while. Come back soon!`,
        });
      });
    } else {
      await context.run("email-active", async () => {
        await sendEmail({
          email,
          fullName,
          subject: "Welcome back!",
          message: `Awesome to see you again, ${fullName}!`,
        });
      });
    }

    await context.sleep("wait-30-days", 60 * 60 * 24 * 30);
  }
});
