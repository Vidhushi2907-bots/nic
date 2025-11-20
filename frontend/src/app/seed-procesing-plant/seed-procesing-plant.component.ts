import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IAngularMyDpOptions, IMyDate, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { checkDecimal } from 'src/app/_helpers/utility';
import * as html2PDF from 'html2pdf.js';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-seed-procesing-plant',
  templateUrl: './seed-procesing-plant.component.html',
  styleUrls: ['./seed-procesing-plant.component.css']
})
export class SeedProcesingPlantComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  dummyData = []

  ngForm!: FormGroup
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []
  allData: any;
  yearData;
  seasonlist;
  bagMarkDataofInvest;
  typeofSeed = [
    {
      name: 'Processed Seed (PS)',
      id: 1
    }
  ];
  dropdownSettings: IDropdownSettings = {};
  Variety = [
    {
      'variety_code': 'A0120',
      'variety_name': 'Variety 1'
    },
    {
      'variety_code': 'A0121',
      'variety_name': 'Variety 2'
    },
  ]
  BagMarka;
  carddata = [
    {
      purt_seed: 22,
      crop_name: "Wheat",
      id: 1,
      inert_matter: 23,
      varietyName: "PUSA",
      germination: '23',
      Label_Number: 23,
      lot_number: 23,
      date_of_test: 23

    },
    {
      purt_seed: 22,
      crop_name: "Wheat",
      id: 1,
      inert_matter: 23,
      varietyName: "PUSA",
      germination: '23',
      Label_Number: 23,
      lot_number: 23,
      date_of_test: 23

    },

  ];
  productiuon_name;
  breederaddress;
  productiuon_short_name;
  contactPersonName;
  designationname;
  cropData;
  tagsDetails = [
    {
      no_of_bags: 50,
      bag_weigth: 20,
      qty: 40
    },
    {
      no_of_bags: 40,
      bag_weigth: 10,
      qty: 50
    },
  ]

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
  LotData;

  showLotPageData: boolean;
  totalNoofBags: number;
  cropDataSecond: any;
  showLotPageDataSecond: boolean;
  investVerifyStackComposition: any;
  variety_name: any;
  provision_lot: any;
  no_of_bags: any;
  stackDatas: any;
  raw_seed_produced: any;
  LotPageDetails: any;
  totalStack: any;
  stackNo: number;
  totalQtyErr: boolean;
  variety_code: any;
  godown_no: any;
  totalQty;
  total_rejected: number;
  processing_loss: number;
  lot_id: any;
  verify_id: any;
  totalQtyData: string;
  tentative_recovery: any;
  recovery_qty;
  freezeData: boolean;
  carry_over_seed_details_id: any;
  carry_id: any;
  dropdownSettings2: IDropdownSettings = {};
  varietyList: any;
  disableField: boolean;
  highestNumber: any;
  classofSeedHarvested: string;
  classofSeedHarvestedData: string;
  alreadyCalled = false;
  line_variety_code: any;
  under_sizepercent;
  raw_seed_produced_data: any;
  line_variety_name: any;
  carry_over_user_id: any;
  checkStackNoRunningNo: any;
  is_potato: boolean ;
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
  constructor(private service: SeedServiceService, private fb: FormBuilder, private productionService: ProductioncenterService,
    private zone: NgZone
  ) {
    this.createForm();
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      crop_text: [''],
      variety: [''],
      variety_text: [''],
      lot_no: [''],
      getRadio: ['1'],
      total_breeder_qty: [''],
      under_size: [''],
      processing_loss: [''],
      total_rejected: [''],
      recovery_qty: [''],
      tentative_recovery: [''],
      variety_level_2: [''],
      bspc: this.fb.array([
      ]),
      spp: this.fb.array([
        this.sppCreateForm()

      ]),
      stack: this.fb.array([
        this.stackData()
      ])
    });
    this.ngForm.controls['season'].disable();


    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['season'].enable();
        this.selectVariety = '';
        this.selectCrop = '';
        this.ngForm.controls['crop'].reset('', { emitEvent: false, onlySelf: true });
        // this.getSeasonData()
        this.selectParentalLine = '';
        this.editData = false;
        this.selectPlot = '';
        this.isParentalLine = false;

        this.ngForm.controls['season'].markAsUntouched();
        this.selectParentalLine = '';
        this.getSeason();
        this.showGrid = false;
        this.ngForm.controls['variety_level_2'].setValue('', { emitEvent: false, onlySelf: true })
        this.ngForm.controls['lot_no'].setValue('', { emitEvent: false, onlySelf: true })
        this.isSearchClicked = false;

      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.selectVariety = '';
        this.selectCrop = '';
        this.selectParentalLine = '';
        this.selectPlot = '';
        this.ngForm.controls['crop'].reset('', { emitEvent: false, onlySelf: true });
        this.isParentalLine = false;
        this.editData = false;
        this.selectParentalLine = '';
        // this.getCropData()
        this.isSearchClicked = false;
        this.getStackData()
        this.getCrop();
        this.showGrid = false;
        this.ngForm.controls['variety_level_2'].setValue('', { emitEvent: false, onlySelf: true })
        this.ngForm.controls['lot_no'].setValue('', { emitEvent: false, onlySelf: true })
        // getCrop();
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {

        this.selectVariety = '';
        this.selectParentalLine = '';
        if (newvalue == "H1101") {
          this.is_potato = false;
          this.ngForm.controls['under_size'].setValue(0)
          this.ngForm.controls['processing_loss'].setValue(0)
          this.ngForm.controls['total_rejected'].setValue(0)
          this.under_sizepercent = 0;
          this.ngForm.controls['spp']['controls'][0].controls['bags'].setValue(50)
          this.getLossQty();
        } else {
          this.is_potato = true;
        }

        console.log('is_potato======',this.is_potato);

        if (newvalue.slice(0, 1) == "A") {
          this.unit = "Qt";
        } else {
          this.unit = "Kg";
        }
        this.selectPlot = '';
        this.editData = false;

        this.selectParentalLine = '';
        this.isSearchClicked = false;
        this.showGrid = false;
        this.isParentalLine = false;
        this.ngForm.controls['variety_level_2'].setValue('', { emitEvent: false, onlySelf: true })
        this.ngForm.controls['lot_no'].setValue('', { emitEvent: false, onlySelf: true })
        // this.getVarietyData()
        // getVariety();
      }
    });


    this.ngForm.controls['crop_text'].valueChanges.subscribe(item => {
      if (item) {
        this.cropData = this.cropDataSecond
        let response = this.cropDataSecond.filter(x =>
          x.crop_name.toLowerCase().includes(item.toLowerCase())
        );
        this.cropData = response
      }
      else {
        this.cropData = this.cropDataSecond
        // this.getCropData()
      }
    });


    this.ngForm.controls['variety_level_2'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.getListData();
        this.ngForm.controls['lot_no'].setValue('', { emitEvent: false, onlySelf: true })
        // getVariety();
      }
    });
    this.ngForm.controls['lot_no'].valueChanges.subscribe(item => {
      this.getListData();
    })
  }
  ngOnInit(): void {
    if (this.tagsDetails && this.tagsDetails.length > 0) {
      let sum = 0
      this.tagsDetails.forEach((el) => {
        sum += el && el.no_of_bags ? el.no_of_bags : 0,
          this.totalNoofBags = sum
      })
    }
    this.getYear();
    this.dropdownSettings = {
      idField: 'id',
      textField: 'bags',
      enableCheckAll: true,
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      itemsShowLimit: 1,

      limitSelection: -1,
    };
    this.dropdownSettings2 = {
      idField: 'variety_code',
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
  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }
  get spp(): FormArray {
    return this.ngForm.get('spp') as FormArray;
  }
  get stack(): FormArray {
    return this.ngForm.get('stack') as FormArray;
  }
  crop(item: any) {
    this.selectCrop = item && item.crop_name ? item.crop_name : ''
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropData = this.cropDataSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
  }
  cClick() {
    document.getElementById('crop').click()
  }

  searchData(data) {
    this.showGrid = true;
    this.ngForm.controls['variety_level_2'].setValue('')
    this.ngForm.controls['lot_no'].setValue('');
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
    this.getHarvestVariety();
    this.getListData();
    this.getLotDetails()

  }
  variety(item) {
    this.selectVariety = item && item.variety_name ? item.variety_name : ''
    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    // this.cropData = this.croplistSecond;
    console.log('item.variety_code=====', item.variety_code)
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
  }
  vClick() {
    document.getElementById('Variety').click()
  }
  showLotPage(data, lot_data, actionValue, lot) {
    this.showLotPageData = true;
    this.showLotPageDataSecond = false;
    this.showGrid = false;
    if (this.ngForm.controls['getRadio'].value == 1) {
      console.log(lot, 'lot')
      this.provision_lot = lot_data && lot_data.lot_number ? this.removeQuantity(lot_data.lot_number, lot.lot_qty) : ""
      this.variety_name = data && data.variety_name ? data.variety_name : "";
      this.line_variety_name = data && data.line_variety_name ? data.line_variety_name : ''
      this.variety_code = data && data.variety_code ? data.variety_code : "";
      this.godown_no = lot_data && lot_data.godown_no ? lot_data.godown_no : "";
      this.no_of_bags = lot_data && lot_data.no_of_bags ? lot_data.no_of_bags : "";
      this.stackDatas = lot_data && lot_data.verifyid ? this.getStackRang(lot_data.verifyid) : "";
      this.verify_id = lot_data && lot_data.verifyid ? lot_data.verifyid : '';
      this.LotPageDetails = actionValue;
      let plotDetails = lot_data && lot_data.plotDetails ? lot_data.plotDetails : "";
      this.provision_lot = lot && lot.lot_number ? this.removeQuantity(lot.lot_number, lot.lot_qty) : "";
      // this.no_of_bags = item && item.no_of_bags ? item.no_of_bags : "";    
      this.raw_seed_produced = lot && lot.lot_qty ? lot.lot_qty : '';
      // this.raw_seed_produced_data= lot && lot.lot_qty ? lot.lot_qty : '';
      this.lot_id = lot && lot.lot_id ? lot.lot_id : "";
      this.line_variety_code = data && data.variety_line_code ? data.variety_line_code : "";
      this.raw_seed_produced_data = lot && lot.lot_qty ? (lot.lot_qty) : '';
      this.carry_over_user_id = lot && lot.user_id ? lot.user_id : "";

      this.ngForm.controls['variety'].setValue(this.variety_code);
      // if (this.unit == 'Qt') {
      // } else {
      //   this.raw_seed_produced_data = lot && lot.lot_qty ? lot.lot_qty : '';
      //   // this.raw_seed_produced_data=  lot_data && lot_data.quantity_recieved ? (lot_data.quantity_recieved) : '';
      // }
      this.classofSeedHarvestedData = lot && lot.class_of_seed_harvested ? lot.class_of_seed_harvested : this.getBreederData(lot.seed_class_id, lot.stage_id)
    } else {
      this.LotPageDetails = actionValue;
      this.ngForm.controls['variety'].setValue(this.variety_code);
      this.variety_name = data && data.variety_name ? data.variety_name : "";
      this.variety_code = data && data.variety_code ? data.variety_code : "";
      this.provision_lot = lot_data && lot_data.lot_no ? this.getLotNoData(lot_data.lot_no) : "";
      this.lot_id = lot_data && lot_data.lot_id ? lot_data.lot_id : "";
      this.carry_over_seed_details_id = lot_data && lot_data.carry_over_seed_details_id ? lot_data.carry_over_seed_details_id : "";
      this.carry_id = lot_data && lot_data.carry_id ? lot_data.carry_id : "";
      this.raw_seed_produced = lot_data && lot_data.quantity_recieved ? lot_data.quantity_recieved : '';
      if (this.unit == 'Qt') {
        this.raw_seed_produced_data = lot_data && lot_data.quantity_recieved ? (lot_data.quantity_recieved / 100) : '';
      } else {
        this.raw_seed_produced_data = lot_data && lot_data.quantity_recieved ? (lot_data.quantity_recieved) : '';
      }
      this.no_of_bags = lot_data && lot_data.tag_no ? lot_data.tag_no.length : "";
      this.line_variety_code = data && data.line_variety_code ? data.line_variety_code : "";
      this.carry_over_user_id = lot_data && lot_data.user_id ? (lot_data.user_id) : '';
      this.classofSeedHarvestedData = 'Breeder' + ' ' + 'Seed' + ' ' + this.convertToRoman(lot_data.stage_id)

    }
    this.getStackData()
    // plotDetails.forEach((item) => {
    //   this.provision_lot = item && item.lot_number ? item.lot_number : "";
    //   // this.no_of_bags = item && item.no_of_bags ? item.no_of_bags : "";    
    //   this.raw_seed_produced = item && item.lot_qty ? item.lot_qty : '';
    // })
    if (data) {
      let bsp_details = data && data.bsp_details ? data.bsp_details : '';
      if (bsp_details && bsp_details.length > 0) {
        bsp_details.forEach((el) => {


        })
      }
    }
    // this.table2Data = data;

  }
  submit() {
    
    if (this.LotPageDetails == 1) {
      let sppData = this.ngForm.value ? this.ngForm.value.spp : '';
      let stackData = this.ngForm.value ? this.ngForm.value.stack : '';
      if (this.ngForm.controls['crop'].value == "H1101") {
        this.ngForm.controls['under_size'].patchValue(0)
      }else{
        if (sppData && sppData.length > 0) {
          for (let key in sppData) {
            if (sppData[key].no_of_bags == '' || sppData[key].bags == ''
              || sppData[key].bags == '' || sppData[key].type_of_seed == ''
              || sppData[key].qty == '' || !this.ngForm.controls['under_size'].value
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
      }
     
      if (parseFloat(this.raw_seed_produced_data) < this.ngForm.controls['total_breeder_qty'].value) {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Fill The Form Properly.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
        return;
      }

      if (stackData && stackData.length > 0) {
        for (let key in stackData) {
          if (stackData[key].stack_com == '' || stackData[key].type_of_seed == ''
            || stackData[key].bags == '' || stackData[key].type_of_seed == ''
            || stackData[key].bag_marka == '' || stackData[key].bag_marka.length < 1
            || stackData[key].showstackNo == '' || stackData[key].godown_no == ''
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
    }
    if (this.LotPageDetails == 2) {
      if (parseFloat(this.ngForm.controls['tentative_recovery'].value) > 100) {
        Swal.fire({
          title: '<p style="font-size:25px;">Tentative Recovery can not be greater than 100.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
        return;

      }
    }
    let data = this.ngForm.value;
    data.action = this.LotPageDetails;
    data.stackDatas = this.stackDatas;
    data.variety = this.variety_code;
    data.godown_no = this.godown_no;
    data.total_bags = this.no_of_bags;
    data.raw_seed_produced = this.raw_seed_produced;
    data.total_breeder_qty = this.totalQty;
    data.processing_loss = this.processing_loss;
    data.total_rejected = this.total_rejected;
    data.lot_id = this.lot_id;
    data.provision_lot = this.provision_lot;
    data.verify_id = this.verify_id;
    data.recovery_qty = this.recovery_qty;
    data.tentative_recovery = this.tentative_recovery;
    data.carry_over_seed_details_id = this.carry_over_seed_details_id;
    data.classofSeedHarvestedData = this.classofSeedHarvestedData;
    data.carry_id = this.carry_id;
    data.line_variety_code = this.line_variety_code;
    data.carry_over_user_id = this.carry_over_user_id;
    data.getRadio = this.ngForm.controls['getRadio'].value;
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData);
    let UserId = datas.id;
    data.user_id = UserId;

    if (data) {
      let stack = data && data.stack ? data.stack : '';
      if (this.LotPageDetails != 1) {
        data.stack = [];
        data.spp = []
      }
      if (stack && stack.length > 0 && this.LotPageDetails == 1) {
        stack.forEach((el) => {
          el.noofBags = []
          el.bag_marka.forEach((item, i) => {
            el.noofBags.push(item && item.bags ? item.bags : "");
          })
        })

      }

      if (stack && stack.length > 0) {
        // stack.forEach((el) => {
        //   el.noofBags=el && el.noofBags ? el.noofBags.toString():'';
        // })
      }
    }

    // parae
    const result = this.productionService.postRequestCreator('add-seed-processing-reg', data).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data saved Successfully.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        }).then(x => {
          this.showLotPageData = false;
          this.showGrid = true;
          this.stackComposition().clear
          while (this.spp.controls.length != 0) {
            this.remove(0)
          }
          while (this.stackComposition().controls.length != 0) {
            this.remove2(0)
          }
          this.addMore(0)
          this.addMore2(0)
          this.getListData();
          this.ngForm.controls['total_breeder_qty'].setValue('');
          this.ngForm.controls['under_size'].setValue('')
          this.ngForm.controls['processing_loss'].setValue('')
          this.ngForm.controls['total_rejected'].setValue('')
          this.ngForm.controls['recovery_qty'].setValue('')
          this.ngForm.controls['tentative_recovery'].setValue('')
          this.ngForm.controls['variety_level_2'].setValue('')
          this.ngForm.controls['lot_no'].setValue('');
          this.under_sizepercent = ''
          if(!this.is_potato){
            this.ngForm.controls['spp']['controls'][0].controls['bags'].setValue(50)
          }else{
            this.ngForm.controls['spp']['controls'][0].controls['bags'].setValue('')
          }
        })
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Something Went Wrong.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
      }
    });


  }
  cancel() {
    this.showLotPageData = false;
    this.showGrid = true;
    this.stackComposition().clear
    while (this.spp.controls.length != 0) {
      this.remove(0)
    }
    while (this.stackComposition().controls.length != 0) {
      this.remove2(0)
    }
    this.addMore(0)
    this.addMore2(0)
    this.ngForm.controls['total_breeder_qty'].setValue('');
    this.ngForm.controls['under_size'].setValue('')
    this.ngForm.controls['processing_loss'].setValue('')
    this.ngForm.controls['total_rejected'].setValue('')
    this.ngForm.controls['recovery_qty'].setValue('')
    this.ngForm.controls['tentative_recovery'].setValue('')
    this.ngForm.controls['variety_level_2'].setValue('')
    this.ngForm.controls['lot_no'].setValue('');
    this.under_sizepercent = '';
    if(!this.is_potato){
      this.ngForm.controls['spp']['controls'][0].controls['bags'].setValue(50)
    }else{
      this.ngForm.controls['spp']['controls'][0].controls['bags'].setValue('')
    }
    // total_breeder_qty: [''],
    //   under_size: [''],
    //   processing_loss: [''],
    //   total_rejected: [''],
    //   recovery_qty: [''],
    //   tentative_recovery: [''],
    //   variety_level_2: [''],
  }

  download() {
    // this.getQr()
    const name = 'Generating Tag Numbe';
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
  getYear() {
    const route = "get-seed-processing-reg-year";
    const result = this.productionService.postRequestCreator(route, null).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      let yearData = []
      if (res && res.length > 0) {
        res = res.filter(x => x != '')
        res.sort((a, b) => b - a);
        res.forEach((el) => {
          yearData.push({ year: el })
        })
      }
      this.yearData = yearData ? yearData : '';

    });
  }
  getSeason() {
    const route = "get-seed-processing-reg-season";
    const param = {
      "search": {
        "year": this.ngForm.controls["year"].value,

      }
    }
    const result = this.productionService.postRequestCreator(route, param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';

      let seasonData = []
      if (res && res.length > 0) {
        res = res.filter(x => x != '');

        res = [...new Set(res)];
        res.sort()
        res.forEach((el) => {
          seasonData.push({ season: el })
        })
      }
      this.seasonlist = seasonData ? seasonData : '';
    });
  }
  getCrop() {
    const route = "get-seed-processing-reg-crop";
    const param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
      }
    }
    const result = this.productionService.postRequestCreator(route, param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      if (this.cropData && this.cropData.length > 0) {
        this.cropData = this.cropData.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.crop_code === arr.crop_code)))
      }
      this.cropData = res ? res : '';
      this.cropDataSecond = res ? res : ''
    });
  }
  getListData() {
    const route = "get-seed-processing-reg-data-for-fresh-stock";
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData);
    let UserId = datas.id;
    let varietyData = this.ngForm.controls['variety_level_2'].value;
    let variety = []
    if (varietyData && varietyData.length > 0) {
      varietyData.forEach((el, i) => {
        variety.push(el && el.variety_code ? el.variety_code : '')
      })
    }

    const param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
        "crop_code": this.ngForm.controls["crop"].value,
        user_id: UserId,
        variety_code: variety && (variety.length > 0) ? variety : '',
        lot_no: this.ngForm.controls["lot_no"].value,
      }
    }
    if (this.ngForm.controls['getRadio'].value == 2) {
      this.productionService.postRequestCreator('get-seed-processing-reg-carry-second', param).subscribe(data => {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
        this.dummyData = response ? response : '';

        let bsp1VarietyListArr = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.bsp1VarietyListArr ? (data.EncryptedResponse.data.bsp1VarietyListArr) : '';
        let directIndentVarietyListTotalArr = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.directIndentVarietyListTotalArr ? (data.EncryptedResponse.data.directIndentVarietyListTotalArr) : '';

        bsp1VarietyListArr = bsp1VarietyListArr ? bsp1VarietyListArr.flat() : '';
        if (this.dummyData && this.dummyData[0] && this.dummyData[0].is_freezed && (this.dummyData[0].is_freezed == 1)) {
          this.freezeData = true
        }
        else {
          this.freezeData = false;
        }
        let combineArrays;
        let combineArrays2;
        let seedTags = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.seedTags ? data.EncryptedResponse.data.seedTags : '';
        // seedTags = seedTags ? seedTags.flat() : '';
        let bsp2Data = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.bsp2Data ? data.EncryptedResponse.data.bsp2Data : '';
        let results = [];
        // if (bsp2Data && bsp2Data.length > 0) {
        //   bsp2Data.forEach((el, i) => {
        //     if (el && el.variety_line_code) {
        //       if (el.line_variety_code == el.variety_line_code) {
        //         results.push({
        //           seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
        //           stage_id: el && el.stage_id ? el.stage_id : '',
        //           line_variety_code: el && el.line_variety_code ? el.line_variety_code : '',
        //           plot_code: el && el.plot_code ? el.plot_code : '',
        //           variety_line_code: el && el.variety_line_code ? el.variety_line_code : '',
        //           variety_code: el && el.variety_code ? el.variety_code : '',
        //           code: el && el.code ? el.code : ''
        //         })
        //       } else {
        //         results.push({
        //           seed_class_id: '',
        //           stage_id: '',
        //           line_variety_code: '',
        //           plot_code: '',
        //           variety_code: '',
        //           variety_line_code: '',
        //           code: ''
        //         })
        //       }
        //     }
        //     else {
        //       results.push({
        //         seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
        //         stage_id: el && el.stage_id ? el.stage_id : '',
        //         line_variety_code: el && el.line_variety_code ? el.line_variety_code : '',
        //         plot_code: el && el.plot_code ? el.plot_code : '',
        //         variety_line_code: el && el.variety_line_code ? el.variety_line_code : '',
        //         variety_code: el && el.variety_code ? el.variety_code : '',
        //         code: el && el.code ? el.code : ''
        //       })
        //     }
        //   })
        // }

        console.log(results, 'results')
        // if (this.dummyData && this.dummyData.length > 0) {
        //   if (results && results.length > 0) {

        //     this.dummyData = this.dummyData.map(item => {
        //       if (item && item.seed_class_details && item.seed_class_details.length > 0) {
        //         item.seed_class_details.forEach(detail => {
        //           let matchingItem;
        //           if (item.line_variety_code) {
        //             matchingItem = results.find(elem => elem.variety_code === item.variety_code && elem.line_variety_code == item.line_variety_code);
        //           } else if (item.variety_line_code) {
        //             matchingItem = results.find(elem => elem.variety_code === item.variety_code && elem.variety_line_code == item.variety_line_code);
        //           } else {
        //             matchingItem = results.find(elem => elem.variety_code === item.variety_code);
        //           }
        //           if (matchingItem) {
        //             detail.stage_id = matchingItem && matchingItem.stage_id ? matchingItem.stage_id : '';
        //             detail.seed_class_id = matchingItem && matchingItem.seed_class_id ? matchingItem.seed_class_id : '';
        //             detail.variety_line_code = matchingItem && matchingItem.variety_line_code ? matchingItem.variety_line_code : '';
        //             detail.line_variety_code = matchingItem && matchingItem.line_variety_code ? matchingItem.line_variety_code : '';
        //             detail.code = matchingItem && matchingItem.code ? matchingItem.code : '';

        //           }
        //         });
        //       }
        //       return item;
        //     });
        //   }

        // }
        console.log(this.dummyData, 'this.dummyData')
        if (this.dummyData && this.dummyData.length > 0) {

          this.dummyData.forEach((el) => {
            el.seed_class_details = el.seed_class_details.filter((arr, index, self) =>
              index === self.findIndex((t) => (t.carry_id === arr.carry_id && t.carry_over_seed_details_id === arr.carry_over_seed_details_id)))
            // el.seed_class_details= el.seed_class_details.filter(x=>x.!=)
            el.seed_class_details.forEach((item) => {
              if (seedTags && seedTags.length > 0) {

                seedTags.forEach(val => {
                  if (val.seed_processing_register_id == item.seed_processing_register_id) {
                    item.stack_details.push(
                      {
                        id: val.id,
                        godown_no: val.godown_no,
                        no_of_bag: val.no_of_bag,
                        seed_processing_register_id: val.seed_processing_register_id,
                        type_of_seed: val.type_of_seed,
                        stack_no: val.stack_no
                      }
                    )
                  }
                })
              }

              // item.stack_details]
            })
          })
          this.dummyData.forEach((el) => {
            el.seed_class_details.forEach(item => {
              if (item.stack_details && item.stack_details.length > 0) {
                item.stackDetails = [];
                item.godown_no_detail = [];
                item.no_of_bag_details = [];
                item.stack_details.forEach((val) => {
                  item.stackDetails.push(val && val.stack_no ? val.stack_no : '')
                  item.no_of_bag_details.push(val && val.no_of_bag ? val.no_of_bag : '')
                  item.godown_no_detail.push(val && val.godown_no ? val.godown_no : '')
                })
              }
            })
          })
        }
      })
    } else {
      this.productionService.postRequestCreator(route, param).subscribe(data => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.filterData ? data.EncryptedResponse.data.filterData : '';


          if (response && response.length > 0) {

            response.forEach((el) => {

              // el.plotDetails = el.plotDetails
              el.bsp_details.forEach((item) => {
                const uniqueData = [];
                const uniqueIds = new Set();
                item.plotDetails = item.plotDetails.sort((a, b) => a.id > b.id)
                item.plotDetails = Object.values(item.plotDetails.reduce((uniqueData, item) => {
                  const key = item.seed_processing_register_ids;
                  if (!uniqueData[key] || item.process_lot_id === item.lot_id) {
                    uniqueData[key] = item;
                  }
                  return uniqueData;
                }, {}));


                // If all values are empty or null, convert to an empty array
                return [];

              })
            })
          }
          let seedTags = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.seedTags ? data.EncryptedResponse.data.seedTags : '';
          seedTags = seedTags ? seedTags.flat() : ''
          if (response && response.length > 0) {
            if (seedTags && seedTags.length > 0) {
              response.forEach(obj1 => {
                obj1.bsp_details.forEach(detail => {
                  detail.plotDetails.forEach(plot => {
                    plot.stack_details2 = []
                    plot.stackDetails = []
                    plot.no_of_bag_details = [];
                    plot.godown_no_detail = [];
                    seedTags.forEach(obj2 => {
                      if (plot.seed_processing_registers_data_id === obj2.seed_processing_register_id && plot.lot_id == plot.process_lot_id) {

                        // plot.stack_details2.push({
                        //   id: obj2.id,
                        //   godown_no: obj2.godown_no,
                        //   no_of_bag: obj2.no_of_bag,
                        //   seed_processing_register_id: obj2.seed_processing_register_id,
                        //   type_of_seed: obj2.type_of_seed,
                        //   stack_no: obj2.stack_no

                        // });
                        plot.stackDetails.push(obj2 && obj2.stack_no ? obj2.stack_no : "");
                        plot.no_of_bag_details.push(obj2 && obj2.no_of_bag ? obj2.no_of_bag : "");
                        plot.godown_no_detail.push(obj2 && obj2.godown_no ? obj2.godown_no : "");
                      }


                    });
                  });
                });
              });
            } else {
              response.forEach(obj1 => {
                obj1.bsp_details.forEach(detail => {
                  detail.plotDetails.forEach(plot => {
                    plot.stack_details.push({
                      id: '',
                      godown_no: '',
                      no_of_bag: '',
                      seed_processing_register_id: '',
                      type_of_seed: '',
                      stack_no: ''
                    });
                  })
                }
                )
              })

            }
          }

          let investVerifyStackComposition = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.investVerifyStackComposition ? data.EncryptedResponse.data.investVerifyStackComposition : '';
          this.investVerifyStackComposition = investVerifyStackComposition ? investVerifyStackComposition : ''
          this.tableData = response ? response : '';
          let bsp2Data = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.bsp2Data ? data.EncryptedResponse.data.bsp2Data : '';
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
          console.log(results, 'results')
          if (this.tableData && this.tableData.length > 0) {
            if (results && results.length > 0) {

              this.tableData = this.tableData.map(item => {
                item.bsp_details.forEach(detail => {
                  let matchingItem;
                  if (item.line_variety_code) {
                    matchingItem = results.find(elem => elem.variety_code === item.variety_code && elem.line_variety_code == item.line_variety_code);
                  } else if (item.variety_line_code) {
                    matchingItem = results.find(elem => elem.variety_code === item.variety_code && elem.variety_line_code == item.variety_line_code);
                  } else {
                    matchingItem = results.find(elem => elem.variety_code === item.variety_code);
                  }
                  if (matchingItem) {
                    detail.plotDetails.forEach(plotDetail => {
                      plotDetail.stage_id = matchingItem && matchingItem.stage_id ? matchingItem.stage_id : '';
                      plotDetail.seed_class_id = matchingItem && matchingItem.seed_class_id ? matchingItem.seed_class_id : '';
                      plotDetail.variety_line_code = matchingItem && matchingItem.variety_line_code ? matchingItem.variety_line_code : '';
                      plotDetail.line_variety_code = matchingItem && matchingItem.line_variety_code ? matchingItem.line_variety_code : '';
                      plotDetail.code = matchingItem && matchingItem.code ? matchingItem.code : '';
                      // plotDetail.plot_code = matchingItem && matchingItem.plot_code ? matchingItem.plot_code :'';
                    });
                  }
                });
                return item;
              });
            }

          }

          if (this.tableData && this.tableData.length > 0) {
            this.tableData.forEach((el, i) => {
              let sum = 0;
              el.allDataArr = [];
              // el.tag_detail_data_length= el.tag_detail_data.length
            })
            this.tableData.forEach((el, i) => {
              el.bsp_details.forEach((item, index) => {
                item.plotDetails.forEach(val => {
                  el.allDataArr.push(...item.plotDetails)
                  // if (val.stack_details2 && val.stack_details2.length > 0) {

                  // } else {
                  //   el.allDataArr.push(...item.plotDetails)
                  // }

                })
              })
              // el.tag_detail_data_length= el.tag_detail_data.length
            })
            this.tableData.forEach((el) => {
              el.totalArrlength = el.allDataArr.length
              el.bsp_details.forEach((item, index) => {
                item.tagdetaildatatotal = item.plotDetails.length;
              })
            })

            this.tableData.forEach((el) => {
              // el.totalArrlength = el.allDataArr.length
              el.plotData = []
              el.bsp_details.forEach((item, index) => {
                el.plotData.push(...item.plotDetails)
                item.plotDetails.forEach(val => {
                  val.totalSpalength = val.stack_details.length;
                })
                // item.tagdetaildatatotal = item.plotDetails.length;
              })
            })

            console.log(this.tableData, 'tableData')
          }
        }
      })

    }

    // param.user_id = UserId;


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
  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
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
  convertToQty(item) {
    if (this.ngForm.controls['getRadio'].value == 2) {

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
    else {
      return item
    }
  }

  formateDate(dateString) {
    const date = new Date(dateString);
    // Array of month names
    const monthNames = ["Jan", "FEB", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Extract month and year components
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear() % 100; // Getting last two digits of the year

    // Format the date in "Mar24" format
    const formattedDate = month + year;
    return formattedDate
  }
  changeRadio(item) {
    this.ngForm.controls['getRadio'].setValue(item);
    this.ngForm.controls['variety_level_2'].setValue('')
    this.ngForm.controls['lot_no'].setValue('')
    this.getListData()
    this.getHarvestVariety();
    this.getLotDetails();
  }
  sppCreateForm(): FormGroup {
    return this.fb.group({
      no_of_bags: [''],
      bags: [''],
      qty: [''],
      // stack_data: new FormArray([
      //   this.stackData(),
      // ]),
    })
  }

  stackData() {
    let temp = this.fb.group({
      stack_com: [''],
      new_stack: ['',],
      type_of_seed: ['1',],
      bag_marka: [''],
      showstackNo: ['',],
      godown_no: ['',],
      showfieldDisable: [false],
      stack_id: [],
      bagData: []
    });
    return temp;
  }

  sppData() {
    return this.ngForm.get('spp') as FormArray;
  }
  stackComposition() {
    return this.ngForm.get('stack') as FormArray;
  }
  addMore(i) {

    this.sppData().push(this.sppCreateForm());
  }

  addMore2(i) {

    let stacks = this.ngForm.value && this.ngForm.value.stack ? this.ngForm.value.stack : '';
    let bags = []
    if (stacks && stacks.length > 0) {
      stacks.forEach((el, i) => {
        el.bagsData1 = []
        if (el && el.bag_marka && el.bag_marka.length) {
          bags.push(...el.bag_marka)
        }

      })
    }
    let uncommonInArr1
    if (this.BagMarka && this.BagMarka.length > 0) {
      uncommonInArr1 = this.BagMarka.filter(item1 => !bags.some(item2 => item1.id === item2.id));
    }
    console.log('uncommonInArr1', uncommonInArr1)
    console.log('bags', bags)
    this.stackNo = this.stackNo + 1;

    this.stackComposition().push(this.stackData());
    if (this.ngForm.controls['stack']['controls'][i + 1] && this.ngForm.controls['stack']['controls'][i + 1].controls && this.ngForm.controls['stack']['controls'][i + 1].controls['bagData']) {
      this.ngForm.controls['stack']['controls'][i + 1].controls['bagData'].setValue(uncommonInArr1)
    }
  }



  remove2(rowIndex: number) {
    // this.stackNo= this.stackNo-1;
    // let stacks = this.ngForm.value && this.ngForm.value.stack  ?this.ngForm.value.stack :'';
    // let bags=[]
    // if(stacks && stacks.length>0){
    //   stacks.forEach((el,i)=>{
    //     el.bagsData1=[]
    //     if(el && el.bag_marka && el.bag_marka.length){
    //       bags.push(...el.bag_marka)
    //     }

    //   })
    // }
    // let uncommonInArr1 = this.BagMarka.filter(item1 => !bags.some(item2 => item1.id === item2.id));
    // this.ngForm.controls['stack']['controls'][i+1].controls['bagData'].setValue(uncommonInArr1)
    this.stackComposition().removeAt(rowIndex);
    // if (this.sppData().controls.length > 1) {
    // } else {
    //   this.removeData()
    // }
  }
  employees() {
    return this.ngForm.get('spp') as FormArray;
  }
  get nestedArrays() {
    return this.ngForm.get('spp') as FormArray;
  }
  getNestedFormArray(index: number): FormArray {
    return this.nestedArrays.at(index).get('stack_data') as FormArray;
  }
  showLotPageSecond(item, data, action, lot) {
    this.showLotPage(item, data, action, lot)
    this.showLotPageDataSecond = true;
  }

  addMoreSeedDetails(i, index) {
    this.getNestedFormArray(i).push(this.stackData())
  }

  removeEmployeeSkill(empIndex: number, skillIndex: number) {
    this.getNestedFormArray(empIndex).removeAt(skillIndex);
  }

  getStackRang(id) {
    let stack = []
    if (this.investVerifyStackComposition && this.investVerifyStackComposition.length > 0) {
      let item = this.investVerifyStackComposition.filter(x => x.invest_verify_id == id);
      if (item && item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          stack.push(item && item[i] ? item[i].stack : 'NA')
        }
      }
    }
    return (stack && stack.length > 0 ? stack.toString() : '')
  }
  getQuantity(i) {
    let noOfBags = this.ngForm.controls['spp']['controls'][i].controls['no_of_bags'].value;
    let bags = this.ngForm.controls['spp']['controls'][i].controls['bags'].value;
    if (noOfBags && bags) {
      let totalQty = parseFloat(noOfBags) * parseFloat(bags);
      let crop_code = this.ngForm.controls['crop'].value;
      let unit;
      if (crop_code) {
        unit = (crop_code.substring(0, 1) == 'A') ? 'Qt' : 'Kg'
      }
      if (unit && unit == 'Qt') {
        totalQty = (totalQty / 100)
      }
      this.ngForm.controls['spp']['controls'][i].controls['qty'].setValue(totalQty ? totalQty.toFixed(2) : '0')

      // Recalculate the total rejected quantity after updating qty
      this.calculateTotalRejectedQty();
      //  let sum=0;
      let data = this.ngForm.value;
      if (data && data.spp && data.spp.length > 0) {
        let bag_marka = [];
        let sum = 0;
        data.spp.forEach((el) => {
          sum += el && el.qty ? parseFloat(el.qty) : 0;
          let totalQty = sum ? sum.toFixed(2) : "";
          this.totalQty = sum ? sum.toFixed(2) : "";
          let percentQty = (Number(totalQty) / this.raw_seed_produced_data) * 100;

          this.ngForm.controls['total_breeder_qty'].setValue(`${totalQty} (${percentQty ? percentQty.toFixed(2) : ''} %)`)
          if (el && el.no_of_bags) {
            bag_marka.push(el && el.no_of_bags ? el.no_of_bags : '')

          }

          if (parseFloat(this.raw_seed_produced_data) < parseFloat(this.ngForm.controls['spp']['controls'][i].controls['qty'].value)) {
            Swal.fire({
              title: '<p style="font-size:25px;">Quantity can not be greater than Lot quantity.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#B64B1D'
            })
            this.totalQtyErr = true;
          } else {
            this.totalQtyErr = false;
          }

        })
        const newArray = bag_marka.map(Number);
        // console.log(bag_marka,'bag_marka')
        const sumofbags = newArray.reduce((acc, curr) => acc + curr, 0);
        this.highestNumber = sumofbags;
        this.updateTotalBags()

      }
    }
  }


  updateTotalBags() {
    let totalBags = 0;
    let data = this.ngForm.value;
    let bag_marka = [];

    // Loop through all rows in spp and accumulate the number of bags
    if (data && data.spp && data.spp.length > 0) {
      data.spp.forEach((el) => {
        if (el && el.no_of_bags) {
          totalBags += parseInt(el.no_of_bags, 10);
          bag_marka.push(parseInt(el.no_of_bags, 10));
        }
      });
    }

    // Call function to update the dropdown with the total number of bags
    this.getBagMarkaData(totalBags);
  }
  // remove(rowIndex: number) {
  //   this.sppData().removeAt(rowIndex);

  //   // Recalculate total quantities and bags after removing a row
  //   this.recalculateTotals();
  //   // Recalculate the total rejected quantity after removing the row
  //   this.calculateTotalRejectedQty();
  // }
  remove(rowIndex: number) {
    this.sppData().removeAt(rowIndex);

    const stackControls = this.ngForm.get('stack') as FormArray;
    if (stackControls.length > rowIndex) {
        stackControls.removeAt(rowIndex); // Remove corresponding stack row
    }

    // Ensure calculations run after Angular updates the form
    setTimeout(() => {
        this.recalculateTotals();
        this.calculateTotalRejectedQty(); // Ensure recalculates after form update
        this.getLossQty();
    }, 100);  // Slight delay to allow form update
}
  
  calculateTotalRejectedQty() {
    let totalRejectedQty = 0;
    const data = this.ngForm.value;

    // console.log("Ttlrjcteddata", data);

    if (data?.spp?.length > 0) {
        data.spp.forEach((el) => {
            let rejectedStr = el?.total_rejected || "0"; // Default to "0" if empty
            let rejectedNum = parseFloat(rejectedStr.split(" ")[0]) || 0; // Extract numeric value
            totalRejectedQty += rejectedNum;
        });
    }

    this.ngForm.controls['total_rejected'].setValue(totalRejectedQty.toFixed(2));
    // console.log("Total Rejected Quantity:", totalRejectedQty);
}




  recalculateTotals() {
    let totalQty = 0;
    let totalBags = 0;

    const data = this.ngForm.value;
    if (data && data.spp && data.spp.length > 0) {
      data.spp.forEach((el) => {
        totalQty += el.qty ? parseFloat(el.qty) : 0;
        totalBags += el.no_of_bags ? parseInt(el.no_of_bags, 10) : 0;
      });
    }

    const percentQty = (totalQty / this.raw_seed_produced_data) * 100;
    this.ngForm.controls['total_breeder_qty'].setValue(`${totalQty.toFixed(2)} (${percentQty.toFixed(2)} %)`);
    this.getBagMarkaData(totalBags); // Call to update bag data
  }

  trackByFn(index: number, item: any): number {
    return index; // or use a unique identifier for better performance
  }
  // getBagMarkaData(totalBags) {
  //   let bag_markaData = [];

  //   // Generate the `bag_markaData` array based on the total number of bags
  //   if (totalBags) {
  //     for (let index = 1; index <= totalBags; index++) {
  //       bag_markaData.push({
  //         id: index,
  //         bags: index
  //       });
  //     }
  //   }

  //   const stackControls = this.ngForm.get('stack') as FormArray; // Cast to FormArray

  //   // Update all rows' dropdowns with the total number of bags
  //   (this.ngForm.get('spp') as FormArray).controls.forEach((control, i) => {
  //     stackControls.at(i).get('bagData').setValue(bag_markaData);
  //   });

  //   this.BagMarka = bag_markaData;
  // }
  getBagMarkaData(totalBags) {
    let bag_markaData = [];

    // Generate the `bag_markaData` array based on the total number of bags
    if (totalBags) {
        for (let index = 1; index <= totalBags; index++) {
            bag_markaData.push({ id: index, bags: index });
        }
    }

    const stackControls = this.ngForm.get('stack') as FormArray; // Cast to FormArray
    const sppControls = this.ngForm.get('spp') as FormArray; // Get spp FormArray

    // Ensure stackControls has enough entries before accessing
    sppControls.controls.forEach((control, i) => {
        if (stackControls.at(i)) { // Check if it exists before accessing
            stackControls.at(i).get('bagData')?.setValue(bag_markaData);
        }
    });

    this.BagMarka = bag_markaData;
}
  
  getUnit() {
    let crop_code = this.ngForm.controls['crop'].value;
    let unit;
    if (crop_code) {
      unit = (crop_code.substring(0, 1) == 'A') ? 'Qt' : 'Kg'
    }
    this.unit = unit;
  }
  
  myFunction(under_size, under_sizepercent) {
    // Your function code here
    this.ngForm.controls['under_size'].setValue(`${under_size ? under_size : ''} (${under_sizepercent ? under_sizepercent.toFixed(2) : ""}%)`)
    this.alreadyCalled = true;
    // Set the flag to true after the function is called
  }

 
  getStackData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData);
    let UserId = datas.id;
    const param = {
      search: {
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
        "crop_code": this.ngForm.controls["crop"].value,
        // "variety_code": this.ngForm.controls["variety"].value,
        user_id: UserId

      }
    }
    this.productionService.postRequestCreator('get-seed-processing-reg-stack', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        if (response && response.length > 0) {
          response = response.filter((arr, index, self) =>
            index === self.findIndex((t) => (t.stack_no === arr.stack_no)))
        }
        this.totalStack = response.length + 1;
        this.bagMarkDataofInvest = response;

      }
    })
  }
  checkStackDataValue() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code:this.ngForm.controls['crop'].value,
        // variety_code:this.ngForm.controls['variety'].value,
        // stack_id:this.ngForm.controls['stack']['controls'][i].controls['stack_com'].value
      }
    }

    this.productionService.postRequestCreator('get-seed-processing-reg-stack', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response1 = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : 0;
        console.log('response===1', response1);
        // Map each stack_no to its running number
        if (response1 && response1.length) {
          const runningNumbers = response1.map(stack => {
            const parts = stack.stack_no.split('/');
            return parseInt(parts[parts.length - 1].trim(), 10);
          });
          const highestRunningNumber = Math.max(...runningNumbers);
          console.log('Highest running number:', highestRunningNumber);
          this.checkStackNoRunningNo = highestRunningNumber
        }else{
          this.checkStackNoRunningNo = '';
        }  
      }
    })
  }

  getStackDataValue(i) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    this.checkStackDataValue();
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        // stack_id:this.ngForm.controls['stack']['controls'][i].controls['stack_com'].value
      }
    }

    this.productionService.postRequestCreator('get-seed-processing-reg-stack', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : 0;
        // this.bagMarkDataofInvest=response;
        // this.stac = response ? response : '';
        // stack_com: [''],
        // new_stack: ['',],
        // type_of_seed: ['',],
        // bag_marka: ['',],
        // showstackNo: ['',],
        // godown_no: ['',],
        console.log('response===', response);
        if (this.ngForm.controls['stack']['controls'][i].controls['stack_com'].value == 'new_stack') {
          let season = this.ngForm.controls['season'].value;
          let year = this.ngForm.controls['year'].value;
          let seedtype = this.ngForm.controls['stack']['controls'][i].controls['type_of_seed'].value;
          let typeofSeed;
          let typeSeedName;
          if (this.typeofSeed && this.typeofSeed.length > 0) {
            typeofSeed = this.typeofSeed.filter(x => x.id == this.ngForm.controls['stack']['controls'][i].controls['type_of_seed'].value)
            typeSeedName = typeofSeed && typeofSeed[0] && typeofSeed[0].name ? typeofSeed[0].name : '';
          }
          let lastTwoDigits = year % 100;
          let yearRange = `${lastTwoDigits}-${lastTwoDigits + 1}`;
          
          let stackNo;
          
          console.log(this.checkStackNoRunningNo);
          if(this.checkStackNoRunningNo){
            stackNo = `${season ? season.toUpperCase() : 'NA'}/${yearRange}/${seedtype = 'PS'}/${((this.checkStackNoRunningNo ?this.checkStackNoRunningNo+1:1) )}`
            this.ngForm.controls['stack']['controls'][i].controls['showstackNo'].setValue(stackNo ? stackNo : '');
          }else{
            this.stackNo = response ? (response.length) : 0;
            stackNo = `${season ? season.toUpperCase() : 'NA'}/${yearRange}/${seedtype = 'PS'}/${Number(this.stackNo) + (parseInt(i) + 1)}`
            this.ngForm.controls['stack']['controls'][i].controls['showstackNo'].setValue(stackNo ? stackNo : '');
          }
        }
        // }
      }
    })
    //  }

  }
  getStackDataValue2(i) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls["crop"].value,
        variety_code: this.ngForm.controls["variety"].value,
        stack_id: this.ngForm.controls['stack']['controls'][i].controls['stack_com'].value
      }
    }

    if (this.ngForm.controls['stack']['controls'][i].controls['stack_com'].value != 'new_stack') {

      this.productionService.postRequestCreator('get-seed-processing-reg-stack', param).subscribe(data => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data[0] ? data.EncryptedResponse.data[0] : 0;
          this.ngForm.controls['stack']['controls'][i].controls['type_of_seed'].setValue(response && response.type_of_seed ? response.type_of_seed : '');
          this.ngForm.controls['stack']['controls'][i].controls['showstackNo'].setValue(response && response.stack_no ? response.stack_no : '');
          this.ngForm.controls['stack']['controls'][i].controls['godown_no'].setValue(response && response.godown_no ? response.godown_no : '')
          this.ngForm.controls['stack']['controls'][i].controls['showfieldDisable'].setValue(true);
          this.ngForm.controls['stack']['controls'][i].controls['stack_id'].setValue(response && response.id ? response.id : '')
          this.disableField = true;
        } else {
          this.disableField = false;
          this.ngForm.controls['stack']['controls'][i].controls['showfieldDisable'].setValue(false)
        }
      })
    } else {
      this.disableField = false;
      this.ngForm.controls['stack']['controls'][i].controls['showfieldDisable'].setValue(false);
      this.ngForm.controls['stack']['controls'][i].controls['type_of_seed'].setValue('1');
      this.ngForm.controls['stack']['controls'][i].controls['showstackNo'].setValue('');
      this.ngForm.controls['stack']['controls'][i].controls['godown_no'].setValue('');
      this.ngForm.controls['stack']['controls'][i].controls['stack_id'].setValue('')
    }
    //  }

  }
   
  // getLossQty() {
  //   console.log("loss called");
    
  //   let total_breeder_qty = this.ngForm.controls['total_breeder_qty'].value;
  //   let under_size = this.ngForm.controls['under_size'].value;
  //   let totalQty = parseFloat(this.raw_seed_produced_data) - parseFloat(this.totalQty);

  //   if (under_size) {
  //       let under_sizepercent = (under_size / this.raw_seed_produced_data) * 100;
  //       this.under_sizepercent = under_sizepercent;
  //   } else {
  //       // Reset under_sizepercent if under_size is empty
  //       this.under_sizepercent = 0;
  //   }

  //   // Calculate processing_loss
  //   let processing_loss = totalQty - under_size;
  //   let total_rejected = totalQty;

  //   if (parseFloat(under_size) > Number(totalQty)) {
  //       Swal.fire({
  //           title: '<p style="font-size:25px;">UnderSize Quantity Exceeds Total.</p>',
  //           icon: 'error',
  //           confirmButtonText: 'OK',
  //           confirmButtonColor: '#B64B1D'
  //       }).then(x => {
  //           this.totalQtyErr = true;
  //       });
  //   } else {
  //       this.totalQtyErr = false;
  //   }

  //   // Check for processing_loss condition when under_size equals totalQty
  //   if (under_size === totalQty) {
  //       processing_loss = 0;
  //   }

  //   // Update processing_loss and total_rejected in form controls
  //   let processing_lossqty = processing_loss ? processing_loss.toFixed(2) : '0';
  //   let percentQty = (Number(processing_lossqty) / this.raw_seed_produced_data) * 100;
  //   let percentTotalRejected = (Number(totalQty) / this.raw_seed_produced_data) * 100;

  //   this.processing_loss = Number(processing_lossqty);
  //   this.total_rejected = total_rejected;
  //  console.log("gettotalrejected",total_rejected);
   
  //   if (parseFloat(processing_lossqty) >= 0) {
  //       this.ngForm.controls['processing_loss'].setValue(`${processing_lossqty} (${percentQty.toFixed(2)}%)`);
  //   }

  //   if (Number(total_rejected) > 0) {
  //       this.ngForm.controls['total_rejected'].setValue(`${total_rejected.toFixed(2)} (${percentTotalRejected.toFixed(2)}%)`);
  //   }
  // }
  getLossQty() {
    console.log("loss called");

    // Ensure values are numeric to prevent calculation issues
    let total_breeder_qty = parseFloat(this.ngForm.controls['total_breeder_qty'].value) || 0;
    let under_size = parseFloat(this.ngForm.controls['under_size'].value) || 0;
    let raw_seed_produced = parseFloat(this.raw_seed_produced_data) || 0;
    let totalQty = raw_seed_produced - total_breeder_qty || 0;

    if (under_size) {
        let under_sizepercent = (under_size / raw_seed_produced) * 100;
        this.under_sizepercent = under_sizepercent;
    } else {
        this.under_sizepercent = 0;
    }

    // Fix processing_loss calculation
    let processing_loss = Math.max(totalQty - under_size, 0);
    let total_rejected = Math.max(totalQty, 0);

    // Validate under_size does not exceed totalQty
    if (under_size > totalQty) {
        Swal.fire({
            title: '<p style="font-size:25px;">UnderSize Quantity Exceeds Total.</p>',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#B64B1D'
        }).then(() => {
            this.totalQtyErr = true;
        });
    } else {
        this.totalQtyErr = false;
    }

    // Ensure processing_loss is 0 if under_size equals totalQty
    if (under_size === totalQty) {
        processing_loss = 0;
    }

    // Convert to percentage
    let processing_loss_percent = (processing_loss / raw_seed_produced) * 100;
    let total_rejected_percent = (total_rejected / raw_seed_produced) * 100;

    // Update variables and form controls
    this.processing_loss = processing_loss;
    this.total_rejected = total_rejected;

    console.log("gettotalrejected", total_rejected);

    setTimeout(() => {
        this.ngForm.controls['processing_loss'].setValue(`${processing_loss.toFixed(2)} (${processing_loss_percent.toFixed(2)}%)`);
        this.ngForm.controls['total_rejected'].setValue(`${total_rejected.toFixed(2)} (${total_rejected_percent.toFixed(2)}%)`);
    }, 100); // Ensure form updates before setting values
  }

  gettentativeRecovery() {
    let tentative_recovery = this.ngForm.controls['tentative_recovery'].value;
    // let under_size = this.ngForm.controls['under_size'].value;
    let totalQty = parseFloat(tentative_recovery);
    let totalQtyData = totalQty ? totalQty.toFixed(2) : '';
    let percentTotalRejected = (Number(totalQtyData) / this.raw_seed_produced) * 100;
    const result = (Number(totalQtyData) / 100) * this.raw_seed_produced_data;
    this.tentative_recovery = tentative_recovery;
    this.recovery_qty = result ? (Number(result).toFixed(2)) : '';

    // let percentTotalRejectedData= percentTotalRejected ? percentTotalRejected.toFixed(2):''
    if (Number(result) > 0) {
      this.ngForm.controls['recovery_qty'].setValue(`${result ? (Number(result).toFixed(2)) : ''}`);
    }
    if (this.LotPageDetails == 2) {
      if (parseFloat(this.ngForm.controls['tentative_recovery'].value) > 100) {
        Swal.fire({
          title: '<p style="font-size:25px;">Tentative Recovery can not be greater than 100.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
        return;

      }
    }
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
  getTotalLotQty(item, val) {
    if (item && val) {
      let data = item / val * 100;
      let percentQty = data ? data.toFixed(2) : 'NA'
      return percentQty
    }
    else {
      return 'NA'
    }
  }
  getUndersize(item, val) {
    if (item && val) {
      if (this.unit == 'Qt' && this.ngForm.controls['getRadio'].value == 2) {
        item = parseFloat(item) / 100
      }
      let value = (val / item) * 100;
      let percentValue = value ? value.toFixed(2) : '';
      return percentValue ? percentValue : 'NA'
    } else {
      return 'NA'
    }

  }
  getHarvestVariety() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    let varietyData = this.ngForm.controls['variety_level_2'].value;
    let variety = []
    if (varietyData && varietyData.length > 0) {
      varietyData.forEach((el, i) => {
        variety.push(el && el.variety_code ? el.variety_code : '')
      })
    }
    const param = {
      search: {
        // user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: variety && variety.length > 0 ? variety : '',
        // user_id:UserId

      }
    }
    if (this.ngForm.controls['getRadio'].value == 2) {
      this.productionService.postRequestCreator('get-carry-over-variety-grid-second', param).subscribe(data => {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
        this.varietyList = response ? response : '';
        let checkStatus;

      })
    } else {
      param.search['user_id'] = UserId
      this.productionService.postRequestCreator('get-investing-harvesting-data-second', param).subscribe(data => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : 0;
          this.varietyList = response ? response : '';

        }
      })
    }



  }
  convertToString(item) {
    if (item && item.length > 0) {
      return item ? item.toString() : ''
    } else {
      return 'NA'
    }
  }
  getLotDetails() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    let varietyData = this.ngForm.controls['variety_level_2'].value;
    let variety = []
    if (varietyData && varietyData.length > 0) {
      varietyData.forEach((el, i) => {
        variety.push(el && el.variety_code ? el.variety_code : '')
      })
    }
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop'].value,
        variety_code: variety && variety.length > 0 ? variety : '',
        radio: this.ngForm.controls['getRadio'].value
        // user_id:UserId

      }
    }

    this.productionService.postRequestCreator('get-seed-processing-reg-lot', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      if (response && response.length > 0) {
        response = response.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.lot_id === arr.lot_id && t.id === arr.id)))

      }
      this.LotData = response ? response : '';
      if (this.ngForm.controls['getRadio'].value == 1) {
        this.LotData.forEach((el) => {
          el.value = this.removeQuantity(el.value, el.qty)
        })
      }

      let checkStatus;

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
        // variety_code: this.ngForm.controls['variety'].value,
        // variety_line_code: this.ngForm.controls['parental_line'].value,
        // plotid: this.ngForm.controls['plot'].value,
      }
    }
    this.productionService.postRequestCreator('get-inspection-area', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        // inspected_area
        let bspProforma3DataseedData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.bspProforma3DataseedData ? data.EncryptedResponse.data.bspProforma3DataseedData : '';
        this.bspProforma3DataseedData = bspProforma3DataseedData
        // if (bspProforma3DataseedData && bspProforma3DataseedData.length > 0) {
        //   bspProforma3DataseedData.forEach((el, i) => {
        //     if (el && el.variety_line_code) {
        //       if (el.line_variety_code == el.variety_line_code) {
        //         this.seedClassId = el && el.seed_class_id ? el.seed_class_id : ''
        //         this.StageId = el && el.stage_id ? el.stage_id : ''
        //       } else {
        //         this.seedClassId = '';
        //         this.StageId = ''
        //       }

        //     }
        //     else {
        //       if (i == 0) {
        //         this.seedClassId = el && el.seed_class_id ? el.seed_class_id : '';
        //         this.StageId = el && el.stage_id ? el.stage_id : '';
        //       }
        //     }
        //   })
        // }



      }
    })
  }
  getBreederData(id, stageId) {
    if (id) {
      let name = 'Breeder Seed';
      let stageIds;
      if (stageId) {
        stageIds = id == 6 ? this.convertToRoman(1) : this.convertToRoman(stageId + 1);
      }
      let className = name ? name : 'NA';
      let stageName = stageIds ? stageIds : 'NA'
      this.classofSeedHarvested = className + ' ' + stageName;
      return className + ' ' + stageName
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
  foward(data, lot_data, actionValue, lot) {
    this.LotPageDetails = actionValue;
    this.variety_name = data && data.variety_name ? data.variety_name : "";
    this.variety_code = data && data.variety_code ? data.variety_code : "";
    this.ngForm.controls['variety'].setValue(this.variety_code);
    this.provision_lot = lot_data && lot_data.lot_no ? this.getLotNoData(lot_data.lot_no) : "";
    this.lot_id = lot_data && lot_data.lot_id ? lot_data.lot_id : "";
    this.carry_over_seed_details_id = lot_data && lot_data.carry_over_seed_details_id ? lot_data.carry_over_seed_details_id : "";
    this.carry_id = lot_data && lot_data.carry_id ? lot_data.carry_id : "";
    if (this.unit && this.unit == 'Qt') {
      this.raw_seed_produced = lot_data && lot_data.quantity_recieved ? (lot_data.quantity_recieved / 100) : '';
      this.raw_seed_produced_data = lot_data && lot_data.quantity_recieved ? (lot_data.quantity_recieved / 100) : '';
    } else {
      this.raw_seed_produced = lot_data && lot_data.quantity_recieved ? (lot_data.quantity_recieved) : '';
      this.raw_seed_produced_data = lot_data && lot_data.quantity_recieved ? (lot_data.quantity_recieved) : '';
    }
    this.no_of_bags = lot_data && lot_data.tag_no ? lot_data.tag_no.length : "";
    this.carry_over_user_id = lot_data && lot_data.user_id ? lot_data.user_id : "";
    this.line_variety_code = data && data.line_variety_code ? data.line_variety_code : "";
    this.classofSeedHarvestedData = 'Breeder' + ' ' + 'Seed' + ' ' + this.convertToRoman(lot_data.stage_id);
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData);
    let UserId = datas.id;
    data.user_id = UserId;
    let param = this.ngForm.value;
    param.action = this.LotPageDetails;
    param.stackDatas = this.stackDatas;
    param.variety = this.variety_code;
    param.godown_no = this.godown_no;
    param.total_bags = this.no_of_bags;
    param.raw_seed_produced = this.raw_seed_produced;
    param.total_breeder_qty = this.totalQty;
    param.processing_loss = this.processing_loss;
    param.total_rejected = this.total_rejected;
    param.lot_id = this.lot_id;
    param.provision_lot = this.provision_lot;
    param.verify_id = this.verify_id;
    param.recovery_qty = this.recovery_qty;
    param.tentative_recovery = this.tentative_recovery;
    param.carry_over_seed_details_id = this.carry_over_seed_details_id;
    param.carry_id = this.carry_id;
    param.line_variety_code = this.line_variety_code;
    param.classofSeedHarvestedData = this.classofSeedHarvestedData;
    param.user_id = UserId;
    param.carry_over_user_id = this.carry_over_user_id;
    param.getRadio = this.ngForm.controls['getRadio'].value;
    console.log(param, 'paramparam')
    const result = this.productionService.postRequestCreator('forward-to-generate-slip', param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data forwarded  to Generate Sampling Slip for Testing form</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        }).then(x => {
          this.showLotPageData = false;
          this.showGrid = true;
          this.getListData();

        })
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Something Went Wrong.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
      }
    });
  }
  convertArrayToRange(arr) {
    //  arr = arr.map(Number);q
    let ranges = [];
    let start = arr[0];
    if (arr && arr.length > 0) {
      arr = arr.flat();
      // arr= arr.split(',')
      var splitArray = arr.map(function (item) {
        return item.split(",");
      });
      let flattenedArray = [].concat(...splitArray);
      return flattenedArray && flattenedArray.length > 0 ? flattenedArray.length : 0
    } else {
      return 'Na'
    }

  }
  removeQuantity(item, val) {
    if (item && val) {
      // let newString = item.replace(/\(\w+\)/g, '');
      let unit = this.unit;
      let regex = new RegExp("\\(" + val + unit + "\\)", "g");
      let modifiedStr = item.replace(regex, '');
      console.log(modifiedStr);
      return modifiedStr
    }
    else if (item) {
      let newString = item.replace(/\(\w+\)/g, '');
      return newString
    }
    else {
      return 'NA'
    }
  }
}