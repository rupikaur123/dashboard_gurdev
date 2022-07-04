import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';



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
  image_upload: any
  url: any; //Angular 11, for stricter type
  msg = "";
  baseUrl: any = 'http://api.gurdevhospital.co/'
  form: FormGroup = new FormGroup({
    image: new FormControl(''),
  });
  submitted = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  token:any
  data:any
  res:any
  gallery_data:any
  public editorValue: string = '';
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,public http: HttpClient, public toster: ToastrService) { }
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
    }
  }
  ngOnInit() {
    this.token = localStorage.getItem('token')
    this.list = []
    this.listForm()
    this.getGalleryList()
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
    console.log('Date',this.form.value)
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    else {
   
        const headers = { 'Authorization': 'Bearer ' + this.token }
        let formdata = new FormData()
        formdata.append('image', this.image_upload)
        this.http.post<any>(this.baseUrl + 'api/add_gallery_img', formdata, { 'headers': headers })
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
              this.getGalleryList()
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

getGalleryList() {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.http.get<any>(this.baseUrl + 'api/gallery_list', { 'headers': headers })
      .subscribe(data => {
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data.data;
        this.list = this.res
        console.log('list', this.list)
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
    if (type == 'delete') {
     this.gallery_data = data
      console.log('^^', this.gallery_data)
    } else {
      this.submitted = false
      this.form.reset()
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
  changeStatus(item) {
    console.log('Item', item)
    const headers = { 'Authorization': 'Bearer ' + this.token }
    let formdata = new FormData()
    formdata.append('id', item.id)
    formdata.append('status', item.status)
    this.http.post<any>(this.baseUrl + 'api/change_status_gallery', formdata, { 'headers': headers })
      .subscribe(
        response => {
          this.data = response
          console.log("Data" + this.data);
          if (this.data.success == true) {
            this.toster.success(this.data.message);
          }
          this.getGalleryList()
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
  delete(){
    
    const headers = { 'Authorization': 'Bearer ' + this.token }
    let formdata = new FormData()
    formdata.append('id', this.gallery_data.id)
    this.http.post<any>(this.baseUrl + 'api/delete_gallery_img', formdata, { 'headers': headers })
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
          this.getGalleryList()
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
