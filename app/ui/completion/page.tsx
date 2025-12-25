"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
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

    return <div className="max-w-2xl mx-auto py-10">

        <form onSubmit={complete}>
            <Card>
                <CardHeader>
                    <CardTitle>Completion</CardTitle>
                </CardHeader>
                <CardContent >
                    <div className="flex gap-2">
                        <Label htmlFor="prompt">Prompt</Label>
                        <Input type="text" placeholder="Enter your prompt here" id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                        <Button type="submit" disabled={isLoading}>Send</Button>
                    </div>
                </CardContent>

                <div className="m-10 mt-3">
                    {isLoading ? <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-10 h-10 animate-spin" />
                    </div> : completion ? <div className="flex justify-center items-center h-full">
                        <p>{completion}</p>
                    </div> : null}
                    {error && <Alert variant="destructive">{error}</Alert>}
                </div>
            </Card>
        </form>
    </div>;
}