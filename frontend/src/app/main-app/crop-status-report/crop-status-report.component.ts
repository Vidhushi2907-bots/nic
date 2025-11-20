

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
import { HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-crop-status-report',
  templateUrl: './crop-status-report.component.html',
  styleUrls: ['./crop-status-report.component.css']
})
export class CropStatusReportComponent implements OnInit {
  tableData: any[] = [];
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
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
  cropTypes = ['agriculture', 'horticulture'];

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
  fileName = 'crop-status-report.xlsx';
  cropType = [
    { id: 1, crop: 'Agriculture' },
    { id: 2, crop: 'Horticulture' },

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

  constructor(private http: HttpClient,private service: SeedServiceService, private breeder: BreederService, private masterService: MasterService, private productioncenter: ProductioncenterService, private fb: FormBuilder, private formBuilder: FormBuilder, private _productionCenter: ProductioncenterService, private route: Router,
    private renderer: Renderer2) {
    this.createForm();
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const datas = JSON.parse(BHTCurrentUser);
    this.user_id = datas.id;

  }



  ngOnInit(): void {
    this.getCropStatusReport();
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
    this.BspYearData();
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
      crop_type: [''],
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
    this.ngForm.controls['crop_type'].disable();
    this.ngForm.controls['search_click'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      this.ngForm.controls['crop_type'].reset('');
      this.ngForm.controls['season'].reset('');
      this.ngForm.controls['crop'].reset('');
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
        // this.ngForm.controls['crop'].reset('');

        // this.selectCrop = '';
        // this.ngForm.controls['crop'].enable();
        this.ngForm.controls['crop_type'].reset('');

        this.ngForm.controls['crop_type'].enable();
        this.ngForm.controls['search_click'].enable();

        // this.BspCropData(null);
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
        // this.ngForm.controls['search_click'].enable();
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
    let route = "get-bsp-proforma-one-year-data-report";
    let param = {
      "search": {
        form_type: 'report_1'
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.yearOfIndent = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }


  BspSeasonData() {
    let route = "get-bsp-proforma-one-season-data-report";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "form_type": 'report_1'
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
        "form_type": 'report_2'
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
      this.ngForm.controls["variety"].patchValue(event);
      this.getPageData();
    }
  }

  onCropTypeChange() {
    const cropType = this.ngForm.controls['crop_type'].value;
    if (cropType) { // Only call getPageData if cropType is not empty
      console.log("Selected Crop Type:", cropType);
      this.getPageData(1, { crop_type: cropType });
    } else {
      console.log("No crop type selected.");
    }
  }


  // getPageData(loadPageNumberData: number = 1, searchData: any = {}) {
  //   const filters = {
  //     search: {
  //       year: this.ngForm.controls['year'].value,
  //       season: this.ngForm.controls['season'].value,
  //       user_id: this.authUserId,
  //       crop_type: searchData.crop_type || this.ngForm.controls['crop_type'].value
  //     }
  //   };

  //   console.log("Filters applied:", filters);

  //   this.productioncenter.postRequestCreator("crop-status-reports", filters, null)
  //     .subscribe((apiResponse: any) => {
  //       if (apiResponse && apiResponse.EncryptedResponse.status_code === 200) {
  //         const rawData = apiResponse.EncryptedResponse.data || [];

  //         const processedData = rawData.map((item) => {
  //           const uniqueVarietyCodes = Array.from(new Set(item.variety_codes));
  //           const uniqueIndentQuantities: number[] = Array.from(new Set(item.indent_quantity));

  //           const totalIndentQuantity = uniqueIndentQuantities.reduce((sum, quantity) => sum + quantity, 0);

  //           const numberOfVarieties = uniqueVarietyCodes.length;

  //           return {
  //             ...item,
  //             total_indent_quantity: totalIndentQuantity,
  //             number_of_varieties: numberOfVarieties,
  //           };
  //         });

  //         console.log('Processed Data:', processedData);

  //         this.allData = processedData;

  //       } else if (apiResponse && apiResponse.EncryptedResponse.status_code === 201) {
  //         this.allData = [];
  //       }
  //     });
  // }


getPageData(loadPageNumberData: number = 1, searchData: any = {}) {
  const payload = {
    search: {
      year: this.ngForm.controls['year'].value,
      season: this.ngForm.controls['season'].value,
      user_id: this.authUserId,
      crop_type: searchData.crop_type || this.ngForm.controls['crop_type'].value
    }
  };

  this.http.post<any>('http://localhost:3006/ms-nb-006-production-center/api/crop-status-reports', payload)
    .subscribe(
      res => {
        console.log("API Response:", res);
        this.allData = res.data || [];
      },
      err => {
        console.error("API Error:", err);
      }
    );
}


  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  downloadPdf(userId, agency_id) {
    console.log('userId========', userId);

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
    if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value) {
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
  
  getCropStatusReport() {
    const payload = {
      // yahan apna request body likho
    };

    this.http.post<any>('http://localhost:3006/ms-nb-006-production-center/api/crop-status-reports', payload)
      .subscribe(
        res => {
          console.log("API Response:", res);
          this.tableData = res.EncryptedResponse?.data || [];  
        },
        err => {
          console.error("API Error:", err);
        }
      );
  }
}