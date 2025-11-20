import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { MasterService } from 'src/app/services/master/master.service';
import { IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { convertDates } from '../_helpers/utility';

@Component({
  selector: 'app-add-freeze-timeline',
  templateUrl: './add-freeze-timeline.component.html',
  styleUrls: ['./add-freeze-timeline.component.css'],
})
export class AddFreezeTimelineComponent implements OnInit {
  @ViewChild(IndentBreederSeedAllocationSearchComponent)
  indentBreederSeedAllocationSearchComponent:
    | IndentBreederSeedAllocationSearchComponent
    | undefined = undefined;
  @ViewChild(PaginationUiComponent)
  paginationUiComponent!: PaginationUiComponent;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  selectCrop: any;
  ngForm!: FormGroup;
  croupGroupList: any = [];
  croupGroup: any;
  seasonList: any;
  submissionid: any | null;
  crop_name_list: any;
  selectCrop_group: any;
  cropVarietyData: any;
  selectvariety_name: any;
  submitted: boolean = false;
  maturity_type: any;
  maturity_type_id: string;
  date: string;
  maxDate: string;
  DateValidator: boolean;
  inValidDate = '';
  todayDate = new Date();
  parsedDate = Date.parse(this.todayDate.toString());
  activitiesList: any;
  yearOfIndent: any;
  seasonsList: any;
  userType: any;
  isActionBtnDisable: boolean;
  // dateLessThan: any;
  constructor(
    private restService: RestService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private masterService: MasterService,
    private service: SeedServiceService,
    private _master: MasterService
  ) {
    this.createEnrollForm();
    this.userType = this._master?.userBasicData?.user_type ?? 'NA';
    this.isActionBtnDisable = this.userType === 'SUPERADMIN';

  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_group: new FormControl(''),
      crop_name: new FormControl(''),
      variety_name: new FormControl(''),
      start_date: new FormControl(''),
      end_date: new FormControl(''),
      season: new FormControl(''),
      year_of_indent: new FormControl(''),
      activities: new FormControl(''),
    },

      { validator: this.dateLessThan('start_date', 'end_date') });


    this.ngForm.controls['year_of_indent'].valueChanges.subscribe((newValue) => {
      this.getSeasonsData();
      this.ngForm.controls['season'].enable();
      // this.getCropNameList(newValue);
    });

    this.ngForm.controls['season'].valueChanges.subscribe((newValue) => {
      if (newValue) {
        this.getActivitiesData();
        this.ngForm.controls['activities'].enable();
      }
    });

  }
  ngOnInit(): void {
    this.ngForm.controls['activities'].disable();
    this.ngForm.controls['season'].disable();

    this.getPageData();
    // this.getSeasonData();
    this.futureDate();
    this.getYearOfIndentData();
    // this.getActivitiesData();
    // this.getSeasonsData();
    this.date = new Date().toISOString().slice(0, 10);
  }
  futureDate() {
    let date: any = new Date();
    let todayDate: any = date.getDate();
    let month: any = date.getMonth();
    let year: any = date.getFullYear();
    if (todayDate < 10) {
      todayDate = '0' + todayDate;
    }
    if (month < 10) {
      month = '0' + month;
    }
    this.maxDate = year + '-' + '-' + month + '-' + todayDate;
  }

  getPageData(
    loadPageNumberData: number = 1,
    searchData: any | undefined = undefined
  ) {
    this.masterService
      .postRequestCreator('get-freeze-timelines-data', null, {
        page: loadPageNumberData,
        // pageSize: this.filterPaginateSearch.itemListPageSize || 5,
        pageSize: 50,
        search: {
          year_of_indent: this.ngForm.controls['year_of_indent'].value,
          season_name: this.ngForm.controls['season'].value,
          activities: this.ngForm.controls['activities'].value,

          // start_date:this.ngForm.controls['start_date'].value && this.ngForm.controls['start_date'].value.singleDate && this.ngForm.controls['start_date'].value.singleDate.jsDate ? convertDates(this.ngForm.controls['start_date'].value.singleDate.jsDate):'',
          // end_date:this.ngForm.controls['end_date'].value && this.ngForm.controls['end_date'].value.singleDate && this.ngForm.controls['end_date'].value.singleDate.jsDate ? convertDates(this.ngForm.controls['end_date'].value.singleDate.jsDate):"",
        },
      })
      .subscribe((apiResponse: any) => {
        console.log(apiResponse);
        if (
          apiResponse !== undefined &&
          apiResponse.EncryptedResponse !== undefined &&
          apiResponse.EncryptedResponse.status_code == 200
        ) {
          this.filterPaginateSearch.itemListPageSize = 50;
          console.log('successfully getdata', apiResponse);

          this.allData = apiResponse.EncryptedResponse.data.rows;
          // console.log('successfully data', this.allData);

          if (this.allData === undefined) {
            this.allData = [];
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


  getCroupCroupList() {
    const route = 'crop-group';
    const result = this.service.getPlansInfo(route).then((data: any) => {
      this.croupGroupList =
        data &&
          data['EncryptedResponse'] &&
          data['EncryptedResponse'].data &&
          data['EncryptedResponse'].data
          ? data['EncryptedResponse'].data
          : '';
    });
  }


  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };
  get generateDefaultMonth(): string {
    let date = { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }

    //consolelog(date);
    return date.year + '-'
      + (date.month > 9 ? "" : "0") + date.month + '-'
      + (date.day > 9 ? "" : "0") + date.day;

  }

  onDateChanged(event: any): void {
    console.log('event========?>', event)
    // date selected
    if (this.ngForm.controls['start_date'].value.singleDate.jsDate > event.singleDate.jsDate) {
      this.inValidDate = "End Date is not Less Than Start Date"

    }
    else {
      this.inValidDate = "";
    }

  }
  onDateChangedStart(event: any): void {


    if (this.ngForm.controls['end_date'].value.singleDate.jsDate < event.singleDate.jsDate) {
      this.inValidDate = "End Date is not Less Than Start Date"

    }
    else {
      this.inValidDate = "";
    }
    // date selected

  }
  preventKeyPress(event) {
    event.preventDefault();
  }
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableSince: {}
    disableUntil: { year: 1930, month: 1, day: null },
    disableSince: { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }
  };
  myDpOptions1: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableSince: {}
    // disableUntil: { year: 1930, month: 1, day: null },
    // disableSince: { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }
  };
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
        this.masterService
          .postRequestCreator("deletefreezeModel/" + id,)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
                Swal.fire({
                  title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
                  icon: 'success',
                  confirmButtonText:
                    'OK',
                    showCancelButton: false,
                    confirmButtonColor: '#E97E15'
                }).then(x=>{
                  this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
                })
            }
          })
     
      }
    })
  }
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value && t.value && f.value > t.value) {
        this.DateValidator = false;
        //  return {
        //    dates: "Date from should be less than Date to",

        //  };
        Swal.fire({
          title: '<p style="font-size:25px;">Date from should be Less Than Date to.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        });
      }
      return {};
    };
  }
  onSubmit(formData) {
    this.submitted = true;
    if (this.ngForm.invalid) {
      Swal.fire('Error', 'Please Fill the all Details Correctly.', 'error');
      return;
    }
    let data = {
      season: formData.season,
      start_date: formData.start_date,
      end_date: formData.end_date,
    };
    this.getPageData(1, data);
  }

  clear() {
    this.ngForm.controls['season'].setValue('');
    this.ngForm.controls['year_of_indent'].setValue('');
    this.ngForm.controls['activities'].setValue('');

    this.ngForm.controls['season'].disable();
    this.ngForm.controls['activities'].disable();
    this.getPageData();

  }

  search(formData) {
    if (
      !this.ngForm.controls['year_of_indent'].value &&
      !this.ngForm.controls['start_date'].value &&
      !this.ngForm.controls['end_date'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });

      return;
    } if (this.inValidDate != '') {
      return;
    }

    else {
      const route = 'filter-add-freeze-timeline-list';
      const param = {
        season_name: this.ngForm.controls['season'].value,
        start_date: this.ngForm.controls['start_date'].value,
        end_date: this.ngForm.controls['end_date'].value,
      };
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination();
      this.getPageData();
    }
  }
  async getCropVarietyData(newValue) {
    const searchFilters = {
      search: {
        season: newValue,
        cropGroup: this.ngForm.controls['crop_group'].value,
      },
    };
    this.service
      .postRequestCreator(
        'get-distrinct-variety-name-characterstics',
        null,
        searchFilters
      )
      .subscribe((apiResponse: any) => {
        if (
          apiResponse &&
          apiResponse.EncryptedResponse &&
          apiResponse.EncryptedResponse.status_code &&
          apiResponse.EncryptedResponse.status_code == 200
        ) {
          this.cropVarietyData = apiResponse.EncryptedResponse.data;
        } else {
          this.cropVarietyData = [];
          this.ngForm.controls['variety_name'].setValue('');
          this.ngForm.controls['variety_name'].disable();
        }
      });
  }
  getSeasonData() {
    const route = 'get-season-details';
    const result = this.service
      .postRequestCreator(route, null)
      .subscribe((data) => {
        this.seasonList =
          data && data.EncryptedResponse && data.EncryptedResponse.data
            ? data.EncryptedResponse.data
            : '';
        delete this.seasonList[2];
        delete this.seasonList[3];
        const results = this.seasonList.filter((element) => {
          if (Object.keys(element).length !== 0) {
            return true;
          }
          return false;
        });
        this.seasonList = results;
      });
  }
  getYearOfIndentData() {
    const route = 'year-of-indent-activities-list';
    const result = this.masterService
      .postRequestCreator(route, null)
      .subscribe((data) => {
        let yearData =
          data && data.EncryptedResponse && data.EncryptedResponse.data
            ? data.EncryptedResponse.data
            : '';
        let year = [];
        yearData.forEach(element => {
          if (element.year != null && element.year != '' && element.year != undefined) {
            year.push(element);
          }
        });
        this.yearOfIndent = year.sort((a, b) => b.year - a.year);
        console.log('this.yearOfIndent==========',this.yearOfIndent);
      });
  }

  getSeasonsData() {
    const route = 'season-activities-list';
    const result = this.masterService
      .postRequestCreator(route, null, {
        search: {
          year_of_indent: this.ngForm.controls['year_of_indent'].value
        }
      })
      .subscribe((data) => {
        this.seasonsList =
          data && data.EncryptedResponse && data.EncryptedResponse.data
            ? data.EncryptedResponse.data
            : '';
      });

  }

  getActivitiesData() {
    const route = 'activities-list-filter';
    const result = this.masterService
      .postRequestCreator(route, null, {
        search: {
          year_of_indent: this.ngForm.controls['year_of_indent'].value,
          season: this.ngForm.controls['season'].value
        }
      })
      .subscribe((data) => {
        this.activitiesList =
          data && data.EncryptedResponse && data.EncryptedResponse.data
            ? data.EncryptedResponse.data
            : '';
      });

  }
  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }
}
