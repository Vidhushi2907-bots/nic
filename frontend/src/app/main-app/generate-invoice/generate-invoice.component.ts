import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js'; // Import CryptoJS
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.css']
})
export class GenerateInvoiceComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  AESKey:string = environment.AESKey;
  ngForm: FormGroup = new FormGroup([]);
  varietyDropDownSettings!: IDropdownSettings;
  indenterDropDownSettings!: IDropdownSettings;
  spaDropDownSettings!: IDropdownSettings;
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryVarietyData: any;
  inventoryIndenterData: any;
  inventorySpaData: any;
  generateInvoiceList: any
  datatodisplay = [];
  isSearch: boolean;
  isCrop: boolean;
  showTab: boolean;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  dropdownSettings: any;
  selectedItems = [];
  isDisabled: boolean = true;
  visibleForm: boolean = false;
  visibleMouCharges: boolean = false;
  visibleGstCharges: boolean = false;
  visibleLicenceCharges: boolean = false;
  visibleppvCharges: boolean = false;
  visiblerltCharges: boolean = false;
  selectedOption: string = '';
  selectedRowData: any = null;
  varietyCategories: any[];
  addVarietySubmission: any[];
  varietyList: any;
  selectCrop: any;
  crop_name_data: any;
  selectCrop_group: string;
  crop_text_check: string;
  croupGroup: any;
  selectCrop_crop_code: any;
  selectedTable: string;
  cropName: any;
  cropNameSecond: any;
  yearOfIndent: any;
  seasonlist: any;
  searchClicked = false;
  variety_code: any;
  indentor_id: any;
  parental_line: any;
  spa_code: any;
  state_code: any;
  receipt_id: any;
  currentUserId: any;
  grandTotal = 0;
  VarietyName: any;
  IndenterName: any;
  SpaName: any;
  BreederSeedAllocated: any;
  spaBagList: any;
  quantityUnit = 'Qt'

  dropdownSettings1 = {
    singleSelection: false,
    idField: 'id',
    textField: 'charges',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 1, 
    allowSearchFilter: true,
    maxHeight: 70,
  };
  additionalCharges = [
    { id: 1, charges: "Mou charges" },
    { id: 2, charges: "License fee" },
    { id: 3, charges: "PPV fee" },
    { id: 4, charges: "Royalty" },
    { id: 5, charges: "GST" },
  ];
  spaData: any;

  constructor(private service: SeedServiceService,private _productionCenter:ProductioncenterService, private fb: FormBuilder,
    private productionService: ProductioncenterService,private router: Router
    ) {
    this.createForm();
  }
  createForm() {
    this.ngForm = this.fb.group({
      year: [''],
      season: [''],
      crop_name: [''],
      crop_code:[],
      crop_text: [],
      search_click: [],
      mou_amt: [],
      mougst_amt: [],
      mougst_amt_total: [],
      totalgst_per: [],
      totalgst_amt: [],
      ppvgst_amt: [],
      rltgst_amt: [],
      rltgst_amt_total: [],
      licence_amt: [],
      licencegst_amt: [],
      licencegst_amt_total: [],
      ppv_amt: [],
      rlt_amt: [],
      other_charge: [],
      gst_amt: [],
      gstGst_amt: [],
      gst_amt_total: [],
      total_amt: [],
      grand_total_amt: [],
      final_grand_total_amt: [],
      ppvgst_amt_total: [],
      draft: [],
      variety_array: [],
      indenter_array:[],
      spa_array:[],
      selectedCharges: [],
      bag_details: this.fb.array([
        // this.bsp2arr(),
      ]),

    })

    this.ngForm.controls['season'].disable();
    this.ngForm.controls['gst_amt'].disable();
    this.ngForm.controls['crop_text'].disable();
    this.ngForm.controls['search_click'].disable();
    // this.ngForm.controls['totalgst_amt'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['crop_text'].disable();
        this.ngForm.controls['search_click'].disable();

        this.selectCrop = "";
        // this.generateSampleSlipData.clear();
        this.generateInvoiceSeasonData();
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_text'].enable();
        this.ngForm.controls['search_click'].disable();
        // this.generateSampleSlipData.clear();
        this.selectCrop = "";
        this.generateInvoiceCropData();
      }
    });

    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['search_click'].enable();
        this.cropName = this.cropNameSecond
        let response = this.cropName.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))
        this.cropName = response
      }
    });
    this.ngForm.controls['variety_array'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getPageData()
        if (newValue.variety_code.slice(0, 1) == "A") {
          this.quantityUnit = "Qt";
        } else {
          this.quantityUnit= "Kg";
        }
      }
  });
  this.ngForm.controls['indenter_array'].valueChanges.subscribe(newValue => {
    if (newValue) {
      this.getPageData()
    
    }
});
this.ngForm.controls['spa_array'].valueChanges.subscribe(newValue => {
  if (newValue) {
    this.getPageData()
  
  }
});
}

  get bag_details(): FormArray {
    return this.ngForm.get('bag_details') as FormArray;
  }

  ngOnInit(): void {
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.currentUserId = userData.id;
    this.generateInvoiceYearData();
    
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 2, 
      allowSearchFilter: true,
      maxHeight: 70,
    };
  }

  generateDropdownSettings(
    singleSelection: boolean,
    idField: string,
    textField: string,
    allowSearchFilter: boolean,
    closeDropDownList: boolean
  ): any {
    return {
      singleSelection: singleSelection,
      idField: idField,
      textField: textField,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: allowSearchFilter,
      // searchPlaceholderText: searchIconUrl + "Search",
      closeDropDownOnSelection: closeDropDownList,
      noDataAvailablePlaceholderText: 'No Records Found'
    };
  }
  onVarietySelect(item: any) {
    console.log('Variety selected:', item);
  }
  onVarietySelectAll(items: any) {
    console.log('All varieties selected:', items);
  }
  onIndenterSelect(item: any) {
    console.log('Indenter selected:', item);
  }
  onIndenterSelectAll(items: any) {
    console.log('All indenters selected:', items);
  }
  onSPASelect(item: any) {
    console.log('SPA selected:', item);
  }
  onSPASelectAll(items: any) {
    console.log('All SPAs selected:', items);
  }

  generateInvoiceYearData() {
    let route = "get-generate-invoice-year";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, ).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.yearOfIndent = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }

  generateInvoiceSeasonData() {
    let route = "get-generate-invoice-season";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seasonlist = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }
   
  generateInvoiceCropData() {
    let route = "get-generate-invoice-crop-data";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        // "crop_code": "A0120"
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.cropName = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        this.cropNameSecond = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];

      }
    });
  }

  generateInvoiceVarietyData() {
    let route = "get-generate-invoice-variety";
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      "user_id": this.currentUserId
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.inventoryVarietyData = res.EncryptedResponse.data;
        this.varietyDropDownSettings = this.generateDropdownSettings(false, 'variety_code', 'variety_name', true, true);
      } else {
        this.inventoryVarietyData = [];
      }
    });
  }

  generateInvoiceIndenterData() {
    let route = "get-generate-invoice-indenter";
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      "user_id": this.currentUserId
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.inventoryIndenterData = res.EncryptedResponse.data;
        this.indenterDropDownSettings = this.generateDropdownSettings(false, 'id', 'name', true, true);
      } else {
        this.inventoryIndenterData = [];
      }
    });
  }
  
  generateInvoiceSpaData() {
    let route = "get-generate-invoice-spa";
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      "user_id": this.currentUserId
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.inventorySpaData = res.EncryptedResponse.data;
        this.spaDropDownSettings = this.generateDropdownSettings(false, 'spa_code', 'name', true, true);
      } else {
        this.inventorySpaData = [];
      }
    });
  }

  toggleSearch() {
    this.searchClicked = true;
    this.getPageData();
    this.generateInvoiceVarietyData();
    this.generateInvoiceIndenterData();
    this.generateInvoiceSpaData();
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    let route = "get-generate-invoice-list";
    let varieties=[];
    let indentorData=[];
    let spaData=[]
    let variety= this.ngForm.controls['variety_array'].value;
    if(variety && variety.length>0){
      variety.forEach(el=>{
        varieties.push(el &&el.variety_code ? el.variety_code:'')
      })
    }
    let indenter= this.ngForm.controls['indenter_array'].value;
    if(indenter && indenter.length>0){
      indenter.forEach(el=>{
        indentorData.push(el &&el.id ? el.id:'')
      })
    }
    let spa= this.ngForm.controls['spa_array'].value;
    if(spa && spa.length>0){
      spa.forEach(el=>{
        spaData.push(el &&el.spa_code ? el.spa_code:'')
      })
    }

    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      "user_id": this.currentUserId,
      "variety_code":varieties,
      "spa":spaData,
      "indenter":indentorData

      // "user_id": 231,
      // "season": "R",
      // "crop_code": "A0101",
      // "year": "2022"  
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.filterPaginateSearch.itemListPageSize = 4;
        this.generateInvoiceList = res.EncryptedResponse.data;
        console.log("newdatavalue",this.generateInvoiceList);
       
      this.calculateRowSpans();

        this.allData = this.generateInvoiceList;
        if (this.allData === undefined) {
          this.allData = [];
        }
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, 8, true);
        this.initSearchAndPagination();
      }
    });
  }

  calculateCharges() {
    this.ngForm.controls['final_grand_total_amt'].setValue(parseInt(this.ngForm.controls['mou_amt'].value ? this.ngForm.controls['mou_amt'].value : 0) +
      parseInt(this.ngForm.controls['licence_amt'].value ? this.ngForm.controls['licence_amt'].value : 0) +
      parseInt(this.ngForm.controls['ppv_amt'].value ? this.ngForm.controls['ppv_amt'].value : 0) +
      parseInt(this.ngForm.controls['rlt_amt'].value ? this.ngForm.controls['rlt_amt'].value : 0) +
      // parseInt(this.ngForm.controls['gst_amt'].value ? this.ngForm.controls['gst_amt'].value : 0) +
      parseInt(this.grandTotal ? this.grandTotal : this.ngForm.controls['grand_total_amt'].value ? this.ngForm.controls['grand_total_amt'].value : 0));
  }

  calculategstCharges(event) {
    const mouAmt = parseFloat(this.ngForm.controls['mou_amt'].value || 0);
    const mouGstAmt = parseFloat(this.ngForm.controls['mougst_amt'].value || 0);
  
    const licenceAmt = parseFloat(this.ngForm.controls['licence_amt'].value || 0);
    const licenceGstAmt = parseFloat(this.ngForm.controls['licencegst_amt'].value || 0);
  
    const ppvAmt = parseFloat(this.ngForm.controls['ppv_amt'].value || 0);
    const ppvGstAmt = parseFloat(this.ngForm.controls['ppvgst_amt'].value || 0);
  
    const rltAmt = parseFloat(this.ngForm.controls['rlt_amt'].value || 0);
    const rltGstAmt = parseFloat(this.ngForm.controls['rltgst_amt'].value || 0);
  
    const gstAmt = parseFloat(this.ngForm.controls['gst_amt'].value || 0);
    const gstGstAmt = parseFloat(this.ngForm.controls['gstGst_amt'].value || 0);

    const grandTotalAmt = parseFloat(this.ngForm.controls['grand_total_amt'].value || 0);
  
    const total = 
      (mouAmt + (mouAmt * mouGstAmt) / 100) +
      (licenceAmt + (licenceAmt * licenceGstAmt) / 100) +
      (ppvAmt + (ppvAmt * ppvGstAmt) / 100) +
      (rltAmt + (rltAmt * rltGstAmt) / 100) +
      ((gstAmt * gstGstAmt) / 100) +
      (grandTotalAmt);
      this.ngForm.controls['final_grand_total_amt'].setValue(total.toFixed(2));
  }

  onDeSelectAll(){
    this.visibleMouCharges = false;
    this.visibleLicenceCharges = false;
    this.visibleppvCharges = false;
    this.visiblerltCharges = false;
    this.visibleGstCharges = false;
    this.ngForm.controls['selectedCharges'].reset();
    this.ngForm.controls['mou_amt'].reset();
    this.ngForm.controls['mougst_amt'].reset();
    this.ngForm.controls['mougst_amt_total'].reset();
    this.ngForm.controls['licence_amt'].reset();
    this.ngForm.controls['licencegst_amt'].reset();
    this.ngForm.controls['licencegst_amt_total'].reset();
    this.ngForm.controls['ppv_amt'].reset();
    this.ngForm.controls['ppvgst_amt'].reset();
    this.ngForm.controls['ppvgst_amt_total'].reset();
    this.ngForm.controls['rlt_amt'].reset();
    this.ngForm.controls['rltgst_amt'].reset();
    this.ngForm.controls['rltgst_amt_total'].reset();
    this.ngForm.controls['gstGst_amt'].reset();
    this.ngForm.controls['gst_amt_total'].reset();
  }

  onItemSelect(item: any) {
    switch (item.id) {
      case 1:
        this.visibleMouCharges = true
        break;
      case 2:
        this.visibleLicenceCharges = true;
        break;
      case 3:
        this.visibleppvCharges = true;
        break;
      case 4:
        this.visiblerltCharges = true;
        break;
      case 5:
        this.visibleGstCharges = true;
        this.ngForm.controls['gst_amt'].setValue(this.ngForm.controls['grand_total_amt'].value);
        break;
      default:
        this.visibleMouCharges = false
        this.visibleLicenceCharges = false;
        this.visibleppvCharges = false;
        this.visiblerltCharges = false;
        this.visibleGstCharges = false;
    }
  }

  onDeSelect(item) {
    switch (item) {
      case 1:
        this.visibleMouCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        this.ngForm.controls['final_grand_total_amt'].setValue(this.ngForm.controls['final_grand_total_amt'].value - this.ngForm.controls['mougst_amt_total'].value);
        this.ngForm.controls['mou_amt'].reset();
        this.ngForm.controls['mougst_amt'].reset();
        this.ngForm.controls['mougst_amt_total'].reset();
        break;
      case 2:
        this.visibleLicenceCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        this.ngForm.controls['final_grand_total_amt'].setValue(this.ngForm.controls['final_grand_total_amt'].value - this.ngForm.controls['licencegst_amt_total'].value);
        this.ngForm.controls['licence_amt'].reset();
        this.ngForm.controls['licencegst_amt'].reset();
        this.ngForm.controls['licencegst_amt_total'].reset();
        break;
      case 3:
        this.visibleppvCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        this.ngForm.controls['final_grand_total_amt'].setValue(this.ngForm.controls['final_grand_total_amt'].value - this.ngForm.controls['ppvgst_amt_total'].value);
        this.ngForm.controls['ppv_amt'].reset();
        this.ngForm.controls['ppvgst_amt'].reset();
        this.ngForm.controls['ppvgst_amt_total'].reset();
        break;
      case 4:
        this.visiblerltCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        this.ngForm.controls['final_grand_total_amt'].setValue(this.ngForm.controls['final_grand_total_amt'].value - this.ngForm.controls['rltgst_amt_total'].value);
        this.ngForm.controls['rlt_amt'].reset();
        this.ngForm.controls['rltgst_amt'].reset();
        this.ngForm.controls['rltgst_amt_total'].reset();
        break;
      case 5:
        this.visibleGstCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        let data = this.ngForm.controls['gst_amt_total'].value - this.ngForm.controls['gst_amt'].value;
        this.ngForm.controls['final_grand_total_amt'].setValue(this.ngForm.controls['final_grand_total_amt'].value - data);
        this.ngForm.controls['gst_amt'].reset();
        this.ngForm.controls['gstGst_amt'].reset();
        this.ngForm.controls['gst_amt_total'].reset();
        break;
      default:
        // Reset any other necessary fields if needed
        break;
    }
  }
  
  onSelectAll(items: any) {
    this.visibleMouCharges = true
    this.visibleLicenceCharges = true;
    this.visibleppvCharges = true;
    this.visiblerltCharges = true;
    this.visibleGstCharges = true;
    this.visibleGstCharges = true;
  }

  gstCalculateValue(event) {
    if (event == "sum") { 
      this.ngForm.controls['totalgst_amt'].setValue((this.ngForm.controls['grand_total_amt'].value * this.ngForm.controls['totalgst_per'].value) / 100);
      this.grandTotal = this.ngForm.controls['totalgst_amt'].value + this.ngForm.controls['grand_total_amt'].value;
    } else {
      this.ngForm.controls['totalgst_amt'].setValue((this.ngForm.controls['grand_total_amt'].value * this.ngForm.controls['totalgst_per'].value) / 100);
      this.grandTotal = this.ngForm.controls['totalgst_amt'].value + this.ngForm.controls['grand_total_amt'].value;
    }
    this.ngForm.controls['mougst_amt_total'].setValue((this.ngForm.controls['mou_amt'].value)+(this.ngForm.controls['mou_amt'].value*this.ngForm.controls['mougst_amt'].value)/100)
    this.ngForm.controls['licencegst_amt_total'].setValue((this.ngForm.controls['licence_amt'].value)+(this.ngForm.controls['licence_amt'].value*this.ngForm.controls['licencegst_amt'].value)/100)
    this.ngForm.controls['ppvgst_amt_total'].setValue((this.ngForm.controls['ppv_amt'].value)+(this.ngForm.controls['ppv_amt'].value*this.ngForm.controls['ppvgst_amt'].value)/100)
    this.ngForm.controls['rltgst_amt_total'].setValue((this.ngForm.controls['rlt_amt'].value)+(this.ngForm.controls['rlt_amt'].value*this.ngForm.controls['rltgst_amt'].value)/100)
  }

  fetchInviceData() {
    if (this.spaBagList) {
      for (let i = 0; i < this.spaBagList.length; i++) {
        if (this.ngForm.controls['bag_details'].value.length > 0) {
          this.remove(i);
        }
        this.addMore(i);
        this.ngForm.controls['bag_details']['controls'][i].patchValue({
          spa_packages_size: this.spaBagList[i].spa_packages_size ? this.spaBagList[i].spa_packages_size : 0,
          spa_no_of_bag: this.spaBagList[i].spa_no_of_bag ? this.spaBagList[i].spa_no_of_bag : 0,
          qnt_of_breeder_seed: this.spaBagList[i].qnt_of_breeder_seed ? this.spaBagList[i].qnt_of_breeder_seed : 0,
          no_of_bag: this.spaBagList[i].no_of_bag ? this.spaBagList[i].no_of_bag : 0,
          total_qnt_of_breeder_seed_spa: this.spaBagList[i].total_qnt_of_breeder_seed_spa ? this.spaBagList[i].total_qnt_of_breeder_seed_spa : 0,
          spa_per_qnt_mrp: this.spaBagList[i].spa_per_qnt_mrp ? this.spaBagList[i].spa_per_qnt_mrp : 0,
          total_amount: this.spaBagList[i].total_amount ? this.spaBagList[i].total_amount : 0
        });
      }
    }
  }

  sumValue(event: any, index: number) {
    const controls = this.ngForm.controls['bag_details']['controls'][index].controls;
    const noOfBag = controls['no_of_bag'].value;
    const spaPerQntMrp = controls['spa_per_qnt_mrp'].value;
    const totalAmount = noOfBag * spaPerQntMrp;
    controls['total_amount'].setValue(totalAmount);
    let sumOfTotal = 0;
    const bagDetailsArray = this.ngForm.get('bag_details') as FormArray;
    bagDetailsArray.controls.forEach(control => {
      sumOfTotal += parseFloat(control.get('total_amount')?.value) || 0;
    });
    this.ngForm.controls['grand_total_amt'].setValue(sumOfTotal);
    this.ngForm.controls['gst_amt'].setValue(sumOfTotal)
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
      spa_packages_size: [],
      spa_no_of_bag: [],
      spa_per_qnt_mrp: [],
      qnt_of_breeder_seed: [],
      no_of_bag: [0, [this.maxBagValidator.bind(this)]],
      total_qnt_of_breeder_seed_spa: [],
      total_amount: []
    });
    return temp;
  }

  maxBagValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const formGroup = control.parent;
    if (formGroup) {
      const maxBags = formGroup.controls['spa_no_of_bag'].value;
      if (control.value > maxBags) {
        return { maxBagsExceeded: true };
      }
    }
    return null;
  }
  
  getItems(form) {
    return form.controls.bsp2Arr.controls;
  }

  addMore(i) {
    this.bag_details.push(this.bsp2arr());
  }

  remove(rowIndex: number) {
    this.bag_details.removeAt(rowIndex);
  }

  get itemsArray() {
    return <FormArray>this.ngForm.get('bsp2Arr');
  }

  get items(): FormArray {
    return this.ngForm.get('bsp2Arr') as FormArray;
  }
  
  navigateToInvoice(data: any, item:any) {
    const id = data && data.id ? data.id :'';
    const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id }), 'a-343%^5ds67fg%__%add').toString();
    const encryptedData = encodeURIComponent(encryptedForm);
    this.router.navigate(['/generate-invoices', encryptedData ]);
  }

  createInvoice(data: any,indenterData: any, spaData: any) {
    if (data.variety_code.slice(0, 1) == "A") {
      this.quantityUnit = "Qt";
    } else {
      this.quantityUnit= "Kg";
    }
     this.VarietyName= data.variety_name;
     this.IndenterName= indenterData.indenter_name
     this.SpaName= spaData.spa_name;
     this.BreederSeedAllocated= spaData.allocated_quantity;
     this.spaBagList = spaData.spa_bag_details;

    this.visibleForm = true;    
    this.variety_code= data && data.variety_code ? data.variety_code:'';
    this.parental_line= data && data.parental_line ? data.parental_line:'';
    this.indentor_id=data && data.indentor_id ? data.indentor_id:'';
    this.spa_code=spaData && spaData.spa_code ? spaData.spa_code :'';
    this.state_code=spaData && spaData.state_code ? spaData.state_code :'';
    this.receipt_id=data && data.id ? data.id :'';
    this.fetchInviceData(); 
  }

  generateInvoiceData(){
    let param=this.ngForm.value;
    param.parental_line=this.parental_line ? this.parental_line:'';
    param.indentor_id= this.indentor_id ?  this.indentor_id:'';
    param.spa_code=this.spa_code ? this.spa_code:'';
    param.state_code=this.state_code ? this.state_code:'';
    param.variety_code=this.variety_code ? this.variety_code:'';
    param.receipt_id= this.receipt_id ? this.receipt_id:''
    let bspData=[]
    let bagweightData=[]
    let bspcs= param && param.bag_details ? param.bag_details:'';
    if(bspcs && bspcs.length>0){
      bspcs.forEach(el=>{
        bspData.push(el && el.spa_no_of_bag ?el.spa_no_of_bag:0)
      })
      bspcs.forEach(el=>{
        bagweightData.push(el && el.spa_packages_size ?el.spa_packages_size:0)
      })
    }
    
    const sum = bspData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    param.bagweightData= bagweightData && bagweightData.length>0 ? bagweightData.toString():0
    param.totalbags=sum;
    param.user_id = this.currentUserId;
    param.final_grand_total_amt = param && param.final_grand_total_amt == null ? param.grand_total_amt : param.final_grand_total_amt;

    this.productionService
    .postRequestCreator("save-generate-invoice", param)
    .subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        }).then(x => {
          this.visibleForm=false;
          this.getPageData();
          // window.location.reload()
        })
        // this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
      }
    });
  }

  displayRowData(data: any, spaData: any) {
    this.selectedRowData = {
      variety: data.variety,
      indenter: data.parental_line,
      spa_name: spaData.spa_name,
      quantity_qt: spaData.quantity_qt
    };
    this.visibleForm = true;
  }

  cancel() {
    this.visibleForm = false;
    this.visibleMouCharges = false;
    this.visibleLicenceCharges = false;
    this.visibleppvCharges = false;
    this.visiblerltCharges = false;
    this.visibleGstCharges = false;
    this.ngForm.controls['selectedCharges'].reset();
    this.ngForm.controls['bag_details'].reset();
    this.ngForm.controls['mou_amt'].reset();
    this.ngForm.controls['mougst_amt'].reset();
    this.ngForm.controls['mougst_amt_total'].reset();
    this.ngForm.controls['licence_amt'].reset();
    this.ngForm.controls['licencegst_amt'].reset();
    this.ngForm.controls['licencegst_amt_total'].reset();
    this.ngForm.controls['ppv_amt'].reset();
    this.ngForm.controls['ppvgst_amt'].reset();
    this.ngForm.controls['ppvgst_amt_total'].reset();
    this.ngForm.controls['rlt_amt'].reset();
    this.ngForm.controls['rltgst_amt'].reset();
    this.ngForm.controls['rltgst_amt_total'].reset();
    this.ngForm.controls['gst_amt'].reset();
    this.ngForm.controls['gstGst_amt'].reset();
    this.ngForm.controls['gst_amt_total'].reset();
    this.ngForm.controls['final_grand_total_amt'].reset();
  }

  cgClick() {
    document.getElementById('crop_group').click();
  }

  cropNameValue(item: any) {
    this.selectCrop = item.crop_name;
    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_code'].setValue(item.crop_code);
    this.selectCrop_crop_code = item.crop_code;
    this.crop_name_data = item.crop_name;
    this.selectCrop_group = "";
    // this.ngForm.controls['crop_name'].setValue('')
    this.crop_text_check = 'crop_group'
  }

  cropdatatext() {
    this.cropNameSecond;
    console.log(' this.cropNameSecond;', this.cropNameSecond);
  }

  calculateRowSpans() {
    for (const data of this.generateInvoiceList) {
      data.rowspan = data.indenter_details.reduce((sum, indenter) => sum + indenter.spa_details.length, 0);
      for (const indenter of data.indenter_details) {
        indenter.rowspan = indenter.spa_details.length;
      }
    }
  }

}
