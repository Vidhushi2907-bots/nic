import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
      bspc: this.fb.array([]),
      newVarieties: this.fb.array([this.createNewVarietyRow()])
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

  // createBspcRow(): FormGroup {
  //   return this.fb.group({
  //     variety_code: [''],
  //     variety_name: [''],
  //     total_seed_required: [''],
  //     status_toggle: [true],
  //     tentative_quantity: [0],
  //     replaceVariety: this.fb.array([this.createInnerRow()])
  //   });
  // }

  addNewVariety(i) {
    this.newVarieties.push(this.createNewVarietyRow());
  }

  removeNewVariety(i) {
    const id = this.newVarieties.at(i.toString()).value.id;
    console.log(id, "id")
    // Remove row from FormArray
    this.newVarieties.removeAt(i.toString());

    const apiUrl = `srp-willingness-variety?id=${id}`
    console.log(apiUrl, " apiUrl")
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
    });;
  }

  get bspc(): FormArray {

    return this.ngForm.get('bspc') as FormArray;
  }
  get newVarieties(): FormArray {
    return this.ngForm.get('newVarieties') as FormArray;
  }
  getInnerBspc(i: number): FormArray {
    return this.ngForm.get('bspc')?.get(i.toString())?.get('replaceVariety') as FormArray;
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

  addReplaceVarieties(albumIndex: number) {
    const albums = this.ngForm.get('bspc') as FormArray;
    const songs = albums.at(albumIndex).get('replaceVariety') as FormArray;
    console.log(songs, "songs")
    songs.push(this.createInnerRow());
    this.toggleCropSection(albumIndex)
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

    // Reset form fields
    this.ngForm.get('variety1_code')?.setValue('');
    this.isCrop = true;

    const apiUrl = `srp-variety-willingness?year=${year}&season=${season}&crop_code=${crop_code}`;
    this.getVarietyData(crop_code);

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

          const srpWillingnessArray = this.ngForm.get('bspc') as FormArray;
          const additionalArray = this.ngForm.get('newVarieties') as FormArray;
          srpWillingnessArray.clear();
          
          // this.inventoryVarietyData.forEach((variety: any) => {

          //   if (variety.is_additional === true) {
          //     // Additional variety 
          //     additionalArray.clear();
          //     additionalArray.push(
          //       this.fb.group({
          //         variety_code: [variety.variety_code],
          //         variety_name: [variety.variety_name],
          //         new_tentative_quantity: [variety.quantity ?? 0],
          //         additional_note: [variety.remarks ?? '']
          //       })
          //     );
          //   } else {
          //     const group = this.fb.group({
          //       variety_code: [variety.variety_code],
          //       variety_name: [variety.variety_name],
          //       total_seed_required: [variety.total_breeder_seed ?? 0],
          //       status_toggle: [variety.willingness ?? true],
          //       tentative_quantity: [variety.quantity ?? 0],
          //       replaceVariety: this.fb.array([])

          //     });

          //     const replaceArray = group.get('replaceVariety') as FormArray;

          //     if (variety.replace_variety && variety.replace_variety.length > 0) {
          //       variety.replace_variety.forEach((rv: any) => {
          //         replaceArray.push(
          //           this.fb.group({
          //             variety_code: [rv.replace_variety_code],
          //             variety_name: [rv.variety_name],
          //             replace_tentative_qty: [rv.quantity ?? 0]
          //           })
          //         );
          //       });
          //     }

          //     srpWillingnessArray.push(group);
          //   }
          // });
          this.inventoryVarietyData.forEach((variety: any, index: number) => {
            console.log(variety, "variety.................")
            additionalArray.clear();
            if (variety.is_additional === true) {
            
               additionalArray.push(
                this.fb.group({
                  id: [variety.id],
                  variety_code: [variety.variety_code],
                  variety_name: [variety.variety_name],
                  new_tentative_quantity: [variety.quantity ?? 0],
                  additional_note: [variety.remarks ?? '']
                })
              );
              
            } else {
              const group = this.fb.group({
                id: [variety.id],
                variety_code: [variety.variety_code],
                variety_name: [variety.variety_name],
                total_seed_required: [variety.total_breeder_seed ?? 0],
                status_toggle: [variety.willingness ?? true],
                tentative_quantity: [variety.quantity ?? 0],
                replaceVariety: this.fb.array([])   // INNER ARRAY
              });

              const replaceArray = group.get('replaceVariety') as FormArray;
              replaceArray.clear();
              if (variety.replace_varieties?.length > 0) {
                variety.replace_varieties.forEach(rv => {
                  replaceArray.push(
                    this.fb.group({
                      id:[rv.id],
                      variety_code: [rv.replace_variety_code],
                      variety_name: [rv.replace_variety_name],
                      replace_tentative_qty: [rv.quantity]
                    })
                  );
                });
                if (!this.openCropIndexes.includes(index)) {
                  this.openCropIndexes.push(index);
                }
              }
              srpWillingnessArray.push(group);
            }
          });



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

  saveAsDraft() {
    const apiUrl = "srp-add-willingness";
    const formValues = this.ngForm.value;
    const existingData = formValues.bspc.map((row: any) => {

      const replaceArray = row.replaceVariety   // IMPORTANT FIX
      console.log(row.replaceVariety, "row.replaceVariety")
      const replaceData = replaceArray
        .filter((r: any) => r.variety_code)
        .map((r: any) => ({
          replace_variety_code: r.variety_code,
          quantity: Number(r.replace_tentative_qty)
        }));

      return {
        variety_code: row.variety_code,
        willingness: row.status_toggle,
        quantity: Number(row.tentative_quantity ?? 0),
        is_additional: false,
        remarks: null,
        replace_varieties: replaceData.length > 0 ? replaceData : null
      };
    });

    // new varieties added separately
    const newVarietyData = (formValues.newVarieties || [])
      .filter((row: any) => row.variety_code)
      .map((row: any) => ({
        variety_code: row.variety_code,
        willingness: true,
        quantity: Number(row.new_tentative_quantity ?? 0),
        is_additional: true,
        remarks: row.additional_note || null,
      }));




    const willingnessData = [...existingData, ...newVarietyData];

    const payload = {
      action: "draft",
      year: Number(formValues.year),
      season: formValues.season,
      crop_code: formValues.crop_code,
      willingnessData
    };

    console.log("Payload Sent:", payload);

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

  // Add inner row (replace variety)
  addInnerRow(i: number) {
    this.getInnerBspc(i).push(
      this.fb.group({
        id:[''],
        variety_code: [''],
        variety_name: [''],
        replace_tentative_qty: [0]
      })
    );
  }

  // Remove inner row
  // removeInnerRow(i: number, j: number) {
  //   this.getInnerBspc(i).removeAt(j);
    
  // }
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


  selectVariety(index: number, variety: any) {
    const control = this.newVarieties.at(index);
    control.patchValue({
      variety_code: variety.variety_code,
      variety_name: variety.variety_name,
    });
  }
  selectReplaceVariety(i: number, j: number, variety: any) {
    const control = this.getInnerBspc(i).at(j);
    console.log(control, "hellooo.....................")
    control.patchValue({
      variety_code: variety.variety_code,
      variety_name: variety.variety_name,
    });
  }
  createInnerRow(): FormGroup {
    return this.fb.group({
      variety_code: [''],
      variety_name: [''],
      replace_tentative_qty: [0]
    });
  }
  createNewVarietyRow(): FormGroup {
    return this.fb.group({
      id: [''],
      variety_code: [''],
      variety_name: [''],   // REQUIRED
      new_tentative_quantity: [0],
      additional_note: ['']
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.loadYear();
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
