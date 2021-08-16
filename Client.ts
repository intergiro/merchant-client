import * as gracely from "gracely"

interface Order {
	id: string
}
interface Authorization {
	id: string
}
interface AuthorizationClient {
	list(start: number, end: number): Promise<Authorization[] | gracely.Error>
	create(authorization: Authorization): Promise<Authorization | gracely.Error>
}
interface OrderClient {
	list(start: number, end: number): Promise<Order[] | gracely.Error> | undefined
	create(order: Order): Promise<Order | gracely.Error> | undefined
}
export type Clients = typeof Client

export class Orderss implements OrderClient {
	async list(start: number, end: number): Promise<Order[] | gracely.Error> {
		return gracely.client.unauthorized()
	}
	async create(order: Order): Promise<Order | gracely.Error> {
		return gracely.client.unauthorized()
	}
}

export type Client = {
	order?: OrderClient
	authorization?: AuthorizationClient
}

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never

export namespace Client {
	export function create<T extends keyof Client>(...input: T[]): Pick<Client, T> {
		// const connection = {}
		if (input.includes("order"))
			const temp: T = "authorization"
		const result: Partial<Client> = {
			order: input.includes("order")
				? {
						list: () => {
							return undefined
						},
						create: () => {
							return undefined
						},

				  }
				: undefined,
			authorization: undefined,
		}
		return result
	}
}

/*

client = create(order)

console.log(client)
=> 
{
	order: 
		{
			list: () => order[]
			capture: () => void
			cancel: () => void
		}
}

client.order.list()





*/
