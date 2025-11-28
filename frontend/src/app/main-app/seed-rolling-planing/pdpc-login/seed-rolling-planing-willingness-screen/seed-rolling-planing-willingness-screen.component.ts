import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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


@Component({
  selector: 'app-seed-rolling-planing-willingness-screen',
  templateUrl: './seed-rolling-planing-willingness-screen.component.html',
  styleUrls: ['./seed-rolling-planing-willingness-screen.component.css']
})

export class SeedRollingPlaningWillingnessScreenComponent implements OnInit {
  [x: string]: any;

  fileName = 'breeder-bsp-profarma-one.xlsx';

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup;
  baseUrl: string = environment.ms_nb_06_production_center.baseUrl;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  employees: any = []
  employeeSkills: any
  is_update: boolean = false;
  isCrop: boolean = false;
  isSearch: boolean = true;
  dropdownSettings: IDropdownSettings = {};
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryCropData: any;
  varietyData: any;
  inventoryVarietyData: any;
  hoverIndex: number | null = null;
  popupPosition: Record<string, string> = {};
  inventoryIndentorData: any
  popupIndex: number | null = null;
  lastVarietyCode: string | null = null;
  cropGroupList = [
    { id: 1, name: 'Cereals' },
    { id: 2, name: 'Pulses' },
    { id: 3, name: 'Oilseeds' },
    { id: 4, name: 'Vegetables' },
  ];
  bspsDataArray: { id: number; production_center: string; season: string; crop: string; variety_name: string; variety_code: string; bspc_developed_by: number; req_no_doc_moa: string; req_no_dept_moa: string; nucleus_seed_available: any; breeder_seed_available: any; total_target: string; }[];
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
  cropData: any[] = [];
  croplistSecond: any[];
  openCropIndexs: number | null = null;
  selectCrop: any;
  openCropIndexes: number[] = [];

  constructor(private service: SeedServiceService, private _masterService: MasterService, private breeder: BreederService, private fb: FormBuilder, private route: Router, private cdRef: ChangeDetectorRef, private _productionCenter: ProductioncenterService, private master: MasterService, private srpService: SeedRollingPlanningService) {
  }

  createForm() {
    this.ngForm = this.fb.group({
      id: [''],
      year: [''],
      season: [''],
      crop_code: [''],
      variety2_code: [''],
      bspc: this.fb.array([
]),
     
     
    });

    this.ngForm.controls['season'].disable();
    this.ngForm.controls['year'].enable();
    this.ngForm.controls['crop_code'].disable();

    // When YEAR changes → Load seasons
    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        console.log("YEAR SELECTED:", newvalue);
        this.ngForm.controls['season'].enable();
        this.loadSeason();        // <--- season API call here
      } else {
        this.ngForm.controls['season'].disable();
        this.ngForm.controls['season'].setValue('');
      }
    });
    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        console.log("season SELECTED:", newvalue);
        this.ngForm.controls['crop_code'].enable();
        this.loadCrop();        // <--- season API call here
      } else {
        this.ngForm.controls['crop_code'].disable();
        this.ngForm.controls['crop_code'].setValue('');
      }
    });
  }
  innerBspc: FormArray = this.fb.array([]);
createRow() {
  return this.fb.group({
    variety1_code: [''],
    tentative_quantity: [0]
  });
}
  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }
 

addRow() {
  this.bspc.push(this.createRow());
}

// ❌ Delete Row
deleteRow(index: number) {
  this.bspc.removeAt(index);
}

  loadYear() {
    const apiUrl = 'srp-year-willingness'
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
    const apiUrl = `srp-season-willingness?year=${year}`
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
    const apiUrl = `srp-crop-willingness?year=${year}&season=${season}`
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

  getPageData() {
    const year = this.ngForm.controls['year'].value;
    const season = this.ngForm.controls['season'].value;
    const crop_code = this.ngForm.controls['crop_code'].value;

    if (!year || !season || !crop_code) {
      Swal.fire({
        toast: false,
        icon: "warning",
        title: "Please Select All Required Field",
        position: "center",
        showConfirmButton: true,
      });
      return;
    }
    this.ngForm.get('variety1_code')?.setValue('');
    this.isCrop = true;

    const apiUrl = `srp-variety-willingness?year=${year}&season=${season}&crop_code=${crop_code}`;
    this.getVarietyData(crop_code)
    this.srpService.postRequestCreator(apiUrl, null, null).subscribe({
      next: (data: any) => {
        if (
          data &&
          data.EncryptedResponse &&
          data.EncryptedResponse.data &&
          data.EncryptedResponse.status_code === 200
        ) {
          this.inventoryVarietyData = data.EncryptedResponse.data;

          console.log("API DATA:", this.inventoryVarietyData);

          /** 💥 FIRST clear existing FormArray */
          const bspcArray = this.ngForm.get('bspc') as FormArray;
          console.log(bspcArray, "bspc.....................................")
          // bspcArray.clear();
          console.log(this.varietyData, "vaietyData")
          /** 💥 NOW push rows after API data arrives */
          this.inventoryVarietyData.forEach((variety: any) => {
            bspcArray.push(
              this.fb.group({
                variety_code: [variety.variety_code],
                variety_name: [variety.variety_name],  // corrected key
                total_seed_required: [variety.total_breeder_seed ?? 0],
                status_toggle: [1],
                tentative_quantity: ['']
              })
            );
          });

          console.log("FormArray after push:", bspcArray.value);
        }
      },
      error: (err) => {
        console.error("❌ API Error:", err);
      },
    });

  }

  toggleCropSection(index: number) {
    const pos = this.openCropIndexes.indexOf(index);
    if (pos === -1) {
      this.openCropIndexes.push(index);
    } else {
      this.openCropIndexes.splice(pos, 1);
    }
  }
  getVarietyData(crop_code: string) {

    console.log("hello")
    const apiUrl = `get-variety-details?crop_code=${crop_code}`

    this.srpService.getRequestCreatorNew(apiUrl).subscribe({
      next: (data: any) => {
        if (
          data &&
          data.EncryptedResponse &&
          data.EncryptedResponse.data &&
          data.EncryptedResponse.status_code === 200
        ) {
          this.varietyData = data.EncryptedResponse.data;
          console.log(this.varietyData, "chbsdcffvswvswv")
          // ✅ Optional: filter only active seasons


          console.log('✅ Season list loaded:', this.inventorySeasonData);
        } else {
          console.warn('⚠️ No valid data received in EncryptedResponse');
          this.varietyData = [];
        }
      },
      error: (err) => {
        console.error('❌ Error fetching seasons:', err);
      },
    });

  }
  onQuantityClick(index: number, event: Event) {
    event.stopPropagation(); // 👈 outside click में count न हो

    if (this.popupIndex === index) {
      this.popupIndex = null;
      return;
    }

    this.popupIndex = index;

    const varietyCode =
      this.ngForm.controls['bspc']['controls'][index].controls['variety_code'].value;

    this.indentorBreederSeedData(varietyCode);
  }

  hidePopover() {
    this.popupIndex = null;
  }

  indentorBreederSeedData(varietyCode: string) {

    const year = this.ngForm.controls['year'].value;
    const season = this.ngForm.controls['season'].value;
    const crop_code = this.ngForm.controls['crop_code'].value;

    const apiUrl = `srp-variety-wise-indentor-list?year=${year}&season=${season}&crop_code=${crop_code}&variety_code=${varietyCode}`;

    this.srpService.postRequestCreator(apiUrl, null, null).subscribe({
      next: (data: any) => {

        if (
          data &&
          data.EncryptedResponse &&
          data.EncryptedResponse.data &&
          data.EncryptedResponse.status_code === 200
        ) {
          this.inventoryIndentorData = data.EncryptedResponse.data;
          console.log(this.inventoryIndentorData, " this.inventoryIndentorData")


        }
      },
      error: (err) => {
        console.error("❌ API Error:", err);
      }
    });
  }

 addInnerRow() {
  this.innerBspc.push(this.createInnerRow());
}

deleteInnerRow(index: number) {
  if (this.innerBspc.length > 1) {
    this.innerBspc.removeAt(index);
  }
}
  bspcCreateForm(): FormGroup {
    return this.fb.group({
      seed_rate: [''],
      total_area: [''],
      srr_value: [''],
      tentative_quantity: ['']

    })
  }
createInnerRow() {
  return this.fb.group({
    variety_code: [''],
    tentative_qty: ['']
  });
}
  // your existing form array
  ngOnInit(): void {
    this.createForm();
    this.loadYear();
this.innerBspc.push(this.createInnerRow());
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    this.userId = data.id;
  }

  openpopup() {
    this.displayStyle = 'block'
  }
  close() {
    this.displayStyle = 'none'
  }

  closePopup() {
    this.popupIndex = null;
  }

  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }

  // Cancel Button
  revertDataCancelation() {

    this.bspc.clear();
    this.ngForm.controls['bspc'].reset;
    this.isCrop = false
    this.ngForm.controls['bspc'].enable();
    this.isSearch = true;

  }

  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  finalSubmit() {
    console.log("final submit");
  }

  capitalizeWords(str) {
    if (str) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    }

  }

  checkDecimal(e) {
    checkDecimalValue(e)
  }

  checkLength($e, length) {
    checkLength($e, length);
  }

  validateField(event, i) {
    if (event.target.checked) {
      this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
    } else {
      if ((this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_available'].value > 0) && (this.ngForm.controls['bspc']['controls'][i].controls['nucleus_seed_available'].value > 0))
        this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
      else
        this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].disable();
    }
  }
  @ViewChild('popupRef') popupRef!: ElementRef;

  ngAfterViewInit() {
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event: any) {
    // popup open नहीं है → कुछ मत करो
    if (this.popupIndex === null) return;

    // अगर क्लिक popup के अंदर हुआ → बंद मत करो
    if (this.popupRef && this.popupRef.nativeElement.contains(event.target)) {
      return;
    }

    // Popup बंद करो
    this.popupIndex = null;
  }

}
