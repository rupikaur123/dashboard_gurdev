import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "src/app/shared/services/firebase/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  public show: boolean = false;
  public loading: boolean = false;
  public resetForm: FormGroup;
  public errorMessage: any;
  public token: any;
  data: any;
  baseURL: any = "http://api.gurdevhospital.co/";
  public showLoader: boolean = false;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    public http: HttpClient,
    public toster: ToastrService,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      password: ["", Validators.required],
      confirmPass: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.params["token"];
    console.log("token", this.token);
    this.matchToken();
  }
  matchToken() {
    const headers = { Authorization: "Bearer " + this.token };
    this.loading = true;
    this.http
      .get<any>(this.baseURL + "api/password/reset/" + this.token, {
        headers: headers,
      })
      .subscribe(
        (data) => {
          this.loading = false;
          console.log(
            "Get completed sucessfully. The response received " + data
          );
          this.data = data;
          if (this.data.success == true) {
            this.toster.success(this.data.message);
            this.showLoader = true
          }
        },
        (error) => {
          this.loading = false;
          console.log("failed with the errors", error.error);
          if (error.error) {
            this.toster.error(error.error.message);
          } else {
            this.toster.error("Something went wrong");
          }
        }
      );
  }
  showPassword() {
    this.show = !this.show;
  }
  createPass() {
    if (this.resetForm.invalid) {
      return;
    } else {
      if(this.resetForm.value.password !== this.resetForm.value.confirmPass){
        this.toster.error("Please match the password !!");
      } else{
        this.loading = true;
        console.log("Login Values", this.resetForm.value);
        const headers = { "content-type": "application/json" };
        const body = {
          password: this.resetForm.value.password,
          token: this.token,
        };
        this.http
          .post<any>(this.baseURL + "api/password/create", body, {
            headers: headers,
          })
          .subscribe(
            (response) => {
              this.loading = false;
              this.data = response;
              if (this.data.success == true) {
                this.toster.success(this.data.message);
                this.router.navigate(['/auth/login']);
              }
            },
            (error) => {
              this.loading = false;
              console.log("Post failed with the errors", error.error);
  
              if (error.error && error.error.success == false) {
                this.toster.error(error.error.message);
              } else {
                this.toster.error("You have enter Wrong Password.");
              }
            },
            () => {
              console.log("Post Completed");
            }
          );
      }
      
    }
  }
}
