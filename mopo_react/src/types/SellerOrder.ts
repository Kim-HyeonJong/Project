export interface SellerOrder {
    orderItemId: number;
    orderId: number;
    orderNumber: string;
    status: string;
    totalAmount: number;
    createdAt: string;

    receiverName: string;
    receiverPhone: string;
    zipcode: string;
    address: string;
    addressDetail: string;

    photocardId: number;
    photocardName: string;
    imageUrl: string;

    sellerId: number;

    quantity: number;
    price: number;
    amount: number;
}
