import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { opacity } from 'html2canvas/dist/types/css/property-descriptors/opacity';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { sample } from 'rxjs';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { MasterService } from 'src/app/services/master/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generate-samples-for-testing',
  templateUrl: './generate-samples-for-testing.component.html',
  styleUrls: ['./generate-samples-for-testing.component.css']
})
export class GenerateSamplesForTestingComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm: FormGroup = new FormGroup([]);
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryVarietyData: any;
  datatodisplay = [];
  isSearch: boolean;
  isCrop: boolean;
  showTab: boolean;
  
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []
  allData: any;
  dropdownSettings: IDropdownSettings;
  dropdownSettingsTests: IDropdownSettings;
  selectedItems = [];
  dropdownList = [];
  dropdownList1 = [];
  isDisabled: boolean = true;
  searchClicked: boolean = false;
  reprint:boolean=false;
  yearOfIndent: any;
  seasonlist: any;
  cropName: any;
  cropNameSecond: any;
  slip:boolean=false;
  disabledfield: boolean = false;
  selected_state:any;
  stateList:any;
  stateListSecond: any;
  submitted = false;

  lab1 = [
    {
      lab: 'ABC LAB',
      lab_code: 'A01012'
    },
    {
      lab: 'ABCD LAB',
      lab_code: 'A010121'
    }
  ];
  labSecond = [
    {
      lab: 'ABC LAB',
      lab_code: 'A01012'
    },
    {
      lab: 'ABCD LAB',
      lab_code: 'A010121'
    }
  ];

  lab2: any;
  labSecond1: any;

// treat1 = [
//     {
//       treat: 'BSPC name',
//       treat_code: '1'
//     },
//     {
//       treat: 'BSPC name1',
//       treat_code: '2'
//     }
//   ];

  // treatSecond = [
  //   {
  //     treat: 'BSPC name',
  //     treat_code: 'A01012'
  //   },
  //   {
  //     treat: 'BSPC name1',
  //     treat_code: 'A010121'
  //   }
  // ];

  // treat2 = [
  //   {
  //     treats: 'BSPC name',
  //     treat1_code: 'A01012'
  //   },
  //   {
  //     treats: 'BSPC name1',
  //     treat1_code: 'A010121'
  //   }
  // ];

  // treatSecond1 = [
  //   {
  //     treats: 'BSPC name',
  //     treat1_code: 'A0101211'
  //   },
  //   {
  //     treats: 'BSPC name1',
  //     treat1_code: 'A0101212'
  //   }
  // ]

  treatment = [
    {
      treatment: 'Yes'
    },
    {
      treatment: 'No'
    }
  ]

  treatmentSecond = [
    {
      treatment: 'Yes'
    },
    {
      treatment: 'No'
    }
  ]

  treatment1 = [
    {
      treatment1: 'Yes'
    },
    {
      treatment1: 'No'
    }
  ]

  treatmentSecond1 = [
    {
      treatment1: 'Yes'
    },
    {
      treatment1: 'No'
    }
  ]

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

  varietyCategories: any[];
  addVarietySubmission: any[];
  varietyList: any;
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
  formGroup: FormGroup;
  checkboxChecked: boolean = false;
  seedProcessRegisterDta: any;
  carry_over_status: any;
  seedProcessRegisterDataList: any;
  resampleArray:any=[];
control: any;
  // treatSecond: any;
  // treat1: any;
  // treat2: any;
  treatSecond1: any;
  selectstate: any;
  filteredStateList: any[];
  isForSendingToSTLSelected: boolean;
  source_id: any;
  treat1: any;
  treatSecond: any;
  usertype: any;
  checkboxCheckedgot: any;
  useragencttype: any;
  state_code: any;
  is_potato: boolean=false;
  // masterService: any;
  // seedProcessRegisterDta = [
  //   {
  //     // "id": 6,
  //     "year": 2025,
  //     "season": "K",
  //     "crop_code": "A0102",
  //     "variety_code": "A0101002",
  //     "lot_no": "SEP23-0001-001-2(i)",
  //     "class_of_seed": "BREEDER I",
  //     "godown_no": 1,
  //     "stack_no": "R/24-25/RS/2",
  //     "no_of_bags": "100(50Kg)",
  //     "total_processed_qnt": 50,
  //     "unique_code": "abcabcbabcbc",
  //     "sample_no": 1,
  //     "testing_lab": 2,
  //     "chemical_treatment": "no",
  //     "crop_name": "PADDY (DHAN)",
  //     "variety_name": "ALFA-93"
  //   }
  // ] 
  constructor(private service: SeedServiceService, private fb: FormBuilder, private formBuilder: FormBuilder, private _productionCenter: ProductioncenterService, private route: Router, private masterService: MasterService,) {
    this.createForm();
    this.formGroup = this.formBuilder.group({
      checkboxOption: [false]
    });

  }
  onCheckboxChange(event: any) {
    this.checkboxChecked = event.target.checked;
  }
  onCheckboxChangegot(event: any) {
    this.checkboxCheckedgot = event.target.checked;
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

  // updatePlaceholder() {
  //   this.placeholderText = this.chemicalName ? `Chemical Name: ${this.chemicalName}` : 'Enter chemical name';
  // }
  createForm() {
    this.ngForm = this.fb.group({
      year: new FormControl('',),
      treatment: new FormControl('',),
      treatment1: new FormControl('',),
      season: new FormControl(''),
      BSPC: new FormControl(''),
      Status: new FormControl(''),
      cropName: new FormControl(''),
      lab1: new FormControl(''),
      lab2: new FormControl(''),
      treat1: new FormControl(''),
      treat2: new FormControl(''),
      crop_text: new FormControl(''),
      testing_lab_id: new FormControl(''),
      lab_text: new FormControl(''),
      lab1_text: new FormControl(''),
      treat_text: new FormControl(''),
      treat1_text: new FormControl(''),
      variety: new FormControl(''),
      crop_code: new FormControl(''),
      variety_array: new FormControl(''),
      state_text:new FormControl(''),
      generateSampleSlipData: this.fb.array([
      ]),
    })
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_text'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['crop_text'].disable();
        this.selectCrop = "";
        this.generateSampleSlipData.clear();
        this.seedProcessRegisterSeasonData();
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_text'].enable();
        this.generateSampleSlipData.clear();
        this.selectCrop = "";
        this.seedProcessRegisterCropData();
      }
    });

    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.cropName = this.cropNameSecond
        let response = this.cropName.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))
        this.cropName = response
      }
      else {
        this.cropName = this.cropNameSecond
      }
    });
    // this.ngForm.controls['testing_lab'].valueChanges.subscribe(newValue => {
    //   if (newValue) {
    //     this.lab1 = this.labSecond
    //     let response = this.lab1.filter(x => x.lab.toLowerCase().includes(newValue.toLowerCase()))
    //     this.lab1 = response
    //   }
    //   else {
    //     this.lab1 = this.labSecond
    //   }
    // });
    this.ngForm.controls['lab1_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log('newValue',newValue);
        this.lab2 = this.labSecond1;
        let response = this.lab2.filter(x => x.lab_name.toLowerCase().includes(newValue.toLowerCase()));
        this.lab2 = response
      }
      else {
        this.lab2 = this.labSecond1
      }
    });
    
    this.ngForm.controls['treat_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.treat1 = this.treatSecond
        let response = this.treat1.filter(x => x.name.toLowerCase().includes(newValue.toLowerCase()))
        this.treat1 = response
      }
      else {
        this.treat1 = this.treatSecond
      }
      console.log("bspcname*********",this.treat1)
    });
    // this.ngForm.controls['treat1_text'].valueChanges.subscribe(newValue => {
    //   if (newValue) {
    //     this.treat2 = this.treatSecond1
    //     let response = this.treat2.filter(x => x.treats.toLowerCase().includes(newValue.toLowerCase()))
    //     this.treat2 = response
    //   }
    //   else {
    //     this.treat2 = this.treatSecond1
    //   }
    // });
    this.ngForm.controls['Status'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.generateSampleSlipData.clear();
        this.fetchDataValue(newValue);
      }
      else {

      }
    });

  }
  sapleSlipCreateForm(): FormGroup {
    return this.fb.group({
      variety_code: [''],
      variety_name: [''],
      lot_no: [''],
      class_of_seed: [''],
      godown_no: [''],
      stack_no: [''],
      no_of_bags: [''],
      total_processed_qnt: [''],
      unique_code: [''],
      sample_no: [''],
      variety_code_line: [''],
      variety_code_line_name: [''],
      testing_lab: [{ value: '', disabled: true }], 
      chemical_treatment: [''],
      chemical_treatment1: [''],
      choose_sample: [''],
      tests: [],
      lot_id: [''],
      m_seed_test_laboratory: [''],
      get_carry_over: [''],
      status:[''],
      testing_type:[''],
      opacity:[false],
      selectagency:[''],
     
    })
  }
  get generateSampleSlipData(): FormArray {
    return this.ngForm.get('generateSampleSlipData') as FormArray;
  }

  ngOnInit(): void {
    this.fetchData();
    this.seedProcessRegisterYearData();
    this.getSeedTestingCentreData();
    this.getLabTestsData();
    this.getStateList();
    this.getUserBspc();
    // this.treat1Value(null);

    // this.dropdownList1 = [
    //   { item_id: 1, item_text: 'DW-147' },
    //   { item_id: 2, item_text: 'PBW-124' },
    //   { item_id: 3, item_text: 'PBW-127 Parent Line: H123' },
    //   { item_id: 4, item_text: 'DW-147' },
    // ];

    this.selectedItems = [
      { item_id: 3, item_text: ' ' },
      { item_id: 4, item_text: ' ' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'variety_code',
      textField: 'variety_name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      maxHeight: 70,
    };
    this.dropdownSettingsTests = {
      singleSelection: false,
      idField: 'id',
      textField: 'lab_test_name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      maxHeight: 70,
    };
  }

  seedProcessRegisterYearData() {
    let route = "get-seed-processing-register-year-data";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.yearOfIndent = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }
  generateSampleSlipVarietyData() {
    let route = "get-generate-sample-slip-variety-data";
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.dropdownList1 = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }
  getSeedTestingCentreData() {
    let route = "get-bspc-users";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.treat1 = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        this.treatSecond = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    })
  }

  getUserBspc() {
    let route = "get-all-willing-bspc-list-data";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.treat1 = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        this.treatSecond = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    })
  }
  getSeedTestingLaboratoryData(stateCode:any) {
    let route = "seed-testing-laboratory-list-state";
    let param = {
      stateCode: stateCode
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.lab2 = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        this.labSecond1 = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    })
  }
  getLabTestsData() {
    let route = "seed-lab-test-list";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.dropdownList = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    })
  }

  seedProcessRegisterSeasonData() {
    let route = "get-seed-processing-register-season-data";
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

  seedProcessRegisterCropData() {
    let route = "get-seed-processing-register-crop-data";
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
    // console.log("vhtiuitu",item);
    console.log('varietyCodeValue====',varietyCodeValue);
    let route = "get-seed-processing-register-data";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_code'].value,
        "variety_code_array": varietyCodeValue && varietyCodeValue.length ? varietyCodeValue : [],
        "table":item
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seedProcessRegisterDataList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        console.log("ghgshim", this.seedProcessRegisterDataList);
        this.generateSampleSlipData.clear();
        this.fetchDataValue(null);
      }
    });
  }
  lab2Value(item: any) {
    this.selectlab1 = item.labs;
    this.ngForm.controls["lab1_text"].setValue("");
    this.ngForm.controls['lab1_group'].setValue(item.lab1_code);
    this.selectlab1_lab_code = item.lab1_code;
    this.labs_data = item.labs;
    this.selectlab1_group = "";
    this.ngForm.controls['labs'].setValue('')
    this.lab1_text_check = 'lab1_group'
  }

  labdatatext1() {
    this.labSecond;
    console.log(' this.labSecond;', this.labSecond);
  }

  labdatastate() {
    this.labSecond;
    this.filteredStateList = [...this.stateList];
    console.log(' this.labSecond;', this.labSecond);
  }
   
  onDropdownOpen(isOpen: boolean) {
  if (isOpen) { 
    this.filteredStateList = [...this.stateList];
    }
  } 
  filterStates(event: any) {
    const searchTerm = event.target.value.toLowerCase();
   
    if (searchTerm) {
      this.filteredStateList = this.stateList.filter(state => 
        state.state_name.toLowerCase().includes(searchTerm)
      );
    } else { 
      this.filteredStateList = [...this.stateList];
    }
  }

  fetchDataValue(item) {
    let seedProcessRegisterDataArray = [];
    if (item == "Generated") {
      this.seedProcessRegisterDataList.forEach(ele => {
        // if((ele && ele.status ==='re-sample') && (ele.generate_sample_slip && ele.generate_sample_slip['status'] == 're-sample')){
        // }
        // else 
        if (!ele.generate_sample_slip || ele.generate_sample_slip['unique_code'] == null || ele.generate_sample_slip['unique_code'] == '') {
        } else {
          seedProcessRegisterDataArray.push(ele)
        }
      });
      this.seedProcessRegisterDta = seedProcessRegisterDataArray;
    } else if (item == "Not Generated") {
      this.seedProcessRegisterDataList.forEach(ele => {
        // if((ele && ele.status ==='re-sample') && (ele.generate_sample_slip && ele.generate_sample_slip['status'] == 're-sample')){
        // }
        if (!ele.generate_sample_slip || ele.generate_sample_slip['unique_code'] == null || ele.generate_sample_slip['unique_code'] == '') {
          seedProcessRegisterDataArray.push(ele)
        }
      });
      this.seedProcessRegisterDta = seedProcessRegisterDataArray;
    } else {
      
      this.seedProcessRegisterDataList.forEach(ele => {
        // if((ele && ele.status ==='re-sample') && (ele.generate_sample_slip && ele.generate_sample_slip['status'] == 're-sample')){
        // }
        // else{
          seedProcessRegisterDataArray.push(ele)
        // }
      });
      this.seedProcessRegisterDta = seedProcessRegisterDataArray;
    }

    if (this.seedProcessRegisterDta && this.seedProcessRegisterDta.length) {
      for (let i = 0; i < this.seedProcessRegisterDta.length; i++) {
        this.addBspc();
        if (this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_slip && this.seedProcessRegisterDta[i].generate_sample_slip.unique_code && this.seedProcessRegisterDta[i].generate_sample_slip.unique_code) {
         this.useragencttype = this.seedProcessRegisterDta[i].generate_sample_slip.user.agency_detail.agency_name;
         
         this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['selectagency'].setValue(this.useragencttype);
         
          console.log('unique data====',this.seedProcessRegisterDta[i].generate_sample_slip.unique_code);
          this.usertype = this.seedProcessRegisterDta[i].generate_sample_slip.testing_type;
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['testing_type'].setValue(this.usertype);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['choose_sample'].setValue(true);
          // this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['unique'].setValue(true);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['choose_sample'].disable();
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['tests'].disable();
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['opacity'].setValue(true);
          if (this.seedProcessRegisterDta[i].generate_sample_slip.chemical_treatment == "No") {
            this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment1'].setValue("No");
            this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment1'].disable();
          } else {
            this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment1'].setValue("Yes");
            this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment'].setValue(this.seedProcessRegisterDta[i].generate_sample_slip.chemical_treatment);
            this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment'].disable();
            this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment1'].disable();
          }
        }
      
        
        
        if (this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].action === 3) {
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['godown_no'].setValue(this.seedProcessRegisterDta[i].godown_no);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['stack_no'].setValue(this.seedProcessRegisterDta[i].stack_no);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['no_of_bags'].setValue(this.seedProcessRegisterDta[i].no_of_bags);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['total_processed_qnt'].setValue(this.seedProcessRegisterDta[i].lot_qty ? this.seedProcessRegisterDta[i].lot_qty:null,);
        } else if (this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].action === 1) {
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['godown_no'].setValue(this.seedProcessRegisterDta[i].fresh_godown_no);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['stack_no'].setValue(this.seedProcessRegisterDta[i].fresh_stack_no);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['no_of_bags'].setValue(this.seedProcessRegisterDta[i].fresh_no_of_bags);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['status'].setValue(this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].status ? this.seedProcessRegisterDta[i].status:'');
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['total_processed_qnt'].setValue(this.seedProcessRegisterDta[i].total_processed_qty ? this.seedProcessRegisterDta[i].total_processed_qty:null,);
        }else{
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['godown_no'].setValue(this.seedProcessRegisterDta[i].godown_no);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['stack_no'].setValue(this.seedProcessRegisterDta[i].stack_no);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['no_of_bags'].setValue(this.seedProcessRegisterDta[i].no_of_bags);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['total_processed_qnt'].setValue(this.seedProcessRegisterDta[i].recover_qty ? this.seedProcessRegisterDta[i].recover_qty:null,);
        }

        if(this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_slip && this.seedProcessRegisterDta[i].generate_sample_slip.status!="re-sample" && this.seedProcessRegisterDta[i].status === "re-sample"){
          this.resampleArray.push(this.seedProcessRegisterDta[i].status);
         
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['tests'].enable(); 
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['status'].setValue(this.seedProcessRegisterDta[i].status);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['unique_code'].setValue();
          
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['sample_no'].setValue();
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['m_seed_test_laboratory'].setValue();
          // this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['tests'].setValue();
          // this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_slip && this.seedProcessRegisterDta[i].generate_sample_slip.tests ? this.seedProcessRegisterDta[i].generate_sample_slip.tests : null
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment1'].setValue()
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment'].setValue()
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['choose_sample'].setValue();
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment1'].enable();
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment'].enable()
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['godown_no'].setValue(this.seedProcessRegisterDta[i].godown_no);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['stack_no'].setValue(this.seedProcessRegisterDta[i].stack_no);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['no_of_bags'].setValue(this.seedProcessRegisterDta[i].no_of_bags);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['choose_sample'].enable();
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['total_processed_qnt'].setValue(this.seedProcessRegisterDta[i].total_processed_qnt ? this.seedProcessRegisterDta[i].total_processed_qnt:null,);
        }else {
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['status'].setValue(this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_slip && this.seedProcessRegisterDta[i].generate_sample_slip.status ? this.seedProcessRegisterDta[i].generate_sample_slip.status:'');
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['m_seed_test_laboratory'].setValue(this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_slip && this.seedProcessRegisterDta[i].generate_sample_slip.m_seed_test_laboratory && this.seedProcessRegisterDta[i].generate_sample_slip.m_seed_test_laboratory.lab_name ? this.seedProcessRegisterDta[i].generate_sample_slip.m_seed_test_laboratory.lab_name : null);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['tests'].setValue(this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_slip && this.seedProcessRegisterDta[i].generate_sample_slip.tests ? this.seedProcessRegisterDta[i].generate_sample_slip.tests : null);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['unique_code'].setValue(this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_slip && this.seedProcessRegisterDta[i].generate_sample_slip.unique_code ? this.seedProcessRegisterDta[i].generate_sample_slip.unique_code : null);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['sample_no'].setValue( this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_slip && this.seedProcessRegisterDta[i].generate_sample_slip.sample_no ? this.seedProcessRegisterDta[i].generate_sample_slip.sample_no : null);
       
          //   this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['godown_no'].setValue(this.seedProcessRegisterDta[i].godown_no);
        //   this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['stack_no'].setValue(this.seedProcessRegisterDta[i].stack_no);
        //   this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['no_of_bags'].setValue(this.seedProcessRegisterDta[i].no_of_bags);
        //   // this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['total_processed_qnt'].setValue(this.seedProcessRegisterDta[i].total_processed_qty ? this.seedProcessRegisterDta[i].total_processed_qty:null,);

        }
        if( this.seedProcessRegisterDta[i].action ==3 &&  this.seedProcessRegisterDta[i].get_carry_over == 2){
          // alert("hiii ji")
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['godown_no'].setValue();
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['stack_no'].setValue();
        }
        // else if(this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_slip && this.seedProcessRegisterDta[i].generate_sample_slip.status === "re-sample"){
        //   this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['choose_sample'].setValue(true);
        // }
        this.ngForm.controls['generateSampleSlipData']['controls'][i].patchValue({
          // tests:[],
          variety_code: this.seedProcessRegisterDta[i].variety_code,
          variety_code_line: this.seedProcessRegisterDta[i].variety_code_line ? this.seedProcessRegisterDta[i].variety_code_line : null,
          variety_code_line_name: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].m_variety_line && this.seedProcessRegisterDta[i].m_variety_line.line_variety_name ? this.seedProcessRegisterDta[i].m_variety_line.line_variety_name : null,
          variety_name: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].m_crop_variety && this.seedProcessRegisterDta[i].m_crop_variety.variety_name ? this.seedProcessRegisterDta[i].m_crop_variety.variety_name : null,
          lot_no: this.seedProcessRegisterDta[i].lot_no ? this.seedProcessRegisterDta[i].lot_no:null,
          class_of_seed: this.seedProcessRegisterDta[i].class_of_seed ? this.seedProcessRegisterDta[i].class_of_seed:null,
          lot_id: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].lot_id ? this.seedProcessRegisterDta[i].lot_id : null,
          get_carry_over: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].get_carry_over ? this.seedProcessRegisterDta[i].get_carry_over : null,
        });

      }
    }
  }

  addBspc() {
    this.generateSampleSlipData.push(this.sapleSlipCreateForm());
  }

  removeBspc(value: number) {
    console.log("bspc length", this.ngForm.controls['generateSampleSlipData'].value.length);
    this.generateSampleSlipData.removeAt(value);
  }

  onItemSelect(item: any) {
    // this.seedProcessRegisterDta = [];
    this.generateSampleSlipData.clear();
    this.seedProcessRegisterData(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  fetchData() {
    this.getPageData();
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

  getCropData() {
    this.cropNameSecond
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.service.postRequestCreator("data-characterstics-list", null, {
      page: loadPageNumberData,
      pageSize: 50,
      search: {}
    }).subscribe((apiResponse: any) => {
      console.log(apiResponse);
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.filterPaginateSearch.itemListPageSize = 4;
        console.log(apiResponse);
        this.allData = this.inventoryData

        if (this.allData === undefined) {
          this.allData = [];
        }
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, 8, true);
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

  save(data) {
    console.log(data)

  }
  get items(): FormArray {
    return this.ngForm.get('bsp2Arr') as FormArray;
  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  lab1Value(item: any) {
    console.log('item.id====value', item);
    if (item.labFullName && item.labFullName !== 'NA') {
      this.selectlab = item.labFullName; // Set labFullName if it's not empty and not 'NA'
    } else {
      this.selectlab = item.lab_name; // Set lab_name if labFullName is empty or 'NA'
    }
    this.ngForm.controls["lab_text"].setValue("");
    this.ngForm.controls['testing_lab_id'].setValue(item.id);
    this.selectlab_lab_code = item.id;
    this.lab_data = item.lab;
    this.selectlab_group = "";
    console.log("this.ngForm.controls['testing_lab_id']", this.ngForm.controls['testing_lab_id']);
  }
  cropNameValue(item: any) {
    console.log('item====', item);
    this.selectCrop = item.crop_name;
    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_code'].setValue(item.crop_code);
    if (item.crop_code == "H1101") {
      this.is_potato = false;
      } else {
      this.is_potato = true;
    }
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
  cgClick1() {
    document.getElementById('lab_group').click();
  }

  cgClick2() {
    document.getElementById('lab1_group').click();
  }

  labdatatext2() {
    this.labSecond1;
    console.log(' this.labSecond1;', this.labSecond1);
  }

  trClick1() {
    document.getElementById('treat_group').click();
  }
  // treat1Value(item: any) {
  //   this.source_id = item.treat_code
  //   console.log("*************",this.source_id)
  //   this.selecttreat = item.treat;
  //   this.ngForm.controls["treat_text"].setValue("");
  //   this.ngForm.controls['treat_group'].setValue(item.treat_code);
  //   this.selecttreat_treat_code = item.treat_code;
  //   this.treat_data = item.treat;
  //   this.selecttreat_group = "";
  //   this.treat_text_check = 'treat_group'
  //   console.log("*************&&",item)
  // }

  treat1Value(item: any) {
    this.source_id = item.bspc_id
   
    this.selecttreat = item.name;
    this.selecttreat_treat_code = item.bspc_id;
    this.treat_data = item.name;
    this.selecttreat_group = "";
    this.treat_text_check = 'treat_group'
    console.log("*************",this.source_id)
  }


  treatdatatext1() {
    this.treat1;
    console.log('this.treatSecond;', this.treat1);
  }
  treat2Value(item: any) {
    this.selecttreat1 = item.treats;
    this.ngForm.controls["treat1_text"].setValue("");
    this.ngForm.controls['treat1_group'].setValue(item.lab1_code);
    this.selecttreat1_treat_code = item.treat1_code;
    this.treats_data = item.treats;
    this.selecttreat1_group = "";
    this.ngForm.controls['treats'].setValue('')
    this.treat1_text_check = 'treat1_group'
  }
  treatdatatext2() {
    this.treatSecond1;
    console.log(' this.treatSecond1;', this.treatSecond1);
  }
  trClick2() {
    document.getElementById('treat1_group').click();
  }
  toggleSearch() {
    // Check if required fields are filled
    if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop_code'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select All Required Fields.</p>',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    
    // Proceed with search
    this.searchClicked = true;
    this.seedProcessRegisterDta = [];
    this.generateSampleSlipData.clear();
    // this.seedProcessRegisterData(null);
    this.generateSampleSlipVarietyData();

    
    // Auto select the "For Sending to STL" radio button and open the respective table
    this.selectedTable = '';
  this.isForSendingToSTLSelected = false;
 // this.isForSendingToSTLSelected = true;
  //  this.selectTable('table1');
  }

  selectTable(table: string) {
    this.selectedTable = table;
    this.seedProcessRegisterData(this.selectedTable);
    console.log("&&&&&&&&&&&&",this.selectedTable);
  }
 

  generateSampleSlip() {
    
  //  console.log("bspcid****************",this.source_id)
  //   console.log("****************",this.ngForm.controls['generateSampleSlipData'].value);
   
  if(this.selectedTable=='table2')
   {
      const radioselecttype="GOT";
   }
   else{
    const radioselecttype="STL";
   }
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
    let route = "add-generate-sample-slip-data";
    let data = [];
    let lot_no_array = [];
    let re_sample;
    for (let key of this.ngForm.controls['generateSampleSlipData'].value) {
      let radioselecttype;
      if(this.selectedTable=='table2')
        {
          radioselecttype="GOT";
        }
        else{
         radioselecttype="";
        }

      this.carry_over_status = key.get_carry_over ? key.get_carry_over : null;
      if (key && key.choose_sample && key.choose_sample == true) {
        lot_no_array.push({'lot_id':key.lot_id, 'status':(key && key.status ? key.status:null)});
      }
      if (key && key.choose_sample1 && key.choose_sample1 == true) {
        lot_no_array.push({'lot_id':key.lot_id, 'status':(key && key.status ? key.status:null)});
      }
      if(key.status == 're-sample'){
        re_sample = 're-sample'
      }
      data.push({
        "year": this.ngForm.controls['year'].value ? this.ngForm.controls['year'].value : "",
        "season": this.ngForm.controls['season'].value ? this.ngForm.controls['season'].value : "",
        "crop_code": this.ngForm.controls['crop_code'].value ? this.ngForm.controls['crop_code'].value : "",
        "variety_code": key.variety_code ? key.variety_code : "",
        "lot_no": key.lot_no ? key.lot_no : "",
        "class_of_seed": key.class_of_seed ? key.class_of_seed : "",
        "godown_no": key.godown_no ? key.godown_no : "",
        "stack_no": key.stack_no ? key.stack_no : "",
        "no_of_bags": key.no_of_bags ? key.no_of_bags : "",
        "total_processed_qnt": key.total_processed_qnt ? key.total_processed_qnt : "",
        "unique_code": key.unique_code ? key.unique_code : "",
        "sample_no": key.sample_no ? key.sample_no : null,
        "testing_lab": this.ngForm.controls['testing_lab_id'].value ? this.ngForm.controls['testing_lab_id'].value : "",
       "choose_sample": key.choose_sample ? key.choose_sample : '',
        "testing_type": radioselecttype,
      //  "choose_sample": this.checkboxChecked ? this.checkboxChecked : '',
        "chemical_treatment": key.chemical_treatment ? key.chemical_treatment : "No",
        "tests": key.tests ? key.tests : "",
        "lot_id": key.lot_id ? key.lot_id : null,
        "get_carry_over": key.get_carry_over ? key.get_carry_over : null,
        "variety_code_line": key.variety_code_line ? key.variety_code_line : null,
        "status": key.status ? key.status : null,
        "radio_value":this.selectedTable,
        "selected_bspc_id":this.source_id,
        "state_code":this.state_code

      });
    }
    this._productionCenter.postRequestCreator(route, { "generateSampleSlipData": data }, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.slip = true;
        Swal.fire({
          title: '<p style="font-size:25px;">Sampling Slips Generated Successfully.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        });

        let data = {
          year: this.ngForm.controls["year"].value ? this.ngForm.controls["year"].value : "",
          season: this.ngForm.controls["season"].value ? this.ngForm.controls["season"].value : "",
          crop_code: this.ngForm.controls['crop_code'].value ? this.ngForm.controls['crop_code'].value : "",
          carry_over_status: this.carry_over_status ? this.carry_over_status : null,
          lot_no_array: lot_no_array && lot_no_array.length ? lot_no_array : [],
          radioButtonType: this.selectedTable,
          re_sample:re_sample?re_sample:''
        };
        // console.log("jhsjdhgdh",data);
        this._productionCenter.generateSampleData = data ? data : [];
        this.route.navigate(['sample-slip-generate',this.selectedTable]);

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

  downloadSingleRowData(row: any) {
  
    let data = {
          year: this.ngForm.controls["year"].value || "",
          season: this.ngForm.controls["season"].value || "",
          crop_code: this.ngForm.controls['crop_code'].value || "",
          carry_over_status: this.carry_over_status || null,
          lot_no_array: [row.value.lot_id],

      };
      
      // Set the generated sample data
      this._productionCenter.generateSampleData = data || [];
      // Navigate to the sample slip generation route
      this.route.navigate(['sample-slip-generate',this.selectedTable]);


}

// state_select(data:any) {
//   this.selected_state = data.state_name;
//   this.ngForm.controls['state'].setValue(data.state_code)
//   this.stateList = this.stateListSecond
//   this.ngForm.controls['state_text'].setValue('',{emitEvent:false})
// }

state_select(item: any) {
  console.log('item.id====', item.id); 
  this.selectstate= item.state_name;
  this.state_code=item.state_code;
  this.getSeedTestingLaboratoryData(item.state_code);
  

  console.log("state_code*****************", this.state_code);
  console.log("selectid*****************", this.ngForm.controls['id']);
}



async getStateList() {
  console.log('hdsfh');
  this.masterService.getRequestCreatorNew("get-state-list")
    .subscribe((apiResponse: any) => {
      console.log('apiResponse', apiResponse);
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        let stateListData = [];
        apiResponse.EncryptedResponse.data.forEach(ele => {
          if (ele.state_name != null && ele.state_name != '' && ele.state_name != undefined) {
            stateListData.push(ele);
          }
        })
        this.stateList = stateListData;
        this.stateListSecond = this.stateList;

      }

 });

}




}
