import { APIRequestContext, expect } from '@playwright/test'

export class AuthApi {
    constructor(private request: APIRequestContext){}

    async createToken(username: string, password: string){
        const response = await this.request.post('/auth',{
            data:{ username, password }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        
        expect(body.token).toBeTruthy();

        return body.token as string;
    }
}