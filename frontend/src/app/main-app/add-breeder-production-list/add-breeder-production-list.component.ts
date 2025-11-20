import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { RestService } from 'src/app/services/rest.service';
import { MasterService } from 'src/app/services/master/master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
// import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';


@Component({
  selector: 'app-add-breeder-production-list',
  templateUrl: './add-breeder-production-list.component.html',
  styleUrls: ['./add-breeder-production-list.component.css']
})

export class AddBreederProductionListComponent implements OnInit {
  @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  submissionid = this.route.snapshot.paramMap.get('submissionid'); response: any;
  selectCrop: any;
  ngForm!: FormGroup;
  croupGroupList: any = [];
  agency_name: any;
  disabledfield: boolean = false;
  cancelbtn!: boolean;
  isView: boolean = false;
  stateList: any = [];

  districtList: any;
  select_district: any;
  agencyNameList: any;
  state_id: any;
  User_id: any;
  selected_state;
  searchFilterData=false;
  selected_district;
  stateListsecond: any;
  disabledfieldDist=true;
  districtListSecond: any;
  breeder_data_name: any;
  breeder_data_name_second: any;
  selected_agency: any;
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
    private service: SeedServiceService,
    private breederService: BreederService) {
    this.createEnrollForm();
    this.userType = this.masterService?.userBasicData?.user_type ?? 'NA';
    this.isActionBtnDisable = this.userType === 'SUPERADMIN';

  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      state: new FormControl(''),
      district: new FormControl('',),
      state_text: new FormControl(''),
      district_text: new FormControl(''),
      agency_text: new FormControl(''),
      production_name: new FormControl(''),
      // agencyName: new FormControl('', ),
    });
    this.ngForm.controls['state'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getDistrictList(newValue);
        this.ngForm.controls['district'].enable();
        this.ngForm.controls['district'].patchValue('');
        this.searchFilterData=false;
        this.disabledfieldDist=false
        this.selected_district=''
      }
    });
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.stateList =this.stateListsecond
        let response= this.stateList.filter(x=>x['state_name'].toLowerCase().includes(newValue.toLowerCase()))      
        this.stateList=response
      }
      else{
        this.getStateList()       
      }
    });

    this.ngForm.controls['district'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        this.getBspcReportName(newValue)       
      }      
    });
   
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.districtList =this.districtListSecond
        let response= this.districtList.filter(x=>x.district_name.toLowerCase().includes(newValue.toLowerCase()))
      
        this.districtList=response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)
       
      }
      else{
        this.getDistrictList(this.ngForm.controls['state'].value)
       
      }
    });
    this.ngForm.controls['agency_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.breeder_data_name =this.breeder_data_name_second
        let response= this.breeder_data_name.filter(x=>x.agency_name.toLowerCase().includes(newValue.toLowerCase()))
      
        this.breeder_data_name=response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)
       
      }
      else{
        this.getBspcReportName(this.ngForm.controls['district'].value)
       
      }
    });
  }

  logindata(){
    // console.log("okk");
    this.service.postRequestCreator('islastLogin', null, {
      "user_type" : "BPC",
    }).subscribe(res => {
      this.Userdata=res;
      console.log("valuedata",this.Userdata);
    });
  }


  ngOnInit(): void {
    
    
    // localStorage.setItem('logined_user', "Breeder");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    const BHTCurrentUser= localStorage.getItem("BHTCurrentUser");
   
    const data= JSON.parse(BHTCurrentUser);
   
    this.User_id= data.id;
    this.logindata();
     //console.log("valuenews",this.Userdata);
    this.submissionid = this.route.snapshot.paramMap.get('submissionid');
    this.getPageData();
    this.getStateList();
    // this.AgencyName();
    this.ngForm.controls['district'].disable();
   
    // this.delete(this.deletedId)
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

  cropGroup(item: any) {
    this.selectCrop = item.state_name;
    this.state_id = item.id;
    this.ngForm.controls['state'].setValue(item.state_code);
  }

  SelectDistrict(item) {
    this.select_district = item.district_name;
    this.ngForm.controls['district'].setValue(item.id)
  }
  
  async getDistrictList(newValue: any) {
    const searchFilters = {
      "search": {
        "state_code": (newValue).toString(),
        'created_by':this.User_id
      }
    };
    this.breederService
      .postRequestCreator("get-breeder-production-district", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.districtList = apiResponse.EncryptedResponse.data.rows;
          this.districtListSecond= this.districtList
        }

      });

  }

  async search() {

    if ((!this.ngForm.controls["state"].value && !this.ngForm.controls["district"].value)) {
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

      const searchFilters = {
        state_id: parseInt(this.ngForm.controls["state"].value),
        district_id: parseInt(this.ngForm.controls["district"].value),
         production_id:this.ngForm.controls["production_name"].value ? parseInt(this.ngForm.controls["production_name"].value):'',
        // agencyName:this.ngForm.controls["agencyName"].value
      };
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination();
      this.searchFilterData=true
      this.getPageData();
    }

    // const result = this.breederService.getPlansInfo("filter-add-breeder-list-data", searchFilters).then((data: any) => {
    //   let response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data.data ? data['EncryptedResponse'].data.data : '';
    //   this.filterPaginateSearch.itemListPageSize = 5;
    //   this.filterPaginateSearch.Init(response, this, "getPageData");
    //   this.initSearchAndPagination();
    // })

  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    if(this.searchFilterData){
      this.breederService
      // .postRequestCreator("breeder-list", null, {
      .postRequestCreator("production-center-list", null, {
        page: loadPageNumberData,
        // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
        pageSize: 50,
        search: {
          state_id: parseInt(this.ngForm.controls["state"].value),
        district_id: parseInt(this.ngForm.controls["district"].value),
        production_id: this.ngForm.controls["production_name"].value ?parseInt(this.ngForm.controls["production_name"].value):'',
        
        },
        user_id:this.User_id
      })
      .subscribe((apiResponse: any) => {
       

        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          let allData = apiResponse.EncryptedResponse.data.rows;
          if (allData === undefined) {
            allData = [];
          }
          this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
        }
      });
    }
    else{
      this.breederService
      // .postRequestCreator("breeder-list", null, {
      .postRequestCreator("production-center-list", null, {
        page: loadPageNumberData,
        // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
        pageSize: 50,
        search: searchData,      
        user_id:this.User_id
      })
      .subscribe((apiResponse: any) => {
       

        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;

          let allData = apiResponse.EncryptedResponse.data.rows.sort((a, b) => a.code - b.code );

          if (allData === undefined) {
            allData = [];
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
    this.paginationUiComponent.Init(this.filterPaginateSearch);
    // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
  }


  delete(id: number, cropName: string) {
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure To Want to Inactive?",
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
        this.breederService
          .postRequestCreator("delete-breeder/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });
        Swal.fire({
          title: '<p style="font-size:25px;">BSPC has been made inactive.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
      }
    })
  }


  clear() {
    // (document.getElementById("clear")as HTMLInputElement).reset();
    // this.filterPaginateSearch.search(undefined);
    this.selectCrop = '';
    this.select_district = '';
    this.agency_name = '';
    this.selected_agency='';
    this.disabledfieldDist=true;
    this.breeder_data_name=[]

    this.ngForm.controls['state'].setValue('');
    this.ngForm.controls['production_name'].setValue('');
    this.ngForm.controls['production_name'].disable();
    this.ngForm.controls['district'].setValue('');
    this.selected_district='';
    this.selected_state=''
    // this.ngForm.controls['agencyName'].setValue('');
    this.getPageData();

    this.ngForm.controls['district'].disable();
    
 this.filterPaginateSearch.itemListCurrentPage = 1;
 this.initSearchAndPagination()
  }



  agency(item: any) {
    this.agency_name = item.agency_name;
    this.ngForm.controls['agencyName'].setValue(item.agency_name);
  }
  async getStateList() {
    this.service
      .postRequestCreator("getBspcStateList")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.stateList = apiResponse.EncryptedResponse.data.rows;
          this.stateList = this.stateList.filter((arr, index, self) =>
          index === self.findIndex((t) => (t['m_state.state_name'] === arr['m_state.state_name'] )));
          this.stateListsecond = this.stateList
        }
      });

  }

  async AgencyName() {
    this.breederService
      .getRequestCreatorNew("get-agency-details")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.agencyNameList = apiResponse.EncryptedResponse.data;
        }
      });

  }
  state_select(data){

    console.log(data)
    this.selected_state = data && data['state_name'] ? data['state_name'] :'';
    this.ngForm.controls['state'].setValue(data && data['state_code'] ? data['state_code'] :'')
    this.ngForm.controls['state_text'].setValue('',)

  }

  cnClick() {
    document.getElementById('state').click();
  }
  district_select(data){
    this.selected_district = data && data['m_district.district_name'] ? data['m_district.district_name'] :'';
    this.ngForm.controls['district_text'].setValue('',{emitEvent:false})
    this.districtList =this.districtListSecond
    this.ngForm.controls['district'].setValue(data && data['m_district.district_code'] ? data['m_district.district_code'] :'')
  }
  cdClick() {
    document.getElementById('district').click();
  }
  getBspcReportName(newValue) {
    // this.breeder_data = []
    const param={
      search:{
        district_id:newValue,
        state_id:this.ngForm.controls['state'].value
      }
    }
    this.service
      .postRequestCreator("getBspcReportName",null,param)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data) {
          this.breeder_data_name = apiResponse.EncryptedResponse.data.rows;
          this.breeder_data_name_second = this.breeder_data_name
          
          // this.breeder_data_district =  this.breeder_data_district.filter((arr, index, self) =>
          // index === self.findIndex((t) => (t.agency_detail.m_district.district_name === arr.agency_detail.m_district.district_name )))
        }
      });
  }
  agency_select(data){

    this.selected_agency = data  && data.agency_name ? data.agency_name :''
    // this.selected_agency_id = data && data.agency_detail && data.agency_detail.agency_name ? data.agency_detail.agency_name :'';
    this.ngForm.controls['production_name'].setValue(data  && data.agency_id ? data.agency_id :'')
    this.ngForm.controls['agency_text'].setValue('',{eventEmit :false})
    this.breeder_data_name =this.breeder_data_name_second
  }
  caClick() {
    document.getElementById('agency').click();
  }
}
