export interface BookingEmailData {
    bookingId: string;
    hotelId: string;
    hotelName: string;
    userId: string;
    userPhone: string;
    productType: string;
    listingId?: string;
    transferType?: string;
    terminal?: string;
    guestCount?: number;
    carType: string;
    acType: string;
    price: number;
    paidAmount: number;
    paymentStatus: string;
    date: string;
    time: string;
}


export interface BookingConfirmationTemplateData {
    bookingId: string;
    hotelId: string;
    hotelName: string;
    userId: string;
    userPhone: string;
    productType: string;
    carType: string;
    acType: string;
    price: number;
    paidAmount: number;
    paymentStatus: string;
    bookingDate: string;
    time: string;
    listingId?: string;
    transferType?: string;
    terminal?: string;
    guestCount?: number;
}
