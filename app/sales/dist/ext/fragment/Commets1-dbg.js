// sap.ui.define([
//     "sap/m/MessageToast"
// ], function(MessageToast) {
//     'use strict';

//     return {
//         onPress: function(oEvent) {
//             MessageToast.show("Custom handler invoked.");
//         }
//     };
// });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return {

       
        onBrowseHistoryPress: async function() {
            debugger
            // Get the dialog
            var oDialog = this.byId("commentHistoryDialog1");

            // Ensure the dialog is created
            if (!oDialog) {
                oDialog = sap.ui.xmlfragment(this.getView().getId(), "sales.ext.fragment.Commets1", this);
                this.getView().addDependent(oDialog);
            }
            var sServiceUrl = this.getModel().sServiceUrl;
            try {
                const aData = await new Promise((resolve, reject) => {
                    jQuery.ajax({
                        url: sServiceUrl + "PurchaseComments",
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

                const currentUrl = window.location.href;
                const regex = /purchaseOrderUuid=([a-f0-9\-]+)/;
                const match = currentUrl.match(regex);
                var poid;
                if (match && match[1]) {
                    poid = match[1];
                } else {
                    console.log("UUID not found");
                }

                const aData1 = aData.value;
                const filteredData = aData1.filter(item => !item.customerId && item.purchaseOrderUuid === poid);

                // var oCommentModel = new JSONModel();
                // oCommentModel.setData({ Files: filteredData });
                // oDialog.setModel(oCommentModel, "myModel");
                oDialog.open();
            } catch (error) {
                console.error("Error fetching comment data:", error);
                MessageToast.show("Failed to load comment history: " + error);
            }
        },

        onCloseHistoryDialog: function() {
            // Get the dialog
            var oDialog = this.byId("_IDGenDialog");
            
            // Close the dialog
            if (oDialog) {
                oDialog.close();
            }
        },


        onDialogOpen: function() {
            // Optionally handle logic when the dialog opens
            console.log("Comment History Dialog opened");
        }

    }
});
