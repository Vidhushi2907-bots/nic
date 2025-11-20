
import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { MasterService } from 'src/app/services/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { BspTwoSecondtComponent } from '../bsp-two-second/bsp-two-second';

@Component({
  selector: 'app-bsp-ii-status-report',
  templateUrl: './bsp-ii-status-report.component.html',
  styleUrls: ['./bsp-ii-status-report.component.css']
})
export class BspIiStatusReportComponent implements OnInit { 
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  @ViewChild(BspTwoSecondtComponent) BspTwoSecondtComponent!: BspTwoSecondtComponent; 
  ngForm: FormGroup = new FormGroup([]);
  isSearch: boolean;
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryVarietyData: any;
  datatodisplay = [];
  visibleTable: boolean = false;
  selectVariety: any;
  varietyListSecond: any[];
  isCrop: boolean;
  showTab: boolean;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = [];
  dropdownSettings: IDropdownSettings = {};

  dropdownList = [];
  allData: any;
  isDisabled: boolean = true;
  searchClicked = false;

  varietyCategories: any[];
  varietyList: any;
  crop_name_data: any;
  lab_data: any;
  croupGroup: any;
  selectCrop_crop_code: any;
  formGroup: FormGroup;
  cropDataList: any;
  variety_code: any;
  variety_line_code: any;
  varietyData;
  varietyPricelist = [];
  perUnitPrice: number;
  unit: string;
  reasonData: any;
  variety_name: any;
  varietyOptions = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },

  ];
  selectCrop: string;
  selectCrop_group: string;
  crop_text_check: string;
  cropName: any;
  cropNameSecond: any;
  yearOfIndent: any;
  seasonlist: any;
  submitted: boolean;
  authUserId: any;
  user_id: any;
  cropListSecond: any;
  productionType: string;
  isDisableNormalReallocate: boolean;
  isDisableNormal: boolean;
  isDisableDelay: boolean;

  constructor(private service: SeedServiceService, private breeder: BreederService, private masterService: MasterService, private productioncenter: ProductioncenterService, private fb: FormBuilder, private formBuilder: FormBuilder, private _productionCenter: ProductioncenterService, private route: Router,
    private renderer: Renderer2) {
    this.createForm();
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const datas = JSON.parse(BHTCurrentUser);
    this.user_id = datas.id;

  }



  ngOnInit(): void {

    // Ensure the ViewChild is initialized here
    // console.log('Child component:', this.bspTwoSecondtComponent); 
    this.dropdownSettings = {
      idField: 'variety_code',
      textField: 'variety_name',
      // enableCheckAll: false,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      enableCheckAll: true,
    };
    // this.getPageData();
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    this.authUserId = data.id;
    // this.BspYearData();
    this.service.bsp3rdReportData = [];
    let datas = this.service.bsp3rdReportData2;
    console.log(datas, 'datasdatas')
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: [''],
      season: [''],
      cropName: [''],
      crop_text: [''],
      crop: [''],
      search_click: [''],
      variety: [''],
      variety_code: [''],
      variety_line_code: [''],
      crop_code: [''],
      variety_array: [''],
      inventoryItems: this.fb.array([
        // this.inventoryItemsForms()
      ]),
    })

    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop'].disable();
    this.ngForm.controls['search_click'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      this.ngForm.controls['crop'].reset('');
      this.ngForm.controls['season'].reset('');
      this.ngForm.controls['variety'].reset('');
      this.selectCrop = '';
      this.variety_code = ''
      this.selectCrop = "";
      if (newValue) {
        this.ngForm.controls['season'].enable();
        this.BspSeasonData();
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop'].reset('');
        this.selectCrop = '';
        this.ngForm.controls['crop'].enable();
        this.BspCropData(null);
      }
    });

    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropName = this.cropNameSecond
        let response = this.cropName.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))

        this.cropName = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.BspCropData(this.ngForm.controls['season'].value)
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      this.selectVariety = '';
      if (newvalue) {
        this.ngForm.controls['search_click'].enable();
        // this.getVarietyData();
      }
    });

    this.ngForm.controls['variety'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.getPageData();
      }
    });

  }


  onVarietySelect(item: any) {
    console.log('Variety selected:', item);
  }

  onVarietySelectAll(items: any) {
    console.log('All varieties selected:', items);
  }

  BspYearData() {
    let route = "get-bsp-two-performa-year-data-report";
    let param = {
      "search": {
        form_type: 'report_2',
        production_type: this.productionType 
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.yearOfIndent = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }
  // generateSampleSlipVarietyData() {
  //   let route = "get-generate-sample-slip-variety-data";
  //   let param = {
  //     "year": this.ngForm.controls['year'].value,
  //     "season": this.ngForm.controls['season'].value,
  //     "crop_code": this.ngForm.controls['crop_code'].value,
  //   }
  //   this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
  //     if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
  //       this.dropdownList1 = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
  //     }
  //   });
  // }

  BspSeasonData() {
    let route = "get-bsp-two-performa-season-data-report";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "form_type": 'report_2',
        production_type: this.productionType 
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seasonlist = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }

  BspCropData(newData) {
    let route = "get-bsp-two-performa-crop-data-report";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value ? this.ngForm.controls['season'].value : newData ? newData : '',
        "form_type": 'report_2',
        production_type: this.productionType 
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
  BspVarietyData() {
    this.ngForm.controls['variety'].patchValue(''); // Reset the form control value
    const route = "get-variety-data";
    const param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      user_id: this.authUserId // Ensure user_id is correct
    };

    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.status === 200) {
        this.varietyData = data.data || [];

        // Mapping the data to get variety_code and variety_name correctly
        this.varietyData = this.varietyData.map(item => ({
          variety_code: item.variety_code,
          variety_name: item.m_crop_variety.variety_name // Accessing variety_name inside m_crop_variety
        }));
      }
    });
  }


  selcetAll(event) {
    if (event && event.length > 0) {
      this.ngForm.controls["variety"].patchValue(event);
      this.getPageData();
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
    this.BspYearData();
  }
  resetRadioBtn() {
    window.location.reload();
    this.productionType = ""
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    let varietyCodeArr = [];

    if (this.ngForm.controls["variety"].value) {
      this.ngForm.controls["variety"].value.forEach(ele => {
        varietyCodeArr.push(ele.variety_code);
      });
    }

    const filters = {
      "search":
      {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop_code'].value,  // Ensure crop_code is correct here
        // variety_code_arr: varietyCodeArr,
        user_id: this.authUserId,
        production_type: this.productionType 
      }
    };

    this.productioncenter.postRequestCreator("bsp-two-status-reports", filters, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse.status_code === 200) {
          this.allData = apiResponse.EncryptedResponse.data || [];
          
          console.log('allData2========',this.allData);
          this.allData = this.allData.map(item => ({
            bspcCode: item.code,
            bspcName: item.name,
            agency_id:item.agency_id,
            status: item.status,
            user_id:item.user_id,
            submissionDate: this.formatDate(item.submit_date) // Format the date to DD/MM/YYYY
          }));

          // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.total, true);
          // this.initSearchAndPagination();
        } else if (apiResponse && apiResponse.EncryptedResponse.status_code === 201) {
          this.allData = [];
        }
      });

  }
  
  downloadPdf(userId,agency_id) {
    console.log('userId========',userId);
      var param = {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop_code'].value,
        user_id: userId,
      };
      let param1 = { 
        agency_id: this.allData[0].agency_id,
      }; 
       
      console.log("users data===",param);
      console.log("users data1===",param1);
      
      // this.bspTwoSecondtComponent.ngOnInit();
      // Call the child component's generatePdf method
      if (this.BspTwoSecondtComponent) {
        // this.BspTwoSecondtComponent.getQr(param);
        this.BspTwoSecondtComponent.getUserData(param);
      } else {
        console.error('Child component reference is not available yet');
      }
      console.log("users ggggg1==="); 
      // this.bspTwoSecondtComponent.getUserData(param1);
      // this.bspTwoSecondtComponent.getCrop(param);
      // this.BspTwoSecondtComponent.getQr(param);

      this.BspTwoSecondtComponent.getMasterBspReportData(null,null,param);
      // this.bspTwoSecondtComponent.getBspcTeamData(null,null,param); 
  }


  // Helper function to format date to DD/MM/YYYY
  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
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

  cropNameValue(item: any) {
    this.selectCrop = item.crop_name;
    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_code'].setValue(item.crop_code);
    this.selectCrop_crop_code = item.crop_code;
    this.crop_name_data = item.crop_name;
    this.selectCrop_group = "";
    this.getUnit(item.crop_code)
    // this.ngForm.controls['crop_name'].setValue('')
    this.crop_text_check = 'crop_group'
  }
  cropdatatext() {
    this.cropNameSecond;
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
    this.getPageData()
  }

  getUnit(item) {
    let value = this.ngForm.controls['crop_code'].value && (this.ngForm.controls['crop_code'].value.slice(0, 1)) == 'A' ? 'Qt' : 'Kg';
    this.unit = value
    return value
  }

}