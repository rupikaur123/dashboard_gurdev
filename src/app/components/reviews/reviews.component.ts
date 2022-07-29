import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';



@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  public focus;
  newsList: any = []
  search: any=''
  closeResult: string = '';
  image_upload: any
  form_type: any = ''
  review: any = ''
  image: any = ''
  loading=false
  baseUrl: any = 'http://api.gurdevhospital.co/'
  url: any = false; //Angular 11, for stricter type
  msg = "";
  date: any;
  form: FormGroup = new FormGroup({
    review: new FormControl(''),
    image: new FormControl(''),
  });
  token: any = ''
  submitted = false;
  data: any
  res: any
  news_data: any
  public editorValue: string = '';
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();
  page = {
    limit: 10,
    count: 0,
    offset: 0,
    pageSize: 10
  };
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public http: HttpClient, public toster: ToastrService) {
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
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
    this.newsForm()
    this.getReviewsList(this.page.offset + 1)
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
        review: [
          this.review,
          [
            Validators.required,
            Validators.minLength(10),
          ]
        ],
        image: [
          this.image,
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
    console.log('Date', this.form.value.review)
    this.submitted = true;
    if (this.form.invalid && this.form_type != 'edit') {
      return;
    }

    else {
      if (this.form_type != 'edit') {
        const headers = { 'Authorization': 'Bearer ' + this.token }
        this.loading=true
        let formdata = new FormData()
        formdata.append('review', this.form.value.review)
        formdata.append('image', this.image_upload)
        this.http.post<any>(this.baseUrl + 'api/reviews', formdata, { 'headers': headers })
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
              this.url = false;
              this.form.reset()
              this.getReviewsList(this.page.offset + 1)
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
    this.http.get<any>(this.baseUrl + 'api/reviews/' + this.news_data.id, { 'headers': headers })
      .subscribe(data => {
        this.loading=false
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data.data;
        this.review = this.res.review
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
    formdata.append('review', this.form.value.review)
    if (this.image_upload != undefined) {
      formdata.append('image', this.image_upload)
    }

    this.http.post<any>(this.baseUrl + 'api/update_review/' + this.news_data.id, formdata, { 'headers': headers })
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
          this.url = false;
          this.form_type = ''
          this.form.reset()
          this.getReviewsList(this.page.offset + 1)

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
  getReviewsList(page: any) {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.loading=true
    this.http.get<any>(this.baseUrl + 'api/reviews?rows=10&page=' + page+ '&search=' + this.search, { 'headers': headers })
      .subscribe(data => {
        this.loading=false
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data;
        this.newsList = this.res.data
        this.page.count = this.res.meta.pagination.total
        this.page.limit = this.res.meta.pagination.per_page
        console.log('newsList', this.newsList)
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
  updateFilter(event: any) {
    console.log('event', event.target.value)
    this.search= event.target.value
    this.getReviewsList(this.page.offset+1)
  }
  datatablePageData(pageInfo: { count?: number, pageSize?: number, limit?: number, offset?: number }) {
    this.page.offset = pageInfo.offset
    this.getReviewsList(this.page.offset + 1)
  }
  open(content: any, type: any, data: any) {
    this.news_data = data
    if (type == 'edit') {
      this.form_type = 'edit'
      this.edit()
    } else {
      this.submitted = false
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  changeStatus(item, status) {
    console.log('Item', item)
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.loading=true
    let formdata = new FormData()
    formdata.append('id', item.id)
    formdata.append('status', status)
    this.http.post<any>(this.baseUrl + 'api/review_status', formdata, { 'headers': headers })
      .subscribe(
        response => {
          this.loading=false
          this.data = response
          console.log("Data" + this.data);
          if (this.data.success == true) {
            this.toster.success(this.data.message);
          }
          this.getReviewsList(this.page.offset + 1)
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
  close() {
    this.modalService.dismissAll()
    this.form.reset()
  }
  delete() {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.loading=true
    let formdata = new FormData()
    formdata.append('id', this.news_data.id)
    this.http.post<any>(this.baseUrl + 'api/delete', formdata, { 'headers': headers })
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
          this.form.reset()
          this.getReviewsList(this.page.offset + 1)
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
