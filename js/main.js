import { config } from './config.js';
import * as Hook from './hook.js';
import * as Common from './common.js';

let meta = document.getElementsByClassName("metadata-container")[0];

(function Init() {
   Common.setWidth(2000);
   getData();
})();

function processingData(data) {
   data.forEach(e => {
      let key   = e.key.name;
      let type  = e.values[0].type
      if (type === 'select') type = 'mSelect'
      let value = e.values[0][type]
      meta.appendChild(Common.createData(key, type, value))
   })
   Common.setHeight(document.body.clientHeight + 16)
}

async function getSql() {
   let result = null;
   let id = Hook.id;
   let data = {
	     stmt: `SELECT root_id FROM blocks WHERE id = '${id}'`
	  };
   
   await Hook.fetch("/api/query/sql", {
	  method: 'POST',
	  body: JSON.stringify(data),
      headers: {
         Authorization: `Token ${config.token}`,
      }
   })
   .then(resp => resp.json())
   .then(data => {
      if (data.data.length === 0) return;
      result = data.data[0].root_id;
   })
   .catch(error => {
      console.log("Fetch error:", error);
   });
   return result;
}

async function getData() {
   let data = { id: await getSql() }
   if (data.id === null) {
      console.log("Sql is not found id, please flash page.");
      return;
   }

   Hook.fetch("/api/av/getAttributeViewKeys", {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
         Authorization: `Token ${config.token}`,
      }
   })
   .then(resp => resp.json())
   .then(data => {
      processingData(data.data[0].keyValues)
   })
   .catch(error => {
      console.error("Fetch error:", error);
   });

};