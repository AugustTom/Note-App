import { Server, Model } from 'miragejs'

export function makeServer({ environment = "development" } = {}) {

    let server = new Server({
        environment,

        models: {
            note: Model,
        },

        seeds(server) {
            server.create("note", {id: 1,
                title: "delectus aut autem", content: "Lorem ipsum", status: "New" })
            server.create("note", { id: 2,
                title: "quis ut nam facilis et officia qui", content: "Lorem ipsum",
                status: "Completed" })
            server.create("note", { id: 3,
                title: "fugiat veniam minus", content: "Lorem ipsum", status: "Not completed"})
        },

        routes() {

            this.namespace = "api"

            this.get("/notes", schema => {
                return schema.notes.all()
            })

        },
    })

    return server
}
