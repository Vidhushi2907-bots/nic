import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Item } from '@syncfusion/ej2-angular-pdfviewer';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { sample } from 'rxjs';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { MasterService } from 'src/app/services/master/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
interface InventoryItem {
  lotNo: string;
  tagNo: string;
  weight: number;
}
export interface SpaDetails {
  name: string;
  details: {
    no_of_bags: string;
    lot_quantity: number;
    reason: string;
  };
  bill_amount: number | string;
  bill_no: string;
  lifting_id: boolean;
}

export interface Spa {
  spa_id: number;
  spa_name: string;
  spa_short_name: string;
  spa_short_id: number;
  mobile_number: string;
  address: string;
  email: string;
}
export interface Bsp2Details {
  lot_number: string;
  lot_quantity: number;
  no_of_bags: number;
  bag_details: string;
  area_shown: string;
  godown_no: string;
}

export interface DummyData {
  variety_name: string;
  line_variety_name: string;
  bsplength: number;
  bsp2_Deteials: Bsp2Details[];
}

@Component({
  selector: 'app-national-self-lifting',
  templateUrl: './national-self-lifting.component.html',
  styleUrls: ['./national-self-lifting.component.css']
})
export class NationalSelfLiftingComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm: FormGroup = new FormGroup([]);
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryVarietyData: any;

  datatodisplay = [];
  isSearch: boolean;
  isRadioSelected = false;
  visibleTable: boolean = false;
  isCrop: boolean;
  showTab: boolean;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings2: IDropdownSettings = {};
  dropdownSettings3: IDropdownSettings = {};
  dropdownSettings4: IDropdownSettings = {}
  dropdownSettings5: IDropdownSettings = {}

  dropdownSettingsVariety: IDropdownSettings = {};
  // allData: any;
  allSpaData = [
    { spa_name: 'SPA 1' },
    { spa_name: 'SPA 2' },
    { spa_name: 'SPA 3' }
  ];

  spalistSecond = [...this.allSpaData];
  dropdownSettings1 = {
    singleSelection: false,
    idField: 'id',
    textField: 'charges',
    // selectAllText: 'Select All',
    // unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    // maxHeight: 70,
  };
  dropdownTagSettings2: IDropdownSettings = {};
  dropdownSettingsTests: IDropdownSettings = {};
  dropdownSettingsTag: IDropdownSettings = {};
  selectedItems: any;
  dropdownList = [];
  isDivVisible1: boolean = true;
  isDivVisible: boolean = false;
  dropdownList1: any;
  productionType: any;

  response1: any;
  response3: any;
  response2: any;
  additionalCharges = [
    { id: 1, charges: "Mou charges" },
    { id: 2, charges: "License fee" },
    { id: 3, charges: "PPV fee" },
    { id: 4, charges: "Royalty" },
    { id: 5, charges: "Transportation" },
    { id: 6, charges: "Postage" },
    { id: 7, charges: "Packing" },
    { id: 8, charges: "Other" },
  ];
  dropdownList2 = [];
  dropdownList3 = [];
  dropdownList4 = [];
  isDisabled: boolean = true;
  searchClicked = false;
  searchClicked1 = false;
  yearOfIndent: any;
  seasonlist: any;
  cropName: any;
  cropNameSecond: any;
  visibleMouCharges: boolean = false;
  visibleOtherCharges: boolean = false;
  visibleLicenceCharges: boolean = false;
  visibleppvCharges: boolean = false;
  visiblerltCharges: boolean = false;
  selectedOption;
  tagNoArrayData: any = [];
  allData3;
  allData: any;
  // dropdownSettings: IDropdownSettings = {};

  Statuslist = [
    {
      Status: 'All'
    },
    {
      Status: 'Generated'
    },
    {
      Status: 'Not Generated'
    }
  ]

  showTable = false;
  showTable1 = false;
  showTable2 = false;
  varietyCategories: any[];
  addVarietySubmission: any[];
  varietyList: any;
  dummyData;
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
  formGroup: FormGroup;
  checkboxChecked: boolean = false;
  seedProcessRegisterDta: any;
  carry_over_status: any;
  seedProcessRegisterDataList: any;
  runningNo: any;
  sppCode: any;
  AESKey: string = environment.AESKey;

  // new variable created may 30
  lotDetailsArray: any = [];
  cropDataList: any;
  lotNoDetailsData: any;
  liftingDetails: any;
  tagNoDetailsData: any;
  variety_code: any;
  state_code: any;
  indentorId: any;
  spaId: any;
  variety_line_code: any;
  varietyData;
  bagData = [];
  varietyPricelist = [];
  perUnitPrice: number;
  unit: string;
  reasonData: any;
  variety_name: any;
  indentor_name: any;
  spaName: any;
  allocated_quantity: any;
  breederStack: any;
  totalAmount: any;
  payment_method: any;
  amount: any;
  isDisableNormalReallocate: boolean;
  isDisableNormal: boolean;
  isDisableDelay: boolean;
  isDisableNational: boolean;
  isDisableDirect: boolean;
  isDisableNormalSurplus: boolean;
  varietyListofBsp2list: any;
  selectVariety: any;
  response: any;
  Variety: any;
  VarietySecond: any;
  VarietyList1: any;
  VarietyList: any;
  selectDistrict: any;

  districtData = [
    {
      "district_name": "Bhopal"
    },
    {
      "district_name": "Indore"
    },
    {
      "district_name": "Jabalpur"
    },
    {
      "district_name": "Gwalior"
    },
    {
      "district_name": "Ujjain"
    }
  ]


  // districtData: any;
  districtListSecond: any;
  selectSpa: any;
  // allSpaData: any; 
  showOtherInputBox: boolean;
  showOtherInput: boolean;
  isEditMode: any;
  otherSpaName: any;
  varietyListSecond: any;
  dropdownList21: any;
  dropdownList22: any;
  address: any;
  mobile_number: any;
  varietyData1: any[];
  indenter_id: any;
  indenter_id1: any;
  dropdownList22_new: any;
  districtDataSecond: any;
  visibleTransportCharges: boolean;
  visiblePostageCharges: boolean;
  visiblePackingCharges: boolean;
  isUnique: boolean;
  dropdownList21_new: any;
  selectIndentor: any;
  // Method to handle file input change event
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csv = e.target.result;
        this.parseCSV(csv);
      };
      reader.readAsText(file);
    }
  }

  // Method to parse CSV data
  parseCSV(csv: string) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
  }
  selectTable(table: string) {
    this.selectedTable = table;
  }
  constructor(private productioncenter: ProductioncenterService,
    private masterService: MasterService, private productionService: ProductioncenterService, private service: SeedServiceService, private fb: FormBuilder, private formBuilder: FormBuilder, private _productionCenter: ProductioncenterService, private router: Router, private route: Router,
    private renderer: Renderer2
  ) {
    this.createForm();
    this.formGroup = this.formBuilder.group({
      checkboxOption: [false]
    });

  }
  onCheckboxChange(event: any) {
    this.checkboxChecked = event.target.checked;
  }

  selectedTreatment: string = '';
  selectedTreatment1: string = '';
  selectedTreatment2: string = '';
  selectedTreatment3: string = '';
  selectedTreatment4: string = '';
  selectedTreatment5: string = '';
  selectedTreatment6: string = '';

  selectedTreatment7: string = '';
  selectedTreatment8: string = '';
  chemicalName: string = '';
  placeholderText: string = '';

  paymentMethod = [
    {
      value: 'demand_draft',
      name: 'Demand Draft'
    },
    {
      value: 'cash',
      name: 'Cash'
    },
    {
      value: 'online',
      name: 'Online'
    }
  ]

  updatePlaceholder() {
    this.placeholderText = this.chemicalName ? `Chemical Name: ${this.chemicalName}` : 'Enter chemical name';
  }
  createForm() {
    this.ngForm = this.fb.group({
      year: [''],
      season: [''],
      Status: [],
      indentor_id: [],
      cropName: [''],
      crop_text: [''],
      search_click: [''],
      testing_lab_id: [''],
      variety: [''],
      variety_level_2: [''],
      variety_code: [''],
      selectSpa: [''],
      indent_qnt: ['', []],
      otherInput: [''],
      state_text: [''],
      district_text: [''],
      variety_text: [''],
      indenter_text: [''],
      spa_code: ['', Validators.required],
      spa_id: [''],
      spa_text: [''],
      variety_notification_year: [''],
      state: [''],
      state_code: [''],
      otherSpaName: [''],
      address: ['NA'],
      district: [''],
      mobile_no: ['NA', [Validators.pattern(/^[6-9]\d{9}$/)]],
      reason_id: [''],
      dd_no: [''],
      variety_line_code: [''],
      crop_code: [''],
      variety_array: [''],
      indenter_array: [''],
      spa_array: [''],
      mou_amt: [''],
      mougst_amt: [''],
      mougst_amt_total: [''],
      totalgst_per: [0],
      totalgst_amt: [''],
      ppvgst_amt: [''],
      rltgst_amt: [''],
      rltgst_amt_total: [''],
      licence_amt: [''],
      licencegst_amt: [],
      licencegst_amt_total: [],
      ppv_amt: [],
      rlt_amt: [],
      other_charge: [],
      oth_amt: [],
      othgst_amt: [],
      othgst_amt_total: [],
      transport_amt: [''],
      transportgst_amt: [''],
      transportgst_amt_total: [''],
      postage_amt: [''],
      postagegst_amt: [''],
      postagegst_amt_total: [''],
      packing_amt: [''],
      packinggst_amt: [''],
      packinggst_amt_total: [''],
      other_amt: [''],
      othergst_amt: [''],
      othergst_amt_total: [''],
      total_amt: [],
      grand_total_amt: [],
      final_grand_total_amt: [],
      ppvgst_amt_total: [],
      draft: [""],
      other_amt_text: [""],
      total_final_amount: [],
      inventoryItems: this.fb.array([
        // this.inventoryItemsForms()
      ]),
      inventory_item_array: this.fb.array([
        // this.inventoryItemsArrayForms(),
      ]),
      selectedCharges: [],
    })
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_text'].disable();
    this.ngForm.controls['search_click'].disable();
    this.ngForm.controls['totalgst_amt'].disable();
    this.ngForm.controls['address'].disable();
    this.ngForm.controls['mobile_no'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['crop_text'].disable();
        this.ngForm.controls['search_click'].disable();
        this.variety_code = ''
        this.selectCrop = "";
        // this.generateSampleSlipData.clear();
        this.liftingSeasonData();
        this.resetFormDataFilter();
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_text'].enable();
        this.ngForm.controls['search_click'].disable();
        // this.generateSampleSlipData.clear();
        this.selectCrop = "";
        this.variety_code = '';
        this.liftingCropData();
        this.resetFormDataFilter();
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
    this.ngForm.controls['variety_text'].valueChanges.subscribe(item => {
      if (item) {
        let variertyFilterData = this.varietyData1.filter(x =>
          x.variety_name.toLowerCase().includes(item.toLowerCase())
        );
        this.varietyData1 = variertyFilterData;
      } else {
        this.varietyData1 = [...this.varietyListSecond]; // Reset to the full list
      }
    });


    // this.ngForm.controls['district_text'].valueChanges.subscribe(item => {
    //   if (item) {
    //     // Filter `spalistSecond` based on the search input
    //     let districtFilterData = this.districtData.filter(x =>
    //       x.district_name.toLowerCase().includes(item.toLowerCase())
    //     );
    //     this.districtData = districtFilterData;
    //   } else {
    //     // Reset `allSpaData` to the original list when input is cleared
    //     this.districtData = [...this.districtDataSecond];
    //   }
    // });


    this.ngForm.controls['indenter_text'].valueChanges.subscribe(item => {
      if (item) {
        // Filter `spalistSecond` based on the search input
        let indenterData = this.dropdownList21.filter(x =>
          x.itemName.toLowerCase().includes(item.toLowerCase())
        );
        this.dropdownList21 = indenterData
      } else {
        // Reset `allSpaData` to the original list when input is cleared
        this.dropdownList21 = [...this.dropdownList21_new];
      }
    });

    this.ngForm.controls['spa_text'].valueChanges.subscribe(item => {
      if (item) {
        // Filter `spalistSecond` based on the search input
        this.allSpaData = this.dropdownList22.filter(x =>
          x.spa_name.toLowerCase().includes(item.toLowerCase())
        );
        this.dropdownList22 = this.allSpaData
      } else {
        // Reset `allSpaData` to the original list when input is cleared
        this.dropdownList22 = [...this.dropdownList22_new];
      }
    });
    this.ngForm.controls['variety_level_2'].valueChanges.subscribe(newValue => {
      this.variety_code = '';
      this.getPageData()
    });
    this.ngForm.controls['variety_array'].valueChanges.subscribe(newValue => {
      // this.variety_code='';
      this.liftingTableData()
    });
    this.ngForm.controls['indenter_array'].valueChanges.subscribe(newValue => {
      this.liftingTableData()
    });
    this.ngForm.controls['spa_array'].valueChanges.subscribe(newValue => {
      this.liftingTableData()
    });
  }

  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }
  get inventoryItems(): FormArray {
    return this.ngForm.get('inventoryItems') as FormArray;
  }
  get inventory_item_array(): FormArray {
    return this.ngForm.get('inventory_item_array') as FormArray;
  }


  ngOnInit(): void {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    this.sppCode = data.code;
    this.liftingYearData();
    // this.getIndenter();
    // this.getBsp2ListVariety();
    // this.getPageData();

    this.liftingTableData(null);
    // this.lotNoData();
    this.fetchData();
    this.calculateGrandTotal();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'tag_no',
      textField: 'tag_no',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dropdownSettingsVariety = {
      singleSelection: false,
      idField: 'variety_code',
      textField: 'variety_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dropdownSettings5 = {
      singleSelection: true,
      idField: 'id',
      textField: 'itemName',
      // selectAllText: 'Select All',
      // unSelectAllText: 'Unselect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.dropdownSettings3 = {
      singleSelection: false,
      idField: 'indentor_id',
      textField: 'indentor_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.dropdownSettings4 = {
      singleSelection: false,
      idField: 'spa_code',
      textField: 'spa_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getReason()
  }

  liftingselfVariety() {
    const route = "get-lifting-self-variety";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop_code'].value,
        radio_type: "national-temp"
      }
    };

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.varietyListSecond = res.EncryptedResponse.data || []; // Update full list here
        this.varietyData1 = res.EncryptedResponse.data || []; // Use it as the filtered list
      } else {
        this.varietyListSecond = [];
        this.varietyData1 = [];
      }
    });
  }

  getPageData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    this._productionCenter.postRequestCreator("lifting-surplus-breeder-stock-details", {

      // pageSize: 100,
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop_code'].value ? this.ngForm.controls['crop_code'].value : '',
        user_id: UserId ? UserId.toString() : '',
        variety_code: this.ngForm.controls['variety_level_2'].value ? this.ngForm.controls['variety_level_2'].value : '',
        radio_type: "national-temp"
      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.dummyData = apiResponse.EncryptedResponse.data;
      }
    });
  }

  liftingTableData(data = null): void {
    const route = "get-self-lifting-table-data";
    let variety = this.ngForm.controls['variety_array'].value;
    let indentor = this.ngForm.controls['indenter_array'].value;
    let spaArray = this.ngForm.controls['spa_array'].value;
    let varietyData = [];
    let indentorData = [];
    let spaData = []
    if (variety && variety.length > 0) {
      variety.forEach((el => {
        varietyData.push(el && el.variety_code ? el.variety_code : '')
      }))
    }
    if (indentor && indentor.length > 0) {
      indentor.forEach((el => {
        indentorData.push(el && el.indentor_id ? el.indentor_id : '')
      }))
    }
    if (spaArray && spaArray.length > 0) {
      spaArray.forEach((el => {
        spaData.push(el && el.spa_code ? el.spa_code : '')
      }))
    }
    const matchedSPAs = [];
    if (spaData && spaData.length > 0) {
      // this.allData.forEach(el=>)    
      this.allData.forEach(variety => {
        variety.allocation_to_indentor_for_lifting_seed_production_cnter.forEach(indentor => {
          indentor.spas.forEach(spa => {
            if (spaData.includes(spa.spa_code)) {
              matchedSPAs.push(indentor.indent);
            }
          });
        });
      });
    }

    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop_code'].value,
        variety_code: varietyData && varietyData.length > 0 ? varietyData : '',
        indenter_id: indentorData && indentorData.length > 0 ? indentorData : "",
        spa_code: spaData && spaData.length ? spaData : '',
        indenter: matchedSPAs && matchedSPAs.length > 0 ? matchedSPAs : '',
        production_type: this.productionType,
        radio_type: "national-temp"
      }
    };

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        let response = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : "";
        const outputArray = response.map(item => ({
          variety_id: item.variety_id,
          variety_name: item.variety_name,
          variety_code: item.variety_code,
          variety_line_code: item.variety_line_code,
          m_crop_variety: item.m_crop_variety,
          allocation_to_indentor_for_lifting_seed_production_cnter: {
            id: item.allocation_to_indentor_for_lifting_seed_production_cnter.id,
            spas: item.spas,
            indent: item.allocation_to_indentor_for_lifting_seed_production_cnter.indent,
            user: item.allocation_to_indentor_for_lifting_seed_production_cnter.user
          }
        }));
        let transformedData = {};

        // Iterate through each object in the original data
        outputArray.forEach(item => {
          // Extract variety_id to use as key
          let varietyId = item.variety_id;

          // Check if this variety_id already exists in transformedData
          if (!transformedData[varietyId]) {
            // If not, initialize it with an array containing the first item
            transformedData[varietyId] = {
              ...item,
              allocation_to_indentor_for_lifting_seed_production_cnter: [item.allocation_to_indentor_for_lifting_seed_production_cnter]
            };
          } else {
            // If exists, push the allocation_to_indentor_for_lifting_seed_production_cnter to the array
            transformedData[varietyId].allocation_to_indentor_for_lifting_seed_production_cnter.push(item.allocation_to_indentor_for_lifting_seed_production_cnter);
          }
        });

        // Convert transformedData object back to array format
        let result = Object.values(transformedData);
        if (result && result.length > 0) {
          result.forEach(el => {
            el['allocation_to_indentor_for_lifting_seed_production_cnter'] = el['allocation_to_indentor_for_lifting_seed_production_cnter'].filter((arr, index, self) =>
              index === self.findIndex((t) => (t.indent === arr.indent)))

          })
        }

        if (result && result.length > 0) {
          result.forEach(el => {
            el['totoalSpas'] = []
          })
          result.forEach(el => {
            el['allocation_to_indentor_for_lifting_seed_production_cnter'].forEach((val => {
              el['totoalSpas'].push(...val.spas)
            }))
          })
        }
        this.allData = response;
        let filerData = []
      } else {
        this.allData = [];
      }
    }, error => {
      this.allData = [];
    });
  }

  toggleDiv() {
    this.isDivVisible = !this.isDivVisible;
    this.toggleSearchFirst(null, null, null)
  }
  // // Function to calculate rowspan
  getRowSpan(data: any): number {
    return data.spas.reduce((acc, currentSpa) => acc + currentSpa.lifting_details.length, 0);
  }
  // getSpaRowSpan(spas: any[], spaIndex: number): number {
  //   let count = 0;
  //   const currentSpaName = spas[spaIndex].name;

  //   for (let i = spaIndex; i < spas.length; i++) {
  //     // Count rows for the same SPA within the same indenter
  //     if (spas[i].name === currentSpaName) {
  //       count += spas[i].lifting_details?.length || 1; // Count lifting details or 1 if none
  //     } else {
  //       break;
  //     }
  //   }

  //   return count;
  // }
  // Total number of lift rows under all SPAs for one variety
  // getRowSpan(data: any): number {
  //   if (!data?.spas || !Array.isArray(data.spas)) return 1;
  //   return data.spas.reduce((total, spa) => {
  //     const count = Array.isArray(spa.lifting_details) ? spa.lifting_details.length : 1;
  //     return total + count;
  //   }, 0);
  // }

  // Count rows for same SPA (grouped) to apply rowspan correctly
  getSpaRowSpan(spas: any[], spaIndex: number): number {
    if (!Array.isArray(spas) || spaIndex >= spas.length) return 1;

    const currentSpa = spas[spaIndex];
    const currentSpaKey = `${currentSpa.name}_${currentSpa.spa_code || ''}`;
    let count = 0;

    for (let i = spaIndex; i < spas.length; i++) {
      const spaKey = `${spas[i].name}_${spas[i].spa_code || ''}`;

      if (spaKey === currentSpaKey) {
        count += Array.isArray(spas[i].lifting_details) ? spas[i].lifting_details.length : 1;
      } else {
        break;
      }
    }

    return count;
  }
  // lotNoData()
  liftingVarietyData(): void {
    const route = "get-lifting-surplus-breeder-variety";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop_code'].value,
        radio_type: "national-temp"
      }
    };

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        // this.varietyListSecond = res.EncryptedResponse.data || []; // Update full list here
        this.varietyData = res.EncryptedResponse.data || [];; // Use it as the filtered list
      } else {
        this.varietyListSecond = [];
        this.varietyData = [];
      }
    });

  }
  getIndenter() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData);
    let UserId = data.id;

    this.masterService.postRequestCreator("indentor-list", null, {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop_code'].value,
        radio_type: "national-temp",
        variety_code: this.variety_code ? this.variety_code : this.ngForm.controls['variety_code'].value,
        parental_line: this.variety_line_code ? this.variety_line_code : '',
        is_self: true
      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse?.EncryptedResponse?.status_code === 200) {
        let allData = apiResponse.EncryptedResponse.data.rows;
        if (allData === undefined) {
          allData = [];
        }
        // Bind the fetched data to the dropdown list
        this.dropdownList21 = allData.map((item: any) => ({
          id: item.user_id,
          state_code: item.state_id,
          itemName: item.agency_name
        }));
        this.dropdownList21_new = allData.map((item: any) => ({
          id: item.user_id,
          state_code: item.state_id,
          itemName: item.agency_name
        }));
        // Patch the indentor_id value from the first item in the response (if exists)
        if (allData.length > 0) {
          const firstIndentorId = allData[0].id; // Get the ID of the first item
          this.ngForm.controls['indentor_id'].patchValue(firstIndentorId); // Patch the ID into the form
        } else {
        }
      } else {
        this.dropdownList21 = []; // Reset dropdown if there's an error
      }
    });
  }


  getDistrictList(stateCode: number) {
    const param = {
      search: {
        state_code: stateCode
      }
    };

    this.masterService.postRequestCreator('get-district-list', null, param).subscribe(data => {
      this.districtData = data?.EncryptedResponse?.data || [];
      this.districtDataSecond = data?.EncryptedResponse?.data || [];
    });
  }

  district(item: any) {
    this.selectDistrict = item && item.district_name ? item.district_name : ''
    this.ngForm.controls['district_text'].setValue('', { emitEvent: false })
    this.districtData = this.districtDataSecond;
    this.ngForm.controls['district'].setValue(item && item.district_code ? item.district_code : '')
    if (item && item.state_code && item.district_code) {
      this.selectDistrict = item.district_name; // Set the selected district name
      this.liftingselfSPAData(item.state_code, item.district_code); // Fetch SPA data
    } else {
    }
  }
  onVarietySelect(item: any) {
    this.liftingTableData();
  }
  onVarietySelectAll(items: any) {
    this.liftingTableData();
  }

  liftingIndenterData(): void {
    const route = "get-lifting-surplus-breeder-indenter";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop_code'].value,
        radio_type: "national-temp"
      }
    };

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.dropdownList2 = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : ''
      } else {
        this.dropdownList2 = [];
      }
    }, error => {
      this.dropdownList2 = [];
    });
  }

  onIndenterSelect(item: any) {
    // this.indenter_id
    this.liftingTableData();
  }

  onIndenterSelect1(selected: any) {
    const fullItem = this.dropdownList21.find(item => item.id === selected.id);
    this.indenter_id1
      = fullItem?.id;
    this.selectIndentor = "";
    if (fullItem.itemName)
      this.selectIndentor = fullItem.itemName;
    if (fullItem?.state_code) {
      this.selectSpa = "";
      this.liftingselfSPAData(fullItem.state_code, null);
      this.getDistrictList(fullItem.state_code);
    }

    this.ngForm.controls['district_text'].setValue('')
    this.districtData = this.districtDataSecond;
    this.ngForm.controls['district'].setValue('')
    this.selectDistrict = ''; // Set the selected district name

    this.liftingTableData();
  }

  onIndenterSelectAll(items: any) {
  }
  liftingselfSPAData(state_code: number, district_code: number): void {
    const route = "get-lifting-surplus-breeder-spa-details";
    const param = {
      search: {
        state_code: state_code,
        district_code: district_code
      }
    };

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.dropdownList22 = res.EncryptedResponse.data ? res.EncryptedResponse.data : '';
        this.dropdownList22_new = res.EncryptedResponse.data ? res.EncryptedResponse.data : '';
        // Patch the state_code into the form
        this.ngForm.controls['state_code'].patchValue(state_code);
      } else {
      }
    });
  }


  liftingSPAData(): void {
    const route = "get-lifting-surplus-breeder-spa";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop_code'].value,
        radio_type: "national-temp"
      }
    };

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.dropdownList3 = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : '';
      }
    })
  }

  onSPASelect(item: any) {
    this.liftingTableData();
  }

  onSPASelectAll(items: any) {
    this.liftingTableData();
  }
  liftingTagNoData(): void {
    const route = "get-lifting-tag-no";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop_code'].value,
        variety_code: this.variety_code ? this.variety_code : this.ngForm.controls['variety_code'].value,
        parental_line: this.variety_line_code ? this.variety_line_code : '',
        is_self: true
      }
    };

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.dropdownList4 = (res.EncryptedResponse.data || []).map(item => {
          return { id: item.tag_no, tag_no: item.tag_no, lot_id: item.lot_id, lot_no: item.lot_no, no_of_bags: item.no_of_bags, bag_size: item.bag_size, tag_id: item.tag_id };
        });
      } else {
        this.dropdownList4 = [];
      }
    }, error => {
      this.dropdownList4 = [];
    });
    if (this.dropdownList4 && this.dropdownList4.length > 0) {
      this.dropdownList4 = this.dropdownList4.sort((a, b) => b.tag_id - a.tag_id)
    }
  }


  onTagNoSelect(item: any, i: number) {

    const matchedTag = this.dropdownList4.find(x => x.tag_no === item.tag_no);
    const bagSize = matchedTag?.bag_size;

    // Collect already selected bag sizes
    const selectedBagSizes = this.tagNoArrayData.map(tag => {
      const t = this.dropdownList4.find(x => x.tag_no === tag.tag_no);
      return t?.bag_size;
    });

    if (selectedBagSizes.length > 0) {
      const firstBagSize = selectedBagSizes[0];

      // if user tries to select a tag with different bag size
      if (bagSize !== firstBagSize) {
        Swal.fire({
          title: '<p style="font-size:20px;">Only tags of the same bag size can be selected together.</p>',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });

        // Immediately de-select the wrong tag
        this.dropdownSettings = { ...this.dropdownSettings }; // force dropdown refresh
        this.ngForm.controls['inventoryItems']['controls'][i].controls['tag_no']
          .setValue(this.tagNoArrayData); // restore only valid selections

        return;
      }
    }
    this.tagNoArrayData.push(item);
    // Update bag size
    this.ngForm.controls['inventoryItems']['controls'][i].controls['bag_size']
      .setValue(bagSize || '');
    this.isUnique = true;
  }

  onTagNoSelectAll(items: any, i: number) {
    // Get bag sizes of all selected tags
    const bagSizes = items.map((item: any) => {
      const matchedTag = this.dropdownList4.find(x => x.tag_no === item.tag_no);
      return matchedTag?.bag_size;
    });

    // Check if all bag sizes are the same
    const uniqueBagSizes = [...new Set(bagSizes)];

    if (uniqueBagSizes.length > 1) {
      Swal.fire({
        title: '<p style="font-size:20px;">Only tags of the same bag size can be selected together.</p>',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });

      // 🚫 Reset the selection (don’t allow Select All if different sizes exist)
      this.ngForm.controls['inventoryItems']['controls'][i].controls['tag_no'].setValue([]);
      this.tagNoArrayData = [];
      this.isUnique = false;
      return;
    }

    // ✅ All tags have same bag size → accept selection
    this.tagNoArrayData = [...items];

    // Update bag size
    this.ngForm.controls['inventoryItems']['controls'][i].controls['bag_size']
      .setValue(uniqueBagSizes[0] || '');

    this.isUnique = true;
  }

  onItemDeSelectTagData(item: any, i: number) {
    // Remove deselected item from array
    this.tagNoArrayData = this.tagNoArrayData.filter(x => x.tag_no !== item.tag_no);

    if (this.tagNoArrayData.length === 0) {
      // No selection left → disable button
      this.isUnique = false;
      this.ngForm.controls['inventoryItems']['controls'][i].controls['bag_size'].setValue('');
      return;
    }

    // Get all remaining bag sizes
    const bagSizes = this.tagNoArrayData.map(tag => {
      const matchedTag = this.dropdownList4.find(x => x.tag_no === tag.tag_no);
      return matchedTag?.bag_size;
    });

    const uniqueBagSizes = [...new Set(bagSizes)];

    if (uniqueBagSizes.length === 1) {
      // ✅ All tags same bag size
      this.isUnique = true;
      this.ngForm.controls['inventoryItems']['controls'][i].controls['bag_size']
        .setValue(uniqueBagSizes[0]);
    } else {
      // ❌ Different sizes left
      this.isUnique = false;
      Swal.fire({
        title: '<p style="font-size:20px;">Only tags of the same bag size can be selected together.</p>',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
    }
  }

  onDeSelectAllonItemDeSelect(i: number) {
    this.tagNoArrayData = [];
    this.isUnique = false; // disable button when all are deselected
    this.ngForm.controls['inventoryItems']['controls'][i].controls['bag_size'].setValue('');
  }

  liftingYearData() {
    let route = "get-lifting-self-year";
    let param = {
      "radio_type": "national-temp"
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.yearOfIndent = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }

  liftingSeasonData() {
    let route = "get-lifting-self-season";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "radio_type": "national-temp"
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seasonlist = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }

  liftingCropData() {
    let route = "get-lifting-self-crop";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "radio_type": "national-temp"
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
  liftingLotNoData() {
    let route = "get-lifting-lot-no-data-v1";
    let param = {

      year: this.ngForm.controls['year'].value,
      season: this.ngForm.controls['season'].value,
      crop_code: this.ngForm.controls['crop_code'].value,
      variety_code: this.variety_code ? this.variety_code : this.ngForm.controls['variety_code'].value,
      veriety_array: this.ngForm.controls['variety_array'].value,
      is_self: true,
      "radio_type": "national-temp"
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.lotNoDetailsData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }

  selcetAll(event) {
    if (event && event.length > 0) {
      this.ngForm.controls["variety_array"].patchValue(event);
      this.seedProcessRegisterData(null)
    }
  }
  seedProcessRegisterData(item) {
    let varietyCodeValue = [];
    if (this.ngForm.controls['variety_array'].value && this.ngForm.controls['variety_array'].value.length) {
      this.ngForm.controls['variety_array'].value.forEach(ele => {
        varietyCodeValue.push(ele.variety_code);
      })
    }
    let route = "get-seed-processing-register-data";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_code'].value,
        "variety_code_array": varietyCodeValue && varietyCodeValue.length ? varietyCodeValue : []
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seedProcessRegisterDataList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        // this.generateSampleSlipData.clear();
        // this.fetchDataValue(null);
      }
    });
  }

  inventoryItemsArrayForms() {
    let temp = this.fb.group({
      tag_no: ['',],
      lot_no: ['',],
      lot_id: [''],
      // bag_weight: ['100',],
      // no_of_bags: ['50',],
      bag_weight: [''],
      no_of_bags: [''],
      qnt_of_lifting: [''],
      mrp_per_unit: [''],
      total_amt: ['0'],
      tag_data: [''],
      // tag_data:['']
    });
    return temp;
  }

  inventoryItemsForms() {
    let temp = this.fb.group({
      tag_no: ['',],
      lot_no: ['',],
      bag_weight: ['',],
      no_of_bags: ['',],
      qnt_of_lifting: [''],
      mrp_per_unit: [''],
      total_amt: ['0'],
      lot_id: [''],
      tag_no_details_data: [''],
      bag_size: [''],
      tag_data: ['']
    });
    return temp;
  }
  // tag_no_details_data
  selectTagDetails(event, i) {
    let tagNoArray = [];
    let tagNoDetailsData = [];
    let temp = [];
    let lotDetails = this.lotNoDetailsData.filter(item => item.lot_no == event.target.value)
    if (lotDetails && lotDetails.length) {
      this.ngForm.controls['inventoryItems']['controls'][i].controls['lot_id'].setValue(lotDetails && lotDetails[0] && lotDetails[0].lot_id ? lotDetails[0].lot_id : '')
      this.tagNoArrayData.forEach((ele) => {
        tagNoArray.push(ele.tag_no);
      })
      if (tagNoArray && tagNoArray.length) {
        temp = this.dropdownList4.filter(item =>
          !tagNoArray.includes(item.tag_no)
        );
        tagNoDetailsData = temp
          .filter(item => item.lot_no === lotDetails[0]?.lot_no)
          .sort((a, b) => a.tag_no.localeCompare(b.tag_no));
        this.ngForm.controls['inventoryItems']['controls'][i].controls['tag_no_details_data'].setValue(tagNoDetailsData);
      } else {
        tagNoDetailsData = this.dropdownList4
          .filter(item => item.lot_no === lotDetails[0]?.lot_no)
          .sort((a, b) => a.tag_no.localeCompare(b.tag_no));
        this.ngForm.controls['inventoryItems']['controls'][i].controls['tag_no_details_data'].setValue(tagNoDetailsData);
      }
      this.ngForm.controls['inventoryItems']['controls'][i].controls['bag_size'].setValue(lotDetails && lotDetails[0] && lotDetails[0].bag_weight ? lotDetails[0].bag_weight : '')
    } else {
      tagNoDetailsData = this.dropdownList4
        .filter(item => item.lot_no === lotDetails[0]?.lot_no)
        .sort((a, b) => a.tag_no.localeCompare(b.tag_no));
      this.ngForm.controls['inventoryItems']['controls'][i].controls['tag_no_details_data'].setValue(tagNoDetailsData);
    }
  }

  selectNoOfBag(event, i) {
    let bagSize = this.dropdownList4.filter(item => item.tag_no == event.tag_no);
    let datas;
    if (bagSize && bagSize.length > 0) {
      bagSize.forEach((el => {
        el['key'] = i
      }))
    }
    this.bagData.push(bagSize)
    if (this.bagData && this.bagData.length > 0) {
      datas = this.bagData ? this.bagData.flat() : '';
    }
    if (datas && datas.length > 0) {
      let sum = 0
      datas.forEach((val => {
        if (val.key == i) {
          sum += val.bag_size;
          // this.ngForm.controls['inventoryItems']['controls'][i].controls['bag_size'].setValue(sum)
        }
      }))

    }
    // this.ngForm.controls['inventory_item_array']['controls'][i].controls['tag_data'].setValue(bagSize)
    this.ngForm.controls['inventoryItems']['controls'][i].controls['tag_data'].setValue(bagSize)
    this.ngForm.controls['inventoryItems']['controls'][i].controls['no_of_bags'].setValue(bagSize[0].no_of_bags)
    this.ngForm.controls['inventoryItems']['controls'][i].controls['bag_weight'].setValue(bagSize[0].bag_size)
  }

  getFilteredOptions() {
    let tagNoArray = [];
    this.tagNoArrayData.forEach((ele) => {
      tagNoArray.push(ele.tag_no);
    })
    let temp = this.dropdownList4.filter(item =>
      !tagNoArray.includes(item.tag_no)
    );
  }

  addItem() {
    this.inventoryItems.push(this.inventoryItemsForms());
  }


  deleteItem(index: number) {
    this.inventoryItems.removeAt(index);
  }
  RemoveItem(index: number) {
    this.inventory_item_array.removeAt(index);
    this.inventoryItems.clear()
    this.addItem();
    this.addToTable(this.inventoryItems.controls)
  }
  addToTable(inventoryItems) {
    let validData = false
    inventoryItems.forEach((el, i) => {
      console.log(el.controls['bag_size'].value);
      if (el.controls['bag_size'].value || el.controls['lot_no'].value && el.controls['tag_no'].value) {
        validData = true;
      } else {
        validData = false;
      }
    })

    if (!validData) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Lots & Tags.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    this.visibleTable = true;
    this.fetchInviceData();
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
        this.visibleTransportCharges = true;
        break;
      case 6:
        this.visiblePostageCharges = true;
        break;
      case 7:
        this.visiblePackingCharges = true;
        break;
      case 8:
        this.visibleOtherCharges = true;
        break;
      default:
        this.visibleMouCharges = false
        this.visibleLicenceCharges = false;
        this.visibleppvCharges = false;
        this.visiblerltCharges = false;
        this.visibleTransportCharges = false;
        this.visiblePostageCharges = false;
        this.visiblePackingCharges = false;
        this.visibleOtherCharges = false;
    }
  }

  // Method to handle item deselection from the dropdown
  onItemDeSelect(item: any) {
    switch (item.id) {
      case 1:
        this.visibleMouCharges = false;
        this.removeChargeRow('mou_amt', 'mougst_amt', 'mougst_amt_total');
        break;
      case 2:
        this.visibleLicenceCharges = false;
        this.removeChargeRow('licence_amt', 'licencegst_amt', 'licencegst_amt_total');
        break;
      case 3:
        this.visibleppvCharges = false;
        this.removeChargeRow('ppv_amt', 'ppvgst_amt', 'ppvgst_amt_total');
        break;
      case 4:
        this.visiblerltCharges = false;
        this.removeChargeRow('rlt_amt', 'rltgst_amt', 'rltgst_amt_total');
        break;
      case 5:
        this.visibleTransportCharges = false;
        this.removeChargeRow('transport_amt', 'transportgst_amt', 'transportgst_amt_total');
        break;
      case 6:
        this.visiblePostageCharges = false;
        this.removeChargeRow('postage_amt', 'postagegst_amt', 'postagegst_amt_total');
        break;
      case 7:
        this.visiblePackingCharges = false;
        this.removeChargeRow('packing_amt', 'packinggst_amt', 'packinggst_amt_total');
        break;
      case 8:
        this.visibleOtherCharges = false;
        this.removeChargeRow('other_amt', 'othergst_amt', 'othergst_amt_total');
        break;
    }
  }

  removeChargeRow(arg0: string, arg1: string, arg2: string) {
    this.ngForm.controls[arg0].reset();
    this.ngForm.controls[arg1].reset();
    this.ngForm.controls[arg2].reset();
    this.calculateCharges();
  }

  onDeSelect(item) {
    // this.selectedItems = [];
    switch (item) {
      case 1:
        this.visibleMouCharges = false
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        this.removeChargeRow('mou_amt', 'mougst_amt', 'mougst_amt_total');
        break;
      case 2:
        this.visibleLicenceCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        this.removeChargeRow('licence_amt', 'licencegst_amt', 'licencegst_amt_total');
        break;
      case 3:
        this.visibleppvCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        this.removeChargeRow('ppv_amt', 'ppvgst_amt', 'ppvgst_amt_total');
        break;
      case 4:
        this.visiblerltCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        this.removeChargeRow('rlt_amt', 'rltgst_amt', 'rltgst_amt_total');
        break;
      case 5:
        this.visibleTransportCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        this.removeChargeRow('transport_amt', 'transportgst_amt', 'transportgst_amt_total');
        break;
      case 6:
        this.visiblePostageCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        this.removeChargeRow('postage_amt', 'postagegst_amt', 'postagegst_amt_total');
        break;
      case 7:
        this.visiblePackingCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        this.removeChargeRow('packing_amt', 'packinggst_amt', 'packinggst_amt_total');
        break;
      case 8:
        this.visibleOtherCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        this.removeChargeRow('other_amt', 'othergst_amt', 'othergst_amt_total');
        break;
      default:
    }

  }

  // Method to handle radio button change
  toggleTableDisplay() {
    this.showTable = true;
  }

  toggleTableDisplay1() {
    this.showTable1 = true;
  }

  toggleTableDisplay2() {
    this.showTable2 = true;
  }

  onSelectAll(item: any) {
    // alert("Hiii");
    this.visibleMouCharges = true
    this.visibleLicenceCharges = true;
    this.visibleppvCharges = true;
    this.visiblerltCharges = true;
    this.visibleTransportCharges = true;
    this.visiblePostageCharges = true;
    this.visiblePackingCharges = true;
    this.visibleOtherCharges = true;
  }
  onDeSelectAll(item) {
    // alert("Hiii");
    // this.selectedItems = [];
    this.visibleMouCharges = false
    this.visibleLicenceCharges = false;
    this.visibleppvCharges = false;
    this.visiblerltCharges = false;
    this.visibleTransportCharges = false;
    this.visiblePostageCharges = false;
    this.visiblePackingCharges = false;
    this.visibleOtherCharges = false;
    this.removeChargeRow('mou_amt', 'mougst_amt', 'mougst_amt_total');
    this.removeChargeRow('licence_amt', 'licencegst_amt', 'licencegst_amt_total');
    this.removeChargeRow('ppv_amt', 'ppvgst_amt', 'ppvgst_amt_total');
    this.removeChargeRow('rlt_amt', 'rltgst_amt', 'rltgst_amt_total');
    this.removeChargeRow('transport_amt', 'transportgst_amt', 'transportgst_amt_total');
    this.removeChargeRow('postage_amt', 'postagegst_amt', 'postagegst_amt_total');
    this.removeChargeRow('packing_amt', 'packinggst_amt', 'packinggst_amt_total');
    this.removeChargeRow('other_amt', 'othergst_amt', 'othergst_amt_total');
  }

  fetchData() {
    this.getPageData();

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

  save(data) {
  }
  get items(): FormArray {
    return this.ngForm.get('bsp2Arr') as FormArray;
  }
  cgClick() {
    document.getElementById('crop_group').click();
  }

  formatTagNumbers(tagNumbers: any[]): string {
    if (!tagNumbers || !Array.isArray(tagNumbers) || tagNumbers.length === 0) {
      return 'NA';
    }
    // Flatten the nested array
    const flattenedTags = tagNumbers.flat(); // Flatten one level
    // Extract tag_no values
    const extractedTags = flattenedTags
      .map(tag => tag?.tag_no?.toString()) // Extract `tag_no` as string
      .filter(Boolean); // Remove invalid entries
    if (extractedTags.length === 0) return 'NA';
    // Sort tags in ascending order
    extractedTags.sort();
    // Combine into ranges
    const formattedRanges: string[] = [];
    let rangeStart = extractedTags[0];
    let lastTag = rangeStart;

    for (let i = 1; i <= extractedTags.length; i++) {
      const currentTag = extractedTags[i];
      const currentNumber = currentTag?.split('/').pop();
      const lastNumber = lastTag.split('/').pop();
      if (currentNumber && lastNumber && +currentNumber === +lastNumber + 1) {
        lastTag = currentTag;
      } else {
        const range = rangeStart === lastTag
          ? rangeStart
          : `${rangeStart}-${lastTag.split('/').pop()}`;
        formattedRanges.push(range);
        rangeStart = currentTag;
        lastTag = currentTag;
      }
    }
    return formattedRanges.join(', ');
  }

  cropNameValue(item: any) {
    this.selectCrop = item.crop_name;
    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_code'].setValue(item.crop_code);
    this.selectCrop_crop_code = item.crop_code;
    this.crop_name_data = item.crop_name;
    this.selectCrop_group = "";
    this.getUnit(item.crop_code)
    this.resetFormDataFilter();
    this.crop_text_check = 'crop_group'
  }

  cropdatatext() {
    this.cropNameSecond;
  }

  onScanSuccess(data: any) {
  }
  startScan() {
  }

  addTagNoItem() {
    this.inventory_item_array.clear();
    this.inventoryItems.clear();
    this.tagNoArrayData = [];
    this.lotDetailsArray = [];
    //  this.resetFormByVariety();
    this.additionalChargesData();
    if (!this.isRadioSelected) {
      if (this.inventoryItems.length < 1) {
        this.addItem();
        this.isRadioSelected = true; // Disable further additions
      } else {
        this.inventory_item_array.removeAt(0);
      }
    }
    if (this.inventoryItems.length == 0) {
      this.inventoryItems.push(this.inventoryItemsForms());
    }
  }

  fetchInviceData() {
    // this.lotDetailsArray = [];
    if (this.ngForm.controls['inventoryItems'].value) {
      this.ngForm.controls['inventoryItems'].value.forEach(ele => {
        this.lotDetailsArray.push(ele);
      })
      let finalArray = [];
      if (this.lotDetailsArray && this.lotDetailsArray.length) {
        finalArray = this.lotDetailsArray;
      }
      for (let i = 0; i < finalArray.length; i++) {
        if (finalArray.length > 1) {
          this.remove(i);
        }
        this.addMore();
        // Filter array1 to include only objects that are in array2 based on 'id' property
        const filteredArray = this.dropdownList4.filter(obj1 =>
          finalArray[i].tag_no.some(obj2 => obj2.tag_no === obj1.tag_no)
        );
        // let bagSize = this.dropdownList4.filter(item => item.tag_no == event.tag_no);
        this.ngForm.controls['inventory_item_array']['controls'][i].controls['tag_data'].setValue(filteredArray)
        let sum = 0
        if (filteredArray && filteredArray.length > 0) {
          filteredArray.forEach(el => {
            sum += el.bag_size;
            this.ngForm.controls['inventory_item_array']['controls'][i].controls['bag_weight'].setValue(el.bag_size)
          })

        }
        this.ngForm.controls['inventory_item_array']['controls'][i].patchValue({
          lot_no: [finalArray[i].lot_no ? finalArray[i].lot_no : 0],
          lot_id: [finalArray[i].lot_id ? finalArray[i].lot_id : 0],
          tag_no: [finalArray[i].tag_no ? finalArray[i].tag_no : 0],
          // bag_weight: [finalArray[i].bag_weight ? finalArray[i].bag_weight : 0],
          no_of_bags: [finalArray[i].tag_no ? finalArray[i].tag_no.length : 0],
          qnt_of_lifting: [finalArray[i].bag_weight ? (finalArray[i].tag_no.length * finalArray[i].bag_weight) : 0],
          mrp_per_unit: [this.perUnitPrice ? this.perUnitPrice : 0],
          total_amt: [finalArray[i].tag_no ? (finalArray[i].tag_no.length * this.perUnitPrice) : 0],

        });

      }
      let inventory_item_arrayData = this.ngForm.value && this.ngForm.value.inventory_item_array ? this.ngForm.value.inventory_item_array : ''
      let sum = 0
      if (inventory_item_arrayData && inventory_item_arrayData.length > 0) {
        inventory_item_arrayData.forEach((el => {
          sum += el['mrp_per_unit'][0]
        }))
      }
      this.ngForm.controls['grand_total_amt'].setValue(sum)
      this.inventoryItems.clear();
      this.addItem();

    }
  }

  getTagNo(data, i) {
    let tagNo = []
    if (data && data[i] && data[i].length) {
      data[i].forEach(ele => {
        tagNo.push(ele.tag_no);
      })
    }
    let tagNoArray = tagNo.toString();

    return tagNoArray;
  }
  selectOption(option: string) {
    this.selectedOption = option;
  }
  addMore() {
    this.inventory_item_array.push(this.inventoryItemsArrayForms());
  }

  remove(index: number) {
    this.inventory_item_array.removeAt(index);
  }
  calculateGrandTotal() {
    const controls = this.ngForm.get('bspc') as FormArray;
    if (controls) {
      const sumOfTotal = controls.controls.reduce((sum, control) => {
        return sum + control.get('total_amount_for_each_bag_weight').value;
      }, 0);
      this.ngForm.get('grand_total_amt').setValue(sumOfTotal);
    }
  }

  sumValue(event, i) {
    // alert('h111')
    this.ngForm.controls['inventory_item_array']['controls'][i].controls['total_amt'].setValue((event.target.value) * (this.ngForm.controls['inventory_item_array']['controls'][i].controls['no_of_bags'].value));
    let sumOfTotal = 0;
    this.ngForm.controls['inventory_item_array'].value.forEach((ele, i) => {
      sumOfTotal += parseFloat(this.ngForm.controls['inventory_item_array']['controls'][i].controls['total_amt'].value);
    });
    this.ngForm.controls['grand_total_amt'].setValue(sumOfTotal);
    console.log('sum', this.ngForm.controls['grand_total_amt'].value);
  }
  grandTotal = 0;

  gstCalculateValue(event, key = null) {
    if (event == "sum") {
      this.ngForm.controls['totalgst_amt'].setValue((this.ngForm.controls['grand_total_amt'].value * this.ngForm.controls['totalgst_per'].value) / 100);
      this.grandTotal = this.ngForm.controls['totalgst_amt'].value + this.ngForm.controls['grand_total_amt'].value;
    } else {
      let data = this.ngForm.value.inventory_item_array;
      let sum = 0;
      if (data && data.length > 0) {
        data.forEach(el => {
          sum += Number(el.total_amt)
        })
      }
      if ((this.ngForm.controls['totalgst_per'].value == 0) && key == 'per_unit_price') {
        this.grandTotal = Number(sum ? sum : 0);
        let amount = this.amount ? this.amount : 0;
        let totalAmount = Number(this.ngForm.controls['final_grand_total_amt'].value) - Number(amount);
        this.ngForm.controls['total_final_amount'].setValue(totalAmount ? totalAmount : 0)
      } else {
        if (key == null) {
          this.ngForm.controls['totalgst_amt'].setValue((sum * event.target.value) / 100);
        }

        this.grandTotal = Number(sum ? sum : 0) + parseFloat(this.ngForm.controls['totalgst_amt'].value);
        let amount = this.amount ? this.amount : 0;
        if (this.ngForm.controls['final_grand_total_amt'].value) {
          let totalAmount = Number(this.ngForm.controls['final_grand_total_amt'].value) - Number(amount);
          this.ngForm.controls['total_final_amount'].setValue(totalAmount ? totalAmount : 0)
        }
      }
    }
  }
  calculateCharges() {
    console.log('calculate', this.ngForm.controls['grand_total_amt'].value);
    const controls = this.ngForm.controls;
    // Helper function to get number safely
    const val = (key: string) => +controls[key].value || 0;
    this.grandTotal = val('grand_total_amt') + (val('grand_total_amt') * val('totalgst_per') / 100);
    this.ngForm.controls['totalgst_amt'].setValue(val('grand_total_amt') * val('totalgst_per') / 100);
    // Calculate GST-inclusive amount
    const totalAmount =
      val('licence_amt') + (val('licence_amt') * val('licencegst_amt') / 100) +
      val('mou_amt') + (val('mou_amt') * val('mougst_amt') / 100) +
      val('ppv_amt') + (val('ppv_amt') * val('ppvgst_amt') / 100) +
      val('rlt_amt') + (val('rlt_amt') * val('rltgst_amt') / 100) +
      val('transport_amt') + (val('transport_amt') * val('transportgst_amt') / 100) +
      val('postage_amt') + (val('postage_amt') * val('postagegst_amt') / 100) +
      val('packing_amt') + (val('packing_amt') * val('packinggst_amt') / 100) +
      val('other_amt') + (val('other_amt') * val('othergst_amt') / 100) +
      val('grand_total_amt') + (val('grand_total_amt') * val('totalgst_per') / 100);

    // Set value with 2 decimal rounding
    controls['final_grand_total_amt'].setValue(+totalAmount.toFixed(2));
  }

  toggleSearch() {
    this.resetFormData();

    this.getVarietyDetails();
    this.getTotalProductionDetails();
    this.getTotalLifting();
  }

  getVarietyDetails(): void {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const route = "get-lifting-total-variety";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop_code'].value,
        user_id: UserId ? UserId.toString() : '',

      }

    }

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.response1 = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : '';
      }
    })
  }


  getTotalProductionDetails(): void {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const route = "get-lifting-total-production";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop_code'].value,
        user_id: UserId ? UserId.toString() : '',

      }

    }

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.response2 = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : '';

      }
      console.log("this.response", this.response);

    })
  }

  getTotalLifting(): void {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const route = "get-total-lifting";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop_code'].value,
        user_id: UserId ? UserId.toString() : '',

      }

    }

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.response3 = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : '';

      }
      console.log("this.response", this.response);

    })
  }
  get remainingQty() {
    const totalProd = this.response2?.total_production ?? 0;
    const totalLift = this.response3?.total_lifting ?? 0;
    return totalProd - totalLift;
  }

  resetFormData() {
    this.selectVariety = ''
    this.tagNoArrayData = [];
    this.selectIndentor = "";
    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false });
    this.ngForm.controls['spa_text'].setValue('', { emitEvent: false })
    this.variety_code = '';
    this.variety_name = '';
    this.indentorId = '';
    this.spaId = '';
    this.state_code = '';
    this.variety_line_code = '';
    this.indentor_name = 'NA';
    this.spaName = "NA"
    this.allocated_quantity = "NA";

    // spa input field
    this.ngForm.controls['address'].patchValue('NA');
    this.ngForm.controls['mobile_no'].patchValue('NA');
    this.selectSpa = '';
    this.allSpaData = []; // Reset the dropdown data
    this.ngForm.controls['selectSpa'].setValue('');
    this.address = ''; // Map address
    this.mobile_number = ''; // Map mobile number
    this.ngForm.controls['spa_code'].setValue('');
    this.ngForm.controls['spa_id'].setValue('');
    this.ngForm.controls['address'].setValue('NA'); // Set address in the form
    this.ngForm.controls['mobile_no'].setValue('NA'); // Set mobile in the form

    // indenter input field
    // this.ngForm.controls['indenter_array'].setValue('');
    this.dropdownList21 = [];

    // district input field
    this.ngForm.controls['district_text'].setValue('')
    this.districtData = this.districtDataSecond;
    this.ngForm.controls['district'].setValue('')
    this.selectDistrict = ''; // Set the selected district name


    // additional charge
    this.ngForm.controls['selectedCharges'].setValue('');
    this.ngForm.controls['totalgst_per'].setValue(0);
    this.ngForm.controls['final_grand_total_amt'].setValue('');
    this.ngForm.controls['licence_amt'].setValue(''); this.ngForm.controls['licencegst_amt'].setValue('');
    this.ngForm.controls['mou_amt'].setValue(''); this.ngForm.controls['mougst_amt'].setValue('');
    this.ngForm.controls['ppv_amt'].setValue(''); this.ngForm.controls['ppvgst_amt'].setValue('');
    this.ngForm.controls['rlt_amt'].setValue(''); this.ngForm.controls['rltgst_amt'].setValue('');
    this.ngForm.controls['transport_amt'].setValue(''); this.ngForm.controls['transportgst_amt'].setValue('');
    this.ngForm.controls['postage_amt'].setValue(''); this.ngForm.controls['postagegst_amt'].setValue('');
    this.ngForm.controls['packing_amt'].setValue(''); this.ngForm.controls['packinggst_amt'].setValue('');
    this.ngForm.controls['other_amt'].setValue(''); this.ngForm.controls['othergst_amt'].setValue('');
    this.grandTotal = 0; this.ngForm.controls['grand_total_amt'].setValue('');

    this.visibleMouCharges = false
    this.visibleLicenceCharges = false;
    this.visibleppvCharges = false;
    this.visiblerltCharges = false;
    this.visibleTransportCharges = false;
    this.visiblePostageCharges = false;
    this.visiblePackingCharges = false;
    this.visibleOtherCharges = false;

    // reason
    this.ngForm.controls['reason_id'].setValue('');
    this.ngForm.controls['draft'].setValue('');
    this.ngForm.controls['dd_no'].setValue('');
    this.inventoryItems.clear();
    this.visibleTable = false;
    this.inventory_item_array.clear();
    this.liftingTableData(null);
    if (this.inventoryItems.length == 0) {
      this.inventoryItems.push(this.inventoryItemsForms());
    }
    this.searchClicked = true;
    this.liftingselfVariety();
    this.getPageData();
    this.liftingTableData(null);
    this.liftingVarietyData();
    this.liftingIndenterData();
    this.liftingSPAData();
  }
  additionalChargesData() {
    // additional charge
    this.ngForm.controls['selectedCharges'].setValue('');
    this.ngForm.controls['totalgst_per'].setValue(0);
    this.ngForm.controls['final_grand_total_amt'].setValue('');
    this.ngForm.controls['licence_amt'].setValue(''); this.ngForm.controls['licencegst_amt'].setValue('');
    this.ngForm.controls['mou_amt'].setValue(''); this.ngForm.controls['mougst_amt'].setValue('');
    this.ngForm.controls['ppv_amt'].setValue(''); this.ngForm.controls['ppvgst_amt'].setValue('');
    this.ngForm.controls['rlt_amt'].setValue(''); this.ngForm.controls['rltgst_amt'].setValue('');
    this.ngForm.controls['transport_amt'].setValue(''); this.ngForm.controls['transportgst_amt'].setValue('');
    this.ngForm.controls['postage_amt'].setValue(''); this.ngForm.controls['postagegst_amt'].setValue('');
    this.ngForm.controls['packing_amt'].setValue(''); this.ngForm.controls['packinggst_amt'].setValue('');
    this.ngForm.controls['other_amt'].setValue(''); this.ngForm.controls['othergst_amt'].setValue('');
    this.grandTotal = 0; this.ngForm.controls['grand_total_amt'].setValue('');

    this.visibleMouCharges = false
    this.visibleLicenceCharges = false;
    this.visibleppvCharges = false;
    this.visiblerltCharges = false;
    this.visibleTransportCharges = false;
    this.visiblePostageCharges = false;
    this.visiblePackingCharges = false;
    this.visibleOtherCharges = false;

  }
  resetFormByVariety() {
    this.indentorId = '';
    this.spaId = '';
    this.state_code = '';
    this.variety_line_code = '';
    this.indentor_name = 'NA';
    this.spaName = "NA"
    this.allocated_quantity = "NA";
    this.tagNoArrayData = [];
    // spa input field
    this.ngForm.controls['address'].patchValue('NA');
    this.ngForm.controls['mobile_no'].patchValue('NA');
    this.selectSpa = '';
    this.allSpaData = []; // Reset the dropdown data
    this.ngForm.controls['selectSpa'].setValue('');
    this.address = ''; // Map address
    this.mobile_number = ''; // Map mobile number
    this.ngForm.controls['spa_code'].setValue('');
    // this.ngForm.controls['spa_id'].setValue('');
    this.ngForm.controls['address'].setValue('NA'); // Set address in the form
    this.ngForm.controls['mobile_no'].setValue('NA'); // Set mobile in the form

    // indenter input field
    this.ngForm.controls['indenter_array'].setValue('', { emitEvent: false });
    this.dropdownList21 = [];

    this.additionalChargesData();
    // reason
    this.ngForm.controls['reason_id'].setValue('');
    this.ngForm.controls['draft'].setValue('');
    this.ngForm.controls['dd_no'].setValue('');
    this.inventoryItems.clear();
    this.inventory_item_array.clear();
  }

  resetFormDataFilter() {
    this.visibleTable = false;
    // this.isDivVisible1 = false;
    this.isDivVisible = false;
    this.tagNoArrayData = [];
    this.searchClicked = false;
    this.selectVariety = ''
    this.selectIndentor = "";
    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false });
    this.ngForm.controls['spa_text'].setValue('', { emitEvent: false })
    this.variety_code = '';
    this.variety_name = '';
    this.resetFormByVariety();
    this.liftingTableData(null);
    if (this.inventoryItems.length == 0) {
      this.inventoryItems.push(this.inventoryItemsForms());
    }

    this.liftingselfVariety();
    this.getPageData();
    this.liftingTableData(null);
    this.liftingVarietyData();
    this.liftingIndenterData();
    this.liftingSPAData();
  }

  toggleSearchFirst(data, item, val = null) {
    this.variety_code = data && data.variety_code ? data.variety_code : '';
    this.variety_name = data && data.variety_name ? data.variety_name : '';
    this.indentorId = item && item.indent ? item.indent : '';
    this.spaId = val && val.spa_code ? val.spa_code : '';
    this.state_code = val && val.state_code ? val.state_code : '';
    this.variety_line_code = data && data.variety_line_code ? data.variety_line_code : '';
    this.indentor_name = item && item.user && item.user.n ? item.user.n : 'NA';
    this.spaName = val && val.name ? val.name : "NA"
    this.allocated_quantity = val && val.allocated_quantity ? val.allocated_quantity : "NA";
    this.getInvoiceData()
    this.searchClicked1 = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }

  calculateRowspan(data: any): number {
    if (!data || !data.spas) {
      return 1;
    }
    return data.spas.length || 1;
  }

  saveFormData() {
    if (this.ngForm.invalid) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select All Required Fields.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    let route = "add-lifting-data";
    let data = []
    let additionCharges = [];
    if (this.ngForm.controls['selectedCharges'].value) {
      this.ngForm.controls['selectedCharges'].value.forEach(ele => {
        if (ele && ele.charges === "Mou charges") {
          additionCharges.push(
            {
              gst: this.ngForm.controls['mougst_amt'].value,
              additional_charges_id: ele.id,
              name: null,
              total_amount: this.ngForm.controls['mou_amt'].value,
              after_apply_gst: ((this.ngForm.controls['mou_amt'].value) + (this.ngForm.controls['mou_amt'].value * this.ngForm.controls['mougst_amt'].value) / 100)
            }
          );
        }
        if (ele && ele.charges === "License fee") {
          additionCharges.push(
            {
              gst: this.ngForm.controls['licencegst_amt'].value,
              additional_charges_id: ele.id,
              name: null,
              total_amount: this.ngForm.controls['licence_amt'].value,
              after_apply_gst: ((this.ngForm.controls['licence_amt'].value) + (this.ngForm.controls['licence_amt'].value * this.ngForm.controls['licencegst_amt'].value) / 100)
            }
          );
        }
        if (ele && ele.charges === "PPV fee") {
          additionCharges.push(
            {
              gst: this.ngForm.controls['ppvgst_amt'].value,
              additional_charges_id: ele.id,
              name: null,
              total_amount: this.ngForm.controls['ppv_amt'].value,
              after_apply_gst: ((this.ngForm.controls['ppv_amt'].value) + (this.ngForm.controls['ppv_amt'].value * this.ngForm.controls['ppvgst_amt'].value) / 100)
            }
          );
        }
        if (ele && ele.charges === "Royalty") {
          additionCharges.push(
            {
              gst: this.ngForm.controls['rltgst_amt'].value,
              additional_charges_id: ele.id,
              name: null,
              total_amount: this.ngForm.controls['rlt_amt'].value,
              after_apply_gst: ((this.ngForm.controls['rlt_amt'].value) + (this.ngForm.controls['rlt_amt'].value * this.ngForm.controls['rltgst_amt'].value) / 100)
            }
          );
        }
        if (ele && ele.charges === "Transportation") {
          additionCharges.push(
            {
              gst: this.ngForm.controls['trasportgst_amt'].value,
              additional_charges_id: ele.id,
              name: null,
              total_amount: this.ngForm.controls['transport_amt'].value,
              after_apply_gst: ((this.ngForm.controls['transport_amt'].value) + (this.ngForm.controls['transport_amt'].value * this.ngForm.controls['transportgst_amt'].value) / 100)
            }
          );
        }
        if (ele && ele.charges === "Postage") {
          additionCharges.push(
            {
              gst: this.ngForm.controls['postage_amt'].value,
              additional_charges_id: ele.id,
              name: null,
              total_amount: this.ngForm.controls['postage_amt'].value,
              after_apply_gst: ((this.ngForm.controls['postage_amt'].value) + (this.ngForm.controls['postage_amt'].value * this.ngForm.controls['postagegst_amt'].value) / 100)
            }
          );
        }
        if (ele && ele.charges === "Packing") {
          additionCharges.push(
            {
              gst: this.ngForm.controls['packing_amt'].value,
              additional_charges_id: ele.id,
              name: null,
              total_amount: this.ngForm.controls['packing_amt'].value,
              after_apply_gst: ((this.ngForm.controls['packing_amt'].value) + (this.ngForm.controls['packing_amt'].value * this.ngForm.controls['packing_amt'].value) / 100)
            }
          );
        }
        if (ele && ele.charges === "Other") {
          additionCharges.push(
            {
              gst: this.ngForm.controls['other_amt'].value,
              additional_charges_id: ele.id,
              name: this.ngForm.controls['other_amt_tex'].value,
              total_amount: this.ngForm.controls['other_amt'].value,
              after_apply_gst: ((this.ngForm.controls['other_amt'].value) + (this.ngForm.controls['other_amt'].value * this.ngForm.controls['other_amt'].value) / 100)
            }
          );
        }
      })
    }
    for (let key of this.ngForm.controls['inventory_item_array'].value) {
      let tagNoArray = [];
      if (key.tag_no && key.tag_no.length) {
        key.tag_no.forEach((element, i) => {
          if (element) {
            element.forEach(ele => {
              tagNoArray.push({ "tag_no": ele.tag_no, "tag_size": parseFloat(key.bag_weight) })
            })
          }
        });
      }

      const indentorId = this.indenter_id1;
      const stateCode = this.ngForm.controls['state_code'].value;
      const spaCode = this.ngForm.controls['spa_code'].value;
      const spaID = this.ngForm.controls['spa_id'].value;
      data.push({
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_code'].value,
        "variety_code": this.ngForm.controls['variety_code'].value,
        "variety_line_code": this.variety_line_code ? this.variety_line_code : null,
        "indentor_id": indentorId,
        "spa_state_code": stateCode,
        "spa_code": spaCode,
        "spa_id": spaID,
        "reason_id": this.ngForm.controls['reason_id'].value,
        "paid_by": this.ngForm.controls['draft'].value,
        "payment_method_no": this.ngForm.controls['dd_no'].value,
        "per_unit_price": key.mrp_per_unit,
        "breeder_class": key.breeder_class ? key.breeder_class : 'Breeder I',
        "bag_weight": key.bag_weight ? key.bag_weight : '',
        "no_of_bag": key.no_of_bags ? key.no_of_bags : '',
        "total_price": key.total_amt ? key.total_amt : '',
        "tag_data": key.tag_data ? key.tag_data : '',
        "production_type": this.productionType,
        "final_amt": this.ngForm.controls['final_grand_total_amt'].value - this.amount,
        "is_self": 1,
        "gst": this.ngForm.controls['totalgst_amt'].value,
        "total_lifting_price": this.ngForm.controls['final_grand_total_amt'].value ? this.ngForm.controls['final_grand_total_amt'].value : this.ngForm.controls['grand_total_amt'].value,
        "lifting_lots": [
          {
            "lot_no": key && key.lot_no ? key.lot_no.toString() : '',
            "lot_id": key && key.lot_id ? key.lot_id.toString() : '',

          }
        ],
        "lifting_tags": tagNoArray ? tagNoArray : [],

        "lifting_charges": additionCharges ? additionCharges : []
      });
    }
    const lifting_lots = data.flatMap(item => item.lifting_lots);

    // 2. Combine all tag_data
    const tag_data = data.flatMap(item => item.tag_data);

    // 3. Use the first item as the base and extend it
    const result =

    {
      ...data[0],
      lifting_lots,
      tag_data
    };

    // 4. Remove duplicated lifting_tags
    result.lifting_tags = data.flatMap(item => item.lifting_tags);


    this._productionCenter.postRequestCreator(route, { "data": result }, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        let liftingData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : '';
        let liftingId = liftingData && liftingData.id ? liftingData.id : ''
        // Swal.fire({
        //   title: '<p style="font-size:25px;">View Bill Receipt</p>',
        //   icon: 'success',
        //   confirmButtonText:
        //     'OK',
        //   confirmButtonColor: '#E97E15'
        // }.then(is));
        Swal.fire({
          title: '<p style="font-size:25px;">Lifting Data Saved Successfully </p>',
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "View Bill Receipt",
          // denyButtonText: `Don't save`,
          confirmButtonColor: '#E97E15'
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.isDivVisible1 = false;
            this.liftingTableData();
            let data = {
              year: this.ngForm.controls["year"].value ? this.ngForm.controls["year"].value : "",
              season: this.ngForm.controls["season"].value ? this.ngForm.controls["season"].value : "",
              crop_code: this.ngForm.controls['crop_code'].value ? this.ngForm.controls['crop_code'].value : "",
              variety_code: this.ngForm.controls['variety_code'].value ? this.ngForm.controls['variety_code'].value : "",
            };
            this._productionCenter.liftingData = data ? data : [];
            const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id: liftingId }), this.AESKey).toString();
            let encryptedData = encodeURIComponent(encryptedForm);
            const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedData), this.AESKey);
            let decryptedId = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).id;
            encryptedData = encryptedData ? encryptedData.trim() : '';
            this.route.navigate(['Bill-Receipt/' + encryptedData]);
          } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
          }
        });
        // this.checkRunningNumber();

      } else if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 400) {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Fill All Mandatory Field And Lot Details.</p>',
          icon: 'warning',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        });
      }
    })
  }
  toggleSearchFirst1(data) {

    // this.renderer.setProperty(window, 'scrollTo', { top: 0, behavior: 'smooth' });
    const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id: data }), this.AESKey).toString();
    let encryptedData = encodeURIComponent(encryptedForm);
    const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedData), this.AESKey);
    let decryptedId = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).id;
    encryptedData = encryptedData ? encryptedData.trim() : '';
    this.route.navigate(['Bill-Receipt/' + encryptedData]);
  }

  getUnit(item) {
    let value = this.ngForm.controls['crop_code'].value && (this.ngForm.controls['crop_code'].value.slice(0, 1)) == 'A' ? 'Qt' : 'Kg';
    this.unit = value
    return value

  }
  Cancel() {
    this.searchClicked1 = false;
    this.visibleTable = false;
    this.selectedOption = '';
    this.resetFormData();
  }

  getReason() {
    this._productionCenter.postRequestCreator('get-commnets-list', null).subscribe(apiresponse => {
      let res = apiresponse && apiresponse.EncryptedResponse && apiresponse.EncryptedResponse.data ? apiresponse.EncryptedResponse.data : '';
      this.reasonData = res;
    })
  }
  getInvoiceData() {
    const param = {
      search: {
        variety_code: this.variety_code,
        variety_line_code: this.variety_line_code,
        crop_code: this.ngForm.controls['crop_code'].value,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        indenter_id: this.indentorId ? this.indentorId : '',
        spa_code: this.spaId ? this.spaId : '',
        state_code: this.state_code ? this.state_code : ''
        // crop:this.ngForm.controls['crop_code'].value,
      }
    }
    this._productionCenter.postRequestCreator('get-generate-invoice-data', param).subscribe(apiResponse => {
      let data = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data : '';
      this.breederStack = data;
      let res = data.filter((arr, index, self) =>
        index === self.findIndex((t) => (t.receipt_requestsid === arr.receipt_requestsid)))
      this.totalAmount = res && res[0] && res[0].grand_total ? res[0].grand_total : '';
      this.payment_method = res && res[0] && res[0].payment_method ? res[0].payment_method : '';
      this.amount = res && res[0] && res[0].amount ? res[0].amount : 0
    })

  }

  validateInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const numericValue = inputValue.replace(/[^0-9]/g, ''); // Keep only numeric characters

    inputElement.value = numericValue; // Update the input field to display only numbers

    this.ngForm.controls['mobile_no'].setValue(numericValue, { emitEvent: false });
  }

  otherClicked(): void {
    this.selectSpa = 'Other'; // Set the dropdown button text
    this.showOtherInput = true; // Show the input box
    this.ngForm.controls['spa_code'].patchValue(null); // Clear spa_code for "Other"
    this.ngForm.controls['spa_id'].patchValue(null);   // Clear spa_id for "Other"
    this.ngForm.controls['spa_text'].setValue(null);   // Clear spa_text for "Other"
  }

  updateOtherSpa(): void {
    const otherSpaName = this.ngForm.get('otherSpaName')?.value?.trim();
    if (otherSpaName && otherSpaName !== '') {
      this.ngForm.controls['selectSpa'].patchValue(otherSpaName, { emitEvent: false });
    } else {
      this.ngForm.controls['selectSpa'].patchValue(null, { emitEvent: false });
    }
  }


  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value.toUpperCase();
    this.ngForm.controls['address'].setValue(newValue);
  }

  spa(item: any): void {
    this.showOtherInput = false;
    this.selectSpa = item && item.spa_name ? item.spa_name : '';
    this.ngForm.controls['spa_text'].setValue('', { emitEvent: false }); // Clear search input
    this.allSpaData = [...this.spalistSecond]; // Reset the dropdown data
    this.ngForm.controls['selectSpa'].setValue(item && item.spa_id ? item.spa_id : '');
    this.address = item.address || ''; // Map address
    this.mobile_number = item?.mobile_number || ''; // Map mobile number

    // Check if the SPA ID exists for the selected item
    if (item.spa_id) {
      this.ngForm.controls['address'].patchValue(item.address); // Set address in the form
      this.ngForm.controls['mobile_no'].patchValue(item.mobile_number); // Set mobile in the form
      this.ngForm.controls['spa_code'].patchValue(item.spa_code);
      this.ngForm.controls['spa_id'].patchValue(item.spa_id);
    } else {
      this.ngForm.controls['address'].patchValue('NA');
      this.ngForm.controls['mobile_no'].patchValue('NA');
    }
  }



  spaClick() {
    document.getElementById('selectSpa').click();
  }
  varietyClick() {
    document.getElementById('selectVariety').click();
  }
  dClick() {
    document.getElementById('selectDistrict').click();
  }
  variety(item): void {
    this.selectVariety = item && item.variety_name ? item.variety_name : '';
    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false }); // Fix typo
    this.varietyData1 = [...this.varietyListSecond]; // Reset the filtered list
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '');
    this.ngForm.controls['variety_code'].patchValue(item.variety_code);
    this.indentor_name = 'NA';
    this.selectIndentor = "";
    this.spaName = "NA"
    this.allocated_quantity = "NA";
    this.resetFormByVariety();
    this.liftingLotNoData();
    this.liftingTagNoData();
    this.getIndenter();
    if (this.inventoryItems.length == 0) {
      this.inventoryItems.push(this.inventoryItemsForms());
    }
  }

  productionTypeValue(value) {
    if (value) {
      this.productionType = value;
      if (this.productionType == "National") {
        // this.router.navigate(['lifting']); 
        this.isDisableNational = false;
        this.isDisableDirect = true;
        this.isDisableNormalSurplus = true;
      } else if (this.productionType == "direct") {
        // this.router.navigate(['lifting']); 
        this.isDisableNational = true;
        this.isDisableDelay = false;
        this.isDisableNormalSurplus = true;
      } else if (this.productionType == "Surplus") {
        this.isDisableNational = true;
        this.isDisableDirect = true;
        this.isDisableNormalSurplus = false;
      }
      else {
        // this.isDisableNormal= false;
        // this.isDisableDelay= false;
        // this.isDisableNormalReallocate= true;
      }
    }
    // this.getYear();
  }
  resetRadioBtn() {
    window.location.reload();
    this.productionType = ""
  }
}
