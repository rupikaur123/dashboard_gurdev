import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';



@Component({
  selector: 'app-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.scss']
})
export class StaticPagesComponent implements OnInit {

  public focus;
  searchUser: any
  newsList: any = []
  baseUrl: any = 'http://api.gurdevhospital.co/'
  token: any = ''
  data: any
  res: any
  page = {
    limit: 10,
    count: 0,
    offset: 0,
    pageSize: 10
  };

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public http: HttpClient, public toster: ToastrService, private router: Router) {
  }

  ngOnInit() {
    this.token = localStorage.getItem('token')
    this.getReviewsList(this.page.offset + 1)
  }


  getReviewsList(page: any) {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.http.get<any>(this.baseUrl + 'api/static_pages?rows=10&page=' + page, { 'headers': headers })
      .subscribe(data => {
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data;
        this.newsList = this.res.data
        this.page.count = this.res.meta.pagination.total
        this.page.limit = this.res.meta.pagination.per_page
        console.log('newsList', this.newsList)
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
  open(content: any, type: any, data: any) {
    if (type == 'edit') {
      this.router.navigate(['dashboard/add/page/' + data.id])
    } else {
      this.router.navigate(['dashboard/add/page'])
    }

  }

  updateFilter(event: any) {
    console.log('event', event.target.value)
  }
  changeStatus(item, status) {
    console.log('Item', item)
    const headers = { 'Authorization': 'Bearer ' + this.token }
    let formdata = new FormData()
    formdata.append('id', item.id)
    formdata.append('status', status)
    this.http.post<any>(this.baseUrl + 'api/review_status', formdata, { 'headers': headers })
      .subscribe(
        response => {
          this.data = response
          console.log("Data" + this.data);
          if (this.data.success == true) {
            this.toster.success(this.data.message);
          }
          this.getReviewsList(this.page.offset + 1)
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
  datatablePageData(pageInfo: { count?: number, pageSize?: number, limit?: number, offset?: number }) {
    this.page.offset = pageInfo.offset
    this.getReviewsList(this.page.offset + 1)
  }
}
