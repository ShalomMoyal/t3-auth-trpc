"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Airplay } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function FavoritesPage() {
  const { data: session } = useSession();
  const userID = session?.user?.id;

  // Add a loading check for session
  if (!session) return <p>Loading session...</p>;

  const {
    data: favorites,
    isLoading,
    isError,
  } = api.favorit.getUserFaivoritProposal.useQuery();
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedProposal, setSelectedProposal] = useState(null);

  if (isLoading) return <p>Loading your favorite posts...</p>;
  if (isError)
    return <p>Failed to load favorite posts. Please try again later.</p>;

  if (!favorites || favorites.length === 0) {
    return <p>You have no favorite posts yet.</p>;
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the invite email
    console.log(
      `Sending invite for proposal ${selectedProposal.proposalId} to ${inviteEmail}`,
    );
    // Reset the form
    setInviteEmail("");
    setSelectedProposal(null);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Favorite Proposals</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((favorite) => (
          <Card key={favorite.proposalId}>
            <CardHeader>
              <CardTitle>{favorite.interestedStudies}</CardTitle>
              <CardDescription>
                Added on {new Date(favorite.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Form of Learning:</strong> {favorite.formLearning}
              </p>
              <p>
                <strong>Study Time:</strong> {favorite.studyTime}
              </p>
              <p>
                <strong>Contact:</strong> {favorite.contact}
              </p>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProposal(favorite)}
                  >
                    <Mail className="mr-2 h-4 w-4" /> Invite
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Invite to Proposal</DialogTitle>
                    <DialogDescription>
                      Send an invite email for this proposal. The recipient will
                      receive details about the study.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleInvite}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="Enter recipient's email"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Send Invite</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Link
                href={`/dashboard/meetingRoom?proposalID=${favorite.proposalId}&userID=${userID}`}
              >
                <Button variant="outline">
                  <Airplay className="mr-2 h-4 w-4" /> Go study together
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
