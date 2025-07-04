'use-client';

import { scanReceipt } from '@/actions/transaction';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { Camera, Loader2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner';

const RecScanner = ({onScanComplete}) => {
    const fileInputRef = useRef(null);
    
    const {
        loading: scanRecloading,
        fn: scanRecFn,
        data: scannedData,
    }=useFetch(scanReceipt);

    const handleRecScan= async (file)=>{
        if(file.size> 5*1024*1024)
        {
            toast.error("File size should be less than 5MB");
            return ;
        }
        await scanRecFn(file);
    };
    useEffect(()=>{
        if(scannedData && !scanRecloading)
        {
            onScanComplete(scannedData);
            toast.success("Receipt Scan was Sucessful!")
        };
    },[scanRecloading, scannedData]);

  return (
    <div>
     <input type= "file" ref={fileInputRef} className='hidden' accept='image/*' capture="environment"
     onChange={(event)=>{
        const file=event.target.files?.[0];
        if (file) handleRecScan(file);
     }}/>
     <Button className=' w-full h-10 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:border-2
      animate-gradient hover:opacity-70 transition-opacity text-white hover:text-black hover:border-black '
      onClick={ ()=> fileInputRef.current?.click()} disabled={scanRecloading}
     > {scanRecloading?(<>
     <Loader2 className='mr-2 animate-spin'/>
     <span> Scanning the receipt...</span>
     </>):  (
        <> 
            <Camera className="mr-2 !h-8 !w-auto">  </Camera>
            <span className='mx-6 font-bold text-2xl w-full' > Scan Receipt using AI</span>
       </>  )}
     </Button>
     
    </div>
  );
}
export default RecScanner
