

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';

@Component({
  selector: 'app-bsp-proforma-one-report-qr',
  templateUrl: './bsp-proforma-one-report-qr.component.html',
  styleUrls: ['./bsp-proforma-one-report-qr.component.css']
})
export class BspProformaOneReportQrComponent implements OnInit {
  decryptedPayload: any = null;
  reportData: any[] = [];
  secretKey = 'a-343%^5ds67fg%__%add'; // same key used in encryption
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private _productionService: ProductioncenterService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      samples: []
      if (params['data']) {
        try {
          // Step 1: Decode & Decrypt
          const encryptedData = decodeURIComponent(params['data']);
          const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
          const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
          this.decryptedPayload = JSON.parse(decryptedText);

          console.log('Decrypted Payload:', this.decryptedPayload);

          // Step 2: Fetch API Data
          this.fetchReportData(this.decryptedPayload);
        } catch (err) {
          console.error('Decryption failed:', err);
          this.isLoading = false;
        }
      } else {
        this.isLoading = false;
      }
    });
  }

  fetchReportData(payload: any) {
    const route = 'public-get-stl-report-status-data';
    const param = {
      search: {
        year: payload.year,
        season: payload.season,
        crop_code: payload.crop,
        variety_code: payload.variety
      }
    };

    this._productionService.postRequestCreator(route, param, null).subscribe({
      next: (res) => {
        if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
          this.reportData = res.EncryptedResponse.data || [];
        } else {
          this.reportData = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API error:', err);
        this.isLoading = false;
      }
    });
  }
}

