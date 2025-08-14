import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SeatMap from '../components/SeatMap';
import BookingForm from '../components/BookingForm';
import TicketDisplay from '../components/TicketDisplay';
import { Film, Clock, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Booking = () => {
  const location = useLocation();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeats, setBookedSeats] = useState(['A5', 'B3', 'C10', 'D15', 'E8']); // Mock data
  const [completedBooking, setCompletedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Movie information (in real app, this would come from backend)
  const movieInfo = {
    title: "The Grand Adventure",
    duration: "2h 15m",
    genre: "Action, Adventure",
    rating: "PG-13",
    showTime: location.state?.selectedTime || "7:30 PM",
    date: new Date().toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    theater: "Screen 1 - CinemaMax"
  };

  useEffect(() => {
    // Load existing bookings from backend
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/bookings');
      // const bookings = await response.json();
      // setBookedSeats(bookings.map(b => b.seatId));
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error('Failed to load seat availability');
      console.error('Load bookings error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeatSelect = (seat) => {
    setSelectedSeat(seat);
    if (completedBooking) {
      setCompletedBooking(null);
    }
  };

  const handleBookingComplete = (bookingData) => {
    // Add the new booking to booked seats
    setBookedSeats(prev => [...prev, bookingData.seat.id]);
    setSelectedSeat(null);
    setCompletedBooking(bookingData);
    
    // Scroll to ticket display
    setTimeout(() => {
      const ticketElement = document.getElementById('ticket-display');
      if (ticketElement) {
        ticketElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="booking-page">
      {/* Movie Information Header */}
      <section className="movie-header">
        <div className="container">
          <div className="movie-info-header">
            <div className="movie-details">
              <div className="movie-title">
                <Film className="movie-icon" />
                <h1>{movieInfo.title}</h1>
              </div>
              <div className="movie-meta">
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{movieInfo.duration}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{movieInfo.date}</span>
                </div>
                <div className="meta-item">
                  <span className="show-time">{movieInfo.showTime}</span>
                </div>
                <div className="meta-item">
                  <MapPin size={16} />
                  <span>{movieInfo.theater}</span>
                </div>
              </div>
            </div>
            <div className="booking-steps">
              <div className={`step ${selectedSeat ? 'completed' : 'active'}`}>
                <span className="step-number">1</span>
                <span>Select Seat</span>
              </div>
              <div className={`step ${selectedSeat ? 'active' : ''} ${completedBooking ? 'completed' : ''}`}>
                <span className="step-number">2</span>
                <span>Book Ticket</span>
              </div>
              <div className={`step ${completedBooking ? 'active' : ''}`}>
                <span className="step-number">3</span>
                <span>Get Ticket</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Booking Content */}
      <section className="booking-content">
        <div className="container">
          <div className="booking-grid">
            {/* Seat Selection */}
            <div className="seat-selection">
              <div className="section-header">
                <h2>Select Your Seat</h2>
                <p>Choose from our comfortable seating options</p>
              </div>
              
              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner large"></div>
                  <p>Loading seat availability...</p>
                </div>
              ) : (
                <SeatMap 
                  onSeatSelect={handleSeatSelect}
                  selectedSeat={selectedSeat}
                  bookedSeats={bookedSeats}
                />
              )}
            </div>

            {/* Booking Form */}
            <div className="booking-form-section">
              <div className="section-header">
                <h2>Booking Information</h2>
                <p>Complete your ticket purchase</p>
              </div>
              
              <BookingForm 
                selectedSeat={selectedSeat}
                onBookingComplete={handleBookingComplete}
                movieInfo={movieInfo}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Display */}
      {completedBooking && (
        <section id="ticket-display" className="ticket-section">
          <div className="container">
            <div className="section-header centered">
              <h2>🎊 Booking Confirmed!</h2>
              <p>Your ticket has been successfully booked. Here are your details:</p>
            </div>
            
            <TicketDisplay 
              booking={completedBooking}
              movieInfo={movieInfo}
            />
          </div>
        </section>
      )}

      {/* Booking Tips */}
      <section className="booking-tips">
        <div className="container">
          <div className="tips-grid">
            <div className="tip-card">
              <h3>🎯 Best Seats</h3>
              <p>Premium section (rows C-F) offers the optimal viewing experience with perfect screen distance and angle.</p>
            </div>
            <div className="tip-card">
              <h3>⏰ Arrive Early</h3>
              <p>Please arrive 15 minutes before showtime. Latecomers may not be admitted during the first 20 minutes.</p>
            </div>
            <div className="tip-card">
              <h3>🎫 Mobile Tickets</h3>
              <p>Show your confirmation email or screenshot at the entrance. No need to print physical tickets.</p>
            </div>
            <div className="tip-card">
              <h3>🍿 Concessions</h3>
              <p>Enjoy our premium snacks and beverages available at the concession stand in the lobby.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;