sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (MessageToast, Dialog, Button, JSONModel, Text, MessageBox) {
    'use strict';

    return {
        SendQuotation: async function (oEvent) {
            debugger;
            const oView = this._view;
            const oPage = oView.getContent()[0];
            const oFooter = oPage.getAggregation("footer");
             var oCommentssec = this._view.byId("sales::PurchaseEnquiryObjectPage--fe::CustomSubSection::Comments--_IDGenTextArea");
            //  .mBindingInfos.value.binding;


            // Confirmation Dialog
            var oDialog = new Dialog({
                title: "Confirmation",
                type: "Message",
                content: new sap.m.Label({ 
                    text: "Do you want to send Quoataion?\nBefore sending, Please Confirm" 
                }),
                beginButton: new Button({
                    text: "Confirm",
                    press: async function () {
                      


                        oDialog.close(); // Close the confirmation dialog before proceeding
                        
                        var errormess = "";
                        // Retrieve comment text from TextArea
                        const oTextArea = oView.getContent()[0].mAggregations.sections[5]
                            .mForwardedAggregations.subSections[0]
                            .mAggregations._grid.mAggregations.content[0]
                            .mAggregations.content.mAggregations.items[1];
                        
                        const commentText = oTextArea.getValue();
                        const specialCharPattern = /^[^a-zA-Z0-9]+$/;
                        
                        if (!commentText) {
                            errormess = "Comment is empty. Please enter a Comment.";
                        }
                        if (specialCharPattern.test(commentText)) {
                            errormess = "Only special characters are not allowed in the comment.";
                        }

                        if (errormess) {
                            // Error Dialog
                            var oErrorDialog = new Dialog({
                                title: "Error",
                                type: "Message",
                                state: "Error",
                                content: new sap.m.Label({ text: errormess }),
                                beginButton: new Button({
                                    text: "OK",
                                    press: function () {
                                        oErrorDialog.close();
                                    }
                                }),
                                afterClose: function () {
                                    oErrorDialog.destroy();
                                }
                            });
                            oErrorDialog.open();
                        } else {
                            
                            // Execute OData Function for Quotation
                            const currentUrl = window.location.href;
                            const regex = /purchaseEnquiryUuid=([a-f0-9\-]+)/;
                            const match = currentUrl.match(regex);
                            let pid;

                            if (match && match[1]) {
                                pid = match[1];
                            } else {
                                console.log("UUID not found");
                                MessageToast.show("Purchase Enquiry UUID not found.");
                                return;
                            }

                            // Execute OData Function for Comments
                            let funcname1 = 'commentsFun';
                            let oFunction1 = oEvent.getModel().bindContext(`/${funcname1}(...)`);
                            oFunction1.setParameter('commentsText', commentText).setParameter('peUuid', pid);
                            await oFunction1.execute();
                            debugger
                            let funcname = 'quotationFun';
                            let oFunction = oEvent.getModel().bindContext(`/${funcname}(...)`);
                            oFunction.setParameter('peUuid', pid);
                            await oFunction.execute();

                            const oContext = oFunction.getBoundContext();
                            const result = oContext.getValue();
                            
                            MessageToast.show("Quotation  Sent Successfully!");

                            setTimeout(function() {
                                debugger
                                oCommentssec.setValue(""); 
                                debugger // Pass 'true' to refresh from the backend
                            }.bind(this), 800);

                            const buttons = oView.findAggregatedObjects(true, function (control) {
                                return control.isA("sap.m.Button") && 
                                    (control.getId().includes("Edit") || control.getId().includes("send"));
                            });
                            buttons[0].setVisible(false);
                            buttons[1].setVisible(false);
                            oFooter.setVisible(false);
                        }
                    }
                }),
                endButton: new Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                    }
                })
            });

            // Open confirmation dialog
            oDialog.open();
         }
    };
});

// sap.ui.define([
//     "sap/m/MessageToast",
//     'sap/m/Dialog',
//     'sap/m/Button',
//     'sap/m/Text'
// ], function (MessageToast, Dialog, Button, Text) {
//     'use strict';

//     return {
//         sendQuotation: function (oEvent) {
//             const oView = this._view;
//             const oPage = oView.getContent()[0];
//             const oFooter = oPage.getAggregation("footer");

//             // Confirmation Dialog
//             var oDialog = new Dialog({
//                 title: "Confirmation",
//                 type: "Message",
//                 content: new Text({ 
//                     text: "Do you want to send Quoataion?\nBefore sending, Please Confirm" 
//                 }),
//                 beginButton: new Button({
//                     text: "Confirm",
//                     press: async function () {
//                         oDialog.close(); // Close the confirmation dialog before proceeding
                        
//                         var errormess = "";
//                         // Retrieve comment text from TextArea
//                         const oTextArea = oView.getContent()[0].mAggregations.sections[5]
//                             .mForwardedAggregations.subSections[0]
//                             .mAggregations._grid.mAggregations.content[0]
//                             .mAggregations.content.mAggregations.items[1];
                        
//                         const commentText = oTextArea.getValue();
//                         const specialCharPattern = /^[^a-zA-Z0-9]+$/;
                        
//                         if (!commentText) {
//                             errormess = "Comment is empty. Please enter a Comment.";
//                         }
//                         if (specialCharPattern.test(commentText)) {
//                             errormess = "Only special characters are not allowed in the comment.";
//                         }

//                         if (errormess) {
//                             // Error Dialog
//                             var oErrorDialog = new Dialog({
//                                 title: "Error",
//                                 type: "Message",
//                                 state: "Error",
//                                 content: new sap.m.Label({ text: errormess }),
//                                 beginButton: new Button({
//                                     text: "OK",
//                                     press: function () {
//                                         oErrorDialog.close();
//                                     }
//                                 }),
//                                 afterClose: function () {
//                                     oErrorDialog.destroy();
//                                 }
//                             });
//                             oErrorDialog.open();
//                         } else {
//                             const currentUrl = window.location.href;
//                             const regex = /purchaseEnquiryUuid=([a-f0-9\-]+)/;
//                             const match = currentUrl.match(regex);
//                             let pid;

//                             if (match && match[1]) {
//                                 pid = match[1];
//                             } else {
//                                 console.log("UUID not found");
//                                 MessageToast.show("Purchase Enquiry UUID not found.");
//                                 return;
//                             }

//                             // Execute OData Function for Comments
//                             let funcname1 = 'commentsFun';
//                             let oFunction1 = oEvent.getModel().bindContext(`/${funcname1}(...)`);
//                             oFunction1.setParameter('commentsText', commentText).setParameter('para', pid);
//                             await oFunction1.execute();

//                             // Execute OData Function for Quotation
//                             let funcname = 'quotationFun';
//                             let oFunction = oEvent.getModel().bindContext(`/${funcname}(...)`);
//                             oFunction.setParameter('para', pid);
//                             await oFunction.execute();

//                             const oContext = oFunction.getBoundContext();
//                             const result = oContext.getValue();

//                             MessageToast.show("Quotation  Sent Successfully!");
//                             const buttons = oView.findAggregatedObjects(true, function (control) {
//                                 return control.isA("sap.m.Button") && 
//                                     (control.getId().includes("Edit") || control.getId().includes("send-quotation"));
//                             });
//                             buttons[0].setVisible(false);
//                             buttons[1].setVisible(false);
//                             oFooter.setVisible(false);
//                         }
//                     }
//                 }),
//                 endButton: new Button({
//                     text: "Cancel",
//                     press: function () {
//                         oDialog.close();
//                     }
//                 })
//             });

//             // Open confirmation dialog
//             oDialog.open();
//         }
//     };
// });

