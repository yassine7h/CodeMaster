import { API_BASE_URL } from './HttpClient';

class DjangoAdminAuth {
   private csrfToken: string = '';
   private async getCsrfToken(): Promise<void> {
      try {
         await fetch(`${API_BASE_URL}/admin/login/`, {
            method: 'GET',
            credentials: 'include',
         });

         const csrfToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('csrftoken='))
            ?.split('=')[1];

         if (!csrfToken) {
            throw new Error('No CSRF token found');
         }

         this.csrfToken = csrfToken;
      } catch (error) {
         console.error('Failed to get CSRF token:', error);
         throw error;
      }
   }

   public async login(username: string, password: string): Promise<boolean> {
      try {
         await this.getCsrfToken();

         const response = await fetch(`${API_BASE_URL}/admin/login/`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
               'X-Requested-With': 'XMLHttpRequest',
               'X-CSRFToken': this.csrfToken,
            },
            body: new URLSearchParams({
               username,
               password,
               next: '/admin/',
               csrfmiddlewaretoken: this.csrfToken,
            }),
            credentials: 'include',
            mode: 'cors',
         });
         return response.ok;
      } catch (error) {
         console.error('Login failed:', error);
         throw error;
      }
   }

   public async logout(): Promise<boolean> {
      try {
         await this.getCsrfToken();
         const response = await fetch(`${API_BASE_URL}/admin/logout/`, {
            method: 'POST',
            headers: {
               'X-CSRFToken': this.csrfToken,
            },
            credentials: 'include',
         });
         return response.ok;
      } catch (error) {
         console.error('Logout failed:', error);
         throw error;
      }
   }
}

export const djangoAdminAuth = new DjangoAdminAuth();
