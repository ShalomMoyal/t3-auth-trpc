import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { ModalProposal } from "./modal-form";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b bg-background p-4">
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/icon.jpg" alt="WebApp Icon" width={170} height={90} />
      </Link>
      <div className="flex items-center space-x-4">
        <ModalProposal />
        <Button variant="ghost" size="icon" aria-label="Logout">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
}
