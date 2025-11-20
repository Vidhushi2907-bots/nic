import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { MasterService } from 'src/app/services/master/master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-add-plant-list',
  templateUrl: './add-plant-list.component.html',
  styleUrls: ['./add-plant-list.component.css']
})
export class AddPlantListComponent implements OnInit {

  @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  submissionid = this.route.snapshot.paramMap.get('submissionid'); response: any;
  selectCrop: any;
  ngForm!: FormGroup;
  agency_name: any;
  disabledfield: boolean = false;
  cancelbtn!: boolean;
  isView: boolean = false;
  stateList: any;
  submitted: boolean = false;
  agencyName: any;
  noData: boolean = false;
  agencyNameList: any;
  resultAgencyData: any;
  userId: any;
  searchFilterData = false;
  districtList: any;
  selected_state;
  instituteList: any;
  stateListsecond: any;
  selected_district;
  selected_agency: any;
  disabledfieldAgency = true
  districtListSecond: any;
  instituteListSecond: any;
  Userdata: any;
  disabledfielddistrict = true
  userType: any;
  isActionBtnDisable: boolean;
  constructor(
    private restService: RestService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private service: SeedServiceService) {
    this.createEnrollForm();
    this.userType = this.masterService?.userBasicData?.user_type ?? 'NA';
    this.isActionBtnDisable = this.userType === 'SUPERADMIN';
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      state_id: new FormControl(''),
      agency_id: new FormControl(''),
      district_id: new FormControl(''),
      institute_name: new FormControl(''),
      state_text: new FormControl(''),
      district_text: new FormControl(''),
      agency_text: new FormControl(''),


    });

    this.ngForm.controls["state_id"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['district_id'].enable();
        this.getDistrictList(newValue)
        this.disabledfielddistrict = false
        this.searchFilterData = false;
        this.selected_district = '';
      }
    })
    this.ngForm.controls["district_id"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['institute_name'].enable();
        this.getInstituteList()
        this.searchFilterData = false
        this.disabledfieldAgency = false
      }
    })
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.stateList = this.stateListsecond
        let response = this.stateList.filter(x => x.state_name.toLowerCase().includes(newValue.toLowerCase()))

        this.stateList = response

      }
      else {
        this.getStateList()

      }
    });
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.districtList = this.districtListSecond
        let response = this.districtList.filter(x => x.district_name.toLowerCase().includes(newValue.toLowerCase()))
        this.districtList = response
      }
      else {
        this.getDistrictList(this.ngForm.controls['state_id'].value)

      }
    });
    this.ngForm.controls['agency_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.instituteList = this.instituteListSecond
        let response = this.instituteList.filter(x => x.plant_name.toLowerCase().includes(newValue.toLowerCase()))
        this.instituteList = response
        if (this.instituteList) {
          this.instituteList = this.instituteList.sort((a, b) => a.plant_name.toLowerCase().localeCompare(b.plant_name.toLowerCase())

          );
        }


      }
      else {
        this.getInstituteList()

      }
    });
  }

  logindata() {
    // console.log("okk");
    this.service.postRequestCreator('islastLogin', null, {
      "user_type": "SPP",
    }).subscribe(res => {
      this.Userdata = res;
      console.log("valuedata", this.Userdata);
    });
  }


  ngOnInit(): void {
    // localStorage.setItem('logined_user', "Seed");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   // location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }

    //get user id from localstorage
    let user = localStorage.getItem('BHTCurrentUser')
    this.userId = JSON.parse(user)
    this.logindata();
    this.submissionid = this.route.snapshot.paramMap.get('submissionid');
    this.getPageData();
    this.getStateList();
    // this.getAgencyName();

    this.ngForm.controls['institute_name'].disable();
    this.ngForm.controls['district_id'].disable();
  }

  async getStateList() {
    this.service
      .postRequestCreator("getPlantDeatilsState")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.stateList = apiResponse.EncryptedResponse.data.rows;
          this.stateListsecond = this.stateList
        }
      });

  }
  async getDistrictList(newValue) {
    let data = {
      search: {
        state_code: newValue
      }
    }
    this.service
      .postRequestCreator("getPlantDeatilsDistrict", null, data)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.districtList = apiResponse.EncryptedResponse.data.rows;
          this.districtListSecond = this.districtList
        }
      });
  }
  setlastlogin(user_id) {

    let lastlogin = this.Userdata.filter(item => item.user_id == user_id);
    let lastlogin_time = lastlogin && lastlogin[0] && lastlogin[0].created_at ? lastlogin[0].created_at : "NA";
    //console.log("lastlo9009",lastlogin_time);
    if (lastlogin_time !== 'NA') {
      let formattedDate = this.datePipe.transform(lastlogin_time, 'dd-MM-yyyy HH:mm:ss');
      //console.log(formattedDate);
      return formattedDate;
    } else {
      return 'NA';
    }

  }
  async getInstituteList() {
    let data = {
      search: {
        state_id: this.ngForm.controls['state_id'].value,
        district_id: this.ngForm.controls['district_id'].value
      }
    }
    this.service
      .postRequestCreator("getPlantDeatilsNameofInstution", null, data)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.instituteList = apiResponse.EncryptedResponse.data.rows;
          this.instituteListSecond = this.instituteList
        }
      });
  }

  cropGroup(item: any) {
    this.selectCrop = item.name;
    this.ngForm.controls['crop_group'].setValue(this.selectCrop.name)
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    if (this.searchFilterData) {

      this.masterService
        .postRequestCreator("plant-list", null, {
          page: loadPageNumberData,
          // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
          pageSize: 50,
          search: {
            // "created_by": this.userId.id,
            "state_id": this.ngForm.controls["state_id"].value,
            "district_id": this.ngForm.controls["district_id"].value,
            "institute_name": this.ngForm.controls["institute_name"].value
          }
        })
        .subscribe((apiResponse: any) => {
          if (apiResponse !== undefined
            && apiResponse.EncryptedResponse !== undefined
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.filterPaginateSearch.itemListPageSize = 50;
            let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : "";


            if (allData === undefined) {
              allData = [];
            }
            if (allData.count == 0) {
              this.noData = true;
            }

            // if(allData){

            //   allData =  allData.sort((a, b) => a.plant_name.localeCompare(b.plant_name)
            //   || a.name_of_spa.localeCompare(b.name_of_spa) ||
            //   a.address.localeCompare(b.address)
            //   );
            // }
            this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
            this.initSearchAndPagination();
          }
        });
    }
    else {
      this.masterService
        .postRequestCreator("plant-list", null, {
          page: loadPageNumberData,
          // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
          pageSize: 50,
          search: searchData
        })
        .subscribe((apiResponse: any) => {
          if (apiResponse !== undefined
            && apiResponse.EncryptedResponse !== undefined
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.filterPaginateSearch.itemListPageSize = 50;
            let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : "";


            if (allData === undefined) {
              allData = [];
            }
            if (allData.count == 0) {
              this.noData = true;
            }
            this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
            this.initSearchAndPagination();
          }
        });
    }
  }

  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }

  delete(id: number, agency: string) {
    if (id) {
      let data = {
        id: id,
        user_id: this.userId && this.userId.id ? this.userId.id : '',
      }
      Swal.fire({
        toast: false,
        icon: "question",
        title: "Are You Sure To inactive?",
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
          this.masterService.postRequestCreator("deleteprocessingplant", null, data).subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {

              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
            Swal.fire({
              title: '<p style="font-size:25px;">SPP has been made inactive.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
              showCancelButton: false,
              confirmButtonColor: '#E97E15'
            })
          });
        }
      })

    }


  }
  search() {


  }

  clear() {
    this.ngForm.controls["state_id"].setValue("");
    this.ngForm.controls["district_id"].setValue("");
    this.ngForm.controls['institute_name'].setValue("");
    this.ngForm.controls['state_text'].setValue("");
    this.ngForm.controls['district_text'].setValue("");

    // this.resultAgencyData=[];
    this.ngForm.controls['district_id'].disable();
    this.ngForm.controls['institute_name'].disable();
    this.selected_agency = '';
    this.selected_district = '';
    this.selected_state = '';
    this.disabledfieldAgency = true;
    this.disabledfielddistrict = true

    this.getPageData();
    this.filterPaginateSearch.itemListCurrentPage = 1;
    // this.filterPaginateSearch.Init(response, this, "getPageData");
    this.initSearchAndPagination();
  }

  agency(item: any) {
    this.agency_name = item.name
  }

  onSubmit(formData) {
    this.submitted = true;

    if (this.ngForm.invalid) {
      Swal.fire('Error', 'Please Fill the All Details Correctly.', 'error');
      return;
    }
    if ((!this.ngForm.controls["state_id"].value && !this.ngForm.controls["agency_id"].value && !this.ngForm.controls["institute_name"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      return;
    }
    else {

      let data = {
        "state_id": formData.state_id,
        "agency_id": formData.agency_id,
      }
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.searchFilterData = true;
      this.initSearchAndPagination();
      this.getPageData();
    }
  }
  state_select(data) {

    this.selected_state = data && data['state_name'] ? data['state_name'] : '';
    this.ngForm.controls['state_id'].setValue(data && data['state_code'] ? data['state_code'] : '');
    this.ngForm.controls['state_text'].setValue("", { emitEvent: false });
    this.stateList = this.stateListsecond

  }
  cnClick() {
    document.getElementById('state').click();
  }
  district_select(data) {
    this.selected_district = data && data['district_name'] ? data['district_name'] : '';
    this.ngForm.controls['district_id'].setValue(data && data['district_code'] ? data['district_code'] : '')
    this.districtList = this.districtListSecond
    this.ngForm.controls['district_text'].setValue("", { emitEvent: false });

  }
  cdClick() {
    document.getElementById('district').click();
  }
  agency_select(data) {
    this.selected_agency = data && data.plant_name ? data.plant_name : '';
    this.ngForm.controls['institute_name'].setValue(data && data.plant_name ? data.plant_name : '')
    this.ngForm.controls['agency_text'].setValue("", { emitEvent: false });
    this.instituteList = this.instituteListSecond

  }
  caClick() {
    document.getElementById('agency').click();
  }
}
