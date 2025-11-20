

// import { Component, OnIsubmit-indents-breeder-seedsnit } from '@angular/core';
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
  selector: 'app-plant-detail-report',
  templateUrl: './plant-detail-report.component.html',
  styleUrls: ['./plant-detail-report.component.css']
})
export class PlantDetailReportComponent implements OnInit {
  @ViewChild(MaximumLotSizeSearchComponent)
  indentBreederSeedAllocationSearchComponent: MaximumLotSizeSearchComponent | undefined = undefined;

  @ViewChild(PaginationUiComponent)
  paginationUiComponent!: PaginationUiComponent;

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  cropGroupData;
  statename = [];
  identor = [];
  ngForm!: FormGroup;
  seasonList: any = [];
  response_crop_group: any = [];
  data: any;
  showFilter: boolean = false;
  searchTerm: string = '';
  filteredData: any[] = [];
  data1: any;
  custom_array: any[];
  totalIndenters: number = 0;

  disabledfield = true;
  finalData: any[];
  fileName = 'list-of-SPP-report.xlsx';
  yearOfIndent: any = [
    { name: "2020 - 2021", "value": "2020" }
  ];
  year: any;
  season: any;
  crop: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  allData: any;
  countData: any;
  districtList: any;
  stateList: any;
  selected_state: any;
  selected_district: any;
  stateListSecond: any;
  districtListSecond: any;
  exportdata: any;
  completeData: any[];
  masterData: any[];

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
      state_text: [''],
      district_text: [''],
    });

    this.ngForm.controls['state_id'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getDistrictList(newValue);
        this.disabledfield = false;
        this.ngForm.controls['district_id'].setValue('');
        this.selected_district = '';
      }
    });

    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.stateList = this.stateListSecond;
        let response = this.stateList.filter(x =>
          x.state_name.toLowerCase().includes(newValue.toLowerCase())
        );
        this.stateList = response;
      } else {
        this.getStateList();
      }
    });

    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.districtList = this.districtListSecond;
        let response = this.districtList.filter(x =>
          x['m_district.district_name'].toLowerCase().includes(newValue.toLowerCase())
        );
        this.districtList = response;
      } else {
        this.getDistrictList(this.ngForm.controls['state_id'].value);
      }
    });
  }

  ngOnInit(): void {
    this.getPageData();
    this.getStateList();
    this.setupFormValueChanges();
  }

  filterData1() {
    const state = this.ngForm.controls['state_id'].value || null;
    const district = this.ngForm.controls['district_id'].value || null;
    const year = this.ngForm.controls['year']?.value || null;
    const season = this.ngForm.controls['season']?.value || null;
    const crop = this.ngForm.controls['crop']?.value || null;

    this.filteredData = this.allData.filter((item: any) => {
      return (!state || item.m_state?.state_code == state)
        && (!district || item.m_district?.district_code == district)
        && (!year || item.year == year)
        && (!season || item.season == season)
        && (!crop || item.crop == crop);
    });

    this.filterPaginateSearch.Init(
      this.filteredData,
      this,
      "getPageData",
      undefined,
      this.filteredData.length,
      true
    );
    this.countData = this.filterPaginateSearch.itemList.length
  }

  setupFormValueChanges() {
    this.ngForm.controls['state_id'].valueChanges.subscribe(stateCode => {
      this.selected_state = this.stateList.find(s => s.state_code == stateCode)?.state_name || '';
      this.getDistrictList(stateCode).then(() => {
        // this.filterData1();
        this.getPageData();

      });
    });

    this.ngForm.controls['district_id'].valueChanges.subscribe(_ => {
      this.selected_district = this.districtList.find(d =>
        d['m_district.district_code'] == this.ngForm.controls['district_id'].value
      )?.['m_district.district_name'] || '';
      // this.filterData1();
      this.getPageData();

    });

    this.ngForm.controls['year']?.valueChanges.subscribe(_ => this.filterData1());
    this.ngForm.controls['season']?.valueChanges.subscribe(_ => this.filterData1());
    this.ngForm.controls['crop']?.valueChanges.subscribe(_ => this.filterData1());
  }

  async getStateList() {
    this.service.postRequestCreator("getPlantDeatilsState").subscribe((apiResponse: any) => {
      if (apiResponse?.EncryptedResponse?.status_code == 200) {
        this.stateList = apiResponse.EncryptedResponse.data.rows || '';
        this.stateListSecond = this.stateList;
      }
    });
  }

  async getDistrictList(newValue: any) {
    const searchFilters = { "search": { "state": newValue } };
    this.service.postRequestCreator("get-plant-district-details", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse?.EncryptedResponse?.status_code == 200) {
          this.districtList = apiResponse.EncryptedResponse.data.rows;
          this.districtListSecond = this.districtList;
        }
      });
  }


  runExcelApi(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    searchData = { isSearch: this.isSearch };

    this.ngForm.controls['year'].value ? (searchData['year'] = this.ngForm.controls['year'].value) : '';
    this.ngForm.controls['season'].value ? (searchData['season'] = this.ngForm.controls['season'].value) : '';
    this.ngForm.controls['crop'].value ? (searchData['crop'] = this.ngForm.controls['crop'].value) : '';

    this.service
      .postRequestCreator("get-plant-details", null, { searchData: searchData })
      .subscribe((apiResponse: any) => {
        if (
          apiResponse !== undefined &&
          apiResponse.EncryptedResponse !== undefined &&
          apiResponse.EncryptedResponse.status_code == 200
        ) {
          this.exportdata = apiResponse.EncryptedResponse.data.rows || [];
          this.masterData = [...this.exportdata];
          this.completeData = [...this.exportdata];
          this.totalIndenters = apiResponse.EncryptedResponse.data.count;

          this.filterPaginateSearch.Init(
            this.exportdata,
            this,
            "getPageData",
            undefined,
            apiResponse.EncryptedResponse.data.count,
            true
          );
          this.initSearchAndPagination();
        }
      });
  }

  getPageData(loadPageNumberData: number = 1) {
    let route = "get-plant-details";

    let data = {
      page: 1,
      pageSize: 50,
      isReport: true,
      search: {
        state_code: this.ngForm.controls['state_id'].value,
        district_code: this.ngForm.controls['district_id'].value,
      }
    };

    this.service.postRequestCreator(route, null, data).subscribe(data => {
      this.allData = data.EncryptedResponse.data.rows;
      this.countData = data.EncryptedResponse.data.count;
      this.filteredData = [...this.allData];
      this.masterData = [...this.allData];
      this.completeData = [...data.EncryptedResponse.data.rows];

      this.filterPaginateSearch.Init(
        this.filteredData,
        this,
        "getPageData",
        undefined,
        this.filteredData.length,
        true
      );
      this.initSearchAndPagination();
    });
  }

  filterData11() {
    const lowerSearch = this.searchTerm.toLowerCase();
    this.filteredData = this.completeData.filter((item: any) => {
      return (
        item.plant_name?.toLowerCase().includes(lowerSearch) ||
        item.code?.toLowerCase().includes(lowerSearch) ||
        item.m_state?.state_name?.toLowerCase().includes(lowerSearch) ||
        item.m_district?.district_name?.toLowerCase().includes(lowerSearch) ||
        item.address?.toLowerCase().includes(lowerSearch) ||
        item.contact_person_name?.toLowerCase().includes(lowerSearch) ||
        item.m_designation?.name?.toLowerCase().includes(lowerSearch) ||
        item.mobile_number?.toLowerCase().includes(lowerSearch) ||
        item.email?.toLowerCase().includes(lowerSearch)
      );
    });

    this.filterPaginateSearch.Init(
      this.filteredData,
      this,
      "getPageData",
      undefined,
      this.filteredData.length,
      true
    );
    this.initSearchAndPagination();
  }


  filterData(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      // ✅ Reset data if search is empty
      this.completeData = [...this.masterData];
    } else {
      const lower = this.searchTerm.toLowerCase();
      console.log("this.completeDataTEST", this.completeData);

      this.completeData = this.masterData.filter(item => {
        const agency = item.agency_detail || {};

        return (
          // item.plant_name?.toLowerCase().includes(lower) ||
          item.agency_detail?.agency_name?.toLowerCase().includes(lower) ||
          item.code?.toLowerCase().includes(lower) ||
          item.agency_detail?.m_state?.state_name?.toLowerCase().includes(lower) ||
          item.agency_detail?.m_district?.district_name?.toLowerCase().includes(lower) ||
          item.agency_detail?.address?.toLowerCase().includes(lower) ||
          item.agency_detail?.contact_person_name?.toLowerCase().includes(lower) ||
          item.agency_detail?.m_designation?.designation_name?.toLowerCase().includes(lower) ||
          item.agency_detail?.mobile_number?.toLowerCase().includes(lower) ||
          item.agency_detail?.email?.toLowerCase().includes(lower)
        );
      });
    }
  }

  initSearchAndPagination() {
    if (
      this.indentBreederSeedAllocationSearchComponent === undefined ||
      this.paginationUiComponent === undefined
    ) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }

  submit() {
    if (
      !this.ngForm.controls['year'].value ||
      !this.ngForm.controls['season'].value ||
      !this.ngForm.controls['crop'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select all Fields.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
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
      for (let i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  exportexcel(): void {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

  download() {
    let reportDataHeader = [
      { text: 'S/N', bold: true },
      { text: 'Name of SPP', bold: true },
      { text: 'SPP Code', bold: true },
      { text: 'State', bold: true },
      { text: 'District', bold: true },
      { text: 'Address', bold: true },
      { text: 'Name of SPP In-charge', bold: true },
      { text: 'Designation', bold: true },
      { text: 'Mobile Number', bold: true },
      { text: 'Email ID', bold: true },
      { text: 'Status', bold: true },
    ];
    // console.log("this.completeData",this.completeData); 
    // let reportData = this.completeData.map((element, index) => {
    //   return [
    //     index + 1,
    //     element?.plant_name || 'NA',
    //     element?.code || 'NA',
    //     element?.m_state?.state_name || 'NA',
    //     element?.m_district?.district_name || 'NA',
    //     element?.address || 'NA',
    //     element?.contact_person_name || 'NA',
    //     element?.m_designation?.name || 'NA',
    //     element?.agency_detail?.mobile_number || 'NA',
    //     element?.email || 'NA',
    //     element?.is_active == 1 ? 'ACTIVE' : 'INACTIVE'
    //   ];
    // });
    console.log("this.completeData", this.completeData);

    let reportData = this.completeData.map((element, index) => {
      return [
        index + 1,
        element?.agency_detail?.agency_name || 'NA',                // Name of SPP
        element?.code || 'NA',                                      // SPP Code
        element?.agency_detail?.m_state?.state_name || 'NA',        // State
        element?.agency_detail?.m_district?.district_name || 'NA',  // District
        element?.agency_detail?.address || 'NA',                    // Address
        element?.agency_detail?.contact_person_name || 'NA',        // SPP In-charge
        element?.agency_detail?.m_designation?.designation_name || 'NA', // Designation
        element?.agency_detail?.mobile_number || 'NA',              // Mobile
        element?.agency_detail?.email || 'NA',                      // Email
        element?.is_active == 1 ? 'ACTIVE' : 'INACTIVE'             // Status
      ];
    });


    reportData = [[...reportDataHeader], ...reportData];
    let pageWidth = 1800;
    let numberOfColumn = 10;
    let numberOfCharecter = 30;
    const columnWidth = (pageWidth - (2 * 2) - (1 * numberOfColumn)) / numberOfColumn;
    const maxFontSize = columnWidth / (1 * numberOfCharecter);

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        { text: 'List of SPP Report', style: 'header' },
        { text: `State Name : ${this.selected_state || 'NA'}   District Name : ${this.selected_district || 'NA'}` },
        {
          style: 'indenterTable',
          table: { body: reportData }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        custom: { margin: [0, 0, 0, 10], width: 400 },
        subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
        indenterTable: { fontSize: maxFontSize, margin: [0, 5, 0, 15] },
      }
    };
    pdfMake.createPdf(docDefinition).download('spp-report.pdf');
  }

  click() {
    if (!this.ngForm.controls['state_id'].value && !this.ngForm.controls['district_id'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    } else {
      this.ngForm.controls['state_id'].setValue('');
      this.ngForm.controls['district_id'].setValue('');
      this.selected_district = '';
      this.selected_state = '';
      this.disabledfield = true;
      this.getPageData();
    }
  }

  state_select(data) {
    this.selected_state = data?.state_name || '';
    this.ngForm.controls['state_id'].setValue(data?.state_code || '');
    this.ngForm.controls['state_text'].setValue("");
    this.searchTerm = '';
    this.ngForm.controls['district_id'].setValue("");
    this.selected_district = ''
    if (data.state_name = 'All') {
      this.getPageData()
    }
  }

  cnClick() {
    document.getElementById('state').click();
  }

  district_select(data) {
    this.selected_district = data?.['m_district.district_name'] || '';
    this.ngForm.controls['district_id'].setValue(data?.['m_district.district_code'] || '');
    this.ngForm.controls['district_text'].setValue("");
  }

  cdClick() {
    document.getElementById('district').click();
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }


}





