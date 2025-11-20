import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { MasterService } from '../services/master/master.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from "../services/authentication.service";
import { CommonService } from "../services/common.service";
import Swal from "sweetalert2";
import { SeedServiceService } from '../services/seed-service.service';
import { HttpClient } from '@angular/common/http';
import { JsPrintManagerService } from '../jsprintmanager.service';
import { LabelData } from '../label-data.model';  // Import the LabelData model

@Component({
  selector: 'app-test-printer',
  templateUrl: './test-printer.component.html',
  styleUrls: ['./test-printer.component.css']
})
export class TestPrinterComponent implements OnInit {
  [x: string]: any;

  loginForm: FormGroup;
  returnUrl: string;
  submitted = false;
  loading = false;
  error = '';
  passwordShowToggle = false;
  stateList: any;
  stateListsecond: any;
  ipAddres: any;
  userId:any;
  submissionid = this.route.snapshot.paramMap.get('submissionid'); response: any;
  data_value:any;
  historyData =
  {
    action: '',
    comment: '',
    formType: '',
    user_action:'',
  }
  sectorData: any = [85,99,201, 202, 203, 204, 205, 206, 207, 208209, 210, 211, 212, 213, 213]

  labelData: LabelData[] = [{
    companyName: 'SARDAR VALLABH BHAI PATEL SEED PRODUCTION CENTER',
    location: 'AMRITSAR, PUNJAB',
    seedClass: 'Breeder Seed',
    qrCodeUrl: 'https://example.com/qrcode',
    crop: 'MAIZE (MAKKA)',
    testDate: '00:00:00',
    variety: 'SSM-510',
    pureSeedPercentage: 'NA',
    parentalLine: 'NA',
    inertSeedPercentage: 'NA',
    germinationPercentage: 'NA',
    lotNumber: 'OCT24-0052-017-1(1)',
    tagNumber: 'B/24/0052/000012',
    bagWeight: '50',
    executiveDirector: 'Executive Director',
    directorName: 'Rakesh Awasthi',
    footer: 'This tag is system generated and does not require any signature.'
  },
  {
    companyName: 'SARDAR VALLABH BHAI PATEL SEED PRODUCTION CENTER 2',
    location: 'AMRITSAR, PUNJAB',
    seedClass: 'Breeder Seed',
    qrCodeUrl: 'https://example.com/qrcode',
    crop: 'MAIZE (MAKKA)',
    testDate: '00:00:00',
    variety: 'SSM-510',
    pureSeedPercentage: 'NA',
    parentalLine: 'NA',
    inertSeedPercentage: 'NA',
    germinationPercentage: 'NA',
    lotNumber: 'OCT24-0052-017-1(1)',
    tagNumber: 'B/24/0052/000012',
    bagWeight: '50',
    executiveDirector: 'Executive Director',
    directorName: 'Rakesh Awasthi',
    footer: 'This tag is system generated and does not require any signature.'
  },
  {
    companyName: 'SARDAR VALLABH BHAI PATEL SEED PRODUCTION CENTER 3',
    location: 'AMRITSAR, PUNJAB',
    seedClass: 'Breeder Seed',
    qrCodeUrl: 'https://example.com/qrcode',
    crop: 'MAIZE (MAKKA)',
    testDate: '00:00:00',
    variety: 'SSM-510',
    pureSeedPercentage: 'NA',
    parentalLine: 'NA',
    inertSeedPercentage: 'NA',
    germinationPercentage: 'NA',
    lotNumber: 'OCT24-0052-017-1(1)',
    tagNumber: 'B/24/0052/000012',
    bagWeight: '50',
    executiveDirector: 'Executive Director',
    directorName: 'Rakesh Awasthi',
    footer: 'This tag is system generated and does not require any signature.'
  }];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private _commonService: CommonService,
    private authenticationService: AuthenticationService,
    private service: SeedServiceService,
    private mastersService: MasterService,
    private http: HttpClient,
    private jsPrintManagerService: JsPrintManagerService
  ) { }


  onPrint(): void {

    this.jsPrintManagerService.printLabels(this.labelData); // Pass the dynamic label data to print
  }

  getIPAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddres = res.ip;
      console.log('ip=======address', this.ipAddres);
    });
  }

  audtiTrailsHistory(historyData,data_value) {
     console.log("kkkk",historyData.user_action)
  
    // let userdata = JSON.parse(this.data_value);
  // console.log("userdata",data_value.id)
    this.service.postRequestCreator('audit-trail-history', null, {
      "action_at": historyData.action,
      "action_by": data_value.name,
      "application_id": "1234",
      "column_id":this.submissionid ? this.submissionid : '',
      "comment": historyData.comment,
      "form_type":historyData.formType,
      "ip": this.ipAddres,
      "mac_number": "12345678",
      "user_id":data_value.id,
      "user_action":historyData.user_action,
      "table_id": this.submissionid ? this.submissionid : '',
      "user_type":data_value.user_type,
    }).subscribe(res => {

    });
  }
  ngOnInit() {
    this.getIPAddress();
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      state_code: new FormControl('',),
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = '/login';
    // window.location.href = 'https://seedtrace.gov.in/ms014/'

    // if (!localStorage.getItem('login')) {
    //   localStorage.setItem('login', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('login')
    // }

    // this.getStateList();
    this.jsPrintManagerService.start(); // Start the JSPM connection

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  async getStateList() {
    this.mastersService
      .postRequestCreatorV2("get-state-list-v2", null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.stateList = apiResponse.EncryptedResponse.data.rows;
          // this.stateList = this.stateList.filter((arr, index, self) =>
          //   index === self.findIndex((t) => (t['m_state.state_name'] === arr['m_state.state_name'])))
          let stateData = [];
          stateData = this.stateList.filter(elem => !this.sectorData.includes(elem.state_code))
          this.stateListsecond = stateData;
          console.log('stateListsecond', this.stateListsecond);
        }
      });

  }

  signIn() {
    this.submitted = true;

    // stop here if form is invalid
    if (!this.loginForm.controls['username'].value && !this.loginForm.controls['password'].value) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f)
      .subscribe(
        data => {
          console.log('login page data : ');
          if (typeof data !== 'undefined' && data !== null && data !== '' && JSON.stringify(data) !== '{}') {
            if (data.token) {
              // this.userId = data.id;
              this.historyData.action = "User Login";
              this.historyData.comment = "User login successfully";
              this.historyData.formType = "Login";
              this.historyData.user_action = "Login";
  
              this.audtiTrailsHistory(this.historyData,data);

            // console.log("user",data);
              this.cookieService.set('token', data.token);
              this.router.navigate([this.returnUrl]);
            } else {
              localStorage.removeItem('state_code');
              this.authenticationService.logout();
              this.loading = false;
            }
          } else {
            this.loading = false;
            this.error = 'Email or Password Doesn\'t Exist!';
          }
        },
        error => this.handleError(error)
      );
  }

  handleError(errorData) {
    console.log('error', errorData);
    this.error = errorData;
    this.loading = false;
  }
  togglePassword() {
    // alert('hiii')
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#id_password');
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.passwordShowToggle = !this.passwordShowToggle

    //   togglePassword.addEventListener('click', function (e) {
    //     // toggle the type attribute

    //     // toggle the eye slash icon
    //     this.classList.toggle('fa-eye-slash');
    // });
  }

}
