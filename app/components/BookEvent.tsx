"use client";

import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import { useState } from "react";

const BookEvent = ({ eventID, slug }: { eventID: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    try {
      const response = await createBooking({ eventID, slug, email });

      if (response?.success) {
        setSubmitted(true);
        posthog.capture("event_booked", { eventID, slug, email });
      } else {
        console.error("Booking error:", response?.error);
        posthog.capture("event_booking_failed", {
          eventID,
          slug,
          email,
          error: response?.error,
        });
      }
    } catch (err) {
      console.error("Network or unexpected crash:", err);
      posthog.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank You for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="button-submit" disabled={loading}>
            {loading ? "Submitting..." : "SUBMIT"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;