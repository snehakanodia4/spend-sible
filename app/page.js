import Hero from '@/components/hero';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { featuresData, howItWorksData, statsData, testimonialsData } from '@/data/landing';
import Image from 'next/image';
import Link from 'next/link';
export default function Home() {
  return (
    <div className='mt-30'>
     <Hero/> {/* from server  */}
     <section className='py-20 bg-blue-50'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-4 gap-8'>
          {statsData.map((item,index )=>(
            <div key={index} className='text-center'> 
              <div className='text-4xl font-bold text-blue-700 mb-2'>{item.value}</div>
              <div className='text-2xl font-medium text-[rgba(107,114,128,0.8)] mb-2'>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
     </section>
     <section className='py-20'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center text-gray-800'> Everything You Need to Track Your Expenses</h2>
        <h3 className='text-xl text-[rgba(107,114,128)] font-medium text-center mb-6'>Here's What All You Can Do </h3>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((item,index)=>(
              <Card key={index} className="p-6">
                <CardContent className=" space-y-1 pt-4">
                  {item.icon}
                  <p className='text-1xl font-medium'> {item.title}</p>
                  <p className='text-[rgba(107,114,128)] font-medium'> {item.description}</p>
                </CardContent>  
              </Card>
          ))}
        </div>
      </div>
     </section>
     <section className='py-7 bg-blue-50'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-gray-800 text-center mb-3 '> How It Works</h2> 
        <div className=" grid grid-cols-1 lg:grid-cols-3 gap-5">
          {howItWorksData.map((item,index)=>(
              <div key={index} className='text-center'>
                <div className=
                'w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'
                > {item.icon}</div>
                <p className='text-1xl font-semibold'> {item.title}</p>
                <p className='text-[rgba(107,114,128)] font-medium'> {item.description}</p>
              </div>
          ))}
        </div>
      </div>
     </section>
     <section className='py-20'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl mb-4 font-bold text-center text-gray-800'> Join Thousands of Happy Users Across the World!</h2>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((item,index)=>(
              <Card key={index} className="p-6">
                <CardContent>
                  <div className='flex items-center mb-3'>
                    <Image 
                    src={item.image} alt={item.name}
                    width={60} height={60} className="rounded-lg border-1 border-gray-800 "/>
                    <div className='ml-4' >
                      <div className='font-semibold text-xl'> {item.name}</div>
                      <div className='text-md text-gray-700'>{item.role}</div>
                    </div>
                  </div>
                  <p className='text-gray-700 text-sm tracking-tighter font-mono font-light'> {item.quote} </p>
                </CardContent>
              </Card>
          ))}
        </div>
      </div>
     </section>
     <section className='py-20 bg-gradient-to-br from-blue-400 to-purple-400 '>
      <div className='container mx-auto px-4 text-center'>
      <p className='text-blue-100 mb-2 max-w-2xl mx-auto text-2xl '>
         To rid you of the hassle,
         <span className='font-bold mx-1'>Spend-sible</span> 
        is here to assist you smartly track your finances through the use of AI.
      </p>
      
      <h2 className='text-4xl font-bold text-blue-950 text-center mb-6 '> 
          Are You Ready to Take Control of Your Finances?
      </h2> 
      <Link href="/dashboard">
      <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 animate-bounce border-2 border-blue-900">
          Start Free Trial
      </Button>
      </Link>
        
        
      </div>
     </section>
    </div>
  );
}