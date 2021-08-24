
import type { Authorization } from "@payfunc/model-acquirer/Client/Authorization"
import type { Verification } from "@payfunc/model-acquirer/Client/Verification"
import type { Merchant } from "@payfunc/model-acquirer/Client/Merchant"
import type { Settlement } from "@payfunc/model-acquirer/Client/Settlement"


export namespace Client {

    const acquirer = ["authorization", "merchant", "verification", "settlement"] as const
    type Acquirer = typeof acquirer[number]

    function isAcquirer(value: any | Acquirer): value is Acquirer {
        return acquirer.includes(value)
    }

    const card = ["card"] as const
    type Card = typeof card[number]


    const clients = [...acquirer, "card"] as const
    type Clients = typeof clients[number]


    type Return = {
        authorization: Authorization
        verification: Verification
        merchant: Merchant
        settlement: Settlement
    }
    export async function open<T>(url: string, token: string, ...[inputs]: Clients[]): Promise<Return> {
        let result: Return
        let temp: Clients[]
        if (temp = [inputs].filter(isAcquirer)) {
            if (temp.includes("authorization")) {
                const test = await import("@payfunc/model-acquirer/Client/Authorization")
                result["authorization"] = (test).Authorization.open(url, token)
            }
            if (temp.includes("settlement"))
                result["settlement"] = (await import("@payfunc/model-acquirer/Client/Settlement")).Settlement.open(url, token)
            if (temp.includes("merchant"))
                result["merchant"] = (await import("@payfunc/model-acquirer/Client/Merchant")).Merchant.open(url, token)
            if (temp.includes("verification"))
                result["verification"] = (await import("@payfunc/model-acquirer/Client/Verification")).Verification.open(url, token)
        }
        if (temp.includes("card"))
            result["card"] = (await import("@payfunc/model-card/")).
        return result
    }
}

