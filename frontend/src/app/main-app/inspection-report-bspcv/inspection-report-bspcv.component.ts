import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { MasterService } from 'src/app/services/master/master.service';

@Component({
  selector: 'app-inspection-report-bspcv',
  templateUrl: './inspection-report-bspcv.component.html',
  styleUrls: ['./inspection-report-bspcv.component.css']
})
export class InspectionReportBspcvComponent implements OnInit {
 id: string | null = null;
  user_id: string | null = null;
  isRemonitoring: boolean | null = null;
  baseUrl: string = environment.ms_nb_01_master.baseUrl;
  decryptedData: any = {};
  encryptedData: string;
  formattedDate: string;
  downloadreportsData: any;
  district: any;
  state: any;
  moniteringTeam: any;
  moniteringData: any;
 
   constructor(private service: SeedServiceService, private master: MasterService, private elementRef: ElementRef, private formBuilder: FormBuilder, private _productionCenter: ProductioncenterService, private route: ActivatedRoute) {}

   ngOnInit(): void {
    // Subscribe to the route parameters to get the encrypted data
    this.route.params.subscribe(params => {
      const encryptedData = params['encryptedData'];  // Access the 'encryptedData' from the route params
      console.log("encryptedData is", encryptedData);
  
      try {
        // Decode the encrypted data from the URL
        const decodedEncryptedData = decodeURIComponent(encryptedData);
  
        // Decrypt the data using the provided key and AES
        const bytes = CryptoJS.AES.decrypt(decodedEncryptedData, 'a-343%^5ds67fg%__%add');
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  
        // Parse the decrypted string back to an object
        const decryptedData = JSON.parse(decryptedString);
        
        console.log("decryptedData is", decryptedData);
        this.id = decryptedData.id;
        this.isRemonitoring = decryptedData.isRemonitoring;
  
        // Optionally call a method to fetch the report data using the extracted parameters
      this.getReportData();
      } catch (error) {
        console.error("Error decrypting or parsing data:", error);
      }
    });
  }
  
  getReportData() {
    let route = "get-got-report-details-byid-Qr";
    let param = {
      "search": {
         "id": this.id,
      }
    };
  
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        const apiData = res.EncryptedResponse.data || [];
        const currentDate = new Date();
        this.formattedDate = currentDate.toLocaleDateString('en-GB'); // UK format (dd/mm/yyyy)
      //  console.log("this.moniteringData", this.formattedDate);
      //   if (this.formattedDate) {
          this.downloadreportsData = apiData.reportData[0];
console.log("jhjhj",this.downloadreportsData);
          this.state = this.downloadreportsData.agencyDetails.state_name;
          this.district = this.downloadreportsData.agencyDetails.district_name;

          this.moniteringTeam = this.downloadreportsData.agencyDetails.state_name;
          this.moniteringData = apiData.monitoringTeamData;
      
          
  
          if (this.downloadreportsData.total_plant_observed) {
            this.downloadreportsData.percentage_true_plant = ((this.downloadreportsData.true_plant / this.downloadreportsData.total_plant_observed) * 100).toFixed(2);
          } else {
            this.downloadreportsData.percentage_true_plant = 'NA';
          }
  }
      // }
    });
  }

}
