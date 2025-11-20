import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AddCropSearchComponent } from 'src/app/common/add-crop-search/add-crop-search.component';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import Swal from 'sweetalert2';

import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { MatSelect } from "@angular/material/select";
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
import { MasterService } from 'src/app/services/master/master.service';

@Component({
  selector: 'app-add-crop-list',
  templateUrl: './add-crop-list.component.html',
  styleUrls: ['./add-crop-list.component.css']
})
export class AddCropListComponent extends ngbDropdownEvents implements OnInit {


  @ViewChild(AddCropSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any = [];
  disablefield: boolean = false;
  deletedId: any;
  ngForm!: FormGroup;
  croupGroup: any;
  selectCrop: any;

  croupGroupList: any = [];
  datas: any = [];
  item: any;
  response: any = [];
  response_crop_group: any = [];
  selectCrop_group: any;
  fieldsList: SectionFieldType[];
  formGroup: FormGroup<any>;
  crop_name_list: any;
  isCropName: boolean = false;
  selectCrop_code: any;
  selectCrop_group_code: any;
  crop_code: void;
  crop_name_data: any;
  currentUser: any = {
    "id": ''
  }
  croupGroupListsecond: any;
  response_crop_group_second: any;
  crop_name_list_second: any;
  cropGroups;
  mymodel;
  firstSelect: any;
  crop_text_check = 'crop_group';
  crop_name_check = 'cropName';
  userType: any;
  isActionBtnDisable: boolean;

  constructor(private restService: RestService, private router: Router, private fb: FormBuilder, private service: SeedServiceService, private _master: MasterService) {
    super();
    if (this.router.url.includes('view')) {
      this.disablefield = true;
    }
    if (this.router.url.includes('edit')) {
      this.disablefield = false;
    }
    this.createEnrollForm();

    this.userType = this._master?.userBasicData?.user_type ?? 'NA';
    this.isActionBtnDisable = this.userType === 'SUPERADMIN';

  }

  ngOnInit(): void {
    // localStorage.setItem('logined_user', "Seed");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   // location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }

    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.currentUser.id = currentUser.id
    // if (!currentUser) {
    //   this.router.navigate(['/web-login']);
    // }

    this.getPageData();
    this.initProcess();
    this.getCroupCroupList();


    // this.delete(this.deletedId)
  }



  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_group: new FormControl(''),
      crop_name: new FormControl('',),
      crop_text: new FormControl('',),
      name_text: new FormControl('',)

    });
    this.ngForm.controls["crop_group"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.selectCrop_code = "";
        this.ngForm.controls["crop_name"].setValue("");
      }
    })
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.response_crop_group = this.response_crop_group_second
        let response = this.response_crop_group.filter(x => x.group_name.toLowerCase().includes(newValue.toLowerCase()))
        this.response_crop_group = response
      }
      else {
        this.getCroupCroupList()
      }
    });
    this.ngForm.controls['name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.crop_name_list = this.crop_name_list_second
        let response = this.crop_name_list.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))

        this.crop_name_list = response
        // this.croupGroupListsecond=this.croupGroupList
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getCroupNameList(this.ngForm.controls['crop_group'].value)
      }
    });


  }

  initProcess() {

  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.service
      .postRequestCreator("getCropDataList", null, {
        page: loadPageNumberData,
        // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
        pageSize: 50,
        search: {
          group_code: this.selectCrop_group_code ? this.selectCrop_group_code : null,
          crop_code: this.selectCrop_code ? this.selectCrop_code : null,
          user_id: this.currentUser.id,
          pageSize: this.filterPaginateSearch.itemListPageSize || 50,

        }
      }
      )
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
          if (this.allData === undefined) {
            this.allData = [];
          }
          if (this.allData) {

            this.allData = this.allData.sort((a, b) => a.m_crop_group.group_name.localeCompare(b.m_crop_group.group_name)
              || a.crop_name.localeCompare(b.crop_name) ||
              a.botanic_name.localeCompare(b.botanic_name)
            );
          }

          this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
        }
      });
  }
  crop_name(item: any) {
    this.selectCrop_group = item.crop_name;
    console.log("item1", item)
    this.selectCrop_code = item.crop_code;
    this.crop_name_check = ''

    this.ngForm.controls["name_text"].setValue("");
    this.ngForm.controls['crop_name'].setValue(item.crop_code)
  }
  cropGroup(item: any) {
    // console.log('item====>', item.);

    this.selectCrop = item.group_name;

    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_group'].setValue(item.group_code);
    this.selectCrop_group_code = item.group_code;
    this.crop_name_data = item.group_name;
    this.selectCrop_group = "";
    this.ngForm.controls['crop_name'].setValue('')
    this.crop_text_check = 'crop_group'
    this.getCroupNameList(item.group_code);
  }

  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    // if (this.indentBreederSeedAllocationSearchComponent === undefined || this.paginationUiComponent === undefined) {
    //   setTimeout(() => {
    //     this.initSearchAndPagination();
    //   }, 300);
    //   return;
    // }

    // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }

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
          .postRequestCreator("delete-crop-details/" + id, null, null)
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
          showCancelButton: false,
          confirmButtonColor: '#E97E15'
        })
      }
    })
  }


  getCroupCroupList() {
    const route = "crop-group";
    const result = this.service.getPlansInfo(route).then((data: any) => {
      this.response_crop_group = data['EncryptedResponse'].data;
      this.response_crop_group_second = this.response_crop_group
      console.log(data['EncryptedResponse'].data, 'ddddddddd', this.response_crop_group)
    })
  }
  getCroupNameList(newValue: any) {

    const route = "distinctCropNamegrid";
    const search = {
      'search': {
        'group_code': newValue
      }
    }
    this.service
      .postRequestCreator(route, null, search)
      .subscribe((apiResponse: any) => {
        console.log(apiResponse);

        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.isCropName = true;
          this.crop_name_list = apiResponse.EncryptedResponse.data;
          this.crop_name_list_second = this.crop_name_list
          this.crop_name_list = this.crop_name_list.sort((a, b) =>
            a.crop_name.localeCompare(b.crop_name)
          );
        }
      });
    // const result = this.service.getPlansInfo(route).then((data: any) => {
    //   this.crop_name_list = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    // })
  }

  clear() {
    if (this.ngForm.controls["crop_group"].value) {
      this.selectCrop = "";
      this.crop_name_data = "";

      this.ngForm.controls["crop_group"].setValue("");
    }
    if (this.ngForm.controls["crop_name"].value) {
      this.selectCrop_group = "";
      this.selectCrop_code = "";

      this.ngForm.controls["crop_name"].setValue("");
    }
    this.selectCrop_group_code = '';
    this.selectCrop_code = ''
    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls["name_text"].setValue("");

    this.isCropName = false;
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.ngForm.controls["crop_group"].setValue("");
    this.ngForm.controls["crop_name"].setValue("");
    this.getPageData();
    // this.filterPaginateSearch.Init(response, this, "getPageData");
    this.initSearchAndPagination();
  }

  cgClick() {
    document.getElementById('crop_group').click();
  }
  cnclick() {
    document.getElementById('crop_name').click();
  }
  search() {
    if ((!this.selectCrop && !this.selectCrop_group)) {
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
      this.filterPaginateSearch.itemListPageSize = 50;
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.getPageData();
    }


  }
  valuechange(e) {
    console.log(e.target.value)
  }
  onKeyPressed(event: KeyboardEvent, mySelect: MatSelect) {
    if (event.keyCode - 97 >= 0 && event.keyCode - 97 <= 2) {
      this.firstSelect = this.response_crop_group[event.keyCode - 97].value;
      mySelect.close();
    }
  }

  cropdatatext() {

    this.crop_text_check = '';

  }
  cropnametext() {

    this.crop_name_check = '';

  }


}
