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
const { json } = require('express');
const { getDestination } = require('@sap-cloud-sdk/connectivity');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');

module.exports = async function (params, srv) {
    var UUid, userEmailId = 'pradeep.n@peolsolutions.com';
    var band, isPercentage = 'false';
    let { PurchaseEnquiry, EnquiryVehicle, PurchareVehicle, Customer, EnquiryFiles, EnquiryComments, PurchaseOrder, PurchaseVehicle, PurchaseFiles, PurchaseComments, VehicleInventory, SH } = this.entities;

    this.on('SalesOrvalue', async (req) => {
        
        // if(req.data.SalesOrg && req.data.Division && req.data.DistChan && req.data.Doctype){ 
        var sal2 = await SELECT.one.from(SH).where({ sHId: req.data.SalesOrg  });
        var div2 = await SELECT.one.from(SH).where({ sHId: req.data.Division  });
        var discha2 = await SELECT.one.from(SH).where({ sHId: req.data.DistChan });
        var doctyp2 = await SELECT.one.from(SH).where({ sHId: req.data.Doctype });
        

        
        let s1 =  '(' + sal2.sHDescription + ')';
        let s2 =  '(' + div2.sHDescription + ')';
        let s3 = '(' + discha2.sHDescription + ')';
        let s4 = '(' + doctyp2.sHDescription + ')';
        let values = [s1 , s2 , s3 , s4];
       console.log('Harsha',values); 
       return values;
       
      

    });
    this.on('statusFun', async (req) => {

        var editbut = 'false';
        if (req.data.purchaseEnquiryUuid) {
            UUid = req.data.purchaseEnquiryUuid;
            var status = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            console.log("functionImport triggered");
            if (status[0].status == 'Request' || status[0].status == 'Negotiation') {
                editbut = "true";
            }
            return editbut, status;
        }
    });

    // this.after('READ', EnquiryVehicle.drafts, (req) => {
       
    //     for (const veh of req) {
    //         if (veh.discount) {
    //             veh.isChecked = veh.discount.includes('%'); // Compute based on discount value
    //             veh.discount = veh.discount.slice(0, -1);
    //           } else {
    //               veh.isChecked = false; // Default to false if discount is not set
    //           }
    //     }
    //   });

    this.on('inProcessFun', async (req) => {

        var editbut = 'false';
        if (req.data.peUuid) {
            UUid = req.data.peUuid;
            var status = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.data.peUuid });
            console.log("functionImport triggered for get band");
            if (status[0].band) {
                editbut = "true";
            }
            return editbut, status;
        }
    });


    this.on('requestFun', async (req) => {

        UUid = req.data.peUuid;
        var vdata = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.data.peUuid });
        if (vdata) {
            for (const vehicle of vdata) {
                const stockData = await SELECT.one.from(VehicleInventory).where({ vehicleCode: vehicle.materialCode });
                if (stockData) {
                    // Calculate the actual price based on quantity and stock price
                    const quantity = parseInt(vehicle.quantity);
                    const actualPrice = parseFloat(stockData.pricePerUnit) * quantity;
                    vehicle.actualPrice = actualPrice.toString();
                    vehicle.discountedPrice = actualPrice.toString();
                    vehicle.totalPrice = (parseFloat(vehicle.discountedPrice) + (parseFloat(vehicle.discountedPrice) * (parseFloat(stockData.taxPercentage)) / 100)).toString();

                    await cds.update(EnquiryVehicle).set({
                        actualPrice: vehicle.actualPrice,
                        pricePerUnit: stockData.pricePerUnit.toString(),
                        discountedPrice: vehicle.actualPrice,
                        taxPercentage: stockData.taxPercentage.toString(),
                        totalPrice: vehicle.totalPrice
                    }).where({ vehicleId: vehicle.vehicleId });
                }

            }
            await Total(vdata);
        }
        var message = await Quantity(UUid);
        return message;
    });


    this.on('negotiationFun', async (req) => {

        UUid = req.data.peUuid;
        var vdata = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.data.peUuid });
        if (!vdata) {
            for (const vehicle of vdata) {
                if (typeof vehicle.discount === 'string' && vehicle.discount.includes('%')) {
                    vehicle.discount = parseFloat(vehicle.discount.replace('%', ''));
                }
                const stockData = await SELECT.one.from(VehicleInventory).where({ vehicleCode: vehicle.materialCode });
                if (stockData) {
                    // Calculate the actual price based on quantity and stock price
                    const quantity = parseInt(vehicle.quantity);
                    if (quantity >= stockData.platinumMinQty) {
                        vehicle.discount = stockData.platinumPer;
                        band = `Platinum(${vehicle.discount}%)`;
                    } else if (quantity >= stockData.goldMinQty) {
                        vehicle.discount = stockData.goldPer;
                        band = `Gold(${vehicle.discount}%)`;
                    } else if (quantity >= stockData.silverMinQty) {
                        vehicle.discount = stockData.silverPer;
                        band = `Silver(${vehicle.discount}%)`;
                    } else {
                        vehicle.discount = '0';
                        band = 'None(0%)';
                    }
                    const actualPrice = parseFloat(stockData.pricePerUnit) * quantity;
                    vehicle.actualPrice = actualPrice.toString();

                    if (vehicle.discount === '0') {
                        vehicle.discountedPrice = actualPrice.toFixed(2).toString();
                        vehicle.totalPirce = (parseFloat(vehicle.discountedPrice) + (parseFloat(vehicle.discountedPrice) * (parseFloat(vehicle.taxPercentage)) / 100)).toFixed(2).toString();
                    } else {
                        vehicle.discountedPrice = actualPrice - (actualPrice * vehicle.discount / 100);
                        vehicle.totalPrice = (parseFloat(vehicle.discountedPrice) + (parseFloat(vehicle.discountedPrice) * (parseFloat(vehicle.taxPercentage)) / 100)).toFixed(2).toString();
                    }

                    await cds.update(EnquiryVehicle).set({
                        band: band,
                        discount: vehicle.discount.toFixed(2).toString(),
                        discountedPrice: vehicle.discountedPrice.toFixed(2).toString(),
                        totalPrice: vehicle.totalPrice
                    }).where({ vehicleId: vehicle.vehicleId });

                }
            }
            await Total(vdata);
        }
        return { success: true, message: "you can proceed to the next step." };
    });


    async function Quantity(UUid) {

        const vehicles = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: UUid });
        if (vehicles) {
            let insufficientStockMessages = [];
            for (let vehicle of vehicles) {
                const { vehicleId, quantity, vehicleColor } = vehicle;

                let purchaseVehicle = await SELECT.from(EnquiryVehicle).where({ vehicleId: vehicleId });
                if (!purchaseVehicle) {
                    insufficientStockMessages.push(`Quotation Vehicle record not found for Vehicle ID: ${vehicleId}`);
                    continue;
                }

                let stockData = await SELECT.from(VehicleInventory).where({ vehicleCode: purchaseVehicle[0].materialCode });

                if (!stockData) {
                    insufficientStockMessages.push(`Stock information not found for vehicle ${purchaseVehicle[0].vehicleName}`);
                    continue;
                }

                const stockQuantity = parseInt(stockData[0].quantity);
                const requestedQuantity = parseInt(quantity || purchaseVehicle[0].quantity); // Use provided quantity or existing one
                if (stockData[0].vehicleColor !== vehicleColor) {
                    insufficientStockMessages.push(`Color ${vehicleColor} is not available for vehicle ${purchaseVehicle[0].vehicleName}.`);
                }
                if (requestedQuantity > stockQuantity) {
                    insufficientStockMessages.push(`Insufficient stock for vehicle ${purchaseVehicle[0].vehicleName}. Available quantity: ${stockQuantity}, Requested quantity: ${requestedQuantity}`);
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
                var stockData = await SELECT.from(VehicleInventory).where({ vehicleCode: vehicle.materialCode });
                if (vehicle.discount === '0' || vehicle.discount === '-' || vehicle.discount === null) {
                    totalPrice += parseFloat(vehicle.actualPrice) || 0;
                    const taxAmount = (parseFloat(stockData[0].pricePerUnit) * (stockData[0].taxPercentage) / 100) * (parseInt(vehicle.quantity) || 0);
                    totalTax += taxAmount;
                } else {
                    totalPrice += parseFloat(vehicle.discountedPrice) || 0;
                    const taxAmount = (parseFloat(vehicle.discountedPrice) * (stockData[0].taxPercentage) / 100);
                    totalTax += taxAmount;
                }
            }
            var grandtotal1 = totalPrice + totalTax;

            await cds.update(PurchaseEnquiry).set({
                totalAmount: totalPrice.toFixed(2).toString(),
                taxAmount: totalTax.toFixed(2).toString(),
                grandTotal: grandtotal1.toFixed(2).toString(),
            }).where({ purchaseEnquiryUuid: vdata[0].purchaseEnquiryUuid })
        }
    }

    this.on('quotationFun', async (req) => {
        debugger
        let uniqueId;
        // let isUnique = false;
        // const min = 1;
        // const max = 1000000000;
        const LoadingStatus = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.peUuid });
        const VehicleData = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.data.peUuid });
        debugger
        if (LoadingStatus) {
            var { totalAmount, grandTotal, taxAmount } = LoadingStatus[0];

            var missingFields = [];
            if (!totalAmount || totalAmount == 0) missingFields.push('Total Price');
            if (!grandTotal || grandTotal == 0) missingFields.push('grand Total');
            if (!taxAmount || taxAmount == 0) missingFields.push('Tax');
            if (missingFields.length > 0) {
                var result = (`The following fields are missing: ${missingFields.join(', ')}`);
                return result; // Stop further processing
            }


            if (LoadingStatus[0].status == 'Request') {

                // while (!isUnique) {
                //     // Generate a random number between min and max
                //     uniqueId = (Math.floor(Math.random() * (max - min + 1)) + min).toString();

                //     // Check if this ID already exists
                //     const existingId = await SELECT.from(PurchaseEnquiry).where({ quotationId: uniqueId });
                //     isUnique = existingId.length === 0; // If it doesn't exist, it's unique
                // }

                const payload = {
                    "doc_type": LoadingStatus[0].docType,
                    "sales_org": LoadingStatus[0].salesOrg,
                    "distr_chan": LoadingStatus[0].distributionChannels,
                    "division": LoadingStatus[0].division,
                    "itemsSet": VehicleData.map(vehicle => ({
                        "item_number": vehicle.itemNo,
                        "material": vehicle.materialCode,
                        "target_qty": vehicle.quantity,
                        "partn_role": vehicle.partnerRole,
                        "partn_number": vehicle.partnerNumber
                    }))
                };
                const destinationName = 'ABAP_Destinations';
                debugger
                async function postSalesOrderData(payload) {
                    try {
                        debugger
                        const destination = await getDestination({ destinationName });


                        if (!destination || !destination.url) {
                            throw new Error('Destination URL not found or destination not configured correctly.');
                        }


                        const odataUrl = `${destination.url}/sap/opu/odata/sap/ZOD_PO_GENERATE_SRV/qt_headerSet`;

                        debugger
                        const response = await executeHttpRequest(destination, {
                            method: 'POST',
                            url: odataUrl,
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            data: payload,
                            timeout: 30000
                        });
                        debugger
                        console.log('Quotation ID:', response.data);
                        return response.data;

                    } catch (error) {

                        console.error('Error:', error.message || error.response?.data);
                        throw error;
                    }
                }




                debugger

                postSalesOrderData(payload).catch(err => {
                    console.error('Error:', err.message);
                });



                await cds.update(PurchaseEnquiry).set({ status: 'In Process', quotationId: uniqueId }).where({ purchaseEnquiryUuid: UUid });

                const values = {
                    purchaseEnquiryUuid: LoadingStatus[0].purchaseEnquiryUuid,
                    customerId: LoadingStatus[0].customerId,
                    commentsText: `${LoadingStatus[0].purchaseEnquiryId} - Quotation Sent`
                }
                await INSERT.into(EnquiryComments).entries(values);


            } else if (LoadingStatus[0].status == 'Negotiation') {

                await cds.update(PurchaseEnquiry).set({ status: 'In Process' }).where({ purchaseEnquiryUuid: UUid });
                const values = {
                    purchaseEnquiryUuid: LoadingStatus[0].purchaseEnquiryUuid,
                    customerId: LoadingStatus[0].customerId,
                    commentsText: ` ${LoadingStatus[0].purchaseEnquiryId} - Negotiated Quotation`
                }
                await INSERT.into(EnquiryComments).entries(values);
            }
        }
    });

    this.before('DELETE', PurchaseEnquiry, async (req) => {
        debugger
        // await cds.delete.from(EnquiryFiles).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
        await DELETE.from(EnquiryFiles).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });

    });
    this.before('UPDATE', PurchaseEnquiry, async (req) => {
        debugger 
        // req.data.status = 'Create Request';
        console.log(req.data);
        if (req.data.status === 'Create Request') {
            const destinationName = 'ABAP_Destinations';
            debugger
            async function postSalesOrderData(payload) {
                try {
                    debugger
                    const destination = await getDestination({ destinationName });


                    if (!destination || !destination.url) {
                        throw new Error('Destination URL not found or destination not configured correctly.');
                    }


                    const odataUrl = `${destination.url}/sap/ZOD_PO_GENERATE_SRV/inq_headerSet`;

                    debugger
                    const response = await executeHttpRequest(destination, {
                        method: 'POST',
                        url: odataUrl,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        data: payload,
                        timeout: 30000
                    });
                    debugger
                    console.log('Purchase Enquiry Id', response.data.d.InqNumber);
                  
                    // await UPDATE(PurchaseEnquiry).set({ purchaseEnquiryId:response.data.d.InqNumber }).where({ purchaseEnquiryUuid: '4e016908-cee7-426c-90ea-105c42baebad' });
                    const updatedRos = await UPDATE(PurchaseEnquiry)
                    .set({
                        purchaseEnquiryId: response.data.d.InqNumber
                    })
                    .where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
          
                    return response.data;

                } catch (error) {

                    console.error('ABAP Error', error.message || error.response?.data);
                    throw error;
                }
            }


            const vdata4 = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });

            const vdata5 = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });

            const payload = {
                "DocType": vdata5[0]?.docType || '',
                "SalesOrg": vdata5[0]?.salesOrg || '',
                "DistChan": vdata5[0]?.distributionChannels || '',
                "Division": vdata5[0]?.division || '',
                "inq_itemSet": vdata4
                    .filter(item => item.itemNo && item.materialCode) // Exclude items with null/undefined values
                    .map(item => ({
                        "ItemNumber": item.itemNo,
                        "Material": item.materialCode
                    })),
                "inq_partnerSet": vdata4
                    .filter(item3 => item3.partnerRole && item3.partnerNumber) // Exclude items with null/undefined values
                    .map(item3 => ({
                        "PartRole": item3.partnerRole,
                        "PartNumber": item3.partnerNumber
                    }))
            };
            
            console.log('ABAP CALL Payload', payload);
            debugger
            // const payload = {
            //     "DocType" : "AF",
            //     "SalesOrg" : "1000",
            //     "DistChan" : "10",
            //     "Division" : "00",
            //     "inq_itemSet" : [
            //     {
            //     "ItemNumber" : "000010",
            //     "Material" : "100-100"
            //     },
            //     {

            //     "ItemNumber" : "000020",
            //     "Material" : "100-120"
            //     }
            //     ],
            //     "inq_partnerSet" : [
            //     {
            //     "PartRole" : "AG",
            //     "PartNumber" : "0000001000"
            //     }
            //     ]
            //     }




            


            postSalesOrderData(payload).catch(err => {
                console.error('Error:', err.message);
            });



        }
        if (req.data.status === 'Negotiation') {
            const enquiryVehicles = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });

            // Check if all vehicles have the band as 'platinum'
            const allPlatinum = enquiryVehicles.every(vehicle => vehicle.band === `Platinum(${vehicle.discount}`);

            if (allPlatinum) {
                console.log("All are platinum, you cannot enter the discount");
            } else {
                console.log("Some vehicles are not platinum, discount can be entered.");
            }
        } else if (req.data.status === 'Approved') {
            console.log("patch Approved 1");
            let purchaseOrderId;
            let isUnique = false;  
            const min = 1;
            const max = 2000000000;

            while (!isUnique) {
                purchaseOrderId = (Math.floor(Math.random() * (max - min + 1)) + min).toString();

                const existingOrder = await SELECT.from(PurchaseOrder).where({ purchaseOrderId });
                isUnique = existingOrder.length === 0; // If it doesn't exist, it's unique
            }

            const enquiryData = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            if (enquiryData) {
                const purchaseEnquiry = enquiryData[0];

                const purchaseOrderData = {
                    purchaseOrderUuid: cds.utils.uuid(),
                    purchaseOrderId: purchaseOrderId,
                    customerId: purchaseEnquiry.customerId,
                    deliveryLocation: purchaseEnquiry.deliveryLocation,
                    amount: purchaseEnquiry.grandTotal,
                    contactPerson: purchaseEnquiry.contactPerson,
                    division: purchaseEnquiry.division,
                    distributionChannels: purchaseEnquiry.distributionChannels,
                    purchaseEnquiryId: purchaseEnquiry.purchaseEnquiryId,
                    totalPrice: purchaseEnquiry.totalAmount,
                    taxAmount: purchaseEnquiry.taxAmount,
                    grandTotal: purchaseEnquiry.grandTotal,
                    quotationID: purchaseEnquiry.quotationId,
                    status: 'Approved',
                    docType: purchaseEnquiry.docType,
                    salesOrg: purchaseEnquiry.salesOrg,
                    soModifiedAt: new Date(),
                    purchaseToCustomer: { customerId: purchaseEnquiry.customerId }
                };
                var POder = await INSERT.into(PurchaseOrder).entries(purchaseOrderData);
                console.log('PurchaseOrder Data',POder);

                const purchaseVehicleData = [];
                const enquiryVehicles = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: purchaseEnquiry.purchaseEnquiryUuid });
                if (enquiryVehicles && enquiryVehicles.length != 0) {
                    for (const vehicle of enquiryVehicles) {
                        purchaseVehicleData.push({
                            vehicleID: cds.utils.uuid(),
                            purchaseOrderUuid: purchaseOrderData.purchaseOrderUuid,
                            materialCode: vehicle.materialCode,
                            vehicleName: vehicle.vehicleName,
                            vehicleColor: vehicle.vehicleColor,
                            quantity: vehicle.quantity,
                            band: vehicle.band,
                            partnerRole:vehicle.partnerRole,
                            partnerNumber:vehicle.partnerNumber,
                            pricePerUnit: vehicle.pricePerUnit,
                            taxPercentage: vehicle.taxPercentage,
                            actualPrice: vehicle.actualPrice,
                            totalPrice: vehicle.totalPrice,
                            discount: vehicle.discount,
                            discountedPrice: vehicle.discountedPrice,
                        });
                    }
                    if (purchaseVehicleData) {
                        await INSERT.into(PurchaseVehicle).entries(purchaseVehicleData);
                    }
                }

                const purchaseCommentData = [];
                debugger
                const enquiryComments = await SELECT.from(EnquiryComments).where({ purchaseEnquiryUuid: purchaseEnquiry.purchaseEnquiryUuid });
                if (enquiryComments && enquiryComments.length != 0) {
                    for (const comment of enquiryComments) {
                        purchaseCommentData.push({
                            commentId: cds.utils.uuid(),
                            purchaseOrderUuid: purchaseOrderData.purchaseOrderUuid,
                            customerId: purchaseOrderData.customerId,
                            user : comment.user,
                            commentsText: comment.commentsText,
                        });
                    }
                    if(purchaseCommentData){
                        await INSERT.into(PurchaseComments).entries(purchaseCommentData)
                    }
                }
              debugger
                const purchaseFileData = [];
                const enquiryFiles = await SELECT.from(EnquiryFiles).where({ purchaseEnquiryUuid: purchaseEnquiry.purchaseEnquiryUuid });
                if (enquiryFiles && enquiryFiles.length != 0) {
                    for (const file of enquiryFiles) {
                        purchaseFileData.push({
                            id: cds.utils.uuid(),
                            purchaseOrderUuid: purchaseOrderData.purchaseOrderUuid,
                            mediaType: file.mediaType,
                            fileName  : file.fileName,
                            url: file.url,
                        });
                    }
                    if (purchaseFileData) {
                        await INSERT.into(PurchaseFiles).entries(purchaseFileData);
                    }
                }

                

                console.log("after");

                //Divya's Flow
                const baseUrl = 'https://3c552736trial-dev-mahindra-sales-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/'
                const commenturl = baseUrl + `PurchaseOrder(purchaseOrderUuid=${purchaseOrderData.purchaseOrderUuid},IsActiveEntity=true)/purchaseToComments`;
                const pdfurl = baseUrl + `PurchaseOrder(purchaseOrderUuid=${purchaseOrderData.purchaseOrderUuid},IsActiveEntity=true)/purchaseToFiles`;
                const vehicleurl = baseUrl + `PurchaseOrder(purchaseOrderUuid=${purchaseOrderData.purchaseOrderUuid},IsActiveEntity=true)/purchaseToVehicle`;

                var poData1 = await SELECT.from(PurchaseOrder).where({ purchaseOrderUuid: purchaseOrderData.purchaseOrderUuid });
                var cust = await SELECT.from(Customer).where({ customerId: poData1[0].customerId });
                var veh = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: purchaseOrderData.purchaseOrderUuid });

                const oauthToken = await getOAuthToken2();
                const token = `Bearer ${oauthToken}`;

                var workflowContent = {

                    "definitionId": "us10.e5a4d54etrial.purchaseorderworkflow.purchaseOrder_Process",
                    "context": {
                        "poid": poData1[0].purchaseOrderId,
                        "deliverylocation": poData1[0].deliveryLocation,
                        "pdflink": pdfurl,
                        "companyname": cust[0].companyName,
                        "contactperson": poData1[0].contactPerson,
                        "phonenumber": cust[0].phone,
                        "emailaddress": cust[0].email,
                        "van": cust[0].van,
                        "address": cust[0].address,
                        "documenttype": poData1[0].docType,
                        "salesorg": poData1[0].salesOrg,
                        "distributionchannel": poData1[0].distributionChannels,
                        "division": poData1[0].division,
                        "vechiclelink": vehicleurl,
                        "commentlink": commenturl,
                        "pouuid": poData1[0].purchaseOrderUuid,
                        "jobtitle": cust[0].jobTitle,
                        "department": cust[0].department,
                        "taxid": cust[0].taxId,
                        "currency": cust[0].Currency,
                        "language": cust[0].Language,
                        "country":cust[0].Country,
                        "city":cust[0].City,
                        "street": cust[0].Street,
                        "namee": cust[0].name,
                        "postalcode": cust[0].postalCode,
                        "purchaseenquiryid": poData1[0].purchaseEnquiryId,
                        "location": cust[0].location,
                        "taxamount": poData1[0].taxAmount,
                        "grandtotal": poData1[0].grandTotal,
                        "totalprice": poData1[0].totalPrice
                    }
                      
                };

                // var BPA_Trigger = await cds.connect.to("BPA_Trigger");
                // var result = await BPA_Trigger.post('/workflow/rest/v1/SAPBuildProcessAutomationInstance', workflowContent);
                // console.log(result);
                try {
                    const res = await axios.post(
                        "https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances",
                        workflowContent,
                        {
                            headers: {
                                "Accept-Language": "en",
                                "DataServiceVersion": "2.0",
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "Authorization": token
                            }
                        }
                    );
                    console.log("Workflow started successfully:", res.data);
                    //await cds.update(PurchaseOrder).set({status:st, soModifiedAt: new Date()}).where({ purchaseOrderUuid : data.purchaseOrderUuid});
                } catch (error) {
                    // Log the detailed error response
                    console.error("Error starting workflow:", error.response ? error.response.data : error.message);
                }

                debugger

                //complete data 
                const completePurchaseOrderData = {
                    purchaseOrder: purchaseOrderData,
                    purchaseVehicles: purchaseVehicleData,
                    purchaseComments: purchaseCommentData,
                    purchaseFiles: purchaseFileData
                };

                console.log(completePurchaseOrderData);
            }
        }
        console.log("return", req.data)
        // return req;
    });

    this.after('UPDATE', PurchaseEnquiry, async (req) => {
        debugger;
        if (req.status === 'Request') {
            const vdata = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });
            debugger
            await Total(vdata);
        }

        // req.status = 'Create Request'
        console.log("patch call after");
        if (req.status === 'Create Request') {
            let uniqueId;
            let isUnique = false;
            const min = 1;
            const max = 3000000000;

            while (!isUnique) {
                uniqueId = (Math.floor(Math.random() * (max - min + 1)) + min).toString();

                const existingOrder = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryId: uniqueId });
                isUnique = existingOrder.length === 0; // If it doesn't exist, it's unique
            }
            await cds.update(PurchaseEnquiry).set({ purchaseEnquiryId: uniqueId }).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });

            var purchaseEnquiry = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });
            var cust = await SELECT.from(Customer).where({ customerId: purchaseEnquiry[0].customerId });
            var veh = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });
            // var comments =await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });
            const vehstring = JSON.stringify(veh)
            // var purchaseEnquiry = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });
            if (purchaseEnquiry[0].commentsText) {
                const newComment = {
                    commentId: cds.utils.uuid(),
                    purchaseEnquiryUuid: req.purchaseEnquiryUuid,
                    commentsText: purchaseEnquiry[0].commentsText,
                    user: 'C'
                };
                await INSERT.into(EnquiryComments).entries(newComment);
                await UPDATE(PurchaseEnquiry).set({ commentsText: null }).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });
                console.log('comments insert');
            }

            const oauthToken = await getOAuthTokenCR();
            const token = `Bearer ${oauthToken}`;

            var workflowData = {
                "definitionId": "us10.f2dbf934trial.enquiry.enquiryflow",
                "context": {
                    "purchaseenquiryid": purchaseEnquiry[0]?.purchaseEnquiryId || "",
                    "contactperson": purchaseEnquiry[0]?.contactPerson || "",
                    "customerid": purchaseEnquiry[0]?.customerId || "",
                    "deliverylocation": purchaseEnquiry[0]?.deliveryLocation || "",
                    "division": purchaseEnquiry[0]?.division || "",
                    "partnerrole": "o", // Example default value
                    "partnerno": "i", // Example default value
                    "itemno": "i", // Example default value
                    "material": "material1", // Example default value
                    "companyname": cust[0]?.companyName || "",
                    "address": cust[0]?.address || "",
                    "contactnumber": cust[0]?.phone || "",
                    "email": cust[0]?.email || "",
                    "van": cust[0]?.van || "NA",
                    "salesorg": purchaseEnquiry[0]?.salesOrg || "",
                    "documenttype": purchaseEnquiry[0]?.docType || "",
                    "distributionChannel": purchaseEnquiry[0]?.distributionChannels || "",
                    "puuid": purchaseEnquiry[0]?.purchaseEnquiryUuid || "",
                    "commentlink": `https://3c552736trial-dev-mahindra-sales-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/PurchaseEnquiry(purchaseEnquiryUuid=${req.purchaseEnquiryUuid},IsActiveEntity=true)/enquiryToComments`,
                    "filelink": `https://3c552736trial-dev-mahindra-sales-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/PurchaseEnquiry(purchaseEnquiryUuid=${req.purchaseEnquiryUuid},IsActiveEntity=true)/enquiryToFile`,
                    "jobtitle": cust[0]?.jobTitle || "",
                    "department": cust[0]?.department || "",
                    "taxid": cust[0]?.taxId || "",
                    "customercode": cust[0]?.companyCode || "",
                    "customerrole": "Customer", // Example default value
                    "currency": cust[0]?.Currency || "",
                    "language": cust[0]?.Language || "",
                    "country": cust[0]?.Country || "",
                    "city": cust[0]?.City || "",
                    "street": cust[0]?.Street || "",
                    "postalcode": cust[0]?.postalCode || "",
                    "location": cust[0]?.location || "",
                    "link": `https://3c552736trial-dev-mahindra-sales-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/PurchaseEnquiry(purchaseEnquiryUuid=${req.purchaseEnquiryUuid},IsActiveEntity=true)/enquiryToVehicle`
                }
            };
            debugger
            try {
                const res = await axios.post(
                    "https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances",
                    workflowData,
                    {
                        headers: {
                            "Accept-Language": "en",
                            "DataServiceVersion": "2.0",
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": token
                        }
                    }
                );
                console.log("Workflow started successfully:", res.data);
                //await cds.update(PurchaseOrder).set({status:st, soModifiedAt: new Date()}).where({ purchaseOrderUuid : data.purchaseOrderUuid});
            } catch (error) {
                // Log the detailed error response
                console.error("Error starting workflow:", error.response ? error.response.data : error.message);
            }

            debugger
            // var BPA_Trigger = await cds.connect.to("BPA_Trigger");
            // var result = await BPA_Trigger.post('/workflow/rest/v1/SAPBuildProcessAutomationInstance', workflowContent);
            // console.log(result);
            // debugger
            // dstination

        } else if (req.status === 'Approved') {
            // console.log("patch Approved");
            // const enquiryData = await SELECT.from(PurchaseEnquiry).where({  purchaseEnquiryUuid: req. purchaseEnquiryUuid });
            // const Data = await SELECT.from(PurchaseOrder).where({ quotationId: req.quotationId });
            // const values = {
            //     purchaseEnquiryUuid: enquiryData[0].purchaseEnquiryUuid,
            //     customerId: enquiryData[0].customerId,
            //     commentsText: `${Data[0].purchaseOrderId} - PO Accepted`
            // }
            // req.data.enquiryToComments.push(values);
            // await INSERT.into(EnquiryComments).entries(values);
        } else if (req.status === 'Negotiation') {
            if (req.commentsText) {
                const newComment = {
                    commentId: cds.utils.uuid(),
                    purchaseEnquiryUuid: req.purchaseEnquiryUuid,
                    // customerId: purchaseEnquiry[0].customerId,
                    commentsText: req.commentsText,
                    user: 'M'
                };
                await INSERT.into(EnquiryComments).entries(newComment);
                console.log('comments insert');
            }
        }
        console.log("new fail", req.enquiryToVehicle)
        return req;
    });

    this.before('UPDATE', EnquiryVehicle.drafts, async (req) => {
    const x = isPercentage
        const { vehicleId, discount } = req.data;
        if (!discount || discount.trim() === '') {
            return req.reject(400, 'Please enter a valid discount value.');
        } else if (/[a-zA-Z]/.test(discount)) {
            return req.reject(400, 'No alphabetic characters are allowed in the discount.');
        }else if (parseFloat(discount) < 0) {
            return req.reject(400, 'Discount cannot be negative.');
        }else if (discount.includes('%')) {
            return req.reject(400, 'To apply a percentage discount, please check the "Discount Check" column.');
        }
        var vdata = await SELECT.one.from(EnquiryVehicle.drafts).where({ vehicleId: req.data.vehicleId });
debugger
        const str = vdata.band;
        var  actualPrice = parseFloat(vdata.actualPrice).toFixed(2);
const match = str.match(/\((.*?)\)/); // Extract content within parentheses
const value = parseFloat(match ? match[1].replace('%', '') : null);
var banddiscount = actualPrice - (actualPrice * (value / 100));
        if (req.data.discount && req.data.vehicleId) {   
            if(isPercentage === 'true'){
                const discountValue = parseFloat(discount) || 0;
                banddiscount = banddiscount - (banddiscount * (discountValue/100));
                
                var totalAmount = (banddiscount +( banddiscount * (parseFloat(vdata.taxPercentage)) / 100)).toFixed(2).toString();

                await cds.update(EnquiryVehicle.drafts).set({
                    totalPrice: totalAmount,
                    discountedPrice: banddiscount.toFixed(2).toString(),
                    discount: discountValue.toFixed(2).toString()
                }).where({ vehicleId: vehicleId });

       
            }
            else{
                const discountValue = parseFloat(discount) || 0;
                banddiscount = banddiscount - discountValue;
                
                var totalAmount = (banddiscount +( banddiscount * (parseFloat(vdata.taxPercentage)) / 100)).toFixed(2).toString();

                await cds.update(EnquiryVehicle.drafts).set({
                    totalPrice: totalAmount,
                    discountedPrice: banddiscount.toString(),
                    discount: discountValue.toString()
                }).where({ vehicleId: vehicleId });

            }
        }
            //  const { vehicleId, discount } = req.data;

            // if (discount) {
            //     var vdata = await SELECT.from(EnquiryVehicle).where({ vehicleId: vehicleId });

            //     if (discount < 0 || discount > 100 || /[a-zA-Z]/.test(discount)) {
            //         return req.reject(400, 'Discount cannot be negative or Discount must be below 100 or No alphabetic characters are allowed in the discount ');
            //     } 
            //     // else if (parseFloat(req.data.discount) < parseFloat(vdata[0].discount)) {
            //     //     return req.reject(400, `Discount should be grater than ${vdata[0].discount}`);
            //     // }

            //     var Vehicle = await SELECT.from(EnquiryVehicle.drafts).where({ vehicleId: vehicleId });
            //     if (!Vehicle) {
            //         return req.reject(404, 'PurchareVehicle Vehicle record not found');
            //     }
            //     const pricePerUnit = parseFloat(Vehicle[0].pricePerUnit);
            //     const quantity = parseInt(Vehicle[0].quantity);
             

            //     var discountedPrice = pricePerUnit;
            //     discountedPrice = pricePerUnit - (pricePerUnit * discountValue / 100);

            //     discountedPrice *= quantity;
            //     Vehicle[0].totalAmount = (parseFloat(discountedPrice) + (parseFloat(discountedPrice) * (parseFloat(Vehicle[0].taxPercentage)) / 100)).toString();


                // req.data.totalPrice = Vehicle[0].totalAmount,
                //     req.data.discountedPrice = discountedPrice.toString(),
                //     req.data.discount = discountValue.toString()
        //     }
        //     const vehicles = await SELECT.from(EnquiryVehicle.drafts).where({ purchaseEnquiryUuid: Vehicle[0].purchaseEnquiryUuid });

        //     let totalDiscountedPrice = 0;
        //     let totalTax = 0;
        //     let taxAmount = 0;
        //     for (const v of vehicles) {
        //         totalDiscountedPrice += parseFloat(v.discountedPrice || 0);
        //         taxAmount = (parseFloat(v.totalPrice) - parseFloat(v.discountedPrice));
        //         totalTax += taxAmount;
        //     }

        //     const grandTotal = (totalDiscountedPrice + totalTax).toString();

        //     await cds.update(PurchaseEnquiry.drafts).set({
        //         totalAmount: totalDiscountedPrice.toString(),
        //         taxAmount: totalTax.toString(),
        //         grandtotal: grandTotal
        //     }).where({ purchaseEnquiryUuid: Vehicle[0].purchaseEnquiryUuid });
        //     // isPercentage = 'false'

        //     }else if(isPercentage == 'false'){
                
        //     const { vehicleId, discount } = req.data;

        //     if (discount) {
        //         var vdata = await SELECT.from(EnquiryVehicle).where({ vehicleId: vehicleId });

        //         // if (parseFloat(req.data.discount) < parseFloat(vdata[0].discount)) {
        //         //     return req.reject(400, `Discount should be grater than ${vdata[0].discount}`);
        //         // }

        //         var Vehicle = await SELECT.from(EnquiryVehicle.drafts).where({ vehicleId: vehicleId });
        //         if (!Vehicle) {
        //             return req.reject(404, 'PurchareVehicle Vehicle record not found');
        //         }
        //         const pricePerUnit = parseFloat(Vehicle[0].pricePerUnit);
        //         const quantity = parseInt(Vehicle[0].quantity);
        //         const discountValue = parseFloat(discount) || 0;
        //         var discountedPrice = pricePerUnit;
                
        //         if(pricePerUnit === vdata[0].discountedPrice){
        //             discountedPrice = vdata[0].actualPrice - discountValue;
        //         }else{
        //             // discountedPrice = vdata[0].actualPrice - discountValue;
        //             discountedPrice = parseFloat(vdata[0].discountedPrice) - discountValue;
        //         }
                
        //         // discountedPrice *= quantity;
        //         Vehicle[0].totalAmount = (parseFloat(discountedPrice) + (parseFloat(discountedPrice) * (parseFloat(Vehicle[0].taxPercentage)) / 100)).toString();

        //         await cds.update(EnquiryVehicle.drafts).set({
        //             totalPrice: Vehicle[0].totalAmount,
        //             discountedPrice: discountedPrice.toFixed(2).toString(),
        //             discount: discountValue.toFixed(2).toString()
        //         }).where({ vehicleId: vehicleId });


        //         // req.data.totalPrice = Vehicle[0].totalAmount,
        //         //     req.data.discountedPrice = discountedPrice.toString(),
        //         //     req.data.discount = discountValue.toString()
        //     }
        //     const vehicles = await SELECT.from(EnquiryVehicle.drafts).where({ purchaseEnquiryUuid: Vehicle[0].purchaseEnquiryUuid });

        //     let totalDiscountedPrice = 0;
        //     let totalTax = 0;
        //     let taxAmount = 0;
        //     for (const v of vehicles) {
        //         totalDiscountedPrice += parseFloat(v.discountedPrice || 0);
        //         taxAmount = (parseFloat(v.totalPrice) - parseFloat(v.discountedPrice));
        //         totalTax += taxAmount;
        //     }

        //     const grandTotal = (totalDiscountedPrice + totalTax).toFixed(2).toString();

        //     await cds.update(PurchaseEnquiry.drafts).set({
        //         totalAmount: totalDiscountedPrice.toFixed(2).toString(),
        //         taxAmount: totalTax.toFixed(2).toString(),
        //         grandtotal: grandTotal
        //     }).where({ purchaseEnquiryUuid: Vehicle[0].purchaseEnquiryUuid });
        //     }

        // }
    
    });

    

    this.on('commentsFun', async (req) => {
        debugger
        const data = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.peUuid });
        // var id = data[0].purchaseEnquiryId;
        // if (req.data.commentsText) {
        //     const values = {
        //         purchaseEnquiryUuid: req.data.peUuid,
        //         createdBy :userEmailId,
        //         commentsText: req.data.commentsText
        //     }
        //     await INSERT.into(EnquiryComments).entries(values);
        // }

        
        const newComment = {

            purchaseEnquiryUuid: req.data.peUuid,
            commentsText: req.data.commentsText,

        };
        if(data[0].status != 'Negotiation'){
            await INSERT.into(EnquiryComments).entries(newComment);
        }
        await UPDATE(PurchaseEnquiry).set({ commentsText: null }).where({ purchaseEnquiryUuid: req.data.peUuid });
        console.log('comments insert');
    });

    this.on('purchaseOrderFun', async (req) => {
        debugger
        if (req.data.PurchaseOrderUuid) {
            var status = await SELECT.from(PurchaseOrder).where({ purchaseOrderUuid: req.data.PurchaseOrderUuid });
            console.log("functionImport triggered");
            return status;
        }
    });


    const logoPath = path.join(__dirname, 'mahindra-logo.png');

    // Function to download image
    async function downloadImage(url) {
        debugger
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer',
        });
        return Buffer.from(response.data, 'binary');
    }

    // Main function to generate the PDF in memory
    async function generateInvoice1(paymentDetails) {
        return new Promise(async (resolve, reject) => {
            const doc = new PDFDocument({ margin: 30 });
            const buffers = [];

            // Collect data as buffer in memory
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            try {
                // Download logo and add it to the PDF
                const logoBuffer = await downloadImage('https://upload.wikimedia.org/wikipedia/commons/8/82/Mahindra_Auto.png');

                const headerY = 30; // Initial position of the logo
                const logoSize = 80; // Logo size
                const logoX = 50; // Position of the logo
                const headingX = logoX + logoSize + 60; // Adjust this value to move the heading further to the right
                const headingY = headerY + 50; // Y-position of the heading

                // Position the logo
                doc.image(logoBuffer, logoX, headerY, { width: logoSize, height: logoSize });

                // Position "Payment Details" below the logo and move it to the right
                doc.fontSize(18).fillColor('blue')
                    .text('Payment Details', headingX, headingY); // Move this to the right

                // Get current date and time
                const currentDate = new Date().toLocaleDateString(); // Format: MM/DD/YYYY
                const currentTime = new Date().toLocaleTimeString(); // Format: HH:MM:SS AM/PM

                // Position date and time to the right of the heading
                const dateX = headingX + 250; // Move the date further to the right from the heading
                const dateY = headingY; // Y-position for the date, same as heading

                const timeY = dateY + 20; // Y-position for the time, moved downwards

                // Print Date with reduced font size
                doc.fontSize(10).fillColor('black') // Set font size and color for the date
                    .text(`Date: ${currentDate}`, dateX, dateY); // Align to the right side of the heading

                // Print Time with reduced font size
                doc.fontSize(10).fillColor('black') // Set font size and color for the time
                    .text(`Time: ${currentTime}`, dateX, timeY); // Align to the right side of the date

                // Draw horizontal line below the heading
                const lineY = timeY + 30; // New Y-position for the line, below the time
                doc.moveTo(logoX, lineY) // Align with the left side of the logo
                    .lineTo(doc.page.width - 50, lineY) // Extend line to the right margin
                    .lineWidth(2)
                    .stroke();


                doc.moveDown(1);
                // Table setup with payment details
                const details = [
                    { label: 'Transaction ID:', value: paymentDetails.transactionId },
                    { label: 'Bank:', value: paymentDetails.bankName },
                    { label: 'Name:', value: paymentDetails.accHoldersName },
                    { label: 'Account Number:', value: paymentDetails.accNumber },
                    { label: 'Amount:', value: `₹${paymentDetails.amount}` },
                    { label: 'IFSC Code:', value: paymentDetails.ifscCode },
                    { label: 'Payment Method:', value: paymentDetails.paymentMethod },
                    { label: 'Status:', value: paymentDetails.status },
                    { label: 'Sales Order ID:', value: paymentDetails.salesOrderId }
                ];


                // Table layout properties
                const tableTop = doc.y + 20;
                const rowHeight = 25;
                const labelWidth = 150;
                const valueWidth = 250;
                const leftMargin = 50;

                // Render table rows
                details.forEach((item, index) => {
                    const currentY = tableTop + (index + 1) * rowHeight;
                    doc.strokeColor('black').rect(leftMargin, currentY, labelWidth, rowHeight).stroke();
                    doc.fillColor('black').fontSize(12).font('Helvetica').text(item.label, leftMargin + 10, currentY + 5);
                    doc.strokeColor('black').rect(leftMargin + labelWidth, currentY, valueWidth, rowHeight).stroke();
                    doc.fillColor('black').text(item.value, leftMargin + labelWidth + 10, currentY + 5);
                });

                // Footer with centered message
                doc.moveDown(3);
                const footerLineY = doc.y;
                doc.lineWidth(1).moveTo(50, footerLineY).lineTo(550, footerLineY).stroke();
                const footerText = 'Thanks You for Making Payment!';
                const footerWidth = doc.widthOfString(footerText);
                doc.fontSize(12).fillColor('black').text(footerText, (doc.page.width - footerWidth) / 2, footerLineY + 10);

                // Finalize and end document
                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    this.after('UPDATE', PurchaseOrder, async (req) => {
        debugger
        if (req.status == 'Paid') {
            const stockData = await SELECT.one.from(VehicleInventory).where({ vehicleCode: req.materialCode });
        
        var updatedQuantity = stockData.quantity - parseInt(req.quantity);
            const paymentDetails = {
                transactionId: req.transactionId,
                bankName: req.bankName,
                accHoldersName: req.accHoldersName,
                accNumber: req.accNumber,
                amount: req.amount,
                ifscCode: req.ifscCode,
                paymentMethod: req.paymentMethod,
                status: req.status,
                salesOrderId: req.salesOrderId,

            };
            const pdfBuffer = await generateInvoice1(paymentDetails);

            const currentDate = getCurrentDateString();
            req.paymentBill = pdfBuffer;
            req.paymentBillType = 'application/pdf';
            req.paymentBillFileName = `paymentBill_${currentDate}.pdf`;
            console.log("Generated PDF:", pdfBuffer);

            await cds.update(PurchaseOrder).set({
                paymentBillType: req.paymentBillType,
                paymentBill: req.pdfBuffer,
                paymentBillFileName: req.paymentBillFilename
            }).where({ purchaseOrderUuid: req.purchaseOrderUuid });

            await cds.update(VehicleInventory).set({
                quantity: updatedQuantity
            }).where({ vehicleCode: req.materialCode });


            var cust = await SELECT.from(Customer).where({ customerId: req.customerId });

            const oauthToken = await getOAuthToken();
            const token = `Bearer ${oauthToken}`;

            var workflowContent = {
                "definitionId": "us10.5e28e7ectrial.mahindrapayment.paymentProcess1",
                "context": {
                    "paymentid": generatePaymentId(),
                    "transactionid": req.transactionId,
                    "accountno": req.accNumber,
                    "amount": req.amount,
                    "paymentmethod": req.paymentMethod,
                    "status": "Paid",
                    "soid": req.salesOrderId,
                    "companyname": cust[0].companyName,
                    "contactperson": req.contactPerson,
                    "contactnumber": cust[0].phone,
                    "email": cust[0].email,
                    "van": cust[0].van,
                    "address": cust[0].address,
                    "uploadsetlink": `https://3c552736trial-dev-mahindra-sales-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/EnquiryFiles?$filter=purchaseOrderUuid eq ${req.purchaseOrderUuid}`,
                    "commentslink": `https://3c552736trial-dev-mahindra-sales-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/PurchaseComments?$filter=purchaseOrderUuid eq ${req.purchaseOrderUuid}`,
                    "top": 0,
                    "skip": 0,
                    "pouuid": req.purchaseOrderUuid
                }
            };
            // var BPA_Trigger = await cds.connect.to("BPA_Trigger");
            // var result = await BPA_Trigger.post('/workflow/rest/v1/SAPBuildProcessAutomationInstance', workflowContent);
            // console.log(result);
            debugger
            debugger
            try {
                const res = await axios.post(
                    "https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances",
                    workflowContent,
                    {
                        headers: {
                            "Accept-Language": "en",
                            "DataServiceVersion": "2.0",
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": token
                        }
                    }
                );
                console.log("Workflow started successfully:", res.data);
                //await cds.update(PurchaseOrder).set({status:st, soModifiedAt: new Date()}).where({ purchaseOrderUuid : data.purchaseOrderUuid});
            } catch (error) {
                // Log the detailed error response
                console.error("Error starting workflow:", error.response ? error.response.data : error.message);
            }
        }

    });

    this.before('CREATE', EnquiryFiles, async (req) => {
        debugger
        req.data.url = `EnquiryFiles(id=${req.data.id})/content`;
    });
    this.before('CREATE',PurchaseEnquiry,async (req) => { 
        debugger
        
});

    function getCurrentDateString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    this.on('disCheckFun', async (req) => {
        debugger
        //var x = isChecked;
    isPercentage = req.data.value;
    var vdata = await SELECT.one.from(EnquiryVehicle).where({ vehicleId: req.data.peUuid });
debugger
        const str = vdata.band;
        var  actualPrice = parseFloat(vdata.actualPrice).toFixed(2);
const match = str.match(/\((.*?)\)/); // Extract content within parentheses
const value = parseFloat(match ? match[1].replace('%', '') : null);
var banddiscount = actualPrice - (actualPrice * (value / 100));

    if(isPercentage === 'true'){
        const discountValue = parseFloat(req.data.discount) || 0;
        banddiscount = banddiscount - (banddiscount * (discountValue/100));
        
        var totalamount = (banddiscount +( banddiscount * (parseFloat(vdata.taxPercentage)) / 100)).toFixed(2).toString();

        await cds.update(EnquiryVehicle.drafts).set({
            totalPrice: totalamount,
            discountedPrice: banddiscount.toString(),
            discount: discountValue.toString()
        }).where({ vehicleId: req.data.peUuid });


    }
    else{
        const discountValue = parseFloat(req.data.discount) || 0;
        banddiscount = banddiscount - discountValue;
        
        var totalamount = (banddiscount +( banddiscount * (parseFloat(vdata.taxPercentage)) / 100)).toFixed(2).toString();

        await cds.update(EnquiryVehicle.drafts).set({
            totalPrice: totalamount,
            discountedPrice: banddiscount.toString(),
            discount: discountValue.toString()
        }).where({ vehicleId: req.data.peUuid });

    }
    const puuid = vdata.purchaseEnquiryUuid;
    const vehicles = await SELECT.from(EnquiryVehicle.drafts).where({ purchaseEnquiryUuid:puuid });

        let totalDiscountedPrice = 0;
        let totalTax = 0;
       // let taxamount = 0;
        for (const v of vehicles) {
            totalDiscountedPrice += parseFloat(v.discountedPrice || 0);
          var  taxamount = (parseFloat(v.totalPrice) - parseFloat(v.discountedPrice));
            totalTax += taxamount;
        }

       const grandtotal = (totalDiscountedPrice + totalTax).toFixed(2).toString();
debugger
        await cds.update(PurchaseEnquiry.drafts).set({
            totalAmount: totalDiscountedPrice.toFixed(2).toString(),
            taxAmount: totalTax.toFixed(2).toString(),
            grandTotal: grandtotal
        }).where({ purchaseEnquiryUuid: puuid });

    // vdata = await SELECT.from(EnquiryVehicle.drafts).where({ vehicleId: req.data.peUuid });
    // await cds.update(EnquiryVehicle.drafts).set({
    //     discount: '0'
    // }).where({ vehicleId: vdata[0].vehicleId });

    // if(req.data.peUuid && req.data.value == 'true'){
    //     vdata = await SELECT.from(EnquiryVehicle.drafts).where({ vehicleId: req.data.peUuid });
    //         const { vehicleId, discount } = vdata[0];

    //         if (discount) {
    //             var vdata = await SELECT.from(EnquiryVehicle).where({ vehicleId: vehicleId });

    //             if (discount < 0 || discount > 100 || /[a-zA-Z]/.test(discount)) {
    //                 return req.reject(400, 'Discount cannot be negative or Discount must be below 100 or No alphabetic characters are allowed in the discount ');
    //             } else if (parseFloat(req.data.discount) < parseFloat(vdata[0].discount)) {
    //                 return req.reject(400, `Discount should be grater than ${vdata[0].discount}`);
    //             }

    //             var Vehicle = await SELECT.from(EnquiryVehicle.drafts).where({ vehicleId: vehicleId });
    //             if (!Vehicle) {
    //                 return req.reject(404, 'PurchareVehicle Vehicle record not found');
    //             }
    //             const pricePerUnit = parseFloat(Vehicle[0].pricePerUnit);
    //             const quantity = parseInt(Vehicle[0].quantity);
    //             const discountValue = parseFloat(discount) || 0;
    //             var discountedPrice = pricePerUnit;
    //             discountedPrice = pricePerUnit - (pricePerUnit * discountValue / 100);

    //             discountedPrice *= quantity;
    //             Vehicle[0].totalAmount = (parseFloat(discountedPrice) + (parseFloat(discountedPrice) * (parseFloat(Vehicle[0].taxPercentage)) / 100)).toString();


    //             await cds.update(EnquiryVehicle.drafts).set({
    //                 totalPrice: Vehicle[0].totalAmount,
    //                 discountedPrice: discountedPrice.toFixed(2).toString(),
    //                 discount: discountValue.toString()
    //             }).where({ vehicleId: vehicleId });


    //             // req.data.totalPrice = Vehicle[0].totalAmount,
    //             //     req.data.discountedPrice = discountedPrice.toString(),
    //             //     req.data.discount = discountValue.toString()
    //         }
    //         const vehicles = await SELECT.from(EnquiryVehicle.drafts).where({ purchaseEnquiryUuid: Vehicle[0].purchaseEnquiryUuid });

    //         let totalDiscountedPrice = 0;
    //         let totalTax = 0;
    //         let taxAmount = 0;
    //         for (const v of vehicles) {
    //             totalDiscountedPrice += parseFloat(v.discountedPrice || 0);
    //             taxAmount = (parseFloat(v.totalPrice) - parseFloat(v.discountedPrice));
    //             totalTax += taxAmount;
    //         }

    //         const grandTotal = (totalDiscountedPrice + totalTax).toFixed(2).toString();

    //         await cds.update(PurchaseEnquiry.drafts).set({
    //             totalAmount: totalDiscountedPrice.toFixed(2).toString(),
    //             taxAmount: totalTax.toFixed(2).toString(),
    //             grandtotal: grandTotal
    //         }).where({ purchaseEnquiryUuid: Vehicle[0].purchaseEnquiryUuid });
    //         // isPercentage = 'false';
    //     }
    });

    this.on('payDetailsFun', async (req) => {
        debugger
        var peData = await SELECT.from(PurchaseOrder).where({ purchaseOrderUuid: req.data.PurchaseOrderUuid });
        var cust = await SELECT.from(Customer).where({ customerId: peData[0].customerId });

        const oauthToken = await getOAuthToken();
        const token = `Bearer ${oauthToken}`;

        var workflowContent = {
            "definitionId": "us10.5e28e7ectrial.mahindrapayment.salesTrigger",
            "context": {
                "transactionid": peData[0].transactionId,
                "accountno": peData[0].accNumber,
                "amount": peData[0].amount,
                "paymentmethod": peData[0].paymentMethod,
                "status": "Confrmed",
                "companyname": cust[0].companyName,
                "contactperson": peData[0].contactPerson,
                "contactnumber": cust[0].phone,
                "email": cust[0].email,
                "van": cust[0].van,
                "address": cust[0].address,
                "instanceid": "instanceid",
                "uploadsetlink": `https://3c552736trial-dev-mahindra-sales-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/EnquiryFiles?$filter=purchaseOrderUuid eq ${peData[0].purchaseOrderUuid}`,
                "commentslink": `https://3c552736trial-dev-mahindra-sales-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/PurchaseComments?$filter=purchaseOrderUuid eq ${peData[0].purchaseOrderUuid}`,
                "pouuid": peData[0].purchaseOrderUuid
            }
        };
        // var BPA_Trigger = await cds.connect.to("BPA_Trigger");
        // var result = await BPA_Trigger.post('/workflow/rest/v1/SAPBuildProcessAutomationInstance', workflowContent);
        // console.log(result);
        debugger
        try {
            const res = await axios.post(
                // "https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances",
                workflowContent,
                {
                    headers: {
                        "Accept-Language": "en",
                        "DataServiceVersion": "2.0",
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                }
            );
            console.log("Workflow started successfully:", res.data);
            const st = 'Sent For Relaese';
            //await cds.update(PurchaseOrder).set({status:st, soModifiedAt: new Date()}).where({ purchaseOrderUuid : data.purchaseOrderUuid});
        } catch (error) {
            // Log the detailed error response
            console.error("Error starting workflow:", error.response ? error.response.data : error.message);
        }
    });

    this.before('CREATE', EnquiryVehicle, async (req, next) => {
        debugger
        if (req.data.materialCode && req.data.quantity) {
            // var vdata = await SELECT.one.from(EnquiryVehicle).where({ materialCode: req.data.materialCode , purchaseEnquiryUuid : req.data.purchaseEnquiryUuid});
            var vehicle = await SELECT.one.from(VehicleInventory).where({ vehicleCode: req.data.materialCode });
            var vdata = await SELECT.one.from(EnquiryVehicle).where({ materialCode: req.data.materialCode, purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            if (!vdata) {
                if (req.data.quantity <= vehicle.quantity) {

                    req.data.vehicleName = vehicle.vehicleName;
                    req.data.vehicleColor = vehicle.vehicleColor;
                    req.data.pricePerUnit = vehicle.pricePerUnit.toFixed(2);
                    req.data.taxPercentage = (vehicle.taxPercentage).toFixed(2).toString();


                    req.data.actualPrice = (parseFloat(vehicle.pricePerUnit) * req.data.quantity).toFixed(2).toString();

                    // Calculate the actual price based on quantity and stock price
                    const quantity = req.data.quantity;
                    if (quantity >= vehicle.platinumMinQty) {
                        req.data.discount = (vehicle.platinumPer).toFixed(2).toString();
                        req.data.band = `Platinum(${req.data.discount}%)`;
                    } else if (quantity >= vehicle.goldMinQty) {
                        req.data.discount = (vehicle.goldPer).toFixed(2).toString();
                        req.data.band = `Gold(${req.data.discount}%)`;
                    } else if (quantity >= vehicle.silverMinQty) {
                        req.data.discount = (vehicle.silverPer).toFixed(2).toString();
                        req.data.band = `Silver(${req.data.discount}%)`;
                    } else {
                        req.data.discount = '0';
                        req.data.band = 'None(0%)';
                    }
                    const actualPrice = parseFloat(vehicle.pricePerUnit) * quantity;
                    const discount = parseFloat(req.data.discount);


                    if (req.data.discount === '0') {
                        req.data.discountedPrice = actualPrice.toFixed(2).toString();
                        req.data.totalPrice = (parseFloat(req.data.discountedPrice) + (parseFloat(req.data.discountedPrice) * (parseFloat(req.data.taxPercentage)) / 100)).toFixed(2).toString();
                    } else {
                        req.data.discountedPrice = (actualPrice - (actualPrice * discount / 100)).toFixed(2).toString();
                        req.data.totalPrice = (parseFloat(req.data.discountedPrice) + (parseFloat(req.data.discountedPrice) * (parseFloat(req.data.taxPercentage)) / 100)).toFixed(2).toString();
                    }
                    req.data.discount = '0';

                } else {
                    return req.reject(400, `Requested Quantity ${req.data.quantity}exceeds the existing quantity ${vehicle.quantity}`);
                }
            } else {
                return req.reject(400, `Vehicle already exsist ${req.data.materialCode}`);
            }
        } else {
            return req.reject(400, 'null entry');
        }


        console.log("end1234");
    });

    this.before('UPDATE', EnquiryVehicle, async (req, next) => {
        debugger
        if (req.data.quantity && req.data.discount && req.data.discountedPrice && req.data.totalPrice) {
        }
        else
        {
            var vdata = await SELECT.one.from(EnquiryVehicle).where({ vehicleId: req.data.vehicleId })
            var vehicle = await SELECT.one.from(VehicleInventory).where({ vehicleCode: vdata.materialCode });
            if (req.data.quantity <= vehicle.quantity) {

                req.data.actualPrice = (parseFloat(vehicle.pricePerUnit) * req.data.quantity).toFixed(2).toString();

                // Calculate the actual price based on quantity and stock price
                const quantity = req.data.quantity;
                if (quantity >= vehicle.platinumMinQty) {
                    req.data.discount = (vehicle.platinumPer).toFixed(2).toString();
                    req.data.band = `Platinum(${req.data.discount}%)`;
                } else if (quantity >= vehicle.goldMinQty) {
                    req.data.discount = (vehicle.goldPer).toFixed(2).toString();
                    req.data.band = `Gold(${req.data.discount}%)`;
                } else if (quantity >= vehicle.silverMinQty) {
                    req.data.discount = (vehicle.silverPer).toFixed(2).toString();
                    req.data.band = `Silver(${req.data.discount}%)`;
                } else {
                    req.data.discount = '0';
                    req.data.band = 'None(0%)';
                }
                const actualPrice = parseFloat(vehicle.pricePerUnit) * quantity;
                const discount = parseFloat(req.data.discount);


                if (req.data.discount === '0') {
                    req.data.discountedPrice = actualPrice.toFixed(2).toString();
                    req.data.totalPrice = (parseFloat(req.data.discountedPrice) + (parseFloat(req.data.discountedPrice) * (parseFloat(req.data.taxPercentage)) / 100)).toFixed(2).toString();
                } else {
                    req.data.discountedPrice = (actualPrice - (actualPrice * discount / 100)).toFixed(2).toString();
                    req.data.totalPrice = (parseFloat(req.data.discountedPrice) + (parseFloat(req.data.discountedPrice) * (parseFloat(req.data.taxPercentage)) / 100)).toFixed(2).toString();
                }
                req.data.discount = '0';
            } else {
                return req.reject(400, `Requested Quantity ${req.data.quantity}exceeds the existing quantity ${vehicle.quantity}`);
            }
        }
    });


    // *************************************************************************************************

    this.on('getUserRoles', (req) => {
        debugger
        console.log('hiiiiiiiiiiiii');
        let auth = req?.headers?.authorization;

        if (auth != undefined) {
            let token = auth.split(" ");
            var decoded = jwtDecode(token[1]);
            //console.log('jwt token', decoded);
            return decoded;
        }
        console.log('Endddddddddddddddddd');
    });


    this.on('UPDATE', PurchaseVehicle.drafts, async (req, next) => {
        debugger
        if (req.data.deliveryDate) {
            const vehicle = await SELECT.one.from(PurchaseVehicle).where({ vehicleID: req.data.vehicleID });
            const purchase = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: vehicle.purchaseOrderUuid });

            const deliveryDate = new Date(req.data.deliveryDate); // Convert to Date object
            const createdAt = new Date(purchase.createdAt);

            const diffMilliseconds = deliveryDate - createdAt; // Difference in milliseconds
            const daysDifference = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days
            const days = `${daysDifference} days`

            await cds.update(PurchaseVehicle.drafts).set({ deliveryLeadTime: days, deliveryDate: req.data.deliveryDate }).where({ vehicleID: req.data.vehicleID });

            console.log(daysDifference);
            debugger
        }
    });

    async function AddNotification(purchaseID, customerID, Text) {
        const payload = {
            purchaseEnquiryUuid: purchaseID,
            customerId: customerID,
            commentsText: Text
        }
        const result = await INSERT.into(EnquiryComments).entries(payload);
    }

    this.on('PatchEntity', async (req) => {
        if (req.data.purchaseOrderUuid && req.data.status) {
            await cds.update(PurchaseOrder).set({ status: req.data.status, soModifiedAt: new Date() }).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });

            const po = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            if (req.data.status = 'Waiting For Payment Confirmation') {
                const commentText = `${po.purchaseOrderId} - Sales Order Released!`;
                await AddNotification(po.purchaseOrderUuid, po.customerId, commentText);

                const commentText1 = `${po.purchaseOrderId} - Payment Details Released!`
                await AddNotification(po.purchaseOrderUuid, po.customerId, commentText1)
            }

            return 'success';
        }
        return 'Failed';
    });

    function generateInvoice1(invoice) {
        return new Promise(async (resolve, reject) => {
            let doc = new PDFDocument({ margin: 50 });

            // Create a buffer stream to store the PDF in memory
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers); // Combine buffer parts into one
                resolve(pdfData); // Resolve the Promise with the PDF data
            });

            const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/8/82/Mahindra_Auto.png';
            const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
            const logoBuffer = Buffer.from(response.data);

            // Add the logo on the right and "INVOICE" text on the left
            doc.image(logoBuffer, 400, 45, { width: 150 })
                .fontSize(20)
                .text("INVOICE", 50, 50)
                .moveDown();

            // Invoice header
            doc.fontSize(10)
                .text(`Invoice Number: ${invoice.invoiceNumber}`, 50, 120)
                .text(`Date: ${invoice.date}`, 50, 135)
                .text(`Due Date: ${invoice.dueDate}`, 50, 150)
                .moveDown();

            // Customer details
            doc.fontSize(10)
                .text(`Bill To:`, 50, 180)
                .text(`${invoice.customerName}`, 50, 195)
                .text(`${invoice.customerAddress}`, 50, 210)
                .moveDown(2);

            // Draw a horizontal line to separate header from item details
            doc.moveTo(50, 250)
                .lineTo(550, 250)
                .stroke();

            // Invoice table header with borders and centered text
            let tableTop = 260;
            drawTableRow(doc, tableTop, "Description", "Unit Price", "Quantity", "Discount", "Tax", "Total", true);

            // Add a table for the invoice items with borders and centered text
            let itemIndex = 0;
            let totalAmount = 0;
            invoice.items.forEach(item => {
                const description = item.vehicleName + ', ' + item.vehicleColor;
                const y = tableTop + 25 + (itemIndex * 25);
                drawTableRow(doc, y, description, item.pricePerUnit, item.quantity, item.discount, item.tax, item.totalPrice, false);
                totalAmount += item.totalPrice;
                itemIndex++;
            });

            // Add total amount at the bottom
            const totalY = tableTop + (itemIndex * 25) + 50;
            doc.fontSize(12)
                .text(`Grand Total: ${invoice.grandTotal}`, 400, totalY, { align: 'right' });

            // Draw a horizontal line above the total
            doc.moveTo(50, totalY - 10)
                .lineTo(550, totalY - 10)
                .stroke();

            // Footer
            doc.moveDown(2);
            doc.fontSize(10)
                .text("Thank you for your business!", 50, totalY + 50, { align: 'center' })
                .text("Please make payment by the due date.", 50, totalY + 65, { align: 'center' });

            // Finalize and store the PDF
            doc.end();
        });
    }

    // Helper function to draw a table row with borders and centered text
    function drawTableRow(doc, y, description, unitPrice, quantity, discount, tax, total, isHeader) {
        const rowHeight = 25;
        const textPadding = 5;

        // Define column widths
        const descWidth = 150;
        const priceWidth = 75;
        const quantityWidth = 75;
        const discountWidth = 75;
        const taxWidth = 75;
        const totalWidth = 75;

        // Draw borders for the row
        doc.rect(50, y, descWidth, rowHeight).stroke(); // Description column
        doc.rect(50 + descWidth, y, priceWidth, rowHeight).stroke(); // Unit Price column
        doc.rect(50 + descWidth + priceWidth, y, quantityWidth, rowHeight).stroke(); // Quantity column
        doc.rect(50 + descWidth + priceWidth + quantityWidth, y, discountWidth, rowHeight).stroke(); // Discount column
        doc.rect(50 + descWidth + priceWidth + quantityWidth + discountWidth, y, taxWidth, rowHeight).stroke(); // Tax column
        doc.rect(50 + descWidth + priceWidth + quantityWidth + discountWidth + taxWidth, y, totalWidth, rowHeight).stroke(); // Total column

        // Set bold font for header
        if (isHeader) {
            doc.font('Helvetica-Bold');
        } else {
            doc.font('Helvetica');
        }

        // Center align the text inside the columns
        doc.fontSize(10)
            .text(description, 50, y + textPadding, { width: descWidth, align: 'center' })
            .text(`${unitPrice}`, 50 + descWidth, y + textPadding, { width: priceWidth, align: 'center' })
            .text(quantity, 50 + descWidth + priceWidth, y + textPadding, { width: quantityWidth, align: 'center' })
            .text(`${discount}%`, 50 + descWidth + priceWidth + quantityWidth, y + textPadding, { width: discountWidth, align: 'center' })
            .text(`${tax}%`, 50 + descWidth + priceWidth + quantityWidth + discountWidth, y + textPadding, { width: taxWidth, align: 'center' })
            .text(`${total}`, 50 + descWidth + priceWidth + quantityWidth + discountWidth + taxWidth, y + textPadding, { width: totalWidth, align: 'center' });
    }


    this.on('generateInvoice', async (req) => {
        debugger

        const pUUID = req.data.purchaseOrderUuid;

        var purchase = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: pUUID });
        var vehicle = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: pUUID });
        var customer = await SELECT.one.from(Customer).where({ customerID: purchase.customerId });


        const invoiceNumber = 'IN' + Math.floor(10000 + Math.random() * 90000).toString();
        //Sample invoice data
        const invoice1 = {
            invoiceNumber: invoiceNumber,
            date: new Date().toLocaleDateString('en-CA'),
            dueDate: purchase.dueDate,
            customerName: customer.name,
            customerAddress: customer.address,
            items: vehicle,
            grandTotal: purchase.grandTotal
        };

        const pdfData = await generateInvoice1(invoice1);

        const file = {
            content: pdfData,
            mediaType: 'application/pdf'
        }

        await cds.update(PurchaseOrder).set({ invoice: pdfData, mediaType: 'application/pdf' }).where({ purchaseOrderUuid: pUUID });

        return 'Successfully Generated';

    });

    this.on('generateSO', async (req) => {
        debugger
        const purchaseUUID = req.data.data;
        const purchaseOrder = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: purchaseUUID });
        const customer = await SELECT.one.from(Customer).where({ customerId: purchaseOrder.customerId });
        const customerid = purchaseOrder.customerId
        if (customer.customerCode === null) {
            //post call
            const payload1 = {
                "Name": "Manu Honnavara",
                "City": "Honnavar",
                "PostalCode": "560085",
                "Street": "HRBR",
                "Country": "IND",
                "Language": "E",
                "Currency": "INR",
                "SalesData": {
                    "SalesOrg": "M&M",
                    "DistChan": "10",
                    "Division": "01",
                    "RefCustomer": "0000009505"
                }
            }

            await postcustomercode(payload1, customerid).catch(err => {
                console.error('Error:', err.message);
            });

            async function postcustomercode(payload, customerID) {
                try {
                    debugger;
                    const destinationName = 'abap-dest';
                    const destination = await getDestination({ destinationName });

                    if (!destination || !destination.url) {
                        throw new Error('Destination URL not found or destination not configured correctly.');
                    }

                    console.log(destination.url);
                    const odataUrl = `${destination.url}/sap/ZOD_CUSTOMER_014_SRV/CustomerSet`;
                    console.log(odataUrl);
                    debugger;

                    const response = await executeHttpRequest(destination, {
                        method: 'POST',
                        url: odataUrl,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        data: payload,

                    });
                    debugger;
                    console.log('Customer Code:', response);
                    console.log('Customer Code:', response.data.d.CustomerNumber);
                    console.log('Customer Code:', response.data);
                    console.log('Customer Code:', response.data.CustomerNumber);

                    const customercode = response.data.d.sales_document;


                    await cds.update(Customer).set({
                        customerCode: customercode
                    }).where({ customerId: customerID });
                } catch (error) {
                    console.error('Error:', error.message || error.response?.data);
                    throw error;
                }
            }

            const payload = {
                "doc_type": "TA",
                "sales_org": "1000",
                "distr_chan": "12",
                "division": "00",
                "itemsSet": [
                    {
                        "item_number": "000015",
                        "material": "M-09",
                        "target_qty": "0.000 ",
                        "partn_role": "AG",
                        "partn_number": "0000002140"
                    }
                ]
            };
            await postSalesOrderData(payload).catch(err => {
                console.error('Error:', err.message);
            });

            async function postSalesOrderData(payload) {
                try {
                    debugger;
                    const destinationName = 'abap-dest';
                    const destination = await getDestination({ destinationName });

                    if (!destination || !destination.url) {
                        throw new Error('Destination URL not found or destination not configured correctly.');
                    }
                    console.log(destination.url);
                    const odataUrl = `${destination.url}/sap/Z_SALESORDER_16_SRV/salesOrderSet`;
                    debugger;
                    console.log(odataUrl);
                    const response = await executeHttpRequest(destination, {
                        method: 'POST',
                        url: odataUrl,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        data: payload,

                    });
                    debugger;

                    console.log('Sales Order Response:', response.data.d.sales_document);



                    const soID = response.data.d.sales_document;


                    await cds.update(PurchaseOrder.drafts).set({
                        salesOrderId: soID,
                        status: 'SO Not Released',
                        soModifiedAt: new Date()
                    }).where({ purchaseOrderUuid: purchaseUUID });

                    const commentText = `${purchaseOrder.purchaseOrderId} - Sales Order Generated!`;
                    await AddNotification(purchaseOrder.purchaseOrderUuid, purchaseOrder.customerId, commentText);

                } catch (error) {
                    console.error('Error:', error.message || error.response?.data);
                    throw error;
                }
            }
        }
    });


    this.on('sendForRelease', async (req) => {
        debugger
        const jsonString = req.data.data;  // This is the stringified JSON object
        const data = JSON.parse(jsonString);  // Parse it back into an object

        const po = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: data.purchaseOrderUuid });
        const createdAt = po?.createdAt;
        const vehicle = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: data.purchaseOrderUuid });
        const customer = data.purchaseToCustomer;

        // const custID = customer.customerId;
        // console.log(custID);

        // const imageUrl = "https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png";
        // const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        // const imageData = Buffer.from(response.data, "binary");

        // await cds.update(Customer).set({profilePic:imageData, profilePicType: 'image/png'}).where({ customerId : customer.customerId});

        const vehicleDetails = JSON.stringify(vehicle);

        const baseUrl = '3c552736trial-dev-mahindra-sales-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/'
        const url = baseUrl + `PurchaseOrder(purchaseOrderUuid=${data.purchaseOrderUuid},IsActiveEntity=true)/purchaseToComments`;

        const profileLink = baseUrl + `Customer(customerId=${customer.customerId})/profilePic`
        const workflowData =
        {
            "definitionId": "us10.5b8242e5trial.soreleaseform.sOProcess",
            "context": {
                "customerid": customer.customerId,
                "_name": customer.name,
                "customerAddress": customer.address,
                "link": vehicleDetails,
                "companyname": customer.companyName,
                "contactperson": data.contactPerson,
                "contactnumber": customer.phone,
                "email": customer.email,
                "van": customer.van,
                "deliveryAddress": data.deliveryLocation,
                "soid": data.salesOrderId,
                "poid": data.purchaseOrderUuid,
                "bankname": data.bankName,
                "accnumber": data.accNumber,
                "ifsccode": data.ifscCode,
                "branch": data.branch,
                "accholdersname": data.accHoldersName,
                "duedate": data.dueDate,
                "commentlink": url,
                "quotationid": data.quotationID,
                "sostatus": data.status,
                "customerid1": data.purchaseOrderUuid,
                "totalprice": data.totalPrice,
                "taxamount": data.taxAmount,
                "grandtotal": data.grandTotal,
                "poReleaseDate": createdAt,
                "profileiconlink": profileLink
            }
        }

        var BPA_Trigger = await cds.connect.to("BPA_Trigger");
        var result = await BPA_Trigger.post('/workflow/rest/v1/SAPBuildProcessAutomationInstance', workflowData);
        console.log(result);
        debugger
        const st = 'Sent For Release';
        await cds.update(PurchaseOrder).set({ status: st, soModifiedAt: new Date() }).where({ purchaseOrderUuid: data.purchaseOrderUuid });
        console.log(result);
        return 'Sales Order Sent For Release';
    });


    this.on('getSH', async (req) => {
        debugger

        try {
            // Step 1: Connect to the destination and fetch data
            var BpaDest = await cds.connect.to("ABAP_Destinations");
            const link = '/sap/Z_SALESORDER_16_SRV/SalesDetailsSet';
            var result = await BpaDest.get(link);

            if (result && Array.isArray(result)) {
                console.log("Result received:", result);

                // Step 2: Delete all existing data in the `SH` entity
                const deletedCount = await DELETE.from(SH);
                console.log(`Deleted ${deletedCount} records from SH entity.`);

                // Step 3: Use a for loop to insert up to 120 records one by one
                let insertedCount = 0; // Track number of successfully inserted records
                for (let i = 0; i < Math.min(result.length, 100); i++) {
                    const record = result[i];

                    // Prepare entry to insert
                    let entry = {
                        sHField: record.Name, // Map 'Name' field to 'sHField'
                        sHId: record.Value,   // Map 'Value' field to 'sHId'
                        sHDescription: record.Description // Map 'Description' field to 'sHDescription'
                    };

                    try {
                        // Insert the record into SH one by one
                        await INSERT.into(SH).entries(entry);
                        insertedCount++; // Increment inserted count if successful
                    } catch (insertError) {
                        console.error(`Failed to insert record ${i + 1}:`, insertError);
                    }
                }

                console.log(`${insertedCount} records inserted into SH entity.`);
                return {
                    deletedRecords: deletedCount,
                    insertedRecords: insertedCount,
                    message: `Deleted ${deletedCount} records and inserted ${insertedCount} records into SH entity.`
                };
            } else {
                console.log("No result received or result is not an array, skipping processing.");
                return {
                    message: "No result received or result is not an array, skipping processing."
                };
            }
        } catch (error) {
            console.error("Error occurred:", error);
            return {
                error: error.message || error
            };
        }

    });



}

async function getOAuthTokenCR() {
    const tokenResponse = await axios.post('https://f2dbf934trial.authentication.us10.hana.ondemand.com/oauth/token', {
        grant_type: 'client_credentials',
        client_id: 'sb-53a188fe-cc0f-4604-9aab-170566cdee26!b344871|xsuaa!b49390',
        client_secret: '8f7b05fd-76e1-45df-8443-ca026f5ed17a$r1-bVHUSiixfXpuQhLVzO0FEvGCpwN5MfWKLsXv9ISg='
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return tokenResponse.data.access_token;
}

async function getOAuthToken2() {
    const tokenResponse = await axios.post('https://e5a4d54etrial.authentication.us10.hana.ondemand.com/oauth/token', {
        grant_type: 'client_credentials',
        client_id: "sb-0a9663a6-4713-47c2-9094-6b7cae76a906!b344886|xsuaa!b49390",
        client_secret: "6e109fca-c7bb-4620-9a9f-20716b298593$dP6BATN7z-Gbk2-9llvSVoIQn3EPZudPsb67XaPXPoE="
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return tokenResponse.data.access_token;
}

async function getOAuthToken() {
    const tokenResponse = await axios.post('https://5e28e7ectrial.authentication.us10.hana.ondemand.com/oauth/token', {
        grant_type: 'client_credentials',
        client_id: 'sb-e8e83b35-f855-41a8-a1a0-cb45f6e7fa1b!b344905|xsuaa!b49390',
        client_secret: '4ab598df-a11b-4f22-9d87-113e49e77bdf$9N5tLbchLYSrJ0Lmg-XBCfD8hoIeZDPZhisjALaIBm8='
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return tokenResponse.data.access_token;
}

