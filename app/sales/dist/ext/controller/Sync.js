sap.ui.define(["sap/m/MessageToast","sap/ui/core/BusyIndicator"],function(e,s){"use strict";async function n(e){return new Promise((s,n)=>{jQuery.ajax({url:e,method:"GET",dataType:"json",success:function(e){s(e)},error:function(e,s,o){n(new Error(s+": "+o))}})})}return{sync:async function(o){s.show(0);try{debugger;const o=this.getModel().sServiceUrl;const t=o+`getSH()`;const r=await n(t);console.log("Response Data:",r);if(r){s.hide();e.show("Data Updated Succesfully in Database!")}}catch(n){s.hide();console.error("Error in sync function:",n.message||n);e.show(n)}s.hide()}}});
//# sourceMappingURL=Sync.js.map