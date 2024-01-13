import { config } from './config.js';

function createDiv() { return document.createElement("div"); }

function createKey(data) {
   let key = createDiv();
   key.className = "key";
   key.innerHTML = data;
   return key;
}

function createValue(mod, data) {
   let value = createDiv();
   if (mod === 1) {
   value.className = "value-single-line";
   } else if (mod === 2) {
   value.className = "value-multiple";
   }
   

   if (Array.isArray(data)) {
   data.forEach(v => {
      let val = createDiv();
      val.className = "value";
      val.innerHTML = v;

      value.appendChild(val);
   })
   } else {
   let val = createDiv();
   val.className = "value";
   val.innerHTML = data;

   value.appendChild(val);
   }
   return value;
}

function DateToString(timestamp) {
   return new Date(timestamp)
      .toLocaleString('zh-CN', {
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit'
      })
      .replace(/\//g, '-');
}

function createData(name, type, val) {
   let result = createDiv();
   result.className = "key-value-pair";
   let key = createKey(name)
   let value;
   
   switch(type) {
   case "mSelect": {
      value = createValue(1, val.map(e => e.content))
   }
   break;
   case "date": {
      let dateString = DateToString(val.content);
      if (val.hasOwnProperty("content2")) {
         dateString += " ~ " + DateToString(val.content2);
      }
      value = createValue(1, dateString);

   }
   break;
   case "mAsset": {
      let asset = val.map(e => {
         let link = document.createElement('a');
         link.href = e.content;
         link.target = '_blank';
         link.textContent = e.type + ":" + (e.name !== '' ? e.name : e.content);
         return link.outerHTML;
      });
      value = createValue(2, asset);
   }
   break;
   case "checkbox": {
      let input = document.createElement('input');
      input.type = type;
      input.disabled = true;
      
      input = val.checked ? input.outerHTML.replace(">", " checked/>") : input.outerHTML;
      
      console.log(input)

      value = createValue(1, input);
   }
   break;
   case "updated":
   case "created": {
      value = createValue(1, DateToString(val.content));
   }
   break;
   case "relation": {
      value = createValue(2, val.contents)
   }
   break;
   default: 
      value = createValue(1, val.content);
   }

   result.appendChild(key);
   result.appendChild(value);
   return result;
}

async function getSql() {
   let result = null;
   let id = window.frameElement?.parentElement?.parentElement.dataset.nodeId;
   let data = {
	     stmt: `SELECT root_id FROM blocks WHERE id = '${id}'`
	  };
   
   await fetch("/api/query/sql", {
	  method: 'POST',
	  body: JSON.stringify(data),
      headers: {
         Authorization: `Token ${config.token}`,
      }
   })
   .then(resp => resp.json())
   .then(data => {
      result = data.data[0].root_id;
   })
   return result;
}


(async () => {
   let meta = document.getElementsByClassName("metadata-container")[0];
   let data = {
   id: await getSql()
   }

   fetch("/api/av/getAttributeViewKeys", {
   body: JSON.stringify(data),
   method: 'POST',
   headers: {
         Authorization: `Token ${config.token}`,
   }
   })
   .then(response => {
   if (!response.ok) {
      throw new Error("Network response was not ok");
   }
   return response.json();
   })
   .then(data => {
   console.log(data.data[0].keyValues); // 打印响应数据
   data.data[0].keyValues.forEach(e => {
      let key   = e.key.name;
      let type  = e.values[0].type
      if (type === 'select') type = 'mSelect'
      let value = e.values[0][type]
      console.log(key, type, value)
      meta.appendChild(createData(key, type, value))

   })
   })
   .catch(error => {
   console.error("Fetch error:", error);
   });

})();