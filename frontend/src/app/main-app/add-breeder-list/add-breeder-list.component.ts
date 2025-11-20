import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { RestService } from 'src/app/services/rest.service';
import { MasterService } from 'src/app/services/master/master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
@Component({
  selector: 'app-add-breeder-list',
  templateUrl: './add-breeder-list.component.html',
  styleUrls: ['./add-breeder-list.component.css']
})
export class AddBreederListComponent implements OnInit {


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
  stateList: any;
  selected_state;
  districtList: any;
  select_district: any;
  agencyNameList: any;
  state_id: any;
  searchFilterData=false;
  User_id;
  selected_district: any;
  selected_agency: any;
  disabledfieldAgency=true;
  disabledfieldDist=true
  stateListsecond: any;
  districtListSecond: any;
  agencyNameListSecond: any;
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
      state: new FormControl("",),
      district: new FormControl('',),
      agencyName: new FormControl('',),
      state_text: new FormControl(''),
      district_text: new FormControl(''),
      agency_text: new FormControl(''),
    });
    this.ngForm.controls['state'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['district'].disable();
        this.ngForm.controls['agencyName'].disable();
        this.ngForm.controls['district'].setValue('');
        this.selected_district='';
        this.ngForm.controls['agencyName'].setValue('');
        this.getDistrictList(newValue);
        this.ngForm.controls['district'].enable();
        this.searchFilterData=false
        this.disabledfieldDist=false
        this.selected_district=''
      }

    });
    this.ngForm.controls['district'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['agencyName'].disable();
        this.ngForm.controls['agencyName'].setValue('');
        this.getBreederNameList(newValue);
        this.ngForm.controls['agencyName'].enable();
        this.selected_agency='';
        this.searchFilterData=false
        this.disabledfieldAgency=false
      }
    });
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.stateList =this.stateListsecond
        let response= this.stateList.filter(x=>x.state_name.toLowerCase().includes(newValue.toLowerCase()))    
        this.stateList=response       
      }
      else{
        this.getStateList()
       
      }
    });
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue) {       
        this.districtList =this.districtListSecond
        let response= this.districtList.filter(x=>x.district_name.toLowerCase().includes(newValue.toLowerCase()))      
        this.districtList=response
      }
      else{
        this.getDistrictList(this.ngForm.controls['state'].value)
       
      }
    });
    this.ngForm.controls['agency_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.agencyNameList =this.agencyNameListSecond
        let response= this.agencyNameList.filter(x=>x.agency_name.toLowerCase().includes(newValue.toLowerCase()))
      
        this.agencyNameList=response
       
      }
      else{
        this.getBreederNameList(this.ngForm.controls['district'].value)
       
      }
    });
  }
  logindata(){
    // console.log("okk");
    this.service.postRequestCreator('islastLogin', null, {
      "user_type" : "BR",
    }).subscribe(res => {
      this.Userdata=res;
      console.log("valuedata",this.Userdata);
    });
  }


  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    if (!currentUser) {
      this.router.navigate(['/web-login']);
    }
    // localStorage.setItem('logined_user', "Seed");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    const BHTCurrentUser= localStorage.getItem("BHTCurrentUser");
   
    const data= JSON.parse(BHTCurrentUser);
   
    this.User_id= data.id
    this.submissionid = this.route.snapshot.paramMap.get('submissionid');
    this.getPageData();
    this.logindata();
    this.getStateList();
    this.ngForm.controls['district'].disable();
    this.ngForm.controls['agencyName'].disable();

    // this.AgencyName();
    // console.log('fdssdfsfsdfsdfdsffdsf',this.filterPaginateSearch);
    // this.delete(this.deletedId)
  }
  cropGroup(item: any) {
    this.selectCrop = item.state_name;
    this.ngForm.controls['state'].setValue(item.state_code);
    this.state_id = item.id;
  }

  setlastlogin(user_id)
  {
    
    let lastlogin = this.Userdata.filter(item => item.user_id==user_id);
    let lastlogin_time = lastlogin && lastlogin[0] && lastlogin[0].created_at ? lastlogin[0].created_at :"NA";
    if (lastlogin_time !== 'NA') {
      let formattedDate = this.datePipe.transform(lastlogin_time, 'dd-MM-yyyy HH:mm:ss');
      //console.log(formattedDate);
      return formattedDate;
    } else {
      return 'NA';
    }
    
  }

  SelectDistrict(item) {
    this.select_district = item.district_name;
    this.ngForm.controls['district'].setValue(item.id)
  }

  async getDistrictList(newValue: any) {
    const searchFilters = {
      "search": {
        "state_code": (newValue).toString(),
        "created_by": this.User_id ?  this.User_id:''
      }
    };
    this.service
      .postRequestCreator("get-cordinator-district", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.districtList = apiResponse.EncryptedResponse.data.rows;
          this.districtListSecond = this.districtList
        }
      });

  }

  async getBreederNameList(newValue: any) {
    const searchFilters = {
      "search": {
        "district_code": (newValue).toString(),
        'state_id':this.ngForm.controls['state'].value,      
        "created_by":this.User_id
      }
    };
    this.service
      .postRequestCreator("get-breeder-name-by-district", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.agencyNameList = apiResponse.EncryptedResponse.data;
          this.agencyNameListSecond =this.agencyNameList
        }
      });

  }

  async search() {
    // if (!(this.ngForm.controls['state'].value || this.ngForm.controls['district'].value || this.ngForm.controls['agencyName'].value)) {
    //   return;
    // }
    if ((!this.ngForm.controls["state"].value && !this.ngForm.controls["district"].value && !this.ngForm.controls["agencyName"].value)) {
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
        state_code: parseInt(this.ngForm.controls["state"].value),
        district_id: parseInt(this.ngForm.controls["district"].value),
        agencyName: this.ngForm.controls["agencyName"].value
      };
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.searchFilterData=true;
      this.getPageData();

    }

  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    if(this.searchFilterData){

      this.breederService
        .postRequestCreator("add-breeder-seed-list", null, {
          page: loadPageNumberData,
          // pageSize: this.filterPaginateSearch.itemListPageSize || 50,
          pageSize: 50,
          search: {
            state_code: parseInt(this.ngForm.controls["state"].value),
          district_id: parseInt(this.ngForm.controls["district"].value),
          agencyName: this.ngForm.controls["agencyName"].value
          },
          user_id:this.User_id
        })
        .subscribe((apiResponse: any) => {
          if (apiResponse !== undefined
            && apiResponse.EncryptedResponse !== undefined
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.filterPaginateSearch.itemListPageSize = 50;
            let allData = apiResponse.EncryptedResponse.data.rows;
            
            // // let result = data && data.rows ? data.rows : '';
            // let sorArr = allData.sort((a, b) => {
            //   // data.m_crop_variety.variety_name
            //   return  a.m_state.state_name.localeCompare(b.m_state.state_name) 
            //   // || a.m_crop_variety.variety_name.localeCompare(b.m_crop.crop_name);
            // }
            // );
            // console.log('sorrr==>',sorArr);
            
      
            
            if (allData === undefined) {
              allData = [];
            }
            // let result = data && data.rows ? data.rows : '';
            // let sorArr = result.sort((a, b) => {
            //   // data.m_crop_variety.variety_name
            //   return  a.m_states.state_name.localeCompare(b.m_states.state_name) 
            //   // || a.m_crop_variety.variety_name.localeCompare(b.m_crop.crop_name);
            // }
            // );
      
            this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
            this.initSearchAndPagination();
          }
        });
    }
    else{
      this.breederService
        .postRequestCreator("add-breeder-seed-list", null, {
          page: loadPageNumberData,
          // pageSize: this.filterPaginateSearch.itemListPageSize || 50,
          pageSize: 50,
          search: searchData,
          user_id:this.User_id
        })
        .subscribe((apiResponse: any) => {
          if (apiResponse !== undefined
            && apiResponse.EncryptedResponse !== undefined
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.filterPaginateSearch.itemListPageSize = 50;
            let allData = apiResponse.EncryptedResponse.data.rows;

            // console.log('al==>',allData[0].crop_data);
            let arr
            for(let index in allData){
              arr=allData[index].crop_data
              // console.log(allData[index].crop_data[i].crop_name,'crop')
              // arr.push(allData[index].crop_data)
              // console.log(allData[index].crop_data && allData[index].crop_data['crop_name'] ? allData[index].crop_data['crop_name'] :'')
            }
            // let arr2=[]
            // for(let i in arr){
            //   // arr2.push(arr[i])

              
            // }
            
          
            let responseData=[];
            allData.forEach(function(obj) {
              // console.log(obj.crop_data)

              if(obj.crop_data){

                obj.crop_data.forEach((ele,i)=>{
                  if(ele.crop_code){
                    // delete ele.crop_code;

                    responseData.push(ele.crop_name)
                  }
                })
              }
              // obj.newKey = arr[index];
            });
            console.log(responseData)
            console.log(allData,'responseData')
           let data=[]
            
            // // let result = data && data.rows ? data.rows : '';
            // let sorArr = allData.sort((a, b) => {
            //   // data.m_crop_variety.variety_name
            //   return  a.m_state.state_name.localeCompare(b.m_state.state_name) 
            //   // || a.m_crop_variety.variety_name.localeCompare(b.m_crop.crop_name);
            // }
            // );
            // console.log('sorrr==>',sorArr);
            
      
            
            if (allData === undefined) {
              allData = [];
            }
            // let result = data && data.rows ? data.rows : '';
            // let sorArr = result.sort((a, b) => {
            //   // data.m_crop_variety.variety_name
            //   return  a.m_states.state_name.localeCompare(b.m_states.state_name) 
            //   // || a.m_crop_variety.variety_name.localeCompare(b.m_crop.crop_name);
            // }
            // );
      
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
  }


  delete(id: number, cropName: string,data,crop) {
    
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure To Inactive?",
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
        const param={
          crop_code:data.crop_data
        }
        this.service
          .postRequestCreator("delete-breeder/" + id, null, param)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });
        Swal.fire({
          title: '<p style="font-size:25px;">PD/PC has been made inactive.</p>',
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
    this.selected_district='';
    this.selected_state='';
    this.disabledfieldDist=true;
    this.disabledfieldAgency=true;

    this.ngForm.controls['state'].setValue('');
    console.log(this.ngForm.controls['state'].value);
    this.ngForm.controls['district'].setValue('');
    this.ngForm.controls['agencyName'].setValue('');

    this.ngForm.controls['district'].disable();
    this.ngForm.controls['agencyName'].disable();
    this.getPageData();
    
 this.filterPaginateSearch.itemListCurrentPage = 1;
 this.initSearchAndPagination()
  }



  agency(item: any) {
    this.agency_name = item.agency_name;
    this.ngForm.controls['agencyName'].setValue(item.agency_name);
  }
  async getStateList() {
    this.service
      .postRequestCreator("getProjectCoordinatorStateList")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.stateList = apiResponse.EncryptedResponse.data.rows;
          this.stateList = this.stateList.filter((arr, index, self) =>
          index === self.findIndex((t) => (t['m_state.state_name'] === arr['m_state.state_name'] )))       
          this.stateListsecond=   this.stateList                     
        }
      });

  }

  // async AgencyName() {
  //   this.service
  //   .getRequestCreatorNew("get-agency-details")
  //   .subscribe((apiResponse: any) => {
  //     if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
  //       && apiResponse.EncryptedResponse.status_code == 200) {
  //       this.agencyNameList = apiResponse.EncryptedResponse.data;
  //     }
  //   });

  // }

  state_select(data){
    this.selected_state = data && data['state_name'] ? data['state_name'] :'';
    this.ngForm.controls['state'].setValue(data && data['state_code'] ? data['state_code'] :'')
    this.ngForm.controls['state_text'].setValue('',{ emitEvent: false })
     this.stateList =this.stateListsecond
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
    this.ngForm.controls['district'].setValue(data && data['district_code'] ? data['district_code'] :'')
    this.ngForm.controls['district_text'].setValue('',{ emitEvent: false })
    this.districtList =this.districtListSecond
  }
  agency_select(data){   
    this.selected_agency = data && data.agency_name ? data.agency_name  :'';
    this.ngForm.controls['agencyName'].setValue( data && data.agency_name ? data.agency_name  :'')
    this.ngForm.controls['agency_text'].setValue('',{ emitEvent: false })


  }
  getCropNamefrommlist(crop){
    let temp=[]
    crop.forEach(obj=>{
      if(obj.crop_name){
        temp.push(obj.crop_name)
      }


    })
    return temp.toString().length>30 ? temp.toString().substring(0,30) + '...':temp.toString();
   
  }
  getCropNamefrommlistforTitle(crop){
    let temp=[]
    crop.forEach(obj=>{
      if(obj.crop_name){
        temp.push(obj.crop_name)
      }


    })
    return temp;
   
  }

}
