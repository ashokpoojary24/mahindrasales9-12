sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';
    var iddd;
    var that = this;
    var extractedNumber;
    var extractedNumber2;

    return {
       
        onAfterItemAdded: function (oEvent) {
            debugger;
            var baseUrl = oEvent.oSource.getModel().getServiceUrl();
            var item = oEvent.getParameter("item");
            var par_id = window.location.href;
            const regex = /purchaseEnquiryUuid=([a-fA-F0-9-]+)/;
            const match = par_id.match(regex);
            if (match) {
                extractedNumber = match[1];
                console.log(extractedNumber); // Output: 1
            } else {
                console.log("Number not found in URL");
            }


            var _createEntity = async function (item) {
                var data = {
                    mediaType: item.getMediaType(),
                    fileName: item.getFileName(),
                    size: item.getFileObject().size,
                    purchaseEnquiryUuid : extractedNumber,
                };
                debugger

                var settings = {
                    url: baseUrl + `PurchaseEnquiry(purchaseEnquiryUuid=${extractedNumber},IsActiveEntity=true)/enquiryToFile`,
                    // url: `odata/v4/my/lectures(lUuid=${extractedNumber},IsActiveEntity=false)/lectofile`,
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    data: JSON.stringify(data)
                };

                await new Promise((resolve, reject) => {
                    debugger
                    $.ajax(settings)
                        .done((results, textStatus, request) => {
                            debugger
                            iddd = results.id;
                            resolve(results);
                        })
                        .fail((err) => {
                            reject(err);
                        });
                });
            };

            _createEntity(item)
                .then((id) => {
                    debugger
                    var url = baseUrl + `EnquiryFiles(id=${iddd},IsActiveEntity=false)/content`;
                    iddd = null;
                    item.setUploadUrl(url);
                    item.setUrl(url)
                    var oUploadSet = this.byId("_IDGenUploadSet");
                    oUploadSet.setHttpRequestMethod("PUT");
                    oUploadSet.uploadItem(item);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        onOpenPressed: async function (oEvent) {
            debugger
            var fileurl
            var baseUrl = oEvent.oSource.getModel().getServiceUrl();
            var currentUrl = oEvent.oSource.mProperties.url;

            
            if (!currentUrl.startsWith(baseUrl)) {
                // If not, prepend baseUrl to the currentUrl
                currentUrl = baseUrl + currentUrl;
                oEvent.oSource.mProperties.url = currentUrl;
            }
            // var url23 = `https://port4004-workspaces-ws-blv5f.us10.trial.applicationstudio.cloud.sap` + currentUrl;
            // sidecontent1.setSource(url23);
            this.showSideContent("GeneratedFacet1");

       },

        onUploadCompleted: function (oEvent) {
            debugger
            var oUploadSet = this.byId("upload");
            oUploadSet.removeAllIncompleteItems();

        },
        afterItemRemoved: function (oEvent) {
            debugger
            var baseUrl = oEvent.oSource.getModel().getServiceUrl()
            debugger
            const regex = /^(.*?),IsActiveEntity=/;

            let match = oEvent.mParameters.item.mProperties.url.match(regex);
            let urll = match[1] + ",IsActiveEntity=false)";
            $.ajax({
                url: baseUrl + urll,
                method: "DELETE"

            })
        },

        //formatters
        formatThumbnailUrl: function (mediaType) {
            debugger
            var iconUrl;
            switch (mediaType) {
                case "image/png":
                    iconUrl = "sap-icon://card";
                    break;
                case "text/plain":
                    iconUrl = "sap-icon://document-text";
                    break;
                case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    iconUrl = "sap-icon://excel-attachment";
                    break;
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    iconUrl = "sap-icon://doc-attachment";
                    break;
                case "application/pdf":
                    iconUrl = "sap-icon://pdf-attachment";
                    break;
                default:
                    iconUrl = "sap-icon://attachment";
            }
            return iconUrl;
        },
    };
});