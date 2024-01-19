let local = window.location;

let id = window.frameElement?.parentElement?.parentElement.dataset.nodeId;

// 自定义web服务器; 如果是在本地运行, 则使用本地服务器
let url = local.protocol + `//`
        + local.hostname 
        + (local.port ? ':' + local.port : '');

export function fetch(link, options) {
   return window.fetch(url + link, options);
}

if (local.port === '5500') {
   url = "http://127.0.0.1:6806";
   id = '20240119165619-739g1w9';
}
   
export { 
   url, id
}