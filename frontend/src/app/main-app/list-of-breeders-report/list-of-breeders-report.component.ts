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
  selector: 'app-list-of-breeders-report',
  templateUrl: './list-of-breeders-report.component.html',
  styleUrls: ['./list-of-breeders-report.component.css']
})

export class ListOfBreedersReportComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropGroupData;
  statename = [];
  identor = [];
  ngForm!: FormGroup;

  finalData: any[];
  fileName = 'list-of-breeders-report.xlsx';

  isSearch: boolean = false;
  tableId: any[];
  allData: any;

  state_data: any = [];
  breeder_category_data: any = [];
  exportdata: any[];

  constructor(private breederService: BreederService, private fb: FormBuilder, private service: SeedServiceService, private router: Router, private masterService: MasterService) { this.createEnrollForm(); }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      breeder_category: [''],
      state: [''],

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
    this.getState();
    this.getBreederCategory();
    this.getPageData();
    this.runExcelApi();
  }

  getState() {
    this.state_data = [];
    this.masterService
      .getRequestCreatorNew("getStateDataForSeedTestingLab")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data) {
          this.state_data = apiResponse.EncryptedResponse.data
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

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

    searchData = {
      isSearch: false,
      state_code: undefined,
      category_code: undefined
    }

    this.masterService
      .postRequestCreator("getListOfBreederSeedProductionforReports?usertype=BR", null, {
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
    if (this.ngForm.controls['state'].value || this.ngForm.controls['breeder_category'].value) {

      searchData = {
        isSearch: true
      }
      this.isSearch=true

      this.ngForm.controls['state'].value ? (searchData['state_code'] = this.ngForm.controls['state'].value) : '';
      this.ngForm.controls['breeder_category'].value ? (searchData['category_code'] = this.ngForm.controls['breeder_category'].value) : '';

      this.masterService
        .postRequestCreator("getListOfBreederSeedProductionforReports?usertype=BR", null, {
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
            this.runExcelApi();
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

    this.getPageData();
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.runExcelApi()
    this.initSearchAndPagination();
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
      state_code: undefined,
      category_code: undefined
    }
    
    this.ngForm.controls['state'].value ? (searchData['state_code'] = this.ngForm.controls['state'].value) : '';
    this.ngForm.controls['breeder_category'].value ? (searchData['category_code'] = this.ngForm.controls['breeder_category'].value) : '';


    this.masterService
      .postRequestCreator("getListOfBreederSeedProductionforReports?usertype=BR", null, {
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
          console.log(this.exportdata)
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

  // download() {
  //   const name = 'list-of-breeders-report';
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
    let reportDataHeader = [
      { text: 'S/N', bold: true },
    {
       text: 'Breeders Name', bold: true },
        
       { text: 'Short Name/Display Name', bold: true },
       { text: 'Address', bold: true },
       { text: 'Nodal Officer Name', bold: true },
       { text: 'Nodal Officer Designation', bold: true },
       { text: 'Mobile Number', bold: true },
        { text: 'Email Address', bold: true },
       { text: 'Bank Name', bold: true },
       { text: 'Branch Name', bold: true },
       { text: 'IFSC Code', bold: true },
    { text: 'Account Number', bold: true },
     { text: 'Latitude', bold: true }, 
     { text: 'Longitute', bold: true }, 
                          ]

    let reportData = this.exportdata.map((element, index) => {   
 
    let reportData =  [
            index+1,
            element &&  element.name ? element.name : 'NA',
            element &&  element.agency_detail && element.agency_detail.short_name ? element.agency_detail.short_name : 'NA',        
            element &&  element.agency_detail && element.agency_detail.address ? element.agency_detail.address : 'NA',        
            element &&  element.agency_detail && element.agency_detail.contact_person_name ? element.agency_detail.contact_person_name : 'NA',        
            element &&  element.agency_detail && element.agency_detail.contact_person_designation ? element.agency_detail.contact_person_designation : 'NA',
            element && element.mobile_number ? element.mobile_number:'NA',
            element && element.email_id ? element.email_id:'NA',
            element &&  element.agency_detail && element.agency_detail.bank_name ? element.agency_detail.bank_name : 'NA',        
            element &&  element.agency_detail && element.agency_detail.bank_branch_name ? element.agency_detail.bank_branch_name : 'NA',        
            element &&  element.agency_detail && element.agency_detail.bank_ifsc_code ? element.agency_detail.bank_ifsc_code : 'NA',        
            element &&  element.agency_detail && element.agency_detail.bank_account_number ? element.agency_detail.bank_account_number : 'NA',        
            element &&  element.agency_detail && element.agency_detail.latitude ? element.agency_detail.latitude : 'NA',        
            element &&  element.agency_detail && element.agency_detail.longitude ? element.agency_detail.longitude : 'NA',        

            
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
        { text: 'List of Breeders', style: 'header' },
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
    pdfMake.createPdf(docDefinition).download('list-of-breeders-report.pdf');
  }
}