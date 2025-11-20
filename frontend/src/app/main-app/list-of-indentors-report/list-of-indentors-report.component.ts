import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';

import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { BrowserModule } from '@angular/platform-browser';
import { MaximumLotSizeSearchComponent } from 'src/app/common/maximum-lot-size-search/maximum-lot-size-search.component';
import { MasterService } from 'src/app/services/master/master.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-list-of-indentors-report',
  templateUrl: './list-of-indentors-report.component.html',
  styleUrls: ['./list-of-indentors-report.component.css']
})


export class ListOfIndentorsReportComponent implements OnInit {
    @ViewChild(MaximumLotSizeSearchComponent) indentBreederSeedAllocationSearchComponent: MaximumLotSizeSearchComponent | undefined = undefined;
    @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  
    filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  
    cropGroupData;
    statename = [];
    identor = [];
    ngForm!: FormGroup;
    seasonList: any = [];
    response_crop_group: any = [];
    data: any;
    data1: any;
  
    searchText: string = '';
    allData: any[] = [];
    user_type: any;
    custom_array: any[];
    finalData: any[];
    fileName = 'list-of-indentors-report.xlsx';
  
    yearOfIndent: any = [
      { name: "2020 - 2021", "value": "2020" }
    ];
  
    year: any;
    season: any;
    crop: any;
  
    isSearch: boolean = false;
    todayData = new Date();
    tableId: any[];
    districtList: any;
    stateList: any;
    exportdata: any;
    showFilter: boolean = false;
    selected_state: any;
    stateListSecond: any;
    isSearchData: boolean = false;
    countData: any;
    masterData: any[] = [];
    completeData: any[] = [];
    
    constructor(
        private breederService: BreederService,
        private fb: FormBuilder,
        private service: SeedServiceService,
        private router: Router,
        private masterService: MasterService
      ) {
        this.createEnrollForm();
      }

    createEnrollForm() {
    this.ngForm = this.fb.group({
      season: ['',],
      state_id: [''],
      district_id: [''],
      crop: ['',],
      year: ['',],
      state_text: [''],
      variety_search_filter: ['']
    });

    this.ngForm.controls['state_id'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getDistrictList(newValue);
      }
    });

    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.stateList = this.stateListSecond;
        let response = this.stateList.filter(
          x => x.state_name.toLowerCase().includes(newValue.toLowerCase())
        );
        this.stateList = response;
      } else {
        this.getStateList();
      }
    });
  }

   ngOnInit(): void {
    this.selected_state = 'All';
    this.ngForm.controls['state_id'].setValue('');
    this.getPageData();
    this.getStateList();
    this.runExcelApi();

    this.ngForm.controls['variety_search_filter'].valueChanges.subscribe((value: string) => {
      if (value && value.trim() !== '') {
        this.applyFilter;
      } else {
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, this.countData, true);
        this.initSearchAndPagination();
      }
    });

    this.applyFilter(this.allData);
  }

  async getStateList() {
  this.masterService
    .getRequestCreatorNew("get-state-list")
    .subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.stateList = [{ state_name: 'All', state_code: '' }, ...apiResponse.EncryptedResponse.data];
        this.stateListSecond = this.stateList;
      }
    });
}

  async getDistrictList(newValue: any) {
    const searchFilters = {
      "search": {
        "state_code": newValue
      }
    };
    this.masterService
      .postRequestCreator("get-district-list", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.districtList = apiResponse.EncryptedResponse.data;
        }
      });
  }


  getPageData1(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    let route = "getAllIndentorsList";
    let data = {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      search: { state_code: this.ngForm.controls['state_id'].value, }
    }
    this.service.postRequestCreator(route, null, data).subscribe(data => {
      this.filterPaginateSearch.itemListPageSize = 50;
      this.allData = data.EncryptedResponse.data.rows;
      this.countData = data.EncryptedResponse.data.count;
      this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, data.EncryptedResponse.data.count, true);
      this.initSearchAndPagination();
      this.runExcelApi()
    });
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    let route = "getAllIndentorsList";
    let data = {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      search: { 
        state_code: this.ngForm.controls['state_id'].value,
        isReport : true

       }
    }
    this.service.postRequestCreator(route, null, data).subscribe(data => {
      this.filterPaginateSearch.itemListPageSize = 50;
      this.allData = data.EncryptedResponse.data.rows;
      this.masterData = [...this.allData];
      this.completeData = [...this.allData]; 
      this.countData = data.EncryptedResponse.data.count;

      this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, data.EncryptedResponse.data.count, true);
      this.initSearchAndPagination();
      this.runExcelApi()
    });
  }
  
search(){
    this.isSearchData=true
    this.getPageData()
}
  initSearchAndPagination() {
    this.paginationUiComponent.Init(this.filterPaginateSearch);

    if (this.indentBreederSeedAllocationSearchComponent === undefined || this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }

  }

  submit() {
    if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select all Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
    } else {
      this.isSearch = true;
      this.year = this.ngForm.controls['year'].value;
      this.season = this.ngForm.controls['season'].value;
      this.crop = this.ngForm.controls['crop'].value;
    }
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

  runExcelApi() {
    let route = "getAllIndentorsList";

    let data = {

      search: { state_code: this.ngForm.controls['state_id'].value, }
    }
    this.service.postRequestCreator(route, null, data).subscribe(data => {
      this.exportdata = data.EncryptedResponse.data.rows;
      this.countData = data.EncryptedResponse.data.count;
      this.allData = this.exportdata;
 
    });
  }

  exportexcel(): void {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

download() {
  this.getAllIndentorData().subscribe((data: any) => {
    let fullData = this.completeData; 
    let reportDataHeader = [
      { text: 'S/ N', bold: true },
      { text: 'Agency Name', bold: true },
      { text: 'State', bold: true },
      { text: 'District', bold: true },
      { text: 'Address', bold: true },
      { text: 'Contact Person Name', bold: true }, 
      { text: 'Mobile Number', bold: true }, 
      { text: 'Email', bold: true },
      { text: 'Status', bold: true },
    ];
    let reportData = fullData.map((element, index) => {
      return [
        index + 1,
        element?.agency_name || 'NA',
        element?.m_state?.state_name || 'NA',
        element?.m_district?.district_name || 'NA',
        element?.address || 'NA',
        element?.contact_person_name || 'NA',
        element?.mobile_number || 'NA',
        element?.email || 'NA',
        element?.is_active == 1 ? 'ACTIVE' : 'ACTIVE'
      ];
    });
    reportData = [[...reportDataHeader], ...reportData];
    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        { text: 'List of Indenters', style: 'header' },
        { 
          text: `State : ${this.getStateListData(this.ngForm.controls['state_id'].value)} `,
          margin: [0, 0, 0, 10]
        },
        {
          style: 'indenterTable',
          table: { body: reportData },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        indenterTable: { fontSize: 8, margin: [0, 5, 0, 15] },
      },
    };

    pdfMake.createPdf(docDefinition).download('Indenter_list.pdf');
  });
}
  
  click() {
    this.ngForm.controls['state_id'].setValue('');
    this.selected_state = ''
    this.isSearchData=false
    this.getPageData();
  }

  state_select1(data: any) {
  this.selected_state = data?.state_name || '';
  this.ngForm.controls['state_id'].setValue(data?.state_code || '');
  this.ngForm.controls['state_text'].setValue('');

  // Apply filter immediately
  if (data?.state_code === '') {
    this.applyFilter(this.allData);
  } else {
    const filteredData = this.allData.filter(item => item.m_state?.state_code === data.state_code);
    this.applyFilter(filteredData);
  }
}

state_select(data: any) {  
    this.selected_state = data?.state_name || '';
    this.ngForm.controls['state_id'].setValue(data?.state_code || '');
    this.ngForm.controls['state_text'].setValue('');
    this.searchText = '';
    if (data?.state_code && data.state_code !== '') {
      this.getPageData(1);  
    } else {
      this.ngForm.controls['state_id'].setValue('');
      this.getPageData(1);
    }
  }


  cnClick() {
    document.getElementById('state').click();
  }
  getAllIndentorData() {
  return this.service.postRequestCreator("getAllIndentorsList", null, {
    search: { state_code: this.ngForm.controls['state_id'].value }
  });
}

  getStateListData(data: any): string {
  if (!data || data === '' || data === 0) {
    return 'NA';
  }
  let state_namelist = this.stateList.filter(item => item.state_code == data);
  let stateName = (state_namelist && state_namelist[0] && state_namelist[0].state_name)
    ? state_namelist[0].state_name
    : 'NA';
  return stateName;
}

onSearch1(): void {
  const lowerSearch = this.searchText.trim().toLowerCase();

  const filteredData = this.allData.filter((item: any) => {
    return (
      (item.agency_name?.toLowerCase().includes(lowerSearch)) ||
      (item.short_name?.toLowerCase().includes(lowerSearch)) ||
      (item.m_state?.state_name?.toLowerCase().includes(lowerSearch)) ||
      (item.m_district?.district_name?.toLowerCase().includes(lowerSearch)) ||
      (item.address?.toLowerCase().includes(lowerSearch)) ||
      (item.contact_person_name?.toLowerCase().includes(lowerSearch)) ||
      (item.m_designation?.name?.toLowerCase().includes(lowerSearch)) ||
      (item.mobile_number?.toLowerCase().includes(lowerSearch)) ||
      (item.email?.toLowerCase().includes(lowerSearch))
    );
  });

  this.applyFilter(filteredData);
}
onSearch() {
    if (!this.searchText || this.searchText.trim() === '') {
      this.completeData = [...this.masterData];
    } else {
      const lower = this.searchText.toLowerCase();
      this.completeData = this.masterData.filter(x =>
        (x.agency_name && x.agency_name.toLowerCase().includes(lower)) ||
        (x.short_name && x.short_name.toLowerCase().includes(lower)) ||
        (x.m_state?.state_name && x.m_state.state_name.toLowerCase().includes(lower)) ||
        (x.m_district?.district_name && x.m_district.district_name.toLowerCase().includes(lower)) ||
        (x.contact_person_name && x.contact_person_name.toLowerCase().includes(lower)) ||
        (x.email && x.email.toLowerCase().includes(lower)) ||
        (x.mobile_number && x.mobile_number.toString().includes(lower))
      );
    }
}

toggleFilter() {
  this.showFilter = !this.showFilter;
}
 
 applyFilter(data: any[]): void {
  this.filterPaginateSearch.Init(
    data,
    this,
    "getPageData",
    undefined,
    data.length,
    true
  );
  this.initSearchAndPagination();
  this.filterPaginateSearch.itemListCurrentPage = 1;
}
}
