export { };

declare global {
    namespace Express {
        interface User {
            id: string;
            phone: string;
        }

        interface Hotel {
            id: string;
            display_name: string;
            address: string;
            pincode: number;
            lat_long: string;
        }

        interface Request {
            user?: User;
            hotel?: Hotel;
        }
    }
}