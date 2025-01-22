sap.ui.define(["sap/ui/core/mvc/ControllerExtension","sap/m/MessageBox"],function(e,t){"use strict";var s,i;return e.extend("sales.ext.controller.PurchaseEnquiryObjPage",{override:{onInit:function(){var e=this.base.getExtensionAPI().getModel()},editFlow:{onAfterEdit:async function(e){},onAfterSave:async function(e){}},onAfterRendering:async function(e){},routing:{onAfterBinding:async function(){const e=this.base.getView();const t=e.getContent()[0];const s=t.getSections();const i=t.getAggregation("footer");setTimeout(()=>{const e=this.base.getView().findAggregatedObjects(true,function(e){return e.isA("sap.m.Button")&&e.getId().includes("SwitchDraftAndActiveObject")});if(e[0].getVisible()==true){if(e[0].getText()=="Saved Version"){i.setVisible(false)}else if(e[0].getText()=="Draft"){i.setVisible(true)}}},1e3)},onBeforeBinding:async function(e){debugger;const t=this.base.getView();const n=t.getContent()[0];const g=n.getSections();var o=g[1].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.form.mAggregations.formContainers[0].mAggregations.formElements[13].mAggregations.fields[0];let r=e.getPath().match(/purchaseEnquiryUuid=([\w-]+).*IsActiveEntity=(\w+)/);if(r){var a=r[1];var l=r[2]}var u="PE";let c=e.getModel().bindContext(`/statusFun(...)`);c.setParameter("purchaseEnquiryUuid",a);c.setParameter("state",u);await c.execute();s=c.getBoundContext().getValue();var m=s.value.result;console.log("Descriptions PE",s);const f=this.base.getView().findAggregatedObjects(true,function(e){return e.isA("sap.m.Button")&&(e.getId().includes("Edit")||e.getId().includes("send"))});const d=this.base.getView().findAggregatedObjects(true,function(e){return e.isA("sap.m.Button")&&e.getId().includes("SwitchDraftAndActiveObject")});const b=n.getAggregation("footer");var A=this.base.getView().mAggregations.content[0].mAggregations.sections[1].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.form.mAggregations.formContainers[0].mAggregations.formElements;const V=g[5].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.items[1];let I=g[3].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.items[0].mAggregations.content.mAggregations.columns;i=s.value.result.status;var C=l==="true"||i==="Negotiation";var _=l==="false"&&i==="Request";this.getView().getModel("ui").setProperty("/text",C);this.getView().getModel("ui").setProperty("/comboBox",_);if(l==="true"){debugger;V.setEditable(false);f[1].setVisible(true);if(i==="Negotiation"){f[0].setEnabled(true);f[1].setVisible(true);b.setVisible(true);o.setVisible(true);f[0].setText("Negotiate")}else if(i==="Request"){f[0].setEnabled(true);f[1].setVisible(true);b.setVisible(true);o.setVisible(false);f[0].setText("Review Quotation")}else if(i==="In Process"){f[0].setEnabled(false);f[1].setVisible(false);b.setVisible(false);o.setVisible(true)}}else if(l==="false"){V.setEditable(true);f[1].setVisible(false);b.setVisible(true)}if(i==="Request"){o.setVisible(false);I[7]._oInnerColumn.setVisible(false);I[8]._oInnerColumn.setVisible(false);I[15]._oInnerColumn.setVisible(true);I[14]._oInnerColumn.setVisible(false)}else if(i==="In Process"){o.setVisible(true);I[7]._oInnerColumn.setVisible(true);I[8]._oInnerColumn.setVisible(false);I[15]._oInnerColumn.setVisible(false);I[14]._oInnerColumn.setVisible(true)}else if(i==="Negotiation"){o.setVisible(true);I[15]._oInnerColumn.setVisible(false);I[14]._oInnerColumn.setVisible(true);if(l==="false"){I[7]._oInnerColumn.setVisible(true);I[8]._oInnerColumn.setVisible(true)}else{I[7]._oInnerColumn.setVisible(true);I[8]._oInnerColumn.setVisible(false)}}setTimeout(async function(){if(!f[0].getEnabled())f[0].setVisible(false);A[2].mAggregations.fields[0].setText(m.salesOrg);A[3].mAggregations.fields[0].setText(m.distributionChannels);A[4].mAggregations.fields[0].setText(m.division);A[5].mAggregations.fields[0].setText(m.docType)}.bind(this),800)}}}})});
//# sourceMappingURL=PurchaseEnquiryObjPage.controller.js.map