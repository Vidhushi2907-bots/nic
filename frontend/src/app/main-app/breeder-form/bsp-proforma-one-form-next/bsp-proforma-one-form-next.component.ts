import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bsp-proforma-one-form-next',
  templateUrl: './bsp-proforma-one-form-next.component.html',
  styleUrls: ['./bsp-proforma-one-form-next.component.css']
})
export class BspProformaOneFormNextComponent implements OnInit {

  ngForm!: FormGroup;
  bspsData: any;
  teamMember: any = [
    {
      teamMemberDetail: 'Sahil Sharma,hfjkdkjf,fhdjksdjk',
    }
  ]

  bspsDataArray: { id: number; bspc_name: string; season: string; crop: string; variety_name: string; variety_code: string; bspc_developed_by: number; req_no_doc_moa: string; req_no_dept_moa: string; nucleus_seed_available: string; breeder_seed_available: string; total_target: string; }[];
  bspcTeam: any;
  data: any;
  bspcData: any;
  userId: any;
  teamDetails: any;
  bspcTeamSecond: any;
  teamdetailsData: any;
  rportStatusData: any;
  ref_no: string;

  constructor(private breeder: BreederService, private fb: FormBuilder, private route: Router) {
    this.createForm();
    this.bspcData = this.breeder.bspcData;
    console.log("this.bspcData=============", this.bspcData);
  }

  createForm() {
    this.ngForm = this.fb.group({
      bspc_team: this.fb.array([
        // this.bspcCreateForm()
      ])
    });

  }
  get bspc_team(): FormArray {
    return this.ngForm.get('bspc_team') as FormArray;
  }

  bspcTeamCreateForm(): FormGroup {
    return this.fb.group({
      production_center: [''],
      team: ['',[Validators.required]],
      team_array: [],
      team_member_details: [''],
      id: [''],
      state_code: [],
    })
  }

  ngOnInit(): void {
    this.fetchData();
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    this.userId = data.id;
  }

  fetchData() {
    this.fetchQntInventryData();
  }

  fetchQntInventryData() {
    let route = "get-bsp-proforma-one-variety-basic-data-second";
    let param = {
      search: {
        year: this.bspcData && this.bspcData.year ? this.bspcData.year : '',
        season: this.bspcData && this.bspcData.season ? this.bspcData.season : '',
        crop_code: this.bspcData && this.bspcData.crop_code ? this.bspcData.crop_code : ''
      }
    };
    this.breeder.postRequestCreator(route, null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.bspsData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        if (this.bspsData && this.bspsData.length > 0 || this.bspsData !== undefined) {
          this.bspsData.forEach((ele, i) => {
            if (this.ngForm.controls['bspc_team'].value.length > 1) {
              this.removeBspc(i);
            }

            this.addBspc();
            this.ngForm.controls['bspc_team']['controls'][i].patchValue({
              production_center: ele.bspc_name,
              team: '',
              team_member_details: '',
              id: ele.id,
              state_code: ele.state_code
            });
            this.getBspcTeamData(i, this.ngForm.controls['bspc_team']['controls'][i].controls['state_code'].value);
          });
        }
      }
    });

  }

  addBspc() {
    this.bspc_team.push(this.bspcTeamCreateForm());
  }

  removeBspc(value: number) {
    this.bspc_team.removeAt(value);
  }
  redirect() {
    this.breeder.redirectData = {
      year: this.bspcData && this.bspcData.year ? this.bspcData.year : '',
      season: this.bspcData && this.bspcData.season ? this.bspcData.season : '',
      crop_code: this.bspcData && this.bspcData.crop_code ? this.bspcData.crop_code : ''
    }
    this.route.navigateByUrl('/breeder-bsp-profarma-one')
  }

  getBspcTeamData(index, state_code) {
    console.log('state_code', state_code);
    const route = "get-bsp-monitoring-team";
    this.breeder.postRequestCreator(route, null, {
      search: {
        year: this.bspcData && this.bspcData.year ? this.bspcData.year : '',
        season: this.bspcData && this.bspcData.season ? this.bspcData.season : '',
        crop_code: this.bspcData && this.bspcData.crop_code ? this.bspcData.crop_code : '',
        state_code: state_code ? state_code : ''
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.bspcTeam = data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.bspcTeamSecond = this.bspcTeam.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.id === arr.id)))

        if (this.bspcTeamSecond) {
          this.ngForm.controls['bspc_team']['controls'][index].controls['team_array'].patchValue(this.bspcTeamSecond);
        }
      }
    })
  }

  getBspcTeamData1(state_code, team_id) {
    const route = "get-bsp-monitoring-team";
    this.breeder.postRequestCreator(route, null, {
      search: {
        year: this.bspcData && this.bspcData.year ? this.bspcData.year : '',
        season: this.bspcData && this.bspcData.season ? this.bspcData.season : '',
        crop_code: this.bspcData && this.bspcData.crop_code ? this.bspcData.crop_code : '',
        state_code: state_code ? state_code : ''
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.bspcTeam = data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        return this.teamdetailsData = this.bspcTeam;
      }
    })
  }
  getReportStatusData() {
    const route = "check-report-runing-number";
    this.breeder.postRequestCreator(route, null, {
      report_type: "bsp1",
      year: this.bspcData && this.bspcData.year ? this.bspcData.year : '',
      season: this.bspcData && this.bspcData.season ? this.bspcData.season : '',
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.rportStatusData = data.EncryptedResponse.data;
        console.log(this.rportStatusData)
        this.ref_no = "BSP-I/" + (this.bspcData.year - 2000) + "-" + (this.bspcData.year - 2000 + 1) + "/" + (this.bspcData.season ? this.bspcData.season : 'NA') + "/" + (this.rportStatusData && this.rportStatusData.running_number ? (this.rportStatusData.running_number + 1) : 1);
        console.log('this.ref_no',this.ref_no);
        this.updateRunningNumber(null);
      }
      if (data.EncryptedResponse.status_code === 201) {
        // alert("hiii")
        this.ref_no = "BSP-I/" + (this.bspcData.year - 2000) + "-" + (this.bspcData.year - 2000 + 1) + "/" + (this.bspcData.season ? this.bspcData.season : 'NA') + "/" + 1;
        console.log('this.ref_no',this.ref_no);
        this.updateRunningNumber('save');
      }
    })
  }
  updateRunningNumber(save) {
    console.log("save=====",save);
    let route = "update-report-runing-number";
    let runningNumber;
    if(this.rportStatusData && this.rportStatusData.running_number){
      runningNumber = this.rportStatusData.running_number + 1;
    }
    this.breeder.postRequestCreator(route, null, {
      "report_type": "bsp1",
      "year": this.bspcData && this.bspcData.year ? this.bspcData.year : '',
      "season": this.bspcData && this.bspcData.season ? this.bspcData.season : '',
      "next_val": runningNumber ? runningNumber : 1,
      "isCreate": save ? save : ''
    }).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        // this.getReportStatusData();
      }
    });
  }

  finalSubmit() {
    
    if(this.ngForm.invalid){
      Swal.fire({
        title: "Please Select Team",
        // text: "You won't be able to Edit this!",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok"
      })
      return;
    }
    this.getReportStatusData();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to Edit this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Submit it!"
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('this.ref_no====',this.ref_no);
        let param = {
          team: this.ngForm.controls['bspc_team'].value,
          year: this.bspcData && this.bspcData.year ? this.bspcData.year : '',
          season: this.bspcData && this.bspcData.season ? this.bspcData.season : '',
          crop_code: this.bspcData && this.bspcData.crop_code ? this.bspcData.crop_code : '',
          user_id: this.userId,
          ref_no: this.ref_no ? this.ref_no : ''
        }
        let route = "add-bsp-monitoring-team";
        this.breeder.postRequestCreator(route, null, param).subscribe(res => {
          if (res.EncryptedResponse.status_code === 200) {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Submitted Successfully.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            });
            this.redirect();
            this.route.navigate(['breeder-bsp-profarma-one']);
          } else {
            Swal.fire({
              title: '<p style="font-size:25px;">Something Went Wrong.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            });
          }
        })
      }
    });
  }

  teamMemberDetails(teamId, index) {
    // console.log("teamId====", teamId.target.value);

    // console.log(this.ngForm.controls['bspc_team']['controls'][index].controls['team_array'].value);

    const route = "get-bsp-monitoring-team";
    this.breeder.postRequestCreator(route, null, {
      search: {
        year: this.bspcData && this.bspcData.year ? this.bspcData.year : '',
        season: this.bspcData && this.bspcData.season ? this.bspcData.season : '',
        crop_code: this.bspcData && this.bspcData.crop_code ? this.bspcData.crop_code : '',
        state_code: this.ngForm.controls['bspc_team']['controls'][index].controls['state_code'].value ? this.ngForm.controls['bspc_team']['controls'][index].controls['state_code'].value : '',
        id: teamId.target.value ? teamId.target.value : ''
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.bspcTeam = data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.teamdetailsData = this.bspcTeam;
        console.log("teamdetailsData", this.teamdetailsData);
        this.ngForm.controls['bspc_team']['controls'][index].controls['team_member_details'].patchValue(this.teamdetailsData);
      }
    })

    // let teamData = this.getBspcTeamData1(this.ngForm.controls['bspc_team']['controls'][index].controls['state_code'].value, teamId.target.value);
    // console.log('teamData====', teamData);
    // this.ngForm.controls['bspc_team']['controls'][index].controls['team'].patchValue(teamId)
    // console.log(this.ngForm.controls['bspc_team']['controls'][index].controls['team'].patchValue(teamId));
    // this.getBspcTeamData(index,this.ngForm.controls['bspc_team']['controls'][index].controls['state_code'].value)
    // let teamDetails = this.ngForm.controls['bspc_team']['controls'][index].controls['team_array'].value.filter(ele => ele.id == teamId.target.value && ele.state_code == this.ngForm.controls['bspc_team']['controls'][index].controls['state_code'].value);
    // console.log("teamDetails======", teamDetails);
  }
}
