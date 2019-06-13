import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import { AppSettings } from '../../app.setting';
import { ConfigService } from '../../shared/config.service';
import { HeaderService } from './shared/header.service';
import {PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  public showMenu = false;
  public showInformation = false;
  public dormitoryReservations = [];
  public otherReservations = [];
  public userProfile: any = {};
  public isAdmin: boolean = false;
  public AppSettings;
  public config = {
    wheelSpeed: 2,
    wheelPropagation: true,
    minScrollbarLength: 20
  };
  public originUrl: String;

  constructor(private headerService: HeaderService,
    private localStorageService: LocalStorageService,
    private router: Router,
    public configService: ConfigService, private platformLocation: PlatformLocation
  ) {
      this.originUrl = (platformLocation as any).location.origin;
  };

  ngOnInit() {
    this.getProfile();
    this.getInformation(false);
    if (this.configService.config) {
      this.AppSettings = this.configService.config;
    } else {
      this.configService.loadConfiguration().subscribe(() => {
        this.AppSettings = this.configService.config;
      });
    }
  }

  public logout() {
    this.headerService.getLogout().subscribe(
      res => {
        this.localStorageService.clear();
        this.router.navigate(['/login']);
      },
      err => {
        this.localStorageService.clear();
        this.router.navigate(['/login']);
      }
    );
  }

  public getProfile() {
    this.headerService.getProfile().subscribe(
      (res) => {
        this.userProfile = res;
        this.localStorageService.store('user', res);

        if (this.userProfile.role && this.userProfile.role.name === this.AppSettings['Role']['Admin']) {
          this.isAdmin = true;
        }
      },
      (error) => {
        if (error.status === 401) {
          alert('Get profile error');
          this.localStorageService.clear();
          this.router.navigate(['/login']);
        }
      }
    );
  }

  public getInformation(isClick: boolean) {
    this.headerService.getInformation().subscribe(
      res => {
        if (isClick) {
          this.showInformation = true;
        }
        this.dormitoryReservations = res['dormitoryReservations'];
        this.dormitoryReservations.forEach(function (e) {
          if (e.memo && e.memo.length > 50) {
            e.memo = e.memo.substring(0, 50) + '...';
          }
        });
        this.otherReservations = res['otherReservations'];
        this.otherReservations.forEach(function (e) {
          if (e.memo && e.memo.length > 50) {
            e.memo = e.memo.substring(0, 50);
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  }
}
