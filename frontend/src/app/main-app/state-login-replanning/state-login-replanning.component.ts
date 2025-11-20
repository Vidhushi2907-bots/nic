import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-state-login-replanning',
  templateUrl: './state-login-replanning.component.html',
  styleUrls: ['./state-login-replanning.component.css']
})
export class StateLoginReplanningComponent implements OnInit {
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
  isSearch: boolean = true;
  dropdownSettings: IDropdownSettings = {};
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryCropData: any;
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
  variety_wise_json = [
    {
      variety_name: "PB-1121",
      target_breeder_seed_qty: 100,
      willingness: 0,
      tentative_breeder_seed_qty_i: 50,
      replacement_variety_name: "PR-126",
      tentative_breeder_seed_qty_ii: 30,
      is_status_active: 0
    },
    {
      variety_name: "PR-126",
      target_breeder_seed_qty: 85,
      willingness: 1,
      tentative_breeder_seed_qty_i: 40,
      replacement_variety_name: "PB-1121",
      tentative_breeder_seed_qty_ii: 25,
      is_status_active: 0
    },
    {
      variety_name: "HQPM-1",
      target_breeder_seed_qty: 90,
      willingness: 0,
      tentative_breeder_seed_qty_i: 45,
      replacement_variety_name: "JS-335",
      tentative_breeder_seed_qty_ii: 20,
      is_status_active: 0
    },
    {
      variety_name: "JS-335",
      target_breeder_seed_qty: 60,
      willingness: 1,
      tentative_breeder_seed_qty_i: 30,
      replacement_variety_name: "HQPM-1",
      tentative_breeder_seed_qty_ii: 15,
      is_status_active: 0
    }
  ];

  filteredBspc: any[] = [];
  editModalVisible = false;   // modal show/hide
  editRowIndex: number | null = null;  // which row is being edited
  editRowForm!: FormGroup;    // separate form for modal


  constructor(private service: SeedServiceService, private _masterService: MasterService, private breeder: BreederService, private fb: FormBuilder, private route: Router, private _productionCenter: ProductioncenterService, private master: MasterService) {
    this.createForm();
    this.bspcData = this.breeder.redirectData;
    if (this.bspcData && this.bspcData !== undefined && this.bspcData != null) {
      if (this.bspcData.year && this.bspcData.total_area && this.bspcData.crop_code) {
        this.ngForm.controls['year'].patchValue(this.bspcData.year);
        this.ngForm.controls['total_area'].patchValue(this.bspcData.total_area);

        this.getPageData();
      }
    }
  }
  createForm() {
    this.ngForm = this.fb.group({
      id: [''],
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: [''],
      name: [''],
      state: [''],
      crop_text: [''],
      team_leader: ['0'],
      state_text_nested: [''],
      team_leader_text: [],
      plots_array: [],
      bsp1Arr: this.fb.array([
        // this.bsp2arr(),
      ]),
      newVarietyArr: this.fb.array([
        // this.bsp2arr(),
      ]),
      bspc: this.fb.array([]),
      global_search: [''],
      teams: [''],
    });

    this.ngForm.controls['season'];
    this.ngForm.controls['crop'];
    this.ngForm.controls['year'];
    // this.ngForm.controls['season'].disable();
    // this.ngForm.controls['crop'].disable();
    // this.ngForm.controls['year'].disable();
    // this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
    // if (newvalue) {
    //   this.ngForm.controls['season'].enable();
    //   this.allData = []
    //   this.isCrop = false;
    //   this.isFormDivShow = false;
    //   this.bspc.clear();
    //   this.isSearch = false;


    //   this.ngForm.controls['plots_array'].setValue('');
    //   this.ngForm.controls['id'].setValue('')

    // }
    // });

  }
  get newVarietyArr(): FormArray {
    return this.ngForm.get('newVarietyArr') as FormArray;
  }
  bspcCreateForm(): FormGroup {
    return this.fb.group({
      ids: [],
      designation_id: [''],
      designation_text: [''],
      designation: ['', [Validators.required]],
      type_of_agency: [''],
      agency: ['', [Validators.required]],
      agency_id: [''],
      ditrict_array: [''],
      district_code: [''],
      state_name: [''],
      state_code: ['', [Validators.required]],
      user_name: [''],
      state: [''],
      stateData_text: [''],
      districtData_text: [''],
      state_text_nested: [''],
      district: [''],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      mobile_number: ['', [Validators.required, (Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/))]],
      email_id: ['', [Validators.required, (Validators.pattern(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/))]],
      address: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      is_team_lead: [0],
      pin_code: [''],
      otp: ['1234'],
      member_name: [''],
      district_text: ['']
    })
  }
  newVarietyArrData(): FormGroup {
    return this.fb.group({
      variety_name: [''],
      tentative_breeder_qty: [''],
      is_status_active: ['']
      // ids: [],
      // designation_id: [''],
      // designation_text: [''],
      // designation: ['', [Validators.required]],
      // type_of_agency: [''],
      // agency: ['', [Validators.required]],
      // agency_id: [''],
      // ditrict_array: [''],
      // district_code: [''],
      // state_name: [''],
      // state_code: ['', [Validators.required]],
      // user_name: [''],
      // state: [''],
      // stateData_text: [''],
      // districtData_text: [''],
      // state_text_nested: [''],
      // district: [''],
      // name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      // mobile_number: ['', [Validators.required, (Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/))]],
      // email_id: ['', [Validators.required, (Validators.pattern(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/))]],
      // address: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      // is_team_lead: [0],
      // pin_code: [''],
      // otp: ['1234'],
      // member_name: [''],
      // district_text: ['']
    })
  }

  // your existing form array
  ngOnInit(): void {
    this.addMore(0);


    this.varietyList = [
      { variety_name: 'PB-1121', code: 101 },
      { variety_name: 'PR-126', code: 102 },
      { variety_name: 'HKR-47', code: 103 }
    ];


    // ✅ Populate dummy data AFTER form structure exists
    this.populateDummyData();

    const bspcArray = this.ngForm.get('bspc') as FormArray;

    this.filteredBspc = bspcArray?.controls || [];

    this.ngForm.get('global_search')?.valueChanges.subscribe((searchText: string) => {
      this.applyFilter(searchText);
    });
  }

  getPageData() {
    const year = this.ngForm.controls['year'].value;
    const season = this.ngForm.controls['season'].value;

    if (!year || !season) {
      Swal.fire({
        toast: false,
        icon: "warning",
        title: "Please Select All Required Field",
        position: "center",
        showConfirmButton: true,
      });
      return;
    }

    this.isCrop = true; // show the grid

    // Static JSON data for Login_Replanning
    this['Login_Replanning'] = [
      {
        variety_name: "HD-2967",                       // Wheat variety
        target_breeder_seed_quantity: 125,
        give_willingness: false,
        tentative_breeder_seed_quantity: null,
        replacement_variety_name: "",
        tentative_breeder_seed_quantity2: null,
        actions: ""
      },
      {
        variety_name: "PB-1509",                       // Rice variety
        target_breeder_seed_quantity: 157.5,
        give_willingness: false,
        tentative_breeder_seed_quantity: null,
        replacement_variety_name: "",
        tentative_breeder_seed_quantity2: null,
        actions: ""
      },
      {
        variety_name: "HQPM-1",                        // Maize variety
        target_breeder_seed_quantity: 76.5,
        give_willingness: false,
        tentative_breeder_seed_quantity: null,
        replacement_variety_name: "",
        tentative_breeder_seed_quantity2: null,
        actions: ""
      },
      {
        variety_name: "JS-335",                        // Soybean variety
        target_breeder_seed_quantity: 90,
        give_willingness: false,
        tentative_breeder_seed_quantity: null,
        replacement_variety_name: "",
        tentative_breeder_seed_quantity2: null,
        actions: ""
      }
    ];

    // Clear previous FormArray data
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    bspcArray.clear();

    // Push each crop as a new FormGroup into the FormArray

    this['Login_Replanning'].forEach((variety) => {
      bspcArray.push(this.fb.group({
        variety_name: [variety.variety_name],
        target_breeder_seed_quantity: [variety.target_breeder_seed_quantity],
        give_willingness: [variety.give_willingness],
        tentative_breeder_seed_quantity: [variety.tentative_breeder_seed_quantity],
        replacement_variety_name: [variety.replacement_variety_name],
        tentative_breeder_seed_quantity2: [variety.tentative_breeder_seed_quantity2],
        actions: [variety.actions]
      }));
    });


    console.log("Crop data added to form array:", bspcArray.value);
  }

  populateDummyData() {
    const bspcArray = this.ngForm.get('bspc') as FormArray;

    this.variety_wise_json.forEach(item => {
      bspcArray.push(
        this.fb.group({
          variety_name: [item.variety_name],
          target_breeder_seed_qty: [
            item.target_breeder_seed_qty,
            [Validators.required, Validators.min(0)]
          ],
          willingness: [item.willingness],
          tentative_breeder_seed_qty_i: [
            { value: item.tentative_breeder_seed_qty_i, disabled: true },
            [Validators.min(0)]
          ],
          replacement_variety_name: [
            { value: item.replacement_variety_name, disabled: true }
          ],
          tentative_breeder_seed_qty_ii: [
            { value: item.tentative_breeder_seed_qty_ii, disabled: true },
            [Validators.min(0)]
          ],
          is_status_active: [item.is_status_active]
        })
      );
    });

    this.filteredBspc = bspcArray.controls;

    // ✅ Apply initial logic for each row
    bspcArray.controls.forEach((_, i) => this.onStatusChange(i));
  }

  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }

  changeStatus(data: FormGroup) {
    const current = data.get('is_status_active')?.value;
    data.get('is_status_active')?.setValue(current ? 0 : 1);
    console.log('Toggled status:', data.value);
  }

  toggleHighlight(control: AbstractControl) {
    const group = control as FormGroup;
    const current = group.get('is_status_active')?.value;
    const newStatus = !current;
    group.get('is_status_active')?.setValue(newStatus);

    const bspcArray = this.ngForm.get('bspc') as FormArray;

    // Find current index and remove control from its position
    const currentIndex = bspcArray.controls.indexOf(control);
    if (currentIndex > -1) {
      bspcArray.removeAt(currentIndex);
    }

    if (newStatus) {
      bspcArray.insert(0, control);
    } else {
      bspcArray.push(control);
    }
  }

  draftPopup() {
    this.isFinalSubmit = false; // 🟢 draft mode, do NOT disable anything

    Swal.fire({
      title: 'Saved as Draft!',
      text: 'Your data is saved as draft. You can still edit it.',
      icon: 'info',
      confirmButtonText: 'OK'
    });

    // (Optional) Your API call for saving draft here
  }

  saveEditPopup() {
    this.isFinalSubmit = true; // Final submit mode

    Swal.fire({
      title: 'Success!',
      text: 'Data submitted successfully. You can no longer edit Required Qty of Breeder Seed.',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      const bspcArray = this.ngForm.get('bspc') as FormArray;

      if (bspcArray && bspcArray.length > 0) {
        bspcArray.controls.forEach((row: AbstractControl) => {
          const group = row as FormGroup;
          const reqQtyControl = group.get('Req_Qty_of_breeder_seed');
          if (reqQtyControl) {
            reqQtyControl.disable(); // disable inputs
          }
        });
      }

      // ✅ Hide the grid after submission
      this.isShowDiv = false;
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

  hideUnfilledRows() {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const filledRows = bspcArray.controls.filter((ctrl: AbstractControl) => {
      const value = Number(ctrl.get('Req_Qty_of_breeder_seed')?.value);
      return value && value > 0; // ✅ Keep only filled rows
    });

    // Replace the FormArray with only filled rows
    bspcArray.clear();
    filledRows.forEach(row => bspcArray.push(row));

    // Also update filtered list
    this.filteredBspc = filledRows;
  }

  getFilteredRows() {
    // If a filtered list exists, return that; else return all rows
    if (this.filteredBspc && this.filteredBspc.length) {
      return this.filteredBspc;
    }

    const bspcArray = this.ngForm?.get('bspc') as FormArray;
    return bspcArray ? bspcArray.controls : [];
  }


  onStatusChange(index: number) {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const rowGroup = bspcArray.at(index) as FormGroup;

    const status = Number(rowGroup.get('is_status_active')?.value); // ensure number
    const willingness = rowGroup.get('willingness')?.value;

    const tentativeI = rowGroup.get('tentative_breeder_seed_qty_i');
    const tentativeII = rowGroup.get('tentative_breeder_seed_qty_ii');
    const replacementVariety = rowGroup.get('replacement_variety_name');
    const statusActive = rowGroup.get('is_status_active');

    if (status == 1) {
      // ✅ ACCEPT
      if (willingness === 1) {
        // Willing (Yes) → enable only Qty I
        tentativeI?.enable({ emitEvent: false });
        tentativeII?.disable({ emitEvent: false });
        replacementVariety?.disable({ emitEvent: false });
      } else {
        // Not Willing (No) → disable Qty I, enable others
        tentativeI?.disable({ emitEvent: false });
        tentativeII?.enable({ emitEvent: false });
        replacementVariety?.enable({ emitEvent: false });
      }
    }
    else if (status == 0) {
      // REJECT → disable all except Action dropdown itself
      tentativeI?.disable({ emitEvent: false });
      tentativeII?.disable({ emitEvent: false });
      replacementVariety?.disable({ emitEvent: false });
      statusActive?.enable({ emitEvent: false }); // keep Action editable
    }
    else {
      // 🔄 RESET / Select blank → revert based on willingness
      if (willingness === 1) {
        tentativeI?.enable({ emitEvent: false });
        tentativeII?.disable({ emitEvent: false });
        replacementVariety?.disable({ emitEvent: false });
      } else {
        tentativeI?.disable({ emitEvent: false });
        tentativeII?.enable({ emitEvent: false });
        replacementVariety?.enable({ emitEvent: false });
      }
    }
  }

  remove(rowIndex: number) {
    this.newVarietyArr.removeAt(rowIndex);
  }


  addMore(i) {
    this.newVarietyArr.push(this.newVarietyArrData());
    // this.getDesignationList(i + 1);
    // this.getAgency(i + 1);
    // this.getStatelistSecond(i + 1);
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

  onWillingnessChange(index: number) {
    const bspcArray = this.ngForm.get('bspc') as FormArray;
    const rowGroup = bspcArray.at(index) as FormGroup;

    const willingness = rowGroup.get('willingness')?.value;

    // Get all relevant fields
    const tentativeI = rowGroup.get('tentative_breeder_seed_qty_i');
    const tentativeII = rowGroup.get('tentative_breeder_seed_qty_ii');
    const replacementVariety = rowGroup.get('replacement_variety_name');
    const statusActive = rowGroup.get('is_status_active');

    if (willingness === 1) {
      // Willing (Yes)
      tentativeI?.enable();
      tentativeII?.disable();
      replacementVariety?.disable();
      statusActive?.disable();
    } else {
      // Not Willing (No)
      tentativeI?.disable();
      tentativeII?.enable();
      replacementVariety?.enable();
      statusActive?.enable();
    }
  }

  onSelectVariety(index: number, variety: any) {
    const row = this.newVarietyArr.at(index);
    row.patchValue({
      variety_name: variety.variety_name,
      tentative_breeder_qty: variety.tentative_breeder_qty,
      is_status_active: variety.is_status_active
    });

    // Apply accept/reject logic immediately
    this.onStatusChange(index);
  }

  dummyVarietyList: any[] = [
    { variety_name: 'PB-1121', tentative_breeder_qty: 20, is_status_active: 1 },
    // { variety_name: 'PR-126', tentative_breeder_qty: 15, is_status_active: 0 },
    // { variety_name: 'PUSA-1509', tentative_breeder_qty: 25, is_status_active: 1 }
  ];

  // ✅ Accept/Reject logic
  onStatusChange2(index: number) {
    const row = this.newVarietyArr.at(index) as FormGroup;
    const status = Number(row.get('is_status_active')?.value);

    if (status === 1) {
      // ✅ Accept → enable input
      row.get('tentative_breeder_qty')?.enable({ emitEvent: false });
    } else if (status === 0) {
      // ❌ Reject → disable input
      row.get('tentative_breeder_qty')?.disable({ emitEvent: false });
    } else {
      // 🟡 Default → disable input
      row.get('tentative_breeder_qty')?.disable({ emitEvent: false });
    }
  }

}



