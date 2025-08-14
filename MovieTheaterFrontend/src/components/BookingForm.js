import React, { useState } from 'react';
import { User, Mail, Phone, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingForm = ({ selectedSeat, onBookingComplete }) => {
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!customer.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!customer.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!customer.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!customer.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(customer.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    if (!selectedSeat) {
      toast.error('Please select a seat first');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual API call later
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingData = {
        seat: selectedSeat,
        customer,
        bookingTime: new Date().toISOString(),
        ticketId: `CMX${Date.now()}${selectedSeat.id}`
      };

      toast.success(`Seat ${selectedSeat.id} booked successfully!`);
      onBookingComplete(bookingData);
      
      // Reset form
      setCustomer({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      });

    } catch (error) {
      toast.error('Booking failed. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedSeat) {
    return (
      <div className="booking-form-container">
        <div className="no-seat-selected">
          <CreditCard className="no-seat-icon" />
          <h3>Select a Seat to Continue</h3>
          <p>Choose an available seat from the seating chart to start your booking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form-container">
      <div className="selected-seat-info">
        <h3>Selected Seat</h3>
        <div className="seat-details">
          <div className="seat-display">
            <span className="seat-id">{selectedSeat.id}</span>
            <span className="seat-category">{selectedSeat.category} Section</span>
          </div>
          <div className="seat-price">
            £{selectedSeat.price.toFixed(2)}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <h3>Customer Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              <User size={16} />
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={customer.firstName}
              onChange={handleInputChange}
              className={errors.firstName ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              <User size={16} />
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={customer.lastName}
              onChange={handleInputChange}
              className={errors.lastName ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <Mail size={16} />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={customer.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            <Phone size={16} />
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={customer.phone}
            onChange={handleInputChange}
            className={errors.phone ? 'error' : ''}
            placeholder="e.g., 1234567890"
            disabled={isLoading}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="booking-summary">
          <div className="summary-row">
            <span>Seat:</span>
            <span>{selectedSeat.id} ({selectedSeat.category})</span>
          </div>
          <div className="summary-row">
            <span>Movie:</span>
            <span>The Grand Adventure</span>
          </div>
          <div className="summary-row">
            <span>Show Time:</span>
            <span>7:30 PM</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>£{selectedSeat.price.toFixed(2)}</span>
          </div>
        </div>

        <button 
          type="submit" 
          className="book-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={16} />
              Book Seat - £{selectedSeat.price.toFixed(2)}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;