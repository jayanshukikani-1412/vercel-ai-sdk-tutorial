"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, Send, Sparkles, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        <div className="max-w-4xl mx-auto min-h-screen flex flex-col">
            {/* Header Section */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="rounded-full bg-primary/10 p-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold">Text Generation</h1>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-center">
                        Generate text using AI. Enter your prompt below and get instant AI-generated content.
                    </p>
                </div>
            </div>

            {/* Answer Display Section */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <Card className="h-full min-h-[400px] shadow-lg">
                    <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Generated Response
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-full p-6">
                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {isLoading && (
                            <div className="flex justify-center items-center h-full min-h-[300px]">
                                <div className="text-center space-y-4">
                                    <div className="relative">
                                        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                                        <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground font-medium">Generating response...</p>
                                        <p className="text-muted-foreground text-sm mt-1">Please wait while AI creates your content</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {completion && !isLoading && (
                            <div className="whitespace-pre-wrap text-sm leading-relaxed p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border/50 shadow-sm">
                                {completion}
                            </div>
                        )}
                        {!completion && !isLoading && !error && (
                            <div className="flex flex-col justify-center items-center h-full min-h-[300px] text-center px-4">
                                <div className="rounded-full bg-muted p-6 mb-4">
                                    <Sparkles className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Ready to generate</h3>
                                <p className="text-muted-foreground max-w-md">
                                    Your generated text will appear here. Start by entering a prompt below and get instant AI-generated content.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* AI Input Section at Bottom */}
            <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-t">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <form onSubmit={complete} className="relative">
                        <Card className="border-2 shadow-lg">
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
        </div>
    );
}