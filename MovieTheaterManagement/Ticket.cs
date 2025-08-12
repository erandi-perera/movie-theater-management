using System;
using System.IO;

namespace MovieTheaterManagement
{
    public class Ticket
    {
        public char Row { get; set; }
        public int SeatNumber { get; set; }
        public double Price { get; set; }
        public Customer Customer { get; set; }
        public string MovieTitle { get; set; }
        public string ShowTime { get; set; }
        public DateTime BookingDate { get; set; }
        public string TicketId { get; set; }

        public Ticket(char row, int seatNumber, double price, Customer customer, string movieTitle, string showTime)
        {
            Row = row;
            SeatNumber = seatNumber;
            Price = price;
            Customer = customer;
            MovieTitle = movieTitle;
            ShowTime = showTime;
            BookingDate = DateTime.Now;
            TicketId = GenerateTicketId();
        }

        private string GenerateTicketId()
        {
            // Generate a unique ticket ID based on date, seat, and random number
            Random random = new Random();
            string dateStr = DateTime.Now.ToString("yyyyMMdd");
            string seatStr = $"{Row}{SeatNumber:D2}";
            int randomNum = random.Next(100, 999);
            return $"CMX{dateStr}{seatStr}{randomNum}";
        }

        public string GetSeatLocation()
        {
            return $"{Row}{SeatNumber}";
        }

        public string GetSeatCategory()
        {
            int rowIndex = Row - 'A';
            if (rowIndex <= 1)
                return "Front Section";
            else if (rowIndex >= 2 && rowIndex <= 5)
                return "Premium Section";
            else
                return "Back Section";
        }

        public void PrintTicketInfo()
        {
            Console.WriteLine("═══════════════════════════════════════");
            Console.WriteLine($"{MovieTitle.ToUpper()}");
            Console.WriteLine($"Show Time: {ShowTime}");
            Console.WriteLine($"Seat: {GetSeatLocation()} ({GetSeatCategory()})");
            Console.WriteLine($"Price: £{Price:F2}");
            Console.WriteLine($"Ticket ID: {TicketId}");
            Console.WriteLine($"Booked: {BookingDate:dd/MM/yyyy HH:mm}");
            Console.WriteLine();
            Customer.PrintCustomerInfo();
            Console.WriteLine("═══════════════════════════════════════");
            Console.WriteLine();
        }

        public void Save()
        {
            try
            {
                // Create tickets directory if it doesn't exist
                string ticketsDir = "Tickets";
                if (!Directory.Exists(ticketsDir))
                {
                    Directory.CreateDirectory(ticketsDir);
                }

                string fileName = Path.Combine(ticketsDir, $"Ticket_{TicketId}.txt");

                using (StreamWriter writer = new StreamWriter(fileName))
                {
                    writer.WriteLine("═══════════ CINEMAMAX THEATER ═══════════");
                    writer.WriteLine("                TICKET RECEIPT                ");
                    writer.WriteLine("═══════════════════════════════════════════");
                    writer.WriteLine();
                    writer.WriteLine($"  TICKET ID: {TicketId}");
                    writer.WriteLine($" BOOKING DATE: {BookingDate:dd/MM/yyyy HH:mm}");
                    writer.WriteLine();
                    writer.WriteLine(" MOVIE INFORMATION:");
                    writer.WriteLine($"   Title: {MovieTitle}");
                    writer.WriteLine($"   Show Time: {ShowTime}");
                    writer.WriteLine();
                    writer.WriteLine(" SEAT INFORMATION:");
                    writer.WriteLine($"   Seat: {GetSeatLocation()}");
                    writer.WriteLine($"   Section: {GetSeatCategory()}");
                    writer.WriteLine($"   Price: £{Price:F2}");
                    writer.WriteLine();
                    writer.WriteLine(" CUSTOMER INFORMATION:");
                    writer.WriteLine($"   Name: {Customer.FullName}");
                    writer.WriteLine($"   Email: {Customer.Email}");
                    writer.WriteLine($"   Phone: {Customer.FormattedPhone()}");
                    writer.WriteLine();
                    writer.WriteLine("═══════════════════════════════════════════");
                    writer.WriteLine("        Thank you for choosing CinemaMax!      ");
                    writer.WriteLine("           Please arrive 15 minutes early     ");
                    writer.WriteLine("═══════════════════════════════════════════");
                }

                Console.WriteLine($" Ticket receipt saved as: {fileName}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"  Error saving ticket: {ex.Message}");
            }
        }

        public void PrintMiniTicket()
        {
            Console.WriteLine($" {GetSeatLocation()} | {MovieTitle} | {ShowTime} | £{Price:F2}");
        }

        public override string ToString()
        {
            return $"Ticket {TicketId}: {GetSeatLocation()}, {MovieTitle}, £{Price:F2}, {Customer.FullName}";
        }
    }
}
