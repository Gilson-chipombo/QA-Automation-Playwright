import { expect, test } from '../src/fixtures';

test('deve criar e consultar uma reserva', async ({ bookingApi, bookingFixture }) => {
    const bookingData = bookingFixture.booking;

    const response = await bookingApi.getBooking(bookingFixture.bookingId);

    expect(response.status()).toBe(200);
    const booking = await response.json();

    expect(booking.firstname).toBe(bookingData.firstname);
    expect(booking.lastname).toBe(bookingData.lastname);
});