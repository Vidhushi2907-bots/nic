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
  selector: 'app-add-indentor-list',
  templateUrl: './add-indentor-list.component.html',
  styleUrls: ['./add-indentor-list.component.css']
})
export class AddIndentorListComponent implements OnInit {


  @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  submissionid = this.route.snapshot.paramMap.get('submissionid'); response: any;
  selectCrop: any;
  ngForm!: FormGroup;
  agency_name: any;
  disabledfield: boolean = true;
  cancelbtn!: boolean;
  isView: boolean = false;
  stateList: any;
  submitted: boolean = false;
  agencyName: any;
  selected_agency;
  noData: boolean = false;
  agencyNameList: any;
  resultAgencyData: any;
  searchFilterData=false;
  userId: any;
  districtList: any;
  selected_state;
  stateListSecond: any;
  selected_district;
  disabledfieldList=true;
  disabledfieldAgency=true
  districtListSecond: any;
  resultAgencyDataSecond: any;
  Userdata:any;
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
      state_text: new FormControl(''),
      district_text: new FormControl(''),
      agency_text: new FormControl(''),
    });

    this.ngForm.controls["state_id"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['district_id'].enable();
        this.ngForm.controls['district_id'].patchValue('');
        this.disabledfield=false;
        this.selected_district='';
        this.getdistrictList(newValue)
        this.searchFilterData=false
      }
    })
    this.ngForm.controls["district_id"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['agency_id'].enable();
        this.ngForm.controls['agency_id'].patchValue('');
        this.disabledfieldAgency=false;
        this.selected_agency =''
        this.getAgencyNameList(newValue)
        this.searchFilterData=false
      }
    })
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.stateList =this.stateListSecond
        let response= this.stateList.filter(x=>(x && x.state_name ? x.state_name.toLowerCase():'').includes(newValue.toLowerCase()))      
        this.stateList=response       
      }
      else{
        this.getStateList()       
      }
    });
   
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.districtList =this.districtListSecond
        let response= this.districtList.filter(x=>x.district_name.toLowerCase().includes(newValue.toLowerCase()))
      
        this.districtList=response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)
       
      }
      else{
        this.getdistrictList(this.ngForm.controls['state_id'].value)
       
      }
    });
    this.ngForm.controls['agency_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.agencyNameList =this.resultAgencyDataSecond
        let response= this.agencyNameList.filter(x=>x.agency_name.toLowerCase().includes(newValue.toLowerCase()))
      
        this.agencyNameList   =response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)
       
      }
      else{
        this.getAgencyNameList(this.ngForm.controls['district_id'].value)
       
      }
    });

  }

  logindata(){
    // console.log("okk");
    this.service.postRequestCreator('islastLogin', null, {
      "user_type" : "IN",
    }).subscribe(res => {
      this.Userdata=res;
      console.log("valuedata",this.Userdata);
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
    console.log('userDatat',);
    this.userId = JSON.parse(user)

    this.submissionid = this.route.snapshot.paramMap.get('submissionid');
    this.getPageData();
    this.getStateList();
    this.getAgencyName();
    this.logindata();

    this.ngForm.controls['agency_id'].disable();
    this.ngForm.controls['district_id'].disable();
  }

  async getStateList() {
    this.service
      .postRequestCreator("getIndentorStateList")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.stateList = apiResponse.EncryptedResponse.data.rows;
          
    this.stateListSecond =this.stateList
        }
      });

  }
  async getdistrictList(newValue) {
    const param={
      search:{
        state:newValue
      }
    }
    this.service
      .postRequestCreator("getIndentorDistrictList",null,param)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.districtList = apiResponse.EncryptedResponse.data.rows;          
          this.districtListSecond =  this.districtList
        }
      });
  }

  setlastlogin(user_id)
  {
  let lastlogin = this.Userdata.filter(item => item.user_id==user_id);
    let lastlogin_time = lastlogin && lastlogin[0] && lastlogin[0].created_at ? lastlogin[0].created_at :"NA";
    //console.log("lastlo9009",lastlogin_time);
    if (lastlogin_time !== 'NA') {
      let formattedDate = this.datePipe.transform(lastlogin_time, 'dd-MM-yyyy HH:mm:ss');
      //console.log(formattedDate);
      return formattedDate;
    } else {
      return 'NA';
    }
    
  }

  async getAgencyName() {
    this.masterService
      .postRequestCreator("view-indentor", null, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.agencyName = apiResponse.EncryptedResponse.data;
        }
      });

  }

  async getAgencyNameList(newValue) {

    if (newValue) {
      const searchFilters = {
        "search": {
          "state_id":this.ngForm.controls['state_id'].value,
          "district_id": newValue,
          
          "created_by": this.userId.id,
         

        }
      };
      this.service.postRequestCreator("get-agency-details-name-distinct", null, searchFilters).subscribe((apiResponse: any) => {
          console.log("apiResponse=============",apiResponse);
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.agencyNameList = apiResponse.EncryptedResponse.data.rows;
            console.log(this.agencyNameList,'agencyNameList')
    this.resultAgencyDataSecond=this.agencyNameList




          }
        });
    }

  }


  cropGroup(item: any) {
    this.selectCrop = item.name;
    this.ngForm.controls['crop_group'].setValue(this.selectCrop.name)
  }

  // if((!this.ngForm.controls["state_id"].value &&  !this.ngForm.controls["agency_id"].value)){
  //   Swal.fire({
  //     toast: false,
  //     icon: "error",
  //     title: "Please Select Something ",
  //     position: "center",
  //     showConfirmButton: false,
  //     timer:3000,
  //     showCancelButton: false,

  //     customClass: {
  //       title: 'list-action-confirmation-title',
  //       actions: 'list-confirmation-action'
  //     }
  //   })

  //   return ;
  // }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
   if(this.searchFilterData){
    this.masterService
    .postRequestCreator("indentor-list", null, {
      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      pageSize: 50,
      search: {
        // "created_by": this.userId.id,
        "state_id":this.ngForm.controls["state_id"].value,
        "district_id":this.ngForm.controls["district_id"].value,
        "agency_id":this.ngForm.controls["agency_id"].value,
        
      }
    })
    .subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
        let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : "";
        console.log(allData, 'allData');


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
   else{
    this.masterService
    .postRequestCreator("indentor-list", null, {
      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      pageSize: 50,
      search: searchData
    })
    .subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
        let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : "";
        console.log(allData, 'allData');


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
          this.masterService.postRequestCreator("deleteIndentor", null, data).subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {

              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
            Swal.fire({
              title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
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
    this.ngForm.controls["agency_id"].setValue("");
    this.ngForm.controls["district_id"].setValue("");
    this.disabledfieldList=true;
    // this.resultAgencyData=[];
    this.ngForm.controls['district_id'].disable();
    this.ngForm.controls['agency_id'].disable();
    this.selected_agency='';
    this.selected_district='';
    this.selected_state='';
    this.disabledfield=true;
    this.disabledfieldAgency=true;
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
      Swal.fire('Error', 'Please Fill the all Details Correctly.', 'error');
      return;
    }
    if ((!this.ngForm.controls["state_id"].value && !this.ngForm.controls["agency_id"].value)) {
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
      this.initSearchAndPagination();
      this.searchFilterData=true;
      this.getPageData();
    }
  }
  state_select(data){
    this.selected_state = data && data['state_name'] ? data['state_name'] :'';
    this.ngForm.controls['state_id'].setValue(data && data['state_code'] ? data['state_code'] :'')
    this.ngForm.controls['state_text'].setValue('',)
  }
  cnClick() {
    document.getElementById('state').click();
  }
  cdClick() {
    document.getElementById('district').click();
  }
  caClick() {
    document.getElementById('agency').click();
  }
  district_select(data){
    this.selected_district = data && data['district_name'] ? data['district_name'] :'';
    this.ngForm.controls['district_id'].setValue(data && data['district_code'] ? data['district_code'] :'')
    let datas = this.ngForm.controls['district_text'].value;
    this.districtList=this.districtListSecond;

  this.ngForm.controls['district_text'].setValue('',{ emitEvent: false })
  }
  agency_select(data){
    console.log(data)
    this.selected_agency = data && data.agency_name ? data.agency_name  :'';
    this.ngForm.controls['agency_id'].setValue( data && data.id ? data.id  :'');
    this.agencyNameList =this.resultAgencyDataSecond;
    this.ngForm.controls['agency_text'].setValue('',{ emitEvent: false })
  }
}
