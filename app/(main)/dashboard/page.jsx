import { getUserAcc } from '@/actions/dashboard';
import CreateAccDrawer from '@/components/create-acc-drawer';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import React from 'react'
import AccountCard from './_components/account-card';

async function Dashpage() {
const accounts= await getUserAcc();

  return (
    <div className='px-5'>
    {/* Budget */}

    {/* {Overview} */}

    {/* accounts */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <CreateAccDrawer>               
               <Card className=" hover:shadow-md  transition-shadow cursor-pointer border-dashed">
                <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                    <Plus className='h-12 w-12 mb-2'></Plus>
                    <p className='text-sm font-medium'> Add New Account</p>
                </CardContent>
               </Card>
            </CreateAccDrawer>
            {accounts.length>0 && accounts?.map((it)=>{
              //console.log(it.id);
            return <AccountCard key={it.id} account={it}/>
            })}
        </div>
    </div>
  );
}
export default Dashpage;