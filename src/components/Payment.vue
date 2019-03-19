<template>
  <v-container>
    <h1 class="display-2 font-weight-bold mb-3">決算</h1>
    <div>
      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>モノ・コト</th>
            <th>金額</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="item in list" :key="item.id">
            <td>{{item.date | formatDate}}</td>
            <td>{{item.name}}</td>
            <td>{{item.price}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <input type="text" v-model="newItem.name">
      <input type="number" v-model="newItem.price">
      <button @click="addItem">add</button>
    </div>
  </v-container>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component({
    filters: {
      formatDate: (date: Date) => {
        const m = ('00' + (date.getMonth() + 1)).slice(-2);
        const d = ('00' + date.getDate()).slice(-2);
        return m + '/' + d;
      },
    },
  })
  export default class Payment extends Vue {
    private list: object[] = [{
      id: 1,
      name: '家賃',
      price: 100,
      date: new Date(),
    }];
    private newItem: object = {
      id: this.list.length + 1,
      name: '',
      price: 0,
      date: new Date(),
    };

    /**
     * addItem
     */
    public addItem() {
      this.list.push(this.newItem);
    }
  }
</script>

<style>

</style>
