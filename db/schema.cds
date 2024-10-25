namespace db;

using {
    managed
} from '@sap/cds/common';

entity Customer {

  key customerId : UUID;
  name : String;
  companyName : String;
  address : String;
  email : String;
  phone : String;
  userID : String;
  password: String;
  van : String;

  @Core.MediaType: panMediaType
  panCard: LargeBinary;
  @Core.IsMediaType: true
  panMediaType: String;

  @Core.MediaType: gstCertificateMediaType
  gstCertificate: LargeBinary;
  @Core.IsMediaType: true
  gstCertificateMediaType: String;

  @Core.MediaType: bankMediaType
  bankMandate: LargeBinary;
  @Core.IsMediaType: true
  bankMediaType: String;

  customerToEnquiry : Composition of  many PurchaseEnquiry on customerToEnquiry.enquiryToCustomer = $self;
  customerToPurchase : Composition of many PurchaseOrder on customerToPurchase.purchaseToCustomer = $self;
}

entity PurchaseEnquiry : managed {
  key purchaseEnquiryUuid : UUID;
  purchaseEnquiryId : String;
  customerId : UUID;
  deliveryLocation : String;
  contactPerson : String;
  division : String;
  distributionChannels : String;
  status : String;
  totalAmount : String default '0';
  taxAmount : String default '0';
  grandTotal : String default '0';
  quotationId : String;

  enquiryToCustomer : Association to one Customer on enquiryToCustomer.customerId=customerId;
  enquiryToVehicle : Composition of many EnquiryVehicle on enquiryToVehicle.vehicleToEnquiry = $self;
  enquiryToFile : Association to many EnquiryFiles on enquiryToFile.fileToEnquiry = $self;
  enquiryToComments : Composition of many EnquiryComments on enquiryToComments.commentToEnquiry = $self;
}

entity EnquiryVehicle { 
    key vehicleId : UUID;
    purchaseEnquiryId : UUID;
    materialCode : String;
    vehicleName : String;
    vehicleColor : String;
    quantity : Integer;
    band : String;
    pricePerUnit : String;
    taxPercentage : String;
    actualPrice : String default '0';
    totalPrice :  String default '0';
    discount : String default '0';
    discountedPrice : String default '0';
    vehicleToEnquiry : Association to one PurchaseEnquiry on vehicleToEnquiry.purchaseEnquiryId= purchaseEnquiryId;
  }



entity EnquiryFiles : managed {
    key id        : UUID;
        purchaseEnquiryUuid      : UUID;
        @Core.MediaType  : mediaType
        content   : LargeBinary;
        @Core.IsMediaType: true
        mediaType : String;
        url       : String;
        fileToEnquiry  : Association to one PurchaseEnquiry on fileToEnquiry.purchaseEnquiryUuid = purchaseEnquiryUuid;
        
}


entity PurchaseComments:managed{
  key commentId : UUID;
  purchaseOrderUuid :  UUID;
  commentsText : String;
  commentToPurchase: Association to one PurchaseOrder on commentToPurchase.purchaseOrderUuid = purchaseOrderUuid;
}
entity EnquiryComments:managed{
  key commentId : UUID;
  purchaseEnquiryUuid  : UUID;
  commentsText : String;
  commentToEnquiry: Association to one PurchaseEnquiry on commentToEnquiry.purchaseEnquiryUuid = purchaseEnquiryUuid;
}

entity PurchaseOrder : managed {
  key purchaseOrderUuid : UUID;
  purchaseOrderId : String;
  customerId : UUID;

  deliveryLocation : String;
  salesOrderId : String;
  dealerCode : String;

  bankName : String;
  accNumber : String;
  ifscCode : String;
  branch : String;
  accHoldersName : String;
  dueDate : Date;

  transactionId: String;
  accountNo : String;
  amount : Decimal;
  paymentMethod : String;

  contactPerson : String;
  division : String;
  distributionChannels : String;
  purchaseEnquiryID : String;
  
  totalPrice : Decimal ;
  taxAmount : Decimal ;
  grandTotal : Decimal ;
  quotationID : String;

  @Core.MediaType: mediaType
  invoice: LargeBinary;
  @Core.IsMediaType: true
  mediaType: String;

  status : String;
  soModifiedAt : Timestamp;

  purchaseToCustomer : Association to  one Customer on purchaseToCustomer.customerId = customerId;
  purchaseToVehicle: Composition of   many PurchaseVehicle on purchaseToVehicle.vehicleToPurchase = $self;
  purchaseToFiles : Composition of many PurchaseFiles on purchaseToFiles.filesToPurchase = $self;
  purchaseToComments : Composition of many PurchaseComments on purchaseToComments.commentToPurchase = $self;

}

entity PurchaseVehicle { 

    key vehicleID : UUID;
    purchaseOrderUuid : UUID;
    materialCode : String;
    vehicleName : String;
    vehicleColor : String;
    quantity : Integer;
    band : String;
    pricePerUnit : Decimal;
    taxPercentage : Integer;
    actualPrice : Decimal ;
    totalPrice :  Decimal ;
    discount : Integer ;
    discountedPrice : Decimal ;

    deliveryLeadTime : String;
    deliveryDate : Date;
    shippingMethod : String;
    shippingCharges : String;

    plannedQuantity: String;
    shippingDate: Date;
    expectedDeliveryDate : Date;
    allocationStatus: String;

    vehicleToPurchase : Association to one PurchaseOrder on vehicleToPurchase.purchaseOrderUuid= purchaseOrderUuid;
  }

  
  entity PurchaseFiles : managed {
    key id        : UUID;
        purchaseOrderUuid      : UUID;
        @Core.MediaType  : mediaType
        content   : LargeBinary;
        @Core.IsMediaType: true
        mediaType : String;
        url       : String;
        filesToPurchase  : Association to one PurchaseOrder on filesToPurchase.purchaseOrderUuid = purchaseOrderUuid;
        
}



entity VehicleInventory {
    key vehicleCode : String;
    vehicleName : String;
    vehicleColor : String;
    quantity : Integer;
    pricePerUnit : String;
    taxPercentage : Integer;
    silver : Integer;
    gold : Integer;
    platinum : Integer;
}



