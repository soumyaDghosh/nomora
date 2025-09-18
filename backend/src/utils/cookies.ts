import { Response } from "express";

const isProd = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "uat-production";

export const setCookie = (res: Response, name: string, value: string) => {
    res.cookie(name, value, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        domain: isProd ? ".nomora.co.in" : undefined,
        maxAge: 3 * 24 * 60 * 60 * 1000,
    });
};

export const clearCookie = (res: Response, name: string) => {
    res.clearCookie(name, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        domain: isProd ? ".nomora.co.in" : undefined,
    });
};