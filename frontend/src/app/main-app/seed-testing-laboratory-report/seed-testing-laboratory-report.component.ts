

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
import { MasterService } from 'src/app/services/master/master.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;



@Component({
  selector: 'app-seed-testing-laboratory-report',
  templateUrl: './seed-testing-laboratory-report.component.html',
  styleUrls: ['./seed-testing-laboratory-report.component.css']
})

export class SeedTestingLaboratoryReportComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropGroupData;
  statename = [];
  identor = [];
  tableData: any[] = [];
filteredData: any[] = [];
selected_state: string = '';
selected_district: string = '';
 allData: any[] = [];
  totalIndenters: number = 0;
  searchText: string = '';
  showFilter: boolean = false;

  ngForm!: FormGroup;
  seasonList: any = [];
  response_crop_group: any = [];
  data: any;
  data1: any;
  custom_array: any[];
  finalData: any[];
  fileName = 'seed-testing-laboratory-report.xlsx';
  stateData: any;

  year: any;
  season: any;
  crop: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  DistrictData: any[];
  exportdata: any[];
  disabledfield=true;
  stateDataSecond: any;
  DistrictDataSecond: any[];
  masterData: any[];
  completeData: any[];
  constructor(private masterService: MasterService, private fb: FormBuilder, private service: SeedServiceService, private router: Router) { this.createEnrollForm(); }
  createEnrollForm() {
    this.ngForm = this.fb.group({
        state: [''],
  district: [''],
      state_text:[''],
      district_text:[''],
    });
    this.ngForm.controls['state'].valueChanges.subscribe(newValue=>{
      if(newValue){
        this.getDistrict(newValue)
        this.disabledfield=false
        this.ngForm.controls['district'].setValue('')
        this.selected_district =''
      }

    })
    // this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
    //   if (newValue) {
    //     this.stateData =this.stateDataSecond
    //     let response= this.stateData.filter(x=>x.state_name.toLowerCase().startsWith(newValue.toLowerCase()))      
    //     this.stateData=response;  
    //   }
    //   else{
    //     this.getState()       
    //   }
    // });

      this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
    if (newValue) {
      this.stateData = this.stateDataSecond; // full copy
      let response = this.stateData.filter(
        x => x.state_name.toLowerCase().includes(newValue.toLowerCase())   
      );
      this.stateData = response;
    } else {
      this.getState();
    }
  });
    
    // this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
    //   if (newValue ) {
    //     this.DistrictData =this.DistrictDataSecond
    //     let response= this.DistrictData.filter(x=>x['m_district.district_name'].toLowerCase().startsWith(newValue.toLowerCase()))    
    //     this.DistrictData=response
    //   }
    //   else{
    //     this.getDistrict(this.ngForm.controls['state'].value)       
    //   }
    // });
     this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
    if (newValue) {
      this.DistrictData = this.DistrictDataSecond; 
      let response = this.DistrictData.filter(
        x =>
          x['m_district.district_name']
            .toLowerCase()
            .includes(newValue.toLowerCase()) 
      );
      this.DistrictData = response;
    } else {
      this.getDistrict(this.ngForm.controls['state'].value);
    }
  });
  }

  ngOnInit(): void {
    this.fetchData();
      this.ngForm.controls['state'].valueChanges.subscribe(() => {
    this.applyFilter();
  });

  this.ngForm.controls['district'].valueChanges.subscribe(() => {
    this.applyFilter();
  });
  this.getPageData();
  this.getState();
  this.runExcelApi();


  setTimeout(() => {
    if (this.allData) {
      this.filteredData = this.allData;

    }
  }, 500);
}
applyFilter() {
  this.filteredData = this.allData.filter(item => {
    const stateMatch = (this.selected_state === 'ALL' || !this.selected_state) ? true : item.m_district?.state_code === this.selected_state;
    const districtMatch = (this.selected_district === 'ALL' || !this.selected_district) ? true : item.m_district?.district_code === this.selected_district;
    return stateMatch && districtMatch;
  });

  this.filterPaginateSearch.itemList = [...this.filteredData];
  this.totalIndenters = this.filteredData.length;
}

  fetchData() {
  this.service.postRequestCreator("getSeedTestingLabDataforReports").subscribe((apiResponse: any) => {
    if (apiResponse?.EncryptedResponse?.status_code === 200) {
      // All data set
      this.allData = apiResponse.EncryptedResponse.data.rows || [];

      // Filtered data initially full data
      this.filteredData = [...this.allData];

      // Total indenters count
      this.totalIndenters = this.filteredData.length;

      // Pagination object update
      this.filterPaginateSearch.itemList = [...this.filteredData];
      this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);

      // Pagination init
      this.initSearchAndPagination();
    }
  });
}


onSearch1() {
  const search = this.searchText.trim().toLowerCase();

  if (!search) {
    this.filteredData = [...this.allData];
  } else {
    this.filteredData = this.allData.filter(item =>
      (item.lab_name && item.lab_name.toLowerCase().includes(search)) ||
      (item.short_name && item.short_name.toLowerCase().includes(search)) ||
      (item.address && item.address.toLowerCase().includes(search)) ||
      (item.contact_person_name && item.contact_person_name.toLowerCase().includes(search)) ||
      (item.m_designation && item.m_designation.name && item.m_designation.name.toLowerCase().includes(search)) ||
      (item.mobile_number && item.mobile_number.toLowerCase().includes(search)) ||
      (item.email && item.email.toLowerCase().includes(search)) ||
      (item.m_district && item.m_district.state_name && item.m_district.state_name.toLowerCase().includes(search)) ||
      (item.m_district && item.m_district.district_name && item.m_district.district_name.toLowerCase().includes(search))
    );
  }

 
  this.filterPaginateSearch.itemList = [...this.filteredData];
  this.totalIndenters = this.filteredData.length;
}

onSearch(): void {
  if (!this.searchText || this.searchText.trim() === '') {
    // ✅ Reset data if search is empty
    this.completeData = [...this.masterData];
  } else {
    const lower = this.searchText.toLowerCase();

    this.completeData = this.masterData.filter(item => {
      const agency = item.agency_detail || {};

      return (

        (item.lab_name && item.lab_name.toLowerCase().includes(lower)) ||
      (item.short_name && item.short_name.toLowerCase().includes(lower)) ||
      (item.address && item.address.toLowerCase().includes(lower)) ||
      (item.contact_person_name && item.contact_person_name.toLowerCase().includes(lower)) ||
      (item.m_designation && item.m_designation.name && item.m_designation.name.toLowerCase().includes(lower)) ||
      (item.mobile_number && item.mobile_number.toLowerCase().includes(lower)) ||
      (item.email && item.email.toLowerCase().includes(lower)) ||
      (item.m_district && item.m_district.state_name && item.m_district.state_name.toLowerCase().includes(lower)) ||
      (item.m_district && item.m_district.district_name && item.m_district.district_name.toLowerCase().includes(lower))

      );
    });
  }
}

  getState() {
    this.stateData = [];
    this.service.postRequestCreator('getSeedTestingStateList').subscribe((apiResponse: any) => {
      if(apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows) {
        this.stateData = apiResponse.EncryptedResponse.data.rows;
        this.stateDataSecond= this.stateData
      }
    })
  }
  getDistrict(newValue) {
   
    const param ={
      search:{
        state_id:newValue

      }
    }
    this.service.postRequestCreator('getDistrictSeedTestingReport',null,param).subscribe((apiResponse: any) => {
      if(apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data  && apiResponse.EncryptedResponse.data.rows) {
        this.DistrictData = apiResponse.EncryptedResponse.data.rows;
        this.DistrictDataSecond = this.DistrictData 
      }
    })
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    searchData = {
      isSearch: true,
    }
    this.ngForm.controls['state'].value ? (searchData['state_id'] = this.ngForm.controls['state'].value) : '';
    this.ngForm.controls['district'].value ? (searchData['district'] = this.ngForm.controls['district'].value) : '';

    this.service
      .postRequestCreator("getSeedTestingLabDataforReports", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        searchData: {
          state_id:this.ngForm.controls['state'].value,
          district:this.ngForm.controls['district'].value,
          isSearch: true,
          isReport : true,
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          this.allData = apiResponse.EncryptedResponse.data.rows;
          this.masterData = [...apiResponse.EncryptedResponse.data.rows];
          this.completeData = [...apiResponse.EncryptedResponse.data.rows];
          if (this.allData === undefined) {
            this.allData = [];
          }
          this.totalIndenters = apiResponse.EncryptedResponse.data.count;
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
    if (this.ngForm.controls['state'].value || this.ngForm.controls['district'].value) {
      this.isSearch = true;

      searchData = {
        isSearch: true,
      }
      this.ngForm.controls['state'].value ? (searchData['state_id'] = this.ngForm.controls['state'].value) : '';
      this.ngForm.controls['district'].value ? (searchData['district'] = this.ngForm.controls['district'].value) : '';


      this.service
        .postRequestCreator("getSeedTestingLabDataforReports", null, {
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
              this.allData = apiResponse.EncryptedResponse.data.rows || [];
      this.filteredData = [...this.allData];
      this.totalIndenters = this.filteredData.length;
            this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
            this.initSearchAndPagination();
            this.runExcelApi()
          }
        });
        

    } else {

      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Atleast one Field.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
    }
  }

  clear() {
    this.ngForm.controls['state'].patchValue("");
    this.ngForm.controls['district'].patchValue("");
    this.getPageData();
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.disabledfield=true;
    this.selected_district=''
    this.selected_state=''
    this.runExcelApi();
    this.isSearch=false
    this.initSearchAndPagination();
      this.selected_state = 'ALL';
  
  this.filteredData = [...this.allData];
  }
  clear2(){
      this.selected_district = 'ALL';
  this.filteredData = [...this.allData];
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

  runExcelApi(loadPageNumberData: number = 1, searchData: any | undefined = undefined){
    searchData = {
      isSearch: this.isSearch,
      isReport: true
    }
    this.ngForm.controls['state'].value ? (searchData['state_id'] = this.ngForm.controls['state'].value) : '';
      this.ngForm.controls['district'].value ? (searchData['district'] = this.ngForm.controls['district'].value) : '';


    this.service
      .postRequestCreator("getSeedTestingLabDataforReports", null, {
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
          this.filterPaginateSearch.Init(this.exportdata, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
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


  download() {  
    let reportDataHeader = [
      { text: 'S/N', bold: true },
    {
       text: 'Name of Seed Testing Laboratory', bold: true }, 
    { text: 'Short Name', bold: true },
    { text: 'State', bold: true },
     { text: 'District', bold: true },   
     { text: 'Address', bold: true },
    { text: 'Contact Person Name', bold: true },
    { text: 'Contact Person Designation', bold: true },
    { text: 'Mobile Number', bold: true },
     { text: 'Email Address', bold: true },
     { text: 'Status', bold: true },
                          ]

    let reportData = this.completeData.map((element, index) => {   
 
    let reportData =  [
            index+1,
            element &&  element.lab_name ? element.lab_name : 'NA',
            element &&  element.short_name ? element.short_name : 'NA',        
            element  && element.m_district.state_name ? element.m_district.state_name : 'NA',
            element   && element.m_district.district_name ? element.m_district.district_name : 'NA',           
            element && element.address && (element.address.length>30) ? (element.address.substring(0,30)+'...'):element && element.address ? element.address :'NA',          
            element && element.contact_person_name && (element.contact_person_name.length>30) ? (element.contact_person_name.substring(0,30)+'...'):element && element.contact_person_name ? element.contact_person_name :'NA',                   
             element &&(  element.m_designation) && element.m_designation.name ? element.m_designation.name : 'NA',
            element && element.mobile_number ? element.mobile_number : 'NA',
            element && element.email && ( element.email) ? element.email : 'NA',
            element  && element.is_active && element.is_active==1 ? 'ACTIVE' :'INACTIVE'
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

      content: [
        { text: 'List of Seed Testing Laboratory', style: 'header' },
        // { text: `State :  ${this.selected_state}       District:   ${this.selected_district}`, style: 'custom' },
        { 
  text: `State : ${this.selected_state ? this.selected_state : 'NA'}   District : ${this.selected_district ? this.selected_district : 'NA'}`,  
},

        {
          style: 'indenterTable',
          table: {
          
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
        custom: {
          fontSize: 16,
          // bold: true,
          background:'#DC8B3A',
          color:'white',
          width :800
          // fillColor: '#555555',
          // alignment: 'center',
        },
      
        indenterTable: {
          
          fontSize: maxFontSize ,
          margin: [0, 5, 0, 15],
        },
      },
    };
    pdfMake.createPdf(docDefinition).download('List-of-Seed-Testing-Laboratory.pdf');
  }

  cnClick() {
    document.getElementById('state').click();
  }

  cdClick() {
    document.getElementById('district').click();
  }
  toggleFilter() {
  this.showFilter = !this.showFilter;
}
state_select(data){
  this.selected_state = data.state_name || '';
  this.ngForm.controls['state'].setValue(data.state_code || '');

  if(data.state_code === 'ALL'){
    this.disabledfield = false;
    this.selected_district = '';
    this.ngForm.controls['district'].setValue('');
    this.searchText = ''
  } else {
    this.searchText = ''
    this.disabledfield = false;
    this.ngForm.controls['district'].setValue('');
    this.selected_district = '';
    this.getDistrict(data.state_code);
  }

  this.getPageData(); 
}
district_select(data){
  this.selected_district = data['m_district.district_name'] || '';
  this.ngForm.controls['district'].setValue(data['m_district.district_code'] || '');

  this.getPageData(); 
}


// applyFilter() {
//   if ((this.selected_state === 'ALL' || !this.selected_state) &&
//       (this.selected_district === 'ALL' || !this.selected_district)) {

//     this.filteredData = [...this.allData];
//     return;
//   }

//   this.filteredData = this.allData.filter(item => {
//     let stateMatch = (this.selected_state === 'ALL' || !this.selected_state) ? true : item.state_id === this.selected_state;
//     let districtMatch = (this.selected_district === 'ALL' || !this.selected_district) ? true : item.district_code === this.selected_district;
//     return stateMatch && districtMatch;
//   });
// }

filterTableData(searchData: any) {
  if (Object.keys(searchData).length === 1 && searchData.isSearch) {
    this.filteredData = this.tableData;
  } else {
    this.filteredData = this.tableData.filter(item => {
      let match = true;
      if (searchData.state_id) {
        match = match && item.state_id === searchData.state_id;
      }
      if (searchData.district) {
        match = match && item.district === searchData.district;
      }
      return match;
    });
  }
}



}