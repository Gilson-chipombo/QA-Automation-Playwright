import { APIRequestContext, expect, test } from "@playwright/test";

export interface Booking {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates:{
        checkin: string;
        checkout: string;
    };
    additionalneeds?: string;
}

export class BookingApi{
    constructor(private request: APIRequestContext){}

    async createBooking(booking: Booking){
        return this.request.post('/booking', {
            data: booking,
        });
    }

    async getBooking(id: number){
        return this.request.get(`/booking/${id}`);
    }

    // EXERCÍCIO:
    // Implementa updateBooking(id, booking, token).
    // Implementa deleteBooking(id, token).
}