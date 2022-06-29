import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  public focus;
  userList: any = []
  searchUser: any
  closeResult: string = '';
  apptName: any = ''
  form: FormGroup = new FormGroup({
    apptName: new FormControl(''),

  });
  submitted = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.userList = [{ 'name': 'test', 'status': 'Active' }, { 'name': 'Sham', 'status': 'Inactive' }, { 'name': 'test', 'status': 'Active' }, { 'name': 'Sham', 'status': 'Inactive' }, { 'name': 'test', 'status': 'Active' }, { 'name': 'Sham', 'status': 'Inactive' }, { 'name': 'test', 'status': 'Active' }, { 'name': 'Sham', 'status': 'Inactive' }, { 'name': 'test', 'status': 'Active' }, { 'name': 'Sham', 'status': 'Inactive' }]
    this.userForm()
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
        ]
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    // console.log(JSON.stringify(this.form.value, null, 2));
    this.modalService.dismissAll()
    this.submitted = false;
    this.form.reset()
  }

  open(content: any, type: any, data: any) {
    if (type == 'edit') {
      this.apptName = data.name
      console.log('^^',this.apptName)
    } else {
      this.submitted = false
      this.form.reset()
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    if (type == 'edit') {
      this.userForm()
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
}
