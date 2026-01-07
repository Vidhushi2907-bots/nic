
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ZsrmServiceService } from 'src/app/services/zsrm-service.service';
import { MasterService } from 'src/app/services/master/master.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';

@Component({
  selector: 'app-zsrm-req-qs',
  templateUrl: './zsrm-req-qs.component.html',
  styleUrls: ['./zsrm-req-qs.component.css']
})
export class ZsrmReqQsComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any = [];
  allDistrictData: any = [];
  is_update: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  varietyList: any[] = [];
  varietyData: any[] = [];
  fileName = 'fs-req.xlsx';
  showOtherInputBox = false;
  inventoryYearData = [
    { year: '2026-27', value: '2026-27' },
    { year: '2025-26', value: '2025-26' },
    { year: '2024-25', value: '2024-25' },
    { year: '2023-24', value: '2023-24' },
    { year: '2022-23', value: '2022-23' },
    { year: '2021-22', value: '2021-22' },
    { year: '2020-21', value: '2020-21' },
    { year: '2019-20', value: '2019-20' },
    { year: '2018-19', value: '2018-19' },
  ];
  inventorySeasonData = ['Kharif', 'Rabi'];
  cropData: any[] = [];
  districtData: { district_name: string; district_code: string }[] = [];
  allDirectIndentsData: any[] = [];
  allSpaData: any[] = [];
  submitted = false;
  dataId: any;
  distDataId: any;
  authUserId: any;
  isVarietySelected = false;
  isEditMode: boolean = false;
  isShowTable = false;
  varietyAndQuantity: any[] = [];
  unit: string = '';
  showQuantity = false;
  croplistSecond: any[];
  selectCrop: any;
  selectVariety: any;
  selectDistrict: any;
  selectVarietyStatus: any;
  varietyListSecond: any[];
  isLimeSection: boolean;
  isAddSelected: boolean = false;
  isNotShowTable: boolean = false;
  isAddFormOpen: boolean = false;
  isUpdateFormOpen: boolean = false;
  isPatchData: boolean;
  formBuilder: any;
  update_Form: boolean = false;
  isChangeMessage: string;
  isButtonText: string;
  disableUpperSection: boolean;
  disableDistUpperSection: boolean;
  displayStyle: any = 'none'
  districtList: any;
  districtListSecond: any;
  authUserAgencyId: any;
  userState: any;
  totalCsavl: number = 0;
  totalQsavl: number = 0;
  totalSoS: number = 0;
  totalavl: number = 0;
  isCheck: boolean = false;
  freezeData: boolean;
  dummyData: any[];
  is_distUpdate: boolean = false;
  constructor(
    private fb: FormBuilder,
    private zsrmServiceService: ZsrmServiceService,
    private masterService: MasterService,

  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getCropData();
    this.loadAuthUser();
    // this.getPageData();
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
          this.districtListSecond = this.districtList
        }

      });

  }

  deleteDirectIndent(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        const route = `delete-req-qs/${id}`;
        this.zsrmServiceService.deleteRequestCreator(route, null,).subscribe(data => {
          if (data.Response.status_code === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "Your data has been deleted.",
              icon: "success"
            });
            this.getPageData()
          }
        });
      }
    });
  }
  deleteDistrictData(data) {
    // zsrmreqqs
    const zsrmreqqs_id = data.zsrmreqqs_id
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        const route = `delete-req-qs-dist/${data.id}`;
        this.zsrmServiceService.deleteRequestCreator(route, null,).subscribe(data => {
          if (data.Response.status_code === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "Your data has been deleted.",
              icon: "success"
            }).then(x => {
              this.getDistrictWiseData(data.Response.data.zsrmreqqs_id);
            });

          }
        });
      }
    });

  }

  SaveAsData() {
    this.isAddSelected = true;
    this.isChangeMessage = "Enter Registered Area and Quantiy Details"
    this.resetCancelation();

  }

  async getDistrictData(id) {
    console.log(id)
    this.openpopup();
    this.getDistrictWiseData(id)
   
  }
  openpopup() {
    this.displayStyle = 'block'
  }
  close() {
    this.displayStyle = 'none'
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: ['', [Validators.required]],
      district_csavl: [0, [Validators.required]],
      district: ['', [Validators.required]],
      doaCs: [0, [Validators.required]],
      doaQs: [0, [Validators.required]],
      sscCs: [0, [Validators.required]],
      sscQs: [0, [Validators.required]],
      nscCs: [0, [Validators.required]],
      nscQs: [0, [Validators.required]],
      sauCs: [0, [Validators.required]],
      sauQs: [0, [Validators.required]],
      seedhubsCs: [0, [Validators.required]],
      seedhubsQs: [0, [Validators.required]],
      req: [0, [Validators.required]],
      pvtCs: [0, [Validators.required]],
      pvtQs: [0, [Validators.required]],
      othersCs: [0, [Validators.required]],
      othersQs: [0, [Validators.required]],
      district_qsavl: [0, [Validators.required]],
      state_name: ['', [Validators.required]],
      district_total: [{ value: 0, disabled: true }],
      shotorsur: [{ value: 0, disabled: true }],
      crop_text: [''],
      variety_text: [''],
      district_text: [''],

    });

    this.ngForm.valueChanges.subscribe(values => {

      const sos =
        this.totalavl - Number(values.req || 0)

      this.ngForm.patchValue(
        { shotorsur: sos },
        { emitEvent: false }
      );
    });
    this.ngForm.valueChanges.subscribe(values => {
      const district_total =
        Number(values.district_csavl || 0) + Number(values.district_qsavl || 0)

      this.ngForm.patchValue(
        { district_total: district_total },
        { emitEvent: false }
      );
    });
    this.ngForm.controls['year'].valueChanges.subscribe(() => this.resetSelections());
    this.ngForm.controls['season'].valueChanges.subscribe(() => this.resetSelections());
    this.ngForm.controls['crop_text'].valueChanges.subscribe(item => {
      if (item) {
        this.cropData = this.croplistSecond
        let response = this.cropData.filter(x =>
          x.crop_name.toLowerCase().includes(item.toLowerCase())
        );
        this.cropData = response
      }
      else {
        this.getCropData()
      }
    })

    this.ngForm.controls['variety_text'].valueChanges.subscribe(item => {
      if (item) {
        this.varietyData = this.varietyListSecond;
        let response = this.varietyData.filter(x =>
          x.variety_name.toLowerCase().includes(item.toLowerCase()));
        this.varietyData = response
      }
      else {
        this.getVarietyData(this.ngForm.controls['crop'].value);
      }
    })

    this.ngForm.controls['district_text'].valueChanges.subscribe(item => {
      console.log(item, "district_text")
      if (item) {
        this.districtData = this.districtListSecond
        let response = this.districtData.filter(x =>
          x.district_name.toLowerCase().includes(item.toLowerCase())
        );
        this.districtData = response
      }
    })

    this.ngForm.valueChanges.subscribe((formValues) => {
      const { year, season, crop, variety, } = formValues;
      if (year && season || crop || variety) {
        this.getPageData();
        this.isShowTable = true;
      }
    })


  }

  patchDataDistForUpdate(data: any) {
    console.log(data, 'data')
    this.isAddSelected = true
    this.isChangeMessage = "Update:"
    this.isButtonText = "Update"
    this.isEditMode = true
    this.is_distUpdate = true;
    this.distDataId = data.id;


    if (data) {
      this.ngForm.controls['district'].patchValue(data.district_id);
      this.ngForm.controls['district_text'].patchValue(data.district_name);
      this.ngForm.controls['district_csavl'].patchValue(data.csavl);
      this.ngForm.controls['district_qsavl'].patchValue(data.qsavl);
      this.ngForm.controls['district_total'].patchValue(data.totalavl);
      this.selectDistrict = data.district_name;
      this.disableDistUpperSection = true;

    }
  }

  updateFormDistrict() {
    if (!this.ngForm.controls['district'].valid) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please select district</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      return
    }
    if (!this.ngForm.controls['district_total'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Total Avl cannot be empty</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      return
    }



    const route = `update-req-qs-dist/${this.distDataId}`;
    console.log(route, 'route')
    const totalCsavl = this.totalCsavl;
    const totalQsavl = this.totalQsavl;
    const totalavl = this.totalavl;
    const district_total = Number(this.ngForm.controls['district_csavl'].value || 0) + Number(this.ngForm.controls['district_qsavl'].value || 0)
    const req = Number(this.ngForm.controls['req'].value) || 0;
    const doaCs = Number(this.ngForm.controls['doaCs'].value) || 0;
    const sscCs = Number(this.ngForm.controls['sscCs'].value) || 0;
    const seedhubsCs = Number(this.ngForm.controls['seedhubsCs'].value) || 0;
    const nscCs = Number(this.ngForm.controls['nscCs'].value) || 0;
    const sauCs = Number(this.ngForm.controls['sauCs'].value) || 0;
    const pvtCs = Number(this.ngForm.controls['pvtCs'].value) || 0;
    const othersCs = Number(this.ngForm.controls['othersCs'].value) || 0;
    const doaQs = Number(this.ngForm.controls['doaQs'].value) || 0;
    const sscQs = Number(this.ngForm.controls['sscQs'].value) || 0;
    const seedhubsQs = Number(this.ngForm.controls['seedhubsQs'].value) || 0;
    const nscQs = Number(this.ngForm.controls['nscQs'].value) || 0;
    const sauQs = Number(this.ngForm.controls['sauQs'].value) || 0;
    const pvtQs = Number(this.ngForm.controls['pvtQs'].value) || 0;
    const othersQs = Number(this.ngForm.controls['othersQs'].value) || 0;
    const shtorsur = (totalavl - req);
    const baseParam = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      "district_id": this.ngForm.controls['district'].value,
      "district_csavl": this.ngForm.controls['district_csavl'].value,
      "district_qsavl": this.ngForm.controls['district_qsavl'].value,
      "district_totalavl": district_total,
      "req": req,
      "sscCs": sscCs,
      "doaCs": doaCs,
      "sauCs": sauCs,
      "nscCs": nscCs,
      "seedhubsCs": seedhubsCs,
      "pvtCs": pvtCs,
      "othersCs": othersCs,
      "sscQs": sscQs,
      "doaQs": doaQs,
      "sauQs": sauQs,
      "nscQs": nscQs,
      "seedhubsQs": seedhubsQs,
      "pvtQs": pvtQs,
      "othersQs": othersQs,
      "csavl": totalCsavl,
      "qsavl": totalQsavl,
      "totalavl": totalavl,
      "shtorsur": shtorsur
    };

    this.zsrmServiceService.putRequestCreator(route, null, baseParam).subscribe(data => {
      if (data.Response.status_code === 200) {

        this.is_distUpdate = false
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        }).then(() => {

          this.getDistrictWiseData(data.Response.data.zsrmreqqs_id);


          this.ngForm.controls['district_csavl'].reset(0);
          this.ngForm.controls['district_qsavl'].reset(0);
          this.selectDistrict = '';
          // this.ngForm.controls['district'].setValue('');
          this.submitted = true;
          this.isShowTable = true;

          this.disableDistUpperSection = false;

        })
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">An Error Occurred.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
      }
    })
  }

  download() {
    const name = 'Fs-req-report';
    const element = document.getElementById('excel-table');
    const options = {
      margin: 5,
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 100,
        scale: 1,
        letterRendering: true,
        useCORS: true
      },
      // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
      jsPDF: { unit: 'mm', format: 'A3', orientation: 'landscape' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }


  exportexcel(): void {
    let element = document.getElementById('excel-tables');
    console.log(element, 'element')
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    console.log(this.fileName,)
    XLSX.writeFile(wb, this.fileName);

  }

  patchDataForUpdate(data: any) {
    this.isAddSelected = true
    this.isChangeMessage = "Update:"
    this.isButtonText = "Update"
    this.isEditMode = true
    this.is_update = true;
    this.dataId = data.id;
    this.isCheck = true;
    this.disableUpperSection = true;
    const cropName = this.cropData.find(crop => crop.crop_code === data.crop_code)?.crop_name;
    if (data) {
      this.selectCrop = cropName;
      this.ngForm.controls['year'].patchValue(data.year);
      this.ngForm.controls['season'].patchValue(data.season);
      this.ngForm.controls['crop'].patchValue(data.crop_code);
      this.getVarietyData(data.variety_code);
      this.ngForm.controls['req'].patchValue(data.req);
      this.ngForm.controls['doaCs'].patchValue(data.doaCs);
      this.ngForm.controls['sscCs'].patchValue(data.sscCs);
      this.ngForm.controls['sauCs'].patchValue(data.sauCs);
      this.ngForm.controls['nscCs'].patchValue(data.nscCs);
      this.ngForm.controls['othersCs'].patchValue(data.othersCs);
      this.ngForm.controls['pvtCs'].patchValue(data.pvtCs);
      this.ngForm.controls['seedhubsCs'].patchValue(data.seedhubsCs);
      this.ngForm.controls['doaQs'].patchValue(data.doaQs);
      this.ngForm.controls['sscQs'].patchValue(data.sscQs);
      this.ngForm.controls['sauQs'].patchValue(data.sauQs);
      this.ngForm.controls['nscQs'].patchValue(data.nscQs);
      this.ngForm.controls['othersQs'].patchValue(data.othersQs);
      this.ngForm.controls['pvtQs'].patchValue(data.pvtQs);
      this.ngForm.controls['seedhubsQs'].patchValue(data.seedhubsQs);
      this.ngForm.controls['shtorsur'].patchValue(data.shtorsur)
      this.getDistrictList(data.state_id.toString());
      this.getDistrictWiseData(this.dataId);
      console.log(this.disableUpperSection,'this.disableUpperSection')
    }
  }

  variety(item: any) {
    const indentQntControl = this.ngForm.get('indent_qnt');
    this.selectVariety = item && item.variety_name ? item.variety_name : '',
      this.selectVarietyStatus = item && item.status ? item.status : '',
      this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    this.varietyData = this.varietyListSecond;
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
  }

  resetSelections() {
    this.isShowTable = false;
    // this.isAddSelected = false;
    this.isVarietySelected = false;
  }

  loadAuthUser() {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    if (BHTCurrentUser) {
      const data = JSON.parse(BHTCurrentUser);
      console.log(data);
      this.authUserId = data.id || null;
      this.authUserAgencyId = data.agency_id || null;

    }
  }

  searchData() {
    this.isShowTable = true;
    this.isAddSelected = false;
    this.getPageData();
  }
  cClick() {
    document.getElementById('crop').click();
  }

  dClick() {
    document.getElementById('district').click();
  }
  vClick() {
    document.getElementById('variety').click();
  }

  crop(item: any) {
    this.selectCrop = item && item.crop_name ? item.crop_name : ''
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropData = this.croplistSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
    this.getVarietyData(item.crop_code);
    this.selectVariety = ''
  }

  getCropData() {
    const route = "get-all-crops";
    this.zsrmServiceService.getRequestCreator(route, null, null).subscribe(data => {
      if (data.Response.status_code === 200) {
        this.cropData = data && data.Response && data.Response.data ? data.Response.data : '';
        this.croplistSecond = this.cropData;
      }
    })
  }
  revertDataCancelation() {
    // if (this.is_update) {

    //   const total = this.ngForm.controls['doaCs'].value + this.ngForm.controls['ssc'].value + this.ngForm.controls['nsc'].value
    //     + this.ngForm.controls['sau'].value + this.ngForm.controls['seedhubs'].value + this.ngForm.controls['pvt'].value +
    //     this.ngForm.controls['others'].value;

    //   // if (total != this.totalAvl) {
    //   //   Swal.fire({
    //   //     title: '<p style="font-size:25px;">Total District Requirement should not exceed Total Available.</p>',
    //   //     icon: 'error',
    //   //     confirmButtonText: 'OK',
    //   //     confirmButtonColor: '#E97E15'
    //   //   });
    //   //   return
    //   // }

    // }
    this.isAddSelected = false;
    this.ngForm.controls['req'].reset(0);
    this.ngForm.controls['doaCs'].reset(0);
    this.ngForm.controls['sscCs'].reset(0);
    this.ngForm.controls['nscCs'].reset(0);
    this.ngForm.controls['sauCs'].reset(0);
    this.ngForm.controls['seedhubsCs'].reset(0);
    this.ngForm.controls['sauCs'].reset(0);
    this.ngForm.controls['pvtCs'].reset(0);

    this.ngForm.controls['doaQs'].reset(0);
    this.ngForm.controls['sscQs'].reset(0);
    this.ngForm.controls['nscQs'].reset(0);
    this.ngForm.controls['sauQs'].reset(0);
    this.ngForm.controls['seedhubsQs'].reset(0);
    this.ngForm.controls['sauQs'].reset(0);
    this.ngForm.controls['pvtQs'].reset(0);
    this.is_update = false;
    this.is_distUpdate = false;
    this.showOtherInputBox = false;
    this.disableUpperSection = false;
    this.disableDistUpperSection = false;
    this.totalCsavl = 0;
    this.totalSoS = 0;
    this.totalQsavl = 0;
    this.totalavl = 0;
    this.allDistrictData = []
  }
  resetCancelation() {
    this.ngForm.controls['district_csavl'].reset(0);
    this.ngForm.controls['district_qsavl'].reset(0);
    this.ngForm.controls['doaQs'].reset(0);
    this.ngForm.controls['sscQs'].reset(0);
    this.ngForm.controls['nscQs'].reset(0);
    this.ngForm.controls['sauQs'].reset(0);
    this.ngForm.controls['seedhubsQs'].reset(0);
    this.ngForm.controls['pvtQs'].reset(0);
    this.ngForm.controls['othersQs'].reset(0)
    this.ngForm.controls['nscCs'].reset(0);
    this.ngForm.controls['doaCs'].reset(0);
    this.ngForm.controls['sscCs'].reset(0);
    this.ngForm.controls['nscCs'].reset(0);
    this.ngForm.controls['sauCs'].reset(0);
    this.ngForm.controls['seedhubsCs'].reset(0);
    this.ngForm.controls['pvtCs'].reset(0);
    this.ngForm.controls['othersCs'].reset(0)
    this.ngForm.controls['nscCs'].reset(0);
    this.totalQsavl = 0;
    this.totalSoS = 0;
    this.totalCsavl = 0;
    this.totalavl = 0
    this.allDistrictData = []
    this.is_update = false;
    this.is_distUpdate = false
    this.showOtherInputBox = false;
    const route = `get-user-state-code`;
    this.zsrmServiceService.getRequestCreator(route, null,).subscribe(data => {
      if (data.Response.status_code === 200) {
        console.log(data.Response.data, 'city')
        this.getDistrictList(data.Response.data.state_code);
      }
    })


    //  this.getDistrictWiseData(user);
  }

  saveForm() {
    this.submitted = true;
    this.isShowTable = true;
    const route = "add-req-qs";
    const totalCsavl = this.totalCsavl;
    const totalQsavl = this.totalQsavl;
    const totalavl = this.totalavl
    const req = Number(this.ngForm.controls['req'].value) || 0;
    const doaCs = Number(this.ngForm.controls['doaCs'].value) || 0;
    const sscCs = Number(this.ngForm.controls['sscCs'].value) || 0;
    const seedhubsCs = Number(this.ngForm.controls['seedhubsCs'].value) || 0;
    const nscCs = Number(this.ngForm.controls['nscCs'].value) || 0;
    const sauCs = Number(this.ngForm.controls['sauCs'].value) || 0;
    const pvtCs = Number(this.ngForm.controls['pvtCs'].value) || 0;
    const othersCs = Number(this.ngForm.controls['othersCs'].value) || 0;
    const doaQs = Number(this.ngForm.controls['doaQs'].value) || 0;
    const sscQs = Number(this.ngForm.controls['sscQs'].value) || 0;
    const seedhubsQs = Number(this.ngForm.controls['seedhubsQs'].value) || 0;
    const nscQs = Number(this.ngForm.controls['nscQs'].value) || 0;
    const sauQs = Number(this.ngForm.controls['sauQs'].value) || 0;
    const pvtQs = Number(this.ngForm.controls['pvtQs'].value) || 0;
    const othersQs = Number(this.ngForm.controls['othersQs'].value) || 0;
    const shtorsur = this.totalavl - req;
    const baseParam = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      "req": req,
      "sscCs": sscCs,
      "doaCs": doaCs,
      "sauCs": sauCs,
      "nscCs": nscCs,
      "seedhubsCs": seedhubsCs,
      "pvtCs": pvtCs,
      "othersCs": othersCs,
      "sscQs": sscQs,
      "doaQs": doaQs,
      "sauQs": sauQs,
      "nscQs": nscQs,
      "seedhubsQs": seedhubsQs,
      "pvtQs": pvtQs,
      "othersQs": othersQs,
      "csavl": totalCsavl,
      "qsavl": totalQsavl,
      "totalavl": totalavl,
      "shtorsur": shtorsur
    };
    const totalCs = doaCs + sauCs + nscCs + seedhubsCs + pvtCs + othersCs + sscCs
    if (totalCs !== this.totalCsavl) {
      Swal.fire({
        title: '<p style="font-size:25px;">TotalCs  is not equal to TotalCsAvl  </p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    const totalQs = doaQs + sauQs + nscQs + seedhubsQs + pvtQs + othersQs + sscCs
    if (totalQs !== this.totalQsavl) {
      Swal.fire({
        title: '<p style="font-size:25px;">TotalQs  is not equal to TotalQsAvl</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    this.zsrmServiceService.postRequestCreator(route, null, baseParam).subscribe(data => {
      if (data.Response.status_code === 200) {
        console.log("heloo")
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        }).then(x => {
          this.getPageData();
          this.ngForm.controls['req'].reset(0);
          this.ngForm.controls['doaCs'].reset(0);
          this.ngForm.controls['sscCs'].reset(0);
          this.ngForm.controls['othersCs'].reset(0);
          this.ngForm.controls['nscCs'].reset(0);
          this.ngForm.controls['sauCs'].reset(0);
          this.ngForm.controls['pvtCs'].reset(0);
          this.ngForm.controls['seedhubsCs'].reset(0);
          this.ngForm.controls['doaQs'].reset(0);
          this.ngForm.controls['sscQs'].reset(0);
          this.ngForm.controls['othersQs'].reset(0);
          this.ngForm.controls['nscQs'].reset(0);
          this.ngForm.controls['sauQs'].reset(0);
          this.ngForm.controls['pvtQs'].reset(0);
          this.ngForm.controls['seedhubsQs'].reset(0);
          this.submitted = false;
          this.isAddSelected = false;
          this.disableUpperSection = false;
          this.totalCsavl = 0;
          this.totalQsavl = 0;
          this.totalSoS = 0;
          this.totalavl = 0;

          this.allDistrictData = []
        })
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">An Error Occured.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        })
      }
    })
  }

  saveDistData() {
    if (!this.ngForm.controls['district'].valid) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please select district</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      return
    }
    if (!this.ngForm.controls['district_total'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Total Avl cannot be empty</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      return
    }

    const route = "add-req-qs-dist";
    const totalCsavl = this.totalCsavl;
    const totalQsavl = this.totalQsavl;
    const totalavl = this.totalavl;
    const req = Number(this.ngForm.controls['req'].value) || 0;
    const doaCs = Number(this.ngForm.controls['doaCs'].value) || 0;
    const sscCs = Number(this.ngForm.controls['sscCs'].value) || 0;
    const seedhubsCs = Number(this.ngForm.controls['seedhubsCs'].value) || 0;
    const nscCs = Number(this.ngForm.controls['nscCs'].value) || 0;
    const sauCs = Number(this.ngForm.controls['sauCs'].value) || 0;
    const pvtCs = Number(this.ngForm.controls['pvtCs'].value) || 0;
    const othersCs = Number(this.ngForm.controls['othersCs'].value) || 0;
    const doaQs = Number(this.ngForm.controls['doaQs'].value) || 0;
    const sscQs = Number(this.ngForm.controls['sscQs'].value) || 0;
    const seedhubsQs = Number(this.ngForm.controls['seedhubsQs'].value) || 0;
    const nscQs = Number(this.ngForm.controls['nscQs'].value) || 0;
    const sauQs = Number(this.ngForm.controls['sauQs'].value) || 0;
    const pvtQs = Number(this.ngForm.controls['pvtQs'].value) || 0;
    const othersQs = Number(this.ngForm.controls['othersQs'].value) || 0;
    const district_total = Number(this.ngForm.controls['district_csavl'].value || 0) + Number(this.ngForm.controls['district_qsavl'].value || 0)
    const shtorsur = this.totalavl - req;
    const baseParam = {
      "user_id": this.authUserId,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      "district_id": this.ngForm.controls['district'].value,
      "district_csavl": this.ngForm.controls['district_csavl'].value,
      "district_qsavl": this.ngForm.controls['district_qsavl'].value,
      "district_totalavl": district_total,
      "sscCs": sscCs,
      "req": req,
      "doaCs": doaCs,
      "sauCs": sauCs,
      "nscCs": nscCs,
      "seedhubsCs": seedhubsCs,
      "pvtCs": pvtCs,
      "othersCs": othersCs,
      "sscQs": sscQs,
      "doaQs": doaQs,
      "sauQs": sauQs,
      "nscQs": nscQs,
      "seedhubsQs": seedhubsQs,
      "pvtQs": pvtQs,
      "othersQs": othersQs,
      "csavl": totalCsavl,
      "qsavl": totalQsavl,
      "totalavl": totalavl,
      "shtorsur": shtorsur,

    };
    this.zsrmServiceService.postRequestCreator(route, null, baseParam).subscribe(
      data => {

        if (data.Response.status_code === 200) {
          console.log("Data saved successfully!");
          Swal.fire({
            title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          }).then(x => {
            this.getDistrictWiseData(data.Response.data.id);
            this.ngForm.controls['district_csavl'].reset(0);
            this.ngForm.controls['district_qsavl'].reset(0);
            this.selectDistrict = '';
            // this.ngForm.controls['district'].setValue('');
          });
        }
      },
      error => {
        console.error("HTTP error occurred:", error);
        if (error.status === 409) {
          console.log("Record Already Exists - 409 error triggered.");
          Swal.fire({
            title: '<p style="font-size:25px;">Record Already Exists.</p>',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          });
            
           this.ngForm.controls['district_csavl'].reset(0);
            this.ngForm.controls['district_qsavl'].reset(0);
            this.selectDistrict = '';
          return;
        }
        Swal.fire({
          title: '<p style="font-size:25px;">Request Failed.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
      }
    );

  }

  createAndSave() {
    this.submitted = true;
    this.isAddFormOpen = true;
    this.saveForm();
  }

  getVarietyData(varietyCode: any) {
    const crop_code = this.ngForm.controls['crop'].value;
    this.ngForm.controls['variety'].patchValue('');
    const route = `get-all-varieties?crop_code=${crop_code}`;
    this.zsrmServiceService.getRequestCreator(route, null,).subscribe(data => {
      if (data.Response.status_code === 200) {
        this.varietyData = data && data.Response && data.Response.data ? data.Response.data : '';
        this.varietyListSecond = this.varietyData;

        if (this.isEditMode) {

          const varietyName = this.varietyData.filter(variety => variety.variety_code === varietyCode);
          console.log(varietyName)
          this.selectVariety = varietyName;
          this.selectVariety = varietyName[0].variety_name;
          this.ngForm.controls['variety'].patchValue(varietyName[0].variety_code);
        }
      }
    })
  }

  isAddMore() {
    this.isCheck = true;

    if (this.dummyData && this.dummyData[0]?.is_finalised) {
      this.freezeData = true;
  

    } else {
      this.freezeData = false;
    }
  }

  finalizeData() {
    const year = this.ngForm.controls['year'].value;
    const season = this.ngForm.controls['season'].value;
    const queryParams = [];
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (season) queryParams.push(`season=${encodeURIComponent(season)}`);

    const apiUrl = `finalise-req-qs?${queryParams.join('&')}`;
    console.log(apiUrl, 'apiUrl')
    Swal.fire({
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes,Submit it!",
      cancelButtonText: "Cancel",
      icon: "warning",
      title: "Are You Sure?",
      text: "You won't be able to Edit this!",
      position: "center",
      cancelButtonColor: "#DD6B55",
    }).then(x => {

      if (x.isConfirmed) {

        this.zsrmServiceService.putRequestCreator(apiUrl).subscribe(apiResponse => {

          if (apiResponse.Response.status_code === 200) {

            Swal.fire({
              title: '<p style="font-size:25px;">Data Submited Successfully.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            }).then(x => {

              this.getPageData()
            })
          } else {
            Swal.fire({
              title: '<p style="font-size:25px;">Something Went Wrong.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            })
          }
        })
      }

    })
  }

  getPageData() {
    this.filterPaginateSearch.itemList = [];
    const year = this.ngForm.controls['year'].value;
    const season = this.ngForm.controls['season'].value;
    const crop = this.ngForm.controls['crop'].value;
    const variety = this.ngForm.controls['variety'].value;
    const queryParams = [];
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (season) queryParams.push(`season=${encodeURIComponent(season)}`);
    if (crop) queryParams.push(`crop_code=${encodeURIComponent(crop)}`);
    if (variety) queryParams.push(`variety_code=${encodeURIComponent(variety)}`);

    const apiUrl = `view-req-qs?${queryParams.join('&')}`;
    this.zsrmServiceService
      .getRequestCreator(apiUrl)
      .subscribe(
        (apiResponse: any) => {
          if (apiResponse?.Response.status_code === 200) {

            this.allData = apiResponse.Response.data || [];
            this.dummyData = this.allData;

            if (this.dummyData && this.dummyData[0]?.is_finalised) {
              this.freezeData = true;
              console.log(this.freezeData,'freezeData');
            }
            else {
              this.freezeData = false;
            }
          }
        },
        (error) => {
          if (error.status === 404) {
            this.freezeData = false;
            this.dummyData = [];
          } else if (error.status === 500) {
            Swal.fire({
              title: 'Oops',
              text: '<p style="font-size:25px;">Something Went Wrong.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            })
          } else {
            console.error('Error fetching data:', error);
          }
        }
      );
  }

  district_select(data) {
    this.selectDistrict = data.district_name || '';
    this.ngForm.controls['district_text'].setValue('', { emitEvent: false })
    this.districtList = this.districtListSecond
    this.ngForm.controls['district'].setValue(data.district_code)

  }

  getDistrictWiseData(id) {
    const queryParams = [];
    queryParams.push(`zsrmreqqs_id=${encodeURIComponent(id)}`);
    const apiUrl = `view-req-qs-dist?${queryParams.join('&')}`;
    this.zsrmServiceService
      .getRequestCreator(apiUrl)
      .subscribe(
        (apiResponse: any) => {
          if (apiResponse?.Response.status_code === 200) {

            this.allDistrictData = apiResponse.Response.data.result || [];
            //  loops through the array and adds up the numbers.
            // safely converts each item’s csavl to number, even if it’s missing or null.
            this.totalCsavl = this.allDistrictData.reduce((sum, item) => sum + Number(item.csavl || 0), 0);
            this.totalQsavl = this.allDistrictData.reduce((sum, item) => sum + Number(item.qsavl || 0), 0);
            this.totalavl = this.allDistrictData.reduce((sum, item) => sum + Number(item.totalavl || 0), 0);

          }
          else {
            console.warn('API returned an unexpected status:', apiResponse?.Response.status_code);
          }
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  updateForm() {

    if (!this.totalavl) {

      Swal.fire({
        title: '<p style="font-size:25px;">Total Avl cannot be zero</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      return
    }


    this.submitted = true;
    this.isShowTable = true;
    const route = `update-req-qs/${this.dataId}`;


    const totalCsavl = this.totalCsavl;
    const totalQsavl = this.totalQsavl;

    const totalavl = this.totalavl
    const req = Number(this.ngForm.controls['req'].value) || 0;
    const doaCs = Number(this.ngForm.controls['doaCs'].value) || 0;
    const sscCs = Number(this.ngForm.controls['sscCs'].value) || 0;
    const seedhubsCs = Number(this.ngForm.controls['seedhubsCs'].value) || 0;
    const nscCs = Number(this.ngForm.controls['nscCs'].value) || 0;
    const sauCs = Number(this.ngForm.controls['sauCs'].value) || 0;
    const pvtCs = Number(this.ngForm.controls['pvtCs'].value) || 0;
    const othersCs = Number(this.ngForm.controls['othersCs'].value) || 0;
    const doaQs = Number(this.ngForm.controls['doaQs'].value) || 0;
    const sscQs = Number(this.ngForm.controls['sscQs'].value) || 0;
    const seedhubsQs = Number(this.ngForm.controls['seedhubsQs'].value) || 0;
    const nscQs = Number(this.ngForm.controls['nscQs'].value) || 0;
    const sauQs = Number(this.ngForm.controls['sauQs'].value) || 0;
    const pvtQs = Number(this.ngForm.controls['pvtQs'].value) || 0;
    const othersQs = Number(this.ngForm.controls['othersQs'].value) || 0;
    const shtorsur = this.totalavl + req;
    const baseParam = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      "req": req,
      "sscCs": sscCs,
      "doaCs": doaCs,
      "sauCs": sauCs,
      "nscCs": nscCs,
      "seedhubsCs": seedhubsCs,
      "pvtCs": pvtCs,
      "othersCs": othersCs,
      "sscQs": sscQs,
      "doaQs": doaQs,
      "sauQs": sauQs,
      "nscQs": nscQs,
      "seedhubsQs": seedhubsQs,
      "pvtQs": pvtQs,
      "othersQs": othersQs,
      "csavl": totalCsavl,
      "qsavl": totalQsavl,
      "totalavl": totalavl,
      "shtorsur": shtorsur
    };

    const totalCs = doaCs + sauCs + nscCs + seedhubsCs + pvtCs + othersCs + sscCs;
    console.log(totalCs, 'totalCs')
    if (totalCs !== this.totalCsavl) {
      Swal.fire({
        title: '<p style="font-size:25px;">TotalCs  is not equal to TotalCsAvl  </p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    const totalQs = doaQs + sauQs + nscQs + seedhubsQs + pvtQs + othersQs + sscQs;
    if (totalQs !== this.totalQsavl) {
      Swal.fire({
        title: '<p style="font-size:25px;">TotalQs  is not equal to TotalQsAvl</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    this.zsrmServiceService.putRequestCreator(route, null, baseParam).subscribe(data => {
      if (data.Response.status_code === 200) {
        this.is_update = false;

        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        }).then(() => {
          this.getPageData();
          this.ngForm.controls['req'].reset(0);
          this.ngForm.controls['doaCs'].reset(0);
          this.ngForm.controls['sscCs'].reset(0);
          this.ngForm.controls['othersCs'].reset(0);
          this.ngForm.controls['nscCs'].reset(0);
          this.ngForm.controls['sauCs'].reset(0);
          this.ngForm.controls['pvtCs'].reset(0);
          this.ngForm.controls['seedhubsCs'].reset(0);
          this.ngForm.controls['doaQs'].reset(0);
          this.ngForm.controls['sscQs'].reset(0);
          this.ngForm.controls['othersQs'].reset(0);
          this.ngForm.controls['nscQs'].reset(0);
          this.ngForm.controls['sauQs'].reset(0);
          this.ngForm.controls['pvtQs'].reset(0);
          this.ngForm.controls['seedhubsQs'].reset(0);
          this.submitted = false;
          this.isAddSelected = false;
          this.totalCsavl = 0;
          this.totalQsavl = 0;
          this.totalSoS = 0;
          this.totalavl = 0;
          this.allDistrictData = []
          this.disableUpperSection = false;
        });
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">An Error Occurred.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
      }
    });
  }

  validateDecimal(event: any): void {
    const input = event.target as HTMLInputElement;
    const regex = /^[0-9]+(\.[0-9]{0,2})?$/;

    const newValue = input.value + event.key;
    if (!regex.test(newValue) || (event.key === '.' && input.value.includes('.'))) {
      event.preventDefault();
    }
  }

  formatNumber(value: number) {
    return value ? value.toFixed(2) : '';
  }

  resetForm() {
    this.ngForm.controls['year'].reset('');
    this.ngForm.controls['season'].reset('');
    this.selectCrop = '';
    this.selectVariety = '';
    this.disableUpperSection = false;
    this.ngForm.controls['crop'].reset('');
    this.ngForm.controls['variety'].reset('');
    this.isShowTable = false; this.isAddSelected = false;
  }


}
