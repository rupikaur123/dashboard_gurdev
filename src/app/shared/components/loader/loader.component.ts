import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader.service'

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  public show: Boolean = true;


  constructor(private loader: LoaderService) {
    console.log('LoaderValue', this.loader.getLoaderValue())
    setTimeout(() => {
      // this.show = this.loader.getLoaderValue();
      this.show = false;
    }, 3000);
  }

  ngOnInit() { }

  ngOnDestroy() { }


}
