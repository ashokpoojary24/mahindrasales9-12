sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onPress: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        formatter: {
            formatText: function (sValue) {
                return sValue || "_";
            }
        }
    };
});
