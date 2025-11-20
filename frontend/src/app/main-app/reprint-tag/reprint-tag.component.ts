import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { GenerateTagNumberComponent } from 'src/app/generate-tag-number/generate-tag-number.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import * as html2PDF from 'html2pdf.js';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { environment } from 'src/environments/environment';
import { JsPrintManagerService } from 'src/app/jsprintmanager.service';

@Component({
  selector: 'app-reprint-tag',
  templateUrl: './reprint-tag.component.html',
  styleUrls: ['./reprint-tag.component.css']
})
export class ReprintTagComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  @ViewChild(GenerateTagNumberComponent) GenerateTagNumberComponent!: GenerateTagNumberComponent;

  ngForm: FormGroup = new FormGroup([]);
  inventoryYearData: any;
  inventorySeasonData: any;
  baseUrl: string = environment.ms_nb_06_production_center.baseUrl;
  inventoryVarietyData: any;
  datatodisplay = [];
  reprintVarietyList: any;
  reprintLotNoList: any;
  reprintTagNoList: any;
  isSearch: boolean = false;
  isCrop: boolean;
  showTab: boolean;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []
  allData: any;
  dropdownSettings: IDropdownSettings;
  selectedItems = [];
  dropdownList = [];
  dropdownList1 = [];
  isDisabled: boolean = true;
  forRequest: boolean = false;
  yearOfIndent: any;
  seasonlist: any;
  cropNam: any;
  cropNameSecond: any;
  varietyList: any;
  varietyListSecond: any;
  reprintData: any;

  varietyCategories: any[];
  addVarietySubmission: any[];
  dummyData: { variety_id: string; variety_name: string; indent_quantity: number; bsp2Arr: any[]; }[];
  selectCrop: any;
  selectlab: any;
  selectlab1: any;
  selecttreat: any;
  selecttreat1: any;
  selectCrop_group_code: any;
  selectlab_group_code: any;
  selectlab1_group_code: any;
  crop_name_data: any;
  lab_data: any;
  treat_data: any;
  selectCrop_group: string;
  selectlab_group: string;
  selectlab1_group: string;
  selecttreat_group: string;
  selecttreat1_group: string;
  crop_text_check: string;
  lab_text_check: string;
  lab1_text_check: string;
  treat_text_check: string;
  treat1_text_check: string;
  croupGroup: any;
  selectCrop_crop_code: any;
  selectlab_lab_code: any;
  selectlab1_lab_code: any;
  selecttreat_treat_code: any;
  selecttreat1_treat_code: any;
  labs_data: any;
  treats_data: any;
  selectedTable: string;
  totalNoofBags: number;
  cropDataList: any;
  cropDataListSecond: any;
  varietylineList: any;
  lotNumberList: any;
  // reasonDataList: any;
  reasonDataList = [
    { id: 1, reason: "Misprinting of tags" },
    { id: 2, reason: "Misplacement of tags" },
    { id: 3, reason: "Tags damaged" },
    { id: 4, reason: "Exhaustion of cartridge" }
  ]
  reprintTagData: any;
  getReprintAllDataList: any;
  getReprintTagAllDataList: any;
  varietyApproveList: any;
  getReprintTagNoDataList: any;
  getReprintLotNoDataList: any;
  cardData: any;
  contactPersonName: any;
  agency_name: any;
  district_name: any;
  state_name: any;
  designation_name: any;
  currentDate: Date;

  selectTable(table: string) {
    this.selectedTable = table;
  }
  constructor(private service: SeedServiceService, private fb: FormBuilder, private _productionCenter: ProductioncenterService,private jsPrintManagerService: JsPrintManagerService) {
    this.createForm();
    this.currentDate = new Date();
  }
  selectedTreatment: string = '';
  selectedTreatment1: string = '';
  selectedTreatment2: string = '';
  selectedTreatment3: string = '';
  chemicalName: string = '';
  placeholderText: string = '';
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

  // updatePlaceholder() {
  //   this.placeholderText = this.chemicalName ? `Chemical Name: ${this.chemicalName}` : 'Enter chemical name';
  // }
  createForm() {
    this.ngForm = this.fb.group({
      year: new FormControl('',),
      season: new FormControl(''),
      cropName: new FormControl(''),
      crop_text: new FormControl(''),
      crop_code: new FormControl(''),
      variety: new FormControl(''),
      parental_line: new FormControl(''),
      lot_no: new FormControl(''),
      lot_id: new FormControl(''),
      tag_for_reprint: new FormControl(''),
      no_of_tags: new FormControl(''),
      reason_for_reprint: new FormControl(''),
      user_agreement: new FormControl(''),
      variety_filter: new FormControl(''),
      lot_not_filter: new FormControl(''),
      tag_no_filter: new FormControl(''),
    })
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['parental_line'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['season'].enable();
        this.getReprintSeasonData();
      }
    });
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getReprintCropData();
      }
    });
    this.ngForm.controls['variety'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getReprintVarietyLineData();
        this.getReprintTagLotData();
      }
    });

    this.ngForm.controls['parental_line'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getReprintTagLotData();
      }
    });
    this.ngForm.controls['lot_no'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getReprintTagsData();
      }
    });

    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.cropDataList = this.cropDataListSecond
        let response = this.cropDataList.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))
        this.cropDataList = response
      }
      else {
        this.cropDataList = this.cropDataListSecond
      }
    });

  }

  ngOnInit(): void {
    this.getReprintYearData();
    this.getReprintTagAllData();
    this.getBscpData();
    this.fetchData();
    this.dropdownList1 = [
      { id: 1, tag_name: 'B/23/001/000370' },
      { id: 2, tag_name: 'B/23/001/000371' },
      { id: 3, tag_name: 'B/23/001/000372' },
    ]
    this.dropdownList = [
      { item_id: 1, item_text: 'Germination' },
      { item_id: 2, item_text: 'Purity' },
      { item_id: 3, item_text: 'ODV' },
      { item_id: 4, item_text: 'Moisture' },
      { item_id: 5, item_text: 'Insect Damage' },
      { item_id: 6, item_text: 'Seed Health' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: ' ' },
      { item_id: 4, item_text: ' ' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'tag_no',
      textField: 'tag_no',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 4,
      allowSearchFilter: true,
      // maxHeight: 0,
    };
  }
  fetchData() {
    // this.getPageData();
    this.dummyData = [
      {
        'variety_id': '23112',
        'variety_name': 'PBW-154',
        'indent_quantity': 150,
        bsp2Arr: []
      },
      {
        'variety_id': '23114',
        'variety_name': 'HD-1925 (SHERA)',
        'indent_quantity': 150,
        bsp2Arr: []
      }
    ]
  }
  getReprintYearData() {
    let route = "get-reprint-tag-year";
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    // this.userId = data.id;
    let param={
      user_id: data.id,
    };
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      console.log('year data===', res);
      if (res.EncryptedResponse.status_code === 200) {
        this.yearOfIndent = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }

  getReprintSeasonData() {
    let route = "get-reprint-tag-season";
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    let param = {
      "year": this.ngForm.controls['year'].value,
      user_id: data.id,
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.seasonlist = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }
  getReprintCropData() {
    let route = "get-reprint-tag-crop";
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      user_id: data.id,
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.cropDataList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        this.cropDataListSecond = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }

  getReprintVarietyData() {
    let route = "get-reprint-tag-variety";
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      user_id: data.id,
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.varietyList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }
  getReprintVarietyLineData() {
    let route = "get-reprint-tag-variety_line";
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData)
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      user_id: data.id,
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.ngForm.controls['parental_line'].setValue('');
        this.varietylineList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        if(this.varietylineList && this.varietylineList.length){
          this.ngForm.controls['parental_line'].enable();
        }else{
          this.ngForm.controls['parental_line'].disable();
        }
      }else{
        this.ngForm.controls['parental_line'].disable();
      }
    })
  }
  getReprintTagLotData() {
    let route = "get-reprint-tag-lot-number";
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData)
    let param={
      user_id: data.id,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      "variety_code": this.ngForm.controls['variety'].value,
    };
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.lotNumberList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }else{
        // this.lotNumberList = []
      }
    })
  }

  getReprintTagsData() {
    let route = "get-reprint-tag-number";
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData)
    let param={
      user_id: data.id,
      year:this.ngForm.controls['year'].value,
      season:this.ngForm.controls['season'].value,
      crop_code:this.ngForm.controls['crop_code'].value,
      lot_no: this.ngForm.controls['lot_no'].value
    };
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.reprintTagData = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }else{
        // this.reprintTagData = []
      }
    })
  }

  getReprintReasonData() {
    let route = "get-reprint-tag-resion-data";
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData)
    let param={
      user_id: data.id,
      year:this.ngForm.controls['year'].value,
      season:this.ngForm.controls['season'].value,
      crop_code:this.ngForm.controls['crop_code'].value,
    };
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.reasonDataList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }else{
        // this.reasonDataList = []
      }
    })
  }
  getReprintVarietyList() {
    let route = "get-approved-tag-variety";
    let param;
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.varietyApproveList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }else{
        this.varietyApproveList = []
      }
    })
  }
  getReprintAllData() {
    let route = "get-reprint-tag-data";
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      'variety_code': this.ngForm.controls['variety_filter'].value,
      'lot_not': this.ngForm.controls['lot_not_filter'].value,
      'tag_no': this.ngForm.controls['tag_no_filter'].value,
    };
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.getReprintAllDataList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        console.log(this.getReprintAllDataList);
      }else{
        console.log("data is=====",this.getReprintAllDataList);
        
        this.getReprintAllDataList = []
      }
    })
  }
  getAllTag(id) {
    let tagNoArray = [];
    if(id){
      let tagNodata = this.getReprintTagAllDataList.filter(ele => ele.reprint_tag_id == id);
    
      if (tagNodata && tagNodata.length) {
        tagNodata.forEach(async(ele) => {
          await tagNoArray.push(' ' + ele.tag_no)
        });
        
      }
    } 
    let tagArrayData = tagNoArray ? tagNoArray.toString():'NA'
    return tagArrayData;
  }
  getAllTagData(data) {
   let items=[];
   if(data && data.length>0){
    data.forEach(el=>{
      items.push(el && el.tag_no ?el.tag_no:'')
    })
    return items && items.length>0 ? items.toString():'NA'
   }
   else{
    return 'NA'
   }
  }
  async getAllTagCount(id) {
    let count;
    if(id){
      let tagNodata = this.getReprintTagAllDataList.filter(ele => ele.reprint_tag_id == id);
      count = tagNodata && tagNodata.length ? tagNodata.length:0;
     
    } 
    return count;
  }
  getReasonName(id){
    let reasonData = this.reasonDataList.filter(item=>item.id === id);
    let reasonName = reasonData && reasonData[0] && reasonData[0].reason;
    return reasonName;
  }

  getReprintTagAllData() {
    let route = "get-reprint-tag-no-list-data";
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
    };
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.getReprintTagAllDataList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }

  getReprintTagNoData() {
    let route = "get-approved-tag-no-data";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_code'].value,
      }
    };
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.getReprintTagNoDataList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }
  getReprintTagLotNoData() {
    let route = "get-approved-lot-no-data";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_code'].value,
      }
    };
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.getReprintLotNoDataList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }
  selectLot(event) {
    let lotId = this.lotNumberList.filter(ele => ele.lot_id == event.target.value)
    this.ngForm.controls['lot_no'].setValue(lotId && lotId[0] && lotId[0].lot_no)
  }
  // get-reprint-tag-no-list-data
 


  onItemSelect(item: any) {
    // When an item is selected, increase the count
    this.ngForm.controls['no_of_tags'].setValue(this.ngForm.controls['tag_for_reprint'].value.length);
  }
  
  onSelectAll(items: any) {
    // When all items are selected, set the total count
    this.ngForm.controls['no_of_tags'].setValue(this.ngForm.controls['tag_for_reprint'].value.length);
  }
  
  onItemDeselect(item: any) {
    // When an item is deselected, decrease the count
    this.ngForm.controls['no_of_tags'].setValue(this.ngForm.controls['tag_for_reprint'].value.length);
  }
  
  onDeselectAll(items: any) {
    // When all items are deselected, reset the count
    this.ngForm.controls['no_of_tags'].setValue(0);
  }
  

  getCropData() {
    this.cropNameSecond
  }
  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop_code'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select All Reuired Field.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    this.isSearch = true;
    this.getReprintVarietyList();
    this.getReprintTagNoData();
    this.getReprintTagLotNoData();
    this.getReprintAllData();
    // this.service.postRequestCreator("data-characterstics-list", null, {
    //   page: loadPageNumberData,
    //   pageSize: 50,
    //   search: {}
    // }).subscribe((apiResponse: any) => {
    //   console.log(apiResponse);
    //   if (apiResponse !== undefined
    //     && apiResponse.EncryptedResponse !== undefined
    //     && apiResponse.EncryptedResponse.status_code == 200) {
    //     this.filterPaginateSearch.itemListPageSize = 4;
    //     console.log(apiResponse);
    //     this.allData = this.inventoryData

    //     if (this.allData === undefined) {
    //       this.allData = [];
    //     }
    //     this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, 8, true);
    //     this.initSearchAndPagination();
    //   }
    // });
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

  cgClick() {
    document.getElementById('crop_group').click();
  }
  cropNameValue(item: any) {
    this.selectCrop = item.crop_name;
    this.ngForm.controls['crop_code'].patchValue(item.crop_code);
    this.ngForm.controls["crop_text"].setValue("");
    this.selectCrop_crop_code = item.crop_code;
    this.crop_name_data = item.crop_name;
    this.selectCrop_group = "";
    this.getReprintVarietyData();
  }
  cropdatatext() {
    this.cropNameSecond;
    console.log(' this.cropNameSecond;', this.cropNameSecond);
  }
  cancel() {
    this.forRequest = false;
  }
  reustForReprint() {
    this.forRequest = true;
  }
  clear() {
    // this.ngForm.controls['year'].setValue(''),
    this.ngForm.controls['variety'].setValue('');
    this.ngForm.controls['parental_line'].setValue('');
    this.ngForm.controls['lot_no'].setValue('');
    this.ngForm.controls['tag_for_reprint'].setValue('');
    this.ngForm.controls['no_of_tags'].setValue('');
    this.ngForm.controls['reason_for_reprint'].setValue('');
    this.ngForm.controls['user_agreement'].setValue(false);
    this.ngForm.controls['lot_id'].setValue('')
  }

  submit(formValue) {

    if (!formValue.value.user_agreement) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Check User Agreement.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return
    }
    if (this.ngForm.invalid) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Fill Form Correctly.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    // if(formValue.value.user_agreement)
    let route = 'add-reprint-tag-data';
    let variety;
    let lotNo;
    if(this.varietyList && this.varietyList.length>0){

      variety= this.varietyList.filter(x=>x.variety_code==this.ngForm.controls['variety'].value);
    }
    let selectedVariety= variety && variety[0] && variety[0].variety_name ? variety[0].variety_name:'NA'

    if(this.lotNumberList && this.lotNumberList.length>0){

      lotNo= this.lotNumberList.filter(x=>x.lot_id==this.ngForm.controls['lot_id'].value);
    }
    let selectedLotNo= lotNo && lotNo[0] && lotNo[0].lot_no ? lotNo[0].lot_no:'NA'

    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      "lot_no": this.ngForm.controls['lot_no'].value,
      "lot_id":this.ngForm.controls['lot_id'].value,
      // "lot_id":this.ngForm.controls['lot_no'].value
      "reason_id": this.ngForm.controls['reason_for_reprint'].value,
      // "is_approved": "2",
      // "is_active": "R/21-22/RS/1",
      "variety_line_code": this.ngForm.controls['parental_line'].value,
      "tags": this.ngForm.controls['tag_for_reprint'].value

    }
    console.log( this.ngForm.controls['tag_for_reprint'].value,' this.ngForm.contr')
    let cardData= this.ngForm.controls['tag_for_reprint'].value
    if(cardData && cardData.length>0){
      cardData = cardData.map(item => ({ ...item, crop: this.selectCrop,variety:selectedVariety ,lot_no:selectedLotNo}));
    }
    let tagNoArray = [];
    if(this.ngForm.controls['tag_for_reprint'].value && this.ngForm.controls['tag_for_reprint'].value.length){
      this.ngForm.controls['tag_for_reprint'].value.forEach(ele=>{
        console.log("ele",ele);
        tagNoArray.push(ele.tag_no)
      })
    }
    this._productionCenter.postRequestCreator('get-reprint-all-tag-data', {
      "tag_no_array":tagNoArray,
      "lot_no":selectedLotNo
     }, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        console.log(res.EncryptedResponse.data)
        this.cardData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data:[];
        console.log('cardData=====',this.cardData);
        let printTagFinalArray = []
        if (this.cardData && this.cardData.length) {
          this.cardData.forEach(ele => {
            printTagFinalArray.push(
              {
                companyName: this.agency_name ? this.agency_name : "NA",
                location: this.district_name ? this.district_name + ', ' : "NA" + this.state_name ? this.state_name : 'NA',
                seedClass: 'Breeder Seed',
                qrCodeUrl:this.baseUrl+'tag-number-verification?tagNo='+(ele.tag_no?ele.tag_no:"NA"),
                crop: this.selectCrop,
                testDate: ele.date_of_test ? ele.date_of_test : "NA",
                variety: ele.variety ? ele.variety : "NA",
                pureSeedPercentage: ele.pure_seed ? ele.pure_seed : "NA",
                parentalLine: ele.line_variety_name ? ele.line_variety_name : "NA",
                inertSeedPercentage: ele.inert_matter ? ele.inert_matter : "NA",
                germinationPercentage: ele.germination ? ele.germination : "NA",
                lotNumber: ele.lot_no ? ele.lot_no : "NA",
                tagNumber: ele.tag_no ? ele.tag_no : "NA",
                bagWeight: ele.bag_weight ? ele.bag_weight : "NA",
                executiveDirector: this.contactPersonName ? this.contactPersonName : "NA",
                directorName: this.designation_name ? this.designation_name : "NA",
                footer: 'This tag is system generated and does not require any signature.'
              }
            )
          })
        }
        // console.log('printTagFinalArray',printTagFinalArray);
        this.jsPrintManagerService.printLabels(printTagFinalArray);
      }
     });

    this._productionCenter.postRequestCreator(route, { 'reprintTagData': param }, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Selected tag(s) reprinted successfully.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        });
      
        this.getReprintAllData();
        this.getReprintVarietyList();
        this.getReprintTagNoData();
        this.getReprintTagLotNoData();
        this.getBscpData();
        // this.downlodePdf();
        this.clear();
        this.forRequest = false;
      }
    });
  }
  printData() {
    // alert('Hii');
  }

  downlodePdf() {
    // this.getQr()
    const name = 'Generating Tag Number';
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
      // pagebreak: { after: ['#page-break1'], avoid: 'img' },
      pagebreak: {
        mode: ['avoid-all', 'css'],  // Avoid page breaks within tag report content and rely on CSS
        after: '.tag-report'  // Ensures each .tag-report div starts on a new page
      }
    };
    // const pdf = new html2PDF(element, options);

    // pdf.addPage();
    html2PDF().set(options).from(element).toPdf().save();

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
    const result = this._productionCenter.postRequestCreator('get-agency-data', param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data[0] ? data.EncryptedResponse.data[0] : '';
      this.contactPersonName = res && res.contact_person_name ? res.contact_person_name : 'NA';
      this.agency_name = res && res.agency_name ? res.agency_name : 'NA';
      this.district_name = res && res.district_name ? res.district_name : 'NA';
      this.state_name = res && res.state_name ? res.state_name : 'NA';
      this.designation_name = res && res.designation_name ? res.designation_name : "NA"
    });
  }
}
