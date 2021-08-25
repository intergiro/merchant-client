
import type { Authorization } from "@payfunc/model-acquirer/Client/Authorization"
import type { Verification } from "@payfunc/model-acquirer/Client/Verification"
import type { Merchant } from "@payfunc/model-acquirer/Client/Merchant"
import type { Settlement } from "@payfunc/model-acquirer/Client/Settlement"
import type { Card } from "@payfunc/model-card/dist/Client/Card"
import type { Log } from "@payfunc/model-log/Client/Log"
import type { Order } from "@payfunc/model/Client/Order"
import type { Customer } from "@payfunc/model/Client/Customer"
import "isomorphic-fetch"
export namespace Client {

    const acquirer = ["authorization", "merchant", "verification", "settlement"] as const
    const card = ["card"] as const
    const log = ["log"] as const
    const psp = ["order", "customer"] as const
    const clients = [...acquirer, ...card, ...log, ...psp] as const
    export type Clients = typeof clients[number]

    function isClient(value: any | Clients): value is Clients {
        return clients.includes(value)
    }

    type Return = {
        authorization: Authorization
        verification: Verification
        merchant: Merchant
        settlement: Settlement
        card: Card
        order: Order
        customer: Customer
        log: Log
    }

    export async function open<T extends Clients>(url: string, token: string, ...inputs: T[]): Promise<Pick<Return, T>> {
        let result: Partial<Return> = {}
        let clients: Clients[] | undefined = inputs.filter(isClient)
        if (!clients || clients.includes("authorization"))
            result["authorization"] = (await import("@payfunc/model-acquirer/Client/Authorization").then(m => m.Authorization.open(url, token)))
        if (!clients || clients.includes("verification"))
            result["verification"] = (await import("@payfunc/model-acquirer/Client/Verification").then(m => m.Verification.open(url, token)))
        if (!clients || clients.includes("settlement"))
            result["settlement"] = (await import("@payfunc/model-acquirer/Client/Settlement").then(m => m.Settlement.open(url, token)))
        if (!clients || clients.includes("merchant"))
            result["merchant"] = (await import("@payfunc/model-acquirer/Client/Merchant").then(m => m.Merchant.open(url, token)))
        if (!clients || clients.includes("card"))
            result["card"] = (await import("@payfunc/model-card/dist/Client").then(m => m.Client.open(url, token).card))
        if (!clients || clients.includes("customer"))
            result["customer"] = (await import("@payfunc/model/Client/Customer").then(m => m.Customer.open(url, token)))
        if (!clients || clients.includes("order"))
            result["order"] = (await import("@payfunc/model/Client/Order").then(m => m.Order.open(url, token)))
        if (!clients || clients.includes("log"))
            result["log"] = (await import("@payfunc/model-log/Client").then(m => m.Client.open(url, token).log))
        return result as Pick<Return, T>
    }
}
