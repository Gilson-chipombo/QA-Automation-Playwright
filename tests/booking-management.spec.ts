import { expect, test as base } from '@playwright/test';
import { AuthApi } from '../src/clients/AuthApi';
import { Booking, BookingApi } from '../src/clients/BookingAPI';
import { createBookingData } from '../src/data/bookingFactory';

type BookingFixture = {
    api: BookingApi;
    booking: Booking;
    bookingId: number;
    token: string;
    deleted: boolean;
};

const test = base.extend<{ bookingFixture: BookingFixture }>({
    bookingFixture: async ({ request }, use) => {
        const api = new BookingApi(request);
        const token = await new AuthApi(request).createToken('admin', 'password123');
        const booking = createBookingData();
        booking.firstname = `Playwright-${Date.now()}`;

        const response = await api.createBooking(booking);
        expect(response.status()).toBe(200);

        const created = await response.json();
        expect(Number.isInteger(created.bookingid)).toBe(true);

        const fixture: BookingFixture = {
            api,
            booking,
            bookingId: created.bookingid,
            token,
            deleted: false,
        };

        try {
            await use(fixture);
        } finally {
            if (!fixture.deleted) {
                const deleteResponse = await api.deleteBooking(fixture.bookingId, fixture.token);
                expect(deleteResponse.status()).toBe(201);
            }
        }
    },
});

test('deve listar reservas filtrando pelo primeiro nome', async ({ bookingFixture }) => {
    const response = await bookingFixture.api.getBookingIds({
        firstname: bookingFixture.booking.firstname,
    });

    expect(response.status()).toBe(200);
    const bookings = await response.json();
    expect(bookings).toContainEqual({ bookingid: bookingFixture.bookingId });
});

test('deve substituir todos os dados de uma reserva', async ({ bookingFixture }) => {
    const updatedBooking: Booking = {
        ...bookingFixture.booking,
        firstname: `${bookingFixture.booking.firstname}-Updated`,
        totalprice: 275,
        depositpaid: false,
    };

    const response = await bookingFixture.api.updateBooking(
        bookingFixture.bookingId,
        updatedBooking,
        bookingFixture.token,
    );

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({
        firstname: updatedBooking.firstname,
        lastname: updatedBooking.lastname,
        totalprice: updatedBooking.totalprice,
        depositpaid: updatedBooking.depositpaid,
        bookingdates: updatedBooking.bookingdates,
        additionalneeds: updatedBooking.additionalneeds,
    });
});

test('deve atualizar parcialmente uma reserva sem alterar os restantes dados', async ({ bookingFixture }) => {
    const newNeeds = 'Late checkout';
    const response = await bookingFixture.api.partiallyUpdateBooking(
        bookingFixture.bookingId,
        { additionalneeds: newNeeds },
        bookingFixture.token,
    );

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({
        firstname: bookingFixture.booking.firstname,
        lastname: bookingFixture.booking.lastname,
        totalprice: bookingFixture.booking.totalprice,
        additionalneeds: newNeeds,
    });
});

test('deve eliminar uma reserva e deixar de a consultar', async ({ bookingFixture }) => {
    const deleteResponse = await bookingFixture.api.deleteBooking(
        bookingFixture.bookingId,
        bookingFixture.token,
    );

    expect(deleteResponse.status()).toBe(201);
    bookingFixture.deleted = true;

    const getResponse = await bookingFixture.api.getBooking(bookingFixture.bookingId);
    expect(getResponse.status()).toBe(404);
});
