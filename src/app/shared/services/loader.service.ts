import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoaderService {
  private showLoader: boolean = true;

  constructor() { }
  public setLoaderValue(flag) { 
    console.log('service',flag)
    this.showLoader = flag;
  }
  public getLoaderValue(): boolean {
    return this.showLoader;
  }
}
