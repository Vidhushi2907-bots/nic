import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { NumericDirective } from "./numeric.directive";
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { HeaderComponent } from './common/header/header.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { AddCropComponent } from './main-app/add-crop/add-crop.component';
import { MainAppModule } from './main-app/main-app.module';
import { MenuUiComponent } from './common/menu-ui/menu-ui.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDropdownModule, BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './common/footer/footer.component';
import { IcarService } from './services/icar/icar.service';
import { IndentorDynamicFieldComponent } from './common/indentor-dynamic-field/indentor-dynamic-field.component';
// import { AddCropSearchComponent } from './common/add-crop-search/add-crop-search.component';
// import { DynamicFieldsComponent } from './common/dynamic-fields/dynamic-fields.component';
import { NucleusSeedAvailabilityByBreederSearchComponent } from './common/nucleus-seed-availability-by-breeder-search/nucleus-seed-availability-by-breeder-search.component';
// import { AddCropSearchComponent } from './common/add-crop-search/add-crop-search.component';
import { AddSeedTestingLaboratorySearchComponent } from './common/add-seed-testing-laboratory-search/add-seed-testing-laboratory-search.component';
import { MaximumLotSizeSearchComponent } from './common/maximum-lot-size-search/maximum-lot-size-search.component';
// import { SeedDivisionComponent } from './common/seed-division/seed-division.component';
import { DynamicFieldsComponent } from './common/dynamic-fields/dynamic-fields.component';
import { LoginComponent } from './login/login.component';
import { SeednetLoginComponent } from './seednet-login/seednet-login.component';


import { SeedMultiplicationRatioUiFormComponent } from './common/seed-multiplication-ratio-ui-form/seed-multiplication-ratio-ui-form.component';
import { LoginHomeComponent } from './common/login-home/login-home.component';
import { WebLoginComponent } from './web-login/web-login.component';

import { IndentorDashboardComponent } from './indentor-dashboard/indentor-dashboard.component';
import { BreederDashboardComponent } from './breeder-dashboard/breeder-dashboard.component';
import { AddFreezeTimelineComponent } from './add-freeze-timeline/add-freeze-timeline.component';
import { AddFreezeTimelineFormComponent } from './add-freeze-timeline-form/add-freeze-timeline-form.component';
import { NodalDashboardComponent } from './nodal-dashboard/nodal-dashboard.component';
import { ProductionDashboardComponent } from './production-dashboard/production-dashboard.component';
import { BreederProductionDashboardComponent } from './breeder-production-dashboard/breeder-production-dashboard.component';
import { PaymentComponent } from './main-app/payment/payment.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxBarcodeModule } from 'ngx-barcode';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { IndentorSpaComponent } from './indentor-spa/indentor-spa.component';
import { IndentorSpaListComponent } from './indentor-spa-list/indentor-spa-list.component';
import { AllocationBreederSeedSpaComponent } from './main-app/allocation-breeder-seed-spa/allocation-breeder-seed-spa.component';
// import { ListOfIndentReportComponent } from './main-app/list-of-indent-report/list-of-indent-report.component';
import { NodalDasboadSecondComponent } from './nodal-dasboad-second/nodal-dasboad-second.component';
import { SeeddivisionindentwiseComponent } from './seeddivisionindentwise/seeddivisionindentwise.component';
import { SeeddivisonspawisereportComponent } from './seeddivisonspawisereport/seeddivisonspawisereport.component';
// import { BreederseedallocationseedsecondComponent } from './breederseedallocationseedsecond/breederseedallocationseedsecond.component';
import { BreederseedAllocationreportSecondComponent } from './breederseed-allocationreport-second/breederseed-allocationreport-second.component';
import { SeedDivisionReportsecondComponent } from './seed-division-reportsecond/seed-division-reportsecond.component';
// import { BspcWiseAssignCropComponent } from './bspc-wise-assign-crop/bspc-wise-assign-crop.component';
import { BspcWiseNucleusSeedComponent } from './bspc-wise-nucleus-seed/bspc-wise-nucleus-seed.component';
import { VarietyWiseNucleusSeedComponent } from './variety-wise-nucleus-seed/variety-wise-nucleus-seed.component';
import { CropWiseStatusComponent } from './crop-wise-status/crop-wise-status.component';
import { BspcWiseLiftingStatusComponent } from './bspc-wise-lifting-status/bspc-wise-lifting-status.component';
import { CropWiseAssignedComponent } from './crop-wise-assigned/crop-wise-assigned.component';
import { BspcWiseAssignCropComponent } from './bspc-wise-assign-crop/bspc-wise-assign-crop.component';
import { BspcassigncropComponent } from './bspcassigncrop/bspcassigncrop.component';
import { Bsp1repotComponent } from './bsp1repot/bsp1repot.component';
import { BsptworeportComponent } from './bsptworeport/bsptworeport.component';
import { BspthreereportsecondComponent } from './bspthreereportsecond/bspthreereportsecond.component';
import { AssignCropSecondComponent } from './assign-crop-second/assign-crop-second.component';
// import { BspTwoSecondtComponent } from './main-app/bsp-two-second/bsp-two-second';
// import { BspOneSecondComponent } from './bsp-one-second/bsp-one-second.component';
import { IntakeVerificationComponent } from './intake-verification/intake-verification.component';
import { UnfreezeIndentComponent } from './unfreeze-indent/unfreeze-indent.component';
import { Bsp2reportComponent } from './bsp2report/bsp2report.component';
import { SppDashboardSecondComponent } from './spp-dashboard-second/spp-dashboard-second.component';
import { TraceTagComponent } from './trace-tag/trace-tag.component';
import { QRCodeModule } from 'angularx-qrcode';
import { CarryOverSeedComponent } from './carry-over-seed/carry-over-seed.component';
import { BspFourComponent } from './bsp-four/bsp-four.component';
import { GenerateTagNumberComponent } from './generate-tag-number/generate-tag-number.component';
import { SeedProcesingPlantComponent } from './seed-procesing-plant/seed-procesing-plant.component';
import { ProcessedRegisterOldStockComponent } from './processed-register-old-stock/processed-register-old-stock.component';
 // import { NgxPrintModule } from 'ngx-print';
// import { SeedProcesingPlantComponent } from './seed-procesing-plant/seed-procesing-plant.component';
import { RequestInvoiceComponent } from './request-invoice/request-invoice.component';
import { LiftingOfBreederSeedComponent } from './lifting-of-breeder-seed/lifting-of-breeder-seed.component';
// import { BspFourReportComponent } from './bsp-four-report/bsp-four-report.component';
import { BspFourReportSecondComponent } from './bsp-four-report-second/bsp-four-report-second.component';
import { GenerateTagNumberQrComponent } from './generate-tag-number-qr/generate-tag-number-qr.component';
import { GenerateInvoiceQrComponent } from './generate-invoice-qr/generate-invoice-qr.component';
import { BreederSeedCertificateQrComponent } from './breeder-seed-certificate-qr/breeder-seed-certificate-qr.component';
import { BillReceiptQrComponent } from './bill-receipt-qr/bill-receipt-qr.component';
import { GenerateCardQrComponent } from './generate-card-qr/generate-card-qr.component';
import { MobileAppComponent } from './mobile-app/mobile-app.component';
import { TagNumberVerificationQrComponent } from './tag-number-verification-qr/tag-number-verification-qr.component';
import { PrnDownloadComponent } from './prn-download/prn-download.component';
// import { GenerateCardQrComponent } from './generate-card-qr/generate-card-qr.component';
// import { NgxPrintModule } from 'ngx-print';
import { TestPrinterComponent } from './test-printer/test-printer.component';
import { VarietyCharactersticReportsComponent } from './common/variety-characterstic-reports/variety-characterstic-reports.component';
import { VarietyCharactersticReportsViewFormComponent } from './common/variety-characterstic-reports-view-form/variety-characterstic-reports-view-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';
// import { DashbordComponent } from './dashbord/dashbord.component';

import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BspProformaOneReportQrComponent } from './bsp-proforma-one-report-qr/bsp-proforma-one-report-qr.component';
import { BspProformaOneReportQr1Component } from './bsp-proforma-one-report-qr1/bsp-proforma-one-report-qr1.component';

Chart.register(ChartDataLabels);


// import { NgChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    AppComponent,
    NumericDirective,
    AddCropComponent,
    // HeaderComponent,
    // SidebarComponent,
    // MenuUiComponent,
    // FooterComponent,
    LoginComponent,
    SeedMultiplicationRatioUiFormComponent,
    LoginHomeComponent,
    WebLoginComponent,
    IndentorDashboardComponent,
    BreederDashboardComponent,
    // AddFreezeTimelineComponent,

    NodalDashboardComponent,
    ProductionDashboardComponent,
    BreederProductionDashboardComponent,
    PaymentComponent,
    ChangePasswordComponent,
    IndentorSpaComponent,
    IndentorSpaListComponent,
    AllocationBreederSeedSpaComponent,
    NodalDasboadSecondComponent,
    // ListOfIndentReportComponent,
    SeeddivisionindentwiseComponent,
    SeeddivisonspawisereportComponent,
    // BreederseedallocationseedsecondComponent,
    BreederseedAllocationreportSecondComponent,

    // DynamicFieldsComponent
    // MaximumLotSizeSearchComponent,
    // SeedDivisionComponent,
    // AddCropSearchComponent,
    // AddSeedTestingLaboratorySearchComponent,
    // NucleusSeedAvailabilityByBreederSearchComponent,
    // LoginComponent,
    // TestComponent,
    SeednetLoginComponent,
    SeedDivisionReportsecondComponent,
    BspcWiseAssignCropComponent,
    // BspcWiseAssignCropComponent,
    // BspcWiseAssignCropC
    BspcWiseNucleusSeedComponent,
    VarietyWiseNucleusSeedComponent,
    CropWiseStatusComponent,
    BspcWiseLiftingStatusComponent,

    CropWiseAssignedComponent,
    BspcassigncropComponent,
    Bsp1repotComponent,
    BsptworeportComponent,
    BspthreereportsecondComponent,
    AssignCropSecondComponent,
    // BspTwoSecondtComponent,
    // BspOneSecondComponent,
    // SeedInventoryComponent,
    IntakeVerificationComponent,
    UnfreezeIndentComponent,
    Bsp2reportComponent,
    SppDashboardSecondComponent,
    TraceTagComponent,
    CarryOverSeedComponent,
    BspFourComponent,
    GenerateTagNumberComponent,
    SeedProcesingPlantComponent, 
    ProcessedRegisterOldStockComponent,
    RequestInvoiceComponent,
    LiftingOfBreederSeedComponent,
    // BspFourReportComponent,
    BspFourReportSecondComponent,
    GenerateTagNumberQrComponent,
    GenerateInvoiceQrComponent,
    BreederSeedCertificateQrComponent,
    GenerateCardQrComponent,
    BillReceiptQrComponent,
    MobileAppComponent,
    TagNumberVerificationQrComponent,
    PrnDownloadComponent,
    TestPrinterComponent,
    VarietyCharactersticReportsComponent,
    VarietyCharactersticReportsViewFormComponent,
    BspProformaOneReportQrComponent,
    BspProformaOneReportQr1Component,
    // GenerateCardQr
    // GenerateCardQrComponent
    // BspcWiseAssi
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    QRCodeModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MainAppModule,
    MatRadioModule,
    HttpClientJsonpModule,
    ModalModule,
    NgbModule,
    PdfViewerModule,
    NgxUiLoaderModule,
    // GenerateCardQrComponent,
    NgxBarcodeModule,
    NgChartsModule,

    NgMultiSelectDropDownModule,
    DashboardComponent,

    
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
    }),
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: environment.production,
    //   // Register the ServiceWorker as soon as the application is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerWhenStable:30000'
    // }),
    BsDropdownModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()

  ],
  providers: [BsDropdownConfig, IcarService],

  bootstrap: [AppComponent],
  // exports:[]

})

export class AppModule { }