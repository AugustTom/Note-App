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
          <input type="checkbox" id="checkbox" v-model="checked">
          <th>ID</th>
          <th>Title</th>
          <th>Content</th>
          <th>Status</th>
        </tr>

        <tr v-for="note in notes" v-bind:key="note.id">
          <input type="checkbox" id="checkbox" v-model="checked">
          <td>{{ note.id }}</td>
          <td>{{ note.title }}</td>
          <td>{{ note.content }}</td>
          <td>{{ note.status }}</td>
        </tr>

      </table>
    </div>

    <div class="add-note">
      <button type="button">Add</button>
    </div>

    <div id="new-note">
      <h1>Add note</h1>
      <form action="">
        <input type="text" name="title" id="title" placeholder="Add title...">
        <input type="text" name="content" id="content" placeholder="Add your note...">
        <input type="submit" value="Save">
        <input type="button" value="Cancel">
      </form>
    </div>

    <div class="alert">
      <span></span>
      <span>Do you want to delete this note?</span>
      <button type="button" id="no">No</button>
      <button type="button" id="yes">Yes</button>
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
  }
}
</script>

<style>

</style>
