require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const sendSms = require("../_helpers/sms")
const CallExternalAPI = require("../_helpers/call-external-api")
const stlLab = require("../_helpers/getstl-response")
// const PDFDocument = require("pdfkit");
// const QRCode = require("qrcode");
const path = require("path");
let Validator = require('validatorjs');

const { varietyModel, seasonModel, cropModel } = db

const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator')
const Op = require('sequelize').Op;
const union = require('lodash');
const { where } = require('../models/db');
const productiohelper = require('../_helpers/productionhelper');
const fs = require('fs');
const bsp5GotMemberRelationModel = db.bsp5GotMemberRelationModel;


class StlForms {
  static generateStlReportPdf = async (req, res) => {
  try {
    const { filters, data } = req.body;

    if (!data || data.length === 0) {
      return response(res, status.DATA_NOT_AVAILABLE, 201, "No data to generate PDF");
    }

    const { year, season, crop, variety } = filters;

    // 1 Unique file name
    const uniqueCode = Date.now() + "-" + Math.floor(Math.random() * 1000);
    const fileName = `stl-report-${uniqueCode}.pdf`;
    const filePath = path.join(__dirname, "../public/pdfs", fileName);
    const pdfUrl = `${req.protocol}://${req.get("host")}/pdfs/${fileName}`;

    // 2 QR Code generate
    const qrData = await QRCode.toDataURL(pdfUrl);
    const qrBuffer = Buffer.from(qrData.split(",")[1], "base64");

    // 3 PDF Create
    const doc = new PDFDocument({ margin: 20, size: "A4", layout: "landscape" });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // --- HEADER ---
    doc.rect(30, 20, 80, 60).stroke(); // Logo Placeholder
    doc.fontSize(10).text("", 60, 50, { align: "center" });

    doc.image(qrBuffer, 740, 20, { fit: [80, 80] }); // QR

    doc.fontSize(14).fillColor("green").text("BSPC TEST FOUR", 0, 25, { align: "center" });
    doc.text("AGRA,  UTTAR PRADESH", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(16).fillColor("green").text('"Seed Testing Lab Report"', { align: "center", underline: true });

    doc.moveDown(0.5);
    doc.strokeColor("green").lineWidth(1).moveTo(30, 105).lineTo(800, 105).stroke();

    // --- META INFO ---
    doc.fillColor("black").fontSize(10);
    doc.text(`Year of Indent : ${year || "NA"}`, 30, 110);
    doc.text(`Season : ${season || "NA"}`, 30, 135);
    doc.text(`Date : ${new Date().toLocaleDateString("en-GB")}`, 725, 110);
    doc.text(`Reference Number: STL/${year || "XX"}/${season || "XX"}/1`, 650, 135);

    doc.fontSize(11).fillColor("black").text(`Crop : ${crop || "NA"} (${variety || "NA"})`, 0, 135, { align: "center" });

    // --- TABLE ---
    const tableTop = 170;
    const rowHeight = 22;

    const colWidths = [
      21, 73, 68, 98, 63,   // SNo, Variety, Lot No, Lab Name, Date
      26,26,26,26,           // Physical Purity
      26,26,26,26,           // Determination
      26,26,26,26,           // Germination
      28,28,                 // Seed Health
      37,37,37               // Others
    ];

    const drawCell = (x, y, w, h, text, isHeader=false, bgColor=null, align="center") => {
      if (bgColor) doc.rect(x, y, w, h).fillAndStroke(bgColor, "black");
      else doc.rect(x, y, w, h).stroke();

      doc.fillColor(isHeader ? "white" : "black")
        .font(isHeader ? "Helvetica-Bold" : "Helvetica")
        .fontSize(7)
        .text(text, x+2, y+5, { width: w-4, align });
    };

    // Header Row 1
    let x = 30;
    const firstRow = [
      { text:"SNo", span:1 },
      { text:"Sample Details", span:2 },
      { text:"Testing Details", span:2 },
      { text:"Physical Purity (% by Weight)", span:4 },
      { text:"Determination By (No./Kg)", span:4 },
      { text:"Germination (%)", span:4 },
      { text:"Seed Health", span:2 },
      { text:"Others", span:3 }
    ];

    let tempWidths = [...colWidths];
    firstRow.forEach((col) => {
      const spanWidth = tempWidths.slice(0, col.span).reduce((a,b)=>a+b,0);
      drawCell(x, tableTop, spanWidth, rowHeight, col.text, true, "#9df28a");
      tempWidths.splice(0, col.span);
      x += spanWidth;
    });

    // Header Row 2
    const secondRow = [
      "SNo","Variety","Lot No","Lab Name","Date of test",
      "PS","WS(P)","OCS(P)","IM",
      "WS","OWS","OCS","ODV",
      "NS","AS","DS","HS",
      "FS","ID",
      "Disease","NG","Moisture"
    ];

    x = 30;
    let y = tableTop + rowHeight;
    secondRow.forEach((col,i)=>{
      drawCell(x, y, colWidths[i], rowHeight, col, true, "#9df28a");
      x += colWidths[i];
    });

    // Data Rows
    y += rowHeight;
    data.forEach((row, i) => {
      x = 30;
      const values = [
        i+1,
        row?.m_crop_variety?.variety_name || "NA",
        row.lot_no || "NA",
        row?.seedLabtest?.lab_name || "NA",
        row.date_of_test || "NA",
        row.pure_seed || "NA",
        row.weed_seed_purity || "NA",
        row.other_crop_purity || "NA",
        row.inert_matter || "NA",
        row.weed_seed || "NA",
        row.other_seed || "NA",
        row.other_crop_seed || "NA",
        row.other_distinguisable_varieties || "NA",
        row.normal_seeding || "NA",
        row.abnormal_seeding || "NA",
        row.dead_seed || "NA",
        row.hard_seed || "NA",
        row.fs || "NA",
        row.insect_damage || "NA",
        row.disease || "N/A",
        row.m || "N/A",
        row.husk || "NA",
      ];

      values.forEach((val,j)=>{
        drawCell(x, y, colWidths[j], rowHeight, val);
        x += colWidths[j];
      });
      y += rowHeight;
    });

    // --- SIGNATURE ---
    y += 30;
    const pageWidth = doc.page.width;
    const rightMargin = 30; 
    const boxWidth = 150;

    doc.fontSize(10).fillColor("black");
    doc.text("--SD--", rightMargin, y, { 
      width: pageWidth - (2 * rightMargin) - 50,
      align: "right" 
    });
    doc.text("(Dr. Parimal Tripathi)", pageWidth - rightMargin - boxWidth - 30, y + 12, { width: boxWidth, align: "right" });
    doc.text("Deputy Director", pageWidth - rightMargin - boxWidth - 30, y + 24, { width: boxWidth, align: "right" });


      y += 70;
doc.rect(30, y, 760, 30).fillAndStroke("#fff2cc", "black");

doc.fillColor("black").fontSize(8);

let startX = 35;
let startY = y + 5;

doc.font("Helvetica-Bold").text("PS:", startX, startY, { continued: true });
doc.font("Helvetica").text(" Pure Seed | ", { continued: true });

doc.font("Helvetica-Bold").text("IM:", { continued: true });
doc.font("Helvetica").text(" Inert Matter | ", { continued: true });

doc.font("Helvetica-Bold").text("WS:", { continued: true });
doc.font("Helvetica").text(" Weed Seed | ", { continued: true });

doc.font("Helvetica-Bold").text("WS(P):", { continued: true });
doc.font("Helvetica").text(" Weed Seed (Purity)(%) | ", { continued: true });

doc.font("Helvetica-Bold").text("OCS(P):", { continued: true });
doc.font("Helvetica").text(" Other Crop Seed (Purity)(%) | ", { continued: true });

doc.font("Helvetica-Bold").text("OWS:", { continued: true });
doc.font("Helvetica").text(" Objectionable Weed Seed | ", { continued: true });

doc.font("Helvetica-Bold").text("OCS:", { continued: true });
doc.font("Helvetica").text(" Other Crop Seed | ", { continued: true });

doc.font("Helvetica-Bold").text("NS:", { continued: true });
doc.font("Helvetica").text(" Normal Seedlings | ", { continued: true });

doc.font("Helvetica-Bold").text("AS:", { continued: true });
doc.font("Helvetica").text(" Abnormal Seedlings | ", { continued: true });

doc.font("Helvetica-Bold").text("DS:", { continued: true });
doc.font("Helvetica").text(" Dead Seed | ", { continued: true });

doc.font("Helvetica-Bold").text("HS:", { continued: true });
doc.font("Helvetica").text(" Hard Seed | ", { continued: true });

doc.font("Helvetica-Bold").text("FS:", { continued: true });
doc.font("Helvetica").text(" Fresh Ungerminated | ", { continued: true });

doc.font("Helvetica-Bold").text("ID:", { continued: true });
doc.font("Helvetica").text(" Insect Damage | ", { continued: true });

doc.font("Helvetica-Bold").text("DIS:", { continued: true });
doc.font("Helvetica").text(" Disease | ", { continued: true });

doc.font("Helvetica-Bold").text("ODV:", { continued: true });
doc.font("Helvetica").text(" Other Distinguishable Varieties | ", { continued: true });

doc.font("Helvetica-Bold").text("NG:", { continued: true });
doc.font("Helvetica").text(" Nematode GaPs | ", { continued: true });

doc.font("Helvetica-Bold").text("M:", { continued: true });
doc.font("Helvetica").text(" Moisture", { continued: false });

// const disclaimerY = y + 70;

    // Disclaimer
    const disclaimerY = y + 70;
    doc.font("Helvetica-Bold")
       .fontSize(9)
       .fillColor("black")
       .text("*Note: This is an electronically generated report and does not require signature.", 
             0, disclaimerY, { align: "center" });

    // End PDF
    doc.end();

    stream.on("finish", () => {
      return response(res, status.DATA_AVAILABLE, 200, {
        pdfUrl: pdfUrl,
        qrCode: qrData
      });
    });

  } catch (error) {
    console.error("PDF Generation Error:", error);
    return response(res, status.UNEXPECTED_ERROR, 500, []);
  }
};




static viewStlReportPdf = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "../public/pdfs", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("PDF not found");
  }

  res.download(filePath);
};



  static viewStlReportPdf = (req, res) => {
    const fileName = req.params.fileName; 
    const filePath = path.join(__dirname, "../public/pdfs", fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("PDF not found");
    }

    res.download(filePath);
  };
  static getSeedProcessingRegisterYearDatav1 = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        where: {
          ...userId
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
        ]
      }

      let yearData = await db.seedProcessingRegister.findAll(condition)
      if (yearData) {
        return response(res, status.DATA_AVAILABLE, 200, yearData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static removeDuplicates(data) {
    const uniqueYears = new Set();
    return data.filter(item => {
      if (!uniqueYears.has(item.year)) {
        uniqueYears.add(item.year);
        return true;
      }
      return false;
    });
  }
  static removeDuplicates1(data) {
    const uniqueYears = new Set();
    return data.filter(item => {
      // && item.year && item.season && item.crop_code
      //  && item.year && item.season && item.crop_code
      if (!uniqueYears.has(item.lot_id)) {
        uniqueYears.add(item.lot_id);
        return true;
      }
      return false;
    });
  }

  static getSeedProcessingRegisterYearData = async (req, res) => {
    try {
      let userId;
      let userId1;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
        userId1 = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition;
      condition = {
        include: [
          {

            model: db.carryOverSeedDetailsModel,
            required: false,
            include: [
              {
                model: db.carryOverSeedModel,
                where: {
                  ...userId1
                },
                required: false,
                attributes: []
              }
            ],
            attributes: []
          }
        ],
        where: {
          get_carry_over: 2,
          ...userId
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
          // [sequelize.col('carry_over_seed_detail.lot_no'),'lot_no']
        ],
        raw: true
      }
      let condition1 = {
        include: [
          {
            model: db.investVerifyModel,
            required: false,
            include: [
              {
                model: db.investHarvestingModel,
                where: {
                  ...userId1
                },
                attributes: []
              }
            ],

            attributes: []
          }
        ],

        where: {
          get_carry_over: 1,
          ...userId,
          action: {
            [Op.not]: 2
          }
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
          // [sequelize.col('carry_over_seed_detail.lot_no'),'lot_no']
        ],
        raw: true
      }
      let yearData = await db.seedProcessingRegister.findAll(condition)
      let yearData2 = await db.seedProcessingRegister.findAll(condition1)
      let yearData1 = yearData.concat(yearData2)
      const uniqueData = this.removeDuplicates(yearData1);
      console.log('unique data', uniqueData);
      if (uniqueData) {
        return response(res, status.DATA_AVAILABLE, 200, uniqueData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getSeedProcessingRegisterSeasonDatav1 = async (req, res) => {
    try {
      let userId;
      let userId1;
      console.log('req.body.loginedUserid.id=====', req.body.loginedUserid.id);
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
        userId1 = {
          user_id: req.body.loginedUserid.id
        }
      }

      let condition = {
        include: [
          {
            model: seasonModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.season')), 'season'],
          [sequelize.col('m_season.season'), 'season_name'],

        ],
        where: {
          ...userId
        },
        raw: true
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
      }

      let seasonData = await db.seedProcessingRegister.findAll(condition)
      if (seasonData) {
        return response(res, status.DATA_AVAILABLE, 200, seasonData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getSeedProcessingRegisterSeasonData = async (req, res) => {
    try {
      let userId;
      let userId1;
      console.log('req.body.loginedUserid.id=====', req.body.loginedUserid.id);
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
        userId1 = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition;
      condition = {
        include: [
          {
            model: seasonModel,
            attributes: []
          }
        ],
        where: {
          get_carry_over: 2,
          ...userId
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.season')), 'season'],
          [sequelize.col('m_season.season'), 'season_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
          // [sequelize.col('carry_over_seed_detail.lot_no'),'lot_no']
        ],
        raw: true
      }
      let condition1 = {
        include: [
          // {
          //   model:db.intakeVerificationTags,
          //   required:true,
          //   include:[
          //     {
          //       model:db.investVerifyModel,
          //       required:true,
          //       include:[
          //         {
          //           model:db.investHarvestingModel,
          //           where:{
          //             ...userId
          //           },
          //           attributes:[]
          //         }
          //       ],
          //       where:{
          //         ...userId
          //       },
          //       attributes:[]
          //     }
          //   ],
          //   attributes:[]
          // },
          {
            model: seasonModel,
            attributes: []
          }
        ],
        where: {
          get_carry_over: 1,
          ...userId,
          action: {
            [Op.not]: 2
          }
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.season')), 'season'],
          [sequelize.col('m_season.season'), 'season_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
          // [sequelize.col('carry_over_seed_detail.lot_no'),'lot_no']
        ],
        raw: true
      }
      // let condition = {
      //   include: [
      //     {
      //       model: seasonModel,
      //       attributes: []
      //     }
      //   ],
      //   attributes: [
      //     [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.season')), 'season'],
      //     [sequelize.col('m_season.season'), 'season_name'],

      //   ],
      //   where: {
      //     ...userId
      //   },
      //   raw: true
      // }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
          condition1.where.year = req.body.search.year
        }
      }

      let seasonData = await db.seedProcessingRegister.findAll(condition);
      let seasonData2 = await db.seedProcessingRegister.findAll(condition1);

      let seasonDataNew = seasonData.concat(seasonData2);
      console.log(seasonDataNew, 'seasonDataNew')
      const uniqueData = productiohelper.removeDuplicates(seasonDataNew, 'season');
      if (uniqueData) {
        return response(res, status.DATA_AVAILABLE, 200, uniqueData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getSeedProcessingRegisterCropData = async (req, res) => {
    try {
      let userId;
      let userId1;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
        userId1 = {
          user_id: req.body.loginedUserid.id
        }

      }
      let condition;
      condition = {
        include: [
          {

            model: db.carryOverSeedDetailsModel,
            required: true,
            include: [
              {
                model: db.carryOverSeedModel,
                where: {
                  ...userId1
                },
                required: true,
                attributes: []
              }
            ],
            attributes: []
          }
        ],
        where: {
          get_carry_over: 2,
          ...userId
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.crop_code')), 'crop_code'],
          // [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.season')), 'season'],
          // [sequelize.col('m_season.season'), 'season_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
          // [sequelize.col('carry_over_seed_detail.lot_no'),'lot_no']
        ],
        raw: true
      }
      let condition1 = {
        include: [
          // {
          //   model:db.intakeVerificationTags,
          //   required:true,
          //   include:[
          //     {
          //       model:db.investVerifyModel,
          //       required:true,
          //       where:{
          //         ...userId
          //       },
          //       attributes:[]
          //     }
          //   ],
          //   attributes:[]
          // }
          // {
          //   model:db.investVerifyModel,
          //   required:true,
          //   include:[
          //     {
          //       model:db.investHarvestingModel,
          //       where:{
          //         ...userId
          //       },
          //       attributes:[]
          //     }
          //   ],
          //   where:{
          //     ...userId
          //   },
          //   attributes:[]
          // }
          {
            model: db.investVerifyModel,
            required: false,
            include: [
              {
                model: db.investHarvestingModel,
                where: {
                  ...userId1
                },
                attributes: []
              }
            ],
            attributes: []
          }
        ],
        required: false,
        where: {
          [Op.and]: [
            {
              get_carry_over: 1,
            },
            { ...userId },
            {
              action: {
                [Op.not]: 2
              }
            }
          ]
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.crop_code')), 'crop_code'],
          // [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.season')), 'season'],
          // [sequelize.col('m_season.season'), 'season_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
          // [sequelize.col('carry_over_seed_detail.lot_no'),'lot_no']
        ],
        raw: true
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
          condition1.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
          condition1.where.season = req.body.search.season
        }
      }

      let cropData = await db.seedProcessingRegister.findAll(condition)
      let cropData2 = await db.seedProcessingRegister.findAll(condition1)
      cropData = cropData.concat(cropData2);
      let crop = [];
      if (cropData && cropData.length > 0) {
        cropData.forEach((el) => {
          crop.push(el && el.crop_code ? el.crop_code : '')
        })
      }

      let crops;
      if (cropData && cropData.length > 0) {
        crops = await cropModel.findAll({
          where: {
            crop_code: {
              [Op.in]: crop
            }
          },
          raw: true,
          attributes: [
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
          ]
        })
      }

      if (crops) {
        return response(res, status.DATA_AVAILABLE, 200, crops);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getSeedProcessingRegisterDataold = async (req, res) => {
    let radiodata;
    if (req.body.search.table == 'table1') {
      radiodata = 'STL';
    }
    else {
      radiodata = 'GOT';
    }
    try {
      let userId;
      let userId1;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
        userId1 = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        // attributes: [
        //   [sequelize.col('')]
        // ]
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.SeedForProcessedStack,
            attributes: []
          },
          {
            model: db.ProcessSeedDetails,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            required: true,
            include: [{
              model: db.carryOverSeedModel,
              required: true,
              where: {
                ...userId1
              },
              attributes: []
            }],
            attributes: []
          },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status', 'testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              }
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('seed_processing_register.variety_code_line')],
                  testing_type: radiodata
                },
                // { status: {
                //   [Op.not]:"re-sample"
                // } },
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('seed_processing_register.crop_code')]
                    },
                    { season: [sequelize.col('seed_processing_register.season')] },
                    { year: [sequelize.col('seed_processing_register.year')] },
                    { variety_code: [sequelize.col('seed_processing_register.variety_code')] },
                    { lot_id: [sequelize.col('seed_processing_register.lot_id')] },

                    // { stack_no: [sequelize.col('seed_processing_register.stack_no')] },

                    // {
                    //   status: {
                    //     [Op.eq]: null
                    //   }
                    // },
                  ],
                }
              ]
            }
          }
        ],
        attributes: [
          "*",
          [sequelize.col('processed_seed_detail.no_of_bags'), 'fresh_no_of_bags'],
          [sequelize.col('seed_for_processed_stack.godown_no'), 'fresh_godown_no'],
          [sequelize.col('seed_for_processed_stack.stack_no'), 'fresh_stack_no']
        ],
        nest: true,
        raw: true,
        where: {
          ...userId,
          get_carry_over: 2,

        }
      }
      let condition2 = {
        // attributes: [
        //   [sequelize.col('')]
        // ]
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.SeedForProcessedStack,
            attributes: []
          },
          {
            model: db.ProcessSeedDetails,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            attributes: []
          },
          {
            model: db.investVerifyModel,
            // required: false,
            include: [
              {
                model: db.investHarvestingModel,
                where: {
                  ...userId1
                },
                attributes: []
              }
            ],
            attributes: []
          },
          // {
          //   model: db.intakeVerificationTags,
          //   required: true,
          //   include: [
          //     {
          //     model: db.investVerifyModel,
          //     required: true,
          //     where: {
          //       ...userId
          //     },
          //     attributes: []
          //   }
          // ],
          //   attributes: []
          // },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status', 'testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              }
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('seed_processing_register.variety_code_line')],
                  testing_type: radiodata
                },
                // { status: {
                //   [Op.not]:"re-sample"
                // } },
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('seed_processing_register.crop_code')]
                    },
                    { season: [sequelize.col('seed_processing_register.season')] },
                    { year: [sequelize.col('seed_processing_register.year')] },
                    { variety_code: [sequelize.col('seed_processing_register.variety_code')] },
                    { lot_id: [sequelize.col('seed_processing_register.lot_id')] },

                    // {
                    //   status: {
                    //     [Op.eq]: null
                    //   }
                    // },
                  ],
                }
              ]
            }
          }
        ],
        attributes: [
          "*",
          [sequelize.col('processed_seed_detail.no_of_bags'), 'fresh_no_of_bags'],
          [sequelize.col('seed_for_processed_stack.godown_no'), 'fresh_godown_no'],
          [sequelize.col('seed_for_processed_stack.stack_no'), 'fresh_stack_no']
        ],
        nest: true,
        raw: true,
        where: {
          ...userId,
          get_carry_over: 1,
          action: {
            [Op.not]: 2
          }
        }
      }

      let condition1 = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status', 'testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              }
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('stl_report_status.variety_code_line')],
                  testing_type: radiodata
                },
                // { status: {
                //   [Op.eq]:null
                // } },
                // 
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('stl_report_status.crop_code')]
                    },
                    { season: [sequelize.col('stl_report_status.season')] },
                    { year: [sequelize.col('stl_report_status.year')] },
                    { variety_code: [sequelize.col('stl_report_status.variety_code')] },
                    {
                      lot_id: [sequelize.col('stl_report_status.lot_id')]
                    },
                    // { status: {
                    //   [Op.not]:'re-sample'
                    // } },
                  ],
                }
              ],
            }
          }
        ],
        required: true,
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          status: "re-sample",
          // ...userId
        }
      }
      let condition3 = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.generateSampleSlipsModel,
            required: true,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status', 'testing_type'],
            include: [
              {
                required: false,
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              }
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('stl_report_status.variety_code_line')],
                  testing_type: radiodata
                },
                // { status: {
                //   [Op.eq]:null
                // } },
                // 
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('stl_report_status.crop_code')]
                    },
                    { season: [sequelize.col('stl_report_status.season')] },
                    { year: [sequelize.col('stl_report_status.year')] },
                    { variety_code: [sequelize.col('stl_report_status.variety_code')] },
                    {
                      lot_id: [sequelize.col('stl_report_status.lot_id')]
                    },
                    {
                      status: {
                        [Op.eq]: null
                      }
                    },
                  ],
                }
              ],
            }
          }
        ],
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          status: "re-sample",
          // ...userId
        }
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
          condition1.where.year = req.body.search.year
          condition2.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
          condition1.where.season = req.body.search.season
          condition2.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
          condition1.where.crop_code = req.body.search.crop_code
          condition2.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.table) {
          condition.where.crop_code = req.body.search.crop_code
          condition1.where.crop_code = req.body.search.crop_code
          condition2.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
          // console.log(req.body.search.variety_code_array,'req.body.search.variety_code_arrayreq.body.search.variety_code_array')
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
          condition1.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
        }
      }

      let seedProcessingRegisterData = await db.seedProcessingRegister.findAll(condition)
      let seedProcessingRegisterData2 = await db.seedProcessingRegister.findAll(condition2)

      let stlReportStatusData = await db.stlReportStatusModel.findAll(condition1);
      let stlReportStatusData1 = await db.stlReportStatusModel.findAll(condition3);

      // console.log(stlReportStatusData);
      console.log('stl report length status null', stlReportStatusData1.length)
      console.log('stl report length status re-sample', stlReportStatusData.length)

      let stlFinalArray = []


      // if(stlReportStatusData1.length > 0 && stlReportStatusData.length > 0){
      //   stlFinalArray.push(stlReportStatusData[0])
      // }
      // else if(stlReportStatusData1.length > 0 && stlReportStatusData.length == 0){

      //   stlFinalArray.push(stlReportStatusData1[0])
      // }else{
      //   // stlFinalArray.push(stlReportStatusData)
      // }
      let year = [];
      let season = [];
      let crop_code = [];
      let variety_code = [];
      let variety_line_code = [];
      let lot_id = [];
      for (let key of stlReportStatusData) {
        console.log(key)
        year.push(key.year);
        season.push(key.season);
        crop_code.push(key.crop_code);
        variety_code.push(key.variety_code);
        variety_line_code.push(key.variety_line_code);
        lot_id.push(key.lot_id);
        // if((key.generate_sample_slip.status=="re-sample" && key.status=="re-sample")){

        // }else if(key.status=="re-sample"){
        //   stlFinalArray.push(key)
        // }else{}
      }
      // console.log(seedProcessingRegisterData,'seedProcessingRegisterData')
      // {
      //   variety_line_code:{
      //     [Op.in]:variety_line_code
      //   }
      // },
      let checkStlReport = await db.generateSampleSlipsModel.findAll(
        {
          where: {
            [Op.and]: [
              {
                year: {
                  [Op.in]: year
                }
              },
              {
                season: {
                  [Op.in]: season
                }
              },
              {
                crop_code: {
                  [Op.in]: crop_code
                }
              },
              {
                variety_code: {
                  [Op.in]: variety_code
                }
              },

              {
                lot_id: {
                  [Op.in]: lot_id
                }
              }
            ]
          }
        }
      )
      // console.log('stlReportStatusData===', stlReportStatusData);
      // console.log('checkStlReport===', checkStlReport);
      // Extracting 'generate_sample_slips' from 'checkStlReport' if necessary
      const checkStlReportData = checkStlReport.map(item => item.dataValues);

      // Merge and remove duplicates based on 'unique_code'
      const mergedArray1 = [
        ...stlReportStatusData,
        ...checkStlReportData
      ];

      // Use a Map to ensure uniqueness based on 'unique_code'
      const uniqueArray = Array.from(
        new Map(mergedArray1.map(item => [item.unique_code, item])).values()
      );
      console.log(uniqueArray.length);
      console.log(mergedArray1);
      for (let key of stlReportStatusData) {
        if (key.status !== null && key.status === 're-sample' && key.generate_sample_slip && key.generate_sample_slip.status !== 're-sample') {
          stlFinalArray.push(key)
        } else {
          // stlFinalArray.push(key)
        }
      }
      console.log('stlFinalArray=============', stlReportStatusData);
      let mergedArray = [];
      // console.log(seedProcessingRegisterData,'seedProcessingRegisterData')
      // if (stlReportStatusData && stlReportStatusData.length) {
      mergedArray = [...new Set([...stlReportStatusData, ...seedProcessingRegisterData, ...seedProcessingRegisterData2])];
      // console.log('merge data 1',mergedArray.length)
      // }
      //  else {
      // mergedArray = [...new Set([...seedProcessingRegisterData, ...seedProcessingRegisterData2])];
      // console.log('merge data 1',mergedArray2)
      // }
      // console.log('stlReportStatusData===========',stlFinalArray.length);
      // console.log('mergedArray', mergedArray);
      // function removeDuplicates(seedProcessingRegisterData, prop1, prop2) {
      //   const uniqueData = [];
      //   const keys = new Set();
      //   seedProcessingRegisterData.forEach(obj => {
      //     const key = obj[prop1] + obj[prop2]; // Assuming prop1 and prop2 uniquely identify each object
      //     if (!keys.has(key)) {
      //       keys.add(key);
      //       uniqueData.push(obj);
      //     }
      //   });
      //   return uniqueData;
      // }

      // Call the function to remove duplicates based on 'variety_code' and 'variety_code_line'
      // 'variety_code_line'
      //
      // const uniqueData = mergedArray
      // const uniqueData = this.removeDuplicates1(mergedArray);
      const uniqueData = mergedArray
      if (uniqueData && uniqueData.length) {
        return response(res, status.DATA_AVAILABLE, 200, uniqueData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getSeedProcessingRegisterDatawithoutresample = async (req, res) => {
    let radiodata;
    if (req.body.search.table == 'table1') {
      radiodata = { testing_type: "STL" }

    }
    else {
      radiodata = { testing_type: "GOT" };
    }
    try {
      let userId;
      let userId1;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
        userId1 = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        // attributes: [
        //   [sequelize.col('')]
        // ]
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.SeedForProcessedStack,
            attributes: []
          },
          {
            model: db.ProcessSeedDetails,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            required: true,
            include: [{
              model: db.carryOverSeedModel,
              required: true,
              where: {
                ...userId1
              },
              attributes: []
            }],
            attributes: []
          },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: [['id', 'genrateid'], 'unique_code', 'sample_no', 'chemical_treatment', 'lot_id', 'get_carry_over', 'testing_lab', 'status', 'testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              },
              {
                model: db.userModel,
                attributes: [],
                require: true,
                include: [{
                  model: db.agencyDetailModel,
                  required: true,
                  attributes: ['agency_name']
                }]
              },
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('seed_processing_register.variety_code_line')],

                },
                // { status: {
                //   [Op.not]:"re-sample"
                // } },
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('seed_processing_register.crop_code')]
                    },
                    { season: [sequelize.col('seed_processing_register.season')] },
                    { year: [sequelize.col('seed_processing_register.year')] },
                    { variety_code: [sequelize.col('seed_processing_register.variety_code')] },
                    { lot_id: [sequelize.col('seed_processing_register.lot_id')] },
                    { ...radiodata }

                    // { stack_no: [sequelize.col('seed_processing_register.stack_no')] },

                    // {
                    //   status: {
                    //     [Op.eq]: null
                    //   }
                    // },
                  ],
                }
              ]
            }
          }
        ],
        attributes: [
          "*",
          [sequelize.fn('SUM', sequelize.col('processed_seed_detail.no_of_bags')), 'fresh_no_of_bags'],

          // [sequelize.col('processed_seed_detail.no_of_bags'), 'fresh_no_of_bags'],
          [sequelize.col('seed_for_processed_stack.godown_no'), 'fresh_godown_no'],
          [sequelize.col('seed_for_processed_stack.stack_no'), 'fresh_stack_no']
        ],
        nest: true,
        raw: true,
        where: {
          ...userId,
          get_carry_over: 2,

        },
        group: [
          'seed_processing_register.lot_id',
          'seed_processing_register.variety_code',
          'seed_processing_register.year',
          'seed_processing_register.crop_code',
          'seed_processing_register.season',
          'seed_processing_register.is_active',
          'seed_processing_register.action',
          'seed_processing_register.class_of_seed',
          'seed_processing_register.godown_no',
          'seed_processing_register.stack_no',
          'seed_processing_register.lot_qty',
          'seed_processing_register.no_of_bags',
          'seed_processing_register.total_processed_qty',
          'seed_processing_register.undersize_qty',
          'seed_processing_register.process_loss',
          'seed_processing_register.total_rejected_qty',
          'seed_processing_register.lot_no',
          'seed_processing_register.invest_verify_id',
          'seed_processing_register.tentative_qty',
          'seed_processing_register.recover_qty',
          'seed_processing_register.carry_over_id',
          'seed_processing_register.carr_over_seed_details_id',
          'seed_for_processed_stack.stack_no',
          'seed_processing_register.variety_code_line',
          'seed_processing_register.get_carry_over',
          'seed_processing_register.id',
          'seed_processing_register.bspc_id',
          // 'seed_processing_register.is_bsp_4_submitted',
          'seed_for_processed_stack.godown_no',
          'm_crop_variety.variety_code',
          'm_crop_variety.variety_name',
          'm_variety_line.variety_code',
          'm_variety_line.line_variety_code',
          'm_variety_line.line_variety_name',
          'generate_sample_slip.unique_code',
          'generate_sample_slip.sample_no',
          'generate_sample_slip.chemical_treatment',
          //  'generate_sample_slip.tests',
          'generate_sample_slip.lot_id',
          'generate_sample_slip.id',
          'generate_sample_slip.get_carry_over',
          'generate_sample_slip.testing_lab',
          'generate_sample_slip.status',
          'generate_sample_slip.testing_type',
          'generate_sample_slip->m_seed_test_laboratory.id',
          'generate_sample_slip->user->agency_detail.id'
          //  'generate_sample_slip.m_seed_test_laboratory.lab_name'




        ],

      }
      let condition2 = {
        // attributes: [
        //   [sequelize.col('')]
        // ]
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.SeedForProcessedStack,
            attributes: []
          },
          {
            model: db.ProcessSeedDetails,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            attributes: []
          },
          {
            model: db.investVerifyModel,
            // required: false,
            include: [
              {
                model: db.investHarvestingModel,
                where: {
                  ...userId1
                },
                attributes: []
              }
            ],
            attributes: []
          },
          // {
          //   model: db.intakeVerificationTags,
          //   required: true,
          //   include: [
          //     {
          //     model: db.investVerifyModel,
          //     required: true,
          //     where: {
          //       ...userId
          //     },
          //     attributes: []
          //   }
          // ],
          //   attributes: []
          // },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: [['id', 'genrateid'], 'unique_code', 'sample_no', 'chemical_treatment', 'lot_id', 'get_carry_over', 'testing_lab', 'status', 'testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              },
              {
                model: db.userModel,
                attributes: [],
                require: true,
                include: [{
                  model: db.agencyDetailModel,
                  required: true,
                  attributes: ['agency_name']
                }]
              },
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('seed_processing_register.variety_code_line')],

                },
                // { status: {
                //   [Op.not]:"re-sample"
                // } },
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('seed_processing_register.crop_code')]
                    },
                    { season: [sequelize.col('seed_processing_register.season')] },
                    { year: [sequelize.col('seed_processing_register.year')] },
                    { variety_code: [sequelize.col('seed_processing_register.variety_code')] },
                    { lot_id: [sequelize.col('seed_processing_register.lot_id')] },
                    { ...radiodata }

                    // {
                    //   status: {
                    //     [Op.eq]: null
                    //   }
                    // },
                  ],
                }
              ]
            }
          }
        ],
        attributes: [
          "*",
          [sequelize.fn('SUM', sequelize.col('processed_seed_detail.no_of_bags')), 'fresh_no_of_bags'],

          // [sequelize.col('processed_seed_detail.no_of_bags'), 'fresh_no_of_bags'],
          [sequelize.col('seed_for_processed_stack.godown_no'), 'fresh_godown_no'],
          [sequelize.col('seed_for_processed_stack.stack_no'), 'fresh_stack_no']
        ],
        nest: true,
        raw: true,
        where: {
          ...userId,
          get_carry_over: 1,
          action: {
            [Op.not]: 2
          }
        },
        group: [
          'seed_processing_register.lot_id',
          'seed_processing_register.variety_code',
          'seed_processing_register.year',
          'seed_processing_register.crop_code',
          'seed_processing_register.season',
          'seed_processing_register.is_active',
          'seed_processing_register.action',
          'seed_processing_register.class_of_seed',
          'seed_processing_register.godown_no',
          'seed_processing_register.stack_no',
          'seed_processing_register.lot_qty',
          'seed_processing_register.no_of_bags',
          'seed_processing_register.total_processed_qty',
          'seed_processing_register.undersize_qty',
          'seed_processing_register.process_loss',
          'seed_processing_register.total_rejected_qty',
          'seed_processing_register.lot_no',
          'seed_processing_register.invest_verify_id',
          'seed_processing_register.tentative_qty',
          'seed_processing_register.recover_qty',
          'seed_processing_register.carry_over_id',
          'seed_processing_register.carr_over_seed_details_id',
          'seed_for_processed_stack.stack_no',
          'seed_processing_register.variety_code_line',
          'seed_processing_register.get_carry_over',
          'seed_processing_register.id',
          'seed_processing_register.bspc_id',
          // 'seed_processing_register.is_bsp_4_submitted',
          'seed_for_processed_stack.godown_no',
          'm_crop_variety.variety_code',
          'm_crop_variety.variety_name',
          'm_variety_line.variety_code',
          'm_variety_line.line_variety_code',
          'm_variety_line.line_variety_name',
          'generate_sample_slip.unique_code',
          'generate_sample_slip.sample_no',
          'generate_sample_slip.chemical_treatment',
          //  'generate_sample_slip.tests',
          'generate_sample_slip.lot_id',
          'generate_sample_slip.get_carry_over',
          'generate_sample_slip.testing_lab',
          'generate_sample_slip.status',
          'generate_sample_slip.id',
          'generate_sample_slip.testing_type',
          'generate_sample_slip->m_seed_test_laboratory.id',
          'generate_sample_slip->user->agency_detail.id'
          //  'generate_sample_slip.m_seed_test_laboratory.lab_name'
        ],
      }

      let condition1 = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status', 'testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              },
              {
                model: db.userModel,
                attributes: [],
                require: true,
                include: [{
                  model: db.agencyDetailModel,
                  required: true,
                  attributes: ['agency_name']
                }]
              },
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('stl_report_status.variety_code_line')],

                },

                // { status: {
                //   [Op.eq]:null
                // } },
                // 
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('stl_report_status.crop_code')]
                    },
                    { season: [sequelize.col('stl_report_status.season')] },
                    { year: [sequelize.col('stl_report_status.year')] },
                    { variety_code: [sequelize.col('stl_report_status.variety_code')] },
                    {
                      lot_id: [sequelize.col('stl_report_status.lot_id')]
                    },
                    { ...radiodata }
                    // { status: {
                    //   [Op.not]:'re-sample'
                    // } },
                  ],
                }
              ],
            }
          }
        ],
        required: true,
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          status: "re-sample",
          // ...userId
        }
      }
      let condition3 = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.generateSampleSlipsModel,
            required: true,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status', 'testing_type'],
            include: [
              {
                required: false,
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              },
              {
                model: db.userModel,
                attributes: [],
                require: true,
                include: [{
                  model: db.agencyDetailModel,
                  required: true,
                  attributes: ['agency_name']
                }]
              },
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('stl_report_status.variety_code_line')],

                },
                // { status: {
                //   [Op.eq]:null
                // } },
                // 
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('stl_report_status.crop_code')]
                    },
                    { season: [sequelize.col('stl_report_status.season')] },
                    { year: [sequelize.col('stl_report_status.year')] },
                    { variety_code: [sequelize.col('stl_report_status.variety_code')] },
                    {
                      lot_id: [sequelize.col('stl_report_status.lot_id')]
                    },
                    { ...radiodata },
                    {
                      status: {
                        [Op.eq]: null
                      }
                    },
                  ],
                }
              ],
            }
          }
        ],
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          status: "re-sample",
          // ...userId
        }
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
          condition1.where.year = req.body.search.year
          condition2.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
          condition1.where.season = req.body.search.season
          condition2.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
          condition1.where.crop_code = req.body.search.crop_code
          condition2.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.table) {
          condition.where.crop_code = req.body.search.crop_code
          condition1.where.crop_code = req.body.search.crop_code
          condition2.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
          // console.log(req.body.search.variety_code_array,'req.body.search.variety_code_arrayreq.body.search.variety_code_array')
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
          condition1.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
        }
      }
      console.log("conditinon", condition)
      console.log("stlconditinon1", condition1)
      console.log("conditinon2", condition2)
      console.log("stlconditinon3", condition3)

      let seedProcessingRegisterData = await db.seedProcessingRegister.findAll(condition)
      let seedProcessingRegisterData2 = await db.seedProcessingRegister.findAll(condition2)

      let stlReportStatusData = await db.stlReportStatusModel.findAll(condition1);
      let stlReportStatusData1 = await db.stlReportStatusModel.findAll(condition3);

      // console.log(stlReportStatusData);
      console.log('stl report length status null', stlReportStatusData1.length)
      console.log('stl report length status re-sample', stlReportStatusData.length)

      let stlFinalArray = []


      // if(stlReportStatusData1.length > 0 && stlReportStatusData.length > 0){
      //   stlFinalArray.push(stlReportStatusData[0])
      // }
      // else if(stlReportStatusData1.length > 0 && stlReportStatusData.length == 0){

      //   stlFinalArray.push(stlReportStatusData1[0])
      // }else{
      //   // stlFinalArray.push(stlReportStatusData)
      // }
      let year = [];
      let season = [];
      let crop_code = [];
      let variety_code = [];
      let variety_line_code = [];
      let lot_id = [];
      for (let key of stlReportStatusData) {
        console.log(key)
        year.push(key.year);
        season.push(key.season);
        crop_code.push(key.crop_code);
        variety_code.push(key.variety_code);
        variety_line_code.push(key.variety_line_code);
        lot_id.push(key.lot_id);
        // if((key.generate_sample_slip.status=="re-sample" && key.status=="re-sample")){

        // }else if(key.status=="re-sample"){
        //   stlFinalArray.push(key)
        // }else{}
      }
      // console.log(seedProcessingRegisterData,'seedProcessingRegisterData')
      // {
      //   variety_line_code:{
      //     [Op.in]:variety_line_code
      //   }
      // },
      let checkStlReport = await db.generateSampleSlipsModel.findAll(
        {
          where: {
            [Op.and]: [
              {
                year: {
                  [Op.in]: year
                }
              },
              {
                season: {
                  [Op.in]: season
                }
              },
              {
                crop_code: {
                  [Op.in]: crop_code
                }
              },
              {
                variety_code: {
                  [Op.in]: variety_code
                }
              },

              {
                lot_id: {
                  [Op.in]: lot_id
                }
              }
            ]
          }
        }
      )
      // console.log('stlReportStatusData===', stlReportStatusData);
      // console.log('checkStlReport===', checkStlReport);
      // Extracting 'generate_sample_slips' from 'checkStlReport' if necessary
      const checkStlReportData = checkStlReport.map(item => item.dataValues);

      // Merge and remove duplicates based on 'unique_code'
      const mergedArray1 = [
        ...stlReportStatusData,
        ...checkStlReportData
      ];

      // Use a Map to ensure uniqueness based on 'unique_code'
      const uniqueArray = Array.from(
        new Map(mergedArray1.map(item => [item.unique_code, item])).values()
      );
      console.log(uniqueArray.length);
      console.log(mergedArray1);
      for (let key of stlReportStatusData) {
        if (key.status !== null && key.status === 're-sample' && key.generate_sample_slip && key.generate_sample_slip.status !== 're-sample') {
          stlFinalArray.push(key)
        } else {
          // stlFinalArray.push(key)
        }
      }

      // console.log('stlFinalArray=============', seedProcessingRegisterData);
      for (let key of seedProcessingRegisterData) {
        let genrateslip_id = key.generate_sample_slip.genrateid;
        let generateSampleSlip = key.generate_sample_slip;  // Reference to the current generate_sample_slip

        // Fetch the tests array from the database
        const result = await db.generateSampleSlipsModel.findOne({
          raw: true,
          where: { id: genrateslip_id },
          attributes: ['tests']
        });
        if (result && result.tests) {
          generateSampleSlip.tests = result.tests;  // Attach tests to generateSampleSlip
        }
      }
      for (let key of seedProcessingRegisterData2) {
        let genrateslip_id2 = key.generate_sample_slip.genrateid;
        // console.log("***************",genrateslip_id2);
        let generateSampleSlip2 = key.generate_sample_slip;  // Reference to the current generate_sample_slip

        // Fetch the tests array from the database
        const result = await db.generateSampleSlipsModel.findOne({
          raw: true,
          where: { id: genrateslip_id2 },
          attributes: ['tests']
        });
        if (result && result.tests) {
          generateSampleSlip2.tests = result.tests;  // Attach tests to generateSampleSlip
        }
      }

      // Log the updated seedProcessingRegisterData array to see the results
      // console.log("Updated seedProcessingRegisterData2:", seedProcessingRegisterData2);

      let mergedArray = [];
      // console.log(seedProcessingRegisterData,'seedProcessingRegisterData')
      // if (stlReportStatusData && stlReportStatusData.length) {
      mergedArray = [...new Set([...stlReportStatusData, ...seedProcessingRegisterData, ...seedProcessingRegisterData2])];
      // console.log('merge data 1',mergedArray.length)
      // }
      //  else {
      // mergedArray = [...new Set([...seedProcessingRegisterData, ...seedProcessingRegisterData2])];
      // console.log('merge data 1',mergedArray2)
      // }
      // console.log('stlReportStatusData===========',stlFinalArray.length);
      // console.log('mergedArray', mergedArray);
      // function removeDuplicates(seedProcessingRegisterData, prop1, prop2) {
      //   const uniqueData = [];
      //   const keys = new Set();
      //   seedProcessingRegisterData.forEach(obj => {
      //     const key = obj[prop1] + obj[prop2]; // Assuming prop1 and prop2 uniquely identify each object
      //     if (!keys.has(key)) {
      //       keys.add(key);
      //       uniqueData.push(obj);
      //     }
      //   });
      //   return uniqueData;
      // }

      // Call the function to remove duplicates based on 'variety_code' and 'variety_code_line'
      // 'variety_code_line'
      //
      // const uniqueData = mergedArray
      // const uniqueData = this.removeDuplicates1(mergedArray);
      const uniqueData = mergedArray
      if (uniqueData && uniqueData.length) {
        return response(res, status.DATA_AVAILABLE, 200, uniqueData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getSeedProcessingRegisterData = async (req, res) => {
    let radiodata;
    if (req.body.search.table == 'table1') {
      radiodata = { testing_type: "STL" }

    }
    else {
      radiodata = { testing_type: "GOT" };
    }
    try {
      let userId;
      let userId1;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
        userId1 = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        // attributes: [
        //   [sequelize.col('')]
        // ]
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.SeedForProcessedStack,
            attributes: []
          },
          {
            model: db.ProcessSeedDetails,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            required: true,
            include: [{
              model: db.carryOverSeedModel,
              required: true,
              where: {
                ...userId1
              },
              attributes: []
            }],
            attributes: []
          },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: [['id', 'genrateid'], 'unique_code', 'sample_no', 'chemical_treatment', 'lot_id', 'get_carry_over', 'testing_lab', 'status', 'testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              },
              {
                model: db.userModel,
                attributes: [],
                require: true,
                include: [{
                  model: db.agencyDetailModel,
                  required: true,
                  attributes: ['agency_name']
                }]
              },
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('seed_processing_register.variety_code_line')],

                },
                // { status: {
                //   [Op.not]:"re-sample"
                // } },
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('seed_processing_register.crop_code')]
                    },
                    { season: [sequelize.col('seed_processing_register.season')] },
                    { year: [sequelize.col('seed_processing_register.year')] },
                    { variety_code: [sequelize.col('seed_processing_register.variety_code')] },
                    { lot_id: [sequelize.col('seed_processing_register.lot_id')] },
                    { ...radiodata }

                    // { stack_no: [sequelize.col('seed_processing_register.stack_no')] },

                    // {
                    //   status: {
                    //     [Op.eq]: null
                    //   }
                    // },
                  ],
                }
              ]
            }
          }
        ],
        attributes: [
          "*",
          [sequelize.fn('SUM', sequelize.col('processed_seed_detail.no_of_bags')), 'fresh_no_of_bags'],

          // [sequelize.col('processed_seed_detail.no_of_bags'), 'fresh_no_of_bags'],
          [sequelize.col('seed_for_processed_stack.godown_no'), 'fresh_godown_no'],
          [sequelize.col('seed_for_processed_stack.stack_no'), 'fresh_stack_no']
        ],
        nest: true,
        raw: true,
        where: {
          ...userId,
          get_carry_over: 2,

        },
        group: [
          'seed_processing_register.lot_id',
          'seed_processing_register.variety_code',
          'seed_processing_register.year',
          'seed_processing_register.crop_code',
          'seed_processing_register.season',
          'seed_processing_register.is_active',
          'seed_processing_register.action',
          'seed_processing_register.class_of_seed',
          'seed_processing_register.godown_no',
          'seed_processing_register.stack_no',
          'seed_processing_register.lot_qty',
          'seed_processing_register.no_of_bags',
          'seed_processing_register.total_processed_qty',
          'seed_processing_register.undersize_qty',
          'seed_processing_register.process_loss',
          'seed_processing_register.total_rejected_qty',
          'seed_processing_register.lot_no',
          'seed_processing_register.invest_verify_id',
          'seed_processing_register.tentative_qty',
          'seed_processing_register.recover_qty',
          'seed_processing_register.carry_over_id',
          'seed_processing_register.carr_over_seed_details_id',
          'seed_for_processed_stack.stack_no',
          'seed_processing_register.variety_code_line',
          'seed_processing_register.get_carry_over',
          'seed_processing_register.id',
          'seed_processing_register.bspc_id',
          // 'seed_processing_register.is_bsp_4_submitted',
          'seed_for_processed_stack.godown_no',
          'm_crop_variety.variety_code',
          'm_crop_variety.variety_name',
          'm_variety_line.variety_code',
          'm_variety_line.line_variety_code',
          'm_variety_line.line_variety_name',
          'generate_sample_slip.unique_code',
          'generate_sample_slip.sample_no',
          'generate_sample_slip.chemical_treatment',
          //  'generate_sample_slip.tests',
          'generate_sample_slip.lot_id',
          'generate_sample_slip.id',
          'generate_sample_slip.get_carry_over',
          'generate_sample_slip.testing_lab',
          'generate_sample_slip.status',
          'generate_sample_slip.testing_type',
          'generate_sample_slip->m_seed_test_laboratory.id',
          'generate_sample_slip->user->agency_detail.id'
          //  'generate_sample_slip.m_seed_test_laboratory.lab_name'




        ],

      }
      let condition2 = {
        // attributes: [
        //   [sequelize.col('')]
        // ]
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.SeedForProcessedStack,
            attributes: []
          },
          {
            model: db.ProcessSeedDetails,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            attributes: []
          },
          {
            model: db.investVerifyModel,
            // required: false,
            include: [
              {
                model: db.investHarvestingModel,
                where: {
                  ...userId1
                },
                attributes: []
              }
            ],
            attributes: []
          },
          // {
          //   model: db.intakeVerificationTags,
          //   required: true,
          //   include: [
          //     {
          //     model: db.investVerifyModel,
          //     required: true,
          //     where: {
          //       ...userId
          //     },
          //     attributes: []
          //   }
          // ],
          //   attributes: []
          // },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: [['id', 'genrateid'], 'unique_code', 'sample_no', 'chemical_treatment', 'lot_id', 'get_carry_over', 'testing_lab', 'status', 'testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              },
              {
                model: db.userModel,
                attributes: [],
                require: true,
                include: [{
                  model: db.agencyDetailModel,
                  required: true,
                  attributes: ['agency_name']
                }]
              },
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('seed_processing_register.variety_code_line')],

                },
                // { status: {
                //   [Op.not]:"re-sample"
                // } },
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('seed_processing_register.crop_code')]
                    },
                    { season: [sequelize.col('seed_processing_register.season')] },
                    { year: [sequelize.col('seed_processing_register.year')] },
                    { variety_code: [sequelize.col('seed_processing_register.variety_code')] },
                    { lot_id: [sequelize.col('seed_processing_register.lot_id')] },
                    { ...radiodata }

                    // {
                    //   status: {
                    //     [Op.eq]: null
                    //   }
                    // },
                  ],
                }
              ]
            }
          }
        ],
        attributes: [
          "*",
          [sequelize.fn('SUM', sequelize.col('processed_seed_detail.no_of_bags')), 'fresh_no_of_bags'],

          // [sequelize.col('processed_seed_detail.no_of_bags'), 'fresh_no_of_bags'],
          [sequelize.col('seed_for_processed_stack.godown_no'), 'fresh_godown_no'],
          [sequelize.col('seed_for_processed_stack.stack_no'), 'fresh_stack_no']
        ],
        nest: true,
        raw: true,
        where: {
          ...userId,
          get_carry_over: 1,
          action: {
            [Op.not]: 2
          }
        },
        group: [
          'seed_processing_register.lot_id',
          'seed_processing_register.variety_code',
          'seed_processing_register.year',
          'seed_processing_register.crop_code',
          'seed_processing_register.season',
          'seed_processing_register.is_active',
          'seed_processing_register.action',
          'seed_processing_register.class_of_seed',
          'seed_processing_register.godown_no',
          'seed_processing_register.stack_no',
          'seed_processing_register.lot_qty',
          'seed_processing_register.no_of_bags',
          'seed_processing_register.total_processed_qty',
          'seed_processing_register.undersize_qty',
          'seed_processing_register.process_loss',
          'seed_processing_register.total_rejected_qty',
          'seed_processing_register.lot_no',
          'seed_processing_register.invest_verify_id',
          'seed_processing_register.tentative_qty',
          'seed_processing_register.recover_qty',
          'seed_processing_register.carry_over_id',
          'seed_processing_register.carr_over_seed_details_id',
          'seed_for_processed_stack.stack_no',
          'seed_processing_register.variety_code_line',
          'seed_processing_register.get_carry_over',
          'seed_processing_register.id',
          'seed_processing_register.bspc_id',
          // 'seed_processing_register.is_bsp_4_submitted',
          'seed_for_processed_stack.godown_no',
          'm_crop_variety.variety_code',
          'm_crop_variety.variety_name',
          'm_variety_line.variety_code',
          'm_variety_line.line_variety_code',
          'm_variety_line.line_variety_name',
          'generate_sample_slip.unique_code',
          'generate_sample_slip.sample_no',
          'generate_sample_slip.chemical_treatment',
          //  'generate_sample_slip.tests',
          'generate_sample_slip.lot_id',
          'generate_sample_slip.get_carry_over',
          'generate_sample_slip.testing_lab',
          'generate_sample_slip.status',
          'generate_sample_slip.id',
          'generate_sample_slip.testing_type',
          'generate_sample_slip->m_seed_test_laboratory.id',
          'generate_sample_slip->user->agency_detail.id'
          //  'generate_sample_slip.m_seed_test_laboratory.lab_name'
        ],
      }

      let condition1 = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status', 'testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              },
              {
                model: db.userModel,
                attributes: [],
                require: true,
                include: [{
                  model: db.agencyDetailModel,
                  required: true,
                  attributes: ['agency_name']
                }]
              },
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('stl_report_status.variety_code_line')],

                },

                // { status: {
                //   [Op.eq]:null
                // } },
                // 
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('stl_report_status.crop_code')]
                    },
                    { season: [sequelize.col('stl_report_status.season')] },
                    { year: [sequelize.col('stl_report_status.year')] },
                    { variety_code: [sequelize.col('stl_report_status.variety_code')] },
                    {
                      lot_id: [sequelize.col('stl_report_status.lot_id')]
                    },
                    { ...radiodata }
                    // { status: {
                    //   [Op.not]:'re-sample'
                    // } },
                  ],
                }
              ],
            }
          }
        ],
        required: true,
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          status: "re-sample",
          // ...userId
        }
      }
      let condition3 = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.generateSampleSlipsModel,
            required: true,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status', 'testing_type'],
            include: [
              {
                required: false,
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              },
              {
                model: db.userModel,
                attributes: [],
                require: true,
                include: [{
                  model: db.agencyDetailModel,
                  required: true,
                  attributes: ['agency_name']
                }]
              },
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('stl_report_status.variety_code_line')],

                },
                // { status: {
                //   [Op.eq]:null
                // } },
                // 
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('stl_report_status.crop_code')]
                    },
                    { season: [sequelize.col('stl_report_status.season')] },
                    { year: [sequelize.col('stl_report_status.year')] },
                    { variety_code: [sequelize.col('stl_report_status.variety_code')] },
                    {
                      lot_id: [sequelize.col('stl_report_status.lot_id')]
                    },
                    { ...radiodata },
                    {
                      status: {
                        [Op.eq]: null
                      }
                    },
                  ],
                }
              ],
            }
          }
        ],
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          status: "re-sample",
          // ...userId
        }
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
          condition1.where.year = req.body.search.year
          condition2.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
          condition1.where.season = req.body.search.season
          condition2.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
          condition1.where.crop_code = req.body.search.crop_code
          condition2.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.table) {
          condition.where.crop_code = req.body.search.crop_code
          condition1.where.crop_code = req.body.search.crop_code
          condition2.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
          // console.log(req.body.search.variety_code_array,'req.body.search.variety_code_arrayreq.body.search.variety_code_array')
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
          condition1.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
        }
      }
      // console.log("conditinon",condition)
      // console.log("stlconditinon1",condition1)
      // console.log("conditinon2",condition2)
      // console.log("stlconditinon3",condition3)

      let seedProcessingRegisterData = await db.seedProcessingRegister.findAll(condition)
      let seedProcessingRegisterData2 = await db.seedProcessingRegister.findAll(condition2)

      // let stlReportStatusData = await db.stlReportStatusModel.findAll(condition1);
      // let stlReportStatusData1 = await db.stlReportStatusModel.findAll(condition3);

      let stlReportStatusData;
      let stlReportStatusData1
      // for resample
      if (req.body.search.table == 'table1') {
        stlReportStatusData = await db.stlReportStatusModel.findAll(condition1);
        stlReportStatusData1 = await db.stlReportStatusModel.findAll(condition3);

      }
      else {
        stlReportStatusData1 = '';
        stlReportStatusData = '';
      }

      //  console.log(stlReportStatusData,"ugnuyhu");
      console.log('stl report length status null', stlReportStatusData1.length)
      console.log('stl report length status re-sample', stlReportStatusData.length)

      let stlFinalArray = []


      // if(stlReportStatusData1.length > 0 && stlReportStatusData.length > 0){
      //   stlFinalArray.push(stlReportStatusData[0])
      // }
      // else if(stlReportStatusData1.length > 0 && stlReportStatusData.length == 0){

      //   stlFinalArray.push(stlReportStatusData1[0])
      // }else{
      //   // stlFinalArray.push(stlReportStatusData)
      // }
      let year = [];
      let season = [];
      let crop_code = [];
      let variety_code = [];
      let variety_line_code = [];
      let lot_id = [];
      for (let key of stlReportStatusData) {
        console.log(key)
        year.push(key.year);
        season.push(key.season);
        crop_code.push(key.crop_code);
        variety_code.push(key.variety_code);
        variety_line_code.push(key.variety_line_code);
        lot_id.push(key.lot_id);
        // if((key.generate_sample_slip.status=="re-sample" && key.status=="re-sample")){

        // }else if(key.status=="re-sample"){
        //   stlFinalArray.push(key)
        // }else{}
      }
      // console.log(seedProcessingRegisterData,'seedProcessingRegisterData')
      // {
      //   variety_line_code:{
      //     [Op.in]:variety_line_code
      //   }
      // },
      let checkStlReport = await db.generateSampleSlipsModel.findAll(
        {
          where: {
            [Op.and]: [
              {
                year: {
                  [Op.in]: year
                }
              },
              {
                season: {
                  [Op.in]: season
                }
              },
              {
                crop_code: {
                  [Op.in]: crop_code
                }
              },
              {
                variety_code: {
                  [Op.in]: variety_code
                }
              },

              {
                lot_id: {
                  [Op.in]: lot_id
                }
              }
            ]
          }
        }
      )
      // console.log('stlReportStatusData===', stlReportStatusData);
      // console.log('checkStlReport===', checkStlReport);
      // Extracting 'generate_sample_slips' from 'checkStlReport' if necessary
      const checkStlReportData = checkStlReport.map(item => item.dataValues);

      // Merge and remove duplicates based on 'unique_code'
      const mergedArray1 = [
        ...stlReportStatusData,
        ...checkStlReportData
      ];

      // Use a Map to ensure uniqueness based on 'unique_code'
      const uniqueArray = Array.from(
        new Map(mergedArray1.map(item => [item.unique_code, item])).values()
      );
      console.log(uniqueArray.length);
      console.log(mergedArray1);
      for (let key of stlReportStatusData) {
        if (key.status !== null && key.status === 're-sample' && key.generate_sample_slip && key.generate_sample_slip.status !== 're-sample') {
          stlFinalArray.push(key)
        } else {
          // stlFinalArray.push(key)
        }
      }

      // console.log('stlFinalArray=============', seedProcessingRegisterData);
      for (let key of seedProcessingRegisterData) {
        let genrateslip_id = key.generate_sample_slip.genrateid;
        let generateSampleSlip = key.generate_sample_slip;  // Reference to the current generate_sample_slip

        // Fetch the tests array from the database
        const result = await db.generateSampleSlipsModel.findOne({
          raw: true,
          where: { id: genrateslip_id },
          attributes: ['tests']
        });
        if (result && result.tests) {
          generateSampleSlip.tests = result.tests;  // Attach tests to generateSampleSlip
        }
      }
      for (let key of seedProcessingRegisterData2) {
        let genrateslip_id2 = key.generate_sample_slip.genrateid;
        // console.log("***************",genrateslip_id2);
        let generateSampleSlip2 = key.generate_sample_slip;  // Reference to the current generate_sample_slip

        // Fetch the tests array from the database
        const result = await db.generateSampleSlipsModel.findOne({
          raw: true,
          where: { id: genrateslip_id2 },
          attributes: ['tests']
        });
        if (result && result.tests) {
          generateSampleSlip2.tests = result.tests;  // Attach tests to generateSampleSlip
        }
      }

      // Log the updated seedProcessingRegisterData array to see the results
      // console.log("Updated seedProcessingRegisterData2:", seedProcessingRegisterData2);

      let mergedArray = [];
      // console.log(seedProcessingRegisterData,'seedProcessingRegisterData')
      // if (stlReportStatusData && stlReportStatusData.length) {
      mergedArray = [...new Set([...stlReportStatusData, ...seedProcessingRegisterData, ...seedProcessingRegisterData2])];
      // console.log('merge data 1',mergedArray.length)
      // }
      //  else {
      // mergedArray = [...new Set([...seedProcessingRegisterData, ...seedProcessingRegisterData2])];
      // console.log('merge data 1',mergedArray2)
      // }
      // console.log('stlReportStatusData===========',stlFinalArray.length);
      // console.log('mergedArray', mergedArray);
      // function removeDuplicates(seedProcessingRegisterData, prop1, prop2) {
      //   const uniqueData = [];
      //   const keys = new Set();
      //   seedProcessingRegisterData.forEach(obj => {
      //     const key = obj[prop1] + obj[prop2]; // Assuming prop1 and prop2 uniquely identify each object
      //     if (!keys.has(key)) {
      //       keys.add(key);
      //       uniqueData.push(obj);
      //     }
      //   });
      //   return uniqueData;
      // }

      // Call the function to remove duplicates based on 'variety_code' and 'variety_code_line'
      // 'variety_code_line'
      //
      // const uniqueData = mergedArray
      // const uniqueData = this.removeDuplicates1(mergedArray);
      const uniqueData = mergedArray
      if (uniqueData && uniqueData.length) {
        return response(res, status.DATA_AVAILABLE, 200, uniqueData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static addGenerateSampleSlipDataold = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body) {
        if (req.body.generateSampleSlipData && req.body.generateSampleSlipData.length) {
          let data;
          for (let key of req.body.generateSampleSlipData) {
            // console.log("***************",key.radio_value);
            let rules = {
              "year": 'required|integer',
              "season": 'required|string',
              "crop_code": 'required|string',
              "variety_code": 'required|string',
              "lot_no": 'required|string',
              // "class_of_seed": 'required|string',
              // "godown_no": 'required',
              // "stack_no": 'required',
              // "no_of_bags": 'required',
              // "total_processed_qnt": 'required',
              // "unique_code": 'required',
              // "sample_no": 'required',
              "testing_lab": 'required',
              "chemical_treatment": 'required',
            };

            if (key.radio_value === "table2") {
              delete rules.lot_no;  // Remove the 'lot_no' rule for 'table1'
              rules.got_bspc_id = 'required|string';
            }
            let validation = new Validator(key, rules);
            const isValidData = validation.passes();

            if (!isValidData) {
              let errorResponse = {};
              for (let key in rules) {
                const error = validation.errors.get(key);
                if (error.length) {
                  errorResponse[key] = error;
                }
              }
              return response(res, status.BAD_REQUEST, 400, errorResponse, [])
            }
          }
          for (let key of req.body.generateSampleSlipData) {
            let randomCode = '';
            let sampleNo;
            if (key && key.choose_sample && key.choose_sample == true) {

              const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              for (let i = 0; i < 8; i++) {
                randomCode += charset.charAt(Math.floor(Math.random() * charset.length));
              }
              let isExist = await db.generateSampleSlipsModel.findOne({
                where: {
                  unique_code: randomCode
                }
              });
              if (isExist) {
                for (let i = 0; i < 8; i++) {
                  randomCode += charset.charAt(Math.floor(Math.random() * charset.length));
                }
              }
              let isrunning = await db.generateSampleSlipsModel.findOne({
                where: {
                  year: key.year,
                  season: key.season,
                  crop_code: key.crop_code,
                  // variety_code: key.variety_code,
                  ...userId
                },
                attributes: ['sample_no'],
                order: [['sample_no', "DESC"]]
              });
              if (isrunning) {
                sampleNo = isrunning.sample_no + 1;
              } else {
                sampleNo = 1;
              }
              data = await db.generateSampleSlipsModel.create({
                year: key.year ? key.year : "",
                season: key.season ? key.season : "",
                crop_code: key.crop_code ? key.crop_code : "",
                variety_code: key.variety_code ? key.variety_code : "",
                lot_no: key.lot_no ? key.lot_no : "",
                class_of_seed: key.class_of_seed ? key.class_of_seed : null,
                godown_no: key.godown_no ? key.godown_no : null,
                stack_no: key.stack_no ? key.stack_no : null,
                no_of_bags: key.no_of_bags ? key.no_of_bags : null,
                total_processed_qnt: key.total_processed_qnt ? key.total_processed_qnt : null,
                unique_code: randomCode ? randomCode : "",
                sample_no: sampleNo ? sampleNo : 1,
                testing_lab: key && key.testing_lab ? parseInt(key.testing_lab) : null,
                chemical_treatment: key.chemical_treatment,
                tests: key.tests ? key.tests : null,
                lot_id: key.lot_id ? key.lot_id : null,
                get_carry_over: key.get_carry_over ? key.get_carry_over : null,
                variety_code_line: key.variety_code_line ? key.variety_code_line : null,
                status: key.status ? key.status : null,
                ...userId
              });
              let stlStatusUpdate;
              if (key.status == "re-sample") {
                stlStatusUpdate = await db.stlReportStatusModel.update({
                  status: "re-sample-forwarding"
                }, {
                  where: {
                    year: key.year ? key.year : "",
                    season: key.season ? key.season : "",
                    crop_code: key.crop_code ? key.crop_code : "",
                    variety_code: key.variety_code ? key.variety_code : "",
                    lot_id: key.lot_id ? key.lot_id : null,
                  }
                })
              }
              if (key && key.tests && key.tests.length) {
                for (let item of key.tests) {
                  let data1 = await db.generateSampleSlipsTestsModel.create({
                    generate_sample_slip_id: data.dataValues.id,
                    test_id: item.id
                  });
                }
              }
            }
          }
          if (data) {
            return response(res, status.DATA_SAVE, 200, req.body);
          } else {
            return response(res, status.DATA_NOT_SAVE, 201);
          }
        } else {
          return response(res, "all fields data required", 201, []);
        }
      } else {
        return response(res, "all fields data required", 201, []);
      }
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error);
    }
  }

  static addGenerateSampleSlipData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body) {
        if (req.body.generateSampleSlipData && req.body.generateSampleSlipData.length) {
          let data;
          for (let key of req.body.generateSampleSlipData) {
            // console.log("***************",key.radio_value);

            let rules = {
              "year": 'required|integer',
              "season": 'required|string',
              "crop_code": 'required|string',
              "variety_code": 'required|string',
              "lot_no": 'required|string',
              // "class_of_seed": 'required|string',
              // "godown_no": 'required',
              // "stack_no": 'required',
              // "no_of_bags": 'required',
              // "total_processed_qnt": 'required',
              // "unique_code": 'required',
              // "sample_no": 'required',
              "testing_lab": 'required',
              "chemical_treatment": 'required',
            };
            if (key.radio_value === "table2") {

              delete rules.lot_no;  // Remove the 'lot_no' rule for 'table1'
              delete rules.testing_lab,
                delete rules.chemical_treatment
              rules.selected_bspc_id = 'required|integer';
            }
            let validation = new Validator(key, rules);
            const isValidData = validation.passes();

            if (!isValidData) {
              let errorResponse = {};
              for (let key in rules) {
                const error = validation.errors.get(key);
                if (error.length) {
                  errorResponse[key] = error;
                }
              }
              return response(res, status.BAD_REQUEST, 400, errorResponse, [])
            }
          }

          for (let key of req.body.generateSampleSlipData) {
            // console.log("hguihoirio",req.body.generateSampleSlipData);
            let radiobutton;
            if (key.radio_value === "table2") {
              radiobutton = "GOT";
            }
            else {
              radiobutton = "STL";
            }
            let randomCode = '';
            let sampleNo;
            if (key && key.choose_sample && key.choose_sample == true) {

              // console.log("fhhejrhgi",key.choose_sample);
              const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              for (let i = 0; i < 8; i++) {
                randomCode += charset.charAt(Math.floor(Math.random() * charset.length));
              }
              let isExist = await db.generateSampleSlipsModel.findOne({
                where: {
                  unique_code: randomCode
                }
              });
              // console.log("random))))))))))))");

              if (isExist) {
                for (let i = 0; i < 8; i++) {
                  randomCode += charset.charAt(Math.floor(Math.random() * charset.length));
                }
              }
              let isrunning = await db.generateSampleSlipsModel.findOne({
                where: {
                  year: key.year,
                  season: key.season,
                  crop_code: key.crop_code,
                  testing_type: radiobutton,
                  // variety_code: key.variety_code,
                  ...userId
                },
                attributes: ['sample_no'],
                order: [['sample_no', "DESC"]]
              });
              if (isrunning) {
                sampleNo = isrunning.sample_no + 1;
              } else {
                sampleNo = 1;
              }
              // let radiobutton;
              // if (key.radio_value === "table2")
              //     {
              //       radiobutton = "GOT";
              //     }
              //     else{
              //        radiobutton = "STL";
              //     }


              data = await db.generateSampleSlipsModel.create({
                year: key.year ? key.year : "",
                season: key.season ? key.season : "",
                crop_code: key.crop_code ? key.crop_code : "",
                variety_code: key.variety_code ? key.variety_code : "",
                lot_no: key.lot_no ? key.lot_no : "",
                class_of_seed: key.class_of_seed ? key.class_of_seed : null,
                godown_no: key.godown_no ? key.godown_no : null,
                stack_no: key.stack_no ? key.stack_no : null,
                no_of_bags: key.no_of_bags ? key.no_of_bags : null,
                total_processed_qnt: key.total_processed_qnt ? key.total_processed_qnt : null,
                unique_code: randomCode ? randomCode : "",
                sample_no: sampleNo ? sampleNo : 1,
                testing_lab: key && key.testing_lab ? parseInt(key.testing_lab) : null,
                chemical_treatment: key.chemical_treatment,
                tests: key.tests ? key.tests : null,
                lot_id: key.lot_id ? key.lot_id : null,
                get_carry_over: key.get_carry_over ? key.get_carry_over : null,
                variety_code_line: key.variety_code_line ? key.variety_code_line : null,
                status: key.status ? key.status : null,
                testing_type: radiobutton,
                got_bspc_id: key.selected_bspc_id ? key.selected_bspc_id : null,
                state_code: key.state_code ? key.state_code : null,
                ...userId
              });
              let stlStatusUpdate;
              if (key.status == "re-sample") {
                stlStatusUpdate = await db.stlReportStatusModel.update({
                  status: "re-sample-forwarding"
                }, {
                  where: {
                    year: key.year ? key.year : "",
                    season: key.season ? key.season : "",
                    crop_code: key.crop_code ? key.crop_code : "",
                    variety_code: key.variety_code ? key.variety_code : "",
                    lot_id: key.lot_id ? key.lot_id : null,
                  }
                })
              }
              if (key && key.tests && key.tests.length) {
                for (let item of key.tests) {
                  let data1 = await db.generateSampleSlipsTestsModel.create({
                    generate_sample_slip_id: data.dataValues.id,
                    test_id: item.id
                  });
                }
              }
            }
          }
          if (data) {
            return response(res, status.DATA_SAVE, 200, req.body);
          } else {
            return response(res, status.DATA_NOT_SAVE, 201);
          }
        } else {
          return response(res, "all fields data required", 201, []);
        }
      } else {
        return response(res, "all fields data required", 201, []);
      }
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error);
    }
  }

  static getGenerateSampleSlipDataold = async (req, res) => {
    try {

      let userId;
      let querySet;
      let attributesSet;
      let lotArray = [];
      let statusArray = [];
      let conditionSet;
      let statusArrayCondition = {};

      if (req.body.lot_no_array && req.body.lot_no_array.length) {

        req.body.lot_no_array.forEach(ele => {
          lotArray.push(ele.lot_id);
          if (ele.lot_id && ele.status) {
            if (ele.status) {
              statusArray.push(ele.status)
            }
            statusArrayCondition = {
              status: {
                [Op.notIn]: statusArray
              }
            }
          };
          if (statusArray && statusArray.length) {
            conditionSet = {
              [Op.or]: [
                {
                  status: {
                    [Op.eq]: null
                  }
                }
              ]
            }
          }
        })
      }
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body && req.body.get_caary_over === 1) {
        querySet = {
          model: db.investVerifyModel,
          required: false,
          attributes: [

          ],
          where: {
          },
          include: [
            {

              model: db.investHarvestingModel,
              attributes: [
              ]

              // model: db.investVerifyModel,
              // attributes: [],
              // include: [

              // ]
            }
          ]
        }
        // attributesSet = [[sequelize.col('intake_verification_tag.invest_verification.invest_harvesting.user_id'), 'bspc_id']]
      } else if (req.body && req.body.get_caary_over === 2) {
        querySet = {
          model: db.carryOverSeedDetailsModel,
          attributes: [],
          include: [
            {
              model: db.carryOverSeedModel,
              attributes: [
              ]
            }
          ]
        }
        // attributesSet = [[sequelize.col('carry_over_seed_detail->carry_over_seed.user_id'), 'bspc_id']]
      } else {
        querySet = {
          model: db.intakeVerificationTags,
          required: false,
          attributes: [

          ],
          where: {
          },
          include: [
            {
              model: db.investVerifyModel,
              attributes: [],
              include: [
                {
                  model: db.investHarvestingModel,
                  attributes: [
                  ]
                }
              ]
            }
          ]
        }
        // attributesSet =[]
        // attributesSet = [[sequelize.col('intake_verification_tag.invest_verification.invest_harvesting.user_id'), 'bspc_id']]
      }

      let condition = {
        // attributes: ['id'],
        include: [
          {
            model: cropModel,
            attributes: [],
            required: true,
          },
          {
            model: db.varietyModel,
            attributes: [],
            required: true,
          },
          {
            model: db.varietLineModel,
            attributes: []
          },
          { ...querySet }
        ],
        where: {
          ...userId,
          [Op.or]: [
            {
              ...conditionSet,

            },
            {
              [Op.and]: [
                {
                  unique_code: {
                    [Op.not]: null
                  }
                },
                {
                  unique_code: {
                    [Op.not]: ""
                  }
                },

                statusArrayCondition
              ]
            }
          ]
        },
        attributes: [
          "*",
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
        ],
        raw: true
      }

      if (req.body) {
        if (req.body.year) {
          condition.where.year = req.body.year;
        }

        if (req.body.season) {
          condition.where.season = req.body.season
        }

        if (req.body.crop_code) {
          condition.where.crop_code = req.body.crop_code
        }
        req.body.lot_no_array
        if (req.body.lot_no_array && req.body.lot_no_array.length) {
          let lotArray = [];
          let statusArray = [];
          req.body.lot_no_array.forEach(ele => {
            lotArray.push(ele.lot_id);
            if (ele.lot_id && ele.status) {
              statusArray.push(ele.status)
            };
          })
          // req.body.lot_no_array.forEach(ele=>{

          // })
          if (lotArray && lotArray.length) {
            condition.where.lot_id = {
              [Op.in]: lotArray
            }
          }
          // if (statusArray && statusArray.length) {
          //   condition.where.status = {
          //     [Op.notIn]: statusArray
          //   }

          // }
        }
      }

      let dataList = await db.generateSampleSlipsModel.findAll(condition);
      if (dataList && dataList.length) {
        return response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }

    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getGenerateSampleSlipDatanotworking = async (req, res) => {
    try {

      let userId;
      let querySet;
      let attributesSet;
      let lotArray = [];
      let statusArray = [];
      let conditionSet;
      let statusArrayCondition = {};

      if (req.body.lot_no_array && req.body.lot_no_array.length) {

        req.body.lot_no_array.forEach(ele => {
          lotArray.push(ele.lot_id);
          if (ele.lot_id && ele.status) {
            if (ele.status) {
              statusArray.push(ele.status)
            }
            statusArrayCondition = {
              status: {
                [Op.notIn]: statusArray
              }
            }
          };
          if (statusArray && statusArray.length) {
            conditionSet = {
              [Op.or]: [
                {
                  status: {
                    [Op.eq]: null
                  }
                }
              ]
            }
          }
        })
      }
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body && req.body.get_caary_over === 1) {
        querySet = {
          model: db.investVerifyModel,
          required: false,
          attributes: [

          ],
          where: {
          },
          include: [
            {

              model: db.investHarvestingModel,
              attributes: [
              ]

              // model: db.investVerifyModel,
              // attributes: [],
              // include: [

              // ]
            }
          ]
        }
        // attributesSet = [[sequelize.col('intake_verification_tag.invest_verification.invest_harvesting.user_id'), 'bspc_id']]
      } else if (req.body && req.body.get_caary_over === 2) {
        querySet = {
          model: db.carryOverSeedDetailsModel,
          attributes: [],
          include: [
            {
              model: db.carryOverSeedModel,
              attributes: [
              ]
            }
          ]
        }
        // attributesSet = [[sequelize.col('carry_over_seed_detail->carry_over_seed.user_id'), 'bspc_id']]
      } else {
        querySet = {
          model: db.intakeVerificationTags,
          required: false,
          attributes: [

          ],
          where: {
          },
          include: [
            {
              model: db.investVerifyModel,
              attributes: [],
              include: [
                {
                  model: db.investHarvestingModel,
                  attributes: [
                  ]
                }
              ]
            }
          ]
        }
        // attributesSet =[]
        // attributesSet = [[sequelize.col('intake_verification_tag.invest_verification.invest_harvesting.user_id'), 'bspc_id']]
      }

      let condition = {
        // attributes: ['id'],
        include: [
          {
            model: cropModel,
            attributes: [],
            required: true,
          },
          {
            model: db.varietyModel,
            attributes: [],
            required: true,
          },
          {
            model: db.varietLineModel,
            attributes: []
          },
          { ...querySet }
        ],
        where: {
          ...userId,
          [Op.or]: [
            {
              ...conditionSet,

            },
            {
              [Op.and]: [
                {
                  unique_code: {
                    [Op.not]: null
                  }
                },
                {
                  unique_code: {
                    [Op.not]: ""
                  }
                },

                statusArrayCondition
              ]
            }
          ]
        },
        attributes: [
          "*",
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
        ],
        raw: true
      }

      if (req.body) {
        if (req.body.year) {
          condition.where.year = req.body.year;
        }

        if (req.body.season) {
          condition.where.season = req.body.season
        }

        if (req.body.crop_code) {
          condition.where.crop_code = req.body.crop_code
        }
        req.body.lot_no_array
        if (req.body.lot_no_array && req.body.lot_no_array.length) {
          let lotArray = [];
          let statusArray = [];
          req.body.lot_no_array.forEach(ele => {
            lotArray.push(ele.lot_id);
            if (ele.lot_id && ele.status) {
              statusArray.push(ele.status)
            };
          })
          // req.body.lot_no_array.forEach(ele=>{

          // })
          console.log("llllllllll", lotArray);
          if (lotArray && lotArray.length) {
            condition.where.lot_id = {
              [Op.in]: lotArray
            }
          }
          // if (statusArray && statusArray.length) {
          //   condition.where.status = {
          //     [Op.notIn]: statusArray
          //   }

          // }
        }
      }

      let dataList = await db.generateSampleSlipsModel.findAll(condition);
      if (dataList && dataList.length) {
        return response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }

    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getGenerateSampleSlipData = async (req, res) => {
    try {
      let selectValue;
      if(req.body.tabletype === 'table2')
      {
        selectValue ='GOT'
      }else{
        selectValue ='STL'
      }
      let userId;
      let querySet;
      let attributesSet;
      let lotArray = [];
      let statusArray = [];
      let conditionSet;
      let statusArrayCondition = {};

      // Handle lot_no_array
      if (req.body.lot_no_array && req.body.lot_no_array.length) {
        req.body.lot_no_array.forEach(ele => {
          // Check if `ele` is an object with `lot_id` or a number (lot ID directly)
          if (typeof ele === 'object' && ele.lot_id) {
            lotArray.push(ele.lot_id);
            if (ele.status) {
              statusArray.push(ele.status);
            }
          } else if (typeof ele === 'number') {
            lotArray.push(ele);
          }
        });

        // Set statusArrayCondition if status exists


        // Set conditionSet if statusArray has values


        // Log lotArray for debugging
        console.log("Processed lotArray:", lotArray);
      }
      let sampleType;
      if (req.body && req.body.re_sample) {
        if (req.body.re_sample == "re-sample") {
          sampleType = {
            status: 're-sample'
          }
        }
      } else {
        if (statusArray.length) {

          conditionSet = {
            [Op.or]: [
              {
                status: {
                  [Op.eq]: null
                }
              }
            ]
          };
        }
        if (statusArray.length) {
          statusArrayCondition = {
            status: {
              [Op.notIn]: statusArray
            }
          };
        }
      }
      // Set userId if logged-in user information exists
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        };
      }

      // Handle get_caary_over cases (1, 2, or default)
      if (req.body.get_caary_over === 1) {
        querySet = {
          model: db.investVerifyModel,
          required: false,
          attributes: [],
          include: [
            {
              model: db.investHarvestingModel,
              attributes: []
            }
          ]
        };
      } else if (req.body.get_caary_over === 2) {
        querySet = {
          model: db.carryOverSeedDetailsModel,
          attributes: [],
          include: [
            {
              model: db.carryOverSeedModel,
              attributes: []
            }
          ]
        };
      } else {
        querySet = {
          model: db.intakeVerificationTags,
          required: false,
          attributes: [],
          include: [
            {
              model: db.investVerifyModel,
              attributes: [],
              include: [
                {
                  model: db.investHarvestingModel,
                  attributes: []
                }
              ]
            }
          ]
        };
      }

      // Create condition for the query
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            required: true
          },
          {
            model: db.varietyModel,
            attributes: [],
            required: true
          },
          {
            model: db.varietLineModel,
            attributes: []
          },
          { ...querySet }
        ],
        where: {
          ...userId,
          [Op.or]: [
            { ...conditionSet },
            {
              [Op.and]: [
                { ...sampleType },
                {
                  unique_code: {
                    [Op.not]: null
                  }
                },
                {
                  unique_code: {
                    [Op.not]: ""
                  }
                },
                statusArrayCondition
              ]
            }
          ]
        },
        attributes: [
          "*",
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name']
        ],
        raw: true
      };

      // Additional condition based on request body
      if (req.body) {
        if (req.body.year) {
          condition.where.year = req.body.year;
        }
        if (req.body.season) {
          condition.where.season = req.body.season;
        }
        if (req.body.crop_code) {
          condition.where.crop_code = req.body.crop_code;
        }
        if (lotArray.length) {
          condition.where.lot_id = {
            [Op.in]: lotArray
          };
          
        }
        if (req.body.tabletype) {
          condition.where.testing_type = selectValue
          }
      }

      console.log("condition",condition);
      // Query the database
      let dataList = await db.generateSampleSlipsModel.findAll(condition);
      if (dataList && dataList.length) {
        return response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };


  static getGenerateSampleSlipTestData = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: db.seedLabTests,
            attributes: []
          }
        ],
        attributes: ['id', 'generate_sample_slip_id',
          [sequelize.col('generate_sample_slips_tests.test_id'), 'test_id'],
          [sequelize.col('seed_lab_test.lab_test_name'), 'test_name']
        ],
        raw: true,
        where: {
        }
      }
      if (req.body && req.body.search) {
        if (req.body.search.id) {
          condition.where.generate_sample_slip_id = req.body.search.id
        }
      }
      let dataList = await db.generateSampleSlipsTestsModel.findAll(condition);
      if (dataList && dataList.length) {
        response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }

    } catch (error) {
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static seedLabTestsList = async (req, res) => {
    try {
      let labTestdata = await db.seedLabTests.findAll();
      if (labTestdata && labTestdata.length) {
        return response(res, status.DATA_AVAILABLE, 200, labTestdata);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static seedTestingLaboratoryList = async (req, res) => {
    try {
      let seedLabTestdata = await db.seedLabTestModel.findAll({
        attributes: ['id', 'lab_name']
      });
      if (seedLabTestdata && seedLabTestdata.length) {
        return response(res, status.DATA_AVAILABLE, 200, seedLabTestdata);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }




  static seedTestingLaboratoryListstatebyoldone = async (req, res) => {
    try {
      // Await the asynchronous getstlstate call
      const stvvv = await stlLab(req.body.stateCode);

      // Log the result to check the response
      // console.log('stvvvstvvv11*************', stvvv);

      // Return the result in the response
      if (stvvv && stvvv.length) {
        return response(res, status.DATA_AVAILABLE, 200, stvvv);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };

  static seedTestingLaboratoryListstateby = async (req, res) => {
    try {
      // Fetching data from stlLab using stateCode
      const stvvv = await stlLab(req.body.stateCode);

      // Modify the fetched data from stlLab
      const modifiedData = stvvv.data.map(item => ({
        ...item,
        idtype: typeof item.labId,
        lab_name: item.labName || 'NA',
        lab_code: item.labId || 'NA'
      }));
// "27-l1"
      console.log("Modified Data:", modifiedData);

      // Get the lab_codes from modifiedData
      const labCodes = modifiedData.map(item => item.lab_code);
      console.log("labCodes****",labCodes)
      // Query database for matching lab_codes
      const dbResults = await db.seedLabTestModel.findAll({
        attributes: ['id', 'lab_code'],
        raw: true,
        where: {
          state_id: req.body.stateCode,
          lab_code: labCodes
        }
      });

      // console.log("Database Results:", dbResults);
      console.log("mode*****", modifiedData);
      console.log("dbResults*****", dbResults);

      const finalResult = modifiedData.map(lab => {
        // Find the corresponding ID based on lab_code
        const matchingIdEntry = dbResults.find(entry => entry.lab_code === lab.lab_code);

        // Construct the new object, including the ID if found
        return {
          ...lab,
          id: matchingIdEntry ? matchingIdEntry.id : null // Include the ID if found
        };
      });

      // Filtering out labs with lab_code 'NA' or if no ID was found
      const filteredResult = finalResult.filter(item => item.lab_code !== 'NA' && item.id !== null);

      // console.log('Final Merged Result:', filteredResult);



      // Return the final data array as the response
      return response(res, status.DATA_AVAILABLE, 200, filteredResult);

    } catch (error) {
      console.error('Error:', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };




  static getGenerateSampleSlipVarietyData = async (req, res) => {
    try {
      let userId;
      let userId1;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId1 = {
          user_id: req.body.loginedUserid.id
        }
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            include: [
              {
                model: db.carryOverSeedModel,
                where: {
                  ...userId1
                },
                attributes: []
              }
            ],
            attributes: []
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
        ],
        raw: true,
        where: {
          ...userId
        },
      }
      let condition1 = {
        include: [
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.intakeVerificationTags,
            include: [
              {
                model: db.investVerifyModel,
                where: {
                  ...userId1
                },
                attributes: []
              }
            ],
            attributes: []
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
        ],
        raw: true,
        where: {
          ...userId
        },
      }
      if (req.body) {
        if (req.body.year) {
          condition.where.year = req.body.year;
          condition1.where.year = req.body.year;
        }

        if (req.body.season) {
          condition.where.season = req.body.season;
          condition1.where.season = req.body.season;

        }

        if (req.body.crop_code) {
          condition.where.crop_code = req.body.crop_code;
          condition1.where.crop_code = req.body.crop_code;
        }
      }

      let dataList = await db.seedProcessingRegister.findAll(condition);
      let dataList2 = await db.seedProcessingRegister.findAll(condition1);
      dataList = dataList.concat(dataList2)
      console.log(dataList, 'dataList')
      dataList = productiohelper.removeDuplicates(dataList, 'variety_code')
      if (dataList && dataList.length) {
        response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  // api for generate sample slip forwarding data
  static getGenerateSampleForwardingSlipYearData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        where: {
          ...userId
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('generate_sample_slips.year')), 'year'],
        ]
      }

      let yearData = await db.generateSampleSlipsModel.findAll(condition)
      if (yearData) {
        return response(res, status.DATA_AVAILABLE, 200, yearData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getGenerateSampleForwardingSlipSeasonData = async (req, res) => {
    try {
      let userId;
      console.log('req.body.loginedUserid.id=====', req.body.loginedUserid.id);
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }

      let condition = {
        include: [
          {
            model: seasonModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('generate_sample_slips.season')), 'season'],
          [sequelize.col('m_season.season'), 'season_name'],

        ],
        where: {
          ...userId
        },
        raw: true
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
      }

      let seasonData = await db.generateSampleSlipsModel.findAll(condition)
      if (seasonData) {
        return response(res, status.DATA_AVAILABLE, 200, seasonData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getGenerateSampleForwardingSlipCropData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {

        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('generate_sample_slips.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],

        ],
        where: {
          ...userId
        },
        raw: true
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
      }

      let cropData = await db.generateSampleSlipsModel.findAll(condition)
      if (cropData) {
        return response(res, status.DATA_AVAILABLE, 200, cropData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static addGenerateSampleForwardingData = async (req, res) => {
    console.log("&&&&&&&&&&&&&&&&&&&&&&&", req.body);
    let tableType = req.body.generateSampleForwardingSlipData[0].table_type;
    console.log("Table Type:", tableType);

    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      console.log("req.body.loginedUserid", req.body.loginedUserid)
      console.log(" req.body.generateSampleForwardingSlipData", req.body.generateSampleForwardingSlipData)
      if (req.body) {
        if (req.body.generateSampleForwardingSlipData && req.body.generateSampleForwardingSlipData.length) {
          let data;
          for (let key of req.body.generateSampleForwardingSlipData) {
            let rules = {
              "year": 'required|integer',
              "season": 'required|string',
              "crop_code": 'required|string',
              "variety_code": 'required|string',
              "lot_no": 'required|string',
              // "class_of_seed": 'required|string',
              // "godown_no": 'required',
              // "stack_no": 'required',
              // "no_of_bags": 'required',
              // "total_processed_qnt": 'required',
              // "unique_code": 'required',
              // "sample_no": 'required',
              "testing_lab": 'required',
              "chemical_treatment": 'required',
            };

            if (key.table_type === "table2") {

              delete rules.lot_no;  // Remove the 'lot_no' rule for 'table1'
              delete rules.testing_lab,
                delete rules.chemical_treatment
              rules.bspc_id = 'required|integer';
            }
            let validation = new Validator(key, rules);
            const isValidData = validation.passes();

            if (!isValidData) {
              let errorResponse = {};
              for (let key in rules) {
                const error = validation.errors.get(key);
                if (error.length) {
                  errorResponse[key] = error;
                }
              }
              return response(res, status.BAD_REQUEST, 400, errorResponse, [])
            }
          }

          const apiURL = process.env.STL_DATA_PUSH_API
          const serialCode = process.env.SERIAL_CODE
          const API_KEY = process.env.STL_API_KEY
          let maxId = await db.generateSampleForwardingLettersModel.max('id');
          console.log("maxId-----------", maxId)

          let reqDataGOT = {
            "data": [

            ]
          }
          let reqDataSTL = {
            "auth": {
              "stateCode": "27",
              "apiKey": API_KEY
            },
            "data": [

            ]
          }
          
          let i = 0
          for (let key of req.body.generateSampleForwardingSlipData) {
            let radiobutton;
            if (key.table_type === "table2") {
              radiobutton = "GOT";
            }
            else {
              radiobutton = "STL";
            }
            console.log("ghjkl1111111111111111111111111111S;", radiobutton)

            if (key && key.choose_sample && key.choose_sample == true) {
              data = await db.generateSampleForwardingLettersModel.create({
                year: key.year ? key.year : "",
                season: key.season ? key.season : "",
                crop_code: key.crop_code ? key.crop_code : "",
                variety_code: key.variety_code ? key.variety_code : "",
                lot_no: key.lot_no ? key.lot_no : "",
                class_of_seed: key.class_of_seed ? key.class_of_seed : null,
                godown_no: key.godown_no ? key.godown_no : null,
                stack_no: key.stack_no ? key.stack_no : null,
                no_of_bags: key.no_of_bags ? key.no_of_bags : null,
                total_processed_qnt: key.total_processed_qnt ? key.total_processed_qnt : null,
                unique_code: key.unique_code ? key.unique_code : "",
                sample_no: key.sample_no ? key.sample_no : 1,
                testing_lab: key && key.testing_lab ? parseInt(key.testing_lab) : null,
                chemical_treatment: key.chemical_treatment,
                tests: key.tests ? key.tests : null,
                lot_id: key.lot_id ? key.lot_id : null,
                get_carry_over: key.get_carry_over ? key.get_carry_over : null,
                variety_code_line: key.variety_code_line ? key.variety_code_line : null,
                generate_sample_slip_id: key.generate_sample_slip_id ? key.generate_sample_slip_id : null,
                consignment_no: key.consignment_no ? key.consignment_no : null,
                running_no: key.running_number ? key.running_number : null,
                status: key.status ? key.status : null,
                testing_type: radiobutton,
                got_bspc_id: key.bspc_id,
                lab_serial_number: `${serialCode}-${maxId + 1}`,
                ...userId
              });
              if(key.status == "re-sample"){
               let isUpdate = await db.stlReportStatusModel.update(
                  {
                    is_forward_resample : 1
                  },
                  {
                    where:{
                      year: key.year ? key.year : "",
                      season: key.season ? key.season : "",
                      crop_code: key.crop_code ? key.crop_code : "",
                      variety_code: key.variety_code ? key.variety_code : "",
                      lot_no: key.lot_no ? key.lot_no : "",
                      user_id: req.body.loginedUserid &&  req.body.loginedUserid.id ? req.body.loginedUserid.id : key.bspc_id
                    }
                  }
                )
              }
           
    //          console.log("datadata----------", data.id)

              console.log("key.unique_code", key.unique_code, key)

              // console.log("jvjhrhhriukey", key.bspc_id, key)
              let generateSlipData = await db.generateSampleSlipsModel.findOne({
                where: {
                  unique_code: key.unique_code
                }
              });

              console.log("generateSlipData", generateSlipData)
              let updatedObject = {}
              if (generateSlipData && generateSlipData.tests) {
                updatedObject = await this.renameKey(generateSlipData.tests, 'lab_test_name', 'testName');
                console.log("updatedObject", updatedObject)
              }

              let cropName = await db.cropModel.findOne({
                attributes: ['crop_name'],
                where: {
                  crop_code: key.crop_code
                }
              });
              let varietyName = await db.varietyModel.findOne({
                attributes: ['variety_name'],
                where: {
                  variety_code: key.variety_code
                }
              });

              // if (tableType != 'table2') {
              //   let seedLab = await db.seedLabTestModel.findOne({
              //     attributes: ['lab_code','state_id','stl_name'],
              //     where: {
              //       id: key.testing_lab
              //     }
              //   });
              //   if(seedLab){
              //     console.log("seedLab-----------", seedLab)
              //     reqDataSTL.auth.stateCode = seedLab.state_id ? seedLab.state_id.toString():''
              //   }
              // }
                
              console.log("cropName--", cropName, "varietyName--", varietyName)
              let requestDataSTL = {}
              let requestDataGOT = {}
              if (tableType === 'table2') {
                requestDataGOT = {
                  "user_id": req.body.loginedUserid.id,
                  "bspc_id": key.bspc_id, //Ruchi
                  "test_number": updatedObject ? updatedObject : [],
                  // "test": updatedObject ? updatedObject : [],
                  "year": key.year ? key.year + "-" + (parseInt(key.year) - 1999) : "",
                  "cropName": cropName && cropName.crop_name ? cropName.crop_name : '',
                  "crop_code": key.crop_code ? key.crop_code : "",
                  "season": key.season ? (key.season == 'K' ? 'KHARIF ' + '(' + key.year + ')' : 'RABI ' + '(' + key.year + "-" + (parseInt(key.year) - 1999) + ')') : "",
                  "intakeLotNum": key.lot_no ? key.lot_no : "",
                  "varietyName": varietyName && varietyName.variety_name ? varietyName.variety_name : '', //
                  "variety_code": key.variety_code ? key.variety_code : "",
                  "variety_line_code": "",
                  "samplingDate": this.getCurrentDateTime(),
                  "samplingDrawnDate": this.getCurrentDateTime(),
                  "sampleForwardToLabOn": this.getCurrentDateTime(),
                  "consignment_number": key.consignment_no ? key.consignment_no : null,

                  "sppRoName": req.body.loginedUserid && req.body.loginedUserid.name ? req.body.loginedUserid.name : '', //BSPC NAME
                  "sppCode": req.body.loginedUserid && req.body.loginedUserid.code ? req.body.loginedUserid.code : '',  //BSPC Code
                  "sppName": req.body.loginedUserid && req.body.loginedUserid.name ? req.body.loginedUserid.name : '', //BSPC NAME
                  "sppRoCode": req.body.loginedUserid && req.body.loginedUserid.code ? req.body.loginedUserid.code : '',  ////BSPC Code
                  "roCode": req.body.loginedUserid && req.body.loginedUserid.code ? req.body.loginedUserid.code : '',  //BSPC Code
                  "roName": req.body.loginedUserid && req.body.loginedUserid.name ? req.body.loginedUserid.name : '', //BSPC NAME
  
                  "sLSerial": key.running_number ? key.running_number : null,
                  "testingLab": "",    // "MH-L-RCV-303001", //Lab code
                  "testingLabCode": "", //"MH-L-RCV-303001", //Lab code
                  "unique_code": key.unique_code ? key.unique_code : "",
                  "reason_id": 1, //Ruchi
                  // "letterNo": `${serialCode}-${maxId + 1}`,
                  "letterNo": key.consignment_no ? key.consignment_no : null,
                  "samplingCode": key.unique_code ? key.unique_code : "",//Unique_code                                
                }
              } else {

                let seedLab = await db.seedLabTestModel.findOne({
                  attributes: ['lab_code','state_id','stl_name'],
                  where: {
                    id: key.testing_lab
                  }
                });
                if(seedLab){
                  console.log("seedLab-----------", seedLab)
                  reqDataSTL.auth.stateCode = seedLab.state_id ? seedLab.state_id.toString():''
                }
                
                requestDataSTL = {
                  "test": updatedObject ? updatedObject : [],
                  "finyear": key.year ? key.year + "-" + (parseInt(key.year) - 1999) : "",
                  "cropName": cropName && cropName.crop_name ? cropName.crop_name : '',
                  "cropCode": key.crop_code ? key.crop_code : "",
                  "season": key.season ? (key.season == 'K' ? 'KHARIF ' + '(' + key.year + ')' : 'RABI ' + '(' + key.year + "-" + (parseInt(key.year) - 1999) + ')') : "",
                  "intakeLotNum": key.lot_no ? key.lot_no : "",
                  "varietyName": varietyName && varietyName.variety_name ? varietyName.variety_name : '', //
                  "varietyCode": key.variety_code ? key.variety_code : "",
                  "samplingDate": this.getCurrentDateTime(),
                  "samplingDrawnDate": this.getCurrentDateTime(),
                  "sampleForwardToLabOn": this.getCurrentDateTime(),

                  "sppRoName": req.body.loginedUserid && req.body.loginedUserid.name ? req.body.loginedUserid.name : '', //BSPC NAME
                  "sppCode": req.body.loginedUserid && req.body.loginedUserid.code ? req.body.loginedUserid.code : '',  //BSPC Code
                  "sppName": req.body.loginedUserid && req.body.loginedUserid.name ? req.body.loginedUserid.name : '', //BSPC NAME
                  "sppRoCode": req.body.loginedUserid && req.body.loginedUserid.code ? req.body.loginedUserid.code : '',  ////BSPC Code
                  "roCode": req.body.loginedUserid && req.body.loginedUserid.code ? req.body.loginedUserid.code : '',  //BSPC Code
                  "roName": req.body.loginedUserid && req.body.loginedUserid.name ? req.body.loginedUserid.name : '', //BSPC NAME

                  "sLSerial": key.running_number ? key.running_number : null,
                  "testingLab": seedLab.stl_name, //"MH-L-RCV-303001", //Lab code
                  "testingLabCode": seedLab.stl_name, //"MH-L-RCV-303001", //Lab code
                  "uniqueCode": key.unique_code ? key.unique_code : "",

                  // "letterNo": `${serialCode}-${maxId + 1}`,
                  "letterNo": key.consignment_no ? key.consignment_no : null,
                  "samplingCode": key.unique_code ? key.unique_code : "",//Unique_code
                }
              }

              reqDataSTL.data[i] = requestDataSTL
              reqDataGOT.data[i] = requestDataGOT
              maxId = await db.generateSampleForwardingLettersModel.max('id');
              i++;
            }
          }
          console.log("requestData", reqDataSTL.data)
          if (tableType === 'table2') {
            let newdata = await this.addGotTestingData({ body: reqDataGOT.data }, res);
          }
          else {
            // await this.addGotTestingData({ body: reqData.data }, res);

            try {
              console.log("requestData", reqDataSTL.data)
              // local api
              // await this.addGotTestingData({ body: reqData.data }, res);
              await CallExternalAPI.post(apiURL, reqDataSTL)
            } catch (e) {
              console.log("errr", e)
            }
            if (data) {

              return response(res, status.DATA_SAVE, 200, data);
            } else {
              return response(res, status.DATA_NOT_SAVE, 201);
            }
          }
        } else {
          return response(res, "all fields data required", 201, []);
        }
      } else {
        return response(res, "all fields data required", 201, []);
      }
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error);
    }
  }

  static async renameKey(arr, oldKey, newKey) {
    return arr.map(obj => {
      if (obj.hasOwnProperty(oldKey)) {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
        delete obj['id'];

      }
      return obj;
    });
  }

  static getCurrentDateTime() {
    const now = new Date();

    // Extracting components
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    // Formatted date and time string
    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return dateTimeString;
  }

  static getGenerateSampleForwardingData = async (req, res) => {
    console.log("request", req.body.search)
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: db.userModel,
            attributes: ['id'],
            include: [
              {
                model: db.agencyDetailModel,
                attributes: ['agency_name']
              }
            ]
          },
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },

          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.seedLabTestModel,
            attributes: ['id', 'lab_name']
          },
          {
            model: db.generateSampleForwardingLettersModel,
            required: false,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'lot_id', 'get_carry_over', 'testing_lab', 'consignment_no'],
            where: {
            }
          }
        ],
        where: {
          ...userId
        },
        order: [
          ['id', 'DESC']  // Adding the sorting by "id" in descending order
        ]
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {

          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.seed_testing_lab_id) {
          condition.where.testing_lab = req.body.search.seed_testing_lab_id
        }
        if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
        }
        if (req.body.search.bspc_id) {
          // condition.where.got_bspc_id = {
          //   [Op.in]: req.body.search.bspc_id
          // }
          condition.where.got_bspc_id = req.body.search.bspc_id

        }
        if (req.body.search.lot_no_array && req.body.search.lot_no_array.length) {
          condition.where.lot_id = {
            [Op.in]: req.body.search.lot_no_array
          }
        }
      }
      let generateSampleForwardingLettersData = await db.generateSampleSlipsModel.findAll(condition)
      // console.log("(((((((((((**********", generateSampleForwardingLettersData);
      if (generateSampleForwardingLettersData && generateSampleForwardingLettersData.length) {
        return response(res, status.DATA_AVAILABLE, 200, generateSampleForwardingLettersData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getGenerateSampleForwardingDataSecond = async (req, res) => {

    let radio_type;
    if (req.body.search.tabletype == 'table1') {
      radio_type = { testing_type: "STL" }

    }
    else {
      radio_type = { testing_type: "GOT" };
    }
    console.log("77777777777", radio_type)
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.seedLabTestModel,
            attributes: ['id', 'lab_name']
          },
          {
            model: db.intakeVerificationTags,
            required: false,
            attributes: [
            ],
            where: {
            },
            include: [
              {
                model: db.investVerifyModel,
                attributes: [],
                include: [
                  {
                    model: db.investHarvestingModel,
                    attributes: [
                      // [sequelize.col('user_id'), 'bspc_id']
                    ]
                  }
                ]
              }
            ]
          }
          // attributesSet = [[sequelize.col('intake_verification_tag.invest_verification.invest_harvesting.user_id'), 'bspc_id']]
        ],
        where: {
          ...userId
        },
        attributes: ["*",
          [sequelize.col('intake_verification_tag->invest_verification->invest_harvesting.user_id'), 'bspc_id']
        ],
        raw: true,
        nest: true
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        let radio_type;
        if (req.body.search.tabletype === 'table1') {
          radio_type = { testing_type: "STL" };
        } else {
          radio_type = { testing_type: "GOT" };
        }
        condition.where = {
          ...condition.where,  // Spread existing conditions
          ...radio_type        // Add the radio_type condition
        };

        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.seed_testing_lab_id) {
          condition.where.testing_lab = req.body.search.seed_testing_lab_id
        }

        if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
        }
        if (req.body.search.lot_no_array && req.body.search.lot_no_array.length) {
          condition.where.lot_id = {
            [Op.in]: req.body.search.lot_no_array
          }
        }
        if (req.body.search.consignment_no) {
          condition.where.consignment_no = req.body.search.consignment_no
        }
      }

      let generateSampleForwardingLettersData = await db.generateSampleForwardingLettersModel.findAll(condition)
      if (generateSampleForwardingLettersData && generateSampleForwardingLettersData.length) {
        return response(res, status.DATA_AVAILABLE, 200, generateSampleForwardingLettersData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }


  static getGenerateSampleForwardingSlipVarietyData = async (req, res) => {
    try {

      let radiobutton;
      if (req.body.testing_type === 'table1') {
        radiobutton = 'STL'
      } else {
        radiobutton = 'GOT'
      }
      // console.log("jhhjh**************",radiobutton);
      // console.log("hgiurti",radiobutton);
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('generate_sample_slips.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
        ],
        raw: true,
        where: {
          ...userId,
          // 'generate_sample_slips.testing_type': 'radiobutton',
        }
      }
      if (req.body) {

        if (req.body.year) {
          condition.where.year = req.body.year
        }
        if (req.body.season) {
          condition.where.season = req.body.season
        }

        if (req.body.crop_code) {
          condition.where.crop_code = req.body.crop_code
        }
        if (req.body.testing_type) {

          condition.where.testing_type = radiobutton;

        }
      }

      console.log("************", condition);

      let dataList = await db.generateSampleSlipsModel.findAll(condition);
      if (dataList && dataList.length) {
        response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static seedGenerateForwardingTestingLaboratoryList = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: db.seedLabTestModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('generate_sample_slips.testing_lab')), 'id'],
          [sequelize.col('m_seed_test_laboratory.lab_name'), 'lab_name'],
        ],
        raw: true,
        where: {
          ...userId
        }
      }
      if (req.body) {
        if (req.body.year) {
          condition.where.year = req.body.year;
        }

        if (req.body.season) {
          condition.where.season = req.body.season
        }

        if (req.body.crop_code) {
          condition.where.crop_code = req.body.crop_code
        }
      }
      let seedLabTestdata = await db.generateSampleSlipsModel.findAll(condition);
      if (seedLabTestdata && seedLabTestdata.length) {
        return response(res, status.DATA_AVAILABLE, 200, seedLabTestdata);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static checkRunningNumber = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let isrunning = await db.generateSampleForwardingLettersModel.findOne({
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          //crop_code: req.body.search.crop_code,
          // variety_code: req.body.search.variety_code,
          ...userId
        },
        attributes: ['running_no'],
        order: [['running_no', "DESC"]]
      });
      if (isrunning) {
        return response(res, status.DATA_AVAILABLE, 200, isrunning);
      } else {
        return response(res, status.DATA_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getStlReportStatusData = async (req, res) => {
  console.log("📥 Incoming Body:", JSON.stringify(req.body, null, 2));

  let returnResponse = [];
  try {
    let conditionWhere = {}; 

    // ✅ Priority: Always use search.user_id first (QR payload)
    if (req.body.search?.user_id) {
      conditionWhere.user_id = req.body.search.user_id;
    } else if (req.body.user_id) {
      conditionWhere.user_id = req.body.user_id;
    } else if (req.body.loginedUserid?.id) {
      conditionWhere.user_id = req.body.loginedUserid.id;
    }

    console.log("🧑 Final user_id applied in filter:", conditionWhere.user_id);

    let condition = {
      include: [
        {
          model: db.varietyModel,
          attributes: ['variety_code', 'variety_name']
        },
        {
          model: db.mVarietyLinesModel,
          attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
        },
        {
          model: db.seedTestingLabModel,
          required: false,
          as: 'seedLabtest',
          attributes: ['lab_name']
        },
      ],
      where: conditionWhere
    };

    // Apply other search filters
    if (req.body.search) {
      const search = req.body.search;
      if (search.year) condition.where.year = search.year;
      if (search.season) condition.where.season = search.season;
      if (search.crop_code) condition.where.crop_code = search.crop_code;
      if (search.variety_code) condition.where.variety_code = search.variety_code;
      if (search.seed_testing_lab_id) condition.where.testing_lab = search.seed_testing_lab_id;
      if (search.variety_code_array?.length) {
        condition.where.variety_code = { [Op.in]: search.variety_code_array };
      }
    }

    const stlReportData = await db.stlReportStatusModel.findAll(condition);
    returnResponse = stlReportData;

    if (returnResponse && returnResponse.length) {
      return response(res, status.DATA_AVAILABLE, 200, returnResponse);
    } else {
      return response(res, status.DATA_NOT_AVAILABLE, 201, []);
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501, []);
  }
};

// static getStlReportStatusData = async (req, res) => {
//   console.log("📥 Incoming Body:", JSON.stringify(req.body, null, 2));
// console.log("🧑 Extracted user_id for filter:", req.body.user_id || req.body.search?.user_id || req.body.loginedUserid?.id);

//   let returnResponse = [];
//   try {
//     let conditionWhere = {}; 

//     // if (req.body.user_id) {
//     //   conditionWhere.user_id = req.body.user_id;
//     // }
//     // else if (req.body.search?.user_id) {
//     //   conditionWhere.user_id = req.body.search.user_id;
//     // }
//     // else if (req.body.loginedUserid?.id) {
//     //   conditionWhere.user_id = req.body.loginedUserid.id;
//     // }

//     if (req.body.user_id) {
//   conditionWhere.user_id = req.body.user_id;
// } else if (req.body.loginedUserid?.id) {
//   conditionWhere.user_id = req.body.loginedUserid.id;
// } else if (req.body.search?.user_id) {
//   conditionWhere.user_id = req.body.search.user_id;
// }


//     let condition = {
//       include: [
//         {
//           model: db.varietyModel,
//           attributes: ['variety_code', 'variety_name']
//         },
//         {
//           model: db.mVarietyLinesModel,
//           attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
//         },
//         {
//           model: db.seedTestingLabModel,
//           required: false,
//           as: 'seedLabtest',
//           attributes: ['lab_name']
//         },
//       ],
//       where: conditionWhere
//     };

//     // search filters
//     if (req.body.search) {
//       const search = req.body.search;
//       if (search.year) condition.where.year = search.year;
//       if (search.season) condition.where.season = search.season;
//       if (search.crop_code) condition.where.crop_code = search.crop_code;
//       if (search.variety_code) condition.where.variety_code = search.variety_code;
//       if (search.seed_testing_lab_id) condition.where.testing_lab = search.seed_testing_lab_id;
//       if (search.variety_code_array?.length) {
//         condition.where.variety_code = { [Op.in]: search.variety_code_array };
//       }
//     }

//     const stlReportData = await db.stlReportStatusModel.findAll(condition);
//     returnResponse = stlReportData;

//     if (returnResponse && returnResponse.length) {
//       return response(res, status.DATA_AVAILABLE, 200, returnResponse);
//     } else {
//       return response(res, status.DATA_NOT_AVAILABLE, 201, []);
//     }
//   } catch (error) {
//     console.log(error);
//     return response(res, status.UNEXPECTED_ERROR, 501, []);
//   }
// };

//   static getStlReportStatusData = async (req, res) => {
//   let returnResponse = [];
//   try {
//     let conditionWhere = {}; 

//     if (req.body.loginedUserid?.id) {
//       conditionWhere.user_id = req.body.loginedUserid.id;
//     } else if (req.body.search?.user_id) {
//       conditionWhere.user_id = req.body.search.user_id;
//     }

//     let condition = {
//       include: [
//         {
//           model: db.varietyModel,
//           attributes: ['variety_code', 'variety_name']
//         },
//         {
//           model: db.mVarietyLinesModel,
//           attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
//         },
//         {
//           model: db.seedTestingLabModel,
//           required: false,
//           as: 'seedLabtest',
//           attributes: ['lab_name']
//         },
//       ],
//       where: conditionWhere
//     };

//     // search filters
//     if (req.body.search) {
//       const search = req.body.search;
//       if (search.year) condition.where.year = search.year;
//       if (search.season) condition.where.season = search.season;
//       if (search.crop_code) condition.where.crop_code = search.crop_code;
//       if (search.variety_code) condition.where.variety_code = search.variety_code;
//       if (search.seed_testing_lab_id) condition.where.testing_lab = search.seed_testing_lab_id;
//       if (search.variety_code_array?.length) {
//         condition.where.variety_code = { [Op.in]: search.variety_code_array };
//       }
//     }

//     const stlReportData = await db.stlReportStatusModel.findAll(condition);
//     returnResponse = stlReportData;

//     if (returnResponse && returnResponse.length) {
//       return response(res, status.DATA_AVAILABLE, 200, returnResponse);
//     } else {
//       return response(res, status.DATA_NOT_AVAILABLE, 201, []);
//     }
//   } catch (error) {
//     console.log(error);
//     return response(res, status.UNEXPECTED_ERROR, 501, []);
//   }
// };

// static getStlReportStatusData = async (req, res) => {
//   let returnResponse = [];
//   try {
//     let conditionWhere = {};
//     if (req.body.loginedUserid?.id) {
//       conditionWhere.user_id = req.body.loginedUserid.id;
//     } else if (req.body.search?.user_id) {
//       conditionWhere.user_id = req.body.search.user_id; 
//     }

//     let condition = {
//       include: [
//         {
//           model: db.varietyModel,
//           attributes: ['variety_code', 'variety_name']
//         },
//         {
//           model: db.mVarietyLinesModel,
//           attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
//         },
//         {
//           model: db.seedTestingLabModel,
//           required: false,
//           as: 'seedLabtest',
//           attributes: ['lab_name']
//         },
//       ],
//       where: conditionWhere
//     };

//     // 3️⃣ Search filters (optional)
//     if (req.body.search) {
//       const search = req.body.search;

//       if (search.year) condition.where.year = search.year;
//       if (search.season) condition.where.season = search.season;
//       if (search.crop_code) condition.where.crop_code = search.crop_code;
//       if (search.variety_code) condition.where.variety_code = search.variety_code;
//       if (search.seed_testing_lab_id) condition.where.testing_lab = search.seed_testing_lab_id;
//       if (search.variety_code_array?.length) {
//         condition.where.variety_code = { [Op.in]: search.variety_code_array };
//       }
//     }

//     // 4️⃣ Fetch data
//     const stlReportData = await db.stlReportStatusModel.findAll(condition);
//     returnResponse = stlReportData;

//     if (returnResponse && returnResponse.length) {
//       return response(res, status.DATA_AVAILABLE, 200, returnResponse);
//     } else {
//       return response(res, status.DATA_NOT_AVAILABLE, 201, []);
//     }
//   } catch (error) {
//     console.log(error);
//     return response(res, status.UNEXPECTED_ERROR, 501, []);
//   }
// };


  // static getStlReportStatusData = async (req, res) => {
  //   let returnResponse = [];
  //   try {
  //     let userId;
  //     if (req.body.loginedUserid && req.body.loginedUserid.id) {
  //       userId = {
  //         user_id: req.body.loginedUserid.id
  //       }
  //     }


  //     let condition = {
  //       include: [
  //         {
  //           model: db.varietyModel,
  //           attributes: ['variety_code', 'variety_name']
  //         },
  //         {
  //           model: db.mVarietyLinesModel,
  //           attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
  //         },
  //         {
  //           model: db.seedTestingLabModel,
  //           required: false,
  //           as: 'seedLabtest',
  //           attributes: ['lab_name']
  //         },
  //       ],
  //       where: {
  //         ...userId
  //       }
  //     }
  //     if (req.body && req.body.search) {
  //       if (req.body.search.year) {
  //         condition.where.year = req.body.search.year;
  //       }
  //       if (req.body.search.season) {
  //         condition.where.season = req.body.search.season
  //       }
  //       if (req.body.search.crop_code) {
  //         condition.where.crop_code = req.body.search.crop_code;
  //       }
  //       if (req.body.search.variety_code) {
  //         condition.where.variety_code = req.body.search.variety_code;
  //       }
  //       if (req.body.search.seed_testing_lab_id) {
  //         condition.where.testing_lab = req.body.search.seed_testing_lab_id
  //       }
  //       if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
  //         condition.where.variety_code = {
  //           [Op.in]: req.body.search.variety_code_array
  //         }
  //       }
  //     }
  //     let stlReportData = await db.stlReportStatusModel.findAll(condition);
  //     returnResponse = stlReportData;
  //     if (returnResponse && returnResponse.length) {
  //       return response(res, status.DATA_AVAILABLE, 200, returnResponse);
  //     } else {
  //       return response(res, status.DATA_NOT_AVAILABLE, 201, []);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return response(res, status.UNEXPECTED_ERROR, 501, []);
  //   }
  // }
  // ruchi add got testing report

  static addGotTestingDataold = async (req, res) => {
    // console.log("Radhe",req.body);
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : null
        }
      }
      const stlgottestiong = req.body

      if (stlgottestiong && stlgottestiong.length) {
        console.log("jvjhjhk", stlgottestiong);
        let rules = {
          "year": 'required',
          "season": 'required|string',
          "crop_code": 'required|string',
          "variety_code": 'required|string',
          "bspc_id": 'required',
          // "chemical_treatment": 'required',
        };
        let validation = new Validator(key, rules);
        const isValidData = validation.passes();

        if (!isValidData) {
          let errorResponse = {};
          for (let key in rules) {
            const error = validation.errors.get(key);
            if (error.length) {
              errorResponse[key] = error;
            }
          }
          return response(res, status.BAD_REQUEST, 400, errorResponse, [])
        }
        console.log("fgurnhuinghiu");


        // const gotTestingData = {
        //   bspc_id: req.body ? req.body.bspc_id : "",
        //   user_id: userId ? userId: null,
        //   year: key.year ? key.year : null ,
        //   crop_code:key.crop_code ? key.crop_code : null ,
        //   season: key.season ? key.season:null,
        //   consignment_number: key.consignment_number ? key.consignment_number : null,
        //   variety_line_code: key.variety_line_code ? key.variety_line_code : '',
        //   is_sample_received: true || 0, // Default value set to 0
        //   status: key.status?key.status:false,
        //   test_number: key.testno? key.testno:"",
        //   unique_code: key.unique_code? key.unique_code:"", // Default value set to false
        //   reason_id:key.reason_id? key.reason_id:""
        // };
        // createData = await db.gotTestingsModel.create(gotTestingData);
        console.log("insertdata", createData);
        // if (data && data.length) {
        //   response(res, status.DATA_AVAILABLE, 200, data)
        // } else {
        //   response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static addGotTestingDataworking = async (req, res) => {
    console.log("ddd********", req.body);
    try {
      let userId = null;

      // Check if the user ID is provided
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;
      }

      const stlGotTesting = req.body;

      // If data is provided in the request
      if (stlGotTesting && Object.keys(stlGotTesting).length) {
        // let rules = {
        //   "year": 'required',
        //   "season": 'required|string',
        //   "crop_code": 'required|string',
        //   "variety_code": 'required|string',
        //   "bspc_id": 'required',
        // };

        // // Assuming Validator is already defined somewhere in your code
        // let validation = new Validator(req.body, rules);
        // const isValidData = validation.passes();

        // Validation failed
        // if (!isValidData) {
        //   let errorResponse = {};
        //   for (let key in rules) {
        //     const error = validation.errors.get(key);
        //     if (error.length) {
        //       errorResponse[key] = error;
        //     }
        //   }
        //   return response(res, status.BAD_REQUEST, 400, errorResponse, []);
        // }

        // Prepare the data to be inserted into the database
        const gotTestingData = {
          bspc_id: req.body.bspc_id || null,
          user_id: userId || null,
          year: req.body.year || null,
          crop_code: req.body.crop_code || null,
          variety_code: req.body.variety_code,
          season: req.body.season || null,
          consignment_number: req.body.consignment_number || null,
          variety_line_code: '',
          is_sample_received: true,
          status: req.body.status || false,
          test_number: req.body.testno || "",
          unique_code: req.body.unique_code || "",
          reason_id: req.body.reason_id || null
        };

        // Insert data into 'gotTestingsModel'
        const createData = await db.gotTestingsModel.create(gotTestingData);
        console.log("Inserted Data:", createData);

        // Return a success response with the inserted data
        return response(res, status.SUCCESS, 200, createData);
      } else {
        // If no data is provided in the request
        return response(res, status.BAD_REQUEST, 400, { message: "No data provided" }, []);
      }
    } catch (error) {
      // Log and handle the error
      console.error("Error inserting data:", error);
      return response(res, status.UNEXPECTED_ERROR, 501, { error: error.message });
    }
  };

  static addGotTestingData12 = async (req, res) => {
    console.log("ddd********", req.body.bspc_id);
    for (let key of req.body) {
      // console.log("key&&&&&&&&&&&&&&&&&",key);
      let userId = null;
      if (key.loginedUserid && key.loginedUserid.id) {
        userId = key.loginedUserid.id;
      }

      const stlGotTesting = key;

      const gotTestingData = {
        bspc_id: key.bspc_id || null,
        user_id: key.user_id || null,
        year: key.year || null,
        crop_code: key.crop_code || null,
        variety_code: key.variety_code,
        season: 'k' || null,
        consignment_number: key.consignment_number || null,
        variety_line_code: '',
        is_sample_received: true,
        status: key.status || false,
        test_number: "testno",
        unique_code: key.unique_code || "",
        reason_id: key.reason_id || null
      };
      console.log("***************jhdj", gotTestingData);


      // Insert data into 'gotTestingsModel'
      const createData = await db.gotTestingsModel.create(gotTestingData);
    }
    console.log("Inserted Data:", createData);
    return createData;
    // Return a success response with the inserted data
    //   return response(res, status.SUCCESS, 200, createData);
    // } else {
    //   // If no data is provided in the request
    //   return response(res, status.BAD_REQUEST, 400, { message: "No data provided" }, []);



  };

  static addGotTestingData = async (req, res) => {

    let insertedData = []; // Array to store the inserted data

    for (let key of req.body) {
      console.log("Processing item with bspc_id:", key.user_id);

      // Check if the user ID is provided
      let userId = null;
      if (key.loginedUserid && key.loginedUserid.id) {
        userId = key.loginedUserid.id;
      }

      // Prepare the data to be inserted into 'gotTestingsModel'
      const gotTestingData = {
        bspc_id: key.bspc_id || null,
        user_id: key.user_id || null, // Use the extracted userId here
        year: key.year ? key.year.split('-')[0] : null,
        crop_code: key.crop_code || null,
        variety_code: key.variety_code,
        season: key.season ? key.season.charAt(0).toUpperCase() : null,
        consignment_number: key.consignment_number || null,
        variety_line_code: '',
        is_sample_received: true,
        status: "PENDING",
        test_number: "" || "", // Ensure correct field name is used (test_number)
        unique_code: key.unique_code || "",
        reason_id: key.reason_id || null
      };


      console.log("GotTestingData to be inserted:", gotTestingData);

      // Insert data into 'gotTestingsModel'
      const createData = await db.gotTestingsModel.create(gotTestingData);
      console.log("Inserted Data:", createData);

      // Add the inserted data to the array
      insertedData.push(createData);
    }

    // Return a success response with all inserted data
    return response(res, status.SUCCESS, 200, insertedData);


  };




  static addStlReportStatusData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : null
        }
      }
      const stlReportStatusData = req.body
      // console.log("stlReportStatusData", stlReportStatusData)
      // console.log("req.bodyreq.body", req.body)
      // const jsonString = JSON.stringify(req.body, null, 2);

      // // Define the file path
      // const filePath = './data.json';

      // // Write the JSON string to a file
      // fs.writeFile(filePath, jsonString, (err) => {
      //   if (err) {
      //     console.error('Error writing to file', err);
      //   } else {
      //     console.log('Successfully Saved');
      //   }
      // });
      // return response(res, status.DATA_SAVE, 200, []);

      if (stlReportStatusData && stlReportStatusData.length) {
        let createData;
        let data;
        for (let key of stlReportStatusData) {
          let rules = {
            "year": 'required',
            "season": 'required|string',
            "crop_code": 'required|string',
            "variety_code": 'required|string',
            // "lot_no": 'required|string',
            // "class_of_seed": 'required|string',
            // "godown_no": 'required',
            // "stack_no": 'required',
            // "no_of_bags": 'required',
            // "total_processed_qnt": 'required',
            // "unique_code": 'required',
            // "sample_no": 'required',
            "testing_lab_id": 'required',
            // "chemical_treatment": 'required',
          };
          let validation = new Validator(key, rules);
          const isValidData = validation.passes();

          if (!isValidData) {
            let errorResponse = {};
            for (let key in rules) {
              const error = validation.errors.get(key);
              if (error.length) {
                errorResponse[key] = error;
              }
            }
            return response(res, status.BAD_REQUEST, 400, errorResponse, [])
          }
        }
        for (let key of stlReportStatusData) {
          let year, seasoneCode
          if (key.year) {
            year = parseInt(key.year.slice(0, 4));

          }
          if (key.season) {
            seasoneCode = key.season.toString().slice(0, 1).toUpperCase()
          }

          let generateSlipData = await db.generateSampleSlipsModel.findOne({
            where: {
              unique_code: key.unique_code
            }
          });

          let stlReportIsExist = await db.stlReportStatusModel.findOne({
            where: {
              unique_code: key.unique_code
            }
          });

          if (!stlReportIsExist && generateSlipData) {
            data = {
              year: year,
              season: seasoneCode,
              crop_code: key.crop_code ? key.crop_code : "",
              variety_code: key.variety_code ? key.variety_code : "",
              variety_code_line: key.parental_line_code ? key.parental_line_code : null,

              pure_seed: key.pure_seed ? key.pure_seed : null,
              inert_matter: key.inert_matter ? key.inert_matter : null,
              weed_seed_purity: key.weed_seed_purity ? key.weed_seed_purity : null,
              other_crop_purity: key.other_crop_purity ? key.other_crop_purity : null,
              weed_seed: key.weed_seed ? key.weed_seed : null,
              other_seed: key.other_seed ? key.other_seed : null,
              other_crop_seed: key.other_crop_seed ? key.other_crop_seed : null,
              normal_seeding: key.normal_seeding ? key.normal_seeding : null,
              abnormal_seeding: key.abnormal_seeding ? key.abnormal_seeding : null,
              dead_seed: key.dead_seed ? key.dead_seed : null,
              hard_seed: key.hard_seed ? key.hard_seed : null,
              fresh_ungerminated: key.fresh_ungerminated ? key.fresh_ungerminated : null,
              other_distinguisable_varieties: key.other_distinguisable_varieties ? key.other_distinguisable_varieties : null,
              insect_damage: key.insect_damage ? key.insect_damage : null,
              nematode: key.nematode ? key.nematode : null,
              husk: key.husk ? key.husk : null,
              status: null,
              m: key.m ? key.m : null,
              // date_of_test: key.date_of_test ? key.date_of_test : null,
              date_of_test: this.getCurrentDateTime(),
              lot_no: generateSlipData.lot_no ? generateSlipData.lot_no : "",
              class_of_seed: generateSlipData.class_of_seed ? generateSlipData.class_of_seed : null,
              godown_no: generateSlipData.godown_no ? generateSlipData.godown_no : null,
              stack_no: generateSlipData.stack_no ? generateSlipData.stack_no : null,
              no_of_bags: generateSlipData.no_of_bags ? generateSlipData.no_of_bags : null,
              total_processed_qnt: generateSlipData.total_processed_qnt ? generateSlipData.total_processed_qnt : null,
              unique_code: generateSlipData.unique_code ? generateSlipData.unique_code : "",
              sample_no: generateSlipData.sample_no ? generateSlipData.sample_no : 1,
              chemical_treatment: generateSlipData.chemical_treatment,
              lot_id: generateSlipData.lot_id ? generateSlipData.lot_id : null,
              user_id: generateSlipData.user_id ? generateSlipData.user_id : null,
              testing_lab: generateSlipData && generateSlipData.testing_lab ? parseInt(generateSlipData.testing_lab) : null
            }
            createData = await db.stlReportStatusModel.create(data);


          }
          // console.log('responseData=======',responseStlData)
        }
        if (createData) {
          return response(res, status.DATA_SAVE, 200, []);
        } else {
          return response(res, status.DATA_NOT_SAVE, 201, []);
        }
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static updateStlReportStatusData = async (req, res) => {
    try {
      let updateStatus;
      if (req.body && req.body.id) {

        updateStatus = await db.stlReportStatusModel.update({
          status: req.body.status
        }, {
          where: {
            id: req.body.id
          }
        });
        if (updateStatus) {
          let generateSlipData = await db.generateSampleSlipsModel.update({
            status: 'reject'
          }, {
            where: {
              year: req.body.data.year,
              season: req.body.data.season,
              crop_code: req.body.data.crop_code,
              variety_code: req.body.data.variety_code,
              lot_id: req.body.data.lot_id,
              user_id: req.body.data.user_id
            }
          });
          let generateSlipForwardingData = await db.generateSampleForwardingLettersModel.update({
            status: 'reject'
          }, {
            where: {
              year: req.body.data.year,
              season: req.body.data.season,
              crop_code: req.body.data.crop_code,
              variety_code: req.body.data.variety_code,
              lot_id: req.body.data.lot_id,
              user_id: req.body.data.user_id
            }
          });
          return response(res, "Status Updated Successfully", 200, []);
        } else {
          return response(res, "Status Not Updated", 201, []);
        }
      } else {
        return response(res, "data not exist", 201, []);
      }

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getAllCropList = async (req, res) => {
    let data = {};
    //console.log('data1111111', data)

    try {
      let condition = {
        where: {

        },
        attributes: ['crop_code', 'crop_name']
      }
      condition.order = [['crop_name', 'ASC']];
      data = await cropModel.findAll(condition);
      //console.log('data', data)
      // res.send(data)
      if (data && data.length) {
        response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAllVarietypListv1 = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
        },
        attributes: ['variety_name', 'variety_code']
      }
      condition.order = [['variety_name', 'ASC']];
      if (req.body && req.body.search) {
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }
      data = await varietyModel.findAll(condition);
      if (data && data.length) {
        response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAllVarietyLineListv1 = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
        },
        attributes: ['line_variety_name', 'line_variety_code', 'variety_code']
      }
      condition.order = [['line_variety_name', 'ASC']];
      if (req.body && req.body.search) {
        if (req.body.search.variety_code) {
          condition.where.variety_code = req.body.search.variety_code
        }
      }

      data = await db.varietLineModel.findAll(condition);
      if (data && data.length) {
        response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static addVarietyPriceList = async (req, res) => {
    try {
      let yearValue;
      let seasonValue;
      let cropValue;
      let varietyValue;
      let lineVarietyValue;
      const data = db.varietyPriceList.build({
        year: req.body.year ? req.body.year : '',
        season: req.body.season ? req.body.season : '',
        crop_code: req.body.crop_code ? req.body.crop_code : '',
        variety_code: req.body.variety_code ? req.body.variety_code : '',
        variety_line_code: req.body.variety_line_code ? req.body.variety_line_code : '',
        // per_quintal_mrp: req.body.per_quintal_mrp ? req.body.per_quintal_mrp : '',
        package_data: req.body.packag_data ? req.body.packag_data : '',
        // valid_from:Date.now(),
        user_id: req.body.user_id ? req.body.user_id : req.body.loginedUserid.id,
        is_active: 1,
        created_at: Date.now(),
        updated_at: Date.now(),
        user_id: req.body.user_id ? req.body.user_id : req.body.loginedUserid.id,
      });
      if (req.body && req.body.type && req.body.type == 'edit') {
        let condition = {
          where: {
          }
        }

        if (req.body) {
          if (req.body.year) {
            condition.where.year = req.body.year
            yearValue = {
              year: req.body.year
            }
          }
          if (req.body.id) {
            condition.where.id = req.body.id
          }
          if (req.body.season) {
            condition.where.season = req.body.season
          }
          if (req.body.crop_code) {
            condition.where.crop_code = req.body.crop_code
          }
          if (req.body.variety_code) {
            condition.where.variety_code = req.body.variety_code
          }
          if (req.body.variety_line_code) {
            condition.where.variety_line_code = req.body.variety_line_code
          }
        }
        let priceListData = await db.varietyPriceList.findOne(condition);

        if (priceListData) {
          db.varietyPriceListPackagesModel.update({ is_active: false }, { where: { variety_priece_list_id: req.body.id } })
          db.varietyPriceList.update(
            {
              is_active: false
            },
            {
              where: {
                id: req.body.id,
                ...yearValue,
                ...seasonValue,
                ...cropValue,
                ...varietyValue,
                ...lineVarietyValue,
              }
            }
          )
          let dataValue = await data.save();
          if (req.body.packag_data && req.body.packag_data.length) {
            for (let key of req.body.packag_data) {
              db.varietyPriceListPackagesModel.create({
                variety_priece_list_id: dataValue['dataValues'].id,
                per_qnt_mrp: ((key.per_quintal_mrp / 100) * key.packag_size),
                packages_size: key.packag_size,
                per_quintal_price: key.per_quintal_mrp,
              })
            }
          }
          if (data) {
            return response(res, status.DATA_SAVE, 200, data)
          } else {
            return response(res, status.DATA_NOT_SAVE, 201, [])
          }
        } else {

        }
      } else {
        let dataValue = await data.save();
        if (req.body.packag_data && req.body.packag_data.length) {
          for (let key of req.body.packag_data) {
            db.varietyPriceListPackagesModel.create({
              variety_priece_list_id: dataValue['dataValues'].id,
              per_qnt_mrp: ((key.per_quintal_mrp / 100) * key.packag_size),
              packages_size: key.packag_size,
              per_quintal_price: key.per_quintal_mrp,
              // per_qnt_mrp: ((key.per_quintal_mrp *100)/key.packag_size).toFixed(2),
              // packages_size: key.packag_size,
              // per_quintal_price:key.per_quintal_mrp,
              // per_qnt_mrp: key.per_quintal_mrp,
              // packages_size: key.packag_size
            })
          }
        }

        if (data) {
          return response(res, status.DATA_SAVE, 200, data)
        } else {
          return response(res, status.DATA_NOT_SAVE, 201, [])
        }
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, [])
    }
  }
  static getVarietyPriceList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            required: true,
            model: varietyModel,
            attributes: []
          },
          {
            required: true,
            model: cropModel,
            attributes: []
          },
          // {
          //   model: db.varietyPriceListPackagesModel,
          //   attributes: [],
          //   where: {
          //     is_active: true
          //   }
          // }

          {
            required: false,
            model: db.varietLineModel,
            attributes: []
          },
        ],
        where: {

        },
        attributes: [
          [sequelize.col('variety_price_lists.id'), 'id'],
          [sequelize.col('variety_price_lists.year'), 'year'],
          [sequelize.col('variety_price_lists.season'), 'season'],
          [sequelize.col('variety_price_lists.crop_code'), 'crop_code'],
          [sequelize.col('variety_price_lists.variety_code'), 'variety_code'],
          [sequelize.col('variety_price_lists.variety_line_code'), 'variety_line_code'],
          [sequelize.col('variety_price_lists.per_quintal_mrp'), 'per_quintal_mrp'],
          [sequelize.col('variety_price_lists.valid_from'), 'valid_from'],
          [sequelize.col('variety_price_lists.created_at'), 'created_at'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('variety_price_lists.package_data'), 'package_data'],
          // [sequelize.col('variety_price_list_package.per_qnt_mrp'), 'per_qnt_mrp'],
          // [sequelize.col('variety_price_list_package.packages_size'), 'packages_size']
        ],
        raw: true,
        where: {
          user_id: req.body.loginedUserid.id
        }
      }
      condition.where.is_active = true;
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = req.body.search.variety_code
        }
        if (req.body.search.variety_line_code) {
          condition.where.variety_line_code = req.body.search.variety_line_code
        }
      }
      let priceListData = await db.varietyPriceList.findAndCountAll(condition);

      if (priceListData && priceListData.rows && priceListData.rows.length) {
        return response(res, status.DATA_AVAILABLE, 200, priceListData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, priceListData);
      }
    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 501, [])
    }
  }

  static deleteVarietyPriceList = async (req, res) => {
    try {
      if (req.body && req.body.id) {
        const data = await db.varietyPriceList.destroy({
          where: {
            id: req.body.id
          }
        })
        if (data) {
          return response(res, status.DATA_DELETED, 200, []);
        } else {
          return response(res, "Data Not Deleted", 200, [])
        }
      } else {
        return response(res, "Data Not Found", 201, [])
      }
    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 501, [])
    }
  }
  static getAllVarietypListpriceLis = async (req, res) => {
    let data = {};
    try {

      let datas = await db.varietyPriceList.findAll({
        // crop_code:
        where: {
          crop_code: req.body.search.crop_code,
          year: req.body.search.year,
          season: req.body.search.season,
          // variety_line_code:null,
          user_id: req.body.loginedUserid.id,
        },
        raw: true,
        attributes: [
          'variety_code', 'variety_line_code'
        ]
      })
      let datas2 = await db.varietyPriceList.findAll({
        // crop_code:
        where: {
          crop_code: req.body.search.crop_code,
          year: req.body.search.year,
          season: req.body.search.season,
          // variety_line_code:null,
          user_id: req.body.loginedUserid.id,
        },
        raw: true,
        attributes: [
          'variety_line_code', 'variety_code'
        ]
      })

      let varietyLineData = [];
      let varieties = []
      if (datas2 && datas2.length > 0) {
        datas2.forEach(el => {
          varietyLineData.push(el && el.variety_line_code ? el.variety_line_code : '');
          varieties.push(el && el.variety_code ? el.variety_code : '')
        })
      }
      if (varietyLineData && varietyLineData.length > 0) {
        varietyLineData = varietyLineData.filter(x => x != '')
      }
      let varietyData = [];
      if (datas && datas.length > 0) {
        datas.forEach(el => {
          varietyData.push(el && el.variety_code ? el.variety_code : '')
        })
      }
      let datas3 = await db.varietyModel.findAll({
        required: false,
        include: [
          {
            model: db.varietLineModel,
            required: false,
            // where:{
            //   variety_code:{
            //     [Op.in]:varieties
            //   }
            // },
            attributes: []
          }
        ],
        where: {
          // variety_code:{
          //   [Op.in]:varieties
          // },
          crop_code: req.body.search.crop_code,
        },
        raw: true,

        attributes: [
          [sequelize.col('m_variety_line.line_variety_code'), 'line_variety_code'],
          [sequelize.col('m_variety_line.line'), 'line'],
          [sequelize.col('m_crop_varieties.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_varieties.variety_code'), 'variety_code'],

          //   'line_variety_code','variety_code'
        ],
        //  group:['line_variety_code','variety_code']
      })
      console.log(datas, 'datas')
      console.log(datas3, 'datas3')
      let varietyData1 = []
      let varietyData2 = [];


      if (datas3 && datas3.length > 0) {
        datas3.forEach(el => {
          varietyData1.push(el.variety_code)
          if (el.line_variety_code) {

          } else {
            varietyData2.push(el.variety_code)
          }
        })
      }
      function findUncommonData(arr1, arr2) {
        // Extract variety codes from arr2
        const arr2VarietyCodes = arr2.map(item => item.variety_code);

        // Filter arr1 to get elements not present in arr2
        const uncommonData = arr1.filter(item => {
          if (item.line_variety_code !== null) {
            // Filter using line_variety_code and variety_code
            const match = arr2.find(entry => entry.variety_code === item.variety_code && entry.variety_line_code === item.line_variety_code);
            return match === undefined; // Include if no match found
          } else {
            // Filter using only variety_code
            const match = arr2.find(entry => entry.variety_code === item.variety_code);
            return match === undefined; // Include if no match found
          }
        });

        return uncommonData;
      }

      // Call the function to get the uncommon data
      const uncommonDataArr1 = findUncommonData(datas3, datas);

      console.log(uncommonDataArr1, 'uncommonDataArr1');
      let variety = []
      if (uncommonDataArr1 && uncommonDataArr1.length > 0) {
        uncommonDataArr1.forEach(el => {
          variety.push(el.variety_code)
        })
      }

      let condition1 = {
        where: {
          crop_code: req.body.search.crop_code,
          // status:'variety',
          variety_code: {
            [Op.in]: variety
          }
        },
        attributes: [
          'variety_code', 'variety_name'
        ],
      }
      // condition.order = [['line_variety_name', 'ASC']];


      // let lineData = await db.varietLineModel.findAll(condition2);
      // console.log(lineData,'lineData')
      data = await varietyModel.findAll(condition1);
      // console.log('data',data)
      if (data && data.length) {
        response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  // all bspc details
  static getAllWillingBspcListData = async (req, res) => {
    try {

      let getAllBspcList = await db.userModel.findAll({
        include: [
          {
            required: true,
            model: db.agencyDetailModel,
            attributes: []
          }
        ],

        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('user.id')), 'bspc_id'],
          [sequelize.col('user.name'), 'short_name'],
          [sequelize.col('agency_detail.agency_name'), 'name'],
        ],
        where: {
          user_type: "BPC",
        },
        raw: true,
      });
      let finalArray = []
      if (getAllBspcList && getAllBspcList.length) {
        for (let key of getAllBspcList) {
          let param = {
            crop_code: req && req.body && req.body.search && req.body.search.crop_code ? req.body.search.crop_code : '',
            variety_code: req && req.body && req.body.search && req.body.search.variety_code ? req.body.search.variety_code : '',
            bspc_id: key && key.bspc_id ? key.bspc_id : '',
          }
          // let nucleusSeedData = await this.getNucleusSeedData(param);
          // let breederSeedData = await this.getBreederSeedData(param);

          finalArray.push({
            "bspc_id": key && key.bspc_id ? key.bspc_id : null,
            "short_name": key && key.short_name ? key.short_name : null,
            "name": key && key.name ? key.name : null,
          })
        }
        if (finalArray && finalArray.length) {
          return response(res, status.DATA_AVAILABLE, 200, finalArray)
        } else {
          return response(res, status.DATA_NOT_AVAILABLE, 201, [])
        }
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, error)
    }
  }

  static getAllVarietyLineListforPrice = async (req, res) => {
    let data = {};
    try {
      let datas = await db.varietyPriceList.findAll({
        // crop_code:
        where: {
          crop_code: req.body.search.crop_code,
          year: req.body.search.year,
          season: req.body.search.season,
          // variety_line_code:null,
          user_id: req.body.loginedUserid.id,
        },
        raw: true,
        attributes: [
          'variety_line_code'
        ]
      })

      let varietyLineData = [];
      if (datas && datas.length > 0) {
        datas.forEach(el => {
          varietyLineData.push(el && el.variety_line_code ? el.variety_line_code : '')
        })
      }
      if (varietyLineData && varietyLineData.length > 0) {

        varietyLineData = varietyLineData.filter(x => x != '')
      }
      let condition = {
        where: {
          line_variety_code: {
            [Op.notIn]: varietyLineData
          },
          variety_code: req.body.search.variety_code
        },

        attributes: ['line_variety_name', 'line_variety_code', 'variety_code']
      }
      condition.order = [['line_variety_name', 'ASC']];


      data = await db.varietLineModel.findAll(condition);
      if (data && data.length) {
        response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  // make a got report bsp5

  static getGotreportbspfiveyear = async (req, res) => {
    console.log(req.body);
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        where: {
          ...userId
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
        ]
      }

      let yearData = await db.bspPerestingsBspFiveModel.findAll(condition)
    console.log(yearData,"kthkthi");
      if (yearData) {
        return response(res, status.DATA_AVAILABLE, 200, yearData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getGotbspfiveyearreport = async (req, res) => {
    try {
      // Get the user ID from the request
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;  // Use the user's ID directly for querying
      }
  
      // Prepare the condition for the query
      let condition = {
        include: [
          {
            model: db.gotTestingModel,
            attributes: [],  
            where: {
              user_id: userId, 
            },
            required: true, 
            // on: {
            //   'bsp_proforma_5as.bspc_id': sequelize.col('got_testing.bspc_id') // Correct join condition (assuming 'bspc_id' exists in both models)
            // }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_5as.year')), 'year'],  // Correct use of DISTINCT
        ],
        group: ['bsp_proforma_5as.year'],  
      }
  
      // Execute the query with the condition
      let yearData = await db.bspPerestingsBspFiveModel.findAll(condition);
  
      // Respond based on the result
      if (yearData && yearData.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, yearData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  
  
  
  
  

  static getGotreportbspfiveSeason = async (req, res) => {
    console.log(req.body);
    try {
      let userId;
      //console.log('req.body.loginedUserid.id=====', req.body.loginedUserid.id);
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
      }

      let condition = {
        include: [
          {
            model: seasonModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_5as.season')), 'season'],
          [sequelize.col('m_season.season'), 'season_name'],

        ],
        where: {
          ...userId
        },
        raw: true
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
      }

      let seasonData = await db.bspPerestingsBspFiveModel.findAll(condition)
      if (seasonData) {
        return response(res, status.DATA_AVAILABLE, 200, seasonData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getGotbspfiveSeasonReport = async (req, res) => {
    // console.log(req.body);
    let filters = {};
    const { year } = req.body.search;
  
    try {
      let userId;  // Initialize userId
      console.log('req.body.loginedUserid.id=====', req.body.loginedUserid.id);
      
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        // Directly assign the user ID (not as an object)
        userId = req.body.loginedUserid.id;
      }
  
      // Add year filter if provided in the search
      if (year) {
        filters.year = year;
      }
  
      // Define the condition for the Sequelize query
      let condition = {
        include: [
          {
            model: seasonModel,
            attributes: []  // No attributes from the seasonModel (we only need to join it)
          },
          {
            model: db.gotTestingModel,  // Assuming 'gotTestingModel' is the model name for 'got_testing'
            attributes: [],  // No attributes from the 'gotTestingModel' (we only need to join it)
            where: {
              user_id: userId  // Filter where user_id matches the given userId
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_5as.season')), 'season'],  // Ensure distinct 'season' values
          [sequelize.col('m_season.season'), 'season_name']  // Fetch 'season_name' from the seasonModel
        ],
        where: {
          ...filters  // Apply the filters (including 'year' if provided)
        },
        raw: true  // Retrieve raw data
      };
  
      // Apply additional search filters for 'year' if present
      if (req.body && req.body.search && req.body.search.year) {
        condition.where.year = req.body.search.year;
      }
  
      // Execute the query with the condition
      let seasonData = await db.bspPerestingsBspFiveModel.findAll(condition);
  
      // Return the response based on the query result
      if (seasonData && seasonData.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, seasonData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  
  

  static getGotCropReport = async (req, res) => {
    let filters = {};
    const { year, season } = req.body.search;
  
    try {
      // Get user ID if available
      let userId = null;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;
      }
  
      // Add year and season to filters if they exist
      if (year) {
        filters.year = year;
      }
      if (season) {
        filters.season = season;
      }
  
      const crop_code = await db.bspPerestingsBspFiveModel.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_5as.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        where: {
          ...filters,
        },
        include: [
          {
            model: db.gotTestingModel,  // Join with 'gotTestingModel'
            attributes: [],  // No attributes from 'gotTestingModel', we just need to filter by user_id
            where: {
              user_id: userId,  // Filter by user_id
            },
          },
          {
            model: cropModel,  // Join with 'cropModel' (assuming 'm_crop' model)
            attributes: [],  // Empty attributes because we only need 'crop_name'
            required: true,  // Ensure only records with matching crops are included
          }
        ],
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']],  // Order by crop_name in ascending order
        raw: true,  // Retrieve raw data
      });
  
      // Check if crop_code is empty or not found
      if (!crop_code || crop_code.length === 0) {
        return response(res, 'No data found.', 404);
      }
  
      return response(res, 'Data found successfully.', 200, crop_code);
    } catch (error) {
      console.log('Database error in getGotCropReport:', error);
      return response(res, 'Unexpected error occurred.', 501, error);
    }
  };
  


  static getGotreportCrop = async (req, res) => {
    let filters = {};
    const { year, season } = req.body.search;

    try {
      // Get user ID if available
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id;
      }

      // Add year and season to filters if they exist
      if (year) {
        filters.year = year;
      }
      if (season) {
        filters.season = season;
      }
      const crop_code = await db.bspPerestingsBspFiveModel.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_5as.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        where: {
          ...filters,
        },
        include: [
          {
            model: cropModel,
            attributes: [], // Empty array because we only need 'crop_name' from 'm_crop'
            required: true // Ensures only records with matching crops are included
          }
        ],
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']],
        raw: true,
      });

      // Check if crop_code is empty or not found
      if (!crop_code || crop_code.length === 0) {
        return response(res, 'No data found.', 404);
      }

      return response(res, 'Data found successfully.', 200, crop_code);
    } catch (error) {
      console.log('Database error in getGotreportCrop:', error);
      return response(res, 'Unexpected error occurred.', 501, error);
    }
  };

  static getGotreportVariety = async (req, res) => {
    let filters = {};
    const { year, season } = req.body;

    try {
      // Get user ID if available
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id;
      }
      // Add year and season to filters if they exist
      if (year) {
        filters.year = year;
      }
      if (season) {
        filters.season = season;
      }
      // if (crop_code) {
      //   filters.crop_code = crop_code;
      // }
      const varietydata = await db.bspPerestingsBspFiveModel.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_5as.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        ],
        where: {
          ...filters,
        },
        include: [
          {
            model: db.varietyModel,
            as: 'm_crop_variety', // Update alias here to match hint
            attributes: [],
            required: true,
          }
        ],
        raw: true,
      });

      // Check if crop_code is empty or not found
      if (!varietydata || varietydata.length === 0) {
        return response(res, 'No data found.', 404);
      }

      return response(res, 'Data found successfully.', 200, varietydata);
    } catch (error) {
      console.log('Database error in getGotreportCrop:', error);
      return response(res, 'Unexpected error occurred.', 501, error);
    }
  };



  static getGotReportDetailsold= async (req, res) => {
    let filters = {};
    // const {crop_code,year,season,variety_code} 


    const year = req.body.search.year; // Parse from search object
    const season = req.body.search.season;
    const crop_code = req.body.search.crop_code;
    const variety_code = req.body.search.variety_code;

    try {
      // Get user ID if available
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id;
      }

      // Apply filters if present
      if (year) filters.year = year;
      if (season) filters.season = season;
      if (crop_code) filters.crop_code = crop_code;
      if (variety_code) {
        filters.variety_code = variety_code;
      }

      // Query bspPerestingsBspFiveModel with cropModel and varietyModel included
      const reportData = await db.bspPerestingsBspFiveModel.findAll({
        attributes: [
          'crop_code',
          'year',
          'season',
          'variety_code',
          'variety_line_code',
          'lot_id',
          'test_no',
          'unique_code',
          'lot_num',
          'number_sample_taken',
          'reference_index',
          'id',
          // 'area_shown',
          // 'date_of_bsp_2',
          // 'date_of_bsp_3',
          'true_plant',
          'consignment_no',
          'show_report_no',
          // 'genetic_purity',
          [sequelize.col('m_crop.crop_name'), 'crop_name'], // Get crop_name from cropModel
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'], // Update alias here
          [sequelize.col('generate_sample_forwarding_letter.godown_no'), 'godown_no'], // Update alias here
          [sequelize.col('generate_sample_forwarding_letter.stack_no'), 'stack_no'], // Update alias here
          [sequelize.col('generate_sample_forwarding_letter.no_of_bags'), 'no_of_bags'], // Update alias here
          [sequelize.col('generate_sample_forwarding_letter.consignment_no'), 'consignment_no'], // Update alias here
          [sequelize.col('generate_sample_forwarding_letter.class_of_seed'), 'class_of_seed'], // Update alias here
          [sequelize.col('generate_sample_forwarding_letter.got_bspc_id'), 'got_bspc_id'], // Update alias here
          [sequelize.col('generate_sample_forwarding_letter->user.name'), 'short_name'],
          [sequelize.col('generate_sample_forwarding_letter->user->agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('summary_observation.total_plants_observed'), 'total_plant_observed'], // Get crop_name from cropModel
          [sequelize.col('summary_observation.no_of_self_plant'), 'self_plant'], // Get crop_name from cropModel
          [sequelize.col('summary_observation.no_of_off_type'), 'off_type_plant'], // Get crop_name from cropModel
          [sequelize.col('summary_observation.no_of_true_plants'), 'true_plant'], // Get crop_name from cropModel
          [sequelize.col('bsp_proforma_1.id'), 'bsp_proforma_1_id'],
          //   [sequelize.col('bsp_proforma_1.updated_at'), 'date_of_bsp_2'],
          //   [sequelize.col('bsp_proforma_2.bsp_proforma_3.inspection_date'), 'date_of_bsp_3'],
          [sequelize.fn('TO_CHAR', sequelize.col('bsp_proforma_1.updated_at'), 'DD/MM/YYYY'), 'date_of_bsp_2'],
          [sequelize.fn('TO_CHAR', sequelize.col('bsp_proforma_2.bsp_proforma_3.inspection_date'), 'DD/MM/YYYY'), 'date_of_bsp_3'],

        ],
        where: filters,
        include: [
          {
            model: db.cropModel,
            as: 'm_crop', // Alias for cropModel
            attributes: [],
            required: true,
          },
          {
            model: db.varietyModel,
            as: 'm_crop_variety', // Update alias here to match hint
            attributes: [],
            required: true,
          },
          {
            model: db.bspPerformaBspOne,
            as: 'bsp_proforma_1',
            attributes: [],
            required: true, // Inner join

            on: {
              '$bsp_proforma_5as.crop_code$': { [Op.eq]: sequelize.col('bsp_proforma_1.crop_code') },
              '$bsp_proforma_5as.year$': { [Op.eq]: sequelize.col('bsp_proforma_1.year') },
              '$bsp_proforma_5as.season$': { [Op.eq]: sequelize.col('bsp_proforma_1.season') },
              '$bsp_proforma_5as.variety_code$': { [Op.eq]: sequelize.col('bsp_proforma_1.variety_code') },
              [Op.or]: [
                { '$bsp_proforma_5as.variety_line_code$': { [Op.is]: null } },
                { '$bsp_proforma_5as.variety_line_code$': { [Op.eq]: sequelize.col('bsp_proforma_1.variety_line_code') } }
              ]
            },
            include: [
              {
                model: db.bspProforma1BspcsModel,
                required: true,
                attributes: [],

                on: {
                  '$bsp_proforma_1.bsp_proforma_1_bspc.bspc_proforma_1_id$': { [Op.eq]: sequelize.col('bsp_proforma_1.id') },
                  '$bsp_proforma_1.bsp_proforma_1_bspc.bspc_id$': { [Op.eq]: sequelize.col('bsp_proforma_5as.bspc_id') }
                }
              }
            ]
          },
          {
            model: db.bspProrforma2Model,
            as: 'bsp_proforma_2',
            required: true,
            attributes: [],
            on: {
              '$bsp_proforma_5as.crop_code$': { [Op.eq]: sequelize.col('bsp_proforma_2.crop_code') },
              '$bsp_proforma_5as.year$': { [Op.eq]: sequelize.col('bsp_proforma_2.year') },
              '$bsp_proforma_5as.season$': { [Op.eq]: sequelize.col('bsp_proforma_2.season') },
              '$bsp_proforma_5as.variety_code$': { [Op.eq]: sequelize.col('bsp_proforma_2.variety_code') },
            },
            include: [
              {
                model: db.bspProrforma3Model,
                required: true,
                attributes: [],

                on: {
                  '$bsp_proforma_2.bsp_proforma_3.bsp_proforma_2_id$': { [Op.eq]: sequelize.col('bsp_proforma_2.id') },
                }
              }
            ]
          },


          {
            model: db.summaryObservationModel,
            as: 'summary_observation', // Update alias here to match hint
            attributes: [],
            required: true,
          },
          {
            model: db.generateSampleForwardingLettersModel,
            as: 'generate_sample_forwarding_letter', // Update alias here to match hint
            attributes: [],
            required: true,
            include: [
              {
                model: db.userModel,
                required: true,
                attributes: [], // Only specific columns
                where: {
                  user_type: 'BPC'
                },
                include: [
                  {
                    model: db.agencyDetailModel,
                    required: true,
                    attributes: []
                  }
                ]
              }
            ],
            where: {
              testing_type: 'GOT', // Add the WHERE condition here
            },
          },
        ],
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']],
        raw: true,
      });

      // Add the WHERE condition here

      // Check if data was found
      if (!reportData || reportData.length === 0) {
        return response(res, 'No data found.', 404);
      }

      return response(res, 'Data retrieved successfully.', 200, reportData);
    } catch (error) {
      console.log('Error retrieving report data:', error);
      return response(res, 'Unexpected error occurred.', 501, error);
    }
  };

  static getGotReportDetailsForDownloadoldwithoutgot= async (req, res) => {
    let filters = {};
    // const {crop_code,year,season,variety_code} 


    const year = req.body.search.year; // Parse from search object
    const season = req.body.search.season;
    const crop_code = req.body.search.crop_code;
    const variety_code = req.body.search.variety_code;
    const download_id = req.body.search.id;

    try {
      // Get user ID if available
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id;
      }
      console.log("fghjk",id);

      // Apply filters if present
      if (year) filters.year = year;
      if (season) filters.season = season;
      if (crop_code) filters.crop_code = crop_code;
      if (variety_code) {
        filters.variety_code = variety_code;
      }
      if (download_id) {
        filters.id = download_id;
      }
      console.log("download_id",download_id);
      

      // Query bspPerestingsBspFiveModel with cropModel and varietyModel included
      const reportData = await db.bspPerestingsBspFiveModel.findAll({
        attributes: [
          'crop_code',
          'year',
          'season',
          'variety_code',
          'variety_line_code',
          'lot_id',
          'test_no',
          'unique_code',
          'lot_num',
          'number_sample_taken',
          'area_shown',
          // 'date_of_bsp_2',
          // 'date_of_bsp_3',
          'true_plant',
          'consignment_no',
          'show_report_no',
          'sync_date',
          // 'genetic_purity',
          [sequelize.col('m_crop.crop_name'), 'crop_name'], // Get crop_name from cropModel
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'], // Update alias here// Update alias here
          [sequelize.col('generate_sample_forwarding_letter.got_bspc_id'), 'got_bspc_id'], // Update alias here
          [sequelize.col('generate_sample_forwarding_letter->user.name'), 'short_name'],
          [sequelize.col('generate_sample_forwarding_letter->user->agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('generate_sample_forwarding_letter->user->agency_detail.address'), 'address'],
         
          [sequelize.col('summary_observation.total_plants_observed'), 'total_plant_observed'], // Get crop_name from cropModel
          [sequelize.col('summary_observation.no_of_self_plant'), 'self_plant'], // Get crop_name from cropModel
          [sequelize.col('summary_observation.no_of_off_type'), 'off_type_plant'], // Get crop_name from cropModel
          [sequelize.col('summary_observation.no_of_true_plants'), 'true_plant'], // Get crop_name from cropModel
          [sequelize.col('bsp_proforma_1.id'), 'bsp_proforma_1_id'],
          //   [sequelize.col('bsp_proforma_1.updated_at'), 'date_of_bsp_2'],
          //   [sequelize.col('bsp_proforma_2.bsp_proforma_3.inspection_date'), 'date_of_bsp_3'],
          [sequelize.fn('TO_CHAR', sequelize.col('bsp_proforma_1.updated_at'), 'DD/MM/YYYY'), 'date_of_bsp_2'],
          [sequelize.fn('TO_CHAR', sequelize.col('bsp_proforma_2.bsp_proforma_3.inspection_date'), 'DD/MM/YYYY'), 'date_of_bsp_3'],

        ],
        where: filters,
        include: [
          {
            model: db.cropModel,
            as: 'm_crop', // Alias for cropModel
            attributes: [],
            required: true,
          },
          {
            model: db.varietyModel,
            as: 'm_crop_variety', // Update alias here to match hint
            attributes: [],
            required: true,
          },
          {
            model: db.bspPerformaBspOne,
            as: 'bsp_proforma_1',
            attributes: [],
            required: true, // Inner join

            on: {
              '$bsp_proforma_5as.crop_code$': { [Op.eq]: sequelize.col('bsp_proforma_1.crop_code') },
              '$bsp_proforma_5as.year$': { [Op.eq]: sequelize.col('bsp_proforma_1.year') },
              '$bsp_proforma_5as.season$': { [Op.eq]: sequelize.col('bsp_proforma_1.season') },
              '$bsp_proforma_5as.variety_code$': { [Op.eq]: sequelize.col('bsp_proforma_1.variety_code') },
              [Op.or]: [
                { '$bsp_proforma_5as.variety_line_code$': { [Op.is]: null } },
                { '$bsp_proforma_5as.variety_line_code$': { [Op.eq]: sequelize.col('bsp_proforma_1.variety_line_code') } }
              ]
            },
            include: [
              {
                model: db.bspProforma1BspcsModel,
                required: true,
                attributes: [],

                on: {
                  '$bsp_proforma_1.bsp_proforma_1_bspc.bspc_proforma_1_id$': { [Op.eq]: sequelize.col('bsp_proforma_1.id') },
                  '$bsp_proforma_1.bsp_proforma_1_bspc.bspc_id$': { [Op.eq]: sequelize.col('bsp_proforma_5as.bspc_id') }
                }
              }
            ]
          },
          {
            model: db.bspProrforma2Model,
            as: 'bsp_proforma_2',
            required: true,
            attributes: [],
            on: {
              '$bsp_proforma_5as.crop_code$': { [Op.eq]: sequelize.col('bsp_proforma_2.crop_code') },
              '$bsp_proforma_5as.year$': { [Op.eq]: sequelize.col('bsp_proforma_2.year') },
              '$bsp_proforma_5as.season$': { [Op.eq]: sequelize.col('bsp_proforma_2.season') },
              '$bsp_proforma_5as.variety_code$': { [Op.eq]: sequelize.col('bsp_proforma_2.variety_code') },
            },
            include: [
              {
                model: db.bspProrforma3Model,
                required: true,
                attributes: [],

                on: {
                  '$bsp_proforma_2.bsp_proforma_3.bsp_proforma_2_id$': { [Op.eq]: sequelize.col('bsp_proforma_2.id') },
                }
              }
            ]
          },


          {
            model: db.summaryObservationModel,
            as: 'summary_observation', // Update alias here to match hint
            attributes: [],
            required: true,
          },
          {
            model: db.generateSampleForwardingLettersModel,
            as: 'generate_sample_forwarding_letter', // Update alias here to match hint
            attributes: [],
            required: true,
            include: [
            {
            model: db.userModel,
            required: true,
            attributes: [], // Only specific columns
            where: {
              user_type: 'BPC'
            },
            include: [
              {
                model: db.userModel,
                required: true,
                attributes: []
              }, 
            ]
            
          },
          {
            model: db.seedProcessingRegister,
            required: true,
            attributes: [],
            include: [
              {
                model: db.investVerifyModel,
                required: true,
                //as:'invest_verification',
                attributes: [],
                // include: [
                //   {
                //     model: db.investHarvestingModel,
                //     required: true,
                //    // as:'invest_harvesting',
                //     attributes: []
                //   }, 
                // ]
              }, 
            ]
          },
         

        ],
            where: {
              testing_type: 'GOT', // Add the WHERE condition here
            },
          },
        ],
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']],
        raw: true,
      });
       const agencyDetails = await db.agencyDetailModel.findOne({
              where: { user_id: id },
              include: [
                {
                  model: db.stateModel,
                  attributes: [],
                  required: true,
                },
                {
                  model: db.districtModel,
                  attributes: [],
                  required: true,
                },
              ],
      
              attributes: [
                [sequelize.col('m_state.state_name'), 'state_name'],
                [sequelize.col('m_district.district_name'), 'district_name']
              ]
            });
            if (agencyDetails) {
              const agencyInfo = {
                state_name: agencyDetails.get('state_name') || 'NA',
                district_name: agencyDetails.get('district_name') || 'NA',
              };
        
              // Add agency details to each report data
              reportData.forEach(report => {
                report.agencyDetails = agencyInfo;
              });
            }
     
      if (!reportData || reportData.length === 0) {
        return response(res, 'No data found.', 404);
      }

      return response(res, 'Data retrieved successfully.', 200, reportData);
    } catch (error) {
      console.log('Error retrieving report data:', error);
      return response(res, 'Unexpected error occurred.', 501, error);
    }
  };

 

  static getGotReportDetails= async (req, res) => { 
    let filters = {};
    const year = req.body.search.year;
    const season = req.body.search.season;
    const crop_code = req.body.search.crop_code;
    const variety_code = req.body.search.variety_code;
  
    try {
      // Get user ID if available
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id;
      }
  
      // Apply filters if present
      if (year) filters.year = year;
      if (season) filters.season = season;
      if (crop_code) filters.crop_code = crop_code;
      if (variety_code) filters.variety_code = variety_code;
  
      // Query bspPerestingsBspFiveModel with cropModel and varietyModel included
      const reportData = await db.bspPerestingsBspFiveModel.findAll({
        attributes: [
          'crop_code',
          'year',
          'season',
          'variety_code',
          'variety_line_code',
          'lot_id',
          'test_no',
          'unique_code',
          'lot_num',
          'id',
          'number_sample_taken',
          'reference_index',
          'reference_no',
          'show_report_no',
          [sequelize.col('got_testing.user_id'), 'got_userid'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('got_testing->bsp_proforma_1.id'), 'bsp_proforma_1_id'],
          [sequelize.col('got_testing->bsp_proforma_2.area_shown'), 'area_shown'],
        [sequelize.fn('TO_CHAR', sequelize.col('got_testing->bsp_proforma_1.updated_at'), 'DD/MM/YYYY'), 'date_of_bsp_2'],
          [sequelize.fn('TO_CHAR', sequelize.col('got_testing->bsp_proforma_2->bsp_proforma_3.inspection_date'), 'DD/MM/YYYY'), 'date_of_bsp_3'],
          [sequelize.col('generate_sample_forwarding_letter.godown_no'), 'godown_no'],
          [sequelize.col('generate_sample_forwarding_letter.stack_no'), 'stack_no'],
          [sequelize.col('generate_sample_forwarding_letter.no_of_bags'), 'no_of_bags'],
          [sequelize.col('generate_sample_forwarding_letter.sample_no'), 'sample_no'],
          [sequelize.col('generate_sample_forwarding_letter.consignment_no'), 'consignment_no'],
          [sequelize.col('generate_sample_forwarding_letter.class_of_seed'), 'class_of_seed'],
          [sequelize.col('generate_sample_forwarding_letter.got_bspc_id'), 'got_bspc_id'],
          [sequelize.col('generate_sample_forwarding_letter->user.name'), 'short_name'],
          [sequelize.col('generate_sample_forwarding_letter->user->agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('summary_observation.total_plants_observed'), 'total_plant_observed'],
          [sequelize.col('summary_observation.no_of_self_plant'), 'self_plant'],
          [sequelize.col('summary_observation.no_of_off_type'), 'off_type_plant'],
          [sequelize.col('summary_observation.no_of_true_plants'), 'true_plant'],
          [sequelize.col('got_testing->user->agency_detail.agency_name'), 'fromuser'],
        
        ],
        where: filters,
        include: [
          {
            model: db.cropModel,
            as: 'm_crop',
            attributes: [],
            required: true,
          },
          {
            model: db.varietyModel,
            as: 'm_crop_variety',
            attributes: [],
            required: true,
          },
          {
            model: db.gotTestingModel,
            as: 'got_testing',
            attributes: [],
            required: true,
            on: {
              '$bsp_proforma_5as.crop_code$': { [Op.eq]: sequelize.col('got_testing.crop_code') },
              '$bsp_proforma_5as.year$': { [Op.eq]: sequelize.col('got_testing.year') },
              '$bsp_proforma_5as.season$': { [Op.eq]: sequelize.col('got_testing.season') },
              '$bsp_proforma_5as.variety_code$': { [Op.eq]: sequelize.col('got_testing.variety_code') },
              '$bsp_proforma_5as.bspc_id$': { [Op.eq]: sequelize.col('got_testing.bspc_id') },
              '$bsp_proforma_5as.unique_code$': { [Op.eq]: sequelize.col('got_testing.unique_code') },
              [Op.or]: [
                { '$got_testing.user_id$': { [Op.is]: null } },
              // { '$bsp_proforma_5as.bspc_id$': { [Op.eq]: sequelize.col('got_testing.bspc_id') }},
              // { '$got_testing.user_id$': { [Op.eq]: sequelize.col('got_testing.bspc_id') } },
              { '$bsp_proforma_5as.variety_line_code$': { [Op.is]: null } },
              { '$bsp_proforma_5as.variety_line_code$': { [Op.eq]: sequelize.col('got_testing.variety_line_code') } }
              ]
            },
            include: [
              // User Model Join
              {
                model: db.userModel,
                //as: 'user', // Use alias 'user' to reference the userModel in joins
                required: true,
                attributes: [],
                where: {
                  user_type: 'BPC',
                },
                include: [
                  {
                    model: db.agencyDetailModel,
                    required: true,
                    attributes: [],
                  }
                ],
                on: {
                  '$got_testing.user_id$': { [Op.eq]: sequelize.col('got_testing->user.id') }, // Join gotTesting to userModel via user_id
                }
              },
              // Join with bsp_performa_1 Model
              {
                model: db.bspPerformaBspOne,
                as: 'bsp_proforma_1',
                attributes: [],
                required: false,
                on: {
                  '$got_testing.crop_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.crop_code') },
                  '$got_testing.year$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.year') },
                   '$got_testing.season$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.season') },
                  '$got_testing.variety_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.variety_code') },
		             	'$got_testing->bsp_proforma_1.production_type$': { [Op.eq]: 'NORMAL' },

                },
                include: [
                  {
                    model: db.bspProforma1BspcsModel,
                    required: false,
                    attributes: [],
                    on: {
                      '$got_testing->bsp_proforma_1.bsp_proforma_1_bspc.bspc_proforma_1_id$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.id') },
                      '$got_testing->bsp_proforma_1.bsp_proforma_1_bspc.bspc_id$': { [Op.eq]: sequelize.col('got_testing.user_id') }
                    }
                  }
                ]
              },
              // Join with bsp_proforma_2 Model
              {
                model: db.bspProrforma2Model,
                as: 'bsp_proforma_2',
                required: false,
                attributes: [],
                on: {
                  '$got_testing.crop_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.crop_code') },
                  '$got_testing.year$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.year') },
                  '$got_testing.season$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.season') },
                  '$got_testing.variety_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.variety_code') },
                  '$got_testing.user_id$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.user_id') },
		              '$got_testing->bsp_proforma_2.production_type$': { [Op.eq]: 'NORMAL' },
                },
                include: [
                  {
                    model: db.bspProrforma3Model,
                    required: false,
                    attributes: [],
                    on: {
                      '$got_testing->bsp_proforma_2->bsp_proforma_3.bsp_proforma_2_id$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.id') },
                    }
                  }
                ]
              }
            ]
          },
          
          {
            model: db.summaryObservationModel,
            as: 'summary_observation',
            attributes: [],
            required: true,
          },
          {
            model: db.generateSampleForwardingLettersModel,
            as: 'generate_sample_forwarding_letter',
            attributes: [],
            required: true,
            include: [
              {
                model: db.userModel,
                required: true,
                attributes: [],
                where: {
                  user_type: 'BPC'
                },
                include: [
                  {
                    model: db.agencyDetailModel,
                    required: true,
                    attributes: [],
                  }
                ]
              },

            ],
            where: {
              testing_type: 'GOT', // Add the WHERE condition here
            },
          },
        ],
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']],
        raw: true,
      });
  
      // Check if data was found
      if (!reportData || reportData.length === 0) {
        return response(res, 'No data found.', 404);
      }
  
      return response(res, 'Data retrieved successfully.', 200, reportData);
    } catch (error) {
      console.log('Error retrieving report data:', error);
      return response(res, 'Unexpected error occurred.', 501, error);
    }
  };


  static getGotReportDetailsBspc = async (req, res) => {
    let filters = {};
    const { year, season, crop_code, variety_code } = req.body.search;
  
    try {
      // Initialize userId as null
      let userId;
  
      // Get user ID if available
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;
      }
  
      // Apply filters if present
      if (year) filters.year = year;
      if (season) filters.season = season;
      if (crop_code) filters.crop_code = crop_code;
      if (variety_code) filters.variety_code = variety_code;
  
      // Query bspPerestingsBspFiveModel with cropModel and varietyModel included
      const reportData = await db.bspPerestingsBspFiveModel.findAll({
        attributes: [
          'crop_code',
          'year',
          'season',
          'variety_code',
          'variety_line_code',
          'lot_id',
          'test_no',
          'unique_code',
          'lot_num',
          'id',
          'number_sample_taken',
          'reference_index',
          'reference_no',
          'show_report_no',
          [sequelize.col('got_testing.user_id'), 'got_userid'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('got_testing->bsp_proforma_1.id'), 'bsp_proforma_1_id'],
          [sequelize.col('got_testing->bsp_proforma_2.area_shown'), 'area_shown'],
          [sequelize.fn('TO_CHAR', sequelize.col('got_testing->bsp_proforma_1.updated_at'), 'DD/MM/YYYY'), 'date_of_bsp_2'],
          [sequelize.fn('TO_CHAR', sequelize.col('got_testing->bsp_proforma_2->bsp_proforma_3.inspection_date'), 'DD/MM/YYYY'), 'date_of_bsp_3'],
          [sequelize.col('generate_sample_forwarding_letter.godown_no'), 'godown_no'],
          [sequelize.col('generate_sample_forwarding_letter.stack_no'), 'stack_no'],
          [sequelize.col('generate_sample_forwarding_letter.no_of_bags'), 'no_of_bags'],
          [sequelize.col('generate_sample_forwarding_letter.sample_no'), 'sample_no'],
          [sequelize.col('generate_sample_forwarding_letter.consignment_no'), 'consignment_no'],
          [sequelize.col('generate_sample_forwarding_letter.class_of_seed'), 'class_of_seed'],
          [sequelize.col('generate_sample_forwarding_letter.got_bspc_id'), 'got_bspc_id'],
          [sequelize.col('generate_sample_forwarding_letter->user.name'), 'short_name'],
          [sequelize.col('generate_sample_forwarding_letter->user->agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('summary_observation.total_plants_observed'), 'total_plant_observed'],
          [sequelize.col('summary_observation.no_of_self_plant'), 'self_plant'],
          [sequelize.col('summary_observation.no_of_off_type'), 'off_type_plant'],
          [sequelize.col('summary_observation.no_of_true_plants'), 'true_plant'],
          [sequelize.col('got_testing->user->agency_detail.agency_name'), 'fromuser'],
        ],
        where: filters,
        include: [
          {
            model: db.cropModel,
            as: 'm_crop',
            attributes: [],
            required: true,
          },
          {
            model: db.varietyModel,
            as: 'm_crop_variety',
            attributes: [],
            required: true,
          },
          {
            model: db.gotTestingModel,
            as: 'got_testing',
            attributes: [],
            required: true,
            where: {
              user_id: userId  // Filter where user_id matches the given userId
            },
            on: {
              '$bsp_proforma_5as.crop_code$': { [Op.eq]: sequelize.col('got_testing.crop_code') },
              '$bsp_proforma_5as.year$': { [Op.eq]: sequelize.col('got_testing.year') },
              '$bsp_proforma_5as.season$': { [Op.eq]: sequelize.col('got_testing.season') },
              '$bsp_proforma_5as.variety_code$': { [Op.eq]: sequelize.col('got_testing.variety_code') },
              '$bsp_proforma_5as.bspc_id$': { [Op.eq]: sequelize.col('got_testing.bspc_id') },
              '$bsp_proforma_5as.unique_code$': { [Op.eq]: sequelize.col('got_testing.unique_code') },
             
              [Op.or]: [
                { '$got_testing.user_id$': { [Op.is]: null } },
                { '$bsp_proforma_5as.variety_line_code$': { [Op.is]: null } },
                { '$bsp_proforma_5as.variety_line_code$': { [Op.eq]: sequelize.col('got_testing.variety_line_code') } }
              ]
            },
            include: [
              {
                model: db.userModel,
                required: true,
                attributes: [],
                where: {
                  user_type: 'BPC',
                },
                include: [
                  {
                    model: db.agencyDetailModel,
                    required: true,
                    attributes: [],
                  }
                ],
                on: {
                  '$got_testing.user_id$': { [Op.eq]: sequelize.col('got_testing->user.id') },
                }
              },
              {
                model: db.bspPerformaBspOne,
                as: 'bsp_proforma_1',
                attributes: [],
                required: false,
                on: {
                  '$got_testing.crop_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.crop_code') },
                  '$got_testing.year$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.year') },
                  '$got_testing.season$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.season') },
                  '$got_testing.variety_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.variety_code') },
                  '$got_testing->bsp_proforma_1.production_type$': { [Op.eq]: 'NORMAL' },
                },
                include: [
                  {
                    model: db.bspProforma1BspcsModel,
                    required: false,
                    attributes: [],
                    on: {
                      '$got_testing->bsp_proforma_1.bsp_proforma_1_bspc.bspc_proforma_1_id$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.id') },
                      '$got_testing->bsp_proforma_1.bsp_proforma_1_bspc.bspc_id$': { [Op.eq]: sequelize.col('got_testing.user_id') }
                    }
                  }
                ]
              },
              {
                model: db.bspProrforma2Model,
                as: 'bsp_proforma_2',
                required: false,
                attributes: [],
                on: {
                  '$got_testing.crop_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.crop_code') },
                  '$got_testing.year$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.year') },
                  '$got_testing.season$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.season') },
                  '$got_testing.variety_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.variety_code') },
                  '$got_testing.user_id$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.user_id') },
                  '$got_testing->bsp_proforma_2.production_type$': { [Op.eq]: 'NORMAL' },
                },
                include: [
                  {
                    model: db.bspProrforma3Model,
                    required: false,
                    attributes: [],
                    on: {
                      '$got_testing->bsp_proforma_2->bsp_proforma_3.bsp_proforma_2_id$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.id') },
                    }
                  }
                ]
              }
            ]
          },
          {
            model: db.summaryObservationModel,
            as: 'summary_observation',
            attributes: [],
            required: true,
          },
          {
            model: db.generateSampleForwardingLettersModel,
            as: 'generate_sample_forwarding_letter',
            attributes: [],
            required: true,
            where: {
              testing_type: 'GOT',
            },
            include: [
              {
                model: db.userModel,
                required: true,
                attributes: [],
                where: {
                  user_type: 'BPC'
                },
                include: [
                  {
                    model: db.agencyDetailModel,
                    required: true,
                    attributes: [],
                  }
                ]
              },
            ],
          },
        ],
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']],
        raw: true,
      });
  
      // Check if data was found
      if (!reportData || reportData.length === 0) {
        return response(res, 'No data found.', 404);
      }
  
      return response(res, 'Data retrieved successfully.', 200, reportData);
    } catch (error) {
      console.log('Error retrieving report data:', error);
      return response(res, 'Unexpected error occurred.', 501, error);
    }
  };
  
  

  static getGotReportDetailsForDownload = async (req, res) => { 
    let filters = {};
    const year = req.body.search.year;
    const season = req.body.search.season;
    const crop_code = req.body.search.crop_code;
    const variety_code = req.body.search.variety_code;
     const download_id = req.body.search.id;
 try {
      // Get user ID if available
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
     // console.log("dfghj",id);
      // if (id) {
      //   filters.bspc_id = id;
      // }
  
      // Apply filters if present
      if (year) filters.year = year;
      if (season) filters.season = season;
      if (crop_code) filters.crop_code = crop_code;
      if (variety_code) filters.variety_code = variety_code;
    if (download_id) {
          filters.id = download_id;
        }

      
      // Query bspPerestingsBspFiveModel with cropModel and varietyModel included
      const reportData = await db.bspPerestingsBspFiveModel.findAll({
        attributes: [
          'crop_code',
          'year',
          'season',
          'variety_code',
          'variety_line_code',
          'lot_id',
          'test_no',
          'unique_code',
          'lot_num',
          'id',
          'number_sample_taken',
          'reference_index',
          'reference_no',
          'show_report_no',
          'sync_date',
          [sequelize.col('got_testing.user_id'), 'got_userid'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('got_testing->bsp_proforma_1.id'), 'bsp_proforma_1_id'],
          [sequelize.col('got_testing->bsp_proforma_2.area_shown'), 'area_shown'],
          [sequelize.fn('TO_CHAR', sequelize.col('got_testing->bsp_proforma_1.updated_at'), 'DD/MM/YYYY'), 'date_of_bsp_2'],
          [sequelize.fn('TO_CHAR', sequelize.col('got_testing->bsp_proforma_2->bsp_proforma_3.inspection_date'), 'DD/MM/YYYY'), 'date_of_bsp_3'],
          [sequelize.col('generate_sample_forwarding_letter.godown_no'), 'godown_no'],
          [sequelize.col('generate_sample_forwarding_letter.stack_no'), 'stack_no'],
          [sequelize.col('generate_sample_forwarding_letter.no_of_bags'), 'no_of_bags'],
          [sequelize.col('generate_sample_forwarding_letter.sample_no'), 'sample_no'],
          [sequelize.col('generate_sample_forwarding_letter.consignment_no'), 'consignment_no'],
          [sequelize.col('generate_sample_forwarding_letter.class_of_seed'), 'class_of_seed'],
          [sequelize.col('generate_sample_forwarding_letter.got_bspc_id'), 'got_bspc_id'],
          [sequelize.col('generate_sample_forwarding_letter->user.name'), 'short_name'],
          [sequelize.col('generate_sample_forwarding_letter.sample_no'), 'sample_no'],
          [sequelize.col('generate_sample_forwarding_letter->user->agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('summary_observation.total_plants_observed'), 'total_plant_observed'],
          [sequelize.col('summary_observation.no_of_self_plant'), 'self_plant'],
          [sequelize.col('summary_observation.no_of_off_type'), 'off_type_plant'],
          [sequelize.col('summary_observation.no_of_true_plants'), 'true_plant'],
          [sequelize.col('got_testing->user->agency_detail.agency_name'), 'fromuser'],
        
        ],
        where: filters,
        include: [
          {
            model: db.cropModel,
            as: 'm_crop',
            attributes: [],
            required: true,
          },
          {
            model: db.varietyModel,
            as: 'm_crop_variety',
            attributes: [],
            required: true,
          },
          {
            model: db.gotTestingModel,
            as: 'got_testing',
            attributes: [],
            required: true,
            on: {
              '$bsp_proforma_5as.crop_code$': { [Op.eq]: sequelize.col('got_testing.crop_code') },
              '$bsp_proforma_5as.year$': { [Op.eq]: sequelize.col('got_testing.year') },
              '$bsp_proforma_5as.season$': { [Op.eq]: sequelize.col('got_testing.season') },
              '$bsp_proforma_5as.variety_code$': { [Op.eq]: sequelize.col('got_testing.variety_code') },
              '$bsp_proforma_5as.bspc_id$': { [Op.eq]: sequelize.col('got_testing.bspc_id') },
              [Op.or]: [
                { '$bsp_proforma_5as.variety_line_code$': { [Op.is]: null } },
                { '$bsp_proforma_5as.variety_line_code$': { [Op.eq]: sequelize.col('got_testing.variety_line_code') } }
              ]
            },
            include: [
              // User Model Join
              {
                model: db.userModel,
                //as: 'user', // Use alias 'user' to reference the userModel in joins
                required: true,
                attributes: [],
                where: {
                  user_type: 'BPC',
                },
                include: [
                  {
                    model: db.agencyDetailModel,
                    required: true,
                    attributes: [],
                  }
                ],
                on: {
                  '$got_testing.user_id$': { [Op.eq]: sequelize.col('got_testing->user.id') }, // Join gotTesting to userModel via user_id
                }
              },
              // Join with bsp_performa_1 Model
              {
                model: db.bspPerformaBspOne,
                as: 'bsp_proforma_1',
                attributes: [],
                required: false,
                on: {
                  '$got_testing.crop_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.crop_code') },
                  '$got_testing.year$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.year') },
                  '$got_testing.season$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.season') },
                  '$got_testing.variety_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.variety_code') },
                },
                include: [
                  {
                    model: db.bspProforma1BspcsModel,
                    required: false,
                    attributes: [],
                    on: {
                      '$got_testing->bsp_proforma_1->bsp_proforma_1_bspc.bspc_proforma_1_id$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.id') },
                      '$got_testing->bsp_proforma_1->bsp_proforma_1_bspc.bspc_id$': { [Op.eq]: sequelize.col('got_testing.user_id') }
                    }
                  }
                ]
              },
              // Join with bsp_proforma_2 Model
              {
                model: db.bspProrforma2Model,
                as: 'bsp_proforma_2',
                required: false,
                attributes: [],
                on: {
                  '$got_testing.crop_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.crop_code') },
                  '$got_testing.year$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.year') },
                  '$got_testing.season$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.season') },
                  '$got_testing.variety_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.variety_code') },
                  '$got_testing.user_id$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.user_id') },
                },
                include: [
                  {
                    model: db.bspProrforma3Model,
                    required: false,
                    attributes: [],
                    on: {
                      '$got_testing->bsp_proforma_2->bsp_proforma_3.bsp_proforma_2_id$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.id') },
                    }
                  }
                ]
              }
            ]
          },
          
          {
            model: db.summaryObservationModel,
            as: 'summary_observation',
            attributes: [],
            required: true,
          },
          {
            model: db.generateSampleForwardingLettersModel,
            as: 'generate_sample_forwarding_letter',
            attributes: [],
            required: true,
            include: [
              {
                model: db.userModel,
                required: true,
                attributes: [],
                where: {
                  user_type: 'BPC'
                },
                include: [
                  {
                    model: db.agencyDetailModel,
                    required: true,
                    attributes: [],
                  }
                ]
              },
              {
                model: db.seedProcessingRegister,
                required: true,
                attributes: [],
                include: [
                  {
                    model: db.investVerifyModel,
                    // as : 'iv',
                    required: true,
                    attributes: [],
                    // include: [
                    //   {
                    //     model: db.investHarvestingModel,
                    //     as:'ih',
                    //     required: true,
                    //     attributes: []
                    //   }, 
                    // ]
                  }, 
                ]
              },

            ],
            where: {
              testing_type: 'GOT', // Add the WHERE condition here
            },
          },
        ],
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']],
        raw: true,
      });

      

      const agencyDetails = await db.agencyDetailModel.findOne({
        where: { user_id: id },
        include: [
          {
            model: db.stateModel,
            attributes: [],
            required: true,
          },
          {
            model: db.districtModel,
            attributes: [],
            required: true,
          },
        ],

        attributes: [
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('m_district.district_name'), 'district_name']
        ]
      });
      if (agencyDetails) {
        const agencyInfo = {
          state_name: agencyDetails.get('state_name') || 'NA',
          district_name: agencyDetails.get('district_name') || 'NA',
        };
  
        // Add agency details to each report data
        reportData.forEach(report => {
          report.agencyDetails = agencyInfo;
        });
      }
      // team data 

      const monitoringteam = await db.bsp5GotMemberRelationModel.findAll({
        where: { bsp_5as_id: download_id },
        include: [
          {
            model: db.gotMonitoringTeamsMemberModel,
            attributes: [],
            required: true,
            include: [
              {
                model: db.designationModel,
                attributes: [],
                required: true,
              }
            ]
          }
        ],
        attributes: [
          [sequelize.col('got_monitoring_team_member.name'), 'monitoringuser'],
          [sequelize.col('got_monitoring_team_member.mobile_number'), 'mobile_number'],
          [sequelize.col('got_monitoring_team_member->m_designation.name'), 'designation']
        ]
      });
  
      const monitoringTeamData = monitoringteam.map(team => ({
        monitoringuser: team.get('monitoringuser'),
        mobile_number: team.get('mobile_number'),
        designation: team.get('designation'),
      }));
      
      // console.log("monitoringteam",monitoringteam);
  
      // Check if data was found
      if (!reportData || reportData.length === 0) {
        return response(res, 'No data found.', 404);
      }
  
      return response(res, 'Data retrieved successfully.', 200, {
        reportData,
        monitoringTeamData,
      });
    } catch (error) {
      console.log('Error retrieving report data:', error);
      return response(res, 'Unexpected error occurred.', 501, error);
    }
  };

  static getGotReportDetailsForDownloadForQr = async (req, res) => { 
    let filters = {};
    const year = req.body.search.year;
    const season = req.body.search.season;
    const crop_code = req.body.search.crop_code;
    const variety_code = req.body.search.variety_code;
     const download_id = req.body.search.id;

  
    try {
      // Get user ID if available
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      console.log("new****************",id);

      // if (id) {
      //   filters.bspc_id = id;
      // }
  
      // Apply filters if present
      if (year) filters.year = year;
      if (season) filters.season = season;
      if (crop_code) filters.crop_code = crop_code;
      if (variety_code) filters.variety_code = variety_code;
    if (download_id) {
          filters.id = download_id;
        }

      
      // Query bspPerestingsBspFiveModel with cropModel and varietyModel included
      const reportData = await db.bspPerestingsBspFiveModel.findAll({
        attributes: [
          'crop_code',
          'year',
          'season',
          'variety_code',
          'variety_line_code',
          'lot_id',
          'test_no',
          'unique_code',
          'lot_num',
          'id',
          'number_sample_taken',
          'reference_index',
          'reference_no',
          'show_report_no',
          'sync_date',
          [sequelize.col('got_testing.user_id'), 'got_userid'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('got_testing->bsp_proforma_1.id'), 'bsp_proforma_1_id'],
          [sequelize.col('got_testing->bsp_proforma_2.area_shown'), 'area_shown'],
          [sequelize.fn('TO_CHAR', sequelize.col('got_testing->bsp_proforma_1.updated_at'), 'DD/MM/YYYY'), 'date_of_bsp_2'],
          [sequelize.fn('TO_CHAR', sequelize.col('got_testing->bsp_proforma_2->bsp_proforma_3.inspection_date'), 'DD/MM/YYYY'), 'date_of_bsp_3'],
          [sequelize.col('generate_sample_forwarding_letter.godown_no'), 'godown_no'],
          [sequelize.col('generate_sample_forwarding_letter.stack_no'), 'stack_no'],
          [sequelize.col('generate_sample_forwarding_letter.no_of_bags'), 'no_of_bags'],
          [sequelize.col('generate_sample_forwarding_letter.sample_no'), 'sample_no'],
          [sequelize.col('generate_sample_forwarding_letter.consignment_no'), 'consignment_no'],
          [sequelize.col('generate_sample_forwarding_letter.class_of_seed'), 'class_of_seed'],
          [sequelize.col('generate_sample_forwarding_letter.got_bspc_id'), 'got_bspc_id'],
          [sequelize.col('generate_sample_forwarding_letter->user.name'), 'short_name'],
          [sequelize.col('generate_sample_forwarding_letter.sample_no'), 'sample_no'],
          [sequelize.col('generate_sample_forwarding_letter->user->agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('summary_observation.total_plants_observed'), 'total_plant_observed'],
          [sequelize.col('summary_observation.no_of_self_plant'), 'self_plant'],
          [sequelize.col('summary_observation.no_of_off_type'), 'off_type_plant'],
          [sequelize.col('summary_observation.no_of_true_plants'), 'true_plant'],
          [sequelize.col('got_testing->user->agency_detail.agency_name'), 'fromuser'],
        
        ],
        where: filters,
        include: [
          {
            model: db.cropModel,
            as: 'm_crop',
            attributes: [],
            required: true,
          },
          {
            model: db.varietyModel,
            as: 'm_crop_variety',
            attributes: [],
            required: true,
          },
          {
            model: db.gotTestingModel,
            as: 'got_testing',
            attributes: [],
            required: true,
            on: {
              '$bsp_proforma_5as.crop_code$': { [Op.eq]: sequelize.col('got_testing.crop_code') },
              '$bsp_proforma_5as.year$': { [Op.eq]: sequelize.col('got_testing.year') },
              '$bsp_proforma_5as.season$': { [Op.eq]: sequelize.col('got_testing.season') },
              '$bsp_proforma_5as.variety_code$': { [Op.eq]: sequelize.col('got_testing.variety_code') },
              '$bsp_proforma_5as.bspc_id$': { [Op.eq]: sequelize.col('got_testing.bspc_id') },
              [Op.or]: [
                { '$bsp_proforma_5as.variety_line_code$': { [Op.is]: null } },
                { '$bsp_proforma_5as.variety_line_code$': { [Op.eq]: sequelize.col('got_testing.variety_line_code') } }
              ]
            },
            include: [
              // User Model Join
              {
                model: db.userModel,
                //as: 'user', // Use alias 'user' to reference the userModel in joins
                required: true,
                attributes: [],
                where: {
                  user_type: 'BPC',
                },
                include: [
                  {
                    model: db.agencyDetailModel,
                    required: true,
                    attributes: [],
                  }
                ],
                on: {
                  '$got_testing.user_id$': { [Op.eq]: sequelize.col('got_testing->user.id') }, // Join gotTesting to userModel via user_id
                }
              },
              // Join with bsp_performa_1 Model
              {
                model: db.bspPerformaBspOne,
                as: 'bsp_proforma_1',
                attributes: [],
                required: false,
                on: {
                  '$got_testing.crop_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.crop_code') },
                  '$got_testing.year$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.year') },
                  '$got_testing.season$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.season') },
                  '$got_testing.variety_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.variety_code') },
                },
                include: [
                  {
                    model: db.bspProforma1BspcsModel,
                    required: false,
                    attributes: [],
                    on: {
                      '$got_testing->bsp_proforma_1->bsp_proforma_1_bspc.bspc_proforma_1_id$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_1.id') },
                      '$got_testing->bsp_proforma_1->bsp_proforma_1_bspc.bspc_id$': { [Op.eq]: sequelize.col('got_testing.user_id') }
                    }
                  }
                ]
              },
              // Join with bsp_proforma_2 Model
              {
                model: db.bspProrforma2Model,
                as: 'bsp_proforma_2',
                required: false,
                attributes: [],
                on: {
                  '$got_testing.crop_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.crop_code') },
                  '$got_testing.year$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.year') },
                  '$got_testing.season$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.season') },
                  '$got_testing.variety_code$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.variety_code') },
                  '$got_testing.user_id$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.user_id') },
                },
                include: [
                  {
                    model: db.bspProrforma3Model,
                    required: false,
                    attributes: [],
                    on: {
                      '$got_testing->bsp_proforma_2->bsp_proforma_3.bsp_proforma_2_id$': { [Op.eq]: sequelize.col('got_testing->bsp_proforma_2.id') },
                    }
                  }
                ]
              }
            ]
          },
          
          {
            model: db.summaryObservationModel,
            as: 'summary_observation',
            attributes: [],
            required: true,
          },
          {
            model: db.generateSampleForwardingLettersModel,
            as: 'generate_sample_forwarding_letter',
            attributes: [],
            required: true,
            include: [
              {
                model: db.userModel,
                required: true,
                attributes: [],
                where: {
                  user_type: 'BPC'
                },
                include: [
                  {
                    model: db.agencyDetailModel,
                    required: true,
                    attributes: [],
                  }
                ]
              },
              {
                model: db.seedProcessingRegister,
                required: true,
                attributes: [],
                include: [
                  {
                    model: db.investVerifyModel,
                    // as : 'iv',
                    required: true,
                    attributes: [],
                    // include: [
                    //   {
                    //     model: db.investHarvestingModel,
                    //     as:'ih',
                    //     required: true,
                    //     attributes: []
                    //   }, 
                    // ]
                  }, 
                ]
              },

            ],
            where: {
              testing_type: 'GOT', // Add the WHERE condition here
            },
          },
        ],
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']],
        raw: true,
      });
      // console.log("**************124",reportData)
      // console.log("**************",reportData.got_userid)
      for (let report of reportData) {
      const agencyDetails = await db.agencyDetailModel.findOne({
        where: { user_id: report.got_userid },
        include: [
          {
            model: db.stateModel,
            attributes: [],
            required: true,
          },
          {
            model: db.districtModel,
            attributes: [],
            required: true,
          },
        ],

        attributes: [
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('m_district.district_name'), 'district_name']
        ]
      });
      if (agencyDetails) {
        const agencyInfo = {
          state_name: agencyDetails.get('state_name') || 'NA',
          district_name: agencyDetails.get('district_name') || 'NA',
        };
  
        // Add agency details to each report data
        reportData.forEach(report => {
          report.agencyDetails = agencyInfo;
        });
      }
    }
      // team data 

      const monitoringteam = await db.bsp5GotMemberRelationModel.findAll({
        where: { bsp_5as_id: download_id },
        include: [
          {
            model: db.gotMonitoringTeamsMemberModel,
            attributes: [],
            required: true,
            include: [
              {
                model: db.designationModel,
                attributes: [],
                required: true,
              }
            ]
          }
        ],
        attributes: [
          [sequelize.col('got_monitoring_team_member.name'), 'monitoringuser'],
          [sequelize.col('got_monitoring_team_member.mobile_number'), 'mobile_number'],
          [sequelize.col('got_monitoring_team_member->m_designation.name'), 'designation']
        ]
      });
  
      const monitoringTeamData = monitoringteam.map(team => ({
        monitoringuser: team.get('monitoringuser'),
        mobile_number: team.get('mobile_number'),
        designation: team.get('designation'),
      }));
      
      // console.log("monitoringteam",monitoringteam);
  
      // Check if data was found
      if (!reportData || reportData.length === 0) {
        return response(res, 'No data found.', 404);
      }
  
      return response(res, 'Data retrieved successfully.', 200, {
        reportData,
        monitoringTeamData,
      });
    } catch (error) {
      console.log('Error retrieving report data:', error);
      return response(res, 'Unexpected error occurred.', 501, error);
    }
  };

  


 
  static getBspcListDataForword = async (req, res) => {
    let filters = {};
    console.log("uyuhuhu", req.body.loginedUserid.id);
    // const {crop_code,year,season,variety_code} 


    const year = req.body.search.year; // Parse from search object
    const season = req.body.search.season;
    const crop_code = req.body.search.crop_code;
    const user_id = req.body.loginedUserid.id;
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      // if (id) {
      //   filters.bspc_id = id;
      // }

      // Apply filters if present
      if (year) filters.year = year;
      if (season) filters.season = season;
      if (crop_code) filters.crop_code = crop_code;
      if (user_id) filters.user_id = user_id;

      let getAllBspcList = await db.generateSampleSlipsModel.findAll({
        include: [
          {
            model: db.userModel,
            required: true,
            attributes: [], // Only specific columns
            where: {
              user_type: 'BPC'
            },
            include: [
              {
                model: db.agencyDetailModel,
                required: true,
                attributes: []
              }
            ]
          }
        ],
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('generate_sample_slips.got_bspc_id')), 'bspc_id'],
          [sequelize.col('user.name'), 'short_name'],
          [sequelize.col('user->agency_detail.agency_name'), 'agency_name'] // Nested join reference
        ],
        where: filters,
        raw: true,
      });

      let finalArray = [];
      if (getAllBspcList && getAllBspcList.length) {
        for (let key of getAllBspcList) {
          let param = {
            crop_code: req.body?.search?.crop_code || '',
            variety_code: req.body?.search?.variety_code || '',
            bspc_id: key?.bspc_id || ''
          };

          finalArray.push({
            bspc_id: key?.bspc_id || null,
            short_name: key?.short_name || null,
            agency_name: key?.agency_name || null,
          });
        }

        if (finalArray.length) {
          return response(res, status.DATA_AVAILABLE, 200, finalArray);
        } else {
          return response(res, status.DATA_NOT_AVAILABLE, 201, []);
        }
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.error(error);
      return response(res, status.UNEXPECTED_ERROR, 501, error);
    }
  };

  //get forwording State 
  static getStateListDataForword = async (req, res) => {
    let filters = {};
    const user_id = req.body.loginedUserid.id;
    const { year, season, crop_code, variety_code } = req.body.search || {};

    try {
      // Apply filters if present
      if (year) filters.year = year;
      if (season) filters.season = season;
      if (crop_code) filters.crop_code = crop_code;
      if (user_id) filters.user_id = user_id;


      // Perform the query to get distinct state codes and their names
      let getStateList = await db.generateSampleSlipsModel.findAll({
        include: [
          {
            model: db.stateModel,
            // as: 'stateModel', // Set alias explicitly for consistent referencing
            required: true,
            attributes: ['state_name'],
          }
        ],
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('generate_sample_slips.state_code')), 'state_code'],
          [sequelize.col('m_state.state_name'), 'state_name'], // Use explicit alias in the joined table's column
        ],
        where: filters,
        raw: true,
      });

      // console.log("getStateList*",getStateList);

      // Process and format the response
      let finalArray = [];
      if (getStateList && getStateList.length) {
        for (let key of getStateList) {
          finalArray.push({
            state_code: key.state_code,
            state_name: key.state_name,
            crop_code: crop_code || '',
            variety_code: variety_code || '',
            bspc_id: key.bspc_id || null,
          });
        }

        console.log("fjhfh**************", finalArray);

        return response(res, status.DATA_AVAILABLE, 200, finalArray);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.error(error);
      return response(res, status.UNEXPECTED_ERROR, 501, error);
    }
  };

  static seedTestingLaboratoryListstateforforwording = async (req, res) => {

    try {
      // Fetching data from stlLab using stateCode
      const stvvv = await stlLab(req.body.stateCode);
      console.log("userid**************", req.body.loginedUserid.id);
      // Modify the fetched data from stlLab
      const modifiedData = stvvv.data.map(item => ({
        ...item,
        idtype: typeof item.labId,
        lab_name: item.labName || 'NA',
        lab_code: item.labId || 'NA'
      }));

      console.log("Modified Data:", modifiedData);

      // Get the lab_codes from modifiedData
      const labCodes = modifiedData.map(item => item.lab_code);

      // Query database for matching lab_codes
      const dbResults = await db.generateSampleSlipsModel.findAll({
        include: [
          {
            model: db.seedLabTestModel,
            required: true,
          }
        ],
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('generate_sample_slips.testing_lab')), 'testing_lab'],
          [sequelize.col('m_seed_test_laboratory.lab_code'), 'lab_code'],
          [sequelize.col('m_seed_test_laboratory.id'), 'id'],// Use explicit alias in the joined table's column
        ],

        raw: true,
        where: {
          state_code: req.body.stateCode,
          user_id: req.body.loginedUserid.id,
          // lab_code: labCodes
        }
      });


      // console.log("Database Results:", dbResults);
      // console.log("mode*****", modifiedData);
      console.log("dbResults*****", dbResults);

      const finalResult = modifiedData.map(lab => {
        //   //   // Find the corresponding ID based on lab_code
        const matchingIdEntry = dbResults.find(entry => entry.lab_code === lab.lab_code);

        //     // Construct the new object, including the ID if found
        return {
          ...lab,
          id: matchingIdEntry ? matchingIdEntry.id : null // Include the ID if found
        };
      });

      //   // // Filtering out labs with lab_code 'NA' or if no ID was found
      const filteredResult = finalResult.filter(item => item.lab_code !== 'NA' && item.id !== null);

      console.log('Final Merged Result:', filteredResult);



      // Return the final data array as the response
      return response(res, status.DATA_AVAILABLE, 200, filteredResult);

    } catch (error) {
      console.error('Error:', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };




}
module.exports = StlForms
