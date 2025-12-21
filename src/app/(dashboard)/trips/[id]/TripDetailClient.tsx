'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trip } from '@/types';
import { deleteTrip, regenerateTrip } from '@/actions/tripActions';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiClock,
  FiRefreshCw,
  FiTrash2,
  FiArrowLeft,
} from 'react-icons/fi';
import { format } from 'date-fns';
import Link from 'next/link';

export default function TripDetailClient({ trip }: { trip: Trip }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trip?')) return;

    setIsDeleting(true);
    const result = await deleteTrip(trip.id);
    
    if (result.success) {
      router.push('/trips');
      router.refresh();
    } else {
      alert('Failed to delete trip');
      setIsDeleting(false);
    }
  };

  const handleRegenerate = async () => {
    if (!confirm('Generate a new itinerary for this trip?')) return;

    setIsRegenerating(true);
    const result = await regenerateTrip(trip.id);
    
    if (result.success) {
      router.refresh();
    } else {
      alert('Failed to regenerate trip');
    }
    setIsRegenerating(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/trips"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-4"
        >
          <FiArrowLeft />
          <span>Back to Trips</span>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center space-x-3">
              <FiMapPin className="text-primary-600" />
              <span>{trip.destination}</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Created on {format(new Date(trip.created_at), 'MMMM d, yyyy')}
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={handleRegenerate}
              isLoading={isRegenerating}
            >
              <FiRefreshCw className="mr-2" />
              Regenerate
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              <FiTrash2 className="mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Trip Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InfoCard icon={<FiCalendar />} label="Duration" value={`${trip.travel_days} days`} />
        <InfoCard
          icon={<FiDollarSign />}
          label="Budget"
          value={`$${trip.budget.toLocaleString()}`}
        />
        <InfoCard
          icon={<FiDollarSign />}
          label="Estimated Cost"
          value={`$${trip.total_estimated_cost.toLocaleString()}`}
        />
        <InfoCard
          icon={<FiClock />}
          label="Travel Style"
          value={trip.travel_style}
          capitalize
        />
      </div>

      {/* Interests */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {trip.interests.map((interest) => (
            <span
              key={interest}
              className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </Card>

      {/* Itinerary */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Itinerary</h2>
        {trip.itinerary.map((day) => (
          <Card key={day.day}>
            <div className="space-y-4">
              {/* Day Header */}
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Day {day.day}: {day.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Estimated cost: ${day.estimated_cost.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-4">
                {day.activities.map((activity, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0 w-20 text-sm font-medium text-primary-600">
                      {activity.time}
                    </div>
                    <div className="flex-1 border-l-2 border-primary-200 pl-4">
                      <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>📍 {activity.location}</span>
                        <span>⏱️ {activity.duration}</span>
                        <span>💵 ${activity.cost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              {day.tips && day.tips.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Day {day.day}</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                    {day.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  capitalize = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <Card>
      <div className="flex items-center space-x-3">
        <div className="text-primary-600 text-2xl">{icon}</div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`text-lg font-bold text-gray-900 ${capitalize ? 'capitalize' : ''}`}>
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}
