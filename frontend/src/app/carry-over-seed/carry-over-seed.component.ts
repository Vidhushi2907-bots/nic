import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { MasterService } from 'src/app/services/master/master.service';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { IAngularMyDpOptions, IMyDate, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { checkDecimal, checkDecimalValue, convertDate, convertDatetoDDMMYYYYwithdash } from 'src/app/_helpers/utility';
import Swal from 'sweetalert2';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import * as html2PDF from 'html2pdf.js';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-carry-over-seed',
  templateUrl: './carry-over-seed.component.html',
  styleUrls: ['./carry-over-seed.component.css']
})
export class CarryOverSeedComponent implements OnInit {
  responseofLotData: any;
  freezeData: boolean;
  aggregatedJSON: any;
  totalQty: any[];
  quantityError: boolean;
  editDataValue: boolean;
  is_update: boolean;
  bsp2Arrlist: any[];
  showparental: boolean;
  todayData = new Date();
  parentalList: any[];
  editId: any; t
  bsp2Arrlists: any;
  lineparetal: any;
  lineparetals: any;
  selectParental: any;
  showAddMoreInthisVariety: boolean;
  submitted: boolean;
  backbtn: boolean;
  failedSubmit: boolean;
  quantitySownValue: any;
  showparentalList: boolean;
  bspProforma2SeedData: any;
  units: string;
  showDateValidation: boolean;
  agencyName: any;
  bspcAddress: any;
  contact_person_name: any;
  data1: any;
  cropNameValue: any;
  varietyName: any;
  runningNumber: any;
  runningNumber2: number;
  designation: any;
  cropNameofReport: any;
  encryptedData: any;
  baseUrl: string = environment.ms_nb_01_master.baseUrl;
  referenceNumber: any;
  parentalListSecond: any;
  donotShowtable: boolean;
  editShowData: boolean;
  validationErr: boolean;
  stateName: any;
  districtName: any;
  VarietySecond: any;
  VarietyList: any;
  parentalListData: any;
  req_data: any;
  classOfSeed = [
    {
      class_type: 'Breeder Seed',
      id: 7
    }
  ]
  productionType: any;
  isDisableNormal: boolean;
  isDisableNormalReallocate: boolean;
  isDisableDelay: boolean;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    // This function will be called when a scroll event occurs on the window

    // Perform actions based on window scroll
  }

  // @ViewChild('datePicker') datePicker: MyDatePicker;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  dummyData = []
  selectCrop;
  showlot = true;
  start;
  selectVarietyofbsp1;
  bsp2Data;
  end;
  ngForm!: FormGroup;
  todayDate = new Date();
  parsedDate = Date.parse(this.todayDate.toString());
  selectVariety;
  Dayjs;
  // selected: {start: Dayjs, end: Dayjs};
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []

  stateSelect;
  tittle = 'Carry-over/New Seed Production'
  allData: any;
  yearOfIndent;
  dropdownSettings: IDropdownSettings = {};
  seasonlist;
  typeOfSeedList;
  stage;
  year = [
    {
      year: '2023'
    },
    {
      year: '2022'
    },
    {
      year: '2021'
    },
  ]
  cropList;
  LotNo;
  tagNo;

  season = [
    {
      season: 'K'
    },
    {
      season: 'R'
    },
  ];
  Variety;
  croplistSecond: any;
  stateList: any;
  selectState;
  stateListSecond: any;
  districtList: any;
  varietyNames
  districtListsecond: any;
  district_id: any;
  changeposition = false;
  showDetsail: boolean;
  disableFieldQty: boolean;
  isSearch: boolean;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean;
  selected;
  showSecondCard = false;
  response: any;
  showDetsails = false;
  showVarietyDetails = false;
  varietyListDetails: any;
  disableField: boolean;
  showetailsPage = false;
  employeeIndex: number = 0;
  responseData: any;
  showLot: boolean;
  lotDatalength;
  changepositions = false;
  count = 0;
  lotNolist;
  nestedForm: FormGroup<{ nestedArrays: FormArray<FormArray<FormControl<string>>>; }>;
  showlotpage: boolean;
  showPageDeatails = false;
  responseList: any;
  varietyListofBsp2: any;
  varietyListofBsp2list: any;
  unit: string;
  showFirstDetailsPage: boolean;
  constructor(private service: SeedServiceService, private fb: FormBuilder, private master: MasterService, private elementRef: ElementRef,
    private productionService: ProductioncenterService,
    private breeder: BreederService
  ) {
    this.createForm();

  }
  createForm() {
    this.ngForm = this.fb.group({
      year: [''],
      season: [''],
      crop: [''],
      crop_text: [''],
      variety: [''],
      vaiety_text: [''],
      type_of_class: [''],
      total_necluesseed: [''],
      total_breederseed: [''],
      variety_level_2: [''],
      parental_text: [''],
      line_variety_code: [''],
      variety_line_code: [''],
      vaiety_text_level_2: [''],
      qty_of_nucleus_seed: [''],
      qty_of_breeeder_seed: [''],
      permission_of_production: [''],
      meet_target: ['1'],
      carry_over: this.fb.array([
        this.bsp2arr(),
      ]),



    })
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isSearch = false;
        this.selectCrop = ''
        this.ngForm.controls['crop'].patchValue('', { emitEvent: false, onlySelf: true });
        this.ngForm.controls['variety'].patchValue('', { emitEvent: false, onlySelf: true });
        this.ngForm.controls['variety_line_code'].patchValue('', { emitEvent: false, onlySelf: true });
        this.selectVariety = '';
        this.showparental = false;
        this.selectParental = ''
        this.showVarietyDetails = false;
        this.getSeason()
      }
    })
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop'].setValue('', { emitEvent: false, onlySelf: true });
        this.ngForm.controls['variety'].setValue('', { emitEvent: false, onlySelf: true })
        this.ngForm.controls['variety_line_code'].setValue('', { emitEvent: false, onlySelf: true });
        this.isSearch = false;
        this.selectCrop = ''
        this.showVarietyDetails = false;
        this.selectVariety = '';
        this.showparental = false;
        this.selectParental = ''
        this.getCrop()
      }
    })
    this.ngForm.controls['crop'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isSearch = false
        this.ngForm.controls['variety_line_code'].setValue('', { emitEvent: false, onlySelf: true });
        this.ngForm.controls['variety'].setValue('', { emitEvent: false, onlySelf: true })
        this.selectVariety = '';
        this.getVarietyDetails()
        this.showDetsails = true;
        this.showparental = false;
        this.showVarietyDetails = false;
        this.selectParental = ''
        this.getUnit(newValue)
        this.getUnits(newValue)
        const FormArrays = this.ngForm.get('carry_over') as FormArray;
        const controlToKeeps = FormArrays.at(0);
        FormArrays.clear();
        this.addMore(0)
        this.ngForm.controls['total_breederseed'].setValue('');
        this.ngForm.controls['meet_target'].setValue(1);
        this.showSecondCard = true
      }
    })
    this.ngForm.controls['variety_level_2'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getBsp2List();
      }
    })
    this.ngForm.controls['variety'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // this.isSearch=false

        this.showVarietyDetails = true;
        this.showFirstDetailsPage = true;
        // this.is_update = false;
        if (!this.is_update && !this.showAddMoreInthisVariety) {
          this.ngForm.controls['variety_line_code'].setValue('', { emitEvent: false, onlySelf: true });
        }
        this.selectParental = ''
        this.getVarietyDetailsSecond()
        const FormArrays = this.ngForm.get('carry_over') as FormArray;
        const controlToKeeps = FormArrays.at(0);
        FormArrays.clear();
        this.addMore(0)
        this.ngForm.controls['total_breederseed'].setValue('', { emitEvent: false, onlySelf: true });
        let param = this.ngForm.value ? this.ngForm.value : '';
        this.ngForm.controls['meet_target'].setValue(1);
        let carry_over = param && param.carry_over ? param.carry_over : '';
      }
    })

    this.ngForm.controls['variety_line_code'].valueChanges.subscribe(newValue => {
      this.getVarietyDetailsSecond();
      const FormArrays = this.ngForm.get('carry_over') as FormArray;
      const controlToKeeps = FormArrays.at(0);
      FormArrays.clear();
      this.addMore(0)
      this.ngForm.controls['total_breederseed'].setValue('', { emitEvent: false, onlySelf: true });
      this.ngForm.controls['meet_target'].setValue(1);



    })
    // this.ngForm.controls['type_of_class'].valueChanges.subscribe(newValue => {
    //   if (newValue) {
    //     this.showlotpage = true;
    //     // this.cancel()

    //     this.getStageList()
    //   }
    // })

    this.ngForm.controls['crop_text'].valueChanges.subscribe(item => {
      if (item) {
        this.cropList = this.croplistSecond
        let response = this.cropList.filter(x => x.crop_name.toLowerCase().includes(item.toLowerCase()))
        this.cropList = response
      }
      else {
        this.getCrop()
      }
    })
    this.ngForm.controls['vaiety_text'].valueChanges.subscribe(item => {
      if (item) {
        this.VarietyList = this.VarietySecond;
        let response = this.VarietyList.filter(x => x.display_text.toLowerCase().includes(item.toLowerCase()))
        this.VarietyList = response
      }
      else {
        this.VarietyList = this.VarietySecond;
        // this.getVarietyDetails()
      }
    })
    this.ngForm.controls['parental_text'].valueChanges.subscribe(item => {
      if (item) {
        this.parentalListData = this.parentalListSecond;
        let response = this.parentalListData.filter(x => x.display_text.toLowerCase().includes(item.toLowerCase()))
        this.parentalListData = response
      }
      else {
        this.parentalListData = this.parentalListSecond;
        // this.getVarietyDetails()
      }
    })
  }
  ngOnInit(): void {
    // this.productionTypeValue('NORMAL');
    this.fetchData();
    // this.getTypeofSeed();
    this.bsp2Data = this.ngForm.value && this.ngForm.value.carry_over ? this.ngForm.value.carry_over : '';
  }


  fetchData() {
    // this.getPageData();

    this.getStatelist();
    this.getUserData();
    // this.checkReferenceData();

    this.dropdownSettings = {
      idField: 'value',
      textField: 'display_text',
      enableCheckAll: true,
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      itemsShowLimit: 1,

      limitSelection: -1,
    };




  }
  getNestedFormArray(index: number): FormArray {
    return this.nestedArrays.at(index).get('total_quantity') as FormArray;
  }

  get nestedArrays() {
    return this.ngForm.get('carry_over') as FormArray;
  }
  preventKeyPress(event) {
    // event.stopPropagation();
    event.preventDefault();
  }
  onOpenCalendar(event: any) {
    // Adjust the position before opening the calendar
    event.stopPropagation(); // Prevents default behavior
    // Implement custom logic to modify the calendar's position
  }


  parseDate(dateString) {
    // Split the date string into month, day, and year components
    var dateComponents = dateString.split('/');

    // Create a Date object with the parsed components
    // Note: Months are 0-indexed in JavaScript, so we subtract 1 from the month
    var year = parseInt(dateComponents[2], 10);
    var month = parseInt(dateComponents[0], 10) - 1;
    var day = parseInt(dateComponents[1], 10);

    return new Date(year, month, day);
  }

  onDateChangedInspection(event: any): void {
    const endDate = event.singleDate.jsDate;
    if (endDate) {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      const date = new Date(endDate);
      date.setDate(date.getDate() + 15);
      let newDate = [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('/')
      event.singleDate.formatted = `${event.singleDate.formatted}-${newDate}`
    }
  }

  converDate(date) {
    convertDatetoDDMMYYYYwithdash(date)
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
  myDpOptions1: IAngularMyDpOptions = {
    dateRange: false,
    closeSelectorOnDocumentClick: true,
    // dateRangeDatesDelimiter: "-",
    // dateRangeDatesDelimiter:'10-15',
    // sunHighlight: true,
    closeSelectorOnDateSelect: true,
    dateFormat: 'dd/mm/yyyy',
    appendSelectorToBody: true,
    // rtl: true

  };
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDocumentClick: true,
    openSelectorTopOfInput: true,
    // appendSelectorToBody: true,
    // disableSince: {}
    // disableUntil: { year: parseInt(this.y), month: parseInt(this.m)+1, day: this.todayDate.getDate() -1 },
    // disableSince: { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }
  };
  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    this.service.postRequestCreator("get-bsp-proforma-2s-details", null, {
      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      pageSize: 50,
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        user_id: UserId ? UserId.toString() : '',
        variety_code: this.ngForm.controls['variety'].value ? this.ngForm.controls['variety'].value : '',
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
  bsp2arr() {
    let temp = this.fb.group({
      class_of_seed: [''],
      stage: [''],
      year: [''],
      season: [''],
      lot_no: [''],
      tag_no: [''],
      qty_available: [''],
      qty_recieved: [''],
      tag_quantity: [''],
      tag_number: [''],
      tag_id: [''],
      lot_name: [''],
      enableqty_recieved: [true],
      show_class: [false]
    });
    return temp;
  }




  getItems(form) {
    return form.controls.carry_over.controls;
  }
  getbsp2SeedDetailsItems(form) {
    return form.controls.bsp2Arrseedsowndetails.controls;
  }






  addMore(i) {
    // this.ngForm.controls['carry_over']['controls'][i].controls['showstatus'].setValue(false);
    // this.getStageList(i+1)
    this.employees().push(this.bsp2arr());

  }

  remove(rowIndex: number) {
    if (this.employees().controls.length > 1) {
      this.employees().removeAt(rowIndex);
    } else {
      this.removeData()
    }
  }
  get itemsArray() {
    return <FormArray>this.ngForm.get('carry_over');
  }
  get itemsArraySeedDetails() {
    return <FormArray>this.ngForm.get('bsp2Arrseedsowndetails');
  }

  save(data) {

  }
  get items(): FormArray {
    return this.ngForm.get('carry_over') as FormArray;
  }
  employees() {
    return this.ngForm.get('carry_over') as FormArray;
  }
  employees2() {
    return this.ngForm.get('bsp2Arrseedsowndetails') as FormArray;
  }
  getYear() {
    this.master.postRequestCreator('get-bsp-performa1-year', null, { search: { production_type: this.productionType } }).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
    })
  }
  getSeason() {
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        production_type: this.productionType
      }
    }
    this.master.postRequestCreator('get-bsp-performa1-season', null, param).subscribe(data => {
      this.seasonlist = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
    })
  }
  getCrop() {
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        production_type: this.productionType
      }
    }
    this.master.postRequestCreator('get-bsp-performa1-crop', null, param).subscribe(data => {
      this.cropList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      this.croplistSecond = this.cropList;
    })
  }

  crop(item) {
    this.selectCrop = item && item.crop_name ? item.crop_name : '';
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropList = this.croplistSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
  }
  cClick() {
    document.getElementById('crop').click()
  }
  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }
  getFinancialYear2(year) {
    let arr = []
    let last2Str = String(parseInt(year)).slice(-2)
    arr.push(String(parseInt(last2Str)))
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }
  vClick() {
    document.getElementById('variety').click()
  }
  variety(item) {
    this.selectVariety = item && item.display_text ? item.display_text : '';
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
    this.ngForm.controls['vaiety_text'].setValue('', { emitEvent: false })
    // this.cropList = this.croplistSecond;
  }
  parentalData(item) {
    this.selectParental = item && item.display_text ? item.display_text : '';
    this.ngForm.controls['variety_line_code'].setValue(item && item.value ? item.value : '')


  }
  pClick() {
    document.getElementById('parental').click()
  }
  varietylevel2(item) {
    this.selectVarietyofbsp1 = item && item.display_text ? item.display_text : '';
    this.ngForm.controls['variety_level_2'].setValue(item && item.variety_code ? item.variety_code : '')
    this.ngForm.controls['vaiety_text_level_2'].setValue('', { emitEvent: false })
    // this.cropList = this.croplistSecond;
  }
  getStatelist() {
    const param = {
      is_state: 1
    }
    this.master.postRequestCreator('get-all-state-list-data', null, param).subscribe(data => {
      this.stateList = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      this.stateListSecond = this.stateList


    })
  }
  stateData(data, index, $event) {
    // this.changeposition = false
    this.ngForm.controls['carry_over']['controls'][index].controls['state'].setValue(data);
    // this.ngForm.controls['carry_over']['controls'][index].controls['stateData_text'].setValue('');
    this.ngForm.controls['carry_over']['controls'][index].controls['district'].setValue('');
    let stateId = data && data.state_code ? data.state_code : ''
    this.getDistrictList(stateId ? stateId : '', index)
    // this.varietyId = data && data.id ? data.id : ''
  }
  btnclick() {
    // this.changeposition = true
  }
  btnsclick() {
    // this.changepositions = true
  }
  csStateClick(i) {
    document.getElementById('states' + i).click();
  }
  getDistrictList(newValue, i) {
    const param = {
      search: {
        state_code: newValue
      }
    }
    this.master.postRequestCreator('get-district-list', null, param).subscribe(data => {
      this.districtList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      const myFormArray = this.ngForm.get('carry_over') as FormArray;

      if (myFormArray && myFormArray.controls && myFormArray.controls[i] && myFormArray.controls[i]['controls'] && myFormArray.controls[i]['controls'].district) {
        this.ngForm.controls['carry_over']['controls'][i]['controls'].district.districtlist = this.districtList;
      }
      this.districtListsecond = this.districtList

    })
  }
  selectdistrict(data, index, $event) {
    // this.changepositions = false
    this.ngForm.controls['carry_over']['controls'][index].controls['district'].setValue(data);
    this.district_id = data && data.id ? data.id : ''

    // this.getDistrictList($event.target.value)
  }
  cdClick(i) {

    document.getElementById('variety_name' + i).click();
  }
  getSeasonDetails(item) {
    let data = item && (item == 'K') ? 'Kharif' : (item == 'R') ? 'Rabi' : 'NA';
    return data ? data : 'NA'
  }
  mergeAndNestArrays(arr1, arr2) {
    const mergedObj = arr1.reduce((acc, obj) => {
      const matchedItem = arr2.find(item => item.empindex == obj.empindex);
      if (matchedItem) {
        acc.push({ ...obj, ...matchedItem });
      } else {
        acc.push(obj);
      }
      return acc;
    }, []);
    return mergedObj
  }
  createNestedArray(jsonArray) {
    const nestedArray = [];

    // Create a map for quick lookup
    const map = {};
    jsonArray.forEach(obj => {
      map[obj.empindex] = { ...obj, children: [] };
    });

    jsonArray.forEach(obj => {
      if (obj.parent !== null) {
        map[obj.parent].children.push(map[obj.empindex]);
      } else {
        nestedArray.push(map[obj.empindex]);
      }
    });

    return nestedArray;
  }

  get myArray() {
    return this.ngForm.get('carry_over') as FormArray;
  }



  addEmployee() {
    this.employees().push(this.bsp2arr());
  }

  // removeEmployeeSkill(empIndex: number, skillIndex: number) {
  //   this.employeeSkills(empIndex).removeAt(skillIndex);
  // }

  disableQuty(index, $event) {
    if (this.tagNo.length == this.ngForm.controls['bsp2Arrseedsowndetails']['controls'][index].controls['tag_no'].value.length) {
      this.ngForm.controls['bsp2Arrseedsowndetails']['controls'][index].controls['showQtyFielddisable'].setValue(true);
    } else {
      this.ngForm.controls['bsp2Arrseedsowndetails']['controls'][index].controls['showQtyFielddisable'].setValue(false);
    }

  }

  datesUpdated(item) {

  }
  fixed2digit(num) {
    // Use parseFloat to remove trailing zeros after the decimal point
    num = (num.toFixed(2));

    // Convert to integer if the number is an integer value
    if (num % 1 === 0) {
      num = parseInt(num);
    }

    return num;
  }
  search() {
    this.isSearch = true;
    this.getPageData()

  }

  getVarietyDetails() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id

    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        user_id: UserId ? UserId.toString() : '',
        production_type: this.productionType
      }

    }
    this.productionService.postRequestCreator('get-carry-over-variety', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.response = response;
      this.Variety = response && response.varietyList ? response.varietyList : '';
      this.VarietySecond = this.Variety;
      this.VarietyList = this.Variety;
      // if (this.ngForm.controls['variety'].value) {
      //   this.varietyListDetails = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      // }

    })
  }
  getVarietyDetailsSecond() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    let param;
    param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_line_code: this.ngForm.controls['variety_line_code'].value,
        user_id: UserId ? UserId.toString() : '',
        variety_code: this.ngForm.controls['variety'].value ? this.ngForm.controls['variety'].value : '',
        exclude_bsp2_id: this.editId ? (this.editId.toString()) : '',
        production_type: this.productionType
      }
    }

    this.productionService.postRequestCreator('get-bsp-proforma-1s-varieties-level-2', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      // this.varietyListofBsp2= response ? response :''

      this.responseList = response ? response : '';
      let checkStatus;
      if (!this.is_update && !this.showAddMoreInthisVariety) {
        if (this.Variety && this.Variety.length > 0) {
          checkStatus = this.Variety.filter(x => x.variety_code == this.ngForm.controls['variety'].value)
        }
        if (checkStatus && checkStatus[0] && checkStatus[0].variety_type && checkStatus[0].variety_type == 'hybrid') {
          this.showparental = true;
          this.getparentalData()
        }
        else {
          this.showparental = false;
          this.parentalList = []
        }
      }
      this.getClassQuantity();

      if (!this.editDataValue) {
        // this.getStageList();
      }

      // this.Variety = response && response.varietyList ? response.varietyList : '';


    })
  }
  getLotNo(i) {
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);
    if (this.is_update) {
      this.employeeIndex = 0
    }
    let lotno = []
    let res = this.ngForm.value && this.ngForm.value.carry_over ? this.ngForm.value.carry_over : '';
    if (this.lotNolist && this.lotNolist.length > 0) {
      let lotId = this.lotNolist.filter(x => x.lot_id == this.ngForm.controls['carry_over']['controls'][i].controls['lot_no'].value);
      this.ngForm.controls['carry_over']['controls'][i].controls['lot_name'].setValue(lotId && lotId[0] && lotId[0].display_text ? lotId[0].display_text : '')
    }
    if (res && res.length > 0) {
      res.forEach((el, i) => {
        // if (el && el.tag_no && el.tag_no.length == 1) {
        //   if (el.qty_available == el.qty_recieved) {
        //     el.tag_no.forEach((val => {
        //       lotno.push(val && val.value ? val.value : '');
        //     }))
        //   }
        // }
        if (el && el.tag_no && el.tag_no.length > 0) {
          el.tag_no.forEach((val => {
            lotno.push(val && val.value ? val.value : '');
          }))
        }
      })
    }
    const param = {
      search: {
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        variety_code: this.ngForm.controls['variety'].value,
        seed_class_id: this.ngForm.controls['carry_over']['controls'][i].controls['class_of_seed'].value ? this.ngForm.controls['carry_over']['controls'][i].controls['class_of_seed'].value.toString() : '',
        crop_code: this.ngForm.controls['crop'].value,
        line_variety_code: this.ngForm.controls['variety_line_code'].value,
        stage_id: this.ngForm.controls['carry_over']['controls'][i].controls['stage'].value,
        year: this.ngForm.controls['carry_over']['controls'][i].controls['year'].value,
        season: this.ngForm.controls['carry_over']['controls'][i].controls['season'].value,
        lot_id: this.ngForm.controls['carry_over']['controls'][i].controls['lot_no'].value ? this.ngForm.controls['carry_over']['controls'][i].controls['lot_no'].value : '',
        exclude_tag_range: lotno && (lotno.length > 0) ? (lotno.toString()) : '',
      }
    }
    // this.ngForm.controls['carry_over']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.tag_no.setValue('')
    // ngForm.controls['carry_over']['controls'][i].controls.total_quantity.controls[skillIndex].controls.lot_no.lotlist
    this.productionService.postRequestCreator('get-lot-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.lotNolist = response
      const formArray = this.ngForm.get('carry_over') as FormArray;
      // this.lotList= response
      if (formArray && formArray.controls && formArray.controls[i] && formArray.controls[i]['controls'] && formArray.controls[i]['controls'].lot_no) {
        this.ngForm.controls['carry_over']['controls'][i]['controls'].lot_no.lotNoList = response;
      }

      if (this.editDataValue) {
        if (this.bsp2Arrlist && this.bsp2Arrlist.length > 0) {
          this.bsp2Arrlist.forEach((el, n) => {
            if (el.carry_over && el.carry_over.length > 0) {
              el.carry_over.forEach((item, j) => {
                if (formArray && formArray.controls && formArray.controls[j] && formArray.controls[j]['controls'] && formArray.controls[j]['controls'].lot_no && formArray.controls[j]['controls'].lot_no.lotNoList) {

                  formArray.controls[j]['controls'].lot_no.lotNoList.push({
                    value: item && item.lot_name ? item.lot_name : "",
                    display_text: item && item.lot_name ? item.lot_name : "",
                    lot_number: item && item.lot_no_id ? item.lot_no_id : "",
                    lot_id: item && item.lot_no_id ? item.lot_no_id : "",
                  })
                  formArray.controls[j]['controls'].lot_no.lotNoList = formArray.controls[j]['controls'].lot_no.lotNoList.filter((arr, index, self) =>
                    index === self.findIndex((t) => (t.lot_id == arr.lot_id)))
                }
              })
            }
          })
        }
      }

    })
  }
  getTagNo(index) {
    let lotno = []
    let res = this.ngForm.value && this.ngForm.value.carry_over ? this.ngForm.value.carry_over : '';
    this.ngForm.controls['carry_over']['controls'][index].controls['qty_available'].setValue('');
    this.ngForm.controls['carry_over']['controls'][index].controls['qty_recieved'].setValue('');
    this.ngForm.controls['carry_over']['controls'][index].controls['tag_quantity'].setValue('');
    this.ngForm.controls['carry_over']['controls'][index].controls['tag_number'].setValue('');
    this.ngForm.controls['carry_over']['controls'][index].controls['tag_id'].setValue('');
    this.ngForm.controls['carry_over']['controls'][index].controls['tag_no'].setValue('');
    if (this.lotNolist && this.lotNolist.length > 0) {
      let lotId = this.lotNolist.filter(x => x.lot_id == this.ngForm.controls['carry_over']['controls'][index].controls['lot_no'].value);
      this.ngForm.controls['carry_over']['controls'][index].controls['lot_name'].setValue(lotId && lotId[0] && lotId[0].display_text ? lotId[0].display_text : '')
    }
    if (res && res.length > 0) {
      res.forEach((el, i) => {
        // if (el && el.tag_no && el.tag_no.length == 1) {
        //   if (el.qty_available == el.qty_recieved) {
        //     el.tag_no.forEach((val => {
        //       lotno.push(val && val.value ? val.value : '');
        //     }))
        //   }
        // }
        if (el && el.tag_no && el.tag_no.length > 0) {
          el.tag_no.forEach((val => {
            lotno.push(val && val.value ? val.value : '');
          }))
        }
      })
    }

    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);
    let lotNum;
    function calculateSumOfDuplicates(jsonData) {
      let sumMap = [];

      if (jsonData && jsonData.length > 0) {
        jsonData.forEach(item => {
          if (item && item.tagNoToString) {

            const key = `${item.lot_no}_${item.tagNoToString}`;

            if (!sumMap[key] && item.quantity_sown !== "") {
              sumMap[key] = { ...item };
              sumMap[key].sumQuantitySown = (parseFloat(item.qty_recieved));
            } else if (sumMap[key] && item.quantity_sown !== "") {
              sumMap[key].sumQuantitySown += (parseFloat(item.qty_recieved));
            }
          }
        });

        return Object.values(sumMap);
      }
    }

    let total_qty = [];
    let aggregatedJSON;
    if (res && res.length > 0) {
      res.forEach((el, i) => {
        if (el && el.total_quantity && el.total_quantity.length > 0) {
          total_qty.push(el.total_quantity)

        }
      })
    }
    let total_qtySecond = total_qty && total_qty.length > 0 ? total_qty.flat() : ''
    if (!this.editDataValue) {
      aggregatedJSON = calculateSumOfDuplicates(total_qtySecond);
    }
    this.aggregatedJSON = aggregatedJSON ? aggregatedJSON : '';
    let aggregatedJSONs = [];
    // aggregatedJSONs.push(aggregatedJSON)
    // this.aggregatedJSON = aggregatedJSONs;
    if (aggregatedJSON && aggregatedJSON.length > 0) {
      aggregatedJSON.forEach((el, i) => {
        if (el.sumQuantitySown == el.qty_available) {
          // lotno.push(ele)
          el.tag_no.forEach((val => {
            lotno.push(val && val.value ? val.value : '');
          }))
        }
      })
    }
    if (this.is_update) {
      this.employeeIndex = 0
    }
    const param = {
      search: {
        exclude_tag_range: lotno && (lotno.length > 0) ? (lotno.toString()) : '',
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        variety_code: this.ngForm.controls['variety'].value,
        seed_class_id: this.ngForm.controls['carry_over']['controls'][index].controls['class_of_seed'].value ? this.ngForm.controls['carry_over']['controls'][index].controls['class_of_seed'].value.toString() : '',
        crop_code: this.ngForm.controls['crop'].value,
        line_variety_code: this.ngForm.controls['variety_line_code'].value,
        stage_id: this.ngForm.controls['carry_over']['controls'][index].controls['stage'].value,
        year: this.ngForm.controls['carry_over']['controls'][index].controls['year'].value,
        season: this.ngForm.controls['carry_over']['controls'][index].controls['season'].value,
        lot_id: this.ngForm.controls['carry_over']['controls'][index].controls['lot_no'].value,
      }
    }

    this.productionService.postRequestCreator('get-tag-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';

      this.responseofLotData = response ? response : '';
      // response =response.sort((a, b) => a.value.localeCompare(b.value));

      if (response && response.length > 0) {
        response = response.sort((a, b) => {
          // Extract numeric and non-numeric parts
          const regex = /([^\d]+)|(\d+)/g;
          const aParts = a.value.match(regex);
          const bParts = b.value.match(regex);

          // Compare each part
          for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aPart = parseInt(aParts[i]) || aParts[i];
            const bPart = parseInt(bParts[i]) || bParts[i];

            if (aPart < bPart) {
              return -1;
            } else if (aPart > bPart) {
              return 1;
            }
          }

          return 0; // If all parts are equal
        });

      }

      this.tagNo = response;
      if (response && response.length > 0) {
        response = response.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.value === arr.value)))
      }
      if (response && response.length > 0) {
        response = response.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.value === arr.value)))
      }

      const formArray = this.ngForm.get('carry_over') as FormArray;
      if (formArray && formArray.controls && formArray.controls[index] && formArray.controls[index]['controls'] && formArray.controls[index]['controls'].tag_no) {
        this.ngForm.controls['carry_over']['controls'][index]['controls'].tag_no.tag_noList = response;
      }
      if (this.is_update) {
        this.employeeIndex = 0
      }
      let res = this.ngForm.value && this.ngForm.value.carry_over && this.ngForm.value.carry_over[this.employeeIndex] ? this.ngForm.value.carry_over[this.employeeIndex] : '';
      if (this.is_update) {
        if (this.bsp2Arrlist && this.bsp2Arrlist.length > 0) {
          this.bsp2Arrlist.forEach((el, n) => {
            if (el.carry_over && el.carry_over.length > 0) {
              el.carry_over.forEach((item, i) => {
                if (item && item.tag_no && item.tag_no.length > 0) {
                  const transformedData = el.carry_over.map(item => {
                    item.tag_no.forEach((tag, index) => {
                      tag.tag_id = item.tag_id.split(',')[index];
                      tag.quantity_remaining = item && item.quantity_remaining ? parseFloat(item.quantity_remaining.split(',')[index]) : parseFloat(item.tag_quantity.split(',')[index]);
                    });
                    return item;
                  });
                  if (formArray && formArray.controls && formArray.controls[i] && formArray.controls[i]['controls'] && formArray.controls[i]['controls'].tag_no && formArray.controls[i]['controls'].tag_no.tag_noList) {

                    item.tag_no.forEach((items) => {
                      this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_no.tag_noList.push(items);
                      this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_no.tag_noList = this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_no.tag_noList.filter((arr, index, self) =>
                        index === self.findIndex((t) => (t.value === arr.value)))
                    })
                    if (this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_no.tag_noList && this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_no.tag_noList.length > 0) {
                      this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_no.tag_noList.forEach((el, i) => {
                        if ((el.quantity_used) >= 0) {
                          el.quantity_remaining = el.quantity_remaining + el.quantity_used
                        } else {
                          el.quantity_remaining = el.quantity_remaining;
                        }
                      })
                      this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_no.tag_noList = this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_no.tag_noList.sort((a, b) => {
                        // Extract numeric and non-numeric parts
                        const regex = /([^\d]+)|(\d+)/g;
                        const aParts = a.value.match(regex);
                        const bParts = b.value.match(regex);

                        // Compare each part
                        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                          const aPart = parseInt(aParts[i]) || aParts[i];
                          const bPart = parseInt(bParts[i]) || bParts[i];

                          if (aPart < bPart) {
                            return -1;
                          } else if (aPart > bPart) {
                            return 1;
                          }
                        }

                        return 0; // If all parts are equal
                      });
                    }
                  }
                }
              })
            }
          })
        }

      }

    })
    // this.productionService.postRequestCreator('',)
  }

  getStageList(i) {
    this.showlotpage = true;
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);
    const param = {
      search: {
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        variety_code: this.ngForm.controls['variety'].value,
        seed_class_id: this.ngForm.controls['carry_over']['controls'][i].controls['class_of_seed'].value ? this.ngForm.controls['carry_over']['controls'][i].controls['class_of_seed'].value.toString() : '',
        crop_code: this.ngForm.controls['crop'].value,
        line_variety_code: this.ngForm.controls['variety_line_code'].value,
      }
    }
    this.productionService.postRequestCreator('get-stage-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.stage = response ? response : '';
      const formArray = this.ngForm.get('carry_over') as FormArray;
      if (formArray && formArray.controls && formArray.controls[i] && formArray.controls[i]['controls'] && formArray.controls[i]['controls'].stage) {
        this.ngForm.controls['carry_over']['controls'][i]['controls'].stage.stageList = response;
      }
    })
  }

  getTypeofSeedHybrid(index, skillIndex) {
    if (this.is_update) {
      this.employeeIndex = 0;
    }
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);
    const param = {
      search: {
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        id: ['6', '7'].toString(),
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        line_variety_code: this.ngForm.controls['carry_over']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.variety_line_code.value,

      }
    }

    this.productionService.postRequestCreator('get-seed-type-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.typeOfSeedList = response ? response : '';
      const formArray = this.ngForm.get('carry_over') as FormArray;


    })
    // showparental
  }
  getSeedInventoYear(i) {
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);


    const param = {
      search: {
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        variety_code: this.ngForm.controls['variety'].value,
        seed_class_id: this.ngForm.controls['carry_over']['controls'][i].controls['class_of_seed'].value ? this.ngForm.controls['carry_over']['controls'][i].controls['class_of_seed'].value.toString() : '',
        crop_code: this.ngForm.controls['crop'].value,
        line_variety_code: this.ngForm.controls['variety_line_code'].value,
        stage_id: this.ngForm.controls['carry_over']['controls'][i].controls['stage'].value

      }
    }
    this.productionService.postRequestCreator('get-year-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      const formArray = this.ngForm.get('carry_over') as FormArray;
      if (formArray && formArray.controls && formArray.controls[i] && formArray.controls[i]['controls'] && formArray.controls[i]['controls'].year) {
        this.ngForm.controls['carry_over']['controls'][i]['controls'].year.yearList = response;
      }


    })
  }

  getSeedInventoSeason(i) {
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);

    const param = {
      search: {
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        variety_code: this.ngForm.controls['variety'].value,
        seed_class_id: this.ngForm.controls['carry_over']['controls'][i].controls['class_of_seed'].value ? this.ngForm.controls['carry_over']['controls'][i].controls['class_of_seed'].value.toString() : '',
        crop_code: this.ngForm.controls['crop'].value,
        line_variety_code: this.ngForm.controls['variety_line_code'].value,
        stage_id: this.ngForm.controls['carry_over']['controls'][i].controls['stage'].value,
        year: this.ngForm.controls['carry_over']['controls'][i].controls['year'].value


      }
    }

    this.productionService.postRequestCreator('get-season-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      const formArray = this.ngForm.get('carry_over') as FormArray;
      if (formArray && formArray.controls && formArray.controls[i] && formArray.controls[i]['controls'] && formArray.controls[i]['controls'].season) {
        this.ngForm.controls['carry_over']['controls'][i]['controls'].season.seasonList = response;
      }

    })
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

  getBsp2List() {
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
    else {
      // this.getQr();
      this.showVarietyDetails = true;
      this.isSearch = true;
      this.getMasterBspReportData()
      // this.showetailsPage=true;

      const localdata = localStorage.getItem('BHTCurrentUser');
      let userData = JSON.parse(localdata)
      let varieytyData = []
      if (this.ngForm.controls['variety_level_2'].value && this.ngForm.controls['variety_level_2'].value.length > 0) {
        this.ngForm.controls['variety_level_2'].value.forEach((el, i) => {
          varieytyData.push(el && el.value ? el.value : '')
        })
      }

      const param = {
        search: {
          year: this.ngForm.controls['year'].value,
          season: this.ngForm.controls['season'].value,
          crop_code: this.ngForm.controls['crop'].value,
          variety_code: varieytyData && (varieytyData.length > 0) ? varieytyData : '',
          user_id: userData && userData.id ? (userData.id.toString()) : '',
          production_type: this.productionType
        }
      }
      this.productionService.postRequestCreator('get-seed-processing-reg-carry', param).subscribe(data => {
        let response = data?.EncryptedResponse?.data?.data ?? '';
        this.dummyData = response || [];

        let bsp1VarietyListArr = data?.EncryptedResponse?.data?.bsp1VarietyListArr?.flat() ?? [];
        if (this.dummyData && this.dummyData[0] && this.dummyData[0].is_freezed && (this.dummyData[0].is_freezed == 1)) {
          this.freezeData = true
        }
        else {
          this.freezeData = false
        }
        let directIndentVarietyListTotalArr = data?.EncryptedResponse?.data?.directIndentVarietyListTotalArr?.flat() ?? [];

        // Check freeze status
        // this.freezeData = !!(this.dummyData?.[0]?.is_freezed === 1);

        // Sum up `total_qty` for each `variety_code`
        let varietyTotalQtyMap: { [key: string]: number } = {};
        directIndentVarietyListTotalArr.forEach(item => {
          if (item.variety_code) {
            varietyTotalQtyMap[item.variety_code] = (varietyTotalQtyMap[item.variety_code] || 0) + (item.total_qty || 0);
          }
        });

        // Combine arrays logic
        let combineArrays = [];
        if (bsp1VarietyListArr.length > 0 && directIndentVarietyListTotalArr.length > 0) {
          combineArrays = this.combineArrays3(bsp1VarietyListArr, directIndentVarietyListTotalArr);
        } else if (bsp1VarietyListArr.length > 0) {
          combineArrays = bsp1VarietyListArr.filter((arr, index, self) =>
            index === self.findIndex(t => t.id === arr.id && t.variety_code === arr.variety_code));
        } else if (directIndentVarietyListTotalArr.length > 0) {
          combineArrays = directIndentVarietyListTotalArr.filter((arr, index, self) =>
            index === self.findIndex(t => t.indent_of_brseed_direct_line_ids === arr.indent_of_brseed_direct_line_ids && t.variety_code === arr.variety_code));
        }

        // Update `total_targeted_qty` correctly
        combineArrays.forEach(el => {
          let totalQtyFromIndent = varietyTotalQtyMap[el.variety_code] || 0;
          el.total_targeted_qty = (el.target_quantity || 0) + totalQtyFromIndent + (el.quantity || 0);
        });

        // Correct `variety_line_code`
        combineArrays.forEach(el => {
          el.variety_line_code = el.variety_line_code || el.line_variety_code || el.variety_code_line || '';
        });

        // Ensure correct display in the table
        // old code commented is 20 /08/2025
        // this.dummyData = this.dummyData.map(item => {
        //   let matchedItem = combineArrays.find(data => data.variety_code === item.variety_code || data.variety_code_line == item.line_variety_code);
        //   if (matchedItem) {
        //     if (!item.line_variety_code) {
        //       item.total_targeted_qty = matchedItem.total_targeted_qty;
        //     }
        //     else {
        //       item.total_targeted_qty = matchedItem.total_qty;
        //       item.quantity = matchedItem.quantity;
        //     }
        //   }
        //   return item;
        // });

        this.dummyData = this.dummyData.map(item => {
          // match line_variety_code first
          let matchedItem = combineArrays.find(
            data => data.variety_code === item.variety_code && data.variety_code_line === item.line_variety_code
          );
          // If line_variety_code is not there then match only variety_code
          if (!matchedItem && !item.line_variety_code) {
            matchedItem = combineArrays.find(data => data.variety_code === item.variety_code);
          }
          if (matchedItem) {
            if (item.line_variety_code) {
              // when line_variety_code is present
              item.total_targeted_qty = matchedItem.total_targeted_qty;
              item.quantity = matchedItem.quantity;
            } else {
              // When only variety_code matches (there is no line)
              item.total_targeted_qty = matchedItem.total_targeted_qty;
            }
          }
          return item;
        });
        
        this.getBsp2ListVariety();
      });
    }
  }

  getBsp2ListVariety() {
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        production_type: this.productionType
      }
    }
    this.productionService.postRequestCreator('get-carry-over-variety-grid', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      this.varietyListofBsp2list = response ? response : '';
      let checkStatus;
      if (this.parentalList && this.parentalList.length > 0) {

        checkStatus = this.varietyListofBsp2list.filter(x => x.variety_code == this.ngForm.controls['variety'].value)
      }


      // if (this.is_update) {
      // }
      if (checkStatus && checkStatus[0] && checkStatus[0].variety_type && checkStatus[0].variety_type == 'hybrid') {
        this.showparental = true;
        this.getparentalData()
      }
      else {
        this.showparental = false;
        this.parentalList = []

      }

      if (!this.showparental) {
        if (this.parentalList && this.parentalList.length < 1) {
          this.ngForm.controls['variety'].setValue('');
          this.selectVariety = '';
        }
      }
    })

  }
  getUnit(item) {
    let value = this.ngForm.controls['crop'].value && (this.ngForm.controls['crop'].value.slice(0, 1)) == 'A' ? 'Qt' : 'Kg';
    this.unit = value
    return value

  }
  getUnits(item) {
    let value = this.ngForm.controls['crop'].value && (this.ngForm.controls['crop'].value.slice(0, 1)) == 'A' ? 'Qt' : 'Kg';
    this.units = value
    return value

  }
  onDateChangeds(event, i) {
    let param = this.ngForm.value && this.ngForm.value.carry_over ? this.ngForm.value.carry_over : '';
    let res
    if (param && param[i].expected_date_inspection && param[i].expected_date_inspection && param[i].expected_date_inspection.singleDate && param[i].expected_date_inspection.singleDate.formatted && param[i].expected_date_inspection.singleDate.formatted != '') {
      res = param[i].expected_date_inspection.singleDate.formatted.split('-');
      res = res && res[0]
    }
    let dateofShowing;
    if (res && res != '' && res != null) {
      dateofShowing = this.convertDates(res)
    }
    let Inspection = event && event.singleDate && event.singleDate.formatted && (event.singleDate.formatted != '') ? event.singleDate.formatted.split('-') : "";
    let InspectionDate = this.convertDates(Inspection[0])
    if (dateofShowing && InspectionDate) {
      if (new Date(dateofShowing) < (new Date(InspectionDate))) {
        Swal.fire({
          title: '<p style="font-size:25px;">Expected Inspection Date Can be  less than Date of Sowning.</p>',
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: true,
          // timer: 2000
          // confirmButton:false
        })
        event.singleDate.formatted = '';
      }
    }

  }



  gettotalValue(i) {
    let data = this.ngForm.value ? this.ngForm.value : '';
    let carryOver = data && data.carry_over ? data.carry_over : '';
    if (carryOver && carryOver.length > 0) {

      carryOver.forEach((el, i) => {
        if (el.qty_available < el.qty_recieved) {
          Swal.fire({
            title: '<p style="font-size:25px;">Quantity Recieved Can not be greater than Quantity Available.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          })
          this.quantityError = true
          return;
        } else {
          this.quantityError = false
        }
      })
      let sum = 0;
      carryOver.forEach((el) => {
        sum += el && el.qty_recieved ? ((parseFloat(el.qty_recieved))) : 0;
      })
      if (sum && sum > 0) {
        this.ngForm.controls['total_breederseed'].setValue(sum)
      }
      // this.ngForm.controls['total_breederseed'].setValue(sum)
    }

  }



  vsClick() {
    document.getElementById('varietys').click()
  }


  onInputChange(event, i) {
    this.ngForm.controls['carry_over']['controls'][i]['controls']['address'].setValue(event && event.target && event.target.value && event.target.value ? event.target.value.toUpperCase() : '')
  }
  ChangeField(i) {
    // showDisableDate
    // this.onDateChangedharvesting(null,i)
    this.ngForm.controls['carry_over']['controls'][i].controls['showDisableDate'].setValue(false)
  }
  ChangeInspectionField(i) {
    this.ngForm.controls['carry_over']['controls'][i].controls['showDisableInspectionDate'].setValue(false)
  }
  firstPageCancel() {
    const FormArrays = this.ngForm.get('carry_over') as FormArray;
    const controlToKeeps = FormArrays.at(0);
    FormArrays.clear();
    this.addMore(0)
    if (this.Variety.length < 1) {
    }
    this.ngForm.controls['variety'].setValue('', { emitEvent: false, onlySelf: true });
    this.ngForm.controls['variety_line_code'].setValue('', { emitEvent: false, onlySelf: true });
    this.selectParental = '';
    this.selectVariety = '';
    this.editDataValue = false;
    this.showparental = false;
    this.ngForm.controls['total_breederseed'].setValue('', { emitEvent: false, onlySelf: true });
    this.ngForm.controls['meet_target'].setValue(1);
    // FormArrays.push(controlToKeeps);
    // this.removeSecondPage()
    this.is_update = false;
    this.editShowData = false;

  }

  convertDatesto(item) {
    let split = item ? item.split('-') : ''
    let year = split && split[0] ? split[0] : ''
    let month = split && split[1] ? split[1] : ''
    let day = split && split[2] ? split[2] : ''
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate
  }
  getparentalData() {
    // get-varieties-parental-line
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let UserId = datas.id
    const param = {
      search: {
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        user_id: UserId ? UserId.toString() : ''

      }
    }
    this.productionService.postRequestCreator('get-varieties-parental-line-for-carry-over', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.parentalList = response ? response : '';
        this.parentalListData = response ? response : '';
        this.parentalListSecond = response ? response : '';
        if (!this.showAddMoreInthisVariety && !this.editShowData) {

          if (this.showparental || this.editDataValue) {
            if (this.parentalListSecond && this.parentalListSecond.length < 1) {
              this.ngForm.controls['variety_line_code'].setValue('', { emitEvent: false, onlySelf: true });
              this.ngForm.controls['variety'].setValue('', { emitEvent: false, onlySelf: true });
              this.selectVariety = '';
              this.selectParental = ''
              this.showparental = false;
              this.editDataValue = false;
              // this.showAddMoreInthisVariety = false;
              // this.showparentalList=false;
              this.editDataValue = false;
            }
          }
        }

      }
    })
  }
  getparentalDataName(item) {
    let res = this.parentalList.filter(x => x.value == item);
    let data = res && res[0] && res[0].display_text ? res[0].display_text : '';
    return data ? data : '';
  }


  removeData() {
    const FormArrays = this.ngForm.get('carry_over') as FormArray;

    const controlToKeeps = FormArrays.at(0);
    FormArrays.clear();
    FormArrays.push(controlToKeeps);
  }

  checkDecimal(number) {
    let numbers;
    // if (Number.isInteger(number)) {
    //   return number.toString(); // If the number is an integer, return it as a string
    // }
    if (!isNaN(number)) {
      number = parseFloat(number);
    }
    if (this.validationErr) {
      number = number / 100;
      number = parseFloat(number.toFixed(2));
    }
    // if(Number.isInteger(number)){
    number = number * 100;
    number = parseFloat(number.toFixed(2)); // Round to 2 decimal places

    return number ? number.toString() : '0'
    // }
    // else{
    //   return number
    // }

  }

  saveForm() {
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);
    let UserId = userData.id
    this.ngForm.value.user_id = UserId;
    let datasValue = this.ngForm.value && this.ngForm.value ? this.ngForm.value : '';
    datasValue.variety_name = this.selectVariety;
    datasValue.variely_line = this.selectParental;
    datasValue.variety = this.ngForm.controls['variety'].value;
    datasValue.line_variety_code = this.ngForm.controls['variety_line_code'].value;
    datasValue.production_type = this.productionType ? this.productionType : "NORMAL";
    if (datasValue && datasValue.carry_over && datasValue.carry_over.length > 0) {
      if (this.unit == 'Qt') {
        datasValue.total_breederseed = datasValue && datasValue.total_breederseed ? (this.checkDecimal(datasValue.total_breederseed)) : ''
      }
      datasValue.carry_over.forEach((el, i) => {
        el.lot_no_id = el && el.lot_no ? el.lot_no : '';
        // let lotId = this.lotNolist.filter(x => x.lot_id == el.lot_no_id);
        // el.lot_name = lotId && lotId[0] && lotId[0].display_text ? lotId[0].display_text : '';       
        if (this.unit == 'Qt') {
          el.qty_recieved = el && el.qty_recieved ? (this.checkDecimal(el.qty_recieved)).toString() : '';
          el.qty_available = el && el.qty_available ? (this.checkDecimal(el.qty_available)).toString() : ''
        } else {
          el.qty_recieved = el && el.qty_recieved ? ((el.qty_recieved)).toString() : 0,
            el.qty_available = el && el.qty_available ? ((el.qty_available)).toString() : ''
        }
      })
    }
    if (this.ngForm.controls['meet_target'].value != 3) {
      let datasValue = this.ngForm.value && this.ngForm.value.carry_over ? this.ngForm.value.carry_over : '';
      for (let key in datasValue) {
        if (
          datasValue[key].class_of_seed == '' || datasValue[key].class_of_seed == null,
          datasValue[key].stage == '' || datasValue[key].stage == null,
          datasValue[key].year == '' || datasValue[key].year == null,
          datasValue[key].season == '' || datasValue[key].season == null,
          datasValue[key].lot_no == '' || datasValue[key].lot_no == null,
          datasValue[key].tag_no == '' || datasValue[key].tag_no == null
          || datasValue[key].tag_no.length < 1 || this.quantityError
        ) {
          Swal.fire({
            title: '<p style="font-size:25px;">Please Fill The Form Properly.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          })
          return;
        }
      }
    }
    const param = {
      data: datasValue
    }
    if (!this.is_update) {
      this.productionService.postRequestCreator('register-quantity-carry', param).subscribe(apiResponse => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Saved Successfully.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          }).then(x => {
            // this.getBsp2List();
            // this.getVarietyDetails();
            // this.editShowData = false;
            // this.getparentalData()
            // this.editDataValue = true;
            this.validationErr = false;

            this.getBsp2List();
            // this.showparental = false;
            this.getVarietyDetails();
            this.editShowData = false;
            this.getparentalData()
            this.editDataValue = true;
            // this.getMasterBspReportData();e
            // this.showAddMoreInthisVariety = false;
            // this.getMasterBspReportData();
            if (this.showparental || this.editDataValue) {
              if ((this.parentalListSecond && this.parentalListSecond.length < 1) || this.VarietyList.length < 1) {
                this.ngForm.controls['variety_line_code'].setValue('', { emitEvent: false, onlySelf: true });
                this.ngForm.controls['variety'].setValue('', { emitEvent: false, onlySelf: true });
                this.selectVariety = '';
                this.selectParental = ''
                this.showparental = false;
                this.editDataValue = false;
                const FormArrays = this.ngForm.get('carry_over') as FormArray;
                const controlToKeeps = FormArrays.at(0);
                FormArrays.clear();
                this.addMore(0);
                this.ngForm.controls['meet_target'].setValue(1);
                this.ngForm.controls['total_breederseed'].setValue('', { emitEvent: false, onlySelf: true })
                // this.showAddMoreInthisVariety = false;
                // this.showparentalList=false;
                this.editDataValue = false;
              } else {
                const FormArray = this.ngForm.get('carry_over') as FormArray;
                this.ngForm.controls['variety_line_code'].setValue('', { emitEvent: false, onlySelf: true });
                this.selectParental = '';
                const FormArrays = this.ngForm.get('carry_over') as FormArray;
                const controlToKeeps = FormArrays.at(0);
                FormArrays.clear();
                this.addMore(0);
                this.ngForm.controls['meet_target'].setValue(1);
                this.ngForm.controls['total_breederseed'].setValue('', { emitEvent: false, onlySelf: true });
                this.showparental = true;
                this.editDataValue = true;
                // this.showAddMoreInthisVariety = true;
                this.showparentalList = true;
              }
            } else {
              this.ngForm.controls['variety_line_code'].setValue('');
              this.selectParental = '';
              const FormArray = this.ngForm.get('carry_over') as FormArray;
              const FormArrays = this.ngForm.get('carry_over') as FormArray;
              const controlToKeeps = FormArrays.at(0);
              FormArrays.clear();
              this.addMore(0)
              // this.ngForm.controls['total_breederseed'].setValue('', { emitEvent: false, onlySelf: true });
              this.ngForm.controls['variety_line_code'].setValue('', { emitEvent: false, onlySelf: true });
              this.ngForm.controls['variety'].setValue('', { emitEvent: false, onlySelf: true });
              this.ngForm.controls['meet_target'].setValue(1);
              this.ngForm.controls['total_breederseed'].setValue('', { emitEvent: false, onlySelf: true });
              this.selectVariety = '';
              this.selectParental = ''
              const controlToKeep = FormArray.at(0);
              FormArray.clear();
              this.editDataValue = false;
              this.showAddMoreInthisVariety = false;
              this.showVarietyDetails = false;
              this.showparentalList = false;
              // FormArray.push(controlToKeep);
            }
          })
        } else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 400) {
          this.validationErr = true
          Swal.fire({
            title: '<p style="font-size:25px;">Validation Error.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          }).then(x => {

          })
          return;
        } else {
          this.validationErr = true;
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          }).then(x => {

          })
        }
      })
    }
    else {
      datasValue.bspc_2_id = this.editId;
      const param = {
        data: datasValue,
        bspc_2_id: this.editId,
        user_id: userData && userData.id ? (userData.id.toString()) : '',
      }
      this.productionService.postRequestCreator('edit-carry-over-seed-by-id', param).subscribe(apiResponse => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Updated Successfully.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          }).then(x => {
            this.getBsp2List();
            // this.showparental = false;
            this.getVarietyDetails();
            this.validationErr = false;
            this.ngForm.controls['variety'].setValue('', { emitEvent: false, onlySelf: true })
            this.selectVariety = '';
            this.ngForm.controls['variety_line_code'].setValue('', { emitEvent: false, onlySelf: true })
            this.selectParental = '';
            // this.removeSecondPage()
            this.is_update = false;
            this.editDataValue = false;
            this.showAddMoreInthisVariety = false;
            this.editShowData = false;
            const FormArrays = this.ngForm.get('carry_over') as FormArray;
            const controlToKeeps = FormArrays.at(0);
            FormArrays.clear();
            this.addMore(0);
            this.ngForm.controls['meet_target'].setValue(1);
            this.ngForm.controls['total_breederseed'].setValue('', { emitEvent: false, onlySelf: true });
            // this.ngForm.controls['total_breederseed'].setValue('', { emitEvent: false, onlySelf: true });
            this.ngForm.controls['variety_line_code'].setValue('', { emitEvent: false, onlySelf: true });
            this.ngForm.controls['variety'].setValue('', { emitEvent: false, onlySelf: true });
          })
        } else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 400) {
          this.validationErr = true
          Swal.fire({
            title: '<p style="font-size:25px;">Validation Error.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          }).then(x => {

          })
          return;
        } else {
          this.validationErr = true
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          }).then(x => {

          })
        }
      })
    }
  }




  formatNumber(number) {

    if (Number.isInteger(number)) {
      return number.toString(); // If the number is an integer, return it as a string
    } else {

      // If it's a string representing a number, convert it to a number
      if (!isNaN(number)) {
        number = parseFloat(number);
      }

      // If the number is between 0 and 1 and has only one decimal place, add a trailing zero
      if (number > 0 && number < 1 && number % 1 !== 0) {
        return number.toFixed(2); // Return the number with two decimal places as a string
      }
      else {
        number
      }

    }
  }
  getUserData() {
    let localData = localStorage.getItem('BHTCurrentUser')
    let parseData = JSON.parse(localData);
    let userId = parseData && parseData.id
    this.master.postRequestCreator('get-user-data-details', null, {
      search: {
        user_id: userId ? userId.toString() : ''
      }
    }).subscribe(apiresponse => {
      let res = apiresponse && apiresponse.EncryptedResponse && apiresponse.EncryptedResponse.data ? apiresponse.EncryptedResponse.data : '';
      this.agencyName = res && res[0] && res[0].agency_name ? res[0].agency_name : '';
      this.bspcAddress = res && res[0] && res[0].address ? res[0].address : '';
      this.stateName = res && res[0] && res[0].state_name ? res[0].state_name : '';
      this.districtName = res && res[0] && res[0].district_name ? res[0].district_name : '';

      this.contact_person_name = res && res[0] && res[0].contact_person_name ? res[0].contact_person_name : '';
      this.designation = res && res[0] && res[0].designation ? res[0].designation : '';
    })
    // this.userName= parseData && parseData.name ? parseData.name :''
  }
  async getMasterBspReportData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

    const route = 'get-bsp2-data-list';
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const result = await this.master.postRequestCreator(route, null, {

      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        user_id: UserId,
        production_type: this.productionType

      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined &&
        apiResponse.EncryptedResponse !== undefined &&
        apiResponse.EncryptedResponse.status_code == 200) {
        // let reportDataArray = [];
        let reportDataArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.data ? (apiResponse.EncryptedResponse.data.data) : '';
        let bsp1VarietyListArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.bsp1VarietyListArr ? (apiResponse.EncryptedResponse.data.bsp1VarietyListArr) : '';
        let directIndentVarietyListTotalArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.directIndentVarietyListTotalArr ? (apiResponse.EncryptedResponse.data.directIndentVarietyListTotalArr) : '';
        bsp1VarietyListArr = bsp1VarietyListArr ? bsp1VarietyListArr.flat() : '';

        let combineArrays;
        let combineArrays2;
        this.cropNameofReport = reportDataArr && reportDataArr[0] ? reportDataArr[0].crop_name : ''
        directIndentVarietyListTotalArr = directIndentVarietyListTotalArr ? directIndentVarietyListTotalArr.flat() : '';
        if (bsp1VarietyListArr && bsp1VarietyListArr.length > 0 && directIndentVarietyListTotalArr && directIndentVarietyListTotalArr.length > 0) {
          // if (directIndentVarietyListTotalArr && directIndentVarietyListTotalArr.length > 0) {
          combineArrays = this.combineArrays3(bsp1VarietyListArr, directIndentVarietyListTotalArr)
          combineArrays2 = this.combineArrays3(bsp1VarietyListArr, directIndentVarietyListTotalArr)
          // }
        }
        else if (bsp1VarietyListArr && bsp1VarietyListArr.length > 0 && directIndentVarietyListTotalArr.length < 1) {
          bsp1VarietyListArr = bsp1VarietyListArr.filter((arr, index, self) =>
            index === self.findIndex((t) => (t.id === arr.id && t.variety_code === arr.variety_code)))
          bsp1VarietyListArr.forEach((el, i) => {
            el['total_targeted_qty'] = el && el.total_quantity ? el.total_quantity : 0
          })
          combineArrays = bsp1VarietyListArr
        }
        if (combineArrays && combineArrays.length > 0) {
          combineArrays.forEach((el, i) => {
            el['quantity'] = el && el['quantity'] ? el['quantity'] : 0
            if (el && el.variety_line_code != '' && el.variety_line_code != null && el.variety_line_code != undefined && el.variety_line_code != ' ' && el.variety_line_code != 'NULL' && el.variety_line_code != 'N/A') {
              el.total_targeted_qty = el && el.target_quantity ? (el.target_quantity + el.quantity) : el && el.quantity ? el.quantity : '';
            } else {
              el.total_targeted_qty = el && el.target_quantity ? (el.target_quantity + el.quantity) : el && el.total_qty ? (el.total_qty + el.quantity) : '';
            }
          })
        }
        if (combineArrays && combineArrays.length > 0) {
          if (reportDataArr && reportDataArr.length > 0) {
            let reportDataArrsss;
            const filteredData = reportDataArr.map(item => {
              item.line_variety_code_details.forEach(lineVarietyDetail => {
                const matchedItem = combineArrays.find(data => data.variety_code === item.variety_code && data.variety_line_code === lineVarietyDetail.variety_line_code);
                if (matchedItem) {
                  lineVarietyDetail.total_targeted_qty = matchedItem.total_targeted_qty;
                }
              });
              const matchedItem = combineArrays.find(data => data.variety_code === item.variety_code && !data.variety_line_code);
              if (matchedItem) {
                item.total_targeted_qty = matchedItem.total_targeted_qty;
              }

              return item;
            });

            this.data1 = filteredData;
          } else {
            this.data1 = reportDataArr
          }
        } else {
          this.data1 = reportDataArr

        }
        if (this.data1 && this.data1.length > 0) {
          const bsp2DetailsLength = this.data1.map(item => {
            const lineVarietyDetails = item.line_variety_code_details;
            let totalLength = 0;
            lineVarietyDetails.forEach(details => {
              totalLength += details.bsp2_Deteials.length;
            });
            return totalLength;
          });

          const sumofbsp2_Deteials = bsp2DetailsLength.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          let sums = 0
          this.data1.forEach((el, i) => {
            let sum = 0
            let sum2 = 0

            // this.data1[0].toalDataLengths=2
            // this.data1[1].toalDataLengths=2
            el.bsp2Data = []
            sums += el.line_variety_code_details.length
            el.toalDataLengths = el.line_variety_code_details.length;
            el.line_variety_code_details.forEach((item, index) => {
              item.toalDataLengths2 = el.line_variety_code_details.length;
              // sum2

              item.totalbsp2_Deteialslength = item.bsp2_Deteials.length
              sum += item.bsp2_Deteials.length + el.line_variety_code_details.length
              el.toalDataLength = sum;
              el.sumofbsp2_Deteials = sumofbsp2_Deteials
              el.toalDataLengths = item.bsp2_Deteials.length + el.line_variety_code_details.length
              // item.bsp2_Deteials.forEach((val,j)=>{
              //   if ((j + 1) % 4 === 0) {
              //     val.ids = "page-break1";
              //   }else{
              //     val.ids = "page-break2";
              //   }
              // })
            })
          })
          this.data1.forEach((el, i) => {
            el.line_variety_code_details.forEach((item, index) => {
              el.bsp2Data.push(...item.bsp2_Deteials)

            })
          })
          this.data1.forEach((el, i) => {
            el.bsp2DatalengthArr = el.bsp2Data.length;
          })
        }
      }


    });
  }
  checkReferenceData() {
    const param = {
      report_type: 'bsp2'
    }
    this.breeder.postRequestCreator('check-report-runing-number', null, param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.runningNumber = res && (res.running_number) ? (res.running_number) : 0;
      this.runningNumber2 = (parseInt(this.runningNumber) + 1)
    })
  }
  UpdateReferenceData() {
    const param = {
      report_type: 'bsp2',
      next_val: this.runningNumber2 ? this.runningNumber2 : 0
    }
    this.breeder.postRequestCreator('update-report-runing-number', null, param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      // this.checkReferenceData()
      // this.runningNumber=res ? res :'';
    })
  }

  getQr() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData);
    let user_id = data.id;
    const year = this.ngForm.controls['year'].value;
    const season = this.ngForm.controls['season'].value;
    const crop_code = this.ngForm.controls['crop'].value;
    this.encryptedData = CryptoJS.AES.encrypt(JSON.stringify({ year, season, user_id, crop_code }), 'a-343%^5ds67fg%__%add').toString();
    this.encryptedData = encodeURIComponent(this.encryptedData);
    this.download();
  }
  download() {
    // this.getQr()
    const name = 'bsp-two-report';
    const element = document.getElementById('pdf-tables');
    const options = {
      filename: `${name}.pdf`,
      margin: [30, 0],
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
        scale: 1,
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
  capitalizeWords(str) {
    if (str) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    }
  }
  combineArrays(array1, array2) {
    // Create a new array to store the combined data
    let combinedArray = [];
    // Iterate over the first array
    array1.forEach(item1 => {
      // Find the corresponding item in the second array based on variety_code and variety_line_code
      let matchingItem = array2.find(item2 => {

        if (item1.variety_line_code) {
          return item2.variety_code === item1.variety_code && item2.variety_code_line === item1.variety_line_code;
        } else if (item1.variety_code) {
          return item2.variety_code === item1.variety_code;
        }
      });


      // If a matching item is found, combine the data
      if (matchingItem) {
        combinedArray.push({
          id: item1.id,
          variety_code: item1.variety_code,
          variety_line_code: item1.variety_line_code,
          target_quantity: item1.target_quantity,
          quantity: matchingItem && matchingItem.quantity ? matchingItem.quantity : 0
        });
      } else {
        // If no matching item is found, combine only the data from the first array
        combinedArray.push({
          id: item1.id,
          variety_code: item1.variety_code,
          variety_line_code: item1 && item1.variety_line_code ? item1.variety_line_code : matchingItem && matchingItem.variety_code_line ? matchingItem.variety_code_line : '',
          target_quantity: item1.target_quantity
        });
      }

    });

    return combinedArray;
  }
  combineArrays3(array1, array2) {
    // Create a new array to store the combined data
    let combinedArray = [];
    // Iterate over the first array
    array1.forEach(item1 => {
      // Find the corresponding item in the second array based on variety_code and variety_line_code
      let matchingItem = array2.find(item2 => {
        if (item1.variety_line_code) {
          return item2.variety_code === item1.variety_code && item2.variety_code_line === item1.variety_line_code;
        } else if (item1.variety_code === item2.variety_code && !item1.variety_line_code && !item2.variety_code_line) {
          return true;
        }
        return false;
      });

      // If a matching item is found, combine the data
      if (matchingItem) {
        combinedArray.push({
          id: item1.id,
          variety_code: item1.variety_code,
          variety_line_code: item1.variety_line_code,
          target_quantity: item1 && item1.target_quantity ? item1.target_quantity : 0,
          quantity: matchingItem.quantity || 0,
          total_qty: matchingItem.total_qty || 0
        });
      } else {
        // If no matching item is found, push only the item from array1 into combinedArray
        combinedArray.push({
          id: item1.id,
          variety_code: item1.variety_code,
          variety_line_code: item1.variety_line_code || '',
          target_quantity: item1 && item1.target_quantity ? item1.target_quantity : 0,
          total_qty: 0 // Since no match found, total_qty defaults to 0
        });
      }
    });

    // Iterate over the second array to find any unmatched items
    array2.forEach(item2 => {
      let matchingItem = combinedArray.find(item => item.variety_code === item2.variety_code);
      if (!matchingItem) {
        combinedArray.push({
          id: null, // You can decide how to handle this or set it to a specific value
          variety_code: item2.variety_code,
          variety_line_code: item2.variety_code_line || '',
          target_quantity: 0, // Since no match found, target_quantity defaults to 0
          total_qty: item2.total_qty || 0
        });
      }
    });

    return combinedArray;
  }

  combineArrays2(arr1, arr2) {
    return arr1.map(item1 => {
      const matchedItem = arr2.find(item2 => {
        if (item1.variety_line_code && item2.variety_line_code) {
          return item1.variety_code === item2.variety_code && item1.variety_line_code === item2.variety_line_code;
        } else {
          return item1.variety_code === item2.variety_code;
        }
      });
      if (matchedItem) {
        return {
          ...item1,
          target_quantity: matchedItem.target_quantity,
          total_targeted_qty: matchedItem.total_targeted_qty
        };
      } else {
        return item1;
      }
    });
  }

  findMatchedVariety(originalItem, item) {
    return originalItem.variety_code === item.variety_code && originalItem.variety_line_code === item.variety_line_code;
  }


  checkDecimalValue($e) {
    checkDecimal($e);
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

  checkValue(a) {
    if (!isNaN(a)) {
      // Convert 'a' to a number
      let aNumber = parseFloat(a);
      // Format it to display two decimal places
      let aFormatted = aNumber.toFixed(2);
      return aFormatted
    } else {
      return a

    }
  }
  setmeettarget(item) {
    this.ngForm.controls['meet_target'].setValue(item)
    const FormArrays = this.ngForm.get('carry_over') as FormArray;
    const controlToKeeps = FormArrays.at(0);
    if (item == 3) {
      FormArrays.clear();
    }
    else {
      FormArrays.clear();
      this.addMore(0)
    }
  }
  getQuantitofSeed() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_line_code: this.ngForm.controls['variety_line_code'].value,
        user_id: UserId ? UserId.toString() : '',
        variety_code: this.ngForm.controls['variety'].value ? this.ngForm.controls['variety'].value : '',
        // exclude_bsp2_id: this.editId ? (this.editId.toString()) : ''
      }
    }
    this
  }
  getValue(i) {
    let value = this.ngForm.value && this.ngForm.value['carry_over'] ? this.ngForm.value['carry_over'] : '';
    let data = value && value[i] && value[i].tag_no ? value[i].tag_no : '';
    if (data && data.length > 1) {
      this.ngForm.controls['carry_over']['controls'][i]['controls'].enableqty_recieved.setValue(true)
    } else {
      this.ngForm.controls['carry_over']['controls'][i]['controls'].enableqty_recieved.setValue(false)
    }
    // tag_quantity:[''],
    // tag_number:[''],
    // tag_id:['']  
    let idsInArray2;
    if (data && data.length > 0) {
      idsInArray2 = data.map(obj => obj.display_text);
    }
    let filteredArray;
    let tag_quantity = []
    if (idsInArray2 && idsInArray2.length > 0 && this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_no && this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_no.tag_noList) {
      filteredArray = this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_no.tag_noList.filter(item => idsInArray2.includes(item.display_text));
    }
    let arrs = [];
    // let arr= this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_no.tag_noList

    //  filteredArray = arr.filter(obj1 =>
    //   valueArr.some(obj2 => obj1.value == obj2)
    // );
    arrs.push(filteredArray ? filteredArray : '')

    if (this.aggregatedJSON && this.aggregatedJSON.length > 0) {
      let diff = 0
      this.aggregatedJSON.forEach((el, index) => {
        diff = el.quantity_available - el.sumQuantitySown
      })
      filteredArray.forEach((el, i) => {
        this.aggregatedJSON.forEach((item, index) => {
          if (el.tag_number == item.tagNoToString) {
            if (this.units == 'Qt') {
              el.quantity_remaining = item && item.quantity_sown && item.quantity_available && (item.quantity_sown) ? (((parseFloat(item.quantity_available) * 100) - (parseFloat(item.sumQuantitySown) * 100))) : 0;
            } else {
              el.quantity_remaining = item && item.quantity_sown && item.quantity_available && (item.quantity_sown) ? ((item.quantity_available - (item.sumQuantitySown))) : 0;
            }
            // if (this.unit == 'Qt') {
            // } else {
            //   el.quantity_remaining = item && item.sumQuantitySown && item.quantity_available && (item.sumQuantitySown) ? ((item.quantity_available - item.sumQuantitySown)) : 0;
            // }
          }
        })
      })

      // this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_sown.setValue(diff);
    }
    if (filteredArray && filteredArray.length > 0) {
      let sum = 0;
      filteredArray.forEach(el => {
        sum += el && el.quantity_remaining ? el.quantity_remaining : 0
      })
      if (this.unit == 'Qt') {
        this.ngForm.controls['carry_over']['controls'][i]['controls'].qty_recieved.setValue((sum / 100));
        this.ngForm.controls['carry_over']['controls'][i]['controls'].qty_available.setValue((sum / 100));
      } else {
        this.ngForm.controls['carry_over']['controls'][i]['controls'].qty_recieved.setValue(sum);
        this.ngForm.controls['carry_over']['controls'][i]['controls'].qty_available.setValue(sum);
      }
    } else {
      this.ngForm.controls['carry_over']['controls'][i]['controls'].qty_recieved.setValue(0);
      this.ngForm.controls['carry_over']['controls'][i]['controls'].qty_available.setValue(0);
    }
    let datas = this.ngForm.value && this.ngForm.value['carry_over'] ? this.ngForm.value['carry_over'] : '';

    let tag_number = [];
    let tag_id = [];

    if (filteredArray && filteredArray.length > 0) {
      filteredArray.forEach(x => {
        tag_number.push(x && x.display_text ? x.display_text : '')
        tag_id.push(x && x.tag_id ? x.tag_id : '');
        tag_quantity.push(x && x.quantity_remaining ? x.quantity_remaining : '')
        // tagQty.push(item && item['quantity_sown'] ? item['quantity_sown'].toString() : '0')
      }
      )
    }
    this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_number.setValue(tag_number && tag_number.length > 0 ? tag_number.toString() : '');
    this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_id.setValue(tag_id && (tag_id.length > 0) ? tag_id.toString() : '');
    this.ngForm.controls['carry_over']['controls'][i]['controls'].tag_quantity.setValue(tag_quantity && (tag_quantity.length > 0) ? tag_quantity.toString() : '');
    let sumdatas = 0;
    if (datas && datas.length > 0) {
      datas.forEach((el, i) => {
        sumdatas += el && el.qty_recieved ? parseFloat(el.qty_recieved) : 0
      })
    }
    if (sumdatas && sumdatas > 0) {
      this.ngForm.controls['total_breederseed'].setValue(sumdatas)

    }
    // if(!this.editDataValue){
    // }
  }
  getStage(item) {
    if (item) {
      let uniqueStage = []
      // uniqueStage.push()
      function integerToRoman(num) {
        if (typeof num !== 'number' || num < 1 || num > 3999) {
          return "Invalid input";
        }

        const romanNumerals = [
          ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
          ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
          ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"],
          ["", "M", "MM", "MMM"]
        ];

        let roman = "";
        let digits = num.toString().split('').reverse();

        for (let i = 0; i < digits.length; i++) {
          roman = romanNumerals[i][parseInt(digits[i])] + roman;
        }

        return roman;
      }
      let romanNumber = integerToRoman(item)
      return romanNumber
    } else {
      return 'NA'
    }
  }
  getYearData(item) {
    if (item) {
      return this.getFinancialYear(item)
    } else {
      return 'NA'
    }
  }
  getSeasonData(item) {
    if (item) {
      const seasonNames = {
        'K': 'Kharif',
        'R': 'Rabi'
      };
      let season = item == 'K' ? "Kharif" : item == 'R' ? 'Rabi' : 'NA'
      return season
    } else {
      return 'NA'
    }
  }
  getLotNoData(item) {
    if (item) {
      return item
    } else {
      return 'NA'
    }
  }
  getTagNoData(item) {
    if (item && item.length > 1) {
      let data = []
      item.forEach((el, i) => {
        data.push(el && el.display_text ? el.display_text : '')
      })

      const arr2 = data.map(str => {
        const match = str.match(/(.*?)(\d+)$/); // Match any characters (lazy) followed by the number
        if (match === null) {
          return str; // Return the original string if no match
        } else {
          return match ? { prefix: match[1], number: parseInt(match[2]) } : null; // Extract prefix and number
        }
      });

      const groupedByPrefix: Record<string, number[]> = arr2.reduce((acc, obj) => {
        if (typeof obj === 'string') { // If it's a string, directly use it as prefix
          acc[obj] = acc[obj] || [];
        } else { // If it's an object, extract prefix
          acc[obj.prefix] = acc[obj.prefix] || [];
          acc[obj.prefix].push(obj.number);
        }
        return acc;
      }, {});

      // Generate the result
      const result = Object.entries(groupedByPrefix).map(([prefix, numbers]) => {
        const sortedNumbers = (numbers as number[]).sort((a, b) => a - b);
        const ranges = [];
        let start = sortedNumbers[0];
        let end = start;
        for (let i = 1; i < sortedNumbers.length; i++) {
          if (sortedNumbers[i] === end + 1) {
            end = sortedNumbers[i];
          } else {
            ranges.push(end === start ? `${prefix}${start}` : `${prefix}${start}-${end}`);
            start = end = sortedNumbers[i];
          }
        }
        ranges.push(end === start ? `${prefix}${start}` : `${prefix}${start}-${end}`);
        return ranges;
      }).flat();

      return result && result.length > 0 ? result.toString() : 'NA';

    } else if (item && item.length == 1) {
      let data = []
      item.forEach((el, i) => {
        data.push(el && el.display_text ? el.display_text : '')
      });
      return data && (data.length > 0) ? (data.toString()) : 'NA'
    } else {
      return 'NA'
    }

  }

  editData(id) {
    let count = 0;
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let UserId = datas.id
    const param = {
      bspc_2_id: id,
      user_id: UserId
    }
    this.editDataValue = true;
    this.is_update = true;
    this.editId = id;
    this.showlotpage = true;
    this.editShowData = true;
    this.showparental = true;
    this.productionService.postRequestCreator('get-carry-over-by-id', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.bspProforma2SeedData = response && response.bspProforma2SeedData ? response.bspProforma2SeedData : '';
      let bspProforma2Data = response && response.bspProforma2Data ? response.bspProforma2Data : '';
      let datas = []
      let req_data = bspProforma2Data && bspProforma2Data.req_data ? bspProforma2Data.req_data : response && response.req_data ? response.req_data : '';
      this.req_data = req_data
      if (req_data) {
        datas.push(req_data)
        this.bsp2Arrlist = datas;
      }
      this.ngForm.controls['variety'].setValue(req_data && req_data.variety ? req_data.variety : '', { emitEvent: false, onlySelf: true });
      this.selectVariety = req_data && req_data.variety_name ? req_data.variety_name : '';
      if (this.unit == 'Qt') {
        this.ngForm.controls['total_breederseed'].setValue(req_data && req_data.total_breederseed ? (req_data.total_breederseed / 100) : 'NA', { emitEvent: false, onlySelf: true })
      } else {
        this.ngForm.controls['total_breederseed'].setValue(req_data && req_data.total_breederseed ? req_data.total_breederseed : 'NA', { emitEvent: false, onlySelf: true })
      }
      this.ngForm.controls['meet_target'].setValue(req_data && req_data.meet_target ? req_data.meet_target : 'NA', { emitEvent: false, onlySelf: true })

      this.getparentalData();
      this.selectParental = req_data && req_data.variely_line ? req_data.variely_line : '';
      if (this.showparental) {
        this.ngForm.controls['variety_line_code'].setValue(req_data && req_data.variety_line_code ? req_data.variety_line_code : '', { emitEvent: false, onlySelf: true });
      }
      this.getClassQuantity()
      let checkStatus;
      checkStatus = this.varietyListofBsp2list.filter(x => x.value == this.ngForm.controls['variety'].value)
      if (checkStatus && checkStatus[0] && checkStatus[0].variety_type && checkStatus[0].variety_type == 'hybrid') {
        this.showparental = true;
        this.getparentalData()
      }
      else {
        this.showparental = false;
        this.parentalList = []
      }
      // for (let i = 1; i < this.bsp2Arrlist.length; i++) {
      //   this.addMore(i)
      // }
      this.getVarietyDetailsSecond()

      // this.getStageList();
      // if(count<=1){
      // }
      // this.getStageList(0);
      if (req_data && req_data.carry_over && req_data.carry_over.length > 0 && this.ngForm.controls['meet_target'].value != 3) {
        const FormArrays = this.ngForm.get('carry_over') as FormArray;
        const controlToKeeps = FormArrays.at(0);
        FormArrays.clear();
        req_data.carry_over.forEach((el, i) => {
          this.addMore(i)
        })


        if (req_data && req_data.carry_over && req_data.carry_over.length > 1) {
          req_data.carry_over.forEach((el, i) => {
            this.ngForm.controls['carry_over']['controls'][i].controls['show_class'].setValue(true, { emitEvent: false, onlySelf: true });
            this.ngForm.controls['carry_over']['controls'][i].controls['class_of_seed'].setValue(7, { emitEvent: false, onlySelf: true });
            this.getStageList(i);
            this.ngForm.controls['carry_over']['controls'][i].controls['stage'].setValue(el && el.stage ? el.stage : '', { emitEvent: false, onlySelf: true });
            this.getSeedInventoYear(i)
            this.ngForm.controls['carry_over']['controls'][i].controls['year'].setValue(el && el.year ? el.year : '', { emitEvent: false, onlySelf: true });
            this.getSeedInventoSeason(i);
            this.ngForm.controls['carry_over']['controls'][i].controls['season'].setValue(el && el.season ? el.season : '', { emitEvent: false, onlySelf: true });
            this.getLotNo(i)
            this.ngForm.controls['carry_over']['controls'][i].controls['lot_no'].setValue(el && el.lot_no_id ? el.lot_no_id : '', { emitEvent: false, onlySelf: true });
            this.ngForm.controls['carry_over']['controls'][i].controls['lot_name'].setValue(el && el.lot_name ? el.lot_name : '', { emitEvent: false, onlySelf: true })
            this.getTagNo(i)
            this.ngForm.controls['carry_over']['controls'][i].controls['tag_no'].setValue(el && el.tag_no ? el.tag_no : ''), { emitEvent: false, onlySelf: true };
            if (this.ngForm.controls['carry_over']['controls'][i].controls['tag_no'].value && this.ngForm.controls['carry_over']['controls'][i].controls['tag_no'].value.length > 1) {
              this.ngForm.controls['carry_over']['controls'][i]['controls'].enableqty_recieved.setValue(true)
            } else {
              this.ngForm.controls['carry_over']['controls'][i]['controls'].enableqty_recieved.setValue(false)
            }
            if (this.unit == 'Qt') {
              this.ngForm.controls['carry_over']['controls'][i].controls['qty_recieved'].setValue(el && el.qty_recieved ? (parseFloat(el.qty_recieved) / 100) : '', { emitEvent: false, onlySelf: true });
              this.ngForm.controls['carry_over']['controls'][i].controls['qty_available'].setValue(el && el.qty_available ? (parseFloat(el.qty_available) / 100) : '', { emitEvent: false, onlySelf: true });
            } else {
              this.ngForm.controls['carry_over']['controls'][i].controls['qty_recieved'].setValue(el && el.qty_recieved ? el.qty_recieved : '', { emitEvent: false, onlySelf: true });
              this.ngForm.controls['carry_over']['controls'][i].controls['qty_available'].setValue(el && el.qty_available ? el.qty_available : '', { emitEvent: false, onlySelf: true });
            }

            this.ngForm.controls['carry_over']['controls'][i].controls['tag_quantity'].setValue(el && el.tag_quantity ? el.tag_quantity : '', { emitEvent: false, onlySelf: true });
            this.ngForm.controls['carry_over']['controls'][i].controls['tag_number'].setValue(el && el.tag_number ? el.tag_number : '', { emitEvent: false, onlySelf: true });
            this.ngForm.controls['carry_over']['controls'][i].controls['tag_id'].setValue(el && el.tag_id ? el.tag_id : '', { emitEvent: false, onlySelf: true });
            this.ngForm.controls['carry_over']['controls'][i].controls['stage'].setValue(el && el.stage ? el.stage : '', { emitEvent: false, onlySelf: true });
          })
        } else {
          req_data.carry_over.forEach((el, i) => {
            this.ngForm.controls['carry_over']['controls'][i].controls['show_class'].setValue(true, { emitEvent: false, onlySelf: true });
            this.ngForm.controls['carry_over']['controls'][i].controls['class_of_seed'].setValue(7, { emitEvent: false, onlySelf: true });
            this.getStageList(i);
            this.ngForm.controls['carry_over']['controls'][i].controls['stage'].setValue(el && el.stage ? el.stage : '', { emitEvent: false, onlySelf: true });
            this.getSeedInventoYear(i)
            this.ngForm.controls['carry_over']['controls'][i].controls['year'].setValue(el && el.year ? el.year : '', { emitEvent: false, onlySelf: true });
            this.getSeedInventoSeason(i);
            this.ngForm.controls['carry_over']['controls'][i].controls['season'].setValue(el && el.season ? el.season : '', { emitEvent: false, onlySelf: true });
            this.getLotNo(i)
            this.ngForm.controls['carry_over']['controls'][i].controls['lot_no'].setValue(el && el.lot_no_id ? el.lot_no_id : '', { emitEvent: false, onlySelf: true });
            this.ngForm.controls['carry_over']['controls'][i].controls['lot_name'].setValue(el && el.lot_name ? el.lot_name : '', { emitEvent: false, onlySelf: true })
            this.getTagNo(i)
            this.ngForm.controls['carry_over']['controls'][i].controls['tag_no'].setValue(el && el.tag_no ? el.tag_no : '', { emitEvent: false, onlySelf: true });
            if (this.ngForm.controls['carry_over']['controls'][i].controls['tag_no'].value && this.ngForm.controls['carry_over']['controls'][i].controls['tag_no'].value.length > 1) {
              this.ngForm.controls['carry_over']['controls'][i]['controls'].enableqty_recieved.setValue(true)
            } else {
              this.ngForm.controls['carry_over']['controls'][i]['controls'].enableqty_recieved.setValue(false)
            }
            if (this.unit == 'Qt') {
              this.ngForm.controls['carry_over']['controls'][i].controls['qty_recieved'].setValue(el && el.qty_recieved ? (parseFloat(el.qty_recieved) / 100) : '', { emitEvent: false, onlySelf: true });
              this.ngForm.controls['carry_over']['controls'][i].controls['qty_available'].setValue(el && el.qty_available ? (parseFloat(el.qty_available) / 100) : '', { emitEvent: false, onlySelf: true });
            } else {
              this.ngForm.controls['carry_over']['controls'][i].controls['qty_recieved'].setValue(el && el.qty_recieved ? el.qty_recieved : '', { emitEvent: false, onlySelf: true });
              this.ngForm.controls['carry_over']['controls'][i].controls['qty_available'].setValue(el && el.qty_available ? el.qty_available : '', { emitEvent: false, onlySelf: true });
            }
            // this.ngForm.controls['carry_over']['controls'][i].controls['qty_recieved'].setValue(el && el.qty_recieved ? el.qty_recieved : '',{ emitEvent: false, onlySelf: true });
            // this.ngForm.controls['carry_over']['controls'][i].controls['qty_available'].setValue(el && el.qty_available ? el.qty_available : '',{ emitEvent: false, onlySelf: true });
            this.ngForm.controls['carry_over']['controls'][i].controls['tag_quantity'].setValue(el && el.tag_quantity ? el.tag_quantity : '', { emitEvent: false, onlySelf: true });
            this.ngForm.controls['carry_over']['controls'][i].controls['tag_number'].setValue(el && el.tag_number ? el.tag_number : '', { emitEvent: false, onlySelf: true });
            this.ngForm.controls['carry_over']['controls'][i].controls['tag_id'].setValue(el && el.tag_id ? el.tag_id : '', { emitEvent: false, onlySelf: true });
            this.ngForm.controls['carry_over']['controls'][i].controls['stage'].setValue(el && el.stage ? el.stage : '', { emitEvent: false, onlySelf: true });
            this.ngForm.controls['carry_over']['controls'][i].controls['stage'].setValue(el && el.stage ? el.stage : '', { emitEvent: false, onlySelf: true });
          })
        }

      }
    })


    // this.showparental=true
  }
  delete(id: number, meet_target) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let UserId = datas.id
    Swal.fire({
      toast: false,
      icon: "warning",
      title: "Are You Sure?",
      text: "You won't be able to revert this!",
      position: "center",
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonColor: "#DD6B55",
      confirmButtonText: "Yes Delete it!",
      cancelButtonText: "Cancel",

    }).then(result => {
      let response;
      let bspcId = []

      if (result.isConfirmed) {

        const param = {
          user_id: UserId,
          bspc_2_id: id,
          meet_target: meet_target
        }

        this.productionService
          .postRequestCreator("delete-carry-data", param)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              Swal.fire({
                title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
                icon: 'success',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#E97E15'
              }).then(x => {
                this.getBsp2List();
                this.getVarietyDetails()
                this.showVarietyDetails = false;
                let param = this.ngForm.value ? this.ngForm.value : '';
                this.ngForm.controls['variety'].setValue('')
                this.selectVariety = ''
                this.ngForm.controls['variety_line_code'].setValue('')
                this.selectParental = '';
                this.firstPageCancel();

              })
              // this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });


      }
    })
  }
  getClassQuantity() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    let param;
    param = {
      search: {
        // year: this.ngForm.controls['year'].value,
        // season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_line_code: this.ngForm.controls['variety_line_code'].value,
        user_id: UserId ? UserId.toString() : '',
        variety_code: this.ngForm.controls['variety'].value ? this.ngForm.controls['variety'].value : '',
        // exclude_bsp2_id: this.editId ? (this.editId.toString()) : ''
      }
    }

    this.productionService.postRequestCreator('get-class-quantity', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      if (this.unit == 'Qt') {
        this.ngForm.controls['qty_of_nucleus_seed'].setValue(response && response.nucleusData && response.nucleusData[0] && response.nucleusData[0].quantity ? (response.nucleusData[0].quantity / 100) : '0');
        this.ngForm.controls['qty_of_breeeder_seed'].setValue(response && response.nucleusData && response.breederData[0] && response.breederData[0].quantity ? (response.breederData[0].quantity / 100) : '0');
      } else {
        this.ngForm.controls['qty_of_nucleus_seed'].setValue(response && response.nucleusData && response.nucleusData[0] && response.nucleusData[0].quantity ? response.nucleusData[0].quantity : '0');
        this.ngForm.controls['qty_of_breeeder_seed'].setValue(response && response.nucleusData && response.breederData[0] && response.breederData[0].quantity ? response.breederData[0].quantity : '0');
      }
      let permission;
      permission = response && response.permisionData && response.permisionData[0] ? response.permisionData[0] : ''
      if (!permission || (permission && permission && permission.isPermission == null)) {
        this.ngForm.controls['permission_of_production'].setValue('NA')
      }
      else {
        if (this.ngForm.controls['qty_of_breeeder_seed'].value != 0) {
          this.ngForm.controls['permission_of_production'].setValue(permission.isPermission == true ? 'Yes' : 'No');
        } else {
          this.ngForm.controls['permission_of_production'].setValue('NA');
        }
      }
      if (parseFloat(this.ngForm.controls['qty_of_breeeder_seed'].value) <= 0) {
        this.classOfSeed = [
        ]
      } else {
        this.classOfSeed = [
          {
            class_type: 'Breeder Seed',
            id: 7
          }
        ]
      }
    })
  }
  finalizeData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    let bspcId = []
    if (this.dummyData && this.dummyData.length > 0) {
      for (let data of this.dummyData) {
        bspcId.push(data && data.id ? data.id : '')

      }
    }
    let param = {
      user_id: UserId,
      bspc_2_ids: bspcId && (bspcId.length > 0) ? bspcId : '',
      // referenceNumber:this.referenceNumber ? this.referenceNumber :''
    }
    Swal.fire({
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes,Submit it!",
      cancelButtonText: "Cancel",
      icon: "warning",
      title: "Are You Sure?",
      text: "You won't be able to Edit this!",
      position: "center",
      cancelButtonColor: "#DD6B55",
    }).then(x => {
      if (x.isConfirmed) {
        this.productionService.postRequestCreator('freeze-data-carry-over', param).subscribe(apiResponse => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Submited Successfully.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            }).then(x => {
              this.getBsp2List();

              if (this.Variety.length < 1) {
                this.ngForm.controls['variety'].setValue('');
                this.ngForm.controls['variety_line_code'].setValue('');
                this.selectParental = '';
                this.selectVariety = '';
                this.editDataValue = false;

              }
            })

            // this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
          } else {
            Swal.fire({
              title: '<p style="font-size:25px;">Something Went Wrong.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            })
          }
        })
      }

    })
  }
  convertToQty(item) {
    if (this.unit == 'Qt') {
      if (item) {
        return item ? item / 100 : 0
      } else {
        return 'NA'
      }
    } else {
      return item
    }
  }
  productionTypeValue(value) {
    if (value) {
      this.productionType = value;
      if (this.productionType == "NORMAL") {
        this.isDisableNormal = false;
        this.isDisableDelay = true;
        this.isDisableNormalReallocate = true;
      } else if (this.productionType == "DELAY") {
        this.isDisableNormal = true;
        this.isDisableDelay = false;
        this.isDisableNormalReallocate = true;
      } else if (this.productionType == "REALLOCATION") {
        this.isDisableNormal = true;
        this.isDisableDelay = true;
        this.isDisableNormalReallocate = false;
      }
      else {
        // this.isDisableNormal= false;
        // this.isDisableDelay= false;
        // this.isDisableNormalReallocate= true;
      }
    }
    this.getYear();
  }
  resetRadioBtn() {
    window.location.reload();
    this.productionType = ""
  }
}     
