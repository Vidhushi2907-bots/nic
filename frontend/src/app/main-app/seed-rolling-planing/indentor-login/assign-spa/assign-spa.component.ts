

import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-assign-spa',
  templateUrl: './assign-spa.component.html',
  styleUrls: ['./assign-spa.component.css']
})
export class AssignSpaComponent implements OnInit {

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
  autoSearchTimeout: any;
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
  isFinalSubmitButtonHide: boolean;
  isCheckNewVariety: boolean
  selectedReplaceList: any = [];
  smr1 = 5;
  smr2 = 10;
  dropdownList22 = []
  spaStateCode: any
  constructor(private service: SeedServiceService, private router: ActivatedRoute, private _masterService: MasterService, private breeder: BreederService, private productionService: ProductioncenterService, private fb: FormBuilder, private route: Router, private cdRef: ChangeDetectorRef, private _productionCenter: ProductioncenterService, private master: MasterService, private srpService: SeedRollingPlanningService) {

  }

  createForm() {
    this.ngForm = this.fb.group({
      id: [''],
      year: [''],
      season: [''],
      crop_code: [''],
      crop_name: [''],
      global_search: [''],
      bspc: this.fb.array([]),

    });



  }


  get bspc(): FormArray {

    return this.ngForm.get('bspc') as FormArray;
  }


  getInnerBspc(i: number): FormArray {
    return this.ngForm.get('bspc')?.get(i.toString())?.get('assign_spa') as FormArray;
  }


  liftingselfSPAData(): void {

    this.srpService.postRequestCreator('get-state', null, null).subscribe({
      next: (res: any) => {
        if (res?.EncryptedResponse?.status_code === 200) {

          // 👇 EXACT extraction
          this.spaStateCode = res.EncryptedResponse.data;
          const stateCode = this.spaStateCode.state_code;

          // 🔥 Ab second API call
          const route = 'get-lifting-surplus-breeder-spa-details';
          const param = {
            search: {
              state_code: stateCode
            }
          };

          this._productionCenter
            .postRequestCreator(route, param, null)
            .subscribe((res2: any) => {
              if (res2?.EncryptedResponse?.status_code === 200) {
                this.dropdownList22 = res2.EncryptedResponse.data || [];
              }
            });
        }
      }
    });

  }
  addReplaceVarieties(albumIndex: number) {
    const albums = this.ngForm.get('bspc') as FormArray;
    const songs = albums.at(albumIndex).get('assign_spa') as FormArray;
    songs.push(this.createInnerRow());
    this.toggleCropSection(albumIndex)
  }
  getCropName(crop_code: any) {
    const url = `get-crop?crop_code=${crop_code}`;
    this.srpService.postRequestCreator(url, null, null).subscribe({
      next: (res: any) => {
        if (res?.EncryptedResponse?.status_code === 200) {

          this.inventoryCropData = res.EncryptedResponse.data || [];
          this.ngForm.patchValue({
            crop_name: this.inventoryCropData?.crop_name
          });

        }
      },
      error: (err) => console.error("❌ API Error:", err)
    });
  }

  getPageData() {

    const year = this.ngForm.get('year')?.value;
    const season = this.ngForm.get('season')?.value;
    const crop_code = this.ngForm.get('crop_code')?.value;

    if (!year || !season || !crop_code) {
      Swal.fire({
        icon: "warning",
        title: "Please Select All Required Field",
        position: "center",
        showConfirmButton: true,
      });
      return;
    }
    const searchKeyword = String(this.ngForm.get('global_search')?.value || '').trim().toLowerCase();
    console.log(this.ngForm.get('global_search')?.value, "hhhhhhhhhhhhhhhhhh");
    this.isCrop = true;

    const apiUrl = `get-variety?year=${year}&season=${season}&crop_code=${crop_code}`;
    this.srpService.postRequestCreator(apiUrl, null, null).subscribe({
      next: (res: any) => {
        if (res?.EncryptedResponse?.status_code === 200) {

          this.inventoryVarietyData = res.EncryptedResponse.data || [];
          console.log(this.inventoryVarietyData, "this.inventoryVarietyData")
          if (searchKeyword) {
            console.log(searchKeyword)
            this.inventoryVarietyData = this.inventoryVarietyData.filter(item =>
              String(item.variety_name || '').toLowerCase().includes(searchKeyword) ||
              String(item.certified_seed || '').toLowerCase().includes(searchKeyword) ||
              String(item.breeder_seed || '').toLowerCase().includes(searchKeyword) ||
              String(item.foundation_seed || '').toLowerCase().includes(searchKeyword)

            );
          }
          const srpWillingnessArray = this.ngForm.get('bspc') as FormArray;
          srpWillingnessArray.clear();
          this.isFinalSubmitButtonHide = this.inventoryVarietyData.some((item: any) => item?.is_final_submit === true);
          this.inventoryVarietyData.forEach((variety: any, index: number) => {
            const foundation_seed = Number((variety.breeder_seed * this.smr1).toFixed(2));
            const certified_seed = Number((foundation_seed * this.smr2).toFixed(2));

            const group = this.fb.group({
              variety_code: [variety.variety_code],
              variety_name: [variety.variety_name],
              breeder_seed: [variety.breeder_seed],
              foundation_seed: [foundation_seed],
              certified_seed: [certified_seed],
              assign_spa: this.fb.array([])
            })

            srpWillingnessArray.push(
              group
            );
            const replaceArray = group.get('assign_spa') as FormArray;
            replaceArray.clear();
            if (variety.assign_spa?.length > 0) {
              variety.assign_spa.forEach(rv => {
                replaceArray.push(
                  this.fb.group({
                    id: [rv.id],
                    spa_user_id: [rv.spa_user_id],
                    spa_name: [rv.spa_name],
                    certified_seed_quantity: [rv.certified_seed_quantity]
                  })
                );
              });
              if (!this.openCropIndexes.includes(index)) {
                this.openCropIndexes.push(index);
              }
            }
          });

        }
      },
      error: (err) => console.error("❌ API Error:", err)
    });
  }

  async triggerAutoSearch() {
    clearTimeout(this.autoSearchTimeout);

    this.autoSearchTimeout = setTimeout(() => {
      this.getPageData();  // automatically fire your API function
    }, 400); // delay 0.4 sec
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

  checkTentativeValue(i: number) {
    const controlGroup = this.ngForm.controls['bspc']['controls'][i];
    const totalSeedRequired = controlGroup.controls['total_seed_required'].value;
    console.log(totalSeedRequired, "totalSeedRequired");
    const tentativeControl = controlGroup.controls['tentative_quantity'];
    console.log(tentativeControl.value, "tentativeControl")
    if (tentativeControl.value > totalSeedRequired) {
      // Reset tentative to 0
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Tentative quantity cannot exceed the target quantity!',
        confirmButtonText: 'OK'
      });
      tentativeControl.setValue(0, { emitEvent: false });

    }
  }
  lockHeaderFields() {
    this.ngForm.get('year')?.disable();
    this.ngForm.get('season')?.disable();
    this.ngForm.get('crop_name')?.disable();
  }
  goBack() {
    const year = localStorage.getItem('year');
    const season = localStorage.getItem('season');
    const crop = localStorage.getItem('crop');
    console.log(year, season, crop, "kitttttttttt")
    // Agar dono values exist karte hain tabhi navigate karein
    if (year && season && crop) {
      this.route.navigate(
        ['/state-login-replanning'],
        { queryParams: { isLocked: true } }
      );

    } else {
      // Kuch nahi karna agar year ya season missing hai
      console.warn('Year or Season not found in localStorage');
    }
  }
  saveAsDraft() {
    const apiUrl = "add-spa-details";
    const formValues = this.ngForm.value;

    const existingData = formValues.bspc.map((row: any) => {
      const spaDetails = row.assign_spa

      const assignSpa = spaDetails
        .filter((r: any) => r.spa_user_id)
        .map((r: any) => {
          return {
            spa_user_id: Number(r.spa_user_id),
            certified_seed_quantity: Number(r.certified_seed_quantity)
          };
        });

      return {
        variety_code: row.variety_code,
        breeder_seed: row.breeder_seed,
        foundation_seed: row.foundation_seed,
        certified_seed: row.certified_seed,
        assign_spa: assignSpa.length > 0 ? assignSpa : null
      };
    });

    const spaDetails = [...existingData];

    const payload = {
      action: "draft",
      year: this.ngForm.get('year')?.value,
      season: this.ngForm.get('season')?.value,
      crop_code: this.ngForm.get('crop_code')?.value,
      spaDetails
    };

    this.srpService.postRequestCreator(apiUrl, null, payload).subscribe({
      next: (data: any) => {
        console.log("API Response:", data);
        if (data?.EncryptedResponse?.status_code === 200) {

          Swal.fire({
            title: '<p style="font-size:25px;">Data saved as Draft successfully.</p>',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#B64B1D',
          }).then(() => {
            this.getPageData()
          });
        } else {
          Swal.fire({
            title: '<p style="font-size:25px;">Something went wrong.</p>',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#B64B1D',
          });
        }
      },
      error: (err) => {
        console.error("Error saving draft:", err);
        Swal.fire({
          title: '<p style="font-size:25px;">Server Error! Please try again.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#B64B1D',
        });
      },
    });
  }
  openReplaceSwal(list: any[]) {

    Swal.fire({
      title: '<span style="color:Black;">Assigned SPA</span>',
      width: 700,
      background: '#f5f5f5',
      html: this.generateTableHTML(list),
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-modal',
        title: 'modal-title'
      }
    });
  }

  generateTableHTML(list: any[]) {
    if (!list || list.length === 0) {
      return `<p>No SPA Details.</p>`;
    }

    let rows = list
      .map(
        (x) => `
       <tr>
       
         <td>${x.spa_name || '-'}</td>
         <td>${x.certified_seed_quantity}</td>
       </tr>`
      )
      .join('');

    return `
     <div style="margin-top:10px;">
       <table border="1" width="100%" style="border-collapse: collapse; text-align:center;">
         <thead style="background:#B34B1D;">
           <tr>
           
           <th style="color: black;">SPA Name</th>
 <th style="color: black;">Certified Seeds</th>
           </tr>
         </thead>
 
         <tbody>
           ${rows}
         </tbody>
       </table>
     </div>
   `;
  }
  finalizeData() {
    const apiUrl = "add-spa-details";
    const formValues = this.ngForm.value;
    const bspcArray = formValues.bspc || [];
    const existingData = bspcArray.map((row: any) => {
      const assignSpa = row.assign_spa
        ?.filter((r: any) => r.spa_user_id)
        .map((r: any) => ({
          spa_user_id: Number(r.spa_user_id),
          certified_seed_quantity: Number(r.certified_seed_quantity)
        })) || [];

      return {
        variety_code: row.variety_code,
        breeder_seed: row.breeder_seed,
        foundation_seed: row.foundation_seed,
        certified_seed: row.certified_seed,
        assign_spa: assignSpa.length > 0 ? assignSpa : null
      };
    });


    // FINAL MERGE — always an array
    const spaDetails = [...existingData];


  let unassignedVarieties = existingData.filter(variety => {
  // Check in assign_spa if any SPA belongs to this variety
  return !variety.assign_spa || variety.assign_spa.length === 0;
});

if (unassignedVarieties.length > 0) {
  Swal.fire({
    title: '<p style="font-size:20px;">Each variety must have at least one SPA assigned.</p>',
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#B64B1D',
  });
  return; // Stop form submission
}
 
    const payload = {
      action: "final",

      year: this.ngForm.get('year')?.value,
      season: this.ngForm.get('season')?.value,
      crop_code: this.ngForm.get('crop_code')?.value,
      spaDetails
    };

    console.log("Final Payload: ", payload);

    this.srpService.postRequestCreator(apiUrl, null, payload).subscribe({
      next: (data: any) => {
        if (data?.EncryptedResponse?.status_code === 200) {
          Swal.fire({
            title: '<p style="font-size:22px;">Data Submitted Successfully!</p>',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15',
          }).then(() => {
            this.isFinalSubmitButtonHide = true
            this.getPageData();
          });
        } else {
          Swal.fire({
            title: '<p style="font-size:22px;">Something went wrong!</p>',
            icon: 'error',
          });
        }
      },
      error: () => {
        Swal.fire({
          title: '<p style="font-size:22px;">Server Error! Try again.</p>',
          icon: 'error',
        });
      },
    });
  }

  addInnerRow(i: number) {
    this.getInnerBspc(i).push(
      this.fb.group({
        id: [],
        spa_user_id: [],
        spa_name: [''],
        certified_seed_quantity: [0]
      })
    );
  }
  removeInnerRow(i: number, j: number) {
    const innerArray = this.getInnerBspc(i);

    // Get ID safely
    const id = innerArray.get(j.toString()).value?.id
    console.log(id, "id");

    // Remove the inner row
    innerArray.removeAt(j);

    // If id does not exist, don't make API call
    if (!id) {
      console.warn("⚠️ No ID found for this row, skipping API call.");
      return;
    }

    const apiUrl = `srp-willingness-replace-variety?id=${id}`;
    console.log(apiUrl, "apiUrl");

    this.srpService.getRequestCreatorNew(apiUrl).subscribe({
      next: (data: any) => {
        if (
          data &&
          data.EncryptedResponse &&
          data.EncryptedResponse.data &&
          data.EncryptedResponse.status_code === 200
        ) {
          this.varietyData = data.EncryptedResponse.data;
          console.log("✅ Data loaded");
        } else {
          console.warn("⚠️ No valid data received");
          this.varietyData = [];
        }
      },
      error: (err) => {
        console.error("❌ Error fetching data:", err);
      },
    });
  }

  selectReplaceVariety(i: number, j: number, variety: any) {
    const control = this.getInnerBspc(i).at(j);
    console.log(variety, "staep 1")
    control.patchValue({
      spa_user_id: variety.spa_id,
      spa_name: variety.spa_name,
    });

  }

  createInnerRow(): FormGroup {
    return this.fb.group({
      spa_user_id: [0],
      spa_name: [''],
      certified_seed_quantity: [0]
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.liftingselfSPAData();
    const userData = localStorage.getItem('BHTCurrentUser');
    if (userData) {
      const data = JSON.parse(userData);
      this.userId = data.id;
    }
    this.ngForm.get('global_search')?.valueChanges.subscribe(() => {
      this.triggerAutoSearch();
    });
    this.router.queryParams.subscribe(params => {
      const year = params['year'] || localStorage.getItem('year');
      const season = params['season'] || localStorage.getItem('season');
      const crop_code = params['crop_code'] || localStorage.getItem('crop_code');
      const isLocked = params['isLocked'] === 'true';
      this.ngForm.patchValue({
        year: year,
        season: season,
        crop_code: crop_code,
        isLocked: isLocked
      });
      this.getCropName(crop_code);

    });





    this.lockHeaderFields(); // 🔒 fields disable
    this.getPageData();      // 🔄 API call

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
  getMainQuantity(i: number): number {

    return Number(
      this.ngForm.controls['bspc']['controls'][i].controls['certified_seed'].value
    ) || 0;
  }
  getSpaTotalQuantity(i: number): number {
    const spaArray =
      this.ngForm.controls['bspc']['controls'][i].controls['assign_spa'].controls;

    let total = 0;
    spaArray.forEach((spa: any) => {
      total += Number(spa.controls['certified_seed_quantity'].value) || 0;
    });

    return Number(total.toFixed(2)); // decimal issue fix
  }
  validateSpaQuantity(i: number, j: number) {

    const mainQty = this.getMainQuantity(i);
    const spaTotal = this.getSpaTotalQuantity(i);
    const spaArray =
      this.ngForm.controls['bspc']['controls'][i].controls['assign_spa'].controls;

    if (spaTotal > mainQty) {
      Swal.fire({
        icon: 'error',
        title: 'Quantity Mismatch',
        text: "SPA quantity cannot exceed Tentative Quantity ",
      });
      // 🔥 Value bilkul reset
      const currentControl = spaArray.at(j).get('certified_seed_quantity');
      currentControl?.setValue(0, { emitEvent: false });

      return;
    }

    if (spaTotal === mainQty) {
      console.log('✅ Quantity perfectly matched');
    }
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
