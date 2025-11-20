import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';

import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { MasterService } from 'src/app/services/master/master.service';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
// import { I } from 'node_mod/@angular/cdk/keycodes';

@Component({
  selector: 'app-selection-of-spa-for-submission-indent',
  templateUrl: './selection-of-spa-for-submission-indent.component.html',
  styleUrls: ['./selection-of-spa-for-submission-indent.component.css']
})
export class SelectionOfSpaForSubmissionIndentComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  ngForm!: FormGroup;
  currentUser: any;
  spaData: any;
  agencyData: any;
  fileName: "selection-of-spa-for-submission-indent.xlsx";
  distData: any[];
  selectspaData: any;
  selected_state;
  stateList: any;
  stateListSecond: any;
  selected_district: any;
  selected_name_of_spa
  type: any;
  distDataSecond: any[];
  selectspaDatasecond: void;
  submitted = false;
  enableDistrict = false;
  enableSpaname = false;
  completeData = [];
  selectStatusData: any[];
  selectStatusDatasecond: any[];
  sectorData: any = [
    { 'name': 'NSC', 'state_code': 201 },
    { 'name': 'DADF', 'state_code': 202 },
    { 'name': 'HIL', 'state_code': 203 },
    { 'name': 'IFFDC', 'state_code': 204 },
    { 'name': 'IFFCO', 'state_code': 205 },
    { 'name': 'KRIBHCO', 'state_code': 206 },
    { 'name': 'KVSSL', 'state_code': 207 },
    { 'name': 'NAFED', 'state_code': 208 },
    { 'name': 'NDDB', 'state_code': 209 },
    { 'name': 'NFL', 'state_code': 210 },
    { 'name': 'NHRDF', 'state_code': 211 },
    { 'name': 'SOPA PRIVATE', 'state_code': 212 },
    { 'name': 'NSAI', 'state_code': 213 },
    { 'name': 'PRIVATE', 'state_code': 213 },
    { 'name': 'Private Company', 'state_code': 213 },
    { 'name': 'BBSSL', 'state_code': 214 }

  ];
  stateList2: any[]

  sectorsList = ['NSC', 'DADF', 'HIL', 'IFFDC', 'IFFCO', 'KRIBHCO', 'KVSSL', 'NAFED', 'NDDB', 'NFL', 'NHRDF', 'BBSSL', 'SOPA PRIVATE', 'NSAI', 'PRIVATE', 'Private Company']
  sectorName: any;
  addEnabledBtn: boolean = false;
  state_code: any;
  isShowDiv: boolean = true;
  onboard: any;
  constructor(private masterService: MasterService,
    private fb: FormBuilder,
    private service: SeedServiceService,
    private breederService: BreederService,
    private indenterService: IndenterService,
    private router: Router) {

    this.ngForm = this.fb.group({
      district: [''],
      spa: [''],
      status: [''],
      state_text: [''],
      district_text: [''],
      spa_name_text: [''],
      state_id: [''],
      status_toggle: ['']

    });



    this.ngForm.controls["state_id"].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(this.type, 'type')
        if (this.type && this.type != 'state') {

          this.ngForm.controls["status"].setValue('')
          this.ngForm.controls["district"].setValue('')
          this.selected_district = ''
          this.selected_name_of_spa = '';
          this.ngForm.controls["spa"].setValue('')
          this.districtData()
          this.statusList()
        }
        this.ngForm.controls['district_text'].enable();

      }
    })
    this.ngForm.controls["status"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.enableDistrict = true
        this.ngForm.controls["district"].setValue('', { emitEvent: false, onlySelf: true });
        this.ngForm.controls["spa"].setValue('', { emitEvent: false, onlySelf: true })
        this.selected_name_of_spa = ''
        this.selected_district = '';
        // this.getPageData();
        this.districtData()

      }
    })

    this.ngForm.controls["district"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls["spa"].setValue('', { emitEvent: false, onlySelf: true })
        this.selected_name_of_spa = ''

        this.selspaData();
        this.ngForm.controls['spa'].enable();
        this.enableSpaname = true;

      }
    })
    this.ngForm.controls["spa"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getSpa()
      }
    })

    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.stateList = this.stateListSecond
        let response = this.stateList.filter(x => x && x.state_name && x.state_name.toLowerCase().startsWith(newValue.toLowerCase()))
        this.stateList = response
      }
      else {
        this.getStateList()


      }
    });
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.distData = this.distDataSecond
        let response = this.distData.filter(x => x.districtName.toLowerCase().includes(newValue.toLowerCase()))

        this.distData = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        console.log(this.type, 'this.sss')
        // if(this.type && this.type!='state'){

        this.districtData()
        // }

      }
    });
    this.ngForm.controls['spa_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.selectspaData = this.selectspaDatasecond
        let response = this.selectspaData.filter(x => x.spaName.toLowerCase().startsWith(newValue.toLowerCase()))
        this.selectspaData = response
      }
      else {
        this.selspaData()
      }
    });


    // this.ngForm = this.fb.group({
    //   state: ['',],
    // });
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.ngForm.controls['spa'].disable();
    this.getStateList()
    this.getUserAgencyData();
    // if (this.type && this.type == 'state') {
    this.statusList()
    // }
    this.ngForm.controls['status_toggle'].patchValue(true);
    if (this.currentUser.username == 'ind-nsc') {
      this.getPageData();
    }
    // this.districtData();
  }


  districtData() {
    this.breederService.postRequestCreator("spaToIndentor/getAgencyData?id=" + this.currentUser.agency_id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.agencyData = data.EncryptedResponse.data;
        console.log(this.agencyData)
        let object = {}
        if (this.type == 'state') {

          object = {
            stateCode: data.EncryptedResponse.data['state_id']
            // stateCode: 3

          }
        } else {
          object = {
            stateCode: this.ngForm.controls['state_id'].value
            // stateCode: 3

          }

        }

        this.distData = [];
        this.breederService.postRequestCreator("spaToIndentor/getAllIndentor", null, object).subscribe((data: any) => {
          // console.log("distataaa", this.ngForm.controls['district'].value);

          if (data.EncryptedResponse.data == 'No data available' || data.EncryptedResponse.data == 'State not found') {
            this.distData = [];
          }
          else {
            if (this.ngForm.controls['status'].value) {
              this.distData = data.EncryptedResponse.data;
              let statusData = []
              console.log("this.ngForm.controls['status'].value", this.ngForm.controls['status'].value);
              let spaData = this.spaData;
              this.completeData = this.spaData;
              let sectorDataValue;
              if (this.agencyData && this.agencyData['m_state'] && this.agencyData['m_state'].state_code) {
                sectorDataValue = this.sectorData.filter(ele => ele.state_code == this.agencyData['m_state'].state_code)
                // console.log('sector data ==', sectorDataValue);
              }

              if (this.type) {
                // console.log("this.currentUser.name1", this.currentUser.name)
                console.log('this.type', this.type)
                if (this.type == "central") {
                  console.log("this.currentUser.name2", this.currentUser.name)
                  if (sectorDataValue) {
                    console.log("this.currentUser.name3", this.currentUser.name)
                    // if (this.currentUser.name == 'ind-nsai') {
                    if (this.currentUser.name == 'NSAI') {
                      // console.log("this.currentUser.name4", this.currentUser.name)
                      // this.completeData = data.EncryptedResponse.data;
                      // console.log("data.EncryptedResponse", data.EncryptedResponse['data'])
                      let sectorData = data.EncryptedResponse['data'];
                      console.log(sectorData, 'sectorDatasectorDatasectorData')
                      this.completeData = sectorData.filter(ele => ele.sector == "Private Company" || ele && ele.sector && ele.sector.toUpperCase() == "PRIVATE" || ele && ele.sector && ele.sector == "Private" || ele.sector == "NSAI")
                      this.distData = data.EncryptedResponse['data']
                      // filter(ele => ele.sector == "Private Company" ||  ele.sector == "PRIVATE" || ele.sector == "NSAI")
                      this.addEnabledBtn = true;
                    } else {
                      this.completeData = data.EncryptedResponse.data.filter(ele => ele.sector == sectorDataValue[0].name)
                      // console.log('this.completeData============', this.completeData);
                      this.distData = data.EncryptedResponse.data.filter(ele => ele.sector == sectorDataValue[0].name);
                    }
                  }
                }
                else if (this.type == "state") {
                  this.completeData = data.EncryptedResponse.data.filter(ele => (ele.sector == '' || ele.sector == null || ele.sector == undefined) || ele.sector == "Private Company" || ele.sector == "private company" || ele.sector == "privatecompany" || !this.sectorsList.includes(ele.sector))
                  // this.distData = data.EncryptedResponse.data.filter(ele =>  ele.sector == '' || ele.sector == null || ele.sector == undefined);
                  // console.log('this.completeData============', this.completeData);
                }
              }
              else {
                // console.log("777777777777777777",  data.EncryptedResponse.data)
                this.completeData = data.EncryptedResponse.data
                this.distData = data.EncryptedResponse.data;
              }
              let indentActive = [];
              let indentInActive = []
              if (this.completeData && this.completeData.length > 0) {
                this.completeData.forEach((item, i) => {
                  if (item && item.indentor && item.indentor == true) {
                    indentActive.push(item)
                  } else {
                    indentInActive.push(item)
                  }
                })
              }
              console.log(indentInActive, indentActive)
              statusData = spaData.filter(
                item => (item && item.indentor && item.indentor == true),
              );
              if (this.ngForm.controls['status'].value == 'Active') {

                console.log(statusData, 'spaData')
                this.distData = indentActive;
                this.spaData = indentActive

                if (this.distData) {
                  // for (let prop in this.distData) {
                  //   if (this.distData[prop] === null) {
                  //     delete this.distData[prop];
                  //   }
                  // }
                  this.distData = Array.from(new Set(this.distData.map(a => a.districtName)))
                    .map(districtName => {
                      return this.distData.find(a => (a.districtName.toLowerCase()) === districtName.toLowerCase())
                    })


                  this.distData = this.distData.filter((arr, index, self) =>
                    index === self.findIndex((t) => (t.districtName === arr.districtName)))

                  this.distData = this.distData.sort((a, b) => a && a.districtName ? a.districtName.localeCompare(b.districtName) : '')
                  this.distDataSecond = this.distData
                }
                // this.distData = this.distData.filter((arr, index, self) =>
                //   index === self.findIndex((t) => ((t.districtName.toLowerCase()) === arr.districtName.toLowerCase())))
              } else {
                let spaData = this.spaData


                statusData = spaData.filter(
                  item => (item && item.indentor == '' || item.indentor == false) || !item.indentor,
                );
                console.log(statusData, 'spaData')
                this.distData = indentInActive;
                this.spaData = indentInActive
                console.log("dfds000000000", this.distData)
                if (this.distData) {

                  this.distData = Array.from(new Set(this.distData.map(a => a.districtName)))
                    .map(districtName => {
                      // console.log("----------",districtName) 
                      return this.distData.find(a => (districtName != undefined) && a.districtName && districtName && (a.districtName.toLowerCase()) === districtName.toLowerCase())
                    })
                  // console.log("dfds222222222222222", this.distData)

                  this.distData = this.distData.filter((arr, index, self) =>
                    index === self.findIndex((t) => t && t.districtName && arr && arr.districtName && (t.districtName === arr.districtName)))
                  this.distData = this.distData.sort((a, b) => a.districtName.localeCompare(b.districtName))
                  this.distDataSecond = this.distData
                  // console.log("333333333333", this.distData)

                }

              }
            } else {
              this.distData = data.EncryptedResponse.data;
              this.distData = this.distData.filter((arr, index, self) =>
                index === self.findIndex((t) => (t.districtName === arr.districtName)))
              if (this.distData && this.distData.length > 0) {
                // this.distData = this.distData.sort((a, b) => a.districtName.localeCompare(b.districtName))
              }
              this.distDataSecond = this.distData
              if (this.ngForm.controls['district'].value) {
                console.log('hiiiiiiiiiiiiii')
                this.selectspaData = this.completeData.filter(x => x.districtName == this.ngForm.controls['district'].value)
                this.spaData = this.selectspaData
              }
            }
          }
        })
      }
      this.agencyData = data.EncryptedResponse.data;
      if (this.type == 'state') {
        this.selected_state = this.agencyData && this.agencyData.m_state && this.agencyData.m_state && this.agencyData.m_state.state_name ? this.agencyData.m_state.state_name : ''
      }
      // console.log(this.selected_state, 'this.selected_state')
    })

  }
  statusList() {
    console.log(this.ngForm.controls['state_id'].value, 'this.ngForm.controlse')
    if (this.ngForm.controls['state_id'].value) {

      this.selectStatusData = this.completeData.filter(x => x.state_name == this.ngForm.controls['state_id'].value)
      // this.selectspaData = this.selectspaData.filter(x =>  this.ngForm.controls['status'].value=='Active'?
      // x.indentor==true :x.indentor==false || !x.indentor )

      // this.selectspaData = this.distData.filter(
      //   x =>x.spaName==this.ngForm.controls['district'].value
      //   );
      // console.log(' this.selectspaData', this.selectStatusData)
      this.selectStatusDatasecond = this.selectStatusData
    }
  }
  async getStateList() {
    this.service
      .postRequestCreator("getIndentorStateList")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.stateList = apiResponse.EncryptedResponse.data.rows;
          // this.stateList2 =  this.stateList;
          // this.stateList = this.stateList.filter((arr, index, self) =>
          //   index === self.findIndex((t) => (t['m_state.state_name'] === arr['m_state.state_name'])))
          this.stateListSecond = this.stateList
        }
      });

  }


  selspaData() {
    if (this.ngForm.controls['district'].value) {
      console.log('hiiiiiiiiiiiiii')
      this.selectspaData = this.completeData.filter(x => x.districtName == this.ngForm.controls['district'].value)
      this.spaData = this.selectspaData
      console.log(this.selectspaData, ' this.selectspaData')
      this.selectspaData = this.selectspaData.filter(x => this.ngForm.controls['status'].value == 'Active' ?
        x.indentor == true : x.indentor == false || !x.indentor)

      // this.selectspaData = this.distData.filter(
      //   x =>x.spaName==this.ngForm.controls['district'].value
      //   );
      // console.log(' this.selectspaData', this.selectspaData)
      this.spaData = this.selectspaData
      this.selectspaDatasecond = this.selectspaData

    }
    // this.breederService.postRequestCreator("spaToIndentor/getAgencyData?id=" + this.currentUser.agency_id).subscribe((data: any) => {
    //   if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
    //     this.agencyData = data.EncryptedResponse.data;
    //     let object = {
    //       stateCode: data.EncryptedResponse.data['state_id']


    //     }

    //     this.selectspaData = [];
    //     this.breederService.postRequestCreator("spaToIndentor/getAllIndentor", null, object).subscribe((data: any) => {

    //       if (data.EncryptedResponse.data == 'No data available') {
    //         this.selectspaData = [];
    //       }
    //        else {

    //         if(this.ngForm.controls['district'].value) 
    //         {
    //           this.selectspaData = data.EncryptedResponse.data.filter(
    //             x =>x.selectspaData=this.ngForm.controls['district'].value
    //             );
    //         }
    //       }
    //       console.log("spaDataaa", this.spaData);


    //       console.log(this.spaData)
    //     })
    //   }

    // })

  }


  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    // alert("hii");
    this.breederService.postRequestCreator("spaToIndentor/getAgencyData?id=" + this.currentUser.agency_id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.agencyData = data.EncryptedResponse.data;
        // console.log('this.agencyData ',this.agencyData )
        // this.filterPaginateSearch.Init(this.agencyData, this, "getPageData", undefined, data.EncryptedResponse.count, true);
        // this.initSearchAndPagination();
        console.log('agecy data==', this.agencyData);
        let object;
        if (this.type == 'state') {
          object = {
            stateCode: data.EncryptedResponse.data['state_id']
            // stateCode: 3
          }
          this.ngForm.controls['state_id'].setValue(data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data['state_id'] ? data.EncryptedResponse.data['state_id'] : '')
        } else {
          object = {
            stateCode: this.ngForm.controls['state_id'].value
            // stateCode: 3
          }
        }
        this.distData = [];
        this.spaData = [];
        if (this.ngForm.controls['state_id'].value || (this.currentUser.username == 'ind-nsc')) {
          this.breederService.postRequestCreator("spaToIndentor/getAllIndentor", null, object).subscribe((data: any) => {
            if (data.EncryptedResponse.data == 'No data available') {
              this.distData = [];
              this.spaData = [];
            }
            else if (data.EncryptedResponse.data == 'State not found') {
              this.distData = [];
              this.spaData = [];
            }
            else {
              let sectorDataValue;
              if (this.agencyData && this.agencyData['m_state'] && this.agencyData['m_state'].state_code) {
                sectorDataValue = this.sectorData.filter(ele => ele.state_code == this.agencyData['m_state'].state_code)
                // console.log('sector data ==', sectorDataValue);
              }

              if (this.type) {
                // console.log("this.currentUser.name1", this.currentUser.name)
                console.log('this.type', this.type)
                if (this.type == "central") {
                  console.log("this.currentUser.name2", this.currentUser.name)
                  if (sectorDataValue) {
                    console.log("this.currentUser.name3", this.currentUser.name)
                    // if (this.currentUser.name == 'ind-nsai') {
                    if (this.currentUser.name == 'NSAI') {
                      // console.log("this.currentUser.name4", this.currentUser.name)
                      // this.completeData = data.EncryptedResponse.data;
                      // console.log("data.EncryptedResponse", data.EncryptedResponse['data'])
                      let sectorData = data.EncryptedResponse['data'];
                      console.log('sectorDatasectorDatasectorData',sectorData)
                      this.completeData = sectorData.filter(ele => ele.sector == "Private Company" || ele && ele.sector && ele.sector.toUpperCase() == "PRIVATE" || ele && ele.sector && ele.sector == "Private" || ele.sector == "NSAI" && (ele && ele.indentor == true))
                      this.distData = data.EncryptedResponse['data']
                      // filter(ele => ele.sector == "Private Company" ||  ele.sector == "PRIVATE" || ele.sector == "NSAI")
                      this.addEnabledBtn = true;
                    } else {
                      this.completeData = data.EncryptedResponse.data.filter(ele => ele.sector == sectorDataValue[0].name)
                      // console.log('this.completeData============', this.completeData);
                      this.distData = data.EncryptedResponse.data.filter(ele => ele.sector == sectorDataValue[0].name);
                    }
                  }
                }
                else if (this.type == "state") {
                  this.completeData = data.EncryptedResponse.data.filter(ele => (ele.sector == '' || ele.sector == null || ele.sector == undefined) || ele.sector == "Private Company" || ele.sector == "private company" || ele.sector == "privatecompany" || !this.sectorsList.includes(ele.sector))
                  // this.distData = data.EncryptedResponse.data.filter(ele =>  ele.sector == '' || ele.sector == null || ele.sector == undefined);
                  // console.log('this.completeData============', this.completeData);
                }
              }
              else {
                // console.log("777777777777777777",  data.EncryptedResponse.data)
                this.completeData = data.EncryptedResponse.data
                this.distData = data.EncryptedResponse.data;
              }

              if (this.ngForm.controls['district'].value || this.ngForm.controls['spa'].value || this.ngForm.controls['status'].value) {
                this.spaData = data.EncryptedResponse.data.filter(
                  item => item.districtName == this.ngForm.controls['district'].value,
                )
                // console.log("88888888888888",  this.spaData)

              }
              else {
                if (this.currentUser.username == 'ind-nsc') {
                  this.spaData = data.EncryptedResponse.data
                  console.log('this.spaData===', this.spaData);
                  // return;
                } else {
                  this.spaData = this.completeData;
                }

              }
            }
            // this.filterPaginateSearch.Init(this.spaData, this, "", undefined, this.spaData.length, true);
            // this.initSearchAndPagination();
            // console.log('spaa data111111111==========', this.spaData)
            // console.log('spaa data111111111==========', this.spaData)
            // this.filterPaginateSearch.Init(this.spaData, this, "getPageData", undefined,  this.spaData.length, true);
            // this.initSearchAndPagination();
          })
        }
      }

    })
  }


  clear() {
    this.selected_district = '';
    if (this.type == 'central') {

      this.ngForm.controls["state_id"].setValue("");
      this.selected_state = ''
    }
    this.selected_name_of_spa = ''
    this.ngForm.controls["district"].setValue("");
    this.ngForm.controls["spa"].setValue("");
    this.ngForm.controls["status"].setValue("");
    this.selected_district = ''
    this.submitted = false
    this.enableDistrict = false
    this.enableSpaname = false

    this.ngForm.controls['spa'].disable();


    // this.ngForm.controls['variety_name'].disable();
    // this.filterPaginateSearch.itemListCurrentPage = 1;

    this.ngForm.controls['spa'].patchValue("");

    this.getPageData();
  }

  toggleDisplayDiv(inden, spacode) {
    // this.isShowDiv = !this.isShowDiv;
    // this.ngForm.controls['status_toggle'].patchValue(true);
    if (inden == 'Allowed') {
      // this.ngForm.controls['status_toggle'].patchValue(true);
      this.removeIndentor(spacode)
    } else {
      // this.ngForm.controls['status_toggle'].patchValue(false);
      this.setAsIndentor(spacode)
    }
  }

  search() {
    // console.log("444444444", this.distData)

    if ((!this.ngForm.controls["state_id"].value && !this.ngForm.controls["district"].value && !this.ngForm.controls["spa"].value
      && !this.ngForm.controls["status"].value
    )) {
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
      // console.log("444444444444444", this.distData)

      this.submitted = true

      // const route = "filter-add-characterstics-list";
      // const param = {43
      //   search: {
      //     distData: (this.ngForm.controls["district"].value),
      //     spaData: this.ngForm.controls["spa"].value,


      //   }

      // }

      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination();
      this.getPageData();
      let statusData = []
      
      this.spaData = this.completeData;
      if (this.currentUser.name == 'NSAI') {
        this.addEnabledBtn = true;
        this.ngForm.controls['status'].disable();
        this.ngForm.controls['status'].setValue('Active');
        
      }
      if (this.ngForm.controls['district'].value) {
        // alert()

        const districtdata = this.spaData.filter(
          item => item.districtName == this.ngForm.controls['district'].value


        );
        // console.log("DissssssData", districtdata)
        this.spaData = districtdata;
      }
      if (this.ngForm.controls['district'].value && this.ngForm.controls['spa'].value) {

        const districtdata = this.spaData.filter(
          item => item.districtName == this.ngForm.controls['district'].value &&
            item.spaName == this.ngForm.controls['spa'].value,
          // console.log("spaaaaaaData",item.spaName,this.ngForm.controls['spa'].value)

        );
        this.spaData = districtdata;
      }

      if (this.ngForm.controls['status'].value) {
        // console.log("55555555555555", this.distData)

        let statusData = []
        console.log("this.ngForm.controls['status'].value", this.ngForm.controls['status'].value)
        if (this.ngForm.controls['status'].value == 'Active') {
          console.log("this.spaData active", this.spaData)
          statusData = this.spaData.filter(
            item => (item.indentor == true),
          );
          this.spaData = statusData;
          console.log(this.spaData, 'Acive Spa')
        }
        else {
          // if(this.ngForm.controls['status'].value == true){
          // console.log("this.spaData Inactive 666666666666", this.spaData)
          statusData = this.spaData.filter(

            item => !(item.hasOwnProperty("indentor")) || !item.indentor || (item.indentor != true),


          );
          //  }
          this.spaData = statusData;
          console.log(this.spaData, 'Inactive spa')
        }


      }
      else {
        if (this.type && this.type != 'state' && this.ngForm.controls['state_id'].value) {
          if (this.submitted) {
            this.getPageData();
          }
        }
      }

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


  setAsIndentor(spaCode: number) {
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure To Allow?",
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
        const object = {
          stateCode: this.agencyData.state_id.toString(),
          spaCode: spaCode.toString()
        }
        if (this.currentUser.name == 'NSAI') {
          object.stateCode = this.state_code.toString()
        }
        this.ngForm.controls['status_toggle'].patchValue(false);

        this.breederService.postRequestCreator("spaToIndentor/updateAsIndentor", null, object).subscribe((data: any) => {
          Swal.fire({
            title: '<p style="font-size:25px;">SPA Has Been Successfully Allowed For Indent Submission.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'


          }).then(x => location.reload())

        })
      }
    })
    this.ngForm.controls['status_toggle'].patchValue(true);
  }

  removeIndentor(spaCode: any) {
    this.ngForm.controls['status_toggle'].patchValue(false);
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure To Remove SPA From the List of Allowed SPAs? ",
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
        const object = {
          stateCode: this.agencyData.state_id.toString(),
          spaCode: spaCode.toString()
        }
        if (this.currentUser.name == 'NSAI') {
          object.stateCode = this.state_code.toString()
        }

        this.ngForm.controls['status_toggle'].patchValue(false);
        this.breederService.postRequestCreator("spaToIndentor/removeAsIndentor", null, object).subscribe((data: any) => {
          Swal.fire({
            title: '<p style="font-size:25px;">SPA Has Been Successfully Removed.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          }).then(x => location.reload())
        })
      } else {

      }
    })

  }

  // clear() {
  //   this.ngForm.controls['state'].patchValue("");
  //   this.getPageData();
  //   this.filterPaginateSearch.itemListCurrentPage = 1;
  //   this.initSearchAndPagination();
  // }

  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  download() {
    console.log("working")
    const name = 'selection-of-spa-for-submission-indent';
    const element = document.getElementById('excel-table');
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 192,
        scale: 1,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    // console.log("exelWs", XLSX.utils.table_to_sheet(element));
    // console.log("exelWB", XLSX.utils.book_new());
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    // this.fileName
    XLSX.writeFile(wb, 'selection-of-spa-for-submission-indent.xlsx');
  }
  state_select(data) {
    this.selected_state = data && data['state_name'] ? data['state_name'] : '';
    this.ngForm.controls['state_id'].setValue(data && data['state_code'] ? data['state_code'] : '')
    this.ngForm.controls['state_text'].setValue('', { emitEvent: false })
    this.stateList = this.stateListSecond
    // this.state_code = data && data['m_state.state_code'] ? data['m_state.state_code'] : '';
    this.state_code = data && data['state_code'] ? data['state_code'] : '';

    this.checkOnboardUser();

    this.search()

  }
  checkOnboardUser() {
    const route = "check-isonboard-statewise"
    this.indenterService.postRequestCreator(route, null, {
      search: {
        'state_code': this.ngForm.controls['state_id'].value
      }
    }).subscribe(res => {
      this.onboard = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data[0] : '';
    })
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

  cnamespaClick() {
    document.getElementById('spa').click();
  }

  district_select(data) {
    this.selected_district = data && data.districtName ? data.districtName : '';
    this.ngForm.controls['district'].setValue(data && data.districtName ? data.districtName : '',)
    this.ngForm.controls['district_text'].setValue('', { emitEvent: false, onlySelf: true })
  }
  getUserAgencyData() {
    const userData = localStorage.getItem('BHTCurrentUser')
    const data = JSON.parse(userData)
    const param = {
      search: {
        agency_id: data.agency_id
      }
    }
    this.masterService.postRequestCreator('getUserDataInIndentor/' + data.agency_id, null, param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      this.type = res && res[0] && res[0].user && res[0].user.type ? res[0].user.type : '';
      console.log('this.type', this.type)

      this.getPageData();
    })
  }
  spa_select(data) {
    this.ngForm.controls['spa'].setValue(data && data.spaName ? data.spaName : '');
    this.selected_name_of_spa = data && data.spaNamfv ? data.spaName : '';
    this.ngForm.controls['spa_name_text'].setValue('', { emitEvent: false, onlySelf: true });
    this.selected_name_of_spa = data && data.spaName ? data.spaName : '';
  }
  checkIndentor(inden, spacode) {
    if (inden == 'Allowed') {
      this.removeIndentor(spacode)
    } else {
      this.setAsIndentor(spacode)
    }
  }
  getSpa() {
    this.spaData = this.completeData;
    if (this.spaData && this.spaData.length > 0) {
      this.spaData = this.spaData.filter(x => x.spaName == this.ngForm.controls['spa'].value)
    }
    console.log(this.completeData)
  }
}


