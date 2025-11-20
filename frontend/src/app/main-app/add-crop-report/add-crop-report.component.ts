

// import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AddCropSearchComponent } from 'src/app/common/add-crop-search/add-crop-search.component';
// import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
// import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
// import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
// import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
// import Swal from 'sweetalert2';

// import { RestService } from 'src/app/services/rest.service';
// import { SeedServiceService } from 'src/app/services/seed-service.service';
// import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
// import * as XLSX from 'xlsx';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// //pdfMake.vfs = pdfFonts.pdfMake.vfs;


// @Component({
//   selector: 'app-add-crop-report',
//   templateUrl: './add-crop-report.component.html',
//   styleUrls: ['./add-crop-report.component.css']
// })
// export class AddCropReportComponent extends ngbDropdownEvents implements OnInit {


//   @ViewChild(AddCropSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
//   @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;

//   filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
//   allData: any = [];
//   disablefield: boolean = false;
//   deletedId: any;
//   ngForm!: FormGroup;
//   croupGroup: any;
//   selectCrop: any;
//   crop_text_check = 'crop_group';
//   crop_name_check = 'cropName';

//   croupGroupList: any = [];
//   datas: any = [];
//   item: any;
//   response: any = [];
//   response_crop_group: any = [];
//   selectCrop_group: any;
//   fieldsList: SectionFieldType[];
//   formGroup: FormGroup<any>;
//   crop_name_list: any;
//   isCropName: boolean = false;
//   selectCrop_code: any;
//   selectCrop_group_code: any;
//   crop_code: void;
//   crop_name_data: any;
//   fileName = 'add-crop-report-list.xlsx';
//   currentUser: any = {
//     "id": ''
//   }
//   exportdata: any[];
//   response_crop_group_second: any;
//   crop_name_list_second: any;
//   crop_group: any;
//   crop_code_value: any;
//   constructor(private restService: RestService, private router: Router, private fb: FormBuilder, private service: SeedServiceService) {
//     super();
//     if (this.router.url.includes('view')) {
//       this.disablefield = true;
//     }
//     if (this.router.url.includes('edit')) {
//       this.disablefield = false;
//     }
//     this.createEnrollForm();


//   }

//   ngOnInit(): void {


//     const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
//     this.currentUser.id = currentUser.id
//     this.runExcelApi();
//     this.getPageData();
//     this.initProcess();
//     this.getCroupCroupList();
//   }



//   createEnrollForm() {
//     this.ngForm = this.fb.group({
//       crop_group: new FormControl(''),
//       crop_name: new FormControl('',),
//       crop_text: new FormControl('',),
//       name_text: new FormControl('',),


//     });
//     this.ngForm.controls["crop_group"].valueChanges.subscribe(newValue => {
//       if (newValue) {
//         this.selectCrop_group = "";
//         this.ngForm.controls["crop_name"].setValue("");
//       }
//     })
//     this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
//       if (newValue) {
//         console.log(newValue)
//         this.response_crop_group = this.response_crop_group_second
//         let response = this.response_crop_group.filter(x => x.group_name.toLowerCase().startsWith(newValue.toLowerCase()))

//         this.response_crop_group = response
//       }
//       else {
//         this.getCroupCroupList()
//       }
//     });
//     this.ngForm.controls['name_text'].valueChanges.subscribe(newValue => {
//       if (newValue) {
//         console.log(newValue)
//         this.crop_name_list = this.crop_name_list_second
//         let response = this.crop_name_list.filter(x => x.crop_name.toLowerCase().startsWith(newValue.toLowerCase()))

//         this.crop_name_list = response
//       }
//       else {
//         this.getCroupNameList(this.selectCrop_group_code)
//       }
//     });
//   }

//   initProcess() {

//   }

//   getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
//     const userData = localStorage.getItem('BHTCurrentUser');
//     const data = JSON.parse(userData);
//     const user_type = data.user_type

//     this.service
//       .postRequestCreator("getCropListReport", null, {
//         page: loadPageNumberData,
//         pageSize: 50,
//         search: {
//           group_code: this.selectCrop_group_code ? this.selectCrop_group_code : null,
//           crop_code: this.ngForm.controls['crop_name'].value ? this.ngForm.controls['crop_name'].value : null,
//           user_id: this.currentUser.id,
//           user_type: user_type,
//           type: 'report'
//           // pageSize: this.filterPaginateSearch.itemListPageSize || 50,

//         }
//       }
//       )
//       .subscribe((apiResponse: any) => {
//         if (apiResponse !== undefined
//           && apiResponse.EncryptedResponse !== undefined
//           && apiResponse.EncryptedResponse.status_code == 200) {
//           this.filterPaginateSearch.itemListPageSize = 50;
//           this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
//           if (this.allData === undefined) {
//             this.allData = [];
//           }

//           this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
//           this.initSearchAndPagination();
//         }

//       });
//   }
//   crop_name(item: any) {
//     this.selectCrop_group = item.crop_name;
//     console.log("item1", item)
//     this.ngForm.controls["name_text"].setValue("");
//     this.ngForm.controls['crop_name'].setValue(item.crop_code)
//     this.crop_code_value = this.selectCrop_group;
//   }
//   cropGroup(item: any) {
//     console.log('item====>', item);

//     this.selectCrop = item.group_name;
//     this.ngForm.controls['crop_group'].setValue(item.group_name);
//     this.ngForm.controls["crop_text"].setValue("");
//     this.selectCrop_group_code = item.group_code;
//     this.crop_name_data = item.group_name;
//     this.selectCrop_group = ''
//     this.ngForm.controls['crop_name'].setValue('')
//     this.crop_group = this.selectCrop;
//     this.getCroupNameList(item.group_code);
//   }

//   initSearchAndPagination() {
//     if (this.paginationUiComponent === undefined) {
//       setTimeout(() => {
//         this.initSearchAndPagination();
//       }, 300);
//       return;
//     }
//     this.paginationUiComponent.Init(this.filterPaginateSearch);
//   }

//   delete(id: number, cropName: string) {
//     Swal.fire({
//       toast: false,
//       icon: "question",
//       title: "Are You Sure to Delete?",
//       position: "center",
//       showConfirmButton: true,
//       showCancelButton: true,
//       confirmButtonText: "Yes",
//       cancelButtonText: "No",
//       customClass: {
//         title: 'list-action-confirmation-title',
//         actions: 'list-confirmation-action'
//       }
//     }).then(result => {
//       if (result.isConfirmed) {

//         this.service
//           .postRequestCreator("delete-crop-details/" + id, null, null)
//           .subscribe((apiResponse: any) => {
//             if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
//               && apiResponse.EncryptedResponse.status_code == 200) {
//               this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
//             }
//           });
//         Swal.fire({
//           title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
//           icon: 'success',
//           confirmButtonText:
//             'OK',
//         confirmButtonColor: '#E97E15'
//         })
//       }
//     })
//   }


//   getCroupCroupList() {
//     const route = "viewCropGroupReport";
//     const userData = localStorage.getItem('BHTCurrentUser');
//     const data = JSON.parse(userData);
//     const user_type = data.user_type
//     const param = {
//       search: {
//         user_type: user_type,
//         type: 'report'
//       }

//     }
//     const result = this.service.postRequestCreator(route, null, param).subscribe((data: any) => {
//       this.response_crop_group = data['EncryptedResponse'].data.rows;
//       this.response_crop_group_second = this.response_crop_group;
//     })
//   }
//   getCroupNameList(newValue: any) {
//     const route = "distinct-crop-name";
//     const userData = localStorage.getItem('BHTCurrentUser');
//     const data = JSON.parse(userData);
//     const user_type = data.user_type
//     const search = {
//       'search': {
//         'group_code': newValue,
//         user_type: user_type,
//         type: 'report'
//       }
//     }
//     this.service
//       .postRequestCreator(route, null, search)
//       .subscribe((apiResponse: any) => {
//         console.log(apiResponse);

//         if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
//           && apiResponse.EncryptedResponse.status_code == 200) {
//           this.isCropName = true;
//           this.crop_name_list = apiResponse.EncryptedResponse.data;
//           this.crop_name_list_second = this.crop_name_list
//         }
//       });
//   }

//   clear() {

//     this.ngForm.controls["crop_group"].setValue("");
//     this.ngForm.controls["crop_name"].setValue("");
//     this.selectCrop='';
//     this.selectCrop_group_code = '';
//     this.selectCrop_group = '';
//     this.selectCrop_code = ''
//     this.crop_name_list=[];

//     this.isCropName = false;
//     this.filterPaginateSearch.itemListCurrentPage = 1;

//     this.getPageData();
//     this.runExcelApi();
//     this.initSearchAndPagination();
//   }

//   cgClick() {
//     document.getElementById('crop_group').click();
//   }
//   cnclick() {
//     document.getElementById('crop_name').click();
//   }
//   search() {
//     if ((!this.selectCrop && !this.selectCrop_group)) {
//       Swal.fire({
//         title: '<p style="font-size:25px;">Please Select Something.</p>',
//         icon: 'error',
//         confirmButtonText:
//           'OK',
//       confirmButtonColor: '#E97E15'
//       })

//       return;
//     }
//     else {
//       this.filterPaginateSearch.itemListPageSize = 10;
//       this.filterPaginateSearch.itemListCurrentPage = 1;
//       this.getPageData();
//       this.runExcelApi()
//     }


//   }

//   myFunction() {
//     document.getElementById("myDropdown").classList.toggle("show");
//   }

//   onclick = function (event) {
//     if (!event.target.matches('.dropbtn')) {
//       var dropdowns = document.getElementsByClassName("dropdown-content");
//       var i;
//       for (i = 0; i < dropdowns.length; i++) {
//         var openDropdown = dropdowns[i];
//         if (openDropdown.classList.contains('show')) {
//           openDropdown.classList.remove('show');
//         }
//       }
//     }
//   }

//   runExcelApi() {
//     this.service
//       .postRequestCreator("getCropListReport", null, {
//         search: {
//           group_code: this.selectCrop_group_code ? this.selectCrop_group_code : null,
//           crop_code: this.ngForm.controls['crop_name'].value ? this.ngForm.controls['crop_name'].value : null,
//           user_id: this.currentUser.id,
//           pageSize: this.filterPaginateSearch.itemListPageSize || 10,

//         }
//       }
//       )
//       .subscribe((apiResponse: any) => {
//         if (apiResponse !== undefined
//           && apiResponse.EncryptedResponse !== undefined
//           && apiResponse.EncryptedResponse.status_code == 200) {
//           this.filterPaginateSearch.itemListPageSize = 10;
//           this.exportdata = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
//           if (this.exportdata === undefined) {
//             this.exportdata = [];
//           }


//         }
//       });
//   }

//   exportexcel(): void {
//     let element = document.getElementById('excel-table');
//     const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

//     const wb: XLSX.WorkBook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

//     XLSX.writeFile(wb, this.fileName);

//   }

//   cropdatatext() {

//     this.crop_text_check = '';

//   }
//   cropnametext() {

//     this.crop_name_check = '';

//   }
//   download() {
//     let reportDataHeader = [
//       { text: 'S/N', bold: true },
//       {
//         text: 'Crop Group', bold: true
//       },
//       { text: 'Crop Name', bold: true },
//       { text: 'Crop  Type', bold: true },
//       { text: 'Season', bold: true },
//       { text: 'Status', bold: true },
//     ]

//     let reportData = this.exportdata.map((element, index) => {

//       let reportData = [
//         index + 1,
//         element && element.m_crop_group && element.m_crop_group.group_name ? element.m_crop_group.group_name : 'NA',
//         element && element.crop_name ? element.crop_name : 'NA',
//         element && element.crop_code && (element.crop_code.substring(0, 1) == 'A') ? 'Agriculture' : 'Horticulture',
//         element && element.season ? (element.season.trim() === 'R') ? 'RABI' : (element.season.trim() === 'B') ? 'BOTH' : 'KHARIF' : 'NA',
//         element && element.is_active && element.is_active == 1 ? 'ACTIVE' : 'INACTIVE'
//       ]
//       return reportData;
//     })

//     reportData = [[...reportDataHeader], ...reportData]
//     let pageWidth = 1800
//     let numberOfColumn = 10
//     let numberOfCharecter = 30
//     const columnWidth = (pageWidth - (2 * 2) - (1 * numberOfColumn)) / numberOfColumn
//     const maxFontSize = columnWidth / (1 * numberOfCharecter)

//     const docDefinition = {
//       pageOrientation: 'landscape',

//       content: [
//         { text: 'List of Crops', style: 'header' },
//         { text: `Crop Group : ${this.selectCrop}  Crop Name: ${this.selectCrop_group}`,  },

//         {
//           style: 'indenterTable',
//           table: {
//             body:
//               reportData,
//           },
//         },
//       ],

//       styles: {
//         header: {
//           fontSize: 18,
//           bold: true,
//           margin: [0, 0, 0, 10],
//         },
//         subheader: {
//           fontSize: 16,
//           bold: true,
//           margin: [0, 10, 0, 5],
//         },
//         indenterTable: {

//           fontSize: maxFontSize,
//           margin: [0, 5, 0, 15],
//         },
//       },
//     };
//     pdfMake.createPdf(docDefinition).download('list-of-breeders-report.pdf');
//   }
// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AddCropSearchComponent } from 'src/app/common/add-crop-search/add-crop-search.component';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import Swal from 'sweetalert2';

import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-add-crop-report',
  templateUrl: './add-crop-report.component.html',
  styleUrls: ['./add-crop-report.component.css']
})
export class AddCropReportComponent extends ngbDropdownEvents implements OnInit {

  @ViewChild(AddCropSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any = [];
  disablefield: boolean = false;
  deletedId: any;
  ngForm!: FormGroup;
  selectCrop: any;
  crop_text_check = 'crop_group';
  crop_name_check = 'cropName';
  selectCrop_group: any;
  selectCrop_group_code: any;
  crop_name_list: any;
  crop_name_list_second: any;
  isCropName: boolean = false;
  currentUser: any = { id: '' };
  exportdata: any[] = [];
  fileName = 'add-crop-report-list.xlsx';

  constructor(private restService: RestService, private router: Router, private fb: FormBuilder, private service: SeedServiceService) {
    super();
    if (this.router.url.includes('view')) {
      this.disablefield = true;
    }
    if (this.router.url.includes('edit')) {
      this.disablefield = false;
    }
    this.createEnrollForm();
  }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.currentUser.id = currentUser.id;

    this.runExcelApi();
    this.getPageData();
    this.initProcess();
    this.getCroupCroupList();

    //  Default select for OILSEEDADMIN
    if (currentUser.user_type === 'OILSEEDADMIN' || currentUser.username === 'OILSEEDADMIN') {
      this.selectCrop = 'OILSEEDS';
      this.selectCrop_group_code = 'A04';
      this.ngForm.controls['crop_group'].setValue('OILSEEDS');

      // Crop names load karo
      this.getCroupNameList('A04');
    }
    else if (currentUser.user_type === 'PULSESSEEDADMIN' || currentUser.username === 'PULSESSEEDADMIN') {
      this.selectCrop = 'PULSES';
      this.selectCrop_group_code = 'A03';
      this.ngForm.controls['crop_group'].setValue('PULSES');

      // Crop names load karo
      this.getCroupNameList('A03');
    }
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_group: new FormControl(''),
      crop_name: new FormControl(''),
      crop_text: new FormControl(''),
      name_text: new FormControl(''),
    });

    this.ngForm.controls["crop_group"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.selectCrop_group = "";
        this.ngForm.controls["crop_name"].setValue("");
      }
    });

    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.response_crop_group = this.response_crop_group_second;
        this.response_crop_group = this.response_crop_group.filter(x => x.group_name.toLowerCase().startsWith(newValue.toLowerCase()));
      } else {
        this.getCroupCroupList();
      }
    });

    this.ngForm.controls['name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.crop_name_list = this.crop_name_list_second;
        this.crop_name_list = this.crop_name_list.filter(x => x.crop_name.toLowerCase().startsWith(newValue.toLowerCase()));
      } else {
        this.getCroupNameList(this.selectCrop_group_code);
      }
    });
  }

  initProcess() { }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type;

    this.service.postRequestCreator("getCropListReport", null, {
      page: loadPageNumberData,
      pageSize: 50,
      search: {
        group_code: this.selectCrop_group_code ? this.selectCrop_group_code : null,
        crop_code: this.ngForm.controls['crop_name'].value ? this.ngForm.controls['crop_name'].value : null,
        user_id: this.currentUser.id,
        user_type: user_type,
        type: 'report'
      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse?.EncryptedResponse?.status_code == 200) {
        this.filterPaginateSearch.itemListPageSize = 50;
        this.allData = apiResponse.EncryptedResponse.data?.rows || [];
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        this.initSearchAndPagination();
      }
    });
  }

  crop_name(item: any) {
    this.selectCrop_group = item.crop_name;
    this.ngForm.controls['crop_name'].setValue(item.crop_code);
  }

  cropGroup(item: any) {
    this.selectCrop = item.group_name;
    this.ngForm.controls['crop_group'].setValue(item.group_name);
    this.selectCrop_group_code = item.group_code;
    this.selectCrop_group = '';
    this.ngForm.controls['crop_name'].setValue('');
    this.getCroupNameList(item.group_code);
  }

  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => this.initSearchAndPagination(), 300);
      return;
    }
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }

  delete(id: number, cropName: string) {
    Swal.fire({
      icon: "question",
      title: "Are You Sure to Delete?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: { title: 'list-action-confirmation-title', actions: 'list-confirmation-action' }
    }).then(result => {
      if (result.isConfirmed) {
        this.service.postRequestCreator("delete-crop-details/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse?.EncryptedResponse?.status_code == 200) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
      }
    });
  }

  response_crop_group: any[] = [];
  response_crop_group_second: any[] = [];

  getCroupCroupList() {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    const user_type = currentUser.user_type;
    const param = { search: { user_type, type: 'report' } };

    this.service.postRequestCreator("viewCropGroupReport", null, param)
      .subscribe((data: any) => {
        this.response_crop_group = data.EncryptedResponse.data?.rows || [];
        this.response_crop_group_second = this.response_crop_group;
      });
  }

  getCroupNameList(group_code: string, setDefaultFirst: boolean = false) {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    const user_type = currentUser.user_type;
    const param = { search: { group_code, user_type, type: 'report' } };

    this.service.postRequestCreator("distinct-crop-name", null, param)
      .subscribe((apiResponse: any) => {
        if (apiResponse?.EncryptedResponse?.status_code == 200) {
          this.isCropName = true;
          this.crop_name_list = apiResponse.EncryptedResponse.data;
          this.crop_name_list_second = this.crop_name_list;

          // ✅ Default select first crop if OILSEEDADMIN
          if (setDefaultFirst && this.crop_name_list.length > 0) {
            this.ngForm.controls['crop_name'].setValue(this.crop_name_list[0].crop_code);
            this.selectCrop_group = this.crop_name_list[0].crop_name;
          }
        }
      });
  }

  clear() {
    this.ngForm.controls["crop_group"].setValue("");
    this.ngForm.controls["crop_name"].setValue("");
    this.selectCrop = '';
    this.selectCrop_group_code = '';
    this.selectCrop_group = '';
    this.crop_name_list = [];
    this.isCropName = false;
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.getPageData();
    this.runExcelApi();
    this.initSearchAndPagination();
  }

  search() {
    if (!this.selectCrop && !this.selectCrop_group) {
      Swal.fire({ title: '<p style="font-size:25px;">Please Select Something.</p>', icon: 'error', confirmButtonText: 'OK', confirmButtonColor: '#E97E15' });
      return;
    }
    this.filterPaginateSearch.itemListPageSize = 10;
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.getPageData();
    this.runExcelApi();

  }

  runExcelApi() { 

    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type;
    

    console.log("------Excel User Data", user_type)
    this.service.postRequestCreator("getCropListReport", null, {

      // search: {
      //   group_code: this.selectCrop_group_code || null,
      //   crop_code: this.ngForm.controls['crop_name'].value || null,
      //   user_id: this.currentUser.id,
      //   user_type: user_type
      // }

      page: 1,
      pageSize: 50,
      search: {
        group_code: this.selectCrop_group_code ? this.selectCrop_group_code : null,
        crop_code: this.ngForm.controls['crop_name'].value ? this.ngForm.controls['crop_name'].value : null,
        user_id: this.currentUser.id,
        user_type: user_type,
        type: 'report'
      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse?.EncryptedResponse?.status_code == 200) {
        this.exportdata = apiResponse.EncryptedResponse.data?.rows || [];

        console.log("------exportdata", this.exportdata)

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
      { text: 'Crop Group', bold: true },
      { text: 'Crop Name', bold: true },
      { text: 'Crop Type', bold: true },
      { text: 'Season', bold: true },
      { text: 'Status', bold: true },
    ];

    let reportData = this.exportdata.map((element, index) => [
      index + 1,
      element?.m_crop_group?.group_name || 'NA',
      element?.crop_name || 'NA',
      element?.crop_code?.startsWith('A') ? 'Agriculture' : 'Horticulture',
      element?.season?.trim() === 'R' ? 'RABI' : element?.season?.trim() === 'B' ? 'BOTH' : 'KHARIF',
      element?.is_active == 1 ? 'ACTIVE' : 'INACTIVE'
    ]);

    reportData = [[...reportDataHeader], ...reportData];
    const pageWidth = 1800;
    const numberOfColumn = 10;
    const numberOfCharacter = 30;
    const columnWidth = (pageWidth - (2 * 2) - (1 * numberOfColumn)) / numberOfColumn;
    const maxFontSize = columnWidth / numberOfCharacter;

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        { text: 'List of Crops', style: 'header' },
        { text: `Crop Group : ${this.selectCrop}  Crop Name: ${this.selectCrop_group}` },
        {
          style: 'indenterTable',
          table: { body: reportData }
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        indenterTable: { fontSize: maxFontSize, margin: [0, 5, 0, 15] },
      },
    };
    pdfMake.createPdf(docDefinition).download('list-of-breeders-report.pdf');
  }

    cropdatatext() {

    this.crop_text_check = '';

  }
    cgClick() {
    document.getElementById('crop_group').click();
  }
  cnclick() {
    document.getElementById('crop_name').click();
  }

    cropnametext() {

    this.crop_name_check = '';

  }

    myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

}


