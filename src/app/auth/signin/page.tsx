"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error(result.error);
      setError("Invalid email or password");
    } else {
      router.push("/examples/post-crud");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    router.push("/examples/post-crud");
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            {error && <div className="text-red-500">{error}</div>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Sign In with Email
            </Button>
            <Button
              type="button"
              className="w-full"
              onClick={() =>
                signIn("discord", { callbackUrl: "/examples/post-crud" })
              }
            >
              Sign In with Discord
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
