import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { MasterService } from 'src/app/services/master/master.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-bsp-third',
  templateUrl: './bsp-third.component.html',
  styleUrls: ['./bsp-third.component.css']
})
export class BspThirdComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  @Output() dataEvent = new EventEmitter<string>();
  ngForm!: FormGroup
  baseUrl: string = environment.ms_nb_01_master.baseUrl;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  is_update: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  varietyList = [];
  cropData: any[] = [];
  varietyData: any[] = [];
  allDirectIndentsData: any[] = [];
  submitted = false;
  dataId: any;
  authUserId: any;
  selectCrop: any;
  croplistSecond: any[];
  selectVariety: any;
  varietyListSecond: any[];
  bspProformaData: any[] = [];
  yearData: any[];
  seasonData: any[];
  districtData: { district_name: string, district_code: string }[] = [];
  stateData: any[] = [];
  isSearchClicked = false;
  isBsp3dataReceived: boolean = false;
  selectedVarieties: any[] = [];
  isReportDownload = false;
  allInspected = false;
  varietyOptions = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    // Add more options as needed
  ];
  responseData = [];
  isReportDownloadSecond: boolean;
  count = 0;
  encryptedData: string;
  user_id: any;
  isRemonitorData = false;
  allData1: any;
  countAll: any;
  constructor(private service: SeedServiceService, private breeder: BreederService, private masterService: MasterService, private productioncenter: ProductioncenterService, private fb: FormBuilder, private router: Router) {
    this.createForm();
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const datas = JSON.parse(BHTCurrentUser);
    this.user_id = datas.id;

  }

  toggleVarietySelection(item: any): void {
    const selectedVarieties = this.ngForm.get('selectedVarieties');
    const index = selectedVarieties.value.indexOf(item);

    if (index === -1) {
      selectedVarieties.patchValue([...selectedVarieties.value, item]);
    } else {
      selectedVarieties.value.splice(index, 1);
      selectedVarieties.patchValue([...selectedVarieties.value]);
    }
  }

  // Check if a variety is selected
  isVarietySelected(item: any): boolean {
    const selectedVarieties = this.ngForm.get('selectedVarieties');
    return selectedVarieties.value.includes(item);
  }

  // Method to handle closing the dropdown
  closeDropdown(): void {
    // Add any additional logic you need when the dropdown is closed
  }

  ngOnInit(): void {
    this.dropdownSettings = {
      idField: 'variety_code',
      textField: 'variety_name',
      // enableCheckAll: false,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      enableCheckAll: true,
    };
    this.ngForm.controls['season'].disable();
    // this.getPageData();
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    this.authUserId = data.id;
    this.getYearData();
    this.service.bsp3rdReportData = [];
    let datas = this.service.bsp3rdReportData2;
    console.log(datas, 'datasdatas')
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: [''],
      variety_text: [''],
      crop_text: [''],
    });

    this.ngForm.controls['crop_text'].valueChanges.subscribe(item => {
      if (item) {
        this.cropData = this.croplistSecond
        let response = this.cropData.filter(x =>
          x.crop_name.toLowerCase().includes(item.toLowerCase())
        );
        this.cropData = response
      }
      else {
        this.getCropData()
      }
    })

    this.ngForm.controls['variety_text'].valueChanges.subscribe(item => {
      if (item) {
        this.varietyData = this.varietyListSecond;
        let response = this.varietyData.filter(x =>
          x.variety_name.toLowerCase().includes(item.toLowerCase()));
        this.varietyData = response
      }
      else {
        this.getVarietyData();
      }
    })

    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      this.ngForm.controls['crop'].reset('');
      this.ngForm.controls['season'].reset('');
      this.ngForm.controls['variety'].reset('');
      this.selectCrop = '';
      if (newvalue) {
        this.ngForm.controls['season'].enable();
        this.getSeasonData();
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['crop'].reset('');
        this.selectCrop = '';
        this.ngForm.controls['crop'].enable();
        this.getCropData();
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      this.selectVariety = '';
      if (newvalue) {
        this.ngForm.controls['variety'].enable();
        this.getVarietyData();
        this.getPageDataReport();
      }
    });

    this.ngForm.controls['variety'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.getPageData();
      }
    });
  }

  formatedDate(dateString: string): string {
    if (!dateString) return 'NA';
    const date = new Date(dateString);
    const year = date.getFullYear() % 100;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  crop(item: any) {
    this.selectCrop = item && item.m_crop.crop_name ? item.m_crop.crop_name : ''
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropData = this.croplistSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
  }

  variety(item: any) {
    this.selectVariety = item && item.m_crop_variety.variety_name ? item.m_crop_variety.variety_name : '',
      this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    this.varietyData = this.varietyListSecond;
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
  }

  searchData() {
    this.submitted = true;
    if (this.ngForm.invalid) {
      return;
    }
    this.isSearchClicked = true;
    // this.getPageDataReport();
    this.getPageData()
  }

  vClick() {
    document.getElementById('variety').click();
  }

  cClick() {
    document.getElementById('crop').click();
  }

  getYearData() {
    const route = "bsp-proforma3-year";
    const param = {
      "user_id": this.authUserId
    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.status === 200) {
        this.yearData = data && data.data ? data.data : '';
      }
    })
  }

  getSeasonData() {
    const route = "bsp-proforma3-season";
    const param = {
      "user_id": this.authUserId,
      "year": this.ngForm.controls['year'].value,
    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.status === 200) {
        this.seasonData = data && data.data ? data.data : '';
      }
    })
  }

  getCropData() {
    const route = "get-crop-data";
    const param = {
      user_id: this.authUserId,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.status === 200) {
        this.cropData = data && data.data ? data.data : '';
        this.croplistSecond = this.cropData;
      }
    })
  }

  getVarietyData() {
    this.ngForm.controls['variety'].patchValue('');
    const route = "get-variety-data";
    const param = {
      "user_id": this.authUserId,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.status === 200) {
        this.varietyData = data && data.data ? data.data : '';
        if (
          this.varietyData && this.varietyData.length > 0
        ) {
          let response = this.varietyData.forEach(item => {
            item.variety_name = item && item.m_crop_variety.variety_name ?
              item.m_crop_variety.variety_name : ''
          })
        }
        this.varietyListSecond = this.varietyData;
      }
    })
  }
  selcetAll(event) {
    if (event && event.length > 0) {
      this.ngForm.controls["variety"].patchValue(event);
      this.getPageData();
    }
  }
  getPageDataReport(loadPageNumberData: number = 1, searchData: any | undefined = undefined , reportData1=null) {
    let varietyCodeArr = [];
    if (this.ngForm.controls["variety"].value && this.ngForm.controls["variety"].value !== undefined && this.ngForm.controls["variety"].value.length > 0) {
      this.ngForm.controls["variety"].value.forEach(ele => {
        varietyCodeArr.push(ele.variety_code);
      })
    }
    let UserId ;
    let reportStatus;
    console.log("jjjj",reportData1);
    if (reportData1) { 
     this.ngForm.controls["year"].setValue(reportData1.year) 
     this.ngForm.controls["season"].setValue(reportData1.season)
     this.ngForm.controls["crop"].setValue(reportData1.crop_code) 
     UserId = reportData1.user_id;
     console.log("ui",UserId);
     
     reportStatus = {report_status:"bsp_two_report_status"}; 
     console.log("isPdfDisbaled");
     
    }else{
      UserId = this.authUserId
    }
    const filters = {
      year: this.ngForm.controls['year'].value,
      season: this.ngForm.controls['season'].value,
      cropCode: this.ngForm.controls['crop'].value,
      varietyCode: varietyCodeArr ? varietyCodeArr : [],
      user_id: UserId,
    };
    const requestParams = {
      page: loadPageNumberData,
      // pageSize:this.filterPaginateSearch.itemListPageSize||1,
      pageSize: 50,
      ...filters,
      ...reportStatus
    }
    this.filterPaginateSearch.itemList = [];
    this.productioncenter.postRequestCreator("get-bsp-proforma3-data", requestParams, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined && apiResponse.status == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          this.allData = apiResponse.data;
          this.bspProformaData = apiResponse.data;
          if (this.allData === undefined) {
            this.allData = [];
          } 
          console.log("all data===",this.allData);
          // this.filterPaginateSearch.itemList= this.allData;
          if(this.allData){
            if (reportData1) {
              this.getreportAllDataPdfData();               
            }
          }
          console.log('this.allData.count====',apiResponse.count);
          this.allInspected = this.allData.every(item => item.bspProforma2.is_inspected === true);
          // apiResponse.count
          // this.filterPaginateSearch.Init(this.allData, this, "getPageData",undefined, apiResponse.count, true);
          // this.initSearchAndPagination();
        }
      });
  }
   
  getreportAllDataPdfData(){
    console.log("dat===",this.allData);
    if (this.allData) {
    this.getreportAllData(this.allData); 
    }
  }
  // getPageDataReport(loadPageNumberData: number = 1, searchData: any | undefined = undefined , reportData1=null) {
  //   let varietyCodeArr = [];
  //   if (this.ngForm.controls["variety"].value && this.ngForm.controls["variety"].value !== undefined && this.ngForm.controls["variety"].value.length > 0) {
  //     this.ngForm.controls["variety"].value.forEach(ele => {
  //       varietyCodeArr.push(ele.variety_code);
  //     })
  //   }
  //   let UserId ;
  //   let reportStatus;
  //   console.log("jjjj",reportData1);
  //   if (reportData1) { 
  //    this.ngForm.controls["year"].setValue(reportData1.year) 
  //    this.ngForm.controls["season"].setValue(reportData1.season)
  //    this.ngForm.controls["crop"].setValue(reportData1.crop_code) 
  //    UserId = reportData1.user_id;
  //    console.log("ui",UserId);
     
  //    reportStatus = {report_status:"bsp_two_report_status"}; 
  //    console.log("isPdfDisbaled");
     
  //   }else{
  //     UserId = this.authUserId
  //   }
  //   const filters = {
  //     year: this.ngForm.controls['year'].value,
  //     season: this.ngForm.controls['season'].value,
  //     cropCode: this.ngForm.controls['crop'].value,
  //     varietyCode: varietyCodeArr ? varietyCodeArr : [],
  //     user_id: UserId,
  //   };
  //   const requestParams = {
  //     // page: loadPageNumberData,
  //     // pageSize:this.filterPaginateSearch.itemListPageSize||1,
  //     ...filters,
  //     ...reportStatus
  //   }
  //   this.filterPaginateSearch.itemList = [];
  //   this.productioncenter.postRequestCreator("get-bsp-proforma3-data-report", requestParams, null)
  //     .subscribe((apiResponse: any) => {
  //       if (apiResponse !== undefined && apiResponse.status == 200) {
  //         // this.filterPaginateSearch.itemListPageSize = 1;
  //         this.allData = apiResponse.data;
  //         this.allData1 = apiResponse.data;
  //         this.bspProformaData = apiResponse.data;
  //         if (this.allData === undefined) {
  //           this.allData = [];
  //         } 
  //         console.log("all data===",this.allData);
  //         this.filterPaginateSearch.itemList= this.allData;
  //         if(this.allData1){
  //           if (reportData1) {
  //             console.log('Hii')
  //             this.getreportAllDataPdfData();               
  //           }
  //         }
  //         console.log('this.allData.count====',apiResponse.count);
  //         this.allInspected = this.allData.every(item => item.bspProforma2.is_inspected === true);
  //         // apiResponse.count
  //         this.filterPaginateSearch.Init(this.allData, this, "getPageData",undefined, undefined, true);
  //         this.initSearchAndPagination();
  //       }
  //     });
  // }
  // getreportAllDataPdfData(){
  //   this.getreportAllData(this.allData1);
  // }
  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined , reportData1=null) {
    let varietyCodeArr = [];
    if (this.ngForm.controls["variety"].value && this.ngForm.controls["variety"].value !== undefined && this.ngForm.controls["variety"].value.length > 0) {
      this.ngForm.controls["variety"].value.forEach(ele => {
        varietyCodeArr.push(ele.variety_code);
      })
    }
    let UserId ;
    let reportStatus;
    console.log("jjjj",reportData1);
    if (reportData1) { 
     this.ngForm.controls["year"].setValue(reportData1.year) 
     this.ngForm.controls["season"].setValue(reportData1.season)
     this.ngForm.controls["crop"].setValue(reportData1.crop_code) 
     UserId = reportData1.user_id;
     console.log("ui",UserId);
     
     reportStatus = {report_status:"bsp_two_report_status"}; 
     console.log("isPdfDisbaled");
     
    }else{
      UserId = this.authUserId
    }
    const filters = {
      year: this.ngForm.controls['year'].value,
      season: this.ngForm.controls['season'].value,
      cropCode: this.ngForm.controls['crop'].value,
      varietyCode: varietyCodeArr ? varietyCodeArr : [],
      user_id: UserId,
    };
    const requestParams = {
      page: loadPageNumberData,
      // pageSize:this.filterPaginateSearch.itemListPageSize||1,
      pageSize: 50,
      ...filters,
      ...reportStatus
    }
    this.filterPaginateSearch.itemList = [];
    this.productioncenter.postRequestCreator("get-bsp-proforma3-data", requestParams, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined && apiResponse.status == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          this.allData = apiResponse.data;
          this.bspProformaData = apiResponse.data;
          this.countAll = apiResponse.count
          if (this.allData === undefined) {
            this.allData = [];
          } 
          console.log("all data===",this.allData);
          this.filterPaginateSearch.itemList= this.allData;
          // if(this.allData){
          //   if (reportData1) {
          //     this.getreportAllData(null,this.allData);               
          //   }
          // }
          console.log('this.allData.count====',apiResponse.count);
          this.allInspected = this.allData.every(item => item.bspProforma2.is_inspected === true);
          // apiResponse.count
          this.filterPaginateSearch.Init(this.allData, this, "getPageData",undefined, apiResponse.count, true);
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

  getreportAllData(data: any,data1=null) {
    
    console.log("responseData is",data);
    console.log("responseData1 is",data1);
    // this.responseData = Object.assign([], data);
    if (data1) {
      
    this.responseData = Object.assign([], data1);
    console.log("responseData1 is",this.responseData);
    } else {

    this.responseData = Object.assign([], data);
    }
    console.log("responseData is",this.responseData);
    
 
    this.isReportDownload = false; 
    this.isReportDownloadSecond = true;
     let user_id;
    if (data) {
         user_id= data[0].agencyDetails.user_id
         console.log("responseData1 user_id is",user_id);

    } else {
        user_id = this.user_id;
        console.log("pdf user_id is",user_id);
    }
     
    
    if (this.responseData && this.responseData.length > 0) {
      this.responseData.forEach((el, index) => {
        // 
        // console.log(el,'reportData')
        let reportData = Object.assign({}, el);
        let dataForRemonitoring: any;
        let isRemonitoring = false;
        if (reportData.reinspection_data && reportData.reinspection_data.length > 0 && reportData.reinspection_data[0].report.toLowerCase() != el.report.toLowerCase()) {
          dataForRemonitoring = Object.assign([], el);
          const reinspectionData = dataForRemonitoring.reinspection_data[0];
          reportData.report = reinspectionData.report;
          reportData.crop_condition = reinspectionData.crop_condition;
          reportData.date_of_inspection = reinspectionData.date_of_inspection;
          reportData.rejected_area = reinspectionData.rejected_area;
          reportData.inspected_area = reinspectionData.inspected_area;
          reportData.field_img = reinspectionData.field_img;
          reportData.field_code = reinspectionData.field_code;
          reportData.area_shown = reinspectionData.area_shown;
          reportData.date_of_harvesting = reinspectionData.date_of_harvesting;
          reportData.date_of_showing = reinspectionData.date_of_showing;
          reportData.estimated_production = reinspectionData.estimated_production;
          reportData.expected_production = reinspectionData.expected_production;
          reportData.harv_to_date = reinspectionData.harv_to_date;
          reportData.inspection_date = reinspectionData.inspection_date;
          reportData.latitude = reinspectionData.latitude;
          reportData.longitude = reinspectionData.longitude;
          reportData.reason = reinspectionData.reason;
          reportData.report_ref_no = reinspectionData.report_ref_no;
          let id = reportData && reportData.id ? reportData.id : '';
          isRemonitoring = true;
          console.log(reportData,'reportData')
          reportData.isRemonitorData = true;
          const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id, user_id, isRemonitoring }), 'a-343%^5ds67fg%__%add').toString();
          this.encryptedData = encodeURIComponent(encryptedForm);
          reportData.encryptedDataId = this.encryptedData;
          this.responseData.push(reportData);
        }
        let id = el && el.id ? el.id : ''
        isRemonitoring = false;
        el.isRemonitorData = false;
      
        const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id, user_id, isRemonitoring }), 'a-343%^5ds67fg%__%add').toString();
        this.encryptedData = encodeURIComponent(encryptedForm);
        el.encryptedDataId = this.encryptedData;
   
      });
    }
    this.responseData.forEach((obj) => {
      obj.monitoringTeam.forEach((item) => {
          // Check if isRemonitorData is true and monitoringTeam.is_active == 1
          if (obj.isRemonitorData) {
            if(item.monitoringMember && item.monitoringMember.showReportData)
              item.monitoringMember.showReportData = true;
          } else if (!obj.isRemonitorData) {
              // Check if isRemonitorData is false and monitoringTeam.is_active == 0
              if(item.monitoringMember && item.monitoringMember.showReportData)
                item.monitoringMember.showReportData = false;
          } 
          
      });
  });
    
   
  // Call the function and store the transformed data
  // this.responseData = transformData(this.responseData);

  // Log the transformed data to console
  // console.log(transformedData,'monitoringTeam');
    //     else if(el && el.monitoringTeam &&  el.isRemonitorData){
    //       el.monitoringTeam.forEach((item,i)=>{
    //         if(item && item.is_active && item.is_active==1){
    //           item.monitoringMember.showReportData=true
    //         }else{
    //           item.monitoringMember.showReportData=false
    //         }
    //       })
          
    //     }
    //   })
    // }
   
    console.log(this.responseData,'data && data.monitoringTeam &&  data.isRemonitorData')
    this.downloadPDF()
  }

  getreportData(data: any, isRemonitoring: boolean) {
    console.log(data,'data')
    this.responseData = [];
    this.service.bsp3rdReportData = [];
    this.isReportDownload = true;
    this.isReportDownloadSecond = false
    data.isReportDownload = this.isReportDownload;
    
    if (isRemonitoring) {
      let reportData: any;
      this.responseData = Object.assign({}, data);
      reportData = this.responseData;
      if (reportData.reinspection_data && reportData.reinspection_data.length > 0) {
        const reinspectionData = reportData.reinspection_data[0];
        reportData.report = reinspectionData.report;
        reportData.crop_condition = reinspectionData.crop_condition;
        reportData.date_of_inspection = reinspectionData.date_of_inspection;
        reportData.rejected_area = reinspectionData.rejected_area;
        reportData.inspected_area = reinspectionData.inspected_area;
        reportData.field_img = reinspectionData.field_img;
        reportData.field_code = reinspectionData.field_code;
        reportData.area_shown = reinspectionData.area_shown;
        reportData.date_of_harvesting = reinspectionData.date_of_harvesting;
        reportData.date_of_showing = reinspectionData.date_of_showing;
        reportData.estimated_production = reinspectionData.estimated_production;
        reportData.expected_production = reinspectionData.expected_production;
        reportData.harv_to_date = reinspectionData.harv_to_date;
        reportData.inspection_date = reinspectionData.inspection_date;
        reportData.latitude = reinspectionData.latitude;
        reportData.longitude = reinspectionData.longitude;
        reportData.reason = reinspectionData.reason;
        reportData.report_ref_no = reinspectionData.report_ref_no;
        reportData.isRemonitorData = isRemonitoring;
      }
      this.responseData = [reportData];
    } else {
      this.responseData = [data];
    }
    if(this.responseData && this.responseData.length>0){
      this.responseData.forEach((el,i)=>{
        if(el && el.monitoringTeam && !el.isRemonitorData){
          el.monitoringTeam.forEach((item,j)=>{
            if(item && item.is_active && item.is_active==1){
              if(item.monitoringMember && item.monitoringMember.showReportData)
                item.monitoringMember.showReportData=false
            }else{
              if(item.monitoringMember && item.monitoringMember.showReportData)
                item.monitoringMember.showReportData=true
            }
          })
        }
        if(el && el.monitoringTeam && el.isRemonitorData){
          el.monitoringTeam.forEach((item,j)=>{
            console.log(item.is_active)
            if(item && item.is_active && item.is_active==1){
              if(item.monitoringMember && item.monitoringMember.showReportData)
                item.monitoringMember.showReportData=true
            }else{
              if(item.monitoringMember && item.monitoringMember.showReportData)
                item.monitoringMember.showReportData=false
            }
          })
        }
      })
    }

    console.log(this.responseData,'repos')
   
    const user_id = this.user_id;
    const id = data.id;
    this.encryptedData = CryptoJS.AES.encrypt(JSON.stringify({ id, user_id, isRemonitoring }), 'a-343%^5ds67fg%__%add').toString();
    this.encryptedData = encodeURIComponent(this.encryptedData);
    this.responseData[0].encryptedDataId = this.encryptedData;
    this.downloadPDF();
  }

  getFormattedSeason(season) {
    switch (season) {
      case 'R':
        return 'Rabi';
      case 'K':
        return 'Kharif';
      default:
        return '--';
    }
  }
  formatDateRange(fromDate: string, toDate: string): string {
    if (!fromDate || !toDate) {
      return 'NA';
    }
    const formattedFromDate = this.formatedDate(fromDate);
    const formattedToDate = this.formatedDate(toDate);
    return `${formattedFromDate} - ${formattedToDate}`;
  }
  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  downloadPDF() {
    const element = document.getElementById('yourPdfContentId');
    if (element) {
      const opt = {
        margin: [5,0],
        filename: 'bsp3Report.pdf',
        image: { type: 'jpeg', quality: 0.5 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' },
        pagebreak: { after: ['#page-break1'], avoid: 'img' },
      };
      html2pdf().from(element).set(opt).save();
    }
  }
  getquantityUnit(varietyCode: any) {
    if(varietyCode){
      if (varietyCode.slice(0, 1) == "A") {
        return "Qt";
      } else {
        return "Kg";
      }
    }
  }
  getReturnData(item,obj){
    if(obj){
      if(item.is_active==0){
        return true
      }
    }
    else{
      if(item.is_active==1){
        return true
      }
    }

  }
}