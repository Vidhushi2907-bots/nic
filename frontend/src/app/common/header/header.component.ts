import { ChangeDetectorRef, Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthenticationService } from "../../services/authentication.service";
import { CookieService } from 'ngx-cookie-service';
import { MasterService } from 'src/app/services/master/master.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { Observable } from 'rxjs';

// Define the response interface
// interface UnreadMessagesResponse {
//   status_code: number;
//   data: {
//     unreadCount: number;
//   };
// }

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  today: Date = new Date();
  mobileNumber = "+91 920 554 0267";
  email = "info@sathi.gov.in";
  showSidebar: boolean = true;
  moduleName: any;
  currentUser: any = { id: 10, name: "Hello User" };
  userName: string;
  toggledropdownforlogout = false;
  seednet_token: any;
  loggedInUser: string;
  localStorageData: any;
  currentUrl: string;
  is_change_password: any;
  totalUnreadMessages: number = 0; // Ensure this is a number

  loggedInUserId: number | null = null;

  constructor(
    private cookieService: CookieService,
    private cdRef: ChangeDetectorRef,
    private _productionCenter: ProductioncenterService,
    private masterService: MasterService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private authenticationService: AuthenticationService,
    private encryptionService: EncryptionService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.currentUrl = this.location.path();
  }

  createToken() {
    let token = this.cookieService.get('token');
    const data = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    let seednet_id = data.seednet_id;

    // Encrypt and set token
    token = this.encryptionService.encryption(token);
    let encData = { id: seednet_id, login_token: token };

    this.masterService.postRequestCreator('create-token', null, encData).subscribe(data => {
      let apiResponse = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      if (apiResponse) {
        this.seednet_token = encodeURIComponent(apiResponse); 
        let decryptedData = this.encryptionService.decryption(this.seednet_token);
        console.log("Decrypted encData:", decryptedData);
      }
    });
  }

  ngOnInit(): void {

    this.retrieveLoggedInUserId();
    this.createToken();
    this.getUnreadMessages();
    if (isPlatformBrowser(this.platformId)) {
      const navMain = document.getElementById('navbarCollapse');
      if (navMain) {
        navMain.onclick = function onClick() {
          if (navMain) {
            navMain.classList.remove("show");
          }
        };
      }
    }
    this.getAgencyData();
    let loggedInUser = localStorage.getItem("logined_user");
    let userDataItem = localStorage.getItem("BHTCurrentUser");
    let user_typeData = JSON.parse(userDataItem)
    this.is_change_password = user_typeData.is_change_password
    this.localStorageData = user_typeData

    // let user_typeData = JSON.parse(userDataItem);
    // this.localStorageData = user_typeData;

    if (loggedInUser == 'Seed') {
      this.moduleName = 'Seed Division';
    } else if (['Breeder', 'Co-ordinator', 'Project Co-ordinator', 'BR'].includes(loggedInUser)) {
      this.moduleName = 'Breeder';
    } else if (loggedInUser == 'Indenter') {
      this.moduleName = 'Indenter';
    } else if (loggedInUser == 'productionCenter') {
      this.moduleName = 'Breeder seed Production Centre';
    } else if (loggedInUser == 'ICAR_NODAL') {
      this.moduleName = 'NODAL OFFICER (ICAR)';
    }
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.currentUser.id = userData && userData.id ? userData.id : '';
    this.currentUser.name = userData && userData.name ? userData.name : '';
    let stateName = userData && userData['agency_detail.m_state.state_name'] ? userData['agency_detail.m_state.state_name'].toLowerCase() : '';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.currentUrl = event.url;
        console.log(this.currentUrl, 'window.location.href');
      }
    });
  }

  retrieveLoggedInUserId(): void {
    const storedUser = localStorage.getItem('BHTCurrentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.loggedInUserId = user.id;
        console.log('Logged-in User ID:', this.loggedInUserId);
      } catch (error) {
        console.error('Error parsing stored user data', error);
      }
    } else {
      console.error('Logged-in user data not found in local storage');
    }
  }

  async logout() {
    this.cookieService.deleteAll();
    localStorage.removeItem('state_code');
    this.authenticationService.logout();
  }

  toggleforlogout() {
    this.toggledropdownforlogout = !this.toggledropdownforlogout;
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    this.showPopup(2, event);
    event.stopPropagation();
  }

  opened: any = false;
  showPopup(id, event) {
    if (id == 1) {
      this.opened = true;
      event.stopPropagation();
    } else {
      this.opened = false;
    }
  }

  // getUnreadMessages(): void {
  //   const route = 'get-unread-message-count';
  //   const payload = {
  //     loginedUserid: {
  //       id: this.loggedInUserId
  //     }
  //   };
  //   console.log('Payload for unread messages:', payload);

  //   this._productionCenter.postRequestCreator(route, payload).subscribe(res => {
  //     console.log('API Response:', res); // Log the entire response

  //     if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
  //       const unreadCount = parseInt(res.EncryptedResponse.data.unreadCount, 10); // Ensure it's a number
  //       this.totalUnreadMessages = isNaN(unreadCount) ? 0 : unreadCount; // Handle NaN case
  //       this.cdRef.detectChanges(); // Force Angular to detect changes
  //     } else {
  //       console.error('Failed to fetch unread message count');
  //       this.totalUnreadMessages = 0;
  //     }
  //   }, error => {
  //     console.error('Error fetching unread messages', error);
  //     this.totalUnreadMessages = 0;
  //   });
  // }
  // getUnreadMessages(): void {
  //   const route = 'get-unread-message-count';
  //   const payload = {
  //     loginedUserid: {
  //       id: this.loggedInUserId
  //     }
  //   };

  //   console.log('Payload for unread messages:', payload);

  //   this._productionCenter.postRequestCreator(route, payload).subscribe(res => {
  //     console.log('API Response:', res); // Log the entire response

  //     if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
  //       const unreadCount = parseInt(res.EncryptedResponse.data.unreadCount, 10); // Convert unreadCount to number
  //       this.totalUnreadMessages = unreadCount; 
  //       console.log(this.totalUnreadMessages);

  //       if (!isNaN(unreadCount)) {
  //         this.totalUnreadMessages = unreadCount; // Update totalUnreadMessages
  //       } else {
  //         console.error('Unread count is not a number');
  //         this.totalUnreadMessages = 0; // Fallback to 0
  //       }
  //       this.cdRef.detectChanges(); // Force Angular to detect changes
  //     } else {
  //       console.error('Failed to fetch unread message count');
  //       this.totalUnreadMessages = 0;
  //     }
  //   }, error => {
  //     console.error('Error fetching unread messages', error);
  //     this.totalUnreadMessages = 0;
  //   });
  // }
  getUnreadMessages(): void {
    const route = 'get-unread-message-count';
    const payload = {
      loginedUserid: {
        id: this.loggedInUserId
      }
    };

    console.log('Payload for unread messages:', payload);

    this._productionCenter.postRequestCreator(route, payload).subscribe(
      res => {
        console.log('API Response:', res); // Log the entire response

        // Ensure response has EncryptedResponse and status_code
        if (res && res.status_code === 200) {
          // Parse unreadCount and ensure it's a number
          const unreadCount = parseInt(res.data.unreadCount, 10);

          if (!isNaN(unreadCount)) {
            this.totalUnreadMessages = unreadCount; // Update totalUnreadMessages
            this.cdRef.detectChanges(); // Force Angular to detect changes
          } else {
            console.error('Unread count is not a number');
            this.totalUnreadMessages = 0; // Fallback to 0
          }
        } else {
          console.error('Failed to fetch unread message count');
          this.totalUnreadMessages = 0;
        }
      },
      error => {
        console.error('Error fetching unread messages', error); // Log the error
        this.totalUnreadMessages = 0;
      }
    );
  }



  getAgencyData() {
    const data = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(data);
    const param = {
      id: userData.agency_id
    };
    this.masterService.postRequestCreator('getAgencyUserDataById/' + userData.agency_id).subscribe(data => {
      let apiResponse = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      if (apiResponse && apiResponse.agency_name) {
        this.userName = apiResponse.agency_name.charAt(0).toUpperCase() + apiResponse.agency_name.slice(1);
      }
    });
  }

  changeClass() {
    this.showSidebar = !this.showSidebar;
  }

  navigatetoSeedNet() {
    window.location.href = "https://seednet.gov.in/SSO/SSOLogin.aspx?seednet_token=" + this.seednet_token;
  }

  async onRedirectClick(event: MouseEvent) {
    event.preventDefault();
    await this.logout();

    // this.seednet_token = encodeURIComponent("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bm0iOiJPSUxTRUVEQURNSU4iLCJuYW1lIjpudWxsLCJyb2xlIjoiT0lMU0VFREFETUlOIiwic3RhdGVDb2RlIjoiQ0VOVFJBTCIsImlhdCI6MTc1Mzg3NDYxMywiZXhwIjoxNzUzODg1NDEzLCJhdWQiOiJPSUxTRUVEQURNSU4iLCJpc3MiOiJzY2FwbmljLmdvdi5pbiJ9.iF4X4l2ok-MaNTVKW2gCZopVMcXrAR2y2aebM9WOWrM")
    const token = this.seednet_token ;
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + 60 * 60 * 1000); // 1 hour
    this.cookieService.set(
      'token',
      token,
      expiryDate,
      '/',
      '',          // empty domain => same domain
      true,        // secure
      'Lax'        // SameSite
    );

    // Check if cookie is set (debugging)
    console.log('Cookie Set:', this.cookieService.get('token'));
    // Redirect to same-domain route (works)
    //  this.router.navigateByUrl('/ms014/oilSeed/areaDashboard');
    //https://seedtrace.gov.in/dashboard-phase-second
    window.location.href = `https://seedtrace.gov.in/ms014/oilSeed/areaDashboard`;
  }
}
