import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CountToModule } from 'angular-count-to';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { DefaultComponent } from './default/default.component';
import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ServicesComponent } from '../services/services.component'
import { AppointmentsComponent } from '../appointments/appointments.component'
import { NgxPaginationModule } from 'ngx-pagination';
import { AboutComponent } from '../about/about.component'
import { PrivacyComponent } from '../privacy/privacy.component'
import { TermsConditionComponent } from '../terms-condition/terms-condition.component'
import { ContactUsComponent } from '../contact-us/contact-us.component'
import { LatestNewsComponent } from '../latest-news/latest-news.component'
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ImageGalleryComponent } from '../image-gallery/image-gallery.component'
import { HttpClientModule } from '@angular/common/http';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input'
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ReviewsComponent } from '../reviews/reviews.component'
import {StaticPagesComponent} from '../static-pages/static-pages.component'
import { AddServicesComponent} from '../add-services/add-services.component'
import {AddNewsComponent} from '../add-news/add-news.component'
import {AddStaticPagesComponent} from '../add-static-page/add-static-page.component'

@NgModule({
  declarations: [DefaultComponent, EcommerceComponent, ServicesComponent, AppointmentsComponent, AboutComponent, PrivacyComponent, TermsConditionComponent, ContactUsComponent, LatestNewsComponent, ImageGalleryComponent, ReviewsComponent,StaticPagesComponent,AddServicesComponent,AddNewsComponent,AddStaticPagesComponent],
  imports: [
    CommonModule,
    ChartistModule,
    ChartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    NgApexchartsModule,
    SharedModule,
    CarouselModule,
    CKEditorModule,
    CountToModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    AngularEditorModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: ''
    }),
    DashboardRoutingModule
  ],
  providers: [BsDatepickerConfig]
})
export class DashboardModule { }
