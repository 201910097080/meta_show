import * as Hook from './hook.js';


function setWidth(width) {
   if (window.frameElement === null) return;
   window.frameElement.style.width = `${width}px`;
}

function setHeight(height) {
   if (window.frameElement === null) return;
   window.frameElement.style.height = `${height}px`;
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
         link.href = Hook.url + '/' + e.content;
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


export {
   setWidth,
   setHeight,
   DateToString,
   createData,
}