/**!
 * brandy v0.0.0
 * http://www.github.com/rstone770/brandy
 *
 * Release under the MIT license.
 */
!function(r){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=r();else if("function"==typeof define&&define.amd)define([],r);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.Brandy=r()}}(function(){return function r(e,t,n){function o(u,s){if(!t[u]){if(!e[u]){var f="function"==typeof require&&require;if(!s&&f)return f(u,!0);if(i)return i(u,!0);var c=new Error("Cannot find module '"+u+"'");throw c.code="MODULE_NOT_FOUND",c}var l=t[u]={exports:{}};e[u][0].call(l.exports,function(r){var t=e[u][1][r];return o(t?t:r)},l,l.exports,r,e,t,n)}return t[u].exports}for(var i="function"==typeof require&&require,u=0;u<n.length;u++)o(n[u]);return o}({1:[function(r,e,t){var n=r("./lifecycle"),o=function(r,e){return new(Function.bind.apply(r,[null].concat(e)))},i=function(r,e){return function(t){return o(r,e.map(function(r){return t.instance(r)}))}},u=function(r,e){if(null==r)throw new Error("cache must be provided.");if(null==e)throw new Error("registry must be provided.");this._cache=r,this._registry=e};u.prototype.bind=function(r,e,t,n){if(Array.isArray(t)&&3==arguments.length&&(n=t,t=null),null==r)throw new Error("T must be provided.");if(null==typeof e)throw new Error("implementation must be provided.");if(null!=n&&!Array.isArray(n))throw new Error("dependencies must be an array.");return this.factory(r,i(e,n||[]),t)},u.prototype.factory=function(r,e,t){if(null==r)throw new Error("T must be provided.");if("function"!=typeof e)throw new Error("factory must be callable.");return this._registry.set(r,{factory:e,lifecycle:n.parse(t||n.SINGLETON),type:r}),this},u.prototype.instance=function(r){if(null==r)throw new Error("T must be provided.");var e=this._registry.get(r);if(null==e)throw new Error(r+" has not been registered.");var t=null;switch(e.lifecycle){case n.SINGLETON:t=this._resolveSingleton(e);break;case n.TRANSIENT:t=this._resolveTransient(e);break;default:throw new Error("Unsupported lifecycle "+e.lifecycle+".")}if(null==t)throw new Error("An instance for "+r+" could not be constructed.");return t},u.prototype.enumerate=function(){var r=this._registry,e=r.keys();return e.map(function(e){var t=r.get(e),n={factory:t.factory,lifecycle:t.lifecycle,type:t.type};return n})},u.prototype._resolveSingleton=function(r){var e=this._cache.get(r.type);return null==e&&this._cache.set(r.type,e=this._resolveTransient(r)),e},u.prototype._resolveTransient=function(r){return r.factory(this)},e.exports=u},{"./lifecycle":3}],2:[function(r,e,t){var n=r("./container"),o=r("./registry"),i=function(){var r=o.create(),e=o.create();return new n(r,e)};e.exports=i,e.exports.Container=n,e.exports.version="0.0.0"},{"./container":1,"./registry":4}],3:[function(r,e,t){var n={TRANSIENT:"TRANSIENT",SINGLETON:"SINGLETON",parse:function(r){var e=null;if("string"==typeof r){var t=r.toUpperCase();this[t]==t&&(e=this[t])}if(null==e)throw new Error("Unable to parse "+r+" as Lifecycle.");return e}};e.exports=n},{}],4:[function(r,e,t){var n=Object.prototype.hasOwnProperty,o=function(){this._registry={}};o.create=function(){return new o},o.prototype.get=function(r){if("string"!=typeof r)throw new Error("key must be a string.");var e=null;return n.call(this._registry,r)&&(e=this._registry[r]),e},o.prototype.keys=function(){return Object.keys(this._registry)},o.prototype.set=function(r,e){if("string"!=typeof r)throw new Error("key must be a string.");if(null==e)throw new Error("value must be provided.");return this._registry[r]=e,this},e.exports=o},{}]},{},[2])(2)});