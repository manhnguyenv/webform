YAHOO.widget.TreeView=function(id){
if(id){
this.init(id);
}
};
YAHOO.widget.TreeView.prototype={id:null,_el:null,_nodes:null,locked:false,_expandAnim:null,_collapseAnim:null,_animCount:0,maxAnim:2,setExpandAnim:function(_2){
if(YAHOO.widget.TVAnim.isValid(_2)){
this._expandAnim=_2;
}
},setCollapseAnim:function(_3){
if(YAHOO.widget.TVAnim.isValid(_3)){
this._collapseAnim=_3;
}
},animateExpand:function(el,_5){
if(this._expandAnim&&this._animCount<this.maxAnim){
var _6=this;
var a=YAHOO.widget.TVAnim.getAnim(this._expandAnim,el,function(){
_6.expandComplete(_5);
});
if(a){
++this._animCount;
this.fireEvent("animStart",{"node":_5,"type":"expand"});
a.animate();
}
return true;
}
return false;
},animateCollapse:function(el,_9){
if(this._collapseAnim&&this._animCount<this.maxAnim){
var _a=this;
var a=YAHOO.widget.TVAnim.getAnim(this._collapseAnim,el,function(){
_a.collapseComplete(_9);
});
if(a){
++this._animCount;
this.fireEvent("animStart",{"node":_9,"type":"collapse"});
a.animate();
}
return true;
}
return false;
},expandComplete:function(_c){
--this._animCount;
this.fireEvent("animComplete",{"node":_c,"type":"expand"});
},collapseComplete:function(_d){
--this._animCount;
this.fireEvent("animComplete",{"node":_d,"type":"collapse"});
},init:function(id){
this.id=id;
if("string"!==typeof id){
this._el=id;
this.id=this.generateId(id);
}
this.createEvent("animStart",this);
this.createEvent("animComplete",this);
this.createEvent("collapse",this);
this.createEvent("collapseComplete",this);
this.createEvent("expand",this);
this.createEvent("expandComplete",this);
this._nodes=[];
YAHOO.widget.TreeView.trees[this.id]=this;
this.root=new YAHOO.widget.RootNode(this);
YAHOO.util.Event.on(this.id,"click",this.handleClick,this,true);
},draw:function(){
var _f=this.root.getHtml();
this.getEl().innerHTML=_f;
this.firstDraw=false;
},getEl:function(){
if(!this._el){
this._el=document.getElementById(this.id);
}
return this._el;
},regNode:function(_10){
this._nodes[_10.index]=_10;
},getRoot:function(){
return this.root;
},setDynamicLoad:function(_11,_12){
this.root.setDynamicLoad(_11,_12);
},expandAll:function(){
if(!this.locked){
this.root.expandAll();
}
},collapseAll:function(){
if(!this.locked){
this.root.collapseAll();
}
},getNodeByIndex:function(_13){
var n=this._nodes[_13];
return (n)?n:null;
},getNodeByProperty:function(_15,_16){
for(var i in this._nodes){
var n=this._nodes[i];
if(n.data&&_16==n.data[_15]){
return n;
}
}
return null;
},getNodesByProperty:function(_19,_1a){
var _1b=[];
for(var i in this._nodes){
var n=this._nodes[i];
if(n.data&&_1a==n.data[_19]){
_1b.push(n);
}
}
return (_1b.length)?_1b:null;
},removeNode:function(_1e,_1f){
if(_1e.isRoot()){
return false;
}
var p=_1e.parent;
if(p.parent){
p=p.parent;
}
this._deleteNode(_1e);
if(_1f&&p&&p.childrenRendered){
p.refresh();
}
return true;
},removeChildren:function(_21){
while(_21.children.length){
this._deleteNode(_21.children[0]);
}
_21.childrenRendered=false;
_21.dynamicLoadComplete=false;
if(_21.expanded){
_21.collapse();
}else{
_21.updateIcon();
}
},_deleteNode:function(_22){
this.removeChildren(_22);
this.popNode(_22);
},popNode:function(_23){
var p=_23.parent;
var a=[];
for(var i=0,len=p.children.length;i<len;++i){
if(p.children[i]!=_23){
a[a.length]=p.children[i];
}
}
p.children=a;
p.childrenRendered=false;
if(_23.previousSibling){
_23.previousSibling.nextSibling=_23.nextSibling;
}
if(_23.nextSibling){
_23.nextSibling.previousSibling=_23.previousSibling;
}
_23.parent=null;
_23.previousSibling=null;
_23.nextSibling=null;
_23.tree=null;
delete this._nodes[_23.index];
},toString:function(){
return "TreeView "+this.id;
},generateId:function(el){
var id=el.id;
if(!id){
id="yui-tv-auto-id-"+YAHOO.widget.TreeView.counter;
++YAHOO.widget.TreeView.counter;
}
return id;
},readList:function(){
this.getUlList(this.getEl());
},getUlList:function(_2a,_2b){
if(!_2a.getElementsByTagName("UL")[0]){
return;
}
if(!_2b){
_2b=this.getRoot();
}
var _2c=_2a.getElementsByTagName("UL")[0];
for(var i=0;i<_2c.childNodes.length;i++){
if(_2c.childNodes[i].nodeName=="LI"){
sLabel=this.getLiLabel(_2c.childNodes[i]);
if(_2c.childNodes[i].className=="expand"){
bExpand=true;
}else{
bExpand=false;
}
newNode=new YAHOO.widget.HTMLNode(sLabel,_2b,bExpand,true);
this.getUlList(_2c.childNodes[i],newNode);
}
}
},getLiLabel:function(_2e){
nLabel=_2e.cloneNode(true);
if(nLabel.getElementsByTagName("UL")[0]){
nUl=nLabel.getElementsByTagName("UL")[0];
nLabel.removeChild(nUl);
}
return nLabel.innerHTML;
},onExpand:function(_2f){
},onCollapse:function(_30){
}};
YAHOO.augment(YAHOO.widget.TreeView,YAHOO.util.EventProvider);
YAHOO.widget.TreeView.nodeCount=0;
YAHOO.widget.TreeView.trees=[];
YAHOO.widget.TreeView.counter=0;
YAHOO.widget.TreeView.getTree=function(_31){
var t=YAHOO.widget.TreeView.trees[_31];
return (t)?t:null;
};
YAHOO.widget.TreeView.getNode=function(_33,_34){
var t=YAHOO.widget.TreeView.getTree(_33);
return (t)?t.getNodeByIndex(_34):null;
};
YAHOO.widget.TreeView.addHandler=function(el,_37,fn){
if(el.addEventListener){
el.addEventListener(_37,fn,false);
}else{
if(el.attachEvent){
el.attachEvent("on"+_37,fn);
}
}
};
YAHOO.widget.TreeView.removeHandler=function(el,_3a,fn){
if(el.removeEventListener){
el.removeEventListener(_3a,fn,false);
}else{
if(el.detachEvent){
el.detachEvent("on"+_3a,fn);
}
}
};
YAHOO.widget.TreeView.preload=function(_3c){
_3c=_3c||"ygtv";
var _3d=["tn","tm","tmh","tp","tph","ln","lm","lmh","lp","lph","loading"];
var sb=[];
for(var i=0;i<_3d.length;++i){
sb[sb.length]="<span class=\""+_3c+_3d[i]+"\">&#160;</span>";
}
var f=document.createElement("div");
var s=f.style;
s.position="absolute";
s.top="-1000px";
s.left="-1000px";
f.innerHTML=sb.join("");
document.body.appendChild(f);
YAHOO.widget.TreeView.removeHandler(window,"load",YAHOO.widget.TreeView.preload);
};
YAHOO.widget.TreeView.addHandler(window,"load",YAHOO.widget.TreeView.preload);
YAHOO.widget.Node=function(_42,_43,_44){
if(_42){
this.init(_42,_43,_44);
}
};
YAHOO.widget.Node.prototype={index:0,children:null,tree:null,data:null,parent:null,depth:-1,href:null,target:"_self",expanded:false,multiExpand:true,renderHidden:false,childrenRendered:false,dynamicLoadComplete:false,previousSibling:null,nextSibling:null,_dynLoad:false,dataLoader:null,isLoading:false,hasIcon:true,iconMode:0,nowrap:false,_type:"Node",init:function(_45,_46,_47){
this.data=_45;
this.children=[];
this.index=YAHOO.widget.TreeView.nodeCount;
++YAHOO.widget.TreeView.nodeCount;
this.expanded=_47;
this.createEvent("parentChange",this);
if(_46){
_46.appendChild(this);
}
},applyParent:function(_48){
if(!_48){
return false;
}
this.tree=_48.tree;
this.parent=_48;
this.depth=_48.depth+1;
if(!this.href){
this.href="javascript:"+this.getToggleLink();
}
this.tree.regNode(this);
_48.childrenRendered=false;
for(var i=0,len=this.children.length;i<len;++i){
this.children[i].applyParent(this);
}
this.fireEvent("parentChange");
return true;
},appendChild:function(_4b){
if(this.hasChildren()){
var sib=this.children[this.children.length-1];
sib.nextSibling=_4b;
_4b.previousSibling=sib;
}
this.children[this.children.length]=_4b;
_4b.applyParent(this);
return _4b;
},appendTo:function(_4d){
return _4d.appendChild(this);
},insertBefore:function(_4e){
var p=_4e.parent;
if(p){
if(this.tree){
this.tree.popNode(this);
}
var _50=_4e.isChildOf(p);
p.children.splice(_50,0,this);
if(_4e.previousSibling){
_4e.previousSibling.nextSibling=this;
}
this.previousSibling=_4e.previousSibling;
this.nextSibling=_4e;
_4e.previousSibling=this;
this.applyParent(p);
}
return this;
},insertAfter:function(_51){
var p=_51.parent;
if(p){
if(this.tree){
this.tree.popNode(this);
}
var _53=_51.isChildOf(p);
if(!_51.nextSibling){
this.nextSibling=null;
return this.appendTo(p);
}
p.children.splice(_53+1,0,this);
_51.nextSibling.previousSibling=this;
this.previousSibling=_51;
this.nextSibling=_51.nextSibling;
_51.nextSibling=this;
this.applyParent(p);
}
return this;
},isChildOf:function(_54){
if(_54&&_54.children){
for(var i=0,len=_54.children.length;i<len;++i){
if(_54.children[i]===this){
return i;
}
}
}
return -1;
},getSiblings:function(){
return this.parent.children;
},showChildren:function(){
if(!this.tree.animateExpand(this.getChildrenEl(),this)){
if(this.hasChildren()){
this.getChildrenEl().style.display="";
}
}
},hideChildren:function(){
if(!this.tree.animateCollapse(this.getChildrenEl(),this)){
this.getChildrenEl().style.display="none";
}
},getElId:function(){
return "ygtv"+this.index;
},getChildrenElId:function(){
return "ygtvc"+this.index;
},getToggleElId:function(){
return "ygtvt"+this.index;
},getEl:function(){
return document.getElementById(this.getElId());
},getChildrenEl:function(){
return document.getElementById(this.getChildrenElId());
},getToggleEl:function(){
return document.getElementById(this.getToggleElId());
},getToggleLink:function(){
return "YAHOO.widget.TreeView.getNode('"+this.tree.id+"',"+this.index+").toggle()";
},collapse:function(){
if(!this.expanded){
return;
}
var ret=this.tree.onCollapse(this);
if(false===ret){
return;
}
ret=this.tree.fireEvent("collapse",this);
if(false===ret){
return;
}
if(!this.getEl()){
this.expanded=false;
}else{
this.hideChildren();
this.expanded=false;
this.updateIcon();
}
ret=this.tree.fireEvent("collapseComplete",this);
},expand:function(){
if(this.expanded){
return;
}
var ret=this.tree.onExpand(this);
if(false===ret){
return;
}
ret=this.tree.fireEvent("expand",this);
if(false===ret){
return;
}
if(!this.getEl()){
this.expanded=true;
return;
}
if(!this.childrenRendered){
this.getChildrenEl().innerHTML=this.renderChildren();
}else{
}
this.expanded=true;
this.updateIcon();
if(this.isLoading){
this.expanded=false;
return;
}
if(!this.multiExpand){
var _59=this.getSiblings();
for(var i=0;i<_59.length;++i){
if(_59[i]!=this&&_59[i].expanded){
_59[i].collapse();
}
}
}
this.showChildren();
ret=this.tree.fireEvent("expandComplete",this);
},updateIcon:function(){
if(this.hasIcon){
var el=this.getToggleEl();
if(el){
el.className=this.getStyle();
}
}
},getStyle:function(){
if(this.isLoading){
return "ygtvloading";
}else{
var loc=(this.nextSibling)?"t":"l";
var _5d="n";
if(this.hasChildren(true)||(this.isDynamic()&&!this.getIconMode())){
_5d=(this.expanded)?"m":"p";
}
return "ygtv"+loc+_5d;
}
},getHoverStyle:function(){
var s=this.getStyle();
if(this.hasChildren(true)&&!this.isLoading){
s+="h";
}
return s;
},expandAll:function(){
for(var i=0;i<this.children.length;++i){
var c=this.children[i];
if(c.isDynamic()){
alert("Not supported (lazy load + expand all)");
break;
}else{
if(!c.multiExpand){
alert("Not supported (no multi-expand + expand all)");
break;
}else{
c.expand();
c.expandAll();
}
}
}
},collapseAll:function(){
for(var i=0;i<this.children.length;++i){
this.children[i].collapse();
this.children[i].collapseAll();
}
},setDynamicLoad:function(_62,_63){
if(_62){
this.dataLoader=_62;
this._dynLoad=true;
}else{
this.dataLoader=null;
this._dynLoad=false;
}
if(_63){
this.iconMode=_63;
}
},isRoot:function(){
return (this==this.tree.root);
},isDynamic:function(){
var _64=(!this.isRoot()&&(this._dynLoad||this.tree.root._dynLoad));
return _64;
},getIconMode:function(){
return (this.iconMode||this.tree.root.iconMode);
},hasChildren:function(_65){
return (this.children.length>0||(_65&&this.isDynamic()&&!this.dynamicLoadComplete));
},toggle:function(){
if(!this.tree.locked&&(this.hasChildren(true)||this.isDynamic())){
if(this.expanded){
this.collapse();
}else{
this.expand();
}
}
},getHtml:function(){
this.childrenRendered=false;
var sb=[];
sb[sb.length]="<div class=\"ygtvitem\" id=\""+this.getElId()+"\">";
sb[sb.length]=this.getNodeHtml();
sb[sb.length]=this.getChildrenHtml();
sb[sb.length]="</div>";
return sb.join("");
},getChildrenHtml:function(){
var sb=[];
sb[sb.length]="<div class=\"ygtvchildren\"";
sb[sb.length]=" id=\""+this.getChildrenElId()+"\"";
if(!this.expanded){
sb[sb.length]=" style=\"display:none;\"";
}
sb[sb.length]=">";
if((this.hasChildren(true)&&this.expanded)||(this.renderHidden&&!this.isDynamic())){
sb[sb.length]=this.renderChildren();
}
sb[sb.length]="</div>";
return sb.join("");
},renderChildren:function(){
var _68=this;
if(this.isDynamic()&&!this.dynamicLoadComplete){
this.isLoading=true;
this.tree.locked=true;
if(this.dataLoader){
setTimeout(function(){
_68.dataLoader(_68,function(){
_68.loadComplete();
});
},10);
}else{
if(this.tree.root.dataLoader){
setTimeout(function(){
_68.tree.root.dataLoader(_68,function(){
_68.loadComplete();
});
},10);
}else{
return "Error: data loader not found or not specified.";
}
}
return "";
}else{
return this.completeRender();
}
},completeRender:function(){
var sb=[];
for(var i=0;i<this.children.length;++i){
sb[sb.length]=this.children[i].getHtml();
}
this.childrenRendered=true;
return sb.join("");
},loadComplete:function(){
this.getChildrenEl().innerHTML=this.completeRender();
this.dynamicLoadComplete=true;
this.isLoading=false;
this.expand();
this.tree.locked=false;
},getAncestor:function(_6b){
if(_6b>=this.depth||_6b<0){
return null;
}
var p=this.parent;
while(p.depth>_6b){
p=p.parent;
}
return p;
},getDepthStyle:function(_6d){
return (this.getAncestor(_6d).nextSibling)?"ygtvdepthcell":"ygtvblankdepthcell";
},getNodeHtml:function(){
return "";
},refresh:function(){
this.getChildrenEl().innerHTML=this.completeRender();
if(this.hasIcon){
var el=this.getToggleEl();
if(el){
el.className=this.getStyle();
}
}
},toString:function(){
return "Node ("+this.index+")";
}};
YAHOO.augment(YAHOO.widget.Node,YAHOO.util.EventProvider);
YAHOO.widget.TextNode=function(_6f,_70,_71){
if(_6f){
this.init(_6f,_70,_71);
this.setUpLabel(_6f);
}
};
YAHOO.extend(YAHOO.widget.TextNode,YAHOO.widget.Node,{labelStyle:"ygtvlabel",labelElId:null,label:null,textNodeParentChange:function(){
if(this.tree&&!this.tree.hasEvent("labelClick")){
this.tree.createEvent("labelClick",this.tree);
}
},setUpLabel:function(_72){
this.textNodeParentChange();
this.subscribe("parentChange",this.textNodeParentChange);
if(typeof _72=="string"){
_72={label:_72};
}
this.label=_72.label;
this.data.label=_72.label;
if(_72.href){
this.href=_72.href;
}
if(_72.target){
this.target=_72.target;
}
if(_72.style){
this.labelStyle=_72.style;
}
this.labelElId="ygtvlabelel"+this.index;
},getLabelEl:function(){
return document.getElementById(this.labelElId);
},getNodeHtml:function(){
var sb=[];
sb[sb.length]="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";
sb[sb.length]="<tr>";
for(var i=0;i<this.depth;++i){
sb[sb.length]="<td class=\""+this.getDepthStyle(i)+"\"><div class=\"ygtvspacer\"></div></td>";
}
var _75="YAHOO.widget.TreeView.getNode('"+this.tree.id+"',"+this.index+")";
sb[sb.length]="<td";
sb[sb.length]=" id=\""+this.getToggleElId()+"\"";
sb[sb.length]=" class=\""+this.getStyle()+"\"";
if(this.hasChildren(true)){
sb[sb.length]=" onmouseover=\"this.className=";
sb[sb.length]=_75+".getHoverStyle()\"";
sb[sb.length]=" onmouseout=\"this.className=";
sb[sb.length]=_75+".getStyle()\"";
}
sb[sb.length]=" onclick=\"javascript:"+this.getToggleLink()+"\">";
sb[sb.length]="<div class=\"ygtvspacer\">";
sb[sb.length]="</div>";
sb[sb.length]="</td>";
sb[sb.length]="<td ";
sb[sb.length]=(this.nowrap)?" nowrap=\"nowrap\" ":"";
sb[sb.length]=" >";
sb[sb.length]="<a";
sb[sb.length]=" id=\""+this.labelElId+"\"";
sb[sb.length]=" class=\""+this.labelStyle+"\"";
sb[sb.length]=" href=\""+this.href+"\"";
sb[sb.length]=" target=\""+this.target+"\"";
sb[sb.length]=" onclick=\"return "+_75+".onLabelClick("+_75+")\"";
if(this.hasChildren(true)){
sb[sb.length]=" onmouseover=\"document.getElementById('";
sb[sb.length]=this.getToggleElId()+"').className=";
sb[sb.length]=_75+".getHoverStyle()\"";
sb[sb.length]=" onmouseout=\"document.getElementById('";
sb[sb.length]=this.getToggleElId()+"').className=";
sb[sb.length]=_75+".getStyle()\"";
}
sb[sb.length]=" >";
sb[sb.length]=this.label;
sb[sb.length]="</a>";
sb[sb.length]="</td>";
sb[sb.length]="</tr>";
sb[sb.length]="</table>";
return sb.join("");
},onLabelClick:function(me){
return me.tree.fireEvent("labelClick",me);
},toString:function(){
return "TextNode ("+this.index+") "+this.label;
}});
YAHOO.widget.RootNode=function(_77){
this.init(null,null,true);
this.tree=_77;
};
YAHOO.extend(YAHOO.widget.RootNode,YAHOO.widget.Node,{getNodeHtml:function(){
return "";
},toString:function(){
return "RootNode";
},loadComplete:function(){
this.tree.draw();
},collapse:function(){
},expand:function(){
}});
YAHOO.widget.HTMLNode=function(_78,_79,_7a,_7b){
if(_78){
this.init(_78,_79,_7a);
this.initContent(_78,_7b);
}
};
YAHOO.extend(YAHOO.widget.HTMLNode,YAHOO.widget.Node,{contentStyle:"ygtvhtml",contentElId:null,content:null,initContent:function(_7c,_7d){
if(typeof _7c=="string"){
_7c={html:_7c};
}
this.html=_7c.html;
this.contentElId="ygtvcontentel"+this.index;
this.hasIcon=_7d;
},getContentEl:function(){
return document.getElementById(this.contentElId);
},getNodeHtml:function(){
var sb=[];
sb[sb.length]="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";
sb[sb.length]="<tr>";
for(var i=0;i<this.depth;++i){
sb[sb.length]="<td class=\""+this.getDepthStyle(i)+"\"><div class=\"ygtvspacer\"></div></td>";
}
if(this.hasIcon){
sb[sb.length]="<td";
sb[sb.length]=" id=\""+this.getToggleElId()+"\"";
sb[sb.length]=" class=\""+this.getStyle()+"\"";
sb[sb.length]=" onclick=\"javascript:"+this.getToggleLink()+"\"";
if(this.hasChildren(true)){
sb[sb.length]=" onmouseover=\"this.className=";
sb[sb.length]="YAHOO.widget.TreeView.getNode('";
sb[sb.length]=this.tree.id+"',"+this.index+").getHoverStyle()\"";
sb[sb.length]=" onmouseout=\"this.className=";
sb[sb.length]="YAHOO.widget.TreeView.getNode('";
sb[sb.length]=this.tree.id+"',"+this.index+").getStyle()\"";
}
sb[sb.length]="><div class=\"ygtvspacer\"></div></td>";
}
sb[sb.length]="<td";
sb[sb.length]=" id=\""+this.contentElId+"\"";
sb[sb.length]=" class=\""+this.contentStyle+"\"";
sb[sb.length]=(this.nowrap)?" nowrap=\"nowrap\" ":"";
sb[sb.length]=" >";
sb[sb.length]=this.html;
sb[sb.length]="</td>";
sb[sb.length]="</tr>";
sb[sb.length]="</table>";
return sb.join("");
},toString:function(){
return "HTMLNode ("+this.index+")";
}});
YAHOO.widget.MenuNode=function(_80,_81,_82){
if(_80){
this.init(_80,_81,_82);
this.setUpLabel(_80);
}
this.multiExpand=false;
};
YAHOO.extend(YAHOO.widget.MenuNode,YAHOO.widget.TextNode,{toString:function(){
return "MenuNode ("+this.index+") "+this.label;
}});
YAHOO.widget.TVAnim=function(){
return {FADE_IN:"TVFadeIn",FADE_OUT:"TVFadeOut",getAnim:function(_83,el,_85){
if(YAHOO.widget[_83]){
return new YAHOO.widget[_83](el,_85);
}else{
return null;
}
},isValid:function(_86){
return (YAHOO.widget[_86]);
}};
}();
YAHOO.widget.TVFadeIn=function(el,_88){
this.el=el;
this.callback=_88;
};
YAHOO.widget.TVFadeIn.prototype={animate:function(){
var _89=this;
var s=this.el.style;
s.opacity=0.1;
s.filter="alpha(opacity=10)";
s.display="";
var dur=0.4;
var a=new YAHOO.util.Anim(this.el,{opacity:{from:0.1,to:1,unit:""}},dur);
a.onComplete.subscribe(function(){
_89.onComplete();
});
a.animate();
},onComplete:function(){
this.callback();
},toString:function(){
return "TVFadeIn";
}};
YAHOO.widget.TVFadeOut=function(el,_8e){
this.el=el;
this.callback=_8e;
};
YAHOO.widget.TVFadeOut.prototype={animate:function(){
var _8f=this;
var dur=0.4;
var a=new YAHOO.util.Anim(this.el,{opacity:{from:1,to:0.1,unit:""}},dur);
a.onComplete.subscribe(function(){
_8f.onComplete();
});
a.animate();
},onComplete:function(){
var s=this.el.style;
s.display="none";
s.filter="alpha(opacity=100)";
this.callback();
},toString:function(){
return "TVFadeOut";
}};
YAHOO.register("treeview",YAHOO.widget.TreeView,{version:"2.2.2",build:"204"});

