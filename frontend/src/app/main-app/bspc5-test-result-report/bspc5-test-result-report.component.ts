import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/services/master/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
// import html2pdf from 'html2pdf.js';
import html2pdf from 'html2pdf.js';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

import { VarietyCharactersticReportsComponent } from '../reports/variety-characterstic-reports/variety-characterstic-reports.component';

interface Variety {
  name: string;
  parentalLine: string;
}

interface LotDetails {
  lotNo: string;
  classOfSeed: string;
  godownNo: string;
  stackNo: string;
  noOfBags: string;
}

interface SampleDetails {
  uniqueCode: string;
  sampleNo: number;
  testingCentre: string;
  testCentre: string;
  consignmentNo: string;
}

interface OtherDetails {
  areaUnderVariety: number;
  noOfSamples: number;
  dateOfBspI: string;
  dateOfBspIII: string;
}

interface Report {
  id: number;
  genrate_id:number;
  variety: Variety;
  lotDetails: LotDetails;
  sampleDetails: SampleDetails;
  otherDetails: OtherDetails;
  totalPlantsObserved: number;
  totalSelfPlants: number;
  totalOffTypePlants: number;
  totalTruePlants: number;
  geneticPurity: string;
}
@Component({
  selector: 'app-bspc5-test-result-report',
  templateUrl: './bspc5-test-result-report.component.html',
  styleUrls: ['./bspc5-test-result-report.component.css']
})
export class Bspc5TestResultReportComponent implements OnInit {
  baseUrl: string = environment.ms_nb_01_master.baseUrl;
  is_update: any;
  showAddMoreInthisVariety: any;
    selectCrop: any;
    selectCrop_crop_code: any;
    crop_name_data: any;
    selectCrop_group: string;
    crop_text_check: string;
    searchClicked: boolean;
    isSearch: boolean;
    showVarietyDetails: boolean;
    selectVariety: string;
    showparental: boolean;
    selectParental: string;
    submitted: boolean;
    yearOfIndent: any;
    seasonlist: any;
    cropName: any;
    reports: Report[];
    varietyArray: any;
    cropNameSecond: any;
     responseData: any[];
    isReportDownload: boolean;
    downloadreportsData: any;
    formattedDate: string;
    state: any;
    district: any;
    encryptedData: string;
    qrCodeUrl: string;
    moniteringData: any;
  ngForm: any;
  constructor(private service: SeedServiceService, private fb: FormBuilder, private master: MasterService, private elementRef: ElementRef, private formBuilder: FormBuilder, private _productionCenter: ProductioncenterService, private route: Router
  ) { 
    this.createForm(); 

  }

  ngOnInit(): void {
    this.growOutTestingReportYearData();
  }

  growOutTestingReportYearData() {
    let route = "get-got-year";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.yearOfIndent = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        // console.log(this.yearOfIndent);
      }
    });
  }

   createForm(){
      this.ngForm= this.fb.group({
        selectteam: ['', Validators.required],
        year: new FormControl('',),
        season: new FormControl('',),
        crop_text: new FormControl('',),
        crop_code:new FormControl('',),
        crop_name:new FormControl('',),
        varietyvalue:new FormControl('',),
       
      });
      this.ngForm.controls['season'].disable();
      // this.ngForm.controls['crop_text'].disable();
      this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
        if (newValue) {
          this.isSearch = false;
          this.selectCrop = ''
          this.ngForm.controls['season'].enable();
          this.selectVariety = '';
          this.showparental = false;
          this.selectParental = ''
          this.showVarietyDetails = false;
          this.seedgotReportSeasonData();
        }
      })
      this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
        if (newValue) {
          this.isSearch = false;
          this.selectCrop = ''
          this.showVarietyDetails = false;
          this.selectVariety = '';
          this.showparental = false;
          this.selectParental = ''
          this.getCrop()
        }
      });
      this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
        if (newValue) {
          this.cropName = this.cropNameSecond
          let response = this.cropName.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))
          this.cropName = response
        }
        else {
          this.cropName = this.cropNameSecond
        }
      });
    }
  

  seedgotReportSeasonData() {
    let route = "get-got-season";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seasonlist = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }
  seedgotReportVarietyData() {
    let route = "get-got-variety";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.varietyArray = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }

  getCrop() {
    let route = "get-got-crop";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
      }
    }
      this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
        if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
          this.cropName = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
          this.cropNameSecond = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
    
          // console.log(this.yearOfIndent);
        }
      });
    }


  cropdatatext() {
    this.cropNameSecond;
    console.log('this.cropNameSecond;', this.cropNameSecond);
  }

  cropNameValue(item: any) {
    console.log('item====', item);
    this.selectCrop = item.crop_name;
    // this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_code'].setValue(item.crop_code);
    this.selectCrop_crop_code = item.crop_code;
    //console.log("this.selectCrop_crop_code",this.selectCrop_crop_code);
    this.crop_name_data = item.crop_name;
    this.selectCrop_group = "";
    this.ngForm.controls['crop_name'].setValue('')
    this.crop_text_check = 'crop_group'
  }
  cgClick() {
    document.getElementById('crop_group').click();

  }

   toggleSearch() {
      if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop_code'].value) {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Select All Required Fields.</p>',
          icon: 'warning',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        });
        return;
      }
      else{
      this.searchClicked = !this.searchClicked;
      this.seedgotReportVarietyData();
      this.getGotDetailsReportdata();
      }
     
    }

    onVarietyChange(event: any) {
      const selectedValue = event.target.value;
      console.log("Selected variety:", selectedValue);
    
      // Optionally update a form control if needed
      this.ngForm.controls['varietyvalue'].setValue(selectedValue);
    
      // Call your method to fetch the details based on the selected variety
      this.getGotDetailsReportdata();
    }

    getGotDetailsReportdata() {
      let route = "get-got-report-details";
      let param = {
        "search": {
          "year": this.ngForm.controls['year'].value,
          "season": this.ngForm.controls['season'].value,
          "crop_code": this.selectCrop_crop_code,
          "variety_code":this.ngForm.controls['varietyvalue'].value,
          
        }
      }
        this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
          if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
            const apiData= res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
            // = res.EncryptedResponse.data || [];
           this.reports = this.mapApiDataToReports(apiData);
          }
        });
      }

      mapApiDataToReports(apiData: any[]): Report[] {
        return apiData.map((data, index) => {
          const geneticPurity = data.total_plant_observed
            ? ((data.true_plant / data.total_plant_observed) * 100).toFixed(2)
            : "N/A";
      
          return {
            id: index + 1,
            genrate_id : data.id,
            variety: {
              name: data.variety_name || 'Unknown Variety',
              parentalLine: data.variety_line_code || 'N/A'
            },
            lotDetails: {
              lotNo: data.lot_num || 'Unknown Lot',
              classOfSeed:data.class_of_seed, // Placeholder
              godownNo:data.godown_no,          // Placeholder
              stackNo: data.stack_no,           // Placeholder
              noOfBags: data.no_of_bags,           // Placeholder
            },
            sampleDetails: {
              uniqueCode: data.unique_code,
              sampleNo: data.sample_no,
              testingCentre: data.agency_name,     // Placeholder
              testCentre: data.test_no, 
              consignmentNo: data.consignment_no      // Placeholder
            },
            otherDetails: {
              areaUnderVariety: data.area_shown || 0,
              noOfSamples: data.number_sample_taken || 0,
              dateOfBspI: data.date_of_bsp_2 || null,
              dateOfBspIII: data.date_of_bsp_3 || null
            },
            totalPlantsObserved: data.total_plant_observed || 0,
            totalSelfPlants: data.self_plant || 0,
            totalOffTypePlants: data.off_type_plant || 0,
            totalTruePlants: data.true_plant || 0,
            geneticPurity: geneticPurity
          };
        });
      }

    getreportData(data: any, isRemonitoring: boolean, id: any) {
      let route = "get-got-report-details-byid";
      let param = {
        "search": {
          "year": this.ngForm.controls['year'].value,
          "season": this.ngForm.controls['season'].value,
          "crop_code": this.selectCrop_crop_code,
          "variety_code": this.ngForm.controls['varietyvalue'].value,
          "id": id,
        }
      };
    
      this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
        if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
          const apiData = res.EncryptedResponse.data || [];
          const currentDate = new Date();
          this.formattedDate = currentDate.toLocaleDateString('en-GB'); // UK format (dd/mm/yyyy)
           
          console.log("apiData*****",apiData)
    
          if (this.formattedDate) {
            this.downloadreportsData = apiData.reportData[0];
            this.state = this.downloadreportsData.agencyDetails.state_name;
            this.district = this.downloadreportsData.agencyDetails.district_name;
    
            if (this.downloadreportsData.total_plant_observed) {
              this.downloadreportsData.percentage_true_plant = ((this.downloadreportsData.true_plant / this.downloadreportsData.total_plant_observed) * 100).toFixed(2);
            } else {
              this.downloadreportsData.percentage_true_plant = 'NA';
            } 
    
            this.moniteringData = apiData.monitoringTeamData;
            console.log("this.moniteringData", this.moniteringData);
            // Encrypting data
            const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id, isRemonitoring }), 'a-343%^5ds67fg%__%add').toString();
            this.encryptedData = encodeURIComponent(encryptedForm);
            res.encryptedDataId = this.encryptedData;
    
            // Add encrypted data ID to the object directly
            this.downloadreportsData.encryptedDataId = res.encryptedDataId;
    
            // Now generate the URL with the encrypted ID for the QR code
            const baseUrl = this.baseUrl // Replace with your base URL
            this.qrCodeUrl = `${baseUrl}inspection-report-bsp-v/${this.encryptedData}`;
            //console.log("hufhu",this.qrCodeUrl);
    
            // You can now use this.qrCodeUrl in your QR code component
        this.downloadPDF();
          }
        }
      });
    }

      downloadPDF() {
        const element = document.getElementById('yourPdfContentId');
        if (element) {
            const opt = {
                margin: [0, 1], // Adjust the top and bottom margins, and set equal left and right margins (10mm on both sides)
                filename: 'bsp5Report.pdf',
                image: { type: 'jpeg', quality: 0.5 },
                html2canvas: {
                    scale: 4, // Increase scale for better resolution
                    useCORS: true, // Ensure images from other domains are included
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a3', // Use 'a4' or 'a3' based on your needs
                    orientation: 'landscape', // Landscape or portrait depending on your table size
                },
            };
    
            html2pdf().from(element).set(opt).save();
        }
    }
  


}
