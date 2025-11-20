import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';

import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
@Component({
  selector: 'app-seed-multiplication-ratio-report',
  templateUrl: './seed-multiplication-ratio-report.component.html',
  styleUrls: ['./seed-multiplication-ratio-report.component.css']
})

export class SeedMultiplicationRatioReportComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropGroupData;
   ngForm!: FormGroup;
  searchText: string = '';
  allData: any[] = [];
  totalIndenters: number = 0;
  statename = [];
  identor = [];
  seasonList: any = [];
  response_crop_group: any = [];
  data: any;
  filteredData: any[] = [];
  showFilter: boolean = false;
  data1: any;
  custom_array: any[];
  finalData: any[];
  fileName = 'seed-multiplication-ratio-report.xlsx';
  yearOfIndent: any = [
    { name: "2020 - 2021", "value": "2020" }
  ];
  year: any;
  season: any;
  crop: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  // allData: any;
  exportdata: any[];
  crop_groups: any;
  disabledfieldcropName=true;
  crop_names: any;
  seasonListSecond: any;
  response_crop_group_second: any;
  masterData: any[];
  completeData: any[];
  constructor(private breederService: BreederService, private fb: FormBuilder, private service: SeedServiceService, private router: Router) { this.createEnrollForm(); }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      season: ['',],
      crop: ['',],
      year: ['',],
      crop_name_text: ['',],
      crop_text: ['',],      
    });
    // this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue=>{
    //   if(newValue){
    //     this.seasonList =this.seasonListSecond
    //     let response= this.seasonList.filter(x=>x.group_name.toLowerCase().startsWith(newValue.toLowerCase()))
      
    //     this.seasonList=response
      
       
    //   }
    
    // else{
    //   this.getSeasonData()
    // }


    // })
    // this.ngForm.controls['crop_name_text'].valueChanges.subscribe(newValue=>{
    //   if(newValue){
    //     this.response_crop_group =this.response_crop_group_second
    //     let response= this.response_crop_group.filter(x=>x['m_crop.crop_name'].toLowerCase().startsWith(newValue.toLowerCase()))
      
    //     this.response_crop_group=response
      
       
    //   }
    
    // else{
    //   this.onChangeCropGroup(this.ngForm.controls['season'].value)
    // }


    // })
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
  if (newValue) {
    this.seasonList = this.seasonListSecond;

    // split input into words
    const terms = newValue.toLowerCase().split(/\s+/).filter(t => t);

    let response = this.seasonList.filter(x =>
      terms.every(term => x.group_name.toLowerCase().includes(term))  // <-- all words must match
    );

    this.seasonList = response;
  } else {
    this.getSeasonData();
  }
});

this.ngForm.controls['crop_name_text'].valueChanges.subscribe(newValue => {
  if (newValue) {
    this.response_crop_group = this.response_crop_group_second;

    const terms = newValue.toLowerCase().split(/\s+/).filter(t => t);

    let response = this.response_crop_group.filter(x =>
      terms.every(term => x['m_crop.crop_name'].toLowerCase().includes(term))
    );

    this.response_crop_group = response;
  } else {
    this.onChangeCropGroup(this.ngForm.controls['season'].value);
  }
});



  }
  ngOnInit(): void {
    localStorage.setItem('logined_user', "Seed");
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload')
      // location.reload()
    } else {
      localStorage.removeItem('foo')
    }

    this.filterPaginateSearch.itemListPageSize = 50;
    this.getPageData();
    this.getSeasonData();
    this.getCroupCroupList();
    this.runExcelApi();

    
  }

    getPageData(pageNumber: number = 1) {
    this.service.postRequestCreator("view-seed-multiplications", null, {
      page: pageNumber,
      pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      isReport: true,
    }).subscribe((apiResponse: any) => {
      if (apiResponse?.EncryptedResponse?.status_code === 200) {
        this.allData = apiResponse.EncryptedResponse.data.rows || [];
        this.totalIndenters = apiResponse.EncryptedResponse.data.count || this.allData.length;
        this.masterData = [...apiResponse.EncryptedResponse.data.rows];
        this.completeData = [...apiResponse.EncryptedResponse.data.rows];

        console.log("---All Complete 11111111111111111111111111111111111111111*****", this.completeData)
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, this.totalIndenters, true);
        this.initPagination();
      }
    });
  }

    initPagination() {
    if (!this.paginationUiComponent) {
      setTimeout(() => this.initPagination(), 300);
      return;
    }
    this.paginationUiComponent.Init(this.filterPaginateSearch);
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

  submit(loadPageNumberData: number = 1) {
    if (this.ngForm.controls['season'].value || this.ngForm.controls['crop'].value) {

    
      this.season = this.ngForm.controls['season'].value;
      this.crop = this.ngForm.controls['crop'].value;
      this.isSearch=true;

      var object = {
        isSearch: true,
        isReport: true
      }
      this.ngForm.controls['season'].value ? (object['crop_group_code'] = this.ngForm.controls['season'].value) : '';
      this.ngForm.controls['crop'].value ? (object['crop_code'] = this.ngForm.controls['crop'].value) : '';

      this.service
        .postRequestCreator("view-seed-multiplications-by-cropcode", null, {
          page: loadPageNumberData,
          pageSize: this.filterPaginateSearch.itemListPageSize || 50,
          search: object,
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
            this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
            this.initSearchAndPagination();
            this.runExcelApi();
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

  clear() {
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop'].patchValue("");
    this.getPageData();
    this.crop_names='';
    this.crop_groups='';
    this.disabledfieldcropName=true;
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.runExcelApi()
    this.initSearchAndPagination();
  }

  getSeasonData() {
    this.service.postRequestCreator("get-croup-Group-details", null).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : [];
    this.seasonListSecond = this.seasonList
    })
  }

  onChangeCropGroup(formData) {
    this.crop_names='';
    this.disabledfieldcropName=false
    this.ngForm.controls['crop'].patchValue("");
    var object = {
      search:{
        cropGroupCode: formData
      }
    }

    this.service.postRequestCreator("getCropNameofSeedMultiplictionRatioReport", null, object).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows) {
        this.response_crop_group = data.EncryptedResponse.data.rows;
        this.response_crop_group_second  = this.response_crop_group
      }
      else {
        this.response_crop_group = [];
      }
    })

  }
  getCroupCroupList() {
    const route = "crop-group";
    const result = this.service.getPlansInfo(route).then((data: any) => {
      this.response_crop_group = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    })
  }

  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  myFunction1() {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
        openDropdown.classList.remove('show');
    }
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
    var object = {
      isSearch: this.isSearch,
      isReport : true
    }
    this.ngForm.controls['season'].value ? (object['crop_group_code'] = this.ngForm.controls['season'].value) : '';
    this.ngForm.controls['crop'].value ? (object['crop_code'] = this.ngForm.controls['crop'].value) : '';

    this.service
    .postRequestCreator("view-seed-multiplications", null, {
      search: object
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
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheed_multiplication_reports');
    XLSX.writeFile(wb, this.fileName);
  }

  
  download() {  
    let reportDataHeader = [
      { text: 'S/N', bold: true },
    {
       text: 'Crop Group', bold: true }, 
    { text: 'Crop Name', bold: true },
    { text: 'Nucleus to Breeder', bold: true },
     { text: 'Breeder to Foundation I', bold: true },
    { text: 'Foundation I to Foundation II', bold: true },
     { text: 'Foundation II to Certified', bold: true }, 
    
                          ]

    let reportData = this.completeData.map((element, index) => {   
 
    let reportData =  [
            index+1,                 
            element  && element.m_crop && element.m_crop.m_crop_group && element.m_crop.m_crop_group.group_name ? element.m_crop.m_crop_group.group_name : 'NA',
            element   && element.m_crop && element.m_crop.crop_name ? element.m_crop.crop_name : 'NA',
            element&& element.nucleus_to_breeder ? element.nucleus_to_breeder : 'NA',
            element && element.breeder_to_foundation ? element.breeder_to_foundation : 'NA',          
            element && element.foundation_1_to_2 ? element.foundation_1_to_2 : 'NA',          
            element  && element.foundation_2_to_cert ? element.foundation_2_to_cert : 'NA',          
            
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
        { text: 'Seed Multiplication Ratio', style: 'header' },
        // { text: `Crop Group : ${this.crop_groups}   Crop Name : ${this.crop_names}`,  },
        { 
  text: `Crop Group : ${this.crop_groups ? this.crop_groups : 'NA'}   Crop Name : ${this.crop_names ? this.crop_names : 'NA'}`,  
},

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
          
          fontSize: maxFontSize ,
          margin: [0, 5, 0, 15],
        },
      },
    };
    pdfMake.createPdf(docDefinition).download('seed-multiplication-ratio-report.pdf');
  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cnClick() {
    document.getElementById('crop_name').click();
  }

    toggleFilter() {
  this.showFilter = !this.showFilter;
}
  clearSearch() {
    this.searchText = '';
    this.filterPaginateSearch.itemList = [...this.allData];
  }

cropNames(data) {
  if(data === 'all') {
    this.crop_names = 'All';
    this.ngForm.controls['crop'].setValue(''); 
  } else {
    this.crop_names = data['m_crop.crop_name'] || '';
    this.ngForm.controls['crop'].setValue(data['m_crop.crop_code']); 
  }

  this.applyFilterBackend(); 
}
cropGroup(data) {
  if(data === 'all') {
    this.crop_groups = 'All';
    this.ngForm.controls['season'].setValue('');
    this.disabledfieldcropName = true;
    this.ngForm.controls['crop'].setValue('');
    // this.getPageData();
  } else {
    this.crop_groups = data.group_name;
    this.ngForm.controls['season'].setValue(data.group_code);
    this.disabledfieldcropName = false;
    this.ngForm.controls['crop'].setValue(''); 
    this.onChangeCropGroup(data.group_code); 
  }

  this.applyFilterBackend(); 
}

applyFilterBackend1(pageNumber: number = 1) {
  const cropGroup = this.ngForm.controls['season'].value; 
  const cropCode = this.ngForm.controls['crop'].value;

  const searchObj: any = {};
  if(cropGroup) searchObj['crop_group_code'] = cropGroup;
  if(cropCode) searchObj['crop_code'] = cropCode;

  this.service.postRequestCreator("view-seed-multiplications-by-cropcode", null, {
    page: pageNumber,
    pageSize: this.filterPaginateSearch.itemListPageSize || 50,
    search: searchObj,
    isReport: true
  }).subscribe((res: any) => {
    if(res?.EncryptedResponse?.status_code === 200) {
      this.allData = res.EncryptedResponse.data.rows || [];
      this.totalIndenters = res.EncryptedResponse.data.count || this.allData.length;
      this.masterData = [...res.EncryptedResponse.data.rows];
      this.completeData = [...res.EncryptedResponse.data.rows];
      this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, this.totalIndenters, true);
      this.initSearchAndPagination();
      this.runExcelApi();
    } else {
      this.allData = [];
      this.totalIndenters = 0;
      this.filterPaginateSearch.Init([], this, "getPageData", undefined, 0, true);
      this.initSearchAndPagination();
    }
  });
}

applyFilterBackend(loadPageNumberData: number = 1) {

  
    this.season = this.ngForm.controls['season'].value;
    this.crop = this.ngForm.controls['crop'].value;
    this.isSearch=true;

    var object = {
      isSearch: true,
    }
    this.ngForm.controls['season'].value ? (object['crop_group_code'] = this.ngForm.controls['season'].value) : '';
    this.ngForm.controls['crop'].value ? (object['crop_code'] = this.ngForm.controls['crop'].value) : '';

    this.service
      .postRequestCreator("view-seed-multiplications-by-cropcode", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        isReport: true,
        search: object,
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          this.allData = apiResponse.EncryptedResponse.data.rows;
          this.masterData = [...apiResponse.EncryptedResponse.data.rows];
          this.completeData = [...apiResponse.EncryptedResponse.data.rows];
          this.totalIndenters = apiResponse.EncryptedResponse.data.rows.length
          console.log("this.completeData2222222222222222222222222222222", this.completeData)
          if (this.allData === undefined) {
            this.allData = [];
          }
          this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          // this.initSearchAndPagination();
          // this.runExcelApi();
        }
      });
}

onSearch1() {
  const searchLower = this.searchText.toLowerCase().trim();

  if (searchLower === '') {
 
    this.filterPaginateSearch.itemList = [...this.exportdata];
    this.totalIndenters = this.exportdata.length;
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.initSearchAndPagination();
    return;
  }


  this.filterPaginateSearch.itemList = this.exportdata.filter(item =>
    (item.m_crop?.m_crop_group?.group_name && item.m_crop.m_crop_group.group_name.toLowerCase().includes(searchLower)) ||
    (item.m_crop?.crop_name && item.m_crop.crop_name.toLowerCase().includes(searchLower)) ||
    (item.nucleus_to_breeder && item.nucleus_to_breeder.toString().toLowerCase().includes(searchLower)) ||
    (item.breeder_to_foundation && item.breeder_to_foundation.toString().toLowerCase().includes(searchLower)) ||
    (item.foundation_1_to_2 && item.foundation_1_to_2.toString().toLowerCase().includes(searchLower)) ||
    (item.foundation_2_to_cert && item.foundation_2_to_cert.toString().toLowerCase().includes(searchLower))
  );


  this.totalIndenters = this.filterPaginateSearch.itemList.length;
  this.filterPaginateSearch.itemListCurrentPage = 1;
  this.initSearchAndPagination();
}

onSearch(): void {
  if (!this.searchText || this.searchText.trim() === '') {
    // ✅ Reset data if search is empty
    this.completeData = [...this.masterData];
    console.log("---Complete Data", this.completeData);
  } else {
    const lower = this.searchText.toLowerCase();

    this.completeData = this.masterData.filter(item => {
      const agency = item.agency_detail || {};

      return (

        (item.m_crop?.m_crop_group?.group_name && item.m_crop.m_crop_group.group_name.toLowerCase().includes(lower)) ||
    (item.m_crop?.crop_name && item.m_crop.crop_name.toLowerCase().includes(lower)) ||
    (item.nucleus_to_breeder && item.nucleus_to_breeder.toString().toLowerCase().includes(lower)) ||
    (item.breeder_to_foundation && item.breeder_to_foundation.toString().toLowerCase().includes(lower)) ||
    (item.foundation_1_to_2 && item.foundation_1_to_2.toString().toLowerCase().includes(lower)) ||
    (item.foundation_2_to_cert && item.foundation_2_to_cert.toString().toLowerCase().includes(lower))

      );
    });
  }
}




}