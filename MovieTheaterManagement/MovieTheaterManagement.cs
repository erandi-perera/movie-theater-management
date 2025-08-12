using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;

namespace MovieTheaterManagement
{
    class Program
    {
        private const int ROWS = 8; // Rows A through H (typical theater layout)
        private static readonly int[] SEATS_PER_ROW = { 12, 14, 16, 18, 18, 16, 14, 12 }; // Curved theater layout
        private static int[,] seats;
        private static List<Ticket> ticketsSold = new List<Ticket>();
        private static string currentMovie = "The Grand Adventure";
        private static string showTime = "7:30 PM";

        static void Main(string[] args)
        {
            Console.WriteLine(" Welcome to CinemaMax Theater Management System ");
            Console.WriteLine($"Now Showing: {currentMovie}");
            Console.WriteLine($"Show Time: {showTime}");
            Console.WriteLine();

            // Initialize seats array
            seats = new int[ROWS, 18]; // Max 18 seats per row

            int choice;
            do
            {
                ShowMenu();
                choice = GetValidChoice();

                switch (choice)
                {
                    case 1:
                        BookSeat();
                        break;
                    case 2:
                        CancelBooking();
                        break;
                    case 3:
                        FindBestAvailableSeats();
                        break;
                    case 4:
                        ShowSeatingChart();
                        break;
                    case 5:
                        PrintTicketsAndSales();
                        break;
                    case 6:
                        SearchTicket();
                        break;
                    case 7:
                        ShowPricingInfo();
                        break;
                    case 0:
                        Console.WriteLine("Thank you for using CinemaMax! ");
                        break;
                }

                if (choice != 0)
                {
                    Console.WriteLine("\nPress any key to continue...");
                    Console.ReadKey();
                    Console.Clear();
                }
            } while (choice != 0);
        }

        private static void ShowMenu()
        {
            Console.WriteLine("═══════════════════════════════════════════════════");
            Console.WriteLine("                  THEATER MENU                     ");
            Console.WriteLine("═══════════════════════════════════════════════════");
            Console.WriteLine("     1)  Book a seat");
            Console.WriteLine("     2)  Cancel a booking");
            Console.WriteLine("     3)  Find best available seats");
            Console.WriteLine("     4)  Show seating chart");
            Console.WriteLine("     5)  Print tickets and sales report");
            Console.WriteLine("     6)  Search ticket by seat");
            Console.WriteLine("     7)  Show pricing information");
            Console.WriteLine("     0)  Exit");
            Console.WriteLine("═══════════════════════════════════════════════════");
            Console.WriteLine("Please select an option:");
        }

        private static int GetValidChoice()
        {
            while (true)
            {
                string input = Console.ReadLine();
                if (int.TryParse(input, out int choice) && choice >= 0 && choice <= 7)
                {
                    return choice;
                }
                Console.WriteLine("Invalid option. Please select a number between 0-7:");
            }
        }

        private static void BookSeat()
        {
            Console.WriteLine("\n🎫 SEAT BOOKING");
            Console.WriteLine("================");

            int rowIndex = GetValidRow();
            int seat = GetValidSeat(rowIndex);

            double price = GetSeatPrice(rowIndex, seat);

            if (seats[rowIndex, seat - 1] == 0)
            {
                Console.Write(" Enter customer first name: ");
                string firstName = Console.ReadLine();

                Console.Write(" Enter customer last name: ");
                string lastName = Console.ReadLine();

                Console.Write(" Enter email address: ");
                string email = Console.ReadLine();

                Console.Write(" Enter phone number: ");
                string phone = Console.ReadLine();

                // Create Customer and Ticket objects
                Customer customer = new Customer(firstName, lastName, email, phone);
                Ticket ticket = new Ticket((char)('A' + rowIndex), seat, price, customer, currentMovie, showTime);

                ticketsSold.Add(ticket);
                seats[rowIndex, seat - 1] = 1; // Mark seat as booked
                ticket.Save(); // Save ticket information

                Console.WriteLine($" Seat {(char)('A' + rowIndex)}{seat} has been successfully booked!");
                Console.WriteLine($" Total cost: £{price:F2}");
            }
            else
            {
                Console.WriteLine(" Sorry, this seat is already booked.");
            }
        }

        private static void CancelBooking()
        {
            Console.WriteLine("\n CANCEL BOOKING");
            Console.WriteLine("==================");

            int rowIndex = GetValidRow();
            int seat = GetValidSeat(rowIndex);

            if (seats[rowIndex, seat - 1] == 1)
            {
                seats[rowIndex, seat - 1] = 0;

                // Find and remove the ticket
                var ticketToRemove = ticketsSold.FirstOrDefault(t =>
                    t.Row == (char)('A' + rowIndex) && t.SeatNumber == seat);

                if (ticketToRemove != null)
                {
                    ticketsSold.Remove(ticketToRemove);
                    Console.WriteLine($" Booking for seat {(char)('A' + rowIndex)}{seat} has been cancelled.");
                    Console.WriteLine($" Refund amount: £{ticketToRemove.Price:F2}");
                }
            }
            else
            {
                Console.WriteLine(" This seat is not currently booked.");
            }
        }

        private static void FindBestAvailableSeats()
        {
            Console.WriteLine("\n⭐ BEST AVAILABLE SEATS");
            Console.WriteLine("========================");

            // Premium seats (middle rows, center seats)
            var bestSeats = new List<string>();

            // Check middle rows first (rows D, E - best viewing)
            for (int row = 3; row <= 4; row++)
            {
                int centerStart = (SEATS_PER_ROW[row] / 2) - 2;
                int centerEnd = (SEATS_PER_ROW[row] / 2) + 2;

                for (int seat = centerStart; seat <= centerEnd; seat++)
                {
                    if (seat >= 0 && seat < SEATS_PER_ROW[row] && seats[row, seat] == 0)
                    {
                        bestSeats.Add($"{(char)('A' + row)}{seat + 1} (Premium - Center)");
                        if (bestSeats.Count >= 5) break;
                    }
                }
                if (bestSeats.Count >= 5) break;
            }

            // If no premium seats, check other good seats
            if (bestSeats.Count < 5)
            {
                for (int row = 2; row <= 5; row++)
                {
                    for (int seat = 2; seat < SEATS_PER_ROW[row] - 2; seat++)
                    {
                        if (seats[row, seat] == 0)
                        {
                            string category = row <= 2 || row >= 6 ? "Standard" : "Premium";
                            bestSeats.Add($"{(char)('A' + row)}{seat + 1} ({category})");
                            if (bestSeats.Count >= 5) break;
                        }
                    }
                    if (bestSeats.Count >= 5) break;
                }
            }

            if (bestSeats.Count > 0)
            {
                Console.WriteLine(" Recommended seats:");
                for (int i = 0; i < Math.Min(bestSeats.Count, 5); i++)
                {
                    Console.WriteLine($"{i + 1}. {bestSeats[i]}");
                }
            }
            else
            {
                Console.WriteLine(" No premium seats available. Checking all available seats...");
                FindFirstAvailable();
            }
        }

        private static void FindFirstAvailable()
        {
            for (int i = 0; i < ROWS; i++)
            {
                for (int j = 0; j < SEATS_PER_ROW[i]; j++)
                {
                    if (seats[i, j] == 0)
                    {
                        Console.WriteLine($"First available seat: {(char)('A' + i)}{j + 1}");
                        return;
                    }
                }
            }
            Console.WriteLine(" Sorry, the theater is completely sold out!");
        }

        private static void ShowSeatingChart()
        {
            Console.WriteLine("\n  THEATER SEATING CHART");
            Console.WriteLine("===========================");
            Console.WriteLine("           SCREEN ");
            Console.WriteLine("===========================");
            Console.WriteLine();

            for (int i = 0; i < ROWS; i++)
            {
                // Add spacing for curved effect
                int padding = Math.Abs(9 - SEATS_PER_ROW[i]) / 2;
                Console.Write($"Row {(char)('A' + i)}: ");
                Console.Write(new string(' ', padding));

                for (int j = 0; j < SEATS_PER_ROW[i]; j++)
                {
                    if (j == SEATS_PER_ROW[i] / 2) Console.Write(" "); // Aisle gap
                    Console.Write(seats[i, j] == 0 ? "🟢" : "🔴");
                }
                Console.WriteLine();
            }

            Console.WriteLine("\n🟢 = Available  🔴 = Booked");
            Console.WriteLine("\n PRICING ZONES:");
            Console.WriteLine("Rows A-B (Front): £8.00");
            Console.WriteLine("Rows C-F (Premium): £12.00");
            Console.WriteLine("Rows G-H (Back): £10.00");
        }

        private static void PrintTicketsAndSales()
        {
            Console.WriteLine("\n TICKETS & SALES REPORT");
            Console.WriteLine("===========================");

            if (ticketsSold.Count == 0)
            {
                Console.WriteLine("No tickets sold yet.");
                return;
            }

            double totalSales = 0;
            var salesByCategory = new Dictionary<string, (int count, double total)>();

            Console.WriteLine($" Movie: {currentMovie}");
            Console.WriteLine($" Show Time: {showTime}");
            Console.WriteLine($" Total Tickets Sold: {ticketsSold.Count}");
            Console.WriteLine();

            foreach (var ticket in ticketsSold.OrderBy(t => t.Row).ThenBy(t => t.SeatNumber))
            {
                ticket.PrintTicketInfo();
                totalSales += ticket.Price;

                string category = GetSeatCategory(ticket.Row - 'A', ticket.SeatNumber);
                if (salesByCategory.ContainsKey(category))
                {
                    var current = salesByCategory[category];
                    salesByCategory[category] = (current.count + 1, current.total + ticket.Price);
                }
                else
                {
                    salesByCategory[category] = (1, ticket.Price);
                }
            }

            Console.WriteLine("\n SALES SUMMARY");
            Console.WriteLine("==================");
            foreach (var category in salesByCategory)
            {
                Console.WriteLine($"{category.Key}: {category.Value.count} tickets - £{category.Value.total:F2}");
            }
            Console.WriteLine($"\n TOTAL SALES: £{totalSales:F2}");
            Console.WriteLine($" Average ticket price: £{totalSales / ticketsSold.Count:F2}");
        }

        private static void SearchTicket()
        {
            Console.WriteLine("\n SEARCH TICKET");
            Console.WriteLine("=================");

            int rowIndex = GetValidRow();
            int seat = GetValidSeat(rowIndex);

            var ticket = ticketsSold.FirstOrDefault(t =>
                t.Row == (char)('A' + rowIndex) && t.SeatNumber == seat);

            if (ticket != null)
            {
                Console.WriteLine(" Ticket Found:");
                ticket.PrintTicketInfo();
            }
            else
            {
                Console.WriteLine($" Seat {(char)('A' + rowIndex)}{seat} is available for booking.");
            }
        }

        private static void ShowPricingInfo()
        {
            Console.WriteLine("\n PRICING INFORMATION");
            Console.WriteLine("========================");
            Console.WriteLine(" CinemaMax Ticket Prices:");
            Console.WriteLine();
            Console.WriteLine(" FRONT SECTION (Rows A-B)");
            Console.WriteLine("    £8.00 - Budget-friendly viewing");
            Console.WriteLine();
            Console.WriteLine("⭐ PREMIUM SECTION (Rows C-F)");
            Console.WriteLine("    £12.00 - Best viewing experience");
            Console.WriteLine("    Optimal screen distance and angle");
            Console.WriteLine();
            Console.WriteLine("  BACK SECTION (Rows G-H)");
            Console.WriteLine("    £10.00 - Great overview of the screen");
            Console.WriteLine();
            Console.WriteLine(" Group Discounts Available!");
            Console.WriteLine(" Call 555-CINEMA for special rates");
        }

        private static int GetValidRow()
        {
            while (true)
            {
                Console.Write($"Enter row letter (A-{(char)('A' + ROWS - 1)}): ");
                string row = Console.ReadLine()?.ToUpper();

                if (!string.IsNullOrEmpty(row) && row.Length == 1 &&
                    row[0] >= 'A' && row[0] < 'A' + ROWS)
                {
                    return row[0] - 'A';
                }

                Console.WriteLine($"Invalid row. Please enter a letter between A and {(char)('A' + ROWS - 1)}.");
            }
        }

        private static int GetValidSeat(int rowIndex)
        {
            while (true)
            {
                Console.Write($"Enter seat number (1-{SEATS_PER_ROW[rowIndex]}): ");

                if (int.TryParse(Console.ReadLine(), out int seat) &&
                    seat > 0 && seat <= SEATS_PER_ROW[rowIndex])
                {
                    return seat;
                }

                Console.WriteLine($"Invalid seat. Please enter a number between 1 and {SEATS_PER_ROW[rowIndex]}.");
            }
        }

        private static double GetSeatPrice(int rowIndex, int seatNumber)
        {
            // Front rows (A-B): Cheaper
            if (rowIndex <= 1)
                return 8.00;

            // Premium rows (C-F): Most expensive
            if (rowIndex >= 2 && rowIndex <= 5)
                return 12.00;

            // Back rows (G-H): Mid-range
            return 10.00;
        }

        private static string GetSeatCategory(int rowIndex, int seatNumber)
        {
            if (rowIndex <= 1)
                return "Front Section";
            else if (rowIndex >= 2 && rowIndex <= 5)
                return "Premium Section";
            else
                return "Back Section";
        }
    }
}
