import { ICredentials } from "data/types/credentials.types";

export const SALES_PORTAL_URL = process.env.SALES_PORTAL_URL!;
export const SALES_PORTAL_API_URL = process.env.SALES_PORTAL_API_URL!;

export const credentials: ICredentials = {
    username: process.env.USER_NAME!,
    password: process.env.USER_PASSWORD!,
};

export const TIMEOUTS = {
    ELEMENT_VISIBLE: 15000,
    SPINNER_DISAPPEAR: 10000,
    API_RESPONSE: 30000,
    PAGE_LOAD: 30000,
    ACTION_COMPLETE: 10000,
} as const;