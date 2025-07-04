"use client";
import { deleteTrans, getAcwTrans } from '@/actions/accounts';
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from "sonner";
import {Table, TableBody, TableCell,  TableHead,TableHeader, TableRow} from "@/components/ui/table";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator} from "@/components/ui/dropdown-menu";

import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Checkbox } from '@/components/ui/checkbox';
import { categoryColors } from '@/data/categories';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {ChevronDown, ChevronUp, MoreHorizontal, Trash, Search, X, ChevronLeft,
  ChevronRight, RefreshCw} from "lucide-react";
   const TransactionTable = ({transactions}) => {
   
   const router=useRouter();
   
    const [selectedIds, setSelectedIds]= useState([]);
    const [sortConfig, setSortedConfig] =useState({field:"date", direction: "desc" });
   
    const[searchTerm, setSearchTerm]= useState("");
    const[typeFilter, setTypeFilter]= useState("");
    const handleClearFilters=()=>{
        setSearchTerm("");
        setTypeFilter("");
        setSelectedIds([]);
    };
    const handleSort=(field)=>{
        setSortedConfig(current=>({
            field, direction: current.field=== field && current.direction==="asc"?"desc":"asc" })
        )};
    const handleSelect=(id)=>
    { 
        setSelectedIds(current=>current.includes(id)? 
        current.filter(item => item !== id)  // filter/inlude others and only exclude this one
                                  // // from selected ones so it gets unselected
        :[...current,id]); // include selected ones + this one 
    }
    const handleSelectAll=()=>
    {
        setSelectedIds((current)=>
        current.length===filteredAndSortedTxns.length?[] // remove all 
        :filteredAndSortedTxns.map((t)=>t.id)   // include all
        );
    }

    const {
        loading: deleteLoading, fn: deleteFnc, data: deleted
    }=useFetch(deleteTrans);

    const handleBulkDelete= async ()=>{
        if(!window.confirm(   
          `You are going to permanently delete ${selectedIds.length} selected logs. Do you wish to proceed?`
        )) return;
        deleteFnc(selectedIds);
    };
    useEffect(()=> {
        if(deleted && !deleteLoading)
            toast.success("Transactions were deleted successfully!");
    }, [deleted, deleteLoading] );


    const filteredAndSortedTxns = useMemo(()=>{
     let result=[...transactions];

     // search 
     if(searchTerm){
        const keyword= searchTerm.toLowerCase();
        result= result.filter(
            (it)=> it.description?.toLowerCase().includes(keyword)
        );}  /// selecrt if substring 

     // type-filter
     if(typeFilter){
        result=result.filter(
            (it)=> it.type ===typeFilter
        );
     }

     // sorts 
     result.sort((a, b)=>{ 
        let comp=0;
        switch (sortConfig.field) 
        {
            case "date":
               comp = new Date(a.date) - new Date(b.date);
                break;
            case "amount":
                comp= (a.amount)- (b.amount);
                break;
            case "category":
                comp= (a.category).localeCompare(b.category);
                break;
            default:
               comp=0;
               break;
        }
        return sortConfig.direction==="asc"?comp : -comp;
     })
     
     return result;

   }, [transactions, searchTerm, typeFilter, sortConfig]);

  return (
    <div className='space-y-4'>
       { deleteLoading &&(<BarLoader className='mt-4' width={"100%"} color="#9333ea"></BarLoader>)}
      {/* filters */}
      <div className="flex flex-col sm:flex-row gap-4">
         <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
             // setCurrentPage(1);
            }}
            className="pl-8"
          />
         </div>
         <div className="flex gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              // setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"  size="sm"  onClick={handleBulkDelete}>
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter ) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilters}
              title="Clear filters"
            >
              <X className="h-4 w-5" />
            </Button>
          )}
         </div>
      </div>
      {/* logs */}
       <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                className="cursor-pointer"
                  checked={
                    filteredAndSortedTxns.length > 0&&
                     selectedIds.length === filteredAndSortedTxns.length
                  }
                 onCheckedChange={handleSelectAll}
                 title={
                        filteredAndSortedTxns.length > 0 &&
                        selectedIds.length === filteredAndSortedTxns.length
                        ? " Unmark "
                        : "Mark all"
                    }
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}>
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
                 {/* 6th */}
              <TableHead className="w-[50px]" />
            </TableRow>
            
          </TableHeader>
          <TableBody>
            { filteredAndSortedTxns.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No transactions found for the current Account
                </TableCell> 
              </TableRow>
            ) : (
              filteredAndSortedTxns.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(transaction.id)}
                      onCheckedChange={() => handleSelect(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                    {/* or just {transaction.formattedDate} */}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{ background: categoryColors[transaction.category], }}
                      className="px-2 py-1 rounded text-white text-sm">
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      transaction.type === "EXPENSE"
                        ? "text-red-500"
                        : "text-green-500"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}$
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/transaction/create?edit=${transaction.id}`  )} >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive"
                        onClick={() => {
                            if ( window.confirm(
                                `You are going to permanently delete this log. Do you wish to proceed?`
                                )) deleteFnc([transaction.id]);  }}>                         
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}

export default TransactionTable
