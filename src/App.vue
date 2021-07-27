<template>
  <div id="app">

    <div class="statistic">
      <div id="total">
        <h2>Total</h2>
        <h3>{{notes.length}}</h3>
      </div>
      <div id="completed">
        <h2>Completed</h2>
        <h3>{{completed}}</h3>
      </div>
      <div id="not-completed">
        <h2>Not completed</h2>
        <h3>{{notCompleted}}</h3>
      </div>
    </div>

    <div class="note-table">
      <table>
        <tr>
          <input type="checkbox" class="checkbox" v-model="checked">
          <th>ID</th>
          <th>Title</th>
          <th>Content</th>
          <th>Status</th>
        </tr>

        <tr v-for="note in notes" v-bind:key="note.id" v-bind:id="'id-'+note.id">
          <input type="checkbox" class="checkbox" v-bind:value="note.id" v-model="checked" @change="deleteConfirmation">
          <td>{{ note.id }}</td>
          <td>{{ note.title }}</td>
          <td>{{ note.content }}</td>
          <td>{{ note.status }}</td>
        </tr>

      </table>
    </div>

    <div class="add-note">
      <button type="button" v-on:click="addNew">Add</button>
    </div>

    <div id="new-note" ref="new-note" hidden>
      <h1>Add note</h1>
      <form action="">
        <input type="text" ref="title" id="tile" placeholder="Add title..." required>
        <input type="text" ref="content" id="content" placeholder="Add your note..." required>
        <input type="button" value="Save" @click="createNew">
        <input type="button" value="Cancel" @click="cancelNew">
      </form>
    </div>

    <div class="alert" ref="delete-alert" hidden>
      <form>
        <span>Do you want to delete this note?</span>
        <button id="no" @click="cancelDelete">No</button>
        <button type="submit" id="yes" @click="deleteNote">Yes</button>
      </form>
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
      checked: []
    }
  },

  created() {
    fetch("/api/notes")
        .then(res => res.json())
        .then(json => {
          this.notes = json.notes
          this.completed = this.notes.filter(note => note.status == "Completed").length
          this.notCompleted = this.notes.filter(note => note.status == "Not completed").length
        })
  },
  methods: {
    addNew() {
      this.$refs['new-note'].removeAttribute('hidden')
    },
    cancelNew(){
      this.$refs.title.value = ""
      this.$refs.content.value = ""
      this.$refs["new-note"].setAttribute("hidden","hidden")
    },
    deleteConfirmation(){
      if (this.checked.length > 0) {
        this.$refs['delete-alert'].removeAttribute('hidden')
      } else{
        this.$refs['delete-alert'].setAttribute('hidden','hidden')
      }
    },
    cancelDelete(e){
      e.preventDefault()
      this.checked.pop()
      this.$refs['delete-alert'].setAttribute("hidden","hidden")
    },

    async createNew(e){
      e.preventDefault()
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: this.$refs.title.value ,content:this.$refs.content.value})
      };
      await fetch("api/notes/add", requestOptions)
          .then(res => res.json())
          .then(data => this.notes.push(data.note));
      this.cancelNew()
    },

    async deleteNote(e){
      e.preventDefault()
      let id = this.checked.pop()
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id:id })
      };
      await fetch("api/notes/" + id, requestOptions)

      this.notes = this.notes.filter(note => note.id !== id)
      this.cancelDelete(e)
    }

  }
}
</script>

<style>

</style>
