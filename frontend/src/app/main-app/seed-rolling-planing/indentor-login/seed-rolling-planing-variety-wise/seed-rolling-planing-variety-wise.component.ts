import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { HttpClient, HttpParams } from '@angular/common/http';
import { SeedRollingPlanningService } from 'src/app/services/seed-rolling-plan/seed-rolling-planning.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-seed-rolling-planing-variety-wise',
  templateUrl: './seed-rolling-planing-variety-wise.component.html',
  styleUrls: ['./seed-rolling-planing-variety-wise.component.css']
})
export class SeedRollingPlaningVarietyWiseComponent implements OnInit {
  [x: string]: any;

  fileName = 'breeder-bsp-profarma-one.xlsx';

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup;
  baseUrl: string = environment.ms_nb_06_production_center.baseUrl;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;

  is_update: boolean = false;
  isCrop: boolean = false;
  isSearch: boolean = true;
  dropdownSettings: IDropdownSettings = {};
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryCropData: any;
  bspsDataArray: { id: number; production_center: string; total_area: string; crop: string; variety_name: string; variety_code: string; bspc_developed_by: number; req_no_doc_moa: string; req_no_dept_moa: string; nucleus_seed_available: any; breeder_seed_available: any; total_target: string; }[];
  userId: any;
  bspData: any;
  showToggle = false;         // toggles appear only after draft saved
  isFinalSubmit = false;
  // isFinalSubmit: boolean = false;
  cropBasicDetails: any;
  varietyFilterList: any;
  isSubmit: boolean = true;
  unitValue: string;
  bspcData: any;
  isShowDiv: boolean = true;
  isActive: number
  totalSeedRequired: number = 0;
  displayStyle: string;
  cropCodePush: string;
  filteredBspc: AbstractControl[] = [];
  isSubmitted = false;
  srp_crop_wise_id: any;
  smr1 = 2;
  smr2 = 2;

  editModalVisible = false;   // modal show/hide
  editRowIndex: number | null = null;  // which row is being edited
  editRowForm!: FormGroup;    // separate form for modal
  disabledForm = false;

  crop_wise_json: any[] = [];
  isLoading = true;
  isSubmitting = false;
  disableField = false;
  isFinalSubmitButtonHide = false;


  constructor(private breeder: BreederService, private fb: FormBuilder, private route: ActivatedRoute, private srpService: SeedRollingPlanningService, private router: Router
  ) {
    // this.createForm();
    this.bspcData = this.breeder.redirectData;
    if (this.bspcData && this.bspcData !== undefined && this.bspcData != null) {
      if (this.bspcData.year && this.bspcData.total_area && this.bspcData.crop_code) {
        this.ngForm.controls['year'].patchValue(this.bspcData.year);
        this.ngForm.controls['total_area'].patchValue(this.bspcData.total_area);
      }
    }
  }
  ngOnInit(): void {
    this.srp_crop_wise_id = this.route.snapshot.paramMap.get('id');
    let id = this.route.snapshot.paramMap.get('id');
    const crop_code = this.route.snapshot.paramMap.get('crop_code');
    this.cropCodePush = this.route.snapshot.paramMap.get('crop_code');
    this.ngForm = this.fb.group({
      bspc: this.fb.array([]),
      global_search: [''],
    });

    const bspcArray = this.ngForm.get('bspc') as FormArray;
    bspcArray.push(this.createBspcRow());
    this.filteredBspc = bspcArray.controls;
    bspcArray.valueChanges.subscribe(() => {
      this.calculateTotalSeedRequired();
    });





    //  Listen to global search field
    this.ngForm.get('global_search')?.valueChanges.subscribe((searchText: string) => {
      this.applyFilter(searchText);
    });
    this.getVarietyDetails(id, crop_code);
    this.getCropDetailsById(id, crop_code);


    // ✅ Initialize filtered rows
    this.filteredBspc = bspcArray?.controls || [];
    this.ngForm.get('global_search')?.valueChanges.subscribe((searchText: string) => {
      this.applyFilter(searchText);
    });
  }

  applyVarietySearch(searchText: string) {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    if (!bspcArray) return;

    const lowerSearch = (searchText || '').toLowerCase().trim();

    // If search is empty → show all rows
    if (!lowerSearch) {
      this.filteredBspc = bspcArray.controls;
      return;
    }

    // Filter based only on Variety Name
    this.filteredBspc = bspcArray.controls.filter((ctrl: AbstractControl) => {
      const varietyName = (ctrl.get('variety_name')?.value || '').toLowerCase();
      return varietyName.includes(lowerSearch);
    });
  }


  onSeedInputChange(index: number): void {
    this.calculateTotalSeedRequired();
    this.updateRemainingSeeds();
  }

  getCropDetailsById(id, crop_code: string, is_active?: number) {
    this.isLoading = true;
    let route = `get-crop-details-data?id=${id}&crop_code=${crop_code}`;
    this.srpService.getRequestCreatorNew(route).subscribe({
      next: (res: any) => {
        const data = res?.EncryptedResponse?.data || [];

        this.crop_wise_json = data.map((item: any) => {
          // 🟢 Take first NON-ZERO valid one
          const totalRequired =
            Number(item.total_required) > 0
              ? Number(item.total_required)
              : Number(item.total_required_seed) > 0
                ? Number(item.total_required_seed)
                : Number(item.required_qty_of_certified_seeds) > 0
                  ? Number(item.required_qty_of_certified_seeds)
                  : 0;

          return {
            crop_name: item['m_crop.crop_name'] || item.crop_name || '',
            total_area: Number(item.total_area) || 0,

            // 🔥 Final clean and correct field
            total_required: totalRequired,

            // 🟢 Initialize: Remaining = Total Required
            rem_req_seeds: totalRequired,
          };
        });

        // 🔥 Recalculate to sync grid values (if user has pre-filled rows)
        this.calculateTotalSeedRequired();

        console.log('Final crop_wise_json:', this.crop_wise_json);

        this.isLoading = false;
      },

      error: (err) => {
        console.error('API error:', err);
        this.isLoading = false;
        this.crop_wise_json = [];
      },
    });
  }
  getVarietyDetails(id, crop_code?: string) {
    let apiRoute = 'get-variety-details-data';

    this.srpService
      .getRequestCreatorNew(
        `${apiRoute}?id=${id}&crop_code=${crop_code}`
      )
      .subscribe({
        next: (res: any) => {
          let dataArr = res?.EncryptedResponse?.data || [];
          const bspcArray = this.ngForm.get('bspc') as FormArray;
          bspcArray.clear();

          this.disabledForm = false; // Reset

          if (dataArr.length === 0) {
            this.filteredBspc = [];
            return;
          }

          // Check if any row has final submit
          const isFinal = dataArr.some((x) => x.is_final_submit == 1);
          if (isFinal) {
            this.disabledForm = true;
            // Only keep active rows
            dataArr = dataArr.filter((x) => x.is_active === true);
            if (dataArr.length === 0) {
              this.filteredBspc = [];
              return;
            }
          }

          // Build form rows
          dataArr.forEach((item: any) => {
            const group = this.fb.group({
              id: [item.id || null],
              crop_code: [item.crop_code || null],
              variety_code: [item?.variety_code || null],
              variety_name: [item?.variety_name || ''],
              notification_year: [item?.notification_year || ''],

              Req_Qty_of_breeder_seed: [
                item.required_qty_of_certified_seeds ?? 0,
                [Validators.required, Validators.min(0)],
              ],

              foundation_seed: [0],
              breeder_seed: [0],

              is_active: [!!item?.is_active],

              showActions: [false],
              srp_crop_wise_id: [item?.srp_crop_wise_id || null],
              is_final_submit: [item?.is_final_submit == 1 ? true : false],
              isRowLocked: [false]
            });

            // Auto calculation
            const qty = group.get('Req_Qty_of_breeder_seed')?.value || 0;
            if (qty) {
              const foundation = qty / this.smr1;
              const breeder = foundation / this.smr2;

              group.get('foundation_seed')?.setValue(
                parseFloat(foundation.toFixed(2)),
                { emitEvent: false }
              );
              group.get('breeder_seed')?.setValue(
                parseFloat(breeder.toFixed(2)),
                { emitEvent: false }
              );
            }

            group
              .get('Req_Qty_of_breeder_seed')
              ?.valueChanges.subscribe((qty: number) => {
                const foundation = qty / this.smr1;
                const breeder = foundation / this.smr2;

                group.get('foundation_seed')?.setValue(
                  parseFloat(foundation.toFixed(2)),
                  { emitEvent: false }
                );
                group.get('breeder_seed')?.setValue(
                  parseFloat(breeder.toFixed(2)),
                  { emitEvent: false }
                );
              });

            bspcArray.push(group);
          });

          // ⭐ Apply row disable logic based on is_active AND final submit
          bspcArray.controls.forEach((ctrl: FormGroup) => {
            const isActive = ctrl.get('is_active')?.value;

            if (!isActive) {
              // Row is inactive → disable all fields except toggle
              Object.keys(ctrl.controls).forEach((key) => {
                if (key !== 'is_active')
                  ctrl.get(key)?.enable({ emitEvent: false });
              });
            } else if (this.disabledForm) {
              // Final submit → disable specific fields but keep toggle enabled
              ['Req_Qty_of_breeder_seed', 'foundation_seed', 'breeder_seed'].forEach((field) =>
                ctrl.get(field)?.disable({ emitEvent: false })
              );
            } else {
              // Row is active → enable all fields
              Object.keys(ctrl.controls).forEach((key) => ctrl.get(key)?.enable({ emitEvent: false }));
            }
          });

          this.filteredBspc = bspcArray.controls;
        },

        error: (err) => console.error('Error fetching variety details:', err),
      });
  }


  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }
  createBspcRow(data: any = null): FormGroup {
    return this.fb.group({
      id: [data?.id || null],
      variety_name: [data?.variety_name || ''],
      notification_year: [data?.notification_year || ''],
      Req_Qty_of_breeder_seed: [data?.required_qty_of_certified_seeds || null],
      foundation_seed: [{ value: data?.foundation_seed || null, disabled: true }],
      breeder_seed: [{ value: data?.breeder_seed || null, disabled: true }],
      is_active: [data?.is_active ?? 1], // default to ON
      is_final_submit: [data?.is_final_submit ?? 0],
    });
  }

  initializeRowStates() {
    this['bspcArray'].controls.forEach((row: FormGroup) => {
      const isActive = row.get('is_active')?.value;

      if (isActive) {
        row.get('Req_Qty_of_breeder_seed')?.enable();
      } else {
        row.get('Req_Qty_of_breeder_seed')?.disable();
      }

      // Calculated fields always readonly
      row.get('foundation_seed')?.disable();
      row.get('breeder_seed')?.disable();
    });
  }

  calculateTotalSeedRequired(control?: AbstractControl) {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    if (!bspcArray || bspcArray.length === 0) return;

    // 1️⃣ Sum all quantities
    let totalCertifiedSeedQty = bspcArray.controls.reduce((sum, ctrl: AbstractControl) => {
      return sum + (Number(ctrl.get('Req_Qty_of_breeder_seed')?.value) || 0);
    }, 0);

    const apiCrop = this.crop_wise_json[0];
    const totalRequiredSeed = Number(apiCrop.total_required) || 0;

    // 2️⃣ Check if limit reached
    if (totalCertifiedSeedQty > totalRequiredSeed) {
      Swal.fire({
        title: 'Limit Reached!',
        text: 'You cannot enter more. Required Quantity of Certified Seeds should not be greater than Total Required Seeds.',
        icon: 'warning',
        confirmButtonColor: '#B64B1D'
      }).then(() => {
        // ✅ Reset only the last modified field after clicking OK
        if (control) {
          control.get('Req_Qty_of_breeder_seed')?.setValue(0);
        }

        // 3️⃣ Recalculate total after reset
        totalCertifiedSeedQty = bspcArray.controls.reduce((sum, ctrl: AbstractControl) => {
          return sum + (Number(ctrl.get('Req_Qty_of_breeder_seed')?.value) || 0);
        }, 0);

        // 4️⃣ Update remaining seeds
        const remaining = totalRequiredSeed - totalCertifiedSeedQty;
        this.crop_wise_json[0].rem_req_seeds = remaining < 0 ? 0 : remaining;
        this.crop_wise_json = [...this.crop_wise_json]; // trigger UI update
      });

      return; // stop further execution until user clicks OK
    }

    // 5️⃣ Update remaining seeds normally
    const remaining = totalRequiredSeed - totalCertifiedSeedQty;
    this.crop_wise_json[0].rem_req_seeds = remaining < 0 ? 0 : remaining;
    this.crop_wise_json = [...this.crop_wise_json]; // trigger change detection
  }

  updateRemainingSeeds() {
    // 1️⃣ Ensure API data is available
    if (!this.crop_wise_json || this.crop_wise_json.length === 0) {
      console.warn('⚠️ No crop data available (crop_wise_json is empty)');
      return;
    }

    // 2️⃣ Safely get total required seeds from API
    const apiCrop = this.crop_wise_json[0];
    const totalRequiredSeed =
      Number(apiCrop.total_required_seed) ||
      Number(apiCrop.required_qty_of_certified_seeds) ||
      0;

    // 3️⃣ Compute remaining requirement
    const remaining = Math.max(totalRequiredSeed - (this.totalSeedRequired || 0), 0);

    // 4️⃣ Update remaining field
    apiCrop.rem_req_seeds = remaining;

    // 5️⃣ Reflect changes in UI (Angular change detection)
    this.crop_wise_json = [...this.crop_wise_json];
    // this.cdRef.detectChanges();

    console.log('Updated Remaining Seeds:', remaining);
    console.log('Total Required Seed (API):', totalRequiredSeed);
    console.log('Total Used (Calculated):', this.totalSeedRequired);

    // 6️⃣ Optional: hide rows when no remaining seeds
    if (remaining === 0 && typeof this.hideUnfilledRows === 'function') {
      // this.hideUnfilledRows();
    }
  }
  onToggleActive(index: number) {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const row = bspcArray.at(index) as FormGroup;

    // Get the current row data
    const value = row.value;

    // Build payload for API — only this row
    const foundation_seed = (value.Req_Qty_of_breeder_seed || 0) / this.smr1;
    const breeder_seed = foundation_seed / this.smr2;

    const payload = {
      variety_wise_array: [
        {
          id: value.id || null,
          crop_code: this.cropCodePush,
          variety_code: value.variety_code,
          variety_name: value.variety_name || value.variety?.variety_name || '',
          required_qty_of_certified_seeds: value.Req_Qty_of_breeder_seed || 0,
          foundation_seed: parseFloat(foundation_seed.toFixed(2)),
          breeder_seed: parseFloat(breeder_seed.toFixed(2)),
          notification_year: value.notification_year || null,
          is_active: value.is_active, // toggle value
          is_draft: value.is_draft || 0,
          is_final_submit: value.is_final_submit || 0,
          srp_crop_wise_id: this.srp_crop_wise_id || null,
        },
      ],
    };

    // Call API
    this.srpService.postRequestCreator('create-variety', '', payload).subscribe({
      next: (res: any) => {
        if (res?.EncryptedResponse?.status_code === 200) {
          // Toggle success — now handle row enable/disable
          if (value.is_active) {
            // Enable row
            Object.keys(row.controls).forEach((key) => {
              row.get(key)?.enable({ emitEvent: false });
            });
          } else {
            // Disable row except toggle itself
            Object.keys(row.controls).forEach((key) => {
              if (key !== 'is_active') {
                row.get(key)?.disable({ emitEvent: false });
              }
            });
          }
        } else {
          Swal.fire('Warning', 'No valid response from server.', 'warning');
        }
      },
      error: () => {
        Swal.fire('Error', 'Server error occurred while updating toggle.', 'error');
      },
    });
  }

checkPositiveValue(index: number) {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const control = bspcArray.at(index).get('required_qty_of_certified_seeds');
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
    if (!bspcArray) return;
 
    const allRows = bspcArray.controls;
 
    // If empty search → show all rows
    if (!searchText || !searchText.toString().trim()) {
      this.filteredBspc = allRows;
      return;
    }
 
    const lower = searchText.toString().trim().toLowerCase();
 
    this.filteredBspc = allRows.filter(ctrl => {
      const variety = (ctrl.get('variety_name')?.value || '')
        .toString()
        .toLowerCase();
 
      const notificationYear = (ctrl.get('notification_year')?.value || '')
        .toString()
        .toLowerCase();
 
      // 🟢 Match EITHER field
      return (
        variety.includes(lower) ||
        notificationYear.includes(lower)
      );
    });
  }
 
 
  preventNegative(i: number) {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const control = bspcArray.at(i).get('required_qty_of_certified_seeds');
 
    if (control && control.value < 0) {
      control.setValue(0); // Reset to zero instead of showing popup
    }
  }
 
  hideUnfilledRows() {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const filledRows = bspcArray.controls.filter((ctrl: AbstractControl) => {
      const value = Number(ctrl.get('required_qty_of_certified_seeds')?.value);
      return value && value > 0; // ✅ Keep only filled rows
    });
 
    // Replace the FormArray with only filled rows
    bspcArray.clear();
    filledRows.forEach(row => bspcArray.push(row));
 
    // Also update filtered list
    this.filteredBspc = filledRows;
  }
 
  getFilteredRows(): AbstractControl[] {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
 
    // 🚫 When remaining required seeds = 0 → hide empty rows
    if (this.crop_wise_json[0]?.rem_req_seeds === 0) {
      return bspcArray.controls.filter(ctrl => {
        const value = Number(ctrl.get('required_qty_of_certified_seeds')?.value);
        return value && value > 0; // ✅ keep only filled rows
      });
    }
 
    // ✅ Otherwise show filtered rows
    return this.filteredBspc || bspcArray.controls;
  }
 
 goBack() {
  this.router.navigate(
    ['/seed-rolling-planing-crop-wise?year= season'],
    
  );
}
 
 
shouldShowRow(row: AbstractControl): boolean {
    const isFinal = row.get('is_final_submit')?.value;
    const isActive = row.get('is_active')?.value;
 
    // 🔥 After final submit → show only active rows
    if (isFinal == 1) {
      return isActive === true;
    }
 
    // Before final submit → show all rows
    return true;
  }
 saveVariety(type: string) {
    const apiUrl = 'create-variety';
    const bspcArray = this.ngForm.get('bspc') as FormArray;
 
    if (!bspcArray || bspcArray.length === 0) {
      Swal.fire({
        title: '<p style="font-size:20px;">No data available to save.</p>',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#B64B1D',
      });
      return;
    }
 
    // ⭐ VALIDATION: at least one row has Req_Qty_of_breeder_seed > 0
    const hasValidQty = bspcArray.controls.some((ctrl: FormGroup) => {
      const qty = ctrl.get('Req_Qty_of_breeder_seed')?.value || 0;
      return qty > 0;
    });
 
    if (!hasValidQty) {
      Swal.fire({
        title: '<p style="font-size:20px;">No valid data to save.</p>',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#B64B1D',
      });
      return;
    }
 
    // Step 1: Build payload
    const variety_wise_array = bspcArray.controls.map((ctrl: AbstractControl) => {
      const value = ctrl.value;
      const foundation_seed = (value.Req_Qty_of_breeder_seed || 0) / this.smr1;
      const breeder_seed = foundation_seed / this.smr2;
 
      return {
        crop_code: this.cropCodePush,
        variety_code: value.variety_code,
        variety_name: value.variety_name || value.variety?.variety_name || '',
        required_qty_of_certified_seeds: value.Req_Qty_of_breeder_seed || 0,
        foundation_seed: parseFloat(foundation_seed.toFixed(2)),
        breeder_seed: parseFloat(breeder_seed.toFixed(2)),
        notification_year: value.notification_year || null,
        is_active: value.is_active,
        is_draft: type === 'is_draft' ? 1 : 0,
        is_final_submit: type === 'is_final' ? 1 : 0,
        srp_crop_wise_id: this.srp_crop_wise_id || null,
        id: value?.id || null,
      };
    });
 
    const payload = { variety_wise_array };
 
    // Step 2: Confirmation popup
    Swal.fire({
      title: type === 'is_draft' ? 'Save as Draft?' : 'Submit Data?',
      text:
        type === 'is_draft'
          ? 'Do you want to save this record as draft?'
          : 'Are you sure you want to submit this data?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: type === 'is_draft' ? 'Yes, Save Draft' : 'Yes, Submit',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;
 
      this.srpService.postRequestCreator(apiUrl, '', payload).subscribe({
        next: (res: any) => {
          if (res?.EncryptedResponse?.status_code === 200) {
            Swal.fire(
              'Success!',
              type === 'is_draft'
                ? 'Data saved as draft successfully!'
                : 'Data submitted successfully!',
              'success'
            );
 
            // ==========================================
            //                DRAFT HANDLING
            // ==========================================
            if (type === 'is_draft') {
              bspcArray.controls.forEach((ctrl: FormGroup) => {
                const id = ctrl.get('id')?.value;
                const isActive = ctrl.get('is_active')?.value;
 
                ctrl.get('is_draft')?.setValue(1, { emitEvent: false });
 
                if (!id) {
                  ctrl.enable({ emitEvent: false });
                  ctrl.get('is_active')?.setValue(true, { emitEvent: false });
                  ctrl.get('is_active')?.enable({ emitEvent: false });
                  ctrl.get('toggle_locked')?.setValue(false, { emitEvent: false });
                  return;
                }
 
                if (isActive === true) {
                  ctrl.enable({ emitEvent: false });
                  ctrl.get('is_active')?.enable({ emitEvent: false });
                  ctrl.get('toggle_locked')?.setValue(false, { emitEvent: false });
                } else {
                  ctrl.disable({ emitEvent: false });
                  ctrl.get('is_active')?.setValue(false, { emitEvent: false });
                  ctrl.get('toggle_locked')?.setValue(true, { emitEvent: false });
 
                  // keep toggle visible
                  ctrl.get('is_active')?.enable({ emitEvent: false });
                }
              });
            }
 
            // ==========================================
            //            FINAL SUBMIT BLOCK
            // ==========================================
            if (type === 'is_final') {
              const activeRows = variety_wise_array.filter(row => row.is_active === true);
 
              const gridHtml = `
                    <div style="max-height: 300px; overflow-y:auto; border:1px solid #ccc;">
                      <table style="width:100%; border-collapse: collapse; font-size:14px;">
                        <thead style="background:#f5f5f5;">
                          <tr>
                            <th>S.No.</th>
                            <th>Variety Name</th>
                            <th>Required Qty Of Certified Seeds</th>
                            <th>Foundation Seed</th>
                            <th>Breeder Seed</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${activeRows
                  .map(
                    (v, i) => `
                                <tr>
                                  <td>${i + 1}</td>
                                  <td>${v.variety_name}</td>
                                  <td>${v.required_qty_of_certified_seeds}</td>
                                  <td>${v.foundation_seed}</td>
                                  <td>${v.breeder_seed}</td>
                                </tr>`
                  )
                  .join('')}
                        </tbody>
                      </table>
                    </div>
                  `;
 
              Swal.fire({
                title: "Confirm Final Submission",
                html: `
                      <p>Are you sure you want to submit this data?</p>
                      <strong>Review the data below:</strong><br><br>
                      ${gridHtml}
                    `,
                width: "900px",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, Submit",
                cancelButtonText: "Cancel",
              }).then((finalConfirm) => {
                if (!finalConfirm.isConfirmed) return;
 
                this.srpService.postRequestCreator(apiUrl, '', payload).subscribe({
                  next: (res: any) => {
                    if (res?.EncryptedResponse?.status_code === 200) {
                      Swal.fire("Success!", "Data submitted successfully!", "success");
                      this.getVarietyDetails(this.srp_crop_wise_id, this.cropCodePush);
                    } else {
                      Swal.fire('Warning', 'No valid response from server.', 'warning');
                    }
                  },
                  error: () => {
                    Swal.fire('Error', 'Server error occurred while saving.', 'error');
                  },
                });
              });
 
              return;
            }
 
            // Refresh grid
            this.getVarietyDetails(this.srp_crop_wise_id, this.cropCodePush);
          } else {
            Swal.fire('Warning', 'No valid response from server.', 'warning');
          }
        },
        error: () => {
          Swal.fire('Error', 'Server error occurred while saving.', 'error');
        },
      });
    });
  }
}