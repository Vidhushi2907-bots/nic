import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ZsrmServiceService } from 'src/app/services/zsrm-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-srr',
  templateUrl: './srr.component.html',
  styleUrls: ['./srr.component.css']
})

export class SrrComponent implements OnInit {
  validate(event: any): void {
    const inputElement = event.target;
    const t = inputElement.value;

    // Allow numbers with up to two decimal places
    const regex = /^\d*\.?\d{0,2}$/;

    // Get cursor position
    const cursorPosition = inputElement.selectionStart;

    // Check if the value matches the regex
    if (regex.test(t)) {
      inputElement.dataset.previousValue = t; // Save valid value
    } else {
      inputElement.value = inputElement.dataset.previousValue || ''; // Revert to the last valid value
    }

    // Restore the cursor position
    const adjustment = inputElement.value.length - t.length;
    inputElement.setSelectionRange(cursorPosition + adjustment, cursorPosition + adjustment);
  }

  searchClicked: any;
  selectedTable: any;
  selectstate: any;
  selectedSeedType: any;
  productionType: any;
  isDisableNormal: boolean;
  isDisableDelay: boolean;
  isDisableNormalReallocate: boolean;

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any = [];
  allViewSrr: any = [];
  is_update: boolean = false;
  dropdownSettings: IDropdownSettings = {};
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
  unit: string = '';
  showQuantity = false;
  croplistSecond: any[];
  selectCrop: any;
  selectVariety: any;
  selectVarietyStatus: any;
  isAddSelected: boolean = false;
  isPatchData: boolean;
  formBuilder: any;
  update_Form: boolean = false;
  isChangeMessage: string;
  developedBy_error: string;

  constructor(
    private fb: FormBuilder,
    private zsrmServiceService: ZsrmServiceService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getCropData();
    this.loadAuthUser();

  }
  formatNumber(value: number) {
    return value ? value.toFixed(2) : '';
  }
  SaveAsData() {
    this.isAddSelected = true;
    this.isChangeMessage = "Entre the Source Availability"
    const year = this.ngForm.controls['year'].value;
    const seed_type = this.ngForm.controls['seed_type'].value;
    const crop = this.ngForm.controls['crop'].value;
    this.getViewSrr(year,seed_type,crop);
    // const queryParams = [];
    // if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    // if (seed_type) queryParams.push(`seed_type=${encodeURIComponent(seed_type)}`);
    // if (crop) queryParams.push(`crop_code=${encodeURIComponent(crop)}`);
    // const apiUrl = `view-srr?${queryParams.join('&')}`;
    // this.zsrmServiceService.getRequestCreator(apiUrl, null, null).subscribe(
    //   (apiResponse: any) => {


    //     if (apiResponse.Response.status_code === 200) {
    //       this.allViewSrr = apiResponse.Response.data
    //       this.ngForm.controls['acheiveSrr'].setValue(apiResponse.Response.data.srr);
    //       this.ngForm.controls['acheivePlannedAreaUnderCropInHa'].setValue(apiResponse.Response.data.plannedAreaUnderCropInHa)
    //       this.ngForm.controls['acheiveSeedRateInQtPerHt'].setValue(apiResponse.Response.data.seedRateInQtPerHt)
    //       this.ngForm.controls['acheivePlannedSeedQuanDis'].setValue(apiResponse.Response.data.plannedSeedQuanDis)
    //       this.ngForm.controls['acheivePlannedSrr'].setValue(apiResponse.Response.data.plannedSrr)

    //     }


    //   },
    //   (error) => {

    //     console.error('Error fetching data:', error);
    //   }
    // );

  }
  getViewSrr(year: string, seed_type: string, crop_code: string): void {
    try {
      const queryParams: string[] = [];
      if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
      if (seed_type) queryParams.push(`seed_type=${encodeURIComponent(seed_type)}`);
      if (crop_code) queryParams.push(`crop_code=${encodeURIComponent(crop_code)}`);
  
      const apiUrl = `view-srr?${queryParams.join('&')}`;
      console.log('Calling API:', apiUrl);
  
      if (!this.zsrmServiceService || !this.zsrmServiceService.getRequestCreator) {
        console.error('zsrmServiceService is not initialized properly.');
        return;
      }
  
      this.zsrmServiceService.getRequestCreator(apiUrl, null, null).subscribe({
        next: (apiResponse: any) => {
          console.log('API Response:', apiResponse);
  
          if (apiResponse?.Response?.status_code === 200) {
            this.allViewSrr = apiResponse.Response.data;
  
            if (this.ngForm && this.ngForm.controls) {
              this.ngForm.controls['acheiveSrr'].setValue(apiResponse.Response.data.srr ?? '');
              this.ngForm.controls['acheivePlannedAreaUnderCropInHa'].setValue(apiResponse.Response.data.plannedAreaUnderCropInHa ?? '');
              this.ngForm.controls['acheiveSeedRateInQtPerHt'].setValue(apiResponse.Response.data.seedRateInQtPerHt ?? '');
              this.ngForm.controls['acheivePlannedSeedQuanDis'].setValue(apiResponse.Response.data.plannedSeedQuanDis ?? '');
              this.ngForm.controls['acheivePlannedSrr'].setValue(apiResponse.Response.data.plannedSrr ?? '');
            } else {
              console.error('ngForm is not initialized properly.');
            }
          } else {
            console.error('Unexpected response structure:', apiResponse);
          }
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        },
        complete: () => {
          console.log('API request completed.');
        }
      });
  
    } catch (error) {
      console.error('Error in getViewSrr function:', error);
    }
  }
  

  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      seed_type: ['', [Validators.required]],
      acheiveSrr: [''],
      acheivePlannedAreaUnderCropInHa: [''],
      acheiveSeedRateInQtPerHt: [''],
      acheivePlannedSeedQuanDis: [''],
      acheivePlannedSrr: [''],
      plannedAreaUnderCropInHa: [0, [Validators.required]],
      seedRateInQtPerHt: [0, [Validators.required]],
      plannedSeedQuanDis: [0, [Validators.required]],
      plannedSrr: [{ value: 0, disabled: true }],
      areaSownUnderCropInHa: [0, [Validators.required]],
      seedRateAcheived: [0, [Validators.required]],
      seedQuanDis: [0, [Validators.required]],
      acheivedSrr: [{ value: 0, disabled: true }],
      crop_text: [''],


    });
    this.ngForm.valueChanges.subscribe(values => {
      const acheivedSrr = ((((values.areaSownUnderCropInHa || 0) / (values.seedRateAcheived || 0)) / values.seedQuanDis) * 100)

      const plannedSrr = ((((values.plannedAreaUnderCropInHa || 0) / (values.seedRateInQtPerHt || 0)) / values.plannedSeedQuanDis) * 100)

      this.ngForm.patchValue(
        { acheivedSrr: acheivedSrr, plannedSrr: plannedSrr },
        { emitEvent: false }
      );
    });
    this.ngForm.valueChanges.subscribe((formValues) => {
      const { year, crop, seed_type } = formValues;

      if (year || crop || seed_type) {
        this.getPageData();
        this.isShowTable = true

      }
    });

    this.ngForm.controls['year'].valueChanges.subscribe(() => this.resetSelections());
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
    this.ngForm.controls['seed_type'].valueChanges.subscribe(() => this.resetSelections());
    
  }
  createAndSave() {
    this.isShowTable = true
    this.submitted = true;
    this.saveForm();
  }
  patchDataForUpdate(data: any) {
 

    this.isAddSelected = true;
    this.isChangeMessage = "Update the Source Availability";
    this.isEditMode = true;
    this.is_update = true;
    this.dataId = data.id;
    this.isShowTable = false;
    const cropName = this.cropData.find(crop => crop.crop_code === data.crop_code)?.crop_name;
    this.ngForm.controls['year'].patchValue(data.year);
    this.ngForm.controls['seed_type'].patchValue(data.seed_type);
    this.ngForm.controls['crop'].patchValue(data.crop_code);
    if (data) {
      console.log(data,'data')
      this.selectCrop = cropName;
      this.ngForm.controls['acheiveSrr'].patchValue(data.srr);
      this.ngForm.controls['acheivePlannedAreaUnderCropInHa'].patchValue(data.targetAreaUnderCropInHa);
      this.ngForm.controls['acheiveSeedRateInQtPerHt'].patchValue(data.targetSeedRateInQtPerHt);
      this.ngForm.controls['acheivePlannedSeedQuanDis'].patchValue(data.targetSeedQuanDis);
      this.ngForm.controls['acheivePlannedSrr'].patchValue(data.targetSrr );
      this.ngForm.controls['plannedAreaUnderCropInHa'].patchValue(Number(data.areaSownUnderCropInHa));
      this.ngForm.controls['seedRateInQtPerHt'].patchValue(Number(data.seedRateAcheived));
      this.ngForm.controls['plannedSeedQuanDis'].patchValue(Number(data.seedQuanDis));
      this.ngForm.controls['areaSownUnderCropInHa'].patchValue(data.NextYearAreaUnderCropInHa); // Remarks might be a string, no conversion needed
      this.ngForm.controls['seedRateAcheived'].patchValue(Number(data.NextYearseedRateInQtPerHt));
      this.ngForm.controls['seedQuanDis'].patchValue(Number(data.NextYearSeedQuanDis));
      this.ngForm.patchValue(
        { acheivedSrr: data.acheivedSrr, plannedSrr: data.NextYearSrr },
        { emitEvent: false }
      );


    }
  }


  resetSelections() {
    this.isShowTable = false;
    // this.isAddSelected = false;
  }

  loadAuthUser() {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    if (BHTCurrentUser) {
      const data = JSON.parse(BHTCurrentUser);
      this.authUserId = data.id || null;
    }
  }

  cClick() {
    document.getElementById('crop').click();
  }

  crop(item: any) {
    this.selectCrop = item && item.crop_name ? item.crop_name : ''
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropData = this.croplistSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
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

  }
  saveForm() {
    this.submitted = true;
    this.isShowTable = true;
    const route = "add-srr";
    const req = this.ngForm.controls['plannedAreaUnderCropInHa'].value || 0;
    const ssc = this.ngForm.controls['seedRateInQtPerHt'].value || 0;
    const doa = this.ngForm.controls['plannedSeedQuanDis'].value || 0;
    const sau = this.ngForm.controls['plannedSrr'].value || 0;
    const sfci = this.ngForm.controls['areaSownUnderCropInHa'].value || 0;
    const pvt = this.ngForm.controls['seedRateAcheived'].value || 0;
    const nsc = this.ngForm.controls['seedQuanDis'].value || 0;
    const others = this.ngForm.controls['acheivedSrr'].value || 0;
    const baseParam = {
      "user_id": this.authUserId,
      "year": this.ngForm.controls['year'].value,
      "seed_type": this.ngForm.controls['seed_type'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      "plannedAreaUnderCropInHa": req,
      "seedRateInQtPerHt": ssc,
      "plannedSeedQuanDis": doa,
      "plannedSrr": sau,
      "areaSownUnderCropInHa": sfci,
      "seedRateAcheived": pvt,
      "seedQuanDis": nsc,
      "acheivedSrr": others,
    };
    this.zsrmServiceService.postRequestCreator(route, null, baseParam).subscribe(data => {
      if (data.Response.status_code === 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        }).then(x => {
          this.getPageData();
          this.ngForm.controls['plannedAreaUnderCropInHa'].reset('');
          this.ngForm.controls['seedRateInQtPerHt'].reset('');
          this.ngForm.controls['plannedSeedQuanDis'].reset('');
          this.ngForm.controls['plannedSrr'].patchValue('');
          this.ngForm.controls['areaSownUnderCropInHa'].reset('');
          this.ngForm.controls['seedRateAcheived'].reset('');
          this.ngForm.controls['seedQuanDis'].reset('');
          this.ngForm.controls['acheivedSrr'].reset('');
          this.submitted = false;
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
  developedBy(item: any) {
    if (!item) {
      this.developedBy_error = 'Please Select Seed type';
    }
    this.ngForm.controls['seed_type'].setValue(item);
  }

  getPageData(loadPageNumberData: number = 1) {
    this.filterPaginateSearch.itemList = [];
    const year = this.ngForm.controls['year'].value;
    const crop = this.ngForm.controls['crop'].value;
    const seed_type = this.ngForm.controls['seed_type'].value;
    const page = loadPageNumberData;
    const pageSize = (this.filterPaginateSearch.itemListPageSize = 5);
    const queryParams = [];
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (crop) queryParams.push(`crop_code=${encodeURIComponent(crop)}`);
    if (seed_type) queryParams.push(`seed_type=${encodeURIComponent(seed_type)}`);


    queryParams.push(`page=${encodeURIComponent(page)}`);
    queryParams.push(`limit=${encodeURIComponent(pageSize)}`);
    const apiUrl = `view-srr-all?${queryParams.join('&')}`;
    this.zsrmServiceService.getRequestCreator(apiUrl).subscribe(
      (apiResponse: any) => {
        if (apiResponse?.Response.status_code === 200) {
          this.allData = apiResponse.Response.data || [];
          this.filterPaginateSearch.Init(
            this.allData.data,
            this,
            'getPageData',
            undefined,
            apiResponse.Response.data.pagination.totalRecords,
            true
          );
          this.initSearchAndPagination();
        } else {
          console.warn('API returned an unexpected status:', apiResponse?.Response.status_code);
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  initSearchAndPagination() {
    // Implement your search and pagination initialization logic
  }


  productionTypeValue(value) {
    if (value) {
      this.productionType = value;
      if (this.productionType == "Hybird") {
        this.isDisableNormal = false;
        this.isDisableNormalReallocate = true;
      } else if (this.productionType == "Variety") {
        this.isDisableNormal = true;
        this.isDisableNormalReallocate = true;
      }
    }
  }

  updateForm() {
    this.submitted = true;
    this.isShowTable = true
    if (this.ngForm.invalid) {
      return;
    }
    const plannedAreaUnderCropInHa = this.ngForm.controls['plannedAreaUnderCropInHa'].value || 0;
    const seedRateInQtPerHt = this.ngForm.controls['seedRateInQtPerHt'].value || 0;
    const plannedSeedQuanDis = this.ngForm.controls['plannedSeedQuanDis'].value || 0;
    const areaSownUnderCropInHa = this.ngForm.controls['areaSownUnderCropInHa'].value || 0;
    const seedRateAcheived = this.ngForm.controls['seedRateAcheived'].value || 0;
    const seedQuanDis = this.ngForm.controls['seedQuanDis'].value || 0;
   
    const acheivedSrr = ((((plannedAreaUnderCropInHa || 0) / (seedRateAcheived || 0)) / seedQuanDis) * 100)

    const plannSrr = ((((plannedAreaUnderCropInHa || 0) / (seedRateInQtPerHt || 0)) / plannedSeedQuanDis) * 100)

    const baseParam = {
      "user_id": this.authUserId,
      "plannedAreaUnderCropInHa": plannedAreaUnderCropInHa,
      "seedRateInQtPerHt": seedRateInQtPerHt,
      "plannedSeedQuanDis": plannedSeedQuanDis,
      "plannedSrr": plannSrr,
      "areaSownUnderCropInHa": areaSownUnderCropInHa,
      "seedRateAcheived": seedRateAcheived,
      "seedQuanDis": seedQuanDis,
      "acheivedSrr": acheivedSrr,
    };
    const route = `update-srr/${this.dataId}`;
    this.zsrmServiceService.putRequestCreator(route, null, baseParam,).subscribe(data => {
      if (data.Response.status_code === 200) {
        this.is_update = true;
        this.isShowTable = true;
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        }).then(() => {
          this.getPageData();
          this.ngForm.controls['plannedAreaUnderCropInHa'].reset('');
          this.ngForm.controls['seedRateInQtPerHt'].reset('');
          this.ngForm.controls['plannedSeedQuanDis'].reset('');
          this.ngForm.controls['plannedSrr'].patchValue('');
          this.ngForm.controls['areaSownUnderCropInHa'].reset('');
          this.ngForm.controls['seedRateAcheived'].reset('');
          this.ngForm.controls['seedQuanDis'].reset('');
          this.ngForm.controls['acheivedSrr'].reset('');
         
          this.submitted = false;
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
}


