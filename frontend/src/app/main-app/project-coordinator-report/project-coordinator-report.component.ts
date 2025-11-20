import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
// import { AddSeedTestingLaboratorySearchComponent } from 'src/app/common/add-seed-testing-laboratory-search/add-seed-testing-laboratory-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';

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
  selector: 'app-project-coordinator-report',
  templateUrl: './project-coordinator-report.component.html',
  styleUrls: ['./project-coordinator-report.component.css']
})
export class ProjectCoordinatorReportComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropGroupData;
  statename = [];
  identor = [];
  allDataFull: any[] = [];
  ngForm!: FormGroup;
  showFilter: boolean = false;
  finalData: any[];
  fileName = 'project-cordinator-report.xlsx';

  isSearch: boolean = false;
  tableId: any[];
  allData: any;
  totalIndenters: number = 0;
  filteredData: any[] = []; 
  searchText: string = '';
  state_data: any = [];
  breeder_category_data: any = [];
  project_coordinatorData: any;
  exportdata: any[];
  selected_state: any;
  state_data_second: any;
  selected_agency: any;
  project_coordinatorData_second: any;
  disabledfieldAgency=true;
  submitted=false;
  user_type: any;

  countData: any;
    masterData: any[] = [];
    completeData: any[] = [];

  constructor(private breederService: BreederService, private fb: FormBuilder, private service: SeedServiceService, private router: Router, private masterService: MasterService) { this.createEnrollForm(); }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      breeder_category: [''],
      state: [''],
      state_text:[''],
      agency_text:[''],
      variety_search_filter: ['']

    });
    this.ngForm.controls['state'].valueChanges.subscribe(newValue=>{
      if(newValue){
        this.getProjectCoordinator(newValue)
        this.ngForm.controls['breeder_category'].setValue('')
        this.selected_agency=''
        this.disabledfieldAgency=false

      }
    })

     this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
    if (newValue) {
      this.state_data = this.state_data_second;
      let response = this.state_data.filter(x =>
        x.state_name.toLowerCase().includes(newValue.toLowerCase()) 
      );
      this.state_data = response;
    } else {
      this.getState();
    }
  });
  //    this.ngForm.controls['agency_text'].valueChanges.subscribe(newValue => {
  //   if (newValue) {
  //     this.project_coordinatorData = this.project_coordinatorData_second;
  //     let response = this.project_coordinatorData.filter(x =>
  //       x.agency_name.toLowerCase().includes(newValue.toLowerCase())  
  //     );
  //     this.project_coordinatorData = response;
  //   } else {
  //     this.getProjectCoordinator(this.ngForm.controls['state'].value);
  //   }
  // });
  }
  ngOnInit(): void {
    this.getState();
    this.getBreederCategory();
    this.getPageData();
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    this.user_type = data.user_type
    this.runExcelApi();
    this.filteredData = this.allData;

  }
applyFilter() {
  
  this.filteredData = this.allData.filter((item) => {

    let stateMatch =
      this.selected_state === "All" ||
      (item.state &&
        item.state.trim().toLowerCase() ===
          this.selected_state.trim().toLowerCase());

    return stateMatch;
  });

}


  getState() {
    this.state_data = [];
    this.masterService
      .getRequestCreatorNew("getStateDataForSeedTestingLab")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data) {
          this.state_data = apiResponse.EncryptedResponse.data;
          this.state_data_second= this.state_data
        }
      });
  }
  toggleFilter() {
  this.showFilter = !this.showFilter;
}

  getProjectCoordinator(value) {
    const param={
      search:{
        state_id:value,
        user_type:this.user_type,
        type:'report_icar'
      }
    }
    this.service
      .postRequestCreator("getProjectPoordinatorreportName",null,param)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data) {
          this.project_coordinatorData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows :''
        this.project_coordinatorData_second= this.project_coordinatorData
        }
      });
  }

  getBreederCategory() {
    this.breeder_category_data = []
    this.masterService
      .getRequestCreatorNew("getCategoryData")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data) {
          this.breeder_category_data = apiResponse.EncryptedResponse.data
        }
      });
  }

  getAllDataForPDF() {
  return new Promise((resolve, reject) => {
    let route = "getAllIndentorsList";

    let data = {
      // Page aur pageSize mat bhejna
      search: { state_code: this.ngForm.controls['state_id'].value }
    };

    this.service.postRequestCreator(route, null, data).subscribe((res: any) => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code == 200) {
        resolve(res.EncryptedResponse.data.rows); // pure data wapas karega
      } else {
        reject("API Error");
      }
    });
  });
}


  getPageData1(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    const userData = localStorage.getItem('BHTCurrentUser');

    const data = JSON.parse(userData);
    const user_type = data.user_type
    searchData = {
      isSearch: false,
      state_code: undefined,
      category_code: undefined,
      user_type: user_type,
      type:'reporticar',
      isReport : true,

    }

    this.masterService.postRequestCreator("getListOfBreederSeedProductionforReports?usertype=BR", null, {
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
          this.totalIndenters = apiResponse.EncryptedResponse.data.count;
          this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          // this.initSearchAndPagination();
        }
      });
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    const userData = localStorage.getItem('BHTCurrentUser');

    const data = JSON.parse(userData);
    const user_type = data.user_type
    searchData = {
      isSearch: true,
      state_code: '',
      category_code: '',
      user_type: user_type,
      type:'reporticar',
      isReport : true,

    }

    this.masterService.postRequestCreator("getListOfBreederSeedProductionforReports?usertype=BR", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        searchData: searchData
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {

            console.log("COmplete DAta", apiResponse.EncryptedResponse)
            console.log("Alle DAta", this.allData)

            
          this.filterPaginateSearch.itemListPageSize = 50;
          this.allData = apiResponse.EncryptedResponse.data.rows;
          this.masterData = [...this.allData];
          this.completeData = [...apiResponse.EncryptedResponse.data.rows]; 

          // this.countData = data.EncryptedResponse.data.count;

          if (this.allData === undefined) {
            this.allData = [];
          }
          this.totalIndenters = apiResponse.EncryptedResponse.data.rows.length;
          console.log("----COmpleteData", this.completeData)
          this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          // this.initSearchAndPagination();
        }
      });
  }

  // initSearchAndPagination() {
  //   if (this.paginationUiComponent === undefined) {
  //     setTimeout(() => {
  //       this.initSearchAndPagination();
  //     }, 300);
  //     return;
  //   }

  //   this.paginationUiComponent.Init(this.filterPaginateSearch);
  // }

  submit(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type

    if (this.ngForm.controls['state'].value || this.ngForm.controls['breeder_category'].value) {
      searchData = {
      isSearch: true,
      state_code: this.ngForm.controls['state'].value ? this.ngForm.controls['state'].value : '',
      category_code: this.ngForm.controls['breeder_category'].value ? this.ngForm.controls['breeder_category'].value : '',
      user_type:user_type,
      type:'reporticar',
      isReport : true,

    }

      this.masterService.postRequestCreator("getListOfBreederSeedProductionforReports?usertype=BR", null, {
          page: loadPageNumberData,
          pageSize: this.filterPaginateSearch.itemListPageSize || 10,
          searchData: searchData
        })
        .subscribe((apiResponse: any) => {
          if (apiResponse !== undefined
            && apiResponse.EncryptedResponse !== undefined
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.filterPaginateSearch.itemListPageSize = 10;
            this.allData = apiResponse.EncryptedResponse.data.rows;
            if (this.allData === undefined) {
              this.allData = [];
            }
            this.submitted=true;
            this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
            // this.initSearchAndPagination();
            this.runExcelApi()
          }

        });
       
    } else {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select all Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
    }
  }

  clear() {
    this.ngForm.controls['state'].setValue("");
    this.ngForm.controls['breeder_category'].setValue("");
    this.selected_agency=''
    this.selected_state=''
    this.disabledfieldAgency=true
    this.getPageData();
    this.runExcelApi()
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.submitted=false;
    // this.initSearchAndPagination();
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
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type
    searchData = {
      isSearch: true,
      state_code: this.ngForm.controls['state'].value ? this.ngForm.controls['state'].value : '',
      category_code: this.ngForm.controls['breeder_category'].value ? this.ngForm.controls['breeder_category'].value : '',
      user_type:user_type,
      type:'reporticar',
      isReport : true,

    }

    this.masterService.postRequestCreator("getListOfBreederSeedProductionforReports?usertype=BR", null, {
        searchData: searchData
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.exportdata = apiResponse.EncryptedResponse.data.rows;
          if (this.exportdata === undefined) {
            this.exportdata = [];
            this.allDataFull = [...this.exportdata];
          }
          this.allDataFull = [...this.exportdata];
          this.filterPaginateSearch.Init(this.exportdata, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          // this.initSearchAndPagination();
        }
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
    let reportDataHeader = [{ text: 'S/N', bold: true },
    { text: 'Name of the Project Coordinator', bold: true },
    { text: 'Short Name', bold: true },
    { text: 'Crop Name', bold: true },
     { text: 'State', bold: true },
      { text: 'District', bold: true },
      { text: 'Address', bold: true },
      { text: 'Contact Person Name', bold: true }, 
      { text: 'Contact Officer Designation', bold: true }, 
      { text: 'Mobile Number', bold: true }, 
      { text: 'Email', bold: true },
      { text: 'Status', bold: true },
                          ]

    let reportData = this.completeData.map((element, index) => {   
  
    let reportData =  [
            index+1,
            element && element.agency_detail && element.agency_detail.agency_name ? element.agency_detail.agency_name : 'NA',
            element && element.agency_detail && element.agency_detail.short_name ? element.agency_detail.short_name : 'NA',
            element && element.agency_detail  && element.agency_detail.crop_data ? this.getCropNamefrommlist(element.agency_detail.crop_data) :'NA',
            element && element.agency_detail && element.agency_detail.m_state ? element.agency_detail.m_state.state_name : 'NA',
            element && element.agency_detail && element.agency_detail.m_district && element.agency_detail.m_district.district_name ? element.agency_detail.m_district.district_name : 'NA',
            element && element.agency_detail && element.agency_detail.address ? element.agency_detail.address : 'NA',          
            element && element.agency_detail && element.agency_detail.contact_person_name ? element.agency_detail.contact_person_name : 'NA',          
             element &&(element.agency_detail && element.agency_detail.m_designation) && element.agency_detail.m_designation.name ? element.agency_detail.m_designation.name : 'NA',
            element && element.mobile_number ? element.mobile_number : 'NA',
            element && element.email_id && ( element.email_id) ? element.email_id : 'NA',
            element && element.agency_detail && element.agency_detail.is_active && (element.agency_detail.is_active == 1)? 'ACTIVE':'INACTIVE' 
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
        { text: 'List of Project Coordinators', style: 'header' },

        { 
  text: `State Name : ${this.selected_state ? this.selected_state : 'NA'}   Name of the Project Co-ordinator : ${this.selected_agency ? this.selected_agency : 'NA'}`,  
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
        indenterTable: {
          
          fontSize: maxFontSize ,
          margin: [0, 5, 0, 15],
        },
      },
    };
    pdfMake.createPdf(docDefinition).download('project-cordinater-report.pdf');
  }
  cnClick() {
    document.getElementById('state').click();
  }
  caClick() {
    document.getElementById('agency').click();
  }
  // getCropNamefrommlist(crop){
  //   let temp=[]
  //   crop.forEach(obj=>{
  //     if(obj.crop_name){
  //       temp.push(obj.crop_name.split(' ') )
  //     }


  //   })
  //   return temp.toString().length>30 ? temp.toString().substring(0,30) :temp.toString();
 
  // }

//   getCropNamefrommlist(crop) {
//   if (!crop) return 'NA';


//   if (Array.isArray(crop)) {
//     return crop.map(obj => obj.crop_name).join(" ");
//   }

 
//   return crop;
// }

// getCropNameString(cropData: any[]): string {
//   if (!cropData || !Array.isArray(cropData)) return '';
//   return cropData.map(c => c.crop_name).join(',');
// }

getCropNamefrommlist(crop) {
  if (!crop) return 'NA';

  if (Array.isArray(crop)) {
    return crop.map(obj => obj.crop_name).join(", ");
  }

  return crop;
}



normalizeText(value: string): string {
  return value
    ?.toLowerCase()
    .replace(/\s+/g, ' ')  
    .replace(/[()\/]/g, '') 
    .trim();
}


  getCropNamefrommlistExcel(crop){
    let temp=[]
    crop.forEach(obj=>{
      if(obj.crop_name){
        temp.push(obj.crop_name.split(' ') )
      }


    })
    return temp.toString();
 
  }


onSearch(): void {
  if (!this.searchText || this.searchText.trim() === '') {
    this.completeData = [...this.masterData];
  } else {
    const lower = this.normalizeText(this.searchText);
    // const lower = this.searchText.toLowerCase();
    this.completeData = this.masterData.filter(x =>
      (x.agency_detail?.agency_name?.toLowerCase().includes(lower)) ||
      (x.agency_detail?.short_name?.toLowerCase().includes(lower)) ||
(this.normalizeText(this.getCropNamefrommlist(x.agency_detail?.crop_data)).includes(lower)) ||
      (x.agency_detail?.m_state?.state_name?.toLowerCase().includes(lower)) ||
      (x.agency_detail?.m_district?.district_name?.toLowerCase().includes(lower)) ||
      (x.agency_detail?.address?.toLowerCase().includes(lower)) ||
      (x.agency_detail?.contact_person_name?.toLowerCase().includes(lower)) ||
      (x.agency_detail?.m_designation?.name?.toLowerCase().includes(lower)) ||
      (x.mobile_number?.toLowerCase().includes(lower)) ||
      (x.email_id?.toLowerCase().includes(lower))
    );
  }
  
  
  console.log("------completeData----", this.completeData)
}


state_select(data) {
  if (data === 'all') {
    this.selected_state = '';
    this.selected_agency = '';
    this.ngForm.controls['state'].setValue('');
    this.searchText = '';
    this.ngForm.controls['agency_text'].setValue('');
    this.ngForm.controls['breeder_category'].setValue('');
    // this.getPageData()
  } else {

    this.selected_state = data && data.state_name ? data.state_name : '';
    this.ngForm.controls['state'].setValue(data && data.state_code ? data.state_code : '');
    this.ngForm.controls['agency_text'].setValue('');
    this.ngForm.controls['agency_text'].disable;
    this.searchText = '';
    this.selected_agency = '';


  }
  this.ngForm.controls['state_text'].setValue('');
  this.disabledfieldAgency = false;
  this.autoFilter();
}






agency_select(data) {
  if (data === 'all') {
    this.selected_agency = 'All';
    this.ngForm.controls['breeder_category'].setValue('');
  } else {
    this.selected_agency = data && data.agency_name ? data.agency_name : '';
    this.ngForm.controls['breeder_category'].setValue(data && data.id ? data.id : '');
  }
  this.ngForm.controls['agency_text'].setValue('');
  this.autoFilter();
}

autoFilter(loadPageNumberData: number = 1) {
  const userData = localStorage.getItem('BHTCurrentUser');
  const data = JSON.parse(userData);
  const user_type = data.user_type;

  const searchData = {
    isSearch: true,
    state_code: this.ngForm.controls['state'].value ? this.ngForm.controls['state'].value : '',
    category_code: this.ngForm.controls['breeder_category'].value ? this.ngForm.controls['breeder_category'].value : '',
    user_type: user_type,
    type: 'reporticar',
    isReport : true,

  };
  console.log("====searchData", searchData)
  this.masterService.postRequestCreator("getListOfBreederSeedProductionforReports?usertype=BR", null, {
    page: loadPageNumberData,
    pageSize: this.filterPaginateSearch.itemListPageSize || 10,
    searchData: searchData
  }).subscribe((apiResponse: any) => {
    if (apiResponse?.EncryptedResponse?.status_code == 200) {
      this.allData = apiResponse.EncryptedResponse.data.rows || [];
      this.masterData = [...this.allData];
      this.completeData = [...apiResponse.EncryptedResponse.data.rows]; 
      console.log("----completeData---", this.completeData)
      this.totalIndenters = this.completeData.length
      this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
      // this.initSearchAndPagination();
    }
  });
}

getProductionCentre() {
  this.masterService
    .postRequestCreator("getPlansInfo", "", this.ngForm.value)
    .subscribe((response: any) => {

      if (response?.EncryptedResponse?.status_code === 200) {
        this.allData = response.EncryptedResponse.data.rows || [];
        this.filteredData = [...this.allData];
        this.exportdata = [...this.allData]; 
        this.filterPaginateSearch.Init(
          this.filteredData,
          this,
          "getPageData",
          undefined,
          this.filteredData.length,
          true
        );

      } else {
        this.allData = [];
        this.filteredData = [];
        this.exportdata = [];
      }
    });
}


}
