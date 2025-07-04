"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";

/* client component*/

const Hero = () => {
    const imgRef= useRef();
    useEffect(()=>{
        const imageElement=imgRef.current; 
        const handleScroll=()=>{
            const scrollPosition= window.scrollY;
            const scrollThreshold= 190;
           // console.log("scrolling at:", scrollPosition);
            if(scrollPosition> scrollThreshold)
            {
                imageElement.classList.add("scrolled");
            }
            // else
            // {
            //     imageElement.classList.remove("scrolled");
            // }
        };
        window.addEventListener("scroll", handleScroll)
       return () => window.removeEventListener("scroll", handleScroll);
    },[])
  return (
    <div className="pb-20 px-4">
     <div className="container mx-auto text-center">
        <h1 className=" text-4xl md:text-6xl lg:text-[80px]  pb-6 pt-4 gradient-title">
            Manage&nbsp;Your&nbsp;Finances<br/> With&nbsp;Intelligence
        </h1>
        <p className="text-2xl text-gray-750 mb-8 max-w-2xl mx-auto tracking-tighter">
            {" "}
            An AI-powered finance tracking platform
            that helps you track, <br/>
            analyse, and optimise your expenses with real-time insights.
        </p>
        <div>
            <Link href="/dashboard">
            <Button size="lg"  className="h-12 w-auto px-8 border border-gray-700 hover:bg-gradient-to-br from-blue-400 to-purple-400 " variant="outline">
             Let&apos;s Get You Started!
            </Button>
            </Link>
        </div>
        <div className="hero-img-wrapper">
            <div ref= {imgRef} className="hero-img"> 
                <Image src="/landing.jpg" width={1200} height={720} 
                alt="Preview"
                className="rounded-lg shadow-2xl border-2 mx-auto"
                 priority >
                </Image>
            </div>
        </div>
     </div>
    </div>
  );
};
export default Hero;
