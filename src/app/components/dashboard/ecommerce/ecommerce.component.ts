import { Component, OnInit } from '@angular/core';
import * as chartData from '../../../shared/data/dashboard/ecommerce'
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss']
})
export class EcommerceComponent implements OnInit {
  dashboardList: any
  res: any
  baseUrl: any = 'http://api.gurdevhospital.co/'
  token: any = ''
  searchUser: any
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  constructor(public http: HttpClient, public toster: ToastrService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token')
    this.getDashboardList()
  }
  getDashboardList() {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.http.get<any>(this.baseUrl + 'api/dashboard', { 'headers': headers })
      .subscribe(data => {
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data.data;
        this.dashboardList = this.res
        console.log('dashboardList', this.dashboardList)
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
  onTableDataChange(event: any) {
    this.page = event;
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }
}
