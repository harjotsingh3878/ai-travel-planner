'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trip } from '@/types';
import Card from '@/components/ui/Card';
import { FiMapPin, FiCalendar, FiDollarSign, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

export default function TripsClient({ trips }: { trips: Trip[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = trips.filter((trip) =>
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Trips Yet</h2>
        <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
        <Link
          href="/trips/create"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Create Your First Trip
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-600 mt-1">{trips.length} total trips</p>
        </div>
        <Link
          href="/trips/create"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Create New Trip
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by destination..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => (
          <Link key={trip.id} href={`/trips/${trip.id}`}>
            <Card hover className="h-full">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{trip.destination}</h3>
                  <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full capitalize">
                    {trip.travel_style}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FiCalendar />
                    <span>{trip.travel_days} days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiDollarSign />
                    <span>
                      Budget: ${trip.budget.toLocaleString()} | Est: $
                      {trip.total_estimated_cost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiClock />
                    <span>Created {format(new Date(trip.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {trip.interests.slice(0, 3).map((interest) => (
                    <span
                      key={interest}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {interest}
                    </span>
                  ))}
                  {trip.interests.length > 3 && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      +{trip.interests.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredTrips.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500">No trips found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
