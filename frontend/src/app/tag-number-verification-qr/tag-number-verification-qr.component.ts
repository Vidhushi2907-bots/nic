

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IAngularMyDpOptions, IMyDate, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { checkDecimal } from 'src/app/_helpers/utility';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import * as html2PDF from 'html2pdf.js';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap'
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router';
// import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap'; 
@Component({
  selector: 'app-tag-number-verification-qr',
  templateUrl: './tag-number-verification-qr.component.html',
  styleUrls: ['./tag-number-verification-qr.component.css']
})
export class TagNumberVerificationQrComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  @ViewChild('alertButton', { static: false }) button: ElementRef;
  dummyData = []
  baseUrl: string = environment.ms_nb_01_master.baseUrl;
  ngForm!: FormGroup
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []
  allData: any;
  yearData;
  item: any;
  seasonlist
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
  carddata;

  productiuon_name;
  breederaddress;
  productiuon_short_name;
  contactPersonName;
  designationname;
  tag_no: any;
  tagArraydata: string | null = null; // Dynamically assigned tag number

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
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings2: IDropdownSettings = {};
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
  LotData = [
    {
      id: 1,
      lot_name: 'Lot 1'
    },
    {
      id: 2,
      lot_name: 'Lot 2'
    },
  ]
  showLotPageData: boolean;
  totalNoofBags: number;
  cropDataSecond: any;
  showBagDetails: boolean;
  lotData: any;
  gridData: any;
  registerTags: any;
  agency_name: any;
  district_name: any;
  state_name: any;
  designation_name: any;
  lotDataValue: any;
  closeResult = '';
  modal = 'modal';
  name = 'Angular';
  tagData: any;
  tagno: string;
  rangeData: any[];
  previousLot: any;
  previewTagtext: boolean;
  encryptedData: string;
  errorMessage: string;
  tagNo: any;
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
  constructor(private route: ActivatedRoute, private service: SeedServiceService, private fb: FormBuilder, private productionService: ProductioncenterService, private modalService: NgbModal) {
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
      bspc: this.fb.array([

        this.bspcCreateForm()
      ])
    });
    this.ngForm.controls['season'].disable();


    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['season'].enable();
        this.selectVariety = '';
        this.selectCrop = '';
        this.ngForm.controls['crop'].reset('');
        // this.getSeasonData()
        this.selectParentalLine = '';
        this.editData = false;
        this.selectPlot = '';
        this.isParentalLine = false;

        this.ngForm.controls['season'].markAsUntouched();
        this.selectParentalLine = '';
        this.isSearchClicked = false;
        this.getSeason()
      }


    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.getCrop()
        this.selectVariety = '';
        this.selectCrop = '';
        this.selectParentalLine = '';
        this.selectPlot = '';
        this.ngForm.controls['crop'].reset('');
        this.isParentalLine = false;
        this.editData = false;
        this.selectParentalLine = '';
        // this.getCropData()
        this.isSearchClicked = false;
        // getCrop();
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {

        this.selectVariety = '';
        this.selectParentalLine = '';
        if (newvalue.slice(0, 1) == "A") {
          this.unit = "Qt";
        } else {
          this.unit = "Kg";
        }
        this.selectPlot = '';
        this.editData = false;
        this.selectParentalLine = '';
        this.isSearchClicked = false;
        this.isParentalLine = false;
        // this.getVarietyData()
        // getVariety();
      }
    });
    this.ngForm.controls['variety'].valueChanges.subscribe(newvalue => {
      if (newvalue) {


        this.getListData()
      }
    });
    this.ngForm.controls['lot_no'].valueChanges.subscribe(newvalue => {
      if (newvalue) {


        this.getListData()
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


  }

  // ngOnInit(): void {
  //   this.route.queryParams.subscribe((params) => {
  //     const tagNo = params['tagNo'];  
  //      // Check if 'isPreview' exists in the query params, if not, default to 'false'
  //     const isPreview = params['isPreview'] === 'true';

  //     if (Array.isArray(tagNo)) {
  //       this.tagArraydata = tagNo[0];  
  //     } else {
  //       this.tagArraydata = tagNo;  
  //     }

  //     console.log(this.tagArraydata);  
  //     this.getTagDetails();
  //   });
  // }


  // getTagDetails() {  
  //   const param = { tag_no: this.tagArraydata }; // Include the tag number

  //   this.productionService.postRequestCreator('get-tag-details', param).subscribe(
  //       (data) => { 
  //           if (data?.EncryptedResponse?.status_code === 200) { 
  //               this.allData = data.EncryptedResponse.data || [];
  //               console.log(this.allData); 
  //           }
  //       },
  //       (error) => {
  //           console.error('Error fetching tag details:', error);
  //       }
  //   );
  // }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // Extract 'tagNo' from the query params
      const tagNo = params['tagNo'];

      // Check if 'isPreview' exists in the query params, if not, default to 'false'
      const isPreview = params['isPreview'] === 'true';

      // Set the tagNo and isPreview accordingly
      if (Array.isArray(tagNo)) {
        this.tagArraydata = tagNo[0];
      } else {
        this.tagArraydata = tagNo;
      }

      console.log('Tag Number:', this.tagArraydata);
      console.log('Is Preview:', isPreview);

      // Call the method to fetch tag details with the preview flag
      this.getTagDetails(isPreview);
    });
  }

  getTagDetails(isPreview: boolean) {
    const param = { tag_no: this.tagArraydata };
    console.log("tag array data ",param);
    // Pass the 'isPreview' flag in the request
    this.productionService.postRequestCreator(`get-tag-details?isPreview=${isPreview}`, param).subscribe(
      (data) => {
        if (data?.EncryptedResponse?.status_code === 200) {
          this.allData = data?.EncryptedResponse?.data || [];
          console.log(this.allData);
        }
      },
      (error) => {
        console.error('Error fetching tag details:', error);
      }
    );
  }



  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }
  crop(item: any) {
    this.selectCrop = item && item.crop_name ? item.crop_name : ''
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropData = this.croplistSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
  }
  cClick() {
    document.getElementById('crop').click()
  }

  searchData() {
    this.showGrid = true;
    // year: ['', [Validators.required]],
    // season: ['', [Validators.required]],
    // crop: ['', [Validators.required]],
    if ((!this.ngForm.controls['year'].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    else if ((!this.ngForm.controls['season'].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    else if ((!this.ngForm.controls['crop'].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    else {
      this.getVarietyData();
      this.getStllotData();
      this.getListData()

    }

    // this.tableData = [
    //   {
    //     variety_name: 'Wheat',
    //     lot_details: [
    //       {
    //         lot_no: 'Sep23-010',
    //         lot_qty: 200,
    //         total_no_bags: 30,
    //         godown_no: 30,
    //         stack_no: 'R/355',
    //         no_of_bags: 40,
    //         bag_size: 40,
    //         tag_no: 'gp1-33'
    //       }
    //     ]

    //   }
    // ]


  }
  getListData() {
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
        // res.forEach((el)=>{
        //   el.lot_details.forEach((item)=>{
        //     item.storage_details= item.storage_details.filter((arr, index, self) =>
        //     index === self.findIndex((t) => ( t.proceseed_id === arr.proceseed_id )))


        //   })
        // })
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
    });
  }

  variety(item) {
    this.selectVariety = item && item.variety_name ? item.variety_name : ''
    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    this.cropData = this.croplistSecond;
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
  }
  vClick() {
    document.getElementById('Variety').click()
  }
  showLotPage(data, item) {
    this.showLotPageData = true;

    this.gridData = data;
    this.lotData = item;
  }
  submit() {
    this.getDataofGeneratingTags()
  }
  getDataofGeneratingTags() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let UserId = datas.id
    const param = {
      year: this.ngForm.controls['year'].value,
      season: this.ngForm.controls['season'].value,
      user_id: UserId
    }
    this.productionService.postRequestCreator('get-data-generating-tags', param).subscribe((data) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : 0;
        this.registerTags = res;
        this.save();

      }
    })

  }
  save() {
    let data = this.ngForm.value;
    let param = data;
    param.variety_name = this.gridData && this.gridData.variety_name ? this.gridData.variety_name : '';
    param.variety_code = this.gridData && this.gridData.variety_code ? this.gridData.variety_code : '';
    param.variety_code_line = this.gridData && this.gridData.variety_code_line ? this.gridData.variety_code_line : '';
    param.class_of_seed = this.lotData && this.lotData.class_of_seed ? this.lotData.class_of_seed : '';
    param.lot_no = this.lotData && this.lotData.lot_no_stl ? this.lotData.lot_no_stl : this.lotData && this.lotData.lot_no ? this.lotData.lot_no : '';
    param.lot_id = this.lotData && this.lotData.lot_id_stl ? this.lotData.lot_id_stl : this.lotData && this.lotData.lot_id ? this.lotData.lot_id : '';
    param.lot_id = this.lotData && this.lotData.lot_id_stl ? this.lotData.lot_id_stl : this.lotData && this.lotData.lot_id ? this.lotData.lot_id : '';
    if (this.lotData && this.lotData.action && this.lotData.action == 1) {
      param.lot_qty = this.lotData && this.lotData.total_processed_qty ? this.lotData.total_processed_qty : '';
    } else if (this.lotData && this.lotData.action && this.lotData.action == 2) {
      param.lot_qty = this.lotData && this.lotData.total_recover_qty ? this.lotData.total_recover_qty : '';
    }
    else if (this.lotData && this.lotData.action && this.lotData.action == 3) {
      param.lot_qty = this.lotData && this.lotData.lot_qty ? this.lotData.lot_qty : '';
    }
    if (this.lotData && this.lotData.action && this.lotData.action == 1) {
      param.no_of_bags = this.lotData && this.lotData.totalBags ? this.lotData.totalBags : '';
      param.godown_no = this.lotData && this.lotData.godownNoStack ? this.convertToString(this.lotData.godownNoStack) : '';
      param.stack_no = this.lotData && this.lotData.stack_no_stl ? this.lotData.stack_no_stl : '';
    } else {
      param.no_of_bags = this.lotData && this.lotData.no_of_bags_register ? this.lotData.no_of_bags_register : '';
      param.godown_no = this.lotData && this.lotData.godown_no_register ? (this.lotData.godown_no_register) : '';
      param.stack_no = this.lotData && this.lotData.stack_no_register ? this.lotData.stack_no_register : '';
    }
    param.pure_seed = this.lotData && this.lotData.pure_seed ? this.lotData.pure_seed : '';
    param.inert_matter = this.lotData && this.lotData.inert_matter ? this.lotData.inert_matter : '';
    param.germination = this.lotData && this.lotData.germination ? this.lotData.germination : '';
    param.date_of_test = this.lotData && this.lotData.date_of_test ? this.lotData.date_of_test : '';
    param.valid_upto = this.lotData && this.lotData.date_of_test ? this.getDateAfter9Months(this.lotData.date_of_test) : '';


    let tagsData = this.generateTags();
    let tagProcessed = this.tagProcessedTags();
    let bagsData = []
    if (tagProcessed && tagProcessed.length > 0) {
      tagProcessed.forEach(el => {
        if (el && el.bagrange && el.bagrange.length > 0) {
          bagsData.push(...el.bags)
        }
      })
    }
    // if(bagsData && bagsData.length>0){
    //   bagsData= bagsData.flat();
    // }

    param.bagsData = bagsData;
    param.processedData = tagProcessed
    // param.seedDetails= this.sed
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let code = datas && datas.code ? datas.code : "NA";
    param.code = code;
    console.log(param, 'param')
    this.productionService.postRequestCreator('save-data-seed-tags', param).subscribe(data => {
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
            this.showLotPageData = false;
            this.searchData()

          }
        })
      }

    })
  }
  getDateAfter9Months(dateString) {
    // Parse the input date string
    var parts = dateString.split('/');
    var day = parseInt(parts[0]);
    var month = parseInt(parts[1]) - 1; // Subtract 1 to convert to zero-based index
    var year = parseInt(parts[2]);

    // Create a Date object for the input date
    var originalDate = new Date(year, month, day);

    // Calculate the date after 9 months
    originalDate.setMonth(originalDate.getMonth() + 9);

    // Extract day, month, and year from the resulting date
    var newDay = originalDate.getDate();
    var newMonth = originalDate.getMonth() + 1; // Add 1 to convert back to one-based index
    var newYear = originalDate.getFullYear();

    // Format the resulting date into 'DD/MM/YYYY' format
    var formattedDate = newDay.toString().padStart(2, '0') + '/' + newMonth.toString().padStart(2, '0') + '/' + newYear;

    return formattedDate;
  }



  tagProcessedTags() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let code = datas && datas.code ? datas.code : "NA";
    let no_of_bags;
    if (this.lotData && this.lotData.get_carry_over && (this.lotData.get_carry_over == 2)) {
      let proceseedData = this.lotData && this.lotData.process_details ? this.lotData.process_details : '';
      let year = this.lotData && this.lotData.year_of_indent ? this.lotData.year_of_indent : 'NA';
      year = year ? year % 100 : "NA";
      if (proceseedData && proceseedData.length > 0) {
        let currentStart = this.registerTags + 1;
        // Adding bagrange to each object
        proceseedData = proceseedData.map(item => {
          const startBag = currentStart;
          const endBag = currentStart + item.no_of_bags_processed - 1;
          const startRange = Number(startBag);
          const endRange = Number(endBag);
          const bagrange = `B/${year}/${code}/${this.toSixDigitStrings(startBag)}-${this.toSixDigitStrings(endBag)}`;
          currentStart = endBag + 1;
          return {
            ...item,
            bags: bagrange,
            startRange: startRange,
            endRange: endRange,
            bagrange: bagrange,
            year: year
          };
        });
        proceseedData = proceseedData.map(item => {
          item.bags = Array.from(
            { length: item.endRange - item.startRange + 1 },
            (_, i) => ({
              bag: `B/${year}/${code}/${String(item.startRange + i).padStart(6, '0')}`,
              bag_size: item.bag_size_processed,
              no_of_bags: item.no_of_bags_processed,
              qty: item.qty_procecessed,
              year: year
            })
          );
          return item;
        });
      }
      return proceseedData ? proceseedData : 'NA';

    }
    if (this.lotData && this.lotData.get_carry_over && (this.lotData.get_carry_over == 1)) {
      let proceseedData = this.lotData && this.lotData.process_details ? this.lotData.process_details : '';
      let lot_no = this.lotData && this.lotData.lot_no ? this.lotData.lot_no : '';
      let year = lot_no ? lot_no.substring(3, 5) : 'NA';
      // year = year ? year % 100 : "NA";
      if (proceseedData && proceseedData.length > 0) {
        let currentStart = this.registerTags + 1;
        // Adding bagrange to each object
        proceseedData = proceseedData.map(item => {
          const startBag = currentStart;
          const endBag = currentStart + item.no_of_bags_processed - 1;
          const startRange = Number(startBag);
          const endRange = Number(endBag);
          const bagrange = `B/${year}/${code}/${this.toSixDigitStrings(startBag)}-${this.toSixDigitStrings(endBag)}`;
          currentStart = endBag + 1;
          return {
            ...item,
            bags: bagrange,
            startRange: startRange,
            endRange: endRange,
            bagrange: bagrange,
            year: year
          };
        });
        proceseedData = proceseedData.map(item => {
          item.bags = Array.from(
            { length: item.endRange - item.startRange + 1 },
            (_, i) => ({
              bag: `B/${year}/${code}/${String(item.startRange + i).padStart(6, '0')}`,
              bag_size: item.bag_size_processed,
              no_of_bags: item.no_of_bags_processed,
              qty: item.qty_procecessed,
              year: year
            })
          );
          return item;
        });
        return proceseedData ? proceseedData : 'NA';
      }
    }
  }
  toSixDigitStrings(number) {
    return number.toString().padStart(6, '0');
  }
  generateTags() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let code = datas && datas.code ? datas.code : "NA";
    let no_of_bags;
    if (this.lotData && this.lotData.action && this.lotData.action == 1) {
      no_of_bags = this.lotData && this.lotData.totalBags ? this.lotData.totalBags : '';
    } else {
      no_of_bags = this.lotData && this.lotData.no_of_bags_register ? this.lotData.no_of_bags_register : '';
    }
    if (this.lotData && this.lotData.get_carry_over && (this.lotData.get_carry_over == 2)) {
      let year = this.lotData && this.lotData.year_of_indent ? this.lotData.year_of_indent : 'NA';
      year = year ? year % 100 : "NA"
      let registerTags = (this.registerTags + 1);

      no_of_bags = no_of_bags ? parseInt(no_of_bags) : 0
      let array = [];
      for (let i = registerTags; i <= no_of_bags; i++) {
        array.push(i)
      }
      let toSixDigitString = this.toSixDigitString(array);
      let processed_qty = []
      if (toSixDigitString && toSixDigitString.length > 0) {
        for (let i = 1; i <= toSixDigitString.length; i++) {
          processed_qty.push('B' + '/' + year + '/' + code + '/' + i)
        }
      }
      return processed_qty && processed_qty.length > 0 ? processed_qty : 'NA'
    }

  }
  toSixDigitString(number) {
    return number.map(number => number.toString().padStart(6, '0'));
  }
  cancel() {
    this.showLotPageData = false;
    this.showBagDetails = false;
  }
  printag() {
    // let printContentse

    // window.print();
    const name = 'generate-lot';
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


    // document.body.innerHTML = originalContents;ee
    // window.print()
  }
  demoData() {
    // let printContentse

    // window.print();
    const name = 'generate-lot';
    const element = document.getElementById('demo');
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


    // document.body.innerHTML = originalContents;ee
    // window.print()
  }
  sppData() {
    return this.ngForm.get('bspc') as FormArray;
  }
  download(data, item) {
    console.log(data, 'datadata')
    console.log(item, 'itemitem')

    this.showBagDetails = true;
    while (this.bspc.controls.length != 0) {
      this.remove(0)
    }
    let tagData = item && item.seed_tag_range ? item.seed_tag_range : '';
    this.tagData = tagData ? tagData : ''
    console.log(tagData, 'tagData')
    this.gridData = data;
    this.lotData = item;
    if (tagData && tagData.length > 0) {
      tagData.forEach((el) => {
        this.bspc.push(this.bspcCreateForm())
      })

      tagData.forEach((el, i) => {
        if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['no_of_bags']) {
          this.ngForm.controls['bspc']['controls'][i].controls['no_of_bags'].setValue(el && el.no_of_bags_tag_details ? el.no_of_bags_tag_details : '', { emitEvent: false });
        }
        if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['bag_size']) {
          this.ngForm.controls['bspc']['controls'][i].controls['bag_size'].setValue(el && el.bag_weight_tag_details ? el.bag_weight_tag_details : '', { emitEvent: false });
        }
        if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['tag_number']) {
          this.ngForm.controls['bspc']['controls'][i].controls['tag_number'].setValue(el && el.tag_range ? el.tag_range : '', { emitEvent: false });
        }
      })
      // this.getTagData(item)
    }


  }
  getTagData(val) {
    let seed_tag_range_id = []
    // if (val && val.seed_tag_range && val.seed_tag_range.length > 0) {
    //   val.seed_tag_range.forEach((el) => {
    //     // if(el && el.seed_tag_range && el.seed_tag_range.length>0){
    //     seed_tag_range_id.push(el && el.seed_tag_range_id ? el.seed_tag_range_id : '')

    //   })
    // }
    const param = {
      search: {
        seed_tag_range_id: this.lotData && this.lotData.seed_tag_range && this.lotData.seed_tag_range[val] && this.lotData.seed_tag_range[val].seed_tag_range_id ? this.lotData.seed_tag_range[val].seed_tag_range_id : '',
      }
    }
    this.productionService.postRequestCreator('get-tag-data', param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      if (res && res.length > 0) {

      }
      this.ngForm.controls['bspc']['controls'][val].controls['tagArray'].setValue(res)

    });
  }
  remove(rowIndex: number) {
    this.sppData().removeAt(rowIndex);
    // if (this.sppData().controls.length > 1) {
    // } else {
    //   this.removeData()
    // }
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
  convertToString(item) {
    if (item && item.length > 0) {
      return item ? item.toString() : ''
    } else {
      return 'NA'
    }
  }
  convertToRange(item) {
    if (item) {
      let data = item ? item.split(',') : '';
      return data ? data.length : 'NA'
    } else {
      return 'NA'
    }
  }
  bspcCreateForm(): FormGroup {
    return this.fb.group({
      // variety_name: [''],
      // line_variety_name: [''],
      // line_variety_code: [''],
      // carry_over: [''],
      // breeder_seed_produced: [''],
      // total_breeder_seed: [''],
      // total_nation_qty: [''],
      // total_direct_qty: [''],
      // line_variet_name:[''],
      // allocate_qty:['']
      no_of_bags: [],
      bag_size: [],
      tag_number: [],
      select_tag_range: [1],
      tag_range: [],
      selectTagData: [],
      tagArray: [],
      variety_name: [],
      date_of_test: [],
      pure_seed: [],
      germination: [],
      inert_matter: [],
      lot_no: [],
      producing_institue: []

    })
  }
  changeRadio(item, index) {
    this.ngForm.controls['bspc']['controls'][index].controls['select_tag_range'].setValue(item, { emitEvent: false });
    if (item && item == 2) {

      this.getTagData(index)
    }
    this.ngForm.controls['bspc']['controls'][index].controls['tag_range'].setValue('', { emitEvent: false })
  }
  previewTag(i) {
    this.previewTagtext = true;
    if (this.ngForm.controls['bspc']['controls'][i].controls['select_tag_range'].value == 1) {

      let data = this.ngForm.controls['bspc']['controls'][i].controls['tag_range'].value;
      if (data) {
        let item = this.lotData && this.lotData.seed_tag_range && this.lotData.seed_tag_range[i] && this.lotData.seed_tag_range[i] ? this.lotData.seed_tag_range[i] : '';
        let range = this.parseRanges(data);
        let start = item && item.start_range ? item.start_range : 0;
        let end = item && item.end_range ? item.end_range : 0;
        if (range && range.length > 0) {

          for (let i = 0; i < range.length; i++) {
            if (range[i] < start || range[i] > end) {
              Swal.fire({
                title: '<p style="font-size:25px;">Tag No. is out of valid range.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#E97E15'
              })
              return;

              // alert(`Element ${range[i]} is out of range!`);
            }
            else {
              const getLocalData = localStorage.getItem('BHTCurrentUser');
              let datas = JSON.parse(getLocalData)
              let code = datas && datas.code ? datas.code : "NA";
              if (this.lotData && this.lotData.get_carry_over && (this.lotData.get_carry_over == 2)) {
                let proceseedData = this.lotData && this.lotData.process_details ? this.lotData.process_details : '';


                let lot_no = this.lotData && this.lotData.lot_no ? this.lotData.lot_no : '';
                let year = this.lotData && this.lotData.year_of_indent ? this.lotData.year_of_indent : 'NA';
                year = year ? year % 100 : "NA";
                let rangeData = [];
                let rangeData2 = [];
                if (range && range.length > 0) {
                  range.forEach((el) => {
                    rangeData.push(`B/${year}/${code}/${this.toSixDigitStrings(el)}`)
                    rangeData2.push({ tags: `B/${year}/${code}/${this.toSixDigitStrings(el)}` })
                  })
                }
                this.rangeData = rangeData2
                const param = {
                  search: {
                    range: rangeData && rangeData.length > 0 ? rangeData : '',
                    id: item && item.seed_tag_range_id ? item.seed_tag_range_id : ''
                  }
                }
                this.productionService.postRequestCreator('get-lot-from-range', param).subscribe(data => {
                  let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
                  console.log(res, 'data')
                  let rangeError = false;
                  let datas = []
                  if (data && data.length > 0) {
                    data.every(el => {
                      datas.push(el && el.is_active ? el.is_active : '')
                    })
                  }
                  if (datas.includes(1)) {
                    Swal.fire({
                      title: '<p style="font-size:25px;">Enter valid tag range.</p>',
                      icon: 'error',
                      confirmButtonText:
                        'OK',
                      confirmButtonColor: '#E97E15'
                    })
                    return;
                  }
                })

              }
              if (this.lotData && this.lotData.get_carry_over && (this.lotData.get_carry_over == 1)) {
                let proceseedData = this.lotData && this.lotData.process_details ? this.lotData.process_details : '';
                let lot_no = this.lotData && this.lotData.lot_no ? this.lotData.lot_no : '';
                let year = lot_no ? lot_no.substring(3, 5) : 'NA';
                let rangeData = [];
                if (range && range.length > 0) {
                  range.forEach((el) => {
                    rangeData.push(`B/${year}/${code}/${this.toSixDigitStrings(el)}`)
                  })
                }
                const param = {
                  search: {
                    range: rangeData && rangeData.length > 0 ? rangeData : '',
                    id: item && item.seed_tag_range_id ? item.seed_tag_range_id : ''
                  }
                }
                this.productionService.postRequestCreator('get-lot-from-range', param).subscribe(data => {
                  let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
                  let rangeError = false
                  let ranges = []
                  if (res && res.length > 0) {
                    res.forEach(el => {
                      ranges.push(el && el.is_active ? el.is_active : '')
                    })
                  }
                  if (ranges.includes(1)) {
                    Swal.fire({
                      title: '<p style="font-size:25px;">Enter valid tag range.</p>',
                      icon: 'error',
                      confirmButtonText:
                        'OK',
                      confirmButtonColor: '#E97E15'
                    })
                    return;
                  }
                })

                //   return proceseedData ? proceseedData : 'NA';              // }
              }

              // console.log(item.tag_range, ' B/23/ssssss/000001-000015 ')
            }
          }

          const { lot_no, pure_seed, inert_matter, germination, date_of_test, valid_upto } = this.lotData;
          const { variety_name, line_variety_name } = this.gridData;
          const filteredProperties = { lot_no, pure_seed, inert_matter, germination, date_of_test, valid_upto };
          const filteredProperties2 = { variety_name, line_variety_name };

          this.rangeData = this.rangeData.map(item => {
            return { ...item, ...filteredProperties, ...filteredProperties2 };
          });

          this.carddata = this.rangeData;
          this.carddata = this.carddata.map((item, index) => {
            item.pageId = (index + 1) % 2 === 0 ? 'page-break1' : 'page-break2';
            return item;
          });

          this.printag();
          this.getListData();
        }
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Enter Range.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
        return;

      }


    } else {
      let data = this.ngForm.controls['bspc']['controls'][i].controls['tag_range'].value;
      let tags = [];
      let tagArray = [];
      if (data && data.length > 0) {
        data.forEach(el => {
          tags.push({ tags: el && el.tag_no ? el.tag_no : '', bag_weight: this.ngForm.controls['bspc']['controls'][i].controls['bag_size'].value })
          tagArray.push(el.tag_no)
        })

        const { lot_no, pure_seed, inert_matter, germination, date_of_test, valid_upto } = this.lotData;
        const { variety_name, line_variety_name } = this.gridData;
        const filteredProperties = { lot_no, pure_seed, inert_matter, germination, date_of_test, valid_upto };
        const filteredProperties2 = { variety_name, line_variety_name };

        tags = tags.map(item => {
          return { ...item, ...filteredProperties, ...filteredProperties2 };
        });

        this.carddata = tags;
        this.carddata = this.carddata.map((item, index) => {
          item.pageId = (index + 1) % 2 === 0 ? 'page-break1' : 'page-break2';
          return item;
        });
        this.printag()
        // this.updateLotStaus(i)
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Select Tag No.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
        return;
      }
    }

  }
  parseRanges(input) {
    let result = [];

    // Split input by commas
    let parts = input.split(',');

    // Process each part
    parts.forEach(part => {
      if (part.includes('-')) {
        // It's a range, so split it by dash
        let [start, end] = part.split('-').map(Number);
        // Add all numbers in the range to the result
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
      } else {
        // It's a single number, add it to the result
        result.push(Number(part));
      }
    });

    return result;
  }

  printTag(i) {
    this.previewTagtext = false;
    let data = this.ngForm.controls['bspc']['controls'][i].controls['tag_range'].value;
    let tags = []
    let tagArray = [];
    if (this.ngForm.controls['bspc']['controls'][i].controls['select_tag_range'].value == 2) {
      console.log(data, 'datadata')
      if (data && data.length > 0) {
        data.forEach(el => {
          tags.push({
            tags: el && el.tag_no ? el.tag_no : '',
            bag_weight: this.ngForm.controls['bspc']['controls'][i].controls['bag_size'].value,
            tag_id: el && el.id ? el.id : ''
          })
          tagArray.push(el.tag_no)
        })


        const { lot_no, pure_seed, inert_matter, germination, date_of_test, valid_upto, lot_id } = this.lotData;
        const { variety_name, line_variety_name } = this.gridData;
        const filteredProperties = { lot_no, pure_seed, inert_matter, germination, date_of_test, valid_upto, lot_id };
        const filteredProperties2 = { variety_name, line_variety_name };

        tags = tags.map(item => {
          return { ...item, ...filteredProperties, ...filteredProperties2 };
        });

        this.carddata = tags;
        this.carddata = this.carddata.map((item, index) => {
          item.pageId = (index + 1) % 2 === 0 ? 'page-break1' : 'page-break2';
          return item;
        });
        // this.printag()
        // this.updateLotStaus(i)
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Select Tag No.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
        return;
      }
    } else {
      let data = this.ngForm.controls['bspc']['controls'][i].controls['tag_range'].value;
      let item = this.lotData && this.lotData.seed_tag_range && this.lotData.seed_tag_range[i] && this.lotData.seed_tag_range[i] ? this.lotData.seed_tag_range[i] : '';
      let range = this.parseRanges(data);
      let start = item && item.start_range ? item.start_range : 0;
      let end = item && item.end_range ? item.end_range : 0;
      if (range && range.length > 0) {

        for (let i = 0; i < range.length; i++) {
          if (range[i] < start || range[i] > end) {
            Swal.fire({
              title: '<p style="font-size:25px;">Tag No. is out of valid range.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            })
            return;

            // alert(`Element ${range[i]} is out of range!`);
          }
          else {
            const getLocalData = localStorage.getItem('BHTCurrentUser');
            let datas = JSON.parse(getLocalData)
            let code = datas && datas.code ? datas.code : "NA";
            if (this.lotData && this.lotData.get_carry_over && (this.lotData.get_carry_over == 1)) {
              let proceseedData = this.lotData && this.lotData.process_details ? this.lotData.process_details : '';
              let lot_no = this.lotData && this.lotData.lot_no ? this.lotData.lot_no : '';
              let lot_id = this.lotData && this.lotData.lot_id ? this.lotData.lot_id : '';
              let year = lot_no ? lot_no.substring(3, 5) : 'NA';
              let rangeData = [];
              if (range && range.length > 0) {
                // console.log(range,'range')
                console.log(range, 'range')
                range.forEach((el) => {
                  rangeData.push({ tags: `B/${year}/${code}/${this.toSixDigitStrings(el)}`, tag_id: el && el.id ? el.id : '' })
                })
                console.log(range, 'rangerange')
                console.log(this.lotData, ' this.lotData this.lotData')
                console.log(this.gridData, ' this.gridData this.gridData')
                const { lot_no, pure_seed, inert_matter, germination, date_of_test, valid_upto, lot_id } = this.lotData;
                const { variety_name, line_variety_name } = this.gridData;
                const filteredProperties = { lot_no, pure_seed, inert_matter, germination, date_of_test, valid_upto, lot_id };
                const filteredProperties2 = { variety_name, line_variety_name };
                rangeData = rangeData.map(item => {
                  return { ...item, ...filteredProperties, ...filteredProperties2 };
                });
                this.carddata = rangeData;
                this.carddata = this.carddata.map((item, index) => {
                  item.pageId = (index + 1) % 2 === 0 ? 'page-break1' : 'page-break2';
                  return item;
                });
              }
            }
            if (this.lotData && this.lotData.get_carry_over && (this.lotData.get_carry_over == 2)) {
              let proceseedData = this.lotData && this.lotData.process_details ? this.lotData.process_details : '';
              let year = this.lotData && this.lotData.year_of_indent ? this.lotData.year_of_indent : 'NA';
              year = year ? year % 100 : "NA";
              let rangeData = [];
              if (range && range.length > 0) {
                range.forEach((el) => {
                  rangeData.push({ tags: `B/${year}/${code}/${this.toSixDigitStrings(el)}` })
                })
              }
              const { lot_no, pure_seed, inert_matter, germination, date_of_test, valid_upto, lot_id } = this.lotData;
              const { variety_name, line_variety_name } = this.gridData;
              const filteredProperties = { lot_no, pure_seed, inert_matter, germination, date_of_test, valid_upto, lot_id };
              const filteredProperties2 = { variety_name, line_variety_name };

              rangeData = rangeData.map(item => {
                return { ...item, ...filteredProperties, ...filteredProperties2 };
              });

              this.carddata = rangeData;
              this.carddata = this.carddata.map((item, index) => {
                item.pageId = (index + 1) % 2 === 0 ? 'page-break1' : 'page-break2';
                return item;
              });
              // this.updateLotStaus(i)

              console.log(rangeData, 'ran')
            }

          }

        }
      }
    }
    const userData = localStorage.getItem('BHTCurrentUser');
    const datas = JSON.parse(userData);
    let userId = datas.id;
    // console.log(this.carddata,'carddatacarddata')
    let y = this.ngForm.controls["year"].value;
    let s = this.ngForm.controls["season"].value;
    let c = this.ngForm.controls["crop"].value;
    let uid = userId;
    const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ y, s, uid, c, carddata: this.carddata }), 'a-343%^5ds67fg%__%add').toString();
    this.encryptedData = encodeURIComponent(encryptedForm);
    const decodedEncryptedData = decodeURIComponent(this.encryptedData);
    const bytes = CryptoJS.AES.decrypt(decodedEncryptedData, 'a-343%^5ds67fg%__%add');
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedString);
    console.log('decryptedData===', decryptedData);
    this.getListData()
    this.updateLotStausrange(i)
    // this.printag();
  }


  getBscpData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let UserId = datas.id
    const param = {
      "search": {
        "user_id": UserId,
      }
    }
    const result = this.productionService.postRequestCreator('get-agency-data', param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data[0] ? data.EncryptedResponse.data[0] : '';
      this.contactPersonName = res && res.contact_person_name ? res.contact_person_name : 'NA';
      this.agency_name = res && res.agency_name ? res.agency_name : 'NA';
      this.district_name = res && res.district_name ? res.district_name : 'NA';
      this.state_name = res && res.state_name ? res.state_name : 'NA';
      this.designation_name = res && res.designation_name ? res.designation_name : "NA"
    });
  }
  updateLotStaus(i) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let UserId = datas.id
    let data = this.ngForm.controls['bspc']['controls'][i].controls['tag_range'].value;
    let tags = []
    if (data && data.length > 0) {
      data.forEach(el => {
        tags.push(el && el.id ? el.id : '')
      })
    }
    const param = {
      "search": {
        "seedTagsData": tags,
      }
    }
    const result = this.productionService.postRequestCreator('update-lot-status', param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.getTagData(i)
    });
  }
  updateLotStausrange(i) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let UserId = datas.id
    let data = this.carddata;
    let tags = [];
    let item = this.lotData && this.lotData.seed_tag_range && this.lotData.seed_tag_range[i] && this.lotData.seed_tag_range[i] ? this.lotData.seed_tag_range[i] : '';
    if (data && data.length > 0) {
      data.forEach(el => {
        tags.push(el && el.tags ? el.tags : '')
      })
    }
    const param = {
      "search": {
        "seedTagsData": tags,
        id: item
      }
    }
    const result = this.productionService.postRequestCreator('update-lot-status-range', param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.status_code;
        this.printag();
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Tag Number already Printed.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
        return;
      }
      this.getTagData(i)
    });
  }
  getVarietyData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let UserId = datas.id
    const param = {
      "search": {
        "user_id": UserId,
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
        "crop_code": this.ngForm.controls["crop"].value
      }
    }
    const result = this.productionService.postRequestCreator('get-variety-data-stl', param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.varietyData = res;

    });
  }
  getStllotData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let UserId = datas.id
    const param = {
      "search": {
        "user_id": UserId,
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
        "crop_code": this.ngForm.controls["crop"].value
      }
    }
    const result = this.productionService.postRequestCreator('get-lot-data-stl', param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.lotDataValue = res;
    });
  }
  openModal(inp: string) {
    this.modal = 'modal-open';
  }
  closeModal() {
    this.modal = 'modal';
  }
  show(modalRef: ElementRef) {
    const modal = new Modal(modalRef.nativeElement);
    modal.show();
  }
  show2(modalRef: HTMLDivElement) {
    const modal = new Modal(modalRef);
    modal.show();
  }
  generateTableHTML(data: any[]): string {

    let tableHTML = '<table style="width:100%; ">';
    tableHTML += '<tbody>';
    data.forEach(item => {
      tableHTML += '<tr>';
      tableHTML += `<td style='padding-top:3px;text-align:left;'>${item && item.tag_no ? item.tag_no : 'NA'}</td>`;

      tableHTML += '</tr>';
    });
    tableHTML += '</tbody>';
    tableHTML += '</table>';
    return tableHTML;
  }

  showAlert(i) {
    let item = this.lotData && this.lotData.seed_tag_range && this.lotData.seed_tag_range && this.lotData.seed_tag_range[i] && this.lotData.seed_tag_range[i].seed_tag_range_id ? this.lotData.seed_tag_range[i].seed_tag_range_id : '';
    const param = {
      search: {
        id: item
      }
    }
    const result = this.productionService.postRequestCreator('get-seed-tags-details', param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      // this.lotDataValue = res;
      console.log(res, 'res')
      if (res && res.length > 0) {
        res = res.sort((a, b) => a.id - b.id);

      }
      this.previousLot = res
      //   const buttonElement = event.currentTarget as HTMLElement;
      //   const rect = buttonElement.getBoundingClientRect();

      //   if (res && res.length > 0) {
      //     const tableHTML = this.generateTableHTML(res);
      //     Swal.fire({

      //       html: tableHTML,
      //       // width: '600px',
      //       showCloseButton: true,
      //       focusConfirm: false,
      //       showCancelButton: false, // There won't be any cancel button
      //       showConfirmButton: false,
      //       position: 'top-end',
      //       customClass: {
      //         container: 'swal2-custom-container'
      //       }

      //       // confirmButtonText: 'Close'
      //     });
      //     setTimeout(() => {
      //       const swalContainer = document.querySelector('.swal2-container.swal2-top-end') as HTMLElement;
      //       if (swalContainer) {
      //         swalContainer.style.top = `${rect.top}px`;
      //         swalContainer.style.left = `${rect.right + 10}px`;
      //       }
      //     }, 0);
      //   }

    });
  }
}
