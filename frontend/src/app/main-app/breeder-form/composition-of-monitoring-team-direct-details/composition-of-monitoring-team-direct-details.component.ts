import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { MasterService } from 'src/app/services/master/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';

@Component({
  selector: 'app-composition-of-monitoring-team-direct-details',
  templateUrl: './composition-of-monitoring-team-direct-details.component.html',
  styleUrls: ['./composition-of-monitoring-team-direct-details.component.css']
})
export class CompositionOfMonitoringTeamDirectDetailsComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm: FormGroup = new FormGroup([]);
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  dropdownSettingsPlots: IDropdownSettings = {};
  allData: any;
  selectedItems:any;
  is_update: boolean = false;
  isCrop: boolean = false;
  submitted: boolean = false;
  agency = [
  ]
  isSearch: boolean = true;
  varietyList = [];
  isDeveloped: boolean = false;
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryCropData: any;
  inventoryVarietyData: any;
  datatodisplay = [];
  showTab = false;
  editMode = false;
  bsp1Arr: any;
  inventoryCropDatasecond: any;
  stateList = [];
  stateListSecond: any = [];
  selected_state;
  designationList: any;
  districtList = [];
  districtListsecond;
  stateSecond = [];
  editId: any;
  listofDistrict: any;
  district_id: any;
  agencylist: any;
  searchElement;
  stateListForNestedAraay;
  stateListForNestedAraaySecond;
  bspsData: any;

  userId: any;
  userNameId: any;
  teamName: any;
  isExits: boolean = false;

  selectState: any;
  //search implement apr 8 
  selectDestination: any;

  varietyNames: any;
  response: any;
  Variety: any;
  VarietySecond: any;
  unit: string;
  is_developed: boolean;
  indentFlow: string;
  isHidden: boolean;
  isDirectVisible: boolean;
  filterPaginateSearchSecond: any;
  isDirectFormShow: boolean = false;
  selectUserEvent: boolean = false;
  selectagency: any;
  plotsData: any;
  constructor(private service: SeedServiceService, private breeder: BreederService, private fb: FormBuilder, private master: MasterService, private _productionCenter: ProductioncenterService) {
    this.createForm();
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
      bsp1Arr: this.fb.array([
        // this.bsp2arr(),
      ]),
      plots:['']
    });

    // this.ngForm.disable();
    this.ngForm.controls['year'].enable();
    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['season'].enable();
        this.allData = []
        this.ngForm.controls['plots'].setValue('');
        this.isCrop = false;
        this.bspc.clear();
        this.ngForm.controls['id'].setValue('')
        this.getSeasonData();
      }
    });
    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.allData = [],
          this.isCrop = false;
        this.bspc.clear();
        this.ngForm.controls['id'].setValue('')
        this.ngForm.controls['plots'].setValue('');
        this.ngForm.controls['crop'].setValue('');
        this.ngForm.controls['crop'].enable();
        this.getCropData();
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.isCrop = false;
        this.allData = []
        this.ngForm.controls['state'].setValue('');
        this.selected_state = '',
        // this.getMonitoringTeampLotsData();
        // this.ngForm.controls['plots'].setValue('');
        this.ngForm.controls['id'].setValue('')
        this.ngForm.controls['variety'].enable(); this.getUnit(newvalue); this.getVarietyDetails();
      }
    });

    this.ngForm.controls['state_text_nested'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log('newValue state_text_nested', newValue);
        this.stateList = this.stateListSecond
        let response = this.stateList.filter(x => x.state_name.toLowerCase().includes(newValue.toLowerCase()))
        this.stateList = response;
      }
      else {
        this.getStatelist()
      }
    });
    this.ngForm.controls['team_leader'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['bsp1Arr']['controls'][newvalue].controls['is_team_lead'].setValue(1);
      }
    });
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

  get bspc(): FormArray {
    return this.ngForm.get('bsp1Arr') as FormArray;
  }

  ngOnInit(): void {
    this.fetchData();
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    this.userId = data.id;
  }
  Init(filterPaginateSearch) {
    this.getDesignationList(0);
    this.getAgency(0);
    this.getStatelistSecond(0);
    this.filterPaginateSearchSecond = filterPaginateSearch;

    if (this.filterPaginateSearchSecond) {
      this.bspc.clear();
      if (this.filterPaginateSearchSecond['indentFlow'] == "true") {
        this.isHidden = true;
      } else {
        this.isHidden = true;
      }
      this.addMore(0)
    }

  }
  fetchData() {
    this.dropdownSettingsPlots = {
      idField: 'id',
      textField: 'plot',
      enableCheckAll: true,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      // limitSelection: -1,
    };
    this.getStatelist();
    this.getYearData();
  }
  generateRandomNumber(digits: number): number {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  checkTeamMemUserName() {
    let route = "check-team-monotoring-team-user-data";
    this._productionCenter.postRequestCreator(route, null, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        let teamMemberUserData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        if (teamMemberUserData && teamMemberUserData.length > 0 || teamMemberUserData !== undefined) {
          this.userNameId = teamMemberUserData.user_name;
          this.fetchQntInventryData(null, (this.userNameId ? this.userNameId : 1001));
        }
      }
    })
  }
  getMonitoringTeampLotsData(data,isUpdate) {
    this.plotsData = [];
    console.log(data,'data===')
    let route = "get-monitoring-team-plots-data";
    let param = {
      search: {
        year: data && data.year ? data.year : '',
        season: data && data.season ? data.season : '',
        crop_code: data && data.crop_code ? data.crop_code : data.crop ? data.crop:'',
        user_id:data.user_id?data.user_id:'',
        isUpdate:isUpdate?isUpdate:''
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        if (res.EncryptedResponse.data && res.EncryptedResponse.data.length) {
          this.plotsData = res.EncryptedResponse.data;
          // if(this.plotsData && this.plotsData.length){
          //   this.switchtype = true;
          // }else{
          //   this.switchtype = false;
          // }
        }
      }
    });
  }
  // check-team-monotoring-is-exits
  checkTeamMonotoringIsExits(data) {
    let route = "check-team-monotoring-is-exits-direct";
    let param = {
      search: {
        year: data && data.year ? data.year : '',
        season: data && data.season ? data.season : '',
        crop_code: data && data.crop_code ? data.crop_code : '',
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 201) {
        if (res.EncryptedResponse.data && res.EncryptedResponse.data.length) {
          // alert("bye");
          // this.isExits = true; //old condition
          this.isExits = false;
          this.ngForm.controls['name'].setValue('');
          return;
        }
      }
      else {
        this.isExits = false;
      }
    });
  }

  getDesignationList(i) {
    console.log('i', i);
    this.master.postRequestCreator('get-designation-of-spp', null, {
      type: "MONITORING_TEAM"
    }).subscribe(data => {
      this.designationList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      const formArray = this.ngForm.get('bsp1Arr') as FormArray;
      if (this.designationList) {
        formArray.controls[i]['controls'].designation_id.patchValue(this.designationList);
      }
      if (formArray && formArray.controls && formArray.controls[i] && formArray.controls[i]['controls']
        && formArray.controls[i]['controls'].designation_id
      ) {
        formArray.controls[i]['controls'].designation_id.designationList = this.designationList ? this.designationList : '';
        formArray.controls[i]['controls'].designation_id.designationListSecond = this.designationList ? this.designationList : ''
      }
    })
  }

  getAgency(i) {
    this.master.postRequestCreator('get-agency-type').subscribe(data => {
      this.agencylist = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      const formArray = this.ngForm.get('bsp1Arr') as FormArray;
      if (this.agencylist) {
        formArray.controls[i]['controls'].agency_id.patchValue(this.agencylist);
      }
      if (formArray && formArray.controls && formArray.controls[i] && formArray.controls[i]['controls']
        && formArray.controls[i]['controls'].agency_id
      ) {
        formArray.controls[i]['controls'].agency_id.agencyList = this.agencylist ? this.agencylist : '';
        formArray.controls[i]['controls'].agency_id.agencyListSecond = this.agencylist ? this.agencylist : ''
      }
    })
  }

  fetchQntInventryData(data: any, teamUserName) {
    let route = "get-team-monotoring-team-all-data-direct";
    let param = {
      search: {
        crop_code: this.filterPaginateSearchSecond && this.filterPaginateSearchSecond['crop_code'] ? this.filterPaginateSearchSecond['crop_code'] : '',
        year: this.filterPaginateSearchSecond && this.filterPaginateSearchSecond['year'] ? this.filterPaginateSearchSecond['year'] : '',
        season: this.filterPaginateSearchSecond && this.filterPaginateSearchSecond['season'] ? this.filterPaginateSearchSecond['season'] : '',
        // state: this.filterPaginateSearchSecond &&  this.filterPaginateSearchSecond['state'] ? this.filterPaginateSearchSecond['state']:'',
      }
    };
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (data) {
        this.ngForm.controls['name'].patchValue(data.name);
        this.ngForm.controls['id'].patchValue(data.id);
        this.ngForm.controls['plots'].patchValue(data.plots);
        data['team_member'].forEach((ele, i) => {
          console.log('ele=======>', ele)
          // let state =
          this.getStatelistSecond(i)
          this.addMore(i);
          this.getDistrictList(ele.state_code, i);

          // search implement 8 april
          this.getDesignationList(i);
          this.getAgency(i);
          this.ngForm.controls['bsp1Arr']['controls'][i].controls['designation'].setValue({ name: ele && ele.designation_name ? ele.designation_name : '', id: ele && ele.desination_id ? ele.desination_id : '' })
          this.ngForm.controls['bsp1Arr']['controls'][i].controls['agency'].setValue({ name: ele && ele.agency_type ? ele.agency_type : '', id: ele && ele.agency_type_id ? ele.agency_type_id : '' })
          this.ngForm.controls['bsp1Arr']['controls'][i].controls['state_code'].setValue({ state_code: ele && ele.state_code ? ele.state_code : '', state_name: ele && ele.state_name ? ele.state_name : '' });
          this.ngForm.controls['bsp1Arr']['controls'][i].controls['district_code'].setValue({ district_code: ele && ele.district_code ? ele.district_code : '', district_name: ele && ele.district_name ? ele.district_name : '' });


          this.ngForm.controls['bsp1Arr']['controls'][i].patchValue({
            ids: i,
            // designation_id: ele && ele.desination_id ? ele.desination_id : '',
            // type_of_agency: ele && ele.agency_type_id ? ele.agency_type_id : '',
            // district_code: ele && ele.district_code ? ele.district_code : '',
            // state_code: ele && ele.state_code ? ele.state_code : '',
            name: ele && ele.agency_name ? ele.agency_name : '',
            mobile_number: ele && ele.mobile_number ? ele.mobile_number : '',
            email_id: ele && ele.email_id ? ele.email_id : '',
            address: ele && ele.address ? ele.address : '',
            pin_code: ele && ele.pin_code ? ele.pin_code : '',
            user_name: ele && ele.user_name ? ele.user_name : '',
            // is_team_lead:0
          })
          if (ele.is_team_lead == 1) {
            this.ngForm.controls['bsp1Arr']['controls'][i].controls['is_team_lead'].setValue(0)
            this.selectTeamData(i);
          }
        })
      } else {
        if (res.EncryptedResponse.status_code === 200) {
          this.isDirectFormShow = false;
          this.bspsData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
          if (this.bspsData && this.bspsData.length > 0 && this.bspsData !== undefined) {
            this.ngForm.controls['name'].patchValue(this.bspsData[0].name);
            this.bspsData[0]['team_member'].forEach((ele, i) => {
              if (this.ngForm.controls['bsp1Arr'].value.length > 1) {
                this.remove(i);
              }
              this.getStatelistSecond(i);
              this.addMore(i);
              this.getDistrictList(ele.state_code, i);

              // search implement 8 april
              this.getDesignationList(i);
              this.getAgency(i);
              this.ngForm.controls['bsp1Arr']['controls'][i].controls['state_code'].setValue({ state_code: ele && ele.state_code ? ele.state_code : '', state_name: ele && ele.state_name ? ele.state_name : '' });
              this.ngForm.controls['bsp1Arr']['controls'][i].controls['district_code'].setValue({ district_code: ele && ele.district_code ? ele.district_code : '', district_name: ele && ele.district_name ? ele.district_name : '' });
              let randomPin = this.generateRandomNumber(4);
              this.ngForm.controls['bsp1Arr']['controls'][i].patchValue({
                ids: i,
                designation_id: ele && ele.designation_id ? ele.designation_id : '',
                type_of_agency: ele && ele.agency_id ? ele.agency_id : '',
                // district_code: ele && ele.district_code ? ele.district_code : '',
                // state_code: ele && ele.state_code ? ele.state_code : '',
                name: '',
                mobile_number: '',
                email_id: '',
                address: '',
                pin_code: randomPin,
                user_name: '',
                is_team_lead: ele && ele.is_team_lead ? ele.is_team_lead : 0
              })
            })
          }
        } else {
          this.isDirectFormShow = true;
        }
      }
    })
  }

  selectTeamData(event) {
    this.selectUserEvent = true;
    this.teamName = "";
    this.ngForm.controls['bsp1Arr'].value.forEach((element, i) => {
      this.ngForm.controls['bsp1Arr']['controls'][i].controls['is_team_lead'].setValue(0)
      if (i == event) {
        let designation = this.designationList.filter(item => item.id == element.designation.id);
        let agency = this.agencylist.filter(item => item.id == element.agency.id)
        this.teamName = (element && element.name ? element.name : '') + ',' + (designation && designation[0] && designation[0].name ? designation[0].name : '') + ',' + (agency && agency[0] && agency[0].name ? agency[0].name : '');
        this.ngForm.controls['bsp1Arr']['controls'][i].controls['is_team_lead'].setValue(1)

      }
    });
  }
  getDesignation(data) {
    let designation = this.designationList.filter(item => item.id == data.id);
    let designationName = designation && designation[0] && designation[0].name ? designation[0].name : '';
    return designationName;
  }
  getAgencyData(data) {
    let agency = this.agencylist.filter(item => item.id == data.id)
    return agency[0].name
  }
  getYearData() {
    const route = "get-team-monotoring-team-year-data";
    this._productionCenter.postRequestCreator(route, null, null).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryYearData = data.EncryptedResponse.data
      }
    })
  }

  getSeasonData() {
    const route = "get-team-monotoring-team-season-data";
    this._productionCenter.postRequestCreator(route, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "user_type": "bspc"
      }
    }, null).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventorySeasonData = data.EncryptedResponse.data
      }
    })
  }

  getCropData() {
    const route = "get-team-monotoring-team-crop-data";
    this._productionCenter.postRequestCreator(route, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "user_type": "bspc"
      }
    }, null).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code === 200) {
        this.inventoryCropData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
        this.inventoryCropDatasecond = this.inventoryCropData
      }
    })
  }

  getStatelist() {
    const param = {
      is_state: 1
    }
    this.master.postRequestCreator('get-all-state-list-data', null, param).subscribe(data => {
      this.stateList = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      this.stateListSecond = this.stateList
      this.stateListForNestedAraay = this.stateList ? this.stateList : '';
      this.stateListForNestedAraaySecond = this.stateListForNestedAraay ? this.stateListForNestedAraay : ''
      const formArray = this.ngForm.get('bsp1Arr') as FormArray;
      this.stateListForNestedAraaySecond = this.stateListForNestedAraay ? this.stateListForNestedAraay : ''
    })
  }

  changeFormType(value) {
    if (value === 'direct') {
      this.isDirectVisible = true;
    } else {
      this.isDirectVisible = false;
    }
  }
  getDistrictList(newValue, i) {
    const param = {
      search: {
        state_code: newValue
      }
    }
    this.master.postRequestCreator('get-district-list', null, param).subscribe(data => {
      this.districtList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      this.districtListsecond = this.districtList
      if (this.districtListsecond) {
        this.ngForm.controls['bsp1Arr']['controls'][i].controls['ditrict_array'].patchValue(this.districtListsecond);
      }
      const formArray = this.ngForm.get('bsp1Arr') as FormArray;

      if (formArray && formArray.controls && formArray.controls[i] && formArray.controls[i]['controls']
        && formArray.controls[i]['controls'].district
      ) {
        formArray.controls[i]['controls'].district.distictList = this.districtList ? this.districtList : '';
        formArray.controls[i]['controls'].district.distictListSecond = this.districtList ? this.districtList : ''
      }
    })
  }

  selectDistrictValue(event, i) {
    this.getDistrictList(event.target.value, i)
  }

  getDistrictListSecond(newValue) {
    const param = {
      search: {
        state_code: newValue
      }
    }
    this.master.postRequestCreator('get-district-list', null, param).subscribe(data => {
      this.listofDistrict = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
    })
  }


  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    // console.log("hiiii");
    // if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop'].value) {
    //   // Swal.fire({
    //   //   toast: false,
    //   //   icon: "warning",
    //   //   title: "Please Select All Required Field",
    //   //   position: "center",
    //   //   showConfirmButton: true,
    //   //   showCancelButton: false,
    //   //   confirmButtonText: "Yes",
    //   //   cancelButtonText: "No",
    //   // })
    //   // return;
    // } else {
    // this.checkTeamMemUserName();
    this.isSearch = false;
    this.isCrop = true;
    let varietyCodeArr = [];
    this.showTab = true;
    this._productionCenter.postRequestCreator("get-team-monotoring-team-list-direct-data", {
      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      pageSize: 50,
      search: {
        crop_code: this.filterPaginateSearchSecond && this.filterPaginateSearchSecond['crop_code'] ? this.filterPaginateSearchSecond['crop_code'] : '',
        year: this.filterPaginateSearchSecond && this.filterPaginateSearchSecond['year'] ? this.filterPaginateSearchSecond['year'] : '',
        season: this.filterPaginateSearchSecond && this.filterPaginateSearchSecond['season'] ? this.filterPaginateSearchSecond['season'] : '',
        state: this.filterPaginateSearchSecond && this.filterPaginateSearchSecond['state'] ? this.filterPaginateSearchSecond['state'] : '',
        // idArr:ids && (ids.length>0) ? ids:''
        // user_id: this.userId.id
      }
    }, null).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        // this.filterPaginateSearch.itemListPageSize = 4;
        this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data : '';
        if (this.allData === undefined) {
          this.allData = [];
        }
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, 2, true);

        // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        // this.initSearchAndPagination();
      }
    });
    // }
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

  revertDataCancelation() {
    this.bspc.clear();
    this.isCrop = false;
    this.is_update = false;
    this.isSearch = true;
    this.isDeveloped = false;
    this.showTab = false;
  }
  resetFormSecond() {
    this.showTab = false;
    this.isDirectFormShow = false;
  }
  resetForm() {
    this.bspc.clear();
    this.is_update = false;
    this.isCrop = false;
    this.ngForm.controls['id'].setValue('');
    this.teamName = '';
    this.isHidden = false;
  }

  editFunctinality(data) {
    this.is_update = true;
    this.isCrop = true;
    this.isExits = false;
    if (data) {
      this.bspc.clear();
      this.getMonitoringTeampLotsData(data,'is_update')
      this.ngForm.controls['year'].patchValue(data.year, { emitEvent: false });
      this.ngForm.controls['season'].patchValue(data.season, { emitEvent: false });
      this.ngForm.controls['crop'].patchValue(data.crop, { emitEvent: false });
      this.fetchQntInventryData(data, null);
    }
  }

  saveForm() {
    this.submitted = true;
    if (!this.ngForm.value) {
      Swal.fire({
        toast: false,
        icon: "warning",
        title: "Please Select All Required Field",
        position: "center",
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      })
      return;
    }
    if (this.ngForm.controls['bsp1Arr'].value.length < 1) {
      Swal.fire({
        toast: false,
        icon: "warning",
        title: "Please Select All Required Field",
        position: "center",
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      })
      return;
    }
    if (this.ngForm.invalid) {
      if (this.ngForm.controls['bsp1Arr'].value) {
        this.ngForm.controls['bsp1Arr'].value.forEach((el, i) => {
          if (this.ngForm.controls['bsp1Arr']['controls'][i].status == 'INVALID') {
            if (this.ngForm.controls['bsp1Arr']['controls'][i].controls['email_id'].status == "INVALID") {
              Swal.fire({
                title: '<p style="font-size:25px;">Please Fill Email ID Correctly.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#B64B1D'
              })
              return;
            }
            if (this.ngForm.controls['bsp1Arr']['controls'][i].controls['mobile_number'].status == "INVALID") {
              Swal.fire({
                title: '<p style="font-size:25px;">Please Fill Mobile Number Correctly.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#B64B1D'
              })
              return;
            }
            return;
          }
        });
      } else {
        Swal.fire({
          toast: false,
          icon: "warning",
          title: "Please Select All Required Field",
          position: "center",
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        })
        return;
      }
      // return;
    }
    if (!this.selectUserEvent) {
      Swal.fire({
        toast: false,
        icon: "warning",
        title: "Please Select All Required Field",
        position: "center",
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      })
      return
    }
    if (this.ngForm.controls["plots"].value.length == 0) {
      Swal.fire({
        toast: false,
        icon: "warning",
        title: "Please Select Plots",
        position: "center",
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      })
      return;
    }
    let param = {
      year: this.filterPaginateSearchSecond['year'],
      season: this.filterPaginateSearchSecond['season'],
      crop_code: this.filterPaginateSearchSecond['crop_code'],
      variety_code: this.ngForm.controls['variety'].value,
      member_array: this.ngForm.controls['bsp1Arr'].value,
      name: this.ngForm.controls['name'].value,
      user_id: this.userId,
      national_value_check:false,
      plots:this.ngForm.controls['plots'].value,
      form_type: 'direct'
    }
    let route = "add-team-monotoring-team-all-data";

    if (this.ngForm.controls['id'].value) {
      param['id'] = this.ngForm.controls['id'].value;
      this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
        if (res.EncryptedResponse.status_code === 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Updated Successfully.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
          this.ngForm.controls['plots'].setValue('');
          this.bspc.clear();
          this.getPageData();
          this.isCrop = false;
          this.is_update = false;
          this.getMonitoringTeampLotsData(null,null)
          this.resetForm();
        } else {
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
        }
      });
    } else {
      this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
        if (res.EncryptedResponse.status_code === 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Saved Successfully.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
          this.ngForm.controls['plots'].setValue('');
          this.getPageData();
          this.bspc.clear();
          this.isCrop = false;
          this.is_update = false;
          this.resetForm();
          this.getMonitoringTeampLotsData(null,null)
        } else if (res.EncryptedResponse.status_code === 201) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Already Exits.</p>',
            icon: 'warning',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
          return;
        }
        else {
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
        }
      });
    }

  }
  cvClick(i) {
    document.getElementById('variety_name' + i).click();
  }
  getStatelistSecond(i) {
    // get-state-list-v2
    const param = {
      is_state: 1
    }
    this.master.postRequestCreator('get-all-state-list-data', null, param).subscribe(data => {
      this.stateList = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      this.stateListSecond = this.stateList

      // this.stateListData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      // this.stateListForNestedAraay = this.stateList ? this.stateList : '';
      const formArray = this.ngForm.get('bsp1Arr') as FormArray;

      if (formArray && formArray.controls && formArray.controls[i] && formArray.controls[i]['controls']
        && formArray.controls[i]['controls'].state

        // && formArray.controls[i]['controls'].total_quantity.controls[skillIndex].controls.stage

      ) {
        formArray.controls[i]['controls'].state.stateList = this.stateList ? this.stateList : '';
        formArray.controls[i]['controls'].state.stateListSecond = this.stateList ? this.stateList : ''
        // formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.stage.stageList = response ? response : []
      }
      // this.stateListForNestedAraaySecond = this.stateListForNestedAraay ? this.stateListForNestedAraay : ''

    })
  }
  filterNestedStateName(e, i) {
    console.log("event list", e);
    if (e) {
      this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state.stateList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state.stateListSecond;
      if (this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state.stateList && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state.stateList.length > 0) {
        this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state.stateList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state.stateList.filter(x => x.state_name.toLowerCase().includes(e.toLowerCase()))

      }
    }
    else {
      this.getStatelistSecond(i)
    }

  }

  filterDistrictName(e, i) {
    if (e) {
      this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district.distictList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district.distictListSecond;
      if (this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district.distictList && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district.distictList.length > 0) {
        this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district.distictList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district.distictList.filter(x => x.district_name.toLowerCase().includes(e.toLowerCase()))
      }
    } else {
      this.getDistrictList(this.ngForm.controls['bsp1Arr']['controls'][i].controls['state'].value.state_code, i)
    }

  }
  // search implemnt 8 apr
  filterDesignationName(e, i) {
    if (e) {
      this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id.designationList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id.designationListSecond;
      if (this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id.designationListSecond && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id.designationListSecond.length > 0) {
        this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id.designationList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation_id.designationListSecond.filter(x => x.name.toLowerCase().includes(e.toLowerCase()))
      }
    } else {
      this.getDesignationList(i)
    }

  }
  filterAgencyName(e, i) {
    console.log('agency name filter', e);
    if (e) {
      this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].agency_id.agencyList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].agency_id.agencyListSecond;
      if (this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].agency_id && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].agency_id.agencyListSecond && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].agency_id.agencyListSecond.length > 0) {
        this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].agency_id.agencyList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].agency_id.agencyListSecond.filter(x => x.name.toLowerCase().includes(e.toLowerCase()))
      }
    } else {
      this.getAgency(i)
    }
  }
  VarieyName(data, index, $event) {
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['district_code'].setValue(data);
    this.district_id = data && data.id ? data.id : '';
    this.ngForm.controls['bsp1Arr']['controls'][index]['controls'].district_text.setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][index]['controls'].district.distictList = this.ngForm.controls['bsp1Arr']['controls'][index]['controls'].district.distictListSecond;

    // this.getDistrictListSecond($event.target.value)
  }
  stateData(data, index, $event) {
    console.log(data, 'stateData')
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['state_code'].setValue(data);
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['stateData_text'].setValue('');
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['district_code'].setValue('');
    this.ngForm.controls['bsp1Arr']['controls'][index]['controls'].state_text_nested.setValue('')
    let stateId = data && data.state_code ? data.state_code : ''
    this.getDistrictList(stateId ? stateId : '', index)
    // this.varietyId = data && data.id ? data.id : ''
  }
  district(data, index, $event) {
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['district'].setValue(data);
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['districtData_text'].setValue('');
  }

  // search filter implement 8 apr
  designation(data, index, $event) {
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['designation'].setValue(data);
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['designation_text'].setValue('');
  }
  agencyName(data, index, $event) {
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['agency'].setValue(data);
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['agency_text'].setValue('');
  }

  deleteData(data) {
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
        let route = "delete-team-monotoring-team-all-data";
        this._productionCenter.postRequestCreator(route, { id: data }, null).subscribe(res => {
          Swal.fire({
            title: "Deleted!",
            text: "Your data has been deleted.",
            icon: "success"
          });
          this.isExits = false;
          this.is_update = false;
          this.ngForm.controls['plots'].setValue('');
          this.getPageData();
          this.addMore(0);
          this.getMonitoringTeampLotsData(null,null)
          this.resetForm();
        });
      }
    });
  }
  csStateClick(i) {
    document.getElementById('states' + i).click();

  }

  cdClick(i) {
    document.getElementById('district' + i).click();

  }

  // serch implement destination / agency (apr 8)
  cdestinationClick(i) {
    document.getElementById('destination' + i).click();

  }
  cagencyClick(i) {
    document.getElementById('agency' + i).click();

  }
  addMore(i) {
    this.bspc.push(this.bspcCreateForm());
    this.getDesignationList(i + 1);
    this.getAgency(i + 1);
    this.getStatelistSecond(i + 1);
  }

  remove(rowIndex: number) {
    this.bspc.removeAt(rowIndex);
  }
  transformToUppercase(event, i) {
    this.ngForm.controls['bsp1Arr']['controls'][i].controls['address'].valueChanges.subscribe(value => {
      this.ngForm.controls['bsp1Arr']['controls'][i].controls['address'].patchValue(value.toUpperCase(), { emitEvent: false });
    });
    // this.ngForm.controls['bsp1Arr']['controls'][i].controls['address'].setValue(event.target.value.toUpperCase())
  }
  notifiedvalue(value) {
    if (value == "direct")
      this.indentFlow = "direct";
    if (value == "yes") {
      this.is_developed = false;
    } else {
      this.is_developed = true;
    }
  }
  getUnit(item) {
    let value = this.ngForm.controls['crop'].value && (this.ngForm.controls['crop'].value.slice(0, 1)) == 'A' ? 'Qt' : 'Kg';
    this.unit = value
    return value

  }
  getVarietyDetails() {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id

    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop'].value,
        user_id: UserId ? UserId.toString() : '',

      }

    }
    this._productionCenter.postRequestCreator('get-bsp-proforma-1s-varieties-level-1', param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.response = response;
      this.Variety = response && response.varietyList ? response.varietyList : '';
      this.VarietySecond = this.Variety;
      this.varietyList = this.Variety;
    })
  }
  getPlotName(plotDataValue){
    let plotArray = [];
    console.log('plot',plotDataValue);
    for (let key of plotDataValue){
      plotArray.push(' '+key.plot)
    }
    let temp = plotArray.toString();
    console.log('temp====',temp);
    return temp;
  }
}
