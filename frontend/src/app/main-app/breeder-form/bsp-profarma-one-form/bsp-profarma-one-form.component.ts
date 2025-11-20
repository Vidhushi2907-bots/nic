import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { Router } from '@angular/router';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { MasterService } from 'src/app/services/master/master.service';
import * as html2PDF from 'html2pdf.js';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import jsPDF from 'jspdf';
import { checkDecimal, checkDecimalValue, checkLength, checkNumber } from 'src/app/_helpers/utility';
// import * as html2PDF from 'html2pdf
@Component({
  selector: 'app-bsp-profarma-one-form',
  templateUrl: './bsp-profarma-one-form.component.html',
  styleUrls: ['./bsp-profarma-one-form.component.css']
})
export class BspProfarmaOneFormComponent implements OnInit {
  [x: string]: any;
  @ViewChild('pdfContainer') pdfContainer: ElementRef;
  fileName = 'breeder-bsp-profarma-one.xlsx';

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup;
  baseUrl: string = environment.ms_nb_06_production_center.baseUrl;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  is_developed: boolean;
  is_update: boolean = false;
  reportDataCropvalue: any;
  isCrop: boolean = false;
  isSearch: boolean = true;
  dropdownSettings: IDropdownSettings = {};
  varietyList = [];
  varietyDisbled: boolean = true;
  isDeveloped: boolean = false;
  isVariety: boolean = false;
  bspsData: any;
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryCropData: any;
  inventoryVarietyData: any;
  bspsDataArray: { id: number; production_center: string; season: string; crop: string; variety_name: string; variety_code: string; bspc_developed_by: number; req_no_doc_moa: string; req_no_dept_moa: string; nucleus_seed_available: any; breeder_seed_available: any; total_target: string; }[];
  userId: any;
  bspData: any;
  isFinalSubmit: boolean = false;
  cropBasicDetails: any;
  // breederService: any;
  varietyFilterList: any;
  isSubmit: boolean = true;
  unitValue: string;
  teamdetailsData: any;
  displayStyle: any = 'none'
  bspcTeam: any;
  bspcTeamSecond: any;
  bspcData: any;
  parentalLineVariety: any;
  isPrentalLine: any;
  varietyTempValue: any;
  parentalLineVarietyLength: any;
  currentDate: Date = new Date();
  pdpcName: any;
  pdpcAddres: any;
  userName: any;
  pdpcAdrress: any;
  pdpcImageUrl: any;
  teamdetailsDataSecond: any;
  rportStatusData: any;
  stateList: any;
  listofDistrict: any;
  pdpcDesignation: any;
  profileData: any;
  reasonData: any;
  agencyId: any;
  districtName;
  stateName;
  isPdfDisbaled: any = false;
  varietyName: any;
  varietyNameLine: any;
  productionType: any;
  varietyLineCode: any;

  selectedData: any;
  viewheader: boolean;
  encryptedData: string;

  constructor(private service: SeedServiceService, private _masterService: MasterService, private breeder: BreederService, private fb: FormBuilder, private route: Router, private cdRef: ChangeDetectorRef, private _productionCenter: ProductioncenterService, private master: MasterService) {
    this.createForm();
    this.bspcData = this.breeder.redirectData;
    if (this.bspcData && this.bspcData !== undefined && this.bspcData != null) {
      if (this.bspcData.year && this.bspcData.season && this.bspcData.crop_code) {
        this.ngForm.controls['year'].patchValue(this.bspcData.year);
        this.ngForm.controls['season'].patchValue(this.bspcData.season);
        this.ngForm.controls['crop'].patchValue(this.bspcData.crop_code);
        this.getPageData(null, null, null);
      }
    }
  }

  createForm() {
    this.ngForm = this.fb.group({
      id: [''],
      year: [''],
      season: [''],
      crop: [''],
      crop_code: [''],
      variety: [''],
      variety_line: [''],
      variety_filter: [''],
      is_developed: [''],
      reason: [''],
      nucleus_avail_qnt: [''],
      breeder_avail_qnt: [''],
      nucleus_willing_qnt: [''],
      date_of_moa: [''],
      date_of_memo: [''],
      refrence_no_memo: [''],
      refrence_no_auth: [''],
      bspc: this.fb.array([
        // this.bspcCreateForm()
      ]
      )
    });


    // this.ngForm.disable();

    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop'].disable();
    this.ngForm.controls['variety'].disable();


    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.varietyTempValue = "";
        this.cropBasicDetails = [];
        this.isPrentalLine = false;
        this.parentalLineVarietyLength = [];
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['crop'].setValue('');
        this.ngForm.controls['variety'].setValue('');
        // this.ngForm.controls['bspc'].setValue([]);
        this.getSeasonData();
        this.isCrop = false;
        this.bspc.clear();
        this.isSearch = true;
        // this.is_update=false
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.varietyTempValue = "";
        this.cropBasicDetails = [];
        this.isPrentalLine = false;
        this.parentalLineVarietyLength = [];
        this.ngForm.controls['crop'].enable();
        this.ngForm.controls['variety'].setValue('');
        // this.ngForm.controls['bspc'].setValue([]);
        this.bspc.clear();
        this.isCrop = false;
        this.isSearch = true;
        // this.is_update=false
        this.getCropData(null);
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.varietyTempValue = "";
        this.cropBasicDetails = [];
        this.isPrentalLine = false;
        this.parentalLineVarietyLength = [];
        this.isCrop = false;
        this.isSearch = true;
        // this.is_update=false
        this.ngForm.controls['variety'].enable();
        // this.ngForm.controls['bspc'].setValue([]);
        this.bspc.clear();
        if (newvalue.slice(0, 1) == "A") {
          this.unitValue = "Qt";
        } else {
          this.unitValue = "Kg";
        }
        this.getVarietyData(null);
        this.checkIsFinalSubmit();
        this.getTeamMemberSecond();
      }
    });

    this.ngForm.controls['variety'].valueChanges.subscribe(newvalue => {
      if (newvalue) {

        this.ngForm.controls['variety_line'].enable();
        this.cropBasicDetails = [];
        if (this.inventoryVarietyData) {
          let varietyStatus = this.inventoryVarietyData.filter(ele => ele.variety_code == newvalue)

          if (varietyStatus && varietyStatus[0] && varietyStatus[0].status == 'hybrid') {
            this.isPrentalLine = true;
            this.varietyTempValue = newvalue;
            this.bspc.clear();
            this.checkParentalLineVariety(newvalue);
          } else {
            this.ngForm.controls['variety_line'].reset();
            this.cropBasicDetails = [];
            this.varietyTempValue = "";
            this.isDeveloped = true;
            this.isVariety = true
            this.bspc.clear();
            this.isPrentalLine = false;
            this.getCropBasicDetails(newvalue);
            if (!this.ngForm.controls['id'].value) {
              this.fetchQntInventryData(null);
            }
          }
        }

      }
    });

    this.ngForm.controls['variety_line'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.cropBasicDetails = []
        this.isDeveloped = true;
        this.isVariety = true
        this.bspc.clear();
        this.getCropBasicDetailsSecond(newvalue);
        if (!this.ngForm.controls['id'].value) {
          this.fetchQntInventryData(null);
        }
      }
    });
  }
  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }

  bspcCreateForm(): FormGroup {
    return this.fb.group({
      breeder_seed_available: [''],
      nucleus_seed_available: [''],
      production_center: [''],
      target_qunatity: [''],
      id: [''],
      willing_to_produce: [''],
      reason: [''],
      isPermission: [''],
      reason_for_delay: [''],
      production_type: [''],
      expected_date: ['']
    })
  }

  ngOnInit(): void {
    this.productionTypeValue('NORMAL');
    this.fetchData();
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    this.agencyId = data.agency_id;
    this.userId = data.id;
    this.pdpcName = data && data.name ? data.name : 'NA';
    this.pdpcAddres = data && data.address ? data.address : 'NA';
    this.getAgencyData(null, null);
  }
  getAgencyData(agencyData, reportData) {
    console.log("repooortData==", reportData);
    const data = localStorage.getItem('BHTCurrentUser')
    console.log("dataIs===", data);
    // let reportStatus;
    // reportStatus={report_status:"bsp_one_report"};
    let userData = JSON.parse(data);
    agencyData = userData;
    console.log("agency", agencyData);
    let userId;
    if (reportData) {
      userId = reportData.agency_id;
      console.log("curr agency_id===", userId);

    } else {
      userId = agencyData.agency_id
      console.log("curr login_id===", userId);
    }
    const param = {
      id: userId
    }

    this._masterService.postRequestCreator('getAgencyUserDataById/' + userId).subscribe(data => {
      // let res = 2
      let apiResponse = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      this.profileData = apiResponse ? apiResponse : '';
      console.log('apiResponse===', apiResponse['m_designation.name']);
      console.log('profileData===', this.profileData);
      // contact_person_name
      if (apiResponse && apiResponse.agency_name) {
        this.userName = apiResponse.agency_name.charAt(0).toUpperCase() + apiResponse.agency_name.slice(1);
        console.log("username==", this.userName);

      }
      if (apiResponse && apiResponse.address) {
        this.pdpcAdrress = apiResponse.address.charAt(0).toUpperCase() + apiResponse.address.slice(1);
      }
      if (apiResponse && apiResponse.state_name) {
        this.stateName = apiResponse.state_name.charAt(0).toUpperCase() + apiResponse.state_name.slice(1);
        console.log("stateName==", this.stateName);
      }
      if (apiResponse && apiResponse.district_name) {
        this.districtName = apiResponse.district_name.charAt(0).toUpperCase() + apiResponse.district_name.slice(1);
        console.log("districtName==", this.districtName);
      }
      if (apiResponse && apiResponse.image_url2) {
        this.pdpcImageUrl = apiResponse.image_url2.charAt(0).toUpperCase() + apiResponse.image_url2.slice(1);
      }
      if (apiResponse && apiResponse['m_designation'] && apiResponse['m_designation.name']) {
        this.pdpcDesignation = apiResponse['m_designation.name'].charAt(0).toUpperCase() + apiResponse['m_designation.name'].slice(1);
        console.log("pdpcDesignation==", this.pdpcDesignation);
      }
      // pdpcImageUrl ? pdpcImageUrl
    })
  }



  fetchData() {
    // this.getYearData();
    this.getReportStatusData();
    this.getStatelist();
    this.getDistrictListSecond();
    this.getCommentData();
    // this.getPageData();
    this.dropdownSettings = {
      idField: 'variety_code',
      textField: 'variety_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      itemsShowLimit: 2,
      limitSelection: -1,
    };
  }
  getCommentData() {
    const route = "get-commnets-list";
    this._masterService.getRequestCreatorNew(route).subscribe(data => {
      if (data['EncryptedResponse'].status_code === 200) {
        console.log('EncryptedResponse===', data['EncryptedResponse'].data);
        this.reasonData = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : [];
      }
    })
  }
  getStatelist() {
    // get-state-list-v2
    this.master.postRequestCreator('get-all-state-list', null).subscribe(data => {
      this.stateList = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
    })
  }

  getDistrictListSecond() {
    const param = {
    }
    this.master.postRequestCreator('get-district-list', null, param).subscribe(data => {
      this.listofDistrict = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
    })
  }

  getDistrictName(value, stateVal) {
    let districtData = this.listofDistrict.filter(ele => ele.district_code == value && ele.state_code == stateVal)
    let districtNameValue = districtData && districtData[0] && districtData[0].district_name
    return districtNameValue;
  }

  getStateName(value) {
    let stateData = this.stateList.filter(ele => ele.state_code == value);
    let stateNameValue = stateData && stateData[0] && stateData[0].state_name;
    return stateNameValue;
  }
  checkIsFinalSubmit() {
    let param = {
      year: (this.ngForm.controls["year"].value),
      crop_code: this.ngForm.controls["crop"].value,
      season: this.ngForm.controls["season"].value,
      user_id: this.userId,
    }
    this.breeder.postRequestCreator("check-bsp-one-variety-availability", null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        if (res.EncryptedResponse.data && res.EncryptedResponse.data[0]) {
          // this.isSubmit = res.EncryptedResponse.data.isDisable; 
          if (res.EncryptedResponse.data[0].isDisable == "true") {
            this.isSubmit = true;
            this.isFinalSubmit = true;
            this.isPdfDisbaled = true;
          } else {
            this.isSubmit = false;
            this.isPdfDisbaled = false;
            this.isFinalSubmit = false;
          }
          console.log("is final submit1 ", this.isSubmit);
        }
      }
    })
  }

  fetchQntInventryData(data, item = null) {
    this.bspc.clear();
    let route = "get-bsp-proforma-one-variety-basic-data";
    console.log(data, 'datadata')
    let param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value,
        variety_code: this.ngForm.controls["variety"].value,
        id: data && data.id ? data.id : null,
        variety_line_code: this.ngForm.controls["variety_line"].value ? this.ngForm.controls["variety_line"].value : data && data.line_variety_code ? data.line_variety_code : '',
        updateMode: data ? true : false
      }
    };
    this.breeder.postRequestCreator(route, null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.bspsData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        if (this.bspsData && this.bspsData.length > 0 && this.bspsData !== undefined) {
          if (data) {
            for (let i = 0; i < this.bspsData.length; i++) {
              // alert('hii')
              this.addBspc();
              if (((data && data['bspc'] && data['bspc'][i] && data['bspc'][i].breeder_seed < 0) || (data && data && data['bspc'][i] && !data['bspc'][i].breeder_seed))) {
                this.ngForm.controls['bspc']['controls'][i].controls['isPermission'].disable();
              }
              if (this.bspsData[i].nucleus_seed_available_qnt < 0 || this.bspsData && this.bspsData[i] && !this.bspsData[i].nucleus_seed_available_qnt) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].disable();
              }
              if (this.bspsData[i].nucleus_seed_available_qnt > 0) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
              }
              if ((this.bspsData[i].nucleus_seed_available_qnt > 0) && (this.bspsData[i].breeder_seed_available_qnt > 0)) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
              }
              if (data['bspc'] && data['bspc'][i] && data['bspc'][i].breeder_seed && (data['bspc'][i].breeder_seed)) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
              }
              this.ngForm.controls['bspc']['controls'][i].patchValue({
                breeder_seed_available: [data['bspc'] && data['bspc'][i] && data['bspc'][i].breeder_seed ? (data['bspc'][i].breeder_seed).toFixed(3) : 0],
                nucleus_seed_available: [data['bspc'] && data['bspc'][i] && data['bspc'][i].include_seed ? (data['bspc'][i].include_seed).toFixed(3) : 0],
                production_center: [this.bspsData[i].bspc_name],
                id: [this.bspsData[i].id],
                willing_to_produce: [this.bspsData[i].willing_to_produce],
                isPermission: (data['bspc'] && data['bspc'][i] && data['bspc'][i].isPermission),
                reason: [this.bspsData[i].reason],
                target_qunatity: [data['bspc'] && data['bspc'][i] && data['bspc'][i].target_quantity ? data['bspc'][i].target_quantity : 0],
                reason_for_delay: this.bspsData[i].reason_for_delay ? this.bspsData[i].reason_for_delay : 'NA',
                production_type: this.bspsData[i].production_type ? this.bspsData[i].production_type : 'NA',
                expected_date: this.bspsData[i].expected_date ? this.bspsData[i].expected_date : 'NA',
              });
              console.log("this.ngForm.controls['bspc']['controls'][i]", this.ngForm.controls['bspc']['controls'][i].value);

            }
          } else {
            for (let i = 0; i < this.bspsData.length; i++) {
              if (this.ngForm.controls['bspc'].value.length > 1) {
                this.removeBspc(i);
              }
              this.addBspc();
              if ((this.bspsData[i].breeder_seed_available_qnt < 0 || !this.bspsData[i].breeder_seed_available_qnt)) {
                this.ngForm.controls['bspc']['controls'][i].controls['isPermission'].disable();
              }
              if (this.bspsData[i].nucleus_seed_available_qnt < 0 || !this.bspsData[i].nucleus_seed_available_qnt) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].disable();
              }
              if (this.bspsData[i].nucleus_seed_available_qnt > 0) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
              }
              if ((this.bspsData[i].nucleus_seed_available_qnt > 0) && (this.bspsData[i].breeder_seed_available_qnt > 0)) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
              }
              this.ngForm.controls['bspc']['controls'][i].patchValue({
                breeder_seed_available: [this.bspsData[i].breeder_seed_available_qnt ? this.bspsData[i].breeder_seed_available_qnt : 0],
                nucleus_seed_available: [this.bspsData[i].nucleus_seed_available_qnt ? this.bspsData[i].nucleus_seed_available_qnt : 0],
                production_center: [this.bspsData[i].bspc_name],
                id: [this.bspsData[i].bspc_id],
                willing_to_produce: [this.bspsData[i].willing_to_produce],
                reason: [this.bspsData[i].reason],
                target_qunatity: 0,
                reason_for_delay: this.bspsData[i].reason_for_delay ? this.bspsData[i].reason_for_delay : 'NA',
                production_type: this.bspsData[i].production_type ? this.bspsData[i].production_type : 'NA',
                expected_date: this.bspsData[i].expected_date ? this.bspsData[i].expected_date : 'NA',
              });
            }
          }
        }
      }
    })
  }

  // for update old code 
  fetchQntInventryDataUpdateOld(data, item = null) {
    this.bspc.clear();
    let route = "get-bsp-proforma-one-variety-basic-data-update";
    console.log(data, 'datadata')
    let param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value,
        variety_code: this.ngForm.controls["variety"].value,
        id: data && data.id ? data.id : null,
        variety_line_code: data && data.line_variety_code ? data.line_variety_code : '',
        updateMode: true
      }
    };
    this.breeder.postRequestCreator(route, null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.bspsData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        console.log('this.bspsData ======', this.bspsData);
        console.log('data====', data);
        if (this.bspsData && this.bspsData.length > 0 && this.bspsData !== undefined) {
          if (data) {
            for (let i = 0; i < this.bspsData.length; i++) {
              // alert('hii')
              this.addBspc();
              if (((data && data['bspc'] && data['bspc'][i] && data['bspc'][i].breeder_seed < 0) || (data && data && data['bspc'][i] && !data['bspc'][i].breeder_seed))) {
                this.ngForm.controls['bspc']['controls'][i].controls['isPermission'].disable();
              }
              if (this.bspsData[i].nucleus_seed_available_qnt < 0 || this.bspsData && this.bspsData[i] && !this.bspsData[i].nucleus_seed_available_qnt) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].disable();
              }
              if (this.bspsData[i].nucleus_seed_available_qnt > 0) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
              }
              if ((this.bspsData[i].nucleus_seed_available_qnt > 0) && (this.bspsData[i].breeder_seed_available_qnt > 0)) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
              }
              if (data['bspc'] && data['bspc'][i] && data['bspc'][i].breeder_seed && (data['bspc'][i].breeder_seed)) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
              }
              this.ngForm.controls['bspc']['controls'][i].patchValue({
                breeder_seed_available: [data['bspc'] && data['bspc'][i] && data['bspc'][i].breeder_seed ? (data['bspc'][i].breeder_seed).toFixed(3) : 0],
                nucleus_seed_available: [data['bspc'] && data['bspc'][i] && data['bspc'][i].include_seed ? (data['bspc'][i].include_seed).toFixed(3) : 0],
                production_center: [this.bspsData[i].bspc_name],
                id: [this.bspsData[i].id],
                willing_to_produce: [this.bspsData[i].willing_to_produce],
                isPermission: (data['bspc'] && data['bspc'][i] && data['bspc'][i].isPermission),
                reason: [this.bspsData[i].reason],
                target_qunatity: [data['bspc'] && data['bspc'][i] && data['bspc'][i].target_quantity ? data['bspc'][i].target_quantity : 0],
                reason_for_delay: this.bspsData[i].reason_for_delay ? this.bspsData[i].reason_for_delay : 'NA',
                production_type: this.bspsData[i].production_type ? this.bspsData[i].production_type : 'NA',
                expected_date: this.bspsData[i].expected_date ? this.bspsData[i].expected_date : 'NA',
              });
              console.log("this.ngForm.controls['bspc']['controls'][i]", this.ngForm.controls['bspc']['controls'][i].value);

            }
          } else {
            for (let i = 0; i < this.bspsData.length; i++) {
              if (this.ngForm.controls['bspc'].value.length > 1) {
                this.removeBspc(i);
              }
              this.addBspc();
              if ((this.bspsData[i].breeder_seed_available_qnt < 0 || !this.bspsData[i].breeder_seed_available_qnt)) {
                this.ngForm.controls['bspc']['controls'][i].controls['isPermission'].disable();
              }
              if (this.bspsData[i].nucleus_seed_available_qnt < 0 || !this.bspsData[i].nucleus_seed_available_qnt) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].disable();
              }
              if (this.bspsData[i].nucleus_seed_available_qnt > 0) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
              }
              if ((this.bspsData[i].nucleus_seed_available_qnt > 0) && (this.bspsData[i].breeder_seed_available_qnt > 0)) {
                this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
              }
              this.ngForm.controls['bspc']['controls'][i].patchValue({
                breeder_seed_available: [this.bspsData[i].breeder_seed_available_qnt ? this.bspsData[i].breeder_seed_available_qnt : 0],
                nucleus_seed_available: [this.bspsData[i].nucleus_seed_available_qnt ? this.bspsData[i].nucleus_seed_available_qnt : 0],
                production_center: [this.bspsData[i].bspc_name],
                id: [this.bspsData[i].id],
                willing_to_produce: [this.bspsData[i].willing_to_produce],
                reason: [this.bspsData[i].reason],
                target_qunatity: 0,
                reason_for_delay: this.bspsData[i].reason_for_delay ? this.bspsData[i].reason_for_delay : 'NA',
                production_type: this.bspsData[i].production_type ? this.bspsData[i].production_type : 'NA',
                expected_date: this.bspsData[i].expected_date ? this.bspsData[i].expected_date : 'NA',
              });
            }
          }
        }
      }
    })
  }
  // for update new code 
  fetchQntInventryDataUpdate(data, item = null) {
    this.bspc.clear();
    let route = "get-bsp-proforma-one-variety-basic-data-update";
    let param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value,
        variety_code: this.ngForm.controls["variety"].value,
        id: data && data.id ? data.id : null,
        variety_line_code: this.ngForm.controls["variety_line"].value
          ? this.ngForm.controls["variety_line"].value
          : data && data.line_variety_code
            ? data.line_variety_code
            : "",
        updateMode: true
      }
    };

    this.breeder.postRequestCreator(route, null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.bspsData =
          res?.EncryptedResponse?.data && res.EncryptedResponse.data.length
            ? res.EncryptedResponse.data
            : [];
        this
        if (this.bspsData.length > 0) {
          // data
          if (1) {
            // EDIT CASE
            for (let i = 0; i < this.bspsData.length; i++) {
              this.addBspc();

              // disable/enable logic
              if (
                (this.bspsData?.[i]?.breeder_seed_available_qnt < 0) ||
                !this.bspsData?.[i]?.nucleus_seed_available_qnt
              ) {
                this.ngForm.controls["bspc"]["controls"][i].controls[
                  "isPermission"
                ].disable();
              }
              if (
                this.bspsData[i].nucleus_seed_available_qnt <= 0 ||
                !this.bspsData[i].nucleus_seed_available_qnt
              ) {
                this.ngForm.controls["bspc"]["controls"][i].controls[
                  "target_qunatity"
                ].disable();
              } else {
                this.ngForm.controls["bspc"]["controls"][i].controls[
                  "target_qunatity"
                ].enable();
              }

              // patch values correctly
              this.ngForm.controls["bspc"]["controls"][i].patchValue({
                breeder_seed_available:
                  this.bspsData[i].breeder_seed_available_qnt ??
                  0,
                nucleus_seed_available:
                  this.bspsData[i].nucleus_seed_available_qnt ??
                  0,
                production_center: this.bspsData[i].bspc_name,
                id: this.bspsData[i].id,
                willing_to_produce: this.bspsData[i].willing_to_produce ?? 0,
                isPermission: this.bspsData?.[i]?.isPermission ?? false,
                target_qunatity:
                  this.bspsData[i].target_qunatity ??
                  0,
                reason_for_delay:
                  this.bspsData[i].reason_for_delay ?? "NA",
                production_type:
                  this.bspsData[i].production_type ?? "NA",
                expected_date:
                  this.bspsData[i].expected_date ?? null
              });
            }
          }
        }
      }
    });
  }

  addBspc() {
    this.bspc.push(this.bspcCreateForm());
  }
  removeBspc(value: number) {
    console.log("bspc length", this.ngForm.controls['bspc'].value.length);
    // if (this.ngForm.controls['bspc'].value.length > 1) {
    // for (let i=0; i<this.ngForm.controls['bspc'].value.length;i++){
    this.bspc.removeAt(value);
    // }
    // }
  }

  getYearData() {
    const route = "get-bsp-proforma-one-year";
    this.breeder.postRequestCreator(route, null, { search: { "production_type": this.productionType } }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryYearData = data.EncryptedResponse.data
      }
    })
  }
  getReportStatusData() {
    const route = "check-report-runing-number";
    this.breeder.postRequestCreator(route, null, {
      report_type: "bsp1"
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.rportStatusData = data.EncryptedResponse.data;
      }
    })
  }
  getVarietyFilterData() {
    // Cannot GET /ms-nb-003-breeder/api/get-assign-indenter-variety-data
    const param = {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "user_type": "bspc",
        "user_id": this.userId
      }
    }
    const route = "get-bsp-proforma-one-variety-filter";
    const result = this.breeder.postRequestCreator(route, null, param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code === 200) {
        this.varietyFilterList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        console.log("varietyFilterList=====", this.varietyFilterList);
      } else if (data && data.EncryptedResponse && data.EncryptedResponse.status_code === 201) {
        if (this.ngForm.invalid) {
          Swal.fire({
            title: '<p style="font-size:25px;">Variety Not Found.</p>',
            icon: 'warning',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })
          return;
        }
      } else {
        if (this.ngForm.invalid) {
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })
          return;
        }
      }
    })
  }
  getSeasonData() {
    const route = "get-bsp-proforma-one-season";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "user_type": "pdpc",
        "production_type": this.productionType
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventorySeasonData = data.EncryptedResponse.data
      }
    })
  }

  getFormattedDate(date: any): string {
    if (!date) return 'NA';

    const dateObj = new Date(date);

    // Check if dateObj is valid
    if (isNaN(dateObj.getTime())) return 'NA';

    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' };

    return dateObj.toLocaleDateString('en-GB', options);
  }

  getCropData(reportData1): Promise<void> {
    return new Promise((resolve, reject) => {
      let reportStatus;
      console.log("reportData1 is=", reportData1);

      if (reportData1) {
        reportStatus = { report_status: "bsp_one_report" };
      }

      const route = "get-bsp-proforma-one-crop";

      // Make the API request
      this.breeder.postRequestCreator(route, null, {
        search: {
          "year": this.ngForm.controls["year"].value,
          "season": this.ngForm.controls["season"].value,
          "user_type": "pdpc",
          ...reportStatus
        }
      }).subscribe(data => {
        console.log("season data value", data);

        // Check if the API response is successful
        if (data.EncryptedResponse.status_code === 200) {
          this.inventoryCropData = data.EncryptedResponse.data;
          console.log("Fetched inventoryCropData:", this.inventoryCropData);

          // Proceed with filtering and extracting crop data once the data is available
          if (reportData1) {
            console.log('Using reportData:', reportData1);

            // Filter based on crop_code
            let cropData = this.inventoryCropData.filter(item => item.crop_code == reportData1.crop_code);

            console.log("Filtered cropData:", cropData);

            // Extract crop name
            let cropName = cropData && cropData[0] && cropData[0].crop_name
              ? cropData[0].crop_name
              : '';

            console.log("Extracted cropName:", cropName);
            this.reportDataCropvalue = cropName;

            // Resolve the promise once data is available
            resolve();
          }
        } else {
          console.error('Error fetching crop data:', data.EncryptedResponse.message);
          reject('Failed to fetch crop data');
        }
      }, error => {
        console.error('API request failed:', error);
        reject(error);
      });
    });
  }




  getCropName(value) {
    // console.log('value====',value);
    if (value) {
      // console.log('inventoryCropData====',this.inventoryCropData);
      let cropData = this.inventoryCropData.filter(item => item.crop_code == value)
      let cropName = cropData && cropData[0] && cropData[0].crop_name ? cropData[0].crop_name : '';
      return cropName;
    }


  }
  getVarietyData(data) {
    const route = "get-bsp-proforma-one-variety";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "user_type": "bspc",
        "production_type": this.productionType
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryVarietyData = data.EncryptedResponse.data
        if (this.inventoryVarietyData.length < 1 || this.inventoryVarietyData === undefined || this.inventoryVarietyData === null) {
          this.isFinalSubmit = false;
          this.checkIsFinalSubmit();
        } else {
          this.isFinalSubmit = true;
          // this.checkIsFinalSubmit();
        }
      }
    })
  }

  getVarietyDataSecond(value) {
    const route = "get-bsp-proforma-one-variety-second";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "user_type": "bspc",
        "production_type": this.productionType
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryVarietyData = data.EncryptedResponse.data;
        console.log('inventoryVarietyData==', this.inventoryVarietyData);
        if (this.inventoryVarietyData.length < 1 || this.inventoryVarietyData === undefined || this.inventoryVarietyData === null) {
          this.isFinalSubmit = false;
          // this.checkIsFinalSubmit();
        } else {
          this.isFinalSubmit = true;
          // this.checkIsFinalSubmit();
        }
        let varietyCodeArray = this.inventoryVarietyData.filter(ele => ele.variety_code == value);
        this.varietyName = varietyCodeArray && varietyCodeArray[0] && varietyCodeArray[0].variety_name ? varietyCodeArray[0].variety_name : '';
      }
    })
  }

  //method
  checkParentalLineVariety(newData) {
    console.log(newData);
    let route = "get-bsp-proforma-one-variety-line-new-data";
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      variety_code: newData ? newData : ''
    }
    this.breeder.postRequestCreator(route, null, param).subscribe(data => {
      this.parentalLineVariety = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.parentalLineVarietyLength = this.parentalLineVariety;
    })
  }

  checkParentalLineVarietySecond(newData, line_code) {
    console.log(newData);
    let route = "get-bsp-proforma-one-variety-line-data-new-second";
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      variety_code: newData ? newData : ''
    }
    this.breeder.postRequestCreator(route, null, param).subscribe(data => {
      this.parentalLineVariety = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      let varietyLineArray = this.parentalLineVariety.filter(ele => ele.line_variety_code == line_code)
      this.varietyNameLine = varietyLineArray && varietyLineArray[0] && varietyLineArray[0].line_variety_name ? varietyLineArray[0].line_variety_name : '';
    })
  }

  selcetAll(event) {
    if (event && event.length > 0) {
      this.ngForm.controls["variety_filter"].patchValue(event);
      this.getPageData(null, null, null);
    }
  }
  openpopup() {
    this.displayStyle = 'block'
  }
  close() {
    this.displayStyle = 'none'
  }
  getBspcTeamData(index, team_id, reportData = null) {
    console.log("reportData", reportData);
    const route = "get-bsp-monitoring-team";
    this.breeder.postRequestCreator(route, null, {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value,
        id: team_id ? team_id : ''
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.bspcTeam = data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.teamdetailsData = this.bspcTeam;
      }
    })
  }
  getTeamMember(data) {
    this.openpopup();
    this.getBspcTeamData(null, data);
  }
  getTeamMemberSecond() {
    const route = "get-bsp-monitoring-team";
    this.breeder.postRequestCreator(route, null, {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value,
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.bspcTeam = data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.teamdetailsDataSecond = this.bspcTeam;
      }
    })
  }

  getTeamMemberPdf(data) {

    if (this.teamdetailsDataSecond && this.teamdetailsDataSecond.length) {
      let monitoringTeamData = this.teamdetailsDataSecond.filter(ele => ele.id == data);
      return monitoringTeamData;
    }

  }
  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined, reportData) {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    let userId;
    // this.is_update=false;
    let reportStatus;
    console.log("jjjj", reportData);
    if (reportData && reportData !== undefined) {
      // this.getAgencyData(null,data.user_id);
      // this.getYearData();
      this.ngForm.controls["year"].setValue(reportData.year)
      //  this.getSeasonData();
      this.ngForm.controls["season"].setValue(reportData.season)
      this.ngForm.controls["crop"].setValue(reportData.crop_code)

      //  this.getCropData();
      //  this.getCropName(reportData.crop_code);
      userId = reportData.user_id;
      console.log("ui", userId);

      reportStatus = { report_status: "bsp_one_report" };
      this.isPdfDisbaled = true;
      console.log("isPdfDisbaled");

    } else {
      userId = data.id
      // this.userId = data
    }
    console.log("hghhhg", this.ngForm.controls["year"].value);
    console.log("hghhhg", this.ngForm.controls["season"].value);
    console.log("hghhhg", this.ngForm.controls["crop"].value);


    if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop'].value) {
      Swal.fire({
        toast: false,
        icon: "warning",
        title: "Please Select All Required Field",
        position: "center",
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      })
    } else {
      let varietyCodeArr = [];
      // if(!reportData){
      this.isSearch = false;
      this.isCrop = true;
      this.varietyDisbled = false;
      this.ngForm.controls['variety_filter'].enable();
      if (!this.varietyTempValue) {
        this.getVarietyData(null);
      }
      // this.getVarietyData();
      this.getVarietyFilterData();
      if (this.ngForm.controls["variety_filter"].value && this.ngForm.controls["variety_filter"].value !== undefined && this.ngForm.controls["variety_filter"].value.length > 0) {
        this.ngForm.controls["variety_filter"].value.forEach(ele => {
          varietyCodeArr.push(ele.variety_code);
        })
      }
      // }


      let y = this.ngForm.controls["year"].value;
      let s = this.ngForm.controls["season"].value;
      let c = this.ngForm.controls["crop"].value;
      let uid = userId;
      let d = this.currentDate

      const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ y, s, uid, c, d }), 'a-343%^5ds67fg%__%add').toString();
      this.encryptedData = encodeURIComponent(encryptedForm);
      console.log('this.encryptedData', this.encryptedData);
    

      this.breeder.postRequestCreator("get-bsp-proforma-one-data", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 100,
        // pageSize: 50,
        search: {
          year: this.ngForm.controls["year"].value,
          season: this.ngForm.controls["season"].value,
          crop_code: this.ngForm.controls["crop"].value,
          variety_code_array: varietyCodeArr && (varietyCodeArr.length > 0) ? varietyCodeArr : null,
          user_id: userId ? userId : null,
          ...reportStatus
        }
      }).subscribe((apiResponse: any) => {
        console.log(apiResponse);
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          // this.filterPaginateSearch.itemListPageSize = ;
          // this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : [];
          this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data : [];

          console.log("all Data", this.allData);
          // console.log(this.allData[0].m_crop);
          // this.allData = this.inventoryData

          if (this.allData === undefined) {
            this.allData = [];
          }

          // //start temp code for testing (fab 6 2024)
          // this.allData.forEach(ele=>{
          //   this.allData.push(ele);
          // })
          // this.allData.forEach(ele=>{
          //   this.allData.push(ele);
          // })
          // this.allData.forEach(ele=>{
          //   this.allData.push(ele);
          // })
          // this.allData.forEach(ele=>{
          //   this.allData.push(ele);
          // })
          // //finish temp code for testing (fab 6 2024)
          this.filterPaginateSearch.itemList = this.allData;

          if (this.allData) {
            if (reportData) {
              console.log('report data======', reportData);

              // Await the result of getCropData
              this.getCropData(reportData).then(() => {
                // Once crop data is fetched, generate the PDF
                this.generatePdf(null);
              }).catch(error => {
                console.error('Error while fetching crop data:', error);
              });
            }
          }

          // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, null, true);

          // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          // this.initSearchAndPagination();
        }
      });

    }
  }

  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }
  getCropBasicDetails(value) {
    const param = {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "variety_code": this.ngForm.controls['variety'].value,
        "variety_line": this.ngForm.controls['variety_line'].value ? this.ngForm.controls['variety_line'].value : '',
        "user_type": "pdpc"
      }
    }
    const route = "get-crop-basic-details";
    const result = this._masterService.postRequestCreator(route, null, param).subscribe(data => {
      this.cropBasicDetails = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      // console.log('cropBasicDetails===', this.cropBasicDetails.indent_quantity);
    })
  }
  getCropBasicDetailsSecond(value) {
    const param = {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "variety_code": this.ngForm.controls['variety'].value,
        "variety_line": this.ngForm.controls['variety_line'].value ? this.ngForm.controls['variety_line'].value : '',
        "user_type": "pdpc"
      }
    }
    const route = "get-crop-basic-details-second";
    const result = this._masterService.postRequestCreator(route, null, param).subscribe(data => {
      this.cropBasicDetails = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      // console.log('cropBasicDetails===', this.cropBasicDetails.indent_quantity);
    })
  }
  revertDataCancelation() {
    // this.removeBspc();
    this.bspc.clear();
    this.ngForm.controls['bspc'].reset;
    this.ngForm.controls['id'].patchValue('');
    // this.ngForm.controls['year'].patchValue('');
    // this.ngForm.controls['season'].patchValue('');
    // this.ngForm.controls['crop'].patchValue('');
    this.ngForm.controls['variety'].patchValue('');
    this.ngForm.controls['nucleus_avail_qnt'].patchValue('')
    this.ngForm.controls['breeder_avail_qnt'].patchValue('')
    this.ngForm.controls['variety_filter'].patchValue('');
    this.ngForm.controls['variety_line'].patchValue('');
    this.cropBasicDetails = [];
    // this.ngForm.disable();
    // this.ngForm.controls['year'].enable();
    this.ngForm.controls['bspc'].enable();
    this.isCrop = false;
    this.is_update = false;
    this.isSearch = true;
    this.isVariety = false;
    this.isPrentalLine = false;
    this.varietyTempValue = ""
    this.varietyLineCode = ""
  }

  resetForm() {

    this.cropBasicDetails = [];
    // this.cropBasicDetailsSecond = [];
    // console.log("this.varietyTempValue===",this.varietyTempValue);

    if (this.varietyTempValue && this.parentalLineVarietyLength && this.parentalLineVarietyLength.length > 1) {
      this.isPrentalLine = true;
      this.ngForm.controls['variety'].setValue(this.varietyTempValue)
      this.ngForm.controls['variety'].enable();
    } else {
      this.varietyTempValue = "";
      this.ngForm.controls['variety'].setValue('');
      this.isPrentalLine = false;
    }


    this.is_update = false;
    this.isVariety = false;
    this.ngForm.controls['id'].setValue('');
    // this.ngForm.controls['variety'].setValue('');
    this.ngForm.controls['variety_line'].setValue('');
    this.ngForm.controls['bspc'].reset;
    this.varietyLineCode = ""
    // this.isPrentalLine = false;
    this.bspc.clear();
  }

  editFunctinality(data, item) {
    console.log('data', data.line_variety_code);
    this.varietyLineCode = data.line_variety_code
    this.ngForm.controls['variety_line'].patchValue(data && data.line_variety_code ? data.line_variety_code : "");
    this.is_update = true;
    this.bspc.clear();
    this.ngForm.controls['id'].patchValue(data && data.id ? data.id : '');
    this.ngForm.controls['year'].patchValue(data && data.year ? data.year : '', { emitEvent: false });
    this.ngForm.controls['season'].patchValue(data && data.season ? data.season : '', { emitEvent: false });
    this.ngForm.controls['crop'].patchValue(data && data.crop_code ? data.crop_code : '', { emitEvent: false });

    if (data && data.line_variety_code) {
      this.ngForm.controls['variety'].setValue(data && data.variety_code ? data.variety_code : '', { emitEvent: false });

      this.ngForm.controls['variety'].disable();
      this.ngForm.controls['variety_line'].disable();
      this.isPrentalLine = true;
    } else {
      this.ngForm.controls['variety'].disable();
      this.ngForm.controls['variety'].patchValue(data && data.variety_code ? data.variety_code : '');
      this.isPrentalLine = false;
    }
    this.getVarietyDataSecond(data.variety_code);
    this.checkParentalLineVarietySecond(data && data.variety_code, data && data.line_variety_code);
    console.log(data, 'dataa')
    this.fetchQntInventryDataUpdate(data, item);
  }

  saveForm() {
    console.log('this.varietyLineCode====', this.varietyLineCode);
    console.log(this.ngForm.controls['variety_line'].value);
    // return
    let param = {
      year: this.ngForm.controls['year'].value,
      season: this.ngForm.controls['season'].value,
      crop_code: this.ngForm.controls['crop'].value,
      variety_code: this.ngForm.controls['variety'].value,
      bspc_array: this.ngForm.controls['bspc'].value,
      user_id: this.userId,
      variety_parental_line: this.ngForm.controls['variety_line'].value ? this.ngForm.controls['variety_line'].value : this.varietyLineCode ? this.varietyLineCode : null
    }
    let route = "add-bsp-proforma-one-data";
    if (this.ngForm.controls['id'].value) {
      param['id'] = this.ngForm.controls['id'].value;
      this.breeder.postRequestCreator(route, null, param).subscribe(res => {
        if (res.EncryptedResponse.status_code === 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Updated Successfully.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
          this.ngForm.controls['variety'].enable();
          this.ngForm.controls['variety_line'].enable();
          this.resetForm();
          this.getPageData(null, null, null);

        } else {
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
        }
      });
    } else {
      this.breeder.postRequestCreator(route, null, param).subscribe(res => {
        if (res.EncryptedResponse.status_code === 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Saved Successfully.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
          this.resetForm();
          this.getPageData(null, null, null);

        } else if (res.EncryptedResponse.status_code === 201) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Already Exits.</p>',
            icon: 'warning',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
          return;
        }
        else {
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
        }
      });
    }
  }

  deleteData(data) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let route = "delete-bsp-proforma-one-data";
        this.breeder.postRequestCreator(route, null, { id: data.id }).subscribe(res => {
          Swal.fire({
            title: "Deleted!",
            text: "Your data has been deleted.",
            icon: "success"
          });
          this.getPageData(null, null, null);
        });
      }
    });
  }
  updateRunningNumber() {
    let route = "update-report-runing-number";
    let runningNumber = this.rportStatusData.running_number + 1
    this.breeder.postRequestCreator(route, null, {
      "report_type": "bsp1",
      "next_val": runningNumber ? runningNumber : 1
    }).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.getReportStatusData();
      }
    });
  }

  generatePdf(param: any) {
    // console.log("kkk",param); 
    let filename = "bsp_one_report"
    const pdfOptions = {
      filename: `${filename}.pdf`,
      margin: [5, 0],
      image: {
        type: 'jpeg',
        quality: 0.3
      },
      html2canvas: {
        dpi: 300,
        scale: 0.75,
        letterRendering: true,
        logging: true,
        useCORS: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a3',
        orientation: 'landscape'
      },
      pagebreak: { mode: ['css', 'legacy'], avoid: 'img' } // Helps with pagebreak issues

    };
    const pages = Array.from(this.pdfContainer.nativeElement.querySelectorAll('div[aria-label^="pdf-page-"]'));

    if (pages.length === 0) {
      console.error('No pages found with the specified aria-label.');
      return;
    }

    let worker = html2PDF().set(pdfOptions).from(pages[0]).toPdf();
    console.log("pages.length ", pages.length)
    if (pages.length > 1) {
      pages.slice(1).forEach((page) => {
        worker = worker
          .get('pdf')
          .then((pdf) => {
            pdf.addPage();
          })
          .from(page)
          .toContainer()
          .toCanvas()
          .toPdf();
      });
    }

    worker.save();
  }
  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-tables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  getReasonName(data) {
    let resonName = this.reasonData.filter(item => item.id == data);
    let resonNameData = resonName && resonName[0] && resonName[0].comment;
    return resonNameData;
  }
  finalSubmit() {
    console.log("final submit");
  }
  capitalizeWords(str) {
    if (str) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    }
  }
  navigateByUrl() {
    this.bspData = {
      year: this.ngForm.controls["year"].value,
      season: this.ngForm.controls["season"].value,
      crop_code: this.ngForm.controls["crop"].value,
      user_id: this.userId
    };
    this.breeder.bspcData = this.bspData ? this.bspData : [];
    this.route.navigate(['breeder-bsp-profarma-one-next']);
  }

  checkDecimal(e) {
    checkDecimalValue(e)
  }
  checkLength($e, length) {
    checkLength($e, length);
  }

  checkNumber($e) {
    checkNumber($e);
  }

  validateField(event, i) {
    if (event.target.checked) {
      this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
    } else {
      if ((this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_available'].value > 0) && (this.ngForm.controls['bspc']['controls'][i].controls['nucleus_seed_available'].value > 0))
        this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
      else
        this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].disable();
    }
  }

  productionTypeValue(value) {
    if (value) {
      this.productionType = value;
      this.getYearData();
    }
  }

}
