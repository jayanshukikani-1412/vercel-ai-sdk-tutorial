"use client";
import { useCompletion } from "@ai-sdk/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Alert } from "@/components/ui/alert";

export default function StreamPage() {

    const { input, handleInputChange, handleSubmit, completion, isLoading, error, setInput, stop } = useCompletion({
        api: "/api/completion/stream",
    })

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 min-h-screen flex flex-col">
            {/* Header Section */}
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">Text Generation</h1>
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Generate text using AI. Enter your prompt below and watch as the AI creates content in real-time.
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
                                {error?.message}
                            </Alert>
                        )}
                        {isLoading && !completion && (
                            <div className="flex justify-center items-center h-full min-h-[300px]">
                                <div className="text-center">
                                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
                                    <p className="text-muted-foreground">Generating response...</p>
                                </div>
                            </div>
                        )}
                        {completion && (
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
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                        setInput("");
                    }}
                    className="relative"
                >
                    <Card className="border-2">
                        <CardContent className="p-4">
                            <div className="flex gap-3 items-end">
                                <div className="flex-1 relative">
                                    <Input
                                        type="text"
                                        placeholder="Ask AI to generate text..."
                                        id="prompt"
                                        value={input}
                                        onChange={handleInputChange}
                                        className="pr-12 h-12 text-base"
                                        disabled={isLoading}
                                    />
                                    {isLoading && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                {isLoading ? (
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
                                        disabled={isLoading || !input.trim()}
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
    );
}