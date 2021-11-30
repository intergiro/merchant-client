import * as model from "./index"
import * as dotenv from "dotenv"
import * as gracely from "gracely"
import "isomorphic-fetch"

dotenv.config()

describe.skip("Client testing", () => {

    let privateClient: Pick<model.Client, "order" | "merchant" | "pspLog">
    let publicClient: Pick<model.Client, "card" | "authorization">

    beforeAll(async () => {
      	privateClient = await model.Client.open(process.env.host ?? "backup", process.env.privateKey ?? "backup", "order", "merchant", "pspLog")
				// TODO: Fix bug that only one client can exist: privateClient's key will be overwritten with publicClient's key.
     		publicClient = await model.Client.open(process.env.host ?? "backup", process.env.publicKey ?? "backup", "card", "authorization")
    })
    it("get order", async () => {
        const orderList = await privateClient.order.list()
        const order = !gracely.Error.is(orderList) && Array.isArray(orderList) ? orderList[0] : undefined
        const fetched = order ? await privateClient.order.get(order.id) : false
        expect(!gracely.Error.is(fetched) ? fetched : false).toEqual(order)
    })
    it("create card", async () => {
        const fetched = await publicClient.card.create({ pan: "4111111111111111", expires: [2, 22], csc: "987" })
        expect(typeof fetched == "string" && fetched.split(".").length == 3).toBeTruthy()
    })
    it.skip("get merchant", async () => {
        expect(!gracely.Error.is(await privateClient.merchant.list())).toBeTruthy()
    })
    it.skip("get log", async () => {
        const log = await privateClient.pspLog.list()
        expect(!gracely.Error.is(log) && Array.isArray(log) && log.length > 0).toBeTruthy()
    })
})
