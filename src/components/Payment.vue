<template>
  <v-container>
    <v-btn small class="signout" @click="signOut">ログアウト</v-btn>
    <h1 class="display-2 font-weight-bold mb-3">永谷マンション901号室(グループ名)</h1>
    <div>
      <h3>払っといたよの記録</h3>
      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>モノ・コト</th>
            <th>人</th>
            <th>値段</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in yetItems" :key="index">
            <td>{{item.date}}</td>
            <td>{{item.name}}</td>
            <td>{{getUserById(item.userId).name}}</td>
            <td>{{item.price}}</td>
            <td>
              <v-btn flat small color="success" @click.prevent="settleUp(index)">個別に精算した！</v-btn>
            </td>
            <td>
              <v-btn flat small color="error" @click.prevent="deleteYetItem(index)">削除</v-btn>
            </td>
          </tr>
        </tbody>
      </table>
      <span>総額 {{totalAmount}}円</span>
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
            <v-btn small color="info" @click.prevent="addYetItem">add</v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </div>
    <div>
      <h3>精算しようー</h3>
      <template v-if="yetItems.length>0">
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
            </tr>
          </tbody>
        </table>
        <v-btn flat small color="success" @click.prevent="settleUpAll">全部精算した！</v-btn>
      </template>
      <template v-else>
        <span>貸し借りなしだよパーフェクト！</span>
      </template>
    </div>
    <div>
      <h3>精算したよの記録</h3>
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
          <tr v-for="(item, index) in completedItems" :key="index">
            <td>{{item.date}}</td>
            <td>{{item.name}}</td>
            <td>{{getUserById(item.userId).name}}</td>
            <td>{{item.price}}</td>
            <td>
              <v-btn flat small color="error" @click.prevent="backToYet(index)">未精算に戻す</v-btn>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr>
    <!-- <span>debug</span>
    <pre>{{ $data }}</pre> -->
  </v-container>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import firebase from "firebase";

@Component({
  filters: {
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
  private yetItemRef: firebase.database.Reference | null = null;
  private completedItemRef: firebase.database.Reference | null = null;
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
  private yetItemFromDB: any = null;
  private completedItemFromDB: any = null;
  private newItem: any = {
    name: "",
    userId: this.userList[0].id,
    price: 0,
    date: this.formatDate(new Date())
  };
  private rules: any = {
    required: (value: any) => !!value || "入力必須です."
  };

  created() {
    this.yetItemRef = firebase.database().ref("yetItem/");
    this.completedItemRef = firebase.database().ref("completedItem/");
    this.yetItemRef.on("value", snapshot => {
      if (snapshot) this.yetItemFromDB = snapshot.val();
    });
    this.completedItemRef.on("value", snapshot => {
      if (snapshot) this.completedItemFromDB = snapshot.val();
    });
  }

  signOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.$router.push("/signin");
      });
  }

  /**
   * addYetItem
   */
  private addYetItem() {
    if (this.validate()) {
      const newItem = Object.assign({}, this.newItem);
      // firebaseに保存
      this.pushYetItem(newItem);
      (this.$refs.form as any).reset();
    }
  }

  /**
   * deleteYetItem
   */
  private deleteYetItem(index: number) {
    if (confirm("Are you sure?")) {
      // firebaseから削除
      this.removeYetItem(index);
    }
  }

  private settleUp(index: number) {
    this.pushCompletedItem(this.yetItems[index]);
    this.removeYetItem(index);
  }
  private settleUpAll() {
    if (this.yetItems.length === 0) return;
    this.yetItems.forEach((item: any) => this.pushCompletedItem(item));
    if (this.yetItemRef) this.yetItemRef.remove();
  }
  private backToYet(index: number) {
    this.pushYetItem(this.completedItems[index]);
    this.removeCompletedItem(index);
  }

  private validate(): boolean {
    return (this.$refs.form as any).validate();
  }

  private getUserById(userId: number): object {
    const user = this.userList.find(user => {
      return user.id === userId;
    });
    if (!user)
      throw new Error("getUserById: Cannot find user (ID:" + userId + ")");
    return user;
  }
  private priceList(itemList: any[]): number[] {
    return itemList.map(item => {
      return item.price;
    });
  }
  private formatDate(date: Date): string {
    const m = ("00" + (date.getMonth() + 1)).slice(-2);
    const d = ("00" + date.getDate()).slice(-2);
    return m + "/" + d;
  }

  private get yetItems(): any {
    return this.yetItemFromDB ? Object.values(this.yetItemFromDB) : [];
  }

  private get completedItems() {
    return this.completedItemFromDB
      ? Object.values(this.completedItemFromDB)
      : [];
  }

  private get totalAmount(): number {
    if (this.yetItems.length === 0) return 0;
    return this.priceList(this.yetItems).reduce((pre, cur) => {
      return pre + cur;
    });
  }

  private get paymentResult(): any[] {
    return this.userList.map(user => {
      const userItemList = this.yetItems.filter((item: any) => {
        return item.userId === user.id;
      });
      const payBy =
        userItemList.length === 0
          ? 0
          : this.priceList(userItemList).reduce((pre, cur) => pre + cur);
      // 四捨五入するか迷う
      const mustPay = this.totalAmount / this.userList.length - payBy;

      return { userId: user.id, payBy: payBy, mustPay: mustPay };
    });
  }

  private pushYetItem(Item: any) {
    if (this.yetItemRef) this.yetItemRef.push(Item);
  }

  private pushCompletedItem(Item: any) {
    if (this.completedItemRef) this.completedItemRef.push(Item);
  }

  private removeYetItem(index: number) {
    firebase
      .database()
      .ref("yetItem/" + Object.keys(this.yetItemFromDB)[index])
      .remove();
  }

  private removeCompletedItem(index: number) {
    firebase
      .database()
      .ref("completedItem/" + Object.keys(this.completedItemFromDB)[index])
      .remove();
  }
}
</script>

<style scoped>
.signout {
  float: right;
}
</style>
