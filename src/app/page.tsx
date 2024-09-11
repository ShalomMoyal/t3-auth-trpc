"use client";

import { AuthorizedLayout } from "@/components/AuthorizedLayout";

export default function Home() {
  return (
    <AuthorizedLayout>
      <h1 className="mb-4 text-4xl font-bold">Welcome to the Home Page</h1>
      <p>This is a protected page. You must be logged in to view it.</p>
    </AuthorizedLayout>
  );
}
