import { Booking } from "../clients/BookingAPI";

export function createBookingData(): Booking {
    return {
        firstname: 'Gilson',
        lastname: 'QA-Automation',
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
        checkin: '2027-01-10',
        checkout: '2027-01-15',
        },
        additionalneeds: 'Breakfast',
  };
}