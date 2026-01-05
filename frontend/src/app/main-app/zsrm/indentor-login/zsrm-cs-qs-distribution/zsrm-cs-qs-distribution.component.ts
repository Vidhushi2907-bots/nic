import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ZsrmServiceService } from 'src/app/services/zsrm-service.service';
import Swal from 'sweetalert2';
interface SeedDistributionData {
  doaCs: number;
  doaQs: number;
  sscQs: number;
  sscCs: number;
  nscCs: number;
  nscQs: number;
  sauCs: number;
  sauQs: number;
  seedhubsCs: number;
  seedhubsQs: number;
  othersCs: number;
  othersQs: number;
  pvtCs: number;
  pvtQs: number;
  csavl: number;
  totalavl: number;
  qsavl: number;
}
@Component({
  selector: 'app-zsrm-cs-qs-distribution',
  templateUrl: './zsrm-cs-qs-distribution.component.html',
  styleUrls: ['./zsrm-cs-qs-distribution.component.css']
})

export class ZsrmCsQsDistributionComponent implements OnInit {
  [x: string]: any;

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any = [];
  is_update: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  varietyList: any[] = [];
  varietyData: any[] = [];
  showOtherInputBox = false;
  displayModal = false;
  modalType: 'Cs' | 'Qs' = 'Cs';
  dummyCsAndQsData: any = []
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
  dummyData: any;
  freezeData: boolean;
  displayStyle: any = 'none'
  dummyDataCs: any;
  isCheck: boolean;
  totalCsavl: number = 0;
  totalQsavl: number = 0;
  totalAvl: number = 0;
  availabilityData: SeedDistributionData[] = [];
  constructor(
    private fb: FormBuilder,
    private zsrmServiceService: ZsrmServiceService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getCropData();
    this.loadAuthUser();
    // this.getPageData();
  }


  // deleteDirectIndent(id: number) {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!"
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const route = `delete-zsrm-cs-qs-dist/${id}`;
  //       this.zsrmServiceService.deleteRequestCreator(route, null,).subscribe(data => {
  //         if (data.Response.status_code === 200) {
  //           Swal.fire({
  //             title: "Deleted!",
  //             text: "Your data has been deleted.",
  //             icon: "success"
  //           });
  //           this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemList.filter(item => item.id !== id);
  //         }
  //       });
  //     }
  //   });
  // }

  SaveAsData() {
    this.isAddSelected = true;
    this.isChangeMessage = "Enter Distribution of Certified/Quality Seed"
    this.resetCancelation()

  }


  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: ['', [Validators.required]],
      category: ['', [Validators.required]],
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
      pvtCs: [0, [Validators.required]],
      pvtQs: [0, [Validators.required]],
      othersCs: [0, [Validators.required]],
      othersQs: [0, [Validators.required]],
      totalCs: [{ value: 0, disabled: true }],
      totalQs: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }],
      crop_text: [''],
      variety_text: ['']

    });
    this.ngForm.valueChanges.subscribe(values => {
      const totalCsDistribution =
        (values.sscCs || 0) +
        (values.doaCs || 0) +
        (values.seedhubsCs || 0) +
        (values.pvtCs || 0) +
        (values.nscCs || 0) +
        (values.othersCs || 0);
      const totalQsDistribution =
        (values.sscQs || 0) +
        (values.doaQs || 0) +
        (values.seedhubsQs || 0) +
        (values.pvtQs || 0) +
        (values.nscQs || 0) +
        (values.othersQs || 0);
      const total = totalCsDistribution + totalQsDistribution
      this.ngForm.patchValue(
        { totalCs: totalCsDistribution, totalQs: totalQsDistribution, total: total },
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

    this.ngForm.valueChanges.subscribe((formValues) => {
      const { year, season, crop, variety, } = formValues;
      if (year && season || crop || variety) {
        this.getPageData();
        this.isShowTable = true;
      }
    })


  }
  close(type: 'Cs' | 'Qs') {
    this.displayStyle = 'none';
  }
  patchDataForUpdate(data: any) {
    this.isAddSelected = true
    this.isChangeMessage = "Update Distribution of Certified/Quality Seed"
    this.isButtonText = "Update"
    this.isEditMode = true
    this.is_update = true;
    this.isCheck = true;
    this.dataId = data.id;
    this.disableUpperSection = true;
    const apiUrl = `view-req-qs?year=${data.year}&season=${data.season}&crop_code=${data.crop_code}&variety_code=${data.variety_code}`
    this.zsrmServiceService
      .getRequestCreator(apiUrl)
      .subscribe(
        (apiResponse: any) => {
          if (apiResponse?.Response.status_code === 200) {
            this.allData = apiResponse.Response.data || [];
            this.availabilityData = this.allData;
            console.log(this.availabilityData, 'avali')
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
    const cropName = this.cropData.find(crop => crop.crop_code === data.crop_code)?.crop_name;
    if (data) {
      this.selectCrop = cropName;
      this.ngForm.controls['year'].patchValue(data.year);
      this.ngForm.controls['season'].patchValue(data.season);
      this.ngForm.controls['crop'].patchValue(data.crop_code);
      this.getVarietyData(data.variety_code);
      this.ngForm.controls['doaCs'].patchValue(data.doaCs);
      this.ngForm.controls['sscCs'].patchValue(data.sscCs);
      this.ngForm.controls['nscCs'].patchValue(data.nscCs);
      this.ngForm.controls['pvtCs'].patchValue(data.pvtCs);
      this.ngForm.controls['othersCs'].patchValue(data.othersCs);
      this.ngForm.controls['sauCs'].patchValue(data.sauCs);
      this.ngForm.controls['doaQs'].patchValue(data.doaCs);
      this.ngForm.controls['sscQs'].patchValue(data.sscCs);
      this.ngForm.controls['nscQs'].patchValue(data.nscCs);
      this.ngForm.controls['sfciQs'].patchValue(data.pvtCs);
      this.ngForm.controls['othersQs'].patchValue(data.othersCs);
      this.ngForm.controls['sauQs'].patchValue(data.sauCs);

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
      this.authUserId = data.id || null;
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

    this.isAddSelected = false;
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
    this.is_update = false;
    this.showOtherInputBox = false;
    this.disableUpperSection = false;
    this.dummyCsAndQsData = []

  }
  resetCancelation() {
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
    this.ngForm.patchValue({ total: 0 },
      { emitEvent: false }
    );
    this.is_update = false;
    this.showOtherInputBox = false;
    this.dummyCsAndQsData = []
  }

  saveForm() {
    this.submitted = true;
    this.isShowTable = true;
    const route = "add-zsrm-cs-qs-dist";
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
    const totalQs = doaQs + sauQs + nscQs + seedhubsQs + pvtQs + othersQs + sscCs
    const totalCs = doaCs + sauCs + nscCs + seedhubsCs + pvtCs + othersCs + sscCs
    const total = totalCs + totalQs;
    console.log(totalQs, 'totalQs', totalCs)
    const baseParam = {
      "user_id": this.authUserId,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      "variety_code": this.ngForm.controls['variety'].value,
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
      "totalCs": totalCs,
      "totalQs": totalQs,
      "total": total,
    };


    this.zsrmServiceService.postRequestCreator(route, null, baseParam).subscribe(data => {
      if (data.Response.status_code === 200) {
        this.availabilityData = []
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        }).then(x => {
          this.getPageData();
          this.ngForm.controls['doaCs'].reset(0);
          this.ngForm.controls['sscCs'].reset(0);
          this.ngForm.controls['othersCs'].reset(0);
          this.ngForm.controls['nscCs'].reset(0);
          this.ngForm.controls['seedhubsCs'].reset(0);
          this.ngForm.controls['pvtCs'].reset(0);
          this.ngForm.controls['sauCs'].reset(0);
          this.ngForm.controls['doaQs'].reset(0);
          this.ngForm.controls['sscQs'].reset(0);
          this.ngForm.controls['othersQs'].reset(0);
          this.ngForm.controls['nscQs'].reset(0);
          this.ngForm.controls['seedhubsQs'].reset(0);
          this.ngForm.controls['pvtQs'].reset(0);
          this.ngForm.controls['sauQs'].reset(0);
          this.submitted = false;
          this.isAddSelected = false;
          this.dummyCsAndQsData = []
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
        console.log(this.isEditMode, "...................")
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

    const apiUrl = `view-zsrm-cs-qs-dist-all?${queryParams.join('&')}`;
    console.log(apiUrl, 'apiurl')
    this.zsrmServiceService
      .getRequestCreator(apiUrl)
      .subscribe(
        (apiResponse: any) => {
          if (apiResponse?.Response.status_code === 200) {

            this.allData = apiResponse.Response.data || [];
            this.dummyData = this.allData;
            console.log(this.dummyData);
            console.log(this.dummyData && this.dummyData[0]?.is_finalised,'this.dummyData && this.dummyData[0]?.is_finalised')
            if (this.dummyData && this.dummyData[0]?.is_finalised) {
              this.freezeData = true;
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

  updateForm() {

    this.submitted = true;
    this.isShowTable = true;

    const route = `update-zsrm-cs-qs-dist/${this.dataId}`;
    const doaCs = Number(this.ngForm.controls['doaCs'].value) || 0;
    const sscCs = Number(this.ngForm.controls['sscCs'].value) || 0;
    const othersCs = Number(this.ngForm.controls['othersCs'].value) || 0;
    const nscCs = Number(this.ngForm.controls['nscCs'].value) || 0;
    const seedhubsCs = Number(this.ngForm.controls['seedhubsCs'].value) || 0;
    const pvtCs = Number(this.ngForm.controls['pvtCs'].value) || 0;
    const sauCs = Number(this.ngForm.controls['sauCs'].value) || 0;
    const sauQs = Number(this.ngForm.controls['sauQs'].value) || 0;
    const doaQs = Number(this.ngForm.controls['doaQs'].value) || 0;
    const sscQs = Number(this.ngForm.controls['sscQs'].value) || 0;
    const othersQs = Number(this.ngForm.controls['othersQs'].value) || 0;
    const nscQs = Number(this.ngForm.controls['nscQs'].value) || 0;
    const seedhubsQs = Number(this.ngForm.controls['seedhubsQs'].value) || 0;
    const pvtQs = Number(this.ngForm.controls['pvtQs'].value) || 0;
    const totalQs = doaQs + sauQs + nscQs + seedhubsQs + pvtQs + othersQs + sscCs
    const totalCs = doaCs + sauCs + nscCs + seedhubsCs + pvtCs + othersCs + sscCs
    const total = totalCs + totalQs;
    const baseParam = {
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
      "totalCs": totalCs,
      "totalQs": totalQs,
      "total": total,
    };

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
          this.ngForm.controls['doaCs'].reset(0);
          this.ngForm.controls['sscCs'].reset(0);
          this.ngForm.controls['othersCs'].reset(0);
          this.ngForm.controls['nscCs'].reset(0);
          this.ngForm.controls['seedhubsCs'].reset(0);
          this.ngForm.controls['pvtCs'].reset(0);
          this.ngForm.controls['sauCs'].reset(0);
          this.ngForm.controls['doaQs'].reset(0);
          this.ngForm.controls['sscQs'].reset(0);
          this.ngForm.controls['othersQs'].reset(0);
          this.ngForm.controls['nscQs'].reset(0);
          this.ngForm.controls['seedhubsQs'].reset(0);
          this.ngForm.controls['pvtQs'].reset(0);
          this.ngForm.controls['sauQs'].reset(0);
          this.submitted = false;
          this.isAddSelected = false;
          this.disableUpperSection = false;
          this.dummyCsAndQsData = [];
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
    return value ? value.toFixed(2) : 0.00;
  }

  resetForm() {
    this.ngForm.controls['year'].reset('');
    this.ngForm.controls['season'].reset('');
    this.ngForm.controls['category'].reset('');
    this.selectCrop = '';
    this.selectVariety = '';
    this.ngForm.controls['crop'].reset('');
    this.ngForm.controls['variety'].reset('');
    this.isShowTable = false; this.isAddSelected = false;
  }
  isAddMore() {
    this.isCheck = true;

    if (this.dummyData && this.dummyData[0]?.is_finalised) {
      this.freezeData = true;


    } else {
      this.freezeData = false;
    }
  }

  showCsData(id) {

    const apiUrl = `view-zsrm-cs-qs-dist/`

    this.zsrmServiceService
      .getDataById(apiUrl, id)
      .subscribe(
        (apiResponse: any) => {

          if (apiResponse?.Response.status_code === 200) {
            this.dummyCsAndQsData = apiResponse.Response.data || [];

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
  async getSeedData(id: number, type: 'Cs' | 'Qs') {
    if (type === 'Cs') {
      this.modalType = type;
      this['displayStyle'] = 'block'
      this.showCsData(id)
    } else {
      this.modalType = type;
      this['displayStyle'] = 'block'
      this.showCsData(id)
    }



  }
  finalizeData() {
    const year = this.ngForm.controls['year'].value;
    const season = this.ngForm.controls['season'].value;
    const queryParams = [];
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (season) queryParams.push(`season=${encodeURIComponent(season)}`);

    const apiUrl = `finalise-cs-qs-dist?${queryParams.join('&')}`;
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
}
