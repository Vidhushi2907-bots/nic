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

@Component({
  selector: 'app-allocation-breeder-seed-indentor-lifting-form',
  templateUrl: './allocation-breeder-seed-indentor-lifting-form.component.html',
  styleUrls: ['./allocation-breeder-seed-indentor-lifting-form.component.css']
})
export class AllocationBreederSeedIndentorLiftingFormComponent implements OnInit {

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
  isEditingVariety: boolean = false;
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

  indenderProductionCenter = []
  finalDataToBeSaved = []
  disableSubmitButton = true;
  editableQuantity = false

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
  private editSubmittedData: Array<any> = [];

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
  dataToShowSecond: any;

  totalData: any;

  upperRowDisplay: boolean = false;
  grandAllocation
  grandIndent
  totalDificit
  grand_total
  grandTotalProduction
  isTableVisible: boolean = false;

  items: any = [];
  items1: any = [
    {
      "variety_code": "A0104111",
      "variety_name": "Rajlaxmi(HP-1731)",
      "notification_year": "2000",
      "surplus_dificit": "-100",
      "indenter": [
        {
          "name": "MP",
          "full_name": "Madhya Pradesh"
        },
        {
          "name": "PB",
          "full_name": "Punjab"
        },
        {
          "name": "BR",
          "full_name": "Bihar"
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
          "name": "MP",
          "full_name": "Madhya Pradesh"
        },
        {
          "name": "PB",
          "full_name": "Punjab"
        },
        {
          "name": "BR",
          "full_name": "Bihar"
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
  cancelProduction: any;
  reportHeader: any = {};


  isCropSubmitted: boolean = true;
  submittedbtnData = false;
  varietyDropdownDatasecond: any[];

  dataToDisplay: Array<any> = []

  selectedVarietyFrom: Number = 0;
  totalAllocationQuantity = 0;
  varietyLine: any;
  varietyLineedit: any;
  unit: string;
  VarietyName1: any;
  tableshow: any;
  isCropSubmittedNew: boolean = false;
  showgrid1: boolean = false;

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    // /* generate workbook and add the worksheet */
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // /* save to file */
    // XLSX.writeFile(wb, this.fileName);


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
      closeDropDownOnSelection: true,
      textField: 'name',
      allowSearchFilter: true
    };
    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'display_text',
      closeDropDownOnSelection: true,
      textField: 'line_variety_name',
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

    this.breederService.getRequestCreatorNew("allocation-to-indentor-year").subscribe((data: any) => {
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

    this.IstPartFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      this.dataToDisplay = [];
      this.selectedVerietyDetail = {};
      this.varietyDropdownData = [];
      this.selectedVarietyForEdit = ''
      this.varietyForm.controls['variety_id'].setValue('')
      this.breederService.getRequestCreatorNew("allocation-to-indentor-season?user_id=" + this.currentUser.id + "&year=" + newValue.value).subscribe((dataList: any) => {
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
      this.selectedVarietyForEdit = ''
      this.varietyForm.controls['variety_id'].setValue('')
      let year = this.IstPartFormGroupControls["yearofIndent"].value.value;
      this.breederService.getRequestCreatorNew("allocation-to-indentor-crop?user_id=" + this.currentUser.id + "&year=" + year + "&season=" + newValue.value).subscribe((dataList: any) => {
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
      if (newValue) {
        if (newValue && newValue.value && newValue.value.slice(0, 1) == "A") {
          this.unit = "Qt";
        } else {
          this.unit = "Kg";
        }
      }
      // this.getCropVerieties();
      // this.getLineData();
      // this.onSelectVariety(null);
      // this.onSelectVarietyLine(null);
      this.dataToDisplay = [];
      this.selectedVerietyDetail = {};
      this.varietyDropdownData = [];
      this.selectedVarietyForEdit = ''
      this.varietyForm.controls['variety_id'].setValue('')
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
    // this.getLineData();

  }

  search() {
     this.showgrid1 = true;
    this.dataToDisplay = [];
    let searchParams1 = { "Year of Indent": null, "Season": null, "Crop Name": null, };
    let reportParam = { "year": null, "season": null, "crop_code": null, };

    let yearofIndent: null;
    let cropName: null;
    let cropVariety: null;
    this.searhedData = true;
    let season: null;



    if (this.IstPartFormGroupControls["yearofIndent"] && this.IstPartFormGroupControls["yearofIndent"].value) {
      searchParams1['Year of Indent'] = this.IstPartFormGroupControls["yearofIndent"].value["value"]
      // allData = allData.filter(x => (x.year == yearofIndent))
      reportParam['year'] = (this.IstPartFormGroupControls["yearofIndent"].value["value"]).toString()
      // reportParam['year_for_report'] = (this.IstPartFormGroupControls["yearofIndent"].value["value"])

    }

    if (this.IstPartFormGroupControls["season"] && this.IstPartFormGroupControls["season"].value) {
      searchParams1['Season'] = this.IstPartFormGroupControls["season"].value["value"];
      // allData = allData.filter(x => x.season == season)
      reportParam['season'] = this.IstPartFormGroupControls["season"].value["value"]

    }

    if (this.IstPartFormGroupControls["cropName"] && this.IstPartFormGroupControls["cropName"].value) {
      searchParams1['Crop Name'] = this.IstPartFormGroupControls["cropName"].value["value"];
      // allData = allData.filter(x => x.crop_code == cropName)
      reportParam['crop_code'] = this.IstPartFormGroupControls["cropName"].value["value"]

    }
    const savedData = JSON.parse(localStorage.getItem('tableData') || '[]');

    // if (savedData.length > 0) {
    //   this.dataToDisplay = savedData;
    //   this.isTableVisible = true; // Show the table if data exists
    // } else {
    //   this.isTableVisible = false; // Hide table if no data is found
    // }
    // console.log("savedData.length ",savedData.length );
    // console.log("this.isTableVisible",this.isTableVisible);

    let blankData = Object.entries(searchParams1).filter(([, value]) => value == null).flat().filter(n => n).join(", ")

    if (blankData) {
      Swal.fire('Opps', "Please Select " + blankData + " ", 'error');
      return;
    } else {
      this.upperRowDisplay = true;
      this.isCropSubmitted = true;
      this.isCropSubmittedNew = false;
      this.isEditingVariety = false;
      this.dataToDisplay = [];
      this.submittedData = [];
      this.dataToShow = [];

      this.selectedVarietyForEdit = undefined;
      this.selectedVerietyDetail = undefined;
      this.editSelectedVariety = undefined;
      this.editIndentors = []
      this.indentors = []

      this.editVarietyForm.controls['variety_id'].reset();
      this.varietyForm.controls['variety_id'].reset();

      this.getCropVerieties();
      this.getLineData();
    }
    this.reportHeader = reportParam;

    if (this.IstPartFormGroupControls['cropName'] && this.IstPartFormGroupControls['cropName'].value) {
      this.reportHeader['crop_name'] = this.IstPartFormGroupControls['cropName'].value['name'];
    }
    this.getReportData(reportParam)


  }

  getReportData(reportParam) {
    this.breederService.postRequestCreator('allocation/indentor-report', null, reportParam).subscribe(dataList => {
      if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200
        && dataList.EncryptedResponse.data && dataList.EncryptedResponse.data[0]) {
        // this.items = dataList.EncryptedResponse.data[0].allocations;

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
    this.upperRowDisplay = false;
    this.varietyDropdownData = []

    this.selectedVerietyDetail = {}
    this.finalDataToBeSaved = []
    this.dataToDisplay = []

    this.isCropSubmitted = false;
    this.isCropSubmittedNew = false;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['seed-division/breeder-seed-allocation-lifting/new']);
    });

  }

  getCropVerieties() {
    // Swal.fire({
    //   title: 'Loading Varities',
    //   html: 'Please Wait...',
    //   allowEscapeKey: false,
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading(null)
    //   }
    // });
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;


    this.tempVerietyListDetails = [];

    let object = {
      formData: {
        year: year.value,
        season: season.value,
        crop_code: cropName.value,
      }
    }
    this.selectedVarietyForEdit = [];
    this.varietyDropdownData = [];
    this.varietyDropdownDatasecond = [];
    let lineCode = this.varietyForm.controls['variety_line'].value && this.varietyForm.controls['variety_line'].value[0] && this.varietyForm.controls['variety_line'].value[0].display_text ? this.varietyForm.controls['variety_line'].value[0].display_text : '';


    this.breederService.postRequestCreator("allocation/getVarietyDataForEdit", null, object).subscribe((data: any) => {
      this.breederService.getRequestCreatorNew("allocation-to-indentor-varieties-for-edit" + "?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&vaiety_line=" + lineCode).subscribe((dataList: any) => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          this.verietyListDetails = dataList.EncryptedResponse.data;
          if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.length > 0) {

            data.EncryptedResponse.data.forEach(element => {
              if (element.is_active == 1) {
                this.isCropSubmittedNew = true;
              }
            });
            this.isCropSubmitted = true;
            this.getFilledVarietyData(data.EncryptedResponse.data);
          }

          if (this.selectedVarietyForEdit && this.selectedVarietyForEdit.length > 0) {
            this.verietyListDetails.varieties.forEach(element => {
              const index = this.selectedVarietyForEdit.findIndex(x => (x.variety_id == element.variety_id && x.is_variety_submitted == 1));
              if (index == -1) {
                if (element) {
                  const temp = {
                    name: element.m_crop_variety.variety_name,
                    value: element.m_crop_variety.id
                  }

                  const index2 = this.varietyDropdownData.findIndex(x => x.value == element.m_crop_variety.id);

                  if (index2 == -1) {
                    this.tempVerietyListDetails.push(temp)
                    this.varietyDropdownData.push(temp);
                  }

                }
              }
            });
          } else {
            this.verietyListDetails.varieties.forEach(element => {
              if (element) {
                const temp = {
                  name: element.m_crop_variety.variety_name,
                  value: element.m_crop_variety.id
                }
                const index2 = this.varietyDropdownData.findIndex(x => x.value == element.m_crop_variety.id);

                if (index2 == -1) {
                  this.tempVerietyListDetails.push(temp)
                  this.varietyDropdownData.push(temp);
                }
              }

            });
          }
          this.varietyDropdownDatasecond = this.varietyDropdownData

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


    })


  }


  onSelectVariety(event: any) {
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;

    this.selectedVerietyDetail = {}
    this.indentors = []

    this.tempForm.controls['selectedIndentorModel'].patchValue(null)
    this.selectedIndentor = null;
    this.selectedVarietyFrom = 0;

    this.editVarietyForm.reset();
    this.dataToShow = null;

    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['variety_id'] = this.varietyForm.controls['variety_id'].value[0].value;
    // this.selectedVerietyDetail['variety_line'] = this.varietyForm.controls['variety_line'].value && this.varietyForm.controls['variety_line'].value[0] && this.varietyForm.controls['variety_line'].value[0].display_text ? this.varietyForm.controls['variety_line'].value[0].display_text : '';
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;
    let lineCode = this.varietyForm.controls['variety_line'].value && this.varietyForm.controls['variety_line'].value[0] && this.varietyForm.controls['variety_line'].value[0].display_text ? this.varietyForm.controls['variety_line'].value[0].display_text : '';
    let varietyCode = this.varietyForm.controls['variety_id'].value[0].value;
    this.varietyForm.controls['variety_line'].setValue('');
    this.varietyLine = '';


    this.getLineData()


  }
  onSelectVarietyLine(event: any) {
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;

    this.selectedVerietyDetail = {}
    this.indentors = []

    this.tempForm.controls['selectedIndentorModel'].patchValue(null)
    this.selectedIndentor = null;
    this.selectedVarietyFrom = 0;

    this.editVarietyForm.reset();
    this.dataToShow = null;

    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['variety_id'] = this.varietyForm.controls['variety_id'].value[0].value;
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;
    let lineCode = this.varietyForm.controls['variety_line'].value && this.varietyForm.controls['variety_line'].value[0] && this.varietyForm.controls['variety_line'].value[0].display_text ? this.varietyForm.controls['variety_line'].value[0].display_text : '';
    let varietyCode = this.varietyForm.controls['variety_id'].value[0].value;
    this.breederService.getRequestCreatorNew("allocation-to-indentor-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + varietyCode + "&line_code=" + lineCode).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {

        const variety = data.EncryptedResponse.data;
        const producionCentersList = []

        variety.productionCenters.forEach(element => {
          if (element && element.quantityProduced > 0) {
            const temp = {
              name: element.user.name,
              value: element.production_center_id,
              agency_name: element.agency_detail.agency_name,
              id: element.production_center_id,
              quantity: 0,

            }
            producionCentersList.push(JSON.parse(JSON.stringify(temp)));
          }
        })

        this.indentors = [];

        variety.indentors.forEach(element => {
          element.quantity_left_for_allocation = element.indent_quantity - element.allocated_quantity
          element['productions'] = JSON.parse(JSON.stringify(producionCentersList));

          if (this.selectedVarietyForEdit && this.selectedVarietyForEdit.length > 0) {
            const registerVariety = this.selectedVarietyForEdit.find(x => x.variety_id == this.selectedVerietyDetail.variety_id);

            if (registerVariety) {

              const indentorData = registerVariety.indentor.find(y => y.indentor_id == element.user_id);

              if (!indentorData) {
                const obj = {
                  name: element.user.name ? element.user.name : 'NA',
                  value: element.id,
                  allocated_quantity: element.allocated_quantity,
                  indent_quantity: element.indent_quantity,
                  productions: element.productions,
                  quantity_left_for_allocation: element.quantity_left_for_allocation
                }

                this.indentors.push(obj);
              } else {
                variety.productionCenters.forEach(prod => {
                  indentorData.productions.forEach(ind_prod => {
                    if (prod.production_center_id == ind_prod.production_center_id) {
                      prod.quantityAllocated += ind_prod.qty
                    }
                  });
                });
              }

            } else {

              const obj = {
                name: element.user.name ? element.user.name : 'NA',
                value: element.id,
                allocated_quantity: element.allocated_quantity,
                indent_quantity: element.indent_quantity,
                productions: element.productions,
                quantity_left_for_allocation: element.quantity_left_for_allocation
              }

              this.indentors.push(obj);
            }

          } else {

            const obj = {
              name: element.user.name ? element.user.name : 'NA',
              value: element.id,
              allocated_quantity: element.allocated_quantity,
              indent_quantity: element.indent_quantity,
              productions: element.productions,
              quantity_left_for_allocation: element.quantity_left_for_allocation
            }

            this.indentors.push(obj);

            this.inputForm.controls['quantityInputBox'].setValue(0);
            obj.productions.map(el => {
              el.quantity = 0;
              return el;
            });
          }
        })
        if (variety.productionCenters && variety.allocationToIndentorSeeddata) {
          variety.productionCenters = variety.productionCenters.map(item1 => {
            const matchingItem = variety.allocationToIndentorSeeddata.find(item2 => item2.production_center_id === item1.production_center_id);
            if (matchingItem) {
              return { ...item1, ...matchingItem };
            } else {
              return item1;
            }
          });
        }

        this.indentorLoad = true
        this.selectedVerietyDetail['indentorqty'] = variety && variety.indentorqty ? variety.indentorqty : '';
        this.selectedVerietyDetail['totalAllocatedQty'] = variety && variety.totalAllocatedQty ? variety.totalAllocatedQty : '';
        this.selectedVerietyDetail['indentors'] = variety.indentors;
        this.selectedVerietyDetail['productionCenters'] = variety.productionCenters
        this.selectedVerietyDetail['totalIndentQuantity'] = variety.totalIndentQuantity;
        this.selectedVerietyDetail['totalAllocationQuantity'] = variety.totalAllocationQuantity;
        this.selectedVerietyDetail['productionCenters'] = this.selectedVerietyDetail.productionCenters.filter(item => item.quantityProduced > 0)

        if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
          this.productionPercentage = 100;
        } else {
          this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
        }

        this.submittedData = []

        this.submittedData.push(JSON.parse(JSON.stringify(this.selectedVerietyDetail)));

        this.submittedData.forEach(newElement => {

          if (this.editVariety) {

            if (newElement.variety_id == this.editVariety.variety_id) {

              newElement.indentors.forEach(newInden => {
                this.editVariety.indentor.forEach(inden => {
                  if (newInden.user_id == inden.indentor_id) {
                    newInden.productions.forEach(newProd => {
                      inden.productions.forEach(prod => {
                        if (newProd.id == prod.production_center_id && newProd.id == prod.production_center_id) {
                          newProd.quantity = prod.qty;
                        }

                      });
                    });
                  }

                })

                newInden.productions.forEach(element => {
                  newInden.allocated_quantity += element.quantity
                });

              })

              newElement.productionCenters.forEach(prod => {
                prod.quantityAllocated = 0;
                this.editVariety.indentor.forEach(inden => {
                  inden.productions.forEach(element => {
                    if (element.production_center_id == prod.production_center_id) {
                      prod.quantityAllocated += element.qty;

                    }
                  });
                });
              });
            }
          }

          newElement.indentors.forEach(ind => {
            ind.quantity_left_for_allocation = ind.indent_quantity - ind.allocated_quantity;
          });


        });


        this.dataToShow = this.submittedData;

        // Remove the production with value 0

        this.dataToShow.forEach(variety => {
          variety.indentors.forEach((indentor, i) => {
            const prods = indentor.productions.filter(x => x.quantity > 0)
            indentor.productions = prods
          });
        });

        for (let val of this.dataToShow) {
          let sum = 0;
          for (let value of val.indentors) {
            value['name'] = value.user.name;
            for (let data of value.productions) {

              value.totalProductionlength = value.productions.length
              val.totalIndentorlength = val.indentors.length
              if (val.totalIndentorlength > 1) {

                val.totalVarietyLength = value.productions.length + val.indentors.length
              } else {
                val.totalVarietyLength = value.productions.length
              }
              sum += value.productions.length;
              val.totalproductioIndentliength = sum

            }
          }

        }
        this.dataToDisplay = [];

        for (let data of this.dataToShow) {
          let sum = 0;
          for (let value of data.indentors) {
            sum += value.productions.length;
            data.totalVarietyLength = sum

          }
        }
        this.dataToDisplay = this.dataToShow;
      }
    })
    this.getLineData()


  }

  onSelectEditVariety(event: any) {
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;

    this.selectedVarietyFrom = 1;
    this.indentorLoad = false;

    this.selectedVerietyDetail = {}
    this.indentors = []
    this.tempForm.controls['selectedIndentorModel'].patchValue(null)
    this.selectedIndentor = null;

    this.varietyForm.reset();

    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['variety_id'] = event.value;
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;
    this.isEditingVariety = true; // Set flag to true while editing
    this.getLineData2()


  }

  onSelectIndentor(event: any) {
    let datas = this.selectedVerietyDetail && this.selectedVerietyDetail.productionCenters ? this.selectedVerietyDetail.productionCenters : ''
    this.selectedIndentor = this.indentors.find(x => x.value == event.value);
    const finalArr = this.selectedIndentor.productions.filter(({ id, name }) =>
      datas.some(exclude => exclude.user.name === name)
    );
    this.selectedIndentor['productions'] = finalArr;
    this.selectedIndentor['productions'].forEach(element => {
      // this.inputForm.controls['quantityInputBox'].patchValue(element.quantity)
    });

  }


  newQuantity(qty, prodCenter) {
    return { "qty": parseFloat(qty), "productionCenter": prodCenter }
  }

  onItemSelect(event: any) {
    this.selectedItem = event;

  }


  qtyChanged(e, production) {
    let value;

    if (e.target.value >= 0) {
      value = Number(e.target.value);
    } else {
      value = 0
    }

    production['quantity'] = value;

    let temp1 = 0;
    this.selectedIndentor['productions'].forEach(element => {
      temp1 += ((element.quantity && element.quantity > 0) ? element.quantity : 0);
    });

    this.selectedIndentor['allocated_quantity'] = temp1;
    this.selectedIndentor['quantity_left_for_allocation'] = this.getQuantityOfSeedProduced(this.selectedIndentor.indent_quantity - temp1);

  }

  submitData(indenter?: any, selectVariety?: any) {
    const restQuantity = this.getPercentage(indenter.indent_quantity);
    if (indenter.allocated_quantity > restQuantity) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity Should be Proportional to Total Indent Quantity.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return
    }

    let isAllValueZero = true;

    indenter.productions.forEach(data => {
      if (data.quantity > 0) {
        isAllValueZero = false
      }
    });

    if (isAllValueZero) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity Should Not be 0.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }

    let checkValid = true;
    let lineCode = this.varietyForm.controls['variety_line'].value && this.varietyForm.controls['variety_line'].value[0] && this.varietyForm.controls['variety_line'].value[0].display_text ? this.varietyForm.controls['variety_line'].value[0].display_text : '';
    if (checkValid) {
      const variety = {
        year: this.IstPartFormGroupControls["yearofIndent"].value.value,
        season: this.IstPartFormGroupControls["season"].value.value,
        crop_code: this.IstPartFormGroupControls["cropName"].value.value,
        variety_id: this.selectedVerietyDetail.variety_id,
        totalIndentQuantity: this.selectedVerietyDetail.totalIndentQuantity,
        totalAllocationQuantity: this.selectedVerietyDetail.totalAllocationQuantity,
        variety_line: lineCode,
        indenter: {
          name: indenter.name,
          allocated_quantity: indenter.allocated_quantity,
          indent_quantity: indenter.indent_quantity,
          productions: indenter.productions,
          quantity_left_for_allocation: indenter.quantity_left_for_allocation,
          value: indenter.value
        }
      }

      let object = {
        formData: variety
      }

      this.breederService.postRequestCreator("allocation-to-indentor", null, object).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Allocation has been successfully made.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })


          // this.IstPartFormGroupControls['cropName'].reset();
          // this.tempForm.controls['selectedIndentorModel'].reset();

          if (this.selectedVarietyFrom == 1) {
            this.onSelectEditVariety({
              value: variety.variety_id
            })
          } else {
            this.dataToShow.forEach(element => {
              if (element.variety_id == variety.variety_id) {
                const indentorIndex = element.indentors.findIndex(x => x.id == indenter.value);
                if (indentorIndex > -1) {
                  element.indentors[indentorIndex].productions = JSON.parse(JSON.stringify(indenter.productions));
                }
              }
            });

            this.dataToShow.forEach(variety => {
              variety.indentors.forEach((indentor, i) => {
                const prods = indentor.productions.filter(x => x.quantity > 0)
                indentor.productions = prods

              });

              variety.indentors.forEach(inden => {
                inden.allocated_quantity = 0;
                inden.productions.forEach(prod => {
                  inden.allocated_quantity += prod.quantity
                });

                inden.quantity_left_for_allocation = inden.indent_quantity - inden.allocated_quantity;
              });

              this.selectedVerietyDetail.productionCenters.forEach(prod => {
                prod.quantityAllocated = 0;
                variety.indentors.forEach(inden => {
                  inden.productions.forEach(prod2 => {
                    if (prod.production_center_id == prod2.id) {
                      prod.quantityAllocated += prod2.quantity
                    }
                  });
                });
              })
              console.log(this.selectedVerietyDetail.productionCenters, '')
            });

            for (let val of this.dataToShow) {
              let sum = 0;
              for (let value of val.indentors) {
                value['name'] = value.user.name;
                for (let data of value.productions) {

                  value.totalProductionlength = value.productions.length
                  val.totalIndentorlength = val.indentors.length
                  if (val.totalIndentorlength > 1) {

                    val.totalVarietyLength = value.productions.length + val.indentors.length
                  } else {
                    val.totalVarietyLength = value.productions.length
                  }
                  sum += value.productions.length;
                  val.totalproductioIndentliength = sum

                }
              }

            }
            // this.submitData();
            this.isTableVisible = true;
            this.dataToDisplay = [];

            this.dataToDisplay = this.dataToShow;

            this.selectedIndentor = undefined;
            this.tempForm.patchValue([]);
            this.inputForm.reset();

            const temps = JSON.parse(JSON.stringify(this.indentors));

            this.indentors = [];

            temps.forEach(element => {
              if (element && element.value != indenter.value) {
                this.indentors.push(element)
              }
            });

            // this.inputForm.controls['quantityInputBox'].setValue(0);
            // indenter.productions.map(el => {
            //   el.quantity = 0;
            //   return el;
            // });

          }

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: data.EncryptedResponse.message,
          })

          // if (this.selectedVarietyFrom !== 1) {
          //   this.inputForm.controls['quantityInputBox'].setValue(0);
          //   indenter.productions.map(el => {
          //     el.quantity = 0;
          //     return el;
          //   });
          // }

        }
        this.tempForm.patchValue([]);
        this.inputForm.reset();
        this.tempForm.controls['selectedIndentorModel'].patchValue(null)
        this.selectedIndentor = {}
        this.tempForm.reset();

        // this.varietyForm.reset();
        return
      }, (error: any) => {
        return
      })

    } else {
      return
    }
  }

  getVarietyName(id: any) {
    let variety_name;
    this.verietyListDetails.varieties = this.verietyListDetails.varieties && this.verietyListDetails.varieties.length > 0 ? this.verietyListDetails.varieties : this.verietyListDetails.varietyforedit;
    this.verietyListDetails.varieties.forEach(x => {
      if (x && x.m_crop_variety && x.m_crop_variety.id == id) {
        variety_name = x;
      }
    });
    if (variety_name && variety_name.m_crop_variety && variety_name.m_crop_variety.variety_name) {
      let VarietyName1 = variety_name && variety_name.m_crop_variety && variety_name.m_crop_variety.variety_name
      return VarietyName1
    }
    return 'NA'
  }

  getVarietyName2(id: any) {
    let variety_name;
    this.verietyListDetails.varietyforedit.forEach(x => {
      if (x && x.m_crop_variety && x.m_crop_variety.id == id) {
        variety_name = x;
      }
    });
    if (variety_name && variety_name.m_crop_variety && variety_name.m_crop_variety.variety_name) {
      return variety_name.m_crop_variety.variety_name
    }
    return 'NA'
  }


  getFilledVarietyData(variety) {
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    let variety_line = this.editVarietyForm.controls['variety_line'].value && this.editVarietyForm.controls['variety_line'].value[0] && this.editVarietyForm.controls['variety_line'].value[0].value ? this.editVarietyForm.controls['variety_line'].value[0].value : ''
    this.submittedData = [];
    this.totalAllocationQuantity = 0;
    variety.forEach((varietyElement: any) => {
      this.editVariety = varietyElement;
      if (varietyElement.variety_line_code) {
        this.breederService.getRequestCreatorNew("allocation-to-indentor-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + varietyElement.variety_id + "&line_code=" + varietyElement.variety_line_code).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
            const variety = data.EncryptedResponse.data;
            const producionCentersList = []
            const tempProd = []
            const tempProducionCentersList = []
            variety.productionCenters.forEach(element => {
              let temp = {
                agency_name: element.agency_detail ? element.agency_detail.agency_name : 'NA',
                name: element.user.name,
                value: element.production_center_id,
                id: element.production_center_id,
                quantity: 0,
              }

              producionCentersList.push(JSON.parse(JSON.stringify(temp)));
              if (element && element.quantityProduced && element.quantityProduced > 0) {
                tempProd.push(element)
                tempProducionCentersList.push(JSON.parse(JSON.stringify(temp)));
              }
            })

            const object = {
              id: varietyElement.id,
              variety_id: varietyElement.variety_id,
              line_code: varietyElement.variety_line_code,
              line_name: varietyElement.line_name,
              totalIndentQuantity: Number(varietyElement.totalIndentQuantity),
              totalAllocationQuantity: Number(varietyElement.productionQuantity),
              indentors: [],
              productionCenters: tempProd
            }

            const indentors = [];

            variety.indentors.forEach(element => {
              element.quantity_left_for_allocation = element.indent_quantity - element.allocated_quantity
              element['productions'] = JSON.parse(JSON.stringify(tempProducionCentersList));

              const obj = {
                agency_name: element.agency_detail ? element.agency_detail.agency_name : 'NA',
                name: element.user.name ? element.user.name : 'NA',
                value: element.id,
                allocated_quantity: element.allocated_quantity,
                indent_quantity: element.indent_quantity,
                productions: element.productions,
                quantity_left_for_allocation: element.quantity_left_for_allocation,
                user_id: element.user_id
              }

              indentors.push(obj);

            })

            const tempIndentors = []

            indentors.forEach((indentor, i) => {
              const tempIndentor = {
                value: indentor.value,
                indent_quantity: indentor.indent_quantity,
                allocated_quantity: indentor.allocated_quantity,
                name: indentor.name,
                quantity_left_for_allocation: indentor.quantity_left_for_allocation,
                productions: [],
                user_id: indentor.user_id
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

                    if (indentor.user_id == editIndentor.indentor_id) {
                      if (producion.id == editProducion.production_center_id) {
                        temp.quantity = editProducion.qty;
                        producion = temp
                      }
                    }
                  });
                });

                tempIndentor.productions.push(producion)

              });

              tempIndentors.push(tempIndentor)
            });

            object.indentors = tempIndentors;
            object.indentors.forEach(element => {
              element.productions.forEach(prod => {
                element.allocated_quantity += prod.quantity
              });
            });

            this.submittedData.push(object);

            this.submittedData.forEach(element => {

              if (element.variety_id == this.editVariety.variety_id) {
                element.productionCenters.forEach(prod => {
                  this.editVariety.indentor.forEach(inden => {
                    inden.productions.forEach(element => {
                      if (element.production_center_id == prod.production_center_id) {
                        prod.quantityAllocated += element.qty;
                      }
                    });
                  });
                });
              }

              element.indentors.forEach(ind => {
                ind.quantity_left_for_allocation = ind.indent_quantity - ind.allocated_quantity;
              });

            });

            this.dataToShow = this.submittedData;

            for (let val of this.dataToShow) {
              let sum = 0;
              for (let value of val.indentors) {
                for (let data of value.productions) {
                  value.totalProductionlength = value.productions.length
                  val.totalIndentorlength = val.indentors.length
                  if (val.totalIndentorlength > 1) {

                    val.totalVarietyLength = value.productions.length + val.indentors.length
                  } else {
                    val.totalVarietyLength = value.productions.length
                  }
                  sum += value.productions.length;
                  val.totalproductioIndentliength = sum

                }
              }
            }
            this.dataToDisplay = [];

            if (this.isCropSubmitted) {
              this.dataToDisplay = this.dataToShow;
              for (let item of this.dataToDisplay) {

              }
              for (let data of this.dataToDisplay) {
                let sum = 0;
                for (let value of data.indentors) {
                  sum += value.productions.length;
                  data.totalVarietyLength = sum
                }
              }

              this.totalData = {
                name: 'Grand Total',
                indent_quantity: 0,
                allocated_quantity: 0,
                left_quantity: 0
              }

              this.dataToShow.forEach(variety => {
                variety.indentors.forEach(indentor => {
                  this.totalData.indent_quantity += indentor.indent_quantity;
                  this.totalData.allocated_quantity += indentor.allocated_quantity;
                  this.totalData.left_quantity += indentor.quantity_left_for_allocation
                });
              });

            }


            this.editVarietyDropdown = [];
            this.totalAllocationQuantity = 0

            this.submittedData.forEach(element => {
              const index = this.editVarietyDropdown.findIndex(x => x.value == element.variety_id);
              const object = {
                name: this.getVarietyName2(element.variety_id),
                value: element.variety_id
              }
              this.editVarietyDropdown.push(object)
              element.indentors.forEach(indentor => {
                indentor.productions.forEach(prod => {
                  this.totalAllocationQuantity = this.totalAllocationQuantity + Number(prod.quantity)
                });
              });
            });


            if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
              this.productionPercentage = 100;
            } else {
              this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
            }
            this.editSubmittedData = this.submittedData;
          }
        })
      } else {
        this.breederService.getRequestCreatorNew("allocation-to-indentor-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + varietyElement.variety_id).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
            const variety = data.EncryptedResponse.data;

            const producionCentersList = []
            const tempProd = []
            const tempProducionCentersList = []

            variety.productionCenters.forEach(element => {

              let temp = {
                agency_name: element.agency_detail.agency_name,
                name: element.user.name,
                value: element.production_center_id,
                id: element.production_center_id,
                quantity: 0,

              }
              producionCentersList.push(JSON.parse(JSON.stringify(temp)));

              if (element && element.quantityProduced && element.quantityProduced > 0) {
                tempProd.push(element)
                tempProducionCentersList.push(JSON.parse(JSON.stringify(temp)));

              }
            })
            const object = {
              id: varietyElement.id,
              variety_id: varietyElement.variety_id,
              line_code: varietyElement.variety_line_code,
              totalIndentQuantity: Number(varietyElement.totalIndentQuantity),
              totalAllocationQuantity: Number(varietyElement.productionQuantity),
              indentors: [],
              productionCenters: tempProd
            }

            const indentors = [];

            variety.indentors.forEach(element => {
              element.quantity_left_for_allocation = element.indent_quantity - element.allocated_quantity
              element['productions'] = JSON.parse(JSON.stringify(tempProducionCentersList));

              const obj = {
                // agency_name: element.user.name ? element.user.name : 'NA',
                name: element.user.name ? element.user.name : 'NA',
                value: element.id,
                allocated_quantity: element.allocated_quantity,
                indent_quantity: element.indent_quantity,
                productions: element.productions,
                quantity_left_for_allocation: element.quantity_left_for_allocation,
                user_id: element.user_id
              }

              indentors.push(obj);

            })

            const tempIndentors = []

            indentors.forEach((indentor, i) => {
              const tempIndentor = {
                value: indentor.value,
                indent_quantity: indentor.indent_quantity,
                allocated_quantity: indentor.allocated_quantity,
                name: indentor.name,
                quantity_left_for_allocation: indentor.quantity_left_for_allocation,
                productions: [],
                user_id: indentor.user_id
              }
              indentor.productions.forEach((producion, j) => {
                const temp = {
                  id: producion.id,
                  agency_name: producion.agency_name,
                  name: producion.name,
                  quantity: producion.quantity,
                  value: producion.value
                }

                varietyElement.indentor.forEach(editIndentor => {
                  editIndentor.productions.forEach(editProducion => {

                    if (indentor.user_id == editIndentor.indentor_id) {
                      if (producion.id == editProducion.production_center_id) {
                        temp.quantity = editProducion.qty;
                        producion = temp
                      }
                    }
                  });
                });

                tempIndentor.productions.push(producion)

              });

              tempIndentors.push(tempIndentor)
            });

            object.indentors = tempIndentors;
            object.indentors.forEach(element => {
              element.productions.forEach(prod => {
                element.allocated_quantity += prod.quantity
              });
            });

            this.submittedData.push(object);

            this.submittedData.forEach(element => {

              if (element.variety_id == this.editVariety.variety_id) {
                element.productionCenters.forEach(prod => {
                  this.editVariety.indentor.forEach(inden => {
                    inden.productions.forEach(element => {
                      if (element.production_center_id == prod.production_center_id) {
                        prod.quantityAllocated += element.qty;
                      }
                    });
                  });
                });
              }

              element.indentors.forEach(ind => {
                ind.quantity_left_for_allocation = ind.indent_quantity - ind.allocated_quantity;
              });

            });

            this.dataToShow = this.submittedData;

            for (let val of this.dataToShow) {
              let sum = 0;
              for (let value of val.indentors) {
                for (let data of value.productions) {
                  value.totalProductionlength = value.productions.length
                  val.totalIndentorlength = val.indentors.length
                  if (val.totalIndentorlength > 1) {

                    val.totalVarietyLength = value.productions.length + val.indentors.length
                  } else {
                    val.totalVarietyLength = value.productions.length
                  }
                  sum += value.productions.length;
                  val.totalproductioIndentliength = sum

                }
              }
            }
            this.dataToDisplay = [];

            if (this.isCropSubmitted) {
              this.dataToDisplay = this.dataToShow;
              for (let item of this.dataToDisplay) {

              }
              for (let data of this.dataToDisplay) {
                let sum = 0;
                for (let value of data.indentors) {
                  sum += value.productions.length;
                  data.totalVarietyLength = sum

                }
              }

              this.totalData = {
                name: 'Grand Total',
                indent_quantity: 0,
                allocated_quantity: 0,
                left_quantity: 0
              }

              this.dataToShow.forEach(variety => {
                variety.indentors.forEach(indentor => {
                  this.totalData.indent_quantity += indentor.indent_quantity;
                  this.totalData.allocated_quantity += indentor.allocated_quantity;
                  this.totalData.left_quantity += indentor.quantity_left_for_allocation
                });
              });

            }


            this.editVarietyDropdown = [];
            this.totalAllocationQuantity = 0

            this.submittedData.forEach(element => {
              const index = this.editVarietyDropdown.findIndex(x => x.value == element.variety_id);
              const object = {
                name: this.getVarietyName2(element.variety_id),
                value: element.variety_id
              }
              this.editVarietyDropdown.push(object)
              element.indentors.forEach(indentor => {
                indentor.productions.forEach(prod => {
                  this.totalAllocationQuantity = this.totalAllocationQuantity + Number(prod.quantity)
                });
              });
            });


            if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
              this.productionPercentage = 100;
            } else {
              this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
            }
            this.editSubmittedData = this.submittedData;
          }
        })
      }
      // }
    });

  }

  getFilledVarietyData2(variety) {
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    let variety_line = this.editVarietyForm.controls['variety_line'].value && this.editVarietyForm.controls['variety_line'].value[0] && this.editVarietyForm.controls['variety_line'].value[0].value ? this.editVarietyForm.controls['variety_line'].value[0].value : ''
    this.submittedData = [];
    this.totalAllocationQuantity = 0;
    variety.forEach((varietyElement: any) => {
      this.editVariety = varietyElement;
      if (varietyElement.variety_line_code) {

        this.breederService.getRequestCreatorNew("allocation-to-indentor-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + varietyElement.variety_id + "&line_code=" + varietyElement.variety_line_code).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
            const variety = data.EncryptedResponse.data;

            const producionCentersList = []
            const tempProd = []
            const tempProducionCentersList = []

            variety.productionCenters.forEach(element => {
              let temp = {
                agency_name: element.agency_detail.agency_name,
                name: element.user.name,
                value: element.production_center_id,
                id: element.production_center_id,
                quantity: 0,

              }
              producionCentersList.push(JSON.parse(JSON.stringify(temp)));

              if (element && element.quantityProduced && element.quantityProduced > 0) {
                tempProd.push(element)
                tempProducionCentersList.push(JSON.parse(JSON.stringify(temp)));

              }
            })
            const object = {
              id: varietyElement.id,
              variety_id: varietyElement.variety_id,
              line_code: varietyElement.variety_line_code,
              totalIndentQuantity: Number(varietyElement.totalIndentQuantity),
              totalAllocationQuantity: Number(varietyElement.productionQuantity),
              indentors: [],
              productionCenters: tempProd
            }

            const indentors = [];

            variety.indentors.forEach(element => {
              element.quantity_left_for_allocation = element.indent_quantity - element.allocated_quantity
              element['productions'] = JSON.parse(JSON.stringify(tempProducionCentersList));

              const obj = {
                agency_name: element.agency_detail.agency_name,
                name: element.user.name ? element.user.name : 'NA',
                value: element.id,
                allocated_quantity: element.allocated_quantity,
                indent_quantity: element.indent_quantity,
                productions: element.productions,
                quantity_left_for_allocation: element.quantity_left_for_allocation,
                user_id: element.user_id
              }

              indentors.push(obj);

            })

            const tempIndentors = []

            indentors.forEach((indentor, i) => {
              const tempIndentor = {
                value: indentor.value,
                indent_quantity: indentor.indent_quantity,
                allocated_quantity: indentor.allocated_quantity,
                name: indentor.name,
                quantity_left_for_allocation: indentor.quantity_left_for_allocation,
                productions: [],
                user_id: indentor.user_id
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

                    if (indentor.user_id == editIndentor.indentor_id) {
                      if (producion.id == editProducion.production_center_id) {
                        temp.quantity = editProducion.qty;
                        producion = temp
                      }
                    }
                  });
                });

                tempIndentor.productions.push(producion)

              });

              tempIndentors.push(tempIndentor)
            });

            object.indentors = tempIndentors;
            object.indentors.forEach(element => {
              element.productions.forEach(prod => {
                element.allocated_quantity += prod.quantity
              });
            });

            this.submittedData.push(object);

            this.submittedData.forEach(element => {

              if (element.variety_id == this.editVariety.variety_id) {
                element.productionCenters.forEach(prod => {
                  this.editVariety.indentor.forEach(inden => {
                    inden.productions.forEach(element => {
                      if (element.production_center_id == prod.production_center_id) {
                        prod.quantityAllocated += element.qty;
                      }
                    });
                  });
                });
              }

              element.indentors.forEach(ind => {
                ind.quantity_left_for_allocation = ind.indent_quantity - ind.allocated_quantity;
              });

            });

            this.dataToShow = this.submittedData;

            for (let val of this.dataToShow) {
              let sum = 0;
              for (let value of val.indentors) {
                for (let data of value.productions) {
                  value.totalProductionlength = value.productions.length
                  val.totalIndentorlength = val.indentors.length
                  if (val.totalIndentorlength > 1) {

                    val.totalVarietyLength = value.productions.length + val.indentors.length
                  } else {
                    val.totalVarietyLength = value.productions.length
                  }
                  sum += value.productions.length;
                  val.totalproductioIndentliength = sum

                }
              }
            }
            // this.dataToDisplay = [];

            if (this.isCropSubmitted) {
              // this.dataToDisplay = this.dataToShow;
              // for (let item of this.dataToDisplay) {

              // }
              for (let data of this.dataToDisplay) {
                let sum = 0;
                for (let value of data.indentors) {
                  sum += value.productions.length;
                  data.totalVarietyLength = sum
                }
              }

              this.totalData = {
                name: 'Grand Total',
                indent_quantity: 0,
                allocated_quantity: 0,
                left_quantity: 0
              }

              this.dataToShow.forEach(variety => {
                variety.indentors.forEach(indentor => {
                  this.totalData.indent_quantity += indentor.indent_quantity;
                  this.totalData.allocated_quantity += indentor.allocated_quantity;
                  this.totalData.left_quantity += indentor.quantity_left_for_allocation
                });
              });

            }


            this.editVarietyDropdown = [];
            this.totalAllocationQuantity = 0

            this.submittedData.forEach(element => {
              const index = this.editVarietyDropdown.findIndex(x => x.value == element.variety_id);
              const object = {
                name: this.getVarietyName2(element.variety_id),
                value: element.variety_id
              }
              this.editVarietyDropdown.push(object)
              element.indentors.forEach(indentor => {
                indentor.productions.forEach(prod => {
                  this.totalAllocationQuantity = this.totalAllocationQuantity + Number(prod.quantity)
                });
              });
            });


            if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
              this.productionPercentage = 100;
            } else {
              this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
            }
            this.editSubmittedData = this.submittedData;
          }
        })
      } else {
        this.breederService.getRequestCreatorNew("allocation-to-indentor-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + varietyElement.variety_id).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
            const variety = data.EncryptedResponse.data;

            const producionCentersList = []
            const tempProd = []
            const tempProducionCentersList = []

            variety.productionCenters.forEach(element => {
              let temp = {
                name: element.user.name,
                agency_name: element.agency_detail.agency_name,
                // name: element.user.name,
                value: element.production_center_id,
                id: element.production_center_id,
                quantity: 0,

              }
              producionCentersList.push(JSON.parse(JSON.stringify(temp)));

              if (element && element.quantityProduced && element.quantityProduced > 0) {
                tempProd.push(element)
                tempProducionCentersList.push(JSON.parse(JSON.stringify(temp)));

              }
            })
            const object = {
              id: varietyElement.id,
              variety_id: varietyElement.variety_id,
              line_code: varietyElement.variety_line_code,
              totalIndentQuantity: Number(varietyElement.totalIndentQuantity),
              totalAllocationQuantity: Number(varietyElement.productionQuantity),
              indentors: [],
              productionCenters: tempProd
            }

            const indentors = [];

            variety.indentors.forEach(element => {
              element.quantity_left_for_allocation = element.indent_quantity - element.allocated_quantity
              element['productions'] = JSON.parse(JSON.stringify(tempProducionCentersList));

              const obj = {
                agency_name: element.agency_detail.agency_name,
                name: element.user.name ? element.user.name : 'NA',
                value: element.id,
                allocated_quantity: element.allocated_quantity,
                indent_quantity: element.indent_quantity,
                productions: element.productions,
                quantity_left_for_allocation: element.quantity_left_for_allocation,
                user_id: element.user_id
              }

              indentors.push(obj);

            })

            const tempIndentors = []

            indentors.forEach((indentor, i) => {
              const tempIndentor = {
                value: indentor.value,
                indent_quantity: indentor.indent_quantity,
                allocated_quantity: indentor.allocated_quantity,
                name: indentor.name,
                quantity_left_for_allocation: indentor.quantity_left_for_allocation,
                productions: [],
                user_id: indentor.user_id
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

                    if (indentor.user_id == editIndentor.indentor_id) {
                      if (producion.id == editProducion.production_center_id) {
                        temp.quantity = editProducion.qty;
                        producion = temp
                      }
                    }
                  });
                });

                tempIndentor.productions.push(producion)

              });

              tempIndentors.push(tempIndentor)
            });

            object.indentors = tempIndentors;
            object.indentors.forEach(element => {
              element.productions.forEach(prod => {
                element.allocated_quantity += prod.quantity
              });
            });

            this.submittedData.push(object);

            this.submittedData.forEach(element => {

              if (element.variety_id == this.editVariety.variety_id) {
                element.productionCenters.forEach(prod => {
                  this.editVariety.indentor.forEach(inden => {
                    inden.productions.forEach(element => {
                      if (element.production_center_id == prod.production_center_id) {
                        prod.quantityAllocated += element.qty;
                      }
                    });
                  });
                });
              }

              element.indentors.forEach(ind => {
                ind.quantity_left_for_allocation = ind.indent_quantity - ind.allocated_quantity;
              });

            });
            // this.dataToShow = this.submittedData;
            // this.dataToDisplay= this.dataToShow

            // for (let val of this.dataToShow) {
            //   let sum = 0;
            //   for (let value of val.indentors) {
            //     for (let data of value.productions) {
            //       value.totalProductionlength = value.productions.length
            //       val.totalIndentorlength = val.indentors.length
            //       if (val.totalIndentorlength > 1) {

            //         val.totalVarietyLength = value.productions.length + val.indentors.length
            //       } else {
            //         val.totalVarietyLength = value.productions.length
            //       }
            //       sum += value.productions.length;
            //       val.totalproductioIndentliength = sum

            //     }
            //   }
            // }
            // this.dataToDisplay = [];

            // if (this.isCropSubmitted) {
            //   // this.dataToDisplay = this.dataToShow;
            //   for (let item of this.dataToDisplay) {

            //   }
            //   for (let data of this.dataToDisplay) {
            //     let sum = 0;
            //     for (let value of data.indentors) {
            //       sum += value.productions.length;
            //       data.totalVarietyLength = sum

            //     }
            //   }

            //   this.totalData = {
            //     name: 'Grand Total',
            //     indent_quantity: 0,
            //     allocated_quantity: 0,
            //     left_quantity: 0
            //   }

            //   this.dataToShow.forEach(variety => {
            //     variety.indentors.forEach(indentor => {
            //       this.totalData.indent_quantity += indentor.indent_quantity;
            //       this.totalData.allocated_quantity += indentor.allocated_quantity;
            //       this.totalData.left_quantity += indentor.quantity_left_for_allocation
            //     });
            //   });

            // }


            // this.editVarietyDropdown = [];
            // this.totalAllocationQuantity = 0

            // this.submittedData.forEach(element => {
            //   const index = this.editVarietyDropdown.findIndex(x => x.value == element.variety_id);
            //   const object = {
            //     name: this.getVarietyName2(element.variety_id),
            //     value: element.variety_id
            //   }
            //   this.editVarietyDropdown.push(object)
            //   element.indentors.forEach(indentor => {
            //     indentor.productions.forEach(prod => {
            //       this.totalAllocationQuantity = this.totalAllocationQuantity + Number(prod.quantity)
            //     });
            //   });
            // });


            // if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
            //   this.productionPercentage = 100;
            // } else {
            //   this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
            // }
            // this.editSubmittedData = this.submittedData;
          }
        })
      }
      // }
    });

  }
  // onSelectEditVariety(event: any) {

  //   this.submittedData.forEach(element => {
  //     if (element.variety_id == event.value) {
  //       this.editSelectedVariety = element
  //     }
  //   });

  //   this.editIndentors = []
  //   this.editSelectedVariety.indenter.forEach(element => {
  //     const object = element;
  //     this.editIndentors.push(object);
  //   });

  //   this.editSelectedVariety.productionCenters.forEach(prod => {
  //     prod.quantityAllocated = 0
  //     this.editSelectedVariety.indenter.forEach(inden => {
  //       inden.productions.forEach(element => {
  //         if (prod.production_center_id == element.id) {
  //           prod.quantityAllocated += element.quantity
  //         }
  //       });
  //     })
  //   })

  //   this.dataToDisplay = [];
  //   const copiedPerson = JSON.parse(JSON.stringify(this.editSelectedVariety));

  //   copiedPerson['indenter'].forEach(inden => {
  //     inden.productions.forEach((prod, i) => {
  //       if (prod.quantity <= 0) {
  //         inden.productions.splice(i, 1);
  //       }
  //     });
  //   });


  //   copiedPerson.totalproductioIndentliength = 0;
  //   copiedPerson.totalVarietyLength = 0;
  //   copiedPerson.totalIndentorlength = 0

  //   this.dataToDisplay.push(copiedPerson);

  //   for (let val of this.dataToDisplay) {
  //     let sum = 0;
  //     for (let value of val.indenter)
  //       for (let data of value.productions) {
  //         value.totalProductionlength = value.productions.length
  //         val.totalIndentorlength = val.indenter.length
  //         if (val.totalIndentorlength > 1) {

  //           val.totalVarietyLength = value.productions.length + val.indenter.length
  //         } else {
  //           val.totalVarietyLength = value.productions.length
  //         }
  //         sum += value.productions.length;
  //         val.totalproductioIndentliength = sum

  //       }
  //   }


  // }

  onEditIndentor(event) {
    this.editSelectedIndentor = this.editIndentors.find(x => x.value == event.value)
    let datas = this.selectedVerietyDetail && this.selectedVerietyDetail.productionCenters ? this.selectedVerietyDetail.productionCenters : '';

    const finalArr = this.selectedIndentor.productions.filter(({ id, name }) =>
      datas.some(exclude => exclude.user.name === name)
    );
    this.selectedIndentor['productions'] = finalArr;

  }

  editQtyChanged(e, production, productionIndex) {
    let value;

    if (e.target.value >= 0) {
      value = Number(e.target.value);
    } else {
      value = 0
    }
    this.cancelProduction = production

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
        title: '<p style="font-size:25px;">Allocated Quantity Should be Proportional to Total Indent Quantity.</p>',
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

      this.editSelectedVariety.productionCenters.forEach(prod => {
        prod.quantityAllocated = 0
        this.editSelectedVariety.indenter.forEach(inden => {
          inden.productions.forEach(element => {
            if (prod.production_center_id == element.id) {

              prod.quantityAllocated += element.quantity

              if (prod.quantityAllocated > prod.quantityProduced) {
                Swal.fire({
                  title: '<p style="font-size:25px;">Quantity Allocated Should Not be More Than Quantity Produced.</p>',
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
      }
    }
    this.breederService.postRequestCreator("allocation/getVarietyDataForEdit", null, object).subscribe((data: any) => {
      this.getFilledVarietyData(data.EncryptedResponse.data,);
      // this.editIndentors=[]

      this.dataToDisplay = []
      this.editVarietyForm.controls['variety_id'].setValue('')
      this.inputForm.controls['quantityInputBox'].setValue('')
      this.editSelectedVariety = false
    })
    // const restQuantity = this.getPercentage(indenter.indent_quantity);


    // this.getCropVerieties()


    // if (indenter.allocated_quantity > restQuantity) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Allocated quantity should be proportional to Total indent quantity',
    //     showConfirmButton: false,
    //     timer: 1500
    //   })

    //   indenter['productions'].forEach(element => {
    //     element.quantity = 0;
    //   });

    //   indenter.allocated_quantity = 0;
    //   indenter.quantity_left_for_allocation = indenter.indent_quantity

    //   return
    // } else {
    //   var invalid = false;

    //   this.editSelectedVariety.productionCenters.forEach(element => {
    //     indenter.productions.forEach(data => {
    //       if (element.production_center_id == data.value) {

    //        let  quantityAllocated = element.quantityAllocated;

    //         if (element.quantityProduced < ( data.quantity)) {
    //           Swal.fire({
    //             icon: 'error',
    //             title: 'Quantity Allocated should not be more than Quantity Produced',
    //             showConfirmButton: false,
    //             timer: 1500
    //           })

    //           invalid = true;
    //           return
    //         } else {
    //           element.quantityAllocated = quantityAllocated + data.quantity;
    //         }
    //       }
    //     });
    //   });
    // }

    // if (!invalid) {
    //   this.editSelectedIndentor = null;
    //   this.editTempForm.reset()
    // }
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

    let value = input.value;

    if ((value.indexOf('.') != -1) && (value.substring(value.indexOf('.')).length > 3)) {
      evt.preventDefault();
    }

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
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

    if (year && season && crop_code && this.selectedVerietyDetail) {

      let object = {
        formData: {
          year: year,
          season: season,
          crop_code: crop_code,
          selectedVariety: this.selectedVerietyDetail
        }
      }
      this.isEdit ? this.update(this.dataToShow) : this.create(this.dataToShow);

      this.breederService.postRequestCreator("allocation/varietyWiseSubmission", null, object).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          const successMessage = this.isEditingVariety
            ? "Variety data has been successfully edited."
            : "Variety data has been successfully saved.";

          Swal.fire({
            title: `<p style="font-size:25px;">${successMessage}</p>`, icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          })
          this.editVarietyForm.controls['variety_id'].reset();
          this.varietyForm.controls['variety_id'].reset();
          this.varietyDropdownDatasecond = []
          this.selectedVerietyDetail = null
          this.isEditingVariety = false;
          this.getCropVerieties();
          this.getLineData()
          this.varietyLine = []

          // this.varietyForm.reset();
          // this.editVarietyForm.reset();

          // this.varietyForm.reset();
          // this.editVarietyForm.reset();


          if (this.varietyDropdownData.length == 0) {
            this.cropButtonEnable = true;
          }

          if (this.selectedVarietyFrom !== 1) {
            this.submittedData = []
            this.dataToShow = []
            this.dataToDisplay = []
          }

        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: data.EncryptedResponse.data.message,
          })
        }
      })

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
    this.editVarietyForm.reset();
  }


  create(params) {
    let object = {
      formData: params
    }
    this.breederService.postRequestCreator("allocation-to-indentor", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Submitted.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })

        this.submittedData = []
        this.dataToShow = []
        this.dataToDisplay = []

        if (this.tempVerietyListDetails.length == 0) {
          this.cropButtonEnable = true;
        }

        // this.router.navigate(['seed-division/breeder-seed-allocation-lifting']);
      }
      else if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.message) {
        Swal.fire({
          title: '<p style="font-size:25px;">BSP Form Has Already Been Filled For This Variety.</p>',
          icon: 'info',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
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

  update(params) {
    let object = {
      formData: params
    }
    this.breederService.postRequestCreator("allocation-to-indentor/edit", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          icon: 'success',
          title: 'Data Has Been Successfully Updated!',
          showConfirmButton: false,
          timer: 1000
        })
        this.router.navigate(['seed-division/breeder-seed-allocation-lifting']);
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
    this.showgrid1 = true;
    const year = this.formSuperGroup.value.IstPartFormGroup.yearofIndent.value;
    const season = this.formSuperGroup.value.IstPartFormGroup.season.value;
    const crop_code = this.formSuperGroup.value.IstPartFormGroup.cropName.value;

    Swal.fire({
      title: 'Are You Sure To Submit Crop Wise Allocation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.breederService.postRequestCreator("allocation/cropWiseSubmission?year=" + year + "&season=" + season + "&cropCode=" + crop_code).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Crop Wise Data Submitted',
              showConfirmButton: false,
              timer: 1500
            }).then(x => {
              this.search()
            })
            // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            //   // this.router.navigate(['seed-division/breeder-seed-allocation-lifting/new']);
            // });

          } else if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 201) {
            Swal.fire({
              icon: 'info',
              title: 'Crop Wise Data Already Submitted',
              showConfirmButton: false,
              timer: 1500
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
    if (data) {
      let value = data.toString();

      if (value.indexOf(".") == -1) {
        return data;

      } else {
        return data ? (Number(data) < 0) ? 0 : Number(data).toFixed(2) : 0;

      }
    } else {
      return 0
    }

  }

  getPercentage(data?: any) {
    let val = (this.productionPercentage * data) / 100;

    let value = val.toString();

    if (value.indexOf(".") == -1) {
      return val;

    } else {
      return val ? Number(val).toFixed(2) : 0;

    }
  }
  getPercentageValue(item, val) {
    if (item && val) {
      let data = item / val * 100;
      return data ? data.toFixed(2) : "Na"
    } else {
      return 'NA'
    }
  }

  getLineData() {
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;


    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    // this.selectedVerietyDetail['variety_id'] = event.value;
    // this.varietyForm.controls['variety_id'].value
    let variety;
    if (this.verietyListDetails && this.verietyListDetails.varieties && this.verietyListDetails.varieties.length > 0) {
      variety = this.verietyListDetails.varieties.filter(x => x.m_crop_variety.id == (this.varietyForm.controls['variety_id'].value && this.varietyForm.controls['variety_id'].value[0].value ? this.varietyForm.controls['variety_id'].value[0].value : ''))
    }
    const param = {
      year: year.value,
      season: season.value,
      crop_code: cropName.value,
      variety_id: variety && variety[0] && variety[0].variety_code ? variety[0].variety_code : ''
    }
    this.breederService.postRequestCreator('get-breeder-line-data', null, param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.varietyLine = res ? res : ''
      if (res && res.length < 1) {
        this.breederService.getRequestCreatorNew("allocation-to-indentor-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + this.varietyForm.controls['variety_id'].value[0].value).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {

            const variety = data.EncryptedResponse.data;
            const producionCentersList = []

            variety.productionCenters.forEach(element => {
              if (element && element.quantityProduced > 0) {
                const temp = {
                  name: element.user.name,
                  agency_name: element.agency_detail.agency_name,
                  value: element.production_center_id,
                  id: element.production_center_id,
                  quantity: 0,

                }
                producionCentersList.push(JSON.parse(JSON.stringify(temp)));
              }
            })

            this.indentors = [];

            variety.indentors.forEach(element => {
              element.quantity_left_for_allocation = element.indent_quantity - element.allocated_quantity
              element['productions'] = JSON.parse(JSON.stringify(producionCentersList));

              if (this.selectedVarietyForEdit && this.selectedVarietyForEdit.length > 0) {
                const registerVariety = this.selectedVarietyForEdit.find(x => x.variety_id == this.selectedVerietyDetail.variety_id);

                if (registerVariety) {

                  const indentorData = registerVariety.indentor.find(y => y.indentor_id == element.user_id);

                  if (!indentorData) {
                    const obj = {
                      name: element.user.name ? element.user.name : 'NA',
                      value: element.id,
                      allocated_quantity: element.allocated_quantity,
                      indent_quantity: element.indent_quantity,
                      productions: element.productions,
                      quantity_left_for_allocation: element.quantity_left_for_allocation
                    }

                    this.indentors.push(obj);
                  } else {
                    variety.productionCenters.forEach(prod => {
                      indentorData.productions.forEach(ind_prod => {
                        if (prod.production_center_id == ind_prod.production_center_id) {
                          prod.quantityAllocated += ind_prod.qty
                        }
                      });
                    });
                  }

                } else {

                  const obj = {
                    name: element.user.name ? element.user.name : 'NA',
                    value: element.id,
                    allocated_quantity: element.allocated_quantity,
                    indent_quantity: element.indent_quantity,
                    productions: element.productions,
                    quantity_left_for_allocation: element.quantity_left_for_allocation
                  }

                  this.indentors.push(obj);
                }

              } else {

                const obj = {
                  name: element.user.name ? element.user.name : 'NA',
                  value: element.id,
                  allocated_quantity: element.allocated_quantity,
                  indent_quantity: element.indent_quantity,
                  productions: element.productions,
                  quantity_left_for_allocation: element.quantity_left_for_allocation
                }

                this.indentors.push(obj);

                this.inputForm.controls['quantityInputBox'].setValue(0);
                obj.productions.map(el => {
                  el.quantity = 0;
                  return el;
                });
              }
            })
            if (variety.productionCenters && variety.allocationToIndentorSeeddata) {
              variety.productionCenters = variety.productionCenters.map(item1 => {
                const matchingItem = variety.allocationToIndentorSeeddata.find(item2 => item2.production_center_id === item1.production_center_id);
                if (matchingItem) {
                  return { ...item1, ...matchingItem };
                } else {
                  return item1;
                }
              });
            }


            this.indentorLoad = true
            this.selectedVerietyDetail['indentorqty'] = variety && variety.indentorqty ? variety.indentorqty : '';
            this.selectedVerietyDetail['totalAllocatedQty'] = variety && variety.totalAllocatedQty ? variety.totalAllocatedQty : '';
            this.selectedVerietyDetail['indentors'] = variety.indentors;
            this.selectedVerietyDetail['productionCenters'] = variety.productionCenters
            this.selectedVerietyDetail['totalIndentQuantity'] = variety.totalIndentQuantity;
            this.selectedVerietyDetail['totalAllocationQuantity'] = variety.totalAllocationQuantity;
            this.selectedVerietyDetail['productionCenters'] = this.selectedVerietyDetail.productionCenters.filter(item => item.quantityProduced > 0)

            if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
              this.productionPercentage = 100;
            } else {
              this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
            }

            this.submittedData = []

            this.submittedData.push(JSON.parse(JSON.stringify(this.selectedVerietyDetail)));

            this.submittedData.forEach(newElement => {

              if (this.editVariety) {

                if (newElement.variety_id == this.editVariety.variety_id) {

                  newElement.indentors.forEach(newInden => {
                    this.editVariety.indentor.forEach(inden => {
                      if (newInden.user_id == inden.indentor_id) {
                        newInden.productions.forEach(newProd => {
                          inden.productions.forEach(prod => {
                            if (newProd.id == prod.production_center_id && newProd.id == prod.production_center_id) {
                              newProd.quantity = prod.qty;
                            }

                          });
                        });
                      }

                    })

                    newInden.productions.forEach(element => {
                      newInden.allocated_quantity += element.quantity
                    });

                  })

                  newElement.productionCenters.forEach(prod => {
                    prod.quantityAllocated = 0;
                    this.editVariety.indentor.forEach(inden => {
                      inden.productions.forEach(element => {
                        if (element.production_center_id == prod.production_center_id) {
                          prod.quantityAllocated += element.qty;

                        }
                      });
                    });
                  });
                }
              }

              newElement.indentors.forEach(ind => {
                ind.quantity_left_for_allocation = ind.indent_quantity - ind.allocated_quantity;
              });


            });
            this.dataToShow = this.submittedData;


            this.dataToShow.forEach(variety => {
              variety.indentors.forEach((indentor, i) => {
                const prods = indentor.productions.filter(x => x.quantity > 0)
                indentor.productions = prods
              });
            });

            for (let val of this.dataToShow) {
              let sum = 0;
              for (let value of val.indentors) {
                value['name'] = value.user.name;
                for (let data of value.productions) {

                  value.totalProductionlength = value.productions.length
                  val.totalIndentorlength = val.indentors.length
                  if (val.totalIndentorlength > 1) {

                    val.totalVarietyLength = value.productions.length + val.indentors.length
                  } else {
                    val.totalVarietyLength = value.productions.length
                  }
                  sum += value.productions.length;
                  val.totalproductioIndentliength = sum

                }
              }

            }
            this.dataToDisplay = [];

            for (let data of this.dataToShow) {
              let sum = 0;
              for (let value of data.indentors) {
                sum += value.productions.length;
                data.totalVarietyLength = sum

              }
            }
            this.dataToDisplay = this.dataToShow;
          }
        })
      }
    })
  }

  getLineData2() {
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;


    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    // this.selectedVerietyDetail['variety_id'] = event.value;
    // this.varietyForm.controls['variety_id'].value
    let variety;
    // if(this.verietyListDetails && this.verietyListDetails.varietyforedit && this.verietyListDetails.varietyforedit.length>0){
    //  variety = this.verietyListDetails.varietyforedit.filter(x=>x.m_crop_variety.id== this.editVarietyForm.controls['variety_id'].value[0].value)
    // }
    const param = {
      year: year.value,
      season: season.value,
      crop_code: cropName.value,
      variety_id: this.editVarietyForm.controls['variety_id'].value[0].value,
      variety_line: this.editVarietyForm.controls['variety_line'].value && this.editVarietyForm.controls['variety_line'].value[0] && this.editVarietyForm.controls['variety_line'].value[0].value ? this.editVarietyForm.controls['variety_line'].value[0].value : ''
    }
    this.breederService.postRequestCreator('get-breeder-line-data-for-edit', null, param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.varietyLineedit = res ? res : '';
      if (res && res.length > 0) {
        let object = {
          formData: {
            year: year.value,
            season: season.value,
            crop_code: cropName.value,
            variety_id: this.editVarietyForm.controls['variety_id'].value[0].value,
            variety_line: this.editVarietyForm.controls['variety_line'].value && this.editVarietyForm.controls['variety_line'].value[0] && this.editVarietyForm.controls['variety_line'].value[0].display_text ? this.editVarietyForm.controls['variety_line'].value[0].display_text : ''
          }
        }
        this.breederService.postRequestCreator("allocation/getVarietyDataForEdit", null, object).subscribe((data: any) => {
          this.getFilledVarietyData2(data.EncryptedResponse.data)
        })
        this.selectedVarietyForEdit = [];
        const filledVariety = this.editSubmittedData.find(x => x.variety_id == this.editVarietyForm.controls['variety_id'].value[0].value);


        if (filledVariety) {

          filledVariety.productionCenters.forEach(prod => {
            prod.quantityAllocated = 0;
            filledVariety.indentors.forEach(inden => {
              inden.productions.forEach(ind_prod => {
                if (prod.production_center_id == ind_prod.id) {
                  prod.quantityAllocated += ind_prod.quantity
                }
              });
            })

          });

          this.selectedVerietyDetail = filledVariety;

          if (filledVariety.totalAllocationQuantity >= filledVariety.totalIndentQuantity) {
            this.productionPercentage = 100;
          } else {
            this.productionPercentage = (filledVariety.totalAllocationQuantity / filledVariety.totalIndentQuantity) * 100;
          }

          this.indentors = [];
          this.indentors = filledVariety.indentors;

          this.dataToShow = []
          this.dataToShow.push(JSON.parse(JSON.stringify(filledVariety)));

          this.dataToShow.forEach(variety => {
            variety.indentors.forEach((indentor, i) => {
              const prods = indentor.productions.filter(x => x.quantity > 0)
              indentor.productions = prods
            });
          });

          for (let val of this.dataToShow) {
            let sum = 0;
            for (let value of val.indentors)

              for (let data of value.productions) {

                value.totalProductionlength = value.productions.length
                val.totalIndentorlength = val.indentors.length
                if (val.totalIndentorlength > 1) {

                  val.totalVarietyLength = value.productions.length + val.indentors.length
                } else {
                  val.totalVarietyLength = value.productions.length
                }
                sum += value.productions.length;
                val.totalproductioIndentliength = sum

              }
          }

          this.dataToDisplay = [];
          for (let data of this.dataToShow) {
            let sum = 0;
            for (let value of data.indentors) {
              sum += value.productions.length;
              data.totalVarietyLengths = sum

            }
          }
          this.dataToDisplay = this.dataToShow;
          this.indentorLoad = true

        } else {
          this.breederService.getRequestCreatorNew("allocation-to-indentor-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + this.editVarietyForm.controls['variety_id'].value[0].value).subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {

              const variety = data.EncryptedResponse.data;
              const producionCentersList = []

              variety.productionCenters.forEach(element => {
                if (element && element.quantityProduced > 0) {
                  let temp = {
                    agency_name: element.agency_detail.agency_name,
                    name: element.user.name,
                    value: element.production_center_id,
                    id: element.production_center_id,
                    quantity: 0,

                  }
                  producionCentersList.push(JSON.parse(JSON.stringify(temp)));
                }
              })

              this.indentors = [];

              variety.indentors.forEach(element => {
                element.quantity_left_for_allocation = element.indent_quantity - element.allocated_quantity
                element['productions'] = JSON.parse(JSON.stringify(producionCentersList));
                element['name'] = element.user.name;

                if (this.selectedVarietyForEdit && this.selectedVarietyForEdit.length > 0) {
                  const registerVariety = this.selectedVarietyForEdit.find(x => x.variety_id == this.selectedVerietyDetail.variety_id);
                  if (registerVariety) {
                    const indentorData = registerVariety.indentor.find(y => y.indentor_id == element.user_id);

                    if (indentorData) {
                      const obj = {
                        agency_name: element.agency_detail.agency_name,
                        name: element.user.name ? element.user.name : 'NA',
                        value: element.id,
                        allocated_quantity: element.allocated_quantity,
                        indent_quantity: element.indent_quantity,
                        productions: element.productions,
                        quantity_left_for_allocation: element.quantity_left_for_allocation
                      }

                      this.indentors.push(obj);
                      variety.productionCenters.forEach(prod => {
                        indentorData.productions.forEach(ind_prod => {
                          if (prod.production_center_id == ind_prod.production_center_id) {
                            prod.quantityAllocated += ind_prod.qty
                          }
                        });
                      });

                    }

                  }
                }

              })
              this.indentorLoad = true;
              this.selectedVerietyDetail['indentors'] = variety.indentors
              this.selectedVerietyDetail['productionCenters'] = variety.productionCenters
              this.selectedVerietyDetail['totalIndentQuantity'] = variety.totalIndentQuantity;
              this.selectedVerietyDetail['totalAllocationQuantity'] = variety.totalAllocationQuantity;

              this.selectedVerietyDetail['productionCenters'] = this.selectedVerietyDetail.productionCenters.filter(item => item.quantityProduced > 0)


              if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
                this.productionPercentage = 100;
              } else {
                this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
              }


              this.submittedData = []
              this.submittedData.push(this.selectedVerietyDetail);


              this.dataToShow = this.submittedData;

              this.dataToShow.forEach(variety => {
                variety.indentors.forEach((indentor, i) => {

                  const prods = indentor.productions.filter(x => x.quantity > 0)
                  indentor.productions = prods
                  // indentor.productions.forEach((prod, j) => {
                  //   if (prod && prod.quantity <= 0) {
                  //     indentor.productions.splice(j)
                  //   }
                  // })
                });
              });

              for (let val of this.dataToShow) {
                let sum = 0;
                for (let value of val.indentors)

                  for (let data of value.productions) {

                    value.totalProductionlength = value.productions.length
                    val.totalIndentorlength = val.indentors.length
                    if (val.totalIndentorlength > 1) {

                      val.totalVarietyLength = value.productions.length + val.indentors.length
                    } else {
                      val.totalVarietyLength = value.productions.length
                    }
                    sum += value.productions.length;
                    val.totalproductioIndentliength = sum

                  }
              }
              this.dataToDisplay = [];

              this.dataToDisplay = this.dataToShow;
            }
          })
        }
      }
      else {
        this.selectedVarietyForEdit = [];

        const filledVariety = this.editSubmittedData.find(x => x.variety_id == this.editVarietyForm.controls['variety_id'].value[0].value);
        if (filledVariety) {

          filledVariety.productionCenters.forEach(prod => {
            prod.quantityAllocated = 0;
            filledVariety.indentors.forEach(inden => {
              inden.productions.forEach(ind_prod => {
                if (prod.production_center_id == ind_prod.id) {
                  prod.quantityAllocated += ind_prod.quantity
                }
              });
            })

          });

          this.selectedVerietyDetail = filledVariety;

          if (filledVariety.totalAllocationQuantity >= filledVariety.totalIndentQuantity) {
            this.productionPercentage = 100;
          } else {
            this.productionPercentage = (filledVariety.totalAllocationQuantity / filledVariety.totalIndentQuantity) * 100;
          }

          this.indentors = [];
          this.indentors = filledVariety.indentors;

          this.dataToShow = []
          this.dataToShow.push(JSON.parse(JSON.stringify(filledVariety)));
          this.dataToShow.forEach(variety => {
            variety.indentors.forEach((indentor, i) => {
              const prods = indentor.productions.filter(x => x.quantity > 0)
              indentor.productions = prods
            });
          });

          for (let val of this.dataToShow) {
            let sum = 0;
            for (let value of val.indentors)

              for (let data of value.productions) {

                value.totalProductionlength = value.productions.length
                val.totalIndentorlength = val.indentors.length
                if (val.totalIndentorlength > 1) {

                  val.totalVarietyLength = value.productions.length + val.indentors.length
                } else {
                  val.totalVarietyLength = value.productions.length
                }
                sum += value.productions.length;
                val.totalproductioIndentliength = sum

              }
          }

          this.dataToDisplay = [];
          for (let data of this.dataToShow) {
            let sum = 0;
            for (let value of data.indentors) {
              sum += value.productions.length;
              data.totalVarietyLengths = sum

            }
          }
          this.dataToDisplay = this.dataToShow;
          this.indentorLoad = true

        } else {
          this.breederService.getRequestCreatorNew("allocation-to-indentor-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + this.editVarietyForm.controls['variety_id'].value[0].value).subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {

              const variety = data.EncryptedResponse.data;
              const producionCentersList = []

              variety.productionCenters.forEach(element => {
                if (element && element.quantityProduced > 0) {
                  let temp = {
                    agency_name: element.agency_detail.agency_name,
                    name: element.user.name,
                    value: element.production_center_id,
                    id: element.production_center_id,
                    quantity: 0,

                  }
                  producionCentersList.push(JSON.parse(JSON.stringify(temp)));
                }
              })

              this.indentors = [];

              variety.indentors.forEach(element => {
                element.quantity_left_for_allocation = element.indent_quantity - element.allocated_quantity
                element['productions'] = JSON.parse(JSON.stringify(producionCentersList));
                element['name'] = element.user.name;

                if (this.selectedVarietyForEdit && this.selectedVarietyForEdit.length > 0) {
                  const registerVariety = this.selectedVarietyForEdit.find(x => x.variety_id == this.selectedVerietyDetail.variety_id);
                  if (registerVariety) {
                    const indentorData = registerVariety.indentor.find(y => y.indentor_id == element.user_id);

                    if (indentorData) {
                      const obj = {
                        agency_name: element.agency_detail.agency_name,
                        name: element.user.name ? element.user.name : 'NA',
                        value: element.id,
                        allocated_quantity: element.allocated_quantity,
                        indent_quantity: element.indent_quantity,
                        productions: element.productions,
                        quantity_left_for_allocation: element.quantity_left_for_allocation
                      }

                      this.indentors.push(obj);
                      variety.productionCenters.forEach(prod => {
                        indentorData.productions.forEach(ind_prod => {
                          if (prod.production_center_id == ind_prod.production_center_id) {
                            prod.quantityAllocated += ind_prod.qty
                          }
                        });
                      });

                    }

                  }
                }

              })
              this.indentorLoad = true;
              this.selectedVerietyDetail['indentors'] = variety.indentors
              this.selectedVerietyDetail['productionCenters'] = variety.productionCenters
              this.selectedVerietyDetail['totalIndentQuantity'] = variety.totalIndentQuantity;
              this.selectedVerietyDetail['totalAllocationQuantity'] = variety.totalAllocationQuantity;

              this.selectedVerietyDetail['productionCenters'] = this.selectedVerietyDetail.productionCenters.filter(item => item.quantityProduced > 0)


              if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
                this.productionPercentage = 100;
              } else {
                this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
              }


              this.submittedData = []
              this.submittedData.push(this.selectedVerietyDetail);


              this.dataToShow = this.submittedData;

              this.dataToShow.forEach(variety => {
                variety.indentors.forEach((indentor, i) => {

                  const prods = indentor.productions.filter(x => x.quantity > 0)
                  indentor.productions = prods
                  // indentor.productions.forEach((prod, j) => {
                  //   if (prod && prod.quantity <= 0) {
                  //     indentor.productions.splice(j)
                  //   }
                  // })
                });
              });

              for (let val of this.dataToShow) {
                let sum = 0;
                for (let value of val.indentors)

                  for (let data of value.productions) {

                    value.totalProductionlength = value.productions.length
                    val.totalIndentorlength = val.indentors.length
                    if (val.totalIndentorlength > 1) {

                      val.totalVarietyLength = value.productions.length + val.indentors.length
                    } else {
                      val.totalVarietyLength = value.productions.length
                    }
                    sum += value.productions.length;
                    val.totalproductioIndentliength = sum

                  }
              }
              this.dataToDisplay = [];

              this.dataToDisplay = this.dataToShow;
            }
          })
        }
      }

    })
  }
}
