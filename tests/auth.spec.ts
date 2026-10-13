import { expect, test } from '@playwright/test';
import { AuthApi } from '../src/clients/AuthApi';

test('deve gerar um token com credenciais válidas', async ({ request }) => {
    const authApi = new AuthApi(request);

    const token = await authApi.createToken('admin', 'password123');

    expect(token).toBeTruthy();
});

test('deve rejeitar credenciais inválidas sem gerar token', async ({ request }) => {
    const response = await request.post('/auth', {
        data: {
            username: 'invalid-user',
            password: 'invalid-password',
        },
    });

    expect(response.status()).toBe(200);
    await expect(response).toBeOK();

    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
    expect(body.token).toBeUndefined();
});