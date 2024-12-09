sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        REalseSO:  async function(oEvent) {
            debugger

            //const key = `soID='SO1',IsActiveEntity=true`;
            
            // this.getOwnerComponent().getRouter()
			// 	.navTo("SalesOrderObjectPage",
			// 		{SalesOrderKey:key}
			// 		);

            const buttons = this._view.findAggregatedObjects(true, function (control) {
                return control.isA("sap.m.Button") && (control.getId().includes("release-so") || control.getId().includes("Edit"));
            });
					

            const oView = this._view;
			const oPage = oView.getContent()[0];
            const oFooter = oPage.getAggregation("footer");

            let oContext = oEvent.oBinding.oElementContext;  
            let oBindingData = oContext.getObject();  

            const baseUrl = oEvent.oModel.sServiceUrl;
            const cUrl = baseUrl + oEvent.sPath.slice(1) + '/purchaseToComments';
            const commentData = {
			    "commentsText": oBindingData.comment,
				"IsActiveEntity": true
			};
            const vUrl = baseUrl + oEvent.sPath.slice(1) + '/purchaseToVehicle';
            const vehicles = await fetchData(vUrl);
            let paymentDetails = true;
            let vDetails = true;
            let text = [];
            var text1='', text2='';
            var text3 = true;

            if (!oBindingData.bankName) paymentDetails = false;
            if (!oBindingData.accNumber) paymentDetails = false;
            if (!oBindingData.ifscCode) paymentDetails = false;
            if (!oBindingData.branch) paymentDetails = false;
            if (!oBindingData.accHoldersName) paymentDetails = false;
            if (!oBindingData.dueDate) paymentDetails = false;
            if(!oBindingData.dealerCode) paymentDetails = false;
            if (!oBindingData.comment) { text3 = false; text.push('Comment is missing'); }

            if(!paymentDetails) text.push('Some payment details are missing.');
            
                vehicles.value.forEach(vehicle => {
                  if (!vehicle.deliveryLeadTime || !vehicle.deliveryDate || !vehicle.shippingMethod || !vehicle.shippingCharges) {
                    vDetails = false;
                  } 
                });

            if(!vDetails) text.push('Some vehicles are missing delivery details.');
            const errorMessage = text.join('\n');

                if (!vDetails || !paymentDetails || !text3) {
                    var oErrorDialog = new Dialog({
                        title: "Error",
                        type: "Message",
                        content: new Text({ text: `${errorMessage}\nPlease complete all required fields.` }),
                        beginButton: new Button({
                            text: "OK",
                            press: function () {
                                oErrorDialog.close();
                            }
                        })
                    });
                    oErrorDialog.open();
                    return; // Exit the function if fields are missing
                }
            
            var oDialog = new Dialog({
                title: "Confirmation",
                type: "Message",
                content: new Text({ text: "Do you want to send sales order for release?\nBefore sending please check all the details once again." }),
                beginButton: new Button({
                    text: "Confirm",
                    press: async function () { 
                        onPress();
                        oDialog.close();
                    } 
                }),
                endButton: new Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                    }
                })
            });
            //MessageToast.show("Custom handler invoked.");

            async function onPress() {
                debugger
                const aData =JSON.stringify(oBindingData);

                const sUrl = baseUrl + `sendForRelease(data='${encodeURIComponent(aData)}')`;

                const response = await fetchData(sUrl);
                console.log(response);

                if(response.value) {
                    MessageToast.show('Sent for release!');
                    if(oBindingData.comment) {
                        const response1 = await postData(cUrl, commentData);
                    }
                    buttons[0].setVisible(false);
                    buttons[1].setVisible(false);
                    oFooter.setVisible(false);
                }

            }

            async function fetchData (url) {
                debugger
                return new Promise((resolve, reject) => {
                    jQuery.ajax({
                        url: url,
                        method: "GET",
                        dataType: "json",
                        success: function (data) {
                            resolve(data);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            reject(new Error(textStatus + ': ' + errorThrown));
                        }
                    });
                });
            }

            async function postData (url, data) {
                debugger
                return new Promise((resolve, reject) => {
                    jQuery.ajax({
                        url: url,
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        success: function (response) {
                            debugger
                            resolve(response);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            reject(new Error(`${textStatus}: ${errorThrown}`));
                        }
                    });
                });
            }

            oDialog.open();

        }
    };
});
