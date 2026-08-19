import BookEvent from "@/app/components/BookEvent";
import EventCard from "@/app/components/EventCard";
import { getSimilarEventsBySlug } from "@/lib/actions/event.action";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";



const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex flex-row items-center gap-2">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems?.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags?.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

const EvenntDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {

    'use cache'
    cacheLife('hours');
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);

  if (!request.ok) return notFound();

  const {
    event: {
      _id,
      description,
      image,
      overview,
      date,
      time,
      location,
      mode,
      agenda,
      audience,
      tags,
      organizer,
    },
  } = await request.json();

  if (!description) return notFound();

  // Helper function to safely extract array data safely
  const parseArrayField = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) {
      // If the array contains a stringified JSON string inside index 0, parse it
      if (typeof field[0] === "string" && field[0].trim().startsWith("[")) {
        try {
          return JSON.parse(field[0]);
        } catch {
          return field;
        }
      }
      return field;
    }
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return [field];
      }
    }
    return [];
  };

  const parsedAgenda = parseArrayField(agenda);
  const parsedTags = parseArrayField(tags);
  const bookings = 10; // TODO: Replace with actual bookings count from API

  const rawSimilarEvents = await getSimilarEventsBySlug(slug);
const similarEvents = JSON.parse(JSON.stringify(rawSimilarEvents));

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/* left */}
        <div className="content">
          <Image
            className="banner"
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
          />

          <section className="flex flex-col gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex flex-col gap-2">
            <h2>Event details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem
              icon="/icons/pin.svg"
              alt="location"
              label={location}
            />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>

          <EventAgenda agendaItems={parsedAgenda} />

          <section className="flex flex-col gap-2">
            <h2>About the organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={parsedTags} />
        </div>

        {/* right */}
        <aside className="booking">
          <div className="sigup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked thier spot!
              </p>
            ) : (
              <p className="text-sm">Be the first tto book your slot!</p>
            )}

            <BookEvent eventID={_id}  slug={slug} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents?.length > 0 &&
            similarEvents.map((similarEvent: any) => (
              <EventCard
                key={similarEvent._id || similarEvent.slug}
                {...similarEvent}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EvenntDetailsPage;
