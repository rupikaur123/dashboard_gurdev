import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/services/firebase/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public show: boolean = false;
  public loginForm: FormGroup;
  public errorMessage: any;

  constructor(public authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['test@gmail.com', [Validators.required, Validators.email]],
      password: ['test123', Validators.required]
    });
  }

  ngOnInit() {
  }

  showPassword() {
    this.show = !this.show;
  }

  // Simple Login
  login() {
    this.router.navigate(['/dashboard/ecommerce']);
    // this.authService.SignIn(this.loginForm.value['email'], this.loginForm.value['password']);
  }

}
