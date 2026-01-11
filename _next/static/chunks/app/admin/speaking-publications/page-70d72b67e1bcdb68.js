(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[159],{2744:(e,t,a)=>{Promise.resolve().then(a.bind(a,8590))},8434:(e,t,a)=>{"use strict";let s,r;a.d(t,{Toaster:()=>ee,Ay:()=>et});var i,o=a(2115);let n={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,u=(e,t)=>{let a="",s="",r="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+o+";":s+="f"==i[1]?u(o,i):i+"{"+u(o,"k"==i[1]?"":t)+"}":"object"==typeof o?s+=u(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=u.p?u.p(i,o):i+":"+o+";")}return a+(t&&r?t+"{"+r+"}":r)+s},p={},m=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+m(e[a]);return t}return e};function g(e){let t,a,s=this||{},r=e.call?e(s.p):e;return((e,t,a,s,r)=>{var i;let o=m(e),n=p[o]||(p[o]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(o));if(!p[n]){let t=o!==e?e:(e=>{let t,a,s=[{}];for(;t=l.exec(e.replace(d,""));)t[4]?s.shift():t[3]?(a=t[3].replace(c," ").trim(),s.unshift(s[0][a]=s[0][a]||{})):s[0][t[1]]=t[2].replace(c," ").trim();return s[0]})(e);p[n]=u(r?{["@keyframes "+n]:t}:t,a?"":"."+n)}let g=a&&p.g?p.g:null;return a&&(p.g=p[n]),i=p[n],g?t.data=t.data.replace(g,i):-1===t.data.indexOf(i)&&(t.data=s?i+t.data:t.data+i),n})(r.unshift?r.raw?(t=[].slice.call(arguments,1),a=s.p,r.reduce((e,s,r)=>{let i=t[r];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+s+(null==i?"":i)},"")):r.reduce((e,t)=>Object.assign(e,t&&t.call?t(s.p):t),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(s.target),s.g,s.o,s.k)}g.bind({g:1});let f,h,x,y=g.bind({k:1});function b(e,t){let a=this||{};return function(){let s=arguments;function r(i,o){let n=Object.assign({},i),l=n.className||r.className;a.p=Object.assign({theme:h&&h()},n),a.o=/ *go\d+/.test(l),n.className=g.apply(a,s)+(l?" "+l:""),t&&(n.ref=o);let d=e;return e[0]&&(d=n.as||e,delete n.as),x&&d[0]&&x(n),f(d,n)}return t?t(r):r}}var v=(e,t)=>"function"==typeof e?e(t):e,j=(s=0,()=>(++s).toString()),w=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},N="default",k=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return k(e,{type:+!!e.toasts.find(e=>e.id===s.id),toast:s});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},E=[],C={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},A={},S=(e,t=N)=>{A[t]=k(A[t]||C,e),E.forEach(([e,a])=>{e===t&&a(A[t])})},D=e=>Object.keys(A).forEach(t=>S(e,t)),$=(e=N)=>t=>{S(t,e)},O={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},P=e=>(t,a)=>{let s,r=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||j()}))(t,e,a);return $(r.toasterId||(s=r.id,Object.keys(A).find(e=>A[e].toasts.some(e=>e.id===s))))({type:2,toast:r}),r.id},T=(e,t)=>P("blank")(e,t);T.error=P("error"),T.success=P("success"),T.loading=P("loading"),T.custom=P("custom"),T.dismiss=(e,t)=>{let a={type:3,toastId:e};t?$(t)(a):D(a)},T.dismissAll=e=>T.dismiss(void 0,e),T.remove=(e,t)=>{let a={type:4,toastId:e};t?$(t)(a):D(a)},T.removeAll=e=>T.remove(void 0,e),T.promise=(e,t,a)=>{let s=T.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?v(t.success,e):void 0;return r?T.success(r,{id:s,...a,...null==a?void 0:a.success}):T.dismiss(s),e}).catch(e=>{let r=t.error?v(t.error,e):void 0;r?T.error(r,{id:s,...a,...null==a?void 0:a.error}):T.dismiss(s)}),e};var _=1e3,I=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,z=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,L=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,M=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${I} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${z} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${L} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,F=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,R=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${F} 1s linear infinite;
`,H=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,J=y`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,U=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${H} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${J} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,q=b("div")`
  position: absolute;
`,B=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,W=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Y=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${W} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Z=({toast:e})=>{let{icon:t,type:a,iconTheme:s}=e;return void 0!==t?"string"==typeof t?o.createElement(Y,null,t):t:"blank"===a?null:o.createElement(B,null,o.createElement(R,{...s}),"loading"!==a&&o.createElement(q,null,"error"===a?o.createElement(M,{...s}):o.createElement(U,{...s})))},G=b("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,K=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Q=o.memo(({toast:e,position:t,style:a,children:s})=>{let r=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[s,r]=w()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(Z,{toast:e}),n=o.createElement(K,{...e.ariaProps},v(e.message,e));return o.createElement(G,{className:e.className,style:{...r,...a,...e.style}},"function"==typeof s?s({icon:i,message:n}):o.createElement(o.Fragment,null,i,n))});i=o.createElement,u.p=void 0,f=i,h=void 0,x=void 0;var V=({id:e,className:t,style:a,onHeightUpdate:s,children:r})=>{let i=o.useCallback(t=>{if(t){let a=()=>{s(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return o.createElement("div",{ref:i,className:t,style:a},r)},X=g`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:s,children:r,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:a,pausedAt:s}=((e={},t=N)=>{let[a,s]=(0,o.useState)(A[t]||C),r=(0,o.useRef)(A[t]);(0,o.useEffect)(()=>(r.current!==A[t]&&s(A[t]),E.push([t,s]),()=>{let e=E.findIndex(([e])=>e===t);e>-1&&E.splice(e,1)}),[t]);let i=a.toasts.map(t=>{var a,s,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||O[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...a,toasts:i}})(e,t),r=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=_)=>{if(r.has(e))return;let a=setTimeout(()=>{r.delete(e),n({type:4,toastId:e})},t);r.set(e,a)},[]);(0,o.useEffect)(()=>{if(s)return;let e=Date.now(),r=a.map(a=>{if(a.duration===1/0)return;let s=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(s<0){a.visible&&T.dismiss(a.id);return}return setTimeout(()=>T.dismiss(a.id,t),s)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[a,s,t]);let n=(0,o.useCallback)($(t),[t]),l=(0,o.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),d=(0,o.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,o.useCallback)(()=>{s&&n({type:6,time:Date.now()})},[s,n]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:s=!1,gutter:r=8,defaultPosition:i}=t||{},o=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...s?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+r,0)},[a]);return(0,o.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=r.get(e.id);t&&(clearTimeout(t),r.delete(e.id))}})},[a,i]),{toasts:a,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:u}}})(a,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(a=>{let i,n,l=a.position||t,d=c.calculateOffset(a,{reverseOrder:e,gutter:s,defaultPosition:t}),u=(i=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:w()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return o.createElement(V,{id:a.id,key:a.id,onHeightUpdate:c.updateHeight,className:a.visible?X:"",style:u},"custom"===a.type?v(a.message,a):r?r(a):o.createElement(Q,{toast:a,position:l}))}))},et=T},8590:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>o});var s=a(5155),r=a(2115),i=a(8434);function o(){let[e,t]=(0,r.useState)([]),[a,o]=(0,r.useState)([]),[n,l]=(0,r.useState)(!0),[d,c]=(0,r.useState)("idle"),u=(0,r.useRef)(null),[p,m]=(0,r.useState)({title:"",event:"",date:"",location:"",type:"talk"}),[g,f]=(0,r.useState)({title:"",journal:"",date:"",authors:"",link:""}),[h,x]=(0,r.useState)(null);(0,r.useEffect)(()=>(y(),()=>{u.current&&u.current.abort()}),[]);let y=async()=>{u.current&&u.current.abort(),u.current=new AbortController;try{let e=await fetch("/api/speaking-publications",{signal:u.current.signal}),a=await e.json();t(a.speakingEngagements||[]),o(a.publications||[])}catch(e){if(e instanceof Error&&"AbortError"===e.name)return;console.error("Error fetching data:",e)}finally{l(!1)}},b=async s=>{s.preventDefault(),c("saving");let r=new AbortController;try{let s=await fetch("/api/speaking-publications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({speakingEngagements:e,publications:a}),signal:r.signal});if(!s.ok)throw Error("Failed to save");let n=await s.json();t(n.data.speakingEngagements),o(n.data.publications),c("success"),i.Ay.success("Speaking & Publications saved successfully!",{duration:3e3}),setTimeout(()=>c("idle"),3e3)}catch(e){if(e instanceof Error&&"AbortError"===e.name)return;console.error("Error saving data:",e),c("error"),setTimeout(()=>c("idle"),3e3)}};return n?(0,s.jsx)("div",{className:"p-8",children:"Loading..."}):(0,s.jsxs)("div",{className:"p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto",children:[(0,s.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold mb-6 lg:mb-8",children:"Speaking & Publications Management"}),(0,s.jsxs)("form",{onSubmit:b,className:"space-y-8",children:[(0,s.jsxs)("div",{className:"bg-gray-800 p-6 rounded-lg",children:[(0,s.jsx)("h2",{className:"text-2xl font-semibold mb-6",children:"Speaking Engagements"}),(0,s.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6",children:[(0,s.jsx)("input",{type:"text",placeholder:"Title",className:"p-2 sm:p-3 bg-gray-700 rounded text-sm",value:p.title,onChange:e=>m({...p,title:e.target.value})}),(0,s.jsx)("input",{type:"text",placeholder:"Event",className:"p-2 sm:p-3 bg-gray-700 rounded text-sm",value:p.event,onChange:e=>m({...p,event:e.target.value})}),(0,s.jsx)("input",{type:"text",placeholder:"Date (e.g., January 2024)",className:"p-2 sm:p-3 bg-gray-700 rounded text-sm",value:p.date,onChange:e=>m({...p,date:e.target.value})}),(0,s.jsx)("input",{type:"text",placeholder:"Location",className:"p-2 sm:p-3 bg-gray-700 rounded text-sm",value:p.location,onChange:e=>m({...p,location:e.target.value})}),(0,s.jsxs)("select",{className:"p-2 sm:p-3 bg-gray-700 rounded text-sm",value:p.type,onChange:e=>m({...p,type:e.target.value}),children:[(0,s.jsx)("option",{value:"talk",children:"Talk"}),(0,s.jsx)("option",{value:"workshop",children:"Workshop"}),(0,s.jsx)("option",{value:"panel",children:"Panel"})]}),(0,s.jsx)("button",{type:"button",onClick:()=>{t([...e,{...p,id:Date.now()}]),m({title:"",event:"",date:"",location:"",type:"talk"})},className:"px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium",children:"Add Engagement"})]}),(0,s.jsx)("div",{className:"space-y-4",children:e.map(a=>(0,s.jsxs)("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-700 rounded",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("h4",{className:"font-medium",children:a.title}),(0,s.jsxs)("p",{className:"text-sm text-gray-300",children:[a.event," • ",a.date]})]}),(0,s.jsx)("button",{type:"button",onClick:()=>{var s;return s=a.id,void t(e.filter(e=>e.id!==s))},className:"text-red-400 hover:text-red-300",children:"Remove"})]},a.id))})]}),(0,s.jsxs)("div",{className:"bg-gray-800 p-6 rounded-lg",children:[(0,s.jsx)("h2",{className:"text-2xl font-semibold mb-6",children:"Publications"}),(0,s.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6",children:[(0,s.jsx)("input",{type:"text",placeholder:"Title",className:"p-2 sm:p-3 bg-gray-700 rounded text-sm",value:g.title,onChange:e=>f({...g,title:e.target.value})}),(0,s.jsx)("input",{type:"text",placeholder:"Journal/Conference",className:"p-2 sm:p-3 bg-gray-700 rounded text-sm",value:g.journal,onChange:e=>f({...g,journal:e.target.value})}),(0,s.jsx)("input",{type:"text",placeholder:"Date (e.g., 2024)",className:"p-2 sm:p-3 bg-gray-700 rounded text-sm",value:g.date,onChange:e=>f({...g,date:e.target.value})}),(0,s.jsx)("input",{type:"text",placeholder:"Authors",className:"p-2 sm:p-3 bg-gray-700 rounded text-sm",value:g.authors,onChange:e=>f({...g,authors:e.target.value})}),(0,s.jsx)("input",{type:"url",placeholder:"Link to publication",className:"p-2 sm:p-3 bg-gray-700 rounded text-sm sm:col-span-2",value:g.link,onChange:e=>f({...g,link:e.target.value})}),(0,s.jsx)("button",{type:"button",onClick:()=>{o([...a,{...g,id:Date.now()}]),f({title:"",journal:"",date:"",authors:"",link:""})},className:"px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium text-sm sm:col-span-2",children:"Add Publication"})]}),(0,s.jsx)("div",{className:"space-y-4",children:a.map(e=>(0,s.jsxs)("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-700 rounded",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("h4",{className:"font-medium",children:e.title}),(0,s.jsxs)("p",{className:"text-sm text-gray-300",children:[e.journal," • ",e.date]})]}),(0,s.jsx)("button",{type:"button",onClick:()=>{var t;return t=e.id,void o(a.filter(e=>e.id!==t))},className:"text-red-400 hover:text-red-300",children:"Remove"})]},e.id))})]}),(0,s.jsxs)("div",{className:"flex flex-col sm:flex-row justify-between items-center gap-4",children:[(0,s.jsxs)("div",{children:["saving"===d&&(0,s.jsx)("span",{className:"text-yellow-400",children:"Saving..."}),"success"===d&&(0,s.jsx)("span",{className:"text-green-400",children:"Saved successfully!"}),"error"===d&&(0,s.jsx)("span",{className:"text-red-400",children:"Error saving. Please try again."})]}),(0,s.jsx)("button",{type:"submit",className:"px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium",disabled:"saving"===d,children:"Save All Changes"})]})]})]})}}},e=>{e.O(0,[441,794,358],()=>e(e.s=2744)),_N_E=e.O()}]);