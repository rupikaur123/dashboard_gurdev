import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {

  public focus;
  doctorList: any = []
  search: any = ''
  closeResult: string = '';
  serviceName: any = ''
  token: any
  url: any = false; //Angular 11, for stricter type
  msg = "";
  submitted = false;
  baseUrl: any = 'http://api.gurdevhospital.co/'
  res: any = ''
  data: any
  loading=false
  image_upload: any
  page = {
    limit: 10,
    count: 0,
    offset: 0,
    pageSize: 10
  };
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public http: HttpClient, public toster: ToastrService, private router: Router) { }

  ngOnInit() {
    this.doctorList = []
    this.token = localStorage.getItem('token')
    this.getDoctorList(this.page.offset + 1)
  }

  getDoctorList(page: any) {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.loading=true
    this.http.get<any>(this.baseUrl + 'api/doctors?rows=10&page=' + page + '&search=' + this.search, { 'headers': headers })
      .subscribe(data => {
        this.loading=false
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data;
        this.doctorList = this.res.data
        this.page.count = this.res.meta.pagination.total
        this.page.limit = this.res.meta.pagination.per_page
        console.log('doctorList', this.doctorList)
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
    this.search = event.target.value
    this.getDoctorList(this.page.offset + 1)
  }
  datatablePageData(pageInfo: { count?: number, pageSize?: number, limit?: number, offset?: number }) {
    this.page.offset = pageInfo.offset
    this.getDoctorList(this.page.offset + 1)
  }
  open(content: any, type: any, data: any) {
    if (type == 'edit') {
      this.router.navigate(['dashboard/add/doctor/' + data.id])
    } else {
      this.router.navigate(['dashboard/add/doctor'])
    }
  }
  changeStatus(item, status) {
    console.log('Item', item)
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.loading=true
    let formdata = new FormData()
    formdata.append('id', item.id)
    formdata.append('status', status)
    this.http.post<any>(this.baseUrl + 'api/change_doctor_status', formdata, { 'headers': headers })
      .subscribe(
        response => {
          this.loading=false
          this.data = response
          console.log("Data" + this.data);
          if (this.data.success == true) {
            this.toster.success(this.data.message);
          }
          this.getDoctorList(this.page.offset + 1)
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
