(window.webpackJsonp=window.webpackJsonp||[]).push([[42],{111:function(e,t,a){"use strict";var n=a(113),r=a(2),c=a.n(r);Object(n.a)({},c.a,{ID:c.a.oneOfType([c.a.string,c.a.number]).isRequired,component:c.a.oneOfType([c.a.string,c.a.func]),date:c.a.oneOfType([c.a.instanceOf(Date),c.a.string])})},112:function(e,t,a){"use strict";var n=a(40),r=a(16),c=a(4),l=a.n(c),s=a(1),o=a.n(s),i=(a(111),{h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6","display-1":"h1","display-2":"h1","display-3":"h1","display-4":"h1",p:"p",lead:"p",blockquote:"blockquote"}),m=function(e){var t,a=e.tag,c=e.className,s=e.type,m=Object(r.a)(e,["tag","className","type"]),u=l()(Object(n.a)({},s,!!s),c);return t=a||(!a&&i[s]?i[s]:"p"),o.a.createElement(t,Object.assign({},m,{className:u}))};m.defaultProps={type:"p"},t.a=m},114:function(e,t,a){"use strict";var n=a(16),r=a(1),c=a.n(r),l=(a(111),a(18)),s=a(112),o=l.a.create("page"),i=function(e){var t=e.title,a=e.breadcrumbs,r=e.tag,l=e.className,i=e.children,m=Object(n.a)(e,["title","breadcrumbs","tag","className","children"]),u=o.b("px-3",l);return c.a.createElement(r,Object.assign({className:u},m),c.a.createElement("div",{className:o.e("header")},t&&"string"===typeof t?c.a.createElement(s.a,{type:"h4",className:o.e("title")},t):t,a&&a),i)};i.defaultProps={tag:"div",title:""},t.a=i},164:function(e,t,a){"use strict";a.r(t);var n=a(113),r=a(116),c=a.n(r),l=a(117),s=a(115),o=a(114),i=a(1),m=a.n(i),u=a(178),p=a(165),h=a(166),d=a(167),f=a(105),b=a(92),y=a(106),E=a(20),g=a(38),O=a(112),N=a(18).a.create("page");t.default=function(e){var t=Object(i.useState)(!0),a=Object(s.a)(t,2),r=a[0],j=a[1],v=Object(i.useState)(!1),k=Object(s.a)(v,2),x=k[0],w=k[1],S=Object(i.useState)(""),T=Object(s.a)(S,2),A=T[0],P=T[1];Object(i.useEffect)(function(){Object(l.a)(c.a.mark(function t(){var a,n;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("/api/bonus/"+(r?0:10),{method:"GET",headers:{"content-type":"application/json",Authorization:JSON.parse(localStorage.getItem("auth")).userToken}});case 2:return 401==(a=t.sent).status&&e.history.push("/login"),t.next=6,a.json();case 6:return n=t.sent,t.next=9,P(n);case 9:case"end":return t.stop()}},t)}))()},[]);var C=function(e){return function(){Object(l.a)(c.a.mark(function t(){var a,n;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("/api/bonus/"+(e?0:10),{method:"GET",headers:{"content-type":"application/json",Authorization:JSON.parse(localStorage.getItem("auth")).userToken}});case 2:return a=t.sent,t.next=5,a.json();case 5:return n=t.sent,t.next=8,P(n);case 8:case"end":return t.stop()}},t)}))(),j(e)}};return m.a.createElement(o.a,{title:m.a.createElement(m.a.Fragment,null,m.a.createElement(g.a,{to:"/my"},m.a.createElement(O.a,{type:"h4",className:N.e("title")},m.a.createElement(E.a,null)," Promotion")),m.a.createElement(u.a,{isOpen:x,toggle:function(){return w(!x)},style:{padding:"15px"}},m.a.createElement(p.a,{color:"link"},m.a.createElement(E.b,null)),m.a.createElement(h.a,null,m.a.createElement(d.a,null,m.a.createElement(g.a,{to:"/my/promotionList"},"Promotions")),m.a.createElement(d.a,null,m.a.createElement(g.a,{to:"/my/apply"},"Applies")),m.a.createElement(d.a,null,m.a.createElement(g.a,{to:"/my/referers"},"Referers"))))),className:"MyPage"},m.a.createElement(f.a,{style:{flexFlow:"row wrap",justifyContent:"space-between"},className:"category-bar"},m.a.createElement(b.a,{className:!0===r&&"btn-active",color:"link",onClick:C(!0)},"Level 1"),m.a.createElement(b.a,{className:!1===r&&"btn-active",color:"link",onClick:C(!1)},"Level 2")),m.a.createElement(f.a,null,m.a.createElement(y.a,{md:12,style:{textAlign:"center"},className:"mt-3"},m.a.createElement(b.a,{onClick:function(){parseInt(A.total)<100?alert("Less than \u20b9 100"):Object(l.a)(c.a.mark(function e(){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("/api/apply/"+(r?0:10),{method:"post",headers:{"content-type":"application/json",Authorization:JSON.parse(localStorage.getItem("auth")).userToken}});case 3:return e.sent,e.next=6,P(Object(n.a)({},A,{total:0,count:0}));case 6:e.next=10;break;case 8:e.prev=8,e.t0=e.catch(0);case 10:case"end":return e.stop()}},e,null,[[0,8]])}))()},color:"success"}," Apply ")),m.a.createElement(y.a,{md:12,style:{textAlign:"center"},className:"mt-3"},m.a.createElement("div",{style:{display:"inline-block"}},"Total People",m.a.createElement("br",null),A&&A.count),m.a.createElement("div",{style:{display:"inline-block"},className:"ml-5"},"Contribution",m.a.createElement("br",null),"\u20b9 ",A&&A.total)),m.a.createElement(y.a,{md:12,className:"mt-4 ml-3 mr-3"},"My Promotion Code",m.a.createElement("br",null),m.a.createElement("span",{style:{float:"right",textDecoration:"underline"},className:"mr-5"},"\xa0\xa0\xa0",A.ref_code,"\xa0\xa0\xa0")),m.a.createElement(y.a,{md:12,className:"mt-4 ml-3 mr-3"},"My Promotion Link",m.a.createElement("br",null),m.a.createElement("span",{style:{float:"right",textDecoration:"underline"},className:"mr-5"}," https://www.shoptraders.in/signup/",A.ref_code," ")),m.a.createElement(y.a,{md:12,style:{textAlign:"center"},className:"mt-3"},m.a.createElement(g.a,{to:"/signup/"+A.ref_code,style:{fontWeight:"500"}}," Open Link "))))}}}]);
//# sourceMappingURL=42.ebb24341.chunk.js.map