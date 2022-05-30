import type { Client } from "./index";
import { Connection } from "@payfunc/model-base";

export async function open<T extends keyof Client>(subset: T, connection: Connection, url?: string): Promise<Client[T]> {
	let result: any;
	switch (subset) {
		case "authorization":
			result = new (await import("@payfunc/model-acquirer/dist/Client/Authorization.js")).Authorization(connection)
			break;
		case "log":
			result = new (await import("@payfunc/model-log/dist/Client/Log.js")).Log(connection)
			break;
		case "settlement":
			result = new (await import("@payfunc/model-acquirer/dist/Client/Settlement.js")).Settlement(connection)
			break;
		case "merchant":
			result = new (await import("@payfunc/model-acquirer/dist/Client/Merchant.js")).Merchant(connection)
			break;
		case "functions":
			result = new (await import("@payfunc/model-acquirer/dist/Client/Functions.js")).Functions(connection)
			break;
		case "card":
			result = new (await import("@payfunc/model-card/dist/Client/Card.js")).Card(connection)
			break;
		case "contact":
			result = new (await import("@payfunc/model/dist/Client/Contact.js")).Contact(connection)
			break;
		case "customer":
			result = new (await import("@payfunc/model/dist/Client/Customer.js")).Customer(connection)
			break;
		case "order":
			result = new (await import("@payfunc/model/dist/Client/Order.js")).Order(connection)
			break;
		case "pspLog":
			result = new (await import("@payfunc/model/dist/Client/Log.js")).Log(connection)
			break;
		case "me":
			result = new (await import("@payfunc/model/dist/Client/Me.js")).Me(connection)
			break;
	}
	return result;
}
