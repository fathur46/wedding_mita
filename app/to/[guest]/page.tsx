import type { Metadata } from "next";
import NikahfixExperience from "@/components/NikahfixExperience";
import { nameFromSlug } from "@/lib/slug";
import { weddingConfig } from "@/lib/content";

type Params = Promise<{ guest: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { guest } = await params;
  const name = nameFromSlug(guest);
  return {
    title: `NIKAHFIX — ${weddingConfig.coupleTitle}`,
    description: `${name}, you're invited to the next episode of our love story.`,
  };
}

export default async function GuestPage({ params }: { params: Params }) {
  const { guest } = await params;
  const name = nameFromSlug(guest);
  return <NikahfixExperience initialName={name} />;
}
