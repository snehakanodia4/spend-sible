import { getAcwTrans } from '@/actions/accounts';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners';
import TransactionTable from '../_components/trans-table';

const AccountsPage = async ({params}) => {
   const { id } = await params; //  Await the params object or it will begiving an error 

  const accData = await getAcwTrans(id);
  if (!accData) {
    notFound();
  }

  const { transactions, ...account}= accData;
  
  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0).toUpperCase() + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* chart  */}
      {/* <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <AccountChart transactions={transactions} />
      </Suspense> */}

      {/* trans table */}
      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />} >
        <TransactionTable transactions={transactions }  />
      </Suspense>
    </div>
  );
}

export default AccountsPage
