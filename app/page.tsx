
import ExploreBtn from './components/ExploreBtn'
import EventCard from './components/EventCard'
import Event, { IEvent } from '@/database/event.model'
import { cacheLife } from 'next/cache'
import connectDB from '@/lib/mongodb'


const page = async () => {
  "use cache";
  cacheLife('hours')
  await connectDB();
  const rawEvents = await Event.find().sort({ createdAt: -1 }).lean();
  const events = JSON.parse(JSON.stringify(rawEvents));
  return (
    <section>
      <h1 className='text-center'>The hub for every dev <br /> Event you cant miss</h1>
      <p className='text-center mt-5'>hackaton , meetups , and conferences all in one place</p>
    <ExploreBtn/>

    <div className="mtt-20 space-y-7">
      <h3>Featured Events</h3>
      <ul className="events">
        { events && events.length > 0 &&  events.map((event: IEvent) => (
          <li key={event.title} className='list-none'>
            <EventCard  {...event}/>
          </li>
        ))}
      </ul>
    </div>

    </section>
    
  )
}

export default page