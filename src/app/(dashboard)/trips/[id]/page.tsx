import { getTripById } from '@/actions/tripActions';
import { notFound } from 'next/navigation';
import TripDetailClient from './TripDetailClient';

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { trip } = await getTripById(id);

  if (!trip) {
    notFound();
  }

  return <TripDetailClient trip={trip} />;
}
