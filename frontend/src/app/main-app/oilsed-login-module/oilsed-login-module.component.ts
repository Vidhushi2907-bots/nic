import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { SumPipe } from '../pipe/sum.pipe';
import { jsPDF } from "jspdf";
import { MasterService } from 'src/app/services/master/master.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-oilsed-login-module',
  templateUrl: './oilsed-login-module.component.html',
  styleUrls: ['./oilsed-login-module.component.css']
})

export class OilsedLoginModuleComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropGroupData;
  statename = [];
  identor = [];
  ngForm!: FormGroup;
  seasonList: any = [];
  response_crop_group: any = [];
  data: any;
  data1: any;
  search = true;
  custom_array: any[];
  finalData: any[];
  fileName = 'submit-indents-breeder-seeds.xlsx';
  yearOfIndent: any = [
    // {name: "2025 - 2026", "value": "2025"},
    // {name: "2024-25", "value": "2024"},
    // {name: "2023-24", "value": "2023"},
    // {name: "2022-23", "value": "2022"},
    // {name: "2021-22", "value": "2021"},
    // { name: "2020 - 2021", "value": "2020" }
  ];
  year: any;
  season: any;
  crop: any;
  isSearch: boolean = false;
  @ViewChild('content') content: ElementRef;
  todayData = new Date();
  tableId: any[];
  vals: any;
  cropName: any;
  crop_group: any;
  crop_name: any;
  filterSeason: any;

  defaultValue1;
  // values2 = ['A0401'];
  // defaultValue2 = this.values2[0];
  // defYear = [(new Date()).getFullYear()];
  // values2 = ['A0107'];
  values2 = [];

  defaultValue2;
  defYear = [2024];
  // defualtSeason = 'K'
  defualtSeason = ''

  defaultYear = this.defYear[0];
  submitted: boolean = false;
  filterCropGroup: any;
  filterCropName: any;
  unit: string;
  name = "ghg";
  studentArray = [
    { id: 1, fees: 5000 },
    { id: 2, fees: 2000 },
    { id: 3, fees: 2000 },
    { id: 4, fees: 100 }
  ];
  indentername: any;
  is_freeze: any[];
  searchValue = true;
  cropNameList: any;
  noOneRemaining: boolean = false;
  selectedYear;
  is_search: boolean = false;
  isSearchMsg: any;
  searchBtn: boolean = false;
  is_freezeIndenter: any;

  tempPageData: any;
  pageData: any;
  checkFreeze: any;
  totalIndentor: any;
  totalIndentorQunatity: any;
  freezeTimeLine: boolean = true;
  freezTimeLineData: any;
  // filterSeason: any;
  customWidth = 510
  customHeight = 600
  totalRowofIndentor: { short_name: string; sum: unknown; }[];
  totalSum: number;
  is_freezeData = false;
  isforwardData: boolean;
  isFreeze: any[];
  isForward: any[];
  constructor(private breederService: BreederService, private fb: FormBuilder, private service: SeedServiceService, private router: Router, private masterService: MasterService) {
    this.createEnrollForm();
    // document.getElementById('searchData').click();
  }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_group: ['A04'],
      crop_name: ['', [Validators.required]],
      year: ['', [Validators.required]],
      season: ['', [Validators.required]]

    });
    this.ngForm.controls['crop_name'].disable();
    this.ngForm.controls['crop_group'].disable();
    this.ngForm.controls['season'].disable();

    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {

        this.getSeasonData(newValue);
        this.ngForm.controls['season'].enable()
        this.ngForm.controls['crop_group'].setValue('')
        this.ngForm.controls['season'].setValue('')
        this.ngForm.controls['crop_name'].setValue('')

      }
    });
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getCropNameList('A04');
        this.ngForm.controls['crop_name'].enable()
        this.getCroupCroupList(newValue)
        this.defaultValue2 = ''
        this.ngForm.controls['crop_group'].enable()
        // this.ngForm.controls['crop_name'].setValue('')
        this.searchValue = false;

      }
    });

    this.ngForm.controls['crop_group'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.search = false

        this.getCropNameList(newValue);
        this.ngForm.controls['crop_name'].enable()
        this.defaultValue2 = ''

        this.searchValue = false

      }
    });
    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.search = true
        // this.searchValue = false
      }
    });
  }
  ngOnInit(): void {
    // window.onload = function () {
    //   document.getElementById('searchData').click();
    // };
    // localStorage.setItem('logined_user', "Seed");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    // this.Submit(this.ngForm);

    // this.submitindentor();
    if (this.is_search == false) {
      this.isSearchMsg = "Please Select Filter."
    }
    // this.shortStatename();
    // this.shortIndenterame();

    // const searchFilters = {
    //   "year":this.defaultYear,
    //   "group_code":this.defaultValue1,
    //   "crop_code":this.defaultValue2
    // };
    // this.submitindentor(1, searchFilters);

    this.getYearOfIndent();

  }

  printPageArea(areaID) {
    var printContent = document.getElementById(areaID).innerHTML;
    var originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  }

  getFreezTimeLineData() {
    let season;
    if (this.ngForm.controls['season'].value == "K") {
      season = "Kharif";
    } else {
      season = "Rabi";
    }
    const param = {
      search: {
        year_of_indent: parseInt(this.ngForm.controls['year'].value),
        season_name: season,
        activitie_id: 3
      }
    }
    let route = "freeze-timeline-filter";
    this.masterService.postRequestCreator(route, null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        this.freezTimeLineData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        console.log('this.freezTimeLineData====', this.freezTimeLineData);
      }
      let date = this.freezTimeLineData && this.freezTimeLineData[0] && this.freezTimeLineData[0].end_date;
      let startDate = this.freezTimeLineData && this.freezTimeLineData[0] && this.freezTimeLineData[0].start_date;

      let endDateInput = formatDate(date, 'yyyy-MM-dd', 'en_US')
      let startDateInput = formatDate(startDate, 'yyyy-MM-dd', 'en_US')

      console.log('dateInput=====', endDateInput);

      let date1 = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
      console.log('date1 today', date1);
      if (date) {
        if (startDateInput <= date1 && endDateInput >= date1) {
          // alert('Hii');
          this.freezeTimeLine = true;
        } else {
          // alert('bye');
          this.freezeTimeLine = false;
        }
      }
    });
  }

  async getCropNameList(newValue) {


    if (1) {
      const searchFilters = {
        "search": {
          "type": "oil-seed",
          "is_freez": 0,
          // "group_code": newValue,
          "year": this.ngForm.controls["year"].value,
          "season": this.ngForm.controls["season"].value,
        }
      };
      this.breederService.postRequestCreator("get-received-indents-of-breeder-seeds-crop-name", null, searchFilters).subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.data.length > 0) {
            this.cropName = apiResponse.EncryptedResponse.data.data;
            this.cropNameList = apiResponse.EncryptedResponse.data.data;

            this.defaultValue2 = this.cropName[0].crop_code;
            if (this.searchValue) {

              this.ngForm.controls["crop_name"].patchValue(this.cropName[0].crop_code)
            }


            if (this.searchValue) {
              const searchFilters = {
                "year": this.yearOfIndent && this.yearOfIndent[0] && this.yearOfIndent[0].year ? this.yearOfIndent[0].year : '',
                "group_code": this.response_crop_group && this.response_crop_group[0] && this.response_crop_group[0]['m_crop_group.group_code'] ? this.response_crop_group[0]['m_crop_group.group_code'] : 'A04',
                "crop_code": this.cropName && this.cropName[0] && this.cropName[0].crop_code ? this.cropName[0].crop_code : "",
                "season": this.seasonList && this.seasonList[0] && this.seasonList[0].season ? this.seasonList[0].season : ''
              };

              this.submitindentor(1, searchFilters);
            }


            // this.ngForm.controls["crop_name"].setValue(this.cropName[0].crop_code)
            //  if(this.searchValue){

            //  }

          } else {
            this.cropName = []
          }
        } else {
          this.cropName = []
        }
      });
    }

  }

  Submit(formData) {
    console.log(formData)
    if (formData && formData.valid) {
      const object = {
        "year": Number(formData.value.year),
        "season": formData.value.season,
        "crop_code": formData.value.crop_name,
        "group_code": 'A04',
        'user_type': "seed-division"
      };

      this.selectedYear = parseInt(this.ngForm.controls['year'].value);

      const groupName = this.response_crop_group.filter(x => {
        return x['m_crop_group.group_code'] == 'A04';
      });
      this.filterCropGroup = groupName[0].group_name;
      this.filterSeason = formData.value.season

      const cropName = this.cropName.filter(x => {
        return x.crop_code == this.ngForm.controls['crop_name'].value;
      });
      this.filterCropName = cropName[0]['m_crop.crop_name'];

      let displayData = [];
      this.checkFreeze = [];
      this.tableId = []
      this.breederService.postRequestCreator("getUniqueIndentorOfBreederSeeds", null, { 'filters': object }).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
          this.totalIndentor = data.EncryptedResponse.data.sort((a, b) => a['user.agency_detail.short_name'].toLowerCase() > b['user.agency_detail.short_name'].toLowerCase() ? 1 : -1);
          // this.printPageArea('excel-table')

          this.breederService.postRequestCreator("get-data-for-recieved-indent-second", null, { 'filters': object }).subscribe((data: any) => {
            this.is_search = true;
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
              this.tempPageData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
              let items = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
              const transformedData = items.map(item => {
                const allEmpty = item.variety.every(varietyItem => varietyItem.line_variety_code === "");
                if (allEmpty) {
                  const mergedBspc = [];
                  item.variety.forEach(varietyItem => {
                    mergedBspc.push(...varietyItem.bspc);
                  });
                  return {
                    ...item,
                    variety: [{
                      line_variety_name: "",
                      line_variety_code: "",
                      bspc: mergedBspc
                    }]
                  };
                } else {
                  return item;
                }
              });
              this.tempPageData = transformedData;
              for (let item of this.totalIndentor) {
                item['short_name'] = item['user.agency_detail.short_name']
              }

              if (this.tempPageData && this.tempPageData.length > 0) {
                this.tempPageData.forEach((el, i) => {
                  el.allData = [];
                  el.allData2 = []
                })
                this.tempPageData.forEach((obj1, i) => {

                  obj1.variety.forEach((el, index) => {
                    console.log(el, 'pageData')
                    // if(el.line_variety_code){
                    this.totalIndentor.forEach(obj2 => {
                      if (!el.bspc.some(bspc => bspc.short_name === obj2['user.agency_detail.short_name'])) {
                        el.bspc.push({
                          "indent_quantity": null,
                          "short_name": obj2.short_name,
                          "qty": null,
                          "variety_code_line": null
                        })
                      }
                    })
                    // }

                  })


                });
                // Iterate through array1             
                this.tempPageData.forEach((el, i) => {
                  el.variety.forEach((item) => {
                    if (item && !item.line_variety_code && item.line_variety_code == '') {
                      let sum = 0
                      item.bspc.forEach((val) => {
                        sum += val && val.indent_quantity ? parseFloat(val.indent_quantity) : 0
                        val.total_qty = sum;
                        item.total_qty = sum
                      })
                    } else {
                      let sum = 0
                      item.bspc.forEach((val) => {
                        sum += val && val.qty ? (parseFloat(val.qty)) : 0;
                        val.total_qty = sum;
                        item.total_qty = sum
                      })
                    }

                  })
                });
                this.tempPageData.forEach((el, i) => {
                  el.variety.forEach((item) => {
                    el.allData2.push(...item.bspc)
                    item.bspc = item.bspc.sort((a, b) => a.short_name.localeCompare(b.short_name));
                  })
                });
                this.tempPageData.forEach((el, i) => {
                  el.totalLength = el.allData.length;
                  el.totalLength2 = el.allData2.length;
                })
              }

              this.pageData = this.tempPageData;


              let allDataValue = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.allData ? data.EncryptedResponse.data.allData : '';

              if (allDataValue && allDataValue.length > 0) {
                let isFreeze = [];
                let isForward = [];
                allDataValue.forEach(obj => {
                  this.tableId.push(obj.id)
                  // Check if is_freeze column is 0
                  if (obj.is_freeze === 0) {
                    isFreeze.push(0)
                    // Update isFreeze to true
                    // this.is_freezeData = false;
                  } else if (obj.is_freeze === 1) {
                    // Update isFreeze to false
                    // this.is_freezeData = true;
                  }
                  if ((isFreeze && isFreeze.length < 1) && (obj.is_forward === 0)) {
                    // Update isFreeze to true
                    isForward.push(0)
                    // this.isforwardData = true;
                  } else if (obj.is_forward === 1) {
                    // Update isFreeze to false

                    // this.isforwardData = false;
                  }
                  this.isFreeze = isFreeze;
                  this.isForward = isForward;
                  // Remove the original is_freeze field
                  // delete obj.is_freeze;
                });
                let sumMap = {};
                allDataValue.forEach(item => {
                  if (item.line_variety_code === null || item.line_variety_code === "") {
                    sumMap[item.short_name] = (sumMap[item.short_name] || 0) + item.indent_quantity;
                  } else {
                    sumMap[item.short_name] = (sumMap[item.short_name] || 0) + item.qty;
                  }
                });
                const sumArray2 = Object.entries(sumMap).map(([key, value]) => ({ short_name: key, sum: value }));
                let resultArray = [];
                if (this.totalIndentor && this.totalIndentor.length > 0) {
                  if (sumArray2 && sumArray2.length > 0) {

                    this.totalIndentor.forEach(firstObj => {
                      let found = sumArray2.find(secondObj => secondObj.short_name == firstObj.short_name);
                      if (found) {
                        resultArray.push(found);
                      } else {
                        resultArray.push({ short_name: firstObj.short_name, sum: 0 });
                      }
                    });
                  }
                }

                console.log(this.pageData, 'this.pageData');
                sumArray2.sort((a, b) => a.short_name.localeCompare(b.short_name));
                this.totalRowofIndentor = sumArray2;

                const totalSum = sumArray2.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.sum), 0);
                this.totalSum = totalSum;
              }

            }
          })
        }
      })


    } else {
      Swal.fire('Error', 'Please Select all Fields', 'error');
      return;
    }
  }

  getTotalIndentQuantity() {
    if (this.pageData && this.pageData.length > 0) {
      let quantity = 0;
      this.pageData.forEach(element => {
        quantity += element.total_indent_quantity;
      });

      return quantity;

    } else {
      return 0
    }
  }

  getUnit() {
    const crop_code = this.ngForm.controls['crop_name'].value;

    if (crop_code[0] == 'A') {
      return 'Quintal'
    } else {
      return 'Kg'
    }

  }

  cropGroup(data: string) { { } }
  async shortStatename() {
    const route = 'get-state-list';
    const result = await this.breederService.getRequestCreatorNew(route).subscribe((data: any) => {
      this.statename = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';


    })
  }
  async shortIndenterame(searchData: any | undefined = undefined) {
    const route = 'get-short-indenter-name';
    const result = await this.breederService.postRequestCreator(route, null, {
      search: searchData,
      is_freeze: 0,
      icar_freeze: 0
    }).subscribe((data: any) => {
      this.indentername = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    })
  }

  async submitindentor(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    const route = 'submit-indents-breeder-seeds-list';
    const result = await this.breederService.postRequestCreator(route, null, {
      search: searchData,
      is_freeze: 0,
      type: "seed"
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.identor = apiResponse.EncryptedResponse.data;
        console.log(this.identor)
        this.data1 = apiResponse.EncryptedResponse.data;
        if (this.identor.length <= 0) {
          this.noOneRemaining = true;
        } else {
          this.noOneRemaining = false;
        }
        this.custom_array = [];

        // arr = arr.data
        let varietyId = [];
        let is_freeze = [];

        let is_freezeIndenter = [];
        // let units = [];
        for (let value of this.identor) {
          varietyId.push(value && value.m_crop_variety && value.m_crop_variety.variety_name ? value.m_crop_variety.variety_name : '');
          if (value.is_freeze == 0) {
            is_freeze.push(0);
          }
          if (1 || value.user.agency_detail.indent_of_spa.is_freeze == 1) {
            is_freezeIndenter.push(1);
          }
        }
        this.is_freeze = is_freeze;
        this.is_freezeIndenter = is_freezeIndenter;
        varietyId = [...new Set(varietyId)]
        let newObj = [];
        let i = 0;
        for (let value of varietyId) {
          let keyArr = [];
          let unit = [];
          for (let val of this.identor) {
            if (val.m_crop_variety.variety_name == value) {
              let state = val.user.agency_detail.short_name;
              keyArr.push({ "indent_short_name": state, 'value': parseFloat(val.indent_quantity).toFixed(2) });
              // keyArr.push({ state: state });
            }
            if (val.m_crop_variety && val.m_crop_variety.variety_code && (val.m_crop_variety.variety_code).slice(0, 1) == 'A') {
              unit.push('Quintal');
            } else if (val.m_crop_variety && val.m_crop_variety.variety_code && (val.m_crop_variety.variety_code).slice(0, 1) == 'H') {
              unit.push('Kg');
            }
          }
          let variety_id = (value).toString();
          newObj.push({ "variety_id": value, 'data': keyArr, "unit": unit[i] });
          i++;
        }
        this.finalData = newObj;
        this.tableId = [];
        for (let id of this.identor) {
          this.tableId.push(id.id);
        }
        const results = this.identor.filter(element => {
          if (Object.keys(element).length !== 0) {
            return true;
          }
          return false;
        });
        if (this.identor === undefined) {
          this.identor = [];
        }
        // let data =[];
        const removeEmpty = (obj) => {
          Object.entries(obj).forEach(([key, val]) =>
            (val && typeof val === 'object') && removeEmpty(val) ||
            (val === null || val === "") && delete obj[key]
          );
          return obj;
        };
        removeEmpty(this.identor)
        this.filterPaginateSearch.Init(results, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count);
        // this.initSearchAndPagination();
      }

    });
  }

  freeze() {
    Swal.fire({
      title: 'Are You Sure to Freeze ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const searchFilters = {
          "search": {
            "id": this.tableId
          }
        };
        const route = "freeze-indent-breeder-seed-data";
        this.service.postRequestCreator(route, null, searchFilters).subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            Swal.fire({
              icon: "success",
              title: "Freeze Indent",
              // title: "Indented Quantity For " + this.filterCropName + " Has Been Forwarded To Nodal Officer (ICAR).",
              position: "center",
              // width: "10% 10%",
              showConfirmButton: false,
              showCancelButton: false,
              timer: 2000
            }).then(x => {

              // this.forwardIndent()
              // location.reload();
              document.getElementById('searchData').click();
            })
          }
          else {
            Swal.fire({
              title: '<p style="font-size:25px;">An Error Occured.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            })
          }
        });
      }
    })
  }
  forwardIndent() {
    Swal.fire({
      title: 'Are You Sure to Send the Indent to ICAR/Nodal Agency?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const searchFilters = {
          "search": {
            "id": this.tableId
          }
        };
        const route = "freeze-indent-breeder-seed-data-forward";
        this.service.postRequestCreator(route, null, searchFilters).subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            Swal.fire({
              icon: "success",
              title: "Indented Quantity For " + this.filterCropName + " Has Been Forwarded To Nodal Officer (ICAR).",
              position: "center",
              // width: "10% 10%",
              showConfirmButton: false,
              showCancelButton: false,
              timer: 2000
            }).then(x => {
              // location.reload();
              document.getElementById('searchData').click();
            })
          }
          else {
            Swal.fire({
              title: '<p style="font-size:25px;">An Error Occured.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            })
          }
        });
      }
    })
  }
  getSeasonData(value) {
    const route = "get-received-indents-of-breeder-seeds-season";
    const param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "type": "oil-seed",
        "is_freeze": 0,
      }
    }
    const result = this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
    })
  }
  getYearOfIndent() {
    const route = "get-received-indents-of-breeder-seeds-year";
    const result = this.breederService.postRequestCreator(route, null, {
      search: {
        "type": "oil-seed",
        "is_freeze": 0,
      }
    }).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
      this.yearOfIndent = this.yearOfIndent.sort((a, b) => b.year - a.year)
    })
  }
  getCroupCroupList(value) {
    const route = "get-received-indents-of-breeder-seeds-crop-group";
    const param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
        "type": "oil-seed",
        "is_freeze": 0,
      }
    }
    const result = this.breederService.postRequestCreator(route, null, param).subscribe((data: any) => {
      this.response_crop_group = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
    });
  }


  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-tables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  download() {
    const name = 'submit-indents-breeder-seeds';
    const element = document.getElementById('excel-table');
    // console.log("this.customHeight, this.customWidth", this.customHeight, this.customWidth)
    // console.log("this.1111111111111", customWidth, customHeight)

    // console.log("total ind", this.totalIndentor)
    let countIndenter = this.totalIndentor.length;
    // console.log("total ind", countIndenter)          
    // countIndenter = 25
    // let pageSize = 'a6'
    // 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6': ISO paper sizes.
    if (countIndenter <= 5) {
      // pageSize = 'a2';
      // customWidth , customHeight
      const options = {
        margin: 10,
        filename: `${name}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          dpi: 192,
          scale: 1,
          letterRendering: true,
          useCORS: true
        },
        // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
        // jsPDF: {
        //   unit: 'mm',
        //   format: 'a3',
        //   orientation: 'landscape'
        // },
        jsPDF: { unit: 'mm', format: [450, 1600], orientation: 'portrait' }
      };
      html2PDF().set(options).from(element).toPdf().save();
    } else
      if (countIndenter > 5 && countIndenter <= 10) {
        // pageSize = 'a2';
        // customWidth , customHeight
        const options = {
          margin: 10,
          filename: `${name}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            dpi: 192,
            scale: 1,
            letterRendering: true,
            useCORS: true
          },
          // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
          jsPDF: { unit: 'mm', format: [550, 1600], orientation: 'portrait' }
        };
        html2PDF().set(options).from(element).toPdf().save();
      } else if (countIndenter > 10 && countIndenter <= 15) {
        // pageSize = 'a1';
        this.customWidth = 750
        this.customHeight = 600
        alert("sadsd")
        const options = {
          margin: 10,
          filename: `${name}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            dpi: 192,
            scale: 1,
            letterRendering: true,
            useCORS: true
          },
          // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
          jsPDF: { unit: 'mm', format: [750, 1600], orientation: 'portrait' }
        };
        html2PDF().set(options).from(element).toPdf().save();
      } else if (countIndenter > 15 && countIndenter <= 25) {
        // pageSize = 'a0';     
        // this.customWidth = 1400
        // this.customHeight = 600
        const options = {
          margin: 10,
          filename: `${name}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            dpi: 192,
            scale: 1,
            letterRendering: true,
            useCORS: true
          },
          // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
          jsPDF: { unit: 'mm', format: [1200, 1600], orientation: 'portrait' }
        };
        html2PDF().set(options).from(element).toPdf().save();
      } else if (countIndenter > 25 && countIndenter <= 35) {
        // this.customWidth = 1600
        // this.customHeight = 600
        const options = {
          margin: 10,
          filename: `${name}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            dpi: 192,
            scale: 1,
            letterRendering: true,
            useCORS: true
          },
          // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
          jsPDF: { unit: 'mm', format: [1600, 1600], orientation: 'portrait' }
        };
        html2PDF().set(options).from(element).toPdf().save();

      } else {
        // this.customWidth = 2000
        // this.customHeight = 600
        const options = {
          margin: 10,
          filename: `${name}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            dpi: 192,
            scale: 1,
            letterRendering: true,
            useCORS: true
          },
          // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
          jsPDF: { unit: 'mm', format: [2600, 1600], orientation: 'portrait' }
        };
        html2PDF().set(options).from(element).toPdf().save();

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

  submoitData() {

  }

  clear() {
    this.is_search = false;
    this.ngForm.controls["year"].setValue("");
    this.ngForm.controls["crop_group"].setValue("");
    this.ngForm.controls["season"].setValue("");
    this.ngForm.controls["crop_name"].setValue("");
    this.ngForm.controls['crop_name'].disable();
    this.ngForm.controls['crop_group'].disable();
    this.ngForm.controls['season'].disable();
    this.finalData = [];
  }

  getFixedData(data) {
    let value = data.toString();

    if (value.indexOf(".") == -1) {
      return data;

    } else {

      return data ? Number(data).toFixed(2) : 0;

    }
  }
  getNotificationYear(year) {
    let not_year = year ? year.getYear() : 'Na'
    return not_year ? not_year : 'Na'
  }
  getMergeData(data) {
    const mergedData = {};

    data.forEach(obj => {
      if (!mergedData[obj.variety_code]) {
        mergedData[obj.variety_code] = { ...obj };
        mergedData[obj.variety_code].parental_data = [];
      }

      if (obj.parental_data.length > 0) {
        mergedData[obj.variety_code].parental_data.push(...obj.parental_data);
      }
    });

    const result = Object.values(mergedData);
    return result
  }
  getQty(item) {
    console.log('item======>', item);
    console.log('totalIndentor======>', this.totalIndentor);

  }
  formatNumber(num) {
    // Check if the input is a number
    if (typeof num === 'number' && !isNaN(num)) {
      // If it's a number, use the toFixed() method to format it with 2 decimal places
      return num.toFixed(2);
    } else {
      // If it's not a number, return an error message or handle it as needed
      return 'Invalid input';
    }
  }
}



