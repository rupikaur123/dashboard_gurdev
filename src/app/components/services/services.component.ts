import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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
  image: any = ''
  description: any = ''
  alies_name: any = ''
  url: any; //Angular 11, for stricter type
  msg = "";
  user_data: any
  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    image: new FormControl(''),
    description: new FormControl(''),
    alies_name: new FormControl('')

  });
  submitted = false;
  form_type: any
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  baseUrl: any = 'http://api.gurdevhospital.co/'
  res: any = ''
  data: any
  image_upload: any
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public http: HttpClient, public toster: ToastrService) { }

  ngOnInit() {
    this.userList = []
    this.userForm()
    this.token = localStorage.getItem('token')
    this.getServiceList()
  }

  getServiceList() {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.http.get<any>(this.baseUrl + 'api/services', { 'headers': headers })
      .subscribe(data => {
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data.data;
        this.userList = this.res
        console.log('UserList', this.userList)
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

  userForm() {
    this.form = this.formBuilder.group(
      {
        name: [
          this.serviceName,
          [
            Validators.required,
            Validators.minLength(4),
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
          this.image,
          [
            Validators.required,
          ]
        ],
        alies_name: [
          this.alies_name,
          [
            Validators.required,
            Validators.minLength(4),
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
        formdata.append('name', this.form.value.name)
        formdata.append('description', this.form.value.description)
        formdata.append('alies_name', this.form.value.alies_name)
        formdata.append('image', this.image_upload)
        this.http.post<any>(this.baseUrl + 'api/services', formdata, { 'headers': headers })
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
              this.getServiceList()
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
    this.http.get<any>(this.baseUrl + 'api/services/' + this.user_data.id + '/edit', { 'headers': headers })
      .subscribe(data => {
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data.data;
        this.serviceName = this.res.name
        this.description = this.res.description
        this.alies_name = this.res.alies_name
        // this.image = this.res.image
        console.log('UserList', this.res)
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
    formdata.append('name', this.form.value.name)
    formdata.append('description', this.form.value.description)
    formdata.append('alies_name', this.form.value.alies_name)
    if (this.image_upload != undefined) {
      formdata.append('image', this.image_upload)
    }

    formdata.append('_method', 'PATCH')
    this.http.post<any>(this.baseUrl + 'api/services/' + this.user_data.id, formdata, { 'headers': headers })
      .subscribe(
        response => {
          this.data = response
          console.log("Data" + this.data);
          if (this.data.success == true) {
            this.toster.success(this.data.message);
          }
          this.modalService.dismissAll()
          this.submitted = false;
          this.getServiceList()
          this.form_type = ''
          this.form.reset()
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
  open(content: any, type: any, data: any) {
    this.user_data = data
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
      this.url = reader.result;
      this.image_upload = event.target.files[0]
      console.log('URL', this.image_upload)
    }
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

  changeStatus(item) {
    console.log('Item', item)
    const headers = { 'Authorization': 'Bearer ' + this.token }
    let formdata = new FormData()
    formdata.append('id', item.id)
    formdata.append('status', item.status)
    this.http.post<any>(this.baseUrl + 'api/services_status', formdata, { 'headers': headers })
      .subscribe(
        response => {
          this.data = response
          console.log("Data" + this.data);
          if (this.data.success == true) {
            this.toster.success(this.data.message);
          }
          this.getServiceList()
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
