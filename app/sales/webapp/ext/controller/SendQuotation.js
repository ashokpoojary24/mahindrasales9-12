sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        SendQuotation: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        }
    };
});
