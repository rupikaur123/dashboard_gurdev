import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './default/default.component';
import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { ServicesComponent } from '../services/services.component'
import { AppointmentsComponent } from '../appointments/appointments.component'
import { AboutComponent } from '../about/about.component'
import { PrivacyComponent } from '../privacy/privacy.component'
import { TermsConditionComponent } from '../terms-condition/terms-condition.component'
import { ContactUsComponent } from '../contact-us/contact-us.component'
import { LatestNewsComponent } from '../latest-news/latest-news.component'
import { ImageGalleryComponent } from '../image-gallery/image-gallery.component'
import { ReviewsComponent } from '../reviews/reviews.component'
import { StaticPagesComponent } from '../static-pages/static-pages.component'
import { AddServicesComponent } from '../add-services/add-services.component'
import { AddNewsComponent } from '../add-news/add-news.component'
import { AddStaticPagesComponent } from '../add-static-page/add-static-page.component'
import { AddDoctorComponent } from '../add-doctor/add-doctor.component'
import { DoctorComponent } from '../doctor/doctor.component'


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'default',
        component: DefaultComponent
      },
      {
        path: 'ecommerce',
        component: EcommerceComponent
      },
      {
        path: 'service',
        component: ServicesComponent
      },
      {
        path: 'appointments',
        component: AppointmentsComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'privacy',
        component: PrivacyComponent
      },
      {
        path: 'terms-condition',
        component: TermsConditionComponent
      },
      {
        path: 'contact-us',
        component: ContactUsComponent
      },
      {
        path: 'latest-news',
        component: LatestNewsComponent
      },
      {
        path: 'gallery',
        component: ImageGalleryComponent
      }, {
        path: 'reviews',
        component: ReviewsComponent
      },
      {
        path: 'static',
        component: StaticPagesComponent
      },
      {
        path: 'add/service',
        component: AddServicesComponent
      },
      {
        path: 'add/service/:id',
        component: AddServicesComponent
      },
      {
        path: 'add/news',
        component: AddNewsComponent
      },
      {
        path: 'add/news/:id',
        component: AddNewsComponent
      }, {
        path: 'add/page',
        component: AddStaticPagesComponent
      }, {
        path: 'add/page/:id',
        component: AddStaticPagesComponent
      },
      {
        path: 'add/doctor',
        component: AddDoctorComponent
      },
      {
        path: 'add/doctor/:id',
        component: AddDoctorComponent
      }, {
        path: 'doctor',
        component: DoctorComponent
      }
    ],
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
