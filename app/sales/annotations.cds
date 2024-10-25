using MyService as service from '../../srv/service';
annotate service.PurchaseEnquiry with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.companyName,
                Label : 'Company Name',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.name,
                Label : 'Name',
            },
            {
                $Type : 'UI.DataField',
                Label : 'Contact Person',
                Value : contactPerson,
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.phone,
                Label : 'Phone',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.email,
                Label : 'Email',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.van,
                Label : 'VAN',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.address,
                Label : 'Address',
            },
            {
                $Type : 'UI.DataField',
                Label : 'Distribution Channels',
                Value : distributionChannels,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Division',
                Value : division,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Delivery Location',
                Value : deliveryLocation,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'Customer Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Enquiry Details',
            ID : 'EnquiryDetails',
            Target : '@UI.FieldGroup#EnquiryDetails',
        },
        {
            $Type : 'UI.CollectionFacet',
            Label : 'Quotation Details',
            ID : 'Quotation',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Vehicle Details',
                    ID : 'VehicleDetails',
                    Target : 'enquiryToVehicle/@UI.LineItem#VehicleDetails',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Price',
                    ID : 'Price',
                    Target : '@UI.FieldGroup#Price',
                },
            ],
        },
        {
            $Type : 'UI.CollectionFacet',
            Label : 'Quotation Details1',
            ID : 'QuotationDetails1',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Vehicle Details',
                    ID : 'VehicleDetails1',
                    Target : 'enquiryToVehicle/@UI.LineItem#VehicleDetails1',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Price',
                    ID : 'Price1',
                    Target : '@UI.FieldGroup#Price1',
                },
            ],
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Purchase Enquiry ID',
            Value : purchaseEnquiryId,
        },
        {
            $Type : 'UI.DataField',
            Value : enquiryToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Label : 'Contact Person',
            Value : contactPerson,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Division',
            Value : division,
        },
    ],
    UI.FieldGroup #EnquiryDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : purchaseEnquiryId,
                Label : 'Purchase Enquiry Id',
            },
            {
                $Type : 'UI.DataField',
                Value : deliveryLocation,
                Label : 'Delivery Location',
            },
        ],
    },
    UI.FieldGroup #Price : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : totalAmount,
                Label : 'Total Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : taxAmount,
                Label : 'Tax Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : grandTotal,
                Label : 'Grand Total',
            },
        ],
    },
    UI.FieldGroup #Price1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : totalAmount,
                Label : 'Total Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : taxAmount,
                Label : 'Tax Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : grandTotal,
                Label : 'Grand Total',
            },
        ],
    },
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : createdAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Request',
                        },
                    ],
                },
            ],
        },
        Text : 'Request',
    },
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryId,
            Label : 'Purchase Enquiry ID',
        },
        {
            $Type : 'UI.DataField',
            Value : enquiryToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status',
        },
    ],
    UI.SelectionPresentationVariant #tableView1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : modifiedAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'In Process',
                        },
                    ],
                },
            ],
        },
        Text : 'In Process',
    },
    UI.LineItem #tableView1 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryId,
            Label : 'Purchase Enquiry ID',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status',
        },
        {
            $Type : 'UI.DataField',
            Value : enquiryToCustomer.companyName,
            Label : 'Company Name',
        },
    ],
    UI.SelectionPresentationVariant #tableView2 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView1',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : modifiedAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Negotiation',
                        },
                    ],
                },
            ],
        },
        Text : 'Negotiation',
    },
    UI.LineItem #tableView2 : [
    ],
    UI.SelectionPresentationVariant #tableView3 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView2',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Table View 3',
    },
    UI.DeleteHidden : true,
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : enquiryToCustomer.companyName,
        },
        TypeName : '',
        TypeNamePlural : '',
        Description : {
            $Type : 'UI.DataField',
            Value : status,
        },
    },
);

annotate service.PurchaseEnquiry with {
    purchaseEnquiryId @Common.FieldControl : #ReadOnly
};

annotate service.Customer with {
    companyName @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    deliveryLocation @Common.FieldControl : #ReadOnly
};

annotate service.Customer with {
    email @Common.FieldControl : #ReadOnly
};

annotate service.Customer with {
    name @Common.FieldControl : #ReadOnly
};

annotate service.Customer with {
    panCard @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with @(
    UI.LineItem #VehicleDetails : [
        {
            $Type : 'UI.DataField',
            Value : materialCode,
            Label : 'Material Code',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleName,
            Label : 'VehicleName',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleColor,
            Label : 'Vehicle Color',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'Quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : pricePerUnit,
            Label : 'Price Per Unit',
        },
        {
            $Type : 'UI.DataField',
            Value : actualPrice,
            Label : 'Actual Price',
        },
        {
            $Type : 'UI.DataField',
            Value : taxPercentage,
            Label : 'taxPercentage',
        },
    ],
    UI.LineItem #VehicleDetails1 : [
        {
            $Type : 'UI.DataField',
            Value : materialCode,
            Label : 'Material Code',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleName,
            Label : 'Vehicle Name',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleColor,
            Label : 'Vehicle Color',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'Quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : taxPercentage,
            Label : 'Tax Percentage',
        },
        {
            $Type : 'UI.DataField',
            Value : pricePerUnit,
            Label : 'Price Per Unit',
        },
        {
            $Type : 'UI.DataField',
            Value : actualPrice,
            Label : 'Actual Price',
        },
        {
            $Type : 'UI.DataField',
            Value : discount,
            Label : 'Discount',
        },
        {
            $Type : 'UI.DataField',
            Value : discountedPrice,
            Label : 'Discounted Price',
        },
        {
            $Type : 'UI.DataField',
            Value : band,
            Label : 'Band',
        },
        {
            $Type : 'UI.DataField',
            Value : totalPrice,
            Label : 'totalPrice',
        },
    ],
);

annotate service.EnquiryVehicle with {
    vehicleName @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    contactPerson @Common.FieldControl : #ReadOnly
};

annotate service.Customer with {
    phone @Common.FieldControl : #ReadOnly
};

annotate service.Customer with {
    van @Common.FieldControl : #ReadOnly
};

annotate service.Customer with {
    address @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    distributionChannels @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    division @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    taxPercentage @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    actualPrice @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    quantity @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    vehicleColor @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    grandTotal @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    taxAmount @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    totalAmount @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    band @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    discountedPrice @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    discount @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    pricePerUnit @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : contactPerson,
            Label : 'Contact Person',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'purchaseOrderId',
        },
        {
            $Type : 'UI.DataField',
            Value : accHoldersName,
            Label : 'accHoldersName',
        },
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : createdAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Purchase Order',
    },
    UI.HeaderInfo : {
        TypeName : 'Purchase Order',
        TypeNamePlural : '',
        Title : {
            $Type : 'UI.DataField',
            Value : accHoldersName,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : status,
        },
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Customer Information',
            ID : 'CustomerInformation',
            Target : '@UI.FieldGroup#CustomerInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Enquiry Detials',
            ID : 'EnquiryDetials',
            Target : '@UI.FieldGroup#EnquiryDetials',
        },
        {
            $Type : 'UI.CollectionFacet',
            Label : 'Quotation Details',
            ID : 'QuotationDetails',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Vehicle Details',
                    ID : 'VehicleDetails',
                    Target : 'purchaseToVehicle/@UI.LineItem#VehicleDetails',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Price',
                    ID : 'Price',
                    Target : '@UI.FieldGroup#Price',
                },
            ],
        },
    ],
    UI.FieldGroup #CustomerInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.companyName,
                Label : 'Company Name',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.name,
                Label : 'Name',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.panCard,
                Label : 'Pan Card',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.email,
                Label : 'Email',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.address,
                Label : 'Address',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.phone,
                Label : 'Phone',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.userID,
                Label : 'userID',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.van,
                Label : 'VAN',
            },
        ],
    },
    UI.FieldGroup #EnquiryDetials : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : purchaseOrderId,
                Label : 'Purchase OrderId',
            },
            {
                $Type : 'UI.DataField',
                Value : quotationID,
                Label : 'Quotation ID',
            },
            {
                $Type : 'UI.DataField',
                Value : deliveryLocation,
                Label : 'Delivery Location',
            },
        ],
    },
    UI.FieldGroup #Price : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : totalPrice,
                Label : 'Total Price',
            },
            {
                $Type : 'UI.DataField',
                Value : taxAmount,
                Label : 'Tax Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : grandTotal,
                Label : 'Grand Total',
            },
        ],
    },
);

annotate service.PurchaseFiles with @(
    UI.LineItem #tableView : [
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Table View PurchaseFiles',
    }
);

annotate service.PurchaseOrder with {
    deliveryLocation @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    quotationID @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    purchaseOrderId @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with @(
    UI.LineItem #VehicleDetails : [
        {
            $Type : 'UI.DataField',
            Value : materialCode,
            Label : 'Material Code',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleName,
            Label : 'Vehicle Name',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleColor,
            Label : 'Vehicle Color',
        },
        {
            $Type : 'UI.DataField',
            Value : taxPercentage,
            Label : 'Tax Percentage',
        },
        {
            $Type : 'UI.DataField',
            Value : pricePerUnit,
            Label : 'Price Per Unit',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'Quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : actualPrice,
            Label : 'Actual Price',
        },
        {
            $Type : 'UI.DataField',
            Value : discount,
            Label : 'Discount',
        },
        {
            $Type : 'UI.DataField',
            Value : discountedPrice,
            Label : 'Discounted Price',
        },
        {
            $Type : 'UI.DataField',
            Value : band,
            Label : 'Band(%)',
        },
        {
            $Type : 'UI.DataField',
            Value : totalPrice,
            Label : 'Total Price',
        },
    ]
);

annotate service.PurchaseVehicle with {
    materialCode @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    totalPrice @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    actualPrice @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    discountedPrice @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    discount @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    quantity @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    pricePerUnit @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    taxPercentage @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    vehicleColor @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    grandTotal @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    taxAmount @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    totalPrice @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    status @Common.FieldControl : #ReadOnly
};

