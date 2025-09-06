export { };

declare global {
    namespace Express {
        interface User {
            id: string;
            phone: string;
        }

        interface Request {
            user?: User;
        }
    }
}