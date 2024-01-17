"use client";

import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();
  const id = pathname?.split("/")[2];

  return (
    <>
      <h1>Shotgun #{id}</h1>
      <h2>Projet recherche</h2>
    </>
  );
}
