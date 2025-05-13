"use client"

import { useState } from "react";
export default function Home() {
  const [data, setData] = useState(null);
  const handleClick = () => { //post request
    fetch('/api/test', {
      method: 'POST',
      body: JSON.stringify({ name: 'John' })
    })
      .then(res => res.json())
      .then(data => setData(data))
  }
  return (
    <div className="bg-black w-full">
      <h1 className="text-white scroll-m-20 text-8xl font-extrabold tracking-tight lg:text-5xl">
        Test
      </h1>
      <button onClick={handleClick}
        className="bg-blue-500 text-white p-2 rounded-md">
        Click me
      </button>
      <div>
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  );
}
