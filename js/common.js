import * as Hook from './hook.js';


function setWidth(width) {
   if (window.frameElement === null) return;
   window.frameElement.style.width = `${width}px`;
}

function setHeight(height) {
   if (window.frameElement === null) return;
   window.frameElement.style.height = `${height}px`;
}

function DateToString(timestamp, isDate = false) {
   let format = {
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
   }
   if (!isDate) {
      format = {
         ...format, 
         hour: '2-digit', 
         minute: '2-digit'
      }
   }
   return new Date(timestamp)
   .toLocaleString('zh-CN', format)
   .replace(/\//g, '-');
}

function createDiv() { return document.createElement("div"); }

function createKey(data) {
   let key = createDiv();
   key.className = "key";
   key.innerHTML = data;
   return key;
}

function createValue(data, classMod) {
   let value = createDiv();
   value.className = "value";

   if (Array.isArray(data)) {
   data.forEach(v => {
      let val = createDiv();
      val.innerHTML = v;

      classMod.forEach(e => {
         val.classList.add(e);
      })
      value.appendChild(val);
   })
   } else {
      let val = createDiv();
      val.innerHTML = data;

      classMod.forEach(e => {
         val.classList.add(e);
      })

      value.appendChild(val);
   }
   return value;
}

function checkVal(val) {
   return val === null || val === undefined || val.length === 0;
}

function createData(name, type, val) {
   let result = createDiv();
   result.className = "key-value-pair";
   let key = createKey(name)
   let value;
   
   switch(type) {
   case "mSelect": {
      value = createValue(val.map(e => e.content), ["Tag"])
   }
   break;
   case "date": {
      let dateString = DateToString(val.content, val.isNotTime);
      if (val.isNotEmpty2) {
         dateString += " ~ " + DateToString(val.content2, val.isNotTime);
      }
      value = createValue(dateString, ["Single"]);

   }
   break;
   case "mAsset": {
      let asset = val.map(e => {
         let link = document.createElement('a');
         link.href = Hook.url + '/' + e.content;
         link.target = '_blank';
         link.textContent = e.type + ":" + (e.name !== '' ? e.name : e.content);
         return link.outerHTML;
      });
      value = createValue(asset, ["Multiple"]);
   }
   break;
   case "checkbox": {
      let input = document.createElement('input');
      input.type = type;
      input.disabled = true;
      
      input = val.checked ? input.outerHTML.replace(">", " checked/>") : input.outerHTML;

      value = createValue(input, ["Single"]);
   }
   break;
   case "updated":
   case "created": {
      value = createValue(DateToString(val.content), ["Single"]);
   }
   break;
   case "relation": {
      if (checkVal(val.contents)) {
         return null;
      }
      value = createValue(val.contents, ["Multiple"])
   }
   break;
   case "rollup": {
      if (checkVal(val.contents)) {
         return null;
      }
      let asset = val.contents.map(e => {
         let type = e.type;
         if (type === 'number')
            return `${e[type].content}%`;
         else
            return e[type].content;
      });
      value = createValue(asset, ["Multiple"])
   }
   break;
   case "text": {
      if (checkVal(val.content)) {
         return null;
      }
      value = createValue(val.content, ["Multiple"])
   }
   break;
   default: 
      if (checkVal(val.content)) {
         return null;
      }
      value = createValue(val.content, ["Single"]);
   }

   result.appendChild(key);
   result.appendChild(value);
   return result;
}


export {
   setWidth,
   setHeight,
   DateToString,
   createData,
}