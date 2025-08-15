import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Star, Users, Ticket } from 'lucide-react';

const Home = () => {
  const currentMovie = {
    title: "The Grand Adventure",
    duration: "2h 15m",
    genre: "Action, Adventure",
    rating: "PG-13",
    showTimes: ["2:00 PM", "5:30 PM", "7:30 PM", "10:00 PM"],
    poster: "/api/placeholder/300/400",
    description: "Join our heroes on an epic journey through uncharted territories filled with mystery, danger, and incredible discoveries that will change everything they thought they knew about the world."
  };

  const theaterFeatures = [
    {
      icon: <Star className="feature-icon" />,
      title: "Premium Experience",
      description: "State-of-the-art sound system and crystal-clear 4K projection"
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Comfortable Seating",
      description: "Luxurious reclining seats with premium leather upholstery"
    },
    {
      icon: <Ticket className="feature-icon" />,
      title: "Easy Booking",
      description: "Select your perfect seat with our interactive seating chart"
    }
  ];

  const pricingTiers = [
    { section: "Front", rows: "A-B", price: "£8.00", description: "Budget-friendly viewing" },
    { section: "Premium", rows: "C-F", price: "£12.00", description: "Optimal viewing experience" },
    { section: "Back", rows: "G-H", price: "£10.00", description: "Great overview perspective" }
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to CinemaMax</h1>
            <p className="hero-subtitle">
              Experience cinema like never before with our premium theater and cutting-edge technology
            </p>
            <Link to="/booking" className="cta-button">
              Book Your Tickets Now
            </Link>
          </div>
          <div className="hero-image">
            <div className="movie-poster">
              <img src="/api/placeholder/300/400" alt="Movie Poster" />
            </div>
          </div>
        </div>
      </section>

      <section className="now-showing">
        <div className="container">
          <h2>Now Showing</h2>
          <div className="movie-card">
            <div className="movie-info">
              <h3>{currentMovie.title}</h3>
              <div className="movie-meta">
                <span className="duration">
                  <Clock size={16} />
                  {currentMovie.duration}
                </span>
                <span className="genre">{currentMovie.genre}</span>
                <span className="rating">{currentMovie.rating}</span>
              </div>
              <p className="movie-description">{currentMovie.description}</p>
              
              <div className="showtimes">
                <h4>Show Times Today</h4>
                <div className="time-slots">
                  {currentMovie.showTimes.map((time, index) => (
                    <Link 
                      key={index} 
                      to="/booking" 
                      className="time-slot"
                      state={{ selectedTime: time }}
                    >
                      {time}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>Why Choose CinemaMax?</h2>
          <div className="features-grid">
            {theaterFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                {feature.icon}
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <div className="container">
          <h2>Ticket Pricing</h2>
          <div className="pricing-grid">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="pricing-card">
                <h3>{tier.section} Section</h3>
                <div className="price">{tier.price}</div>
                <div className="rows">Rows {tier.rows}</div>
                <p>{tier.description}</p>
              </div>
            ))}
          </div>
          <p className="pricing-note">
            <MapPin size={16} />
            All prices include premium amenities and reserved seating
          </p>
        </div>
      </section>

      <section className="theater-info">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <h3>Theater Information</h3>
              <ul>
                <li><strong>Capacity:</strong> 116 seats across 8 rows</li>
                <li><strong>Screen:</strong> 4K Ultra HD with Dolby Atmos</li>
                <li><strong>Seating:</strong> Luxury reclining chairs</li>
                <li><strong>Accessibility:</strong> Wheelchair accessible</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h3>Booking Information</h3>
              <ul>
                <li><strong>Online Booking:</strong> Available 24/7</li>
                <li><strong>Advance Booking:</strong> Up to 7 days ahead</li>
                <li><strong>Cancellation:</strong> Free up to 2 hours before show</li>
                <li><strong>Group Discounts:</strong> Available for 10+ tickets</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience the Magic?</h2>
            <p>Book your seats now and enjoy the ultimate cinema experience</p>
            <Link to="/booking" className="cta-button large">
              <Calendar size={20} />
              Start Booking
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;