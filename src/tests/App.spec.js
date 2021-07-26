// src/tests/App.spec.js

import { mount } from "@vue/test-utils"
import { makeServer } from "../server"
import App from "../App.vue"

let server

beforeEach(() => {
    server = makeServer({ environment: "test" })
})

it("shows the notes from our server", async () => {
    server.create("note", {id: 1,
        title: "delectus aut autem", content: "Lorem ipsum", status: "New" })
    server.create("note", { id: 2,
        title: "quis ut nam facilis et officia qui", content: "Lorem ipsum",
        status: "Completed" })
    server.create("note", { id: 3,
        title: "fugiat veniam minus", content: "Lorem ipsum", status: "Not completed"})

    const wrapper = mount(App)

    // let’s wait for our vue component to finish loading data
    // we know it’s done when the data-testid enters the dom.
    await waitFor(wrapper, '#id-1')

    expect(wrapper.find('#id-1').find('td').text()).toBe("1")
    expect(wrapper.find('#id-2').find('td').text()).toBe("2")
    expect(wrapper.find('#id-3').find('td').text()).toBe("3")
})


// This helper method returns a promise that resolves
// once the selector enters the wrapper’s dom.
const waitFor = function(wrapper, selector) {
    return new Promise(resolve => {
        const timer = setInterval(() => {
            const todoEl = wrapper.findAll(selector)
            if (todoEl.length > 0) {
                clearInterval(timer)
                resolve()
            }
        }, 100)
    })
}

afterEach(() => {
    server.shutdown()
})
