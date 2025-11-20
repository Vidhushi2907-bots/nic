import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { validateDecimal } from 'src/app/_helpers/utility';

import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { MasterService } from 'src/app/services/master/master.service';
import { trigger } from '@angular/animations';

@Component({
  selector: 'app-direct-indent',
  templateUrl: './direct-indent.component.html',
  styleUrls: ['./direct-indent.component.css']
})
export class DirectIndentComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;

  ngForm!: FormGroup
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  is_update: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  varietyList = [];
  // inventoryYearData: any[] = [];
  inventoryYearData = [
    { year: "2026-27", "value": "2026" },
    { year: "2025-26", "value": "2025" },
    { year: "2024-25", "value": "2024" },
    { year: "2023-24", "value": "2023" },
    { year: "2022-23", "value": "2022" },
    { year: "2021-22", "value": "2021" },
    { year: "2020-21", "value": "2020" },
    { year: "2019-20", "value": "2019" },
    { year: "2018-19", "value": "2018" },
  ];
  stateData: any[] = [];
  cropData: any[] = [];
  varietyData: any[] = [];
  districtData: { district_name: string, district_code: string }[] = [];
  allDirectIndentsData: any[] = [];
  allSpaData: any[] = [];
  showOtherInput = false;
  showOtherInputBox = false;
  submitted = false;
  dataId: any;
  authUserId: any;
  isVarietySelected = false;
  selectCrop: any;
  croplistSecond: any[];
  selectSpa: any;
  spalistSecond: any[];
  selectVariety: any;
  varietyListSecond: any[];
  isEditMode = false;
  showQuantity = false;
  selectVarietyStatus: any;
  selectedSeason: string = '';
  statelistSecond: any[];
  selectState: any;
  selectDistrict: any;
  districtListSecond: { district_name: string; district_code: string; }[];
  isPatchData = false;
  stateCode: any;
  isShowTable = false;
  myId: any;
  isLimeSection = false;
  lineData: any;
  varietyAndQuantity: any[] = [];
  unit: string;
  productionType: string;
  // isDisableNormal: boolean;
  // isDisableDelay: boolean;
  // isDisableNormalReallocate: boolean;
  isDirect: boolean;
  isSelf: boolean;
  isSearchRadio: boolean = false
  spaName: any;
  showSaveButton: boolean;
  constructor(private service: SeedServiceService, private breeder: BreederService, private masterService: MasterService, private productioncenter: ProductioncenterService, private fb: FormBuilder, private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getYearData();
    this.getStateData();
    this.getCropData();
    // this.getPageData();
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    this.authUserId = data.id;
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: ['', [Validators.required]],
      selectSpa: ['', [Validators.required]],
      indent_qnt: ['', []],
      otherInput: [''],
      crop_text: [''],
      state_text: [''],
      district_text: [''],
      variety_text: [''],
      spa_text: [''],
      variety_notification_year: [''],
      state: ['', [Validators.required]],
      address: [''],
      district: ['', [Validators.required]],
      mobile_no: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$")]],
    });

    this.ngForm.controls['variety_notification_year'].disable();
    this.ngForm.controls['selectSpa'].disable();

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
    this.ngForm.controls['spa_text'].valueChanges.subscribe(item => {
      if (item) {
        this.allSpaData = this.spalistSecond
        let response = this.allSpaData.filter(x =>
          x.spa_name.toLowerCase().includes(item.toLowerCase())
        );
        this.allSpaData = response
      }
      else {
        this.getSpaData(item);
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
        this.getVarietyData(this.ngForm.controls['crop'].value);
      }
    })

    this.ngForm.controls['state_text'].valueChanges.subscribe(item => {
      if (item) {
        this.stateData = this.statelistSecond;
        let response = this.stateData.filter(x =>
          x.state_name.toLowerCase().includes(item.toLowerCase()));
        this.stateData = response
      }
      else {
        this.getStateData();
      }
    })

    this.ngForm.controls['district_text'].valueChanges.subscribe(item => {
      if (item) {
        this.districtData = this.districtListSecond;
        let response = this.districtData.filter(x =>
          x.district_name.toLowerCase().includes(item.toLowerCase()));
        this.districtData = response
      }
      else {
        this.getdistrictData(item);
      }
    })

    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.selectVariety = '';
        this.selectCrop = '';
        this.ngForm.controls['crop'].reset('');
        this.ngForm.controls['season'].reset('');
        this.ngForm.controls['season'].markAsUntouched();
        this.ngForm.controls['variety'].reset('');
        this.ngForm.controls['variety_notification_year'].reset('');
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.selectVariety = '';
        this.selectCrop = '';
        this.ngForm.controls['crop'].reset('');
        this.ngForm.controls['variety'].reset('');
        this.ngForm.controls['variety_notification_year'].reset('');
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['variety'].reset('');
        this.ngForm.controls['variety_notification_year'].reset('');
        this.selectVariety = '';
        this.getVarietyData(newvalue);
        const firstChar = newvalue.substring(0, 1);
        if (firstChar == 'H') {
          this.showQuantity = true;
        } else {
          this.showQuantity = false;
        }
      }
    });

    this.ngForm.controls['variety'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        if (newvalue.slice(0, 1) == "A") {
          this.unit = "Qt";
        } else {
          this.unit = "Kg";
        }
        if (this.lineData) {
          this.lineData.forEach((line, index) => {
            this.ngForm.controls[`indentQnty_${index}`].reset();
          });
        }
        this.ngForm.controls['variety_notification_year'].reset('');
        this.getVarietyNotificationYear();
      }
    });

    this.ngForm.controls['district'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['selectSpa'].reset('');
        this.ngForm.controls['otherInput'].reset('');
        this.showOtherInputBox = false;
        this.ngForm.controls['selectSpa'].enable();
        this.getSpaData(newvalue);
      }
    })

    this.ngForm.controls['state'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.selectDistrict = '';
        this.ngForm.controls['district'].reset('');
        this.getdistrictData(newvalue);
      }
    });
  }

  validateInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    inputElement.value = numericValue;
  }

  validateDecimal($e) {
    validateDecimal($e);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return formattedDate;
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value.toUpperCase();
    this.ngForm.controls['address'].setValue(newValue);
  }

  getFormControl(index: number): FormControl {
    return this.ngForm.get(`indentQnty_${index}`) as FormControl;
  }
  otherClicked() {
    this.selectSpa = 'Other';
    this.ngForm.controls['selectSpa'].setValue(this.selectSpa, { emitEvent: false });
    this.onSelectSPA();
  }
  onSelectSPA() {
    const selectedValue = this.selectSpa;
    this.showOtherInput = selectedValue == 'Other';
    console.log(this.showOtherInput, "djkfgdjkgkj", selectedValue)
    if (this.showOtherInput) {
      this.ngForm.get('otherInput').setValue(''); // Reset the value when "Other" is selected
    }
    if (selectedValue == 'Other') {
      this.showOtherInputBox = true;
      this.ngForm.controls['address'].patchValue('');
      this.ngForm.controls['mobile_no'].patchValue('');
      this.ngForm.controls['email'].patchValue('');
    }
    else {
       
      this.showOtherInputBox = false;
      const selectedSpa = this.allSpaData.find(item => item.spa_name == selectedValue);
      
      this.spaName = selectedSpa.spa_name;
      if (selectedSpa.address) {
        this.ngForm.controls['address'].patchValue(selectedSpa.address);
      } else {
        this.ngForm.controls['address'].patchValue('');
      }
      if (selectedSpa.mobile_number) {
        this.ngForm.controls['mobile_no'].patchValue(selectedSpa.mobile_number);
      } else {
        this.ngForm.controls['mobile_no'].patchValue('');
      }
      if (selectedSpa.email_id) {
        this.ngForm.controls['email'].patchValue(selectedSpa.email_id);
      } else {
        this.ngForm.controls['email'].patchValue('');
      }
      // if (selectedSpa.district_id) {
      //   this.ngForm.controls['district'].patchValue(selectedSpa.district_id);
      // }
    }
  }

  crop(item: any) {
    this.selectCrop = item && item.crop_name ? item.crop_name : ''
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropData = this.croplistSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
  }
  spa(item: any) {
    this.selectSpa = item && item.spa_name ? item.spa_name : ''
    this.ngForm.controls['spa_text'].setValue('', { emitEvent: false })
    this.allSpaData = this.spalistSecond;
    this.ngForm.controls['selectSpa'].setValue(item && item.spa_code ? item.spa_code : '')
    this.onSelectSPA();
  }

  variety(item: any) {
    const indentQntControl = this.ngForm.get('indent_qnt');
    this.selectVariety = item && item.variety_name ? item.variety_name : '',
      this.selectVarietyStatus = item && item.status ? item.status : '',
      this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    this.varietyData = this.varietyListSecond;
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
    if (this.selectVarietyStatus == "hybrid") {
      this.isLimeSection = true;
      this.geVarietyLineData(item && item.variety_code ? item.variety_code : '');
      indentQntControl.clearValidators();
    } else {
      if (this.lineData) {
        this.lineData.forEach((line, index) => {
          this.ngForm.controls[`indentQnty_${index}`].clearValidators();
          this.ngForm.controls[`indentQnty_${index}`].updateValueAndValidity();
        });
      }
      indentQntControl.setValidators([Validators.required]);
      this.isLimeSection = false;
      this.lineData = null;
    }
    indentQntControl.updateValueAndValidity();

  }

  geVarietyLineData(variety_code: any) {
    const route = "get-direct-indent-variety-line";
    const param = {
      "variety_code": variety_code,
    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.lineData = data.EncryptedResponse.data;
        if (this.lineData) {
          this.lineData.forEach((line, index) => {
            this.ngForm.addControl(`indentQnty_${index}`, this.formBuilder.control('', Validators.required));
            this.ngForm.addControl(`line_variety_${index}`, this.formBuilder.control(''));
          });
        }
      }
    })
  }

  state(item: any) {
    this.selectState = item && item.state_name ? item.state_name : ''
    this.ngForm.controls['state_text'].setValue('', { emitEvent: false })
    this.stateData = this.statelistSecond;
    this.ngForm.controls['state'].setValue(item && item.state_code ? item.state_code : '')
  }

  searchData() {
    this.isShowTable = false;
    this.isVarietySelected = true;
    this.isSearchRadio = true;
    this.ngForm.controls['selectSpa'].disable();
    // this.getPageData()
  }

  district(item: any) {
    this.selectDistrict = item && item.district_name ? item.district_name : ''
    this.ngForm.controls['district_text'].setValue('', { emitEvent: false })
    this.districtData = this.districtListSecond;
    this.ngForm.controls['district'].setValue(item && item.district_code ? item.district_code : '')
  }

  vClick() {
    document.getElementById('variety').click();
  }

  cClick() {
    document.getElementById('crop').click();
  }

  sClick() {
    document.getElementById('state').click();
  }

  dClick() {
    document.getElementById('district').click();
  }
  spaClick() {
    document.getElementById('selectSpa').click();
  }

  isOtherSelected() {
    this.showOtherInput
    return this.showOtherInput;
  }

  getYearData() {
    // const route = "getIndentYear";
    // this.productioncenter.getRequestCreatorNew(route).subscribe((data: any) => {
    //   if (data.status === 200) {
    //     this.inventoryYearData = data.data;
    //   }
    // })
  }

  getStateData() {
    const route = "get-state-list";
    this.service.getRequestCreatorNew(route).subscribe((data: any) => {
      if (data.EncryptedResponse.status_code === 200) {
        this.stateData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.stateData = this.stateData.filter(x => x.state_name != null);
        this.statelistSecond = this.stateData;
      }
    })
  }

  getCropData() {
    const route = "get-all-crop-list";
    this.productioncenter.postRequestCreator(route, null, null).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.cropData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.croplistSecond = this.cropData;
      }
    })
  }

  getVarietyData(varietyCode: any) {
    this.ngForm.controls['variety'].patchValue('');
    const route = "get-direct-indent-variety-list";
    const param = {
      "crop_code": this.ngForm.controls['crop'].value,
    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.varietyData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.varietyListSecond = this.varietyData;
        if (this.isEditMode) {
          const varietyName = this.varietyData.filter(variety => variety.variety_code === varietyCode);
          this.selectVariety = varietyName;
          this.selectVariety = varietyName[0].variety_name;
        }
      }
    })
  }

  getVarietyNotificationYear() {
    const route = "get-variety-notification-year";
    this.masterService.postRequestCreator(route, null, {
      "variety_code": this.ngForm.controls['variety'].value,
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        const year = data.EncryptedResponse.data[0].not_date ? data.EncryptedResponse.data[0].not_date.split('-')[0] : 'NA';
        this.ngForm.controls['variety_notification_year'].patchValue(year);
      }
    })
  }

  getdistrictData(districtCode: any) {
    this.ngForm.controls['district'].patchValue('', { emitEvent: false });
    const route = "get-district-list";
    this.masterService.postRequestCreator(route, null, {
      search: {
        "state_code": this.ngForm.controls['state'].value
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.districtData = data.EncryptedResponse.data.map(district => ({ district_name: district.district_name, district_code: district.district_code }));
        this.districtListSecond = this.districtData;
        if (this.isPatchData) {
          const districtName = this.districtData.find(district => district.district_code === districtCode)?.district_name;
          this.selectDistrict = districtName;
          this.ngForm.controls['district'].patchValue(districtCode, { emitEvent: false });
          this.getSpaData(this.myId);
        }
        this.isPatchData = false;
      }
    })
  }

  getSpaData(spaCode: any) {
    const route = "getSpaList";
    const param = {
      "state_id": this.ngForm.controls['state'].value,
    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.status === 200) {
        this.allSpaData = data && data.data ? data.data : '';
        this.spalistSecond = this.allSpaData;
        if (this.isEditMode) {
          const foundSpa = this.allSpaData.find(spa => spa.spa_code == spaCode);
          if (foundSpa) {
            this.ngForm.controls['selectSpa'].patchValue(foundSpa.spa_code);
          }
        }
      }
    })
  }

  deleteDirectIndent(id: number) {
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
        const route = "deleteDirectIndent";
        this.productioncenter.postRequestCreator(route, { "id": id }, null).subscribe(data => {
          if (data.status === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "Your data has been deleted.",
              icon: "success"
            });
            this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemList.filter(item => item.id !== id);
          }
        });
      }
    });
  }
  createNewSpa() {
    this.submitted = true;
    console.log('this.isDirect', this.isDirect);
  
    if (this.isDirect == true) {
      if (this.ngForm.invalid) {
        console.log('hellow 1');
        return;
      }
    }
  
    // Check for existing data before saving
    const checkDuplicateRoute = "check-existing-spa"; // Create an API endpoint
    const checkParam = {
      state_code: this.ngForm.controls['state'].value,
      district_code: this.ngForm.controls['district'].value,
      spa_address: this.ngForm.controls['address'].value,
      year: this.ngForm.controls['year'].value,
      season: this.ngForm.controls['season'].value,
      crop_code: this.ngForm.controls['crop'].value,
      variety_code: this.ngForm.controls['variety'].value,
      spa_mobile_number: this.ngForm.controls['mobile_no'].value
    };
    console.log("checkParam",checkParam);
    
  
    this.productioncenter.postRequestCreator(checkDuplicateRoute, checkParam, null).subscribe((response: any) => {
      if (response.status === 200 && response.exists === true) {
        console.log("Triggering Swal.fire");
        Swal.fire({
          title: `<p style="font-size:25px;">Already Indented!</p>`,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
        return; // Stop execution if duplicate found
      } else {
        console.log("create-new-spa");
        
        // Proceed with saving if no duplicate found
        const route = "create-new-spa";
        const param = {
          state_id: this.ngForm.controls['state'].value,
          district_id: this.ngForm.controls['district'].value,
          address: this.ngForm.controls['address'].value,
          mobile_number: this.ngForm.controls['mobile_no'].value,
          email_id: this.ngForm.controls['email'].value,
          spa_name: this.spaName || this.ngForm.controls['otherInput'].value,
          is_self: this.isSelf ? this.isSelf : false
        };
  
        this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
          if (data.status == 200) {
            console.log('data====', data);
            this.saveForm();
          } else {
            const message = data.EncryptedResponse?.data?.message || 'Something went wrong';
            Swal.fire({
              title: `<p style="font-size:25px;">${message}.</p>`,
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#E97E15'
            });
          }
        });
      }
    });
  }
  

  // createNewSpa() {
  //   this.submitted = true;
  //   console.log('this.isDirect', this.isDirect);
  //   if (this.isDirect == true) {
  //     if (this.ngForm.invalid) {
  //       console.log('hellow 1');
  //       return;
  //     }
  //   }

  //   if (!this.showOtherInputBox && this.isDirect) {
  //     console.log('hellow 2');
  //     this.saveForm();
  //   } else {
  //     console.log('hellow 3');
  //     const route = "create-new-spa";
  //     const param = {
  //       state_id: this.ngForm.controls['state'].value,
  //       district_id: this.ngForm.controls['district'].value,
  //       address: this.ngForm.controls['address'].value,
  //       mobile_number: this.ngForm.controls['mobile_no'].value,
  //       email_id: this.ngForm.controls['email'].value,
  //       spa_name: this.ngForm.controls['otherInput'].value,
  //       is_self: this.isSelf ? this.isSelf : false
  //     }
  //     this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
  //       if (data.status == 200) {
  //         console.log('data====', data);
  //         this.saveForm();
  //       }
  //       if (data.EncryptedResponse && data.EncryptedResponse.status_code == 201) {
  //         if (this.isSelf) {
  //           this.saveForm();
  //         }
  //       }
  //       else {
  //         const message = data.EncryptedResponse?.data?.message || 'Something went wrong';
  //         Swal.fire({
  //           title: `<p style="font-size:25px;">${message}.</p>`,
  //           icon: 'error',
  //           confirmButtonText:
  //             'OK',
  //           confirmButtonColor: '#E97E15'
  //         })
  //       }
  //     })
  //   }
  // }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    console.log('this.isSelf', this.productionType);
    let isSelfValue;
    if (this.productionType && this.productionType == "direct") {
      isSelfValue = false
    } else {
      isSelfValue = true
    }
    const filters = {
      crop: this.ngForm.controls['crop'].value,
      year: this.ngForm.controls['year'].value,
      season: this.ngForm.controls['season'].value,
      variety: this.ngForm.controls['variety'].value,
      user_id: this.authUserId,
      is_self: isSelfValue ? isSelfValue : false
    };
    const requestParams = {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      ...filters
    }
    this.filterPaginateSearch.itemList = [];
    this.productioncenter.postRequestCreator("getAllDirectIndent", requestParams, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined && apiResponse.status == 200) {
          this.filterPaginateSearch.itemListPageSize = 10;
          this.allData = apiResponse.data.directIndents;

          if (this.allData === undefined) {
            this.allData = [];
          }
          this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.data.total, true);
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

  revertDataCancelation() {
    this.selectDistrict = '';
    this.selectState = '';
    this.selectVariety = '';
    this.selectCrop = '';
    this.selectSpa = '';
    this.ngForm.controls['crop'].reset('');
    this.ngForm.controls['season'].reset('');
    this.ngForm.controls['season'].markAsUntouched();
    this.ngForm.controls['year'].reset('');
    this.ngForm.controls['variety'].reset('');
    this.ngForm.controls['variety_notification_year'].reset('');
    this.ngForm.controls['selectSpa'].reset('');
    this.ngForm.controls['indent_qnt'].patchValue('');
    this.ngForm.controls['otherInput'].patchValue('');
    this.ngForm.controls['state'].patchValue('');
    this.ngForm.controls['address'].patchValue('');
    this.ngForm.controls['mobile_no'].patchValue('');
    this.ngForm.controls['email'].patchValue('');
    this.ngForm.controls['district'].patchValue('');
    this.is_update = false;
    this.showOtherInputBox = false;
    this.ngForm.controls['selectSpa'].markAsUntouched();
    this.ngForm.controls['mobile_no'].markAsUntouched();
    this.ngForm.controls['email'].markAsUntouched();
    this.ngForm.controls['state'].markAsUntouched();
    this.ngForm.controls['indent_qnt'].markAsUntouched();
    if (this.lineData) {
      this.lineData.forEach((line, index) => {
        this.ngForm.controls[`indentQnty_${index}`].reset();
      });
    }
  }
  revertDataCancelationSecond() {
    this.selectDistrict = '';
    this.selectState = '';
    this.selectSpa = '';
    this.ngForm.controls['selectSpa'].reset('');
    this.ngForm.controls['indent_qnt'].patchValue('');
    this.ngForm.controls['otherInput'].patchValue('');
    this.ngForm.controls['state'].patchValue('');
    this.ngForm.controls['address'].patchValue('');
    this.ngForm.controls['mobile_no'].patchValue('');
    this.ngForm.controls['email'].patchValue('');
    this.ngForm.controls['district'].patchValue('');
    this.is_update = false;
    this.showOtherInputBox = false;
    this.ngForm.controls['selectSpa'].markAsUntouched();
    this.ngForm.controls['mobile_no'].markAsUntouched();
    this.ngForm.controls['email'].markAsUntouched();
    this.ngForm.controls['state'].markAsUntouched();
    this.ngForm.controls['indent_qnt'].markAsUntouched();
    if (this.lineData) {
      this.lineData.forEach((line, index) => {
        this.ngForm.controls[`indentQnty_${index}`].reset();
      });
    }
  }
  patchDataForUpdate(data: any) {
    this.isEditMode = true
    this.is_update = true;
    this.isPatchData = true;
    this.dataId = data.id;
    this.stateCode = data.state_code;
    const cropName = this.cropData.find(crop => crop.crop_code === data.crop_code)?.crop_name;
    const stateName = this.stateData.find(state => state.state_code === data.state_code)?.state_name;
    if (data) {
      this.selectCrop = cropName;
      this.selectState = stateName;
      this.ngForm.controls['selectSpa'].enable();
      this.ngForm.controls['year'].patchValue(data.year, { emitEvent: false });
      this.ngForm.controls['season'].patchValue(data.season, { emitEvent: false });
      this.ngForm.controls['crop'].patchValue(data.crop_code, { emitEvent: false });
      const firstChar = data.crop_code.substring(0, 1);
      if (firstChar == 'H') {
        this.showQuantity = true;
      } else {
        this.showQuantity = false;
      }
      this.getVarietyData(data.variety_code);
      this.ngForm.controls['variety'].patchValue(data.variety_code);
      this.ngForm.controls['indent_qnt'].patchValue(data.quantity);
      this.ngForm.controls['variety_notification_year'].patchValue(data.notification_year);
      this.ngForm.controls['state'].patchValue(data.state_code, { emitEvent: false });
      this.ngForm.controls['address'].patchValue(data.spa_address);
      this.ngForm.controls['mobile_no'].patchValue(data.spa_mobile_number);
      this.ngForm.controls['email'].patchValue(data.email_id);
      this.getdistrictData(data.district_code);
      if (data.spa_id == 0) {
        this.showOtherInputBox = true;
        this.selectSpa = 'Other';
        this.ngForm.controls['selectSpa'].patchValue('Other');
        this.ngForm.controls['otherInput'].patchValue(data.spa_name);
      } else {
        this.selectSpa = data.spa_name;
        this.showOtherInputBox = false;
        this.myId = data.spa_id;
      }
      this.lineData = data.parental_line;
      if (this.lineData) {
        this.isLimeSection = true;
        this.lineData.forEach((line, index) => {
          this.ngForm.addControl(`indentQnty_${index}`, this.formBuilder.control('', Validators.required));
          this.ngForm.addControl(`line_variety_${index}`, this.formBuilder.control(''));
          this.ngForm.controls[`indentQnty_${index}`].patchValue(line.quantity);
        });
      } else {
        this.isLimeSection = false;
      }
    }
  }
  
  
  saveForm(spaData=null) {
    this.submitted = true;
    this.isShowTable = true;
    this.varietyAndQuantity = [];
    if (this.isDirect) {
      if (this.ngForm.invalid) {
        return;
      }
    }
    if (this.lineData) {
      this.lineData.forEach((line, index) => {
        const variety_code_line = line.line_variety_code;
        const quantity = this.ngForm.get(`indentQnty_${index}`).value;
        const line_variety_name = line.line_variety_name;
        this.varietyAndQuantity.push({ line_variety_name: line_variety_name, variety_code_line: variety_code_line, quantity: quantity });
      });
    }
    let spaName: number;
    if (this.isDirect) {
      const foundSpa = this.allSpaData.find(spa => spa.spa_code === this.ngForm.controls['selectSpa'].value);
      if (foundSpa) {
        spaName = foundSpa.spa_name;
      }
    }
   
    const route = "saveDirectIndent";
    const qnty = this.ngForm.controls['indent_qnt'].value
    const baseParam = {
      "user_id": this.authUserId,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      "state_code": this.ngForm.controls['state'].value,
      "district_code": this.ngForm.controls['district'].value,
      "spa_address": this.ngForm.controls['address'].value,
      "spa_mobile_number": this.ngForm.controls['mobile_no'].value,
      "quantity": qnty ? qnty : 0,
      "email_id": this.ngForm.controls['email'].value,
      "perental_line_array": this.varietyAndQuantity,
      "is_self": this.isSelf ? this.isSelf : false
    };
    let param;
    if (this.showOtherInput) {
      param = {
        ...baseParam,
        "spa_name": this.ngForm.controls['otherInput'].value,
        "spa_id": 0,
      };
    } else {
      param = {
        ...baseParam,
        "spa_name": spaName,
        "spa_id": this.ngForm.controls['selectSpa'].value,
      };
    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.status === 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        }).then(x => {
          this.getPageData();
          this.ngForm.controls['selectSpa'].reset('');
          this.ngForm.controls['indent_qnt'].reset('');
          this.ngForm.controls['otherInput'].reset('');
          this.ngForm.controls['state'].patchValue('');
          this.ngForm.controls['address'].reset('');
          this.ngForm.controls['mobile_no'].reset('');
          this.ngForm.controls['email'].reset('');
          this.ngForm.controls['district'].reset('');
          this.selectDistrict = '';
          this.selectState = '';
          this.selectSpa = '';
          this.submitted = false;
          this.ngForm.controls['selectSpa'].markAsUntouched();
          this.ngForm.controls['mobile_no'].markAsUntouched();
          this.ngForm.controls['email'].markAsUntouched();
          this.ngForm.controls['indent_qnt'].markAsUntouched();
          this.districtData = null;
          this.allSpaData = null;
          if (this.lineData) {
            this.lineData.forEach((line, index) => {
              this.ngForm.controls[`indentQnty_${index}`].reset();
            });
          }
        })
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">An Error Occured.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        })
      }
    })
  }

  updateForm() {
    this.submitted = true;
    this.varietyAndQuantity = [];
    if (this.ngForm.invalid) {
      return;
    }
    if (this.lineData) {
      this.lineData.forEach((line, index) => {
        const variety_code_line = line.variety_code_line;
        const quantity = this.ngForm.get(`indentQnty_${index}`).value;
        const line_variety_name = line.line_variety_name;
        this.varietyAndQuantity.push({ line_variety_name: line_variety_name, variety_code_line: variety_code_line, quantity: quantity });
      });
    }
    const route = "updateDirectIndent";
    const baseParam = {
      "id": this.dataId,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      "quantity": this.ngForm.controls['indent_qnt'].value,
      "state_code": this.ngForm.controls['state'].value,
      "spa_address": this.ngForm.controls['address'].value,
      "spa_mobile_number": this.ngForm.controls['mobile_no'].value,
      "email_id": this.ngForm.controls['email'].value,
      "district_code": this.ngForm.controls['district'].value,
      "perental_line_array": this.varietyAndQuantity
    };
    let param;
    let spaCode: number;
    const spaNameToFind = this.ngForm.controls['selectSpa'].value;
    const foundSpa = this.allSpaData.find(spa => spa.spa_code === spaNameToFind);
    if (foundSpa) {
      spaCode = foundSpa.spa_code;
    }
    if (spaCode == 0 || this.ngForm.controls['selectSpa'].value == 'Other') {
      param = {
        ...baseParam,
        "spa_name": this.ngForm.controls['otherInput'].value,
        "spa_id": 0,
      };
    } else {
      param = {
        ...baseParam,
        "spa_name": foundSpa.spa_name,
        "spa_id": spaCode,
      };
    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.status === 200) {
        this.getPageData();
        this.is_update = false;
        this.ngForm.controls['selectSpa'].reset('');
        this.ngForm.controls['indent_qnt'].reset('');
        this.ngForm.controls['otherInput'].reset('');
        this.ngForm.controls['state'].reset('');
        this.ngForm.controls['address'].reset('');
        this.ngForm.controls['mobile_no'].reset('');
        this.ngForm.controls['email'].reset('');
        this.ngForm.controls['district'].reset('');
        this.selectState = '';
        this.selectSpa = '';
        this.selectDistrict = '';
        this.submitted = false;
        this.showOtherInputBox = false;
        this.ngForm.controls['selectSpa'].markAsUntouched();
        this.ngForm.controls['mobile_no'].markAsUntouched();
        this.ngForm.controls['email'].markAsUntouched();
        this.ngForm.controls['state'].markAsUntouched();
        this.ngForm.controls['indent_qnt'].markAsUntouched();
        this.districtData = null;
        this.allSpaData = null;
        if (this.lineData) {
          this.lineData.forEach((line, index) => {
            this.ngForm.controls[`indentQnty_${index}`].reset();
          });
        }
      }
    })
  }

  productionTypeValue(value) {
    if (value) {
      this.productionType = value;
      this.revertDataCancelationSecond();
      this.getPageData();
      console.log('this.productionType====', this.productionType);
      if (this.productionType == "direct") {
        this.isShowTable = true;
        this.isDirect = true;
        this.isSelf = false;
        this.showSaveButton = false;
      } else if (this.productionType == "self") {
        this.isShowTable = true;
        this.isDirect = false;
        this.isSelf = true;
        this.showSaveButton = true;
      }
      else {
        // this.isDirect = false;
        // this.isSelf = false;
      }
      console.log(' this.isDirect====', this.isDirect);
    }
  }

  resetRadioBtn() {
    window.location.reload();
    this.productionType = ""
  }

}
