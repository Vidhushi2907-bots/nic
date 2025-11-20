import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { Router } from '@angular/router';
import { ProductioncenterService } from '../services/productionCenter/productioncenter.service';
import { checkDecimal, onlyNumberKey } from '../_helpers/utility';

@Component({
  selector: 'app-intake-verification',
  templateUrl: './intake-verification.component.html',
  styleUrls: ['./intake-verification.component.css']
})
export class IntakeVerificationComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  isAccept: boolean = false;
  isSearch: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings2: IDropdownSettings = {};
  submitted = false;
  selectedSeason: string = '';
  isReject = false;
  bagsReceived: number = 0;
  today = new Date();
  currentYear = this.today.getFullYear();
  yearData;
  yearDataofStack = []
  cropData;
  yearDataStack = [];
  seaonstack = [
    {
      'season': 'Kharif',
      'season_code': 'K'
    },
    {
      'season': 'Rabi',
      'season_code': 'R'
    },
  ]
  varietyData;
  tableData

  croplistSecond;
  selectCrop: any;
  unit: string;
  seasonlist: any;
  typeofSeed = [
    {
      name: 'Raw Seed (RS)',
      id: 1
    },
    // {
    //   name: 'Processed Seed (PS)',
    //   id: 2
    // },
  ]
  bagMarkData: any;
  investharvestid: any;
  editData: boolean;
  stackNo: number;
  bagMarkDataofInvest: any;
  investVerifyStackComposition: any;
  verifyid: any;
  clearDataValue = false;
  stackexist: boolean;
  varietyList: any;
  bagNO: any;
  bagError: boolean;
  classofSeedHarvested: string;
  lotNo: any;
  dataVerify: any;
  idofharvestAccept: any;
  provisonal_lot: any[];
  range_data;

  constructor(private service: SeedServiceService, private breeder: BreederService, private fb: FormBuilder, private route: Router, private productionService: ProductioncenterService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.fetchData()
  }
  fetchData() {
    this.getYearData();
    this.getStackYearData();

    // this.getBagMarkData();

    this.dropdownSettings = {
      idField: 'id',
      textField: 'bags',
      enableCheckAll: true,
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      itemsShowLimit: 1,

      limitSelection: -1,
    };
    this.dropdownSettings2 = {
      idField: 'variety_code',
      textField: 'display_text',
      enableCheckAll: true,
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      itemsShowLimit: 1,

      limitSelection: -1,
    };

    console.log(this.yearDataofStack)
  }
  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      bspc: ['',],
      variety: [''],
      variety_code: [''],
      plot_code: [''],
      parental_line: [''],
      bag_number: [''],
      bag_marka: [''],
      seed_quantity: [''],
      received_quantity: ['', [Validators.required]],
      godown_no: ['', [Validators.required]],
      stack_no: [''],
      crop_text: [''],
      showstackNo: [''],
      variety_level_2: [''],
      harvestVerify: this.fb.array([
        this.harverInvest(),
      ]),
    });
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['bspc'].disable();
    this.ngForm.controls['variety'].disable();
    this.ngForm.controls['plot_code'].disable();
    this.ngForm.controls['parental_line'].disable();
    this.ngForm.controls['bag_number'].disable();
    this.ngForm.controls['bag_marka'].disable();
    this.ngForm.controls['seed_quantity'].disable();

    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['bspc'].disable();
        this.selectCrop = '';
        this.ngForm.controls['crop'].reset('');
        this.ngForm.controls['season'].reset('');
        this.ngForm.controls['bspc'].reset('');
        this.ngForm.controls['season'].markAsUntouched();
        this.isAccept = false;
        this.getSeasonData();
        this.clearData();
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['bspc'].enable();
        this.selectCrop = '';
        this.ngForm.controls['crop'].enable();
        this.selectCrop = '';
        this.ngForm.controls['crop'].reset('');
        this.isAccept = false;
        this.getCropData();
        this.clearData();
        // this.ngForm.controls['bspc'].reset('');
        // getCrop();
      }
    });

    this.ngForm.controls['bspc'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.selectCrop = '';
        this.ngForm.controls['crop'].reset('');
        // getCrop();
      }
    });
    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        if (newvalue.slice(0, 1) == "A") {
          this.unit = "Qt";
        } else {
          this.unit = "Kg";
        }
        this.isAccept = false;
        this.clearData();
        // getVariety();
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
        // this.getCropData()
      }
    });
    //variety_level_2
    this.ngForm.controls['variety_level_2'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.getPageFormData();
        // getVariety();
      }
    });
  }

  crop(item: any) {
    this.selectCrop = item && item.crop_name ? item.crop_name : ''
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropData = this.croplistSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
  }

  cClick() {
    document.getElementById('crop').click();
  }

  saveData(data: any) {
    this.submitted = true;
    if (this.ngForm.invalid) {
      {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Fill The Form Properly.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
        return;
      }
    }
    else {
      let harvest = this.ngForm.value && this.ngForm.value.harvestVerify ? this.ngForm.value.harvestVerify : '';
      if (harvest && harvest.length > 0) {
        for (let key in harvest) {
          if (harvest[key].season == '' || harvest[key].stack == ''
            || harvest[key].year == '' || harvest[key].type_of_seed == ''
            || harvest[key].bag_marka == '' || harvest[key].bag_marka.length < 1
            || harvest[key].godown_no == '' || this.bagError
            || !this.ngForm.controls['received_quantity'].value || !this.ngForm.controls['godown_no'].value
          ) {
            Swal.fire({
              title: '<p style="font-size:25px;">Please Fill The Form Properly.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#B64B1D'
            })
            return;

          }
        }
      }
    }
    let param = data;
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData);
    let UserId = datas.id;
    param.user_id = UserId;
    param.invest_harvesting_id = this.investharvestid;
    param.lot_num = this.lotNo;
    param.range_data = this.provisonal_lot;
    console.log(this.range_data, 'this.range_data')
    if (this.dataVerify) {
      this.dataVerify.qty_recieved = this.ngForm.controls['received_quantity'].value
      function dynamicConversion(a) {
        if (a) {
          // Check if 'a' is a float (has a decimal point)
          if (a.includes('.') || parseFloat(a) % 1 !== 0) {
            return parseFloat(a); // Return 'a' as float
          } else {
            return parseInt(a); // Return 'a' as integer
          }
        }
      }
      this.dataVerify.qty_recieved = dynamicConversion(this.dataVerify && this.dataVerify.qty_recieved ? this.dataVerify.qty_recieved.toString() : '')
    }
    // const getLocalData = localSetorage.getItem('BHTCurrentUser');
    // let data = JSON.parse(getLocalData)
    let UserIds = datas.code
    let rangeData;
    if(this.lotNo){
      rangeData = this.getRangeData(this.dataVerify.actualHarvest_date, this.dataVerify.code, UserIds ? UserIds : 'NA', this.lotNo, this.dataVerify.max_lot_size, this.ngForm.controls['received_quantity'].value)
    }else{
      rangeData = this.getRangeData(this.dataVerify.actualHarvest_date, this.dataVerify.code, UserIds ? UserIds : 'NA', 1, this.dataVerify.max_lot_size, this.ngForm.controls['received_quantity'].value)
    }
    param.rangeData = rangeData;
    param.range_data = this.provisonal_lot;
    param.provisonal_lot = this.provisonal_lot
    console.log(this.dataVerify.code, 'getRangeData')
    console.log(this.dataVerify, 'param')


    if (!this.editData) {
      // let getRangeData= this.getRangeData(this.dataVerify.actualHarvest_date, this.dataVerify.user_id, this.dataVerify.UserId, this.lotNo, this.dataVerify.max_lot_size, this.dataVerify.qty_recieved)

      this.productionService.postRequestCreator('add-investing-verify', param).subscribe(data => {
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

              this.UpdateStatus(this.idofharvestAccept);
              this.ngForm.controls['variety'].reset('');
              this.ngForm.controls['plot_code'].reset('');
              this.ngForm.controls['bag_number'].patchValue('');
              this.ngForm.controls['bag_marka'].patchValue('');
              this.ngForm.controls['seed_quantity'].patchValue('');
              this.ngForm.controls['received_quantity'].patchValue('');
              this.ngForm.controls['godown_no'].patchValue('');
              this.ngForm.controls['stack_no'].patchValue('');
              this.ngForm.controls['seed_quantity'].patchValue('');
              this.editData = false;
              this.clearDataValue = true
              this.isAccept = false;
              const FormArrays = this.ngForm.get('harvestVerify') as FormArray;
              FormArrays.clear()
              this.addMoreData();
              // this.getStackData(0);
              this.getPageFormData()
            }
          })
        }
        else {
          Swal.fire(
            {
              icon: 'error',
              title: 'something went wrong',
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonColor: '#B64B1D'
            }
          )
        }
      })
    }
    else {
      param.verifyid = this.verifyid
      this.productionService.postRequestCreator('update-investing-verify', param).subscribe(data => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
          Swal.fire(
            {
              icon: 'success',
              title: 'Data Updated Successfully',
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonColor: '#B64B1D'
            }
          ).then(x => {
            if (x.isConfirmed) {
              this.ngForm.controls['variety'].reset('');
              this.ngForm.controls['plot_code'].reset('');
              this.ngForm.controls['bag_number'].patchValue('');
              this.ngForm.controls['bag_marka'].patchValue('');
              this.ngForm.controls['seed_quantity'].patchValue('');
              this.ngForm.controls['received_quantity'].patchValue('');
              this.ngForm.controls['godown_no'].patchValue('');
              this.ngForm.controls['stack_no'].patchValue('');
              this.ngForm.controls['seed_quantity'].patchValue('');
              this.editData = false;
              this.clearDataValue = true;
              this.isAccept = false;
              const FormArrays = this.ngForm.get('harvestVerify') as FormArray;
              FormArrays.clear();
              this.addMoreData();
              this.getPageFormData();
            }
          })
        }
        else {
          Swal.fire(
            {
              icon: 'error',
              title: 'something went wrong',
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonColor: '#B64B1D'
            }
          )
        }
      })
    }


  }
  harverInvest() {
    let temp = this.fb.group({
      stack: [''],
      season: [''],
      year: [''],
      type_of_seed: ['1'],
      bag_marka_id: [''],
      bag_marka: [''],
      showstackNo: [''],
      season_v2: [''],
      year_v2: [''],
      stackexist: [false],
      godown_no: [],
      stack_id: []

    });
    return temp;
  }
  harvestInvestData() {
    return this.ngForm.get('harvestVerify') as FormArray;
  }
  addMore(i) {
    // if(this.ngForm.controls['harvestVerify']['controls'][i].controls['stackexist'].value==false){

    this.stackNo = (this.stackNo) + 1
    // }
    this.harvestInvestData().push(this.harverInvest());
    this.getBagMarkData(i + 1)
  }
  addMoreData() {
    this.harvestInvestData().push(this.harverInvest());
  }
  remove(rowIndex: number) {
    if (this.harvestInvestData().controls.length > 1) {
      this.harvestInvestData().removeAt(rowIndex);
    } else {
      this.harvestInvestData()
    }
    this.getBagMarkData(rowIndex + 1)
    if (this.ngForm.controls['harvestVerify']['controls'][rowIndex].controls['stackexist'].value == false) {
      this.stackNo = (this.stackNo) - 1;
    }
  }
  clearData() {
    this.ngForm.controls['variety'].reset('');
    this.ngForm.controls['plot_code'].reset('');
    this.ngForm.controls['bag_number'].patchValue('');
    this.ngForm.controls['bag_marka'].patchValue('');
    this.ngForm.controls['seed_quantity'].patchValue('');
    this.ngForm.controls['received_quantity'].patchValue('');
    this.ngForm.controls['godown_no'].patchValue('');
    this.ngForm.controls['stack_no'].patchValue('');
    this.ngForm.controls['seed_quantity'].patchValue('');
    this.editData = false;
    this.clearDataValue = true;
    this.ngForm.controls['parental_line'].patchValue('');
    const FormArrays = this.ngForm.get('harvestVerify') as FormArray;
    // this.isAccept
    this.isAccept = false;
    FormArrays.clear()
    this.addMoreData()
  }

  searchData(data: any) {
    this.submitted = true;
    // if (this.ngForm.invalid) {
    //   return;
    // 
    if ((!this.ngForm.controls["year"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Year.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    else if ((!this.ngForm.controls["season"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    else if ((!this.ngForm.controls["crop"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    this.isSearch = true;
    this.getPageFormData();
    this.getHarvestVariety();

    // this.getBagData()
  }

  isAcceptData(item, lot, data: any, i, value) {
    this.isAccept = true;
    this.isReject = false;
    this.investharvestid = data;
    this.ngForm.controls['variety_code'].setValue(data && data.variety_code ? data.variety_code : '')
    this.getBagMarkData(i)
    this.iseditUpper(item, lot, value, data)
    this.getBagData(data)
    this.idofharvestAccept = data
    // this.UpdateStatus(data);
    this.getLotNo();
  }
  isRejectData(data: any) {
    Swal.fire({
      title: "Are you sure you want to reject the consignment?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B64B1D'",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire({
        //   title: "Deleted!",
        //   text: "Your file has been deleted.",
        //   icon: "success"
        // });
        this.isAccept = false;
        this.isReject = true;
        this.UpdateStatus(data)
      }
    });
  }

  getYearData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId
      }
    }
    this.productionService.postRequestCreator('get-harvesting-verification-year', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.yearData = response ? response : '';

      }
    })
  }
  UpdateStatus(id) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        status: this.isAccept ? 1 : 0,
        id: id

        // user_id: UserId
      }
    }
    this.productionService.postRequestCreator('update-harvesting-verification-status', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        // Swal.fire({
        //   title: '<p style="font-size:25px;">Data Updated Successfully.</p>',
        //   icon: 'success',
        //   confirmButtonText:
        //     'OK',
        //   confirmButtonColor: '#B64B1D'
        // }).then(x => {

        // })
        this.getPageFormData()
        // let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        // this.yearData = response ? response : '';e

      }
      else {
        Swal.fire({
          title: '<p style="font-size:25px;">Something went wrong.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
      }
    })
  }
  getSeasonData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value
      }
    }
    this.productionService.postRequestCreator('get-harvesting-verification-season', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.seasonlist = response ? response : '';

      }
    })
  }
  getCropData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value
      }
    }
    this.productionService.postRequestCreator('get-harvesting-verification-crop', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.cropData = response ? response : '';
        this.croplistSecond = this.cropData
      }
    })
  }
  getStackYearData() {
    let currentyear = Number(this.currentYear) + 2;
    for (let i = Number(this.currentYear); i <= currentyear; i++) {
      this.yearDataStack.push({ year: i })
    }
    // for (let i = 2022; i <= this.currentYear; i++) {
    //   this.yearDataStack.push({ year: i })
    // }
  }
  getPageFormData(id = null) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id;
    let varietyData = this.ngForm.controls['variety_level_2'].value;
    let variety = []
    if (varietyData && varietyData.length > 0) {
      varietyData.forEach((el, i) => {
        variety.push(el && el.variety_code ? el.variety_code : '')
      })
    }
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: variety,
        // variety_line_code: this.ngForm.controls['parental_line'].value,
        // plotid: this.ngForm.controls['plot'].value,
        // id: id
      }
    }
    this.productionService.postRequestCreator('get-harvesting-verification-data', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.filterData ? data.EncryptedResponse.data.filterData : '';
        let investVerifyStackComposition = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.investVerifyStackComposition ? data.EncryptedResponse.data.investVerifyStackComposition : '';
        this.investVerifyStackComposition = investVerifyStackComposition ? investVerifyStackComposition : ''
        this.tableData = response ? response : '';
        let bsp2Data = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.bsp2Data ? data.EncryptedResponse.data.bsp2Data : '';
        let results = []
        if (bsp2Data && bsp2Data.length > 0) {
          bsp2Data.forEach((el, i) => {
            if (el && el.variety_line_code) {
              if (el.line_variety_code == el.variety_line_code) {
                results.push({
                  seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
                  stage_id: el && el.stage_id ? el.stage_id : '',
                  line_variety_code: el && el.line_variety_code ? el.line_variety_code : '',
                  plot_code: el && el.plot_code ? el.plot_code : '',
                  variety_line_code: el && el.variety_line_code ? el.variety_line_code : '',
                  variety_code: el && el.variety_code ? el.variety_code : '',
                  code: el && el.code ? el.code : ''
                })
              } else {
                results.push({
                  seed_class_id: '',
                  stage_id: '',
                  line_variety_code: '',
                  plot_code: '',
                  variety_code: '',
                  variety_line_code: '',
                  code: ''
                })
              }
            }
            else {
              results.push({
                seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
                stage_id: el && el.stage_id ? el.stage_id : '',
                line_variety_code: el && el.line_variety_code ? el.line_variety_code : '',
                plot_code: el && el.plot_code ? el.plot_code : '',
                variety_line_code: el && el.variety_line_code ? el.variety_line_code : '',
                variety_code: el && el.variety_code ? el.variety_code : '',
                code: el && el.code ? el.code : ''
              })
            }
          })
        }
        if (this.tableData && this.tableData.length > 0) {
          if (results && results.length > 0) {

            this.tableData = this.tableData.map(item => {
              item.bsp_details.forEach(detail => {
                let matchingItem = results.find(elem => elem.variety_code === item.variety_code && elem.plot_code === detail.plot_code);
                if (matchingItem) {
                  detail.plotDetails.forEach(plotDetail => {
                    plotDetail.stage_id = matchingItem && matchingItem.stage_id ? matchingItem.stage_id : '';
                    plotDetail.seed_class_id = matchingItem && matchingItem.seed_class_id ? matchingItem.seed_class_id : '';
                    plotDetail.variety_line_code = matchingItem && matchingItem.variety_line_code ? matchingItem.variety_line_code : '';
                    plotDetail.line_variety_code = matchingItem && matchingItem.line_variety_code ? matchingItem.line_variety_code : '';
                    plotDetail.code = matchingItem && matchingItem.code ? matchingItem.code : '';
                    // plotDetail.plot_code = matchingItem && matchingItem.plot_code ? matchingItem.plot_code :'';
                  });
                }
              });
              return item;
            });
          }

        }
        if (this.tableData && this.tableData.length > 0) {
          this.tableData.forEach((el, i) => {
            el.bsp_details.forEach((item, j) => {
              item.plotDetails = item.plotDetails.filter((arr, index, self) =>
                index === self.findIndex((t) => (t.verifyid === arr.verifyid)))
            })
          })
          this.tableData.forEach((el, i) => {
            let sum = 0;
            el.allDataArr = []
            // el.tag_detail_data_length= el.tag_detail_data.length
          })
          this.tableData.forEach((el, i) => {
            el.bsp_details.forEach((item, index) => {
              el.allDataArr.push(...item.plotDetails)
            })
            // el.tag_detail_data_length= el.tag_detail_data.length
          })
          let singleArray
          this.tableData.forEach((el, i) => {
            el.totalArrlength = el.allDataArr.length
            el.bsp_details.forEach((item, index) => {
              item.tagdetaildatatotal = item.plotDetails.length;
            })

          })
          this.tableData.forEach((el, i) => {
            el.bsp_details.forEach((item, index) => {
              item.plotDetails.forEach((val, j) => {
                let item
                if (val && val.actual_harvest_date) {
                  val.actualHarvest_date = this.formateDate(val && val.actual_harvest_date ? val.actual_harvest_date : '');
                }
                val.UserId = UserId
              })
            })
          })
          console.log(this.tableData, 'this.tableDatathis.tableData')
        }
      }
    })

  }

  iseditUpper(data, item, id, value, verifyid = null,) {

    this.getBagMarkData(verifyid);
    this.bagNO = item && item.no_of_bags ? item.no_of_bags : 0;
    // variety_code
    this.ngForm.controls['variety_code'].setValue(data && data.variety_code ? data.variety_code : '')
    this.ngForm.controls['variety'].setValue(data && data.variety_name ? data.variety_name : '');
    this.ngForm.controls['parental_line'].setValue(data && data.line_variety_name ? data.line_variety_name : 'NA');
    this.ngForm.controls['plot_code'].setValue(item && item.plot_code ? item.plot_code : '');
    this.ngForm.controls['bag_number'].setValue(item && item.no_of_bags ? item.no_of_bags : '');
    this.ngForm.controls['bag_marka'].setValue(item && item.bag_marka ? item.bag_marka : '');
    this.ngForm.controls['seed_quantity'].setValue(item && item.raw_seed_produced ? item.raw_seed_produced : '');
    this.dataVerify = item;
    if (item.class_of_seed && item.class_of_seed, item.stage_id) {
      this.classofSeedHarvested = this.getBreederData(item.class_of_seed, item.stage_id)
    }
    // this.dataVerify = item
    console.log(this.dataVerify, 'dataVerify')

  }
  isedit(data, item, id, verifyid = null) {
    this.investharvestid = id;
    this.editData = true;
    this.isAccept = true;
    console.log('data======', data.variety_code)
    this.ngForm.controls['variety_code'].setValue(data && data.variety_code ? data.variety_code : '')
    this.ngForm.controls['variety'].setValue(data && data.variety_name ? data.variety_name : '');
    this.ngForm.controls['parental_line'].setValue(data && data.line_variety_name ? data.line_variety_name : 'NA');
    this.ngForm.controls['plot_code'].setValue(item && item.plot_code ? item.plot_code : '');
    this.bagNO = item && item.no_of_bags ? item.no_of_bags : 0;
    this.ngForm.controls['bag_number'].setValue(item && item.no_of_bags ? item.no_of_bags : '');
    this.ngForm.controls['bag_marka'].setValue(item && item.bag_marka ? item.bag_marka : '');
    this.ngForm.controls['seed_quantity'].setValue(item && item.raw_seed_produced ? item.raw_seed_produced : '');
    this.dataVerify = item;
    this.getBagData();
    if (item.class_of_seed && item.class_of_seed, item.stage_id) {
      this.classofSeedHarvested = this.getBreederData(item.class_of_seed, item.stage_id)
    }
    this.getLotNo();
    const param = {
      search: {
        harvestid: id,
        verifyid: verifyid
      }
    }
    this.verifyid = verifyid;
    this.productionService.postRequestCreator('get-investing-verify-id', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.ngForm.controls['received_quantity'].setValue(response && response[0] && response[0].qty_recieved ? response[0].qty_recieved : '');
        this.ngForm.controls['godown_no'].setValue(response && response[0] && response[0].bag_recieved ? response[0].bag_recieved : '');
        let invest_verify_stack_compositions = response && response[0] && response[0].invest_verify_stack_compositions ? response[0].invest_verify_stack_compositions : '';
        for (let i = 1; i < invest_verify_stack_compositions.length; i++) {
          this.addMore(i)
        }
        if (invest_verify_stack_compositions && invest_verify_stack_compositions.length > 0) {
          invest_verify_stack_compositions.forEach((el, i) => {
            this.getBagMarkData(i);
            // this.ngForm.controls['harvestVerify']['controls'][i].controls['showstackNo'].setValue(stackNo ? stackNo :'');
            this.ngForm.controls['harvestVerify']['controls'][i].controls['stack'].setValue(el && el.id ? el.id : '');
            this.ngForm.controls['harvestVerify']['controls'][i].controls['season'].setValue(el && el.season ? el.season : '');
            this.ngForm.controls['harvestVerify']['controls'][i].controls['year'].setValue(el && el.year ? el.year : '');
            this.ngForm.controls['harvestVerify']['controls'][i].controls['type_of_seed'].setValue(el && el.type_of_seed ? el.type_of_seed : '');
            this.ngForm.controls['harvestVerify']['controls'][i].controls['bag_marka'].setValue(el && el.bag_marka ? el.bag_marka : '');
            this.ngForm.controls['harvestVerify']['controls'][i].controls['showstackNo'].setValue(el && el.stack ? el.stack : '');
            this.ngForm.controls['harvestVerify']['controls'][i].controls['godown_no'].setValue(el && el.godown_no ? el.godown_no : '');
          })
        }
      }
    })
  }
  getBagData(data = null) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData)
    let UserId = datas.id
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety_code'].value,
        // variety: this.ngForm.controls['season'].value,
        user_id: UserId
      }
    }
    this.productionService.postRequestCreator('get-bag-marka-data', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.bagMarkDataofInvest = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
        console.log('this.bagMarkDataofInvest==', this.bagMarkDataofInvest);
        if (this.bagMarkDataofInvest && this.bagMarkDataofInvest.length > 0) {
          let result = [];
          this.bagMarkDataofInvest.forEach((el, i) => {
            if (el && el.invest_verification_id) {
              result.push(el)
            }
          })
          this.bagMarkDataofInvest = result
          this.bagMarkDataofInvest = this.bagMarkDataofInvest.filter((arr, index, self) =>
            index === self.findIndex((t) => (t.stack === arr.stack)))
        }
      }
    })
  }
  getBagMarkData(index) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {

        investharvestid: this.investharvestid,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value
      }
    }
    this.productionService.postRequestCreator('get-bag-marka', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.bagMarkData = response ? response : '';
        if (this.bagMarkData && this.bagMarkData.length > 0) {
          this.bagMarkData.sort((a, b) => {
            // Extract the numeric part from the "bags" string
            let bagsA = parseInt(a.bags.match(/\d+/)[0]);
            let bagsB = parseInt(b.bags.match(/\d+/)[0]);

            // Compare the numeric parts
            return bagsA - bagsB;
          });
        }

        if (this.editData) {
          const formArray = this.ngForm.get('harvestVerify') as FormArray;
          if (formArray && formArray.controls && formArray.controls[index] && formArray.controls[index]['controls'] && formArray.controls[index]['controls']['bag_marka']) {
            formArray.controls[index]['controls']['bag_marka'].baglist = this.bagMarkData ? this.bagMarkData : []
          }
          let data = this.ngForm.value ? this.ngForm.value.harvestVerify : '';
          let bagMarka = []
          if (data && data.length > 0) {
            data.forEach(el => {
              bagMarka.push(...el.bag_marka)
            })
          }
          let filteredArray;
          const commonElements = bagMarka.filter(item => !this.ngForm.controls['harvestVerify']['controls'][index]['controls']['bag_marka'].value.some(({ id }) => id == item.id));
          this.ngForm.controls['harvestVerify']['controls'][index]['controls']['bag_marka'].baglist = this.ngForm.controls['harvestVerify']['controls'][index]['controls']['bag_marka'].baglist.filter(item => !commonElements.some(({ id }) => id == item.id))
          this.ngForm.controls['harvestVerify']['controls'][index]['controls']['bag_marka'].baglist.sort((a, b) => {
            // Extract the numeric part from the "bags" string
            let bagsA = parseInt(a.bags.match(/\d+/)[0]);
            let bagsB = parseInt(b.bags.match(/\d+/)[0]);

            // Compare the numeric parts
            return bagsA - bagsB;
          });
        }
        else {
          const formArray = this.ngForm.get('harvestVerify') as FormArray;

          if (formArray && formArray.controls && formArray.controls[index] && formArray.controls[index]['controls'] && formArray.controls[index]['controls']['bag_marka']) {
            formArray.controls[index]['controls']['bag_marka'].baglist = this.bagMarkData ? this.bagMarkData : []
          }
          let data = this.ngForm.value ? this.ngForm.value.harvestVerify : '';
          let bagMarka = []
          if (data && data.length > 0) {
            data.forEach(el => {
              bagMarka.push(...el.bag_marka)
            })
          }
          if (this.ngForm.controls['harvestVerify']['controls'][index] && this.ngForm.controls['harvestVerify']['controls'][index]['controls'] && this.ngForm.controls['harvestVerify']['controls'][index]['controls']['bag_marka']) {
            this.ngForm.controls['harvestVerify']['controls'][index]['controls']['bag_marka'].baglist = this.ngForm.controls['harvestVerify']['controls'][index]['controls']['bag_marka'].baglist.filter(item => !bagMarka.some(({ id }) => id == item.id))
            if (this.ngForm.controls['harvestVerify']['controls'][index]['controls']['bag_marka'].baglist && this.ngForm.controls['harvestVerify']['controls'][index]['controls']['bag_marka'].baglist.length > 0) {
              this.ngForm.controls['harvestVerify']['controls'][index]['controls']['bag_marka'].baglist.sort((a, b) => {
                // Extract the numeric part from the "bags" string
                let bagsA = parseInt(a.bags.match(/\d+/)[0]);
                let bagsB = parseInt(b.bags.match(/\d+/)[0]);

                // Compare the numeric parts
                return bagsA - bagsB;
              });
            }
          }

        }
      }
    })
  }
  selectbagMarka(index) {
    if (this.editData) {
      // alert('hii')
      let data = this.ngForm.value ? this.ngForm.value.harvestVerify : '';
       
      let hasDuplicate = false;
      const idMap = {};
      data.forEach(item => {
        item.bag_marka.forEach(marka => {
          if (idMap[marka.id]) {
            hasDuplicate = true;
            return;
          }
          idMap[marka.id] = true;
        });
      });

      if (hasDuplicate) {
        // alert("Duplicate IDs found in the bag_marka array!");
        Swal.fire({
          title: '<p style="font-size:25px;">Duplicate Data found in the bag_marka array!.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
        return;
      }
       
       

    }
    const data = this.ngForm.value ? this.ngForm.value.harvestVerify : [];
    const selectedItems = data[index]?.bag_marka?.length || 0;
  
    // Check for duplicate IDs in `bag_marka`
    let hasDuplicate = false;
    const idMap = {};
    data.forEach(item => {
      item.bag_marka.forEach(marka => {
        if (idMap[marka.id]) {
          hasDuplicate = true;
        }
        idMap[marka.id] = true;
      });
    });
  
    if (hasDuplicate) {
      Swal.fire({
        title: '<p style="font-size:25px;">Duplicate Data found in the bag_marka array!.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#B64B1D'
      });
      return;
    }
    console.log("selectedItems",selectedItems);
    console.log("this.bagsReceived",this.bagsReceived);
    // Validate against the number of bags received
    if (selectedItems > this.bagsReceived) {
      Swal.fire({
        title: '<p style="font-size:20px;">Selected items cannot exceed the number of bags received.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#B64B1D'
      });
      // Remove the last selected item
      this.ngForm.controls['harvestVerify']['controls'][index]['controls']['bag_marka']
        .setValue(this.ngForm.controls['harvestVerify']['controls'][index]['controls']['bag_marka'].value.slice(0, -1));
    }

  }
  selectAllMarka(index: number) {
    const data = this.ngForm.value ? this.ngForm.value.harvestVerify : [];
    const selectedItems = this.bagMarkData.length; // Total items if "Select All" is chosen
  
    if (selectedItems > this.bagsReceived) {
      Swal.fire({
        title: '<p style="font-size:20px;">Selected items cannot exceed the number of bags received.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#B64B1D'
      });
      // Clear all selections if the limit is exceeded
      this.ngForm.controls['harvestVerify']['controls'][index]['controls']['bag_marka'].setValue([]);
    }
  }
  getStackData(i) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
      }
    }
    if (!this.editData) {
      this.productionService.postRequestCreator('get-stack-no', param).subscribe(data => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : 0;
          // this.stac = response ? response : '';
          let season = this.ngForm.controls['harvestVerify']['controls'][i].controls['season_v2'].value;
          let year = this.ngForm.controls['harvestVerify']['controls'][i].controls['year_v2'].value;
          let seedtype = this.ngForm.controls['harvestVerify']['controls'][i].controls['type_of_seed'].value;
          let typeofSeed;
          let typeSeedName;
          if (this.typeofSeed && this.typeofSeed.length > 0) {
            typeofSeed = this.typeofSeed.filter(x => x.id == this.ngForm.controls['harvestVerify']['controls'][i].controls['type_of_seed'].value)
            typeSeedName = typeofSeed && typeofSeed[0] && typeofSeed[0].name ? typeofSeed[0].name : '';
          }
          let lastTwoDigits = year % 100;
          let yearRange = `${lastTwoDigits}-${lastTwoDigits + 1}`;
          // if(!this.editData  !this.stackexist){
          if (this.ngForm.controls['harvestVerify']['controls'][i].controls['stackexist'].value == false) {
            this.stackNo = response ? response.length : 0;
            let stackNo = `${season ? season.toUpperCase() : 'NA'}/${yearRange}/${seedtype = 'RS'}/${Number(this.stackNo) + (parseInt(i) + 1)}`
            this.ngForm.controls['harvestVerify']['controls'][i].controls['showstackNo'].setValue(stackNo ? stackNo : '');
          }
          // }
        }
      })
    }
  }
  formateDate(dateString) {
    const date = new Date(dateString);
    // Array of month names
    const monthNames = ["Jan", "FEB", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Extract month and year components
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear() % 100; // Getting last two digits of the year

    // Format the date in "Mar24" format
    const formattedDate = month + year;
    return formattedDate
  }
  getRangeData(actualData, user_id, UserId, plotIndex, maxlot, qty) {
    console.log('lot_no',plotIndex);
    let plotIndexValue = plotIndex ?parseInt(plotIndex):1;
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserIds = data.code
    console.log(user_id, 'UserIds', UserId)
    if (maxlot && qty) {
      let result = qty / maxlot;
      let results = []
      // Convert result to Roman numerals
      function toRoman(num) {
        const romanNumerals = {
          m: 1000,
          cm: 900,
          d: 500,
          cd: 400,
          c: 100,
          xc: 90,
          l: 50,
          xl: 40,
          x: 10,
          ix: 9,
          v: 5,
          iv: 4,
          i: 1
        };

        let roman = '';
        for (let key in romanNumerals) {
          while (num >= romanNumerals[key]) {
            roman += key;
            num -= romanNumerals[key];
          }
        }
        return roman;
      }

      let a = qty;
      let b = maxlot;

      let resultArray = [];

      // Calculate how many times b can divide a fully
      let fullDivisions = Math.floor(a / b);

      // Push b into the array fullDivisions times
      for (let i = 0; i < fullDivisions; i++) {
        resultArray.push(b);
      }

      // Calculate the remaining amount after full divisions
      let remaining = a - (fullDivisions * b);

      // Push the remaining amount into the array
      resultArray.push(remaining);
      resultArray = resultArray.map(element => {
        // Check if the element is a number
        if (typeof element === 'number') {
          // Round the number to 2 decimal places
          return parseFloat(element.toFixed(2));
        }
        return element; // Return unchanged if not a number
      });
      let data = []
      let qtyData = [];
      if (resultArray && resultArray.length > 0) {
        resultArray = resultArray.filter(x => x > 0)
      }
      if ((Math.ceil(result)) > 1) {
        resultArray.forEach((el, i) => {

          qtyData.push(el)
          results.push(`${actualData ? actualData.toUpperCase() : 'NA'}-${user_id}-${UserIds}-${plotIndexValue}(${toRoman(Math.ceil(i + 1))})(${el}${this.unit})`)
        })
      }
      else {
        resultArray.forEach((el, i) => {
          qtyData.push(el)

          results.push(`${actualData ? actualData.toUpperCase() : 'NA'}-${user_id}-${UserIds}-${plotIndexValue}(${el}${this.unit})`)
        })
      }
      // this.range_data= data;
      // console.log(this.range_data,'his.range_data')
      if (qtyData && qtyData.length > 0) {
        qtyData = qtyData.filter(x => x > 0)
      }
      let resultData = [];
      // Assuming both arrays have the same length
      for (let i = 0; i < results.length; i++) {
        resultData.push({
          lot_number: results[i],
          qty: qtyData[i]
        });
      }
      this.provisonal_lot = resultData;
      this.range_data = resultData;
      console.log(this.range_data, 'resultData');
      return results && results.length > 0 ? results.toString() : null;
    }
    else if (qty) {
      let result = [];
      let resultData = []
      console.log('plotIndex', plotIndexValue)
      result.push(`${actualData ? actualData.toUpperCase() : 'NA'}-${user_id}-${UserIds}-${plotIndexValue}(${qty}${this.unit})`)
      if (result && result.length > 0) {
        result.forEach(el => {
          resultData.push(
            {
              lot_number: el,
              qty: qty

            }
          )
        })
      }
      this.provisonal_lot = resultData;
      this.range_data = resultData;
      return result && result.length > 0 ? result.toString() : '';
    }
    else {
      return 'NA'
    }
  }
  
  getStack(id) {
    if (this.investVerifyStackComposition && this.investVerifyStackComposition.length > 0) {
      let item = this.investVerifyStackComposition.filter(x => x.invest_verify_id == id);
      let stack = []
      if (item && item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          stack.push(item && item[i] ? item[i].stack : 'NA')
        }
      }

      // return (stack && stack.length > 0 ? stack.toString() : '')
    }
  }
  selectStack(i) {
    let stackValue = this.ngForm.controls['harvestVerify']['controls'][i].controls['stack'].value;
    console.log(stackValue, 'stackValue')
    let bagMarkDataofInvest;
    if (this.bagMarkDataofInvest && this.bagMarkDataofInvest.length > 0) {
      bagMarkDataofInvest = this.bagMarkDataofInvest.filter(x => x.stack_id == stackValue)
    }
    if (stackValue != 'new_stack') {
      const param = {
        search: {
          investStackId: stackValue
        }
      }
      this.productionService.postRequestCreator('get-investing-verify-of-stack', param).subscribe(data => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
          this.stackexist = true;
          let season = response && response[0] && response[0].season && (this.ngForm.controls['season'].value == 'K') ? 'Kharif' : (this.ngForm.controls['season'].value == 'R') ? 'Rabi' : '';
          let year = this.getFinancialYear(this.ngForm.controls['year'].value);
          this.ngForm.controls['harvestVerify']['controls'][i].controls['season'].setValue(response && response[0] && response[0].season ? response[0].season : '', { emitEvent: false, onlySelf: true });
          this.ngForm.controls['harvestVerify']['controls'][i].controls['year'].setValue(response && response[0] && response[0].year ? response[0].year : '', { emitEvent: false, onlySelf: true });
          // this.ngForm.controls['harvestVerify']['controls'][i].controls['bag_marka'].setValue(response && response[0] && response[0].bag_marka ? response[0].bag_marka:'',{emitEvent: false, onlySelf: true});
          this.ngForm.controls['harvestVerify']['controls'][i].controls['type_of_seed'].setValue(response && response[0] && response[0].type_of_seed ? response[0].type_of_seed : '', { emitEvent: false, onlySelf: true });
          this.ngForm.controls['harvestVerify']['controls'][i].controls['showstackNo'].setValue(response && response[0] && response[0].stack ? response[0].stack : '', { emitEvent: false, onlySelf: true });
          this.ngForm.controls['harvestVerify']['controls'][i].controls['godown_no'].setValue(response && response[0] && response[0].godown_no ? response[0].godown_no : '', { emitEvent: false, onlySelf: true });
          this.ngForm.controls['harvestVerify']['controls'][i].controls['stackexist'].setValue(true);
          this.ngForm.controls['harvestVerify']['controls'][i].controls['stack_id'].setValue(response && response[0] && response[0].id ? response[0].id : '', { emitEvent: false, onlySelf: true });
          // this.ngForm.controls['harvestVerify']['controls'][i].controls['season'].disable();
          // this.ngForm.controls['harvestVerify']['controls'][i].controls['bag_marka'].disable();
          // this.ngForm.controls['harvestVerify']['controls'][i].controls['year'].disable();
          // this.ngForm.controls['harvestVerify']['controls'][i].controls['type_of_seed'].disable();
          // this.ngForm.controls['harvestVerify']['controls'][i].controls['showstackNo'].disable();
        }
      })
    }
    else {
      this.stackexist = false;
      this.ngForm.controls['harvestVerify']['controls'][i].controls['stackexist'].setValue(false);
      let season = (this.ngForm.controls['season'].value == 'K') ? 'Kharif' : (this.ngForm.controls['season'].value == 'R') ? 'Rabi' : '';
      let year = this.getFinancialYear(this.ngForm.controls['year'].value);

      this.ngForm.controls['harvestVerify']['controls'][i].controls['season_v2'].setValue(this.ngForm.controls['season'].value, { emitEvent: false, onlySelf: true });
      this.ngForm.controls['harvestVerify']['controls'][i].controls['season'].setValue(season, { emitEvent: false, onlySelf: true });
      this.ngForm.controls['harvestVerify']['controls'][i].controls['year'].setValue(year, { emitEvent: false, onlySelf: true });
      this.ngForm.controls['harvestVerify']['controls'][i].controls['year_v2'].setValue(this.ngForm.controls['year'].value, { emitEvent: false, onlySelf: true });
      // this.ngForm.controls['harvestVerify']['controls'][i].controls['bag_marka'].setValue(response && response[0] && response[0].bag_marka ? response[0].bag_marka:'',{emitEvent: false, onlySelf: true});
      this.ngForm.controls['harvestVerify']['controls'][i].controls['type_of_seed'].setValue('1', { emitEvent: false, onlySelf: true });
      this.ngForm.controls['harvestVerify']['controls'][i].controls['showstackNo'].setValue('', { emitEvent: false, onlySelf: true });
      this.ngForm.controls['harvestVerify']['controls'][i].controls['stack_id'].setValue('', { emitEvent: false, onlySelf: true });
    }
  }
  checkDecimal(event) {
    const numCharacters = /[0-9.]+/g;
    if (event.which == 190 || event.which != 17 && event.which != 86 && event.which != 8 && event.which != 9 && event.which != 37 && event.which != 39 && event.which != 46 && numCharacters.test(event.key) == false) {
      event.preventDefault();
    }
  }


  onlyNumberKey($e) {
    onlyNumberKey($e)
  }
  onInputChange(event: any) {
    let input = event.target.value;
    // Allow backspace
    if (event.keyCode === 8) {
      return;
    }
    // Remove non-digit characters except decimal point
    input = input.replace(/[^0-9.]/g, '');
    // Split the input by decimal point
    let parts = input.split('.');
    // If there are more than one decimal points or more than two digits after the decimal, remove the extra characters
    if (parts.length > 1 && parts[1].length > 2) {
      parts[1] = parts[1].slice(0, 2);
      input = parts.join('.');
    }
    // Update the form control value
  }
  validateDecimalInput(event: KeyboardEvent): void {
    // Allow backspace (keyCode 8)
    if (event.keyCode === 8) {
      return;
    }

    // Get the input value
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    // Allow only digits, decimal point, and backspace
    if (!/^\d*\.?\d*$/.test(inputValue)) {
      event.preventDefault();
      return;
    }

    // Allow only two digits after the decimal point
    const parts = inputValue.split('.');
    if (parts.length === 2 && parts[1].length >= 2) {
      event.preventDefault();
      return;
    }
  }
  getHarvestVariety() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    let varietyData = this.ngForm.controls['variety_level_2'].value;
    let variety = []
    if (varietyData && varietyData.length > 0) {
      varietyData.forEach((el, i) => {
        variety.push(el && el.variety_code ? el.variety_code : '')
      })
    }
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: variety
      }
    }
    this.productionService.postRequestCreator('get-investing-harvesting-data', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : 0;
        this.varietyList = response ? response : '';

        // }
      }
    })

  }
  getStackRang(id) {
    let stack = []
    if (this.investVerifyStackComposition && this.investVerifyStackComposition.length > 0) {
      let item = this.investVerifyStackComposition.filter(x => x.invest_verify_id == id);
      if (item && item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          stack.push(item && item[i] ? item[i].stack : 'NA')
        }
      }

      // return (stack && stack.length > 0 ? stack.toString() : '')
    }

    function convertToArray(inputArray) {
      let result = [];
      let currentPrefix = null;
      let currentStart = null;
      let currentEnd = null;

      for (let i = 0; i < inputArray.length; i++) {
        const str = inputArray[i];
        const parts = str.split("/");
        const prefix = parts.slice(0, -1).join("/");
        const num = parseInt(parts[parts.length - 1], 10);

        if (currentPrefix === null || currentPrefix !== prefix || num !== currentEnd + 1) {
          if (currentStart !== null && currentEnd !== null) {
            if (currentStart === currentEnd) {
              result.push(currentPrefix + "/" + currentStart);
            } else {
              result.push(currentPrefix + "/" + currentStart + "," + currentEnd);
            }
          }
          currentPrefix = prefix;
          currentStart = num;
        }
        currentEnd = num;
      }

      if (currentStart !== null && currentEnd !== null) {
        if (currentStart === currentEnd) {
          result.push(currentPrefix + "/" + currentStart);
        } else {
          result.push(currentPrefix + "/" + currentStart + "," + currentEnd);
        }
      }

      return result;
    }

    const result = convertToArray(stack);

    return result && result.length > 0 ? result.toString() : '';

  }
  getgodown(item) {
    let godown_no = []
    if (item) {
      if (this.investVerifyStackComposition && this.investVerifyStackComposition.length > 0) {
        let items = this.investVerifyStackComposition.filter(x => x.invest_verify_id == item);
        if (items && items.length > 0) {
          for (let i = 0; i < items.length; i++) {
            godown_no.push(items && items[i] ? items[i].godown_no : 'NA')
          }
        }

        // return (stack && stack.length > 0 ? stack.toString() : '')
      }
    }
    if (godown_no && godown_no.length > 0) {
      const uniqueArray = [...new Set(godown_no)];
      return uniqueArray ? uniqueArray : 'NA'
    }

  }
  bagrecieved(e) {
    this.bagsReceived = e;
    if (this.bagNO) {
      if (parseInt(this.bagNO) < Number(e)) {
        Swal.fire({
          title: '<p style="font-size:25px;">Bag Recieved can not be greater than No of Bags.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
        this.bagError = true;
      }
      else {
        this.bagError = false;
      }
    } else {
      this.bagError = false;
    }

  }
  getBreederData(id, stageId) {
    if (id) {
      let name = 'Breeder Seed';
      let stageIds;
      if (stageId) {
        stageIds = id == 6 ? this.convertToRoman(1) : this.convertToRoman(stageId + 1);
      }
      let className = name ? name : 'NA';
      let stageName = stageIds ? stageIds : 'NA'
      this.classofSeedHarvested = className + ' ' + stageName;
      return className + ' ' + stageName
    }
  }
  convertToRoman(num) {
    const romanNumerals = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    };

    let result = '';

    for (let key in romanNumerals) {
      while (num >= romanNumerals[key]) {
        result += key;
        num -= romanNumerals[key];
      }
    }

    return result;
  }
  getLotNo() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id

    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,

      }
    }
    this.productionService.postRequestCreator('get-lot-number-invest', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : 0;
        console.log(response)
        if (!response) {
          this.lotNo = 1
        } else if (!this.editData) {
          this.lotNo = parseInt(response) + 1;
        } else {
          this.lotNo = this.lotNo
        }
      }
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
}
