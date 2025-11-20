import { Injectable } from '@angular/core';
import { random } from '../_helpers/utility';

// declare type RoleTypes = "Seed" | "Indenter" | "ICAR" | "productionCenter" | "Project Co-ordinator";

@Injectable({
  providedIn: 'root'
})
export class LoggedInUserInfoService {

  // private role: RoleTypes = "ICAR_NODAL";
  // public role:any = "productionCenter";
  // public role: any = "Indenter";
  // private role: RoleTypes = "Seed";
  private role: any = undefined; // "Project Co-ordinator";
  private username: any = undefined; // "Project Co-ordinator";
  // private role: any = "ICAR_NODAL";
  public loginInfo: {
    address: string,
    designation: string
  } = undefined;

  enabledRoleMenu: any = {};
  type: any;
  userRollType: any;
  // loginInfo: any;
  get userRole() {
    if (this.role === undefined) this.loadLoggedInUserInfo();
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.role = userData && userData.user_type ? userData.user_type : 'SD'
    this.username = userData && userData.unm ? userData.unm : ''
    return this.role;
  }

  get getReportsSubMenu() {
    let subMenuCollection = [
    ];

    if (this.userRole == "ICAR" || this.userRole == "HICAR") {
      subMenuCollection.push(
        {
          "name": "List of Crops",
          "href": "/add-crop-report",
          "icon": "crop.svg"
        },
        {
          "name": "List of Crop Varieties",
          "href": "/add-crop-variety-report",
          "icon": "harvest_one.svg"
        },
        {
          "name": "Variety Characterstic Reports",
          "href": "/variety-characterstic-reports",
          "icon": "character.svg"
        },
        {
          "name": "List of Variety Characteristics",
          "href": "/crop-variety-characterstics-report",
          "icon": "character.svg"
        },
        {
          "name": "List of Project Co-ordinators",
          "href": "/breeder-production-report",
          "icon": "seed_multi_ratio.svg"
        },

        {
          "name": "Nucleus Seed Availability Report",
          "href": "/nucleus-seed-availability-report",
          "icon": "Add_Breeder.svg"
        },

        {
          "name": "BSP Forms",
          "href": "javascript:void(0)",
          "subMenus": [
            {
              "name": "BSP I",
              "href": "/bsp-one-report"
            },
            {
              "name": "BSP II",
              "href": "/bsp-two-report"
            },
            {
              "name": "BSP II Second",
              "href": "/bsp-2-report"
            },
            {
              "name": "BSP III",
              "href": "/bspc-three-reports-second"
            },
            {
              "name": "BSP IV",
              "href": "/bsp-four-report"
            },
            // {
            //   "name": "BSP V(a)",
            //   "href": "/bsp-five-a-report"
            // },
            // {
            //   "name": "BSP V(b)",
            //   "href": "/bsp-five-b-report"
            // },
          ],

        },
        // {
        //   "name": "Submit Indents of Breeder Seed (crop wise) ",
        //   "href": "/indent-wise-crop",
        //   "icon": "Add_Breeder.svg"
        // },
        // {
        //   "name": "Status of Lifting Non Lifting Supply Position For Crops",
        //   "href": "/status-of-lifting-non-lifting-supply-position-for-crops",
        //   "icon": "character.svg"
        // },
        // {
        //   "name": "Status of Lifting/Non-Lifting/Supply Position for Crops",
        //   "href": "/lifting-utilization-of-breeder-seed-report",
        //   "icon": "character.svg"
        // }

      );
    }

    // breeder login (BR)
    if (this.userRole == "BR") {
      subMenuCollection.push(
        {
          "name": "List of Breeder Seed Production Center",
          "href": "/list-of-breeder-seed-production-center-report",
          "icon": "Add_Breeder.svg"
        },
        {
          "name": "Bsp One Second",
          "href": "/bsp-one-second",
          "icon": "Add_Breeder.svg"
        },
        {
          icon: "add_breeder_crop.svg",
          name: "Crop Wise Assigned Varieties to BSPCs",
          href: "/crop-wise-assigned-variety",
          subMenus: undefined
        },
        {
          icon: "add_breeder_crop.svg",
          name: "BSPC Wise Assigned Crop/Varieties",
          href: "/bspc_wise_assign_crop",
          subMenus: undefined
        },

        {
          "name": "BSPC Wise Nucleus Seed Availability Report",
          "href": "/bspc-wise-assigned-variety",
          "icon": "Add_Breeder.svg"
        },
        {
          "name": "Variety Wise Nucleus Seed Availability Report",
          "href": "/variety_wise_nucleus_seed",
          "icon": "Add_Breeder.svg"
        },
        {
          "name": "Crop Wise Status of Lifting/Non-Lifting/Supply Position",
          "href": "/crop_wise_status",
          "icon": "Add_Breeder.svg"
        },
        {
          "name": "BSPC Wise Status of Lifting/Non-Lifting/Supply Position",
          "href": "/bspc_wise_status",
          "icon": "Add_Breeder.svg"
        },
        {
          "name": "BSP Forms",
          "href": "javascript:void(0)",
          "subMenus": [
            {
              "name": "BSP I",
              "href": "/bsp-one-report"
            },
            {
              "name": "BSP II",
              "href": "/bspc-two-reports"
            },
            {
              "name": "BSP II Second",
              "href": "/bsp-2-report"
            },
            {
              "name": "BSP III",
              "href": "/bspc-three-reports-second"
            },
            {
              "name": "BSP IV",
              "href": "/bsp-four-report"
            },
            // {
            //   "name": "BSP V(a)",
            //   "href": "/bsp-five-a-report"
            // },
            // {
            //   "name": "BSP V(b)",
            //   "href": "/bsp-five-b-report"
            // },
            // {
            //   "name": "BSP VI",
            //   "href": "/bsp-six-report"
            // }
          ]
        },

        // {
        //   "name": "Allocation of Breeder Seeds to Indentors for Lifting",
        //   "href": "/allocation-of-breeder-seeds-to-indentors-for-lifting-report",
        //   "icon": "character.svg"
        // },
        // {
        //   "name": "List of Breeders",
        //   "href": "/list-of-breeders-report",
        //   "icon": "Add_Breeder.svg"
        // },
        // {
        //   "name": "Nucleus Seed Availability Report",
        //   "href": "/nucleus-seed-availability-report",
        //   "icon": "Add_Breeder.svg"
        // },

        // {
        //   "name": "Lifting/ Utilization of Breeder Seed Report",
        //   "href": "/lifting-utilization-of-breeder-seed-report",
        //   "icon": "character.svg"
        // }
      );
    }
    // || this.userRole == "OILSEEDADMIN"
    if (this.userRole == "SD" || this.userRole == "OILSEEDADMIN" || this.userRole == "PULSESSEEDADMIN" ||this.userRole == "SUPERADMIN") {

      subMenuCollection.push(

        {
          icon: "character.svg",
          name: "Breeder Seed Production Reports",
          href: "javascript:void(0)",
          active: false,
          subMenus: [
            {
              icon: "crop.svg",
              name: "BSP I Status Report",
              href: "/bsp-I-status-report",
              subMenus: undefined
            },
            {
              icon: "crop.svg",
              name: "BSP II Status Report",
              href: "/bsp-II-status-report",
              subMenus: undefined
            },
            {
              icon: "crop.svg",
              name: "BSP III Status Report",
              href: "/bsp-III-status-report",
              subMenus: undefined
            },
            {
              icon: "crop.svg",
              name: "Availability of Breeder Seeds (BSP IV Report)",
              href: "/bsp-four",
              subMenus: undefined
            },
          ]
        },
        {
          icon: "character.svg",
          name: "MIS Reports",
          href: "javascript:void(0)",
          active: false,
          subMenus: [
            {
              icon: "crop.svg",
              name: "Crop-Variety Statistics",//old name "Crop Statistics",
              href: "/crop-statistics",
              subMenus: undefined
            },
            {
              icon: "crop.svg",
              name: "State-wise Crop Statistics",
              href: "/state-wise-crop-statistics",
              subMenus: undefined
            },
            {
              icon: "crop.svg",
              name: "Crop Progress Status",//old name "Crop Status Report",
              href: "/crop-status-report",
              subMenus: undefined
            },
            {
              "name": "List of Crops",
              "href": "/add-crop-report",
              "icon": "crop.svg"
            },
            {
              "name": "List of Crop Varieties",
              "href": "/add-crop-variety-report",
              "icon": "harvest_one.svg"
            },
            {
              "name": "Variety Characterstic Reports",
              "href": "/variety-characterstic-reports",
              "icon": "character.svg"
            },
            {
              "name": "List of Variety Characteristics",
              "href": "/crop-variety-characterstics-report",
              "icon": "character.svg"
            },
          ]
        },
        {
          icon: "character.svg",
          name: "Master Data Reports",
          href: "javascript:void(0)",
          active: false,
          subMenus: [
            {
              "name": "List of Indenters",
              "href": "/list-of-indentors-report",
              "icon": "add_indentor.svg"
            },
            {
              "name": "List of Project Coordinators",//old name:-"List of Project Co-ordinators",
              "href": "/breeder-production-report",
              "icon": "seed_multi_ratio.svg"
            },

            {
              "name": "List of Seed Processing Plants (SPP)", //old name :-"List of SPPs Report",
              "href": "/spp-report",
              "icon": "add_indentor.svg"
            },
            {
              "name": "List of Breeder Seed Production Centers (BSPC)",//old name:-"List of Breeder Seed Production Center",
              "href": "/list-of-breeder-seed-production-center-report",
              "icon": "Add_Breeder.svg"
            },
            {
              "name": "List of Seed Testing Labs (STL)",//old name:-"List  of Seed Testing Laboratory",
              "href": "/seed-testing-laboratory-report",
              "icon": "microscope.svg"
            },
            {
              "name": "Crop Wise Maximum LOT Size",
              "href": "/maximum-lot-size-for-each-crop-report",
              "icon": "size_one.svg"
            },

            // {
            //   "name": "List of Seed Producing Agencies (SPA)",//old name:- "List of SPAs",
            //   "href": "/indenter-report",
            //   "icon": "add_indentor.svg"
            // },
            {
              "name": "Seed Multiplication Ratio",
              "href": "/seed-multiplication-ratio-report",
              "icon": "seed_multi_ratio.svg"
            },
          ]
        },
        //commnet date 12/08/2025 shubham
        // {
        //   icon: "crop.svg",
        //   name: "Intake Verification Register Report",// new report add (jan 15 2025 12:06 PM )
        //   href: "/intake-verification-register-report",
        //   subMenus: undefined
        // },
        // {
        //   "name": "List of Variety Characteristics",
        //   "href": "/crop-variety-characterstics-report",
        //   "icon": "character.svg"
        // },
        // {
        //   "name": "Seed Multiplication Ratio",
        //   "href": "/seed-multiplication-ratio-report",
        //   "icon": "seed_multi_ratio.svg"
        // },

        // {
        //   "name": "Nucleus Seed Availability Report",
        //   "href": "/nucleus-seed-availability-report",
        //   "icon": "Add_Breeder.svg"
        // },
        // {
        //   "name": "BSP Forms",
        //   "href": "javascript:void(0)",
        //   "subMenus": [
        //     {
        //       "name": "BSP I",
        //       "href": "/bsp-one-report"
        //     },
        //     {
        //       "name": "BSP II",
        //       "href": "/bsp-two-report"
        //     },
        //     {
        //       "name": "BSP II Second",
        //       "href": "/bsp-2-report"
        //     },
        //     {
        //       "name": "BSP III",
        //       "href": "/bsp-three-report"
        //     },
        //     {
        //       "name": "BSP IV",
        //       "href": "/bsp-four-report"
        //     },
        //     // {
        //     //   "name": "BSP V(a)",
        //     //   "href": "/bsp-five-a-report"
        //     // },
        //     // {
        //     //   "name": "BSP V(b)",
        //     //   "href": "/bsp-five-b-report"
        //     // },
        //     // {
        //     //   "name": "BSP VI",
        //     //   "href": "/bsp-six-report"
        //     // }
        //   ]


        // },
        // {
        //   "name": "Submit Indents of Breeder Seed (crop wise) ",
        //   "href": "/indent-wise-crop",
        //   "icon": "Add_Breeder.svg"
        // },
        // {
        //   "name": "Submit Indents of Breeder Seed (Indent wise) ",
        //   "href": "/indent-wise-spa-report",
        //   "icon": "Add_Breeder.svg"
        // },
        // {
        //   "name": "Allocation of Breeder Seed To Indenters For Lifting",
        //   "href": "/allocation-of-breeder-seed-report",
        //   "icon": "character.svg"
        // },
        // {
        //   "name": "Status of Lifting Non Lifting Supply Position For Crops",
        //   "href": "/status-of-lifting-non-lifting-supply-position-for-crops",
        //   "icon": "character.svg"
        // },
        // {
        //   "name": "Crop-Wise Breeder Seed Production Status",
        //   "href": "/indenter-report",
        //   "icon": "character.svg"
        // },
        // {
        //   "name": "Availability of Breeder Seeds (BSP IV Report)",
        //   "href": "/bsp-four",
        //   "icon": "seeding.svg"
        // },

        // {
        //   "name": "Status of Lifting/Non-Lifting/Supply Position for Crops",
        //   "href": "/lifting-utilization-of-breeder-seed-report",
        //   "icon": "character.svg"
        // }
        // {
        //   "name": "Submitted Indents of Breeder Seeds",
        //   "href": "/submit-indents-breeder-seeds",
        //   "icon": "seeding.svg"
        // },
        // {
        //   "name": "Allocation of Breeder Seeds to Indentors for Lifting",
        //   "href": "/allocation-of-breeder-seeds-to-indentors-for-lifting-report",
        //   "icon": "character.svg"
        // },
        // {
        //   "name": "Allocation of Breeder Seeds to Indentors for Lifting",
        //   "href": "/allocation-of-breeder-seeds-to-indentors-for-lifting-report",
        //   "icon": "character.svg"
        // },
        // {
        //   "name": "Lifting/ Utilization of Breeder Seed Report",
        //   "href": "/lifting-utilization-of-breeder-seed-report",
        //   "icon": "character.svg"
        // }
      );
    }

    if (this.userRole == "IN") {
      // if (  this.username == "ind-nsai") {

      //   subMenuCollection.push(
      //     {
      //       "name": "Compile Production Report",
      //       "href": "/ms014/nscRo/growerWiseData",
      //       "icon": "seeding.svg"
      //     },
      //   )
      // }

      subMenuCollection.push(

        {
          icon: "seeding.svg",
          name: "List of SPA",
          href: "/list-of-indent-report",
          subMenus: undefined
        },

        // {
        //   "name": "Submission of indent of Breeder Seed by State",
        //   "href": "/submission-of-indent-of-breeder-seed-by-state-report",
        //   "icon": "Add_Breeder.svg"
        // },
        // {
        //   "name": "Submitted Indents of Breeder Seed",
        //   "href": "/submission-for-indents-of-breeder-seed-report",
        //   "icon": "seeding.svg"
        // },
        {
          "name": "Submitted Indents of Breeder Seed (Crop Wise)",
          "href": "/submit-indent-of-breeder-seed-crop-wise",
          "icon": "seeding.svg"
        },
        {
          "name": "Submitted Indents of Breeder Seed (SPA Wise)",
          "href": "/submit-indent-of-spa-wise",
          "icon": "seeding.svg"
        },

        // {
        //   "name": "Allocated Quantity of Breeder Seed to SPAs for Lifting",
        //   "href": "/spa-allocation-report",
        //   "icon": "seeding.svg"
        // },
        // {
        //   "name": "Allocated Quantity by Seed Division for Lifting",
        //   "href": "/allocated-quantity-seed-division",
        //   "icon": "seeding.svg"
        // },
        // {
        //   "name": "Status of Lifting/Non-Lifting of Breeder Seed (Crop Wise)",
        //   "href": "/status-of-lifting-non-lifting-of-breeder-seed-crop-wise",
        //   "icon": "seeding.svg"
        // },
        // {
        //   "name": "Status of Lifting/Non-Lifting of Breeder Seed (SPA Wise)",
        //   "href": "/spa-wise-status-lifting-non-of-breeder-seed",
        //   "icon": "seeding.svg"
        // },

        // {
        //   "name": " Allocated Quantity by Seed Division for Lifting",
        //   "href": "/indenter-report",
        //   "icon": "seeding.svg"
        // },
        // {
        //   "name": "Allocated Quantity of Breeder Seed to SPAs for Lifting",
        //   "href": "/indenter-report",
        //   "icon": "seeding.svg"
        // },
        // {
        //   "name": "Status of Lifting/Non-Lifting of Breeder Seed",
        //   "href": "/indenter-report",
        //   "icon": "Add_Breeder.svg"
        // },

        // {
        //   "name": "List of Indenters",
        //   "href": "/list-of-indentors-report",
        //   "icon": "add_indentor.svg"
        // },
        // {
        //   "name": "Maximum LOT Size for Each Crop",
        //   "href": "/maximum-lot-size-for-each-crop-report",
        //   "icon": "size_one.svg"
        // },
        // {
        //   "name": "Nucleus Seed Availability Report",
        //   "href": "/nucleus-seed-availability-report",
        //   "icon": "Add_Breeder.svg"
        // },

      );

      if (this.userRole == "OILSEEDADMIN") {

        subMenuCollection.push(
          {
            icon: "character.svg",
            name: "Foundation/Certified Reports",
            href: "javascript:void(0)",
            active: false,
            subMenus: [
              {
                'icon': "draft.svg",
                'name': "Area Dashboard",
                'href': "https://seedtrace.gov.in/ms014/oilSeed/areaDashboard",
                'subMenus': undefined
              },
              {
                'icon': "draft.svg",
                'name': "Crop Variety Wise Report",
                'href': "https://seedtrace.gov.in/ms014/oilSeed/cropVarietyWiseData",
                'subMenus': undefined
              },
            ]
          },
        )
      }
  
      if (this.userRole == "PULSESSEEDADMIN") {
        subMenuCollection.push(
          {
            icon: "character.svg",
            name: "Foundation/Certified Reports",
            href: "javascript:void(0)",
            active: false,
            subMenus: [
              {
                'icon': "draft.svg",
                'name': "Area Dashboard",
                'href': "https://seedtrace.gov.in/ms014/pulsesSeed/areaDashboard",
                'subMenus': undefined
              },
              // {
              //   'icon': "draft.svg",
              //   'name': "Crop Variety Wise Report",
              //   'href': "https://seedtrace.gov.in/ms014/oilSeed/cropVarietyWiseData",
              //   'subMenus': undefined
              // },
            ]
          },
        )
      }

    }

    if (this.userRole == "SPP") {

    }

    if (this.userRole == "BPC") {
      subMenuCollection.push(
        {
          "name": "BSP iii Report",
          "href": "/bsp-third-report",
          "icon": "Add_Breeder.svg"
        },
        {
          "name": "BSP ii Report",
          "href": "/bsp-2-report",
          "icon": "Add_Breeder.svg"
        },
        {
          "name": "Assign Crop/Variety to BSPCs",
          "href": "/assigned-crop-variety-report",
          "icon": "Add_Breeder.svg"
        },

        {
          "name": "Created LOT Numbers",
          "href": "/created-lot-numbers-report",
          "icon": "Add_Breeder.svg"
        },
        {
          "name": "Bill/Payment/Certificate",
          "href": "/bill-payment-certificate-report",
          "icon": "Add_Breeder.svg"
        },
        {
          "name": "Seed Testing Laboratory Results",
          "href": "/seed-testing-laboratory-results-reports",
          "icon": "Add_Breeder.svg"
        },
        {
          "name": "Generated Label Numbers",
          "href": "/generated-label-numbers",
          "icon": "Add_Breeder.svg"
        },
        {
          "name": "Breeder Crop List",
          "href": "/list-of-breeders-report",
          "icon": "Add_Breeder.svg"
        },
        {
          "name": "Nucleus Seed Availability Report",
          "href": "/nucleus-seed-availability-report",
          "icon": "Add_Breeder.svg"
        },
        {
          "name": "Allocation of Breeder Seeds to Indenters for Lifting",
          "href": "/allocation-of-breeder-seeds-to-indentors-for-lifting-report",
          "icon": "character.svg"
        },

        {
          "name": "Lifting/ Utilization of Breeder Seed Report",
          "href": "/lifting-utilization-of-breeder-seed-report",
          "icon": "character.svg"
        }
      );
    }

    //for oil seed
    if (this.userRole == "OILSEED") {
      subMenuCollection.push(
        {
          "name": "Lifting/ Utilization of Breeder Seed Report",
          "href": "/lifting-utilization-of-breeder-seed-report",
          "icon": "character.svg"
        }
      );
    }

    subMenuCollection = subMenuCollection.concat(
      [
        // {
        //     "name": "List of Breeders",
        //     "href": "/list-of-breeders-report",
        //     "icon": "Add_Breeder.svg"
        //   },
        // {
        //   "name": "Lifting/ Utilization of Breeder Seed Report",
        //   "href": "/lifting-utilization-of-breeder-seed-report",
        //   "icon": "character.svg"
        // }
      ]);

    return subMenuCollection;
  }

  get getICARMenus() {
    return {
      name: "Nodal Officer (" + this.userRole + ")",
      icon: "Group 1077.svg",
      menus: [
        // {
        //   icon: "Add_Breeder.svg",
        //   name: "Dashboard",
        //   href: "nodal-dashboard",
        //   subMenus: undefined
        // },
        // {
        //   icon: "Add_Breeder.svg",
        //   name: "Dashboard",
        //   href: "nodal-dasboard-seconds",
        //   subMenus: undefined
        // },
        {
          icon: "character.svg",
          name: "Dashboard",
          href: "dashboard-phase-second",
          subMenus: undefined
        },
        {
          icon: "Add_Breeder.svg",
          name: "Indents Received From Seed Division of Breeder Seed",
          href: "nodal-officer-report",
          subMenus: undefined
        },
        {
          "name": "Availability of Breeder Seeds (BSP IV Report)",
          "href": "/bsp-four-report-availability",
          "icon": "Add_Breeder.svg",
        },
        {
          icon: "Add_Breeder.svg",
          name: "Reports",
          href: "javascript:void(0)",
          active: false,
          subMenus: [

            {
              icon: "crop.svg",
              name: "BSP I Status Report",
              href: "/bsp-I-status-report",
              subMenus: undefined
            },
            {
              icon: "crop.svg",
              name: "BSP II Status Report",
              href: "/bsp-II-status-report",
              subMenus: undefined
            },
            {
              icon: "crop.svg",
              name: "BSP III Status Report",
              href: "/bsp-III-status-report",
              subMenus: undefined
            },
            {
              icon: "crop.svg",
              name: "Intake Verification Register Report",// new report add (jan 16 2025 12:06 PM )
              href: "/intake-verification-register-report",
              subMenus: undefined
            }
          ]
        },
        // {
        //   icon: "BSP Proformas 1.svg",
        //   name: "Production Centre Wise Details of Produced Breeder Seed",
        //   href: "/production_center_wise_details_report",
        //   subMenus: undefined
        // },
        // {
        //   icon: "report.svg",
        //   name: "Reports",
        //   href: "javascript:void(0)",
        //   active: false,
        //   subMenus: this.getReportsSubMenu
        // }
      ]
    };
  }

  get allReadonlyMenus() {
    return {
      // "productionCenter": {
      "BPC": {
        name: "Breeder Seed Production Centre (BSPC)",
        icon: "coffee-bean (1).svg",
        menus: [
          {
            icon: "farmer (2)@2x.png",
            name: "Dashboard",
            href: "bsp-dashboard",
            subMenus: undefined
          },
          // {
          //   icon: "farmer (2)@2x.png",
          //   name: "Dashboard Second",
          //   href: "bsp-dashboard-second",
          //   subMenus: undefined
          // },
          {
            icon: "farmer (2)@2x.png",
            name: "Direct/Additional Indent",
            href: "direct-indent",
            subMenus: undefined
          },
          {
            icon: "farmer (2)@2x.png",
            name: "Breeder Seed Production",
            href: "javascript:void(0)",
            active: false,
            subMenus: [
              // {
              //   icon: "farmer (2)@2x.png",
              //   name: "Add Ncleus/Breeder Seed Inventory",
              //   href: "bspc-breeder-seed-inventory",
              //   subMenus: undefined
              // },
              {
                icon: "seeding.svg",
                name: "Willingness to Produce Breeder Seed",
                href: "bspc-breeder-seed-willing-to-produce",
                subMenus: undefined
              },

              {
                "name": "Carry-over/New Seed Production",
                "href": "/carry-over-seed-production",
                "icon": "seeding.svg"
              },
              {
                "name": "Production Schedule and Availability of Breeder Seed (BSP II)",
                "href": "/bsp-two-second",
                "icon": "seeding.svg"
              },
              {
                icon: "seeding.svg",
                name: "Monitoring Team Detail",
                href: "/composition-of-monitoring-team-details",
                subMenus: undefined
              },
              {
                icon: "seeding.svg",
                name: "Inspection Report of the Monitoring Team (BSP III)",
                href: "bsp-third",
                subMenus: undefined
              },
              {
                "name": "Inability to Fulfil Breeder Seed Requirement (Optional Form)",
                "href": "/inability-reallocate-form",
                "icon": "seeding.svg"
              },
              {
                "name": "Harvesting and Intake Register",
                "href": "/harvesting-intake-register",
                "icon": "seeding.svg"
              },

            ]
          },
          {
            // icon: "draft.svg",
            icon: "farmer (2)@2x.png",
            name: "Breeder Seed Testing",
            href: "javascript:void(0)",
            active: false,
            subMenus: [

              {
                icon: "seeding-one.svg",
                name: "Generate Sample Slip For Testing",
                href: "generate-sample-slip-for-testing",
                subMenus: undefined

              },
              {
                icon: "seeding-one.svg",
                name: "Generate Forwarding Letter For Lab Testing",
                href: "generate-forwarding-letter-for-lab-testing",
                subMenus: undefined

              },
              {
                icon: "seeding-one.svg",
                name: "STL Report",
                href: "stl-report-status",
                subMenus: undefined
              },

            ]
          },

          {
            "name": "Availability of Breeder Seeds (BSP IV)",
            "href": "/bsp-four",
            icon: "farmer (2)@2x.png",
          },
          {
            // icon: "draft.svg",
            icon: "farmer (2)@2x.png",
            name: "Grow Out Test",
            href: "javascript:void(0)",
            active: false,
            subMenus: [

              {
                icon: "seeding-one.svg",
                name: "Grow Out Test Sample Reception",
                href: "grow-out-test-sample-reception",
                subMenus: undefined

              },
              {
                icon: "seeding-one.svg",
                name: "Grow Out Test Sowing Details",
                href: "sowing-details",
                subMenus: undefined

              },
              {
                icon: "seeding-one.svg",
                name: "Monitoring Team Detail for GOT",
                href: "got-monitoring-Details",
                subMenus: undefined
              },
              {
                icon: "seeding-one.svg",
                name: "Grow Out Test Result(BSP V(a))",
                href: "grow-of-testing-result",
                subMenus: undefined
              },
              {
                icon: "seeding-one.svg",
                name: "Grow Out Test Report(BSP V(a))",
                href: "grow-of-testing-report",
                subMenus: undefined

              },

            ]
          },
          {
            icon: "farmer (2)@2x.png",
            name: "Beeder Seed Tag Printing",
            href: "javascript:void(0)",
            active: false,
            subMenus: [
              {
                icon: "seeding-one.svg",
                name: "Update Bag Size",
                href: "update-tag-bag-size",
                subMenus: undefined
              },
              {
                icon: "seeding-one.svg",
                name: "Generating Tag Number for Packing of Lots",
                href: "generate-tag-number",
                subMenus: undefined
              },

              {
                icon: "seeding-one.svg",
                name: "Reprint Tag",
                href: "reprint-tag",
                subMenus: undefined
              },
              {
                icon: "seeding-one.svg",
                name: "Discard Tag",
                href: "discard-lot",
                subMenus: undefined
              },

            ]
          },
          {
            icon: "farmer (2)@2x.png",
            name: "Breeder Seed Lifting",
            href: "javascript:void(0)",
            active: false,
            subMenus: [
              {
                "name": "Variety Price List",
                "href": "/variety-price-list",
                icon: "seeding.svg",

              },

              {
                icon: "seeding-one.svg",
                name: "Generate Invoice",
                href: "generate-invoice",
                subMenus: undefined
              },

              {
                icon: "seeding-one.svg",
                name: "Lifting & Billing",
                href: "self-surplus-lifting",
                subMenus: undefined
              },

              {
                icon: "seeding-one.svg",
                name: "Generate Breeder Seed Certificate",
                href: "generate-breeder-seed-certificate",
                subMenus: undefined
              },


            ]
          },
          {
            icon: "farmer (2)@2x.png",
            name: "Lifting of Breeder Seed (BSP Vb)",
            href: "lifting-of-breeder-seed",
            subMenus: undefined
          },


        ]
      },

      // "productionCenter": {
      "OILSEEDADMIN": {
        name: "SEED DIVISION (Oil Seed)",
        icon: "coffee-bean (1).svg",
        menus: [
          // {
          //   icon: "farmer (2)@2x.png",
          //   name: "Dashboard",
          //   href: "bsp-dashboard",
          //   subMenus: undefined
          // },
          {
            icon: "character.svg",
            name: "Dashboard",
            href: "dashboard-phase-second",
            subMenus: undefined
          },
          // {
          //   icon: "farmer (2)@2x.png",
          //   name: "Dashboard Second",
          //   href: "bsp-dashboard-second",
          //   subMenus: undefined
          // },
          {
            icon: "farmer (2)@2x.png",
            name: "Recieved Indent Oil Seed",
            href: "recieved-indent-oil-seed",
            subMenus: undefined
          },
          {
            icon: "character.svg",
            name: "Unfreeze Indents",
            href: "unfreeze-indent",
          },
          {
            "name": "Availability of Breeder Seeds (BSP IV Report)",
            "href": '/bsp-four-report-availability',
            "icon": "Add_Breeder.svg"
          },
          {
            icon: "character.svg",
            name: "Breeder Seed Allocation to Indenters for Lifting",
            // href: "seed-division/breeder-seed-allocation-lifting",
            href: "seed-division/breeder-seed-allocation-lifting/new",
            subMenus: undefined
          },
          {
            icon: "draft.svg",
            name: "Received Indents of Breeder Seed Second",
            href: "submit-indents-breeder-report",
          },
          // {
          //   icon: "draft.svg",
          //   name: "Received Indents of Breeder Seed",
          //   href: "submit-indents-breeder-seeds",
          // },
          // {
          //   icon: "BSP Proformas 1.svg",
          //   name: "Production Centre Wise Details Received By Project Co-ordinators",
          //   href: "/production_center_wise_details_report",
          //   subMenus: undefined
          // },


          // {
          //   icon: "seeding-one.svg",
          //   name: "BSP VI (Utilization of Breeder Seed)",
          //   href: "seed-division/bsp-proformas-6s",
          //   subMenus: undefined
          // },
          {
            icon: "character.svg",
            name: "Foundation/Certified Reports",
            href: "javascript:void(0)",
            active: false,
            subMenus: [
              {
                icon: "draft.svg",
                name: "Area Dashboard",
                href: null,
                externalUrl: "https://seedtrace.gov.in/ms014/oilSeed/areaDashboard"
              },
              {
                icon: "draft.svg",
                name: "GIS Map",
                href: null,
                externalUrl: "https://seedtrace.gov.in/ms014/oilSeed/gisMapDashboard"
              },
              {
                icon: "draft.svg",
                name: "Crop Variety Wise Report",
                href: null,
                externalUrl: "https://seedtrace.gov.in/ms014/oilSeed/cropVarietyWiseData"
              },
              {
                icon: "draft.svg",
                name: "Grower Wise Report",
                href: null,
                externalUrl: "https://seedtrace.gov.in/ms014/oilSeed//growerWiseData"
              },
            ]
          },

          {
            icon: "report.svg",
            name: "Reports",
            href: "javascript:void(0)",
            active: false,
            subMenus: this.getReportsSubMenu
          },
        ]
      },

      "PULSESSEEDADMIN": {
        name: "SEED DIVISION (Pulses seed)",
        icon: "coffee-bean (1).svg",
        menus: [
          // {
          //   icon: "farmer (2)@2x.png",
          //   name: "Dashboard",
          //   href: "bsp-dashboard",
          //   subMenus: undefined
          // },
          {
            icon: "character.svg",
            name: "Dashboard",
            href: "dashboard-phase-second",
            subMenus: undefined
          },
          // {
          //   icon: "farmer (2)@2x.png",
          //   name: "Dashboard Second",
          //   href: "bsp-dashboard-second",
          //   subMenus: undefined
          // },
          {
            icon: "farmer (2)@2x.png",
            name: "Recieved Indent Pulses Seed",
            href: "recieved-indent-pulses-seed",
            subMenus: undefined
          },
          {
            icon: "character.svg",
            name: "Unfreeze Indents",
            href: "unfreeze-indent",
          },
          {
            "name": "Availability of Breeder Seeds (BSP IV Report)",
            "href": '/bsp-four-report-availability',
            "icon": "Add_Breeder.svg"
          },
          {
            icon: "character.svg",
            name: "Breeder Seed Allocation to Indenters for Lifting",
            // href: "seed-division/breeder-seed-allocation-lifting",
            href: "seed-division/breeder-seed-allocation-lifting/new",
            subMenus: undefined
          },
          {
            icon: "draft.svg",
            name: "Received Indents of Breeder Seed Second",
            href: "submit-indents-breeder-report",
          },
          // {
          //   icon: "draft.svg",
          //   name: "Received Indents of Breeder Seed",
          //   href: "submit-indents-breeder-seeds",
          // },
          // {
          //   icon: "BSP Proformas 1.svg",
          //   name: "Production Centre Wise Details Received By Project Co-ordinators",
          //   href: "/production_center_wise_details_report",
          //   subMenus: undefined
          // },


          // {
          //   icon: "seeding-one.svg",
          //   name: "BSP VI (Utilization of Breeder Seed)",
          //   href: "seed-division/bsp-proformas-6s",
          //   subMenus: undefined
          // },
          {
            icon: "character.svg",
            name: "Foundation/Certified Reports",
            href: "javascript:void(0)",
            active: false,
            subMenus: [
              {
                icon: "draft.svg",
                name: "Area Dashboard",
                href: null,
                externalUrl: "https://seedtrace.gov.in/ms014/pulsesSeed/areaDashboard"
              },
              // {
              //   icon: "draft.svg",
              //   name: "GIS Map",
              //   href: null,
              //   externalUrl: "https://seedtrace.gov.in/ms014/oilSeed/gisMapDashboard"
              // },
              // {
              //   icon: "draft.svg",
              //   name: "Crop Variety Wise Report",
              //   href: null,
              //   externalUrl: "https://seedtrace.gov.in/ms014/oilSeed/cropVarietyWiseData"
              // },
              // {
              //   icon: "draft.svg",
              //   name: "Grower Wise Report",
              //   href: null,
              //   externalUrl: "https://seedtrace.gov.in/ms014/oilSeed//growerWiseData"
              // },
            ]
          },

          {
            icon: "report.svg",
            name: "Reports",
            href: "javascript:void(0)",
            active: false,
            subMenus: this.getReportsSubMenu
          },
        ]
      },
      // 
      // "Seed": {
      "SD": {
        name: "Seed Division",
        icon: "Group 1078.png",
        // menus: [{
        // name: "Add Crop",
        // href: "javascript:void(0)",
        // icon:"seeding.svg",
        menus: [
          // {
          //   icon: "character.svg",
          //   name: "Dashboard",
          //   href: "dashboardSeed",
          //   subMenus: undefined
          // },
          // {
          //   icon: "character.svg",
          //   name: "Dashboard",
          //   href: "dashboardSeedSecond",
          //   subMenus: undefined
          // },
          {
            icon: "character.svg",
            name: "Dashboard",
            href: "dashboard-phase-second",
            subMenus: undefined
          },
          {
            icon: "draft.svg",
            name: "Masters",
            href: "javascript:void(0)",
            active: false,
            subMenus: [
              {
                "name": "Add Crop",
                "href": "/add-crop-list",
                "icon": "crop.svg"
              },
              {
                "name": "Add Crop Variety",
                "href": "/add-crop-notified-list",
                "icon": "harvest_one.svg"
              },
              {
                "name": "Add Variety Characteristic",
                "href": "/add-crop-character-list",
                "icon": "character.svg"
              },
              {
                "name": "Add Indenter",
                "href": "/add-indentor-list",
                "icon": "add_indentor.svg"
              },
              {
                "name": "Add Seed Multiplication Ratio",
                "href": "/seed-multiplication-ratio-list",
                "icon": "seed_multi_ratio.svg"
              },
              {
                "name": "Add Maximum LOT Size",
                "href": "/maximum-lot-size-list",
                "icon": "size_one.svg"
              },
              {
                "name": "View Seed Testing Laboratory",
                "href": "/add-seed-testing-laboratory-list",
                "icon": "microscope.svg"
              },
              {
                "name": "Add Freeze Timeline",
                "href": "/add-freeze-timeline-list",
                "icon": "microscope.svg"
              },
              {
                "name": "Add Project Co-ordinator",
                "href": "/add-breeder-list",
                "icon": "Add_Breeder.svg"
              },
              {
                "name": "Add Seed Processing Plant",
                "href": "/add-plant-list",
                "icon": "Add_Breeder.svg"
              },
              {
                "name": "Add Breeder Seed Production Centre",
                "href": "/add-breeder-production-center-list",
                "icon": "Add_Breeder.svg"
              },

            ]
          },
          {
            icon: "character.svg",
            name: "Unfreeze Indents",
            href: "unfreeze-indent",
          },
          {
            icon: "draft.svg",
            name: "Received Indents of Breeder Seed",
            href: "submit-indents-breeder-seeds",
          },
          {
            icon: "BSP Proformas 1.svg",
            name: "Production Centre Wise Details Received By Project Co-ordinators",
            href: "/production_center_wise_details_report",
            subMenus: undefined
          },
          {
            icon: "character.svg",
            name: "Breeder Seed Allocation to Indenters for Lifting",
            // href: "seed-division/breeder-seed-allocation-lifting",
            href: "seed-division/breeder-seed-allocation-lifting/new",
            subMenus: undefined
          },
          {
            icon: "draft.svg",
            name: "Received Indents of Breeder Seed Second",
            href: "submit-indents-breeder-report",
          },
          {
            icon: "seeding-one.svg",
            name: "BSP VI (Utilization of Breeder Seed)",
            href: "seed-division/bsp-proformas-6s",
            subMenus: undefined
          },
          {
            "name": "Availability of Breeder Seeds (BSP IV Report)",
            "href": '/bsp-four-report-availability',
            "icon": "Add_Breeder.svg"
          },
          {
            icon: "character.svg",
            name: "Ticket",
            href: "javascript:void(0)",
            active: false,
            subMenus: [
              {
                icon: "draft.svg",
                name: "Generate Ticket",
                href: null,
                externalUrl: "https://seedtrace.gov.in/ms014/commonRouter/generateTicket"
              },
              {
                icon: "draft.svg",
                name: "Ticket Status",
                href: null,
                externalUrl: "https://seedtrace.gov.in/ms014/commonRouter/ticketStatus"
              },
            ]
          },
          {
            icon: "report.svg",
            name: "Reports",
            href: "javascript:void(0)",
            active: false,
            subMenus: this.getReportsSubMenu
          },
        ]
        // }]
      },
      "SUPERADMIN": {
        name: "Seed Division(SUPER ADMIN)",
        icon: "Group 1078.png",
        // menus: [{
        // name: "Add Crop",
        // href: "javascript:void(0)",
        // icon:"seeding.svg",
        menus: [
          // {
          //   icon: "character.svg",
          //   name: "Dashboard",
          //   href: "dashboardSeed",
          //   subMenus: undefined
          // },
          // {
          //   icon: "character.svg",
          //   name: "Dashboard",
          //   href: "dashboardSeedSecond",
          //   subMenus: undefined
          // },
          {
            icon: "character.svg",
            name: "Dashboard",
            href: "dashboard-phase-second",
            subMenus: undefined
          },
          {
            icon: "draft.svg",
            name: "Masters",
            href: "javascript:void(0)",
            active: false,
            subMenus: [
              {
                "name": "Add Crop",
                "href": "/add-crop-list",
                "icon": "crop.svg"
              },
              {
                "name": "Add Crop Variety",
                "href": "/add-crop-notified-list",
                "icon": "harvest_one.svg"
              },
              {
                "name": "Add Variety Characteristic",
                "href": "/add-crop-character-list",
                "icon": "character.svg"
              },
              {
                "name": "Add Indenter",
                "href": "/add-indentor-list",
                "icon": "add_indentor.svg"
              },
              {
                "name": "Add Seed Multiplication Ratio",
                "href": "/seed-multiplication-ratio-list",
                "icon": "seed_multi_ratio.svg"
              },
              {
                "name": "Add Maximum LOT Size",
                "href": "/maximum-lot-size-list",
                "icon": "size_one.svg"
              },
              {
                "name": "View Seed Testing Laboratory",
                "href": "/add-seed-testing-laboratory-list",
                "icon": "microscope.svg"
              },
              {
                "name": "Add Freeze Timeline",
                "href": "/add-freeze-timeline-list",
                "icon": "microscope.svg"
              },
              {
                "name": "Add Project Co-ordinator",
                "href": "/add-breeder-list",
                "icon": "Add_Breeder.svg"
              },
              {
                "name": "Add Seed Processing Plant",
                "href": "/add-plant-list",
                "icon": "Add_Breeder.svg"
              },
              {
                "name": "Add Breeder Seed Production Centre",
                "href": "/add-breeder-production-center-list",
                "icon": "Add_Breeder.svg"
              },

            ]
          },
          {
            icon: "character.svg",
            name: "Unfreeze Indents",
            href: "unfreeze-indent",
          },
          {
            icon: "draft.svg",
            name: "Received Indents of Breeder Seed",
            href: "submit-indents-breeder-seeds",
          },
          {
            icon: "BSP Proformas 1.svg",
            name: "Production Centre Wise Details Received By Project Co-ordinators",
            href: "/production_center_wise_details_report",
            subMenus: undefined
          },
          {
            icon: "character.svg",
            name: "Breeder Seed Allocation to Indenters for Lifting",
            // href: "seed-division/breeder-seed-allocation-lifting",
            href: "seed-division/breeder-seed-allocation-lifting/new",
            subMenus: undefined
          },
          {
            icon: "draft.svg",
            name: "Received Indents of Breeder Seed Second",
            href: "submit-indents-breeder-report",
          },
          {
            icon: "seeding-one.svg",
            name: "BSP VI (Utilization of Breeder Seed)",
            href: "seed-division/bsp-proformas-6s",
            subMenus: undefined
          },
          {
            "name": "Availability of Breeder Seeds (BSP IV Report)",
            "href": '/bsp-four-report-availability',
            "icon": "Add_Breeder.svg"
          },
          {
            icon: "character.svg",
            name: "Ticket",
            href: "javascript:void(0)",
            active: false,
            subMenus: [
              {
                icon: "draft.svg",
                name: "Generate Ticket",
                href: null,
                externalUrl: "https://seedtrace.gov.in/ms014/commonRouter/generateTicket"
              },
              {
                icon: "draft.svg",
                name: "Ticket Status",
                href: null,
                externalUrl: "https://seedtrace.gov.in/ms014/commonRouter/ticketStatus"
              },
            ]
          },
          {
            icon: "report.svg",
            name: "Reports",
            href: "javascript:void(0)",
            active: false,
            subMenus: this.getReportsSubMenu
          },
        ]
        // }]
      },
      "SPP": {
        name: "Seed Processing Plant (SPP)",
        icon: "Group 1078.png",
        // menus: [{
        // name: "Add Crop",
        // href: "javascript:void(0)",
        // icon:"seeding.svg",
        menus: [
          //New Form but hide for now
          // {
          //   icon: "farmer (2)@2x.png",
          //   name: "Dashboard",
          //   href: "bsp-dashboard-second",
          //   subMenus: undefined
          // },
          {
            icon: "farmer (2)@2x.png",
            name: "Dashboard",
            href: "spp-dashboard",
            subMenus: undefined
          },
          // {
          //   "name": "Creation of LOT Number",
          //   "href": "/lot-number-list",
          //   "icon": "list.svg"
          // },
          {
            "icon": "Add_Breeder.svg",
            name: "Seed Inventory",
            href: "seed-inventory",
            subMenus: undefined
          },
          //New Form but hide for now
          {
            icon: "seeding-one.svg",
            name: "Intake Verification Register",
            href: "intake-verification",
            subMenus: undefined
          },
          // {
          //   icon: "seeding-one.svg",
          //   name: "Reprint Tag",
          //   href: "reprint-tag",
          //   subMenus: undefined
          // },

          {
            icon: "seeding-one.svg",
            name: "Seed Processing Register",
            href: "seed-processing-plant",
            subMenus: undefined
          },
          {
            icon: "seeding-one.svg",
            name: "Seed Processing Register (old Stock)",
            href: "seed-processed-old",
            subMenus: undefined
          },
          // {
          //   icon: "seeding-one.svg",
          //   name: "Generate Sample Slip For Testing",
          //   href: "generate-sample-slip-for-testing",
          //   subMenus: undefined

          // },
          // {
          //   icon: "seeding-one.svg",
          //   name: "Generate Forwarding Letter For Lab Testing",
          //   href: "generate-forwarding-letter-for-lab-testing",
          //   subMenus: undefined

          // },
          // // {
          // //   icon: "seeding-one.svg",
          // //   name: "Generate Forwarding letter for testing",
          // //   href: "forwarding-letter",
          // //   subMenus: undefined
          // // },
          // {
          //   icon: "seeding-one.svg",
          //   name: "STL Report",
          //   href: "stl-report-status",
          //   subMenus: undefined

          // // },

          // },
          // {
          //   "name": "Availability of Breeder Seeds (BSP IV Report)",
          //   "href": '/bsp-four-report-availability',
          //   "icon": "Add_Breeder.svg"
          // },

          // {
          //   icon: "seeding-one.svg",
          //   name: "Invoice",
          //   href: "request-invoice",
          //   subMenus: undefined
          // },

        ]
        // }]
      },
      "SPA": {
        name: "Indenter",
        icon: "Group 1077.svg",
        menus: [
          {
            icon: "seeding.svg",
            name: "Submission for Indents of Breeder Seed",
            href: "/indent-breeder-seed-allocation-list",
            subMenus: undefined
          }
        ]
      },
      // "Indenter": {
      "IN": {
        name: "Indenter",
        icon: "Group 1077.svg",
        menus: [
          {
            icon: "seeding.svg",
            name: "Dashboard",
            href: "/indentor-seed-dashboard",
            subMenus: undefined
          },
          // {
          //   icon: "seeding.svg",
          //   name: "Payment",
          //   href: "/indentor-payment",
          //   subMenus: undefined
          // },

          {
            icon: "seeding.svg",
            name: this.type == 1 ? "Selection of SPAs for Indent Submission" : "Add Seed Producing Agency (SPA) to Raise the Indent",
            href: this.type == 1 ? "/selection-of-spa-for-submission-indent" : "/add-seed-producing-agency-spa-indentor-list",
            subMenus: undefined
          },
          {
            name: "View and Submit the Indent to Seed Division",
            href: "/submission-of-indent-of-breeder-seed-by-state-report",
            icon: "Add_Breeder.svg"
          },
          // {
          //   icon: "seeding.svg",
          //   name: "Add Seed Producing Agency",
          //   href: "/add-seed-producing-agency-spa-indentor-list",
          //   subMenus: undefined
          // },
          // {
          //   icon: "seeding.svg",
          //   name: "Submission for Indents of Breeder Seed",
          //   href: "/indent-breeder-seed-allocation-list",
          //   subMenus: undefined
          // },

          // {
          //   icon: "seeding.svg",
          //   name: "Allocation of Breeder Seed to SPAs For Lifting",
          //   href: "indenters/allocation-of-breeder-seed-to-spa-for-liftings",
          //   subMenus: undefined
          // },
          {
            icon: "seeding.svg",
            name: "Allocation of Breeder Seed to SPAs for Lifting",
            href: "allocation-breeder-seed-spa-wise",
            subMenus: undefined
          },
          // {
          //   icon: "seeding.svg",
          //   name: "Allocation of Breeder Seed to SPAs for Lifting Second",
          //   href: "breeder-seed-allocation-spa",
          //   subMenus: undefined
          // },
          // {
          //   icon: "seeding.svg",
          //   name: "Allocation of Breeder Seed to SPAs For Lifting second List",
          //   href: "allocation-breeder-seed-spa-wise-list",
          //   subMenus: undefined
          // },
          {
            icon: "Reports.svg",
            name: "Reports",
            href: "javascript:void(0)",
            active: false,
            subMenus: this.getReportsSubMenu
          },
          // {
          //   "name": "Availability of Breeder Seeds (BSP IV Report)",
          //   "href": '/bsp-four-report-availability',
          //   "icon": "Add_Breeder.svg"
          // },
        ]
      },

      // "ICAR_NODAL": {
      "ICAR": this.getICARMenus,
      // "ICAR_NODAL": {
      "HICAR": this.getICARMenus,

      // "Breeder": {
      "BR": {

        name: "Project Co-ordinator",
        icon: "breederheading.svg",
        menus: [
          {
            icon: "Add_Breeder.svg",
            name: "Dashboard",
            href: "breeder-dashboard",
            subMenus: undefined
          },
          //Old Form
          // {
          //   icon: "add_breeder_crop.svg",
          //   name: "Assign Crop/Variety",
          //   href: "/add-breeder-crop-list",
          //   subMenus: undefined
          // },
          {
            "name": "Assign Crop/Variety to BSPCs",
            "href": "/assign-crop-second",
            "icon": "Add_Breeder.svg"
          },
          {
            "name": "Composition of Monitoring Team",
            "href": "/composition-of-monitoring",
            "icon": "Add_Breeder.svg"
          },
          {
            "name": "Allotment of Breeder Seed Production Targets (BSP I)",
            "href": "/breeder-bsp-profarma-one",
            "icon": "Add_Breeder.svg"
          },
          {
            "name": "Availability of Breeder Seeds (BSP IV Report)",
            "href": '/bsp-four-report-availability',
            "icon": "Add_Breeder.svg"
          },
          {
            icon: "Add_Breeder.svg",
            name: "Reports",
            href: "javascript:void(0)",
            active: false,
            subMenus: [
              {
                icon: "crop.svg",
                name: "BSP II Status Report",
                href: "/bsp-II-status-report",
                subMenus: undefined
              },
              {
                icon: "crop.svg",
                name: "BSP III Status Report",
                href: "/bsp-III-status-report",
                subMenus: undefined
              },
              {
                icon: "crop.svg",
                name: "Intake Verification Register Report",// new report add (jan 16 2025 12:06 PM )
                href: "/intake-verification-register-report",
                subMenus: undefined
              },
            ]
          },



          //Old Form
          // {
          //   icon: "BSP Proformas 1.svg",
          //   name: "BSP Proforma I (Allocation of Breeder Seed Production)",
          //   href: "/breeder/bsp-proformas/proformas-1s",
          //   subMenus: undefined
          // },
          // {
          //   icon: "BSP Proformas 1.svg",
          //   name: "Production Centre Wise Details of Produced Breeder Seed",
          //   href: "/production_center_wise_details_report",
          //   subMenus: undefined
          // },
          // {
          //   icon: "Reports.svg",
          //   name: "Reports",
          //   href: "javascript:void(0)",
          //   active: false,
          //   subMenus: this.getReportsSubMenu
          // },
        ]
      }
    };
  }

  constructor() {
    this.loadLoggedInUserInfo();
  }

  loadLoggedInUserInfo() {
    // from localStorage
    // user_type
    // this.role = localStorage.getItem('logined_user') ? localStorage.getItem('logined_user') : 'SD';
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.type = userData && userData.is_onboar ? userData.is_onboar : ""
    this.role = userData && userData.user_type ? userData.user_type : 'SD';

    this.addDefaultLoginInfo();
    this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    this.userRollType = this.userRole == "ICAR" ? 'Agriculture' : 'Horticulture';
    this.enabledRoleMenu = this.allReadonlyMenus[(this.userRole)];
  }

  addDefaultLoginInfo() {
    if (!localStorage.getItem('loginInfo')) {
      localStorage.setItem('loginInfo', JSON.stringify({
        address: "Nodal Address-" + random(1, 10),
        designation: "Designation-" + random(1, 10)
      }));
    }
  }

  getMenuAsPerRole(role = null) {
    this.loadLoggedInUserInfo();

    // this.role = role
    return this.enabledRoleMenu;
  }
}
