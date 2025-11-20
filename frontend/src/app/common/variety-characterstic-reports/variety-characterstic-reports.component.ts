import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PaginationUiComponent } from '../pagination-ui/pagination-ui.component';
import { FilterPaginateSearch } from '../data/data-among-components/filter-paginate-search';
import { VarietyCharactersticReportsViewFormComponent } from '../variety-characterstic-reports-view-form/variety-characterstic-reports-view-form.component';
import { RestService } from 'src/app/services/rest.service';
import { ActivatedRoute } from '@angular/router';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-variety-characterstic-reports',
  templateUrl: './variety-characterstic-reports.component.html',
  styleUrls: ['./variety-characterstic-reports.component.css']
})
export class VarietyCharactersticReportsComponent implements OnInit {
  // VarietyCharactersticViewFormComponent
 @ViewChild(VarietyCharactersticReportsViewFormComponent) VarietyCharactersticReportsViewFormComponent:  VarietyCharactersticReportsViewFormComponent| undefined = undefined;
   @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
   filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
   // pagination code
   pageSize: number = 2;
   currentPage: number = 1;
   paginatedData: any[] = [];
   filterForm: FormGroup;
   hideViewSection:boolean=false;
   allData: any;
   allCropNames: any[] = []; // API se load hoga
filteredCropNames: any[] = [];
   loggedInUserCropGroup: string;
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
   crop_grops;
   crop_names;
   variety_names;
   disabledfieldcropName = true;
   disabledfieldVariety = true;
   croupGroupListSecond: any;
   crop_name_list_second;
   cropVarietyDatasecond: any;
   disableFileds: boolean = true;
   variety_name_filter: any;
   // notifiedValue:any;
   notifiedVvalue;
   disableFiledsByYear: boolean = false;
   cropNotDateDatasecond: any;
   cropNotDateData: any;
   loadpageNo: any;
   constructor(private restService: RestService, private fb: FormBuilder, private route: ActivatedRoute, private service: SeedServiceService) {
     this.createEnrollForm();
   }
 
   createEnrollForm() {
     this.ngForm = this.fb.group({
       crop_group: new FormControl(''),
       crop_name: new FormControl('',),
       variety_name: new FormControl('',),
       crop_text: new FormControl('',),
       crop_name_text: new FormControl('',),
       variety_name_text: new FormControl('',),
       variety_name_filter: new FormControl(''),
       not_date: new FormControl(''),
       not_no:new FormControl('')
     });
     this.ngForm.controls['crop_group'].valueChanges.subscribe(newValue => {
       this.ngForm.controls['crop_name'].enable();
       this.ngForm.controls['crop_name'].setValue("");
       this.ngForm.controls['variety_name'].setValue("");
       this.ngForm.controls['variety_name'].disable();
       this.disabledfieldcropName = false
       this.getCropNameList(newValue);
     });
 
     this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
       if (newValue) {
         this.getCropVarietyData(newValue);
         this.ngForm.controls['variety_name'].enable();
         this.ngForm.controls['variety_name'].setValue("");
         this.disabledfieldVariety = false;
       }
     });
     this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
       if (newValue) {
         console.log(newValue)
         this.croupGroupList = this.croupGroupListSecond
         let response = this.croupGroupList.filter(x => x.group_name.toLowerCase().includes(newValue.toLowerCase()))
 
         this.croupGroupList = response
 
 
       }
       else {
         this.getCroupCroupList()
       }
     });
     this.ngForm.controls['crop_name_text'].valueChanges.subscribe(newValue => {
       if (newValue) {
         this.crop_name_list = this.crop_name_list_second
         let response = this.crop_name_list.filter(x => x.m_crop.crop_name.toLowerCase().includes(newValue.toLowerCase()))
 
         this.crop_name_list = response
 
 
       }
       else {
         this.getCropNameList(this.ngForm.controls['crop_group'].value)
       }
     });
     this.ngForm.controls['variety_name_text'].valueChanges.subscribe(newValue => {
       if (newValue) {
         this.cropVarietyData = this.cropVarietyDatasecond
         let response = this.cropVarietyData.filter(x => x['variety_name'].toLowerCase().includes(newValue.toLowerCase()))
         console.log(newValue, response, this.cropVarietyData)
 
         this.cropVarietyData = response
 
       }
       else {
         this.getCropVarietyData(this.ngForm.controls['crop_name'].value)
       }
     });
   }
   ngOnInit(): void {
     this.createForm();

  if (this.loggedInUserCropGroup === 'Oilseeds') {
    this.filterForm.patchValue({
      cropGroup: 'Oilseeds'
    });
    this.onCropGroupChange('Oilseeds'); // crop name ko bhi update karega
  }
     let user = localStorage.getItem('BHTCurrentUser');
     this.userId = JSON.parse(user);
     this.getCroupCroupList();
     this.getCropNotDateData();
     this.getPageData();
    
     this.ngForm.controls['crop_name'].disable();
     this.ngForm.controls['variety_name'].disable();
   }
   onCropGroupChange(selectedGroup: string) {
  // Crop Name ko empty karna pehle
  this.filterForm.patchValue({ cropName: '' });

  // Selected group ke basis par crop name options update karna
  this.filteredCropNames = this.allCropNames.filter(
    crop => crop.group === selectedGroup
  );
}

   getCropNotDateData() {
     this.service.postRequestCreator("get-no-year-character-data", null, null).subscribe((apiResponse: any) => {
         if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
           && apiResponse.EncryptedResponse.status_code == 200) {
           this.cropNotDateData = apiResponse.EncryptedResponse.data.rows;
           this.cropNotDateDatasecond = this.cropNotDateData
         } 
       });
   }
   createForm() {
  this.filterForm = this.fb.group({
    cropGroup: [''],
    cropName: ['']
  });
}
   getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type;
    console.log("user_type-------",user_type);
    this.loadpageNo = loadPageNumberData;
     this.service.postRequestCreator("data-characterstics-list", null, {
       page: loadPageNumberData,
       pageSize: 50,
       search: {
        user_type: user_type,
         crop_group: (this.ngForm.controls["crop_group"].value ? this.ngForm.controls["crop_group"].value:''),
         crop_name: this.ngForm.controls["crop_name"].value ? this.ngForm.controls["crop_name"].value:'',
         variety_name: this.ngForm.controls["variety_name"].value ? this.ngForm.controls["variety_name"].value:'',
         variety_name_filter: this.ngForm.controls['variety_name_filter'].value ? this.ngForm.controls['variety_name_filter'].value : '',
         user_id: this.userId && this.userId.id?this.userId.id:'',
         notification_date: this.ngForm.controls["not_date"].value ? this.ngForm.controls["not_date"].value:'',
         notification_no: this.ngForm.controls["not_no"].value ? this.ngForm.controls["not_no"].value:'',
       }
     }).subscribe((apiResponse: any) => {
       console.log(apiResponse);
       if (apiResponse !== undefined
         && apiResponse.EncryptedResponse !== undefined
         && apiResponse.EncryptedResponse.status_code == 200) {
         this.filterPaginateSearch.itemListPageSize = 50;
         console.log(apiResponse);
 
         this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
       
         if (this.allData === undefined) {
           this.allData = [];
         }
         for (let i = 0; i < this.allData.length; i++) {
           this.maturity_type = this.allData[i].matuarity_type_id;
           this.maturity_type_id = this.maturity_type ? ((this.maturity_type) == 1) ? "Early" : (this.maturity_type == 2) ? "Medium" : (this.maturity_type == 3) ? "Late" : "NA" : ''
         }
 
         this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
         this.initSearchAndPagination();
         // this.VarietyCharactersticViewFormComponent.getLissstData(this.allData[0],null,thisss.loadpageNo);
       }
     });
 
   }
   updatePaginatedData(): void {
     const startIndex = (this.currentPage - 1) * this.pageSize;
     const endIndex = startIndex + this.pageSize;
     this.paginatedData =  this.allData.slice(startIndex, endIndex);
     this.VarietyCharactersticReportsViewFormComponent.getListData(this.paginatedData[0],null,this.loadpageNo);
   }
 
   nextPage() {
     // if (this.currentPage * this.pageSize < this.allData.length) {
       this.currentPage++;
       // this.updatePaginatedData();
       this.VarietyCharactersticReportsViewFormComponent.nextPage();
     // }
   }

   
 
   previousPage() {
     // if (this.currentPage > 1) {
       this.currentPage--;
       // this.updatePaginatedData();
       this.VarietyCharactersticReportsViewFormComponent.previousPage();
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
 
 
   async getCropNameList(newValue) {
     const res = this.croupGroupList.filter(x => x.group_code == newValue);
     console.log(res);
 
 
     if (newValue) {
       const searchFilters = {
         "search": {
           "group_code": newValue
         }
       };
       this.service
         .postRequestCreator("get-distrinct-crop-name-characterstics", null, searchFilters)
         .subscribe((apiResponse: any) => {
           if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
             && apiResponse.EncryptedResponse.status_code == 200) {
             this.crop_name_list = apiResponse.EncryptedResponse.data;
             this.crop_name_list = this.crop_name_list.sort((a, b) => a.m_crop.crop_name.localeCompare(b.m_crop.crop_name));
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
     const route = "crop-group";
     const result = this.service.getPlansInfo(route).then((data: any) => {
       this.croupGroupList = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
       this.croupGroupListSecond = this.croupGroupList
     })
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
           showCancelButton: false,
           confirmButtonColor: '#E97E15'
         })
       }
     })
   }
   onSubmit(formData) {
     this.submitted = true;
     if (this.ngForm.invalid) {
       Swal.fire('Error', 'Please Fill the All Details Correctly.', 'error');
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
 
     this.ngForm.controls["crop_group"].setValue("");
     this.ngForm.controls["crop_name"].setValue("");
     this.ngForm.controls["variety_name"].setValue("");
     this.ngForm.controls['crop_text'].setValue('')
     this.ngForm.controls['crop_name_text'].setValue('');
     this.ngForm.controls["not_date"].setValue("");
     this.ngForm.controls["not_no"].setValue("");
     if (this.ngForm.controls["variety_name_filter"].value)
       this.ngForm.controls["variety_name_filter"].setValue("");
 
 
     // this.crop_name_list=[];
     // this.cropVarietyData=[];
     this.variety_names = '';
     this.crop_names = '';
     this.crop_grops = '';
     this.disabledfieldVariety = true;
     this.disabledfieldcropName = true;
 
     this.ngForm.controls['crop_name'].disable();
     this.ngForm.controls['variety_name'].disable();
     this.filterPaginateSearch.itemListCurrentPage = 1;
     this.getPageData();
     // this.filterPaginateSearch.Init(response, this, "getPageData");
     this.initSearchAndPagination();
   }
   notifiedvalue(value) {
 
     this.ngForm.controls["crop_group"].setValue("");
     this.ngForm.controls["crop_name"].setValue("");
     this.ngForm.controls["variety_name"].setValue("");
     this.ngForm.controls["variety_name_filter"].setValue("");
     this.ngForm.controls["not_date"].setValue("");
     this.ngForm.controls["not_no"].setValue("");
     this.crop_name_list = [];
     this.cropVarietyData = [];
     this.variety_names = '';
     this.crop_names = '';
     this.crop_grops = '';
     this.ngForm.controls['crop_text'].setValue('');
     this.ngForm.controls['crop_name_text'].setValue('');
 
     this.getPageData();
     if (value == 'notified') {
       this.disableFileds = true
       this.disableFiledsByYear = false
     }
 
     if (value == 'non_notified') {
       this.disableFileds = false
       this.disableFiledsByYear = false
     }
     if(value == 'notified_year'){
       this.disableFiledsByYear = true
       this.filterPaginateSearch.itemListCurrentPage = 1;
       this.getPageData();
       // this.filterPaginateSearch.Init(response, this, "getPageData");
       this.initSearchAndPagination();
     }
 
   }
   search() {
     this.hideViewSection = false
     if(!this.disableFiledsByYear){
       if (this.ngForm.controls['variety_name_filter'].invalid) {
         Swal.fire({
           title: '<p style="font-size:25px;">Variety Name Should Be More Than 2 Character.</p>',
           icon: 'error',
           confirmButtonText:
             'OK',
         confirmButtonColor: '#E97E15'
         })
         return;
       }
       if (this.disableFileds) {
         if ((!this.ngForm.controls["crop_group"].value && !this.ngForm.controls["crop_name"].value && !this.ngForm.controls["variety_name"].value)) {
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
   
   
           const route = "filter-add-characterstics-list";
           const param = {
             search: {
               crop_group: (this.ngForm.controls["crop_group"].value),
               crop_name: this.ngForm.controls["crop_name"].value,
               variety_name: this.ngForm.controls["variety_name"].value,
   
             }
   
           }
           this.filterPaginateSearch.itemListCurrentPage = 1;
           this.initSearchAndPagination();
           this.getPageData();
           let paramData = {
             search: {
               crop_group: (this.ngForm.controls["crop_group"].value ? this.ngForm.controls["crop_group"].value : ''),
               crop_name: this.ngForm.controls["crop_name"].value ? this.ngForm.controls["crop_name"].value : '',
               variety_name: this.ngForm.controls["variety_name"].value ? this.ngForm.controls["variety_name"].value : '',
               variety_name_filter: this.ngForm.controls['variety_name_filter'].value ? this.ngForm.controls['variety_name_filter'].value : '',
               user_id: this.userId && this.userId.id?this.userId.id:'',
               notification_date: this.ngForm.controls["not_date"].value ? this.ngForm.controls["not_date"].value : '',
               notification_no: this.ngForm.controls["not_no"].value ? this.ngForm.controls["not_no"].value : '',
             }
           }
           this.VarietyCharactersticReportsViewFormComponent.search(paramData);
         }
       }
       else {
   
   
         const route = "filter-add-characterstics-list";
         const param = {
           search: {
             crop_group: (this.ngForm.controls["crop_group"].value),
             crop_name: this.ngForm.controls["crop_name"].value,
             variety_name: this.ngForm.controls["variety_name"].value,
             // notification_date: this.ngForm.controls["not_date"].value,
           }
   
         }
         this.filterPaginateSearch.itemListCurrentPage = 1;
         this.initSearchAndPagination();
         this.getPageData();
         let paramData = {
           search: {
             crop_group: (this.ngForm.controls["crop_group"].value ? this.ngForm.controls["crop_group"].value : ''),
             crop_name: this.ngForm.controls["crop_name"].value ? this.ngForm.controls["crop_name"].value : '',
             variety_name: this.ngForm.controls["variety_name"].value ? this.ngForm.controls["variety_name"].value : '',
             variety_name_filter: this.ngForm.controls['variety_name_filter'].value ? this.ngForm.controls['variety_name_filter'].value : '',
             user_id: this.userId && this.userId.id?this.userId.id:'',
             notification_date: this.ngForm.controls["not_date"].value ? this.ngForm.controls["not_date"].value : '',
             notification_no: this.ngForm.controls["not_no"].value ? this.ngForm.controls["not_no"].value : '',
           }
         }
         this.VarietyCharactersticReportsViewFormComponent.search(paramData);
       }
     }else {
 
 
       const route = "filter-add-characterstics-list";
       const param = {
         search: {
           crop_group: (this.ngForm.controls["crop_group"].value),
           crop_name: this.ngForm.controls["crop_name"].value,
           variety_name: this.ngForm.controls["variety_name"].value,
           // notification_date: this.ngForm.controls["not_date"].value,
         }
 
       }
       this.filterPaginateSearch.itemListCurrentPage = 1;
       this.initSearchAndPagination();
       this.getPageData();
       let paramData = {
         search: {
           crop_group: (this.ngForm.controls["crop_group"].value ? this.ngForm.controls["crop_group"].value : ''),
           crop_name: this.ngForm.controls["crop_name"].value ? this.ngForm.controls["crop_name"].value : '',
           variety_name: this.ngForm.controls["variety_name"].value ? this.ngForm.controls["variety_name"].value : '',
           variety_name_filter: this.ngForm.controls['variety_name_filter'].value ? this.ngForm.controls['variety_name_filter'].value : '',
           user_id: this.userId && this.userId.id?this.userId.id:'',
           notification_date: this.ngForm.controls["not_date"].value ? this.ngForm.controls["not_date"].value : '',
           notification_no: this.ngForm.controls["not_no"].value ? this.ngForm.controls["not_no"].value : '',
         }
       }
       this.VarietyCharactersticReportsViewFormComponent.search(paramData);
     }
 
 
     
   }
   async getCropVarietyData(newValue) {
 
     const searchFilters = {
       "search": {
         "crop_code": newValue,
         "cropGroup": this.ngForm.controls["crop_group"].value
       }
     }
     this.service
       .postRequestCreator("get-distrinct-variety-name-characterstics", null, searchFilters)
       .subscribe((apiResponse: any) => {
         if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
           && apiResponse.EncryptedResponse.status_code == 200) {
           this.cropVarietyData = apiResponse.EncryptedResponse.data.rows;
           this.cropVarietyData.sort((a, b) => (a && a.variety_name).localeCompare(b && b.variety_name && b.variety_name))
 
           this.cropVarietyDatasecond = this.cropVarietyData
         } else {
           this.cropVarietyData = [];
           this.ngForm.controls['variety_name'].setValue("");
           this.ngForm.controls['variety_name'].disable();
         }
       });
 
 
   }
 
 
   crop(data) {
     console.log(data)
     this.crop_grops = data && data.group_name ? data.group_name : '';
     this.ngForm.controls['crop_group'].setValue(data && data.group_code ? data.group_code : '')
     this.croupGroupList = this.croupGroupListSecond
     this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
   }
   cgClick() {
     document.getElementById('crop_group').click();
   }
   cropName(data) {
     console.log(data)
     this.crop_names = data && data.m_crop && data.m_crop.crop_name ? data.m_crop.crop_name : '';
     this.ngForm.controls['crop_name'].setValue(data && data.m_crop.crop_code ? data.m_crop.crop_code : '')
     this.crop_name_list = this.crop_name_list_second
     this.ngForm.controls['crop_name_text'].setValue('', { emitEvent: false })
   }
   cnClick() {
     document.getElementById('crop_name').click();
   }
   cvClick() {
     document.getElementById('variety_name').click();
   }
 
   patchData(data,dataIndex) {
     this.hideViewSection = true
     console.log("---",this.VarietyCharactersticReportsViewFormComponent)
     this.VarietyCharactersticReportsViewFormComponent.getListData(data,dataIndex,this.loadpageNo);
   }
   VarieyName(data) {
     this.variety_names = data && data['variety_name'] ? data['variety_name'] : '';
     this.ngForm.controls['variety_name'].setValue(data && data['variety_code'] ? data['variety_code'] : '')
     this.cropVarietyData = this.cropVarietyDatasecond
     this.ngForm.controls['variety_name_text'].setValue('', { emitEvent: false })
   }
}
