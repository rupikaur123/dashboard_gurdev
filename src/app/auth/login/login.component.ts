import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/services/firebase/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public show: boolean = false;
  public loading:boolean= false;
  public loginForm: FormGroup;
  public errorMessage: any;
  data: any
  baseURL: any = 'http://api.gurdevhospital.co/'
  public showLoader: boolean = false;

  constructor(public authService: AuthService, private fb: FormBuilder, private router: Router, public http: HttpClient, public toster: ToastrService,) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  showPassword() {
    this.show = !this.show;
  }

  // Simple Login
  login() {
    if (this.loginForm.invalid) {
      return;
    }
    else {
      this.loading= true
      console.log('Login Values', this.loginForm.value)
      const headers = { 'content-type': 'application/json' }
      const body = JSON.stringify(this.loginForm.value);
      this.http.post<any>(this.baseURL + 'api/login', body, { 'headers': headers })
        .subscribe(
          response => {
            this.loading= false
            this.data = response
            console.log("Login" + this.data);
            if (this.data.success == true) {
              localStorage.setItem('token', this.data.data.token)
              this.toster.success(this.data.message);
              this.router.navigate(['/dashboard']);
            }


          },
          error => {
            this.loading= false
            console.log("Post failed with the errors", error.error);

            if (error.error && error.error.success == false) {
              this.toster.error(error.error.message);
            } else {
              this.toster.error('You have enter Wrong Email or Password.');
            }

            // this.router.navigate(['/dashboard/ecommerce']);

          },
          () => {
            console.log("Post Completed");
          }
        );
    }

    // this.authService.SignIn(this.loginForm.value['email'], this.loginForm.value['password']);
  }

}
