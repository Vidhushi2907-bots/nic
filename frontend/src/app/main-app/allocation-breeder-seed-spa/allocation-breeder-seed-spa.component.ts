import { Component, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { VerietyAllocationBreederSeedIndentorLiftingFields, AllocationBreederSeedIndentorUIFieldsMultipleProduction, AllocationBreederSeedIndentorLiftingFields, AllocationBreederSeedIndentorUIFields } from 'src/app/common/data/ui-field-data/seed-division-fields';
import { bspIAccordionFormGroupAndFieldList, accordionUIDataTypeBSPI, BreederSeedSubmissionNodalUIFields, createCropVarietyData, selectBreederNameNodalUIFields } from 'src/app/common/data/ui-field-data/breeder-seed-submission-nodal-ui-fields';
import { bspProformasVVarietyUIFields } from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { IndenterService } from 'src/app/services/indenter/indenter.service';

@Component({
  selector: 'app-allocation-breeder-seed-spa',
  templateUrl: './allocation-breeder-seed-spa.component.html',
  styleUrls: ['./allocation-breeder-seed-spa.component.css']
})

export class AllocationBreederSeedSpaComponent implements OnInit {

  @ViewChild(DynamicFieldsComponent) dynamicFieldsComponent: DynamicFieldsComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  activeVarietyIndexInAccordion = -1;
  fieldsList: Array<SectionFieldType> = [];
  verietyfieldsList: Array<SectionFieldType> = [];

  formSuperGroup: FormGroup = new FormGroup([]);
  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  isDraft: boolean = false;
  currentUser: any = { id: 10, name: "Hello User" };
  dropdownSettings: any = {};
  dropdownSettings1: any = {};
  editVarietyLength: number | null = null;
  cropName: any = [];
  verietyListDetails: any = {};
  tempVerietyListDetails: Array<any> = [];
  selectedVerietyDetail: any = undefined;
  editData: any = [];
  prodCenter: any = [];
  producionCentersList: any = []
  productionCenter: any = [];
  newFormGroup = new FormGroup<any>([]);
  buttonText = 'Submit'
  
  showgrid: boolean = false;
  indenderProductionCenter = []
  finalDataToBeSaved = []
  disableSubmitButton = true;
  editableQuantity = false

  isEditingVariety: boolean = false;
  dropdownList = []
  quantity: string;
  searhedData = false;
  finalshowData;

  cropButtonEnable: boolean = false;

  selectedVariety: any;
  varietyDropdownData: Array<any> = [];
  varietyDataload: boolean = false;

  editVarietyDropdown: Array<any> = [];
  editSelectedVariety: any;

  indentors: Array<any> = [];
  editIndentors: Array<any> = [];
  selectedIndentor: any;
  editSelectedIndentor: any;
  selectedIndentorModel = [];
  private submittedData: Array<any> = [];

  dataToShow: any;

  productionPercentage = 0;
  selectedItem: any;
  prod_center: any;
  new_quantity: any;

  editProdId = undefined;
  editIndex = undefined;
  rowIndex = undefined;

  editbuttonsView: boolean = true;
  VarietyName: any;

  tempForm!: FormGroup;
  editTempForm!: FormGroup;
  indentorLoad: boolean = false;

  varietyForm!: FormGroup;
  editVarietyForm!: FormGroup;

  inputForm!: FormGroup;

  editVarietyDataForm: boolean = false;

  editVariety: any

  selectedVarietyForEdit: any;

  grandAllocation
  grandIndent
  totalDificit
  grand_total
  grandTotalProduction
  items: any = [];
  items1: any = [
    {
      "variety_code": "A0104111",
      "variety_name": "Rajlaxmi(HP-1731)",
      "notification_year": "2000",
      "surplus_dificit": "-100",
      "indenter": [
        {
          "name": "ABB",
          "full_name": "AGGARWAL BEEJ BHANDAR, RAMA "
        },
        {
          "name": "ASF",
          "full_name": "AKAL SEED FARM, SADDA SINGH WALA "
        },
        {
          "name": "YSA",
          "full_name": "Yamuna seee Agency"
        }
      ],
      "indent_quantity": [
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 300 //Total of all indents			
        }
      ],
      "allocation": [
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Bheem",
          "bspc_produced": 200
        },
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Bheem",
          "bspc_produced": 200
        },
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Bheem",
          "bspc_produced": 200
        }

      ],
      "total_allocation": [
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 300 //Total of all indents			
        }

      ]

    },
    {
      "variety_code": "A0104111",
      "variety_name": "Aditya (HD-2781)",
      "notification_year": "2000",
      "surplus_dificit": "-100",
      "indenter": [
        {
          "name": "ABB",
          "full_name": "AGGARWAL BEEJ BHANDAR, RAMA "
        },
        {
          "name": "ASF",
          "full_name": "AKAL SEED FARM, SADDA SINGH WALA "
        },
        {
          "name": "YSA",
          "full_name": "Yamuna seee Agency"
        }
      ],
      "indent_quantity": [
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 300 //Total of all indents			
        }
      ],
      "allocation": [
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Bheem",
          "bspc_produced": 200
        },
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Oja",
          "bspc_produced": 200
        },
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Ojha",
          "bspc_produced": 200
        }

      ],
      "total_allocation": [
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 300 //Total of all indents			
        }

      ]

    }
  ]
  fileName = 'allocation report.xlsx';
  reportHeader: any = {};
  dataToShowSecond: any[];

  isCropSubmitted: boolean = true;
  isCropSubmittedNew: boolean = false;

  dataToDisplay: Array<any> = []

  showUpperRow: boolean = false;
  indentorsubmitted: boolean;
  varietLineData: any;
  selectedVarietyFrom: number;
  varietyLineEdit: any;
  selectedVerietyDetailbtn: boolean;
  indentorsOne: any[];
  editSubmittedData: any;
  editSelectedVarietys: any;
  editVarietyData: boolean;
  userList: any;
  submissionIdNew: any;
  totalIndentQnt: number;
  varietyWiseTotalIndentValue: any;
  totalIntentValue: number;
  totalAllocateValue: number;
  totalleftValue: number;
  showgrid1: boolean = false;

  get formGroupControls() {
    return this.formSuperGroup.controls;
  }

  get IstPartFormGroup(): FormGroup {
    if (this.formGroupControls["IstPartFormGroup"])
      return this.formGroupControls["IstPartFormGroup"] as FormGroup;
    else
      return new FormGroup([]);
  }


  get IstPartFormGroupControls() {
    return this.IstPartFormGroup.controls;
  }

  constructor(activatedRoute: ActivatedRoute,
    private router: Router,
    private restService: RestService,
    private breederService: BreederService,
    private _indenterService: IndenterService,
    private fb: FormBuilder
  ) {

    this.tempForm = this.fb.group({
      selectedIndentorModel: [''],
    });

    this.editTempForm = this.fb.group({
      selectedIndentorModel: [''],
    });

    this.varietyForm = this.fb.group({
      variety_id: [''],
      variety_line: [''],
    });

    this.editVarietyForm = this.fb.group({
      variety_id: [''],
      variety_line: [''],
    });

    this.inputForm = this.fb.group({
      quantityInputBox: ['']
    })



    this.dropdownSettings = {
      singleSelection: true,
      idField: 'value',
      textField: 'name',
      allowSearchFilter: true
    };
    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'variety_line_code',
      textField: 'line_variety_name',
      closeDropDownOnSelection: true,
      allowSearchFilter: true
    };
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.currentUser.id = userData.id
    this.currentUser.name = userData.name

    const params: any = activatedRoute.snapshot.params;
    if (params["submissionid"]) {
      this.submissionId = parseInt(params["submissionid"]);
    }

    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;
    this.isDraft = router.url.indexOf("edit/draft") > 0;

    this.formSuperGroup.addControl("IstPartFormGroup", new FormGroup([]));
    this.formSuperGroup.addControl("search", new FormControl(""));
    this.createFormControlsOfAGroup(AllocationBreederSeedIndentorLiftingFields, this.IstPartFormGroup);
    this.createFormControlsOfAGroup(VerietyAllocationBreederSeedIndentorLiftingFields, this.IstPartFormGroup);
    this.verietyfieldsList = VerietyAllocationBreederSeedIndentorLiftingFields
    this.fieldsList = AllocationBreederSeedIndentorLiftingFields;
    this.filterPaginateSearch.itemListPageSize = 10;
  }




  ngOnInit(): void {


    this.submittedData = [];
    this.isEditingVariety = false;

    this.breederService.getRequestCreatorNew("allocation-to-spa-year").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let years = data.EncryptedResponse.data
        let yrs = []
        years.forEach(x => {
          var temp = this.getFinancialYear(x.year)
          yrs.push({ value: x.year, name: temp })
        })
        this.fieldsList[0].fieldDataList = yrs;
      }
    })
    this.IstPartFormGroupControls["season"].disable();
    this.IstPartFormGroupControls["cropName"].disable();
    this.IstPartFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      this.dataToDisplay = [];
      this.selectedVerietyDetail = {};
      this.varietyDropdownData = [];
      this.productionPercentage = 0;
      this.IstPartFormGroupControls["cropName"].reset();
      this.IstPartFormGroupControls["season"].enable();

      // if(!this.isEdit){
      this.varietyForm.controls["variety_id"].reset();
      this.varietyForm.controls["variety_line"].reset();

      this.editVarietyForm.controls["variety_id"].reset();
      this.editVarietyForm.controls["variety_line"].reset();
      this.IstPartFormGroupControls["cropName"].enable();
      // }

      this.breederService.getRequestCreatorNew("allocation-to-spa-season?user_id=" + this.currentUser.id + "&year=" + newValue.value).subscribe((dataList: any) => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let seasons = []
          dataList.EncryptedResponse.data.forEach(element => {
            let temp = { name: element['m_season.season'], value: element['season'] }
            seasons.push(temp);
          });
          this.fieldsList[1].fieldDataList = seasons;

          if (this.isEdit || this.isView) {
            let season = seasons.filter(x => x.value == this.editData.season)[0]
            this.IstPartFormGroupControls["season"].patchValue(season);
          }
        }
      })
    });

    this.IstPartFormGroupControls["season"].valueChanges.subscribe(newValue => {
      this.dataToDisplay = [];
      this.selectedVerietyDetail = {};
      this.varietyDropdownData = [];
      this.productionPercentage = 0;
      let year = this.IstPartFormGroupControls["yearofIndent"].value.value;
      // if(!this.isEdit){
      this.varietyForm.controls["variety_id"].reset();
      this.varietyForm.controls["variety_line"].reset();

      this.editVarietyForm.controls["variety_id"].reset();
      this.editVarietyForm.controls["variety_line"].reset();
      this.IstPartFormGroupControls["cropName"].enable();
      // }


      this.breederService.getRequestCreatorNew("allocation-to-spa-crop?user_id=" + this.currentUser.id + "&year=" + year + "&season=" + newValue.value).subscribe((dataList: any) => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let crops = []
          dataList.EncryptedResponse.data.forEach(element => {
            let temp = { name: element['m_crop.crop_name'], value: element['crop_code'] }
            crops.push(temp);
          });
          this.fieldsList[2].fieldDataList = crops;
          if (this.isEdit || this.isView) {
            let crop = crops.filter(x => x.value == this.editData.crop_code)[0]
            this.IstPartFormGroupControls["cropName"].patchValue(crop);
          }
        }
      })
    });
    this.IstPartFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
      this.dataToDisplay = [];
      this.selectedVerietyDetail = {};
      this.varietyDropdownData = [];
      // if(!this.isEdit){
      this.productionPercentage = 0;
      this.varietyForm.controls["variety_id"].reset();
      this.varietyForm.controls["variety_line"].reset();

      this.editVarietyForm.controls["variety_id"].reset();
      this.editVarietyForm.controls["variety_line"].reset();
      // this.IstPartFormGroupControls["cropName"].enable();
      this.getSpaWiseIndent();
      // }
    })

    if (this.isEdit || this.isView) {
      this.searhedData = true;
      this.breederService.getRequestCreator('allocation-to-indentor/' + this.submissionId).subscribe(dataList => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let data = this.editData = dataList.EncryptedResponse.data
          this.VarietyName = data && data.m_crop_variety && data.m_crop_variety.variety_name ? data.m_crop_variety.variety_name : '';
          this.finalDataToBeSaved.push(this.editData)
          this.buttonText = 'Update'
          this.isDraft = data?.isdraft ? true : false;
          let tmpyear = this.getFinancialYear(this.editData.year);
          let year = { value: this.editData.year, name: tmpyear }
          this.IstPartFormGroupControls["yearofIndent"].patchValue(year)
          this.disableSubmitButton = false;
        }
      });
    }



    let isSearched = false;
    this.formGroupControls['search'].valueChanges.subscribe(newValue => {
      let performSearch: any[] | undefined = undefined;
      if (newValue.length > 3) {
        isSearched = true;
        performSearch = [{
          columnNameInItemList: "name",
          value: newValue
        }];
      }
      if (isSearched)
        this.filterPaginateSearch.search(performSearch);
    });
  }

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    ws['!cols'] = [{ width: 8 }, { width: 20 }, { width: 20 }];
    ws['!freeze'] = { xSplit: 1, ySplit: 0, top: 0, left: 1 };

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    this.saveExcelFile(excelBuffer, this.fileName);
  }

  saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }

  search() { 
    let searchParams1 = { "Year of Indent": null, "Season": null, "Crop Name": null, };
    let yearofIndent: null;
    let cropName: null;
    let cropVariety: null;
    this.searhedData = true;
    let season: null;
    let reportParam = { "year": null, "season": null, "crop_code": null, };
    if (this.IstPartFormGroupControls["yearofIndent"] && this.IstPartFormGroupControls["yearofIndent"].value) {
      searchParams1['Year of Indent'] = this.IstPartFormGroupControls["yearofIndent"].value["value"]
      reportParam['year'] = (this.IstPartFormGroupControls["yearofIndent"].value["value"]).toString()
    }

    if (this.IstPartFormGroupControls["season"] && this.IstPartFormGroupControls["season"].value) {
      searchParams1['Season'] = this.IstPartFormGroupControls["season"].value["value"];
      reportParam['season'] = this.IstPartFormGroupControls["season"].value["value"]

    }

    if (this.IstPartFormGroupControls["cropName"] && this.IstPartFormGroupControls["cropName"].value) {
      searchParams1['Crop Name'] = this.IstPartFormGroupControls["cropName"].value["value"];
      reportParam['crop_code'] = this.IstPartFormGroupControls["cropName"].value["value"]

    }
    this.getCropVerieties();
    let blankData = Object.entries(searchParams1).filter(([, value]) => value == null).flat().filter(n => n).join(", ")

    if (blankData) {
      Swal.fire('Error', "Please Fill " + blankData + " Details Correctly.", 'error');
      return;
    } else {
      this.isCropSubmittedNew = false;
      this.isEditingVariety = false;
      this.varietyWiseTotalIndentValue = null;
      this.productionPercentage = null;
      this.dataToDisplay = null
      this.submittedData = [];
      this.dataToShow = [];

      this.selectedVarietyForEdit = undefined;
      this.selectedVerietyDetail = undefined;
      this.editSelectedVariety = undefined;
      this.editIndentors = []
      this.indentors = []

      this.editVarietyForm.controls['variety_id'].reset();
      this.showUpperRow = true;
      this.getCropVerieties()
      this.getSpaLineData()
    }
    this.reportHeader = reportParam;

    if (this.IstPartFormGroupControls['cropName'] && this.IstPartFormGroupControls['cropName'].value) {
      this.reportHeader['crop_name'] = this.IstPartFormGroupControls['cropName'].value['name'];
    }
    this.getReportData(reportParam)

  }

  getReportData(reportParam) {
    this.breederService.postRequestCreator('spa/indentor-report', null, reportParam).subscribe(dataList => {
      if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
        let reportData = dataList.EncryptedResponse.data[0]
        this.items = reportData.allocations;

        this.grandAllocation = reportData.grandAllocation
        this.grandIndent = reportData.grandIndent
        this.totalDificit = reportData.totalDificit
        this.grand_total = reportData.totalDificit
        this.grandTotalProduction = reportData.grandTotalProduction


      }
    })
  }

  clear() {

    this.varietyDataload = false;

    if (this.IstPartFormGroupControls["yearofIndent"] && this.IstPartFormGroupControls["yearofIndent"].value) {
      this.IstPartFormGroupControls["yearofIndent"].patchValue('');
    }
    if (this.IstPartFormGroupControls["season"] && this.IstPartFormGroupControls["season"].value) {
      this.IstPartFormGroupControls["season"].patchValue('');;
    }
    if (this.IstPartFormGroupControls["cropName"] && this.IstPartFormGroupControls["cropName"].value) {
      this.IstPartFormGroupControls["cropName"].patchValue('');;
    }
    if (this.IstPartFormGroupControls["veriety"] && this.IstPartFormGroupControls["veriety"].value) {
      this.IstPartFormGroupControls["veriety"].patchValue('');;
    }

    this.isCropSubmitted = true;

    this.selectedVerietyDetail = {}
    this.verietyListDetails = {}
    this.finalDataToBeSaved = []
    this.showUpperRow = false;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['allocation-breeder-seed-spa-wise']);
    });

  }

  // getCropVerieties() {
  //   // Swal.fire({
  //   //   title: 'Loading Varities',
  //   //   html: 'Please Wait...',
  //   //   allowEscapeKey: false,
  //   //   allowOutsideClick: false,
  //   //   // didOpen: () => {
  //   //   //   Swal.showLoading(null)
  //   //   // }
  //   // });
  //   let cropName = this.IstPartFormGroupControls["cropName"].value;
  //   let year = this.IstPartFormGroupControls["yearofIndent"].value;
  //   let season = this.IstPartFormGroupControls["season"].value;

  //   this.varietyDropdownData = [];
  //   this.tempVerietyListDetails = [];

  //   let object = {
  //     formData: {
  //       year: year.value,
  //       season: season.value,
  //       crop_code: cropName.value,
  //       user_id: this.currentUser.id,
  //     }
  //   }
  //   this.selectedVarietyForEdit = [];

  //   this.isCropSubmitted = false;
  //   this.breederService.getRequestCreatorNew("allocation-to-spa-varieties" + "?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value).subscribe((dataList: any) => {
  //     if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
  //       this.verietyListDetails = dataList.EncryptedResponse.data;

  //       // if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.length > 0) {
  //       //   data.EncryptedResponse.data.forEach(element => {
  //       //     if (element.is_active == 1) {
  //       //       this.isCropSubmitted = true;
  //       //     }
  //       //   });
  //       //   // this.selectedVarietyForEdit = data.EncryptedResponse.data;
  //       //   // this.getFilledVarietyData(data.EncryptedResponse.data);
  //       // }
  //       if (this.verietyListDetails && this.verietyListDetails.varietiesforedit && this.verietyListDetails.varietiesforedit.length > 0) {
  //         this.verietyListDetails.varietiesforedit.forEach(element => {
  //           if (element.is_active == 1) {
  //             this.isCropSubmitted = true;
  //           } else {
  //             this.isCropSubmitted = false;
  //           }
  //         })
  //       }
  //       // Swal.fire({
  //       //   text: 'Please Select Variety to Proceed.',
  //       // })
  //       // if(!this.isCropSubmitted){
  //       // }
  //       let param = {
  //         year: year.value,
  //         season: season.value,
  //         crop_code: cropName.value,
  //         user_id: this.currentUser.id,
  //       }
  //       if (this.isCropSubmitted) {
  //         // alert('hi1')
  //         this.breederService.postRequestCreator('get-allocation-data', null, param).subscribe(data => {
  //           let result = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.allocationData ? data.EncryptedResponse.data.allocationData : '';
  //           console.log('result==========',result);
  //           let user = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.user ? data.EncryptedResponse.data.user : '';
  //           // let result= data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data:'';
  //           this.userList = user;
  //           let filterData = [];
  //           result.forEach((el => {
  //             console.log('el.m_crop_variety=========',el.m_crop_variety);
  //             filterData.push({
  //               variety_name: el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
  //               parental_line: el && el.m_variety_line && el.m_variety_line.line_variety_name ? el.m_variety_line.line_variety_name : '',
  //               // variety_name:el && el.variety_name && el.variety_name ? el.variety_id:'',
  //               allocationspaid: el && el.id ? el.id : '',
  //               variety_id: el && el.variety_id ? el.variety_id : '',
  //               line_variety_name: el && el.m_variety_line && el.m_variety_line.line_variety_name ? el.m_variety_line.line_variety_name : '',
  //               line_variety_code: el && el.m_variety_line && el.m_variety_line.line_variety_code ? el.m_variety_line.line_variety_code : '',
  //               indenter: el && el['allocation_to_spa_for_lifting_seed_production_cnters'] ? el['allocation_to_spa_for_lifting_seed_production_cnters'] : ''
  //             })
  //           }))
  //           console.log('filterData=========',filterData);
  //           this.dataToShow = filterData
  //           filterData = filterData.map(item => {
  //             let indenterWithProductions = item.indenter.map(indenter => {
  //               return {
  //                 ...indenter,
  //                 productions: [indenter] // Wrap the current indenter object in the productions array
  //               };
  //             });

  //             return {
  //               ...item,
  //               indenter: indenterWithProductions
  //             };
  //           });
  //           // filterData.forEach((el=>{
  //           //   el.indenter.forEach((val=>{
  //           //   //  val.productions=[]
  //           //   }))
  //           // }))
  //           // filterData.forEach((el=>{
  //           //   el.indenter.forEach((val=>{
  //           //   //  val.productions.push(val)
  //           //   }))
  //           // }))
  //           this.dataToDisplay = filterData
  //          let totalIntentValue = 0;
  //           let totalAllocateValue = 0;
  //           let totalleftValue = 0;
  //           this.dataToDisplay.forEach((val) => {
  //             val.indenter.forEach(item => {
  //               totalIntentValue += item.indent_qty; 
  //               totalAllocateValue += item.qty;
  //               totalleftValue += item.indent_qty - item.qty;
  //               item.productions.forEach(value => {
  //                 value.name = value && value.production ? value.production : '';
  //                 value.quantity = item && item.allocated_ ? item.allocated_ : '';
  //               })
  //               item.name = item && item.user && item.user.name ? item.user.name : '';
  //               item.indent_quantity = item && item.indent_qty ? item.indent_qty : '';
  //               // item.name=item && item.production  ? item.production:'';
  //               item.quantity = item && item.qty ? item.qty : '';

  //               item.allocated_quantity = item && item.qty ? item.qty : '';
  //               if (item && item.qty && item.indent_quantity) {
  //                 item.quantity_left_for_allocation = (item.indent_quantity - item.qty);
  //               }
  //               else if (item && item.qty) {
  //                 item.quantity_left_for_allocation = (item.qty);
  //               } else {
  //                 item.quantity_left_for_allocation = (item && item.indent_quantity ? item.indent_quantity : '');
  //               }
  //             })
  //           })
  //           for (let val of this.dataToDisplay) {
  //             let sum = 0;
  //             for (let value of val.indenter) {
  //               for (let data of value.productions) {
  //                 value.totalProductionlength = value.productions.length
  //                 val.totalIndentorlength = val.indenter.length
  //                 if (val.totalIndentorlength > 1) {

  //                   val.totalVarietyLength = val.indenter.length
  //                 } else {
  //                   val.totalVarietyLength = value.productions.length
  //                 }
  //                 sum += value.productions.length;
  //                 val.totalproductioIndentliength = sum

  //               }
  //             }
  //             // for (let value of val.indenter) {
  //             //   val.prods=[]
  //             //   for (let data of value.productions) {
  //             //     val.prods.push(data) ;
  //             //     val.totalVarietyLength=val.prods.length
  //             //   }
  //             // }
  //           }
  //           this.totalIntentValue = totalIntentValue?totalIntentValue:0; 
  //           this.totalAllocateValue = totalAllocateValue?totalAllocateValue:0;
  //           this.totalleftValue = totalleftValue?totalleftValue:0;
  //         })

  //       }
  //       if (this.verietyListDetails && this.verietyListDetails.varieties && this.verietyListDetails.varieties.length > 0) {
  //         this.verietyListDetails.varieties.forEach(element => {
  //           if (element) {
  //             const temp = {
  //               name: element.m_crop_variety.variety_name,
  //               value: element.m_crop_variety.id
  //             }
  //             this.tempVerietyListDetails.push(temp)
  //             this.varietyDropdownData.push(temp);
  //           }

  //         });
  //       }
  //       if (this.verietyListDetails && this.verietyListDetails.varietiesforedit && this.verietyListDetails.varietiesforedit.length > 0) {
  //         this.verietyListDetails.varietiesforedit.forEach(element => {
  //           if (element) {
  //             const temp = {
  //               name: element['m_crop_variety.variety_name'],
  //               value: element['m_crop_variety.id']
  //             }
  //             // this.tempVerietyListDetails.push(temp)
  //             this.editVarietyDropdown.push(temp);
  //           }

  //         });
  //       }

  //       if (this.varietyDropdownData.length == 0) {
  //         this.cropButtonEnable = true;
  //       }

  //       this.varietyDataload = true;

  //     } else {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Oops',
  //         text: dataList.EncryptedResponse.message + ": " + dataList.EncryptedResponse.status_code,
  //       })
  //     }
  //   })
  //   // this.breederService.postRequestCreator('allocationToSPA/getVarietyDataForEdit', null, object).subscribe(data => {

  //   // })

  // }

  getCropVerieties() {
    // Swal.fire({
    //   title: 'Loading Varities',
    //   html: 'Please Wait...',
    //   allowEscapeKey: false,
    //   allowOutsideClick: false,
    //   // didOpen: () => {
    //   //   Swal.showLoading(null)
    //   // }
    // });
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;

    this.varietyDropdownData = [];
    this.tempVerietyListDetails = [];

    let object = {
      formData: {
        year: year?.value || "NA",
        season: season?.value || "NA",
        crop_code: cropName?.value || "NA",
        user_id: this.currentUser.id,
      }
    }
    this.selectedVarietyForEdit = [];

    // this.isCropSubmittedNew = false;
    this.breederService.getRequestCreatorNew("allocation-to-spa-varieties" + "?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value).subscribe((dataList: any) => {
      if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
        this.verietyListDetails = dataList.EncryptedResponse.data;
        console.log('this.verietyListDetails=============', this.verietyListDetails);
        // if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.length > 0) {
        //   data.EncryptedResponse.data.forEach(element => {
        //     if (element.is_active == 1) {
        //       this.isCropSubmitted = true;
        //     }
        //   });
        //   // this.selectedVarietyForEdit = data.EncryptedResponse.data;
        //   // this.getFilledVarietyData(data.EncryptedResponse.data);
        // }
        if (this.verietyListDetails && this.verietyListDetails.varietiesforedit && this.verietyListDetails.varietiesforedit.length > 0) {
          this.verietyListDetails.varietiesforedit.forEach(element => {
            if (element.is_active == 1) {
              this.isCropSubmittedNew = true;
            } else {
              this.isCropSubmittedNew = false;
            }
          })
        }
        // Swal.fire({
        //   text: 'Please Select Variety to Proceed.',
        // })
        // if(!this.isCropSubmitted){
        // }
        let param = {
          year: year.value,
          season: season.value,
          crop_code: cropName.value,
          user_id: this.currentUser.id,
        }

        // if (this.isCropSubmitted) {
        this.breederService.postRequestCreator('get-allocation-data', null, param).subscribe((data) => {
          const allocationData = data?.EncryptedResponse?.data?.allocationData || [];
          const userData = data?.EncryptedResponse?.data?.user || [];

          // Transform allocationData
          const transformedData = allocationData.map((allocation) => {
            const indenterDetailsMap = new Map();

            allocation.allocation_to_spa_for_lifting_seed_production_cnters.forEach((indenter) => {
              const indenterName = indenter.user?.name || '';

              // If the indenter already exists, add to its productions
              if (indenterDetailsMap.has(indenterName)) {
                const existingIndenter = indenterDetailsMap.get(indenterName);
                existingIndenter.productions.push({
                  name: indenter.production,
                  allocated_quantity: indenter.qty || 0,
                  quantity_left_for_allocation: (indenter.indent_qty || 0) - (indenter.allocated_ || 0),
                });
              } else {
                // Create a new indenter object
                indenterDetailsMap.set(indenterName, {
                  name: indenterName,
                  indent_quantity: indenter.indent_qty || 0,
                  quantity: indenter.allocated_ || 0,
                  productions: [
                    {
                      name: indenter.production,
                      allocated_quantity: indenter.qty || 0,
                      quantity_left_for_allocation: (indenter.indent_qty || 0) - (indenter.allocated_ || 0),
                    },
                  ],
                });
              }
            });

            // Convert Map to Array
            const indenterDetails = Array.from(indenterDetailsMap.values());

            const totalProductions = indenterDetails.reduce(
              (sum, indenter) => sum + indenter.productions.length,
              0
            );

            return {
              variety_name: allocation?.m_crop_variety?.variety_name || '',
              parental_line: allocation?.m_variety_line?.line_variety_name || '',
              variety_id: allocation.variety_id || '',
              allocationspaid: allocation.id || '',
              indenter: indenterDetails,
              totalIndentorLength: indenterDetails.length,
              totalProductionsLength: totalProductions,
              totalVarietyLength: totalProductions,
            };
          });

          // Calculate totals
          let totalIntentValue = 0;
          let totalAllocateValue = 0;
          let totalLeftValue = 0;

          transformedData.forEach((val) => {
            val.indenter.forEach((indenter) => {
              totalIntentValue += indenter.indent_quantity;
              totalAllocateValue += indenter.quantity;
              totalLeftValue += (indenter.indent_quantity - indenter.quantity);
              // totalLeftValue += indenter.productions.reduce(
              //   (sum, prod) => sum + prod.quantity_left_for_allocation,
              //   0
              // );
            });
          });

          // Update component state
          this.userList = userData;
          this.dataToDisplay = transformedData;

          this.totalIntentValue = totalIntentValue;
          this.totalAllocateValue = totalAllocateValue;
          this.totalleftValue = totalLeftValue;

          console.log('Transformed Data:', this.dataToDisplay);
        });
        // }


        if (this.verietyListDetails && this.verietyListDetails.varieties && this.verietyListDetails.varieties.length > 0) {
          this.verietyListDetails.varieties.forEach(element => {
            console.log('element===', element['m_crop_variety.variety_name']);
            if (element) {
              const temp = {
                name: element && element['m_crop_variety.variety_name'] ? element['m_crop_variety.variety_name'] : '',
                value: element && element['m_crop_variety.id'] ? element['m_crop_variety.id'] : ''
              }
              this.tempVerietyListDetails.push(temp)
              this.varietyDropdownData.push(temp);
            }
          });
        }
        if (this.verietyListDetails && this.verietyListDetails.varietiesforedit && this.verietyListDetails.varietiesforedit.length > 0) {
          this.verietyListDetails.varietiesforedit.forEach(element => {
            if (element) {
              const temp = {
                name: element['m_crop_variety.variety_name'],
                value: element['m_crop_variety.id']
              }
              // this.tempVerietyListDetails.push(temp)
              this.editVarietyDropdown.push(temp);
            }

          });
        }

        console.log('this.editVarietyDropdown==', this.editVarietyDropdown);

        if (this.varietyDropdownData.length == 0) {
          this.cropButtonEnable = true;
        }

        this.varietyDataload = true;

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: dataList.EncryptedResponse.message + ": " + dataList.EncryptedResponse.status_code,
        })
      }
    })
    // this.breederService.postRequestCreator('allocationToSPA/getVarietyDataForEdit', null, object).subscribe(data => {

    // })
    // this.getCropVerieties();
  }

 




  onSelectVariety(event: any) {
    this.showgrid = true; 
    this.getSpaWiseIndent();
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;

    this.selectedVerietyDetail = {}
    let varietyLine = [];
    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['veriety_id'] = event.value;
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;
    this.editVarietyForm.controls['variety_id'].setValue(0);
    this.editVarietyForm.controls['variety_line'].setValue(0);
    this.varietyForm.controls['variety_line'].setValue(0)
    this.dataToDisplay = [];
    this.getVarietyLine();
  }

  onSelectIndentor(event: any) {
    this.selectedIndentor = this.indentors.find(x => x.value == event.value)
    this.selectedIndentorModel = event;

    let selectedIndentor = this.selectedIndentor && this.selectedIndentor.productions ? this.selectedIndentor.productions : '';

    let variety = this.editVarietyForm.controls['variety_id'].value && this.editVarietyForm.controls['variety_id'].value[0] && this.editVarietyForm.controls['variety_id'].value[0].value ? this.editVarietyForm.controls['variety_id'].value[0].value : '';
    if (variety) {
      let datas = this.dataToDisplay && this.dataToDisplay[0] && this.dataToDisplay[0].indenter ? this.dataToDisplay[0].indenter : '';
      let productionToUpdate = this.selectedIndentor && this.selectedIndentor.productions ? this.selectedIndentor.productions : '';
      if (datas && datas.length > 0) {

        datas = datas.filter(x => x.spa_id == this.selectedIndentor.spa_id)
      }

      if (selectedIndentor && selectedIndentor.length > 0) {

        selectedIndentor.forEach(item1 => {
          let match = datas.find(item2 => item2.production == item1.bspc_id);
          if (match) {
            item1.quantity = match.qty; // Update quantity in arr1
          }
        });
      }

      // let productionToUpdate = datas.find(item => item.spa_id === this.selectedIndentor.spa_id && item.spa_code === this.selectedIndentor.spa_code);      
      // let result =  this.selectedIndentor.map(item => {
      //   const allocation = datas.find(allocation => allocation.spa_code === item.spa_code);
      //   if (allocation) {
      //     item.quantity_left_for_allocation = allocation.quantity_left_for_allocation;
      //   }
      //   return item;
      // });
      if (datas && datas.length > 0) {
        datas.forEach((el => {
          if (el.spa_code == this.selectedIndentor.spa_code) {
            this.selectedIndentor.quantity_left_for_allocation = el.quantity_left_for_allocation
          }
        }))
      }

      // Update the quantity in json1's productions
      // if (productionToUpdate) {
      //   this.selectedIndentor.productions[0].quantity = productionToUpdate.quantity;
      //   // this.selectedIndentor.quantity_left_for_allocation=
      // }
    }
    if (selectedIndentor && selectedIndentor.length > 0 && variety) {
      let sum = 0
      selectedIndentor.forEach(el => {
        sum += el.quantity;
        this.selectedIndentor.allocated_quantity = sum;
        // this.selectedIndentor.quantity_left_for_allocation = this.selectedIndentor.quantity_left_for_allocation - sum;
        this.inputForm.controls['quantityInputBox'].setValue(el && el.quantity ? el.quantity : '');
      })
    } else {

      this.inputForm.controls['quantityInputBox'].setValue(0);
      this.editVarietyForm.controls['variety_id'].setValue(0);
      this.editVarietyForm.controls['variety_id'].setValue(0);
    }


  }



  newQuantity(qty, prodCenter) {
    return { "qty": parseFloat(qty), "productionCenter": prodCenter }
  }

  onItemSelect(event: any) {
    this.selectedItem = event;

  }


  qtyChanged(e, production, productionIndex) {
    let value;

    if (e.target.value >= 0) {
      value = Number(e.target.value);
    } else {
      value = 0
    }

    production['quantity'] = value;

    let temp1 = 0;
    this.selectedIndentor['productions'].forEach(element => {
      temp1 += element.quantity;
    });

    this.selectedIndentor['allocated_quantity'] = temp1;
    this.selectedIndentor['quantity_left_for_allocation'] = this.getQuantityOfSeedProduced(this.selectedIndentor.indent_quantity - temp1);

  }

  submitData(indenter?: any) {
    this.indentorsubmitted = true;
    console.log('edit data', indenter);
    if (this.dataToDisplay && this.dataToDisplay[0] && this.dataToDisplay[0].allocationspaid) {
      this.submissionIdNew = this.dataToDisplay[0].allocationspaid
      this.editVarietyForm.controls['variety_id'].setValue([{
        "value": this.dataToDisplay[0].variety_id,
        "name": this.dataToDisplay[0].variety_name
      }])
    }
    if (this.varietyForm.controls['variety_id'].value) {
      this.submissionIdNew = null
    }
    let variety_id = this.varietyForm.controls['variety_id'].value || this.editVarietyForm.controls['variety_id'].value;

    // return;
    if (variety_id) {
      const restQuantity = this.getPercentage(indenter.indent_quantity);
      if (indenter.allocated_quantity > restQuantity) {
        Swal.fire({

          title: '<p style="font-size:25px;">Allocated Quantity Should Be Proportional to Total Indent Quantity.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })

        const index = this.submittedData.findIndex(x => x.variety_id == this.selectedVerietyDetail.veriety_id);

        if (index > -1) {
          const newIndex = this.submittedData[index].indenter.findIndex(y => y.value == indenter.value)

          if (newIndex > -1) {
            this.submittedData[index].indenter.splice(newIndex, 1);
          }
        }

      } else {

        var invalid = false;
        let isValueZero = true;

        indenter.productions.forEach(data => {
          if (data.quantity > 0) {
            isValueZero = false
          }
        });

        let quantityValue = 0;
        for (let val of indenter.productions) {
          quantityValue += val.quantity;

        }
        let resultPercentage = this.getPercentage(this.selectedIndentor.indent_quantity)

        if (Number(resultPercentage) <= quantityValue) {
          isValueZero = false
        }

        if (isValueZero) {
          Swal.fire({
            title: '<p style="font-size:25px;">Allocated Quantity Should Not Be 0.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })

          invalid = true;
          return
        }



        if (!invalid) {
          const index = this.submittedData.findIndex(x => x.variety_id == this.selectedVerietyDetail.veriety_id);

          if (index > -1) {
            const newIndex = this.submittedData[index].indenter.findIndex(y => y.value == indenter.value)
            if (newIndex > -1) {
              this.submittedData[index].indenter.splice(newIndex, 1);
            }
          }

          const variety = {
            variety_id: this.selectedVerietyDetail.veriety_id,
            variety_line_code: this.selectedVerietyDetail.variety_line_code,
            totalIndentQuantity: this.selectedVerietyDetail.totalIndentQuantity,
            totalAllocationQuantity: this.selectedVerietyDetail.totalAllocationQuantity,
            productionCenters: this.selectedVerietyDetail.productionCenters,
            indenter: []
          }


          const temp = {
            name: indenter.name,
            allocated_quantity: indenter.allocated_quantity,
            indent_quantity: indenter.indent_quantity,
            productions: [],
            quantity_left_for_allocation: indenter.quantity_left_for_allocation,
            value: indenter.value,
            spa_code: indenter.spa_code,
            state_code: indenter.state_code
          }

          indenter.productions.forEach(x => {

            const temp2 = {
              id: x.id,
              agency_name: x.agency_name,
              name: x.name,
              quantity: x.quantity,
              value: x.value,
              bspc_id: x.bspc_id,
            }

            temp.productions.push(temp2)
          });

          if (index > -1) {
            this.submittedData[index].indenter.push(temp);

          } else {
            variety.indenter.push(temp)
            this.submittedData.push(variety)
          }

          const indenterIndex = this.indentors.findIndex(x => x.value == indenter.value)

          if (indenterIndex > -1) {
            this.indentors.splice(indenterIndex, 1);
            this.selectedIndentor = undefined;
            this.tempForm.reset();
          }

          this.indentors = []

          this.selectedVerietyDetail['indentors'].forEach(element => {
            const varietyIndex = this.submittedData.findIndex(x => x.variety_id == this.selectedVerietyDetail.veriety_id);


            if (varietyIndex > -1) {
              const indenterIndex = this.submittedData[varietyIndex].indenter.findIndex(y => y.value == element.id);

              if (indenterIndex == -1) {
                const obj = {
                  name: element.user.name ? element.user.name : 'NA',
                  // agency_name: element.user.agency_detail.agency_name ? element.user.agency_detail.agency_name : 'NA',
                  agency_name: element.user.agency_name ? element.user.agency_name : 'NA',
                  value: element.id,
                  allocated_quantity: element.allocated_quantity,
                  indent_quantity: element.indent_quantity,
                  productions: element.productions,
                  quantity_left_for_allocation: element.quantity_left_for_allocation,
                  spa_code: element.spa_code,
                  state_code: element.state_code
                }

                this.indentors.push(obj);
              }

            }
          })

          this.dataToShow = this.submittedData;
          this.dataToShowSecond = this.submittedData;


          for (let val of this.dataToShow) {
            let sum = 0;
            let calculateAllocatyQty = 0;
            for (let value of val.indenter)

              for (let data of value.productions) {
                value.productions = value.productions.filter(item => item.quantity > 0)

                calculateAllocatyQty += value.allocated_quantity
                val.calculateAllocatyQty = calculateAllocatyQty
                value.totalProductionlength = value.productions.length
                val.totalIndentorlength = val.indenter.length
                if (val.totalIndentorlength > 1) {

                  val.totalVarietyLength = value.productions.length + val.indenter.length
                } else {
                  val.totalVarietyLength = value.productions.length
                }
                sum += value.productions.length;
                val.totalproductioIndentliength = sum

              }
          }


          this.dataToDisplay = [];

          const newTemp = this.submittedData.find(x => x.variety_id == this.selectedVerietyDetail.veriety_id);


          const copiedPerson = JSON.parse(JSON.stringify(newTemp));

          copiedPerson['indenter'].forEach(inden => {
            inden.productions.forEach((prod, i) => {
              if (prod.quantity <= 0) {
                inden.productions.splice(i, 1);
              }
            });
          });


          copiedPerson.totalproductioIndentliength = 0;
          copiedPerson.totalVarietyLength = 0;
          copiedPerson.totalIndentorlength = 0
          this.dataToDisplay.push(copiedPerson);


          for (let val of this.dataToShow) {
            let sum = 0
            val.prods = []
            for (let data of val.indenter) {
              data.productions.forEach(element => {
                val.prods.push(element)
              });

              val.prodlength = val.prods.length

            }

          }

          let mergedData
          if (this.dataToDisplay && this.dataToDisplay.length > 0) {
            this.dataToDisplay.forEach(element => {
              element.productionData = []
            });
            this.dataToDisplay.forEach(element => {
              element.indenter.forEach(val => {
                element.productionData.push(...val.productions)
              })
            });
            if (this.dataToDisplay)
              Swal.fire({
                title: '<p style="font-size:25px;">Allocation has been successfully made.</p>',
                icon: 'success',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#E97E15'
              })
            mergedData = this.dataToDisplay.map(item => {
              const productionDataMap = new Map();

              item.productionData.forEach(prod => {
                const key = `${prod.bspc_id}`;
                if (productionDataMap.has(key)) {
                  productionDataMap.get(key).quantity += prod.quantity ? prod.quantity : 0;
                } else {
                  productionDataMap.set(key, { ...prod });
                }
              });

              return {
                ...item,
                allocationspaid: this.submissionIdNew ? this.submissionIdNew : null,
                productionData: Array.from(productionDataMap.values())
              };
            });
            console.log("mergedData2222", mergedData);
          }
          if (this.selectedVerietyDetail && this.selectedVerietyDetail.productionCenters && mergedData && mergedData.length > 0) {
            this.selectedVerietyDetail.productionCenters.forEach((item => {

              mergedData.forEach((el => {
                el.productionData.forEach(val => {
                  if (item.user.id == val.bspc_id) {
                    item.quantityAllocated = val && val.quantity ? val.quantity : ''

                  }

                })
              }))
            }))
          }
        }

      }
    }
  }

  getVarietyName(id: any) {
    console.log('id===',id);
    let variety_name;
    console.log('this.verietyListDetails',this.verietyListDetails);
    this.verietyListDetails.varieties.forEach(x => {
      if (x && x.variety_id == id) {
        variety_name = x;
      }
    });
    console.log('variety_name',variety_name);
    return variety_name['m_crop_variety.variety_name']
    // if (variety_name && variety_name.m_crop_variety && variety_name.m_crop_variety.variety_name) {
    //   return variety_name['m_crop_variety.variety_name']
    // }
    // console.log("variety_name.m_crop_variety.variety_name", variety_name.m_crop_variety.variety_name);
  }
//  getVarietyName1(id: any) {
//     console.log('id===',id);
//     let variety_name = [];
//     console.log('this.verietyListDetails',this.verietyListDetails);
//     this.verietyListDetails.varietiesforedit.forEach(x => {
//       console.log('data1',x)
//       if (x && x.variety_id == id) {
//         variety_name.push(x);
//       }
//     });
//     // console.log('variety_name',variety_name[]);
//     return variety_name[0]['m_crop_variety.variety_name']
//     // if (variety_name && variety_name.m_crop_variety && variety_name.m_crop_variety.variety_name) {
//     //   return variety_name['m_crop_variety.variety_name']
//     // }
//     // console.log("variety_name.m_crop_variety.variety_name", variety_name.m_crop_variety.variety_name);
//   }

 
//  getVarietyName1(id: any) {
//   console.log('👉 Input id =', id);

//   // ✅ fallback priority: varietiesforedit > varieties
//   const source = (this.verietyListDetails?.varietiesforedit?.length > 0)
//     ? this.verietyListDetails.varietiesforedit
//     : this.verietyListDetails?.varieties || [];

//   console.log('📋 Searching in source:', source);

//   let variety = source.find((x: any) =>
//     (x?.variety_id && x.variety_id == id) ||
//     (x?.['m_crop_variety.id'] && x['m_crop_variety.id'] == id) ||
//     (x?.m_crop_variety?.id && x.m_crop_variety.id == id)
//   );

//   console.log('🔎 Matched variety =', variety);

//   // ✅ handle both flat keys and nested object keys
//   if (variety) {
//     const name =
//       variety['m_crop_variety.variety_name'] ||
//       variety?.m_crop_variety?.variety_name ||  
//       variety.variety_name;

//     if (name) {
//       console.log('✅ Returning variety name =', name);
//       return name;
//     }
//   }

//   console.warn('⚠️ No valid variety found for id:', id);
//   return 'NA';
// }

 getVarietyName1(id: any) {
  console.log('👉 Input id =', id);

  // ✅ Source priority: varietiesforedit > varieties
  const source = (this.verietyListDetails?.varietiesforedit?.length > 0)
    ? this.verietyListDetails.varietiesforedit
    : this.verietyListDetails?.varieties || [];

  console.log('📋 Searching in source:', source);

  // ✅ Try all possible id keys
  let variety = source.find((x: any) =>
    (x?.variety_id && x.variety_id == id) ||
    (x?.['m_crop_variety.id'] && x['m_crop_variety.id'] == id) ||
    (x?.m_crop_variety?.id && x.m_crop_variety.id == id) ||
    (x?.variety_line_code && x.variety_line_code == id)
  );

  console.log('🔎 Matched variety =', variety);

  // ✅ If match found, return proper name
  if (variety) {
    const name =
      variety['m_crop_variety.variety_name'] ||
      variety?.m_crop_variety?.variety_name ||
      variety?.variety_name;

    if (name) {
      console.log('✅ Returning variety name =', name);
      return name;
    }
  }

  // 🚨 Fallback → return input id (so user sees what they selected)
  console.warn(`⚠️ No valid variety found for id: ${id}, showing selected value instead.`);
  return this.getVarietyName(id); 
  
}




  getFilledVarietyData(variety) {
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;

    this.submittedData = [];

    variety.forEach((varietyElement: any) => {
      this.editVariety = varietyElement;

      this.breederService.getRequestCreatorNew("allocation-to-spa-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + varietyElement.variety_id).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
          const variety = data.EncryptedResponse.data;

          const producionCentersList = []

          variety.productionCenters.forEach(element => {
            let temp = {
              name: element.user.name,
              value: element.produ,
              id: element.id,
              bspc_id: element.user.id,
              quantity: 0,

            }
            producionCentersList.push(temp);
          })

          const object = {
            id: varietyElement.id,
            variety_id: varietyElement.variety_id,
            totalIndentQuantity: Number(varietyElement.totalIndentQuantity),
            totalAllocationQuantity: Number(varietyElement.productionQuantity),
            indenter: [],
            productionss: [],
            productionCenters: variety.productionCenters
          }

          const indentors = [];
          const prods = [];

          variety.indentors.forEach(element => {
            element.quantity_left_for_allocation = element.indent_quantity - element.allocated_quantity
            element['productions'] = producionCentersList;

            const obj = {
              name: element.user.name ? element.user.name : 'NA',
              // agency_name: element.user.agency_detail.agency_name ? element.user.agency_detail.agency_name : 'NA',
              agency_name: element.user.agency_name ? element.user.agency_name : 'NA',
              value: element.id,
              allocated_quantity: element.allocated_quantity,
              indent_quantity: element.indent_quantity,
              productions: producionCentersList,
              quantity_left_for_allocation: element.quantity_left_for_allocation,
              spa_code: element.spa_code,
              state_code: element.state_code,
              user_id: element.user_id
            }

            indentors.push(obj);

          })

          const tempIndentors = []

          indentors.forEach((indentor, i) => {
            const tempIndentor = {
              name: indentor.name,
              value: indentor.value,
              indent_quantity: indentor.indent_quantity,
              allocated_quantity: indentor.allocated_quantity,
              quantity_left_for_allocation: indentor.quantity_left_for_allocation,
              spa_code: indentor.spa_code,
              state_code: indentor.state_code,
              user_id: indentor.user_id,
              productions: []
            }
            indentor.productions.forEach((producion, j) => {
              const temp = {
                id: producion.id,
                name: producion.name,
                quantity: producion.quantity,
                value: producion.value
              }

              varietyElement.indentor.forEach(editIndentor => {
                editIndentor.productions.forEach(editProducion => {
                  if (indentor.spa_code == editIndentor.spa_code) {
                    if (producion.id == editProducion.production_center_id) {
                      temp.quantity = editProducion.qty;
                      producion = temp
                    }
                  }
                });
              });

              tempIndentor.productions.push(temp)

            });

            tempIndentors.push(tempIndentor)
          });

          object.indenter = tempIndentors;


          object.indenter.forEach(element => {
            element.productions.forEach(prod => {
              element.allocated_quantity += prod.quantity
            });
          });

          this.submittedData.push(object)

          this.submittedData.forEach(element => {
            element.indenter.forEach(ind => {
              ind.quantity_left_for_allocation = ind.indent_quantity - ind.allocated_quantity;
            });
          });

          this.dataToShow = this.submittedData;

          for (let val of this.dataToShow) {
            let sum = 0
            val.prods = []
            for (let data of val.indenter) {
              data.productions.forEach(element => {
                val.prods.push(element)
              });

              val.prodlength = val.prods.length

            }

          }
          for (let val of this.dataToShow) {
            for (let value of val.indenter) {

              let sum = 0;
              for (let data of value.productions) {

                value.totalProductionlength = value.productions.length
                val.totalIndentorlength = val.indenter.length
                sum += value.productions.length;
                val.totalproductioIndentliength = sum

              }
            }

          }

          this.dataToDisplay = [];

          // if (this.isCropSubmitted) {
          this.dataToDisplay = this.dataToShow;
          // }

          this.editVarietyDropdown = [];
          // this.submittedData.forEach(element => {

          //   const index = this.editVarietyDropdown.findIndex(x => x.value == element.variety_id);
          //   if (index == -1) {
          //     const object = {
          //       name: this.getVarietyName(element.variety_id),
          //       value: element.variety_id
          //     }

          //     this.editVarietyDropdown.push(object)
          //   }

          // });


          if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
            this.productionPercentage = 100;
          } else {
            this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
          }

        }
      })
    });

  }

  onSelectEditVariety(event: any) {
    this.isEdit = true;
    this.getSpaWiseIndent();
    this.getSpaLineData()
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    this.selectedVerietyDetailbtn = true;

    this.selectedVarietyFrom = 1;
    this.indentorLoad = false;

    this.selectedVerietyDetail = {}
    this.indentors = []
    this.tempForm.controls['selectedIndentorModel'].patchValue(null)
    this.selectedIndentor = null;

    // this.varietyForm.reset();
    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['variety_id'] = event.value;
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;
    this.editVarietyForm.controls['variety_line'].setValue(0);
    this.dataToDisplay = [];
    this.isEditingVariety = true;
  }

  onSelectEditVariety2(event: any) {
    this.isEdit = true;
    this.getSpaWiseIndent();
    this.getSpaLineData()
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    this.selectedVerietyDetailbtn = true;

    this.selectedVarietyFrom = 1;
    this.indentorLoad = false;

    this.selectedVerietyDetail = {}
    this.indentors = []
    this.tempForm.controls['selectedIndentorModel'].patchValue(null)
    this.selectedIndentor = null;

    // this.varietyForm.reset();

    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['variety_id'] = event.value;
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;
    // this.editVarietyForm.controls['variety_line'].setValue(0);



  }

  onEditIndentor(event) {
    this.editSelectedIndentor = this.editIndentors.find(x => x.value == event.value)
  }

  editQtyChanged(e, production, productionIndex) {
    let value;

    if (e.target.value >= 0) {
      value = Number(e.target.value);
    } else {
      value = 0
    }

    production['quantity'] = value;

    let temp1 = 0;
    this.editSelectedIndentor['productions'].forEach(element => {
      temp1 += element.quantity;
    });

    this.editSelectedIndentor['allocated_quantity'] = temp1;
    this.editSelectedIndentor['quantity_left_for_allocation'] = this.getQuantityOfSeedProduced(this.editSelectedIndentor.indent_quantity - temp1);
  }

  updateVarietyData(indenter?: any) {
    const restQuantity = this.getPercentage(indenter.indent_quantity);

    if (indenter.allocated_quantity > restQuantity) {
      Swal.fire({

        title: '<p style="font-size:25px;">Allocated Quantity Should Be Proportional to Total Indent Quantity.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      indenter['productions'].forEach(element => {
        element.quantity = 0;
      });

      indenter.allocated_quantity = 0;
      indenter.quantity_left_for_allocation = indenter.indent_quantity

      return
    } else {
      var invalid = false;

      this.editSelectedVariety.productionCenters.forEach(element => {
        indenter.productions.forEach(data => {
          if (element.production_center_id == data.value) {
            const quantityAllocated = element.quantityAllocated;

            if (element.quantityProduced < (quantityAllocated + data.quantity)) {
              Swal.fire({
                title: '<p style="font-size:25px;">Quantity Allocated Should Not Be More Than Quantity Produced.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#E97E15'
              })

              invalid = true;
              return
            } else {
              element.quantityAllocated = quantityAllocated + data.quantity;
            }
          }
        });
      });

      var invalid = false;

      this.editSelectedVariety.productionCenters.forEach(prod => {
        prod.quantityAllocated = 0
        this.editSelectedVariety.indenter.forEach(inden => {
          inden.productions.forEach(element => {
            if (prod.produ == element.id) {

              prod.quantityAllocated += element.quantity

              if (prod.quantityAllocated > prod.quantityProduced) {
                Swal.fire({
                  title: '<p style="font-size:25px;">Quantity Allocated Should Not Be More Than Quantity Produced.</p>',
                  icon: 'error',
                  confirmButtonText:
                    'OK',
                  confirmButtonColor: '#E97E15'
                })
                prod.quantityAllocated -= element.quantity
                invalid = true;
                return

              }
            }
          });
        })
      })

      this.dataToDisplay = [];
      const copiedPerson = JSON.parse(JSON.stringify(this.editSelectedVariety));

      copiedPerson['indenter'].forEach(inden => {
        inden.productions.forEach((prod, i) => {
          if (prod.quantity <= 0) {
            inden.productions.splice(i, 1);
          }
        });
      });


      copiedPerson.totalproductioIndentliength = 0;
      copiedPerson.totalVarietyLength = 0;
      copiedPerson.totalIndentorlength = 0

      this.dataToDisplay.push(copiedPerson);

      for (let val of this.dataToDisplay) {
        let sum = 0;
        for (let value of val.indenter)
          for (let data of value.productions) {
            value.totalProductionlength = value.productions.length
            val.totalIndentorlength = val.indenter.length
            if (val.totalIndentorlength > 1) {

              val.totalVarietyLength = value.productions.length + val.indenter.length
            } else {
              val.totalVarietyLength = value.productions.length
            }
            sum += value.productions.length;
            val.totalproductioIndentliength = sum

          }
      }
    }

    if (!invalid) {
      this.editSelectedIndentor = null;
      this.editTempForm.reset()
    }
  }

  cancelVarietyData(indenter?: any) {
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let object = {
      formData: {
        year: year.value,
        season: season.value,
        crop_code: cropName.value,
        user_id: this.currentUser.id,
      }
    }
    this.breederService.postRequestCreator("allocationToSPA/getVarietyDataForEdit", null, object).subscribe((data: any) => {
      this.getFilledVarietyData(data.EncryptedResponse.data);

      this.editVarietyForm.controls['variety_id'].setValue('')
      this.inputForm.controls['quantityInputBox'].setValue('0')
      this.inputForm.get('quantityInputBox').setValue(0);
      this.editVarietyForm.get('quantityInputBox').setValue(0);

      this.dataToDisplay = []

      this.editSelectedVariety = false
    })

  }

  getQuantity(indenter) {
    if (indenter['productions'] != undefined) {
      indenter['allocated_quantity'] = parseFloat(indenter.productions.reduce((acc, val) => acc += val.qty, 0)).toFixed(2)
      return indenter['allocated_quantity']
    } else {
      indenter['allocated_quantity'] = 0
      return indenter['allocated_quantity'];
    }
  }

  getLeftQuantity(indenter) {
    if (indenter['productions'] != undefined) {

      indenter['quantity_left_for_allocation'] = (((parseFloat(indenter.indent_quantity)) - (indenter.productions.reduce((acc, val) => acc += val.qty, 0)))).toFixed(2)
      return indenter['quantity_left_for_allocation'] < 0 ? 0 : indenter['quantity_left_for_allocation'];
    } else {
      indenter['quantity_left_for_allocation'] = (parseFloat(indenter.indent_quantity)).toFixed(2)
      return indenter['quantity_left_for_allocation'];
    }
  }



  isNumberKey(evt) {
    var input = <HTMLInputElement>evt.srcElement;

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      evt.preventDefault();
    }
    let value = input.value
    if ((value.indexOf('.') != -1) && (value.substring(value.indexOf('.')).length > 2)) {
      evt.preventDefault();
    }
  }

  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }

  getCropName(crops) {
    crops.forEach((x: any, index: number) => {
      let crop = x
      if (crop != null) {
        x["name"] = crop['name'];
        x["value"] = crop['value'];
        this.cropName.push(x);
      }
    });
    this.fieldsList[1].fieldDataList = this.cropName
  }

  createProductonCenter(element) {
    let yrs = []
    element.productionCenter.forEach((x: any, index: number) => {
      yrs.push({ name: x.user.agency_detail.agency_name, value: x.user.agency_detail.agency_name, id: x.production_center_id })
    })

    this.productionCenter = yrs;
    return yrs;
  }

  getQuantityMeasure(crop_code) {
    this.quantity = crop_code.split('')[0] == 'A' ? 'Qt' : 'Kg'
    return crop_code.split('')[0] == 'A' ? 'Qt' : 'Kg'
  }

  createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);

      if (this.isEdit && (x.formControlName == "season" || x.formControlName == "yearofIndent" || x.formControlName == "cropName")) {
        newFormControl.disable();
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  createFormControlsOfAGroupUI(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>, element) {
    let crop_code = this.IstPartFormGroupControls['cropName'].value.value
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "season" || x.formControlName == "yearofIndent" || x.formControlName == "cropName")) {
        newFormControl.disable();
      }
      if (x.formControlName == "productionCenter") {
        x.fieldDataList = this.productionCenter
      }
      if (["indentingQuantity", "actualProduction", "quantityOfBreederSeedAllocated", "addQuantityOfBreederSeedletf", "quantity_of_breeder_seed_lifted", "quantity_of_breeder_seed_balance"].includes(x.formControlName)) {
        let name = x.fieldName.split("(")[0]
        x.fieldName = name + " (" + this.getQuantityMeasure(crop_code) + ")"
      }
      formGroup.addControl(x.formControlName, newFormControl);
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

  patchForm(data: any) {
    this.IstPartFormGroupControls["yearofIndent"].patchValue(data.year);
    this.IstPartFormGroupControls["cropName"].patchValue(data.crop);
  }


  submitForm(formData) {
    const year = formData.IstPartFormGroup.yearofIndent.value;
    const season = formData.IstPartFormGroup.season.value;
    const crop_code = formData.IstPartFormGroup.cropName.value;

    if (year && season && crop_code) {
      if (this.dataToShow && this.dataToShow.length > 0) {
        this.dataToShow.forEach(element => {
          element['year'] = year;
          element['season'] = season;
          element['crop_code'] = crop_code;
        });
      }

      this.isEditingVariety = false;
      // return;
      // this.isEdit ? this.update(this.dataToShow) : this.create(this.dataToShow);
      // this.isEdit ? this.update(this.dataToShow) : 
      this.create(this.dataToShow);
      this.search();
    } else {
      Swal.fire('Error', 'Please Fill all the Details.', 'error');
    }

  }
  cancelEdit() {
    // Reset editing-related variables and forms   
    this.isEditingVariety = false;
    this.dataToDisplay = []
    this.selectedVerietyDetail = null;
    this.varietyForm.reset(); // Reset the form
    this.tempForm.controls['selectedIndentorModel'].patchValue(null); // Reset related fields if needed
    this.selectedIndentor = null;
    this.indentors = [];
    this.varietyWiseTotalIndentValue = null;
    this.productionPercentage = null;
    this.editVarietyForm.reset();
  }

  create(params) {

    let datas = this.varietyForm.controls['variety_line'].value;
    let varietyLine = [];
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    if (datas && datas.length > 0) {
      datas.forEach(el => {
        varietyLine.push(el && el.variety_line_code ? el.variety_line_code : '')
      })
    }
    let object = {
      formData: params
    }
    let message = "";
    if (this.submissionIdNew) {
      object.formData[0]['allocationspaid'] = this.submissionIdNew
      message = "Variety data has been successfully Updated"
    } else {
      message = "Variety data has been successfully saved"
    }

    this.breederService.postRequestCreator("allocation-to-spa", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {

        Swal.fire({
          title: '<p style="font-size:25px;">' + message + '.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })

        this.editVarietyForm.controls['variety_id'].reset();
        this.varietyForm.controls['variety_id'].reset();
        this.varietyWiseTotalIndentValue = null;
        this.getVarietyLine2();
        this.getVarietiesData()
        // this.varietyForm.reset();
        // this.editVarietyForm.reset();
        // this.getCropVerieties()
        this.productionPercentage = 0;
        this.submittedData = []
        this.dataToShow = []
        this.dataToDisplay = [];
        this.indentors = [];
        if (this.varietyDropdownData.length == 0) {
          this.cropButtonEnable = true;
        }

        this.selectedVerietyDetail = null;

        if (this.tempVerietyListDetails.length == 0) {
          this.cropButtonEnable = true;
        }
      }
      else if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.message) {
        Swal.fire({
          icon: 'info',
          title: 'Already Exist',
          text: 'BSP Form Has Already Been Filled For This Variety.',
        })
      }
      else {
        Swal.fire({
          title: 'Oops',
          text: '<p style="font-size:25px;">Something Went Wrong.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
      }
    })
  }
  getVarietiesData() {
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    this.breederService.getRequestCreatorNew("allocation-to-spa-varieties" + "?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value).subscribe((dataList: any) => {
      if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
        this.verietyListDetails = dataList.EncryptedResponse.data;
        this.varietyDropdownData = [];
        this.editVarietyDropdown = [];
        this.tempVerietyListDetails = []
        if (this.verietyListDetails && this.verietyListDetails.varieties && this.verietyListDetails.varieties.length > 0) {
          this.verietyListDetails.varieties.forEach(element => {
            if (element) {
              const temp = {
                name: element && element['m_crop_variety.variety_name'] ? element['m_crop_variety.variety_name'] : '',
                value: element && element['m_crop_variety.id'] ? element['m_crop_variety.id'] : ''
              }
              this.tempVerietyListDetails.push(temp)
              this.varietyDropdownData.push(temp);
            }

          });
        }


        if (this.verietyListDetails && this.verietyListDetails.varietiesforedit && this.verietyListDetails.varietiesforedit.length > 0) {
          this.verietyListDetails.varietiesforedit.forEach(element => {
            if (element) {
              const temp = {
                name: element['m_crop_variety.variety_name'],
                value: element['m_crop_variety.id']
              }
              // this.tempVerietyListDetails.push(temp)
              this.editVarietyDropdown.push(temp);
            }

          });
        }

        if (this.varietyDropdownData.length == 0) {
          this.cropButtonEnable = true;
        }

        this.varietyDataload = true;

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: dataList.EncryptedResponse.message + ": " + dataList.EncryptedResponse.status_code,
        })
      }
    })
  }


  update(params) {
    let object = {
      formData: params
    }
    // return;
    this.breederService.postRequestCreator("allocation-to-spa/edit", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          icon: 'success',
          title: 'Data Has Been Successfully Updated.',
          showConfirmButton: false,
          timer: 1000
        })
        this.isEdit = false;
        this.getVarietyLine2();
        this.getVarietiesData()
        this.varietyForm.reset();
        this.editVarietyForm.reset();
        // this.getCropVerieties()
        this.productionPercentage = 0;
        this.submittedData = []
        this.dataToShow = []
        this.dataToDisplay = [];
        this.indentors = [];
        if (this.varietyDropdownData.length == 0) {
          this.cropButtonEnable = true;
        }

        this.selectedVerietyDetail = null;

        if (this.tempVerietyListDetails.length == 0) {
          this.cropButtonEnable = true;
        }
        // this.router.navigate(['seed-division/breeder-seed-allocation-lifting']);
      } else {
        Swal.fire({
          title: 'Oops',
          text: '<p style="font-size:25px;">Something Went Wrong.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
      }
    })
  }


  cropWiseSubmission() { 
    this.showgrid1 =true;
    const year = this.formSuperGroup.value.IstPartFormGroup.yearofIndent.value;
    const season = this.formSuperGroup.value.IstPartFormGroup.season.value;
    const crop_code = this.formSuperGroup.value.IstPartFormGroup.cropName.value;
    let param = {
      year: year,
      season: season,
      crop_code: crop_code
    }

    Swal.fire({
      title: 'Are You Sure To Submit Crop Wise Allocation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.breederService.postRequestCreator("update-allocation-status", null, param).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Crop Wise Data Submitted.',
              showConfirmButton: false,
              timer: 1500
            }).then(x => {
              this.search()
            })
            // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            //   this.router.navigate(['allocation-breeder-seed-spa-wise']);
            // });
          } else if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 201) {
            Swal.fire({
              title: '<p style="font-size:25px;">Crop Wise Data Already Submitted.</p>',
              icon: 'info',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops',
              text: data.EncryptedResponse.message,
            })
          }
        })

      }
    })


  }

  saveAndNavigate() {
    if (this.filterPaginateSearch.itemListTotalPage > this.filterPaginateSearch.itemListCurrentPage) {
      this.filterPaginateSearch.navigate("next");
    }
  }

  saveAsDraft() {
    const params = []
    let newValue = this.IstPartFormGroupControls
    let year = newValue['yearofIndent'].value.value
    let crop_code = newValue['cropName'].value.value
    let indentor = this.IstPartFormGroupControls["indentorName"].value
    let indentForm = indentor.details[0][0].formGroup
    if (indentForm.invalid) {
      Swal.fire('Error', 'Please Fill Out all Required Fields.', 'error');
      return;
    }
    let indentorDetails = indentForm.controls
    params.push({
      "breeder_seed_quantity_left": indentorDetails['addQuantityOfBreederSeedletf'].value,
      "crop_code": crop_code,
      "is_active": 1,
      "production_center_id": indentorDetails['productionCenter'].value.id,
      "quantity": indentorDetails['quantityOfBreederSeedAllocated'].value,
      "user_id": this.currentUser.id,
      "variety_id": newValue['cropVarieties'].value.id,
      "year": year,
      "isdraft": 1,
      "indent_of_breeder_id": indentor.id,
      "id": this.submissionId
    })
    this.isEdit ? this.update(params[0]) : this.create(params)
  }

  activateVarietyIndexInAccordion(varietyIndexInAccordion: number) {
    if (this.activeVarietyIndexInAccordion == varietyIndexInAccordion) {
      this.activeVarietyIndexInAccordion = -1;
    }
    else {
      this.activeVarietyIndexInAccordion = varietyIndexInAccordion;
    }
  }


  getQuantityOfSeedProduced(data?: any) {
    let value = data ? data.toString() : '';
  console.log("data21342",data);
  console.log("valuea",value);
    if (value.indexOf(".") == -1) {
      return data;

    } else {
      return data ? Number(data).toFixed(2) : 0;

    }
      
  }
   
//  getQuantityOfSeedProduced(data?: any): string {
//   console.log("👉 Raw input:", data);

//   if (data === null || data === undefined || data === '') {
//     console.log("⚠️ Input is null/undefined/empty → returning '0'");
//     return '0'; 
//   }

//   const num = Number(data);
//   console.log("🔢 Converted to number:", num);

//   if (isNaN(num)) {
//     console.log("❌ Input is not a valid number → returning '0'");
//     return '0'; 
//   }

//   if (num % 1 === 0) {
//     console.log("✅ Whole number detected → returning:", num.toString());
//     return num.toString();
//   } else {
//     const fixed = num.toFixed(2);
//     console.log("✅ Decimal detected → returning:", fixed);
//     return fixed;
//   }
// }



  getPercentage(data?: any) {

    // this.productionPercentage
    // console.log('data',data);
    // console.log('this.productionPercentage',this.productionPercentage);
    // console.log('this.varietyWiseTotalIndentValue=======',this.varietyWiseTotalIndentValue)
    // console.log('this.selectedVerietyDetail.totalAllocationQuantity===',this.selectedVerietyDetail.totalAllocationQuantity);

    let val = (((this.selectedVerietyDetail && this.selectedVerietyDetail.totalAllocationQuantity ? this.selectedVerietyDetail.totalAllocationQuantity : 0) / (this.varietyWiseTotalIndentValue ? this.varietyWiseTotalIndentValue : 0) * 100) * data) / 100;

    let value = val.toString();

    if (value.indexOf(".") == -1) {
      return val;

    } else {
      return val ? Number(val).toFixed(2) : 0;

    }
  }
  removeZeroValues(obj) {
    if (Array.isArray(obj)) {
      return obj.filter(item => {
        // Recursively filter nested arrays and objects
        const filteredItem = this.removeZeroValues(item);
        return filteredItem.length > 0;
      });
    } else if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        // Recursively filter nested arrays and objects
        const filteredValue = this.removeZeroValues(value);
        // Only keep key-value pairs where the value is not zero
        if (filteredValue !== 0) {
          acc[key] = filteredValue;
        }
        return acc;
      }, {});
    } else {
      return obj;
    }
  }

  getVarietyLine() {
    let data = this.varietyForm.controls['variety_id'].value;
    let varietyData = []
    if (data && data.length > 0) {
      data.forEach(el => {
        varietyData.push(el && el.value ? el.value : '')
      })
    }
    const object = {
      search: {
        year: this.IstPartFormGroupControls["yearofIndent"].value.value,
        season: this.IstPartFormGroupControls["season"].value.value,
        crop_code: this.IstPartFormGroupControls["cropName"].value.value,
        variety: varietyData
      }
    }
    this.breederService.postRequestCreator("allocation-to-spa-line", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.varietLineData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.gridData()
      }

    })
  }
 
//   getVarietyRowSpan(data: any): number {
//   // If edit mode and `editVarietyForm` has values, use that length
//   if (this.editVarietyForm?.controls['variety_id']?.value?.length > 0) {
//     return  
//   }
//   // Otherwise fallback to normal total
//   return data.totalVarietyLength;
//  }
 



  getVarietyLine2() {
    let data = this.varietyForm.controls['variety_id'].value;
    let varietyData = []
    if (data && data.length > 0) {
      data.forEach(el => {
        varietyData.push(el && el.value ? el.value : '')
      })
    }
    const object = {
      search: {
        year: this.IstPartFormGroupControls["yearofIndent"].value.value,
        season: this.IstPartFormGroupControls["season"].value.value,
        crop_code: this.IstPartFormGroupControls["cropName"].value.value,
        variety: varietyData
      }
    }
    this.breederService.postRequestCreator("allocation-to-spa-line", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.varietLineData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';

        // this.gridData()
      }

    })
  }
  gridData() {
    let datas = this.varietyForm.controls['variety_line'].value;
    let varietyLine = []
    if (datas && datas.length > 0) {
      datas.forEach(el => {
        varietyLine.push(el && el.variety_line_code ? el.variety_line_code : '')
      })
    }
    let data = this.varietyForm.controls['variety_id'].value;
    let varietyData = []
    if (data && data.length > 0) {
      data.forEach(el => {
        varietyData.push(el && el.value ? el.value : '')
      })
    }

    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    this.selectedVerietyDetail = {}
    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['veriety_id'] = varietyData && varietyData[0] ? varietyData[0] : '';
    this.selectedVerietyDetail['variety_line_code'] = varietyLine && varietyLine[0] ? varietyLine[0] : '';
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;
    if (varietyLine && varietyLine.length < 1) {
      this.breederService.getRequestCreatorNew("allocation-to-spa-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + varietyData[0]).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {

          const variety = data.EncryptedResponse.data;
          this.producionCentersList = []
          data.EncryptedResponse.data.productionCenters.forEach(element => {
            let temp = { name: element.user.name, value: element.produ, id: element.id, quantity: 0, bspc_id: element.user.id, agency_name: element.user.agency_name }
            this.producionCentersList.push(temp);
          })
          data.EncryptedResponse.data.indentors.forEach(element => {
            element['productionsList'] = this.producionCentersList
            element['production_center_list'] = this.producionCentersList
            this.indenderProductionCenter.push({ indenter_id: element.id, producionCentersList: this.producionCentersList, quantity: 0 })
            element['productions'] = []
          })

          this.indentors = [];

          variety.indentors.forEach(element => {
            element['quantity_left_for_allocation'] = element.indent_quantity - element.allocated_quantity
            element['productions'] = this.producionCentersList;

            if (this.submittedData && this.submittedData.length > 0) {
              const varietyIndex = this.submittedData.findIndex(x => x.variety_id == this.selectedVerietyDetail.veriety_id);
              if (varietyIndex == -1) {
                const obj = {
                  name: element.user.name ? element.user.name : 'NA',
                  // agency_name: element.user.agency_detail.agency_name ? element.user.agency_detail.agency_name : 'NA',
                  agency_name: element.user.agency_name ? element.user.agency_name : 'NA',
                  value: element.id,
                  allocated_quantity: element.allocated_quantity,
                  indent_quantity: element.indent_quantity,
                  productions: element.productions,
                  quantity_left_for_allocation: element.quantity_left_for_allocation,
                  spa_code: element.spa_code,
                  state_code: element.state_code
                }

                this.indentors.push(obj);
              }
            } else {
              const obj = {
                name: element.user.name ? element.user.name : 'NA',
                // agency_name: element.user.agency_detail.agency_name ? element.user.agency_detail.agency_name : 'NA',
                agency_name: element.user.agency_name ? element.user.agency_name : 'NA',
                value: element.id,
                allocated_quantity: element.allocated_quantity,
                indent_quantity: element.indent_quantity,
                productions: element.productions,
                quantity_left_for_allocation: element.quantity_left_for_allocation,
                spa_code: element.spa_code,
                state_code: element.state_code
              }

              this.indentors.push(obj);

            }

          })
          this.indentorLoad = true

          this.selectedVerietyDetail['indentors'] = data.EncryptedResponse.data.indentors;
          this.selectedVerietyDetail['productionCenters'] = data.EncryptedResponse.data.productionCenters;
          this.selectedVerietyDetail['totalIndentQuantity'] = data.EncryptedResponse.data.totalIndentQuantity;
          this.selectedVerietyDetail['totalAllocationQuantity'] = data.EncryptedResponse.data.totalAllocationQuantity;

          if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
            this.productionPercentage = 100;
          } else {
            this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
          }

        }
      })
    }


  }
  getGridData() {
    let datas = this.varietyForm.controls['variety_line'].value;
    let varietyLine = []
    if (datas && datas.length > 0) {
      datas.forEach(el => {
        varietyLine.push(el && el.variety_line_code ? el.variety_line_code : '')
      })
    }
    let data = this.varietyForm.controls['variety_id'].value;
    let varietyData = []
    if (data && data.length > 0) {
      data.forEach(el => {
        varietyData.push(el && el.value ? el.value : '')
      })
    }
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;

    this.selectedVerietyDetail = {};
    this.dataToDisplay = [];

    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['veriety_id'] = varietyData && varietyData[0] ? varietyData[0] : '';
    this.selectedVerietyDetail['variety_line_code'] = varietyLine && varietyLine[0] ? varietyLine[0] : '';
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;
    this.breederService.getRequestCreatorNew("allocation-to-spa-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + varietyData[0] + "&line_code=" + varietyLine[0]).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {

        const variety = data.EncryptedResponse.data;
        this.producionCentersList = []
        data.EncryptedResponse.data.productionCenters.forEach(element => {
          let temp = { name: element.user.name, value: element.produ, id: element.id, quantity: 0, bspc_id: element.user.id, agency_name: element.user.agency_name ? element.user.agency_name : 'NA', }
          this.producionCentersList.push(temp);
        })
        data.EncryptedResponse.data.indentors.forEach(element => {
          element['productionsList'] = this.producionCentersList
          element['production_center_list'] = this.producionCentersList
          this.indenderProductionCenter.push({ indenter_id: element.id, producionCentersList: this.producionCentersList, quantity: 0 })
          element['productions'] = []
        })

        this.indentors = [];

        variety.indentors.forEach(element => {
          element['quantity_left_for_allocation'] = element.indent_quantity - element.allocated_quantity
          element['productions'] = this.producionCentersList;

          if (this.submittedData && this.submittedData.length > 0) {
            const varietyIndex = this.submittedData.findIndex(x => x.variety_id == this.selectedVerietyDetail.veriety_id);
            if (varietyIndex == -1) {
              const obj = {
                name: element.user.name ? element.user.name : 'NA',
                // agency_name: element.user.agency_detail.agency_name ? element.user.agency_detail.agency_name : 'NA',
                agency_name: element.user.agency_name ? element.user.agency_name : 'NA',
                value: element.id,
                allocated_quantity: element.allocated_quantity,
                indent_quantity: element.indent_quantity,
                productions: element.productions,
                quantity_left_for_allocation: element.quantity_left_for_allocation,
                spa_code: element.spa_code,
                state_code: element.state_code
              }

              this.indentors.push(obj);
            }
          } else {
            const obj = {
              name: element.user.name ? element.user.name : 'NA',
              // agency_name: element.user.agency_detail.agency_name ? element.user.agency_detail.agency_name : 'NA',
              agency_name: element.user.agency_name ? element.user.agency_name : 'NA',
              value: element.id,
              allocated_quantity: element.allocated_quantity,
              indent_quantity: element.indent_quantity,
              productions: element.productions,
              quantity_left_for_allocation: element.quantity_left_for_allocation,
              spa_code: element.spa_code,
              state_code: element.state_code
            }

            this.indentors.push(obj);

          }

        })
        this.indentorLoad = true

        this.selectedVerietyDetail['indentors'] = data.EncryptedResponse.data.indentors;
        this.selectedVerietyDetail['productionCenters'] = data.EncryptedResponse.data.productionCenters;
        this.selectedVerietyDetail['totalIndentQuantity'] = data.EncryptedResponse.data.totalIndentQuantity;
        this.selectedVerietyDetail['totalAllocationQuantity'] = data.EncryptedResponse.data.totalAllocationQuantity;

        if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
          this.productionPercentage = 100;
        } else {
          this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
        }

      }
    })

  }
  getSpaLineData() {
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    this.selectedVerietyDetailbtn = true;

    this.selectedVarietyFrom = 1;
    this.indentorLoad = false;

    this.selectedVerietyDetail = {}
    this.indentors = []
    this.tempForm.controls['selectedIndentorModel'].patchValue(null)
    this.selectedIndentor = null;

    // this.varietyForm.reset();
    // console.log('first==',this.editVarietyForm.controls['variety_id'].value );
    // console.log('2nd==',this.editVarietyForm.controls['variety_id'].value[0]);
    // console.log('3rd==',this.editVarietyForm.controls['variety_id'].value[0].value);

    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['variety_id'] = this.editVarietyForm.controls['variety_id'].value && this.editVarietyForm.controls['variety_id'].value[0] && this.editVarietyForm.controls['variety_id'].value[0].value ? this.editVarietyForm.controls['variety_id'].value[0].value:'';
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;
    this.selectedVarietyForEdit = [];
    let varietyLine = this.editVarietyForm.controls['variety_line'].value && this.editVarietyForm.controls['variety_line'].value[0] && this.editVarietyForm.controls['variety_line'].value[0].value ? this.editVarietyForm.controls['variety_line'].value[0].value : ''

    const param = {
      year: year.value,
      season: season.value,
      crop_code: cropName.value,
      variety_id:this.editVarietyForm.controls['variety_id'].value && this.editVarietyForm.controls['variety_id'].value[0] && this.editVarietyForm.controls['variety_id'].value[0].value ? this.editVarietyForm.controls['variety_id'].value[0].value:'',
      variety_line: this.editVarietyForm.controls['variety_line'].value && this.editVarietyForm.controls['variety_line'].value[0] && this.editVarietyForm.controls['variety_line'].value[0].value ? this.editVarietyForm.controls['variety_line'].value[0].value : ''
    }

    this.breederService.postRequestCreator('allocation-to-spa-line-for-edit', null, param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.varietyLineEdit = res;
      if (res && res.length > 0) {
        if (varietyLine) {

          this.breederService.postRequestCreator('get-allocation-data', null, param).subscribe(data => {
            let result = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.allocationData ? data.EncryptedResponse.data.allocationData : '';
            let user = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.user ? data.EncryptedResponse.data.user : '';
            this.userList = user;
            let filterData = [];
            result.forEach((el => {
              filterData.push({
                variety_name: el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
                parental_line: el && el.m_variety_line && el.m_variety_line.line_variety_name ? el.m_variety_line.line_variety_name : '',
                // variety_name:el && el.variety_name && el.variety_name ? el.variety_id:'',
                allocationspaid: el && el.id ? el.id : '',
                variety_id: el && el.variety_id ? el.variety_id : '',
                line_variety_name: el && el.m_variety_line && el.m_variety_line.line_variety_name ? el.m_variety_line.line_variety_name : '',
                line_variety_code: el && el.m_variety_line && el.m_variety_line.line_variety_code ? el.m_variety_line.line_variety_code : '',
                indenter: el && el['allocation_to_spa_for_lifting_seed_production_cnters'] ? el['allocation_to_spa_for_lifting_seed_production_cnters'] : ''
              })
            }))
            this.dataToShow = filterData
            filterData = filterData.map(item => {
              let indenterWithProductions = item.indenter.map(indenter => {
                return {
                  ...indenter,
                  productions: [indenter] // Wrap the current indenter object in the productions array
                };
              });

              return {
                ...item,
                indenter: indenterWithProductions
              };
            });

            this.dataToDisplay = filterData;
            this.dataToDisplay.forEach((val) => {
              val.indenter.forEach(item => {
                item.productions.forEach(value => {
                  value.name = value && value.production ? value.production : '';
                  value.quantity = item && item.allocated_ ? item.allocated_ : '';
                })
                item.name = item && item.user && item.user.name ? item.user.name : '';
                item.indent_quantity = item && item.indent_qty ? item.indent_qty : '';
                // item.name=item && item.production  ? item.production:'';
                item.quantity = item && item.qty ? item.qty : '';

                item.allocated_quantity = item && item.qty ? item.qty : '';
                if (item && item.qty && item.indent_quantity) {
                  item.quantity_left_for_allocation = (item.indent_quantity - item.qty);
                }
                else if (item && item.qty) {
                  item.quantity_left_for_allocation = (item.qty);
                } else {
                  item.quantity_left_for_allocation = (item && item.indent_quantity ? item.indent_quantity : '');
                }
              })
            })
            for (let val of this.dataToDisplay) {
              let sum = 0;
              for (let value of val.indenter) {
                for (let data of value.productions) {
                  value.totalProductionlength = value.productions.length
                  val.totalIndentorlength = val.indenter.length
                  if (val.totalIndentorlength > 1) {

                    val.totalVarietyLength = value.productions.length + val.indenter.length
                  } else {
                    val.totalVarietyLength = value.productions.length
                  }
                  sum += value.productions.length;
                  val.totalproductioIndentliength = sum

                }
              }
            }

          })

          let datas = this.varietyForm.controls['variety_line'].value;
          let varietyLine = []
          if (datas && datas.length > 0) {
            datas.forEach(el => {
              varietyLine.push(el && el.variety_line_code ? el.variety_line_code : '')
            })
          }
          let data = this.editVarietyForm.controls['variety_id'].value;
          let varietyData = []
          if (data && data.length > 0) {
            data.forEach(el => {
              varietyData.push(el && el.value ? el.value : '')
            })
          }


          // console.log("first", this.editVarietyForm.controls['variety_id'].value[0].value)
          // console.log("first", this.editVarietyForm.controls['variety_id'].value[0])
          // console.log("first", this.editVarietyForm.controls['variety_id'].value)
          this.selectedVerietyDetail = {}

          this.selectedVerietyDetail['year'] = year.value;
          this.selectedVerietyDetail['season'] = season.value;
          this.selectedVerietyDetail['crop_code'] = cropName.value;
          this.selectedVerietyDetail['veriety_id'] = this.editVarietyForm.controls['variety_id'].value && this.editVarietyForm.controls['variety_id'].value[0] && this.editVarietyForm.controls['variety_id'].value[0].value ? this.editVarietyForm.controls['variety_id'].value[0].value : '',
            this.selectedVerietyDetail['variety_line_code'] = varietyLine;
          this.selectedVerietyDetail['user_id'] = this.currentUser.id;
          this.selectedVerietyDetail['is_active'] = 1;
          this.selectedVerietyDetail['id'] = this.submissionId;
          if (varietyLine && varietyLine.length < 1) {

            this.breederService.getRequestCreatorNew("allocation-to-spa-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + varietyData[0] + "&line_code=" + varietyLine).subscribe((data: any) => {
              if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {

                const variety = data.EncryptedResponse.data;
                this.producionCentersList = []
                data.EncryptedResponse.data.productionCenters.forEach(element => {
                  let temp = { name: element.user.name, value: element.produ, id: element.id, quantity: 0, bspc_id: element.user.id, agency_name: element.user.agency_name }
                  this.producionCentersList.push(temp);
                })
                data.EncryptedResponse.data.indentors.forEach(element => {
                  element['productionsList'] = this.producionCentersList
                  element['production_center_list'] = this.producionCentersList
                  this.indenderProductionCenter.push({ indenter_id: element.id, producionCentersList: this.producionCentersList, quantity: 0 })
                  element['productions'] = []
                })

                this.indentors = [];

                variety.indentors.forEach(element => {
                  element['quantity_left_for_allocation'] = element.indent_quantity - element.allocated_quantity
                  element['productions'] = this.producionCentersList;

                  if (this.submittedData && this.submittedData.length > 0) {
                    const varietyIndex = this.submittedData.findIndex(x => x.variety_id == this.selectedVerietyDetail.veriety_id);
                    if (varietyIndex == -1) {
                      const obj = {
                        name: element.user.name ? element.user.name : 'NA',
                        // agency_name: element.user.agency_detail.agency_name ? element.user.agency_detail.agency_name : 'NA',
                        agency_name: element.user.agency_name ? element.user.agency_name : 'NA',
                        spa_id: element.user.id ? element.user.id : 'NA',
                        value: element.id,
                        allocated_quantity: element.allocated_quantity,
                        indent_quantity: element.indent_quantity,
                        productions: element.productions,
                        quantity_left_for_allocation: element.quantity_left_for_allocation,
                        spa_code: element.spa_code,
                        state_code: element.state_code
                      }

                      this.indentors.push(obj);
                    }
                  } else {
                    const obj = {
                      name: element.user.name ? element.user.name : 'NA',
                      // agency_name: element.user.agency_detail.agency_name ? element.user.agency_detail.agency_name : 'NA',
                      agency_name: element.user.agency_name ? element.user.agency_name : 'NA',
                      spa_id: element.user.id ? element.user.id : 'NA',
                      value: element.id,
                      allocated_quantity: element.allocated_quantity,
                      indent_quantity: element.indent_quantity,
                      productions: element.productions,
                      quantity_left_for_allocation: element.quantity_left_for_allocation,
                      spa_code: element.spa_code,
                      state_code: element.state_code
                    }

                    this.indentors.push(obj);

                  }

                })
                this.indentorLoad = true
                let datas = this.dataToDisplay && this.dataToDisplay[0] && this.dataToDisplay[0].indenter ? this.dataToDisplay[0].indenter : '';
                if (datas && datas.length > 0) {
                  datas.forEach(el => {
                    el.spa_id = el && el.user && el.user.id ? el.user.id : ''
                  })
                }
                const quantityMap = datas.reduce((acc, item) => {
                  if (!acc[item.spa_id]) {
                    acc[item.spa_id] = 0;
                  }
                  acc[item.spa_id] += item.allocated_;
                  return acc;
                }, {});

                // Update data1 with the summed quantities from data2
                const result = this.indentors.map(item => {
                  if (quantityMap[item.spa_id]) {
                    item.productions.forEach(production => {
                      production.quantity = quantityMap[item.spa_id];
                    });
                  }
                  return item;
                });



                // this.selectedIndentor
                this.selectedVerietyDetail['indentors'] = data.EncryptedResponse.data.indentors;
                this.selectedVerietyDetail['productionCenters'] = data.EncryptedResponse.data.productionCenters;
                this.selectedVerietyDetail['totalIndentQuantity'] = data.EncryptedResponse.data.totalIndentQuantity;
                this.selectedVerietyDetail['totalAllocationQuantity'] = data.EncryptedResponse.data.totalAllocationQuantity;

                if (this.selectedVerietyDetail && this.selectedVerietyDetail.productionCenters && this.selectedVerietyDetail.productionCenters.length > 0) {
                  if (this.dataToDisplay && this.dataToDisplay.length > 0) {
                    this.selectedVerietyDetail.productionCenters.forEach(el => {
                      this.dataToDisplay.forEach(val => {
                        val.indenter.forEach(items => {
                          if (items.production == el.user.id) {
                            el.quantityAllocated = items.qty
                          }
                        })
                      })
                    })
                  }
                }
                if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
                  this.productionPercentage = 100;
                } else {
                  console.log('variety.totalAllocationQuantity=====', variety.totalAllocationQuantity);
                  console.log('variety.totalIndentQuantity===', variety.totalIndentQuantity)
                  this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
                }

              }
            })
          }

          // this.gridData()
        }


      } else {
        // alert('hi3')
        // if(varietyLine){
        this.breederService.postRequestCreator('get-allocation-data', null, param).subscribe(data => {
          let result = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.allocationData ? data.EncryptedResponse.data.allocationData : '';
          let user = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.user ? data.EncryptedResponse.data.user : '';
          this.userList = user;
          // let result= data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data:'';
          let filterData = [];
          result.forEach((el => {
            filterData.push({
              variety_name: el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
              parental_line: el && el.m_variety_line && el.m_variety_line.line_variety_name ? el.m_variety_line.line_variety_name : '',
              // variety_name:el && el.variety_name && el.variety_name ? el.variety_id:'',
              allocationspaid: el && el.id ? el.id : '',
              variety_id: el && el.variety_id ? el.variety_id : '',
              line_variety_name: el && el.m_variety_line && el.m_variety_line.line_variety_name ? el.m_variety_line.line_variety_name : '',
              line_variety_code: el && el.m_variety_line && el.m_variety_line.line_variety_code ? el.m_variety_line.line_variety_code : '',
              indenter: el && el['allocation_to_spa_for_lifting_seed_production_cnters'] ? el['allocation_to_spa_for_lifting_seed_production_cnters'] : ''
            })
          }))
          this.dataToShow = filterData
          filterData = filterData.map(item => {
            let indenterWithProductions = item.indenter.map(indenter => {
              return {
                ...indenter,
                productions: [indenter] // Wrap the current indenter object in the productions array
              };
            });

            return {
              ...item,
              indenter: indenterWithProductions
            };
          });
          this.dataToDisplay = filterData

          this.dataToDisplay.forEach((val) => {
            val.indenter.forEach(item => {
              item.productions.forEach(value => {
                value.name = value && value.production ? value.production : '';
                value.quantity = item && item.qty ? item.qty : '';
              })
              item.name = item && item.user && item.user.name ? item.user.name : '';
              item.indent_quantity = item && item.indent_qty ? item.indent_qty : '';
              // item.name=item && item.production  ? item.production:'';
              item.quantity = item && item.qty ? item.qty : '';

              item.allocated_quantity = item && item.qty ? item.qty : '';
              if (item && item.allocated_ && item.indent_quantity) {
                item.quantity_left_for_allocation = (item.indent_quantity - item.qty);
              }
              else if (item && item.allocated_) {
                item.quantity_left_for_allocation = (item.qty);
              } else {
                item.quantity_left_for_allocation = (item && item.indent_quantity ? item.indent_quantity : '');
              }
            })
          })
          for (let val of this.dataToDisplay) {
            let sum = 0;
            for (let value of val.indenter) {
              for (let data of value.productions) {
                value.totalProductionlength = value.productions.length
                val.totalIndentorlength = val.indenter.length
                if (val.totalIndentorlength > 1) {

                  val.totalVarietyLength = value.productions.length + val.indenter.length
                } else {
                  val.totalVarietyLength = value.productions.length
                }
                sum += value.productions.length;
                val.totalproductioIndentliength = sum

              }
            }
          }

        })
        let datas = this.varietyForm.controls['variety_line'].value;
        let varietyLine = []
        if (datas && datas.length > 0) {
          datas.forEach(el => {
            varietyLine.push(el && el.variety_line_code ? el.variety_line_code : '')
          })
        }
        let data = this.editVarietyForm.controls['variety_id'].value;
        let varietyData = []
        if (data && data.length > 0) {
          data.forEach(el => {
            varietyData.push(el && el.value ? el.value : '')
          })
        }
        this.selectedVerietyDetail = {}
        this.selectedVerietyDetail['year'] = year.value;
        this.selectedVerietyDetail['season'] = season.value;
        this.selectedVerietyDetail['crop_code'] = cropName.value;
        this.selectedVerietyDetail['veriety_id'] = this.editVarietyForm.controls['variety_id'].value[0].value,
          this.selectedVerietyDetail['variety_line_code'] = varietyLine;
        this.selectedVerietyDetail['user_id'] = this.currentUser.id;
        this.selectedVerietyDetail['is_active'] = 1;
        this.selectedVerietyDetail['id'] = this.submissionId;

        if (varietyLine && varietyLine.length < 1) {

          this.breederService.getRequestCreatorNew("allocation-to-spa-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + varietyData[0] + "&line_code=" + varietyLine).subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {

              const variety = data.EncryptedResponse.data;
              this.producionCentersList = []
              data.EncryptedResponse.data.productionCenters.forEach(element => {
                let temp = { name: element.user.name, value: element.produ, id: element.id, quantity: 0, bspc_id: element.user.id, agency_name: element.user.agency_name, }
                this.producionCentersList.push(temp);
              })

              data.EncryptedResponse.data.indentors.forEach(element => {

                element['productionsList'] = this.producionCentersList
                element['production_center_list'] = this.producionCentersList
                this.indenderProductionCenter.push({ indenter_id: element.id, producionCentersList: this.producionCentersList, quantity: 0 })
                element['productions'] = []
              })

              this.indentors = [];

              variety.indentors.forEach(element => {
                element['quantity_left_for_allocation'] = element.indent_quantity - element.allocated_quantity
                element['productions'] = this.producionCentersList;

                if (this.submittedData && this.submittedData.length > 0) {
                  const varietyIndex = this.submittedData.findIndex(x => x.variety_id == this.selectedVerietyDetail.veriety_id);
                  if (varietyIndex == -1) {

                    const obj = {
                      name: element.user.name ? element.user.name : 'NA',
                      agency_name: element.user.agency_name ? element.user.agency_name : 'NA',
                      spa_id: element.user.id ? element.user.id : 'NA',
                      value: element.id,
                      allocated_quantity: element.allocated_quantity,
                      indent_quantity: element.indent_quantity,
                      productions: element.productions,
                      quantity_left_for_allocation: element.quantity_left_for_allocation,
                      spa_code: element.spa_code,
                      state_code: element.state_code
                    }

                    this.indentors.push(obj);
                  }
                } else {
                  const obj = {
                    name: element.user.name ? element.user.name : 'NA',
                    agency_name: element.user.agency_name ? element.user.agency_name : 'NA',
                    spa_id: element.user.id ? element.user.id : 'NA',
                    value: element.id,
                    allocated_quantity: element.allocated_quantity,
                    indent_quantity: element.indent_quantity,
                    productions: element.productions,
                    quantity_left_for_allocation: element.quantity_left_for_allocation,
                    spa_code: element.spa_code,
                    state_code: element.state_code
                  }

                  this.indentors.push(obj);

                }

              })
              this.indentorLoad = true;
              let datas = this.dataToDisplay && this.dataToDisplay[0] && this.dataToDisplay[0].indenter ? this.dataToDisplay[0].indenter : '';
              if (datas && datas.length > 0) {
                datas.forEach(el => {
                  el.spa_id = el && el.user && el.user.id ? el.user.id : ''
                })
              }
              this.selectedVerietyDetail['indentors'] = data.EncryptedResponse.data.indentors;
              this.selectedVerietyDetail['productionCenters'] = data.EncryptedResponse.data.productionCenters;
              this.selectedVerietyDetail['totalIndentQuantity'] = data.EncryptedResponse.data.totalIndentQuantity;
              this.selectedVerietyDetail['totalAllocationQuantity'] = data.EncryptedResponse.data.totalAllocationQuantity;
              if (this.selectedVerietyDetail && this.selectedVerietyDetail.productionCenters && this.selectedVerietyDetail.productionCenters.length > 0) {
                if (this.dataToDisplay && this.dataToDisplay.length > 0) {
                  this.selectedVerietyDetail.productionCenters.forEach(el => {
                    this.dataToDisplay.forEach(val => {
                      let quantityAllocated = 0;
                      val.indenter.forEach(items => {
                        if (items.production == el.user.id) {
                          // items.qty
                          quantityAllocated += items.qty
                        }
                      })
                      el.quantityAllocated = quantityAllocated
                    })
                  })
                }
              }
              if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
                this.productionPercentage = 100;
              } else {
                this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
              }
              this.getDatas()

            }
          })

        }


        // this.gridData()
        // }

      }
    })
  }
  getSpaLineData2() {
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    this.selectedVerietyDetailbtn = true;

    this.selectedVarietyFrom = 1;
    this.indentorLoad = false;

    this.selectedVerietyDetail = {}
    this.indentors = []
    this.tempForm.controls['selectedIndentorModel'].patchValue(null)
    this.selectedIndentor = null;

    // this.varietyForm.reset();

    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['variety_id'] = this.editVarietyForm.controls['variety_id'].value[0].value;
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;
    this.selectedVarietyForEdit = [];
    let varietyLine = this.editVarietyForm.controls['variety_line'].value && this.editVarietyForm.controls['variety_line'].value[0] && this.editVarietyForm.controls['variety_line'].value[0].value ? this.editVarietyForm.controls['variety_line'].value[0].value : ''

    const param = {
      year: year.value,
      season: season.value,
      crop_code: cropName.value,
      variety_id: this.editVarietyForm.controls['variety_id'].value[0].value,
      variety_line: this.editVarietyForm.controls['variety_line'].value && this.editVarietyForm.controls['variety_line'].value[0] && this.editVarietyForm.controls['variety_line'].value[0].value ? this.editVarietyForm.controls['variety_line'].value[0].value : ''
    }

    this.breederService.postRequestCreator('allocation-to-spa-line-for-edit', null, param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.varietyLineEdit = res;
      if (res && res.length > 0) {
        if (varietyLine) {
          // alert('hi2')
          this.breederService.postRequestCreator('get-allocation-data', null, param).subscribe(data => {
            let result = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.allocationData ? data.EncryptedResponse.data.allocationData : '';
            let user = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.user ? data.EncryptedResponse.data.user : '';
            this.userList = user;
            let filterData = [];
            result.forEach((el => {
              filterData.push({
                variety_name: el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
                parental_line: el && el.m_variety_line && el.m_variety_line.line_variety_name ? el.m_variety_line.line_variety_name : '',
                // variety_name:el && el.variety_name && el.variety_name ? el.variety_id:'',
                allocationspaid: el && el.id ? el.id : '',
                variety_id: el && el.variety_id ? el.variety_id : '',
                line_variety_name: el && el.m_variety_line && el.m_variety_line.line_variety_name ? el.m_variety_line.line_variety_name : '',
                line_variety_code: el && el.m_variety_line && el.m_variety_line.line_variety_code ? el.m_variety_line.line_variety_code : '',
                indenter: el && el['allocation_to_spa_for_lifting_seed_production_cnters'] ? el['allocation_to_spa_for_lifting_seed_production_cnters'] : ''
              })
            }))
            this.dataToShow = filterData
            filterData = filterData.map(item => {
              let indenterWithProductions = item.indenter.map(indenter => {
                return {
                  ...indenter,
                  productions: [indenter] // Wrap the current indenter object in the productions array
                };
              });

              return {
                ...item,
                indenter: indenterWithProductions
              };
            });

            this.dataToDisplay = filterData;
            this.dataToDisplay.forEach((val) => {
              val.indenter.forEach(item => {
                item.productions.forEach(value => {
                  value.name = value && value.production ? value.production : '';
                  value.quantity = item && item.allocated_ ? item.allocated_ : '';
                })
                item.name = item && item.user && item.user.name ? item.user.name : '';
                item.indent_quantity = item && item.indent_qty ? item.indent_qty : '';
                // item.name=item && item.production  ? item.production:'';
                item.quantity = item && item.qty ? item.qty : '';

                item.allocated_quantity = item && item.qty ? item.qty : '';
                if (item && item.qty && item.indent_quantity) {
                  item.quantity_left_for_allocation = (item.indent_quantity - item.qty);
                }
                else if (item && item.qty) {
                  item.quantity_left_for_allocation = (item.qty);
                } else {
                  item.quantity_left_for_allocation = (item && item.indent_quantity ? item.indent_quantity : '');
                }
              })
            })
            for (let val of this.dataToDisplay) {
              let sum = 0;
              for (let value of val.indenter) {
                for (let data of value.productions) {
                  value.totalProductionlength = value.productions.length
                  val.totalIndentorlength = val.indenter.length
                  if (val.totalIndentorlength > 1) {

                    val.totalVarietyLength = value.productions.length + val.indenter.length
                  } else {
                    val.totalVarietyLength = value.productions.length
                  }
                  sum += value.productions.length;
                  val.totalproductioIndentliength = sum

                }
              }
            }

          })

          let datas = this.varietyForm.controls['variety_line'].value;
          let varietyLine = []
          if (datas && datas.length > 0) {
            datas.forEach(el => {
              varietyLine.push(el && el.variety_line_code ? el.variety_line_code : '')
            })
          }
          let data = this.editVarietyForm.controls['variety_id'].value;
          let varietyData = []
          if (data && data.length > 0) {
            data.forEach(el => {
              varietyData.push(el && el.value ? el.value : '')
            })
          }



          this.selectedVerietyDetail = {}

          this.selectedVerietyDetail['year'] = year.value;
          this.selectedVerietyDetail['season'] = season.value;
          this.selectedVerietyDetail['crop_code'] = cropName.value;
          this.selectedVerietyDetail['veriety_id'] = this.editVarietyForm.controls['variety_id'].value[0].value,
            this.selectedVerietyDetail['variety_line_code'] = varietyLine;
          this.selectedVerietyDetail['user_id'] = this.currentUser.id;
          this.selectedVerietyDetail['is_active'] = 1;
          this.selectedVerietyDetail['id'] = this.submissionId;
        }


      } else {
        // alert('hi3')
        // if(varietyLine){
        this.breederService.postRequestCreator('get-allocation-data', null, param).subscribe(data => {
          let result = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.allocationData ? data.EncryptedResponse.data.allocationData : '';
          let user = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.user ? data.EncryptedResponse.data.user : '';
          this.userList = user;
          // let result= data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data:'';
          let filterData = [];
          result.forEach((el => {
            filterData.push({
              variety_name: el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
              parental_line: el && el.m_variety_line && el.m_variety_line.line_variety_name ? el.m_variety_line.line_variety_name : '',
              // variety_name:el && el.variety_name && el.variety_name ? el.variety_id:'',
              allocationspaid: el && el.id ? el.id : '',
              variety_id: el && el.variety_id ? el.variety_id : '',
              line_variety_name: el && el.m_variety_line && el.m_variety_line.line_variety_name ? el.m_variety_line.line_variety_name : '',
              line_variety_code: el && el.m_variety_line && el.m_variety_line.line_variety_code ? el.m_variety_line.line_variety_code : '',
              indenter: el && el['allocation_to_spa_for_lifting_seed_production_cnters'] ? el['allocation_to_spa_for_lifting_seed_production_cnters'] : ''
            })
          }))
          this.dataToShow = filterData
          filterData = filterData.map(item => {
            let indenterWithProductions = item.indenter.map(indenter => {
              return {
                ...indenter,
                productions: [indenter] // Wrap the current indenter object in the productions array
              };
            });

            return {
              ...item,
              indenter: indenterWithProductions
            };
          });
          this.dataToDisplay = filterData

          this.dataToDisplay.forEach((val) => {
            val.indenter.forEach(item => {
              item.productions.forEach(value => {
                value.name = value && value.production ? value.production : '';
                value.quantity = item && item.qty ? item.qty : '';
              })
              item.name = item && item.user && item.user.name ? item.user.name : '';
              item.indent_quantity = item && item.indent_qty ? item.indent_qty : '';
              // item.name=item && item.production  ? item.production:'';
              item.quantity = item && item.qty ? item.qty : '';

              item.allocated_quantity = item && item.qty ? item.qty : '';
              if (item && item.allocated_ && item.indent_quantity) {
                item.quantity_left_for_allocation = (item.indent_quantity - item.qty);
              }
              else if (item && item.allocated_) {
                item.quantity_left_for_allocation = (item.qty);
              } else {
                item.quantity_left_for_allocation = (item && item.indent_quantity ? item.indent_quantity : '');
              }
            })
          })
          for (let val of this.dataToDisplay) {
            let sum = 0;
            for (let value of val.indenter) {
              for (let data of value.productions) {
                value.totalProductionlength = value.productions.length
                val.totalIndentorlength = val.indenter.length
                if (val.totalIndentorlength > 1) {

                  val.totalVarietyLength = value.productions.length + val.indenter.length
                } else {
                  val.totalVarietyLength = value.productions.length
                }
                sum += value.productions.length;
                val.totalproductioIndentliength = sum

              }
            }
          }

        })
        let datas = this.varietyForm.controls['variety_line'].value;
        let varietyLine = []
        if (datas && datas.length > 0) {
          datas.forEach(el => {
            varietyLine.push(el && el.variety_line_code ? el.variety_line_code : '')
          })
        }
        let data = this.editVarietyForm.controls['variety_id'].value;
        let varietyData = []
        if (data && data.length > 0) {
          data.forEach(el => {
            varietyData.push(el && el.value ? el.value : '')
          })
        }
        this.selectedVerietyDetail = {}
        this.selectedVerietyDetail['year'] = year.value;
        this.selectedVerietyDetail['season'] = season.value;
        this.selectedVerietyDetail['crop_code'] = cropName.value;
        this.selectedVerietyDetail['veriety_id'] = this.editVarietyForm.controls['variety_id'].value[0].value,
          this.selectedVerietyDetail['variety_line_code'] = varietyLine;
        this.selectedVerietyDetail['user_id'] = this.currentUser.id;
        this.selectedVerietyDetail['is_active'] = 1;
        this.selectedVerietyDetail['id'] = this.submissionId;




        // this.gridData()
        // }

      }
    })
  }
  getDatas() {
    // alert('hjii')
    // let datas = this.dataToDisplay && this.dataToDisplay[0] && this.dataToDisplay[0].indenter ? this.dataToDisplay[0].indenter : '';
    // const result = this.indentors.map((item) => {
    //   const allocation = datas.find((alloc) => alloc.user.id == item.spa_id);

    //   if (allocation) {
    //     item.productions[0].quantity = allocation.quantity;
    //   }
    //   return item;
    // });

  }
  getUserData(item) {
    if (item) {
      let data = this.userList.filter(x => x.id == item);
      return data && data[0] && data[0]['agency_detail.agency_name'] ? data[0]['agency_detail.agency_name'] : this.isEdit ? item : ""
    } else {
      return ''
    }
  }
  getSpaWiseIndent() {
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    this._indenterService.postRequestCreator('get-indent-of-spa-report', null, {
      "loginedUserid": {
        "agency_id": this.currentUser.id
      },
      "search": {
        "season": season && season.value ? season.value : '',
        "crop_code": cropName && cropName.value ? cropName.value : '',
        "year": year && year.value ? year.value : '',
      }
    }).subscribe((data: any) => {
      let totalIndentValue = 0;
      let varietyWiseTotalIndentValues = 0;
      if (data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.forEach((ele, i) => {
          ele.parental.forEach((item, j) => {
            totalIndentValue += item.total_indent
          })
        })
        this.totalIndentQnt = totalIndentValue;
        console.log('first==1',this.editVarietyForm.controls['variety_id'].value)
        if (this.varietyForm.controls['variety_id'].value) {
          let varietyWiseTotalIndent = data.EncryptedResponse.data.filter(ele => ele.variety_id == (this.varietyForm.controls['variety_id'].value[0].value))
          varietyWiseTotalIndent.forEach((ele, i) => {
            ele.parental.forEach((item, j) => {
              varietyWiseTotalIndentValues += item.total_indent
            })
          })
          this.varietyWiseTotalIndentValue = varietyWiseTotalIndentValues
        }
        if (this.editVarietyForm.controls['variety_id'].value) {
          console.log('spa line data===',data.EncryptedResponse.data);
          let varietyWiseTotalIndent = data.EncryptedResponse.data.filter(ele => ele.variety_id == (this.editVarietyForm.controls['variety_id'].value[0].value))
          // console.log(ele);
          varietyWiseTotalIndent.forEach((ele, i) => {
            console.log('ele==',ele);
            ele.parental.forEach((item, j) => {
              varietyWiseTotalIndentValues += item.total_indent
            })
          })
          this.varietyWiseTotalIndentValue = varietyWiseTotalIndentValues
        }
        // if(this.ng)
        // variety_id
      }

    })
  }
}
