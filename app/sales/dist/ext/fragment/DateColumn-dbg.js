sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onPress: function(oEvent) {
            debugger
            var oTable = this._view.byId("sales::PurchaseOrderObjectPage--fe::table::purchaseToVehicle::LineItem::DeliveryDetails")._oTable;
            var oBinding = oTable.getBinding("rows");
            if (oBinding) {
                setTimeout(function() {
                    oBinding.refresh();  // Pass 'true' to refresh from the backend
                }.bind(this), 800);
            }
        }
    };
});
