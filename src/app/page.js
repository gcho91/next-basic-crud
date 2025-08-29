// app/page.js

import PostClient from "./components/PostClient";

async function getPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseUrl}/api/posts`, {
    cache: "no-store", // ensures data is always fresh
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default async function HomePage() {
  const initialPosts = await getPosts();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Next.js CRUD Example (App Router)</h1>
      <PostClient initialPosts={initialPosts} />
    </div>
  );
}
