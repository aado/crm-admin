import { Injectable } from '@angular/core';
import { Headers, BaseRequestOptions, Http, Response, RequestOptions } from '@angular/http';
import { ConfigService } from '../../../shared/config.service';
import { Observable } from 'rxjs/Observable';
// import { AppSettings } from '../../../app.setting';
import { LocalStorageService } from 'ng2-webstorage';

@Injectable()
export class HeaderService {
  // Resolve HTTP using the constructor
  AppSettings;
  constructor(private http: Http, private localStorageService: LocalStorageService, public configService: ConfigService) { }

  checkConfigJson(callback) {
    if (this.configService.config) {
      this.AppSettings = this.configService.config;
      return callback();
    }
    return this.configService.loadConfiguration().mergeMap(() => {
      this.AppSettings = this.configService.config;
      return callback();
    });
  }

  getLogout(): Observable<Response> {
    let url = 'app/admin/logout';
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'jwt': this.localStorageService.retrieve('token')
    });

    let option = new RequestOptions({ headers: headers });

    return this.checkConfigJson(() => {
      return this.http.get(this.AppSettings['API_ENDPOINT'] + url, option).map((res: Response) => res.json());
    });
  }

  getInformation(): Observable<Response> {
    let url = 'app/admin/notification';
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'jwt': this.localStorageService.retrieve('token')
    });

    let option = new RequestOptions({ headers: headers });
    return this.checkConfigJson(() => {
      return this.http.get(this.AppSettings['API_ENDPOINT'] + url, option).map((res: Response) => res.json());
    });
  }

  getProfile(): Observable<Response> {
    let url = 'app/admin/profile';
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'jwt': this.localStorageService.retrieve('token')
    });

    let option = new RequestOptions({ headers: headers });

    return this.checkConfigJson(() => {
      return this.http.get(this.AppSettings['API_ENDPOINT'] + url, option).map((res: Response) => res.json());
    });
  }
}
