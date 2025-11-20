import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { Router } from '@angular/router';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-generate-breeder-seed-certificate',
  templateUrl: './generate-breeder-seed-certificate.component.html',
  styleUrls: ['./generate-breeder-seed-certificate.component.css']
})
export class GenerateBreederSeedCertificateComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm: FormGroup = new FormGroup([]);
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryVarietyData: any;
  datatodisplay = [];
  isSearch: boolean;
  isCrop: boolean;
  showTab: boolean;
  private _productionCenter: any;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []
  allData: any;
  dropdownSettings: IDropdownSettings;
  selectedItems = [];
  dropdownList1;
  dropdownList2;
  dropdownList3;
  isDisabled: boolean = true;
  yearOfIndent;
  seasonlist;
  Amount
  Bags
  Quantity
  Billno
  BillNo
  SPAlist;
  Indenterlist
  Varietylist;
  cropName;
  cropNameSecond;
  varietyCategories: any[];
  addVarietySubmission: any[];
  varietyList: any;
  dummyData: { variety_id: string; variety_name: string; indent_quantity: number; bsp2Arr: any[]; }[];
  selectCrop: any;
  selectCrop_group_code: any;
  selectlab_group_code: any;
  selectlab1_group_code: any;
  crop_name_data: any;
  lab_data: any;
  treat_data: any;
  selectCrop_group: string;
  crop_text_check: string;
  lab_text_check: string;
  lab1_text_check: string;
  treat_text_check: string;
  treat1_text_check: string;
  croupGroup: any;
  selectCrop_crop_code: any;
  selectedTable: string;
  dataToDisplay: any;
  dropdownLists: any;
  unit: any;
  AESKey: string = environment.AESKey;

  selectTable(table: string) {
    this.selectedTable = table;
  }
  constructor(private service: SeedServiceService, private fb: FormBuilder, private router: Router,
    private productionService: ProductioncenterService,
  ) {
    this.createForm();
  }
  openBillReceiptDialog(data, item, val, id): void {
    console.log('data=========>', data);
    let variety_code = data && data.variety_code ? data.variety_code : '';
    let indenter_id = item && item.user_id ? item.user_id : '';
    let spa_code = val && val.spa_user_id ? val.spa_user_id : '';
    let lifting_id = val && val.id ? val.id : '';
    let datas = localStorage.getItem('BHTCurrentUser');
    let localdata = JSON.parse(datas)
    let userId = localdata && localdata.id ? localdata.id : ''
    let param = {
      variety_code: variety_code,
      indenter_id: indenter_id,
      spa_code: spa_code,
      lifting_id: lifting_id
    }
    if (val && val.lifting_id) {
      const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id, userId }), this.AESKey).toString();
      const encryptedData = encodeURIComponent(encryptedForm);
      this.router.navigate(['/Breeder-Seed-Certificate-Download/' + encryptedData]);
      // this.productionService.postRequestCreator('save-generate-breeder-seed-certificate',param).subscribe(data=>{
      //   if(data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code==200){
      //   }
      // })
    } else {
      this.productionService.postRequestCreator('save-generate-breeder-seed-certificate', param).subscribe(data => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {

          const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id }), this.AESKey).toString();
          const encryptedData = encodeURIComponent(encryptedForm);
          this.router.navigate(['/Breeder-Seed-Certificate-Download/' + encryptedData]);
        }
      })
    }
  }

  placeholderText: string = '';
  createForm() {
    this.ngForm = this.fb.group({
      year: [''],
      season: [''],
      crop: [''],
      crop_text: [''],
      variety_code: [''],
      indentor: [''],
      spa: [''],
      bill: ['']

    })
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      this.ngForm.controls['variety_code'].setValue('', { emitEvent: false, onlySelf: true });
      this.ngForm.controls['indentor'].setValue('', { emitEvent: false, onlySelf: true });
      this.ngForm.controls['spa'].setValue('', { emitEvent: false, onlySelf: true })
      this.ngForm.controls['bill'].setValue('', { emitEvent: false, onlySelf: true })
      this.getSeason()
    })
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      this.ngForm.controls['variety_code'].setValue('', { emitEvent: false, onlySelf: true });
      this.ngForm.controls['indentor'].setValue('', { emitEvent: false, onlySelf: true });
      this.ngForm.controls['spa'].setValue('', { emitEvent: false, onlySelf: true })
      this.ngForm.controls['bill'].setValue('', { emitEvent: false, onlySelf: true })
      this.getCrop()
    })
    this.ngForm.controls['variety_code'].valueChanges.subscribe(newValue => {
      this.getGridData()
    })
    this.ngForm.controls['indentor'].valueChanges.subscribe(newValue => {
      this.getGridData()
    })
    this.ngForm.controls['spa'].valueChanges.subscribe(newValue => {
      this.getGridData()
    })
    this.ngForm.controls['bill'].valueChanges.subscribe(newValue => {
      this.getGridData()
    })
  }

  ngOnInit(): void {
    this.fetchData();

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
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  fetchData() {
    this.getYear()

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
  bsp2arr() {
    let temp = this.fb.group({
      filed_loc: ['', Validators.required],
      area_sown: ['', Validators.required],
      date_of_sowing: ['', Validators.required],
      quantity_of_sowning: [''],
      quantity_of_breedersown: [''],
      expected_date_inspection: [''],
      expected_date_harvest: [''],
      expected_producton: [''],
      inspected_area: [''],
      est_production: [''],
      harvest_date: [''],
      raw_seed_produced: [''],
      spp_name: [''],
    });
    return temp;
  }

  getItems(form) {
    return form.controls.bsp2Arr.controls;
  }

  addMore(i) {
    this.itemsArray.push(this.bsp2arr());
  }

  remove(rowIndex: number) {
    this.itemsArray.removeAt(rowIndex);
  }

  get itemsArray() {
    return <FormArray>this.ngForm.get('bsp2Arr');
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
    this.ngForm.controls['crop'].setValue(item.crop_code);
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
  getSeason() {
    const param = {
      search: {
        year: this.ngForm.controls["year"].value
      }
    }
    console.log(this.ngForm.controls, 'this.ngForm.controls["year"].value')
    this.productionService.postRequestCreator('get-lifting-data-season', param).subscribe(data => {
      this.seasonlist = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }
  getCrop() {
    const param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value
      }
    }
    this.productionService.postRequestCreator('get-lifting-data-crop', param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.cropName = res ? res : '';
      // console.log("crop*********************",this.cropName);
      this.cropNameSecond = this.cropName
    })
  }
  getYear() {
    this.productionService.postRequestCreator('get-lifting-data-year', null).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }
  getGridData() {
    let varity = this.ngForm.controls['variety_code'].value;
    let varityCode = []
    if (varity && varity.length > 0) {
      varity.forEach(el => {
        varityCode.push(el && el.item_id ? el.item_id : "")
      })
    }
    let indentor = this.ngForm.controls['indentor'].value;
    let indentorCode = []
    if (indentor && indentor.length > 0) {
      indentor.forEach(el => {
        indentorCode.push(el && el.item_id ? el.item_id : "")
      })
    }
    let spa = this.ngForm.controls['spa'].value;
    let spaCode = []
    if (spa && spa.length > 0) {
      spa.forEach(el => {
        spaCode.push(el && el.item_id ? el.item_id : "")
      })
    }
    const param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value,
        variety_code: varityCode && varityCode.length > 0 ? varityCode : "",
        indentor: indentorCode && indentorCode.length > 0 ? indentorCode : '',
        spa: spaCode && spaCode.length > 0 ? spaCode : '',
        bill: this.ngForm.controls["bill"].value,
      }
    }
    this.productionService.postRequestCreator('get-lifting-data-print', param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.filterData ? data.EncryptedResponse.data.filterData : '';
      // let res2 = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.liftingData ? data.EncryptedResponse.data.liftingData : '';

      this.dataToDisplay = res;
      if (this.dataToDisplay && this.dataToDisplay.length > 0) {
        this.dataToDisplay.forEach(el => {
          el.spaData = []
          el.toatalBags = []
        })
      }
      if (this.dataToDisplay && this.dataToDisplay.length > 0) {
        // if (res2 && res2.length > 0) {
        //   res2.forEach(values => {
        //     this.dataToDisplay.forEach(el => {
        //       el.indentor.forEach(val => {
        //         val.spa.forEach(item => {
        //           if (item.id == values.litting_seed_details_id) {
        //             el.toatalBags.push(values)
        //           }
        //         })
        //       })
        //     })
        //   })
        // }
        this.dataToDisplay.forEach(el => {
          // el.spaData=[]
          el.indentor.forEach(val => {
            val.spa.forEach(item => {
              item.spaBags = []
              el.spaData.push(val)
            })
          })
        })
      }
      // this.dataToDisplay.forEach(variety => {
      //   variety.indentor.forEach(indentor => {
      //     indentor.spa.forEach(spaObj => {
      //       spaObj.spas = []
      //       const matchingBags = res2.filter(bagObj => bagObj.litting_seed_details_id === spaObj.id);
      //       spaObj.spaBags = matchingBags;
      //     });
      //   });
      // });
      this.dataToDisplay.forEach(variety => {
        variety.indentor.forEach(indentor => {
          indentor.spa.forEach(spaObj => {
            spaObj.spaBags.forEach((val => {
              spaObj.spas.push({ bag_weight: val.bag_weight, no_of_bags: val.no_of_bags })
            }))
          });
        });
      });
      console.log('res=================>', this.dataToDisplay)
    })
  }

  onSearchClick() {
    this.getGridData()
    this.getVariety();
    this.getIndentor();
    this.getSpaName();
    this.getBillNo();
  }
  getVariety() {
    const param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value
      }
    }
    this.productionService.postRequestCreator('get-lifting-data-variety', param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.dropdownLists = res
    })
  }
  getIndentor() {
    const param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value
      }
    }
    this.productionService.postRequestCreator('get-lifting-data-indentor', param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.dropdownList2 = res
    })
  }
  getSpaName() {
    const param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value
      }
    }
    this.productionService.postRequestCreator('get-lifting-data-spa', param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.dropdownList3 = res
    })
  }
  getBillNo() {
    const param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value
      }
    }
    this.productionService.postRequestCreator('get-lifting-data-bill-number', param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.BillNo = res
    })
  }
  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }
  // openBillReceiptDialog(): void {
  //   this.router.navigate(['/Bill-Receipt']);
  // }

}
