'use client'
import { createTransaction, updateTransaction } from '@/actions/transaction'
import { tSchema } from '@/app/lib/schema'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import  CreateAccDrawer  from "@/components/create-acc-drawer";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useFetch from '@/hooks/use-fetch'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import RecScanner from './rec-scan'

const AddTransactionForm = ({accounts, categories, editMode=false, initialData=null}) => {
    
    const router = useRouter();
    const searchParams=useSearchParams();
    const editId= searchParams.get("edit");
    const { register,handleSubmit, setValue, reset, getValues, watch, formState: { errors },
    } = useForm({
        resolver: zodResolver(tSchema),

        defaultValues: editMode && initialData?
        {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
        }:        
        {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            
        },
    });
    const type = watch("type");
    const date = watch("date");
    const {
        loading: transactionloading, fn: transFn, data: transactionRes
    } = useFetch(  editMode ? updateTransaction: createTransaction  );
    const onSubmit = async(data)=> {
        const formData= { ...data,
            amount: parseFloat(data.amount),
        };
        if(editMode)
            transFn(editId, formData);
        else
            transFn(formData);
    };
    const filteredCategories= categories.filter((category)=> category.type=== type);
    const handleScanComplete=(scannedData)=>{
       // console.log(scannedData);
         if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
      toast.success("Receipt scanned successfully");
     }
    }

    useEffect(()=>{
        // console.log("useEffect triggered. ");
        if(transactionRes?.success && !transactionloading)
        {
            toast.success(editMode?"Transaction Update was succesfull!":"A new transaction was added succesfully!");
            reset();
            //   console.log(" reset success");
            router.push(`/account/${transactionRes.data.accountId}`);
        }
    }, [transactionRes, transactionloading, reset, router, editMode]);
    // const handleScanComplete=(scannedData)={

    // };
    return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" >\865 `   
        {/* AI SCAN */}
       {  !editMode && <RecScanner  onScanComplete={handleScanComplete} />}
        {/* Type */}
        <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select onValueChange={(value) => setValue("type", value)} defaultValue={type} >
                <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                </SelectContent>
            </Select>
            {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
        </div>

        {/* Amount and Account */}
        <div className="grid gap-6 md:grid-cols-2">

            {/* // amt */}
            <div className="space-y-2">
             <label className="text-sm font-medium">Amount</label>
             <Input type="number" step="0.01"  placeholder="0.00" {...register("amount")} />  
                {errors.amount && (
                    <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
            </div>

             {/* acc */}
            <div className="space-y-2">
             <label className="text-sm font-medium">Account</label>
             <Select
                onValueChange={(value) => setValue("accountId", value)}
                defaultValue={getValues("accountId")}>
                <SelectTrigger>
                   <SelectValue placeholder="Select account" />
                </SelectTrigger>

                <SelectContent>
                    {accounts.map((account) => (
                        <SelectItem
                        key={account.id} value={account.id}>
                        {account.name.toUpperCase()} (${parseFloat(account.balance).toFixed(2)}) 
                        </SelectItem>
                    ))}
                    <CreateAccDrawer>
                        <Button variant="ghost"
                        className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                        >
                        Create Account
                        </Button>
                    </CreateAccDrawer>
                </SelectContent>
             </Select>
                {errors.accountId && (
                    <p className="text-sm text-red-500">{errors.accountId.message}</p>
                )}
            </div>
        </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? format(date, "PPP") : <span>Select from Calendar</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")} initialFocus />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter description"
         {...register("description")} />
          {errors.description && (
           <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex  justify-between w-full gap-6">
        <Button type="button" variant="outline"  onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-gradient-to-br from-blue-600 to-purple-500 " 
         disabled={transactionloading}>
          {transactionloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) :   editMode ? ( "Update Transaction" ) : 
                           ("Create Transaction" )} 
        </Button>
        </div>
    </form>
  );
}

export default AddTransactionForm;