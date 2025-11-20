import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { MasterService } from 'src/app/services/master/master.service';
import { checkDecimalValue, checkLength, checkNumber } from 'src/app/_helpers/utility';
import { IAngularMyDpOptions, IMyDefaultMonth } from 'angular-mydatepicker';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-breeder-seed-willing-to-produce',
  templateUrl: './breeder-seed-willing-to-produce.component.html',
  styleUrls: ['./breeder-seed-willing-to-produce.component.css']
})
export class BreederSeedWillingToProduceComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup
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
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryCropData: any;
  inventoryVarietyData: any;
  getDirectIndentAndIventryValue: any;
  getwillingProducionFilterVarietyData: any;
  userId: any;
  finalSubmitBtn: boolean = true;
  isFinalSubmit: boolean = true;
  isSubmit: boolean;
  unitValue: string;
  errorMsgNucleus: string;
  errorMsgBreeder: string;
  ErrorNucleus: boolean;
  ErrorBreeder: boolean;
  parentalList: any;
  showParentData: boolean;
  selectVariety: any;
  selectparental: any;
  isWilling: number;
  selectReason: any;
  varietyTempValue: any;
  parentalLineVarietyLength: any;
  reasonData: any;
  isProductionDelay = false;
  submitted = false;
  todayDate = new Date();
  parsedDate = Date.parse(this.todayDate.toString());
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
  };
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };
  reasonTypeValue: string;
  nculeusSeedText: string = '';
  get generateDefaultMonth(): string {
    let date = { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }
    return date.year + '-' + (date.month > 9 ? "" : "0") + date.month + '-' + (date.day > 9 ? "" : "0") + date.day;
  }

  constructor(private datePipe: DatePipe, private service: SeedServiceService, private breeder: BreederService, private fb: FormBuilder,
    private masterService: MasterService,
    private _productionCenter: ProductioncenterService) {
    this.createForm();
  }

  createForm() {
    this.ngForm = this.fb.group({
      id: [''],
      year: [''],
      season: [''],
      crop: [''],
      variety: [''],
      parental_data: [''],
      variety_filter: [''],
      is_developed: ['no'],
      is_production_delay: ['no'],
      reason: [''],
      reason_for_delay: [''],
      expected_date: [''],
      nucleus_avail_qnt: [0],
      breeder_avail_qnt: [0],
      direct_avail_qnt: [0],
      nucleus_willing_qnt: [],
      breeder_willing_qnt: [],
      vaiety_text: [''],
      parental_text: ['']
    });

    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop'].disable();
    this.ngForm.controls['year'].enable();
    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.parentalLineVarietyLength = [];
        this.varietyTempValue = "";
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['crop'].disable();
        this.getSeasonData();
        this.isDeveloped = false;
        this.is_developed = false;
        this.isSearch = true;
        this.isCrop = false;
        this.selectVariety = '';
        this.selectparental = ''
        this.ngForm.controls['variety'].setValue('');
        this.showParentData = false;
        this.ngForm.controls['is_developed'].setValue('');
        this.ngForm.controls['is_production_delay'].setValue('');
        this.nculeusSeedText = '';
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.parentalLineVarietyLength = [];
        this.varietyTempValue = "";
        this.ngForm.controls['crop'].enable();
        this.getCropData();
        this.isDeveloped = false;
        this.isSearch = true;
        this.is_developed = false;
        this.isCrop = false;
        this.selectVariety = '';
        this.selectparental = ''
        this.nculeusSeedText = '';;
        this.ngForm.controls['variety'].setValue('');
        this.showParentData = false;
        this.ngForm.controls['is_developed'].setValue('');
        this.ngForm.controls['is_production_delay'].setValue('');
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        if (newvalue.slice(0, 1) == "H") {
          this.unitValue = "Kg";
          console.log(newvalue.slice(0, 1));
        }
        if (newvalue.slice(0, 1) == "A") {
          this.unitValue = "Qt";
          console.log(newvalue.slice(0, 1));
        }
        this.parentalLineVarietyLength = [];
        this.varietyTempValue = "";
        this.isSearch = true;
        this.isCrop = false;
        this.ngForm.controls['variety'].enable();
        this.ngForm.controls['is_developed'].setValue('');
        this.ngForm.controls['is_production_delay'].setValue('');
        this.showParentData = false;
        this.selectVariety = '';
        this.nculeusSeedText = '';
        console.log('newvalue', newvalue.slice(0, 1));
        this.getVarietyData(null);
      }
    });

    this.ngForm.controls['variety'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['is_developed'].enable();
        this.ngForm.controls['parental_data'].setValue('')
        let res = this.inventoryVarietyData.filter(x => x.variety_code == newvalue)
        if (res && res[0] && res[0].status && res[0].status == 'hybrid') {
          this.showParentData = true;
          this.varietyTempValue = newvalue;
          this.getParentalData();
        } else {
          this.parentalLineVarietyLength = [];
          this.varietyTempValue = "";
          this.fetchQntInventryData(null);
          this.showParentData = false;
        }
        console.log(res, 'variety_code')
        this.ngForm.controls['nucleus_avail_qnt'].disable();
        this.ngForm.controls['breeder_avail_qnt'].disable();
        this.ngForm.controls['direct_avail_qnt'].disable();
        this.ngForm.controls['nucleus_willing_qnt'].enable();
        this.ngForm.controls['breeder_willing_qnt'].enable();
      }
    });
    this.ngForm.controls['is_developed'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.isDeveloped = true;
        this.ngForm.controls['reason'].enable();
      }
    });
    this.ngForm.controls['parental_data'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.fetchQntInventryData(null)
      }
    });
    this.ngForm.controls['reason_for_delay'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        if (newvalue === "Insufficient Nucleus Seeds") {
          this.nculeusSeedText = "Tentative"
          this.ngForm.controls['nucleus_willing_qnt'].enable()
        } else {
          if (this.ngForm.controls['nucleus_avail_qnt'].value > 0) {
            this.nculeusSeedText = ""
            this.ngForm.controls['nucleus_willing_qnt'].enable();
            this.ngForm.controls['nucleus_willing_qnt'].setValue(0);
          } else {
            this.nculeusSeedText = ""
            this.ngForm.controls['nucleus_willing_qnt'].disable()
            this.ngForm.controls['nucleus_willing_qnt'].setValue(0);
          }
        }
      }
    })
  }

  ngOnInit(): void {
    this.fetchData();
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    this.userId = data.id;
  }
  getParentalData() {
    const param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
      }
    }
    this.breeder.postRequestCreator('get-parental-data', null, param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.parentalList = response ? response : '';
        this.parentalLineVarietyLength = this.parentalList;
      }
    })
  }

  fetchData() {
    this.getFiterVarietyData();
    this.getYearData();
    this.getCommentData();
    this.dropdownSettings = {
      idField: 'variety_code',
      textField: 'variety_name',
      enableCheckAll: true,
      allowSearchFilter: true,
    };
  }

  getCommentData() {
    let reasonType;
    const route = "get-commnets-list?type=" + this.reasonTypeValue;
    this.masterService.getRequestCreatorNew(route).subscribe(data => {
      if (data['EncryptedResponse'].status_code === 200) {
        console.log('EncryptedResponse===', data['EncryptedResponse'].data);
        this.reasonData = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : [];
      }
    })
  }

  fetchQntInventryData(value) {
    let route = "get-inventry-and-indent-data";
    let param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value,
        variety_code: this.ngForm.controls["variety"].value,
        parental_data: this.ngForm.controls["parental_data"].value ? this.ngForm.controls["parental_data"].value : value ? value : '',
        user_id: this.userId
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.getDirectIndentAndIventryValue = data.EncryptedResponse.data
        this.ngForm.controls['nucleus_avail_qnt'].patchValue(this.getDirectIndentAndIventryValue && this.getDirectIndentAndIventryValue.nucleus_qnt ? (this.unitValue == 'Qt' ? (this.getDirectIndentAndIventryValue.nucleus_qnt.toFixed(3)) / 100 : this.getDirectIndentAndIventryValue.nucleus_qnt.toFixed(3)) : 0);
        this.ngForm.controls['breeder_avail_qnt'].patchValue(this.getDirectIndentAndIventryValue && this.getDirectIndentAndIventryValue.iventry_qnt ? (this.unitValue == 'Qt' ? (this.getDirectIndentAndIventryValue.iventry_qnt.toFixed(3)) / 100 : this.getDirectIndentAndIventryValue.iventry_qnt.toFixed(3)) : 0);
        this.ngForm.controls['direct_avail_qnt'].patchValue(this.getDirectIndentAndIventryValue && this.getDirectIndentAndIventryValue.dierct_indent ? (this.getDirectIndentAndIventryValue.dierct_indent.toFixed(3)) : 0);
      }
      if (this.ngForm.controls['nucleus_avail_qnt'].value > 0) {
        this.nculeusSeedText = ""
        this.ngForm.controls['nucleus_willing_qnt'].enable();
        // this.ngForm.controls['nucleus_willing_qnt'].setValue(0);
      } else {
        this.nculeusSeedText = ""
        this.ngForm.controls['nucleus_willing_qnt'].disable()
        this.ngForm.controls['nucleus_willing_qnt'].setValue(0);
      }
      if (this.ngForm.controls['nucleus_avail_qnt'].value == 0) {

        // this.ngForm.controls['nucleus_willing_qnt'].disable();
        // this.ngForm.controls['nucleus_willing_qnt'].setValue(0);
      }
      if (this.ngForm.controls['breeder_avail_qnt'].value <= 0) {
        this.ngForm.controls['breeder_willing_qnt'].disable();
        this.ngForm.controls['breeder_willing_qnt'].setValue(0);
      }
      if ((this.ngForm.controls['nucleus_willing_qnt'].value && this.ngForm.controls['nucleus_willing_qnt'].value != 0) || (this.ngForm.controls['breeder_willing_qnt'].value && this.ngForm.controls['breeder_willing_qnt'].value != 0)) {
        if (!this.is_update) {
          this.ngForm.controls['is_developed'].setValue('yes');
          this.notifiedvalue('yes');
        }
      } else {
        if (!this.is_update) {
          this.ngForm.controls['is_developed'].setValue('no');
          this.notifiedvalue('no');
        }
      }
    });
  }
  checkQntData(type) {
    if (type == 'nucleus') {
      if (this.ngForm.controls['reason_for_delay'].value === "Insufficient Nucleus Seeds") {
        this.ErrorNucleus = false;
      } else {
        if (parseFloat(this.ngForm.controls['nucleus_avail_qnt'].value) >= parseFloat(this.ngForm.controls['nucleus_willing_qnt'].value)) {
          this.ErrorNucleus = false;
          this.errorMsgNucleus = '';
        } else {
          this.errorMsgNucleus = "Less than or equal to Quantity of Nucleus Seed Available";
          this.ErrorNucleus = true;
          return;
        }
      }
    }
    if (type == 'breeder') {
      if ((this.ngForm.controls['breeder_avail_qnt'].value) >= (this.ngForm.controls['breeder_willing_qnt'].value)) {
        this.ErrorBreeder = false;
        this.errorMsgBreeder = '';
      } else {
        this.errorMsgBreeder = "Less than or equal to Quantity of Breeder Seed Available";
        this.ErrorBreeder = true;
        return;
      }
    }
  }
  getYearData() {
    const route = "get-year-assign-indenter-data-willing-produce";
    this.breeder.postRequestCreator(route, null, null).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryYearData = data.EncryptedResponse.data
      }
    })
  }

  getSeasonData() {
    const route = "get-season-assign-indenter-data-willing-produce";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "user_type": "bspc"
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventorySeasonData = data.EncryptedResponse.data
      }
    })
  }

  getCropData() {
    const route = "get-crop-assign-indenter-data-willing-produce";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "user_type": "bspc"
      }
    }).subscribe(data => {
      console.log("season data vale", data);
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryCropData = data.EncryptedResponse.data
      }
    })
  }
  checkIsFinalSubmit() {
    let param = {
      year: (this.ngForm.controls["year"].value),
      crop_code: this.ngForm.controls["crop"].value,
      season: this.ngForm.controls["season"].value,
      user_id: this.userId
    }
    this._productionCenter.postRequestCreator("check-willing-to-produce-crop-variety-availability", param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        if (res.EncryptedResponse.data && res.EncryptedResponse.data[0]) {
          if (res.EncryptedResponse.data[0].isDisable == "true") {
            this.isSubmit = true;
            this.isFinalSubmit = true;
          }
          else {
            this.isSubmit = false;
            this.isFinalSubmit = false;
          }
        }
      }
    })
  }
  getVarietyData(value) {
    const route = "get-assign-indenter-variety-data-willing-produce";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "user_type": "bspc"
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryVarietyData = data.EncryptedResponse.data;
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

  getVarietyData2() {
    const route = "get-assign-indenter-variety-data-willing-produce-second";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "user_type": "bspc"
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryVarietyData = data.EncryptedResponse.data;
      }
    })
  }
  varietyAvailabiltyCheck() {
    let param = {
      search: {
        yaer: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value,
      }
    }
    let route = "check-willing-produce-variety-availability";
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.isFinalSubmit = false;
      } else if (res.EncryptedResponse.status_code === 201) {
        this.isFinalSubmit = true;
      } else {
      }
    });
  }
  selcetAll(event) {
    if (event && event.length > 0) {
      this.ngForm.controls["variety_filter"].patchValue(event);
      this.getPageData();
    }
  }
  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.getFiterVarietyData();
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
      return;
    } else {
      this.isCrop = true;
      this.isSearch = false;
      this.varietyDisbled = false;
      this.ngForm.controls['variety_filter'].enable();
      if (!this.varietyTempValue) {
        this.getVarietyData(null);
      }
      let varietyCodeArr = [];
      if (this.ngForm.controls["variety_filter"].value && this.ngForm.controls["variety_filter"].value !== undefined && this.ngForm.controls["variety_filter"].value.length > 0) {
        this.ngForm.controls["variety_filter"].value.forEach(ele => {
          varietyCodeArr.push(ele.variety_code);
        })
      }
      this._productionCenter.postRequestCreator("get-bspc-willing-production-socond", {
        page: loadPageNumberData,
        pageSize: 10,
        search: {
          year: this.ngForm.controls["year"].value,
          season: this.ngForm.controls["season"].value,
          crop_code: this.ngForm.controls["crop"].value,
          variety_code_array: varietyCodeArr && (varietyCodeArr.length > 0) ? varietyCodeArr : null,
          user_id: this.userId ? this.userId : ''
        }
      }, null).subscribe((apiResponse: any) => {
        console.log(apiResponse);
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 10;
          this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data : '';
          if (this.allData === undefined) {
            this.allData = [];
          }
          if (this.allData && this.allData.length > 0) {
            let sum = 0;
            this.allData.forEach((el, i) => {
              sum += el.willingproducingList.length
              el.total_count = el.willingproducingList.length
            })
          }
          this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, this.allData.length, true);
          this.initSearchAndPagination();
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
  resetForm() {
    if (this.varietyTempValue && this.parentalLineVarietyLength && this.parentalLineVarietyLength.length > 1) {
      this.showParentData = true;
      let varietyCode = this.inventoryVarietyData.filter(ele => ele.variety_code == this.varietyTempValue);
      this.ngForm.controls['variety'].setValue(this.varietyTempValue);
      this.selectVariety = varietyCode && varietyCode[0] && varietyCode[0].variety_name;
    } else {
      this.selectVariety = "";
      this.varietyTempValue = "";
      this.ngForm.controls['variety'].setValue('');
      this.showParentData = false;
    }
    this.ngForm.controls['id'].patchValue('');
    this.ngForm.controls['is_developed'].patchValue('');
    this.ngForm.controls['is_production_delay'].patchValue('');
    this.ngForm.controls['reason'].patchValue('');
    this.ngForm.controls['nucleus_avail_qnt'].patchValue('');
    this.ngForm.controls['breeder_avail_qnt'].patchValue('');
    this.ngForm.controls['variety_filter'].patchValue('');
    this.ngForm.controls['nucleus_willing_qnt'].patchValue('');
    this.ngForm.controls['breeder_willing_qnt'].patchValue('');
    this.ngForm.controls['direct_avail_qnt'].patchValue('');
    this.ngForm.controls['parental_data'].patchValue('');
    this.productionDelay('no');
    this.isDeveloped = false;
    this.is_developed = false;
    this.selectparental = '';
    this.isCrop = true;
  }

  notifiedvalue(value) {
    if (value == "yes") {
      this.is_developed = false;
      this.ngForm.controls['reason'].patchValue('');
      this.ngForm.controls['nucleus_willing_qnt'].setErrors(['required']);
      this.ngForm.controls['breeder_willing_qnt'].setErrors(['required']);
      this.ngForm.get('breeder_willing_qnt').setValidators([Validators.required]);
      this.ngForm.controls['reason'].reset();
      this.ngForm.get('reason').clearValidators();
      this.ngForm.get('reason').updateValueAndValidity();
      this.nculeusSeedText = ''
      this.reasonTypeValue = "WILL_TO_PRODUCE"
      this.getCommentData()
    } else {
      this.is_developed = true;
      this.isProductionDelay = false;
      this.ngForm.controls['breeder_willing_qnt'].reset();
      this.ngForm.get('breeder_willing_qnt').clearValidators();
      this.ngForm.get('breeder_willing_qnt').updateValueAndValidity();
      this.ngForm.controls['nucleus_willing_qnt'].patchValue(0);
      this.ngForm.controls['breeder_willing_qnt'].patchValue('');
      this.ngForm.controls['is_production_delay'].patchValue('no');
      this.ngForm.get('reason').setValidators([Validators.required]);
      this.ngForm.controls['reason_for_delay'].patchValue('');
      this.ngForm.controls['expected_date'].patchValue('');
      this.ngForm.get('reason_for_delay').clearValidators();
      this.ngForm.get('expected_date').clearValidators();
      this.ngForm.get('reason_for_delay').updateValueAndValidity();
      this.ngForm.get('expected_date').updateValueAndValidity();
      this.nculeusSeedText = ''
      this.reasonTypeValue = "WILL_TO_PRODUCE"
      this.getCommentData()
    }
  }

  productionDelay(value: any) {
    if (value === "yes") {
      this.isProductionDelay = true;
      this.reasonTypeValue = "WILL_TO_DELAY";
      this.ngForm.get('reason_for_delay').setValidators([Validators.required]);
      this.ngForm.get('expected_date').setValidators([Validators.required]);
      this.nculeusSeedText = '';
      if (parseFloat(this.ngForm.controls['nucleus_avail_qnt'].value) > 0.0) {
        this.nculeusSeedText = ""
        this.ngForm.controls['nucleus_willing_qnt'].enable();
        this.ngForm.controls['nucleus_willing_qnt'].setValue(0);
      } else {
        this.nculeusSeedText = ""
        this.ngForm.controls['nucleus_willing_qnt'].disable()
        this.ngForm.controls['nucleus_willing_qnt'].setValue(0);
      }
    } else {
      this.ngForm.controls['reason_for_delay'].patchValue('');
      this.ngForm.controls['expected_date'].patchValue('');
      this.ngForm.get('reason_for_delay').clearValidators();
      this.ngForm.get('expected_date').clearValidators();
      this.ngForm.get('reason_for_delay').updateValueAndValidity();
      this.ngForm.get('expected_date').updateValueAndValidity();
      this.reasonTypeValue = "WILL_TO_PRODUCE";
      this.isProductionDelay = false;
      if (parseFloat(this.ngForm.controls['nucleus_avail_qnt'].value) > 0.0) {
        this.nculeusSeedText = ""
        this.ngForm.controls['nucleus_willing_qnt'].enable();
        this.ngForm.controls['nucleus_willing_qnt'].setValue(0);
      } else {
        this.nculeusSeedText = ""
        this.ngForm.controls['nucleus_willing_qnt'].disable()
        this.ngForm.controls['nucleus_willing_qnt'].setValue(0);
      }
      this.nculeusSeedText = '';
    }
    this.getCommentData();
  }

  preventKeyPress(event) {
    event.preventDefault();
  }
  onDateChangedStart(event: any): void {
  }
  convertDates(item) {
    const date = new Date(item);
    let split = item ? item.split('/') : ''
    let year = split && split[2] ? split[2] : ''
    let month = split && split[1] ? split[1] : ''
    let day = split && split[0] ? split[0] : ''
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }
  convertDatatoShow(item) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(item)
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
  }
  revertDataCancelation() {
    this.resetForm();
    this.isCrop = false;
    this.is_update = false;
    this.isSearch = true;
    this.isDeveloped = false;
    this.submitted = false;
  }

  editFunctinality(data) {
    console.log('data=====', data);
    this.is_update = true;
    this.getVarietyData2();
    if (data && data.production_delay == 1) {
      this.reasonTypeValue = "WILL_TO_DELAY"
      if (data.reason_for_delay == "Insufficient Nucleus Seeds") {
        this.ngForm.controls['nucleus_willing_qnt'].enable()
      } else {
        this.ngForm.controls['nucleus_willing_qnt'].disable();
        this.ngForm.controls['nucleus_willing_qnt'].setValue(0);
      }
    } else {
      this.reasonTypeValue = "WILL_TO_PRODUCE"
    }
    this.getCommentData();
    this.editData(data)
  }
  editData(data) {
    if (data) {
      this.ngForm.controls['id'].patchValue(data.id);
      this.ngForm.controls['variety'].patchValue(data.variety_code, { emitEvent: false });
      this.ngForm.controls['nucleus_avail_qnt'].disable();
      this.ngForm.controls['breeder_avail_qnt'].disable();
      this.ngForm.controls['direct_avail_qnt'].disable();
      this.ngForm.controls['nucleus_willing_qnt'].enable();
      this.ngForm.controls['breeder_willing_qnt'].enable();
      this.selectVariety = data && data.variety_name ? data.variety_name : ''
      this.getParentalData()
      let res = data ? data : [];
      this.fetchQntInventryData(res.line_variety_code);
      if (res && res.willing_to_produce && res.willing_to_produce === 1) {
        if (res && res.production_delay && res.production_delay == 1) {
          this.isProductionDelay = true;
          this.ngForm.controls['is_production_delay'].patchValue("yes");
          this.ngForm.controls['reason_for_delay'].patchValue(res && res.reason_for_delay);
          this.ngForm.controls['expected_date'].setValue(
            {
              isRange: false,
              singleDate: {
                formatted: res && res.expected_date ? this.convertDatatoShow(new Date(res && res.expected_date)) : '',
                jsDate: res && res.expected_date ? new Date(res && res.expected_date) : ''
              }
            }
          );
          this.ngForm.controls['nucleus_willing_qnt'].patchValue(data.nucleus_seed_to_use ? data.nucleus_seed_to_use : 0, { emitEvent: false });
          this.ngForm.get('reason_for_delay').setValidators([Validators.required]);
          this.ngForm.get('expected_date').setValidators([Validators.required]);
        } else {
          this.ngForm.controls['is_production_delay'].patchValue("no");
          this.ngForm.get('reason_for_delay').clearValidators();
          this.ngForm.get('expected_date').clearValidators();
          this.ngForm.get('reason_for_delay').updateValueAndValidity();
          this.ngForm.get('expected_date').updateValueAndValidity();
          this.isProductionDelay = false;
        }
        this.isWilling = 1;
        this.isDeveloped = true;
        this.is_developed = false;
        this.ngForm.controls['is_developed'].patchValue("yes");
        this.ngForm.controls['nucleus_willing_qnt'].patchValue(data.nucleus_seed_to_use, { emitEvent: false });
        this.ngForm.controls['breeder_willing_qnt'].patchValue(data.breeder_seed_to_use, { emitEvent: false });
      } else {
        this.isWilling = 0;
        this.is_developed = true;
        this.ngForm.controls['is_developed'].patchValue("no");
        this.ngForm.controls['reason'].patchValue(res && res.comment_id ? res.comment_id : '');
      }
      if (res && res.line_variety_code && res.line_variety_code != '') {
        this.showParentData = true;
        this.selectparental = res && res.line_variety_name ? res.line_variety_name : '';
        this.ngForm.controls['parental_data'].patchValue(res && res.line_variety_code ? res.line_variety_code : '', { emitEvent: false });
      } else {
        this.showParentData = false;
      }
    }
  }

  saveForm() {
    this.submitted = true;
    if (this.ngForm.invalid) {
      return;
    }
    if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop'].value || !this.ngForm.controls['variety'].value) {
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
      return;
    }
    if (this.ErrorBreeder || this.ErrorNucleus) {
      Swal.fire({
        toast: false,
        icon: "warning",
        title: "Please Check Quantity Of Breeder seed or Nucleus Seed",
        position: "center",
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: "Ok",
        cancelButtonText: "No",
      })
      return;
    }
    if (this.ngForm.controls['is_developed'].value == "yes") {
      if (this.ngForm.controls['nucleus_willing_qnt'].value == 0 && this.ngForm.controls['breeder_willing_qnt'].value == 0) {
        Swal.fire({
          toast: false,
          icon: "warning",
          title: "Please ensure that either Nucleus Seed or Breeder Seed quantity is greater than zero.",
          position: "center",
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonText: "Ok",
          cancelButtonText: "No",
        })
        return;
      }
    }

    let route = "add-bspc-willing-production";
    let data = {
      "nucleus_seed_available_qnt": this.ngForm.controls['nucleus_avail_qnt'].value,
      "breeder_seed_available_qnt": this.ngForm.controls['breeder_avail_qnt'].value,
      "direct_indent_qnt": this.ngForm.controls['direct_avail_qnt'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "comment_id": this.ngForm.controls['reason'].value,
      "is_active": 1,
      "line_variety_code": this.ngForm.controls['parental_data'].value,
      "willing_to_praduce": this.ngForm.controls['is_developed'].value == 'yes' ? 1 : 0,
      "nucleus_seed_to_use": this.ngForm.controls['nucleus_willing_qnt'].value,
      "breeder_seed_to_use": this.ngForm.controls['breeder_willing_qnt'].value,
      "user_id": this.userId,
      "production_delay": this.ngForm.controls['is_production_delay'].value == 'yes' ? 1 : 0,
      "reason_for_delay": this.ngForm.controls['reason_for_delay'].value,
      "expected_date": this.ngForm.controls['expected_date'].value && this.ngForm.controls['expected_date'].value.singleDate && this.ngForm.controls['expected_date'].value.singleDate.formatted ? this.convertDates(this.ngForm.controls['expected_date'].value.singleDate.formatted) : ''
    }
    if (!this.ngForm.controls['id'].value) {
      this._productionCenter.postRequestCreator(route, data, null).subscribe(res => {
        if (res.EncryptedResponse.status_code === 200) {
          this.submitted = false;
          Swal.fire({
            title: '<p style="font-size:25px;">Data saved Successfully.</p>',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          });
          this.resetForm();
          this.getPageData();
          this.getFiterVarietyData();
        } else if (res.EncryptedResponse.status_code === 201) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Already Exits.</p>',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          });
          return;
        }
        else {
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          });
        }
      })
    } else {
      data['id'] = this.ngForm.controls['id'].value;
      this._productionCenter.postRequestCreator(route, data, null).subscribe(res => {
        if (res.EncryptedResponse.status_code === 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Updated Successfully.</p>',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          });
          this.is_update = false
          this.resetForm();
          this.getPageData();
          this.getFiterVarietyData();
        } else {
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          });
        }
      })
    }
  }

  finalSubmit() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to Edit this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Submit it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let param = {
          year: this.ngForm.controls["year"].value,
          season: this.ngForm.controls["season"].value,
          crop_code: this.ngForm.controls["crop"].value,
          user_id: this.userId ? this.userId : ''
        }
        let route = "willing-produce-final-submit";
        this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
          if (res.EncryptedResponse.status_code === 200) {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Submitted Successfully.</p>',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#E97E15'
            });
            this.is_update = false
            this.getPageData();
            this.getFiterVarietyData();
            this.resetForm();
          } else if (res.EncryptedResponse.status_code === 201) {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Not Submitted.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            });
            this.is_update = false
            this.getPageData();
            this.getFiterVarietyData();
            this.resetForm();
          }
          else {
            Swal.fire({
              title: '<p style="font-size:25px;">Something Went Wrong.</p>',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#E97E15'
            });
          }
        })
      }
    });
  }

  deleteFunctinality(value) {
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
        let route = "delete-bspc-willing-production";
        this._productionCenter.postRequestCreator(route, { id: value }, null).subscribe(res => {
          Swal.fire({
            title: "Deleted!",
            text: "Your Data Has Been Deleted.",
            icon: "success"
          });
          this.getPageData();
        });
      }
    });
  }
  variety(item) {
    this.selectVariety = item && item.variety_name ? item.variety_name : '';
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
    this.ngForm.controls['vaiety_text'].setValue('', { emitEvent: false })
  }
  vClick() {
    document.getElementById('variety').click()
  }
  pClick() {
    document.getElementById('parental').click()
  }
  parental(item) {
    this.selectparental = item && item.line_variety_name ? item.line_variety_name : '';
    this.ngForm.controls['parental_data'].setValue(item && item.line_variety_code ? item.line_variety_code : '')
    this.ngForm.controls['parental_text'].setValue('', { emitEvent: false })
  }
  getFiterVarietyData() {
    const route = "getWiilingProduceVarietyDataSecond";
    this.masterService.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "user_id": this.userId
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.getwillingProducionFilterVarietyData = data.EncryptedResponse.data;
      }
    })
  }
  getReasonName(data) {
    let resonName = this.reasonData.filter(item => item.id == data);
    let resonNameData = resonName && resonName[0] && resonName[0].comment;
    return resonNameData;
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
}
