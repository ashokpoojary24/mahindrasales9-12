using { db } from '../db/schema';

service MyService {

    entity Customer as projection on db.Customer;
     @odata.draft.enabled
    @odata.draft.bypass
    entity PurchaseEnquiry as projection on db.PurchaseEnquiry;
    @odata.draft.bypass
     @Common.SideEffects  : {
        $Type : 'Common.SideEffectsType',
        SourceProperties : [
            'discount'
        ],
        TargetProperties : [
           'discountedPrice','actualPrice','pricePerUnit','taxPercentage'
        ],
    }
    entity EnquiryVehicle as projection on db.EnquiryVehicle;
    entity EnquiryFiles as projection on db.EnquiryFiles;
    entity EnquiryComments as projection on db.EnquiryComments;
    @odata.draft.enabled
    @odata.draft.bypass
    entity PurchaseOrder as projection on db.PurchaseOrder;
    entity PurchaseVehicle as projection on db.PurchaseVehicle;
    entity PurchaseFiles as projection on db.PurchaseFiles;
    entity PurchaseComments as projection on db.PurchaseComments; 
    entity VehicleInventory as projection on db.VehicleInventory; 

    function postattach(p : String) returns String;
    function Fileds(para1 : String ) returns String;
    function QuotationFunc(para : String) returns String;
    function Request(r1 : String) returns String;
    function Nego(n1 : String) returns String;
    function Approved(a1 : String) returns String;
    function SendEmail(EmailId : String) returns String;   
    function disablebut(para : String) returns String; 
  
      
}