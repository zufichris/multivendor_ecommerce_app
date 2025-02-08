import { z } from "zod"
export const EBusinessTypes = z.enum(
    ["LLC", "SOLE PROPRIETOR", "COPORATION"]
)
export const EVerificationTypes = z.enum(
    ["NATIONAL ID", "PASSPORT", "DRIVING LISCENSE"]
)