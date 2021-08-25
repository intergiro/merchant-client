import { Client } from "./index"


describe("test", () => {
    it("test", async () => {
        const client = await Client.open("https://api.payfunc.com", "da", "order")
        const orderList = await client.order.list()
        expect(orderList).toEqual({ "status": 401, "type": "not authorized" })
        expect(client).toEqual({ "order": { "connection": { "token": "da", "url": "https://api.payfunc.com" } } })
    })
})
