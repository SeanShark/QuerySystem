import{D as _,H as B,r as p,q as L,w as P,J as f,b4 as I,N as l,L as s,M as U,V as $,Q as H,K as g,S as y,O as h,Y as w,R as c,P as k,T as j}from"./index.df915bfd.js";import{Q as z,a as F,b as V,c as E}from"./QStepper.e7b3a6c7.js";import{Q as J}from"./QSpace.bcc7b29e.js";import{u as K}from"./store.d65acf3a.js";import"./QSlideTransition.e5e50192.js";import"./use-panel.097a7f51.js";import"./touch.3df10340.js";import"./axios.7331a07d.js";const O={class:"q-pa-md row"},Y={class:"q-py-md"},A={class:"row justify-center items-center"},G=["innerHTML"],W={class:"q-py-md"},X={class:"q-pt-md"},Z={class:"q-pb-md"},de={__name:"ForgotPage",setup(ee){const n=K(),o=_({email:"",code:"",password:"",repeat_password:""}),M=B(),u=p(1),m=p(!0),v=p(!1),d=p(!1),D=p(null),S=p(null),q=p(null),R=p(null),t=_({hasError:!1,errorMsg:""}),b=p(null),T=i=>i.length>=8||"\u5BC6\u7801\u957F\u5EA6\u5E94\u8BE5\u81F3\u5C11\u4E3A8\u4F4D\u6570",C=[i=>i==o.password||"\u4E0E\u8F93\u5165\u7684\u5BC6\u7801\u4E0D\u4E00\u81F4"],N=async()=>{var i,r;if(u.value===1){if(t.hasError=!1,e.hasError=!1,!o.email){t.errorMsg="\u8BF7\u8F93\u5165\u90AE\u7BB1\u5730\u5740",t.hasError=!0;return}e.state?e.Data.length===0?(e.hasError=!0,e.errorMsg="\u8BF7\u5148\u5B8C\u6210\u56FE\u5F62\u9A8C\u8BC1\u7801"):e.Data.length===4?(e.hasError=!0,e.errorMsg="\u56FE\u5F62\u9A8C\u8BC1\u7801\u9519\u8BEF"):(e.hasError=!0,e.errorMsg="\u56FE\u5F62\u9A8C\u8BC1\u7801\u957F\u5EA6\u4E3A4\u4F4D\u5B57\u7B26"):/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.email)?(v.value=!0,t.hasError=!1,d.value=!0,await n.axios.post("/user/forgot",{email:o.email}).then(async()=>(d.value=!1,n.successTip("\u9A8C\u8BC1\u7801\u5DF2\u53D1\u81F3\u60A8\u90AE\u7BB1\uFF0C\u8BF7\u67E5\u6536"),b.value.next())).catch(x=>{t.errorMsg=x.response.data&&x.response.data.msg?x.response.data.msg:"\u672A\u77E5\u9519\u8BEF, \u8BF7\u91CD\u8BD5.",t.hasError=!0,d.value=!1}).finally(()=>{v.value=!1})):(t.hasError=!0,t.errorMsg="\u975E\u6CD5\u90AE\u7BB1\u5730\u5740")}else u.value===2?o.code.length===6?(v.value=!0,t.hasError=!1,d.value=!0,await n.axios.post("/user/verifyforgotcode",{email:o.email,code:o.code}).then(async a=>{a.data.status==="success"&&(n.successTip(a.data.msg),d.value=!1,b.value.next())}).catch(a=>{d.value=!1,t.hasError=!0,t.errorMsg=a.response.data.msg}).finally(()=>{v.value=!1})):(d.value=!1,t.hasError=!0,t.errorMsg="\u9A8C\u8BC1\u7801\u4E3A6\u4F4D\u6570\u5B57"):(t.hasError=!1,await((i=q.value)==null?void 0:i.validate())&&await((r=R.value)==null?void 0:r.validate())&&(d.value=!0,await n.axios.post("/user/resetpassword",{email:o.email,code:o.code,password:o.password}).then(async a=>{a.data.status==="success"&&(d.value=!1,v.value=!0,setTimeout(()=>{M.push("/index")},3e3),n.successTip(a.data.msg),n.successTip("3\u79D2\u4E4B\u540E\u81EA\u52A8\u8F6C\u5165\u767B\u5F55\u9875"))}).catch(a=>{d.value=!1,t.hasError=!0,t.errorMsg=a.response.data.msg})))},e=_({Url:"",Data:"",hasError:!1,errorMsg:"",text:"",state:!0});L(async()=>{Q(),localStorage.getItem("token")!==null&&await n.verifyUser().then(()=>{n.user&&M.push("/")})});const Q=()=>{e.state=!0,n.axios.get(`/user/captcha?${Math.random()}`).then(i=>{e.Url=i.data.data,e.text=i.headers.captcha.toLowerCase()})};return P(()=>e.Data,i=>{i.toLowerCase()===e.text?(e.state=!1,e.hasError=!1):e.state=!0}),(i,r)=>(f(),I("div",O,[l(z,{ref_key:"stepperRef",ref:b,modelValue:u.value,"onUpdate:modelValue":r[7]||(r[7]=a=>u.value=a),class:"fixed-center",color:"primary",animated:"","transition-next":"fade",contracted:U(n).isMobile,style:$(U(n).isMobile?"width: 100%;":"width: 600px;")},{navigation:s(()=>[l(F,{class:"row",on:""},{default:s(()=>[l(J),l(H,{color:"primary",label:u.value===3?"\u63D0  \u4EA4":"\u4E0B\u4E00\u6B65",disable:v.value,onClick:N},null,8,["label","disable"])]),_:1})]),message:s(()=>[u.value===1?(f(),g(V,{key:0,class:"bg-blue-grey-6 text-white q-px-lg"},{default:s(()=>[y(" \u8BF7\u8F93\u5165\u90AE\u7BB1\u5730\u5740\uFF1A ")]),_:1})):u.value===2?(f(),g(V,{key:1,class:"bg-blue-grey-6 text-white q-px-lg"},{default:s(()=>[y(" \u8BF7\u67E5\u6536\u90AE\u7BB1\u65B0\u90AE\u4EF6\uFF0C\u5E76\u8F93\u51656\u4F4D\u91CD\u7F6E\u7801\uFF1A ")]),_:1})):(f(),g(V,{key:2,class:"bg-blue-grey-6 text-white q-px-lg"},{default:s(()=>[y(" \u8BF7\u8BBE\u7F6E\u65B0\u5BC6\u7801\uFF1A ")]),_:1}))]),default:s(()=>[l(E,{name:1,title:"\u90AE\u7BB1\u5730\u5740",icon:"email",done:u.value>1,style:{"min-height":"200px"}},{default:s(()=>[h("div",Y,[l(w,{ref_key:"emailRef",ref:D,modelValue:o.email,"onUpdate:modelValue":r[0]||(r[0]=a=>o.email=a),filled:"",type:"email",label:"\u90AE\u7BB1\u5730\u5740",class:"q-py-md","bottom-slots":"","hide-bottom-space":"",error:t.hasError,loading:d.value},{before:s(()=>[l(c,{color:"teal",name:"mail"})]),error:s(()=>[y(k(t.errorMsg),1)]),_:1},8,["modelValue","error","loading"]),h("div",A,[l(w,{modelValue:e.Data,"onUpdate:modelValue":r[1]||(r[1]=a=>e.Data=a),class:"col-12",filled:"",error:e.hasError,label:"\u9A8C\u8BC1\u7801"},{before:s(()=>[e.state?(f(),g(c,{key:0,name:"lock",color:"grey"})):(f(),g(c,{key:1,name:"lock_open",color:"grey"}))]),after:s(()=>[h("div",{class:"q-pt-sm rounded-borders",onClick:Q,innerHTML:e.Url},null,8,G)]),error:s(()=>[y(k(e.errorMsg),1)]),append:s(()=>[e.state?j("",!0):(f(),g(c,{key:0,name:"done",color:"green"}))]),_:1},8,["modelValue","error"])])])]),_:1},8,["done"]),l(E,{name:2,title:"\u9A8C\u8BC1\u7801",icon:"key",done:u.value>2,style:{"min-height":"200px"}},{default:s(()=>[h("div",W,[l(w,{ref_key:"codeRef",ref:S,modelValue:o.code,"onUpdate:modelValue":r[2]||(r[2]=a=>o.code=a),filled:"",type:"text",label:"\u91CD\u7F6E\u7801",class:"q-py-md","bottom-slots":"","hide-bottom-space":"",error:t.hasError,loading:d.value},{before:s(()=>[l(c,{color:"red",name:"key"})]),error:s(()=>[y(k(t.errorMsg),1)]),_:1},8,["modelValue","error","loading"])])]),_:1},8,["done"]),l(E,{name:3,title:"\u91CD\u7F6E\u5BC6\u7801",icon:"password",style:{"min-height":"200px"}},{default:s(()=>[h("div",X,[l(w,{ref_key:"passwordRef",ref:q,modelValue:o.password,"onUpdate:modelValue":r[4]||(r[4]=a=>o.password=a),filled:"",type:m.value?"password":"text",label:"\u5BC6\u7801",class:"q-py-md","bottom-slots":"","hide-bottom-space":"",rules:[T]},{before:s(()=>[l(c,{name:"lock"})]),append:s(()=>[l(c,{name:m.value?"visibility_off":"visibility",class:"cursor-pointer",onClick:r[3]||(r[3]=a=>m.value=!m.value)},null,8,["name"])]),_:1},8,["modelValue","type","rules"])]),h("div",Z,[l(w,{ref_key:"repeatpwdRef",ref:R,modelValue:o.repeat_password,"onUpdate:modelValue":r[6]||(r[6]=a=>o.repeat_password=a),filled:"",type:m.value?"password":"text",label:"\u91CD\u590D\u5BC6\u7801",class:"q-py-md","bottom-slots":"","hide-bottom-space":"",rules:C},{before:s(()=>[l(c,{name:"lock"})]),append:s(()=>[l(c,{name:m.value?"visibility_off":"visibility",class:"cursor-pointer",onClick:r[5]||(r[5]=a=>m.value=!m.value)},null,8,["name"])]),_:1},8,["modelValue","type"])])]),_:1})]),_:1},8,["modelValue","contracted","style"])]))}};export{de as default};