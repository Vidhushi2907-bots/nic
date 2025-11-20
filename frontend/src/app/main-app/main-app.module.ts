import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddCropNotifiedComponent } from './add-crop-notified/add-crop-notified.component';
import { MainAppRoutingModule } from './main-app-routing.module';

import { BreederSeedProductionCentreComponent } from './breeder-seed-production-centre/breeder-seed-production-centre.component';
import { AddFormNucleusSeedAvailabilityByBreederComponent } from './add-form-nucleus-seed-availability-by-breeder/add-form-nucleus-seed-availability-by-breeder.component';
import { BreederSeedSubmissionComponent } from './breeder-seed-submission/breeder-seed-submission.component';
import { DynamicFieldsComponent } from '../common/dynamic-fields/dynamic-fields.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IndentBreederSeedAllocationListComponent } from './indent-breeder-seed-allocation-list/indent-breeder-seed-allocation-list.component';
import { IndentBreederSeedAllocationSearchComponent } from '../common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

import { BspProformasSearchComponent } from '../common/bsp-proformas-search/bsp-proformas-search.component';

import { AddCropVarietyCharactersticsComponent } from './add-crop-variety-characterstics/add-crop-variety-characterstics.component';
import { AddIndentorComponent } from './add-indentor/add-indentor.component';
import { SeedMultipleRatioComponent } from './seed-multiple-ratio/seed-multiple-ratio.component';
import { SeedMultiplicationRatioListComponent } from './seed-multiplication-ratio-list/seed-multiplication-ratio-list.component';

import { MatTableModule } from '@angular/material/table';
import { AddBreederSeedsComponent } from './add-breeder-seeds/add-breeder-seeds.component';
import { PaginationUiComponent } from '../common/pagination-ui/pagination-ui.component';
import { IndentBreederSeedAllocationDraftComponent } from './indent-breeder-seed-allocation-draft/indent-breeder-seed-allocation-draft.component';
import { PerformaOfBreederSeedTagFormComponent } from './production-center/performa-of-breeder-seed-tag/performa-of-breeder-seed-tag-form/performa-of-breeder-seed-tag-form.component';
import { PerformaOfBreederSeedTagListComponent } from './production-center/performa-of-breeder-seed-tag/performa-of-breeder-seed-tag-list/performa-of-breeder-seed-tag-list.component';
import { AllocationSeedProductionComponent } from './allocation-seed-production/allocation-seed-production.component';
import { AllocationSeedProductionNodalAgencyListComponent } from './allocation-seed-production-nodal-agency-list/allocation-seed-production-nodal-agency-list.component';
import { AllocationSeedProductionDraftComponent } from './allocation-seed-production-draft/allocation-seed-production-draft.component';
import { AddCropListComponent } from './add-crop-list/add-crop-list.component';
import { AddCropNotifiedListComponent } from './add-crop-notified-list/add-crop-notified-list.component';

import { IcarService } from '../services/icar/icar.service';
import { NucleusSeedAvailabiltiltyFormComponent } from './production-center/nucleus-seed-availability-by-breeder/nucleus-seed-availabiltilty-form/nucleus-seed-availabiltilty-form.component';
import { NucleusSeedAvailabiltiltyListComponent } from './production-center/nucleus-seed-availability-by-breeder/nucleus-seed-availabiltilty-list/nucleus-seed-availabiltilty-list.component';
import { NucleusSeedAvailabilityByBreederSearchComponent } from '../common/nucleus-seed-availability-by-breeder-search/nucleus-seed-availability-by-breeder-search.component';
import { AddCropSearchComponent } from '../common/add-crop-search/add-crop-search.component';
import { AddCropCharactersticsListComponent } from './add-crop-characterstics-list/add-crop-characterstics-list.component';
import { AddIndentorListComponent } from './add-indentor-list/add-indentor-list.component';
import { AddSeedTestingLaboratorySearchComponent } from '../common/add-seed-testing-laboratory-search/add-seed-testing-laboratory-search.component';
import { AddSeedTestingLaboratoryComponent } from './add-seed-testing-laboratory/add-seed-testing-laboratory.component';
import { AddSeedTestingLaboratoryListComponent } from './add-seed-testing-laboratory-list/add-seed-testing-laboratory-list.component';
import { MaximumLotSizeListComponent } from './maximum-lot-size-list/maximum-lot-size-list.component';
import { MaximumLotSizeComponent } from './maximum-lot-size/maximum-lot-size.component';
import { MaximumLotSizeSearchComponent } from '../common/maximum-lot-size-search/maximum-lot-size-search.component';
import { AddCropVerietyListComponent } from './seed-division/add-crop-veriety/add-crop-veriety-list/add-crop-veriety-list.component';
import { SeedDivisionComponent } from '../common/seed-division/seed-division.component';
import { AddBreederComponent } from './add-breeder/add-breeder.component';
import { AddBreederListComponent } from './add-breeder-list/add-breeder-list.component';
import { SubmitIndentsBreederSeedsComponent } from './submit-indents-breeder-seeds/submit-indents-breeder-seeds.component';
import { AddBreederCropComponent } from './add-breeder-crop/add-breeder-crop.component';
import { AddBreederProductionCenterComponent } from './add-breeder-production-center/add-breeder-production-center.component';
import { AddBreederProductionListComponent } from './add-breeder-production-list/add-breeder-production-list.component';
import { AddBreederCropListComponent } from './add-breeder-crop-list/add-breeder-crop-list.component';
import { ProformasIListComponent } from './bsp-proformas/proformas-one/proformas-i-list/proformas-i-list.component';
import { ProformasIFormComponent } from './bsp-proformas/proformas-one/proformas-i-form/proformas-i-form.component';
import { ProformasIiFormComponent } from './bsp-proformas/proformas-two/proformas-ii-form/proformas-ii-form.component';
import { ProformasIiListComponent } from './bsp-proformas/proformas-two/proformas-ii-list/proformas-ii-list.component';
import { ProformasIiiListComponent } from './bsp-proformas/proformas-three/proformas-iii-list/proformas-iii-list.component';
import { ProformasIiiFormComponent } from './bsp-proformas/proformas-three/proformas-iii-form/proformas-iii-form.component';
import { ProformasIvFormComponent } from './bsp-proformas/proformas-four/proformas-iv-form/proformas-iv-form.component';
import { ProformasIvListComponent } from './bsp-proformas/proformas-four/proformas-iv-list/proformas-iv-list.component';
import { SeedMultiplicationRatioFormComponentComponent } from './seed-multiplication-ratio-form-component/seed-multiplication-ratio-form-component.component';
import { LotNumberComponent } from './production-center/lot-number/lot-number/lot-number.component';
import { LotNumberListComponent } from './production-center/lot-number/lot-number-list/lot-number-list.component';
import { SeedTestingLabaratoryFormComponent } from './seed-testing-labaratory-form/seed-testing-labaratory-form.component';
import { ProformasVListComponent } from './bsp-proformas/proformas-five/proformas-v-list/proformas-v-list.component';
import { ProformasVFormComponent } from './bsp-proformas/proformas-five/proformas-v-form/proformas-v-form.component';
import { ProformasVbListComponent } from './bsp-proformas/proformas-five/proformas-vb-list/proformas-vb-list.component';
import { ProformasVbFormComponent } from './bsp-proformas/proformas-five/proformas-vb-form/proformas-vb-form.component';
import { BreederSeedCertificateComponent } from './breeder-seed-certificate/breeder-seed-certificate.component';
import { SeedTestingLabaratoryListComponent } from './seed-testing-labaratory-list/seed-testing-labaratory-list.component';
import { CreationOfLabelNumberBreederComponent } from './creation-of-label-number-breeder/creation-of-label-number-breeder.component';
import { PerformaOfBreederSeedTagComponent } from './performa-of-breeder-seed-tag/performa-of-breeder-seed-tag.component';
import { AllocationBreederSeedIndentorLiftingListComponent } from './seed-division/allocation-breeder-seed-indentor-lifting-list/allocation-breeder-seed-indentor-lifting-list.component';
import { AllocationBreederSeedIndentorLiftingFormComponent } from './seed-division/allocation-breeder-seed-indentor-lifting-form/allocation-breeder-seed-indentor-lifting-form.component';
import { CreationOfLabelNumberBreederListComponent } from './creation-of-label-number-breeder-list/creation-of-label-number-breeder-list.component';
import { ProformasViListComponent } from './seed-division/proforma-six/proformas-vi-list/proformas-vi-list.component';
import { ProformasViFormComponent } from './seed-division/proforma-six/proformas-vi-form/proformas-vi-form.component';
import { GenerationOfBreederOfCertificatComponent } from './generation-of-breeder-of-certificat/generation-of-breeder-of-certificat.component';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NodalOfficerReportComponent } from './nodal-officer-report/nodal-officer-report.component';
import { SeedMultiplicationRatioReportComponent } from './seed-multiplication-ratio-report/seed-multiplication-ratio-report.component';
import { AllocationOfBreederSeedsToIndentorsForLiftingReportComponent } from './allocation-of-breeder-seeds-to-indentors-for-lifting-report/allocation-of-breeder-seeds-to-indentors-for-lifting-report.component';
import { MaximumLotSizeForEachCropReportComponent } from './maximum-lot-size-for-each-crop-report/maximum-lot-size-for-each-crop-report.component';
import { SeedTestingLaboratoryReportComponent } from './seed-testing-laboratory-report/seed-testing-laboratory-report.component';
import { ListOfBreederSeedProductionCenterReportComponent } from './list-of-breeder-seed-production-center-report/list-of-breeder-seed-production-center-report.component';
import { NucleusSeedAvailabilityReportComponent } from './nucleus-seed-availability-report/nucleus-seed-availability-report.component';
import { ListOfBreedersReportComponent } from './list-of-breeders-report/list-of-breeders-report.component';
// import { UtilizationOfBreederSeedReportComponent } from './lifting/utilization-of-breeder-seed-report/utilization-of-breeder-seed-report.component';
import { LiftingUtilizationOfBreederSeedReportComponent } from './lifting-utilization-of-breeder-seed-report/lifting-utilization-of-breeder-seed-report.component';
import { BspOneReportComponent } from './bsp-one-report/bsp-one-report.component';
import { BspTwoReportComponent } from './bsp-two-report/bsp-two-report.component';
import { BspThreeReportComponent } from './bsp-three-report/bsp-three-report.component';
import { BspFourReportComponent } from './bsp-four-report/bsp-four-report.component';
import { BspFiveAReportComponent } from './bsp-five-a-report/bsp-five-a-report.component';
import { BspFiveBReportComponent } from './bsp-five-b-report/bsp-five-b-report.component';
import { BspSixReportComponent } from './bsp-six-report/bsp-six-report.component';
import { SumPipeModule } from './pipe/sum.pipe';
import { HeaderComponent } from '../common/header/header.component';
import { SidebarComponent } from '../common/sidebar/sidebar.component';
import { SidebarIconComponent } from '../common/sidebar-icon/sidebar-icon.component';
import { FooterComponent } from '../common/footer/footer.component';
import { MainAppComponent } from './main-app.component';
import { MenuUiComponent } from '../common/menu-ui/menu-ui.component';
import { MenuIconUiComponent } from '../common/menu-icon-ui/menu-icon-ui.component';
import { ListOfIndentorsReportComponent } from './list-of-indentors-report/list-of-indentors-report.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { DashboardseedComponent } from './dashboardseed/dashboardseed.component';
// import { HighchartsChartModule } from 'highcharts-angular';
import { NewReportComponent } from './new-report/new-report.component';
import { AddFreezeTimelineFormComponent } from '../add-freeze-timeline-form/add-freeze-timeline-form.component';
import { AddFreezeTimelineComponent } from '../add-freeze-timeline/add-freeze-timeline.component';

import { AddPlantComponent } from './add-plant/add-plant.component';
import { AddPlantListComponent } from './add-plant-list/add-plant-list.component';
import { BillGenerateFormComponent } from './bills/bill-generate-form/bill-generate-form.component';
import { BillGenerateListComponent } from './bills/bill-generate-list/bill-generate-list.component';
import { SelectionOfSpaForSubmissionIndentComponent } from './selection-of-spa-for-submission-indent/selection-of-spa-for-submission-indent.component';
import { ViewSelectionOfSpaForSubmissionIndentComponent } from './view-selection-of-spa-for-submission-indent/view-selection-of-spa-for-submission-indent.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

import { ReportDownloadComponent } from './report-download/report-download.component';
import { ProjectCoordinatorReportComponent } from './project-coordinator-report/project-coordinator-report.component';
import { PlantDetailReportComponent } from './plant-detail-report/plant-detail-report.component';
import { SubmissionOfIndentOfBreederSeedByStateReportComponent } from './submission-of-indent-of-breeder-seed-by-state-report/submission-of-indent-of-breeder-seed-by-state-report.component';
import { ProductionCenterWiseDetailsReportComponent } from './production-center-wise-details-report/production-center-wise-details-report.component';
import { AllocationOfBreederSeedsComponent } from './allocation-of-breeder-seeds/allocation-of-breeder-seeds.component';
import { AllocationBreederSpaListComponent } from './indenters/allocation-breeder-spa-list/allocation-breeder-spa-list.component';
import { AllocationBreederSpaFormsComponent } from './indenters/allocation-breeder-spa-forms/allocation-breeder-spa-forms.component';
import { AddCropReportComponent } from './add-crop-report/add-crop-report.component';
import { AddCropVarietyReportComponent } from './add-crop-variety-report/add-crop-variety-report.component';
import { SubmissionForIndentsOfBreederSeedReportComponent } from './submission-for-indents-of-breeder-seed-report/submission-for-indents-of-breeder-seed-report.component';
import { CropVarietyCharactersticReoprtComponent } from './crop-variety-characterstic-reoprt/crop-variety-characterstic-reoprt.component';
// import { VarietyReportListViewComponent } from './variety-report-list-view/variety-report-list-view.component';

import { CardComponent } from './card/card.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxBarcodeModule } from 'ngx-barcode';


// import { HighchartsChartModule } from 'node_mod/highcharts-angular/highcharts-angular';
// import { HighchartsChartModule } from 'node_mod/highcharts-angular/public_api';

// import { FilterPipe } from './pipe/filter.pipe';

// import { IndenterReportComponent } from './indenter-report/indenter-report.component';


import { MatButtonToggleModule } from
  '@angular/material/button-toggle';
import { MatDatepickerModule } from
  '@angular/material/datepicker';
import { MatInputModule } from
  '@angular/material/input';
import { MatFormFieldModule } from
  '@angular/material/form-field';
import { MatNativeDateModule } from
  '@angular/material/core';
import { StatusOfLiftingNonLiftingSupplyPositionForCropsComponent } from './status-of-lifting-non-lifting-supply-position-for-crops/status-of-lifting-non-lifting-supply-position-for-crops.component';
import { SpaLiftingComponent } from './spa-lifting/spa-lifting.component';
import { SpaLiftingListComponent } from './spa-lifting-list/spa-lifting-list.component';
import { SubmitIndentBreederCropWiseComponent } from './submit-indent-breeder-crop-wise/submit-indent-breeder-crop-wise.component';
import { SpaAllocationReportComponent } from './spa-allocation-report/spa-allocation-report.component';

// import { SubmitIndentSpaWiseComponent } from './submit-indent-spa-wise/submit-indent-spa-wise.component';
import { AllocatedQuantitySeedDivisionLiftingComponent } from './allocated-quantity-seed-division-lifting/allocated-quantity-seed-division-lifting.component';
import { SpaWiseStatusLiftingNonOfBreederSeedComponent } from './spa-wise-status-lifting-non-of-breeder-seed/spa-wise-status-lifting-non-of-breeder-seed.component';
import { ListOfIndentReportComponent } from './list-of-indent-report/list-of-indent-report.component';
import { IndentBreederSeedSpaWiseReportComponent } from './indent-breeder-seed-spa-wise-report/indent-breeder-seed-spa-wise-report.component';
// import { SubmitIndentSpaWiseComponent } from './submit-indent-spa-wise/submit-indent-spa-wise.component';
import { StatusOfLiftingNonLiftingOfBreederSeedCropWiseReportComponent } from './status-of-lifting-non-lifting-of-breeder-seed-crop-wise-report/status-of-lifting-non-lifting-of-breeder-seed-crop-wise-report.component';
import { AllocationBreederSeedSpaListComponent } from './allocation-breeder-seed-spa-list/allocation-breeder-seed-spa-list.component';
import { AssignedCropVarietyReportComponent } from './assigned-crop-variety-report/assigned-crop-variety-report.component';
import { CreatedLotNumbersReportComponent } from './created-lot-numbers-report/created-lot-numbers-report.component';
import { BillPaymentCertificateReportComponent } from './bill-payment-certificate-report/bill-payment-certificate-report.component';
import { SeedTestingLaboratoryResultsReportsComponent } from './seed-testing-laboratory-results-reports/seed-testing-laboratory-results-reports.component';
import { ProductionDashboardSecondComponent } from './dashboard/production-dashboard-second/production-dashboard-second.component';
import { GeneratedLabelNumbersComponent } from './generated-label-numbers/generated-label-numbers.component';
import { BreederSeedInventoryComponent } from './bspc-forms/breeder-seed-inventory/breeder-seed-inventory.component';
import { BreederSeedWillingToProduceComponent } from './bspc-forms/breeder-seed-willing-to-produce/breeder-seed-willing-to-produce.component';
// import { BspTwoSecondtComponent } from './bsp-two-second/bsp-two-second';
import { BspProfarmaOneFormComponent } from './breeder-form/bsp-profarma-one-form/bsp-profarma-one-form.component';
import { BspProformaOneFormNextComponent } from './breeder-form/bsp-proforma-one-form-next/bsp-proforma-one-form-next.component';
import { BspcInspectionMonitoringTeamComponent } from './bspc-forms/bspc-inspection-monitoring-team/bspc-inspection-monitoring-team.component';
import { HarvestingIntakeRegisterComponent } from './harvesting-intake-register/harvesting-intake-register.component';
import { BspProformaThreeComponent } from './bsp-proforma-three/bsp-proforma-three.component';
import { DirectIndentComponent } from './direct-indent/direct-indent.component';
import { SeedInventoryComponent } from '../seed-inventory/seed-inventory.component';
import { GenerateSampleSlipComponent } from './generate-sample-slip/generate-sample-slip.component';
import { ProcessedSeedRegisterComponent } from './processed-seed-register/processed-seed-register.component';
import { BspOneSecondComponent } from '../bsp-one-second/bsp-one-second.component';
import { BspThirdComponent } from './bsp-third/bsp-third.component';
import { CompositionOfMonitoringTeamComponent } from './breeder-form/composition-of-monitoring-team/composition-of-monitoring-team.component';
import { BspThirdReportComponent } from './bsp-third-report/bsp-third-report.component';
import { InspectionReportComponent } from './inspection-report/inspection-report.component';
import { BspTwoSecondReportComponent } from './bsp-two-second-report/bsp-two-second-report.component';
import { BspProformaOneReportQrComponent } from './breeder-form/bsp-proforma-one-report-qr/bsp-proforma-one-report-qr.component';
import { CompositionOfMonitoringTeamDirectDetailsComponent } from './breeder-form/composition-of-monitoring-team-direct-details/composition-of-monitoring-team-direct-details.component';
import { RecievedIndentReportComponent } from './recieved-indent-report/recieved-indent-report.component';
import { GenerateSamplesForTestingComponent } from './generate-samples-for-testing/generate-samples-for-testing.component';
import { AvailabilityOfBreederseedComponent } from './availability-of-breederseed/availability-of-breederseed.component';
import { ReprintTagComponent } from './reprint-tag/reprint-tag.component';
import { ApprovalForReprintTagsComponent } from './approval-for-reprint-tags/approval-for-reprint-tags.component';
import { VarietyPriceListComponent } from './variety-price-list/variety-price-list.component';
import { GenerateInvoiceComponent } from './generate-invoice/generate-invoice.component';
import { PrintBillComponent } from './view/print-bill/print-bill.component';
import { BillReceiptComponent } from './bill-receipt/bill-receipt.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { SampleSlipComponent } from './sample-slip/sample-slip.component';
import { ForwardingLetterComponent } from './forwarding-letter/forwarding-letter.component';
import { StlReportStatusComponent } from './stl-report-status/stl-report-status.component';
import { GenerateBreederSeedCertificateComponent } from './generate-breeder-seed-certificate/generate-breeder-seed-certificate.component';
import { BreederSeedCertificateDownloadComponent } from './breeder-seed-certificate-download/breeder-seed-certificate-download.component';
import { GenerateForwardingLetterForLabTestingComponent } from './generate-forwarding-letter-for-lab-testing/generate-forwarding-letter-for-lab-testing.component';
import { CustomDatePipe2 } from '../date-pipe';
import { LiftingComponent } from './lifting/lifting.component';
import { VarietyCharactersticReportsComponent } from './reports/variety-characterstic-reports/variety-characterstic-reports.component';
import { VarietyCharactersticViewFormComponent } from './reports/variety-characterstic-view-form/variety-characterstic-view-form.component';
import { GInvoiceTestComponent } from './g-invoice-test/g-invoice-test.component';
import { ChatSupportComponent } from './chat-support/chat-support.component';
import { GrowOutTestSampleReceptionComponent } from './grow-out-test-sample-reception/grow-out-test-sample-reception.component';
import { SowingDetailsComponent } from './sowing-details/sowing-details.component';
import { BspIiStatusReportComponent } from './bsp-ii-status-report/bsp-ii-status-report.component';
import { BspIIIStatusReportComponent } from './bsp-iii-status-report/bsp-iii-status-report.component';
import { InabilityReallocateFormComponent } from './inability-reallocate-form/inability-reallocate-form.component';
import { BspIStatusReportComponent } from './bsp-i-status-report/bsp-i-status-report.component';
import { GotMonitoringTeamDetailsComponent } from './got-monitoring-team-details/got-monitoring-team-details.component';
import { BspTwoSecondtComponent } from './bsp-two-second/bsp-two-second';

import { GrowOutTestReportBspvComponent } from './grow-out-test-report-bspv/grow-out-test-report-bspv.component';
import { CropStatusReportComponent } from './crop-status-report/crop-status-report.component';
import { SelfSurplusLiftingComponent } from './self-surplus-lifting/self-surplus-lifting.component';
import { InspectionReportBspcvComponent } from './inspection-report-bspcv/inspection-report-bspcv.component';
import { Bspc5TestResultReportComponent } from './bspc5-test-result-report/bspc5-test-result-report.component';
import { DirectLiftingComponent } from './direct-lifting/direct-lifting.component';
import { IntakeVerificationRegReportComponent } from './reports/intake-verification-reg-report/intake-verification-reg-report.component';
import { DiscardLotComponent } from './discard-lot/discard-lot.component';
import { OilsedLoginModuleComponent } from './oilsed-login-module/oilsed-login-module.component';
import { NationalSelfLiftingComponent } from './national-self-lifting/national-self-lifting.component';
import { ModifyBagSizeComponent } from './production-center-phase-2/modify-bag-size/modify-bag-size.component';
import { DashboardPhaseSecondComponent } from './dashboard-phase-second/dashboard-phase-second.component';
import { DashboardComponent } from "../dashboard/dashboard.component";
// import { GenerateCardQrComponent } from '../generate-card-qr/generate-card-qr.component';
// import { BillReceiptQrComponent } from '../bill-receipt-qr/bill-receipt-qr.component';
// import { BreederSeedCertificateQrComponent } from '../breeder-seed-certificate-qr/breeder-seed-certificate-qr.component';

// import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// import { UnfreezeIndentComponent } from './unfreeze-indent/unfreeze-indent.component';
import { CropGroupDetailComponent } from './crop-group-detail/crop-group-detail.component';
import { StateWiseCropStatisticsComponent } from './state-wise-crop-statistics/state-wise-crop-statistics.component';
import { CropWiseStatisticsComponent } from './crop-wise-statistics/crop-wise-statistics.component';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { VarietyReportListComponent } from './variety-report-list/variety-report-list.component';
import { SelfSurplusIndentComponent } from './self-surplus-indent/self-surplus-indent.component';
import { PulsesseedLoginModuleComponent } from './pulsesseed-login-module/pulsesseed-login-module.component';
import { VarietyReportListViewComponent } from './variety-report-list-view/variety-report-list-view.component';
// import { SeedTestingLabReportComponent } from './seed-testing-lab-report/seed-testing-lab-report.component';
import { SeedReport1Component } from './seed-report1/seed-report1.component';
import { SeedReport2Component } from './seed-report2/seed-report2.component';
import { ProfarmaOneQrComponent } from './profarma-one-qr/profarma-one-qr.component';
import { SeedRollingPlaningCropWiseComponent } from './seed-rolling-planing/indentor-login/seed-rolling-planing-crop-wise/seed-rolling-planing-crop-wise.component';
import { SeedRollingPlaningVarietyWiseComponent } from './seed-rolling-planing/indentor-login/seed-rolling-planing-variety-wise/seed-rolling-planing-variety-wise.component';
import { StateLoginReplanningComponent } from './state-login-replanning/state-login-replanning.component';



@NgModule({
  declarations: [
    VarietyReportListViewComponent,
    MenuUiComponent,
    MainAppComponent,
    HeaderComponent,
    CustomDatePipe2,
    SidebarComponent,
    SidebarIconComponent,
    MenuIconUiComponent,
    FooterComponent,
    AddCropNotifiedComponent,
    BreederSeedProductionCentreComponent,
    AddFormNucleusSeedAvailabilityByBreederComponent,
    BreederSeedSubmissionComponent,
    // DynamicFieldsComponent,
    IndentBreederSeedAllocationListComponent,
    IndentBreederSeedAllocationSearchComponent,
    BspProformasSearchComponent,
    AddSeedTestingLaboratorySearchComponent,
    AddCropVarietyCharactersticsComponent,
    AddIndentorComponent,
    SeedMultipleRatioComponent,
    SeedMultiplicationRatioListComponent,
    AddBreederSeedsComponent,
    PaginationUiComponent,
    IndentBreederSeedAllocationDraftComponent,
    PerformaOfBreederSeedTagFormComponent,
    PerformaOfBreederSeedTagListComponent,
    AllocationSeedProductionComponent,
    AllocationSeedProductionNodalAgencyListComponent,
    AllocationSeedProductionDraftComponent,
    AddCropListComponent,
    AddCropNotifiedListComponent,
    NucleusSeedAvailabiltiltyFormComponent,
    NucleusSeedAvailabiltiltyListComponent,
    AddCropSearchComponent,
    AddCropCharactersticsListComponent,
    AddIndentorListComponent,
    // AllocationBreederSeedsComponent
    NucleusSeedAvailabilityByBreederSearchComponent,
    AddSeedTestingLaboratoryComponent,
    AddSeedTestingLaboratoryListComponent,
    MaximumLotSizeListComponent,
    MaximumLotSizeComponent,
    MaximumLotSizeSearchComponent,
    DynamicFieldsComponent,
    SeedDivisionComponent,
    AddBreederComponent,
    AddBreederListComponent,
    SubmitIndentsBreederSeedsComponent,
    AddBreederCropComponent,
    AddBreederProductionCenterComponent,
    AddBreederProductionListComponent,
    AddBreederCropListComponent,
    ProformasIListComponent,
    ProformasIFormComponent,
    ProformasIiFormComponent,
    ProformasIiListComponent,
    ProformasIiiListComponent,
    ProformasIiiFormComponent,
    ProformasIvFormComponent,
    ProformasIvListComponent,
    SeedMultiplicationRatioFormComponentComponent,
    LotNumberComponent,
    LotNumberListComponent,
    SeedTestingLabaratoryFormComponent,
    SeedTestingLabaratoryListComponent,
    ProformasVListComponent,
    ProformasVFormComponent,
    ProformasVbListComponent,
    ProformasVbFormComponent,
    BreederSeedCertificateComponent,
    AddFreezeTimelineFormComponent,
    CreationOfLabelNumberBreederComponent,
    PerformaOfBreederSeedTagComponent,
    AllocationBreederSeedIndentorLiftingListComponent,
    AllocationBreederSeedIndentorLiftingFormComponent,
    CreationOfLabelNumberBreederListComponent,
    ProformasViListComponent,
    ProformasViFormComponent,
    GenerationOfBreederOfCertificatComponent,
    NodalOfficerReportComponent,
    SeedMultiplicationRatioReportComponent,
    AllocationOfBreederSeedsToIndentorsForLiftingReportComponent,
    MaximumLotSizeForEachCropReportComponent,
    SeedTestingLaboratoryReportComponent,
    ListOfBreederSeedProductionCenterReportComponent,
    NucleusSeedAvailabilityReportComponent,
    ListOfBreedersReportComponent,
    // UtilizationOfBreederSeedReportComponent,
    LiftingUtilizationOfBreederSeedReportComponent,
    BspOneReportComponent,
    BspTwoReportComponent,
    BspThreeReportComponent,
    BspFourReportComponent,
    BspFiveAReportComponent,
    BspFiveBReportComponent,
    BspSixReportComponent,
    ListOfIndentorsReportComponent,
    DashboardseedComponent,
    NewReportComponent,
    AddFreezeTimelineComponent,
    AddPlantComponent,
    AddPlantListComponent,
    BillGenerateFormComponent,
    BillGenerateListComponent,
    SelectionOfSpaForSubmissionIndentComponent,
    ViewSelectionOfSpaForSubmissionIndentComponent,
    EditProfileComponent,
    ReportDownloadComponent,
    ProjectCoordinatorReportComponent,
    PlantDetailReportComponent,
    SubmissionOfIndentOfBreederSeedByStateReportComponent,
    ProductionCenterWiseDetailsReportComponent,
    AllocationOfBreederSeedsComponent,
    AllocationBreederSpaListComponent,
    AllocationBreederSpaFormsComponent,
    AddCropReportComponent,
    AddCropVarietyReportComponent,
    SubmissionForIndentsOfBreederSeedReportComponent,
    CropVarietyCharactersticReoprtComponent,
    CardComponent,
    StatusOfLiftingNonLiftingSupplyPositionForCropsComponent,
    SpaLiftingComponent,
    SpaLiftingListComponent,
    SubmitIndentBreederCropWiseComponent,
    // SubmitIndentSpaWiseComponent,
    // SubmitIndentSpaWiseComponent,
    AllocatedQuantitySeedDivisionLiftingComponent,
    SpaWiseStatusLiftingNonOfBreederSeedComponent,
    ListOfIndentReportComponent,
    IndentBreederSeedSpaWiseReportComponent,
    StatusOfLiftingNonLiftingOfBreederSeedCropWiseReportComponent,
    AllocationBreederSeedSpaListComponent,
    SpaAllocationReportComponent,
    AssignedCropVarietyReportComponent,
    CreatedLotNumbersReportComponent,
    BillPaymentCertificateReportComponent,
    SeedTestingLaboratoryResultsReportsComponent,
    ProductionDashboardSecondComponent,
    GeneratedLabelNumbersComponent,
    BreederSeedInventoryComponent,
    BreederSeedWillingToProduceComponent,
    // BspTwoSecondtComponent
    BspProfarmaOneFormComponent,
    BspProformaOneFormNextComponent,
    BspcInspectionMonitoringTeamComponent,
    HarvestingIntakeRegisterComponent,
    BspProformaThreeComponent,
    DirectIndentComponent,
    SeedInventoryComponent,
    GenerateSampleSlipComponent,
    ProcessedSeedRegisterComponent,
    BspOneSecondComponent,
    BspThirdComponent,
    CompositionOfMonitoringTeamComponent,
    BspThirdReportComponent,
    InspectionReportComponent,
    BspTwoSecondReportComponent,
    BspProformaOneReportQrComponent,
    CompositionOfMonitoringTeamDirectDetailsComponent,
    RecievedIndentReportComponent,
    GenerateSamplesForTestingComponent,
    AvailabilityOfBreederseedComponent,
    ReprintTagComponent,
    ApprovalForReprintTagsComponent,
    VarietyPriceListComponent,
    GenerateInvoiceComponent,
    PrintBillComponent,
    BillReceiptComponent,
    InvoiceComponent,
    SampleSlipComponent,
    ForwardingLetterComponent,
    StlReportStatusComponent,
    GenerateBreederSeedCertificateComponent,
    BreederSeedCertificateDownloadComponent,
    GenerateForwardingLetterForLabTestingComponent,
    LiftingComponent,
    VarietyCharactersticReportsComponent,
    VarietyCharactersticViewFormComponent,
    GInvoiceTestComponent,
    ChatSupportComponent,
    GrowOutTestSampleReceptionComponent,
    SowingDetailsComponent,
    BspTwoSecondtComponent,
    BspIiStatusReportComponent,
    BspIIIStatusReportComponent,
    InabilityReallocateFormComponent,
    BspIStatusReportComponent,
    GotMonitoringTeamDetailsComponent,
    GrowOutTestReportBspvComponent,
    CropStatusReportComponent,
    SelfSurplusLiftingComponent,
    InspectionReportBspcvComponent,
    Bspc5TestResultReportComponent,
    DirectLiftingComponent,
    IntakeVerificationRegReportComponent,
    DiscardLotComponent,
    OilsedLoginModuleComponent,
    NationalSelfLiftingComponent,
    ModifyBagSizeComponent,
    CropGroupDetailComponent,
    StateWiseCropStatisticsComponent,
    CropWiseStatisticsComponent,
    ReportDashboardComponent,
    VarietyReportListComponent,
    SelfSurplusIndentComponent,
    PulsesseedLoginModuleComponent,
    VarietyReportListViewComponent,
    SeedReport1Component,
    SeedReport2Component,
    ProfarmaOneQrComponent,
    SeedRollingPlaningCropWiseComponent,
    SeedRollingPlaningVarietyWiseComponent,
    StateLoginReplanningComponent
    // GenerateCardQrComponent
    // UnfreezeIndentComponent
    // IndenterReportComponent,
    // BillReceiptQrComponent,
    // BreederSeedCertificateQrComponent
  ],
  imports: [
    // NgSelectModule,
    CommonModule,
    // BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    HttpClientModule,
    MainAppRoutingModule,
    // MatRadioModule,
    MatTableModule,
    NgMultiSelectDropDownModule,
    QRCodeModule,
    BsDropdownModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    ModalModule.forRoot(),
    NgbModule,
    SumPipeModule,
    AngularMyDatePickerModule,
    PdfViewerModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    NgxBarcodeModule,
    DashboardComponent,
    DashboardPhaseSecondComponent,
  ],
  providers: [HttpClientModule, IcarService, DatePipe, SumPipeModule],
  exports: [DynamicFieldsComponent, PaginationUiComponent, SidebarComponent, BspTwoSecondtComponent,
    HeaderComponent, SumPipeModule, AngularMyDatePickerModule, BspThirdComponent,
    FooterComponent, SidebarIconComponent, MenuIconUiComponent,
    // GenerateCardQrComponent
    // GenerateCardQrComponent

  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],


})
export class MainAppModule { }
