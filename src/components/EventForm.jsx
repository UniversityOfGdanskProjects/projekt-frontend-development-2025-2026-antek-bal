import { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

import { useAuth } from "../context/AuthContext.jsx";
import { useEvents } from "../context/EventContext.jsx";

import "./EventForm.scss";

const EventForm = () => {
    const { currentUser } = useAuth();
    const { createEvent } = useEvents();

    const [formData, setFormData] = useState({
        title: "",
        location: "",
        date: "",
        description: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.date || !formData.location || !formData.description) return;

        createEvent({
            ...formData,
            organizer: currentUser.id
        });

        setFormData({
            title: "",
            location: "",
            date: "",
            description: ""
        });
    };

    const isValid = formData.title && formData.date && formData.location && formData.description;

    return (
        <div className="create-event-card">
            <div className="form-header">
                <img src={currentUser.avatar} alt="me" className="avatar" />
                <div className="form-content">
                    <h3>Organize an Event</h3>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Event Title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-title"
                        />

                        <div className="row">
                            <div className="input-group">
                                <FaCalendarAlt className="icon"/>
                                <input
                                    type="datetime-local"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="input-date"
                                />
                            </div>

                            <div className="input-group">
                                <FaMapMarkerAlt className="icon"/>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <textarea
                            name="description"
                            placeholder="What are the details?"
                            value={formData.description}
                            onChange={handleChange}
                        />

                        <div className="form-actions">
                            <button type="submit" disabled={!isValid}>
                                Create Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EventForm;