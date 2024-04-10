(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/mixpanel-browser/dist/mixpanel.cjs.js
  var require_mixpanel_cjs = __commonJS({
    "node_modules/mixpanel-browser/dist/mixpanel.cjs.js"(exports, module) {
      "use strict";
      var Config = {
        DEBUG: false,
        LIB_VERSION: "2.45.0"
      };
      var window$1;
      if (typeof window === "undefined") {
        loc = {
          hostname: ""
        };
        window$1 = {
          navigator: { userAgent: "" },
          document: {
            location: loc,
            referrer: ""
          },
          screen: { width: 0, height: 0 },
          location: loc
        };
      } else {
        window$1 = window;
      }
      var loc;
      var ArrayProto = Array.prototype;
      var FuncProto = Function.prototype;
      var ObjProto = Object.prototype;
      var slice = ArrayProto.slice;
      var toString = ObjProto.toString;
      var hasOwnProperty = ObjProto.hasOwnProperty;
      var windowConsole = window$1.console;
      var navigator = window$1.navigator;
      var document$1 = window$1.document;
      var windowOpera = window$1.opera;
      var screen = window$1.screen;
      var userAgent = navigator.userAgent;
      var nativeBind = FuncProto.bind;
      var nativeForEach = ArrayProto.forEach;
      var nativeIndexOf = ArrayProto.indexOf;
      var nativeMap = ArrayProto.map;
      var nativeIsArray = Array.isArray;
      var breaker = {};
      var _ = {
        trim: function(str) {
          return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
        }
      };
      var console2 = {
        log: function() {
          if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
            try {
              windowConsole.log.apply(windowConsole, arguments);
            } catch (err) {
              _.each(arguments, function(arg) {
                windowConsole.log(arg);
              });
            }
          }
        },
        warn: function() {
          if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
            var args = ["Mixpanel warning:"].concat(_.toArray(arguments));
            try {
              windowConsole.warn.apply(windowConsole, args);
            } catch (err) {
              _.each(args, function(arg) {
                windowConsole.warn(arg);
              });
            }
          }
        },
        error: function() {
          if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
            var args = ["Mixpanel error:"].concat(_.toArray(arguments));
            try {
              windowConsole.error.apply(windowConsole, args);
            } catch (err) {
              _.each(args, function(arg) {
                windowConsole.error(arg);
              });
            }
          }
        },
        critical: function() {
          if (!_.isUndefined(windowConsole) && windowConsole) {
            var args = ["Mixpanel error:"].concat(_.toArray(arguments));
            try {
              windowConsole.error.apply(windowConsole, args);
            } catch (err) {
              _.each(args, function(arg) {
                windowConsole.error(arg);
              });
            }
          }
        }
      };
      var log_func_with_prefix = function(func, prefix) {
        return function() {
          arguments[0] = "[" + prefix + "] " + arguments[0];
          return func.apply(console2, arguments);
        };
      };
      var console_with_prefix = function(prefix) {
        return {
          log: log_func_with_prefix(console2.log, prefix),
          error: log_func_with_prefix(console2.error, prefix),
          critical: log_func_with_prefix(console2.critical, prefix)
        };
      };
      _.bind = function(func, context) {
        var args, bound;
        if (nativeBind && func.bind === nativeBind) {
          return nativeBind.apply(func, slice.call(arguments, 1));
        }
        if (!_.isFunction(func)) {
          throw new TypeError();
        }
        args = slice.call(arguments, 2);
        bound = function() {
          if (!(this instanceof bound)) {
            return func.apply(context, args.concat(slice.call(arguments)));
          }
          var ctor = {};
          ctor.prototype = func.prototype;
          var self = new ctor();
          ctor.prototype = null;
          var result = func.apply(self, args.concat(slice.call(arguments)));
          if (Object(result) === result) {
            return result;
          }
          return self;
        };
        return bound;
      };
      _.each = function(obj, iterator, context) {
        if (obj === null || obj === void 0) {
          return;
        }
        if (nativeForEach && obj.forEach === nativeForEach) {
          obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
          for (var i = 0, l = obj.length; i < l; i++) {
            if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
              return;
            }
          }
        } else {
          for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
              if (iterator.call(context, obj[key], key, obj) === breaker) {
                return;
              }
            }
          }
        }
      };
      _.extend = function(obj) {
        _.each(slice.call(arguments, 1), function(source) {
          for (var prop in source) {
            if (source[prop] !== void 0) {
              obj[prop] = source[prop];
            }
          }
        });
        return obj;
      };
      _.isArray = nativeIsArray || function(obj) {
        return toString.call(obj) === "[object Array]";
      };
      _.isFunction = function(f) {
        try {
          return /^\s*\bfunction\b/.test(f);
        } catch (x) {
          return false;
        }
      };
      _.isArguments = function(obj) {
        return !!(obj && hasOwnProperty.call(obj, "callee"));
      };
      _.toArray = function(iterable) {
        if (!iterable) {
          return [];
        }
        if (iterable.toArray) {
          return iterable.toArray();
        }
        if (_.isArray(iterable)) {
          return slice.call(iterable);
        }
        if (_.isArguments(iterable)) {
          return slice.call(iterable);
        }
        return _.values(iterable);
      };
      _.map = function(arr, callback, context) {
        if (nativeMap && arr.map === nativeMap) {
          return arr.map(callback, context);
        } else {
          var results = [];
          _.each(arr, function(item) {
            results.push(callback.call(context, item));
          });
          return results;
        }
      };
      _.keys = function(obj) {
        var results = [];
        if (obj === null) {
          return results;
        }
        _.each(obj, function(value, key) {
          results[results.length] = key;
        });
        return results;
      };
      _.values = function(obj) {
        var results = [];
        if (obj === null) {
          return results;
        }
        _.each(obj, function(value) {
          results[results.length] = value;
        });
        return results;
      };
      _.include = function(obj, target) {
        var found = false;
        if (obj === null) {
          return found;
        }
        if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
          return obj.indexOf(target) != -1;
        }
        _.each(obj, function(value) {
          if (found || (found = value === target)) {
            return breaker;
          }
        });
        return found;
      };
      _.includes = function(str, needle) {
        return str.indexOf(needle) !== -1;
      };
      _.inherit = function(subclass, superclass) {
        subclass.prototype = new superclass();
        subclass.prototype.constructor = subclass;
        subclass.superclass = superclass.prototype;
        return subclass;
      };
      _.isObject = function(obj) {
        return obj === Object(obj) && !_.isArray(obj);
      };
      _.isEmptyObject = function(obj) {
        if (_.isObject(obj)) {
          for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
              return false;
            }
          }
          return true;
        }
        return false;
      };
      _.isUndefined = function(obj) {
        return obj === void 0;
      };
      _.isString = function(obj) {
        return toString.call(obj) == "[object String]";
      };
      _.isDate = function(obj) {
        return toString.call(obj) == "[object Date]";
      };
      _.isNumber = function(obj) {
        return toString.call(obj) == "[object Number]";
      };
      _.isElement = function(obj) {
        return !!(obj && obj.nodeType === 1);
      };
      _.encodeDates = function(obj) {
        _.each(obj, function(v, k) {
          if (_.isDate(v)) {
            obj[k] = _.formatDate(v);
          } else if (_.isObject(v)) {
            obj[k] = _.encodeDates(v);
          }
        });
        return obj;
      };
      _.timestamp = function() {
        Date.now = Date.now || function() {
          return +new Date();
        };
        return Date.now();
      };
      _.formatDate = function(d) {
        function pad(n) {
          return n < 10 ? "0" + n : n;
        }
        return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds());
      };
      _.strip_empty_properties = function(p) {
        var ret = {};
        _.each(p, function(v, k) {
          if (_.isString(v) && v.length > 0) {
            ret[k] = v;
          }
        });
        return ret;
      };
      _.truncate = function(obj, length) {
        var ret;
        if (typeof obj === "string") {
          ret = obj.slice(0, length);
        } else if (_.isArray(obj)) {
          ret = [];
          _.each(obj, function(val) {
            ret.push(_.truncate(val, length));
          });
        } else if (_.isObject(obj)) {
          ret = {};
          _.each(obj, function(val, key) {
            ret[key] = _.truncate(val, length);
          });
        } else {
          ret = obj;
        }
        return ret;
      };
      _.JSONEncode = function() {
        return function(mixed_val) {
          var value = mixed_val;
          var quote = function(string) {
            var escapable = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            var meta = {
              "\b": "\\b",
              "	": "\\t",
              "\n": "\\n",
              "\f": "\\f",
              "\r": "\\r",
              '"': '\\"',
              "\\": "\\\\"
            };
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
              var c = meta[a];
              return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
          };
          var str = function(key, holder) {
            var gap = "";
            var indent = "    ";
            var i = 0;
            var k = "";
            var v = "";
            var length = 0;
            var mind = gap;
            var partial = [];
            var value2 = holder[key];
            if (value2 && typeof value2 === "object" && typeof value2.toJSON === "function") {
              value2 = value2.toJSON(key);
            }
            switch (typeof value2) {
              case "string":
                return quote(value2);
              case "number":
                return isFinite(value2) ? String(value2) : "null";
              case "boolean":
              case "null":
                return String(value2);
              case "object":
                if (!value2) {
                  return "null";
                }
                gap += indent;
                partial = [];
                if (toString.apply(value2) === "[object Array]") {
                  length = value2.length;
                  for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value2) || "null";
                  }
                  v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                  gap = mind;
                  return v;
                }
                for (k in value2) {
                  if (hasOwnProperty.call(value2, k)) {
                    v = str(k, value2);
                    if (v) {
                      partial.push(quote(k) + (gap ? ": " : ":") + v);
                    }
                  }
                }
                v = partial.length === 0 ? "{}" : gap ? "{" + partial.join(",") + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
            }
          };
          return str("", {
            "": value
          });
        };
      }();
      _.JSONDecode = function() {
        var at, ch, escapee = {
          '"': '"',
          "\\": "\\",
          "/": "/",
          "b": "\b",
          "f": "\f",
          "n": "\n",
          "r": "\r",
          "t": "	"
        }, text, error = function(m) {
          var e = new SyntaxError(m);
          e.at = at;
          e.text = text;
          throw e;
        }, next = function(c) {
          if (c && c !== ch) {
            error("Expected '" + c + "' instead of '" + ch + "'");
          }
          ch = text.charAt(at);
          at += 1;
          return ch;
        }, number = function() {
          var number2, string2 = "";
          if (ch === "-") {
            string2 = "-";
            next("-");
          }
          while (ch >= "0" && ch <= "9") {
            string2 += ch;
            next();
          }
          if (ch === ".") {
            string2 += ".";
            while (next() && ch >= "0" && ch <= "9") {
              string2 += ch;
            }
          }
          if (ch === "e" || ch === "E") {
            string2 += ch;
            next();
            if (ch === "-" || ch === "+") {
              string2 += ch;
              next();
            }
            while (ch >= "0" && ch <= "9") {
              string2 += ch;
              next();
            }
          }
          number2 = +string2;
          if (!isFinite(number2)) {
            error("Bad number");
          } else {
            return number2;
          }
        }, string = function() {
          var hex, i, string2 = "", uffff;
          if (ch === '"') {
            while (next()) {
              if (ch === '"') {
                next();
                return string2;
              }
              if (ch === "\\") {
                next();
                if (ch === "u") {
                  uffff = 0;
                  for (i = 0; i < 4; i += 1) {
                    hex = parseInt(next(), 16);
                    if (!isFinite(hex)) {
                      break;
                    }
                    uffff = uffff * 16 + hex;
                  }
                  string2 += String.fromCharCode(uffff);
                } else if (typeof escapee[ch] === "string") {
                  string2 += escapee[ch];
                } else {
                  break;
                }
              } else {
                string2 += ch;
              }
            }
          }
          error("Bad string");
        }, white = function() {
          while (ch && ch <= " ") {
            next();
          }
        }, word = function() {
          switch (ch) {
            case "t":
              next("t");
              next("r");
              next("u");
              next("e");
              return true;
            case "f":
              next("f");
              next("a");
              next("l");
              next("s");
              next("e");
              return false;
            case "n":
              next("n");
              next("u");
              next("l");
              next("l");
              return null;
          }
          error('Unexpected "' + ch + '"');
        }, value, array = function() {
          var array2 = [];
          if (ch === "[") {
            next("[");
            white();
            if (ch === "]") {
              next("]");
              return array2;
            }
            while (ch) {
              array2.push(value());
              white();
              if (ch === "]") {
                next("]");
                return array2;
              }
              next(",");
              white();
            }
          }
          error("Bad array");
        }, object = function() {
          var key, object2 = {};
          if (ch === "{") {
            next("{");
            white();
            if (ch === "}") {
              next("}");
              return object2;
            }
            while (ch) {
              key = string();
              white();
              next(":");
              if (Object.hasOwnProperty.call(object2, key)) {
                error('Duplicate key "' + key + '"');
              }
              object2[key] = value();
              white();
              if (ch === "}") {
                next("}");
                return object2;
              }
              next(",");
              white();
            }
          }
          error("Bad object");
        };
        value = function() {
          white();
          switch (ch) {
            case "{":
              return object();
            case "[":
              return array();
            case '"':
              return string();
            case "-":
              return number();
            default:
              return ch >= "0" && ch <= "9" ? number() : word();
          }
        };
        return function(source) {
          var result;
          text = source;
          at = 0;
          ch = " ";
          result = value();
          white();
          if (ch) {
            error("Syntax error");
          }
          return result;
        };
      }();
      _.base64Encode = function(data) {
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = "", tmp_arr = [];
        if (!data) {
          return data;
        }
        data = _.utf8Encode(data);
        do {
          o1 = data.charCodeAt(i++);
          o2 = data.charCodeAt(i++);
          o3 = data.charCodeAt(i++);
          bits = o1 << 16 | o2 << 8 | o3;
          h1 = bits >> 18 & 63;
          h2 = bits >> 12 & 63;
          h3 = bits >> 6 & 63;
          h4 = bits & 63;
          tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);
        enc = tmp_arr.join("");
        switch (data.length % 3) {
          case 1:
            enc = enc.slice(0, -2) + "==";
            break;
          case 2:
            enc = enc.slice(0, -1) + "=";
            break;
        }
        return enc;
      };
      _.utf8Encode = function(string) {
        string = (string + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        var utftext = "", start, end;
        var stringl = 0, n;
        start = end = 0;
        stringl = string.length;
        for (n = 0; n < stringl; n++) {
          var c1 = string.charCodeAt(n);
          var enc = null;
          if (c1 < 128) {
            end++;
          } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(c1 >> 6 | 192, c1 & 63 | 128);
          } else {
            enc = String.fromCharCode(c1 >> 12 | 224, c1 >> 6 & 63 | 128, c1 & 63 | 128);
          }
          if (enc !== null) {
            if (end > start) {
              utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n + 1;
          }
        }
        if (end > start) {
          utftext += string.substring(start, string.length);
        }
        return utftext;
      };
      _.UUID = function() {
        var T = function() {
          var d = 1 * new Date(), i = 0;
          while (d == 1 * new Date()) {
            i++;
          }
          return d.toString(16) + i.toString(16);
        };
        var R = function() {
          return Math.random().toString(16).replace(".", "");
        };
        var UA = function() {
          var ua = userAgent, i, ch, buffer = [], ret = 0;
          function xor(result, byte_array) {
            var j, tmp = 0;
            for (j = 0; j < byte_array.length; j++) {
              tmp |= buffer[j] << j * 8;
            }
            return result ^ tmp;
          }
          for (i = 0; i < ua.length; i++) {
            ch = ua.charCodeAt(i);
            buffer.unshift(ch & 255);
            if (buffer.length >= 4) {
              ret = xor(ret, buffer);
              buffer = [];
            }
          }
          if (buffer.length > 0) {
            ret = xor(ret, buffer);
          }
          return ret.toString(16);
        };
        return function() {
          var se = (screen.height * screen.width).toString(16);
          return T() + "-" + R() + "-" + UA() + "-" + se + "-" + T();
        };
      }();
      var BLOCKED_UA_STRS = [
        "ahrefsbot",
        "baiduspider",
        "bingbot",
        "bingpreview",
        "facebookexternal",
        "petalbot",
        "pinterest",
        "screaming frog",
        "yahoo! slurp",
        "yandexbot",
        "adsbot-google",
        "apis-google",
        "duplexweb-google",
        "feedfetcher-google",
        "google favicon",
        "google web preview",
        "google-read-aloud",
        "googlebot",
        "googleweblight",
        "mediapartners-google",
        "storebot-google"
      ];
      _.isBlockedUA = function(ua) {
        var i;
        ua = ua.toLowerCase();
        for (i = 0; i < BLOCKED_UA_STRS.length; i++) {
          if (ua.indexOf(BLOCKED_UA_STRS[i]) !== -1) {
            return true;
          }
        }
        return false;
      };
      _.HTTPBuildQuery = function(formdata, arg_separator) {
        var use_val, use_key, tmp_arr = [];
        if (_.isUndefined(arg_separator)) {
          arg_separator = "&";
        }
        _.each(formdata, function(val, key) {
          use_val = encodeURIComponent(val.toString());
          use_key = encodeURIComponent(key);
          tmp_arr[tmp_arr.length] = use_key + "=" + use_val;
        });
        return tmp_arr.join(arg_separator);
      };
      _.getQueryParam = function(url, param) {
        param = param.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
        var regexS = "[\\?&]" + param + "=([^&#]*)", regex = new RegExp(regexS), results = regex.exec(url);
        if (results === null || results && typeof results[1] !== "string" && results[1].length) {
          return "";
        } else {
          var result = results[1];
          try {
            result = decodeURIComponent(result);
          } catch (err) {
            console2.error("Skipping decoding for malformed query param: " + result);
          }
          return result.replace(/\+/g, " ");
        }
      };
      _.cookie = {
        get: function(name) {
          var nameEQ = name + "=";
          var ca = document$1.cookie.split(";");
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
              c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
              return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
          }
          return null;
        },
        parse: function(name) {
          var cookie;
          try {
            cookie = _.JSONDecode(_.cookie.get(name)) || {};
          } catch (err) {
          }
          return cookie;
        },
        set_seconds: function(name, value, seconds, is_cross_subdomain, is_secure, is_cross_site, domain_override) {
          var cdomain = "", expires = "", secure = "";
          if (domain_override) {
            cdomain = "; domain=" + domain_override;
          } else if (is_cross_subdomain) {
            var domain = extract_domain(document$1.location.hostname);
            cdomain = domain ? "; domain=." + domain : "";
          }
          if (seconds) {
            var date = new Date();
            date.setTime(date.getTime() + seconds * 1e3);
            expires = "; expires=" + date.toGMTString();
          }
          if (is_cross_site) {
            is_secure = true;
            secure = "; SameSite=None";
          }
          if (is_secure) {
            secure += "; secure";
          }
          document$1.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/" + cdomain + secure;
        },
        set: function(name, value, days, is_cross_subdomain, is_secure, is_cross_site, domain_override) {
          var cdomain = "", expires = "", secure = "";
          if (domain_override) {
            cdomain = "; domain=" + domain_override;
          } else if (is_cross_subdomain) {
            var domain = extract_domain(document$1.location.hostname);
            cdomain = domain ? "; domain=." + domain : "";
          }
          if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1e3);
            expires = "; expires=" + date.toGMTString();
          }
          if (is_cross_site) {
            is_secure = true;
            secure = "; SameSite=None";
          }
          if (is_secure) {
            secure += "; secure";
          }
          var new_cookie_val = name + "=" + encodeURIComponent(value) + expires + "; path=/" + cdomain + secure;
          document$1.cookie = new_cookie_val;
          return new_cookie_val;
        },
        remove: function(name, is_cross_subdomain, domain_override) {
          _.cookie.set(name, "", -1, is_cross_subdomain, false, false, domain_override);
        }
      };
      var _localStorageSupported = null;
      var localStorageSupported = function(storage, forceCheck) {
        if (_localStorageSupported !== null && !forceCheck) {
          return _localStorageSupported;
        }
        var supported = true;
        try {
          storage = storage || window.localStorage;
          var key = "__mplss_" + cheap_guid(8), val = "xyz";
          storage.setItem(key, val);
          if (storage.getItem(key) !== val) {
            supported = false;
          }
          storage.removeItem(key);
        } catch (err) {
          supported = false;
        }
        _localStorageSupported = supported;
        return supported;
      };
      _.localStorage = {
        is_supported: function(force_check) {
          var supported = localStorageSupported(null, force_check);
          if (!supported) {
            console2.error("localStorage unsupported; falling back to cookie store");
          }
          return supported;
        },
        error: function(msg) {
          console2.error("localStorage error: " + msg);
        },
        get: function(name) {
          try {
            return window.localStorage.getItem(name);
          } catch (err) {
            _.localStorage.error(err);
          }
          return null;
        },
        parse: function(name) {
          try {
            return _.JSONDecode(_.localStorage.get(name)) || {};
          } catch (err) {
          }
          return null;
        },
        set: function(name, value) {
          try {
            window.localStorage.setItem(name, value);
          } catch (err) {
            _.localStorage.error(err);
          }
        },
        remove: function(name) {
          try {
            window.localStorage.removeItem(name);
          } catch (err) {
            _.localStorage.error(err);
          }
        }
      };
      _.register_event = function() {
        var register_event = function(element, type, handler, oldSchool, useCapture) {
          if (!element) {
            console2.error("No valid element provided to register_event");
            return;
          }
          if (element.addEventListener && !oldSchool) {
            element.addEventListener(type, handler, !!useCapture);
          } else {
            var ontype = "on" + type;
            var old_handler = element[ontype];
            element[ontype] = makeHandler(element, handler, old_handler);
          }
        };
        function makeHandler(element, new_handler, old_handlers) {
          var handler = function(event) {
            event = event || fixEvent(window.event);
            if (!event) {
              return void 0;
            }
            var ret = true;
            var old_result, new_result;
            if (_.isFunction(old_handlers)) {
              old_result = old_handlers(event);
            }
            new_result = new_handler.call(element, event);
            if (false === old_result || false === new_result) {
              ret = false;
            }
            return ret;
          };
          return handler;
        }
        function fixEvent(event) {
          if (event) {
            event.preventDefault = fixEvent.preventDefault;
            event.stopPropagation = fixEvent.stopPropagation;
          }
          return event;
        }
        fixEvent.preventDefault = function() {
          this.returnValue = false;
        };
        fixEvent.stopPropagation = function() {
          this.cancelBubble = true;
        };
        return register_event;
      }();
      var TOKEN_MATCH_REGEX = new RegExp('^(\\w*)\\[(\\w+)([=~\\|\\^\\$\\*]?)=?"?([^\\]"]*)"?\\]$');
      _.dom_query = function() {
        function getAllChildren(e) {
          return e.all ? e.all : e.getElementsByTagName("*");
        }
        var bad_whitespace = /[\t\r\n]/g;
        function hasClass(elem, selector) {
          var className = " " + selector + " ";
          return (" " + elem.className + " ").replace(bad_whitespace, " ").indexOf(className) >= 0;
        }
        function getElementsBySelector(selector) {
          if (!document$1.getElementsByTagName) {
            return [];
          }
          var tokens = selector.split(" ");
          var token, bits, tagName, found, foundCount, i, j, k, elements, currentContextIndex;
          var currentContext = [document$1];
          for (i = 0; i < tokens.length; i++) {
            token = tokens[i].replace(/^\s+/, "").replace(/\s+$/, "");
            if (token.indexOf("#") > -1) {
              bits = token.split("#");
              tagName = bits[0];
              var id = bits[1];
              var element = document$1.getElementById(id);
              if (!element || tagName && element.nodeName.toLowerCase() != tagName) {
                return [];
              }
              currentContext = [element];
              continue;
            }
            if (token.indexOf(".") > -1) {
              bits = token.split(".");
              tagName = bits[0];
              var className = bits[1];
              if (!tagName) {
                tagName = "*";
              }
              found = [];
              foundCount = 0;
              for (j = 0; j < currentContext.length; j++) {
                if (tagName == "*") {
                  elements = getAllChildren(currentContext[j]);
                } else {
                  elements = currentContext[j].getElementsByTagName(tagName);
                }
                for (k = 0; k < elements.length; k++) {
                  found[foundCount++] = elements[k];
                }
              }
              currentContext = [];
              currentContextIndex = 0;
              for (j = 0; j < found.length; j++) {
                if (found[j].className && _.isString(found[j].className) && hasClass(found[j], className)) {
                  currentContext[currentContextIndex++] = found[j];
                }
              }
              continue;
            }
            var token_match = token.match(TOKEN_MATCH_REGEX);
            if (token_match) {
              tagName = token_match[1];
              var attrName = token_match[2];
              var attrOperator = token_match[3];
              var attrValue = token_match[4];
              if (!tagName) {
                tagName = "*";
              }
              found = [];
              foundCount = 0;
              for (j = 0; j < currentContext.length; j++) {
                if (tagName == "*") {
                  elements = getAllChildren(currentContext[j]);
                } else {
                  elements = currentContext[j].getElementsByTagName(tagName);
                }
                for (k = 0; k < elements.length; k++) {
                  found[foundCount++] = elements[k];
                }
              }
              currentContext = [];
              currentContextIndex = 0;
              var checkFunction;
              switch (attrOperator) {
                case "=":
                  checkFunction = function(e) {
                    return e.getAttribute(attrName) == attrValue;
                  };
                  break;
                case "~":
                  checkFunction = function(e) {
                    return e.getAttribute(attrName).match(new RegExp("\\b" + attrValue + "\\b"));
                  };
                  break;
                case "|":
                  checkFunction = function(e) {
                    return e.getAttribute(attrName).match(new RegExp("^" + attrValue + "-?"));
                  };
                  break;
                case "^":
                  checkFunction = function(e) {
                    return e.getAttribute(attrName).indexOf(attrValue) === 0;
                  };
                  break;
                case "$":
                  checkFunction = function(e) {
                    return e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length;
                  };
                  break;
                case "*":
                  checkFunction = function(e) {
                    return e.getAttribute(attrName).indexOf(attrValue) > -1;
                  };
                  break;
                default:
                  checkFunction = function(e) {
                    return e.getAttribute(attrName);
                  };
              }
              currentContext = [];
              currentContextIndex = 0;
              for (j = 0; j < found.length; j++) {
                if (checkFunction(found[j])) {
                  currentContext[currentContextIndex++] = found[j];
                }
              }
              continue;
            }
            tagName = token;
            found = [];
            foundCount = 0;
            for (j = 0; j < currentContext.length; j++) {
              elements = currentContext[j].getElementsByTagName(tagName);
              for (k = 0; k < elements.length; k++) {
                found[foundCount++] = elements[k];
              }
            }
            currentContext = found;
          }
          return currentContext;
        }
        return function(query) {
          if (_.isElement(query)) {
            return [query];
          } else if (_.isObject(query) && !_.isUndefined(query.length)) {
            return query;
          } else {
            return getElementsBySelector.call(this, query);
          }
        };
      }();
      _.info = {
        campaignParams: function() {
          var campaign_keywords = "utm_source utm_medium utm_campaign utm_content utm_term".split(" "), kw = "", params = {};
          _.each(campaign_keywords, function(kwkey) {
            kw = _.getQueryParam(document$1.URL, kwkey);
            if (kw.length) {
              params[kwkey] = kw;
            }
          });
          return params;
        },
        searchEngine: function(referrer) {
          if (referrer.search("https?://(.*)google.([^/?]*)") === 0) {
            return "google";
          } else if (referrer.search("https?://(.*)bing.com") === 0) {
            return "bing";
          } else if (referrer.search("https?://(.*)yahoo.com") === 0) {
            return "yahoo";
          } else if (referrer.search("https?://(.*)duckduckgo.com") === 0) {
            return "duckduckgo";
          } else {
            return null;
          }
        },
        searchInfo: function(referrer) {
          var search = _.info.searchEngine(referrer), param = search != "yahoo" ? "q" : "p", ret = {};
          if (search !== null) {
            ret["$search_engine"] = search;
            var keyword = _.getQueryParam(referrer, param);
            if (keyword.length) {
              ret["mp_keyword"] = keyword;
            }
          }
          return ret;
        },
        browser: function(user_agent, vendor, opera) {
          vendor = vendor || "";
          if (opera || _.includes(user_agent, " OPR/")) {
            if (_.includes(user_agent, "Mini")) {
              return "Opera Mini";
            }
            return "Opera";
          } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
            return "BlackBerry";
          } else if (_.includes(user_agent, "IEMobile") || _.includes(user_agent, "WPDesktop")) {
            return "Internet Explorer Mobile";
          } else if (_.includes(user_agent, "SamsungBrowser/")) {
            return "Samsung Internet";
          } else if (_.includes(user_agent, "Edge") || _.includes(user_agent, "Edg/")) {
            return "Microsoft Edge";
          } else if (_.includes(user_agent, "FBIOS")) {
            return "Facebook Mobile";
          } else if (_.includes(user_agent, "Chrome")) {
            return "Chrome";
          } else if (_.includes(user_agent, "CriOS")) {
            return "Chrome iOS";
          } else if (_.includes(user_agent, "UCWEB") || _.includes(user_agent, "UCBrowser")) {
            return "UC Browser";
          } else if (_.includes(user_agent, "FxiOS")) {
            return "Firefox iOS";
          } else if (_.includes(vendor, "Apple")) {
            if (_.includes(user_agent, "Mobile")) {
              return "Mobile Safari";
            }
            return "Safari";
          } else if (_.includes(user_agent, "Android")) {
            return "Android Mobile";
          } else if (_.includes(user_agent, "Konqueror")) {
            return "Konqueror";
          } else if (_.includes(user_agent, "Firefox")) {
            return "Firefox";
          } else if (_.includes(user_agent, "MSIE") || _.includes(user_agent, "Trident/")) {
            return "Internet Explorer";
          } else if (_.includes(user_agent, "Gecko")) {
            return "Mozilla";
          } else {
            return "";
          }
        },
        browserVersion: function(userAgent2, vendor, opera) {
          var browser = _.info.browser(userAgent2, vendor, opera);
          var versionRegexs = {
            "Internet Explorer Mobile": /rv:(\d+(\.\d+)?)/,
            "Microsoft Edge": /Edge?\/(\d+(\.\d+)?)/,
            "Chrome": /Chrome\/(\d+(\.\d+)?)/,
            "Chrome iOS": /CriOS\/(\d+(\.\d+)?)/,
            "UC Browser": /(UCBrowser|UCWEB)\/(\d+(\.\d+)?)/,
            "Safari": /Version\/(\d+(\.\d+)?)/,
            "Mobile Safari": /Version\/(\d+(\.\d+)?)/,
            "Opera": /(Opera|OPR)\/(\d+(\.\d+)?)/,
            "Firefox": /Firefox\/(\d+(\.\d+)?)/,
            "Firefox iOS": /FxiOS\/(\d+(\.\d+)?)/,
            "Konqueror": /Konqueror:(\d+(\.\d+)?)/,
            "BlackBerry": /BlackBerry (\d+(\.\d+)?)/,
            "Android Mobile": /android\s(\d+(\.\d+)?)/,
            "Samsung Internet": /SamsungBrowser\/(\d+(\.\d+)?)/,
            "Internet Explorer": /(rv:|MSIE )(\d+(\.\d+)?)/,
            "Mozilla": /rv:(\d+(\.\d+)?)/
          };
          var regex = versionRegexs[browser];
          if (regex === void 0) {
            return null;
          }
          var matches = userAgent2.match(regex);
          if (!matches) {
            return null;
          }
          return parseFloat(matches[matches.length - 2]);
        },
        os: function() {
          var a = userAgent;
          if (/Windows/i.test(a)) {
            if (/Phone/.test(a) || /WPDesktop/.test(a)) {
              return "Windows Phone";
            }
            return "Windows";
          } else if (/(iPhone|iPad|iPod)/.test(a)) {
            return "iOS";
          } else if (/Android/.test(a)) {
            return "Android";
          } else if (/(BlackBerry|PlayBook|BB10)/i.test(a)) {
            return "BlackBerry";
          } else if (/Mac/i.test(a)) {
            return "Mac OS X";
          } else if (/Linux/.test(a)) {
            return "Linux";
          } else if (/CrOS/.test(a)) {
            return "Chrome OS";
          } else {
            return "";
          }
        },
        device: function(user_agent) {
          if (/Windows Phone/i.test(user_agent) || /WPDesktop/.test(user_agent)) {
            return "Windows Phone";
          } else if (/iPad/.test(user_agent)) {
            return "iPad";
          } else if (/iPod/.test(user_agent)) {
            return "iPod Touch";
          } else if (/iPhone/.test(user_agent)) {
            return "iPhone";
          } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
            return "BlackBerry";
          } else if (/Android/.test(user_agent)) {
            return "Android";
          } else {
            return "";
          }
        },
        referringDomain: function(referrer) {
          var split = referrer.split("/");
          if (split.length >= 3) {
            return split[2];
          }
          return "";
        },
        properties: function() {
          return _.extend(_.strip_empty_properties({
            "$os": _.info.os(),
            "$browser": _.info.browser(userAgent, navigator.vendor, windowOpera),
            "$referrer": document$1.referrer,
            "$referring_domain": _.info.referringDomain(document$1.referrer),
            "$device": _.info.device(userAgent)
          }), {
            "$current_url": window$1.location.href,
            "$browser_version": _.info.browserVersion(userAgent, navigator.vendor, windowOpera),
            "$screen_height": screen.height,
            "$screen_width": screen.width,
            "mp_lib": "web",
            "$lib_version": Config.LIB_VERSION,
            "$insert_id": cheap_guid(),
            "time": _.timestamp() / 1e3
          });
        },
        people_properties: function() {
          return _.extend(_.strip_empty_properties({
            "$os": _.info.os(),
            "$browser": _.info.browser(userAgent, navigator.vendor, windowOpera)
          }), {
            "$browser_version": _.info.browserVersion(userAgent, navigator.vendor, windowOpera)
          });
        },
        pageviewInfo: function(page) {
          return _.strip_empty_properties({
            "mp_page": page,
            "mp_referrer": document$1.referrer,
            "mp_browser": _.info.browser(userAgent, navigator.vendor, windowOpera),
            "mp_platform": _.info.os()
          });
        }
      };
      var cheap_guid = function(maxlen) {
        var guid = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
        return maxlen ? guid.substring(0, maxlen) : guid;
      };
      var SIMPLE_DOMAIN_MATCH_REGEX = /[a-z0-9][a-z0-9-]*\.[a-z]+$/i;
      var DOMAIN_MATCH_REGEX = /[a-z0-9][a-z0-9-]+\.[a-z.]{2,6}$/i;
      var extract_domain = function(hostname) {
        var domain_regex = DOMAIN_MATCH_REGEX;
        var parts = hostname.split(".");
        var tld = parts[parts.length - 1];
        if (tld.length > 4 || tld === "com" || tld === "org") {
          domain_regex = SIMPLE_DOMAIN_MATCH_REGEX;
        }
        var matches = hostname.match(domain_regex);
        return matches ? matches[0] : "";
      };
      var JSONStringify = null;
      var JSONParse = null;
      if (typeof JSON !== "undefined") {
        JSONStringify = JSON.stringify;
        JSONParse = JSON.parse;
      }
      JSONStringify = JSONStringify || _.JSONEncode;
      JSONParse = JSONParse || _.JSONDecode;
      _["toArray"] = _.toArray;
      _["isObject"] = _.isObject;
      _["JSONEncode"] = _.JSONEncode;
      _["JSONDecode"] = _.JSONDecode;
      _["isBlockedUA"] = _.isBlockedUA;
      _["isEmptyObject"] = _.isEmptyObject;
      _["info"] = _.info;
      _["info"]["device"] = _.info.device;
      _["info"]["browser"] = _.info.browser;
      _["info"]["browserVersion"] = _.info.browserVersion;
      _["info"]["properties"] = _.info.properties;
      var DomTracker = function() {
      };
      DomTracker.prototype.create_properties = function() {
      };
      DomTracker.prototype.event_handler = function() {
      };
      DomTracker.prototype.after_track_handler = function() {
      };
      DomTracker.prototype.init = function(mixpanel_instance) {
        this.mp = mixpanel_instance;
        return this;
      };
      DomTracker.prototype.track = function(query, event_name, properties, user_callback) {
        var that = this;
        var elements = _.dom_query(query);
        if (elements.length === 0) {
          console2.error("The DOM query (" + query + ") returned 0 elements");
          return;
        }
        _.each(elements, function(element) {
          _.register_event(element, this.override_event, function(e) {
            var options = {};
            var props = that.create_properties(properties, this);
            var timeout = that.mp.get_config("track_links_timeout");
            that.event_handler(e, this, options);
            window.setTimeout(that.track_callback(user_callback, props, options, true), timeout);
            that.mp.track(event_name, props, that.track_callback(user_callback, props, options));
          });
        }, this);
        return true;
      };
      DomTracker.prototype.track_callback = function(user_callback, props, options, timeout_occured) {
        timeout_occured = timeout_occured || false;
        var that = this;
        return function() {
          if (options.callback_fired) {
            return;
          }
          options.callback_fired = true;
          if (user_callback && user_callback(timeout_occured, props) === false) {
            return;
          }
          that.after_track_handler(props, options, timeout_occured);
        };
      };
      DomTracker.prototype.create_properties = function(properties, element) {
        var props;
        if (typeof properties === "function") {
          props = properties(element);
        } else {
          props = _.extend({}, properties);
        }
        return props;
      };
      var LinkTracker = function() {
        this.override_event = "click";
      };
      _.inherit(LinkTracker, DomTracker);
      LinkTracker.prototype.create_properties = function(properties, element) {
        var props = LinkTracker.superclass.create_properties.apply(this, arguments);
        if (element.href) {
          props["url"] = element.href;
        }
        return props;
      };
      LinkTracker.prototype.event_handler = function(evt, element, options) {
        options.new_tab = evt.which === 2 || evt.metaKey || evt.ctrlKey || element.target === "_blank";
        options.href = element.href;
        if (!options.new_tab) {
          evt.preventDefault();
        }
      };
      LinkTracker.prototype.after_track_handler = function(props, options) {
        if (options.new_tab) {
          return;
        }
        setTimeout(function() {
          window.location = options.href;
        }, 0);
      };
      var FormTracker = function() {
        this.override_event = "submit";
      };
      _.inherit(FormTracker, DomTracker);
      FormTracker.prototype.event_handler = function(evt, element, options) {
        options.element = element;
        evt.preventDefault();
      };
      FormTracker.prototype.after_track_handler = function(props, options) {
        setTimeout(function() {
          options.element.submit();
        }, 0);
      };
      var logger$2 = console_with_prefix("lock");
      var SharedLock = function(key, options) {
        options = options || {};
        this.storageKey = key;
        this.storage = options.storage || window.localStorage;
        this.pollIntervalMS = options.pollIntervalMS || 100;
        this.timeoutMS = options.timeoutMS || 2e3;
      };
      SharedLock.prototype.withLock = function(lockedCB, errorCB, pid) {
        if (!pid && typeof errorCB !== "function") {
          pid = errorCB;
          errorCB = null;
        }
        var i = pid || new Date().getTime() + "|" + Math.random();
        var startTime = new Date().getTime();
        var key = this.storageKey;
        var pollIntervalMS = this.pollIntervalMS;
        var timeoutMS = this.timeoutMS;
        var storage = this.storage;
        var keyX = key + ":X";
        var keyY = key + ":Y";
        var keyZ = key + ":Z";
        var reportError = function(err) {
          errorCB && errorCB(err);
        };
        var delay = function(cb) {
          if (new Date().getTime() - startTime > timeoutMS) {
            logger$2.error("Timeout waiting for mutex on " + key + "; clearing lock. [" + i + "]");
            storage.removeItem(keyZ);
            storage.removeItem(keyY);
            loop();
            return;
          }
          setTimeout(function() {
            try {
              cb();
            } catch (err) {
              reportError(err);
            }
          }, pollIntervalMS * (Math.random() + 0.1));
        };
        var waitFor = function(predicate, cb) {
          if (predicate()) {
            cb();
          } else {
            delay(function() {
              waitFor(predicate, cb);
            });
          }
        };
        var getSetY = function() {
          var valY = storage.getItem(keyY);
          if (valY && valY !== i) {
            return false;
          } else {
            storage.setItem(keyY, i);
            if (storage.getItem(keyY) === i) {
              return true;
            } else {
              if (!localStorageSupported(storage, true)) {
                throw new Error("localStorage support dropped while acquiring lock");
              }
              return false;
            }
          }
        };
        var loop = function() {
          storage.setItem(keyX, i);
          waitFor(getSetY, function() {
            if (storage.getItem(keyX) === i) {
              criticalSection();
              return;
            }
            delay(function() {
              if (storage.getItem(keyY) !== i) {
                loop();
                return;
              }
              waitFor(function() {
                return !storage.getItem(keyZ);
              }, criticalSection);
            });
          });
        };
        var criticalSection = function() {
          storage.setItem(keyZ, "1");
          try {
            lockedCB();
          } finally {
            storage.removeItem(keyZ);
            if (storage.getItem(keyY) === i) {
              storage.removeItem(keyY);
            }
            if (storage.getItem(keyX) === i) {
              storage.removeItem(keyX);
            }
          }
        };
        try {
          if (localStorageSupported(storage, true)) {
            loop();
          } else {
            throw new Error("localStorage support check failed");
          }
        } catch (err) {
          reportError(err);
        }
      };
      var logger$1 = console_with_prefix("batch");
      var RequestQueue = function(storageKey, options) {
        options = options || {};
        this.storageKey = storageKey;
        this.storage = options.storage || window.localStorage;
        this.reportError = options.errorReporter || _.bind(logger$1.error, logger$1);
        this.lock = new SharedLock(storageKey, { storage: this.storage });
        this.pid = options.pid || null;
        this.memQueue = [];
      };
      RequestQueue.prototype.enqueue = function(item, flushInterval, cb) {
        var queueEntry = {
          "id": cheap_guid(),
          "flushAfter": new Date().getTime() + flushInterval * 2,
          "payload": item
        };
        this.lock.withLock(_.bind(function lockAcquired() {
          var succeeded;
          try {
            var storedQueue = this.readFromStorage();
            storedQueue.push(queueEntry);
            succeeded = this.saveToStorage(storedQueue);
            if (succeeded) {
              this.memQueue.push(queueEntry);
            }
          } catch (err) {
            this.reportError("Error enqueueing item", item);
            succeeded = false;
          }
          if (cb) {
            cb(succeeded);
          }
        }, this), _.bind(function lockFailure(err) {
          this.reportError("Error acquiring storage lock", err);
          if (cb) {
            cb(false);
          }
        }, this), this.pid);
      };
      RequestQueue.prototype.fillBatch = function(batchSize) {
        var batch = this.memQueue.slice(0, batchSize);
        if (batch.length < batchSize) {
          var storedQueue = this.readFromStorage();
          if (storedQueue.length) {
            var idsInBatch = {};
            _.each(batch, function(item2) {
              idsInBatch[item2["id"]] = true;
            });
            for (var i = 0; i < storedQueue.length; i++) {
              var item = storedQueue[i];
              if (new Date().getTime() > item["flushAfter"] && !idsInBatch[item["id"]]) {
                item.orphaned = true;
                batch.push(item);
                if (batch.length >= batchSize) {
                  break;
                }
              }
            }
          }
        }
        return batch;
      };
      var filterOutIDsAndInvalid = function(items, idSet) {
        var filteredItems = [];
        _.each(items, function(item) {
          if (item["id"] && !idSet[item["id"]]) {
            filteredItems.push(item);
          }
        });
        return filteredItems;
      };
      RequestQueue.prototype.removeItemsByID = function(ids, cb) {
        var idSet = {};
        _.each(ids, function(id) {
          idSet[id] = true;
        });
        this.memQueue = filterOutIDsAndInvalid(this.memQueue, idSet);
        var removeFromStorage = _.bind(function() {
          var succeeded;
          try {
            var storedQueue = this.readFromStorage();
            storedQueue = filterOutIDsAndInvalid(storedQueue, idSet);
            succeeded = this.saveToStorage(storedQueue);
            if (succeeded) {
              storedQueue = this.readFromStorage();
              for (var i = 0; i < storedQueue.length; i++) {
                var item = storedQueue[i];
                if (item["id"] && !!idSet[item["id"]]) {
                  this.reportError("Item not removed from storage");
                  return false;
                }
              }
            }
          } catch (err) {
            this.reportError("Error removing items", ids);
            succeeded = false;
          }
          return succeeded;
        }, this);
        this.lock.withLock(function lockAcquired() {
          var succeeded = removeFromStorage();
          if (cb) {
            cb(succeeded);
          }
        }, _.bind(function lockFailure(err) {
          var succeeded = false;
          this.reportError("Error acquiring storage lock", err);
          if (!localStorageSupported(this.storage, true)) {
            succeeded = removeFromStorage();
            if (!succeeded) {
              try {
                this.storage.removeItem(this.storageKey);
              } catch (err2) {
                this.reportError("Error clearing queue", err2);
              }
            }
          }
          if (cb) {
            cb(succeeded);
          }
        }, this), this.pid);
      };
      var updatePayloads = function(existingItems, itemsToUpdate) {
        var newItems = [];
        _.each(existingItems, function(item) {
          var id = item["id"];
          if (id in itemsToUpdate) {
            var newPayload = itemsToUpdate[id];
            if (newPayload !== null) {
              item["payload"] = newPayload;
              newItems.push(item);
            }
          } else {
            newItems.push(item);
          }
        });
        return newItems;
      };
      RequestQueue.prototype.updatePayloads = function(itemsToUpdate, cb) {
        this.memQueue = updatePayloads(this.memQueue, itemsToUpdate);
        this.lock.withLock(_.bind(function lockAcquired() {
          var succeeded;
          try {
            var storedQueue = this.readFromStorage();
            storedQueue = updatePayloads(storedQueue, itemsToUpdate);
            succeeded = this.saveToStorage(storedQueue);
          } catch (err) {
            this.reportError("Error updating items", itemsToUpdate);
            succeeded = false;
          }
          if (cb) {
            cb(succeeded);
          }
        }, this), _.bind(function lockFailure(err) {
          this.reportError("Error acquiring storage lock", err);
          if (cb) {
            cb(false);
          }
        }, this), this.pid);
      };
      RequestQueue.prototype.readFromStorage = function() {
        var storageEntry;
        try {
          storageEntry = this.storage.getItem(this.storageKey);
          if (storageEntry) {
            storageEntry = JSONParse(storageEntry);
            if (!_.isArray(storageEntry)) {
              this.reportError("Invalid storage entry:", storageEntry);
              storageEntry = null;
            }
          }
        } catch (err) {
          this.reportError("Error retrieving queue", err);
          storageEntry = null;
        }
        return storageEntry || [];
      };
      RequestQueue.prototype.saveToStorage = function(queue) {
        try {
          this.storage.setItem(this.storageKey, JSONStringify(queue));
          return true;
        } catch (err) {
          this.reportError("Error saving queue", err);
          return false;
        }
      };
      RequestQueue.prototype.clear = function() {
        this.memQueue = [];
        this.storage.removeItem(this.storageKey);
      };
      var MAX_RETRY_INTERVAL_MS = 10 * 60 * 1e3;
      var logger = console_with_prefix("batch");
      var RequestBatcher = function(storageKey, options) {
        this.errorReporter = options.errorReporter;
        this.queue = new RequestQueue(storageKey, {
          errorReporter: _.bind(this.reportError, this),
          storage: options.storage
        });
        this.libConfig = options.libConfig;
        this.sendRequest = options.sendRequestFunc;
        this.beforeSendHook = options.beforeSendHook;
        this.stopAllBatching = options.stopAllBatchingFunc;
        this.batchSize = this.libConfig["batch_size"];
        this.flushInterval = this.libConfig["batch_flush_interval_ms"];
        this.stopped = !this.libConfig["batch_autostart"];
        this.consecutiveRemovalFailures = 0;
      };
      RequestBatcher.prototype.enqueue = function(item, cb) {
        this.queue.enqueue(item, this.flushInterval, cb);
      };
      RequestBatcher.prototype.start = function() {
        this.stopped = false;
        this.consecutiveRemovalFailures = 0;
        this.flush();
      };
      RequestBatcher.prototype.stop = function() {
        this.stopped = true;
        if (this.timeoutID) {
          clearTimeout(this.timeoutID);
          this.timeoutID = null;
        }
      };
      RequestBatcher.prototype.clear = function() {
        this.queue.clear();
      };
      RequestBatcher.prototype.resetBatchSize = function() {
        this.batchSize = this.libConfig["batch_size"];
      };
      RequestBatcher.prototype.resetFlush = function() {
        this.scheduleFlush(this.libConfig["batch_flush_interval_ms"]);
      };
      RequestBatcher.prototype.scheduleFlush = function(flushMS) {
        this.flushInterval = flushMS;
        if (!this.stopped) {
          this.timeoutID = setTimeout(_.bind(this.flush, this), this.flushInterval);
        }
      };
      RequestBatcher.prototype.flush = function(options) {
        try {
          if (this.requestInProgress) {
            logger.log("Flush: Request already in progress");
            return;
          }
          options = options || {};
          var timeoutMS = this.libConfig["batch_request_timeout_ms"];
          var startTime = new Date().getTime();
          var currentBatchSize = this.batchSize;
          var batch = this.queue.fillBatch(currentBatchSize);
          var dataForRequest = [];
          var transformedItems = {};
          _.each(batch, function(item) {
            var payload = item["payload"];
            if (this.beforeSendHook && !item.orphaned) {
              payload = this.beforeSendHook(payload);
            }
            if (payload) {
              dataForRequest.push(payload);
            }
            transformedItems[item["id"]] = payload;
          }, this);
          if (dataForRequest.length < 1) {
            this.resetFlush();
            return;
          }
          this.requestInProgress = true;
          var batchSendCallback = _.bind(function(res) {
            this.requestInProgress = false;
            try {
              var removeItemsFromQueue = false;
              if (options.unloading) {
                this.queue.updatePayloads(transformedItems);
              } else if (_.isObject(res) && res.error === "timeout" && new Date().getTime() - startTime >= timeoutMS) {
                this.reportError("Network timeout; retrying");
                this.flush();
              } else if (_.isObject(res) && res.xhr_req && (res.xhr_req["status"] >= 500 || res.xhr_req["status"] === 429 || res.error === "timeout")) {
                var retryMS = this.flushInterval * 2;
                var headers = res.xhr_req["responseHeaders"];
                if (headers) {
                  var retryAfter = headers["Retry-After"];
                  if (retryAfter) {
                    retryMS = parseInt(retryAfter, 10) * 1e3 || retryMS;
                  }
                }
                retryMS = Math.min(MAX_RETRY_INTERVAL_MS, retryMS);
                this.reportError("Error; retry in " + retryMS + " ms");
                this.scheduleFlush(retryMS);
              } else if (_.isObject(res) && res.xhr_req && res.xhr_req["status"] === 413) {
                if (batch.length > 1) {
                  var halvedBatchSize = Math.max(1, Math.floor(currentBatchSize / 2));
                  this.batchSize = Math.min(this.batchSize, halvedBatchSize, batch.length - 1);
                  this.reportError("413 response; reducing batch size to " + this.batchSize);
                  this.resetFlush();
                } else {
                  this.reportError("Single-event request too large; dropping", batch);
                  this.resetBatchSize();
                  removeItemsFromQueue = true;
                }
              } else {
                removeItemsFromQueue = true;
              }
              if (removeItemsFromQueue) {
                this.queue.removeItemsByID(
                  _.map(batch, function(item) {
                    return item["id"];
                  }),
                  _.bind(function(succeeded) {
                    if (succeeded) {
                      this.consecutiveRemovalFailures = 0;
                      this.flush();
                    } else {
                      this.reportError("Failed to remove items from queue");
                      if (++this.consecutiveRemovalFailures > 5) {
                        this.reportError("Too many queue failures; disabling batching system.");
                        this.stopAllBatching();
                      } else {
                        this.resetFlush();
                      }
                    }
                  }, this)
                );
              }
            } catch (err) {
              this.reportError("Error handling API response", err);
              this.resetFlush();
            }
          }, this);
          var requestOptions = {
            method: "POST",
            verbose: true,
            ignore_json_errors: true,
            timeout_ms: timeoutMS
          };
          if (options.unloading) {
            requestOptions.transport = "sendBeacon";
          }
          logger.log("MIXPANEL REQUEST:", dataForRequest);
          this.sendRequest(dataForRequest, requestOptions, batchSendCallback);
        } catch (err) {
          this.reportError("Error flushing request queue", err);
          this.resetFlush();
        }
      };
      RequestBatcher.prototype.reportError = function(msg, err) {
        logger.error.apply(logger.error, arguments);
        if (this.errorReporter) {
          try {
            if (!(err instanceof Error)) {
              err = new Error(msg);
            }
            this.errorReporter(msg, err);
          } catch (err2) {
            logger.error(err2);
          }
        }
      };
      var GDPR_DEFAULT_PERSISTENCE_PREFIX = "__mp_opt_in_out_";
      function optIn(token, options) {
        _optInOut(true, token, options);
      }
      function optOut(token, options) {
        _optInOut(false, token, options);
      }
      function hasOptedIn(token, options) {
        return _getStorageValue(token, options) === "1";
      }
      function hasOptedOut(token, options) {
        if (_hasDoNotTrackFlagOn(options)) {
          console2.warn('This browser has "Do Not Track" enabled. This will prevent the Mixpanel SDK from sending any data. To ignore the "Do Not Track" browser setting, initialize the Mixpanel instance with the config "ignore_dnt: true"');
          return true;
        }
        var optedOut = _getStorageValue(token, options) === "0";
        if (optedOut) {
          console2.warn("You are opted out of Mixpanel tracking. This will prevent the Mixpanel SDK from sending any data.");
        }
        return optedOut;
      }
      function addOptOutCheckMixpanelLib(method) {
        return _addOptOutCheck(method, function(name) {
          return this.get_config(name);
        });
      }
      function addOptOutCheckMixpanelPeople(method) {
        return _addOptOutCheck(method, function(name) {
          return this._get_config(name);
        });
      }
      function addOptOutCheckMixpanelGroup(method) {
        return _addOptOutCheck(method, function(name) {
          return this._get_config(name);
        });
      }
      function clearOptInOut(token, options) {
        options = options || {};
        _getStorage(options).remove(
          _getStorageKey(token, options),
          !!options.crossSubdomainCookie,
          options.cookieDomain
        );
      }
      function _getStorage(options) {
        options = options || {};
        return options.persistenceType === "localStorage" ? _.localStorage : _.cookie;
      }
      function _getStorageKey(token, options) {
        options = options || {};
        return (options.persistencePrefix || GDPR_DEFAULT_PERSISTENCE_PREFIX) + token;
      }
      function _getStorageValue(token, options) {
        return _getStorage(options).get(_getStorageKey(token, options));
      }
      function _hasDoNotTrackFlagOn(options) {
        if (options && options.ignoreDnt) {
          return false;
        }
        var win = options && options.window || window$1;
        var nav = win["navigator"] || {};
        var hasDntOn = false;
        _.each([
          nav["doNotTrack"],
          nav["msDoNotTrack"],
          win["doNotTrack"]
        ], function(dntValue) {
          if (_.includes([true, 1, "1", "yes"], dntValue)) {
            hasDntOn = true;
          }
        });
        return hasDntOn;
      }
      function _optInOut(optValue, token, options) {
        if (!_.isString(token) || !token.length) {
          console2.error("gdpr." + (optValue ? "optIn" : "optOut") + " called with an invalid token");
          return;
        }
        options = options || {};
        _getStorage(options).set(
          _getStorageKey(token, options),
          optValue ? 1 : 0,
          _.isNumber(options.cookieExpiration) ? options.cookieExpiration : null,
          !!options.crossSubdomainCookie,
          !!options.secureCookie,
          !!options.crossSiteCookie,
          options.cookieDomain
        );
        if (options.track && optValue) {
          options.track(options.trackEventName || "$opt_in", options.trackProperties, {
            "send_immediately": true
          });
        }
      }
      function _addOptOutCheck(method, getConfigValue) {
        return function() {
          var optedOut = false;
          try {
            var token = getConfigValue.call(this, "token");
            var ignoreDnt = getConfigValue.call(this, "ignore_dnt");
            var persistenceType = getConfigValue.call(this, "opt_out_tracking_persistence_type");
            var persistencePrefix = getConfigValue.call(this, "opt_out_tracking_cookie_prefix");
            var win = getConfigValue.call(this, "window");
            if (token) {
              optedOut = hasOptedOut(token, {
                ignoreDnt,
                persistenceType,
                persistencePrefix,
                window: win
              });
            }
          } catch (err) {
            console2.error("Unexpected error when checking tracking opt-out status: " + err);
          }
          if (!optedOut) {
            return method.apply(this, arguments);
          }
          var callback = arguments[arguments.length - 1];
          if (typeof callback === "function") {
            callback(0);
          }
          return;
        };
      }
      var SET_ACTION = "$set";
      var SET_ONCE_ACTION = "$set_once";
      var UNSET_ACTION = "$unset";
      var ADD_ACTION = "$add";
      var APPEND_ACTION = "$append";
      var UNION_ACTION = "$union";
      var REMOVE_ACTION = "$remove";
      var DELETE_ACTION = "$delete";
      var apiActions = {
        set_action: function(prop, to) {
          var data = {};
          var $set = {};
          if (_.isObject(prop)) {
            _.each(prop, function(v, k) {
              if (!this._is_reserved_property(k)) {
                $set[k] = v;
              }
            }, this);
          } else {
            $set[prop] = to;
          }
          data[SET_ACTION] = $set;
          return data;
        },
        unset_action: function(prop) {
          var data = {};
          var $unset = [];
          if (!_.isArray(prop)) {
            prop = [prop];
          }
          _.each(prop, function(k) {
            if (!this._is_reserved_property(k)) {
              $unset.push(k);
            }
          }, this);
          data[UNSET_ACTION] = $unset;
          return data;
        },
        set_once_action: function(prop, to) {
          var data = {};
          var $set_once = {};
          if (_.isObject(prop)) {
            _.each(prop, function(v, k) {
              if (!this._is_reserved_property(k)) {
                $set_once[k] = v;
              }
            }, this);
          } else {
            $set_once[prop] = to;
          }
          data[SET_ONCE_ACTION] = $set_once;
          return data;
        },
        union_action: function(list_name, values) {
          var data = {};
          var $union = {};
          if (_.isObject(list_name)) {
            _.each(list_name, function(v, k) {
              if (!this._is_reserved_property(k)) {
                $union[k] = _.isArray(v) ? v : [v];
              }
            }, this);
          } else {
            $union[list_name] = _.isArray(values) ? values : [values];
          }
          data[UNION_ACTION] = $union;
          return data;
        },
        append_action: function(list_name, value) {
          var data = {};
          var $append = {};
          if (_.isObject(list_name)) {
            _.each(list_name, function(v, k) {
              if (!this._is_reserved_property(k)) {
                $append[k] = v;
              }
            }, this);
          } else {
            $append[list_name] = value;
          }
          data[APPEND_ACTION] = $append;
          return data;
        },
        remove_action: function(list_name, value) {
          var data = {};
          var $remove = {};
          if (_.isObject(list_name)) {
            _.each(list_name, function(v, k) {
              if (!this._is_reserved_property(k)) {
                $remove[k] = v;
              }
            }, this);
          } else {
            $remove[list_name] = value;
          }
          data[REMOVE_ACTION] = $remove;
          return data;
        },
        delete_action: function() {
          var data = {};
          data[DELETE_ACTION] = "";
          return data;
        }
      };
      var MixpanelGroup = function() {
      };
      _.extend(MixpanelGroup.prototype, apiActions);
      MixpanelGroup.prototype._init = function(mixpanel_instance, group_key, group_id) {
        this._mixpanel = mixpanel_instance;
        this._group_key = group_key;
        this._group_id = group_id;
      };
      MixpanelGroup.prototype.set = addOptOutCheckMixpanelGroup(function(prop, to, callback) {
        var data = this.set_action(prop, to);
        if (_.isObject(prop)) {
          callback = to;
        }
        return this._send_request(data, callback);
      });
      MixpanelGroup.prototype.set_once = addOptOutCheckMixpanelGroup(function(prop, to, callback) {
        var data = this.set_once_action(prop, to);
        if (_.isObject(prop)) {
          callback = to;
        }
        return this._send_request(data, callback);
      });
      MixpanelGroup.prototype.unset = addOptOutCheckMixpanelGroup(function(prop, callback) {
        var data = this.unset_action(prop);
        return this._send_request(data, callback);
      });
      MixpanelGroup.prototype.union = addOptOutCheckMixpanelGroup(function(list_name, values, callback) {
        if (_.isObject(list_name)) {
          callback = values;
        }
        var data = this.union_action(list_name, values);
        return this._send_request(data, callback);
      });
      MixpanelGroup.prototype["delete"] = addOptOutCheckMixpanelGroup(function(callback) {
        var data = this.delete_action();
        return this._send_request(data, callback);
      });
      MixpanelGroup.prototype.remove = addOptOutCheckMixpanelGroup(function(list_name, value, callback) {
        var data = this.remove_action(list_name, value);
        return this._send_request(data, callback);
      });
      MixpanelGroup.prototype._send_request = function(data, callback) {
        data["$group_key"] = this._group_key;
        data["$group_id"] = this._group_id;
        data["$token"] = this._get_config("token");
        var date_encoded_data = _.encodeDates(data);
        return this._mixpanel._track_or_batch({
          type: "groups",
          data: date_encoded_data,
          endpoint: this._get_config("api_host") + "/groups/",
          batcher: this._mixpanel.request_batchers.groups
        }, callback);
      };
      MixpanelGroup.prototype._is_reserved_property = function(prop) {
        return prop === "$group_key" || prop === "$group_id";
      };
      MixpanelGroup.prototype._get_config = function(conf) {
        return this._mixpanel.get_config(conf);
      };
      MixpanelGroup.prototype.toString = function() {
        return this._mixpanel.toString() + ".group." + this._group_key + "." + this._group_id;
      };
      MixpanelGroup.prototype["remove"] = MixpanelGroup.prototype.remove;
      MixpanelGroup.prototype["set"] = MixpanelGroup.prototype.set;
      MixpanelGroup.prototype["set_once"] = MixpanelGroup.prototype.set_once;
      MixpanelGroup.prototype["union"] = MixpanelGroup.prototype.union;
      MixpanelGroup.prototype["unset"] = MixpanelGroup.prototype.unset;
      MixpanelGroup.prototype["toString"] = MixpanelGroup.prototype.toString;
      var MixpanelPeople = function() {
      };
      _.extend(MixpanelPeople.prototype, apiActions);
      MixpanelPeople.prototype._init = function(mixpanel_instance) {
        this._mixpanel = mixpanel_instance;
      };
      MixpanelPeople.prototype.set = addOptOutCheckMixpanelPeople(function(prop, to, callback) {
        var data = this.set_action(prop, to);
        if (_.isObject(prop)) {
          callback = to;
        }
        if (this._get_config("save_referrer")) {
          this._mixpanel["persistence"].update_referrer_info(document.referrer);
        }
        data[SET_ACTION] = _.extend(
          {},
          _.info.people_properties(),
          this._mixpanel["persistence"].get_referrer_info(),
          data[SET_ACTION]
        );
        return this._send_request(data, callback);
      });
      MixpanelPeople.prototype.set_once = addOptOutCheckMixpanelPeople(function(prop, to, callback) {
        var data = this.set_once_action(prop, to);
        if (_.isObject(prop)) {
          callback = to;
        }
        return this._send_request(data, callback);
      });
      MixpanelPeople.prototype.unset = addOptOutCheckMixpanelPeople(function(prop, callback) {
        var data = this.unset_action(prop);
        return this._send_request(data, callback);
      });
      MixpanelPeople.prototype.increment = addOptOutCheckMixpanelPeople(function(prop, by, callback) {
        var data = {};
        var $add = {};
        if (_.isObject(prop)) {
          _.each(prop, function(v, k) {
            if (!this._is_reserved_property(k)) {
              if (isNaN(parseFloat(v))) {
                console2.error("Invalid increment value passed to mixpanel.people.increment - must be a number");
                return;
              } else {
                $add[k] = v;
              }
            }
          }, this);
          callback = by;
        } else {
          if (_.isUndefined(by)) {
            by = 1;
          }
          $add[prop] = by;
        }
        data[ADD_ACTION] = $add;
        return this._send_request(data, callback);
      });
      MixpanelPeople.prototype.append = addOptOutCheckMixpanelPeople(function(list_name, value, callback) {
        if (_.isObject(list_name)) {
          callback = value;
        }
        var data = this.append_action(list_name, value);
        return this._send_request(data, callback);
      });
      MixpanelPeople.prototype.remove = addOptOutCheckMixpanelPeople(function(list_name, value, callback) {
        if (_.isObject(list_name)) {
          callback = value;
        }
        var data = this.remove_action(list_name, value);
        return this._send_request(data, callback);
      });
      MixpanelPeople.prototype.union = addOptOutCheckMixpanelPeople(function(list_name, values, callback) {
        if (_.isObject(list_name)) {
          callback = values;
        }
        var data = this.union_action(list_name, values);
        return this._send_request(data, callback);
      });
      MixpanelPeople.prototype.track_charge = addOptOutCheckMixpanelPeople(function(amount, properties, callback) {
        if (!_.isNumber(amount)) {
          amount = parseFloat(amount);
          if (isNaN(amount)) {
            console2.error("Invalid value passed to mixpanel.people.track_charge - must be a number");
            return;
          }
        }
        return this.append("$transactions", _.extend({
          "$amount": amount
        }, properties), callback);
      });
      MixpanelPeople.prototype.clear_charges = function(callback) {
        return this.set("$transactions", [], callback);
      };
      MixpanelPeople.prototype.delete_user = function() {
        if (!this._identify_called()) {
          console2.error("mixpanel.people.delete_user() requires you to call identify() first");
          return;
        }
        var data = { "$delete": this._mixpanel.get_distinct_id() };
        return this._send_request(data);
      };
      MixpanelPeople.prototype.toString = function() {
        return this._mixpanel.toString() + ".people";
      };
      MixpanelPeople.prototype._send_request = function(data, callback) {
        data["$token"] = this._get_config("token");
        data["$distinct_id"] = this._mixpanel.get_distinct_id();
        var device_id = this._mixpanel.get_property("$device_id");
        var user_id = this._mixpanel.get_property("$user_id");
        var had_persisted_distinct_id = this._mixpanel.get_property("$had_persisted_distinct_id");
        if (device_id) {
          data["$device_id"] = device_id;
        }
        if (user_id) {
          data["$user_id"] = user_id;
        }
        if (had_persisted_distinct_id) {
          data["$had_persisted_distinct_id"] = had_persisted_distinct_id;
        }
        var date_encoded_data = _.encodeDates(data);
        if (!this._identify_called()) {
          this._enqueue(data);
          if (!_.isUndefined(callback)) {
            if (this._get_config("verbose")) {
              callback({ status: -1, error: null });
            } else {
              callback(-1);
            }
          }
          return _.truncate(date_encoded_data, 255);
        }
        return this._mixpanel._track_or_batch({
          type: "people",
          data: date_encoded_data,
          endpoint: this._get_config("api_host") + "/engage/",
          batcher: this._mixpanel.request_batchers.people
        }, callback);
      };
      MixpanelPeople.prototype._get_config = function(conf_var) {
        return this._mixpanel.get_config(conf_var);
      };
      MixpanelPeople.prototype._identify_called = function() {
        return this._mixpanel._flags.identify_called === true;
      };
      MixpanelPeople.prototype._enqueue = function(data) {
        if (SET_ACTION in data) {
          this._mixpanel["persistence"]._add_to_people_queue(SET_ACTION, data);
        } else if (SET_ONCE_ACTION in data) {
          this._mixpanel["persistence"]._add_to_people_queue(SET_ONCE_ACTION, data);
        } else if (UNSET_ACTION in data) {
          this._mixpanel["persistence"]._add_to_people_queue(UNSET_ACTION, data);
        } else if (ADD_ACTION in data) {
          this._mixpanel["persistence"]._add_to_people_queue(ADD_ACTION, data);
        } else if (APPEND_ACTION in data) {
          this._mixpanel["persistence"]._add_to_people_queue(APPEND_ACTION, data);
        } else if (REMOVE_ACTION in data) {
          this._mixpanel["persistence"]._add_to_people_queue(REMOVE_ACTION, data);
        } else if (UNION_ACTION in data) {
          this._mixpanel["persistence"]._add_to_people_queue(UNION_ACTION, data);
        } else {
          console2.error("Invalid call to _enqueue():", data);
        }
      };
      MixpanelPeople.prototype._flush_one_queue = function(action, action_method, callback, queue_to_params_fn) {
        var _this = this;
        var queued_data = _.extend({}, this._mixpanel["persistence"]._get_queue(action));
        var action_params = queued_data;
        if (!_.isUndefined(queued_data) && _.isObject(queued_data) && !_.isEmptyObject(queued_data)) {
          _this._mixpanel["persistence"]._pop_from_people_queue(action, queued_data);
          if (queue_to_params_fn) {
            action_params = queue_to_params_fn(queued_data);
          }
          action_method.call(_this, action_params, function(response, data) {
            if (response === 0) {
              _this._mixpanel["persistence"]._add_to_people_queue(action, queued_data);
            }
            if (!_.isUndefined(callback)) {
              callback(response, data);
            }
          });
        }
      };
      MixpanelPeople.prototype._flush = function(_set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback, _unset_callback, _remove_callback) {
        var _this = this;
        var $append_queue = this._mixpanel["persistence"]._get_queue(APPEND_ACTION);
        var $remove_queue = this._mixpanel["persistence"]._get_queue(REMOVE_ACTION);
        this._flush_one_queue(SET_ACTION, this.set, _set_callback);
        this._flush_one_queue(SET_ONCE_ACTION, this.set_once, _set_once_callback);
        this._flush_one_queue(UNSET_ACTION, this.unset, _unset_callback, function(queue) {
          return _.keys(queue);
        });
        this._flush_one_queue(ADD_ACTION, this.increment, _add_callback);
        this._flush_one_queue(UNION_ACTION, this.union, _union_callback);
        if (!_.isUndefined($append_queue) && _.isArray($append_queue) && $append_queue.length) {
          var $append_item;
          var append_callback = function(response, data) {
            if (response === 0) {
              _this._mixpanel["persistence"]._add_to_people_queue(APPEND_ACTION, $append_item);
            }
            if (!_.isUndefined(_append_callback)) {
              _append_callback(response, data);
            }
          };
          for (var i = $append_queue.length - 1; i >= 0; i--) {
            $append_item = $append_queue.pop();
            if (!_.isEmptyObject($append_item)) {
              _this.append($append_item, append_callback);
            }
          }
          _this._mixpanel["persistence"].save();
        }
        if (!_.isUndefined($remove_queue) && _.isArray($remove_queue) && $remove_queue.length) {
          var $remove_item;
          var remove_callback = function(response, data) {
            if (response === 0) {
              _this._mixpanel["persistence"]._add_to_people_queue(REMOVE_ACTION, $remove_item);
            }
            if (!_.isUndefined(_remove_callback)) {
              _remove_callback(response, data);
            }
          };
          for (var j = $remove_queue.length - 1; j >= 0; j--) {
            $remove_item = $remove_queue.pop();
            if (!_.isEmptyObject($remove_item)) {
              _this.remove($remove_item, remove_callback);
            }
          }
          _this._mixpanel["persistence"].save();
        }
      };
      MixpanelPeople.prototype._is_reserved_property = function(prop) {
        return prop === "$distinct_id" || prop === "$token" || prop === "$device_id" || prop === "$user_id" || prop === "$had_persisted_distinct_id";
      };
      MixpanelPeople.prototype["set"] = MixpanelPeople.prototype.set;
      MixpanelPeople.prototype["set_once"] = MixpanelPeople.prototype.set_once;
      MixpanelPeople.prototype["unset"] = MixpanelPeople.prototype.unset;
      MixpanelPeople.prototype["increment"] = MixpanelPeople.prototype.increment;
      MixpanelPeople.prototype["append"] = MixpanelPeople.prototype.append;
      MixpanelPeople.prototype["remove"] = MixpanelPeople.prototype.remove;
      MixpanelPeople.prototype["union"] = MixpanelPeople.prototype.union;
      MixpanelPeople.prototype["track_charge"] = MixpanelPeople.prototype.track_charge;
      MixpanelPeople.prototype["clear_charges"] = MixpanelPeople.prototype.clear_charges;
      MixpanelPeople.prototype["delete_user"] = MixpanelPeople.prototype.delete_user;
      MixpanelPeople.prototype["toString"] = MixpanelPeople.prototype.toString;
      var SET_QUEUE_KEY = "__mps";
      var SET_ONCE_QUEUE_KEY = "__mpso";
      var UNSET_QUEUE_KEY = "__mpus";
      var ADD_QUEUE_KEY = "__mpa";
      var APPEND_QUEUE_KEY = "__mpap";
      var REMOVE_QUEUE_KEY = "__mpr";
      var UNION_QUEUE_KEY = "__mpu";
      var PEOPLE_DISTINCT_ID_KEY = "$people_distinct_id";
      var ALIAS_ID_KEY = "__alias";
      var EVENT_TIMERS_KEY = "__timers";
      var RESERVED_PROPERTIES = [
        SET_QUEUE_KEY,
        SET_ONCE_QUEUE_KEY,
        UNSET_QUEUE_KEY,
        ADD_QUEUE_KEY,
        APPEND_QUEUE_KEY,
        REMOVE_QUEUE_KEY,
        UNION_QUEUE_KEY,
        PEOPLE_DISTINCT_ID_KEY,
        ALIAS_ID_KEY,
        EVENT_TIMERS_KEY
      ];
      var MixpanelPersistence = function(config) {
        this["props"] = {};
        this.campaign_params_saved = false;
        if (config["persistence_name"]) {
          this.name = "mp_" + config["persistence_name"];
        } else {
          this.name = "mp_" + config["token"] + "_mixpanel";
        }
        var storage_type = config["persistence"];
        if (storage_type !== "cookie" && storage_type !== "localStorage") {
          console2.critical("Unknown persistence type " + storage_type + "; falling back to cookie");
          storage_type = config["persistence"] = "cookie";
        }
        if (storage_type === "localStorage" && _.localStorage.is_supported()) {
          this.storage = _.localStorage;
        } else {
          this.storage = _.cookie;
        }
        this.load();
        this.update_config(config);
        this.upgrade(config);
        this.save();
      };
      MixpanelPersistence.prototype.properties = function() {
        var p = {};
        _.each(this["props"], function(v, k) {
          if (!_.include(RESERVED_PROPERTIES, k)) {
            p[k] = v;
          }
        });
        return p;
      };
      MixpanelPersistence.prototype.load = function() {
        if (this.disabled) {
          return;
        }
        var entry = this.storage.parse(this.name);
        if (entry) {
          this["props"] = _.extend({}, entry);
        }
      };
      MixpanelPersistence.prototype.upgrade = function(config) {
        var upgrade_from_old_lib = config["upgrade"], old_cookie_name, old_cookie;
        if (upgrade_from_old_lib) {
          old_cookie_name = "mp_super_properties";
          if (typeof upgrade_from_old_lib === "string") {
            old_cookie_name = upgrade_from_old_lib;
          }
          old_cookie = this.storage.parse(old_cookie_name);
          this.storage.remove(old_cookie_name);
          this.storage.remove(old_cookie_name, true);
          if (old_cookie) {
            this["props"] = _.extend(
              this["props"],
              old_cookie["all"],
              old_cookie["events"]
            );
          }
        }
        if (!config["cookie_name"] && config["name"] !== "mixpanel") {
          old_cookie_name = "mp_" + config["token"] + "_" + config["name"];
          old_cookie = this.storage.parse(old_cookie_name);
          if (old_cookie) {
            this.storage.remove(old_cookie_name);
            this.storage.remove(old_cookie_name, true);
            this.register_once(old_cookie);
          }
        }
        if (this.storage === _.localStorage) {
          old_cookie = _.cookie.parse(this.name);
          _.cookie.remove(this.name);
          _.cookie.remove(this.name, true);
          if (old_cookie) {
            this.register_once(old_cookie);
          }
        }
      };
      MixpanelPersistence.prototype.save = function() {
        if (this.disabled) {
          return;
        }
        this.storage.set(
          this.name,
          _.JSONEncode(this["props"]),
          this.expire_days,
          this.cross_subdomain,
          this.secure,
          this.cross_site,
          this.cookie_domain
        );
      };
      MixpanelPersistence.prototype.remove = function() {
        this.storage.remove(this.name, false, this.cookie_domain);
        this.storage.remove(this.name, true, this.cookie_domain);
      };
      MixpanelPersistence.prototype.clear = function() {
        this.remove();
        this["props"] = {};
      };
      MixpanelPersistence.prototype.register_once = function(props, default_value, days) {
        if (_.isObject(props)) {
          if (typeof default_value === "undefined") {
            default_value = "None";
          }
          this.expire_days = typeof days === "undefined" ? this.default_expiry : days;
          _.each(props, function(val, prop) {
            if (!this["props"].hasOwnProperty(prop) || this["props"][prop] === default_value) {
              this["props"][prop] = val;
            }
          }, this);
          this.save();
          return true;
        }
        return false;
      };
      MixpanelPersistence.prototype.register = function(props, days) {
        if (_.isObject(props)) {
          this.expire_days = typeof days === "undefined" ? this.default_expiry : days;
          _.extend(this["props"], props);
          this.save();
          return true;
        }
        return false;
      };
      MixpanelPersistence.prototype.unregister = function(prop) {
        if (prop in this["props"]) {
          delete this["props"][prop];
          this.save();
        }
      };
      MixpanelPersistence.prototype.update_campaign_params = function() {
        if (!this.campaign_params_saved) {
          this.register_once(_.info.campaignParams());
          this.campaign_params_saved = true;
        }
      };
      MixpanelPersistence.prototype.update_search_keyword = function(referrer) {
        this.register(_.info.searchInfo(referrer));
      };
      MixpanelPersistence.prototype.update_referrer_info = function(referrer) {
        this.register_once({
          "$initial_referrer": referrer || "$direct",
          "$initial_referring_domain": _.info.referringDomain(referrer) || "$direct"
        }, "");
      };
      MixpanelPersistence.prototype.get_referrer_info = function() {
        return _.strip_empty_properties({
          "$initial_referrer": this["props"]["$initial_referrer"],
          "$initial_referring_domain": this["props"]["$initial_referring_domain"]
        });
      };
      MixpanelPersistence.prototype.safe_merge = function(props) {
        _.each(this["props"], function(val, prop) {
          if (!(prop in props)) {
            props[prop] = val;
          }
        });
        return props;
      };
      MixpanelPersistence.prototype.update_config = function(config) {
        this.default_expiry = this.expire_days = config["cookie_expiration"];
        this.set_disabled(config["disable_persistence"]);
        this.set_cookie_domain(config["cookie_domain"]);
        this.set_cross_site(config["cross_site_cookie"]);
        this.set_cross_subdomain(config["cross_subdomain_cookie"]);
        this.set_secure(config["secure_cookie"]);
      };
      MixpanelPersistence.prototype.set_disabled = function(disabled) {
        this.disabled = disabled;
        if (this.disabled) {
          this.remove();
        } else {
          this.save();
        }
      };
      MixpanelPersistence.prototype.set_cookie_domain = function(cookie_domain) {
        if (cookie_domain !== this.cookie_domain) {
          this.remove();
          this.cookie_domain = cookie_domain;
          this.save();
        }
      };
      MixpanelPersistence.prototype.set_cross_site = function(cross_site) {
        if (cross_site !== this.cross_site) {
          this.cross_site = cross_site;
          this.remove();
          this.save();
        }
      };
      MixpanelPersistence.prototype.set_cross_subdomain = function(cross_subdomain) {
        if (cross_subdomain !== this.cross_subdomain) {
          this.cross_subdomain = cross_subdomain;
          this.remove();
          this.save();
        }
      };
      MixpanelPersistence.prototype.get_cross_subdomain = function() {
        return this.cross_subdomain;
      };
      MixpanelPersistence.prototype.set_secure = function(secure) {
        if (secure !== this.secure) {
          this.secure = secure ? true : false;
          this.remove();
          this.save();
        }
      };
      MixpanelPersistence.prototype._add_to_people_queue = function(queue, data) {
        var q_key = this._get_queue_key(queue), q_data = data[queue], set_q = this._get_or_create_queue(SET_ACTION), set_once_q = this._get_or_create_queue(SET_ONCE_ACTION), unset_q = this._get_or_create_queue(UNSET_ACTION), add_q = this._get_or_create_queue(ADD_ACTION), union_q = this._get_or_create_queue(UNION_ACTION), remove_q = this._get_or_create_queue(REMOVE_ACTION, []), append_q = this._get_or_create_queue(APPEND_ACTION, []);
        if (q_key === SET_QUEUE_KEY) {
          _.extend(set_q, q_data);
          this._pop_from_people_queue(ADD_ACTION, q_data);
          this._pop_from_people_queue(UNION_ACTION, q_data);
          this._pop_from_people_queue(UNSET_ACTION, q_data);
        } else if (q_key === SET_ONCE_QUEUE_KEY) {
          _.each(q_data, function(v, k) {
            if (!(k in set_once_q)) {
              set_once_q[k] = v;
            }
          });
          this._pop_from_people_queue(UNSET_ACTION, q_data);
        } else if (q_key === UNSET_QUEUE_KEY) {
          _.each(q_data, function(prop) {
            _.each([set_q, set_once_q, add_q, union_q], function(enqueued_obj) {
              if (prop in enqueued_obj) {
                delete enqueued_obj[prop];
              }
            });
            _.each(append_q, function(append_obj) {
              if (prop in append_obj) {
                delete append_obj[prop];
              }
            });
            unset_q[prop] = true;
          });
        } else if (q_key === ADD_QUEUE_KEY) {
          _.each(q_data, function(v, k) {
            if (k in set_q) {
              set_q[k] += v;
            } else {
              if (!(k in add_q)) {
                add_q[k] = 0;
              }
              add_q[k] += v;
            }
          }, this);
          this._pop_from_people_queue(UNSET_ACTION, q_data);
        } else if (q_key === UNION_QUEUE_KEY) {
          _.each(q_data, function(v, k) {
            if (_.isArray(v)) {
              if (!(k in union_q)) {
                union_q[k] = [];
              }
              union_q[k] = union_q[k].concat(v);
            }
          });
          this._pop_from_people_queue(UNSET_ACTION, q_data);
        } else if (q_key === REMOVE_QUEUE_KEY) {
          remove_q.push(q_data);
          this._pop_from_people_queue(APPEND_ACTION, q_data);
        } else if (q_key === APPEND_QUEUE_KEY) {
          append_q.push(q_data);
          this._pop_from_people_queue(UNSET_ACTION, q_data);
        }
        console2.log("MIXPANEL PEOPLE REQUEST (QUEUED, PENDING IDENTIFY):");
        console2.log(data);
        this.save();
      };
      MixpanelPersistence.prototype._pop_from_people_queue = function(queue, data) {
        var q = this._get_queue(queue);
        if (!_.isUndefined(q)) {
          _.each(data, function(v, k) {
            if (queue === APPEND_ACTION || queue === REMOVE_ACTION) {
              _.each(q, function(queued_action) {
                if (queued_action[k] === v) {
                  delete queued_action[k];
                }
              });
            } else {
              delete q[k];
            }
          }, this);
          this.save();
        }
      };
      MixpanelPersistence.prototype._get_queue_key = function(queue) {
        if (queue === SET_ACTION) {
          return SET_QUEUE_KEY;
        } else if (queue === SET_ONCE_ACTION) {
          return SET_ONCE_QUEUE_KEY;
        } else if (queue === UNSET_ACTION) {
          return UNSET_QUEUE_KEY;
        } else if (queue === ADD_ACTION) {
          return ADD_QUEUE_KEY;
        } else if (queue === APPEND_ACTION) {
          return APPEND_QUEUE_KEY;
        } else if (queue === REMOVE_ACTION) {
          return REMOVE_QUEUE_KEY;
        } else if (queue === UNION_ACTION) {
          return UNION_QUEUE_KEY;
        } else {
          console2.error("Invalid queue:", queue);
        }
      };
      MixpanelPersistence.prototype._get_queue = function(queue) {
        return this["props"][this._get_queue_key(queue)];
      };
      MixpanelPersistence.prototype._get_or_create_queue = function(queue, default_val) {
        var key = this._get_queue_key(queue);
        default_val = _.isUndefined(default_val) ? {} : default_val;
        return this["props"][key] || (this["props"][key] = default_val);
      };
      MixpanelPersistence.prototype.set_event_timer = function(event_name, timestamp) {
        var timers = this["props"][EVENT_TIMERS_KEY] || {};
        timers[event_name] = timestamp;
        this["props"][EVENT_TIMERS_KEY] = timers;
        this.save();
      };
      MixpanelPersistence.prototype.remove_event_timer = function(event_name) {
        var timers = this["props"][EVENT_TIMERS_KEY] || {};
        var timestamp = timers[event_name];
        if (!_.isUndefined(timestamp)) {
          delete this["props"][EVENT_TIMERS_KEY][event_name];
          this.save();
        }
        return timestamp;
      };
      var init_type;
      var mixpanel_master;
      var INIT_MODULE = 0;
      var INIT_SNIPPET = 1;
      var IDENTITY_FUNC = function(x) {
        return x;
      };
      var NOOP_FUNC = function() {
      };
      var PRIMARY_INSTANCE_NAME = "mixpanel";
      var PAYLOAD_TYPE_BASE64 = "base64";
      var PAYLOAD_TYPE_JSON = "json";
      var USE_XHR = window$1.XMLHttpRequest && "withCredentials" in new XMLHttpRequest();
      var ENQUEUE_REQUESTS = !USE_XHR && userAgent.indexOf("MSIE") === -1 && userAgent.indexOf("Mozilla") === -1;
      var sendBeacon = null;
      if (navigator["sendBeacon"]) {
        sendBeacon = function() {
          return navigator["sendBeacon"].apply(navigator, arguments);
        };
      }
      var DEFAULT_CONFIG = {
        "api_host": "https://api-js.mixpanel.com",
        "api_method": "POST",
        "api_transport": "XHR",
        "api_payload_format": PAYLOAD_TYPE_BASE64,
        "app_host": "https://mixpanel.com",
        "cdn": "https://cdn.mxpnl.com",
        "cross_site_cookie": false,
        "cross_subdomain_cookie": true,
        "error_reporter": NOOP_FUNC,
        "persistence": "cookie",
        "persistence_name": "",
        "cookie_domain": "",
        "cookie_name": "",
        "loaded": NOOP_FUNC,
        "store_google": true,
        "save_referrer": true,
        "test": false,
        "verbose": false,
        "img": false,
        "debug": false,
        "track_links_timeout": 300,
        "cookie_expiration": 365,
        "upgrade": false,
        "disable_persistence": false,
        "disable_cookie": false,
        "secure_cookie": false,
        "ip": true,
        "opt_out_tracking_by_default": false,
        "opt_out_persistence_by_default": false,
        "opt_out_tracking_persistence_type": "localStorage",
        "opt_out_tracking_cookie_prefix": null,
        "property_blacklist": [],
        "xhr_headers": {},
        "ignore_dnt": false,
        "batch_requests": true,
        "batch_size": 50,
        "batch_flush_interval_ms": 5e3,
        "batch_request_timeout_ms": 9e4,
        "batch_autostart": true,
        "hooks": {}
      };
      var DOM_LOADED = false;
      var MixpanelLib = function() {
      };
      var create_mplib = function(token, config, name) {
        var instance, target = name === PRIMARY_INSTANCE_NAME ? mixpanel_master : mixpanel_master[name];
        if (target && init_type === INIT_MODULE) {
          instance = target;
        } else {
          if (target && !_.isArray(target)) {
            console2.error("You have already initialized " + name);
            return;
          }
          instance = new MixpanelLib();
        }
        instance._cached_groups = {};
        instance._init(token, config, name);
        instance["people"] = new MixpanelPeople();
        instance["people"]._init(instance);
        Config.DEBUG = Config.DEBUG || instance.get_config("debug");
        if (!_.isUndefined(target) && _.isArray(target)) {
          instance._execute_array.call(instance["people"], target["people"]);
          instance._execute_array(target);
        }
        return instance;
      };
      MixpanelLib.prototype.init = function(token, config, name) {
        if (_.isUndefined(name)) {
          this.report_error("You must name your new library: init(token, config, name)");
          return;
        }
        if (name === PRIMARY_INSTANCE_NAME) {
          this.report_error("You must initialize the main mixpanel object right after you include the Mixpanel js snippet");
          return;
        }
        var instance = create_mplib(token, config, name);
        mixpanel_master[name] = instance;
        instance._loaded();
        return instance;
      };
      MixpanelLib.prototype._init = function(token, config, name) {
        config = config || {};
        this["__loaded"] = true;
        this["config"] = {};
        var variable_features = {};
        if (!("api_payload_format" in config)) {
          var api_host = config["api_host"] || DEFAULT_CONFIG["api_host"];
          if (api_host.match(/\.mixpanel\.com$/)) {
            variable_features["api_payload_format"] = PAYLOAD_TYPE_JSON;
          }
        }
        this.set_config(_.extend({}, DEFAULT_CONFIG, variable_features, config, {
          "name": name,
          "token": token,
          "callback_fn": (name === PRIMARY_INSTANCE_NAME ? name : PRIMARY_INSTANCE_NAME + "." + name) + "._jsc"
        }));
        this["_jsc"] = NOOP_FUNC;
        this.__dom_loaded_queue = [];
        this.__request_queue = [];
        this.__disabled_events = [];
        this._flags = {
          "disable_all_events": false,
          "identify_called": false
        };
        this.request_batchers = {};
        this._batch_requests = this.get_config("batch_requests");
        if (this._batch_requests) {
          if (!_.localStorage.is_supported(true) || !USE_XHR) {
            this._batch_requests = false;
            console2.log("Turning off Mixpanel request-queueing; needs XHR and localStorage support");
          } else {
            this.init_batchers();
            if (sendBeacon && window$1.addEventListener) {
              var flush_on_unload = _.bind(function() {
                if (!this.request_batchers.events.stopped) {
                  this.request_batchers.events.flush({ unloading: true });
                }
              }, this);
              window$1.addEventListener("pagehide", function(ev) {
                if (ev["persisted"]) {
                  flush_on_unload();
                }
              });
              window$1.addEventListener("visibilitychange", function() {
                if (document$1["visibilityState"] === "hidden") {
                  flush_on_unload();
                }
              });
            }
          }
        }
        this["persistence"] = this["cookie"] = new MixpanelPersistence(this["config"]);
        this.unpersisted_superprops = {};
        this._gdpr_init();
        var uuid = _.UUID();
        if (!this.get_distinct_id()) {
          this.register_once({
            "distinct_id": uuid,
            "$device_id": uuid
          }, "");
        }
      };
      MixpanelLib.prototype._loaded = function() {
        this.get_config("loaded")(this);
        this._set_default_superprops();
      };
      MixpanelLib.prototype._set_default_superprops = function() {
        this["persistence"].update_search_keyword(document$1.referrer);
        if (this.get_config("store_google")) {
          this["persistence"].update_campaign_params();
        }
        if (this.get_config("save_referrer")) {
          this["persistence"].update_referrer_info(document$1.referrer);
        }
      };
      MixpanelLib.prototype._dom_loaded = function() {
        _.each(this.__dom_loaded_queue, function(item) {
          this._track_dom.apply(this, item);
        }, this);
        if (!this.has_opted_out_tracking()) {
          _.each(this.__request_queue, function(item) {
            this._send_request.apply(this, item);
          }, this);
        }
        delete this.__dom_loaded_queue;
        delete this.__request_queue;
      };
      MixpanelLib.prototype._track_dom = function(DomClass, args) {
        if (this.get_config("img")) {
          this.report_error("You can't use DOM tracking functions with img = true.");
          return false;
        }
        if (!DOM_LOADED) {
          this.__dom_loaded_queue.push([DomClass, args]);
          return false;
        }
        var dt = new DomClass().init(this);
        return dt.track.apply(dt, args);
      };
      MixpanelLib.prototype._prepare_callback = function(callback, data) {
        if (_.isUndefined(callback)) {
          return null;
        }
        if (USE_XHR) {
          var callback_function = function(response) {
            callback(response, data);
          };
          return callback_function;
        } else {
          var jsc = this["_jsc"];
          var randomized_cb = "" + Math.floor(Math.random() * 1e8);
          var callback_string = this.get_config("callback_fn") + "[" + randomized_cb + "]";
          jsc[randomized_cb] = function(response) {
            delete jsc[randomized_cb];
            callback(response, data);
          };
          return callback_string;
        }
      };
      MixpanelLib.prototype._send_request = function(url, data, options, callback) {
        var succeeded = true;
        if (ENQUEUE_REQUESTS) {
          this.__request_queue.push(arguments);
          return succeeded;
        }
        var DEFAULT_OPTIONS = {
          method: this.get_config("api_method"),
          transport: this.get_config("api_transport"),
          verbose: this.get_config("verbose")
        };
        var body_data = null;
        if (!callback && (_.isFunction(options) || typeof options === "string")) {
          callback = options;
          options = null;
        }
        options = _.extend(DEFAULT_OPTIONS, options || {});
        if (!USE_XHR) {
          options.method = "GET";
        }
        var use_post = options.method === "POST";
        var use_sendBeacon = sendBeacon && use_post && options.transport.toLowerCase() === "sendbeacon";
        var verbose_mode = options.verbose;
        if (data["verbose"]) {
          verbose_mode = true;
        }
        if (this.get_config("test")) {
          data["test"] = 1;
        }
        if (verbose_mode) {
          data["verbose"] = 1;
        }
        if (this.get_config("img")) {
          data["img"] = 1;
        }
        if (!USE_XHR) {
          if (callback) {
            data["callback"] = callback;
          } else if (verbose_mode || this.get_config("test")) {
            data["callback"] = "(function(){})";
          }
        }
        data["ip"] = this.get_config("ip") ? 1 : 0;
        data["_"] = new Date().getTime().toString();
        if (use_post) {
          body_data = "data=" + encodeURIComponent(data["data"]);
          delete data["data"];
        }
        url += "?" + _.HTTPBuildQuery(data);
        var lib = this;
        if ("img" in data) {
          var img = document$1.createElement("img");
          img.src = url;
          document$1.body.appendChild(img);
        } else if (use_sendBeacon) {
          try {
            succeeded = sendBeacon(url, body_data);
          } catch (e) {
            lib.report_error(e);
            succeeded = false;
          }
          try {
            if (callback) {
              callback(succeeded ? 1 : 0);
            }
          } catch (e) {
            lib.report_error(e);
          }
        } else if (USE_XHR) {
          try {
            var req = new XMLHttpRequest();
            req.open(options.method, url, true);
            var headers = this.get_config("xhr_headers");
            if (use_post) {
              headers["Content-Type"] = "application/x-www-form-urlencoded";
            }
            _.each(headers, function(headerValue, headerName) {
              req.setRequestHeader(headerName, headerValue);
            });
            if (options.timeout_ms && typeof req.timeout !== "undefined") {
              req.timeout = options.timeout_ms;
              var start_time = new Date().getTime();
            }
            req.withCredentials = true;
            req.onreadystatechange = function() {
              if (req.readyState === 4) {
                if (req.status === 200) {
                  if (callback) {
                    if (verbose_mode) {
                      var response;
                      try {
                        response = _.JSONDecode(req.responseText);
                      } catch (e) {
                        lib.report_error(e);
                        if (options.ignore_json_errors) {
                          response = req.responseText;
                        } else {
                          return;
                        }
                      }
                      callback(response);
                    } else {
                      callback(Number(req.responseText));
                    }
                  }
                } else {
                  var error;
                  if (req.timeout && !req.status && new Date().getTime() - start_time >= req.timeout) {
                    error = "timeout";
                  } else {
                    error = "Bad HTTP status: " + req.status + " " + req.statusText;
                  }
                  lib.report_error(error);
                  if (callback) {
                    if (verbose_mode) {
                      callback({ status: 0, error, xhr_req: req });
                    } else {
                      callback(0);
                    }
                  }
                }
              }
            };
            req.send(body_data);
          } catch (e) {
            lib.report_error(e);
            succeeded = false;
          }
        } else {
          var script = document$1.createElement("script");
          script.type = "text/javascript";
          script.async = true;
          script.defer = true;
          script.src = url;
          var s = document$1.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(script, s);
        }
        return succeeded;
      };
      MixpanelLib.prototype._execute_array = function(array) {
        var fn_name, alias_calls = [], other_calls = [], tracking_calls = [];
        _.each(array, function(item) {
          if (item) {
            fn_name = item[0];
            if (_.isArray(fn_name)) {
              tracking_calls.push(item);
            } else if (typeof item === "function") {
              item.call(this);
            } else if (_.isArray(item) && fn_name === "alias") {
              alias_calls.push(item);
            } else if (_.isArray(item) && fn_name.indexOf("track") !== -1 && typeof this[fn_name] === "function") {
              tracking_calls.push(item);
            } else {
              other_calls.push(item);
            }
          }
        }, this);
        var execute = function(calls, context) {
          _.each(calls, function(item) {
            if (_.isArray(item[0])) {
              var caller = context;
              _.each(item, function(call) {
                caller = caller[call[0]].apply(caller, call.slice(1));
              });
            } else {
              this[item[0]].apply(this, item.slice(1));
            }
          }, context);
        };
        execute(alias_calls, this);
        execute(other_calls, this);
        execute(tracking_calls, this);
      };
      MixpanelLib.prototype.are_batchers_initialized = function() {
        return !!this.request_batchers.events;
      };
      MixpanelLib.prototype.init_batchers = function() {
        var token = this.get_config("token");
        if (!this.are_batchers_initialized()) {
          var batcher_for = _.bind(function(attrs) {
            return new RequestBatcher(
              "__mpq_" + token + attrs.queue_suffix,
              {
                libConfig: this["config"],
                sendRequestFunc: _.bind(function(data, options, cb) {
                  this._send_request(
                    this.get_config("api_host") + attrs.endpoint,
                    this._encode_data_for_request(data),
                    options,
                    this._prepare_callback(cb, data)
                  );
                }, this),
                beforeSendHook: _.bind(function(item) {
                  return this._run_hook("before_send_" + attrs.type, item);
                }, this),
                errorReporter: this.get_config("error_reporter"),
                stopAllBatchingFunc: _.bind(this.stop_batch_senders, this)
              }
            );
          }, this);
          this.request_batchers = {
            events: batcher_for({ type: "events", endpoint: "/track/", queue_suffix: "_ev" }),
            people: batcher_for({ type: "people", endpoint: "/engage/", queue_suffix: "_pp" }),
            groups: batcher_for({ type: "groups", endpoint: "/groups/", queue_suffix: "_gr" })
          };
        }
        if (this.get_config("batch_autostart")) {
          this.start_batch_senders();
        }
      };
      MixpanelLib.prototype.start_batch_senders = function() {
        if (this.are_batchers_initialized()) {
          this._batch_requests = true;
          _.each(this.request_batchers, function(batcher) {
            batcher.start();
          });
        }
      };
      MixpanelLib.prototype.stop_batch_senders = function() {
        this._batch_requests = false;
        _.each(this.request_batchers, function(batcher) {
          batcher.stop();
          batcher.clear();
        });
      };
      MixpanelLib.prototype.push = function(item) {
        this._execute_array([item]);
      };
      MixpanelLib.prototype.disable = function(events) {
        if (typeof events === "undefined") {
          this._flags.disable_all_events = true;
        } else {
          this.__disabled_events = this.__disabled_events.concat(events);
        }
      };
      MixpanelLib.prototype._encode_data_for_request = function(data) {
        var encoded_data = _.JSONEncode(data);
        if (this.get_config("api_payload_format") === PAYLOAD_TYPE_BASE64) {
          encoded_data = _.base64Encode(encoded_data);
        }
        return { "data": encoded_data };
      };
      MixpanelLib.prototype._track_or_batch = function(options, callback) {
        var truncated_data = _.truncate(options.data, 255);
        var endpoint = options.endpoint;
        var batcher = options.batcher;
        var should_send_immediately = options.should_send_immediately;
        var send_request_options = options.send_request_options || {};
        callback = callback || NOOP_FUNC;
        var request_enqueued_or_initiated = true;
        var send_request_immediately = _.bind(function() {
          if (!send_request_options.skip_hooks) {
            truncated_data = this._run_hook("before_send_" + options.type, truncated_data);
          }
          if (truncated_data) {
            console2.log("MIXPANEL REQUEST:");
            console2.log(truncated_data);
            return this._send_request(
              endpoint,
              this._encode_data_for_request(truncated_data),
              send_request_options,
              this._prepare_callback(callback, truncated_data)
            );
          } else {
            return null;
          }
        }, this);
        if (this._batch_requests && !should_send_immediately) {
          batcher.enqueue(truncated_data, function(succeeded) {
            if (succeeded) {
              callback(1, truncated_data);
            } else {
              send_request_immediately();
            }
          });
        } else {
          request_enqueued_or_initiated = send_request_immediately();
        }
        return request_enqueued_or_initiated && truncated_data;
      };
      MixpanelLib.prototype.track = addOptOutCheckMixpanelLib(function(event_name, properties, options, callback) {
        if (!callback && typeof options === "function") {
          callback = options;
          options = null;
        }
        options = options || {};
        var transport = options["transport"];
        if (transport) {
          options.transport = transport;
        }
        var should_send_immediately = options["send_immediately"];
        if (typeof callback !== "function") {
          callback = NOOP_FUNC;
        }
        if (_.isUndefined(event_name)) {
          this.report_error("No event name provided to mixpanel.track");
          return;
        }
        if (this._event_is_disabled(event_name)) {
          callback(0);
          return;
        }
        properties = properties || {};
        properties["token"] = this.get_config("token");
        var start_timestamp = this["persistence"].remove_event_timer(event_name);
        if (!_.isUndefined(start_timestamp)) {
          var duration_in_ms = new Date().getTime() - start_timestamp;
          properties["$duration"] = parseFloat((duration_in_ms / 1e3).toFixed(3));
        }
        this._set_default_superprops();
        properties = _.extend(
          {},
          _.info.properties(),
          this["persistence"].properties(),
          this.unpersisted_superprops,
          properties
        );
        var property_blacklist = this.get_config("property_blacklist");
        if (_.isArray(property_blacklist)) {
          _.each(property_blacklist, function(blacklisted_prop) {
            delete properties[blacklisted_prop];
          });
        } else {
          this.report_error("Invalid value for property_blacklist config: " + property_blacklist);
        }
        var data = {
          "event": event_name,
          "properties": properties
        };
        var ret = this._track_or_batch({
          type: "events",
          data,
          endpoint: this.get_config("api_host") + "/track/",
          batcher: this.request_batchers.events,
          should_send_immediately,
          send_request_options: options
        }, callback);
        return ret;
      });
      MixpanelLib.prototype.set_group = addOptOutCheckMixpanelLib(function(group_key, group_ids, callback) {
        if (!_.isArray(group_ids)) {
          group_ids = [group_ids];
        }
        var prop = {};
        prop[group_key] = group_ids;
        this.register(prop);
        return this["people"].set(group_key, group_ids, callback);
      });
      MixpanelLib.prototype.add_group = addOptOutCheckMixpanelLib(function(group_key, group_id, callback) {
        var old_values = this.get_property(group_key);
        if (old_values === void 0) {
          var prop = {};
          prop[group_key] = [group_id];
          this.register(prop);
        } else {
          if (old_values.indexOf(group_id) === -1) {
            old_values.push(group_id);
            this.register(prop);
          }
        }
        return this["people"].union(group_key, group_id, callback);
      });
      MixpanelLib.prototype.remove_group = addOptOutCheckMixpanelLib(function(group_key, group_id, callback) {
        var old_value = this.get_property(group_key);
        if (old_value !== void 0) {
          var idx = old_value.indexOf(group_id);
          if (idx > -1) {
            old_value.splice(idx, 1);
            this.register({ group_key: old_value });
          }
          if (old_value.length === 0) {
            this.unregister(group_key);
          }
        }
        return this["people"].remove(group_key, group_id, callback);
      });
      MixpanelLib.prototype.track_with_groups = addOptOutCheckMixpanelLib(function(event_name, properties, groups, callback) {
        var tracking_props = _.extend({}, properties || {});
        _.each(groups, function(v, k) {
          if (v !== null && v !== void 0) {
            tracking_props[k] = v;
          }
        });
        return this.track(event_name, tracking_props, callback);
      });
      MixpanelLib.prototype._create_map_key = function(group_key, group_id) {
        return group_key + "_" + JSON.stringify(group_id);
      };
      MixpanelLib.prototype._remove_group_from_cache = function(group_key, group_id) {
        delete this._cached_groups[this._create_map_key(group_key, group_id)];
      };
      MixpanelLib.prototype.get_group = function(group_key, group_id) {
        var map_key = this._create_map_key(group_key, group_id);
        var group = this._cached_groups[map_key];
        if (group === void 0 || group._group_key !== group_key || group._group_id !== group_id) {
          group = new MixpanelGroup();
          group._init(this, group_key, group_id);
          this._cached_groups[map_key] = group;
        }
        return group;
      };
      MixpanelLib.prototype.track_pageview = function(page) {
        if (_.isUndefined(page)) {
          page = document$1.location.href;
        }
        this.track("mp_page_view", _.info.pageviewInfo(page));
      };
      MixpanelLib.prototype.track_links = function() {
        return this._track_dom.call(this, LinkTracker, arguments);
      };
      MixpanelLib.prototype.track_forms = function() {
        return this._track_dom.call(this, FormTracker, arguments);
      };
      MixpanelLib.prototype.time_event = function(event_name) {
        if (_.isUndefined(event_name)) {
          this.report_error("No event name provided to mixpanel.time_event");
          return;
        }
        if (this._event_is_disabled(event_name)) {
          return;
        }
        this["persistence"].set_event_timer(event_name, new Date().getTime());
      };
      var REGISTER_DEFAULTS = {
        "persistent": true
      };
      var options_for_register = function(days_or_options) {
        var options;
        if (_.isObject(days_or_options)) {
          options = days_or_options;
        } else if (!_.isUndefined(days_or_options)) {
          options = { "days": days_or_options };
        } else {
          options = {};
        }
        return _.extend({}, REGISTER_DEFAULTS, options);
      };
      MixpanelLib.prototype.register = function(props, days_or_options) {
        var options = options_for_register(days_or_options);
        if (options["persistent"]) {
          this["persistence"].register(props, options["days"]);
        } else {
          _.extend(this.unpersisted_superprops, props);
        }
      };
      MixpanelLib.prototype.register_once = function(props, default_value, days_or_options) {
        var options = options_for_register(days_or_options);
        if (options["persistent"]) {
          this["persistence"].register_once(props, default_value, options["days"]);
        } else {
          if (typeof default_value === "undefined") {
            default_value = "None";
          }
          _.each(props, function(val, prop) {
            if (!this.unpersisted_superprops.hasOwnProperty(prop) || this.unpersisted_superprops[prop] === default_value) {
              this.unpersisted_superprops[prop] = val;
            }
          }, this);
        }
      };
      MixpanelLib.prototype.unregister = function(property, options) {
        options = options_for_register(options);
        if (options["persistent"]) {
          this["persistence"].unregister(property);
        } else {
          delete this.unpersisted_superprops[property];
        }
      };
      MixpanelLib.prototype._register_single = function(prop, value) {
        var props = {};
        props[prop] = value;
        this.register(props);
      };
      MixpanelLib.prototype.identify = function(new_distinct_id, _set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback, _unset_callback, _remove_callback) {
        var previous_distinct_id = this.get_distinct_id();
        this.register({ "$user_id": new_distinct_id });
        if (!this.get_property("$device_id")) {
          var device_id = previous_distinct_id;
          this.register_once({
            "$had_persisted_distinct_id": true,
            "$device_id": device_id
          }, "");
        }
        if (new_distinct_id !== previous_distinct_id && new_distinct_id !== this.get_property(ALIAS_ID_KEY)) {
          this.unregister(ALIAS_ID_KEY);
          this.register({ "distinct_id": new_distinct_id });
        }
        this._flags.identify_called = true;
        this["people"]._flush(_set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback, _unset_callback, _remove_callback);
        if (new_distinct_id !== previous_distinct_id) {
          this.track("$identify", {
            "distinct_id": new_distinct_id,
            "$anon_distinct_id": previous_distinct_id
          }, { skip_hooks: true });
        }
      };
      MixpanelLib.prototype.reset = function() {
        this["persistence"].clear();
        this._flags.identify_called = false;
        var uuid = _.UUID();
        this.register_once({
          "distinct_id": uuid,
          "$device_id": uuid
        }, "");
      };
      MixpanelLib.prototype.get_distinct_id = function() {
        return this.get_property("distinct_id");
      };
      MixpanelLib.prototype.alias = function(alias, original) {
        if (alias === this.get_property(PEOPLE_DISTINCT_ID_KEY)) {
          this.report_error("Attempting to create alias for existing People user - aborting.");
          return -2;
        }
        var _this = this;
        if (_.isUndefined(original)) {
          original = this.get_distinct_id();
        }
        if (alias !== original) {
          this._register_single(ALIAS_ID_KEY, alias);
          return this.track("$create_alias", {
            "alias": alias,
            "distinct_id": original
          }, {
            skip_hooks: true
          }, function() {
            _this.identify(alias);
          });
        } else {
          this.report_error("alias matches current distinct_id - skipping api call.");
          this.identify(alias);
          return -1;
        }
      };
      MixpanelLib.prototype.name_tag = function(name_tag) {
        this._register_single("mp_name_tag", name_tag);
      };
      MixpanelLib.prototype.set_config = function(config) {
        if (_.isObject(config)) {
          _.extend(this["config"], config);
          var new_batch_size = config["batch_size"];
          if (new_batch_size) {
            _.each(this.request_batchers, function(batcher) {
              batcher.resetBatchSize();
            });
          }
          if (!this.get_config("persistence_name")) {
            this["config"]["persistence_name"] = this["config"]["cookie_name"];
          }
          if (!this.get_config("disable_persistence")) {
            this["config"]["disable_persistence"] = this["config"]["disable_cookie"];
          }
          if (this["persistence"]) {
            this["persistence"].update_config(this["config"]);
          }
          Config.DEBUG = Config.DEBUG || this.get_config("debug");
        }
      };
      MixpanelLib.prototype.get_config = function(prop_name) {
        return this["config"][prop_name];
      };
      MixpanelLib.prototype._run_hook = function(hook_name) {
        var ret = (this["config"]["hooks"][hook_name] || IDENTITY_FUNC).apply(this, slice.call(arguments, 1));
        if (typeof ret === "undefined") {
          this.report_error(hook_name + " hook did not return a value");
          ret = null;
        }
        return ret;
      };
      MixpanelLib.prototype.get_property = function(property_name) {
        return this["persistence"]["props"][property_name];
      };
      MixpanelLib.prototype.toString = function() {
        var name = this.get_config("name");
        if (name !== PRIMARY_INSTANCE_NAME) {
          name = PRIMARY_INSTANCE_NAME + "." + name;
        }
        return name;
      };
      MixpanelLib.prototype._event_is_disabled = function(event_name) {
        return _.isBlockedUA(userAgent) || this._flags.disable_all_events || _.include(this.__disabled_events, event_name);
      };
      MixpanelLib.prototype._gdpr_init = function() {
        var is_localStorage_requested = this.get_config("opt_out_tracking_persistence_type") === "localStorage";
        if (is_localStorage_requested && _.localStorage.is_supported()) {
          if (!this.has_opted_in_tracking() && this.has_opted_in_tracking({ "persistence_type": "cookie" })) {
            this.opt_in_tracking({ "enable_persistence": false });
          }
          if (!this.has_opted_out_tracking() && this.has_opted_out_tracking({ "persistence_type": "cookie" })) {
            this.opt_out_tracking({ "clear_persistence": false });
          }
          this.clear_opt_in_out_tracking({
            "persistence_type": "cookie",
            "enable_persistence": false
          });
        }
        if (this.has_opted_out_tracking()) {
          this._gdpr_update_persistence({ "clear_persistence": true });
        } else if (!this.has_opted_in_tracking() && (this.get_config("opt_out_tracking_by_default") || _.cookie.get("mp_optout"))) {
          _.cookie.remove("mp_optout");
          this.opt_out_tracking({
            "clear_persistence": this.get_config("opt_out_persistence_by_default")
          });
        }
      };
      MixpanelLib.prototype._gdpr_update_persistence = function(options) {
        var disabled;
        if (options && options["clear_persistence"]) {
          disabled = true;
        } else if (options && options["enable_persistence"]) {
          disabled = false;
        } else {
          return;
        }
        if (!this.get_config("disable_persistence") && this["persistence"].disabled !== disabled) {
          this["persistence"].set_disabled(disabled);
        }
        if (disabled) {
          _.each(this.request_batchers, function(batcher) {
            batcher.clear();
          });
        }
      };
      MixpanelLib.prototype._gdpr_call_func = function(func, options) {
        options = _.extend({
          "track": _.bind(this.track, this),
          "persistence_type": this.get_config("opt_out_tracking_persistence_type"),
          "cookie_prefix": this.get_config("opt_out_tracking_cookie_prefix"),
          "cookie_expiration": this.get_config("cookie_expiration"),
          "cross_site_cookie": this.get_config("cross_site_cookie"),
          "cross_subdomain_cookie": this.get_config("cross_subdomain_cookie"),
          "cookie_domain": this.get_config("cookie_domain"),
          "secure_cookie": this.get_config("secure_cookie"),
          "ignore_dnt": this.get_config("ignore_dnt")
        }, options);
        if (!_.localStorage.is_supported()) {
          options["persistence_type"] = "cookie";
        }
        return func(this.get_config("token"), {
          track: options["track"],
          trackEventName: options["track_event_name"],
          trackProperties: options["track_properties"],
          persistenceType: options["persistence_type"],
          persistencePrefix: options["cookie_prefix"],
          cookieDomain: options["cookie_domain"],
          cookieExpiration: options["cookie_expiration"],
          crossSiteCookie: options["cross_site_cookie"],
          crossSubdomainCookie: options["cross_subdomain_cookie"],
          secureCookie: options["secure_cookie"],
          ignoreDnt: options["ignore_dnt"]
        });
      };
      MixpanelLib.prototype.opt_in_tracking = function(options) {
        options = _.extend({
          "enable_persistence": true
        }, options);
        this._gdpr_call_func(optIn, options);
        this._gdpr_update_persistence(options);
      };
      MixpanelLib.prototype.opt_out_tracking = function(options) {
        options = _.extend({
          "clear_persistence": true,
          "delete_user": true
        }, options);
        if (options["delete_user"] && this["people"] && this["people"]._identify_called()) {
          this["people"].delete_user();
          this["people"].clear_charges();
        }
        this._gdpr_call_func(optOut, options);
        this._gdpr_update_persistence(options);
      };
      MixpanelLib.prototype.has_opted_in_tracking = function(options) {
        return this._gdpr_call_func(hasOptedIn, options);
      };
      MixpanelLib.prototype.has_opted_out_tracking = function(options) {
        return this._gdpr_call_func(hasOptedOut, options);
      };
      MixpanelLib.prototype.clear_opt_in_out_tracking = function(options) {
        options = _.extend({
          "enable_persistence": true
        }, options);
        this._gdpr_call_func(clearOptInOut, options);
        this._gdpr_update_persistence(options);
      };
      MixpanelLib.prototype.report_error = function(msg, err) {
        console2.error.apply(console2.error, arguments);
        try {
          if (!err && !(msg instanceof Error)) {
            msg = new Error(msg);
          }
          this.get_config("error_reporter")(msg, err);
        } catch (err2) {
          console2.error(err2);
        }
      };
      MixpanelLib.prototype["init"] = MixpanelLib.prototype.init;
      MixpanelLib.prototype["reset"] = MixpanelLib.prototype.reset;
      MixpanelLib.prototype["disable"] = MixpanelLib.prototype.disable;
      MixpanelLib.prototype["time_event"] = MixpanelLib.prototype.time_event;
      MixpanelLib.prototype["track"] = MixpanelLib.prototype.track;
      MixpanelLib.prototype["track_links"] = MixpanelLib.prototype.track_links;
      MixpanelLib.prototype["track_forms"] = MixpanelLib.prototype.track_forms;
      MixpanelLib.prototype["track_pageview"] = MixpanelLib.prototype.track_pageview;
      MixpanelLib.prototype["register"] = MixpanelLib.prototype.register;
      MixpanelLib.prototype["register_once"] = MixpanelLib.prototype.register_once;
      MixpanelLib.prototype["unregister"] = MixpanelLib.prototype.unregister;
      MixpanelLib.prototype["identify"] = MixpanelLib.prototype.identify;
      MixpanelLib.prototype["alias"] = MixpanelLib.prototype.alias;
      MixpanelLib.prototype["name_tag"] = MixpanelLib.prototype.name_tag;
      MixpanelLib.prototype["set_config"] = MixpanelLib.prototype.set_config;
      MixpanelLib.prototype["get_config"] = MixpanelLib.prototype.get_config;
      MixpanelLib.prototype["get_property"] = MixpanelLib.prototype.get_property;
      MixpanelLib.prototype["get_distinct_id"] = MixpanelLib.prototype.get_distinct_id;
      MixpanelLib.prototype["toString"] = MixpanelLib.prototype.toString;
      MixpanelLib.prototype["opt_out_tracking"] = MixpanelLib.prototype.opt_out_tracking;
      MixpanelLib.prototype["opt_in_tracking"] = MixpanelLib.prototype.opt_in_tracking;
      MixpanelLib.prototype["has_opted_out_tracking"] = MixpanelLib.prototype.has_opted_out_tracking;
      MixpanelLib.prototype["has_opted_in_tracking"] = MixpanelLib.prototype.has_opted_in_tracking;
      MixpanelLib.prototype["clear_opt_in_out_tracking"] = MixpanelLib.prototype.clear_opt_in_out_tracking;
      MixpanelLib.prototype["get_group"] = MixpanelLib.prototype.get_group;
      MixpanelLib.prototype["set_group"] = MixpanelLib.prototype.set_group;
      MixpanelLib.prototype["add_group"] = MixpanelLib.prototype.add_group;
      MixpanelLib.prototype["remove_group"] = MixpanelLib.prototype.remove_group;
      MixpanelLib.prototype["track_with_groups"] = MixpanelLib.prototype.track_with_groups;
      MixpanelLib.prototype["start_batch_senders"] = MixpanelLib.prototype.start_batch_senders;
      MixpanelLib.prototype["stop_batch_senders"] = MixpanelLib.prototype.stop_batch_senders;
      MixpanelPersistence.prototype["properties"] = MixpanelPersistence.prototype.properties;
      MixpanelPersistence.prototype["update_search_keyword"] = MixpanelPersistence.prototype.update_search_keyword;
      MixpanelPersistence.prototype["update_referrer_info"] = MixpanelPersistence.prototype.update_referrer_info;
      MixpanelPersistence.prototype["get_cross_subdomain"] = MixpanelPersistence.prototype.get_cross_subdomain;
      MixpanelPersistence.prototype["clear"] = MixpanelPersistence.prototype.clear;
      var instances = {};
      var extend_mp = function() {
        _.each(instances, function(instance, name) {
          if (name !== PRIMARY_INSTANCE_NAME) {
            mixpanel_master[name] = instance;
          }
        });
        mixpanel_master["_"] = _;
      };
      var override_mp_init_func = function() {
        mixpanel_master["init"] = function(token, config, name) {
          if (name) {
            if (!mixpanel_master[name]) {
              mixpanel_master[name] = instances[name] = create_mplib(token, config, name);
              mixpanel_master[name]._loaded();
            }
            return mixpanel_master[name];
          } else {
            var instance = mixpanel_master;
            if (instances[PRIMARY_INSTANCE_NAME]) {
              instance = instances[PRIMARY_INSTANCE_NAME];
            } else if (token) {
              instance = create_mplib(token, config, PRIMARY_INSTANCE_NAME);
              instance._loaded();
              instances[PRIMARY_INSTANCE_NAME] = instance;
            }
            mixpanel_master = instance;
            if (init_type === INIT_SNIPPET) {
              window$1[PRIMARY_INSTANCE_NAME] = mixpanel_master;
            }
            extend_mp();
          }
        };
      };
      var add_dom_loaded_handler = function() {
        function dom_loaded_handler() {
          if (dom_loaded_handler.done) {
            return;
          }
          dom_loaded_handler.done = true;
          DOM_LOADED = true;
          ENQUEUE_REQUESTS = false;
          _.each(instances, function(inst) {
            inst._dom_loaded();
          });
        }
        function do_scroll_check() {
          try {
            document$1.documentElement.doScroll("left");
          } catch (e) {
            setTimeout(do_scroll_check, 1);
            return;
          }
          dom_loaded_handler();
        }
        if (document$1.addEventListener) {
          if (document$1.readyState === "complete") {
            dom_loaded_handler();
          } else {
            document$1.addEventListener("DOMContentLoaded", dom_loaded_handler, false);
          }
        } else if (document$1.attachEvent) {
          document$1.attachEvent("onreadystatechange", dom_loaded_handler);
          var toplevel = false;
          try {
            toplevel = window$1.frameElement === null;
          } catch (e) {
          }
          if (document$1.documentElement.doScroll && toplevel) {
            do_scroll_check();
          }
        }
        _.register_event(window$1, "load", dom_loaded_handler, true);
      };
      function init_as_module() {
        init_type = INIT_MODULE;
        mixpanel_master = new MixpanelLib();
        override_mp_init_func();
        mixpanel_master["init"]();
        add_dom_loaded_handler();
        return mixpanel_master;
      }
      var mixpanel2 = init_as_module();
      module.exports = mixpanel2;
    }
  });

  // src/eztrack.js
  var import_mixpanel_browser = __toESM(require_mixpanel_cjs(), 1);

  // node_modules/query-selector-shadow-dom/src/normalize.js
  function normalizeSelector(sel) {
    function saveUnmatched() {
      if (unmatched) {
        if (tokens.length > 0 && /^[~+>]$/.test(tokens[tokens.length - 1])) {
          tokens.push(" ");
        }
        tokens.push(unmatched);
      }
    }
    var tokens = [], match, unmatched, regex, state = [0], next_match_idx = 0, prev_match_idx, not_escaped_pattern = /(?:[^\\]|(?:^|[^\\])(?:\\\\)+)$/, whitespace_pattern = /^\s+$/, state_patterns = [
      /\s+|\/\*|["'>~+[(]/g,
      /\s+|\/\*|["'[\]()]/g,
      /\s+|\/\*|["'[\]()]/g,
      null,
      /\*\//g
    ];
    sel = sel.trim();
    while (true) {
      unmatched = "";
      regex = state_patterns[state[state.length - 1]];
      regex.lastIndex = next_match_idx;
      match = regex.exec(sel);
      if (match) {
        prev_match_idx = next_match_idx;
        next_match_idx = regex.lastIndex;
        if (prev_match_idx < next_match_idx - match[0].length) {
          unmatched = sel.substring(
            prev_match_idx,
            next_match_idx - match[0].length
          );
        }
        if (state[state.length - 1] < 3) {
          saveUnmatched();
          if (match[0] === "[") {
            state.push(1);
          } else if (match[0] === "(") {
            state.push(2);
          } else if (/^["']$/.test(match[0])) {
            state.push(3);
            state_patterns[3] = new RegExp(match[0], "g");
          } else if (match[0] === "/*") {
            state.push(4);
          } else if (/^[\])]$/.test(match[0]) && state.length > 0) {
            state.pop();
          } else if (/^(?:\s+|[~+>])$/.test(match[0])) {
            if (tokens.length > 0 && !whitespace_pattern.test(tokens[tokens.length - 1]) && state[state.length - 1] === 0) {
              tokens.push(" ");
            }
            if (state[state.length - 1] === 1 && tokens.length === 5 && tokens[2].charAt(tokens[2].length - 1) === "=") {
              tokens[4] = " " + tokens[4];
            }
            if (whitespace_pattern.test(match[0])) {
              continue;
            }
          }
          tokens.push(match[0]);
        } else {
          tokens[tokens.length - 1] += unmatched;
          if (not_escaped_pattern.test(tokens[tokens.length - 1])) {
            if (state[state.length - 1] === 4) {
              if (tokens.length < 2 || whitespace_pattern.test(tokens[tokens.length - 2])) {
                tokens.pop();
              } else {
                tokens[tokens.length - 1] = " ";
              }
              match[0] = "";
            }
            state.pop();
          }
          tokens[tokens.length - 1] += match[0];
        }
      } else {
        unmatched = sel.substr(next_match_idx);
        saveUnmatched();
        break;
      }
    }
    return tokens.join("").trim();
  }

  // node_modules/query-selector-shadow-dom/src/querySelectorDeep.js
  function querySelectorAllDeep(selector, root = document, allElements = null) {
    return _querySelectorDeep(selector, true, root, allElements);
  }
  function _querySelectorDeep(selector, findMany, root, allElements = null) {
    selector = normalizeSelector(selector);
    let lightElement = root.querySelector(selector);
    if (document.head.createShadowRoot || document.head.attachShadow) {
      if (!findMany && lightElement) {
        return lightElement;
      }
      const selectionsToMake = splitByCharacterUnlessQuoted(selector, ",");
      return selectionsToMake.reduce((acc, minimalSelector) => {
        if (!findMany && acc) {
          return acc;
        }
        const splitSelector = splitByCharacterUnlessQuoted(minimalSelector.replace(/^\s+/g, "").replace(/\s*([>+~]+)\s*/g, "$1"), " ").filter((entry) => !!entry).map((entry) => splitByCharacterUnlessQuoted(entry, ">"));
        const possibleElementsIndex = splitSelector.length - 1;
        const lastSplitPart = splitSelector[possibleElementsIndex][splitSelector[possibleElementsIndex].length - 1];
        const possibleElements = collectAllElementsDeep(lastSplitPart, root, allElements);
        const findElements = findMatchingElement(splitSelector, possibleElementsIndex, root);
        if (findMany) {
          acc = acc.concat(possibleElements.filter(findElements));
          return acc;
        } else {
          acc = possibleElements.find(findElements);
          return acc || null;
        }
      }, findMany ? [] : null);
    } else {
      if (!findMany) {
        return lightElement;
      } else {
        return root.querySelectorAll(selector);
      }
    }
  }
  function findMatchingElement(splitSelector, possibleElementsIndex, root) {
    return (element) => {
      let position = possibleElementsIndex;
      let parent = element;
      let foundElement = false;
      while (parent && !isDocumentNode(parent)) {
        let foundMatch = true;
        if (splitSelector[position].length === 1) {
          foundMatch = parent.matches(splitSelector[position]);
        } else {
          const reversedParts = [].concat(splitSelector[position]).reverse();
          let newParent = parent;
          for (const part of reversedParts) {
            if (!newParent || !newParent.matches(part)) {
              foundMatch = false;
              break;
            }
            newParent = findParentOrHost(newParent, root);
          }
        }
        if (foundMatch && position === 0) {
          foundElement = true;
          break;
        }
        if (foundMatch) {
          position--;
        }
        parent = findParentOrHost(parent, root);
      }
      return foundElement;
    };
  }
  function splitByCharacterUnlessQuoted(selector, character) {
    return selector.match(/\\?.|^$/g).reduce((p, c) => {
      if (c === '"' && !p.sQuote) {
        p.quote ^= 1;
        p.a[p.a.length - 1] += c;
      } else if (c === "'" && !p.quote) {
        p.sQuote ^= 1;
        p.a[p.a.length - 1] += c;
      } else if (!p.quote && !p.sQuote && c === character) {
        p.a.push("");
      } else {
        p.a[p.a.length - 1] += c;
      }
      return p;
    }, { a: [""] }).a;
  }
  function isDocumentNode(node) {
    return node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.DOCUMENT_NODE;
  }
  function findParentOrHost(element, root) {
    const parentNode = element.parentNode;
    return parentNode && parentNode.host && parentNode.nodeType === 11 ? parentNode.host : parentNode === root ? null : parentNode;
  }
  function collectAllElementsDeep(selector = null, root, cachedElements = null) {
    let allElements = [];
    if (cachedElements) {
      allElements = cachedElements;
    } else {
      const findAllElements = function(nodes) {
        for (let i = 0; i < nodes.length; i++) {
          const el = nodes[i];
          allElements.push(el);
          if (el.shadowRoot) {
            findAllElements(el.shadowRoot.querySelectorAll("*"));
          }
        }
      };
      if (root.shadowRoot) {
        findAllElements(root.shadowRoot.querySelectorAll("*"));
      }
      findAllElements(root.querySelectorAll("*"));
    }
    return selector ? allElements.filter((el) => el.matches(selector)) : allElements;
  }

  // src/attributes.js
  var PAGE_PROPS = {
    "PAGE \u2192 full url (/)": decodeURIComponent(document.location.href),
    "PAGE \u2192 short url (/)": decodeURIComponent(window.location.pathname),
    "PAGE \u2192 url params (?)": qsToObj(window.location.search),
    "PAGE \u2192 height": window.innerHeight,
    "PAGE \u2192 width": window.innerWidth,
    "PAGE \u2192 title": document.title,
    "SESSION \u2192 # pages": window.history.length,
    $source: "mpEZTrack"
  };
  var DEVICE_PROPS = (mixpanel2) => {
    const { $os, $browser, $referrer, $referring_domain, $browser_version, $screen_height, $screen_width } = mixpanel2._.info.properties();
    mixpanel2.ez.register_once({ "DEVICE \u2192 first referrer": $referrer, "DEVICE \u2192 first referring domain": $referring_domain });
    return {
      "DEVICE \u2192 operating system": $os,
      "DEVICE \u2192 browser": $browser,
      "DEVICE \u2192 browser version": $browser_version,
      "DEVICE \u2192 last referrer": $referrer,
      "DEVICE \u2192 last referring domain": $referring_domain,
      "DEVICE \u2192 screen height (px)": $screen_height,
      "DEVICE \u2192 screen width (px)": $screen_width,
      "DEVICE \u2192 screen dim": `${window.screen?.width} x ${window.screen?.height}`,
      "DEVICE \u2192 language": window.navigator.language,
      "DEVICE \u2192 pixel ratio": window.devicePixelRatio,
      "DEVICE \u2192 bandwidth": window.navigator.connection ? window.navigator.connection.effectiveType : "unknown",
      "DEVICE \u2192 memory (GB)": window.navigator.deviceMemory ? window.navigator.deviceMemory : "unknown",
      "DEVICE \u2192 platform": window.navigator.userAgentData ? window.navigator.userAgentData.platform : "unknown",
      "DEVICE \u2192 is mobile?": window.navigator.userAgentData ? window.navigator.userAgentData.mobile : "unknown"
    };
  };
  var BLACKLIST_ELEMENTS = `*[type="password"], *[type="hidden"], *.sensitive, *.pendo-ignore, *[data-heap-redact-text], *[data-heap-redact-attributes], label`;
  var LISTENER_OPTIONS = {
    passive: true
  };
  var STANDARD_FIELDS = (el, label = `ELEM`) => ({
    [`${label} \u2192 classes`]: el.classList ? [...el.classList] : [],
    [`${label} \u2192 height`]: el.offsetHeight,
    [`${label} \u2192 width`]: el.offsetWidth,
    [`${label} \u2192 tag (<>)`]: "".concat("<", el.tagName, ">"),
    ...conditionalFields(el, label),
    ...enumNodeProps(el, label)
  });
  var LINK_SELECTORS = `a`;
  var LINK_FIELDS = (el, label = `LINK`) => ({
    [`${label} \u2192 text`]: squish(el.textContent)
  });
  var BUTTON_SELECTORS = `button, .button, .btn, input[type="button"], input[type="file"], input[type="image"], input[type="submit"], input[type="reset"]`;
  var BUTTON_FIELDS = (el) => ({
    "BUTTON \u2192 text": squish(el.textContent)
  });
  var FORM_SELECTORS = `form`;
  var FORM_FIELDS = (el) => ({
    "FORM \u2192 # inputs": el.length,
    "FORM \u2192 method": el.method,
    "FORM \u2192 action": el.action,
    "FORM \u2192 encoding": el.encoding
  });
  var DROPDOWN_SELECTOR = `select, input[list], input[type="radio"], input[type="checkbox"], input[type="range"], input[type="color"], input[type="range"]`;
  var DROPDOWN_FIELDS = (el) => {
    let props = {
      "OPTION \u2192 user selected": el.value === "on" ? el.checked : el.value,
      "OPTION \u2192 labels": [...el.labels].map((label) => label.textContent?.trim())
    };
    try {
      let choices = el.innerText.split("\n");
      if (choices.length > 1) {
        props["OPTION \u2192 choices"] = choices;
      } else if (el?.list) {
        choices = [...el.list.children].map((opt) => opt.value);
        props["OPTION \u2192 choices"] = choices;
      }
    } catch (e) {
      (() => {
      })();
    }
    return props;
  };
  var INPUT_SELECTOR = `input[type="text"], input[type="email"], input[type="url"], input[type="search"], textarea`;
  var INPUT_FIELDS = (el) => ({
    "CONTENT \u2192 user content": isSensitiveData(el.value) ? "******" : el.value,
    "CONTENT \u2192 labels": [...el.labels].map((label) => squish(label.textContent))
  });
  var ALL_SELECTOR = `*:not(script):not(title):not(meta):not(link):not([type="password"])`;
  var ANY_TAG_FIELDS = (el, guard = false) => {
    const fields = {
      "ELEM \u2192 text": guard ? "******" : el.textContent?.trim() || el.value?.trim(),
      "ELEM \u2192 is editable?": el.isContentEditable
    };
    if (isSensitiveData(fields["ELEM \u2192 text"])) {
      fields["ELEM \u2192 text"] = "******";
    }
    return fields;
  };
  var VIDEO_SELECTOR = `video`;
  var VIDEO_FIELDS = (el) => ({
    "VIDEO \u2192 watch time": el.currentTime,
    "VIDEO \u2192 total time": el.duration,
    "VIDEO \u2192 watch %": Number(Number(el.currentTime / el.duration * 100).toFixed(2)),
    "VIDEO \u2192 autoplay?": el.autoplay,
    "VIDEO \u2192 controls visible?": el.controls,
    "VIDEO \u2192 loops?": el.loop,
    "VIDEO \u2192 muted?": el.muted,
    "VIDEO \u2192 thumbnail": el.poster,
    "VIDEO \u2192 source(s)": el.src || [...el.querySelectorAll("source")].map((source) => source.src),
    "VIDEO \u2192 source type(s)": el.src.split(".").slice(-1)[0] || [...el.querySelectorAll("source")].map((source) => source.type)
  });
  var YOUTUBE_SELECTOR = `iframe`;
  function enumNodeProps(el, label = "ELEM") {
    const result = {};
    const boolAttrs = [
      "allowfullscreen",
      "async",
      "autofocus",
      "autoplay",
      "checked",
      "controls",
      "default",
      "defer",
      "disabled",
      "formnovalidate",
      "ismap",
      "itemscope",
      "loop",
      "multiple",
      "muted",
      "nomodule",
      "novalidate",
      "open",
      "playsinline",
      "readonly",
      "required",
      "reversed",
      "selected",
      "truespeed"
    ];
    const replaceAttrs = {
      "aria-": "DATA \u2192 ",
      "data-": "DATA \u2192 ",
      src: "source",
      alt: "desc",
      class: "class (delete)"
    };
    let potentialPassEl = false;
    loopAttributes:
      for (var att, i = 0, atts = el.attributes, n = atts?.length || 0; i < n; i++) {
        att = atts[i];
        let potentialPassAttr = false;
        let keySuffix = mapReplace(att.name, replaceAttrs);
        let keyName = `${label} \u2192 ${keySuffix}`;
        let val = att.value?.trim();
        if (keySuffix?.toLowerCase()?.includes("pass")) {
          potentialPassAttr = true;
          potentialPassEl = true;
        }
        if (keySuffix?.startsWith("on"))
          continue loopAttributes;
        if (keySuffix === "nonce")
          continue loopAttributes;
        if (keySuffix === "d")
          continue loopAttributes;
        if (boolAttrs.some((attr) => attr === att.name)) {
          val = true;
          keyName += "?";
        }
        if (potentialPassAttr)
          val = `******`;
        if (isSensitiveData(val))
          val = `******`;
        if (val)
          result[keyName] = val;
      }
    delete result[`${label} \u2192 class (delete)`];
    delete result[`${label} \u2192 style`];
    if (potentialPassEl) {
      result[`${label} \u2192 user content`] = `******`;
      result[`${label} \u2192 text`] = `******`;
      result[`${label} \u2192 value`] = `******`;
    }
    return result;
  }
  function conditionalFields(el, label = "ELEM") {
    const results = {};
    const labelString = `${label} \u2192 label`;
    if (Array.from(el?.labels || "").length === 0) {
      if (el.previousElementSibling?.nodeName === `LABEL`) {
        results[labelString] = el.previousElementSibling.textContent.trim();
      }
      if (el.nextElementSibling?.nodeName === `LABEL`) {
        results[labelString] = el.nextElementSibling.textContent.trim();
      }
      if (el.parentElement?.nodeName === `LABEL`) {
        results[labelString] = el.parentElement.textContent.trim();
      }
      if (el.childNodes?.[0]?.nodeName === `LABEL`) {
        results[labelString] = el.childNodes[0].textContent.trim();
      }
      if (el.parentElement?.title)
        results[labelString] = el.parentElement.title.trim();
      if (el.parentElement?.name)
        results[labelString] = el.parentElement.name.trim();
      if (el.parentElement?.id)
        results[labelString] = el.parentElement.id.trim();
      if (!results[labelString]) {
        let findLabelRecursively = function(el2) {
          try {
            if (!el2) {
              return false;
            }
            if (el2.textContent) {
              if (el2.textContent.trim() !== "") {
                results[labelString] = truncate(squish(el2.textContent));
                return true;
              }
            } else {
              findLabelRecursively(el2?.parentElement);
            }
          } catch (e) {
            return false;
          }
        };
        findLabelRecursively(el);
      }
    }
    if (typeof el.checked === "boolean") {
      results[`${label} \u2192 checked`] = el.checked;
    }
    if (typeof el.required === "boolean") {
      results[`${label} \u2192 required?`] = el.checked;
    }
    return results;
  }
  function linkOrNav(el) {
    const href = el?.getAttribute("href") || "";
    const linkType = {
      eventName: ``,
      label: ``
    };
    if (href?.startsWith("#")) {
      linkType.eventName = `navigation`;
      linkType.label = `NAV`;
    } else if (href?.startsWith("/")) {
      linkType.eventName = `navigation`;
      linkType.label = `NAV`;
    } else if (href?.startsWith(".")) {
      linkType.eventName = `navigation`;
      linkType.label = `NAV`;
    } else if (href?.includes(this.host)) {
      linkType.eventName = `navigation`;
      linkType.label = `NAV`;
    } else if (href?.startsWith("javascript")) {
      linkType.eventName = `navigation`;
      linkType.label = `NAV`;
    } else if (!href) {
      linkType.eventName = `navigation`;
      linkType.label = `NAV`;
    } else {
      linkType.eventName = `link`;
      linkType.label = `LINK`;
    }
    return linkType;
  }
  function isSensitiveData(text = "") {
    if (!text)
      return false;
    const sensitiveTests = [isCreditCardNo, isSSN];
    const tests = sensitiveTests.map((testFn) => {
      return testFn(text);
    });
    return tests.some((bool) => bool);
  }
  function escape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
  function mapReplace(str, replacements) {
    var regex = [];
    for (var prop in replacements) {
      regex.push(escape(prop));
    }
    regex = new RegExp(regex.join("|"), "g");
    return str.replace(regex, function(match) {
      return replacements[match];
    });
  }
  function squish(string = "") {
    const CONSECUTIVE_SPACES = /\s+/g;
    return string.trim().replace(CONSECUTIVE_SPACES, " ");
  }
  function truncate(text, n = 50, useWordBoundary = true) {
    if (!text) {
      return "";
    }
    if (text.length <= n) {
      return text;
    }
    var subString = text.substr(0, n - 1);
    return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(" ")) : subString) + "...";
  }
  function qsToObj(queryString) {
    try {
      const parsedQs = new URLSearchParams(queryString);
      const params = Object.fromEntries(parsedQs);
      return params;
    } catch (e) {
      return {};
    }
  }
  function isCreditCardNo(cardNo = "") {
    if (!cardNo)
      return false;
    if (typeof cardNo !== "string")
      cardNo = cardNo?.toString();
    if (cardNo === "0")
      return false;
    var s = 0;
    var doubleDigit = false;
    for (var i = cardNo.length - 1; i >= 0; i--) {
      var digit = +cardNo[i];
      if (doubleDigit) {
        digit *= 2;
        if (digit > 9)
          digit -= 9;
      }
      s += digit;
      doubleDigit = !doubleDigit;
    }
    return s % 10 == 0;
  }
  function isSSN(ssn = "") {
    if (!ssn)
      return false;
    var regexp = /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/;
    if (regexp.test(ssn)) {
      return true;
    } else {
      return false;
    }
  }

  // src/eztrack.js
  var ezTrack = {
    init: entryPoint,
    token: "",
    tabId: null,
    tabTrack: generateTabId,
    loadTimeUTC: Date.now(),
    numActions: 0,
    isFirstVisit: true,
    priorVisit: firstVisitChecker,
    hasVisibilityChanged: false,
    superProps: {},
    getProps: getSuperProperties,
    clearQueue: clearExistingMixpanelQueue,
    getEZConfig: getEZTrackConfig,
    debug: () => {
      import_mixpanel_browser.default.ez.set_config({ debug: true });
    },
    mpDefaults: [
      "$os",
      "$browser",
      "$referrer",
      "$referring_domain",
      "$current_url",
      "$browser_version",
      "$screen_height",
      "$screen_width",
      "$initial_referrer",
      "$initial_referring_domain"
    ],
    trackedElements: [],
    blackListedElements: [],
    host: document.location.host,
    bind: bindTrackers,
    query: querySelectorAllDeep,
    spa: singlePageAppTracking,
    spaPipe: spaPipeline,
    buttons: listenForButtonClicks,
    links: listenForLinkClicks,
    forms: listenForFormSubmits,
    selectors: listenForDropDownChanges,
    inputs: listenForUserInput,
    clicks: listenForAllClicks,
    videos: listenForVideo,
    linkOrNav,
    buttonTrack: trackButtonClick,
    linkTrack: trackLinkClick,
    formTrack: trackFormSubmit,
    selectTrack: trackDropDownChange,
    inputTrack: trackInputChange,
    videoTrack: trackVideo,
    clickTrack: trackAnyClick,
    youtube: trackYoutubeVideos,
    pageView: trackPageViews,
    pageExit: trackPageExits,
    window: trackWindowStuff,
    error: trackErrors,
    clipboard: trackClipboard,
    profiles: createUserProfiles,
    defaultOpts: getDefaultOptions
  };
  function entryPoint(token = ``, userSuppliedOptions = {}, forceTrue = false) {
    if (!token || token.length !== 32) {
      console.error(
        `EZTrack: Bad Token!

got: "${token}"
expected 32 char string

double check your mixpanel project token and try again!
https://developer.mixpanel.com/reference/project-token`
      );
      throw new Error(`BAD TOKEN! TRY AGAIN`);
    }
    this.token = token;
    const defaultOpts = this.defaultOpts();
    const opts = { ...defaultOpts, ...userSuppliedOptions };
    if (forceTrue) {
      for (let key in opts) {
        if (typeof opts[key] === "boolean")
          opts[key] = true;
        if (typeof opts[key] === "number")
          opts[key] = 0;
      }
      if (forceTrue === "nodebug")
        opts.debug = false;
    }
    this.opts = Object.freeze(opts);
    if (opts.window)
      this.clearQueue(token, opts);
    try {
      import_mixpanel_browser.default.init(
        token,
        {
          debug: opts.debug,
          cross_subdomain_cookie: true,
          persistence: opts.persistence,
          cookie_domain: opts.cookie_domain,
          ip: opts.location,
          ignore_dnt: true,
          batch_flush_interval_ms: opts.refresh,
          property_blacklist: this.mpDefaults,
          loaded: (mp) => {
            try {
              const superProps = this.getProps(token, opts, import_mixpanel_browser.default);
              if (opts.debug)
                this.superProps = superProps;
              mp.register(superProps, { persistent: false });
            } catch (e) {
              if (opts.debug) {
                console.error("mpEZTrack failed to setup super properties!");
                console.log(e);
              }
            }
            try {
              this.blackListedElements = [...this.query(BLACKLIST_ELEMENTS)];
            } catch (e) {
              if (opts.debug) {
                console.error("mpEZTrack failed bind to query for sensitive fields!");
                console.log(e);
              }
            }
            try {
              this.bind(mp, opts);
            } catch (e) {
              if (opts.debug) {
                console.error("mpEZTrack failed bind to the DOM!");
                console.log(e);
              }
            }
          },
          ...this.opts
        },
        "ez"
      );
      if (opts.extend) {
        window.mixpanel = import_mixpanel_browser.default;
        try {
          const loadedEvent = new Event("mpEZTrackLoaded");
          window.dispatchEvent(loadedEvent);
        } catch (e) {
          if (opts.debug) {
            console.error("mpEZTrack failed to dispatch loaded event!");
            console.log(e);
          }
        }
      }
    } catch (e) {
      if (opts.debug)
        console.log(e);
    }
  }
  function getDefaultOptions(opts = {}) {
    const defaults = {
      debug: false,
      extend: false,
      refresh: 5e3,
      location: true,
      persistence: "localStorage",
      cookie_domain: "",
      deviceProps: true,
      pageView: true,
      pageExit: true,
      links: true,
      buttons: true,
      forms: true,
      profiles: true,
      selectors: true,
      videos: true,
      window: true,
      spa: true,
      inputs: false,
      clicks: false,
      youtube: false,
      clipboard: false,
      firstPage: false,
      error: false,
      tabs: false,
      logProps: false
    };
    if (opts?.region?.toLowerCase() === "eu")
      defaults.api_host = "https://api-eu.mixpanel.com";
    if (opts?.region?.toLowerCase() === "us")
      defaults.api_host = "https://api-js.mixpanel.com";
    return defaults;
  }
  function getSuperProperties(token = this.token, opts = this.opts, mixpanelClass) {
    let result = PAGE_PROPS;
    try {
      if (opts.deviceProps)
        result = { ...DEVICE_PROPS(mixpanelClass), ...result };
    } catch (e) {
    }
    try {
      if (opts.firstPage)
        result = { ...this.priorVisit(token, opts), ...result };
    } catch (e) {
    }
    try {
      if (opts.tabs)
        result = { ...this.tabTrack(token), ...result };
    } catch (e) {
    }
    return result;
  }
  function bindTrackers(mp, opts) {
    try {
      if (opts.pageView)
        this.pageView(mp, opts);
      if (opts.pageExit)
        this.pageExit(mp, opts);
      if (opts.window)
        this.window(mp, opts);
      if (opts.error)
        this.error(mp, opts);
      if (opts.clipboard)
        this.clipboard(mp, opts);
      if (opts.profiles)
        this.profiles(mp, opts);
      if (opts.buttons)
        this.buttons(mp, opts);
      if (opts.forms)
        this.forms(mp, opts);
      if (opts.selectors)
        this.selectors(mp, opts);
      if (opts.inputs)
        this.inputs(mp, opts);
      if (opts.links)
        this.links(mp, opts);
      if (opts.videos)
        this.videos(mp, opts);
      if (opts.youtube)
        this.youtube(mp, opts);
      if (opts.spa)
        this.spa(mp, opts);
    } catch (e) {
      if (opts.debug)
        console.log(e);
    }
  }
  function statefulProps(increment = true, includeTime = true, includeScroll = true) {
    if (increment)
      ezTrack.numActions += 1;
    const scrollPercent = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100 || 0;
    const stateful = {
      "PAGE \u2192 # actions": ezTrack.numActions
    };
    if (includeTime)
      stateful["SESSION \u2192 time on page (sec)"] = (Date.now() - ezTrack.loadTimeUTC) / 1e3;
    if (includeScroll)
      stateful["PAGE \u2192 scroll (%)"] = Number(scrollPercent.toFixed(2));
    return stateful;
  }
  function firstVisitChecker(token = this.token, opts = this.opts, timeoutMins = 30) {
    if (opts.firstPage) {
      try {
        const firstVisitTime = localStorage.getItem(`MPEZTrack_First_Visit_${token}`);
        const timeout = 6e4 * timeoutMins;
        if (firstVisitTime === null) {
          localStorage.setItem(`MPEZTrack_First_Page_${token}`, this.loadTimeUTC);
          return { "SESSION \u2192 first visit?": true };
        } else if (this.loadTimeUTC - firstVisitTime <= timeout) {
          return { "SESSION \u2192 first visit?": true };
        } else {
          this.isFirstVisit = false;
          return { "SESSION \u2192 first visit?": false };
        }
      } catch (e) {
        if (opts.debug)
          console.log(e);
        return { "DEVICE \u2192 first visit?": "unknown" };
      }
    } else {
      return {};
    }
  }
  function listenForButtonClicks(mp, opts) {
    const buttons = uniqueNodes(this.query(BUTTON_SELECTORS)).filter((node) => !node.matches(BLACKLIST_ELEMENTS)).filter((node) => !this.trackedElements.some((el) => el === node)).filter((node) => !this.blackListedElements.some((el) => el === node));
    for (const button of buttons) {
      this.trackedElements.push(button);
      button.addEventListener(
        "click",
        (ev) => {
          try {
            this.buttonTrack(ev, mp, opts);
          } catch (e) {
            if (opts.debug)
              console.log(e);
          }
        },
        LISTENER_OPTIONS
      );
    }
  }
  function listenForLinkClicks(mp, opts) {
    const links = uniqueNodes(this.query(LINK_SELECTORS)).filter((node) => !node.matches(BLACKLIST_ELEMENTS)).filter((node) => !this.trackedElements.some((el) => el === node)).filter((node) => !this.blackListedElements.some((el) => el === node));
    for (const link of links) {
      this.trackedElements.push(link);
      link.addEventListener(
        "click",
        (ev) => {
          try {
            this.linkTrack(ev, mp, opts);
          } catch (e) {
            if (opts.debug)
              console.log(e);
          }
        },
        LISTENER_OPTIONS
      );
    }
  }
  function listenForFormSubmits(mp, opts) {
    const forms = uniqueNodes(this.query(FORM_SELECTORS));
    for (const form of forms) {
      this.trackedElements.push(form);
      form.addEventListener(
        "submit",
        (ev) => {
          try {
            this.formTrack(ev, mp, opts);
          } catch (e) {
            if (opts.debug)
              console.log(e);
          }
        },
        LISTENER_OPTIONS
      );
    }
  }
  function listenForDropDownChanges(mp, opts) {
    let allDropdowns = uniqueNodes(this.query(DROPDOWN_SELECTOR)).filter((node) => !node.matches(BLACKLIST_ELEMENTS)).filter((node) => !this.trackedElements.some((el) => el === node)).filter((node) => !this.blackListedElements.some((el) => el === node));
    for (const dropdown of allDropdowns) {
      this.trackedElements.push(dropdown);
      dropdown.addEventListener(
        "change",
        (ev) => {
          try {
            this.selectTrack(ev, mp, opts);
          } catch (e) {
            if (opts.debug)
              console.log(e);
          }
        },
        LISTENER_OPTIONS
      );
    }
  }
  function listenForVideo(mp, opts) {
    let allVideos = uniqueNodes(this.query(VIDEO_SELECTOR)).filter((node) => !node.matches(BLACKLIST_ELEMENTS)).filter((node) => !this.trackedElements.some((el) => el === node)).filter((node) => !this.blackListedElements.some((el) => el === node));
    for (const video of allVideos) {
      this.trackedElements.push(video);
      video.addEventListener(
        "play",
        (ev) => {
          try {
            this.videoTrack(ev, mp, opts);
          } catch (e) {
            if (opts.debug)
              console.log(e);
          }
        },
        LISTENER_OPTIONS
      );
      video.addEventListener(
        "pause",
        (ev) => {
          try {
            this.videoTrack(ev, mp, opts);
          } catch (e) {
            if (opts.debug)
              console.log(e);
          }
        },
        LISTENER_OPTIONS
      );
      video.addEventListener(
        "ended",
        (ev) => {
          try {
            this.videoTrack(ev, mp, opts);
          } catch (e) {
            if (opts.debug)
              console.log(e);
          }
        },
        LISTENER_OPTIONS
      );
    }
  }
  function listenForUserInput(mp, opts) {
    let inputElements = uniqueNodes(this.query(INPUT_SELECTOR)).filter((node) => !node.matches(BLACKLIST_ELEMENTS)).filter((node) => !this.trackedElements.some((el) => el === node)).filter((node) => !this.blackListedElements.some((el) => el === node));
    for (const input of inputElements) {
      this.trackedElements.push(input);
      input.addEventListener(
        "change",
        (ev) => {
          try {
            this.inputTrack(ev, mp, opts);
          } catch (e) {
            if (opts.debug)
              console.log(e);
          }
        },
        LISTENER_OPTIONS
      );
    }
  }
  function listenForAllClicks(mp, opts) {
    let allThings = uniqueNodes(
      this.query(ALL_SELECTOR).filter((node) => node.childElementCount === 0).filter((node) => !this.trackedElements.some((el) => el === node)).filter((node) => !this.trackedElements.some((trackedEl) => trackedEl.contains(node))).filter((node) => !this.trackedElements.some((trackedEl) => node.parentNode === trackedEl)).filter((node) => !node.matches(BLACKLIST_ELEMENTS)).filter((node) => !this.blackListedElements.some((el) => el === node))
    );
    for (const thing of allThings) {
      this.trackedElements.push(thing);
      thing.addEventListener(
        "click",
        (ev) => {
          try {
            this.clickTrack(ev, mp, opts);
          } catch (e) {
            if (opts.debug)
              console.log(e);
          }
        },
        LISTENER_OPTIONS
      );
    }
  }
  function singlePageAppTracking(mp, opts) {
    window.addEventListener(
      "click",
      (ev) => {
        try {
          if (this.trackedElements.includes(ev.target))
            return false;
          if (this.blackListedElements.includes(ev.target))
            return false;
          figureOutWhatWasClicked.call(ezTrack, ev.target, ev, mp, opts);
        } catch (e) {
          if (opts.debug)
            console.log(e);
        }
      },
      LISTENER_OPTIONS
    );
  }
  function figureOutWhatWasClicked(elem, ev, mp, opts) {
    if (this.trackedElements.includes(elem))
      return false;
    if (this.blackListedElements.includes(elem))
      return false;
    if (elem.matches(BLACKLIST_ELEMENTS)) {
      return false;
    }
    if (elem.matches(BUTTON_SELECTORS)) {
      if (elem) {
        this.spaPipe("button", elem, mp, opts);
      } else {
        this.spaPipe("button", ev, mp, opts);
      }
      return true;
    } else if (elem.matches(LINK_SELECTORS)) {
      if (elem) {
        this.spaPipe("link", elem, mp, opts);
      } else {
        this.spaPipe("link", ev, mp, opts);
      }
      return true;
    } else if (elem.matches(FORM_SELECTORS)) {
      if (elem) {
        this.spaPipe("form", elem, mp, opts);
      } else {
        this.spaPipe("form", ev, mp, opts);
      }
      return true;
    } else if (elem.matches(DROPDOWN_SELECTOR)) {
      if (elem) {
        this.spaPipe("select", elem, mp, opts);
      } else {
        this.spaPipe("select", ev, mp, opts);
      }
      return true;
    } else if (elem.matches(INPUT_SELECTOR)) {
      if (elem) {
        this.spaPipe("input", elem, mp, opts);
      } else {
        this.spaPipe("input", ev, mp, opts);
      }
      return true;
    } else if (elem.matches(VIDEO_SELECTOR)) {
      if (elem) {
        this.spaPipe("video", elem, mp, opts);
      } else {
        this.spaPipe("video", ev, mp, opts);
      }
      return true;
    }
    const possibleMatches = [BUTTON_SELECTORS, LINK_SELECTORS, FORM_SELECTORS, DROPDOWN_SELECTOR, INPUT_SELECTOR, VIDEO_SELECTOR];
    const matchingParents = getAllParents(elem).filter((node) => {
      let matched = possibleMatches.map((matchSelector) => {
        return node.matches(matchSelector);
      });
      return matched.some((bool) => bool);
    });
    if (matchingParents.length > 0) {
      figureOutWhatWasClicked.call(ezTrack, matchingParents[0], ev, mp, opts);
      return true;
    }
    const mostSpecificNode = findMostSpecificRecursive(elem);
    if (elem.matches(ALL_SELECTOR) && mostSpecificNode === elem) {
      this.spaPipe("all", ev, mp, opts);
      return true;
    } else {
      return false;
    }
  }
  function spaPipeline(directive = "none", evOrElem, mp, opts) {
    let entity;
    if (evOrElem instanceof Event) {
      entity = evOrElem.target;
    } else if (evOrElem instanceof HTMLElement) {
      entity = evOrElem;
    } else {
      if (opts.debug)
        console.log("spaPipeline: invalid element or event");
      return false;
    }
    const isAlreadyTracked = this.trackedElements.includes(evOrElem.target);
    if (!isAlreadyTracked) {
      if (opts.buttons && directive === "button") {
        this.trackedElements.push(evOrElem.target);
        this.buttonTrack(evOrElem, mp, opts);
        entity.addEventListener(
          "click",
          (clickEv) => {
            this.buttonTrack(clickEv, mp, opts);
          },
          LISTENER_OPTIONS
        );
      } else if (opts.links && directive === "link") {
        this.trackedElements.push(entity);
        this.linkTrack(evOrElem, mp, opts);
        entity.addEventListener("click", (clickEv) => {
          this.linkTrack(clickEv, mp, opts);
        });
      } else if (opts.forms && directive === "form") {
        this.trackedElements.push(entity);
        entity.addEventListener(
          "submit",
          (submitEv) => {
            this.formTrack(submitEv, mp, opts);
          },
          LISTENER_OPTIONS
        );
      } else if (opts.selectors && directive === "select") {
        this.trackedElements.push(entity);
        entity.addEventListener(
          "change",
          (changeEv) => {
            this.selectTrack(changeEv, mp, opts);
          },
          LISTENER_OPTIONS
        );
      } else if (opts.inputs && directive === "input") {
        this.trackedElements.push(entity);
        entity.addEventListener(
          "change",
          (changeEv) => {
            this.inputTrack(changeEv, mp, opts);
          },
          LISTENER_OPTIONS
        );
      } else if (opts.videos && directive === "video") {
        this.trackedElements.push(entity);
        entity.addEventListener(
          "play",
          (videoEv) => {
            this.videoTrack(videoEv, mp, opts);
          },
          LISTENER_OPTIONS
        );
        entity.addEventListener(
          "pause",
          (videoEv) => {
            this.videoTrack(videoEv, mp, opts);
          },
          LISTENER_OPTIONS
        );
        entity.addEventListener(
          "ended",
          (videoEv) => {
            this.videoTrack(videoEv, mp, opts);
          },
          LISTENER_OPTIONS
        );
      } else if (opts.clicks && directive === "all") {
        this.trackedElements.push(entity);
        this.clickTrack(evOrElem, mp, opts);
        entity.addEventListener(
          "click",
          (clickEv) => {
            this.clickTrack(clickEv, mp, opts);
          },
          LISTENER_OPTIONS
        );
      }
    }
  }
  function findMostSpecificRecursive(node) {
    const numChildren = node.childElementCount;
    if (numChildren !== 0) {
      let nextNode = node.firstElementChild;
      if (!nextNode)
        nextNode = node.nextElementSibling;
      if (!nextNode)
        nextNode = node.priorElementSibling;
      if (!nextNode)
        return node;
      else {
        return findMostSpecificRecursive(nextNode);
      }
    } else {
      return node;
    }
  }
  function getAllParents(elem) {
    const parents = [];
    for (; elem && elem !== document.body; elem = elem.parentNode) {
      parents.push(elem);
    }
    return parents;
  }
  function trackPageViews(mp, opts) {
    mp.track("page enter", { ...statefulProps(false, false, false) });
    if (opts.logProps) {
      console.log("PAGE ENTER");
      console.log(JSON.stringify(PAGE_PROPS, null, 2));
    }
  }
  function trackPageExits(mp, opts) {
    window.addEventListener("beforeunload", () => {
      this.hasVisibilityChanged = null;
      mp.track("page exit", { ...statefulProps(false) }, { transport: "sendBeacon", send_immediately: true });
      if (opts.logProps) {
        console.log("PAGE EXIT");
        console.log(JSON.stringify({ ...statefulProps(false) }, null, 2));
      }
    });
  }
  function trackButtonClick(evOrEl, mp, opts) {
    const src = evOrEl.currentTarget || evOrEl;
    const props = {
      ...STANDARD_FIELDS(src, "BUTTON"),
      ...BUTTON_FIELDS(src),
      ...statefulProps()
    };
    mp.track("button click", props);
    if (opts.logProps) {
      console.log("BUTTON CLICK");
      console.log(JSON.stringify(props, null, 2));
    }
  }
  function trackLinkClick(evOrEl, mp, opts) {
    const src = evOrEl.currentTarget || evOrEl;
    const linkType = linkOrNav.call(ezTrack, src);
    const props = {
      ...STANDARD_FIELDS(src, linkType.label),
      ...LINK_FIELDS(src, linkType.label),
      ...statefulProps()
    };
    mp.track(`${linkType.eventName} click`, props);
    if (opts.logProps) {
      console.log(`${linkType.eventName.toUpperCase()} CLICK`);
      console.log(JSON.stringify(props, null, 2));
    }
  }
  function trackFormSubmit(evOrEl, mp, opts) {
    const src = evOrEl.currentTarget || evOrEl;
    const props = {
      ...STANDARD_FIELDS(src, "FORM"),
      ...FORM_FIELDS(src),
      ...statefulProps()
    };
    mp.track("form submit", props);
    if (opts.logProps) {
      console.log("FORM SUBMIT");
      console.log(JSON.stringify(props, null, 2));
    }
  }
  function trackDropDownChange(evOrEl, mp, opts) {
    const src = evOrEl.currentTarget || evOrEl;
    const props = {
      ...STANDARD_FIELDS(src, "OPTION"),
      ...DROPDOWN_FIELDS(src),
      ...statefulProps()
    };
    mp.track("user selection", props);
    if (opts.logProps) {
      console.log("USER SELECTION");
      console.log(JSON.stringify(props, null, 2));
    }
  }
  function trackInputChange(evOrEl, mp, opts) {
    const src = evOrEl.currentTarget || evOrEl;
    const props = {
      ...INPUT_FIELDS(src),
      ...statefulProps(),
      ...STANDARD_FIELDS(src, "CONTENT")
    };
    mp.track("user entered text", props);
    if (opts.logProps) {
      console.log("USER ENTERED CONTENT");
      console.log(JSON.stringify(props, null, 2));
    }
  }
  function trackVideo(videoEvent, mp, opts) {
    const src = videoEvent.target;
    const props = {
      ...STANDARD_FIELDS(src, "VIDEO"),
      ...VIDEO_FIELDS(src),
      ...statefulProps()
    };
    const action = videoEvent.type;
    mp.track(`video: ${action}`, props);
    if (opts.logProps) {
      console.log(`VIDEO ${action}`);
      console.log(JSON.stringify(props, null, 2));
    }
  }
  function trackAnyClick(evOrEl, mp, opts) {
    const src = evOrEl.target || evOrEl;
    const props = {
      ...ANY_TAG_FIELDS(src),
      ...statefulProps(),
      ...STANDARD_FIELDS(src)
    };
    mp.track("page click", props);
    if (opts.logProps) {
      console.log("PAGE CLICK");
      console.log(JSON.stringify(props, null, 2));
    }
  }
  function trackWindowStuff(mp, opts) {
    window.addEventListener(
      "resize",
      () => {
        window.clearTimeout(ezTrack.resizeTimer);
        ezTrack.resizeTimer = window.setTimeout(() => {
          const props = {
            "PAGE \u2192 height": window.innerHeight,
            "PAGE \u2192 width": window.innerWidth,
            ...statefulProps(false)
          };
          mp.track("page resize", props);
        }, 3e3);
      },
      LISTENER_OPTIONS
    );
    window.addEventListener(
      "beforeprint",
      () => {
        try {
          const props = {
            ...statefulProps(false)
          };
          mp.track("print", props);
        } catch (e) {
          if (opts.debug)
            console.log(e);
        }
      },
      LISTENER_OPTIONS
    );
    window.addEventListener("visibilitychange", function() {
      const props = {
        ...statefulProps(false)
      };
      if ((document.hidden || document.visibilityState === "hidden") && this.hasVisibilityChanged !== null) {
        mp.track("page lost focus", props);
        this.hasVisibilityChanged = true;
      } else {
        if (this.hasVisibilityChanged)
          mp.track("page regained focus", props);
      }
    });
    document.addEventListener("fullscreenchange", function() {
      const props = {
        ...statefulProps(false)
      };
      if (document.fullscreenElement) {
        mp.track("page fullscreen: on", props);
      } else {
        mp.track("page fullscreen: off", props);
      }
    });
  }
  function trackErrors(mp, opts) {
    window.addEventListener(
      "error",
      (errEv) => {
        try {
          const props = {
            "ERROR \u2192 type": errEv.type,
            "ERROR \u2192 message": errEv.message,
            ...statefulProps(false)
          };
          mp.track("page error", props);
        } catch (e) {
          if (opts.debug)
            console.log(e);
        }
      },
      LISTENER_OPTIONS
    );
  }
  function trackClipboard(mp, opts) {
    window.addEventListener(
      "cut",
      (clipEv) => {
        try {
          const props = {
            ...statefulProps(false),
            ...STANDARD_FIELDS(clipEv.target),
            ...ANY_TAG_FIELDS(clipEv.target, true)
          };
          mp.track("cut", props);
          if (opts.logProps) {
            console.log("CUT");
            console.log(JSON.stringify(props, null, 2));
          }
        } catch (e) {
          if (opts.debug)
            console.log(e);
        }
      },
      LISTENER_OPTIONS
    );
    window.addEventListener(
      "copy",
      (clipEv) => {
        try {
          const props = {
            ...statefulProps(false),
            ...STANDARD_FIELDS(clipEv.target),
            ...ANY_TAG_FIELDS(clipEv.target, true)
          };
          mp.track("copy", props);
          if (opts.logProps) {
            console.log("COPY");
            console.log(JSON.stringify(props, null, 2));
          }
        } catch (e) {
          if (opts.debug)
            console.log(e);
        }
      },
      LISTENER_OPTIONS
    );
    window.addEventListener(
      "paste",
      (clipEv) => {
        try {
          const props = {
            ...statefulProps(false),
            ...STANDARD_FIELDS(clipEv.target),
            ...ANY_TAG_FIELDS(clipEv.target, true)
          };
          mp.track("paste", props);
          if (opts.logProps) {
            console.log("PASTE");
            console.log(JSON.stringify(props, null, 2));
          }
        } catch (e) {
          if (opts.debug)
            console.log(e);
        }
      },
      LISTENER_OPTIONS
    );
  }
  function createUserProfiles(mp, opts) {
    try {
      mp.identify(mp.get_distinct_id());
      mp.people.set({
        "USER \u2192 last page viewed": window.location.href,
        "USER \u2192 language": window.navigator.language
      });
      mp.people.increment("total # pages");
      mp.people.set_once({ $name: "anonymous", $Created: new Date().toISOString(), $email: "anonymous", $phone: "anonymous" });
    } catch (e) {
      if (opts.debug)
        console.log(e);
    }
  }
  function trackYoutubeVideos(mp) {
    const tag = document.createElement("script");
    tag.id = "mixpanel-iframe-tracker";
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0] || document.getElementsByTagName("body")[0].children[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    const videos = uniqueNodes(this.query(YOUTUBE_SELECTOR)).filter((frame) => frame.src.includes("youtube.com/embed"));
    for (const video of videos) {
      this.trackedElements.push(video);
      if (!video.id) {
        video.id = new URL(video.src).pathname.replace("/embed/", "");
      }
      if (!video.src.includes("enablejsapi")) {
        const newSRC = new URL(video.src);
        newSRC.searchParams.delete("enablejsapi");
        newSRC.searchParams.append("enablejsapi", 1);
        video.src = newSRC.toString();
      }
    }
    window.onYouTubeIframeAPIReady = function() {
      const videos2 = ezTrack.query(YOUTUBE_SELECTOR).filter((frame) => frame.src.includes("youtube.com/embed"));
      for (const video of videos2) {
        bindTrackingToVideo(video.id);
      }
    };
    function bindTrackingToVideo(videoId) {
      const player = new YT.Player(videoId, {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    }
    function getVideoInfo(player) {
      const videoInfo = player.getVideoData();
      const videoProps = {
        "VIDEO \u2192 quality": player.getPlaybackQuality(),
        "VIDEO \u2192 length (sec)": player.getDuration(),
        "VIDEO \u2192 elapsed (sec)": player.getCurrentTime(),
        "VIDEO \u2192 url": player.getVideoUrl(),
        "VIDEO \u2192 title": videoInfo.title,
        "VIDEO \u2192 id": videoInfo.video_id,
        "VIDEO \u2192 author": videoInfo.author,
        "VIDEO \u2192 fullscreen": !(document.fullscreenElement === null)
      };
      return videoProps;
    }
    function onPlayerReady(event) {
      const videoInfo = getVideoInfo(event.target);
      mp.track("youtube player load", videoInfo);
      mp.time_event("youtube video started");
    }
    function onPlayerStateChange(event) {
      trackPlayerChanges(event.data, event.target);
    }
    function trackPlayerChanges(playerStatus, player) {
      const videoInfo = getVideoInfo(player);
      const props = { ...videoInfo, ...statefulProps(false) };
      switch (playerStatus) {
        case -1:
          break;
        case 0:
          mp.track("youtube video finish", props);
          break;
        case 1:
          mp.track("youtube video play", props);
          mp.time_event("youtube video finish");
          break;
        case 2:
          mp.track("youtube video pause", props);
          break;
        case 3:
          break;
        case 5:
          break;
        default:
          break;
      }
    }
  }
  function getEZTrackConfig() {
    return this.opts;
  }
  function uniqueNodes(arrayOfNodes) {
    return [...new Set(arrayOfNodes)];
  }
  function generateTabId(token, length = 32) {
    try {
      const existingId = window.sessionStorage.getItem(`MPEZTrack_Tab_${token}`);
      if (existingId) {
        this.tabId = existingId;
        return { "SESSION \u2192 tab id": existingId };
      }
      const result = [];
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
      }
      const uid = result.join("");
      this.tabId = uid;
      window.sessionStorage.setItem(`MPEZTrack_Tab_${token}`, uid);
      return {
        "SESSION \u2192 tab id": uid
      };
    } catch (e) {
      return {};
    }
  }
  function clearExistingMixpanelQueue(token, opts) {
    try {
      const storageKey = `__mpq_${token}_ev`;
      const existingQueue = localStorage.getItem(storageKey);
      if (existingQueue) {
        const cleanedQueue = JSON.parse(existingQueue).filter((q) => q.payload.event !== "page lost focus");
        localStorage.setItem(storageKey, JSON.stringify(cleanedQueue));
        if (opts.debug && opts.logProps)
          console.log("cleared events queue");
        return true;
      }
      return false;
    } catch (e) {
      if (opts.debug && opts.logProps) {
        console.log("failed to clear queue");
        console.log(e);
      }
      return false;
    }
  }
  window.mpEZTrack = ezTrack;
})();
