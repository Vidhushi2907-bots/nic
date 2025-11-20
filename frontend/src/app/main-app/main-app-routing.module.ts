import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainAppModule } from '../main-app/main-app.module';

import { AddCropNotifiedComponent } from './add-crop-notified/add-crop-notified.component';
import { AddCropComponent } from './add-crop/add-crop.component';
import { BreederSeedSubmissionComponent } from './breeder-seed-submission/breeder-seed-submission.component';
import { AddFormNucleusSeedAvailabilityByBreederComponent } from './add-form-nucleus-seed-availability-by-breeder/add-form-nucleus-seed-availability-by-breeder.component';
import { BreederSeedProductionCentreComponent } from './breeder-seed-production-centre/breeder-seed-production-centre.component';
import { AddCropVarietyCharactersticsComponent } from './add-crop-variety-characterstics/add-crop-variety-characterstics.component';
import { AddIndentorComponent } from './add-indentor/add-indentor.component';
import { IndentBreederSeedAllocationListComponent } from './indent-breeder-seed-allocation-list/indent-breeder-seed-allocation-list.component';
import { IndentBreederSeedAllocationDraftComponent } from './indent-breeder-seed-allocation-draft/indent-breeder-seed-allocation-draft.component';
import { PerformaOfBreederSeedTagFormComponent } from './production-center/performa-of-breeder-seed-tag/performa-of-breeder-seed-tag-form/performa-of-breeder-seed-tag-form.component';
import { PerformaOfBreederSeedTagListComponent } from './production-center/performa-of-breeder-seed-tag/performa-of-breeder-seed-tag-list/performa-of-breeder-seed-tag-list.component';
import { AllocationSeedProductionComponent } from './allocation-seed-production/allocation-seed-production.component';
import { AllocationSeedProductionNodalAgencyListComponent } from './allocation-seed-production-nodal-agency-list/allocation-seed-production-nodal-agency-list.component';
import { AllocationSeedProductionDraftComponent } from './allocation-seed-production-draft/allocation-seed-production-draft.component';
import { AddCropNotifiedListComponent } from './add-crop-notified-list/add-crop-notified-list.component';
import { AddCropListComponent } from './add-crop-list/add-crop-list.component';
import { NucleusSeedAvailabiltiltyFormComponent } from './production-center/nucleus-seed-availability-by-breeder/nucleus-seed-availabiltilty-form/nucleus-seed-availabiltilty-form.component';
import { NucleusSeedAvailabiltiltyListComponent } from './production-center/nucleus-seed-availability-by-breeder/nucleus-seed-availabiltilty-list/nucleus-seed-availabiltilty-list.component';
import { AddCropCharactersticsListComponent } from './add-crop-characterstics-list/add-crop-characterstics-list.component';
import { AddIndentorListComponent } from './add-indentor-list/add-indentor-list.component';

import { AddSeedTestingLaboratoryComponent } from './add-seed-testing-laboratory/add-seed-testing-laboratory.component';
import { AddSeedTestingLaboratoryListComponent } from './add-seed-testing-laboratory-list/add-seed-testing-laboratory-list.component';
import { MaximumLotSizeListComponent } from './maximum-lot-size-list/maximum-lot-size-list.component';
import { MaximumLotSizeComponent } from './maximum-lot-size/maximum-lot-size.component';
import { AddBreederComponent } from './add-breeder/add-breeder.component';
import { AddBreederListComponent } from './add-breeder-list/add-breeder-list.component';
import { SeedMultiplicationRatioListComponent } from './seed-multiplication-ratio-list/seed-multiplication-ratio-list.component';
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
import { ProformasVListComponent } from './bsp-proformas/proformas-five/proformas-v-list/proformas-v-list.component';
import { ProformasVFormComponent } from './bsp-proformas/proformas-five/proformas-v-form/proformas-v-form.component';
import { ProformasVbListComponent } from './bsp-proformas/proformas-five/proformas-vb-list/proformas-vb-list.component';
import { ProformasVbFormComponent } from './bsp-proformas/proformas-five/proformas-vb-form/proformas-vb-form.component';
import { SeedMultiplicationRatioFormComponentComponent } from './seed-multiplication-ratio-form-component/seed-multiplication-ratio-form-component.component';
import { LotNumberListComponent } from './production-center/lot-number/lot-number-list/lot-number-list.component';
import { LotNumberComponent } from './production-center/lot-number/lot-number/lot-number.component';
import { SeedTestingLabaratoryFormComponent } from './seed-testing-labaratory-form/seed-testing-labaratory-form.component';
import { BreederSeedCertificateComponent } from './breeder-seed-certificate/breeder-seed-certificate.component';
import { SeedTestingLabaratoryListComponent } from './seed-testing-labaratory-list/seed-testing-labaratory-list.component';
import { CreationOfLabelNumberBreederComponent } from './creation-of-label-number-breeder/creation-of-label-number-breeder.component';
import { PerformaOfBreederSeedTagComponent } from './performa-of-breeder-seed-tag/performa-of-breeder-seed-tag.component';
import { AllocationBreederSeedIndentorLiftingListComponent } from './seed-division/allocation-breeder-seed-indentor-lifting-list/allocation-breeder-seed-indentor-lifting-list.component';
import { AllocationBreederSeedIndentorLiftingFormComponent } from './seed-division/allocation-breeder-seed-indentor-lifting-form/allocation-breeder-seed-indentor-lifting-form.component';
import { AllocationBreederSpaListComponent } from './indenters/allocation-breeder-spa-list/allocation-breeder-spa-list.component';
import { AllocationBreederSpaFormsComponent } from './indenters/allocation-breeder-spa-forms/allocation-breeder-spa-forms.component';
import { CreationOfLabelNumberBreederListComponent } from './creation-of-label-number-breeder-list/creation-of-label-number-breeder-list.component';
import { ProformasViListComponent } from './seed-division/proforma-six/proformas-vi-list/proformas-vi-list.component';
import { ProformasViFormComponent } from './seed-division/proforma-six/proformas-vi-form/proformas-vi-form.component';
import { GenerationOfBreederOfCertificatComponent } from './generation-of-breeder-of-certificat/generation-of-breeder-of-certificat.component';
import { LoginHomeComponent } from '../common/login-home/login-home.component';
// import { LotNumberListComponent } from './production-center/lot-number/lot-number-list/lot-number-list.component';
// import { LotNumberComponent } from './production-center/lot-number/lot-number/lot-number.component';
import { NodalOfficerReportComponent } from './nodal-officer-report/nodal-officer-report.component';

import { SeedMultiplicationRatioReportComponent } from './seed-multiplication-ratio-report/seed-multiplication-ratio-report.component';
import { AllocationOfBreederSeedsToIndentorsForLiftingReportComponent } from './allocation-of-breeder-seeds-to-indentors-for-lifting-report/allocation-of-breeder-seeds-to-indentors-for-lifting-report.component';

import { MaximumLotSizeForEachCropReportComponent } from './maximum-lot-size-for-each-crop-report/maximum-lot-size-for-each-crop-report.component';

import { SeedTestingLaboratoryReportComponent } from './seed-testing-laboratory-report/seed-testing-laboratory-report.component';

import { ListOfBreederSeedProductionCenterReportComponent } from './list-of-breeder-seed-production-center-report/list-of-breeder-seed-production-center-report.component';


import { NucleusSeedAvailabilityReportComponent } from './nucleus-seed-availability-report/nucleus-seed-availability-report.component';

import { ListOfBreedersReportComponent } from './list-of-breeders-report/list-of-breeders-report.component';

import { BspOneReportComponent } from './bsp-one-report/bsp-one-report.component';

import { BspTwoReportComponent } from './bsp-two-report/bsp-two-report.component';

import { BspThreeReportComponent } from './bsp-three-report/bsp-three-report.component';

import { BspFourReportComponent } from './bsp-four-report/bsp-four-report.component';


import { BspFiveAReportComponent } from './bsp-five-a-report/bsp-five-a-report.component';

import { BspFiveBReportComponent } from './bsp-five-b-report/bsp-five-b-report.component';

import { BspSixReportComponent } from './bsp-six-report/bsp-six-report.component';

import { LiftingUtilizationOfBreederSeedReportComponent } from './lifting-utilization-of-breeder-seed-report/lifting-utilization-of-breeder-seed-report.component';
// import { MainAppComponent } from '../main-app.component';
import { MainAppComponent } from './main-app.component';
import { ProductionCenterGuard } from '../guard/production-center.guard';
import { BreederGuard } from '../guard/breeder.guard';
import { IcarNodalGuard } from '../guard/icar-nodal.guard';
import { IndenterGuard } from '../guard/indenter.guard';
import { SeedDivisionGuard } from '../guard/seed-division.guard';

import { ListOfIndentorsReportComponent } from './list-of-indentors-report/list-of-indentors-report.component';
import { WebLoginComponent } from '../web-login/web-login.component';
import { DashboardseedComponent } from './dashboardseed/dashboardseed.component';
import { IndentorDashboardComponent } from '../indentor-dashboard/indentor-dashboard.component';
import { BreederDashboardComponent } from '../breeder-dashboard/breeder-dashboard.component';
import { AddFreezeTimelineComponent } from '../add-freeze-timeline/add-freeze-timeline.component';
import { AddFreezeTimelineFormComponent } from '../add-freeze-timeline-form/add-freeze-timeline-form.component';
import { NodalDashboardComponent } from '../nodal-dashboard/nodal-dashboard.component';
import { ProductionDashboardComponent } from '../production-dashboard/production-dashboard.component';
import { NewReportComponent } from './new-report/new-report.component';
import { BillGenerateListComponent } from './bills/bill-generate-list/bill-generate-list.component';
import { BillGenerateFormComponent } from './bills/bill-generate-form/bill-generate-form.component';
import { PaymentComponent } from './payment/payment.component';
import { AddPlantListComponent } from './add-plant-list/add-plant-list.component';
import { AddPlantComponent } from './add-plant/add-plant.component';
import { SelectionOfSpaForSubmissionIndentComponent } from './selection-of-spa-for-submission-indent/selection-of-spa-for-submission-indent.component';
import { ViewSelectionOfSpaForSubmissionIndentComponent } from './view-selection-of-spa-for-submission-indent/view-selection-of-spa-for-submission-indent.component';
import { ReportDownloadComponent } from './report-download/report-download.component';

import { EditProfileComponent } from './edit-profile/edit-profile.component';


import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ProjectCoordinatorReportComponent } from './project-coordinator-report/project-coordinator-report.component';
import { PlantDetailReportComponent } from './plant-detail-report/plant-detail-report.component';
import { SubmissionOfIndentOfBreederSeedByStateReportComponent } from './submission-of-indent-of-breeder-seed-by-state-report/submission-of-indent-of-breeder-seed-by-state-report.component';
import { ProductionCenterWiseDetailsReportComponent } from './production-center-wise-details-report/production-center-wise-details-report.component';
import { AllocationOfBreederSeedsComponent } from './allocation-of-breeder-seeds/allocation-of-breeder-seeds.component';
import { AddCropReportComponent } from './add-crop-report/add-crop-report.component';
import { AddCropVarietyReportComponent } from './add-crop-variety-report/add-crop-variety-report.component';
import { SubmissionForIndentsOfBreederSeedReportComponent } from './submission-for-indents-of-breeder-seed-report/submission-for-indents-of-breeder-seed-report.component';
import { CropVarietyCharactersticReoprtComponent } from './crop-variety-characterstic-reoprt/crop-variety-characterstic-reoprt.component';
import { CardComponent } from './card/card.component';
import { IndentorSpaComponent } from '../indentor-spa/indentor-spa.component';
import { IndentorSpaListComponent } from '../indentor-spa-list/indentor-spa-list.component';
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
import { AllocationBreederSeedSpaComponent } from './allocation-breeder-seed-spa/allocation-breeder-seed-spa.component';
import { AllocationBreederSeedSpaListComponent } from './allocation-breeder-seed-spa-list/allocation-breeder-seed-spa-list.component';
import { NodalDasboadSecondComponent } from '../nodal-dasboad-second/nodal-dasboad-second.component';
import { SeeddivisionindentwiseComponent } from '../seeddivisionindentwise/seeddivisionindentwise.component';
import { SeeddivisonspawisereportComponent } from '../seeddivisonspawisereport/seeddivisonspawisereport.component';
import { BreederseedAllocationreportSecondComponent } from '../breederseed-allocationreport-second/breederseed-allocationreport-second.component';
import { AssignedCropVarietyReportComponent } from './assigned-crop-variety-report/assigned-crop-variety-report.component';
import { CreatedLotNumbersReportComponent } from './created-lot-numbers-report/created-lot-numbers-report.component';
import { BillPaymentCertificateReportComponent } from './bill-payment-certificate-report/bill-payment-certificate-report.component';
import { SeedTestingLaboratoryResultsReportsComponent } from './seed-testing-laboratory-results-reports/seed-testing-laboratory-results-reports.component';
import { SeedDivisionReportsecondComponent } from '../seed-division-reportsecond/seed-division-reportsecond.component';
import { ProductionDashboardSecondComponent } from './dashboard/production-dashboard-second/production-dashboard-second.component';
import { BspcWiseAssignCropComponent } from '../bspc-wise-assign-crop/bspc-wise-assign-crop.component';
import { BspcWiseNucleusSeedComponent } from '../bspc-wise-nucleus-seed/bspc-wise-nucleus-seed.component';
import { VarietyWiseNucleusSeedComponent } from '../variety-wise-nucleus-seed/variety-wise-nucleus-seed.component';
import { CropWiseStatusComponent } from '../crop-wise-status/crop-wise-status.component';
import { BspcWiseLiftingStatusComponent } from '../bspc-wise-lifting-status/bspc-wise-lifting-status.component';
import { CropWiseAssignedComponent } from '../crop-wise-assigned/crop-wise-assigned.component';
import { BspcassigncropComponent } from '../bspcassigncrop/bspcassigncrop.component';
import { BsptworeportComponent } from '../bsptworeport/bsptworeport.component';
import { GeneratedLabelNumbersComponent } from './generated-label-numbers/generated-label-numbers.component';
import { BspthreereportsecondComponent } from '../bspthreereportsecond/bspthreereportsecond.component';
// import { BreederseedallocationseedsecondComponent } from '../breederseedallocationseedsecond/breederseedallocationseedsecond.component';
// import { DashboardNodalSecondComponent } fro../dashboard-nodal-second/dashboard-nodal-second.componentent';
import { IndenterReportComponent } from './indenter-report/indenter-report.component';
import { AssignCropSecondComponent } from '../assign-crop-second/assign-crop-second.component';
import { BreederSeedInventoryComponent } from './bspc-forms/breeder-seed-inventory/breeder-seed-inventory.component';
import { BreederSeedWillingToProduceComponent } from './bspc-forms/breeder-seed-willing-to-produce/breeder-seed-willing-to-produce.component';
import { BspTwoSecondtComponent } from './bsp-two-second/bsp-two-second';
import { BspProfarmaOneFormComponent } from './breeder-form/bsp-profarma-one-form/bsp-profarma-one-form.component';
import { BspProformaOneFormNextComponent } from './breeder-form/bsp-proforma-one-form-next/bsp-proforma-one-form-next.component';
import { BspOneSecondComponent } from '../bsp-one-second/bsp-one-second.component';
import { BspcInspectionMonitoringTeamComponent } from './bspc-forms/bspc-inspection-monitoring-team/bspc-inspection-monitoring-team.component';
import { SeedInventoryComponent } from '../seed-inventory/seed-inventory.component';
import { HarvestingIntakeRegisterComponent } from './harvesting-intake-register/harvesting-intake-register.component';
import { BspProformaThreeComponent } from './bsp-proforma-three/bsp-proforma-three.component';
import { DirectIndentComponent } from './direct-indent/direct-indent.component';
import { GenerateSampleSlipComponent } from './generate-sample-slip/generate-sample-slip.component';
import { BspThirdComponent } from './bsp-third/bsp-third.component';
import { IntakeVerificationComponent } from '../intake-verification/intake-verification.component';
import { UnfreezeIndentComponent } from '../unfreeze-indent/unfreeze-indent.component';
import { ProcessedSeedRegisterComponent } from './processed-seed-register/processed-seed-register.component';
import { CompositionOfMonitoringTeamComponent } from './breeder-form/composition-of-monitoring-team/composition-of-monitoring-team.component';
import { BspThirdReportComponent } from './bsp-third-report/bsp-third-report.component';
import { Bsp2reportComponent } from '../bsp2report/bsp2report.component';
import { SppDashboardSecondComponent } from '../spp-dashboard-second/spp-dashboard-second.component';
import { BspProformaOneReportQrComponent } from './breeder-form/bsp-proforma-one-report-qr/bsp-proforma-one-report-qr.component';
import { RecievedIndentReportComponent } from './recieved-indent-report/recieved-indent-report.component';
import { GenerateSamplesForTestingComponent } from './generate-samples-for-testing/generate-samples-for-testing.component';
import { CarryOverSeedComponent } from '../carry-over-seed/carry-over-seed.component';
import { AvailabilityOfBreederseedComponent } from './availability-of-breederseed/availability-of-breederseed.component';
import { ReprintTagComponent } from './reprint-tag/reprint-tag.component';
import { ApprovalForReprintTagsComponent } from './approval-for-reprint-tags/approval-for-reprint-tags.component';
import { BspFourComponent } from '../bsp-four/bsp-four.component';
import { GenerateTagNumberComponent } from '../generate-tag-number/generate-tag-number.component';
import { SeedProcesingPlantComponent } from '../seed-procesing-plant/seed-procesing-plant.component';
import { VarietyPriceListComponent } from './variety-price-list/variety-price-list.component';
import { GenerateInvoiceComponent } from './generate-invoice/generate-invoice.component';
import { PrintBillComponent } from './view/print-bill/print-bill.component';
import { BillReceiptComponent } from './bill-receipt/bill-receipt.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ProcessedRegisterOldStockComponent } from '../processed-register-old-stock/processed-register-old-stock.component';
import { RequestInvoiceComponent } from '../request-invoice/request-invoice.component';
import { LiftingOfBreederSeedComponent } from '../lifting-of-breeder-seed/lifting-of-breeder-seed.component';
import { SampleSlipComponent } from './sample-slip/sample-slip.component';
import { ForwardingLetterComponent } from './forwarding-letter/forwarding-letter.component';
import { StlReportStatusComponent } from './stl-report-status/stl-report-status.component';
import { GenerateBreederSeedCertificateComponent } from './generate-breeder-seed-certificate/generate-breeder-seed-certificate.component';
import { BreederSeedCertificateDownloadComponent } from './breeder-seed-certificate-download/breeder-seed-certificate-download.component';
import { GenerateForwardingLetterForLabTestingComponent } from './generate-forwarding-letter-for-lab-testing/generate-forwarding-letter-for-lab-testing.component';
import { LiftingComponent } from './lifting/lifting.component';
import { BspFourReportSecondComponent } from '../bsp-four-report-second/bsp-four-report-second.component';
import { VarietyCharactersticReportsComponent } from './reports/variety-characterstic-reports/variety-characterstic-reports.component';
import { GInvoiceTestComponent } from './g-invoice-test/g-invoice-test.component';
import { BreederSeedCertificateQrComponent } from '../breeder-seed-certificate-qr/breeder-seed-certificate-qr.component';
import { BillReceiptQrComponent } from '../bill-receipt-qr/bill-receipt-qr.component';
import { GenerateCardQrComponent } from '../generate-card-qr/generate-card-qr.component';
import { ChatSupportComponent } from './chat-support/chat-support.component';
import { GrowOutTestSampleReceptionComponent } from './grow-out-test-sample-reception/grow-out-test-sample-reception.component';
import { SowingDetailsComponent } from './sowing-details/sowing-details.component';
import { BspIiStatusReportComponent } from './bsp-ii-status-report/bsp-ii-status-report.component';
import { BspIIIStatusReportComponent } from './bsp-iii-status-report/bsp-iii-status-report.component';
import { InabilityReallocateFormComponent } from './inability-reallocate-form/inability-reallocate-form.component';
import { BspIStatusReportComponent } from './bsp-i-status-report/bsp-i-status-report.component';
import { GotMonitoringTeamDetailsComponent } from './got-monitoring-team-details/got-monitoring-team-details.component';
import { GrowOutTestReportBspvComponent } from './grow-out-test-report-bspv/grow-out-test-report-bspv.component';
import { CropStatusReportComponent } from './crop-status-report/crop-status-report.component';
import { SelfSurplusLiftingComponent } from './self-surplus-lifting/self-surplus-lifting.component';
import { Bspc5TestResultReportComponent } from './bspc5-test-result-report/bspc5-test-result-report.component';
import { DirectLiftingComponent } from './direct-lifting/direct-lifting.component';
import { IntakeVerificationRegReportComponent } from './reports/intake-verification-reg-report/intake-verification-reg-report.component';
import { DiscardLotComponent } from './discard-lot/discard-lot.component';
import { OilsedLoginModuleComponent } from './oilsed-login-module/oilsed-login-module.component';
import { ModifyBagSizeComponent } from './production-center-phase-2/modify-bag-size/modify-bag-size.component';
import { DashboardPhaseSecondComponent } from './dashboard-phase-second/dashboard-phase-second.component';
import { CropGroupDetailComponent } from './crop-group-detail/crop-group-detail.component';
// import { CropReportComponent } from './crop-report/crop-report.component';
import { StateWiseCropStatisticsComponent } from './state-wise-crop-statistics/state-wise-crop-statistics.component';
import { CropWiseStatisticsComponent } from './crop-wise-statistics/crop-wise-statistics.component';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { VarietyReportListComponent } from './variety-report-list/variety-report-list.component';
import { PulsesseedLoginModuleComponent } from './pulsesseed-login-module/pulsesseed-login-module.component';
import { SeedReport1Component } from './seed-report1/seed-report1.component';
import { SeedReport2Component } from './seed-report2/seed-report2.component';
import { SeedRollingPlaningCropWiseComponent } from './seed-rolling-planing/indentor-login/seed-rolling-planing-crop-wise/seed-rolling-planing-crop-wise.component';
import { SeedRollingPlaningVarietyWiseComponent } from './seed-rolling-planing/indentor-login/seed-rolling-planing-variety-wise/seed-rolling-planing-variety-wise.component';
import { StateLoginReplanningComponent } from './state-login-replanning/state-login-replanning.component';
// import { ProfarmaOneQrComponent } from './profarma-one-qr/profarma-one-qr.component';
const routes: Routes = [
  // {
  //   path: 'login',
  //   component: LoginHomeComponent
  // },
  {
    path: '',
    component: MainAppComponent,
    children: [
      // {
      //   path: '',
      //   component: WebLoginComponent
      // },
      {
        path: 'state-Report1',
        component: SeedReport1Component,
      },
      // { path: 'report-data/:data', component: ProfarmaOneQrComponent },

      {
        path: 'state-Report2',
        component: SeedReport2Component,
      },
      {
        path: 'state-wise-crop-statistics',
        component: ReportDashboardComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop/submission/edit/:submissionid',
        component: AddCropComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'crop-statistics',
        component: CropGroupDetailComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'Crop-wise-statistics',
        component: CropWiseStatisticsComponent,
        // canActivate: [SeedDivisionGuard]
      },


      {
        path: 'report2-state-wise',
        component: StateWiseCropStatisticsComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop/submission/view/:submissionid',
        component: AddCropComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop',
        component: AddCropComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop-characterstics',
        component: AddCropVarietyCharactersticsComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop-notified',
        component: AddCropNotifiedComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop-character-list',
        component: AddCropCharactersticsListComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'indent-breeder-seed-allocation-list/submission',
        component: BreederSeedSubmissionComponent,
        // canActivate: [IndenterGuard]
      },
      // {
      //   path: 'add-crop-notified-list',
      //   component: AddCropNotifiedListComponent,
      //   canActivate:[SeedDivisionGuard]
      // },
      {
        path: 'add-crop-notified/view/:submissionid',
        component: AddCropNotifiedComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop-notified/edit/:submissionid',
        component: AddCropNotifiedComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop-list',
        component: AddCropListComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'indent-breeder-seed-allocation-list/submission/edit/:submissionid',
        component: BreederSeedSubmissionComponent,
        // canActivate: [IndenterGuard]
      },
      {
        path: 'indent-breeder-seed-allocation-list/submission/view/:submissionid',
        component: BreederSeedSubmissionComponent,
        // canActivate: [IndenterGuard]
      },
      {
        path: 'nucleus-seed-availability-by-breeder',
        component: NucleusSeedAvailabiltiltyListComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'add-form-nucleus-seed-availability-by-breeder/submission',
        component: NucleusSeedAvailabiltiltyFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'add-form-nucleus-seed-availability-by-breeder/edit/:submissionid',
        component: NucleusSeedAvailabiltiltyFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'add-form-nucleus-seed-availability-by-breeder/view/:submissionid',
        component: NucleusSeedAvailabiltiltyFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      // {
      //   path: 'add-form-nucleus-seed-availability-by-breeder/submission',
      //   component: AddFormNucleusSeedAvailabilityByBreederComponent
      // },
      // {
      //   path: 'add-form-nucleus-seed-availability-by-breeder/edit/:submissionid',
      //   component: AddFormNucleusSeedAvailabilityByBreederComponent
      // },
      // {
      //   path: 'add-form-nucleus-seed-availability-by-breeder/view/:submissionid',
      //   component: AddFormNucleusSeedAvailabilityByBreederComponent
      // },
      {
        path: 'add-crop-notified-characterstics',
        component: AddCropVarietyCharactersticsComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'seed-testing-labortary-breeder-list',
        component: SeedTestingLabaratoryListComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'seed-testing-labortary-breeder-form',
        component: SeedTestingLabaratoryFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'seed-testing-labortary-breeder-form/view/:submissionId',
        component: SeedTestingLabaratoryFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'seed-testing-labortary-breeder-form/edit/:submissionId',
        component: SeedTestingLabaratoryFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'add-crop-notified-characterstics/view/:submissionId',
        component: AddCropVarietyCharactersticsComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop-notified-characterstics/edit/:submissionId',
        component: AddCropVarietyCharactersticsComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-breeder',
        component: AddBreederComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-breeder/submission/edit/:submissionId',
        component: AddBreederComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-breeder/submission/view/:submissionId',
        component: AddBreederComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-breeder-list',
        component: AddBreederListComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop-notified-characterstics',
        component: AddCropVarietyCharactersticsComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop-notified-characterstics-list',
        component: AddCropCharactersticsListComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop-notified-characterstics/:submissionId',
        component: AddCropVarietyCharactersticsComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop-notified-characterstics/submission/view/:submissionId',
        component: AddCropVarietyCharactersticsComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-crop-notified-characterstics/submission/edit/:submissionId',
        component: AddCropVarietyCharactersticsComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-indentor',
        component: AddIndentorComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-indentor-list',
        component: AddIndentorListComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-indentor/submission/view/:submissionId',
        component: AddIndentorComponent,
        canActivate: [SeedDivisionGuard]
      },
      {

        path: 'add-breeder-crop-list',
        component: AddBreederCropListComponent,
        canActivate: [BreederGuard]
      },
      {

        path: 'add-breeder-crop',
        component: AddBreederCropComponent,
        canActivate: [BreederGuard]
      },
      {

        path: 'add-breeder-crop/view/:submissionId',
        component: AddBreederCropComponent,
        canActivate: [BreederGuard]
      },
      {

        path: 'add-breeder-crop/edit/:submissionId',
        component: AddBreederCropComponent,
        canActivate: [BreederGuard]
      },
      {
        path: 'add-breeder-production-center',
        component: AddBreederProductionCenterComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-breeder-production-center/view/:submissionId',
        component: AddBreederProductionCenterComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-breeder-production-center/edit/:submissionId',
        component: AddBreederProductionCenterComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-breeder-production-center-list',
        component: AddBreederProductionListComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-indentor/submission/edit/:submissionId',
        component: AddIndentorComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'indent-breeder-seed-allocation-list',
        component: IndentBreederSeedAllocationListComponent,
        // canActivate: [IndenterGuard]
      },
      {
        path: 'performa-Of-breeder-seed-tag',
        component: PerformaOfBreederSeedTagFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'performa-Of-breeder-seed-tag/submission/edit/:submissionId',
        component: PerformaOfBreederSeedTagFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'performa-Of-breeder-seed-tag/submission/view/:submissionId',
        component: PerformaOfBreederSeedTagFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'performa-Of-breeder-seed-tag-list',
        component: PerformaOfBreederSeedTagListComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'add-crop-notified-list',
        component: AddCropNotifiedListComponent,
        canActivate: [SeedDivisionGuard]
      },

      {
        path: 'indent-breeder-seed-allocation/draft',
        component: IndentBreederSeedAllocationDraftComponent
      },
      // {
      //   path: 'allocation-seed-production-list',
      //   component: AllocationSeedProductionNodalAgencyListComponent,
      //   canActivate:[IcarNodalGuard]
      // },
      // {
      //   path: 'allocation-seed-production-list/submission',
      //   component: AllocationSeedProductionComponent,
      //   canActivate:[IcarNodalGuard]
      // },
      // {
      //   path: 'allocation-seed-production-list/submission/edit/:year/:cropcode/:varietyid',
      //   component: AllocationSeedProductionComponent,
      //   canActivate:[IcarNodalGuard]
      // },
      // {
      //   path: 'allocation-seed-production-list/submission/view/:year/:cropcode/:varietyid',
      //   component: AllocationSeedProductionComponent,
      //   canActivate:[IcarNodalGuard]
      // },
      {
        path: 'add-breeder-production-center',
        component: AddBreederProductionCenterComponent,
        canActivate: [BreederGuard]
      },
      {
        path: 'add-breeder-production-center-list',
        component: AddBreederProductionListComponent,
        canActivate: [BreederGuard]
      },
      {
        path: 'add-breeder-production-center/view/:submissionid',
        component: AddBreederProductionCenterComponent,
        canActivate: [BreederGuard]
      },
      {
        path: 'add-breeder-production-center/edit/:submissionid',
        component: AddBreederProductionCenterComponent,
        canActivate: [BreederGuard]
      },
      {
        path: 'allocation-seed-production-draft',
        component: AllocationSeedProductionDraftComponent
      },
      {
        path: 'allocation-seed-production-draft/edit/draft/:submissionid',
        component: AllocationSeedProductionComponent
      },
      {
        path: 'add-seed-testing-laboratory',
        component: AddSeedTestingLaboratoryComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-seed-testing-laboratory/edit/:id',
        component: AddSeedTestingLaboratoryComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-seed-testing-laboratory/view/:id/:stateCod',
        component: AddSeedTestingLaboratoryComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-seed-testing-laboratory-list',
        component: AddSeedTestingLaboratoryListComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-freeze-timeline-list',
        component: AddFreezeTimelineComponent,
        canActivate: [SeedDivisionGuard]

      },
      {
        path: 'add-freeze-timeline-form',
        component: AddFreezeTimelineFormComponent,
        canActivate: [SeedDivisionGuard]

      },
      {
        path: 'maximum-lot-size-list',
        component: MaximumLotSizeListComponent,
        canActivate: [SeedDivisionGuard]
      },


      {
        path: 'add-maximum-lot-size',
        component: MaximumLotSizeComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-maximum-lot-size/edit/:id',
        component: MaximumLotSizeComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'add-maximum-lot-size/view/:id',
        component: MaximumLotSizeComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'seed-multiplication-ratio-list',
        component: SeedMultiplicationRatioListComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'breeder/bsp-proformas/bills',
        component: BillGenerateListComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/bills/new',
        component: BillGenerateFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/bills/edit/:submissionid',
        component: BillGenerateFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/bills/view/:submissionid',
        component: BillGenerateFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'seed-multiplication-ratio/submission',
        component: SeedMultiplicationRatioFormComponentComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'seed-multiplication-ratio/edit/:id',
        component: SeedMultiplicationRatioFormComponentComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'seed-multiplication-ratio/view/:id',
        component: SeedMultiplicationRatioFormComponentComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'submit-indents-breeder-seeds',
        component: SubmitIndentsBreederSeedsComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-1s',
        component: ProformasIListComponent,
        canActivate: [BreederGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-1s/new',
        component: ProformasIFormComponent,
        canActivate: [BreederGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-1s/edit/:submissionid',
        component: ProformasIFormComponent,
        canActivate: [BreederGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-1s/view/:submissionid',
        component: ProformasIFormComponent,
        canActivate: [BreederGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-2s',
        component: ProformasIiListComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-2s/new',
        component: ProformasIiFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-2s/edit/:submissionid',
        component: ProformasIiFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-2s/view/:submissionid',
        component: ProformasIiFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-3s',
        component: ProformasIiiListComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-3s/new',
        component: ProformasIiiFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-3s/edit/:submissionid',
        component: ProformasIiiFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-3s/view/:submissionid',
        component: ProformasIiiFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-4s',
        component: ProformasIvListComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-4s/new',
        component: ProformasIvFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-4s/edit/:submissionid',
        component: ProformasIvFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-4s/view/:submissionid',
        component: ProformasIvFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-5s-a',
        component: ProformasVListComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-5s-a/new',
        component: ProformasVFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-5s-a/edit/:submissionid',
        component: ProformasVFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-5s-a/view/:submissionid',
        component: ProformasVFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-5s-b',
        component: ProformasVbListComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-5s-b/new',
        component: ProformasVbFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-5s-b/edit/:submissionid',
        component: ProformasVbFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'breeder/bsp-proformas/proformas-5s-b/view/:submissionid',
        component: ProformasVbFormComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'lot-number-list',
        component: LotNumberListComponent,
        // canActivate: [ProductionCenterGuard]
      },
      {
        path: 'lot-number',
        component: LotNumberComponent,
        // canActivate: [ProductionCenterGuard]
      },
      {
        path: 'lot-number/view/:submissionid',
        component: LotNumberComponent,
        // canActivate: [ProductionCenterGuard]
      },
      {
        path: 'lot-number/edit/:submissionid',
        component: LotNumberComponent,
        // canActivate: [ProductionCenterGuard]
      },
      {
        path: 'production-center/generation-of-breeder-certificate/view/:submissionid',
        component: BreederSeedCertificateComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'creation-of-label-number-for-seeds-list',
        component: CreationOfLabelNumberBreederListComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'creation-of-label-number-for-seeds',
        component: CreationOfLabelNumberBreederComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'production-center/generation-of-breeder-certificate',
        component: GenerationOfBreederOfCertificatComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'performa-of-breeder-seed-tag',
        component: PerformaOfBreederSeedTagComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'seed-division/breeder-seed-allocation-lifting',
        component: AllocationBreederSeedIndentorLiftingListComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'seed-division/breeder-seed-allocation-lifting/new',
        component: AllocationBreederSeedIndentorLiftingFormComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'seed-division/breeder-seed-allocation-lifting/edit/:submissionid',
        component: AllocationBreederSeedIndentorLiftingFormComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'seed-division/breeder-seed-allocation-lifting/view/:submissionid',
        component: AllocationBreederSeedIndentorLiftingFormComponent,
        canActivate: [SeedDivisionGuard]
      },

      {
        path: 'indenters/allocation-of-breeder-seed-to-spa-for-liftings',
        component: AllocationBreederSpaListComponent,
        canActivate: [IndenterGuard]
      },
      {
        path: 'indenters/allocation-of-breeder-seed-to-spa-for-lifting/new',
        component: AllocationBreederSpaFormsComponent,
        canActivate: [IndenterGuard]
      },
      {
        path: 'indenters/allocation-of-breeder-seed-to-spa-for-lifting/edit/:submissionid',
        component: AllocationBreederSpaFormsComponent,
        canActivate: [IndenterGuard]
      },
      {
        path: 'indenters/allocation-of-breeder-seed-to-spa-for-lifting/view/:submissionid',
        component: AllocationBreederSpaFormsComponent,
        canActivate: [IndenterGuard]
      },

      {
        path: 'creation-of-label-number-for-seeds/edit/:id',
        component: CreationOfLabelNumberBreederComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'creation-of-label-number-for-seeds/view/:id',
        component: CreationOfLabelNumberBreederComponent,
        canActivate: [ProductionCenterGuard]
      },
      {
        path: 'seed-division/bsp-proformas-6s',
        component: ProformasViListComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'seed-division/bsp-proformas-6s/new',
        component: ProformasViFormComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'seed-division/bsp-proformas-6s/edit/:submissionid',
        component: ProformasViFormComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'seed-division/bsp-proformas-6s/view/:submissionid',
        component: ProformasViFormComponent,
        canActivate: [SeedDivisionGuard]
      },
      // {
      //   path: 'login-home',
      //   component: LoginHomeComponent
      // },
      {
        path: 'nodal-officer-report',
        component: NodalOfficerReportComponent,
        canActivate: [IcarNodalGuard]
      },
      {
        path: 'seed-multiplication-ratio-report',
        component: SeedMultiplicationRatioReportComponent
      },
      {
        path: 'allocation-of-breeder-seeds-to-indentors-for-lifting-report',
        component: AllocationOfBreederSeedsToIndentorsForLiftingReportComponent
      },
      {
        path: 'maximum-lot-size-for-each-crop-report',
        component: MaximumLotSizeForEachCropReportComponent
      },

      {
        path: 'seed-testing-laboratory-report',
        component: SeedTestingLaboratoryReportComponent,
        // canActivate:[ProductionCenterGuard]
      },
      {
        path: 'list-of-breeder-seed-production-center-report',
        component: ListOfBreederSeedProductionCenterReportComponent
      },
      {
        path: 'nucleus-seed-availability-report',
        component: NucleusSeedAvailabilityReportComponent,
        // canActivate:[ProductionCenterGuard]
      },
      {
        path: 'list-of-breeders-report',
        component: ListOfBreedersReportComponent
      },
      {
        path: 'bsp-III-status-report',
        component: BspIIIStatusReportComponent
      },
      {
        path: 'bsp-II-status-report',
        component: BspIiStatusReportComponent
      },
      {
        path: 'bsp-I-status-report',
        component: BspIStatusReportComponent
      },
      {
        path: 'sowing-details',
        component: SowingDetailsComponent
      },
      {
        path: 'got-monitoring-Details',
        component: GotMonitoringTeamDetailsComponent
      },
      {
        path: 'grow-out-test-sample-reception',
        component: GrowOutTestSampleReceptionComponent
      },


      {
        path: 'lifting-utilization-of-breeder-seed-report',
        component: LiftingUtilizationOfBreederSeedReportComponent
      },
      {
        path: 'bsp-one-report',
        component: BspOneReportComponent
      },
      {
        path: 'bsp-two-report',
        component: BspTwoReportComponent
      },
      {
        path: 'generate-breeder-seed-certificate',
        component: GenerateBreederSeedCertificateComponent
      },
      {
        path: 'Breeder-Seed-Certificate-Download',
        component: BreederSeedCertificateDownloadComponent
      },

      {
        path: 'bsp-three-report',
        component: BspThreeReportComponent
      },
      {
        path: 'bsp-four-report',
        component: BspFourReportComponent
      },
      {
        path: 'bsp-five-a-report',
        component: BspFiveAReportComponent
      },
      {
        path: 'bsp-five-b-report',
        component: BspFiveBReportComponent
      },
      {
        path: 'bsp-six-report',
        component: BspSixReportComponent
      },

      {
        path: 'list-of-indentors-report',
        component: ListOfIndentorsReportComponent
      },

      {
        path: 'new-report',
        component: NewReportComponent
      },

      {
        path: 'dashboardSeed',
        component: DashboardseedComponent
      },

      {
        path: 'indentor-seed-dashboard',
        component: IndentorDashboardComponent
      },
      {
        path: 'breeder-dashboard',
        component: BreederDashboardComponent
      },

      {
        path: 'nodal-dashboard',
        component: NodalDashboardComponent,
        canActivate: [IcarNodalGuard]
      },
      {
        path: 'bsp-dashboard',
        component: ProductionDashboardComponent
      },
      {
        path: 'bsp-dashboard-second',
        component: SppDashboardSecondComponent
        // component: ProductionDashboardSecondComponent
      },
      {
        path: 'indentor-payment',
        component: PaymentComponent
      },
      {
        path: 'breeder-production-report',
        component: ProjectCoordinatorReportComponent
      },
      {
        path: 'variety-report-list',
        component: VarietyReportListComponent
      },
      {
        path: 'spp-report',
        component: PlantDetailReportComponent
      },
      // {
      //   path: '**',
      //   redirectTo: 'login',
      //   pathMatch: 'full'
      // }

      {
        path: 'add-freeze-timeline-form/view/:submissionid',
        component: AddFreezeTimelineFormComponent
      },
      {
        path: 'add-freeze-timeline-form/edit/:submissionid',
        component: AddFreezeTimelineFormComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'add-plant-list',
        component: AddPlantListComponent,
        canActivate: [SeedDivisionGuard]

      },
      {
        path: 'add-plant-form',
        component: AddPlantComponent,
        canActivate: [SeedDivisionGuard]

      },
      {
        path: 'add-plant-form/view/:submissionId',
        component: AddPlantComponent,
        canActivate: [SeedDivisionGuard]

      },
      {
        path: 'add-plant-form/edit/:submissionId',
        component: AddPlantComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'report-for-different-category',
        component: ReportDownloadComponent,
        canActivate: [SeedDivisionGuard]
      },
      {
        path: 'ProcessedRegisterOldStock',
        component: ProcessedRegisterOldStockComponent
      },
      {
        path: 'indenter-report',
        component: IndenterReportComponent,
        // canActivate: [IndenterGuard]

      },
      {
        path: '**',
        redirectTo: 'web-login',
        pathMatch: 'full'
      },
      {
        path: 'selection-of-spa-for-submission-indent',
        component: SelectionOfSpaForSubmissionIndentComponent
      },
      {
        path: 'list-of-indent-report',
        component: ListOfIndentReportComponent
      },
      {
        path: 'view-selection-of-spa-for-submission-indent/view',
        component: ViewSelectionOfSpaForSubmissionIndentComponent
      },
      {
        path: 'profile/submission/view',
        component: EditProfileComponent
      },
      {
        path: 'chat-support',
        component: ChatSupportComponent
      },
      {
        path: 'profile/submission/edit',
        component: EditProfileComponent
      },
      {
        path: 'submission-of-indent-of-breeder-seed-by-state-report',
        component: SubmissionOfIndentOfBreederSeedByStateReportComponent
      },
      {
        path: 'production_center_wise_details_report',
        component: ProductionCenterWiseDetailsReportComponent
      },
      {
        path: 'report-download',
        component: ReportDownloadComponent
      },
      {
        path: 'allocation-of-breeder-seed-report',
        component: AllocationOfBreederSeedsComponent
      },
      {
        path: 'status-of-lifting-non-lifting-supply-position-for-crops',
        component: StatusOfLiftingNonLiftingSupplyPositionForCropsComponent
      },
      {
        path: 'spa-lifting',
        component: SpaLiftingComponent
      },
      {
        path: 'spa-lifting-list',
        component: SpaLiftingListComponent
      },
      {
        path: 'add-crop-report',
        component: AddCropReportComponent
      },
      {
        path: 'add-crop-variety-report',
        component: AddCropVarietyReportComponent
      },
      {
        path: 'crop-variety-characterstics-report',
        component: CropVarietyCharactersticReoprtComponent,
      },
      {
        path: 'submission-for-indents-of-breeder-seed-report',
        component: SubmissionForIndentsOfBreederSeedReportComponent
      },
      {
        path: 'card',
        component: CardComponent
      },
      {
        path: 'lifting',
        component: LiftingComponent
      },
      {
        path: 'direct-lifting',
        component: DirectLiftingComponent
      },
      {
        path: 'self-surplus-lifting',
        component: SelfSurplusLiftingComponent
      },
      {
        path: 'add-seed-producing-agency-spa-indentor',
        component: IndentorSpaComponent
      },
      {
        path: 'add-seed-producing-agency-spa-indentor/addSpa/:stateCode',
        component: IndentorSpaComponent
      },
      {
        path: 'add-seed-producing-agency-spa-indentor/edit/:submissionId',
        component: IndentorSpaComponent
      },
      {
        path: 'add-seed-producing-agency-spa-indentor/view/:submissionId',
        component: IndentorSpaComponent
      },
      {
        path: 'add-seed-producing-agency-spa-indentor-list',
        component: IndentorSpaListComponent
      },
      {
        path: 'submit-indent-of-breeder-seed-crop-wise',
        component: SubmitIndentBreederCropWiseComponent
      },
      {
        path: 'spa-allocation-report',
        component: SpaAllocationReportComponent

      },
      //   {path : 'submit-indent-of-spa-wise',
      //   component: SubmitIndentSpaWiseComponent
      // },
      {
        path: 'status-of-lifting-non-lifting-of-breeder-seed-crop-wise',
        component: StatusOfLiftingNonLiftingOfBreederSeedCropWiseReportComponent
      },
      {
        path: 'submit-indent-of-spa-wise',
        component: IndentBreederSeedSpaWiseReportComponent
      },
      {
        path: 'allocated-quantity-seed-division',
        component: AllocatedQuantitySeedDivisionLiftingComponent
      },
      {
        path: 'spa-wise-status-lifting-non-of-breeder-seed',
        component: SpaWiseStatusLiftingNonOfBreederSeedComponent
      },
      {
        path: 'allocation-breeder-seed-spa-wise',
        component: AllocationBreederSeedSpaComponent
      },
      {
        path: 'allocation-breeder-seed-spa-wise-list',
        component: AllocationBreederSeedSpaListComponent
      },

      {
        path: 'nodal-dasboard-seconds',
        component: SppDashboardSecondComponent
        // component: NodalDasboadSecondComponent
      },
      {
        path: 'indent-wise-crop',
        component: SeeddivisionindentwiseComponent
      },
      {
        path: 'indent-wise-spa-report',
        component: SeeddivisonspawisereportComponent
      },
      {
        path: 'breeder-seed-allocation-spa',
        component: BreederseedAllocationreportSecondComponent
      },
      {
        path: 'assigned-crop-variety-report',
        component: AssignedCropVarietyReportComponent
      },
      {
        path: 'created-lot-numbers-report',
        component: CreatedLotNumbersReportComponent
      },
      {
        path: 'bill-payment-certificate-report',
        component: BillPaymentCertificateReportComponent
      },
      {
        path: 'seed-testing-laboratory-results-reports',
        component: SeedTestingLaboratoryResultsReportsComponent
      },
      {
        path: 'dashboardSeedSecond',
        component: SeedDivisionReportsecondComponent
      },
      {
        path: 'bspc_wise_assign_crop',
        component: BspcWiseAssignCropComponent
      },
      {
        path: 'bspc_wise_nucleus_crop',
        component: BspcWiseNucleusSeedComponent
      },
      {
        path: 'variety_wise_nucleus_seed',
        component: VarietyWiseNucleusSeedComponent
      },
      {
        path: 'crop_wise_status',
        component: CropWiseStatusComponent
      },
      {
        path: 'bspc_wise_status',
        component: BspcWiseLiftingStatusComponent
      },
      {
        path: 'crop-wise-assigned-variety',
        component: CropWiseAssignedComponent
      },
      {
        path: 'bspc-wise-assigned-variety',
        component: BspcWiseNucleusSeedComponent
      },
      {
        path: 'bspc-two-reports',
        component: BsptworeportComponent

      },
      {
        path: 'generated-label-numbers',
        component: GeneratedLabelNumbersComponent
      },

      {
        path: 'bspc-three-reports-second',
        component: BspthreereportsecondComponent
      },
      {
        path: 'assign-crop-second',
        component: AssignCropSecondComponent
      },
      {
        path: 'bspc-breeder-seed-inventory',
        component: BreederSeedInventoryComponent
      },
      {
        path: 'bspc-breeder-seed-willing-to-produce',
        component: BreederSeedWillingToProduceComponent
      },
      {
        path: 'bsp-two-second',
        component: BspTwoSecondtComponent
      },
      {
        path: 'breeder-bsp-profarma-one',
        component: BspProfarmaOneFormComponent
      },
      {
        path: 'breeder-bsp-profarma-one-next',
        component: BspProformaOneFormNextComponent
      },
      {
        path: 'composition-of-monitoring',
        component: BspOneSecondComponent
      },
      {
        path: 'grow-of-testing-report',
        component: GrowOutTestReportBspvComponent
      },
      {
        path: 'grow-of-testing-result',
        component: Bspc5TestResultReportComponent
      },
      {
        path: 'bspc-inspection-monitoring-team-details',
        component: BspcInspectionMonitoringTeamComponent
      },
      {
        path: 'seed-inventory',
        component: SeedInventoryComponent
      },
      {

        path: 'harvesting-intake-register',
        component: HarvestingIntakeRegisterComponent
      },
      {

        path: 'bsp-proforma-three',
        component: BspProformaThreeComponent
      },
      {
        path: 'direct-indent',
        component: DirectIndentComponent
      },
      {
        path: 'bsp-third',
        component: BspThirdComponent
      },
      {
        path: 'intake-verification',
        component: IntakeVerificationComponent
      },
      {
        path: 'unfreeze-indent',
        component: UnfreezeIndentComponent
      },

      {
        path: 'generate-sample-slip',
        component: GenerateSampleSlipComponent
      },

      {
        path: 'print-bill',
        component: PrintBillComponent
      },

      {
        path: 'Bill-Receipt',
        component: BillReceiptComponent
      },

      {
        path: 'generate-forwarding-letter-for-lab-testing',
        component: GenerateForwardingLetterForLabTestingComponent
      },
      {
        path: 'generate-sample-slip-for-testing',
        component: GenerateSamplesForTestingComponent
      },
      {
        path: 'bsp-third-report',
        component: BspThirdReportComponent
      },
      {
        path: 'processed-seed-register',
        component: ProcessedSeedRegisterComponent
      },
      {
        path: 'composition-of-monitoring-team-details',
        component: CompositionOfMonitoringTeamComponent
      },
      {
        path: 'bsp-2-report',
        component: Bsp2reportComponent
      },
      {
        path: 'invoice',
        component: InvoiceComponent
      },
      {
        path: 'spp-dashboard',
        component: SppDashboardSecondComponent
      },
      {
        path: 'submit-indents-breeder-report',
        component: RecievedIndentReportComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'carry-over-seed-production',
        component: CarryOverSeedComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'availability-of-breederseed',
        component: AvailabilityOfBreederseedComponent,
        // canActivate:[ProductionCenterGuard]
      },
      {
        path: 'reprint-tag',
        component: ReprintTagComponent,
        // canActivate:[ProductionCenterGuard]
      },
      {
        path: 'crop-status-report',
        component: CropStatusReportComponent,
        // canActivate:[ProductionCenterGuard]
      },
      {
        path: 'approval-reprint-tag',
        component: ApprovalForReprintTagsComponent,
        // canActivate:[ProductionCenterGuard]

      },
      {
        path: 'bsp-four',
        component: BspFourComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'generate-tag-number',
        component: GenerateTagNumberComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'seed-processing-plant',
        component: SeedProcesingPlantComponent,
      },
      {
        path: 'variety-price-list',
        component: VarietyPriceListComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'generate-invoice',
        component: GenerateInvoiceComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'seed-processed-old',
        component: ProcessedRegisterOldStockComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'request-invoice',
        component: RequestInvoiceComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'lifting-of-breeder-seed',
        component: LiftingOfBreederSeedComponent,
      },
      {
        path: 'sample-slip-generate/:submissionId',
        component: SampleSlipComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'forwarding-letter/:submissionId',
        component: ForwardingLetterComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'stl-report-status',
        component: StlReportStatusComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'bsp-four-report-availability',
        component: BspFourReportSecondComponent,
        // canActivate: [SeedDivisionGuard]
      },
      {
        path: 'Breeder-Seed-Certificate-Download/:submissionid',
        component: BreederSeedCertificateDownloadComponent
      },
      {
        path: 'variety-characterstic-reports',
        component: VarietyCharactersticReportsComponent
      },
      {
        path: 'generate-invoices/:submissionid',
        component: GInvoiceTestComponent
      },
      {
        path: 'Bill-Receipt/:id',
        component: BillReceiptComponent
      },
      {
        path: 'inability-reallocate-form',
        component: InabilityReallocateFormComponent
      },
      {
        path: 'intake-verification-register-report',
        component: IntakeVerificationRegReportComponent
      },

      // {
      //   path: 'breeder-seed-cerficate-qr/:id',
      //   component: BreederSeedCertificateQrComponent
      // },
      // {
      //   path: 'breeder-reciept-qr/:id',
      //   component: BillReceiptQrComponent
      // },
      // {
      //   path: 'variety-characterstic-reports/view/:submissionid',
      //   component: VarietyCharactersticReportsComponent
      // },

      // {
      //     path: 'unfreeze-indent',
      //     component: UnfreezeIndentComponent
      // }
      {
        path: 'discard-lot',
        component: DiscardLotComponent
      },
      {
        path: 'recieved-indent-oil-seed',
        component: OilsedLoginModuleComponent
      },

      {
        path: 'recieved-indent-pulses-seed',
        component: PulsesseedLoginModuleComponent
      },
      // modify bag size
      {
        path: 'update-tag-bag-size',
        component: ModifyBagSizeComponent
      },
      {
        path: 'dashboard-phase-second',
        component: DashboardPhaseSecondComponent
      },
      {
        path: 'seed-rolling-planing-crop-wise',
        component: SeedRollingPlaningCropWiseComponent
      },
      {
        path: 'seed-rolling-planing-variety-wise',
        component: SeedRollingPlaningVarietyWiseComponent
      },
      {
        path: 'seed-rolling-planing-variety-wise/:id/:crop_code',
        component: SeedRollingPlaningVarietyWiseComponent
      },
      {
        path: 'state-login-replanning',
        component: StateLoginReplanningComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainAppRoutingModule { }
