import{u,a as c,b as i,c as P}from"./use-panel.b7e29401.js";import{c as s,d as m,x as b,f as v,k as d,a as k,v as q,g as D}from"./index.c5216a1f.js";var h=s({name:"QTabPanel",props:u,setup(a,{slots:e}){return()=>m("div",{class:"q-tab-panel",role:"tabpanel"},b(e.default))}}),C=s({name:"QTabPanels",props:{...c,...v},emits:i,setup(a,{slots:e}){const n=D(),t=d(a,n.proxy.$q),{updatePanelsList:r,getPanelContent:l,panelDirectives:p}=P(),o=k(()=>"q-tab-panels q-panel-parent"+(t.value===!0?" q-tab-panels--dark q-dark":""));return()=>(r(e),q("div",{class:o.value},l(),"pan",a.swipeable,()=>p.value))}});export{C as Q,h as a};
