import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function NavBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link
            href="/examples/post-crud"
            className="text-white hover:text-gray-300"
          >
            Posts
          </Link>
        </div>
        <Button
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          variant="destructive"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
