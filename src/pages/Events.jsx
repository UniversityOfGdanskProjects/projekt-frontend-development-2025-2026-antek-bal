import { useMemo } from "react";
import CreateEventForm from "../components/EventForm.jsx";
import EventCard from "../components/EventCard.jsx";

import { useEvents } from "../context/EventContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import "./Events.scss";

const Events = () => {
    const { allEvents } = useEvents();
    const { currentUser } = useAuth();

    const { upcomingEvents, pastEvents } = useMemo(() => {
        const now = new Date();

        const eventsCopy = [...allEvents];

        const upcoming = eventsCopy
            .filter(e => new Date(e.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const past = eventsCopy
            .filter(e => new Date(e.date) < now)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        return { upcomingEvents: upcoming, pastEvents: past };
    }, [allEvents]);

    return (
        <div className="events-page">
            <h1>Events</h1>

            {currentUser && <CreateEventForm />}

            <div className="events-section">
                <h2>Upcoming Events</h2>
                <div className="events-grid">
                    {upcomingEvents.length > 0 ? (
                        upcomingEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <p className="empty-message">No upcoming events found.</p>
                    )}
                </div>
            </div>

            <div className="events-section history-section">
                <h2>Event History</h2>
                <div className="events-grid">
                    {pastEvents.length > 0 ? (
                        pastEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <p className="empty-message">No past events.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Events;