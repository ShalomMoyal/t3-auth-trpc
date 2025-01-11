'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { api } from "@/trpc/react";

export function ProposalList() {
  const { data: proposals = [], isLoading, isError } = api.proposal.getAll.useQuery();
  const addFavorite = api.favorit.add.useMutation();
  const removeFavorite = api.favorit.remove.useMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({}); // Track favorite states locally
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = proposals.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(proposals.length / itemsPerPage);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleFavoriteClick = async (proposalId: string) => {
    const isCurrentlyFavorite = favorites[proposalId];
    try {
      if (isCurrentlyFavorite) {
        await removeFavorite.mutateAsync({ proposalId });
      } else {
        await addFavorite.mutateAsync({ proposalId });
      }
      // Update local favorite state
      setFavorites((prev) => ({
        ...prev,
        [proposalId]: !isCurrentlyFavorite,
      }));
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  if (isLoading) return <p>Loading proposals...</p>;
  if (isError) return <p>Failed to load proposals. Please try again.</p>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-4">הצעות למידה ביחד</h1>
      <Table>
        <TableCaption>A list of all proposals. Click on a row to see more details.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Interested Studies</TableHead>
            <TableHead>Study Type</TableHead>
            <TableHead>Study Time</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((proposal, index) => (
            <>
              <TableRow 
                key={index} 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => toggleRow(index)}
              >
                <TableCell>{proposal.interestedStudies || 'N/A'}</TableCell>
                <TableCell>{proposal.formLearning || 'N/A'}</TableCell>
                <TableCell>{proposal.studyTime || 'N/A'}</TableCell>
                <TableCell>{proposal.contact || 'N/A'}</TableCell>
                <TableCell>{format(new Date(proposal.createdAt), 'PPP')}</TableCell>
                <TableCell>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row toggle
                      handleFavoriteClick(proposal.id);
                    }}
                    className={`text-sm ${
                      favorites[proposal.id]
                        ? 'text-red-500 hover:text-red-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {favorites[proposal.id] ? 'Unfavorite' : 'Favorite'}
                  </button>
                </TableCell>
              </TableRow>
              {expandedRow === index && (
                <TableRow>
                  <TableCell colSpan={6} className="bg-gray-50">
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">Description:</h3>
                      <p>{proposal.createdById}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink 
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
