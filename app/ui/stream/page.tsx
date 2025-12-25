"use client";
import { useCompletion } from "@ai-sdk/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";

export default function StreamPage() {

    const { input, handleInputChange, handleSubmit, completion, isLoading, error, setInput, stop } = useCompletion({
        api: "/api/completion/stream",
    })



    return <div className="max-w-2xl mx-auto py-10">

        <form onSubmit={(e) => {
            e.preventDefault();
            setInput("");
            handleSubmit(e);
        }}>
            <Card>
                <CardHeader>
                    <CardTitle>Completion</CardTitle>
                </CardHeader>
                <CardContent >
                    <div className="flex gap-2">
                        <Label htmlFor="prompt">Prompt</Label>
                        <Input type="text" placeholder="Enter your prompt here" id="prompt" value={input} onChange={handleInputChange} />
                        {isLoading ? <Button type="button" onClick={stop} variant="destructive">Stop</Button> :
                            <Button type="submit" disabled={isLoading}>Send</Button>
                        }
                    </div>
                </CardContent>

                <div className="m-10 mt-3">
                    {error && <Alert variant="destructive">{error?.message}</Alert>}
                    {isLoading && !completion && <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-10 h-10 animate-spin" />
                    </div>}
                    {completion && <div className="whitespace-pre-wrap">{completion}</div>}
                </div>
            </Card>
        </form>
    </div>;
}