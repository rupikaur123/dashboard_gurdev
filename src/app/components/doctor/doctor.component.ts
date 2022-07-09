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
  searchUser: any
  closeResult: string = '';
  serviceName: any = ''
  token: any
  url: any = false; //Angular 11, for stricter type
  msg = "";
  submitted = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  baseUrl: any = 'http://api.gurdevhospital.co/'
  res: any = ''
  data: any
  image_upload: any
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public http: HttpClient, public toster: ToastrService, private router: Router) { }

  ngOnInit() {
    this.doctorList = []
    this.token = localStorage.getItem('token')
    this.getDoctorList()
  }

  getDoctorList() {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.http.get<any>(this.baseUrl + 'api/doctors', { 'headers': headers })
      .subscribe(data => {
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data.data;
        this.doctorList = this.res
        console.log('doctorList', this.doctorList)
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
      this.router.navigate(['dashboard/add/doctor/' + data.id])
    } else {
      this.router.navigate(['dashboard/add/doctor'])
    }
  }


  onTableDataChange(event: any) {
    this.page = event;
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  changeStatus(item, status) {
    console.log('Item', item)
    const headers = { 'Authorization': 'Bearer ' + this.token }
    let formdata = new FormData()
    formdata.append('id', item.id)
    formdata.append('status', status)
    this.http.post<any>(this.baseUrl + 'api/change_doctor_status', formdata, { 'headers': headers })
      .subscribe(
        response => {
          this.data = response
          console.log("Data" + this.data);
          if (this.data.success == true) {
            this.toster.success(this.data.message);
          }
          this.getDoctorList()
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