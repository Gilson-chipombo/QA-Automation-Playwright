import { BookingApi } from "../src/clients/BookingAPI";
import {expect, test} from '@playwright/test'
import { createBookingData } from "../src/data/bookingFactory";

test('deve criar e consultar uma reserva', async({ request })=>{
    
    const bookingApi = new BookingApi(request);
    const bookingData = createBookingData();

    const response = await bookingApi.createBooking(bookingData);

    expect(response.status).toBe(200);

    const created = await response.json();
    expect(created.bookingid).toBeTruthy();

    const getResponse = await bookingApi.getBooking(created.bookingid);
    
    expect(getResponse.status()).toBe(200)

    const booking = await getResponse.json();

    expect(booking.firstname).toBe(bookingData.firstname);
    expect(booking.lastname).toBe(bookingData.lastname)
});