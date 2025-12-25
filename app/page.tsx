"use client";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {


  return (

    <div className="max-w-2xl mx-auto py-10">
      <div className="flex flew-wrap gap-4">
        <Link href="/ui/completion" className={`text-2xl font-bold ${buttonVariants({ variant: "default" })}`}>Completion</Link>

        <Link href="/ui/stream" className={`text-2xl font-bold ${buttonVariants({ variant: "default" })}`}>Stream</Link>
      </div>
    </div>
  )
}
