'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTrip } from '@/actions/tripActions';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { TripInput } from '@/types';

const TRAVEL_STYLES = ['budget', 'moderate', 'luxury'] as const;
const INTEREST_OPTIONS = [
  'Culture & History',
  'Food & Dining',
  'Adventure & Sports',
  'Nature & Wildlife',
  'Art & Museums',
  'Shopping',
  'Nightlife',
  'Beaches',
  'Photography',
  'Local Experience',
];

export default function CreateTripPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<TripInput>({
    destination: '',
    travel_days: 3,
    budget: 1000,
    travel_style: 'moderate',
    interests: [],
  });

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    setIsLoading(true);

    try {
      const result = await createTrip(formData);
      
      if (result.success && result.trip) {
        router.push(`/trips/${result.trip.id}`);
        router.refresh();
      } else {
        setError(result.error || 'Failed to create trip');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Trip</h1>
        <p className="text-gray-600 mt-1">Let AI plan your perfect itinerary</p>
      </div>

      <Card>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination */}
          <div>
            <Input
              label="Destination"
              type="text"
              placeholder="e.g., Paris, France"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              required
            />
          </div>

          {/* Travel Days */}
          <div>
            <Input
              label="Number of Days"
              type="number"
              min="1"
              max="30"
              value={formData.travel_days}
              onChange={(e) =>
                setFormData({ ...formData, travel_days: parseInt(e.target.value) || 0 })
              }
              required
            />
          </div>

          {/* Budget */}
          <div>
            <Input
              label="Budget (USD)"
              type="number"
              min="100"
              step="100"
              value={formData.budget}
              onChange={(e) =>
                setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })
              }
              required
            />
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Style
            </label>
            <div className="grid grid-cols-3 gap-4">
              {TRAVEL_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setFormData({ ...formData, travel_style: style })}
                  className={`p-4 border-2 rounded-lg capitalize transition-colors ${
                    formData.travel_style === style
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests (Select at least one)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 border-2 rounded-lg text-sm transition-colors ${
                    formData.interests.includes(interest)
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              {isLoading ? 'Generating Your Itinerary...' : 'Generate Trip Plan'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
