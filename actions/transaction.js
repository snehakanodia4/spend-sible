"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const serialiseTrans = (obj) => {
  const serialz = { ...obj };
  if (obj.balance) {
    serialz.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialz.amount = obj.amount.toNumber();
  }

  return serialz;
};

export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorised");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User Not Found");

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.userId,
      },
    });
    if (!account) throw new Error("Account Not Found");
    const delta = data.type === "EXPENSE" ? -data.amount : data.amount;
    const updBalance = account.balance.toNumber() + delta;

    // prisma: 'transaction' as a reserved keyword
    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: updBalance },
      });
      return newTransaction;
    });
    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);
    return { success: true, data: serialiseTrans(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function scanReceipt(file) {
  try {
    const model = genAi.getGenerativeModel({
      // tell the AI library the specific AI model to use
      model: "gemini-1.5-flash",
    });
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
                Analyze this receipt image and extract the following information in JSON format:
                - Total amount (just the number)
                - Date (in ISO format)
                - Description or items purchased (brief summary)
                - Merchant/store name
                - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
                
                Only respond with valid JSON in this exact format:
                {
                    "amount": number,
                    "date": "ISO date string",
                    "description": "string",
                    "merchantName": "string",
                    "category": "string"
                }

                If its not a recipt, return an empty object
                `;
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      { text: prompt },
    ]);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```(?:json)?\n?/g, "").trim(); //regex
    /// this will extract central string only from  /```JSON SOME-TEXT JSON```/
    //  all (g) ```which may have json and may have newline

    try {
      const data = JSON.parse(cleanText);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Receipt Scan FAILED! ", error.message);
    throw new Error("Receipt Scan FAILED! ");
  }
}

//this will be used to show ui for editing
export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorised");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User Not Found");

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
  if (!transaction) throw new Error("Transaction not Found ");
  return serialiseTrans(transaction);
}

//this will be used for updates in db
export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorised");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User Not Found");

    const ogTxn = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: true,
      },
    });
    if (!ogTxn) throw new Error("Transaction not Found ");

    const oldDelta =
      ogTxn.type === "EXPENSE"
        ? -ogTxn.amount.toNumber()
        : ogTxn.amount.toNumber();
    const newDelta = data.type === "EXPENSE" ? -data.amount : data.amount;
    const netDelta = newDelta - oldDelta;
    //updation
    // transaction table
    const transaction = await db.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: { id, userId: user.id },
        data: { ...data },
      });
      //account table
      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: { increment: netDelta },
        },
      });
      return updated;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);
    return { success: true, data: serialiseTrans(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}
