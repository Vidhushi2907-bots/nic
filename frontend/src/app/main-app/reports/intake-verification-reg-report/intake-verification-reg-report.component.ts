 
import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { MasterService } from 'src/app/services/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { BspThirdComponent } from '../../bsp-third/bsp-third.component';
// import { BspThirdComponent } from

@Component({
  selector: 'app-intake-verification-reg-report',
  templateUrl: './intake-verification-reg-report.component.html',
  styleUrls: ['./intake-verification-reg-report.component.css']
})
export class IntakeVerificationRegReportComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  @ViewChild(BspThirdComponent) BspThirdComponent!: BspThirdComponent; 
   
  ngForm!: FormGroup
  
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  is_update: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  varietyList = [];
  cropData: any[] = [];
  varietyData: any[] = [];
  allDirectIndentsData: any[] = [];
  submitted = false;
  dataId: any;
  authUserId: any;
  selectCrop: any;
  croplistSecond: any[];
  selectVariety: any;
  varietyListSecond: any[];
  bspProformaData: any[] = [];
  yearData: any[];
  seasonData: any[];
  districtData: { district_name: string, district_code: string }[] = [];
  stateData: any[] = [];
  isSearchClicked = false;
  isBsp3dataReceived: boolean = false;
  selectedVarieties: any[] = [];
  isReportDownload = false;
  allInspected = false;
  varietyOptions = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    // Add more options as needed
  ];
  responseData = [];
  isReportDownloadSecond: boolean;
  count = 0;
  encryptedData: string;
  user_id: any;
  isRemonitorData = false;
  productionType: string;
  isDisableNormalReallocate: boolean;
  isDisableDelay: boolean;
  isDisableNormal: boolean;
  report_type: any;
  constructor(private service: SeedServiceService, private breeder: BreederService, private masterService: MasterService, private productioncenter: ProductioncenterService, private fb: FormBuilder, private router: Router) {
    this.createForm();
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const datas = JSON.parse(BHTCurrentUser);
    this.user_id = datas.id;

  }

  toggleVarietySelection(item: any): void {
    const selectedVarieties = this.ngForm.get('selectedVarieties');
    const index = selectedVarieties.value.indexOf(item);

    if (index === -1) {
      selectedVarieties.patchValue([...selectedVarieties.value, item]);
    } else {
      selectedVarieties.value.splice(index, 1);
      selectedVarieties.patchValue([...selectedVarieties.value]);
    }
  }

  // Check if a variety is selected
  isVarietySelected(item: any): boolean {
    const selectedVarieties = this.ngForm.get('selectedVarieties');
    return selectedVarieties.value.includes(item);
  }

  // Method to handle closing the dropdown
  closeDropdown(): void {
    // Add any additional logic you need when the dropdown is closed
  }

  ngOnInit(): void {
    this.dropdownSettings = {
      idField: 'variety_code',
      textField: 'variety_name',
      // enableCheckAll: false,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      enableCheckAll: true,
    };
    this.ngForm.controls['season'].disable();
    // this.getPageData();
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    this.authUserId = data.id;
    // this.getYearData();
    this.service.bsp3rdReportData = [];
    let datas = this.service.bsp3rdReportData2;
    console.log(datas, 'datasdatas')
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: [''], 
      variety_text: [''],
      crop_text: [''],
    });

    // this.ngForm.controls['crop_text'].valueChanges.subscribe(item => {
    //   if (item) {
    //     this.cropData = this.croplistSecond
    //     let response = this.cropData.filter(x => x.crop_name.toLowerCase().includes(item.toLowerCase()))
    //     this.cropData = response
    //   }
    //   else {
    //     this.getCropData(null)
    //   }
    // })

    this.ngForm.controls['variety_text'].valueChanges.subscribe(item => {
      if (item) {
        this.varietyData = this.varietyListSecond;
        let response = this.varietyData.filter(x =>
          x.variety_name.toLowerCase().includes(item.toLowerCase()));
        this.varietyData = response
      }
      else {
        this.getVarietyData();
      }
    })

    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      this.ngForm.controls['crop'].reset('');
      this.ngForm.controls['season'].reset('');
      this.ngForm.controls['variety'].reset('');
      this.selectCrop = '';
      if (newvalue) {
        this.ngForm.controls['season'].enable();
        this.getSeasonData();
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['crop'].reset('');
        this.selectCrop = '';
        this.ngForm.controls['crop'].enable();
        this.getCropData(null);
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      this.selectVariety = '';
      if (newvalue) {
        this.ngForm.controls['variety'].enable();
        this.getVarietyData();
      }
    });

    this.ngForm.controls['variety'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.getPageData();
      }
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(item => {
      console.log('Current input:', item); // Log current input
    
      if (item) {
        console.log('Filtering with:', item); // Log filter trigger
    
        this.cropData = this.croplistSecond.filter(x => {
          // Ensure m_crop and crop_name exist before accessing them
          const cropName = x.m_crop && x.m_crop.crop_name ? x.m_crop.crop_name.toLowerCase().trim() : ''; 
          const includes = cropName.includes(item.toLowerCase().trim()); // Check for inclusion
          console.log(`Checking "${cropName}" against "${item.toLowerCase().trim()}": ${includes}`); // Log check results
          return includes; // Return true if it matches
        });
    
        console.log('Filtered Crop Data:', this.cropData); // Log the filtered result
      } else {
        this.getCropData(this.ngForm.controls['season'].value); // Fetch crop data if input is empty
      }
    });
    
    
  }

  formatedDate(dateString: string): string {
    if (!dateString) return 'NA';
    const date = new Date(dateString);
    const year = date.getFullYear() % 100;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  crop(item: any) {
    this.selectCrop = item && item.m_crop.crop_name ? item.m_crop.crop_name : ''
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropData = this.croplistSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
  } 

  variety(item: any) {
    this.selectVariety = item && item.m_crop_variety.variety_name ? item.m_crop_variety.variety_name : '',
      this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    this.varietyData = this.varietyListSecond;
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
  }

  searchData() {
    this.submitted = true;
    if (this.ngForm.invalid) {
      return;
    }
    this.isSearchClicked = true;
    this.getPageData()
  }

  vClick() {
    document.getElementById('variety').click();
  }

  cClick() {
    document.getElementById('crop').click();
  }

  getYearData() {
    const route = "bsp-proforma3-year-report";
    const param = {
      "user_id": this.authUserId,
      "form_type":'report_3',
      production_type: this.productionType ,
      "report_type": 'intake-report'

    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.status === 200) {
        this.yearData = data && data.data ? data.data : '';
      }
    })
  }

  getSeasonData() {
    const route = "bsp-proforma3-season-report";
    const param = {
      "user_id": this.authUserId,
      "year": this.ngForm.controls['year'].value,
      "form_type":'report_3',
      production_type: this.productionType ,
      "report_type": 'intake-report'
    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.status === 200) {
        this.seasonData = data && data.data ? data.data : '';
      }
    })
  }
  
  getCropData(newData) {
    const route = "get-crop-data-report";
    const param = {
      user_id: this.authUserId,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value?this.ngForm.controls['season'].value:newData?newData:'',
      "form_type":'report_3',
      production_type: this.productionType ,
      "report_type": 'intake-report'
    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.status === 200) {
        this.cropData = data && data.data ? data.data : [];
        this.croplistSecond = [...this.cropData]; // Spread operator to ensure a new array
        console.log('Crop List Second:', this.croplistSecond); // Log after assignment
      }
    });
  }

  getVarietyData() {
    this.ngForm.controls['variety'].patchValue('');
    const route = "get-variety-data";
    const param = {
      "user_id": this.authUserId,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.status === 200) {
        this.varietyData = data && data.data ? data.data : '';
        if (
          this.varietyData && this.varietyData.length > 0
        ) {
          let response = this.varietyData.forEach(item => {
            item.variety_name = item && item.m_crop_variety.variety_name ?
              item.m_crop_variety.variety_name : ''
          })
        }
        this.varietyListSecond = this.varietyData;
      }
    })
  }
  selcetAll(event) {
    if (event && event.length > 0) {
      this.ngForm.controls["variety"].patchValue(event);
      this.getPageData();
    }
  }


  productionTypeValue(value) {
    if (value) {
      this.productionType = value;
      if (this.productionType == "NORMAL") {
        this.isDisableNormal = false;
        this.isDisableDelay = true;
        this.isDisableNormalReallocate = true;
      } else if (this.productionType == "DELAY") {
        this.isDisableNormal = true;
        this.isDisableDelay = false;
        this.isDisableNormalReallocate = true;
      } else if (this.productionType == "REALLOCATION") {
        this.isDisableNormal = true;
        this.isDisableDelay = true;
        this.isDisableNormalReallocate = false;
      }
      else {
        // this.isDisableNormal= false;
        // this.isDisableDelay= false;
        // this.isDisableNormalReallocate= true;
      }
    }
    this.getYearData();
  }
  resetRadioBtn() {
    window.location.reload();
    this.productionType = ""
  }
  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    let varietyCodeArr = [];
    if (this.ngForm.controls["variety"].value && this.ngForm.controls["variety"].value !== undefined && this.ngForm.controls["variety"].value.length > 0) {
      this.ngForm.controls["variety"].value.forEach(ele => {
        varietyCodeArr.push(ele.variety_code);
      });
    }
  
    const filters = {
      "search": {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        user_id: this.authUserId,
        production_type: this.productionType 
      }
    };
  
    const requestParams = {
      loginedUserid: {
        id: this.authUserId
      },
      ...filters
    };
  
    this.filterPaginateSearch.itemList = [];
    
    this.productioncenter.postRequestCreator("get-intake-verification-register-status-reports", filters, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse.status_code === 200) {
          this.allData = apiResponse.EncryptedResponse.data || [];
          console.log('API Response Data:', this.allData);
  
          this.allData = this.allData.map(item => {
            const formattedDate = item.submit_date ? this.formatDate(item.submit_date) : '';
            console.log('Mapping item:', {
              bspcCode: item.code,
              bspcName: item.name,
              user_id: item.user_id,
              status: item.status,
              submissionDate: formattedDate
            });
            return {
              bspcCode: item.code,
              bspcName: item.name,
              user_id: item.user_id,
              status: item.status,
              submissionDate: formattedDate
            };
          });
          
          // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.total, true);
          // this.initSearchAndPagination();
        }
        else if (apiResponse && apiResponse.EncryptedResponse.status_code === 201) {
          this.allData = [];
        }
      });
  }
  downloadPdf(userId) {
    console.log('userId========',userId);
      var param = {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        varietyCode: this.ngForm.controls['variety'].value,
        user_id: userId,
      }; 
       
      console.log("users data===",param); 
       
      console.log("users ggggg1===");  

      this.BspThirdComponent.getPageDataReport(null,null,param); 
  }
  
  // Helper function to format date to DD/MM/YYYY
  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
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
  
  cropdatatext() {
    this.croplistSecond;
  } 

   

  getFormattedSeason(season) {
    switch (season) {
      case 'R':
        return 'Rabi';
      case 'K':
        return 'Kharif';
      default:
        return '--';
    }
  }
  formatDateRange(fromDate: string, toDate: string): string {
    if (!fromDate || !toDate) {
      return 'NA';
    }
    const formattedFromDate = this.formatedDate(fromDate);
    const formattedToDate = this.formatedDate(toDate);
    return `${formattedFromDate} - ${formattedToDate}`;
  }
  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  // downloadPDF() {
  //   const element = document.getElementById('yourPdfContentId');
  //   if (element) {
  //     const opt = {
  //       margin: [5,0],
  //       filename: 'bsp3Report.pdf',
  //       image: { type: 'jpeg', quality: 0.98 },
  //       html2canvas: { scale: 2 },
  //       jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' },
  //       pagebreak: { after: ['#page-break1'], avoid: 'img' },
  //     };
  //     html2pdf().from(element).set(opt).save();
  //   }
  // }
  getquantityUnit(varietyCode: any) {
    if (varietyCode.slice(0, 1) == "A") {
      return "Qt";
    } else {
      return "Kg";
    }
  }
  getReturnData(item,obj){
    if(obj){
      if(item.is_active==0){
        return true
      }
    }
    else{
      if(item.is_active==1){
        return true
      }
    }

  }
}
