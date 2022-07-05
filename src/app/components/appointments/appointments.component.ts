import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  public focus;
  apptList: any = []
  searchUser: any
  closeResult: string = '';
  apptName: any = ''
  apptDate: any = ''
  fullName: any = ''
  email: any = ''
  dob: any = ''
  address: any = ''
  phone_no: any = ''
  comment: any = ''
  form: FormGroup = new FormGroup({
    apptName: new FormControl(''),
    apptDate: new FormControl(''),
    fullName: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    phone_no: new FormControl(''),
    comment: new FormControl(''),
    dob: new FormControl('')

  });
  submitted = false;
  res: any
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  token: any = ''
  baseUrl: any = 'http://api.gurdevhospital.co/'
  appt_data: any
  data: any
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public http: HttpClient, public toster: ToastrService) { }

  ngOnInit() {
    this.token = localStorage.getItem('token')
    this.apptList = [{ 'name': 'test', 'status': 'Active' }, { 'name': 'Sham', 'status': 'Inactive' }, { 'name': 'test', 'status': 'Active' }, { 'name': 'Sham', 'status': 'Inactive' }, { 'name': 'test', 'status': 'Active' }, { 'name': 'Sham', 'status': 'Inactive' }, { 'name': 'test', 'status': 'Active' }, { 'name': 'Sham', 'status': 'Inactive' }, { 'name': 'test', 'status': 'Active' }, { 'name': 'Sham', 'status': 'Inactive' }]
    this.userForm()
    this.getApptList()
  }

  userForm() {
    this.form = this.formBuilder.group(
      {
        apptName: [
          this.apptName,
          [
            Validators.required,
            Validators.minLength(4),
          ]
        ],
        apptDate: [
          this.apptDate,
          [
            Validators.required,

          ]
        ],
        dob: [
          this.dob,
          [
            Validators.required,

          ]
        ],
        fullName: [
          this.fullName,
          [
            Validators.required
          ]
        ],
        email: [
          this.email,
          [
            Validators.required,

          ]
        ],
        address: [
          this.address,
          [
            Validators.required
          ]
        ],
        phone_no
          : [
            this.phone_no,
            [
              Validators.required,

            ]
          ],
        comment: [
          this.comment,
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

  getApptList() {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.http.get<any>(this.baseUrl + 'api/appointments', { 'headers': headers })
      .subscribe(data => {
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data.data;
        this.apptList = this.res
        console.log('appList', this.apptList)
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
  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.modalService.dismissAll()
    this.submitted = false;
    this.form.reset()
  }

  open(content: any, type: any, data: any) {
    this.appt_data = data
    if (type == 'edit') {
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
  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  edit() {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.http.get<any>(this.baseUrl + 'api/appointments/' + this.appt_data.id, { 'headers': headers })
      .subscribe(data => {
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data.data;
        this.apptDate = this.res.appointment_date
        this.apptName = this.res.service_name
        this.fullName = this.res.u_full_name
        this.email = this.res.u_email
        this.dob = this.res.u_dob
        this.address = this.res.u_address
        this.phone_no = this.res.u_phone_number
        this.comment = this.res.comment
        console.log('NewsList', this.res)
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
}
