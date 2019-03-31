export default class Storage {
    getData(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    setData(key, data) {
        // JSON形式で保存
        var jsonData = JSON.stringify(data);
        localStorage.setItem(key, jsonData);
    }
}
