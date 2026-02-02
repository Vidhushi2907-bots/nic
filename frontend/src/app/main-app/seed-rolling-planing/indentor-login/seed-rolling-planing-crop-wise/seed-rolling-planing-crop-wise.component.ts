import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { SeedRollingPlanningService } from 'src/app/services/seed-rolling-plan/seed-rolling-planning.service'
import { environment } from 'src/environments/environment';
import { checkDecimalValue, checkLength } from 'src/app/_helpers/utility';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from 'src/app/model/api-response.model';
@Component({
  selector: 'app-seed-rolling-planing-crop-wise',
  templateUrl: './seed-rolling-planing-crop-wise.component.html',
  styleUrls: ['./seed-rolling-planing-crop-wise.component.css']
})
export class SeedRollingPlaningCropWiseComponent implements OnInit {
  [x: string]: any;

  fileName = 'breeder-bsp-profarma-one.xlsx';

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup;
  baseUrl: string = environment.ms_nb_06_production_center.baseUrl;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  disableField: boolean = false
  is_update: boolean = false;
  isCrop: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryCropData: any;
  lastValidSRRValue: any;
  cropGroupList = [
    { id: 1, name: 'Cereals' },
    { id: 2, name: 'Pulses' },
    { id: 3, name: 'Oilseeds' },
    { id: 4, name: 'Vegetables' },
  ];
  srpCropWiseDataArray: { id: number; production_center: string; season: string; crop: string; variety_name: string; variety_code: string; bspc_developed_by: number; req_no_doc_moa: string; req_no_dept_moa: string; nucleus_seed_available: any; breeder_seed_available: any; total_target: string; }[];
  userId: any;
  srpCropWiseData: any;
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
  response_crop_group: any = [];
  response_crop_group_second: any;
  croupGroup: any;
  freezeData: boolean;
  showDataGrid = false;
  submittedData: any;
  cropList: any = [];
  srpcropList: any = [];
  srpCropWiseList: any[] = [];
  isSubmitting = false;
  isFinalSubmitted: boolean = false;
  isFinalSubmitButtonHide: boolean = false;
  autoSearchTimeout: any;
  lastValidSRR: any = [];
  // selectedGroup: string = '';
  originalCropList: any[] = [];
  originalCropListFinal: any[] = [];
  isDataChanged: boolean = false;
  // filteredCrops:any[]=[]
  cropForm!: FormGroup;
  constructor(private service: SeedServiceService, private _masterService: MasterService, private activeRoute: ActivatedRoute, private breeder: BreederService, private fb: FormBuilder, private route: Router, private cdRef: ChangeDetectorRef, private _productionCenter: ProductioncenterService, private master: MasterService, private srpService: SeedRollingPlanningService) {
    this.createForm();
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    this.userId = data.id;

    this.loadYears();
    this.loadSeasons();


    this.ngForm.get('global_search')?.valueChanges.subscribe(() => {
      this.triggerAutoSearch();
    })
    // Subscribe to group_code changes
    const groupControl = this.ngForm.get('group_code');
    if (groupControl) {
      groupControl.valueChanges.subscribe(() => {
        this.getPageData();
      });
    }
    this.ngForm.get('year')?.valueChanges.subscribe(year => {
      const season = this.ngForm.get('season')?.value;

      if (year && season) {
        this.getCroupCroupList(year, season);
      }
    });


    this.ngForm.get('season')?.valueChanges.subscribe(season => {
      const year = this.ngForm.get('year')?.value;
      if (year && season) {
        this.isCrop = false

        this.getCroupCroupList(year, season);
      }
    });
    const year = localStorage.getItem('year');
    const season = localStorage.getItem('season');
    this.activeRoute.paramMap.subscribe(params => {
      const isLockedParam = params.get('isLocked'); // 'true' | 'false'
      const isLocked = isLockedParam === 'true';    // boolean
      // console.log(isLocked, 'IS LOCKED');
      if (isLocked) {
        this.ngForm.patchValue({
          year: year,
          season: season
        });
        this.searchData();
      }
    });

  }

  createForm() {
    this.ngForm = this.fb.group({
      year: [''],
      season: [''],
      group_code: [''], // add this so dropdown works
      global_search: [''],
      srpCropWise: this.fb.array([]),
      srpCropWiseFinal: this.fb.array([]),
    });

    this.ngForm.controls['season'].disable();

    // ✅ Sirf year select hone par season enable hoga
    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['season'].enable();
        this.isCrop = false;
        this.srpCropWise.clear();

      }
    });

    this.srpCropWiseData = this.breeder.redirectData;

    if (this.srpCropWiseData?.year && this.srpCropWiseData?.season) {
      this.ngForm.controls['year'].patchValue(this.srpCropWiseData.year);
      this.ngForm.controls['season'].patchValue(this.srpCropWiseData.season);
      this.searchData();
    }

  }
  get srpCropWiseFinal(): FormArray {
    return this.ngForm.get('srpCropWiseFinal') as FormArray;
  }

  srpCropWiseFinalArray(): FormGroup {
    return this.fb.group({
      crop_name: [''],
      crop_code: [''],
      srr: [''],
      total_area: [''],
      total_required: [''],
      id: [''],
      seed_rate: [''],
      is_active: [''],
      is_draft: [''],
      is_final_submit: []
    })
  }

  searchData() {
    const year = this.ngForm.get('year')?.value;
    const season = this.ngForm.get('season')?.value;

    if (year && season) {
      localStorage.setItem('year', year);
      localStorage.setItem('season', season);
    }

    // reset search related fields
    this.ngForm.patchValue({
      global_search: '',
      group_code: '',
    });

    // Hide crop card
    this.isCrop = false;
    if (this.srpCropWise && this.srpCropWise.clear) {
      this.srpCropWise.clear();
    }

    // add to list seprate grid 
    // this.addToListData();
    this.addToListData();
    // reload data
    this.getPageData();
  }

  async triggerAutoSearch() {
    clearTimeout(this.autoSearchTimeout);
    this.autoSearchTimeout = setTimeout(() => {
      this.applyLocalFilter()
    }, 400); // delay 0.4 sec
  }

  applyLocalFilter() {
    if (!this.srpCropWise) return;

    const searchText = String(this.ngForm.get('global_search')?.value || '')
      .trim()
      .toLowerCase();

    if (!searchText) {
      this.originalCropList = this.srpCropWise.controls;
      this.addToListData()
      return;
    }

    this.originalCropList = this.srpCropWise.controls.filter(ctrl => {
      const values = [
        ctrl.get('crop_name')?.value,
        ctrl.get('srr')?.value,
        ctrl.get('total_area')?.value,
        ctrl.get('total_required')?.value,
        ctrl.get('seed_rate')?.value,
        ctrl.get('is_active')?.value ? 1 : 0
      ];
      // console.log(values.some(v =>
      //   String(v || '').toLowerCase().includes(searchText)
      // ), "value.................................")
      return values.some(v =>
        String(v || '').toLowerCase().includes(searchText)
      );
    });

    this.srpCropWiseFinal.controls = this.srpCropWiseFinal.controls.filter(ctrl => {
      const values = [
        ctrl.get('crop_name')?.value,
        ctrl.get('srr')?.value,
        ctrl.get('total_area')?.value,
        ctrl.get('total_required')?.value,
        ctrl.get('seed_rate')?.value,
        ctrl.get('is_active')?.value ? 1 : 0
      ];
      // console.log(values.some(v =>
      //   String(v || '').toLowerCase().includes(searchText)
      // ), "value.................................")
      return values.some(v =>
        String(v || '').toLowerCase().includes(searchText)
      );
    });
  }

  //get crop code
  getCropCode(i: number) {
    return (this.ngForm.get('srpCropWise') as FormArray).at(i).get('crop_code').value;
  }

  //crop id
  getCropId(i: number) {
    return (this.ngForm.get('srpCropWise') as FormArray)
      .at(i)
      .get('id')?.value;
  }

  //year list
  loadYears() {
    const apiUrl = 'get-year-list'
    this.srpService.getRequestCreatorNew(apiUrl).subscribe({
      next: (data: any) => {

        if (
          data &&
          data.EncryptedResponse &&
          data.EncryptedResponse.data &&
          data.EncryptedResponse.status_code === 200
        ) {
          this.inventoryYearData = data.EncryptedResponse.data;

          // Optional: filter only active years
          this.inventoryYearData = this.inventoryYearData.filter(
            (y: any) => y.is_active
          );

          // Optional: sort years descending
          this.inventoryYearData.sort((a: any, b: any) => b.year - a.year);

          // console.log('✅ Year list loaded:', this.inventoryYearData);
        } else {
          // console.warn('⚠️ No valid data received in EncryptedResponse');
          this.inventoryYearData = [];
        }
      },
      error: (err) => {
        // console.error('❌ Error fetching years:', err);
      },
    });
  }

  //season list
  loadSeasons() {
    const apiUrl = 'get-season-list'; // 👈 your actual API endpoint

    this.srpService.getRequestCreatorNew(apiUrl).subscribe({
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
          this.inventorySeasonData = [];
        }
      },
      error: (err) => {
        console.error('❌ Error fetching seasons:', err);
      },
    });
  }

  onRowChange() {

    this.isDataChanged = true;
    // console.log("isDataChanged........", this.isDataChanged)
  }

  get srpCropWise(): FormArray {
    return this.ngForm.get('srpCropWise') as FormArray;
  }

  async saveAsDraft() {
    const apiUrl = "add-srp-crop-wise";
    const formValues = this.ngForm.value;

    const srpCropWiseArray = Array.isArray(formValues.srpCropWise)
      ? formValues.srpCropWise
      : [];

    const cropData = srpCropWiseArray
      .map((crop: any) => ({
        ...crop,
        srr: String(crop.srr ?? '0'),
        total_required: Number(crop.total_required ?? 0),
        total_area: Number(crop.total_area ?? 0),
        seed_rate: Number(crop.seed_rate ?? 0)
      }))
      .filter((crop: any) => {

        return (
          crop.crop_code && crop.total_area && String(crop.srr) && crop.seed_rate
        );
      })
      .map((crop: any) => {
        const cleanCrop: any = {};
        if (crop.id) cleanCrop.id = crop.id;
        if (crop.crop_code) cleanCrop.crop_code = crop.crop_code;
        if (crop.group_code) cleanCrop.group_code = crop.group_code;
        if (formValues.year) cleanCrop.year = parseInt(formValues.year);
        if (formValues.season) cleanCrop.season = formValues.season;
        if (crop.is_active !== undefined) cleanCrop.is_active = crop.is_active;
        if (crop.total_required) cleanCrop.total_required = crop.total_required ?? 0;
        if (crop.total_area) cleanCrop.total_area = crop.total_area ?? 0;
        if (crop.srr) cleanCrop.srr = crop.srr ?? '0';
        if (crop.seed_rate) cleanCrop.seed_rate = crop.seed_rate ?? 0;

        return cleanCrop;
      });

    const invalidSrr = cropData.find(crop => crop.srr > 100);
    if (invalidSrr) {
      Swal.fire({
        title: '<p style="font-size:20px;">Error: SRR cannot be greater than 100!</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15',
      });
      this.isSubmitting = false;
      return;
    }

    if (!cropData.length) {
      Swal.fire({
        title: '<p style="font-size:20px;">No valid data to save.</p>',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#B64B1D',
      });
      return;
    }

    const payload = { action: "draft", cropData };
    // console.log("Payload Sent:", payload);
    this.srpService.postRequestCreator(apiUrl, null, payload).subscribe({
      next: (data: any) => {
        // console.log("API Response:", data);
        if (data?.EncryptedResponse?.status_code === 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Add to List successfully.</p>',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#B64B1D',
          }).then((result) => {
            if (result.isConfirmed) {
              this.isDataChanged = true;
              this.srpCropWiseFinal.clear();
              this.addToListData();
              this.getPageData();
              this.ngForm.get('global_search')?.reset();
            }
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

  async getPageData() {
    try {
      if (!this.ngForm || !this.ngForm.controls) {
        Swal.fire({
          icon: "error",
          title: "Form not initialized properly!",
          text: "Please check your form setup.",
          position: "center",
          showConfirmButton: true,
        });
        return;
      }

      const year = this.ngForm.controls['year']?.value;
      const season = this.ngForm.controls['season']?.value;
      const group_code = this.ngForm.controls['group_code']?.value;

      if (!year || !season) {
        Swal.fire({
          toast: false,
          icon: "warning",
          title: "Please Select All Required Fields",
          position: "center",
          showConfirmButton: true,
        });
        return;
      }

      this.isCrop = true;
      // if (this.isDataChanged) {
      //   const confirmChange = await Swal.fire({
      //     toast: false,
      //     icon: "warning",
      //     title: "Your data has not been saved. Changing the crop group will reset the data. Do you want to continue?",
      //     position: "center",
      //     showCancelButton: true,
      //     confirmButtonText: 'OK',
      //     cancelButtonText: 'Cancel',
      //   });

      //   if (!confirmChange.isConfirmed) {
      //     return;
      //   }
      // }

      this.isDataChanged = false;
      let apiUrl = `get-srp-crop-wise?year=${year}&season=${season}`;
      if (group_code) {
        apiUrl += `&group_code=${group_code}`;
      }

      this.srpService.getPlansInfo(apiUrl)
        .then((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code === 200) {
            let fetchedData = data.EncryptedResponse.data || [];

            const isFinalSubmit = fetchedData.some(item => item.is_final_submit === true);
            this.srpCropWiseList = isFinalSubmit
              ? fetchedData.filter(item => item.is_final_submit === true)
              : fetchedData;

            this.disableField = isFinalSubmit;
            this.isFinalSubmitButtonHide = isFinalSubmit;
            // console.log('isFinalSubmit ',isFinalSubmit)
            const srpCropWiseArray = this.ngForm.get('srpCropWise') as FormArray;

            if (srpCropWiseArray) {
              srpCropWiseArray.clear();

              this.srpCropWiseList.forEach((crop: any) => {
                srpCropWiseArray.push(
                  this.fb.group({
                    id: [crop.id],
                    crop_code: [crop.crop_code],
                    crop_name: [crop.crop_name],
                    group_code: [crop.group_code],
                    total_area: [crop.total_area ?? 0],
                    seed_rate: [crop.seed_rate ?? 0],
                    srr: String([crop.srr]),
                    total_required: ([crop.total_required]),
                    is_active: [false],
                    is_draft: [crop.is_draft],
                    is_final_submit: [crop.is_final_submit],
                  })
                );
              });
            }
          } else {
            this.srpCropWiseList = [];

          }
        })
        .catch((error: any) => {
          console.error("❌ Error:", error);
          this.srpCropWiseList = [];
        });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "An unexpected error occurred while loading crop data.",
        position: "center",
        showConfirmButton: true,
      });
    }
  }

  async finalizeData() {
    if (this.isSubmitting) return; // prevent multiple clicks
    this.isSubmitting = true;
    const apiUrl = "add-srp-crop-wise";
    const formValues = this.ngForm.value;
    const year = formValues.year;
    const season = formValues.season;
    const srpCropWiseArray = Array.isArray(formValues.srpCropWise)
      ? formValues.srpCropWise
      : [];
    const activeCropsToSubmit = srpCropWiseArray.filter(item => item.is_active);
    const cropData = activeCropsToSubmit
      .filter((crop: any) => crop.crop_code && crop.total_area && crop.srr && crop.seed_rate)
      .map((crop: any) => {
        const cleanCrop: any = {};
        if (crop.id) cleanCrop.id = crop.id;
        if (crop.crop_code) cleanCrop.crop_code = crop.crop_code;
        if (crop.crop_name) cleanCrop.crop_name = crop.crop_name;
        cleanCrop.group_code = crop.group_code;
        if (formValues.year) cleanCrop.year = parseInt(formValues.year);
        if (formValues.season) cleanCrop.season = formValues.season;
        if (crop.is_active !== undefined) cleanCrop.is_active = crop.is_active;
        cleanCrop.total_required = crop.total_required;
        if (crop.total_area) cleanCrop.total_area = crop.total_area;
        if (crop.srr) cleanCrop.srr = crop.srr;
        if (crop.seed_rate) cleanCrop.seed_rate = crop.seed_rate;
        return cleanCrop;
      });

    const invalidSrr = cropData.find(crop => crop.srr > 100);
    if (invalidSrr) {
      Swal.fire({
        title: '<p style="font-size:20px;">Error: SRR cannot be greater than 100!</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15',
      });
      this.isSubmitting = false;
      return;
    }
    if (!cropData.length) {
      Swal.fire({
        title: '<p style="font-size:20px;">No valid data to submit.</p>',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#B64B1D',
      });
      this.isSubmitting = false;
      return;
    }

    const gridHtml = `
  <div style="max-height: 300px; overflow-y: auto; border: 1px solid #ccc; border-radius: 6px; margin-top: 10px;">
    <table style="width:100%; border-collapse: collapse; font-size:14px;">
      <thead style="background:#f5f5f5; position: sticky; top: 0;">
        <tr>
          <th style="border:1px solid #ccc; padding:6px;">S/N</th>
          <th style="border:1px solid #ccc; padding:6px;">Crop Name</th>
          <th style="border:1px solid #ccc; padding:6px;">Total Area (in Ha)</th>
          <th style="border:1px solid #ccc; padding:6px;">Seed Rate (Qt./Ha)</th>
          <th style="border:1px solid #ccc; padding:6px;">SRR</th>
          <th style="border:1px solid #ccc; padding:6px;">Total Required</th>
        </tr>
      </thead>
      <tbody>
        ${cropData
        .map(
          (crop: any, index: number) => `
          <tr>
            <td style="border:1px solid #ccc; padding:6px;">${index + 1}</td>
            <td style="border:1px solid #ccc; padding:6px;">${crop.crop_name}</td>
            <td style="border:1px solid #ccc; padding:6px;">${crop.total_area ?? '-'}</td>
            <td style="border:1px solid #ccc; padding:6px;">${crop.seed_rate ?? '-'}</td>
            <td style="border:1px solid #ccc; padding:6px;">${crop.srr ?? '-'}</td>
            <td style="border:1px solid #ccc; padding:6px;">${crop.total_required ?? '-'}</td>
          </tr>`
        )
        .join('')}
      </tbody>
    </table>
  </div>`;

    Swal.fire({
      title: 'Confirm Final Submission',
      html: gridHtml,
      width: 800,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#B64B1D',
      allowOutsideClick: false,
    }).then((gridResult) => {
      if (gridResult.isConfirmed) {
        Swal.fire({
          title: 'Are you sure?',
          text: "Once submitted, you won't be able to edit this data!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Submit it!',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#E97E15',
        }).then((confirmResult) => {
          if (confirmResult.isConfirmed) {
            const payload = {
              action: "final",
              cropData: cropData,
            };

            this.srpService.postRequestCreator(apiUrl, null, payload).subscribe({
              next: (data: any) => {
                // console.log("🔹 Final Submit API Response:", data);
                this.isSubmitting = false;

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
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.isFinalSubmitButtonHide = true

                      // this.isDataChanged = false;
                      this.getPageData();
                      this.addToListData();
                      this.getCroupCroupList(year, season);
                      this.ngForm.get('global_search')?.reset();
                    }
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
              error: (err) => {
                console.error("❌ Error in final submit:", err);
                this.isSubmitting = false;
                Swal.fire({
                  title: '<p style="font-size:22px;">Server Error! Please try again.</p>',
                  icon: 'error',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#E97E15',
                });
              },
            });
          } else {
            this.isSubmitting = false;
          }
        });
      } else {
        this.isSubmitting = false;
      }
    });
  }

  async getCroupCroupList(year: any, season: any) {
    // const route1 = `get-srp-crop-group-wise?year=${year}&season=${season}`;
    const route1 = `get-srp-crop-group-wise?year=${year}&season=${season}`;
    this.srpService.getPlansInfo(route1).then((data: any) => {
      this.response_crop_group = data['EncryptedResponse'].data
    })
  }

  srrValidation(event: any, index: any) {
    const bspcArray = this.ngForm.get('srpCropWise') as FormArray;
    const srrControl = bspcArray.at(index).get('srr');
    // console.log(srrControl, "step:1")
    const input = event.target as HTMLInputElement;
    const currentValue = input.value + event.key;
    const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
    if (!regex.test(currentValue) || (event.key === '.' && input.value.includes('.'))) {
      event.preventDefault();
    }

    const SRRTargetbySTATE = parseFloat(input.value);

    if (SRRTargetbySTATE > 100) {
      Swal.fire({
        title: '<p style="font-size:25px;">Error: SRR Target must be 100 or less.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      event.preventDefault();
    }
    return;
  }

  trackById(index: number, group: FormGroup) {
    return group.get('id')?.value || index;
  }

  calculateTotalSeed(rowGroup: FormGroup) {

    if (!rowGroup) return;

    const seed_rate = Number(rowGroup.get('seed_rate')?.value || 0);
    const total_area = Number(rowGroup.get('total_area')?.value || 0);
    const srr_value = Number(rowGroup.get('srr')?.value || 0);

    // console.log(seed_rate, total_area, srr_value, "seed_rate * total_area * (srr_value / 100)");

    let total = seed_rate * total_area * (srr_value / 100);
    // console.log(total, "total")
    rowGroup.get('total_required')
      ?.setValue(total.toFixed(2), { emitEvent: false });
    // rowGroup.get('total_required')?.valueChanges.subscribe(value => {
    //   const isActiveCtrl = rowGroup.get('is_active');

    //   if (value && Number(value) > 0) {
    //     isActiveCtrl?.setValue(true, { emitEvent: false });
    //   } else {
    //     isActiveCtrl?.setValue(false, { emitEvent: false });
    //   }
    // });
    // checkbox auto check/uncheck based on total
    rowGroup.get('is_active')
      ?.setValue(total > 0, { emitEvent: false });
    this.updateTotalSeedRequired();
  }

  updateTotalSeedRequired() {
    const srpCropWiseArray = this.ngForm.get('srpCropWise') as FormArray;
    this.totalSeedRequired = srpCropWiseArray.controls.reduce((sum, control) => {
      const rowGroup = control as FormGroup;
      const value = Number(rowGroup.get('total_required')?.value) || 0;
      return sum + value;
    }, 0);
  }

  srpCropWiseCreateForm(): FormGroup {
    return this.fb.group({
      seed_rate: [''],
      total_area: [''],
      srr: [''],
      total_required: [''],
      group_code: ['']

    })
  }

  onCropClick(index: number) {
    const year = this.ngForm.get('year')?.value;
    const season = this.ngForm.get('season')?.value;

    if (
      year &&
      season &&
      localStorage.getItem('year') !== year
    ) {
      localStorage.setItem('year', year);
      localStorage.setItem('season', season);
      localStorage.setItem('isLocked', 'true');
    }
  }

  openpopup() {
    this.displayStyle = 'block'
  }

  close() {
    this.displayStyle = 'none'
  }

  // Cancel Button
  revertDataCancelation() {
    this.ngForm.controls['year'].reset('');
    this.ngForm.controls['season'].reset('');
    this.srpCropWise.clear();
    this.ngForm.controls['srpCropWise'].reset;
    this.isCrop = false
    this.ngForm.controls['srpCropWise'].enable();
  }

  finalSubmit() {
    // console.log("final submit");
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
      if ((this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_available'].value >= 0) && (this.ngForm.controls['bspc']['controls'][i].controls['nucleus_seed_available'].value > 0))
        this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
      else
        this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].disable();
    }
  }

  async addToListData() {
    try {
      let route = "add-to-list-data";
      let param = {
        "search": {
          "year": this.ngForm.controls['year']?.value,
          "season": this.ngForm.controls['season']?.value,
          "group_code": this.ngForm.controls['group_code']?.value
        }
      }

      this.srpService.postRequestCreator(route, null, param).subscribe(res => {
        let addToListData = [];
        this.srpCropWiseFinal.clear(); // important
        if (res.EncryptedResponse.status_code === 200) {
          addToListData = res.EncryptedResponse.data
          this.srpCropWiseFinal.clear(); // important
          this.isFinalSubmitButtonHide = addToListData.some(item => !item.is_final_submit);
          addToListData.forEach(item => {
            this.srpCropWiseFinal.push(
              this.fb.group({
                crop_name: [item.crop_name || ''],
                crop_code: [item.crop_code || ''],
                srr: [item.srr || ''],
                total_area: [item.total_area || ''],
                seed_rate: [item.seed_rate || ''],
                total_required: [item.total_required || ''],
                id: [item.id || null],
                is_active: [item.is_active ?? true],
                is_draft: [item.is_draft ?? false],
                is_final_submit: [item.is_final_submit]
              })
            );
          });
        }
      })
      // console.log("hiiii", this.ngForm.controls["srpCropWiseFinal"]["controls"]);
    } catch (error) {
      // console.log(error);
    }
  }

  addSrpData() {
    this.srpCropWiseFinal.push(this.srpCropWiseCreateForm());
  }

  removeData(id) {
    let route = "add-to-list-data-remove";
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        this.srpService.getRequestCreatorNew(route + '?' + 'id' + '=' + id).subscribe((res: ApiResponse) => {
         if(res.EncryptedResponse.status_code==200){
          this.addToListData();
          this.srpCropWiseFinal.clear();
         }
        })
      }
       this.getPageData()
    });
  }

  finalizeDataSubmit() {

    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
        let route = "submit-for-filling-variety-data";
        const ids = this.srpCropWiseFinal.controls
          .filter(fg => fg.get('id')?.value)
          .map(fg => fg.get('id')?.value);

        if (!ids.length) return;

        const finalData = {
          ids // [1,2,3,4]  
        };
        this.srpService.postRequestCreator(route, null, finalData)
          .subscribe({
            next: () => {
              this.srpCropWiseFinal.controls.forEach(fg => {
                fg.patchValue({
                  is_final_submit: true,
                  is_draft: true
                });
                // fg.disable();
                 this.srpCropWiseFinal.clear();
                 this.addToListData();
              });
            }
          });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });

  }
}
