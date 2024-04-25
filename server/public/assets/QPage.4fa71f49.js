import{c as D,u as ie,aJ as se,j as le,r as E,a as d,aK as re,m as ue,aL as ce,n as de,aM as fe,w as H,o as k,ag as Q,ab as q,ai as he,d as P,aR as ge,g as F,x as R,ah as ve,i as A,e as c,l as me,A as ye}from"./index.48789ced.js";import{u as pe,v as $,c as Te,p as j,d as Pe,e as be,r as L,s as Se,f as Ce}from"./position-engine.1f8748e9.js";import{c as M}from"./store.56a5cbb1.js";var Ee=D({name:"QTooltip",inheritAttrs:!1,props:{...pe,...ie,...se,maxHeight:{type:String,default:null},maxWidth:{type:String,default:null},transitionShow:{default:"jump-down"},transitionHide:{default:"jump-up"},anchor:{type:String,default:"bottom middle",validator:$},self:{type:String,default:"top middle",validator:$},offset:{type:Array,default:()=>[14,14],validator:Te},scrollTarget:{default:void 0},delay:{type:Number,default:0},hideDelay:{type:Number,default:0}},emits:[...le],setup(e,{slots:y,emit:r,attrs:n}){let u,i;const f=F(),{proxy:{$q:t}}=f,s=E(null),v=E(!1),K=d(()=>j(e.anchor,t.lang.rtl)),W=d(()=>j(e.self,t.lang.rtl)),z=d(()=>e.persistent!==!0),{registerTick:B,removeTick:N}=re(),{registerTimeout:m}=ue(),{transitionProps:_,transitionStyle:I}=ce(e),{localScrollTarget:b,changeScrollEvent:J,unconfigureScrollTarget:U}=Pe(e,O),{anchorEl:o,canShow:V,anchorEvents:h}=be({showing:v,configureAnchorEl:ae}),{show:G,hide:p}=de({showing:v,canShow:V,handleShow:Y,handleHide:Z,hideOnRouteChange:z,processOnMount:!0});Object.assign(h,{delayShow:ee,delayHide:te});const{showPortal:S,hidePortal:C,renderPortal:X}=fe(f,s,oe,"tooltip");if(t.platform.is.mobile===!0){const a={anchorEl:o,innerRef:s,onClickOutside(l){return p(l),l.target.classList.contains("q-dialog__backdrop")&&ve(l),!0}},T=d(()=>e.modelValue===null&&e.persistent!==!0&&v.value===!0);H(T,l=>{(l===!0?Ce:L)(a)}),k(()=>{L(a)})}function Y(a){S(),B(()=>{i=new MutationObserver(()=>g()),i.observe(s.value,{attributes:!1,childList:!0,characterData:!0,subtree:!0}),g(),O()}),u===void 0&&(u=H(()=>t.screen.width+"|"+t.screen.height+"|"+e.self+"|"+e.anchor+"|"+t.lang.rtl,g)),m(()=>{S(!0),r("show",a)},e.transitionDuration)}function Z(a){N(),C(),w(),m(()=>{C(!0),r("hide",a)},e.transitionDuration)}function w(){i!==void 0&&(i.disconnect(),i=void 0),u!==void 0&&(u(),u=void 0),U(),Q(h,"tooltipTemp")}function g(){Se({targetEl:s.value,offset:e.offset,anchorEl:o.value,anchorOrigin:K.value,selfOrigin:W.value,maxHeight:e.maxHeight,maxWidth:e.maxWidth})}function ee(a){if(t.platform.is.mobile===!0){M(),document.body.classList.add("non-selectable");const T=o.value,l=["touchmove","touchcancel","touchend","click"].map(x=>[T,x,"delayHide","passiveCapture"]);q(h,"tooltipTemp",l)}m(()=>{G(a)},e.delay)}function te(a){t.platform.is.mobile===!0&&(Q(h,"tooltipTemp"),M(),setTimeout(()=>{document.body.classList.remove("non-selectable")},10)),m(()=>{p(a)},e.hideDelay)}function ae(){if(e.noParentEvent===!0||o.value===null)return;const a=t.platform.is.mobile===!0?[[o.value,"touchstart","delayShow","passive"]]:[[o.value,"mouseenter","delayShow","passive"],[o.value,"mouseleave","delayHide","passive"]];q(h,"anchor",a)}function O(){if(o.value!==null||e.scrollTarget!==void 0){b.value=he(o.value,e.scrollTarget);const a=e.noParentEvent===!0?g:p;J(b.value,a)}}function ne(){return v.value===!0?P("div",{...n,ref:s,class:["q-tooltip q-tooltip--style q-position-engine no-pointer-events",n.class],style:[n.style,I.value],role:"tooltip"},R(y.default)):null}function oe(){return P(ge,_.value,ne)}return k(w),Object.assign(f.proxy,{updatePosition:g}),X}}),He=D({name:"QPage",props:{padding:Boolean,styleFn:Function},setup(e,{slots:y}){const{proxy:{$q:r}}=F(),n=A(me,c);if(n===c)return console.error("QPage needs to be a deep child of QLayout"),c;if(A(ye,c)===c)return console.error("QPage needs to be child of QPageContainer"),c;const i=d(()=>{const t=(n.header.space===!0?n.header.size:0)+(n.footer.space===!0?n.footer.size:0);if(typeof e.styleFn=="function"){const s=n.isContainer.value===!0?n.containerHeight.value:r.screen.height;return e.styleFn(t,s)}return{minHeight:n.isContainer.value===!0?n.containerHeight.value-t+"px":r.screen.height===0?t!==0?`calc(100vh - ${t}px)`:"100vh":r.screen.height-t+"px"}}),f=d(()=>`q-page${e.padding===!0?" q-layout-padding":""}`);return()=>P("main",{class:f.value,style:i.value},R(y.default))}});export{He as Q,Ee as a};
