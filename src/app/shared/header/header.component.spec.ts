import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { LocalStorageService } from 'ng2-webstorage';
import { HeaderService } from './shared/header.service';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { Headers, BaseRequestOptions, Http, Response, HttpModule } from '@angular/http';
import { ConfigService } from '../../shared/config.service';
import { LoginService } from '../../login/shared/login.service';
import { LoginModel } from '../../login/shared/login.model';
import { Observable } from 'rxjs/Observable';

import { HeaderComponent } from './header.component';

let userLogin = new LoginModel();
userLogin.email = "administrator@secure.janeto.com";
userLogin.password = "janeto"

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  // let loginServiceStub = {};

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent
      ],
      imports: [
        HttpModule
      ],
      providers: [
        LocalStorageService,
        HeaderService,
        ConfigService,
        LoginService,
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    setTimeout(() => {
      done();
    }, 1000);
  });

  it('log out success', (done) => {
    let loginService = TestBed.get(LoginService) as LoginService;
    let localStorageService = TestBed.get(LocalStorageService) as LocalStorageService;

    loginService.submit(userLogin).subscribe(
      (res) => {
        localStorageService.store("token", res["token"]);
        component.logout();
        setTimeout(() => {
          expect(localStorageService.retrieve("token")).toBeNull();
          done();
        }, 500)
      }
    )
  });

  it('log out not success', (done) => {
    let localStorageService = TestBed.get(LocalStorageService) as LocalStorageService;
    localStorageService.store("token", "asdklsjakldjsakldajiskldsa");
    component.logout();
    setTimeout(() => {
      expect(localStorageService.retrieve("token")).toBeDefined();
      done();
    }, 500)
  })

  it('get information success show popup', async(() => {
    fixture.detectChanges();
    let localStorageService = TestBed.get(LocalStorageService) as LocalStorageService;
    let loginService = TestBed.get(LoginService) as LoginService;
    fixture.detectChanges();
    loginService.submit(userLogin).subscribe(
      (res) => {
        localStorageService.store("token", res["token"]);
        component.getInformation();
        setTimeout(() => {
          expect(fixture.debugElement.query(By.css(".information-notication"))).toBeDefined();
        }, 500)
      }
    )
  }))
  it('get information success show popup with data', async(() => {
    fixture.detectChanges();
    let localStorageService = TestBed.get(LocalStorageService) as LocalStorageService;
    let loginService = TestBed.get(LoginService) as LoginService;
    fixture.detectChanges();
    loginService.submit(userLogin).subscribe(
      (res) => {
        localStorageService.store("token", res["token"]);
        fixture.debugElement.query(By.css('#informationIcon')).nativeElement.click();
        fixture.whenStable().then(() => {
          setTimeout(() => {
            let array = (component.dormitoryReservations).concat(component.otherReservations);
            expect(fixture.debugElement.queryAll(By.css(".information-item")).length).toEqual(array.length);
          }, 500)
        })
      }
    )
  }));
  it('get user profile success', async(() => {
    fixture.detectChanges();
    let localStorageService = TestBed.get(LocalStorageService) as LocalStorageService;
    let loginService = TestBed.get(LoginService) as LoginService;
    fixture.detectChanges();
    loginService.submit(userLogin).subscribe(
      (res) => {
        localStorageService.store("token", res["token"]);
        component.getProfile();
        setTimeout(() => {
          let lableEle = fixture.debugElement.query(By.css('#user-name')).nativeElement;
          expect(localStorageService.retrieve("user")).toBeDefined();
        }, 500)
      }
    )
  }))
});
