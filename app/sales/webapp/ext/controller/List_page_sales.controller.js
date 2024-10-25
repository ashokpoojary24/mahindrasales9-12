sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('sales.ext.controller.List_page_sales', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf sales.ext.controller.List_page_sales
			 */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			onAfterRendering: async function (oParameter) {
				debugger
				this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[0].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[0].mAggregations.action.mProperties.visible = false;
				this.base.getView().getContent()[0].mAggregations.header.mAggregations.content[0].mAggregations.items[0].mAggregations.content.removeAllFilterItems(false);
				this.base.getView().mAggregations.content[0].mAggregations.header.mAggregations.content[0].mAggregations.items[0].mAggregations.content._btnAdapt.mProperties.visible = false;
				this.base.getView().mAggregations.content[0].mAggregations.header.mAggregations.content[0].mAggregations.items[0].mAggregations.content._btnSearch.mProperties.visible = false;

				var craeteInproce = this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[1].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[0].mAggregations.action.mProperties.visible = false;
				var craeteNego = this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[2].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[0].mAggregations.action.mProperties.visible = false;
				var CreatePO = this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[3].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[0].mAggregations.action.mProperties.visible = false;
				var deletePO = this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[3].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[1].mAggregations.action.mProperties.visible = false;
			},
			routing: {
				onBeforeBinding: async function () {
					debugger
				}
			}
		}
	});
});
