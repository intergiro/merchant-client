import type { Client } from "./index";
import { Connection } from "@payfunc/model-base";
import "isomorphic-fetch"

export async function open<T extends keyof Client>(subset: T, connection: Connection, url?: string): Promise<Client[T]> {
	let result: any;
	switch (subset) {
		case "authorization":
			result = new (await import(`${url} "/acquirer/Client/Authorization"`)).Authorization(connection)
			break;
		case "verification":
			result = new (await import(`${url} "/acquirer/Client/Verification"`)).Verification(connection)
			break;
		case "settlement":
			result = new (await import(`${url} "/acquirer/Client/Settlement"`)).Settlement(connection)
			break;
		case "merchant":
			result = new (await import(`${url} "/acquirer/Client/Merchant"`)).Merchant(connection)
			break;
		case "card":
			result = new (await import(`${url} "/card/dist/Client"`)).Client(connection)
			break;
		case "contact":
			result = new (await import(`${url} "/Client/Contact"`)).Contact(connection)
			break;
		case "customer":
			result = new (await import(`${url} "/Client/Customer"`)).Customer(connection)
			break;
		case "order":
			result = new (await import(`${url} "/Client/Order"`)).Order(connection)
			break;
		case "log":
			result = new (await import(`${url} "/log/Client"`)).Client(connection)
			break;
		case "me":
			result = new (await import(`${url} "/Client/Me"`)).Me(connection)
			break;
	}
	return result;
}
