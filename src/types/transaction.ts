export type PaymentMethod = "QRIS" | "CASH";

export type PaymentStatus =  "PAID" | "UNPAID";

export interface TransactionItem {
    id: string;
    transactionId: string;
    productId: string;
    quantity: number;
    priceAtTime: number;
}

export interface Transaction {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    notes?: string;
    outletId: string;
    cashierId: string;
    items: TransactionItem[];
    paidAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MyTransaction {
    id: string;
    invoice: string;
    date: string;
    outlet: string;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    itemCount: number;
}

export interface MyTransactionResponse {
    status: string;
    data: MyTransaction[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreateTransactionPayload {
    outletId: string;
    paymentMethod: PaymentMethod;
    items: {
        productId: string;
        quantity: number;
        priceAtTime: number;
    }[];
    notes?: string;
}
