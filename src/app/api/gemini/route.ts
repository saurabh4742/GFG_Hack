import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "../../../../utils/prisma";

export async function GET() {
  try {
    const session = await auth();

    // Retrieve the user's most recent mental health response
    const submissions = await prisma.user.findFirst({
      where: { id: session?.user?.id },
      select: { mentalHealthResponses: true }
    });

    if (!submissions || submissions.mentalHealthResponses.length === 0) {
      return NextResponse.json("No mental health responses found", { status: 404 });
    }

    const lastEntry = submissions.mentalHealthResponses[submissions.mentalHealthResponses.length - 1];
    const preTraining = `
Hi, my name is ${session?.user?.name}, and I’ve been facing some mental health challenges recently. To better understand my situation, I completed a self-assessment where I rated different aspects of my well-being on a scale of 1 to 5 (1 being the lowest, 5 the highest). Here are my responses:

1. Emotional State: ${lastEntry.emotionalState}
2. Motivation Level: ${lastEntry.motivationLevel}
3. Connectedness to Others: ${lastEntry.connectedness}
4. Positivity About the Future: ${lastEntry.positivityAboutFuture}
5. Hopefulness for Improvement: ${lastEntry.hopefulnessForImprovement}

Given these insights, I’d really appreciate it if you could provide a thoughtful and supportive response. Please help me reflect on my current emotional state and offer guidance on how I can manage or improve my mental well-being. Your response should focus on:

- Reassurance: Validate my feelings and acknowledge the challenges I’m facing.
- Emotional Support: Show empathy and care, offering comfort.
- Practical Tips: Provide helpful suggestions for managing my emotions, improving motivation, or feeling more connected to others.

I’m looking for guidance that will encourage hope and offer a sense of calm as I work through these challenges.
`;


    // Use the Google Generative AI model to generate the content
    if (process?.env.API_KEY_GEMINI) {
      const genAI = new GoogleGenerativeAI(process?.env.API_KEY_GEMINI);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(preTraining);
      console.log(result.response.text());

      // Update the mental health response to mark it as used
      await prisma.mentalHealthResponse.update({
        where: { id: lastEntry.id },
        data: { used: true }
      });

      return NextResponse.json({resAI:result.response.text()}, { status: 200 });
    } else {
      return NextResponse.json("API key not configured", { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json("Error", { status: 501 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Retrieve request body
    const { prompt } = await req.json();

    // If there is a chat prompt, handle chatting with the model
    if (prompt) {
      const chatResponse = await handleChatPrompt(prompt);
      return NextResponse.json({resAI:chatResponse}, { status: 200 });
    }

    // Retrieve the user's most recent mental health response
    const submissions = await prisma.user.findFirst({
      where: { id: session?.user?.id },
      select: { mentalHealthResponses: true }
    });

    if (!submissions || submissions.mentalHealthResponses.length === 0) {
      return NextResponse.json("No mental health responses found", { status: 404 });
    }

    const lastEntry = submissions.mentalHealthResponses[submissions.mentalHealthResponses.length - 1];

    // Check if the last mental health response has been used
    if (lastEntry.used) {
      return NextResponse.json("Last response already used", { status: 400 });
    }

    const preTraining = `
Hello, my name is ${session?.user?.name}. I have been experiencing some challenges related to my mental health. 
Recently, I answered a self-assessment about my emotional state, motivation level, connectedness, and hope for the future. Here are my responses, rated on a scale of 1 to 5, with 1 being the lowest and 5 being the highest:

1. Emotional State: ${lastEntry.emotionalState} 
2. Motivation Level: ${lastEntry.motivationLevel}
3. Connectedness to Others: ${lastEntry.connectedness}
4. Positivity About the Future: ${lastEntry.positivityAboutFuture}
5. Hopefulness for Improvement: ${lastEntry.hopefulnessForImprovement}

Based on these responses, please provide a caring and empathetic reply to help me reflect on my feelings and offer guidance on how to manage or improve my mental well-being. The response should focus on reassurance, emotional support, and practical tips, while recognizing my current emotional state and challenges.
`;

    // Use the Google Generative AI model to generate the content
    if (process?.env.API_KEY_GEMINI) {
      const genAI = new GoogleGenerativeAI(process?.env.API_KEY_GEMINI);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(preTraining);
      console.log(result.response.text());

      // Update the mental health response to mark it as used
      await prisma.mentalHealthResponse.update({
        where: { id: lastEntry.id },
        data: { used: true }
      });
      console.log(result.response.text());
      return NextResponse.json({resAI:result.response.text()}, { status: 200 });
    } else {
      return NextResponse.json("API key not configured", { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json("Error", { status: 501 });
  }
}

// Helper function to handle chat prompts
async function handleChatPrompt(prompt: string) {
  if (!process?.env.API_KEY_GEMINI) {
    throw new Error("API key not configured");
  }

  const genAI = new GoogleGenerativeAI(process?.env.API_KEY_GEMINI);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);

  return result.response.text();
}
