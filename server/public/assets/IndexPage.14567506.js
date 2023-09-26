import{u as y,b as _,c as T,Q as V,a as k}from"./QTabs.30e113f1.js";import{c as h,am as E,an as Q,a as q,w as M,H as P,r as f,q as U,D as R,J as I,b4 as L,N as s,L as r,U as S,M as u,O as n,be as $,X as b,R as p,S as g,P as v,bf as C,Q as w}from"./index.0c4906a1.js";import{Q as B,a as D}from"./QTabPanels.2f86d3af.js";import{u as N}from"./store.3b26f30e.js";import"./QResizeObserver.c97f6af5.js";import"./rtl.b51694b1.js";import"./use-panel.a3e0f96b.js";import"./touch.3df10340.js";import"./axios.7331a07d.js";var j=h({name:"QRouteTab",props:{...E,...y},emits:_,setup(m,{slots:t,emit:d}){const l=Q({useDisableForRouterLinkProps:!1}),{renderTab:i,$tabs:e}=T(m,t,d,{exact:q(()=>m.exact),...l});return M(()=>`${m.name} | ${m.exact} | ${(l.resolvedLink.value||{}).href}`,()=>{e.verifyRouteModel()}),()=>i(l.linkTag.value,l.linkAttrs.value)}});const A={class:"row"},z={class:"q-gutter-y-sm"},F=n("div",{class:"text-h5 q-pb-md"},"\u767B \u5F55 \u9875",-1),H=n("img",{src:"/icons/img_avatar.png"},null,-1),J={class:"q-pt-sm"},O={class:"q-mb-md"},X={class:"q-my-md row justify-between"},G={class:"q-py-md"},re={__name:"IndexPage",setup(m){const t=N(),d=P(),l=f(!0),i=f(!1);U(async()=>{localStorage.getItem("token")!==null&&await t.verifyUser().then(()=>{t.user&&d.push("/")})});const e=R({email:"",password:"",remember:!1,pwdError:!1,nameError:!1,errorMsg:""}),x=async()=>{e.nameError=!1,e.pwdError=!1;const c=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;if(e.email){if(!e.password)return e.pwdError=!0,e.errorMsg="\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A"}else return e.nameError=!0,e.errorMsg="\u8BF7\u8F93\u5165\u7528\u6237\u540D";if(!c.test(e.email)){e.nameError=!0,e.errorMsg="\u975E\u6CD5\u90AE\u7BB1\u5730\u5740";return}i.value=!0,await t.axios.post("/user/login",e).then(async a=>{a.status===200&&(localStorage.setItem("token",a.data.token),await t.verifyUser().then(()=>{i.value=!1,t.successTip("\u6210\u529F\u767B\u5F55"),d.push("/")}).catch(o=>{console.log(o)}))}).catch(a=>{i.value=!1,a.response.data.status==="nameError"?(e.nameError=!0,e.errorMsg=a.response.data.msg):a.response.data.status==="pwdError"?(e.pwdError=!0,e.errorMsg=a.response.data.msg):t.store.failureTip(a.response.data.msg)})};return(c,a)=>(I(),L("div",A,[s(S,{class:"shadow-13 fixed-center q-pa-none col-xs-12 col-md-6",style:{"max-width":"550px"}},{default:r(()=>[s(V,{modelValue:u(t).mainTab,"onUpdate:modelValue":a[0]||(a[0]=o=>u(t).mainTab=o),align:"justify","narrow-indicator":"",class:"q-mb-md"},{default:r(()=>[s(k,{class:"text-primary",name:"login",label:" \u767B \u5F55 "}),s(j,{class:"text-orange",name:"register",label:" \u6CE8 \u518C ",to:"/register"})]),_:1},8,["modelValue"]),n("div",z,[s(B,{modelValue:u(t).mainTab,"onUpdate:modelValue":a[5]||(a[5]=o=>u(t).mainTab=o),animated:"","transition-prev":"fade","transition-next":"fade",class:"text-center q-ma-none q-pa-none"},{default:r(()=>[s(D,{class:"q-gutter-sm",name:"login"},{default:r(()=>[F,s($,{size:"120px",class:"shadow-3"},{default:r(()=>[H]),_:1}),n("div",J,[s(b,{modelValue:e.email,"onUpdate:modelValue":a[1]||(a[1]=o=>e.email=o),filled:"",type:"email",label:"\u90AE\u7BB1\u5730\u5740",class:"q-py-xs","bottom-slots":"","hide-bottom-space":"",error:e.nameError},{before:r(()=>[s(p,{color:"teal",name:"mail"})]),error:r(()=>[g(v(e.errorMsg),1)]),_:1},8,["modelValue","error"])]),n("div",O,[s(b,{modelValue:e.password,"onUpdate:modelValue":a[3]||(a[3]=o=>e.password=o),filled:"",type:l.value?"password":"text",label:"\u5BC6\u7801","bottom-slots":"","hide-bottom-space":"",error:e.pwdError},{before:r(()=>[s(p,{name:"lock"})]),append:r(()=>[s(p,{name:l.value?"visibility_off":"visibility",class:"cursor-pointer",onClick:a[2]||(a[2]=o=>l.value=!l.value)},null,8,["name"])]),error:r(()=>[g(v(e.errorMsg),1)]),_:1},8,["modelValue","type","error"])]),n("div",X,[s(C,{modelValue:e.remember,"onUpdate:modelValue":a[4]||(a[4]=o=>e.remember=o),class:"left",label:"\u8BB0\u4F4F\u6211"},null,8,["modelValue"]),s(w,{flat:"",color:"indigo-7",label:"\u5FD8\u8BB0\u5BC6\u7801\uFF1F",to:"/forgot",class:"text-italic"})]),n("div",G,[s(w,{color:"primary",class:"full-width","icon-right":"login",label:"\u767B \u5F55",loading:i.value,onClick:x},null,8,["loading"])])]),_:1})]),_:1},8,["modelValue"])])]),_:1})]))}};export{re as default};
