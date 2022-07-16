import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  public focus;
  userList: any = []
  searchUser: any
  closeResult: string = '';
  serviceName: any = ''
  token: any
  url: any = false; //Angular 11, for stricter type
  msg = "";
  submitted = false;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  baseUrl: any = 'http://api.gurdevhospital.co/'
  res: any = ''
  data: any
  image_upload: any
  per_page: any
  total_count: any
  page = {
    limit: 10,
    count: 0,
    offset: 0,
    pageSize: 10
  };
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public http: HttpClient, public toster: ToastrService, private router: Router) { }

  ngOnInit() {
    this.userList = []
    this.token = localStorage.getItem('token')
    this.getServiceList(this.page.offset + 1)
  }

  getServiceList(page: any) {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.http.get<any>(this.baseUrl + 'api/services?rows=10&page=' + page, { 'headers': headers })
      .subscribe(data => {
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data;
        this.userList = this.res.data
        this.page.count = this.res.meta.pagination.total
        this.page.limit = this.res.meta.pagination.per_page
        console.log('UserList', this.userList, this.total_count, this.per_page)
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
      this.router.navigate(['dashboard/add/service/' + data.id])
    } else {
      this.router.navigate(['dashboard/add/service'])
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
    this.http.post<any>(this.baseUrl + 'api/services_status', formdata, { 'headers': headers })
      .subscribe(
        response => {
          this.data = response
          console.log("Data" + this.data);
          if (this.data.success == true) {
            this.toster.success(this.data.message);
          }
          this.getServiceList(this.page.offset + 1)
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
    this.getServiceList(this.page.offset + 1)
  }
}
