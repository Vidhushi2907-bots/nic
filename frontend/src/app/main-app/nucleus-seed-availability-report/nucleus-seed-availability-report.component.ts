
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
// import { AddSeedTestingLaboratorySearchComponent } from 'src/app/common/add-seed-testing-laboratory-search/add-seed-testing-laboratory-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
// import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
// import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';

import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-nucleus-seed-availability-report',
  templateUrl: './nucleus-seed-availability-report.component.html',
  styleUrls: ['./nucleus-seed-availability-report.component.css']
})

export class NucleusSeedAvailabilityReportComponent implements OnInit {
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
  custom_array: any[];
  finalData: any[];
  fileName = 'nucleus-seed-availability-report.xlsx';
  yearOfIndent: any = [];
  cropData: any = [];
  year: any;
  season: any;
  crop: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  allData: any;
  seasonData: any;
  cropName: any;
  bspcNameData: any;
  bspcVarietData: any;
  nucleusCropData: any;
  selected_variety_name;
  exportdata: any[];
  selected_bsp_name;
  selected_crop;
  bspcNameDataSecond: any;
  nucleusCropDatasecond: any;
  bspcVarietDataSecond: any;
  user_type: any;
  cropTypeList: any;
  constructor(private breederService: BreederService,
    private fb: FormBuilder,
    private service: SeedServiceService,
    private router: Router,
    private productionCenterService: ProductioncenterService) {
    this.createEnrollForm();

  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop: [''],
      year: [''],
      unitKgQ: ['1'],
      season_value: [''],
      bspcName: [''],
      variety: [''],
      bspc_text: [''],
      crop_text: [''],
      variety_text: [''],
      crop_type: [''],


    });
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {

        this.getSeason()
        this.selected_bsp_name = '';
        this.ngForm.controls['bspcName'].setValue('')
        this.ngForm.controls['crop'].setValue('')
        this.ngForm.controls['variety'].setValue('')
        this.selected_crop = '';
        this.selected_variety_name = '';


      }
    })


    this.ngForm.controls['season_value'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // getCropType
        if (this.ngForm.controls['unitKgQ'].value == 2) {

          this.getCropType()
        } else {
          this.getNucleusName(newValue)
        }


      }
    })
    // this.ngForm.controls['unitKgQ'].valueChanges.subscribe(newValue => {
    //   if (newValue == '2') {
    //     this.getSeason()

    //   }
    // })
    this.ngForm.controls['crop'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getVarietyName(newValue)

        this.ngForm.controls['variety'].setValue('')

        this.selected_variety_name = '';

      }
    })
    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        if (this.ngForm.controls['unitKgQ'].value == 2) {

          this.getNucleusCropName(newValue)

        }


        this.ngForm.controls['crop'].setValue('')
        this.ngForm.controls['variety'].setValue('')
        this.selected_crop = '';
        this.selected_variety_name = '';

      }
    })
    this.ngForm.controls['bspc_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log('newValue=======>', newValue)
        this.bspcNameData = this.bspcNameDataSecond
        let response = this.bspcNameData.filter(x => x.breeder_production_centre_name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.bspcNameData = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getNucleusName(this.ngForm.controls['season_value'].value)
      }
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log('newValue=======>', newValue)
        this.nucleusCropData = this.nucleusCropDatasecond
        let response = this.nucleusCropData.filter(x => x['m_crop.crop_name'].toLowerCase().startsWith(newValue.toLowerCase()))

        this.nucleusCropData = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getNucleusCropName(this.ngForm.controls['bspcName'].value)
      }
    });
    this.ngForm.controls['variety_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log('newValue=======>', newValue)
        this.bspcVarietData = this.bspcVarietDataSecond
        let response = this.bspcVarietData.filter(x => x['m_crop_variety.variety_name'].toLowerCase().startsWith(newValue.toLowerCase()))

        this.bspcVarietData = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getVarietyName(this.ngForm.controls['crop'].value)
      }
    });

  }
  ngOnInit(): void {
    // localStorage.setItem('logined_user', "Seed");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    this.user_type = data.user_type

    this.getYear();
    // this.getPageData();
    this.runExcelApi();
    if (this.ngForm.controls['unitKgQ'].value == 2) {

      this.getSeason()
    }
  }

  getYear() {
    this.productionCenterService.postRequestCreator("getNucleusSeedAvailabilityYearsforReports", {
      search: {
        user_type: this.user_type,
        type: 'report_icar'
      }
    }).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.yearOfIndent = data.EncryptedResponse.data;
        this.yearOfIndent = this.yearOfIndent.sort((a, b) => b.year - a.year)
      }
    })
  }

  getSeason() {
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        user_type: this.user_type,
        type: 'report_icar'

      }
    }
    this.productionCenterService.postRequestCreator("getNucleusSeedAvailabilityforReportsSeason", param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows) {
        this.seasonData = data.EncryptedResponse.data.rows;
        this.seasonData = this.seasonData.filter((arr, index, self) =>
          index === self.findIndex((t) => (t['season'] === arr['season'])))


      }
    })
  }
  getCropType() {
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season_value'].value,
        user_type: this.user_type,
        type: 'report_icar'

      }
    }
    this.productionCenterService.postRequestCreator("getNucleusSeedCropType", param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.cropTypeList = data.EncryptedResponse.data;
        this.cropTypeList = this.cropTypeList.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.crop_type === arr.crop_type)))
        console.log(this.cropTypeList, 'cropTypeList')



      }
    })
  }
  getNucleusName(newValue) {
    const param = {
      search: {
        season: newValue,
        year: this.ngForm.controls['year'].value,
        user_type: this.user_type,
        type: 'report_icar'
      }
    }
    this.productionCenterService.postRequestCreator("getNucleusSeedAvailabilityforReportsName", param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows) {
        this.bspcNameData = data.EncryptedResponse.data.rows;
        this.bspcNameData = this.bspcNameData.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.breeder_production_centre_name === arr.breeder_production_centre_name)))
        this.bspcNameDataSecond = this.bspcNameData



        console.log('bspcNameData', this.bspcNameData)


      }
    })
  }
  getNucleusCropName(newValue) {
    const param = {
      search: {
        crop_type: newValue ? newValue.substring(0, 1) : '',
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season_value'].value,
        user_type: this.user_type,
        type: 'report_icar'
      }
    }
    this.productionCenterService.postRequestCreator("getNucleusSeedAvailabilityforReportsCroptName", param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows) {
        this.nucleusCropData = data.EncryptedResponse.data.rows
        this.nucleusCropDatasecond = this.nucleusCropData
      }
    })
  }
  getVarietyName(newValue) {
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season_value'].value,

        crop_code: this.ngForm.controls['crop'].value
      }
    }
    this.productionCenterService.postRequestCreator("getNucleusSeedAvailabilityforReportsVarieytName", param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows) {
        this.bspcVarietData = data.EncryptedResponse.data.rows
        this.bspcVarietDataSecond = this.bspcVarietData
      }
    })
  }
  getCrop(year: any) {
    this.ngForm.controls['crop'].patchValue("");
    if (year && year.length > 0) {
      this.cropData = [];
      var object = {
        year: year
      }
      this.productionCenterService.postRequestCreator("getNucleusSeedAvailabilityCropforReports", object).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
          this.cropData = data.EncryptedResponse.data;
        }
      })
    }
    else {
      this.cropData = []
    }
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

    searchData = {
      isSearch: false,
      unitKgQ:this.ngForm.controls['unitKgQ'].value
    }


    this.productionCenterService
      .postRequestCreator("getNucleusSeedAvailabilityforReports", {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        searchData: searchData
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          this.allData = apiResponse.EncryptedResponse.data.rows;
          if (this.allData === undefined) {
            this.allData = [];
          }
          console.log(this.allData)
          this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
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

  submit(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    
    if(this.ngForm.controls['unitKgQ'].value==2){

      if ((!this.ngForm.controls["year"].value && !this.ngForm.controls["season_value"].value && !this.ngForm.controls["crop_type"].value)) {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Select Something.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
  
        return;
      }
      if ((!this.ngForm.controls["season_value"].value && !this.ngForm.controls["crop_type"].value)) {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Select Season And Crop Type.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
  
        return;
      }
      if ((!this.ngForm.controls["crop_type"].value)) {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Select Crop Type.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
  
        return;
      }
    
    if (this.ngForm.controls['year'].value || this.ngForm.controls['crop'].value || this.ngForm.controls['bspcName'].value || this.ngForm.controls['season_value'].value || this.ngForm.controls['variety'].value) {
      searchData = {
        isSearch: true
      }
      this.isSearch = true
      
      this.ngForm.controls['year'].value ? (searchData['year'] = this.ngForm.controls['year'].value) : '';
      this.ngForm.controls['crop'].value ? (searchData['crop_code'] = this.ngForm.controls['crop'].value) : '';
      this.ngForm.controls['bspcName'].value ? (searchData['breeder_name'] = this.ngForm.controls['bspcName'].value) : '';
      this.ngForm.controls['season_value'].value ? (searchData['season'] = this.ngForm.controls['season_value'].value) : '';
      this.ngForm.controls['variety'].value ? (searchData['variety_id'] = this.ngForm.controls['variety'].value) : '';
      this.ngForm.controls['unitKgQ'].value ? (searchData['unitKgQ'] = this.ngForm.controls['unitKgQ'].value) : '';


      this.productionCenterService
        .postRequestCreator("getNucleusSeedAvailabilityforReports", {
          page: loadPageNumberData,
          pageSize: this.filterPaginateSearch.itemListPageSize || 50,
          searchData: searchData
        })
        .subscribe((apiResponse: any) => {
          if (apiResponse !== undefined
            && apiResponse.EncryptedResponse !== undefined
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.filterPaginateSearch.itemListPageSize = 50;
            this.allData = apiResponse.EncryptedResponse.data;
            if (this.allData === undefined) {
              this.allData = [];
            }
            let SpaName = []


              for (let data of this.allData) {
                for (let value of data.variety) {
                  for (let item of value.spas) {
                    //  if(data.crop_code )
                    SpaName.push({
                      production_center_id: item.production_center_id, breeder_production_centre_name: item.breeder_production_centre_name,
                      crop_code: data.crop_code, variety_id: value.variety_id, quantity: item.quantity
                    })
                  }
                }
              }
              const spalistsecond = {}
              SpaName.forEach(function (obj) {
                var crop_code = obj.crop_code;
                var variety_id = obj.variety_id;
                var production_center_id = obj.production_center_id;
                var availability = obj && obj.quantity ? parseInt(obj.quantity) : 0;
                var key = crop_code + '_' + variety_id + '_' + production_center_id; // Create a composite key
                if (spalistsecond.hasOwnProperty(key)) {
                  // If the composite key already exists, add the value to the existing key
                  spalistsecond[key] += availability;
                } else {
                  // If the composite key doesn't exist, set it to the current value
                  spalistsecond[key] = availability;
                }
              });
              var uniqueDataLiftedSpaseocd = Object.entries(spalistsecond).map(([key, value,]) => {
  
                var [crop_code, variety_id, production_center_id] = key.split('_');
                return { crop_code, variety_id, production_center_id, value };
              })
              for (let newData of uniqueDataLiftedSpaseocd) {
                for (let data of this.allData) {
                  for (let value of data.variety) {
  
                    for (let item of value.spas) {
                      if (data.crop_code == newData.crop_code && value.variety_id == newData.variety_id && item.production_center_id == newData.production_center_id) {
                        item.quantity = newData.value
  
  
                      }
                    }
                  }
                }
              }
              // for(let newData of uniqueDataLiftedSpaseocd){
              for (let data of this.allData) {
                for (let value of data.variety) {
                  for (let item of value.spas) {
                    value.spas = value.spas.filter((arr, index, self) =>
                      index === self.findIndex((t) => (t.production_center_id == arr.production_center_id)))
                  }
                }
              }
              const filterArr = []
              
              
              for (let data of this.allData) {
                let sum=0;
                for (let value of data.variety) {               
                  let quantitySum=0
                  for (let item of value.spas) {
                    sum+=value.spas.length
                    data.totalSpaLength=sum;
                    value.spalength=value.spas.length;
                    quantitySum+=item.quantity
                    value.totalQuantityofvariety=quantitySum
                    
                  }
                }
              }
              for (let data of this.allData) {
                let sum=0
                let quantitySum=0
                for (let value of data.variety) {  
                  sum+=value.spas.length
                    data.total_spa_count=sum;
                    quantitySum+=data.total_spa_count;
                    data.totalspa=quantitySum
                   
  
                  
                }
              }
            console.log(this.allData,'this.allData')
              this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
              this.initSearchAndPagination();
              this.runExcelApi()
            }
          });
    } else {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Atleast One Field.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
    }
  }
  else{
    if (this.ngForm.controls['year'].value || this.ngForm.controls['crop'].value || this.ngForm.controls['bspcName'].value || this.ngForm.controls['season_value'].value || this.ngForm.controls['variety'].value) {
      searchData = {
        isSearch: true
      }
      this.isSearch = true
      
      this.ngForm.controls['year'].value ? (searchData['year'] = this.ngForm.controls['year'].value) : '';
      this.ngForm.controls['crop'].value ? (searchData['crop_code'] = this.ngForm.controls['crop'].value) : '';
      this.ngForm.controls['bspcName'].value ? (searchData['breeder_name'] = this.ngForm.controls['bspcName'].value) : '';
      this.ngForm.controls['season_value'].value ? (searchData['season'] = this.ngForm.controls['season_value'].value) : '';
      this.ngForm.controls['variety'].value ? (searchData['variety_id'] = this.ngForm.controls['variety'].value) : '';
      this.ngForm.controls['unitKgQ'].value ? (searchData['unitKgQ'] = this.ngForm.controls['unitKgQ'].value) : '';


      this.productionCenterService
        .postRequestCreator("getNucleusSeedAvailabilityforReports", {
          page: loadPageNumberData,
          pageSize: this.filterPaginateSearch.itemListPageSize || 50,
          searchData: searchData
        })
        .subscribe((apiResponse: any) => {
          if (apiResponse !== undefined
            && apiResponse.EncryptedResponse !== undefined
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.filterPaginateSearch.itemListPageSize = 50;
            this.allData = apiResponse.EncryptedResponse.data.rows;
            if (this.allData === undefined) {
              this.allData = [];
            }
            let SpaName = []

            
              this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
              this.initSearchAndPagination();
              this.runExcelApi()
            }
          });
    } else {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Atleast One Field.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
    }

  }
  }

  clear() {
    this.ngForm.controls['year'].patchValue("");
    this.ngForm.controls['season_value'].patchValue("");
    this.ngForm.controls['bspcName'].patchValue("");
    this.ngForm.controls['crop'].patchValue("");
    this.ngForm.controls['variety'].patchValue("");
    this.selected_bsp_name = ''
    this.selected_variety_name = '';
    this.selected_crop = '';

    this.runExcelApi()


    this.getPageData();
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.initSearchAndPagination();
  }

  // cropGroup(data: string) { { } }
  // async shortStatename() {
  //   const route = 'get-state-list';
  //   const result = await this.breederService.getRequestCreatorNew(route).subscribe((data: any) => {
  //     this.statename = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
  //     // console.log('state======>',this.statename);

  //   })
  // }

  // async submitindentor(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

  //   const route = 'submit-indents-breeder-seeds-list';
  //   const result = await this.breederService.postRequestCreator(route, null, {
  //     page: loadPageNumberData,
  //     pageSize: this.filterPaginateSearch.itemListPageSize || 10,
  //     search: searchData
  //   }).subscribe((apiResponse: any) => {
  //     if (apiResponse !== undefined
  //       && apiResponse.EncryptedResponse !== undefined
  //       && apiResponse.EncryptedResponse.status_code == 200) {
  //       this.identor = apiResponse.EncryptedResponse.data.data;
  //       this.data1 = apiResponse.EncryptedResponse.data;
  //       this.custom_array = [];
  //       // console.log('this.identorthis.identor',this.identor);
  //       // arr = arr.data
  //       let varietyId = []
  //       for (let value of this.identor) {
  //         varietyId.push(value.m_crop_variety.variety_name)
  //       }
  //       varietyId = [...new Set(varietyId)]
  //       let newObj = [];

  //       for (let value of varietyId) {
  //         let keyArr = [];
  //         for (let val of this.identor) {
  //           if (val.m_crop_variety.variety_name == value) {
  //             let state = val.user.agency_detail.m_state.state_short_name;
  //             keyArr.push({ "state": state, 'value': val.indent_quantity });
  //           }
  //         }
  //         let variety_id = (value).toString();
  //         newObj.push({ "variety_id": value, 'data': keyArr })
  //       }

  //       this.finalData = newObj;
  //       console.log('this.idfinalDatantor', this.finalData);

  //       this.tableId = [];
  //       for (let id of this.identor) {
  //         this.tableId.push(id.id);
  //       }
  //       // console.log('this.identorthis.identor', this.tableId);

  //       const results = this.identor.filter(element => {
  //         if (Object.keys(element).length !== 0) {
  //           return true;
  //         }

  //         return false;
  //       });
  //       // console.log(results, 'resultssssssss');
  //       if (this.identor === undefined) {
  //         this.identor = [];
  //       }
  //       // let data =[];
  //       const removeEmpty = (obj) => {
  //         Object.entries(obj).forEach(([key, val]) =>
  //           (val && typeof val === 'object') && removeEmpty(val) ||
  //           (val === null || val === "") && delete obj[key]
  //         );
  //         return obj;
  //       };
  //       removeEmpty(this.identor)
  //       this.filterPaginateSearch.Init(results, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count);
  //       this.initSearchAndPagination();
  //     }

  //   });
  // }

  // freeze() {
  //   const searchFilters = {
  //     "search": {
  //       "id": this.tableId
  //     }
  //   };
  //   const route = "freeze-indent-breeder-seed-data";
  //   this.service.postRequestCreator(route, null, searchFilters).subscribe((apiResponse: any) => {
  //     if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
  //       && apiResponse.EncryptedResponse.status_code == 200) {
  //       Swal.fire({
  //         toast: true,
  //         icon: "success",
  //         title: "Data Has Been Successfully Updated",
  //         position: "center",
  //         showConfirmButton: false,
  //         showCancelButton: false,
  //         timer: 2000
  //       }).then(x => {

  //         this.router.navigate(['/nucleus-seed-availability-report']);
  //       })
  //     }
  //     else {

  //       Swal.fire({
  //         toast: true,
  //         icon: "error",
  //         title: "An error occured",
  //         position: "center",
  //         showConfirmButton: false,
  //         showCancelButton: false,
  //         timer: 2000
  //       })
  //     }

  //   });
  // }

  // getSeasonData() {
  //   const route = "get-season-details";
  //   const result = this.service.postRequestCreator(route, null).subscribe(data => {
  //     this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
  //     // console.log(this.seasonList);
  //   })
  // }
  // getCroupCroupList() {
  //   const route = "crop-group";
  //   const result = this.service.getPlansInfo(route).then((data: any) => {
  //     this.response_crop_group = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
  //   })
  // }
  // initSearchAndPagination() {
  //   this.paginationUiComponent.Init(this.filterPaginateSearch);
  //   if (this.paginationUiComponent === undefined) {


  //     setTimeout(() => {
  //       this.initSearchAndPagination();
  //     }, 300);
  //     return;
  //   }
  //   // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
  // }

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
  runExcelApi(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    searchData = {
      isSearch: this.isSearch,
    }
    this.ngForm.controls['year'].value ? (searchData['year'] = this.ngForm.controls['year'].value) : '';
    this.ngForm.controls['crop'].value ? (searchData['crop_code'] = this.ngForm.controls['crop'].value) : '';
    this.ngForm.controls['bspcName'].value ? (searchData['breeder_name'] = this.ngForm.controls['bspcName'].value) : '';
    this.ngForm.controls['season_value'].value ? (searchData['season'] = this.ngForm.controls['season_value'].value) : '';
    this.ngForm.controls['variety'].value ? (searchData['variety_id'] = this.ngForm.controls['variety'].value) : '';
    this.ngForm.controls['unitKgQ'].value ? (searchData['unitKgQ'] = this.ngForm.controls['unitKgQ'].value) : '';


    this.productionCenterService
      .postRequestCreator("getNucleusSeedAvailabilityforReports", {
        // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
        searchData: searchData
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          // this.filterPaginateSearch.itemListPageSize = 10;
          this.exportdata = apiResponse.EncryptedResponse.data.rows;
          if (this.exportdata === undefined) {
            this.exportdata = [];
          }
          console.log("Exellll Report Dataaaa", this.exportdata)
          // this.filterPaginateSearch.Init(this.exportdata, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          // this.initSearchAndPagination();
        }
      });
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

  // download() {
  //   const name = 'nucleus-seed-availability-report';
  //   const element = document.getElementById('excel-table');
  //   const options = {
  //     filename: `${name}.pdf`,
  //     image: { type: 'jpeg', quality: 1 },
  //     html2canvas: {
  //       dpi: 192,
  //       scale: 4,
  //       letterRendering: true,
  //       useCORS: true
  //     },
  //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  //   };
  //   html2PDF().set(options).from(element).toPdf().save();
  // }
  download() {
    if(this.ngForm.controls['unitKgQ'].value=='1'){

      let reportDataHeader = [
        { text: 'S/N', bold: true },
        { text: 'Year of Indent', bold: true },
        { text: 'Season', bold: true },
        { text: 'Name of BSPC', bold: true },
        { text: 'Crop Name', bold: true },
        { text: 'Variety', bold: true },
        { text: 'Quantity of Available Nucleus Seed', bold: true },
  
      ]
  
      let reportData = this.exportdata.map((element, index) => {
  
        let reportData = [
          index + 1,
          element && element.year ? this.getFinancialYear(element.year) : 'NA',
          element && element.m_crop && element.m_crop.season && (element.m_crop.season == 'K') ? 'Kharif' : 'Rabi',
          element && element.breeder_production_centre_name ? element.breeder_production_centre_name : 'NA',
          element && element.m_crop && element.m_crop.crop_name ? element.m_crop.crop_name : 'NA',
          element && element.m_crop_variety && element.m_crop_variety.variety_name ? element.m_crop_variety.variety_name : 'NA',
          element && element.quantity ? (element.quantity) + ' ' + this.getQuantityUnit(element.crop_code) : 'NA'
  
          // element.crop_code.split('')[0] == 'H' ? 'Kg':
          // 'Quintal'
  
  
          // 
          ,
  
        ]
        return reportData;
      })
  
      reportData = [[...reportDataHeader], ...reportData]
      let pageWidth = 1800
      let numberOfColumn = 10
      let numberOfCharecter = 30
      const columnWidth = (pageWidth - (2 * 2) - (1 * numberOfColumn)) / numberOfColumn
      const maxFontSize = columnWidth / (1 * numberOfCharecter)
  
      const docDefinition = {
        pageOrientation: 'landscape',
        // pageSize: {
        //   width: 1800,
        //   height: 600,
        // },
  
        content: [
          { text: 'Nucleus Seed Availability Report', style: 'header' },
          { text: `Year of Indent: ${this.ngForm.controls['year'].value ? (this.ngForm.controls['year'].value) + '-' + ((parseInt(this.ngForm.controls['year'].value)+1)-2000  ):''}  season: ${this.ngForm.controls['season_value'].value && (this.ngForm.controls['season_value'].value=='R')?'Rabi': (this.ngForm.controls['season_value'].value=='K')?'Kharif':''}  Name of BSPC:  ${this.selected_bsp_name ? this.selected_bsp_name :''} ` },
          {
            style: 'indenterTable',
            table: {
              // widths: [5,15,10,10,10,10,10,10,10,10],
              body:
                reportData,
            },
          },
        ],
  
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5],
          },
          indenterTable: {
  
            fontSize: maxFontSize,
            margin: [0, 5, 0, 15],
          },
        },
      };
      pdfMake.createPdf(docDefinition).download('nucleus-seed-availability-report.pdf');
    }else{
        const name = 'nucleus-seed-availability-report';
    const element = document.getElementById('excel-table');
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 192,
        scale: 3,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'in', format: 'a3', orientation: 'landscape' }
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
  breeder_selection(data) {
    console.log('data================>', data)
    this.ngForm.controls['bspcName'].setValue(data && data.breeder_production_centre_name ? data.breeder_production_centre_name : '')
    this.selected_bsp_name = data && data.breeder_production_centre_name ? data.breeder_production_centre_name : ''
  }
  cbClick() {
    document.getElementById('bspcName').click();
  }
  ccClick() {
    document.getElementById('cropName').click();
  }
  cvClick() {
    document.getElementById('varietyName').click();
  }

  crop_selection(data) {
    console.log(data, 'datqa')
    this.selected_crop = data && (data['m_crop.crop_name']) ? data['m_crop.crop_name'] : '';
    this.ngForm.controls['crop'].setValue(data && data['m_crop.crop_code'] ? data['m_crop.crop_code'] : '')

  }
  variety_selection(data) {
    console.log(data)
    this.selected_variety_name = data && (data['m_crop_variety.variety_name']
    ) ? data['m_crop_variety.variety_name'] : '';
    this.ngForm.controls['variety'].setValue(data && data['m_crop_variety.id'] ? data['m_crop_variety.id'] : '')
  }
  getQuantityUnit(unit) {
    let units = unit.split('')[0] == 'H' ? 'Kg' :
      'Quintal'
    return units;
  }

}



