
import { Component, OnInit, Query, QueryList, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedDivisionComponent } from 'src/app/common/seed-division/seed-division.component';
import { MasterService } from 'src/app/services/master/master.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedDivisionService } from 'src/app/services/seed-division/seed-division.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { timer } from 'rxjs';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-add-crop-variety-report',
  templateUrl: './add-crop-variety-report.component.html',
  styleUrls: ['./add-crop-variety-report.component.css']
})
export class AddCropVarietyReportComponent implements OnInit {

  @ViewChild(SeedDivisionComponent) SeedDivisionComponent: SeedDivisionComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) pagitationUiComponent!: PaginationUiComponent;

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  selectCrop: any;
  ngForm!: FormGroup;
  croupGroupList: any = [];
  countData: any;
  cropData: any;
  cropVarietyData: any;
  cropName = [];
  cropNameList: any;
  disabledfieldcropName = true;
  disabledfieldVariety = true;
  datas: any;
  disabledfield = true;
  fileName = 'list-of-crop-variety-report.xlsx';
  currentUser: any = {
    "id": ''
  }


  varietyFieldDropdown: any;
  exportdata: any;
  crop_groups: any;
  crop_names: any;
  variety_names: any;
  cropDataSecond: any;
  cropNameListSecond: any;
  cropVarietyDatasecond: any;
  dropdownSettings: IDropdownSettings = {};
  gridData: any = [];
  searchBtn: boolean = false;
  activeVarietyCode: boolean = false;
  activeVarietyName: boolean = false;
  activeCropName: boolean = false;
  activeCropGroup: boolean = false;
  selectedCol: any;
  finaleDate: any;
  activeCropCode: boolean = false;
  activeMeetingNo: boolean = false;
  activeType: boolean = false;
  activeNotificationYear: boolean = false;
  activeNotificationDate: boolean = false;
  activeIntroduceYear: boolean = false;
  activeDevelopedBy: boolean = false;
  notifiedValue: any;
  isNotified: any;
  activeNotificationNumber: boolean = false;
  crop_group: any;
  variety_name: any;
  crop_name: any;
  isNotifiedValue: any;
  activereleaseNo: boolean=false;
  recomdenedState: boolean;
  ietnumber: boolean=false;
  responsible_institution_for_developing_breeder_seed: boolean;
  maturityStatus: boolean;
  resemblanceofvarietyStatus: boolean;
  activegeneric_morphological_characteristics: boolean;
  activespecific_morphological_characteristics: boolean;
  activesaverage_yield: boolean;
  activesadaptationa_and_recommended_ecology: boolean;
  activeagronomic_feature: boolean;
  activereaction_to_major_diseases: boolean;
  activereaction_to_major_pests: boolean;
  activefertiliser_dosage: boolean;
  exportdatas: any;
  activeyear_of_releaseCode: boolean=false;
  year_of_releases: boolean;
  institutionData: any;

  constructor(private restService: RestService, private fb: FormBuilder,
    private _service: SeedDivisionService,
    private _masterService: MasterService) {
    this.createEnrollForm();

  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_group: new FormControl(''),
      season: new FormControl('',),
      crop_name: new FormControl('',),
      variety_name: new FormControl('',),
      seed_ratio: new FormControl('',),
      crop_text: new FormControl('',),
      crop_name_text: new FormControl('',),
      variety_name_text: new FormControl('',),
      filed_data: new FormControl('',),
    });

    // this.ngForm.controls['crop_group'].valueChanges.subscribe(newValue => {
    //   if (newValue) {

    //     this.getCropNameList(newValue);
    //     this.ngForm.controls['crop_name'].enable();
    //     this.ngForm.controls["crop_name"].setValue("");
    //     this.ngForm.controls["variety_name"].setValue("");
    //     this.ngForm.controls["variety_name"].disable()
    //     this.crop_names = '';
    //     this.variety_names = '';
    //     this.disabledfieldcropName = false;
    //     this.disabledfieldVariety = true;
    //   }
    //   else {
    //     this.ngForm.controls["crop_name"].disable()
    //   }
    // });
//     this.ngForm.controls['crop_group'].valueChanges.subscribe(newValue => {
//   if (newValue) {
//     this.getCropNameList('A04');
//     this.ngForm.controls['crop_name'].enable();
//     this.ngForm.controls["crop_name"].setValue("");
//     this.ngForm.controls["variety_name"].setValue("");
//     this.ngForm.controls["variety_name"].disable();
//     this.disabledfieldcropName = false;
//     this.disabledfieldVariety = true;
//   } else {
//     this.ngForm.controls["crop_name"].disable();
//   }
// });


this.ngForm.controls['filed_data'].valueChanges.subscribe(newValue => {
  const userData = localStorage.getItem('BHTCurrentUser');
  const data = JSON.parse(userData);
  const user_type = data?.user_type;
if (user_type === 'OILSEEDADMIN') {
this.ngForm.controls['crop_group'].patchValue('A04')
this.ngForm.controls['crop_group'].disable();
  this.ngForm.controls['crop_text'].patchValue("OILSEEDS");
  this.ngForm.controls['crop_text'].disable();
  this.crop_groups = "OILSEEDS";
    this.ngForm.controls['crop_name'].enable();
    this.ngForm.controls['crop_name'].setValue("");
    this.ngForm.controls['variety_name'].setValue("");
    this.ngForm.controls['variety_name'].disable();
    this.disabledfieldcropName = false;
    this.variety_names = '';
  }
  if (user_type === 'PULSESSEEDADMIN') {
    this.ngForm.controls['crop_group'].patchValue('A03');
    this.ngForm.controls['crop_group'].disable();
    this.ngForm.controls['crop_text'].patchValue("PULSES");
    this.ngForm.controls['crop_text'].disable();
    this.crop_groups = "PULSES";
    this.ngForm.controls['crop_name'].enable();
    this.ngForm.controls['crop_name'].setValue("");
    this.ngForm.controls['variety_name'].setValue("");
    this.ngForm.controls['variety_name'].disable();
    this.disabledfieldcropName = false;
    this.variety_names = '';
  }
  
});


this.ngForm.controls['crop_group'].valueChanges.subscribe(newValue => {
  if (newValue) {
    this.getCropNameList(newValue);
    this.ngForm.controls['crop_name'].enable();
    this.ngForm.controls["crop_name"].setValue("");
    this.ngForm.controls["variety_name"].setValue("");
    this.ngForm.controls["variety_name"].disable();
    this.crop_names = '';
    this.variety_names = '';
    this.disabledfieldcropName = false;
    this.disabledfieldVariety = true;
    console.log("VAlueeee Later", this.ngForm.controls['crop_group'].value)
    console.log("VAlueeee crop_text", this.ngForm.controls['crop_text'].value)
    console.log("this.crop_groups", this.crop_groups)


    

  } else {
    this.ngForm.controls["crop_name"].disable();
  }


});



    // this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
    //   if (newValue) {
    //     this.ngForm.controls["variety_name"].setValue("");
    //     this.ngForm.controls['variety_name'].enable();
    //     this.variety_names = '';
    //     this.getCropVarietyData(newValue);
    //     this.disabledfieldVariety = false
    //   }
    //   else {
    //     this.ngForm.controls["variety_name"].disable()
    //   }
    // });
    // this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
    //   if (newValue) {
    //     console.log(newValue)
    //     this.cropData = this.cropDataSecond
    //     let response = this.cropData.filter(x => x.group_name.toLowerCase().startsWith(newValue.toLowerCase()))

    //     this.cropData = response


    //   }
    //   else {
    //     this.getCropData(null)
    //   }
    // });

    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
  if (newValue) {
    this.ngForm.controls["variety_name"].setValue("");
    this.ngForm.controls['variety_name'].enable();
    this.variety_names = '';
    this.getCropVarietyData(newValue);
    this.disabledfieldVariety = false;
  } else {
    this.ngForm.controls["variety_name"].disable();
  }
});

    this.ngForm.controls['crop_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropNameList = this.cropNameListSecond
        let response = this.cropNameList.filter(x => x.crop_name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.cropNameList = response


      }
      else {

        this.getCropNameList(this.ngForm.controls['crop_group'].value)
      }
    });
    this.ngForm.controls['variety_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropVarietyData = this.cropVarietyDatasecond
        let response = this.cropVarietyData.filter(x => x.variety_name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.cropVarietyData = response


      }
      else {

        // this.getCropVarietyData(this.ngForm.controls['crop_name'].value)
      }
    });

    // if(this.ngForm.controls['crop_group'].value===''){
    //   // this.ngForm.controls['crop_name'].disable()
    //   this.disabledfield=false;
    // }
  }
  // ngOnInit(): void {
  //   const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
  //   this.currentUser.id = currentUser.id
  //   this.getInsitution()
  //   this.notifiedvalue('notified');
  //   this.filterPaginateSearch.itemListPageSize = 50;

  //   this.getCropData(null);
  //   this.ngForm.controls['crop_name'].disable()
  //   this.ngForm.controls['variety_name'].disable()

  //   this.dropdownSettings = {
  //     idField: 'value',
  //     textField: 'fieldName',
  //     enableCheckAll: true,
  //     allowSearchFilter: true,
  //     limitSelection: -1,
  //     itemsShowLimit:1
  //   };
  // }

  ngOnInit(): void {
  // 1. Current user को get करना
  const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser') || '{}');
  this.currentUser.id = currentUser.id;
  const user_type = currentUser.user_type;
  const username = currentUser.username;

  // 2. जरूरी functions call करना
  this.getInsitution();
  this.notifiedvalue('notified');
  this.filterPaginateSearch.itemListPageSize = 50;
  this.getCropData(null);

  // 3. Form controls disable करना
  this.ngForm.controls['crop_name'].disable();
  this.ngForm.controls['variety_name'].disable();

  // 4. OILSEEDADMIN के लिए default Oilseeds select करना
  if (user_type === 'OILSEEDADMIN' && username === 'OILSEEDADMIN') {
    this.selectCrop = 'Oilseeds';                        // UI में दिखाने के लिए
    this.ngForm.controls['crop_group'].setValue('A04');  // backend code value
    this.ngForm.controls['crop_name'].enable();          // Crop Name enable
    this.getCropNameList('A04');                         // Crop Name list load
  }

  // 5. Dropdown settings
  this.dropdownSettings = {
    idField: 'value',
    textField: 'fieldName',
    enableCheckAll: true,
    allowSearchFilter: true,
    limitSelection: -1,
    itemsShowLimit: 1
  };
}


  notifiedvalue(data) {
    
    this.isNotified = data;
    console.log('notifiedValue', data);
    
    this.getCropData(this.isNotifiedValue);
    this.varietyFieldDropdown = [];
    this.ngForm.controls['filed_data'].reset();
    if (data == "notified") {
      this.isNotifiedValue = 1;
      this.varietyFieldDropdown = [
        { fieldName: "Crop Group", value: "crop_group" },
        { fieldName: "Crop Name", value: "crop_name" },
        { fieldName: "Crop Code	", value: "crop_code" },
        { fieldName: "Variety Name", value: "variety_name" },
        { fieldName: "Variety Code", value: "variety_code" },
        { fieldName: "Notification Date", value: "notification_date" },
        // { fieldName: "Notification Number", value: "notification_number" },
        { fieldName: "Meeting Number", value: "meeting_no" },
        { fieldName: "Year of Release", value: "year_of_release" },
        // { fieldName: "Variety Type", value: "variety_type" },
        // { fieldName: "Developed By", value: "developed_by" },
        // { fieldName: "Release By", value: "release_by" },
        // { fieldName: "State of Release", value: "State_of_release" },
        { fieldName: "Recommended State(s) for Cultivation", value: "recommended_state_for_cultivation" },
        { fieldName: "IET Number/Name By Which Tested", value: "iet_number_name_by_which_tested" },
        { fieldName: "Responsible Institution for Developing Breeder Seed", value: "responsible_institution_for_developing_breeder_seed" },
        { fieldName: "Resemblance to Variety", value: "resemblance_to_variety" },
        { fieldName: "Type of Maturity", value: "type_of_maturity" },
        // { fieldName: "Notification Year", value: "notification_year" },
        // { fieldName: "Maturity In Days", value: "maturity_in_days" },
        { fieldName: "Generic Morphological Characteristics", value: "generic_morphological_characteristics" },
        { fieldName: "Specific Morphological Characteristics", value: "specific_morphological_characteristics" },
        // { fieldName: "Notification Date", value: "notification_date" },
        { fieldName: "Introduce Year", value: "introduce_year" },
        { fieldName: "Notification Number", value: "notification_no" },
        // { fieldName: "Introduce Year", value: "introduce_year" },
        { fieldName: "Average Yield (Kg/Ha)", value: "average_yield" },
        { fieldName: "Adaptation and Recommended Ecology", value: "adaptationa_and_recommended_ecology" },
        { fieldName: "Agronomic Feature", value: "agronomic_feature" },
        { fieldName: "Reaction to Major Diseases", value: "reaction_to_major_diseases" },
        { fieldName: "Reaction to Major Pests", value: "reaction_to_major_pests" },
        { fieldName: "Fertiliser Dosage(Kg/Ha)", value: "fertiliser_dosage" },   
      ];
    }
    if (data == "non_notified") {
      this.isNotifiedValue = 0 ;
      this.varietyFieldDropdown = [
        { fieldName: "Crop Group", value: "crop_group" },
        { fieldName: "Crop Name", value: "crop_name" },
        // { fieldName: "Crop Code	", value: "crop_code" },
        { fieldName: "Variety Name", value: "variety_name" },
        { fieldName: "Variety Code", value: "variety_code" },
        { fieldName: "Year of Introduction in the market", value: "year_of_releases" },
        { fieldName: "Variety Type", value: "variety_type" },
        { fieldName: "Developed By", value: "developed_by" },
        { fieldName: "Release By", value: "release_by" },
        { fieldName: "State of Release", value: "State_of_release" },
        { fieldName: "Recommended State(s) for Cultivation", value: "recommended_state_for_cultivation" },
        { fieldName: "IET Number/Name By Which Tested", value: "iet_number_name_by_which_tested" },
        { fieldName: "Responsible Institution for Developing Breeder Seed", value: "responsible_institution_for_developing_breeder_seed" },
        { fieldName: "Resemblance to Variety", value: "resemblance_to_variety" },
        { fieldName: "Type of Maturity", value: "type_of_maturity" },
        // { fieldName: "Meeting Number", value: "meeting_no" },
        { fieldName: "Variety Type", value: "type" },
        // { fieldName: "Notification Year", value: "notification_year" },
        // { fieldName: "Maturity In Days", value: "maturity_in_days" },
        { fieldName: "Generic Morphological Characteristics", value: "generic_morphological_characteristics" },
        { fieldName: "Specific Morphological Characteristics", value: "specific_morphological_characteristics" },
        // { fieldName: "Introduce Year", value: "introduce_year" },
        { fieldName: "Average Yield (Kg/Ha)", value: "average_yield" },
        { fieldName: "Adaptation and Recommended Ecology", value: "adaptationa_and_recommended_ecology" },
        { fieldName: "Agronomic Feature", value: "agronomic_feature" },
        { fieldName: "Reaction to Major Diseases", value: "reaction_to_major_diseases" },
        { fieldName: "Reaction to Major Pests", value: "reaction_to_major_pests" },
        { fieldName: "Fertiliser Dosage(Kg/Ha)", value: "fertiliser_dosage" },   


        // { fieldName: "Notification Date", value: "notification_date" },
        // { fieldName: "Notification Number", value: "notification_number" },
        // { fieldName: "Meeting Number", value: "meeting_no" },
        // { fieldName: "Year of Release", value: "year_of_release" },
      ];
    }
    this.varietyFieldDropdown=   this.varietyFieldDropdown.sort((a, b) => {
      const nameA = a.fieldName.toLowerCase();
      const nameB = b.fieldName.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

  }

  dynamicGridData(event) {
    this.searchBtn = false;
    this.activeVarietyCode = false;
    this.activeVarietyName = false;
    this.activeCropName = false;
    this.activeCropGroup = false;
    this.activeCropCode = false;
    this.activeMeetingNo = false;
    this.activeType = false;
    this.activeNotificationYear = false;
    this.activeNotificationDate = false;
    this.activeIntroduceYear = false;
    this.activeDevelopedBy = false;
    this.activeyear_of_releaseCode = false;
    this.activeNotificationNumber = false;
    this.activereleaseNo = false;
    this.recomdenedState =  false
    this.ietnumber = false;
    this.year_of_releases=false
  this.responsible_institution_for_developing_breeder_seed = false;
  this.maturityStatus = false;
  this.resemblanceofvarietyStatus = false;
   this.activegeneric_morphological_characteristics = false;
  this.activespecific_morphological_characteristics = false;
  this.activesaverage_yield = false;
  this.activesadaptationa_and_recommended_ecology =  false
   this.activeagronomic_feature = false;
   this.activereaction_to_major_diseases  =false;
  this.activereaction_to_major_pests = false;
   this.activefertiliser_dosage = false;

    if (this.ngForm.controls['filed_data'].value && this.ngForm.controls['crop_group'].value) {
      this.searchBtn = true;
      this.ngForm.controls['filed_data'].value.forEach(element => {
        console.log(element,'el')
        if (element && element.value == "crop_group") {
          this.activeCropGroup = true;
        }
        if (element && element.value == "crop_name") {
          this.activeCropName = true;
        }
        if (element && element.value == "variety_name") {
          this.activeVarietyName = true;
        }
        if (element && element.value == "variety_code") {
          this.activeVarietyCode = true;
        }
        if (element && element.value == "year_of_release") {
          this.activeyear_of_releaseCode = true;
        }
        if (element && element.value == "crop_code") {
          this.activeCropCode = true;
        }
        if (element && element.value == "meeting_no") {
          this.activeMeetingNo = true;
        }
        if (element && element.value == "year_of_release") {
          this.activereleaseNo = true;
        }
        if (element && element.value == "type") {
          this.activeType = true;
        }
        if (element && element.value == "notification_year") {
          this.activeNotificationYear = true;
        }
        if (element && element.value == "notification_date") {
          this.activeNotificationDate = true;
        }
        if (element && element.value == "notification_no") {
          this.activeNotificationNumber = true;
        }
        if (element && element.value == "introduce_year") {
          this.activeIntroduceYear = true;
        }
        if (element && element.value == "developed_by") {
          this.activeDevelopedBy = true;
        }
        if (element && element.value == "recommended_state_for_cultivation") {
          this.recomdenedState = true;
        }
        if (element && element.value == "iet_number_name_by_which_tested") {
          this.ietnumber = true;
        }
        if (element && element.value == "responsible_institution_for_developing_breeder_seed") {
          this.responsible_institution_for_developing_breeder_seed = true;
        }
        if (element && element.value == "type_of_maturity") {
          this.maturityStatus = true;
        }
        if (element && element.value == "resemblance_to_variety") {
          this.resemblanceofvarietyStatus = true;
        }
         
         if (element && element.value == "generic_morphological_characteristics") {
          this.activegeneric_morphological_characteristics = true;
        }
         if (element && element.value == "specific_morphological_characteristics") {
          this.activespecific_morphological_characteristics = true;
        }
         if (element && element.value == "average_yield") {
          this.activesaverage_yield = true;
        }
         if (element && element.value == "adaptationa_and_recommended_ecology") {
          this.activesadaptationa_and_recommended_ecology = true;
        }
         if (element && element.value == "agronomic_feature") {
          this.activeagronomic_feature = true;
        }
         if (element && element.value == "reaction_to_major_diseases") {
          this.activereaction_to_major_diseases = true;
        }
         if (element && element.value == "reaction_to_major_pests") {
          this.activereaction_to_major_pests = true;
        }
         if (element && element.value == "fertiliser_dosage") {
          this.activefertiliser_dosage = true;
        }
         if (element && element.value == "year_of_releases") {
          this.year_of_releases = true;
        }
        
        this.gridData = this.ngForm.controls['filed_data'].value;
      });
    } else {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Fields First.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })
    }
    // console.log('dynamic grid data', this.gridData);
  }
  cropGroup(item: any) {
    this.selectCrop = item.name;
    this.ngForm.controls['crop_group'].setValue(this.selectCrop.name)
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type
    this.selectedCol = this.ngForm.controls['filed_data'].value

    this._service
      .postRequestCreator("get-crop-veriety-data-with-dynamic-filed", {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        search: {
          cropGroup: this.ngForm.controls['crop_group'].value,
          crop_code: this.ngForm.controls['crop_name'].value,
          variety_code: this.ngForm.controls['variety_name'].value,
          user_id: this.currentUser.id,
          fieldData: this.ngForm.controls['filed_data'].value,
          is_notified: this.isNotified,
          user_type: user_type,
          type: 'reporticar'

        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          let data = []
          let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
          data.push(allData)
          // d)
          let abc = data.flat();
          let arr;
          arr = abc.sort(a => a.m_crop && a.m_crop.crop_name ? a.m_crop.crop_name : '');


          if (allData === undefined) {
            allData = [];
          }
          // this.finaleDate = arr
                   this.filterPaginateSearch.Init(arr, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
        }
      });
  }
  getPageDataSecond(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type
    this.selectedCol = this.ngForm.controls['filed_data'].value

    this._service
      .postRequestCreator("get-crop-veriety-data-with-dynamic-filed", {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        search: {
          cropGroup: this.ngForm.controls['crop_group'].value,
          crop_code: this.ngForm.controls['crop_name'].value,
          variety_code: this.ngForm.controls['variety_name'].value,
          user_id: this.currentUser.id,
          fieldData: this.ngForm.controls['filed_data'].value,
          is_notified: this.isNotified,
          user_type: user_type,
          type: 'reporticar'

        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          let data = []
          let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
          data.push(allData)
          // d)
          let abc = data.flat();
          let arr;
          arr = abc.sort(a => a.m_crop && a.m_crop.crop_name ? a.m_crop.crop_name : '');


          if (allData === undefined) {
            allData = [];
          }
          this.finaleDate = arr
         
         
        
          // this.filterPaginateSearch.Init(arr, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.exportdatas = this.finaleDate
        //   for(let item of this.exportdatas){
        //    let items=[]
        //    if(item.state_data && item.state_data.length>0){
        //      item.state_data.forEach((el)=>{
        //        items.push(el.state_name)
           
        //            // item.state_data=items
        //            })
        //      item.state_data=items
            
        //    }
        //  }
          // this.initSearchAndPagination();
          // this.getCropNameLists();
          // this.datas = allData;
        }
      });
  }


  initSearchAndPagination() {
    // this.SeedDivisionComponent === undefined || 
    if (this.pagitationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.pagitationUiComponent.Init(this.filterPaginateSearch);
    // this.SeedDivisionComponent.Init(this.filterPaginateSearch);
  }

  delete(id: number) {
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure To Delete?",
      position: "center",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        title: 'list-action-confirmation-title',
        actions: 'list-confirmation-action'
      }
    }).then(result => {
      if (result.isConfirmed) {
        this._service
          .postRequestCreator("delete-nget-crop-veriety-data/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
      }
    })
  }

  search() {
    // !this.ngForm.controls["crop_group"].value && !this.ngForm.controls["crop_name"].value && !this.ngForm.controls["variety_name"].value)
    // console.log('field data===',this.ngForm.controls['filed_data'].value);
    if ((this.ngForm.controls['filed_data'].value == "" || this.ngForm.controls['filed_data'].value == undefined && this.ngForm.controls['filed_data'].value.length == 0)) {
      this.searchBtn = false;
      // alert("hiii");
      Swal.fire({
        toast: false,
        icon: "error",
        title: "Please Select Something. ",
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        showCancelButton: false,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        customClass: {
          title: 'list-action-confirmation-title',
          actions: 'list-confirmation-action'
        }
      })

      return;
    }
    if ((this.ngForm.controls['crop_group'].value == "" || this.ngForm.controls['crop_group'].value == undefined && this.ngForm.controls['crop_group'].value.length == 0)) {
      this.searchBtn = false;
      // alert("hiii");
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop Group.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })
  
      return;
    }
    else {
      // this.filterPaginateSearch.itemListCurrentPage = 1;
      // this.initSearchAndPagination();
      this.getPageData();
      this.getPageDataSecond();
      this.runExcelApi();

    }
  }

  clear() {
    this.searchBtn = false;

    this.activeVarietyCode = false;
    this.activeVarietyName = false;
    this.activeCropName = false;
    this.activeCropGroup = false;
    this.activeCropCode = false;
    this.activeMeetingNo = false;
    this.activeType = false;
    this.activeNotificationYear = false;
    this.activeNotificationDate = false;
    this.activeNotificationNumber = false;
    this.activeIntroduceYear = false;
    this.activeDevelopedBy = false;
    this.activeyear_of_releaseCode = false;
    this.ngForm.controls["filed_data"].reset();
    this.ngForm.controls["crop_group"].setValue("");
    this.ngForm.controls["crop_name"].setValue("");
    this.ngForm.controls["variety_name"].setValue("");
    this.ngForm.controls['crop_text'].setValue('')
    // this.getPageData();
    this.ngForm.controls['crop_name'].disable()
    this.ngForm.controls['variety_name'].disable()
    this.crop_names = '';
    this.variety_names = '';
    this.crop_groups = '';
    this.disabledfieldVariety = true
    this.filterPaginateSearch.itemListCurrentPage = 1;
    // this.initSearchAndPagination();
    this.disabledfieldcropName = true;
    // this.getCropNameList('we34');
    // this.getCropVarietyData('ew324');
  }


  async getCropData(isNotifiedValue) {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type
    const param = {
      'search': {
        user_type: user_type,
        type: 'reporticar',
        isNotified:isNotifiedValue
      }
    }
    this._masterService
      .postRequestCreator("getSeedVarietyCropGroupData", null, param)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.cropData = apiResponse.EncryptedResponse.data.rows;
          this.cropData = this.cropData.filter(item => item.group_code != null);
          this.cropData = this.cropData.filter((arr, index, self) =>
            index === self.findIndex((t) => (t.group_code === arr.group_code)))
            this.cropDataSecond = this.cropData
            console.log(this.cropDataSecond,'cropDataSecond')
        }
      });

  }

  // async getCropNameList(newValue) {
  //   console.log('crop name ========== new value', newValue);
  //   if (newValue) {
  //     const userData = localStorage.getItem('BHTCurrentUser');
  //     const data = JSON.parse(userData);
  //     const user_type = data.user_type



  //     const searchFilters = {
  //       "search": {
  //         "group_code": newValue,
  //         "cropNameRaw": true,
  //         user_type: user_type,
  //         type: 'reporticar',
  //         isNotified:this.isNotifiedValue
  //       }
  //     };

  //     this._service
  //       .postRequestCreator("get-distrinct-seed-variety-crop-name", searchFilters, null)
  //       .subscribe((apiResponse: any) => {
  //         if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
  //           && apiResponse.EncryptedResponse.status_code == 200) {
  //           console.log(apiResponse);
  //           if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data.rows.length > 0) {
  //             this.cropNameList = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
  //             this.cropNameListSecond = this.cropNameList

  //           }
  //           else {
  //             this.cropNameList = []
  //           }


  //         }
  //         else {

  //           this.cropNameList = []
  //         }
  //       });
  //   } else {
  //     this.ngForm.controls["crop_group"].setValue("");
  //     this.ngForm.controls["crop_name"].setValue("");
  //     this.ngForm.controls["variety_name"].setValue("");
  //   }

  // }

  async getCropNameList(newValue) {
  if (newValue) {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type

    const searchFilters = {
      "search": {
        "group_code": newValue,
        "cropNameRaw": true,
        user_type: user_type,
        type: 'reporticar',
        isNotified:this.isNotifiedValue
      }
    };

    this._service
      .postRequestCreator("get-distrinct-seed-variety-crop-name", searchFilters, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse?.EncryptedResponse?.status_code == 200) {

          // Crop Name List set करना
          this.cropNameList = apiResponse.EncryptedResponse.data?.rows || [];
          this.cropNameListSecond = [...this.cropNameList];  // backup

          // Form controls reset & enable करना
          this.ngForm.controls['crop_name'].setValue('');        // Crop Name empty
          this.ngForm.controls['variety_name'].setValue('');     // Variety empty
          this.crop_names = '';                                   // UI variable reset
          this.variety_names = '';
          this.ngForm.controls['crop_name'].enable();            // enable Crop Name dropdown

        } else {
          this.cropNameList = [];
          this.ngForm.controls['crop_name'].setValue('');
          this.ngForm.controls['variety_name'].setValue('');
          this.crop_names = '';
          this.variety_names = '';
          this.ngForm.controls['crop_name'].disable();
        }
      });

  } else {
    // Agar Crop Group empty ho
    this.ngForm.controls["crop_group"].setValue("");
    this.ngForm.controls["crop_name"].setValue("");
    this.ngForm.controls["variety_name"].setValue("");
    this.crop_names = '';
    this.variety_names = '';
    this.ngForm.controls['crop_name'].disable();
  }
}




  async getCropVarietyData(newValue) {

    if (newValue) {
      const searchFilters = {
        "search": {
          "crop_code": newValue,
          "cropGroup": this.ngForm.controls["crop_group"].value,
          isNotified:this.isNotifiedValue
        }
      };
      this._service
        .postRequestCreator("get-distrinct-variety-name", searchFilters, null)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            console.log(apiResponse);

            this.cropVarietyData = apiResponse.EncryptedResponse.data.rows;
            this.cropVarietyData = this.cropVarietyData.sort((a, b) => a.variety_name.localeCompare(b.variety_name))
            this.cropVarietyDatasecond = this.cropVarietyData
            
          }
        });
    } else {
      this.ngForm.controls["crop_name"].setValue("");
      this.ngForm.controls["variety_name"].setValue("");
    }

  }


  onSubmit() {

  }

  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
    // this.runExcelApi();
  }

  onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }



  runExcelApi() {
    this._service
      .postRequestCreator("get-crop-veriety-data", {
        search: {
          cropGroup: this.ngForm.controls['crop_group'].value,
          crop_code: this.ngForm.controls['crop_name'].value,
          variety_code: this.ngForm.controls['variety_name'].value,
          user_id: this.currentUser.id,
          is_notified: this.isNotified
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          // this.filterPaginateSearch.itemListPageSize = 10;
          let data = []
          this.exportdata = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
          console.log('export===data', this.exportdata);
          data.push(this.exportdata)
          // d)

          let abc = data.flat();
          let arr;
          arr = abc.sort(a => a.m_crop && a.m_crop.crop_name ? a.m_crop.crop_name : '');

          if (this.exportdata === undefined) {
            this.exportdata = [];
          } else {
            // timer(10);
            // this.exportexcel();
          }

        }
      });
  }

  exportexcel(): void {
    // this.runExcelApi();
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
    // document.getElementById("myDropdown").classList.toggle("hide");    

  }
  cropGroupData(data) {

    this.crop_groups = data && data.group_name ? data.group_name : '';
    
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropData = this.cropDataSecond;
    this.ngForm.controls['crop_group'].setValue(data && data.group_code ? data.group_code : '')

  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cropNames(data) {

    this.crop_names = data && data.crop_name ? data.crop_name : '';
    this.cropNameList = this.cropNameListSecond;
    this.ngForm.controls['crop_name_text'].setValue('', { emitEvent: false })
    this.ngForm.controls['crop_name'].setValue(data && data.crop_code ? data.crop_code : '')

  }
  cnClick() {
    document.getElementById('crop_name').click();
  }
  cvClick() {
    document.getElementById('variety_name').click();
  }
  varietyNames(data) {
    this.variety_names = data && data.variety_name ? data.variety_name : '';
    this.cropVarietyData = this.cropVarietyDatasecond
    this.ngForm.controls['variety_name_text'].setValue('',{emitEvent:false})
    console.log(data, 'data')
    this.ngForm.controls['variety_name'].setValue(data && data.variety_code ? data.variety_code : '')
  }

  download() {
    console.log("-------")
    let tempData = {
      "group_name": "BULB VEGETABLES",
      "crop_name": "AMAN TWO",
      "crop_code": "H0113",
      "variety_name": "ONE  DAY",
      "year_of_release": "ONE  DAY",
      "meeting_no": "",
      "variety_code": "H0113002",
      "developed_by": "Public Sector",
      "introduce_year": "2023-03-10T18:30:00.000Z",
      "notification_date": "",
      "type": "H0113002"
    }
    let headings = Object.keys(tempData)
    let data = this.ngForm.controls['filed_data'].value;
       console.log(this.exportdatas,'data')
       let exportdata2 = this.exportdatas
       for(let item of exportdata2){
        let items=[]
        if(item.state_data && item.state_data.length>0){
          item.state_data.forEach((el)=>{
            items.push(el.state_name)
        
                // item.state_data=items
                })
          item.state_data=items
         
        }
      }
    let reportDataHeader = [
      { text: 'S/N', bold: true },
    ]
    for (var i = 0; i < data.length; ++i) {

      reportDataHeader.push({ text: data[i].fieldName, bold: true });
    }
    reportDataHeader.push({ text: 'Status', bold: true },)

    this.selectedCol = this.ngForm.controls['filed_data'].value
    console.log(this.selectedCol)
    this.finaleDate
    for(let data of this.finaleDate){
      data.matuarity_type_id=  data && data.matuarity_type_id && ( data.matuarity_type_id==1)?'Early' :(data.matuarity_type_id==2)?'Medium': (data.matuarity_type_id==3)?'Late':'NA'
      data.responsible_institution_for_developing_breeder_seed=  data && data.responsible_institution_for_developing_breeder_seed ? this.getInstitutionData(data.responsible_institution_for_developing_breeder_seed):'NA'
    }

   

    let reportData = this.finaleDate.map((element, index) => {
      let values = Object.values(element);

      // console.log(values && values.state_name ?,'values')
      let data = values.pop()
      let statusVal = (data == 1) ? "ACTIVE" : "ISACTIVE";
      let reportData = [
        index + 1,
        ...values,
        statusVal
        // ...statusVal          
      ]
      return reportData;
    })
    // console.log("reportDatareportData1111111111111", reportData)
    reportData = [[...reportDataHeader], ...reportData]
    // console.log("reportDatareportData3333333333", reportData)

    let pageWidth = 1800
    let numberOfColumn = 10
    let numberOfCharecter = 30
    const columnWidth = (pageWidth - (2 * 2) - (1 * numberOfColumn)) / numberOfColumn
    const maxFontSize = columnWidth / (1 * numberOfCharecter)

    const docDefinition = {
      pageOrientation: 'landscape',
      // pageSize: {
      //   width: 1800,
      //   height: 600,
      // },

      content: [
        { text: 'List of Crop Varieties', style: 'header' },
        { text: `Crop Group : ${this.crop_groups}  Crop Name: ${this.crop_names}  Variety Name: ${this.variety_names}`,  },
        {
          style: 'indenterTable',
          table: {
            // widths: [5,15,10,10,10,10,10,10,10,10],
            body:
              reportData,
          },
        },
      ],

      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 13,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        indenterTable: {

          fontSize: maxFontSize,
          margin: [0, 5, 0, 15],
        },
      },
    };
    pdfMake.createPdf(docDefinition).download('add-crop-variety-report.pdf');
  }
getState(data){
  let temp=[]
  data.forEach(item=>{
    temp.push(item && item.state_name ? item.state_name:'')
  })
  return temp
}
getStatepdfSecond(item){
  let items=[]
  item.forEach((el)=>{
    items.push(el.state_name)

        // item.state_data=items
        })
}
getMature(item){
  let data= item && (item==1) ? 'Early' :(item==2) ? 'Medium':(item==3)?'Late':'NA';
  return data ? data :'NA'
}
getInstitutionData(item){
  let temp = this.institutionData.filter(x=>x.id == item)
  return temp && temp[0]&& temp[0].agency_name ? temp[0].agency_name :'Na'
}
getInsitution() {
  this._service.postRequestCreator('getBspcDatainCharactersticsSecond',null,null).subscribe(apiResponse => {
    this.institutionData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
  
  })
}

// getCropGroupName(code: string) {
//   const group = this.cropData.find(x => x.group_code === code);
//   return group ? group.group_name : '';
// }
getCropGroupName(value: any) {
  if (!value) return '';
  if (value.group_name) return value.group_name;

  // fallback if only code is stored
  if (this.cropData) {
    const group = this.cropData.find(x => x.group_code === value);
    return group ? group.group_name : '';
  }
  return '';
}


}

