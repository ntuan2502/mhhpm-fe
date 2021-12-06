import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
export default function NotFound() {
  const [counter, setCounter] = useState(3);
  const router = useRouter();
  setInterval(() => {
    let temp = counter;
    setCounter(--temp);
  }, 1000);

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 3000);
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-center -translate-y-1/2">
      <h1 className="text-5xl font-bold">Page is still developing</h1>
      <h2 className="text-2xl mt-8">
        Redirect to
        <Link href="/">
          <a className="  underline text-blue-600"> Home </a>
        </Link>
        in {counter} seconds
      </h2>
    </div>
  );
}
