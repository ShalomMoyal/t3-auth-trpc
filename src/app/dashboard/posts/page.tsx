'use client'

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2 } from 'lucide-react';
import { api } from "@/trpc/react";

interface Proposal {
  id: string;
  interestedStudies: string | null;
  formLearning: string | null;
  studyTime: string | null;
  contact: string | null;
  createdAt: Date;
  description: string;
}

export default function PostsPage() {
  const { data, isLoading, isError, refetch } = api.proposal.getUserProposal.useQuery();
  const updateProposal = api.proposal.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditModalOpen(false);
    }
  });
  const deleteProposal = api.proposal.delete.useMutation({
    onSuccess: () => refetch()
  });

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);

  // Update proposals when data is fetched
  useEffect(() => {
    if (data) {
      setProposals(data);
    }
  }, [data]);

  const handleEdit = (proposal: Proposal) => {
    setCurrentProposal(proposal);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProposal.mutate({ id });
  };

  const handleUpdate = (updatedProposal: Proposal) => {
    updateProposal.mutate(updatedProposal);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Posts</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading proposals.</p>}
      {!isLoading && proposals.length === 0 && <p>No proposals found.</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Interested Studies</TableHead>
            <TableHead>Study Type</TableHead>
            <TableHead>Study Time</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proposals.map((proposal) => (
            <TableRow key={proposal.id}>
              <TableCell>{proposal.interestedStudies|| 'N/A'}</TableCell>
              <TableCell>{proposal.formLearning || 'N/A'}</TableCell>
              <TableCell>{proposal.studyTime || 'N/A'}</TableCell>
              <TableCell>{proposal.contact || 'N/A'}</TableCell>
              <TableCell>{new Date(proposal.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{proposal.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(proposal)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(proposal.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          {currentProposal && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(currentProposal);
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="interested_studies" className="text-right">
                    Interested Studies
                  </Label>
                  <Input
                    id="interested_studies"
                    value={currentProposal.interestedStudies || ''}
                    onChange={(e) => setCurrentProposal({ ...currentProposal, interestedStudies: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="studytype" className="text-right">
                    Study Type
                  </Label>
                  <Input
                    id="studytype"
                    value={currentProposal.formLearning || ''}
                    onChange={(e) => setCurrentProposal({ ...currentProposal, formLearning: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="studyTime" className="text-right">
                    Study Time
                  </Label>
                  <Input
                    id="studyTime"
                    value={currentProposal.studyTime || ''}
                    onChange={(e) => setCurrentProposal({ ...currentProposal, studyTime: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">
                    Contact
                  </Label>
                  <Input
                    id="contact"
                    value={currentProposal.contact || ''}
                    onChange={(e) => setCurrentProposal({ ...currentProposal, contact: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={currentProposal.description}
                    onChange={(e) => setCurrentProposal({ ...currentProposal, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
