import {createContext, useContext} from "react";
import useLocalStorage from "../hooks/useLocalStorage.jsx";

const EventContext = createContext(null);

export const EventProvider = ({children}) => {
    const [allEvents, setAllEvents] = useLocalStorage("events", []);

    const createEvent = (eventData) => {
        const newEvent = {
            ...eventData,
            id: Date.now(),
            participants: []
        };

        setAllEvents(prevEvents => [newEvent, ...prevEvents]);
    }

    const joinEvent = (eventId, userId) => {
        const targetEvent = allEvents.find((event) => event.id === eventId);
        const newEvent = targetEvent.participants.push(userId)

        setAllEvents(prevEvents => [...prevEvents, newEvent]);
    }

    const leaveEvent = (eventId, userId) => {
        const targetEvent = allEvents.find((event) => event.id === eventId);
        const newEvent = targetEvent.participants.remove(userId)

        setAllEvents(prevEvents => [...prevEvents, newEvent]);
    }

    const deleteEvent = (eventId) => {
        const targetEvent = allEvents.find((event) => event.id === eventId);
    }

    const value = {
        allEvents,
        createEvent,
        joinEvent,
        leaveEvent,
        deleteEvent
    }
};