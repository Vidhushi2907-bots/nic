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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-maximum-lot-size-for-each-crop-report',
  templateUrl: './maximum-lot-size-for-each-crop-report.component.html',
  styleUrls: ['./maximum-lot-size-for-each-crop-report.component.css']
})

export class MaximumLotSizeForEachCropReportComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropGroupData;
  statename = [];
  searchText: string = '';
  identor = [];
  totalIndenters: number = 0;
  ngForm!: FormGroup;
  seasonList: any = [];
  response_crop_group: any = [];
  data: any;
  data1: any;
  showFilter: boolean = false;
  custom_array: any[];
  finalData: any[];
  fileName = 'Crop-Wise-Maximum-Lot-Size-report.xlsx';
  year: any;
  
  group_code: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  allData: any;
  filteredData: any[] = [];
  searchTerm: string = '';
  getCropNameListArr: any;
  exportdata: any[];
  selectCrop: any;
  crop_name_data: any;
  selectCrop_group: string;
  selectCrop_group_code: any;
  crop_text_check='crop_group';
  crop_name_check='cropName';
  selectCrop_name;
  isCropName=false;
  seasonListsecond: any;
  getCropNameListArrSecond: any;
  masterData: any[];
  completeData: any[];
  constructor(private breederService: BreederService, private fb: FormBuilder, private service: SeedServiceService, private router: Router) { this.createEnrollForm(); }
  createEnrollForm() {
    this.ngForm = this.fb.group({

       group_code: ['All'],  // default All
  crop_name: ['All'],

      crop_text:[''],
      name_text:['']
    });

    this.ngForm.controls['group_code'].valueChanges.subscribe(newValue => {
  if (newValue && newValue !== 'All') {
    this.getCropName(newValue);
    this.isCropName = true;
    this.selectCrop_name = '';
    this.ngForm.controls['crop_name'].setValue('All'); 
  } else {
    this.isCropName = false;
    this.ngForm.controls['crop_name'].setValue('All'); 
    this.getPageData(); 
  }
  this.autoSubmit(); 
});
this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
  if (newValue) {
    this.autoSubmit(); 
  }
});
     this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
    if (newValue) {
      const terms = newValue.toLowerCase().split(/\s+/).filter(t => t);

      this.seasonList = this.seasonListsecond.filter(x =>
        terms.every(term =>
          x.group_name.toLowerCase().includes(term) ||
          x.group_name.toLowerCase().split(/\s+/).some(word => word.startsWith(term))
        )
      );
    } else {
      this.getGroupCode(); // reset full list
    }
  });


      this.ngForm.controls['name_text'].valueChanges.subscribe(newValue => {
    if (newValue) {
      const terms = newValue.toLowerCase().split(/\s+/).filter(t => t);

      this.getCropNameListArr = this.getCropNameListArrSecond.filter(x =>
        terms.every(term =>
          x['m_crop.crop_name'].toLowerCase().includes(term) ||
          x['m_crop.crop_name'].toLowerCase().split(/\s+/).some(word => word.startsWith(term))
        )
      );
    } else {
      this.getCropName(this.ngForm.controls['group_code'].value); // reset list
    }
  });
    
  }
  ngOnInit(): void {
    this.loadData();

    this.filterPaginateSearch.itemListPageSize = 80;
    this.getPageData();
    this.getGroupCode();
    this.runExcelApi();
      this.filterPaginateSearch.itemListPageSize = 80;
  }

  

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    searchData = { isSearch: false, isReport: true };

  this.service
    .postRequestCreator("get-crop-max-lot-size-data", null, {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      search: searchData
    })
    .subscribe((apiResponse: any) => {
      if (apiResponse?.EncryptedResponse?.status_code == 200) {
        this.allData = apiResponse.EncryptedResponse.data.rows || [];
        this.totalIndenters = apiResponse.EncryptedResponse.data.rows.length;
        this.masterData = [...apiResponse.EncryptedResponse.data.rows];
        this.completeData = [...apiResponse.EncryptedResponse.data.rows]; 

        // init with full data at first
        // this.applyFilter(this.allData);
      }
    });

    searchData = {
      isSearch: true,
      isReport: true
    }

    this.service
      .postRequestCreator("get-crop-max-lot-size-data", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        search: searchData
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          this.allData = apiResponse.EncryptedResponse.data.rows;
          this.masterData = [...apiResponse.EncryptedResponse.data.rows];
         this.completeData = [...apiResponse.EncryptedResponse.data.rows]; 

         console.log("completeData", this.completeData)

          if (this.allData === undefined) {
            this.allData = [];
          }
          console.log(this.allData)
          this.totalIndenters = apiResponse.EncryptedResponse.data.rows.length;
          this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
        }
      });
  }

  applyFilter(data: any[]) {
  this.filterPaginateSearch.Init(
    data,
    this,
    "getPageData",
    undefined,
    data.length,
    true
  );
  this.initSearchAndPagination();
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
    if ( this.ngForm.controls['group_code'].value || this.ngForm.controls['crop_name'].value) {
      var searchData = {
        isSearch: true
      }
      this.isSearch=true;

      // this.ngForm.controls['year'].value ? (searchData['year'] = this.ngForm.controls['year'].value) : '';
      this.ngForm.controls['group_code'].value ? (searchData['group_code'] = this.ngForm.controls['group_code'].value) : '';
      this.ngForm.controls['crop_name'].value ? (searchData['crop_name'] = this.ngForm.controls['crop_name'].value) : '';

      this.service
        .postRequestCreator("get-crop-max-lot-size-data", null, {
          page: loadPageNumberData,
          pageSize: this.filterPaginateSearch.itemListPageSize || 10,
          search: searchData
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

onSearch1() {
  const term = this.searchTerm.toLowerCase().trim();

  if (!term) {
    this.filterPaginateSearch.itemList = [...this.allData];
  } else {
    this.filterPaginateSearch.itemList = this.allData.filter(item =>
      (item?.m_crop?.m_crop_group?.group_name || '').toLowerCase().includes(term) ||
      (item?.m_crop?.crop_name || '').toLowerCase().includes(term) ||
      (item?.crop || '').toLowerCase().includes(term) ||
      (item?.max_lot_size || '').toString().toLowerCase().includes(term)
    );
  }
  this.totalIndenters = this.filterPaginateSearch.itemList.length;
  this.filterPaginateSearch.itemListCurrentPage = 1;

  this.initSearchAndPagination();
  
}

onSearch() {
  if (!this.searchTerm || this.searchTerm.trim() === '') {
    this.completeData = [...this.masterData];
    console.log("-Masetr Data", this.completeData)

  } else {
    const lower = this.searchTerm.toLowerCase();
    this.completeData = this.masterData.filter(x =>
      (x?.m_crop?.m_crop_group?.group_name || '').toLowerCase().includes(lower) ||
      (x?.m_crop?.crop_name || '').toLowerCase().includes(lower) ||
      (x?.crop || '').toLowerCase().includes(lower) ||
      (x?.max_lot_size || '').toString().toLowerCase().includes(lower)
    );
  }

  console.log("-COmplate Data", this.completeData)
}

loadData() {
  this.breederService.getMaximumLotSizeForEachCropReport().subscribe((res: any) => {
    this.allData = res;
    this.filterPaginateSearch.itemList = [...this.allData];
    this.filterPaginateSearch.itemList = this.allData;
    this.totalIndenters = this.allData.length;
    this.initSearchAndPagination();
  });
}



  clear() {
    // this.ngForm.controls['year'].patchValue("");
    this.ngForm.controls['group_code'].patchValue("");
    this.selectCrop_name='';
    this.selectCrop='';
    this.ngForm.controls['crop_name'].patchValue("");
    this.getPageData();
    this.isCropName=false;
    this.isSearch=true;
    this.runExcelApi()
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.initSearchAndPagination();
  }

  getGroupCode() {
    this.service
      .postRequestCreator("get-croup-Group-details", null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data) {
          this.seasonList = apiResponse.EncryptedResponse.data;
          this.seasonListsecond = this.seasonList
        }
      });
  }

  getCropName(value) {
    const param ={
      search:{
        cropGroupCode:value
      }
    }
    this.service
      .postRequestCreator("getCropNameforMaxLotSize", null,param)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows) {
          this.getCropNameListArr = apiResponse.EncryptedResponse.data.rows;
          this.getCropNameListArrSecond = this.getCropNameListArr
        }
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
  runExcelApi(loadPageNumberData: number = 1, searchData: any | undefined = undefined){

    searchData = {
      isSearch: this.isSearch
    }

   
    this.ngForm.controls['group_code'].value ? (searchData['group_code'] = this.ngForm.controls['group_code'].value) : '';
    this.ngForm.controls['crop_name'].value ? (searchData['crop_name'] = this.ngForm.controls['crop_name'].value) : '';

    this.service
      .postRequestCreator("get-crop-max-lot-size-data", null, {
        search: searchData
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.exportdata = apiResponse.EncryptedResponse.data.rows;
          if (this.exportdata === undefined) {
            this.exportdata = [];
          }
          console.log(this.exportdata)
          this.filterPaginateSearch.Init(this.exportdata, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
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
    let reportDataHeader = [
      { text: 'S/N', bold: true },
    {
       text: 'Crop Group', bold: true }, 
    { text: 'Crop Name', bold: true },
    { text: 'Maximum LOT Size', bold: true },
    
    
                          ]

    let reportData = this.completeData.map((element, index) => {   
 
    let reportData =  [
            index+1,                 
            element  && element.m_crop && element.m_crop.m_crop_group && element.m_crop.m_crop_group.group_name ? element.m_crop.m_crop_group.group_name : 'NA',
            element   && element.crop  ? element.crop : 'NA',
            element&& element.max_lot_size ? element.max_lot_size : 'NA' + 
            element.crop_code.split('')[0] == 'H' ? 'Kg':
            'Quintal'
            
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
        { text: 'Crope Wise Maximum Lot Size', style: 'header' },
        // { text: ` Crop Group: ${this.selectCrop}  Crop Name: ${this.selectCrop_name}`,  },
        { 
  text: `Crop Group : ${this.selectCrop ? this.selectCrop : 'NA'}   Crop Name : ${this.selectCrop_name ? this.selectCrop_name : 'NA'}`,  
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
    pdfMake.createPdf(docDefinition).download('crop-wise-maximum-report.pdf');
  }

  cropdatatext(){
 
    this.crop_text_check='';
  
  }
  cropnametext(){
   
    this.crop_name_check='';
  
  }
  
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cnclick() {
    document.getElementById('crop_name').click();
  }

  toggleFilter() {
  this.showFilter = !this.showFilter;
}
autoSubmit(loadPageNumberData: number = 1) {
  let searchData: any = { isSearch: true, isReport: true };

  if (this.ngForm.controls['group_code'].value && this.ngForm.controls['group_code'].value !== 'All') {
    searchData['group_code'] = this.ngForm.controls['group_code'].value;
    searchData['isSearch'] = true;
  }

  if (this.ngForm.controls['crop_name'].value && this.ngForm.controls['crop_name'].value !== 'All') {
    searchData['crop_name'] = this.ngForm.controls['crop_name'].value;
    searchData['isSearch'] = true;
  }

  this.service
    .postRequestCreator("get-crop-max-lot-size-data", null, {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      search: searchData
    })
    .subscribe((apiResponse: any) => {
      if (apiResponse?.EncryptedResponse?.status_code == 200) {
        this.allData = apiResponse.EncryptedResponse.data.rows || [];
        this.masterData = [...apiResponse.EncryptedResponse.data.rows];
        this.completeData = [...apiResponse.EncryptedResponse.data.rows]; 
        this.totalIndenters = apiResponse.EncryptedResponse.data.rows.length;

        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        this.initSearchAndPagination();
      }
    });
}
cropGroup(data: any) {
  this.selectCrop = data.group_name;
  this.ngForm.controls['group_code'].setValue(data.group_code);

  if (data.group_code === 'All') {
    this.isCropName = false;
    this.selectCrop_name = 'All';
    this.ngForm.controls['crop_name'].setValue('All');
    this.searchTerm = ''
    // this.getPageData();
  } else {
    this.getCropName(data.group_code);
    this.isCropName = true;
    this.selectCrop_name = '';
    this.searchTerm = ''

  }

  this.autoSubmit(); 
}

crop_name(data: any) {
  this.selectCrop_name = data['m_crop.crop_name'];
  this.ngForm.controls['crop_name'].setValue(data['m_crop.crop_code']);

  if (data['m_crop.crop_code'] === 'All') {
    // this.getPageData(); 
    this.autoSubmit();
    this.searchTerm = ''

  } else {
    this.autoSubmit();
    this.searchTerm = ''
 
  }
}


}
