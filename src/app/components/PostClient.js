// components/PostClient.js

"use client";

import { useState } from "react";

export default function PostClient({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const refreshPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    });
    if (res.ok) {
      setNewTitle("");
      setNewContent("");
      refreshPosts();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editId,
        title: editTitle,
        content: editContent,
      }),
    });
    if (res.ok) {
      setEditId(null);
      setEditTitle("");
      setEditContent("");
      refreshPosts();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      refreshPosts();
    }
  };

  const startEdit = (post) => {
    setEditId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  return (
    <div>
      {/* Create Form */}
      <h2>Create New Post</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          required
        />
        <br />
        <button type="submit">Create Post</button>
      </form>

      <hr />

      {/* List of Posts and Update/Delete controls */}
      <h2>Posts</h2>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          {editId === post.id ? (
            // Update Form
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <br />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <br />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditId(null)}>
                Cancel
              </button>
            </form>
          ) : (
            // Display Post
            <>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <button onClick={() => startEdit(post)}>Edit</button>
              <button onClick={() => handleDelete(post.id)}>
                Delete {post.id}
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
