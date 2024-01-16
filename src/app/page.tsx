"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-16 p-24">
      <h1>Project Shotgun</h1>
      <div className="gap-4 flex flex-row">
        <input type="text" placeholder="Pseudo" />
        <Button
          title="Créer une bagarre"
          onClick={() => {
            router.push("/shotgun/create");
          }}
        >
          Créer une bagarre
        </Button>
      </div>
    </main>
  );
}
