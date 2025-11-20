import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedDivisionService } from 'src/app/services/seed-division/seed-division.service';
import { RestService } from 'src/app/services/rest.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MaximumLotSizeSearchComponent } from 'src/app/common/maximum-lot-size-search/maximum-lot-size-search.component';
import { MasterService } from 'src/app/services/master/master.service';

@Component({
  selector: 'app-seed-multiplication-ratio-list',
  templateUrl: './seed-multiplication-ratio-list.component.html',
  styleUrls: ['./seed-multiplication-ratio-list.component.css']
})
export class SeedMultiplicationRatioListComponent implements OnInit {
  currentDateFilter: any = ['crop_group', 'crop_name'];
  compoName: any = "seed_multiplication"
  ngForm!: FormGroup;

  // @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  // @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  @ViewChild(MaximumLotSizeSearchComponent) indentBreederSeedAllocationSearchComponent: MaximumLotSizeSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropName: any;
  cropData: any;
  allData: any;
  countData: any;
  userId: any;
  crop_groups: any;
  cropDataSecond: any;
  crop_names: any;
  disabledfieldcropName = true
  cropNameSecond: any;
  userType: any;
  isActionBtnDisable: boolean;
  constructor(private restService: RestService,
    private seedDivisionService: SeedDivisionService,
    private fb: FormBuilder, private _master: MasterService
  ) {
    this.createEnrollForm();
    this.userType = this._master?.userBasicData?.user_type ?? 'NA';
    this.isActionBtnDisable = this.userType === 'SUPERADMIN';

  }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      group_id: new FormControl(''),
      crop_name: new FormControl(''),
      crop_text: new FormControl('',),
      crop_name_text: new FormControl('',),
    });
    this.ngForm.controls['group_id'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_name'].setValue('')
        this.crop_names = '';
        this.disabledfieldcropName = false

        this.getCropNameList(newValue);
      }
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {

        this.cropData = this.cropDataSecond
        let response = this.cropData.filter(x => x.group_name.toLowerCase().includes(newValue.toLowerCase()))

        this.cropData = response


      }
      else {
        this.getCropData()
      }
    });
    this.ngForm.controls['crop_name_text'].valueChanges.subscribe(newValue => {
      if (newValue && this.cropName && this.cropName.length) {

        this.cropName = this.cropNameSecond
        let response = this.cropName.filter(x => x.m_crop.crop_name.toLowerCase().includes(newValue.toLowerCase()))
        this.cropName = response
      }
      else {

        this.getCropNameList(this.ngForm.controls['group_id'].value)
      }
    });
  }
  ngOnInit(): void {
    // localStorage.setItem('logined_user', "ICAR_NODAL");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }

    //get user id from localstorage
    let user = localStorage.getItem('BHTCurrentUser')
    this.userId = JSON.parse(user);

    this.getCropData();
    this.getPageData();
    this.ngForm.controls["crop_name"].disable();
  }
  async getCropData() {
    this.seedDivisionService
      .postRequestCreator("crop-group")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.cropData = apiResponse.EncryptedResponse.data;
          this.cropDataSecond = this.cropData
        }
      });

  }
  async getCropNameList(newValue) {
    this.ngForm.controls["crop_name"].enable();
    const searchFilters = {
      "search": {
        "group_code": newValue
      }
    };
    this.seedDivisionService
      .postRequestCreator("get-crop-name-of-seed-multiplication", searchFilters, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.cropName = apiResponse.EncryptedResponse.data;
          this.cropName = this.cropName.sort((a, b) => a.m_crop.crop_name.localeCompare(b.m_crop.crop_name))
          this.cropNameSecond = this.cropName
        }
      });

  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    let route = "get-seed-multiplication-data-second";


    let data = {
      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      pageSize: 50,
      search: {

        "group_code": this.ngForm.controls["group_id"].value,
        "crop_name": this.ngForm.controls["crop_name"].value,
        "user_id": this.userId.id
      }

    }
    this.seedDivisionService.postRequestCreator(route, data).subscribe(data => {
      this.filterPaginateSearch.itemListPageSize = 50;
      this.allData = data.EncryptedResponse.data.rows;
      this.countData = data.EncryptedResponse.data.count;
      this.filterPaginateSearch.Init(data.EncryptedResponse.data.rows, this, "getPageData", undefined, data.EncryptedResponse.data.count, true);
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
    this.crop_names = '';
    this.crop_groups = '';
    this.disabledfieldcropName = true;
    this.ngForm.controls["crop_name"].disable();
    this.getPageData();
    this.filterPaginateSearch.itemListCurrentPage = 1;
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
        let data = {
          id: id,
          user_id: this.userId && this.userId.id ? this.userId.id : ''
        }
        this.seedDivisionService
          .postRequestCreator("deletesmrlistdata", data)
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

  search() { }
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



      }
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination();
      this.getPageData();
    }
  }
  cropGroup(data) {
    this.crop_groups = data && data.group_name ? data.group_name : '';
    this.ngForm.controls['group_id'].setValue(data && data.group_code ? data.group_code : '')
    this.cropData = this.cropDataSecond
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })

  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cropNames(data) {

    this.crop_names = data && data.m_crop && data.m_crop.crop_name ? data.m_crop.crop_name : '';
    this.ngForm.controls['crop_name'].setValue(data && data.m_crop && data.m_crop.crop_code ? data.m_crop.crop_code : '')
    this.cropName = this.cropNameSecond
    this.ngForm.controls['crop_name_text'].setValue('', { emitEvent: false })
  }
  cnClick() {
    document.getElementById('crop_name').click();
  }
}
