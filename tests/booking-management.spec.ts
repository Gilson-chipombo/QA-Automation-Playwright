import { Booking } from '../src/clients/BookingAPI';
import { expect, test } from '../src/fixtures';

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
    const deleteResponse = await bookingFixture.delete();

    expect(deleteResponse.status()).toBe(201);

    const getResponse = await bookingFixture.api.getBooking(bookingFixture.bookingId);
    expect(getResponse.status()).toBe(404);
});
