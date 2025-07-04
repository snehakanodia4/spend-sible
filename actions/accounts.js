// account related server actions go here
"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { _success } from "zod/v4/core";

const serialiseTrans=(obj)=>{
 const serialz={...obj};
 if(obj.balance)
 {
    serialz.balance=obj.balance.toNumber();
 }
 if(obj.amount)
 {
    serialz.amount = obj.amount.toNumber();
 }
 
  return serialz;
};

// the code below handles the switch toggle of default account decision 
export async function updateDefaultAccount(accountId) {
        try{
            const {userId} = await auth();
            if(!userId) throw new Error("Unauthorised");
    
            // in database
            const user= await db.user.findUnique({
                where: { clerkUserId: userId},
            });
            if(!user){
                throw new Error("User Not Found");
            }
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true},
                data: { isDefault: false},
            });
            const account= await db.account.update({
                where:
                {id: accountId, userId: user.id,},
                data: {isDefault: true},
            });
            revalidatePath('/dashboard');
            return {success: true, data: serialiseTrans(account) };
        } catch(error)
        {
            return {success: false, error: error.message };
        }
    
}
export async function getAcwTrans(accountId) {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        const account = await db.account.findUnique({
            where: {
            id: accountId,
            userId: user.id,
            },
            include: {
            transactions: {
                orderBy: { date: "desc" },
            },
            _count: {
                select: { transactions: true },
            },
            },
        });

        if (!account) return null;

        return {
            ...serialiseTrans(account),
            transactions: account.transactions.map(serialiseTrans),
        };

}
////// code for deletion 
export async function deleteTrans(transactionIds) {
    try{
            // loggedin
            const {userId} = await auth();
            if(!userId) throw new Error("Unauthorised");
    
            // in database
            const user= await db.user.findUnique({
                where: { clerkUserId: userId},
            });
            if(!user){
                throw new Error("User Not Found");
            }
            const transactions = await db.transaction.findMany({
                where: {
                    id: { in: transactionIds },   // present in this array 
                    userId: user.id,
                },
            });
             // get account to update its balance
            const accountBalanceChanges = transactions.reduce((acc, transaction) => {
                // accumulator and current value- getting net delta for each account
            const change =
                transaction.type === "EXPENSE"
                ? transaction.amount   // deletion of expense increases the balance
                : -transaction.amount;
            acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
            return acc;
            }, {});

            // Delete transactions and update account balances in a transaction
            // this is the prisme keyword- transaction which has nothing to do with our accountsdata
            // but refers to row deletions here from database
            await db.$transaction(async (tx) => {
            // Delete transactions
                await tx.transaction.deleteMany({
                    where: {
                        id: { in: transactionIds },
                        userId: user.id,
                    },
                });

              // Update account balance in which the deletions took place 
              // ps- we are only handling transactions of current account at one time, this can be done without searching

                for (const [accountId, balanceChange] of Object.entries(
                    accountBalanceChanges
                )) {
                    await tx.account.update({
                        where: { id: accountId }, 
                        data: {
                            balance: {
                            increment: balanceChange,
                            },
                        },
                    });
                }
            });
                // to get latest data from db 
            revalidatePath("/dashboard");
            revalidatePath("/account/[id]");

         return { success: true };
        } 
        catch(error)
        {
            return {success: false, error: error.message };
        }
}