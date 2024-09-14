"use client"
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ArrowDown, SendIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "@/components/EmojiPicker";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from 'axios';

interface MessageData {
  id: string;
  senderId: string;
  receiver: string;
  message: string;
  attachmentUrl?: string;
  sentAt: Date;
}

const MainChat = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const id = useParams<{ id: string }>().id;
  const session = useSession();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      senderId: session?.data?.user?.id || "",
      receiver: id || "",
      message: newMessage,
      sentAt: new Date(),
    };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post('/api/gemini', {
        prompt: newMessage,
      });
      const aiMessage = {
        id: `ai-${Date.now()}`,
        senderId: "ai",
        receiver: session.data?.user?.id || "",
        message: response.data.resAI,
        sentAt: new Date(),
      };
      setMessages([...messages, userMessage, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setNewMessage("");
  };

  useEffect(() => {
    const OneTimeRun = async () => {
      try {
        const res = await axios.get('/api/gemini');
        const aiMessage = {
          id: `ai-${Date.now()}`,
          senderId: "ai",
          receiver: session.data?.user?.id || "",
          message: res.data.resAI,
          sentAt: new Date(),
        };
        setMessages([...messages, aiMessage]);
      } catch (error) {}
    };
    OneTimeRun();
  }, [ session.data?.user?.id]);

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Function to format message text with bold styling when ** is detected
  const formatMessageText = (message: string) => {
    const parts = message.split(/(\*\*.+?\*\*)/g); // Split the text by **bold** pattern

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index}>
            {part.slice(2, -2)} {/* Remove the ** from the text */}
          </strong>
        );
      } else {
        return part;
      }
    });
  };

  return (
    <div className="w-full min-h-[95vh] sm:flex sm:flex-col">
      <div className="w-full min-h-[10vh] bg-[#E7E5E4]">
        <div className="flex justify-between gap-2 p-3">
          <Avatar className="relative shadow-md">
            <AvatarImage
              src={"https://img.freepik.com/premium-photo/red-background-with-brain-drawn-it_1308157-389346.jpg?w=740"}
            />
          </Avatar>
          <div className="w-full justify-center flex text-muted-foreground flex-col">
            Personal Assistance
          </div>
        </div>
      </div>
      <div className="h-[70vh] overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex max-w-5/12 ${
              msg.senderId === session?.data?.user?.id ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`p-4 rounded-lg ${
                msg.senderId === session?.data?.user?.id ? "bg-[#E11D48] text-white" : "bg-[#FEF2F2] text-black"
              }`}
            >
              <p>{formatMessageText(msg.message)}</p>
              <span className="text-sm">{formatTimestamp(new Date(msg.sentAt))}</span>
            </div>
          </div>
        ))}
        <div ref={lastMessageRef} />
      </div>
      <div className="flex w-full justify-center items-center">
        <div className="absolute bottom-28 flex justify-center items-center">
          <Button className="p-2 rounded-full bg-[#F43F5E]">
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="w-full">
        <div className="relative flex items-center gap-2">
          <Textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full border rounded-lg flex items-center h-9 resize-none overflow-hidden bg-background"
          />
          <div className="absolute right-20 top-8">
            <EmojiPicker
              onChange={(value: string) => {
                setNewMessage(newMessage + value);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            />
          </div>
          <Button onClick={handleSendMessage} size="lg" className="rounded-md p-4">
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainChat;
