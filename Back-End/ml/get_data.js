import { getData } from "../app";

const params = new URLSearchParams(window.location.search);
const place_id = params.get('id');

let obj = {table: []};
obj.table.push(getData(place_id));
var json = JSON.stringify(obj);

var fs = require('fs');
fs.writeFile('data.json', json, 'utf8', callback);

