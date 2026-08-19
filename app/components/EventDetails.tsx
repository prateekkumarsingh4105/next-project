import { notFound } from "next/navigation";
import { IEvent } from "@/database";
import Image from "next/image";
import BookEvent from "@/app/components/BookEvent";
import EventCard from "@/app/components/EventCard";

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
  <div className="flex items-center gap-2">
    <Image src={icon} alt={alt} width={20} height={20} />
    <span>{label}</span>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <section className="flex-col-gap-2">
    <h2>Agenda</h2>
    <ul>
      {agendaItems?.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  </section>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <section className="flex flex-wrap gap-2">
    {tags?.map((tag) => (
      <span key={tag} className="rounded-full border px-3 py-1 text-sm">
        {tag}
      </span>
    ))}
  </section>
);

const EventDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
  }

  let event;

  try {
    const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
      cache: "no-store",
    });

    if (!request.ok) {
      if (request.status === 404) {
        notFound();
      }

      throw new Error(
        `Failed to fetch event: ${request.status} ${request.statusText}`
      );
    }

    const response = await request.json();
    event = response.event;

    if (!event) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    notFound();
  }

  const {
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
  } = event;

  if (!description) {
    notFound();
  }

  const bookings = 10;

  const similarEvents: IEvent[] = event.similarEvents ?? [];

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />

            <EventDetailItem
              icon="/icons/clock.svg"
              alt="clock"
              label={time}
            />

            <EventDetailItem
              icon="/icons/pin.svg"
              alt="pin"
              label={location}
            />

            <EventDetailItem
              icon="/icons/mode.svg"
              alt="mode"
              label={mode}
            />

            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>

            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">
                Be the first to book your spot!
              </p>
            )}

            <BookEvent
              eventID={event._id}
              slug={event.slug}
            />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>

        <div className="events">
          {similarEvents.map((similarEvent: IEvent) => (
            <EventCard
              key={similarEvent.title}
              {...similarEvent}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetails;