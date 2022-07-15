import type { Card } from "@payfunc/model-card/dist/Client/Card"
import type { Contact } from "@payfunc/model/Client/Contact"
import type { Customer } from "@payfunc/model/Client/Customer"
import type { Log as pLog } from "@payfunc/model/Client/Log"
import type { Me } from "@payfunc/model/Client/Me"
import type { Order } from "@payfunc/model/Client/Order"
import type { Authorization } from "@payfunc/model-acquirer/Client/Authorization"
import type { Functions } from "@payfunc/model-acquirer/Client/Functions"
import type { Merchant } from "@payfunc/model-acquirer/Client/Merchant"
import type { Settlement } from "@payfunc/model-acquirer/Client/Settlement"
import { Connection } from "@payfunc/model-base"
import type { Log as aLog } from "@payfunc/model-log/Client/Log"
import { open as openSubset } from "./open"

export interface Client {
	authorization: Authorization
	merchant: Merchant
	settlement: Settlement
	functions: Functions
	card: Card
	order: Order
	contact: Contact
	customer: Customer
	log: aLog
	pspLog: pLog
	me: Me
}
export namespace Client {
	export type Subset = keyof Client
	export namespace Subset {
		export const acquirer = ["authorization", "merchant", "settlement", "functions"] as const
		export const card = ["card"] as const
		export const acquirerLog = ["logAcquirer"] as const
		export const pspLog = ["logPsp"] as const
		export const psp = ["order", "customer", "me", "contact"] as const
		export const values = [...acquirer, ...card, ...acquirerLog, ...pspLog, ...psp] as const
		export function is(value: any | Subset): value is Subset {
			return typeof value == "string" && (values as unknown as string[]).includes(value)
		}
		export const open = openSubset
	}
	export async function open<T extends Subset>(url: string, key: string, ...subset: T[]): Promise<Pick<Client, T>> {
		const connection: Connection = Connection.open(url, key)
		return Object.fromEntries(
			await Promise.all(subset.map(async m => [m, await Subset.open(m, connection, url)] as const))
		) as Pick<Client, T>
	}
}
