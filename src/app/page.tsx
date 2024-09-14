"use client"
import { RedirectTo } from "@/Actions/useActions";
import { Pulse } from "@/Animation/Pulse";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-[95vh] flex justify-between items-center">
      <div className="w-5/12 flex flex-col px-10 gap-2">
      <div className="w-full  text-3xl items-center ">
      &quot;Mental health is not a destination, but a process. It&apos;s about how you drive, not where you&apos;re going.&quot; – <span className="text-red-500">Noam Shpancer</span>
      </div>
      <div className="text-muted-foreground">
      At ACS, we understand that mental health is a journey. Our interactive chat model is designed to listen, care for your feelings, and provide personalized support. By analyzing your needs, we help guide you through tough times and offer the best possible assistance to ensure you never feel alone on your path to well-being.
      </div>
      <div className="w-full flex justify-center items-center p-4 "><Button  className='rounded-sm shadow-none w-full' onClick={()=>{
        RedirectTo("/selftest")
      }}>Take Health Test</Button></div>
      </div>
      <div className="w-5/12"><Pulse/></div>
    </div>
  );
}
