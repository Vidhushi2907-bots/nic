import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { MasterService } from 'src/app/services/master/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-variety-price-list',
  templateUrl: './variety-price-list.component.html',
  styleUrls: ['./variety-price-list.component.css']
})
export class VarietyPriceListComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm: FormGroup = new FormGroup([]);
  isSearch: boolean = false;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []
  allData: any;
  dropdownSettings: IDropdownSettings;
  selectedItems = [];
  dropdownList = [];
  dropdownList1 = [];
  isDisabled: boolean = true;
  yearOfIndent = [
    {
      'year': '2026-27',
      'value': '2026'
    },
    {
      'year': '2025-26',
      'value': '2025'
    },
    {
      'year': '2024-25',
      'value': '2024'
    },
    {
      'year': '2023-24',
      'value': '2023'
    },
    {
      'year': '2022-23',
      'value': '2022'
    },
    {
      'year': '2021-22',
      'value': '2021'
    }
  ]
  seasonlist = [
    {
      season: 'Kharif',
      season_code: 'K'
    },
    {
      season: 'Rabi',
      season_code: 'R'
    },
  ];
  cropName: any;
  cropNameSecond: any;
  variety: any;
  varietyPrice = [
    {
      crop_name: "Barley(JAU)",
      variety_name: "REKHA (BCU-73)",
      parental_line: "N/A",
      valid_form: "Mar 13, 2024, 3:21:41 PM",
      per_quintal: "500"
    },
    {
      crop_name: "Barley(JAU)",
      variety_name: "REKHA (BCU-73)",
      parental_line: "N/A",
      valid_form: "Mar 13, 2024, 3:21:41 PM",
      per_quintal: "500"
    },
    {
      crop_name: "Barley(JAU)",
      variety_name: "REKHA (BCU-73)",
      parental_line: "N/A",
      valid_form: "Mar 13, 2024, 3:21:41 PM",
      per_quintal: "500"
    },
    {
      crop_name: "Barley(JAU)",
      variety_name: "REKHA (BCU-73)",
      parental_line: "N/A",
      valid_form: "Mar 13, 2024, 3:21:41 PM",
      per_quintal: "500"
    }
  ]

  varietyList: any;
  selectCrop: any;
  selectVariety: any;
  crop_name_data: any;
  crop_text_check: string;
  lab_text_check: string;
  lab1_text_check: string;
  treat_text_check: string;
  treat1_text_check: string;
  croupGroup: any;
  selectCrop_crop_code: any;
  varietySecond: any;
  variety_code: any;
  varietyLine: any;
  varietyLineSecond: any;
  isEdit: boolean = false;
  constructor(private service: SeedServiceService, private fb: FormBuilder, private _masters: MasterService, private _productionCenter: ProductioncenterService) {
    this.createForm();
  }

  createForm() {
    this.ngForm = this.fb.group({
      id: new FormControl(''),
      year: new FormControl('', [Validators.required]),
      season: new FormControl('', [Validators.required]),
      cropName: new FormControl(''),
      crop_name: new FormControl('', [Validators.required]),
      per_quintal_mrp: new FormControl('',),
      line_variety: new FormControl(''),
      crop_text: new FormControl(''),
      variety: new FormControl('', [Validators.required]),
      packag_data: this.fb.array([
      ]),
    })
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['line_variety'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['season'].enable();
      }
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.cropName = this.cropNameSecond
        let response = this.cropName.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))
        this.cropName = response
        // alert("123");

      }
      else {

        this.cropName = this.cropNameSecond
        this.selectVariety = ""
        this.ngForm.controls["variety"].setValue("");
      }
    });
    this.ngForm.controls['variety'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getParentalLineData(newValue);
        this.getPageData();
        this.variety = this.varietySecond
        let response = this.variety.filter(x => x.variety_name.toLowerCase().includes(newValue.toLowerCase()))
        this.variety = response
      }
      else {
        this.variety = this.varietySecond
      }
    });
  }
  packagePriceForm(): FormGroup {
    return this.fb.group({
      per_quintal_mrp: ['', [Validators.required]],
      packag_size: ['', [Validators.required]],
      // per_quintal_price:['',[Validators.required]],
    })
  }

  get packag_data(): FormArray {
    return this.ngForm.get('packag_data') as FormArray;
  }
  ngOnInit(): void {
    this.fetchData();
    this.addPackageData();
  }
  fetchData() {
    // this.getPageData();
  }



  getCropData() {
    let route = "get-crop-list";
    this._masters.postRequestCreator(route).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.cropName = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        this.cropNameSecond = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    })
  }

  getVarietyData(crop_code) {
    let route = "get-variety-list";
    let param = {
      "search": {
        "crop_code": crop_code,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,

      }
    }
    this._productionCenter.postRequestCreator(route, param,).subscribe(res => {
      // this.cropNameSecond
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.variety = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        this.varietySecond = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      } else {
        this.variety = [];
        this.varietySecond = []
      }
    })
  }

  getParentalLineData(variety_code) {
    console.log('variety_code==', variety_code);
    let route = "get-variety-line-list";
    let param = {
      "search": {
        "variety_code": variety_code ? variety_code : '',
        "crop_code": this.ngForm.controls['crop_name'].value,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.ngForm.controls['line_variety'].setValue('');
        this.varietyLine = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        this.varietyLineSecond = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        if (this.varietyLine && this.varietyLine.length) {
          this.ngForm.controls['line_variety'].enable();
        } else {
          this.ngForm.controls['line_variety'].disable();
        }
      } else {
        this.ngForm.controls['line_variety'].disable();
      }
    })
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    if (!this.ngForm.controls['year'].value && !this.ngForm.controls['season'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Select All Required Filed.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    this.isSearch = true;
    this.getCropData();
    this._productionCenter.postRequestCreator("get-variety-price-list", {
      page: loadPageNumberData,
      pageSize: 50,
      search: {
        "year": this.ngForm.controls['year'].value ? this.ngForm.controls['year'].value : '',
        "season": this.ngForm.controls['season'].value ? this.ngForm.controls['season'].value : '',
        "crop_code": this.ngForm.controls['crop_name'].value ? this.ngForm.controls['crop_name'].value : '',
        "variety_code": this.ngForm.controls['variety'].value ? this.ngForm.controls['variety'].value : ''
      }
    }, null).subscribe((apiResponse: any) => {
      console.log(apiResponse);
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.filterPaginateSearch.itemListPageSize = 4;
        console.log(apiResponse);
        this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
        if (this.allData === undefined) {
          this.allData = [];
        }
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, 8, true);
        this.initSearchAndPagination();
      } else {
        this.allData = [];
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
  editData(data) {
    // console.log("jrgui",data)
    // console.log("jrgui",data)
    this.getVarietyData(data.crop_code);
    this.ngForm.controls['year'].setValue(data.year);
    this.ngForm.controls['id'].setValue(data.id);
    this.ngForm.controls['season'].setValue(data.season);
    this.ngForm.controls['crop_name'].setValue(data.crop_code);
    this.ngForm.controls['crop_text'].setValue(data.crop_name);
    this.selectCrop = data.crop_name;
    this.selectCrop_crop_code = data.crop_cod;
    this.ngForm.controls['variety'].setValue(data.variety_code);
    // this.ngForm.controls['variety_name'].setValue(data.variety_code);
    this.selectVariety = data.variety_name;

    // this.ngForm.controls['line_variety'].setValue('');
    this.ngForm.controls['per_quintal_mrp'].setValue(data.per_quintal_mrp);
    // this.ngForm.controls['packag_data'].setValue(data.package_data);
    if (data.package_data && data.package_data.length) {
      this.packag_data.clear();
      for (let i = 0; i < data.package_data.length; i++) {
        this.addPackageData(); this.ngForm.controls['packag_data']['controls'][i].patchValue({
          packag_size: data && data.package_data && data.package_data[i] && data.package_data[i]['packag_size'] ? data.package_data[i]['packag_size'] : '',
          per_quintal_mrp: data && data.package_data && data.package_data[i] && data.package_data[i]['per_quintal_mrp'] ? data.package_data[i]['per_quintal_mrp'] : ''
        });
      }
    }

    this.isEdit = true;
    // this.save(null,data)
  }

  clear() {
    this.packag_data.clear();
    this.addPackageData();
    // this.ngForm.controls['year'].setValue('');
    this.isEdit = false;
    this.ngForm.controls['crop_name'].setValue('');
    this.ngForm.controls['crop_text'].setValue('');
    this.selectCrop = '';
    this.selectVariety = '';
    this.selectCrop_crop_code = ''
    this.ngForm.controls['variety'].setValue('');
    this.ngForm.controls['line_variety'].setValue('');
    this.ngForm.controls['per_quintal_mrp'].setValue('');
  }
  hasDuplicatePackingSize(): boolean {
    const sizes = this.packag_data.controls.map(control => control.get('packag_size')?.value);
    return new Set(sizes).size !== sizes.length; // If Set size is different, duplicates exist
  }
  save(data) {
    
    if (this.hasDuplicatePackingSize()) {
      Swal.fire({
        title: '<p style="font-size:25px;">Duplicate Packing Size (Kg) detected. Please enter unique values.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }

    if (this.ngForm.invalid) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Fill All Required Field.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    let type;
    if (this.isEdit) {
      type = "edit";
    } else {
      type = ''
    }
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let UserId = datas.id
    let route = "add-variety-price-list";
    console.log(data.value.packag_data, ' data.value.packag_data')
    let formData = {
      id: data && data.value && data.value.id ? data.value.id : '',
      year: data && data.value && data.value.year ? data.value.year : '',
      season: data && data.value && data.value.season ? data.value.season : '',
      crop_code: data && data.value && data.value.crop_name ? data.value.crop_name : '',
      variety_code: data && data.value && data.value.variety ? data.value.variety : '',
      variety_line_code: data && data.value && data.value.line_variety ? data.value.line_variety : '',
      // per_quintal_mrp: data && data.value.per_quintal_mrp ? data.value.per_quintal_mrp : '',
      type: type ? type : '',
      packag_data: data && data.value && data.value.packag_data ? data.value.packag_data : [],
      user_id: UserId
      // valid_from:data.value.year
      // is_active:data.value.year
      // created_at
      // updated_at
    }

    this._productionCenter.postRequestCreator(route, formData, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code == 200) {
        if (this.isEdit) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Update Successfully.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })
        } else {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Save Successfully.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })
        }
        this.clear();
        this.getPageData();
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Not Saved.</p>',
          icon: 'warning',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
        this.getPageData();
      }
    })
  }

  addPackageData() {
    this.packag_data.push(this.packagePriceForm());
  }

  removePackageData(value: number) {
    this.packag_data.removeAt(value);
  }

  cgClick() {
    document.getElementById('crop_group').click();
  }
  cropNameValue(item: any) {

    this.selectCrop = item.crop_name;
    this.ngForm.controls["crop_text"].setValue("");
    this.selectCrop_crop_code = item.crop_code;
    this.getVarietyData(item.crop_code);
    this.crop_name_data = item.crop_name;
    this.ngForm.controls['crop_name'].setValue(item.crop_code)
    this.getPageData()
  }
  // varietyNameValue(item: any) {

  //   this.selectVariety = item.variety_name;
  //   this.ngForm.controls["variety"].setValue("");
  //   this.variety_code = item.variety_code;

  //   this.ngForm.controls['variety_name'].setValue(item.variety_code)
  //   this.getPageData()
  // }
  varietyNameValue(data: { variety_code: string, variety_name: string }) {
    this.selectVariety = data.variety_name;
    this.ngForm.controls['variety'].setValue(data.variety_code);
    this.ngForm.controls['variety_name'].setValue(data.variety_code);
    this.variety_code = data.variety_code;
    this.getPageData();
  }

  cropdatatext() {
    this.cropNameSecond;
    console.log(' this.cropNameSecond;', this.cropNameSecond);
  }

  varietydatatext() {
    this.varietySecond;
    console.log(' this.varietySecond;', this.varietySecond);
  }



  update() {

  }
}
