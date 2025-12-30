import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaUserFriends, FaTrash } from "react-icons/fa";

import { useAuth } from "../context/AuthContext.jsx";
import { useEvents } from "../context/EventContext.jsx";
import { formatDate } from "../utils/date.js";

import "./EventCard.scss";

const EventCard = ({ event }) => {
    const { currentUser, allUsers } = useAuth();
    const { joinEvent, leaveEvent, deleteEvent } = useEvents();

    const organizer = useMemo(() => {
        return allUsers.find(u => u.id === Number(event.organizer));
    }, [allUsers, event.organizer]);

    const isParticipant = currentUser && event.participants.includes(currentUser.id);
    const isOrganizer = currentUser && currentUser.id === Number(event.organizer);

    const isPast = new Date(event.date) < new Date();

    const handleJoin = () => {
        if (!currentUser) return;
        joinEvent(event.id, currentUser.id);
    };

    const handleLeave = () => {
        if (!currentUser) return;
        leaveEvent(event.id, currentUser.id);
    };

    const handleDelete = () => {
        deleteEvent(event.id);
    };

    return (
        <div className={`event-card ${isPast ? "past-event" : ""}`}>
            <div className="event-date-badge">
                <FaCalendarAlt />
                <span>{formatDate(event.date)}</span>
            </div>

            <div className="event-content">
                <h3 className="event-title">{event.title}</h3>

                <div className="event-location">
                    <FaMapMarkerAlt />
                    <span>{event.location}</span>
                </div>

                <p className="event-description">{event.description}</p>

                {organizer && (
                    <div className="event-organizer">
                        <span className="label">Organized by:</span>
                        <Link to={`/profile/${organizer.id}`} className="organizer-link">
                            <img src={organizer.avatar} alt="org" />
                            <span>{organizer.name} {organizer.surname}</span>
                        </Link>
                    </div>
                )}
            </div>

            <div className="event-footer">
                <div className="participants-count">
                    <FaUserFriends />
                    <span>{event.participants.length} going</span>
                </div>

                <div className="event-actions">
                    {(isOrganizer || currentUser?.role === 'admin') && (
                        <button className="delete-btn" onClick={handleDelete} title="Delete Event">
                            <FaTrash />
                        </button>
                    )}

                    {isPast ? (
                        <button className="btn disabled" disabled>Ended</button>
                    ) : isParticipant ? (
                        <button className="btn leave-btn" onClick={handleLeave}>Leave</button>
                    ) : (
                        <button className="btn join-btn" onClick={handleJoin}>Join</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;