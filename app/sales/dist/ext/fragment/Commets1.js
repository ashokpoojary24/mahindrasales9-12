sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/m/MessageToast"],function(o,e,s){"use strict";return{onBrowseHistoryPress:async function(){debugger;var o=this.byId("commentHistoryVBox123");var e=this.byId("commentHistoryDialog1223");e.open();var s=o._oScroller.getContainerDomRef();if(s){var i=s.scrollHeight}o.scrollTo(0,i,1e3)},onCloseHistoryDialog:function(){var o=this.byId("commentHistoryDialog1223");if(o){o.close()}},onDialogOpen:function(){console.log("Comment History Dialog opened")}}});
//# sourceMappingURL=Commets1.js.map