sap.ui.define([
    "sap/m/MessageToast",
     "sap/m/MessageBox"
], function(MessageToast,MessageBox) {
    'use strict'
    var value;
    return {
        onPress: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        onLiveChange : function(oEvent) {



        },
        OnCheck: async function (oEvent) {
            debugger
            const bIsChecked = oEvent.getSource().getSelected();
            const oModel = this._view.getModel();
            const oBindingContext = oEvent.getSource().getBindingContext(); 
            const vehicleId = oBindingContext.getProperty("vehicleId");
            const discount = oBindingContext.getProperty("discount");
            // const input = oEvent.oSource.getParent().mAggregations.items[1];
            var value;
            if(bIsChecked) {
                // input.setValue(`${value}`);
                value = 'true';
                // MessageBox.warning("Please reenter the discount as a percentage to calculate the updated price summary.");
            } else {
                // value = value.slice(0, -1);
                // input.setValue(`${value}`);
                value = 'false';
                // MessageBox.warning("Please reenter the discount amount to calculate the updated discount and price summary.");
            }
            
            let funcname1 = 'disCheckFun';
            let oFunction1 = this._view.getModel().bindContext(`/${funcname1}(...)`);
            oFunction1.setParameter('value', value ).setParameter('peUuid',vehicleId).setParameter('discount',discount);
            await oFunction1.execute();
            oEvent.oSource.getParent().getParent().getBindingContext().refresh();
            oEvent.getSource().getParent().getParent().getTable().getParent().getParent().getParent().getParent().getParent().mAggregations._grid.mAggregations.content[2].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].getBindingContext().refresh()
            // var refre = sap.ui.getCore().byId("sales::PurchaseEnquiryObjectPage--fe::table::enquiryToVehicle::LineItem::VehicleDetails1-innerTable");
            // var refre1 = refre.getModel().refresh;
            // var oTable = this._view.byId("sales::PurchaseEnquiryObjectPage--fe::table::enquiryToVehicle::LineItem::VehicleDetails1")._oTable;
            // var oBinding = oTable.getBinding("rows");
            // if (oBinding) {
            //     setTimeout(function() {
            //         oBinding.refresh();  // Pass 'true' to refresh from the backend
            //     }.bind(this), 800);
            // }
            debugger
        },
    };
});
