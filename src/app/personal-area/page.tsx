"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PersonalArea() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {session?.user?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Email: {session?.user?.email}</p>
          <Button onClick={() => router.push("/examples/post-crud")}>
            View Your Posts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
