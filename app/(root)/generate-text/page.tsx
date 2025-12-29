"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Alert } from "@/components/ui/alert";

export default function CompletionPage() {
    const [prompt, setPrompt] = useState(""); //user input
    const [completion, setCompletion] = useState(""); // ai response
    const [isLoading, setIsLoading] = useState(false); // loading state
    const [error, setError] = useState("");

    const complete = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/completion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "An error occurred while generating the completion.");
            }
            setCompletion(data.text);
            setError("");
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "An error occurred while generating the completion.");
            setCompletion("");
        } finally {
            setIsLoading(false);
            setPrompt("");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 min-h-screen flex flex-col">
            {/* Header Section */}
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">Text Generation</h1>
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Generate text using AI. Enter your prompt below and get instant AI-generated content.
                </p>
            </div>

            {/* Answer Display Section */}
            <div className="flex-1 mb-6">
                <Card className="h-full min-h-[400px]">
                    <CardHeader>
                        <CardTitle>Generated Response</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                {error}
                            </Alert>
                        )}
                        {isLoading && (
                            <div className="flex justify-center items-center h-full min-h-[300px]">
                                <div className="text-center">
                                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
                                    <p className="text-muted-foreground">Generating response...</p>
                                </div>
                            </div>
                        )}
                        {completion && !isLoading && (
                            <div className="whitespace-pre-wrap text-sm leading-relaxed p-4 bg-muted/50 rounded-lg">
                                {completion}
                            </div>
                        )}
                        {!completion && !isLoading && !error && (
                            <div className="flex justify-center items-center h-full min-h-[300px]">
                                <p className="text-muted-foreground text-center">
                                    Your generated text will appear here. Start by entering a prompt below.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* AI Input Section at Bottom */}
            <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-t pt-4 pb-4">
                <form onSubmit={complete} className="relative">
                    <Card className="border-2">
                        <CardContent className="p-4">
                            <div className="flex gap-3 items-end">
                                <div className="flex-1 relative">
                                    <Input
                                        type="text"
                                        placeholder="Ask AI to generate text..."
                                        id="prompt"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        className="pr-12 h-12 text-base"
                                        disabled={isLoading}
                                    />
                                    {isLoading && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading || !prompt.trim()}
                                    size="lg"
                                    className="h-12 px-6"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}