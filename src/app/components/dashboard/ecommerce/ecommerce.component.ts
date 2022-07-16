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
  page = {
    limit: 10,
    count: 0,
    offset: 0,
    pageSize: 10
  };
  constructor(public http: HttpClient, public toster: ToastrService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token')
    this.getDashboardList(this.page.offset + 1)
  }
  updateFilter(event: any) {
    console.log('event', event.target.value)
  }
  datatablePageData(pageInfo: { count?: number, pageSize?: number, limit?: number, offset?: number }) {
    this.page.offset = pageInfo.offset
    this.getDashboardList(this.page.offset + 1)
  }
  getDashboardList(page: any) {
    const headers = { 'Authorization': 'Bearer ' + this.token }
    this.http.get<any>(this.baseUrl + 'api/dashboard?rows=10&page=' + page, { 'headers': headers })
      .subscribe(data => {
        console.log("Get completed sucessfully. The response received " + data);
        this.res = data;
        this.dashboardList = this.res.data
        this.page.count = this.dashboardList.latest_news.length
        this.page.limit = 10
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
}
