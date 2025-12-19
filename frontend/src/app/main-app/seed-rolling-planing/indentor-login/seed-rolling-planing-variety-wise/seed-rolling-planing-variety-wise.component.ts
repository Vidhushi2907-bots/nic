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
import { formatDate } from '@angular/common';

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
  showToggle = false; // toggles appear only after draft saved
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

  editModalVisible = false; // modal show/hide
  editRowIndex: number | null = null; // which row is being edited
  editRowForm!: FormGroup; // separate form for modal
  disabledForm: boolean;

  // crop_wise_json: any[] = [];
  crop_wise_json: any = null;
  isLoading = true;
  isSubmitting = false;
  disableField = false;
  isFinalSubmitButtonHide: boolean;
  isDraftMode = false;

  groupColumns = [
    { name: "SN", isIndex: true, width: 10 },
    { name: "Group Name", dbColumnName: "group_name", width: 25 },
    { name: "Total Crop Count", dbColumnName: "total_crop_count", width: 20 },
    { name: "Total Variety Count", dbColumnName: "total_variety_count", width: 20 },
  ];
  cropColumns = [
    { name: "SN", isIndex: true, width: 10 },
    { name: "Group Name", dbColumnName: "group_name", width: 25 },
    { name: "Crop Name", dbColumnName: "crop_name", width: 20 },
    { name: "Total Variety Count", dbColumnName: "total_variety_count", width: 20 },
  ];
  varietyColumns = [
    { name: "SN", isIndex: true, width: 10 },
    { name: "Group Name", dbColumnName: "group_name", width: 25 },
    { name: "Crop Name", dbColumnName: "crop_name", width: 20 },
    { name: "Variety Name", dbColumnName: "variety_name", width: 20 },
    { name: "Notification Date", dbColumnName: "notification_date", width: 20 },
    { name: "Notification Number", dbColumnName: "notification_number", width: 20 },
  ];


  constructor(private breeder: BreederService, private fb: FormBuilder, private route: ActivatedRoute, private srpService: SeedRollingPlanningService, private service: SeedServiceService, private router: Router
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
      srp_crop_wise_id: [''], // static or dynamic
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
formatDate(dateStr: string): string {
  if (!dateStr) return '--';
  const date = new Date(dateStr);
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
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
              group.disable({ emitEvent: false }); // disable entire row
              group.get('is_active')?.disable({ emitEvent: false }); // disable toggle also
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
          variety_name: row.variety_name,
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
<div style="max-height: 300px; overflow-y: auto; border: 1px solid #ccc; border-radius: 6px; margin-top: 10px;">
<table style="width:100%; border-collapse: collapse; font-size:14px;">
<thead style="background:#f5f5f5; position: sticky; top: 0;">
<tr>
<th style="border:1px solid #ccc; padding:6px;">S/N</th>
<th style="border:1px solid #ccc; padding:6px;">Variety Name</th>
<th style="border:1px solid #ccc; padding:6px;">Required Qty of Certified Seeds (Qtls.)</th>
<th style="border:1px solid #ccc; padding:6px;">Foundation Seed (Qtls.)</th>
<th style="border:1px solid #ccc; padding:6px;">Breeder Seed (Qtls.)</th>
</tr>
</thead>
<tbody>
${variety_wise
        .map(
          (v, i) => `
<tr>
<td style="border:1px solid #ccc; padding:6px;">${i + 1}</td>
<td style="border:1px solid #ccc; padding:6px;">${v.variety_name || '-'}</td>
<td style="border:1px solid #ccc; padding:6px;">${v.required_qty_of_certified_seeds}</td>
<td style="border:1px solid #ccc; padding:6px;">${v.foundation_seed}</td>
<td style="border:1px solid #ccc; padding:6px;">${v.breeder_seed}</td>
</tr>`
        )
        .join('')}
</tbody>
</table>
</div>
`;

    Swal.fire({
      title: 'Confirm Final Submission',
      html: summaryHtml,
      width: 800,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#B64B1D',
      allowOutsideClick: false,
    }).then((gridResult) => {
      if (!gridResult.isConfirmed) return;

      // SECOND CONFIRMATION POPUP
      Swal.fire({
        title: 'Are you sure?',
        text: "Once submitted, you won't be able to edit this data!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Submit it!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#E97E15',
      }).then((finalConfirm) => {
        if (!finalConfirm.isConfirmed) return;

        const payload = {
          action: "final",
          variety_wise: variety_wise,
          srp_crop_wise_id: this.srp_crop_wise_id
        };

        this.srpService.postRequestCreator(apiUrl, null, payload).subscribe({
          next: (data: any) => {
            if (
              data &&
              data.EncryptedResponse &&
              data.EncryptedResponse.status_code === 200
            ) {
              Swal.fire({
                title: '<p style="font-size:22px;">Data Submitted Successfully!</p>',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#E97E15',
              }).then(() => {
                this.isFinalSubmitButtonHide = true;
                this.getVarietyDetails(this.srp_crop_wise_id, 'submit');
              });
            } else {
              Swal.fire({
                title: '<p style="font-size:22px;">Something went wrong!</p>',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#E97E15',
              });
            }
          },

          error: () => {
            Swal.fire({
              title: '<p style="font-size:22px;">Server Error! Please try again.</p>',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#E97E15',
            });
          },
        });
      });
    });
  }


  // handleSeedInput(index: number) {
  // this.calculateTotalSeedRequired();

  // // If no crop data yet, stop
  // if (!this.crop_wise_json) return;

  // const remaining = this.crop_wise_json.rem_req_seeds;

  // // If grid total seeds equals to crop_wise_json total required — warning
  // if (this.crop_wise_json.total_required ===) {
  // Swal.fire({
  // icon: 'warning',
  // title: 'Limit Reached',
  // text: `you cannot enter more! Required Qty can't greater than Total Seeds `,
  // confirmButtonText: 'OK'
  // });

  // // 🔥 Prevent additional value entry
  // const bspcArray = this.ngForm.get('bspc') as FormArray;
  // const control = bspcArray.at(index);

  // // Reset field to prevent exceeding
  // const enteredValue = Number(control.get('Req_Qty_of_breeder_seed')?.value || 0);
  // const adjustedValue = enteredValue > 0 ? enteredValue : 0;

  // control.get('Req_Qty_of_breeder_seed')?.setValue(adjustedValue);

  // // Recalculate again after adjustment
  // setTimeout(() => {
  // this.calculateTotalSeedRequired();
  // }, 50);
  // }
  // }
  handleSeedInput(index: number) {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const control = bspcArray.at(index);

    // Calculate grid total WITHOUT this row included
    const { gridTotal } = this.calculateTotalSeedRequired();

    const totalRequired = Number(this.crop_wise_json.total_required) || 0;
    const currentValue = Number(control.get('Req_Qty_of_breeder_seed')?.value) || 0;

    // What grid total will become after this input
    const gridTotalAfterInput = gridTotal; // gridTotal already includes current row's value because calc() reads all rows

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

    const currentValue = row.get('is_active')?.value; // true/false
    const remSeeds = this.crop_wise_json?.rem_req_seeds || 0;

    // -----------------------------------------
    // ⭐ CASE: User trying to turn ON the toggle
    // but remaining seeds = 0
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
  // const row = this.ngForm.get('bspc')?.get(`${index}`) as FormGroup;
  // const isActive = row.get('is_active')?.value;

  // if (!isActive) {
  // row.get('Req_Qty_of_breeder_seed')?.disable({ emitEvent: false });
  // row.addControl('isRowLocked', this.fb.control(true));
  // } else {
  // row.get('Req_Qty_of_breeder_seed')?.enable({ emitEvent: false });
  // row.addControl('isRowLocked', this.fb.control(false));
  // }
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

      const reqQty = (ctrl.get('Req_Qty_of_breeder_seed')?.value || '')
        .toString()
        .toLowerCase();

      const foundationSeed = (ctrl.get('foundation_seed')?.value || '')
        .toString()
        .toLowerCase();

      const breederSeed = (ctrl.get('breeder_seed')?.value || '')
        .toString()
        .toLowerCase();

      // 🟢 Search ANY of these fields
      return (
        variety.includes(lower) ||
        notificationYear.includes(lower) ||
        reqQty.includes(lower) ||
        foundationSeed.includes(lower) ||
        breederSeed.includes(lower)
      );
    });
  }

  // applyFilter(searchText: string) {
  // const bspcArray = this.ngForm.get('bspc') as FormArray;
  // if (!bspcArray) return;

  // const allRows = bspcArray.controls;

  // // If empty search → show all rows
  // if (!searchText || !searchText.toString().trim()) {
  // this.filteredBspc = allRows;
  // return;
  // }

  // const lower = searchText.toString().trim().toLowerCase();

  // this.filteredBspc = allRows.filter(ctrl => {
  // const variety = (ctrl.get('variety_name')?.value || '')
  // .toString()
  // .toLowerCase();

  // const notificationYear = (ctrl.get('notification_year')?.value || '')
  // .toString()
  // .toLowerCase();

  // // 🟢 Match EITHER field
  // return (
  // variety.includes(lower) ||
  // notificationYear.includes(lower)
  // );
  // });
  // }

  viewVarietyDetail(data: FormGroup) {
    const varietyCode =
      data.get('variety_code')?.value ||
      data.get('variety_id')?.value ||
      data.get('code')?.value;

    if (!varietyCode) {
      Swal.fire("Variety code missing in row");
      return;
    }
    const cropCode =
      data.get('crop_code')?.value ||
      data.get('code')?.value ||
      null;

    const payload = { search: { variety_code: varietyCode } };

    this.service.postRequestCreator('get-all-variety-details', null, payload)
      .subscribe((res: any) => {

        if (!res?.EncryptedResponse) {
          Swal.fire("Something went wrong!");
          return;
        }

        if (res.EncryptedResponse.status_code !== 200) {
          Swal.fire(res.EncryptedResponse.message);
          return;
        }

        // ✔ API gives data directly
        const dataRes = res.EncryptedResponse.data;
        dataRes.crop_code = dataRes.crop_code || cropCode || '--';
        dataRes.crop_name_hindi = dataRes.crop_name_hindi || '--';

        // --------------------------------
        // SHOW POPUP
        // --------------------------------
        Swal.fire({
          title: 'View Variety Characteristics',
          width: 900,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'custom-close-btn',
            title: 'swal-title-left'
          },
          html: `
<div class="variety-details">

<div class="col">
<div class="field"><label>Crop Group/Crop Category</label><div class="value">${dataRes.group_name || '--'}</div></div>
<div class="field"><label>Botanical/Scientific Name</label><div class="value">${dataRes.botanic_name || '--'}</div></div>
<div class="field"><label>Variety Name</label><div class="value">${dataRes.variety_name || '--'}</div></div>
<div class="field"><label>Notified / Non-Notified</label><div class="value">${dataRes.is_notified == 1 ? 'Notified' : 'Non-Notified'}</div></div>
<div class="field"><label>Notification Number</label><div class="value">${dataRes.notification_number || '--'}</div></div>
<div class="field"><label>Year of Release</label><div class="value">--</div></div>
<div class="field"><label>Category</label><div class="value">--</div></div>
</div>

<div class="col">
<div class="field"><label>Crop Name</label><div class="value">${dataRes.crop_name || '--'}</div></div>
<div class="field"><label>Crop Name (Hindi)</label><div class="value">--</div></div>
<div class="field"><label>Variety Code</label><div class="value">${dataRes.variety_code || '--'}</div></div>
<div class="field"><label>Notification Date</label><div class="value">${dataRes.notification_date ? this['formatDate'](dataRes.notification_date) : '--'}</div></div>
<div class="field"><label>Meeting Number</label><div class="value">${dataRes.meeting_number || '--'}</div></div>
<div class="field"><label>Select Type</label><div class="value"><span class="badge green" style="padding:4px 10px;border-radius:10px;">NA<span></div></div>
<div class="field"><label>category</label><div class="value"><span class="badge purple" style="background:#e0b3f1;padding:4px 10px;border-radius:10px;">NA<span></div></div>
</div>

<div class="col">
<div class="field"><label>Developed By</label><div class="value">${dataRes?.developed_by ? `<span class="badge red">${dataRes.developed_by}</span>` : '--'}</div></div>
<div class="field"><label>Recommended State(s) for Cultivation</label><div class="value">--</div></div>
<div class="field"><label>Agro-Ecological Regions</label><div class="value">--</div></div>
<div class="field"><label>Type of Maturity</label><div class="value">--</div></div>
<div class="field"><label>Enter Maturity (in Days)</label><div class="value">--</div></div>
<div class="field"><label>Average Yield (Qt/Ha)</label><div class="value">--</div></div>
<div class="field"><label>Climate Resilience</label><div class="value"><span class="badge" style="background:#f0f0f0;padding:4px 10px;border-radius:10px;">NA</span></div></div>
</div>

<!-- Column 4 -->
<div class="col">
${(this.ngForm?.value?.filed_data ?? [])
              .map((field: any) => {
                const key = field.field_key;
                const label = field.item_text;
                const value = dataRes?.[key];

                return `
<div class="field">
<label>${label}</label>
<div class="value">${value !== null && value !== undefined && value !== '' ? value : 'NA'}</div>
</div>
`;
              })
              .join('')
            }

<!-- Additional static API fields -->
<div class="field"><label>IP Protected</label><div class="value">${dataRes.ip_protected == 1 ? '<span class="badge blue">Yes</span>' : '<span class="badge gray">No</span>'}</div></div>
<div class="field"><label>GI Tagged</label><div class="value">${dataRes.ig_tagged == 1 ? '<span class="badge yellow">Yes</span>' : '<span class="badge gray" style="background:#eee1a9;padding:4px 10px;border-radius:10px;">No</span>'}</div></div>
<div class="field"><label>Reaction to Major Insect Pests</label><div class="value">${dataRes.reaction_insect_pests || '--'}</div></div>
<div class="field"><label>Reaction to Major Diseases</label><div class="value">${dataRes.reaction_major_diseases || '--'}</div></div>
<div class="field"><label>Crop Code</label><div class="value">${dataRes.crop_code || '--'}</div></div>
</div>
</div>
`,
          willOpen: () => this.applyPopupStyle()
        });

      });
  }


  // viewVarietyDetail(rowData: any) {

  // if (this.ngForm.value.filed_data && this.ngForm.value.filed_data.length > 0) {
  // Swal.fire({
  // title: 'View Variety Characteristics',
  // html: `
  // <div class="variety-details">

  // <!-- Column 1 -->
  // <div class="col">
  // <div class="field"><label>Crop Group/Crop Category</label><div class="value">--</div></div>
  // <div class="field"><label>Botanical/Scientific Name</label><div class="value">--</div></div>
  // <div class="field"><label>Variety Name</label><div class="value">--</div></div>
  // <div class="field"><label>Notified / Non-Notified</label><div class="value">--</div></div>
  // <div class="field"><label>Notification Number</label><div class="value">--</div></div>
  // <div class="field"><label>Year of Release</label><div class="value">--</div></div>
  // <div class="field"><label>Category</label><div class="value">--</div></div>
  // </div>

  // <!-- Column 2 -->
  // <div class="col">
  // <div class="field"><label>Crop Name</label><div class="value">--</div></div>
  // <div class="field"><label>Crop Name (Hindi)</label><div class="value">--</div></div>
  // // <div class="field"><label>Variety Code</label><div class="value">--</div></div>
  // <div class="field"><label>Notification Date</label><div class="value">--</div></div>
  // <div class="field"><label>Meeting Number</label><div class="value">--</div></div>
  // <div class="field"><label>Select Type</label><div class="value"><span class="badge" style="background:#b3e6ff;padding:4px 10px;border-radius:10px;">NA<span></div></div>
  // <div class="field"><label>category</label><div class="value"><span class="badge" style="background:#e0b3f1;padding:4px 10px;border-radius:10px;">NA<span></div></div>
  // </div>

  // <!-- Column 3 -->
  // <div class="col">
  // <div class="field"><label>Developed By</label><div class="value">--</div></div>
  // <div class="field"><label>Recommended State(s) for Cultivation</label><div class="value">--</div></div>
  // <div class="field"><label>Agro-Ecological Regions</label><div class="value">--</div></div>
  // <div class="field"><label>Type of Maturity</label><div class="value">--</div></div>
  // <div class="field"><label>Enter Maturity (in Days)</label><div class="value">--</div></div>
  // <div class="field"><label>Average Yield (Qt/Ha)</label><div class="value">--</div></div>
  // <div class="field"><label>Climate Resilience</label><div class="value">><span class="badge" style="background:#f0f0f0;padding:4px 10px;border-radius:10px;">NA<span></div></div>
  // </div>

  // <!-- Column 4 -->
  // <div class="col">
  // ${this.ngForm.value.filed_data.map((field: any) => `
  // <div class="field">
  // <label>${field.item_text}</label>
  // <div class="value">${rowData[field.field_key] || 'NA'}</div>
  // </div>
  // `).join('')}
  // </div>

  // </div>
  // `,
  // confirmButtonText: 'Close',
  // width: 1200,
  // customClass: { confirmButton: 'custom-close-btn', title: 'swal-title-left' },
  // didOpen: this.applyPopupStyle
  // });

  // } else {
  // console.log(rowData.variety_code,"rowData.variety_code")
  // const payload = { search: { variety_code: rowData.variety_code } };

  // this.service.postRequestCreator('get-all-variety-details', null, payload)
  // .subscribe((res: any) => {
  // const data = res?.EncryptedResponse?.data;
  // console.log("rowData clicked:", rowData);
  // if (res?.EncryptedResponse?.status_code === 200) {

  // Swal.fire({
  // title: 'View Variety Characteristics',
  // html: `
  // <div class="variety-details">

  // <!-- Column 1 -->
  // <div class="col">
  // <div class="field"><label>Crop Group/Crop Category</label><div class="value">${data?.group_name || '--'}</div></div>
  // <div class="field"><label>Botanical/Scientific Name</label><div class="value">${data?.botanic_name || '--'}</div></div>
  // <div class="field"><label>Variety Name</label><div class="value">${data?.variety_name || '--'}</div></div>
  // <div class="field"><label>Notified / Non-Notified</label><div class="value">${data?.is_notified == 1 ? 'Notified' : 'Non-Notified'}</div></div>
  // <div class="field"><label>Notification Number</label><div class="value">${data?.notification_number || '--'}</div></div>
  // <div class="field"><label>Year of Release</label><div class="value">${data?.year_of_release || '--'}</div></div>
  // <div class="field"><label>Category</label><div class="value">${data?.category_name ? `<span class="badge yellow">${data.category_name}</span>` : '--'}</div></div>
  // </div>

  // <!-- Column 2 -->
  // <div class="col">
  // <div class="field"><label>Crop Name</label><div class="value">${data?.crop_name || '--'}</div></div>
  // <div class="field"><label>Crop Name (Hindi)</label><div class="value">${data?.crop_name_hindi || '--'}</div></div>
  // <div class="field"><label>Variety Code</label><div class="value">${data?.variety_code || '--'}</div></div>
  // <div class="field"><label>Notification Date</label><div class="value">${this['formatDate'](data?.notification_date) || '--'}</div></div>
  // <div class="field"><label>Meeting Number</label><div class="value">${data?.meeting_number || '--'}</div></div>
  // <div class="field"><label>Select Type</label><div class="value">${data?.select_type ? `<span class="badge green">${data.select_type}</span>` : '--'}</div></div>
  // <div class="field"><label>Released By</label><div class="value">${data?.released_by ? `<span class="badge purple">${data.released_by}</span>` : '--'}</div></div>
  // </div>

  // <!-- Column 3 -->
  // <div class="col">
  // <div class="field"><label>Developed By</label><div class="value">${data?.developed_by ? `<span class="badge red">${data.developed_by}</span>` : '--'}</div></div>
  // <div class="field"><label>Recommended State(s) for Cultivation</label><div class="value">${data?.states_for_cultivation || '--'}</div></div>
  // <div class="field"><label>Agro-Ecological Regions</label><div class="value">${data?.agro_ecological_regions || '--'}</div></div>
  // <div class="field"><label>Type of Maturity</label><div class="value">${data?.type_of_maturity || '--'}</div></div>
  // <div class="field"><label>Enter Maturity (in Days)</label><div class="value">${data?.maturity_days || '--'}</div></div>
  // <div class="field"><label>Average Yield (Qt/Ha)</label><div class="value">${data?.average_yeild_from && data?.average_yeild_to ? `${data.average_yeild_from} to ${data.average_yeild_to}` : '--'}</div></div>
  // <div class="field"><label>Climate Resilience</label><div class="value">${data?.climate_resilience || '--'}</div></div>
  // </div>

  // <!-- Column 4 -->
  // <div class="col">
  // <div class="field"><label>IP Protected</label><div class="value">${data?.ip_protected == 1 ? '<span class="badge blue">Yes</span>' : '<span class="badge gray">No</span>'}</div></div>
  // <div class="field"><label>GI Tagged</label><div class="value"><span class="badge" style="background:#eee1a9;padding:4px 10px;border-radius:10px;">${data?.ig_tagged == 1 ? '<span class="badge yellow">Yes</span>' : '<span class="badge">No</span>'}</span></div></div>
  // <div class="field"><label>Reaction/Tolerance to Major Insect Pests</label><div class="value"><span class="badge gray">${data?.reaction_insect_pests || '--'}</div></div>
  // <div class="field"><label>Reaction/Resistance to Major Diseases</label><div class="value">${data?.reaction_major_diseases || '--'}</div></div>
  // <div class="field"><label>Crop Code</label><div class="value">${data?.crop_code || '--'}</div></div>
  // </div>

  // </div>
  // `,
  // confirmButtonText: 'Close',
  // width: 850,
  // customClass: { confirmButton: 'custom-close-btn',
  // title: 'swal-title-left'
  // },
  // didOpen: this.applyPopupStyle
  // });
  // }
  // });
  // }
  // }

  applyPopupStyle = () => {
    const style = document.createElement('style');
    style.textContent = `
.variety-details {
display: flex;
flex-wrap: wrap;
font-size: 14px; /* FIXED */
text-align: left;
}
.variety-details .col {
width: 150px;
padding: 0 15px;
box-sizing: border-box;
}
.variety-details .field {
margin-bottom: 15px;
}
.variety-details .field label {
font-weight: 500;
font-size: 13px;
display: block;
margin-bottom: 4px;
color: #555;
}
.variety-details .field .value {
font-size: 14px;
font-weight: 600;
color: #000;
}
.badge {
padding: 4px 12px;
border-radius: 12px;
font-size: 12px;
font-weight: 500;
display: inline-block;
}
.badge.green { background:#c6f1c6; color:#006600; }
.badge.red { background:#f4b4b4; color:#a10000; }
.badge.purple { background:#e0b3f1; color:#4b0066; }
.badge.yellow { background:#fff3b0; color:#8a6d00; }
.badge.blue { background:#b3e6ff; color:#004080; }
.badge.gray { background:#f0f0f0; color:#808080; }
.swal2-confirm.custom-close-btn {
background-color: #E97E15 !important;
color: white !important;
border: none !important;
padding: 8px 10px !important;
border-radius: 4px !important;
font-weight: 600;
}
`;
    document.head.appendChild(style);
  };

}


