
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-crop-variety-characterstic-reoprt',
  templateUrl: './crop-variety-characterstic-reoprt.component.html',
  styleUrls: ['./crop-variety-characterstic-reoprt.component.css']
})
export class CropVarietyCharactersticReoprtComponent implements OnInit {
  @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  selectCrop: any;
  ngForm!: FormGroup;
  croupGroupList: any = [];
  croupGroup: any;
  submissionid: any | null;
  crop_name_list: any;
  selectCrop_group: any;
  cropVarietyData: any;
  selectvariety_name: any;
  submitted: boolean = false;
  maturity_type: any;
  maturity_type_id: string;
  userId: any;
  fileName = 'crop-variety-characterstic-reoprt.xlsx';
  exportdata: any;
  crop_grops: any;
  crop_names: any;
  disabledfieldcropName = true;
  disabledfieldVariety = true;
  variety_names: any;
  crop_name_list_second: any;
  croupGroupListSecond: any;
  cropVarietyDataSecond: any;
  dropdownSettings: IDropdownSettings = {};
  activeDevelopedBy: boolean = false;
  activeVarietyCode: boolean = false;
  activeVarietyName: boolean = false;
  activeCropName: boolean = false;
  activeCropGroup: boolean = false;

  matuarity_day_from: boolean = false;
  matuarity_day_to: boolean = false;
  spacing_from: boolean = false;
  spacing_to: boolean = false;
  generic_morphological: boolean = false;
  seed_rate: boolean = false;
  average_yeild_from: boolean = false;
  average_yeild_to: boolean = false;
  fertilizer_dosage: boolean = false;
  agronomic_features: boolean = false;
  adoptation: boolean = false;
  reaction_abiotic_stress: boolean = false;
  reaction_major_diseases: boolean = false;
  reaction_to_pets: boolean = false;
  specific_morphological: boolean = false;
  notification_date: boolean = false;
  year_of_introduction_market: boolean = false;
  notification_number: boolean = false;
  meeting_number: boolean = false;
  year_of_release: boolean = false;
  nitrogen: boolean = false;
  phosphorus: boolean = false;
  potash: boolean = false;
  other: boolean = false;
  fertilizer_other_name: boolean = false;
  fertilizer_other_value: boolean = false;
  maturity: boolean = false;
  type: boolean = false;
  eology: boolean = false;

  varietyFieldDropdown = [];
  searchBtn: boolean = false;
  gridData: any;
  isNotified: any;
  notifiedValue: any;
  resemblance_to_varietyData: boolean = false;
  insitutionDevelopingSeed: boolean = false;
  recommended_state_for_cultivation: boolean = false;
  sortedVarietyFieldDropdown: any[];
  selectedCol: any;

  constructor(private restService: RestService, private fb: FormBuilder, private route: ActivatedRoute, private service: SeedServiceService) {
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_group: new FormControl(''),
      crop_name: new FormControl('',),
      variety_name: new FormControl('',),
      variety_name_text: new FormControl('',),
      crop_text: new FormControl('',),
      crop_name_text: new FormControl('',),
      filed_data: new FormControl('',),

    });


    this.ngForm.controls['filed_data'].valueChanges.subscribe(newValue => {
      const userData = localStorage.getItem('BHTCurrentUser');
      const data = JSON.parse(userData);
      const user_type = data?.user_type;
    
      if (user_type === 'OILSEEDADMIN') {
    this.ngForm.controls['crop_group'].patchValue([
      {
        group_code: "A04",
        group_name: "OILSEEDS"
      }
    ]);
    this.ngForm.controls['crop_group'].disable();
      this.ngForm.controls['crop_text'].patchValue("OILSEEDS");
      this.ngForm.controls['crop_text'].disable();
      this.crop_grops = "OILSEEDS";
        this.ngForm.controls['crop_name'].enable();
        this.ngForm.controls['crop_name'].setValue("");
        this.ngForm.controls['variety_name'].setValue("");
        this.ngForm.controls['variety_name'].disable();
        this.disabledfieldcropName = false;
        this.variety_names = '';
      }
      if (user_type === 'PULSESSEEDADMIN') {
        this.ngForm.controls['crop_group'].patchValue([
          {
            group_code: "A03",
            group_name: "PULSES"
          }
        ]);
        this.ngForm.controls['crop_group'].disable();
        this.ngForm.controls['crop_text'].patchValue("PULSES");
        this.ngForm.controls['crop_text'].disable();
        this.crop_grops = "PULSES";
        this.ngForm.controls['crop_name'].enable();
        this.ngForm.controls['crop_name'].setValue("");
        this.ngForm.controls['variety_name'].setValue("");
        this.ngForm.controls['variety_name'].disable();
        this.disabledfieldcropName = false;
        this.variety_names = '';
      }
    });


    this.ngForm.controls['crop_group'].valueChanges.subscribe(newValue => {
      this.ngForm.controls['crop_name'].enable();
      this.ngForm.controls['crop_name'].setValue("");
      this.ngForm.controls['variety_name'].setValue("");
      this.ngForm.controls['variety_name'].disable();
      this.disabledfieldcropName = false;
      this.crop_names = '';
      this.variety_names = '';
      this.getCropNameList(newValue);

    });

    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getCropVarietyData(newValue);
        this.ngForm.controls['variety_name'].enable();
        this.ngForm.controls['variety_name'].setValue("");

        this.variety_names = '';
        this.disabledfieldVariety = false;
      }
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.croupGroupList = this.croupGroupListSecond
        let response = this.croupGroupList.filter(x => x.group_name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.croupGroupList = response


      }
      else {
        this.getCroupCroupList()
      }
    });

    this.ngForm.controls['crop_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.crop_name_list = this.crop_name_list_second
        let response = this.crop_name_list.filter(x => x.m_crop.crop_name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.crop_name_list = response


      }
      else {
        this.getCropNameList(this.ngForm.controls['crop_group'].value)
      }
    });
    this.ngForm.controls['variety_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropVarietyData = this.cropVarietyDataSecond
        let response = this.cropVarietyData.filter(x => x['m_crop_variety.variety_name'].toLowerCase().startsWith(newValue.toLowerCase()))

        this.cropVarietyData = response


      }
      else {

        this.getCropVarietyData(this.ngForm.controls['crop_name'].value)
      }
    });
  }
  ngOnInit(): void {
    let user = localStorage.getItem('BHTCurrentUser');
    this.userId = JSON.parse(user);

    this.filterPaginateSearch.itemListPageSize = 50;
    this.notifiedvalue('notified');
    // this.getPageData();
    this.getCroupCroupList();
    this.ngForm.controls['crop_name'].disable();
    this.ngForm.controls['variety_name'].disable();

    this.dropdownSettings = {
      idField: 'value',
      textField: 'fieldName',
      enableCheckAll: true,
      allowSearchFilter: true,
      limitSelection: -1,
    };

  }
  notifiedvalue(data) {
    this.isNotified = data;
    this.varietyFieldDropdown = [
      { fieldName: "Crop Group", value: "crop_group" },
      { fieldName: "Crop Name", value: "crop_name" },
      { fieldName: "Variety Name", value: "variety_name" },
      { fieldName: "Variety Code	", value: "variety_code" },
      { fieldName: "Variety Type", value: "type" },
      { fieldName: "Realese By", value: "reales_by" },// new 

      
      { fieldName: "Developed By	", value: "developed_by" },
      { fieldName: "Year of Release", value: "year_of_release" },
      { fieldName: "State to Release", value: "state_to_release" },// new 
      { fieldName: "Recommended State(s) For Cultivation", value: "recommended_state_for_cultivation" },// new 
      { fieldName: "IET Number/Name By Which Tested", value: "iet_number_by_which_tested" },// new 
      { fieldName: "Responsible Institution for Developing Breeder Seed", value: "responsible_insitution_developing_seed" },// new 
      { fieldName: "Recemblance to Variety", value: "recemblance_to_variety" },// new 
      { fieldName: "Type Maturity", value: "maturity" },
      { fieldName: "Matuarity Day From", value: "matuarity_day_from" },
      // { fieldName: "Matuarity Day to", value: "matuarity_day_to" },
      // { fieldName: "Spacing From", value: "spacing_from" },
      // { fieldName: "spacing to", value: "spacing_to" },
      { fieldName: "Generic Morphological", value: "generic_morphological" },
      { fieldName: "Specific Morphological Characteristics", value: "specific_morphological" },
      { fieldName: "Average Yield", value: "average_yeild_from" },
      { fieldName: "Adoptation And Recommended Ecology", value: "ecology" },

      // { fieldName: "Seed Rate", value: "seed_rate" },
      // { fieldName: "Average Yeild From", value: "average_yeild_from" },
      // { fieldName: "Average Yeild to", value: "average_yeild_to" },
      { fieldName: "Agronomic Features", value: "agronomic_features" },
      { fieldName: "Reaction Major Diseases", value: "reaction_major_diseases" },
      { fieldName: "Reaction To Major Pets", value: "reaction_to_pets" },
      { fieldName: "Fertilizer Dosage (Kg/Ha)", value: "fertilizer_dosage" },

      // { fieldName: "Specific Morphological", value: "specific_morphological" },
      // // { fieldName: "Notification Date", value: "notification_date" },

      // { fieldName: "Nitrogen", value: "nitrogen" },
      // { fieldName: "Phosphorus", value: "phosphorus" },
      // { fieldName: "Potash", value: "potash" },
      // { fieldName: "Other", value: "other" },
      // { fieldName: "Fertilizer Other Name", value: "fertilizer_other_name" },

      // { fieldName: "Fertilizer Other Value", value: "fertilizer_other_value" },
      // { fieldName: "Type", value: "type" },
      // { fieldName: "Ecology", value: "ecology" },

    ];

    this.ngForm.controls['filed_data'].reset();
    if (data == "notified") {
      this.varietyFieldDropdown.push(
        { fieldName: "Notification Number", value: "notification_number" },
        { fieldName: "Meeting Number", value: "meeting_number" },
        { fieldName: "Notification Date", value: "notification_date" },
        { fieldName: "Release By", value: "release_by" }, //new
      );
      // this.varietyFieldDropdown.push({ fieldName: "Fertilizer Dosage Potash", value: "potash" },
        // { fieldName: "Fertilizer Dosage Other", value: "other" },
        // { fieldName: "Fertilizer Other Name", value: "fertilizer_other_name" },

        // { fieldName: "Fertilizer Other Value", value: "fertilizer_other_value" })

    }
    if (data == "non_notified") {
      this.varietyFieldDropdown.push(
        // { fieldName: "Introduce Year", value: "introduce_year" },
        // { fieldName: "Year of Introduction Market", value: "year_of_introduction_market" },
      )
    }
    
  this.varietyFieldDropdown=   this.varietyFieldDropdown.sort((a, b) => {
    const nameA = a.fieldName.toLowerCase();
    const nameB = b.fieldName.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
    // this.sortedVarietyFieldDropdown = this.varietyFieldDropdown.sort((a, b) => a.fieldName.localeCompare(b.fieldName));
   
  } 

  search() {
    // this.runExcelApi();

    // if ((this.ngForm.controls['filed_data'].value == "" || this.ngForm.controls['filed_data'].value == undefined && this.ngForm.controls['filed_data'].value.length == 0)) {
    if ((this.ngForm.controls['filed_data'].value == "" || this.ngForm.controls['filed_data'].value == undefined)) {

      this.searchBtn = false;
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    if ((this.ngForm.controls['crop_group'].value == "" || this.ngForm.controls['crop_group'].value == undefined && this.ngForm.controls['crop_group'].value.length == 0)) {
       this.searchBtn = false;
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


      // const route = "filter-add-characterstics-list";
      // const param = {
      //   search: {
      //     crop_group: (this.ngForm.controls["crop_group"].value),
      //     crop_name: this.ngForm.controls["crop_name"].value,
      //     variety_name: this.ngForm.controls["variety_name"].value,

      //   }

      // }
      // this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination();
      this.getPageData();
      this.runExcelApi();
      // const result = this.service.getPlansInfo(route, param).then((data: any) => {
      //   let response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data   && data['EncryptedResponse'].data.rows ? data['EncryptedResponse'].data.rows : '';

      //   console.log(response)
      //   this.filterPaginateSearch.Init(response, this, "getPageData",);

      // this.filterPaginateSearch.itemListCurrentPage = 1;
      // this.filterPaginateSearch.Init(response, this, "getPageData", undefined, response['EncryptedResponse'].data.count, true);
      // this.initSearchAndPagination();
      // this.initSearchAndPagination();
      // this.filterPaginateSearch.Init(response, this, "getPageData");
      // });
    }
  }

  dynamicGridData() {
    this.activeVarietyCode = false;
    this.activeVarietyName = false;
    this.activeCropName = false;
    this.activeCropGroup = false;
    this.activeDevelopedBy = false;

    this.matuarity_day_from = false;
    this.matuarity_day_to = false;
    this.spacing_from = false;
    this.spacing_to = false;
    this.generic_morphological = false;
    this.seed_rate = false;
    this.average_yeild_from = false;
    this.average_yeild_to = false;
    this.fertilizer_dosage = false;
    this.agronomic_features = false;
    this.adoptation = false;
    this.reaction_abiotic_stress = false;
    this.reaction_major_diseases = false;
    this.reaction_to_pets = false;
    this.specific_morphological = false;
    this.notification_date = false;
    this.year_of_introduction_market = false;
    this.notification_number = false;
    this.meeting_number = false;
    this.year_of_release = false;
    this.nitrogen = false;
    this.phosphorus = false;
    this.potash = false;
    this.other = false;
    this.resemblance_to_varietyData = false;
    this.fertilizer_other_name = false;
    this.fertilizer_other_value = false;
    this.maturity = false;
    this.type = false;
    this.eology = false;
    // console.log("this.ngForm.controls['filed_data'].value", this.ngForm.controls['filed_data'].value)
    if (this.ngForm.controls['filed_data'].value && this.ngForm.controls['crop_group'].value) {
      this.searchBtn = true;
      this.searchBtn = true;
      this.ngForm.controls['filed_data'].value.forEach(element => {
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
        if (element && element.value == "developed_by") {
          this.activeDevelopedBy = true;
        }
        if (element && element.value == "resemblance_to_variety") {
          this.resemblance_to_varietyData = true;
        }

        // ---------------------new data ---------------------------
        if (element && element.value == "matuarity_day_from") {
          this.matuarity_day_from = true;
        }
        if (element && element.value == "matuarity_day_to") {
          this.matuarity_day_to = true;
        } if (element && element.value == "spacing_from") {
          this.spacing_from = true;
        } if (element && element.value == "spacing_to") {
          this.spacing_to = true;
        } if (element && element.value == "generic_morphological") {
          this.generic_morphological = true;
        } if (element && element.value == "seed_rate") {
          this.seed_rate = true;
        } if (element && element.value == "average_yeild_from") {
          this.average_yeild_from = true;
        } if (element && element.value == "average_yeild_to") {
          this.average_yeild_to = true;
        } if (element && element.value == "agronomic_features") {
          this.agronomic_features = true;
        } if (element && element.value == "adoptation") {
          this.adoptation = true;
        } if (element && element.value == "reaction_abiotic_stress") {
          this.reaction_abiotic_stress = true;
        } if (element && element.value == "reaction_major_diseases") {
          this.reaction_major_diseases = true;
        } if (element && element.value == "reaction_to_pets") {
          this.reaction_to_pets = true;
        } if (element && element.value == "specific_morphological") {
          this.specific_morphological = true;
        } if (element && element.value == "notification_date") {
          this.notification_date = true;
        } if (element && element.value == "year_of_introduction_market") {
          this.year_of_introduction_market = true;
        } if (element && element.value == "notification_number") {
          this.notification_number = true;
        } if (element && element.value == "meeting_number") {
          this.meeting_number = true;
        } if (element && element.value == "year_of_release") {
          this.year_of_release = true;
        } if (element && element.value == "nitrogen") {
          this.nitrogen = true;
        } if (element && element.value == "phosphorus") {
          this.phosphorus = true;
        } if (element && element.value == "potash") {
          this.potash = true;
        } if (element && element.value == "other") {
          this.other = true;
        } if (element && element.value == "fertilizer_other_name") {
          this.fertilizer_other_name = true;

        } if (element && element.value == "fertilizer_dosage") {
          this.fertilizer_dosage = true;
        }
        if (element && element.value == "responsible_insitution_developing_seed") {
          this.insitutionDevelopingSeed = true;
        }
        if (element && element.value == "recommended_state_for_cultivation") {
          this.recommended_state_for_cultivation = true;
        }
        if (element && element.value == "fertilizer_other_value") {
          this.fertilizer_other_value = true;
        } if (element && element.value == "maturity") {
          this.maturity = true;
        } if (element && element.value == "type") {
          this.type = true;
        } if (element && element.value == "eology") {
          this.eology = true;
        }


        this.gridData = this.ngForm.controls['filed_data'].value;
      });
      this.gridData = this.ngForm.controls['filed_data'].value
    } else {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Fields First.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })
    }
    console.log('dynamic grid data', this.gridData);
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type
    this.service.postRequestCreator("data-characterstics-list-data-with-dynamic-filed", null, {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      search: {
        crop_group: (this.ngForm.controls["crop_group"].value),
        crop_name: this.ngForm.controls["crop_name"].value,
        variety_name: this.ngForm.controls["variety_name"].value,
        user_id: this.userId.id,
        fieldData: this.ngForm.controls['filed_data'].value,
        is_notified: this.isNotified,
        user_type: user_type,
        type: 'reporticar',

      }
    }).subscribe((apiResponse: any) => {
      console.log(apiResponse);
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.filterPaginateSearch.itemListPageSize = 50;
        console.log(apiResponse);

        this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
        // console.log(this.allData[0].m_crop);

        if (this.allData === undefined) {
          this.allData = [];
        }
        for (let i = 0; i < this.allData.length; i++) {
          this.maturity_type = this.allData[i].matuarity_type_id;
          this.maturity_type_id = this.maturity_type ? ((this.maturity_type) == 1) ? "Early" : (this.maturity_type == 2) ? "Medium" : (this.maturity_type == 3) ? "Late" : "NA" : ''
        }

        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        this.initSearchAndPagination();
      }
    });

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


  async getCropNameList(newValue) {
    const res = this.croupGroupList.filter(x => x.group_code == newValue);
    console.log(res);
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type

    if (newValue) {
      const searchFilters = {
        "search": {
          "group_code": newValue,
          user_type: user_type,
          type: 'reporticar'
        }
      };
      this.service
        .postRequestCreator("get-distrinct-crop-name-characterstics", null, searchFilters)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.crop_name_list = apiResponse.EncryptedResponse.data;
            this.crop_name_list = this.crop_name_list.sort((a, b) => a.m_crop.crop_name.localeCompare(b.m_crop.crop_name))
            this.crop_name_list_second = this.crop_name_list
            console.log("crop name list", this.crop_name_list);
          }
          else {
            this.crop_name_list = [];

          }
        });
    }

  }

  getCroupCroupList() {
    const route = "getSeedCharactersticsCropGroupData";
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type
    const param = {
      'search': {
        user_type: user_type,
        type: 'reporticar'
      }
    }
    const result = this.service.postRequestCreator(route, null, param).subscribe((data: any) => {
      this.croupGroupList = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
      this.croupGroupListSecond = this.croupGroupList
    })
  }

  // getCroupNameList() {
  //   const route = "filter-data";
  //   const result = this.service.getPlansInfo(route).then((data: any) => {
  //     this.crop_name_list = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
  //   })
  // }




  delete(id: number, cropName: string) {
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
        this.service
          .postRequestCreator("delete-data-characterstics/" + id, null, null)
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
  onSubmit(formData) {
    this.submitted = true;
    if (this.ngForm.invalid) {
      Swal.fire('Error', 'Please Fill the all Details Correctly.', 'error');
      return;
    }
    let data = {
      "crop_group_id": formData.crop_group,
      "crop_code": formData.crop_name,
      "variety_id": formData.variety_name,
    }
    this.getPageData(1, data);
  }

  clear() {
    this.searchBtn = false;
    this.activeVarietyCode = false;
    this.activeVarietyName = false;
    this.activeCropName = false;
    this.activeCropGroup = false;
    this.activeDevelopedBy = false;

    this.resemblance_to_varietyData = false;
    this.recommended_state_for_cultivation = false;

    this.matuarity_day_from = false;
    this.matuarity_day_to = false;
    this.spacing_from = false;
    this.spacing_to = false;
    this.generic_morphological = false;
    this.seed_rate = false;
    this.average_yeild_from = false;
    this.average_yeild_to = false;
    this.fertilizer_dosage = false;
    this.insitutionDevelopingSeed = false;
    this.agronomic_features = false;
    this.adoptation = false;
    this.reaction_abiotic_stress = false;
    this.reaction_major_diseases = false;
    this.reaction_to_pets = false;
    this.specific_morphological = false;
    this.notification_date = false;
    this.year_of_introduction_market = false;
    this.notification_number = false;
    this.meeting_number = false;
    this.year_of_release = false;
    this.nitrogen = false;
    this.phosphorus = false;
    this.potash = false;
    this.other = false;
    this.fertilizer_other_name = false;
    this.fertilizer_other_value = false;
    this.maturity = false;
    this.type = false;
    this.eology = false;
    this.ngForm.controls["filed_data"].reset();
    this.ngForm.controls["crop_group"].setValue("");
    
    this.ngForm.controls["crop_name"].setValue("");
    this.ngForm.controls["variety_name"].setValue("");
    this.variety_names = '';
    this.crop_names = '';
    this.crop_grops = '';
    this.disabledfieldVariety = true;
    this.disabledfieldcropName = true;
    this.croupGroupList = this.croupGroupListSecond;
    this.cropVarietyData = this.cropVarietyDataSecond;

    this.crop_name_list = this.crop_name_list_second
    this.ngForm.controls['crop_name_text'].setValue('',{ emitEvent: false })
    this.ngForm.controls['crop_text'].setValue('',{ emitEvent: false })
    this.ngForm.controls['variety_name_text'].setValue('', { emitEvent: false })
    // this.crop_name_list=[];
    // this.cropVarietyData=[];


    this.ngForm.controls['crop_name'].disable();
    this.ngForm.controls['variety_name'].disable();
    // this.filterPaginateSearch.itemListCurrentPage = 1;
    this.getPageData();
    // this.filterPaginateSearch.Init(response, this, "getPageData");
    // this.initSearchAndPagination();
  }
  // searches(){
  //   const searchFilters = {
  //     search: {
  //       crop_group:(this.ngForm.controls["crop_group"].value),
  //       // crop_name:(this.ngForm.controls["crop_name"].value),
  //       // agencyName:this.ngForm.controls["agencyName"].value
  //     }
  //   };
  //   const result = this.service.postRequestCreator("", null,searchFilters).subscribe((data: any) => {
  //     let response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data.data ? data['EncryptedResponse'].data.data : '';
  //     this.filterPaginateSearch.itemListPageSize = 10;

  //     this.filterPaginateSearch.Init(response, this, "getPageData");
  //     this.initSearchAndPagination();
  //   })


  // }

  async getCropVarietyData(newValue) {

    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type
    const searchFilters = {
      "search": {
        "crop_code": newValue,
        "cropGroup": this.ngForm.controls["crop_group"].value,
        user_type: user_type,
        type: 'reporticar'
      }
    }
    this.service
      .postRequestCreator("get-distrinct-variety-name-characterstics", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.cropVarietyData = apiResponse.EncryptedResponse.data.rows;
          // this.cropVarietyData.sort((a, b) => (a && a.m_crop_variety && a.m_crop_variety.variety_name).localeCompare(b && b.m_crop_variety && b.m_crop_variety.variety_name))
          console.log('cropData values', this.cropVarietyData);
          this.cropVarietyDataSecond = this.cropVarietyData
        } else {
          this.cropVarietyData = [];
          this.ngForm.controls['variety_name'].setValue("");
          this.ngForm.controls['variety_name'].disable();
        }
      });


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
        } else {
          // openDropdown.classList.remove('hide');
        }
      }
    }
  }

  runExcelApi() {

    // this.service.postRequestCreator("data-characterstics-list", null, {
    this.service.postRequestCreator("data-characterstics-list-data-with-dynamic-filed", null, {
      // page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 5,

      // search: {
      //   crop_group: (this.ngForm.controls["crop_group"].value),
      //   crop_name: this.ngForm.controls["crop_name"].value,
      //   variety_name: this.ngForm.controls["variety_name"].value,
      //   user_id: this.userId.id,
      //   fieldData: this.ngForm.controls['filed_data'].value,
      //   is_notified:this.isNotified
      // }

      search: {
        crop_group: (this.ngForm.controls["crop_group"].value),
        crop_name: this.ngForm.controls["crop_name"].value,
        variety_name: this.ngForm.controls["variety_name"].value,
        user_id: this.userId.id,
        fieldData: this.ngForm.controls['filed_data'].value,

        is_notified: this.isNotified
      }
    }).subscribe((apiResponse: any) => {
      console.log(apiResponse);
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        // this.filterPaginateSearch.itemListPageSize = 10;
        console.log(apiResponse);

        this.exportdata = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
        // console.log(this.exportdata[0].m_crop);

        if (this.exportdata === undefined) {
          this.exportdata = [];
        }
        // for (let i = 0; i < this.exportdata.length; i++) {
        //   this.maturity_type = this.exportdata[i].matuarity_type_id;
        //   this.maturity_type_id = this.maturity_type ? ((this.maturity_type) == 1) ? "Early" : (this.maturity_type == 2) ? "Medium" : (this.maturity_type == 3) ? "Late" : "NA" : ''
        // }

        // this.filterPaginateSearch.Init(this.exportdata, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        // this.initSearchAndPagination();
      }
    });

  }



  exportexcel(): void {


    //Pdf code end

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

  // downloadPdf(): void {
  //   // let reportDataHeader = this.ngForm.controls['filed_data'].value.map((element, index) => {
  //   //   return element.value
  //   // })
  //   // console.log("reportDataHeader", reportDataHeader)
  //   // let reportData = this.exportdata.map((element, index) => {
  //   //   let reportData = reportDataHeader.map((el, index) => {
  //   //     return element[el]
  //   //   })
  //   //   return reportData;
  //   // })
  //   let data = this.ngForm.controls['filed_data'].value;
  //    let reportDataHeader = [
  //     { text: 'S/N', bold: true },
  //   ]
  //   for (var i = 0; i < data.length; ++i) {

  //     reportDataHeader.push({ text: data[i].fieldName, bold: true });
  //   }
  //   reportDataHeader.push({ text: 'Status', bold: true },)
  //   console.log(this.exportdata,';exportdata')
  //   console.log(reportDataHeader,';datadata')
  //   let reportData = this.exportdata.map((element, index) => {
  //     let values = Object.values(element);
  //     // values = values.reverse()
     
  //     let data = values.pop()
  //     let statusVal = (element.is_active == 1) ? "ACTIVE" : "INACTIVE";
  //     let reportData = [
  //       index + 1,
  //       ...values,
  //       ...statusVal          
        
  //     ]
  //     return reportData;
  //   })
  //   reportData = [[...reportDataHeader], ...reportData]
  //   // console.log("reportDataHeader.length", reportDataHeader.length)
  //   let pageWidth = 1800
  //   let numberOfColumn = reportDataHeader.length
  //   let numberOfCharecter = 30
  //   const columnWidth = (pageWidth - (2 * 2) - (1 * numberOfColumn)) / numberOfColumn
  //   const maxFontSize = columnWidth / (1 * numberOfCharecter)

  //   const docDefinition = {
  //     pageOrientation: 'landscape',
  //     // pageSize: {
  //     //   width: 1800,
  //     //   height: 600,
  //     // },

  //     content: [
  //       { text: 'Crop Variety Characteristic', style: 'header' },
  //       { text: `Crop Group :${this.crop_grops} Crop Name :${this.crop_names} Variety Name: ${this.variety_names}` },
  //       {
  //         style: 'indenterTable',
  //         table: {
  //           // widths: [5,15,10,10,10,10,10,10,10,10],
  //           body:
  //             reportData,
  //         },
  //       },
  //     ],

  //     styles: {
  //       header: {
  //         fontSize: 18,
  //         bold: true,
  //         margin: [0, 0, 0, 10],
  //       },
  //       subheader: {
  //         fontSize: 16,
  //         bold: true,
  //         margin: [0, 10, 0, 5],
  //       },
  //       indenterTable: {

  //         fontSize: maxFontSize,
  //         margin: [0, 5, 0, 15],
  //       },
  //     },
  //   };
  //   pdfMake.createPdf(docDefinition).download('Indenter_list.pdf');

  //   //Pdf code end
  // }
  downloadPdf() {
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
     
    let reportDataHeader = [
      { text: 'S/N', bold: true },
    ]
    for (var i = 0; i < data.length; ++i) {

      reportDataHeader.push({ text: data[i].fieldName, bold: true });
    }
    reportDataHeader.push({ text: 'Status', bold: true },)

    this.selectedCol = this.ngForm.controls['filed_data'].value
    
   
    for(let item of this.exportdata){
      let items=[]
      if(item.state_data && item.state_data.length>0){
        item.state_data.forEach((el)=>{
          items.push(el.state_name)
      
              // item.state_data=items
              })
        item.state_data=items
       
      }
    }
 
    let reportData = this.exportdata.map((element, index) => {
      let values = Object.values(element);

      let data = values.pop()
      let statusVal = (element.is_active == 1) ? "ACTIVE" : "INACTIVE";
      // delete element['is_active'];
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
        { text: 'List of Variety Characteristics', style: 'header' },
        { text: `Crop Group :${this.crop_grops} Crop Name :${this.crop_names} Variety Name: ${this.variety_names}` },
        // { text: `Crop Group : ${this.crop_groups}  Crop Name: ${this.crop_names}  Variety Name: ${this.variety_names}`,  },
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
    pdfMake.createPdf(docDefinition).download('add-crop-variety-characterstics-report.pdf');
  }
  crop(data) {

    this.crop_grops = data && data.group_name ? data.group_name : '';
    this.ngForm.controls['crop_group'].setValue(data && data.group_code ? data.group_code : '')
    this.croupGroupList = this.croupGroupListSecond
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cropName(data) {
    this.crop_names = data && data.m_crop && data.m_crop.crop_name ? data.m_crop.crop_name : '';
    this.ngForm.controls['crop_name'].setValue(data && data.m_crop.crop_code ? data.m_crop.crop_code : '')
    this.crop_name_list = this.crop_name_list_second
    this.ngForm.controls['crop_name_text'].setValue('',{ emitEvent: false })
  }
  cnClick() {
    document.getElementById('crop_name').click();
  }
  varietyNames(data) {

    this.variety_names = data && data.variety_name ? data.variety_name : '';
    this.cropVarietyData = this.cropVarietyDataSecond
    this.ngForm.controls['variety_name_text'].setValue('', { emitEvent: false })
    this.ngForm.controls['variety_name'].setValue(data && data.variety_code ? data.variety_code: '')
  }
  cvClick() {
    document.getElementById('variety_name').click();
  }
  getCropNamefrommlist(crop) {
    let temp = []
    crop.forEach(obj => {
      if (obj.state_name) {
        temp.push(obj.state_name)
      }


    })
    return temp;

  }
}

