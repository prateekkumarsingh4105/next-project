'use server';

import Booking from "@/database/booking.model";
import connectDB from "../mongodb";

export const createBooking = async ({
  eventID,
  slug,
  email,
}: {
  eventID: string;
  slug: string;
  email: string;
}) => {
  try {
    await connectDB();

    // Make sure 'eventId' matches the exact key name in your database/booking.model.ts schema!
    await Booking.create({ eventId: eventID, eventID, slug, email });

    return { success: true };
  } catch (e: any) {
    console.error('Create booking failed:', e);

    // Pass the actual error message string back so response.error is defined
    return {
      success: false,
      error: e?.message || e?.toString() || 'Failed to create booking',
    };
  }
};