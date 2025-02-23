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
import { Mail, Airplay } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { sendInvite } from "@/app/actions/sendInvite";
import { toast } from "@/hooks/use-toast";

export default function FavoritesPage() {
  const { data: session, status } = useSession();

  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  if (status === "loading") return <p>Loading session...</p>;
  if (status === "unauthenticated") return <p>You must be logged in to view this page.</p>;

  const userID = session?.user?.id;

  const {
    data: favorites,
    isLoading,
    isError,
  } = api.favorit.getUserFaivoritProposal.useQuery();

  if (isLoading) return <p>Loading your favorite posts...</p>;
  if (isError)
    return <p>Failed to load favorite posts. Please try again later.</p>;

  if (!favorites || favorites.length === 0) {
    return <p>You have no favorite posts yet.</p>;
  }

  const handleInvite = async () => {
    if (!selectedProposal) return;

    const result = await sendInvite(
      selectedProposal.proposalId,
      selectedProposal.contact,
    );

    if (result.success) {
      toast({
        title: "Invite Sent",
        description: "The invitation has been sent successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to send the invitation. Please try again.",
        variant: "destructive",
      });
    }

    setIsInviteDialogOpen(false);
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
              <Dialog
                open={isInviteDialogOpen}
                onOpenChange={setIsInviteDialogOpen}
              >
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
                    <DialogTitle>Send Invite</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to send an invite for this proposal?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsInviteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleInvite}>Send Invite</Button>
                  </DialogFooter>
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
