"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PostCRUD() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingPost, setEditingPost] = useState<{
    id: number;
    title: string;
    body: string;
  } | null>(null);

  const utils = api.useUtils();
  const posts = api.post.getAll.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate();
      setTitle("");
      setBody("");
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });

  const updatePost = api.post.update.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate();
      setEditingPost(null);
      setTitle("");
      setBody("");
    },
  });

  const deletePost = api.post.delete.useMutation({
    onSuccess: () => utils.post.getAll.invalidate(),
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      updatePost.mutate({ id: editingPost.id, title, body });
    } else {
      console.log("Creating post with:", { title, body }); // Debug log
      createPost.mutate({ title, body });
    }
  };

  const handleCancel = () => {
    setEditingPost(null);
    setTitle("");
    setBody("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Posts CRUD</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingPost ? "Edit Post" : "Create New Post"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              className="w-full"
              required // Add this to ensure the field is not empty
            />
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Post body"
              className="w-full"
              required // Add this to ensure the field is not empty
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            {editingPost && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className={editingPost ? "w-1/2" : "w-full"}
              disabled={
                createPost.isPending ||
                updatePost.isPending ||
                !title.trim() ||
                !body.trim()
              } // Disable if fields are empty
            >
              {editingPost ? "Update" : "Create"} Post
            </Button>
          </CardFooter>
        </form>
      </Card>

      {posts.isLoading && <div>Loading posts...</div>}
      {posts.error && <div>Error loading posts: {posts.error.message}</div>}
      {posts.data && Array.isArray(posts.data) && posts.data.length === 0 && (
        <div>No posts found.</div>
      )}
      {posts.data && Array.isArray(posts.data) && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.data.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post.body}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingPost({
                      id: post.id,
                      title: post.title ?? "",
                      body: post.body ?? "",
                    });
                    setTitle(post.title ?? "");
                    setBody(post.body ?? "");
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deletePost.mutate({ id: post.id })}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
