using MyService as service from '../../srv/service';
annotate service.PurchaseEnquiry with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.companyName,
                Label : 'Company Name:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.phone,
                Label : 'Contact Number:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.email,
                Label : 'Email:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.van,
                Label : 'Virtual Account Number:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.address,
                Label : 'Address:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.jobTitle,
                Label : 'Job Title:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.department,
                Label : 'Department:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.taxId,
                Label : 'Tax ID:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.Currency,
                Label : 'Currency:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.Language,
                Label : 'Language:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.Country,
                Label : 'Country:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.City,
                Label : 'City:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.Street,
                Label : 'Street:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.postalCode,
                Label : 'Postal Code:',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.location,
                Label : 'Location:',
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
            Label : 'Inquiry Details',
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
            Label : 'Quotation Details',
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
            Label : 'Purchase Inquiry ID',
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
    ],
    UI.FieldGroup #EnquiryDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : deliveryLocation,
                Label : 'Delivery Location:',
            },
            {
                $Type : 'UI.DataField',
                Value : contactPerson,
                Label : 'Contact Person:',
            },
            {
                $Type : 'UI.DataField',
                Value : division,
                Label : 'Division:',
            },
            {
                $Type : 'UI.DataField',
                Value : salesOrg,
                Label : 'Sales Organization:',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseEnquiryId,
                Label : 'Purchase Inquiry ID:',
            },
            {
                $Type : 'UI.DataField',
                Value : distributionChannels,
                Label : 'Distribution Channel:',
            },
            {
                $Type : 'UI.DataField',
                Value : docType,
                Label : 'Document Type:',
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
            Label : 'Purchase Inquiry ID',
        },
        {
            $Type : 'UI.DataField',
            Value : enquiryToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : contactPerson,
            Label : 'Contact Person',
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
            Label : 'Purchase Inquiry ID',
        },
        {
            $Type : 'UI.DataField',
            Value : enquiryToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : contactPerson,
            Label : 'Contact Person',
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
        ImageUrl : enquiryToCustomer.profilePicType,
    },
    UI.LineItem #tableView3 : [
    ],
    UI.SelectionPresentationVariant #tableView4 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView3',
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
                            Low : 'Pending',
                        },
                    ],
                },
            ],
        },
        Text : 'Payment Details',
    },
    UI.LineItem #tableView4 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryId,
            Label : 'purchaseEnquiryId',
        },
    ],
    UI.SelectionPresentationVariant #tableView5 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView4',
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
                            Low : 'Pending',
                        },
                    ],
                },
            ],
        },
        Text : 'Payment Details',
    },
    UI.Identification : [
        
    ],
);

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
            Value : partnerRole,
            Label : 'partnerRole',
        },
        {
            $Type : 'UI.DataField',
            Value : partnerNumber,
            Label : 'partnerNumber',
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
            Value : band,
            Label : 'Band',
        },
        {
            $Type : 'UI.DataField',
            Value : discountedPrice,
            Label : 'Discounted Price',
        },
        {
            $Type : 'UI.DataField',
            Value : taxPercentage,
            Label : 'taxPercentage',
        },
        {
            $Type : 'UI.DataField',
            Value : totalPrice,
            Label : 'Total Price',
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
            Value : partnerRole,
            Label : 'partnerRole',
        },
        {
            $Type : 'UI.DataField',
            Value : partnerNumber,
            Label : 'partnerNumber',
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
            Value : band,
            Label : 'Band',
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
            Value : taxPercentage,
            Label : 'Tax Percentage',
        },
        {
            $Type : 'UI.DataField',
            Value : totalPrice,
            Label : 'Total Price',
        },
    ],
);

annotate service.PurchaseOrder with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'Purchase Order ID',
        },
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
                            Low : 'SO Pending',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'SO Not Released',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Approved',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Sent For Release',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Rejected',
                        },
                    ],
                },
            ],
        },
        Text : 'Purchase Order',
    },
    UI.HeaderInfo : {
        TypeName : 'Purchase Order',
        TypeNamePlural : '',
        Title : {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
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
            Label : 'Sales Order Details',
            ID : 'EnquiryDetials',
            Target : '@UI.FieldGroup#EnquiryDetials',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Vehicle Details',
            ID : 'VehicleDetails1',
            Target : 'purchaseToVehicle/@UI.LineItem#VehicleDetails1',
        },
        {
            $Type : 'UI.CollectionFacet',
            Label : 'Vehicle Details',
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
                    Label : 'Price Details',
                    ID : 'Price',
                    Target : '@UI.FieldGroup#Price',
                },
            ],
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Delivery Details',
            ID : 'DeliveryDetails',
            Target : 'purchaseToVehicle/@UI.LineItem#DeliveryDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Payment Details',
            ID : 'PaymentDetails',
            Target : '@UI.FieldGroup#PaymentDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Transaction Details',
            ID : 'TransactionDetails',
            Target : '@UI.FieldGroup#TransactionDetails',
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
                Value : purchaseToCustomer.contactPerson,
                Label : 'Contact Person',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.name,
                Label : 'Name',
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
                Value : purchaseToCustomer.location,
                Label : 'Location',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.van,
                Label : 'VAN',
            },
            {
                $Type : 'UI.DataField',
                Value : distributionChannels,
                Label : 'Distribution Channels',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.taxId,
                Label : 'Tax ID',
            },
            {
                $Type : 'UI.DataField',
                Value : deliveryLocation,
                Label : 'Delivery Location',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.jobTitle,
                Label : 'Job Title',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.department,
                Label : 'Department',
            },
            {
                $Type : 'UI.DataField',
                Value : status,
                Label : 'status',
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
    UI.DeleteHidden : true,
    UI.LineItem #tableView1 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'Purchase Order ID',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.contactPerson,
            Label : 'Contact Person',
        },
    ],
    UI.SelectionPresentationVariant #tableView1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView1',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Payment Details',
    },
    UI.LineItem #tableView2 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'Purchase  Order ID',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.contactPerson,
            Label : 'Contact Person',
        },
    ],
    UI.SelectionPresentationVariant #tableView2 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView2',
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
                            Low : 'Confirmed',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Details Sent',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Payment Confirmed',
                        },
                    ],
                },
            ],
        },
        Text : 'Payment Details',
    },
    UI.LineItem #tableView3 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'Purchase Order ID',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
    ],
    UI.SelectionPresentationVariant #tableView3 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView3',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : soModifiedAt,
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
                            Low : 'Sent For Release',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Waiting For Payment Confirmation',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Payment Confirmed',
                        },
                    ],
                },
            ],
        },
        Text : 'SO Pending ',
    },
    UI.LineItem #tableView4 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'Purchase Order ID',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
    ],
    UI.SelectionPresentationVariant #tableView4 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView4',
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
                            Low : 'SO Not Released',
                        },
                    ],
                },
            ],
        },
        Text : 'Purchase Order',
    },
    UI.LineItem #tableView5 : [
        {
            $Type : 'UI.DataField',
            Value : salesOrderId,
            Label : 'Sales Order ID',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status',
        },
    ],
    UI.SelectionPresentationVariant #tableView5 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView5',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Sales Oder',
    },
    UI.FieldGroup #PaymentDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : bankName,
                Label : 'Bank Name',
            },
            {
                $Type : 'UI.DataField',
                Value : accNumber,
                Label : 'Account Number',
            },
            {
                $Type : 'UI.DataField',
                Value : accHoldersName,
                Label : 'Account Holders Name',
            },
            {
                $Type : 'UI.DataField',
                Value : ifscCode,
                Label : 'IFSC Code',
            },
            {
                $Type : 'UI.DataField',
                Value : branch,
                Label : 'Branch',
            },
            {
                $Type : 'UI.DataField',
                Value : dueDate,
                Label : 'Due Date',
            },
        ],
    },
    UI.FieldGroup #TransactionDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : accountNo,
                Label : 'Account Number',
            },
            {
                $Type : 'UI.DataField',
                Value : transactionId,
                Label : 'Transaction ID',
            },
            {
                $Type : 'UI.DataField',
                Value : amount,
                Label : 'Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : paymentMethod,
                Label : 'Payment Method',
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
            Value : partnerNumber,
            Label : 'partnerNumber',
        },
        {
            $Type : 'UI.DataField',
            Value : partnerRole,
            Label : 'partnerRole',
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
    ],
    UI.LineItem #VehicleDetails1 : [
        {
            $Type : 'UI.DataField',
            Value : materialCode,
            Label : 'Vehicle Code',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleColor,
            Label : 'Vehicle Color',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleName,
            Label : 'Vehicle Name',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'Quantity',
        },
    ],
    UI.LineItem #DeliveryDetails : [
        {
            $Type : 'UI.DataField',
            Value : materialCode,
            Label : 'Vehicle Code',
        },
        {
            $Type : 'UI.DataField',
            Value : deliveryDate,
            Label : 'Delivery Date',
        },
        {
            $Type : 'UI.DataField',
            Value : deliveryLeadTime,
            Label : 'Delivery Lead Time',
        },
        {
            $Type : 'UI.DataField',
            Value : shippingCharges,
            Label : 'Shipping Charges',
        },
    ],
);


annotate service.PurchaseOrder with {
    bankName @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    accNumber @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    accHoldersName @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    ifscCode @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    dueDate @Common.FieldControl : #ReadOnly
};

