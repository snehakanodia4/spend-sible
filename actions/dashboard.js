"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Select } from "react-day-picker";
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
}

export async function createAccount(data) {
    try {
        // logged in
        const {userId} = await auth();
        if(!userId) throw new Error("Unauthorised");

        // in database
        const user= await db.user.findUnique({
            where: { clerkUserId: userId},
        });
        if(!user)
            throw new Error("User Not Found");

        const balanceFloat = parseFloat(data.balance)
        if(isNaN(balanceFloat)){
            throw new Error("Not A Valid Amount");
        }
        const existing = await db.account.findMany({
            where: { userId: user.id},
        });

        const shouldbeDef = existing.length===0?true:data.isDefault;
        console.log(existing.length);
        
        if(shouldbeDef)
        {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true},
                data: { isDefault: false},
            });
            // removed others from being default
        }
        const account= await db.account.create(
            {
                data:{
                    ...data,
                    balance: balanceFloat, userId: user.id,
                    isDefault: shouldbeDef,
                },
            });
        const saccnt= serialiseTrans(account);
        revalidatePath("/dashboard");
        return {success:true , data:saccnt};
    }
    catch (error)
    {
        throw new Error(error.message);
    }    
}
export async function getUserAcc(params) {
        // logged in
        const {userId} = await auth();
        if(!userId) throw new Error("Unauthorised");

        // in database
        const user= await db.user.findUnique({
            where: { clerkUserId: userId},
        });
        if(!user)
          throw new Error("User Not Found");

        const accounts= await db.account.findMany({
            where:{userId: user.id},
            orderBy: {createdAt: "desc"},
            include: {
                _count:{
                    select: {
                        transactions:true,
                    },
                },
            },
        });
        const saccnt= accounts.map(serialiseTrans);
        return saccnt;
}
