
import type { Authorization } from "@payfunc/model-acquirer/Client/Authorization"
import type { Verification } from "@payfunc/model-acquirer/Client/Verification"
import type { Merchant } from "@payfunc/model-acquirer/Client/Merchant"
import type { Settlement } from "@payfunc/model-acquirer/Client/Settlement"
import type { Card } from "@payfunc/model-card/dist/Client/Card"
import type { Log } from "@payfunc/model-log/Client/Log"
import type { Order } from "@payfunc/model/Client/Order"
import type { Me } from "@payfunc/model/Client/Me"
import type { Customer } from "@payfunc/model/Client/Customer"
import { Connection } from "@payfunc/model-base"
import { open as openSubset } from "./open"
import "isomorphic-fetch"

export interface Client {
	authorization: Authorization
	verification: Verification
	merchant: Merchant
	settlement: Settlement
	card: Card
	order: Order
	customer: Customer
	log: Log
	me: Me
}
export namespace Client {

	export type Subset = keyof Client
	export namespace Subset {
		export const acquirer = ["authorization", "merchant", "verification", "settlement"] as const
		export const card = ["card"] as const
		export const log = ["log"] as const
		export const psp = ["order", "customer"] as const
		export const values = [...acquirer, ...card, ...log, ...psp] as const
		export function is(value: any | Subset): value is Subset {
			return typeof value == "string" && (values as unknown as string[]).includes(value)
		}
		export const open = openSubset
	}
	export async function open<T extends Subset>(url: string, key: string, ...subset: T[]): Promise<Pick<Client, T>> {
		const connection: Connection = Connection.open(url, key)
		return Object.fromEntries(await Promise.all(subset.map(async m => [m, await Subset.open(m, connection, url)] as const))) as Pick<Client, T>
	}
}
