import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "src/app/shared/services/firebase/auth.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.scss"],
})
export class ForgetPasswordComponent implements OnInit {
  public show: boolean = false;
  public loading: boolean = false;
  public forgotForm: FormGroup;
  public errorMessage: any;
  data: any;
  baseURL: any = "http://api.gurdevhospital.co/";
  public showLoader: boolean = false;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    public http: HttpClient,
    public toster: ToastrService
  ) {
    this.forgotForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  showPassword() {
    this.show = !this.show;
  }
  forgotPassword() {
    if (this.forgotForm.invalid) {
      return;
    } else {
      this.loading = true;
      console.log("Forgot Values", this.forgotForm.value);
      const headers = { "content-type": "application/json" };
      const body = JSON.stringify(this.forgotForm.value);
      this.http
        .post<any>(this.baseURL + "api/forgot_password", body, {
          headers: headers,
        })
        .subscribe(
          (response) => {
            this.loading = false;
            this.data = response;
            if (this.data.success == true) {
              this.toster.success(this.data.message);
            }
          },
          (error) => {
            this.loading = false;
            console.log("Post failed with the errors", error.error);

            if (error.error && error.error.success == false) {
              this.toster.error(error.error.message);
            } else {
              this.toster.error("You have enter Wrong Email Address.");
            }
          },
          () => {
            console.log("Post Completed");
          }
        );
    }
  }
}
