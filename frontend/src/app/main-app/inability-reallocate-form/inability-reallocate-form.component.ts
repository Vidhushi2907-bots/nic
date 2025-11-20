import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IAngularMyDpOptions, IMyDate, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { checkDecimal } from 'src/app/_helpers/utility';
import * as html2PDF from 'html2pdf.js';
import { MasterService } from 'src/app/services/master.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-inability-reallocate-form',
  templateUrl: './inability-reallocate-form.component.html',
  styleUrls: ['./inability-reallocate-form.component.css']
})
export class InabilityReallocateFormComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  dummyData = []

  ngForm!: FormGroup
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  dropdownSettings: IDropdownSettings = {}
  inventoryData = []
  allData: any;
  yearData;
  seasonlist
  cropData;
  selectBspc;
  Bspclist: any;
  BspclistSecond: any;
  id;
  todayDate = new Date();
  parsedDate = Date.parse(this.todayDate.toString());
  varietyData
  tableData;
  plotList
  seedProcessingPlantList
  selected_plot = "2023-24/K/0000/A0101/1";
  selectCrop: any;

  croplistSecond;
  varietyListSecond;
  selectVariety: any;
  submitted = false;
  unit: string;
  selectedSeason: string = '';
  isSearchClicked = false;
  isParentalLine = false;
  parentalDataList: any;
  parentalDataListSecond: any;
  // todayDate=new Date()
  plotListSecond: any;
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };
  showGrid: boolean;
  selectParentalLine: any;
  selectPlot: any;
  selectSpp: any;
  seedProcessingPlantListSecond: any;
  selectSeedProcessingPlant: any;
  rangeNumber: number;
  ref_number: number;
  editId: any;
  editData: boolean;
  showPlot: boolean;
  markBagArr;
  maximumRange: number;
  investingBagData: any;
  investingBagDataofId: any;
  bag_marka: any;
  bag_no: any;
  responseValue: any;
  responseValueMax: any;
  bspProforma3DataseedData: any;
  seedClassId: any;
  StageId: any;
  actualRefNO: any;
  breeder: any;
  isInability: boolean = false;
  isHarvestCheck: boolean = false;
  bspsData: any;
  is_update: any;
  targetValueVisible: boolean;
  assignTargetValues: number;
  isVarietyClick: boolean = false;
  isInabilityTable: boolean = false;
  response: any;
  isVarietyDetailsVisible: boolean = false;
  bspcListNew: any;
  get generateDefaultMonth(): string {
    let date = { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }

    //consolelog(date);
    return date.year + '-'
      + (date.month > 9 ? "" : "0") + date.month + '-'
      + (date.day > 9 ? "" : "0") + date.day;

  }
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    // disableSince: {}
    // disableUntil: { year: parseInt(this.y), month: parseInt(this.m)+1, day: this.todayDate.getDate() -1 },
    // disableSince: { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }
  };
  availableBSPCs: any;
  constructor(private service: SeedServiceService,
    private masterService: MasterService, private fb: FormBuilder, private productionService: ProductioncenterService) {
    this.createForm();

  }

  createForm() {
    this.ngForm = this.fb.group({
      id: [],
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: ['', [Validators.required]],
      parental_line: [''],
      crop_text: [''],
      variety_text: [''],
      parental_line_text: [''],
      isInabilityCheck: [false],
      isHarvestCheck: [''],
      bspc: this.fb.array([]),
      reallocate: this.fb.array([]),
      total_dificit: [0]
    });
    if (!this.is_update) {
      this.ngForm.controls['season'].disable()
    }

    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.isInability = false;
        this.bspc.clear();
        this.reallocate.clear();
        this.selectVariety = '';
        this.selectCrop = '';

        // this.selectBspc = '';
        this.ngForm.controls['crop'].reset('');
        this.ngForm.controls['total_dificit'].reset()
        this.getSeasonData();
        this.selectParentalLine = '';
        this.isParentalLine = false;
        if (!this.is_update) {
          this.ngForm.controls['season'].enable()
        }
        this.ngForm.controls['parental_line'].setValue('');
        this.ngForm.controls['variety'].reset('');
        this.selectParentalLine = '';
        this.isSearchClicked = false;
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.bspc.clear();
        this.reallocate.clear();
        // this.is_update = false;
        this.isInability = false;
        this.selectVariety = '';
        this.selectCrop = '';
        this.selectBspc = '';
        this.selectParentalLine = '';
        this.selectPlot = '';
        this.ngForm.controls['crop'].reset('');
        this.ngForm.controls['variety'].reset('');
        this.ngForm.controls['total_dificit'].reset()
        this.isParentalLine = false;
        this.editData = false;
        this.selectParentalLine = '';
        this.getCropData(null)
        this.ngForm.controls['parental_line'].setValue('');
        this.isSearchClicked = false;
        // getCrop();
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.bspc.clear();
        this.reallocate.clear();
        this.isInability = false;
        // this.is_update = false;
        this.ngForm.controls['total_dificit'].reset()
        // this.getVarietyDetails();
        this.selectVariety = '';
        this.selectParentalLine = '';
        if (newvalue.slice(0, 1) == "A") {
          this.unit = "Qt";
        } else {
          this.unit = "Kg";
        }
        this.editData = false;
        this.ngForm.controls['variety'].reset('');
        this.selectParentalLine = '';
        this.ngForm.controls['parental_line'].setValue('');
        this.isSearchClicked = false;
        this.isParentalLine = false;
      }
    });

    this.ngForm.controls['variety'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        if (!this.is_update) {
          this.fetchQntInventryData(null)
          this.getBspcData(null, null);
        }
        this.getVarietyDetails();
        this.isSearchClicked = false;
        // this.is_update = false;
        this.selectParentalLine = '';
        this.selectPlot = '';
        this.editData = false;

        this.isParentalLine = false;
        this.selectParentalLine = '';
        // this.ngForm.controls['parental_line'].setValue('');
        this.ngForm.controls['parental_line'].disable();


        this.isVarietyClick = true;
        // this.getVarietyNotificationYear();
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
        this.cropData = this.croplistSecond
        // this.getCropData()
      }
    });

    this.ngForm.controls['parental_line'].valueChanges.subscribe(item => {
      if (item) {
        // this.selectParentalLine='';
        this.selectPlot = '';
        this.isSearchClicked = false;
        this.showPlot = true
      }
    });
    this.ngForm.controls['variety_text'].valueChanges.subscribe(item => {
      if (item) {
        this.varietyData = this.varietyListSecond;
        let response = this.varietyData.filter(x =>
          x.variety_name.toLowerCase().includes(item.toLowerCase()));
        this.varietyData = response
      }
      else {
        this.varietyData = this.varietyListSecond;
        // this.getVarietyData(this.ngForm.controls['crop'].value);
      }
    });
    this.ngForm.controls['parental_line_text'].valueChanges.subscribe(item => {
      if (item) {
        this.parentalDataList = this.parentalDataListSecond;
        let response = this.parentalDataList.filter(x =>
          x.line_variety_name.toLowerCase().includes(item.toLowerCase()));
        this.parentalDataList = response
      }
      else {
        this.parentalDataList = this.parentalDataListSecond;
        // this.getVarietyData(this.ngForm.controls['crop'].value);
      }
    });



  }

  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }
  get reallocate(): FormArray {
    return this.ngForm.get('reallocate') as FormArray;
  }
  // this.getVarietyData()
  bspcCreateForm(): FormGroup {
    return this.fb.group({
      id: [''],
      plot_no: [''],
      reports: [''],
      target_qnt: [''],
      expected_production: [''],
      estimated_production: [''],
      crop_failure: [''],
      dificit_qnt: [''],
    })
  }
  reallocateCreateForm(): FormGroup {
    return this.fb.group({
      id: [''],
      bspc_id: ['', [Validators.required]],
      bspc_array: [''],
      nucleus_seed_available: [''],
      breeder_seed_available: [''],
      bs_to_bs_permission: [''],
      assign_target: [0, [Validators.required, Validators.min(0.01)]]
    })
  }

  ngOnInit(): void {
    this.addMore(0, null, null);
    this.getYearData();
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'bspc_id',
      textField: 'name',
      // selectAllText: 'Select All',
      // unSelectAllText: 'Unselect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
    // this.fetchQntInventryData(null);
  }
  inabilityStateChange() {
    console.log('check isInabilty', this.ngForm.controls['isInabilityCheck'].value);
    if (this.ngForm.controls['isInabilityCheck'].value == false) {
      this.isInability = true;
    } else {
      this.isInability = false;
    }
  }

  isHarvestStateChange() {
    console.log('check isInabilty', this.ngForm.controls['isHarvestCheck'].value);
    if (this.ngForm.controls['isHarvestCheck'].value == false) {
      this.isHarvestCheck = true;
    } else {
      this.isHarvestCheck = false;
    }
  }

  // getBspcData(i, bspcId) {
  //   this.productionService
  //     .postRequestCreator("get-all-willing-bspc-list-data", {
  //       search: {
  //         crop_code: this.ngForm.controls['crop'].value,
  //         variety_code: this.ngForm.controls['variety'].value
  //       }
  //     })
  //     .subscribe((apiResponse: any) => {
  //       if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
  //         && apiResponse.EncryptedResponse.status_code == 200) {
  //         this.Bspclist = apiResponse.EncryptedResponse.data;
  //         // Sort the list alphabetically by BSPC name
  //         // this.Bspclist.sort((a, b) => a.name.localeCompare(b.name));
  //         // this.BspclistSecond = [...this.Bspclist]; // Preserve original data
  //         this.availableBSPCs = [...this.Bspclist]; 
  //         // this.ngForm.controls['reallocate']['controls'][i].controls['bspc_id'].setValue(bspcId)
  //         if(this.Bspclist && this.Bspclist.length){
  //           let bspcData = this.Bspclist.filter(ele => ele.bspc_id == bspcId)
  //         // if (this.Bspclist && this.Bspclist.length) {
  //         //   let bspcData = this.Bspclist.find(ele => ele.bspc_id == bspcId);
  //           if (bspcData) {
  //             this.ngForm.controls['reallocate']['controls'][i].controls['nucleus_seed_available'].setValue(bspcData[0] && bspcData[0].nucleus_seed_available ? bspcData[0].nucleus_seed_available : 0)
  //             this.ngForm.controls['reallocate']['controls'][i].controls['breeder_seed_available'].setValue(bspcData[0] && bspcData[0].breeder_seed_available ? bspcData[0].breeder_seed_available : 0)
  //             if (bspcData[0].nucleus_seed_available < 1 && bspcData[0].breeder_seed_available < 1) {
  //             // this.ngForm.controls['reallocate']['controls'][i].controls['nucleus_seed_available'].setValue(bspcData.nucleus_seed_available || 0);
  //             // this.ngForm.controls['reallocate']['controls'][i].controls['breeder_seed_available'].setValue(bspcData.breeder_seed_available || 0);
  //             // if (bspcData.nucleus_seed_available < 1 && bspcData.breeder_seed_available < 1) {
  //               this.ngForm.controls['reallocate']['controls'][i].controls['assign_target'].disable();
  //             } else {
  //               this.ngForm.controls['reallocate']['controls'][i].controls['assign_target'].enable();
  //             }
  //           }
  //         }
  //       }
  //     });
  // }

  async getBspcData(i, bspcId) {
    this.productionService
      .postRequestCreator("get-all-willing-bspc-list-data-inability", {
        search: {
          crop_code: this.ngForm.controls['crop'].value,
          variety_code: this.ngForm.controls['variety'].value
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.Bspclist = apiResponse.EncryptedResponse.data;
          this.BspclistSecond = apiResponse.EncryptedResponse.data;
          this.availableBSPCs = [...this.Bspclist];
          // console.log("this.availableBSPCs======", this.availableBSPCs);

          // console.log("this.Bspclist===",this.Bspclist);
          if (this.Bspclist && this.Bspclist.length) {
            let bspcData = this.Bspclist.filter(ele => ele.bspc_id == bspcId)
            if (bspcData) {
              this.ngForm.controls['reallocate']['controls'][i].controls['nucleus_seed_available'].setValue(bspcData[0] && bspcData[0].nucleus_seed_available ? bspcData[0].nucleus_seed_available : 0)
              this.ngForm.controls['reallocate']['controls'][i].controls['breeder_seed_available'].setValue(bspcData[0] && bspcData[0].breeder_seed_available ? bspcData[0].breeder_seed_available : 0)
              if (bspcData[0].nucleus_seed_available < 1 && bspcData[0].breeder_seed_available < 1) {
                this.ngForm.controls['reallocate']['controls'][i].controls['assign_target'].disable();
              } else {
                this.ngForm.controls['reallocate']['controls'][i].controls['assign_target'].enable();
              }
            }
          }
          this.ngForm.controls['reallocate']['controls'][i].controls['bspc_id'].setValue(bspcId)
        }
      });
    // return this.availableBSPCs;
  }
  async getBspcDataForEdit(i, bspcId) {
    this.productionService
      .postRequestCreator("get-all-willing-bspc-list-data-inability", {
        search: {
          crop_code: this.ngForm.controls['crop'].value,
          variety_code: this.ngForm.controls['variety'].value
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          let editBspcData = apiResponse.EncryptedResponse.data;
          if (editBspcData && editBspcData.length) {
            let bspcData = editBspcData.filter(ele => ele.bspc_id == bspcId)
            if (bspcData) {
              this.ngForm.controls['reallocate']['controls'][i].controls['bspc_array'].setValue([{
                'bspc_id': bspcData && bspcData[0] && bspcData[0].bspc_id,
                'name': bspcData && bspcData[0] && bspcData[0].name
              }]);
              this.ngForm.controls['reallocate']['controls'][i].controls['nucleus_seed_available'].setValue(bspcData[0] && bspcData[0].nucleus_seed_available ? bspcData[0].nucleus_seed_available : 0)
              this.ngForm.controls['reallocate']['controls'][i].controls['breeder_seed_available'].setValue(bspcData[0] && bspcData[0].breeder_seed_available ? bspcData[0].breeder_seed_available : 0)
              if (bspcData[0].nucleus_seed_available < 1 && bspcData[0].breeder_seed_available < 1) {
                this.ngForm.controls['reallocate']['controls'][i].controls['assign_target'].disable();
              } else {
                this.ngForm.controls['reallocate']['controls'][i].controls['assign_target'].enable();
              }
            }
          }
          this.ngForm.controls['reallocate']['controls'][i].controls['bspc_id'].setValue(bspcId)
        }
      });
  }

  fetchQntInventryData(data = null, item = null) {
    // let bspcDataValue;

    if (data) {
      this.bspc.clear();
      this.reallocate.clear();
      let totalDificit = 0;
      this.Bspclist = [];
      for (let i = 0; i < data.inability_data.length; i++) {
        this.addBspc(i);
        let dificitamount = 0
        if (data.inability_data[i].crop_failure == 1) {
          dificitamount = parseFloat(data.inability_data[i].target_qnt)
        } else {
          if (parseFloat(data.inability_data[i].target_qnt) < parseFloat(data.inability_data[i].estimated_production)) {
            dificitamount = 0;
          } else {
            dificitamount = parseFloat(data.inability_data[i].target_qnt) - parseFloat(data.inability_data[i].estimated_production);
          }
        }

        totalDificit += dificitamount;
        this.ngForm.controls['bspc']['controls'][i].patchValue({
          plot_no: data.inability_data[i].plot ? data.inability_data[i].plot : '',
          reports: data.inability_data[i].reports ? data.inability_data[i].reports : 'NA',
          target_qnt: data.inability_data[i].target_qnt ? data.inability_data[i].target_qnt : 0,
          expected_production: data.inability_data[i].expected_production ? data.inability_data[i].expected_production : 0,
          estimated_production: data.inability_data[i].estimated_production ? data.inability_data[i].estimated_production : 0,
          crop_failure: data.inability_data[i].crop_failure ? (data.inability_data[i].crop_failure == 1 ? true : false) : '',
          dificit_qnt: dificitamount,
        });
      }
      for (let i = 0; i < data.bspc_reallocate_data.length; i++) {

        this.addMore(i, null, null);
        this.getBspcDataForEdit(i, data.bspc_reallocate_data[i].bspc_id);
        console.log('data.bspc_reallocate_data[i].bspc_id', data.bspc_reallocate_data[i].bspc_id);
        console.log('this.Bspclist===', this.Bspclist);
        this.ngForm.controls['reallocate']['controls'][i].controls['nucleus_seed_available'].setValue(data.bspc_reallocate_data[i] && data.bspc_reallocate_data[i].nucleus_seed_available ? data.bspc_reallocate_data[i].nucleus_seed_available : 0)
        this.ngForm.controls['reallocate']['controls'][i].controls['breeder_seed_available'].setValue(data.bspc_reallocate_data[i] && data.bspc_reallocate_data[i].breeder_seed_available ? data.bspc_reallocate_data[i].breeder_seed_available : 0)
        if (data.bspc_reallocate_data[i].nucleus_seed_available < 1 && data.bspc_reallocate_data[i].breeder_seed_available < 1) {
          this.ngForm.controls['reallocate']['controls'][i].controls['assign_target'].disable();
        } else {
          this.ngForm.controls['reallocate']['controls'][i].controls['assign_target'].enable();
        }

        this.ngForm.controls['reallocate']['controls'][i].patchValue({
          bspc_id: data && data.bspc_reallocate_data && data.bspc_reallocate_data[i] && data.bspc_reallocate_data[i].bspc_id ? data.bspc_reallocate_data[i].bspc_id : null,
          id: data.bspc_reallocate_data[i].id,
          bs_to_bs_permission: (data.bspc_reallocate_data && data.bspc_reallocate_data[i] && data.bspc_reallocate_data[i].isPermission),
          assign_target: data.bspc_reallocate_data && data.bspc_reallocate_data[i] && data.bspc_reallocate_data[i].target_qunatity ? data.bspc_reallocate_data[i].target_qunatity : 0,
        });
      }


      this.ngForm.controls['total_dificit'].setValue(totalDificit)
      let assignTargetValue = 0;
      for (let i = 0; i < this.reallocate.controls.length; i++) {
        if (this.reallocate.controls[i]['controls'].assign_target.value) {
          assignTargetValue += this.reallocate.controls[i]['controls'].assign_target.value
        }
      }
      this.assignTargetValues = assignTargetValue;
      if (this.ngForm.controls['total_dificit'].value >= assignTargetValue) {
        this.targetValueVisible = true;
      } else {
        this.targetValueVisible = false;
      }
      // this.getFilteredOptions(null);
    } else {
      const getLocalData = localStorage.getItem('BHTCurrentUser');
      let localStoragedata = JSON.parse(getLocalData)
      let UserId = localStoragedata.id
      let route = "get-inability-intake-variety-plot";
      let param = {
        search: {
          user_id: UserId,
          year: this.ngForm.controls['year'].value,
          season: this.ngForm.controls['season'].value,
          crop_code: this.ngForm.controls['crop'].value,
          variety_code: this.ngForm.controls['variety'].value,
          variety_line_code: this.ngForm.controls['parental_line'].value,
          form_type: "inability_form"
        }
      };
      this.productionService.postRequestCreator(route, param, null).subscribe(res => {
        if (res.EncryptedResponse.status_code === 200) {
          this.bspsData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
          let totalDificit = 0;
          this.bspc.clear();
          this.reallocate.clear();
          if (this.bspsData && this.bspsData.length) {
            this.addMore(0, null, null);
            for (let i = 0; i < this.bspsData.length; i++) {

              this.addBspc(i);
              let dificitamount = 0

              if (parseFloat(this.bspsData[i].target_qnt) < parseFloat(this.bspsData[i].estimated_production)) {
                dificitamount = 0;
              } else {
                dificitamount = (this.bspsData[i].target_qnt) - (this.bspsData[i].estimated_production);
              }
              totalDificit += dificitamount
              this.ngForm.controls['bspc']['controls'][i].patchValue({
                plot_no: this.bspsData[i].field_code ? this.bspsData[i].field_code : 0,
                reports: this.bspsData[i].report ? this.bspsData[i].report : 0,
                target_qnt: this.bspsData[i].target_qnt ? this.bspsData[i].target_qnt : 0,
                expected_production: this.bspsData[i].expected_production ? this.bspsData[i].expected_production : 0,
                estimated_production: this.bspsData[i].estimated_production ? this.bspsData[i].estimated_production : 0,
                dificit_qnt: dificitamount,
              });
            }

            let assignTargetValue = 0;
            this.ngForm.controls['total_dificit'].setValue(totalDificit)
            for (let i = 0; i < this.reallocate.controls.length; i++) {
              if (this.reallocate.controls[i]['controls'].assign_target.value) {
                assignTargetValue += this.reallocate.controls[i]['controls'].assign_target.value
              }
            }
            this.assignTargetValues = assignTargetValue
            if (this.ngForm.controls['total_dificit'].value >= assignTargetValue) {
              this.targetValueVisible = true;
            } else {
              this.targetValueVisible = false;
            }
          }
        }
      });
    }
  }

  addBspc(i) {
    this.bspc.push(this.bspcCreateForm());
  }

  removeBspc(value: number) {
    // console.log("bspc length", this.ngForm.controls['bspc'].value.length);
    this.bspc.removeAt(value);
  }

  addMore(i, status, bspcId) {
    this.reallocate.push(this.reallocateCreateForm());
  }

  remove(value: number) {
    this.reallocate.removeAt(value);
  }
  getSelectedBSPC(index: number) {
    // let selectedBSPCData;
    // const selectedBSPC = this.reallocate.at(index).get('bspc')?.value;
    // if (selectedBSPC) {
    //   let bspcDataArray = this.Bspclist.filter(ele => ele.bspc_id == selectedBSPC);
    //   console.log("bspcDataArraychangesValue===",bspcDataArray);
    //   selectedBSPCData = bspcDataArray[0];
    // }

    // return selectedBSPCData ? [selectedBSPCData] : [];
  }
  crop(item: any) {
    this.selectCrop = item && item.crop_name ? item.crop_name : ''
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropData = this.croplistSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
  }

  variety(item: any) {
    this.selectVariety = item && item.variety_name ? item.variety_name : ''
    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })

    this.varietyData = this.varietyListSecond;
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false, onlySelf: true })
    if (item && item.status && item.status == 'hybrid') {
      this.isParentalLine = true;
      this.showPlot = false;
    } else {
      this.showPlot = true;
      this.isParentalLine = false;
      this.getVarietyLine()
    }
  }

  selectParentalData(item) {
    this.selectParentalLine = item && item.line_variety_name ? item.line_variety_name : ''
    // this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    this.parentalDataList = this.parentalDataListSecond
    this.ngForm.controls['parental_line_text'].setValue('', { emitEvent: false, onlySelf: true })
    // this.line = this.varietyListSecond;
    this.ngForm.controls['parental_line'].setValue(item && item.variety_line_code ? item.variety_line_code : '')

  }

  selectPlotData(item) {
    this.selectPlot = item && item.field_code ? item.field_code : ''
    // this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    this.ngForm.controls['plot'].setValue(item && item.field_code ? item.field_code : '')
    this.plotList = this.plotListSecond;
    this.ngForm.controls['plot_text'].setValue('', { emitEvent: false, onlySelf: true })
    // this.line = this.varietyListSecond;

  }
  selectSppData(item) {
    this.selectSeedProcessingPlant = item && item.name ? item.name : ''

    this.seedProcessingPlantList = this.seedProcessingPlantListSecond;
    // this.line = this.varietyListSecond;
    this.ngForm.controls['spp_text'].setValue('', { emitEvent: false, onlySelf: true })
    this.ngForm.controls['processing_plant'].setValue(item && item.user_id ? item.user_id : '')
    console.log(this.ngForm.controls['processing_plant'].value, 'val')
  }

  cClick() {
    document.getElementById('crop').click();
  }
  cClick1() {
    document.getElementById('Bspclist').click();
  }

  vClick() {
    document.getElementById('variety').click();
  }

  pClick() {
    document.getElementById('parentalline').click();
  }
  plClick() {
    document.getElementById('plot').click();
  }
  sppClick() {
    document.getElementById('spp').click();
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

  searchData(data: any) {
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
    } else {
      this.isInability = true;
      this.isInabilityTable = true;
      this.bspc.clear();
      this.reallocate.clear();
      this.getVarietyData();
      this.TableData();
    }

  }

  clearData() {
    if (this.varietyData.length) {
      this.isInability = true
    } else {
      this.isInability = false
    }
    this.selectVariety = '';
    this.ngForm.controls['total_dificit'].reset();
    this.ngForm.controls['id'].setValue('')
    // this.selectCrop = '';
    // this.ngForm.controls['crop'].reset('');
    // this.ngForm.controls['season'].reset('');
    // this.ngForm.controls['year'].patchValue('');
    // this.ngForm.controls['year'].markAsUntouched();
    this.ngForm.controls['variety'].reset('');
    // this.ngForm.controls['plot'].reset('');
    this.ngForm.controls['parental_line'].reset('');
    this.selectParentalLine = '';
    this.selectPlot = ''
    this.selectSeedProcessingPlant = '';
    // bag_marka
    this.editData = false;
    this.isSearchClicked = false;
  }

  getYearData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        form_type: "inability_form"
      }
    }
    this.productionService.postRequestCreator('get-harvesting-inatake-year', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.yearData = response ? response : '';

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
        year: this.ngForm.controls['year'].value,
        form_type: "inability_form"
      }
    }
    this.productionService.postRequestCreator('get-harvesting-inatake-season', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.seasonlist = response ? response : '';

      }
    })
  }

  getCropData(dataValue) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        form_type: "inability_form"
      }
    }
    this.productionService.postRequestCreator('get-harvesting-inatake-crop', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.cropData = response ? response : '';
        this.croplistSecond = this.cropData
        if (dataValue) {
          let cropValue = this.cropData.filter(ele => ele.crop_code == dataValue)
          this.selectCrop = cropValue && cropValue[0] && cropValue[0].crop_name
        }
      }
    })
  }

  getVarietyData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        form_type: "inability_form"
      }
    }
    this.productionService.postRequestCreator('get-harvesting-inatake-variety-inability', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.varietyData = response ? response : '';
        this.varietyListSecond = this.varietyData
        if (this.varietyData.length) {
          this.isInability = true
        } else {
          this.isInability = false
        }
      }
    })
  }

  getVarietyDataFilter(dataValue) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        form_type: "inability_form"
      }
    }
    this.productionService.postRequestCreator('get-harvesting-inatake-variety', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.varietyData = response ? response : '';
        this.varietyListSecond = this.varietyData
        console.log(this.varietyData);
        let varietyDataValue = this.varietyData.filter(ele => ele.variety_code == dataValue);
        this.selectVariety = varietyDataValue && varietyDataValue[0] && varietyDataValue[0].variety_name;
      }
    })
  }
  getVarietyLine() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        form_type: "inability_form"
      }
    }
    this.productionService.postRequestCreator('get-harvesting-inatake-variety-line', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.parentalDataList = response ? response : '';
        this.parentalDataListSecond = this.parentalDataList
      } if (data.EncryptedResponse.status_code == 200) {
        this.ngForm.controls['parental_line'].setValue('');
        this.parentalDataList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : [];
        if (this.parentalDataList && this.parentalDataList.length) {
          this.ngForm.controls['parental_line'].enable();
        } else {
          this.ngForm.controls['parental_line'].disable();
        }
      } else {
        this.ngForm.controls['parental_line'].disable();
      }

    })
  }
  getVarietyLineFilter(dataValue) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        form_type: "inability_form"
      }
    }
    this.productionService.postRequestCreator('get-harvesting-inatake-variety-line', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.parentalDataList = response ? response : '';
        this.parentalDataListSecond = this.parentalDataList
        let lineVarietyData = this.parentalDataList.filter(ele => ele.variety_code_line == dataValue)
        let lineVarietyDataName = lineVarietyData && lineVarietyData[0] && lineVarietyData[0].line_variet_name
        this.selectParentalLine = lineVarietyDataName;
      }
    })
  }



  dificitQntUpdate(event, i) {
    // console.log('event.target.checked===', event.target.checked);
    // console.log("event", event.target.checked)
    if (event.target.checked) {
      this.ngForm.controls['bspc']['controls'][i].controls['dificit_qnt'].setValue(this.ngForm.controls['bspc']['controls'][i].controls['target_qnt'].value)
    } else if (!event.target.checked) {
      if (this.ngForm.controls['bspc']['controls'][i].controls['target_qnt'].value < this.ngForm.controls['bspc']['controls'][i].controls['estimated_production'].value) {
        this.ngForm.controls['bspc']['controls'][i].controls['dificit_qnt'].setValue(0)
      } else {
        this.ngForm.controls['bspc']['controls'][i].controls['dificit_qnt'].setValue(this.ngForm.controls['bspc']['controls'][i].controls['target_qnt'].value - this.ngForm.controls['bspc']['controls'][i].controls['estimated_production'].value)
      }
    }
    else {
      this.ngForm.controls['bspc']['controls'][i].controls['dificit_qnt'].setValue(this.ngForm.controls['bspc']['controls'][i].controls['target_qnt'].value - this.ngForm.controls['bspc']['controls'][i].controls['estimated_production'].value)
    }
    // total_dificit
    let dificitQnt = 0;
    for (let i = 0; i < this.bspc.controls.length; i++) {
      dificitQnt += this.ngForm.controls['bspc']['controls'][i].controls['dificit_qnt'].value
    }

    this.ngForm.controls['total_dificit'].setValue(dificitQnt);
  }
  getFilteredOptions(index: number) {
    // Get all selected bspc_ids as integers, except for the current dropdown

    const selectedIds = this.reallocate.controls
      .map((control, idx) => idx !== index ? parseInt(control.get('bspc_id')?.value, 10) : null) // (bspcData && bspcData.bspc_id):null)//old code => parseInt(control.get('bspc_id')?.value, 10) : null)
      .filter(id => id !== null);
    console.log('selectedIds===1', selectedIds);
    return this.Bspclist.filter(option => !selectedIds.includes(option.bspc_id));
    // selectedIds = [5290];
    // Return BSPC options that are not selected in other dropdowns
    // if(selectedIds && selectedIds.length){

    // }else{
    //   return this.Bspclist;
    // }
  }

  bspcDetailsData($event, index, data) {
    this.ngForm.controls['reallocate']['controls'][index].controls['bspc_id'].setValue(data);
    // this.ngForm.controls['bsp1Arr']['controls'][index].controls['designation_text'].setValue('');
  }

  bspcDetails(event, index, editData) {
    this.ngForm.controls['reallocate']['controls'][index].controls['bspc_id'].setValue(editData ? editData : event.bspc_id ? event.bspc_id : null)
    let bspcDataValue;
    if (editData) {
      bspcDataValue = this.Bspclist.filter(option => option.bspc_id = editData);
      this.ngForm.controls['reallocate']['controls'][index].controls['bspc_array'].setValue(bspcDataValue[0])
      console.log('bspc_array====', this.ngForm.controls['reallocate']['controls'][index].controls['bspc_array'].value)
    }
    console.log('bspc_id===', this.ngForm.controls['reallocate']['controls'][index].controls['bspc_id'].value);
    if (editData || (event && event.bspc_id)) {
      // old code 
      // let bspcData = this.BspclistSecond.filter(ele => ele.bspc_id == (editData ? editData : event.target.value ? event.target.value : null))
      // new code
      let bspcData = this.BspclistSecond.filter(ele => ele.bspc_id == (editData ? editData : event.bspc_id ? event.bspc_id : null))

      if (bspcData && bspcData[0]) {
        this.ngForm.controls['reallocate']['controls'][index].controls['nucleus_seed_available'].setValue(bspcData[0] && bspcData[0].nucleus_seed_available ? bspcData[0].nucleus_seed_available : 0)
        this.ngForm.controls['reallocate']['controls'][index].controls['breeder_seed_available'].setValue(bspcData[0] && bspcData[0].breeder_seed_available ? bspcData[0].breeder_seed_available : 0)
        if (this.ngForm.controls['reallocate']['controls'][index].controls['breeder_seed_available'].value == 0) {
          this.ngForm.controls['reallocate']['controls'][index].controls['bs_to_bs_permission'].disable();
        } else {
          this.ngForm.controls['reallocate']['controls'][index].controls['bs_to_bs_permission'].enable();
        }
        console.log('bspcData[0].nucleus_seed_available < 1 && bspcData[0].breeder_seed_available < 1====', bspcData[0].nucleus_seed_available < 1 && bspcData[0].breeder_seed_available < 1);
        if (bspcData[0].nucleus_seed_available == 0 && bspcData[0].breeder_seed_available == 0) {
          // alert("hiii")
          this.ngForm.controls['reallocate']['controls'][index].controls['assign_target'].disable();
        } else {
          this.ngForm.controls['reallocate']['controls'][index].controls['assign_target'].enable();
        }
      }
    }
  }

  TableData() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData);
    let UserId = data.id;

    const param = {
      search: {
        user_id: UserId,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        // variety_code: this.ngForm.controls['variety'].value,
      }
    };

    this.productionService.postRequestCreator('get-inability-reallocated-data', param).subscribe((data: any) => {
      if (data?.EncryptedResponse?.status_code == 200) {
        this.tableData = data?.EncryptedResponse?.data || [];
        // console.log("hi..."), response;

        // Assign to tableData
        // this.tableData = response.map(item => ({
        //   id: item.id,
        //   year: item.year,
        //   season: item.season,
        //   crop_code: item.crop_code,
        //   variety_code: item.variety_code,
        //   bspcData: item.bspc_reallocate_data,
        //   total_dificit: item.total_dificit
        // }));
      }
    });
  }

  delete(id) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {

        this.productionService
          .getRequestCreatorNew("delete-inability-reallocated-data/" + id)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              Swal.fire({
                title: "Deleted!",
                text: "Your data has been deleted.",
                icon: "success"
              }).then(x => {
                this.getVarietyData();
                this.getBspcData(null, null);
                this.TableData();
                this.isInability = true;
              })
              // this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });

      }
    })
  }
  getVarietyDetails() {
    this.isVarietyDetailsVisible = true;
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id

    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        user_id: UserId ? UserId.toString() : '',
        form_type: "inability_form"
      }
    }
    this.productionService.postRequestCreator('get-bsp-proforma-1s-varieties-level-1-phase-2', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.response = response;
    })
  }

  editDataForm(data) {

    if (data) {
      if (data.id) {
        this.is_update = true;
      } else {
        this.is_update = false;
      }
      this.getSeasonData();
      this.getVarietyDetails();
      this.getBspcData(null, null);
      this.getVarietyLineFilter(data.variety_line_code);
      this.getVarietyDataFilter(data.variety_code);
      this.getCropData(data.crop_code);
      this.ngForm.controls['id'].setValue(data.id);
      this.ngForm.controls['year'].setValue(data.year, { emiteEvent: false });
      this.ngForm.controls['season'].setValue(data.season, { emiteEvent: false });
      this.ngForm.controls['crop'].setValue(data.crop_code, { emiteEvent: false });
      this.ngForm.controls['variety'].setValue(data.variety_code, { emiteEvent: false });
      if (data && data.variety_line_code) {
        this.ngForm.controls['parental_line'].setValue(data.variety_line_code, { emiteEvent: false });
      }
      this.fetchQntInventryData(data);
      this.isInability = true;
      this.isVarietyClick = true;
    }
  }
  cancelData() {
    this.bspc.clear();
    this.reallocate.clear();
    this.ngForm.controls['variety'].reset();
    this.selectVariety = "";
    this.ngForm.controls['parental_line'].reset();
    this.ngForm.controls['total_dificit'].reset();
    this.ngForm.controls['id'].reset();
    this.is_update = false;
    this.isVarietyClick = false;
    this.getVarietyData();
  }

  saveData() {
    this.submitted = true;
    if (this.ngForm.invalid) {
      Swal.fire(
        {
          icon: 'error',
          title: 'Please Fill the Form Properly',
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonColor: '#B64B1D'
        }
      )
      return;
    }
    let sumOfAssignTargetValue = 0;
    this.reallocate.value.forEach((element, i) => {
      if (parseFloat(this.ngForm.controls['reallocate']['controls'][i].controls['assign_target'].value) <= 0) {
        Swal.fire(
          {
            icon: 'error',
            title: 'Assign Target Should Not  Be Zero',
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonColor: '#B64B1D'
          }
        )
        return;
      }
      // console.log(element.assign_target);
      // if (element && Number(element.assign_target) === 0) {
      //   Swal.fire(
      //     {
      //       icon: 'error',
      //       title: 'Assign Target Should Not  Be Zero',
      //       showConfirmButton: true,
      //       showCancelButton: false,
      //       confirmButtonColor: '#B64B1D'
      //     }
      //   )
      //   return;
      // }
    });
    // for (let i = 0; i <= this.reallocate.value.length; i++) {
    //   console.log(this.reallocate.value[i].assign_target);
    //   console.log(i);
    //   if (this.reallocate.value && this.reallocate.value[i] && Number(this.reallocate.value[i].assign_target) === 0) {
    //     Swal.fire(
    //       {
    //         icon: 'error',
    //         title: 'Assign Target Should Not  Be Zero',
    //         showConfirmButton: true,
    //         showCancelButton: false,
    //         confirmButtonColor: '#B64B1D'
    //       }
    //     )
    //     return;
    //   }
    // }
    // return;
    for (let key of this.reallocate.value) {
      sumOfAssignTargetValue += parseFloat(key.assign_target);
    }

    if ((sumOfAssignTargetValue) > this.ngForm.controls['total_dificit'].value) {
      Swal.fire(
        {
          icon: 'error',
          title: 'Assign Target Should Be Less Than or Equal To Total Difict',
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonColor: '#B64B1D'
        }
      )
      return;
    } else {
      // return;
      let formData = {
        "id": this.ngForm.controls['id'].value ? this.ngForm.controls['id'].value : '',
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "variety_code": this.ngForm.controls['variety'].value,
        "variety_line_code": this.ngForm.controls['parental_line'].value,
        "total_dificit": this.ngForm.controls['total_dificit'].value,
        "inability_data": this.ngForm.controls['bspc'].value,
        "bspc_reallocate_data": this.ngForm.controls['reallocate'].value,
      }
      let actionMessage = ""
      if (this.ngForm.controls['id'].value) {
        actionMessage = "Updated"
      } else {
        actionMessage = "Saved"
      }
      this.productionService.postRequestCreator('modify-inability-reallocated-data', formData).subscribe(data => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
          Swal.fire(
            {
              icon: 'success',
              title: 'Data ' + actionMessage + ' Successfully',
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonColor: '#B64B1D'
            }
          ).then(x => {
            if (x.isConfirmed) {
              this.getVarietyData();
              // this.getBspcData(null,null);
              this.TableData();
              this.isInability = false;
              this.isInabilityTable = true;
              this.isVarietyClick = false;
              this.is_update = false;
              this.clearData();
              this.submitted = false;
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

  inputNumber(event) {
    // checkNumber(event)
    const numCharacters = /[0-9.]+/g;
    if (event.which == 190 || event.which != 17 && event.which != 86 && event.which != 8 && event.which != 9 && event.which != 37 && event.which != 39 && event.which != 46 && numCharacters.test(event.key) == false) {
      event.preventDefault();
    }

  }

  checkDecimal($e) {
    checkDecimal($e)
  }

  validateInput(event) {
    // Get the current input value
    let input = event.target.value;
    if (event.keyCode == 8) {
      return;
    }
    // Check if input is a valid number with at most two decimal places
    if (/^\d*\.?\d{0,1}$/.test(input)) {
      // Input is valid
    } else {
      // Input is invalid, prevent further input
      event.preventDefault();
    }
  }

  download() {
    // this.getQr()
    const name = 'harvest-report';
    const element = document.getElementById('pdf-tables');
    const options = {
      filename: `${name}.pdf`,
      margin: [10, 0],
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
      pagebreak: { after: ['#page-break1'], avoid: 'img' },
    };
    // const pdf = new html2PDF(element, options);

    // pdf.addPage();
    html2PDF().set(options).from(element).toPdf().save();

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

  // Example usage:
  getBreederData(id, stageId) {
    if (id) {
      let name = 'Breeder Seed';
      let stageIds;
      if (stageId) {
        stageIds = id == 6 ? this.convertToRoman(1) : this.convertToRoman(stageId + 1);
      }
      let className = name ? name : 'NA';
      let stageName = stageIds ? stageIds : 'NA'
      return className + ' ' + stageName
    }
  }
  filterBspcName(e, i) {
    if (e) {
      console.log('filter datata ', e)
      this.Bspclist = this.BspclistSecond.filter(x => x.name.toLowerCase().includes(e.toLowerCase()))
      // this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id.designationList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id.designationListSecond;
      // if (this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id.designationListSecond && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id.designationListSecond.length > 0) {
      //   this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id.designationList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id.designationListSecond.filter(x => x.name.toLowerCase().includes(e.toLowerCase()))
      // }
    } else {
      this.getBspcData(null, null)
    }

  }
}