import {createContext, useContext} from "react";
import useLocalStorage from "../hooks/useLocalStorage.jsx";
import { events as initialEvents } from "../data/mockData.js";

const EventContext = createContext(null);

export const EventProvider = ({children}) => {
    const [allEvents, setAllEvents] = useLocalStorage("events", initialEvents);

    const createEvent = (eventData) => {
        const newEvent = {
            ...eventData,
            id: Date.now(),
            participants: []
        };

        setAllEvents(prevEvents => [newEvent, ...prevEvents]);
    }

    const joinEvent = (eventId, userId) => {
        setAllEvents(prevEvents => prevEvents.map(event => {
            if (event.id === eventId) {
                if (event.participants.includes(userId)) return event;

                return {
                    ...event,
                    participants: [...event.participants, userId]
                };
            }
            return event;
        }));
    }

    const leaveEvent = (eventId, userId) => {
        setAllEvents(prevEvents => prevEvents.map(event => {
            if (event.id === eventId) {
                if (!event.participants.includes(userId)) return event;

                return {
                    ...event,
                    participants: event.participants.filter(id => id !== userId)
                };
            }
            return event;
        }));
    }

    const deleteEvent = (eventId) => {
        setAllEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    }

    const value = {
        allEvents,
        createEvent,
        joinEvent,
        leaveEvent,
        deleteEvent
    }

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => useContext(EventContext);