import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit{

  email: string;
  public auth2: any;

  constructor( private router: Router,
                private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private ngZone: NgZone ) { }

  ngOnInit() {
    this.renderButton();
    this.loginForm.controls['email'].setValue(localStorage.getItem('email') || '');
    this.email = this.loginForm.get('email').value;
    if ( this.email.length > 1) {
      this.loginForm.controls['remember'].setValue(true);
    }
  }

  public loginForm = this.fb.group({
    email: [ '', [ Validators.required, Validators.email ] ],
    password: [ '', Validators.required ],
    remember: [ false ]
  });

  

  login() {

    this.usuarioService.login( this.loginForm.value )
      .subscribe( resp => {
        this.router.navigateByUrl('/');
      }, (err) => {
        if ( err.error.msg ) {
          Swal.fire('Error', err.error.msg, 'error');  
        } else if ( err.error.errors.email && err.error.errors.password ) {
          Swal.fire('Error', "Ingrese Credenciales Correctas", 'error');
        } else if ( err.error.errors.email ){
          Swal.fire('Error', err.error.errors.email.msg, 'error');
        } else if ( err.error.errors.password ){
          Swal.fire('Error', err.error.errors.password.msg, 'error');
        }
      });
  }

  
  

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 200,
      'height': 35,
      'longtitle': true,
      'theme': 'dark',
    });
    this.startApp();
  }

  async startApp() {
    /*
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
*/
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '466540045750-pauq85g516s0djc77gt7fblu727usoj2.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
    });

    this.attachSignin( document.getElementById('my-signin2')) ;

  };

  attachSignin(element) {

    this.auth2.attachClickHandler( element, {},
        (googleUser) => {
          var id_token = googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle( id_token )
          .subscribe( resp => {
            // TODO: Mover al dashboard
            this.ngZone.run(() => {
              this.router.navigateByUrl('/');  
            });
            
          });
          

        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
