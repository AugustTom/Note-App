<template>
  <div id="app" class="bg-gray-100 h-screen text-gray-600 ">

    <!--    STATISTICS box    -->
    <div class="statistic bg-white shadow-lg float-left grid grid-cols-3 gap-4 justify-between p-10 text-lg mt-10 ml-10"
         v-bind:class="{ disabled: disableBg }">
      <div id="total" class="justify-center items-center flex-col">
        <h2>Total</h2>
        <h3 class="text-3xl">{{ notes.length }}</h3>
      </div>
      <div id="completed" class="justify-center items-center flex-col">
        <h2>Completed</h2>
        <h3 class="text-3xl">{{ completed }}</h3>
      </div>
      <div id="not-completed" class="justify-center items-center flex-col">
        <h2>Not completed</h2>
        <h3 class="text-3xl">{{ notCompleted }}</h3>
      </div>
    </div>

    <!--    NOTE TABLE    -->
    <div class="note-table w-full float-left my-10 ml-10" v-bind:class="{ disabled: disableBg }">
      <div class="max-w-5xl">
        <table class="table-fixed shadow-lg">
          <tr class="bg-gray-500 text-white ">
            <th class="w-1/10 px-2 py-1 border-r border-gray-400"><input type="checkbox" class="checkbox "
                                                                         v-model="checked"></th>
            <th class="w-1/6 p-1 border-r border-gray-400 " @click="sort('id')"
                v-bind:class="[sortBy === 'id' ? sortDirection : '']">ID
            </th>
            <th class="w-1/3 p-1 border-r border-gray-400" @click="sort('title')"
                v-bind:class="[sortBy === 'title' ? sortDirection : '']">Title
            </th>
            <th class="w-1/3 p-1 border-r border-gray-400" @click="sort('content')"
                v-bind:class="[sortBy === 'content' ? sortDirection : '']">Content
            </th>
            <th class="w-1/6 p-1 " @click="sort('status')" v-bind:class="[sortBy === 'status' ? sortDirection : '']">
              Status
            </th>
          </tr>

          <tr v-for="note in notes" v-bind:key="note.id" v-bind:id="'id-'+note.id">
            <td class="w-1/10 px-2 py-1 border-b border-gray-200"><input type="checkbox" class="checkbox"
                                                                         v-bind:value="note.id" v-model="checked"
                                                                         @change="deleteConfirmation"></td>
            <td class="w-1/6 p-2 border-b border-gray-200 text-blue-800">{{ note.id }}</td>
            <td class="w-1/3 p-2 border-b border-gray-200">{{ note.title }}</td>
            <td class="w-1/3 p-2 border-b border-gray-200">{{ note.content }}</td>
            <td class="w-1/6 p-2 border-b border-gray-200">{{ note.status }}</td>
          </tr>

        </table>
        <div class="add-note my-6">
          <button type="button"
                  class="w-1/6 float-right bg-blue-800 rounded-sm font-bold text-white text-center px-6 py-3 transition duration-300 ease-in-out hover:bg-blue-600 "
                  v-on:click="addNew">Add
          </button>
        </div>
      </div>
    </div>

    <!--    NEW NOTE BOX    -->
    <div ref="new-note" class="absolute w-full h-full flex items-center justify-center"
         v-bind:class="{ hidden: !newNote, 'bg-gray-200 bg-opacity-70':disableBg, disabled: disableNew }">
      <div id="new-note" class="w-2/5 right-1/2 top-1/2p-10 bg-white shadow-xl border border-gray-200 p-10">
        <h1 class="text-2xl my-2">Add note</h1>
        <form>
          <input class="w-full border border-gray-200 my-3 p-2 truncate" type="text" id="tile"
                 placeholder="Add title..." v-model="titleIn">
          <textarea class="w-full border border-gray-200 mb-4 px-2 py-6" id="content"
                    placeholder="Add your note..." v-model="contentIn"/>
          <input
              class="w-1/4 bg-gray-200 rounded-sm font-bold text-white text-center px-6 py-3 transition duration-300 ease-in-out "
              type="submit" value="Save" @click="createNew" v-bind:disabled="!( titleIn && contentIn)"
              v-bind:class="{'bg-blue-800 hover:bg-blue-600':( titleIn && contentIn)}">
          <input
              class="w-1/4 rounded-sm bg-white font-bold text-blue-800 text-center px-6 py-3 transition duration-300 ease-in-out hover:bg-gray-300 ml-2"
              type="button" value="Cancel" @click="cancelNew">
        </form>
      </div>
    </div>

    <!--    ALERT    -->
    <div class="absolute w-full h-full"
         v-bind:class="{ hidden: !deleteAlert, 'bg-gray-400 bg-opacity-70': deleteAlert }">
      <div class="absolute alert float-left bg-red-600 w-3/5 p-2 text-white m-10 rounded-sm items-center"
           ref="delete-alert">
        <form>
          <span class="text-2xl px-1">&#9888;</span>
          <span>Do you want to delete this note?</span>
          <button class="border border-white rounded-sm w-1/12 py-1 float-right ml-2 hover:bg-red-700" id="no"
                  @click="cancelDelete">No
          </button>
          <button
              class="border border-white bg-white text-red-600 rounded-sm w-1/12 ml-2 py-1 float-right  hover:bg-gray-100"
              type="submit" id="yes" @click="deleteNote">Yes
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',

  data() {
    return {
      notes: [],
      completed: 0,
      notCompleted: 0,
      checked: [],
      sortBy: 'id',
      sortDirection: 'asc',
      titleIn: '',
      contentIn: '',
      newNote: false,
      disableBg: false,
      deleteAlert: false,
      disableNew: false
    }
  },
  created() {
    fetch("/api/notes")
        .then(res => res.json())
        .then(json => {
          this.notes = json.notes
          this.completed = this.notes.filter(note => note.status === "Completed").length
          this.notCompleted = this.notes.filter(note => note.status === "Not completed").length
        })
  },
  methods: {
    addNew() {
      this.newNote = true
      this.disableBg = true
    },
    cancelNew() {
      this.titleIn = ''
      this.contentIn = ''
      this.newNote = false
    },
    deleteConfirmation() {
      if (this.checked.length > 0) {
        this.deleteAlert = true
      } else {
        this.deleteAlert = false
      }
    },
    cancelDelete(e) {
      e.preventDefault()
      this.checked.pop()
      this.deleteAlert = false
    },
    sort(s) {
      if (s === this.sortBy) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      }
      this.sortBy = s;
      this.sortedProducts()
    },
    async createNew(e) {
      e.preventDefault()
      const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title: this.titleIn, content: this.contentIn})
      };
      await fetch("api/notes/add", requestOptions)
          .then(res => res.json())
          .then(data => this.notes.push(data.note));
      this.cancelNew()
    },
    async deleteNote(e) {
      e.preventDefault()
      let id = this.checked.pop()
      const requestOptions = {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: id})
      };
      await fetch("api/notes/" + id, requestOptions)

      this.notes = this.notes.filter(note => note.id !== id)
      this.cancelDelete(e)
    },
    sortedProducts() {
      return this.notes.sort((p1, p2) => {
        let modifier = 1;
        if (this.sortDirection === 'desc') modifier = -1;
        if (p1[this.sortBy] < p2[this.sortBy]) return -1 * modifier;
        if (p1[this.sortBy] > p2[this.sortBy]) return modifier;
        return 0;
      });
    }
  },
  computed: {
    isDisabled() {
      return this.titleIn.length > 0 && this.contentIn.value.length > 0
    }
  }
}
</script>

<style>
.asc:after {
  content: "\25B2"
}

.desc:after {
  content: "\25BC"
}

th {
  text-align: left;
}

td {
  text-align: left;
  background-color: white;
}
</style>
