import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { registerForm } from '../interfaces/register-form.interface';
import { loginForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor( private http: HttpClient,
                private router: Router,
                private ngZone: NgZone ) {
    this.googleInit();
  }

/*  googleInit() {

    return new Promise( resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '466540045750-pauq85g516s0djc77gt7fblu727usoj2.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    })

  }*/

  googleInit(){

    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '466540045750-pauq85g516s0djc77gt7fblu727usoj2.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
    });
  }

  logout() {
    localStorage.removeItem('token');
    
    this.auth2.signOut().then( () => {
      
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
      
    });

  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( ( resp: any ) => {
        localStorage.setItem('token', resp.token);
      }),
      map( resp => true ),
      catchError( error => of(false) )
    );

  }

  crearUsuario( formData: registerForm ) {

    return this.http.post(`${ base_url }/usuarios`, formData)
                .pipe(
                  map( ( resp: any ) => {
                    localStorage.setItem('token', resp.token)
                    return true;
                  })
                );
    
  }

  login( formData: loginForm ) {

    if ( formData.remember ) {
      localStorage.setItem('email', formData.email );
    } else {
      localStorage.removeItem('email');
    }

    return this.http.post(`${ base_url }/login`, formData)
                .pipe(
                  map( ( resp: any ) => {
                    localStorage.setItem('token', resp.token)
                    return true;
                  })
                );
    
  }

  loginGoogle( token ) {

    return this.http.post(`${ base_url }/login/google`, { token })
                .pipe(
                  map( ( resp: any ) => {
                    localStorage.setItem('token', resp.token)
                    return true;
                  })
                );
    
  }


}

