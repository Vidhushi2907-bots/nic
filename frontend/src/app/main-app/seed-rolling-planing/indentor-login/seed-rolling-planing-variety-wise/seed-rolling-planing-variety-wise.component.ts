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
  // filteredBspc: AbstractControl[] = [];
  filteredBspc: any[] = [];
  isSubmitted = false;
  srp_crop_wise_id: any;
  smr1 = 5;
  smr2 = 10;
 
  editModalVisible = false;   // modal show/hide
  editRowIndex: number | null = null;  // which row is being edited
  editRowForm!: FormGroup;    // separate form for modal
  disabledForm: boolean;
 
  // crop_wise_json: any[] = [];
  crop_wise_json: any = null;
  isLoading = true;
  isSubmitting = false;
  disableField = false;
  isFinalSubmitButtonHide: boolean;
  isDraftMode = false;
 
 
 
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
 
    this.route.queryParamMap.subscribe(params => {
      this.srp_crop_wise_id = params.get('id');
      const crop_code = params.get('crop_code');
 
      console.log("Query Params:", this.srp_crop_wise_id, crop_code);
 
      if (this.srp_crop_wise_id) {
        this.getCropDetailsById(Number(this.srp_crop_wise_id));
 
        this.getVarietyDetails(this.srp_crop_wise_id, 'draft');
      }
      // Wait for API response → then auto reload if needed
      setTimeout(() => {
        if (this.isFinalSubmitButtonHide) {
          this.getVarietyDetails(this.srp_crop_wise_id, 'submit');
        }
      }, 100);
    });
 
    // ----------- Form Setup ------------
    this.ngForm = this.fb.group({
      srp_crop_wise_id: [''],          // static or dynamic
      action: [''],
      bspc: this.fb.array([]),
      global_search: ['']
    });
 
    this.initializeFormArray();
    // Global search filter listener
    this.ngForm.get('global_search')?.valueChanges.subscribe(searchText => {
      this.applyFilter(searchText);
    });
 
  }
 
  // GETTER
  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }
 
  initializeFormArray() {
    this.filteredBspc.forEach(item => {
      this.bspc.push(this.fb.group({
        variety_code: [item.variety_code],
        required_qty_of_certified_seeds: [0],
        foundation_seed: [0],
        breeder_seed: [0],
        is_active: [true]
      }));
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
 
 
 
 
 
  //new code acc. to vidushi api
  getCropDetailsById(id: number) {
    this.isLoading = true;
 
    const route = `get-crop-details?id=${id}`;
 
    this.srpService.getRequestCreatorNew(route).subscribe({
      next: (res: any) => {
 
        const item = res?.EncryptedResponse?.data;
 
        if (!item) {
          this.crop_wise_json = null;
          return;
        }
 
        // 🟢 Pick first valid field
        const totalRequired =
          Number(item.total_required) > 0
            ? Number(item.total_required)
            : Number(item.total_required_seed) > 0
              ? Number(item.total_required_seed)
              : Number(item.required_qty_of_certified_seeds) > 0
                ? Number(item.required_qty_of_certified_seeds)
                : 0;
 
        // 🟢 Assign object (NOT array)
        this.crop_wise_json = {
          crop_name: item['m_crop.crop_name'] || item.crop_name || '',
          total_area: Number(item.total_area) || 0,
          total_required: totalRequired,
          rem_req_seeds: totalRequired
        };
 
        this.calculateTotalSeedRequired();
 
        // 🔥 Ensure Old Entered Grid Values Recalculate Remaining Seeds
        setTimeout(() => {
          this.calculateTotalSeedRequired();
        }, 50);
 
        console.log('Final crop_wise_json:', this.crop_wise_json);
        this.isLoading = false;
      },
 
      error: (err) => {
        console.error('API error:', err);
        this.crop_wise_json = null;
        this.isLoading = false;
      }
    });
  }
 
 
 
  // getVarietyDetails(id, crop_code?: string) {
  //   let apiRoute = 'get-variety-details-data';
 
  //   this.srpService
  //     .getRequestCreatorNew(
  //       `${apiRoute}?srp_crop_wise_id=${id}&crop_code=${crop_code}`
  //     )
  //     .subscribe({
  //       next: (res: any) => {
  //         let dataArr = res?.EncryptedResponse?.data || [];
  //         const bspcArray = this.ngForm.get('bspc') as FormArray;
  //         bspcArray.clear();
 
  //         this.disabledForm = false; // Reset
 
  //         if (dataArr.length === 0) {
  //           this.filteredBspc = [];
  //           return;
  //         }
 
  //         // Check if any row has final submit
  //         const isFinal = dataArr.some((x) => x.is_final_submit == 1);
  //         if (isFinal) {
  //           this.disabledForm = true;
  //           // Only keep active rows
  //           dataArr = dataArr.filter((x) => x.is_active === true);
  //           if (dataArr.length === 0) {
  //             this.filteredBspc = [];
  //             return;
  //           }
  //         }
 
  //         // Build form rows
  //         dataArr.forEach((item: any) => {
  //           const group = this.fb.group({
  //             id: [item.id || null],
  //             crop_code: [item.crop_code || null],
  //             variety_code: [item?.variety_code || null],
  //             variety_name: [item?.variety_name || ''],
  //             notification_year: [item?.notification_year || ''],
 
  //             Req_Qty_of_breeder_seed: [
  //               item.required_qty_of_certified_seeds ?? 0,
  //               [Validators.required, Validators.min(0)],
  //             ],
 
  //             foundation_seed: [0],
  //             breeder_seed: [0],
 
  //             is_active: [!!item?.is_active],
 
  //             showActions: [false],
  //             srp_crop_wise_id: [item?.srp_crop_wise_id || null],
  //             is_final_submit: [item?.is_final_submit == 1 ? true : false],
  //             isRowLocked: [false]
  //           });
 
  //           // Auto calculation
  //           const qty = group.get('Req_Qty_of_breeder_seed')?.value || 0;
  //           if (qty) {
  //             const foundation = qty / this.smr1;
  //             const breeder = foundation / this.smr2;
 
  //             group.get('foundation_seed')?.setValue(
  //               parseFloat(foundation.toFixed(2)),
  //               { emitEvent: false }
  //             );
  //             group.get('breeder_seed')?.setValue(
  //               parseFloat(breeder.toFixed(2)),
  //               { emitEvent: false }
  //             );
  //           }
 
  //           group
  //             .get('Req_Qty_of_breeder_seed')
  //             ?.valueChanges.subscribe((qty: number) => {
  //               const foundation = qty / this.smr1;
  //               const breeder = foundation / this.smr2;
 
  //               group.get('foundation_seed')?.setValue(
  //                 parseFloat(foundation.toFixed(2)),
  //                 { emitEvent: false }
  //               );
  //               group.get('breeder_seed')?.setValue(
  //                 parseFloat(breeder.toFixed(2)),
  //                 { emitEvent: false }
  //               );
  //             });
 
  //           bspcArray.push(group);
  //         });
 
  //         // ⭐ Apply row disable logic based on is_active AND final submit
  //         // ⭐ Apply row logic after all records are added
  //         bspcArray.controls.forEach((ctrl: FormGroup) => {
  //           const isActive = ctrl.get('is_active')?.value;
  //           const isFinal = ctrl.get('is_final_submit')?.value;
 
  //           if (isFinal) {
  //             ctrl.disable({ emitEvent: false });
  //             ctrl.get('is_active')?.enable({ emitEvent: false });
  //             return;
  //           }
 
  //           if (isActive === null || isActive === false) {
  //             ctrl.get('is_active')?.setValue(true, { emitEvent: false });
  //           }
 
  //           if (ctrl.get('is_active')?.value) {
  //             ctrl.enable({ emitEvent: false });
  //           } else {
  //             ctrl.get('Req_Qty_of_breeder_seed')?.disable({ emitEvent: false });
  //             ctrl.get('is_active')?.enable({ emitEvent: false });
  //           }
  //         });
 
  //         this.filteredBspc = bspcArray.controls;
  //       },
 
  //       error: (err) => console.error('Error fetching variety details:', err),
  //     });
  // }
 
 
 
 
 
  // createBspcRow(data: any = null, isDraft: boolean = false): FormGroup {
  //   return this.fb.group({
  //     id: [data?.id || null],
  //     variety_name: [data?.variety_name || ''],
  //     notification_year: [data?.notification_year || ''],
 
  //     Req_Qty_of_breeder_seed: [
  //       {
  //         value: data?.required_qty_of_certified_seeds || null,
  //         disabled: isDraft ? data?.is_active === false : false  // 👈 Important
  //       }
  //     ],
 
  //     foundation_seed: [data?.foundation_seed || null],
  //     breeder_seed: [data?.breeder_seed || null],
 
  //     is_active: [data?.is_active ?? true],
  //     is_draft: [data?.is_draft ?? 0],
  //     is_final_submit: [data?.is_final_submit ?? 0]
  //   });
  // }
 
 
  //vidushi code
  // getVarietyDetails(id,type) {
  //   let apiRoute = 'get-srp-variety-details';
  //   id = Number(id)
  //   this.srpService
  //     .getRequestCreatorNew(
  //       `${apiRoute}?srp_crop_wise_id=${Number(id)}&type=${type}`
  //     )
  //     .subscribe({
  //       next: (res: any) => {
  //         // let dataArr = res?.EncryptedResponse?.data || [];
  //         let raw = res?.EncryptedResponse?.data || [];
 
  //         let dataArr = raw.map(v => {
  //           const saved = v.seed_rolling_plan_variety_wises?.length
  //             ? v.seed_rolling_plan_variety_wises[0]
  //             : {};
 
  //           return {
  //             id: saved.id || null,
  //             crop_code: v.crop_code,
  //             variety_code: v.variety_code,
  //             variety_name: v.variety_name,
  //             notification_year: v.notification_year,
  //             required_qty_of_certified_seeds: saved.required_qty_of_certified_seeds || 0,
  //             foundation_seed: saved.foundation_seed || 0,
  //             breeder_seed: saved.breeder_seed || 0,
  //             is_active: saved.is_active ?? true,
  //             is_final_submit: saved.is_final_submit || false,
  //             srp_crop_wise_id: saved.srp_crop_wise_id || null
  //           };
  //         });
 
 
  //         const bspcArray = this.ngForm.get('bspc') as FormArray;
  //         bspcArray.clear();
 
  //         this.disabledForm = false; // Reset
 
  //         if (dataArr.length === 0) {
  //           this.filteredBspc = [];
  //           return;
  //         }
 
  //         // Check if any row has final submit
  //         const isFinal = dataArr.some((x) => x.is_final_submit == 1);
  //         if (isFinal) {
  //           this.disabledForm = true;
  //           // Only keep active rows
  //           dataArr = dataArr.filter((x) => x.is_active === true);
  //           if (dataArr.length === 0) {
  //             this.filteredBspc = [];
  //             return;
  //           }
  //         }
 
  //         // Build form rows
  //         dataArr.forEach((item: any) => {
  //           const group = this.fb.group({
  //             id: [item.id || null],
  //             crop_code: [item.crop_code || null],
  //             variety_code: [item?.variety_code || null],
  //             variety_name: [item?.variety_name || ''],
  //             notification_year: [item?.notification_year || '-'],
 
  //             Req_Qty_of_breeder_seed: [
  //               item.required_qty_of_certified_seeds ?? 0,
  //               [Validators.required, Validators.min(0)],
  //             ],
 
  //             foundation_seed: [0],
  //             breeder_seed: [0],
 
  //             is_active: [!!item?.is_active],
 
  //             showActions: [false],
  //             srp_crop_wise_id: [item?.srp_crop_wise_id || null],
  //             is_final_submit: [item?.is_final_submit == 1 ? true : false],
  //             isRowLocked: [false]
  //           });
 
  //           // Auto calculation
  //           const qty = group.get('Req_Qty_of_breeder_seed')?.value || 0;
  //           if (qty) {
  //             const foundation = qty / this.smr1;
  //             const breeder = foundation / this.smr2;
 
  //             group.get('foundation_seed')?.setValue(
  //               parseFloat(foundation.toFixed(2)),
  //               { emitEvent: false }
  //             );
  //             group.get('breeder_seed')?.setValue(
  //               parseFloat(breeder.toFixed(2)),
  //               { emitEvent: false }
  //             );
  //           }
 
  //           group
  //             .get('Req_Qty_of_breeder_seed')
  //             ?.valueChanges.subscribe((qty: number) => {
  //               const foundation = qty / this.smr1;
  //               const breeder = foundation / this.smr2;
 
  //               group.get('foundation_seed')?.setValue(
  //                 parseFloat(foundation.toFixed(2)),
  //                 { emitEvent: false }
  //               );
  //               group.get('breeder_seed')?.setValue(
  //                 parseFloat(breeder.toFixed(2)),
  //                 { emitEvent: false }
  //               );
  //             });
 
  //           bspcArray.push(group);
  //         });
 
  //         // ⭐ Apply row disable logic based on is_active AND final submit
  //         // ⭐ Apply row logic after all records are added
  //         bspcArray.controls.forEach((ctrl: FormGroup) => {
  //           const isActive = ctrl.get('is_active')?.value;
  //           const isFinal = ctrl.get('is_final_submit')?.value;
 
  //           if (isFinal) {
  //             ctrl.disable({ emitEvent: false });
  //             ctrl.get('is_active')?.enable({ emitEvent: false });
  //             return;
  //           }
 
  //           if (isActive === null || isActive === false) {
  //             ctrl.get('is_active')?.setValue(true, { emitEvent: false });
  //           }
 
  //           if (ctrl.get('is_active')?.value) {
  //             ctrl.enable({ emitEvent: false });
  //           } else {
  //             ctrl.get('Req_Qty_of_breeder_seed')?.disable({ emitEvent: false });
  //             ctrl.get('is_active')?.enable({ emitEvent: false });
  //           }
  //         });
 
  //         this.filteredBspc = bspcArray.controls;
  //       },
 
  //       error: (err) => console.error('Error fetching variety details:', err),
  //     });
  // }
 
  getVarietyDetails(id, type) {
    let apiRoute = 'get-srp-variety-details';
    id = Number(id);
 
    this.srpService
      .getRequestCreatorNew(
        `${apiRoute}?srp_crop_wise_id=${id}&type=${type}`
      )
      .subscribe({
        next: (res: any) => {
          let raw = res?.EncryptedResponse?.data || [];
 
          let dataArr = raw.map(v => {
            const saved = v.seed_rolling_plan_variety_wises?.[0] || {};
 
            return {
              id: saved.id || null,
              crop_code: v.crop_code,
              variety_code: v.variety_code,
              variety_name: v.variety_name,
              notification_year: [v.notification_year ?? '-'],
              required_qty_of_certified_seeds:
                saved.required_qty_of_certified_seeds ?? 0,
 
              foundation_seed: saved.foundation_seed || 0,
              breeder_seed: saved.breeder_seed || 0,
 
              is_active: saved.is_active ?? true,
              is_final_submit: saved.is_final_submit === true,
              srp_crop_wise_id: saved.srp_crop_wise_id || null,
              is_draft: saved?.is_draft ?? null
            };
          });
 
          const bspcArray = this.ngForm.get('bspc') as FormArray;
          bspcArray.clear();
 
          if (!dataArr.length) {
            this.filteredBspc = [];
            return;
          }
 
          // ⭐ CHECK FINAL SUBMIT FROM API
          const isFinal = dataArr.some(x => x.is_final_submit === true);
 
          // ⭐ SET BUTTON HIDE FROM API
          this.isFinalSubmitButtonHide = isFinal;
 
 
          if (isFinal) {
            // API rule → show only active rows
            dataArr = dataArr.filter(x => x.is_active === true);
          }
 
          dataArr.forEach(item => {
            const group = this.fb.group({
              id: [item.id],
              crop_code: [item.crop_code],
              variety_code: [item.variety_code],
              variety_name: [item.variety_name],
              notification_year: [item.notification_year],
 
              Req_Qty_of_breeder_seed: [
                item.required_qty_of_certified_seeds,
              ],
 
              foundation_seed: [0],
              breeder_seed: [0],
 
              is_active: [item.is_active],
              srp_crop_wise_id: [item.srp_crop_wise_id],
              is_final_submit: [item.is_final_submit],
              is_draft: [item.is_draft]
            });
 
            // Auto calc
            const qty = group.get('Req_Qty_of_breeder_seed')?.value || 0;
            if (qty) {
              const foundation = qty / this.smr1;
              const breeder = foundation / this.smr2;
 
              group.get('foundation_seed')?.setValue(+foundation.toFixed(2), { emitEvent: false });
              group.get('breeder_seed')?.setValue(+breeder.toFixed(2), { emitEvent: false });
            }
 
            group.get('Req_Qty_of_breeder_seed')?.valueChanges.subscribe(qty => {
              qty = Number(qty || 0);
              const f = qty / this.smr1;
              const b = f / this.smr2;
              group.get('foundation_seed')?.setValue(+f.toFixed(2), { emitEvent: false });
              group.get('breeder_seed')?.setValue(+b.toFixed(2), { emitEvent: false });
            });
 
            // ⭐ FULL LOCK WHEN FINAL SUBMITTED
            if (isFinal) {
              group.disable({ emitEvent: false });   // disable entire row
              group.get('is_active')?.disable({ emitEvent: false });  // disable toggle also
            }
 
            bspcArray.push(group);
          });
 
          this.filteredBspc = bspcArray.controls;
        },
 
        error: err => console.error('Error fetching variety details:', err),
      });
  }
 
 
 
  saveVariety(type: 'draft' | 'final') {
  const apiUrl = 'add-srp-variety';
  const bspcArray = this.ngForm.get('bspc') as FormArray;
 
  if (!bspcArray || bspcArray.length === 0) {
    Swal.fire('No Data', 'Please fill at least one row.', 'warning');
    return;
  }
 
  const formValues = bspcArray.value;
 
  const variety_wise = formValues
    .filter((row: any) => row.variety_code && row.Req_Qty_of_breeder_seed > 0)
    .map((row: any) => {
      const foundation_seed = (row.Req_Qty_of_breeder_seed || 0) / this.smr1;
      const breeder_seed = foundation_seed / this.smr2;
 
      return {
        id: row.id,
        variety_code: row.variety_code,
        required_qty_of_certified_seeds: row.Req_Qty_of_breeder_seed,
        foundation_seed: parseFloat(foundation_seed.toFixed(2)),
        breeder_seed: parseFloat(breeder_seed.toFixed(2)),
        is_active: row.is_active,
        is_draft: type === 'draft'
      };
    });
 
  if (!variety_wise.length) {
    Swal.fire('Warning', 'No valid rows found.', 'warning');
    return;
  }
 
  const payload = {
    srp_crop_wise_id: this.srp_crop_wise_id,
    action: type,
    variety_wise
  };
 
  // ===========================
  // DRAFT FLOW — No Summary
  // ===========================
  if (type === 'draft') {
    Swal.fire({
      title: 'Save as Draft?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (!result.isConfirmed) return;
 
      this.srpService.postRequestCreator(apiUrl, null, payload).subscribe({
        next: () => {
          Swal.fire('Saved as Draft!', '', 'success').then(() => {
            this.isFinalSubmit = false;
            this.getVarietyDetails(this.srp_crop_wise_id, 'draft');
          });
        },
        error: () => Swal.fire('Server Error', '', 'error')
      });
    });
 
    return; // draft ends here
  }
 
  // ===========================
  // FINAL SUBMIT — SHOW SUMMARY TABLE
  // ===========================
 
  const summaryHtml = `
      <div style="max-height:300px;overflow-y:auto;border:1px solid #ccc;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead style="background:#f1f1f1;">
            <tr>
              <th>#</th>
              <th>Variety</th>
              <th>Required Qty (CS)</th>
              <th>Foundation Seed</th>
              <th>Breeder Seed</th>
            </tr>
          </thead>
          <tbody>
            ${variety_wise
              .map(
                (v, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${v.variety_code}</td>
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
    title: 'Confirm Final Submission',
    html: `
        <p>Are you sure you want to submit this data?</p>
        <strong>Review the summary below:</strong><br><br>
        ${summaryHtml}
      `,
    width: '900px',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Submit',
    cancelButtonText: 'Cancel'
  }).then((finalConfirm) => {
    if (!finalConfirm.isConfirmed) return;
 
    // FINAL API CALL
    this.srpService.postRequestCreator(apiUrl, null, payload).subscribe({
      next: () => {
        Swal.fire('Data Submitted Successfully!', '', 'success').then(() => {
          this.isFinalSubmitButtonHide = true;
          this.getVarietyDetails(this.srp_crop_wise_id, 'submit');
        });
      },
      error: () => Swal.fire('Server Error', '', 'error')
    });
  });
}
 
 
 
  //   handleSeedInput(index: number) {
  //   this.calculateTotalSeedRequired();
 
  //   // If no crop data yet, stop
  //   if (!this.crop_wise_json) return;
 
  //   const remaining = this.crop_wise_json.rem_req_seeds;
 
  //   // If grid total seeds equals to crop_wise_json total required — warning
  //   if (this.crop_wise_json.total_required ===) {
  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'Limit Reached',
  //       text: `you cannot enter more! Required Qty can't greater than Total Seeds `,
  //       confirmButtonText: 'OK'
  //     });
 
  //     // 🔥 Prevent additional value entry
  //     const bspcArray = this.ngForm.get('bspc') as FormArray;
  //     const control = bspcArray.at(index);
 
  //     // Reset field to prevent exceeding
  //     const enteredValue = Number(control.get('Req_Qty_of_breeder_seed')?.value || 0);
  //     const adjustedValue = enteredValue > 0 ? enteredValue  : 0;
 
  //     control.get('Req_Qty_of_breeder_seed')?.setValue(adjustedValue);
 
  //     // Recalculate again after adjustment
  //     setTimeout(() => {
  //       this.calculateTotalSeedRequired();
  //     }, 50);
  //   }
  // }
  handleSeedInput(index: number) {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const control = bspcArray.at(index);
 
    // Calculate grid total WITHOUT this row included
    const { gridTotal } = this.calculateTotalSeedRequired();
 
    const totalRequired = Number(this.crop_wise_json.total_required) || 0;
    const currentValue = Number(control.get('Req_Qty_of_breeder_seed')?.value) || 0;
 
    // What grid total will become after this input
    const gridTotalAfterInput = gridTotal;  // gridTotal already includes current row's value because calc() reads all rows
 
    // FIX → Check EXCEED condition correctly
    if (gridTotalAfterInput > totalRequired) {
 
      Swal.fire({
        icon: 'warning',
        title: 'Limit Exceeded',
        text: `You cannot enter more! Required Qty can't be greater than Total Seeds.`,
        confirmButtonText: 'OK'
      });
 
      // Reset only this field
      control.get('Req_Qty_of_breeder_seed')?.setValue(0, { emitEvent: false });
      control.get('foundation_seed')?.setValue(0, { emitEvent: false });
      control.get('breeder_seed')?.setValue(0, { emitEvent: false });
 
      // Recalculate after correction
      this.calculateTotalSeedRequired();
 
      return;
    }
 
    // Normal flow → live update always
    this.calculateTotalSeedRequired();
  }
 
  onQtyInput(index: number) {
    const row = this.bspc.at(index);
 
    const reqQty = +row.get('required_qty_of_certified_seeds')?.value;
 
    if (reqQty >= 0) {
      const foundation = reqQty / this.smr1;
      const breeder = foundation / this.smr2;
 
      row.patchValue({
        foundation_seed: foundation,
        breeder_seed: breeder
      });
    }
  }
 
  saveDraft() {
    this.prepareAndSubmit('draft');
  }
 
  // ----------------------------------------------
  // FINAL SUBMIT
  // ----------------------------------------------
  finalSubmit() {
    this.prepareAndSubmit('final');
  }
 
  // ----------------------------------------------
  // BUILD PAYLOAD + API CALL
  // ----------------------------------------------
  prepareAndSubmit(actionType: string) {
    const apiUrl = 'add-srp-variety';
 
    const payload = {
      srp_crop_wise_id: this.ngForm.get('srp_crop_wise_id')?.value,
      action: actionType,
      variety_wise: this.bspc.value
    };
 
    console.log("API Payload:", payload);
 
    this.srpService.postRequestCreator(apiUrl, '', payload).subscribe({
      next: res => {
        alert(`Data ${actionType} saved successfully!`);
        console.log(res);
      },
      error: err => {
        alert("Submission failed!");
        console.error(err);
      }
    });
  }
 
  goBack() {
    this.router.navigate(['/seed-rolling-planing-crop-wise']);
  }
 
  calculateTotalSeedRequired() {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    if (!bspcArray || !this.crop_wise_json) return { gridTotal: 0, remaining: 0 };
 
    let gridTotal = 0;
 
    bspcArray.controls.forEach((ctrl: AbstractControl) => {
      const isActive = ctrl.get('is_active')?.value;
      const qty = Number(ctrl.get('Req_Qty_of_breeder_seed')?.value) || 0;
 
      if (isActive && qty > 0) {
        gridTotal += qty;
      }
    });
 
    const totalRequired = Number(this.crop_wise_json.total_required) || 0;
 
    const remaining = Math.max(totalRequired - gridTotal, 0);
 
    this.crop_wise_json = {
      ...this.crop_wise_json,
      rem_req_seeds: remaining
    };
 
    return { gridTotal, remaining };
  }
 
 
 
onToggleChange(index: number) {
  const row = this.ngForm.get('bspc')?.get(`${index}`) as FormGroup;
  if (!row) return;
 
  const currentValue = row.get('is_active')?.value;   // true/false
  const remSeeds = this.crop_wise_json?.rem_req_seeds || 0;
 
  // -----------------------------------------
  // ⭐ CASE: User trying to turn ON the toggle
  //         but remaining seeds = 0
  // -----------------------------------------
  if (currentValue === true && remSeeds === 0) {
    Swal.fire(
      'No Seeds Remaining',
      'You cannot activate this variety because remaining required seeds are 0.',
      'warning'
    );
 
    // revert toggle back to OFF
    row.get('is_active')?.setValue(false, { emitEvent: false });
 
    return; // stop further actions
  }
 
  // -----------------------------------------
  // ⭐ Normal case → continue calculations
  // -----------------------------------------
  this.calculateTotalSeedRequired();
}
 
 
  // onToggleChange(index: number) {
  //   const row = this.ngForm.get('bspc')?.get(`${index}`) as FormGroup;
  //   const isActive = row.get('is_active')?.value;
 
  //   if (!isActive) {
  //     row.get('Req_Qty_of_breeder_seed')?.disable({ emitEvent: false });
  //     row.addControl('isRowLocked', this.fb.control(true));
  //   } else {
  //     row.get('Req_Qty_of_breeder_seed')?.enable({ emitEvent: false });
  //     row.addControl('isRowLocked', this.fb.control(false));
  //   }
  // }
 
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
 
}