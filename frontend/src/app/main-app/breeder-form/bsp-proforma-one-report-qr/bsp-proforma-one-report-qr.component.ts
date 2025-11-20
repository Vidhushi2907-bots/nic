import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { MasterService } from 'src/app/services/master/master.service';
// import * as html2PDF from 'html2pdf.js';
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// //pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-bsp-proforma-one-report-qr',
  templateUrl: './bsp-proforma-one-report-qr.component.html',
  styleUrls: ['./bsp-proforma-one-report-qr.component.css']
})
export class BspProformaOneReportQrComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup;

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  is_developed: boolean;
  is_update: boolean = false;
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
  bspsDataArray: { id: number; production_center: string; season: string; crop: string; variety_name: string; variety_code: string; bspc_developed_by: number; req_no_doc_moa: string; req_no_dept_moa: string; nucleus_seed_available: string; breeder_seed_available: string; total_target: string; }[];
  userId: any;
  bspData: any;
  isFinalSubmit: boolean = true;
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
  selectedData: any;
  viewheader: boolean;


  id: string | null = null;
  user_id: string | null = null;
  decryptedData: any = {};
  refNo: void;
  agencyId: any;
  stateName: any;
  districtName: any;
  currentDateNew: any;

  constructor(private service: SeedServiceService, private _masterService: MasterService, private breeder: BreederService, private fb: FormBuilder, private route: Router, private _productionCenter: ProductioncenterService, private master: MasterService, private router: ActivatedRoute) {
    this.createForm();
    this.bspcData = this.breeder.redirectData;
    if (this.bspcData && this.bspcData !== undefined && this.bspcData != null) {
      if (this.bspcData.year && this.bspcData.season && this.bspcData.crop_code) {
        this.ngForm.controls['year'].patchValue(this.bspcData.year);
        this.ngForm.controls['season'].patchValue(this.bspcData.season);
        this.ngForm.controls['crop'].patchValue(this.bspcData.crop_code);
        this.getPageData();
      }
    }
  }

  createForm() {
    this.ngForm = this.fb.group({
      id: [''],
      year: [''],
      season: [''],
      crop: [''],
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
        this.getCropData();
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
          // console.log("varietyStatus", varietyStatus[0].status);
          // [0].status

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
      reason: ['']
    })
  }

  ngOnInit(): void {
    this.fetchData();
    // const userData = localStorage.getItem('BHTCurrentUser');
    // const data = JSON.parse(userData);
    // // this.userId = data.id;
    // this.pdpcName = data && data.name ? data.name : 'NA';
    // this.pdpcAddres = data && data.address ? data.address : 'NA';

  }

  
  fetchData() {
    this.getYearData();
    this.getReportStatusData();
    this.getStatelist();
    this.getDistrictListSecond();
    this.getCommentData();

    this.dropdownSettings = {
      idField: 'variety_code',
      textField: 'variety_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      itemsShowLimit: 2,
      limitSelection: -1,
    };

    this.router.params.subscribe(params => {
      const encryptedData = params['encryptedData'];
      try {
        const decodedEncryptedData = decodeURIComponent(encryptedData);
        const bytes = CryptoJS.AES.decrypt(decodedEncryptedData, 'a-343%^5ds67fg%__%add');
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        // const decryptedData = JSON.parse(decryptedString);
        const decryptedData = JSON.parse(decryptedString);
        console.log('decryptedData===',decryptedData);
        this.ngForm.controls['year'].setValue(decryptedData.y);
        this.ngForm.controls['season'].setValue(decryptedData.s);
        this.ngForm.controls['crop'].setValue(decryptedData.c);
        this.currentDateNew =  (decryptedData.d);
        this.userId = decryptedData.uid;
        // this.refNo = decryptedData.ref_no;
        // this.pdpcName = decryptedData.pdpcName,
        // this.agencyId = decryptedData.agency_id
        // this.pdpcAddres = decryptedData.pdpcAddress,
        this.getAgencyData(this.userId);
        this.getVarietyData(null);
        this.checkIsFinalSubmit();
        this.getTeamMemberSecond();
        this.getCropBasicDetails(null);
        this.getPageData();
      } catch (error) {
        console.error("Error decrypting or parsing data:", error);
      }
    });
  }
  getAgencyData(id) {
    // const data = localStorage.getItem('BHTCurrentUser')
    // let userData = JSON.parse(data)
    
    this._masterService.postRequestCreator('getAgencyUserDataByIdReport1/' + id).subscribe(data => {
      // let res = 2
      console.log("data===",data);
      
      let apiResponse = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      console.log('apiResponse====',apiResponse['m_designation.name']);
      this.profileData = apiResponse ? apiResponse : '';
      // contact_person_name
      if (apiResponse && apiResponse.agency_name) {
        this.userName = apiResponse.agency_name.charAt(0).toUpperCase() + apiResponse.agency_name.slice(1);
      }
      if (apiResponse && apiResponse.address) {
        this.pdpcAdrress = apiResponse.address.charAt(0).toUpperCase() + apiResponse.address.slice(1);
      }
      if (apiResponse && apiResponse.image_url2) {
        this.pdpcImageUrl = apiResponse.image_url2.charAt(0).toUpperCase() + apiResponse.image_url2.slice(1);
      }
      if (apiResponse && apiResponse['m_designation'] && apiResponse['m_designation.name']) {
        this.pdpcDesignation = apiResponse['m_designation.name'].charAt(0).toUpperCase() + apiResponse['m_designation.name'].slice(1);
      }
      if (apiResponse && apiResponse.state_name) {
        this.stateName = apiResponse.state_name.charAt(0).toUpperCase() + apiResponse.state_name.slice(1);
      }
      if (apiResponse && apiResponse.district_name) {
        this.districtName = apiResponse.district_name.charAt(0).toUpperCase() + apiResponse.district_name.slice(1);
      }
      // pdpcImageUrl ? pdpcImageUrl
    })
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
      // search: {
      //   state_code: newValue
      // }
    }
    this.master.postRequestCreator('get-district-list-report', null, param).subscribe(data => {
      this.listofDistrict = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
    })
  }

  getDistrictName(value, stateVal) {
    if (this.listofDistrict) {
      let districtData = this.listofDistrict.filter(ele => ele.district_code == value && ele.state_code == stateVal)
      let districtNameValue = districtData && districtData[0] && districtData[0].district_name
      return districtNameValue;
    }
  }

  getStateName(value) {
    if (this.stateList) {
      let stateData = this.stateList.filter(ele => ele.state_code == value);
      let stateNameValue = stateData && stateData[0] && stateData[0].state_name;
      return stateNameValue;
    }
  }
  checkIsFinalSubmit() {
    let param = {
      year: (this.ngForm.controls["year"].value),
      crop_code: this.ngForm.controls["crop"].value,
      season: this.ngForm.controls["season"].value,
      user_id: this.userId
    }
    this.breeder.postRequestCreator("check-bsp-one-variety-availability", null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        if (res.EncryptedResponse.data && res.EncryptedResponse.data[0]) {
          // this.isSubmit = res.EncryptedResponse.data.isDisable; 
          if (res.EncryptedResponse.data[0].isDisable == "true") {
            this.isSubmit = true;
            this.isFinalSubmit = true;
          } else {
            this.isSubmit = false;
            this.isFinalSubmit = false;
          }
          console.log("is final submit1 ", this.isSubmit);
        }
      }
    })
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
    this.breeder.postRequestCreator(route, null, null).subscribe(data => {
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
        "user_type": "pdpc"
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventorySeasonData = data.EncryptedResponse.data
      }
    })
  }

  getCropData() {
    const route = "get-bsp-proforma-one-crop-report";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "user_type": "pdpc"
      }
    }).subscribe(data => {
      console.log("season data vale", data);
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryCropData = data.EncryptedResponse.data
      }
    })
  }
  getCropName(value) {
    if (this.inventoryCropData) {
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
        "user_type": "bspc"
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

  getVarietyDataSecond() {
    const route = "get-bsp-proforma-one-variety-second";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "user_type": "bspc"
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryVarietyData = data.EncryptedResponse.data
        if (this.inventoryVarietyData.length < 1 || this.inventoryVarietyData === undefined || this.inventoryVarietyData === null) {
          this.isFinalSubmit = false;
          // this.checkIsFinalSubmit();
        } else {
          this.isFinalSubmit = true;
          // this.checkIsFinalSubmit();
        }
      }
    })
  }

  //method
  checkParentalLineVariety(newData) {
    console.log(newData);
    let route = "get-bsp-proforma-one-variety-line-new-data";
    let param = {
      variety_code: newData ? newData : ''
    }
    this.breeder.postRequestCreator(route, null, param).subscribe(data => {
      this.parentalLineVariety = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.parentalLineVarietyLength = this.parentalLineVariety;
    })
  }

  checkParentalLineVarietySecond(newData) {
    console.log(newData);
    let route = "get-bsp-proforma-one-variety-line-data-new-second";
    let param = {
      variety_code: newData ? newData : ''
    }
    this.breeder.postRequestCreator(route, null, param).subscribe(data => {
      this.parentalLineVariety = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }

  selcetAll(event) {
    if (event && event.length > 0) {
      this.ngForm.controls["variety_filter"].patchValue(event);
      this.getPageData();
    }
  }
  openpopup() {
    this.displayStyle = 'block'
  }
  close() {
    this.displayStyle = 'none'
  }
  getBspcTeamData(index, team_id) {
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
    const route = "get-bsp-monitoring-team-report";
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
    if (this.teamdetailsDataSecond) {
      let monitoringTeamData = this.teamdetailsDataSecond.filter(ele => ele.id == data);
      return monitoringTeamData;
    }
  }
  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.isSearch = false;
    this.isCrop = true;
    this.varietyDisbled = false;
    this.ngForm.controls['variety_filter'].enable();
    let varietyCodeArr = [];
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
    this.breeder.postRequestCreator("get-bsp-proforma-one-data-qr", null, {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 100,
      // pageSize: 50,
      user_id: this.userId,
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value,
        variety_code_array: varietyCodeArr && (varietyCodeArr.length > 0) ? varietyCodeArr : null,
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

        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, null, true);

        // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        this.initSearchAndPagination();
      }
    });

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


  getReasonName(data) {
    if (this.reasonData) {
      let resonName = this.reasonData.filter(item => item.id == data);
      let resonNameData = resonName && resonName[0] && resonName[0].comment;
      return resonNameData;
    }
  }

}
