import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NavBar } from "./NavBar";

export function AuthorizedLayout({ children }: { children: React.ReactNode }) {
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
    <div>
      <NavBar />
      <main className="container mx-auto mt-4">{children}</main>
    </div>
  );
}
