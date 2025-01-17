"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "../../lib/db";
import { sendMessageToGPT } from "../../lib/gpt";
import {
  GPTResponse,
  Personality,
  LoadingMessageBoxProps,
  ImageAnalysis,
  Message
} from "../../types";
import Image from "next/image";
import {
  ClipboardIcon,
  CheckIcon,
  ArrowPathIcon,
  PhotoIcon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/dynamic-components'

const LoadingDots = () => (
  <div className="flex space-x-1.5 items-center py-2">
    <div className="w-2 h-2 bg-[#000] rounded-full animate-pulse"></div>
    <div className="w-2 h-2 bg-[#000] rounded-full animate-pulse delay-75"></div>
    <div className="w-2 h-2 bg-[#000] rounded-full animate-pulse delay-150"></div>
  </div>
);

const LoadingMessageBox = ({ count = 3 }: LoadingMessageBoxProps) => (
  <div className="flex flex-col space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-neutral-900 rounded-lg p-3 animate-pulse">
        <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);

const PersonalityBadge = ({ personality }: { personality: Personality }) => {
  const badges = {
    NORMAL: { bg: "bg-blue-500", text: "Normal" },
    RIZZ: { bg: "bg-purple-500", text: "RIZZ" },
    CASUAL: { bg: "bg-green-500", text: "Casual" },
    PROFESSIONAL: { bg: "bg-gray-500", text: "Professional" },
  };
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [personality, setPersonality] = useState<Personality>("NORMAL");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { connected } = useWallet();
  const [isBlurred, setIsBlurred] = useState(!connected);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setDragCounter(prev => prev - 1);
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(0);
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      
      if (!file.type.startsWith('image/')) {
        alert('Please drop only image files');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    setIsBlurred(!connected);
  }, [connected]);
  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = await db.messages.toArray();
      setMessages(storedMessages);
    };
    loadMessages();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearChat = async () => {
    try {
      await db.messages.clear();
      setMessages([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(0);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imagePreview) return;

    setIsLoading(true);
    try {
      const newMessage: Message = {
        id: Date.now(),
        content: input,
        type: "user",
        timestamp: new Date(),
      };

      if (imagePreview) {
        newMessage.image = imagePreview;
      }

      await db.messages.add(newMessage);
      setMessages((prev) => [...prev, newMessage]);

      const loadingMessage: Message = {
        id: Date.now() + 1,
        content: "Generating response...",
        type: "assistant",
        timestamp: new Date(),
        isLoading: true,
      };
      setMessages((prev) => [...prev, loadingMessage]);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const gptResponseString = await sendMessageToGPT({
        ...newMessage,
        personality,
      });

      let gptResponse: { text: string; explanation?: string };
      try {
        gptResponse = JSON.parse(gptResponseString);
      } catch (err) {
        gptResponse = {
          text: gptResponseString,
          explanation: "There was a problem in Pars.",
        };
      }

      const finalAssistantMessage: Message = {
        ...loadingMessage,
        content: "Suggested answer:",
        suggestions: [gptResponse.text],
        explanations: [gptResponse.explanation || ""],
        isLoading: false,
      };

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMessage.id ? finalAssistantMessage : m
        )
      );
      await db.messages.put(finalAssistantMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: Date.now() + 2,
        content: "Error sending message. Try again.",
        type: "assistant",
        timestamp: new Date(),
      };
      await db.messages.add(errorMessage);
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput("");
      setImagePreview(null);
      setImageAnalysis(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
<div 
  className="flex flex-col h-screen bg-black"
  onDragEnter={handleDragEnter}
  onDragLeave={handleDragLeave}
  onDragOver={handleDragOver}  
  onDrop={handleDrop}
>
      {isBlurred && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-10">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Please connect your wallet</h1>
            <WalletButton />
          </div>
        </div>
      )}
      {isDragging && (
        <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 border-2 border-dashed border-[#00FFA3]">
          <div className="text-center text-white">
            <PhotoIcon className="h-16 w-16 mx-auto mb-4 text-[#00FFA3]" />
            <p className="text-xl">Drop your image here</p>
            <p className="text-sm text-gray-400 mt-2">Supports: JPG, PNG, GIF (Max 5MB)</p>
          </div>
        </div>
      )}
      <div className="bg-neutral-950 p-4 border-b border-neutral-800">
        <div className="flex justify-between items-center  max-w-[1140px] mx-auto">
          <div className="flex items-center space-x-2">
          <span className="text-sm xl:text-2xl font-bold">
            <span className="bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent text-2xl font-bold">rizzmaster</span>
              <span className="text-white">69</span>
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={clearChat}
              className="text-neutral-400 hover:text-red-500 rounded-lg px-2 py-1 transition-colors"
              title="Clear chat"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950 ">
        {messages.map((message) => (
          <div key={message.id} className=" max-w-[1140px] mx-auto">
            {message.type === "assistant" &&
            (message.suggestions || message.isLoading) ? (
              <div className="space-y-2">
                <div className="text-neutral-400 text-sm flex items-center space-x-2">
                  <ChatBubbleLeftIcon className="h-4 w-4" />
                  <span>{message.content}</span>
                </div>
                {message.isLoading ? (
                  <LoadingMessageBox count={1} />
                ) : (
                  message.suggestions?.[0] && (
                    <div className="flex flex-col bg-neutral-900 rounded-lg p-3 group hover:bg-neutral-800 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="text-neutral-200">
                          {message.suggestions[0]}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(message.suggestions![0])
                          }
                          className={`p-1 transition-colors ${
                            copiedIndex === 0
                              ? "text-green-500"
                              : "text-neutral-400 hover:text-red-500"
                          }`}
                        >
                          {copiedIndex === 0 ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : (
                            <ClipboardIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {message.explanations?.[0] && (
                        <p className="text-neutral-500 text-sm mt-2">
                          {message.explanations[0]}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <div
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black"
                      : "bg-neutral-900 text-neutral-200"
                  }`}
                >
                  {message.image && (
                    <div className="mb-2">
                      <Image
                        src={message.image}
                        alt="Uploaded image"
                        width={300}
                        height={200}
                        className="rounded-lg"
                      />
                      {message.imageAnalysis && (
                        <div className="mt-2 text-sm opacity-75">
                          <p>Type: {message.imageAnalysis.type}</p>
                          <p>
                            Confidence:{" "}
                            {(message.imageAnalysis.confidence * 100).toFixed(
                              1
                            )}
                            %
                          </p>
                          <p>{message.imageAnalysis.details}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between mt-1 text-xs opacity-70">
                    <span>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>
      {imagePreview && (
        <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex flex-col items-center">
          <div className="relative inline-block">
            <Image
              src={imagePreview}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]  text-transparent text-black rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
          {imageAnalysis && (
            <div className="mt-2 text-sm text-neutral-400">
              <p>Type: {imageAnalysis.type}</p>
              <p>Confidence: {(imageAnalysis.confidence * 100).toFixed(1)}%</p>
              <p>{imageAnalysis.details}</p>
            </div>
          )}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-neutral-900 border-t border-neutral-800 "
      >
        <div className="flex  max-w-[1140px] mx-auto">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageSelect}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg transition-colors ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-neutral-700"
            }`}
            disabled={isLoading}
          >
            <PhotoIcon className="h-5 w-5" />
          </button>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Write message..."
            rows={1}
            className="flex-1 mx-2 px-4 py-2 bg-neutral-800 text-neutral-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFA3] placeholder-neutral-400 resize-none"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
  type="submit"
  disabled={isLoading}
  className={`px-6 py-2 rounded-lg transition-colors ${
    isLoading
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black hover:bg-red-600"
  }`}
>
  {isLoading ? <LoadingDots /> : "Send"}
</button>

        </div>
      </form>
    </div>
  );
}
