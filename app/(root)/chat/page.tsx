"use client";
import { Button } from '@/components/ui/button';
import { useChat } from '@ai-sdk/react';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'

export default function ChatPage() {
    const [input, setInput] = useState('');
    const { messages, sendMessage, status, error, stop } = useChat();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
    }


    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch h-screen">
            {error && (
                <div className="text-center">
                    <p className="text-destructive">Error: {error.message}</p>
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                {messages.map(message => (
                    <div key={message.id} className="whitespace-pre-wrap w-full">
                        {message.role === 'user' ? <p className="text-right w-full">You: </p> : <p className="text-left">AI: </p>}
                        {message.parts.map((part, i) => {
                            switch (part.type) {
                                case 'text':
                                    return <div key={`${message.id}-${i}`} className={`whitespace-pre-wrap ${message.role === "user" ? "text-right" : "text-left"}`}>{part.text}</div>;
                            }
                        })}
                    </div>
                ))}

                {(status === 'submitted' || status === 'streaming') && (
                    <div className="flex items-center gap-2 mt-4 px-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">AI is typing...</p>
                    </div>
                )}
            </div>

            <form
                className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl gap-4 flex bg-white "
                onSubmit={handleSubmit}
            >
                <input
                    className="w-full"
                    value={input}
                    placeholder="Say something..."
                    onChange={e => setInput(e.currentTarget.value)}
                />
                {(status === 'submitted' || status === 'streaming') ? (
                    <Button type="button" onClick={stop}>Stop</Button>
                )
                    :
                    <Button type="submit"> Send</Button>
                }
            </form>
        </div>
    )
}
