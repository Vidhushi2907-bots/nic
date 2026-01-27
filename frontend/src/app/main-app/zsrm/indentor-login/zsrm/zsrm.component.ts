import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as html2PDF from 'html2pdf.js';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ZsrmServiceService } from 'src/app/services/zsrm-service.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-zsrm',
  templateUrl: './zsrm.component.html',
  styleUrls: ['./zsrm.component.css']
})
export class ZsrmComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  @ViewChild('chartSection') chartSection: ElementRef;
  ngForm!: FormGroup;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any = [];
  fileName = 'fs-req.xlsx';
  is_update: boolean = false;
  enableTable: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  varietyList: any[] = [];
  varietyData: any[] = [];
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
  today = new Date();
  selectVarietyStatus: any;
  varietyListSecond: any[];
  isAddSelected: boolean = false;
  isPatchData: boolean;
  formBuilder: any;
  update_Form: boolean = false;
  isChangeMessage: string;
  freezeData: boolean;
  dummyData = [];
  isCheck: boolean = false;
  finalData: any[];
  totalData: any;
  constructor(
    private fb: FormBuilder,
    private zsrmServiceService: ZsrmServiceService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getCropData();
    this.loadAuthUser();
    this.getPageData();
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
        const route = `delete-req-fs/${id}`;
        this.zsrmServiceService.deleteRequestCreator(route, null,).subscribe(data => {
          if (data.Response.status_code === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "Your data has been deleted.",
              icon: "success"
            });
            this.getPageData();
          }
        });
      }
    });
  }

  finalizeData() {
    const year = this.ngForm.controls['year'].value;
    const season = this.ngForm.controls['season'].value;
    const queryParams = [];
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (season) queryParams.push(`season=${encodeURIComponent(season)}`);

    const apiUrl = `finalise-req-fs?${queryParams.join('&')}`;
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

  SaveAsData() {
    this.isAddSelected = true;
    this.isChangeMessage = "Agency-wise Availability"
    this.resetCancelation()

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
  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: ['', [Validators.required]],
      req: ['0', [Validators.required]],
      ssc: [0, [Validators.required]],
      doa: [0, [Validators.required]],
      nsc: [0, [Validators.required]],
      sau: [0, [Validators.required]],
      pvt: [0, [Validators.required]],
      others: [0, [Validators.required]],
      total: [{ value: 0, disabled: true }],
      shtorsub: [{ value: 0, disabled: true }],
      remarks: [''],
      crop_text: [''],
      variety_text: ['']

    });
    this.ngForm.valueChanges.subscribe((formValues) => {
      const { year, crop, season, variety } = formValues;

      if (year && season || crop || variety) {
        this.getPageData();
        this.isShowTable = true

      }
    });
    this.ngForm.valueChanges.subscribe(values => {
      const total =
        (values.ssc || 0) +
        (values.doa || 0) +
        (values.sau || 0) +
        (values.pvt || 0) +
        (values.nsc || 0) +
        (values.others || 0);
      const totalvalue = Number(Number(total).toFixed(2));
      const shtorsub = totalvalue - (values.req || 0);
      const value = Number(Number(shtorsub).toFixed(2));
      this.ngForm.patchValue(
        { total: totalvalue, shtorsub: value },
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

  }

  patchDataForUpdate(data: any) {
    this.isAddSelected = true
    this.isChangeMessage = "Update Agency-wise Availability"
    this.isEditMode = true
    this.is_update = true;
    this.dataId = data.id;
    const cropName = this.cropData.find(crop => crop.crop_code === data.crop_code)?.crop_name;
    if (data) {
      this.selectCrop = cropName;
      this.ngForm.controls['year'].patchValue(data.year);
      this.ngForm.controls['season'].patchValue(data.season);
      this.ngForm.controls['crop'].patchValue(data.crop_code);
      const firstChar = (data?.crop_code || '').substring(0, 1);
      if (firstChar == 'H') {
        this.showQuantity = true;
      } else {
        this.showQuantity = false;
      }

      this.getVarietyData(data.variety_code);
      this.ngForm.controls['variety'].patchValue(data.variety_code);
      this.ngForm.controls['nsc'].patchValue(Number(data.nsc));
      this.ngForm.controls['req'].patchValue(Number(data.req));
      this.ngForm.controls['pvt'].patchValue(Number(data.pvt));
      this.ngForm.controls['sau'].patchValue(Number(data.sau));
      this.ngForm.controls['remarks'].patchValue(data.remarks); // Remarks might be a string, no conversion needed
      this.ngForm.controls['ssc'].patchValue(Number(data.ssc));
      this.ngForm.controls['doa'].patchValue(Number(data.doa));
      this.ngForm.controls['others'].patchValue(Number(data.others));

      this.ngForm.patchValue(
        { total: Number(parseInt(data.total).toFixed(2)), shtorsub: Number(parseInt(data.shtorsur).toFixed(2)) },
        { emitEvent: false }
      );

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
    this.isShowTable = true
    this.is_update = false;
    this.isAddSelected = false;
    this.showOtherInputBox = false;
    this.selectVariety = '';
    this.selectCrop = '';
    this.ngForm.controls['crop'].reset('');
    this.ngForm.controls['variety'].reset('');
  }

  resetCancelation() {
    this.ngForm.controls['nsc'].reset(0);
    this.ngForm.controls['remarks'].reset('');
    this.ngForm.controls['others'].patchValue(0);
    this.ngForm.controls['doa'].patchValue(0);
    this.ngForm.controls['sau'].patchValue(0);

    this.ngForm.controls['pvt'].patchValue(0)
    this.ngForm.controls['req'].patchValue(0);
    this.ngForm.controls['ssc'].patchValue(0);
    this.is_update = false;
    this.showOtherInputBox = false;
  }


  saveForm() {
    if (!this.ngForm.controls["req"].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Req can not be 0</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    this.submitted = true;
    this.isShowTable = false;
    const route = "add-req-fs";
    const req = this.ngForm.controls['req'].value || 0;
    const ssc = this.ngForm.controls['ssc'].value || 0;
    const doa = this.ngForm.controls['doa'].value || 0;
    const sau = this.ngForm.controls['sau'].value || 0;
    const pvt = this.ngForm.controls['pvt'].value || 0;
    const nsc = this.ngForm.controls['nsc'].value || 0;
    const others = this.ngForm.controls['others'].value || 0;
    const total = (ssc + doa + sau + pvt + nsc + others);
    const totalvalue = Number(Number(total).toFixed(2));
    const shtorsur = (total - req);
    const value = Number(Number(shtorsur).toFixed(2));
    const baseParam = {
      "user_id": this.authUserId,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      "req": req,
      "ssc": ssc,
      "doa": doa,
      "sau": sau,
      "pvt": pvt,
      "nsc": nsc,
      "others": others,
      "remarks": this.ngForm.controls['remarks'].value,
      "total": totalvalue,
      "shtorsur": value
    };
    console.log(baseParam, "param");
    this.zsrmServiceService.postRequestCreator(route, null, baseParam).subscribe(data => {
      if (data.Response.status_code === 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        }).then(x => {
          this.ngForm.controls['variety'].reset('');
          this.selectVariety = '';
          this.getPageData();
          this.ngForm.controls['req'].reset('');
          this.ngForm.controls['doa'].reset('');
          this.ngForm.controls['sau'].reset('');
          this.ngForm.controls['remarks'].patchValue('');
          this.ngForm.controls['others'].reset('');
          this.ngForm.controls['ssc'].reset('');
          this.ngForm.controls['nsc'].reset('');
          this.ngForm.controls['pvt'].reset('');
          this.submitted = false;
          this.isAddSelected = false;
        });
      } else if (data.Response.status_code === 409) { // Assuming 409 indicates "Conflict" or "Already Exists"
        Swal.fire({
          title: '<p style="font-size:25px;">Data Already Exists.</p>',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">An Error Occurred.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
      }
    })
  };

  createAndSave() {
    this.isShowTable = false
    this.submitted = true;
    this.saveForm();
  }
  getVarietyData(varietyCode: any) {
    this.ngForm.controls['variety'].patchValue('');
    const crop_code = this.ngForm.controls['crop'].value;
    this.selectVariety = ''; // Reset the selected variety display
    const route = `get-all-varieties?crop_code=${crop_code}`;
    this.zsrmServiceService.getRequestCreator(route, null,).subscribe(data => {
      if (data.Response.status_code === 200) {
        this.varietyData = data && data.Response && data.Response.data ? data.Response.data : '';
        this.varietyListSecond = this.varietyData;
        if (this.isEditMode && varietyCode) {
          const varietyName = this.varietyData.filter(variety => variety.variety_code === varietyCode);
          this.selectVariety = varietyName.length > 0 ? varietyName[0].variety_name : '';
        }
      } else {
        this.varietyData = [];
        this.varietyListSecond = [];

      }
    })
  }

  getPageData() {
    this.filterPaginateSearch.itemList = [];
    this.finalData = [];
    this.totalData = [];
    const year = this.ngForm.controls['year'].value;
    const season = this.ngForm.controls['season'].value;
    const crop = this.ngForm.controls['crop'].value;
    const variety = this.ngForm.controls['variety'].value;


    const queryParams = [];
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (season) queryParams.push(`season=${encodeURIComponent(season)}`);
    if (crop) queryParams.push(`crop_code=${encodeURIComponent(crop)}`);
    if (variety) queryParams.push(`variety_code=${encodeURIComponent(variety)}`);
    const apiUrl = `view-req-fs-all-updated?${queryParams.join('&')}`;

    this.zsrmServiceService
      .getRequestCreator(apiUrl)
      .subscribe(
        (apiResponse: any) => {
          if (apiResponse?.Response.status_code === 200) {
            this.allData = apiResponse.Response.data || [];
            this.dummyData = this.allData;
            if (this.dummyData && this.dummyData[0]?.is_finalised) {
              this.freezeData = true;
            }

            else {
              this.freezeData = false;
            }
            let totals = {
              req: 0.00,
              doa: 0.00,
              sau: 0.00,
              ssc: 0.00,
              nsc: 0.00,
              pvt: 0.00,
              others: 0.00,
              total: 0.00,
              shtorsur: 0.00
            };
            this.dummyData.forEach(item => {
              totals.req += parseFloat(item.req) || 0.00;
              totals.doa += parseFloat(item.doa) || 0.00;
              totals.sau += parseFloat(item.sau) || 0.00;
              totals.ssc += parseFloat(item.ssc) || 0.00;
              totals.nsc += parseFloat(item.nsc) || 0.00;
              totals.pvt += parseFloat(item.pvt) || 0.00;
              totals.others += parseFloat(item.others) || 0.00;
              totals.total += parseFloat(item.total) || 0.00;
              totals.shtorsur += parseFloat(item.shtorsur) || 0.00;
            });

            let filteredData = [];
            this.dummyData.forEach((el) => {
              const cropIndex = filteredData.findIndex(
                (item) => item.crop_code === el.crop_code
              );
              if (cropIndex === -1) {
                filteredData.push({
                  crop_name: el.crop_name,
                  crop_code: el.crop_code,
                  variety_count: 1,
                  crop_seed_req: parseFloat(el.req).toFixed(2),
                  crop_doa: parseFloat(el.doa).toFixed(2),
                  crop_ssc: parseFloat(el.ssc).toFixed(2),
                  crop_nsc: parseFloat(el.nsc).toFixed(2),
                  crop_sau: parseFloat(el.sau).toFixed(2),
                  crop_pvt: parseFloat(el.pvt).toFixed(2),
                  crop_others: parseFloat(el.others).toFixed(2),
                  crop_total: parseFloat(el.total).toFixed(2),
                  crop_shtorsur: parseFloat(el.shtorsur).toFixed(2),
                  variety: [
                    {
                      variety_code: el.variety_code,
                      variety_name: el.variety_name,



                      req: parseFloat(el.req).toFixed(2),
                      doa: parseFloat(el.doa).toFixed(2),
                      sau: parseFloat(el.sau).toFixed(2),
                      ssc: parseFloat(el.ssc).toFixed(2),
                      nsc: parseFloat(el.nsc).toFixed(2),
                      pvt: parseFloat(el.pvt).toFixed(2),
                      others: parseFloat(el.others).toFixed(2),
                      total: parseFloat(el.total).toFixed(2),
                      shtorsur: parseFloat(el.shtorsur).toFixed(2)
                    },
                  ],
                });
              } else {
                filteredData[cropIndex].variety_count += 1;
                filteredData[cropIndex].crop_seed_req = (
                  parseFloat(filteredData[cropIndex].crop_seed_req) +
                  parseFloat(el.req)
                ).toFixed(2);
                filteredData[cropIndex].crop_doa = (
                  parseFloat(filteredData[cropIndex].crop_doa) +
                  parseFloat(el.doa)
                ).toFixed(2);
                filteredData[cropIndex].crop_ssc = (
                  parseFloat(filteredData[cropIndex].crop_ssc) +
                  parseFloat(el.ssc)
                ).toFixed(2);
                filteredData[cropIndex].crop_nsc = (
                  parseFloat(filteredData[cropIndex].crop_nsc) +
                  parseFloat(el.nsc)
                ).toFixed(2);
                filteredData[cropIndex].crop_sau = (
                  parseFloat(filteredData[cropIndex].crop_sau) +
                  parseFloat(el.sau)
                ).toFixed(2);
                filteredData[cropIndex].crop_pvt = (
                  parseFloat(filteredData[cropIndex].crop_pvt) +
                  parseFloat(el.pvt)
                ).toFixed(2);
                filteredData[cropIndex].crop_others = (
                  parseFloat(filteredData[cropIndex].crop_others) +
                  parseFloat(el.others)
                ).toFixed(2);
                filteredData[cropIndex].crop_total = (
                  parseFloat(filteredData[cropIndex].crop_total) +
                  parseFloat(el.total)
                ).toFixed(2);
                filteredData[cropIndex].crop_shtorsur = (
                  parseFloat(filteredData[cropIndex].crop_shtorsur) +
                  parseFloat(el.shtorsur)
                ).toFixed(2);
                filteredData[cropIndex].variety.push({
                  variety_code: el.variety_code,
                  variety_name: el.variety_name,
                  req: parseFloat(el.req).toFixed(2),
                  doa: parseFloat(el.doa).toFixed(2),
                  sau: parseFloat(el.sau).toFixed(2),
                  ssc: parseFloat(el.ssc).toFixed(2),
                  nsc: parseFloat(el.nsc).toFixed(2),
                  pvt: parseFloat(el.pvt).toFixed(2),
                  others: parseFloat(el.others).toFixed(2),
                  total: parseFloat(el.total).toFixed(2),
                  shtorsur: parseFloat(el.shtorsur).toFixed(2)
                });
              }


            })
            this.finalData = filteredData;
            this.totalData = totals;
            this.enableTable = true;

          } else {
            console.warn('API returned an unexpected status:', apiResponse?.Response.status_code);
          }
        },
        (error) => {
          if (error.status === 404) {
            this.dummyData = [];
            this.freezeData = false;
            this.enableTable = false;
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

  exportexcel(): void {
    let element = document.getElementById('excel-tables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);

  }



  isAddMore() {
    this.isCheck = true;
    if (this.dummyData && this.dummyData[0]?.is_finalised) {
      this.freezeData = true;

    } else {
      this.freezeData = false;
    }
  }
  updateForm() {
    if (this.ngForm.invalid) {
      return;
    }
    if (!this.ngForm.controls["req"].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Req can not be 0</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    const req = this.ngForm.controls['req'].value || 0;
    const ssc = this.ngForm.controls['ssc'].value || 0;
    const doa = this.ngForm.controls['doa'].value || 0;
    const sau = this.ngForm.controls['sau'].value || 0;
    const pvt = this.ngForm.controls['pvt'].value || 0;
    const nsc = this.ngForm.controls['nsc'].value || 0;
    const others = this.ngForm.controls['others'].value || 0;
    const total = (ssc + doa + sau + pvt + nsc + others);
    const shtorsur = total - req;
    const baseParam = {
      "user_id": this.authUserId,
      "req": req,
      "ssc": ssc,
      "doa": doa,
      "sau": sau,

      "pvt": pvt,
      "nsc": nsc,
      "others": others,
      "remarks": this.ngForm.controls['remarks'].value,
      "total": total,
      "shtorsur": shtorsur
    };
    const route = `update-req-fs/${this.dataId}`;

    this.zsrmServiceService.putRequestCreator(route, null, baseParam,).subscribe(data => {
      if (data.Response.status_code === 200) {
       
        this.isShowTable = true;
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        }).then(() => {
          this.ngForm.controls['variety'].reset('');
          this.selectVariety = '';
           this.is_update = false;
          this.getPageData();
          this.ngForm.controls['req'].reset('');
          this.ngForm.controls['doa'].reset('');
          this.ngForm.controls['sau'].reset('');
          this.ngForm.controls['remarks'].patchValue('');
          this.ngForm.controls['others'].reset('');

          this.ngForm.controls['ssc'].reset('');
          this.ngForm.controls['nsc'].reset('');
          this.ngForm.controls['pvt'].reset('');
          this.submitted = false;
          this.isAddSelected = false;
        })
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
  resetForm() {

    this.ngForm.controls['crop'].reset('');
    this.ngForm.controls['variety'].reset('');
    this.selectCrop = '';
    this.selectVariety = '';
    this.isShowTable = true;
    this.isAddSelected = false;
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


}
