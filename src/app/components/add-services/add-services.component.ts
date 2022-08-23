import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router'
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
interface Website {
  id: string;
  name: string;
}
@Component({
  selector: 'app-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.scss']
})
export class AddServicesComponent implements OnInit {

  public focus;
  serviceName: any = ''
  token: any
  image: any = ''
  banner_img: any
  description: any = ''
  alies_name: any = ''
  url: any = false; //Angular 11, for stricter type
  msg = "";
  user_data: any
  loading = false
  meta_description: any = ''
  meta_title: any = ''
  meta_keyword: any = ''
  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    image: new FormControl(''),
    banner_img: new FormControl(''),
    description: new FormControl(''),
    meta_description: new FormControl(''),
    meta_keyword: new FormControl(''),
    meta_title: new FormControl(''),
  });
    providers = new FormControl();
  submitted = false;
  form_type: any
  baseUrl: any = 'http://api.gurdevhospital.co/'
  res: any = ''
  data: any
  image_upload: any
  bannerimage_upload: any
  banner_url: any = false
  id: any
  doctorList:any=[]
  doctor_name:any
  filteredProviders: any[]
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public http: HttpClient, public toster: ToastrService, private router: Router, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id']
    console.log('id', this.id)
    this.token = localStorage.getItem('token')
    this.getDoctorList()
    if (this.id != undefined) {
      this.form_type = 'edit'
    }
    if (this.id == undefined) {
      this.form_type = 'create'
    }
    if (this.form_type == 'edit') {
      this.edit()
    }
    this.userForm()
  }

  ngOnInit() {
    // this.token = localStorage.getItem('token')
    // this.getDoctorList()
    // if (this.id != undefined) {
    //   this.form_type = 'edit'
    // }
    // if (this.id == undefined) {
    //   this.form_type = 'create'
    // }
    // if (this.form_type == 'edit') {
    //   this.edit()
    // }
    // this.userForm()
  

  }

  getDoctorList() {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.loading = true
    this.http.get<any>(this.baseUrl + 'api/doctors', { 'headers': headers })
      .subscribe(data => {
        this.loading = false
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data;
        this.doctorList = this.res.data

        console.log('doctorList', this.doctorList)
        this.filteredProviders = this.doctorList;
      },
        error => {
          this.loading = false
          console.log("failed with the errors", error.error);
          if (error.error) {
            this.toster.error(error.error.message);
          } else {
            this.toster.error('Something went wrong');
          }
        }
      );
  }
  onInputChange(event: any) {
    console.log('event',event.target.value)
    const searchInput = event.target.value.toLowerCase();

    this.filteredProviders = this.doctorList.filter((x ) => {
      console.log('first',x)
      const prov = x.first_name.toLowerCase();
      return prov.includes(searchInput);
    });
  }

  onOpenChange(searchInput: any) {
    console.log('Check',this.providers.value)
    if(this.providers.value != null){
      this.doctor_name = this.providers.value.map(x=>{
        return x.first_name+' '+x.last_name
      })
      console.log('doctor_name',this.doctor_name)
    }
  
    searchInput.value = "";
    this.filteredProviders = this.doctorList;
  }



  userForm() {
    this.form = this.formBuilder.group(
      {
        name: [
          this.serviceName,
          [
            Validators.required,
            Validators.minLength(5),
          ]
        ],
        description: [
          this.description,
          [
            Validators.required,
            Validators.minLength(10),
          ]
        ],
        image: [
          this.image],
        banner_img: [
          this.banner_img
        ],
        meta_title: [
          this.meta_title
        ],
        meta_description: [
          this.meta_description
        ],
        meta_keyword: [
          this.meta_keyword
        ],
        // alies_name: [
        //   this.alies_name,
        //   [
        //     Validators.required,
        //     Validators.minLength(4),
        //   ]
        // ]
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onSubmit(): void {
    console.log('Values', this.providers?.value)
    this.submitted = true;
    if (this.form.invalid && this.form_type == 'create') {
      return;
    }
    else {
      if (this.form_type == 'create') {
        const headers = { 'Authorization': 'Bearer ' + this.token }
        this.loading = true
        let formdata = new FormData()
        formdata.append('name', this.form.value.name)
        formdata.append('description', this.form.value.description)
        formdata.append('meta_title', this.form.value.meta_title)
        formdata.append('meta_description', this.form.value.meta_description)
        formdata.append('meta_keyword', this.form.value.meta_keyword)
        if(this.providers?.value.length !=0){
         let doctor_id = this.providers?.value.map(x=>{
            return x.id
          })
          console.log('doctor_id',doctor_id)
            formdata.append('doctors', doctor_id.join())
        }
        // formdata.append('alies_name', this.form.value.alies_name)
        if (this.image_upload != undefined) {
          formdata.append('image', this.image_upload)
        }
        if (this.bannerimage_upload != undefined) {
          formdata.append('banner_image', this.bannerimage_upload)

        }
        this.http.post<any>(this.baseUrl + 'api/services', formdata, { 'headers': headers })
          .subscribe(
            response => {
              this.loading = false
              this.data = response
              console.log("Data" + this.data);
              if (this.data.success == true) {
                this.toster.success(this.data.message);
              }
              this.modalService.dismissAll()
              this.submitted = false;
              this.form.reset()
              this.url = false
              this.banner_url = false
              this.router.navigate(['dashboard/service'])

            },
            error => {
              this.loading = false
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
      else if (this.form_type == 'edit') {
        this.update()
      }
    }

  }
  edit() {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.loading = true
    this.http.get<any>(this.baseUrl + 'api/services/' + this.id + '/edit', { 'headers': headers })
      .subscribe(data => {
        this.loading = false
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data.data;
        let myArrayFiltered = this.doctorList.filter((el) => {
          return this.res.doctors.some((f) => {
            return f.first_name == el.first_name && f.last_name == el.last_name;
          });
        });
        console.log('Arr', myArrayFiltered)
       this.providers.setValue(myArrayFiltered)
       if(this.providers.value != null){
        this.doctor_name = this.providers.value.map(x=>{
          return x.first_name+' '+x.last_name
        })
        console.log('doctor_name',this.doctor_name)
      }
        // this.image = this.res.image
       
       
        this.serviceName = this.res.name
        this.description = this.res.description
        this.alies_name = this.res.alies_name
        this.meta_description = this.res.meta_description
        this.meta_keyword = this.res.meta_keyword
        this.meta_title = this.res.meta_title
       this.url = false
        this.userForm()
      },
        error => {
          this.loading = true
          console.log("failed with the errors", error.error);
          if (error.error) {
            this.toster.error(error.error.message);
          } else {
            this.toster.error('Something went wrong');
          }
        }
      );
  }
  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  }

  public editorConfig = {
    editable: true,
    spellcheck: false,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Type something. Test the Editor... ヽ(^。^)丿',
    translate: 'no'
  }
  update() {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.loading = true
    let formdata = new FormData()
    formdata.append('name', this.form.value.name)
    formdata.append('description', this.form.value.description)
    // formdata.append('alies_name', this.form.value.alies_name)
    formdata.append('meta_title', this.form.value.meta_title)
    formdata.append('meta_description', this.form.value.meta_description)
    formdata.append('meta_keyword', this.form.value.meta_keyword)
    if (this.image_upload != undefined) {
      formdata.append('image', this.image_upload)
    } if (this.bannerimage_upload != undefined) {
      formdata.append('banner_image', this.bannerimage_upload)
    }
    if(this.providers?.value.length !=0){
      let doctor_id = this.providers?.value.map(x=>{
         return x.id
       })
       console.log('doctor_id',doctor_id)
         formdata.append('doctors', doctor_id.join())
     }
    formdata.append('_method', 'PATCH')
    this.http.post<any>(this.baseUrl + 'api/services/' + this.id, formdata, { 'headers': headers })
      .subscribe(
        response => {
          this.loading = false
          this.data = response
          console.log("Data" + this.data);
          if (this.data.success == true) {
            this.toster.success(this.data.message);
          }
          this.modalService.dismissAll()
          this.submitted = false;
          this.form_type = ''
          this.form.reset()
          this.url = false
          this.banner_url = false
          this.router.navigate(['dashboard/service'])
        },
        error => {
          this.loading = false
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
      } else if (type == 'banner') {
        this.bannerimage_upload = event.target.files[0]
        this.banner_url = true;
      }

      console.log('URL', this.image_upload)
    }
  }

}
