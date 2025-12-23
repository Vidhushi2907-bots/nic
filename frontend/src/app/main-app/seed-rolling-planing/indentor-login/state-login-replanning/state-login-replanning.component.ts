import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { Router } from '@angular/router';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { MasterService } from 'src/app/services/master/master.service';
import { environment } from 'src/environments/environment';
import { checkDecimalValue, checkLength } from 'src/app/_helpers/utility';
import { SeedRollingPlanningService } from 'src/app/services/seed-rolling-plan/seed-rolling-planning.service';
// import { ChangeDetectorRef } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
 
 
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
    { id: 0, name: 'Reject' }
  ];
 
 
  bspsDataArray: { id: number; production_center: string; total_area: string; crop: string; variety_name: string; variety_code: string; bspc_developed_by: number; req_no_doc_moa: string; req_no_dept_moa: string; nucleus_seed_available: any; breeder_seed_available: any; total_target: string; }[];
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
  isFinalSubmitButtonHide: boolean = false;
 
 
  constructor(private service: SeedServiceService, private _masterService: MasterService, private breeder: BreederService, private fb: FormBuilder, private route: Router, private _productionCenter: ProductioncenterService,
    private master: MasterService, private srpService: SeedRollingPlanningService, private cd: ChangeDetectorRef) {
    // this.createForm();
    this.bspcData = this.breeder.redirectData;
    if (this.bspcData && this.bspcData !== undefined && this.bspcData != null) {
      if (this.bspcData.year && this.bspcData.total_area && this.bspcData.crop_code) {
        this.ngForm.controls['year'].patchValue(this.bspcData.year);
        this.ngForm.controls['total_area'].patchValue(this.bspcData.total_area);
 
        // this.getPageData();
      }
    }
  }
  // createForm() {
  //   this.ngForm = this.fb.group({
  //     id: [''],
  //     year: ['', [Validators.required]],
  //     season: ['', [Validators.required]],
  //     crop: ['', [Validators.required]],
  //     variety: [''],
  //     name: [''],
  //     state: [''],
  //     crop_text: [''],
  //     bsp1Arr: this.fb.array([
  //       // this.bsp2arr(),
  //     ]),
  //     newVarietyArr: this.fb.array([
  //       // this.bsp2arr(),
  //     ]),
  //     bspc: this.fb.array([]),
  //     global_search: [''],
  //     teams: [''],
  //   });
 
  //   // this.ngForm.controls['season'];
  //   // this.ngForm.controls['crop'];
  //   // this.ngForm.controls['year'];
  //   this.ngForm.controls['season'].disable();
  //   this.ngForm.controls['crop'].disable();
  //   // this.ngForm.controls['year'].disable();
  //   this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
  //     if (newvalue) {
  //       this.ngForm.controls['season'].enable();
  //       this.allData = []
  //       this.isCrop = false;
  //       this.isFormDivShow = false;
  //       this.bspc.clear();
  //       this.isSearch = false;
 
 
  //       this.ngForm.controls['plots_array'].setValue('');
  //       this.ngForm.controls['id'].setValue('')
 
  //     }
  //   });
 
  //   this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
  //     if (newvalue) {
  //       this.ngForm.controls['crop'].enable();
  //       this.allData = []
  //       this.isCrop = false;
  //       this.isFormDivShow = false;
  //       this.bspc.clear();
  //       this.isSearch = false;
 
 
  //       this.ngForm.controls['plots_array'].setValue('');
  //       this.ngForm.controls['id'].setValue('')
 
  //     }
  //   });
 
  // }
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
 
  // your existing form array
 
  ngOnInit(): void {
    this.loadYear();
    this.ngForm = this.fb.group({
      year: [''],
      season: [{ value: '', disabled: true }],
      crop: [{ value: '', disabled: true }],
      global_search: [''],
      bspc: this.fb.array([]),
      newVarietyArr: this.fb.array([])
    });
 
    this.ngForm.get('year')?.valueChanges.subscribe(val => {
      const season = this.ngForm.get('season');
      const crop = this.ngForm.get('crop');
 
      if (val) {
        season?.enable();
        this.loadSeason();
        crop?.disable();
        // crop?.reset();
      } else {
        season?.disable();
        crop?.disable();
        // season?.reset();
        // crop?.reset();
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
 
    // wire search filter
    this.ngForm.get('global_search')?.valueChanges.subscribe((searchText: string) => {
      this.applyFilter(searchText);
    });
 
  }
 
  ngAfterViewInit() {
    const tooltipEls = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
 
    tooltipEls.forEach((el) => {
      new bootstrap.Tooltip(el);
    });
  }
 
  loadYear() {
    const apiUrl = 'srp-state-replanning-year'
    this.srpService.postRequestCreator(apiUrl, null, null).subscribe({
      next: (data: any) => {
 
        if (
          data &&
          data.EncryptedResponse &&
          data.EncryptedResponse.data &&
          data.EncryptedResponse.status_code === 200
        ) {
          this.inventoryYearData = data.EncryptedResponse.data;
 
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
          console.log(this.inventoryCropData, "............crop")
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
  private fillBspcFromArray(dataArr: any[]) {
 
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    if (!bspcArray) return;
 
    bspcArray.clear();
 
    dataArr.forEach(variety => {
      bspcArray.push(this.fb.group({
 
        // 🔑 Required for backend
        srp_crop_wise_id: [variety.srp_crop_wise_id],
        srp_variety_wise_id: [variety.srp_variety_wise_id],
 
        // Display fields
        variety_name: [variety.variety_name ?? ''],
        target_breeder_seed: [
          variety.target_breeder_seed ?? 0,
          [Validators.required, Validators.min(0)]
        ],
        willingness: [variety.willingness ?? 0],
 
        // 🔑 Quantity used in POST
        quantity: [
          variety.quantity ?? variety.tentative_breeder_seed_quantity ?? null,
          [Validators.min(0)]
        ],
 
        // Availability / Action
        is_available: [variety.is_available ?? true],
 
        remarks: [variety.remarks ?? null],
 
        // 🔁 Replace varieties (important)
        replaces: this.buildReplaceArray(variety.replace_varieties || [])
      }));
    });
 
    this.filteredBspc = bspcArray.controls;
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
    //this.cd.detectChanges();
 
    // NEW VARIETY SECTION
    const newVarietyArr = this.ngForm.get('newVarietyArr') as FormArray;
    newVarietyArr.clear();
 
    this['dummyVarietyList'].forEach(item => {
      newVarietyArr.push(this.createNewVarietyGroup(item));
    });
 
 
 
    // this.cd.detectChanges();
  }
 
 
  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }
 
 
 
  // Build FormArray for replaces
  private buildReplaceArray(replaces: any[] = []): FormArray<FormGroup> {
    const arr = this.fb.array<FormGroup>([]);
 
    replaces.forEach(r => {
      arr.push(
        this.fb.group({
          replace_id: [r.replace_id],
          replace_variety_code: [r.replace_variety_code],
          replace_variety_name: [r.replace_variety_name],
          replace_quantity: [r.replace_quantity],
          replace_tentative_quantity: [r.replace_tentative_quantity],
          replace_is_accept: [
            r.replace_is_accept === true ? 1 :
              r.replace_is_accept === false ? 2 : ''
          ]
        })
      );
    });
 
    return arr;
  }
 
 
  // Create main row group
  createVarietyGroup(item: any): FormGroup {
 
    const replacesArray = this.fb.array(
      (item.replace_varieties || []).map((r: any) =>
        this.fb.group({
          replace_id: [r.replace_id],
          replace_variety_code: [r.replace_variety_code],
          replace_variety_name: [r.replace_variety_name],
          replace_quantity: [r.replace_quantity],
          replace_is_accept: [
            r.replace_is_accept === true ? '1' :
              r.replace_is_accept === false ? '0' : ''
          ]
        })
      )
    );
 
    return this.fb.group({
      // 🔥 REQUIRED BY BACKEND
      srp_crop_wise_id: [item.srp_crop_wise_id],
      srp_variety_wise_id: [item.id],
 
      // UI fields
      id: [item.id],
      variety_code: [item.variety_code],
      variety_name: [item.variety_name],
      target_breeder_seed: [item.target_breeder_seed],
      tentative_quantity: [item.tentative_quantity],
      willingness: [item.willingness ? 'Yes' : 'No'],
 
      replaces: replacesArray
    });
  }
 
 
 
  createNewVarietyGroup(item: any): FormGroup {
    return this.fb.group({
      new_variety_code: [item.new_variety_code],
      new_variety_name: [item.new_variety_name],
      new_quantity_available: [item.new_quantity_available],
      new_quantity_required: [null],
      new_is_accept: ['']
    });
  }
 
 
 
 
  // Get replaces for a specific row
  getReplaces(i: number) {
    return (this.bspc.at(i).get("replaces") as FormArray);
  }
  getReplacesArray(group: AbstractControl): FormArray {
    return group.get('replaces') as FormArray;
  }
 
 
  // API Call
  // fetchAndPopulate(year: number | string, season: string, crop: string) {
 
  //   this.loading = true;
 
  //   const apiUrl = `srp-state-replanning-variety?year=${year}&season=${season}&crop_code=${crop}`;
 
  //   this.srpService.postRequestCreator(apiUrl, null, null).subscribe({
  //     next: (res: any) => {
 
  //       const data = res?.EncryptedResponse?.data ?? [];
 
  //       if (!Array.isArray(data)) {
  //         this.loading = false;
  //         return;
  //       }
 
  //       // 🔥 Batch build (FAST)
  //       const bspcGroups = data
  //         .filter(item => item.is_additional === false)
  //         .map(item => this.createVarietyGroup(item));
 
  //       this.bspc.clear();
 
  //       bspcGroups.forEach(group => this.bspc.push(group));
 
 
  //       this.filteredBspc = this.bspc.controls;
 
  //       this.loading = false;
  //       this.cd.markForCheck(); // ✔ only here
  //     },
  //     error: () => {
  //       this.loading = false;
  //     }
  //   });
  // }
 
  fetchAndPopulate(year: number | string, season: string, crop: string) {
    this.loading = true;
 
    const apiUrl = `srp-state-replanning-variety?year=${year}&season=${season}&crop_code=${crop}`;
 
    this.srpService.postRequestCreator(apiUrl, null, null).subscribe({
      next: (res: any) => {
        const data = res?.EncryptedResponse?.data ?? [];
 
        if (!Array.isArray(data)) {
          this.loading = false;
          return;
        }
 
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
      }
    });
 
    // 2️⃣ New additional varieties
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
 
 
 
 
  buildBspcForm(apiData: any[]) {
    const bspcFA = this.ngForm.get('bspc') as FormArray;
    bspcFA.clear();
 
    apiData.forEach(row => {
      bspcFA.push(
        this.fb.group({
          srp_crop_wise_id: [row.srp_crop_wise_id],
          srp_variety_wise_id: [row.srp_variety_wise_id],
          willingness: [row.willingness],
          target_breeder_seed: [row.target_breeder_seed],
          tentative_quantity: [row.tentative_quantity],
          variety_name: [row.variety_name],
          replaces: this.fb.array(
            (row.replace_varieties || []).map((r: any) =>
              this.fb.group({
                replace_variety_code: [r.replace_variety_code],
                replace_variety_name: [r.replace_variety_name],
                replace_quantity: [r.replace_quantity],
                replace_is_accept: [r.replace_is_accept]
              })
            )
          )
        })
      );
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
 
 
        // REQUIRED FIELDS
        is_available: ctrl.get('willingness')?.value === true,
        quantity: ctrl.get('tentative_quantity')?.value,
 
        // REPLACE VARIETIES
        replace_varieties: replacesArr?.controls.map((r: FormGroup) => ({
          replace_variety_code: r.get('replace_variety_code')?.value,
          replace_quantity: r.get('replace_quantity')?.value,
          is_accept: String(r.get('replace_is_accept')?.value) === '1'
        })) || []
      };
    });
  }
 
 
 
  draftPopup() {
    this.isFinalSubmit = false;
 
    const cropWiseId = this.ngForm.get('srp_crop_wise_id')?.value; // 🔥 FIX
    const newVarietyFormArr = this.ngForm.get('newVarietyArr') as FormArray;
 
    const existingVarietyPayload = this.buildBspcPayload();
 
    const newVarietyPayload = newVarietyFormArr.controls
      .map((ctrl: FormGroup) => {
        const varietyCode = ctrl.get('new_variety_code')?.value;
        if (!varietyCode) return null;
 
        return {
          srp_crop_wise_id: cropWiseId, // ✅ ALWAYS VALID
          new_variety_code: varietyCode,
          quantity_available: ctrl.get('new_quantity_available')?.value,
          quantity_required: ctrl.get('new_quantity_required')?.value,
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
 
    console.log('DRAFT PAYLOAD =>', draftPayload);
 
    this.srpService.postRequestCreator(
      'srp-add-state-replanning-variety',
      '',
      draftPayload
    ).subscribe(() => {
      Swal.fire('Saved as Draft!', '', 'success');
    });
  }
 
 
 
 
 
  // saveEditPopup() {
  //   this.isFinalSubmit = true; // Final submit mode
 
  //   Swal.fire({
  //     title: 'Success!',
  //     text: 'Data submitted successfully. You can no longer edit Required Qty of Breeder Seed.',
  //     icon: 'success',
  //     confirmButtonText: 'OK'
  //   }).then(() => {
  //     const bspcArray = this.ngForm.get('bspc') as FormArray;
 
  //     if (bspcArray && bspcArray.length > 0) {
  //       bspcArray.controls.forEach((row: AbstractControl) => {
  //         const group = row as FormGroup;
  //         const reqQtyControl = group.get('Req_Qty_of_breeder_seed');
  //         if (reqQtyControl) {
  //           reqQtyControl.disable(); // disable inputs
  //         }
  //       });
  //     }
 
  //     // ✅ Hide the grid after submission
  //     this.isShowDiv = false;
  //   });
  // }
 
  saveEditPopup() {
    this.isFinalSubmit = true;
 
    const bspcArr = this.ngForm.get('bspc') as FormArray;
    const newVarietyFormArr = this.ngForm.get('newVarietyArr') as FormArray;
 
 
    /* -------------------- BUILD PAYLOAD -------------------- */
    const existingVarietyPayload = this.buildBspcPayload();
 
    const newVarietyPayload = newVarietyFormArr.controls
      .map((ctrl: FormGroup) => {
        if (!ctrl.get('new_variety_code')?.value) return null;
 
        return {
          srp_crop_wise_id: ctrl.get('srp_crop_wise_id')?.value,
          new_variety_code: ctrl.get('new_variety_code')?.value,
          quantity_required: ctrl.get('new_quantity_required')?.value,
          quantity_available: ctrl.get('new_quantity_available')?.value,
          is_accept:
            ctrl.get('new_is_accept')?.value === 1 ||
            ctrl.get('new_is_accept')?.value === true
        };
      })
      .filter(Boolean);
 
    const finalPayload = {
      action: 'final',
      replanningData: [...existingVarietyPayload, ...newVarietyPayload]
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
 
  applyFilter(searchText: string) {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const allRows = bspcArray.controls;
 
    if (!searchText?.trim()) {
      this.filteredBspc = allRows;
      return;
    }
 
    const lower = searchText.trim().toLowerCase();
 
    this.filteredBspc = allRows.filter(ctrl => {
      const name = (ctrl.get('variety_name')?.value || '').toLowerCase();
      const replacement = (ctrl.get('replacement_variety_name')?.value || '').toLowerCase();
      return name.includes(lower) || replacement.includes(lower);
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
    const year = this.ngForm.controls['year']?.value;
    const season = this.ngForm.controls['season']?.value;
    const crop = this.ngForm.controls['crop']?.value;
 
    if (!year || !season || !crop) {
      console.warn('Year / Season / Crop missing');
      return;
    }
 
    const spaContext = {
      year,
      season,
      crop
    };
 
    localStorage.setItem('spaContext', JSON.stringify(spaContext));
 
    this.route.navigate(['/add-spa']);
  }
 
 
 
 
}
 
 
 
 