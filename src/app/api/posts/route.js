// app/api/posts/route.js

import { NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase"; // Import the Supabase client
import { supabase } from "../../../../lib/supabase";

let posts = [
  { id: 1, title: "First Post", content: "This is the first post." },
  { id: 2, title: "Second Post", content: "This is the second post." },
];

export async function GET() {
  const { data, error } = await supabase
    .from("posts")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log("Successfully fetched data:", data);
  return NextResponse.json(data);
}

export async function POST(request) {
  const { title, content } = await request.json();
  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content }])
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data[0], { status: 201 });
}

export async function PUT(request) {
  const { id, title, content } = await request.json();
  const { data, error } = await supabase
    .from("posts")
    .update({ title, content })
    .eq("id", id)
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (data.length === 0) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }
  return NextResponse.json(data[0]);
}

export async function DELETE(request) {
  const { id } = await request.json();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Post deleted successfully" });
}
