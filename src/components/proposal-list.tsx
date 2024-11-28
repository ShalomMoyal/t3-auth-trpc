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

interface Proposal {
  interested_studies: string | null;
  studytype: string | null;
  studyTime: string | null;
  contact: string | null;
  createdAt: Date;
  description: string;
}

export function ProposalList() {
  // Fetch proposals using your API
  const { data: proposals = [], isLoading, isError } = api.proposal.getAll.useQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = proposals.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(proposals.length / itemsPerPage);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (isLoading) return <p>Loading proposals...</p>;
  if (isError) return <p>Failed to load proposals. Please try again.</p>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Proposal List</h1>
      <Table>
        <TableCaption>A list of all proposals. Click on a row to see more details.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Interested Studies</TableHead>
            <TableHead>Study Type</TableHead>
            <TableHead>Study Time</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead></TableHead>
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
                  {expandedRow === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
