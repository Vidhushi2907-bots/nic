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
  isFinalSubmitButtonHide: boolean;
  autoSearchTimeout: any
  // selectedGroup: string = '';
  // originalCropList: any[] = [];
  // filteredCrops:any[]=[]
  constructor(private service: SeedServiceService, private _masterService: MasterService, private breeder: BreederService, private fb: FormBuilder, private route: Router, private cdRef: ChangeDetectorRef, private _productionCenter: ProductioncenterService, private master: MasterService, private srpService: SeedRollingPlanningService) {
    this.createForm();
    this.srpCropWiseData = this.breeder.redirectData;
    if (this.srpCropWiseData && this.srpCropWiseData !== undefined) {
      if (this.srpCropWiseData.year && this.srpCropWiseData.season) {
        this.ngForm.controls['year'].patchValue(this.srpCropWiseData.year);
        this.ngForm.controls['season'].patchValue(this.srpCropWiseData.season);
        this.searchData()
        // this.getPageData();
      }
    }
  }

  createForm() {
    this.ngForm = this.fb.group({
      id: [''],
      year: [''],
      season: [''],
    });

    this.ngForm.controls['season'].enable();
    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {

        this.ngForm.controls['season'].enable();
        this.isCrop = false;
        this.srpCropWise.clear();

      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {

        this.srpCropWise.clear();
        this.isCrop = false;

        // Reset search when year changes


      }
    });
    this.getCroupCroupList()
  }


  searchData() {
    // Reset form fields
    this.ngForm.patchValue({
      global_search: '',
      group_code: '',
    });

    // Hide crop card
    this.isCrop = false;

    // Clear cropWise array/list if exists
    if (this.srpCropWise && this.srpCropWise.clear) {
      this.srpCropWise.clear();
    }
    // NOW Reload fresh data
    this.getPageData();
  }

  async triggerAutoSearch() {
    clearTimeout(this.autoSearchTimeout);

    this.autoSearchTimeout = setTimeout(() => {
      this.getPageData();  // automatically fire your API function
    }, 400); // delay 0.4 sec
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

          console.log('✅ Year list loaded:', this.inventoryYearData);
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
          console.log(this.inventorySeasonData, "chbsdcffvswvswv")
          // ✅ Optional: filter only active seasons


          console.log('✅ Season list loaded:', this.inventorySeasonData);
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

    console.log("Filtered cropData:", cropData);

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
          }).then(() => this.getPageData());
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

      const searchKeyword = String(this.ngForm.get('global_search')?.value || '').trim().toLowerCase();
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

            if (searchKeyword) {
              this.srpCropWiseList = this.srpCropWiseList.filter(item =>
                String(item.crop_name || '').toLowerCase().includes(searchKeyword) ||
                String(item.srr || '').toLowerCase().includes(searchKeyword) ||
                String(item.total_area || '').toLowerCase().includes(searchKeyword) ||
                String(item.total_required || '').toLowerCase().includes(searchKeyword) ||
                String(item.seed_rate || '').toLowerCase().includes(searchKeyword)
              );
            }

            this.disableField = isFinalSubmit;
            this.isFinalSubmitButtonHide = isFinalSubmit;
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
                    is_active: [crop.is_active],
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
          <th style="border:1px solid #ccc; padding:6px;">Total Area</th>
          <th style="border:1px solid #ccc; padding:6px;">Seed Rate</th>
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
                console.log("🔹 Final Submit API Response:", data);
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
                  }).then(() => {

                    this.isFinalSubmitButtonHide = true
                    this.getPageData();

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

  async getCroupCroupList() {
    const route = "crop-group";
    const result = this.service.getPlansInfo(route).then((data: any) => {
      this.response_crop_group = data['EncryptedResponse'].data;
      this.response_crop_group_second = this.response_crop_group
      console.log(data['EncryptedResponse'].data, 'ddddddddd', this.response_crop_group)
    })

  }

  // getCroupCroupList(year1: number, season: string) {
  //   if (!year1 || !season) {
  //     this.response_crop_group = [];
  //     this.response_crop_group_second = [];
  //     return;
  //   }

  //   let apiUrl = `get-srp-crop-group-wise?year=${year1}&season=${season}`;

  //   this.srpService.getPlansInfo(apiUrl)
  //     .then((data: any) => {
  //       if (
  //         data &&
  //         data.EncryptedResponse &&
  //         data.EncryptedResponse.status_code === 200
  //       ) {
  //         this.response_crop_group = data.EncryptedResponse.data || [];
  //         console.log(this.response_crop_group, "status")
  //         this.response_crop_group_second = [...this.response_crop_group];
  //       } else {
  //         this.response_crop_group = [];
  //         this.response_crop_group_second = [];
  //       }
  //     })
  //     .catch((error: any) => {
  //       console.error("❌ Error:", error);
  //       this.response_crop_group = [];
  //       this.response_crop_group_second = [];
  //     });
  // }
  calculateTotalSeed(i: number) {
    const srpCropWiseArray = this.ngForm.get('srpCropWise') as FormArray;

    if (!srpCropWiseArray || !srpCropWiseArray.at(i)) return;

    const rowGroup = srpCropWiseArray.at(i) as FormGroup;
    const seed_rate = rowGroup.get('seed_rate')?.value || 0;

    const total_area = rowGroup.get('total_area')?.value || 0;
    const srr_value = rowGroup.get('srr')?.value || 0;

    const total = seed_rate * total_area * (srr_value / 100);

    // set calculated value back in the same row
    rowGroup.get('total_required')?.setValue(total.toFixed(2), { emitEvent: false });
    this.updateTotalSeedRequired();
    console.log('Index:', i, 'Total Seed Required:', total);
  }

  //Total Seed Required 
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
  //cropGroupId
  cgClick() {
    document.getElementById('group_code').click();
  }

  // your existing form array
  ngOnInit(): void {
    // Initialize form first
    this.ngForm = this.fb.group({
      year: [''],
      season: [''],
      group_code: [''], // add this so dropdown works
      global_search: [''],
      srpCropWise: this.fb.array([]),
    });
    this.ngForm.get('global_search')?.valueChanges.subscribe(() => {
      this.triggerAutoSearch();
    })
    // Subscribe to group_code changes
    const groupControl = this.ngForm.get('group_code');
    if (groupControl) {
      groupControl.valueChanges.subscribe(() => {
        this.getPageData(); // reload data automatically when dropdown changes
      });
    }

    // Load years and seasons for dropdowns
    this.loadYears();
    this.loadSeasons();
  }

  openpopup() {
    this.displayStyle = 'block'
  }

  close() {
    this.displayStyle = 'none'
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
    this.ngForm.controls['year'].reset('');
    this.ngForm.controls['season'].reset('');
    this.srpCropWise.clear();
    this.ngForm.controls['srpCropWise'].reset;
    this.isCrop = false
    this.ngForm.controls['srpCropWise'].enable();

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
      if ((this.ngForm.controls['bspc']['controls'][i].controls['breeder_seed_available'].value >= 0) && (this.ngForm.controls['bspc']['controls'][i].controls['nucleus_seed_available'].value > 0))
        this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].enable();
      else
        this.ngForm.controls['bspc']['controls'][i].controls['target_qunatity'].disable();
    }
  }

}
