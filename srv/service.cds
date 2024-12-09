 using {db} from '../db/schema';

service MyService {

    entity Customer         as projection on db.Customer;

    @odata.draft.enabled
    @odata.draft.bypass
    entity PurchaseEnquiry  as projection on db.PurchaseEnquiry;

    @odata.draft.bypass
    @Common.SideEffects  : {
        $Type : 'Common.SideEffectsType',
        TargetEntities : [
            vehicleToEnquiry
        ]
      
    }
    entity EnquiryVehicle   as projection on db.EnquiryVehicle;
    entity EnquiryFiles     as projection on db.EnquiryFiles;

    @odata.draft.bypass
    entity EnquiryComments  as projection on db.EnquiryComments;

    @odata.draft.enabled
    @odata.draft.bypass
    entity PurchaseOrder    as projection on db.PurchaseOrder;

    @odata.draft.bypass
    entity PurchaseVehicle  as projection on db.PurchaseVehicle;

    entity PurchaseFiles    as projection on db.PurchaseFiles;

    @odata.draft.bypass
    entity PurchaseComments as projection on db.PurchaseComments;
    entity VehicleInventory as projection on db.VehicleInventory;
    entity SH as projection on db.SH;
    function postattach(p : String)                            returns String;
    function SendEmail(EmailId : String)                       returns String;
    function disablebut(para : String)                         returns String;
    function statusFun(purchaseEnquiryUuid : String)                returns String;
    function quotationFun(peUuid : String)                       returns String;
    function requestFun(peUuid : String)                           returns String;
    function negotiationFun(peUuid: String)                       returns String;
    function inProcessFun(peUuid : String)                         returns String;
    function commentsFun(commentsText : String, peUuid : String) returns String;
    function purchaseOrderFun(PurchaseOrderUuid : String)      returns String;
    function payDetailsFun(PurchaseOrderUuid : String)         returns String;
    function getUserRoles() returns Array of String;
    function getSH( ) returns String;
    function disCheckFun(value : String,peUuid: String,discount: String)         returns String;
    
    function generateInvoice(
        purchaseOrderUuid  : UUID 
    ) returns String;

    function sendForRelease(
        data  : String
    ) returns String;

function generateSO(
        data : UUID
    ) returns String;
    
    function PatchEntity(
        purchaseOrderUuid :UUID, 
        status :String
    ) returns String;

    function SalesOrvalue(
        SalesOrg : String,
        DistChan : String,
        Division : String,
        Doctype : String

    )returns array of String;

    
    annotate PurchaseVehicle with @Common.SideEffects : {
        SourceProperties : ['deliveryDate'],
        TargetProperties: ['deliveryLeadTime'],
    };

    annotate EnquiryVehicle with @Common.SideEffects : {
        SourceProperties : ['discount','discountedPrice'],

        TargetProperties: ['discountedPrice','actualPrice','totalPrice','taxPercentage',vehicleToEnquiry.totalAmount,vehicleToEnquiry.taxAmount,vehicleToEnquiry.grandTotal],
    };

}
