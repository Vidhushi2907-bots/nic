import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MasterService } from '../services/master/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private cookieService: CookieService, private master: MasterService) { }

  ngOnInit(): void {
    let token = this.cookieService.get('token');
    console.log("tokentoken1111111111", token)
    let href = this.router.url;
    console.log("hrefhrefhref", href, window.location.origin);
    this.master
      .loginRequest("validate-user", token)
      .subscribe((apiResponse: any) => {
        console.log("apiResponse", apiResponse)

        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          const data = apiResponse.EncryptedResponse.data;
          localStorage.setItem('BHTCurrentUser', JSON.stringify(data));
          localStorage.setItem('username', data.user_type);
          // this.router.navigate(['events']);
          console.log('data', data)
          // this.currentUserSubject.next(user.EncryptedResponse.data);
          if (!data.is_change_password) {
            switch (data.user_type) {
              case 'SD': {
                this.router.navigate(['change-password'])
                break;
              }
              case 'PULSESSEEDADMIN': {
                this.router.navigate(['change-password'])
                break;
              }
              case 'SPP': {
                this.router.navigate(['change-password'])
                break;
              }
              case 'PULSESSEEDADMIN': {
                // this.router.navigate(['recieved-indent-oil-seed'])
                this.router.navigate(['change-password'])
                break;
              }
              case 'SUPERADMIN': {
                // this.router.navigate(['recieved-indent-oil-seed'])
                this.router.navigate(['change-password'])
                break;
              }
              case 'ICAR': {
                this.router.navigate(['change-password'])
                break;
              }
              case 'HICAR': {
                this.router.navigate(['change-password'])
                break;
              }
              case 'IN': {
                // this.router.navigateByUrl('/indentor-seed-dashboard').then(() => {
                //   window.location.reload();
                // });
                this.router.navigate(['change-password'])
                break;
              }
              case 'BR': {
                this.router.navigate(['change-password'])
                // this.router.navigate(['indent-breeder-seed-allocation-list'])
                break;
              } case 'BPC': {
                this.router.navigate(['change-password'])
                break;
              }
              case 'SPA': {
                this.router.navigate(['change-password'])
                break;
              }

              default: {
                this.router.navigate(['login'])
                break;
              }
            }

          } else {
            console.log('data.user_type====', data.user_type);
            switch (data.user_type) {
              case 'SD': {
                // this.router.navigate(['dashboardSeedSecond'])
                this.router.navigate(['dashboard-phase-second']);
                break;
              }
              case 'SPP': {
                this.router.navigate(['spp-dashboard'])
                break;
              }
              case 'OILSEEDADMIN': {
                // this.router.navigate(['recieved-indent-oil-seed'])
                this.router.navigate(['dashboard-phase-second'])
                break;
              }
              case 'PULSESSEEDADMIN': {
                // this.router.navigate(['recieved-indent-oil-seed'])
                this.router.navigate(['dashboard-phase-second'])
                break;
              }
              case 'SUPERADMIN': {
                // this.router.navigate(['recieved-indent-oil-seed'])
                this.router.navigate(['dashboard-phase-second'])
                break;
              }
              case 'ICAR': {
                // this.router.navigate(['nodal-dasboard-seconds'])
                this.router.navigate(['dashboard-phase-second'])
                break;
              }
              case 'HICAR': {
                // this.router.navigate(['nodal-dasboard-seconds'])
                this.router.navigate(['dashboard-phase-second'])
                break;
              }
              case 'IN': {
                // this.router.navigate(['indentor-seed-dashboard'])
                this.router.navigate(['dashboard-phase-second'])
                break;
              }
              case 'BR': {
                this.router.navigate(['breeder-dashboard'])
                // this.router.navigate(['indent-breeder-seed-allocation-list'])
                break;
              } case 'BPC': {
                this.router.navigate(['bsp-dashboard-second'])
                break;
              }
              case 'SPA': {
                this.router.navigate(['indent-breeder-seed-allocation-list'])
                break;
              }

              default: {
                this.router.navigate(['login'])
                break;
              }
            }
          }
        } else {
          Swal.fire({
            title: '<p style="font-size:25px;">Invalid credentails, redirect to login page.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          }).then(result => {
            if (result.isConfirmed) {
              switch (window.location.origin) {
                case 'https://seedtrace.gov.in': {
                  window.location.href = 'https://seedtrace.gov.in/ms014/login?stateCode=CENTRAL';
                  break;
                }
                default: {
                  window.location.href = window.location.origin;
                  break;
                }
              }
              // window.location.href = 'http://sathi.nic.in/ms014';

            }
          })
        }
      });
  }
}

