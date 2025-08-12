using System;

namespace MovieTheaterManagement
{
    public class Customer
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public Customer(string firstName, string lastName, string email, string phone)
        {
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Phone = phone;
        }

        public string FullName => $"{FirstName} {LastName}";

        public void PrintCustomerInfo()
        {
            Console.WriteLine($"Customer: {FullName}");
            Console.WriteLine($"Email: {Email}");
            Console.WriteLine($"Phone: {Phone}");
        }

        public override string ToString()
        {
            return $"{FullName} ({Email})";
        }

        // Method to validate email format (basic validation)
        public bool IsEmailValid()
        {
            return !string.IsNullOrEmpty(Email) && Email.Contains("@") && Email.Contains(".");
        }

        // Method to format phone number display
        public string FormattedPhone()
        {
            if (string.IsNullOrEmpty(Phone) || Phone.Length < 10)
                return Phone;

            // Format as (XXX) XXX-XXXX if 10+ digits
            var digits = new string(Phone.Where(char.IsDigit).ToArray());
            if (digits.Length >= 10)
            {
                return $"({digits.Substring(0, 3)}) {digits.Substring(3, 3)}-{digits.Substring(6, 4)}";
            }

            return Phone;
        }
    }
}
