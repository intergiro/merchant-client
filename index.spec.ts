import { Client } from "./index"
import * as dotenv from "dotenv"
import * as gracely from "gracely"

dotenv.config()

describe("Client testing", () => {

    const privateClient = Client.open(process.env.host ?? "backup", process.env.private ?? "backup", "order", "merchant", "log")
    const publicClient = Client.open(process.env.host ?? "backup", process.env.public ?? "backup", "card")

    it("get order", async () => {
        const orderList = await(await privateClient).order.list()
        const fetched = !gracely.Error.is(orderList) && Array.isArray(orderList) ? await (await privateClient).order.get(orderList[0].id) : false
        expect(!gracely.Error.is(fetched) ? fetched : false).toEqual(orderList[0])
    })
    it("create card", async () => {
        const fetched = await (await publicClient).card.create({ pan: "4111111111111111", expires: [2, 22], csc: "987" })
        expect(typeof fetched == "string" && fetched.split(".").length == 3).toBeTruthy()
    })
    it("get merchant", async () => {
        expect(!gracely.Error.is(await (await privateClient).merchant.list())).toBeTruthy()
    })
    it("get log", async () => {
        const log = await (await privateClient).log.list()
        expect(!gracely.Error.is(log) && Array.isArray(log) && log.length > 0).toBeTruthy()
    })
})
