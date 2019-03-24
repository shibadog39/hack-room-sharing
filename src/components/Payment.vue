<template>
  <v-container>
    <h1 class="display-2 font-weight-bold mb-3">○月決算</h1>
    <div>
      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>モノ・コト</th>
            <th>人</th>
            <th>値段</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in itemList" :key="index">
            <td>{{item.date | formatDate}}</td>
            <td>{{item.name}}</td>
            <td>{{item.user.name}}</td>
            <td>{{item.price}}</td>
            <td><v-btn flat small color="error" @click.prevent="deleteItem(index)">☓</v-btn></td>
          </tr>
        </tbody>
      </table>
    </div>
    <v-form>
        <v-layout row wrap>
          <v-flex xs4 sm4 md4>
            <v-select v-model="newItem.user" :items="userList" item-text="name" return-object label="人"></v-select>
          </v-flex>
          <v-flex xs4 sm4 md4>
             <v-text-field label="モノ・コト" type="text" placeholder="ティッシュ" v-model="newItem.name"></v-text-field>
          </v-flex>
          <v-flex xs4 sm4 md4>
            <v-text-field label="値段" type="number" placeholder="216" v-model="newItem.price"></v-text-field>
          </v-flex>
          <v-btn small color="info" @click.prevent="addItem">add</v-btn>
        </v-layout>
    </v-form>
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
    private userList: any[] = [
      {
        id: 1,
        name: '櫻井',
      },
      {
        id: 2,
        name: '尾花',
      }];
    private itemList: any[] = [{
      name: '家賃',
      user: this.userList[0],
      price: 100,
      date: new Date(2019, 0, 1),
    }];
    private newItem: any = {
      name: '',
      user: this.userList[0],
      price: 0,
      date: new Date(),
    };

    /**
     * addItem
     */
    public addItem() {
      this.newItem.id = this.itemList.length + 1;
      const newItem = Object.assign({}, this.newItem);
      this.itemList.push(newItem);
      this.newItem.id = 0;
      this.newItem.name = '';
      this.newItem.price = 0;
      this.newItem.date = new Date();
    }

    /**
     * deleteItem
     */
    public deleteItem(index: number) {
      if (confirm('Are you sure?')) {
        this.itemList.splice(index, 1);
      }
    }
  }
</script>

<style>

</style>
