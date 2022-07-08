import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router'
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-services',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss']
})
export class AddDoctorComponent implements OnInit {

  public focus;
  fname: any = ''
  lname: any = ''
  token: any
  image: any = ''
  profession: any
  quali: any = ''
  email: any = ''
  url: any = false; //Angular 11, for stricter type
  msg = "";
  phone: any = ''
  form: FormGroup = new FormGroup({
    fname: new FormControl(''),
    lname: new FormControl(''),
    email: new FormControl(''),
    profession: new FormControl(''),
    image: new FormControl(''),
    quali: new FormControl(''),
    phone: new FormControl(''),


  });
  submitted = false;
  form_type: any
  baseUrl: any = 'http://api.gurdevhospital.co/'
  res: any = ''
  data: any
  image_upload: any
  bannerimage_upload: any
  banner_url: any = false
  id: any
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public http: HttpClient, public toster: ToastrService, private router: Router, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id']
    console.log('id', this.id)
  }

  ngOnInit() {
    this.token = localStorage.getItem('token')
    if (this.id != undefined) {
      this.form_type = 'edit'
    }
    if (this.form_type == 'edit') {
      this.edit()
    }
    this.userForm()


  }



  userForm() {
    let MOBILE_PATTERN = /[0-9\+\-\ ]/;
    this.form = this.formBuilder.group(
      {
        fname: [
          this.fname,
          [
            Validators.required,
            Validators.minLength(5),
          ]
        ],
        lname: [
          this.lname,
          [
            Validators.required,
            Validators.minLength(5),
          ]
        ],
        profession: [
          this.profession,
          [
            Validators.required,
            Validators.minLength(4),
          ]
        ],
        quali: [
          this.quali,
          [
            Validators.required,
            Validators.minLength(5),
          ]
        ],
        image: [
          this.image,
          [
            Validators.required,
          ]
        ],
        phone: [
          this.phone,
          [
            Validators.required,
            Validators.pattern(MOBILE_PATTERN),
          ]
        ],
        email: [
          this.email,
          [
            Validators.required,Validators.email
          ]
        ]
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onSubmit(): void {
    console.log(this.form.value.name);
    this.submitted = true;
    if (this.form.invalid && this.form_type != 'edit') {
      return;
    }

    else {
      if (this.form_type != 'edit') {
        const headers = { 'Authorization': 'Bearer ' + this.token }
        let formdata = new FormData()
        formdata.append('first_name', this.form.value.fname)
        formdata.append('last_name', this.form.value.lname)
        formdata.append('email', this.form.value.email)
        formdata.append('image', this.image_upload)
        formdata.append('profession', this.form.value.profession)
        formdata.append('phone_number', this.form.value.phone)
        formdata.append('qualification', this.form.value.quali)
        this.http.post<any>(this.baseUrl + 'api/doctors', formdata, { 'headers': headers })
          .subscribe(
            response => {
              this.data = response
              console.log("Data" + this.data);
              if (this.data.success == true) {
                this.toster.success(this.data.message);
              }
              this.submitted = false;
              this.form.reset()
              this.url = false
              this.banner_url = false
              this.router.navigate(['dashboard/doctor'])

            },
            error => {
              console.log("Post failed with the errors", error.error);
              if (error.error && error.error.success == false) {
                this.toster.error(error.error.message);
              } else {
                this.toster.error('Oops something went wrong!!');
              }
            },
            () => {
              console.log("Post Completed");
            }
          );
      }
      if (this.form_type == 'edit') {
        this.update()
      }
    }

  }
  edit() {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.http.get<any>(this.baseUrl + 'api/doctors/' + this.id + '/edit', { 'headers': headers })
      .subscribe(data => {
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data.data;
        this.fname = this.res.first_name
        this.lname = this.res.last_name
        this.email = this.res.email
        this.profession = this.res.profession
        this.quali = this.res.qualification
        this.phone = this.res.phone_number.replace('+91','')
        console.log('DoctorList', this.res)
        this.url = false
        this.userForm()
      },
        error => {
          console.log("failed with the errors", error.error);
          if (error.error) {
            this.toster.error(error.error.message);
          } else {
            this.toster.error('Something went wrong');
          }
        }
      );
  }

  update() {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    let formdata = new FormData()
    formdata.append('first_name', this.form.value.fname)
    formdata.append('last_name', this.form.value.lname)
    formdata.append('email', this.form.value.email)
    formdata.append('profession', this.form.value.profession)
    formdata.append('phone_number', this.form.value.phone)
    formdata.append('qualification', this.form.value.quali)
    if (this.image_upload != undefined) {
      formdata.append('image', this.image_upload)
    }
    formdata.append('_method', 'PATCH')
    this.http.post<any>(this.baseUrl + 'api/doctors/' + this.id, formdata, { 'headers': headers })
      .subscribe(
        response => {
          this.data = response
          console.log("Data" + this.data);
          if (this.data.success == true) {
            this.toster.success(this.data.message);
          }
          this.submitted = false;
          this.form_type = ''
          this.form.reset()
          this.url = false
          this.router.navigate(['dashboard/doctor'])
        },
        error => {
          console.log("Post failed with the errors", error.error);
          if (error.error && error.error.success == false) {
            this.toster.error(error.error.message);
          } else {
            this.toster.error('Oops something went wrong!!');
          }
        },
        () => {
          console.log("Post Completed");
        }
      );
  }


  selectFile(event: any, type: any) { //Angular 11, for stricter type
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.msg = "";
      // this.url = reader.result;

      if (type == 'image') {
        this.image_upload = event.target.files[0]
        this.url = true;
      }

      console.log('URL', this.image_upload)
    }
  }

}
