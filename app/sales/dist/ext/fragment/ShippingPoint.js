sap.ui.define(["sap/m/MessageToast"],function(e){"use strict";return{onPress:function(t){e.show("Custom handler invoked.")},loadShippingPoint:async function(e){debugger;var t=e.getSource().getParent().getParent().getBindingContext().getProperty("plant");const i=e.getSource();var n=[new sap.ui.model.Filter("sHField",sap.ui.model.FilterOperator.EQ,"Plant"),new sap.ui.model.Filter("sHId",sap.ui.model.FilterOperator.EQ,t)];i.bindAggregation("items",{path:"/SH",filters:n,template:new sap.ui.core.Item({key:"{sHId2}",text:"{sHId2}"+`( {sHDescription2} )`})})}}});
//# sourceMappingURL=ShippingPoint.js.map