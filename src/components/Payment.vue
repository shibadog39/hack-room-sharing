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
            <td>{{getUserById(item.userId).name}}</td>
            <td>{{item.price}}</td>
            <td>
              <v-btn flat small color="error" @click.prevent="deleteItem(index)">☓</v-btn>
            </td>
          </tr>
        </tbody>
      </table>
      <span>合計 {{totalAmount}}円</span>
    </div>
    <div>
      <v-form ref="form" lazy-validation>
        <v-layout row wrap>
          <v-flex xs3>
            <v-select
              v-model.number="newItem.userId"
              :items="userList"
              item-text="name"
              item-value="id"
              label="人"
              :rules="[rules.required]"
            ></v-select>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              label="モノ・コト"
              type="text"
              placeholder="ティッシュ"
              v-model="newItem.name"
              :rules="[rules.required]"
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              label="値段"
              type="number"
              placeholder="216"
              v-model.number="newItem.price"
              :rules="[rules.required]"
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-btn small color="info" @click.prevent="addItem">add</v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </div>
    <div>
      <table>
        <thead>
          <th></th>
          <th>負担した金額</th>
          <th>精算</th>
        </thead>
        <tbody>
          <tr v-for="(result, index) in paymentResult" :key="index">
            <td>{{getUserById(result.userId).name}}</td>
            <td>{{result.payBy}}</td>
            <td>{{result.mustPay | formatMustPay}}</td>
            <td>
              <v-btn flat small color="error" @click.prevent="deleteItem(index)">☓</v-btn>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pre>{{ $data }}</pre>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  filters: {
    formatDate: (date: Date) => {
      const m = ("00" + (date.getMonth() + 1)).slice(-2);
      const d = ("00" + date.getDate()).slice(-2);
      return m + "/" + d;
    },
    formatMustPay: (mustPay: number) => {
      if (mustPay >= 0) {
        return mustPay + "円支払う";
      } else {
        return mustPay * -1 + "円もらう";
      }
    }
  }
})
export default class Payment extends Vue {
  private userList: any[] = [
    {
      id: 1,
      name: "櫻井"
    },
    {
      id: 2,
      name: "尾花"
    }
  ];
  private itemList: any[] = [
    {
      name: "家賃",
      userId: this.userList[0].id,
      price: 100,
      date: new Date(2019, 0, 1)
    }
  ];
  private newItem: any = {
    name: "",
    userId: this.userList[0].id,
    price: 0,
    date: new Date()
  };
  private rules: any = {
    required: (value: any) => !!value || "入力必須です."
  };

  /**
   * addItem
   */
  private addItem() {
    if (this.validate()) {
      const newItem = Object.assign({}, this.newItem);
      this.itemList.push(newItem);
      (this.$refs.form as any).reset();
    }
  }

  /**
   * deleteItem
   */
  private deleteItem(index: number) {
    if (confirm("Are you sure?")) {
      this.itemList.splice(index, 1);
    }
  }

  private validate(): boolean {
    // TODO: remove any
    return (this.$refs.form as any).validate();
  }

  private getUserById(userId: number): object {
    return this.userList.find(user => {
      return user.id === userId;
    });
  }
  private priceList(itemList: any[]): number[] {
    return itemList.map(item => {
      return item.price;
    });
  }

  private get totalAmount(): number {
    return this.priceList(this.itemList).reduce((pre, cur) => {
      return pre + cur;
    });
  }

  private get paymentResult(): any[] {
    return this.userList.map(user => {
      const payByItemList = this.itemList.filter(item => {
        return item.userId === user.id;
      });
      const payBy =
        payByItemList.length === 0
          ? 0
          : this.priceList(payByItemList).reduce((pre, cur) => pre + cur);
      // 切り上げ処理にしてる
      const mustPay = Math.ceil(
        this.totalAmount / this.userList.length - payBy
      );

      return { userId: user.id, payBy: payBy, mustPay: mustPay };
    });
  }
}
</script>

<style>
</style>
