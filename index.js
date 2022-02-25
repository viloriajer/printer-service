const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const printers = require("@thiagoelg/node-printer");
const fs = require("fs");
const express = require("express");
const port = 3000;

const app = express();
// const express = require('')
let printMachine = new ThermalPrinter({
  type: PrinterTypes.STAR,
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
    { name: "item2", quantity: 1, modifiers: ["option1", "option2"] },
  ],
};
const data = [1, 2, 3, 4, 5];
async function printReceipt() {
  const { Location, Customer, Items, OrderId } = object;

  starPrinter.setTextDoubleHeight();
  starPrinter.setTextDoubleWidth();
  starPrinter.newLine();
  starPrinter.println(`Location: ${Location}`);
  starPrinter.println(`Customer: ${Customer}`);
  starPrinter.println(`Order Number: ${OrderId}`);
  starPrinter.drawLine();
  starPrinter.setTextNormal();
  starPrinter.alignLeft();
  Items.forEach((num) => {
    starPrinter.println(num.name);
    num.modifiers.forEach((m) => starPrinter.println(`   ${m}`));
    starPrinter.newLine();
  });
  starPrinter.cut();
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

    starPrinter.execute();
  } catch (error) {
    console.log("error: ", error);
  }
}

function printLabel() {
  try {
    printers.printDirect({
      data: fs.readFileSync("./assets/text.backup.prn"),
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

console.log(printers.getPrinters());

app.post("/printReceipt", (req, res) => {
  printReceipt();
  res.sendStatus(200);
});

app.post("/printLabel", (req, res) => {
  printLabel();
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`server is listening at localhost port: ${port}`);
});
