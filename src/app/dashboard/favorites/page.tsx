'use client';

import { api } from '@/trpc/react';

export default function FavoritesPage() {
  const { data: favorites, isLoading, isError } = api.favorit.getUserFaivoritProposal.useQuery();

  if (isLoading) return <p>Loading your favorite posts...</p>;
  if (isError) return <p>Failed to load favorite posts. Please try again later.</p>;

  if (!favorites || favorites.length === 0) {
    return <p>You have no favorite posts yet.</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Favorite Proposals</h1>
      <ul className="space-y-4">
        {favorites.map((favorite) => (
          <li key={favorite.proposalId} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{favorite.interestedStudies}</h2>
            <p><strong>Form of Learning:</strong> {favorite.formLearning}</p>
            <p><strong>Study Time:</strong> {favorite.studyTime}</p>
            <p><strong>Contact:</strong> {favorite.contact}</p>
            <p><strong>Added on:</strong> {new Date(favorite.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
