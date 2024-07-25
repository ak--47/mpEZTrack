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
      var NodeType;
      (function(NodeType2) {
        NodeType2[NodeType2["Document"] = 0] = "Document";
        NodeType2[NodeType2["DocumentType"] = 1] = "DocumentType";
        NodeType2[NodeType2["Element"] = 2] = "Element";
        NodeType2[NodeType2["Text"] = 3] = "Text";
        NodeType2[NodeType2["CDATA"] = 4] = "CDATA";
        NodeType2[NodeType2["Comment"] = 5] = "Comment";
      })(NodeType || (NodeType = {}));
      function isElement(n) {
        return n.nodeType === n.ELEMENT_NODE;
      }
      function isShadowRoot(n) {
        const host = n === null || n === void 0 ? void 0 : n.host;
        return Boolean((host === null || host === void 0 ? void 0 : host.shadowRoot) === n);
      }
      function isNativeShadowDom(shadowRoot) {
        return Object.prototype.toString.call(shadowRoot) === "[object ShadowRoot]";
      }
      function fixBrowserCompatibilityIssuesInCSS(cssText) {
        if (cssText.includes(" background-clip: text;") && !cssText.includes(" -webkit-background-clip: text;")) {
          cssText = cssText.replace(" background-clip: text;", " -webkit-background-clip: text; background-clip: text;");
        }
        return cssText;
      }
      function escapeImportStatement(rule) {
        const { cssText } = rule;
        if (cssText.split('"').length < 3)
          return cssText;
        const statement = ["@import", `url(${JSON.stringify(rule.href)})`];
        if (rule.layerName === "") {
          statement.push(`layer`);
        } else if (rule.layerName) {
          statement.push(`layer(${rule.layerName})`);
        }
        if (rule.supportsText) {
          statement.push(`supports(${rule.supportsText})`);
        }
        if (rule.media.length) {
          statement.push(rule.media.mediaText);
        }
        return statement.join(" ") + ";";
      }
      function stringifyStylesheet(s) {
        try {
          const rules = s.rules || s.cssRules;
          return rules ? fixBrowserCompatibilityIssuesInCSS(Array.from(rules, stringifyRule).join("")) : null;
        } catch (error) {
          return null;
        }
      }
      function stringifyRule(rule) {
        let importStringified;
        if (isCSSImportRule(rule)) {
          try {
            importStringified = stringifyStylesheet(rule.styleSheet) || escapeImportStatement(rule);
          } catch (error) {
          }
        } else if (isCSSStyleRule(rule) && rule.selectorText.includes(":")) {
          return fixSafariColons(rule.cssText);
        }
        return importStringified || rule.cssText;
      }
      function fixSafariColons(cssStringified) {
        const regex = /(\[(?:[\w-]+)[^\\])(:(?:[\w-]+)\])/gm;
        return cssStringified.replace(regex, "$1\\$2");
      }
      function isCSSImportRule(rule) {
        return "styleSheet" in rule;
      }
      function isCSSStyleRule(rule) {
        return "selectorText" in rule;
      }
      var Mirror = class {
        constructor() {
          this.idNodeMap = /* @__PURE__ */ new Map();
          this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        }
        getId(n) {
          var _a;
          if (!n)
            return -1;
          const id = (_a = this.getMeta(n)) === null || _a === void 0 ? void 0 : _a.id;
          return id !== null && id !== void 0 ? id : -1;
        }
        getNode(id) {
          return this.idNodeMap.get(id) || null;
        }
        getIds() {
          return Array.from(this.idNodeMap.keys());
        }
        getMeta(n) {
          return this.nodeMetaMap.get(n) || null;
        }
        removeNodeFromMap(n) {
          const id = this.getId(n);
          this.idNodeMap.delete(id);
          if (n.childNodes) {
            n.childNodes.forEach((childNode) => this.removeNodeFromMap(childNode));
          }
        }
        has(id) {
          return this.idNodeMap.has(id);
        }
        hasNode(node) {
          return this.nodeMetaMap.has(node);
        }
        add(n, meta) {
          const id = meta.id;
          this.idNodeMap.set(id, n);
          this.nodeMetaMap.set(n, meta);
        }
        replace(id, n) {
          const oldNode = this.getNode(id);
          if (oldNode) {
            const meta = this.nodeMetaMap.get(oldNode);
            if (meta)
              this.nodeMetaMap.set(n, meta);
          }
          this.idNodeMap.set(id, n);
        }
        reset() {
          this.idNodeMap = /* @__PURE__ */ new Map();
          this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        }
      };
      function createMirror() {
        return new Mirror();
      }
      function maskInputValue({ element, maskInputOptions, tagName, type, value, maskInputFn }) {
        let text = value || "";
        const actualType = type && toLowerCase(type);
        if (maskInputOptions[tagName.toLowerCase()] || actualType && maskInputOptions[actualType]) {
          if (maskInputFn) {
            text = maskInputFn(text, element);
          } else {
            text = "*".repeat(text.length);
          }
        }
        return text;
      }
      function toLowerCase(str) {
        return str.toLowerCase();
      }
      var ORIGINAL_ATTRIBUTE_NAME = "__rrweb_original__";
      function is2DCanvasBlank(canvas) {
        const ctx = canvas.getContext("2d");
        if (!ctx)
          return true;
        const chunkSize = 50;
        for (let x = 0; x < canvas.width; x += chunkSize) {
          for (let y = 0; y < canvas.height; y += chunkSize) {
            const getImageData = ctx.getImageData;
            const originalGetImageData = ORIGINAL_ATTRIBUTE_NAME in getImageData ? getImageData[ORIGINAL_ATTRIBUTE_NAME] : getImageData;
            const pixelBuffer = new Uint32Array(originalGetImageData.call(ctx, x, y, Math.min(chunkSize, canvas.width - x), Math.min(chunkSize, canvas.height - y)).data.buffer);
            if (pixelBuffer.some((pixel) => pixel !== 0))
              return false;
          }
        }
        return true;
      }
      function getInputType(element) {
        const type = element.type;
        return element.hasAttribute("data-rr-is-password") ? "password" : type ? toLowerCase(type) : null;
      }
      function extractFileExtension(path, baseURL) {
        var _a;
        let url;
        try {
          url = new URL(path, baseURL !== null && baseURL !== void 0 ? baseURL : window.location.href);
        } catch (err) {
          return null;
        }
        const regex = /\.([0-9a-z]+)(?:$)/i;
        const match = url.pathname.match(regex);
        return (_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : null;
      }
      var _id = 1;
      var tagNameRegex = new RegExp("[^a-z0-9-_:]");
      var IGNORED_NODE = -2;
      function genId() {
        return _id++;
      }
      function getValidTagName(element) {
        if (element instanceof HTMLFormElement) {
          return "form";
        }
        const processedTagName = toLowerCase(element.tagName);
        if (tagNameRegex.test(processedTagName)) {
          return "div";
        }
        return processedTagName;
      }
      function extractOrigin(url) {
        let origin = "";
        if (url.indexOf("//") > -1) {
          origin = url.split("/").slice(0, 3).join("/");
        } else {
          origin = url.split("/")[0];
        }
        origin = origin.split("?")[0];
        return origin;
      }
      var canvasService;
      var canvasCtx;
      var URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm;
      var URL_PROTOCOL_MATCH = /^(?:[a-z+]+:)?\/\//i;
      var URL_WWW_MATCH = /^www\..*/i;
      var DATA_URI = /^(data:)([^,]*),(.*)/i;
      function absoluteToStylesheet(cssText, href) {
        return (cssText || "").replace(URL_IN_CSS_REF, (origin, quote1, path1, quote2, path2, path3) => {
          const filePath = path1 || path2 || path3;
          const maybeQuote = quote1 || quote2 || "";
          if (!filePath) {
            return origin;
          }
          if (URL_PROTOCOL_MATCH.test(filePath) || URL_WWW_MATCH.test(filePath)) {
            return `url(${maybeQuote}${filePath}${maybeQuote})`;
          }
          if (DATA_URI.test(filePath)) {
            return `url(${maybeQuote}${filePath}${maybeQuote})`;
          }
          if (filePath[0] === "/") {
            return `url(${maybeQuote}${extractOrigin(href) + filePath}${maybeQuote})`;
          }
          const stack = href.split("/");
          const parts = filePath.split("/");
          stack.pop();
          for (const part of parts) {
            if (part === ".") {
              continue;
            } else if (part === "..") {
              stack.pop();
            } else {
              stack.push(part);
            }
          }
          return `url(${maybeQuote}${stack.join("/")}${maybeQuote})`;
        });
      }
      var SRCSET_NOT_SPACES = /^[^ \t\n\r\u000c]+/;
      var SRCSET_COMMAS_OR_SPACES = /^[, \t\n\r\u000c]+/;
      function getAbsoluteSrcsetString(doc, attributeValue) {
        if (attributeValue.trim() === "") {
          return attributeValue;
        }
        let pos = 0;
        function collectCharacters(regEx) {
          let chars2;
          const match = regEx.exec(attributeValue.substring(pos));
          if (match) {
            chars2 = match[0];
            pos += chars2.length;
            return chars2;
          }
          return "";
        }
        const output = [];
        while (true) {
          collectCharacters(SRCSET_COMMAS_OR_SPACES);
          if (pos >= attributeValue.length) {
            break;
          }
          let url = collectCharacters(SRCSET_NOT_SPACES);
          if (url.slice(-1) === ",") {
            url = absoluteToDoc(doc, url.substring(0, url.length - 1));
            output.push(url);
          } else {
            let descriptorsStr = "";
            url = absoluteToDoc(doc, url);
            let inParens = false;
            while (true) {
              const c = attributeValue.charAt(pos);
              if (c === "") {
                output.push((url + descriptorsStr).trim());
                break;
              } else if (!inParens) {
                if (c === ",") {
                  pos += 1;
                  output.push((url + descriptorsStr).trim());
                  break;
                } else if (c === "(") {
                  inParens = true;
                }
              } else {
                if (c === ")") {
                  inParens = false;
                }
              }
              descriptorsStr += c;
              pos += 1;
            }
          }
        }
        return output.join(", ");
      }
      function absoluteToDoc(doc, attributeValue) {
        if (!attributeValue || attributeValue.trim() === "") {
          return attributeValue;
        }
        const a = doc.createElement("a");
        a.href = attributeValue;
        return a.href;
      }
      function isSVGElement(el) {
        return Boolean(el.tagName === "svg" || el.ownerSVGElement);
      }
      function getHref() {
        const a = document.createElement("a");
        a.href = "";
        return a.href;
      }
      function transformAttribute(doc, tagName, name, value) {
        if (!value) {
          return value;
        }
        if (name === "src" || name === "href" && !(tagName === "use" && value[0] === "#")) {
          return absoluteToDoc(doc, value);
        } else if (name === "xlink:href" && value[0] !== "#") {
          return absoluteToDoc(doc, value);
        } else if (name === "background" && (tagName === "table" || tagName === "td" || tagName === "th")) {
          return absoluteToDoc(doc, value);
        } else if (name === "srcset") {
          return getAbsoluteSrcsetString(doc, value);
        } else if (name === "style") {
          return absoluteToStylesheet(value, getHref());
        } else if (tagName === "object" && name === "data") {
          return absoluteToDoc(doc, value);
        }
        return value;
      }
      function ignoreAttribute(tagName, name, _value) {
        return (tagName === "video" || tagName === "audio") && name === "autoplay";
      }
      function _isBlockedElement(element, blockClass, blockSelector) {
        try {
          if (typeof blockClass === "string") {
            if (element.classList.contains(blockClass)) {
              return true;
            }
          } else {
            for (let eIndex = element.classList.length; eIndex--; ) {
              const className = element.classList[eIndex];
              if (blockClass.test(className)) {
                return true;
              }
            }
          }
          if (blockSelector) {
            return element.matches(blockSelector);
          }
        } catch (e) {
        }
        return false;
      }
      function classMatchesRegex(node, regex, checkAncestors) {
        if (!node)
          return false;
        if (node.nodeType !== node.ELEMENT_NODE) {
          if (!checkAncestors)
            return false;
          return classMatchesRegex(node.parentNode, regex, checkAncestors);
        }
        for (let eIndex = node.classList.length; eIndex--; ) {
          const className = node.classList[eIndex];
          if (regex.test(className)) {
            return true;
          }
        }
        if (!checkAncestors)
          return false;
        return classMatchesRegex(node.parentNode, regex, checkAncestors);
      }
      function needMaskingText(node, maskTextClass, maskTextSelector, checkAncestors) {
        try {
          const el = node.nodeType === node.ELEMENT_NODE ? node : node.parentElement;
          if (el === null)
            return false;
          if (typeof maskTextClass === "string") {
            if (checkAncestors) {
              if (el.closest(`.${maskTextClass}`))
                return true;
            } else {
              if (el.classList.contains(maskTextClass))
                return true;
            }
          } else {
            if (classMatchesRegex(el, maskTextClass, checkAncestors))
              return true;
          }
          if (maskTextSelector) {
            if (checkAncestors) {
              if (el.closest(maskTextSelector))
                return true;
            } else {
              if (el.matches(maskTextSelector))
                return true;
            }
          }
        } catch (e) {
        }
        return false;
      }
      function onceIframeLoaded(iframeEl, listener, iframeLoadTimeout) {
        const win2 = iframeEl.contentWindow;
        if (!win2) {
          return;
        }
        let fired = false;
        let readyState;
        try {
          readyState = win2.document.readyState;
        } catch (error) {
          return;
        }
        if (readyState !== "complete") {
          const timer = setTimeout(() => {
            if (!fired) {
              listener();
              fired = true;
            }
          }, iframeLoadTimeout);
          iframeEl.addEventListener("load", () => {
            clearTimeout(timer);
            fired = true;
            listener();
          });
          return;
        }
        const blankUrl = "about:blank";
        if (win2.location.href !== blankUrl || iframeEl.src === blankUrl || iframeEl.src === "") {
          setTimeout(listener, 0);
          return iframeEl.addEventListener("load", listener);
        }
        iframeEl.addEventListener("load", listener);
      }
      function onceStylesheetLoaded(link, listener, styleSheetLoadTimeout) {
        let fired = false;
        let styleSheetLoaded;
        try {
          styleSheetLoaded = link.sheet;
        } catch (error) {
          return;
        }
        if (styleSheetLoaded)
          return;
        const timer = setTimeout(() => {
          if (!fired) {
            listener();
            fired = true;
          }
        }, styleSheetLoadTimeout);
        link.addEventListener("load", () => {
          clearTimeout(timer);
          fired = true;
          listener();
        });
      }
      function serializeNode(n, options) {
        const { doc, mirror: mirror2, blockClass, blockSelector, needsMask, inlineStylesheet, maskInputOptions = {}, maskTextFn, maskInputFn, dataURLOptions = {}, inlineImages, recordCanvas, keepIframeSrcFn, newlyAddedElement = false } = options;
        const rootId = getRootId(doc, mirror2);
        switch (n.nodeType) {
          case n.DOCUMENT_NODE:
            if (n.compatMode !== "CSS1Compat") {
              return {
                type: NodeType.Document,
                childNodes: [],
                compatMode: n.compatMode
              };
            } else {
              return {
                type: NodeType.Document,
                childNodes: []
              };
            }
          case n.DOCUMENT_TYPE_NODE:
            return {
              type: NodeType.DocumentType,
              name: n.name,
              publicId: n.publicId,
              systemId: n.systemId,
              rootId
            };
          case n.ELEMENT_NODE:
            return serializeElementNode(n, {
              doc,
              blockClass,
              blockSelector,
              inlineStylesheet,
              maskInputOptions,
              maskInputFn,
              dataURLOptions,
              inlineImages,
              recordCanvas,
              keepIframeSrcFn,
              newlyAddedElement,
              rootId
            });
          case n.TEXT_NODE:
            return serializeTextNode(n, {
              needsMask,
              maskTextFn,
              rootId
            });
          case n.CDATA_SECTION_NODE:
            return {
              type: NodeType.CDATA,
              textContent: "",
              rootId
            };
          case n.COMMENT_NODE:
            return {
              type: NodeType.Comment,
              textContent: n.textContent || "",
              rootId
            };
          default:
            return false;
        }
      }
      function getRootId(doc, mirror2) {
        if (!mirror2.hasNode(doc))
          return void 0;
        const docId = mirror2.getId(doc);
        return docId === 1 ? void 0 : docId;
      }
      function serializeTextNode(n, options) {
        var _a;
        const { needsMask, maskTextFn, rootId } = options;
        const parentTagName = n.parentNode && n.parentNode.tagName;
        let textContent = n.textContent;
        const isStyle = parentTagName === "STYLE" ? true : void 0;
        const isScript = parentTagName === "SCRIPT" ? true : void 0;
        if (isStyle && textContent) {
          try {
            if (n.nextSibling || n.previousSibling) {
            } else if ((_a = n.parentNode.sheet) === null || _a === void 0 ? void 0 : _a.cssRules) {
              textContent = stringifyStylesheet(n.parentNode.sheet);
            }
          } catch (err) {
            console.warn(`Cannot get CSS styles from text's parentNode. Error: ${err}`, n);
          }
          textContent = absoluteToStylesheet(textContent, getHref());
        }
        if (isScript) {
          textContent = "SCRIPT_PLACEHOLDER";
        }
        if (!isStyle && !isScript && textContent && needsMask) {
          textContent = maskTextFn ? maskTextFn(textContent, n.parentElement) : textContent.replace(/[\S]/g, "*");
        }
        return {
          type: NodeType.Text,
          textContent: textContent || "",
          isStyle,
          rootId
        };
      }
      function serializeElementNode(n, options) {
        const { doc, blockClass, blockSelector, inlineStylesheet, maskInputOptions = {}, maskInputFn, dataURLOptions = {}, inlineImages, recordCanvas, keepIframeSrcFn, newlyAddedElement = false, rootId } = options;
        const needBlock = _isBlockedElement(n, blockClass, blockSelector);
        const tagName = getValidTagName(n);
        let attributes = {};
        const len = n.attributes.length;
        for (let i2 = 0; i2 < len; i2++) {
          const attr = n.attributes[i2];
          if (!ignoreAttribute(tagName, attr.name, attr.value)) {
            attributes[attr.name] = transformAttribute(doc, tagName, toLowerCase(attr.name), attr.value);
          }
        }
        if (tagName === "link" && inlineStylesheet) {
          const stylesheet = Array.from(doc.styleSheets).find((s) => {
            return s.href === n.href;
          });
          let cssText = null;
          if (stylesheet) {
            cssText = stringifyStylesheet(stylesheet);
          }
          if (cssText) {
            delete attributes.rel;
            delete attributes.href;
            attributes._cssText = absoluteToStylesheet(cssText, stylesheet.href);
          }
        }
        if (tagName === "style" && n.sheet && !(n.innerText || n.textContent || "").trim().length) {
          const cssText = stringifyStylesheet(n.sheet);
          if (cssText) {
            attributes._cssText = absoluteToStylesheet(cssText, getHref());
          }
        }
        if (tagName === "input" || tagName === "textarea" || tagName === "select") {
          const value = n.value;
          const checked = n.checked;
          if (attributes.type !== "radio" && attributes.type !== "checkbox" && attributes.type !== "submit" && attributes.type !== "button" && value) {
            attributes.value = maskInputValue({
              element: n,
              type: getInputType(n),
              tagName,
              value,
              maskInputOptions,
              maskInputFn
            });
          } else if (checked) {
            attributes.checked = checked;
          }
        }
        if (tagName === "option") {
          if (n.selected && !maskInputOptions["select"]) {
            attributes.selected = true;
          } else {
            delete attributes.selected;
          }
        }
        if (tagName === "canvas" && recordCanvas) {
          if (n.__context === "2d") {
            if (!is2DCanvasBlank(n)) {
              attributes.rr_dataURL = n.toDataURL(dataURLOptions.type, dataURLOptions.quality);
            }
          } else if (!("__context" in n)) {
            const canvasDataURL = n.toDataURL(dataURLOptions.type, dataURLOptions.quality);
            const blankCanvas = document.createElement("canvas");
            blankCanvas.width = n.width;
            blankCanvas.height = n.height;
            const blankCanvasDataURL = blankCanvas.toDataURL(dataURLOptions.type, dataURLOptions.quality);
            if (canvasDataURL !== blankCanvasDataURL) {
              attributes.rr_dataURL = canvasDataURL;
            }
          }
        }
        if (tagName === "img" && inlineImages) {
          if (!canvasService) {
            canvasService = doc.createElement("canvas");
            canvasCtx = canvasService.getContext("2d");
          }
          const image = n;
          const oldValue = image.crossOrigin;
          image.crossOrigin = "anonymous";
          const recordInlineImage = () => {
            image.removeEventListener("load", recordInlineImage);
            try {
              canvasService.width = image.naturalWidth;
              canvasService.height = image.naturalHeight;
              canvasCtx.drawImage(image, 0, 0);
              attributes.rr_dataURL = canvasService.toDataURL(dataURLOptions.type, dataURLOptions.quality);
            } catch (err) {
              console.warn(`Cannot inline img src=${image.currentSrc}! Error: ${err}`);
            }
            oldValue ? attributes.crossOrigin = oldValue : image.removeAttribute("crossorigin");
          };
          if (image.complete && image.naturalWidth !== 0)
            recordInlineImage();
          else
            image.addEventListener("load", recordInlineImage);
        }
        if (tagName === "audio" || tagName === "video") {
          const mediaAttributes = attributes;
          mediaAttributes.rr_mediaState = n.paused ? "paused" : "played";
          mediaAttributes.rr_mediaCurrentTime = n.currentTime;
          mediaAttributes.rr_mediaPlaybackRate = n.playbackRate;
          mediaAttributes.rr_mediaMuted = n.muted;
          mediaAttributes.rr_mediaLoop = n.loop;
          mediaAttributes.rr_mediaVolume = n.volume;
        }
        if (!newlyAddedElement) {
          if (n.scrollLeft) {
            attributes.rr_scrollLeft = n.scrollLeft;
          }
          if (n.scrollTop) {
            attributes.rr_scrollTop = n.scrollTop;
          }
        }
        if (needBlock) {
          const { width, height } = n.getBoundingClientRect();
          attributes = {
            class: attributes.class,
            rr_width: `${width}px`,
            rr_height: `${height}px`
          };
        }
        if (tagName === "iframe" && !keepIframeSrcFn(attributes.src)) {
          if (!n.contentDocument) {
            attributes.rr_src = attributes.src;
          }
          delete attributes.src;
        }
        let isCustomElement;
        try {
          if (customElements.get(tagName))
            isCustomElement = true;
        } catch (e) {
        }
        return {
          type: NodeType.Element,
          tagName,
          attributes,
          childNodes: [],
          isSVG: isSVGElement(n) || void 0,
          needBlock,
          rootId,
          isCustom: isCustomElement
        };
      }
      function lowerIfExists(maybeAttr) {
        if (maybeAttr === void 0 || maybeAttr === null) {
          return "";
        } else {
          return maybeAttr.toLowerCase();
        }
      }
      function slimDOMExcluded(sn, slimDOMOptions) {
        if (slimDOMOptions.comment && sn.type === NodeType.Comment) {
          return true;
        } else if (sn.type === NodeType.Element) {
          if (slimDOMOptions.script && (sn.tagName === "script" || sn.tagName === "link" && (sn.attributes.rel === "preload" || sn.attributes.rel === "modulepreload") && sn.attributes.as === "script" || sn.tagName === "link" && sn.attributes.rel === "prefetch" && typeof sn.attributes.href === "string" && extractFileExtension(sn.attributes.href) === "js")) {
            return true;
          } else if (slimDOMOptions.headFavicon && (sn.tagName === "link" && sn.attributes.rel === "shortcut icon" || sn.tagName === "meta" && (lowerIfExists(sn.attributes.name).match(/^msapplication-tile(image|color)$/) || lowerIfExists(sn.attributes.name) === "application-name" || lowerIfExists(sn.attributes.rel) === "icon" || lowerIfExists(sn.attributes.rel) === "apple-touch-icon" || lowerIfExists(sn.attributes.rel) === "shortcut icon"))) {
            return true;
          } else if (sn.tagName === "meta") {
            if (slimDOMOptions.headMetaDescKeywords && lowerIfExists(sn.attributes.name).match(/^description|keywords$/)) {
              return true;
            } else if (slimDOMOptions.headMetaSocial && (lowerIfExists(sn.attributes.property).match(/^(og|twitter|fb):/) || lowerIfExists(sn.attributes.name).match(/^(og|twitter):/) || lowerIfExists(sn.attributes.name) === "pinterest")) {
              return true;
            } else if (slimDOMOptions.headMetaRobots && (lowerIfExists(sn.attributes.name) === "robots" || lowerIfExists(sn.attributes.name) === "googlebot" || lowerIfExists(sn.attributes.name) === "bingbot")) {
              return true;
            } else if (slimDOMOptions.headMetaHttpEquiv && sn.attributes["http-equiv"] !== void 0) {
              return true;
            } else if (slimDOMOptions.headMetaAuthorship && (lowerIfExists(sn.attributes.name) === "author" || lowerIfExists(sn.attributes.name) === "generator" || lowerIfExists(sn.attributes.name) === "framework" || lowerIfExists(sn.attributes.name) === "publisher" || lowerIfExists(sn.attributes.name) === "progid" || lowerIfExists(sn.attributes.property).match(/^article:/) || lowerIfExists(sn.attributes.property).match(/^product:/))) {
              return true;
            } else if (slimDOMOptions.headMetaVerification && (lowerIfExists(sn.attributes.name) === "google-site-verification" || lowerIfExists(sn.attributes.name) === "yandex-verification" || lowerIfExists(sn.attributes.name) === "csrf-token" || lowerIfExists(sn.attributes.name) === "p:domain_verify" || lowerIfExists(sn.attributes.name) === "verify-v1" || lowerIfExists(sn.attributes.name) === "verification" || lowerIfExists(sn.attributes.name) === "shopify-checkout-api-token")) {
              return true;
            }
          }
        }
        return false;
      }
      function serializeNodeWithId(n, options) {
        const { doc, mirror: mirror2, blockClass, blockSelector, maskTextClass, maskTextSelector, skipChild = false, inlineStylesheet = true, maskInputOptions = {}, maskTextFn, maskInputFn, slimDOMOptions, dataURLOptions = {}, inlineImages = false, recordCanvas = false, onSerialize, onIframeLoad, iframeLoadTimeout = 5e3, onStylesheetLoad, stylesheetLoadTimeout = 5e3, keepIframeSrcFn = () => false, newlyAddedElement = false } = options;
        let { needsMask } = options;
        let { preserveWhiteSpace = true } = options;
        if (!needsMask && n.childNodes) {
          const checkAncestors = needsMask === void 0;
          needsMask = needMaskingText(n, maskTextClass, maskTextSelector, checkAncestors);
        }
        const _serializedNode = serializeNode(n, {
          doc,
          mirror: mirror2,
          blockClass,
          blockSelector,
          needsMask,
          inlineStylesheet,
          maskInputOptions,
          maskTextFn,
          maskInputFn,
          dataURLOptions,
          inlineImages,
          recordCanvas,
          keepIframeSrcFn,
          newlyAddedElement
        });
        if (!_serializedNode) {
          console.warn(n, "not serialized");
          return null;
        }
        let id;
        if (mirror2.hasNode(n)) {
          id = mirror2.getId(n);
        } else if (slimDOMExcluded(_serializedNode, slimDOMOptions) || !preserveWhiteSpace && _serializedNode.type === NodeType.Text && !_serializedNode.isStyle && !_serializedNode.textContent.replace(/^\s+|\s+$/gm, "").length) {
          id = IGNORED_NODE;
        } else {
          id = genId();
        }
        const serializedNode = Object.assign(_serializedNode, { id });
        mirror2.add(n, serializedNode);
        if (id === IGNORED_NODE) {
          return null;
        }
        if (onSerialize) {
          onSerialize(n);
        }
        let recordChild = !skipChild;
        if (serializedNode.type === NodeType.Element) {
          recordChild = recordChild && !serializedNode.needBlock;
          delete serializedNode.needBlock;
          const shadowRoot = n.shadowRoot;
          if (shadowRoot && isNativeShadowDom(shadowRoot))
            serializedNode.isShadowHost = true;
        }
        if ((serializedNode.type === NodeType.Document || serializedNode.type === NodeType.Element) && recordChild) {
          if (slimDOMOptions.headWhitespace && serializedNode.type === NodeType.Element && serializedNode.tagName === "head") {
            preserveWhiteSpace = false;
          }
          const bypassOptions = {
            doc,
            mirror: mirror2,
            blockClass,
            blockSelector,
            needsMask,
            maskTextClass,
            maskTextSelector,
            skipChild,
            inlineStylesheet,
            maskInputOptions,
            maskTextFn,
            maskInputFn,
            slimDOMOptions,
            dataURLOptions,
            inlineImages,
            recordCanvas,
            preserveWhiteSpace,
            onSerialize,
            onIframeLoad,
            iframeLoadTimeout,
            onStylesheetLoad,
            stylesheetLoadTimeout,
            keepIframeSrcFn
          };
          if (serializedNode.type === NodeType.Element && serializedNode.tagName === "textarea" && serializedNode.attributes.value !== void 0)
            ;
          else {
            for (const childN of Array.from(n.childNodes)) {
              const serializedChildNode = serializeNodeWithId(childN, bypassOptions);
              if (serializedChildNode) {
                serializedNode.childNodes.push(serializedChildNode);
              }
            }
          }
          if (isElement(n) && n.shadowRoot) {
            for (const childN of Array.from(n.shadowRoot.childNodes)) {
              const serializedChildNode = serializeNodeWithId(childN, bypassOptions);
              if (serializedChildNode) {
                isNativeShadowDom(n.shadowRoot) && (serializedChildNode.isShadow = true);
                serializedNode.childNodes.push(serializedChildNode);
              }
            }
          }
        }
        if (n.parentNode && isShadowRoot(n.parentNode) && isNativeShadowDom(n.parentNode)) {
          serializedNode.isShadow = true;
        }
        if (serializedNode.type === NodeType.Element && serializedNode.tagName === "iframe") {
          onceIframeLoaded(n, () => {
            const iframeDoc = n.contentDocument;
            if (iframeDoc && onIframeLoad) {
              const serializedIframeNode = serializeNodeWithId(iframeDoc, {
                doc: iframeDoc,
                mirror: mirror2,
                blockClass,
                blockSelector,
                needsMask,
                maskTextClass,
                maskTextSelector,
                skipChild: false,
                inlineStylesheet,
                maskInputOptions,
                maskTextFn,
                maskInputFn,
                slimDOMOptions,
                dataURLOptions,
                inlineImages,
                recordCanvas,
                preserveWhiteSpace,
                onSerialize,
                onIframeLoad,
                iframeLoadTimeout,
                onStylesheetLoad,
                stylesheetLoadTimeout,
                keepIframeSrcFn
              });
              if (serializedIframeNode) {
                onIframeLoad(n, serializedIframeNode);
              }
            }
          }, iframeLoadTimeout);
        }
        if (serializedNode.type === NodeType.Element && serializedNode.tagName === "link" && typeof serializedNode.attributes.rel === "string" && (serializedNode.attributes.rel === "stylesheet" || serializedNode.attributes.rel === "preload" && typeof serializedNode.attributes.href === "string" && extractFileExtension(serializedNode.attributes.href) === "css")) {
          onceStylesheetLoaded(n, () => {
            if (onStylesheetLoad) {
              const serializedLinkNode = serializeNodeWithId(n, {
                doc,
                mirror: mirror2,
                blockClass,
                blockSelector,
                needsMask,
                maskTextClass,
                maskTextSelector,
                skipChild: false,
                inlineStylesheet,
                maskInputOptions,
                maskTextFn,
                maskInputFn,
                slimDOMOptions,
                dataURLOptions,
                inlineImages,
                recordCanvas,
                preserveWhiteSpace,
                onSerialize,
                onIframeLoad,
                iframeLoadTimeout,
                onStylesheetLoad,
                stylesheetLoadTimeout,
                keepIframeSrcFn
              });
              if (serializedLinkNode) {
                onStylesheetLoad(n, serializedLinkNode);
              }
            }
          }, stylesheetLoadTimeout);
        }
        return serializedNode;
      }
      function snapshot(n, options) {
        const { mirror: mirror2 = new Mirror(), blockClass = "rr-block", blockSelector = null, maskTextClass = "rr-mask", maskTextSelector = null, inlineStylesheet = true, inlineImages = false, recordCanvas = false, maskAllInputs = false, maskTextFn, maskInputFn, slimDOM = false, dataURLOptions, preserveWhiteSpace, onSerialize, onIframeLoad, iframeLoadTimeout, onStylesheetLoad, stylesheetLoadTimeout, keepIframeSrcFn = () => false } = options || {};
        const maskInputOptions = maskAllInputs === true ? {
          color: true,
          date: true,
          "datetime-local": true,
          email: true,
          month: true,
          number: true,
          range: true,
          search: true,
          tel: true,
          text: true,
          time: true,
          url: true,
          week: true,
          textarea: true,
          select: true,
          password: true
        } : maskAllInputs === false ? {
          password: true
        } : maskAllInputs;
        const slimDOMOptions = slimDOM === true || slimDOM === "all" ? {
          script: true,
          comment: true,
          headFavicon: true,
          headWhitespace: true,
          headMetaDescKeywords: slimDOM === "all",
          headMetaSocial: true,
          headMetaRobots: true,
          headMetaHttpEquiv: true,
          headMetaAuthorship: true,
          headMetaVerification: true
        } : slimDOM === false ? {} : slimDOM;
        return serializeNodeWithId(n, {
          doc: n,
          mirror: mirror2,
          blockClass,
          blockSelector,
          maskTextClass,
          maskTextSelector,
          skipChild: false,
          inlineStylesheet,
          maskInputOptions,
          maskTextFn,
          maskInputFn,
          slimDOMOptions,
          dataURLOptions,
          inlineImages,
          recordCanvas,
          preserveWhiteSpace,
          onSerialize,
          onIframeLoad,
          iframeLoadTimeout,
          onStylesheetLoad,
          stylesheetLoadTimeout,
          keepIframeSrcFn,
          newlyAddedElement: false
        });
      }
      function on(type, fn, target = document) {
        const options = { capture: true, passive: true };
        target.addEventListener(type, fn, options);
        return () => target.removeEventListener(type, fn, options);
      }
      var DEPARTED_MIRROR_ACCESS_WARNING = "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.";
      var _mirror = {
        map: {},
        getId() {
          console.error(DEPARTED_MIRROR_ACCESS_WARNING);
          return -1;
        },
        getNode() {
          console.error(DEPARTED_MIRROR_ACCESS_WARNING);
          return null;
        },
        removeNodeFromMap() {
          console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        },
        has() {
          console.error(DEPARTED_MIRROR_ACCESS_WARNING);
          return false;
        },
        reset() {
          console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        }
      };
      if (typeof window !== "undefined" && window.Proxy && window.Reflect) {
        _mirror = new Proxy(_mirror, {
          get(target, prop, receiver) {
            if (prop === "map") {
              console.error(DEPARTED_MIRROR_ACCESS_WARNING);
            }
            return Reflect.get(target, prop, receiver);
          }
        });
      }
      function throttle(func, wait, options = {}) {
        let timeout = null;
        let previous = 0;
        return function(...args) {
          const now = Date.now();
          if (!previous && options.leading === false) {
            previous = now;
          }
          const remaining = wait - (now - previous);
          const context = this;
          if (remaining <= 0 || remaining > wait) {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }
            previous = now;
            func.apply(context, args);
          } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(() => {
              previous = options.leading === false ? 0 : Date.now();
              timeout = null;
              func.apply(context, args);
            }, remaining);
          }
        };
      }
      function hookSetter(target, key, d, isRevoked, win2 = window) {
        const original = win2.Object.getOwnPropertyDescriptor(target, key);
        win2.Object.defineProperty(target, key, isRevoked ? d : {
          set(value) {
            setTimeout(() => {
              d.set.call(this, value);
            }, 0);
            if (original && original.set) {
              original.set.call(this, value);
            }
          }
        });
        return () => hookSetter(target, key, original || {}, true);
      }
      function patch(source, name, replacement) {
        try {
          if (!(name in source)) {
            return () => {
            };
          }
          const original = source[name];
          const wrapped = replacement(original);
          if (typeof wrapped === "function") {
            wrapped.prototype = wrapped.prototype || {};
            Object.defineProperties(wrapped, {
              __rrweb_original__: {
                enumerable: false,
                value: original
              }
            });
          }
          source[name] = wrapped;
          return () => {
            source[name] = original;
          };
        } catch (_a) {
          return () => {
          };
        }
      }
      var nowTimestamp = Date.now;
      if (!/[1-9][0-9]{12}/.test(Date.now().toString())) {
        nowTimestamp = () => new Date().getTime();
      }
      function getWindowScroll(win2) {
        var _a, _b, _c, _d, _e, _f;
        const doc = win2.document;
        return {
          left: doc.scrollingElement ? doc.scrollingElement.scrollLeft : win2.pageXOffset !== void 0 ? win2.pageXOffset : (doc === null || doc === void 0 ? void 0 : doc.documentElement.scrollLeft) || ((_b = (_a = doc === null || doc === void 0 ? void 0 : doc.body) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.scrollLeft) || ((_c = doc === null || doc === void 0 ? void 0 : doc.body) === null || _c === void 0 ? void 0 : _c.scrollLeft) || 0,
          top: doc.scrollingElement ? doc.scrollingElement.scrollTop : win2.pageYOffset !== void 0 ? win2.pageYOffset : (doc === null || doc === void 0 ? void 0 : doc.documentElement.scrollTop) || ((_e = (_d = doc === null || doc === void 0 ? void 0 : doc.body) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.scrollTop) || ((_f = doc === null || doc === void 0 ? void 0 : doc.body) === null || _f === void 0 ? void 0 : _f.scrollTop) || 0
        };
      }
      function getWindowHeight() {
        return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight;
      }
      function getWindowWidth() {
        return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth;
      }
      function closestElementOfNode(node) {
        if (!node) {
          return null;
        }
        const el = node.nodeType === node.ELEMENT_NODE ? node : node.parentElement;
        return el;
      }
      function isBlocked(node, blockClass, blockSelector, checkAncestors) {
        if (!node) {
          return false;
        }
        const el = closestElementOfNode(node);
        if (!el) {
          return false;
        }
        try {
          if (typeof blockClass === "string") {
            if (el.classList.contains(blockClass))
              return true;
            if (checkAncestors && el.closest("." + blockClass) !== null)
              return true;
          } else {
            if (classMatchesRegex(el, blockClass, checkAncestors))
              return true;
          }
        } catch (e) {
        }
        if (blockSelector) {
          if (el.matches(blockSelector))
            return true;
          if (checkAncestors && el.closest(blockSelector) !== null)
            return true;
        }
        return false;
      }
      function isSerialized(n, mirror2) {
        return mirror2.getId(n) !== -1;
      }
      function isIgnored(n, mirror2) {
        return mirror2.getId(n) === IGNORED_NODE;
      }
      function isAncestorRemoved(target, mirror2) {
        if (isShadowRoot(target)) {
          return false;
        }
        const id = mirror2.getId(target);
        if (!mirror2.has(id)) {
          return true;
        }
        if (target.parentNode && target.parentNode.nodeType === target.DOCUMENT_NODE) {
          return false;
        }
        if (!target.parentNode) {
          return true;
        }
        return isAncestorRemoved(target.parentNode, mirror2);
      }
      function legacy_isTouchEvent(event) {
        return Boolean(event.changedTouches);
      }
      function polyfill(win2 = window) {
        if ("NodeList" in win2 && !win2.NodeList.prototype.forEach) {
          win2.NodeList.prototype.forEach = Array.prototype.forEach;
        }
        if ("DOMTokenList" in win2 && !win2.DOMTokenList.prototype.forEach) {
          win2.DOMTokenList.prototype.forEach = Array.prototype.forEach;
        }
        if (!Node.prototype.contains) {
          Node.prototype.contains = (...args) => {
            let node = args[0];
            if (!(0 in args)) {
              throw new TypeError("1 argument is required");
            }
            do {
              if (this === node) {
                return true;
              }
            } while (node = node && node.parentNode);
            return false;
          };
        }
      }
      function isSerializedIframe(n, mirror2) {
        return Boolean(n.nodeName === "IFRAME" && mirror2.getMeta(n));
      }
      function isSerializedStylesheet(n, mirror2) {
        return Boolean(n.nodeName === "LINK" && n.nodeType === n.ELEMENT_NODE && n.getAttribute && n.getAttribute("rel") === "stylesheet" && mirror2.getMeta(n));
      }
      function hasShadowRoot(n) {
        return Boolean(n === null || n === void 0 ? void 0 : n.shadowRoot);
      }
      var StyleSheetMirror = class {
        constructor() {
          this.id = 1;
          this.styleIDMap = /* @__PURE__ */ new WeakMap();
          this.idStyleMap = /* @__PURE__ */ new Map();
        }
        getId(stylesheet) {
          var _a;
          return (_a = this.styleIDMap.get(stylesheet)) !== null && _a !== void 0 ? _a : -1;
        }
        has(stylesheet) {
          return this.styleIDMap.has(stylesheet);
        }
        add(stylesheet, id) {
          if (this.has(stylesheet))
            return this.getId(stylesheet);
          let newId;
          if (id === void 0) {
            newId = this.id++;
          } else
            newId = id;
          this.styleIDMap.set(stylesheet, newId);
          this.idStyleMap.set(newId, stylesheet);
          return newId;
        }
        getStyle(id) {
          return this.idStyleMap.get(id) || null;
        }
        reset() {
          this.styleIDMap = /* @__PURE__ */ new WeakMap();
          this.idStyleMap = /* @__PURE__ */ new Map();
          this.id = 1;
        }
        generateId() {
          return this.id++;
        }
      };
      function getShadowHost(n) {
        var _a, _b;
        let shadowHost = null;
        if (((_b = (_a = n.getRootNode) === null || _a === void 0 ? void 0 : _a.call(n)) === null || _b === void 0 ? void 0 : _b.nodeType) === Node.DOCUMENT_FRAGMENT_NODE && n.getRootNode().host)
          shadowHost = n.getRootNode().host;
        return shadowHost;
      }
      function getRootShadowHost(n) {
        let rootShadowHost = n;
        let shadowHost;
        while (shadowHost = getShadowHost(rootShadowHost))
          rootShadowHost = shadowHost;
        return rootShadowHost;
      }
      function shadowHostInDom(n) {
        const doc = n.ownerDocument;
        if (!doc)
          return false;
        const shadowHost = getRootShadowHost(n);
        return doc.contains(shadowHost);
      }
      function inDom(n) {
        const doc = n.ownerDocument;
        if (!doc)
          return false;
        return doc.contains(n) || shadowHostInDom(n);
      }
      var EventType$1 = /* @__PURE__ */ ((EventType2) => {
        EventType2[EventType2["DomContentLoaded"] = 0] = "DomContentLoaded";
        EventType2[EventType2["Load"] = 1] = "Load";
        EventType2[EventType2["FullSnapshot"] = 2] = "FullSnapshot";
        EventType2[EventType2["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
        EventType2[EventType2["Meta"] = 4] = "Meta";
        EventType2[EventType2["Custom"] = 5] = "Custom";
        EventType2[EventType2["Plugin"] = 6] = "Plugin";
        return EventType2;
      })(EventType$1 || {});
      var IncrementalSource$1 = /* @__PURE__ */ ((IncrementalSource2) => {
        IncrementalSource2[IncrementalSource2["Mutation"] = 0] = "Mutation";
        IncrementalSource2[IncrementalSource2["MouseMove"] = 1] = "MouseMove";
        IncrementalSource2[IncrementalSource2["MouseInteraction"] = 2] = "MouseInteraction";
        IncrementalSource2[IncrementalSource2["Scroll"] = 3] = "Scroll";
        IncrementalSource2[IncrementalSource2["ViewportResize"] = 4] = "ViewportResize";
        IncrementalSource2[IncrementalSource2["Input"] = 5] = "Input";
        IncrementalSource2[IncrementalSource2["TouchMove"] = 6] = "TouchMove";
        IncrementalSource2[IncrementalSource2["MediaInteraction"] = 7] = "MediaInteraction";
        IncrementalSource2[IncrementalSource2["StyleSheetRule"] = 8] = "StyleSheetRule";
        IncrementalSource2[IncrementalSource2["CanvasMutation"] = 9] = "CanvasMutation";
        IncrementalSource2[IncrementalSource2["Font"] = 10] = "Font";
        IncrementalSource2[IncrementalSource2["Log"] = 11] = "Log";
        IncrementalSource2[IncrementalSource2["Drag"] = 12] = "Drag";
        IncrementalSource2[IncrementalSource2["StyleDeclaration"] = 13] = "StyleDeclaration";
        IncrementalSource2[IncrementalSource2["Selection"] = 14] = "Selection";
        IncrementalSource2[IncrementalSource2["AdoptedStyleSheet"] = 15] = "AdoptedStyleSheet";
        IncrementalSource2[IncrementalSource2["CustomElement"] = 16] = "CustomElement";
        return IncrementalSource2;
      })(IncrementalSource$1 || {});
      var MouseInteractions = /* @__PURE__ */ ((MouseInteractions2) => {
        MouseInteractions2[MouseInteractions2["MouseUp"] = 0] = "MouseUp";
        MouseInteractions2[MouseInteractions2["MouseDown"] = 1] = "MouseDown";
        MouseInteractions2[MouseInteractions2["Click"] = 2] = "Click";
        MouseInteractions2[MouseInteractions2["ContextMenu"] = 3] = "ContextMenu";
        MouseInteractions2[MouseInteractions2["DblClick"] = 4] = "DblClick";
        MouseInteractions2[MouseInteractions2["Focus"] = 5] = "Focus";
        MouseInteractions2[MouseInteractions2["Blur"] = 6] = "Blur";
        MouseInteractions2[MouseInteractions2["TouchStart"] = 7] = "TouchStart";
        MouseInteractions2[MouseInteractions2["TouchMove_Departed"] = 8] = "TouchMove_Departed";
        MouseInteractions2[MouseInteractions2["TouchEnd"] = 9] = "TouchEnd";
        MouseInteractions2[MouseInteractions2["TouchCancel"] = 10] = "TouchCancel";
        return MouseInteractions2;
      })(MouseInteractions || {});
      var PointerTypes = /* @__PURE__ */ ((PointerTypes2) => {
        PointerTypes2[PointerTypes2["Mouse"] = 0] = "Mouse";
        PointerTypes2[PointerTypes2["Pen"] = 1] = "Pen";
        PointerTypes2[PointerTypes2["Touch"] = 2] = "Touch";
        return PointerTypes2;
      })(PointerTypes || {});
      var CanvasContext = /* @__PURE__ */ ((CanvasContext2) => {
        CanvasContext2[CanvasContext2["2D"] = 0] = "2D";
        CanvasContext2[CanvasContext2["WebGL"] = 1] = "WebGL";
        CanvasContext2[CanvasContext2["WebGL2"] = 2] = "WebGL2";
        return CanvasContext2;
      })(CanvasContext || {});
      function isNodeInLinkedList(n) {
        return "__ln" in n;
      }
      var DoubleLinkedList = class {
        constructor() {
          this.length = 0;
          this.head = null;
          this.tail = null;
        }
        get(position) {
          if (position >= this.length) {
            throw new Error("Position outside of list range");
          }
          let current = this.head;
          for (let index = 0; index < position; index++) {
            current = (current === null || current === void 0 ? void 0 : current.next) || null;
          }
          return current;
        }
        addNode(n) {
          const node = {
            value: n,
            previous: null,
            next: null
          };
          n.__ln = node;
          if (n.previousSibling && isNodeInLinkedList(n.previousSibling)) {
            const current = n.previousSibling.__ln.next;
            node.next = current;
            node.previous = n.previousSibling.__ln;
            n.previousSibling.__ln.next = node;
            if (current) {
              current.previous = node;
            }
          } else if (n.nextSibling && isNodeInLinkedList(n.nextSibling) && n.nextSibling.__ln.previous) {
            const current = n.nextSibling.__ln.previous;
            node.previous = current;
            node.next = n.nextSibling.__ln;
            n.nextSibling.__ln.previous = node;
            if (current) {
              current.next = node;
            }
          } else {
            if (this.head) {
              this.head.previous = node;
            }
            node.next = this.head;
            this.head = node;
          }
          if (node.next === null) {
            this.tail = node;
          }
          this.length++;
        }
        removeNode(n) {
          const current = n.__ln;
          if (!this.head) {
            return;
          }
          if (!current.previous) {
            this.head = current.next;
            if (this.head) {
              this.head.previous = null;
            } else {
              this.tail = null;
            }
          } else {
            current.previous.next = current.next;
            if (current.next) {
              current.next.previous = current.previous;
            } else {
              this.tail = current.previous;
            }
          }
          if (n.__ln) {
            delete n.__ln;
          }
          this.length--;
        }
      };
      var moveKey = (id, parentId) => `${id}@${parentId}`;
      var MutationBuffer = class {
        constructor() {
          this.frozen = false;
          this.locked = false;
          this.texts = [];
          this.attributes = [];
          this.attributeMap = /* @__PURE__ */ new WeakMap();
          this.removes = [];
          this.mapRemoves = [];
          this.movedMap = {};
          this.addedSet = /* @__PURE__ */ new Set();
          this.movedSet = /* @__PURE__ */ new Set();
          this.droppedSet = /* @__PURE__ */ new Set();
          this.processMutations = (mutations) => {
            mutations.forEach(this.processMutation);
            this.emit();
          };
          this.emit = () => {
            if (this.frozen || this.locked) {
              return;
            }
            const adds = [];
            const addedIds = /* @__PURE__ */ new Set();
            const addList = new DoubleLinkedList();
            const getNextId = (n) => {
              let ns = n;
              let nextId = IGNORED_NODE;
              while (nextId === IGNORED_NODE) {
                ns = ns && ns.nextSibling;
                nextId = ns && this.mirror.getId(ns);
              }
              return nextId;
            };
            const pushAdd = (n) => {
              if (!n.parentNode || !inDom(n) || n.parentNode.tagName === "TEXTAREA") {
                return;
              }
              const parentId = isShadowRoot(n.parentNode) ? this.mirror.getId(getShadowHost(n)) : this.mirror.getId(n.parentNode);
              const nextId = getNextId(n);
              if (parentId === -1 || nextId === -1) {
                return addList.addNode(n);
              }
              const sn = serializeNodeWithId(n, {
                doc: this.doc,
                mirror: this.mirror,
                blockClass: this.blockClass,
                blockSelector: this.blockSelector,
                maskTextClass: this.maskTextClass,
                maskTextSelector: this.maskTextSelector,
                skipChild: true,
                newlyAddedElement: true,
                inlineStylesheet: this.inlineStylesheet,
                maskInputOptions: this.maskInputOptions,
                maskTextFn: this.maskTextFn,
                maskInputFn: this.maskInputFn,
                slimDOMOptions: this.slimDOMOptions,
                dataURLOptions: this.dataURLOptions,
                recordCanvas: this.recordCanvas,
                inlineImages: this.inlineImages,
                onSerialize: (currentN) => {
                  if (isSerializedIframe(currentN, this.mirror)) {
                    this.iframeManager.addIframe(currentN);
                  }
                  if (isSerializedStylesheet(currentN, this.mirror)) {
                    this.stylesheetManager.trackLinkElement(currentN);
                  }
                  if (hasShadowRoot(n)) {
                    this.shadowDomManager.addShadowRoot(n.shadowRoot, this.doc);
                  }
                },
                onIframeLoad: (iframe, childSn) => {
                  this.iframeManager.attachIframe(iframe, childSn);
                  this.shadowDomManager.observeAttachShadow(iframe);
                },
                onStylesheetLoad: (link, childSn) => {
                  this.stylesheetManager.attachLinkElement(link, childSn);
                }
              });
              if (sn) {
                adds.push({
                  parentId,
                  nextId,
                  node: sn
                });
                addedIds.add(sn.id);
              }
            };
            while (this.mapRemoves.length) {
              this.mirror.removeNodeFromMap(this.mapRemoves.shift());
            }
            for (const n of this.movedSet) {
              if (isParentRemoved(this.removes, n, this.mirror) && !this.movedSet.has(n.parentNode)) {
                continue;
              }
              pushAdd(n);
            }
            for (const n of this.addedSet) {
              if (!isAncestorInSet(this.droppedSet, n) && !isParentRemoved(this.removes, n, this.mirror)) {
                pushAdd(n);
              } else if (isAncestorInSet(this.movedSet, n)) {
                pushAdd(n);
              } else {
                this.droppedSet.add(n);
              }
            }
            let candidate = null;
            while (addList.length) {
              let node = null;
              if (candidate) {
                const parentId = this.mirror.getId(candidate.value.parentNode);
                const nextId = getNextId(candidate.value);
                if (parentId !== -1 && nextId !== -1) {
                  node = candidate;
                }
              }
              if (!node) {
                let tailNode = addList.tail;
                while (tailNode) {
                  const _node = tailNode;
                  tailNode = tailNode.previous;
                  if (_node) {
                    const parentId = this.mirror.getId(_node.value.parentNode);
                    const nextId = getNextId(_node.value);
                    if (nextId === -1)
                      continue;
                    else if (parentId !== -1) {
                      node = _node;
                      break;
                    } else {
                      const unhandledNode = _node.value;
                      if (unhandledNode.parentNode && unhandledNode.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                        const shadowHost = unhandledNode.parentNode.host;
                        const parentId2 = this.mirror.getId(shadowHost);
                        if (parentId2 !== -1) {
                          node = _node;
                          break;
                        }
                      }
                    }
                  }
                }
              }
              if (!node) {
                while (addList.head) {
                  addList.removeNode(addList.head.value);
                }
                break;
              }
              candidate = node.previous;
              addList.removeNode(node.value);
              pushAdd(node.value);
            }
            const payload = {
              texts: this.texts.map((text) => {
                const n = text.node;
                if (n.parentNode && n.parentNode.tagName === "TEXTAREA") {
                  this.genTextAreaValueMutation(n.parentNode);
                }
                return {
                  id: this.mirror.getId(n),
                  value: text.value
                };
              }).filter((text) => !addedIds.has(text.id)).filter((text) => this.mirror.has(text.id)),
              attributes: this.attributes.map((attribute) => {
                const { attributes } = attribute;
                if (typeof attributes.style === "string") {
                  const diffAsStr = JSON.stringify(attribute.styleDiff);
                  const unchangedAsStr = JSON.stringify(attribute._unchangedStyles);
                  if (diffAsStr.length < attributes.style.length) {
                    if ((diffAsStr + unchangedAsStr).split("var(").length === attributes.style.split("var(").length) {
                      attributes.style = attribute.styleDiff;
                    }
                  }
                }
                return {
                  id: this.mirror.getId(attribute.node),
                  attributes
                };
              }).filter((attribute) => !addedIds.has(attribute.id)).filter((attribute) => this.mirror.has(attribute.id)),
              removes: this.removes,
              adds
            };
            if (!payload.texts.length && !payload.attributes.length && !payload.removes.length && !payload.adds.length) {
              return;
            }
            this.texts = [];
            this.attributes = [];
            this.attributeMap = /* @__PURE__ */ new WeakMap();
            this.removes = [];
            this.addedSet = /* @__PURE__ */ new Set();
            this.movedSet = /* @__PURE__ */ new Set();
            this.droppedSet = /* @__PURE__ */ new Set();
            this.movedMap = {};
            this.mutationCb(payload);
          };
          this.genTextAreaValueMutation = (textarea) => {
            let item = this.attributeMap.get(textarea);
            if (!item) {
              item = {
                node: textarea,
                attributes: {},
                styleDiff: {},
                _unchangedStyles: {}
              };
              this.attributes.push(item);
              this.attributeMap.set(textarea, item);
            }
            item.attributes.value = Array.from(textarea.childNodes, (cn) => cn.textContent || "").join("");
          };
          this.processMutation = (m) => {
            if (isIgnored(m.target, this.mirror)) {
              return;
            }
            switch (m.type) {
              case "characterData": {
                const value = m.target.textContent;
                if (!isBlocked(m.target, this.blockClass, this.blockSelector, false) && value !== m.oldValue) {
                  this.texts.push({
                    value: needMaskingText(m.target, this.maskTextClass, this.maskTextSelector, true) && value ? this.maskTextFn ? this.maskTextFn(value, closestElementOfNode(m.target)) : value.replace(/[\S]/g, "*") : value,
                    node: m.target
                  });
                }
                break;
              }
              case "attributes": {
                const target = m.target;
                let attributeName = m.attributeName;
                let value = m.target.getAttribute(attributeName);
                if (attributeName === "value") {
                  const type = getInputType(target);
                  value = maskInputValue({
                    element: target,
                    maskInputOptions: this.maskInputOptions,
                    tagName: target.tagName,
                    type,
                    value,
                    maskInputFn: this.maskInputFn
                  });
                }
                if (isBlocked(m.target, this.blockClass, this.blockSelector, false) || value === m.oldValue) {
                  return;
                }
                let item = this.attributeMap.get(m.target);
                if (target.tagName === "IFRAME" && attributeName === "src" && !this.keepIframeSrcFn(value)) {
                  if (!target.contentDocument) {
                    attributeName = "rr_src";
                  } else {
                    return;
                  }
                }
                if (!item) {
                  item = {
                    node: m.target,
                    attributes: {},
                    styleDiff: {},
                    _unchangedStyles: {}
                  };
                  this.attributes.push(item);
                  this.attributeMap.set(m.target, item);
                }
                if (attributeName === "type" && target.tagName === "INPUT" && (m.oldValue || "").toLowerCase() === "password") {
                  target.setAttribute("data-rr-is-password", "true");
                }
                if (!ignoreAttribute(target.tagName, attributeName)) {
                  item.attributes[attributeName] = transformAttribute(this.doc, toLowerCase(target.tagName), toLowerCase(attributeName), value);
                  if (attributeName === "style") {
                    if (!this.unattachedDoc) {
                      try {
                        this.unattachedDoc = document.implementation.createHTMLDocument();
                      } catch (e) {
                        this.unattachedDoc = this.doc;
                      }
                    }
                    const old = this.unattachedDoc.createElement("span");
                    if (m.oldValue) {
                      old.setAttribute("style", m.oldValue);
                    }
                    for (const pname of Array.from(target.style)) {
                      const newValue = target.style.getPropertyValue(pname);
                      const newPriority = target.style.getPropertyPriority(pname);
                      if (newValue !== old.style.getPropertyValue(pname) || newPriority !== old.style.getPropertyPriority(pname)) {
                        if (newPriority === "") {
                          item.styleDiff[pname] = newValue;
                        } else {
                          item.styleDiff[pname] = [newValue, newPriority];
                        }
                      } else {
                        item._unchangedStyles[pname] = [newValue, newPriority];
                      }
                    }
                    for (const pname of Array.from(old.style)) {
                      if (target.style.getPropertyValue(pname) === "") {
                        item.styleDiff[pname] = false;
                      }
                    }
                  }
                }
                break;
              }
              case "childList": {
                if (isBlocked(m.target, this.blockClass, this.blockSelector, true))
                  return;
                if (m.target.tagName === "TEXTAREA") {
                  this.genTextAreaValueMutation(m.target);
                  return;
                }
                m.addedNodes.forEach((n) => this.genAdds(n, m.target));
                m.removedNodes.forEach((n) => {
                  const nodeId = this.mirror.getId(n);
                  const parentId = isShadowRoot(m.target) ? this.mirror.getId(m.target.host) : this.mirror.getId(m.target);
                  if (isBlocked(m.target, this.blockClass, this.blockSelector, false) || isIgnored(n, this.mirror) || !isSerialized(n, this.mirror)) {
                    return;
                  }
                  if (this.addedSet.has(n)) {
                    deepDelete(this.addedSet, n);
                    this.droppedSet.add(n);
                  } else if (this.addedSet.has(m.target) && nodeId === -1)
                    ;
                  else if (isAncestorRemoved(m.target, this.mirror))
                    ;
                  else if (this.movedSet.has(n) && this.movedMap[moveKey(nodeId, parentId)]) {
                    deepDelete(this.movedSet, n);
                  } else {
                    this.removes.push({
                      parentId,
                      id: nodeId,
                      isShadow: isShadowRoot(m.target) && isNativeShadowDom(m.target) ? true : void 0
                    });
                  }
                  this.mapRemoves.push(n);
                });
                break;
              }
            }
          };
          this.genAdds = (n, target) => {
            if (this.processedNodeManager.inOtherBuffer(n, this))
              return;
            if (this.addedSet.has(n) || this.movedSet.has(n))
              return;
            if (this.mirror.hasNode(n)) {
              if (isIgnored(n, this.mirror)) {
                return;
              }
              this.movedSet.add(n);
              let targetId = null;
              if (target && this.mirror.hasNode(target)) {
                targetId = this.mirror.getId(target);
              }
              if (targetId && targetId !== -1) {
                this.movedMap[moveKey(this.mirror.getId(n), targetId)] = true;
              }
            } else {
              this.addedSet.add(n);
              this.droppedSet.delete(n);
            }
            if (!isBlocked(n, this.blockClass, this.blockSelector, false)) {
              n.childNodes.forEach((childN) => this.genAdds(childN));
              if (hasShadowRoot(n)) {
                n.shadowRoot.childNodes.forEach((childN) => {
                  this.processedNodeManager.add(childN, this);
                  this.genAdds(childN, n);
                });
              }
            }
          };
        }
        init(options) {
          [
            "mutationCb",
            "blockClass",
            "blockSelector",
            "maskTextClass",
            "maskTextSelector",
            "inlineStylesheet",
            "maskInputOptions",
            "maskTextFn",
            "maskInputFn",
            "keepIframeSrcFn",
            "recordCanvas",
            "inlineImages",
            "slimDOMOptions",
            "dataURLOptions",
            "doc",
            "mirror",
            "iframeManager",
            "stylesheetManager",
            "shadowDomManager",
            "canvasManager",
            "processedNodeManager"
          ].forEach((key) => {
            this[key] = options[key];
          });
        }
        freeze() {
          this.frozen = true;
          this.canvasManager.freeze();
        }
        unfreeze() {
          this.frozen = false;
          this.canvasManager.unfreeze();
          this.emit();
        }
        isFrozen() {
          return this.frozen;
        }
        lock() {
          this.locked = true;
          this.canvasManager.lock();
        }
        unlock() {
          this.locked = false;
          this.canvasManager.unlock();
          this.emit();
        }
        reset() {
          this.shadowDomManager.reset();
          this.canvasManager.reset();
        }
      };
      function deepDelete(addsSet, n) {
        addsSet.delete(n);
        n.childNodes.forEach((childN) => deepDelete(addsSet, childN));
      }
      function isParentRemoved(removes, n, mirror2) {
        if (removes.length === 0)
          return false;
        return _isParentRemoved(removes, n, mirror2);
      }
      function _isParentRemoved(removes, n, mirror2) {
        const { parentNode } = n;
        if (!parentNode) {
          return false;
        }
        const parentId = mirror2.getId(parentNode);
        if (removes.some((r) => r.id === parentId)) {
          return true;
        }
        return _isParentRemoved(removes, parentNode, mirror2);
      }
      function isAncestorInSet(set, n) {
        if (set.size === 0)
          return false;
        return _isAncestorInSet(set, n);
      }
      function _isAncestorInSet(set, n) {
        const { parentNode } = n;
        if (!parentNode) {
          return false;
        }
        if (set.has(parentNode)) {
          return true;
        }
        return _isAncestorInSet(set, parentNode);
      }
      var errorHandler;
      function registerErrorHandler(handler) {
        errorHandler = handler;
      }
      function unregisterErrorHandler() {
        errorHandler = void 0;
      }
      var callbackWrapper = (cb) => {
        if (!errorHandler) {
          return cb;
        }
        const rrwebWrapped = (...rest) => {
          try {
            return cb(...rest);
          } catch (error) {
            if (errorHandler && errorHandler(error) === true) {
              return;
            }
            throw error;
          }
        };
        return rrwebWrapped;
      };
      var mutationBuffers = [];
      function getEventTarget(event) {
        try {
          if ("composedPath" in event) {
            const path = event.composedPath();
            if (path.length) {
              return path[0];
            }
          } else if ("path" in event && event.path.length) {
            return event.path[0];
          }
        } catch (_a) {
        }
        return event && event.target;
      }
      function initMutationObserver(options, rootEl) {
        var _a, _b;
        const mutationBuffer = new MutationBuffer();
        mutationBuffers.push(mutationBuffer);
        mutationBuffer.init(options);
        let mutationObserverCtor = window.MutationObserver || window.__rrMutationObserver;
        const angularZoneSymbol = (_b = (_a = window === null || window === void 0 ? void 0 : window.Zone) === null || _a === void 0 ? void 0 : _a.__symbol__) === null || _b === void 0 ? void 0 : _b.call(_a, "MutationObserver");
        if (angularZoneSymbol && window[angularZoneSymbol]) {
          mutationObserverCtor = window[angularZoneSymbol];
        }
        const observer = new mutationObserverCtor(callbackWrapper(mutationBuffer.processMutations.bind(mutationBuffer)));
        observer.observe(rootEl, {
          attributes: true,
          attributeOldValue: true,
          characterData: true,
          characterDataOldValue: true,
          childList: true,
          subtree: true
        });
        return observer;
      }
      function initMoveObserver({ mousemoveCb, sampling, doc, mirror: mirror2 }) {
        if (sampling.mousemove === false) {
          return () => {
          };
        }
        const threshold = typeof sampling.mousemove === "number" ? sampling.mousemove : 50;
        const callbackThreshold = typeof sampling.mousemoveCallback === "number" ? sampling.mousemoveCallback : 500;
        let positions = [];
        let timeBaseline;
        const wrappedCb = throttle(callbackWrapper((source) => {
          const totalOffset = Date.now() - timeBaseline;
          mousemoveCb(positions.map((p) => {
            p.timeOffset -= totalOffset;
            return p;
          }), source);
          positions = [];
          timeBaseline = null;
        }), callbackThreshold);
        const updatePosition = callbackWrapper(throttle(callbackWrapper((evt) => {
          const target = getEventTarget(evt);
          const { clientX, clientY } = legacy_isTouchEvent(evt) ? evt.changedTouches[0] : evt;
          if (!timeBaseline) {
            timeBaseline = nowTimestamp();
          }
          positions.push({
            x: clientX,
            y: clientY,
            id: mirror2.getId(target),
            timeOffset: nowTimestamp() - timeBaseline
          });
          wrappedCb(typeof DragEvent !== "undefined" && evt instanceof DragEvent ? IncrementalSource$1.Drag : evt instanceof MouseEvent ? IncrementalSource$1.MouseMove : IncrementalSource$1.TouchMove);
        }), threshold, {
          trailing: false
        }));
        const handlers = [
          on("mousemove", updatePosition, doc),
          on("touchmove", updatePosition, doc),
          on("drag", updatePosition, doc)
        ];
        return callbackWrapper(() => {
          handlers.forEach((h) => h());
        });
      }
      function initMouseInteractionObserver({ mouseInteractionCb, doc, mirror: mirror2, blockClass, blockSelector, sampling }) {
        if (sampling.mouseInteraction === false) {
          return () => {
          };
        }
        const disableMap = sampling.mouseInteraction === true || sampling.mouseInteraction === void 0 ? {} : sampling.mouseInteraction;
        const handlers = [];
        let currentPointerType = null;
        const getHandler = (eventKey) => {
          return (event) => {
            const target = getEventTarget(event);
            if (isBlocked(target, blockClass, blockSelector, true)) {
              return;
            }
            let pointerType = null;
            let thisEventKey = eventKey;
            if ("pointerType" in event) {
              switch (event.pointerType) {
                case "mouse":
                  pointerType = PointerTypes.Mouse;
                  break;
                case "touch":
                  pointerType = PointerTypes.Touch;
                  break;
                case "pen":
                  pointerType = PointerTypes.Pen;
                  break;
              }
              if (pointerType === PointerTypes.Touch) {
                if (MouseInteractions[eventKey] === MouseInteractions.MouseDown) {
                  thisEventKey = "TouchStart";
                } else if (MouseInteractions[eventKey] === MouseInteractions.MouseUp) {
                  thisEventKey = "TouchEnd";
                }
              } else if (pointerType === PointerTypes.Pen)
                ;
            } else if (legacy_isTouchEvent(event)) {
              pointerType = PointerTypes.Touch;
            }
            if (pointerType !== null) {
              currentPointerType = pointerType;
              if (thisEventKey.startsWith("Touch") && pointerType === PointerTypes.Touch || thisEventKey.startsWith("Mouse") && pointerType === PointerTypes.Mouse) {
                pointerType = null;
              }
            } else if (MouseInteractions[eventKey] === MouseInteractions.Click) {
              pointerType = currentPointerType;
              currentPointerType = null;
            }
            const e = legacy_isTouchEvent(event) ? event.changedTouches[0] : event;
            if (!e) {
              return;
            }
            const id = mirror2.getId(target);
            const { clientX, clientY } = e;
            callbackWrapper(mouseInteractionCb)(Object.assign({ type: MouseInteractions[thisEventKey], id, x: clientX, y: clientY }, pointerType !== null && { pointerType }));
          };
        };
        Object.keys(MouseInteractions).filter((key) => Number.isNaN(Number(key)) && !key.endsWith("_Departed") && disableMap[key] !== false).forEach((eventKey) => {
          let eventName = toLowerCase(eventKey);
          const handler = getHandler(eventKey);
          if (window.PointerEvent) {
            switch (MouseInteractions[eventKey]) {
              case MouseInteractions.MouseDown:
              case MouseInteractions.MouseUp:
                eventName = eventName.replace("mouse", "pointer");
                break;
              case MouseInteractions.TouchStart:
              case MouseInteractions.TouchEnd:
                return;
            }
          }
          handlers.push(on(eventName, handler, doc));
        });
        return callbackWrapper(() => {
          handlers.forEach((h) => h());
        });
      }
      function initScrollObserver({ scrollCb, doc, mirror: mirror2, blockClass, blockSelector, sampling }) {
        const updatePosition = callbackWrapper(throttle(callbackWrapper((evt) => {
          const target = getEventTarget(evt);
          if (!target || isBlocked(target, blockClass, blockSelector, true)) {
            return;
          }
          const id = mirror2.getId(target);
          if (target === doc && doc.defaultView) {
            const scrollLeftTop = getWindowScroll(doc.defaultView);
            scrollCb({
              id,
              x: scrollLeftTop.left,
              y: scrollLeftTop.top
            });
          } else {
            scrollCb({
              id,
              x: target.scrollLeft,
              y: target.scrollTop
            });
          }
        }), sampling.scroll || 100));
        return on("scroll", updatePosition, doc);
      }
      function initViewportResizeObserver({ viewportResizeCb }, { win: win2 }) {
        let lastH = -1;
        let lastW = -1;
        const updateDimension = callbackWrapper(throttle(callbackWrapper(() => {
          const height = getWindowHeight();
          const width = getWindowWidth();
          if (lastH !== height || lastW !== width) {
            viewportResizeCb({
              width: Number(width),
              height: Number(height)
            });
            lastH = height;
            lastW = width;
          }
        }), 200));
        return on("resize", updateDimension, win2);
      }
      var INPUT_TAGS = ["INPUT", "TEXTAREA", "SELECT"];
      var lastInputValueMap = /* @__PURE__ */ new WeakMap();
      function initInputObserver({ inputCb, doc, mirror: mirror2, blockClass, blockSelector, ignoreClass, ignoreSelector, maskInputOptions, maskInputFn, sampling, userTriggeredOnInput }) {
        function eventHandler(event) {
          let target = getEventTarget(event);
          const userTriggered = event.isTrusted;
          const tagName = target && target.tagName;
          if (target && tagName === "OPTION") {
            target = target.parentElement;
          }
          if (!target || !tagName || INPUT_TAGS.indexOf(tagName) < 0 || isBlocked(target, blockClass, blockSelector, true)) {
            return;
          }
          if (target.classList.contains(ignoreClass) || ignoreSelector && target.matches(ignoreSelector)) {
            return;
          }
          let text = target.value;
          let isChecked = false;
          const type = getInputType(target) || "";
          if (type === "radio" || type === "checkbox") {
            isChecked = target.checked;
          } else if (maskInputOptions[tagName.toLowerCase()] || maskInputOptions[type]) {
            text = maskInputValue({
              element: target,
              maskInputOptions,
              tagName,
              type,
              value: text,
              maskInputFn
            });
          }
          cbWithDedup(target, userTriggeredOnInput ? { text, isChecked, userTriggered } : { text, isChecked });
          const name = target.name;
          if (type === "radio" && name && isChecked) {
            doc.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach((el) => {
              if (el !== target) {
                const text2 = el.value;
                cbWithDedup(el, userTriggeredOnInput ? { text: text2, isChecked: !isChecked, userTriggered: false } : { text: text2, isChecked: !isChecked });
              }
            });
          }
        }
        function cbWithDedup(target, v) {
          const lastInputValue = lastInputValueMap.get(target);
          if (!lastInputValue || lastInputValue.text !== v.text || lastInputValue.isChecked !== v.isChecked) {
            lastInputValueMap.set(target, v);
            const id = mirror2.getId(target);
            callbackWrapper(inputCb)(Object.assign(Object.assign({}, v), { id }));
          }
        }
        const events = sampling.input === "last" ? ["change"] : ["input", "change"];
        const handlers = events.map((eventName) => on(eventName, callbackWrapper(eventHandler), doc));
        const currentWindow = doc.defaultView;
        if (!currentWindow) {
          return () => {
            handlers.forEach((h) => h());
          };
        }
        const propertyDescriptor = currentWindow.Object.getOwnPropertyDescriptor(currentWindow.HTMLInputElement.prototype, "value");
        const hookProperties = [
          [currentWindow.HTMLInputElement.prototype, "value"],
          [currentWindow.HTMLInputElement.prototype, "checked"],
          [currentWindow.HTMLSelectElement.prototype, "value"],
          [currentWindow.HTMLTextAreaElement.prototype, "value"],
          [currentWindow.HTMLSelectElement.prototype, "selectedIndex"],
          [currentWindow.HTMLOptionElement.prototype, "selected"]
        ];
        if (propertyDescriptor && propertyDescriptor.set) {
          handlers.push(...hookProperties.map((p) => hookSetter(p[0], p[1], {
            set() {
              callbackWrapper(eventHandler)({
                target: this,
                isTrusted: false
              });
            }
          }, false, currentWindow)));
        }
        return callbackWrapper(() => {
          handlers.forEach((h) => h());
        });
      }
      function getNestedCSSRulePositions(rule) {
        const positions = [];
        function recurse(childRule, pos) {
          if (hasNestedCSSRule("CSSGroupingRule") && childRule.parentRule instanceof CSSGroupingRule || hasNestedCSSRule("CSSMediaRule") && childRule.parentRule instanceof CSSMediaRule || hasNestedCSSRule("CSSSupportsRule") && childRule.parentRule instanceof CSSSupportsRule || hasNestedCSSRule("CSSConditionRule") && childRule.parentRule instanceof CSSConditionRule) {
            const rules = Array.from(childRule.parentRule.cssRules);
            const index = rules.indexOf(childRule);
            pos.unshift(index);
          } else if (childRule.parentStyleSheet) {
            const rules = Array.from(childRule.parentStyleSheet.cssRules);
            const index = rules.indexOf(childRule);
            pos.unshift(index);
          }
          return pos;
        }
        return recurse(rule, positions);
      }
      function getIdAndStyleId(sheet, mirror2, styleMirror) {
        let id, styleId;
        if (!sheet)
          return {};
        if (sheet.ownerNode)
          id = mirror2.getId(sheet.ownerNode);
        else
          styleId = styleMirror.getId(sheet);
        return {
          styleId,
          id
        };
      }
      function initStyleSheetObserver({ styleSheetRuleCb, mirror: mirror2, stylesheetManager }, { win: win2 }) {
        if (!win2.CSSStyleSheet || !win2.CSSStyleSheet.prototype) {
          return () => {
          };
        }
        const insertRule = win2.CSSStyleSheet.prototype.insertRule;
        win2.CSSStyleSheet.prototype.insertRule = new Proxy(insertRule, {
          apply: callbackWrapper((target, thisArg, argumentsList) => {
            const [rule, index] = argumentsList;
            const { id, styleId } = getIdAndStyleId(thisArg, mirror2, stylesheetManager.styleMirror);
            if (id && id !== -1 || styleId && styleId !== -1) {
              styleSheetRuleCb({
                id,
                styleId,
                adds: [{ rule, index }]
              });
            }
            return target.apply(thisArg, argumentsList);
          })
        });
        const deleteRule = win2.CSSStyleSheet.prototype.deleteRule;
        win2.CSSStyleSheet.prototype.deleteRule = new Proxy(deleteRule, {
          apply: callbackWrapper((target, thisArg, argumentsList) => {
            const [index] = argumentsList;
            const { id, styleId } = getIdAndStyleId(thisArg, mirror2, stylesheetManager.styleMirror);
            if (id && id !== -1 || styleId && styleId !== -1) {
              styleSheetRuleCb({
                id,
                styleId,
                removes: [{ index }]
              });
            }
            return target.apply(thisArg, argumentsList);
          })
        });
        let replace;
        if (win2.CSSStyleSheet.prototype.replace) {
          replace = win2.CSSStyleSheet.prototype.replace;
          win2.CSSStyleSheet.prototype.replace = new Proxy(replace, {
            apply: callbackWrapper((target, thisArg, argumentsList) => {
              const [text] = argumentsList;
              const { id, styleId } = getIdAndStyleId(thisArg, mirror2, stylesheetManager.styleMirror);
              if (id && id !== -1 || styleId && styleId !== -1) {
                styleSheetRuleCb({
                  id,
                  styleId,
                  replace: text
                });
              }
              return target.apply(thisArg, argumentsList);
            })
          });
        }
        let replaceSync;
        if (win2.CSSStyleSheet.prototype.replaceSync) {
          replaceSync = win2.CSSStyleSheet.prototype.replaceSync;
          win2.CSSStyleSheet.prototype.replaceSync = new Proxy(replaceSync, {
            apply: callbackWrapper((target, thisArg, argumentsList) => {
              const [text] = argumentsList;
              const { id, styleId } = getIdAndStyleId(thisArg, mirror2, stylesheetManager.styleMirror);
              if (id && id !== -1 || styleId && styleId !== -1) {
                styleSheetRuleCb({
                  id,
                  styleId,
                  replaceSync: text
                });
              }
              return target.apply(thisArg, argumentsList);
            })
          });
        }
        const supportedNestedCSSRuleTypes = {};
        if (canMonkeyPatchNestedCSSRule("CSSGroupingRule")) {
          supportedNestedCSSRuleTypes.CSSGroupingRule = win2.CSSGroupingRule;
        } else {
          if (canMonkeyPatchNestedCSSRule("CSSMediaRule")) {
            supportedNestedCSSRuleTypes.CSSMediaRule = win2.CSSMediaRule;
          }
          if (canMonkeyPatchNestedCSSRule("CSSConditionRule")) {
            supportedNestedCSSRuleTypes.CSSConditionRule = win2.CSSConditionRule;
          }
          if (canMonkeyPatchNestedCSSRule("CSSSupportsRule")) {
            supportedNestedCSSRuleTypes.CSSSupportsRule = win2.CSSSupportsRule;
          }
        }
        const unmodifiedFunctions = {};
        Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
          unmodifiedFunctions[typeKey] = {
            insertRule: type.prototype.insertRule,
            deleteRule: type.prototype.deleteRule
          };
          type.prototype.insertRule = new Proxy(unmodifiedFunctions[typeKey].insertRule, {
            apply: callbackWrapper((target, thisArg, argumentsList) => {
              const [rule, index] = argumentsList;
              const { id, styleId } = getIdAndStyleId(thisArg.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
              if (id && id !== -1 || styleId && styleId !== -1) {
                styleSheetRuleCb({
                  id,
                  styleId,
                  adds: [
                    {
                      rule,
                      index: [
                        ...getNestedCSSRulePositions(thisArg),
                        index || 0
                      ]
                    }
                  ]
                });
              }
              return target.apply(thisArg, argumentsList);
            })
          });
          type.prototype.deleteRule = new Proxy(unmodifiedFunctions[typeKey].deleteRule, {
            apply: callbackWrapper((target, thisArg, argumentsList) => {
              const [index] = argumentsList;
              const { id, styleId } = getIdAndStyleId(thisArg.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
              if (id && id !== -1 || styleId && styleId !== -1) {
                styleSheetRuleCb({
                  id,
                  styleId,
                  removes: [
                    { index: [...getNestedCSSRulePositions(thisArg), index] }
                  ]
                });
              }
              return target.apply(thisArg, argumentsList);
            })
          });
        });
        return callbackWrapper(() => {
          win2.CSSStyleSheet.prototype.insertRule = insertRule;
          win2.CSSStyleSheet.prototype.deleteRule = deleteRule;
          replace && (win2.CSSStyleSheet.prototype.replace = replace);
          replaceSync && (win2.CSSStyleSheet.prototype.replaceSync = replaceSync);
          Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
            type.prototype.insertRule = unmodifiedFunctions[typeKey].insertRule;
            type.prototype.deleteRule = unmodifiedFunctions[typeKey].deleteRule;
          });
        });
      }
      function initAdoptedStyleSheetObserver({ mirror: mirror2, stylesheetManager }, host) {
        var _a, _b, _c;
        let hostId = null;
        if (host.nodeName === "#document")
          hostId = mirror2.getId(host);
        else
          hostId = mirror2.getId(host.host);
        const patchTarget = host.nodeName === "#document" ? (_a = host.defaultView) === null || _a === void 0 ? void 0 : _a.Document : (_c = (_b = host.ownerDocument) === null || _b === void 0 ? void 0 : _b.defaultView) === null || _c === void 0 ? void 0 : _c.ShadowRoot;
        const originalPropertyDescriptor = (patchTarget === null || patchTarget === void 0 ? void 0 : patchTarget.prototype) ? Object.getOwnPropertyDescriptor(patchTarget === null || patchTarget === void 0 ? void 0 : patchTarget.prototype, "adoptedStyleSheets") : void 0;
        if (hostId === null || hostId === -1 || !patchTarget || !originalPropertyDescriptor)
          return () => {
          };
        Object.defineProperty(host, "adoptedStyleSheets", {
          configurable: originalPropertyDescriptor.configurable,
          enumerable: originalPropertyDescriptor.enumerable,
          get() {
            var _a2;
            return (_a2 = originalPropertyDescriptor.get) === null || _a2 === void 0 ? void 0 : _a2.call(this);
          },
          set(sheets) {
            var _a2;
            const result = (_a2 = originalPropertyDescriptor.set) === null || _a2 === void 0 ? void 0 : _a2.call(this, sheets);
            if (hostId !== null && hostId !== -1) {
              try {
                stylesheetManager.adoptStyleSheets(sheets, hostId);
              } catch (e) {
              }
            }
            return result;
          }
        });
        return callbackWrapper(() => {
          Object.defineProperty(host, "adoptedStyleSheets", {
            configurable: originalPropertyDescriptor.configurable,
            enumerable: originalPropertyDescriptor.enumerable,
            get: originalPropertyDescriptor.get,
            set: originalPropertyDescriptor.set
          });
        });
      }
      function initStyleDeclarationObserver({ styleDeclarationCb, mirror: mirror2, ignoreCSSAttributes, stylesheetManager }, { win: win2 }) {
        const setProperty = win2.CSSStyleDeclaration.prototype.setProperty;
        win2.CSSStyleDeclaration.prototype.setProperty = new Proxy(setProperty, {
          apply: callbackWrapper((target, thisArg, argumentsList) => {
            var _a;
            const [property, value, priority] = argumentsList;
            if (ignoreCSSAttributes.has(property)) {
              return setProperty.apply(thisArg, [property, value, priority]);
            }
            const { id, styleId } = getIdAndStyleId((_a = thisArg.parentRule) === null || _a === void 0 ? void 0 : _a.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
            if (id && id !== -1 || styleId && styleId !== -1) {
              styleDeclarationCb({
                id,
                styleId,
                set: {
                  property,
                  value,
                  priority
                },
                index: getNestedCSSRulePositions(thisArg.parentRule)
              });
            }
            return target.apply(thisArg, argumentsList);
          })
        });
        const removeProperty = win2.CSSStyleDeclaration.prototype.removeProperty;
        win2.CSSStyleDeclaration.prototype.removeProperty = new Proxy(removeProperty, {
          apply: callbackWrapper((target, thisArg, argumentsList) => {
            var _a;
            const [property] = argumentsList;
            if (ignoreCSSAttributes.has(property)) {
              return removeProperty.apply(thisArg, [property]);
            }
            const { id, styleId } = getIdAndStyleId((_a = thisArg.parentRule) === null || _a === void 0 ? void 0 : _a.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
            if (id && id !== -1 || styleId && styleId !== -1) {
              styleDeclarationCb({
                id,
                styleId,
                remove: {
                  property
                },
                index: getNestedCSSRulePositions(thisArg.parentRule)
              });
            }
            return target.apply(thisArg, argumentsList);
          })
        });
        return callbackWrapper(() => {
          win2.CSSStyleDeclaration.prototype.setProperty = setProperty;
          win2.CSSStyleDeclaration.prototype.removeProperty = removeProperty;
        });
      }
      function initMediaInteractionObserver({ mediaInteractionCb, blockClass, blockSelector, mirror: mirror2, sampling, doc }) {
        const handler = callbackWrapper((type) => throttle(callbackWrapper((event) => {
          const target = getEventTarget(event);
          if (!target || isBlocked(target, blockClass, blockSelector, true)) {
            return;
          }
          const { currentTime, volume, muted, playbackRate, loop } = target;
          mediaInteractionCb({
            type,
            id: mirror2.getId(target),
            currentTime,
            volume,
            muted,
            playbackRate,
            loop
          });
        }), sampling.media || 500));
        const handlers = [
          on("play", handler(0), doc),
          on("pause", handler(1), doc),
          on("seeked", handler(2), doc),
          on("volumechange", handler(3), doc),
          on("ratechange", handler(4), doc)
        ];
        return callbackWrapper(() => {
          handlers.forEach((h) => h());
        });
      }
      function initFontObserver({ fontCb, doc }) {
        const win2 = doc.defaultView;
        if (!win2) {
          return () => {
          };
        }
        const handlers = [];
        const fontMap = /* @__PURE__ */ new WeakMap();
        const originalFontFace = win2.FontFace;
        win2.FontFace = function FontFace(family, source, descriptors) {
          const fontFace = new originalFontFace(family, source, descriptors);
          fontMap.set(fontFace, {
            family,
            buffer: typeof source !== "string",
            descriptors,
            fontSource: typeof source === "string" ? source : JSON.stringify(Array.from(new Uint8Array(source)))
          });
          return fontFace;
        };
        const restoreHandler = patch(doc.fonts, "add", function(original) {
          return function(fontFace) {
            setTimeout(callbackWrapper(() => {
              const p = fontMap.get(fontFace);
              if (p) {
                fontCb(p);
                fontMap.delete(fontFace);
              }
            }), 0);
            return original.apply(this, [fontFace]);
          };
        });
        handlers.push(() => {
          win2.FontFace = originalFontFace;
        });
        handlers.push(restoreHandler);
        return callbackWrapper(() => {
          handlers.forEach((h) => h());
        });
      }
      function initSelectionObserver(param) {
        const { doc, mirror: mirror2, blockClass, blockSelector, selectionCb } = param;
        let collapsed = true;
        const updateSelection = callbackWrapper(() => {
          const selection = doc.getSelection();
          if (!selection || collapsed && (selection === null || selection === void 0 ? void 0 : selection.isCollapsed))
            return;
          collapsed = selection.isCollapsed || false;
          const ranges = [];
          const count = selection.rangeCount || 0;
          for (let i2 = 0; i2 < count; i2++) {
            const range = selection.getRangeAt(i2);
            const { startContainer, startOffset, endContainer, endOffset } = range;
            const blocked = isBlocked(startContainer, blockClass, blockSelector, true) || isBlocked(endContainer, blockClass, blockSelector, true);
            if (blocked)
              continue;
            ranges.push({
              start: mirror2.getId(startContainer),
              startOffset,
              end: mirror2.getId(endContainer),
              endOffset
            });
          }
          selectionCb({ ranges });
        });
        updateSelection();
        return on("selectionchange", updateSelection);
      }
      function initCustomElementObserver({ doc, customElementCb }) {
        const win2 = doc.defaultView;
        if (!win2 || !win2.customElements)
          return () => {
          };
        const restoreHandler = patch(win2.customElements, "define", function(original) {
          return function(name, constructor, options) {
            try {
              customElementCb({
                define: {
                  name
                }
              });
            } catch (e) {
              console.warn(`Custom element callback failed for ${name}`);
            }
            return original.apply(this, [name, constructor, options]);
          };
        });
        return restoreHandler;
      }
      function mergeHooks(o, hooks) {
        const { mutationCb, mousemoveCb, mouseInteractionCb, scrollCb, viewportResizeCb, inputCb, mediaInteractionCb, styleSheetRuleCb, styleDeclarationCb, canvasMutationCb, fontCb, selectionCb, customElementCb } = o;
        o.mutationCb = (...p) => {
          if (hooks.mutation) {
            hooks.mutation(...p);
          }
          mutationCb(...p);
        };
        o.mousemoveCb = (...p) => {
          if (hooks.mousemove) {
            hooks.mousemove(...p);
          }
          mousemoveCb(...p);
        };
        o.mouseInteractionCb = (...p) => {
          if (hooks.mouseInteraction) {
            hooks.mouseInteraction(...p);
          }
          mouseInteractionCb(...p);
        };
        o.scrollCb = (...p) => {
          if (hooks.scroll) {
            hooks.scroll(...p);
          }
          scrollCb(...p);
        };
        o.viewportResizeCb = (...p) => {
          if (hooks.viewportResize) {
            hooks.viewportResize(...p);
          }
          viewportResizeCb(...p);
        };
        o.inputCb = (...p) => {
          if (hooks.input) {
            hooks.input(...p);
          }
          inputCb(...p);
        };
        o.mediaInteractionCb = (...p) => {
          if (hooks.mediaInteaction) {
            hooks.mediaInteaction(...p);
          }
          mediaInteractionCb(...p);
        };
        o.styleSheetRuleCb = (...p) => {
          if (hooks.styleSheetRule) {
            hooks.styleSheetRule(...p);
          }
          styleSheetRuleCb(...p);
        };
        o.styleDeclarationCb = (...p) => {
          if (hooks.styleDeclaration) {
            hooks.styleDeclaration(...p);
          }
          styleDeclarationCb(...p);
        };
        o.canvasMutationCb = (...p) => {
          if (hooks.canvasMutation) {
            hooks.canvasMutation(...p);
          }
          canvasMutationCb(...p);
        };
        o.fontCb = (...p) => {
          if (hooks.font) {
            hooks.font(...p);
          }
          fontCb(...p);
        };
        o.selectionCb = (...p) => {
          if (hooks.selection) {
            hooks.selection(...p);
          }
          selectionCb(...p);
        };
        o.customElementCb = (...c) => {
          if (hooks.customElement) {
            hooks.customElement(...c);
          }
          customElementCb(...c);
        };
      }
      function initObservers(o, hooks = {}) {
        const currentWindow = o.doc.defaultView;
        if (!currentWindow) {
          return () => {
          };
        }
        mergeHooks(o, hooks);
        let mutationObserver;
        if (o.recordDOM) {
          mutationObserver = initMutationObserver(o, o.doc);
        }
        const mousemoveHandler = initMoveObserver(o);
        const mouseInteractionHandler = initMouseInteractionObserver(o);
        const scrollHandler = initScrollObserver(o);
        const viewportResizeHandler = initViewportResizeObserver(o, {
          win: currentWindow
        });
        const inputHandler = initInputObserver(o);
        const mediaInteractionHandler = initMediaInteractionObserver(o);
        let styleSheetObserver = () => {
        };
        let adoptedStyleSheetObserver = () => {
        };
        let styleDeclarationObserver = () => {
        };
        let fontObserver = () => {
        };
        if (o.recordDOM) {
          styleSheetObserver = initStyleSheetObserver(o, { win: currentWindow });
          adoptedStyleSheetObserver = initAdoptedStyleSheetObserver(o, o.doc);
          styleDeclarationObserver = initStyleDeclarationObserver(o, {
            win: currentWindow
          });
          if (o.collectFonts) {
            fontObserver = initFontObserver(o);
          }
        }
        const selectionObserver = initSelectionObserver(o);
        const customElementObserver = initCustomElementObserver(o);
        const pluginHandlers = [];
        for (const plugin of o.plugins) {
          pluginHandlers.push(plugin.observer(plugin.callback, currentWindow, plugin.options));
        }
        return callbackWrapper(() => {
          mutationBuffers.forEach((b) => b.reset());
          mutationObserver === null || mutationObserver === void 0 ? void 0 : mutationObserver.disconnect();
          mousemoveHandler();
          mouseInteractionHandler();
          scrollHandler();
          viewportResizeHandler();
          inputHandler();
          mediaInteractionHandler();
          styleSheetObserver();
          adoptedStyleSheetObserver();
          styleDeclarationObserver();
          fontObserver();
          selectionObserver();
          customElementObserver();
          pluginHandlers.forEach((h) => h());
        });
      }
      function hasNestedCSSRule(prop) {
        return typeof window[prop] !== "undefined";
      }
      function canMonkeyPatchNestedCSSRule(prop) {
        return Boolean(typeof window[prop] !== "undefined" && window[prop].prototype && "insertRule" in window[prop].prototype && "deleteRule" in window[prop].prototype);
      }
      var CrossOriginIframeMirror = class {
        constructor(generateIdFn) {
          this.generateIdFn = generateIdFn;
          this.iframeIdToRemoteIdMap = /* @__PURE__ */ new WeakMap();
          this.iframeRemoteIdToIdMap = /* @__PURE__ */ new WeakMap();
        }
        getId(iframe, remoteId, idToRemoteMap, remoteToIdMap) {
          const idToRemoteIdMap = idToRemoteMap || this.getIdToRemoteIdMap(iframe);
          const remoteIdToIdMap = remoteToIdMap || this.getRemoteIdToIdMap(iframe);
          let id = idToRemoteIdMap.get(remoteId);
          if (!id) {
            id = this.generateIdFn();
            idToRemoteIdMap.set(remoteId, id);
            remoteIdToIdMap.set(id, remoteId);
          }
          return id;
        }
        getIds(iframe, remoteId) {
          const idToRemoteIdMap = this.getIdToRemoteIdMap(iframe);
          const remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
          return remoteId.map((id) => this.getId(iframe, id, idToRemoteIdMap, remoteIdToIdMap));
        }
        getRemoteId(iframe, id, map) {
          const remoteIdToIdMap = map || this.getRemoteIdToIdMap(iframe);
          if (typeof id !== "number")
            return id;
          const remoteId = remoteIdToIdMap.get(id);
          if (!remoteId)
            return -1;
          return remoteId;
        }
        getRemoteIds(iframe, ids) {
          const remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
          return ids.map((id) => this.getRemoteId(iframe, id, remoteIdToIdMap));
        }
        reset(iframe) {
          if (!iframe) {
            this.iframeIdToRemoteIdMap = /* @__PURE__ */ new WeakMap();
            this.iframeRemoteIdToIdMap = /* @__PURE__ */ new WeakMap();
            return;
          }
          this.iframeIdToRemoteIdMap.delete(iframe);
          this.iframeRemoteIdToIdMap.delete(iframe);
        }
        getIdToRemoteIdMap(iframe) {
          let idToRemoteIdMap = this.iframeIdToRemoteIdMap.get(iframe);
          if (!idToRemoteIdMap) {
            idToRemoteIdMap = /* @__PURE__ */ new Map();
            this.iframeIdToRemoteIdMap.set(iframe, idToRemoteIdMap);
          }
          return idToRemoteIdMap;
        }
        getRemoteIdToIdMap(iframe) {
          let remoteIdToIdMap = this.iframeRemoteIdToIdMap.get(iframe);
          if (!remoteIdToIdMap) {
            remoteIdToIdMap = /* @__PURE__ */ new Map();
            this.iframeRemoteIdToIdMap.set(iframe, remoteIdToIdMap);
          }
          return remoteIdToIdMap;
        }
      };
      var IframeManager = class {
        constructor(options) {
          this.iframes = /* @__PURE__ */ new WeakMap();
          this.crossOriginIframeMap = /* @__PURE__ */ new WeakMap();
          this.crossOriginIframeMirror = new CrossOriginIframeMirror(genId);
          this.crossOriginIframeRootIdMap = /* @__PURE__ */ new WeakMap();
          this.mutationCb = options.mutationCb;
          this.wrappedEmit = options.wrappedEmit;
          this.stylesheetManager = options.stylesheetManager;
          this.recordCrossOriginIframes = options.recordCrossOriginIframes;
          this.crossOriginIframeStyleMirror = new CrossOriginIframeMirror(this.stylesheetManager.styleMirror.generateId.bind(this.stylesheetManager.styleMirror));
          this.mirror = options.mirror;
          if (this.recordCrossOriginIframes) {
            window.addEventListener("message", this.handleMessage.bind(this));
          }
        }
        addIframe(iframeEl) {
          this.iframes.set(iframeEl, true);
          if (iframeEl.contentWindow)
            this.crossOriginIframeMap.set(iframeEl.contentWindow, iframeEl);
        }
        addLoadListener(cb) {
          this.loadListener = cb;
        }
        attachIframe(iframeEl, childSn) {
          var _a;
          this.mutationCb({
            adds: [
              {
                parentId: this.mirror.getId(iframeEl),
                nextId: null,
                node: childSn
              }
            ],
            removes: [],
            texts: [],
            attributes: [],
            isAttachIframe: true
          });
          (_a = this.loadListener) === null || _a === void 0 ? void 0 : _a.call(this, iframeEl);
          if (iframeEl.contentDocument && iframeEl.contentDocument.adoptedStyleSheets && iframeEl.contentDocument.adoptedStyleSheets.length > 0)
            this.stylesheetManager.adoptStyleSheets(iframeEl.contentDocument.adoptedStyleSheets, this.mirror.getId(iframeEl.contentDocument));
        }
        handleMessage(message) {
          const crossOriginMessageEvent = message;
          if (crossOriginMessageEvent.data.type !== "rrweb" || crossOriginMessageEvent.origin !== crossOriginMessageEvent.data.origin)
            return;
          const iframeSourceWindow = message.source;
          if (!iframeSourceWindow)
            return;
          const iframeEl = this.crossOriginIframeMap.get(message.source);
          if (!iframeEl)
            return;
          const transformedEvent = this.transformCrossOriginEvent(iframeEl, crossOriginMessageEvent.data.event);
          if (transformedEvent)
            this.wrappedEmit(transformedEvent, crossOriginMessageEvent.data.isCheckout);
        }
        transformCrossOriginEvent(iframeEl, e) {
          var _a;
          switch (e.type) {
            case EventType$1.FullSnapshot: {
              this.crossOriginIframeMirror.reset(iframeEl);
              this.crossOriginIframeStyleMirror.reset(iframeEl);
              this.replaceIdOnNode(e.data.node, iframeEl);
              const rootId = e.data.node.id;
              this.crossOriginIframeRootIdMap.set(iframeEl, rootId);
              this.patchRootIdOnNode(e.data.node, rootId);
              return {
                timestamp: e.timestamp,
                type: EventType$1.IncrementalSnapshot,
                data: {
                  source: IncrementalSource$1.Mutation,
                  adds: [
                    {
                      parentId: this.mirror.getId(iframeEl),
                      nextId: null,
                      node: e.data.node
                    }
                  ],
                  removes: [],
                  texts: [],
                  attributes: [],
                  isAttachIframe: true
                }
              };
            }
            case EventType$1.Meta:
            case EventType$1.Load:
            case EventType$1.DomContentLoaded: {
              return false;
            }
            case EventType$1.Plugin: {
              return e;
            }
            case EventType$1.Custom: {
              this.replaceIds(e.data.payload, iframeEl, ["id", "parentId", "previousId", "nextId"]);
              return e;
            }
            case EventType$1.IncrementalSnapshot: {
              switch (e.data.source) {
                case IncrementalSource$1.Mutation: {
                  e.data.adds.forEach((n) => {
                    this.replaceIds(n, iframeEl, [
                      "parentId",
                      "nextId",
                      "previousId"
                    ]);
                    this.replaceIdOnNode(n.node, iframeEl);
                    const rootId = this.crossOriginIframeRootIdMap.get(iframeEl);
                    rootId && this.patchRootIdOnNode(n.node, rootId);
                  });
                  e.data.removes.forEach((n) => {
                    this.replaceIds(n, iframeEl, ["parentId", "id"]);
                  });
                  e.data.attributes.forEach((n) => {
                    this.replaceIds(n, iframeEl, ["id"]);
                  });
                  e.data.texts.forEach((n) => {
                    this.replaceIds(n, iframeEl, ["id"]);
                  });
                  return e;
                }
                case IncrementalSource$1.Drag:
                case IncrementalSource$1.TouchMove:
                case IncrementalSource$1.MouseMove: {
                  e.data.positions.forEach((p) => {
                    this.replaceIds(p, iframeEl, ["id"]);
                  });
                  return e;
                }
                case IncrementalSource$1.ViewportResize: {
                  return false;
                }
                case IncrementalSource$1.MediaInteraction:
                case IncrementalSource$1.MouseInteraction:
                case IncrementalSource$1.Scroll:
                case IncrementalSource$1.CanvasMutation:
                case IncrementalSource$1.Input: {
                  this.replaceIds(e.data, iframeEl, ["id"]);
                  return e;
                }
                case IncrementalSource$1.StyleSheetRule:
                case IncrementalSource$1.StyleDeclaration: {
                  this.replaceIds(e.data, iframeEl, ["id"]);
                  this.replaceStyleIds(e.data, iframeEl, ["styleId"]);
                  return e;
                }
                case IncrementalSource$1.Font: {
                  return e;
                }
                case IncrementalSource$1.Selection: {
                  e.data.ranges.forEach((range) => {
                    this.replaceIds(range, iframeEl, ["start", "end"]);
                  });
                  return e;
                }
                case IncrementalSource$1.AdoptedStyleSheet: {
                  this.replaceIds(e.data, iframeEl, ["id"]);
                  this.replaceStyleIds(e.data, iframeEl, ["styleIds"]);
                  (_a = e.data.styles) === null || _a === void 0 ? void 0 : _a.forEach((style) => {
                    this.replaceStyleIds(style, iframeEl, ["styleId"]);
                  });
                  return e;
                }
              }
            }
          }
          return false;
        }
        replace(iframeMirror, obj, iframeEl, keys) {
          for (const key of keys) {
            if (!Array.isArray(obj[key]) && typeof obj[key] !== "number")
              continue;
            if (Array.isArray(obj[key])) {
              obj[key] = iframeMirror.getIds(iframeEl, obj[key]);
            } else {
              obj[key] = iframeMirror.getId(iframeEl, obj[key]);
            }
          }
          return obj;
        }
        replaceIds(obj, iframeEl, keys) {
          return this.replace(this.crossOriginIframeMirror, obj, iframeEl, keys);
        }
        replaceStyleIds(obj, iframeEl, keys) {
          return this.replace(this.crossOriginIframeStyleMirror, obj, iframeEl, keys);
        }
        replaceIdOnNode(node, iframeEl) {
          this.replaceIds(node, iframeEl, ["id", "rootId"]);
          if ("childNodes" in node) {
            node.childNodes.forEach((child) => {
              this.replaceIdOnNode(child, iframeEl);
            });
          }
        }
        patchRootIdOnNode(node, rootId) {
          if (node.type !== NodeType.Document && !node.rootId)
            node.rootId = rootId;
          if ("childNodes" in node) {
            node.childNodes.forEach((child) => {
              this.patchRootIdOnNode(child, rootId);
            });
          }
        }
      };
      var ShadowDomManager = class {
        constructor(options) {
          this.shadowDoms = /* @__PURE__ */ new WeakSet();
          this.restoreHandlers = [];
          this.mutationCb = options.mutationCb;
          this.scrollCb = options.scrollCb;
          this.bypassOptions = options.bypassOptions;
          this.mirror = options.mirror;
          this.init();
        }
        init() {
          this.reset();
          this.patchAttachShadow(Element, document);
        }
        addShadowRoot(shadowRoot, doc) {
          if (!isNativeShadowDom(shadowRoot))
            return;
          if (this.shadowDoms.has(shadowRoot))
            return;
          this.shadowDoms.add(shadowRoot);
          const observer = initMutationObserver(Object.assign(Object.assign({}, this.bypassOptions), { doc, mutationCb: this.mutationCb, mirror: this.mirror, shadowDomManager: this }), shadowRoot);
          this.restoreHandlers.push(() => observer.disconnect());
          this.restoreHandlers.push(initScrollObserver(Object.assign(Object.assign({}, this.bypassOptions), { scrollCb: this.scrollCb, doc: shadowRoot, mirror: this.mirror })));
          setTimeout(() => {
            if (shadowRoot.adoptedStyleSheets && shadowRoot.adoptedStyleSheets.length > 0)
              this.bypassOptions.stylesheetManager.adoptStyleSheets(shadowRoot.adoptedStyleSheets, this.mirror.getId(shadowRoot.host));
            this.restoreHandlers.push(initAdoptedStyleSheetObserver({
              mirror: this.mirror,
              stylesheetManager: this.bypassOptions.stylesheetManager
            }, shadowRoot));
          }, 0);
        }
        observeAttachShadow(iframeElement) {
          if (!iframeElement.contentWindow || !iframeElement.contentDocument)
            return;
          this.patchAttachShadow(iframeElement.contentWindow.Element, iframeElement.contentDocument);
        }
        patchAttachShadow(element, doc) {
          const manager = this;
          this.restoreHandlers.push(patch(element.prototype, "attachShadow", function(original) {
            return function(option) {
              const shadowRoot = original.call(this, option);
              if (this.shadowRoot && inDom(this))
                manager.addShadowRoot(this.shadowRoot, doc);
              return shadowRoot;
            };
          }));
        }
        reset() {
          this.restoreHandlers.forEach((handler) => {
            try {
              handler();
            } catch (e) {
            }
          });
          this.restoreHandlers = [];
          this.shadowDoms = /* @__PURE__ */ new WeakSet();
        }
      };
      function __rest(s, e) {
        var t = {};
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s); i2 < p.length; i2++) {
            if (e.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i2]))
              t[p[i2]] = s[p[i2]];
          }
        return t;
      }
      function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      }
      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
      for (i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
      }
      var i;
      var encode = function(arraybuffer) {
        var bytes = new Uint8Array(arraybuffer), i2, len = bytes.length, base64 = "";
        for (i2 = 0; i2 < len; i2 += 3) {
          base64 += chars[bytes[i2] >> 2];
          base64 += chars[(bytes[i2] & 3) << 4 | bytes[i2 + 1] >> 4];
          base64 += chars[(bytes[i2 + 1] & 15) << 2 | bytes[i2 + 2] >> 6];
          base64 += chars[bytes[i2 + 2] & 63];
        }
        if (len % 3 === 2) {
          base64 = base64.substring(0, base64.length - 1) + "=";
        } else if (len % 3 === 1) {
          base64 = base64.substring(0, base64.length - 2) + "==";
        }
        return base64;
      };
      var canvasVarMap = /* @__PURE__ */ new Map();
      function variableListFor(ctx, ctor) {
        let contextMap = canvasVarMap.get(ctx);
        if (!contextMap) {
          contextMap = /* @__PURE__ */ new Map();
          canvasVarMap.set(ctx, contextMap);
        }
        if (!contextMap.has(ctor)) {
          contextMap.set(ctor, []);
        }
        return contextMap.get(ctor);
      }
      var saveWebGLVar = (value, win2, ctx) => {
        if (!value || !(isInstanceOfWebGLObject(value, win2) || typeof value === "object"))
          return;
        const name = value.constructor.name;
        const list = variableListFor(ctx, name);
        let index = list.indexOf(value);
        if (index === -1) {
          index = list.length;
          list.push(value);
        }
        return index;
      };
      function serializeArg(value, win2, ctx) {
        if (value instanceof Array) {
          return value.map((arg) => serializeArg(arg, win2, ctx));
        } else if (value === null) {
          return value;
        } else if (value instanceof Float32Array || value instanceof Float64Array || value instanceof Int32Array || value instanceof Uint32Array || value instanceof Uint8Array || value instanceof Uint16Array || value instanceof Int16Array || value instanceof Int8Array || value instanceof Uint8ClampedArray) {
          const name = value.constructor.name;
          return {
            rr_type: name,
            args: [Object.values(value)]
          };
        } else if (value instanceof ArrayBuffer) {
          const name = value.constructor.name;
          const base64 = encode(value);
          return {
            rr_type: name,
            base64
          };
        } else if (value instanceof DataView) {
          const name = value.constructor.name;
          return {
            rr_type: name,
            args: [
              serializeArg(value.buffer, win2, ctx),
              value.byteOffset,
              value.byteLength
            ]
          };
        } else if (value instanceof HTMLImageElement) {
          const name = value.constructor.name;
          const { src } = value;
          return {
            rr_type: name,
            src
          };
        } else if (value instanceof HTMLCanvasElement) {
          const name = "HTMLImageElement";
          const src = value.toDataURL();
          return {
            rr_type: name,
            src
          };
        } else if (value instanceof ImageData) {
          const name = value.constructor.name;
          return {
            rr_type: name,
            args: [serializeArg(value.data, win2, ctx), value.width, value.height]
          };
        } else if (isInstanceOfWebGLObject(value, win2) || typeof value === "object") {
          const name = value.constructor.name;
          const index = saveWebGLVar(value, win2, ctx);
          return {
            rr_type: name,
            index
          };
        }
        return value;
      }
      var serializeArgs = (args, win2, ctx) => {
        return args.map((arg) => serializeArg(arg, win2, ctx));
      };
      var isInstanceOfWebGLObject = (value, win2) => {
        const webGLConstructorNames = [
          "WebGLActiveInfo",
          "WebGLBuffer",
          "WebGLFramebuffer",
          "WebGLProgram",
          "WebGLRenderbuffer",
          "WebGLShader",
          "WebGLShaderPrecisionFormat",
          "WebGLTexture",
          "WebGLUniformLocation",
          "WebGLVertexArrayObject",
          "WebGLVertexArrayObjectOES"
        ];
        const supportedWebGLConstructorNames = webGLConstructorNames.filter((name) => typeof win2[name] === "function");
        return Boolean(supportedWebGLConstructorNames.find((name) => value instanceof win2[name]));
      };
      function initCanvas2DMutationObserver(cb, win2, blockClass, blockSelector) {
        const handlers = [];
        const props2D = Object.getOwnPropertyNames(win2.CanvasRenderingContext2D.prototype);
        for (const prop of props2D) {
          try {
            if (typeof win2.CanvasRenderingContext2D.prototype[prop] !== "function") {
              continue;
            }
            const restoreHandler = patch(win2.CanvasRenderingContext2D.prototype, prop, function(original) {
              return function(...args) {
                if (!isBlocked(this.canvas, blockClass, blockSelector, true)) {
                  setTimeout(() => {
                    const recordArgs = serializeArgs(args, win2, this);
                    cb(this.canvas, {
                      type: CanvasContext["2D"],
                      property: prop,
                      args: recordArgs
                    });
                  }, 0);
                }
                return original.apply(this, args);
              };
            });
            handlers.push(restoreHandler);
          } catch (_a) {
            const hookHandler = hookSetter(win2.CanvasRenderingContext2D.prototype, prop, {
              set(v) {
                cb(this.canvas, {
                  type: CanvasContext["2D"],
                  property: prop,
                  args: [v],
                  setter: true
                });
              }
            });
            handlers.push(hookHandler);
          }
        }
        return () => {
          handlers.forEach((h) => h());
        };
      }
      function getNormalizedContextName(contextType) {
        return contextType === "experimental-webgl" ? "webgl" : contextType;
      }
      function initCanvasContextObserver(win2, blockClass, blockSelector, setPreserveDrawingBufferToTrue) {
        const handlers = [];
        try {
          const restoreHandler = patch(win2.HTMLCanvasElement.prototype, "getContext", function(original) {
            return function(contextType, ...args) {
              if (!isBlocked(this, blockClass, blockSelector, true)) {
                const ctxName = getNormalizedContextName(contextType);
                if (!("__context" in this))
                  this.__context = ctxName;
                if (setPreserveDrawingBufferToTrue && ["webgl", "webgl2"].includes(ctxName)) {
                  if (args[0] && typeof args[0] === "object") {
                    const contextAttributes = args[0];
                    if (!contextAttributes.preserveDrawingBuffer) {
                      contextAttributes.preserveDrawingBuffer = true;
                    }
                  } else {
                    args.splice(0, 1, {
                      preserveDrawingBuffer: true
                    });
                  }
                }
              }
              return original.apply(this, [contextType, ...args]);
            };
          });
          handlers.push(restoreHandler);
        } catch (_a) {
          console.error("failed to patch HTMLCanvasElement.prototype.getContext");
        }
        return () => {
          handlers.forEach((h) => h());
        };
      }
      function patchGLPrototype(prototype, type, cb, blockClass, blockSelector, mirror2, win2) {
        const handlers = [];
        const props = Object.getOwnPropertyNames(prototype);
        for (const prop of props) {
          if ([
            "isContextLost",
            "canvas",
            "drawingBufferWidth",
            "drawingBufferHeight"
          ].includes(prop)) {
            continue;
          }
          try {
            if (typeof prototype[prop] !== "function") {
              continue;
            }
            const restoreHandler = patch(prototype, prop, function(original) {
              return function(...args) {
                const result = original.apply(this, args);
                saveWebGLVar(result, win2, this);
                if ("tagName" in this.canvas && !isBlocked(this.canvas, blockClass, blockSelector, true)) {
                  const recordArgs = serializeArgs(args, win2, this);
                  const mutation = {
                    type,
                    property: prop,
                    args: recordArgs
                  };
                  cb(this.canvas, mutation);
                }
                return result;
              };
            });
            handlers.push(restoreHandler);
          } catch (_a) {
            const hookHandler = hookSetter(prototype, prop, {
              set(v) {
                cb(this.canvas, {
                  type,
                  property: prop,
                  args: [v],
                  setter: true
                });
              }
            });
            handlers.push(hookHandler);
          }
        }
        return handlers;
      }
      function initCanvasWebGLMutationObserver(cb, win2, blockClass, blockSelector, mirror2) {
        const handlers = [];
        handlers.push(...patchGLPrototype(win2.WebGLRenderingContext.prototype, CanvasContext.WebGL, cb, blockClass, blockSelector, mirror2, win2));
        if (typeof win2.WebGL2RenderingContext !== "undefined") {
          handlers.push(...patchGLPrototype(win2.WebGL2RenderingContext.prototype, CanvasContext.WebGL2, cb, blockClass, blockSelector, mirror2, win2));
        }
        return () => {
          handlers.forEach((h) => h());
        };
      }
      function funcToSource(fn, sourcemapArg) {
        var sourcemap = sourcemapArg === void 0 ? null : sourcemapArg;
        var source = fn.toString();
        var lines = source.split("\n");
        lines.pop();
        lines.shift();
        var blankPrefixLength = lines[0].search(/\S/);
        var regex = /(['"])__worker_loader_strict__(['"])/g;
        for (var i2 = 0, n = lines.length; i2 < n; ++i2) {
          lines[i2] = lines[i2].substring(blankPrefixLength).replace(regex, "$1use strict$2") + "\n";
        }
        if (sourcemap) {
          lines.push("//# sourceMappingURL=" + sourcemap + "\n");
        }
        return lines;
      }
      function createURL(fn, sourcemapArg) {
        var lines = funcToSource(fn, sourcemapArg);
        var blob = new Blob(lines, { type: "application/javascript" });
        return URL.createObjectURL(blob);
      }
      function createInlineWorkerFactory(fn, sourcemapArg) {
        var url;
        return function WorkerFactory2(options) {
          url = url || createURL(fn, sourcemapArg);
          return new Worker(url, options);
        };
      }
      var WorkerFactory = createInlineWorkerFactory(function() {
        (function() {
          "__worker_loader_strict__";
          function __awaiter2(thisArg, _arguments, P, generator) {
            function adopt(value) {
              return value instanceof P ? value : new P(function(resolve) {
                resolve(value);
              });
            }
            return new (P || (P = Promise))(function(resolve, reject) {
              function fulfilled(value) {
                try {
                  step(generator.next(value));
                } catch (e) {
                  reject(e);
                }
              }
              function rejected(value) {
                try {
                  step(generator["throw"](value));
                } catch (e) {
                  reject(e);
                }
              }
              function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
              }
              step((generator = generator.apply(thisArg, _arguments || [])).next());
            });
          }
          var chars2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          var lookup2 = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
          for (var i2 = 0; i2 < chars2.length; i2++) {
            lookup2[chars2.charCodeAt(i2)] = i2;
          }
          var encode2 = function(arraybuffer) {
            var bytes = new Uint8Array(arraybuffer), i3, len = bytes.length, base64 = "";
            for (i3 = 0; i3 < len; i3 += 3) {
              base64 += chars2[bytes[i3] >> 2];
              base64 += chars2[(bytes[i3] & 3) << 4 | bytes[i3 + 1] >> 4];
              base64 += chars2[(bytes[i3 + 1] & 15) << 2 | bytes[i3 + 2] >> 6];
              base64 += chars2[bytes[i3 + 2] & 63];
            }
            if (len % 3 === 2) {
              base64 = base64.substring(0, base64.length - 1) + "=";
            } else if (len % 3 === 1) {
              base64 = base64.substring(0, base64.length - 2) + "==";
            }
            return base64;
          };
          const lastBlobMap = /* @__PURE__ */ new Map();
          const transparentBlobMap = /* @__PURE__ */ new Map();
          function getTransparentBlobFor(width, height, dataURLOptions) {
            return __awaiter2(this, void 0, void 0, function* () {
              const id = `${width}-${height}`;
              if ("OffscreenCanvas" in globalThis) {
                if (transparentBlobMap.has(id))
                  return transparentBlobMap.get(id);
                const offscreen = new OffscreenCanvas(width, height);
                offscreen.getContext("2d");
                const blob = yield offscreen.convertToBlob(dataURLOptions);
                const arrayBuffer = yield blob.arrayBuffer();
                const base64 = encode2(arrayBuffer);
                transparentBlobMap.set(id, base64);
                return base64;
              } else {
                return "";
              }
            });
          }
          const worker = self;
          worker.onmessage = function(e) {
            return __awaiter2(this, void 0, void 0, function* () {
              if ("OffscreenCanvas" in globalThis) {
                const { id, bitmap, width, height, dataURLOptions } = e.data;
                const transparentBase64 = getTransparentBlobFor(width, height, dataURLOptions);
                const offscreen = new OffscreenCanvas(width, height);
                const ctx = offscreen.getContext("2d");
                ctx.drawImage(bitmap, 0, 0);
                bitmap.close();
                const blob = yield offscreen.convertToBlob(dataURLOptions);
                const type = blob.type;
                const arrayBuffer = yield blob.arrayBuffer();
                const base64 = encode2(arrayBuffer);
                if (!lastBlobMap.has(id) && (yield transparentBase64) === base64) {
                  lastBlobMap.set(id, base64);
                  return worker.postMessage({ id });
                }
                if (lastBlobMap.get(id) === base64)
                  return worker.postMessage({ id });
                worker.postMessage({
                  id,
                  type,
                  base64,
                  width,
                  height
                });
                lastBlobMap.set(id, base64);
              } else {
                return worker.postMessage({ id: e.data.id });
              }
            });
          };
        })();
      }, null);
      var CanvasManager = class {
        reset() {
          this.pendingCanvasMutations.clear();
          this.resetObservers && this.resetObservers();
        }
        freeze() {
          this.frozen = true;
        }
        unfreeze() {
          this.frozen = false;
        }
        lock() {
          this.locked = true;
        }
        unlock() {
          this.locked = false;
        }
        constructor(options) {
          this.pendingCanvasMutations = /* @__PURE__ */ new Map();
          this.rafStamps = { latestId: 0, invokeId: null };
          this.frozen = false;
          this.locked = false;
          this.processMutation = (target, mutation) => {
            const newFrame = this.rafStamps.invokeId && this.rafStamps.latestId !== this.rafStamps.invokeId;
            if (newFrame || !this.rafStamps.invokeId)
              this.rafStamps.invokeId = this.rafStamps.latestId;
            if (!this.pendingCanvasMutations.has(target)) {
              this.pendingCanvasMutations.set(target, []);
            }
            this.pendingCanvasMutations.get(target).push(mutation);
          };
          const { sampling = "all", win: win2, blockClass, blockSelector, recordCanvas, dataURLOptions } = options;
          this.mutationCb = options.mutationCb;
          this.mirror = options.mirror;
          if (recordCanvas && sampling === "all")
            this.initCanvasMutationObserver(win2, blockClass, blockSelector);
          if (recordCanvas && typeof sampling === "number")
            this.initCanvasFPSObserver(sampling, win2, blockClass, blockSelector, {
              dataURLOptions
            });
        }
        initCanvasFPSObserver(fps, win2, blockClass, blockSelector, options) {
          const canvasContextReset = initCanvasContextObserver(win2, blockClass, blockSelector, true);
          const snapshotInProgressMap = /* @__PURE__ */ new Map();
          const worker = new WorkerFactory();
          worker.onmessage = (e) => {
            const { id } = e.data;
            snapshotInProgressMap.set(id, false);
            if (!("base64" in e.data))
              return;
            const { base64, type, width, height } = e.data;
            this.mutationCb({
              id,
              type: CanvasContext["2D"],
              commands: [
                {
                  property: "clearRect",
                  args: [0, 0, width, height]
                },
                {
                  property: "drawImage",
                  args: [
                    {
                      rr_type: "ImageBitmap",
                      args: [
                        {
                          rr_type: "Blob",
                          data: [{ rr_type: "ArrayBuffer", base64 }],
                          type
                        }
                      ]
                    },
                    0,
                    0
                  ]
                }
              ]
            });
          };
          const timeBetweenSnapshots = 1e3 / fps;
          let lastSnapshotTime = 0;
          let rafId;
          const getCanvas = () => {
            const matchedCanvas = [];
            win2.document.querySelectorAll("canvas").forEach((canvas) => {
              if (!isBlocked(canvas, blockClass, blockSelector, true)) {
                matchedCanvas.push(canvas);
              }
            });
            return matchedCanvas;
          };
          const takeCanvasSnapshots = (timestamp) => {
            if (lastSnapshotTime && timestamp - lastSnapshotTime < timeBetweenSnapshots) {
              rafId = requestAnimationFrame(takeCanvasSnapshots);
              return;
            }
            lastSnapshotTime = timestamp;
            getCanvas().forEach((canvas) => __awaiter(this, void 0, void 0, function* () {
              var _a;
              const id = this.mirror.getId(canvas);
              if (snapshotInProgressMap.get(id))
                return;
              if (canvas.width === 0 || canvas.height === 0)
                return;
              snapshotInProgressMap.set(id, true);
              if (["webgl", "webgl2"].includes(canvas.__context)) {
                const context = canvas.getContext(canvas.__context);
                if (((_a = context === null || context === void 0 ? void 0 : context.getContextAttributes()) === null || _a === void 0 ? void 0 : _a.preserveDrawingBuffer) === false) {
                  context.clear(context.COLOR_BUFFER_BIT);
                }
              }
              const bitmap = yield createImageBitmap(canvas);
              worker.postMessage({
                id,
                bitmap,
                width: canvas.width,
                height: canvas.height,
                dataURLOptions: options.dataURLOptions
              }, [bitmap]);
            }));
            rafId = requestAnimationFrame(takeCanvasSnapshots);
          };
          rafId = requestAnimationFrame(takeCanvasSnapshots);
          this.resetObservers = () => {
            canvasContextReset();
            cancelAnimationFrame(rafId);
          };
        }
        initCanvasMutationObserver(win2, blockClass, blockSelector) {
          this.startRAFTimestamping();
          this.startPendingCanvasMutationFlusher();
          const canvasContextReset = initCanvasContextObserver(win2, blockClass, blockSelector, false);
          const canvas2DReset = initCanvas2DMutationObserver(this.processMutation.bind(this), win2, blockClass, blockSelector);
          const canvasWebGL1and2Reset = initCanvasWebGLMutationObserver(this.processMutation.bind(this), win2, blockClass, blockSelector, this.mirror);
          this.resetObservers = () => {
            canvasContextReset();
            canvas2DReset();
            canvasWebGL1and2Reset();
          };
        }
        startPendingCanvasMutationFlusher() {
          requestAnimationFrame(() => this.flushPendingCanvasMutations());
        }
        startRAFTimestamping() {
          const setLatestRAFTimestamp = (timestamp) => {
            this.rafStamps.latestId = timestamp;
            requestAnimationFrame(setLatestRAFTimestamp);
          };
          requestAnimationFrame(setLatestRAFTimestamp);
        }
        flushPendingCanvasMutations() {
          this.pendingCanvasMutations.forEach((values, canvas) => {
            const id = this.mirror.getId(canvas);
            this.flushPendingCanvasMutationFor(canvas, id);
          });
          requestAnimationFrame(() => this.flushPendingCanvasMutations());
        }
        flushPendingCanvasMutationFor(canvas, id) {
          if (this.frozen || this.locked) {
            return;
          }
          const valuesWithType = this.pendingCanvasMutations.get(canvas);
          if (!valuesWithType || id === -1)
            return;
          const values = valuesWithType.map((value) => {
            const rest = __rest(value, ["type"]);
            return rest;
          });
          const { type } = valuesWithType[0];
          this.mutationCb({ id, type, commands: values });
          this.pendingCanvasMutations.delete(canvas);
        }
      };
      var StylesheetManager = class {
        constructor(options) {
          this.trackedLinkElements = /* @__PURE__ */ new WeakSet();
          this.styleMirror = new StyleSheetMirror();
          this.mutationCb = options.mutationCb;
          this.adoptedStyleSheetCb = options.adoptedStyleSheetCb;
        }
        attachLinkElement(linkEl, childSn) {
          if ("_cssText" in childSn.attributes)
            this.mutationCb({
              adds: [],
              removes: [],
              texts: [],
              attributes: [
                {
                  id: childSn.id,
                  attributes: childSn.attributes
                }
              ]
            });
          this.trackLinkElement(linkEl);
        }
        trackLinkElement(linkEl) {
          if (this.trackedLinkElements.has(linkEl))
            return;
          this.trackedLinkElements.add(linkEl);
          this.trackStylesheetInLinkElement(linkEl);
        }
        adoptStyleSheets(sheets, hostId) {
          if (sheets.length === 0)
            return;
          const adoptedStyleSheetData = {
            id: hostId,
            styleIds: []
          };
          const styles = [];
          for (const sheet of sheets) {
            let styleId;
            if (!this.styleMirror.has(sheet)) {
              styleId = this.styleMirror.add(sheet);
              styles.push({
                styleId,
                rules: Array.from(sheet.rules || CSSRule, (r, index) => ({
                  rule: stringifyRule(r),
                  index
                }))
              });
            } else
              styleId = this.styleMirror.getId(sheet);
            adoptedStyleSheetData.styleIds.push(styleId);
          }
          if (styles.length > 0)
            adoptedStyleSheetData.styles = styles;
          this.adoptedStyleSheetCb(adoptedStyleSheetData);
        }
        reset() {
          this.styleMirror.reset();
          this.trackedLinkElements = /* @__PURE__ */ new WeakSet();
        }
        trackStylesheetInLinkElement(linkEl) {
        }
      };
      var ProcessedNodeManager = class {
        constructor() {
          this.nodeMap = /* @__PURE__ */ new WeakMap();
          this.loop = true;
          this.periodicallyClear();
        }
        periodicallyClear() {
          requestAnimationFrame(() => {
            this.clear();
            if (this.loop)
              this.periodicallyClear();
          });
        }
        inOtherBuffer(node, thisBuffer) {
          const buffers = this.nodeMap.get(node);
          return buffers && Array.from(buffers).some((buffer) => buffer !== thisBuffer);
        }
        add(node, buffer) {
          this.nodeMap.set(node, (this.nodeMap.get(node) || /* @__PURE__ */ new Set()).add(buffer));
        }
        clear() {
          this.nodeMap = /* @__PURE__ */ new WeakMap();
        }
        destroy() {
          this.loop = false;
        }
      };
      function wrapEvent(e) {
        return Object.assign(Object.assign({}, e), { timestamp: nowTimestamp() });
      }
      var wrappedEmit;
      var takeFullSnapshot;
      var canvasManager;
      var recording = false;
      var mirror = createMirror();
      function record(options = {}) {
        const { emit, checkoutEveryNms, checkoutEveryNth, blockClass = "rr-block", blockSelector = null, ignoreClass = "rr-ignore", ignoreSelector = null, maskTextClass = "rr-mask", maskTextSelector = null, inlineStylesheet = true, maskAllInputs, maskInputOptions: _maskInputOptions, slimDOMOptions: _slimDOMOptions, maskInputFn, maskTextFn, hooks, packFn, sampling = {}, dataURLOptions = {}, mousemoveWait, recordDOM = true, recordCanvas = false, recordCrossOriginIframes = false, recordAfter = options.recordAfter === "DOMContentLoaded" ? options.recordAfter : "load", userTriggeredOnInput = false, collectFonts = false, inlineImages = false, plugins, keepIframeSrcFn = () => false, ignoreCSSAttributes = /* @__PURE__ */ new Set([]), errorHandler: errorHandler2 } = options;
        registerErrorHandler(errorHandler2);
        const inEmittingFrame = recordCrossOriginIframes ? window.parent === window : true;
        let passEmitsToParent = false;
        if (!inEmittingFrame) {
          try {
            if (window.parent.document) {
              passEmitsToParent = false;
            }
          } catch (e) {
            passEmitsToParent = true;
          }
        }
        if (inEmittingFrame && !emit) {
          throw new Error("emit function is required");
        }
        if (mousemoveWait !== void 0 && sampling.mousemove === void 0) {
          sampling.mousemove = mousemoveWait;
        }
        mirror.reset();
        const maskInputOptions = maskAllInputs === true ? {
          color: true,
          date: true,
          "datetime-local": true,
          email: true,
          month: true,
          number: true,
          range: true,
          search: true,
          tel: true,
          text: true,
          time: true,
          url: true,
          week: true,
          textarea: true,
          select: true,
          password: true
        } : _maskInputOptions !== void 0 ? _maskInputOptions : { password: true };
        const slimDOMOptions = _slimDOMOptions === true || _slimDOMOptions === "all" ? {
          script: true,
          comment: true,
          headFavicon: true,
          headWhitespace: true,
          headMetaSocial: true,
          headMetaRobots: true,
          headMetaHttpEquiv: true,
          headMetaVerification: true,
          headMetaAuthorship: _slimDOMOptions === "all",
          headMetaDescKeywords: _slimDOMOptions === "all"
        } : _slimDOMOptions ? _slimDOMOptions : {};
        polyfill();
        let lastFullSnapshotEvent;
        let incrementalSnapshotCount = 0;
        const eventProcessor = (e) => {
          for (const plugin of plugins || []) {
            if (plugin.eventProcessor) {
              e = plugin.eventProcessor(e);
            }
          }
          if (packFn && !passEmitsToParent) {
            e = packFn(e);
          }
          return e;
        };
        wrappedEmit = (e, isCheckout) => {
          var _a;
          if (((_a = mutationBuffers[0]) === null || _a === void 0 ? void 0 : _a.isFrozen()) && e.type !== EventType$1.FullSnapshot && !(e.type === EventType$1.IncrementalSnapshot && e.data.source === IncrementalSource$1.Mutation)) {
            mutationBuffers.forEach((buf) => buf.unfreeze());
          }
          if (inEmittingFrame) {
            emit === null || emit === void 0 ? void 0 : emit(eventProcessor(e), isCheckout);
          } else if (passEmitsToParent) {
            const message = {
              type: "rrweb",
              event: eventProcessor(e),
              origin: window.location.origin,
              isCheckout
            };
            window.parent.postMessage(message, "*");
          }
          if (e.type === EventType$1.FullSnapshot) {
            lastFullSnapshotEvent = e;
            incrementalSnapshotCount = 0;
          } else if (e.type === EventType$1.IncrementalSnapshot) {
            if (e.data.source === IncrementalSource$1.Mutation && e.data.isAttachIframe) {
              return;
            }
            incrementalSnapshotCount++;
            const exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth;
            const exceedTime = checkoutEveryNms && e.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;
            if (exceedCount || exceedTime) {
              takeFullSnapshot(true);
            }
          }
        };
        const wrappedMutationEmit = (m) => {
          wrappedEmit(wrapEvent({
            type: EventType$1.IncrementalSnapshot,
            data: Object.assign({ source: IncrementalSource$1.Mutation }, m)
          }));
        };
        const wrappedScrollEmit = (p) => wrappedEmit(wrapEvent({
          type: EventType$1.IncrementalSnapshot,
          data: Object.assign({ source: IncrementalSource$1.Scroll }, p)
        }));
        const wrappedCanvasMutationEmit = (p) => wrappedEmit(wrapEvent({
          type: EventType$1.IncrementalSnapshot,
          data: Object.assign({ source: IncrementalSource$1.CanvasMutation }, p)
        }));
        const wrappedAdoptedStyleSheetEmit = (a) => wrappedEmit(wrapEvent({
          type: EventType$1.IncrementalSnapshot,
          data: Object.assign({ source: IncrementalSource$1.AdoptedStyleSheet }, a)
        }));
        const stylesheetManager = new StylesheetManager({
          mutationCb: wrappedMutationEmit,
          adoptedStyleSheetCb: wrappedAdoptedStyleSheetEmit
        });
        const iframeManager = new IframeManager({
          mirror,
          mutationCb: wrappedMutationEmit,
          stylesheetManager,
          recordCrossOriginIframes,
          wrappedEmit
        });
        for (const plugin of plugins || []) {
          if (plugin.getMirror)
            plugin.getMirror({
              nodeMirror: mirror,
              crossOriginIframeMirror: iframeManager.crossOriginIframeMirror,
              crossOriginIframeStyleMirror: iframeManager.crossOriginIframeStyleMirror
            });
        }
        const processedNodeManager = new ProcessedNodeManager();
        canvasManager = new CanvasManager({
          recordCanvas,
          mutationCb: wrappedCanvasMutationEmit,
          win: window,
          blockClass,
          blockSelector,
          mirror,
          sampling: sampling.canvas,
          dataURLOptions
        });
        const shadowDomManager = new ShadowDomManager({
          mutationCb: wrappedMutationEmit,
          scrollCb: wrappedScrollEmit,
          bypassOptions: {
            blockClass,
            blockSelector,
            maskTextClass,
            maskTextSelector,
            inlineStylesheet,
            maskInputOptions,
            dataURLOptions,
            maskTextFn,
            maskInputFn,
            recordCanvas,
            inlineImages,
            sampling,
            slimDOMOptions,
            iframeManager,
            stylesheetManager,
            canvasManager,
            keepIframeSrcFn,
            processedNodeManager
          },
          mirror
        });
        takeFullSnapshot = (isCheckout = false) => {
          if (!recordDOM) {
            return;
          }
          wrappedEmit(wrapEvent({
            type: EventType$1.Meta,
            data: {
              href: window.location.href,
              width: getWindowWidth(),
              height: getWindowHeight()
            }
          }), isCheckout);
          stylesheetManager.reset();
          shadowDomManager.init();
          mutationBuffers.forEach((buf) => buf.lock());
          const node = snapshot(document, {
            mirror,
            blockClass,
            blockSelector,
            maskTextClass,
            maskTextSelector,
            inlineStylesheet,
            maskAllInputs: maskInputOptions,
            maskTextFn,
            slimDOM: slimDOMOptions,
            dataURLOptions,
            recordCanvas,
            inlineImages,
            onSerialize: (n) => {
              if (isSerializedIframe(n, mirror)) {
                iframeManager.addIframe(n);
              }
              if (isSerializedStylesheet(n, mirror)) {
                stylesheetManager.trackLinkElement(n);
              }
              if (hasShadowRoot(n)) {
                shadowDomManager.addShadowRoot(n.shadowRoot, document);
              }
            },
            onIframeLoad: (iframe, childSn) => {
              iframeManager.attachIframe(iframe, childSn);
              shadowDomManager.observeAttachShadow(iframe);
            },
            onStylesheetLoad: (linkEl, childSn) => {
              stylesheetManager.attachLinkElement(linkEl, childSn);
            },
            keepIframeSrcFn
          });
          if (!node) {
            return console.warn("Failed to snapshot the document");
          }
          wrappedEmit(wrapEvent({
            type: EventType$1.FullSnapshot,
            data: {
              node,
              initialOffset: getWindowScroll(window)
            }
          }), isCheckout);
          mutationBuffers.forEach((buf) => buf.unlock());
          if (document.adoptedStyleSheets && document.adoptedStyleSheets.length > 0)
            stylesheetManager.adoptStyleSheets(document.adoptedStyleSheets, mirror.getId(document));
        };
        try {
          const handlers = [];
          const observe = (doc) => {
            var _a;
            return callbackWrapper(initObservers)({
              mutationCb: wrappedMutationEmit,
              mousemoveCb: (positions, source) => wrappedEmit(wrapEvent({
                type: EventType$1.IncrementalSnapshot,
                data: {
                  source,
                  positions
                }
              })),
              mouseInteractionCb: (d) => wrappedEmit(wrapEvent({
                type: EventType$1.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource$1.MouseInteraction }, d)
              })),
              scrollCb: wrappedScrollEmit,
              viewportResizeCb: (d) => wrappedEmit(wrapEvent({
                type: EventType$1.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource$1.ViewportResize }, d)
              })),
              inputCb: (v) => wrappedEmit(wrapEvent({
                type: EventType$1.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource$1.Input }, v)
              })),
              mediaInteractionCb: (p) => wrappedEmit(wrapEvent({
                type: EventType$1.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource$1.MediaInteraction }, p)
              })),
              styleSheetRuleCb: (r) => wrappedEmit(wrapEvent({
                type: EventType$1.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource$1.StyleSheetRule }, r)
              })),
              styleDeclarationCb: (r) => wrappedEmit(wrapEvent({
                type: EventType$1.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource$1.StyleDeclaration }, r)
              })),
              canvasMutationCb: wrappedCanvasMutationEmit,
              fontCb: (p) => wrappedEmit(wrapEvent({
                type: EventType$1.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource$1.Font }, p)
              })),
              selectionCb: (p) => {
                wrappedEmit(wrapEvent({
                  type: EventType$1.IncrementalSnapshot,
                  data: Object.assign({ source: IncrementalSource$1.Selection }, p)
                }));
              },
              customElementCb: (c) => {
                wrappedEmit(wrapEvent({
                  type: EventType$1.IncrementalSnapshot,
                  data: Object.assign({ source: IncrementalSource$1.CustomElement }, c)
                }));
              },
              blockClass,
              ignoreClass,
              ignoreSelector,
              maskTextClass,
              maskTextSelector,
              maskInputOptions,
              inlineStylesheet,
              sampling,
              recordDOM,
              recordCanvas,
              inlineImages,
              userTriggeredOnInput,
              collectFonts,
              doc,
              maskInputFn,
              maskTextFn,
              keepIframeSrcFn,
              blockSelector,
              slimDOMOptions,
              dataURLOptions,
              mirror,
              iframeManager,
              stylesheetManager,
              shadowDomManager,
              processedNodeManager,
              canvasManager,
              ignoreCSSAttributes,
              plugins: ((_a = plugins === null || plugins === void 0 ? void 0 : plugins.filter((p) => p.observer)) === null || _a === void 0 ? void 0 : _a.map((p) => ({
                observer: p.observer,
                options: p.options,
                callback: (payload) => wrappedEmit(wrapEvent({
                  type: EventType$1.Plugin,
                  data: {
                    plugin: p.name,
                    payload
                  }
                }))
              }))) || []
            }, hooks);
          };
          iframeManager.addLoadListener((iframeEl) => {
            try {
              handlers.push(observe(iframeEl.contentDocument));
            } catch (error) {
              console.warn(error);
            }
          });
          const init = () => {
            takeFullSnapshot();
            handlers.push(observe(document));
            recording = true;
          };
          if (document.readyState === "interactive" || document.readyState === "complete") {
            init();
          } else {
            handlers.push(on("DOMContentLoaded", () => {
              wrappedEmit(wrapEvent({
                type: EventType$1.DomContentLoaded,
                data: {}
              }));
              if (recordAfter === "DOMContentLoaded")
                init();
            }));
            handlers.push(on("load", () => {
              wrappedEmit(wrapEvent({
                type: EventType$1.Load,
                data: {}
              }));
              if (recordAfter === "load")
                init();
            }, window));
          }
          return () => {
            handlers.forEach((h) => h());
            processedNodeManager.destroy();
            recording = false;
            unregisterErrorHandler();
          };
        } catch (error) {
          console.warn(error);
        }
      }
      record.addCustomEvent = (tag, payload) => {
        if (!recording) {
          throw new Error("please add custom event after start recording");
        }
        wrappedEmit(wrapEvent({
          type: EventType$1.Custom,
          data: {
            tag,
            payload
          }
        }));
      };
      record.freezePage = () => {
        mutationBuffers.forEach((buf) => buf.freeze());
      };
      record.takeFullSnapshot = (isCheckout) => {
        if (!recording) {
          throw new Error("please take full snapshot after start recording");
        }
        takeFullSnapshot(isCheckout);
      };
      record.mirror = mirror;
      var EventType = /* @__PURE__ */ ((EventType2) => {
        EventType2[EventType2["DomContentLoaded"] = 0] = "DomContentLoaded";
        EventType2[EventType2["Load"] = 1] = "Load";
        EventType2[EventType2["FullSnapshot"] = 2] = "FullSnapshot";
        EventType2[EventType2["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
        EventType2[EventType2["Meta"] = 4] = "Meta";
        EventType2[EventType2["Custom"] = 5] = "Custom";
        EventType2[EventType2["Plugin"] = 6] = "Plugin";
        return EventType2;
      })(EventType || {});
      var IncrementalSource = /* @__PURE__ */ ((IncrementalSource2) => {
        IncrementalSource2[IncrementalSource2["Mutation"] = 0] = "Mutation";
        IncrementalSource2[IncrementalSource2["MouseMove"] = 1] = "MouseMove";
        IncrementalSource2[IncrementalSource2["MouseInteraction"] = 2] = "MouseInteraction";
        IncrementalSource2[IncrementalSource2["Scroll"] = 3] = "Scroll";
        IncrementalSource2[IncrementalSource2["ViewportResize"] = 4] = "ViewportResize";
        IncrementalSource2[IncrementalSource2["Input"] = 5] = "Input";
        IncrementalSource2[IncrementalSource2["TouchMove"] = 6] = "TouchMove";
        IncrementalSource2[IncrementalSource2["MediaInteraction"] = 7] = "MediaInteraction";
        IncrementalSource2[IncrementalSource2["StyleSheetRule"] = 8] = "StyleSheetRule";
        IncrementalSource2[IncrementalSource2["CanvasMutation"] = 9] = "CanvasMutation";
        IncrementalSource2[IncrementalSource2["Font"] = 10] = "Font";
        IncrementalSource2[IncrementalSource2["Log"] = 11] = "Log";
        IncrementalSource2[IncrementalSource2["Drag"] = 12] = "Drag";
        IncrementalSource2[IncrementalSource2["StyleDeclaration"] = 13] = "StyleDeclaration";
        IncrementalSource2[IncrementalSource2["Selection"] = 14] = "Selection";
        IncrementalSource2[IncrementalSource2["AdoptedStyleSheet"] = 15] = "AdoptedStyleSheet";
        IncrementalSource2[IncrementalSource2["CustomElement"] = 16] = "CustomElement";
        return IncrementalSource2;
      })(IncrementalSource || {});
      var Config = {
        DEBUG: false,
        LIB_VERSION: "2.54.0"
      };
      var win;
      if (typeof window === "undefined") {
        loc = {
          hostname: ""
        };
        win = {
          navigator: { userAgent: "" },
          document: {
            location: loc,
            referrer: ""
          },
          screen: { width: 0, height: 0 },
          location: loc
        };
      } else {
        win = window;
      }
      var loc;
      var MAX_RECORDING_MS = 24 * 60 * 60 * 1e3;
      var ArrayProto = Array.prototype;
      var FuncProto = Function.prototype;
      var ObjProto = Object.prototype;
      var slice = ArrayProto.slice;
      var toString = ObjProto.toString;
      var hasOwnProperty = ObjProto.hasOwnProperty;
      var windowConsole = win.console;
      var navigator = win.navigator;
      var document$1 = win.document;
      var windowOpera = win.opera;
      var screen = win.screen;
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
      var console$1 = {
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
          return func.apply(console$1, arguments);
        };
      };
      var console_with_prefix = function(prefix) {
        return {
          log: log_func_with_prefix(console$1.log, prefix),
          error: log_func_with_prefix(console$1.error, prefix),
          critical: log_func_with_prefix(console$1.critical, prefix)
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
          var self2 = new ctor();
          ctor.prototype = null;
          var result = func.apply(self2, args.concat(slice.call(arguments)));
          if (Object(result) === result) {
            return result;
          }
          return self2;
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
          for (var i2 = 0, l = obj.length; i2 < l; i2++) {
            if (i2 in obj && iterator.call(context, obj[i2], i2, obj) === breaker) {
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
            var i2 = 0;
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
                  for (i2 = 0; i2 < length; i2 += 1) {
                    partial[i2] = str(i2, value2) || "null";
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
          var hex, i2, string2 = "", uffff;
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
                  for (i2 = 0; i2 < 4; i2 += 1) {
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
        var o1, o2, o3, h1, h2, h3, h4, bits, i2 = 0, ac = 0, enc = "", tmp_arr = [];
        if (!data) {
          return data;
        }
        data = _.utf8Encode(data);
        do {
          o1 = data.charCodeAt(i2++);
          o2 = data.charCodeAt(i2++);
          o3 = data.charCodeAt(i2++);
          bits = o1 << 16 | o2 << 8 | o3;
          h1 = bits >> 18 & 63;
          h2 = bits >> 12 & 63;
          h3 = bits >> 6 & 63;
          h4 = bits & 63;
          tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i2 < data.length);
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
          var time = 1 * new Date();
          var ticks;
          if (win.performance && win.performance.now) {
            ticks = win.performance.now();
          } else {
            ticks = 0;
            while (time == 1 * new Date()) {
              ticks++;
            }
          }
          return time.toString(16) + Math.floor(ticks).toString(16);
        };
        var R = function() {
          return Math.random().toString(16).replace(".", "");
        };
        var UA = function() {
          var ua = userAgent, i2, ch, buffer = [], ret = 0;
          function xor(result, byte_array) {
            var j, tmp = 0;
            for (j = 0; j < byte_array.length; j++) {
              tmp |= buffer[j] << j * 8;
            }
            return result ^ tmp;
          }
          for (i2 = 0; i2 < ua.length; i2++) {
            ch = ua.charCodeAt(i2);
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
        "ahrefssiteaudit",
        "baiduspider",
        "bingbot",
        "bingpreview",
        "chrome-lighthouse",
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
        var i2;
        ua = ua.toLowerCase();
        for (i2 = 0; i2 < BLOCKED_UA_STRS.length; i2++) {
          if (ua.indexOf(BLOCKED_UA_STRS[i2]) !== -1) {
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
            console$1.error("Skipping decoding for malformed query param: " + result);
          }
          return result.replace(/\+/g, " ");
        }
      };
      _.cookie = {
        get: function(name) {
          var nameEQ = name + "=";
          var ca = document$1.cookie.split(";");
          for (var i2 = 0; i2 < ca.length; i2++) {
            var c = ca[i2];
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
            console$1.error("localStorage unsupported; falling back to cookie store");
          }
          return supported;
        },
        error: function(msg) {
          console$1.error("localStorage error: " + msg);
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
            console$1.error("No valid element provided to register_event");
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
          var token, bits, tagName, found, foundCount, i2, j, k, elements, currentContextIndex;
          var currentContext = [document$1];
          for (i2 = 0; i2 < tokens.length; i2++) {
            token = tokens[i2].replace(/^\s+/, "").replace(/\s+$/, "");
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
      var CAMPAIGN_KEYWORDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
      var CLICK_IDS = ["dclid", "fbclid", "gclid", "ko_click_id", "li_fat_id", "msclkid", "ttclid", "twclid", "wbraid"];
      _.info = {
        campaignParams: function(default_value) {
          var kw = "", params = {};
          _.each(CAMPAIGN_KEYWORDS, function(kwkey) {
            kw = _.getQueryParam(document$1.URL, kwkey);
            if (kw.length) {
              params[kwkey] = kw;
            } else if (default_value !== void 0) {
              params[kwkey] = default_value;
            }
          });
          return params;
        },
        clickParams: function() {
          var id = "", params = {};
          _.each(CLICK_IDS, function(idkey) {
            id = _.getQueryParam(document$1.URL, idkey);
            if (id.length) {
              params[idkey] = id;
            }
          });
          return params;
        },
        marketingParams: function() {
          return _.extend(_.info.campaignParams(), _.info.clickParams());
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
        currentUrl: function() {
          return win.location.href;
        },
        properties: function(extra_props) {
          if (typeof extra_props !== "object") {
            extra_props = {};
          }
          return _.extend(_.strip_empty_properties({
            "$os": _.info.os(),
            "$browser": _.info.browser(userAgent, navigator.vendor, windowOpera),
            "$referrer": document$1.referrer,
            "$referring_domain": _.info.referringDomain(document$1.referrer),
            "$device": _.info.device(userAgent)
          }), {
            "$current_url": _.info.currentUrl(),
            "$browser_version": _.info.browserVersion(userAgent, navigator.vendor, windowOpera),
            "$screen_height": screen.height,
            "$screen_width": screen.width,
            "mp_lib": "web",
            "$lib_version": Config.LIB_VERSION,
            "$insert_id": cheap_guid(),
            "time": _.timestamp() / 1e3
          }, _.strip_empty_properties(extra_props));
        },
        people_properties: function() {
          return _.extend(_.strip_empty_properties({
            "$os": _.info.os(),
            "$browser": _.info.browser(userAgent, navigator.vendor, windowOpera)
          }), {
            "$browser_version": _.info.browserVersion(userAgent, navigator.vendor, windowOpera)
          });
        },
        mpPageViewProperties: function() {
          return _.strip_empty_properties({
            "current_page_title": document$1.title,
            "current_domain": win.location.hostname,
            "current_url_path": win.location.pathname,
            "current_url_protocol": win.location.protocol,
            "current_url_search": win.location.search
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
          console$1.warn('This browser has "Do Not Track" enabled. This will prevent the Mixpanel SDK from sending any data. To ignore the "Do Not Track" browser setting, initialize the Mixpanel instance with the config "ignore_dnt: true"');
          return true;
        }
        var optedOut = _getStorageValue(token, options) === "0";
        if (optedOut) {
          console$1.warn("You are opted out of Mixpanel tracking. This will prevent the Mixpanel SDK from sending any data.");
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
        var win$1 = options && options.window || win;
        var nav = win$1["navigator"] || {};
        var hasDntOn = false;
        _.each([
          nav["doNotTrack"],
          nav["msDoNotTrack"],
          win$1["doNotTrack"]
        ], function(dntValue) {
          if (_.includes([true, 1, "1", "yes"], dntValue)) {
            hasDntOn = true;
          }
        });
        return hasDntOn;
      }
      function _optInOut(optValue, token, options) {
        if (!_.isString(token) || !token.length) {
          console$1.error("gdpr." + (optValue ? "optIn" : "optOut") + " called with an invalid token");
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
            var win2 = getConfigValue.call(this, "window");
            if (token) {
              optedOut = hasOptedOut(token, {
                ignoreDnt,
                persistenceType,
                persistencePrefix,
                window: win2
              });
            }
          } catch (err) {
            console$1.error("Unexpected error when checking tracking opt-out status: " + err);
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
      var logger$3 = console_with_prefix("lock");
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
        var i2 = pid || new Date().getTime() + "|" + Math.random();
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
            logger$3.error("Timeout waiting for mutex on " + key + "; clearing lock. [" + i2 + "]");
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
          if (valY && valY !== i2) {
            return false;
          } else {
            storage.setItem(keyY, i2);
            if (storage.getItem(keyY) === i2) {
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
          storage.setItem(keyX, i2);
          waitFor(getSetY, function() {
            if (storage.getItem(keyX) === i2) {
              criticalSection();
              return;
            }
            delay(function() {
              if (storage.getItem(keyY) !== i2) {
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
            if (storage.getItem(keyY) === i2) {
              storage.removeItem(keyY);
            }
            if (storage.getItem(keyX) === i2) {
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
      var logger$2 = console_with_prefix("batch");
      var RequestQueue = function(storageKey, options) {
        options = options || {};
        this.storageKey = storageKey;
        this.storage = options.storage || window.localStorage;
        this.reportError = options.errorReporter || _.bind(logger$2.error, logger$2);
        this.lock = new SharedLock(storageKey, { storage: this.storage });
        this.usePersistence = options.usePersistence;
        this.pid = options.pid || null;
        this.memQueue = [];
      };
      RequestQueue.prototype.enqueue = function(item, flushInterval, cb) {
        var queueEntry = {
          "id": cheap_guid(),
          "flushAfter": new Date().getTime() + flushInterval * 2,
          "payload": item
        };
        if (!this.usePersistence) {
          this.memQueue.push(queueEntry);
          if (cb) {
            cb(true);
          }
        } else {
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
        }
      };
      RequestQueue.prototype.fillBatch = function(batchSize) {
        var batch = this.memQueue.slice(0, batchSize);
        if (this.usePersistence && batch.length < batchSize) {
          var storedQueue = this.readFromStorage();
          if (storedQueue.length) {
            var idsInBatch = {};
            _.each(batch, function(item2) {
              idsInBatch[item2["id"]] = true;
            });
            for (var i2 = 0; i2 < storedQueue.length; i2++) {
              var item = storedQueue[i2];
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
        if (!this.usePersistence) {
          if (cb) {
            cb(true);
          }
        } else {
          var removeFromStorage = _.bind(function() {
            var succeeded;
            try {
              var storedQueue = this.readFromStorage();
              storedQueue = filterOutIDsAndInvalid(storedQueue, idSet);
              succeeded = this.saveToStorage(storedQueue);
              if (succeeded) {
                storedQueue = this.readFromStorage();
                for (var i2 = 0; i2 < storedQueue.length; i2++) {
                  var item = storedQueue[i2];
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
        }
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
        if (!this.usePersistence) {
          if (cb) {
            cb(true);
          }
        } else {
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
        }
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
        if (this.usePersistence) {
          this.storage.removeItem(this.storageKey);
        }
      };
      var MAX_RETRY_INTERVAL_MS = 10 * 60 * 1e3;
      var logger$1 = console_with_prefix("batch");
      var RequestBatcher = function(storageKey, options) {
        this.errorReporter = options.errorReporter;
        this.queue = new RequestQueue(storageKey, {
          errorReporter: _.bind(this.reportError, this),
          storage: options.storage,
          usePersistence: options.usePersistence
        });
        this.libConfig = options.libConfig;
        this.sendRequest = options.sendRequestFunc;
        this.beforeSendHook = options.beforeSendHook;
        this.stopAllBatching = options.stopAllBatchingFunc;
        this.batchSize = this.libConfig["batch_size"];
        this.flushInterval = this.libConfig["batch_flush_interval_ms"];
        this.stopped = !this.libConfig["batch_autostart"];
        this.consecutiveRemovalFailures = 0;
        this.itemIdsSentSuccessfully = {};
        this.flushOnlyOnInterval = options.flushOnlyOnInterval || false;
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
            logger$1.log("Flush: Request already in progress");
            return;
          }
          options = options || {};
          var timeoutMS = this.libConfig["batch_request_timeout_ms"];
          var startTime = new Date().getTime();
          var currentBatchSize = this.batchSize;
          var batch = this.queue.fillBatch(currentBatchSize);
          var attemptSecondaryFlush = batch.length === currentBatchSize;
          var dataForRequest = [];
          var transformedItems = {};
          _.each(batch, function(item) {
            var payload = item["payload"];
            if (this.beforeSendHook && !item.orphaned) {
              payload = this.beforeSendHook(payload);
            }
            if (payload) {
              if (payload["event"] && payload["properties"]) {
                payload["properties"] = _.extend(
                  {},
                  payload["properties"],
                  { "mp_sent_by_lib_version": Config.LIB_VERSION }
                );
              }
              var addPayload = true;
              var itemId = item["id"];
              if (itemId) {
                if ((this.itemIdsSentSuccessfully[itemId] || 0) > 5) {
                  this.reportError("[dupe] item ID sent too many times, not sending", {
                    item,
                    batchSize: batch.length,
                    timesSent: this.itemIdsSentSuccessfully[itemId]
                  });
                  addPayload = false;
                }
              } else {
                this.reportError("[dupe] found item with no ID", { item });
              }
              if (addPayload) {
                dataForRequest.push(payload);
              }
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
              } else if (_.isObject(res) && (res.httpStatusCode >= 500 || res.httpStatusCode === 429 || res.error === "timeout")) {
                var retryMS = this.flushInterval * 2;
                if (res.retryAfter) {
                  retryMS = parseInt(res.retryAfter, 10) * 1e3 || retryMS;
                }
                retryMS = Math.min(MAX_RETRY_INTERVAL_MS, retryMS);
                this.reportError("Error; retry in " + retryMS + " ms");
                this.scheduleFlush(retryMS);
              } else if (_.isObject(res) && res.httpStatusCode === 413) {
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
                      if (this.flushOnlyOnInterval && !attemptSecondaryFlush) {
                        this.resetFlush();
                      } else {
                        this.flush();
                      }
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
                _.each(batch, _.bind(function(item) {
                  var itemId = item["id"];
                  if (itemId) {
                    this.itemIdsSentSuccessfully[itemId] = this.itemIdsSentSuccessfully[itemId] || 0;
                    this.itemIdsSentSuccessfully[itemId]++;
                    if (this.itemIdsSentSuccessfully[itemId] > 5) {
                      this.reportError("[dupe] item ID sent too many times", {
                        item,
                        batchSize: batch.length,
                        timesSent: this.itemIdsSentSuccessfully[itemId]
                      });
                    }
                  } else {
                    this.reportError("[dupe] found item with no ID while removing", { item });
                  }
                }, this));
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
          logger$1.log("MIXPANEL REQUEST:", dataForRequest);
          this.sendRequest(dataForRequest, requestOptions, batchSendCallback);
        } catch (err) {
          this.reportError("Error flushing request queue", err);
          this.resetFlush();
        }
      };
      RequestBatcher.prototype.reportError = function(msg, err) {
        logger$1.error.apply(logger$1.error, arguments);
        if (this.errorReporter) {
          try {
            if (!(err instanceof Error)) {
              err = new Error(msg);
            }
            this.errorReporter(msg, err);
          } catch (err2) {
            logger$1.error(err2);
          }
        }
      };
      var logger = console_with_prefix("recorder");
      var CompressionStream = win["CompressionStream"];
      var RECORDER_BATCHER_LIB_CONFIG = {
        "batch_size": 1e3,
        "batch_flush_interval_ms": 10 * 1e3,
        "batch_request_timeout_ms": 90 * 1e3,
        "batch_autostart": true
      };
      var ACTIVE_SOURCES = /* @__PURE__ */ new Set([
        IncrementalSource.MouseMove,
        IncrementalSource.MouseInteraction,
        IncrementalSource.Scroll,
        IncrementalSource.ViewportResize,
        IncrementalSource.Input,
        IncrementalSource.TouchMove,
        IncrementalSource.MediaInteraction,
        IncrementalSource.Drag,
        IncrementalSource.Selection
      ]);
      function isUserEvent(ev) {
        return ev.type === EventType.IncrementalSnapshot && ACTIVE_SOURCES.has(ev.source);
      }
      var MixpanelRecorder = function(mixpanelInstance) {
        this._mixpanel = mixpanelInstance;
        this._stopRecording = null;
        this.recEvents = [];
        this.seqNo = 0;
        this.replayId = null;
        this.replayStartTime = null;
        this.sendBatchId = null;
        this.idleTimeoutId = null;
        this.maxTimeoutId = null;
        this.recordMaxMs = MAX_RECORDING_MS;
        this._initBatcher();
      };
      MixpanelRecorder.prototype._initBatcher = function() {
        this.batcher = new RequestBatcher("__mprec", {
          libConfig: RECORDER_BATCHER_LIB_CONFIG,
          sendRequestFunc: _.bind(this.flushEventsWithOptOut, this),
          errorReporter: _.bind(this.reportError, this),
          flushOnlyOnInterval: true,
          usePersistence: false
        });
      };
      MixpanelRecorder.prototype.get_config = function(configVar) {
        return this._mixpanel.get_config(configVar);
      };
      MixpanelRecorder.prototype.startRecording = function() {
        if (this._stopRecording !== null) {
          logger.log("Recording already in progress, skipping startRecording.");
          return;
        }
        this.recordMaxMs = this.get_config("record_max_ms");
        if (this.recordMaxMs > MAX_RECORDING_MS) {
          this.recordMaxMs = MAX_RECORDING_MS;
          logger.critical("record_max_ms cannot be greater than " + MAX_RECORDING_MS + "ms. Capping value.");
        }
        this.recEvents = [];
        this.seqNo = 0;
        this.replayStartTime = null;
        this.replayId = _.UUID();
        this.batcher.start();
        var resetIdleTimeout = _.bind(function() {
          clearTimeout(this.idleTimeoutId);
          this.idleTimeoutId = setTimeout(_.bind(function() {
            logger.log("Idle timeout reached, restarting recording.");
            this.resetRecording();
          }, this), this.get_config("record_idle_timeout_ms"));
        }, this);
        this._stopRecording = record({
          "emit": _.bind(function(ev) {
            this.batcher.enqueue(ev);
            if (isUserEvent(ev)) {
              resetIdleTimeout();
            }
          }, this),
          "blockClass": this.get_config("record_block_class"),
          "blockSelector": this.get_config("record_block_selector"),
          "collectFonts": this.get_config("record_collect_fonts"),
          "inlineImages": this.get_config("record_inline_images"),
          "maskAllInputs": true,
          "maskTextClass": this.get_config("record_mask_text_class"),
          "maskTextSelector": this.get_config("record_mask_text_selector")
        });
        resetIdleTimeout();
        this.maxTimeoutId = setTimeout(_.bind(this.resetRecording, this), this.recordMaxMs);
      };
      MixpanelRecorder.prototype.resetRecording = function() {
        this.stopRecording();
        this.startRecording();
      };
      MixpanelRecorder.prototype.stopRecording = function() {
        if (this._stopRecording !== null) {
          this._stopRecording();
          this._stopRecording = null;
        }
        this.batcher.flush();
        this.replayId = null;
        clearTimeout(this.idleTimeoutId);
        clearTimeout(this.maxTimeoutId);
      };
      MixpanelRecorder.prototype.flushEventsWithOptOut = function(data, options, cb) {
        this._flushEvents(data, options, cb, _.bind(this._onOptOut, this));
      };
      MixpanelRecorder.prototype._onOptOut = function(code) {
        if (code === 0) {
          this.recEvents = [];
          this.stopRecording();
        }
      };
      MixpanelRecorder.prototype._sendRequest = function(reqParams, reqBody, callback) {
        var onSuccess = _.bind(function(response, responseBody) {
          if (response.status === 200) {
            this.seqNo++;
          }
          callback({
            status: 0,
            httpStatusCode: response.status,
            responseBody,
            retryAfter: response.headers.get("Retry-After")
          });
        }, this);
        win["fetch"](this.get_config("api_host") + "/" + this.get_config("api_routes")["record"] + "?" + new URLSearchParams(reqParams), {
          "method": "POST",
          "headers": {
            "Authorization": "Basic " + btoa(this.get_config("token") + ":"),
            "Content-Type": "application/octet-stream"
          },
          "body": reqBody
        }).then(function(response) {
          response.json().then(function(responseBody) {
            onSuccess(response, responseBody);
          }).catch(function(error) {
            callback({ error });
          });
        }).catch(function(error) {
          callback({ error });
        });
      };
      MixpanelRecorder.prototype._flushEvents = addOptOutCheckMixpanelLib(function(data, options, callback) {
        const numEvents = data.length;
        if (numEvents > 0) {
          var batchStartTime = data[0].timestamp;
          if (this.seqNo === 0) {
            this.replayStartTime = batchStartTime;
          }
          var replayLengthMs = data[numEvents - 1].timestamp - this.replayStartTime;
          var reqParams = {
            "distinct_id": String(this._mixpanel.get_distinct_id()),
            "seq": this.seqNo,
            "batch_start_time": batchStartTime / 1e3,
            "replay_id": this.replayId,
            "replay_length_ms": replayLengthMs,
            "replay_start_time": this.replayStartTime / 1e3
          };
          var eventsJson = _.JSONEncode(data);
          var deviceId = this._mixpanel.get_property("$device_id");
          if (deviceId) {
            reqParams["$device_id"] = deviceId;
          }
          var userId = this._mixpanel.get_property("$user_id");
          if (userId) {
            reqParams["$user_id"] = userId;
          }
          if (CompressionStream) {
            var jsonStream = new Blob([eventsJson], { type: "application/json" }).stream();
            var gzipStream = jsonStream.pipeThrough(new CompressionStream("gzip"));
            new Response(gzipStream).blob().then(_.bind(function(compressedBlob) {
              reqParams["format"] = "gzip";
              this._sendRequest(reqParams, compressedBlob, callback);
            }, this));
          } else {
            reqParams["format"] = "body";
            this._sendRequest(reqParams, eventsJson, callback);
          }
        }
      });
      MixpanelRecorder.prototype.reportError = function(msg, err) {
        logger.error.apply(logger.error, arguments);
        try {
          if (!err && !(msg instanceof Error)) {
            msg = new Error(msg);
          }
          this.get_config("error_reporter")(msg, err);
        } catch (err2) {
          logger.error(err2);
        }
      };
      win["__mp_recorder"] = MixpanelRecorder;
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
          console$1.error("The DOM query (" + query + ") returned 0 elements");
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
          endpoint: this._get_config("api_host") + "/" + this._get_config("api_routes")["groups"],
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
                console$1.error("Invalid increment value passed to mixpanel.people.increment - must be a number");
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
            console$1.error("Invalid value passed to mixpanel.people.track_charge - must be a number");
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
          console$1.error("mixpanel.people.delete_user() requires you to call identify() first");
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
          endpoint: this._get_config("api_host") + "/" + this._get_config("api_routes")["engage"],
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
          console$1.error("Invalid call to _enqueue():", data);
        }
      };
      MixpanelPeople.prototype._flush_one_queue = function(action, action_method, callback, queue_to_params_fn) {
        var _this = this;
        var queued_data = _.extend({}, this._mixpanel["persistence"].load_queue(action));
        var action_params = queued_data;
        if (!_.isUndefined(queued_data) && _.isObject(queued_data) && !_.isEmptyObject(queued_data)) {
          _this._mixpanel["persistence"]._pop_from_people_queue(action, queued_data);
          _this._mixpanel["persistence"].save();
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
        this._flush_one_queue(SET_ACTION, this.set, _set_callback);
        this._flush_one_queue(SET_ONCE_ACTION, this.set_once, _set_once_callback);
        this._flush_one_queue(UNSET_ACTION, this.unset, _unset_callback, function(queue) {
          return _.keys(queue);
        });
        this._flush_one_queue(ADD_ACTION, this.increment, _add_callback);
        this._flush_one_queue(UNION_ACTION, this.union, _union_callback);
        var $append_queue = this._mixpanel["persistence"].load_queue(APPEND_ACTION);
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
          for (var i2 = $append_queue.length - 1; i2 >= 0; i2--) {
            $append_queue = this._mixpanel["persistence"].load_queue(APPEND_ACTION);
            $append_item = $append_queue.pop();
            _this._mixpanel["persistence"].save();
            if (!_.isEmptyObject($append_item)) {
              _this.append($append_item, append_callback);
            }
          }
        }
        var $remove_queue = this._mixpanel["persistence"].load_queue(REMOVE_ACTION);
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
            $remove_queue = this._mixpanel["persistence"].load_queue(REMOVE_ACTION);
            $remove_item = $remove_queue.pop();
            _this._mixpanel["persistence"].save();
            if (!_.isEmptyObject($remove_item)) {
              _this.remove($remove_item, remove_callback);
            }
          }
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
          console$1.critical("Unknown persistence type " + storage_type + "; falling back to cookie");
          storage_type = config["persistence"] = "cookie";
        }
        if (storage_type === "localStorage" && _.localStorage.is_supported()) {
          this.storage = _.localStorage;
        } else {
          this.storage = _.cookie;
        }
        this.load();
        this.update_config(config);
        this.upgrade();
        this.save();
      };
      MixpanelPersistence.prototype.properties = function() {
        var p = {};
        this.load();
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
      MixpanelPersistence.prototype.upgrade = function() {
        var old_cookie, old_localstorage;
        if (this.storage === _.localStorage) {
          old_cookie = _.cookie.parse(this.name);
          _.cookie.remove(this.name);
          _.cookie.remove(this.name, true);
          if (old_cookie) {
            this.register_once(old_cookie);
          }
        } else if (this.storage === _.cookie) {
          old_localstorage = _.localStorage.parse(this.name);
          _.localStorage.remove(this.name);
          if (old_localstorage) {
            this.register_once(old_localstorage);
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
      MixpanelPersistence.prototype.load_prop = function(key) {
        this.load();
        return this["props"][key];
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
          this.load();
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
          this.load();
          _.extend(this["props"], props);
          this.save();
          return true;
        }
        return false;
      };
      MixpanelPersistence.prototype.unregister = function(prop) {
        this.load();
        if (prop in this["props"]) {
          delete this["props"][prop];
          this.save();
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
        console$1.log("MIXPANEL PEOPLE REQUEST (QUEUED, PENDING IDENTIFY):");
        console$1.log(data);
        this.save();
      };
      MixpanelPersistence.prototype._pop_from_people_queue = function(queue, data) {
        var q = this["props"][this._get_queue_key(queue)];
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
        }
      };
      MixpanelPersistence.prototype.load_queue = function(queue) {
        return this.load_prop(this._get_queue_key(queue));
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
          console$1.error("Invalid queue:", queue);
        }
      };
      MixpanelPersistence.prototype._get_or_create_queue = function(queue, default_val) {
        var key = this._get_queue_key(queue);
        default_val = _.isUndefined(default_val) ? {} : default_val;
        return this["props"][key] || (this["props"][key] = default_val);
      };
      MixpanelPersistence.prototype.set_event_timer = function(event_name, timestamp) {
        var timers = this.load_prop(EVENT_TIMERS_KEY) || {};
        timers[event_name] = timestamp;
        this["props"][EVENT_TIMERS_KEY] = timers;
        this.save();
      };
      MixpanelPersistence.prototype.remove_event_timer = function(event_name) {
        var timers = this.load_prop(EVENT_TIMERS_KEY) || {};
        var timestamp = timers[event_name];
        if (!_.isUndefined(timestamp)) {
          delete this["props"][EVENT_TIMERS_KEY][event_name];
          this.save();
        }
        return timestamp;
      };
      var init_type;
      var load_extra_bundle = function(src, _onload) {
        throw new Error(src + " not available in this build.");
      };
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
      var DEVICE_ID_PREFIX = "$device:";
      var USE_XHR = win.XMLHttpRequest && "withCredentials" in new XMLHttpRequest();
      var ENQUEUE_REQUESTS = !USE_XHR && userAgent.indexOf("MSIE") === -1 && userAgent.indexOf("Mozilla") === -1;
      var sendBeacon = null;
      if (navigator["sendBeacon"]) {
        sendBeacon = function() {
          return navigator["sendBeacon"].apply(navigator, arguments);
        };
      }
      var DEFAULT_API_ROUTES = {
        "track": "track/",
        "engage": "engage/",
        "groups": "groups/",
        "record": "record/"
      };
      var DEFAULT_CONFIG = {
        "api_host": "https://api-js.mixpanel.com",
        "api_routes": DEFAULT_API_ROUTES,
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
        "mp_loader": null,
        "track_marketing": true,
        "track_pageview": false,
        "skip_first_touch_marketing": false,
        "store_google": true,
        "stop_utm_persistence": false,
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
        "hooks": {},
        "record_block_class": new RegExp("^(mp-block|fs-exclude|amp-block|rr-block|ph-no-capture)$"),
        "record_block_selector": "img, video",
        "record_collect_fonts": false,
        "record_idle_timeout_ms": 30 * 60 * 1e3,
        "record_inline_images": false,
        "record_mask_text_class": new RegExp("^(mp-mask|fs-mask|amp-mask|rr-mask|ph-mask)$"),
        "record_mask_text_selector": "*",
        "record_max_ms": MAX_RECORDING_MS,
        "record_sessions_percent": 0,
        "recorder_src": "https://cdn.mxpnl.com/libs/mixpanel-recorder.min.js"
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
            console$1.error("You have already initialized " + name);
            return;
          }
          instance = new MixpanelLib();
        }
        instance._cached_groups = {};
        instance._init(token, config, name);
        instance["people"] = new MixpanelPeople();
        instance["people"]._init(instance);
        if (!instance.get_config("skip_first_touch_marketing")) {
          var utm_params = _.info.campaignParams(null);
          var initial_utm_params = {};
          var has_utm = false;
          _.each(utm_params, function(utm_value, utm_key) {
            initial_utm_params["initial_" + utm_key] = utm_value;
            if (utm_value) {
              has_utm = true;
            }
          });
          if (has_utm) {
            instance["people"].set_once(initial_utm_params);
          }
        }
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
          if (api_host.match(/\.mixpanel\.com/)) {
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
            console$1.log("Turning off Mixpanel request-queueing; needs XHR and localStorage support");
            _.each(this.get_batcher_configs(), function(batcher_config) {
              console$1.log("Clearing batch queue " + batcher_config.queue_key);
              _.localStorage.remove(batcher_config.queue_key);
            });
          } else {
            this.init_batchers();
            if (sendBeacon && win.addEventListener) {
              var flush_on_unload = _.bind(function() {
                if (!this.request_batchers.events.stopped) {
                  this.request_batchers.events.flush({ unloading: true });
                }
              }, this);
              win.addEventListener("pagehide", function(ev) {
                if (ev["persisted"]) {
                  flush_on_unload();
                }
              });
              win.addEventListener("visibilitychange", function() {
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
            "distinct_id": DEVICE_ID_PREFIX + uuid,
            "$device_id": uuid
          }, "");
        }
        var track_pageview_option = this.get_config("track_pageview");
        if (track_pageview_option) {
          this._init_url_change_tracking(track_pageview_option);
        }
        if (this.get_config("record_sessions_percent") > 0 && Math.random() * 100 <= this.get_config("record_sessions_percent")) {
          this.start_session_recording();
        }
      };
      MixpanelLib.prototype.start_session_recording = addOptOutCheckMixpanelLib(function() {
        if (!win["MutationObserver"]) {
          console$1.critical("Browser does not support MutationObserver; skipping session recording");
          return;
        }
        var handleLoadedRecorder = _.bind(function() {
          this._recorder = this._recorder || new win["__mp_recorder"](this);
          this._recorder["startRecording"]();
        }, this);
        if (_.isUndefined(win["__mp_recorder"])) {
          load_extra_bundle(this.get_config("recorder_src"), handleLoadedRecorder);
        } else {
          handleLoadedRecorder();
        }
      });
      MixpanelLib.prototype.stop_session_recording = function() {
        if (this._recorder) {
          this._recorder["stopRecording"]();
        } else {
          console$1.critical("Session recorder module not loaded");
        }
      };
      MixpanelLib.prototype.get_session_recording_properties = function() {
        var props = {};
        if (this._recorder) {
          var replay_id = this._recorder["replayId"];
          if (replay_id) {
            props["$mp_replay_id"] = replay_id;
          }
        }
        return props;
      };
      MixpanelLib.prototype._loaded = function() {
        this.get_config("loaded")(this);
        this._set_default_superprops();
        this["people"].set_once(this["persistence"].get_referrer_info());
        if (this.get_config("store_google") && this.get_config("stop_utm_persistence")) {
          var utm_params = _.info.campaignParams(null);
          _.each(utm_params, function(_utm_value, utm_key) {
            this.unregister(utm_key);
          }.bind(this));
        }
      };
      MixpanelLib.prototype._set_default_superprops = function() {
        this["persistence"].update_search_keyword(document$1.referrer);
        if (this.get_config("store_google") && !this.get_config("stop_utm_persistence")) {
          this.register(_.info.campaignParams());
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
      MixpanelLib.prototype._init_url_change_tracking = function(track_pageview_option) {
        var previous_tracked_url = "";
        var tracked = this.track_pageview();
        if (tracked) {
          previous_tracked_url = _.info.currentUrl();
        }
        if (_.include(["full-url", "url-with-path-and-query-string", "url-with-path"], track_pageview_option)) {
          win.addEventListener("popstate", function() {
            win.dispatchEvent(new Event("mp_locationchange"));
          });
          win.addEventListener("hashchange", function() {
            win.dispatchEvent(new Event("mp_locationchange"));
          });
          var nativePushState = win.history.pushState;
          if (typeof nativePushState === "function") {
            win.history.pushState = function(state, unused, url) {
              nativePushState.call(win.history, state, unused, url);
              win.dispatchEvent(new Event("mp_locationchange"));
            };
          }
          var nativeReplaceState = win.history.replaceState;
          if (typeof nativeReplaceState === "function") {
            win.history.replaceState = function(state, unused, url) {
              nativeReplaceState.call(win.history, state, unused, url);
              win.dispatchEvent(new Event("mp_locationchange"));
            };
          }
          win.addEventListener("mp_locationchange", function() {
            var current_url = _.info.currentUrl();
            var should_track = false;
            if (track_pageview_option === "full-url") {
              should_track = current_url !== previous_tracked_url;
            } else if (track_pageview_option === "url-with-path-and-query-string") {
              should_track = current_url.split("#")[0] !== previous_tracked_url.split("#")[0];
            } else if (track_pageview_option === "url-with-path") {
              should_track = current_url.split("#")[0].split("?")[0] !== previous_tracked_url.split("#")[0].split("?")[0];
            }
            if (should_track) {
              var tracked2 = this.track_pageview();
              if (tracked2) {
                previous_tracked_url = current_url;
              }
            }
          }.bind(this));
        }
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
                      var response_headers = req["responseHeaders"] || {};
                      callback({ status: 0, httpStatusCode: req["status"], error, retryAfter: response_headers["Retry-After"] });
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
      MixpanelLib.prototype.get_batcher_configs = function() {
        var queue_prefix = "__mpq_" + this.get_config("token");
        var api_routes = this.get_config("api_routes");
        this._batcher_configs = this._batcher_configs || {
          events: { type: "events", endpoint: "/" + api_routes["track"], queue_key: queue_prefix + "_ev" },
          people: { type: "people", endpoint: "/" + api_routes["engage"], queue_key: queue_prefix + "_pp" },
          groups: { type: "groups", endpoint: "/" + api_routes["groups"], queue_key: queue_prefix + "_gr" }
        };
        return this._batcher_configs;
      };
      MixpanelLib.prototype.init_batchers = function() {
        if (!this.are_batchers_initialized()) {
          var batcher_for = _.bind(function(attrs) {
            return new RequestBatcher(
              attrs.queue_key,
              {
                libConfig: this["config"],
                errorReporter: this.get_config("error_reporter"),
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
                stopAllBatchingFunc: _.bind(this.stop_batch_senders, this),
                usePersistence: true
              }
            );
          }, this);
          var batcher_configs = this.get_batcher_configs();
          this.request_batchers = {
            events: batcher_for(batcher_configs.events),
            people: batcher_for(batcher_configs.people),
            groups: batcher_for(batcher_configs.groups)
          };
        }
        if (this.get_config("batch_autostart")) {
          this.start_batch_senders();
        }
      };
      MixpanelLib.prototype.start_batch_senders = function() {
        this._batchers_were_started = true;
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
            console$1.log("MIXPANEL REQUEST:");
            console$1.log(truncated_data);
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
        properties = _.extend({}, properties);
        properties["token"] = this.get_config("token");
        var start_timestamp = this["persistence"].remove_event_timer(event_name);
        if (!_.isUndefined(start_timestamp)) {
          var duration_in_ms = new Date().getTime() - start_timestamp;
          properties["$duration"] = parseFloat((duration_in_ms / 1e3).toFixed(3));
        }
        this._set_default_superprops();
        var marketing_properties = this.get_config("track_marketing") ? _.info.marketingParams() : {};
        properties = _.extend(
          {},
          _.info.properties({ "mp_loader": this.get_config("mp_loader") }),
          marketing_properties,
          this["persistence"].properties(),
          this.unpersisted_superprops,
          this.get_session_recording_properties(),
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
          endpoint: this.get_config("api_host") + "/" + this.get_config("api_routes")["track"],
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
        var prop = {};
        if (old_values === void 0) {
          prop[group_key] = [group_id];
          this.register(prop);
        } else {
          if (old_values.indexOf(group_id) === -1) {
            old_values.push(group_id);
            prop[group_key] = old_values;
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
      MixpanelLib.prototype.track_pageview = addOptOutCheckMixpanelLib(function(properties, options) {
        if (typeof properties !== "object") {
          properties = {};
        }
        options = options || {};
        var event_name = options["event_name"] || "$mp_web_page_view";
        var default_page_properties = _.extend(
          _.info.mpPageViewProperties(),
          _.info.campaignParams(),
          _.info.clickParams()
        );
        var event_properties = _.extend(
          {},
          default_page_properties,
          properties
        );
        return this.track(event_name, event_properties);
      });
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
        if (new_distinct_id && previous_distinct_id !== new_distinct_id) {
          if (typeof new_distinct_id === "string" && new_distinct_id.indexOf(DEVICE_ID_PREFIX) === 0) {
            this.report_error("distinct_id cannot have $device: prefix");
            return -1;
          }
          this.register({ "$user_id": new_distinct_id });
        }
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
          "distinct_id": DEVICE_ID_PREFIX + uuid,
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
        return this["persistence"].load_prop([property_name]);
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
          this.stop_batch_senders();
        } else {
          if (this._batchers_were_started) {
            this.start_batch_senders();
          }
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
        console$1.error.apply(console$1.error, arguments);
        try {
          if (!err && !(msg instanceof Error)) {
            msg = new Error(msg);
          }
          this.get_config("error_reporter")(msg, err);
        } catch (err2) {
          console$1.error(err2);
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
      MixpanelLib.prototype["start_session_recording"] = MixpanelLib.prototype.start_session_recording;
      MixpanelLib.prototype["stop_session_recording"] = MixpanelLib.prototype.stop_session_recording;
      MixpanelLib.prototype["get_session_recording_properties"] = MixpanelLib.prototype.get_session_recording_properties;
      MixpanelLib.prototype["DEFAULT_API_ROUTES"] = DEFAULT_API_ROUTES;
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
              win[PRIMARY_INSTANCE_NAME] = mixpanel_master;
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
            toplevel = win.frameElement === null;
          } catch (e) {
          }
          if (document$1.documentElement.doScroll && toplevel) {
            do_scroll_check();
          }
        }
        _.register_event(win, "load", dom_loaded_handler, true);
      };
      function init_as_module(bundle_loader) {
        load_extra_bundle = bundle_loader;
        init_type = INIT_MODULE;
        mixpanel_master = new MixpanelLib();
        override_mp_init_func();
        mixpanel_master["init"]();
        add_dom_loaded_handler();
        return mixpanel_master;
      }
      function loadNoop(_src, onload) {
        onload();
      }
      var mixpanel2 = init_as_module(loadNoop);
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
        if (key !== "record_sessions_percent") {
          if (typeof opts[key] === "boolean")
            opts[key] = true;
          if (typeof opts[key] === "number")
            opts[key] = 0;
        }
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
          ...this.opts,
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
          }
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
      window: false,
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
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
//# sourceMappingURL=eztrack.js.map
