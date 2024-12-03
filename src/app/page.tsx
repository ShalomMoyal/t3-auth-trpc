"use client";

import { AuthorizedLayout } from "@/components/AuthorizedLayout";
import { ProposalList } from "@/components/proposal-list";
export default function Home() {
  return (
    <AuthorizedLayout>
      <ProposalList />
    </AuthorizedLayout>
  );
}
