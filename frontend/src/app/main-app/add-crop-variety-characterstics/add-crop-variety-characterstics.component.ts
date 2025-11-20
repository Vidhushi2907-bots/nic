import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MasterService } from 'src/app/services/master/master.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { checkAlpha, checkAlphabet, checkDecimal, checkDecimalValue, checkDecimalValueTwoPlace, checkLength, checkNumber, convertDate, convertDates, convertDateShowValue, convertDatetoDDMMYYYY, convertDatetoDDMMYYYYwithdash, onlytwoNumberKey, PasteAlpha } from 'src/app/_helpers/utility';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
// import { NameValidator } from './name.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-crop-variety-characterstics',
  templateUrl: './add-crop-variety-characterstics.component.html',
  styleUrls: ['./add-crop-variety-characterstics.component.css']
})
export class AddCropVarietyCharactersticsComponent extends ngbDropdownEvents implements OnInit {
  @ViewChild("fileUploadInput")
  fileUploadInput!: ElementRef<any>;
  enrollFormGroup!: FormGroup;
  submitted = false;
  ImgError = '';
  modalRef: any;
  formGroup: FormGroup = new FormGroup([]);
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  ngForm!: FormGroup;
  state_cultivation;
  selected_insitution;
  state!: boolean;
  UploadSection!: boolean;
  pdfFile: any;
  filename: any;
  actualFileName: any;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsRegion: IDropdownSettings = {};
  dropdownSettingsMajorInsectPests: IDropdownSettings = {};
  dropdownSettingsMajorDiseases: IDropdownSettings = {};
  dropdownSettingsClimate: IDropdownSettings = {};
  errorHiden!: boolean;
  error!: string;
  url_upload!: string | ArrayBuffer | null;
  file: any;
  imgSrc: any;
  cropname: any;
  value = "Select Crop Group";
  crop_name: any;
  variety_name: any;
  variety_code: any;
  state_for_cultivation: any;
  maturity_type: any;
  responsibleInsitution: any;
  submissionid = this.route.snapshot.paramMap.get('submissionId');
  data: any = [];
  allData: any = [];
  selectCrop: any;
  croupGroupList: any;
  crop_name_list: any;
  isCropName: boolean;
  cropVarietyData: any;
  checkValue = 0;
  // disabledfield:boolean
  isEdit = false;
  fertilizer_value;
  file_name = null

  // get enrollFormControls() {
  //   return this.enrollFormGroup.controls;
  // }
  stateList = [];
  submitHide = true;
  apiResponseData: any;
  imgBaseUrl: any;
  check_notified: any;
  developed_by: any;
  developed_by_data: any;
  formData: any;
  FileData: File;
  varietyCodes: any;
  image: string | ArrayBuffer;
  fileToUpload: File;
  imageUrl: any;
  url = '';
  model;
  disablename = true
  variety_code_value: any;
  percentageValidation = '';
  institutionData = [];
  disabledfield: boolean = false;
  Imagename: any;
  fileImage: any;
  fertilizer_check_box;
  varietyCode: any;
  nitrogenValidation = '';
  phosphorusvalidation = '';
  potashValidation = '';
  isView = false;
  maturity_from_error = '';
  spacingError = '';
  averageError = '';
  seedRateError = '';
  percentage: any;
  variety_name_value: any;
  isShowDiv: boolean;
  isActive: number;
  ipAddres: any;
  historyData =
    {
      action: '',
      comment: '',
      formType: ''
    }
  userId: any;
  pathmulti: any;
  selectedFiles: File;
  fileName: any;
  downloadUrl = '';
  fileData = new FormData();
  image_name: any;
  imageIconName: any;
  cropVarietyCodeData: any;
  pastedNumber: any;
  pastedText: string;
  cropVariety: any;
  crop_code: any;
  variety_Code: any;
  crop_group;
  crop_groups;
  croupGroupListSecond: any;
  crop_names;
  variety_names;
  state_names;
  insitutions: any;
  crop_name_list_second: any;
  getCropVarietyCodeDatasecond: any;
  stateListSecond: any[];
  institutionDataSecond: any[];
  otherfertilizerData: any;
  regionsData: any;
  cropBasicData: any;
  ipCheckValue: number;
  giCheckValue: number;
  isIpProtect: boolean;
  isGiTarget: boolean;
  ip_protect_msg: string;
  gi_target_msg: string;
  maturityInDaysData: any;
  climateResilienceData: any;
  reactionToMajorDiseasesData: any;
  reactionToMajorInsectPestsData: any;
  agroEcologicalRegionsStateWise: any = [];
  stateByBspcData: any;
  muturityStatus: number;
  varietyCategories: any;
  agroRegionMaapingData: any;
  multiSel =false
  get enrollFormControls() {
    return this.enrollFormGroup.controls;
  }
  todaysDate: Date = new Date();
  parsedDate = Date.parse(this.todaysDate.toString());
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };
  get generateDefaultMonth(): string {
    return (this.todaysDate.getMonth() > 9 ? "" : "0") + (this.todaysDate.getMonth() + 1) + '/' + (this.todaysDate.getFullYear() - 18)
  }
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'DD/MM/YYYY',
    disableSince: { year: this.todaysDate.getFullYear() - 18, month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 },
    disableUntil: { year: this.todaysDate.getFullYear() - 40, month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 }
  };

  constructor(private masterService: MasterService, private router: Router, private service: SeedServiceService, private fb: FormBuilder, private modalService: BsModalService,
    private http: HttpClient, private route: ActivatedRoute, private restService: RestService) {
    super();
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_group: ['', Validators.required],
      crop_name: ['', Validators.required],
      variety_code: ['', Validators.required],
      variety_name: ['', Validators.required],
      notification_date: [''],
      notification_number: [''],
      meeting_number: [''],
      notified: [''],
      category: [''],
      year_release: [''],
      select_type: [''],
      select_state: [''],
      file: ['',],
      developed_by: [''],
      year_of_introduction: [''],
      iet_number: ['',],
      insitution: ['', [Validators.required]],
      resemblance_to_variety: [''],
      // [, Validators.pattern('^[a-zA-Z]*$')]
      // ------------------------------new----------//
      parentage: ['', []],
      maturity_from: ['',],
      maturity_to: ['',],
      // Validators.required
      region_data: ['',],
      maturity_date: ['',],
      spacing_from: ['',],
      spacing_to: ['',],
      spacing_date: ['',],
      maturity_type: ['',],
      generic_morphological_characteristics: ['',],
      specific_morphological_characteristics: [''],
      seed_rate: ['',],
      crop_code: ['',],
      notified_non_notified: [''],
      type: ['',],
      state_for_cultivation_central: ['', [Validators.required]],

      // ------------------------------------------//
      average_from: ['', [Validators.required, Validators.maxLength(9), this.noOnlySpacesValidator()]],
      average_to: ['', [Validators.maxLength(9), this.noOnlySpacesValidator()]],
      average_total: ['',],
      fertilizer_dosage: ['',],
      agronomic_features: [''],
      recommended_ecology: ['',
        // Validators.compose([
        //   Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        //   Validators.pattern('^[A-Za-z ]{0,50}$')])
      ],


      abiotic_stress: ['',
        // Validators.compose([
        //   Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]
      ],
      //   Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
      state_for_cultivation: [''],
      major_diseases: [''],
      major_pest: ['', [Validators.required]],
      // Validators.compose([
      //   Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
      // ])
      state_of_release: [""],
      nitrogen: [''],
      phosphorus: [''],
      potash: [''],
      others: [''],
      fertilizer_other_name: [''],
      fertilizer_other_value: [''],
      status_toggle: [''],
      crop_text: [''],
      crop_name_text: [''],
      variety_name_text: [''],
      state_name_text: [''],
      insitution_text: [''],
      ip_check: [''],
      ip_protect_protected: [''],
      gi_tagged: [''],
      fertilizerother: this.fb.array([
        this.varietyItem()
      ]),
      climate_resilience: [],
      product_quality_attributes: [],
      gi_tagged_reg_no: [''],
      ip_protected_reg_no: [],
      regions: this.fb.array([
        // this.bspcCreateForm()
      ])
    });
    //ts
    this.ngForm.controls['category'].disable();
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.croupGroupList = this.croupGroupListSecond
        let response = this.croupGroupList.filter(x => x.group_name.toLowerCase().includes(newValue.toLowerCase()))

        this.croupGroupList = response
        // console.log('this.cropNameDataSecond',this.cropNameDataSecond,this.cropNameData)

      }
      else {
        // this.getCropGropuList()
      }
    });
    this.ngForm.controls['insitution_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.institutionData = this.institutionDataSecond
        let response = this.institutionData.filter(x => x.institute_name.toLowerCase().includes(newValue.toLowerCase()))
        this.institutionData = response
      }
      else {
        this.getInsitution()
      }
    });
    this.ngForm.controls['crop_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.crop_name_list = this.crop_name_list_second
        let response = this.crop_name_list.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))

        this.crop_name_list = response
        // console.log('this.cropNameDataSecond',this.cropNameDataSecond,this.cropNameData)

      }
      else {
        // this.getCroupNameList(this.ngForm.controls['crop_group'].value)
      }
    });
    this.ngForm.controls['variety_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropVarietyCodeData = this.getCropVarietyCodeDatasecond
        let response = this.cropVarietyCodeData.filter(x => x.variety_name.toLowerCase().includes(newValue.toLowerCase()))

        this.cropVarietyCodeData = response
        // console.log('this.cropNameDataSecond',this.cropNameDataSecond,this.cropNameData)

      }
      else {
        this.getCropVarietyCodeData(this.ngForm.controls['crop_name'].value)
      }
    });
    this.ngForm.controls['state_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.stateList = this.stateListSecond
        let response = this.stateList.filter(x => x.state_name.toLowerCase().includes(newValue.toLowerCase()))

        this.stateList = response
        // console.log('this.cropNameDataSecond',this.cropNameDataSecond,this.cropNameData)

      }
      else {
        this.getStateList()
      }
    });
    //formcontroll implemetation
    if (this.router.url.includes('view')) {
      // this.title = 'View Crop : To View Crop';
      this.disabledfield = true;
      // this.cancelbtn = false;
      this.isView = true;
      this.submitHide = false;
      this.isEdit = false;
      this.ngForm.disable();
      this.getListData();
      this.getOtherFertilizerDataValue()
    }
    if (this.router.url.includes('edit')) {
      // this.title = 'Update Crop : To Update Crop';
      this.disabledfield = false;
      this.isView = false;
      // this.cancelbtn = true;
      this.isEdit = true;
      this.getListData();
      this.getOtherFertilizerDataValue()

    }


    this.ngForm.controls['crop_group'].valueChanges.subscribe(newValue => {
      // this.ngForm.controls["variety_code"].setValue('');
      this.check_notified = '';
      if (newValue) {
        this.ngForm.controls["variety_name"].setValue('');
        this.ngForm.controls["notified_non_notified"].setValue('');
        this.ngForm.controls["type"].setValue('');
        this.ngForm.controls["developed_by"].setValue('');
        this.ngForm.controls["notification_date"].setValue('');
        this.ngForm.controls["year_of_introduction"].setValue('');
        this.ngForm.controls["notification_number"].setValue('');
        this.ngForm.controls["meeting_number"].setValue('');
        this.ngForm.controls["year_release"].setValue('');
        // this.ngForm.controls["crop_name"].setValue('');

        this.getCroupNameList(newValue);
        this.disablename = true;
      }
    });
    this.ngForm.controls['nitrogen'].valueChanges.subscribe(newValue => {
      if (parseInt(newValue) > 500) {
        this.nitrogenValidation = 'It Should less than 500 kg'
      }
      else {
        this.nitrogenValidation = ''
      }

    });
    this.ngForm.controls['maturity_from'].valueChanges.subscribe(newValue => {
      if (parseInt(newValue) > 500) {
        this.maturity_from_error = 'It Should Less Than 500 '
      }
      else {
        this.maturity_from_error = ''
      }

    });
    this.ngForm.controls['parentage'].valueChanges.subscribe(newValue => {

      this.percentage = newValue

      if (parseInt(newValue) > 100) {
        // this.nitrogenValidation = 'It Should less than 500 kg'
        // newValue = (newValue.indexOf(".") >= 0) ? (newValue.substr(0, newValue.indexOf(".")) + newValue.substr(newValue.indexOf("."), 3)) : newValue;
        this.percentageValidation = 'Percentage  Should Less Than 100'
      }
      else {
        this.percentageValidation = ''
      }

    });
    this.ngForm.controls['phosphorus'].valueChanges.subscribe(newValue => {
      if (parseInt(newValue) > 500) {
        this.phosphorusvalidation = 'It Should Less Than 500 kg'
      }
      else {
        this.phosphorusvalidation = ''
      }

    });
    this.ngForm.controls['potash'].valueChanges.subscribe(newValue => {
      if (parseInt(newValue) > 500) {
        this.potashValidation = 'It Should Less Than 500 kg'
      }
      else {
        this.potashValidation = ''
      }

    });
    // this.ngForm.controls['average_from'].valueChanges.subscribe(newValue => {
    //   if (parseInt(newValue) > 99999) {
    //     this.averageError = 'It Should Less Than 99999 '
    //   }
    //   else {
    //     this.averageError = ''
    //   }

    // });
    this.ngForm.controls['seed_rate'].valueChanges.subscribe(newValue => {
      if (parseInt(newValue) > 500) {
        this.seedRateError = 'It Should Less Than 500 '
      }
      else {
        this.seedRateError = ''
      }

    });
    this.ngForm.controls['spacing_from'].valueChanges.subscribe(newValue => {
      if (parseInt(newValue) > 500) {
        this.spacingError = 'It Should Less Than 500 '
      }
      else {
        this.spacingError = ''
      }

    });

    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      // this.getCropVarietyData(newValue);
      this.getCropDistinctVarietyCodeData(newValue);
      this.cropScientificNameData();
      // this.ngForm.controls["variety_code"].setValue('');
      this.ngForm.controls["variety_name"].setValue('');
      this.ngForm.controls["notified_non_notified"].setValue('');
      this.ngForm.controls["type"].setValue('');
      this.ngForm.controls["developed_by"].setValue('');
      this.ngForm.controls["notification_date"].setValue('');
      this.ngForm.controls["year_of_introduction"].setValue('');
      this.ngForm.controls["notification_number"].setValue('');
      this.ngForm.controls["meeting_number"].setValue('');
      this.ngForm.controls["year_release"].setValue('');
      this.check_notified = '';
      this.variety_code_value = newValue;
      this.disablename = false;
    });

    this.ngForm.controls['variety_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // if(!this.router.url.includes('edit')){

        this.filterCropData(newValue)
        // }
        this.getDynamicVarietyCode(this.ngForm.controls["variety_name"].value);
      }
      else {
        console.log('controls===>', this.ngForm.controls)
        this.check_notified = '';
        // this.ngForm.controls["variety_code"].setValue('');
        this.ngForm.get('variety_name').patchValue('', { emitEvent: false });
        this.ngForm.controls["notified_non_notified"].setValue('');
        this.ngForm.controls["type"].setValue('');
        this.ngForm.controls["developed_by"].setValue('');
        this.ngForm.controls["notification_date"].setValue('');
        this.ngForm.controls["year_of_introduction"].setValue('');
        this.ngForm.controls["notification_number"].setValue('');
        this.ngForm.controls["meeting_number"].setValue('');
        this.ngForm.controls["year_release"].setValue('');
      }
    });
    if (this.ngForm.controls['crop_name'].value) {

    }

  }
  get regions(): FormArray {
    return this.ngForm.get('regions') as FormArray;
  }
  regionsCreateForm(): FormGroup {
    return this.fb.group({
      id: [''],
      regions_checkbox: [''],
      regions_id: [''],
      regions_name: [''],
    })
  }
  varietyItem() {
    let temp = this.fb.group({
      fertilizer_other_name: ['',],
      fertilizer_other_value: ['',],

    });
    return temp;
  }
  ngOnInit(): void {
    this.getAgroEcologicalRegions();
    this.loadCategory();
    this.getAgroRegionDataMapping();
    this.dropdownSettings = {
      idField: 'state_code',
      textField: 'state_name',
      enableCheckAll: true,
      allowSearchFilter: true,
       // Enable the Select All option
      // itemsShowLimit: 2,
      limitSelection: -1,
    };
    this.dropdownSettingsRegion = {
      idField: 'id',
      textField: 'regions_name',
      enableCheckAll: false,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
    };

    this.dropdownSettingsMajorInsectPests = {
      idField: 'id',
      textField: 'name',
      enableCheckAll: false,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
    };

    this.dropdownSettingsMajorDiseases = {
      idField: 'id',
      textField: 'name',
      enableCheckAll: false,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
    };

    this.dropdownSettingsClimate = {
      idField: 'id',
      textField: 'name',
      enableCheckAll: false,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
    };

    this.submissionid = this.route.snapshot.paramMap.get('submissionId');
    this.getPageData();
    this.getCropGropuList();
    this.getStateList();
    this.initProcess();
    this.getMuturityData();
    this.getIPAddress();
    this.getReactionToMajorInsectPestsData();
    this.getClimateResilienceData();
    this.getreactiontomajorDiseasesdata();
    this.ngForm.controls['state_of_release'].setValue(0);
    this.ngForm.controls["variety_code"].disable();

    //get user id from localstorage
    let user = localStorage.getItem('BHTCurrentUser')

    this.userId = JSON.parse(user)
    this.checkValue = 0;

    // this.ngForm.controls['variety_code'].disable();
    this.ngForm.controls['notification_date'].disable();
    this.ngForm.controls['year_of_introduction'].disable();
    this.ngForm.controls['notification_number'].disable();
    this.ngForm.controls['meeting_number'].disable();
    this.ngForm.controls['year_release'].disable();

  }
  initProcess() {
    this.getInsitution();
  }
  getIPAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddres = res.ip;

    });
  }
  audtiTrailsHistory(historyData) {

    this.service.postRequestCreator('audit-trail-history', null, {
      "action_at": historyData.action,
      "action_by": this.userId.name,
      "application_id": "1234",
      "column_id": this.submissionid ? this.submissionid : '',
      "comment": historyData.comment,
      "form_type": historyData.formType,
      "ip": this.ipAddres,
      "mac_number": "12345678",
      "table_id": this.submissionid ? this.submissionid : ''
    }).subscribe(res => {

    });
  }

  filterCropData(newValue) {

    // this.getCropVarietyData(newValue);
    const result = this.cropVarietyCodeData && this.cropVarietyCodeData.filter(x => parseInt(x.id) === parseInt(newValue));

    this.developed_by = result && result[0] && result[0].developed_by ? result[0].developed_by : ''

    this.ngForm.controls['variety_code'].patchValue(result && result[0].variety_code ? result[0].variety_code : null);
    if (result && result[0].is_notified) {
      if (parseInt(result[0].is_notified) === 1) {
        this.check_notified = 'Notified'
      }
      if (parseInt(result[0].is_notified) === 0) {
        this.check_notified = 'Non-Notied'
      }
      if (this.developed_by == 'Public sector') {

        this.ngForm.controls['developed_by'].setValue(this.developed_by);
      }
      if (this.developed_by == 'Private sector') {

        this.ngForm.controls['developed_by'].setValue(this.developed_by);
      }
      if (this.developed_by.includes('Prvate Sector')) {
        this.developed_by = 'Private Sector';

        this.ngForm.controls['developed_by'].setValue(this.developed_by);
      }
      this.ngForm.controls['developed_by'].setValue(this.developed_by);
    }
    // console.log('notification date',result[0].not_date);
    if (result && result[0])
      this.ngForm.controls["type"].setValue(result[0].type)

    this.ngForm.controls["notified_non_notified"].setValue(this.check_notified)
    if (this.check_notified == 'Notified') {
      this.ngForm.controls["notification_number"].setValue(result[0].not_number)
      console.log(result[0].not_number)
      this.ngForm.controls["notification_date"].setValue(result[0].not_date)
      console.log('result[0].not_date', result[0].not_date)
      this.ngForm.controls["meeting_number"].setValue(result[0].meeting_number);
      this.ngForm.controls["year_release"].setValue(result[0].release_date);
      // this.ngForm.controls["year_of_introduction"].setValue("NULL");

    }
    else {
      if (result && result[0])
        this.ngForm.controls["year_of_introduction"].setValue(result[0].introduce_year);
      // introduce_year
    }

  }


  getPageData() {
    this.restService.getAddCropCharacterSticsList().subscribe(data => {
      this.allData = data;


      for (let i in data) {
        if (data) {


        }



      }
      // this.result =[...new Set (this.datas)];



      // this.filterPaginateSearch.Init(data, this, "getPageData");
      // this.initSearchAndPagination();

    });

  }

  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  stateofRelease(item: any) {
    this.ngForm.controls['state_of_release'].setValue(item);
    if (parseInt(item) === 0) {
      this.state = false;
      this.checkValue = 0;
    }
    else {
      this.state = true;
      this.checkValue = 1;

    }
  }
  ipProtectedValue(item: any) {
    // this.ngForm.controls['state_of_release'].setValue(item);
    if (parseInt(item) === 0) {
      this.state = false;
      this.isIpProtect = false;
      this.ipCheckValue = 0;
      this.ngForm.controls['ip_protected_reg_no'].setValue('');
      this.ngForm.controls['ip_protected_reg_no'].setValidators(null);
      this.ngForm.controls['ip_protected_reg_no'].updateValueAndValidity();
    }
    else {
      this.state = true;
      this.ngForm.controls['ip_protected_reg_no'].setValidators(Validators.required);
      this.isIpProtect = true;
      this.ipCheckValue = 1;
    }
  }
  giTaggedValue(item: any) {
    // this.ngForm.controls['state_of_release'].setValue(item);
    if (parseInt(item) === 0) {
      this.state = false;
      this.giCheckValue = 0;
      this.isGiTarget = false;
      this.ngForm.controls['gi_tagged_reg_no'].setValue('')
      this.ngForm.controls['gi_tagged_reg_no'].setValidators(null);
      this.ngForm.controls['gi_tagged_reg_no'].updateValueAndValidity();
    }
    else {
      this.state = true;
      this.ngForm.controls['gi_tagged_reg_no'].setValidators(Validators.required);
      this.isGiTarget = true;
      this.giCheckValue = 1;

    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.enrollFormGroup.controls;
  }
  // get enrollFormControl(): { [key: string]: AbstractControl } {
  //   return this.enrollFormGroup.controls;
  // }

  enrollFormSave() {
    this.submitted = true;
    if (this.isIpProtect || this.isGiTarget) {
      if (this.ngForm.controls['ip_protected_reg_no'].invalid || this.ngForm.controls['gi_tagged_reg_no'].invalid) {
        return;
      }
    }

    // console.log('nggform', this.ngForm.value.fertilizerother, this.ngForm.controls['fertilizer_dosage'].value)
    const res = this.croupGroupList.filter(x => x.group_code === this.ngForm.controls['crop_group'].value);
    const varietyName = this.cropVarietyCodeData.filter(item => item.id == this.ngForm.controls['variety_name'].value);
    let data = {}
    const date = new Date(this.ngForm.controls['notification_date'].value);
    let notificationYear = date.getFullYear();
    // console.log('fertilizer_value', this.fertilizer_value)
    if (this.fertilizer_value == 0) {
      data = {
        crop_group_id: parseInt(res[0].id),
        data: this.downloadUrl ? this.downloadUrl : '',

        crop_group: (this.ngForm.controls['crop_group'].value),
        // image_data: this.image_name,
        crop_code: this.ngForm.controls['crop_name'].value,
        crop_name: this.ngForm.controls['crop_name'].value,
        variety_id: this.ngForm.controls['variety_name'].value,
        variety_code: this.ngForm.controls['variety_code'].value,
        regions: this.ngForm.controls['regions'].value,
        variety_name: varietyName[0].variety_name,
        notification_date: this.ngForm.controls['notification_date'].value,
        year_of_introduction_market: this.ngForm.controls['year_of_introduction'].value,
        meeting_number: (this.ngForm.controls['meeting_number'].value),
        notification_number: (this.ngForm.controls['notification_number'].value) ? (this.ngForm.controls['notification_number'].value).toString() : '',

        responsible_insitution_for_breeder_seed: this.ngForm.controls['insitution'].value,
        year_release: this.ngForm.controls['year_release'].value,

        select_state_release: (this.ngForm.controls['state_of_release'].value),
        resemblance_to_variety: this.ngForm.controls['resemblance_to_variety'].value,
        percentage: parseInt(this.ngForm.controls['parentage'].value),
        maturity_from: parseInt(this.ngForm.controls['maturity_from'].value),
        iet_number: this.ngForm.controls['iet_number'].value,
        maturity_to: parseInt(this.ngForm.controls['maturity_to'].value),
        matuarity_type_id: parseInt(this.ngForm.controls['maturity_type'].value),
        maturity_date: (this.ngForm.controls['maturity_date'].value),
        spacing_from: parseInt(this.ngForm.controls['spacing_from'].value),
        spacing_to: parseInt(this.ngForm.controls['spacing_to'].value),
        spacing_date: (this.ngForm.controls['spacing_date'].value),
        generic_morphological: (this.ngForm.controls['generic_morphological_characteristics'].value),
        specific_morphological_characteristics: this.ngForm.controls['specific_morphological_characteristics'].value,
        seed_rate: this.ngForm.controls['seed_rate'].value,

        recommended_state: this.checkValue == 0 ? this.ngForm.controls['state_for_cultivation'].value : null,
        average_yeild_from: parseFloat(this.ngForm.controls['average_from'].value),
        average_yeild_to: parseFloat(this.ngForm.controls['average_to'].value),
        average_total: parseFloat(this.ngForm.controls['average_total'].value),
        agronomic_features: this.ngForm.controls['agronomic_features'].value,
        recommended_ecology: this.ngForm.controls['recommended_ecology'].value,
        abiotic_stress: (this.ngForm.controls['abiotic_stress'].value),
        major_diseases: this.ngForm.controls['major_diseases'].value,
        major_pest: this.ngForm.controls['major_pest'].value,
        nitrogen: this.ngForm.controls['nitrogen'].value,
        phosphorus: this.ngForm.controls['phosphorus'].value,
        potash: this.ngForm.controls['potash'].value,
        fertilizer_dosage: this.fertilizer_value && (this.fertilizer_value == 1) ? '1' : this.fertilizer_value == 0 ? '0' : '',
        fertilizerother: this.ngForm.controls['fertilizerother'].value,
        // fertilizer_other_name: this.ngForm.controls['fertilizer_other_name'].value,
        // fertilizer_other_value: this.ngForm.controls['fertilizer_other_value'].value,
        state: this.ngForm.controls['state_for_cultivation_central'].value,
        active: 1,
        region_data: this.ngForm.controls['region_data'].value,
        climate_resilience: this.ngForm.controls['climate_resilience'].value,
        product_quality_attributes: this.ngForm.controls['product_quality_attributes'].value,
        gi_tagged_reg_no: this.ngForm.controls['gi_tagged_reg_no'].value,
        ip_protected_reg_no: this.ngForm.controls['ip_protected_reg_no'].value
      }
    } else {
      data = {
        crop_group_id: parseInt(res[0].id),
        data: this.downloadUrl ? this.downloadUrl : '',

        crop_group: (this.ngForm.controls['crop_group'].value),
        // image_data: this.image_name,
        crop_code: this.ngForm.controls['crop_name'].value,
        crop_name: this.ngForm.controls['crop_name'].value,
        variety_id: this.ngForm.controls['variety_name'].value,
        variety_code: this.ngForm.controls['variety_code'].value,
        variety_name: varietyName[0].variety_name,
        notification_date: this.ngForm.controls['notification_date'].value,
        notification_year: notificationYear ? notificationYear : null,
        regions: this.ngForm.controls['regions'].value,
        year_of_introduction_market: this.ngForm.controls['year_of_introduction'].value,
        meeting_number: (this.ngForm.controls['meeting_number'].value),
        notification_number: (this.ngForm.controls['notification_number'].value) ? (this.ngForm.controls['notification_number'].value).toString() : '',

        responsible_insitution_for_breeder_seed: this.ngForm.controls['insitution'].value,
        year_release: this.ngForm.controls['year_release'].value,

        select_state_release: (this.ngForm.controls['state_of_release'].value),
        resemblance_to_variety: this.ngForm.controls['resemblance_to_variety'].value,
        percentage: parseInt(this.ngForm.controls['parentage'].value),
        maturity_from: parseInt(this.ngForm.controls['maturity_from'].value),
        iet_number: this.ngForm.controls['iet_number'].value,
        maturity_to: parseInt(this.ngForm.controls['maturity_to'].value),
        matuarity_type_id: parseInt(this.ngForm.controls['maturity_type'].value),
        maturity_date: (this.ngForm.controls['maturity_date'].value),
        spacing_from: parseInt(this.ngForm.controls['spacing_from'].value),
        spacing_to: parseInt(this.ngForm.controls['spacing_to'].value),
        spacing_date: (this.ngForm.controls['spacing_date'].value),
        generic_morphological: (this.ngForm.controls['generic_morphological_characteristics'].value),
        specific_morphological_characteristics: this.ngForm.controls['specific_morphological_characteristics'].value,
        seed_rate: this.ngForm.controls['seed_rate'].value,

        recommended_state: this.checkValue == 0 ? this.ngForm.controls['state_for_cultivation'].value : null,
        average_yeild_from: parseFloat(this.ngForm.controls['average_from'].value),
        average_yeild_to: parseFloat(this.ngForm.controls['average_to'].value),
        average_total: parseFloat(this.ngForm.controls['average_total'].value),
        agronomic_features: this.ngForm.controls['agronomic_features'].value,
        recommended_ecology: this.ngForm.controls['recommended_ecology'].value,
        abiotic_stress: (this.ngForm.controls['abiotic_stress'].value),
        major_diseases: this.ngForm.controls['major_diseases'].value,
        major_pest: this.ngForm.controls['major_pest'].value,
        nitrogen: this.ngForm.controls['nitrogen'].value,
        phosphorus: this.ngForm.controls['phosphorus'].value,
        potash: this.ngForm.controls['potash'].value,
        fertilizer_dosage: this.fertilizer_value && (this.fertilizer_value == 1) ? '1' : this.fertilizer_value == 0 ? '0' : '',
        // fertilizerother:this.ngForm.controls['fertilizerother'].value,
        // fertilizer_other_name: this.ngForm.controls['fertilizer_other_name'].value,
        // fertilizer_other_value: this.ngForm.controls['fertilizer_other_value'].value,
        state: this.ngForm.controls['state_for_cultivation_central'].value,
        active: 1,
        region_data: this.ngForm.controls['region_data'].value,
        climate_resilience: this.ngForm.controls['climate_resilience'].value,
        product_quality_attributes: this.ngForm.controls['product_quality_attributes'].value,
        gi_tagged_reg_no: this.ngForm.controls['gi_tagged_reg_no'].value,
        ip_protected_reg_no: this.ngForm.controls['ip_protected_reg_no'].value
      }
    }
    console.log('this.ngForm======', this.ngForm);
    if (this.ngForm.invalid) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please fill all required fields.</p>',
        icon: 'success',
        confirmButtonText:
          'OK',
        showCancelButton: false,
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    // if (this.ngForm.invalid || this.nitrogenValidation
    //   // || this.ImgError 
    //   || this.phosphorusvalidation || this.potashValidation || this.percentageValidation || this.seedRateError || this.averageError || this.spacingError || this.maturity_from_error) {
    //   return;
    // }

    this.service
      .postRequestCreator('submit-data-characterstics', null, data)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          this.historyData.action = "Add";
          this.historyData.comment = "Add Form Successfully";
          this.historyData.formType = " Crop Variety Characteristics";

          this.audtiTrailsHistory(this.historyData);

          Swal.fire({
            title: '<p style="font-size:25px;">Data submitted successfully.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            showCancelButton: false,
            confirmButtonColor: '#E97E15'
          }).then(x => {

            this.router.navigate(['/add-crop-character-list']);
          })
        } else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 409) {
          Swal.fire({
            title: '<p style="font-size:25px;">Variety Name Already Exists.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
        } else {
          if (!data)
            Swal.fire({
              title: '<p style="font-size:25px;">An Error Occured.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            })

        }
      });
  }
  uploadImage() {
    (document.getElementById('fileInput') as HTMLInputElement).click();
  }
  onSubmit() {

  }
  onSelectFileUpload(event: any) {
    // this.uploadImage();
    (document.getElementById('fileInput') as HTMLInputElement).click();
    this.file = (document.getElementById('fileInput') as HTMLInputElement).value;
    let files = event.target.files[0]
    var allowedExtensions =
      /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    this.ImgError = '';
    // Image preview
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => {
        this.imgSrc = event.target?.result;
        this.imgBaseUrl = this.imgSrc.split(",")
        // const reader = new FileReader();

        reader.readAsDataURL(this.file);

      };
    }
  }

  uploadFile(file: File) {

  }

  viewUploadedDoc(template: any) {
    if (this.ImgError == '') {
      // if (this.url != '') {

      this.modalRef = this.modalService.show(template, {
        class: 'modal-dialog-centered modal-md'
      });
      // }
    }

    else {
      this.modalService.hide()
    }
  }

  clearFilter(e: any) {

  }

  ngDropDwonClick(item: any) {
    // this.value=
    this.value = item
    this.ngForm.controls['crop_group'].setValue(this.value)
  }



  cultivation(value: any) {
    this.state_for_cultivation = value;

    this.ngForm.controls['state_for_cultivation'].setValue(this.state_for_cultivation);

  }
  maturity(item: any) {
    this.maturity_type = item;
    this.ngForm.controls['maturity_type'].setValue(this.maturity_type);

  }
  insitution(item: any) {
    this.responsibleInsitution = item
    // resemblance_to_variety
    this.ngForm.controls['resemblance_to_variety'].setValue(this.maturity_type);
  }
  getCropGropuList() {
    const route = "crop-group";
    const result = this.service.postRequestCreator(route, null).subscribe(data => {
      this.croupGroupList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.croupGroupListSecond = this.croupGroupList ? this.croupGroupList : ''
    })

  }
  getCroupNameList(newValue: any) {
    // this.selectCrop_group = "";
    const route = "getdistinctCropNameInVariety";
    const search = {
      'search': {
        'group_code': newValue,
        view: this.isView ? this.isView : ''
      }
    }
    this.service
      .postRequestCreator(route, null, search)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.isCropName = true;

          this.crop_name_list = apiResponse.EncryptedResponse.data;
          let datas;


          for (let index = 0; index < this.crop_name_list.length; index++) {

            let abc = this.crop_name_list.filter(x => x.m_crop != null);
            const resultData = this.crop_name_list.filter((thing, index, self) =>
              index === self.findIndex((t) => (
                t.crop_name === thing.crop_name
              ))
            )
            this.crop_name_list = resultData;
            this.crop_name_list = this.crop_name_list.sort((a, b) => a.crop_name.localeCompare(b.crop_name));
            this.crop_name_list_second = this.crop_name_list


          }
        }
      });

    // const result = this.service.getPlansInfo(route).then((data: any) => {
    //   this.crop_name_list = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    // })
  }
  async getCropVarietyData(newValue) {
    const searchFilters = {
      "search": {
        "crop_code": newValue
      }
    };
    this.service
      .postRequestCreator("get-crop-veriety-list", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.cropVarietyData = apiResponse.EncryptedResponse.data.rows;
          this.cropVarietyData = this.cropVarietyData.sort((a, b) => a.variety_name.localeCompare(b.variety_name))
        }
      });
  }

  checkNumber($event) {
    checkNumber($event);
  }
  checkLength($event, length) {
    checkLength($event, length);
  }
  checkDecimal(e) {
    checkDecimalValueTwoPlace(e)
    // checkDecimalValue(e);
  }
  checkDecimals($event) {


    // checkDecimals($event);
  }
  checkAlpha($event) {
    checkAlpha($event);
  }


  checkAlphabet(event) {
    checkAlphabet(event)
  }

  getListData() {
    // this.getSeasonData();
    const param = {
      search: {
        view: ''
      }
    }
    const result = this.service.postRequestCreator("data-characterstics-list/" + this.submissionid, null, param).subscribe((data: any) => {
      this.apiResponseData = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
      // console.log('reaction_to_pets_json=====',this.apiResponseData[0].m_variety_characteristic['reaction_to_pets_json']);
      this.checkValue = (this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['select_state_release'] ? this.apiResponseData[0].m_variety_characteristic['select_state_release'] : 0);
      console.log('this.apiResponseData[0].m_variety_characteristic[is_active]=',this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic['is_active']);
      if (this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['is_active'] == 1) {
        this.ngForm.controls['status_toggle'].patchValue(true);
        this.isShowDiv = true;
        this.isActive = 1;
      }
      if (this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['is_active'] == 0) {
        this.isShowDiv = false;
        this.ngForm.controls['status_toggle'].patchValue(false);
        this.isActive = 0;
      }
      // console.log(this.apiResponseData,'this.apiResponseData')
      this.crop_groups = this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_crop && this.apiResponseData[0].m_crop.m_crop_group && this.apiResponseData[0].m_crop.m_crop_group.group_name ? this.apiResponseData[0].m_crop.m_crop_group.group_name : '';
      this.crop_names = this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_crop && this.apiResponseData[0].m_crop.crop_name ? this.apiResponseData[0].m_crop.crop_name : '';
      this.variety_names = this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].variety_name ? this.apiResponseData[0].variety_name : '';
      this.variety_Code = this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].id ? this.apiResponseData[0].id : this.apiResponseData && this.apiResponseData[0].variety_id ? this.apiResponseData[0].variety_id : ''
      this.ngForm.controls["crop_group"].patchValue(this.apiResponseData && this.apiResponseData[0].m_crop && this.apiResponseData[0].m_crop.m_crop_group.group_code
        ? this.apiResponseData[0].m_crop.m_crop_group.group_code : this.apiResponseData && this.apiResponseData.crop_group ? this.apiResponseData.crop_group : '');
      this.ngForm.controls["crop_name"].patchValue(this.apiResponseData && this.apiResponseData[0].m_crop && this.apiResponseData[0].m_crop && this.apiResponseData[0].m_crop.crop_code ? this.apiResponseData[0].m_crop.crop_code : this.apiResponseData && this.apiResponseData.crop_code ? this.apiResponseData.crop_code : '');
      this.ngForm.controls["variety_name"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].id ? this.apiResponseData[0].id : this.apiResponseData && this.apiResponseData[0].variety_id ? this.apiResponseData[0].variety_id : '');
      this.getDynamicVarietyCode(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].id ? this.apiResponseData[0].id : this.apiResponseData && this.apiResponseData[0].variety_id ? this.apiResponseData[0].variety_id : '')
      //  this.filterCropData(this.apiResponseData.variety_id)
      this.getStateList()


      // console.log(this.stateList, 'this.apiResponseData[0].m_crop_variety.variety_code')
      console.log('this.apiResponseData[0].m_crop_variety.variety_code', this.apiResponseData[0].variety_code)
      this.ngForm.controls["variety_code"].setValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].variety_code ? this.apiResponseData[0].variety_code : this.apiResponseData && this.apiResponseData[0].variety_code ? this.apiResponseData[0].variety_code : '');
      this.ngForm.controls["crop_code"].setValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].crop_code ? this.apiResponseData[0].crop_code : '');
      this.ngForm.controls["notification_date"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].notification_date ? this.apiResponseData[0].notification_date : '');
      this.ngForm.controls["year_of_introduction"].patchValue(this.apiResponseData[0] && this.apiResponseData[0].introduce_year ? convertDates(this.apiResponseData[0].introduce_year) : '');
      this.ngForm.controls["notification_number"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].notification_number ? this.apiResponseData[0].notification_number : '');
      this.ngForm.controls["meeting_number"].patchValue(this.apiResponseData[0] && this.apiResponseData[0].meeting_number ? this.apiResponseData[0].meeting_number : '');
      this.ngForm.controls["year_release"].patchValue(this.apiResponseData && this.apiResponseData[0].year_of_release ? this.apiResponseData[0].year_of_release : '');
      this.ngForm.controls["state_of_release"].patchValue(this.apiResponseData && this.apiResponseData[0].select_state_release ? this.apiResponseData[0].select_state_release : '');

      if (this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic.gi_tagged_reg_no) {
        // console.log(this.apiResponseData,'this.apiResponseData')    
        this.giCheckValue = 1
        this.ngForm.controls["gi_tagged_reg_no"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['gi_tagged_reg_no'] ? this.apiResponseData[0].m_variety_characteristic['gi_tagged_reg_no'] : '');
      } else {
        this.giCheckValue = 0
      }

      if (this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic.ip_protected_reg_no) {        
        this.ipCheckValue = 1
        this.ngForm.controls["ip_protected_reg_no"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['ip_protected_reg_no'] ? this.apiResponseData[0].m_variety_characteristic['ip_protected_reg_no'] : '');
      } else {
        this.ipCheckValue = 0
      }



      this.imgSrc = this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['image_url'] ? this.apiResponseData[0].m_variety_characteristic['image_url'] : '';
      if (this.apiResponseData[0].image_url) {
        // this.imageIconName = "https://seeds-documents.s3.ap-south-1.amazonaws.com/" + this.apiResponseData[0].image_url;

        this.imageIconName = environment.awsUrl + this.apiResponseData[0].image_url;
        this.file_name = this.apiResponseData[0].image_url;


      }
      this.url = this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['image_url'] ? this.apiResponseData[0].m_variety_characteristic['image_url'] : '';
      this.variety_name_value = this.apiResponseData && this.apiResponseData[0].variety_name && this.apiResponseData[0].variety_name ? this.apiResponseData[0].variety_name : '';
      // this.ngForm.controls["file"].patchValue(this.apiResponseData.image_url);
      if (this.apiResponseData[0].state_of_release) {

        this.ngForm.controls["state_for_cultivation"].setValue((this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['state_of_release']));
      }

      console.log(this.institutionData, 'institutionData')

      this.ngForm.controls["iet_number"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['iet_number'] ? this.apiResponseData[0].m_variety_characteristic['iet_number'] : '');

      this.ngForm.controls["parentage"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['percentage'] ? this.apiResponseData[0].m_variety_characteristic['percentage'] : '');

      this.ngForm.controls["maturity_from"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['matuarity_day_from'] ? parseInt(this.apiResponseData[0].m_variety_characteristic['matuarity_day_from']) : '');
      if (parseInt(this.apiResponseData[0].m_variety_characteristic.matuarity_day_from)) {
        this.muturityStatus = parseInt(this.apiResponseData[0].m_variety_characteristic.matuarity_day_from)
      }
      console.log('this.muturityStatus===', this.muturityStatus)
      this.ngForm.controls["maturity_to"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['matuarity_day_to'] ? this.apiResponseData[0].m_variety_characteristic['matuarity_day_to'] : '');

      this.ngForm.controls["maturity_date"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['maturity_date'] ? this.apiResponseData[0].m_variety_characteristic['maturity_date'] : '');
      this.ngForm.controls["resemblance_to_variety"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['resemblance_to_variety'] ? this.apiResponseData[0].m_variety_characteristic['resemblance_to_variety'] : '');

      this.ngForm.controls["maturity_type"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['matuarity_type_id'] ? this.apiResponseData[0].m_variety_characteristic['matuarity_type_id'] : "");

      this.ngForm.controls["maturity_date"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic['maturity_date'] ? this.apiResponseData[0].m_variety_characteristic['maturity_date'] : '');

      this.ngForm.controls["spacing_from"].patchValue(this.apiResponseData && this.apiResponseData[0].spacing_from && this.apiResponseData[0].m_variety_characteristic['spacing_from'] ? this.apiResponseData[0].m_variety_characteristic['spacing_from'] : '');

      this.ngForm.controls["spacing_to"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic['spacing_to'] ? this.apiResponseData[0].m_variety_characteristic['spacing_to'] : '');

      this.ngForm.controls["spacing_date"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['spacing_date'] ? this.apiResponseData[0].m_variety_characteristic['spacing_date'] : '');

      this.ngForm.controls["generic_morphological_characteristics"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['generic_morphological'] ? this.apiResponseData[0].m_variety_characteristic['generic_morphological'] : '');

      this.ngForm.controls["specific_morphological_characteristics"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['specific_morphological'] ? this.apiResponseData[0].m_variety_characteristic['specific_morphological'] : '');

      this.ngForm.controls["seed_rate"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['seed_rate'] ? this.apiResponseData[0].m_variety_characteristic['seed_rate'] : '')


      this.ngForm.controls["average_from"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['average_yeild_from'] ? this.apiResponseData[0].m_variety_characteristic['average_yeild_from'] : '');

      this.ngForm.controls["average_to"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['average_yeild_to'] ? this.apiResponseData[0].m_variety_characteristic['average_yeild_to'] : '');

      this.ngForm.controls["average_total"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic &&  this.apiResponseData[0].m_variety_characteristic['average_total'] ? this.apiResponseData[0].m_variety_characteristic['average_total'] : "");
      this.ngForm.controls["agronomic_features"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic &&  this.apiResponseData[0].m_variety_characteristic['agronomic_features'] ? this.apiResponseData[0].m_variety_characteristic['agronomic_features'] : '');
      // this.ngForm.controls["recommended_ecology"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].adoptation ? this.apiResponseData[0].adoptation : '');
      this.ngForm.controls["abiotic_stress"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['reaction_abiotic_stress'] ? this.apiResponseData[0].m_variety_characteristic['reaction_abiotic_stress'] : '');
      this.ngForm.controls["major_diseases"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['reaction_major_diseases_json'] ? this.apiResponseData[0].m_variety_characteristic['reaction_major_diseases_json'] : '');
      this.ngForm.controls["major_pest"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['reaction_to_pets_json'] ? this.apiResponseData[0].m_variety_characteristic['reaction_to_pets_json'] : '');
      // fertilizer_dosage
      this.ngForm.controls["fertilizer_dosage"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['fertilizer_dosage'] ? this.apiResponseData[0].m_variety_characteristic['fertilizer_dosage'] : '');

      this.ngForm.controls['insitution'].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic['responsible_insitution_for_breeder_see'] ? this.apiResponseData[0].m_variety_characteristic['responsible_insitution_for_breeder_see'] : '');
      if (this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['responsible_insitution_for_breeder_seed']) {
        this.getStateByBspc(this.apiResponseData[0].m_variety_characteristic['responsible_insitution_for_breeder_seed']);

      }
      if (this.apiResponseData[0].fertilizer_dosage) {

        this.fertilizer_check_box = this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic &&  this.apiResponseData[0].m_variety_characteristic['fertilizer_dosage'] ? this.apiResponseData[0].m_variety_characteristic['fertilizer_dosage'] : '';
      }
      if (parseInt(this.fertilizer_check_box) === 1) {
        this.fertilizer_value = 1;
      }
      if (parseInt(this.fertilizer_check_box) == 0) {
        this.fertilizer_value = 0;
      }
      console.log(this.fertilizer_value, 'fertilizer_value')
      // else {
      //   this.fertilizer_value = null
      // }
    
      
      this.ngForm.controls["nitrogen"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['nitrogen'] ? this.apiResponseData[0].m_variety_characteristic['nitrogen'] : '');
      this.ngForm.controls["phosphorus"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['phosphorus'] ? this.apiResponseData[0].m_variety_characteristic['phosphorus'] : '');
      this.ngForm.controls["potash"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['potash'] ? this.apiResponseData[0].m_variety_characteristic['potash'] : '');
      this.ngForm.controls["others"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['responsible_insitution_for_breeder_seed'] ? this.apiResponseData[0].m_variety_characteristic['responsible_insitution_for_breeder_seed'] : '');
      this.ngForm.controls["region_data"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['region_data'] ? this.apiResponseData[0].m_variety_characteristic['region_data'] : '');
      this.ngForm.controls['climate_resilience'].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic &&  this.apiResponseData[0].m_variety_characteristic['climate_resilience_json'] ? this.apiResponseData[0].m_variety_characteristic['climate_resilience_json'] : '');
      this.ngForm.controls['product_quality_attributes'].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['product_quality_attributes'] ? this.apiResponseData[0].m_variety_characteristic['product_quality_attributes'] : '');
      // this.ngForm.controls["fertilizer_other_name"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].fertilizer_other_name ? this.apiResponseData[0].fertilizer_other_name : '');

      // this.ngForm.controls["fertilizer_other_value"].patchValue(this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].fertilizer_other_value ? this.apiResponseData[0].fertilizer_other_value : '');
      this.downloadUrl = this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['image_url'] ? this.apiResponseData[0].m_variety_characteristic['image_url'] : '';
      this.state_cultivation = this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].m_variety_characteristic && this.apiResponseData[0].m_variety_characteristic['state_data'] ? this.apiResponseData[0].m_variety_characteristic['state_data'] : "";
      this.ngForm.controls['state_for_cultivation_central'].setValue(this.state_cultivation)
      if(this.ngForm.controls['state_for_cultivation_central'].value && this.ngForm.controls['state_for_cultivation_central'].value.length){
        this.onSelectTemp(this.ngForm.controls['state_for_cultivation_central'].value);
      }
      console.log('his.state_cultivation===', this.state_cultivation);
      if (this.state_cultivation && this.state_cultivation.length) {
        for (let key of this.state_cultivation) {
          this.onSelectTemp({ "state_code": key.state_code });
        }
      }
      console.log(this.state_cultivation, 'this.apiResponseData[0].state_data ')
    });

    this.ngForm.controls["crop_group"].disable();
    this.ngForm.controls["crop_name"].disable();
    this.ngForm.controls["variety_name"].disable();
  }
  editData() {
    this.submitted = true;
    if (this.isIpProtect) {
      this.ip_protect_msg = "Registration No is required";
      if (this.ngForm.controls['ip_protected_reg_no'].invalid) {
        return;
      }
    }

    if (this.isGiTarget) {
      this.gi_target_msg = "Registration No is required";
      if (this.ngForm.controls['gi_tagged_reg_no'].invalid) {
        return;
      }
    }
    const res = this.croupGroupList.filter(x => x.group_code === this.ngForm.controls['crop_group'].value);

    const name = this.crop_name_list.filter(x => x.crop_name == this.ngForm.controls['crop_name'].value);
    const varietyName = this.cropVarietyCodeData && this.cropVarietyCodeData.filter(item => item.id == this.ngForm.controls['variety_name'].value);
    if (this.ngForm.controls['status_toggle'].value == true) {
      this.isActive = 1;
    } else {
      this.isActive = 0;
    }
    const date = new Date(this.ngForm.controls['notification_date'].value);
    let notificationYear = date.getFullYear();
    let param;
    if (this.fertilizer_value == 0) {
      param = {
        id: parseInt(this.route.snapshot.paramMap['params'].submissionId),
        crop_group_id: parseInt(res[0].id),
        meeting_number: (this.ngForm.controls['meeting_number'].value ? this.ngForm.controls['meeting_number'].value : null),
        image_url: this.downloadUrl ? this.downloadUrl : '',
        responsible_insitution_for_breeder_seed: this.ngForm.controls['insitution'].value ? this.ngForm.controls['insitution'].value : null,
        year_release: this.ngForm.controls['year_release'].value,
        varierty_id: this.ngForm.controls['variety_name'].value,
        regions: this.ngForm.controls['regions'].value,
        select_state_release: (this.ngForm.controls['state_of_release'].value),
        resemblance_to_variety: this.ngForm.controls['resemblance_to_variety'].value,
        notification_date: this.ngForm.controls['notification_date'].value,
        notification_year: notificationYear ? notificationYear : null,
        percentage: parseInt(this.ngForm.controls['parentage'].value),
        maturity_from: parseInt(this.ngForm.controls['maturity_from'].value),
        iet_number: this.ngForm.controls['iet_number'].value,
        maturity_to: parseInt(this.ngForm.controls['maturity_to'].value),
        matuarity_type_id: parseInt(this.ngForm.controls['maturity_type'].value),
        maturity_date: (this.ngForm.controls['maturity_date'].value),
        spacing_from: parseInt(this.ngForm.controls['spacing_from'].value),
        spacing_to: parseInt(this.ngForm.controls['spacing_to'].value),
        spacing_date: (this.ngForm.controls['spacing_date'].value),
        generic_morphological: (this.ngForm.controls['generic_morphological_characteristics'].value),
        specific_morphological_characteristics: this.ngForm.controls['specific_morphological_characteristics'].value,
        seed_rate: this.ngForm.controls['seed_rate'].value,
        // if(this.checkValue)
        variety_code: this.ngForm.controls['variety_code'].value,
        recommended_state: this.checkValue == 0 ? this.ngForm.controls['state_for_cultivation'].value : '',
        // average_yeild_from: parseFloat(this.ngForm.controls['average_from'].value),
        // average_yeild_to: parseFloat(this.ngForm.controls['average_to'].value),

        average_yeild_from: this.ngForm.controls['average_from'].value,
        average_yeild_to: this.ngForm.controls['average_to'].value,

        average_total: parseFloat(this.ngForm.controls['average_total'].value),
        agronomic_features: this.ngForm.controls['agronomic_features'].value,
        recommended_ecology: this.ngForm.controls['recommended_ecology'].value,
        abiotic_stress: (this.ngForm.controls['abiotic_stress'].value),
        major_diseases: this.ngForm.controls['major_diseases'].value,
        major_pest: this.ngForm.controls['major_pest'].value,
        nitrogen: this.ngForm.controls['nitrogen'].value,
        phosphorus: this.ngForm.controls['phosphorus'].value,
        potash: this.ngForm.controls['potash'].value,
        fertilizer_dosage: this.fertilizer_value && (this.fertilizer_value == 1) ? '1' : this.fertilizer_value == 0 ? '0' : '',
        fertilizerother: this.ngForm.controls['fertilizerother'].value,
        //  fertilizer_dosage: this.fertilizer_value ? this.fertilizer_value.toString(): "",

        // fertilizer_other_name: this.ngForm.controls['fertilizer_other_name'].value,
        // fertilizer_other_value: this.ngForm.controls['fertilizer_other_value'].value,
        state: this.checkValue == 1 ? this.ngForm.controls['state_for_cultivation_central'].value : '',
        variety_name: varietyName && varietyName[0] && varietyName[0].variety_name,
        region_data: this.ngForm.controls['region_data'].value,
        active: this.isActive

      }
    } else {

      param = {
        id: parseInt(this.route.snapshot.paramMap['params'].submissionId),
        crop_group_id: parseInt(res[0].id),
        meeting_number: (this.ngForm.controls['meeting_number'].value ? this.ngForm.controls['meeting_number'].value : null),
        image_url: this.downloadUrl ? this.downloadUrl : '',
        responsible_insitution_for_breeder_seed: this.ngForm.controls['insitution'].value ? this.ngForm.controls['insitution'].value : null,
        year_release: this.ngForm.controls['year_release'].value,
        varierty_id: this.ngForm.controls['variety_name'].value,
        notification_date: this.ngForm.controls['notification_date'].value,
        notification_year: notificationYear ? notificationYear : null,
        select_state_release: (this.ngForm.controls['state_of_release'].value),
        resemblance_to_variety: this.ngForm.controls['resemblance_to_variety'].value,
        percentage: parseInt(this.ngForm.controls['parentage'].value),
        maturity_from: parseInt(this.ngForm.controls['maturity_from'].value),
        iet_number: this.ngForm.controls['iet_number'].value,
        maturity_to: parseInt(this.ngForm.controls['maturity_to'].value),
        matuarity_type_id: parseInt(this.ngForm.controls['maturity_type'].value),
        maturity_date: (this.ngForm.controls['maturity_date'].value),
        regions: this.ngForm.controls['regions'].value,
        spacing_from: parseInt(this.ngForm.controls['spacing_from'].value),
        spacing_to: parseInt(this.ngForm.controls['spacing_to'].value),
        spacing_date: (this.ngForm.controls['spacing_date'].value),
        generic_morphological: (this.ngForm.controls['generic_morphological_characteristics'].value),
        specific_morphological_characteristics: this.ngForm.controls['specific_morphological_characteristics'].value,
        seed_rate: this.ngForm.controls['seed_rate'].value,
        // if(this.checkValue)
        variety_code: this.ngForm.controls['variety_code'].value,
        recommended_state: this.checkValue == 0 ? this.ngForm.controls['state_for_cultivation'].value : '',
        // average_yeild_from: parseFloat(this.ngForm.controls['average_from'].value),
        // average_yeild_to: parseFloat(this.ngForm.controls['average_to'].value),
        average_yeild_from: this.ngForm.controls['average_from'].value,
        average_yeild_to: this.ngForm.controls['average_to'].value,

        average_total: parseFloat(this.ngForm.controls['average_total'].value),
        agronomic_features: this.ngForm.controls['agronomic_features'].value,
        recommended_ecology: this.ngForm.controls['recommended_ecology'].value,
        abiotic_stress: (this.ngForm.controls['abiotic_stress'].value),
        major_diseases: this.ngForm.controls['major_diseases'].value,
        major_pest: this.ngForm.controls['major_pest'].value,
        nitrogen: this.ngForm.controls['nitrogen'].value,
        phosphorus: this.ngForm.controls['phosphorus'].value,
        potash: this.ngForm.controls['potash'].value,
        fertilizer_dosage: this.fertilizer_value && (this.fertilizer_value == 1) ? '1' : this.fertilizer_value == 0 ? '0' : '',
        // fertilizerother:this.ngForm.controls['fertilizerother'].value,
        //  fertilizer_dosage: this.fertilizer_value ? this.fertilizer_value.toString(): "",

        // fertilizer_other_name: this.ngForm.controls['fertilizer_other_name'].value,
        // fertilizer_other_value: this.ngForm.controls['fertilizer_other_value'].value,
        state: this.ngForm.controls['state_for_cultivation_central'].value,
        variety_name: varietyName && varietyName[0] && varietyName[0].variety_name,
        active: this.isActive,
        region_data: this.ngForm.controls['region_data'].value,
        climate_resilience: this.ngForm.controls['climate_resilience'].value,
        product_quality_attributes: this.ngForm.controls['product_quality_attributes'].value,
        gi_tagged_reg_no: this.ngForm.controls['gi_tagged_reg_no'].value,
        ip_protected_reg_no: this.ngForm.controls['ip_protected_reg_no'].value
      }
    }
    console.log('this.ngForm=====', this.ngForm);
    if (this.ngForm.invalid) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please fill all required fields.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        showCancelButton: false,
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    this.submitted = true;
    // if (this.ngForm.invalid || this.nitrogenValidation ||
    //   // this.ImgError || 
    //   this.phosphorusvalidation || this.potashValidation || this.percentageValidation || this.seedRateError || this.averageError || this.spacingError || this.maturity_from_error) {
    //   return;
    // }

    this.service.postRequestCreator("update-add-crop-characterstics", null, param).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.historyData.action = "update";
        this.historyData.comment = "update Form Successfully";
        this.historyData.formType = " Crop Variety Characteristics";

        this.audtiTrailsHistory(this.historyData);
        Swal.fire({
          title: '<p style="font-size:25px;">Data updated successfully.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15',
        }).then(x => {

          this.router.navigate(['/add-crop-character-list']);
        })
      } else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 401) {
        Swal.fire({
          toast: true,
          icon: "error",
          title: apiResponse.EncryptedResponse.data.error,
          position: "center",
          showConfirmButton: false,
          showCancelButton: false,
          timer: 2000
        })
      } else {

        Swal.fire({
          title: '<p style="font-size:25px;">An Error Occured.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
      }

    });


  }
  async getStateList() {
    this.masterService
      .getRequestCreatorNew("get-state-list")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.stateList = apiResponse.EncryptedResponse.data;
          console.log(this.stateList, 'stateListSecondstateListSecond')
          this.stateListSecond = this.stateList
          if (this.isEdit || this.isView) {
            if (this.stateList && this.stateList.length) {
              let state_ids = this.apiResponseData && this.apiResponseData[0] && this.apiResponseData[0].state_of_release ? this.apiResponseData[0].state_of_release : ''
              let filterstate = this.stateList.filter(item => item.state_code == state_ids)
              this.state_names = filterstate && filterstate[0] ? filterstate[0].state_name : '';

            }
          }
        }
      });

  }
  async getVarietyData(newValue) {
    const param = {
      search: {
        variety_name: parseInt(newValue)

      }
    }
    this.service
      .postRequestCreator("get-variety-code-details", null, param)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          // this. = apiResponse.EncryptedResponse.data;


        }
      });
  }

  getAgroEcologicalRegions() {
    this.masterService.getRequestCreatorNew('get-agro-ecological-regions').subscribe(apiResponse => {
      this.regionsData = apiResponse && apiResponse['EncryptedResponse'] && apiResponse['EncryptedResponse'].data ? apiResponse['EncryptedResponse'].data : '';
      console.log('regionsData==', this.regionsData);
    })
  }
  cropScientificNameData() {
    this.masterService.postRequestCreator('get-crop-basic-data', null, {
      crop_group: this.ngForm.controls['crop_group'].value,
      crop_code: this.ngForm.controls['crop_name'].value
    }).subscribe(apiResponse => {
      this.cropBasicData = apiResponse && apiResponse['EncryptedResponse'] && apiResponse['EncryptedResponse'].data ? apiResponse['EncryptedResponse'].data : '';
      console.log('cropBasicData==', this.cropBasicData);
    })
  }
  loadCategory() {
    const route = 'getVarietyCategoryList';
    const category = 'YOUR_CROP_CODE';
    // const param = {
    // category: category,
    // };
    this.service.getRequestCreatorNew(route).subscribe((data: any) => {
      if (data.EncryptedResponse.status_code === 200) {
        this.varietyCategories = data.EncryptedResponse.data;
        console.log("categortData A;lllll====", this.varietyCategories);
      }
    })
  }

  async getDynamicVarietyCode(newValue: any) {
    const searchFilters = {
      "search": {
        "variety_id": parseInt(newValue)
      }
    };
    this.service
      .postRequestCreator("get-dynamic-variety-code-characterstics", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          if (apiResponse.EncryptedResponse.data.length > 0) {
            this.data = apiResponse.EncryptedResponse.data[0];
            console.log(' this.data', this.data.variety_code)



            this.ngForm.controls['notification_number'].patchValue(this.data && this.data.not_number ? this.data.not_number : null);
            this.ngForm.controls['meeting_number'].patchValue(this.data && this.data.meeting_number ? this.data.meeting_number : null);
            this.ngForm.controls['notification_date'].patchValue(this.data && this.data.not_date ? convertDatetoDDMMYYYYwithdash(this.data.not_date) : null);
            this.ngForm.controls['year_release'].patchValue(this.data && this.data.release_date ? this.data.release_date : null);
            let categoriesArray = [];
            if (this.data.category) {
              this.data.category.forEach(element => {
                categoriesArray.push(element.m_variety_category.category);
                // this.varietyCategories.filter(ele=>ele.id == )
              });
            }

            this.ngForm.controls['category'].patchValue(categoriesArray && categoriesArray.length ? categoriesArray.toString() : "NA");

            if (parseInt(this.data.is_notified) === 1) {
              this.check_notified = 'Notified'
            }
            if (parseInt(this.data.is_notified) === 0) {
              this.check_notified = 'Non-Notified'
            }
            this.ngForm.controls["notified_non_notified"].setValue(this.check_notified);
            // developed_by
            // if(this.data && this.data.developed_by ){
            //   this.data.developed_by= this.data.developed_by=='NULL' ?'':this.data.developed_by
            // }
            this.ngForm.controls["developed_by"].setValue(this.data && this.data.developed_by ? this.data.developed_by : '');
            this.ngForm.controls["year_of_introduction"].setValue(this.data && this.data.introduce_year ? convertDatetoDDMMYYYYwithdash(this.data.introduce_year) : '');

            let type = this.data.type
            if (type == 'Hybrid') {
              type = 'Hybrid'
            }
            else {
              type = 'Variety'
            }

            this.ngForm.controls["type"].setValue(type)
          }
          // else {
          //   this.varietyCode = ((newValue) + '001');
          //   this.ngForm.controls['variety_code'].patchValue(this.varietyCode);
          // }


        }
      });

  }
  onSelect(event) {
    this.file = this.FileData;
    let pdf = this.fileImage;
    this.pathmulti = event.target.files[0];

    this.Imagename = pdf.slice(12);

    console.log("------------00000000000---------")

    this.selectedFiles = event.target.files[0];
    const file = this.selectedFiles;
    this.file_name = null
    // console.log("file----------------", file)
    // console.log("file name----------------", file.name)
    // console.log("file size----------------", file.size)
    // if (file.size > 2000000) {
    //   this.ImgError = 'Image size too big'
    //   return;
    // }
    // this.imageIconName =  '';
    // this.downloadUrl = '';
    // this.imageIconName = '';
    // this.selectedFiles = event.target.files[0];
    // this.fileName = file.name
    // var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

    // if (!allowedExtensions.exec(file.name)) {
    //   this.ImgError = 'Please select valid File'
    //   // fileInput.value = '';
    //   return;
    // }




    // this.Imagename=t
    if (this.Imagename) {
      if (this.Imagename.length > 40) {
        this.Imagename = this.Imagename.split('.');
        let part_one = this.Imagename[0];
        let part_two = this.Imagename[1];

        part_one = part_one.substring(0, 39);
        this.Imagename = part_one + '.' + part_two;


        // this.Imagename=this.Imagename.slice(0,30)
      }
      else {
        this.Imagename = pdf.slice(12);
      }
    }

    let fileType = event.target.files[0].type;
    if (fileType.match(/image\/*/)) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      const ImageBlob = this.fileInput.nativeElement.files[0];


      const formData = new FormData();
      let fileData = (document.getElementById('fileInput') as HTMLInputElement).value;
      formData.append('name', ImageBlob, ImageBlob.name);


      // const route = 'upload-image';
      const route = 'utils/upload';
      const data = this.ngForm.controls['']


      this.service.postRequestCreator(route, null, this.pathmulti).subscribe(data => {
        this.image_name = data && data.results && data.results.name ? data.results.name : '';


      })
      reader.onload = (event: any) => {
        this.ImgError = '';
        this.url = event.target.result;
      };
    } else {
      this.ImgError = 'Please Select Image File';
      this.url = '';
      this.Imagename = '';
      // window.alert('Please select correct image format');
    }
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file_name = null

      this.imageIconName = ''
      this.downloadUrl = '';
      this.selectedFiles = event.target.files[0];
      const file = this.selectedFiles;
      this.file = (document.getElementById('fileInput') as HTMLInputElement).value;

      this.fileName = file.name
      this.fileData["name"] = file.name;
      this.fileData["extension"] = file.type.split("/")[1];
      this.fileData['file'] = file;
      let filenameext = event.target.files[0]
      // png,jpeg,jpg,gif,doc,
      // pdf,ppt,xlsx,



      console.log("file----------------", file)
      console.log("file name----------------", file.name)
      console.log("file size----------------", file.size)

      this.imageIconName = '';
      this.downloadUrl = '';
      this.imageIconName = '';
      this.selectedFiles = event.target.files[0];
      this.fileName = file.name
      var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

      if (!allowedExtensions.exec(file.name)) {
        this.ImgError = 'Please select Valid File.'
        // fileInput.value = '';
        return;
      }

      if (file.size > 2000000) {
        this.ImgError = 'Image Size too Big.'
        return;
      }

      this.file_name = this.fileName;


      var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

      if (!allowedExtensions.exec(this.file)) {
        this.ImgError = 'Please select Valid File'
        // fileInput.value = '';
        return;
      }
      else {

        Swal.fire({
          title: 'Uploading File...',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null)
          }
        });
        this.service.upload(this.selectedFiles).subscribe(
          (res: any) => {
            if (typeof (res) === 'object' && res.status == 'success' && res.results) {
              console.log("resresres", res)
              const baseImage = res.results.name;
              this.imageIconName = environment.awsUrl + baseImage
              this.downloadUrl = res.results.name;
              this.ImgError = '';
              this.file_name = baseImage;

              // if(res.results.$metadata.httpStatusCode == 200 ){
              if (res.status == "success") {
                Swal.fire({
                  title: '<p style="font-size:25px;">Document Successfully Uploaded.</p>',
                  icon: 'success',
                  confirmButtonText:
                    'OK',
                  confirmButtonColor: '#E97E15'
                })
              } else if (res.status_code && parseInt(res.status_code) == 404) {
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'File Size Exceed.',
                  showConfirmButton: false,
                  timer: 1000
                })
              } else {
                Swal.fire({
                  title: 'Oops',
                  text: '<p style="font-size:25px;">Something Went Wrong.</p>',
                  icon: 'error',
                  confirmButtonText:
                    'OK',
                  confirmButtonColor: '#E97E15'
                })
              }

            } else if (res.status == "success") {

              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'File Size Exceed.',
                showConfirmButton: false,
                timer: 1000
              })
            } else if (res && parseInt(res.status_code) == 404) {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'File Size Exceed.',
                showConfirmButton: false,
                timer: 1000
              })
            } else {
              Swal.fire({
                title: 'Oops',
                text: '<p style="font-size:25px;">Something Went Wrong.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#E97E15'
              })
            }

          }
        );
      }

    }
  }
  fetilizer(value) {
    this.fertilizer_value = parseInt(value);
    this.ngForm.controls["fertilizer_dosage"].setValue(this.fertilizer_value);
    console.log(this.fertilizer_value, 'this.ngForm.controls["fertilize')

  }
  addstateCentral() {
    const route = 'add-state-characterstics';

    let dataRows = [];
    let data = this.ngForm.controls["state_for_cultivation"].value;

    data.forEach(element => {

      dataRows.push({
        state_code: element.state_code,
        state_name: element.state_name
      });

    })
    this.service.postRequestCreator(route, null, { nucleusSeed: dataRows }).subscribe((data: any) => {

    })

  }

  validate(e) {


    var t = e.value;
    e.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
  }


  numbersonly(e, control) {
    //alert('numbersonly')
    var unicode = e.charCode ? e.charCode : e.keyCode
    if (unicode != 8 && unicode != 46) //if the key isn't the backspace key (which we should allow)
    {
      if (unicode < 48 || unicode > 57) //if not a number
      {

        //  return false //disable key press
      }
      var character = String.fromCharCode(unicode);
      var val = control.value + character

      if (parseInt(val) > 100) {
        //  return false ;
      }

      if (String(val).indexOf(".") != -1) {
        if (String(val).indexOf(".") < String(val).length - 3) {
          //  return false ;
        }
      }
    }
  }
  checkDec(el) {

    var ex = /^[0-9]+\.?[0-9]*$/;
    if (ex.test(el.value) == false) {
      el.value = el.value.substring(0, el.value.length - 1);
    }
  }


  isNumberKey(evt) {

    var charCode = (evt.which) ? evt.which : evt.keyCode
    var leng = (document.getElementById("txtChar") as HTMLInputElement).value;

    let res = leng.indexOf(".") == -1;
    let result = leng.toString();

    let num = result.split('.');
    if (!num[0].length) {
      if (parseInt(charCode) == 190) {
        evt.preventDefault();
        return false;
      }
    }

    let results = parseInt(result[0]);
    if (leng) {
      if (res) {
        if (result.length > 0 && result.length <= 0) {
          if (charCode == 190 || charCode == 8) {
            return true;
          }
        }
        if ((result).length > 2) {
          // checkLength(evt,3)
          if (parseInt(charCode) == 190) {
            evt.preventDefault();
            return false;
          }
          if (parseInt(charCode) == 8) {

            return true;
          }
          return false;
        }
      }
      var isDotPresent = (document.getElementById("txtChar") as HTMLInputElement).value.indexOf('.') > -1;
      var isDotInput = evt.key === '.';
      let firstdigit = evt.key === '.'
      // I have to avoid the dot:
      if (isDotPresent && isDotInput) {
        // avoid the effect of the event (so the injection of dot into the text)
        evt.preventDefault();

      }

    }



    if (leng) {


      if (parseInt(this.percentage[0]) % 1 != 0) {
        if (charCode == 190) {

          return false;
        }

      }

      else {
        if (charCode == 190 || charCode == 8) {

          return true;
        }
      }
    }
    var len = (document.getElementById("txtChar") as HTMLInputElement).value.length;


    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46 && charCode != 190) {
      var len = (document.getElementById("txtChar") as HTMLInputElement).value.length;



      return false;
    }
    else {
      var len = (document.getElementById("txtChar") as HTMLInputElement).value.length;
      var index = (document.getElementById("txtChar") as HTMLInputElement).value.indexOf('.');




      if (index > 0 && charCode == 46) {

        return false;
      }
      if (index > 0) {
        var CharAfterdot = (len + 1) - index;
        if (CharAfterdot > 3) {
          return false;
        }
      }

    }
    return true;
  }

  checkfertilizerDozae(evt) {


    var charCode = (evt.which) ? evt.which : evt.keyCode
    console.log('charCode', charCode)
    var leng = (document.getElementById("nitrogen") as HTMLInputElement).value;
    if (parseInt(charCode) == 17 || parseInt(charCode) == 86) {
      return true;
    }

    let res = leng.indexOf(".") == -1;
    let result = leng.toString();

    let num = result.split('.');
    if (!num[0].length) {
      if (parseInt(charCode) == 190) {
        evt.preventDefault();
        return false;
      }
    }

    let results = parseInt(result[0]);
    if (leng) {
      if (res) {
        if (result.length > 0 && result.length <= 0) {
          if (charCode == 190 || charCode == 8 || parseInt(charCode) == 17 || parseInt(charCode) == 86) {
            return true;
          }
        }
        let val = this.ngForm.controls['nitrogen'].value
        val = val.toString();

        if (val.length > 2) {

          if (parseInt(charCode) == 190 || parseInt(charCode) == 8 || parseInt(charCode) == 17 || parseInt(charCode) == 86) {
            // alert('190')
            if (this.nitrogenValidation == '') {

              return true;
            }
            else {
              if (parseInt(charCode) == 8 || parseInt(charCode) == 17 || parseInt(charCode) == 86) {
                return true;
              }
              else {
                return false;
              }


            }

          }
          else {

            return false;
          }
        }
      }
      var isDotPresent = (document.getElementById("nitrogen") as HTMLInputElement).value.indexOf('.') > -1;
      var isDotInput = evt.key === '.';
      let firstdigit = evt.key === '.'
      // I have to avoid the dot:
      if (isDotPresent && isDotInput) {
        // avoid the effect of the event (so the injection of dot into the text)
        evt.preventDefault();

      }

    }



    if (leng) {


      // if (parseInt(this.percentage[0]) % 1 != 0) {
      //   if (charCode == 190) {

      //     return false;
      //   }

      // }

      // else {
      if (charCode == 190 || charCode == 8) {

        return true;
      }
      // }
    }
    var len = (document.getElementById("nitrogen") as HTMLInputElement).value.length;


    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46 && charCode != 190) {
      var len = (document.getElementById("nitrogen") as HTMLInputElement).value.length;



      return false;
    }
    else {
      var len = (document.getElementById("nitrogen") as HTMLInputElement).value.length;
      var index = (document.getElementById("nitrogen") as HTMLInputElement).value.indexOf('.');





      if (index > 0 && charCode == 46) {

        return false;
      }
      if (index > 0) {
        var CharAfterdot = (len + 1) - index;
        if (CharAfterdot > 3) {
          return false;
        }
      }

    }
    return true;
  }


  checkfertilizerphosphorus(evt) {


    var charCode = (evt.which) ? evt.which : evt.keyCode
    var leng = (document.getElementById("phosphorus") as HTMLInputElement).value;

    let res = leng.indexOf(".") == -1;
    let result = leng.toString();
    if (parseInt(charCode) == 17 || parseInt(charCode) == 86) {
      return true;
    }

    let num = result.split('.');
    if (!num[0].length) {
      if (parseInt(charCode) == 190) {
        evt.preventDefault();
        return false;
      }
    }

    let results = parseInt(result[0]);
    if (leng) {
      if (res) {
        if (result.length > 0 && result.length <= 0) {
          if (charCode == 190 || charCode == 8) {
            return true;
          }
        }
        let val = this.ngForm.controls['phosphorus'].value
        val = val.toString();

        if (val.length > 2) {

          if (parseInt(charCode) == 190 || parseInt(charCode) == 8) {
            // alert('190')
            if (this.phosphorusvalidation == '') {

              return true;
            }
            else {
              if (parseInt(charCode) == 8) {
                return true;
              }
              else {
                return false;
              }


            }

          }
          else {

            return false;
          }
        }
      }
      var isDotPresent = (document.getElementById("phosphorus") as HTMLInputElement).value.indexOf('.') > -1;
      var isDotInput = evt.key === '.';
      let firstdigit = evt.key === '.'
      // I have to avoid the dot:
      if (isDotPresent && isDotInput) {
        // avoid the effect of the event (so the injection of dot into the text)
        evt.preventDefault();

      }

    }



    if (leng) {

      if (charCode == 190 || charCode == 8) {

        return true;
      }
      // }
    }
    var len = (document.getElementById("phosphorus") as HTMLInputElement).value.length;


    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46 && charCode != 190) {
      var len = (document.getElementById("phosphorus") as HTMLInputElement).value.length;



      return false;
    }
    else {
      var len = (document.getElementById("phosphorus") as HTMLInputElement).value.length;
      var index = (document.getElementById("phosphorus") as HTMLInputElement).value.indexOf('.');
      if (index > 0 && charCode == 46) {

        return false;
      }

      if (index > 0) {
        var CharAfterdot = (len + 1) - index;
        if (CharAfterdot > 3) {
          return false;
        }
      }

    }
    return true;
  }

  checkfertilizerpotash(evt) {


    var charCode = (evt.which) ? evt.which : evt.keyCode
    var leng = (document.getElementById("potash") as HTMLInputElement).value;
    let res = leng.indexOf(".") == -1;
    let result = leng.toString();
    let num = result.split('.');
    if (!num[0].length) {
      if (parseInt(charCode) == 190) {
        evt.preventDefault();
        return false;
      }
    }
    if (parseInt(charCode) == 17 || parseInt(charCode) == 86) {
      return true;
    }
    let results = parseInt(result[0]);
    if (leng) {
      if (res) {
        if (result.length > 0 && result.length <= 0) {
          if (charCode == 190 || charCode == 8) {
            return true;
          }
        }
        let val = this.ngForm.controls['potash'].value
        val = val.toString();

        if (val.length > 2) {

          if (parseInt(charCode) == 190 || parseInt(charCode) == 8) {
            // alert('190')
            if (this.potashValidation == '') {

              return true;
            }
            else {
              if (parseInt(charCode) == 8) {
                return true;
              }
              else {
                return false;
              }


            }

          }
          else {

            return false;
          }
        }
      }
      var isDotPresent = (document.getElementById("potash") as HTMLInputElement).value.indexOf('.') > -1;
      var isDotInput = evt.key === '.';
      let firstdigit = evt.key === '.'
      // I have to avoid the dot:
      if (isDotPresent && isDotInput) {
        // avoid the effect of the event (so the injection of dot into the text)
        evt.preventDefault();

      }

    }



    if (leng) {

      if (charCode == 190 || charCode == 8) {

        return true;
      }
      // }
    }
    var len = (document.getElementById("potash") as HTMLInputElement).value.length;


    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46 && charCode != 190) {
      var len = (document.getElementById("potash") as HTMLInputElement).value.length;
      return false;
    }
    else {
      var len = (document.getElementById("potash") as HTMLInputElement).value.length;
      var index = (document.getElementById("potash") as HTMLInputElement).value.indexOf('.');
      if (index > 0 && charCode == 46) {
        return false;
      }
      if (index > 0) {
        var CharAfterdot = (len + 1) - index;
        if (CharAfterdot > 3) {
          return false;
        }
      }

    }
    return true;
  }



  checkfertilizerotherName(evt) {


    var charCode = (evt.which) ? evt.which : evt.keyCode
    var leng = (document.getElementById("fertilizer_other_value") as HTMLInputElement).value;

    let res = leng.indexOf(".") == -1;
    let result = leng.toString();

    let num = result.split('.');
    if (!num[0].length) {
      if (parseInt(charCode) == 190) {
        evt.preventDefault();
        return false;
      }
    }
    if (parseInt(charCode) == 17 || parseInt(charCode) == 86) {
      return true;
    }

    let results = parseInt(result[0]);
    if (leng) {
      if (res) {
        if (result.length > 0 && result.length <= 0) {
          if (charCode == 190 || charCode == 8) {
            return true;
          }
        }
        let val = this.ngForm.controls['fertilizer_other_value'].value
        val = val.toString();

        if (val.length > 2) {

          if (parseInt(charCode) == 190 || parseInt(charCode) == 8) {
            // alert('190')
            if (this.potashValidation == '') {

              return true;
            }
            else {
              if (parseInt(charCode) == 8) {
                return true;
              }
              else {
                return false;
              }


            }

          }
          else {

            return false;
          }
        }
      }
      var isDotPresent = (document.getElementById("fertilizer_other_value") as HTMLInputElement).value.indexOf('.') > -1;
      var isDotInput = evt.key === '.';
      let firstdigit = evt.key === '.'
      // I have to avoid the dot:
      if (isDotPresent && isDotInput) {
        // avoid the effect of the event (so the injection of dot into the text)
        evt.preventDefault();

      }

    }



    if (leng) {

      if (charCode == 190 || charCode == 8) {

        return true;
      }
      // }
    }
    var len = (document.getElementById("fertilizer_other_value") as HTMLInputElement).value.length;


    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46 && charCode != 190) {
      var len = (document.getElementById("fertilizer_other_value") as HTMLInputElement).value.length;
      return false;
    }
    else {
      var len = (document.getElementById("fertilizer_other_value") as HTMLInputElement).value.length;
      var index = (document.getElementById("fertilizer_other_value") as HTMLInputElement).value.indexOf('.');
      if (index > 0 && charCode == 46) {
        return false;
      }
      if (index > 0) {
        var CharAfterdot = (len + 1) - index;
        if (CharAfterdot > 3) {
          return false;
        }
      }

    }
    return true;
  }

  getShortName(cropCode) {
    return cropCode.split(' ').map(n => n[0]).join('');
  }
  downloadFile(e, text) {
    // this.imgSrc =  environment.awsUrl + text;

    // if(text != undefined || text != ''){
    //   this.service.download(text).subscribe(
    //     (data: any) => {
    //         if (typeof (data) === 'object' && data.EncryptedResponse && data.EncryptedResponse.data) {
    //           let dowbloadLink = data.EncryptedResponse.data
    //           window.open(dowbloadLink, "_blank");
    //         }
    //     }
    //   );
    // }
  }
  showImage(template: TemplateRef<any>, imgUrl) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-lg'
    });
    // this.imgSrc= imgUrl;
    // this.imgSrc =  environment.awsUrl + imgUrl;
    this.file_name = imgUrl

  }

  pasteAlpha(field, $event) {
    if (this.ngForm.controls['generic_morphological_characteristics'].value.length > 50) {
      const result = this.ngForm.controls['generic_morphological_characteristics'].value;
      this.ngForm.controls['generic_morphological_characteristics'].setValue(result.substring(0, 50).replace(/\s+/g, ' ').trim())
    }
  }
  async getCropVarietyCodeData(newValue) {
    console.log('varieyt=======>', this.cropVariety)
    let varietyArr = []
    let currentvarietyArr = []
    if (this.cropVariety) {
      for (let i = 0; i < this.cropVariety.length; i++) {
        varietyArr.push(this.cropVariety[i].variety_id)
      }
    }
    //     currentvarietyArr.push(this.variety_Code)

    //     var res = currentvarietyArr.filter( function(n) { return !this.has(n) }, new Set(varietyArr) );

    // console.log(res,'rre');
    if (this.isEdit) {
      varietyArr = varietyArr.filter(item => item != this.variety_Code)
    }


    const searchFilters = {
      "search": {
        "crop_code": newValue,
        'view': this.isView ? this.isView : '',
        'variety': varietyArr

      }
    };
    this.service
      .postRequestCreator("getdistinctVariettyNameIncharacterstics", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.cropVarietyCodeData = apiResponse.EncryptedResponse.data.rows;
          console.log(' this.cropVarietyCodeData', this.cropVarietyCodeData.length)
          if (parseInt(this.cropVarietyCodeData.length) < 1 && !this.isView) {
            Swal.fire({
              title: '<p style="font-size:25px;">The characteristics for all existing varieties of this crop have already been saved.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            })
          }
          else {

            this.cropVarietyCodeData = this.cropVarietyCodeData.sort((a, b) => a.variety_name.localeCompare(b.variety_name))
            this.getCropVarietyCodeDatasecond = this.cropVarietyCodeData
          }
        }
      });
    // this.getCropDistinctVarietyCodeData(this.ngForm.controls['crop_name'].value)
  }
  async getCropDistinctVarietyCodeData(newValue) {
    const searchFilters = {
      "search": {
        "crop_code": newValue,
        'view': this.isView ? this.isView : ''
      }
    };
    this.service
      .postRequestCreator("getdistinctVariettyNameIncharactersticsfromCharacterstics", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.cropVariety = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : ''
          console.log(this.cropVariety, 'this.cropVariety')
          this.getCropVarietyCodeData(newValue)
          // 
          // this.cropVarietyCodeData = apiResponse.EncryptedResponse.data.rows;
          // this.cropVarietyCodeData = this.cropVarietyCodeData.sort((a, b) => a.variety_name.localeCompare(b.variety_name))
        }
      });
  }
  onPasteNumber(event: ClipboardEvent, field: string, length: string) {
    var alphaExp = '^[0-9]$';
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedNumber = clipboardData.getData('text');
    if (this.ngForm.get(field).value.match(alphaExp)) {

      if (this.ngForm.get(field).value.length > len) {
        const value = this.ngForm.get(field).value;
        this.ngForm.get(field).setValue(value.substring(0, len))
      }
      else {
        this.ngForm.get(field).setValue(this.ngForm.get(field).value)
      }
      // return true
    }
    else {
      event.preventDefault();
      if (field == 'nitrogen' || field == 'potash' || field == 'phosphorus') {
        let fieldName = this.pastedNumber.replace(/[^0-9\.]+/g, "").replace(/^\s+|\s+$/g, '');
        let value = parseInt(length)
        fieldName = this.ngForm.get(field).value + fieldName;
        this.ngForm.get(field).setValue(fieldName.substring(0, value))
      }
      else {

        let fieldName = this.pastedNumber.replace(/\D/g, "").replace(/^\s+|\s+$/g, '');
        let value = parseInt(length)
        fieldName = this.ngForm.get(field).value + fieldName;
        this.ngForm.get(field).setValue(fieldName.substring(0, value))
      }
      // return false
    }

  }
  onPaste(event: ClipboardEvent, field: string, length: string) {
    var alphaExp = /^[a-zA-Z]+$/;
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedText = clipboardData.getData('text');
    if (this.pastedText.match(alphaExp)) {

      if (this.pastedText.length > len) {
        const value = this.ngForm.get(field).value;
        this.ngForm.get(field).setValue(value.substring(0, len).replace(/\s+/g, ' ').trim())
      }
      else {
        this.ngForm.get(field).setValue(this.ngForm.get(field).value.replace(/\s+/g, ' ').trim())
      }
      // return true
    }
    else {
      event.preventDefault();
      let fieldName = this.pastedText.replace(/[^a-zA-Z ]/g, "").replace(/\s+/g, ' ').trim();
      let value = parseInt(length)
      fieldName = this.ngForm.get(field).value + fieldName;
      this.ngForm.get(field).setValue(fieldName.substring(0, value).replace(/\s+/g, ' ').trim())
      // return false
    }

  }



  checkfertilizerDozsae(evt) {


    var charCode = (evt.which) ? evt.which : evt.keyCode
    var leng = (document.getElementById("nitrogen") as HTMLInputElement).value;

    let res = leng.indexOf(".") == -1;
    let result = leng.toString();

    let num = result.split('.');
    if (!num[0].length) {
      if (parseInt(charCode) == 190) {
        evt.preventDefault();
        return false;
      }
    }

    let results = parseInt(result[0]);
    if (leng) {
      if (res) {
        if (result.length > 0 && result.length <= 0) {
          if (charCode == 190 || charCode == 8) {
            return true;
          }
        }
        let val = this.ngForm.controls['nitrogen'].value
        val = val.toString();

        if (val.length > 2) {

          if (parseInt(charCode) == 190 || parseInt(charCode) == 8) {
            // alert('190')
            if (this.nitrogenValidation == '') {

              return true;
            }
            else {
              if (parseInt(charCode) == 8) {
                return true;
              }
              else {
                return false;
              }


            }

          }
          else {

            return false;
          }
        }
      }
      var isDotPresent = (document.getElementById("nitrogen") as HTMLInputElement).value.indexOf('.') > -1;
      var isDotInput = evt.key === '.';
      let firstdigit = evt.key === '.'
      // I have to avoid the dot:
      if (isDotPresent && isDotInput) {
        // avoid the effect of the event (so the injection of dot into the text)
        evt.preventDefault();

      }

    }



    if (leng) {


      // if (parseInt(this.percentage[0]) % 1 != 0) {
      //   if (charCode == 190) {

      //     return false;
      //   }

      // }

      // else {
      if (charCode == 190 || charCode == 8) {

        return true;
      }
      // }
    }
    var len = (document.getElementById("nitrogen") as HTMLInputElement).value.length;


    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46 && charCode != 190) {
      var len = (document.getElementById("nitrogen") as HTMLInputElement).value.length;



      return false;
    }
    else {
      var len = (document.getElementById("nitrogen") as HTMLInputElement).value.length;
      var index = (document.getElementById("nitrogen") as HTMLInputElement).value.indexOf('.');





      if (index > 0 && charCode == 46) {

        return false;
      }
      if (index > 0) {
        var CharAfterdot = (len + 1) - index;
        if (CharAfterdot > 3) {
          return false;
        }
      }

    }
    return true;
  }
  onPasteNumberNitrogen(evt) {
    var alphaExp = '^[0-9]$';
    let len = 10
    let clipboardData = evt.clipboardData
    this.pastedNumber = clipboardData.getData('text');
    console.log('nitrogen', this.pastedNumber)
    let checkDecimal = this.pastedNumber.indexOf(".") == -1;
    if (checkDecimal) {
      if (this.pastedNumber.length > 3) {
        this.ngForm.get('nitrogen').setValue(this.ngForm.controls['nitrogen'].value ? this.ngForm.controls['nitrogen'].value.slice(0, 3) : '')
      }
      else {
        this.ngForm.get('nitrogen').setValue(this.pastedText)
      }
    }

    // if (this.ngForm.get('nitrogen').value.match(alphaExp)) {

    //   if(this.ngForm.get('nitrogen').value.length>len){
    //     const value = this.ngForm.get('nitrogen').value;
    //     this.ngForm.get('nitrogen').setValue(value.substring(0,len))
    //   }
    //   else{
    //     this.ngForm.get('nitrogen').setValue(this.ngForm.get('nitrogen').value)
    //   }
    //   // return true
    // }
  }
  checkAlphaandChararcter(e) {
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    console.log(keyCode)
    if (keyCode > 52 && keyCode < 58) {
      e.preventDefault();
    }

    // OTHERWISE SPECIAL CHARACTER
  }
  validateInput(event: KeyboardEvent) {
    const input = event.key;
    const regex = /^[a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

    if (!regex.test(input)) {
      event.preventDefault();
    }
  }


  isAlfa(evt) {

    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    if (evt.target.selectionStart == 0 && evt.code == 'Space') {
      evt.preventDefault();
      return false;
    }



    return ((
      (charCode > 42)
      && (charCode < 65 || charCode > 90)
      && (charCode < 97 || charCode > 122)

    ) || this.willCreateWhitespaceSequence(evt)) ? false : true;
  }
  willCreateWhitespaceSequence(evt) {
    var willCreateWSS = false;
    if (this.isWhiteSpace(evt.key)) {

      var elmInput = evt.currentTarget;
      var content = elmInput.value;

      var posStart = elmInput.selectionStart;
      var posEnd = elmInput.selectionEnd;

      willCreateWSS = (
        this.isWhiteSpace(content[posStart - 1] || '')
        || this.isWhiteSpace(content[posEnd] || '')
      );
    }
    return willCreateWSS;
  }
  isWhiteSpace(char) {
    return (/\s/).test(char);
  }
  cropGroup(data) {
    console.log('data', data)
    this.crop_groups = data && data.group_name ? data.group_name : '';
    this.ngForm.controls['crop_group'].setValue(data.group_code);
    this.ngForm.controls['crop_text'].setValue('')
    this.crop_names = '';
    this.variety_names = ''
    this.ngForm.controls['crop_name'].setValue('', { emitEvent: false })

    this.ngForm.controls['variety_name'].setValue('', { emitEvent: false })
  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  ciClick() {
    document.getElementById('insitution').click();
  }
  cnClick() {
    document.getElementById('crop_name').click();
  }
  cvClick() {
    document.getElementById('variety_name').click();
  }
  csClick() {
    document.getElementById('state_for_cultivation').click();
  }

  cropName(data) {
    console.log(data)
    this.crop_names = data && data.crop_name ? data.crop_name : "";
    this.ngForm.controls['crop_name'].setValue(data && data.crop_code ? data.crop_code : "")
    this.variety_names = ''
    this.ngForm.controls['variety_name'].setValue('', { emitEvent: false })
    this.ngForm.controls['crop_name_text'].setValue('')
  }
  varietyName(data) {
    console.log(data)
    this.variety_names = data && data.variety_name ? data.variety_name : '';
    this.ngForm.controls['variety_name'].setValue(data && data.id ? data.id : '');

    this.ngForm.controls['variety_name_text'].setValue('')

  }
  state_name(data) {
    this.state_names = data && data.state_name ? data.state_name : '';
    this.ngForm.controls['state_for_cultivation'].setValue(data && data.state_code ? data.state_code : '')
    this.stateList = this.stateListSecond
    this.ngForm.controls['state_name_text'].setValue('', { emitEvent: false })

  }
  insitutionData(data) {
    console.log("institute data====", data)
    this.selected_insitution = data && data.institute_name ? data.institute_name : '';
    this.institutionData = this.institutionDataSecond
    this.ngForm.controls['insitution_text'].setValue('', { emitEvent: false })
    this.ngForm.controls['insitution'].setValue(data && data.id ? data.id : '')
    this.getStateByBspc(data.id);

  }

  checkDecimalValue(event, length) {
    // checkDecimal(event);
    // return;
    console.log('checkDecimalValue event.keyCode', event.keyCode)
    console.log(event.target.value)
    var charCode = (event.which) ? event.which : event.keyCode;
    let decimalValues = (event.target.value.toString()).split('.')[0];
    let decimalAfterValues = (event.target.value.toString()).split('.')[1];
    if (parseInt(charCode) == 17) {
      return true;
    }
    if (decimalAfterValues && decimalAfterValues.length >= 2) {

      if (parseInt(charCode) == 1) {
        return true;
      }
      else {

        event.preventDefault();
        return false;
      }

    }
    // if (decimalValues && decimalValues.length > 2) {
    //   // let decimalValue=(event.target.value.toString()).split('.')[1];

    //   if (decimalValues && decimalValues.length > 2) {
    //     event.preventDefault();
    //     return false;
    //   }
    //   else {
    //     // return true
    //   }
    //   let res = event.target.value.indexOf(".") == -1;
    //   console.log((event.target.value.toString()).split('.'), 'event.target.value')
    //   let result = event.target.value.toString();
    //   // return true;
    // }

  }
  getItems(form: any) {


    return form.controls.fertilizerother.controls;
  }


  get itemsArray() {
    return <FormArray>this.ngForm.controls['fertilizerother'];
  }
  addMore() {
    this.itemsArray.push(this.varietyItem());
  }
  remove(index: number) {
    if (this.itemsArray.length <= 1)
      return;
    else
      this.itemsArray.removeAt(index);
  }
  getOtherFertilizerDataValue() {
    const id = this.route.snapshot.paramMap.get('submissionId');

    this.service.postRequestCreator('getOtherData?characterstics_id=' + id).subscribe(data => {
      this.otherfertilizerData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      console.log('da', this.otherfertilizerData.length)
      if (this.otherfertilizerData && this.otherfertilizerData.length) {

        for (let i in this.otherfertilizerData) {
          this.itemsArray.push(this.varietyItem());
          this.ngForm.controls['fertilizerother']['controls'][i].controls['fertilizer_other_name'].patchValue(this.otherfertilizerData[i].other_fertilizer_name);

          this.ngForm.controls['fertilizerother']['controls'][i].controls['fertilizer_other_value'].patchValue(this.otherfertilizerData[i].other_fertilizer_value);
          if (this.isView) {
            this.ngForm.controls['fertilizerother']['controls'][i].controls['fertilizer_other_name'].disable();
            this.ngForm.controls['fertilizerother']['controls'][i].controls['fertilizer_other_value'].disable();
          }
        }
        this.itemsArray.removeAt(this.itemsArray.length - 1);
      }

      // this.itemsArray
      // this.ngForm.controls['fertilizerother']= this.otherfertilizerData.length

    })
  }
  checkValues(event) {
    // console.log(event.target.value)
    var charCode = (event.which) ? event.which : event.keyCode;
    let decimalValues = (event.target.value.toString()).split('.')[0];
    let decimalAfterValues = (event.target.value.toString()).split('.')[1];
    if (parseInt(charCode) == 17 || parseInt(charCode) == 8) {
      return true;
    }
    if (decimalAfterValues && decimalAfterValues.length >= 2) {

      if (parseInt(charCode) == 17 || parseInt(charCode) == 8) {
        return true;
      }
      else {

        event.preventDefault();
        return false;
      }

    }
    if (decimalValues && decimalValues.length > 2) {
      // let decimalValue=(event.target.value.toString()).split('.')[1];

      if (decimalValues && decimalValues.length > 2) {
        event.preventDefault();
        return false;
      }
      else {
        // return true
      }
      let res = event.target.value.indexOf(".") == -1;
      let result = event.target.value.toString();
      // return true;
    }

  }
  // getInsitution() {
  //   this.service.postRequestCreator('getBspcDatainCharactersticsSecond', null, null).subscribe(apiResponse => {
  //     this.institutionData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
  //     this.institutionDataSecond = this.institutionData
  //     if (this.isEdit || this.isView) {
  //       if (this.institutionData) {
  //         const data = this.institutionData.filter(item => item.id == (this.ngForm.controls['insitution'].value))
  //         this.selected_insitution = data && data[0] && data[0].agency_name ? data[0].agency_name : '';
  //       }
  //     }
  //   })
  // }
  async getMuturityData() {
    const param = {
    }
    this.masterService.postRequestCreator("get-muturity-days", null, param).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.maturityInDaysData = apiResponse.EncryptedResponse.data;
      }
    });
  }
  async getStateByBspc(newValue) {
    const param = {
      "bspc_id": newValue ? newValue : ''
    }
    this.masterService.postRequestCreator("get-state-by-bspc", null, param).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.stateByBspcData = apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data[0] ? apiResponse.EncryptedResponse.data[0] : [];
        console.log("stateByBspcData", this.stateByBspcData);
      }
    });
  }

  async getClimateResilienceData() {
    const param = {
    }
    this.masterService.postRequestCreator("get-climate-resilience", null, param).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.climateResilienceData = apiResponse.EncryptedResponse.data;
      }
    });
  }
  async getreactiontomajorDiseasesdata() {
    const param = {
    }
    this.masterService.postRequestCreator("get-reaction-to-major-diseases-data", null, param).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.reactionToMajorDiseasesData = apiResponse.EncryptedResponse.data;
      }
    });
  }

  async getReactionToMajorInsectPestsData() {
    const param = {
    }
    this.masterService.postRequestCreator("get-reaction-to-major-insect-pests-data", null, param).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.reactionToMajorInsectPestsData = apiResponse.EncryptedResponse.data;
      }
    });
  }
  async getAgroRegionDataMapping() {
    const param = {
    }
    this.service.postRequestCreator("get-characterstic-agro-region-maping-data", null, param).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.agroRegionMaapingData = apiResponse.EncryptedResponse.data;
      }
    });
  }
  getInsitution() {
    const param = {
    }
    this.service.postRequestCreator("get-masters-institute-list", null, param).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.institutionData = apiResponse.EncryptedResponse.data;
        this.institutionDataSecond = this.institutionData;
        if (this.isEdit || this.isView) {
          console.log('this.institutionData',this.institutionData)
          console.log('this.ngForm.controls[insitution].value===',this.ngForm.controls['insitution'].value)
            const data = this.institutionData.filter(item => item.id == (this.ngForm.controls['insitution'].value ? this.ngForm.controls['insitution'].value:''))
            this.selected_insitution = data && data[0] && data[0].institute_name ? data[0].institute_name : '';
        }
      }
    });
  }
  
  async getAgroEcologicalRegionsStateWise(newValue) {
    let stateArray = [];
    if(this.ngForm.controls['state_for_cultivation_central'].value && this.ngForm.controls['state_for_cultivation_central'].value.length){
      this.ngForm.controls['state_for_cultivation_central'].value.forEach(ele=>{
        stateArray.push(ele.state_code);
      })
      const param = {
        "state_code": stateArray && stateArray.length?stateArray: []
      }
    

    // const selectedStates = this.ngForm.controls['state_for_cultivation_central'].value;
    // console.log("selectedStates", selectedStates.length )

  
    // if (selectedStates && selectedStates.length) {
    //   stateArray = selectedStates.map(ele => ele.state_code);
    //   const param = {
    //     "state_code": stateArray
    //   };

      this.masterService.postRequestCreator("get-agro-ecological-regions-state-wise", null, param).subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          let agroEcologicalRegionsArray = apiResponse.EncryptedResponse.data;
          let finalArray = [];
          if (agroEcologicalRegionsArray && agroEcologicalRegionsArray.length) {
            agroEcologicalRegionsArray.forEach(ele => {
              if (ele.regions_name || ele.regions_name !== null || ele.regions_name !== "") {
                finalArray.push({
                  "id": ele.id,
                  "short_name": ele.state_short_name,
                  "regions_name": ele.regions_name,
                })
              }
            })
          }
         
          const uniqueRegions = {};
          const result = [];
          for (const region of finalArray) {
            if (!uniqueRegions[region.regions_name && region.id]) {
              uniqueRegions[region.regions_name && region.id] = true;
              result.push(region);
            }
          }
          
          this.agroEcologicalRegionsStateWise = result;
          let regionDataMapping;
          if(this.router.url.includes('edit') || this.router.url.includes('view')){
            this.regions.clear();
            if(this.agroRegionMaapingData && this.agroRegionMaapingData.length){
              regionDataMapping = this.agroRegionMaapingData.filter(ele=>ele.variety_code==this.ngForm.controls['variety_code'].value)
            }
            for (let i = 0; i < this.agroEcologicalRegionsStateWise.length; i++) {
              this.addBspc();
                if(regionDataMapping && regionDataMapping.length){
                  regionDataMapping.forEach((element) => {
                    if(element.region_id == this.agroEcologicalRegionsStateWise[i].id){
                      this.ngForm.controls['regions']['controls'][i].controls['regions_checkbox'].setValue(true)
                    }
                  });
                }
              this.ngForm.controls['regions']['controls'][i].patchValue({
                regions_id: [this.agroEcologicalRegionsStateWise[i].id ? this.agroEcologicalRegionsStateWise[i].id : ''],
                regions_name: [this.agroEcologicalRegionsStateWise[i].regions_name ? this.agroEcologicalRegionsStateWise[i].regions_name + '/' : ''],
              });
            }
          }else{
            for (let i = 0; i < this.agroEcologicalRegionsStateWise.length; i++) {
              this.addBspc();
              this.ngForm.controls['regions']['controls'][i].patchValue({
                regions_id: [this.agroEcologicalRegionsStateWise[i].id ? this.agroEcologicalRegionsStateWise[i].id : ''],
                regions_name: [this.agroEcologicalRegionsStateWise[i].regions_name ? this.agroEcologicalRegionsStateWise[i].regions_name + '/' : ''],
               
              });
            }
          }
        }
      });
    }
  }

  // async getAgroEcologicalRegionsStateWise(newValue) {
  //   let stateArray = [];
  //   const selectedStates = this.ngForm.controls['state_for_cultivation_central'].value;
  
  //   if (selectedStates && selectedStates.length) {
  //     stateArray = selectedStates.map(ele => ele.state_code);
  //     const param = {
  //       "state_code": stateArray
  //     };
  
  //     try {
  //       const apiResponse = await this.masterService.postRequestCreator("get-agro-ecological-regions-state-wise", null, param).toPromise();
  //       if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code === 200) {
  //         let agroEcologicalRegionsArray = apiResponse.EncryptedResponse.data;
  //         let finalArray = agroEcologicalRegionsArray.filter(ele => ele.regions_name);
          
  //         // Ensure unique regions
  //         const uniqueRegions = {};
  //         const result = [];
  //         for (const region of finalArray) {
  //           if (!uniqueRegions[region.regions_name + region.id]) {
  //             uniqueRegions[region.regions_name + region.id] = true;
  //             result.push(region);
  //           }
  //         }
  
  //         this.agroEcologicalRegionsStateWise = result;
  
  //         if (this.router.url.includes('edit') || this.router.url.includes('view')) {
  //           this.regions.clear();
  //           let regionDataMapping = this.agroRegionMaapingData?.filter(ele => ele.variety_code === this.ngForm.controls['variety_code'].value) || [];
  
  //           for (let i = 0; i < this.agroEcologicalRegionsStateWise.length; i++) {
  //             this.addBspc();
  //             if (regionDataMapping.length) {
  //               regionDataMapping.forEach(element => {
  //                 if (element.region_id === this.agroEcologicalRegionsStateWise[i].id) {
  //                   this.ngForm.controls['regions']['controls'][i].controls['regions_checkbox'].setValue(true);
  //                 }
  //               });
  //             }
  //             this.ngForm.controls['regions']['controls'][i].patchValue({
  //               regions_id: [this.agroEcologicalRegionsStateWise[i].id || ''],
  //               regions_name: [this.agroEcologicalRegionsStateWise[i].regions_name ? `${this.agroEcologicalRegionsStateWise[i].regions_name}/` : ''],
  //             });
  //           }
  //         } else {
  //           for (let i = 0; i < this.agroEcologicalRegionsStateWise.length; i++) {
  //             this.addBspc();
  //             this.ngForm.controls['regions']['controls'][i].patchValue({
  //               regions_id: [this.agroEcologicalRegionsStateWise[i].id || ''],
  //               regions_name: [this.agroEcologicalRegionsStateWise[i].regions_name ? `${this.agroEcologicalRegionsStateWise[i].regions_name}/` : ''],
  //             });
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching agro ecological regions:', error);
  //     }
  //   }
  // }

  addBspc() {
    this.regions.push(this.regionsCreateForm());
  }

  removeBspc(value: number) {
    console.log("bspc length", this.ngForm.controls['regions'].value.length);
    this.regions.removeAt(value);
  }

  onSelectTemp(event) {
    console.log('eventbttttttttttttttttttt==', event.state_code)
    this.regions.clear();
    this.getAgroEcologicalRegionsStateWise(event.state_code);
  }
 

onSelectAll(event) {
  console.log('Select All event:', event);
  // You can use event to access the selected values
  this.ngForm.controls['state_for_cultivation_central'].setValue(event);
  this.getAgroEcologicalRegionsStateWise(null);
}

onDeSelectAll(event) {
  console.log('DeSelect All event:', event.state_code);
  // You can use event to access the selected values
  this.ngForm.controls['state_for_cultivation_central'].setValue([]);
  this.regions.clear();

  this.getAgroEcologicalRegionsStateWise(event.state_code);
}




noOnlySpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isOnlySpaces = (control.value || '').trim().length === 0;
    return isOnlySpaces ? { noOnlySpaces: true } : null;
  };
}

}
// 
