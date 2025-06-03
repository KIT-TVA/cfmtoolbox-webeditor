"use client";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  return (
    <>
      <div>CFM Toolbox Web-Editor incoming</div>
      <button onClick={() => router.push("editor")}> Open Editor</button>
    </>
  );
}
