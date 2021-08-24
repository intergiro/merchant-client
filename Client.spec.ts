import { Client } from "./index"

describe("test", () => {
    it("test", async () => {
        const client = await Client.open("da", "da", "authorization")
        expect(client.authorization.load()).toEqual("")
    })
})
