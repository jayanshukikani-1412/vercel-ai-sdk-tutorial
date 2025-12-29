"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChat } from '@ai-sdk/react';
import { Loader2, MessageSquare, Send, User, Bot, AlertCircle } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react'

export default function ChatPage() {
    const [input, setInput] = useState('');
    const { messages, sendMessage, status, error, stop } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, status]);

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto min-h-screen">
            {/* Header Section */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <MessageSquare className="w-6 h-6 text-primary" />
                        <h1 className="text-3xl font-bold">AI Chat</h1>
                    </div>
                    <p className="text-muted-foreground text-center text-sm">
                        Have a conversation with AI. Ask questions, get answers, and explore ideas.
                    </p>
                </div>
            </div>

            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}

                    {messages.length === 0 && !error && (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="rounded-full bg-primary/10 p-4 mb-4">
                                <MessageSquare className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                            <p className="text-muted-foreground text-center text-sm max-w-md">
                                Send a message to begin chatting with AI. Ask questions, get help, or just have a conversation.
                            </p>
                        </div>
                    )}

                    {messages.map(message => (
                        <div
                            key={message.id}
                            className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            )}

                            <div className={`flex flex-col gap-2 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {message.role === 'user' ? 'You' : 'AI'}
                                    </span>
                                </div>
                                <Card className={`${message.role === 'user' ? 'bg-primary text-primary-foreground py-1' : 'bg-muted py-1'}`}>
                                    <CardContent className="px-4">
                                        {message.parts.map((part, i) => {
                                            switch (part.type) {
                                                case 'text':
                                                    return (
                                                        <div
                                                            key={`${message.id}-${i}`}
                                                            className="whitespace-pre-wrap text-sm leading-relaxed"
                                                        >
                                                            {part.text}
                                                        </div>
                                                    );
                                                default:
                                                    return null;
                                            }
                                        })}
                                    </CardContent>
                                </Card>
                            </div>

                            {message.role === 'user' && (
                                <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarFallback className="bg-secondary">
                                        <User className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}

                    {(status === 'submitted' || status === 'streaming') && (
                        <div className="flex gap-4 justify-start">
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    <Bot className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-medium text-muted-foreground">AI</span>
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    <p className="text-sm text-muted-foreground">AI is typing...</p>
                                </div> 
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Section */}
            <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-t">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <form onSubmit={handleSubmit} className="relative">
                        <Card className="border-2">
                            <CardContent className="p-4">
                                <div className="flex gap-3 items-end">
                                    <div className="flex-1 relative">
                                        <Input
                                            type="text"
                                            placeholder="Type your message..."
                                            value={input}
                                            onChange={e => setInput(e.currentTarget.value)}
                                            className="pr-12 h-12 text-base"
                                            disabled={status === 'submitted' || status === 'streaming'}
                                        />
                                        {(status === 'submitted' || status === 'streaming') && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    {(status === 'submitted' || status === 'streaming') ? (
                                        <Button
                                            type="button"
                                            onClick={stop}
                                            variant="destructive"
                                            size="lg"
                                            className="h-12 px-6"
                                        >
                                            Stop
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            disabled={!input.trim()}
                                            size="lg"
                                            className="h-12 px-6"
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Send
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    )
}
