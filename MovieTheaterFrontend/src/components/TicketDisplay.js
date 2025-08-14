import React from 'react';
import { Download, Mail, Share, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

const TicketDisplay = ({ booking, movieInfo }) => {
  const handleDownload = () => {
    toast.success('Ticket downloaded to your device');
    // TODO: Implement actual PDF generation
  };

  const handleEmailTicket = () => {
    toast.success('Ticket sent to your email address');
    // TODO: Implement email sending
  };

  const handleShareTicket = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Movie Ticket - ${movieInfo.title}`,
          text: `I'm watching ${movieInfo.title} at ${movieInfo.showTime}! Seat ${booking.seat.id}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `Movie Ticket - ${movieInfo.title} at ${movieInfo.showTime}, Seat ${booking.seat.id}`
      );
      toast.success('Ticket details copied to clipboard');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="ticket-display-container">
      <div className="digital-ticket">
        {/* Ticket Header */}
        <div className="ticket-header">
          <div className="cinema-logo">
            <h2>🎬 CinemaMax</h2>
            <p>Premium Cinema Experience</p>
          </div>
          <div className="ticket-id">
            <span className="id-label">Ticket ID</span>
            <span className="id-value">{booking.ticketId}</span>
          </div>
        </div>

        {/* Main Ticket Content */}
        <div className="ticket-content">
          <div className="ticket-left">
            <div className="movie-info">
              <h3 className="movie-title">{movieInfo.title}</h3>
              <div className="movie-details">
                <div className="detail-row">
                  <span className="label">Genre:</span>
                  <span className="value">{movieInfo.genre}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Rating:</span>
                  <span className="value">{movieInfo.rating}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Duration:</span>
                  <span className="value">{movieInfo.duration}</span>
                </div>
              </div>
            </div>

            <div className="screening-info">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Date</span>
                  <span className="info-value">{movieInfo.date}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Time</span>
                  <span className="info-value">{movieInfo.showTime}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Theater</span>
                  <span className="info-value">{movieInfo.theater}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Seat</span>
                  <span className="info-value highlight">{booking.seat.id}</span>
                </div>
              </div>
            </div>

            <div className="customer-info">
              <h4>Ticket Holder</h4>
              <p className="customer-name">
                {booking.customer.firstName} {booking.customer.lastName}
              </p>
              <p className="customer-contact">{booking.customer.email}</p>
            </div>
          </div>

          <div className="ticket-right">
            <div className="qr-section">
              <div className="qr-code">
                <QrCode size={120} />
                <p>Scan at entrance</p>
              </div>
            </div>

            <div className="price-section">
              <div className="price-details">
                <div className="price-row">
                  <span>Seat {booking.seat.id} ({booking.seat.category})</span>
                  <span>£{booking.seat.price.toFixed(2)}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>£{booking.seat.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="booking-details">
              <div className="booking-time">
                <span className="label">Booked</span>
                <span className="value">
                  {formatDate(booking.bookingTime)} at {formatTime(booking.bookingTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Footer */}
        <div className="ticket-footer">
          <div className="important-info">
            <h4>Important Information</h4>
            <ul>
              <li>Please arrive 15 minutes before showtime</li>
              <li>Present this ticket (digital or printed) at entrance</li>
              <li>Latecomers may not be admitted during first 20 minutes</li>
              <li>No outside food or beverages allowed</li>
              <li>Mobile phones must be switched to silent mode</li>
            </ul>
          </div>
        </div>

        {/* Perforated edge effect */}
        <div className="ticket-perforation"></div>
      </div>

      {/* Action Buttons */}
      <div className="ticket-actions">
        <button 
          className="action-button primary"
          onClick={handleDownload}
        >
          <Download size={20} />
          Download PDF
        </button>
        
        <button 
          className="action-button secondary"
          onClick={handleEmailTicket}
        >
          <Mail size={20} />
          Email Ticket
        </button>
        
        <button 
          className="action-button secondary"
          onClick={handleShareTicket}
        >
          <Share size={20} />
          Share Ticket
        </button>
      </div>

      {/* Additional Ticket Info */}
      <div className="additional-info">
        <div className="info-card">
          <h4>🎭 Theater Policies</h4>
          <ul>
            <li>Tickets are non-refundable once the movie has started</li>
            <li>Exchanges allowed up to 2 hours before showtime</li>
            <li>Children under 12 must be accompanied by an adult for PG-13 films</li>
            <li>Outside food and beverages are not permitted</li>
          </ul>
        </div>

        <div className="info-card">
          <h4>🍿 Concessions Available</h4>
          <ul>
            <li>Premium popcorn with various flavors</li>
            <li>Craft sodas and specialty beverages</li>
            <li>Artisan candy and chocolate selection</li>
            <li>Hot nachos with cheese and jalapeños</li>
          </ul>
        </div>

        <div className="info-card">
          <h4>🚗 Parking Information</h4>
          <ul>
            <li>Free parking available in cinema lot</li>
            <li>Covered parking spaces near main entrance</li>
            <li>Electric vehicle charging stations available</li>
            <li>Accessible parking spaces clearly marked</li>
          </ul>
        </div>
      </div>

      {/* Booking Confirmation */}
      <div className="confirmation-message">
        <div className="success-icon">✅</div>
        <h3>Booking Confirmed!</h3>
        <p>
          A confirmation email has been sent to <strong>{booking.customer.email}</strong>
        </p>
        <p className="reference-number">
          Reference Number: <span className="highlight">{booking.ticketId}</span>
        </p>
      </div>
    </div>
  );
};

export default TicketDisplay;