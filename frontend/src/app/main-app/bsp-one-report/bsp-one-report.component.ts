import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
// import { AddSeedTestingLaboratorySearchComponent } from 'src/app/common/add-seed-testing-laboratory-search/add-seed-testing-laboratory-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { MasterService } from 'src/app/services/master/master.service';
// import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
// import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-bsp-one-report',
  templateUrl: './bsp-one-report.component.html',
  styleUrls: ['./bsp-one-report.component.css']
})

export class BspOneReportComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropGroupData;
  identor = [];
  ngForm!: FormGroup;
  data: any;
  data1: any;
  custom_array: any[];
  finalData: any[];
  fileName = 'BSP I xlsx Report.xlsx';
  yearOfIndent: any = [{
    name: "2025 - 2026",
    "value": "2025"
  },
  {
    name: "2024 - 2025",
    "value": "2024"
  },
  {
    name: "2023 - 2024",
    "value": "2023"
  },
  {
    name: "2022 - 2023",
    "value": "2022"
  },
  {
    name: "2021 - 2022",
    "value": "2021"
  },
  {
    name: "2020 - 2021",
    "value": "2020"
  }
  ];
  year: any;
  breeder: any;
  crop: any;
  variety: any;
  bspc: any;
  breederList: any = [];
  cropNameList: any = [];
  varietyNameList: any = [];
  bspcList: any = [];
  breeder_id: any;
  crop_id: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  exportdata: any;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};
  cropdropdownHidden:boolean = true;
  varietydropdownHidden:boolean = true;

  seasonData: any = [
    { "name": "Kharif", "season_code": "K" },
    { "name": "Rabi", "season_code": "R" },
  ];
  cropType: any = [
    { "name": "Agriculture", "crop_type": "A" },
    { "name": "HortiCulture", "crop_type": "H" },
  ]
  breederListData: any;
  cropTypeData: any;
  isSearchMsg: string;
  is_search: boolean = false;
  constructor(private breederService: BreederService, private masterService: MasterService, private fb: FormBuilder, private service: SeedServiceService, private router: Router) {
    this.createEnrollForm();
  }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      breeder: ['',],
      crop: ['',],
      year: ['',],
      variety: ['',],
      bspc: ['',],
      season: ['',],
      crop_type: ['',]
    });

    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_type'].disable();
    this.ngForm.controls['breeder'].disable();
    this.ngForm.controls['crop'].disable();
    this.ngForm.controls['variety'].disable();

    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['season'].enable();
        this.getSeasonDataList();
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_type'].enable();
        this.getCropTypeDataList();
      }
    });

    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // this.ngForm.controls['crop'].enable();
        this.cropdropdownHidden = false;
        this.getCropNameList(newValue);
        // this.breederProductionData(newValue);
      }
    });

    // this.ngForm.controls['breeder'].valueChanges.subscribe(newValue => {
    //   if (newValue) {
    //     this.ngForm.controls['crop'].enable();
    //     this.getCropNameList(newValue);
    //   }
    // });

    this.ngForm.controls['crop'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // this.ngForm.controls['variety'].enable();
        this.varietydropdownHidden = false;
        this.getVarietyNameList(newValue);
      }
    });
  }
  ngOnInit(): void {
    this.getYearDataList();
    if (this.is_search == false) {
      this.isSearchMsg = "Please Select Filter."
    }
    // this.getMasterBspReportData();

    // this.runExcelApi();
    this.dropdownSettings = {
      idField: 'crop_code',
      textField: 'crop_name',
      allowSearchFilter: true
      // enableCheckAll: false,
      // limitSelection: -1,
    };
    this.dropdownSettings1 = {
      idField: 'variety_code',
      textField: 'variety_name',
      allowSearchFilter: true
      // enableCheckAll: false,
      // limitSelection: -1,
    };
  }
  getYearDataList() {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type
    const param={

    }
    
    const route = "getbspOneYearofIndent";
    const result = this.masterService.postRequestCreator(route,null,{
      user_type:user_type,
      type:'report_icar'
    }).subscribe((data: any) => {
      this.yearOfIndent = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : [];
    })
  }

  getSeasonDataList() {
    const route = "get-bsp-one-filter-data";
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type
    const result = this.masterService.postRequestCreator(route, null, {
      search: {
        year: this.ngForm.controls['year'].value,
        user_type:user_type,
      type:'report_icar'
      }
    }).subscribe((data: any) => {
      this.seasonData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : [];
      // this.seasonData =  seasonData.sort((a, b) => b.seasonData.season_name - a.seasonData.season_name);
      // console.log("seasonData=====",this.seasonData);
    })
  }

  getCropTypeDataList() {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type
    const route = "getBsp1cropType";
    const result = this.masterService.postRequestCreator(route, null, {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        user_type:user_type,
        type:'report_icar'
      }
    }).subscribe((data: any) => {
      this.cropTypeData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : [];
      this.cropTypeData= this.cropTypeData.filter((arr, index, self) =>
      index === self.findIndex((t) => (t.crop_type === arr.crop_type )))
  
    })
  }


  breederProductionData(newValue) {
    let route = "get-bsp-one-filter-data";
    this.masterService.postRequestCreator(route, null, {
      search: {
        crop_type: newValue,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value
      }
    }).subscribe(res => {
      this.breederListData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : ''
    })
  }

  async getCropNameList(newValue) {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type
    const route = "get-bsp-one-filter-data";
    this.masterService
      .postRequestCreator("getBsp1cropName", null, {
        search: {
          // breeder_id: newValue,
          year: this.ngForm.controls['year'].value,
          season: this.ngForm.controls['season'].value,
          crop_type: this.ngForm.controls['crop_type'].value,
          user_type:user_type,
        type:'report_icar'
        }
      })
      .subscribe((res: any) => {
        if (res && res.EncryptedResponse && res.EncryptedResponse.status_code && res.EncryptedResponse.status_code == 200) {
          this.cropNameList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : '';
        }
      });
  }

  async getVarietyNameList(newValue) {
    let crop_code = [];
    console.log('newvalue========= ', newValue.forEach(ele => {
      crop_code.push(ele.crop_code)
    }));
    console.log('crop_code', crop_code);
    let route = "get-bsp-one-filter-data";
    this.masterService.postRequestCreator(route, null, {
      search: {
        crop_code: crop_code,
        // breeder_id: this.ngForm.controls['breeder'].value,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_type: this.ngForm.controls['crop_type'].value
      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse.EncryptedResponse.status_code == 200) {
        this.varietyNameList = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data : [];
      }
    });
  }

  submit() {
    // || !this.ngForm.controls['breeder'].value ||
    //   !this.ngForm.controls['crop'].value
    if (
      !this.ngForm.controls['year'].value && !this.ngForm.controls['season'].value &&
      !this.ngForm.controls['crop_type'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select all Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
    } 
    else if (
       !this.ngForm.controls['season'].value &&
      !this.ngForm.controls['crop_type'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
    }
    else if (
      
     !this.ngForm.controls['crop_type'].value
   ) {
     Swal.fire({
       title: '<p style="font-size:25px;">Please Select Crop Type.</p>',
       icon: 'error',
       confirmButtonText:
         'OK',
     confirmButtonColor: '#E97E15'
     });
   }
    else {
      this.is_search = true;
      this.isSearch = true;
      this.year = this.ngForm.controls['year'].value;
      this.breeder = this.ngForm.controls['breeder'].value;
      
      this.crop = this.ngForm.controls['crop'].value;
      this.variety = this.ngForm.controls['variety'].value;

      let crop_code = [];
      if(this.crop != undefined && this.crop.length > 0){
        this.crop.forEach(ele => {
          crop_code.push(ele.crop_code);
        }
        );
      }
     
      // this.variety = [];
      const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type

      let variety_code = []
      if(this.variety != undefined && this.variety.length > 0)
      this.variety.forEach(ele => {
        variety_code.push(ele.variety_code);
      });

      let searchData = {
        year: this.year,
        crop: crop_code,
        variety: variety_code ?variety_code:'' ,
        crop_type:this.ngForm.controls['crop_type'].value,
        season: this.ngForm.controls['season'].value,
        user_type:user_type,
        type:'reporticar'
      } 
      console.log('search datata=======',searchData);
      this.getMasterBspReportData(1, searchData);
      // this.runExcelApi(1,searchData)
    }
  }

  clear() {
    this.is_search = false;
    this.data1 = [];
    this.varietydropdownHidden = true;
    this.cropdropdownHidden = true;

    this.ngForm.controls['year'].patchValue("");
    this.ngForm.controls['breeder'].patchValue("");
    this.ngForm.controls['crop'].patchValue("");
    this.ngForm.controls['variety'].patchValue("");
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop_type'].patchValue("");

    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_type'].disable();
    this.ngForm.controls['breeder'].disable();
    this.ngForm.controls['crop'].disable();
    this.ngForm.controls['variety'].disable();

    // this.getMasterBspReportData();
  }

  cropGroup(data: string) {
    { }
  }
  
  async getMasterBspReportData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

  // const route = 'get-master-bsp-report-data';
  const route = "getMasterBspOneReportDataSecond";

  this.masterService.postRequestCreator(route, null, {
    reportType: 'one',
    page: loadPageNumberData,
    pageSize: this.filterPaginateSearch.itemListPageSize || 50,
    search: searchData
  }).subscribe((apiResponse: any) => {
    if (apiResponse !== undefined &&
      apiResponse.EncryptedResponse !== undefined &&
      apiResponse.EncryptedResponse.status_code == 200) {
      this.identor = apiResponse.EncryptedResponse.data.data;
      // this.data1 = apiResponse.EncryptedResponse.data;

      let reportDataArray = [];
      let reportDataArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data : '';
      reportDataArr.forEach(ele => {

        if (ele != null || ele != undefined) {
          reportDataArray.push(ele);
        }

      });
      this.data1 = reportDataArray;
     
      let filterData =[]
      var spaListData={}
      for(let data of this.data1){
        for(let item of data.variety){

          item.bspc.forEach(function (obj) {
           
            var crop_code = obj.crop_code;
            var variety_id = obj.variety_id;
            var bspc_id =  obj.bspc_id;
            var total_quantity = obj && obj.allocation_qnt ? parseInt(obj.allocation_qnt) : 0;
            var availability = obj && obj.available_nucleus_seed ? parseInt(obj.available_nucleus_seed) : 0;
          
  
            var key = crop_code + '_' + variety_id + '_'+ bspc_id  ; // Create a composite key
  
            if (spaListData.hasOwnProperty(key)) {
              // If the composite key already exists, add the value to the existing key
              spaListData[key] += total_quantity;
              spaListData[key] += availability;
            } else {
              // If the composite key doesn't exist, set it to the current value
              spaListData[key] = total_quantity;
              spaListData[key] = availability;
            }
          });
          var uniqueDataLiftedSpa = Object.entries(spaListData).map(([key, value,]) => {
            
            var [crop_code,variety_id,bspc_id] = key.split('_');
            return { crop_code,variety_id,bspc_id,value };
          })    
        }
      }
      console.log(uniqueDataLiftedSpa,'uniqueDataLiftedSpa')
      for(let data of uniqueDataLiftedSpa){
        for(let value of this.data1){
          let sum=0
          for(let val of value.variety){
            for(let item of val.bspc){

              if(value.crop_code==data.crop_code && value.variety_id==data.variety_id && item.bspc_id == data.bspc_id){
                val.allocation_qnt=data.value
                sum+=val.available_nucleus_seed
                val.available_nucleus_seed= sum
                
              }
            }
          }
        }
      }
      // -------/
      let spalistsecond={}
      for(let data of this.data1){
        for(let item of data.variety){

          item.bspc.forEach(function (obj) {
           
            var crop_code = obj.crop_code;
            var variety_id = obj.variety_id;
            var bspc_id =  obj.bspc_id;
            var availability = obj && obj.available_nucleus_seed ? parseInt(obj.available_nucleus_seed) : 0;
          
  
            var key = crop_code + '_' + variety_id + '_'+ bspc_id  ; // Create a composite key
  
            if (spalistsecond.hasOwnProperty(key)) {
              // If the composite key already exists, add the value to the existing key
   
              spalistsecond[key] += availability;
            } else {
              // If the composite key doesn't exist, set it to the current value
           
              spalistsecond[key] = availability;
            }
          });
          var uniqueDataLiftedSpaseocd = Object.entries(spalistsecond).map(([key, value,]) => {
            
            var [crop_code,variety_id,bspc_id] = key.split('_');
            return { crop_code,variety_id,bspc_id,value };
          })    
        }
      }
      for(let data of uniqueDataLiftedSpaseocd){
        for(let value of this.data1){
          
          for(let val of value.variety){
            for(let items of val.bspc){

              if(value.crop_code==data.crop_code && value.variety_id==data.variety_id && items.bspc_id == data.bspc_id){
                val.available_nucleus_seed=data.value
                
                
              }
            }
          }
        }
      }

      for(let value of this.data1){
        for(let item of value.variety){
       

          item.bspc= item.bspc.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.bspc_id  === arr.bspc_id)))
        

        }


    }
    this.data1.forEach(elem=>{
      let sum =0
      let totalCount=0
      elem.variety.forEach(item=>{
        elem.variety_counts =  item.bspc.length;
        totalCount+=elem.variety_counts;
        elem.variety_count=totalCount 
        item.bspc_count = item.bspc.length;
        item.bspc.forEach(element => {
          
          sum +=element.allocation_qnt
          item.totalallocated = sum
        });
        // item.bspc.forEach(val)
      })

    })
    for(let data of this.data1){
      for(let item of data.variety){
        let sum=0;
        for(let val of item.bspc){
          sum+=val.allocation_qnt;
          item.totalAllocation= sum

        }
      }
    }
    console.log('filterData',this.data1)
 
      // filterData.forEach(e)
     
      // this.data1.forEach(function (obj) {
      //   var crop_code = obj.crop_code;
      //   var variety_id = obj.variety_id;
        
      //   var total_quantity = obj && obj.qty ? parseInt(obj.qty) : 0;
      

      //   var key = crop_code + '_' + variety_id ; // Create a composite key

      //   if (spaListData.hasOwnProperty(key)) {
      //     // If the composite key already exists, add the value to the existing key
      //     spaListData[key] += total_quantity;
      //   } else {
      //     // If the composite key doesn't exist, set it to the current value
      //     spaListData[key] = total_quantity;
      //   }
      // });
      // var uniqueDataLiftedSpa = Object.entries(spaListData).map(([key, value]) => {
      //   var [crop_code, variety_id ] = key.split('_');
      //   return { crop_code, variety_id, value };
      // })    
      // console.log(uniqueDataLiftedSpa,'value')
      // console.log('data=============',this.data1);     // if ((this.ngForm.controls['season'].value && this.ngForm.controls['year'].value && this.ngForm.controls['crop_type'].value)) {
      //   this.data1 = reportDataArray.filter(
      //     item => item.season == this.ngForm.controls['season'].value &&
      //       item.year == this.ngForm.controls['year'].value &&
      //       item.crop_code.slice(0, 1) == this.ngForm.controls['crop_type'].value.slice(0, 1)
      //   )
      // }

      // if ((this.ngForm.controls['season'].value && this.ngForm.controls['year'].value && this.ngForm.controls['crop_type'].value && this.ngForm.controls['crop'].value)) {
      //   this.data1 = reportDataArray.filter(
      //     item => item.season == this.ngForm.controls['season'].value &&
      //       item.year == this.ngForm.controls['year'].value &&
      //       item.crop_code.slice(0, 1) == this.ngForm.controls['crop_type'].value.slice(0, 1) &&
      //       item.crop_code == this.ngForm.controls['crop'].value
      //   )
      // }
      // if (this.ngForm.controls['variety'].value && (this.ngForm.controls['season'].value && this.ngForm.controls['year'].value && this.ngForm.controls['crop_type'].value && this.ngForm.controls['crop'].value)) {
      //   this.data1 = reportDataArray.filter(
      //     item => item.season == this.ngForm.controls['season'].value &&
      //       item.year == this.ngForm.controls['year'].value &&
      //       item.crop_code == this.ngForm.controls['crop'].value &&
      //       item.crop_code.slice(0, 1) == this.ngForm.controls['crop_type'].value.slice(0, 1) &&
      //       item.variety_code == this.ngForm.controls['variety'].value
      //   )
      // }
      // for (const dataKey in this.data1) {

      //   this.data1[dataKey]['variety_name'] = this.data1[dataKey]['m_crop_variety.variety_name'];
      //   this.data1[dataKey]['agency_name'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
      //   this.data1[dataKey]['indent_quantity'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
      //   this.data1[dataKey]['available_nucleus_seeds'] = this.data1[dataKey]['bsp1_production_centers.nucleus_seed_availability.quantity'];
      //   this.data1[dataKey]['contact_person_name'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
      //   this.data1[dataKey]['contact_person_designation'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.m_designatio'];

      //   delete this.data1[dataKey]['m_crop_variety.variety_name'];
      //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
      //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
      //   delete this.data1[dataKey]['nucleus_seed_availability.quantity'];
      //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.id'];
      //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.id'];
      //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
      //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_desig'];
      // }
    }

  });
}

freeze() {
  const searchFilters = {
    "search": {
      "id": this.tableId
    }
  };
  const route = "freeze-indent-breeder-seed-data";
  this.service.postRequestCreator(route, null, searchFilters).subscribe((apiResponse: any) => {
    if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code &&
      apiResponse.EncryptedResponse.status_code == 200) {
      Swal.fire({
        title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
        icon: 'success',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      }).then(x => {

        this.router.navigate(['/bsp-one-report']);
      })
    } else {

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

initSearchAndPagination() {
  this.paginationUiComponent.Init(this.filterPaginateSearch);
  if (this.paginationUiComponent === undefined) {


    setTimeout(() => {
      this.initSearchAndPagination();
    }, 300);
    return;
  }
  // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
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

  async runExcelApi(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
  const route = 'getMasterBspOneReportDataSecond';
  this.is_search = true;
      this.isSearch = true;
      this.year = this.ngForm.controls['year'].value;
      this.breeder = this.ngForm.controls['breeder'].value;
      
      this.crop = this.ngForm.controls['crop'].value;
      this.variety = this.ngForm.controls['variety'].value;

      let crop_code = [];
      if(this.crop != undefined && this.crop.length > 0){
        this.crop.forEach(ele => {
          crop_code.push(ele.crop_code);
        }
        );
      }
     
      // this.variety = [];
      const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type
    let variety_code = []
    if(this.variety != undefined && this.variety.length > 0)
    this.variety.forEach(ele => {
      variety_code.push(ele.variety_code);
    });

  const result = await this.masterService.postRequestCreator(route, null, {
    reportType: 'one',
    pageSize: this.filterPaginateSearch.itemListPageSize || 10,
    search: {
      year: this.year,
      crop: crop_code,
      variety: variety_code ?variety_code:'' ,
      crop_type:this.ngForm.controls['crop_type'].value,
      season: this.ngForm.controls['season'].value,
      user_type:user_type,
      type:'reporticar'
    }
  }).subscribe((apiResponse: any) => {
    if (apiResponse !== undefined && apiResponse.EncryptedResponse !== undefined && apiResponse.EncryptedResponse.status_code == 200) {

      this.identor = apiResponse.EncryptedResponse.data.data;
      this.exportdata = apiResponse.EncryptedResponse.data;

      // for (const dataKey in this.exportdata) {

      //   this.exportdata[dataKey]['variety_name'] = this.exportdata[dataKey]['m_crop_variety.variety_name'];
      //   this.exportdata[dataKey]['agency_name'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
      //   this.exportdata[dataKey]['indent_quantity'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
      //   this.exportdata[dataKey]['available_nucleus_seeds'] = this.exportdata[dataKey]['bsp1_production_centers.nucleus_seed_availability.quantity'];
      //   this.exportdata[dataKey]['contact_person_name'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
      //   this.exportdata[dataKey]['contact_person_designation'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.m_designatio'];

      //   delete this.exportdata[dataKey]['m_crop_variety.variety_name'];
      //   delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
      //   delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
      //   delete this.exportdata[dataKey]['nucleus_seed_availability.quantity'];
      //   delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.id'];
      //   delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.id'];
      //   delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
      //   delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_desig'];
      // }
    }
  });
}

exportexcel(): void {
  /* pass here the table id */
  const element = document.getElementById('excel-tables');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  /* save to file */
  XLSX.writeFile(wb, this.fileName);

}

download() {
  const name = 'BSP I Pdf Report';
  const element = document.getElementById('pdf-tables');
  const options = {
    filename: `${name}.pdf`,
    image: {
      type: 'jpeg',
      quality: 1
    },
    html2canvas: {
      dpi: 192,
      scale: 4,
      letterRendering: true,
      useCORS: true
    },
    jsPDF: {
      unit: 'mm',
      format: 'a3',
      orientation: 'landscape'
    }
  };
  html2PDF().set(options).from(element).toPdf().save();
}
getCropNamefrommlist(crop){
  let temp=[]
  crop.forEach(obj=>{
    if(obj.crop_name){
      temp.push(obj.crop_name)
    }


  })
  console.log('tem',temp)
  return temp.toString().length>30 ? temp.toString().substring(0,30) + '...':temp.toString();
 
}
getVarietyNamefrommlist(crop){
  let temp=[]
  crop.forEach(obj=>{
    if(obj.variety_name){
      temp.push(obj.variety_name)
    }


  })
  console.log('tem',temp)
  return temp.toString().length>30 ? temp.toString().substring(0,30) + '...':temp.toString();
 
}
// download() {  
//   let reportDataHeader = [
//     { text: 'S/N', bold: true },
//   {text: 'Crop Name', bold: true }, 
//   {text: 'Variety Name', bold: true }, 
//   { text: 'Total Indented Quantity', bold: true },
//   { text: 'BSPCs Allocated for Production', bold: true },
//   // { text: 'Crop Name', bold: true },
//   //  { text: 'Season', bold: true },
//   // { text: 'Status', bold: true },
//                         ]

//   let reportData = this.data1.map((element, index) => {   

//   let reportData =  [
//           index+1,
//           element &&  element['crop_name'] ? element['crop_name'] : 'NA',
//           element &&  element['variety_name'] ? element['variety_name'] : 'NA',
//           element &&  element['totalIndentedQuantity'] ? element['totalIndentedQuantity'] +   ' ' + this.getQuantityUnit(element.crop_code) : 'NA',
//           // element && element[index] && element[index].bspc  &&  element[index].bspc['name'] ?
//            element.bspc[index].name 
//           //  :'NA'

//           // element &&  element.crop_name ? element.crop_name : 'NA',    
//           // element && element.crop_code && (element.crop_code.substring(0,1)=='A')? 'Agriculture':'Horticulture',    
//           // element && element.season ? (element.season.trim()==='R') ? 'RABI' : (element.season.trim()==='B') ? 'BOTH': 'KHARIF' :'NA',
//           // element  && element.is_active && element.is_active==1 ? 'ACTIVE' :'INACTIVE'
//         ]
//         return reportData;      
//   })

//   reportData = [[...reportDataHeader], ...reportData]
//   let pageWidth = 1800
//   let numberOfColumn = 10
//   let numberOfCharecter = 30
//   const columnWidth = (pageWidth - (2 * 2) - (1 * numberOfColumn)) / numberOfColumn
//   const maxFontSize = columnWidth / (1 * numberOfCharecter)

//   const docDefinition = {
//     pageOrientation: 'landscape',
//     // pageSize: {
//     //   width: 1800,
//     //   height: 600,
//     // },

//     content: [
//       { text: 'List of Project Coordinators', style: 'header' },
//       {
//         style: 'indenterTable',
//         table: {
//           // widths: [5,15,10,10,10,10,10,10,10,10],
//           body: 
//             reportData,
//         },
//       },
//     ],

//     styles: {
//       header: {
//         fontSize: 18,
//         bold: true,
//         margin: [0, 0, 0, 10],
//       },
//       subheader: {
//         fontSize: 16,
//         bold: true,
//         margin: [0, 10, 0, 5],
//       },
//       indenterTable: {
        
//         fontSize: maxFontSize ,
//         margin: [0, 5, 0, 15],
//       },
//     },
//   };
//   pdfMake.createPdf(docDefinition).download('list-of-breeders-report.pdf');
// }
getQuantityUnit(unit){
  let units = unit.split('')[0] == 'H' ? 'Kg':
    'Quintal'
    return units;
  }
}
