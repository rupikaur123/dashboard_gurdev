import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router'



@Component({
  selector: 'app-add-static-page',
  templateUrl: './add-static-page.component.html',
  styleUrls: ['./add-static-page.component.scss']
})
export class AddStaticPagesComponent implements OnInit {

  public focus;
  newsList: any = []
  searchUser: any
  closeResult: string = '';
  image_upload: any
  form_type: any = ''
  title: any
  content: any
  image: any = ''
  loading=false
  baseUrl: any = 'http://api.gurdevhospital.co/'
  url: any = false; //Angular 11, for stricter type
  msg = "";
  meta_description:any=''
  meta_title:any=''
  meta_keyword:any=''
  form: FormGroup = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
    image: new FormControl(''),
    meta_description: new FormControl(''),
    meta_keyword: new FormControl(''),
   meta_title:new FormControl('')
  });
  token: any = ''
  submitted = false;
  data: any
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  res: any
  news_data: any
  id: any
  public editorValue: string = '';

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public http: HttpClient, public toster: ToastrService, private router: Router, private route: ActivatedRoute) {

    this.id = this.route.snapshot.params['id']
    console.log('id', this.id)
  }
  selectFile(event: any) { //Angular 11, for stricter type
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
      this.url = true;
      this.image_upload = event.target.files[0]
    }
  }
  ngOnInit() {
    this.token = localStorage.getItem('token')
    if (this.id != undefined) {
      this.form_type = 'edit'
    }
    if (this.form_type == 'edit') {
      this.edit()
    }
    this.newsForm()

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
  newsForm() {
    this.form = this.formBuilder.group(
      {
        title: [
          this.title,
          [
            Validators.required,
            Validators.minLength(4),
          ]
        ],
        content: [
          this.content,
          [
            Validators.required
          ]
        ],
        image: [
          this.image,
          [
            Validators.required,
          ]
        ],
        meta_title: [
          this.meta_title,
        
        ],
        meta_description: [
          this.meta_description
        ],
        meta_keyword: [
          this.meta_keyword
        ],

      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid && this.form_type != 'edit') {
      return;
    }

    else {
      if (this.form_type != 'edit') {
        const headers = { 'Authorization': 'Bearer ' + this.token }
        this.loading=true
        let formdata = new FormData()
        formdata.append('title', this.form.value.title)
        formdata.append('content', this.form.value.content)
        formdata.append('image', this.image_upload)
        formdata.append('meta_title', this.form.value.meta_title)
        formdata.append('meta_description', this.form.value.meta_description)
        formdata.append('meta_keyword', this.form.value.meta_keyword)
        this.http.post<any>(this.baseUrl + 'api/static_pages', formdata, { 'headers': headers })
          .subscribe(
            response => {
              this.loading=false
              this.data = response
              console.log("Data" + this.data);
              if (this.data.success == true) {
                this.toster.success(this.data.message);
              }
              this.modalService.dismissAll()
              this.submitted = false;
              this.url = false
              this.form.reset()
              this.router.navigate(['dashboard/static'])
            },
            error => {
              this.loading=false
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
    this.loading=true
    this.http.get<any>(this.baseUrl + 'api/static_pages/' + this.id + '/edit', { 'headers': headers })
      .subscribe(data => {
        this.loading=false
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data.data;
        this.title = this.res.title
        this.content = this.res.content
        this.meta_description = this.res.meta_description
        this.meta_keyword= this.res.meta_keyword
        this.meta_title= this.res.meta_title
        console.log('NewsList', this.res)
        this.newsForm()
      },
        error => {
          this.loading=false
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
    this.loading=true
    let formdata = new FormData()
    formdata.append('title', this.form.value.title)
    formdata.append('content', this.form.value.content)
    formdata.append('meta_title', this.form.value.meta_title)
    formdata.append('meta_description', this.form.value.meta_description)
    formdata.append('meta_keyword', this.form.value.meta_keyword)

    formdata.append('_method', 'PATCH')
    if (this.image_upload != undefined) {
      formdata.append('image', this.image_upload)
    }

    this.http.post<any>(this.baseUrl + 'api/static_pages/' + this.id, formdata, { 'headers': headers })
      .subscribe(
        response => {
          this.loading=false
          this.data = response
          console.log("Data" + this.data);
          if (this.data.success == true) {
            this.toster.success(this.data.message);
          }
          this.modalService.dismissAll()
          this.submitted = false;
          this.url = false
          this.form_type = ''
          this.form.reset()
          this.router.navigate(['dashboard/static'])

        },
        error => {
          this.loading=false
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


}
