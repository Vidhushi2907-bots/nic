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
  selector: 'app-modify-bag-size',
  templateUrl: './modify-bag-size.component.html',
  styleUrls: ['./modify-bag-size.component.css']
})
export class ModifyBagSizeComponent implements OnInit {

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
  is_potato: boolean;
  prtintAllTag: boolean;
  class_of_seed: any;
  lot_qty: any;
  totalQtyValue: any;
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
      id: [''],
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

        // console.log('is_potato======', this.is_potato);

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
        this.getListData1();
        this.ngForm.controls['lot_no'].setValue('', { emitEvent: false, onlySelf: true })
        // getVariety();
      }
    });
    this.ngForm.controls['lot_no'].valueChanges.subscribe(item => {
      this.getListData1();
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
    this.getLotDetails()
    this.getListData1();
  }

  variety(item) {
    this.selectVariety = item && item.variety_name ? item.variety_name : ''
    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
  }

  vClick() {
    document.getElementById('Variety').click()
  }

  getListData1() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let UserId = datas.id
    const route = "get-generating-tag-of-lot";
    let variety = this.ngForm.controls["variety"].value;
    let lot_no = this.ngForm.controls["lot_no"].value;
    let varietydata = [];
    let lotData = []
    if (variety && variety.length > 0) {
      variety.forEach((el) => {
        varietydata.push(el && el.value ? el.value : '')
      })
    }
    if (lot_no && lot_no.length > 0) {
      lot_no.forEach((el) => {
        lotData.push(el && el.value ? el.value : '')
      })
    }
    const param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
        "crop_code": this.ngForm.controls["crop"].value,
        "user_id": UserId,
        "variety": varietydata && varietydata.length > 0 ? varietydata : '',
        "lotData": lotData && lotData.length > 0 ? lotData : ''
      }
    }
    const result = this.productionService.postRequestCreator(route, param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.filterData ? data.EncryptedResponse.data.filterData : '';
      if (res && res.length > 0) {
        res.forEach((el) => {
          el.lot_details.forEach((item) => {
            item.noofStack = [];
            item.godownNoStack = [];
            item.stack_no_stack = [];
            let sum = 0
            item.storage_details.forEach((val) => {
              item.noofStack.push(val.no_of_bag_stack);
              item.godownNoStack.push(val.godown_no_stack)
              item.stack_no_stack.push(val.stack_no_stack)
            })
            item.process_details.forEach((value) => {
              sum += value.no_of_bags_processed
              item.totalBags = sum
            })
          })
        })
      }
      this.tableData = res;
      for (let data of this.tableData) {
        for (let item of data.lot_details) {
          if ((item && !item.is_status) || (item && item.rangeData && item.rangeData.length < 1)) {
            this.prtintAllTag = true;
            break;
          } else {
            this.prtintAllTag = false;
          }
        }
      }
    });
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

  showLotPage(data, lot_data, actionValue, lot) {
    // console.log('data==========', data);
    // console.log('item==========', lot_data);
    this.employees().clear
    this.sppDataArray.clear();
    this.showLotPageData = true;
    this.showLotPageDataSecond = false;
    this.showGrid = false;
    const sppArray = this.ngForm.get('spp') as FormArray;
    this.ngForm.controls['id'].setValue(lot_data.spr_id)

    let sum = 0
    lot_data.process_details.forEach((ele, i) => {
      this.addMore(i)
      sum += (ele.no_of_bags_processed || 0) * (ele.bag_size_processed || 0)
      const sppGroup = sppArray.at(i) as FormGroup;
      sppGroup.get('no_of_bags')?.patchValue(ele.no_of_bags_processed || '');
      sppGroup.get('bags')?.patchValue(ele.bag_size_processed || '');
      sppGroup.get('qty')?.patchValue(
        (ele.no_of_bags_processed || 0) * (ele.bag_size_processed || 0)
      );
      this.getQuantity(i)
      this.recalculateTotals();
    })

    // console.lo
    // this.provision_lot = lot_data && lot_data.lot_no ? this.removeQuantity(lot_data.lot_no, lot.lot_qty) : ""
    this.provision_lot = lot_data && lot_data.lot_no ? lot_data.lot_no : "";
    this.variety_name = data && data.variety_name ? data.variety_name : "";
    this.line_variety_name = data && data.line_variety_name ? data.line_variety_name : ''
    this.variety_code = data && data.variety_code ? data.variety_code : "";
    this.godown_no = lot_data && lot_data.godown_no_register ? lot_data.godown_no_register : "";
    this.no_of_bags = lot_data && lot_data.totalBags ? lot_data.totalBags : "";
    this.verify_id = lot_data && lot_data.verifyid ? lot_data.verifyid : '';
    this.LotPageDetails = actionValue;
    this.lot_qty = lot_data && lot_data.lot_qty ? lot_data.lot_qty : '';
    this.class_of_seed = lot_data && lot_data.class_of_seed ? lot_data.class_of_seed : "";
    this.raw_seed_produced_data = this.lot_qty;
    this.line_variety_code = data && data.variety_line_code ? data.variety_line_code : "";
    this.stackDatas = lot_data && lot_data.stack_no_stl ? lot_data.stack_no_stl : ''

    // calculate total qty
    let totalQty = sum ? sum.toFixed(2) : "";
    this.totalQty = sum ? sum.toFixed(2) : "";
    let percentQty = (Number(totalQty) / this.raw_seed_produced_data) * 100;
    this.totalQtyValue = totalQty;
    this.ngForm.controls['total_breeder_qty'].setValue(`${totalQty} (${percentQty ? percentQty.toFixed(2) : ''} %)`);

  }

  submit() {
    let sppData = this.ngForm.value ? this.ngForm.value.spp : '';
    if (this.ngForm.controls['crop'].value == "H1101") {
      this.ngForm.controls['under_size'].patchValue(0)
    } else {
      if (sppData && sppData.length > 0) {
        for (let key in sppData) {
          if (sppData[key].no_of_bags == '' || sppData[key].no_of_bags == 0 || sppData[key].bags == 0
            || sppData[key].bags == '' || sppData[key].type_of_seed == ''
            || sppData[key].qty == ''
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

    if (parseFloat(this.raw_seed_produced_data) < parseFloat(this.totalQtyValue)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Fill The Form Properly.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }

    let data = this.ngForm.value;
    data.id = this.ngForm.controls['id'].value
    data.bag_data = this.ngForm.controls['spp'].value
    data.total_bags = this.no_of_bags;
    data.raw_seed_produced = this.raw_seed_produced;
    data.total_breeder_qty = this.totalQty;
    data.recovery_qty = this.recovery_qty;
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        data.is_edit = 1
        this.productionService.postRequestCreator('update-bag-size-data', data).subscribe((data: any) => {
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
              while (this.spp.controls.length != 0) {
                this.remove(0)
              }
              this.sppDataArray.clear();
              this.employees().clear
              this.getListData1();
              this.totalQtyValue = 0
              this.ngForm.controls['total_breeder_qty'].setValue('');
              this.ngForm.controls['under_size'].setValue('')
              this.ngForm.controls['processing_loss'].setValue('')
              this.ngForm.controls['total_rejected'].setValue('')
              this.ngForm.controls['recovery_qty'].setValue('')
              this.ngForm.controls['tentative_recovery'].setValue('')
              this.ngForm.controls['variety_level_2'].setValue('')
              this.ngForm.controls['lot_no'].setValue('');
              this.under_sizepercent = ''
              if (!this.is_potato) {
                this.ngForm.controls['spp']['controls'][0].controls['bags'].setValue(50)
              } else {
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
        ;
      } else if (result.isDenied) {
        data.is_edit = 0
        this.productionService.postRequestCreator('update-bag-size-data', data).subscribe((data: any) => {
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
              while (this.spp.controls.length != 0) {
                this.remove(0)
              }
              this.sppDataArray.clear();
              this.employees().clear
              this.getListData1();
              this.ngForm.controls['total_breeder_qty'].setValue('');
              this.ngForm.controls['under_size'].setValue('')
              this.ngForm.controls['processing_loss'].setValue('')
              this.ngForm.controls['total_rejected'].setValue('')
              this.ngForm.controls['recovery_qty'].setValue('')
              this.ngForm.controls['tentative_recovery'].setValue('')
              this.ngForm.controls['variety_level_2'].setValue('')
              this.ngForm.controls['lot_no'].setValue('');
              this.under_sizepercent = ''
              if (!this.is_potato) {
                this.ngForm.controls['spp']['controls'][0].controls['bags'].setValue(50)
              } else {
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
    });
  }

  cancel() {
    this.showLotPageData = false;
    this.showGrid = true;
    this.employees().clear;
    this.sppDataArray.clear();
    this.totalQtyValue = 0;
    this.ngForm.controls['total_breeder_qty'].setValue('');
    this.ngForm.controls['under_size'].setValue('')
    this.ngForm.controls['processing_loss'].setValue('')
    this.ngForm.controls['total_rejected'].setValue('')
    this.ngForm.controls['recovery_qty'].setValue('')
    this.ngForm.controls['tentative_recovery'].setValue('')
    this.ngForm.controls['variety_level_2'].setValue('')
    this.ngForm.controls['lot_no'].setValue('');
    this.under_sizepercent = '';
    if (!this.is_potato) {
      this.ngForm.controls['spp']['controls'][0].controls['bags'].setValue(50)
    } else {
      // this.ngForm.controls['spp']['controls'][0].controls['bags'].setValue('')
    }

    this.getListData1()
  }


  getYear() {
    const route = "get-year-of-tags-number";
    const result = this.productionService.postRequestCreator(route, null).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.yearData = res ? res : '';
      let yearData = []
    });
  }

  getSeason() {
    const route = "get-season-of-tags-number";
    const param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
      }
    }
    const result = this.productionService.postRequestCreator(route, param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      let seasonData = []
      this.seasonlist = res ? res : '';
    });
  }

  getCrop() {
    const route = "get-crop-of-tags-number";
    const param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
      }
    }
    const result = this.productionService.postRequestCreator(route, param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.cropData = res ? res : '';
      this.croplistSecond = res ? res : ''
    });
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

  sppCreateForm(): FormGroup {
    return this.fb.group({
      no_of_bags: [''],
      bags: [''],
      qty: [''],
    })
  }


  sppData() {
    return this.ngForm.get('spp') as FormArray;
  }

  addMore(i) {
    this.sppData().push(this.sppCreateForm());
  }

  employees() {
    return this.ngForm.get('spp') as FormArray;
  }

  get sppDataArray() {
    return this.ngForm.get('spp') as FormArray;
  }

  get nestedArrays() {
    return this.ngForm.get('spp') as FormArray;
  }

  showLotPageSecond(item, data, action, lot) {
    this.showLotPage(item, data, action, lot)
    this.showLotPageDataSecond = true;
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
          this.totalQtyValue = totalQty;
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
        // // // console.log(bag_marka,'bag_marka')
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

  remove(rowIndex: number) {
    this.sppData().removeAt(rowIndex);
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
    if (data?.spp?.length > 0) {
      data.spp.forEach((el) => {
        let rejectedStr = el?.total_rejected || "0"; // Default to "0" if empty
        let rejectedNum = parseFloat(rejectedStr.split(" ")[0]) || 0; // Extract numeric value
        totalRejectedQty += rejectedNum;
      });
    }
    this.ngForm.controls['total_rejected'].setValue(totalRejectedQty.toFixed(2));
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
    this.totalQtyValue = totalQty;
    this.ngForm.controls['total_breeder_qty'].setValue(`${totalQty.toFixed(2)} (${percentQty.toFixed(2)} %)`);
    this.getBagMarkaData(totalBags); // Call to update bag data
  }

  trackByFn(index: number, item: any): number {
    return index; // or use a unique identifier for better performance
  }

  getBagMarkaData(totalBags) {
    let bag_markaData = [];
    // Generate the `bag_markaData` array based on the total number of bags
    if (totalBags) {
      for (let index = 1; index <= totalBags; index++) {
        bag_markaData.push({ id: index, bags: index });
      }
    }
    const sppControls = this.ngForm.get('spp') as FormArray; // Get spp FormArray
    // Ensure stackControls has enough entries before accessing
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

  getLossQty() {
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

    // console.log("gettotalrejected", total_rejected);

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



  convertToString(item) {
    if (item && item.length > 0) {
      return item ? item[0].toString() : ''
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
      // console.log(modifiedStr);
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
