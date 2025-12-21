import { getTripById } from '@/actions/tripActions';
import { notFound } from 'next/navigation';
import TripDetailClient from './TripDetailClient';

export default async function TripDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { trip } = await getTripById(params.id);

  if (!trip) {
    notFound();
  }

  return <TripDetailClient trip={trip} />;
}
