sap.ui.define(['sap/ui/core/mvc/ControllerExtension', 'sap/m/MessageBox'], function (ControllerExtension, MessageBox) {
	'use strict';
	var paymentDetails, createPV, deletePV, createPV1, deletePV1, Upload, comment, savevisiblity, send, Quotation1, Quotation, comment, comments, a, res = 0, flag = 0, commentText = '';
	var savedVarsion,commentflag,result,value;
	var IsActiveEntity,selectedStatus;
	return ControllerExtension.extend('sales.ext.controller.PurchaseEnquiryObjPage', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf sales.ext.controller.PurchaseEnquiryObjPage
			 */

			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			editFlow: {
				onAfterEdit: async function (mParameters) {
					debugger
					
					setTimeout(() => {
						comments.setEnabled(true);
						send.setVisible(false);
					}, 800);
				},
				onAfterSave: async function (oParameters) {
					debugger
					send.setVisible(true);
					// commentText = comments.getValue();
					setTimeout(() => {
						comments.setEnabled(false);
						send.setVisible(true);
					}, 800);
					res = 0;
				}

			},
			onAfterRendering: async function (oParameter) {
				debugger
				this.base.getView().mAggregations.content[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].mProperties.text = 'Review Quotation';
				// const Priceinput1 = aSections[2].mForwardedAggregations.subSections[0].mAggregations._grid.mAggregations.content[3].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements;
				// 	const Priceinput2 = aSections[3].mForwardedAggregations.subSections[0].mAggregations._grid.mAggregations.content[3].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements;
				// 	// const Priceinput1 = aSections[3].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[3].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements;
				// 	Priceinput1.forEach((field)=> {
				// 		field.mAggregations.fields[0].mAggregations.content.setEditMode("Display");
				// 	});
				// 	Priceinput2.forEach((field)=> {
				// 		field.mAggregations.fields[0].mAggregations.content.setEditMode("Display");
				// 	})
					
			},
			routing: {
				onAfterBinding: async function () {
					debugger
					var setEditBut = this.base.getView().mAggregations.content[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].mProperties.text = 'Review Quotation';
					selectedStatus = this.getView().mAggregations.content[0].mAggregations.sections[3].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.columns[10].mAggregations.template.mAggregations.items[0].getSelected();
					// var discountvalue =  this.getView().mAggregations.content[0].mAggregations.sections[3].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.columns[8].mAggregations.template.mAggregations.items[0].getSelected();
					debugger
					const oView = this.base.getView();
					const oPage = oView.getContent()[0];
					const aSections = oPage.getSections();

					
					// aSections[2].findAggregatedObjects(true, function (control) {
					// 	return control.isA("sap.m.Input");
					// }).forEach(function (oInput) {
					// 	// oInput.oParent.oParent.oParent.mAggregations.fields[0].mAggregations.content.setEditMode("Display");
					// });

					
					// var IsActiveEntity = false; // Example value; replace with the actual condition

					// aSections[3].findAggregatedObjects(true, function (control) {
					// 	return control.isA("sap.m.Input");
					// }).forEach(function (oInput) {
					// 	// Check if the input is the "Discount" field
					// 	if (oInput.getId().indexOf("Discount") !== -1) {
					// 		// If IsActiveEntity is false, enable the "Discount" field
					// 		oInput.setEnabled(!IsActiveEntity);
					// 	} else {
					// 		// Make all other fields read-only
					// 		oInput.setEnabled(false);
					// 	}
					// });


					createPV = this.base.getView().mAggregations.content[0].mAggregations.sections[2].mForwardedAggregations.subSections[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mForwardedAggregations.actions[1].setVisible(false);
					deletePV = this.base.getView().mAggregations.content[0].mAggregations.sections[2].mForwardedAggregations.subSections[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mForwardedAggregations.actions[2].setVisible(false);
					createPV1 = this.base.getView().mAggregations.content[0].mAggregations.sections[3].mForwardedAggregations.subSections[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mForwardedAggregations.actions[1].setVisible(false);
					deletePV1 = this.base.getView().mAggregations.content[0].mAggregations.sections[3].mForwardedAggregations.subSections[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mForwardedAggregations.actions[2].setVisible(false);
				
				},
				onBeforeBinding: async function (oParameter) {
					//this.getView().mAggregations.content[0].mAggregations.sections[3].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.columns[10].mAggregations.template.mAggregations.items[0].setVisible(false)
					debugger
					const oView = this.base.getView();
					const oPage = oView.getContent()[0];
					const aSections = oPage.getSections();
					var setEditBut = this.base.getView().mAggregations.content[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].mProperties.text = 'Review Quotation';
					var uuid = window.location.href;
					const regex1 = /purchaseEnquiryUuid=([a-fA-F0-9-]+)/;
					const regex = /IsActiveEntity=(true|false)/;
					const match = uuid.match(regex);
					if (match) {
						 IsActiveEntity = match[1];
						console.log(IsActiveEntity);
					}
					if(IsActiveEntity === 'false'){
						debugger
						var formelement = aSections[2].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[2].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements;
						formelement.forEach((field)=> {
							debugger
							field.mAggregations.fields[0].mAggregations.content.setEditMode("Display");
						});
						var formelements = aSections[3].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[2].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements;
						formelements.forEach((field)=> {
							debugger
							field.mAggregations.fields[0].mAggregations.content.setEditMode("Display");
						});
						//aSections[0].findAggregatedObjects(true, function (control) {
						// 	return control.isA("sap.m.Input");
						// }).forEach(function (oInput) {
						// 	debugger
						// 	oInput.oParent.oParent.oParent.mAggregations.fields[0].mAggregations.content.setEditMode("Display");
						// });
						let content = aSections[0].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements;
						content.forEach((field)=> {
							debugger
							// field.mAggregations.fields[0].mAggregations.content.mAggregations.contentEdit[0].setEditable(false);
							field.mAggregations.fields[0].mAggregations.content.setEditMode("Display");
						});
						aSections[1].findAggregatedObjects(true, function (control) {
							return control.isA("sap.m.Input");
						}).forEach(function (oInput) {
							debugger
							oInput.oParent.oParent.oParent.mAggregations.fields[0].mAggregations.content.setEditMode("Display");
						});
						const row = aSections[2].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations._content.mAggregations.rows;
						row.forEach((r) => {
							debugger
							
							const cells = r.getCells ? r.getCells() : r.getAggregation("content");
							cells.forEach((cell,index) => {
									debugger
									cell.mAggregations.content.setEditMode("Display");
								
							});
						
					
						});
	
						const rows = aSections[3].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations._content.mAggregations.rows;
						rows.forEach((row) => {
							debugger
							
							const cells = row.getCells ? row.getCells() : row.getAggregation("content");
							cells.forEach((cell,index) => {
								debugger
								if(index === 10 || index === 9){
	
								}
								else{
									debugger
									cell.mAggregations.content.setEditMode("Display") // Disable cell controls
								 }
							});
						
					
						});
						}
					setTimeout(async ()=>{
						
					let oContext12 = oParameter.oBinding.oElementContext;  
                    let oBindingData = oContext12.getObject();  
                
					let funcname100 = 'SalesOrvalue';
					let oFunction100 = this.getView().getModel().bindContext(`/${funcname100}(...)`);
					console.log();
					oFunction100.setParameter('SalesOrg',oBindingData.salesOrg );
					oFunction100.setParameter('DistChan', oBindingData.distributionChannels);
					oFunction100.setParameter('Division', oBindingData.division);
					oFunction100.setParameter('Doctype', oBindingData.docType); 
					await oFunction100.execute();
					const oContext11 = oFunction100.getBoundContext();
                    let result = oContext11.getValue();
                    
					console.log('Harsha78',result);

					// let id1 = this.base.getView().mAggregations.content[0].mAggregations.sections[1].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations;
					// id1.formElements[2].getFields()[0].mAggregations.content.mAggregations.contentDisplay.setTooltip(result.value[1]);
					// id1.formElements[3].getFields()[0].mAggregations.content.mAggregations.contentDisplay.setTooltip(result.value[2]);
					// id1.formElements[5].getFields()[0].mAggregations.content.mAggregations.contentDisplay.setTooltip(result.value[0]);
					// id1.formElements[6].getFields()[0].mAggregations.content.mAggregations.contentDisplay.setTooltip(result.value[3]);

					
					let div3 = this.base.getView().mAggregations.content[0].mAggregations.sections[1].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements[2].mAggregations.fields[0].mAggregations.content.mAggregations.contentDisplay.setTooltip(result.value[1]);
				    let sal = this.base.getView().mAggregations.content[0].mAggregations.sections[1].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements[3].mAggregations.fields[0].mAggregations.content.mAggregations.contentDisplay.setTooltip(result.value[0]);
					let discha = this.base.getView().mAggregations.content[0].mAggregations.sections[1].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements[5].mAggregations.fields[0].mAggregations.content.mAggregations.contentDisplay.setTooltip(result.value[2]);
					let doctyp = this.base.getView().mAggregations.content[0].mAggregations.sections[1].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements[6].mAggregations.fields[0].mAggregations.content.mAggregations.contentDisplay.setTooltip(result.value[3]);
				},1000);
				
					
					this.base.getView().mAggregations.content[0].mAggregations.footer.mAggregations.content.mAggregations.content[4].getVisible();
					// local
					// savevisiblity = this.base.getView().mAggregations.content[0].mAggregations.footer.mAggregations.content[4].getVisible();

					Upload = this.base.getView().mAggregations.content[0].mAggregations.sections[4];
					comment = this.base.getView().mAggregations.content[0].mAggregations.sections[5];
					Quotation = this.base.getView().mAggregations.content[0].mAggregations.sections[2]
					Quotation1 = this.base.getView().mAggregations.content[0].mAggregations.sections[3];
					comments = this.base.getView().mAggregations.content[0].mAggregations.sections[5].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.items[1];
					// global
					send = this.base.getView().mAggregations.content[0].mAggregations.footer.mAggregations.content.mAggregations.content[5];
					// local
					// send = this.base.getView().mAggregations.content[0].mAggregations.footer.mAggregations.content.mAggregations.content[5];
					savedVarsion = sap.ui.getCore().byId("sales::PurchaseEnquiryObjectPage--fe::StandardAction::SwitchDraftAndActiveObject").getVisible();
					
					
					
					
		// 			if (savevisiblity === false) {
		// send.setVisible(false);
		// 				comments.setEnabled(true);
		// 			} else {
		// 				if (savedVarsion == false) {
		// 					send.setEnabled(true);
		// 				} else {
		// 					send.setEnabled(false);
		// 				}
		// 				// send.setVisible(true);
		// 			}


					let funcname = 'statusFun';
					debugger
					let oFunction = oParameter.getModel().bindContext(`/${funcname}(...)`);
					
					const match1 = uuid.match(regex1);
					if (match1) {
						a = match1[1];
						console.log(a);
					}
					oFunction.setParameter('purchaseEnquiryUuid', a);
					await oFunction.execute();
					const oContext = oFunction.getBoundContext();
					result = oContext.getValue();
					var statusres = result;
					debugger
					var Pe = result.value.purchaseEnquiryId;
					if (result.value.status === 'Request' || result.value.status === null) {
						debugger
					
						// global
						var footer = this.base.getView().mAggregations.content[0].mAggregations.footer;

                        footer.setVisible(true);
						var ReviewQuotation = this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].setEnabled(true);
						// local
						// var ReviewQuotation = this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].setVisible(true);
						Quotation1.setVisible(false);
						Quotation.setVisible(true);
						comments.setEnabled(false);


						let funcname = 'requestFun';
						let oFunction = oParameter.getModel().bindContext(`/${funcname}(...)`);
						oFunction.setParameter('peUuid', a);
						await oFunction.execute();
						const oContext = oFunction.getBoundContext();
						result = oContext.getValue();
						debugger
						if (match[1] == 'true') {
							if (result.value.success) {
								MessageBox.success(result.value.message, {
									title: "Success",
									onClose: function () {
										console.log("Success dialog closed");
									}
								});
								// send.setEnabled(true);
							} else {
								const issues = result.value.message.split('<br>');
								// Concatenate issues into a single formatted string
								const formattedMessage = issues.join('\n');
								MessageBox.warning(formattedMessage, {
									title: "Stocks Warning",
									onClose: function () {
										console.log("Warning dialog closed");
									}
								});
								flag = flag + 1;
								// send.setEnabled(false);
							}
							// res = res + 1;
						}

					} else if (result.value.status === 'Negotiation') {
						// global
						var footer = this.base.getView().mAggregations.content[0].mAggregations.footer;

                        footer.setVisible(true);
						var ReviewQuotation = this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].setEnabled(true);
						// local
						// var ReviewQuotation = this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].setVisible(true);
						Quotation1.setVisible(true);
						Quotation.setVisible(false);
						comments.setEnabled(false);
						send.setVisible(true);
						const aData = await new Promise((resolve, reject) => {
							jQuery.ajax({
								url: `https://3c552736trial-dev-mahindra-sales-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/EnquiryVehicle?$filter=purchaseEnquiryUuid eq ${a}`,
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
						if (aData && aData.value) {
							// Loop through all vehicles in the data
							for (const vehicle of aData.value) {
								let discountValue = vehicle.discount || ''; // Ensure discount is a string
								// let isPercentage = discountValue.includes('%');
								
								// if (isPercentage) {
								// 	this.getView().mAggregations.content[0].mAggregations.sections[3].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.columns[8].mAggregations.template.mAggregations.items[0].setSelected(true);
								// } else {
								// 	this.getView().mAggregations.content[0].mAggregations.sections[3].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.columns[8].mAggregations.template.mAggregations.items[0].setSelected(false);
								// }
							}
						}
						// let isPercentage = discountvalue.includes('%');
						// if(isPercentage == true){
						// 	selectedStatus.setSelected(true);
						// }else{
						// 	selectedStatus.setSelected(false);
						// }

						let funcname = 'negotiationFun';
						let oFunction = oParameter.getModel().bindContext(`/${funcname}(...)`);
						oFunction.setParameter('peUuid', a);
						await oFunction.execute();
						const oContext = oFunction.getBoundContext();
						result = oContext.getValue();

					} else if (result.value.status === 'Approved') {
						// global
						var ReviewQuotation = this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].setEnabled(true);
						// local
						// var ReviewQuotation = this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].setVisible(true);
						Quotation1.setVisible(true);
						Quotation.setVisible(false);
						send.setVisible(false);


					} else if (result.value.status === 'In Process') {
						var footer = this.base.getView().mAggregations.content[0].mAggregations.footer;
						// global
						var ReviewQuotation = this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].setEnabled(false);
						// local
						// var ReviewQuotation = this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].setVisible(true);
						comments.setEnabled(false);
						// selectedStatus.setEditMode(false);
						let funcname = 'inProcessFun';
						let oFunction = oParameter.getModel().bindContext(`/${funcname}(...)`);
						oFunction.setParameter('peUuid', a);
						await oFunction.execute();
						const oContext = oFunction.getBoundContext();
						result = oContext.getValue();

						// if (result.value.discount == '0' || !result.value.discount) {
						// 	Quotation.setVisible(true);
						// 	Quotation1.setVisible(false);
						// } else {
							Quotation.setVisible(false);
							Quotation1.setVisible(true);
						// 	var checkbox =this.getView().mAggregations.content[0].mAggregations.sections[3].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.columns[10];
						// checkbox.setVisible(false);
						// send.setVisible(false);
						footer.setVisible(false);
						//}
						
					}

					if(IsActiveEntity === 'false'|| statusres.value.status === 'In Process'){
						send.setVisible(false);
						//selectedStatus.setEnabled(true);
					}else if(IsActiveEntity === 'true'){
						send.setVisible(true);
						//selectedStatus.setEnabled(false);
					}
				}
			}

		}
	});
});
