import { Client } from "./index"
import * as dotenv from "dotenv"
import * as gracely from "gracely"

dotenv.config()

describe("Client testing", () => {

    let privateClientPromise = Client.open(process.env.host ?? "backup", process.env.privateKey ?? "backup", "order", "merchant", "log")
    let publicClientPromise = Client.open(process.env.host ?? "backup", process.env.publicKey ?? "backup", "card")

    type PromiseType<T> = T extends PromiseLike<infer U> ? PromiseType<U> : T

    let privateClient: PromiseType<typeof privateClientPromise>
    let publicClient: PromiseType<typeof publicClientPromise>

    beforeAll(async () => {
        privateClient = await privateClientPromise
        publicClient = await publicClientPromise
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
    it("get merchant", async () => {
        expect(!gracely.Error.is(await privateClient.merchant.list())).toBeTruthy()
    })
    it("get log", async () => {
        const log = await privateClient.log.list()
        expect(!gracely.Error.is(log) && Array.isArray(log) && log.length > 0).toBeTruthy()
    })
})
