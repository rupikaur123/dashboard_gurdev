import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';



@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {

  public focus;
  list: any = []
  searchUser: any
  closeResult: string = '';
  image: any = ''
  url: any; //Angular 11, for stricter type
  msg = "";
  form: FormGroup = new FormGroup({
    image: new FormControl(''),
  });
  submitted = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  
  public editorValue: string = '';
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder) { }
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
    }
  }
  ngOnInit() {
    this.list = [{ 'title': 'Test', 'content': 'this is testing', 'image': '', 'date': '2022-06-17', 'status': 'Active' },
    { 'title': 'About Us', 'content': 'this is testing', 'image': '', 'date': '2022-06-17', 'status': 'Active' },
    { 'title': 'Abc', 'content': 'this is testing', 'image': '', 'date': '2022-06-17', 'status': 'Active' }]
    this.listForm()
  }
 
  listForm() {
    this.form = this.formBuilder.group(
      {
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
    console.log(this.form.value);
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
   
    this.modalService.dismissAll()
    this.submitted = false;
    this.form.reset()
  }

  open(content: any, type: any, data: any) {
    if (type == 'edit') {
      this.image = data.image
      console.log('^^', this.image)
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
      this.listForm()
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
