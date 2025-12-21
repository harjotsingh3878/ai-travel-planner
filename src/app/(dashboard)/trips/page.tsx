import { getUserTrips } from '@/actions/tripActions';
import TripsClient from './TripsClient';

export default async function TripsPage() {
  const { trips } = await getUserTrips();

  return <TripsClient trips={trips || []} />;
}
