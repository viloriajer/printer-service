const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const printers = require("@thiagoelg/node-printer");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { allowedNodeEnvironmentFlags } = require("process");
const { json } = require("express");
const port = 3000;

const app = express();

app.use(cors());
app.use(json());

// const express = require('')
let labelPrinter = new ThermalPrinter({
  interface: "printer:Munbyn ITPP941",
  driver: require("@thiagoelg/node-printer"),
  // characterSet: "PC437_USA",
});

//Star TSP143IIIBI Cutter
let starPrinter = new ThermalPrinter({
  type: PrinterTypes.STAR,
  interface: "printer:Star TSP143IIIBI Cutter",
  driver: require("@thiagoelg/node-printer"),
  // characterSet: "PC437_USA",
});

const object = {
  Location: "Taco Nova",
  Customer: "Jeremy",
  OrderId: 12345,
  Items: [
    { name: "item1", quantity: 1, modifiers: ["option1"] },
    // { name: "item2", quantity: 1, modifiers: ["option1", "option2"] },
  ],
};
const data = [1, 2, 3, 4, 5];
async function printReceipt(req) {
  const { Customer, Items, OrderId } = req.body;
  try {
    starPrinter.println(" ");
    starPrinter.setTextDoubleHeight();
    starPrinter.setTextDoubleWidth();
    starPrinter.println(" ");
    starPrinter.println(`Customer: ${Customer}`);
    starPrinter.println(`Order Number: ${OrderId}`);
    starPrinter.drawLine();
    starPrinter.setTextNormal();
    starPrinter.alignLeft();
    Items.forEach((num) => {
      starPrinter.bold();
      starPrinter.setTextDoubleHeight();
      starPrinter.setTextDoubleWidth();
      starPrinter.println(num.name);
      starPrinter.setTextNormal();
      num.modifiers.forEach((m) => starPrinter.println(`   ${m}`));
      starPrinter.newLine();
    });
    starPrinter.cut();
    starPrinter.execute();
    starPrinter.clear();
  } catch (error) {
    console.log("error: ", error);
  }
}

async function printLabel() {
  //   const command = `\0
  // SIZE 102 mm,152 mm
  // SET RIBBON OFF
  // REFERENCE 0,0
  // GAP 3 mm,0 mm
  // OFFSET 0 mm
  // DENSITY 6
  // SPEED 5
  // SETC AUTODOTTED OFF
  // CLS
  // TEXT 10,10,1,0,1,1,"Please work this time"
  // PRINT 1,1
  // `;
  const command = `\0
SIZE 102 mm,152 mm
SET RIBBON OFF
REFERENCE 0,0
GAP 3 mm,0 mm
OFFSET 0 mm
DENSITY 12
SPEED 5
SETC AUTODOTTED OFF
CLS
TEXT 300,500,"0",0,5,6,"New"
TEXT 300,800,"0",0,2,2,"Line"
${object.Items.map((item, index) => {
  return `TEXT 300,650,"0",0,2,2,"${item.name}"`;
})}
PRINT 1,1
`;
  try {
    // printers.printDirect({
    //   data: fs.readFileSync("./assets/text.backup.prn"),
    //   printer: "Munbyn ITPP941",
    //   type: "RAW",
    //   error: function (err) {
    //     console.log(err);
    //   },
    //   success: function (jobId) {
    //     console.log("success at jobid: ", jobId);
    //   },
    // });

    // var test = labelPrinter.println("tesssssstttt");
    // console.log(test);
    printers.printDirect({
      data: Buffer.from(command),
      printer: "Munbyn ITPP941",
      type: "RAW",
      error: function (err) {
        console.log(err);
      },
      success: function (jobId) {
        console.log("success at jobid: ", jobId);
      },
    });
  } catch (error) {
    console.log(error);
  }
}

app.post("/printReceipt", (req, res) => {
  printReceipt(req);
  res.sendStatus(200);
});

app.post("/printLabel", (req, res) => {
  printLabel();
  res.sendStatus(200);
});

app.post("/test", (req, res) => {
  res.send("You got it!");
});

app.listen(port, () => {
  console.log(`server is listening at localhost port: ${port}`);
});
