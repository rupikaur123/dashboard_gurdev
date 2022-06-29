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
import {PrivacyComponent} from '../privacy/privacy.component'
import {TermsConditionComponent} from '../terms-condition/terms-condition.component'
import {ContactUsComponent} from '../contact-us/contact-us.component'
import {LatestNewsComponent} from '../latest-news/latest-news.component'
import { AngularEditorModule } from '@kolkov/angular-editor';
import {ImageGalleryComponent} from '../image-gallery/image-gallery.component'

@NgModule({
  declarations: [DefaultComponent, EcommerceComponent, ServicesComponent, AppointmentsComponent, AboutComponent,PrivacyComponent,TermsConditionComponent,ContactUsComponent,LatestNewsComponent,ImageGalleryComponent],
  imports: [
    CommonModule,
    ChartistModule,
    ChartsModule,
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
    AgmCoreModule.forRoot({
      apiKey: ''
    }),
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
