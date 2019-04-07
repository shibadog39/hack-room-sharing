<template>
  <v-container>
    <router-link to="/">精算</router-link>
    <v-btn small class="signout" @click="signOut">ログアウト</v-btn>
    <h2 class="font-weight-bold mb-3">永谷マンション901号室</h2>
    <div>
      <h3>精算したよの記録</h3>
      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>モノ</th>
            <th>人</th>
            <th>値段</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in completedItems" :key="index">
            <td>{{item.date}}</td>
            <td>{{item.name}}</td>
            <td>{{getUserById(item.userId).name}}</td>
            <td>{{item.price}}</td>
            <td>
              <v-btn
                flat
                fab
                small
                color="error"
                class="table-btn"
                @click.prevent="backToYet(index)"
              >戻す</v-btn>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </v-container>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import firebase from "firebase";

@Component
export default class History extends Vue {
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
  created() {
    this.yetItemRef = firebase.database().ref("yetItem/");
    this.completedItemRef = firebase.database().ref("completedItem/");
    this.yetItemRef.on("value", snapshot => {
      if (snapshot) this.$store.commit("updateYetItemFromDB", snapshot.val());
    });
    this.completedItemRef.on("value", snapshot => {
      if (snapshot)
        this.$store.commit("updateCompletedItemFromDB", snapshot.val());
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

  private backToYet(index: number) {
    this.pushYetItem(this.completedItems[index]);
    this.removeCompletedItem(index);
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

  private get yetItemFromDB(): any {
    return this.$store.state.yetItemFromDB;
  }

  private get completedItemFromDB(): any {
    return this.$store.state.completedItemFromDB;
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

.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 2rem;
  background-color: #fff;
}

thead,
tbody,
thead,
tr,
th {
  width: auto;
  font-weight: 400;
  color: #080808;
  vertical-align: bottom;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
td {
  text-align: center;
}

.table-btn {
  width: 15px;
  height: 15px;
}

.form {
  padding-top: 10px;
}

.totalAmount {
  padding-top: 10px;
}
</style>
