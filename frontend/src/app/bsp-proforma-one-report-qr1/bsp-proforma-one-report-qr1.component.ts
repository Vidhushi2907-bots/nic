import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';

@Component({
  selector: 'app-bsp-proforma-one-report-qr1',
  templateUrl: './bsp-proforma-one-report-qr1.component.html',
  styleUrls: ['./bsp-proforma-one-report-qr1.component.css']
})
export class BspProformaOneReportQr1Component implements OnInit {
  decryptedPayload: any = null;
  reportData: any[] = [];
   today: Date = new Date(); 
  isLoading = true;
  errorMessage = '';

  // Sub-header fields
  year = '';
  season = '';
  crop = '';
  variety = '';
  referenceNumber = '';
  todayDate: Date = new Date();

  secretKey = 'a-343%^5ds67fg%__%add'; // same key as PDF encryption

  constructor(
    private route: ActivatedRoute,
    private _productionService: ProductioncenterService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      if (params['data']) {
        try {
          //  Decrypt payload
          const encryptedData = decodeURIComponent(params['data']);
          const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
          const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
          this.decryptedPayload = JSON.parse(decryptedText);

          console.log('Decrypted Payload:', this.decryptedPayload);

          // Set sub-header fields
          this.year = this.decryptedPayload.year;
          this.season = this.decryptedPayload.season;
          this.crop = this.decryptedPayload.crop;
          this.variety = this.decryptedPayload.variety;
          this.referenceNumber = this.decryptedPayload.referenceNumber;
          this.todayDate = new Date(this.decryptedPayload.date);

          // Fetch exact data from backend
          await this.fetchReportData(this.decryptedPayload);

        } catch (err) {
          console.error('Decryption failed:', err);
          this.isLoading = false;
          this.errorMessage = 'Invalid QR data.';
        }
      } else {
        this.isLoading = false;
        this.errorMessage = 'No QR data found.';
      }
    });
  }

  async fetchReportData(payload: any) {
    try {
      const route = 'public-get-stl-report-status-data';

      const param = {
        search: {
          year: payload.year,
          season: payload.season,
          crop_code: payload.crop,
          variety_code: payload.variety,
          referenceNumber: payload.referenceNumber,
          user_id: payload.user_id   
        }
      };

      this._productionService.postRequestCreator(route, param, null).subscribe({
        next: (res) => {
          if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
            this.reportData = res.EncryptedResponse.data || [];
            if (!this.reportData.length) {
              this.errorMessage = 'No data available for this reference.';
            }
          } else {
            this.reportData = [];
            this.errorMessage = 'No data available for this reference.';
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('API error:', err);
          this.isLoading = false;
          this.errorMessage = 'Error fetching report data.';
        }
      });

    } catch (error) {
      console.error(error);
      this.isLoading = false;
      this.errorMessage = 'Unexpected error occurred.';
    }
  }
}
