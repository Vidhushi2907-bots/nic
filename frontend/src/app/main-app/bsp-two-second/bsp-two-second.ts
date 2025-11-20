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
// import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
@Component({
  selector: 'app-bsp-two-second',
  templateUrl: './bsp-two-second.html',
  styleUrls: ['./bsp-two-second.css'],
  encapsulation: ViewEncapsulation.None
})

export class BspTwoSecondtComponent implements OnInit {
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
  editId: any;
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
  productionType: any;
  isDisableDelay: boolean;
  isDisableNormalReallocate: boolean;
  isDisableNormal: boolean;
  response1: any;
  VarietyList1: any;
  editShowData11: boolean;

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
  tittle = 'Production Schedule and Availability of Breeder Seed (BSP-II)'
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
  lotNolist = [];
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
      permission_of_production: [''],
      StageFix: [false],
      bsp2Arr: this.fb.array([
        this.bsp2arr(),
      ]),



    })
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isSearch = false;
        // new condition here
        this.showetailsPage = false
        this.editDataValue = false
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
        // new condition here
        this.showetailsPage = false
        this.editDataValue = false

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
        // new condition here
        this.showetailsPage = false
        this.editDataValue = false
        this.isSearch = false
        this.ngForm.controls['variety_line_code'].setValue('', { emitEvent: false, onlySelf: true });
        this.ngForm.controls['variety'].setValue('', { emitEvent: false, onlySelf: true })
        this.selectVariety = '';
        this.getVarietyDetails()
        this.getVarietyDetailsData()
        this.showDetsails = true;
        this.showparental = false;
        this.showVarietyDetails = false;
        this.selectParental = ''
        this.getUnit(newValue)
        this.getUnits(newValue)
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
        this.getTypeofSeed()
        this.getVarietyDetailsSecond()
        const FormArrays = this.ngForm.get('bsp2Arr') as FormArray;
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['state'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['district'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['address'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['area_shown'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['date_of_showing'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_ns_shown'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_bs_shown'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_inspection'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_harvest'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_production'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['class_of_seed_v2'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['qty_seed_sown'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['permission_of_production'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][0].controls['stageFix'].setValue(1);
        const controlToKeeps = FormArrays.at(0);
        FormArrays.clear();
        FormArrays.push(controlToKeeps);
        let param = this.ngForm.value ? this.ngForm.value : ''
        let bsp2Arr = param && param.bsp2Arr ? param.bsp2Arr : '';
        if (bsp2Arr && bsp2Arr.length > 0) {
          bsp2Arr.forEach((el, i) => {

            el.total_quantity.forEach((item, index) => {

              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.stage.setValue('');
              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.type_of_class.setValue('');
              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.year_of_indent.setValue('');
              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.season.setValue('')
              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.lot_no.setValue('');
              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.tag_no.setValue('');
              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.quantity_available.setValue('');
              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.quantity_sown.setValue('');
              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.variety_line_code.setValue('');
              this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_harvest'].setValue('');
              this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_production'].setValue('');
              // this.ngForm.controls['total_breederseed'].setValue('');
              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_breederseed'].setValue('')
              // this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].setValue('');

            })
          })
        }
        if (bsp2Arr && bsp2Arr.length > 0) {
          bsp2Arr.forEach((el, i) => {
            el.total_quantity.forEach((item, index) => {
              while (this.getNestedFormArray(i).controls.length != 1) {
                this.removeEmployeeSkillSecond(i, index)
              }
            })
          })
        }
      }
    })

    this.ngForm.controls['variety_line_code'].valueChanges.subscribe(newValue => {
      this.getVarietyDetailsSecond();
      this.getTypeofSeed();
      const FormArrays = this.ngForm.get('bsp2Arr') as FormArray;
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['state'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['district'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['address'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['area_shown'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['date_of_showing'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_ns_shown'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_bs_shown'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_inspection'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_harvest'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_production'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_breederseed'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['type_of_class'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['class_of_seed_v2'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['qty_seed_sown'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['permission_of_production'].setValue('');
      this.ngForm.controls['bsp2Arr']['controls'][0].controls['stageFix'].setValue(1);
      const controlToKeeps = FormArrays.at(0);
      FormArrays.clear();
      FormArrays.push(controlToKeeps);
      let param = this.ngForm.value ? this.ngForm.value : ''
      let bsp2Arr = param && param.bsp2Arr ? param.bsp2Arr : '';
      if (bsp2Arr && bsp2Arr.length > 0) {
        bsp2Arr.forEach((el, i) => {

          el.total_quantity.forEach((item, index) => {

            this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.stage.setValue('');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.year_of_indent.setValue('');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.season.setValue('')
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.lot_no.setValue('');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.tag_no.setValue('');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.quantity_available.setValue('');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.quantity_sown.setValue('');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.quantity_sown.setValue('');
            this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_harvest'].setValue('');
            this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_production'].setValue('');
            // this.ngForm.controls['total_breederseed'].setValue('');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_breederseed'].setValue('')
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_breederseed_v2'].setValue('');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].setValue('');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.variety_line_code.setValue('');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.type_of_class.setValue('');
            // this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].setValue('');

          })
        })
      }
      if (bsp2Arr && bsp2Arr.length > 0) {
        bsp2Arr.forEach((el, i) => {
          el.total_quantity.forEach((item, index) => {
            while (this.getNestedFormArray(i).controls.length != 1) {
              this.removeEmployeeSkillSecond(i, index)
            }
          })
        })
      }
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
    this.fetchData();
    // this.getTypeofSeed();


    this.bsp2Data = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : ''



  }

  get nestedArrays2() {
    return this.ngForm.get("bsp2Arr.total_quantity") as FormArray;
  }
  fetchData() {
    // this.getPageData();
    // this.getYear();
    this.getStatelist();
    this.getUserData(null);
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
    // this.ngForm.controls['bsp2Arr']['controls'][0].controls.total_quantity.controls.push(
    //   new FormGroup({

    //     types_of_seed: new FormControl('', ),
    //     stage: new FormControl('', ),
    //     types_of_seeds1: new FormControl('',),
    //     year_of_indent: new FormControl('', ),
    //     season: new FormControl('', ),
    //     types_of_lot_nolot_noseed: new FormControl('', ),
    //     tag_no: new FormControl('', ),            
    //     quantity_available: new FormControl('', ),
    //     quantity_sown: new FormControl('', ),
    //     lot_no:new FormControl('', ),
    //     showstatus: new FormControl(true),
    //     showQtyFielddisable: new FormControl(false),

    //   }))
    //     //  total_quantity: this.fb.array([
    //         //  this.totalQuantity(),
    //     //    ]),
    // )
    // this.ngForm.controls['bsp2Arr']['controls'][0].controls.total_quantity=[]
    // this.ngForm.controls['bsp2Arr']['controls'][0].controls.push({
    //     total_quantity: this.fb.array([
    //          this.totalQuantity(),
    //        ]),

    //   })



  }
  getNestedFormArray(index: number): FormArray {
    return this.nestedArrays.at(index).get('total_quantity') as FormArray;
  }

  get nestedArrays() {
    return this.ngForm.get('bsp2Arr') as FormArray;
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
            // confirmButton:false
          })
          event.singleDate.formatted = ''
        }
      } else if (new Date(expected_date_harvest) <= new Date(InspectionDate2)) {
        Swal.fire({
          title: '<p style="font-size:25px;">Expected date of harvesting" should be later than start date of "Expected date of inspection.</p>',
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: true,
          // timer: 5000
          // confirmButton:false
        })
        event.singleDate.formatted = ''
      }

      // if (param && param.length > 0) {
      //   param.forEach((el, index) => {
      //     if (el.date_of_showing && el.date_of_showing.singleDate && el.date_of_showing.singleDate.formatted && el.date_of_showing.singleDate.formatted != '') {
      //      let InspectionDatas=event && el.date_of_showing && el.date_of_showing.singleDate && el.date_of_showing.singleDate.formatted ? el.date_of_showing.singleDate.formatted:'';
      //      InspectionDatas=InspectionDatas[0]
      //      let dateodShow = this.convertDates(el.date_of_showing.singleDate.formatted)
      //      let Inspection= this.convertDates(InspectionDatas)

      //       if (new Date(dateodShow) > (new Date(Inspection))) {
      //         Swal.fire({
      //           title: '<p style="font-size:25px;">Expected Inspection Date Can be  less than Date of Sowning.</p>',
      //           icon: 'error',
      //           showCancelButton: false,
      //           showConfirmButton: false,
      //           timer: 2000
      //           // confirmButton:false
      //         })
      //         // return;

      //       }
      //       else{
      //         // event.singleDate.formatted = `${event.singleDate.formatted}-${newDate}`
      //       }
      //     }else{
      //       // event.singleDate.formatted = `${event.singleDate.formatted}-${newDate}`
      //     }
      //   })
      // }else{
      //   // event.singleDate.formatted = `${event.singleDate.formatted}-${newDate}`
      // }
    }
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
  onDateChangedharvesting(event: any, i) {
    const endDate = event && event.singleDate && event.singleDate.jsDate ? event.singleDate.jsDate : '';
    if (endDate) {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      const date = new Date(endDate);
      date.setDate(date.getDate() + 15);
      let newDate = [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('/');

      event.singleDate.formatted = `${event.singleDate.formatted}-${newDate}`
      let param = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';
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
        if (new Date(dateofShowing) >= (new Date(InspectionDate))) {
          Swal.fire({
            title: '<p style="font-size:25px;">Expected date of harvesting should be later than start date of Expected date of inspection.</p>',
            icon: 'error',
            showCancelButton: false,
            showConfirmButton: true,
            // timer: 5000ee
            // confirmButton:false
          })
          event.singleDate.formatted = ''
        }
      }
      // if(new Date(dateofShowing)>)
      // event = `${event}-${newDate}`

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
      pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      // pageSize: 100,
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
      area_shown: ['', [Validators.required]],
      date_of_showing: ['',],
      quantity_of_sowning: ['',],
      quantity_of_ns_shown: [''],
      quantity_of_bs_shown: ['',],
      state: ['', [Validators.required]],
      stateData_text: [''],
      disttrictData_text: [''],
      district: ['', [Validators.required]],
      address: ['',],
      quantity_of_breedersown: [''],
      expected_date_inspection: ['',],
      expected_date_harvest: ['',],
      expected_production: ['',],
      showstatus: [true],
      type_of_class: [''],
      showDisableDate: [false],
      type_of_class_v2: [''],
      variety_line_code: [''],
      showDisableInspectionDate: [false],
      total_breederseed: [''],
      total_breederseed_v2: [''],
      class_of_seed_v2: [''],
      qty_seed_sown: [''],
      permission_of_production: [''],
      stageFix: [1],
      total_quantity: new FormArray([
        this.totalQuantity(),
      ]),
    });
    return temp;
  }

  bsp2Arrseedsowndetails() {
    let temp = this.fb.group({
      types_of_seed: [''],
      stage: [''],
      types_of_seeds1: [''],
      year_of_indent: [''],
      season: [''],
      lot_no: [''],
      tag_no: [''],
      quantity_available: [''],
      empindex: [],
      quantity_sown: [''],
      showstatus: [true],
      showQtyFielddisable: [false]
    });
    return temp;
  }
  totalQuantity() {
    let temp = this.fb.group({
      types_of_seed: ['',],
      stage: ['',],
      types_of_seeds1: [''],
      year_of_indent: ['',],
      season: ['',],
      lot_no: ['',],
      tag_no: ['',],
      quantity_available: ['',],
      quantity_sown: ['',],
      tag_quantity: [''],
      lot_num_data: [''],
      tag_id: [''],
      showstatus: [true],
      quantity_available_second: [''],
      quantity_sown_second: ['',],
      variety_line_code: [''],
      line_variety_code: [''],
      tag_quantitys_2: [''],
      quantity_sown_value: [''],
      quantity_sown_v2: [''],
      quantity_available_v2: [''],
      lot_num_data_v2: [''],
      bag_size: [''],
      type_of_class: [''],
      quantity_sownvalueChange: [true],
      showQtyFielddisable: [false]
    });
    return temp;
  }

  employeeSkills(empIndex) {
    empIndex = empIndex ? empIndex : 0

    return this.employees()
      .at(empIndex)
      .get('total_quantity') as FormArray;
  }
  getItems(form) {
    return form.controls.bsp2Arr.controls;
  }
  getbsp2SeedDetailsItems(form) {
    return form.controls.bsp2Arrseedsowndetails.controls;
  }
  removeEmployeeSkill(empIndex: number, skillIndex: number) {

    this.employeeSkills(empIndex).removeAt(skillIndex);
    let datas = this.ngForm.value && this.ngForm.value.bsp2Arr && this.ngForm.value.bsp2Arr[this.employeeIndex] && this.ngForm.value.bsp2Arr[this.employeeIndex].total_quantity ? this.ngForm.value.bsp2Arr[this.employeeIndex].total_quantity : '';
    let sumdatas = 0
    if (datas && datas.length > 0) {
      datas.forEach((el, i) => {
        sumdatas += el && el.quantity_sown ? parseFloat(el.quantity_sown) : 0
      })
    }
    this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['total_breederseed'].setValue(sumdatas ? sumdatas : 0)
    // this.ngForm.controls['total_breederseed'].setValue(sumdatas ? sumdatas : 0);

  }
  removeEmployeeSkillSecond(empIndex: number, skillIndex: number) {

    let param = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : ''

    // this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_sown.setValue(sum);
    // this.ngForm.controls['total_breederseed'].setValue(sumdatas ? sumdatas : 0);
    this.employeeSkills(empIndex).removeAt(skillIndex);
  }
  addMoreSeedDetails(i, index) {
    console.log(i,index);
    this.showLot = true
    this.lotDatalength += 1
    this.count += 1
    this.showPageDeatails = true;
    this.employeeSkills(i).push(this.totalQuantity())
    this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.showstatus.setValue(false)
    // console.log('tag_no===', this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.tag_no.value.length);
    // console.log('tag length', this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.tag_no.tagNo.length)
    // if (this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.tag_no.value.length == this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.tag_no.tagNo.length) {
    //   this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.lot_no = []
    //   // this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.lot_no.lotlist.setValue('')
    // }

  }
  addMoreSeedDetailsSecond(i) {


    this.employeeSkills(i).push(this.totalQuantity())
  }

  addMore(i) {

    this.ngForm.controls['bsp2Arr']['controls'][i].controls['showstatus'].setValue(false);
    this.employees().push(this.bsp2arr());

  }

  remove(rowIndex: number) {
    if (this.employees().controls.length > 1) {
      this.employees().removeAt(rowIndex);
    } else {
      this.removeData()
    }
  }

  getFilteredOptions(index: number, skillIndex) {
    // ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[skillIndex].controls.lot_no.lotlist


    // ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[skillIndex].controls.tag_no.tagNo

    // Get all selected bspc_ids as integers, except for the current dropdown
    // const selectedIds = this.reallocate.controls
    const selectedIds = this.getNestedFormArray(index).controls
      .map((control, idx) => idx !== index ? parseInt(control.get('lot_no')?.value, 10) : null)
      .filter(id => id !== null);

    // Return BSPC options that are not selected in other dropdowns
    return this.ngForm.controls['bsp2Arr']['controls'][index].controls.total_quantity.controls[skillIndex].controls.lot_no.lotlist.filter(option => !selectedIds.includes(option.lot_no));
  }
  get itemsArray() {
    return <FormArray>this.ngForm.get('bsp2Arr');
  }
  get itemsArraySeedDetails() {
    return <FormArray>this.ngForm.get('bsp2Arrseedsowndetails');
  }

  save(data) {

  }
  get items(): FormArray {
    return this.ngForm.get('bsp2Arr') as FormArray;
  }
  employees() {
    return this.ngForm.get('bsp2Arr') as FormArray;
  }
  employees2() {
    return this.ngForm.get('bsp2Arrseedsowndetails') as FormArray;
  }
  getYear() {
    this.productionService.postRequestCreator('get-bsp-two-performa-year-data', { search: { "production_type": this.productionType } }, null).subscribe(data => {
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
    this.productionService.postRequestCreator('get-bsp-two-performa-season-data', param).subscribe(data => {
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
    this.productionService.postRequestCreator('get-bsp-two-performa-crop-data', param).subscribe(data => {
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
    console.log('ngForm.controls["variety"].value:', this.ngForm.controls['variety'].value);
    console.log('showFirstDetailsPage:', this.showFirstDetailsPage);
console.log('showVarietyDetails:', this.showVarietyDetails);
console.log('VarietyList1.length > 0:', this.VarietyList1.length > 0);
console.log('showparental:', this.showparental); 
console.log('ngForm.controls["variety_line_code"].value:', this.ngForm.controls['variety_line_code'].value);
console.log('editDataValue && showparental:', this.editDataValue && this.showparental);
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
    this.ngForm.controls['bsp2Arr']['controls'][index].controls['state'].setValue(data);
    // this.ngForm.controls['bsp2Arr']['controls'][index].controls['stateData_text'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][index].controls['district'].setValue('');
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
      const myFormArray = this.ngForm.get('bsp2Arr') as FormArray;

      if (myFormArray && myFormArray.controls && myFormArray.controls[i] && myFormArray.controls[i]['controls'] && myFormArray.controls[i]['controls'].district) {
        this.ngForm.controls['bsp2Arr']['controls'][i]['controls'].district.districtlist = this.districtList;
      }
      this.districtListsecond = this.districtList

    })
  }
  selectdistrict(data, index, $event) {
    // this.changepositions = false
    this.ngForm.controls['bsp2Arr']['controls'][index].controls['district'].setValue(data);
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

  showDetsailsPage(index) {
    this.tittle = 'Record Quantity of Nucleus Seed or Breeder Seed Sown'
    this.showDetsail = true;
    this.showetailsPage = true
    this.showSecondCard = true;
    this.showetailsPage = true;
    this.showFirstDetailsPage = false;
    this.disableField = true;
    // this.showlotpage=false
    this.employeeIndex = index;
    // this.showlotpage = true
    // this.employees().pus
    // this.employees().pop();
    this.editDataValue = false;
    this.showLot = false;
    this.responseData = this.ngForm.value;
    if (!this.is_update) {
      // this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].setValue('')
      // this.getTypeofSeed()

    }

    // if (!this.is_update) {
    //   // this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].setValue('')
    //   this.getTypeofSeed()
    // }
    // if (!this.ngForm.controls['bsp2Arr']['controls'][index].controls['type_of_class'].value) {
    //   this.showlotpage = false;
    // }
    let value = this.ngForm.controls['bsp2Arr']['controls'][index].controls['stageFix'].value;
    this.ngForm.controls['bsp2Arr']['controls'][index].controls['stageFix'].setValue(value + 1)
    if (this.showparental) {
      this.showlotpage = true;
      if (!this.is_update && !this.ngForm.controls['bsp2Arr']['controls'][index].controls.total_quantity.controls[0].controls.variety_line_code.value) {
        this.getList();
      }
    } else {
      this.showlotpage = false;
      // this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].setValue((this.ngForm.value['bsp2Arr'][this.employeeIndex].type_of_class.toString()))
      if (this.ngForm.controls['bsp2Arr']['controls'][index].controls['type_of_class'].value) {
        this.getList();
      }
    }
    const FormArray = this.ngForm.get('bsp2Arr') as FormArray;
    // FormArray.clear()
    // e
    // this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].setValue
    this.lotDatalength = this.responseData && this.responseData.bsp2Arr && this.responseData.bsp2Arr[index] && this.responseData.bsp2Arr[index].total_quantity && this.responseData.bsp2Arr[index].total_quantity.length ? this.responseData.bsp2Arr[index].total_quantity.length : 1;
    this.isSearch = false
    const myFormArray = this.ngForm.get('bsp2Arr') as FormArray;
    let controlKeeps = [];
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);
    let param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_line_code: this.ngForm.controls['variety_line_code'].value,
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        variety_code: this.ngForm.controls['variety'].value ? this.ngForm.controls['variety'].value : '',
        // exclude_bsp2_id: this.editId ? (this.editId.toString()) : ''
      }
    }
    this.productionService.postRequestCreator('get-class-quantity', param).subscribe(data => {
      let responseList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      let permission;
      permission = responseList && responseList.permisionData ? responseList.permisionData[0] : '';
      if (responseList && responseList.length < 1 || (permission && permission.isPermission == null) || !permission) {
        this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['permission_of_production'].setValue('NA')
      }
      else {
        this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['permission_of_production'].setValue(permission.isPermission == true ? 'Yes' : 'No');
      }
    }
    )


  }
  showDetsailsPageSecond(index) {
    this.tittle = 'Record Quantity of Nucleus Seed or Breeder Seed Sown'
    this.showetailsPage = true
    this.employeeIndex = index;
    this.showFirstDetailsPage = false;
    this.editDataValue = false;
    //  this.showVarietyDetails=false
  }

  getData(item) {

  }
  get myArray() {
    return this.ngForm.get('bsp2Arr') as FormArray;
  }
  removeEmptyOrNull() {
    // if(this.responseData && this.responseData.length>1){

    for (let i = this.myArray.length - 1; i >= 0; i--) {
      const control = this.myArray.at(i);
      if (control.value === '' || control.value === null) {
        this.myArray.removeAt(i);
      }
    }
    // }
  }

  addEmployeeSkill(empIndex: number) {
    this.employeeSkills(empIndex).push(this.totalQuantity());
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
  getValue(index, skillIndex) {
    const formArray = this.ngForm.get('bsp2Arr') as FormArray;
    //         // if(formArray.controls[n]['controls'].total_quantity.controls[j].controls &&formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no && formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo){
    //         if (formArray.controls[n]['controls'].total_quantity.controls[j].controls.tag_no && formArray.controls[n]['controls'].total_quantity.controls[j].controls.tag_no.tagNo) {
    //           // formArray.controls[n]['controls'].total_quantity.controls[j].controls.tag_no.tagNo.push(...item.tag_no)
    //           // formArray.controls[n]['controls'].total_quantity.controls[j].controls.tag_no.tagNo = formArray.controls[n]['controls'].total_quantity.controls[j].controls.tag_no.tagNo.filter((arr, index, self) =>
    //           //   index === self.findIndex((t) => (t.value === arr.value)))
    //           // if (formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo && formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo.length > 0) {
    //           //   formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo =
    //           //     formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo.sort((a, b) => {
    //           //       // Extract numeric and non-numeric parts
    //           //       const regex = /([^\d]+)|(\d+)/g;
    //           //       const aParts = a.value.match(regex);
    //           //       const bParts = b.value.match(regex);

    //           //       // Compare each part
    //           //       for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    //           //         const aPart = parseInt(aParts[i]) || aParts[i];
    //           //         const bPart = parseInt(bParts[i]) || bParts[i];

    //           //         if (aPart < bPart) {
    //           //           return -1;
    //           //         } else if (aPart > bPart) {
    //           //           return 1;
    //           //         }
    //           //       }

    //           //       return 0; // If all parts are equal
    //           //     });
    //           // }
    //         }
    //         // }

    //       })
    //     }
    //   })
    // }

    let data = this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.tag_no && this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.tag_no.value ? this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.tag_no.value : '';

    // if (skillIndex > 0) {
    //   if (this.ngForm.controls['bsp2Arr']['controls'][index].controls.total_quantity.controls[skillIndex - 1].controls.tag_no && this.ngForm.controls['bsp2Arr']['controls'][index].controls.total_quantity.controls[skillIndex - 1].controls.tag_no.tagNo) {
    //     if (this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls && this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.tag_no && this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.tag_no.value) {
    //       this.ngForm.controls['bsp2Arr']['controls'][index].controls.total_quantity.controls[skillIndex - 1].controls.tag_no.tagNo = this.ngForm.controls['bsp2Arr']['controls'][index].controls.total_quantity.controls[skillIndex - 1].controls.tag_no.tagNo.filter(item2 => !this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.tag_no.value.some(item1 => item1.value === item2.value));
    //     }
    //   }
    // }
    // if (this.bsp2Arrlist && this.bsp2Arrlist.length > 0) {
    //   this.bsp2Arrlist.forEach((el, n) => {
    //     if (el.quantity_data && el.quantity_data.length > 0) {
    //       el.quantity_data.forEach((item, j) => {
    //         if( formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no && formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo){
    //           formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo = formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo.map(obj1 => {
    //             const matchingObj2 = this.bspProforma2SeedData.find(obj2 => obj1.value == obj2.tag_range);

    //             if (matchingObj2) {
    //               return {
    //                 ...obj1,
    //                 quantity_remaining: parseInt(matchingObj2.quantity_sown),
    //                 tag_id: matchingObj2.tag_id,
    //                 lot_id: matchingObj2.lot_id,
    //                 // seed_inventry_tag_id:matchingObj2
    //                 quantity_used: 0 // You can update this as needed
    //               };
    //             } else {
    //               return obj1;
    //             }
    //           });
    //         }
    //       })
    //     }
    //   })
    // }
    // const commonObjects = filterCommonObjects(this.ngForm.controls['bsp2Arr']['controls'][index].controls.total_quantity.controls[skillIndex].controls.tag_no.tagNo, data);

    let tagId = []
    let idsInArray2;
    if (data && data.length > 0) {

      idsInArray2 = data.map(obj => obj.display_text);
    }
    let filteredArray
    if (idsInArray2 && idsInArray2.length > 0) {

      filteredArray = this.ngForm.controls['bsp2Arr']['controls'][index].controls.total_quantity.controls[skillIndex].controls.tag_no.tagNo.filter(item => idsInArray2.includes(item.display_text));
    }
    //     function filterCommonObjects(array1, array2) {

    //       // return filteredArray 
    //       // return array1.filter(obj => idsInArray2.includes(obj.display_text));
    if (filteredArray && filteredArray.length > 0) {
      //         // let commonObjects2 = filterCommonObjects(this.ngForm.controls['bsp2Arr']['controls'][index].controls.total_quantity.controls[skillIndex].controls.tag_no.tagNo, data);
      filteredArray.forEach((el, i) => {
        tagId.push(el && el.tag_id ? el.tag_id : '')
      })
    }



    // }
    // }
    this.ngForm.controls['bsp2Arr']['controls'][index].controls.total_quantity.controls[skillIndex].controls.tag_id.setValue(tagId ? tagId : '')

    // let tags=this.ngForm.controls['bsp2Arr']['controls'][index].controls.total_quantity.controls[skillIndex].controls.tag_no.tagNo.filter(item=>item.value==)
    if (data && data.length > 0) {
      let valueArr = []
      data.forEach(el => {
        valueArr.push(el && el.value ? el.value : '')


      })
      this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_sownvalueChange.setValue(false)
      // quantity_sownvalueChange
      let arr
      arr = this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.tag_no.tagNo
      // if (this.is_update) {
      //   const formArray = this.ngForm.get('bsp2Arr') as FormArray;
      //   if (this.bsp2Arrlist && this.bsp2Arrlist.length > 0) {

      //     let quantity_data = this.bsp2Arrlist && this.bsp2Arrlist[0] && this.bsp2Arrlist[0].quantity_data ? this.bsp2Arrlist[0].quantity_data : '';
      //     quantity_data.forEach(item => {

      //       // Splitting quantities and tag IDs by ","
      //       if (item && item.tag_no && item.tag_no.length >= 2) {
      //         const quantities = item.tag_quantity.split(',');
      //         const tagIDs = item.tag_id.split(',');
      //         item.tag_no.forEach((tag, index) => {
      //           tag.tag_id = tagIDs[index];
      //           tag.quantity = quantities && quantities[index] ? parseFloat(quantities[index]) : '0'
      //           tag.quantity_remaining = quantities && quantities[index] ? parseFloat(quantities[index]) : '0'
      //           tag.tag_number = tag.value;
      //         });
      //       } else {
      //         let indexes = 0;
      //         arr.forEach((el, i, j) => {
      //           el.quantity_remaining = el && el.quantity ? (el.quantity) : '0';
      //           el.quantity_used = el && el.quantity ? (el.quantity) : '0'


      //         })

      //       }


      //     });

      //   }

      // }

      if (data.length >= 2) {
        this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.showQtyFielddisable.setValue(true)
      } else {
        this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.showQtyFielddisable.setValue(false)
      }



      let arrs = [];
      let filteredArray = arr.filter(obj1 =>
        valueArr.some(obj2 => obj1.value == obj2)
      );
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

      let datasValue = [];
      let datasValues = [];
      if (filteredArray && filteredArray.length > 0) {
        let sum = 0;
        filteredArray.forEach(el => {
          sum += el && el.quantity_remaining ? parseFloat(el.quantity_remaining) : 0;
          if (this.unit == 'Qt') {
            datasValue.push(el && el.quantity_remaining ? (parseFloat(el.quantity_remaining)) : 0);
          } else {
            datasValue.push(el && el.quantity_remaining ? (parseFloat(el.quantity_remaining)) : 0);
          }
          datasValues.push(el && el.quantity_remaining ? (parseFloat(el.quantity_remaining)) : 0);
        }
        )
        if (this.aggregatedJSON && this.aggregatedJSON.length > 0) {
          let diff = 0
          this.aggregatedJSON.forEach((el, index) => {
            diff = el.quantity_available - el.sumQuantitySown
          })
          filteredArray.forEach((el, i) => {
            this.aggregatedJSON.forEach((item, index) => {
              if (el.tag_number == item.tagNoToString) {
                if (this.units == 'Qt') {
                  el.quantity_remaining = item && item.sumQuantitySown && item.quantity_available && (item.sumQuantitySown) ? (((parseFloat(item.quantity_available) * 100) - (parseFloat(item.sumQuantitySown) * 100))) : 0;

                } else {
                  el.quantity_remaining = item && item.sumQuantitySown && item.quantity_available && (item.sumQuantitySown) ? ((item.quantity_available - item.sumQuantitySown)) : 0;
                }
              }
            })
          })

          // this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_sown.setValue(diff);
        }



        // this.totalQty=data;
        this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.tag_quantity.setValue(datasValue);
        this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.tag_quantitys_2.setValue(datasValues);
        let res = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';
        // this.ngForm.controls['total_breederseed'].setValue(sum ? sum :0)

        this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_sown_v2.setValue(sum);
        this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_available_v2.setValue(sum);
        if (this.units == 'Qt') {
          // if (this.aggregatedJSON && this.aggregatedJSON.length > 0) {

          //   this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_sown.setValue((sum));
          //   this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_available.setValue((sum));
          // }else{
          this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_sown.setValue((sum / 100).toFixed(2));
          this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_available.setValue((sum / 100).toFixed(2));
          // }
        } else {
          this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_sown_v2.setValue(sum ? this.fixed2digit(sum) : 0);
          this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_available_v2.setValue(sum ? this.fixed2digit(sum) : 0);

          this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_sown.setValue(sum ? this.fixed2digit(sum) : 0);
          this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_available.setValue(sum ? this.fixed2digit(sum) : 0);

        }

        this.quantitySownValue = this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_sown.value
        let datas = this.ngForm.value && this.ngForm.value.bsp2Arr && this.ngForm.value.bsp2Arr[this.employeeIndex] && this.ngForm.value.bsp2Arr[this.employeeIndex].total_quantity ? this.ngForm.value.bsp2Arr[this.employeeIndex].total_quantity : ''

        let sumdatas = 0
        if (datas && datas.length > 0) {
          datas.forEach((el, i) => {
            sumdatas += el && el.quantity_sown ? parseFloat(el.quantity_sown) : 0
          })
        }
        if (this.is_update) {
          this.employeeIndex = 0
        }
        if (this.units == 'Qt') {
          this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['total_breederseed'].setValue(sumdatas ? ((sumdatas).toFixed(2)) : 0);
          this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['total_breederseed_v2'].setValue(sumdatas ? ((sumdatas).toFixed(2)) : 0);
          // total_breederseed_v2
        } else {
          this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['total_breederseed_v2'].setValue(sumdatas ? ((sumdatas)) : 0);
          this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['total_breederseed'].setValue(sumdatas ? (sumdatas) : 0);
        }
      }

    }
    else {
      this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_sown.setValue(0)
      this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.quantity_available.setValue(0)
      // this.ngForm.controls['total_breederseed'].setValue(0);
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
    // let route = "get-carry-over-variety";
    let route = "get-bsp-proforma-1s-varieties-level-1";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        user_id: UserId ? UserId.toString() : '',
        production_type: this.productionType
      }

    }
    ''
    this.productionService.postRequestCreator(route, param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.response = response;
      this.Variety = response && response.varietyList ? response.varietyList : '';
      this.VarietySecond = this.Variety;
      this.VarietyList1 = this.Variety;
      this.VarietyList = this.Variety;
      // if (this.ngForm.controls['variety'].value) {
      //   this.varietyListDetails = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      // }

    })
  } 
  shouldDisplayVarietyDiv(): boolean {
    console.log('isSearch:', this.isSearch);
    console.log('Variety length:', this.VarietyList1.length);
    console.log('editDataValue:', this.editDataValue);
    return (this.isSearch && this.VarietyList1.length > 0) || this.editDataValue;
  }
  
  getVarietyDetailsData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    let route = "get-carry-over-variety";
    // let route = "get-bsp-proforma-1s-varieties-level-1";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        user_id: UserId ? UserId.toString() : '',
        production_type: this.productionType
      }

    }
    ''
    this.productionService.postRequestCreator(route, param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.response1 = response;
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
    // if (this.is_update) {

    // } else {
    //   param = {
    //     search: {
    //       year: this.ngForm.controls['year'].value,
    //       season: this.ngForm.controls['season'].value,
    //       crop_code: this.ngForm.controls['crop'].value,
    //       variety_line_code: this.ngForm.controls['variety_line_code'].value,
    //       user_id: UserId ? UserId.toString() : '',
    //       variety_code: this.ngForm.controls['variety'].value ? this.ngForm.controls['variety'].value : '',

    //     }

    //   }
    // }
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
      // this.Variety = response && response.varietyList ? response.varietyList : '';


    })
  }
  getLotNo(index, skillIndex) {
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);
    if (this.is_update) {
      this.employeeIndex = 0
    }
    let lotno = []
    let res = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : ''
    let result = res && res[index] && res[index].total_quantity ? res[index].total_quantity : ''



    if (res && res.length > 0) {
      res.forEach((item, i) => {
        item.total_quantity.forEach((el, index) => {

          if (el && el.tag_no && el.tag_no.length == 1) {
            if (el.quantity_available == el.quantity_sown) {
              el.tag_no.forEach((val => {
                lotno.push(val && val.value ? val.value : '');
              }))
            } else {

            }

          }
          else if (el && el.tag_no && el.tag_no.length > 1) {
            el.tag_no.forEach((val => {
              lotno.push(val && val.value ? val.value : '');
            }))
          }
        })
        // if (item && item.tag_no && item.tag_no.length > 0) {
        //   item.tag_no.forEach(val => {
        //     lotno.push(val && val.value ? val.value : '');
        //   })

        // }
      })
    }
    const param = {
      search: {
        seed_class_id: this.showparental ? this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.type_of_class.value : this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value,
        // seed_class_id: this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value,
        year: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.year_of_indent.value,
        season: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.season.value,
        // seed_class_id: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.types_of_seed.value,
        stage_id: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.stage.value,
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        // variety_line_code: this.ngForm.controls['variety_line_code'].value,
        line_variety_code: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.variety_line_code.value,
        lot_id: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.lot_no.value,
        exclude_tag_range: lotno && (lotno.length > 0) ? (lotno.toString()) : '',
      }
    }
    this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.tag_no.setValue('')
    // ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[skillIndex].controls.lot_no.lotlist
    this.productionService.postRequestCreator('get-lot-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      const formArray = this.ngForm.get('bsp2Arr') as FormArray;
      this.lotNolist.push(response)
      if (formArray && formArray.controls && formArray.controls[index] && formArray.controls[index]['controls']
        && formArray.controls[index]['controls'].total_quantity && formArray.controls[index]['controls'].total_quantity.controls
        && formArray.controls[index]['controls'].total_quantity.controls[skillIndex] && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls
        && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.lot_no

      ) {
        formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.lot_no.lotlist = response ? response : [];
      }
      // this.getValue(index,skillIndex)

      if (this.editDataValue) {
        if (this.bsp2Arrlist && this.bsp2Arrlist.length > 0) {
          this.bsp2Arrlist.forEach((el, n) => {
            if (el.quantity_data && el.quantity_data.length > 0) {
              el.quantity_data.forEach((item, j) => {
                if (formArray.controls[n]['controls'].total_quantity.controls[j].controls && formArray.controls[n]['controls'].total_quantity.controls[j].controls.lot_no && formArray.controls[n]['controls'].total_quantity.controls[j].controls.lot_no.lotlist) {
                  formArray.controls[n]['controls'].total_quantity.controls[j].controls.lot_no.lotlist.push({
                    value: item && item.lot_number ? item.lot_number : "",
                    display_text: item && item.lot_number ? item.lot_number : "",
                    lot_number: item && item.lot_number ? item.lot_number : "",
                    lot_id: item && item.lot_id ? item.lot_id : "",
                  })
                }
              })

              // formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.lot_no.lotlist = formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.lot_no.lotlist.filter((arr, index, self) =>
              //   index === self.findIndex((t) => (t.value == arr.value && t.lot_id == arr.lot_id)))
            }
          })
        }
      }
    })
    // this.productionService.postRequestCreator('',)
  }
  getTagNo(index, skillIndex) {
    let lotno = []
    let res = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : ''
    let result = res && res[index] && res[index].total_quantity ? res[index].total_quantity : ''



    if (res && res.length > 0) {
      res.forEach((item, i) => {
        item.total_quantity.forEach((el, index) => {

          if (el && el.tag_no && el.tag_no.length == 1) {
            if (el.quantity_available == el.quantity_sown) {
              el.tag_no.forEach((val => {
                lotno.push(val && val.value ? val.value : '');
              }))
            } else {

            }

          }
          else if (el && el.tag_no && el.tag_no.length > 1) {
            el.tag_no.forEach((val => {
              lotno.push(val && val.value ? val.value : '');
            }))
          }
        })
        // if (item && item.tag_no && item.tag_no.length > 0) {
        //   item.tag_no.forEach(val => {
        //     lotno.push(val && val.value ? val.value : '');
        //   })

        // }
      })
    }
    if (res && res.length > 0) {
      res.forEach((item, i) => {
        item.total_quantity.forEach((el, index) => {
          if (el && el.tag_no && el.tag_no.length == 1) {
            el.tagNoToString = el.tag_no[0].display_text;
          }

        })
      })

    }


    function calculateSumOfDuplicates(jsonData) {
      let sumMap = [];

      if (jsonData && jsonData.length > 0) {
        jsonData.forEach(item => {
          if (item && item.tagNoToString) {

            const key = `${item.lot_no}_${item.tagNoToString}`;

            if (!sumMap[key] && item.quantity_sown !== "") {
              sumMap[key] = { ...item };
              sumMap[key].sumQuantitySown = (parseFloat(item.quantity_sown));
            } else if (sumMap[key] && item.quantity_sown !== "") {
              sumMap[key].sumQuantitySown += (parseFloat(item.quantity_sown));
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
        if (el.sumQuantitySown == el.quantity_available) {
          // lotno.push(ele)
          el.tag_no.forEach((val => {
            lotno.push(val && val.value ? val.value : '');
          }))
        }
      })
    }
    // let aggregatedJSON = calculateSumOfDuplicates(jsonData);
    // result.forEach((el, i) => {
    //   if (el && el.total_quantity.length > 0) {
    //     el.total_quantity.forEach((item, index) => {
    //       if (item && item.tag_no && item.tag_no.length > 0) {
    //         item.tag_no.forEach(val => {
    //           lotno.push(val && val.value ? val.value : '');
    //         })
    //       }
    //     })
    //   }
    // })
    // quantity_sownvalueChange
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);
    let lotNum;
    let lot = this.lotNolist ? this.lotNolist.flat() : ''

    let lots = []
    lots.push(lot)
    let lotArr
    if (lots && lots.length > 0) {
      lotArr = lots.flat()
    }
    if (lotArr && lotArr.length > 0) {
      if (this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.lot_no.value) {

        lotNum = lotArr.filter(x => x.lot_id == this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.lot_no.value)
        this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.lot_num_data_v2.setValue(lotNum && lotNum[0] && lotNum[0].value ? lotNum[0].value : '')
        this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.lot_num_data.setValue(lotNum && lotNum[0] && lotNum[0].value ? lotNum[0].value : '')
      }
    }

    this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.tag_no.setValue('')
    // this.ngForm.controls[].lot_num_data
    if (lotno && lotno.length > 0) {
      lotno = lotno.filter(x => x != '')
    }
    if (this.is_update) {
      this.employeeIndex = 0
    }
    const param = {
      search: {
        exclude_tag_range: lotno && (lotno.length > 0) ? (lotno.toString()) : '',
        seed_class_id: this.showparental ? this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.type_of_class.value : this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value,
        // seed_class_id: this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value,
        year: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.year_of_indent.value,
        season: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.season.value,
        // seed_classe_id:this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.types_of_seed.value,
        stage_id: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.stage.value,
        lot_number: lotNum && lotNum[0] && lotNum[0].value ? lotNum[0].value : '',
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        line_variety_code: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.variety_line_code.value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        // variety_line_code: this.ngForm.controls['variety_line_code'].value,
        lot_id: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.lot_no.value,
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
      this.tagNo = response
      if (response && response.length > 0) {
        response = response.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.value === arr.value)))
      }
      //   response.push({
      //     "value": "nischal788",
      //     "display_text": "nischal788",
      //     "tag_number": "nischal788",
      //     "quantity": 2,
      //     "quantity_used": 0,
      //     "quantity_remaining": 2,
      //     "tag_id": 3563
      // })

      // response.pu
      // s
      // h(tagNos.flat())
      // this.tagNo = response
      if (response && response.length > 0) {
        response = response.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.value === arr.value)))
      }

      const formArray = this.ngForm.get('bsp2Arr') as FormArray;
      if (formArray && formArray.controls && formArray.controls[index] && formArray.controls[index]['controls']
        && formArray.controls[index]['controls'].total_quantity && formArray.controls[index]['controls'].total_quantity.controls
        && formArray.controls[index]['controls'].total_quantity.controls[skillIndex] && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls
        && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.tag_no

      ) {
        formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.tag_no.tagNo = response ? response : []
      }
      if (this.is_update) {
        this.employeeIndex = 0
      }
      let res = this.ngForm.value && this.ngForm.value.bsp2Arr && this.ngForm.value.bsp2Arr[this.employeeIndex] ? this.ngForm.value.bsp2Arr[this.employeeIndex] : '';

      // if (this.editDataValue) {
      if (this.is_update) {
        if (this.bsp2Arrlist && this.bsp2Arrlist.length > 0) {
          this.bsp2Arrlist.forEach((el, n) => {
            if (el.quantity_data && el.quantity_data.length > 0) {
              el.quantity_data.forEach((item, j) => {

                // if(formArray.controls[n]['controls'].total_quantity.controls[j].controls &&formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no && formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo){
                if (formArray.controls[n]['controls'].total_quantity.controls[j].controls.tag_no && formArray.controls[n]['controls'].total_quantity.controls[j].controls.tag_no.tagNo) {
                  formArray.controls[n]['controls'].total_quantity.controls[j].controls.tag_no.tagNo.push(...item.tag_no)
                  formArray.controls[n]['controls'].total_quantity.controls[j].controls.tag_no.tagNo = formArray.controls[n]['controls'].total_quantity.controls[j].controls.tag_no.tagNo.filter((arr, index, self) =>
                    index === self.findIndex((t) => (t.value === arr.value)))
                  if (formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo && formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo.length > 0) {
                    formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo =
                      formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo.sort((a, b) => {
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
                // }
                if (formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no && formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo) {
                  formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo = formArray.controls[index]['controls'].total_quantity.controls[j].controls.tag_no.tagNo.map(obj1 => {
                    if (obj1 && !obj1.quantity_remaining || obj1.quantity_remaining == 0) {

                      const matchingObj2 = this.bspProforma2SeedData.find(obj2 => obj1.value == obj2.tag_range);
                      if (matchingObj2) {
                        return {
                          ...obj1,
                          // quantity_remaining: obj1 && obj1.quantity_remaining
                          quantity_remaining: matchingObj2.quantity_sown ? matchingObj2.quantity_sown : matchingObj2.quantity_remaining,
                          tag_id: matchingObj2.tag_id,
                          lot_id: matchingObj2.lot_id,
                          lot_name: matchingObj2 && matchingObj2.lot_number ? matchingObj2.lot_number : matchingObj2 && matchingObj2.lot_name ? matchingObj2.lot_name : '',
                          // seed_inventry_tag_id:matchingObj2
                          quantity_used: 0 // You can update this as needed
                        };
                      } else {
                        return obj1;
                      }
                    } else {
                      const matchingObj2 = this.bspProforma2SeedData.find(obj2 => obj1.value == obj2.tag_range);
                      if (matchingObj2) {
                        return {
                          ...obj1,
                          // quantity_remaining: obj1 && obj1.quantity_remaining
                          // matchingObj2.quantity_sown ? matchingObj2.quantity_sown :matchingObj2.quantity_remaining,
                          quantity_remaining: obj1 && obj1.quantity_remaining && obj1.quantity_used ? (obj1.quantity_remaining + obj1.quantity_used) : matchingObj2.quantity_sown ? matchingObj2.quantity_sown : matchingObj2.quantity_remaining,
                          tag_id: matchingObj2.tag_id,
                          lot_id: matchingObj2.lot_id,
                          lot_name: matchingObj2 && matchingObj2.lot_number ? matchingObj2.lot_number : matchingObj2 && matchingObj2.lot_name ? matchingObj2.lot_name : '',
                          // seed_inventry_tag_id:matchingObj2
                          // quantity_used: 0 // You can update this as needed
                        };
                      } else {
                        return obj1;
                      }
                    }
                  });

                }
              })
            }
          })
        }
      }

    })
    // this.productionService.postRequestCreator('',)
  }
  getLine() {
    this.showlotpage = true;
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);
    if (this.is_update) {
      this.employeeIndex = 0
    }
    const param = {
      search: {
        // seed_class_id: this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls && this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'] && this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value ? this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value : '',
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value
        // line_variety_code: this.ngForm.controls['variety_line_code'].value,
        // seed_class_id: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.types_of_seed.value,
      }
    }
    if (this.showparental) {
      this.productionService.postRequestCreator('get-line-of-seed-inventory', param).subscribe(data => {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.lineparetals = response ? response : '';

      })
    }
  }
  getList() {
    if (this.is_update) {
      this.employeeIndex = 0
    }
    if (this.showparental) {
      this.getLine();

    }
    else {
      let param = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : ''
      if (this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value) {

        // let permission;
        // if (this.typeOfSeedList && this.typeOfSeedList.length > 0) {
        //   permission = this.typeOfSeedList.filter(x => x.value == this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value)
        // }
        // console.log(permission, 'permission')
        // if (!permission || permission && permission.length < 1 || (permission && permission[0] && permission[0].isPermission == null) || (permission && permission[0] && !permission[0].breeder_seed_available_qnt)) {
        //   this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['permission_of_production'].setValue('NA')
        // }
        // else {
        //   this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['permission_of_production'].setValue(permission[0].isPermission == true ? 'Yes' : 'No');
        // }
        if (!this.is_update) {
          this.showlotpage = true;
          if (this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value) {
            if (this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['stageFix'].value == 2) {
              this.getStageList(0, 0)
            }
          }
        } else {
          this.showlotpage = true;
        }
      }

      let response

    }
  }
  getStageList(index, skillIndex) {
    if (this.is_update) {
      this.employeeIndex = 0
    }
    this.showlotpage = true;
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);
    const param = {
      search: {
        // seed_class_id: this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls && this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'] && this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value ? this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value : '',
        line_variety_code: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.variety_line_code.value,
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        // variety_line_code: this.ngForm.controls['variety_line_code'].value,
        seed_class_id: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.types_of_seed.value ? this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.types_of_seed.value : this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value,
      }
    }

    this.productionService.postRequestCreator('get-stage-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';

      this.stage = response ? response : '';
      const formArray = this.ngForm.get('bsp2Arr') as FormArray;
      if (formArray && formArray.controls && formArray.controls[index] && formArray.controls[index]['controls']
        && formArray.controls[index]['controls'].total_quantity && formArray.controls[index]['controls'].total_quantity.controls
        && formArray.controls[index]['controls'].total_quantity.controls[skillIndex] && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls
        && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.stage

      ) {
        formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.stage.stageList = response ? response : []
      }

    })

  }

  getStageList2() {
    this.showlotpage = true;
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);
    if (this.is_update) {
      this.employeeIndex = 0
    }
    const param = {
      search: {
        seed_class_id: this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value,

        // line_variety_code: this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['variety_line_code'].value,
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        crop_code: this.ngForm.controls['crop'].value,
        variety_line_code: this.ngForm.controls['variety_line_code'].value,
        variety_code: this.ngForm.controls['variety'].value
        // seed_class_id: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.types_of_seed.value,
      }
    }
    if (this.showparental) {
      this.productionService.postRequestCreator('get-line-of-seed-inventory', param).subscribe(data => {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.lineparetals = response ? response : '';

      })
    }
    this.productionService.postRequestCreator('get-stage-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';

      this.stage = response ? response : '';
      // const formArray = this.ngForm.get('bsp2Arr') as FormArray;
      // if (formArray && formArray.controls && formArray.controls[index] && formArray.controls[index]['controls']
      //   && formArray.controls[index]['controls'].total_quantity && formArray.controls[index]['controls'].total_quantity.controls
      //   && formArray.controls[index]['controls'].total_quantity.controls[skillIndex] && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls
      //   && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.year_of_indent

      // ) {
      //   formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.year_of_indent.yearList = response ? response : []
      // }

      // const formArray = this.ngForm.get('bsp2Arr') as FormArray;
      // if (formArray && formArray.controls && formArray.controls[index] && formArray.controls[index]['controls']
      //   && formArray.controls[index]['controls'].total_quantity && formArray.controls[index]['controls'].total_quantity.controls
      //   && formArray.controls[index]['controls'].total_quantity.controls[skillIndex] && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls
      //   && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.stage

      // ) {
      //   formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.stage.stageList = response ? response : []
      // }
      // formArray.controls[index]['controls'].stage.stageList = response ? response :[]

      // response.forEach(item => {
      //   formArray.push(this.fb.group({
      //     stage: item,
      //     // value: [item.display_text]
      //     // Add more fields as needed
      //   }));
      // });
    })

  }
  getStageListSecond(index) {

    const param = {
      search: {
        seed_class_id: this.ngForm.controls['bsp2Arrseedsowndetails']['controls'][index]['controls'].types_of_seed.value
      }
    }
    this.productionService.postRequestCreator('get-stage-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.stage = response ? response : '';

      const formArray = this.ngForm.get('bsp2Arrseedsowndetails') as FormArray;
      if (formArray && formArray.controls && formArray.controls[index] &&
        formArray.controls[index]['controls'].stage && formArray.controls[index]['controls'].stage


      ) {
        formArray.controls[index]['controls'].stage.stageList = response ? response : []
      }
      // // formArray.controls[index]['controls'].stage.stageList = response ? response :[]

      // response.forEach(item => {
      //   formArray.push(this.fb.group({
      //     stage: item,
      //     // value: [item.display_text]
      //     // Add more fields as needed
      //   }));
      // });
    })
  }
  get shouldShowDiv(): boolean {
    return (
      ((this.showFirstDetailsPage &&
        this.showVarietyDetails &&
        this.VarietyList1.length > 0 &&
        this.ngForm.controls['variety'].value) ||
      (this.showFirstDetailsPage &&
        this.showVarietyDetails &&
        this.VarietyList1.length > 0 &&
        this.showparental &&
        this.ngForm.controls['variety'].value &&
        this.ngForm.controls['variety_line_code'].value) ||
        (this.editDataValue && !this.showparental)||
        (this.editDataValue && this.showparental))
    );
  }
   
  getTypeofSeed() {
    if (this.is_update) {
      this.employeeIndex = 0;
    }
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);

    let param;
    param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_line_code: this.ngForm.controls['variety_line_code'].value,
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        variety_code: this.ngForm.controls['variety'].value ? this.ngForm.controls['variety'].value : '',
        // exclude_bsp2_id: this.editId ? (this.editId.toString()) : ''
      }
    }
    this.productionService.postRequestCreator('get-class-quantity', param).subscribe(data => {
      let responseList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      let permission;
      permission = responseList && responseList.permisionData ? responseList.permisionData[0] : ''
      if (responseList && responseList.length < 1 || (permission && permission.isPermission == null) || !permission) {
        this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['permission_of_production'].setValue('NA')
      }
      else {
        this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['permission_of_production'].setValue(permission.isPermission == true ? 'Yes' : 'No');
      }

      let params
      params = {
        search: {
          crop_code: this.ngForm.controls['crop'].value,
          variety_code: this.ngForm.controls['variety'].value,
          id: ['6', '7'].toString(),
          user_id: userData && userData.id ? (userData.id.toString()) : '',
          line_variety_code: this.ngForm.controls['variety_line_code'].value,
          year: this.ngForm.controls['year'].value,
          season: this.ngForm.controls['season'].value,
        }
      }
      this.productionService.postRequestCreator('get-seed-type-of-seed-inventory', params).subscribe(data => {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
        let breederData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.breederData ? data.EncryptedResponse.data.breederData : '';
        let nucleusData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.nucleusData ? data.EncryptedResponse.data.nucleusData : '';
        // if (response && response.length > 0) {
        //   response = response.filter((arr, index, self) =>
        //     index === self.findIndex((t) => (t.value === arr.value )))

        // }
        console.log('response===',response);
        let arr = [];
        if (response && response.length > 0) {
          response.forEach(el => {
            if (el.value == 7 && el.isPermission == true) {
              arr.push(el)
            }
            else if (el.value == 6) {
              arr.push(el)
            }

          })
        }
        if (arr && arr.length > 0) {
          arr = arr.filter((arr, index, self) =>
            index === self.findIndex((t) => (t.value === arr.value)))

        }
        //    response = response.map(seed => {
        //     if (seed.type === "Breeder Seed") {
        //         const available = breederData.find(item => item.seed_class_id === seed.value);
        //         return { ...seed, ...available };
        //     } else if (seed.type === "Nucleus Seed") {
        //         const available = nucleusData.find(item => item.seed_class_id === seed.value);
        //         return { ...seed, ...available };
        //     } else {
        //         return seed;
        //     }
        // });
        // if((responseList && responseList.breederData && responseList.breederData.length>0) ||  (responseList && responseList.nucleusData && responseList.nucleusData.length>0)){
        //   response = response.filter(seed => {
        //     if (seed.value === 6) {
        //         return seed.nucleus_seed_available_qnt !== null && seed.nucleus_seed_available_qnt !== 0;
        //     } else if (seed.value === 7) {
        //         return (seed.breeder_seed_available_qnt != null && seed.breeder_seed_available_qnt != 0 && seed.isPermission!=false) ;
        //     } else {
        //         return true; // Keep other values unchanged
        //     }
        // });
        // }
        console.log(arr, 'arr')
        console.log('showparental2:', this.showparental); 
        console.log('ngForm.controls["variety_line_code"].value2:', this.ngForm.controls['variety_line_code'].value);
        console.log('editDataValue && showparental2:', this.editDataValue && this.showparental);

        this.typeOfSeedList = arr ? arr : '';

        if (this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls && this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class']) {
          this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].setValue((this.ngForm.value['bsp2Arr'][this.employeeIndex].type_of_class.toString()))
        }

      })

    })


    // showparental
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
        line_variety_code: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.variety_line_code.value,

      }
    }



    this.productionService.postRequestCreator('get-seed-type-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
      console.log('response====',response);
      let breederData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.breederData ? data.EncryptedResponse.data.breederData : '';
      let nucleusData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.nucleusData ? data.EncryptedResponse.data.nucleusData : '';
      if (response && response.length > 0) {
        response = response.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.value === arr.value)))

      }
      // if(response && response.length>0){
      //   response = response.map(seed => {
      //     if (seed.type === "Breeder Seed") {
      //         const available = breederData.find(item => item.seed_class_id === seed.value);
      //         return { ...seed, ...available };
      //     } else if (seed.type === "Nucleus Seed") {
      //         const available = nucleusData.find(item => item.seed_class_id === seed.value);
      //         return { ...seed, ...available };
      //     } else {
      //         return seed;
      //     }
      // });
      // }
      // if((response && response.length>0)){
      //   response = response.filter(seed => {
      //     if (seed.value === 6) {
      //         return seed.nucleus_seed_available_qnt !== null && seed.nucleus_seed_available_qnt !== 0;
      //     } else if (seed.value === 7) {
      //         return (seed.breeder_seed_available_qnt != null && seed.breeder_seed_available_qnt != 0 && seed.isPermission!=false) ;
      //     } else {
      //         return true; // Keep other values unchanged
      //     }
      // });
      // }
      this.typeOfSeedList = response ? response : '';
      const formArray = this.ngForm.get('bsp2Arr') as FormArray;
      if (formArray && formArray.controls && formArray.controls[index] && formArray.controls[index]['controls']
        && formArray.controls[index]['controls'].total_quantity && formArray.controls[index]['controls'].total_quantity.controls
        && formArray.controls[index]['controls'].total_quantity.controls[skillIndex] && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls
        && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.type_of_class

      ) {

        formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.type_of_class.typeClassList = response ? response : []
      }

    })
    // showparental
  }
  getSeedInventoYear(index, skillIndex) {
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);
    if (this.is_update) {
      this.employeeIndex = 0
    }

    const param = {
      search: {

        // seed_class_id: this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls && this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'] && this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value ? this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value : '',
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        line_variety_code: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.variety_line_code.value,
        stage_id: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.stage.value,
        crop_code: this.ngForm.controls['crop'].value,
        seed_class_id: this.showparental ? this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.type_of_class.value : this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value,
        // line_variety_code: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.variety_line_code.value,
        // variety_line_code: this.ngForm.controls['variety_line_code'].value,
        variety_code: this.ngForm.controls['variety'].value
      }
    }
    this.productionService.postRequestCreator('get-year-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';


      const formArray = this.ngForm.get('bsp2Arr') as FormArray;
      if (formArray && formArray.controls && formArray.controls[index] && formArray.controls[index]['controls']
        && formArray.controls[index]['controls'].total_quantity && formArray.controls[index]['controls'].total_quantity.controls
        && formArray.controls[index]['controls'].total_quantity.controls[skillIndex] && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls
        && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.year_of_indent

      ) {
        formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.year_of_indent.yearList = response ? response : []
      }

    })
  }
  getSeedInventoYearSecond(index,) {

    const param = {
      search: {
        seed_class_id: this.ngForm.controls['bsp2Arrseedsowndetails']['controls'][index]['controls'].types_of_seed.value,
        stage_id: this.ngForm.controls['bsp2Arrseedsowndetails']['controls'][index]['controls'].stage.value
      }
    }
    this.productionService.postRequestCreator('get-year-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      const formArray = this.ngForm.get('bsp2Arrseedsowndetails') as FormArray;
      // if (formArray && formArray.controls && formArray.controls[index] && formArray.controls[index]['controls']
      //   && formArray.controls[index]['controls'].total_quantity && formArray.controls[index]['controls'].total_quantity.controls
      //   && formArray.controls[index]['controls'].total_quantity.controls[skillIndex] && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls
      //   && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.year_of_indent

      // ) {
      //   formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.year_of_indent.yearList = response ? response : []
      // }

    })
  }
  getSeedInventoSeason(index, skillIndex) {
    const localdata = localStorage.getItem('BHTCurrentUser');
    let userData = JSON.parse(localdata);

    const param = {
      search: {
        year: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.year_of_indent.value,
        line_variety_code: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.variety_line_code.value,
        stage_id: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.stage.value,
        user_id: userData && userData.id ? (userData.id.toString()) : '',
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        seed_class_id: this.showparental ? this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.type_of_class.value : this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].value,
        // line_variety_code: this.ngForm.controls['bsp2Arr']['controls'][index].controls['total_quantity'].controls[skillIndex].controls.variety_line_code.value,
        // variety_line_code: this.ngForm.controls['variety_line_code'].value,

      }
    }

    this.productionService.postRequestCreator('get-season-of-seed-inventory', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      const formArray = this.ngForm.get('bsp2Arr') as FormArray;
      if (formArray && formArray.controls && formArray.controls[index] && formArray.controls[index]['controls']
        && formArray.controls[index]['controls'].total_quantity && formArray.controls[index]['controls'].total_quantity.controls
        && formArray.controls[index]['controls'].total_quantity.controls[skillIndex] && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls
        && formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.season
      ) {
        formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.season.seasonList = response ? response : []
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
      this.getMasterBspReportData(null, null, null)
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
      this.master.postRequestCreator('get-bsp-proforma-2s-list-second', null, param).subscribe(data => {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.dummyData = response && response.data ? response.data : '';
        // if(this.dummyData && this.dummyData.length>0){
        //   this.dummyData.forEach((el,i)=>{

        //   })
        // }
        if (this.dummyData && this.dummyData[0] && this.dummyData[0].is_freezed && (this.dummyData[0].is_freezed == 1)) {
          this.freezeData = true
        }
        else {
          this.freezeData = false
        }
        this.getBsp2ListVariety()
        for (let data of this.dummyData) {
          // let bsplength = data.bsp2Arr.length;
          // data.bsplength = bsplength
          // let bsp2_Deteials= e
          let sum = 0;
          if (data && data.bsp2_Deteials && data.bsp2_Deteials.length > 0) {
            data.bsp2_Deteials.forEach((el, i) => {

              sum += el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 0
              // el.quantity_sown= sum;
            })
          }
          data.bsp2_Deteials.forEach((el, i) => {
            // sum+=el && el.quantity_sown ? el.quantity_sown :0
            el.quantity_sown = sum;
          })

          data.bsp2_Deteials = data.bsp2_Deteials.filter((arr, index, self) =>
            index === self.findIndex((t) => (t.bsp_proforma_2_id === arr.bsp_proforma_2_id && t.field_code == arr.field_code)))
          let bsplength = data.bsp2_Deteials.length;
          data.bsplength = bsplength;

        }
      })
    }



  }
  cancel() {
    // const formArray = this.employees()
    //   .at(this.employeeIndex)
    //   .get('total_quantity') as FormArray;
    // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.stage.setValue('');
    // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.year_of_indent.setValue('');
    // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.season.setValue('')
    // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.lot_no.setValue('');
    // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.tag_no.setValue('');
    // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.quantity_available.setValue('');
    // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.quantity_sown.setValue('');
    // // this.ngForm.controls['bsp2Arr']['controls'][].controls['total_breederseed'].setValue('');
    // this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['total_breederseed'].setValue('')
    // this.ngForm.controls['type_of_class'].setValue('');
    // this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].setValue('')
    // const controlToKeep = formArray.at(0);
    // formArray.clear();
    // formArray.push(controlToKeep);
    let res = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';
    this.editDataValue = true;
    this.submitted = true;
    this.backbtn = true;
    if (res && res.length > 0) {
      res.forEach((el, i) => {
        this.ngForm.controls['bsp2Arr']['controls'][i].controls['showDisableDate'].setValue(true);
        this.ngForm.controls['bsp2Arr']['controls'][i].controls['showDisableInspectionDate'].setValue(true);
      })
    }
    this.isSearch = true;
    this.showFirstDetailsPage = true;
    this.showDetsail = false;
    // this.submitted=true;
    // this.is_update=false
    this.tittle = 'Production Schedule and Availability of Breeder Seed (BSP-II)'
    this.showetailsPage = false;
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
    this.productionService.postRequestCreator('get-bsp-proforma-2s-varieties', param).subscribe(data => {
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
    let param = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';
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
  delete(id: number,) {
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
      if (this.dummyData && this.dummyData.length > 0) {
        response = this.dummyData.filter(x => x.variety_code == id)
        if (response && response.length > 0) {
          response.forEach((el, i) => {
            el.bsp2_Deteials.forEach((item, index) => {
              bspcId.push(item && item.bsp_proforma_2_id ? item.bsp_proforma_2_id : '')
            })
          })
        }
      }
      if (result.isConfirmed) {

        const param = {
          user_id: UserId,
          bspc_2_id: id
        }

        this.productionService
          .postRequestCreator("delete-bsp-proforma-2s-data", param)
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
                this.getVarietyDetails();
                this.getVarietyDetailsData();
                this.showVarietyDetails = false;
                let param = this.ngForm.value ? this.ngForm.value : '';
                this.ngForm.controls['variety'].setValue('')
                this.selectVariety = ''
                this.ngForm.controls['variety_line_code'].setValue('')
                this.selectParental = ''


                // const formArray = this.employees()
                //   .at(0)
                //   .get('total_quantity') as FormArray;
                let bsp2Arr = param && param.bsp2Arr ? param.bsp2Arr : '';
                if (bsp2Arr && bsp2Arr.length > 0) {
                  bsp2Arr.forEach((el, i) => {

                    el.total_quantity.forEach((item, index) => {

                      this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.stage.setValue('');
                      this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.year_of_indent.setValue('');
                      this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.season.setValue('')
                      this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.lot_no.setValue('');
                      this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.tag_no.setValue('');
                      this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.quantity_available.setValue('');
                      this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.quantity_sown.setValue('');
                      // this.ngForm.controls['total_breederseed'].setValue('');
                      this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_breederseed'].setValue('')
                      this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].setValue('');

                    })
                  })
                }
                if (bsp2Arr && bsp2Arr.length > 0) {
                  bsp2Arr.forEach((el, i) => {
                    el.total_quantity.forEach((item, index) => {
                      while (this.getNestedFormArray(i).controls.length != 1) {
                        this.removeEmployeeSkillSecond(i, index)
                      }
                    })
                  })
                }
                //     const formArray = this.employees()
                //   .at(0)
                //   .get('total_quantity') as FormArray;            
                // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.stage.setValue('');
                // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.year_of_indent.setValue('');
                // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.season.setValue('')
                // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.lot_no.setValue('');
                // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.tag_no.setValue('');
                // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.quantity_available.setValue('');
                // this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_quantity'].controls[0].controls.quantity_sown.setValue('');
                // // this.ngForm.controls['total_breederseed'].setValue('');
                // // this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['total_breederseed'].setValue('')
                // // this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].setValue('');
                // const controlToKeep = formArray.at(0);
                // formArray.clear();
                // formArray.push(controlToKeep);
                const FormArrays = this.ngForm.get('bsp2Arr') as FormArray;
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['state'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['district'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['address'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['area_shown'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['date_of_showing'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_ns_shown'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['class_of_seed_v2'].setValue('');

                this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_bs_shown'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_inspection'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_harvest'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_production'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['qty_seed_sown'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['permission_of_production'].setValue('');
                const controlToKeeps = FormArrays.at(0);
                FormArrays.clear();
                FormArrays.push(controlToKeeps);



                // window.location.reload()
              })
              // this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });


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
        if (data && data.bsp2_Deteials.length > 0) {
          for (let item of data.bsp2_Deteials) {
            bspcId.push(item && item.bsp_proforma_2_id ? item.bsp_proforma_2_id : '')
          }
        }
      }
    }
    const params = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        report_name: 'BSP-II',

      }
    }
    let param;
    this.breeder.postRequestCreator('generate-report-runing-number', null, params).subscribe(apiResponse => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        let data = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data : '';
        let reportName = data && data[0] && data[0].report_name ? data[0].report_name : data && data.report_name ? data.report_name : 'NA';
        let year = data && data[0] && data[0].year ? this.getFinancialYear2(data[0].year) : data && data.year ? this.getFinancialYear2(data.year) : 'NA';
        let running_number = data && data[0] && data[0].running_number ? data[0].running_number : data && data.running_number ? data.running_number : 'NA';
        let season = data && data[0] && data[0].season ? data[0].season : data && data.season ? data.season : 'NA';
        let referenceNumber = reportName + '/' + year + '/' + season + '/' + running_number;
        this.referenceNumber = referenceNumber ? referenceNumber : 'NA';
        param = {
          user_id: UserId,
          bspc_2_ids: bspcId && (bspcId.length > 0) ? bspcId.toString() : '',
          referenceNumber: this.referenceNumber ? this.referenceNumber : ''
        }
        //  return this.referenceNumber
      }
      else {
        param = {
          user_id: UserId,
          bspc_2_ids: bspcId && (bspcId.length > 0) ? bspcId.toString() : '',
          // referenceNumber:this.referenceNumber ? this.referenceNumber :''
        }
      }
    })

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

      this.productionService.postRequestCreator('finalise-bsp-proforma-2s-data', param).subscribe(apiResponse => {
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
    })

  }
  fixedPostition(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const componentElement = this.elementRef.nativeElement as HTMLElement;
    const excludedClass = 'dynamicform';

    if (
      !componentElement.contains(clickedElement) ||
      clickedElement.classList.contains(excludedClass)
    ) {
      return;
    }
    // this.changeposition = false;
    // this.changeposition = false;
    this.stateList = this.stateListSecond;

    let data = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';
    if (data && data.length > 0) {
      data.forEach((el, i) => {
        this.ngForm.controls['bsp2Arr']['controls'][i]['controls']['stateData_text'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][i]['controls']['disttrictData_text'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][i]['controls'].district.districtlist = this.districtListsecond
      })
    }
    // Perform actions if the clicked element is within the component but doesn't have the excluded class
    // alert('Clicked on a component but not on the excluded class!');
    // Perform actions if the clicked element doesn't have the excluded ID
    // alert('hii')

    // this.changepositions=false;
  }
  gettotalValue(i, skillIndex) {
    let data = this.ngForm.value && this.ngForm.value['bsp2Arr'] && this.ngForm.value['bsp2Arr'][this.employeeIndex] && this.ngForm.value['bsp2Arr'][this.employeeIndex].total_quantity ? this.ngForm.value['bsp2Arr'][this.employeeIndex].total_quantity : '';
    // data.forEach((el,i)=>{
    //   el.quantity_sown=(el.quantity_sown_v2*100).toFixed(2)
    // })
    let sum = 0

    // for (let item of data) {
    //   item['quantity_sown_second'] = item && item.quantity_sown ? (parseFloat(item.quantity_sown)) : 0;
    // }
    // for (let item of data) {
    //   if (this.unit == 'Qt') {
    //     item['quantity_sown_second'] = item && item.quantity_sown ? ((parseFloat(item.quantity_sown_second) * 100).toFixed(2)).toString() : 0;
    //   }
    // }
    for (let item of data) {
      if (this.unit == 'Qt') {
        item['quantity_sown'] = item && item.quantity_sown ? ((parseFloat(item.quantity_sown))) : 0;
      } else {
        item['quantity_sown'] = item && item.quantity_sown ? ((Number(item.quantity_sown))) : 0;
      }
    }
    for (let item of data) {
      // if(this.units=='Qt'){
      sum += item && item.quantity_sown ? ((parseFloat(item.quantity_sown))) : 0;

    }
    this.ngForm.value['bsp2Arr'][this.employeeIndex].total_quantity.forEach((el, i) => {
      if ((parseFloat(el.quantity_available)) < (parseFloat(el.quantity_sown))) {
        Swal.fire({
          title: '<p style="font-size:25px;">Quantity Sown Can not be greater than Quantity Available.</p>',
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
    this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['total_breederseed'].setValue(sum ? (Number(sum).toFixed(2)) : 0)
    // this.ngForm.controls['total_breederseed'].setValue(sum ? sum : 0);

  }



  vsClick() {
    document.getElementById('varietys').click()
  }
  onScroll(event: Event) {
    // this.changeposition = false;
    // this.changepositions = false;
    this.stateList = this.stateListSecond;

    let data = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';
    if (data && data.length > 0) {
      data.forEach((el, i) => {
        this.ngForm.controls['bsp2Arr']['controls'][i]['controls']['stateData_text'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][i]['controls']['disttrictData_text'].setValue('');
        this.ngForm.controls['bsp2Arr']['controls'][i]['controls'].district.districtlist = this.districtListsecond
      })
    }
    // You can perform actions based on the scroll event here
  }
  filterStateName($event, i) {
    if (this.ngForm.controls['bsp2Arr']['controls'][i]['controls']['stateData_text'].value) {
      this.stateList = this.stateListSecond
      this.stateList = this.stateList.filter(x => x.state_name.toLowerCase().includes(this.ngForm.controls['bsp2Arr']['controls'][i]['controls']['stateData_text'].value.toLowerCase()))
    } else {
      this.stateList = this.stateListSecond
    }
  }
  filterDistrictName($event, i) {
    if (this.ngForm.controls['bsp2Arr']['controls'][i]['controls']['disttrictData_text'].value) {
      this.ngForm.controls['bsp2Arr']['controls'][i]['controls'].district.districtlist = this.districtListsecond
      this.ngForm.controls['bsp2Arr']['controls'][i]['controls'].district.districtlist = this.ngForm.controls['bsp2Arr']['controls'][i]['controls'].district.districtlist.filter(x => x.district_name.toLowerCase().includes(this.ngForm.controls['bsp2Arr']['controls'][i]['controls']['disttrictData_text'].value.toLowerCase()))
    } else {
      this.ngForm.controls['bsp2Arr']['controls'][i]['controls'].district.districtlist = this.districtListsecond
    }


  }
  onInputChange(event, i) {
    this.ngForm.controls['bsp2Arr']['controls'][i]['controls']['address'].setValue(event && event.target && event.target.value && event.target.value ? event.target.value.toUpperCase() : '')
  }
  ChangeField(i) {
    // showDisableDate
    // this.onDateChangedharvesting(null,i)
    this.ngForm.controls['bsp2Arr']['controls'][i].controls['showDisableDate'].setValue(false)
  }
  ChangeInspectionField(i) {
    this.ngForm.controls['bsp2Arr']['controls'][i].controls['showDisableInspectionDate'].setValue(false)
  }
  firstPageCancel() {
    const FormArrays = this.ngForm.get('bsp2Arr') as FormArray;
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['state'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['district'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['address'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['area_shown'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['date_of_showing'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_ns_shown'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['class_of_seed_v2'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_bs_shown'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_inspection'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_harvest'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_production'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['type_of_class'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['type_of_class'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['qty_seed_sown'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['permission_of_production'].setValue('');
    const controlToKeeps = FormArrays.at(0);
    FormArrays.clear();
    if (this.Variety.length < 1) {
      this.ngForm.controls['variety'].setValue('');
      this.ngForm.controls['variety_line_code'].setValue('');
      this.selectParental = '';
      this.selectVariety = '';
      this.editDataValue = false;

    }
    FormArrays.push(controlToKeeps);
    this.removeSecondPage()
    this.is_update = false;
    this.editShowData = false;
    this.showAddMoreInthisVariety = false;
    this.editShowData11 = false;

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
    this.productionService.postRequestCreator('get-varieties-parental-line-v1-second', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.parentalList = response ? response : '';
        this.parentalListData = response ? response : '';
        this.parentalListSecond = response ? response : '';
        if (!this.showAddMoreInthisVariety && !this.editShowData) {

          if (this.showparental || this.editDataValue) {
            if (this.parentalListSecond && this.parentalListSecond.length < 1) {
              this.ngForm.controls['bsp2Arr']['controls'][0].controls['variety_line_code'].setValue('');
              this.ngForm.controls['variety_line_code'].setValue('');
              this.ngForm.controls['variety'].setValue('');
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
        // if(this.is_update){
        //   if(this.parentalList && this.parentalList.length>0){
        //     let res = this.parentalList.filter(x=>x.line_variety_code==this.ngForm.controls['parental_data'].value)
        //     this.selectParentalLine=(res && res[0] && res[0].line_variety_name ? res[0].line_variety_name :'')
        //   } 

        // }


      }
    })
  }
  getparentalDataName(item) {
    let res = this.parentalList.filter(x => x.value == item);
    let data = res && res[0] && res[0].display_text ? res[0].display_text : '';
    return data ? data : '';
  }
  // addmoreinthisVariety(data) {
  //   while (this.employees().controls.length != 1) {
  //     this.remove(0)
  //   }
  //   this.is_update = false;
  //   this.editDataValue = true;
  //   // this.editDataValue=true;
  //   this.showVarietyDetails = true;
  //   this.showAddMoreInthisVariety = true;
  //   const getLocalData = localStorage.getItem('BHTCurrentUser');
  //   let datas = JSON.parse(getLocalData)
  //   let UserId = datas.id
  //   const param = {
  //     bspc_2_id: data,
  //     user_id: UserId
  //   }
  //   this.productionService.postRequestCreator('get-bsp-proforma-2s-edit-data', param).subscribe(data => {
  //     let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
  //     let bspProforma2SeedData = response && response.bspProforma2SeedData ? response.bspProforma2SeedData : '';
  //     this.bspProforma2SeedData = response && response.bspProforma2SeedData ? response.bspProforma2SeedData : '';
  //     let bspProforma2Data = response && response.bspProforma2Data ? response.bspProforma2Data : '';
  //     let datas = []
  //     let req_data = bspProforma2Data && bspProforma2Data.req_data ? bspProforma2Data.req_data : '';

  //     if (req_data) {
  //       datas.push(req_data)
  //       this.bsp2Arrlist = datas;
  //     }

  //     this.ngForm.controls['variety'].setValue(req_data && req_data.variety_code ? req_data.variety_code : '', { emitEvent: false });
  //     this.selectVariety = req_data && req_data.variety_name ? req_data.variety_name : '';
  //     // this.getparentalData()
  //     this.selectParental = req_data && req_data.variely_line ? req_data.variely_line : '';
  //     this.ngForm.controls['variety_line_code'].setValue(req_data && req_data.variety_line_code ? req_data.variety_line_code : '');
  //   })
  //   // if (data) {

  //   //   let res = data ? data : '';
  //   //   this.ngForm.controls['variety'].setValue(res && res.variety_code ? res.variety_code : '');
  //   //   this.selectVariety = res && res.variety_name ? res.variety_name : '';

  //   //   this.ngForm.controls['variety_line_code'].setValue(data && data.variety_line_code ? data.variety_line_code : '',);
  //   // }
  //   let checkStatus
  //   // if(this.is_update){
  //   checkStatus = this.varietyListofBsp2list.filter(x => x.value == this.ngForm.controls['variety'].value)

  //   if (checkStatus && checkStatus[0] && checkStatus[0].variety_type && checkStatus[0].variety_type == 'hybrid') {
  //     this.showparental = true;
  //     this.getparentalData()
  //   }
  //   else {
  //     this.showparental = false;
  //     this.parentalList = []

  //   }
  //   this.getList()
  //   const formArray = this.ngForm.get('bsp2Arr') as FormArray;
  //   // if (this.bsp2Arrlist && this.bsp2Arrlist.length > 0) {
  //   //   this.bsp2Arrlist.forEach((el, n) => {
  //   //     if (el.quantity_data && el.quantity_data.length > 0) {
  //   //       el.quantity_data.forEach((item, j) => {
  //   //         formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.lot_no.lotlist.push({
  //   //           value: item && item.lot_number ? item.lot_number : "",
  //   //           display_text: item && item.lot_number ? item.lot_number : "",
  //   //           lot_number: item && item.lot_number ? item.lot_number : "",
  //   //           lot_id: item && item.lot_id ? item.lot_id : "",
  //   //         })
  //   //       })

  //   //       formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.lot_no.lotlist = formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.lot_no.lotlist.filter((arr, index, self) =>
  //   //         index === self.findIndex((t) => (t.value == arr.value && t.lot_id == arr.lot_id)))
  //   //     }
  //   //   })
  //   // }
  //   // this.ngForm.controls['variety'].setValue(req_data && req_data.variety_code ? req_data.variety_code : '');
  //   // this.getparentalData()
  //   this.selectParental = data && data.line_variety_name ? data.line_variety_name : '';
  //   // this.selectVariety= req_data && req_data.variety_name ? req_data.variety_name:'';
  //   const FormArrays = this.ngForm.get('bsp2Arr') as FormArray;
  //   this.ngForm.controls['bsp2Arr']['controls'][0].controls['state'].setValue('');
  //   this.ngForm.controls['bsp2Arr']['controls'][0].controls['district'].setValue('');
  //   this.ngForm.controls['bsp2Arr']['controls'][0].controls['address'].setValue('');
  //   this.ngForm.controls['bsp2Arr']['controls'][0].controls['area_shown'].setValue('');
  //   this.ngForm.controls['bsp2Arr']['controls'][0].controls['date_of_showing'].setValue('');
  //   this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_ns_shown'].setValue('');
  //   this.ngForm.controls['bsp2Arr']['controls'][0].controls['class_of_seed_v2'].setValue('');

  //   this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_bs_shown'].setValue('');
  //   this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_inspection'].setValue('');
  //   this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_harvest'].setValue('');
  //   this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_production'].setValue('');
  //   this.ngForm.controls['bsp2Arr']['controls'][0].controls['type_of_class'].setValue('');
  //   this.ngForm.controls['bsp2Arr']['controls'][0].controls['qty_seed_sown'].setValue('');
  //   const controlToKeeps = FormArrays.at(0);
  //   FormArrays.clear();
  //   FormArrays.push(controlToKeeps);
  //   // })
  // }
  addmoreinthisVariety(id) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let UserId = datas.id
    const param = {
      bspc_2_id: id,
      user_id: UserId
    }

    this.is_update = false;
    this.editDataValue = true;
    // this.editDataValue=true;
    this.showVarietyDetails = true;
    this.showAddMoreInthisVariety = true;
    // this.editDataValue = true;
    // this.is_update = true;
    this.editId = id;
    // this.showlotpage = true;

    // this.showparental = true;
    this.productionService.postRequestCreator('get-bsp-proforma-2s-edit-data', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      let bspProforma2SeedData = response && response.bspProforma2SeedData ? response.bspProforma2SeedData : '';
      this.bspProforma2SeedData = response && response.bspProforma2SeedData ? response.bspProforma2SeedData : '';
      let bspProforma2Data = response && response.bspProforma2Data ? response.bspProforma2Data : '';
      let datas = []
      let req_data = bspProforma2Data && bspProforma2Data.req_data ? bspProforma2Data.req_data : '';

      if (req_data) {
        datas.push(req_data)
        this.bsp2Arrlist = datas;
      }
      for (let i = 1; i < this.bsp2Arrlist.length; i++) {
        this.addEmployee()
      }
      this.ngForm.controls['variety'].setValue(req_data && req_data.variety_code ? req_data.variety_code : '', { emitEvent: false });
      this.selectVariety = req_data && req_data.variety_name ? req_data.variety_name : '';
      this.getparentalData()
      this.selectParental = req_data && req_data.variely_line ? req_data.variely_line : '';
      this.ngForm.controls['variety_line_code'].setValue(req_data && req_data.variety_line_code ? req_data.variety_line_code : '');
      this.getTypeofSeed()
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

    })


    // this.showparental=true
  }

  removeData() {
    const FormArrays = this.ngForm.get('bsp2Arr') as FormArray;
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['state'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['district'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['address'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['area_shown'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['date_of_showing'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_ns_shown'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['class_of_seed_v2'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_bs_shown'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_inspection'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_harvest'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_production'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['type_of_class'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['qty_seed_sown'].setValue('');
    this.ngForm.controls['bsp2Arr']['controls'][0].controls['permission_of_production'].setValue('');
    const controlToKeeps = FormArrays.at(0);
    FormArrays.clear();
    FormArrays.push(controlToKeeps);
  }
  submit() {
    this.backbtn = false;
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id


    if (!this.is_update) {
      let data = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';
      let formData = data
      let index = this.employeeIndex;


      if (data && data.length > 0) {
        data.forEach((el, i) => {
          el['quantity_data'] = el['total_quantity']
        })
        let datas = this.ngForm.value && this.ngForm.value.bsp2Arr && this.ngForm.value.bsp2Arr[index] && this.ngForm.value.bsp2Arr[index].quantity_data
          ? this.ngForm.value.bsp2Arr[index].quantity_data : '';
        for (let key in datas) {
          if (datas[key].lot_no == '' || datas[key].lot_no == null
            || datas[key].year_of_indent == '' || datas[key].year_of_indent == null
            || datas[key].season == '' || datas[key].season == null
            || datas[key].stage == '' || datas[key].stage == null
            || datas[key].tag_no == '' || datas[key].tag_no == null
            || datas[key].tag_no.length < 1 || datas[key].quantity_available == null
            || datas[key].quantity_available == '' || this.quantityError


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
        let quantity_data;
        let total_quantity;
        formData.forEach((el, i) => {
          let sum = 0;
          el['quantity_data'].forEach((item, index2) => {
            let tagno = []
            item['user_id'] = UserId ? UserId.toString() : '';
            item['tag_id'] = item && item['tag_id'] ? item['tag_id'].toString() : "";
            item['year'] = item && item['year_of_indent'] ? item['year_of_indent'].toString() : "";
            item['stage_id'] = item && item['stage'] ? item['stage'].toString() : "";
            item['tag_quantity'] = item && item['tag_quantitys_2'] ? item['tag_quantitys_2'].toString() : "";
            item['tag_quantitys_2'] = item && item['tag_quantitys_2'] ? item['tag_quantitys_2'].toString() : "";
            item['lot_id'] = item && item['lot_no'] ? item['lot_no'].toString() : "";
            item['lot_number'] = item && item['lot_num_data'] ? item['lot_num_data'].toString() : "";
            item['lot_num_data_v2'] = item && item['lot_num_data_v2'] ? item['lot_num_data_v2'].toString() : "";
            if (this.showparental) {
              item['seed_class_id'] = item && item['type_of_class'] ? item['type_of_class'].toString() : "";
            }
            else {
              item['seed_class_id'] = (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value) ? (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value).toString() : '';
            }
            if (item && item.tag_no && item.tag_no.length > 1) {
              item['quantity_available'] = item && item['quantity_available_v2'] ? (((item['quantity_available_v2']))).toString() : "";
              item['quantity_sown'] = item && item['quantity_sown_v2'] ? (((item['quantity_sown_v2']))).toString() : "";
            } else {
              if (this.units == 'Qt') {
                // if(this.va)
                item['quantity_available'] = item && item['quantity_available'] ? (this.checkDecimal(item['quantity_available'])).toString() : "";
                item['quantity_sown'] = item && item['quantity_sown'] ? (this.checkDecimal(item['quantity_sown'])).toString() : "";
              } else {
                item['quantity_available'] = item && item['quantity_available'] ? ((item['quantity_available'])).toString() : "";
                item['quantity_sown'] = item && item['quantity_sown'] ? ((item['quantity_sown'])).toString() : "";
              }
            }
            sum += item && item['quantity_sown'] ? parseFloat(item['quantity_sown']) : 0;
            if (item && item.tag_no && item.tag_no.length > 0) {
              item.tag_no.forEach(x => {
                tagno.push(x && x.display_text ? x.display_text : '')
                // tagQty.push(item && item['quantity_sown'] ? item['quantity_sown'].toString() : '0')
              }
              )
            }
            item['tag_number'] = tagno && (tagno.length > 0) ? tagno.toString() : '';
            item['tag_quantity'] = this.unit == 'Qt' ? item['tag_quantity'].split(',').map(num => (parseFloat(num) * 100).toString()).join(',') : item['tag_quantity'].split(',').map(num => (parseFloat(num)).toString()).join(',');
            if (!this.showparental) {
              total_quantity = el['total_quantity'] = [{
                seed_class_id: (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value).toString(),
                quantity_sown: sum ? sum.toString() : ''
              }]
            }


          })
        })
        if (this.showparental) {

          let quantityData = data && data[this.employeeIndex] && data[this.employeeIndex].quantity_data ? data[this.employeeIndex].quantity_data : '';

          let sumBySeedClassId = {};
          let varietyLineCodeBySeedClassId = {};
          if (quantityData && quantityData.length > 0) {
            quantityData.forEach(item => {
              let seedClassId = item.seed_class_id;
              let quantitySown = parseFloat(item.quantity_sown);
              sumBySeedClassId[seedClassId] = (sumBySeedClassId[seedClassId] || 0) + quantitySown;
              varietyLineCodeBySeedClassId[seedClassId] = item.variety_line_code;
              // sumBySeedClassId[seedClassId] = (sumBySeedClassId[seedClassId] || 0) + quantitySown ;
            });

            // Create an array of sums with seed_class_id and quantity_sown
            let sumsArray = [];
            for (let seedClassId in sumBySeedClassId) {
              sumsArray.push({
                seed_class_id: seedClassId,
                quantity_sown: sumBySeedClassId && sumBySeedClassId[seedClassId] ? sumBySeedClassId[seedClassId].toString() : 0,
                variety_line_code: varietyLineCodeBySeedClassId[seedClassId]
              });
            }

            // Add the sums array to jsonData
            data[this.employeeIndex].total_quantity = sumsArray;
          }
        }
        const param = {
          quantity_data: data && data[this.employeeIndex] && data[this.employeeIndex].quantity_data ? data[this.employeeIndex].quantity_data : "",
          total_quantity: data && data[this.employeeIndex] && data[this.employeeIndex].total_quantity ? data[this.employeeIndex].total_quantity : "",
        }
        let total_qtyDatas = param && param.quantity_data ? param.quantity_data : '';
        if (this.showparental && total_qtyDatas && total_qtyDatas.length > 0) {
          let totalData = []
          total_qtyDatas.forEach((el, i) => {
            totalData.push(el && el.variety_line_code ? el.variety_line_code : '')
          })
          if (totalData && totalData.length > 0) {
            totalData = totalData.filter(x => x != '');
            if (totalData && totalData.length > 0) {
              if (!totalData.includes(this.ngForm.controls['variety_line_code'].value)) {
                Swal.fire({
                  title: '<p style="font-size:25px;">Form is not filled Properly.</p>',
                  icon: 'error',
                  confirmButtonText:
                    'OK',
                  confirmButtonColor: '#B64B1D'
                })
                return
              }
            }
          }
        }

        this.productionService.postRequestCreator('check-quantity-of-seed-inventory', param).subscribe(data => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
            let total_qtyData = param && param.quantity_data ? param.quantity_data : '';
            console.log('total_qtyData', param.quantity_data)
            this.showDetsail = false;
            this.showetailsPage = false;
            this.tittle = 'Production Schedule and Availability of Breeder Seed (BSP-II)'
            this.showFirstDetailsPage = true;
            this.isSearch = true;
            this.validationErr = false;
            // this.showlotpage=false;
            // this.showetailsPage=false
            // this.editDataValue=true;
            this.submitted = true;
            this.editDataValue = true;
            let datas2 = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';

            if (datas2 && datas2.length > 0 && !this.showparental) {
              datas2.forEach((el, i) => {
                this.ngForm.controls['bsp2Arr']['controls'][i].controls['showDisableDate'].setValue(true);
                this.ngForm.controls['bsp2Arr']['controls'][i].controls['showDisableInspectionDate'].setValue(true);
                this.ngForm.controls['bsp2Arr']['controls'][i].controls['quantity_of_bs_shown'].setValue(el && el.total_breederseed ? el.total_breederseed : '0')
                this.ngForm.controls['bsp2Arr']['controls'][i].controls['quantity_of_ns_shown'].setValue(el && el.type_of_class ? el.type_of_class : '0');
                this.ngForm.controls['bsp2Arr']['controls'][i].controls['class_of_seed_v2'].setValue(el && el.type_of_class ? el.type_of_class : '0');
                this.ngForm.controls['bsp2Arr']['controls'][i].controls['qty_seed_sown'].setValue(el && el.total_breederseed ? el.total_breederseed : '0')
              })
            }
            if (this.showparental && total_qtyData && total_qtyData.length > 0) {
              total_qtyData.forEach((el, i) => {
                this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['showDisableDate'].setValue(true);
                this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['showDisableInspectionDate'].setValue(true);
                if (el.variety_line_code == this.ngForm.controls['variety_line_code'].value) {
                  this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['quantity_of_bs_shown'].setValue(el && el.seed_class_id ? el.seed_class_id : '0')
                  this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['quantity_of_ns_shown'].setValue(el && el.quantity_sown ? el.quantity_sown : '0');
                  this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['class_of_seed_v2'].setValue(el && el.seed_class_id ? el.seed_class_id : '0');
                  this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].setValue(el && el.seed_class_id ? el.seed_class_id : '0');
                  if (this.unit == 'Qt') {
                    this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['qty_seed_sown'].setValue(el && el.quantity_sown ? (el.quantity_sown / 100) : '0')
                  } else {
                    this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['qty_seed_sown'].setValue(el && el.quantity_sown ? el.quantity_sown : '0')
                  }
                }
              })

            }

          } else if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 400) {
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
          }
          else {
            this.validationErr = true
            Swal.fire({
              title: '<p style="font-size:25px;">Something Went Wrong.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#B64B1D'
            }).then(x => {

            })
            return;
          }
        })

      }
    }
    else {
      let data = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';
      let index = this.employeeIndex;
      if (data && data.length > 0) {
        data.forEach((el, i) => {
          el['quantity_data'] = el['total_quantity']
        })
        let datas = this.ngForm.value && this.ngForm.value.bsp2Arr && this.ngForm.value.bsp2Arr[index] && this.ngForm.value.bsp2Arr[index].quantity_data
          ? this.ngForm.value.bsp2Arr[index].quantity_data : '';
        for (let key in datas) {
          if (datas[key].lot_no == '' || datas[key].lot_no == null
            || datas[key].year_of_indent == '' || datas[key].year_of_indent == null
            || datas[key].season == '' || datas[key].season == null
            || datas[key].stage == '' || datas[key].stage == null
            || datas[key].tag_no == '' || datas[key].tag_no == null
            || datas[key].tag_no.length < 1 || datas[key].quantity_available == null
            || datas[key].quantity_available == '' || this.quantityError


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
        let quantity_data;
        const formArray = this.ngForm.get('bsp2Arr') as FormArray;
        let total_quantity;
        if (data && data[this.employeeIndex] && data[this.employeeIndex].quantity_data && data[this.employeeIndex].quantity_data.length > 0) {

          data[this.employeeIndex].quantity_data.forEach((item, skillIndex) => {
            let val = formArray.controls[0]['controls'].total_quantity.controls[skillIndex].controls.lot_no.lotlist.filter(x => x.lot_id == item.lot_no)
            item.lot_num_data = val && val[0] && val[0].display_text ? val[0].display_text : '';
            item.lot_num_data_v2 = val && val[0] && val[0].display_text ? val[0].display_text : '';
            // if (this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[skillIndex].controls.lot_no && this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[skillIndex].controls.lot_no.lotlist) {
            //   let abc = this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[skillIndex].controls.lot_no.lotlist.filter((x => x.lot_id == item.lot_id))

            //   item['lot_num_data'] = abc && abc[0] && abc[0].display_text ? abc[0].display_text : '';
            // }

          })
        }
        data.forEach((el, i) => {
          el['user_id'] = UserId.toString();
          el['bspc_2_id'] = this.editId.toString();
          let sum = 0;
          el['quantity_data'].forEach((item, index2) => {
            let tagno = []
            item['user_id'] = UserId ? UserId.toString() : '';
            item['tag_id'] = item && item['tag_id'] ? item['tag_id'].toString() : "";
            item['user_id'] = UserId.toString(),
              item['bspc_2_id'] = this.editId.toString(),
              item['year'] = item && item['year_of_indent'] ? item['year_of_indent'].toString() : "";
            item['stage_id'] = item && item['stage'] ? item['stage'].toString() : "";
            item['tag_quantity'] = item && item['tag_quantitys_2'] ? item['tag_quantitys_2'].toString() : "";
            item['tag_quantitys_2'] = item && item['tag_quantitys_2'] ? item['tag_quantitys_2'].toString() : "";
            item['lot_id'] = item && item['lot_no'] ? item['lot_no'].toString() : "";
            item['lot_number'] = item && item['lot_num_data'] ? item['lot_num_data'].toString() : item && item['lot_num_data_v2'] ? item['lot_num_data_v2'].toString() : item && item['lot_number'] ? item['lot_number'].toString() : "";
            item['lot_num_data_v2'] = item && item['lot_num_data'] ? item['lot_num_data'].toString() : item && item['lot_num_data_v2'] ? item['lot_num_data_v2'].toString() : item && item['lot_number'] ? item['lot_number'].toString() : "";
            // item['seed_class_id'] = (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value).toString()
            if (this.showparental) {
              item['seed_class_id'] = item && item['type_of_class'] ? item['type_of_class'].toString() : "";
            }
            else {
              item['seed_class_id'] = (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value) ? (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value).toString() : '';
            }
            if (item && item.tag_no && item.tag_no.length > 1) {
              item['quantity_available'] = item && item['quantity_available_v2'] ? (((item['quantity_available_v2']))).toString() : "";
              item['quantity_sown'] = item && item['quantity_sown_v2'] ? (((item['quantity_sown_v2']))).toString() : "";
            } else {
              if (this.units == 'Qt') {
                item['quantity_available'] = item && item['quantity_available'] ? (this.checkDecimal(item['quantity_available'])).toString() : "";
                item['quantity_sown'] = item && item['quantity_sown'] ? (this.checkDecimal(item['quantity_sown'])).toString() : "";
              } else {
                item['quantity_available'] = item && item['quantity_available'] ? ((item['quantity_available'])).toString() : "";
                item['quantity_sown'] = item && item['quantity_sown'] ? ((item['quantity_sown'])).toString() : "";
              }
            }
            sum += item && item['quantity_sown'] ? parseFloat(item['quantity_sown']) : 0,

              item.tag_no.forEach(x => {
                tagno.push(x && x.display_text ? x.display_text : '')
                // tagQty.push(item && item['quantity_sown'] ? item['quantity_sown'].toString() : '0')
              }
              )
            item['tag_number'] = tagno && (tagno.length > 0) ? tagno.toString() : '';
            // item['tag_quantity'] = this.unit == 'Qt' ?  item['tag_quantity'].split(',').map(num => (parseFloat(num) * 100).toString()).join(','): item['tag_quantity'].split(',').map(num => (parseFloat(num)).toString()).join(',');
            if (!this.showparental) {
              total_quantity = el['total_quantity'] = [{
                seed_class_id: (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value).toString(),
                quantity_sown: sum ? sum.toString() : ''
              }]
            }
          })
        })
        if (this.showparental) {

          let quantityData = data && data[this.employeeIndex] && data[this.employeeIndex].quantity_data ? data[this.employeeIndex].quantity_data : '';

          let sumBySeedClassId = {};
          let varietyLineCodeBySeedClassId = {};
          if (quantityData && quantityData.length > 0) {
            quantityData.forEach(item => {
              let seedClassId = item.seed_class_id;
              let quantitySown = parseInt(item.quantity_sown);
              sumBySeedClassId[seedClassId] = (sumBySeedClassId[seedClassId] || 0) + quantitySown;
              varietyLineCodeBySeedClassId[seedClassId] = item.variety_line_code;
              // sumBySeedClassId[seedClassId] = (sumBySeedClassId[seedClassId] || 0) + quantitySown ;
            });

            // Create an array of sums with seed_class_id and quantity_sown
            let sumsArray = [];
            for (let seedClassId in sumBySeedClassId) {
              sumsArray.push({
                seed_class_id: seedClassId,
                quantity_sown: sumBySeedClassId && sumBySeedClassId[seedClassId] ? sumBySeedClassId[seedClassId].toString() : 0,
                variety_line_code: varietyLineCodeBySeedClassId[seedClassId]
              });
            }

            // Add the sums array to jsonData
            total_quantity = sumsArray;
          }
        }
        const param = {
          'user_id': UserId.toString(),
          'bspc_2_id': this.editId.toString(),
          quantity_data: data && data[this.employeeIndex] && data[this.employeeIndex].quantity_data ? data[this.employeeIndex].quantity_data : "",
          total_quantity: total_quantity
        }
        let total_qtyDatas = param && param.quantity_data ? param.quantity_data : '';
        if (this.showparental && total_qtyDatas && total_qtyDatas.length > 0) {
          let totalData = []
          total_qtyDatas.forEach((el, i) => {
            totalData.push(el && el.variety_line_code ? el.variety_line_code : '')
          })
          if (totalData && totalData.length > 0) {
            totalData = totalData.filter(x => x != '');
            if (totalData && totalData.length > 0) {
              if (!totalData.includes(this.ngForm.controls['variety_line_code'].value)) {
                Swal.fire({
                  title: '<p style="font-size:25px;">Form is not filled Properly.</p>',
                  icon: 'error',
                  confirmButtonText:
                    'OK',
                  confirmButtonColor: '#B64B1D'
                })
                return
              }
            }
          }
        }
        this.productionService.postRequestCreator('check-edit-quantity-of-seed-inventory', param).subscribe(data => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
            let total_qtyData = param && param.quantity_data ? param.quantity_data : '';
            this.showDetsail = false;
            this.showetailsPage = false;
            this.tittle = 'Production Schedule and Availability of Breeder Seed (BSP-II)'
            this.showFirstDetailsPage = true;
            this.isSearch = true;
            // this.editDataValue=true;
            this.submitted = true;
            this.editDataValue = true;
            let datas2 = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';
            if (datas2 && datas2.length > 0 && !this.showparental) {
              datas2.forEach((el, i) => {
                this.ngForm.controls['bsp2Arr']['controls'][i].controls['showDisableDate'].setValue(true);
                this.ngForm.controls['bsp2Arr']['controls'][i].controls['showDisableInspectionDate'].setValue(true);
                this.ngForm.controls['bsp2Arr']['controls'][i].controls['quantity_of_bs_shown'].setValue(el && el.total_breederseed ? el.total_breederseed : '0')
                this.ngForm.controls['bsp2Arr']['controls'][i].controls['quantity_of_ns_shown'].setValue(el && el.type_of_class ? el.type_of_class : '0');
                this.ngForm.controls['bsp2Arr']['controls'][i].controls['class_of_seed_v2'].setValue(el && el.type_of_class ? el.type_of_class : '0');
                this.ngForm.controls['bsp2Arr']['controls'][i].controls['qty_seed_sown'].setValue(el && el.total_breederseed ? el.total_breederseed : '0')
              })
            }
            if (this.showparental && total_qtyData && total_qtyData.length > 0) {
              total_qtyData.forEach((el, i) => {
                this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['showDisableDate'].setValue(true);
                this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['showDisableInspectionDate'].setValue(true);
                if (el.variety_line_code == this.ngForm.controls['variety_line_code'].value) {
                  this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['quantity_of_bs_shown'].setValue(el && el.seed_class_id ? el.seed_class_id : '0')
                  this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['quantity_of_ns_shown'].setValue(el && el.quantity_sown ? el.quantity_sown : '0');
                  this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['class_of_seed_v2'].setValue(el && el.seed_class_id ? el.seed_class_id : '0');
                  this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['type_of_class'].setValue(el && el.seed_class_id ? el.seed_class_id : '0');
                  if (this.unit == 'Qt') {
                    this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['qty_seed_sown'].setValue(el && el.quantity_sown ? (el.quantity_sown / 100) : '0')
                  } else {
                    this.ngForm.controls['bsp2Arr']['controls'][this.employeeIndex].controls['qty_seed_sown'].setValue(el && el.quantity_sown ? el.quantity_sown : '0')
                  }
                }
              })

            }
          } else if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 400) {

            Swal.fire({
              title: '<p style="font-size:25px;">Validation Error.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#B64B1D'
            })
            return;
          }
          else {
            let data = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';

            Swal.fire({
              title: '<p style="font-size:25px;">Something Went Wrong.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#B64B1D'
            })
            return;
          }
        })

      }
    }
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
    if (!this.is_update) {
      let data = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';
      for (let key in data) {
        if (data[key].address == '' || data[key].address == null
          || data[key].area_shown == '' || data[key].area_shown == null
          || data[key].expected_date_harvest == '' || data[key].expected_date_harvest == null
          || data[key].district.district_code == '' || data[key].district.district_code == null
          || data[key].district.district_name == '' || data[key].district.district_name == null
          || data[key].state.state_code == '' || data[key].district.district_code == null
          || data[key].state.state_name == '' || data[key].district.district_name == null
          || data[key].expected_date_harvest.singleDate.formatted == '' || data[key].expected_date_harvest.singleDate.formatted == null
          || data[key].expected_date_inspection.singleDate.formatted == '' || data[key].expected_date_inspection.singleDate.formatted == null
          || data[key].date_of_showing == '' || data[key].date_of_showing.singleDate.formatted == null
          || data[key].expected_production == '' || data[key].expected_production == null
          // || data[key].qty_seed_sown == '' || data[key].qty_seed_sown == null
          // || data[key].class_of_seed_v2 == '' || data[key].class_of_seed_v2 == null

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
      let datas = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';
      // let index = this.employeeIndex;
      if (datas && datas.length > 0) {
        datas.forEach((el, i) => {
          el['quantity_of_ns_shown'] = el && el['quantity_of_ns_shown'] ? (el['quantity_of_ns_shown'].toString()) : '0'
          el['quantity_of_bs_shown'] = el && el['quantity_of_bs_shown'] ? (el['quantity_of_bs_shown'].toString()) : '0'
        })
        datas.forEach((el, i) => {
          el['year'] = this.ngForm.controls['year'].value,
            el['season'] = this.ngForm.controls['season'].value,
            el['variety_code'] = this.ngForm.controls['variety'].value,
            el['crop_code'] = this.ngForm.controls['crop'].value,
            el['variety_line_code'] = this.ngForm.controls['variety_line_code'].value,
            el['production_type'] = this.productionType,
            el['quantity_data'] = el['total_quantity'];
          el['variety_name'] = this.selectVariety;
          el['variely_line'] = this.selectParental;
          // this.getparentalData()
          el['date_of_showing'] = el && el.date_of_showing && (el.date_of_showing.singleDate) && el.date_of_showing.singleDate.formatted ? this.convertDates(el.date_of_showing.singleDate.formatted) : "";
          el['state_name'] = el && el.state && el.state.state_name ? el.state.state_name : '';
          el['state_code'] = el && el.state && el.state.state_code ? (el.state.state_code.toString()) : '';
          let expected_date_inspection = el && el.expected_date_inspection && el.expected_date_inspection.singleDate && el.expected_date_inspection.singleDate.formatted ? el.expected_date_inspection.singleDate.formatted : '';
          let formatted = expected_date_inspection ? expected_date_inspection.split('-') : ''
          let expected_date_inspectionfrom = formatted && formatted[0] ? this.convertDates(formatted[0]) : "";
          let expected_date_inspection_to = formatted && formatted[1] ? this.convertDates(formatted[1]) : "";
          el['expected_inspection_from'] = expected_date_inspectionfrom ? expected_date_inspectionfrom : '';
          el['expected_inspection_to'] = expected_date_inspection_to ? expected_date_inspection_to : '';
          let expected_harvest = el && el.expected_date_harvest && el.expected_date_harvest.singleDate && el.expected_date_harvest.singleDate.formatted ? el.expected_date_harvest.singleDate.formatted : '';
          let splitexpected_harvest = expected_harvest ? expected_harvest.split('-') : '';
          let expected_harvest_from = splitexpected_harvest && splitexpected_harvest[0] ? this.convertDates(splitexpected_harvest[0]) : "";
          el['expected_harvest_from'] = expected_harvest_from ? expected_harvest_from : '';
          let expected_harvest_to = splitexpected_harvest && splitexpected_harvest[1] ? this.convertDates(splitexpected_harvest[1]) : "";
          el['expected_harvest_to'] = expected_harvest_to ? expected_harvest_to : '';
          el['user_id'] = userData && userData.id ? (userData.id.toString()) : ''
          el['district_name'] = el && el.district && el.district.district_name ? el.district.district_name : '';
          el['district_code'] = el && el.district && el.district.district_code ? (el.district.district_code.toString()) : '';
          if (el['class_of_seed_v2'] == '6') {
            el['quantity_of_ns_shown'] = el && el['quantity_of_ns_shown'] ? ((el['quantity_of_ns_shown']).toString()) : '0'
            delete el['quantity_of_bs_shown']
          } else {
            el['quantity_of_bs_shown'] = el && el['quantity_of_ns_shown'] ? ((el['quantity_of_ns_shown']).toString()) : '0';
            delete el['quantity_of_ns_shown']
          }

          if (this.unit == 'Qt') {
            el['qty_seed_sown'] = el && el['qty_seed_sown'] ? ((el['qty_seed_sown']).toString()) : '0';
          } else {
            el['qty_seed_sown'] = el && el['qty_seed_sown'] ? (el['qty_seed_sown'].toString()) : '0';
          }
          el['class_of_seed'] = (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value == '6' ? 'ns' : 'bs')
          let sum = 0;
          el['quantity_data'].forEach((item, index2) => {
            let tagno = []
            item['user_id'] = UserId ? UserId.toString() : '';
            item['tag_id'] = item && item['tag_id'] ? item['tag_id'].toString() : "";
            item['year'] = item && item['year_of_indent'] ? item['year_of_indent'].toString() : "";
            item['stage_id'] = item && item['stage'] ? item['stage'].toString() : "";
            item['tag_quantity'] = item && item['tag_quantitys_2'] ? item['tag_quantitys_2'].toString() : "";
            item['tag_quantitys_2'] = item && item['tag_quantitys_2'] ? item['tag_quantitys_2'].toString() : "";
            // item['quantity_available'] = item && item['quantity_available'] ? (this.removeDecimal(parseFloat(item['quantity_available']))).toString() : "";
            // item['quantity_sown'] = item && item['quantity_sown'] ? (this.removeDecimal(parseFloat(item['quantity_sown']))).toString() : "";
            item['lot_id'] = item && item['lot_no'] ? item['lot_no'].toString() : "";
            item['lot_num_data_v2'] = item && item['lot_num_data_v2'] ? item['lot_num_data_v2'].toString() : "";
            item['lot_number'] = item && item['lot_num_data_v2'] ? item['lot_num_data_v2'].toString() : "";
            // item['seed_class_id'] = (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value).toString()
            if (this.showparental) {
              item['seed_class_id'] = item && item['type_of_class'] ? (((item['type_of_class']))).toString() : "";
            }
            else {
              item['seed_class_id'] = (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value) ? (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value).toString() : '';
            }
            if (item && item.tag_no && item.tag_no.length > 1) {
              item['quantity_available'] = item && item['quantity_available_v2'] ? (((item['quantity_available_v2']))).toString() : "";
              item['quantity_sown'] = item && item['quantity_sown_v2'] ? (((item['quantity_sown_v2']))).toString() : "";
            } else {
              if (this.units == 'Qt') {
                item['quantity_available'] = item && item['quantity_available'] ? ((item['quantity_available'])).toString() : "";

                item['quantity_sown'] = item && item['quantity_sown'] ? ((item['quantity_sown']).toString()) : '';
                //  item['quantity_sown_v1'] = item && item['quantity_sown'] ? ((this.formatNumber(item['quantity_sown']))).toString() : "";
                //   item['quantity_sown'] = item && item['quantity_sown_v1'] ? (this.checkDecimal(item['quantity_sown_v1'])).toString() : "";
              } else {
                item['quantity_available'] = item && item['quantity_available'] ? ((item['quantity_available'])).toString() : "";
                item['quantity_sown'] = item && item['quantity_sown'] ? ((item['quantity_sown'])).toString() : "";
              }
            }
            sum += item && item['quantity_sown'] ? parseFloat(item['quantity_sown']) : 0;
            if (item && item.tag_no && item.tag_no.length > 0) {
              item.tag_no.forEach(x => {
                tagno.push(x && x.display_text ? x.display_text : '')
                // tagQty.push(item && item['quantity_sown'] ? item['quantity_sown'].toString() : '0')
              }
              )
            }
            item['tag_number'] = tagno && (tagno.length > 0) ? tagno.toString() : '';
            // item['tag_quantity'] = this.unit == 'Qt' ?  item['tag_quantity'].split(',').map(num => (parseFloat(num) * 100).toString()).join(','): item['tag_quantity'].split(',').map(num => (parseFloat(num)).toString()).join(',');
            if (!this.showparental) {
              el['total_quantity'] = [{
                seed_class_id: (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value).toString(),
                quantity_sown: sum ? sum.toString() : ''
              }]
            }
            else {
              let quantityData = el && el.quantity_data ? el.quantity_data : ''

              let sumBySeedClassId = {};
              let varietyLineCodeBySeedClassId = {};
              if (quantityData && quantityData.length > 0) {
                quantityData.forEach(item => {
                  let seedClassId = item.seed_class_id;
                  let quantitySown = parseFloat(item.quantity_sown);
                  sumBySeedClassId[seedClassId] = (sumBySeedClassId[seedClassId] || 0) + quantitySown;
                  varietyLineCodeBySeedClassId[seedClassId] = item.variety_line_code;
                  // sumBySeedClassId[seedClassId] = (sumBySeedClassId[seedClassId] || 0) + quantitySown ;
                });

                // Create an array of sums with seed_class_id and quantity_sown
                let sumsArray = [];
                for (let seedClassId in sumBySeedClassId) {
                  sumsArray.push({
                    seed_class_id: seedClassId,
                    quantity_sown: sumBySeedClassId && sumBySeedClassId[seedClassId] ? sumBySeedClassId[seedClassId].toString() : 0,
                    variety_line_code: varietyLineCodeBySeedClassId[seedClassId]
                  });
                }

                // Add the sums array to jsonData
                el.total_quantity = sumsArray;
              }
            }
          })
        })

        if (this.showparental) {
          datas.forEach((el, i) => {
            let sum = 0;
            el.total_quantity.forEach((item, i) => {
              console.log(item, 'item')
              sum += item && item.quantity_sown ? parseFloat(item.quantity_sown) : 0;
              if (this.unit == 'Qt' && this.showparental) {
                el.qty_seed_sown = sum ? (sum / 100).toString() : '0';
              } else {
                el.qty_seed_sown = sum ? (sum).toString() : '0';
              }
            })
          })
        }

        datas.forEach((el, i) => {
          if (new Date(el['date_of_showing']) > (new Date(el['expected_inspection_from']))) {
            Swal.fire({
              title: '<p style="font-size:25px;">Expected date of inspection should be later than Date of Sowing.</p>',
              icon: 'error',
              showCancelButton: false,
              showConfirmButton: true,
              // timer: 5000
              // confirmButton:false
            })
            this.showDateValidation = true;
            return 0;
          }
          else if (new Date(el['expected_inspection_from']) >= (new Date(el['expected_harvest_from']))) {
            Swal.fire({
              title: '<p style="font-size:25px;">Expected date of harvesting should be later than start date of Expected date of inspection.</p>',
              icon: 'error',
              showCancelButton: false,
              showConfirmButton: true,
              // timer: 5000
              // confirmButton:false
            });
            this.showDateValidation = true;
            return 0;
          } else {
            this.showDateValidation = false;
          }
        })
        const param = {
          data: datas
        }
        if (!this.showDateValidation) {
          this.productionService.postRequestCreator('register-quantity-of-seed-inventory', param).subscribe(data => {

            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
              Swal.fire({
                title: '<p style="font-size:25px;">Data saved Successfully.</p>',
                icon: 'success',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#B64B1D'
              }).then(x => {
                this.getBsp2List();
                // this.showparental = false;
                this.getVarietyDetails();
                this.getVarietyDetailsData();
                this.editShowData = false;
                this.getparentalData()
                this.editDataValue = true;
                this.showAddMoreInthisVariety = false;
                this.getMasterBspReportData(null, null, null);

                // const FormArray = this.ngForm.get('bsp2Arr') as FormArray;
                //     this.ngForm.controls['bsp2Arr']['controls'][0].controls['state'].setValue('');
                //     this.ngForm.controls['bsp2Arr']['controls'][0].controls['district'].setValue('');
                //     this.ngForm.controls['bsp2Arr']['controls'][0].controls['address'].setValue('');
                //     this.ngForm.controls['bsp2Arr']['controls'][0].controls['area_shown'].setValue('');
                //     this.ngForm.controls['bsp2Arr']['controls'][0].controls['date_of_showing'].setValue('');
                //     this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_ns_shown'].setValue('');
                //     this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_bs_shown'].setValue('');
                //     this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_inspection'].setValue('');
                //     this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_harvest'].setValue('');
                //     this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_production'].setValue('');
                if (this.showparental || this.editDataValue) {
                  if (this.parentalListSecond && this.parentalListSecond.length < 1) {
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['variety_line_code'].setValue('');
                    this.ngForm.controls['variety_line_code'].setValue('');
                    this.ngForm.controls['variety'].setValue('');
                    this.selectVariety = '';
                    this.selectParental = ''
                    this.showparental = false;
                    this.editDataValue = false;
                    // this.showAddMoreInthisVariety = false;
                    // this.showparentalList=false;
                    this.editDataValue = false;
                  } else {
                    const FormArray = this.ngForm.get('bsp2Arr') as FormArray;
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['state'].setValue('');
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['district'].setValue('');
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['address'].setValue('');
                    this.ngForm.controls['variety_line_code'].setValue('');
                    this.selectParental = '';
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['area_shown'].setValue('');
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['date_of_showing'].setValue('');
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_ns_shown'].setValue('');
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_bs_shown'].setValue('');
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_inspection'].setValue('');
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_harvest'].setValue('');
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_production'].setValue('');
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_breederseed'].setValue('');
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['type_of_class'].setValue('');
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['qty_seed_sown'].setValue('');
                    this.ngForm.controls['bsp2Arr']['controls'][0].controls['permission_of_production'].setValue('');
                    this.showparental = true;
                    this.editDataValue = true;
                    // this.showAddMoreInthisVariety = true;
                    this.showparentalList = true;
                  }
                } else {
                  this.ngForm.controls['variety_line_code'].setValue('');
                  this.selectParental = '';
                  const FormArray = this.ngForm.get('bsp2Arr') as FormArray;
                  this.ngForm.controls['bsp2Arr']['controls'][0].controls['state'].setValue('');
                  this.ngForm.controls['bsp2Arr']['controls'][0].controls['district'].setValue('');
                  this.ngForm.controls['bsp2Arr']['controls'][0].controls['address'].setValue('');
                  this.ngForm.controls['bsp2Arr']['controls'][0].controls['area_shown'].setValue('');
                  this.ngForm.controls['bsp2Arr']['controls'][0].controls['date_of_showing'].setValue('');
                  this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_ns_shown'].setValue('');
                  this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_bs_shown'].setValue('');
                  this.ngForm.controls['bsp2Arr']['controls'][0].controls['class_of_seed_v2'].setValue('');
                  this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_inspection'].setValue('');
                  this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_harvest'].setValue('');
                  this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_production'].setValue('');
                  this.ngForm.controls['bsp2Arr']['controls'][0].controls['qty_seed_sown'].setValue('');
                  this.ngForm.controls['bsp2Arr']['controls'][0].controls['permission_of_production'].setValue('');
                  this.ngForm.controls['variety_line_code'].setValue('');
                  this.ngForm.controls['variety'].setValue('');
                  this.selectVariety = '';
                  this.selectParental = ''
                  const controlToKeep = FormArray.at(0);
                  FormArray.clear();
                  this.editDataValue = false;
                  this.showAddMoreInthisVariety = false;
                  this.showVarietyDetails = false;
                  this.showparentalList = false;
                  FormArray.push(controlToKeep);
                }
                this.removeSecondPage()

                // .get('total_quantity') as FormArray;
              })
              // return ;
            } else {
              Swal.fire({
                title: '<p style="font-size:25px;">Something Went Wrong.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#B64B1D'
              })
              // this.ngForm.value.bsp2Arr.forEach((el, i) => {
              // el.total_quantity.forEach(item => {
              // if (this.unit == 'Qt') {
              // el.total_quantity.forEach(item => {
              // item['tag_quantity'] = item['tag_quantity'].split(',').map(num => (parseFloat(num) / 100).toString()).join(',');
              // // item['lot_no']=item['lot_num_data'];
              // })
              // } else {
              // el.total_quantity.forEach(item => {
              // item['tag_quantity'] = item['tag_quantity'].split(',').map(num => (parseFloat(num)).toString()).join(',');
              // // item['lot_no']=item['lot_num_data'];
              // })
              // }
              // })
              // })
            }
          })
        }
      }
    } else {
      let data = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';
      for (let key in data) {
        if (data[key].address == '' || data[key].address == null
          || data[key].area_shown == '' || data[key].area_shown == null
          || data[key].expected_date_harvest == '' || data[key].expected_date_harvest == null
          || data[key].district.district_code == '' || data[key].district.district_code == null
          || data[key].district.district_name == '' || data[key].district.district_name == null
          || data[key].state.state_code == '' || data[key].district.district_code == null
          || data[key].state.state_name == '' || data[key].district.district_name == null
          || data[key].expected_date_harvest.singleDate.formatted == '' || data[key].expected_date_harvest.singleDate.formatted == null
          || data[key].expected_date_inspection.singleDate.formatted == '' || data[key].expected_date_inspection.singleDate.formatted == null
          || data[key].date_of_showing.singleDate.formatted == '' || data[key].date_of_showing.singleDate.formatted == null
          || data[key].expected_production == '' || data[key].expected_production == null

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
      let datas = this.ngForm.value && this.ngForm.value.bsp2Arr ? this.ngForm.value.bsp2Arr : '';

      // let index = this.employeeIndex;


      if (datas && datas.length > 0) {
        datas.forEach((el, i) => {
          el['year'] = this.ngForm.controls['year'].value,
            el['variely_line'] = this.selectParental ? this.selectParental : '';
          el['variety_name'] = this.selectVariety ? this.selectVariety : '';
          el['season'] = this.ngForm.controls['season'].value,
            el['variety_code'] = this.ngForm.controls['variety'].value,
            el['crop_code'] = this.ngForm.controls['crop'].value,
            el['production_type'] = this.productionType,
            el['bspc_2_id'] = this.editId ? (this.editId.toString()) : ''
          el['user_id'] = userData && userData.id ? (userData.id.toString()) : '';
          el['variety_line_code'] = this.ngForm.controls['variety_line_code'].value,
            el['variely_line'] = this.selectParental ? this.selectParental : '';
          el['variety_name'] = this.selectVariety ? this.selectVariety : '';
          el['variety_name'] = this.selectVariety;
          el['variely_line'] = this.selectParental;

          el['quantity_data'] = el['total_quantity']
          el['date_of_showing'] = el && el.date_of_showing && (el.date_of_showing.singleDate) && el.date_of_showing.singleDate.formatted ? this.convertDates(el.date_of_showing.singleDate.formatted) : "";
          el['state_name'] = el && el.state && el.state.state_name ? el.state.state_name : '';
          el['state_code'] = el && el.state && el.state.state_code ? (el.state.state_code.toString()) : '';
          let expected_date_inspection = el && el.expected_date_inspection && el.expected_date_inspection.singleDate && el.expected_date_inspection.singleDate.formatted ? el.expected_date_inspection.singleDate.formatted : '';
          let formatted = expected_date_inspection ? expected_date_inspection.split('-') : ''
          let expected_date_inspectionfrom = formatted && formatted[0] ? this.convertDates(formatted[0]) : "";
          let expected_date_inspection_to = formatted && formatted[1] ? this.convertDates(formatted[1]) : "";
          el['expected_inspection_from'] = expected_date_inspectionfrom ? expected_date_inspectionfrom : '';
          el['expected_inspection_to'] = expected_date_inspection_to ? expected_date_inspection_to : '';
          let expected_harvest = el && el.expected_date_harvest && el.expected_date_harvest.singleDate && el.expected_date_harvest.singleDate.formatted ? el.expected_date_harvest.singleDate.formatted : '';
          let splitexpected_harvest = expected_harvest ? expected_harvest.split('-') : '';
          let expected_harvest_from = splitexpected_harvest && splitexpected_harvest[0] ? this.convertDates(splitexpected_harvest[0]) : "";
          el['expected_harvest_from'] = expected_harvest_from ? expected_harvest_from : '';
          let expected_harvest_to = splitexpected_harvest && splitexpected_harvest[1] ? this.convertDates(splitexpected_harvest[1]) : "";
          el['expected_harvest_to'] = expected_harvest_to ? expected_harvest_to : '';
          el['user_id'] = userData && userData.id ? (userData.id.toString()) : ''
          el['district_name'] = el && el.district && el.district.district_name ? el.district.district_name : '';
          el['district_code'] = el && el.district && el.district.district_code ? (el.district.district_code.toString()) : '';
          if (el['class_of_seed_v2'] == '6') {
            el['quantity_of_ns_shown'] = el && el['class_of_seed_v2'] ? (el['class_of_seed_v2'].toString()) : '0'
            delete el['quantity_of_bs_shown']
          } else {
            el['quantity_of_bs_shown'] = el && el['class_of_seed_v2'] ? (el['class_of_seed_v2'].toString()) : '0';
            delete el['quantity_of_ns_shown']
          }
          // el['quantity_of_ns_shown'] = el && el['quantity_of_ns_shown'] ? (el['quantity_of_ns_shown'].toString()) : '0'
          // }else{
          // el['quantity_of_bs_shown'] = el && el['quantity_of_bs_shown'] ? (el['quantity_of_bs_shown'].toString()) : '0';
          el['qty_seed_sown'] = el && el['qty_seed_sown'] ? (el['qty_seed_sown'].toString()) : '0';
          el['class_of_seed'] = (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value == '6' ? 'ns' : 'bs')
          let sum = 0;
          el['quantity_data'].forEach((item, index2) => {
            let tagno = []
            item['user_id'] = UserId ? UserId.toString() : '';
            item['variety_name'] = this.selectVariety;
            item['variely_line'] = this.selectParental;
            item['tag_id'] = item && item['tag_id'] ? item['tag_id'].toString() : "";
            item['bspc_2_id'] = this.editId ? (this.editId.toString()) : ''
            item['user_id'] = userData && userData.id ? (userData.id.toString()) : '';
            item['year'] = item && item['year_of_indent'] ? item['year_of_indent'].toString() : "";
            item['stage_id'] = item && item['stage'] ? item['stage'].toString() : "";
            item['tag_quantity'] = item && item['tag_quantitys_2'] ? item['tag_quantitys_2'].toString() : "";
            item['tag_quantitys_2'] = item && item['tag_quantitys_2'] ? item['tag_quantitys_2'].toString() : "";
            // item['quantity_available'] = item && item['quantity_available'] ? (this.removeDecimal(parseFloat(item['quantity_available']))).toString() : "";
            // item['quantity_sown'] = item && item['quantity_sown'] ? (this.removeDecimal(parseFloat(item['quantity_sown']))).toString() : "";
            item['lot_id'] = item && item['lot_no'] ? item['lot_no'].toString() : "";
            item['lot_number'] = item && item['lot_num_data'] ? item['lot_num_data'].toString() : item && item['lot_num_data_v2'] ? item['lot_num_data_v2'].toString() : item && item['lot_number'] ? item['lot_number'].toString() : "";
            item['lot_num_data_v2'] = item && item['lot_num_data_v2'] ? item['lot_num_data_v2'].toString() : "";
            if (item && item.tag_no && item.tag_no.length > 1) {
              item['quantity_available'] = item && item['quantity_available_v2'] ? (((item['quantity_available_v2']))).toString() : "";
              item['quantity_sown'] = item && item['quantity_sown_v2'] ? (((item['quantity_sown_v2']))).toString() : "";
            } else {
              if (this.units == 'Qt') {
                item['quantity_available'] = item && item['quantity_available'] ? (this.checkDecimal(item['quantity_available'])).toString() : "";
                item['quantity_sown'] = item && item['quantity_sown'] ? (this.checkDecimal(item['quantity_sown'])).toString() : "";
              } else {
                item['quantity_available'] = item && item['quantity_available'] ? ((item['quantity_available']).toString()) : "";
                item['quantity_sown'] = item && item['quantity_sown'] ? ((item['quantity_sown']).toString()) : "";
              }
            }
            item['seed_class_id'] = (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value).toString()
            sum += item && item['quantity_sown'] ? parseFloat(item['quantity_sown']) : 0;
            if (item && item.tag_no && item.tag_no.length > 0) {
              item.tag_no.forEach(x => {
                tagno.push(x && x.display_text ? x.display_text : '')
                // tagQty.push(item && item['quantity_sown'] ? item['quantity_sown'].toString() : '0')
              }
              )
            }
            item['tag_number'] = tagno && (tagno.length > 0) ? tagno.toString() : '';
            // item['tag_quantity'] = this.unit == 'Qt' ?  item['tag_quantity'].split(',').map(num => (parseFloat(num) * 100).toString()).join(','): item['tag_quantity'].split(',').map(num => (parseFloat(num)).toString()).join(',');
            if (!this.showparental) {
              el['total_quantity'] = [{
                seed_class_id: (this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].value).toString(),
                quantity_sown: sum ? sum.toString() : ''
              }]
            }
            else {
              let quantityData = el && el.quantity_data ? el.quantity_data : ''

              let sumBySeedClassId = {};
              let varietyLineCodeBySeedClassId = {};
              if (quantityData && quantityData.length > 0) {
                quantityData.forEach(item => {
                  let seedClassId = item.seed_class_id;
                  let quantitySown = parseInt(item.quantity_sown);
                  sumBySeedClassId[seedClassId] = (sumBySeedClassId[seedClassId] || 0) + quantitySown;
                  varietyLineCodeBySeedClassId[seedClassId] = item.variety_line_code;
                  // sumBySeedClassId[seedClassId] = (sumBySeedClassId[seedClassId] || 0) + quantitySown ;
                });

                // Create an array of sums with seed_class_id and quantity_sown
                let sumsArray = [];
                for (let seedClassId in sumBySeedClassId) {
                  sumsArray.push({
                    seed_class_id: seedClassId,
                    quantity_sown: sumBySeedClassId && sumBySeedClassId[seedClassId] ? sumBySeedClassId[seedClassId].toString() : 0,
                    variety_line_code: varietyLineCodeBySeedClassId[seedClassId]
                  });
                }

                // Add the sums array to jsonData
                el.total_quantity = sumsArray;
              }
            }
          })
        })
        datas.forEach((el, i) => {
          if (new Date(el['date_of_showing']) > (new Date(el['expected_inspection_from']))) {
            Swal.fire({
              title: '<p style="font-size:25px;">Expected date of inspection should be later than Date of Sowing.</p>',
              icon: 'error',
              showCancelButton: false,
              showConfirmButton: true,
              // confirmButton:false
            })
            this.showDateValidation = true;
            return;
          }
          else if (new Date(el['expected_inspection_from']) >= (new Date(el['expected_harvest_from']))) {
            Swal.fire({
              title: '<p style="font-size:25px;">Expected date of harvesting should be later than start date of Expected date of inspection.</p>',
              icon: 'error',
              showCancelButton: false,
              showConfirmButton: true,
              // confirmButton:false
            });
            this.showDateValidation = true;
            return;
          } else {
            this.showDateValidation = false;
          }
        })
        if (this.showparental) {
          datas.forEach((el, i) => {
            let sum = 0;
            el.total_quantity.forEach((item, i) => {
              sum += item && item.quantity_sown ? parseFloat(item.quantity_sown) : 0;
              if (this.unit == 'Qt' && this.showparental) {
                el.qty_seed_sown = sum ? (sum / 100).toString() : '0';
              } else {
                el.qty_seed_sown = sum ? sum.toString() : '0';
              }
            })
          })
        }

        const param = {
          bspc_2_id: this.editId ? (this.editId.toString()) : '',
          user_id: userData && userData.id ? (userData.id.toString()) : '',
          data: datas[0]
        }
        if (!this.showDateValidation) {
          this.productionService.postRequestCreator('edit-bsp-proforma-2s-data', param).subscribe(data => {

            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
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
                this.getVarietyDetailsData();
                this.ngForm.controls['variety'].setValue('')
                this.selectVariety = '';
                this.ngForm.controls['variety_line_code'].setValue('')
                this.selectParental = '';
                this.removeSecondPage()
                this.is_update = false;
                this.editDataValue = false;
                this.showAddMoreInthisVariety = false;
                this.editShowData = false;
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['state'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['district'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['address'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['area_shown'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['date_of_showing'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_ns_shown'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['class_of_seed_v2'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['quantity_of_bs_shown'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_inspection'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_date_harvest'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['expected_production'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_breederseed'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['total_breederseed_v2'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['type_of_class'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['qty_seed_sown'].setValue('');
                this.ngForm.controls['bsp2Arr']['controls'][0].controls['permission_of_production'].setValue('');

              })
              // return ;
            } else {
              Swal.fire({
                title: '<p style="font-size:25px;">Something Went Wrong.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#B64B1D'
              })
              // this.ngForm.value.bsp2Arr.forEach((el, i) => {
              // el.total_quantity.forEach(item => {
              // if (this.unit == 'Qt') {
              // el.total_quantity.forEach(item => {
              // item['tag_quantity'] = item['tag_quantity'].split(',').map(num => (parseFloat(num) / 100).toString()).join(',');
              // // item['lot_no']=item['lot_num_data'];
              // })
              // } else {
              // el.total_quantity.forEach(item => {
              // item['tag_quantity'] = item['tag_quantity'].split(',').map(num => (parseFloat(num)).toString()).join(',');
              // // item['lot_no']=item['lot_num_data'];
              // })
              // }
              // })
              // })
            }
          })
        }
      }
    }
  }
  editData(id) {
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
    this.editShowData = true

    this.showparental = true;
    this.productionService.postRequestCreator('get-bsp-proforma-2s-edit-data', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      let bspProforma2SeedData = response && response.bspProforma2SeedData ? response.bspProforma2SeedData : '';
      this.bspProforma2SeedData = response && response.bspProforma2SeedData ? response.bspProforma2SeedData : '';
      let bspProforma2Data = response && response.bspProforma2Data ? response.bspProforma2Data : '';
      let datas = []
      let req_data = bspProforma2Data && bspProforma2Data.req_data ? bspProforma2Data.req_data : '';

      if (req_data) {
        datas.push(req_data)
        this.bsp2Arrlist = datas;
      }
      for (let i = 1; i < this.bsp2Arrlist.length; i++) {
        this.addEmployee()
      }
      this.ngForm.controls['variety'].setValue(req_data && req_data.variety_code ? req_data.variety_code : '', { emitEvent: false });
      this.selectVariety = req_data && req_data.variety_name ? req_data.variety_name : '';
      this.getparentalData()
      this.selectParental = req_data && req_data.variely_line ? req_data.variely_line : '';
      if (this.showparental) {

        this.ngForm.controls['variety_line_code'].setValue(req_data && req_data.variety_line_code ? req_data.variety_line_code : '');
      }

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
      this.getTypeofSeed()
      if (this.bsp2Arrlist && this.bsp2Arrlist.length > 0) {

        this.bsp2Arrlist.forEach((el, i) => {
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].setValue(el && el.class_of_seed && (el.class_of_seed == 'bs') ? '7' : '6')
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['state'].setValue({ state_code: el && el.state_code ? el.state_code : '', state_name: el && el.state_name ? el.state_name : '' });
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['district'].setValue({ district_name: el && el.district_name ? el.district_name : '', district_code: el && el.district_code ? el.district_code : '' });
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['area_shown'].setValue(el && el.area_shown ? el.area_shown : '');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['address'].setValue(el && el.address ? el.address : '');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['quantity_of_bs_shown'].setValue(el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : '');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['quantity_of_ns_shown'].setValue(el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : '');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['expected_production'].setValue(el && el.expected_production ? el.expected_production : '');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['showDisableDate'].setValue(true);
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['class_of_seed_v2'].setValue(el && el.class_of_seed_v2 ? el.class_of_seed_v2 : '');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['showDisableInspectionDate'].setValue(true);
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['date_of_showing'].setValue({
            isRange: false,
            singleDate: {
              formatted: el && el.date_of_showing && el.date_of_showing ? el.date_of_showing : '',
              jsDate: el && el.date_of_showing && el.date_of_showing ? new Date(el.date_of_showing) : ''
            }
          })
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['expected_date_inspection'].setValue({
            isRange: false,
            singleDate: {
              formatted: el && el.expected_inspection_from && el.expected_inspection_from && (el.expected_inspection_to) ? this.convertDatesto(el.expected_inspection_from) + '-' + this.convertDatesto(el.expected_inspection_to) : '',
              jsDate: el && el.expected_inspection_from && el.expected_inspection_from ? new Date(el.expected_inspection_from) : ''
            }
          })
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['expected_date_harvest'].setValue({
            isRange: false,
            singleDate: {
              formatted: el && el.expected_harvest_from && el.expected_harvest_from && (el.expected_harvest_from) ? this.convertDatesto(el.expected_harvest_from) + '-' + this.convertDatesto(el.expected_harvest_to) : '',
              jsDate: el && el.expected_harvest_from && el.expected_harvest_from ? new Date(el.expected_harvest_from) : ''
            }
          })
          for (let index = 1; index < el.quantity_data.length; index++) {
            this.addEmployeeSkill(i)
          }
          el.quantity_data.forEach((item, index) => {
            // getTypeofSeedHybrid
            this.getList()
            if (this.showparental) {
              this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.variety_line_code.setValue(item && item.variety_line_code ? item.variety_line_code : '');
              // if (this.ngForm.controls['variety_line_code'].value == this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.variety_line_code.value) {
              //  if(this.unit=='Qt'){
              //    this.ngForm.controls['bsp2Arr']['controls'][i].controls['qty_seed_sown'].setValue(item && item.quantity_sown ? ((parseFloat(item.quantity_sown) / 100).toString()) : '');
              //  }else{
              //   this.ngForm.controls['bsp2Arr']['controls'][i].controls['qty_seed_sown'].setValue(item && item.quantity_sown ? (item.quantity_sown.toString()) : '0');
              //  }
              // }
              this.getTypeofSeedHybrid(i, index)
              this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.type_of_class.setValue(item && item.seed_class_id ? item.seed_class_id : '');
            }
            if (!this.showparental) {
            }
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['qty_seed_sown'].setValue(el && el.qty_seed_sown ? el.qty_seed_sown : '');
            this.getStageList(i, index);
            this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.stage.setValue(item && item.stage ? item.stage : '');
            this.getSeedInventoYear(i, index);
            this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.year_of_indent.setValue(item && item.year_of_indent ? item.year_of_indent : '');
            this.getSeedInventoSeason(i, index);
            this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.season.setValue(item && item.season ? item.season : '');
            this.getLotNo(i, index);
            this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.lot_no.setValue(item && item.lot_id ? item.lot_id : '');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.lot_num_data.setValue(item && item.lot_num_data ? item.lot_num_data : '');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.lot_num_data_v2.setValue(item && item.lot_num_data_v2 ? item.lot_num_data_v2 : '');
            this.getTagNo(i, index);
            this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_available_v2.setValue(item && item.quantity_available_v2 ? (item.quantity_available_v2.toString()) : '0');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_sown_v2.setValue(item && item.quantity_sown_v2 ? (item.quantity_sown_v2.toString()) : '0');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.tag_id.setValue(item && item.tag_id ? item.tag_id : '');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.tag_quantity.setValue(item && item.tag_quantity ? item.tag_quantity : '');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.tag_quantitys_2.setValue(item && item.tag_quantitys_2 ? (item.tag_quantitys_2.toString()) : '');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_sown_second.setValue(item && item.quantity_sown_second ? (((item.quantity_sown_second)).toString()) : '');
            this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_available_second.setValue(item && item.quantity_available_second ? (((item.quantity_available_second)).toString()) : '');
            if (this.units == 'Qt') {
              this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_available.setValue(item && item.quantity_available ? ((parseFloat(item.quantity_available) / 100).toString()) : '');
              this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_sown.setValue(item && item.quantity_sown ? ((parseFloat(item.quantity_sown) / 100).toString()) : '');
            } else {
              this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_available.setValue(item && item.quantity_available ? (item.quantity_available.toString()) : '0');
              this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_sown.setValue(item && item.quantity_sown ? (item.quantity_sown.toString()) : '0');
            }
            let tagNo = [];
            let arr = item && item.tag_number ? (item.tag_number.split(',')) : ''
            if (arr && arr.length > 0) {
              for (let inx = 0; inx < arr.length; inx++) {
                tagNo.push({ value: arr[inx], display_text: arr[inx] })
                this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.tag_no.setValue(tagNo);
                if (tagNo.length >= 2) {
                  this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.showQtyFielddisable.setValue(true)
                } else {
                  this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.showQtyFielddisable.setValue(false)
                }
              }
            }
            let total_quantity_data = el && el.total_quantity ? el.total_quantity : '';
            if (this.units == 'Qt') {
              // this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_breederseed'].setValue(sumdatas ? (sumdatas.toFixed(2)) : 0);
              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_breederseed_v2'].setValue(total_quantity_data && total_quantity_data[0] && total_quantity_data[0].quantity_sown ? (total_quantity_data[0].quantity_sown / 100) : '');
              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_breederseed'].setValue(total_quantity_data && total_quantity_data[0] && total_quantity_data[0].quantity_sown ? (total_quantity_data[0].quantity_sown / 100) : '');
            } else {
              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_breederseed'].setValue(total_quantity_data && total_quantity_data[0] && total_quantity_data[0].quantity_sown ? total_quantity_data[0].quantity_sown : '');
              this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_breederseed_v2'].setValue(total_quantity_data && total_quantity_data[0] && total_quantity_data[0].quantity_sown ? (total_quantity_data[0].quantity_sown) : '');
            }
            this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].setValue(total_quantity_data && total_quantity_data[0] && total_quantity_data[0].seed_class_id ? total_quantity_data[0].seed_class_id : '');
            this.editDataValue = true;
            this.is_update = true

          })


        })
      }
    })


    // this.showparental=true
  }
  removeSecondPage() {
    let param = this.ngForm.value ? this.ngForm.value : ''
    let bsp2Arr = param && param.bsp2Arr ? param.bsp2Arr : '';
    if (bsp2Arr && bsp2Arr.length > 0) {
      bsp2Arr.forEach((el, i) => {

        el.total_quantity.forEach((item, index) => {

          this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.stage.setValue('');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.year_of_indent.setValue('');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.season.setValue('')
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.lot_no.setValue('');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.tag_no.setValue('');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.quantity_available.setValue('');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.quantity_sown.setValue('');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.quantity_sown.setValue('');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.quantity_sown_v2.setValue('');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.quantity_available_v2.setValue('');
          // this.ngForm.controls['total_breederseed'].setValue('');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.type_of_class.setValue('');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.variety_line_code.setValue('');
          this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_breederseed'].setValue('')
          // this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].setValue('');

        })
      })
    }
    if (bsp2Arr && bsp2Arr.length > 0) {
      bsp2Arr.forEach((el, i) => {
        el.total_quantity.forEach((item, index) => {
          while (this.getNestedFormArray(i).controls.length != 1) {
            this.removeEmployeeSkillSecond(i, index)
          }
        })
      })
    }

  }

  // formatNumber(number) {
  //   if (Number.isInteger(number)) {
  //     return number.toString(); // If the number is an integer, return it as a string
  //   } else {
  //     return number.toFixed(2); // If the number has decimal places, format it with two decimal places
  //   }
  // }
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
  getUserData(reportData) {
    console.log('reportData get user data other component', reportData);
    let localData = localStorage.getItem('BHTCurrentUser')
    let parseData = JSON.parse(localData);
    let userId;
    if (reportData) {

      userId = reportData.user_id;
      console.log("curr agency_id===", userId);
    } else {
      userId = parseData && parseData.id;
      console.log("curr login_id===", userId);
    }
    this.master.postRequestCreator('get-user-data-details', null, {
      search: {
        user_id: userId ? userId.toString() : ''
      }
    }).subscribe(apiresponse => {
      let res = apiresponse && apiresponse.EncryptedResponse && apiresponse.EncryptedResponse.data ? apiresponse.EncryptedResponse.data : '';

      console.log("curr agencyDeails===", res);
      this.agencyName = res && res[0] && res[0].agency_name ? res[0].agency_name : '';
      this.bspcAddress = res && res[0] && res[0].address ? res[0].address : '';
      this.stateName = res && res[0] && res[0].state_name ? res[0].state_name : '';
      this.districtName = res && res[0] && res[0].district_name ? res[0].district_name : '';

      this.contact_person_name = res && res[0] && res[0].contact_person_name ? res[0].contact_person_name : '';
      this.designation = res && res[0] && res[0].designation ? res[0].designation : '';
    })
    // this.userName= parseData && parseData.name ? parseData.name :''
  }
  async getMasterBspReportData(loadPageNumberData: number = 1, searchData: any | undefined = undefined, reportData) {

    const route = 'get-bsp2-data-list';
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId;
    let reportStatus;
    console.log("jjjj", reportData);
    if (reportData) {
      this.ngForm.controls["year"].setValue(reportData.year)
      this.ngForm.controls["season"].setValue(reportData.season)
      this.ngForm.controls["crop"].setValue(reportData.crop_code)
      UserId = reportData.user_id;
      console.log("ui", UserId);

      reportStatus = { report_status: "bsp_two_report_status" };
      console.log("isPdfDisbaled");

    } else {
      UserId = data.id
    }
    const result = await this.master.postRequestCreator(route, null, {

      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      pageSize: 100,

      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        user_id: UserId,
        production_type: this.productionType,
        ...reportStatus

      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined &&
        apiResponse.EncryptedResponse !== undefined &&
        apiResponse.EncryptedResponse.status_code == 200) {
        // let reportDataArray = [];
        this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data : [];
        console.log("all Data", this.allData);
        // console.log(this.allData[0].m_crop);
        // this.allData = this.inventoryData

        if (this.allData === undefined) {
          this.allData = [];
        }
        this.filterPaginateSearch.itemList = this.allData;
        if (this.allData) {
          if (reportData) {
            console.log('report data======', reportData)
            this.getQr(reportData);
          }
        }

        let reportDataArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.data ? (apiResponse.EncryptedResponse.data.data) : '';
        let bsp1VarietyListArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.bsp1VarietyListArr ? (apiResponse.EncryptedResponse.data.bsp1VarietyListArr) : '';
        let directIndentVarietyListTotalArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.directIndentVarietyListTotalArr ? (apiResponse.EncryptedResponse.data.directIndentVarietyListTotalArr) : '';
        let carryOverData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.carryOverData ? (apiResponse.EncryptedResponse.data.carryOverData) : '';
        carryOverData = carryOverData ? carryOverData.flat() : '';
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
        else if (bsp1VarietyListArr && bsp1VarietyListArr.length < 1 && directIndentVarietyListTotalArr.length > 0) {
          directIndentVarietyListTotalArr = directIndentVarietyListTotalArr.filter((arr, index, self) =>
            index === self.findIndex((t) => (t.indent_of_brseed_direct_line_ids === arr.indent_of_brseed_direct_line_ids && t.variety_code === arr.variety_code)))
          directIndentVarietyListTotalArr.forEach((el, i) => {
            el['total_targeted_qty'] = el && el.total_quantity ? el.total_quantity : 0
          })
          combineArrays = directIndentVarietyListTotalArr
        }

        if (combineArrays && combineArrays.length > 0) {
          combineArrays.forEach((el, i) => {
            el['quantity'] = el && el['quantity'] ? el['quantity'] : 0
            if ((el && el.variety_line_code) || (el && el.variety_code_line)) {
              el.total_targeted_qty = el && el.target_quantity ? (el.target_quantity + el.quantity) : '';
            } else {
              el.total_targeted_qty = el && el.target_quantity ? (el.target_quantity + el.quantity) : el && el.total_qty ? (el.total_qty + el.quantity) : '';
            }
          })
        }
        console.log('combineArrays,', combineArrays)

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
        console.log(this.data1, 'this.data1')
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
        if (this.data1 && this.data1.length > 0) {
          if (carryOverData && carryOverData.length > 0) {
            this.data1.forEach(item1 => {
              if (item1.variety_line_code === "NA" || item1.variety_line_code === null) {
                carryOverData.forEach(item2 => {
                  if (item1.variety_code === item2.variety_code) {
                    if (item2 && item2.meet_target && item2.meet_target == 2) {
                      if (this.unit == 'Qt') {
                        item1.carry_total_qty = (item2.carry_total_qty / 100);
                      } else {
                        item1.carry_total_qty = item2.carry_total_qty;
                      }
                      item1.meet_target = item2.meet_target;
                    } else {
                      item1.carry_total_qty = 0;
                      item1.meet_target = item2.meet_target;
                    }
                  }
                });
              } else {
                carryOverData.forEach(item2 => {
                  if (item1.variety_code === item2.variety_code && item1.variety_line_code == item2.variety_code_line) {
                    if (item2 && item2.meet_target && item2.meet_target == 2) {
                      if (this.unit == 'Qt') {
                        item1.carry_total_qty = (item2.carry_total_qty / 100);
                      } else {
                        item1.carry_total_qty = item2.carry_total_qty;
                      }
                      // item1.carry_total_qty = item2.carry_total_qty;
                      item1.meet_target = item2.meet_target;
                    } else {
                      item1.carry_total_qty = 0;
                      item1.meet_target = item2.meet_target;
                    }
                  }
                });
              }
            });
          }
        }

      }


    });
  }
  // shouldDisplayVarietyDiv(): boolean {
  //   console.log('isSearch:', this.isSearch);
  //   console.log('Variety length:', this.VarietyList1.length);
  //   console.log('editDataValue:', this.editDataValue);
  //   return (this.isSearch && this.Variety.length > 0) || this.editDataValue;
  // }
  
  
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
      next_val: this.runningNumber2 ? this.runningNumber2 : 0,
      search: {
        "production_type": this.productionType
      }
    }
    this.breeder.postRequestCreator('update-report-runing-number', null, param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      // this.checkReferenceData()
      // this.runningNumber=res ? res :'';
    })
  }
  getQr(data1 = null) {
    // console.log("reportData====",reportData);
    // let reportStatus ;
    // if(reportData){
    //   this.ngForm.controls['year'].setValue(reportData.year);
    //   this.ngForm.controls['season'].setValue(reportData.season);
    //   this.ngForm.controls['crop'].setValue(reportData.crop);  
    //   reportStatus = {"report_status":"bsp_two_report_status"}
    // }
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData);
    let user_id;
    if (data1) {
      user_id = data1.user_id
      console.log("responseData1 user_id is", user_id);

    } else {
      user_id = data.id;
      console.log("pdf user_id is", user_id);
    }
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
          target_quantity: item1.target_quantity,
          quantity: matchingItem.quantity || 0,
          total_qty: matchingItem.total_qty || 0
        });
      } else {
        // If no matching item is found, push only the item from array1 into combinedArray
        combinedArray.push({
          id: item1.id,
          variety_code: item1.variety_code,
          variety_line_code: item1.variety_line_code || '',
          target_quantity: item1.target_quantity,
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
  getReferenceNumber() {
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        report_name: 'BSP-II',

      }
    }
    this.breeder.postRequestCreator('generate-report-runing-number', null, param).subscribe(apiResponse => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        let data = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data : '';
        let reportName = data && data[0] && data[0].report_name ? data[0].report_name : 'Na';
        let year = data && data[0] && data[0].year ? data[0].year : 'Na';
        let running_number = data && data[0] && data[0].running_number ? data[0].running_number : 'Na';
        let season = data && data[0] && data[0].season ? data[0].season : 'Na';
        let referenceNumber = reportName + '/' + year + '/' + season + '/' + running_number;
        this.referenceNumber = referenceNumber ? referenceNumber : 'NA';

        return this.referenceNumber
      }
    })
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
      // console.log(aFormatted);
    } else {
      return a

    }
  }
  getClass(item) {
    // console.log(item,'item')
  }
  getTotalQtyData(qty, qty1) {
    let quantity = qty ? qty : 0;
    let quantity2;
    if (this.unit == 'Qt') {
      quantity2 = qty1 ? this.convertToQty(qty1) : 0;
    } else {
      quantity2 = qty1 ? (qty1) : 0;
    }

    return quantity - quantity2
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
  // Iterate through originalData

  // Call the function and print the result

  // editData(id) {
  //   const getLocalData = localStorage.getItem('BHTCurrentUser');
  //   let datas = JSON.parse(getLocalData)
  //   let UserId = datas.id
  //   const param = {
  //     bspc_2_id: id,
  //     user_id: UserId
  //   }
  //   this.editDataValue = true;
  //   this.is_update = true;
  //   this.editId = id;
  //   this.showlotpage = true;
  //   // this.showparental=true

  //   this.getTypeofSeed()
  //   this.getStatelist()
  //   // if (bspProforma2SeedData && bspProforma2SeedData.length > 0) {
  //   // let mergedData = {};

  //   // bspProforma2SeedData.forEach(entry => {
  //   // if (!mergedData[entry.bsp_proforma_2_id]) {
  //   // mergedData[entry.bsp_proforma_2_id] = { ...entry };
  //   // mergedData[entry.bsp_proforma_2_id].tag_id = [entry.tag_id];
  //   // mergedData[entry.bsp_proforma_2_id].tag_range = [entry.tag_range];

  //   // } else {
  //   // mergedData[entry.bsp_proforma_2_id].tag_id.push(entry.tag_id);
  //   // mergedData[entry.bsp_proforma_2_id].tag_range.push(entry.tag_range);
  //   // mergedData[entry.bsp_proforma_2_id].quantity_sown += entry.quantity_sown;
  //   // }
  //   // });

  //   // // Convert arrays to strings
  //   // for (let key in mergedData) {
  //   // mergedData[key].tag_id = mergedData[key].tag_id.join(',');
  //   // mergedData[key].tag_range = mergedData[key].tag_range.join(',');
  //   // }

  //   // let result = Object.values(mergedData);

  //   this.showparental = true;
  //   this.productionService.postRequestCreator('get-bsp-proforma-2s-edit-data',  param).subscribe(data => {
  //     let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
  //     let bspProforma2SeedData = response && response.bspProforma2SeedData ? response.bspProforma2SeedData : '';
  //     let bspProforma2Data = response && response.bspProforma2Data ? response.bspProforma2Data : '';
  //     let datas = []
  //     let req_data = bspProforma2Data && bspProforma2Data.req_data ? bspProforma2Data.req_data : '';

  //     if (this.parentalList && this.parentalList.length > 0) {
  //       let parentalData = this.parentalList.filter(x => x.value == this.ngForm.controls['variety_line_code'].value);


  //     }

  //     // let checkStatus = this.varietyListofBsp2list.filter(x=>x.value == this.ngForm.controls['variety'].value)
  //     // if(checkStatus && checkStatus[0] && checkStatus[0].variety_type && checkStatus[0].variety_type=='hybrid'){
  //     // this.showparental=true;
  //     // this.getparentalData()
  //     // }
  //     // else{
  //     // this.showparental=false;
  //     // this.parentalList=[]

  //     // }
  //     if (this.varietyListofBsp2list && this.varietyListofBsp2list.length > 0) {
  //       let res = this.varietyListofBsp2list.filter(x => x.value == this.ngForm.controls['variety'].value);
  //       this.selectVariety = res && res[0] && res[0].display_text ? res[0].display_text : ''
  //     }
  //     if (req_data) {
  //       datas.push(req_data)
  //       this.bsp2Arrlist = datas;
  //     }
  //     for (let i = 1; i < this.bsp2Arrlist.length; i++) {
  //       this.addEmployee()
  //     }

  //     this.ngForm.controls['variety_line_code'].setValue(req_data && req_data.variety_line_code ? req_data.variety_line_code : '');

  //     this.ngForm.controls['variety'].setValue(req_data && req_data.variety_code ? req_data.variety_code : '');
  //     this.getparentalData()
  //     this.selectParental = req_data && req_data.variely_line ? req_data.variely_line : '';
  //     this.selectVariety = req_data && req_data.variety_name ? req_data.variety_name : '';
  //     let checkStatus
  //     // if(this.is_update){
  //     checkStatus = this.varietyListofBsp2list.filter(x => x.value == this.ngForm.controls['variety'].value)

  //     if (checkStatus && checkStatus[0] && checkStatus[0].variety_type && checkStatus[0].variety_type == 'hybrid') {
  //       this.showparental = true;
  //       this.getparentalData()
  //     }
  //     else {
  //       this.showparental = false;
  //       this.parentalList = []

  //     }
  //     // this.selectParental=req_data && bspProforma2Data.variely_line ? bspProforma2Data.variely_line :'';

  //     if (this.bsp2Arrlist && this.bsp2Arrlist.length > 0) {
  //       this.bsp2Arrlist.forEach((el, i) => {
  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].setValue(el && el.class_of_seed && (el.class_of_seed == 'bs') ? '7' : '6')
  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['state'].setValue({ state_code: el && el.state_code ? el.state_code : '', state_name: el && el.state_name ? el.state_name : '' });
  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['district'].setValue({ district_code: el && el.district_code ? el.district_code : '', district_name: el && el.district_name ? el.district_name : '' });
  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['address'].setValue(el && el.address ? el.address : '');
  //         // state
  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['area_shown'].setValue(el && el.area_shown ? el.area_shown : '');
  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['quantity_of_bs_shown'].setValue(el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : '');
  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['quantity_of_ns_shown'].setValue(el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : '');
  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['expected_production'].setValue(el && el.expected_production ? el.expected_production : '');
  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['showDisableDate'].setValue(true);
  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['showDisableInspectionDate'].setValue(true);
  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['date_of_showing'].setValue({
  //           isRange: false,
  //           singleDate: {
  //             formatted: el && el.date_of_showing && el.date_of_showing ? el.date_of_showing : '',
  //             jsDate: el && el.date_of_showing && el.date_of_showing ? new Date(el.date_of_showing) : ''
  //           }
  //         })
  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['expected_date_inspection'].setValue({
  //           isRange: false,
  //           singleDate: {
  //             formatted: el && el.expected_inspection_from && el.expected_inspection_from && (el.expected_inspection_to) ? this.convertDatesto(el.expected_inspection_from) + '-' + this.convertDatesto(el.expected_inspection_to) : '',
  //             jsDate: el && el.expected_inspection_from && el.expected_inspection_from ? new Date(el.expected_inspection_from) : ''
  //           }
  //         })
  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['expected_date_harvest'].setValue({
  //           isRange: false,
  //           singleDate: {
  //             formatted: el && el.expected_harvest_from && el.expected_harvest_from && (el.expected_harvest_from) ? this.convertDatesto(el.expected_harvest_from) + '-' + this.convertDatesto(el.expected_harvest_to) : '',
  //             jsDate: el && el.expected_harvest_from && el.expected_harvest_from ? new Date(el.expected_harvest_from) : ''
  //           }
  //         })

  //         for (let index = 1; index < el.quantity_data.length; index++) {
  //           this.addEmployeeSkill(i)
  //         }

  //         el.quantity_data.forEach((item, index) => {
  //           this.getList()
  //           this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.variety_line_code.setValue(item && item.variety_line_code ? item.variety_line_code : '');
  //           this.getStageList(i, index);
  //           this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.stage.setValue(item && item.stage ? item.stage : '');
  //           // this.getTagNo(i,index)
  //           // tag_quantitys_2e

  //           this.getSeedInventoYear(i, index);
  //           // variety_line_code
  //           this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.year_of_indent.setValue(item && item.year_of_indent ? item.year_of_indent : '');
  //           this.getSeedInventoSeason(i, index);
  //           this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.season.setValue(item && item.season ? item.season : '');
  //           this.getLotNo(i, index);

  //           this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.lot_no.setValue(item && item.lot_id ? item.lot_id : '');
  //           this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.lot_num_data.setValue(item && item.lot_num_data ? item.lot_num_data : '');
  //           // this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.lot_no.setValue(item && item.lot_num_data ? item.lot_num_data : '');
  //           // this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.lot_num_data.setValue(item && item.lot_num_data ? item.lot_num_data : '');

  //           this.getTagNo(i, index);
  //           // tag_quantitys_
  //           this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.tag_id.setValue(item && item.tag_id ? item.tag_id : '');
  //           this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.tag_quantity.setValue(item && item.tag_quantity ? item.tag_quantity : '');
  //           this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.tag_quantitys_2.setValue(item && item.tag_quantitys_2 ? (item.tag_quantitys_2.toString()) : '');

  //           let tagNo = [];
  //           let arr = item && item.tag_number ? (item.tag_number.split(',')) : ''
  //           if (arr && arr.length > 0) {
  //             for (let inx = 0; inx < arr.length; inx++) {
  //               tagNo.push({ value: arr[inx], display_text: arr[inx] })
  //               this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.tag_no.setValue(tagNo);
  //               if (tagNo.length >= 2) {
  //                 this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.showQtyFielddisable.setValue(true)
  //               } else {
  //                 this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_quantity'].controls[index].controls.showQtyFielddisable.setValue(false)
  //               }
  //             }
  //           }
  //           this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_sown_second.setValue(item && item.quantity_sown_second ? (item.quantity_sown_second) : '');
  //           this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_available_second.setValue(item && item.quantity_available_second ? (item.quantity_available_second) : '');
  //           if (this.unit == 'Qt') {
  //             this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_available.setValue(item && item.quantity_available ? ((parseFloat(item.quantity_available) / 100).toString()) : '');
  //             this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_sown.setValue(item && item.quantity_sown ? ((parseFloat(item.quantity_sown) / 100).toString()) : '');
  //           } else {
  //             this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_available.setValue(item && item.quantity_available ? (item.quantity_available.toString()) : '0');
  //             this.ngForm.controls['bsp2Arr']['controls'][i].controls.total_quantity.controls[index].controls.quantity_sown.setValue(item && item.quantity_sown ? (item.quantity_sown.toString()) : '0');
  //           }



  //         })
  //         let total_quantity_data = el && el.total_quantity ? el.total_quantity : '';
  //         if (this.unit == 'Qt') {
  //           this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_breederseed'].setValue(total_quantity_data && total_quantity_data[0] && total_quantity_data[0].quantity_sown ? (total_quantity_data[0].quantity_sown / 100) : '');
  //         } else {
  //           this.ngForm.controls['bsp2Arr']['controls'][i].controls['total_breederseed'].setValue(total_quantity_data && total_quantity_data[0] && total_quantity_data[0].quantity_sown ? total_quantity_data[0].quantity_sown : '');
  //         }

  //         this.ngForm.controls['bsp2Arr']['controls'][i].controls['type_of_class'].setValue(total_quantity_data && total_quantity_data[0] && total_quantity_data[0].seed_class_id ? total_quantity_data[0].seed_class_id : '');


  //       })

  //     }

  //     this.editDataValue = true;
  //     this.is_update = true;

  //     // const data;
  //   })

  // }
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