import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { MasterService } from 'src/app/services/master/master.service';
import { environment } from 'src/environments/environment';
import { checkDecimalValue, checkLength } from 'src/app/_helpers/utility';
import { SeedRollingPlanningService } from 'src/app/services/seed-rolling-plan/seed-rolling-planning.service';
// import { ChangeDetectorRef } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { distinctUntilChanged } from 'rxjs';


@Component({
  selector: 'app-state-login-replanning',
  templateUrl: './state-login-replanning.component.html',
  styleUrls: ['./state-login-replanning.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateLoginReplanningComponent implements OnInit, AfterViewInit {
  [x: string]: any;

  fileName = 'breeder-bsp-profarma-one.xlsx';

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup;
  baseUrl: string = environment.ms_nb_06_production_center.baseUrl;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  varietyList: any[] = [];
  is_update: boolean = false;
  isCrop: boolean = false;
  isBspc: boolean = false;
  isSearch: boolean = true;
  dropdownSettings: IDropdownSettings = {};
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryCropData: any;
  statusData = [
    { id: 1, name: 'Accept' },
    { id: 0, name: 'Reject' }
  ];

  statusData2 = [

    { id: 1, name: 'Accept' },
    { id: 0, name: 'Reject' },

  ];


  bspsDataArray: { production_center: string; total_area: string; crop: string; variety_name: string; variety_code: string; bspc_developed_by: number; req_no_doc_moa: string; req_no_dept_moa: string; nucleus_seed_available: any; breeder_seed_available: any; total_target: string; }[];
  userId: any;
  bspData: any;
  isFinalSubmit: boolean = false;
  cropBasicDetails: any;
  varietyFilterList: any;
  isSubmit: boolean = true;
  unitValue: string;
  bspcData: any;
  isShowDiv: boolean = true;
  isActive: number
  totalSeedRequired: number = 0;
  displayStyle: string;
  isFormDivShow: boolean;
  rawVarieties: any[] = [];
  loading = false;
  filteredBspc: any[] = [];
  editModalVisible = false;   // modal show/hide
  editRowIndex: number | null = null;  // which row is being edited
  editRowForm!: FormGroup;    // separate form for modal
  showOnlyBreeder: [false];
  isFinalSubmitButtonHide: boolean;



  constructor(
    private service: SeedServiceService,
    private _masterService: MasterService,
    private breeder: BreederService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _productionCenter: ProductioncenterService,
    private master: MasterService,
    private srpService: SeedRollingPlanningService,
    private cd: ChangeDetectorRef
  ) {
    this.bspcData = this.breeder.redirectData;
  }


  get newVarietyArr(): FormArray {
    return this.ngForm.get('newVarietyArr') as FormArray;
  }

  newVarietyArrData(): FormGroup {
    return this.fb.group({
      variety_name: [''],
      tentative_breeder_qty: [''],
      is_status_active2: ['']

    })
  }

  
  ngOnInit(): void {
    this.ngForm = this.fb.group({

      year: [''],
      season: [{ value: '', disabled: true }],
      crop: [{ value: '', disabled: true }],
      global_search: [''],
      bspc: this.fb.array([]),
      newVarietyArr: this.fb.array([])
    });

    this.loadYear();

    this.ngForm.get('year')?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(val => {
        const season = this.ngForm.get('season');
        const crop = this.ngForm.get('crop');

        if (val) {
          season?.enable({ emitEvent: false });
          // crop?.reset();
          crop?.disable({ emitEvent: false });
          this.loadSeason();
        } else {
          season?.reset();
          season?.disable({ emitEvent: false });
          // crop?.reset();
          crop?.disable({ emitEvent: false });
        }
      });


    // Enable Crop when Season is selected
    this.ngForm.get('season')?.valueChanges.subscribe(val => {
      const crop = this.ngForm.get('crop');

      if (val) {
        crop?.enable();
        this.loadCrop();
      } else {
        crop?.disable();
        //crop?.reset();
      }
    });

    this.ngForm.get('global_search')?.valueChanges.subscribe((searchText: string) => {
      this.applySearch(searchText);
    });

    const bspcArray = this.ngForm.get('bspc') as FormArray;
    this.filteredBspc = bspcArray.controls; // initialize filtered array

    const year = localStorage.getItem('year');
    const season = localStorage.getItem('season');
    const crop = localStorage.getItem('crop_code');

    this.route.queryParams.subscribe(params => {
      const isLocked = params['isLocked'] === 'true';
      if (isLocked && year && season && crop) {
        this.ngForm.patchValue({
          year: year,
          season: season,
          crop: crop,
        });

        this.getPageData(); // 🔥 auto search
      }
    });
  }
  private tooltipsInitialized = false;

  ngAfterViewInit() {
    if (this.tooltipsInitialized) return;

    requestAnimationFrame(() => {
      document
        .querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach(el => new bootstrap.Tooltip(el));

      this.tooltipsInitialized = true;
    });
  }

  searchData() {
    const year = this.ngForm.get('year')?.value;
    const season = this.ngForm.get('season')?.value;
    const crop_code = this.ngForm.get('crop')?.value
    console.log(year, season, crop_code)
    if (year && season && crop_code) {
      localStorage.setItem('year', year);
      localStorage.setItem('season', season);
      localStorage.setItem('crop_code', crop_code);
    }
const year1 = localStorage.getItem('year');
    const season1 = localStorage.getItem('season');
    const crop = localStorage.getItem('crop_code');
    console.log(year1,season1,crop)
    this.ngForm.patchValue({
      global_search: '',

    });

    // Hide crop card
    this.isCrop = false;
    if (this.bspc && this.bspc.clear) {
      this.bspc.clear();
    }

    // reload data
    this.getPageData();
  }

  loadYear() {
    this.srpService.postRequestCreator('srp-state-replanning-year', null, null)
      .subscribe(res => {
        if (res?.EncryptedResponse?.status_code === 200) {
          this.inventoryYearData = res.EncryptedResponse.data;

          // ✅ FORCE UI UPDATE
          this.cd.markForCheck();

          if (this.bspcData?.year) {
            this.ngForm.get('year')?.setValue(this.bspcData.year, { emitEvent: false });
          }
        }
      });
  }

  trackByYear(index: number, item: any) {
    return item.year;
  }

  loadSeason() {
    let year = Number(this.ngForm.controls['year']?.value)
    const apiUrl = `srp-state-replanning-season?year=${year}`
    this.srpService.postRequestCreator(apiUrl, null, null).subscribe({
      next: (data: any) => {

        if (
          data &&
          data.EncryptedResponse &&
          data.EncryptedResponse.data &&
          data.EncryptedResponse.status_code === 200
        ) {
          this.inventorySeasonData = data.EncryptedResponse.data;

        } else {
          console.warn('⚠️ No valid data received in EncryptedResponse');
          this.inventoryYearData = [];
        }
      },
      error: (err) => {
        console.error('❌ Error fetching years:', err);
      },
    });
  }

  loadCrop() {
    let year = Number(this.ngForm.controls['year']?.value)
    let season = this.ngForm.controls['season']?.value;
    //console.log(year,season)
    const apiUrl = `srp-state-replanning-crop?year=${year}&season=${season}`
    this.srpService.postRequestCreator(apiUrl, null, null).subscribe({
      next: (data: any) => {

        if (
          data &&
          data.EncryptedResponse &&
          data.EncryptedResponse.data &&
          data.EncryptedResponse.status_code === 200
        ) {
          this.inventoryCropData = data.EncryptedResponse.data;

        } else {
          console.warn('⚠️ No valid data received in EncryptedResponse');
          this.inventoryYearData = [];
        }
      },
      error: (err) => {
        console.error('❌ Error fetching years:', err);
      },
    });
  }

  getPageData() {
    const year = this.ngForm.controls['year'].value;
    const season = this.ngForm.controls['season'].value;
    const crop = this.ngForm.controls['crop'].value;


    if (!year || !season || !crop) {
      Swal.fire({
        icon: "warning",
        title: "Please Select All Required Fields",
        showConfirmButton: true,
      });
      return;
    }

    this.isCrop = true;
    this.isBspc = true;

    const bspcArray = this.ngForm.get('bspc') as FormArray;
    bspcArray.clear();

    // 🔥 VERY IMPORTANT — this fills BSPC rows so UI becomes visible
    // this.populateDummyData();
    this.fetchAndPopulate(year, season, crop);

    this.filteredBspc = bspcArray.controls;

    const newVarietyArr = this.ngForm.get('newVarietyArr') as FormArray;
    newVarietyArr.clear();

    this['dummyVarietyList'].forEach(item => {
      newVarietyArr.push(this.createNewVarietyGroup(item));
    });

    const year1 = this.ngForm.get('year')?.value;
    const season1 = this.ngForm.get('season')?.value;
    const crop1 = this.ngForm.get('crop')?.value;
    
    if (year1 && season1 && crop1) {
      localStorage.setItem('year', year1);
      localStorage.setItem('season', season1);
      localStorage.setItem('crop', crop1);
    }
  }

  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }

  createVarietyGroup(item: any): FormGroup {

    const replacesArray = this.fb.array(
      (item.replace_varieties || []).map((r: any) =>
        this.fb.group({
          replace_id: [r.replace_id],
          replace_variety_code: [r.replace_variety_code],
          replace_variety_name: [r.replace_variety_name],
          replace_quantity: [r.replace_tentative_quantity??r.replace_quantity],
          replace_is_accept: [
            r.replace_is_accept === true ? 1 :
              r.replace_is_accept === false ? 0 : null
          ]
        })
      )
    );

    return this.fb.group({
      // 🔥 REQUIRED BY BACKEND
      srp_crop_wise_id: [item.srp_crop_wise_id],
      srp_variety_wise_id: [
        item.srp_variety_wise_id ?? item.id
      ],
      variety_code: [item.variety_code],
      variety_name: [item.variety_name],
      target_breeder_seed: [item.target_breeder_seed],
      tentative_quantity: [item.tentative_quantity],
      willingness: [item.willingness ? 'Yes' : 'No'],

      replaces: replacesArray
    });
  }

  getReplaceAcceptReject(group: FormGroup, index: number): string {
    const replacesArr = this.getReplacesArray(group);

    const value = replacesArr.at(index).get('replace_is_accept')?.value;

    if (value === 1) {

      return "Accept"
    }
    else {
      return "Reject"
    }
  }

  createNewVarietyGroup(item: any): FormGroup {
    return this.fb.group({
      new_variety_code: [item.new_variety_code],
      new_variety_name: [item.new_variety_name],
      new_quantity_available: [item.new_quantity_available ?? 0],
      new_quantity_required: [item.new_quantity_required],
      new_is_accept: [
        item.new_is_accept === true ? 1 :
          item.new_is_accept === false ? 0 :
            null
      ]   // ✅ important
    });
  }

  getReplaces(i: number) {
    return (this.bspc.at(i).get("replaces") as FormArray);
  }
  getReplacesArray(group: AbstractControl): FormArray {

    return group.get('replaces') as FormArray;
  }

  fetchAndPopulate(year: number | string, season: string, crop: string) {
    this.loading = true;

    const apiUrl = `srp-state-replanning-variety?year=${year}&season=${season}&crop_code=${crop}`;

    this.srpService.postRequestCreator(apiUrl, null, null).subscribe({
      next: (res: any) => {
        const response = res?.EncryptedResponse;

        // 🔴 Handle API-level error
        if (!response || response.status_code !== 200) {
          this.bspc.clear();
          this.filteredBspc = [];
          this.loading = false;

          // optional alert
          Swal.fire(
            'No Data',
            response?.message || 'No crop data found',
            'info'
          );
          return;
        }

        const data = response.data ?? [];
        console.log(data, "data")
        this.isFinalSubmitButtonHide = data.some((item: any) => item?.is_final_submit === true);
        this.bspc.clear();

        data.forEach(item => {
          this.bspc.push(this.createVarietyGroup(item));
        });

        this.filteredBspc = this.bspc.controls;
        this.loading = false;
        this.cd.markForCheck();
      },
      error: () => {

        this.loading = false;
        Swal.fire('Error', 'Server error occurred', 'error');
      }
    });


    this.fetchNewVarieties(year, season, crop);
  }

  fetchNewVarieties(year: number | string, season: string, crop: string) {

    const apiUrl = `srp-state-replanning-new-variety?year=${year}&season=${season}&crop_code=${crop}`;

    this.srpService.postRequestCreator(apiUrl, null, null).subscribe({
      next: (res: any) => {

        const data = res?.EncryptedResponse?.data ?? [];

        if (!Array.isArray(data)) return;

        this.newVarietyArr.clear();

        data.forEach(item => {
          this.newVarietyArr.push(this.createNewVarietyGroup(item));
        });

        this.cd.markForCheck();
      },
      error: () => { }
    });
  }

  buildBspcPayload() {
    const bspcArr = this.ngForm.get('bspc') as FormArray;

    return bspcArr.controls.map((ctrl: FormGroup) => {
      const replacesArr = ctrl.get('replaces') as FormArray;

      return {
        // 🔥 REQUIRED BY BACKEND
        srp_crop_wise_id: ctrl.get('srp_crop_wise_id')?.value,
        srp_variety_wise_id: ctrl.get('srp_variety_wise_id')?.value,
        is_available: ctrl.get('willingness')?.value === 'No' ? false : true,
        quantity: ctrl.get('tentative_quantity')?.value,
        replace_varieties: replacesArr?.controls.map((r: FormGroup) => {
          
          return {
            replace_variety_code: r.get('replace_variety_code')?.value,
            replace_quantity: r.get('replace_quantity')?.value,
            is_accept: String(r.get('replace_is_accept')?.value) === '1'
          };
        }) || []
      };
    });
  }

  draftPopup() {
    this.isFinalSubmit = false;

    const cropWiseId =
      this.buildBspcPayload()?.[0]?.srp_crop_wise_id; // ✅ FIX

    if (!cropWiseId) {
      console.error('❌ srp_crop_wise_id missing');
      return;
    }

    const newVarietyFormArr = this.ngForm.get('newVarietyArr') as FormArray;
    const existingVarietyPayload = this.buildBspcPayload();

    const newVarietyPayload = newVarietyFormArr.controls
      .map((ctrl: FormGroup) => {
        const varietyCode = ctrl.get('new_variety_code')?.value;
        if (!varietyCode) return null;

        return {
          srp_crop_wise_id: cropWiseId,
          new_variety_code: varietyCode,
          quantity_available: ctrl.get('new_quantity_available')?.value ?? 0,
          quantity_required: ctrl.get('new_quantity_required')?.value ?? 0,
          is_accept: String(ctrl.get('new_is_accept')?.value) === '1'
        };
      })
      .filter(Boolean);

    const draftPayload = {
      action: 'draft',
      replanningData: [
        ...existingVarietyPayload,
        ...newVarietyPayload
      ]
    };

    console.log('FINAL DRAFT PAYLOAD =>', draftPayload);

    this.srpService.postRequestCreator(
      'srp-add-state-replanning-variety',
      '',
      draftPayload
    ).subscribe({
  next: (res: any) => {
    console.log('Draft save response =>', res);
    Swal.fire('Saved as Draft!', '', 'success');
    this.getPageData();   // refresh data after save
  },
  error: (err: any) => {
    console.error('Draft save error =>', err);
    Swal.fire('Error!', 'Something went wrong while saving draft.', 'error');
  }
});
   
   
  }

  saveEditPopup() {
    this.isFinalSubmit = true;

    const bspcArr = this.ngForm.get('bspc') as FormArray;
    const newVarietyFormArr = this.ngForm.get('newVarietyArr') as FormArray;

    const cropWiseId = this.buildBspcPayload()?.[0]?.srp_crop_wise_id;

    if (!cropWiseId) {
      console.error('❌ srp_crop_wise_id missing');
      return;
    }

    const newVarietyPayload = (this.ngForm.get('newVarietyArr') as FormArray)
      .controls
      .map((ctrl: FormGroup) => {
        const code = ctrl.get('new_variety_code')?.value;
        if (!code) return null;

        return {
          srp_crop_wise_id: cropWiseId, // 🔥 FIX: same as draft
          new_variety_code: code,
          quantity_available: ctrl.get('new_quantity_available')?.value ?? 0,
          quantity_required: ctrl.get('new_quantity_required')?.value ?? 0,
          is_accept: String(ctrl.get('new_is_accept')?.value) === '1'
        };
      })
      .filter(Boolean);

    const finalPayload = {
      action: 'final',
      replanningData: [
        ...this.buildBspcPayload(),
        ...newVarietyPayload
      ]
    };
    console.log('FINAL PAYLOAD =>', finalPayload);


    /* -------------------- SUMMARY DATA -------------------- */
    const variety_wise_replan = bspcArr.controls
      .map((ctrl: FormGroup) => {
        const replacesArr = ctrl.get('replaces') as FormArray;
        const replaces = replacesArr?.controls || [];

        return replaces.length
          ? replaces.map((r: FormGroup) => {
            // const rawValue = r.get('replace_is_accept')?.value;

            // let action = 'Select';
            // if (rawValue === '1' || rawValue === 1) {
            //   action = 'Accept';
            // } else if (rawValue === '0' || rawValue === 0) {
            //   action = 'Reject';
            // }
            const rawValue = r.get('replace_is_accept')?.value;

            // normalize
            const normalized = rawValue !== null && rawValue !== undefined
              ? String(rawValue)
              : '';

            let action = 'Select';

            if (normalized === '1') {
              action = 'Accept';
            } else if (normalized === '0') {
              action = 'Reject';
            }
            return {
              variety_name: ctrl.get('variety_name')?.value,
              target_breeder_seed: ctrl.get('target_breeder_seed')?.value,
              willingness: ctrl.get('willingness')?.value || 'No',
              tentative_quantity: ctrl.get('tentative_quantity')?.value,
              replace_variety_name:
                r.get('replace_variety_name')?.value || ' ',
              replace_quantity: r.get('replace_quantity')?.value || '',
              replace_is_accept: action
            };
          })
          : [{
            variety_name: ctrl.get('variety_name')?.value,
            target_breeder_seed: ctrl.get('target_breeder_seed')?.value,
            willingness: ctrl.get('willingness')?.value || 'No',
            tentative_quantity: ctrl.get('tentative_quantity')?.value,
            replace_variety_name: ' ',
            replace_quantity: '',
            replace_is_accept: ''
          }];
      })
      .flat();

    const newVarietyArr = newVarietyFormArr.controls.map((ctrl: FormGroup) => ({
      new_variety_name: ctrl.get('new_variety_name')?.value || '-',
      new_quantity_available: ctrl.get('new_quantity_available')?.value,
      new_is_accept: ctrl.get('new_is_accept')?.value,
      new_quantity_required: ctrl.get('new_quantity_required')?.value
    }));

    /* -------------------- SUMMARY HTML (YOUR CODE) -------------------- */
    // SUMMARY HTML
    const summaryHtml = `
  <div style="max-height: 500px; overflow-y: auto; border: 1px solid #ccc; border-radius: 6px; margin-top: 10px;">
    <table style="width:100%; border-collapse: collapse; font-size:14px; table-layout: fixed;">
      <thead style="background:#f5f5f5; position: sticky; top: 0;">
        <tr>
          <th style="border:1px solid #ccc; padding:10px; min-width:180px;">Variety Name</th>
          <th style="border:1px solid #ccc; padding:10px; min-width:200px;">Target Breeder Seed Quantity (QTL.)</th>
          <th style="border:1px solid #ccc; padding:10px; min-width:150px;">Willingness</th>
          <th style="border:1px solid #ccc; padding:10px; min-width:200px;">Tentative Breeder Seed Quantity (QTL.)</th>
          <th style="border:1px solid #ccc; padding:10px; min-width:200px;">Replacement Variety Name</th>
          <th style="border:1px solid #ccc; padding:10px; min-width:200px;">Tentative Breeder Seed Quantity (QTL.)</th>
          <th style="border:1px solid #ccc; padding:10px; min-width:120px;">Action</th>
        </tr>
      </thead>
      <tbody>
        ${variety_wise_replan
        .map(
          (v, i) => `
              <tr>
                <td style="border:1px solid #ccc; padding:10px; min-width:180px;text-align: justify;">${v.variety_name}</td>
                <td style="border:1px solid #ccc; padding:10px; min-width:200px;">${v.target_breeder_seed}</td>
                <td style="border:1px solid #ccc; padding:10px; min-width:150px;">${v.willingness}</td>
                <td style="border:1px solid #ccc; padding:10px; min-width:200px;">${v.tentative_quantity}</td>
                <td style="border:1px solid #ccc; padding:10px; min-width:200px;">${v.replace_variety_name}</td>
                <td style="border:1px solid #ccc; padding:10px; min-width:200px;">${v.replace_quantity}</td>
                <td style="border:1px solid #ccc; padding:10px; min-width:120px;">${v.replace_is_accept}</td>
                
              </tr>`
        )
        .join("")}
      </tbody>
    </table>
  </div>
`;

    `<br><hr>`
    const summaryHtml2 = `
  <div style="max-height: 500px; overflow-y: auto; border: 1px solid #ccc; border-radius: 6px; margin-top: 10px;">
    <table style="width:100%; border-collapse: collapse; font-size:14px; table-layout: fixed;">
      <thead style="background:#f5f5f5; position: sticky; top: 0;">
        <tr>
          <th style="border:1px solid #ccc; padding:10px; min-width:220px;">Variety Name</th>
          <th style="border:1px solid #ccc; padding:10px; min-width:200px;">Tentative Breeder Seed Qty (QTL.)</th>
          <th style="border:1px solid #ccc; padding:10px; min-width:150px;">Action</th>
          <th style="border:1px solid #ccc; padding:10px; min-width:220px;">Tentative Breeder Seed Qty (QTL.) - II</th>
        </tr>
      </thead>
 
      <tbody>
        ${newVarietyArr
        .map(
          (v, i) => `
              <tr>
                <td style="border:1px solid #ccc; padding:10px; min-width:220px;">${v.new_variety_name}</td>
 
                <td style="border:1px solid #ccc; padding:10px; min-width:200px;">
                  ${v.new_quantity_available ?? ""}
                </td>
 
                <td style="border:1px solid #ccc; padding:10px; min-width:150px;">
                  ${v.new_is_accept == 1
              ? "Accept"
              : v.new_is_accept == 0
                ? "Reject"
                : "—"
            }
                </td>
 
                <td style="border:1px solid #ccc; padding:10px; min-width:220px;">
                   ${v.new_is_accept == 1 ? v.new_quantity_required : "—"}
                </td>
              </tr>`
        )
        .join("")}
      </tbody>
    </table>
  </div>
`;

    /* -------------------- CONFIRM POPUP -------------------- */
    Swal.fire({
      title: 'Confirm Final Submission',
      html: summaryHtml + '<br><hr>' + summaryHtml2,
      width: 1500,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#B64B1D',
      allowOutsideClick: false
    }).then(result => {
      if (!result.isConfirmed) return;

      this.srpService
        .postRequestCreator('srp-add-state-replanning-variety', '', finalPayload)
        .subscribe(() => {
          Swal.fire({
            title: '<p style="font-size:22px;">Data Submitted Successfully!</p>',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15',
          }).then(() => {
            this.isFinalSubmitButtonHide = true;
            this.getPageData()
            this.cd.detectChanges()
            // LOCK EXISTING VARIETY GRID
            const bspcArr = this.ngForm.get('bspc') as FormArray;
            bspcArr.disable();

            // 🔒 LOCK NEW VARIETY GRID (FIXED)
            const newVarietyFA = this.ngForm.get('newVarietyArr') as FormArray;
            newVarietyFA.disable();

            this.ngForm.get('year')?.disable();
            this.ngForm.get('season')?.disable();
            this.ngForm.get('crop')?.disable();

          });
        });
    });
  }


  checkPositiveValue(index: number) {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const control = bspcArray.at(index).get('Req_Qty_of_breeder_seed');
    const value = Number(control?.value);

    if (isNaN(value) || value <= 0) {
      Swal.fire({
        title: 'Invalid Input',
        text: 'Please enter a positive number greater than zero for "Req Qty of Breeder Seed".',
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then(() => {
        control?.setValue(null);
      });
    }
  }

  /** 🚫 Prevent typing of negative sign, exponential (e/E), or + sign */
  preventNegativeInput(event: KeyboardEvent, index: number) {
    if (['-', 'e', 'E', '+'].includes(event.key)) {
      event.preventDefault();
    }
  }

  applySearch(searchText: string) {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const allRows = bspcArray.controls;

    if (!searchText?.trim()) {
      this.filteredBspc = allRows;
      return;
    }

    const lower = searchText.trim().toLowerCase();

    this.filteredBspc = allRows.filter(ctrl => {
      // top-level fields
      const varietyName = (ctrl.get('variety_name')?.value || '').toLowerCase();
      const targetQty = (ctrl.get('target_breeder_seed')?.value || '').toString().toLowerCase();
      const willingness = (ctrl.get('willingness')?.value || '').toLowerCase();
      const tentativeQty = (ctrl.get('tentative_quantity')?.value || '').toString().toLowerCase();

      // nested replaces array
      const replacesArr = ctrl.get('replaces') as FormArray;
      const replaceMatch = replacesArr?.controls.some(r => {
        const name = (r.get('replace_variety_name')?.value || '').toLowerCase();
        const qty = (r.get('replace_quantity')?.value || '').toString().toLowerCase();
        const action = (r.get('replace_is_accept')?.value || '').toString().toLowerCase();
        return name.includes(lower) || qty.includes(lower) || action.includes(lower);
      }) ?? false;

      // match if any top-level field OR any replace field contains search
      return varietyName.includes(lower)
        || targetQty.includes(lower)
        || willingness.includes(lower)
        || tentativeQty.includes(lower)
        || replaceMatch;
    });
  }

  preventNegative(i: number) {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const control = bspcArray.at(i).get('Req_Qty_of_breeder_seed');

    if (control && control.value < 0) {
      control.setValue(0); // Reset to zero instead of showing popup
    }
  }

  getFilteredRows() {
    const bspcArray = this.ngForm?.get('bspc') as FormArray;
    if (!bspcArray) return [];

    if (this.filteredBspc && this.filteredBspc.length) {
      return this.filteredBspc;
    }

    return bspcArray.controls;
  }

  selectVariety(i: number, item: any): void {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const row = bspcArray.at(i);
    if (row) {
      row.patchValue({
        variety_name: item.variety_name,
        variety_code: item.code
      });
    }
  }

  onSelectVariety(index: number, variety: any) {
    const row = this.newVarietyArr.at(index);
    row.patchValue({
      variety_name: variety.variety_name,
      tentative_breeder_qty: variety.tentative_breeder_qty,
      is_status_active2: variety.is_status_active2
    });

    // Apply accept/reject logic immediately
    this.onStatusChange2(index);
  }

  // ✅ Accept/Reject logic
  onStatusChange2(index: number) {
    const row = this.newVarietyArr.at(index) as FormGroup;
    const status = Number(row.get('is_status_active2')?.value);

    if (status === 1) {
      // Accept → only breeder qty visible
      row.get('tentative_breeder_qty')?.enable({ emitEvent: false });
      row.get('showOnlyBreeder')?.setValue(true);
    } else {
      // Reject / null → all fields visible
      row.get('tentative_breeder_qty')?.disable({ emitEvent: false });
      row.get('showOnlyBreeder')?.setValue(false);
    }
  }
  trackByBspc(index: number, ctrl: AbstractControl) {
    return ctrl.get('id')?.value ?? index;
  }

  trackByReplace(index: number, ctrl: AbstractControl) {
    return ctrl.get('replace_id')?.value ?? index;
  }


  onAddSpa() {
    const year = this.ngForm.get('year')?.value;
    const season = this.ngForm.get('season')?.value;
    const crop_code = this.ngForm.get('crop')?.value;
    console.log(this.ngForm, year, season, "................................")
    // ✅ Pehle localStorage me set karo
    if (year && season && crop_code) {
      localStorage.setItem('year', year);
      localStorage.setItem('season', season);
      localStorage.setItem('crop_code', crop_code);

      // ✅ Phir navigate karo with query params
      this.router.navigate(
        ['/assign-spa'],
        {
          queryParams: {
            isLocked: true,
            year: year,
            season: season,
            crop_code: crop_code
          }
        }
      );
    } else {
      console.warn('Year, Season or Crop Code missing');
    }
  }








}
