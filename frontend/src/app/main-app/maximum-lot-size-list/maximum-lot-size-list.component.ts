import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { MaximumLotSizeSearchComponent } from 'src/app/common/maximum-lot-size-search/maximum-lot-size-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { MasterService } from 'src/app/services/master/master.service';
// import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
// import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';

import { RestService } from 'src/app/services/rest.service';
import { SeedDivisionService } from 'src/app/services/seed-division/seed-division.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-maximum-lot-size-list',
  templateUrl: './maximum-lot-size-list.component.html',
  styleUrls: ['./maximum-lot-size-list.component.css']
})
export class MaximumLotSizeListComponent implements OnInit {


  @ViewChild(MaximumLotSizeSearchComponent) indentBreederSeedAllocationSearchComponent: MaximumLotSizeSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any = [];
  disablefield: boolean = false;
  deletedId: any;
  ngForm!: FormGroup;
  districtList: any;
  state_id: any;
  stateList: any;
  countData: any;
  cropName: any;
  cropData: any;
  group_names;
  userId: any;
  crop_names;
  disabledfieldcropName=false;
  cropNameSecond: any;
  cropDataSecond: any;
  userType: any;
  isActionBtnDisable: boolean;
  constructor(private restService: RestService,
    private router: Router,
    private fb: FormBuilder,
    private _master: MasterService,
    private _serviceSeed: SeedDivisionService
  ) {
    this.createEnrollForm();
    this.userType = this._master?.userBasicData?.user_type ?? 'NA';
    this.isActionBtnDisable = this.userType === 'SUPERADMIN';
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      group_id: new FormControl(''),
      crop_name: new FormControl(''),
      crop_text:new FormControl('',),
      crop_name_text:new FormControl('',),
    });
    this.ngForm.controls['group_id'].valueChanges.subscribe(newValue => {
      this.getCropNameList(newValue);
       this.crop_names=''
      this.ngForm.controls["crop_name"].enable();
      this.ngForm.controls["crop_name"].setValue('')
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.cropData =this.cropDataSecond;
        let response= this.cropData.filter(x=>x.group_name.toLowerCase().includes(newValue.toLowerCase()))
      
        this.cropData=response
      
       
      }
      else{
        this.getCropData()
      }
    });
    this.ngForm.controls['crop_name_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue && this.cropName)
        this.cropName =this.cropNameSecond
        let response= this.cropName.filter(x=>x['m_crop.crop_name'].toLowerCase().includes(newValue.toLowerCase()))
      
        this.cropName=response
      
       
      }
      else{
      
        this.getCropNameList(this.ngForm.controls['group_id'].value)
      }
    });
  }
  ngOnInit(): void {
    this.getPageData();
    this.getCropData();
    let user = localStorage.getItem('BHTCurrentUser')
    console.log('userDatat',);
    this.userId = JSON.parse(user)
    this.ngForm.controls["crop_name"].disable()
  }

  async getCropData() {
    this._serviceSeed
      .postRequestCreator("crop-group")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.cropData = apiResponse.EncryptedResponse.data;
          this.cropDataSecond =this.cropData
        }
      });

  }
  async getCropNameList(newValue) {

    const searchFilters = {
      "search": {
        "group_code": newValue
      }
    };
    this._serviceSeed
      .postRequestCreator("get-max-lot-size-crop-name", searchFilters, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
            console.log(apiResponse);
            
          this.cropName = apiResponse.EncryptedResponse.data.rows;
          this.cropName = this.cropName.sort((a, b) => a['m_crop.crop_name'].localeCompare(b['m_crop.crop_name']))
          this.cropNameSecond =  this.cropName
        }
      });

  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    let route = "get-crop-max-lot-size-data";
    let data = {
      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      pageSize: 50,
      search: {
        "group_code": this.ngForm.controls['group_id'].value,
        "crop_name": this.ngForm.controls['crop_name'].value
      }
    }
    this._serviceSeed.postRequestCreator(route, data).subscribe(data => {
      this.filterPaginateSearch.itemListPageSize = 50;
      this.allData = data.EncryptedResponse.data.rows;
      this.countData = data.EncryptedResponse.data.count;
      console.log('count data', this.countData);
      this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, this.countData, true);
      this.initSearchAndPagination();
    });
  }


  initSearchAndPagination() {
    if (this.indentBreederSeedAllocationSearchComponent === undefined || this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }

  clear() {
    this.ngForm.controls['group_id'].setValue('');
    this.ngForm.controls['crop_name'].setValue('');
    this.ngForm.controls["crop_name"].disable();
    this.crop_names='';
    this.group_names='';
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.getPageData();
    // this.filterPaginateSearch.Init(response, this, "getPageData");
    this.initSearchAndPagination();
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
        let data ={
          id:id,
          user_id: this.userId && this.userId.id ? this.userId.id :''
        }
        this._serviceSeed
          .postRequestCreator("deletemaximumlistdata" , data)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData();
            }
          });
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
            showCancelButton: false,
            confirmButtonColor: '#E97E15'
        })
      }
    })
  }

  searchData() {
    if ((!this.ngForm.controls["group_id"].value && !this.ngForm.controls["crop_name"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })
      return;
    } else {
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination();
      this.getPageData();
    }
  }
  onSubmit(formData) {

    // this.submitted = true;

    if (this.ngForm.invalid) {
      Swal.fire('Error', 'Please Fill the all Details Correctly.', 'error');
      return;
    }
    if ((!this.ngForm.controls["group_id"].value && !this.ngForm.controls["crop_name"].value)) {
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
        "group_code": formData.group_id,
        "crop_name": formData.crop_name,
      }
      // this.getPageData(1, data);
    }
  }
  getShortName(cropCode) {
    return cropCode.split(' ').map(n => n[0]).join('');
  }
  group_name(data){
    
this.ngForm.controls['crop_text'].setValue('')
    this.ngForm.controls['group_id'].setValue(data && data.group_code ? data.group_code :'')
    this.group_names= data && data.group_name ?  data.group_name  :'';
    console.log(data)
  }
  cgClick() {
    document.getElementById('cropgroup').click();
  }
  cnClick() {
    document.getElementById('crop_name').click();
  }
  cropNamesData(data){
this.ngForm.controls['crop_name_text'].setValue('')
    this.crop_names= data && data['m_crop.crop_name'] ? data['m_crop.crop_name'] :''
    this.ngForm.controls['crop_name'].setValue(data && data['m_crop.crop_code'] ? data['m_crop.crop_code'] :'')

  }
}
