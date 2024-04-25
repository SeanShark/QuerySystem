import{D as _,H as N,r as p,q as B,w as P,J as f,b5 as $,N as o,L as s,M as I,Q as K,K as y,S as h,O as g,Y as w,b4 as L,R as c,P as k,T as j}from"./index.48789ced.js";import{Q as H,a as J,b as V,c as E}from"./QStepper.aaabed0a.js";import{Q as O}from"./QSpace.a9adfbc7.js";import{u as Y}from"./store.56a5cbb1.js";import"./QSlideTransition.00dc81e2.js";import"./use-panel.83ed09fb.js";import"./touch.3df10340.js";import"./axios.6b484fa5.js";const z={class:"q-pa-md row"},A={class:"q-py-md"},F={class:"row justify-center items-center"},G=["src"],W={class:"q-py-md"},X={class:"q-pt-md"},Z={class:"q-pb-md"},de={__name:"RegisterPage",setup(ee){const i=Y(),r=_({email:"",code:"",password:"",repeat_password:""}),M=N(),u=p(1),m=p(!0),v=p(!1),n=p(!1),D=p(null),U=p(null),q=p(null),R=p(null),x=p(null),l=_({hasError:!1,errorMsg:""}),C=d=>d.length>=8||"\u5BC6\u7801\u957F\u5EA6\u5E94\u8BE5\u81F3\u5C11\u4E3A8\u4F4D\u6570",S=[d=>d==r.password||"\u4E0E\u8F93\u5165\u7684\u5BC6\u7801\u4E0D\u4E00\u81F4"],Q=async()=>{var d,t;if(u.value===1){if(l.hasError=!1,e.hasError=!1,!r.email){l.errorMsg="\u8BF7\u8F93\u5165\u90AE\u7BB1\u5730\u5740",l.hasError=!0;return}e.state?e.Data.length===0?(e.hasError=!0,e.errorMsg="\u8BF7\u5B8C\u6210\u56FE\u5F62\u9A8C\u8BC1\u7801"):e.Data.length===4?(e.hasError=!0,e.errorMsg="\u56FE\u5F62\u9A8C\u8BC1\u7801\u9519\u8BEF"):(e.hasError=!0,e.errorMsg="\u56FE\u5F62\u9A8C\u8BC1\u7801\u957F\u5EA6\u4E3A4\u4F4D\u5B57\u7B26"):/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)?(v.value=!0,l.hasError=!1,n.value=!0,await i.axios.post("/user/signup",{email:r.email}).then(async b=>(n.value=!1,i.successTip(b.data.msg),x.value.next())).catch(b=>{l.errorMsg=b.response.data&&b.response.data.msg?b.response.data.msg:"\u672A\u77E5\u9519\u8BEF, \u8BF7\u91CD\u8BD5.",l.hasError=!0,n.value=!1}).finally(()=>{v.value=!1})):(l.errorMsg="\u975E\u6CD5\u90AE\u7BB1\u5730\u5740",l.hasError=!0)}else if(u.value===2)if(r.code.length===6)v.value=!0,l.hasError=!1,n.value=!0,await i.axios.post("/user/verifysignup",{email:r.email,code:r.code}).then(async a=>{a.data.status==="success"&&(i.successTip(a.data.msg),n.value=!1,x.value.next())}).catch(a=>{n.value=!1,i.failureTip(a.response.data.msg)}).finally(()=>{v.value=!1});else{n.value=!1,l.hasError=!0,l.errorMsg="\u9A8C\u8BC1\u7801\u4E3A6\u4F4D\u6570\u5B57";return}else l.hasError=!1,await((d=q.value)==null?void 0:d.validate())&&await((t=R.value)==null?void 0:t.validate())&&(n.value=!0,await i.axios.post("/user/setpassword",{email:r.email,code:r.code,password:r.password}).then(async a=>{a.data.status==="success"&&(n.value=!1,v.value=!0,i.mainTab="login",setTimeout(()=>{M.push("/index")},3e3),i.successTip(a.data.msg),i.successTip("3\u79D2\u540E\u81EA\u52A8\u8F6C\u5165\u767B\u5F55\u9875"))}).catch(a=>{n.value=!1,i.failureTip(a.response.data.msg)}))},e=_({Url:"",Data:"",hasError:!1,errorMsg:"",text:"",state:!0});B(async()=>{i.user?M.push("/"):T()});const T=()=>{e.state=!0,i.axios.get(`/user/captcha?${Math.random()}`).then(d=>{e.Url=`data:image/svg+xml;base64,${btoa(d.data.data)}`,e.text=d.headers.captcha.toLowerCase()})};return P(()=>e.Data,d=>{d.toLowerCase()===e.text?(e.state=!1,e.hasError=!1):e.state=!0}),(d,t)=>(f(),$("div",z,[o(H,{ref_key:"stepperRef",ref:x,modelValue:u.value,"onUpdate:modelValue":t[7]||(t[7]=a=>u.value=a),class:"fixed-center col-xs-12 col-md-6",color:"primary",animated:"","transition-next":"fade",contracted:I(i).isMobile,style:{"max-width":"600px"}},{navigation:s(()=>[o(J,{class:"row",on:""},{default:s(()=>[o(O),o(K,{color:"primary",label:u.value===3?"\u63D0  \u4EA4":"\u4E0B\u4E00\u6B65",disable:v.value,onClick:Q},null,8,["label","disable"])]),_:1})]),message:s(()=>[u.value===1?(f(),y(V,{key:0,class:"bg-indigo text-white q-px-lg"},{default:s(()=>[h(" \u8BF7\u8F93\u5165\u8981\u6CE8\u518C\u7684\u90AE\u7BB1\u5730\u5740\uFF1A ")]),_:1})):u.value===2?(f(),y(V,{key:1,class:"bg-indigo-5 text-white q-px-lg"},{default:s(()=>[h(" \u8BF7\u67E5\u6536\u90AE\u7BB1\u65B0\u90AE\u4EF6\uFF0C\u5E76\u8F93\u51656\u4F4D\u6CE8\u518C\u7801\uFF1A ")]),_:1})):(f(),y(V,{key:2,class:"bg-indigo-5 text-white q-px-lg"},{default:s(()=>[h(" \u8BF7\u8BBE\u7F6E\u81F3\u5C118\u4F4D\u7684\u5BC6\u7801\uFF1A ")]),_:1}))]),default:s(()=>[o(E,{name:1,title:"\u90AE\u7BB1\u5730\u5740",icon:"email",done:u.value>1,style:{"min-height":"200px"}},{default:s(()=>[g("div",A,[o(w,{ref_key:"emailRef",ref:D,modelValue:r.email,"onUpdate:modelValue":t[0]||(t[0]=a=>r.email=a),filled:"",type:"email",label:"\u90AE\u7BB1\u5730\u5740",class:"q-py-md","bottom-slots":"","hide-bottom-space":"",error:l.hasError,loading:n.value,onKeyup:L(Q,["enter"])},{before:s(()=>[o(c,{color:"teal",name:"mail"})]),error:s(()=>[h(k(l.errorMsg),1)]),_:1},8,["modelValue","error","loading","onKeyup"]),g("div",F,[o(w,{modelValue:e.Data,"onUpdate:modelValue":t[1]||(t[1]=a=>e.Data=a),class:"col-12",filled:"",error:e.hasError,label:"\u9A8C\u8BC1\u7801"},{before:s(()=>[e.state?(f(),y(c,{key:0,name:"lock",color:"grey"})):(f(),y(c,{key:1,name:"lock_open",color:"grey"}))]),after:s(()=>[g("div",{class:"q-pt-sm rounded-borders",onClick:T},[g("img",{src:e.Url,alt:"Captcha Image"},null,8,G)])]),error:s(()=>[h(k(e.errorMsg),1)]),append:s(()=>[e.state?j("",!0):(f(),y(c,{key:0,name:"done",color:"green"}))]),_:1},8,["modelValue","error"])])])]),_:1},8,["done"]),o(E,{name:2,title:"\u9A8C\u8BC1\u7801",icon:"key",done:u.value>2,style:{"min-height":"200px"}},{default:s(()=>[g("div",W,[o(w,{ref_key:"codeRef",ref:U,modelValue:r.code,"onUpdate:modelValue":t[2]||(t[2]=a=>r.code=a),filled:"",type:"text",label:"\u6CE8\u518C\u7801",class:"q-py-md","bottom-slots":"","hide-bottom-space":"",error:l.hasError,loading:n.value},{before:s(()=>[o(c,{color:"red",name:"key"})]),error:s(()=>[h(k(l.errorMsg),1)]),_:1},8,["modelValue","error","loading"])])]),_:1},8,["done"]),o(E,{name:3,title:"\u8BBE\u7F6E\u5BC6\u7801",icon:"password",style:{"min-height":"200px"}},{default:s(()=>[g("div",X,[o(w,{ref_key:"passwordRef",ref:q,modelValue:r.password,"onUpdate:modelValue":t[4]||(t[4]=a=>r.password=a),filled:"",type:m.value?"password":"text",label:"\u5BC6\u7801",class:"q-py-md","bottom-slots":"","hide-bottom-space":"",rules:[C]},{before:s(()=>[o(c,{name:"lock"})]),append:s(()=>[o(c,{name:m.value?"visibility_off":"visibility",class:"cursor-pointer",onClick:t[3]||(t[3]=a=>m.value=!m.value)},null,8,["name"])]),_:1},8,["modelValue","type","rules"])]),g("div",Z,[o(w,{ref_key:"repeatpwdRef",ref:R,modelValue:r.repeat_password,"onUpdate:modelValue":t[6]||(t[6]=a=>r.repeat_password=a),filled:"",type:m.value?"password":"text",label:"\u91CD\u590D\u5BC6\u7801",class:"q-py-md","bottom-slots":"","hide-bottom-space":"",rules:S},{before:s(()=>[o(c,{name:"lock"})]),append:s(()=>[o(c,{name:m.value?"visibility_off":"visibility",class:"cursor-pointer",onClick:t[5]||(t[5]=a=>m.value=!m.value)},null,8,["name"])]),_:1},8,["modelValue","type"])])]),_:1})]),_:1},8,["modelValue","contracted"])]))}};export{de as default};
