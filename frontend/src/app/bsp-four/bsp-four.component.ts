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
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bsp-four',
  templateUrl: './bsp-four.component.html',
  styleUrls: ['./bsp-four.component.css']
})
export class BspFourComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  dummyData = []

  ngForm!: FormGroup
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []
  allData: any;
  yearData;
  seasonlist;

  cropData;
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
  cropDataSecond: any;
  totalVarities: any;
  totalQuanitynational: any;
  totalQuanitydirect: any;
  seedProcessingRegister: any;
  disableField: boolean;
  totalCarryOver: number;
  totalDirectindentQty: number;
  // fileName: string;
  fileName = 'availability-of-breeder-seed.xlsx';
  nationalQty: number;
  total_processed_qty: any;
  today = new Date();
  totalBreederAvailable: number;
  total_processed_qty_second_value: any;
  is_potato: boolean = false;
  colomtext: string;
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
  constructor(private service: SeedServiceService, private fb: FormBuilder, private productionService: ProductioncenterService) {
    this.createForm();
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      crop_text: [''],
      allocate_qty: [''],
      bspc: this.fb.array([

        // this.bspcCreateForm()
      ])
    });
    this.ngForm.controls['season'].disable();


    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['season'].enable();
        this.selectVariety = '';
        this.selectCrop = '';
        this.ngForm.controls['crop'].reset('');
        // this.getSeasonData()
        this.selectParentalLine = '';
        this.editData = false;
        this.selectPlot = '';
        this.isParentalLine = false;

        this.ngForm.controls['season'].markAsUntouched();
        this.selectParentalLine = '';
        this.isSearchClicked = false;
        this.getSeason();
        this.showGrid = false;


      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.selectVariety = '';
        this.selectCrop = '';
        this.selectParentalLine = '';
        this.selectPlot = '';
        this.ngForm.controls['crop'].reset('');
        this.isParentalLine = false;
        this.editData = false;
        this.selectParentalLine = '';
        // this.getCropData()
        this.isSearchClicked = false;
        this.getCrop();
        this.showGrid = false;
        // getCrop();
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {

        this.selectVariety = '';
        this.selectParentalLine = '';
        if (newvalue.slice(0, 1) == "A") {
          this.unit = "Quintal";
        } else {
          this.unit = "Kg";
        }
        this.selectPlot = '';
        this.editData = false;
        this.selectParentalLine = '';
        this.isSearchClicked = false;
        this.isParentalLine = false;
        this.showGrid = false;
        // this.getVarietyData()
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
        this.cropData = this.croplistSecond
        // this.getCropData()
      }
    });


  }

  ngOnInit(): void {
    this.getYear();
  }
  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }
  crop(item: any) {
    this.selectCrop = item && item.crop_name ? item.crop_name : ''
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropData = this.croplistSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
    if (this.ngForm.controls['crop'].value == "H1101") {
      this.is_potato = false;
      this.colomtext = "Estimated"
    } else {
      this.is_potato = true;
    }
  }
  cClick() {
    document.getElementById('crop').click()
  }
  bspcCreateForm(): FormGroup {
    return this.fb.group({
      // variety_name: [''],
      // line_variety_name: [''],
      // line_variety_code: [''],
      // carry_over: [''],
      // breeder_seed_produced: [''],
      // total_breeder_seed: [''],
      // total_nation_qty: [''],
      // total_direct_qty: [''],
      // line_variet_name:[''],
      // allocate_qty:['']
      variety_name: [],
      line_variety_name: [],
      line_variety_code: [''],
      breeder_seed_produced: [],
      bsp2_qty: [],
      bsp2_per_qty: [Validators.min(1),
      Validators.max(100),],
      bsp3_qty: [],
      bsp3_per_qty: [Validators.min(1),
      Validators.max(100),],
      intake_vrfictn_qty: [],
      intake_vrfictn__pr_qty: [Validators.min(1),
      Validators.max(100),],
      check_letest: [],
      total_nation_qty: [],
      total_direct_qty: [],
      allocate_qty: [''],
      variety_code: [''],
      total_carry_over_qty: [''],
      total_breeder_seed_available_over_qty: [''],
      available_id: []

    })
  }
  searchData(data) {
    this.showGrid = true;
    this.getDataofBspFour();
    this.getTotalQtyofCrop();
  }
  getYear() {
    // get-year-of-bsp-four
    this.productionService.postRequestCreator('get-year-of-bsp-four', null).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : 0;
        if (response && response.length > 0) {
          response = response.filter(x => x.value != "");
        }
        this.yearData = response ? response : '';
      }
    })
  }
  getSeason() {
    const param = {
      search: {
        year: this.ngForm.controls['year'].value
      }
    }
    // get-year-of-bsp-four
    this.productionService.postRequestCreator('get-season-of-bsp-four', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : 0;
        if (response && response.length > 0) {
          response = response.filter(x => x.value != "");
        }
        this.seasonlist = response ? response : '';

      }
    })
  }
  getCrop() {
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value
      }
    }
    // get-year-of-bsp-four
    this.productionService.postRequestCreator('get-crop-of-bsp-four', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : 0;
        this.cropData = response ? response : '';
        this.croplistSecond = this.cropData;
      }
    })
  }
  getTotalQtyofCrop() {
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value
      }
    }
    // get-year-of-bsp-four
    this.productionService.postRequestCreator('get-total-qty-of-bsp-four', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : 0;
        // this.totalVarities = response && response.counRegister ? response.counRegister : '';
        this.totalQuanitynational = response && response.bspPerformaBspOne && response.bspPerformaBspOne[0] ? response.bspPerformaBspOne[0] : '';
        this.totalQuanitydirect = response && response.directIndent && response.directIndent[0] ? response.directIndent[0] : '';
        this.seedProcessingRegister = response && response.seedProcessingRegister && response.seedProcessingRegister[0] ? response.seedProcessingRegister[0] : '';
        let generateSampleForwardingLetters = response && response.generateSampleForwardingLetters ? response.generateSampleForwardingLetters : '';

        console.log(this.tableData, 'generateSampleForwardingLetters')
        if (generateSampleForwardingLetters && generateSampleForwardingLetters.length > 0) {
          generateSampleForwardingLetters = generateSampleForwardingLetters.filter(x => x.variety_line_code != null && x.variety_code_line == null)
        }
      }
    })
  }
  getDataofBspFour() {
    this.showGrid = true;
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value
      }
    }
    // get-year-of-bsp-four
    this.productionService.postRequestCreator('get-data-of-bsp-four', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : 0;
        if (response) {
          let seedProcess = response && response.seedProcess ? response.seedProcess : '';
          let seedProcessBreederSeedProuced = response && response.seedProcessBreederSeedProuced ? response.seedProcessBreederSeedProuced : '';
          let seedProcessBreederSeedProuced2 = response && response.seedProcessBreederSeedProuced2 ? response.seedProcessBreederSeedProuced2 : '';
          let seedProcessBreederSeedProuced3 = response && response.seedProcessBreederSeedProuced3 ? response.seedProcessBreederSeedProuced3 : '';
          let bspOne = response && response.bspOne ? response.bspOne : '';
          let directData = response && response.directData ? response.directData : '';
          let directDatawithoutlineCode = response && response.directDatawithoutlineCode ? response.directDatawithoutlineCode : '';
          let generateSampleForwardingLettersData = response && response.generateSampleForwardingLettersData ? response.generateSampleForwardingLettersData : '';
          let availabilityOfBreederSeed = response && response.availabilityOfBreederSeed ? response.availabilityOfBreederSeed : '';
          let seedProcessBreederSeedProucedtotal = response && response.seedProcessBreederSeedProucedtotal ? response.seedProcessBreederSeedProucedtotal : '';
          // let generateSampleForwardingLettersData = response && response.generateSampleForwardingLettersData ? response.generateSampleForwardingLettersData :'';
          let generateSampleForwardingLetters2 = response && response.generateSampleForwardingLetters2 ? response.generateSampleForwardingLetters2 : '';
          let generateSampleForwardingLetters3 = response && response.generateSampleForwardingLetters3 ? response.generateSampleForwardingLetters3 : '';
          let generateSampleForwardingLetters4 = response && response.generateSampleForwardingLetters3 ? response.generateSampleForwardingLetters3 : '';
          let finalArray = []

          if (seedProcess && seedProcess.length > 0) {
            if (seedProcessBreederSeedProuced && seedProcessBreederSeedProuced.length > 0) {
              const result = seedProcess.map(variety => {
                let quantityObj;
                if (variety.variety_code_line) {
                  quantityObj = seedProcessBreederSeedProuced.find(q => q.variety_code === variety.variety_code && q.variety_code_line === variety.variety_code_line);
                } else {
                  quantityObj = seedProcessBreederSeedProuced.find(q => q.variety_code === variety.variety_code);
                }
                const total_processed_qty = quantityObj ? quantityObj.total_processed_qty : 0;
                return { ...variety, total_processed_qty };
              });
              seedProcess = result
            }
          }
          if (seedProcess && seedProcess.length > 0) {
            if (seedProcessBreederSeedProuced2 && seedProcessBreederSeedProuced2.length > 0) {
              const result = seedProcess.map(variety => {
                let quantityObj;
                if (variety.variety_code_line) {
                  quantityObj = seedProcessBreederSeedProuced2.find(q => q.variety_code === variety.variety_code && q.variety_code_line === variety.variety_code_line);
                } else {
                  quantityObj = seedProcessBreederSeedProuced2.find(q => q.variety_code === variety.variety_code);
                }
                const total_processed_qty2 = quantityObj ? quantityObj.total_processed_qty : 0;
                return { ...variety, total_processed_qty2 };
              });
              seedProcess = result
            }
          }
          if (seedProcess && seedProcess.length > 0) {
            if (seedProcessBreederSeedProuced3 && seedProcessBreederSeedProuced3.length > 0) {
              const result = seedProcess.map(variety => {
                let quantityObj;
                if (variety.variety_code_line) {
                  quantityObj = seedProcessBreederSeedProuced3.find(q => q.variety_code === variety.variety_code && q.variety_code_line === variety.variety_code_line);
                } else {
                  quantityObj = seedProcessBreederSeedProuced3.find(q => q.variety_code === variety.variety_code);
                }
                const total_processed_qty3 = quantityObj ? quantityObj.recover_qty : 0;
                return { ...variety, total_processed_qty3 };
              });
              seedProcess = result
            }
          }
          if (seedProcess && seedProcess.length > 0) {
            if (bspOne && bspOne.length > 0) {
              const result = seedProcess.map(variety => {
                let quantityObj;
                if (variety.variety_code_line) {
                  quantityObj = bspOne.find(q => q.variety_code === variety.variety_code && q.variety_line_code === variety.variety_code_line);
                } else {
                  quantityObj = bspOne.find(q => q.variety_code === variety.variety_code);
                }
                const target_quantity = quantityObj ? quantityObj.target_quantity : 0;
                return { ...variety, target_quantity };
              });
              seedProcess = result
            }
          }
          if (seedProcess && seedProcess.length > 0) {
            if (directData && directData.length > 0) {
              const result = seedProcess.map(variety => {
                let quantityObj;
                if (variety.variety_code_line) {
                  quantityObj = directData.find(q => q.variety_code === variety.variety_code && q.variety_line_code === variety.variety_code_line);
                } else {
                  quantityObj = directData.find(q => q.variety_code === variety.variety_code);
                }
                const additionQty = quantityObj ? quantityObj.quantity : 0;
                return { ...variety, additionQty };
              });
              seedProcess = result
            }
          }
          if (seedProcess && seedProcess.length > 0) {
            if (directDatawithoutlineCode && directDatawithoutlineCode.length > 0) {
              const result = seedProcess.map(variety => {
                let quantityObj;
                if (variety.variety_code_line) {
                  quantityObj = directDatawithoutlineCode.find(q => q.variety_code === variety.variety_code && q.variety_line_code === variety.variety_code_line);
                } else {
                  quantityObj = directDatawithoutlineCode.find(q => q.variety_code === variety.variety_code);
                }
                const totaladditionQty = quantityObj ? quantityObj.quantity : 0;
                return { ...variety, totaladditionQty };
              });
              seedProcess = result
            }
          }
          if (seedProcess && seedProcess.length > 0) {
            if (generateSampleForwardingLettersData && generateSampleForwardingLettersData.length > 0) {
              const result = seedProcess.map(variety => {
                let quantityObj;
                if (variety.variety_code_line) {
                  quantityObj = generateSampleForwardingLettersData.find(q => q.variety_code === variety.variety_code && q.variety_line_code === variety.variety_code_line);
                } else {
                  quantityObj = generateSampleForwardingLettersData.find(q => q.variety_code === variety.variety_code);
                }
                const total_processed_qty_carry = quantityObj ? quantityObj.total_processed_qty : 0;
                return { ...variety, total_processed_qty_carry };
              });
              seedProcess = result
            }
          }
          if (seedProcess && seedProcess.length > 0) {
            if (generateSampleForwardingLetters3 && generateSampleForwardingLetters3.length > 0) {
              const result = seedProcess.map(variety => {
                let quantityObj;
                if (variety.variety_code_line) {
                  quantityObj = generateSampleForwardingLetters3.find(q => q.variety_code === variety.variety_code && q.variety_line_code === variety.variety_code_line);
                } else {
                  quantityObj = generateSampleForwardingLetters3.find(q => q.variety_code === variety.variety_code);
                }
                const total_processed_qty_carry = quantityObj ? quantityObj.total_processed_qty : 0;
                return { ...variety, total_processed_qty_carry };
              });
              seedProcess = result
            }
          }

          if (seedProcess && seedProcess.length > 0) {
            if (generateSampleForwardingLetters2 && generateSampleForwardingLetters2.length > 0) {
              const result = seedProcess.map(variety => {
                let quantityObj;
                if (variety.variety_code_line) {
                  quantityObj = generateSampleForwardingLetters2.find(q => q.variety_code === variety.variety_code && q.variety_code_line === variety.variety_code_line);
                } else {
                  quantityObj = generateSampleForwardingLetters2.find(q => q.variety_code === variety.variety_code);
                }
                const recover_qty = quantityObj ? quantityObj.recover_qty : 0;
                return { ...variety, recover_qty };
              });
              seedProcess = result
            }
          }
          if (seedProcess && seedProcess.length > 0) {
            if (generateSampleForwardingLetters4 && generateSampleForwardingLetters4.length > 0) {
              const result = seedProcess.map(variety => {
                let quantityObj;
                if (variety.variety_code_line) {
                  quantityObj = generateSampleForwardingLetters4.find(q => q.variety_code === variety.variety_code && q.variety_code_line === variety.variety_code_line);
                } else {
                  quantityObj = generateSampleForwardingLetters4.find(q => q.variety_code === variety.variety_code);
                }
                const recover_qty = quantityObj ? quantityObj.recover_qty : 0;
                return { ...variety, recover_qty };
              });
              seedProcess = result
            }
          }
          if (seedProcess && seedProcess.length > 0) {
            // console.log('seedProcessBreederSeedProucedtotal====',seedProcessBreederSeedProucedtotal);
            if (seedProcessBreederSeedProucedtotal && seedProcessBreederSeedProucedtotal.length > 0) {
              const result = seedProcess.map(variety => {
                let quantityObj;
                if (variety.variety_code_line) {
                  quantityObj = seedProcessBreederSeedProucedtotal.find(q => q.variety_code === variety.variety_code && q.variety_code_line === variety.variety_code_line);
                } else {
                  quantityObj = seedProcessBreederSeedProucedtotal.find(q => q.variety_code === variety.variety_code);
                }
                const recover_qty = quantityObj ? quantityObj.recover_qty : 0;
                return { ...variety, recover_qty };
              });
              seedProcess = result
            }
          }
          if (seedProcess && seedProcess.length > 0) {
            if (availabilityOfBreederSeed && availabilityOfBreederSeed.length > 0) {
              const result = seedProcess.map(variety => {
                let quantityObj;
                if (variety.variety_code_line) {
                  quantityObj = availabilityOfBreederSeed.find(q => q.variety_code === variety.variety_code && q.variety_code_line === variety.variety_code_line);
                } else {
                  quantityObj = availabilityOfBreederSeed.find(q => q.variety_code === variety.variety_code);
                }
                const allocate_qty = quantityObj ? quantityObj.allocate_qty : 0;
                const saveAsDraft = quantityObj ? quantityObj.save_as_draft : 0;
                const is_final_submit = quantityObj ? quantityObj.is_final_submit : 0;
                const avialability_id = quantityObj ? quantityObj.avialability_id : 0;
                const bsp2_qty = quantityObj ? quantityObj.bsp2_qty : 0;
                const bsp2_per_qty = quantityObj ? quantityObj.bsp2_per_qty : 0;
                const bsp3_qty = quantityObj ? quantityObj.bsp3_qty : 0;
                const bsp3_per_qty = quantityObj ? quantityObj.bsp3_per_qty : 0;
                const intake_vrfictn_qty = quantityObj ? quantityObj.intake_vrfictn_qty : 0;
                const intake_vrfictn__pr_qty = quantityObj ? quantityObj.intake_vrfictn__pr_qty : 0;
                const check_status = quantityObj ? quantityObj.check_status : 0;
                return { ...variety, allocate_qty, saveAsDraft, is_final_submit, avialability_id, bsp2_qty, bsp2_per_qty, bsp3_qty, bsp3_per_qty, intake_vrfictn_qty, intake_vrfictn__pr_qty, check_status };
              });

              seedProcess = result
            }
          }
          while (this.bspc.controls.length != 0) {
            this.remove(0)
          }
          this.tableData = seedProcess;
          // if (this.tableData && this.tableData.length > 0) {
          // this.tableData.forEach(x => {
          //   if (x.is_final_submit == 1) {
          //     this.disableField = false
          //     return;
          //   } else {
          //     this.disableField = true
          //   }
          // })
          this.disableField = this.tableData?.some(x => x.is_final_submit === 1) ?? false;


          // if (this.tableData?.length > 0) {
          //   this.disableField = this.tableData.every(x => x.is_final_submit === 1);
          // }
          // if (this.tableData?.length > 0) {
          //   this.disableField = !this.tableData.some(x => x.is_final_submit != 1);
          // }
          // this.tableData.(x => {
          //   // console.log('is final submit 1',x)
          //   // console.log('is final submit 2',x.is_final_submit)
          //   if (x.is_final_submit != 1) {
          //    this.disableField = false;
          //   } else {
          //       this.disableField = true;
          //     return;
          //   }
          // })
          // }
          let varietyCount = 0;
          // this.totalVarities = response && response.counRegister ? response.counRegister : '';
          seedProcess.forEach((el, i) => {
            if (el.target_quantity == 0) { }
            else {
              varietyCount += 1
              this.bspc.push(this.bspcCreateForm())
            }

          }
          )
          this.totalVarities = varietyCount;
          let sum = 0
          let totalDirectindentQty = 0;
          let nationalQty = 0;
          let totalBreederAvailable = 0;
          let total_processed_qty = 0;
          console.log(seedProcess, 'seedProcess')
          let total_processed_qty_second = 0;
          // let finalArray = [];
          seedProcess.forEach((el, i) => {
            if (el.target_quantity == 0) {
              // alert("Hiii");
              delete finalArray[i]
            } else {
              finalArray.push(el)
            }
          });

          finalArray.forEach((el, i) => {
            console.log('el.target_quantity====', el.target_quantity);
            if (el.target_quantity == 0) {
              seedProcess.splice(i, 1)
            }
            el.total_processed_qty = el && el.total_processed_qty ? el.total_processed_qty : 0;
            el.recover_qty = el && el.recover_qty ? el.recover_qty : 0;
            el.total_processed_qty2 = el && el.total_processed_qty2 ? el.total_processed_qty2 : 0;
            el.total_processed_qty3 = el && el.total_processed_qty3 ? el.total_processed_qty3 : 0;
            el.total_processed_qty_carry = el && el.total_processed_qty_carry ? el.total_processed_qty_carry : 0;
            el.total_processed_qty = el && el.total_processed_qty ? el.total_processed_qty : 0;
            el.total_processed_qty = el.total_processed_qty + el.total_processed_qty2 + el.recover_qty + el.total_processed_qty3

            // new colomn add bsp2 , bsp3 ,intake verification  
            // new code
            this.ngForm.controls['bspc']['controls'][i].controls['bsp2_qty'].setValue(el && el.expected_production ? el.expected_production : null, { emitEvent: false })
            this.ngForm.controls['bspc']['controls'][i].controls['bsp3_qty'].setValue(el && el.estimated_production ? el.estimated_production : null, { emitEvent: false })
            this.ngForm.controls['bspc']['controls'][i].controls['intake_vrfictn_qty'].setValue(el && el.intake_qnt ? el.intake_qnt : null, { emitEvent: false })
            this.ngForm.controls['bspc']['controls'][i].controls['check_letest'].setValue(el && el.letest ? el.letest : null, { emitEvent: false })
            this.ngForm.controls['bspc']['controls'][i].controls['bsp2_per_qty'].setValue(100, { emitEvent: false })
            this.ngForm.controls['bspc']['controls'][i].controls['bsp3_per_qty'].setValue(100, { emitEvent: false })
            this.ngForm.controls['bspc']['controls'][i].controls['intake_vrfictn__pr_qty'].setValue(100, { emitEvent: false })


            if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['variety_name']) {
              this.ngForm.controls['bspc']['controls'][i].controls['variety_name'].setValue(el && el.variety_name ? el.variety_name : '', { emitEvent: false });
            }
            if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['available_id']) {
              this.ngForm.controls['bspc']['controls'][i].controls['available_id'].setValue(el && el.avialability_id ? el.avialability_id : '', { emitEvent: false });
            }
            if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['variety_code']) {
              this.ngForm.controls['bspc']['controls'][i].controls['variety_code'].setValue(el && el.variety_code ? el.variety_code : '', { emitEvent: false });
            }
            if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['line_variety_name']) {
              this.ngForm.controls['bspc']['controls'][i].controls['line_variety_name'].setValue(el && el.line_variety_name ? el.line_variety_name : '', { emitEvent: false });
            }
            if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['line_variety_code']) {
              this.ngForm.controls['bspc']['controls'][i].controls['line_variety_code'].setValue(el && el.variety_code_line ? el.variety_code_line : '', { emitEvent: false });
            }

            if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced']) {
              this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced'].setValue(el && el.total_processed_qty ? el.total_processed_qty : 0, { emitEvent: false });
            }

            total_processed_qty_second += this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced'].value
            this.total_processed_qty_second_value = total_processed_qty_second;

            if (el && el.bsp2_qty) {
              this.ngForm.controls['bspc']['controls'][i].controls['bsp2_qty'].setValue(el && el.bsp2_qty ? el.bsp2_qty : null, { emitEvent: false })
            }
            if (el && el.bsp2_per_qty) {
              this.ngForm.controls['bspc']['controls'][i].controls['bsp2_per_qty'].setValue(el && el.bsp2_per_qty ? el.bsp2_per_qty : null, { emitEvent: false })
              this.changePercentage1(el.bsp2_per_qty, i, el.bsp2_qty);
            }
            if (el && el.bsp3_qty) {
              this.ngForm.controls['bspc']['controls'][i].controls['bsp3_qty'].setValue(el && el.bsp3_qty ? el.bsp3_qty : null, { emitEvent: false })
            }
            if (el && el.bsp3_per_qty) {
              this.ngForm.controls['bspc']['controls'][i].controls['bsp3_per_qty'].setValue(el && el.bsp3_per_qty ? el.bsp3_per_qty : null, { emitEvent: false })
              this.changePercentage1(el.bsp3_per_qty, i, el.bsp3_qty);
            }
            if (el && el.intake_vrfictn_qty) {
              this.ngForm.controls['bspc']['controls'][i].controls['intake_vrfictn_qty'].setValue(el && el.intake_vrfictn_qty ? el.intake_vrfictn_qty : null, { emitEvent: false })
            }
            if (el && el.intake_vrfictn__pr_qty) {
              this.ngForm.controls['bspc']['controls'][i].controls['intake_vrfictn__pr_qty'].setValue(el && el.intake_vrfictn__pr_qty ? el.intake_vrfictn__pr_qty : null, { emitEvent: false })
              this.changePercentage1(el.intake_vrfictn__pr_qty, i, el.intake_vrfictn_qty);
            }
            console.log('el.check_status==', el.check_status);
            if (el && el.check_status) {
              this.ngForm.controls['bspc']['controls'][i].controls['check_letest'].setValue(el && el.check_status ? el.check_status : null, { emitEvent: false })
              this.changePercentage1(el.intake_vrfictn__pr_qty, i, el.intake_vrfictn_qty);
            }

            sum += el && el.total_processed_qty_carry ? (el.total_processed_qty_carry) : 0;

            this.totalCarryOver = sum;

            if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['total_nation_qty']) {
              this.ngForm.controls['bspc']['controls'][i].controls['total_nation_qty'].setValue(el && el.target_quantity ? el.target_quantity : 0, { emitEvent: false })
            }
            if (el.target_quantity) {
              nationalQty += el && el.target_quantity ? el.target_quantity : 0;
            }
            let sums = el.total_processed_qty + el.total_processed_qty2 + el.recover_qty + el.total_processed_qty3;
            total_processed_qty += el.total_processed_qty + el.total_processed_qty2 + el.total_processed_qty3 + el.total_processed_qty_carry;
            this.nationalQty = nationalQty;
            if (this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced'].value && this.ngForm.controls['bspc']['controls'][i].controls['total_carry_over_qty'].value) {
              totalBreederAvailable += ((this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced'].value) + (this.ngForm.controls['bspc']['controls'][i].controls['total_carry_over_qty'].value))
            } else {
              totalBreederAvailable += (this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced'].value) ? this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced'].value : this.ngForm.controls['bspc']['controls'][i].controls['total_carry_over_qty'].value ? this.ngForm.controls['bspc']['controls'][i].controls['total_carry_over_qty'].value : 0
            }
            this.totalBreederAvailable = totalBreederAvailable;
            this.total_processed_qty = total_processed_qty - (el && el.recover_qty ? el.recover_qty : 0);
            if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['total_carry_over_qty']) {
              this.ngForm.controls['bspc']['controls'][i].controls['total_carry_over_qty'].setValue(el && el.total_processed_qty_carry ? (el.total_processed_qty_carry + el.recover_qty) : '', { emitEvent: false })
            }
            if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['allocate_qty']) {
              if (el.allocate_qty == 0) {
                this.ngForm.controls['bspc']['controls'][i].controls['allocate_qty'].setValue(el && el.allocate_qty ? el.allocate_qty : '0', { emitEvent: false })
              } else {
                this.ngForm.controls['bspc']['controls'][i].controls['allocate_qty'].setValue(el && el.allocate_qty ? el.allocate_qty : '', { emitEvent: false })
              }
            }
            if (el && el.total_processed_qty_carry && el.total_processed_qty) {
              if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['total_breeder_seed_available_over_qty']) {
                this.ngForm.controls['bspc']['controls'][i].controls['total_breeder_seed_available_over_qty'].setValue((el.total_processed_qty_carry + (el.total_processed_qty)).toFixed(2), { emitEvent: false })
              }
            } else {
              if (this.ngForm.controls['bspc']['controls'][i].controls && this.ngForm.controls['bspc']['controls'][i].controls['total_breeder_seed_available_over_qty']) {
                this.ngForm.controls['bspc']['controls'][i].controls['total_breeder_seed_available_over_qty'].setValue(el && el.total_processed_qty_carry ? (el.total_processed_qty_carry) : el && el.total_processed_qty ? (el.total_processed_qty) : '', { emitEvent: false })
              }
            }
            if (el.variety_code_line) {
              this.ngForm.controls['bspc']['controls'][i].controls['total_direct_qty'].setValue(el && el.additionQty ? el.additionQty : '', { emitEvent: false })
            } else {
              this.ngForm.controls['bspc']['controls'][i].controls['total_direct_qty'].setValue(el && el.totaladditionQty ? el.totaladditionQty : '', { emitEvent: false })
            }
            totalDirectindentQty += this.ngForm.controls['bspc']['controls'][i].controls['total_direct_qty'].value ? this.ngForm.controls['bspc']['controls'][i].controls['total_direct_qty'].value : 0;
            this.totalDirectindentQty = totalDirectindentQty
          })
        }
      }
    })
  }
  saveAsDraft() {
    let param = this.ngForm.value;
    let bspc = param && param.bspc ? param.bspc : '';
    let allocatedErr = false;
    let allocationAllocateErr = false;
    if (bspc && bspc.length > 0) {
      bspc.forEach((el) => {
        if (el.allocate_qty == null || el.allocate_qty == '' || el.allocate_qty == undefined) {
          allocationAllocateErr = true;
        }
        el.total_breeder_seed_available_over_qty = el && el.total_breeder_seed_available_over_qty ? el.total_breeder_seed_available_over_qty : 0;
        if (parseFloat(el.allocate_qty) > parseFloat((el && el.breeder_seed_produced ? el.breeder_seed_produced : 0) + (el && el.total_carry_over_qty ? el.total_carry_over_qty : 0))) {
          allocatedErr = true
          return;
        } else {
          allocatedErr = false
        }
      })
    }
    if (allocationAllocateErr) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity can not be blank.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#B64B1D'
      });
      return;
    }
    if (allocatedErr) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity can not be greater than Total Breeder Seed Available.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    param.saveAsDraft = 1
    const result = this.productionService.postRequestCreator('save-data-of-bsp-four', param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data saved as Draft successfully.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        }).then(x => {
          this.getDataofBspFour();
        })
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Something Went Wrong.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
      }
    });
  }

  confirmSave() {
    let param = this.ngForm.value;
    let bspc = param && param.bspc ? param.bspc : '';
    let allocatedErr = false;
    let allocationErr = false;
    let allocationAllocateErr = false;
    if (bspc && bspc.length > 0) {
      for (const item of bspc) {
        if (item.allocate_qty == null || item.allocate_qty == '' || item.allocate_qty == undefined) {
          allocationAllocateErr = true;
        }
        if (parseFloat(item.allocate_qty) > parseFloat((item && item.breeder_seed_produced ? item.breeder_seed_produced : 0) + (item && item.total_carry_over_qty ? item.total_carry_over_qty : 0))) {
          allocatedErr = true
          return;
        } else {
          allocatedErr = false
        }
      }
    }

    if (allocationAllocateErr) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity can not be blank.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#B64B1D'
      });
      return;
    }

    if (allocatedErr) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity can not be greater than Total Breeder Seed Available.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#B64B1D'
      });
      return;
    } else if (allocationErr) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity can not be blank.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#B64B1D'
      });
      return;
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to submit the form?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit!',
        cancelButtonText: 'No, cancel!',
        confirmButtonColor: '#B64B1D',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          this.save(); // Call save method after confirmation
        }
      });
    }
  }

  save() {
    let param = this.ngForm.value;
    let bspc = param && param.bspc ? param.bspc : '';
    let allocatedErr = false;
    let allocationErr = false;

    if (bspc && bspc.length > 0) {
      for (const item of bspc) {
        if (parseFloat(item.allocate_qty) > parseFloat((item && item.breeder_seed_produced ? item.breeder_seed_produced : 0) + (item && item.total_carry_over_qty ? item.total_carry_over_qty : 0))) {
          allocatedErr = true
          return;
        } else {
          allocatedErr = false
        }
      }
    }

    if (allocatedErr) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity can not be greater than Total Breeder Seed Available.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#B64B1D'
      });
      return;
    } else if (allocationErr) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity can not be blank.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#B64B1D'
      });
      return;
    } else {
      param.isFinalSubmit = 1;
      this.productionService.postRequestCreator('save-data-of-bsp-four', param).subscribe((data: any) => {
        let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code === 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data saved successfully.</p>',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#B64B1D'
          }).then(x => {
            this.getDataofBspFour(); // Refresh the data or do something
          });
        } else {
          Swal.fire({
            title: '<p style="font-size:25px;">Something went wrong.</p>',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#B64B1D'
          });
        }
      });
    }

    console.log(param, 'param');
  }

  // save() {
  //   let param = this.ngForm.value;
  //   let bspc = param && param.bspc ? param.bspc : '';
  //   let allocatedErr = false;
  //   let allocationErr=false;
  //   if (bspc && bspc.length > 0) {
  //     for (const item of bspc) {
  //       if (item && !item.allocate_qty) {
  //         allocationErr = true;
  //           break; // Exit the loop early since we found a 0
  //       }
  //       if (parseFloat(item.allocate_qty) > parseFloat(item.total_breeder_seed_available_over_qty)) {
  //         allocatedErr = true;
  //         break;
  //       }
  //   }

  //   }

  //   if (allocatedErr) {
  //     Swal.fire({
  //       title: '<p style="font-size:25px;">Allocated Quantity can not be greater than Total Breeder Seed Available.</p>',
  //       icon: 'error',
  //       confirmButtonText:
  //         'OK',
  //       confirmButtonColor: '#B64B1D'
  //     })
  //     return;
  //   }
  //   else if(allocationErr){
  //     Swal.fire({
  //       title: '<p style="font-size:25px;">Allocated Quantity can not be blank.</p>',
  //       icon: 'error',
  //       confirmButtonText:
  //         'OK',
  //       confirmButtonColor: '#B64B1D'
  //     })
  //     return;
  //   }
  //   else{

  //     param.isFinalSubmit = 1
  //     const result = this.productionService.postRequestCreator('save-data-of-bsp-four', param).subscribe((data: any) => {
  //       let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
  //       if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
  //         Swal.fire({
  //           title: '<p style="font-size:25px;">Data save successfully.</p>',
  //           icon: 'success',
  //           confirmButtonText:
  //             'OK',
  //           confirmButtonColor: '#B64B1D'
  //         }).then(x => {
  //           this.getDataofBspFour();
  //         })
  //       } else {
  //         Swal.fire({
  //           title: '<p style="font-size:25px;">Something Went Wrong.</p>',
  //           icon: 'error',
  //           confirmButtonText:
  //             'OK',
  //           confirmButtonColor: '#B64B1D'
  //         })
  //       }
  //     });
  //   }
  //   console.log(param, 'param')
  // }
  remove(rowIndex: number) {
    this.sppData().removeAt(rowIndex);
    // if (this.sppData().controls.length > 1) {
    // } else {
    //   this.removeData()
    // }
  }
  sppData() {
    return this.ngForm.get('bspc') as FormArray;
  }
  getQty(i) {
    if (this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced'].value && this.ngForm.controls['bspc']['controls'][i].controls['total_carry_over_qty'].value) {
      this.ngForm.controls['bspc']['controls'][i].controls['total_breeder_seed_available_over_qty'].value = (this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced'].value + this.ngForm.controls['bspc']['controls'][i].controls['total_carry_over_qty'].value)
    } else {
      this.ngForm.controls['bspc']['controls'][i].controls['total_breeder_seed_available_over_qty'].value = this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced'].value ? this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced'].value : 0
    }
    let sumValues = this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced'].value + this.ngForm.controls['bspc']['controls'][i].controls['total_carry_over_qty'].value
    // if (parseFloat(this.ngForm.controls['bspc']['controls'][i].controls['allocate_qty'].value) > parseFloat(this.ngForm.controls['bspc']['controls'][i].controls['total_breeder_seed_available_over_qty'].value)) {

    if (parseFloat(this.ngForm.controls['bspc']['controls'][i].controls['allocate_qty'].value) > parseFloat(sumValues)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity can not be greater than Total Breeder Seed Available.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
  }
  download() {
    // this.getQr()
    const name = 'bsp-four';
    const element = document.getElementById('pdf-tables');
    const options = {
      filename: `${name}.pdf`,
      margin: [30, 0],
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
        scale: 1,
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
  cancel() {
    let param = this.ngForm.value;
    let bspc = param && param.bspc ? param.bspc : '';
    if (bspc && bspc.length > 0) {
      bspc.forEach((el, i) => {
        // this.ngForm.controls
        this.ngForm.controls['bspc']['controls'][i].controls['allocate_qty'].setValue('', { emitEvent: false });
      })
    }
  }
  changePercentage(event, i, value) {
    let final_ammount = value * (event.target.value / 100);
    if (final_ammount) {
      this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced'].setValue(final_ammount)
    }
  }
  changePercentage1(event, i, value) {
    let final_ammount = value * (event / 100);
    console.log('final_ammount=======', final_ammount);
    if (final_ammount) {
      this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_produced'].setValue(final_ammount)
    }
  }

  validatePercentage(index: number) {
    const control = this.ngForm.controls['bspc']['controls'][index].controls['bsp3_per_qty'];
    if (control.value > 100) {
      control.setValue(100);
    }
  }
  validatePercentage1(index: number) {
    const control = this.ngForm.controls['bspc']['controls'][index].controls['intake_vrfictn__pr_qty'];
    if (control.value > 100) {
      control.setValue(100);
    }
  }

  validatePercentage2(index: number) {
    const control = this.ngForm.controls['bspc']['controls'][index].controls['bsp2_per_qty'];
    if (control.value > 100) {
      control.setValue(100);
    }
  }

}