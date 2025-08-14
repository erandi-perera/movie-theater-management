import React, { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';

const SeatMap = ({ onSeatSelect, selectedSeat, bookedSeats = [] }) => {
  const [seats, setSeats] = useState([]);
  
  // Theater configuration matching your C# backend
  const ROWS = 8;
  const SEATS_PER_ROW = [12, 14, 16, 18, 18, 16, 14, 12];
  const ROW_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  useEffect(() => {
    initializeSeats();
  }, [bookedSeats]);

  const initializeSeats = () => {
    const theaterSeats = [];
    
    for (let rowIndex = 0; rowIndex < ROWS; rowIndex++) {
      const rowSeats = [];
      const rowLetter = ROW_LETTERS[rowIndex];
      
      for (let seatNumber = 1; seatNumber <= SEATS_PER_ROW[rowIndex]; seatNumber++) {
        const seatId = `${rowLetter}${seatNumber}`;
        const isBooked = bookedSeats.includes(seatId);
        const price = getSeatPrice(rowIndex, seatNumber);
        
        rowSeats.push({
          id: seatId,
          row: rowLetter,
          number: seatNumber,
          rowIndex,
          isBooked,
          price,
          category: getSeatCategory(rowIndex)
        });
      }
      
      theaterSeats.push({
        letter: rowLetter,
        index: rowIndex,
        seats: rowSeats
      });
    }
    
    setSeats(theaterSeats);
  };

  const getSeatPrice = (rowIndex, seatNumber) => {
    // Front rows (A-B): £8.00
    if (rowIndex <= 1) return 8.00;
    
    // Premium rows (C-F): £12.00
    if (rowIndex >= 2 && rowIndex <= 5) return 12.00;
    
    // Back rows (G-H): £10.00
    return 10.00;
  };

  const getSeatCategory = (rowIndex) => {
    if (rowIndex <= 1) return 'Front';
    if (rowIndex >= 2 && rowIndex <= 5) return 'Premium';
    return 'Back';
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;
    
    const newSelectedSeat = selectedSeat?.id === seat.id ? null : seat;
    onSeatSelect(newSelectedSeat);
  };

  const getSeatClassName = (seat) => {
    let className = 'seat';
    
    if (seat.isBooked) {
      className += ' seat-booked';
    } else if (selectedSeat?.id === seat.id) {
      className += ' seat-selected';
    } else {
      className += ` seat-available seat-${seat.category.toLowerCase()}`;
    }
    
    return className;
  };

  return (
    <div className="theater-container">
      <div className="screen-container">
        <Monitor className="screen-icon" />
        <div className="screen">SCREEN</div>
      </div>
      
      <div className="seating-area">
        {seats.map((row) => {
          const padding = Math.abs(9 - row.seats.length) / 2;
          
          return (
            <div key={row.letter} className="seat-row">
              <div className="row-label">{row.letter}</div>
              <div 
                className="row-seats" 
                style={{ paddingLeft: `${padding * 10}px`, paddingRight: `${padding * 10}px` }}
              >
                {row.seats.map((seat, index) => (
                  <React.Fragment key={seat.id}>
                    {/* Add aisle gap in the middle */}
                    {index === Math.floor(row.seats.length / 2) && (
                      <div className="aisle"></div>
                    )}
                    <button
                      className={getSeatClassName(seat)}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.isBooked}
                      title={`${seat.id} - £${seat.price} (${seat.category})`}
                    >
                      {seat.number}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat seat-available seat-front"></div>
          <span>Front £8.00</span>
        </div>
        <div className="legend-item">
          <div className="seat seat-available seat-premium"></div>
          <span>Premium £12.00</span>
        </div>
        <div className="legend-item">
          <div className="seat seat-available seat-back"></div>
          <span>Back £10.00</span>
        </div>
        <div className="legend-item">
          <div className="seat seat-selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat seat-booked"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;