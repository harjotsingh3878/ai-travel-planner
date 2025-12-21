'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { generateItinerary } from '@/lib/ai';
import { TripInput, Trip } from '@/types';
import { revalidatePath } from 'next/cache';

export async function createTrip(tripInput: TripInput) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Generate itinerary using OpenAI
    const { itinerary, total_estimated_cost } = await generateItinerary(tripInput);

    // Save to database
    const { data: trip, error } = await supabaseAdmin
      .from('trips')
      .insert([
        {
          user_id: session.user.id,
          destination: tripInput.destination,
          travel_days: tripInput.travel_days,
          budget: tripInput.budget,
          travel_style: tripInput.travel_style,
          interests: tripInput.interests,
          itinerary: itinerary,
          total_estimated_cost: total_estimated_cost,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    revalidatePath('/dashboard');
    revalidatePath('/trips');

    return { success: true, trip };
  } catch (error: any) {
    console.error('Create trip error:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserTrips() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const { data: trips, error } = await supabaseAdmin
      .from('trips')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, trips: trips as Trip[] };
  } catch (error: any) {
    console.error('Get trips error:', error);
    return { success: false, error: error.message, trips: [] };
  }
}

export async function getTripById(tripId: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const { data: trip, error } = await supabaseAdmin
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, trip: trip as Trip };
  } catch (error: any) {
    console.error('Get trip error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteTrip(tripId: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabaseAdmin
      .from('trips')
      .delete()
      .eq('id', tripId)
      .eq('user_id', session.user.id);

    if (error) {
      throw error;
    }

    revalidatePath('/dashboard');
    revalidatePath('/trips');

    return { success: true };
  } catch (error: any) {
    console.error('Delete trip error:', error);
    return { success: false, error: error.message };
  }
}

export async function regenerateTrip(tripId: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Get existing trip
    const { data: existingTrip, error: fetchError } = await supabaseAdmin
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .eq('user_id', session.user.id)
      .single();

    if (fetchError || !existingTrip) {
      throw new Error('Trip not found');
    }

    // Generate new itinerary
    const tripInput: TripInput = {
      destination: existingTrip.destination,
      travel_days: existingTrip.travel_days,
      budget: existingTrip.budget,
      travel_style: existingTrip.travel_style,
      interests: existingTrip.interests,
    };

    const { itinerary, total_estimated_cost } = await generateItinerary(tripInput);

    // Update trip
    const { data: updatedTrip, error: updateError } = await supabaseAdmin
      .from('trips')
      .update({
        itinerary: itinerary,
        total_estimated_cost: total_estimated_cost,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tripId)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    revalidatePath('/trips/[id]', 'page');

    return { success: true, trip: updatedTrip };
  } catch (error: any) {
    console.error('Regenerate trip error:', error);
    return { success: false, error: error.message };
  }
}

export async function getDashboardStats() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const { data: trips, error } = await supabaseAdmin
      .from('trips')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) {
      throw error;
    }

    // Calculate statistics
    const totalTrips = trips.length;
    const totalBudget = trips.reduce((sum, trip) => sum + Number(trip.budget), 0);
    const totalEstimatedCost = trips.reduce((sum, trip) => sum + Number(trip.total_estimated_cost), 0);

    // Group by destination
    const tripsByDestination = trips.reduce((acc, trip) => {
      const existing = acc.find((item: { destination: string; count: number }) => item.destination === trip.destination);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ destination: trip.destination, count: 1 });
      }
      return acc;
    }, [] as { destination: string; count: number }[]);

    // Group by travel style
    const tripsByStyle = trips.reduce((acc, trip) => {
      const existing = acc.find((item: { style: string; count: number }) => item.style === trip.travel_style);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ style: trip.travel_style, count: 1 });
      }
      return acc;
    }, [] as { style: string; count: number }[]);

    // Group by month
    const tripsByMonth = trips.reduce((acc, trip) => {
      const date = new Date(trip.created_at);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const existing = acc.find((item: { month: string; count: number; budget: number }) => item.month === month);
      if (existing) {
        existing.count++;
        existing.budget += Number(trip.budget);
      } else {
        acc.push({ month, count: 1, budget: Number(trip.budget) });
      }
      return acc;
    }, [] as { month: string; count: number; budget: number }[]);

    return {
      success: true,
      stats: {
        total_trips: totalTrips,
        total_budget: totalBudget,
        total_estimated_cost: totalEstimatedCost,
        trips_by_destination: tripsByDestination,
        trips_by_style: tripsByStyle,
        trips_timeline: tripsByMonth,
      },
    };
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    return { success: false, error: error.message };
  }
}
