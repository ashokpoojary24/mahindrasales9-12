// const { release } = require("@sap/cds/libx/_runtime/hana/pool");

sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';
var edit,comment,a,EnquiryDetails,Quotation1,comments,Upload,Payment,sendPayment;
var vehicledetails,delevaryDeatils,paymentDeatils,transactiondetails,releaseSO;

	return ControllerExtension.extend('sales.ext.controller.Obj_PurchaseOrder_Page', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf sales.ext.controller.Obj_PurchaseOrder_Page
			 */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			routing: {
				onAfterBinding: async function () {
					debugger
					
				},
				onAfterBinding: async function (oParameters) {
					debugger
				
				sendPayment = this.base.getView().mAggregations.content[0].mAggregations.footer.mAggregations.content.mAggregations.content[5];
				releaseSO = this.base.getView().mAggregations.content[0].mAggregations.footer.mAggregations.content.mAggregations.content[6];
				edit = this.base.getView().mAggregations.content[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].setEnabled(false);
				comment = this.base.getView().mAggregations.content[0].mAggregations.sections[11].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.items[1].setEnabled(false);
				EnquiryDetails = this.base.getView().mAggregations.content[0].mAggregations.sections[2];
				Quotation1 = this.base.getView().mAggregations.content[0].mAggregations.sections[4];
				comments = this.base.getView().mAggregations.content[0].mAggregations.sections[11];
				Upload = this.base.getView().mAggregations.content[0].mAggregations.sections[9];
				Payment = this.base.getView().mAggregations.content[0].mAggregations.sections[10];
				vehicledetails = this.base.getView().mAggregations.content[0].mAggregations.sections[3];
				delevaryDeatils = this.base.getView().mAggregations.content[0].mAggregations.sections[5];
				paymentDeatils = this.base.getView().mAggregations.content[0].mAggregations.sections[6];
				transactiondetails = this.base.getView().mAggregations.content[0].mAggregations.sections[7];


				let funcname = 'purchaseOrderFun';
					let oFunction = oParameters.getModel().bindContext(`/${funcname}(...)`);
					var uuid = window.location.href;
					const regex1 = /purchaseOrderUuid=([a-fA-F0-9-]+)/;;
					const match1 = uuid.match(regex1);
					if (match1) {
						a = match1[1];
						console.log(a);
					}
					oFunction.setParameter('PurchaseOrderUuid', a);
					await oFunction.execute();
					const oContext = oFunction.getBoundContext();
					var result = oContext.getValue();
					debugger
					if(result.value.status === 'Pending'){
						debugger
						Payment.setVisible(false);
						EnquiryDetails.setVisible(true);
						Quotation1.setVisible(true);
						Upload.setVisible(true);
						comments.setVisible(true);
						sendPayment.setVisible(false);
						transactiondetails.setVisible(false);
						delevaryDeatils.setVisible(false);
						paymentDeatils.setVisible(false);
						vehicledetails.setVisible(false);



					}else if(result.value.status === 'Payment confirmed'){
						EnquiryDetails.setVisible(false);
						Quotation1.setVisible(false);
						Upload.setVisible(false);
						comments.setVisible(false);
						Payment.setVisible(true);
						sendPayment.setVisible(true);
						transactiondetails.setVisible(false);
						delevaryDeatils.setVisible(false);
						paymentDeatils.setVisible(false);
						vehicledetails.setVisible(false);
						if(result.value.paymentBillType){
							sendPayment.setEnabled(true);
						}else{
							sendPayment.setEnabled(false);
						}
					}else if(result.value.status === 'Sent For Release'){
						Payment.setVisible(false);
						EnquiryDetails.setVisible(true);
						Quotation1.setVisible(true);
						Upload.setVisible(true);
						comments.setVisible(true);
						sendPayment.setVisible(false);
						transactiondetails.setVisible(false);
						delevaryDeatils.setVisible(true);
						paymentDeatils.setVisible(true);
						vehicledetails.setVisible(true);


					}
				}
			}
		}
	});
});
