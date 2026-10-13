import { expect, test as base, APIResponse } from '@playwright/test';
import { AuthApi } from './clients/AuthApi';
import { Booking, BookingApi } from './clients/BookingAPI';
import { createBookingData } from './data/bookingFactory';

const env = (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
}).process?.env ?? {};

const authUsername = env.AUTH_USERNAME || 'admin';
const authPassword = env.AUTH_PASSWORD || 'password123';

export type BookingFixture = {
    api: BookingApi;
    booking: Booking;
    bookingId: number;
    token: string;
    delete: () => Promise<APIResponse>;
};

type TestFixtures = {
    authApi: AuthApi;
    bookingApi: BookingApi;
    authCredentials: { username: string; password: string };
    authToken: string;
    bookingFixture: BookingFixture;
};

export const test = base.extend<TestFixtures>({
    authApi: async ({ request }, use) => {
        await use(new AuthApi(request));
    },
    bookingApi: async ({ request }, use) => {
        await use(new BookingApi(request));
    },
    authCredentials: async ({}, use) => {
        await use({ username: authUsername, password: authPassword });
    },
    authToken: async ({ authApi, authCredentials }, use) => {
        await use(await authApi.createToken(authCredentials.username, authCredentials.password)); // Isso vai na .env
    },
    bookingFixture: async ({ bookingApi, authToken }, use) => {
        const booking = createBookingData();
        booking.firstname = `Playwright-${Date.now()}`;

        const response = await bookingApi.createBooking(booking);
        expect(response.status()).toBe(200);

        const created = await response.json();
        expect(Number.isInteger(created.bookingid)).toBe(true);

        let deleted = false;
        const fixture: BookingFixture = {
            api: bookingApi,
            booking,
            bookingId: created.bookingid,
            token: authToken,
            delete: async () => {
                const deleteResponse = await bookingApi.deleteBooking(created.bookingid, authToken);
                if (deleteResponse.status() === 201) {
                    deleted = true;
                }
                return deleteResponse;
            },
        };

        try {
            await use(fixture);
        } finally {
            if (!deleted) {
                const deleteResponse = await fixture.delete();
                expect(deleteResponse.status()).toBe(201);
            }
        }
    },
});

export { expect };
