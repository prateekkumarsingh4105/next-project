
import React from 'react'
import ExploreBtn from './components/ExploreBtn'
import EventCard from './components/EventCard'
import events from '@/lib/constants'


const page = () => {
  return (
    <section>
      <h1 className='text-center'>The hub for every dev <br /> Event you cant miss</h1>
      <p className='text-center mt-5'>hackaton , meetups , and conferences all in one place</p>
    <ExploreBtn/>

    <div className="mtt-20 space-y-7">
      <h3>Featured Events</h3>
      <ul className="events">
        {events.map((event) => (
          <li key={event.title}>
            <EventCard  {...event}/>
          </li>
        ))}
      </ul>
    </div>

    </section>
    
  )
}

export default page