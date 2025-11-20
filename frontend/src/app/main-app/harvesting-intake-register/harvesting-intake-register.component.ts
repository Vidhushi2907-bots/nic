import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IAngularMyDpOptions, IMyDate, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { checkDecimal } from 'src/app/_helpers/utility';
import * as html2PDF from 'html2pdf.js';
@Component({
  selector: 'app-harvesting-intake-register',
  templateUrl: './harvesting-intake-register.component.html',
  styleUrls: ['./harvesting-intake-register.component.css']
})
export class HarvestingIntakeRegisterComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  dummyData = []

  ngForm!: FormGroup
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []
  allData: any;
  yearData;
  seasonlist
  cropData;
  todayDate = new Date();
  parsedDate = Date.parse(this.todayDate.toString());
  varietyData
  tableData;
  plotList
  seedProcessingPlantList
  selected_plot = "2023-24/K/0000/A0101/1";
  selectCrop: any;
  croplistSecond;
  varietyListSecond;
  selectVariety: any;
  submitted = false;
  unit: string;
  selectedSeason: string = '';
  isSearchClicked = false;
  isParentalLine = false;
  parentalDataList: any;
  parentalDataListSecond: any;
  // todayDate=new Date()
  plotListSecond: any;
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };
  showGrid: boolean;
  selectParentalLine: any;
  selectPlot: any;
  selectSpp: any;
  seedProcessingPlantListSecond: any;
  selectSeedProcessingPlant: any;
  rangeNumber: number;
  ref_number: number;
  editId: any;
  editData: boolean;
  showPlot: boolean;
  markBagArr;
  maximumRange: number;
  investingBagData: any;
  investingBagDataofId: any;
  bag_marka: any;
  bag_no: any;
  responseValue: any;
  responseValueMax: any;
  bspProforma3DataseedData: any;
  seedClassId: any;
  StageId: any;
  actualRefNO: any;
  get generateDefaultMonth(): string {
    let date = { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }

    //consolelog(date);
    return date.year + '-'
      + (date.month > 9 ? "" : "0") + date.month + '-'
      + (date.day > 9 ? "" : "0") + date.day;

  }
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    // disableSince: {}
    // disableUntil: { year: parseInt(this.y), month: parseInt(this.m)+1, day: this.todayDate.getDate() -1 },
    // disableSince: { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }
  };
  constructor(private service: SeedServiceService, private fb: FormBuilder, private productionService: ProductioncenterService) {
    this.createForm();
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: ['', [Validators.required]],
      plot: ['', [Validators.required]],
      parental_line: [''],
      inspected_area: ['',],
      estimated_production: ['',[Validators.required]],
      tentative_harvest: ['',],
      actual_harvest: ['',[Validators.required]],
      seed_produced: ['',],
      bag_number: ['',[Validators.required]],
      bag_marka: ['',[Validators.required]],
      processing_plant: ['',[Validators.required]],
      crop_text: [''],
      variety_text: [''],
      parental_line_text: [''],
      plot_text: [''],
      spp_text: [''],

      // bsp2Arr: this.fb.array([
      //   this.bsp2arr(),
      // ]),
    });
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['plot'].disable();
    this.ngForm.controls['inspected_area'].disable();
    this.ngForm.controls['estimated_production'].disable();
    this.ngForm.controls['tentative_harvest'].disable();
    // this.ngForm.controls['bag_marka'].disable();

    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['plot'].disable();
        this.ngForm.controls['season'].enable();
        this.selectVariety = '';
        this.selectCrop = '';
        this.ngForm.controls['crop'].reset('');
        this.getSeasonData()
        this.selectParentalLine = '';
        this.editData = false;
        this.selectPlot = '';
        this.isParentalLine = false;
        this.ngForm.controls['parental_line'].setValue('');
        // this.ngForm.controls['season'].reset('');
        this.ngForm.controls['season'].markAsUntouched();
        this.ngForm.controls['variety'].reset('');
        this.ngForm.controls['plot'].reset('');
        this.selectParentalLine = '';
        this.isSearchClicked = false;

      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['plot'].disable();
        this.selectVariety = '';
        this.selectCrop = '';
        this.selectParentalLine = '';
        this.selectPlot = '';
        this.ngForm.controls['crop'].reset('');
        this.ngForm.controls['variety'].reset('');
        this.isParentalLine = false;
        this.editData = false;
        this.selectParentalLine = '';
        this.getCropData()
        this.ngForm.controls['plot'].reset('');
        this.ngForm.controls['parental_line'].setValue('');
        this.isSearchClicked = false;
        // getCrop();
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {

        this.ngForm.controls['plot'].disable();
        this.selectVariety = '';
        this.selectParentalLine = '';
        if (newvalue.slice(0, 1) == "A") {
          this.unit = "Qt";
        } else {
          this.unit = "Kg";
        }
        this.selectPlot = '';
        this.editData = false;
        this.ngForm.controls['variety'].reset('');
        this.selectParentalLine = '';
        this.ngForm.controls['plot'].reset('');
        this.ngForm.controls['parental_line'].setValue('');
        this.isSearchClicked = false;
        this.isParentalLine = false;
        this.getVarietyData()
        // getVariety();
      }
    });

    this.ngForm.controls['variety'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.isSearchClicked = false;

        this.selectParentalLine = '';
        this.selectPlot = '';
        this.editData = false;
        this.ngForm.controls['plot'].enable();
        this.selectParentalLine = '';
        this.ngForm.controls['parental_line'].setValue('');
        this.ngForm.controls['plot'].reset('');

        // this.getVarietyNotificationYear();
      }
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
        this.cropData = this.croplistSecond
        // this.getCropData()
      }
    });

    this.ngForm.controls['parental_line'].valueChanges.subscribe(item => {
      if (item) {
        // this.selectParentalLine='';
        this.selectPlot = '';
        this.isSearchClicked = false;
        this.showPlot = true
        this.getPlotDetails()

      }
    });
    this.ngForm.controls['variety_text'].valueChanges.subscribe(item => {
      if (item) {
        this.varietyData = this.varietyListSecond;
        let response = this.varietyData.filter(x =>
          x.variety_name.toLowerCase().includes(item.toLowerCase()));
        this.varietyData = response
      }
      else {
        this.varietyData = this.varietyListSecond;
        // this.getVarietyData(this.ngForm.controls['crop'].value);
      }
    });
    this.ngForm.controls['parental_line_text'].valueChanges.subscribe(item => {
      if (item) {
        this.parentalDataList = this.parentalDataListSecond;
        let response = this.parentalDataList.filter(x =>
          x.line_variety_name.toLowerCase().includes(item.toLowerCase()));
        this.parentalDataList = response
      }
      else {
        this.parentalDataList = this.parentalDataListSecond;
        // this.getVarietyData(this.ngForm.controls['crop'].value);
      }
    });
    this.ngForm.controls['spp_text'].valueChanges.subscribe(item => {
      if (item) {
        this.seedProcessingPlantList = this.seedProcessingPlantListSecond;
        let response = this.seedProcessingPlantList.filter(x =>
          x.name && x.name.toLowerCase().includes(item.toLowerCase())
        );
        this.seedProcessingPlantList = response;
      } else {
        this.seedProcessingPlantList = this.seedProcessingPlantListSecond;
      }
    });
    
    

    this.ngForm.controls['plot_text'].valueChanges.subscribe(item => {
      if (item) {
        this.plotList = this.plotListSecond;
        let response = this.plotList.filter(x =>
          x.field_code.toLowerCase().includes(item.toLowerCase()));
        this.plotList = response
      }
      else {
        this.plotList = this.plotListSecond;
      }
    });
  }

  ngOnInit(): void {
    this.fetchData();
  }


  crop(item: any) {
    this.selectCrop = item && item.crop_name ? item.crop_name : ''
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropData = this.croplistSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
  }

  variety(item: any) {
    this.selectVariety = item && item.variety_name ? item.variety_name : ''
    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })

    this.varietyData = this.varietyListSecond;
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
    this.ngForm.controls['variety_text'].setValue('',{ emitEvent: false, onlySelf: true })
    if (item && item.status && item.status == 'hybrid') {
      this.isParentalLine = true;
      this.showPlot = false;
      this.getVarietyLine()
    } else {
      this.showPlot = true;
      this.isParentalLine = false;
      this.getPlotDetails()
    }
  }
  selectParentalData(item) {
    this.selectParentalLine = item && item.line_variety_name ? item.line_variety_name : ''
    // this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    this.parentalDataList = this.parentalDataListSecond
    this.ngForm.controls['parental_line_text'].setValue('',{ emitEvent: false, onlySelf: true })
    // this.line = this.varietyListSecond;
    this.ngForm.controls['parental_line'].setValue(item && item.variety_line_code ? item.variety_line_code : '')

  }

  selectPlotData(item) {
    this.selectPlot = item && item.field_code ? item.field_code : ''
    // this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    this.ngForm.controls['plot'].setValue(item && item.field_code ? item.field_code : '')
    this.plotList = this.plotListSecond;
    this.ngForm.controls['plot_text'].setValue('',{ emitEvent: false, onlySelf: true })
    // this.line = this.varietyListSecond;

  }
  selectSppData(item) {
    this.selectSeedProcessingPlant = item?.name || '';
    this.ngForm.controls['spp_text'].setValue('', { emitEvent: false });
    this.ngForm.controls['processing_plant'].setValue(item?.user_id || '');
  }
  cClick() {
    document.getElementById('crop').click();
  }

  vClick() {
    document.getElementById('variety').click();
  }

  pClick() {
    document.getElementById('parentalline').click();
  }
  plClick() {
    document.getElementById('plot').click();
  }
  sppClick() {
    document.getElementById('spp').click();
  }
  fetchData() {
    // this.getPageData();

    for (let data of this.dummyData) {
      let bsplength = data.bsp2Arr.length;
      data.bsplength = bsplength
    }
    this.getYearData()
    this.getSppDetails()
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.service.postRequestCreator("data-characterstics-list", null, {
      // page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      // pageSize: 50,
      search: {
        // crop_group: (this.ngForm.controls["crop_group"].value),
        // crop_name: this.ngForm.controls["crop_name"].value,
        // variety_name: this.ngForm.controls["variety_name"].value,
        // variety_name_filter: this.ngForm.controls['variety_name_filter'].value ? this.ngForm.controls['variety_name_filter'].value : '',
        // user_id: this.userId.id
      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.filterPaginateSearch.itemListPageSize = 4;
        this.allData = this.inventoryData
        if (this.allData === undefined) {
          this.allData = [];
        }
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, 8, true);
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
  saveData(data: any) {
    this.submitted = true;
    if (this.ngForm.invalid) {
      Swal.fire(
        {
          icon: 'warning',
          title: 'Please Fill All Required Field',
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonColor: '#B64B1D'
        }
      )
      return;
    }
    this.saveForm()
  }

  searchData(data: any) {
    // if (this.ngForm.controls['year'].value == null || this.ngForm.controls['season'].value == null || this.ngForm.controls['crop'].value == null || this.ngForm.controls['variety'].value == null) {
    //   this.submitted = true;
    //   return;
    // }

    if ((!this.ngForm.controls["year"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Year.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    else if ((!this.ngForm.controls["season"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    else if ((!this.ngForm.controls["crop"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }

    // this.submitted = true;
    this.showGrid = true;

    // if(this.ngForm.valid){
    //   this.isSearchClicked = true;
    // }else{
    //   this.isSearchClicked = false;
    // }
    this.getInspectionDetails();
    this.getPageFormData();
    this.getRangeData();
  }

  clearData() {
    this.selectVariety = '';
    // this.selectCrop = '';
    // this.ngForm.controls['crop'].reset('');
    // this.ngForm.controls['season'].reset('');
    // this.ngForm.controls['year'].patchValue('');
    // this.ngForm.controls['year'].markAsUntouched();
    this.ngForm.controls['variety'].reset('');
    this.ngForm.controls['plot'].reset('');
    this.ngForm.controls['parental_line'].reset('');
    this.selectParentalLine = '';
    this.selectPlot = ''
    this.ngForm.controls['actual_harvest'].patchValue('');
    this.ngForm.controls['seed_produced'].patchValue('');
    this.ngForm.controls['bag_number'].patchValue('');
    this.ngForm.controls['bag_marka'].patchValue('');
    this.selectSeedProcessingPlant = '';
    // bag_marka
    this.ngForm.controls['processing_plant'].patchValue('');
    this.editData = false;
    this.isSearchClicked = false;
  }
  getYearData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId
      }
    }
    this.productionService.postRequestCreator('get-harvesting-inatake-year', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.yearData = response ? response : '';

      }
    })
  }
  getSeasonData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value
      }
    }
    this.productionService.postRequestCreator('get-harvesting-inatake-season', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.seasonlist = response ? response : '';

      }
    })
  }
  getCropData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value
      }
    }
    this.productionService.postRequestCreator('get-harvesting-inatake-crop', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.cropData = response ? response : '';
        this.croplistSecond = this.cropData
      }
    })
  }
  getVarietyData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value
      }
    }
    this.productionService.postRequestCreator('get-harvesting-inatake-variety', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.varietyData = response ? response : '';
        this.varietyListSecond = this.varietyData
      }
    })
  }
  getVarietyLine() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value
      }
    }
    this.productionService.postRequestCreator('get-harvesting-inatake-variety-line', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.parentalDataList = response ? response : '';
        this.parentalDataListSecond = this.parentalDataList
      }
    })
  }
  getPlotDetails() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        variety_line_code: this.ngForm.controls['parental_line'].value,
      }
    }
    this.productionService.postRequestCreator('get-harvesting-inatake-variety-plot', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.plotList = response ? response : '';
        this.plotListSecond = this.plotList
      }
    })
  }
  getSppDetails() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        variety_line_code: this.ngForm.controls['parental_line'].value,
      }
    }
    this.productionService.postRequestCreator('get-spp-data', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.seedProcessingPlantList = response ? response : '';
        this.seedProcessingPlantListSecond = this.seedProcessingPlantList
      }
    })
  }
  getInspectionDetails() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        variety_line_code: this.ngForm.controls['parental_line'].value,
        plotid: this.ngForm.controls['plot'].value,
      }
    }
    this.productionService.postRequestCreator('get-inspection-area', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        // inspected_area
        let bspProforma3DataseedData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.bspProforma3DataseedData ? data.EncryptedResponse.data.bspProforma3DataseedData : '';
        this.bspProforma3DataseedData = bspProforma3DataseedData
        if (bspProforma3DataseedData && bspProforma3DataseedData.length > 0) {
          bspProforma3DataseedData.forEach((el, i) => {
            if (el && el.line_variety_code) {
              if (el.line_variety_code == this.ngForm.controls['parental_line'].value) {
                this.seedClassId = el && el.seed_class_id ? el.seed_class_id : ''
                this.StageId = el && el.stage_id ? el.stage_id : ''
              } else {
                this.seedClassId = '';
                this.StageId = ''
              }

            }
            else {
              if (i == 0) {
                this.seedClassId = el && el.seed_class_id ? el.seed_class_id : '';
                this.StageId = el && el.stage_id ? el.stage_id : '';
              }
            }
          })
        }

        this.ngForm.controls['inspected_area'].setValue(response && response.inspectionData && response.inspectionData[0] && response.inspectionData[0].inspected_area ? response.inspectionData[0].inspected_area : 0)
        this.ngForm.controls['estimated_production'].setValue(response && response.expectedProd && response.expectedProd[0] && response.expectedProd[0].estimated_production ? response.expectedProd[0].estimated_production : 0)
        let date_of_harvesting = response && response.bsp3harvestDate && response.bsp3harvestDate[0].date_of_harvesting ? response.bsp3harvestDate[0].date_of_harvesting : '';
        let harv_to_date = response && response.bsp3harvestDate && response.bsp3harvestDate[0].harv_to_date ? response.bsp3harvestDate[0].harv_to_date : '';
        let tentative_harvest = this.formatDateRange(date_of_harvesting, harv_to_date);
        this.ngForm.controls['tentative_harvest'].setValue(tentative_harvest ? tentative_harvest : '')
        let address = response && response.plotAddress && response.plotAddress[0].address ? response.plotAddress[0].address : '';
        let district = response && response.plotAddress && response.plotAddress[0].district_name ? response.plotAddress[0].district_name : '';
        let state = response && response.plotAddress && response.plotAddress[0].state_name ? response.plotAddress[0].state_name : '';
        this.selected_plot = address + ', ' + district + ', ' + state

      }
    })
  }
  getRangeData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        editMode: this.editData,
        editId: this.editId,

      }
    }
    this.productionService.postRequestCreator('get-bag-data', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.bspProforma3Data ? data.EncryptedResponse.data.bspProforma3Data : '';
        let actualRefNO = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.actualRefNo ? data.EncryptedResponse.data.actualRefNo : '';
        let investingBagData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.investingBagData ? data.EncryptedResponse.data.investingBagData : '';
        let investingBagDataofId = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.investingBagDataofId ? data.EncryptedResponse.data.investingBagDataofId : '';
        this.investingBagData = investingBagData ? investingBagData : '';
        this.investingBagDataofId = investingBagDataofId ? investingBagDataofId : '';
        // inspected_area
        this.actualRefNO = actualRefNO && actualRefNO[0] && actualRefNO[0].ref_number ? actualRefNO[0].ref_number : ''
        if (!response) {
          this.rangeNumber = 1
        } else {
          this.rangeNumber = parseInt(response) + 1;
        }
      }
    })
  }
  // getRangeDataValue(e) {
  //   const getLocalData = localStorage.getItem('BHTCurrentUser');
  //   let data = JSON.parse(getLocalData)
  //   let UserId = data.id;
  //   let season = this.ngForm.controls['season'].value ? this.ngForm.controls['season'].value.toUpperCase() : '';
  //   let User_id = UserId
  //   let value
  //   // if()
  //   if (this.rangeNumber != 1 && !this.editData) {
  //     value = (parseInt(e.target.value)) + this.rangeNumber;

  //     // value = (parseInt(e.target.value)) + this.rangeNumber;
  //   } else {
  //     value = e.target.value;
  //   }

  //   if(this.editData){
  //     this.rangeNumber=this.rangeNumber

  //   }
  //   let bagArr=[]
  //   let showData=false
  //   if( this.investingBagDataofId &&  this.investingBagDataofId.length>0 && this.editData){
  //     if( this.investingBagData &&  this.investingBagData.length>0 && this.editData){
  //       this.investingBagData=  this.investingBagData.sort((a, b) => b.total_number - a.total_number);
  //       this.investingBagDataofId=  this.investingBagDataofId.sort((a, b) => b.total_number - a.total_number);
  //      let num= this.investingBagData && this.investingBagData[0] && this.investingBagData[0].total_number ? this.investingBagData[0].total_number  :0;     
  //      let num2= this.investingBagDataofId && this.investingBagDataofId[0] && this.investingBagDataofId[0].total_number ? this.investingBagDataofId[0].total_number  :0;     
  //      if(num>=num2){
  //       showData=true
  //      }
  //      else{
  //       showData=false
  //      }

  //     }
  //   }
  //   if( this.investingBagData &&  this.investingBagData.length>0 && this.editData &&showData){
  //     this.investingBagData=  this.investingBagData.sort((a, b) => b.total_number - a.total_number);

  //     // value=parseInt(value)-this.investingBagDataofId.length;
  //     this.rangeNumber= this.investingBagData && this.investingBagData[0] && this.investingBagData[0].total_number ? this.investingBagData[0].total_number  :0;     
  //     //  this.investingBagData.forEach((el,i)=>{
  //     //   bagArr.push({bag_range:el && el.bags ? el.bags:''})
  //     // })
  //   }  
  //   if( this.investingBagDataofId &&  this.investingBagDataofId.length>0 && this.editData ){
  //         this.investingBagDataofId.forEach((el,i)=>{
  //       bagArr.push({bagrange:el && el.bags ? el.bags:'',total_num:i+1})
  //     })
  //   }  
  //   let arr = []
  //   let markBagArr = [];
  //   if(this.editData && !showData){
  //     if(this.bag_marka && this.bag_marka.includes(',')){
  //       let arrs=this.bag_marka.split(',')
  //       let lastElement = arrs[arrs.length - 1];
  //       // value=value-this.bag_no
  //       // value = (parseInt(value)- parseInt(this.bag_no)) + this.rangeNumber;
  //       if(arrs.length>2){
  //       }
  //       // this.rangeNumber= this.investingBagDataofId && this.investingBagDataofId[0] && this.investingBagDataofId[0].total_number ? this.investingBagDataofId[0].total_number  :0;     

  //     }    
  //   }

  //   for (let i = this.rangeNumber;i <=parseInt(value); i++) {
  //     arr.push(i)
  //   } 

  //   if(this.editData && showData){
  //   let poplength = arr.length-this.investingBagDataofId.length    
  //    arr.splice(poplength)
  //   }

  //   for (let i = 1;i<=arr.length; i++) {
  //     markBagArr.push({ bagrange: `${season}${i}` })
  //   }
  //   let minnum = Math.min(...arr)
  //   let maxnum = Math.max(...arr);

  //   this.ref_number = maxnum
  //   let markBagArr2=[];
  //   for (let i = Number(minnum); i<Number(maxnum); ++i) {
  //     markBagArr2.push({ bagrange: `${season}(${(User_id)})${i}`,total_num:i })
  //   }

  //   if(this.editData && showData){
  //     let markBag = `${season}(${(User_id)})${minnum+1} - ${maxnum}`      
  //     this.ngForm.controls['bag_marka'].setValue(this.bag_marka+','+markBag )
  //     markBagArr2=[...markBagArr2,...bagArr]
  //   }
  //   else if(this.editData){
  //     if(this.bag_marka && this.bag_marka.includes(',')){
  //       let arrs=this.bag_marka.split(',')
  //       let lastElement = arrs[arrs.length - 1];
  //       // bagArr.sort(a.total_number - )
  //       let arr1 =arr[0]
  //       let arr2 =arr[arr.length - 1];        
  //       lastElement=`${season}(${(User_id)})${arr1} - ${arr2}` 
  //       arrs[arrs.length - 1] = lastElement;
  //       let markBag = arrs.join(',');
  //       this.ngForm.controls['bag_marka'].setValue(markBag ? markBag : '');    
  //     }     
  //   }else{
  //       let markBag = `${season}(${(User_id)})${minnum} -${maxnum}`
  //     this.ngForm.controls['bag_marka'].setValue(markBag ? markBag : '')
  //     this.maximumRange = maxnum
  //   }
  //   this.markBagArr = markBagArr2;



  // }
  getRangeDataValue(e) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.code;
    let season = this.ngForm.controls['season'].value ? this.ngForm.controls['season'].value.toUpperCase() : '';
    let User_id = UserId
    if (this.editData) {
      // this.rangeNumber
      let num = Number(this.rangeNumber) + (parseInt(e.target.value))
      // let num1 = (parseInt(e.target.value) - parseInt(this.bag_no))
      let num1 = Number(this.rangeNumber) + (parseInt(e.target.value))
      if (this.bag_marka && this.bag_marka.includes(',')) {
        let arrs = this.bag_marka.split(',')
        let lastElement = arrs[arrs.length - 1];
        let lastElements = lastElement.split('-');
        let last = lastElements[1];
        let investingBagDataofId;
        let investingBagData;
        let bagArr = [];
        if (this.investingBagDataofId && this.investingBagDataofId.length > 0) {
          this.investingBagDataofId = this.investingBagDataofId.sort((a, b) => b.total_number - a.total_number)
          investingBagDataofId = this.investingBagDataofId && this.investingBagDataofId[0] && this.investingBagDataofId[0].total_number ? this.investingBagDataofId[0].total_number : 0;
          this.investingBagDataofId.forEach((el, i) => {
            bagArr.push({ bagrange: el && el.bags ? el.bags : '', total_num: el && el.total_number ? el.total_number : '' })
          })
        }
        if (this.investingBagData && this.investingBagData.length > 0) {
          this.investingBagData = this.investingBagData.sort((a, b) => b.total_number - a.total_number)
          investingBagData = this.investingBagData && this.investingBagData[0] && this.investingBagData[0].total_number ? this.investingBagData[0].total_number : 0;
        }
        if (parseInt(investingBagData) >= parseInt(investingBagDataofId)) {
          if (parseInt(this.bag_no) > parseInt(e.target.value)) {
            // let bagMarka=arrs.split(',');
            // alert('hi3')
            let rangeValue = true
            let nums = this.bag_no - parseInt(e.target.value);
            let lastNum = last - nums;
            let updatedRanges = arrs.map((range) => {
              let match = range.match(/([A-Za-z]+\(\d+\))(\d+)\s*-\s*(\d+)/);
              if (match) {
                let dynamicPart = match[1];
                let startRange = parseInt(match[2], 10);
                let endRange = Math.min(parseInt(match[3], 10), lastNum); // Update the end range to the minimum of the original value and 'a'              
                if (Number(startRange) < Number(endRange)) {
                  rangeValue = true;
                  return `${dynamicPart}${startRange} - ${endRange}`;
                } else {
                  rangeValue = false
                }
              } else {
                rangeValue = true;
                return range;
              }
            });
            let updatedRangesRange
            if (rangeValue) {
              updatedRangesRange = updatedRanges.join(',');
              this.ngForm.controls['bag_marka'].setValue(updatedRangesRange)
            } else {

              let firstNonNullOrUndefinedValue = updatedRanges.filter(value => value !== null && value !== undefined);
              let firstNonNullOrUndefinedValue2 = updatedRanges.filter(value => value !== null && value !== undefined);
              console.log(firstNonNullOrUndefinedValue, 'firstNonNullOrUndefinedValue')

              const outputArray = [];
              for (const item of firstNonNullOrUndefinedValue) {
                const matches = item.match(/([A-Z]+\(\d+\))(\d+) - (\d+)/);
                if (matches) {
                  const dynamicPart = matches[1];
                  const start = parseInt(matches[2], 10);
                  const end = parseInt(matches[3], 10);

                  for (let i = start; i <= end; i++) {
                    outputArray.push(`${dynamicPart}${i}`);
                  }
                }
              }
              let outputArrayData = outputArray.slice(0, Number(e.target.value))
              const sortedArray = outputArrayData.sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)[0]);
                const numB = parseInt(b.match(/\d+/)[0]);
                return numA - numB;
              });
              const generateRanges = (arr) => {
                const ranges = [];
                let start, end, prefix;
                for (let i = 0; i < arr.length; i++) {
                  const matches = arr[i].match(/([A-Z]+\(\d+\))(\d+)/);
                  const currentNum = parseInt(matches[2]);
                  const currentPrefix = matches[1];

                  if (i === 0) {
                    start = currentNum;
                    end = currentNum;
                    prefix = currentPrefix;
                  } else if (currentNum === end + 1 && currentPrefix === prefix) {
                    end = currentNum;
                  } else {
                    const rangeString = `${prefix}${start}${start !== end ? `-${end}` : ''}`;
                    ranges.push(rangeString);
                    start = currentNum;
                    end = currentNum;
                    prefix = currentPrefix;
                  }
                }

                // Push the last range
                const lastRangeString = `${prefix}${start}${start !== end ? `-${end}` : ''}`;
                ranges.push(lastRangeString);

                return ranges;
              };

              // Generate and log the ranges
              const resultRanges = generateRanges(sortedArray);
              let resultRangesData = resultRanges && resultRanges.length > 1 ? resultRanges.join(',') : resultRanges;
              console.log(resultRangesData, 'resultRangesDataresultRangesData')
              this.ngForm.controls['bag_marka'].setValue(resultRangesData);
            }
          }
          else {
            // alert('hi4')
            // console.log(this.actualRefNO, 'actualRefNO')
            // console.log(this.rangeNumber, 'this.rangeNumber')

            if (this.rangeNumber < this.actualRefNO) {
              num1 = (Number(this.actualRefNO) + (parseInt(e.target.value) - parseInt(this.bag_no))) - 1;
            } else {
              num1 = (Number(this.rangeNumber) + (parseInt(e.target.value) - parseInt(this.bag_no))) - 1;
            }
            // num1 = (Number(this.rangeNumber) + (parseInt(e.target.value) - parseInt(this.bag_no))) - 1;

            // console.log(num1, 'num1')
            if (this.rangeNumber < this.actualRefNO) {
              let inputString = this.bag_marka;
              let targetNumber = num1;
              // Split the inputString into two parts
              let parts = inputString.split(",");
              // Extract the last part which needs to be updated
              let lastPart = parts[parts.length - 1];
              // Extract the current number part from the last part
              let currentNumber = parseInt(lastPart.split("-")[1]);
              // Update the last part with the targetNumber
              let updatedLastPart = lastPart.replace(currentNumber.toString(), targetNumber.toString());
              // Join the parts back together with the updated last part
              let updatedInputString = parts.slice(0, parts.length - 1).join(",") + "," + updatedLastPart;
              console.log(updatedInputString);
              this.ngForm.controls['bag_marka'].setValue(updatedInputString);

            }
            else if (num1 > Number(this.rangeNumber)) {
              this.ngForm.controls['bag_marka'].setValue(`${this.bag_marka},${season}(${User_id})${this.rangeNumber} - ${num1}`);
            } else if (parseInt(this.bag_no) == parseInt(e.target.value)) {
              this.ngForm.controls['bag_marka'].setValue(`${this.bag_marka}`);
            } else {
              this.ngForm.controls['bag_marka'].setValue(`${this.bag_marka},${season}(${User_id})${num1}`);
            }
            console.log(num1, 'num1')
          }
        } else {
          if (parseInt(this.bag_no) > parseInt(e.target.value)) {
            // alert('hi6')
            let nums = this.bag_no - parseInt(e.target.value);
            let lastNum = last - nums;
            let rangeValue = true
            let updatedRanges = arrs.map((range) => {
              let match = range.match(/([A-Za-z]+\(\d+\))(\d+)\s*-\s*(\d+)/);
              if (match) {
                let dynamicPart = match[1];
                let startRange = parseInt(match[2], 10);
                let endRange = Math.min(parseInt(match[3], 10), lastNum); // Update the end range to the minimum of the original value and 'a'
                if (Number(startRange) < Number(endRange)) {
                  rangeValue = true;
                  return `${dynamicPart}${startRange} - ${endRange}`;
                } else {
                  rangeValue = false
                }
                // return `${dynamicPart}${startRange} - ${endRange}`;
              } else {
                rangeValue = true;
                return range;
              }
            });
            let updatedRangesRange;
            if (rangeValue) {
              updatedRangesRange = updatedRanges.join(',');
              this.ngForm.controls['bag_marka'].setValue(updatedRangesRange)
            } else {
              let firstNonNullOrUndefinedValue = updatedRanges.filter(value => value !== null && value !== undefined);
              let firstNonNullOrUndefinedValue2 = updatedRanges.filter(value => value !== null && value !== undefined);
              console.log(firstNonNullOrUndefinedValue, 'firstNonNullOrUndefinedValue')

              const outputArray = [];
              for (const item of firstNonNullOrUndefinedValue) {
                const matches = item.match(/([A-Z]+\(\d+\))(\d+) - (\d+)/);
                if (matches) {
                  const dynamicPart = matches[1];
                  const start = parseInt(matches[2], 10);
                  const end = parseInt(matches[3], 10);

                  for (let i = start; i <= end; i++) {
                    outputArray.push(`${dynamicPart}${i}`);
                  }
                }
              }
              let outputArrayData = outputArray.slice(0, Number(e.target.value))
              const sortedArray = outputArrayData.sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)[0]);
                const numB = parseInt(b.match(/\d+/)[0]);
                return numA - numB;
              });
              const generateRanges = (arr) => {
                const ranges = [];
                let start, end, prefix;
                for (let i = 0; i < arr.length; i++) {
                  const matches = arr[i].match(/([A-Z]+\(\d+\))(\d+)/);
                  const currentNum = parseInt(matches[2]);
                  const currentPrefix = matches[1];

                  if (i === 0) {
                    start = currentNum;
                    end = currentNum;
                    prefix = currentPrefix;
                  } else if (currentNum === end + 1 && currentPrefix === prefix) {
                    end = currentNum;
                  } else {
                    const rangeString = `${prefix}${start}${start !== end ? `-${end}` : ''}`;
                    ranges.push(rangeString);
                    start = currentNum;
                    end = currentNum;
                    prefix = currentPrefix;
                  }
                }

                // Push the last range
                const lastRangeString = `${prefix}${start}${start !== end ? `-${end}` : ''}`;
                ranges.push(lastRangeString);

                return ranges;
              };
              // Generate and log the ranges
              const resultRanges = generateRanges(sortedArray);
              let resultRangesData = resultRanges && resultRanges.length > 1 ? resultRanges.join(',') : resultRanges;
              this.ngForm.controls['bag_marka'].setValue(resultRangesData);
            }
          } else {
            // alert(this.rangeNumber + 'h17')
            let nums = this.bag_no - parseInt(e.target.value);
            let lastNum = last - nums;
            let numval = Number(this.rangeNumber) + (parseInt(e.target.value) - parseInt(this.bag_no));
            let num2 = (parseInt(e.target.value) - parseInt(this.bag_no))
            num1 = this.responseValueMax + num2
            lastElements = `${season}(${User_id})${this.rangeNumber} - ${num1}`
            let datas = `${season}(${User_id})${this.rangeNumber}`
            arrs[arrs.length - 1] = lastElements;
            // if(num1>this.rangeNumber){
            this.ngForm.controls['bag_marka'].setValue(arrs && arrs.length > 0 ? arrs.join(',') : '');
            // }
          }
        }
        let bagData = this.ngForm.controls['bag_marka'].value;
        let regex = /([A-Za-z]+\(\d+\))(\d+)\s*-\s*(\d+)/g;

        // Initialize an object to store the extracted data for each dynamic prefix
        let extractedData = {};

        // Use the regular expression to match and extract data from the string
        let match;
        while ((match = regex.exec(bagData)) !== null) {
          let dynamicPrefix = match[1];
          let startRange = parseInt(match[2], 10);
          let endRange = parseInt(match[3], 10);

          // If the dynamic prefix is not yet in the extractedData object, initialize it as an array
          if (!extractedData[dynamicPrefix]) {
            extractedData[dynamicPrefix] = [];
          }

          // Add the individual values to the array
          for (let i = startRange; i <= endRange; i++) {
            extractedData[dynamicPrefix].push({ bagrange: dynamicPrefix + i, total_num: i });
          }
        }
        let keysArray = Object.values(extractedData);
        const arrayForKey = extractedData[0];
        keysArray = keysArray.flat();

        keysArray = keysArray.sort((a, b) => b['total_num'] - a['total_num'])
        this.ref_number = keysArray && keysArray[0] && keysArray[0]['total_num'] ? keysArray[0]['total_num'] : 0;
        this.maximumRange = keysArray && keysArray[0] && keysArray[0]['total_num'] ? keysArray[0]['total_num'] : 0;
        this.markBagArr = keysArray;
      } else {
        let investingBagDataofId;
        let investingBagData;
        let bagArr = []
        if (this.investingBagDataofId && this.investingBagDataofId.length > 0) {
          this.investingBagDataofId = this.investingBagDataofId.sort((a, b) => b.total_number - a.total_number)
          investingBagDataofId = this.investingBagDataofId && this.investingBagDataofId[0] && this.investingBagDataofId[0].total_number ? this.investingBagDataofId[0].total_number : 0;
          this.investingBagDataofId.forEach((el, i) => {
            bagArr.push({ bagrange: el && el.bags ? el.bags : '', total_num: el && el.total_number ? el.total_number : '' })
          })
        }
        if (this.investingBagData && this.investingBagData.length > 0) {
          this.investingBagData = this.investingBagData.sort((a, b) => b.total_number - a.total_number)
          investingBagData = this.investingBagData && this.investingBagData[0] && this.investingBagData[0].total_number ? this.investingBagData[0].total_number : 0;
        }
        let markBagArr = [];
        let arrs = this.bag_marka.split('-')
        let num = Number(this.rangeNumber) + (parseInt(e.target.value));
        // let num1 = (parseInt(e.target.value) - parseInt(this.bag_no));
        let num1 = Number(this.rangeNumber) + (parseInt(e.target.value));
        let last = arrs[1];
        let lastdata = `${season}(${User_id})${this.rangeNumber} - ${num1}`;
        if (investingBagData >= investingBagDataofId) {
          if (parseInt(this.bag_no) < parseInt(e.target.value)) {
            // alert('hi1')
            console.log(this.actualRefNO, 'actualRefNO')
            console.log(this.rangeNumber, 'this.rangeNumber')

            if (this.rangeNumber < this.actualRefNO) {
              num1 = (Number(this.actualRefNO) + (parseInt(e.target.value) - parseInt(this.bag_no))) - 1;
            } else {
              num1 = (Number(this.rangeNumber) + (parseInt(e.target.value) - parseInt(this.bag_no))) - 1;
            }
            let val
            if (this.rangeNumber < this.actualRefNO) {
              val = `${this.bag_marka},${season}(${User_id})${this.actualRefNO + 1} - ${num1}`
            } else {
              val = `${this.bag_marka},${season}(${User_id})${this.rangeNumber} - ${num1}`
            }
            let data1 = val.split(',')
            console.log(data1, 'data1data1')
            let outputArrays = [];
            const result = [];
            // let season= this.ngForm.controls['season'].value ? (this.ngForm.controls['season'].value.toUpperCase()):''

            // data1.forEach((el,i)=>{
            //   const matches = el.match(/([A-Z]+\(\d+\))(\d+) - (\d+)/);
            //   if (matches) {
            //     const dynamicPart = matches[1];
            //     const start = parseInt(matches[2], 10);
            //     const end = parseInt(matches[3], 10);

            //     for (let i = start; i <= end; i++) {
            //       outputArray.push(`${dynamicPart}${i}`);
            //     }
            //   }
            // })
            // for (const item of data1) {
            //   const matches = item.match(/([A-Z]+\(\d+\))(\d+) - (\d+)/);
            //   if (matches) {
            //     const dynamicPart = matches[1];
            //     const start = parseInt(matches[2], 10);
            //     const end = parseInt(matches[3], 10);

            //     for (let i = start; i <= end; i++) {
            //       outputArray.push(`${dynamicPart}${i}`);
            //     }
            //   }
            // }
            // let outputArrays = {};

            // data1.forEach(str => {
            //   const matches = str.match(/([A-Z])\((\d+)\)(\d+)\s*-\s*(\d+)/);
            //   if (matches) {
            //     const prefix = matches[1];
            //     const prefixNumber = matches[2];
            //     const start = parseInt(matches[3]);
            //     const end = parseInt(matches[4]);

            //     for (let i = start; i <= end; i++) {
            //       const key = `${prefix}(${prefixNumber})`;
            //       if (!outputArrays[key]) {
            //         outputArrays[key] = [];
            //       }
            //       outputArrays[key].push(`${prefix}(${prefixNumber})${i}`);
            //     }
            //   }
            // });
            data1.forEach(str => {
              // const matches = str.maetch(/([A-Z])\((\d+)\)(\d+)\s*-\s*(\d+)/);
              const matches = str.match(/([A-Z])\((\d+)\)(\d+)\s*-\s*(\d+)/);
              if (matches) {
                  const prefix = matches[1];
                  const prefixNumber = matches[2];
                  const start = parseInt(matches[3]);
                  const end = parseInt(matches[4]);
          
                  let prefixArray = [];
          
                  for (let i = start; i <= end; i++) {
                      prefixArray.push(`${prefix}(${prefixNumber})${i}`);
                  }
          
                  outputArrays.push(prefixArray);
              }
            });
            // Convert the output object into an array of arrays
           let  outputArray = Object.values(outputArrays).flatMap(arr => arr);

            console.log(outputArray, 'outputArray');
            let outputArrayData = outputArray.slice(0, Number(e.target.value))
            const sortedArray = outputArrayData.sort((a, b) => {
              const numA = parseInt(a.match(/\d+/)[0]);
              const numB = parseInt(b.match(/\d+/)[0]);
              return numA - numB;
            });
            const generateRanges = (arr) => {
              const ranges = [];
              let start, end, prefix;
              for (let i = 0; i < arr.length; i++) {
                const matches = arr[i].match(/([A-Z]+\(\d+\))(\d+)/);
                const currentNum = parseInt(matches[2]);
                const currentPrefix = matches[1];

                if (i === 0) {
                  start = currentNum;
                  end = currentNum;
                  prefix = currentPrefix;
                } else if (currentNum === end + 1 && currentPrefix === prefix) {
                  end = currentNum;
                } else {
                  const rangeString = `${prefix}${start}${start !== end ? `-${end}` : ''}`;
                  ranges.push(rangeString);
                  start = currentNum;
                  end = currentNum;
                  prefix = currentPrefix;
                }
              }

              // Push the last range
              const lastRangeString = `${prefix}${start}${start !== end ? `-${end}` : ''}`;
              ranges.push(lastRangeString);

              return ranges;
            };

            // Generate and log the ranges
            const resultRanges = generateRanges(sortedArray);
            let resultRangesData = resultRanges && resultRanges.length > 1 ? resultRanges.join(',') : resultRanges;
            this.ngForm.controls['bag_marka'].setValue(resultRangesData);
            // if (Number(this.rangeNumber) > Number(num1)) {
            // } else {
            //   this.ngForm.controls['bag_marka'].setValue(`${this.bag_marka},${season}(${User_id})${this.rangeNumber}`);
            // }
            // if(this.rangeNumber<this.actualRefNO){


            // }else{
            //   for (let i = this.rangeNumber; i <= num1; i++) {
            //     markBagArr.push({ bagrange: `${season}(${UserId})${i}`, total_num: i })
            //   }
            // }
            let resultArray = [];

            sortedArray.forEach((entry, index) => {
              let totalNum = parseInt(entry.split(")")[1]);
              let bagrange = entry;
              let obj = { bagrange: bagrange, total_num: totalNum };
              resultArray.push(obj);
            });

            console.log(resultArray);

            let markBagArr2 = resultArray;
            console.log(markBagArr, 'markBagArr')
            markBagArr2 = markBagArr2.sort((a, b) => b.total_num - a.total_num)
            this.ref_number = markBagArr2 && markBagArr2[0] && markBagArr2[0].total_num ? markBagArr2[0].total_num : '';
            this.maximumRange = markBagArr2 && markBagArr2[0] && markBagArr2[0].total_num ? markBagArr2[0].total_num : '';
            this.markBagArr = markBagArr2;
          }
          else {
            // alert('hi2')
            let last1 = this.bag_marka.split('-')
            lastdata = last1[1];
            let first = last1[0];
            let parselast1 = parseInt(lastdata);
            last1[last1.length - 1] = e.target.value;
            let arr1first = last1 ? last1[0] : '';
            let parts = arr1first.split(/[^\d]+/);
            let lastNumber = parseInt(parts[parts.length - 1]);
            let arr1Second = last1 ? last1[1] : '';
            let lastNumber2;
            for (let i = parts.length - 1; i >= 0; i--) {
              const num = parseInt(parts[i]);
              if (!isNaN(num)) {
                lastNumber2 = num;
                break;
              }
            }
            // lastNumber2
            (last1[last1.length - 1]) = ((parseInt(lastNumber2) + parseInt(e.target.value)) - 1);
            let arr1 = last1.join('-')
            this.ngForm.controls['bag_marka'].setValue(`${arr1}`);
            let match = arr1.match(/([A-Za-z]+\(\d+\))(\d+)\s*-\s*(\d+)/);
            let bagRanges
            if (match) {
              // Extract dynamic part, start, and end range from the matched groups
              let dynamicPart = match[1];
              let startRange = parseInt(match[2], 10);
              let endRange = parseInt(match[3], 10);

              // Generate the array of bag ranges
              bagRanges = Array.from({ length: endRange - startRange + 1 }, (_, i) => {
                return {
                  bagrange: `${dynamicPart}${startRange + i}`,
                  total_num: startRange + i
                };
              });
              // Log the generated array
            }
            let markBagArr2 = bagRanges
            markBagArr2 = markBagArr2.sort((a, b) => b.total_num - a.total_num)
            this.ref_number = markBagArr2 && markBagArr2[0] && markBagArr2[0].total_num ? markBagArr2[0].total_num : '';
            this.maximumRange = markBagArr2 && markBagArr2[0] && markBagArr2[0].total_num ? markBagArr2[0].total_num : '';
            this.markBagArr = markBagArr2;
          }
        } else {
          // alert('hiiii')
          this.ngForm.controls['bag_marka'].setValue(`${season}(${User_id})${this.rangeNumber} - ${num1}`);
          for (let i = this.rangeNumber; i <= num1; i++) {
            markBagArr.push({ bagrange: `${season}(${UserId})${i}`, total_num: i })
          }
          let markBagArr2 = markBagArr
          markBagArr2 = markBagArr2.sort((a, b) => b.total_num - a.total_num)
          this.ref_number = markBagArr2 && markBagArr2[0] && markBagArr2[0].total_num ? markBagArr2[0].total_num : '';
          this.maximumRange = markBagArr2 && markBagArr2[0] && markBagArr2[0].total_num ? markBagArr2[0].total_num : '';
          this.markBagArr = markBagArr2;
        }


        // this.markBagArr=markBagArr;
      }
    } else {
      let value;
      let markBagArr = [];
      if (this.rangeNumber != 1) {
        value = ((parseInt(e.target.value)) + this.rangeNumber);
        if (value > 1) {
          value = value - 1
        }
        this.ref_number = value;
        // value = (parseInt(e.target.value)) + this.rangeNumber;
        this.ngForm.controls['bag_marka'].setValue(`${season}(${User_id})${this.rangeNumber} - ${value}`)
        for (let i = this.rangeNumber; i <= value; i++) {
          markBagArr.push({ bagrange: `${season}(${UserId})${i}`, total_num: i + 1 })
        }
      } else {
        value = e.target.value;
        this.ref_number = value;
        // alert('h122')
        if (value == 1) {
          this.ngForm.controls['bag_marka'].setValue(`${season}(${User_id})1`)
        } else {
          this.ngForm.controls['bag_marka'].setValue(`${season}(${User_id})1 - ${value}`)

        }

        for (let i = 1; i <= value; i++) {
          markBagArr.push({ bagrange: `${season}(${UserId})${i}`, total_num: i })
        }
      }
      console.log(markBagArr, 'markBagArr')
      this.maximumRange = value;
      this.markBagArr = markBagArr;
      this.ref_number = value;
    }
  }

  saveForm() {
    if (this.ngForm.invalid) {
      Swal.fire(
        {
          icon: 'error',
          title: 'Please Fill the Form Properly',
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonColor: '#B64B1D'
        }
      )
      return;
    }

    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    let param = this.ngForm.value;
    param.user_id = UserId;
    param.markBagArr = this.markBagArr;
    let plots = this.plotList.filter(x => x.field_code == this.ngForm.controls['plot'].value);
    let plotId = plots && plots[0] && plots[0].id ? plots[0].id : ''
    param.plotId = plotId;
    param.plot = this.ngForm.controls['plot'].value ? this.ngForm.controls['plot'].value : plots && plots[0] && plots[0].field_code ? plots[0].field_code : '';

    let bag_marka_data = this.ngForm.controls['bag_marka'].value;
  
    param.maximumRange = this.maximumRange;
    param.harvested_data= this.getBreederData(this.seedClassId,this.StageId)
    param.actual_harvest = this.ngForm.controls['actual_harvest'].value && this.ngForm.controls['actual_harvest'].value.singleDate && this.ngForm.controls['actual_harvest'].value.singleDate.formatted ? this.convertDates(this.ngForm.controls['actual_harvest'].value.singleDate.formatted) : '';
    param.ref_number = this.ref_number;
    if (this.editId && this.editData) {
      param.id = this.editId
      if (typeof bag_marka_data === "string") {
        param.bag_marka= bag_marka_data
    } else if (Array.isArray(bag_marka_data)) {
        // If 'a' is an array, convert it to a string
        if(bag_marka_data && bag_marka_data.length>1){
          param.bag_marka= bag_marka_data.join(',')
        }else{
          param.bag_marka= bag_marka_data.join('')
        }     
    } else {
      param.bag_marka= bag_marka_data
    }
      this.productionService.postRequestCreator('update-inspect-harvesting-id', param).subscribe(data => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
          Swal.fire(
            {
              icon: 'success',
              title: 'Data Updated Successfully',
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonColor: '#B64B1D'
            }
          ).then(x => {
            if (x.isConfirmed) {
              this.editData = false;

              this.clearData()
              this.ngForm.controls['actual_harvest'].setValue('');
              this.ngForm.controls['seed_produced'].setValue('');
              this.ngForm.controls['bag_number'].setValue('');
              this.ngForm.controls['bag_marka'].setValue('');
              this.ngForm.controls['processing_plant'].setValue('');
              this.ngForm.controls['plot'].setValue('');
              this.ngForm.controls['variety'].setValue('');
              this.ngForm.controls['plot'].setValue('');
              this.ngForm.controls['parental_line'].setValue('');
              this.selectParentalLine = '';
              this.selectVariety = '';
              this.selectPlot = ''
              this.selectSeedProcessingPlant = '';
              this.isSearchClicked = false;
              this.getRangeData();
              this.getPageFormData();
            }
          })
        }
        else {
          Swal.fire(
            {
              icon: 'error',
              title: 'something went wrong',
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonColor: '#B64B1D'
            }
          )
        }
      })
    } else {

      this.productionService.postRequestCreator('save-inspect-harvesting', param).subscribe(data => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
          Swal.fire(
            {
              icon: 'success',
              title: 'Data Saved Successfully',
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonColor: '#B64B1D'
            }
          ).then(x => {
            if (x.isConfirmed) {

              this.clearData();
              this.ngForm.controls['actual_harvest'].setValue('');
              this.ngForm.controls['seed_produced'].setValue('');
              this.ngForm.controls['bag_number'].setValue('');
              this.ngForm.controls['bag_marka'].setValue('');
              this.ngForm.controls['processing_plant'].setValue('');
              this.ngForm.controls['plot'].setValue('');
              this.selectSeedProcessingPlant = '';
              this.isSearchClicked = false;
              this.getPageFormData();
              this.getRangeData();

            }
          })
        }
        else {
          Swal.fire(
            {
              icon: 'error',
              title: 'something went wrong',
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonColor: '#B64B1D'
            }
          )
        }
      })
    }
  }

  getPageFormData(id = null) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        variety_line_code: this.ngForm.controls['parental_line'].value,
        plotid: this.ngForm.controls['plot'].value,
        id: id
      }
    }
    this.productionService.postRequestCreator('get-inspect-harvesting', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data &&  data.EncryptedResponse.data.filterData ?  data.EncryptedResponse.data.filterData: '';
        let bsp2Data = data && data.EncryptedResponse && data.EncryptedResponse.data &&  data.EncryptedResponse.data.bsp2Data ?  data.EncryptedResponse.data.bsp2Data: '';
        this.tableData = response ? response : '';
        this.isSearchClicked = false;
        let results = [];
        if (bsp2Data && bsp2Data.length > 0) {
          bsp2Data.forEach((el, i) => {
            if (el && el.variety_line_code) {
              if (el.line_variety_code == el.variety_line_code) {
                results.push({
                  seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
                  stage_id: el && el.stage_id ? el.stage_id : '',
                  line_variety_code: el && el.line_variety_code ? el.line_variety_code : '',
                  plot_code: el && el.plot_code ? el.plot_code : '',
                  variety_line_code: el && el.variety_line_code ? el.variety_line_code : '',
                  variety_code: el && el.variety_code ? el.variety_code : '',
                  code: el && el.code ? el.code : ''
                })
              } else {
                results.push({
                  seed_class_id: '',
                  stage_id: '',
                  line_variety_code: '',
                  plot_code: '',
                  variety_code: '',
                  variety_line_code: '',
                  code: ''
                })
              }
            }
            else {
              results.push({
                seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
                stage_id: el && el.stage_id ? el.stage_id : '',
                line_variety_code: el && el.line_variety_code ? el.line_variety_code : '',
                plot_code: el && el.plot_code ? el.plot_code : '',
                variety_line_code: el && el.variety_line_code ? el.variety_line_code : '',
                variety_code: el && el.variety_code ? el.variety_code : '',
                code: el && el.code ? el.code : ''
              })
            }
          })
        }

        if (this.tableData && this.tableData.length > 0) {
          if (results && results.length > 0) {

            this.tableData = this.tableData.map(item => {
              if (item && item.plotDetails && item.plotDetails.length > 0) {
                item.plotDetails.forEach(detail => {
                  let matchingItem;
                  if (item.line_variety_code) {
                    matchingItem = results.find(elem => elem.variety_code === item.variety_code && elem.line_variety_code == item.line_variety_code);
                  } else if (item.variety_line_code) {
                    matchingItem = results.find(elem => elem.variety_code === item.variety_code && elem.variety_line_code == item.variety_line_code);
                  } else {
                    matchingItem = results.find(elem => elem.variety_code === item.variety_code);
                  }
                  if (matchingItem) {
                    detail.stage_id = matchingItem && matchingItem.stage_id ? matchingItem.stage_id : '';
                    detail.seed_class_id = matchingItem && matchingItem.seed_class_id ? matchingItem.seed_class_id : '';
                    detail.variety_line_code = matchingItem && matchingItem.variety_line_code ? matchingItem.variety_line_code : '';
                    detail.line_variety_code = matchingItem && matchingItem.line_variety_code ? matchingItem.line_variety_code : '';
                    detail.code = matchingItem && matchingItem.code ? matchingItem.code : '';

                  }
                });
              }
              return item;
            });
          }

        }
        console.log(this.tableData,'this.tableData')
        if (this.ngForm.controls['plot'].value) {
          if (this.tableData.length > 0) {
            this.isSearchClicked = false;
          }
          else {
            this.isSearchClicked = true;
          }
        }

        // else if(this.ngForm.controls['plot'].value  && this.tableData.length>1){
        // }else{
        //   this.isSearchClicked=true;
        // }


        if (this.tableData && this.tableData.length > 0) {
          this.tableData.forEach(element => {
            element.totalPlot = element.plotDetails.length;
          });
          this.tableData.forEach(element => {
           element.plotDetails=    element.plotDetails.filter((arr, index, self) =>
           index === self.findIndex((t) => (t.plot_id === arr.plot_id)))
  
           
          });
        }
        console.log(this.tableData,'this.tableData')
        // inspected_area
        // this.ngForm.controls['inspected_area'].setValue(response && response.inspectionData && response.inspectionData[0] && response.inspectionData[0].inspected_area ? response.inspectionData[0].inspected_area :0 )
        // this.ngForm.controls['estimated_production'].setValue(response && response.expectedProd && response.expectedProd[0] && response.expectedProd[0].estimated_production ? response.expectedProd[0].estimated_production :0 )
      }
    })

  }
  getPageFormDataByid(id = null) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        variety_line_code: this.ngForm.controls['parental_line'].value,
        plotid: this.ngForm.controls['plot'].value,
        id: id
      }
    }
    this.editId = id;
    this.editData = true
    this.productionService.postRequestCreator('get-inspect-harvesting-id', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.bspProforma3Data ? data.EncryptedResponse.data.bspProforma3Data : '';
        let RangeData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.responseValue = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.responseValue ? data.EncryptedResponse.data.responseValue : '';
        this.responseValueMax = this.responseValue && this.responseValue[0] && this.responseValue[0].ref_number ? this.responseValue[0].ref_number : 0;
        let RangeDataArr = Object.values(RangeData)
        if (RangeData && RangeData.length > 0) {
          this.markBagArr = RangeData;
          this.maximumRange = RangeData && RangeData[0] && RangeData[0].ref_number ? RangeData[0].ref_number : ''
        }
        this.getRangeData()
        this.isSearchClicked = true;
        // this.ngForm.controls['year'].setValue(response && response[0].year ? response[0].year : '', { emitEvent: false, onlySelf: true });
        this.ngForm.controls['season'].setValue(response && response[0].season ? response[0].season : '', { emitEvent: false, onlySelf: true });
        this.ngForm.controls['crop'].setValue(response && response[0].crop_code ? response[0].crop_code : '', { emitEvent: false, onlySelf: true });
        this.ngForm.controls['variety'].setValue(response && response[0].variety_code ? response[0].variety_code : '', { emitEvent: false, onlySelf: true });
        this.ngForm.controls['parental_line'].setValue(response && response[0].variety_line_code ? response[0].variety_line_code : '', { emitEvent: false, onlySelf: true });
        this.ngForm.controls['plot'].setValue(response && response[0].plot_code ? response[0].plot_code : '', { emitEvent: false, onlySelf: true });
        this.selectCrop = response && response[0].crop_name ? response[0].crop_name : '';
        this.selectVariety = response && response[0].variety_name ? response[0].variety_name : '';
        this.selectParentalLine = response && response[0].line_variety_name ? response[0].line_variety_name : '';
        this.selectPlot = response && response[0].plot_code ? response[0].plot_code : '';

        this.ngForm.controls['actual_harvest'].setValue(
          {
            isRange: false,
            singleDate: {
              formatted: response && response[0].actual_harvest_date ? this.convertDatatoShow(new Date(response[0].actual_harvest_date)) : '',
              jsDate: response && response[0].actual_harvest_date ? new Date(response[0].actual_harvest_date) : ''
            }
          }
        );
        this.ngForm.controls['seed_produced'].setValue(response && response[0].raw_seed_produced ? response[0].raw_seed_produced : '');
        this.ngForm.controls['processing_plant'].setValue(response && response[0].spp_id ? response[0].spp_id : '');
        if (this.seedProcessingPlantList && this.seedProcessingPlantList.length > 0) {
          let val = this.seedProcessingPlantList.filter(x => x.user_id == this.ngForm.controls['processing_plant'].value);
          this.selectSeedProcessingPlant = val && val[0] && val[0].name ? val[0].name : ''
        }
        this.ngForm.controls['bag_number'].setValue(response && response[0].no_of_bags ? response[0].no_of_bags : '');
        this.bag_no = response && response[0].no_of_bags ? response[0].no_of_bags : '';
        this.ngForm.controls['bag_marka'].setValue(response && response[0].bag_marka ? response[0].bag_marka : '');
        this.bag_marka = response && response[0].bag_marka ? response[0].bag_marka : ''
        this.getInspectionDetails();
        this.getPlotDetails();
        // if(RangeData && RangeData.length>0){

        // }
        // this.ngForm.controls['processing_plant'].setValue(response && response[0].year ? response[0].year :'');
      }
    })

  }
  preventKeyPress(event) {
    // event.stopPropagation();
    event.preventDefault();
  }
  convertDates(item) {
    const date = new Date(item);
    // let year = 
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
  onDateChangedharvesting(e) {

  }

  onDateChangedStart(event: any): void {


  }
  formatDateRange(fromDate: string, toDate: string): string {
    if (!fromDate || !toDate) {
      return 'NA';
    }
    const formattedFromDate = this.formatedDate(fromDate);
    const formattedToDate = this.formatedDate(toDate);
    return `${formattedFromDate} - ${formattedToDate}`;
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
  delete(id) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      'search': {
        id: id,
        user_id: UserId
      }
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {

        this.productionService
          .postRequestCreator("delete-inspect-harvesting-data", param)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              Swal.fire({
                title: "Deleted!",
                text: "Your data has been deleted.",
                icon: "success"
              }).then(x => {
                this.getPageFormData();
                this.getRangeData();
                this.clearData()
                // this.showwillingToProduce = false
                // this.getData()
                // location.reload()
              })
              // this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });

      }
    })
  }
  inputNumber(event) {
    // checkNumber(event)
    const numCharacters = /[0-9.]+/g;
    if (event.which == 190 || event.which != 17 && event.which != 86 && event.which != 8 && event.which != 9 && event.which != 37 && event.which != 39 && event.which != 46 && numCharacters.test(event.key) == false) {
      event.preventDefault();
    }

  }
  checkDecimal($e) {
    checkDecimal($e)
  }
  validateInput(event) {
    // Get the current input value
    let input = event.target.value;
    if (event.keyCode == 8) {
      return;
    }
    // Check if input is a valid number with at most two decimal places
    if (/^\d*\.?\d{0,1}$/.test(input)) {
      // Input is valid
    } else {
      // Input is invalid, prevent further input
      event.preventDefault();
    }
  }
  download() {
    // this.getQr()
    const name = 'harvest-report';
    const element = document.getElementById('pdf-tables');
    const options = {
      filename: `${name}.pdf`,
      margin: [10, 0],
      image: {
        type: 'jpeg',
        quality: 1
      },
      // html2canvas: {
      //   dpi: 192,
      //   scale: 4,
      //   letterRendering: true,
      //   useCORS: true
      // },
      jsPDF: {
        unit: 'mm',
        format: 'a3',
        orientation: 'landscape'
      },
      html2canvas: {
        dpi: 300,
        scale: 2,
        letterRendering: true,
        logging: true,
        useCORS: true,

      },
      // pagebreak: { avoid: "tr", mode: "css", before: "#nextpage1", after: "1cm" },
      pagebreak: { after: ['#page-break1'], avoid: 'img' },
    };
    // const pdf = new html2PDF(element, options);

    // pdf.addPage();
    html2PDF().set(options).from(element).toPdf().save();

  }
  getSpaName(item) {
    if (this.seedProcessingPlantList && this.seedProcessingPlantList.length > 0) {
      let val = this.seedProcessingPlantList.filter(x => x.user_id == item);
      return val && val[0] && val[0].name ? val[0].name : ''
    }
  }
  convertToRoman(num) {
    const romanNumerals = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    };

    let result = '';

    for (let key in romanNumerals) {
      while (num >= romanNumerals[key]) {
        result += key;
        num -= romanNumerals[key];
      }
    }

    return result;
  }

  // Example usage:

  getBreederData(id, stageId) {
    console.log('stageId',stageId,id)
    if (id) {
      let name = 'Breeder Seed';
      let stageIds;
      if (stageId) {
        stageIds = id == 6 ? this.convertToRoman(1) : this.convertToRoman(stageId + 1);
      }
      let className = name ? name : 'NA';
      let stageName = stageIds ? stageIds : 'NA'
      return className + ' ' + stageName
    }
  }
}
