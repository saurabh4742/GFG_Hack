"use server"

import { redirect } from "next/navigation"
import { prisma } from "../../utils/prisma"

export const RedirectTo=(name:string)=>{
    return redirect(name)
}

export const submitForm = async (formData: { 
    id: string;
    emotionalState: number; 
    motivationLevel: number; 
    connectedness: number; 
    positivityAboutFuture: number; 
    hopefulnessForImprovement: number; 
  }) => {
    try {
      const resp = await prisma.user.update({
        where: {
          id: formData.id,
        },
        data: {
          mentalHealthResponses: {
            create: {
              emotionalState: formData.emotionalState,
              motivationLevel: formData.motivationLevel,
              connectedness: formData.connectedness,
              positivityAboutFuture: formData.positivityAboutFuture,
              hopefulnessForImprovement: formData.hopefulnessForImprovement,
            },
          },
        },
      });
  
      console.log('Form submission successful:', resp);
      return true;
  
    } catch (error) {
      console.error('Error submitting the form:', error);
      return false;
    }
  };
  
  