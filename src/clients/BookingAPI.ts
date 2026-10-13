import { APIRequestContext } from "@playwright/test";

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

export interface BookingSearch {
    firstname?: string;
    lastname?: string;
    checkin?: string;
    checkout?: string;
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

    async getBookingIds(search: BookingSearch = {}){
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(search)) {
            if (value !== undefined) {
                params.set(key, value);
            }
        }

        return this.request.get('/booking', {
            params,
        });
    }

    async updateBooking(id: number, booking: Booking, token: string){
        return this.request.put(`/booking/${id}`, {
            data: booking,
            headers: {
                Cookie: `token=${token}`,
            },
        });
    }

    async partiallyUpdateBooking(id: number, booking: Partial<Booking>, token: string){
        return this.request.patch(`/booking/${id}`, {
            data: booking,
            headers: {
                Cookie: `token=${token}`,
            },
        });
    }

    async deleteBooking(id: number, token: string){
        return this.request.delete(`/booking/${id}`, {
            headers: {
                Cookie: `token=${token}`,
            },
        });
    }
}