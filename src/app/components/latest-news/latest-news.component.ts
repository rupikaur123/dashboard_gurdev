import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-latest-news',
  templateUrl: './latest-news.component.html',
  styleUrls: ['./latest-news.component.scss']
})
export class LatestNewsComponent implements OnInit {

  public focus;
  newsList: any = []
  searchUser: any
  closeResult: string = '';
  title: any = ''
  content: any = ''
  image: any = ''
  
  url: any; //Angular 11, for stricter type
  msg = "";
  date: NgbDateStruct;
  form: FormGroup = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
    image: new FormControl(''),
    date: new FormControl(''),

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
    this.newsList = [{ 'title': 'Test', 'content': 'this is testing', 'image': '', 'date': '2022-06-17', 'status': 'Active' },
    { 'title': 'About Us', 'content': 'this is testing', 'image': '', 'date': '2022-06-17', 'status': 'Active' },
    { 'title': 'Abc', 'content': 'this is testing', 'image': '', 'date': '2022-06-17', 'status': 'Active' }]
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
      this.title = data.title
      this.content = data.content
      this.image = data.image
      this.date = data.date
      console.log('^^', this.date)
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
      this.newsForm()
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
