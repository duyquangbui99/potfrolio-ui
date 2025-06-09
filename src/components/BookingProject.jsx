import React from 'react';
import bookingDashboard from '../assets/images/booking-dashboard.png';
import githubIcon from '../assets/images/githubIcon.svg';
import webIcon from '../assets/images/web.svg';
import '../styles/bookingProject.css';

function BookingProject() {
    return (
        <section className="booking-project">
            <div className="project-content">
                <img
                    src={bookingDashboard}
                    alt="Booking Dashboard"
                    className="booking-image"
                />
                <div className="project-info">
                    <h3>Schedulo</h3>
                    <p>
                        Empowered salon managers with a centralized tool for appointments, staff coordination, and marketing—all in a single streamlined app.
                    </p>
                    <p>Used by 5 local businesses</p>
                    <p>Demo Account:</p>
                    <p>Username: justine</p>
                    <p>Password: 1021</p>
                    <div className='icon-container'>
                        <a
                            href="https://github.com/duyquangbui99/spa-dashboard-ui"
                            target="_blank"
                            rel="noreferrer"
                            className="github-link"
                        >
                            <img src={githubIcon} alt="GitHub Logo" className="github-icon" />
                        </a>
                        <a
                            href="https://spaproject-ui.vercel.app/"
                            target="_blank"
                            rel="noreferrer"
                            className="github-link"
                        >
                            <img src={webIcon} alt="Web Logo" className="github-icon" />
                        </a>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default BookingProject;
