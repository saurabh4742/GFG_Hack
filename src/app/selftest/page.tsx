"use client"
import { RedirectTo, submitForm } from '@/Actions/useActions';
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'

const Page = () => {
    const session = useSession();
  const [emotionalState, setEmotionalState] = useState<number | null>(null);
  const [motivationLevel, setMotivationLevel] = useState<number | null>(null);
  const [connectedness, setConnectedness] = useState<number | null>(null);
  const [positivityAboutFuture, setPositivityAboutFuture] = useState<number | null>(null);
  const [hopefulnessForImprovement, setHopefulnessForImprovement] = useState<number | null>(null);

  const handleSubmit = async() => {
    // Validate if all fields are selected
    if (
      emotionalState === null || 
      motivationLevel === null || 
      connectedness === null || 
      positivityAboutFuture === null || 
      hopefulnessForImprovement === null
    ) {
      alert("Please select an option for all fields.");
      return;
    }

    if(session.data?.user?.id){
        const formData = {
            id:session?.data?.user?.id ,
          emotionalState: emotionalState!,
          motivationLevel: motivationLevel!,
          connectedness: connectedness!,
          positivityAboutFuture: positivityAboutFuture!,
          hopefulnessForImprovement: hopefulnessForImprovement!,
        };
        try {
            const res = await submitForm(formData);
            if (res) {
             return RedirectTo("/aimodel");
            }
            console.log('Form submitted successfully:', formData);
          } catch (error) {
            console.error('Error submitting form:', error);
          }
        };
    }

    

  const sizeClasses = ['h-24 w-24', 'h-20 w-20', 'h-16 w-16', 'h-20 w-20', 'h-24 w-24'];

  return (
    <div className='min-h-[95vh] flex flex-col justify-between items-center gap-5 p-4'>
      <div className="font-bold text-3xl underline">
        Mental Health Self-Assessment
      </div>

      {/* Emotional State */}
      <div className='flex-col flex gap-2'>
        <div className='text-muted-foreground flex justify-center text-xl'>
          How are you feeling emotionally today?
        </div>
        <div className='flex justify-center items-center gap-6'>
          <div className='text-red-500'>Disagree</div>
          {sizeClasses.map((size, index) => (
            <div key={index}
              className={`${size} rounded-full border-2 cursor-pointer border-red-500 ${emotionalState === index + 1 ? 'bg-red-400' : 'hover:bg-red-400'}`}
              onClick={() => setEmotionalState(index + 1)}>
            </div>
          ))}
          <div className='text-blue-500'>Agree</div>
        </div>
      </div>

      {/* Motivation Level */}
      <div className='flex-col flex gap-2'>
        <div className='text-muted-foreground flex justify-center text-xl'>
          How motivated do you feel to complete your daily tasks?
        </div>
        <div className='flex justify-center items-center gap-6'>
          <div className='text-red-500'>Disagree</div>
          {sizeClasses.map((size, index) => (
            <div key={index}
              className={`${size} rounded-full border-2 cursor-pointer border-yellow-500 ${motivationLevel === index + 1 ? 'bg-yellow-400' : 'hover:bg-yellow-400'}`}
              onClick={() => setMotivationLevel(index + 1)}>
            </div>
          ))}
          <div className='text-blue-500'>Agree</div>
        </div>
      </div>

      {/* Connectedness */}
      <div className='flex-col flex gap-2'>
        <div className='text-muted-foreground flex justify-center text-xl'>
          How connected do you feel to the people around you?
        </div>
        <div className='flex justify-center items-center gap-6'>
          <div className='text-red-500'>Disagree</div>
          {sizeClasses.map((size, index) => (
            <div key={index}
              className={`${size} rounded-full border-2 cursor-pointer border-blue-500 ${connectedness === index + 1 ? 'bg-blue-400' : 'hover:bg-blue-400'}`}
              onClick={() => setConnectedness(index + 1)}>
            </div>
          ))}
          <div className='text-blue-500'>Agree</div>
        </div>
      </div>

      {/* Positivity About Future */}
      <div className='flex-col flex gap-2'>
        <div className='text-muted-foreground flex justify-center text-xl'>
          How often do you feel positive about the future?
        </div>
        <div className='flex justify-center items-center gap-6'>
          <div className='text-red-500'>Disagree</div>
          {sizeClasses.map((size, index) => (
            <div key={index}
              className={`${size} rounded-full border-2 cursor-pointer border-yellow-500 ${positivityAboutFuture === index + 1 ? 'bg-yellow-400' : 'hover:bg-yellow-400'}`}
              onClick={() => setPositivityAboutFuture(index + 1)}>
            </div>
          ))}
          <div className='text-blue-500'>Agree</div>
        </div>
      </div>

      {/* Hopefulness For Improvement */}
      <div className='flex-col flex gap-2'>
        <div className='text-muted-foreground flex justify-center text-xl'>
          How often do you feel hopeful about your mental health improving?
        </div>
        <div className='flex justify-center items-center gap-6'>
          <div className='text-red-500'>Disagree</div>
          {sizeClasses.map((size, index) => (
            <div key={index}
              className={`${size} rounded-full border-2 cursor-pointer border-blue-500 ${hopefulnessForImprovement === index + 1 ? 'bg-blue-400' : 'hover:bg-blue-400'}`}
              onClick={() => setHopefulnessForImprovement(index + 1)}>
            </div>
          ))}
          <div className='text-blue-500'>Agree</div>
        </div>
      </div>

      <Button size="lg" className='rounded-sm' onClick={handleSubmit}>Submit Response</Button>
    </div>
  )
}

export default Page;
