import { Injectable } from '@angular/core';
import {environment} from '../../enviroments/environment';

declare global {
  interface Window { fbAsyncInit: any; FB: any; }
}

@Injectable({
  providedIn: 'root'
})
export class FacebookAuthService {

  private loaded = false;

  loadSdk(): Promise<void> {
    if (this.loaded) return Promise.resolve();
    return new Promise((resolve) => {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: environment.facebook.appId,
          cookie: true,
          xfbml: false,
          version: environment.facebook.version
        });
        this.loaded = true;
        resolve();
      };
      const s = document.createElement('script');
      s.async = true;
      s.defer = true;
      s.src = 'https://connect.facebook.net/en_US/sdk.js';
      document.body.appendChild(s);
    });
  }

  async login(): Promise<{ accessToken: string; profile: { id: string; email?: string; first_name?: string; last_name?: string } }> {
    await this.loadSdk();
    const auth = await new Promise<any>((resolve, reject) => {
      window.FB.login((resp: any) => {
        if (resp.authResponse) resolve(resp.authResponse);
        else reject(new Error('Login cancelado'));
      }, { scope: 'email' });
    });

    const profile = await new Promise<any>((resolve) => {
      window.FB.api('/me', { fields: 'id,first_name,last_name,email' }, (resp: any) => resolve(resp));
    });

    return { accessToken: auth.accessToken, profile };
  }
}
