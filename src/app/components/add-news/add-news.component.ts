import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss']
})
export class AddNewsComponent implements OnInit {

  public focus;
  image_upload: any
  form_type: any = ''
  title: any = ''
  content: any = ''
  image: any = ''
  baseUrl: any = 'http://api.gurdevhospital.co/'
  url: any = false; //Angular 11, for stricter type
  msg = "";
  date: any;
  form: FormGroup = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
    image: new FormControl(''),
    date: new FormControl(''),

  });
  token: any = ''
  submitted = false;
  data: any
  res: any
  public editorValue: string = '';
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();
  id: any
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public http: HttpClient, public toster: ToastrService, private router: Router, private route: ActivatedRoute) {
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
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
      // this.url = reader.result;
      this.url = true
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
            Validators.required,
          ]
        ],
        image: [
          this.image,
          [
            Validators.required,
          ]
        ], date: [
          this.date,
          [
            Validators.required,
          ]
        ]

      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onSubmit(): void {
    // console.log('Date', moment(this.form.value.date).format('YYYY-MM-DD'))
    this.submitted = true;
    if (this.form.invalid && this.form_type != 'edit') {
      return;
    }

    else {
      if (this.form_type != 'edit') {
        const headers = { 'Authorization': 'Bearer ' + this.token }
        let formdata = new FormData()
        formdata.append('title', this.form.value.title)
        formdata.append('content', this.form.value.content)
        formdata.append('date', moment(this.form.value.date).format('YYYY-MM-DD'))
        formdata.append('image', this.image_upload)
        this.http.post<any>(this.baseUrl + 'api/latestnews', formdata, { 'headers': headers })
          .subscribe(
            response => {
              this.data = response
              console.log("Data" + this.data);
              if (this.data.success == true) {
                this.toster.success(this.data.message);
              }
              this.modalService.dismissAll()
              this.submitted = false;
              this.form.reset()
              this.url =
                this.router.navigate(['dashboard/latest-news'])
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
    this.http.get<any>(this.baseUrl + 'api/latestnews/' + this.id + '/edit', { 'headers': headers })
      .subscribe(data => {
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data.data;
        this.title = this.res.title
        this.content = this.res.content
        this.date = moment(this.res.date).format('YYYY-MM-DD')
        // this.image = this.res.image
        console.log('NewsList', this.res)
        this.newsForm()
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
    formdata.append('title', this.form.value.title)
    formdata.append('content', this.form.value.content)
    formdata.append('date', moment(this.form.value.date).format('YYYY-MM-DD'))
    if (this.image_upload != undefined) {
      formdata.append('image', this.image_upload)
    }

    formdata.append('_method', 'PATCH')
    this.http.post<any>(this.baseUrl + 'api/latestnews/' + this.id, formdata, { 'headers': headers })
      .subscribe(
        response => {
          this.data = response
          console.log("Data" + this.data);
          if (this.data.success == true) {
            this.toster.success(this.data.message);
          }
          this.modalService.dismissAll()
          this.form.reset()
          this.submitted = false;
          this.form_type = ''
          this.url = false
          this.router.navigate(['dashboard/latest-news'])

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


}
