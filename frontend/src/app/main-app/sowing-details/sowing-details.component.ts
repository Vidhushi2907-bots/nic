import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { MasterService } from 'src/app/services/master/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { IAngularMyDpOptions, IMyDate, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { AngularMyDatePickerDirective } from 'angular-mydatepicker'; // Import the date picker
@Component({
  selector: 'app-sowing-details',
  templateUrl: './sowing-details.component.html',
  styleUrls: ['./sowing-details.component.css'],
  providers: [DatePipe]
})
export class SowingDetailsComponent implements OnInit {
  @ViewChild('dp4', { static: false }) dp4!: AngularMyDatePickerDirective;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  ngForm!: FormGroup;
  todayDate = new Date();
  parsedDate = Date.parse(this.todayDate.toString());
  is_update= false;
  cropList: any;
  cropListSecond: any;
  stateList: any;
  stateListSecond: any;
  selectCrop: any;
  selectState: any;
  districtList: any;
  districtListSecond: any;
  selectDistrict: any;
  testNumberDetails: any;
  yearOfIndent: any;
  seasonlist: any;
  consignmentList: any; 
  sowingDetailsList: any;
  testNumberTableList: any;
  isSearch: boolean;
  searchClicked: boolean = false;
  testNumberList:any;
  isConsignmentSelected: boolean;
  isTestSelected= false;
  userId: any;
  gotShowingDetailId = 0;
   
  constructor(private fb: FormBuilder, private master: MasterService, private datePipe: DatePipe, private _productionCenter: ProductioncenterService) {
    this.createForm();
  }

  ngOnInit(): void {
    let user = localStorage.getItem('BHTCurrentUser')
    this.userId = JSON.parse(user)
    this.getYear();
  }

  createForm() {
  this.ngForm = this.fb.group({ 
    year: [''], 
    season: [''],
    cropName: new FormControl(''),
    crop_text: new FormControl(''),
    crop_code: new FormControl(''),
    stateName: new FormControl(''),
    state_text: new FormControl(''),
    state_code: new FormControl(''),
    districtName: new FormControl(''),
    district_text: new FormControl(''),
    district_code: new FormControl(''),
    testno: ['', Validators.required],
    consignment: new FormControl('',),
    address: [''],
    showDisableInspectionDate: [false],
    dateOfSowing: [''],
    expected_date_inspection: [''], 
    testSearch: [''],
    areaSown: ['']
    })
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_text'].disable();
    this.ngForm.controls['district_text'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isSearch = false;
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['crop_text'].disable();
        this.selectCrop = "";
        this.selectState = "";
        this.selectDistrict = "";
        this.getSeason();
        this.cancel();
        this.isTestSelected = false;
        this.ngForm.controls['consignment'].setValue('');
      }
    })
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_text'].enable();
        this.selectCrop = '';
        this.getCrop();
        this.searchClicked = false;
        this.isSearch = false;
        this.isTestSelected = false;
        this.selectState = "";
        this.selectDistrict = "";
        this.cancel();
        this.ngForm.controls['consignment'].setValue('');
      }
    })
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.searchClicked = false;
        this.selectState = "";
        this.selectDistrict = "";
        this.cropList = this.cropListSecond;
        let response = this.cropList.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()));
        this.cropList = response;
      }
      else {
        this.cropList = this.cropListSecond;
      }
    });
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      this.ngForm.patchValue({
        district_text: '',
        district_code: '',
        districtName: ''
      },{emitEvent: false}); 
      this.selectDistrict = ''     
    if (newValue) {
        this.stateList = this.stateListSecond;
        let response = this.stateList.filter(x => x.state_name.toLowerCase().includes(newValue.toLowerCase()));
        this.stateList = response;
      }
      else {
        this.stateList = this.stateListSecond;
      }
    });
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.districtList = this.districtListSecond;
        let response = this.districtList.filter(x => x.district_name.toLowerCase().includes(newValue.toLowerCase()));
        this.districtList = response;
      }
      else {
        this.districtList = this.districtListSecond;
      }
    });
    this.ngForm.controls['testno'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isTestSelected = true;
        this.getTestNumberDtails(newValue);
        this.selectState = '';
        this.selectDistrict = '';
        this.districtList= [];
        this.districtListSecond= [];      
        this.ngForm.controls['address'].setValue('');
        this.ngForm.controls['expected_date_inspection'].setValue('');
        this.ngForm.controls['areaSown'].setValue('');    
      }
    });
    this.ngForm.controls['testSearch'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getSowingDetailsList(newValue);
      }
    });
  }

  getYear() {
    let route = "get-got-sample-sowing-year";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.yearOfIndent = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      } else {
        this.yearOfIndent = [];
      }
    });  
  }

  getSeason() {
    let route = "get-got-sample-sowing-season";
    let param = {
        "year": this.ngForm.controls['year'].value,
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seasonlist = res.EncryptedResponse.data.map(seasonData => {
          return {
            season: seasonData.season,
            seasonName: seasonData.season === 'R' ? 'Rabi' : seasonData.season === 'K' ? 'Kharif' : seasonData.season
          };
        });
      } else {
        this.seasonlist= [];
      }
    });
  }

  getCrop() {
  let route = "get-got-sample-sowing-crop";
  let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
  }
  this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
    if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
      this.cropList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      this.cropListSecond = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
    } else {
      this.cropList= [];
      this.cropListSecond= [];
    }
  });
  }

  getConsignment(isEdit: boolean = false,consignment_number: any = '') {
  let route = "get-got-sowing-details-consignment";
    let param = {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_code'].value,
        "isEdit": isEdit,
        "consignment_number": consignment_number
    }  
  this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
    if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
      this.consignmentList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
    } else {
      this.consignmentList= [];
    }
  });
  }

  async getTestNumber(consignment_number: any,isEdit: boolean = false,test_number: any = '') {
  let route = "got-sowing-details-test-number";
  let param = {
    "consignment_number": consignment_number,
    "getAlltest_number": false,
    "isEdit": isEdit,
    "test_number": test_number
  }
  this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
    if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
      this.testNumberList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
    } else {
      this.testNumberList = [];
    }
  });  
  }

  getTestNumberForTable() {
    let route = "got-sowing-details-test-number";
    let param = {
      getAlltest_number: true,
      year: this.ngForm.controls['year'].value,
      season: this.ngForm.controls['season'].value,
      crop_code: this.ngForm.controls['crop_code'].value,
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.testNumberTableList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      } else {
        this.testNumberTableList = [];
      }
    });  
  }

  getTestNumberDtails(test_number: any) {
  let route = "got-sowing-details-test-number-details";
  let param = {
    "test_number": test_number
  }
  this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
    if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
      this.testNumberDetails = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
    } else {
      this.testNumberDetails = [];
    }
  });  
  }

  toggleSearch() {
  if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop_code'].value) {
   Swal.fire({
     title: '<p style="font-size:25px;">Please Select All Required Fields.</p>',
     icon: 'warning',
     confirmButtonText:
       'OK',
     confirmButtonColor: '#E97E15'
   });
   return;
 }
   this.searchClicked = true;
   this.isConsignmentSelected = false;
   this.isTestSelected = false;
   this.ngForm.controls['consignment'].setValue('');
   this.ngForm.controls['testno'].setValue('');
   this.getConsignment();
   this.getSowingDetailsList('');
   this.getStatelist();
   this.getTestNumberForTable();
  }
  
  async getStatelist() {
    return new Promise((resolve, reject) => {
      const param = { is_state: 1 };
      this.master.postRequestCreator('get-all-state-list-data', null, param).subscribe(
        res => {
          if (res?.EncryptedResponse?.status_code === 200) {
            this.stateList= res?.EncryptedResponse?.data?.rows || [];
            this.stateListSecond= res?.EncryptedResponse?.data?.rows || [];
            resolve(true);
          } else {
            this.stateList= [];
            this.stateListSecond= [];      
            reject('Failed to fetch state list');
          }
        },
        error => reject(error)
      );
    });
  }
  
  async getDistrictList(stateCode: number) {
    return new Promise((resolve, reject) => {
      const param = { search: { state_code: stateCode } };
      this.master.postRequestCreator('get-district-list', null, param).subscribe(
        res => {
          if (res?.EncryptedResponse?.status_code === 200) {
            this.districtList= res?.EncryptedResponse?.data || [];
            this.districtListSecond= res?.EncryptedResponse?.data || [];      
            resolve(true);
          } else {
            this.districtList= [];
            this.districtListSecond= [];      
            reject('Failed to fetch district list');
          }
        },
        error => reject(error)
      );
    });
  }
  
  formatDateToSave(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  convertDatatoShow(item) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(item)
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
  }

  async editGotShowingDetail(data: any) {
   await Promise.all([
    this.getConsignment(true,data && data.consignment_number),
    this.getTestNumber(data.consignment_number,true,data && data.test_number),
    this.getStatelist(),
    this.getDistrictList(data.district_code),
  ]);

   this.gotShowingDetailId= data.id;
   this.is_update= true;
   this.isTestSelected = true;  
   this.ngForm.controls['showDisableInspectionDate'].setValue(true);
   this.ngForm.controls['testno'].disable();
   this.ngForm.controls['consignment'].disable();
  const expectedStartDate = new Date(data.expected_start_date);
  const expectedEndDate = new Date(data.expected_end_date);
    const expectedDateOfInspection: IMyDateModel = {
    isRange: true,
    dateRange: {
      beginDate: {
        year: expectedStartDate.getFullYear(),
        month: expectedStartDate.getMonth() + 1,
        day: expectedStartDate.getDate()
      },
      endDate: {
        year: expectedEndDate.getFullYear(),
        month: expectedEndDate.getMonth() + 1,
        day: expectedEndDate.getDate()
      }
    }
  };
  this.ngForm.patchValue({
    stateName: data.state_name, 
    state_code: data.state_code, 
    districtName: data.district_name, 
    district_code: data.district_code, 
    testno: data.test_number,
    consignment: data.consignment_number,
    address: data.address,
    // dateOfSowing: dateOfSowing,
    expected_date_inspection: expectedDateOfInspection,
    areaSown: data.area_shown,
   });
   this.ngForm.controls['dateOfSowing'].setValue(
    {
      isRange: false,
      singleDate: {
        formatted: data && data.date_of_showing ? this.convertDatatoShow(new Date(data && data.date_of_showing)) : '',
        jsDate: data && data.date_of_showing ? new Date(data && data.date_of_showing) : ''
      }
    }
  );
   this.selectState = data.state_name;
   this.selectDistrict = data.district_name;
   this.ngForm.controls['district_text'].enable();
  }

  onSubmit() {
   Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to save.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Accept!',
    cancelButtonText: 'No, cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      const selectedDate = new Date(this.ngForm.controls['expected_date_inspection'] && this.ngForm.controls['expected_date_inspection'].value && this.ngForm.controls['expected_date_inspection'].value.singleDate && this.ngForm.controls['expected_date_inspection'].value.singleDate.jsDate);
      const endDate = new Date(selectedDate);
      endDate.setDate(selectedDate.getDate() + 15);
      const formattedStartDate = this.formatDateToSave(selectedDate);
      const formattedEndDate = this.formatDateToSave(endDate);    

      let route = 'save-got-showing-details';
     let param = {
        got_testing_id:(this.testNumberDetails && this.testNumberDetails[0] && this.testNumberDetails[0].id) || 0,
        state_code: this.ngForm.controls['state_code'].value,
        district_code: this.ngForm.controls['district_code'].value,
        address: this.ngForm.controls['address'].value,
        area_shown: this.ngForm.controls['areaSown'].value,
        date_of_showing : this.ngForm.controls['dateOfSowing'].value && this.ngForm.controls['dateOfSowing'].value.singleDate && this.ngForm.controls['dateOfSowing'].value.singleDate.formatted ? this.convertDates(this.ngForm.controls['dateOfSowing'].value.singleDate.formatted) : '',
        expected_start_date: formattedStartDate,
        expected_end_date: formattedEndDate,
        user_id: this.userId.id,
        is_report_genertaed: 1,
      };
      this._productionCenter.postRequestCreator(route, param, null)
        .subscribe((res) => {
          if ( res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
            Swal.fire({
              title: 'Success!',
              text: res.EncryptedResponse.message,
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'btn btn-success',
              },
            }).then((result) => {
              if (result.isConfirmed) {
                this.getSowingDetailsList('');
                this.cancel();
                this.ngForm.controls['showDisableInspectionDate'].setValue(true);
                this.getConsignment();
              }
            });
          } else {
            Swal.fire({
              title: `<p style="font-size:25px;">${res.EncryptedResponse.message}</p>`,
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#E97E15',
            });
          }
        });
     }
  });
  }

  onUpdateData() {
    let selectedDate:any, endDate:any;
    const inspectionDate = this.ngForm.controls['expected_date_inspection'].value;
    if (inspectionDate.isRange && inspectionDate.dateRange) {
      const beginDate = inspectionDate.dateRange.beginDate;
      selectedDate = new Date(beginDate.year, beginDate.month - 1, beginDate.day);
      endDate = new Date(selectedDate);
      endDate.setDate(selectedDate.getDate() + 15);
    } else if (inspectionDate.singleDate) {
      selectedDate = new Date(inspectionDate.singleDate.jsDate);
      endDate = new Date(selectedDate);
      endDate.setDate(selectedDate.getDate() + 15);
    }
    const formattedStartDate = this.formatDateToSave(selectedDate);
    const formattedEndDate = this.formatDateToSave(endDate);

    const route = 'update-got-showing-details';
    const param = {
      id: this.gotShowingDetailId,
      state_code: this.ngForm.controls['state_code'].value,
      district_code: this.ngForm.controls['district_code'].value,
      address: this.ngForm.controls['address'].value,
      area_shown: this.ngForm.controls['areaSown'].value,
      date_of_showing : this.ngForm.controls['dateOfSowing'].value && this.ngForm.controls['dateOfSowing'].value.singleDate && this.ngForm.controls['dateOfSowing'].value.singleDate.formatted ? this.convertDates(this.ngForm.controls['dateOfSowing'].value.singleDate.formatted) : '',
      expected_start_date: formattedStartDate,
      expected_end_date: formattedEndDate,
      user_id: this.userId.id,
      is_report_genertaed: 1,
    };
  
    this._productionCenter.postRequestCreator(route, param, null)
      .subscribe((res) => {
        if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
          Swal.fire({
            title: 'Success!',
            text: res.EncryptedResponse.message,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              this.getSowingDetailsList('');
              this.is_update = false;
              this.cancel();
              this.ngForm.controls['testno'].enable();
              this.ngForm.controls['consignment'].enable();           
              this.ngForm.controls['showDisableInspectionDate'].setValue(true);
            }
          });
        } else {
          Swal.fire({
            title: `<p style="font-size:25px;">${res.EncryptedResponse.message}</p>`,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15',
          });
        }
      });
  }

  deleteGotShowingDetail(id: any) {
    let route = "delete-got-showing-detail";
      let param = {
          "id": id,
      }  
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Accept!',
        cancelButtonText: 'No, cancel',
      }).then((result) => {  
        if (result.isConfirmed) {  
      this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
       if ( res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.searchClicked = true;
        this.getConsignment();
        Swal.fire({
          title: 'Success!',
          text: res.EncryptedResponse.message,
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            this.getSowingDetailsList('');
            this.getTestNumber(this.ngForm.controls['consignment'].value);
          }
        });
      } else {
        Swal.fire({
          title: `<p style="font-size:25px;">${res.EncryptedResponse.message}</p>`,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15',
        });
      }
    });
   }
  });
  }

  onDateChange(event: any) {
    const selectedDate = new Date(event.target.value);
    if (isNaN(selectedDate.getTime())) {
      return;
    }
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 15);
  }

  formatDate(formatDate: Date): string {
    if(!formatDate){
      return 'NA';
    }
      const date = new Date(formatDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
  }

  getSowingDetailsList(test_number: any) {
    let route = "get-got-showing-details-list";
    let param = {
        test_number: test_number,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop_code'].value,
        consignment: this.ngForm.controls['consignment'].value,
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.sowingDetailsList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      } else {
        this.sowingDetailsList= [];
      }
    });
  }

  onConsignmentChange(event:any) {
    const selectedValue = event.target.value;
    if(selectedValue) {
      this.isConsignmentSelected = true;
    }
    this.getTestNumber(selectedValue);
    this.cancel();
  }
   
  cancel() {
    this.isTestSelected = false;
    this.is_update= false;
    this.ngForm.controls['testno'].setValue('',{ emitEvent: false });
    this.selectState = '';
    this.selectDistrict = '';
    this.ngForm.controls['address'].setValue('');
    this.getTestNumber(this.ngForm.controls['consignment'].value),
    this.getTestNumberForTable();
    this.ngForm.controls['expected_date_inspection'].setValue('');
    this.ngForm.controls['areaSown'].setValue('');
    this.ngForm.controls['dateOfSowing'].setValue('');
    this.ngForm.controls['showDisableInspectionDate'].setValue(true);
    this.ngForm.controls['testno'].enable();
    this.ngForm.controls['consignment'].enable();           
  }

  cgClick() {
    document.getElementById('crop_group').click();
  }

  cropNameValue(item: any) {
    this.selectCrop = item.crop_name;
    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_code'].setValue(item.crop_code);
    this.isConsignmentSelected = false;
    this.ngForm.controls['consignment'].setValue('');
    this.searchClicked = false;
    this.cancel();
    this.isTestSelected = false;
  }

  cropdatatext() {
    this.cropListSecond;
  }

  sgClick() {
    document.getElementById('state_group').click();
  }

  stateNameValue(item: any) {
    this.selectState = item.state_name;
    this.ngForm.controls["state_text"].setValue("");
    this.ngForm.controls['state_code'].setValue(item.state_code);
    this.getDistrictList(item.state_code);
    this.ngForm.controls['district_text'].enable();
  }

  statedatatext() {
    this.stateListSecond;
  }

  dgClick() {
    document.getElementById('district_group').click();
  }

  districtNameValue(item: any) {
    this.selectDistrict = item.district_name;
    this.ngForm.controls["district_text"].setValue("");
    this.ngForm.controls['district_code'].setValue(item.district_code);
  }

  districtdatatext() {
    this.districtListSecond;
  }

  getFinancialYear(year:any) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }

  // code start for Expected Date of Inspection
  ChangeInspectionField() {
    this.ngForm.controls['showDisableInspectionDate'].setValue(false)
  }
  preventKeyPress(event) {
    event.preventDefault();
  }
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDocumentClick: true,
    openSelectorTopOfInput: true,
  };
  onDateChanged(event: any, i): void {
    const endDate = event.singleDate.jsDate;
    if (endDate) {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      const date = new Date(endDate);
      date.setDate(date.getDate() + 15);
      let newDate = [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('/')
      let param = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';
      event.singleDate.formatted = `${event.singleDate.formatted}-${newDate}`;
      let res;
      let expected_date_harvest;
      if (param && param[i].date_of_showing && param[i].date_of_showing && param[i].date_of_showing.singleDate && param[i].date_of_showing.singleDate.formatted && param[i].date_of_showing.singleDate.formatted != '') {
        res = param[i].date_of_showing.singleDate.formatted
      }
      if (param && param[i].expected_date_harvest && param[i].expected_date_harvest && param[i].expected_date_harvest.singleDate && param[i].expected_date_harvest.singleDate.formatted && param[i].expected_date_harvest.singleDate.formatted != '') {
        expected_date_harvest = param[i].expected_date_harvest.singleDate.formatted.split('-');
        expected_date_harvest = expected_date_harvest[0]
      }
      let dateofShowing;
      if (res && res != '' && res != null) {
        dateofShowing = this.convertDates(res)
      }
      if (expected_date_harvest && expected_date_harvest != null) {
        expected_date_harvest = this.convertDates(expected_date_harvest)
      }
      let Inspection = event && event.singleDate && event.singleDate.formatted && (event.singleDate.formatted != '') ? event.singleDate.formatted.split('-') : "";
      let InspectionDate = this.convertDates(Inspection[0])
      let InspectionDate2 = this.convertDates(Inspection[0])
      if (dateofShowing && InspectionDate) {
        if (new Date(dateofShowing) > (new Date(InspectionDate))) {
          Swal.fire({
            title: '<p style="font-size:25px;">Expected date of inspection should be later than Date of Sowing.</p>',
            icon: 'error',
            showCancelButton: false,
            showConfirmButton: true,
          })
          event.singleDate.formatted = ''
        }
      } else if (new Date(expected_date_harvest) <= new Date(InspectionDate2)) {
        Swal.fire({
          title: '<p style="font-size:25px;">Expected date of harvesting" should be later than start date of "Expected date of inspection.</p>',
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: true,
        })
        event.singleDate.formatted = ''
      }
    }
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
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };
  get generateDefaultMonth(): string {
    let date = { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }
    return date.year + '-'
      + (date.month > 9 ? "" : "0") + date.month + '-'
      + (date.day > 9 ? "" : "0") + date.day;

  }
  toggleCalendar() {
    if (this.dp4) {
      this.dp4.toggleCalendar();
    }
  }
  onDateChangedStart(event: any): void {
  }
  // code end for Expected Date of Inspection
}
