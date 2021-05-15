import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { registerForm } from '../interfaces/register-form.interface';
import { loginForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { Usuario } from '../models/usuarios.model';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

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

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

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

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( ( resp: any ) => {
        const { email, google, img = '', nombre, role, uid } = resp.usuario;

        // Obtenemos el usuario al momento de renovar el token
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid );
        localStorage.setItem('token', resp.token);
        return true;
      }),
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

  actualizarPerfil( data: { email: string, nombre: string, role: string }) {

    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, {
      headers: {
        'x-token': this.token
      }
    })
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

