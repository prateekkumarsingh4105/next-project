import BookEvent from "@/app/components/BookEvent";
import EventCard from "@/app/components/EventCard";
import { getSimilarEventsBySlug } from "@/lib/actions/event.action";
import Image from "next/image";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

// Tells Next.js to render this page dynamically on demand
export const dynamic = "force-dynamic";

const EvenntDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  await connectDB();
  const rawEvent = await Event.findOne({ slug }).lean();

  if (!rawEvent) return notFound();

  const event = JSON.parse(JSON.stringify(rawEvent));

  const rawSimilarEvents = await getSimilarEventsBySlug(slug);
  const similarEvents = JSON.parse(JSON.stringify(rawSimilarEvents));

  return (
    <section id="event">
      <div className="header">
        <h1>{event.title}</h1>
        <p>{event.description}</p>
      </div>

      <div className="details">
        <div className="content">
          <Image
            className="banner"
            src={event.image}
            alt="Event Banner"
            width={800}
            height={800}
          />
          <section className="flex flex-col gap-2">
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            <BookEvent eventID={event._id} slug={event.slug} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents?.length > 0 &&
            similarEvents.map((simEvent: any) => (
              <EventCard key={simEvent._id || simEvent.slug} {...simEvent} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EvenntDetailsPage;