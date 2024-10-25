const { update } = require('@sap/cds');
const cds = require('@sap/cds');
const { select } = require('@sap/cds/libx/_runtime/hana/execute');
const axios = require('axios');
const { debug } = require('console');
const { nextTick } = require('process');
const { jsPDF } = require("jspdf");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

module.exports = async function (params, srv) {
    var UUid;
    var band;
    let { PurchaseEnquiry,EnquiryVehicle,PurchareVehicle,Customer,EnquiryFiles,EnquiryComments,PurchaseOrder,PurchaseVehicle,PurchaseFiles,PurchaseComments,VehicleInventory } = this.entities;


this.on('Fileds', async (req) => {
    debugger
    var editbut = 'false';
    if (req.data.para1) {
        UUid = req.data.para1;
        var status = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.para1 });
        console.log("functionImport triggered");
        if (status[0].status == 'Request' || status[0].status == 'Negotiation') {
            editbut = "true";
        }
        return editbut, status;
    }
});


this.on('Request', async (req) => {
    debugger
    UUid = req.data.r1;
    var vdata = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryId : req.data.r1 });
    if (vdata) {
        for (const vehicle of vdata) {
            if (vehicle.pricePerUnit == null) {
                const stockData = await SELECT.one.from(VehicleInventory).where({ vehicleCode: vehicle.materialCode });
                if (stockData) {
                    // Calculate the actual price based on quantity and stock price
                    const quantity = parseInt(vehicle.quantity);
                    const actualPrice = parseFloat(stockData.pricePerUnit) * quantity;
                    vehicle.actualPrice = actualPrice.toString();
                    vehicle.discountedPrice = actualPrice.toString();

                    await cds.update(EnquiryVehicle.drafts).set({
                        actualPrice: vehicle.actualPrice,
                        pricePerUnit: stockData.pricePerUnit.toString(),
                        discountedPrice: vehicle.actualPrice,
                        taxPercentage: stockData.taxPercentage.toString()
                    }).where({ vehicleId : vehicle.vehicleId });
                }

            }
        }
        await Total(vdata);
        var message = await Quantity(UUid);
    }
    return message;
});


this.on('Nego', async (req) => {
    debugger
    UUid = req.data.n1;
    var vdata = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.data.n1 });
    if (vdata) {
        for (const vehicle of vdata) {
            if (vehicle.discountedPrice == null) {

                const stockData = await SELECT.one.from(Stocks).where({ vehicleCode: vehicle.vehicleCode });
                if (stockData) {
                    // Calculate the actual price based on quantity and stock price
                    const quantity = parseInt(vehicle.quantity);
                    if (quantity > 10) {
                        vehicle.discount = stockData.gold;
                        band = `Gold(${vehicle.discount})`;
                    } else if (quantity > 5) {
                        vehicle.discount = stockData.silver;
                        band = `Silver(${vehicle.discount})`;
                    } else if (quantity > 3) {
                        vehicle.discount = stockData.platinum;
                        band = `Branze(${vehicle.discount})`;
                    } else {
                        vehicle.discount = '0';
                        band = 'Non';
                    }
                    const actualPrice = parseFloat(stockData.pricePerUnit) * quantity;
                    vehicle.actualPrice = actualPrice.toString();

                    if (vehicle.discount === '0') {
                        vehicle.discountedPrice = actualPrice.toString();
                    } else {
                        vehicle.discountedPrice = actualPrice - (actualPrice * vehicle.discount / 100);
                        vehicle.discountedPrice.toString();
                    }

                    await cds.update(PurchareVehicle).set({
                        band: band,
                        discount: vehicle.discount,
                        discountedPrice: vehicle.discountedPrice.toString(),
                    }).where({ vehicleID: vehicle.vehicleID });

                }
            }
        }
        await Total(vdata);
    }
    return { success: true, message: "you can proceed to the next step." };
});


async function Quantity(UUid) {
    debugger
    const vehicles = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryId: UUid });
    if (vehicles) {
        let insufficientStockMessages = [];
        for (let vehicle of vehicles) {
            const { vehicleId, quantity, vehicleColor } = vehicle;

            let purchaseVehicle = await SELECT.one.from(EnquiryVehicle).where({ vehicleId: vehicleId });
            if (!purchaseVehicle) {
                insufficientStockMessages.push(`Quotation Vehicle record not found for Vehicle ID: ${vehicleId}`);
                continue;
            }

            let stockData = await SELECT.one.from(VehicleInventory).where({ vehicleCode: purchaseVehicle.materialCode });

            if (!stockData) {
                insufficientStockMessages.push(`Stock information not found for vehicle ${purchaseVehicle.vehicleName}`);
                continue;
            }

            const stockQuantity = parseInt(stockData.quantity);
            const requestedQuantity = parseInt(quantity || purchaseVehicle.quantity); // Use provided quantity or existing one
            if (stockData.vehicleColor !== vehicleColor) {
                insufficientStockMessages.push(`Color ${vehicleColor} is not available for vehicle ${purchaseVehicle.vehicleName}.`);
            }
            if (requestedQuantity > stockQuantity) {
                insufficientStockMessages.push(`Insufficient stock for vehicle ${purchaseVehicle.vehicleName}. Available quantity: ${stockQuantity}, Requested quantity: ${requestedQuantity}`);
            }
        }

        if (insufficientStockMessages.length > 0) {
            const warningMessage = `⚠️ Warning: The following issues were found:<br>${insufficientStockMessages.join('<br>')}`;
            return { success: false, message: warningMessage };
        }
    }
    return { success: true, message: "Quantity and color are available, you can proceed to the next step." };
}

async function Total(vdata) {
    debugger
    let totalPrice = 0;
    let totalTax = 0;
    if (vdata) {
        for (const vehicle of vdata) {
            var stockData = await SELECT.one.from(VehicleInventory).where({ vehicleCode: vehicle.materialCode });
            if (vehicle.discount === '0' || vehicle.discount === '-' || vehicle.discount === null) {
                totalPrice += parseFloat(vehicle.actualPrice) || 0;
                const taxAmount = (parseFloat(stockData.pricePerUnit) * (parseFloat(stockData.taxPercentage)) / 100) * (parseInt(vehicle.quantity) || 0);
                totalTax += taxAmount;
            } else {
                totalPrice += parseFloat(vehicle.discountedPrice) || 0;
                const taxAmount = (parseFloat(stockData.pricePerUnit) * (parseFloat(stockData.taxPercentage) || 0) / 100) * (parseInt(vehicle.quantity) || 0);
                totalTax += taxAmount;
            }
        }
        var grandtotal = totalPrice + totalTax;

        await cds.update(PurchaseEnquiry.drafts).set({
            totalAmount: totalPrice.toString(),
            taxAmount: totalTax.toString(),
            grandtotal: grandtotal.toString()
        }).where({ purchaseEnquiryId: UUid });

    }
}


// this.before('UPDATE', PurchareVehicle.draft, async (req) => {

//     if (req.data.discount && req.data.vehicleID) {
//         const { vehicleID, discount } = req.data;
//         if (discount) {
//             if (discount < 0 || discount > 100 || /[a-zA-Z]/.test(discount)) {
//                 return req.reject(400, 'Discount cannot be negative or Discount must be below 100 or No alphabetic characters are allowed in the discount ');
//             }

//             var Vehicle = await SELECT.one.from(PurchareVehicle.drafts).where({ vehicleID: vehicleID });
//             if (!Vehicle) {
//                 return req.reject(404, 'PurchareVehicle Vehicle record not found');
//             }
//             const pricePerUnit = parseFloat(Vehicle.price);
//             const quantity = parseInt(Vehicle.quantity);
//             const discountValue = parseFloat(discount) || 0;
//             var discountedPrice = pricePerUnit;
//             discountedPrice = pricePerUnit - (pricePerUnit * discountValue / 100);

//             discountedPrice *= quantity;

//             await cds.update(PurchareVehicle.drafts).set({
//                 discountedPrice: discountedPrice.toString(),
//                 discount: discountValue.toString()
//             }).where({ vehicleID: vehicleID });

//         }
//         const vehicles = await SELECT.from(PurchareVehicle.drafts).where({ purchaseEnquiryUuid: Vehicle.purchaseEnquiryUuid });

//         let totalDiscountedPrice = 0;
//         for (const v of vehicles) {
//             totalDiscountedPrice += parseFloat(v.discountedPrice || 0);
//         }


//         var purchaseEnquiry = await SELECT.one.from(PurchaseEnquiry.drafts).where({ purchaseEnquiryUuid: Vehicle.purchaseEnquiryUuid });
//         const taxAmount = parseFloat(purchaseEnquiry.tax) || 0;
//         const grandTotal = totalDiscountedPrice + taxAmount;

//         await cds.update(PurchaseEnquiry.drafts).set({
//             totalPrice: totalDiscountedPrice.toString(),
//             grandtotal: grandTotal.toString()
//         }).where({ purchaseEnquiryUuid: Vehicle.purchaseEnquiryUuid });
//     }
// });

}