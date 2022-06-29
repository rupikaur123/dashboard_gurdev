import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss']
})
export class TermsConditionComponent implements OnInit {
  title: any
  content: any
  url: any; //Angular 11, for stricter type
  msg = "";
  closeResult: string = '';
  public editorValue: string = ''
  form: FormGroup = new FormGroup({
    title: new FormControl(''),
    content: new FormControl('')


  });
  submitted = false;
  constructor(private formBuilder: FormBuilder, private router: Router) {

  }

  //selectFile(event) { //Angular 8
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
    this.aboutForm()
  }

  aboutForm() {
    this.form = this.formBuilder.group(
      {
        title: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
          ]
        ],
        content: [
          '',
          [
            Validators.required
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
    else {
      this.router.navigate(['dashboard/ecommerce'])
    }
    // console.log(JSON.stringify(this.form.value, null, 2));
    this.submitted = false;
    this.form.reset()
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

}
