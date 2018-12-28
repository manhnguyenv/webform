JSCore=function(){this.fnInit()};JSCore.prototype={fnInit:function(){this.iAvailable=1;
this.aStack=new Array();this.oInterval;this.bLoaded;this.aEventCache=new Array();
this._fnLogInit()},fnHasNextSibling:function(A){return A.nextSibling||(A.parentNode&&this.fnHasNextSibling(A.parentNode))
},fnPoll:function(){if(!this.iAvailable||this.iAvailable!=1){return }var D=new Array();
for(var A=0;A<this.aStack.length;A++){var C=document.getElementById(this.aStack[A].sID);
if(C&&(this.fnHasNextSibling(C)||this.bLoaded)){try{this.aStack[A].fnCallback()}catch(B){if(typeof console!="undefined"){console.error(B)
}else{alert(B.description)}this.bLoaded=true;this.fnStopPolling()}}else{D.push(this.aStack[A])
}}this.aStack=D;if(D.length<1||this.bLoaded){this.fnStopPolling()}},fnStartPolling:function(){if(this.oInterval){return 
}this.oInterval=setInterval(function(){jsCore.fnPoll()},10)},fnStopPolling:function(){if(!this.oInterval){return 
}clearInterval(this.oInterval);this.oInterval=null},fnLastPoll:function(){if(this.bLoaded){return 
}this.bLoaded=true;this.fnPoll()},fnOnAvailable:function(A){this.aStack.push({"sID":A.sId,"fnCallback":A.fnCallback});
this.fnStartPolling()},addListener:function(D){var A;var E;typeof D.sLabel!="undefined"?null:D.sLabel="";
typeof D.oObj!="undefined"?null:D.oObj=null;typeof D.mOverrideScope!="undefined"?null:D.mOverrideScope=null;
if(D.mScope){if(D.mScope===true){A=D.oObj}else{A=D.mScope}}else{A=D.mElement}E=function(F){if(!jsCore){return 0
}else{D.fnCallback.call(A,jsCore._getEvent(F),D.oObj)}return false};if(typeof (D.mElement)=="string"){var C=document.getElementById(D.mElement);
jsCore._addEvent({nNode:C,sType:D.sType,fnCallback:D.fnCallback,fnCallbackWrapped:E,sLabel:D.sLabel})
}else{if(D.mElement){if(D.mElement.nodeName||D.mElement==window){jsCore._addEvent({nNode:D.mElement,sType:D.sType,fnCallback:D.fnCallback,fnCallbackWrapped:E,sLabel:D.sLabel})
}else{for(var B=0;B<D.mElement.length;B++){jsCore._addEvent({nNode:D.mElement[B],sType:D.sType,fnCallback:D.fnCallback,fnCallbackWrapped:E,sLabel:D.sLabel})
}}}}},_addEvent:function(A){this.aEventCache[this.aEventCache.length++]={"nNode":A.nNode,"sType":A.sType,"fnWrapped":A.fnCallbackWrapped,"fn":A.fnCallback,"sLabel":A.sLabel};
if(A.nNode.addEventListener){A.nNode.addEventListener(A.sType,A.fnCallbackWrapped,false)
}else{if(A.nNode.attachEvent){A.nNode.attachEvent("on"+A.sType,A.fnCallbackWrapped)
}}},removeListener:function(B){this.aiDelete=new Array();if(typeof B.sLabel=="string"){for(var A=0;
A<this.aEventCache.length;A++){if(this.aEventCache[A].sLabel==B.sLabel){jsCore._removeEvent({nNode:this.aEventCache[A].nNode,sType:this.aEventCache[A].sType,fn:this.aEventCache[A].fn})
}}}else{if(typeof B.mElement=="string"){nElement=document.getElementById(B.mElement);
jsCore._removeEvent({nNode:nElement,sType:B.sType,fn:B.fnCallback})}else{if(!B.mElement.length){jsCore._removeEvent({nNode:B.mElement,sType:B.sType,fn:B.fnCallback})
}else{for(var A=0;A<B.mElement.length;A++){jsCore._removeEvent({nNode:B.mElement[A],sType:B.sType,fn:B.fnCallback})
}}}}for(var A=this.aiDelete.length-1;A>=0;A--){this.aEventCache.splice(this.aiDelete[A],1)
}},_removeEvent:function(B){for(var A=0;A<this.aEventCache.length;A++){if(B.nNode==this.aEventCache[A].nNode&&B.sType==this.aEventCache[A].sType&&B.fn==this.aEventCache[A].fn){if(B.nNode.removeEventListener){B.nNode.removeEventListener(B.sType,this.aEventCache[A].fnWrapped,false)
}else{if(B.nNode.detachEvent){B.nNode.detachEvent("on"+B.sType,this.aEventCache[A].fnWrapped)
}}break}}this.aiDelete[this.aiDelete.length++]=A},_getEvent:function(A){return A||window.event
},getElementFromEvent:function(A){var B;if(A.target){B=A.target}else{if(A.srcElement){B=A.srcElement
}}if(B.nodeType==3){B=B.parentNode}return(B)},_log_aDatabase:new Array(),fnLog:function(B,A){},_fnLogInit:function(){if(document.addEventListener){document.addEventListener("keydown",this._fnLogShowHide,true)
}else{if(document.attachEvent){document.attachEvent("onkeydown",this._fnLogShowHide)
}}},_fnLogShowHide:function(A){A=A||window.event;var C=A.keyCode||A.which;var B=String.fromCharCode(C).toLowerCase();
if(A.ctrlKey&&A.shiftKey&&B=="l"){alert("target key store detected "+A.shiftKey+" "+B+" "+C)
}}};var jsCore=new JSCore();window.onload=function(){jsCore.fnLastPoll()}