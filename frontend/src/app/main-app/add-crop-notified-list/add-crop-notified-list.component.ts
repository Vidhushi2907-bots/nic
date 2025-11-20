import { Component, OnInit, Query, QueryList, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedDivisionComponent } from 'src/app/common/seed-division/seed-division.component';
import { MasterService } from 'src/app/services/master/master.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedDivisionService } from 'src/app/services/seed-division/seed-division.service';
import Swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-add-crop-notified-list',
  templateUrl: './add-crop-notified-list.component.html',
  styleUrls: ['./add-crop-notified-list.component.css']

})
export class AddCropNotifiedListComponent implements OnInit {

  @ViewChild(SeedDivisionComponent) SeedDivisionComponent: SeedDivisionComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) pagitationUiComponent!: PaginationUiComponent;

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  selectCrop: any;
  ngForm!: FormGroup;
  croupGroupList: any = [];
  countData: any;
  cropData: any;
  cropVarietyData: any;
  cropName = [];
  cropNameList: any;
  datas: any;
  disabledfield = true;
  currentUser: any = {
    "id": ''
  }
  crop_groups;
  crop_names;
  notifiedVvalue: any;
  listOfItems = [
    { id: 1, name: 'Vilnius' },
    { id: 2, name: 'Kaunas' },
    { id: 3, name: 'Pavilnys' },
    { id: 4, name: 'Pabradė' },
    { id: 5, name: 'Klaipėda' }
  ];
  variety_names;
  disabledfieldcropName = true;
  disabledfieldVariety = true;
  cropDataSecond: any;
  cropNameListSecond: any;
  cropVarietyDatasecond: any;
  notifiedValue: any;
  disableFileds: boolean = true;
  variety_name_filter: any;
  isStatusActive: boolean | undefined;
  asc_icon: boolean = true;
  desc_icon: boolean = false;
  sort_value: any;
  not_asc_icon: boolean = true;
  not_desc_icon: boolean = false;
  not_sort_value: any;
  fileName = 'add-crop-notified-list-report.xlsx';
  exportdata: any[];
  selectCrop_group: any;
  userType: any;
  isActionBtnDisable: boolean;
  constructor(private restService: RestService, private fb: FormBuilder,
    private _service: SeedDivisionService,
    private _masterService: MasterService, private _master: MasterService) {
    this.createEnrollForm();
    this.userType = this._master?.userBasicData?.user_type ?? 'NA';
    this.isActionBtnDisable = this.userType === 'SUPERADMIN';
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_group: new FormControl(''),
      season: new FormControl('',),
      crop_name: new FormControl('',),
      variety_name: new FormControl('',),
      seed_ratio: new FormControl('',),
      crop_text: new FormControl('',),
      crop_name_text: new FormControl('',),
      variety_name_text: new FormControl('',),
      variety_name_filter: new FormControl('', [Validators.minLength(3)]),
      status_check_filter: new FormControl('',),
      not_number: new FormControl('', [Validators.minLength(2)]),

    });

    this.ngForm.controls['crop_group'].valueChanges.subscribe(newValue => {
      if (newValue) {

        this.getCropNameList(newValue);
        this.disabledfieldcropName = false;
        this.ngForm.controls['crop_name'].enable();
        this.ngForm.controls["crop_name"].setValue("");
        this.ngForm.controls["variety_name"].setValue("");
        this.ngForm.controls["variety_name"].disable()
        this.crop_names = ''
        this.variety_names = ''
      }
      else {
        this.ngForm.controls["crop_name"].disable()
      }
    });

    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls["variety_name"].setValue("");
        this.ngForm.controls['variety_name'].enable()
        this.getCropVarietyData(newValue);
        this.disabledfieldVariety = false
        this.variety_names = ''
      }
      else {
        this.ngForm.controls["variety_name"].disable()
      }
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.cropData = this.cropDataSecond
        let response = this.cropData.filter(x => x.group_name.toLowerCase().includes(newValue.toLowerCase()))

        this.cropData = response


      }
      else {
        this.getCropData()
      }
    });
    this.ngForm.controls['crop_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {

        this.cropNameList = this.cropNameListSecond;
        // this.cropNameList= this.cropNameList.filter(x=>x.crop_name!=null)
        let response = this.cropNameList.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))

        this.cropNameList = response


      }
      else {

        this.getCropNameList(this.ngForm.controls['crop_group'].value)
      }
    });
    this.ngForm.controls['variety_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {

        this.cropVarietyData = this.cropVarietyDatasecond
        let response = this.cropVarietyData.filter(x => x.variety_name.toLowerCase().includes(newValue.toLowerCase()))
        this.cropVarietyData = response


      }
      else {

        this.getCropVarietyData(this.ngForm.controls['crop_name'].value)
      }
    });
    this.ngForm.controls['variety_name_filter'].valueChanges.subscribe(newValue => {
      if (newValue) {
        if (newValue.length >= 3) {
          this.getPageData();
        }
      }
    });

  }
  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.currentUser.id = currentUser.id

    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   // location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    this.filterPaginateSearch.itemListPageSize = 50;

    this.getPageData();
    this.getCropData();

    this.ngForm.controls['crop_name'].disable()
    this.ngForm.controls['variety_name'].disable()
    // this.getCropVarietyData();
    // this.getCropNameList();
  }


  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this._service
      .postRequestCreator("get-crop-veriety-data", {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        search: {
          cropGroup: this.ngForm.controls['crop_group'].value,
          crop_code: this.ngForm.controls['crop_name'].value,
          variety_code: this.ngForm.controls['variety_name'].value,
          variety_name: this.ngForm.controls['variety_name_filter'].value ? this.ngForm.controls['variety_name_filter'].value : '',
          user_id: this.currentUser.id,
          is_status_active: this.ngForm.controls['status_check_filter'].value == 1 ? '1' : this.ngForm.controls['status_check_filter'].value == 2 ? '0' : null,
          not_number: this.ngForm.controls['not_number'].value,
          sort_value: this.sort_value,
          not_sort_value: this.not_sort_value,
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          let data = []
          let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
          data.push(allData)
          // d)
          let abc = data.flat();
          let arr;

          // arr = abc.sort(a => a.m_crop && a.m_crop.crop_name ? a.m_crop.crop_name : '');


          if (allData === undefined) {
            allData = [];
          }
          // if(abc){

          //   abc =  abc.sort((a, b) => a.m_crop.m_crop_group.group_name.localeCompare(b.m_crop.m_crop_group.group_name)
          //    || a.m_crop.crop_name.localeCompare(b.m_crop.crop_name) ||
          //    a.variety_name.localeCompare(b.variety_name)
          //    );
          // }

          this.filterPaginateSearch.Init(abc, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);

          //  if(abc){

          //   abc =  abc.sort((a, b) => a.m_crop.m_crop_group.group_name.localeCompare(b.m_crop.m_crop_group.group_name)
          //    || a.m_crop.crop_name.localeCompare(b.m_crop.crop_name) ||
          //    a.variety_name.localeCompare(b.variety_name)
          //    );
          // }
          this.initSearchAndPagination();
          // this.getCropNameLists();
          // this.datas = allData;

        }
      });
  }

  initSearchAndPagination() {
    // this.SeedDivisionComponent === undefined || 
    if (this.pagitationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.pagitationUiComponent.Init(this.filterPaginateSearch);
    // this.SeedDivisionComponent.Init(this.filterPaginateSearch);
  }

  delete(id: number) {
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure To Delete?",
      position: "center",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        title: 'list-action-confirmation-title',
        actions: 'list-confirmation-action'
      }
    }).then(result => {
      if (result.isConfirmed) {
        this._service
          .postRequestCreator("delete-nget-crop-veriety-data/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          showCancelButton: false,
          confirmButtonColor: '#E97E15'
        })
      }
    })
  }

  notifiedvalue(value) {
    this.ngForm.controls["crop_group"].setValue("");
    this.ngForm.controls["crop_name"].setValue("");
    this.ngForm.controls["variety_name"].setValue("");
    this.ngForm.controls["variety_name_filter"].setValue("");
    this.ngForm.controls['crop_text'].setValue('')
    this.ngForm.controls['crop_name_text'].setValue('');
    this.variety_names = '';
    this.crop_names = '';
    this.crop_groups = '';
    this.cropNameList = [];
    this.cropVarietyData = [];
    this.getPageData();
    if (value == 'notified') {
      this.disableFileds = true
    }

    if (value == 'non_notified') {
      this.disableFileds = false
    }

  }

  search() {
    if (this.ngForm.controls['variety_name_filter'].invalid) {
      Swal.fire({
        title: '<p style="font-size:25px;">Variety Name Should Be More Than 2 Character.</p>',
        icon: 'success',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    else if (this.ngForm.controls['not_number'].invalid) {
      Swal.fire({
        title: '<p style="font-size:25px;">Notification No. Should Be More Than 2 Character.</p>',
        icon: 'success',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    if (this.disableFileds) {
      if (this.ngForm.controls['status_check_filter'].value || this.ngForm.controls['not_number'].value) {
        this.filterPaginateSearch.itemListCurrentPage = 1;
        this.initSearchAndPagination();
        this.getPageData();
        // this.runExcelApi()
      }

      else if ((!this.ngForm.controls["crop_group"].value && !this.ngForm.controls["crop_name"].value && !this.ngForm.controls["variety_name"].value)) {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Select Something.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })

        return;
      }
      else {
        this.filterPaginateSearch.itemListCurrentPage = 1;
        this.initSearchAndPagination();
        this.getPageData();
        this.runExcelApi()
      }
    }
    else {
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination();
      this.getPageData();
      this.runExcelApi()
    }
  }

  clear() {
    this.asc_icon = true;
    this.desc_icon = false;
    this.not_asc_icon = true;
    this.not_desc_icon = false;
    this.sort_value = null;
    this.not_sort_value = null;

    this.ngForm.controls['crop_text'].setValue('')
    this.ngForm.controls['crop_name_text'].setValue('');
    this.ngForm.controls['status_check_filter'].setValue("");
    this.ngForm.controls['not_number'].setValue("");
    if (this.ngForm.controls["crop_group"].value)
      this.ngForm.controls["crop_group"].setValue("");
    if (this.ngForm.controls["variety_name_filter"].value)
      this.ngForm.controls["variety_name_filter"].setValue("");
    if (this.ngForm.controls["crop_name"].value)
      this.ngForm.controls["crop_name"].setValue("");
    if (this.ngForm.controls["variety_name"].value)
      this.ngForm.controls["variety_name"].setValue("");

    this.variety_names = '';
    this.crop_names = '';
    this.crop_groups = '';
    this.disabledfieldcropName = true;
    this.disabledfieldVariety = true;

    this.getPageData();
    this.ngForm.controls['crop_name'].disable()
    this.ngForm.controls['variety_name'].disable()

    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.initSearchAndPagination();
    // this.getCropNameList('we34');
    // this.getCropVarietyData('ew324');
  }


  async getCropData() {
    this._service
      .postRequestCreator("crop-group")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.cropData = apiResponse.EncryptedResponse.data;
          this.cropDataSecond = this.cropData ? this.cropData : ""
        }
      });

  }

  async getCropNameList(newValue) {
    if (newValue) {
      const searchFilters = {
        "search": {
          "group_code": newValue,
          "cropNameRaw": true
        }
      };

      this._service
        .postRequestCreator("get-distrinct-seed-variety-crop-name", searchFilters, null)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            // this.cropName = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data  ? apiResponse.EncryptedResponse.data :'' ;
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data.rows.length > 0) {
              // this.cropName = apiResponse.EncryptedResponse.data.rows;
              // console.log('this.cropName ===========>',this.cropName );
              this.cropNameList = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
              this.cropNameListSecond = this.cropNameList
            }
            else {
              this.cropNameList = []
            }


          }
          else {

            this.cropNameList = []
          }
        });
    } else {
      this.ngForm.controls["crop_group"].setValue("");
      this.ngForm.controls["crop_name"].setValue("");
      this.ngForm.controls["variety_name"].setValue("");
    }

  }



  async getCropVarietyData(newValue) {

    if (newValue) {
      const searchFilters = {
        "search": {
          "crop_code": newValue,
          "cropGroup": this.ngForm.controls["crop_group"].value
        }
      };
      this._service
        .postRequestCreator("get-distrinct-variety-name", searchFilters, null)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {

            this.cropVarietyData = apiResponse.EncryptedResponse.data.rows;
            this.cropVarietyData = this.cropVarietyData.sort((a, b) => a.variety_name.localeCompare(b.variety_name))
            this.cropVarietyDatasecond = this.cropVarietyData
          }
        });
    } else {
      this.ngForm.controls["crop_name"].setValue("");
      this.ngForm.controls["variety_name"].setValue("");
    }

  }

  onSubmit() {

  }
  cropGroup(data) {
    this.crop_groups = data && data.group_name ? data.group_name : '';
    this.cropData = this.cropDataSecond;
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.ngForm.controls['crop_group'].setValue(data && data.group_code ? data.group_code : '')

  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cropNames(data) {

    this.crop_names = data && data.crop_name ? data.crop_name : '';
    // { emitEvent: false }
    this.cropNameList = this.cropNameListSecond;
    this.ngForm.controls['crop_name_text'].setValue('', { emitEvent: false })
    this.ngForm.controls['crop_name'].setValue(data && data.crop_code ? data.crop_code : '')

  }
  cnClick() {
    document.getElementById('crop_name').click();
  }
  cvClick() {
    document.getElementById('variety_name').click();
  }
  varietyNames(data) {
    this.variety_names = data && data.variety_name ? data.variety_name : '';
    this.cropVarietyData = this.cropVarietyDatasecond
    this.ngForm.controls['variety_name_text'].setValue('', { emitEvent: false })
    this.ngForm.controls['variety_name'].setValue(data && data.variety_code ? data.variety_code : '')
  }

  changeStatus(data: any) {

    if (data.is_status_active == true) {
      data.is_status_active = false;
    } else {
      data.is_status_active = true;
    }

    let param = {
      id: data.id,
      is_status_active: data.is_status_active == false ? 0 : 1
    };
    this._service
      .postRequestCreator("isStatusUpdate", param, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {

          // this.cropVarietyData = apiResponse.EncryptedResponse.data.rows;
          // this.cropVarietyData = this.cropVarietyData.sort((a, b) => a.variety_name.localeCompare(b.variety_name))
          // this.cropVarietyDatasecond = this.cropVarietyData
        }
      });



  }


  short_data(value: any) {
    this.sort_value = value;
    this.getPageData()
    if (value == 'ASC') {
      this.asc_icon = false
      this.desc_icon = true
    }
    else {
      this.asc_icon = true
      this.desc_icon = false
    }
  }

  not_short_data(value: any) {
    this.not_sort_value = value;
    this.getPageData()
    if (value == 'ASC') {
      this.not_asc_icon = false
      this.not_desc_icon = true
    }
    else {
      this.not_asc_icon = true
      this.not_desc_icon = false
    }
  }
  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
    this.runExcelApi();
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
    this._service
      .postRequestCreator("get-crop-veriety-data", {
        search: {
          cropGroup: this.ngForm.controls['crop_group'].value,
          crop_code: this.ngForm.controls['crop_name'].value,
          variety_code: this.ngForm.controls['variety_name'].value,
          variety_name: this.ngForm.controls['variety_name_filter'].value ? this.ngForm.controls['variety_name_filter'].value : '',
          user_id: this.currentUser.id,
          is_status_active: this.ngForm.controls['status_check_filter'].value == 1 ? '1' : this.ngForm.controls['status_check_filter'].value == 2 ? '0' : null,
          not_number: this.ngForm.controls['not_number'].value,
          sort_value: this.sort_value,
          not_sort_value: this.not_sort_value,
          pageSize: this.filterPaginateSearch.itemListPageSize || 10,

        }
      }
      )
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 10;
          let data = []
          this.exportdata = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
          data.push(this.exportdata)
          let abc = data.flat();
          let arr;

          if (this.exportdata === undefined) {
            this.exportdata = [];
          }

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
        text: 'Crop Group', bold: true
      },
      { text: 'Crop Name', bold: true },
      { text: 'Variety Name', bold: true },
      { text: 'Type', bold: true },
      { text: 'Notification Date', bold: true },
      { text: 'Notification No.', bold: true },
      { text: 'Meeting No.', bold: true },
      { text: 'Status', bold: true },
    ]

    let reportData = this.exportdata.map((element, index) => {

      let reportData = [
        index + 1,
        element && element.m_crop && element.m_crop.m_crop_group && element.m_crop.m_crop_group.group_name ? element.m_crop.m_crop_group.group_name : 'NA',
        element && element.m_crop && element.m_crop.crop_name ? element.m_crop.crop_name : 'NA',
        element && element.variety_name ? element.variety_name : 'NA',
        element && element.type ? element.type : 'NA',
        element && element.type ? element.type : 'NA',
        element && element.not_number ? element.not_number : 'NA',
        element && element.meeting_number ? element.meeting_number : 'NA',
        element && element.is_active && element.is_active == 1 ? 'ACTIVE' : 'INACTIVE'
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
        { text: 'List of Crops', style: 'header' },
        { text: `Crop Group : ${this.selectCrop}  Crop Name: ${this.selectCrop_group}`, },

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
    pdfMake.createPdf(docDefinition).download('add-crop-notified-list-report.pdf');
  }


}

