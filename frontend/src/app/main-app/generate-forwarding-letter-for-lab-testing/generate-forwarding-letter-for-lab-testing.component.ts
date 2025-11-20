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
  selector: 'app-generate-forwarding-letter-for-lab-testing',
  templateUrl: './generate-forwarding-letter-for-lab-testing.component.html',
  styleUrls: ['./generate-forwarding-letter-for-lab-testing.component.css']
})
export class GenerateForwardingLetterForLabTestingComponent implements OnInit {
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
  reprint:boolean=false;
  gotreprint:boolean=false;
  dropdownSettings: IDropdownSettings;
  dropdownSettingsTests: IDropdownSettings;
  selectedItems = [];
  dropdownList = [];
  dropdownList1 = [];
  isDisabled: boolean = true;
  searchClicked: boolean = false;
  yearOfIndent: any;
  seasonlist: any;
  cropName: any;
  cropNameSecond: any;
  treat1:any;
  bspid:any;
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
  //   {
  //     treat: 'BSPC name',
  //     treat_code: 'A01012'
  //   },
  //   {
  //     treat: 'BSPC name1',
  //     treat_code: 'A010121'
  //   }
  // ];

  treatSecond = [
    {
      treat: 'BSPC name',
      treat_code: 'A01012'
    },
    {
      treat: 'BSPC name1',
      treat_code: 'A010121'
    }
  ];

  treat2 = [
    {
      treats: 'BSPC name',
      treat1_code: 'A01012'
    },
    {
      treats: 'BSPC name1',
      treat1_code: 'A010121'
    }
  ];

  treatSecond1 = [
    {
      treats: 'BSPC name',
      treat1_code: 'A0101211'
    },
    {
      treats: 'BSPC name1',
      treat1_code: 'A0101212'
    }
  ]

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
  runningNo: any;
  sppCode: any;
  stateList: any[];
  stateListSecond: any[];
  selectstate: any;
  stateSecond: any;
  isForSendingToSTLSelected: boolean;
  useragencttype: any;
  is_potato: boolean=false;
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
   
  constructor(private service: SeedServiceService, private fb: FormBuilder, private formBuilder: FormBuilder, private _productionCenter: ProductioncenterService,private masterService:MasterService, private route: Router) {
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
      state_text: new FormControl(''),
      gotbsp: new FormControl(''),
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
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.stateList = this.stateListSecond;
        let response = this.stateList.filter(x => x.state_name.toLowerCase().includes(newValue.toLowerCase()));
        this.stateList = response
      }
      else {
        this.stateList = this.stateListSecond
      }
    });
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
    });
    this.ngForm.controls['treat1_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.treat2 = this.treatSecond1
        let response = this.treat2.filter(x => x.treats.toLowerCase().includes(newValue.toLowerCase()))
        this.treat2 = response
      }
      else {
        this.treat2 = this.treatSecond1
      }
    });
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
      generate_sample_slip_id: [''],
      status: [''],
      consignment_no:[''],
      opacity:[false],
      unique_code_new: [''],
      selectagency:[''],
    })
  }
  get generateSampleSlipData(): FormArray {
    return this.ngForm.get('generateSampleSlipData') as FormArray;
  }

  ngOnInit(): void {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    this.sppCode = data.code;
    console.log(this.sppCode);
    this.fetchData();
    this.seedProcessRegisterYearData();
    // this.getSeedTestingLaboratoryData();
    this.getLabTestsData();
    //this.getStateList();
  

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
    let route = "get-generate-sample-forwarding-slip-year-data";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.yearOfIndent = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }
  generateSampleSlipVarietyData(table) {
    let route = "get-generate-sample-forwarding-slip-variety-data";
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      "testing_type":table,
      
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.dropdownList1 = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }
  
  getSeedTestingLaboratoryDataold(stateCode:any) {
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

  getSeedTestingLaboratoryData(stateCode:any) {
    let route = "get-forwording-lab-list-data";
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
    let route = "get-generate-sample-forwarding-slip-season-data";
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
    let route = "get-generate-sample-forwarding-slip-crop-data";
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
    let route = "get-generate-sample-forwarding-slip-data";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_code'].value,
        "variety_code_array": varietyCodeValue && varietyCodeValue.length ? varietyCodeValue : [],
        "seed_testing_lab_id": this.ngForm.controls['testing_lab_id'].value,
        "bspc_id":this.ngForm.controls['gotbsp'].value

      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seedProcessRegisterDataList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
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
  getFormattedTests(tests: any[]){
    // console.log("newtest",tests);
    // && tests.length
    return tests && tests
      .map(test => test.lab_test_name ? test.lab_test_name : 'NA')
      .join(', ')||[];
  }
  labdatatext1() {
    this.labSecond;
    console.log(' this.labSecond;', this.labSecond);
  }
  fetchDataValue(item) {
  // console.log("okkskjitem",item);
    let seedProcessRegisterDataArray = [];
    if (item == "Generated") {
      this.seedProcessRegisterDataList.forEach(ele => {
        if (!ele.generate_sample_forwarding_letter || ele.generate_sample_forwarding_letter['unique_code'] == null || ele.generate_sample_forwarding_letter['unique_code'] == '') {
        } else {
          seedProcessRegisterDataArray.push(ele)
        }
      });
      this.seedProcessRegisterDta = seedProcessRegisterDataArray;
    } else if (item == "Not Generated") {
      this.seedProcessRegisterDataList.forEach(ele => {
        if (!ele.generate_sample_forwarding_letter || ele.generate_sample_forwarding_letter['unique_code'] == null || ele.generate_sample_forwarding_letter['unique_code'] == '') {
          seedProcessRegisterDataArray.push(ele)
        }
      });
      this.seedProcessRegisterDta = seedProcessRegisterDataArray;
    } else {
      this.seedProcessRegisterDataList.forEach(ele => {
        seedProcessRegisterDataArray.push(ele)
      });
      this.seedProcessRegisterDta = seedProcessRegisterDataArray;
    }

    if (this.seedProcessRegisterDta && this.seedProcessRegisterDta.length) {
      for (let i = 0; i < this.seedProcessRegisterDta.length; i++) {
        this.addBspc();
        if(this.selectedTable === 'table2')
        {
          this.useragencttype = this.seedProcessRegisterDta[i].user.agency_detail.agency_name;
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['selectagency'].setValue(this.useragencttype);
         
        }
        
        if (this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_forwarding_letter && this.seedProcessRegisterDta[i].generate_sample_forwarding_letter.unique_code && this.seedProcessRegisterDta[i].generate_sample_forwarding_letter.unique_code) {
       
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['choose_sample'].setValue(true);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['choose_sample'].disable();
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['tests'].disable();
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['opacity'].setValue(true);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['unique_code_new'].setValue(this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_forwarding_letter && this.seedProcessRegisterDta[i].generate_sample_forwarding_letter.unique_code ? this.seedProcessRegisterDta[i].generate_sample_forwarding_letter.unique_code : null);
         
        }
        if (this.seedProcessRegisterDta[i].chemical_treatment == "No") {
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment1'].setValue("No");
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment1'].disable();
        } else {
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment1'].setValue("Yes");
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment'].setValue(this.seedProcessRegisterDta[i].chemical_treatment);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment'].disable();
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['chemical_treatment1'].disable();
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['unique_code'].setValue(this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_slip && this.seedProcessRegisterDta[i].generate_sample_slip.unique_code ? this.seedProcessRegisterDta[i].generate_sample_slip.unique_code : null);
          this.ngForm.controls['generateSampleSlipData']['controls'][i].controls['unique_code_new'].setValue(this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_forwarding_letter && this.seedProcessRegisterDta[i].generate_sample_forwarding_letter.unique_code ? this.seedProcessRegisterDta[i].generate_sample_forwarding_letter.unique_code : null);
         
        }
       // console.log("uniquecosdde*****",this.seedProcessRegisterDta[i].generate_sample_slip.unique_code)
        this.ngForm.controls['generateSampleSlipData']['controls'][i].patchValue({
          variety_code: this.seedProcessRegisterDta[i].variety_code,
          generate_sample_slip_id: this.seedProcessRegisterDta[i].id,
          variety_code_line: this.seedProcessRegisterDta[i].variety_code_line ? this.seedProcessRegisterDta[i].variety_code_line : null,
          variety_code_line_name: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].m_variety_line && this.seedProcessRegisterDta[i].m_variety_line.line_variety_name ? this.seedProcessRegisterDta[i].m_variety_line.line_variety_name : null,
          variety_name: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].m_crop_variety && this.seedProcessRegisterDta[i].m_crop_variety.variety_name ? this.seedProcessRegisterDta[i].m_crop_variety.variety_name : "NA",
          lot_no: this.seedProcessRegisterDta[i].lot_no,
          class_of_seed: this.seedProcessRegisterDta[i].class_of_seed,
          godown_no: this.seedProcessRegisterDta[i].godown_no,
          stack_no: this.seedProcessRegisterDta[i].stack_no,
          no_of_bags: this.seedProcessRegisterDta[i].no_of_bags,
          consignment_no: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_forwarding_letter && this.seedProcessRegisterDta[i].generate_sample_forwarding_letter.consignment_no ? this.seedProcessRegisterDta[i].generate_sample_forwarding_letter.consignment_no:'' ,
          total_processed_qnt: this.seedProcessRegisterDta[i].total_processed_qnt,
          tests: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].tests ? this.seedProcessRegisterDta[i].tests : null,
          unique_code: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].unique_code ? this.seedProcessRegisterDta[i].unique_code : null,
          unique_code_new: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].generate_sample_forwarding_letter && this.seedProcessRegisterDta[i].generate_sample_forwarding_letter.unique_code ? this.seedProcessRegisterDta[i].generate_sample_forwarding_letter.unique_code : null,
          
          sample_no: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].sample_no ? this.seedProcessRegisterDta[i].sample_no : null,
          lot_id: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].lot_id ? this.seedProcessRegisterDta[i].lot_id : null,
          get_carry_over: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].get_carry_over ? this.seedProcessRegisterDta[i].get_carry_over : null,
          m_seed_test_laboratory: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].m_seed_test_laboratory && this.seedProcessRegisterDta[i].m_seed_test_laboratory.lab_name ? this.seedProcessRegisterDta[i].m_seed_test_laboratory.lab_name : null,
          status: this.seedProcessRegisterDta && this.seedProcessRegisterDta[i] && this.seedProcessRegisterDta[i].status ? this.seedProcessRegisterDta[i].status : '',
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

    console.log('item.id====', item);
    // this.selectlab = item.lab_name;
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
    this.generateSampleSlipData.clear();
    this.seedProcessRegisterData(null);

  }
  cropNameValue(item: any) {
    console.log('item====', item);
    this.selectCrop = item.crop_name;
    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_code'].setValue(item.crop_code);
    this.selectCrop_crop_code = item.crop_code;
    this.crop_name_data = item.crop_name;
    this.selectCrop_group = "";
    // this.ngForm.controls['crop_name'].setValue('')
    this.crop_text_check = 'crop_group'
    if (item.crop_code == "H1101") {
      this.is_potato = false;  
    } else {
      this.is_potato = true;
    }
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
  treat1Value(item: any) {
   this.bspid =  item.bspc_id
    this.selecttreat = item.agency_name;
    // this.ngForm.controls["treat_text"].setValue("");
    this.ngForm.controls['gotbsp'].setValue(item.bspc_id);
    this.selecttreat_treat_code = item.bspc_id;
    this.treat_data = item.agency_name;
    this.selecttreat_group = "";
    this.treat_text_check = 'treat_group'
    console.log("ryguryguryi",this.ngForm.controls['gotbsp'].value);
    this.generateSampleSlipData.clear();
    this.seedProcessRegisterData(null);
    
    // console.log(item,"fjkddddddddddddd");
  }
  treatdatatext1() {
    this.treatSecond;
    console.log(' this.treatSecond;', this.treatSecond);
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
    if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop_code'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select All Required Fields.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    this.searchClicked = true;
    this.seedProcessRegisterDta = [];
    this.generateSampleSlipData.clear();
    this.getStateList();
    // this.getSeedTestingLaboratoryData()
    this.seedProcessRegisterData(null);
    // this.generateSampleSlipVarietyData();
    this.checkRunningNumber();
    this.selectstate = ''; // Clear selected state
    this.selectlab = '';   // Clear selected lab
    this.ngForm.controls['state_text'].reset(); // Reset state form control
    this.ngForm.controls['lab1_text'].reset();  // Reset lab form control
    // Auto select the "For Sending to STL" radio button and open the respective table
    this.selectedTable = '';
    this.isForSendingToSTLSelected = true;
    // this.selectTable('table1');
    this.getUserBspc();
}

    selectTable(table: string) {
    this.selectedTable = table;
    this.generateSampleSlipVarietyData(table);
    
    }

  checkRunningNumber() {
    let route = "get-check-running-no";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_code'].value,
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        let runningNumber = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
         
        if (runningNumber &&  runningNumber.running_no) {
          this.runningNo = runningNumber && runningNumber.running_no ? runningNumber.running_no : 0
        } else {
          this.runningNo = 0
        }

      }
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 201) {
        this.runningNo = 0
      }
    });
  }
  
  generateSampleForwardingSlip() {
    // console.log('this.runningNo', this.runningNo);
    // console.log('tabletype', this.selectedTable);
    // console.log('bspc', this.bspid);
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
    let route = "add-generate-sample-forwarding-slip-data";
    let data = [];
    let lot_no_array = [];
    console.log(this.runningNo,"running changes");
    let consignmentNo = this.ngForm.controls['season'].value + '/' + (this.ngForm.controls['year'].value - 2000) + '-' + ((this.ngForm.controls['year'].value - 2000) + 1) + '/' + (this.sppCode ? this.sppCode : '000') + '/' + (this.runningNo ? this.runningNo + 1 : 1);
     console.log('consignmentNo====', consignmentNo);
    for (let key of this.ngForm.controls['generateSampleSlipData'].value) {
      this.carry_over_status = key.get_carry_over ? key.get_carry_over : null;
      if (key && key.choose_sample && key.choose_sample == true) {
        lot_no_array.push(key.lot_id);
        // lot_no_array.push({'lot_id':key.lot_id, 'status':(key && key.status ? key.status:null)});
      }

      data.push({
        "generate_sample_slip_id": key.generate_sample_slip_id ? key.generate_sample_slip_id : null,
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
        'choose_sample': key.choose_sample ? key.choose_sample : '',
        "chemical_treatment": key.chemical_treatment ? key.chemical_treatment : "No",
        "tests": key.tests ? key.tests : "",
        "lot_id": key.lot_id ? key.lot_id : null,
        "get_carry_over": key.get_carry_over ? key.get_carry_over : null,
        "variety_code_line": key.variety_code_line ? key.variety_code_line : null,
        "consignment_no": consignmentNo ? consignmentNo : null,
        "running_number": this.runningNo ? this.runningNo + 1 : 1,
        "status": key && key.status ? key.status : null,
        "bspc_id":this.bspid,
        "table_type":this.selectedTable
      });
    }
    this._productionCenter.postRequestCreator(route, { "generateSampleForwardingSlipData": data }, null).subscribe(res => {
      let consignmentNo = this.ngForm.controls['season'].value + '/' + (this.ngForm.controls['year'].value - 2000) + '-' + ((this.ngForm.controls['year'].value - 2000) + 1) + '/' + (this.sppCode ? this.sppCode : '000') + '/' + (this.runningNo ? this.runningNo + 1 : 1);
      // console.log('consignmentNow====', consignmentNo);
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Forwarding Letter Generated Successfully.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        });
        this.checkRunningNumber();
        let data = {
          year: this.ngForm.controls["year"].value ? this.ngForm.controls["year"].value : "",
          season: this.ngForm.controls["season"].value ? this.ngForm.controls["season"].value : "",
          crop_code: this.ngForm.controls['crop_code'].value ? this.ngForm.controls['crop_code'].value : "",
          carry_over_status: this.carry_over_status ? this.carry_over_status : null,
          consignment_no: consignmentNo ? consignmentNo : null
          // lot_no_array: lot_no_array && lot_no_array.length ? lot_no_array : []
        };
        this._productionCenter.generateSampleData = data ? data : [];
        this.route.navigate(['forwarding-letter',this.selectedTable]);
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
    //   console.log("rowvalue",row)
   let consignmentNo = this.ngForm.controls['season'].value + '/' + (this.ngForm.controls['year'].value - 2000) + '-' + ((this.ngForm.controls['year'].value - 2000) + 1) + '/' + (this.sppCode ? this.sppCode : '000') + '/' + (this.runningNo ? this.runningNo + 1 : 1);
    console.log('row',row.controls.consignment_no.value);
    // consignment_no
    // return;
        let data = {
              year: this.ngForm.controls["year"].value ? this.ngForm.controls["year"].value : "",
              season: this.ngForm.controls["season"].value ? this.ngForm.controls["season"].value : "",
              crop_code: this.ngForm.controls['crop_code'].value ? this.ngForm.controls['crop_code'].value : "",
              carry_over_status: this.carry_over_status ? this.carry_over_status : null,
              lot_no_array: [row.value.lot_id],
              tabletype:this.selectedTable,
              // lot_no_array: [row.value.lot_id],
              consignment_no:row.controls.consignment_no.value
          
            };
            this._productionCenter.generateSampleData = data ? data : [];

            this.route.navigate(['forwarding-letter',this.selectedTable]);
           
    
    }
    async getStateListold() {
      // console.log('hdsfh');
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
            this.stateListSecond = stateListData;
    
          }
    
     });
    
    }

    async getStateList() {
      // console.log('hdsfh');
      let route = "get-forwording-state-list-data";
      let param = {
        "search": {
          "year": this.ngForm.controls['year'].value,
          "season": this.ngForm.controls['season'].value,
          "crop_code": this.ngForm.controls['crop_code'].value,
         }
      }
      this._productionCenter.postRequestCreator(route, param,null).subscribe(apiResponse => {
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
            this.stateListSecond = stateListData;
    
          }
    
     });
    
    }

    state_select(item: any) {
      // console.log('item.id====', item.id);
      this.selectstate= item.state_name;
      this.ngForm.controls['state_text'].setValue(item.state_name);
      this.getSeedTestingLaboratoryData(item.state_code);
      console.log("state_code*****************", item.state_code);
      console.log("selectid*****************", this.ngForm.controls['id']);
    }

    // getUserBspcold() {
    //   let route = "get-all-willing-bspc-list-data";
    //   let param = {
    //   }
    //   this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
    //     if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
    //       this.treat1 = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
    //       this.treatSecond = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
    //     }
    //   })
    // }

    getUserBspc() {
      let route = "get-forwording-bspc-list-data";
      let param = {
        "search": {
          "year": this.ngForm.controls['year'].value,
          "season": this.ngForm.controls['season'].value,
          "crop_code": this.ngForm.controls['crop_code'].value
        }
 }
      this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
        if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
          
          this.treat1 = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
          console.log("nggurgu****************", this.treat1);
          this.treatSecond = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        }
      })
    }

    labdatastate() {
      this.labSecond;
      console.log(' this.labSecond;', this.labSecond);
    }

}
