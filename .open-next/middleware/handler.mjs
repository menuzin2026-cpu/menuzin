
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.9.16";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream as ReadableStream2 } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream2({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream2({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream2({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0a9gg_0.js
var require_node_modules_next_dist_esm_build_templates_edge_wrapper_0a9gg_0 = __commonJS({
  ".next/server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0a9gg_0.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0a9gg_0.js", 38022, (e, t, l) => {
      self._ENTRIES ||= {};
      let n = Promise.resolve().then(() => e.i(42738));
      n.catch(() => {
      }), self._ENTRIES.middleware_middleware = new Proxy(n, { get(e2, t2) {
        if ("then" === t2) return (t3, l3) => e2.then(t3, l3);
        let l2 = (...l3) => e2.then((e3) => (0, e3[t2])(...l3));
        return l2.then = (l3, n2) => e2.then((e3) => e3[t2]).then(l3, n2), l2;
      } });
    }]);
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/edge/chunks/[root-of-the-server]__0x0qbhs._.js
var require_root_of_the_server_0x0qbhs = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__0x0qbhs._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__0x0qbhs._.js", 74398, (e, t, r) => {
    }, 28042, (e, t, r) => {
      "use strict";
      var n = Object.defineProperty, i = Object.getOwnPropertyDescriptor, o = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, s = {}, l = { RequestCookies: () => g, ResponseCookies: () => m, parseCookie: () => d, parseSetCookie: () => h, stringifyCookie: () => c };
      for (var u in l) n(s, u, { get: l[u], enumerable: true });
      function c(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function d(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, i2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != i2 ? i2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function h(e2) {
        if (!e2) return;
        let [[t2, r2], ...n2] = d(e2), { domain: i2, expires: o2, httponly: a2, maxage: s2, path: l2, samesite: u2, secure: c2, partitioned: h2, priority: g2 } = Object.fromEntries(n2.map(([e3, t3]) => [e3.toLowerCase().replace(/-/g, ""), t3]));
        {
          var m2, v, b = { name: t2, value: decodeURIComponent(r2), domain: i2, ...o2 && { expires: new Date(o2) }, ...a2 && { httpOnly: true }, ..."string" == typeof s2 && { maxAge: Number(s2) }, path: l2, ...u2 && { sameSite: p.includes(m2 = (m2 = u2).toLowerCase()) ? m2 : void 0 }, ...c2 && { secure: true }, ...g2 && { priority: f.includes(v = (v = g2).toLowerCase()) ? v : void 0 }, ...h2 && { partitioned: true } };
          let e3 = {};
          for (let t3 in b) b[t3] && (e3[t3] = b[t3]);
          return e3;
        }
      }
      t.exports = ((e2, t2, r2, s2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let l2 of o(t2)) a.call(e2, l2) || l2 === r2 || n(e2, l2, { get: () => t2[l2], enumerable: !(s2 = i(t2, l2)) || s2.enumerable });
        return e2;
      })(n({}, "__esModule", { value: true }), s);
      var p = ["strict", "lax", "none"], f = ["low", "medium", "high"], g = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const t2 = e2.get("cookie");
          if (t2) for (const [e3, r2] of d(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => c(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => c(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, m = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const i2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (const e3 of Array.isArray(i2) ? i2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, i3, o2, a2 = [], s2 = 0;
            function l2() {
              for (; s2 < e4.length && /\s/.test(e4.charAt(s2)); ) s2 += 1;
              return s2 < e4.length;
            }
            for (; s2 < e4.length; ) {
              for (t3 = s2, o2 = false; l2(); ) if ("," === (r3 = e4.charAt(s2))) {
                for (n3 = s2, s2 += 1, l2(), i3 = s2; s2 < e4.length && "=" !== (r3 = e4.charAt(s2)) && ";" !== r3 && "," !== r3; ) s2 += 1;
                s2 < e4.length && "=" === e4.charAt(s2) ? (o2 = true, s2 = i3, a2.push(e4.substring(t3, n3)), t3 = s2) : s2 = n3 + 1;
              } else s2 += 1;
              (!o2 || s2 >= e4.length) && a2.push(e4.substring(t3, e4.length));
            }
            return a2;
          }(i2)) {
            const t3 = h(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, i2 = this._parsed;
          return i2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = c(r3);
              t3.append("set-cookie", e4);
            }
          }(i2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0]];
          return this.set({ ...r2, name: t2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(c).join("; ");
        }
      };
    }, 59110, (e, t, r) => {
      (() => {
        "use strict";
        let r2, n, i, o, a;
        var s, l, u, c, d, h, p, f, g, m, v, b, w, y, _, x, E = { 491: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ContextAPI = void 0;
          let n2 = r3(223), i2 = r3(172), o2 = r3(930), a2 = "context", s2 = new n2.NoopContextManager();
          class l2 {
            static getInstance() {
              return this._instance || (this._instance = new l2()), this._instance;
            }
            setGlobalContextManager(e3) {
              return (0, i2.registerGlobal)(a2, e3, o2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e3, t3, r4, ...n3) {
              return this._getContextManager().with(e3, t3, r4, ...n3);
            }
            bind(e3, t3) {
              return this._getContextManager().bind(e3, t3);
            }
            _getContextManager() {
              return (0, i2.getGlobal)(a2) || s2;
            }
            disable() {
              this._getContextManager().disable(), (0, i2.unregisterGlobal)(a2, o2.DiagAPI.instance());
            }
          }
          t2.ContextAPI = l2;
        }, 930: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagAPI = void 0;
          let n2 = r3(56), i2 = r3(912), o2 = r3(957), a2 = r3(172);
          class s2 {
            constructor() {
              function e3(e4) {
                return function(...t4) {
                  let r4 = (0, a2.getGlobal)("diag");
                  if (r4) return r4[e4](...t4);
                };
              }
              const t3 = this;
              t3.setLogger = (e4, r4 = { logLevel: o2.DiagLogLevel.INFO }) => {
                var n3, s3, l2;
                if (e4 === t3) {
                  let e5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return t3.error(null != (n3 = e5.stack) ? n3 : e5.message), false;
                }
                "number" == typeof r4 && (r4 = { logLevel: r4 });
                let u2 = (0, a2.getGlobal)("diag"), c2 = (0, i2.createLogLevelDiagLogger)(null != (s3 = r4.logLevel) ? s3 : o2.DiagLogLevel.INFO, e4);
                if (u2 && !r4.suppressOverrideMessage) {
                  let e5 = null != (l2 = Error().stack) ? l2 : "<failed to generate stacktrace>";
                  u2.warn(`Current logger will be overwritten from ${e5}`), c2.warn(`Current logger will overwrite one already registered from ${e5}`);
                }
                return (0, a2.registerGlobal)("diag", c2, t3, true);
              }, t3.disable = () => {
                (0, a2.unregisterGlobal)("diag", t3);
              }, t3.createComponentLogger = (e4) => new n2.DiagComponentLogger(e4), t3.verbose = e3("verbose"), t3.debug = e3("debug"), t3.info = e3("info"), t3.warn = e3("warn"), t3.error = e3("error");
            }
            static instance() {
              return this._instance || (this._instance = new s2()), this._instance;
            }
          }
          t2.DiagAPI = s2;
        }, 653: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.MetricsAPI = void 0;
          let n2 = r3(660), i2 = r3(172), o2 = r3(930), a2 = "metrics";
          class s2 {
            static getInstance() {
              return this._instance || (this._instance = new s2()), this._instance;
            }
            setGlobalMeterProvider(e3) {
              return (0, i2.registerGlobal)(a2, e3, o2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, i2.getGlobal)(a2) || n2.NOOP_METER_PROVIDER;
            }
            getMeter(e3, t3, r4) {
              return this.getMeterProvider().getMeter(e3, t3, r4);
            }
            disable() {
              (0, i2.unregisterGlobal)(a2, o2.DiagAPI.instance());
            }
          }
          t2.MetricsAPI = s2;
        }, 181: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.PropagationAPI = void 0;
          let n2 = r3(172), i2 = r3(874), o2 = r3(194), a2 = r3(277), s2 = r3(369), l2 = r3(930), u2 = "propagation", c2 = new i2.NoopTextMapPropagator();
          class d2 {
            constructor() {
              this.createBaggage = s2.createBaggage, this.getBaggage = a2.getBaggage, this.getActiveBaggage = a2.getActiveBaggage, this.setBaggage = a2.setBaggage, this.deleteBaggage = a2.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new d2()), this._instance;
            }
            setGlobalPropagator(e3) {
              return (0, n2.registerGlobal)(u2, e3, l2.DiagAPI.instance());
            }
            inject(e3, t3, r4 = o2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e3, t3, r4);
            }
            extract(e3, t3, r4 = o2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e3, t3, r4);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, n2.unregisterGlobal)(u2, l2.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, n2.getGlobal)(u2) || c2;
            }
          }
          t2.PropagationAPI = d2;
        }, 997: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceAPI = void 0;
          let n2 = r3(172), i2 = r3(846), o2 = r3(139), a2 = r3(607), s2 = r3(930), l2 = "trace";
          class u2 {
            constructor() {
              this._proxyTracerProvider = new i2.ProxyTracerProvider(), this.wrapSpanContext = o2.wrapSpanContext, this.isSpanContextValid = o2.isSpanContextValid, this.deleteSpan = a2.deleteSpan, this.getSpan = a2.getSpan, this.getActiveSpan = a2.getActiveSpan, this.getSpanContext = a2.getSpanContext, this.setSpan = a2.setSpan, this.setSpanContext = a2.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new u2()), this._instance;
            }
            setGlobalTracerProvider(e3) {
              let t3 = (0, n2.registerGlobal)(l2, this._proxyTracerProvider, s2.DiagAPI.instance());
              return t3 && this._proxyTracerProvider.setDelegate(e3), t3;
            }
            getTracerProvider() {
              return (0, n2.getGlobal)(l2) || this._proxyTracerProvider;
            }
            getTracer(e3, t3) {
              return this.getTracerProvider().getTracer(e3, t3);
            }
            disable() {
              (0, n2.unregisterGlobal)(l2, s2.DiagAPI.instance()), this._proxyTracerProvider = new i2.ProxyTracerProvider();
            }
          }
          t2.TraceAPI = u2;
        }, 277: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.deleteBaggage = t2.setBaggage = t2.getActiveBaggage = t2.getBaggage = void 0;
          let n2 = r3(491), i2 = (0, r3(780).createContextKey)("OpenTelemetry Baggage Key");
          function o2(e3) {
            return e3.getValue(i2) || void 0;
          }
          t2.getBaggage = o2, t2.getActiveBaggage = function() {
            return o2(n2.ContextAPI.getInstance().active());
          }, t2.setBaggage = function(e3, t3) {
            return e3.setValue(i2, t3);
          }, t2.deleteBaggage = function(e3) {
            return e3.deleteValue(i2);
          };
        }, 993: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.BaggageImpl = void 0;
          class r3 {
            constructor(e3) {
              this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
            }
            getEntry(e3) {
              let t3 = this._entries.get(e3);
              if (t3) return Object.assign({}, t3);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e3, t3]) => [e3, t3]);
            }
            setEntry(e3, t3) {
              let n2 = new r3(this._entries);
              return n2._entries.set(e3, t3), n2;
            }
            removeEntry(e3) {
              let t3 = new r3(this._entries);
              return t3._entries.delete(e3), t3;
            }
            removeEntries(...e3) {
              let t3 = new r3(this._entries);
              for (let r4 of e3) t3._entries.delete(r4);
              return t3;
            }
            clear() {
              return new r3();
            }
          }
          t2.BaggageImpl = r3;
        }, 830: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataSymbol = void 0, t2.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataFromString = t2.createBaggage = void 0;
          let n2 = r3(930), i2 = r3(993), o2 = r3(830), a2 = n2.DiagAPI.instance();
          t2.createBaggage = function(e3 = {}) {
            return new i2.BaggageImpl(new Map(Object.entries(e3)));
          }, t2.baggageEntryMetadataFromString = function(e3) {
            return "string" != typeof e3 && (a2.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: o2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 67: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.context = void 0, t2.context = r3(491).ContextAPI.getInstance();
        }, 223: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopContextManager = void 0;
          let n2 = r3(780);
          t2.NoopContextManager = class {
            active() {
              return n2.ROOT_CONTEXT;
            }
            with(e3, t3, r4, ...n3) {
              return t3.call(r4, ...n3);
            }
            bind(e3, t3) {
              return t3;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          };
        }, 780: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ROOT_CONTEXT = t2.createContextKey = void 0, t2.createContextKey = function(e3) {
            return Symbol.for(e3);
          };
          class r3 {
            constructor(e3) {
              const t3 = this;
              t3._currentContext = e3 ? new Map(e3) : /* @__PURE__ */ new Map(), t3.getValue = (e4) => t3._currentContext.get(e4), t3.setValue = (e4, n2) => {
                let i2 = new r3(t3._currentContext);
                return i2._currentContext.set(e4, n2), i2;
              }, t3.deleteValue = (e4) => {
                let n2 = new r3(t3._currentContext);
                return n2._currentContext.delete(e4), n2;
              };
            }
          }
          t2.ROOT_CONTEXT = new r3();
        }, 506: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.diag = void 0, t2.diag = r3(930).DiagAPI.instance();
        }, 56: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagComponentLogger = void 0;
          let n2 = r3(172);
          function i2(e3, t3, r4) {
            let i3 = (0, n2.getGlobal)("diag");
            if (i3) return r4.unshift(t3), i3[e3](...r4);
          }
          t2.DiagComponentLogger = class {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return i2("debug", this._namespace, e3);
            }
            error(...e3) {
              return i2("error", this._namespace, e3);
            }
            info(...e3) {
              return i2("info", this._namespace, e3);
            }
            warn(...e3) {
              return i2("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return i2("verbose", this._namespace, e3);
            }
          };
        }, 972: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagConsoleLogger = void 0;
          let r3 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          t2.DiagConsoleLogger = class {
            constructor() {
              for (let e3 = 0; e3 < r3.length; e3++) this[r3[e3].n] = /* @__PURE__ */ function(e4) {
                return function(...t3) {
                  if (console) {
                    let r4 = console[e4];
                    if ("function" != typeof r4 && (r4 = console.log), "function" == typeof r4) return r4.apply(console, t3);
                  }
                };
              }(r3[e3].c);
            }
          };
        }, 912: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createLogLevelDiagLogger = void 0;
          let n2 = r3(957);
          t2.createLogLevelDiagLogger = function(e3, t3) {
            function r4(r5, n3) {
              let i2 = t3[r5];
              return "function" == typeof i2 && e3 >= n3 ? i2.bind(t3) : function() {
              };
            }
            return e3 < n2.DiagLogLevel.NONE ? e3 = n2.DiagLogLevel.NONE : e3 > n2.DiagLogLevel.ALL && (e3 = n2.DiagLogLevel.ALL), t3 = t3 || {}, { error: r4("error", n2.DiagLogLevel.ERROR), warn: r4("warn", n2.DiagLogLevel.WARN), info: r4("info", n2.DiagLogLevel.INFO), debug: r4("debug", n2.DiagLogLevel.DEBUG), verbose: r4("verbose", n2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagLogLevel = void 0, (r3 = t2.DiagLogLevel || (t2.DiagLogLevel = {}))[r3.NONE = 0] = "NONE", r3[r3.ERROR = 30] = "ERROR", r3[r3.WARN = 50] = "WARN", r3[r3.INFO = 60] = "INFO", r3[r3.DEBUG = 70] = "DEBUG", r3[r3.VERBOSE = 80] = "VERBOSE", r3[r3.ALL = 9999] = "ALL";
        }, 172: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.unregisterGlobal = t2.getGlobal = t2.registerGlobal = void 0;
          let n2 = r3(200), i2 = r3(521), o2 = r3(130), a2 = i2.VERSION.split(".")[0], s2 = Symbol.for(`opentelemetry.js.api.${a2}`), l2 = n2._globalThis;
          t2.registerGlobal = function(e3, t3, r4, n3 = false) {
            var o3;
            let a3 = l2[s2] = null != (o3 = l2[s2]) ? o3 : { version: i2.VERSION };
            if (!n3 && a3[e3]) {
              let t4 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r4.error(t4.stack || t4.message), false;
            }
            if (a3.version !== i2.VERSION) {
              let t4 = Error(`@opentelemetry/api: Registration of version v${a3.version} for ${e3} does not match previously registered API v${i2.VERSION}`);
              return r4.error(t4.stack || t4.message), false;
            }
            return a3[e3] = t3, r4.debug(`@opentelemetry/api: Registered a global for ${e3} v${i2.VERSION}.`), true;
          }, t2.getGlobal = function(e3) {
            var t3, r4;
            let n3 = null == (t3 = l2[s2]) ? void 0 : t3.version;
            if (n3 && (0, o2.isCompatible)(n3)) return null == (r4 = l2[s2]) ? void 0 : r4[e3];
          }, t2.unregisterGlobal = function(e3, t3) {
            t3.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${i2.VERSION}.`);
            let r4 = l2[s2];
            r4 && delete r4[e3];
          };
        }, 130: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.isCompatible = t2._makeCompatibilityCheck = void 0;
          let n2 = r3(521), i2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function o2(e3) {
            let t3 = /* @__PURE__ */ new Set([e3]), r4 = /* @__PURE__ */ new Set(), n3 = e3.match(i2);
            if (!n3) return () => false;
            let o3 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
            if (null != o3.prerelease) return function(t4) {
              return t4 === e3;
            };
            function a2(e4) {
              return r4.add(e4), false;
            }
            return function(e4) {
              if (t3.has(e4)) return true;
              if (r4.has(e4)) return false;
              let n4 = e4.match(i2);
              if (!n4) return a2(e4);
              let s2 = { major: +n4[1], minor: +n4[2], patch: +n4[3], prerelease: n4[4] };
              if (null != s2.prerelease || o3.major !== s2.major) return a2(e4);
              if (0 === o3.major) return o3.minor === s2.minor && o3.patch <= s2.patch ? (t3.add(e4), true) : a2(e4);
              return o3.minor <= s2.minor ? (t3.add(e4), true) : a2(e4);
            };
          }
          t2._makeCompatibilityCheck = o2, t2.isCompatible = o2(n2.VERSION);
        }, 886: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.metrics = void 0, t2.metrics = r3(653).MetricsAPI.getInstance();
        }, 901: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ValueType = void 0, (r3 = t2.ValueType || (t2.ValueType = {}))[r3.INT = 0] = "INT", r3[r3.DOUBLE = 1] = "DOUBLE";
        }, 102: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createNoopMeter = t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t2.NOOP_OBSERVABLE_GAUGE_METRIC = t2.NOOP_OBSERVABLE_COUNTER_METRIC = t2.NOOP_UP_DOWN_COUNTER_METRIC = t2.NOOP_HISTOGRAM_METRIC = t2.NOOP_COUNTER_METRIC = t2.NOOP_METER = t2.NoopObservableUpDownCounterMetric = t2.NoopObservableGaugeMetric = t2.NoopObservableCounterMetric = t2.NoopObservableMetric = t2.NoopHistogramMetric = t2.NoopUpDownCounterMetric = t2.NoopCounterMetric = t2.NoopMetric = t2.NoopMeter = void 0;
          class r3 {
            createHistogram(e3, r4) {
              return t2.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r4) {
              return t2.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r4) {
              return t2.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r4) {
              return t2.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t3) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t2.NoopMeter = r3;
          class n2 {
          }
          t2.NoopMetric = n2;
          class i2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopCounterMetric = i2;
          class o2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopUpDownCounterMetric = o2;
          class a2 extends n2 {
            record(e3, t3) {
            }
          }
          t2.NoopHistogramMetric = a2;
          class s2 {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t2.NoopObservableMetric = s2;
          class l2 extends s2 {
          }
          t2.NoopObservableCounterMetric = l2;
          class u2 extends s2 {
          }
          t2.NoopObservableGaugeMetric = u2;
          class c2 extends s2 {
          }
          t2.NoopObservableUpDownCounterMetric = c2, t2.NOOP_METER = new r3(), t2.NOOP_COUNTER_METRIC = new i2(), t2.NOOP_HISTOGRAM_METRIC = new a2(), t2.NOOP_UP_DOWN_COUNTER_METRIC = new o2(), t2.NOOP_OBSERVABLE_COUNTER_METRIC = new l2(), t2.NOOP_OBSERVABLE_GAUGE_METRIC = new u2(), t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new c2(), t2.createNoopMeter = function() {
            return t2.NOOP_METER;
          };
        }, 660: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NOOP_METER_PROVIDER = t2.NoopMeterProvider = void 0;
          let n2 = r3(102);
          class i2 {
            getMeter(e3, t3, r4) {
              return n2.NOOP_METER;
            }
          }
          t2.NoopMeterProvider = i2, t2.NOOP_METER_PROVIDER = new i2();
        }, 200: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), i2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), i2(r3(46), t2);
        }, 651: (t2, r3) => {
          Object.defineProperty(r3, "__esModule", { value: true }), r3._globalThis = void 0, r3._globalThis = "object" == typeof globalThis ? globalThis : e.g;
        }, 46: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), i2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), i2(r3(651), t2);
        }, 939: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.propagation = void 0, t2.propagation = r3(181).PropagationAPI.getInstance();
        }, 874: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTextMapPropagator = void 0, t2.NoopTextMapPropagator = class {
            inject(e3, t3) {
            }
            extract(e3, t3) {
              return e3;
            }
            fields() {
              return [];
            }
          };
        }, 194: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.defaultTextMapSetter = t2.defaultTextMapGetter = void 0, t2.defaultTextMapGetter = { get(e3, t3) {
            if (null != e3) return e3[t3];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t2.defaultTextMapSetter = { set(e3, t3, r3) {
            null != e3 && (e3[t3] = r3);
          } };
        }, 845: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.trace = void 0, t2.trace = r3(997).TraceAPI.getInstance();
        }, 403: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NonRecordingSpan = void 0;
          let n2 = r3(476);
          t2.NonRecordingSpan = class {
            constructor(e3 = n2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t3) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t3) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t3) {
            }
          };
        }, 614: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracer = void 0;
          let n2 = r3(491), i2 = r3(607), o2 = r3(403), a2 = r3(139), s2 = n2.ContextAPI.getInstance();
          t2.NoopTracer = class {
            startSpan(e3, t3, r4 = s2.active()) {
              var n3;
              if (null == t3 ? void 0 : t3.root) return new o2.NonRecordingSpan();
              let l2 = r4 && (0, i2.getSpanContext)(r4);
              return "object" == typeof (n3 = l2) && "string" == typeof n3.spanId && "string" == typeof n3.traceId && "number" == typeof n3.traceFlags && (0, a2.isSpanContextValid)(l2) ? new o2.NonRecordingSpan(l2) : new o2.NonRecordingSpan();
            }
            startActiveSpan(e3, t3, r4, n3) {
              let o3, a3, l2;
              if (arguments.length < 2) return;
              2 == arguments.length ? l2 = t3 : 3 == arguments.length ? (o3 = t3, l2 = r4) : (o3 = t3, a3 = r4, l2 = n3);
              let u2 = null != a3 ? a3 : s2.active(), c2 = this.startSpan(e3, o3, u2), d2 = (0, i2.setSpan)(u2, c2);
              return s2.with(d2, l2, void 0, c2);
            }
          };
        }, 124: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracerProvider = void 0;
          let n2 = r3(614);
          t2.NoopTracerProvider = class {
            getTracer(e3, t3, r4) {
              return new n2.NoopTracer();
            }
          };
        }, 125: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracer = void 0;
          let n2 = new (r3(614)).NoopTracer();
          t2.ProxyTracer = class {
            constructor(e3, t3, r4, n3) {
              this._provider = e3, this.name = t3, this.version = r4, this.options = n3;
            }
            startSpan(e3, t3, r4) {
              return this._getTracer().startSpan(e3, t3, r4);
            }
            startActiveSpan(e3, t3, r4, n3) {
              let i2 = this._getTracer();
              return Reflect.apply(i2.startActiveSpan, i2, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : n2;
            }
          };
        }, 846: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracerProvider = void 0;
          let n2 = r3(125), i2 = new (r3(124)).NoopTracerProvider();
          t2.ProxyTracerProvider = class {
            getTracer(e3, t3, r4) {
              var i3;
              return null != (i3 = this.getDelegateTracer(e3, t3, r4)) ? i3 : new n2.ProxyTracer(this, e3, t3, r4);
            }
            getDelegate() {
              var e3;
              return null != (e3 = this._delegate) ? e3 : i2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t3, r4) {
              var n3;
              return null == (n3 = this._delegate) ? void 0 : n3.getTracer(e3, t3, r4);
            }
          };
        }, 996: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SamplingDecision = void 0, (r3 = t2.SamplingDecision || (t2.SamplingDecision = {}))[r3.NOT_RECORD = 0] = "NOT_RECORD", r3[r3.RECORD = 1] = "RECORD", r3[r3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
        }, 607: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.getSpanContext = t2.setSpanContext = t2.deleteSpan = t2.setSpan = t2.getActiveSpan = t2.getSpan = void 0;
          let n2 = r3(780), i2 = r3(403), o2 = r3(491), a2 = (0, n2.createContextKey)("OpenTelemetry Context Key SPAN");
          function s2(e3) {
            return e3.getValue(a2) || void 0;
          }
          function l2(e3, t3) {
            return e3.setValue(a2, t3);
          }
          t2.getSpan = s2, t2.getActiveSpan = function() {
            return s2(o2.ContextAPI.getInstance().active());
          }, t2.setSpan = l2, t2.deleteSpan = function(e3) {
            return e3.deleteValue(a2);
          }, t2.setSpanContext = function(e3, t3) {
            return l2(e3, new i2.NonRecordingSpan(t3));
          }, t2.getSpanContext = function(e3) {
            var t3;
            return null == (t3 = s2(e3)) ? void 0 : t3.spanContext();
          };
        }, 325: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceStateImpl = void 0;
          let n2 = r3(564);
          class i2 {
            constructor(e3) {
              this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
            }
            set(e3, t3) {
              let r4 = this._clone();
              return r4._internalState.has(e3) && r4._internalState.delete(e3), r4._internalState.set(e3, t3), r4;
            }
            unset(e3) {
              let t3 = this._clone();
              return t3._internalState.delete(e3), t3;
            }
            get(e3) {
              return this._internalState.get(e3);
            }
            serialize() {
              return this._keys().reduce((e3, t3) => (e3.push(t3 + "=" + this.get(t3)), e3), []).join(",");
            }
            _parse(e3) {
              !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce((e4, t3) => {
                let r4 = t3.trim(), i3 = r4.indexOf("=");
                if (-1 !== i3) {
                  let o2 = r4.slice(0, i3), a2 = r4.slice(i3 + 1, t3.length);
                  (0, n2.validateKey)(o2) && (0, n2.validateValue)(a2) && e4.set(o2, a2);
                }
                return e4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let e3 = new i2();
              return e3._internalState = new Map(this._internalState), e3;
            }
          }
          t2.TraceStateImpl = i2;
        }, 564: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.validateValue = t2.validateKey = void 0;
          let r3 = "[_0-9a-z-*/]", n2 = `[a-z]${r3}{0,255}`, i2 = `[a-z0-9]${r3}{0,240}@[a-z]${r3}{0,13}`, o2 = RegExp(`^(?:${n2}|${i2})$`), a2 = /^[ -~]{0,255}[!-~]$/, s2 = /,|=/;
          t2.validateKey = function(e3) {
            return o2.test(e3);
          }, t2.validateValue = function(e3) {
            return a2.test(e3) && !s2.test(e3);
          };
        }, 98: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createTraceState = void 0;
          let n2 = r3(325);
          t2.createTraceState = function(e3) {
            return new n2.TraceStateImpl(e3);
          };
        }, 476: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.INVALID_SPAN_CONTEXT = t2.INVALID_TRACEID = t2.INVALID_SPANID = void 0;
          let n2 = r3(475);
          t2.INVALID_SPANID = "0000000000000000", t2.INVALID_TRACEID = "00000000000000000000000000000000", t2.INVALID_SPAN_CONTEXT = { traceId: t2.INVALID_TRACEID, spanId: t2.INVALID_SPANID, traceFlags: n2.TraceFlags.NONE };
        }, 357: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanKind = void 0, (r3 = t2.SpanKind || (t2.SpanKind = {}))[r3.INTERNAL = 0] = "INTERNAL", r3[r3.SERVER = 1] = "SERVER", r3[r3.CLIENT = 2] = "CLIENT", r3[r3.PRODUCER = 3] = "PRODUCER", r3[r3.CONSUMER = 4] = "CONSUMER";
        }, 139: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.wrapSpanContext = t2.isSpanContextValid = t2.isValidSpanId = t2.isValidTraceId = void 0;
          let n2 = r3(476), i2 = r3(403), o2 = /^([0-9a-f]{32})$/i, a2 = /^[0-9a-f]{16}$/i;
          function s2(e3) {
            return o2.test(e3) && e3 !== n2.INVALID_TRACEID;
          }
          function l2(e3) {
            return a2.test(e3) && e3 !== n2.INVALID_SPANID;
          }
          t2.isValidTraceId = s2, t2.isValidSpanId = l2, t2.isSpanContextValid = function(e3) {
            return s2(e3.traceId) && l2(e3.spanId);
          }, t2.wrapSpanContext = function(e3) {
            return new i2.NonRecordingSpan(e3);
          };
        }, 847: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanStatusCode = void 0, (r3 = t2.SpanStatusCode || (t2.SpanStatusCode = {}))[r3.UNSET = 0] = "UNSET", r3[r3.OK = 1] = "OK", r3[r3.ERROR = 2] = "ERROR";
        }, 475: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceFlags = void 0, (r3 = t2.TraceFlags || (t2.TraceFlags = {}))[r3.NONE = 0] = "NONE", r3[r3.SAMPLED = 1] = "SAMPLED";
        }, 521: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.VERSION = void 0, t2.VERSION = "1.6.0";
        } }, C = {};
        function S(e2) {
          var t2 = C[e2];
          if (void 0 !== t2) return t2.exports;
          var r3 = C[e2] = { exports: {} }, n2 = true;
          try {
            E[e2].call(r3.exports, r3, r3.exports, S), n2 = false;
          } finally {
            n2 && delete C[e2];
          }
          return r3.exports;
        }
        S.ab = "/ROOT/node_modules/next/dist/compiled/@opentelemetry/api/";
        var R = {};
        Object.defineProperty(R, "__esModule", { value: true }), R.trace = R.propagation = R.metrics = R.diag = R.context = R.INVALID_SPAN_CONTEXT = R.INVALID_TRACEID = R.INVALID_SPANID = R.isValidSpanId = R.isValidTraceId = R.isSpanContextValid = R.createTraceState = R.TraceFlags = R.SpanStatusCode = R.SpanKind = R.SamplingDecision = R.ProxyTracerProvider = R.ProxyTracer = R.defaultTextMapSetter = R.defaultTextMapGetter = R.ValueType = R.createNoopMeter = R.DiagLogLevel = R.DiagConsoleLogger = R.ROOT_CONTEXT = R.createContextKey = R.baggageEntryMetadataFromString = void 0, s = S(369), Object.defineProperty(R, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
          return s.baggageEntryMetadataFromString;
        } }), l = S(780), Object.defineProperty(R, "createContextKey", { enumerable: true, get: function() {
          return l.createContextKey;
        } }), Object.defineProperty(R, "ROOT_CONTEXT", { enumerable: true, get: function() {
          return l.ROOT_CONTEXT;
        } }), u = S(972), Object.defineProperty(R, "DiagConsoleLogger", { enumerable: true, get: function() {
          return u.DiagConsoleLogger;
        } }), c = S(957), Object.defineProperty(R, "DiagLogLevel", { enumerable: true, get: function() {
          return c.DiagLogLevel;
        } }), d = S(102), Object.defineProperty(R, "createNoopMeter", { enumerable: true, get: function() {
          return d.createNoopMeter;
        } }), h = S(901), Object.defineProperty(R, "ValueType", { enumerable: true, get: function() {
          return h.ValueType;
        } }), p = S(194), Object.defineProperty(R, "defaultTextMapGetter", { enumerable: true, get: function() {
          return p.defaultTextMapGetter;
        } }), Object.defineProperty(R, "defaultTextMapSetter", { enumerable: true, get: function() {
          return p.defaultTextMapSetter;
        } }), f = S(125), Object.defineProperty(R, "ProxyTracer", { enumerable: true, get: function() {
          return f.ProxyTracer;
        } }), g = S(846), Object.defineProperty(R, "ProxyTracerProvider", { enumerable: true, get: function() {
          return g.ProxyTracerProvider;
        } }), m = S(996), Object.defineProperty(R, "SamplingDecision", { enumerable: true, get: function() {
          return m.SamplingDecision;
        } }), v = S(357), Object.defineProperty(R, "SpanKind", { enumerable: true, get: function() {
          return v.SpanKind;
        } }), b = S(847), Object.defineProperty(R, "SpanStatusCode", { enumerable: true, get: function() {
          return b.SpanStatusCode;
        } }), w = S(475), Object.defineProperty(R, "TraceFlags", { enumerable: true, get: function() {
          return w.TraceFlags;
        } }), y = S(98), Object.defineProperty(R, "createTraceState", { enumerable: true, get: function() {
          return y.createTraceState;
        } }), _ = S(139), Object.defineProperty(R, "isSpanContextValid", { enumerable: true, get: function() {
          return _.isSpanContextValid;
        } }), Object.defineProperty(R, "isValidTraceId", { enumerable: true, get: function() {
          return _.isValidTraceId;
        } }), Object.defineProperty(R, "isValidSpanId", { enumerable: true, get: function() {
          return _.isValidSpanId;
        } }), x = S(476), Object.defineProperty(R, "INVALID_SPANID", { enumerable: true, get: function() {
          return x.INVALID_SPANID;
        } }), Object.defineProperty(R, "INVALID_TRACEID", { enumerable: true, get: function() {
          return x.INVALID_TRACEID;
        } }), Object.defineProperty(R, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
          return x.INVALID_SPAN_CONTEXT;
        } }), r2 = S(67), Object.defineProperty(R, "context", { enumerable: true, get: function() {
          return r2.context;
        } }), n = S(506), Object.defineProperty(R, "diag", { enumerable: true, get: function() {
          return n.diag;
        } }), i = S(886), Object.defineProperty(R, "metrics", { enumerable: true, get: function() {
          return i.metrics;
        } }), o = S(939), Object.defineProperty(R, "propagation", { enumerable: true, get: function() {
          return o.propagation;
        } }), a = S(845), Object.defineProperty(R, "trace", { enumerable: true, get: function() {
          return a.trace;
        } }), R.default = { context: r2.context, diag: n.diag, metrics: i.metrics, propagation: o.propagation, trace: a.trace }, t.exports = R;
      })();
    }, 71498, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/cookie/");
        var e2, r2, n, i, o = {};
        o.parse = function(t2, r3) {
          if ("string" != typeof t2) throw TypeError("argument str must be a string");
          for (var i2 = {}, o2 = t2.split(n), a = (r3 || {}).decode || e2, s = 0; s < o2.length; s++) {
            var l = o2[s], u = l.indexOf("=");
            if (!(u < 0)) {
              var c = l.substr(0, u).trim(), d = l.substr(++u, l.length).trim();
              '"' == d[0] && (d = d.slice(1, -1)), void 0 == i2[c] && (i2[c] = function(e3, t3) {
                try {
                  return t3(e3);
                } catch (t4) {
                  return e3;
                }
              }(d, a));
            }
          }
          return i2;
        }, o.serialize = function(e3, t2, n2) {
          var o2 = n2 || {}, a = o2.encode || r2;
          if ("function" != typeof a) throw TypeError("option encode is invalid");
          if (!i.test(e3)) throw TypeError("argument name is invalid");
          var s = a(t2);
          if (s && !i.test(s)) throw TypeError("argument val is invalid");
          var l = e3 + "=" + s;
          if (null != o2.maxAge) {
            var u = o2.maxAge - 0;
            if (isNaN(u) || !isFinite(u)) throw TypeError("option maxAge is invalid");
            l += "; Max-Age=" + Math.floor(u);
          }
          if (o2.domain) {
            if (!i.test(o2.domain)) throw TypeError("option domain is invalid");
            l += "; Domain=" + o2.domain;
          }
          if (o2.path) {
            if (!i.test(o2.path)) throw TypeError("option path is invalid");
            l += "; Path=" + o2.path;
          }
          if (o2.expires) {
            if ("function" != typeof o2.expires.toUTCString) throw TypeError("option expires is invalid");
            l += "; Expires=" + o2.expires.toUTCString();
          }
          if (o2.httpOnly && (l += "; HttpOnly"), o2.secure && (l += "; Secure"), o2.sameSite) switch ("string" == typeof o2.sameSite ? o2.sameSite.toLowerCase() : o2.sameSite) {
            case true:
            case "strict":
              l += "; SameSite=Strict";
              break;
            case "lax":
              l += "; SameSite=Lax";
              break;
            case "none":
              l += "; SameSite=None";
              break;
            default:
              throw TypeError("option sameSite is invalid");
          }
          return l;
        }, e2 = decodeURIComponent, r2 = encodeURIComponent, n = /; */, i = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, t.exports = o;
      })();
    }, 99734, (e, t, r) => {
      (() => {
        "use strict";
        let e2, r2, n, i, o;
        var a = { 993: (e3) => {
          var t2 = Object.prototype.hasOwnProperty, r3 = "~";
          function n2() {
          }
          function i2(e4, t3, r4) {
            this.fn = e4, this.context = t3, this.once = r4 || false;
          }
          function o2(e4, t3, n3, o3, a3) {
            if ("function" != typeof n3) throw TypeError("The listener must be a function");
            var s3 = new i2(n3, o3 || e4, a3), l2 = r3 ? r3 + t3 : t3;
            return e4._events[l2] ? e4._events[l2].fn ? e4._events[l2] = [e4._events[l2], s3] : e4._events[l2].push(s3) : (e4._events[l2] = s3, e4._eventsCount++), e4;
          }
          function a2(e4, t3) {
            0 == --e4._eventsCount ? e4._events = new n2() : delete e4._events[t3];
          }
          function s2() {
            this._events = new n2(), this._eventsCount = 0;
          }
          Object.create && (n2.prototype = /* @__PURE__ */ Object.create(null), new n2().__proto__ || (r3 = false)), s2.prototype.eventNames = function() {
            var e4, n3, i3 = [];
            if (0 === this._eventsCount) return i3;
            for (n3 in e4 = this._events) t2.call(e4, n3) && i3.push(r3 ? n3.slice(1) : n3);
            return Object.getOwnPropertySymbols ? i3.concat(Object.getOwnPropertySymbols(e4)) : i3;
          }, s2.prototype.listeners = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            if (!n3) return [];
            if (n3.fn) return [n3.fn];
            for (var i3 = 0, o3 = n3.length, a3 = Array(o3); i3 < o3; i3++) a3[i3] = n3[i3].fn;
            return a3;
          }, s2.prototype.listenerCount = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            return n3 ? n3.fn ? 1 : n3.length : 0;
          }, s2.prototype.emit = function(e4, t3, n3, i3, o3, a3) {
            var s3 = r3 ? r3 + e4 : e4;
            if (!this._events[s3]) return false;
            var l2, u2, c = this._events[s3], d = arguments.length;
            if (c.fn) {
              switch (c.once && this.removeListener(e4, c.fn, void 0, true), d) {
                case 1:
                  return c.fn.call(c.context), true;
                case 2:
                  return c.fn.call(c.context, t3), true;
                case 3:
                  return c.fn.call(c.context, t3, n3), true;
                case 4:
                  return c.fn.call(c.context, t3, n3, i3), true;
                case 5:
                  return c.fn.call(c.context, t3, n3, i3, o3), true;
                case 6:
                  return c.fn.call(c.context, t3, n3, i3, o3, a3), true;
              }
              for (u2 = 1, l2 = Array(d - 1); u2 < d; u2++) l2[u2 - 1] = arguments[u2];
              c.fn.apply(c.context, l2);
            } else {
              var h, p = c.length;
              for (u2 = 0; u2 < p; u2++) switch (c[u2].once && this.removeListener(e4, c[u2].fn, void 0, true), d) {
                case 1:
                  c[u2].fn.call(c[u2].context);
                  break;
                case 2:
                  c[u2].fn.call(c[u2].context, t3);
                  break;
                case 3:
                  c[u2].fn.call(c[u2].context, t3, n3);
                  break;
                case 4:
                  c[u2].fn.call(c[u2].context, t3, n3, i3);
                  break;
                default:
                  if (!l2) for (h = 1, l2 = Array(d - 1); h < d; h++) l2[h - 1] = arguments[h];
                  c[u2].fn.apply(c[u2].context, l2);
              }
            }
            return true;
          }, s2.prototype.on = function(e4, t3, r4) {
            return o2(this, e4, t3, r4, false);
          }, s2.prototype.once = function(e4, t3, r4) {
            return o2(this, e4, t3, r4, true);
          }, s2.prototype.removeListener = function(e4, t3, n3, i3) {
            var o3 = r3 ? r3 + e4 : e4;
            if (!this._events[o3]) return this;
            if (!t3) return a2(this, o3), this;
            var s3 = this._events[o3];
            if (s3.fn) s3.fn !== t3 || i3 && !s3.once || n3 && s3.context !== n3 || a2(this, o3);
            else {
              for (var l2 = 0, u2 = [], c = s3.length; l2 < c; l2++) (s3[l2].fn !== t3 || i3 && !s3[l2].once || n3 && s3[l2].context !== n3) && u2.push(s3[l2]);
              u2.length ? this._events[o3] = 1 === u2.length ? u2[0] : u2 : a2(this, o3);
            }
            return this;
          }, s2.prototype.removeAllListeners = function(e4) {
            var t3;
            return e4 ? (t3 = r3 ? r3 + e4 : e4, this._events[t3] && a2(this, t3)) : (this._events = new n2(), this._eventsCount = 0), this;
          }, s2.prototype.off = s2.prototype.removeListener, s2.prototype.addListener = s2.prototype.on, s2.prefixed = r3, s2.EventEmitter = s2, e3.exports = s2;
        }, 213: (e3) => {
          e3.exports = (e4, t2) => (t2 = t2 || (() => {
          }), e4.then((e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => e5), (e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => {
            throw e5;
          })));
        }, 574: (e3, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = function(e4, t3, r3) {
            let n2 = 0, i2 = e4.length;
            for (; i2 > 0; ) {
              let o2 = i2 / 2 | 0, a2 = n2 + o2;
              0 >= r3(e4[a2], t3) ? (n2 = ++a2, i2 -= o2 + 1) : i2 = o2;
            }
            return n2;
          };
        }, 821: (e3, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true });
          let n2 = r3(574);
          t2.default = class {
            constructor() {
              this._queue = [];
            }
            enqueue(e4, t3) {
              let r4 = { priority: (t3 = Object.assign({ priority: 0 }, t3)).priority, run: e4 };
              if (this.size && this._queue[this.size - 1].priority >= t3.priority) return void this._queue.push(r4);
              let i2 = n2.default(this._queue, r4, (e5, t4) => t4.priority - e5.priority);
              this._queue.splice(i2, 0, r4);
            }
            dequeue() {
              let e4 = this._queue.shift();
              return null == e4 ? void 0 : e4.run;
            }
            filter(e4) {
              return this._queue.filter((t3) => t3.priority === e4.priority).map((e5) => e5.run);
            }
            get size() {
              return this._queue.length;
            }
          };
        }, 816: (e3, t2, r3) => {
          let n2 = r3(213);
          class i2 extends Error {
            constructor(e4) {
              super(e4), this.name = "TimeoutError";
            }
          }
          let o2 = (e4, t3, r4) => new Promise((o3, a2) => {
            if ("number" != typeof t3 || t3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (t3 === 1 / 0) return void o3(e4);
            let s2 = setTimeout(() => {
              if ("function" == typeof r4) {
                try {
                  o3(r4());
                } catch (e5) {
                  a2(e5);
                }
                return;
              }
              let n3 = "string" == typeof r4 ? r4 : `Promise timed out after ${t3} milliseconds`, s3 = r4 instanceof Error ? r4 : new i2(n3);
              "function" == typeof e4.cancel && e4.cancel(), a2(s3);
            }, t3);
            n2(e4.then(o3, a2), () => {
              clearTimeout(s2);
            });
          });
          e3.exports = o2, e3.exports.default = o2, e3.exports.TimeoutError = i2;
        } }, s = {};
        function l(e3) {
          var t2 = s[e3];
          if (void 0 !== t2) return t2.exports;
          var r3 = s[e3] = { exports: {} }, n2 = true;
          try {
            a[e3](r3, r3.exports, l), n2 = false;
          } finally {
            n2 && delete s[e3];
          }
          return r3.exports;
        }
        l.ab = "/ROOT/node_modules/next/dist/compiled/p-queue/";
        var u = {};
        Object.defineProperty(u, "__esModule", { value: true }), e2 = l(993), r2 = l(816), n = l(821), i = () => {
        }, o = new r2.TimeoutError(), u.default = class extends e2 {
          constructor(e3) {
            var t2, r3, o2, a2;
            if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = i, this._resolveIdle = i, !("number" == typeof (e3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: n.default }, e3)).intervalCap && e3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (r3 = null == (t2 = e3.intervalCap) ? void 0 : t2.toString()) ? r3 : ""}\` (${typeof e3.intervalCap})`);
            if (void 0 === e3.interval || !(Number.isFinite(e3.interval) && e3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (a2 = null == (o2 = e3.interval) ? void 0 : o2.toString()) ? a2 : ""}\` (${typeof e3.interval})`);
            this._carryoverConcurrencyCount = e3.carryoverConcurrencyCount, this._isIntervalIgnored = e3.intervalCap === 1 / 0 || 0 === e3.interval, this._intervalCap = e3.intervalCap, this._interval = e3.interval, this._queue = new e3.queueClass(), this._queueClass = e3.queueClass, this.concurrency = e3.concurrency, this._timeout = e3.timeout, this._throwOnTimeout = true === e3.throwOnTimeout, this._isPaused = false === e3.autoStart;
          }
          get _doesIntervalAllowAnother() {
            return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
          }
          get _doesConcurrentAllowAnother() {
            return this._pendingCount < this._concurrency;
          }
          _next() {
            this._pendingCount--, this._tryToStartAnother(), this.emit("next");
          }
          _resolvePromises() {
            this._resolveEmpty(), this._resolveEmpty = i, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = i, this.emit("idle"));
          }
          _onResumeInterval() {
            this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
          }
          _isIntervalPaused() {
            let e3 = Date.now();
            if (void 0 === this._intervalId) {
              let t2 = this._intervalEnd - e3;
              if (!(t2 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                this._onResumeInterval();
              }, t2)), true;
              this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
            }
            return false;
          }
          _tryToStartAnother() {
            if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
            if (!this._isPaused) {
              let e3 = !this._isIntervalPaused();
              if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                let t2 = this._queue.dequeue();
                return !!t2 && (this.emit("active"), t2(), e3 && this._initializeIntervalIfNeeded(), true);
              }
            }
            return false;
          }
          _initializeIntervalIfNeeded() {
            this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
              this._onInterval();
            }, this._interval), this._intervalEnd = Date.now() + this._interval);
          }
          _onInterval() {
            0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
          }
          _processQueue() {
            for (; this._tryToStartAnother(); ) ;
          }
          get concurrency() {
            return this._concurrency;
          }
          set concurrency(e3) {
            if (!("number" == typeof e3 && e3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e3}\` (${typeof e3})`);
            this._concurrency = e3, this._processQueue();
          }
          async add(e3, t2 = {}) {
            return new Promise((n2, i2) => {
              let a2 = async () => {
                this._pendingCount++, this._intervalCount++;
                try {
                  let a3 = void 0 === this._timeout && void 0 === t2.timeout ? e3() : r2.default(Promise.resolve(e3()), void 0 === t2.timeout ? this._timeout : t2.timeout, () => {
                    (void 0 === t2.throwOnTimeout ? this._throwOnTimeout : t2.throwOnTimeout) && i2(o);
                  });
                  n2(await a3);
                } catch (e4) {
                  i2(e4);
                }
                this._next();
              };
              this._queue.enqueue(a2, t2), this._tryToStartAnother(), this.emit("add");
            });
          }
          async addAll(e3, t2) {
            return Promise.all(e3.map(async (e4) => this.add(e4, t2)));
          }
          start() {
            return this._isPaused && (this._isPaused = false, this._processQueue()), this;
          }
          pause() {
            this._isPaused = true;
          }
          clear() {
            this._queue = new this._queueClass();
          }
          async onEmpty() {
            if (0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveEmpty;
              this._resolveEmpty = () => {
                t2(), e3();
              };
            });
          }
          async onIdle() {
            if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveIdle;
              this._resolveIdle = () => {
                t2(), e3();
              };
            });
          }
          get size() {
            return this._queue.size;
          }
          sizeBy(e3) {
            return this._queue.filter(e3).length;
          }
          get pending() {
            return this._pendingCount;
          }
          get isPaused() {
            return this._isPaused;
          }
          get timeout() {
            return this._timeout;
          }
          set timeout(e3) {
            this._timeout = e3;
          }
        }, t.exports = u;
      })();
    }, 51615, (e, t, r) => {
      t.exports = e.x("node:buffer", () => (init_node_buffer(), __toCommonJS(node_buffer_exports)));
    }, 78500, (e, t, r) => {
      t.exports = e.x("node:async_hooks", () => (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports)));
    }, 25085, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { getTestReqInfo: function() {
        return l;
      }, withRequest: function() {
        return s;
      } };
      for (var i in n) Object.defineProperty(r, i, { enumerable: true, get: n[i] });
      let o = new (e.r(78500)).AsyncLocalStorage();
      function a(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (!r2) return;
        let n2 = t2.url(e2);
        return { url: n2, proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function s(e2, t2, r2) {
        let n2 = a(e2, t2);
        return n2 ? o.run(n2, r2) : r2();
      }
      function l(e2, t2) {
        let r2 = o.getStore();
        return r2 || (e2 && t2 ? a(e2, t2) : void 0);
      }
    }, 28325, (e, t, r) => {
      "use strict";
      var n = e.i(51615);
      Object.defineProperty(r, "__esModule", { value: true });
      var i = { handleFetch: function() {
        return u;
      }, interceptFetch: function() {
        return c;
      }, reader: function() {
        return s;
      } };
      for (var o in i) Object.defineProperty(r, o, { enumerable: true, get: i[o] });
      let a = e.r(25085), s = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function l(e2, t2) {
        let { url: r2, method: i2, headers: o2, body: a2, cache: s2, credentials: l2, integrity: u2, mode: c2, redirect: d, referrer: h, referrerPolicy: p } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: i2, headers: [...Array.from(o2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: a2 ? n.Buffer.from(await t2.arrayBuffer()).toString("base64") : null, cache: s2, credentials: l2, integrity: u2, mode: c2, redirect: d, referrer: h, referrerPolicy: p } };
      }
      async function u(e2, t2) {
        let r2 = (0, a.getTestReqInfo)(t2, s);
        if (!r2) return e2(t2);
        let { testData: i2, proxyPort: o2 } = r2, u2 = await l(i2, t2), c2 = await e2(`http://localhost:${o2}`, { method: "POST", body: JSON.stringify(u2), next: { internal: true } });
        if (!c2.ok) throw Object.defineProperty(Error(`Proxy request failed: ${c2.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let d = await c2.json(), { api: h } = d;
        switch (h) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${t2.method} ${t2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            return function(e3) {
              let { status: t3, headers: r3, body: i3 } = e3.response;
              return new Response(i3 ? n.Buffer.from(i3, "base64") : null, { status: t3, headers: new Headers(r3) });
            }(d);
          default:
            return h;
        }
      }
      function c(t2) {
        return e.g.fetch = function(e2, r2) {
          var n2;
          return (null == r2 || null == (n2 = r2.next) ? void 0 : n2.internal) ? t2(e2, r2) : u(t2, new Request(e2, r2));
        }, () => {
          e.g.fetch = t2;
        };
      }
    }, 94165, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { interceptTestApis: function() {
        return s;
      }, wrapRequestHandler: function() {
        return l;
      } };
      for (var i in n) Object.defineProperty(r, i, { enumerable: true, get: n[i] });
      let o = e.r(25085), a = e.r(28325);
      function s() {
        return (0, a.interceptFetch)(e.g.fetch);
      }
      function l(e2) {
        return (t2, r2) => (0, o.withRequest)(t2, a.reader, () => e2(t2, r2));
      }
    }, 54846, (e, t, r) => {
      !function() {
        "use strict";
        var e2 = { 114: function(e3) {
          function t2(e4) {
            if ("string" != typeof e4) throw TypeError("Path must be a string. Received " + JSON.stringify(e4));
          }
          function r3(e4, t3) {
            for (var r4, n3 = "", i = 0, o = -1, a = 0, s = 0; s <= e4.length; ++s) {
              if (s < e4.length) r4 = e4.charCodeAt(s);
              else if (47 === r4) break;
              else r4 = 47;
              if (47 === r4) {
                if (o === s - 1 || 1 === a) ;
                else if (o !== s - 1 && 2 === a) {
                  if (n3.length < 2 || 2 !== i || 46 !== n3.charCodeAt(n3.length - 1) || 46 !== n3.charCodeAt(n3.length - 2)) {
                    if (n3.length > 2) {
                      var l = n3.lastIndexOf("/");
                      if (l !== n3.length - 1) {
                        -1 === l ? (n3 = "", i = 0) : i = (n3 = n3.slice(0, l)).length - 1 - n3.lastIndexOf("/"), o = s, a = 0;
                        continue;
                      }
                    } else if (2 === n3.length || 1 === n3.length) {
                      n3 = "", i = 0, o = s, a = 0;
                      continue;
                    }
                  }
                  t3 && (n3.length > 0 ? n3 += "/.." : n3 = "..", i = 2);
                } else n3.length > 0 ? n3 += "/" + e4.slice(o + 1, s) : n3 = e4.slice(o + 1, s), i = s - o - 1;
                o = s, a = 0;
              } else 46 === r4 && -1 !== a ? ++a : a = -1;
            }
            return n3;
          }
          var n2 = { resolve: function() {
            for (var e4, n3, i = "", o = false, a = arguments.length - 1; a >= -1 && !o; a--) a >= 0 ? n3 = arguments[a] : (void 0 === e4 && (e4 = ""), n3 = e4), t2(n3), 0 !== n3.length && (i = n3 + "/" + i, o = 47 === n3.charCodeAt(0));
            if (i = r3(i, !o), o) if (i.length > 0) return "/" + i;
            else return "/";
            return i.length > 0 ? i : ".";
          }, normalize: function(e4) {
            if (t2(e4), 0 === e4.length) return ".";
            var n3 = 47 === e4.charCodeAt(0), i = 47 === e4.charCodeAt(e4.length - 1);
            return (0 !== (e4 = r3(e4, !n3)).length || n3 || (e4 = "."), e4.length > 0 && i && (e4 += "/"), n3) ? "/" + e4 : e4;
          }, isAbsolute: function(e4) {
            return t2(e4), e4.length > 0 && 47 === e4.charCodeAt(0);
          }, join: function() {
            if (0 == arguments.length) return ".";
            for (var e4, r4 = 0; r4 < arguments.length; ++r4) {
              var i = arguments[r4];
              t2(i), i.length > 0 && (void 0 === e4 ? e4 = i : e4 += "/" + i);
            }
            return void 0 === e4 ? "." : n2.normalize(e4);
          }, relative: function(e4, r4) {
            if (t2(e4), t2(r4), e4 === r4 || (e4 = n2.resolve(e4)) === (r4 = n2.resolve(r4))) return "";
            for (var i = 1; i < e4.length && 47 === e4.charCodeAt(i); ++i) ;
            for (var o = e4.length, a = o - i, s = 1; s < r4.length && 47 === r4.charCodeAt(s); ++s) ;
            for (var l = r4.length - s, u = a < l ? a : l, c = -1, d = 0; d <= u; ++d) {
              if (d === u) {
                if (l > u) {
                  if (47 === r4.charCodeAt(s + d)) return r4.slice(s + d + 1);
                  else if (0 === d) return r4.slice(s + d);
                } else a > u && (47 === e4.charCodeAt(i + d) ? c = d : 0 === d && (c = 0));
                break;
              }
              var h = e4.charCodeAt(i + d);
              if (h !== r4.charCodeAt(s + d)) break;
              47 === h && (c = d);
            }
            var p = "";
            for (d = i + c + 1; d <= o; ++d) (d === o || 47 === e4.charCodeAt(d)) && (0 === p.length ? p += ".." : p += "/..");
            return p.length > 0 ? p + r4.slice(s + c) : (s += c, 47 === r4.charCodeAt(s) && ++s, r4.slice(s));
          }, _makeLong: function(e4) {
            return e4;
          }, dirname: function(e4) {
            if (t2(e4), 0 === e4.length) return ".";
            for (var r4 = e4.charCodeAt(0), n3 = 47 === r4, i = -1, o = true, a = e4.length - 1; a >= 1; --a) if (47 === (r4 = e4.charCodeAt(a))) {
              if (!o) {
                i = a;
                break;
              }
            } else o = false;
            return -1 === i ? n3 ? "/" : "." : n3 && 1 === i ? "//" : e4.slice(0, i);
          }, basename: function(e4, r4) {
            if (void 0 !== r4 && "string" != typeof r4) throw TypeError('"ext" argument must be a string');
            t2(e4);
            var n3, i = 0, o = -1, a = true;
            if (void 0 !== r4 && r4.length > 0 && r4.length <= e4.length) {
              if (r4.length === e4.length && r4 === e4) return "";
              var s = r4.length - 1, l = -1;
              for (n3 = e4.length - 1; n3 >= 0; --n3) {
                var u = e4.charCodeAt(n3);
                if (47 === u) {
                  if (!a) {
                    i = n3 + 1;
                    break;
                  }
                } else -1 === l && (a = false, l = n3 + 1), s >= 0 && (u === r4.charCodeAt(s) ? -1 == --s && (o = n3) : (s = -1, o = l));
              }
              return i === o ? o = l : -1 === o && (o = e4.length), e4.slice(i, o);
            }
            for (n3 = e4.length - 1; n3 >= 0; --n3) if (47 === e4.charCodeAt(n3)) {
              if (!a) {
                i = n3 + 1;
                break;
              }
            } else -1 === o && (a = false, o = n3 + 1);
            return -1 === o ? "" : e4.slice(i, o);
          }, extname: function(e4) {
            t2(e4);
            for (var r4 = -1, n3 = 0, i = -1, o = true, a = 0, s = e4.length - 1; s >= 0; --s) {
              var l = e4.charCodeAt(s);
              if (47 === l) {
                if (!o) {
                  n3 = s + 1;
                  break;
                }
                continue;
              }
              -1 === i && (o = false, i = s + 1), 46 === l ? -1 === r4 ? r4 = s : 1 !== a && (a = 1) : -1 !== r4 && (a = -1);
            }
            return -1 === r4 || -1 === i || 0 === a || 1 === a && r4 === i - 1 && r4 === n3 + 1 ? "" : e4.slice(r4, i);
          }, format: function(e4) {
            var t3, r4;
            if (null === e4 || "object" != typeof e4) throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e4);
            return t3 = e4.dir || e4.root, r4 = e4.base || (e4.name || "") + (e4.ext || ""), t3 ? t3 === e4.root ? t3 + r4 : t3 + "/" + r4 : r4;
          }, parse: function(e4) {
            t2(e4);
            var r4, n3 = { root: "", dir: "", base: "", ext: "", name: "" };
            if (0 === e4.length) return n3;
            var i = e4.charCodeAt(0), o = 47 === i;
            o ? (n3.root = "/", r4 = 1) : r4 = 0;
            for (var a = -1, s = 0, l = -1, u = true, c = e4.length - 1, d = 0; c >= r4; --c) {
              if (47 === (i = e4.charCodeAt(c))) {
                if (!u) {
                  s = c + 1;
                  break;
                }
                continue;
              }
              -1 === l && (u = false, l = c + 1), 46 === i ? -1 === a ? a = c : 1 !== d && (d = 1) : -1 !== a && (d = -1);
            }
            return -1 === a || -1 === l || 0 === d || 1 === d && a === l - 1 && a === s + 1 ? -1 !== l && (0 === s && o ? n3.base = n3.name = e4.slice(1, l) : n3.base = n3.name = e4.slice(s, l)) : (0 === s && o ? (n3.name = e4.slice(1, a), n3.base = e4.slice(1, l)) : (n3.name = e4.slice(s, a), n3.base = e4.slice(s, l)), n3.ext = e4.slice(a, l)), s > 0 ? n3.dir = e4.slice(0, s - 1) : o && (n3.dir = "/"), n3;
          }, sep: "/", delimiter: ":", win32: null, posix: null };
          n2.posix = n2, e3.exports = n2;
        } }, r2 = {};
        function n(t2) {
          var i = r2[t2];
          if (void 0 !== i) return i.exports;
          var o = r2[t2] = { exports: {} }, a = true;
          try {
            e2[t2](o, o.exports, n), a = false;
          } finally {
            a && delete r2[t2];
          }
          return o.exports;
        }
        n.ab = "/ROOT/node_modules/next/dist/compiled/path-browserify/", t.exports = n(114);
      }();
    }, 68886, (e, t, r) => {
      t.exports = e.r(54846);
    }, 67914, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/path-to-regexp/");
        var e2 = {};
        (() => {
          function t2(e3, t3) {
            void 0 === t3 && (t3 = {});
            for (var r3 = function(e4) {
              for (var t4 = [], r4 = 0; r4 < e4.length; ) {
                var n3 = e4[r4];
                if ("*" === n3 || "+" === n3 || "?" === n3) {
                  t4.push({ type: "MODIFIER", index: r4, value: e4[r4++] });
                  continue;
                }
                if ("\\" === n3) {
                  t4.push({ type: "ESCAPED_CHAR", index: r4++, value: e4[r4++] });
                  continue;
                }
                if ("{" === n3) {
                  t4.push({ type: "OPEN", index: r4, value: e4[r4++] });
                  continue;
                }
                if ("}" === n3) {
                  t4.push({ type: "CLOSE", index: r4, value: e4[r4++] });
                  continue;
                }
                if (":" === n3) {
                  for (var i2 = "", o3 = r4 + 1; o3 < e4.length; ) {
                    var a3 = e4.charCodeAt(o3);
                    if (a3 >= 48 && a3 <= 57 || a3 >= 65 && a3 <= 90 || a3 >= 97 && a3 <= 122 || 95 === a3) {
                      i2 += e4[o3++];
                      continue;
                    }
                    break;
                  }
                  if (!i2) throw TypeError("Missing parameter name at ".concat(r4));
                  t4.push({ type: "NAME", index: r4, value: i2 }), r4 = o3;
                  continue;
                }
                if ("(" === n3) {
                  var s3 = 1, l2 = "", o3 = r4 + 1;
                  if ("?" === e4[o3]) throw TypeError('Pattern cannot start with "?" at '.concat(o3));
                  for (; o3 < e4.length; ) {
                    if ("\\" === e4[o3]) {
                      l2 += e4[o3++] + e4[o3++];
                      continue;
                    }
                    if (")" === e4[o3]) {
                      if (0 == --s3) {
                        o3++;
                        break;
                      }
                    } else if ("(" === e4[o3] && (s3++, "?" !== e4[o3 + 1])) throw TypeError("Capturing groups are not allowed at ".concat(o3));
                    l2 += e4[o3++];
                  }
                  if (s3) throw TypeError("Unbalanced pattern at ".concat(r4));
                  if (!l2) throw TypeError("Missing pattern at ".concat(r4));
                  t4.push({ type: "PATTERN", index: r4, value: l2 }), r4 = o3;
                  continue;
                }
                t4.push({ type: "CHAR", index: r4, value: e4[r4++] });
              }
              return t4.push({ type: "END", index: r4, value: "" }), t4;
            }(e3), n2 = t3.prefixes, o2 = void 0 === n2 ? "./" : n2, a2 = t3.delimiter, s2 = void 0 === a2 ? "/#?" : a2, l = [], u = 0, c = 0, d = "", h = function(e4) {
              if (c < r3.length && r3[c].type === e4) return r3[c++].value;
            }, p = function(e4) {
              var t4 = h(e4);
              if (void 0 !== t4) return t4;
              var n3 = r3[c], i2 = n3.type, o3 = n3.index;
              throw TypeError("Unexpected ".concat(i2, " at ").concat(o3, ", expected ").concat(e4));
            }, f = function() {
              for (var e4, t4 = ""; e4 = h("CHAR") || h("ESCAPED_CHAR"); ) t4 += e4;
              return t4;
            }, g = function(e4) {
              for (var t4 = 0; t4 < s2.length; t4++) {
                var r4 = s2[t4];
                if (e4.indexOf(r4) > -1) return true;
              }
              return false;
            }, m = function(e4) {
              var t4 = l[l.length - 1], r4 = e4 || (t4 && "string" == typeof t4 ? t4 : "");
              if (t4 && !r4) throw TypeError('Must have text between two parameters, missing text after "'.concat(t4.name, '"'));
              return !r4 || g(r4) ? "[^".concat(i(s2), "]+?") : "(?:(?!".concat(i(r4), ")[^").concat(i(s2), "])+?");
            }; c < r3.length; ) {
              var v = h("CHAR"), b = h("NAME"), w = h("PATTERN");
              if (b || w) {
                var y = v || "";
                -1 === o2.indexOf(y) && (d += y, y = ""), d && (l.push(d), d = ""), l.push({ name: b || u++, prefix: y, suffix: "", pattern: w || m(y), modifier: h("MODIFIER") || "" });
                continue;
              }
              var _ = v || h("ESCAPED_CHAR");
              if (_) {
                d += _;
                continue;
              }
              if (d && (l.push(d), d = ""), h("OPEN")) {
                var y = f(), x = h("NAME") || "", E = h("PATTERN") || "", C = f();
                p("CLOSE"), l.push({ name: x || (E ? u++ : ""), pattern: x && !E ? m(y) : E, prefix: y, suffix: C, modifier: h("MODIFIER") || "" });
                continue;
              }
              p("END");
            }
            return l;
          }
          function r2(e3, t3) {
            void 0 === t3 && (t3 = {});
            var r3 = o(t3), n2 = t3.encode, i2 = void 0 === n2 ? function(e4) {
              return e4;
            } : n2, a2 = t3.validate, s2 = void 0 === a2 || a2, l = e3.map(function(e4) {
              if ("object" == typeof e4) return new RegExp("^(?:".concat(e4.pattern, ")$"), r3);
            });
            return function(t4) {
              for (var r4 = "", n3 = 0; n3 < e3.length; n3++) {
                var o2 = e3[n3];
                if ("string" == typeof o2) {
                  r4 += o2;
                  continue;
                }
                var a3 = t4 ? t4[o2.name] : void 0, u = "?" === o2.modifier || "*" === o2.modifier, c = "*" === o2.modifier || "+" === o2.modifier;
                if (Array.isArray(a3)) {
                  if (!c) throw TypeError('Expected "'.concat(o2.name, '" to not repeat, but got an array'));
                  if (0 === a3.length) {
                    if (u) continue;
                    throw TypeError('Expected "'.concat(o2.name, '" to not be empty'));
                  }
                  for (var d = 0; d < a3.length; d++) {
                    var h = i2(a3[d], o2);
                    if (s2 && !l[n3].test(h)) throw TypeError('Expected all "'.concat(o2.name, '" to match "').concat(o2.pattern, '", but got "').concat(h, '"'));
                    r4 += o2.prefix + h + o2.suffix;
                  }
                  continue;
                }
                if ("string" == typeof a3 || "number" == typeof a3) {
                  var h = i2(String(a3), o2);
                  if (s2 && !l[n3].test(h)) throw TypeError('Expected "'.concat(o2.name, '" to match "').concat(o2.pattern, '", but got "').concat(h, '"'));
                  r4 += o2.prefix + h + o2.suffix;
                  continue;
                }
                if (!u) {
                  var p = c ? "an array" : "a string";
                  throw TypeError('Expected "'.concat(o2.name, '" to be ').concat(p));
                }
              }
              return r4;
            };
          }
          function n(e3, t3, r3) {
            void 0 === r3 && (r3 = {});
            var n2 = r3.decode, i2 = void 0 === n2 ? function(e4) {
              return e4;
            } : n2;
            return function(r4) {
              var n3 = e3.exec(r4);
              if (!n3) return false;
              for (var o2 = n3[0], a2 = n3.index, s2 = /* @__PURE__ */ Object.create(null), l = 1; l < n3.length; l++) !function(e4) {
                if (void 0 !== n3[e4]) {
                  var r5 = t3[e4 - 1];
                  "*" === r5.modifier || "+" === r5.modifier ? s2[r5.name] = n3[e4].split(r5.prefix + r5.suffix).map(function(e5) {
                    return i2(e5, r5);
                  }) : s2[r5.name] = i2(n3[e4], r5);
                }
              }(l);
              return { path: o2, index: a2, params: s2 };
            };
          }
          function i(e3) {
            return e3.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
          }
          function o(e3) {
            return e3 && e3.sensitive ? "" : "i";
          }
          function a(e3, t3, r3) {
            void 0 === r3 && (r3 = {});
            for (var n2 = r3.strict, a2 = void 0 !== n2 && n2, s2 = r3.start, l = r3.end, u = r3.encode, c = void 0 === u ? function(e4) {
              return e4;
            } : u, d = r3.delimiter, h = r3.endsWith, p = "[".concat(i(void 0 === h ? "" : h), "]|$"), f = "[".concat(i(void 0 === d ? "/#?" : d), "]"), g = void 0 === s2 || s2 ? "^" : "", m = 0; m < e3.length; m++) {
              var v = e3[m];
              if ("string" == typeof v) g += i(c(v));
              else {
                var b = i(c(v.prefix)), w = i(c(v.suffix));
                if (v.pattern) if (t3 && t3.push(v), b || w) if ("+" === v.modifier || "*" === v.modifier) {
                  var y = "*" === v.modifier ? "?" : "";
                  g += "(?:".concat(b, "((?:").concat(v.pattern, ")(?:").concat(w).concat(b, "(?:").concat(v.pattern, "))*)").concat(w, ")").concat(y);
                } else g += "(?:".concat(b, "(").concat(v.pattern, ")").concat(w, ")").concat(v.modifier);
                else {
                  if ("+" === v.modifier || "*" === v.modifier) throw TypeError('Can not repeat "'.concat(v.name, '" without a prefix and suffix'));
                  g += "(".concat(v.pattern, ")").concat(v.modifier);
                }
                else g += "(?:".concat(b).concat(w, ")").concat(v.modifier);
              }
            }
            if (void 0 === l || l) a2 || (g += "".concat(f, "?")), g += r3.endsWith ? "(?=".concat(p, ")") : "$";
            else {
              var _ = e3[e3.length - 1], x = "string" == typeof _ ? f.indexOf(_[_.length - 1]) > -1 : void 0 === _;
              a2 || (g += "(?:".concat(f, "(?=").concat(p, "))?")), x || (g += "(?=".concat(f, "|").concat(p, ")"));
            }
            return new RegExp(g, o(r3));
          }
          function s(e3, r3, n2) {
            if (e3 instanceof RegExp) {
              var i2;
              if (!r3) return e3;
              for (var l = /\((?:\?<(.*?)>)?(?!\?)/g, u = 0, c = l.exec(e3.source); c; ) r3.push({ name: c[1] || u++, prefix: "", suffix: "", modifier: "", pattern: "" }), c = l.exec(e3.source);
              return e3;
            }
            return Array.isArray(e3) ? (i2 = e3.map(function(e4) {
              return s(e4, r3, n2).source;
            }), new RegExp("(?:".concat(i2.join("|"), ")"), o(n2))) : a(t2(e3, n2), r3, n2);
          }
          Object.defineProperty(e2, "__esModule", { value: true }), e2.pathToRegexp = e2.tokensToRegexp = e2.regexpToFunction = e2.match = e2.tokensToFunction = e2.compile = e2.parse = void 0, e2.parse = t2, e2.compile = function(e3, n2) {
            return r2(t2(e3, n2), n2);
          }, e2.tokensToFunction = r2, e2.match = function(e3, t3) {
            var r3 = [];
            return n(s(e3, r3, t3), r3, t3);
          }, e2.regexpToFunction = n, e2.tokensToRegexp = a, e2.pathToRegexp = s;
        })(), t.exports = e2;
      })();
    }, 64445, (e, t, r) => {
      var n = { 226: function(t2, r2) {
        !function(n2) {
          "use strict";
          var i2 = "function", o2 = "undefined", a = "object", s = "string", l = "major", u = "model", c = "name", d = "type", h = "vendor", p = "version", f = "architecture", g = "console", m = "mobile", v = "tablet", b = "smarttv", w = "wearable", y = "embedded", _ = "Amazon", x = "Apple", E = "ASUS", C = "BlackBerry", S = "Browser", R = "Chrome", P = "Firefox", O = "Google", N = "Huawei", T = "Microsoft", A = "Motorola", I = "Opera", M = "Samsung", k = "Sharp", D = "Sony", j = "Xiaomi", L = "Zebra", U = "Facebook", q = "Chromium OS", $ = "Mac OS", B = function(e2, t3) {
            var r3 = {};
            for (var n3 in e2) t3[n3] && t3[n3].length % 2 == 0 ? r3[n3] = t3[n3].concat(e2[n3]) : r3[n3] = e2[n3];
            return r3;
          }, F = function(e2) {
            for (var t3 = {}, r3 = 0; r3 < e2.length; r3++) t3[e2[r3].toUpperCase()] = e2[r3];
            return t3;
          }, H = function(e2, t3) {
            return typeof e2 === s && -1 !== V(t3).indexOf(V(e2));
          }, V = function(e2) {
            return e2.toLowerCase();
          }, z = function(e2, t3) {
            if (typeof e2 === s) return e2 = e2.replace(/^\s\s*/, ""), typeof t3 === o2 ? e2 : e2.substring(0, 350);
          }, G = function(e2, t3) {
            for (var r3, n3, o3, s2, l2, u2, c2 = 0; c2 < t3.length && !l2; ) {
              var d2 = t3[c2], h2 = t3[c2 + 1];
              for (r3 = n3 = 0; r3 < d2.length && !l2 && d2[r3]; ) if (l2 = d2[r3++].exec(e2)) for (o3 = 0; o3 < h2.length; o3++) u2 = l2[++n3], typeof (s2 = h2[o3]) === a && s2.length > 0 ? 2 === s2.length ? typeof s2[1] == i2 ? this[s2[0]] = s2[1].call(this, u2) : this[s2[0]] = s2[1] : 3 === s2.length ? typeof s2[1] !== i2 || s2[1].exec && s2[1].test ? this[s2[0]] = u2 ? u2.replace(s2[1], s2[2]) : void 0 : this[s2[0]] = u2 ? s2[1].call(this, u2, s2[2]) : void 0 : 4 === s2.length && (this[s2[0]] = u2 ? s2[3].call(this, u2.replace(s2[1], s2[2])) : void 0) : this[s2] = u2 || void 0;
              c2 += 2;
            }
          }, X = function(e2, t3) {
            for (var r3 in t3) if (typeof t3[r3] === a && t3[r3].length > 0) {
              for (var n3 = 0; n3 < t3[r3].length; n3++) if (H(t3[r3][n3], e2)) return "?" === r3 ? void 0 : r3;
            } else if (H(t3[r3], e2)) return "?" === r3 ? void 0 : r3;
            return e2;
          }, W = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, K = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [p, [c, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [p, [c, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [c, p], [/opios[\/ ]+([\w\.]+)/i], [p, [c, I + " Mini"]], [/\bopr\/([\w\.]+)/i], [p, [c, I]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [c, p], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [p, [c, "UC" + S]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [p, [c, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [p, [c, "WeChat"]], [/konqueror\/([\w\.]+)/i], [p, [c, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [p, [c, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [p, [c, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[c, /(.+)/, "$1 Secure " + S], p], [/\bfocus\/([\w\.]+)/i], [p, [c, P + " Focus"]], [/\bopt\/([\w\.]+)/i], [p, [c, I + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [p, [c, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [p, [c, "Dolphin"]], [/coast\/([\w\.]+)/i], [p, [c, I + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [p, [c, "MIUI " + S]], [/fxios\/([-\w\.]+)/i], [p, [c, P]], [/\bqihu|(qi?ho?o?|360)browser/i], [[c, "360 " + S]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[c, /(.+)/, "$1 " + S], p], [/(comodo_dragon)\/([\w\.]+)/i], [[c, /_/g, " "], p], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [c, p], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [c], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[c, U], p], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [c, p], [/\bgsa\/([\w\.]+) .*safari\//i], [p, [c, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [p, [c, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [p, [c, R + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[c, R + " WebView"], p], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [p, [c, "Android " + S]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [c, p], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [p, [c, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [p, c], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [c, [p, X, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [c, p], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[c, "Netscape"], p], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [p, [c, P + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [c, p], [/(cobalt)\/([\w\.]+)/i], [c, [p, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[f, "amd64"]], [/(ia32(?=;))/i], [[f, V]], [/((?:i[346]|x)86)[;\)]/i], [[f, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[f, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[f, "armhf"]], [/windows (ce|mobile); ppc;/i], [[f, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[f, /ower/, "", V]], [/(sun4\w)[;\)]/i], [[f, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[f, V]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [u, [h, M], [d, v]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [u, [h, M], [d, m]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [u, [h, x], [d, m]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [u, [h, x], [d, v]], [/(macintosh);/i], [u, [h, x]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [u, [h, k], [d, m]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [u, [h, N], [d, v]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [u, [h, N], [d, m]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[u, /_/g, " "], [h, j], [d, m]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[u, /_/g, " "], [h, j], [d, v]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [u, [h, "OPPO"], [d, m]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [u, [h, "Vivo"], [d, m]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [u, [h, "Realme"], [d, m]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [u, [h, A], [d, m]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [u, [h, A], [d, v]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [u, [h, "LG"], [d, v]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [u, [h, "LG"], [d, m]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [u, [h, "Lenovo"], [d, v]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[u, /_/g, " "], [h, "Nokia"], [d, m]], [/(pixel c)\b/i], [u, [h, O], [d, v]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [u, [h, O], [d, m]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [u, [h, D], [d, m]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[u, "Xperia Tablet"], [h, D], [d, v]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [u, [h, "OnePlus"], [d, m]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [u, [h, _], [d, v]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[u, /(.+)/g, "Fire Phone $1"], [h, _], [d, m]], [/(playbook);[-\w\),; ]+(rim)/i], [u, h, [d, v]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [u, [h, C], [d, m]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [u, [h, E], [d, v]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [u, [h, E], [d, m]], [/(nexus 9)/i], [u, [h, "HTC"], [d, v]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [h, [u, /_/g, " "], [d, m]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [u, [h, "Acer"], [d, v]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [u, [h, "Meizu"], [d, m]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [h, u, [d, m]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [h, u, [d, v]], [/(surface duo)/i], [u, [h, T], [d, v]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [u, [h, "Fairphone"], [d, m]], [/(u304aa)/i], [u, [h, "AT&T"], [d, m]], [/\bsie-(\w*)/i], [u, [h, "Siemens"], [d, m]], [/\b(rct\w+) b/i], [u, [h, "RCA"], [d, v]], [/\b(venue[\d ]{2,7}) b/i], [u, [h, "Dell"], [d, v]], [/\b(q(?:mv|ta)\w+) b/i], [u, [h, "Verizon"], [d, v]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [u, [h, "Barnes & Noble"], [d, v]], [/\b(tm\d{3}\w+) b/i], [u, [h, "NuVision"], [d, v]], [/\b(k88) b/i], [u, [h, "ZTE"], [d, v]], [/\b(nx\d{3}j) b/i], [u, [h, "ZTE"], [d, m]], [/\b(gen\d{3}) b.+49h/i], [u, [h, "Swiss"], [d, m]], [/\b(zur\d{3}) b/i], [u, [h, "Swiss"], [d, v]], [/\b((zeki)?tb.*\b) b/i], [u, [h, "Zeki"], [d, v]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[h, "Dragon Touch"], u, [d, v]], [/\b(ns-?\w{0,9}) b/i], [u, [h, "Insignia"], [d, v]], [/\b((nxa|next)-?\w{0,9}) b/i], [u, [h, "NextBook"], [d, v]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[h, "Voice"], u, [d, m]], [/\b(lvtel\-)?(v1[12]) b/i], [[h, "LvTel"], u, [d, m]], [/\b(ph-1) /i], [u, [h, "Essential"], [d, m]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [u, [h, "Envizen"], [d, v]], [/\b(trio[-\w\. ]+) b/i], [u, [h, "MachSpeed"], [d, v]], [/\btu_(1491) b/i], [u, [h, "Rotor"], [d, v]], [/(shield[\w ]+) b/i], [u, [h, "Nvidia"], [d, v]], [/(sprint) (\w+)/i], [h, u, [d, m]], [/(kin\.[onetw]{3})/i], [[u, /\./g, " "], [h, T], [d, m]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [u, [h, L], [d, v]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [u, [h, L], [d, m]], [/smart-tv.+(samsung)/i], [h, [d, b]], [/hbbtv.+maple;(\d+)/i], [[u, /^/, "SmartTV"], [h, M], [d, b]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[h, "LG"], [d, b]], [/(apple) ?tv/i], [h, [u, x + " TV"], [d, b]], [/crkey/i], [[u, R + "cast"], [h, O], [d, b]], [/droid.+aft(\w)( bui|\))/i], [u, [h, _], [d, b]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [u, [h, k], [d, b]], [/(bravia[\w ]+)( bui|\))/i], [u, [h, D], [d, b]], [/(mitv-\w{5}) bui/i], [u, [h, j], [d, b]], [/Hbbtv.*(technisat) (.*);/i], [h, u, [d, b]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[h, z], [u, z], [d, b]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[d, b]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [h, u, [d, g]], [/droid.+; (shield) bui/i], [u, [h, "Nvidia"], [d, g]], [/(playstation [345portablevi]+)/i], [u, [h, D], [d, g]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [u, [h, T], [d, g]], [/((pebble))app/i], [h, u, [d, w]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [u, [h, x], [d, w]], [/droid.+; (glass) \d/i], [u, [h, O], [d, w]], [/droid.+; (wt63?0{2,3})\)/i], [u, [h, L], [d, w]], [/(quest( 2| pro)?)/i], [u, [h, U], [d, w]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [h, [d, y]], [/(aeobc)\b/i], [u, [h, _], [d, y]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [u, [d, m]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [u, [d, v]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[d, v]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[d, m]], [/(android[-\w\. ]{0,9});.+buil/i], [u, [h, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [p, [c, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [p, [c, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [c, p], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [p, c]], os: [[/microsoft (windows) (vista|xp)/i], [c, p], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [c, [p, X, W]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[c, "Windows"], [p, X, W]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[p, /_/g, "."], [c, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[c, $], [p, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [p, c], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [c, p], [/\(bb(10);/i], [p, [c, C]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [p, [c, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [p, [c, P + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [p, [c, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [p, [c, "watchOS"]], [/crkey\/([\d\.]+)/i], [p, [c, R + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[c, q], p], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [c, p], [/(sunos) ?([\w\.\d]*)/i], [[c, "Solaris"], p], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [c, p]] }, J = function(e2, t3) {
            if (typeof e2 === a && (t3 = e2, e2 = void 0), !(this instanceof J)) return new J(e2, t3).getResult();
            var r3 = typeof n2 !== o2 && n2.navigator ? n2.navigator : void 0, g2 = e2 || (r3 && r3.userAgent ? r3.userAgent : ""), b2 = r3 && r3.userAgentData ? r3.userAgentData : void 0, w2 = t3 ? B(K, t3) : K, y2 = r3 && r3.userAgent == g2;
            return this.getBrowser = function() {
              var e3, t4 = {};
              return t4[c] = void 0, t4[p] = void 0, G.call(t4, g2, w2.browser), t4[l] = typeof (e3 = t4[p]) === s ? e3.replace(/[^\d\.]/g, "").split(".")[0] : void 0, y2 && r3 && r3.brave && typeof r3.brave.isBrave == i2 && (t4[c] = "Brave"), t4;
            }, this.getCPU = function() {
              var e3 = {};
              return e3[f] = void 0, G.call(e3, g2, w2.cpu), e3;
            }, this.getDevice = function() {
              var e3 = {};
              return e3[h] = void 0, e3[u] = void 0, e3[d] = void 0, G.call(e3, g2, w2.device), y2 && !e3[d] && b2 && b2.mobile && (e3[d] = m), y2 && "Macintosh" == e3[u] && r3 && typeof r3.standalone !== o2 && r3.maxTouchPoints && r3.maxTouchPoints > 2 && (e3[u] = "iPad", e3[d] = v), e3;
            }, this.getEngine = function() {
              var e3 = {};
              return e3[c] = void 0, e3[p] = void 0, G.call(e3, g2, w2.engine), e3;
            }, this.getOS = function() {
              var e3 = {};
              return e3[c] = void 0, e3[p] = void 0, G.call(e3, g2, w2.os), y2 && !e3[c] && b2 && "Unknown" != b2.platform && (e3[c] = b2.platform.replace(/chrome os/i, q).replace(/macos/i, $)), e3;
            }, this.getResult = function() {
              return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
            }, this.getUA = function() {
              return g2;
            }, this.setUA = function(e3) {
              return g2 = typeof e3 === s && e3.length > 350 ? z(e3, 350) : e3, this;
            }, this.setUA(g2), this;
          };
          if (J.VERSION = "1.0.35", J.BROWSER = F([c, p, l]), J.CPU = F([f]), J.DEVICE = F([u, h, d, g, m, b, v, w, y]), J.ENGINE = J.OS = F([c, p]), typeof r2 !== o2) t2.exports && (r2 = t2.exports = J), r2.UAParser = J;
          else if (typeof define === i2 && define.amd) e.r, void 0 !== J && e.v(J);
          else typeof n2 !== o2 && (n2.UAParser = J);
          var Z = typeof n2 !== o2 && (n2.jQuery || n2.Zepto);
          if (Z && !Z.ua) {
            var Q = new J();
            Z.ua = Q.getResult(), Z.ua.get = function() {
              return Q.getUA();
            }, Z.ua.set = function(e2) {
              Q.setUA(e2);
              var t3 = Q.getResult();
              for (var r3 in t3) Z.ua[r3] = t3[r3];
            };
          }
        }(this);
      } }, i = {};
      function o(e2) {
        var t2 = i[e2];
        if (void 0 !== t2) return t2.exports;
        var r2 = i[e2] = { exports: {} }, a = true;
        try {
          n[e2].call(r2.exports, r2, r2.exports, o), a = false;
        } finally {
          a && delete i[e2];
        }
        return r2.exports;
      }
      o.ab = "/ROOT/node_modules/next/dist/compiled/ua-parser-js/", t.exports = o(226);
    }, 8946, (e, t, r) => {
      "use strict";
      var n = { H: null, A: null };
      function i(e2) {
        var t2 = "https://react.dev/errors/" + e2;
        if (1 < arguments.length) {
          t2 += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var r2 = 2; r2 < arguments.length; r2++) t2 += "&args[]=" + encodeURIComponent(arguments[r2]);
        }
        return "Minified React error #" + e2 + "; visit " + t2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var o = Array.isArray;
      function a() {
      }
      var s = Symbol.for("react.transitional.element"), l = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), h = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), f = Symbol.for("react.memo"), g = Symbol.for("react.lazy"), m = Symbol.for("react.activity"), v = Symbol.for("react.view_transition"), b = Symbol.iterator, w = Object.prototype.hasOwnProperty, y = Object.assign;
      function _(e2, t2, r2) {
        var n2 = r2.ref;
        return { $$typeof: s, type: e2, key: t2, ref: void 0 !== n2 ? n2 : null, props: r2 };
      }
      function x(e2) {
        return "object" == typeof e2 && null !== e2 && e2.$$typeof === s;
      }
      var E = /\/+/g;
      function C(e2, t2) {
        var r2, n2;
        return "object" == typeof e2 && null !== e2 && null != e2.key ? (r2 = "" + e2.key, n2 = { "=": "=0", ":": "=2" }, "$" + r2.replace(/[=:]/g, function(e3) {
          return n2[e3];
        })) : t2.toString(36);
      }
      function S(e2, t2, r2) {
        if (null == e2) return e2;
        var n2 = [], u2 = 0;
        return !function e3(t3, r3, n3, u3, c2) {
          var d2, h2, p2, f2 = typeof t3;
          ("undefined" === f2 || "boolean" === f2) && (t3 = null);
          var m2 = false;
          if (null === t3) m2 = true;
          else switch (f2) {
            case "bigint":
            case "string":
            case "number":
              m2 = true;
              break;
            case "object":
              switch (t3.$$typeof) {
                case s:
                case l:
                  m2 = true;
                  break;
                case g:
                  return e3((m2 = t3._init)(t3._payload), r3, n3, u3, c2);
              }
          }
          if (m2) return c2 = c2(t3), m2 = "" === u3 ? "." + C(t3, 0) : u3, o(c2) ? (n3 = "", null != m2 && (n3 = m2.replace(E, "$&/") + "/"), e3(c2, r3, n3, "", function(e4) {
            return e4;
          })) : null != c2 && (x(c2) && (d2 = c2, h2 = n3 + (null == c2.key || t3 && t3.key === c2.key ? "" : ("" + c2.key).replace(E, "$&/") + "/") + m2, c2 = _(d2.type, h2, d2.props)), r3.push(c2)), 1;
          m2 = 0;
          var v2 = "" === u3 ? "." : u3 + ":";
          if (o(t3)) for (var w2 = 0; w2 < t3.length; w2++) f2 = v2 + C(u3 = t3[w2], w2), m2 += e3(u3, r3, n3, f2, c2);
          else if ("function" == typeof (w2 = null === (p2 = t3) || "object" != typeof p2 ? null : "function" == typeof (p2 = b && p2[b] || p2["@@iterator"]) ? p2 : null)) for (t3 = w2.call(t3), w2 = 0; !(u3 = t3.next()).done; ) f2 = v2 + C(u3 = u3.value, w2++), m2 += e3(u3, r3, n3, f2, c2);
          else if ("object" === f2) {
            if ("function" == typeof t3.then) return e3(function(e4) {
              switch (e4.status) {
                case "fulfilled":
                  return e4.value;
                case "rejected":
                  throw e4.reason;
                default:
                  switch ("string" == typeof e4.status ? e4.then(a, a) : (e4.status = "pending", e4.then(function(t4) {
                    "pending" === e4.status && (e4.status = "fulfilled", e4.value = t4);
                  }, function(t4) {
                    "pending" === e4.status && (e4.status = "rejected", e4.reason = t4);
                  })), e4.status) {
                    case "fulfilled":
                      return e4.value;
                    case "rejected":
                      throw e4.reason;
                  }
              }
              throw e4;
            }(t3), r3, n3, u3, c2);
            throw Error(i(31, "[object Object]" === (r3 = String(t3)) ? "object with keys {" + Object.keys(t3).join(", ") + "}" : r3));
          }
          return m2;
        }(e2, n2, "", "", function(e3) {
          return t2.call(r2, e3, u2++);
        }), n2;
      }
      function R(e2) {
        if (-1 === e2._status) {
          var t2 = (0, e2._result)();
          t2.then(function(r2) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 1, e2._result = r2, void 0 === t2.status && (t2.status = "fulfilled", t2.value = r2));
          }, function(r2) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 2, e2._result = r2, void 0 === t2.status && (t2.status = "rejected", t2.reason = r2));
          }), -1 === e2._status && (e2._status = 0, e2._result = t2);
        }
        if (1 === e2._status) return e2._result.default;
        throw e2._result;
      }
      function P() {
        return /* @__PURE__ */ new WeakMap();
      }
      function O() {
        return { s: 0, v: void 0, o: null, p: null };
      }
      r.Activity = m, r.Children = { map: S, forEach: function(e2, t2, r2) {
        S(e2, function() {
          t2.apply(this, arguments);
        }, r2);
      }, count: function(e2) {
        var t2 = 0;
        return S(e2, function() {
          t2++;
        }), t2;
      }, toArray: function(e2) {
        return S(e2, function(e3) {
          return e3;
        }) || [];
      }, only: function(e2) {
        if (!x(e2)) throw Error(i(143));
        return e2;
      } }, r.Fragment = u, r.Profiler = d, r.StrictMode = c, r.Suspense = p, r.ViewTransition = v, r.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = n, r.cache = function(e2) {
        return function() {
          var t2 = n.A;
          if (!t2) return e2.apply(null, arguments);
          var r2 = t2.getCacheForType(P);
          void 0 === (t2 = r2.get(e2)) && (t2 = O(), r2.set(e2, t2)), r2 = 0;
          for (var i2 = arguments.length; r2 < i2; r2++) {
            var o2 = arguments[r2];
            if ("function" == typeof o2 || "object" == typeof o2 && null !== o2) {
              var a2 = t2.o;
              null === a2 && (t2.o = a2 = /* @__PURE__ */ new WeakMap()), void 0 === (t2 = a2.get(o2)) && (t2 = O(), a2.set(o2, t2));
            } else null === (a2 = t2.p) && (t2.p = a2 = /* @__PURE__ */ new Map()), void 0 === (t2 = a2.get(o2)) && (t2 = O(), a2.set(o2, t2));
          }
          if (1 === t2.s) return t2.v;
          if (2 === t2.s) throw t2.v;
          try {
            var s2 = e2.apply(null, arguments);
            return (r2 = t2).s = 1, r2.v = s2;
          } catch (e3) {
            throw (s2 = t2).s = 2, s2.v = e3, e3;
          }
        };
      }, r.cacheSignal = function() {
        var e2 = n.A;
        return e2 ? e2.cacheSignal() : null;
      }, r.captureOwnerStack = function() {
        return null;
      }, r.cloneElement = function(e2, t2, r2) {
        if (null == e2) throw Error(i(267, e2));
        var n2 = y({}, e2.props), o2 = e2.key;
        if (null != t2) for (a2 in void 0 !== t2.key && (o2 = "" + t2.key), t2) w.call(t2, a2) && "key" !== a2 && "__self" !== a2 && "__source" !== a2 && ("ref" !== a2 || void 0 !== t2.ref) && (n2[a2] = t2[a2]);
        var a2 = arguments.length - 2;
        if (1 === a2) n2.children = r2;
        else if (1 < a2) {
          for (var s2 = Array(a2), l2 = 0; l2 < a2; l2++) s2[l2] = arguments[l2 + 2];
          n2.children = s2;
        }
        return _(e2.type, o2, n2);
      }, r.createElement = function(e2, t2, r2) {
        var n2, i2 = {}, o2 = null;
        if (null != t2) for (n2 in void 0 !== t2.key && (o2 = "" + t2.key), t2) w.call(t2, n2) && "key" !== n2 && "__self" !== n2 && "__source" !== n2 && (i2[n2] = t2[n2]);
        var a2 = arguments.length - 2;
        if (1 === a2) i2.children = r2;
        else if (1 < a2) {
          for (var s2 = Array(a2), l2 = 0; l2 < a2; l2++) s2[l2] = arguments[l2 + 2];
          i2.children = s2;
        }
        if (e2 && e2.defaultProps) for (n2 in a2 = e2.defaultProps) void 0 === i2[n2] && (i2[n2] = a2[n2]);
        return _(e2, o2, i2);
      }, r.createRef = function() {
        return { current: null };
      }, r.forwardRef = function(e2) {
        return { $$typeof: h, render: e2 };
      }, r.isValidElement = x, r.lazy = function(e2) {
        return { $$typeof: g, _payload: { _status: -1, _result: e2 }, _init: R };
      }, r.memo = function(e2, t2) {
        return { $$typeof: f, type: e2, compare: void 0 === t2 ? null : t2 };
      }, r.use = function(e2) {
        return n.H.use(e2);
      }, r.useCallback = function(e2, t2) {
        return n.H.useCallback(e2, t2);
      }, r.useDebugValue = function() {
      }, r.useId = function() {
        return n.H.useId();
      }, r.useMemo = function(e2, t2) {
        return n.H.useMemo(e2, t2);
      }, r.version = "19.3.0-canary-3f0b9e61-20260317";
    }, 40049, (e, t, r) => {
      "use strict";
      t.exports = e.r(8946);
    }, 53496, (e, t, r) => {
      "use strict";
      var n = Object.defineProperty, i = Object.getOwnPropertyDescriptor, o = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, s = (e3, t2) => {
        for (var r2 in t2) n(e3, r2, { get: t2[r2], enumerable: true });
      }, l = {};
      s(l, { Decimal: () => e2, Public: () => u, getRuntime: () => E, makeStrictEnum: () => _, objectEnumValues: () => b }), t.exports = ((e3, t2, r2, s2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let l2 of o(t2)) a.call(e3, l2) || l2 === r2 || n(e3, l2, { get: () => t2[l2], enumerable: !(s2 = i(t2, l2)) || s2.enumerable });
        return e3;
      })(n({}, "__esModule", { value: true }), l);
      var u = {};
      function c() {
        return (e3) => e3;
      }
      s(u, { validator: () => c });
      var d = Symbol(), h = /* @__PURE__ */ new WeakMap(), p = class {
        constructor(e3) {
          e3 === d ? h.set(this, "Prisma.".concat(this._getName())) : h.set(this, "new Prisma.".concat(this._getNamespace(), ".").concat(this._getName(), "()"));
        }
        _getName() {
          return this.constructor.name;
        }
        toString() {
          return h.get(this);
        }
      }, f = class extends p {
        _getNamespace() {
          return "NullTypes";
        }
      }, g = class extends f {
      };
      w(g, "DbNull");
      var m = class extends f {
      };
      w(m, "JsonNull");
      var v = class extends f {
      };
      w(v, "AnyNull");
      var b = { classes: { DbNull: g, JsonNull: m, AnyNull: v }, instances: { DbNull: new g(d), JsonNull: new m(d), AnyNull: new v(d) } };
      function w(e3, t2) {
        Object.defineProperty(e3, "name", { value: t2, configurable: true });
      }
      var y = /* @__PURE__ */ new Set(["toJSON", "$$typeof", "asymmetricMatch", Symbol.iterator, Symbol.toStringTag, Symbol.isConcatSpreadable, Symbol.toPrimitive]);
      function _(e3) {
        return new Proxy(e3, { get(e4, t2) {
          if (t2 in e4) return e4[t2];
          if (!y.has(t2)) throw TypeError("Invalid enum value: ".concat(String(t2)));
        } });
      }
      var x = { node: "Node.js", workerd: "Cloudflare Workers", deno: "Deno and Deno Deploy", netlify: "Netlify Edge Functions", "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)" };
      function E() {
        let e3 = "object" == typeof Netlify ? "netlify" : "edge-light";
        return { id: e3, prettyName: x[e3] || e3, isEdge: ["workerd", "deno", "netlify", "edge-light"].includes(e3) };
      }
      var C, S, R = "0123456789abcdef", P = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058", O = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789", N = { precision: 20, rounding: 4, modulo: 1, toExpNeg: -7, toExpPos: 21, minE: -9e15, maxE: 9e15, crypto: false }, T = true, A = "[DecimalError] ", I = A + "Invalid argument: ", M = A + "Precision limit exceeded", k = A + "crypto unavailable", D = "[object Decimal]", j = Math.floor, L = Math.pow, U = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i, q = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i, $ = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i, B = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, F = P.length - 1, H = O.length - 1, V = { toStringTag: D };
      function z(e3) {
        var t2, r2, n2, i2 = e3.length - 1, o2 = "", a2 = e3[0];
        if (i2 > 0) {
          for (o2 += a2, t2 = 1; t2 < i2; t2++) (r2 = 7 - (n2 = e3[t2] + "").length) && (o2 += er(r2)), o2 += n2;
          (r2 = 7 - (n2 = (a2 = e3[t2]) + "").length) && (o2 += er(r2));
        } else if (0 === a2) return "0";
        for (; a2 % 10 == 0; ) a2 /= 10;
        return o2 + a2;
      }
      function G(e3, t2, r2) {
        if (e3 !== ~~e3 || e3 < t2 || e3 > r2) throw Error(I + e3);
      }
      function X(e3, t2, r2, n2) {
        var i2, o2, a2, s2;
        for (o2 = e3[0]; o2 >= 10; o2 /= 10) --t2;
        return --t2 < 0 ? (t2 += 7, i2 = 0) : (i2 = Math.ceil((t2 + 1) / 7), t2 %= 7), o2 = L(10, 7 - t2), s2 = e3[i2] % o2 | 0, null == n2 ? t2 < 3 ? (0 == t2 ? s2 = s2 / 100 | 0 : 1 == t2 && (s2 = s2 / 10 | 0), a2 = r2 < 4 && 99999 == s2 || r2 > 3 && 49999 == s2 || 5e4 == s2 || 0 == s2) : a2 = (r2 < 4 && s2 + 1 == o2 || r2 > 3 && s2 + 1 == o2 / 2) && (e3[i2 + 1] / o2 / 100 | 0) == L(10, t2 - 2) - 1 || (s2 == o2 / 2 || 0 == s2) && (e3[i2 + 1] / o2 / 100 | 0) == 0 : t2 < 4 ? (0 == t2 ? s2 = s2 / 1e3 | 0 : 1 == t2 ? s2 = s2 / 100 | 0 : 2 == t2 && (s2 = s2 / 10 | 0), a2 = (n2 || r2 < 4) && 9999 == s2 || !n2 && r2 > 3 && 4999 == s2) : a2 = ((n2 || r2 < 4) && s2 + 1 == o2 || !n2 && r2 > 3 && s2 + 1 == o2 / 2) && (e3[i2 + 1] / o2 / 1e3 | 0) == L(10, t2 - 3) - 1, a2;
      }
      function W(e3, t2, r2) {
        for (var n2, i2, o2 = [0], a2 = 0, s2 = e3.length; a2 < s2; ) {
          for (i2 = o2.length; i2--; ) o2[i2] *= t2;
          for (o2[0] += R.indexOf(e3.charAt(a2++)), n2 = 0; n2 < o2.length; n2++) o2[n2] > r2 - 1 && (void 0 === o2[n2 + 1] && (o2[n2 + 1] = 0), o2[n2 + 1] += o2[n2] / r2 | 0, o2[n2] %= r2);
        }
        return o2.reverse();
      }
      V.absoluteValue = V.abs = function() {
        var e3 = new this.constructor(this);
        return e3.s < 0 && (e3.s = 1), J(e3);
      }, V.ceil = function() {
        return J(new this.constructor(this), this.e + 1, 2);
      }, V.clampedTo = V.clamp = function(e3, t2) {
        var r2 = this.constructor;
        if (e3 = new r2(e3), t2 = new r2(t2), !e3.s || !t2.s) return new r2(NaN);
        if (e3.gt(t2)) throw Error(I + t2);
        return 0 > this.cmp(e3) ? e3 : this.cmp(t2) > 0 ? t2 : new r2(this);
      }, V.comparedTo = V.cmp = function(e3) {
        var t2, r2, n2, i2, o2 = this.d, a2 = (e3 = new this.constructor(e3)).d, s2 = this.s, l2 = e3.s;
        if (!o2 || !a2) return s2 && l2 ? s2 !== l2 ? s2 : o2 === a2 ? 0 : !o2 ^ s2 < 0 ? 1 : -1 : NaN;
        if (!o2[0] || !a2[0]) return o2[0] ? s2 : a2[0] ? -l2 : 0;
        if (s2 !== l2) return s2;
        if (this.e !== e3.e) return this.e > e3.e ^ s2 < 0 ? 1 : -1;
        for (n2 = o2.length, i2 = a2.length, t2 = 0, r2 = n2 < i2 ? n2 : i2; t2 < r2; ++t2) if (o2[t2] !== a2[t2]) return o2[t2] > a2[t2] ^ s2 < 0 ? 1 : -1;
        return n2 === i2 ? 0 : n2 > i2 ^ s2 < 0 ? 1 : -1;
      }, V.cosine = V.cos = function() {
        var e3, t2, r2 = this, n2 = r2.constructor;
        return r2.d ? r2.d[0] ? (e3 = n2.precision, t2 = n2.rounding, n2.precision = e3 + Math.max(r2.e, r2.sd()) + 7, n2.rounding = 1, r2 = function(e4, t3) {
          var r3, n3, i2;
          if (t3.isZero()) return t3;
          (n3 = t3.d.length) < 32 ? i2 = (1 / ed(4, r3 = Math.ceil(n3 / 3))).toString() : (r3 = 16, i2 = "2.3283064365386962890625e-10"), e4.precision += r3, t3 = ec(e4, 1, t3.times(i2), new e4(1));
          for (var o2 = r3; o2--; ) {
            var a2 = t3.times(t3);
            t3 = a2.times(a2).minus(a2).times(8).plus(1);
          }
          return e4.precision -= r3, t3;
        }(n2, eh(n2, r2)), n2.precision = e3, n2.rounding = t2, J(2 == S || 3 == S ? r2.neg() : r2, e3, t2, true)) : new n2(1) : new n2(NaN);
      }, V.cubeRoot = V.cbrt = function() {
        var e3, t2, r2, n2, i2, o2, a2, s2, l2, u2, c2 = this.constructor;
        if (!this.isFinite() || this.isZero()) return new c2(this);
        for (T = false, (o2 = this.s * L(this.s * this, 1 / 3)) && Math.abs(o2) != 1 / 0 ? n2 = new c2(o2.toString()) : (r2 = z(this.d), (o2 = ((e3 = this.e) - r2.length + 1) % 3) && (r2 += 1 == o2 || -2 == o2 ? "0" : "00"), o2 = L(r2, 1 / 3), e3 = j((e3 + 1) / 3) - (e3 % 3 == (e3 < 0 ? -1 : 2)), (n2 = new c2(r2 = o2 == 1 / 0 ? "5e" + e3 : (r2 = o2.toExponential()).slice(0, r2.indexOf("e") + 1) + e3)).s = this.s), a2 = (e3 = c2.precision) + 3; ; ) if (n2 = K((u2 = (l2 = (s2 = n2).times(s2).times(s2)).plus(this)).plus(this).times(s2), u2.plus(l2), a2 + 2, 1), z(s2.d).slice(0, a2) === (r2 = z(n2.d)).slice(0, a2)) if ("9999" != (r2 = r2.slice(a2 - 3, a2 + 1)) && (i2 || "4999" != r2)) {
          +r2 && (+r2.slice(1) || "5" != r2.charAt(0)) || (J(n2, e3 + 1, 1), t2 = !n2.times(n2).times(n2).eq(this));
          break;
        } else {
          if (!i2 && (J(s2, e3 + 1, 0), s2.times(s2).times(s2).eq(this))) {
            n2 = s2;
            break;
          }
          a2 += 4, i2 = 1;
        }
        return T = true, J(n2, e3, c2.rounding, t2);
      }, V.decimalPlaces = V.dp = function() {
        var e3, t2 = this.d, r2 = NaN;
        if (t2) {
          if (r2 = ((e3 = t2.length - 1) - j(this.e / 7)) * 7, e3 = t2[e3]) for (; e3 % 10 == 0; e3 /= 10) r2--;
          r2 < 0 && (r2 = 0);
        }
        return r2;
      }, V.dividedBy = V.div = function(e3) {
        return K(this, new this.constructor(e3));
      }, V.dividedToIntegerBy = V.divToInt = function(e3) {
        var t2 = this.constructor;
        return J(K(this, new t2(e3), 0, 1, 1), t2.precision, t2.rounding);
      }, V.equals = V.eq = function(e3) {
        return 0 === this.cmp(e3);
      }, V.floor = function() {
        return J(new this.constructor(this), this.e + 1, 3);
      }, V.greaterThan = V.gt = function(e3) {
        return this.cmp(e3) > 0;
      }, V.greaterThanOrEqualTo = V.gte = function(e3) {
        var t2 = this.cmp(e3);
        return 1 == t2 || 0 === t2;
      }, V.hyperbolicCosine = V.cosh = function() {
        var e3, t2, r2, n2, i2, o2 = this, a2 = o2.constructor, s2 = new a2(1);
        if (!o2.isFinite()) return new a2(o2.s ? 1 / 0 : NaN);
        if (o2.isZero()) return s2;
        r2 = a2.precision, n2 = a2.rounding, a2.precision = r2 + Math.max(o2.e, o2.sd()) + 4, a2.rounding = 1, (i2 = o2.d.length) < 32 ? t2 = (1 / ed(4, e3 = Math.ceil(i2 / 3))).toString() : (e3 = 16, t2 = "2.3283064365386962890625e-10"), o2 = ec(a2, 1, o2.times(t2), new a2(1), true);
        for (var l2, u2 = e3, c2 = new a2(8); u2--; ) l2 = o2.times(o2), o2 = s2.minus(l2.times(c2.minus(l2.times(c2))));
        return J(o2, a2.precision = r2, a2.rounding = n2, true);
      }, V.hyperbolicSine = V.sinh = function() {
        var e3, t2, r2, n2, i2 = this, o2 = i2.constructor;
        if (!i2.isFinite() || i2.isZero()) return new o2(i2);
        if (t2 = o2.precision, r2 = o2.rounding, o2.precision = t2 + Math.max(i2.e, i2.sd()) + 4, o2.rounding = 1, (n2 = i2.d.length) < 3) i2 = ec(o2, 2, i2, i2, true);
        else {
          e3 = (e3 = 1.4 * Math.sqrt(n2)) > 16 ? 16 : 0 | e3, i2 = ec(o2, 2, i2 = i2.times(1 / ed(5, e3)), i2, true);
          for (var a2, s2 = new o2(5), l2 = new o2(16), u2 = new o2(20); e3--; ) a2 = i2.times(i2), i2 = i2.times(s2.plus(a2.times(l2.times(a2).plus(u2))));
        }
        return o2.precision = t2, o2.rounding = r2, J(i2, t2, r2, true);
      }, V.hyperbolicTangent = V.tanh = function() {
        var e3, t2, r2 = this.constructor;
        return this.isFinite() ? this.isZero() ? new r2(this) : (e3 = r2.precision, t2 = r2.rounding, r2.precision = e3 + 7, r2.rounding = 1, K(this.sinh(), this.cosh(), r2.precision = e3, r2.rounding = t2)) : new r2(this.s);
      }, V.inverseCosine = V.acos = function() {
        var e3, t2 = this, r2 = t2.constructor, n2 = t2.abs().cmp(1), i2 = r2.precision, o2 = r2.rounding;
        return -1 !== n2 ? 0 === n2 ? t2.isNeg() ? ee(r2, i2, o2) : new r2(0) : new r2(NaN) : t2.isZero() ? ee(r2, i2 + 4, o2).times(0.5) : (r2.precision = i2 + 6, r2.rounding = 1, t2 = t2.asin(), e3 = ee(r2, i2 + 4, o2).times(0.5), r2.precision = i2, r2.rounding = o2, e3.minus(t2));
      }, V.inverseHyperbolicCosine = V.acosh = function() {
        var e3, t2, r2 = this, n2 = r2.constructor;
        return r2.lte(1) ? new n2(r2.eq(1) ? 0 : NaN) : r2.isFinite() ? (e3 = n2.precision, t2 = n2.rounding, n2.precision = e3 + Math.max(Math.abs(r2.e), r2.sd()) + 4, n2.rounding = 1, T = false, r2 = r2.times(r2).minus(1).sqrt().plus(r2), T = true, n2.precision = e3, n2.rounding = t2, r2.ln()) : new n2(r2);
      }, V.inverseHyperbolicSine = V.asinh = function() {
        var e3, t2, r2 = this, n2 = r2.constructor;
        return !r2.isFinite() || r2.isZero() ? new n2(r2) : (e3 = n2.precision, t2 = n2.rounding, n2.precision = e3 + 2 * Math.max(Math.abs(r2.e), r2.sd()) + 6, n2.rounding = 1, T = false, r2 = r2.times(r2).plus(1).sqrt().plus(r2), T = true, n2.precision = e3, n2.rounding = t2, r2.ln());
      }, V.inverseHyperbolicTangent = V.atanh = function() {
        var e3, t2, r2, n2, i2 = this, o2 = i2.constructor;
        return i2.isFinite() ? i2.e >= 0 ? new o2(i2.abs().eq(1) ? i2.s / 0 : i2.isZero() ? i2 : NaN) : (e3 = o2.precision, t2 = o2.rounding, Math.max(n2 = i2.sd(), e3) < -(2 * i2.e) - 1 ? J(new o2(i2), e3, t2, true) : (o2.precision = r2 = n2 - i2.e, i2 = K(i2.plus(1), new o2(1).minus(i2), r2 + e3, 1), o2.precision = e3 + 4, o2.rounding = 1, i2 = i2.ln(), o2.precision = e3, o2.rounding = t2, i2.times(0.5))) : new o2(NaN);
      }, V.inverseSine = V.asin = function() {
        var e3, t2, r2, n2, i2 = this, o2 = i2.constructor;
        return i2.isZero() ? new o2(i2) : (t2 = i2.abs().cmp(1), r2 = o2.precision, n2 = o2.rounding, -1 !== t2 ? 0 === t2 ? ((e3 = ee(o2, r2 + 4, n2).times(0.5)).s = i2.s, e3) : new o2(NaN) : (o2.precision = r2 + 6, o2.rounding = 1, i2 = i2.div(new o2(1).minus(i2.times(i2)).sqrt().plus(1)).atan(), o2.precision = r2, o2.rounding = n2, i2.times(2)));
      }, V.inverseTangent = V.atan = function() {
        var e3, t2, r2, n2, i2, o2, a2, s2, l2, u2 = this, c2 = u2.constructor, d2 = c2.precision, h2 = c2.rounding;
        if (u2.isFinite()) {
          if (u2.isZero()) return new c2(u2);
          if (u2.abs().eq(1) && d2 + 4 <= H) return (a2 = ee(c2, d2 + 4, h2).times(0.25)).s = u2.s, a2;
        } else {
          if (!u2.s) return new c2(NaN);
          if (d2 + 4 <= H) return (a2 = ee(c2, d2 + 4, h2).times(0.5)).s = u2.s, a2;
        }
        for (c2.precision = s2 = d2 + 10, c2.rounding = 1, e3 = r2 = Math.min(28, s2 / 7 + 2 | 0); e3; --e3) u2 = u2.div(u2.times(u2).plus(1).sqrt().plus(1));
        for (T = false, t2 = Math.ceil(s2 / 7), n2 = 1, l2 = u2.times(u2), a2 = new c2(u2), i2 = u2; -1 !== e3; ) if (i2 = i2.times(l2), o2 = a2.minus(i2.div(n2 += 2)), i2 = i2.times(l2), void 0 !== (a2 = o2.plus(i2.div(n2 += 2))).d[t2]) for (e3 = t2; a2.d[e3] === o2.d[e3] && e3--; ) ;
        return r2 && (a2 = a2.times(2 << r2 - 1)), T = true, J(a2, c2.precision = d2, c2.rounding = h2, true);
      }, V.isFinite = function() {
        return !!this.d;
      }, V.isInteger = V.isInt = function() {
        return !!this.d && j(this.e / 7) > this.d.length - 2;
      }, V.isNaN = function() {
        return !this.s;
      }, V.isNegative = V.isNeg = function() {
        return this.s < 0;
      }, V.isPositive = V.isPos = function() {
        return this.s > 0;
      }, V.isZero = function() {
        return !!this.d && 0 === this.d[0];
      }, V.lessThan = V.lt = function(e3) {
        return 0 > this.cmp(e3);
      }, V.lessThanOrEqualTo = V.lte = function(e3) {
        return 1 > this.cmp(e3);
      }, V.logarithm = V.log = function(e3) {
        var t2, r2, n2, i2, o2, a2, s2, l2 = this.constructor, u2 = l2.precision, c2 = l2.rounding;
        if (null == e3) e3 = new l2(10), t2 = true;
        else {
          if (r2 = (e3 = new l2(e3)).d, e3.s < 0 || !r2 || !r2[0] || e3.eq(1)) return new l2(NaN);
          t2 = e3.eq(10);
        }
        if (r2 = this.d, this.s < 0 || !r2 || !r2[0] || this.eq(1)) return new l2(r2 && !r2[0] ? -1 / 0 : 1 != this.s ? NaN : r2 ? 0 : 1 / 0);
        if (t2) if (r2.length > 1) i2 = true;
        else {
          for (n2 = r2[0]; n2 % 10 == 0; ) n2 /= 10;
          i2 = 1 !== n2;
        }
        if (T = false, X((s2 = K(o2 = es(this, a2 = u2 + 5), t2 ? Y(l2, a2 + 10) : es(e3, a2), a2, 1)).d, n2 = u2, c2)) do
          if (a2 += 10, s2 = K(o2 = es(this, a2), t2 ? Y(l2, a2 + 10) : es(e3, a2), a2, 1), !i2) {
            +z(s2.d).slice(n2 + 1, n2 + 15) + 1 == 1e14 && (s2 = J(s2, u2 + 1, 0));
            break;
          }
        while (X(s2.d, n2 += 10, c2));
        return T = true, J(s2, u2, c2);
      }, V.minus = V.sub = function(e3) {
        var t2, r2, n2, i2, o2, a2, s2, l2, u2, c2, d2, h2, p2 = this.constructor;
        if (e3 = new p2(e3), !this.d || !e3.d) return this.s && e3.s ? this.d ? e3.s = -e3.s : e3 = new p2(e3.d || this.s !== e3.s ? this : NaN) : e3 = new p2(NaN), e3;
        if (this.s != e3.s) return e3.s = -e3.s, this.plus(e3);
        if (u2 = this.d, h2 = e3.d, s2 = p2.precision, l2 = p2.rounding, !u2[0] || !h2[0]) {
          if (h2[0]) e3.s = -e3.s;
          else {
            if (!u2[0]) return new p2(3 === l2 ? -0 : 0);
            e3 = new p2(this);
          }
          return T ? J(e3, s2, l2) : e3;
        }
        if (r2 = j(e3.e / 7), c2 = j(this.e / 7), u2 = u2.slice(), o2 = c2 - r2) {
          for ((d2 = o2 < 0) ? (t2 = u2, o2 = -o2, a2 = h2.length) : (t2 = h2, r2 = c2, a2 = u2.length), o2 > (n2 = Math.max(Math.ceil(s2 / 7), a2) + 2) && (o2 = n2, t2.length = 1), t2.reverse(), n2 = o2; n2--; ) t2.push(0);
          t2.reverse();
        } else {
          for ((d2 = (n2 = u2.length) < (a2 = h2.length)) && (a2 = n2), n2 = 0; n2 < a2; n2++) if (u2[n2] != h2[n2]) {
            d2 = u2[n2] < h2[n2];
            break;
          }
          o2 = 0;
        }
        for (d2 && (t2 = u2, u2 = h2, h2 = t2, e3.s = -e3.s), a2 = u2.length, n2 = h2.length - a2; n2 > 0; --n2) u2[a2++] = 0;
        for (n2 = h2.length; n2 > o2; ) {
          if (u2[--n2] < h2[n2]) {
            for (i2 = n2; i2 && 0 === u2[--i2]; ) u2[i2] = 1e7 - 1;
            --u2[i2], u2[n2] += 1e7;
          }
          u2[n2] -= h2[n2];
        }
        for (; 0 === u2[--a2]; ) u2.pop();
        for (; 0 === u2[0]; u2.shift()) --r2;
        return u2[0] ? (e3.d = u2, e3.e = Q(u2, r2), T ? J(e3, s2, l2) : e3) : new p2(3 === l2 ? -0 : 0);
      }, V.modulo = V.mod = function(e3) {
        var t2, r2 = this.constructor;
        return e3 = new r2(e3), this.d && e3.s && (!e3.d || e3.d[0]) ? e3.d && (!this.d || this.d[0]) ? (T = false, 9 == r2.modulo ? (t2 = K(this, e3.abs(), 0, 3, 1), t2.s *= e3.s) : t2 = K(this, e3, 0, r2.modulo, 1), t2 = t2.times(e3), T = true, this.minus(t2)) : J(new r2(this), r2.precision, r2.rounding) : new r2(NaN);
      }, V.naturalExponential = V.exp = function() {
        return ea(this);
      }, V.naturalLogarithm = V.ln = function() {
        return es(this);
      }, V.negated = V.neg = function() {
        var e3 = new this.constructor(this);
        return e3.s = -e3.s, J(e3);
      }, V.plus = V.add = function(e3) {
        var t2, r2, n2, i2, o2, a2, s2, l2, u2, c2, d2 = this.constructor;
        if (e3 = new d2(e3), !this.d || !e3.d) return this.s && e3.s ? this.d || (e3 = new d2(e3.d || this.s === e3.s ? this : NaN)) : e3 = new d2(NaN), e3;
        if (this.s != e3.s) return e3.s = -e3.s, this.minus(e3);
        if (u2 = this.d, c2 = e3.d, s2 = d2.precision, l2 = d2.rounding, !u2[0] || !c2[0]) return c2[0] || (e3 = new d2(this)), T ? J(e3, s2, l2) : e3;
        if (o2 = j(this.e / 7), n2 = j(e3.e / 7), u2 = u2.slice(), i2 = o2 - n2) {
          for (i2 < 0 ? (r2 = u2, i2 = -i2, a2 = c2.length) : (r2 = c2, n2 = o2, a2 = u2.length), i2 > (a2 = (o2 = Math.ceil(s2 / 7)) > a2 ? o2 + 1 : a2 + 1) && (i2 = a2, r2.length = 1), r2.reverse(); i2--; ) r2.push(0);
          r2.reverse();
        }
        for ((a2 = u2.length) - (i2 = c2.length) < 0 && (i2 = a2, r2 = c2, c2 = u2, u2 = r2), t2 = 0; i2; ) t2 = (u2[--i2] = u2[i2] + c2[i2] + t2) / 1e7 | 0, u2[i2] %= 1e7;
        for (t2 && (u2.unshift(t2), ++n2), a2 = u2.length; 0 == u2[--a2]; ) u2.pop();
        return e3.d = u2, e3.e = Q(u2, n2), T ? J(e3, s2, l2) : e3;
      }, V.precision = V.sd = function(e3) {
        var t2;
        if (void 0 !== e3 && !!e3 !== e3 && 1 !== e3 && 0 !== e3) throw Error(I + e3);
        return this.d ? (t2 = et(this.d), e3 && this.e + 1 > t2 && (t2 = this.e + 1)) : t2 = NaN, t2;
      }, V.round = function() {
        var e3 = this.constructor;
        return J(new e3(this), this.e + 1, e3.rounding);
      }, V.sine = V.sin = function() {
        var e3, t2, r2 = this, n2 = r2.constructor;
        return r2.isFinite() ? r2.isZero() ? new n2(r2) : (e3 = n2.precision, t2 = n2.rounding, n2.precision = e3 + Math.max(r2.e, r2.sd()) + 7, n2.rounding = 1, r2 = function(e4, t3) {
          var r3, n3 = t3.d.length;
          if (n3 < 3) return t3.isZero() ? t3 : ec(e4, 2, t3, t3);
          r3 = (r3 = 1.4 * Math.sqrt(n3)) > 16 ? 16 : 0 | r3, t3 = ec(e4, 2, t3 = t3.times(1 / ed(5, r3)), t3);
          for (var i2, o2 = new e4(5), a2 = new e4(16), s2 = new e4(20); r3--; ) i2 = t3.times(t3), t3 = t3.times(o2.plus(i2.times(a2.times(i2).minus(s2))));
          return t3;
        }(n2, eh(n2, r2)), n2.precision = e3, n2.rounding = t2, J(S > 2 ? r2.neg() : r2, e3, t2, true)) : new n2(NaN);
      }, V.squareRoot = V.sqrt = function() {
        var e3, t2, r2, n2, i2, o2, a2 = this.d, s2 = this.e, l2 = this.s, u2 = this.constructor;
        if (1 !== l2 || !a2 || !a2[0]) return new u2(!l2 || l2 < 0 && (!a2 || a2[0]) ? NaN : a2 ? this : 1 / 0);
        for (T = false, 0 == (l2 = Math.sqrt(+this)) || l2 == 1 / 0 ? (((t2 = z(a2)).length + s2) % 2 == 0 && (t2 += "0"), l2 = Math.sqrt(t2), s2 = j((s2 + 1) / 2) - (s2 < 0 || s2 % 2), n2 = new u2(t2 = l2 == 1 / 0 ? "5e" + s2 : (t2 = l2.toExponential()).slice(0, t2.indexOf("e") + 1) + s2)) : n2 = new u2(l2.toString()), r2 = (s2 = u2.precision) + 3; ; ) if (n2 = (o2 = n2).plus(K(this, o2, r2 + 2, 1)).times(0.5), z(o2.d).slice(0, r2) === (t2 = z(n2.d)).slice(0, r2)) if ("9999" != (t2 = t2.slice(r2 - 3, r2 + 1)) && (i2 || "4999" != t2)) {
          +t2 && (+t2.slice(1) || "5" != t2.charAt(0)) || (J(n2, s2 + 1, 1), e3 = !n2.times(n2).eq(this));
          break;
        } else {
          if (!i2 && (J(o2, s2 + 1, 0), o2.times(o2).eq(this))) {
            n2 = o2;
            break;
          }
          r2 += 4, i2 = 1;
        }
        return T = true, J(n2, s2, u2.rounding, e3);
      }, V.tangent = V.tan = function() {
        var e3, t2, r2 = this, n2 = r2.constructor;
        return r2.isFinite() ? r2.isZero() ? new n2(r2) : (e3 = n2.precision, t2 = n2.rounding, n2.precision = e3 + 10, n2.rounding = 1, (r2 = r2.sin()).s = 1, r2 = K(r2, new n2(1).minus(r2.times(r2)).sqrt(), e3 + 10, 0), n2.precision = e3, n2.rounding = t2, J(2 == S || 4 == S ? r2.neg() : r2, e3, t2, true)) : new n2(NaN);
      }, V.times = V.mul = function(e3) {
        var t2, r2, n2, i2, o2, a2, s2, l2, u2, c2 = this.constructor, d2 = this.d, h2 = (e3 = new c2(e3)).d;
        if (e3.s *= this.s, !d2 || !d2[0] || !h2 || !h2[0]) return new c2(!e3.s || d2 && !d2[0] && !h2 || h2 && !h2[0] && !d2 ? NaN : !d2 || !h2 ? e3.s / 0 : 0 * e3.s);
        for (r2 = j(this.e / 7) + j(e3.e / 7), (l2 = d2.length) < (u2 = h2.length) && (o2 = d2, d2 = h2, h2 = o2, a2 = l2, l2 = u2, u2 = a2), o2 = [], n2 = a2 = l2 + u2; n2--; ) o2.push(0);
        for (n2 = u2; --n2 >= 0; ) {
          for (t2 = 0, i2 = l2 + n2; i2 > n2; ) s2 = o2[i2] + h2[n2] * d2[i2 - n2 - 1] + t2, o2[i2--] = s2 % 1e7 | 0, t2 = s2 / 1e7 | 0;
          o2[i2] = (o2[i2] + t2) % 1e7 | 0;
        }
        for (; !o2[--a2]; ) o2.pop();
        return t2 ? ++r2 : o2.shift(), e3.d = o2, e3.e = Q(o2, r2), T ? J(e3, c2.precision, c2.rounding) : e3;
      }, V.toBinary = function(e3, t2) {
        return ep(this, 2, e3, t2);
      }, V.toDecimalPlaces = V.toDP = function(e3, t2) {
        var r2 = this, n2 = r2.constructor;
        return r2 = new n2(r2), void 0 === e3 ? r2 : (G(e3, 0, 1e9), void 0 === t2 ? t2 = n2.rounding : G(t2, 0, 8), J(r2, e3 + r2.e + 1, t2));
      }, V.toExponential = function(e3, t2) {
        var r2, n2 = this, i2 = n2.constructor;
        return void 0 === e3 ? r2 = Z(n2, true) : (G(e3, 0, 1e9), void 0 === t2 ? t2 = i2.rounding : G(t2, 0, 8), r2 = Z(n2 = J(new i2(n2), e3 + 1, t2), true, e3 + 1)), n2.isNeg() && !n2.isZero() ? "-" + r2 : r2;
      }, V.toFixed = function(e3, t2) {
        var r2, n2, i2 = this.constructor;
        return void 0 === e3 ? r2 = Z(this) : (G(e3, 0, 1e9), void 0 === t2 ? t2 = i2.rounding : G(t2, 0, 8), r2 = Z(n2 = J(new i2(this), e3 + this.e + 1, t2), false, e3 + n2.e + 1)), this.isNeg() && !this.isZero() ? "-" + r2 : r2;
      }, V.toFraction = function(e3) {
        var t2, r2, n2, i2, o2, a2, s2, l2, u2, c2, d2, h2, p2 = this.d, f2 = this.constructor;
        if (!p2) return new f2(this);
        if (u2 = r2 = new f2(1), n2 = l2 = new f2(0), a2 = (o2 = (t2 = new f2(n2)).e = et(p2) - this.e - 1) % 7, t2.d[0] = L(10, a2 < 0 ? 7 + a2 : a2), null == e3) e3 = o2 > 0 ? t2 : u2;
        else {
          if (!(s2 = new f2(e3)).isInt() || s2.lt(u2)) throw Error(I + s2);
          e3 = s2.gt(t2) ? o2 > 0 ? t2 : u2 : s2;
        }
        for (T = false, s2 = new f2(z(p2)), c2 = f2.precision, f2.precision = o2 = 7 * p2.length * 2; d2 = K(s2, t2, 0, 1, 1), 1 != (i2 = r2.plus(d2.times(n2))).cmp(e3); ) r2 = n2, n2 = i2, i2 = u2, u2 = l2.plus(d2.times(i2)), l2 = i2, i2 = t2, t2 = s2.minus(d2.times(i2)), s2 = i2;
        return i2 = K(e3.minus(r2), n2, 0, 1, 1), l2 = l2.plus(i2.times(u2)), r2 = r2.plus(i2.times(n2)), l2.s = u2.s = this.s, h2 = 1 > K(u2, n2, o2, 1).minus(this).abs().cmp(K(l2, r2, o2, 1).minus(this).abs()) ? [u2, n2] : [l2, r2], f2.precision = c2, T = true, h2;
      }, V.toHexadecimal = V.toHex = function(e3, t2) {
        return ep(this, 16, e3, t2);
      }, V.toNearest = function(e3, t2) {
        var r2 = this, n2 = r2.constructor;
        if (r2 = new n2(r2), null == e3) {
          if (!r2.d) return r2;
          e3 = new n2(1), t2 = n2.rounding;
        } else {
          if (e3 = new n2(e3), void 0 === t2 ? t2 = n2.rounding : G(t2, 0, 8), !r2.d) return e3.s ? r2 : e3;
          if (!e3.d) return e3.s && (e3.s = r2.s), e3;
        }
        return e3.d[0] ? (T = false, r2 = K(r2, e3, 0, t2, 1).times(e3), T = true, J(r2)) : (e3.s = r2.s, r2 = e3), r2;
      }, V.toNumber = function() {
        return +this;
      }, V.toOctal = function(e3, t2) {
        return ep(this, 8, e3, t2);
      }, V.toPower = V.pow = function(e3) {
        var t2, r2, n2, i2, o2, a2, s2 = this, l2 = s2.constructor, u2 = +(e3 = new l2(e3));
        if (!s2.d || !e3.d || !s2.d[0] || !e3.d[0]) return new l2(L(+s2, u2));
        if ((s2 = new l2(s2)).eq(1)) return s2;
        if (n2 = l2.precision, o2 = l2.rounding, e3.eq(1)) return J(s2, n2, o2);
        if ((t2 = j(e3.e / 7)) >= e3.d.length - 1 && (r2 = u2 < 0 ? -u2 : u2) <= 9007199254740991) return i2 = en(l2, s2, r2, n2), e3.s < 0 ? new l2(1).div(i2) : J(i2, n2, o2);
        if ((a2 = s2.s) < 0) {
          if (t2 < e3.d.length - 1) return new l2(NaN);
          if (1 & e3.d[t2] || (a2 = 1), 0 == s2.e && 1 == s2.d[0] && 1 == s2.d.length) return s2.s = a2, s2;
        }
        return (t2 = 0 != (r2 = L(+s2, u2)) && isFinite(r2) ? new l2(r2 + "").e : j(u2 * (Math.log("0." + z(s2.d)) / Math.LN10 + s2.e + 1))) > l2.maxE + 1 || t2 < l2.minE - 1 ? new l2(t2 > 0 ? a2 / 0 : 0) : (T = false, l2.rounding = s2.s = 1, r2 = Math.min(12, (t2 + "").length), (i2 = ea(e3.times(es(s2, n2 + r2)), n2)).d && X((i2 = J(i2, n2 + 5, 1)).d, n2, o2) && (t2 = n2 + 10, +z((i2 = J(ea(e3.times(es(s2, t2 + r2)), t2), t2 + 5, 1)).d).slice(n2 + 1, n2 + 15) + 1 == 1e14 && (i2 = J(i2, n2 + 1, 0))), i2.s = a2, T = true, l2.rounding = o2, J(i2, n2, o2));
      }, V.toPrecision = function(e3, t2) {
        var r2, n2 = this, i2 = n2.constructor;
        return void 0 === e3 ? r2 = Z(n2, n2.e <= i2.toExpNeg || n2.e >= i2.toExpPos) : (G(e3, 1, 1e9), void 0 === t2 ? t2 = i2.rounding : G(t2, 0, 8), r2 = Z(n2 = J(new i2(n2), e3, t2), e3 <= n2.e || n2.e <= i2.toExpNeg, e3)), n2.isNeg() && !n2.isZero() ? "-" + r2 : r2;
      }, V.toSignificantDigits = V.toSD = function(e3, t2) {
        var r2 = this.constructor;
        return void 0 === e3 ? (e3 = r2.precision, t2 = r2.rounding) : (G(e3, 1, 1e9), void 0 === t2 ? t2 = r2.rounding : G(t2, 0, 8)), J(new r2(this), e3, t2);
      }, V.toString = function() {
        var e3 = this.constructor, t2 = Z(this, this.e <= e3.toExpNeg || this.e >= e3.toExpPos);
        return this.isNeg() && !this.isZero() ? "-" + t2 : t2;
      }, V.truncated = V.trunc = function() {
        return J(new this.constructor(this), this.e + 1, 1);
      }, V.valueOf = V.toJSON = function() {
        var e3 = this.constructor, t2 = Z(this, this.e <= e3.toExpNeg || this.e >= e3.toExpPos);
        return this.isNeg() ? "-" + t2 : t2;
      };
      var K = /* @__PURE__ */ function() {
        function e3(e4, t3, r3) {
          var n2, i2 = 0, o2 = e4.length;
          for (e4 = e4.slice(); o2--; ) n2 = e4[o2] * t3 + i2, e4[o2] = n2 % r3 | 0, i2 = n2 / r3 | 0;
          return i2 && e4.unshift(i2), e4;
        }
        function t2(e4, t3, r3, n2) {
          var i2, o2;
          if (r3 != n2) o2 = r3 > n2 ? 1 : -1;
          else for (i2 = o2 = 0; i2 < r3; i2++) if (e4[i2] != t3[i2]) {
            o2 = e4[i2] > t3[i2] ? 1 : -1;
            break;
          }
          return o2;
        }
        function r2(e4, t3, r3, n2) {
          for (var i2 = 0; r3--; ) e4[r3] -= i2, i2 = +(e4[r3] < t3[r3]), e4[r3] = i2 * n2 + e4[r3] - t3[r3];
          for (; !e4[0] && e4.length > 1; ) e4.shift();
        }
        return function(n2, i2, o2, a2, s2, l2) {
          var u2, c2, d2, h2, p2, f2, g2, m2, v2, b2, w2, y2, _2, x2, E2, S2, R2, P2, O2, N2, T2 = n2.constructor, A2 = n2.s == i2.s ? 1 : -1, I2 = n2.d, M2 = i2.d;
          if (!I2 || !I2[0] || !M2 || !M2[0]) return new T2(!n2.s || !i2.s || (I2 ? M2 && I2[0] == M2[0] : !M2) ? NaN : I2 && 0 == I2[0] || !M2 ? 0 * A2 : A2 / 0);
          for (l2 ? (p2 = 1, c2 = n2.e - i2.e) : (l2 = 1e7, p2 = 7, c2 = j(n2.e / p2) - j(i2.e / p2)), O2 = M2.length, R2 = I2.length, b2 = (v2 = new T2(A2)).d = [], d2 = 0; M2[d2] == (I2[d2] || 0); d2++) ;
          if (M2[d2] > (I2[d2] || 0) && c2--, null == o2 ? (x2 = o2 = T2.precision, a2 = T2.rounding) : x2 = s2 ? o2 + (n2.e - i2.e) + 1 : o2, x2 < 0) b2.push(1), f2 = true;
          else {
            if (x2 = x2 / p2 + 2 | 0, d2 = 0, 1 == O2) {
              for (h2 = 0, M2 = M2[0], x2++; (d2 < R2 || h2) && x2--; d2++) E2 = h2 * l2 + (I2[d2] || 0), b2[d2] = E2 / M2 | 0, h2 = E2 % M2 | 0;
              f2 = h2 || d2 < R2;
            } else {
              for ((h2 = l2 / (M2[0] + 1) | 0) > 1 && (M2 = e3(M2, h2, l2), I2 = e3(I2, h2, l2), O2 = M2.length, R2 = I2.length), S2 = O2, y2 = (w2 = I2.slice(0, O2)).length; y2 < O2; ) w2[y2++] = 0;
              (N2 = M2.slice()).unshift(0), P2 = M2[0], M2[1] >= l2 / 2 && ++P2;
              do
                h2 = 0, (u2 = t2(M2, w2, O2, y2)) < 0 ? (_2 = w2[0], O2 != y2 && (_2 = _2 * l2 + (w2[1] || 0)), (h2 = _2 / P2 | 0) > 1 ? (h2 >= l2 && (h2 = l2 - 1), m2 = (g2 = e3(M2, h2, l2)).length, y2 = w2.length, 1 == (u2 = t2(g2, w2, m2, y2)) && (h2--, r2(g2, O2 < m2 ? N2 : M2, m2, l2))) : (0 == h2 && (u2 = h2 = 1), g2 = M2.slice()), (m2 = g2.length) < y2 && g2.unshift(0), r2(w2, g2, y2, l2), -1 == u2 && (y2 = w2.length, (u2 = t2(M2, w2, O2, y2)) < 1 && (h2++, r2(w2, O2 < y2 ? N2 : M2, y2, l2))), y2 = w2.length) : 0 === u2 && (h2++, w2 = [0]), b2[d2++] = h2, u2 && w2[0] ? w2[y2++] = I2[S2] || 0 : (w2 = [I2[S2]], y2 = 1);
              while ((S2++ < R2 || void 0 !== w2[0]) && x2--);
              f2 = void 0 !== w2[0];
            }
            b2[0] || b2.shift();
          }
          if (1 == p2) v2.e = c2, C = f2;
          else {
            for (d2 = 1, h2 = b2[0]; h2 >= 10; h2 /= 10) d2++;
            v2.e = d2 + c2 * p2 - 1, J(v2, s2 ? o2 + v2.e + 1 : o2, a2, f2);
          }
          return v2;
        };
      }();
      function J(e3, t2, r2, n2) {
        var i2, o2, a2, s2, l2, u2, c2, d2, h2, p2 = e3.constructor;
        e: if (null != t2) {
          if (!(d2 = e3.d)) return e3;
          for (i2 = 1, s2 = d2[0]; s2 >= 10; s2 /= 10) i2++;
          if ((o2 = t2 - i2) < 0) o2 += 7, a2 = t2, l2 = (c2 = d2[h2 = 0]) / L(10, i2 - a2 - 1) % 10 | 0;
          else if ((h2 = Math.ceil((o2 + 1) / 7)) >= (s2 = d2.length)) if (n2) {
            for (; s2++ <= h2; ) d2.push(0);
            c2 = l2 = 0, i2 = 1, o2 %= 7, a2 = o2 - 7 + 1;
          } else break e;
          else {
            for (c2 = s2 = d2[h2], i2 = 1; s2 >= 10; s2 /= 10) i2++;
            o2 %= 7, l2 = (a2 = o2 - 7 + i2) < 0 ? 0 : c2 / L(10, i2 - a2 - 1) % 10 | 0;
          }
          if (n2 = n2 || t2 < 0 || void 0 !== d2[h2 + 1] || (a2 < 0 ? c2 : c2 % L(10, i2 - a2 - 1)), u2 = r2 < 4 ? (l2 || n2) && (0 == r2 || r2 == (e3.s < 0 ? 3 : 2)) : l2 > 5 || 5 == l2 && (4 == r2 || n2 || 6 == r2 && (o2 > 0 ? a2 > 0 ? c2 / L(10, i2 - a2) : 0 : d2[h2 - 1]) % 10 & 1 || r2 == (e3.s < 0 ? 8 : 7)), t2 < 1 || !d2[0]) return d2.length = 0, u2 ? (t2 -= e3.e + 1, d2[0] = L(10, (7 - t2 % 7) % 7), e3.e = -t2 || 0) : d2[0] = e3.e = 0, e3;
          if (0 == o2 ? (d2.length = h2, s2 = 1, h2--) : (d2.length = h2 + 1, s2 = L(10, 7 - o2), d2[h2] = a2 > 0 ? (c2 / L(10, i2 - a2) % L(10, a2) | 0) * s2 : 0), u2) for (; ; ) if (0 == h2) {
            for (o2 = 1, a2 = d2[0]; a2 >= 10; a2 /= 10) o2++;
            for (a2 = d2[0] += s2, s2 = 1; a2 >= 10; a2 /= 10) s2++;
            o2 != s2 && (e3.e++, 1e7 == d2[0] && (d2[0] = 1));
            break;
          } else {
            if (d2[h2] += s2, 1e7 != d2[h2]) break;
            d2[h2--] = 0, s2 = 1;
          }
          for (o2 = d2.length; 0 === d2[--o2]; ) d2.pop();
        }
        return T && (e3.e > p2.maxE ? (e3.d = null, e3.e = NaN) : e3.e < p2.minE && (e3.e = 0, e3.d = [0])), e3;
      }
      function Z(e3, t2, r2) {
        if (!e3.isFinite()) return el(e3);
        var n2, i2 = e3.e, o2 = z(e3.d), a2 = o2.length;
        return t2 ? (r2 && (n2 = r2 - a2) > 0 ? o2 = o2.charAt(0) + "." + o2.slice(1) + er(n2) : a2 > 1 && (o2 = o2.charAt(0) + "." + o2.slice(1)), o2 = o2 + (e3.e < 0 ? "e" : "e+") + e3.e) : i2 < 0 ? (o2 = "0." + er(-i2 - 1) + o2, r2 && (n2 = r2 - a2) > 0 && (o2 += er(n2))) : i2 >= a2 ? (o2 += er(i2 + 1 - a2), r2 && (n2 = r2 - i2 - 1) > 0 && (o2 = o2 + "." + er(n2))) : ((n2 = i2 + 1) < a2 && (o2 = o2.slice(0, n2) + "." + o2.slice(n2)), r2 && (n2 = r2 - a2) > 0 && (i2 + 1 === a2 && (o2 += "."), o2 += er(n2))), o2;
      }
      function Q(e3, t2) {
        var r2 = e3[0];
        for (t2 *= 7; r2 >= 10; r2 /= 10) t2++;
        return t2;
      }
      function Y(e3, t2, r2) {
        if (t2 > F) throw T = true, r2 && (e3.precision = r2), Error(M);
        return J(new e3(P), t2, 1, true);
      }
      function ee(e3, t2, r2) {
        if (t2 > H) throw Error(M);
        return J(new e3(O), t2, r2, true);
      }
      function et(e3) {
        var t2 = e3.length - 1, r2 = 7 * t2 + 1;
        if (t2 = e3[t2]) {
          for (; t2 % 10 == 0; t2 /= 10) r2--;
          for (t2 = e3[0]; t2 >= 10; t2 /= 10) r2++;
        }
        return r2;
      }
      function er(e3) {
        for (var t2 = ""; e3--; ) t2 += "0";
        return t2;
      }
      function en(e3, t2, r2, n2) {
        var i2, o2 = new e3(1), a2 = Math.ceil(n2 / 7 + 4);
        for (T = false; ; ) {
          if (r2 % 2 && ef((o2 = o2.times(t2)).d, a2) && (i2 = true), 0 === (r2 = j(r2 / 2))) {
            r2 = o2.d.length - 1, i2 && 0 === o2.d[r2] && ++o2.d[r2];
            break;
          }
          ef((t2 = t2.times(t2)).d, a2);
        }
        return T = true, o2;
      }
      function ei(e3) {
        return 1 & e3.d[e3.d.length - 1];
      }
      function eo(e3, t2, r2) {
        for (var n2, i2 = new e3(t2[0]), o2 = 0; ++o2 < t2.length; ) if ((n2 = new e3(t2[o2])).s) i2[r2](n2) && (i2 = n2);
        else {
          i2 = n2;
          break;
        }
        return i2;
      }
      function ea(e3, t2) {
        var r2, n2, i2, o2, a2, s2, l2, u2 = 0, c2 = 0, d2 = 0, h2 = e3.constructor, p2 = h2.rounding, f2 = h2.precision;
        if (!e3.d || !e3.d[0] || e3.e > 17) return new h2(e3.d ? e3.d[0] ? e3.s < 0 ? 0 : 1 / 0 : 1 : e3.s ? e3.s < 0 ? 0 : e3 : NaN);
        for (null == t2 ? (T = false, l2 = f2) : l2 = t2, s2 = new h2(0.03125); e3.e > -2; ) e3 = e3.times(s2), d2 += 5;
        for (l2 += n2 = Math.log(L(2, d2)) / Math.LN10 * 2 + 5 | 0, r2 = o2 = a2 = new h2(1), h2.precision = l2; ; ) {
          if (o2 = J(o2.times(e3), l2, 1), r2 = r2.times(++c2), z((s2 = a2.plus(K(o2, r2, l2, 1))).d).slice(0, l2) === z(a2.d).slice(0, l2)) {
            for (i2 = d2; i2--; ) a2 = J(a2.times(a2), l2, 1);
            if (null != t2) return h2.precision = f2, a2;
            if (!(u2 < 3 && X(a2.d, l2 - n2, p2, u2))) return J(a2, h2.precision = f2, p2, T = true);
            h2.precision = l2 += 10, r2 = o2 = s2 = new h2(1), c2 = 0, u2++;
          }
          a2 = s2;
        }
      }
      function es(e3, t2) {
        var r2, n2, i2, o2, a2, s2, l2, u2, c2, d2, h2, p2 = 1, f2 = e3, g2 = f2.d, m2 = f2.constructor, v2 = m2.rounding, b2 = m2.precision;
        if (f2.s < 0 || !g2 || !g2[0] || !f2.e && 1 == g2[0] && 1 == g2.length) return new m2(g2 && !g2[0] ? -1 / 0 : 1 != f2.s ? NaN : g2 ? 0 : f2);
        if (null == t2 ? (T = false, c2 = b2) : c2 = t2, m2.precision = c2 += 10, n2 = (r2 = z(g2)).charAt(0), !(15e14 > Math.abs(o2 = f2.e))) return u2 = Y(m2, c2 + 2, b2).times(o2 + ""), f2 = es(new m2(n2 + "." + r2.slice(1)), c2 - 10).plus(u2), m2.precision = b2, null == t2 ? J(f2, b2, v2, T = true) : f2;
        for (; n2 < 7 && 1 != n2 || 1 == n2 && r2.charAt(1) > 3; ) n2 = (r2 = z((f2 = f2.times(e3)).d)).charAt(0), p2++;
        for (o2 = f2.e, n2 > 1 ? (f2 = new m2("0." + r2), o2++) : f2 = new m2(n2 + "." + r2.slice(1)), d2 = f2, l2 = a2 = f2 = K(f2.minus(1), f2.plus(1), c2, 1), h2 = J(f2.times(f2), c2, 1), i2 = 3; ; ) {
          if (a2 = J(a2.times(h2), c2, 1), z((u2 = l2.plus(K(a2, new m2(i2), c2, 1))).d).slice(0, c2) === z(l2.d).slice(0, c2)) if (l2 = l2.times(2), 0 !== o2 && (l2 = l2.plus(Y(m2, c2 + 2, b2).times(o2 + ""))), l2 = K(l2, new m2(p2), c2, 1), null != t2) return m2.precision = b2, l2;
          else {
            if (!X(l2.d, c2 - 10, v2, s2)) return J(l2, m2.precision = b2, v2, T = true);
            m2.precision = c2 += 10, u2 = a2 = f2 = K(d2.minus(1), d2.plus(1), c2, 1), h2 = J(f2.times(f2), c2, 1), i2 = s2 = 1;
          }
          l2 = u2, i2 += 2;
        }
      }
      function el(e3) {
        return String(e3.s * e3.s / 0);
      }
      function eu(e3, t2) {
        var r2, n2, i2;
        for ((r2 = t2.indexOf(".")) > -1 && (t2 = t2.replace(".", "")), (n2 = t2.search(/e/i)) > 0 ? (r2 < 0 && (r2 = n2), r2 += +t2.slice(n2 + 1), t2 = t2.substring(0, n2)) : r2 < 0 && (r2 = t2.length), n2 = 0; 48 === t2.charCodeAt(n2); n2++) ;
        for (i2 = t2.length; 48 === t2.charCodeAt(i2 - 1); --i2) ;
        if (t2 = t2.slice(n2, i2)) {
          if (i2 -= n2, e3.e = r2 = r2 - n2 - 1, e3.d = [], n2 = (r2 + 1) % 7, r2 < 0 && (n2 += 7), n2 < i2) {
            for (n2 && e3.d.push(+t2.slice(0, n2)), i2 -= 7; n2 < i2; ) e3.d.push(+t2.slice(n2, n2 += 7));
            n2 = 7 - (t2 = t2.slice(n2)).length;
          } else n2 -= i2;
          for (; n2--; ) t2 += "0";
          e3.d.push(+t2), T && (e3.e > e3.constructor.maxE ? (e3.d = null, e3.e = NaN) : e3.e < e3.constructor.minE && (e3.e = 0, e3.d = [0]));
        } else e3.e = 0, e3.d = [0];
        return e3;
      }
      function ec(e3, t2, r2, n2, i2) {
        var o2, a2, s2, l2, u2 = e3.precision, c2 = Math.ceil(u2 / 7);
        for (T = false, l2 = r2.times(r2), s2 = new e3(n2); ; ) {
          if (a2 = K(s2.times(l2), new e3(t2++ * t2++), u2, 1), s2 = i2 ? n2.plus(a2) : n2.minus(a2), n2 = K(a2.times(l2), new e3(t2++ * t2++), u2, 1), void 0 !== (a2 = s2.plus(n2)).d[c2]) {
            for (o2 = c2; a2.d[o2] === s2.d[o2] && o2--; ) ;
            if (-1 == o2) break;
          }
          o2 = s2, s2 = n2, n2 = a2, a2 = o2;
        }
        return T = true, a2.d.length = c2 + 1, a2;
      }
      function ed(e3, t2) {
        for (var r2 = e3; --t2; ) r2 *= e3;
        return r2;
      }
      function eh(e3, t2) {
        var r2, n2 = t2.s < 0, i2 = ee(e3, e3.precision, 1), o2 = i2.times(0.5);
        if ((t2 = t2.abs()).lte(o2)) return S = n2 ? 4 : 1, t2;
        if ((r2 = t2.divToInt(i2)).isZero()) S = n2 ? 3 : 2;
        else {
          if ((t2 = t2.minus(r2.times(i2))).lte(o2)) return S = ei(r2) ? n2 ? 2 : 3 : n2 ? 4 : 1, t2;
          S = ei(r2) ? n2 ? 1 : 4 : n2 ? 3 : 2;
        }
        return t2.minus(i2).abs();
      }
      function ep(e3, t2, r2, n2) {
        var i2, o2, a2, s2, l2, u2, c2, d2, h2, p2 = e3.constructor, f2 = void 0 !== r2;
        if (f2 ? (G(r2, 1, 1e9), void 0 === n2 ? n2 = p2.rounding : G(n2, 0, 8)) : (r2 = p2.precision, n2 = p2.rounding), e3.isFinite()) {
          for (a2 = (c2 = Z(e3)).indexOf("."), f2 ? (i2 = 2, 16 == t2 ? r2 = 4 * r2 - 3 : 8 == t2 && (r2 = 3 * r2 - 2)) : i2 = t2, a2 >= 0 && (c2 = c2.replace(".", ""), (h2 = new p2(1)).e = c2.length - a2, h2.d = W(Z(h2), 10, i2), h2.e = h2.d.length), o2 = l2 = (d2 = W(c2, 10, i2)).length; 0 == d2[--l2]; ) d2.pop();
          if (d2[0]) {
            if (a2 < 0 ? o2-- : ((e3 = new p2(e3)).d = d2, e3.e = o2, d2 = (e3 = K(e3, h2, r2, n2, 0, i2)).d, o2 = e3.e, u2 = C), a2 = d2[r2], s2 = i2 / 2, u2 = u2 || void 0 !== d2[r2 + 1], u2 = n2 < 4 ? (void 0 !== a2 || u2) && (0 === n2 || n2 === (e3.s < 0 ? 3 : 2)) : a2 > s2 || a2 === s2 && (4 === n2 || u2 || 6 === n2 && 1 & d2[r2 - 1] || n2 === (e3.s < 0 ? 8 : 7)), d2.length = r2, u2) for (; ++d2[--r2] > i2 - 1; ) d2[r2] = 0, r2 || (++o2, d2.unshift(1));
            for (l2 = d2.length; !d2[l2 - 1]; --l2) ;
            for (a2 = 0, c2 = ""; a2 < l2; a2++) c2 += R.charAt(d2[a2]);
            if (f2) {
              if (l2 > 1) if (16 == t2 || 8 == t2) {
                for (a2 = 16 == t2 ? 4 : 3, --l2; l2 % a2; l2++) c2 += "0";
                for (l2 = (d2 = W(c2, i2, t2)).length; !d2[l2 - 1]; --l2) ;
                for (a2 = 1, c2 = "1."; a2 < l2; a2++) c2 += R.charAt(d2[a2]);
              } else c2 = c2.charAt(0) + "." + c2.slice(1);
              c2 = c2 + (o2 < 0 ? "p" : "p+") + o2;
            } else if (o2 < 0) {
              for (; ++o2; ) c2 = "0" + c2;
              c2 = "0." + c2;
            } else if (++o2 > l2) for (o2 -= l2; o2--; ) c2 += "0";
            else o2 < l2 && (c2 = c2.slice(0, o2) + "." + c2.slice(o2));
          } else c2 = f2 ? "0p+0" : "0";
          c2 = (16 == t2 ? "0x" : 2 == t2 ? "0b" : 8 == t2 ? "0o" : "") + c2;
        } else c2 = el(e3);
        return e3.s < 0 ? "-" + c2 : c2;
      }
      function ef(e3, t2) {
        if (e3.length > t2) return e3.length = t2, true;
      }
      function eg(e3) {
        return new this(e3).abs();
      }
      function em(e3) {
        return new this(e3).acos();
      }
      function ev(e3) {
        return new this(e3).acosh();
      }
      function eb(e3, t2) {
        return new this(e3).plus(t2);
      }
      function ew(e3) {
        return new this(e3).asin();
      }
      function ey(e3) {
        return new this(e3).asinh();
      }
      function e_(e3) {
        return new this(e3).atan();
      }
      function ex(e3) {
        return new this(e3).atanh();
      }
      function eE(e3, t2) {
        e3 = new this(e3), t2 = new this(t2);
        var r2, n2 = this.precision, i2 = this.rounding, o2 = n2 + 4;
        return e3.s && t2.s ? e3.d || t2.d ? !t2.d || e3.isZero() ? (r2 = t2.s < 0 ? ee(this, n2, i2) : new this(0)).s = e3.s : !e3.d || t2.isZero() ? (r2 = ee(this, o2, 1).times(0.5)).s = e3.s : t2.s < 0 ? (this.precision = o2, this.rounding = 1, r2 = this.atan(K(e3, t2, o2, 1)), t2 = ee(this, o2, 1), this.precision = n2, this.rounding = i2, r2 = e3.s < 0 ? r2.minus(t2) : r2.plus(t2)) : r2 = this.atan(K(e3, t2, o2, 1)) : (r2 = ee(this, o2, 1).times(t2.s > 0 ? 0.25 : 0.75)).s = e3.s : r2 = new this(NaN), r2;
      }
      function eC(e3) {
        return new this(e3).cbrt();
      }
      function eS(e3) {
        return J(e3 = new this(e3), e3.e + 1, 2);
      }
      function eR(e3, t2, r2) {
        return new this(e3).clamp(t2, r2);
      }
      function eP(e3) {
        if (!e3 || "object" != typeof e3) throw Error(A + "Object expected");
        var t2, r2, n2, i2 = true === e3.defaults, o2 = ["precision", 1, 1e9, "rounding", 0, 8, "toExpNeg", -9e15, 0, "toExpPos", 0, 9e15, "maxE", 0, 9e15, "minE", -9e15, 0, "modulo", 0, 9];
        for (t2 = 0; t2 < o2.length; t2 += 3) if (r2 = o2[t2], i2 && (this[r2] = N[r2]), void 0 !== (n2 = e3[r2])) if (j(n2) === n2 && n2 >= o2[t2 + 1] && n2 <= o2[t2 + 2]) this[r2] = n2;
        else throw Error(I + r2 + ": " + n2);
        if (r2 = "crypto", i2 && (this[r2] = N[r2]), void 0 !== (n2 = e3[r2])) if (true === n2 || false === n2 || 0 === n2 || 1 === n2) if (n2) if ("u" > typeof crypto && crypto && (crypto.getRandomValues || crypto.randomBytes)) this[r2] = true;
        else throw Error(k);
        else this[r2] = false;
        else throw Error(I + r2 + ": " + n2);
        return this;
      }
      function eO(e3) {
        return new this(e3).cos();
      }
      function eN(e3) {
        return new this(e3).cosh();
      }
      function eT(e3, t2) {
        return new this(e3).div(t2);
      }
      function eA(e3) {
        return new this(e3).exp();
      }
      function eI(e3) {
        return J(e3 = new this(e3), e3.e + 1, 3);
      }
      function eM() {
        var e3, t2, r2 = new this(0);
        for (T = false, e3 = 0; e3 < arguments.length; ) if (t2 = new this(arguments[e3++]), t2.d) r2.d && (r2 = r2.plus(t2.times(t2)));
        else {
          if (t2.s) return T = true, new this(1 / 0);
          r2 = t2;
        }
        return T = true, r2.sqrt();
      }
      function ek(e3) {
        return e3 instanceof e1 || e3 && e3.toStringTag === D || false;
      }
      function eD(e3) {
        return new this(e3).ln();
      }
      function ej(e3, t2) {
        return new this(e3).log(t2);
      }
      function eL(e3) {
        return new this(e3).log(2);
      }
      function eU(e3) {
        return new this(e3).log(10);
      }
      function eq() {
        return eo(this, arguments, "lt");
      }
      function e$() {
        return eo(this, arguments, "gt");
      }
      function eB(e3, t2) {
        return new this(e3).mod(t2);
      }
      function eF(e3, t2) {
        return new this(e3).mul(t2);
      }
      function eH(e3, t2) {
        return new this(e3).pow(t2);
      }
      function eV(e3) {
        var t2, r2, n2, i2, o2 = 0, a2 = new this(1), s2 = [];
        if (void 0 === e3 ? e3 = this.precision : G(e3, 1, 1e9), n2 = Math.ceil(e3 / 7), this.crypto) if (crypto.getRandomValues) for (t2 = crypto.getRandomValues(new Uint32Array(n2)); o2 < n2; ) (i2 = t2[o2]) >= 429e7 ? t2[o2] = crypto.getRandomValues(new Uint32Array(1))[0] : s2[o2++] = i2 % 1e7;
        else if (crypto.randomBytes) {
          for (t2 = crypto.randomBytes(n2 *= 4); o2 < n2; ) (i2 = t2[o2] + (t2[o2 + 1] << 8) + (t2[o2 + 2] << 16) + ((127 & t2[o2 + 3]) << 24)) >= 214e7 ? crypto.randomBytes(4).copy(t2, o2) : (s2.push(i2 % 1e7), o2 += 4);
          o2 = n2 / 4;
        } else throw Error(k);
        else for (; o2 < n2; ) s2[o2++] = 1e7 * Math.random() | 0;
        for (n2 = s2[--o2], e3 %= 7, n2 && e3 && (i2 = L(10, 7 - e3), s2[o2] = (n2 / i2 | 0) * i2); 0 === s2[o2]; o2--) s2.pop();
        if (o2 < 0) r2 = 0, s2 = [0];
        else {
          for (r2 = -1; 0 === s2[0]; r2 -= 7) s2.shift();
          for (n2 = 1, i2 = s2[0]; i2 >= 10; i2 /= 10) n2++;
          n2 < 7 && (r2 -= 7 - n2);
        }
        return a2.e = r2, a2.d = s2, a2;
      }
      function ez(e3) {
        return J(e3 = new this(e3), e3.e + 1, this.rounding);
      }
      function eG(e3) {
        return (e3 = new this(e3)).d ? e3.d[0] ? e3.s : 0 * e3.s : e3.s || NaN;
      }
      function eX(e3) {
        return new this(e3).sin();
      }
      function eW(e3) {
        return new this(e3).sinh();
      }
      function eK(e3) {
        return new this(e3).sqrt();
      }
      function eJ(e3, t2) {
        return new this(e3).sub(t2);
      }
      function eZ() {
        var e3 = 0, t2 = arguments, r2 = new this(t2[0]);
        for (T = false; r2.s && ++e3 < t2.length; ) r2 = r2.plus(t2[e3]);
        return T = true, J(r2, this.precision, this.rounding);
      }
      function eQ(e3) {
        return new this(e3).tan();
      }
      function eY(e3) {
        return new this(e3).tanh();
      }
      function e0(e3) {
        return J(e3 = new this(e3), e3.e + 1, 1);
      }
      V[Symbol.for("nodejs.util.inspect.custom")] = V.toString, V[Symbol.toStringTag] = "Decimal";
      var e1 = V.constructor = function e3(t2) {
        var r2, n2, i2;
        function o2(e4) {
          var t3, r3, n3;
          if (!(this instanceof o2)) return new o2(e4);
          if (this.constructor = o2, ek(e4)) {
            this.s = e4.s, T ? !e4.d || e4.e > o2.maxE ? (this.e = NaN, this.d = null) : e4.e < o2.minE ? (this.e = 0, this.d = [0]) : (this.e = e4.e, this.d = e4.d.slice()) : (this.e = e4.e, this.d = e4.d ? e4.d.slice() : e4.d);
            return;
          }
          if ("number" == (n3 = typeof e4)) {
            if (0 === e4) {
              this.s = 1 / e4 < 0 ? -1 : 1, this.e = 0, this.d = [0];
              return;
            }
            if (e4 < 0 ? (e4 = -e4, this.s = -1) : this.s = 1, e4 === ~~e4 && e4 < 1e7) {
              for (t3 = 0, r3 = e4; r3 >= 10; r3 /= 10) t3++;
              T ? t3 > o2.maxE ? (this.e = NaN, this.d = null) : t3 < o2.minE ? (this.e = 0, this.d = [0]) : (this.e = t3, this.d = [e4]) : (this.e = t3, this.d = [e4]);
              return;
            }
            if (0 * e4 != 0) {
              e4 || (this.s = NaN), this.e = NaN, this.d = null;
              return;
            }
            return eu(this, e4.toString());
          }
          if ("string" !== n3) throw Error(I + e4);
          return 45 === (r3 = e4.charCodeAt(0)) ? (e4 = e4.slice(1), this.s = -1) : (43 === r3 && (e4 = e4.slice(1)), this.s = 1), B.test(e4) ? eu(this, e4) : function(e5, t4) {
            var r4, n4, i3, o3, a2, s2, l2, u2, c2;
            if (t4.indexOf("_") > -1) {
              if (t4 = t4.replace(/(\d)_(?=\d)/g, "$1"), B.test(t4)) return eu(e5, t4);
            } else if ("Infinity" === t4 || "NaN" === t4) return +t4 || (e5.s = NaN), e5.e = NaN, e5.d = null, e5;
            if (q.test(t4)) r4 = 16, t4 = t4.toLowerCase();
            else if (U.test(t4)) r4 = 2;
            else if ($.test(t4)) r4 = 8;
            else throw Error(I + t4);
            for ((o3 = t4.search(/p/i)) > 0 ? (l2 = +t4.slice(o3 + 1), t4 = t4.substring(2, o3)) : t4 = t4.slice(2), a2 = (o3 = t4.indexOf(".")) >= 0, n4 = e5.constructor, a2 && (o3 = (s2 = (t4 = t4.replace(".", "")).length) - o3, i3 = en(n4, new n4(r4), o3, 2 * o3)), o3 = c2 = (u2 = W(t4, r4, 1e7)).length - 1; 0 === u2[o3]; --o3) u2.pop();
            return o3 < 0 ? new n4(0 * e5.s) : (e5.e = Q(u2, c2), e5.d = u2, T = false, a2 && (e5 = K(e5, i3, 4 * s2)), l2 && (e5 = e5.times(54 > Math.abs(l2) ? L(2, l2) : e1.pow(2, l2))), T = true, e5);
          }(this, e4);
        }
        if (o2.prototype = V, o2.ROUND_UP = 0, o2.ROUND_DOWN = 1, o2.ROUND_CEIL = 2, o2.ROUND_FLOOR = 3, o2.ROUND_HALF_UP = 4, o2.ROUND_HALF_DOWN = 5, o2.ROUND_HALF_EVEN = 6, o2.ROUND_HALF_CEIL = 7, o2.ROUND_HALF_FLOOR = 8, o2.EUCLID = 9, o2.config = o2.set = eP, o2.clone = e3, o2.isDecimal = ek, o2.abs = eg, o2.acos = em, o2.acosh = ev, o2.add = eb, o2.asin = ew, o2.asinh = ey, o2.atan = e_, o2.atanh = ex, o2.atan2 = eE, o2.cbrt = eC, o2.ceil = eS, o2.clamp = eR, o2.cos = eO, o2.cosh = eN, o2.div = eT, o2.exp = eA, o2.floor = eI, o2.hypot = eM, o2.ln = eD, o2.log = ej, o2.log10 = eU, o2.log2 = eL, o2.max = eq, o2.min = e$, o2.mod = eB, o2.mul = eF, o2.pow = eH, o2.random = eV, o2.round = ez, o2.sign = eG, o2.sin = eX, o2.sinh = eW, o2.sqrt = eK, o2.sub = eJ, o2.sum = eZ, o2.tan = eQ, o2.tanh = eY, o2.trunc = e0, void 0 === t2 && (t2 = {}), t2 && true !== t2.defaults) for (i2 = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"], r2 = 0; r2 < i2.length; ) t2.hasOwnProperty(n2 = i2[r2++]) || (t2[n2] = this[n2]);
        return o2.config(t2), o2;
      }(N);
      P = new e1(P), O = new e1(O);
      var e2 = e1;
    }, 53694, (e, t, r) => {
      Object.defineProperty(r, "__esModule", { value: true });
      let { Decimal: n, objectEnumValues: i, makeStrictEnum: o, Public: a, getRuntime: s, skip: l } = e.r(53496), u = {};
      r.Prisma = u, r.$Enums = {}, u.prismaVersion = { client: "5.22.0", engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2" }, u.PrismaClientKnownRequestError = () => {
        let e2 = s().prettyName;
        throw Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${e2}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
      }, u.PrismaClientUnknownRequestError = () => {
        let e2 = s().prettyName;
        throw Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${e2}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
      }, u.PrismaClientRustPanicError = () => {
        let e2 = s().prettyName;
        throw Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${e2}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
      }, u.PrismaClientInitializationError = () => {
        let e2 = s().prettyName;
        throw Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${e2}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
      }, u.PrismaClientValidationError = () => {
        let e2 = s().prettyName;
        throw Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${e2}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
      }, u.NotFoundError = () => {
        let e2 = s().prettyName;
        throw Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${e2}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
      }, u.Decimal = n, u.sql = () => {
        let e2 = s().prettyName;
        throw Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${e2}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
      }, u.empty = () => {
        let e2 = s().prettyName;
        throw Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${e2}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
      }, u.join = () => {
        let e2 = s().prettyName;
        throw Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${e2}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
      }, u.raw = () => {
        let e2 = s().prettyName;
        throw Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${e2}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
      }, u.validator = a.validator, u.getExtensionContext = () => {
        let e2 = s().prettyName;
        throw Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${e2}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
      }, u.defineExtension = () => {
        let e2 = s().prettyName;
        throw Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${e2}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
      }, u.DbNull = i.instances.DbNull, u.JsonNull = i.instances.JsonNull, u.AnyNull = i.instances.AnyNull, u.NullTypes = { DbNull: i.classes.DbNull, JsonNull: i.classes.JsonNull, AnyNull: i.classes.AnyNull }, r.Prisma.TransactionIsolationLevel = o({ ReadUncommitted: "ReadUncommitted", ReadCommitted: "ReadCommitted", RepeatableRead: "RepeatableRead", Serializable: "Serializable" }), r.Prisma.RestaurantScalarFieldEnum = { id: "id", slug: "slug", nameKu: "nameKu", nameEn: "nameEn", nameAr: "nameAr", logoMediaId: "logoMediaId", footerLogoMediaId: "footerLogoMediaId", welcomeBackgroundMediaId: "welcomeBackgroundMediaId", logoR2Key: "logoR2Key", logoR2Url: "logoR2Url", footerLogoR2Key: "footerLogoR2Key", footerLogoR2Url: "footerLogoR2Url", welcomeBgR2Key: "welcomeBgR2Key", welcomeBgR2Url: "welcomeBgR2Url", welcomeBgMimeType: "welcomeBgMimeType", welcomeOverlayColor: "welcomeOverlayColor", welcomeOverlayOpacity: "welcomeOverlayOpacity", welcomeTextEn: "welcomeTextEn", googleMapsUrl: "googleMapsUrl", phoneNumber: "phoneNumber", instagramUrl: "instagramUrl", snapchatUrl: "snapchatUrl", tiktokUrl: "tiktokUrl", serviceChargePercent: "serviceChargePercent", brandColors: "brandColors", createdAt: "createdAt", updatedAt: "updatedAt" }, r.Prisma.SectionScalarFieldEnum = { id: "id", restaurantId: "restaurantId", nameKu: "nameKu", nameEn: "nameEn", nameAr: "nameAr", sortOrder: "sortOrder", isActive: "isActive", createdAt: "createdAt", updatedAt: "updatedAt" }, r.Prisma.CategoryScalarFieldEnum = { id: "id", sectionId: "sectionId", nameKu: "nameKu", nameEn: "nameEn", nameAr: "nameAr", imageMediaId: "imageMediaId", imageR2Key: "imageR2Key", imageR2Url: "imageR2Url", sortOrder: "sortOrder", isActive: "isActive", createdAt: "createdAt", updatedAt: "updatedAt", restaurantId: "restaurantId" }, r.Prisma.ItemScalarFieldEnum = { id: "id", categoryId: "categoryId", nameKu: "nameKu", nameEn: "nameEn", nameAr: "nameAr", descriptionKu: "descriptionKu", descriptionEn: "descriptionEn", descriptionAr: "descriptionAr", price: "price", imageMediaId: "imageMediaId", imageR2Key: "imageR2Key", imageR2Url: "imageR2Url", sortOrder: "sortOrder", isActive: "isActive", createdAt: "createdAt", updatedAt: "updatedAt", restaurantId: "restaurantId" }, r.Prisma.FeedbackScalarFieldEnum = { id: "id", staffRating: "staffRating", serviceRating: "serviceRating", hygieneRating: "hygieneRating", satisfactionEmoji: "satisfactionEmoji", phoneNumber: "phoneNumber", tableNumber: "tableNumber", comment: "comment", createdAt: "createdAt", restaurantId: "restaurantId" }, r.Prisma.MediaScalarFieldEnum = { id: "id", mimeType: "mimeType", bytes: "bytes", size: "size", createdAt: "createdAt", restaurantId: "restaurantId" }, r.Prisma.UiSettingsScalarFieldEnum = { id: "id", sectionTitleSize: "sectionTitleSize", categoryTitleSize: "categoryTitleSize", itemNameSize: "itemNameSize", itemDescriptionSize: "itemDescriptionSize", itemPriceSize: "itemPriceSize", headerLogoSize: "headerLogoSize", bottomNavSectionSize: "bottomNavSectionSize", bottomNavCategorySize: "bottomNavCategorySize", currency: "currency", createdAt: "createdAt", updatedAt: "updatedAt", restaurantId: "restaurantId" }, r.Prisma.ThemeScalarFieldEnum = { id: "id", appBg: "appBg", menuBackgroundR2Key: "menuBackgroundR2Key", menuBackgroundR2Url: "menuBackgroundR2Url", itemNameTextColor: "itemNameTextColor", itemPriceTextColor: "itemPriceTextColor", itemDescriptionTextColor: "itemDescriptionTextColor", bottomNavSectionNameColor: "bottomNavSectionNameColor", categoryNameColor: "categoryNameColor", headerFooterBgColor: "headerFooterBgColor", glassTintColor: "glassTintColor", createdAt: "createdAt", updatedAt: "updatedAt", restaurantId: "restaurantId" }, r.Prisma.FallbackSettingsScalarFieldEnum = { id: "id", nameKu: "nameKu", nameEn: "nameEn", nameAr: "nameAr", logoMediaId: "logoMediaId", footerLogoMediaId: "footerLogoMediaId", welcomeBackgroundMediaId: "welcomeBackgroundMediaId", welcomeOverlayColor: "welcomeOverlayColor", welcomeOverlayOpacity: "welcomeOverlayOpacity", welcomeTextEn: "welcomeTextEn", googleMapsUrl: "googleMapsUrl", phoneNumber: "phoneNumber", brandColors: "brandColors", sectionTitleSize: "sectionTitleSize", categoryTitleSize: "categoryTitleSize", itemNameSize: "itemNameSize", itemDescriptionSize: "itemDescriptionSize", itemPriceSize: "itemPriceSize", headerLogoSize: "headerLogoSize", bottomNavSectionSize: "bottomNavSectionSize", bottomNavCategorySize: "bottomNavCategorySize", createdAt: "createdAt", updatedAt: "updatedAt" }, r.Prisma.AdminUserScalarFieldEnum = { id: "id", pinHash: "pinHash", lastLoginAt: "lastLoginAt", createdAt: "createdAt", updatedAt: "updatedAt", restaurantId: "restaurantId", displayName: "displayName", isActive: "isActive" }, r.Prisma.RestaurantAdminScalarFieldEnum = { id: "id", restaurantId: "restaurantId", pinHash: "pinHash", name: "name", isActive: "isActive", lastLoginAt: "lastLoginAt", createdAt: "createdAt", updatedAt: "updatedAt" }, r.Prisma.PlatformSettingsScalarFieldEnum = { id: "id", footerLogoR2Key: "footerLogoR2Key", footerLogoR2Url: "footerLogoR2Url", createdAt: "createdAt", updatedAt: "updatedAt" }, r.Prisma.SortOrder = { asc: "asc", desc: "desc" }, r.Prisma.NullableJsonNullValueInput = { DbNull: u.DbNull, JsonNull: u.JsonNull }, r.Prisma.QueryMode = { default: "default", insensitive: "insensitive" }, r.Prisma.JsonNullValueFilter = { DbNull: u.DbNull, JsonNull: u.JsonNull, AnyNull: u.AnyNull }, r.Prisma.NullsOrder = { first: "first", last: "last" }, r.Prisma.ModelName = { Restaurant: "Restaurant", Section: "Section", Category: "Category", Item: "Item", Feedback: "Feedback", Media: "Media", UiSettings: "UiSettings", Theme: "Theme", FallbackSettings: "FallbackSettings", AdminUser: "AdminUser", RestaurantAdmin: "RestaurantAdmin", PlatformSettings: "PlatformSettings" }, r.PrismaClient = class {
        constructor() {
          return new Proxy(this, { get(e2, t2) {
            let r2 = s();
            throw Error((r2.isEdge ? `PrismaClient is not configured to run in ${r2.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
` : "PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `" + r2.prettyName + "`).") + `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`);
          } });
        }
      }, Object.assign(r, u);
    }, 7565, (e, t, r) => {
      t.exports = { ...e.r(53694) };
    }, 3466, (e, t, r) => {
      t.exports = { ...e.r(7565) };
    }, 42738, (e) => {
      "use strict";
      let t, r, n;
      async function i() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      e.i(74398);
      let o = null;
      async function a() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        o || (o = i());
        let e10 = await o;
        if (null == e10 ? void 0 : e10.register) try {
          await e10.register();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      async function s(...e10) {
        let t10 = await i();
        try {
          var r2;
          await (null == t10 || null == (r2 = t10.onRequestError) ? void 0 : r2.call(t10, ...e10));
        } catch (e11) {
          console.error("Error in instrumentation.onRequestError:", e11);
        }
      }
      let l = null;
      function u() {
        return l || (l = a()), l;
      }
      function c(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== e.g.process && (process.env = e.g.process.env, e.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
          let t10 = new Proxy(function() {
          }, { get(t11, r2) {
            if ("then" === r2) return {};
            throw Object.defineProperty(Error(c(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(c(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(r2, n2, i2) {
            if ("function" == typeof i2[0]) return i2[0](t10);
            throw Object.defineProperty(Error(c(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => t10 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      u();
      class d extends Error {
        constructor({ page: e10 }) {
          super(`The middleware "${e10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class h extends Error {
        constructor() {
          super("The request.page has been deprecated in favour of `URLPattern`.\n  Read more: https://nextjs.org/docs/messages/middleware-request-page\n  ");
        }
      }
      class p extends Error {
        constructor() {
          super("The request.ua has been removed in favour of `userAgent` function.\n  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent\n  ");
        }
      }
      let f = "x-prerender-revalidate", g = ".meta", m = "x-next-cache-tags", v = "x-next-revalidated-tags", b = "_N_T_", w = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function y(e10) {
        var t10, r2, n2, i2, o2, a2 = [], s2 = 0;
        function l2() {
          for (; s2 < e10.length && /\s/.test(e10.charAt(s2)); ) s2 += 1;
          return s2 < e10.length;
        }
        for (; s2 < e10.length; ) {
          for (t10 = s2, o2 = false; l2(); ) if ("," === (r2 = e10.charAt(s2))) {
            for (n2 = s2, s2 += 1, l2(), i2 = s2; s2 < e10.length && "=" !== (r2 = e10.charAt(s2)) && ";" !== r2 && "," !== r2; ) s2 += 1;
            s2 < e10.length && "=" === e10.charAt(s2) ? (o2 = true, s2 = i2, a2.push(e10.substring(t10, n2)), t10 = s2) : s2 = n2 + 1;
          } else s2 += 1;
          (!o2 || s2 >= e10.length) && a2.push(e10.substring(t10, e10.length));
        }
        return a2;
      }
      function _(e10) {
        let t10 = {}, r2 = [];
        if (e10) for (let [n2, i2] of e10.entries()) "set-cookie" === n2.toLowerCase() ? (r2.push(...y(i2)), t10[n2] = 1 === r2.length ? r2[0] : r2) : t10[n2] = i2;
        return t10;
      }
      function x(e10) {
        try {
          return String(new URL(String(e10)));
        } catch (t10) {
          throw Object.defineProperty(Error(`URL is malformed "${String(e10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t10 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...w, GROUP: { builtinReact: [w.reactServerComponents, w.actionBrowser], serverOnly: [w.reactServerComponents, w.actionBrowser, w.instrument, w.middleware], neutralTarget: [w.apiNode, w.apiEdge], clientOnly: [w.serverSideRendering, w.appPagesBrowser], bundled: [w.reactServerComponents, w.actionBrowser, w.serverSideRendering, w.appPagesBrowser, w.shared, w.instrument, w.middleware], appPages: [w.reactServerComponents, w.serverSideRendering, w.appPagesBrowser, w.actionBrowser] } });
      let E = Symbol("response"), C = Symbol("passThrough"), S = Symbol("waitUntil");
      class R {
        constructor(e10, t10) {
          this[C] = false, this[S] = t10 ? { kind: "external", function: t10 } : { kind: "internal", promises: [] };
        }
        respondWith(e10) {
          this[E] || (this[E] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[C] = true;
        }
        waitUntil(e10) {
          if ("external" === this[S].kind) return (0, this[S].function)(e10);
          this[S].promises.push(e10);
        }
      }
      class P extends R {
        constructor(e10) {
          var t10;
          super(e10.request, null == (t10 = e10.context) ? void 0 : t10.waitUntil), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new d({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new d({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function O(e10) {
        return e10.replace(/\/$/, "") || "/";
      }
      function N(e10) {
        let t10 = e10.indexOf("#"), r2 = e10.indexOf("?"), n2 = r2 > -1 && (t10 < 0 || r2 < t10);
        return n2 || t10 > -1 ? { pathname: e10.substring(0, n2 ? r2 : t10), query: n2 ? e10.substring(r2, t10 > -1 ? t10 : void 0) : "", hash: t10 > -1 ? e10.slice(t10) : "" } : { pathname: e10, query: "", hash: "" };
      }
      function T(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r2, query: n2, hash: i2 } = N(e10);
        return `${t10}${r2}${n2}${i2}`;
      }
      function A(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r2, query: n2, hash: i2 } = N(e10);
        return `${r2}${t10}${n2}${i2}`;
      }
      function I(e10, t10) {
        if ("string" != typeof e10) return false;
        let { pathname: r2 } = N(e10);
        return r2 === t10 || r2.startsWith(t10 + "/");
      }
      let M = /* @__PURE__ */ new WeakMap();
      function k(e10, t10) {
        let r2;
        if (!t10) return { pathname: e10 };
        let n2 = M.get(t10);
        n2 || (n2 = t10.map((e11) => e11.toLowerCase()), M.set(t10, n2));
        let i2 = e10.split("/", 2);
        if (!i2[1]) return { pathname: e10 };
        let o2 = i2[1].toLowerCase(), a2 = n2.indexOf(o2);
        return a2 < 0 ? { pathname: e10 } : (r2 = t10[a2], { pathname: e10 = e10.slice(r2.length + 1) || "/", detectedLocale: r2 });
      }
      let D = /^(?:127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)$/;
      function j(e10, t10) {
        let r2 = new URL(String(e10), t10 && String(t10));
        return D.test(r2.hostname) && (r2.hostname = "localhost"), r2;
      }
      let L = Symbol("NextURLInternal");
      class U {
        constructor(e10, t10, r2) {
          let n2, i2;
          "object" == typeof t10 && "pathname" in t10 || "string" == typeof t10 ? (n2 = t10, i2 = r2 || {}) : i2 = r2 || t10 || {}, this[L] = { url: j(e10, n2 ?? i2.base), options: i2, basePath: "" }, this.analyze();
        }
        analyze() {
          var e10, t10, r2, n2, i2;
          let o2 = function(e11, t11) {
            let { basePath: r3, i18n: n3, trailingSlash: i3 } = t11.nextConfig ?? {}, o3 = { pathname: e11, trailingSlash: "/" !== e11 ? e11.endsWith("/") : i3 };
            r3 && I(o3.pathname, r3) && (o3.pathname = function(e12, t12) {
              if (!I(e12, t12)) return e12;
              let r4 = e12.slice(t12.length);
              return r4.startsWith("/") ? r4 : `/${r4}`;
            }(o3.pathname, r3), o3.basePath = r3);
            let a3 = o3.pathname;
            if (o3.pathname.startsWith("/_next/data/") && o3.pathname.endsWith(".json")) {
              let e12 = o3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              o3.buildId = e12[0], a3 = "index" !== e12[1] ? `/${e12.slice(1).join("/")}` : "/", true === t11.parseData && (o3.pathname = a3);
            }
            if (n3) {
              let e12 = t11.i18nProvider ? t11.i18nProvider.analyze(o3.pathname) : k(o3.pathname, n3.locales);
              o3.locale = e12.detectedLocale, o3.pathname = e12.pathname ?? o3.pathname, !e12.detectedLocale && o3.buildId && (e12 = t11.i18nProvider ? t11.i18nProvider.analyze(a3) : k(a3, n3.locales)).detectedLocale && (o3.locale = e12.detectedLocale);
            }
            return o3;
          }(this[L].url.pathname, { nextConfig: this[L].options.nextConfig, parseData: true, i18nProvider: this[L].options.i18nProvider }), a2 = function(e11, t11) {
            let r3;
            if (t11?.host && !Array.isArray(t11.host)) r3 = t11.host.toString().split(":", 1)[0];
            else {
              if (!e11.hostname) return;
              r3 = e11.hostname;
            }
            return r3.toLowerCase();
          }(this[L].url, this[L].options.headers);
          this[L].domainLocale = this[L].options.i18nProvider ? this[L].options.i18nProvider.detectDomainLocale(a2) : function(e11, t11, r3) {
            if (e11) {
              for (let n3 of (r3 && (r3 = r3.toLowerCase()), e11)) if (t11 === n3.domain?.split(":", 1)[0].toLowerCase() || r3 === n3.defaultLocale.toLowerCase() || n3.locales?.some((e12) => e12.toLowerCase() === r3)) return n3;
            }
          }(null == (t10 = this[L].options.nextConfig) || null == (e10 = t10.i18n) ? void 0 : e10.domains, a2);
          let s2 = (null == (r2 = this[L].domainLocale) ? void 0 : r2.defaultLocale) || (null == (i2 = this[L].options.nextConfig) || null == (n2 = i2.i18n) ? void 0 : n2.defaultLocale);
          this[L].url.pathname = o2.pathname, this[L].defaultLocale = s2, this[L].basePath = o2.basePath ?? "", this[L].buildId = o2.buildId, this[L].locale = o2.locale ?? s2, this[L].trailingSlash = o2.trailingSlash;
        }
        formatPathname() {
          var e10;
          let t10;
          return t10 = function(e11, t11, r2, n2) {
            if (!t11 || t11 === r2) return e11;
            let i2 = e11.toLowerCase();
            return !n2 && (I(i2, "/api") || I(i2, `/${t11.toLowerCase()}`)) ? e11 : T(e11, `/${t11}`);
          }((e10 = { basePath: this[L].basePath, buildId: this[L].buildId, defaultLocale: this[L].options.forceLocale ? void 0 : this[L].defaultLocale, locale: this[L].locale, pathname: this[L].url.pathname, trailingSlash: this[L].trailingSlash }).pathname, e10.locale, e10.buildId ? void 0 : e10.defaultLocale, e10.ignorePrefix), (e10.buildId || !e10.trailingSlash) && (t10 = O(t10)), e10.buildId && (t10 = A(T(t10, `/_next/data/${e10.buildId}`), "/" === e10.pathname ? "index.json" : ".json")), t10 = T(t10, e10.basePath), !e10.buildId && e10.trailingSlash ? t10.endsWith("/") ? t10 : A(t10, "/") : O(t10);
        }
        formatSearch() {
          return this[L].url.search;
        }
        get buildId() {
          return this[L].buildId;
        }
        set buildId(e10) {
          this[L].buildId = e10;
        }
        get locale() {
          return this[L].locale ?? "";
        }
        set locale(e10) {
          var t10, r2;
          if (!this[L].locale || !(null == (r2 = this[L].options.nextConfig) || null == (t10 = r2.i18n) ? void 0 : t10.locales.includes(e10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${e10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[L].locale = e10;
        }
        get defaultLocale() {
          return this[L].defaultLocale;
        }
        get domainLocale() {
          return this[L].domainLocale;
        }
        get searchParams() {
          return this[L].url.searchParams;
        }
        get host() {
          return this[L].url.host;
        }
        set host(e10) {
          this[L].url.host = e10;
        }
        get hostname() {
          return this[L].url.hostname;
        }
        set hostname(e10) {
          this[L].url.hostname = e10;
        }
        get port() {
          return this[L].url.port;
        }
        set port(e10) {
          this[L].url.port = e10;
        }
        get protocol() {
          return this[L].url.protocol;
        }
        set protocol(e10) {
          this[L].url.protocol = e10;
        }
        get href() {
          let e10 = this.formatPathname(), t10 = this.formatSearch();
          return `${this.protocol}//${this.host}${e10}${t10}${this.hash}`;
        }
        set href(e10) {
          this[L].url = j(e10), this.analyze();
        }
        get origin() {
          return this[L].url.origin;
        }
        get pathname() {
          return this[L].url.pathname;
        }
        set pathname(e10) {
          this[L].url.pathname = e10;
        }
        get hash() {
          return this[L].url.hash;
        }
        set hash(e10) {
          this[L].url.hash = e10;
        }
        get search() {
          return this[L].url.search;
        }
        set search(e10) {
          this[L].url.search = e10;
        }
        get password() {
          return this[L].url.password;
        }
        set password(e10) {
          this[L].url.password = e10;
        }
        get username() {
          return this[L].url.username;
        }
        set username(e10) {
          this[L].url.username = e10;
        }
        get basePath() {
          return this[L].basePath;
        }
        set basePath(e10) {
          this[L].basePath = e10.startsWith("/") ? e10 : `/${e10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new U(String(this), this[L].options);
        }
      }
      var q, $, B, F, H, V, z, G, X, W, K, J, Z, Q, Y, ee = e.i(28042);
      let et = Symbol("internal request");
      class er extends Request {
        constructor(e10, t10 = {}) {
          const r2 = "string" != typeof e10 && "url" in e10 ? e10.url : String(e10);
          x(r2), e10 instanceof Request ? super(e10, t10) : super(r2, t10);
          const n2 = new U(r2, { headers: _(this.headers), nextConfig: t10.nextConfig });
          this[et] = { cookies: new ee.RequestCookies(this.headers), nextUrl: n2, url: n2.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[et].cookies;
        }
        get nextUrl() {
          return this[et].nextUrl;
        }
        get page() {
          throw new h();
        }
        get ua() {
          throw new p();
        }
        get url() {
          return this[et].url;
        }
      }
      class en {
        static get(e10, t10, r2) {
          let n2 = Reflect.get(e10, t10, r2);
          return "function" == typeof n2 ? n2.bind(e10) : n2;
        }
        static set(e10, t10, r2, n2) {
          return Reflect.set(e10, t10, r2, n2);
        }
        static has(e10, t10) {
          return Reflect.has(e10, t10);
        }
        static deleteProperty(e10, t10) {
          return Reflect.deleteProperty(e10, t10);
        }
      }
      let ei = Symbol("internal response"), eo = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function ea(e10, t10) {
        var r2;
        if (null == e10 || null == (r2 = e10.request) ? void 0 : r2.headers) {
          if (!(e10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let r3 = [];
          for (let [n2, i2] of e10.request.headers) t10.set("x-middleware-request-" + n2, i2), r3.push(n2);
          t10.set("x-middleware-override-headers", r3.join(","));
        }
      }
      class es extends Response {
        constructor(e10, t10 = {}) {
          super(e10, t10);
          const r2 = this.headers, n2 = new Proxy(new ee.ResponseCookies(r2), { get(e11, n3, i2) {
            switch (n3) {
              case "delete":
              case "set":
                return (...i3) => {
                  let o2 = Reflect.apply(e11[n3], e11, i3), a2 = new Headers(r2);
                  return o2 instanceof ee.ResponseCookies && r2.set("x-middleware-set-cookie", o2.getAll().map((e12) => (0, ee.stringifyCookie)(e12)).join(",")), ea(t10, a2), o2;
                };
              default:
                return en.get(e11, n3, i2);
            }
          } });
          this[ei] = { cookies: n2, url: t10.url ? new U(t10.url, { headers: _(r2), nextConfig: t10.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[ei].cookies;
        }
        static json(e10, t10) {
          let r2 = Response.json(e10, t10);
          return new es(r2.body, r2);
        }
        static redirect(e10, t10) {
          let r2 = "number" == typeof t10 ? t10 : (null == t10 ? void 0 : t10.status) ?? 307;
          if (!eo.has(r2)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let n2 = "object" == typeof t10 ? t10 : {}, i2 = new Headers(null == n2 ? void 0 : n2.headers);
          return i2.set("Location", x(e10)), new es(null, { ...n2, headers: i2, status: r2 });
        }
        static rewrite(e10, t10) {
          let r2 = new Headers(null == t10 ? void 0 : t10.headers);
          return r2.set("x-middleware-rewrite", x(e10)), ea(t10, r2), new es(null, { ...t10, headers: r2 });
        }
        static next(e10) {
          let t10 = new Headers(null == e10 ? void 0 : e10.headers);
          return t10.set("x-middleware-next", "1"), ea(e10, t10), new es(null, { ...e10, headers: t10 });
        }
      }
      function el(e10, t10) {
        let r2 = "string" == typeof t10 ? new URL(t10) : t10, n2 = new URL(e10, t10), i2 = n2.origin === r2.origin;
        return { url: i2 ? n2.toString().slice(r2.origin.length) : n2.toString(), isRelative: i2 };
      }
      let eu = "next-router-prefetch", ec = ["rsc", "next-router-state-tree", eu, "next-hmr-refresh", "next-router-segment-prefetch"], ed = "_rsc";
      function eh(e10) {
        return e10.startsWith("/") ? e10 : `/${e10}`;
      }
      function ep(e10) {
        return eh(e10.split("/").reduce((e11, t10, r2, n2) => t10 ? "(" === t10[0] && t10.endsWith(")") || "@" === t10[0] || ("page" === t10 || "route" === t10) && r2 === n2.length - 1 ? e11 : `${e11}/${t10}` : e11, ""));
      }
      class ef extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new ef();
        }
      }
      class eg extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t10, r2, n2) {
            if ("symbol" == typeof r2) return en.get(t10, r2, n2);
            let i2 = r2.toLowerCase(), o2 = Object.keys(e10).find((e11) => e11.toLowerCase() === i2);
            if (void 0 !== o2) return en.get(t10, o2, n2);
          }, set(t10, r2, n2, i2) {
            if ("symbol" == typeof r2) return en.set(t10, r2, n2, i2);
            let o2 = r2.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === o2);
            return en.set(t10, a2 ?? r2, n2, i2);
          }, has(t10, r2) {
            if ("symbol" == typeof r2) return en.has(t10, r2);
            let n2 = r2.toLowerCase(), i2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 !== i2 && en.has(t10, i2);
          }, deleteProperty(t10, r2) {
            if ("symbol" == typeof r2) return en.deleteProperty(t10, r2);
            let n2 = r2.toLowerCase(), i2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 === i2 || en.deleteProperty(t10, i2);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r2) {
            switch (t10) {
              case "append":
              case "delete":
              case "set":
                return ef.callable;
              default:
                return en.get(e11, t10, r2);
            }
          } });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new eg(e10);
        }
        append(e10, t10) {
          let r2 = this.headers[e10];
          "string" == typeof r2 ? this.headers[e10] = [r2, t10] : Array.isArray(r2) ? r2.push(t10) : this.headers[e10] = t10;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t10 = this.headers[e10];
          return void 0 !== t10 ? this.merge(t10) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t10) {
          this.headers[e10] = t10;
        }
        forEach(e10, t10) {
          for (let [r2, n2] of this.entries()) e10.call(t10, n2, r2, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase(), r2 = this.get(t10);
            yield [t10, r2];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase();
            yield t10;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = this.get(e10);
            yield t10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let em = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class ev {
        disable() {
          throw em;
        }
        getStore() {
        }
        run() {
          throw em;
        }
        exit() {
          throw em;
        }
        enterWith() {
          throw em;
        }
        static bind(e10) {
          return e10;
        }
      }
      let eb = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function ew() {
        return eb ? new eb() : new ev();
      }
      let ey = ew();
      class e_ extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new e_();
        }
      }
      class ex {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r2) {
            switch (t10) {
              case "clear":
              case "delete":
              case "set":
                return e_.callable;
              default:
                return en.get(e11, t10, r2);
            }
          } });
        }
      }
      let eE = Symbol.for("next.mutated.cookies");
      class eC {
        static wrap(e10, t10) {
          let r2 = new ee.ResponseCookies(new Headers());
          for (let t11 of e10.getAll()) r2.set(t11);
          let n2 = [], i2 = /* @__PURE__ */ new Set(), o2 = () => {
            let e11 = ey.getStore();
            if (e11 && (e11.pathWasRevalidated = 1), n2 = r2.getAll().filter((e12) => i2.has(e12.name)), t10) {
              let e12 = [];
              for (let t11 of n2) {
                let r3 = new ee.ResponseCookies(new Headers());
                r3.set(t11), e12.push(r3.toString());
              }
              t10(e12);
            }
          }, a2 = new Proxy(r2, { get(e11, t11, r3) {
            switch (t11) {
              case eE:
                return n2;
              case "delete":
                return function(...t12) {
                  i2.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.delete(...t12), a2;
                  } finally {
                    o2();
                  }
                };
              case "set":
                return function(...t12) {
                  i2.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.set(...t12), a2;
                  } finally {
                    o2();
                  }
                };
              default:
                return en.get(e11, t11, r3);
            }
          } });
          return a2;
        }
      }
      function eS(e10, t10) {
        if ("action" !== e10.phase) throw new e_();
      }
      var eR = ((q = eR || {}).handleRequest = "BaseServer.handleRequest", q.run = "BaseServer.run", q.pipe = "BaseServer.pipe", q.getStaticHTML = "BaseServer.getStaticHTML", q.render = "BaseServer.render", q.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", q.renderToResponse = "BaseServer.renderToResponse", q.renderToHTML = "BaseServer.renderToHTML", q.renderError = "BaseServer.renderError", q.renderErrorToResponse = "BaseServer.renderErrorToResponse", q.renderErrorToHTML = "BaseServer.renderErrorToHTML", q.render404 = "BaseServer.render404", q), eP = (($ = eP || {}).loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", $.loadComponents = "LoadComponents.loadComponents", $), eO = ((B = eO || {}).getRequestHandler = "NextServer.getRequestHandler", B.getRequestHandlerWithMetadata = "NextServer.getRequestHandlerWithMetadata", B.getServer = "NextServer.getServer", B.getServerRequestHandler = "NextServer.getServerRequestHandler", B.createServer = "createServer.createServer", B), eN = ((F = eN || {}).compression = "NextNodeServer.compression", F.getBuildId = "NextNodeServer.getBuildId", F.createComponentTree = "NextNodeServer.createComponentTree", F.clientComponentLoading = "NextNodeServer.clientComponentLoading", F.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", F.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", F.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", F.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", F.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", F.sendRenderResult = "NextNodeServer.sendRenderResult", F.proxyRequest = "NextNodeServer.proxyRequest", F.runApi = "NextNodeServer.runApi", F.render = "NextNodeServer.render", F.renderHTML = "NextNodeServer.renderHTML", F.imageOptimizer = "NextNodeServer.imageOptimizer", F.getPagePath = "NextNodeServer.getPagePath", F.getRoutesManifest = "NextNodeServer.getRoutesManifest", F.findPageComponents = "NextNodeServer.findPageComponents", F.getFontManifest = "NextNodeServer.getFontManifest", F.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", F.getRequestHandler = "NextNodeServer.getRequestHandler", F.renderToHTML = "NextNodeServer.renderToHTML", F.renderError = "NextNodeServer.renderError", F.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", F.render404 = "NextNodeServer.render404", F.startResponse = "NextNodeServer.startResponse", F.route = "route", F.onProxyReq = "onProxyReq", F.apiResolver = "apiResolver", F.internalFetch = "internalFetch", F), eT = ((H = eT || {}).startServer = "startServer.startServer", H), eA = ((V = eA || {}).getServerSideProps = "Render.getServerSideProps", V.getStaticProps = "Render.getStaticProps", V.renderToString = "Render.renderToString", V.renderDocument = "Render.renderDocument", V.createBodyResult = "Render.createBodyResult", V), eI = ((z = eI || {}).renderToString = "AppRender.renderToString", z.renderToReadableStream = "AppRender.renderToReadableStream", z.getBodyResult = "AppRender.getBodyResult", z.fetch = "AppRender.fetch", z), eM = ((G = eM || {}).executeRoute = "Router.executeRoute", G), ek = ((X = ek || {}).runHandler = "Node.runHandler", X), eD = ((W = eD || {}).runHandler = "AppRouteRouteHandlers.runHandler", W), ej = ((K = ej || {}).generateMetadata = "ResolveMetadata.generateMetadata", K.generateViewport = "ResolveMetadata.generateViewport", K), eL = ((J = eL || {}).execute = "Middleware.execute", J);
      let eU = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), eq = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function e$(e10) {
        return null !== e10 && "object" == typeof e10 && "then" in e10 && "function" == typeof e10.then;
      }
      let eB = process.env.NEXT_OTEL_PERFORMANCE_PREFIX, { context: eF, propagation: eH, trace: eV, SpanStatusCode: ez, SpanKind: eG, ROOT_CONTEXT: eX } = t = e.r(59110);
      class eW extends Error {
        constructor(e10, t10) {
          super(), this.bubble = e10, this.result = t10;
        }
      }
      let eK = (e10, t10) => {
        "object" == typeof t10 && null !== t10 && t10 instanceof eW && t10.bubble ? e10.setAttribute("next.bubble", true) : (t10 && (e10.recordException(t10), e10.setAttribute("error.type", t10.name)), e10.setStatus({ code: ez.ERROR, message: null == t10 ? void 0 : t10.message })), e10.end();
      }, eJ = /* @__PURE__ */ new Map(), eZ = t.createContextKey("next.rootSpanId"), eQ = 0, eY = { set(e10, t10, r2) {
        e10.push({ key: t10, value: r2 });
      } }, e0 = (n = new class e {
        getTracerInstance() {
          return eV.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return eF;
        }
        getTracePropagationData() {
          let e10 = eF.active(), t10 = [];
          return eH.inject(e10, t10, eY), t10;
        }
        getActiveScopeSpan() {
          return eV.getSpan(null == eF ? void 0 : eF.active());
        }
        withPropagatedContext(e10, t10, r2, n2 = false) {
          let i2 = eF.active();
          if (n2) {
            let n3 = eH.extract(eX, e10, r2);
            if (eV.getSpanContext(n3)) return eF.with(n3, t10);
            let o3 = eH.extract(i2, e10, r2);
            return eF.with(o3, t10);
          }
          if (eV.getSpanContext(i2)) return t10();
          let o2 = eH.extract(i2, e10, r2);
          return eF.with(o2, t10);
        }
        trace(...e10) {
          let [t10, r2, n2] = e10, { fn: i2, options: o2 } = "function" == typeof r2 ? { fn: r2, options: {} } : { fn: n2, options: { ...r2 } }, a2 = o2.spanName ?? t10;
          if (!eU.has(t10) && "1" !== process.env.NEXT_OTEL_VERBOSE || o2.hideSpan) return i2();
          let s2 = this.getSpanContext((null == o2 ? void 0 : o2.parentSpan) ?? this.getActiveScopeSpan());
          s2 || (s2 = (null == eF ? void 0 : eF.active()) ?? eX);
          let l2 = s2.getValue(eZ), u2 = "number" != typeof l2 || !eJ.has(l2), c2 = eQ++;
          return o2.attributes = { "next.span_name": a2, "next.span_type": t10, ...o2.attributes }, eF.with(s2.setValue(eZ, c2), () => this.getTracerInstance().startActiveSpan(a2, o2, (e11) => {
            let r3;
            eB && t10 && eq.has(t10) && (r3 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let n3 = false, a3 = () => {
              !n3 && (n3 = true, eJ.delete(c2), r3 && performance.measure(`${eB}:next-${(t10.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: r3, end: performance.now() }));
            };
            if (u2 && eJ.set(c2, new Map(Object.entries(o2.attributes ?? {}))), i2.length > 1) try {
              return i2(e11, (t11) => eK(e11, t11));
            } catch (t11) {
              throw eK(e11, t11), t11;
            } finally {
              a3();
            }
            try {
              let t11 = i2(e11);
              if (e$(t11)) return t11.then((t12) => (e11.end(), t12)).catch((t12) => {
                throw eK(e11, t12), t12;
              }).finally(a3);
              return e11.end(), a3(), t11;
            } catch (t11) {
              throw eK(e11, t11), a3(), t11;
            }
          }));
        }
        wrap(...e10) {
          let t10 = this, [r2, n2, i2] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return eU.has(r2) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = n2;
            "function" == typeof e11 && "function" == typeof i2 && (e11 = e11.apply(this, arguments));
            let o2 = arguments.length - 1, a2 = arguments[o2];
            if ("function" != typeof a2) return t10.trace(r2, e11, () => i2.apply(this, arguments));
            {
              let n3 = t10.getContext().bind(eF.active(), a2);
              return t10.trace(r2, e11, (e12, t11) => (arguments[o2] = function(e13) {
                return null == t11 || t11(e13), n3.apply(this, arguments);
              }, i2.apply(this, arguments)));
            }
          } : i2;
        }
        startSpan(...e10) {
          let [t10, r2] = e10, n2 = this.getSpanContext((null == r2 ? void 0 : r2.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t10, r2, n2);
        }
        getSpanContext(e10) {
          return e10 ? eV.setSpan(eF.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = eF.active().getValue(eZ);
          return eJ.get(e10);
        }
        setRootSpanAttribute(e10, t10) {
          let r2 = eF.active().getValue(eZ), n2 = eJ.get(r2);
          n2 && !n2.has(e10) && n2.set(e10, t10);
        }
        withSpan(e10, t10) {
          let r2 = eV.setSpan(eF.active(), e10);
          return eF.with(r2, t10);
        }
      }(), () => n), e1 = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(e1);
      class e2 {
        constructor(e10, t10, r2, n2) {
          var i2;
          const o2 = e10 && function(e11, t11) {
            let r3 = eg.from(e11.headers);
            return { isOnDemandRevalidate: r3.get(f) === t11.previewModeId, revalidateOnlyGenerated: r3.has("x-prerender-revalidate-if-generated") };
          }(t10, e10).isOnDemandRevalidate, a2 = null == (i2 = r2.get(e1)) ? void 0 : i2.value;
          this._isEnabled = !!(!o2 && a2 && e10 && a2 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = n2;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: e1, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: e1, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function e4(e10, t10) {
        if ("x-middleware-set-cookie" in e10.headers && "string" == typeof e10.headers["x-middleware-set-cookie"]) {
          let r2 = e10.headers["x-middleware-set-cookie"], n2 = new Headers();
          for (let e11 of y(r2)) n2.append("set-cookie", e11);
          for (let e11 of new ee.ResponseCookies(n2).getAll()) t10.set(e11);
        }
      }
      let e3 = ew();
      function e9(e10) {
        switch (e10.type) {
          case "prerender":
          case "prerender-runtime":
          case "prerender-ppr":
          case "prerender-client":
          case "validation-client":
            return e10.prerenderResumeDataCache;
          case "request":
            if (e10.prerenderResumeDataCache) return e10.prerenderResumeDataCache;
          case "prerender-legacy":
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "generate-static-params":
            return null;
          default:
            return e10;
        }
      }
      var e7 = e.i(99734);
      class e6 extends Error {
        constructor(e10, t10) {
          super(`Invariant: ${e10.endsWith(".") ? e10 : e10 + "."} This is a bug in Next.js.`, t10), this.name = "InvariantError";
        }
      }
      var e5 = e.i(51615);
      process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let e8 = Symbol.for("@next/cache-handlers-map"), te = Symbol.for("@next/cache-handlers-set"), tt = globalThis;
      function tr() {
        if (tt[e8]) return tt[e8].entries();
      }
      async function tn(e10, t10) {
        if (!e10) return t10();
        let r2 = ti(e10);
        try {
          return await t10();
        } finally {
          var n2, i2, o2, a2;
          let t11, s2, l2, u2, c2 = (n2 = r2, i2 = ti(e10), t11 = new Set(n2.pendingRevalidatedTags.map((e11) => {
            let t12 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return `${e11.tag}:${t12}`;
          })), s2 = new Set(n2.pendingRevalidateWrites), { pendingRevalidatedTags: i2.pendingRevalidatedTags.filter((e11) => {
            let r3 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return !t11.has(`${e11.tag}:${r3}`);
          }), pendingRevalidates: Object.fromEntries(Object.entries(i2.pendingRevalidates).filter(([e11]) => !(e11 in n2.pendingRevalidates))), pendingRevalidateWrites: i2.pendingRevalidateWrites.filter((e11) => !s2.has(e11)) });
          await (o2 = e10, l2 = [], (u2 = (null == (a2 = c2) ? void 0 : a2.pendingRevalidatedTags) ?? o2.pendingRevalidatedTags ?? []).length > 0 && l2.push(to(u2, o2.incrementalCache, o2)), l2.push(...Object.values((null == a2 ? void 0 : a2.pendingRevalidates) ?? o2.pendingRevalidates ?? {})), l2.push(...(null == a2 ? void 0 : a2.pendingRevalidateWrites) ?? o2.pendingRevalidateWrites ?? []), 0 !== l2.length && Promise.all(l2).then(() => void 0));
        }
      }
      function ti(e10) {
        return { pendingRevalidatedTags: e10.pendingRevalidatedTags ? [...e10.pendingRevalidatedTags] : [], pendingRevalidates: { ...e10.pendingRevalidates }, pendingRevalidateWrites: e10.pendingRevalidateWrites ? [...e10.pendingRevalidateWrites] : [] };
      }
      async function to(e10, t10, r2) {
        if (0 === e10.length) return;
        let n2 = function() {
          if (tt[te]) return tt[te].values();
        }(), i2 = [], o2 = /* @__PURE__ */ new Map();
        for (let t11 of e10) {
          let e11, r3 = t11.profile;
          for (let [t12] of o2) if ("string" == typeof t12 && "string" == typeof r3 && t12 === r3 || "object" == typeof t12 && "object" == typeof r3 && JSON.stringify(t12) === JSON.stringify(r3) || t12 === r3) {
            e11 = t12;
            break;
          }
          let n3 = e11 || r3;
          o2.has(n3) || o2.set(n3, []), o2.get(n3).push(t11.tag);
        }
        for (let [e11, s2] of o2) {
          let o3;
          if (e11) {
            let t11;
            if ("object" == typeof e11) t11 = e11;
            else if ("string" == typeof e11) {
              var a2;
              if (!(t11 = null == r2 || null == (a2 = r2.cacheLifeProfiles) ? void 0 : a2[e11])) throw Object.defineProperty(Error(`Invalid profile provided "${e11}" must be configured under cacheLife in next.config or be "max"`), "__NEXT_ERROR_CODE", { value: "E873", enumerable: false, configurable: true });
            }
            t11 && (o3 = { expire: t11.expire });
          }
          for (let t11 of n2 || []) e11 ? i2.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, s2, o3)) : i2.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, s2));
          t10 && i2.push(t10.revalidateTag(s2, o3));
        }
        await Promise.all(i2);
      }
      let ta = ew();
      class ts {
        constructor({ waitUntil: e10, onClose: t10, onTaskError: r2 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = e10, this.onClose = t10, this.onTaskError = r2, this.callbackQueue = new e7.default(), this.callbackQueue.pause();
        }
        after(e10) {
          if (e$(e10)) this.waitUntil || tl(), this.waitUntil(e10.catch((e11) => this.reportTaskError("promise", e11)));
          else if ("function" == typeof e10) this.addCallback(e10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(e10) {
          var t10;
          this.waitUntil || tl();
          let r2 = e3.getStore();
          r2 && this.workUnitStores.add(r2);
          let n2 = ta.getStore(), i2 = n2 ? n2.rootTaskSpawnPhase : null == r2 ? void 0 : r2.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let o2 = (t10 = async () => {
            try {
              await ta.run({ rootTaskSpawnPhase: i2 }, () => e10());
            } catch (e11) {
              this.reportTaskError("function", e11);
            }
          }, eb ? eb.bind(t10) : ev.bind(t10));
          this.callbackQueue.add(o2);
        }
        async runCallbacksOnClose() {
          return await new Promise((e10) => this.onClose(e10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let e11 of this.workUnitStores) e11.phase = "after";
          let e10 = ey.getStore();
          if (!e10) throw Object.defineProperty(new e6("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return tn(e10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(e10, t10) {
          if (console.error("promise" === e10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", t10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, t10);
          } catch (e11) {
            console.error(Object.defineProperty(new e6("`onTaskError` threw while handling an error thrown from an `after` task", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function tl() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function tu(e10) {
        let t10, r2 = { then: (n2, i2) => (t10 || (t10 = Promise.resolve(e10())), t10.then((e11) => {
          r2.value = e11;
        }).catch(() => {
        }), t10.then(n2, i2)) };
        return r2;
      }
      class tc {
        onClose(e10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", e10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function td() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let th = Symbol.for("@next/request-context");
      async function tp(e10, t10, r2) {
        let n2 = /* @__PURE__ */ new Set();
        for (let t11 of ((e11) => {
          let t12 = ["/layout"];
          if (e11.startsWith("/")) {
            let r3 = e11.split("/");
            for (let e12 = 1; e12 < r3.length + 1; e12++) {
              let n3 = r3.slice(0, e12).join("/");
              n3 && (n3.endsWith("/page") || n3.endsWith("/route") || (n3 = `${n3}${!n3.endsWith("/") ? "/" : ""}layout`), t12.push(n3));
            }
          }
          return t12;
        })(e10)) t11 = `${b}${t11}`, n2.add(t11);
        if (t10 && (!r2 || 0 === r2.size)) {
          let e11 = `${b}${t10}`;
          n2.add(e11);
        }
        n2.has(`${b}/`) && n2.add(`${b}/index`), n2.has(`${b}/index`) && n2.add(`${b}/`);
        let i2 = Array.from(n2);
        return { tags: i2, expirationsByCacheKind: function(e11) {
          let t11 = /* @__PURE__ */ new Map(), r3 = tr();
          if (r3) for (let [n3, i3] of r3) "getExpiration" in i3 && t11.set(n3, tu(async () => i3.getExpiration(e11)));
          return t11;
        }(i2) };
      }
      let tf = Symbol.for("NextInternalRequestMeta");
      class tg extends er {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new d({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new d({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new d({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let tm = { keys: (e10) => Array.from(e10.keys()), get: (e10, t10) => e10.get(t10) ?? void 0 }, tv = (e10, t10) => e0().withPropagatedContext(e10.headers, t10, tm), tb = false;
      async function tw(t10) {
        var r2, n2, i2, o2, a2;
        let s2, l2, c2, d2, h2;
        !function() {
          if (!tb && (tb = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: t11, wrapRequestHandler: r3 } = e.r(94165);
            t11(), tv = r3(tv);
          }
        }(), await u();
        let p2 = void 0 !== globalThis.__BUILD_MANIFEST;
        t10.request.url = t10.request.url.replace(/\.rsc($|\?)/, "$1");
        let f2 = t10.bypassNextUrl ? new URL(t10.request.url) : new U(t10.request.url, { headers: t10.request.headers, nextConfig: t10.request.nextConfig });
        for (let e10 of [...f2.searchParams.keys()]) {
          let t11 = f2.searchParams.getAll(e10), r3 = function(e11) {
            for (let t12 of ["nxtP", "nxtI"]) if (e11 !== t12 && e11.startsWith(t12)) return e11.substring(t12.length);
            return null;
          }(e10);
          if (r3) {
            for (let e11 of (f2.searchParams.delete(r3), t11)) f2.searchParams.append(r3, e11);
            f2.searchParams.delete(e10);
          }
        }
        let g2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in f2 && (g2 = f2.buildId || "", f2.buildId = "");
        let m2 = function(e10) {
          let t11 = new Headers();
          for (let [r3, n3] of Object.entries(e10)) for (let e11 of Array.isArray(n3) ? n3 : [n3]) void 0 !== e11 && ("number" == typeof e11 && (e11 = e11.toString()), t11.append(r3, e11));
          return t11;
        }(t10.request.headers), v2 = m2.has("x-nextjs-data"), b2 = "1" === m2.get("rsc");
        v2 && "/index" === f2.pathname && (f2.pathname = "/");
        let w2 = /* @__PURE__ */ new Map();
        if (!p2) for (let e10 of ec) {
          let t11 = m2.get(e10);
          null !== t11 && (w2.set(e10, t11), m2.delete(e10));
        }
        let y2 = f2.searchParams.get(ed), _2 = new tg({ page: t10.page, input: ((d2 = (c2 = "string" == typeof f2) ? new URL(f2) : f2).searchParams.delete(ed), c2 ? d2.toString() : d2).toString(), init: { body: t10.request.body, headers: m2, method: t10.request.method, nextConfig: t10.request.nextConfig, signal: t10.request.signal } });
        t10.request.requestMeta && (a2 = t10.request.requestMeta, _2[tf] = a2), v2 && Object.defineProperty(_2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && t10.IncrementalCache && (globalThis.__incrementalCache = new t10.IncrementalCache({ CurCacheHandler: t10.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: t10.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: td() }) }));
        let x2 = t10.request.waitUntil ?? (null == (r2 = null == (h2 = globalThis[th]) ? void 0 : h2.get()) ? void 0 : r2.waitUntil), E2 = new P({ request: _2, page: t10.page, context: x2 ? { waitUntil: x2 } : void 0 });
        if ((s2 = await tv(_2, () => {
          if ("/middleware" === t10.page || "/src/middleware" === t10.page || "/proxy" === t10.page || "/src/proxy" === t10.page) {
            let e10 = E2.waitUntil.bind(E2), r3 = new tc();
            return e0().trace(eL.execute, { spanName: `middleware ${_2.method}`, attributes: { "http.target": _2.nextUrl.pathname, "http.method": _2.method } }, async () => {
              try {
                var n3, i3, o3, a3, s3, u2;
                let c3 = td(), d3 = await tp("/", _2.nextUrl.pathname, null), h3 = (s3 = _2.nextUrl, u2 = (e11) => {
                  l2 = e11;
                }, function(e11, t11, r4, n4, i4, o4, a4, s4, l3, u3) {
                  function c4(e12) {
                    r4 && r4.setHeader("Set-Cookie", e12);
                  }
                  let d4 = {};
                  return { type: "request", phase: e11, implicitTags: o4, url: { pathname: n4.pathname, search: n4.search ?? "" }, rootParams: i4, get headers() {
                    return d4.headers || (d4.headers = function(e12) {
                      let t12 = eg.from(e12);
                      for (let e13 of ec) t12.delete(e13);
                      return eg.seal(t12);
                    }(t11.headers)), d4.headers;
                  }, get cookies() {
                    if (!d4.cookies) {
                      let e12 = new ee.RequestCookies(eg.from(t11.headers));
                      e4(t11, e12), d4.cookies = ex.seal(e12);
                    }
                    return d4.cookies;
                  }, set cookies(value) {
                    d4.cookies = value;
                  }, get mutableCookies() {
                    if (!d4.mutableCookies) {
                      var h4, p4;
                      let e12, n5 = (h4 = t11.headers, p4 = a4 || (r4 ? c4 : void 0), e12 = new ee.RequestCookies(eg.from(h4)), eC.wrap(e12, p4));
                      e4(t11, n5), d4.mutableCookies = n5;
                    }
                    return d4.mutableCookies;
                  }, get userspaceMutableCookies() {
                    if (!d4.userspaceMutableCookies) {
                      var f3;
                      let e12;
                      f3 = this, d4.userspaceMutableCookies = e12 = new Proxy(f3.mutableCookies, { get(t12, r5, n5) {
                        switch (r5) {
                          case "delete":
                            return function(...r6) {
                              return eS(f3, "cookies().delete"), t12.delete(...r6), e12;
                            };
                          case "set":
                            return function(...r6) {
                              return eS(f3, "cookies().set"), t12.set(...r6), e12;
                            };
                          default:
                            return en.get(t12, r5, n5);
                        }
                      } });
                    }
                    return d4.userspaceMutableCookies;
                  }, get draftMode() {
                    return d4.draftMode || (d4.draftMode = new e2(s4, t11, this.cookies, this.mutableCookies)), d4.draftMode;
                  }, renderResumeDataCache: null, isHmrRefresh: l3, serverComponentsHmrCache: u3 || globalThis.__serverComponentsHmrCache, fallbackParams: null };
                }("action", _2, void 0, s3, {}, d3, u2, c3, false, void 0)), p3 = function({ page: e11, renderOpts: t11, isPrefetchRequest: r4, buildId: n4, previouslyRevalidatedTags: i4, nonce: o4 }) {
                  let a4 = !t11.shouldWaitOnAllReady && !t11.supportsDynamicResponse && !t11.isDraftMode && !t11.isPossibleServerAction, s4 = a4 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), l3 = { isStaticGeneration: a4, page: e11, route: ep(e11), incrementalCache: t11.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: t11.cacheLifeProfiles, isBuildTimePrerendering: t11.isBuildTimePrerendering, fetchCache: t11.fetchCache, isOnDemandRevalidate: t11.isOnDemandRevalidate, isDraftMode: t11.isDraftMode, isPrefetchRequest: r4, buildId: n4, reactLoadableManifest: (null == t11 ? void 0 : t11.reactLoadableManifest) || {}, assetPrefix: (null == t11 ? void 0 : t11.assetPrefix) || "", nonce: o4, afterContext: function(e12) {
                    let { waitUntil: t12, onClose: r5, onAfterTaskError: n5 } = e12;
                    return new ts({ waitUntil: t12, onClose: r5, onTaskError: n5 });
                  }(t11), cacheComponentsEnabled: t11.cacheComponents, previouslyRevalidatedTags: i4, refreshTagsByCacheKind: function() {
                    let e12 = /* @__PURE__ */ new Map(), t12 = tr();
                    if (t12) for (let [r5, n5] of t12) "refreshTags" in n5 && e12.set(r5, tu(async () => n5.refreshTags()));
                    return e12;
                  }(), runInCleanSnapshot: eb ? eb.snapshot() : function(e12, ...t12) {
                    return e12(...t12);
                  }, shouldTrackFetchMetrics: s4, reactServerErrorsByDigest: /* @__PURE__ */ new Map() };
                  return t11.store = l3, l3;
                }({ page: "/", renderOpts: { cacheLifeProfiles: null == (i3 = t10.request.nextConfig) || null == (n3 = i3.experimental) ? void 0 : n3.cacheLife, cacheComponents: false, experimental: { isRoutePPREnabled: false, authInterrupts: !!(null == (a3 = t10.request.nextConfig) || null == (o3 = a3.experimental) ? void 0 : o3.authInterrupts) }, supportsDynamicResponse: true, waitUntil: e10, onClose: r3.onClose.bind(r3), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === _2.headers.get(eu), buildId: g2 ?? "", previouslyRevalidatedTags: [] });
                return await ey.run(p3, () => e3.run(h3, t10.handler, _2, E2));
              } finally {
                setTimeout(() => {
                  r3.dispatchClose();
                }, 0);
              }
            });
          }
          return t10.handler(_2, E2);
        })) && !(s2 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        s2 && l2 && s2.headers.set("set-cookie", l2);
        let C2 = null == s2 ? void 0 : s2.headers.get("x-middleware-rewrite");
        if (s2 && C2 && (b2 || !p2)) {
          let e10 = new U(C2, { forceLocale: true, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          p2 || e10.host !== _2.nextUrl.host || (e10.buildId = g2 || e10.buildId, s2.headers.set("x-middleware-rewrite", String(e10)));
          let { url: r3, isRelative: a3 } = el(e10.toString(), f2.toString());
          !p2 && v2 && s2.headers.set("x-nextjs-rewrite", r3);
          let l3 = !a3 && (null == (o2 = t10.request.nextConfig) || null == (i2 = o2.experimental) || null == (n2 = i2.clientParamParsingOrigins) ? void 0 : n2.some((t11) => new RegExp(t11).test(e10.origin)));
          b2 && (a3 || l3) && (f2.pathname !== e10.pathname && s2.headers.set("x-nextjs-rewritten-path", e10.pathname), f2.search !== e10.search && s2.headers.set("x-nextjs-rewritten-query", e10.search.slice(1)));
        }
        if (s2 && C2 && b2 && y2) {
          let e10 = new URL(C2);
          e10.searchParams.has(ed) || (e10.searchParams.set(ed, y2), s2.headers.set("x-middleware-rewrite", e10.toString()));
        }
        let R2 = null == s2 ? void 0 : s2.headers.get("Location");
        if (s2 && R2 && !p2) {
          let e10 = new U(R2, { forceLocale: false, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          s2 = new Response(s2.body, s2), e10.host === f2.host && (e10.buildId = g2 || e10.buildId, s2.headers.set("Location", el(e10, f2).url)), v2 && (s2.headers.delete("Location"), s2.headers.set("x-nextjs-redirect", el(e10.toString(), f2.toString()).url));
        }
        let O2 = s2 || es.next(), N2 = O2.headers.get("x-middleware-override-headers"), T2 = [];
        if (N2) {
          for (let [e10, t11] of w2) O2.headers.set(`x-middleware-request-${e10}`, t11), T2.push(e10);
          T2.length > 0 && O2.headers.set("x-middleware-override-headers", N2 + "," + T2.join(","));
        }
        return { response: O2, waitUntil: ("internal" === E2[S].kind ? Promise.all(E2[S].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: _2.fetchMetrics };
      }
      class ty {
        constructor() {
          let e10, t10;
          this.promise = new Promise((r2, n2) => {
            e10 = r2, t10 = n2;
          }), this.resolve = e10, this.reject = t10;
        }
      }
      class t_ {
        constructor(e10, t10, r2) {
          this.prev = null, this.next = null, this.key = e10, this.data = t10, this.size = r2;
        }
      }
      class tx {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class tE {
        constructor(e10, t10, r2) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = e10, this.calculateSize = t10, this.onEvict = r2, this.head = new tx(), this.tail = new tx(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(e10) {
          e10.prev = this.head, e10.next = this.head.next, this.head.next.prev = e10, this.head.next = e10;
        }
        removeNode(e10) {
          e10.prev.next = e10.next, e10.next.prev = e10.prev;
        }
        moveToHead(e10) {
          this.removeNode(e10), this.addToHead(e10);
        }
        removeTail() {
          let e10 = this.tail.prev;
          return this.removeNode(e10), e10;
        }
        set(e10, t10) {
          let r2 = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, t10)) ?? 1;
          if (r2 <= 0) throw Object.defineProperty(Error(`LRUCache: calculateSize returned ${r2}, but size must be > 0. Items with size 0 would never be evicted, causing unbounded cache growth.`), "__NEXT_ERROR_CODE", { value: "E1045", enumerable: false, configurable: true });
          if (r2 > this.maxSize) return console.warn("Single item size exceeds maxSize"), false;
          let n2 = this.cache.get(e10);
          if (n2) n2.data = t10, this.totalSize = this.totalSize - n2.size + r2, n2.size = r2, this.moveToHead(n2);
          else {
            let n3 = new t_(e10, t10, r2);
            this.cache.set(e10, n3), this.addToHead(n3), this.totalSize += r2;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let e11 = this.removeTail();
            this.cache.delete(e11.key), this.totalSize -= e11.size, null == this.onEvict || this.onEvict.call(this, e11.key, e11.data);
          }
          return true;
        }
        has(e10) {
          return this.cache.has(e10);
        }
        get(e10) {
          let t10 = this.cache.get(e10);
          if (t10) return this.moveToHead(t10), t10.data;
        }
        *[Symbol.iterator]() {
          let e10 = this.head.next;
          for (; e10 && e10 !== this.tail; ) {
            let t10 = e10;
            yield [t10.key, t10.data], e10 = e10.next;
          }
        }
        remove(e10) {
          let t10 = this.cache.get(e10);
          t10 && (this.removeNode(t10), this.cache.delete(e10), this.totalSize -= t10.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      let { env: tC, stdout: tS } = (null == (Y = globalThis) ? void 0 : Y.process) ?? {}, tR = tC && !tC.NO_COLOR && (tC.FORCE_COLOR || (null == tS ? void 0 : tS.isTTY) && !tC.CI && "dumb" !== tC.TERM), tP = (e10, t10, r2, n2) => {
        let i2 = e10.substring(0, n2) + r2, o2 = e10.substring(n2 + t10.length), a2 = o2.indexOf(t10);
        return ~a2 ? i2 + tP(o2, t10, r2, a2) : i2 + o2;
      }, tO = (e10, t10, r2 = e10) => tR ? (n2) => {
        let i2 = "" + n2, o2 = i2.indexOf(t10, e10.length);
        return ~o2 ? e10 + tP(i2, t10, r2, o2) + t10 : e10 + i2 + t10;
      } : String, tN = tO("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      tO("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"), tO("\x1B[3m", "\x1B[23m"), tO("\x1B[4m", "\x1B[24m"), tO("\x1B[7m", "\x1B[27m"), tO("\x1B[8m", "\x1B[28m"), tO("\x1B[9m", "\x1B[29m"), tO("\x1B[30m", "\x1B[39m");
      let tT = tO("\x1B[31m", "\x1B[39m"), tA = tO("\x1B[32m", "\x1B[39m"), tI = tO("\x1B[33m", "\x1B[39m");
      tO("\x1B[34m", "\x1B[39m");
      let tM = tO("\x1B[35m", "\x1B[39m");
      tO("\x1B[38;2;173;127;168m", "\x1B[39m"), tO("\x1B[36m", "\x1B[39m");
      let tk = tO("\x1B[37m", "\x1B[39m");
      tO("\x1B[90m", "\x1B[39m"), tO("\x1B[40m", "\x1B[49m"), tO("\x1B[41m", "\x1B[49m"), tO("\x1B[42m", "\x1B[49m"), tO("\x1B[43m", "\x1B[49m"), tO("\x1B[44m", "\x1B[49m"), tO("\x1B[45m", "\x1B[49m"), tO("\x1B[46m", "\x1B[49m"), tO("\x1B[47m", "\x1B[49m"), tk(tN("\u25CB")), tT(tN("\u2A2F")), tI(tN("\u26A0")), tk(tN(" ")), tA(tN("\u2713")), tM(tN("\xBB")), new tE(1e4, (e10) => e10.length), new tE(1e4, (e10) => e10.length);
      var tD = ((Z = {}).APP_PAGE = "APP_PAGE", Z.APP_ROUTE = "APP_ROUTE", Z.PAGES = "PAGES", Z.FETCH = "FETCH", Z.REDIRECT = "REDIRECT", Z.IMAGE = "IMAGE", Z), tj = ((Q = {}).APP_PAGE = "APP_PAGE", Q.APP_ROUTE = "APP_ROUTE", Q.PAGES = "PAGES", Q.FETCH = "FETCH", Q.IMAGE = "IMAGE", Q);
      function tL() {
      }
      let tU = new TextEncoder();
      function tq(e10) {
        return new ReadableStream({ start(t10) {
          t10.enqueue(tU.encode(e10)), t10.close();
        } });
      }
      function t$(e10) {
        return new ReadableStream({ start(t10) {
          t10.enqueue(e10), t10.close();
        } });
      }
      async function tB(e10, t10) {
        let r2 = new TextDecoder("utf-8", { fatal: true }), n2 = "";
        for await (let i2 of e10) {
          if (null == t10 ? void 0 : t10.aborted) return n2;
          n2 += r2.decode(i2, { stream: true });
        }
        return n2 + r2.decode();
      }
      let tF = "ResponseAborted";
      class tH extends Error {
        constructor(...e10) {
          super(...e10), this.name = tF;
        }
      }
      let tV = 0, tz = 0, tG = 0;
      function tX(e10) {
        return (null == e10 ? void 0 : e10.name) === "AbortError" || (null == e10 ? void 0 : e10.name) === tF;
      }
      async function tW(e10, t10, r2) {
        try {
          let n2, { errored: i2, destroyed: o2 } = t10;
          if (i2 || o2) return;
          let a2 = (n2 = new AbortController(), t10.once("close", () => {
            t10.writableFinished || n2.abort(new tH());
          }), n2), s2 = function(e11, t11) {
            let r3 = false, n3 = new ty();
            function i3() {
              n3.resolve();
            }
            e11.on("drain", i3), e11.once("close", () => {
              e11.off("drain", i3), n3.resolve();
            });
            let o3 = new ty();
            return e11.once("finish", () => {
              o3.resolve();
            }), new WritableStream({ write: async (t12) => {
              if (!r3) {
                if (r3 = true, "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX) {
                  let e12 = function(e13 = {}) {
                    let t13 = 0 === tV ? void 0 : { clientComponentLoadStart: tV, clientComponentLoadTimes: tz, clientComponentLoadCount: tG };
                    return e13.reset && (tV = 0, tz = 0, tG = 0), t13;
                  }();
                  e12 && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: e12.clientComponentLoadStart, end: e12.clientComponentLoadStart + e12.clientComponentLoadTimes });
                }
                e11.flushHeaders(), e0().trace(eN.startResponse, { spanName: "start response" }, () => void 0);
              }
              try {
                let r4 = e11.write(t12);
                "flush" in e11 && "function" == typeof e11.flush && e11.flush(), r4 || (await n3.promise, n3 = new ty());
              } catch (t13) {
                throw e11.end(), Object.defineProperty(Error("failed to write chunk to response", { cause: t13 }), "__NEXT_ERROR_CODE", { value: "E321", enumerable: false, configurable: true });
              }
            }, abort: (t12) => {
              e11.writableFinished || e11.destroy(t12);
            }, close: async () => {
              if (t11 && await t11, !e11.writableFinished) return e11.end(), o3.promise;
            } });
          }(t10, r2);
          await e10.pipeTo(s2, { signal: a2.signal });
        } catch (e11) {
          if (tX(e11)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      class tK {
        static #e = this.EMPTY = new tK(null, { metadata: {}, contentType: null });
        static fromStatic(e10, t10) {
          return new tK(e10, { metadata: {}, contentType: t10 });
        }
        constructor(e10, { contentType: t10, waitUntil: r2, metadata: n2 }) {
          this.response = e10, this.contentType = t10, this.metadata = n2, this.waitUntil = r2;
        }
        assignMetadata(e10) {
          Object.assign(this.metadata, e10);
        }
        get isNull() {
          return null === this.response;
        }
        get isDynamic() {
          return "string" != typeof this.response;
        }
        toUnchunkedString(e10 = false) {
          if (null === this.response) return "";
          if ("string" != typeof this.response) {
            if (!e10) throw Object.defineProperty(new e6("dynamic responses cannot be unchunked. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E732", enumerable: false, configurable: true });
            return tB(this.readable);
          }
          return this.response;
        }
        get readable() {
          return null === this.response ? new ReadableStream({ start(e10) {
            e10.close();
          } }) : "string" == typeof this.response ? tq(this.response) : e5.Buffer.isBuffer(this.response) ? t$(this.response) : Array.isArray(this.response) ? function(...e10) {
            if (0 === e10.length) return new ReadableStream({ start(e11) {
              e11.close();
            } });
            if (1 === e10.length) return e10[0];
            let { readable: t10, writable: r2 } = new TransformStream(), n2 = e10[0].pipeTo(r2, { preventClose: true }), i2 = 1;
            for (; i2 < e10.length - 1; i2++) {
              let t11 = e10[i2];
              n2 = n2.then(() => t11.pipeTo(r2, { preventClose: true }));
            }
            let o2 = e10[i2];
            return (n2 = n2.then(() => o2.pipeTo(r2))).catch(tL), t10;
          }(...this.response) : this.response;
        }
        coerce() {
          return null === this.response ? [] : "string" == typeof this.response ? [tq(this.response)] : Array.isArray(this.response) ? this.response : e5.Buffer.isBuffer(this.response) ? [t$(this.response)] : [this.response];
        }
        pipeThrough(e10) {
          this.response = this.readable.pipeThrough(e10);
        }
        unshift(e10) {
          this.response = this.coerce(), this.response.unshift(e10);
        }
        push(e10) {
          this.response = this.coerce(), this.response.push(e10);
        }
        async pipeTo(e10) {
          try {
            await this.readable.pipeTo(e10, { preventClose: true }), this.waitUntil && await this.waitUntil, await e10.close();
          } catch (t10) {
            if (tX(t10)) return void await e10.abort(t10);
            throw t10;
          }
        }
        async pipeToNodeResponse(e10) {
          await tW(this.readable, e10, this.waitUntil);
        }
      }
      function tJ(e10, t10) {
        if (!e10) return t10;
        let r2 = parseInt(e10, 10);
        return Number.isFinite(r2) && r2 > 0 ? r2 : t10;
      }
      tJ(process.env.NEXT_PRIVATE_RESPONSE_CACHE_TTL, 1e4), tJ(process.env.NEXT_PRIVATE_RESPONSE_CACHE_MAX_SIZE, 150);
      var tZ = e.i(68886);
      let tQ = /* @__PURE__ */ new Map(), tY = (e10, t10) => {
        for (let r2 of e10) {
          let e11 = tQ.get(r2), n2 = null == e11 ? void 0 : e11.expired;
          if ("number" == typeof n2 && n2 <= Date.now() && n2 > t10) return true;
        }
        return false;
      }, t0 = (e10, t10) => {
        for (let r2 of e10) {
          let e11 = tQ.get(r2), n2 = (null == e11 ? void 0 : e11.stale) ?? 0;
          if ("number" == typeof n2 && n2 > t10) return true;
        }
        return false;
      };
      class t1 {
        constructor(e10) {
          this.fs = e10, this.tasks = [];
        }
        findOrCreateTask(e10) {
          for (let t11 of this.tasks) if (t11[0] === e10) return t11;
          let t10 = this.fs.mkdir(e10);
          t10.catch(() => {
          });
          let r2 = [e10, t10, []];
          return this.tasks.push(r2), r2;
        }
        append(e10, t10) {
          let r2 = this.findOrCreateTask(tZ.default.dirname(e10)), n2 = r2[1].then(() => this.fs.writeFile(e10, t10));
          n2.catch(() => {
          }), r2[2].push(n2);
        }
        wait() {
          return Promise.all(this.tasks.flatMap((e10) => e10[2]));
        }
      }
      function t2(e10) {
        return (null == e10 ? void 0 : e10.length) || 0;
      }
      class t4 {
        static #e = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor(e10) {
          this.fs = e10.fs, this.flushToDisk = e10.flushToDisk, this.serverDistDir = e10.serverDistDir, this.revalidatedTags = e10.revalidatedTags, e10.maxMemoryCacheSize ? t4.memoryCache ? t4.debug && console.log("FileSystemCache: memory store already initialized") : (t4.debug && console.log("FileSystemCache: using memory store for fetch cache"), t4.memoryCache = function(e11) {
            return r || (r = new tE(e11, function({ value: e12 }) {
              var t10, r2;
              if (!e12) return 25;
              if (e12.kind === tD.REDIRECT) return JSON.stringify(e12.props).length;
              if (e12.kind === tD.IMAGE) throw Object.defineProperty(Error("invariant image should not be incremental-cache"), "__NEXT_ERROR_CODE", { value: "E501", enumerable: false, configurable: true });
              if (e12.kind === tD.FETCH) return JSON.stringify(e12.data || "").length;
              if (e12.kind === tD.APP_ROUTE) return e12.body.length;
              return e12.kind === tD.APP_PAGE ? Math.max(1, e12.html.length + t2(e12.rscData) + ((null == (r2 = e12.postponed) ? void 0 : r2.length) || 0) + function(e13) {
                if (!e13) return 0;
                let t11 = 0;
                for (let [r3, n2] of e13) t11 += r3.length + t2(n2);
                return t11;
              }(e12.segmentData)) : e12.html.length + ((null == (t10 = JSON.stringify(e12.pageData)) ? void 0 : t10.length) || 0);
            })), r;
          }(e10.maxMemoryCacheSize)) : t4.debug && console.log("FileSystemCache: not using memory store for fetch cache");
        }
        resetRequestCache() {
        }
        async revalidateTag(e10, t10) {
          if (e10 = "string" == typeof e10 ? [e10] : e10, t4.debug && console.log("FileSystemCache: revalidateTag", e10, t10), 0 === e10.length) return;
          let r2 = Date.now();
          for (let n2 of e10) {
            let e11 = tQ.get(n2) || {};
            if (t10) {
              let i2 = { ...e11 };
              i2.stale = r2, void 0 !== t10.expire && (i2.expired = r2 + 1e3 * t10.expire), tQ.set(n2, i2);
            } else tQ.set(n2, { ...e11, expired: r2 });
          }
        }
        async get(...e10) {
          var t10, r2, n2, i2, o2, a2;
          let [s2, l2] = e10, { kind: u2 } = l2, c2 = null == (t10 = t4.memoryCache) ? void 0 : t10.get(s2);
          if (t4.debug && (u2 === tj.FETCH ? console.log("FileSystemCache: get", s2, l2.tags, u2, !!c2) : console.log("FileSystemCache: get", s2, u2, !!c2)), (null == c2 || null == (r2 = c2.value) ? void 0 : r2.kind) === tD.APP_PAGE || (null == c2 || null == (n2 = c2.value) ? void 0 : n2.kind) === tD.APP_ROUTE || (null == c2 || null == (i2 = c2.value) ? void 0 : i2.kind) === tD.PAGES) {
            let e11 = null == (a2 = c2.value.headers) ? void 0 : a2[m];
            if ("string" == typeof e11) {
              let t11 = e11.split(",");
              if (t11.length > 0 && tY(t11, c2.lastModified)) return t4.debug && console.log("FileSystemCache: expired tags", t11), null;
            }
          } else if ((null == c2 || null == (o2 = c2.value) ? void 0 : o2.kind) === tD.FETCH) {
            let e11 = l2.kind === tj.FETCH ? [...l2.tags || [], ...l2.softTags || []] : [];
            if (e11.some((e12) => this.revalidatedTags.includes(e12))) return t4.debug && console.log("FileSystemCache: was revalidated", e11), null;
            if (tY(e11, c2.lastModified)) return t4.debug && console.log("FileSystemCache: expired tags", e11), null;
          }
          return c2 ?? null;
        }
        async set(e10, t10, r2) {
          var n2;
          if (null == (n2 = t4.memoryCache) || n2.set(e10, { value: t10, lastModified: Date.now() }), t4.debug && console.log("FileSystemCache: set", e10), !this.flushToDisk || !t10) return;
          let i2 = new t1(this.fs);
          if (t10.kind === tD.APP_ROUTE) {
            let r3 = this.getFilePath(`${e10}.body`, tj.APP_ROUTE);
            i2.append(r3, t10.body);
            let n3 = { headers: t10.headers, status: t10.status, postponed: void 0, segmentPaths: void 0, prefetchHints: void 0 };
            i2.append(r3.replace(/\.body$/, g), JSON.stringify(n3, null, 2));
          } else if (t10.kind === tD.PAGES || t10.kind === tD.APP_PAGE) {
            let n3 = t10.kind === tD.APP_PAGE, o2 = this.getFilePath(`${e10}.html`, n3 ? tj.APP_PAGE : tj.PAGES);
            if (i2.append(o2, t10.html), r2.fetchCache || r2.isFallback || r2.isRoutePPREnabled || i2.append(this.getFilePath(`${e10}${n3 ? ".rsc" : ".json"}`, n3 ? tj.APP_PAGE : tj.PAGES), n3 ? t10.rscData : JSON.stringify(t10.pageData)), (null == t10 ? void 0 : t10.kind) === tD.APP_PAGE) {
              let e11;
              if (t10.segmentData) {
                e11 = [];
                let r4 = o2.replace(/\.html$/, ".segments");
                for (let [n4, o3] of t10.segmentData) {
                  e11.push(n4);
                  let t11 = r4 + n4 + ".segment.rsc";
                  i2.append(t11, o3);
                }
              }
              let r3 = { headers: t10.headers, status: t10.status, postponed: t10.postponed, segmentPaths: e11, prefetchHints: void 0 };
              i2.append(o2.replace(/\.html$/, g), JSON.stringify(r3));
            }
          } else if (t10.kind === tD.FETCH) {
            let n3 = this.getFilePath(e10, tj.FETCH);
            i2.append(n3, JSON.stringify({ ...t10, tags: r2.fetchCache ? r2.tags : [] }));
          }
          await i2.wait();
        }
        getFilePath(e10, t10) {
          switch (t10) {
            case tj.FETCH:
              return tZ.default.join(this.serverDistDir, "..", "cache", "fetch-cache", e10);
            case tj.PAGES:
              return tZ.default.join(this.serverDistDir, "pages", e10);
            case tj.IMAGE:
            case tj.APP_PAGE:
            case tj.APP_ROUTE:
              return tZ.default.join(this.serverDistDir, "app", e10);
            default:
              throw Object.defineProperty(Error(`Unexpected file path kind: ${t10}`), "__NEXT_ERROR_CODE", { value: "E479", enumerable: false, configurable: true });
          }
        }
      }
      let t3 = ["(..)(..)", "(.)", "(..)", "(...)"], t9 = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/, t7 = /\/\[[^/]+\](?=\/|$)/;
      function t6(e10) {
        return e10.replace(/(?:\/index)?\/?$/, "") || "/";
      }
      class t5 {
        static #e = this.cacheControls = /* @__PURE__ */ new Map();
        constructor(e10) {
          this.prerenderManifest = e10;
        }
        get(e10) {
          let t10 = t5.cacheControls.get(e10);
          if (t10) return t10;
          let r2 = this.prerenderManifest.routes[e10];
          if (r2) {
            let { initialRevalidateSeconds: e11, initialExpireSeconds: t11 } = r2;
            if (void 0 !== e11) return { revalidate: e11, expire: t11 };
          }
          let n2 = this.prerenderManifest.dynamicRoutes[e10];
          if (n2) {
            let { fallbackRevalidate: e11, fallbackExpire: t11 } = n2;
            if (void 0 !== e11) return { revalidate: e11, expire: t11 };
          }
        }
        set(e10, t10) {
          t5.cacheControls.set(e10, t10);
        }
        clear() {
          t5.cacheControls.clear();
        }
      }
      e.i(67914);
      class t8 {
        static #e = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor({ fs: e10, dev: t10, flushToDisk: r2, minimalMode: n2, serverDistDir: i2, requestHeaders: o2, maxMemoryCacheSize: a2, getPrerenderManifest: s2, fetchCacheKeyPrefix: l2, CurCacheHandler: u2, allowedRevalidateHeaderKeys: c2 }) {
          var d2, h2, p2, g2;
          this.locks = /* @__PURE__ */ new Map(), this.hasCustomCacheHandler = !!u2;
          const m2 = Symbol.for("@next/cache-handlers"), b2 = globalThis;
          if (u2) t8.debug && console.log("IncrementalCache: using custom cache handler", u2.name);
          else {
            const t11 = b2[m2];
            (null == t11 ? void 0 : t11.FetchCache) ? (u2 = t11.FetchCache, t8.debug && console.log("IncrementalCache: using global FetchCache cache handler")) : e10 && i2 && (t8.debug && console.log("IncrementalCache: using filesystem cache handler"), u2 = t4);
          }
          process.env.__NEXT_TEST_MAX_ISR_CACHE && (a2 = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10)), this.dev = t10, this.disableForTestmode = "true" === process.env.NEXT_PRIVATE_TEST_PROXY, this.minimalMode = n2, this.requestHeaders = o2, this.allowedRevalidateHeaderKeys = c2, this.prerenderManifest = s2(), this.cacheControls = new t5(this.prerenderManifest), this.fetchCacheKeyPrefix = l2;
          let w2 = [];
          o2[f] === (null == (h2 = this.prerenderManifest) || null == (d2 = h2.preview) ? void 0 : d2.previewModeId) && (this.isOnDemandRevalidate = true), n2 && (w2 = this.revalidatedTags = function(e11, t11) {
            return "string" == typeof e11[v] && e11["x-next-revalidate-tag-token"] === t11 ? e11[v].split(",") : [];
          }(o2, null == (g2 = this.prerenderManifest) || null == (p2 = g2.preview) ? void 0 : p2.previewModeId)), u2 && (this.cacheHandler = new u2({ dev: t10, fs: e10, flushToDisk: r2, serverDistDir: i2, revalidatedTags: w2, maxMemoryCacheSize: a2, _requestHeaders: o2, fetchCacheKeyPrefix: l2 }));
        }
        calculateRevalidate(e10, t10, r2, n2) {
          if (r2) return Math.floor(performance.timeOrigin + performance.now() - 1e3);
          let i2 = this.cacheControls.get(t6(e10)), o2 = i2 ? i2.revalidate : !n2 && 1;
          return "number" == typeof o2 ? 1e3 * o2 + t10 : o2;
        }
        _getPathname(e10, t10) {
          return t10 ? e10 : /^\/index(\/|$)/.test(e10) && !function(e11, t11 = true) {
            return (void 0 !== e11.split("/").find((e12) => t3.find((t12) => e12.startsWith(t12))) && (e11 = function(e12) {
              let t12, r2, n2;
              for (let i2 of e12.split("/")) if (r2 = t3.find((e13) => i2.startsWith(e13))) {
                [t12, n2] = e12.split(r2, 2);
                break;
              }
              if (!t12 || !r2 || !n2) throw Object.defineProperty(Error(`Invalid interception route: ${e12}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", { value: "E269", enumerable: false, configurable: true });
              switch (t12 = ep(t12), r2) {
                case "(.)":
                  n2 = "/" === t12 ? `/${n2}` : t12 + "/" + n2;
                  break;
                case "(..)":
                  if ("/" === t12) throw Object.defineProperty(Error(`Invalid interception route: ${e12}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", { value: "E207", enumerable: false, configurable: true });
                  n2 = t12.split("/").slice(0, -1).concat(n2).join("/");
                  break;
                case "(...)":
                  n2 = "/" + n2;
                  break;
                case "(..)(..)":
                  let i2 = t12.split("/");
                  if (i2.length <= 2) throw Object.defineProperty(Error(`Invalid interception route: ${e12}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", { value: "E486", enumerable: false, configurable: true });
                  n2 = i2.slice(0, -2).concat(n2).join("/");
                  break;
                default:
                  throw Object.defineProperty(Error("Invariant: unexpected marker"), "__NEXT_ERROR_CODE", { value: "E112", enumerable: false, configurable: true });
              }
              return { interceptingRoute: t12, interceptedRoute: n2 };
            }(e11).interceptedRoute), t11) ? t7.test(e11) : t9.test(e11);
          }(e10) ? `/index${e10}` : "/" === e10 ? "/index" : eh(e10);
        }
        resetRequestCache() {
          var e10, t10;
          null == (t10 = this.cacheHandler) || null == (e10 = t10.resetRequestCache) || e10.call(t10);
        }
        async lock(e10) {
          for (; ; ) {
            let t11 = this.locks.get(e10);
            if (t8.debug && console.log("IncrementalCache: lock get", e10, !!t11), !t11) break;
            await t11;
          }
          let { resolve: t10, promise: r2 } = new ty();
          return t8.debug && console.log("IncrementalCache: successfully locked", e10), this.locks.set(e10, r2), () => {
            t10(), this.locks.delete(e10);
          };
        }
        async revalidateTag(e10, t10) {
          var r2;
          return null == (r2 = this.cacheHandler) ? void 0 : r2.revalidateTag(e10, t10);
        }
        async generateCacheKey(e10, t10 = {}) {
          let r2 = [], n2 = new TextEncoder(), i2 = new TextDecoder();
          if (t10.body) if (t10.body instanceof Uint8Array) r2.push(i2.decode(t10.body)), t10._ogBody = t10.body;
          else if ("function" == typeof t10.body.getReader) {
            let e11 = t10.body, o3 = [];
            try {
              await e11.pipeTo(new WritableStream({ write(e12) {
                "string" == typeof e12 ? (o3.push(n2.encode(e12)), r2.push(e12)) : (o3.push(e12), r2.push(i2.decode(e12, { stream: true })));
              } })), r2.push(i2.decode());
              let a3 = o3.reduce((e12, t11) => e12 + t11.length, 0), s3 = new Uint8Array(a3), l2 = 0;
              for (let e12 of o3) s3.set(e12, l2), l2 += e12.length;
              t10._ogBody = s3;
            } catch (e12) {
              console.error("Problem reading body", e12);
            }
          } else if ("function" == typeof t10.body.keys) {
            let e11 = t10.body;
            for (let n3 of (t10._ogBody = t10.body, /* @__PURE__ */ new Set([...e11.keys()]))) {
              let t11 = e11.getAll(n3);
              r2.push(`${n3}=${(await Promise.all(t11.map(async (e12) => "string" == typeof e12 ? e12 : await e12.text()))).join(",")}`);
            }
          } else if ("function" == typeof t10.body.arrayBuffer) {
            let e11 = t10.body, n3 = await e11.arrayBuffer();
            r2.push(await e11.text()), t10._ogBody = new Blob([n3], { type: e11.type });
          } else "string" == typeof t10.body && (r2.push(t10.body), t10._ogBody = t10.body);
          let o2 = "function" == typeof (t10.headers || {}).keys ? Object.fromEntries(t10.headers) : Object.assign({}, t10.headers);
          "traceparent" in o2 && delete o2.traceparent, "tracestate" in o2 && delete o2.tracestate;
          let a2 = JSON.stringify(["v3", this.fetchCacheKeyPrefix || "", e10, t10.method, o2, t10.mode, t10.redirect, t10.credentials, t10.referrer, t10.referrerPolicy, t10.integrity, t10.cache, r2]);
          {
            var s2;
            let e11 = n2.encode(a2);
            return s2 = await crypto.subtle.digest("SHA-256", e11), Array.prototype.map.call(new Uint8Array(s2), (e12) => e12.toString(16).padStart(2, "0")).join("");
          }
        }
        async get(e10, t10) {
          var r2, n2, i2, o2, a2, s2, l2;
          let u2, c2;
          if (t10.kind === tj.FETCH) {
            let r3 = e3.getStore(), n3 = r3 ? function(e11) {
              switch (e11.type) {
                case "request":
                case "prerender":
                case "prerender-runtime":
                case "prerender-client":
                case "validation-client":
                  if (e11.renderResumeDataCache) return e11.renderResumeDataCache;
                case "prerender-ppr":
                  return e11.prerenderResumeDataCache ?? null;
                case "cache":
                case "private-cache":
                case "unstable-cache":
                case "prerender-legacy":
                case "generate-static-params":
                  return null;
                default:
                  return e11;
              }
            }(r3) : null;
            if (n3) {
              let r4 = n3.fetch.get(e10);
              if ((null == r4 ? void 0 : r4.kind) === tD.FETCH) {
                let n4 = ey.getStore();
                if (![...t10.tags || [], ...t10.softTags || []].some((e11) => {
                  var t11, r5;
                  return (null == (t11 = this.revalidatedTags) ? void 0 : t11.includes(e11)) || (null == n4 || null == (r5 = n4.pendingRevalidatedTags) ? void 0 : r5.some((t12) => t12.tag === e11));
                })) return t8.debug && console.log("IncrementalCache: rdc:hit", e10), { isStale: false, value: r4 };
                t8.debug && console.log("IncrementalCache: rdc:revalidated-tag", e10);
              } else t8.debug && console.log("IncrementalCache: rdc:miss", e10);
            } else t8.debug && console.log("IncrementalCache: rdc:no-resume-data");
          }
          if (this.disableForTestmode || this.dev && (t10.kind !== tj.FETCH || "no-cache" === this.requestHeaders["cache-control"])) return null;
          e10 = this._getPathname(e10, t10.kind === tj.FETCH);
          let d2 = await (null == (r2 = this.cacheHandler) ? void 0 : r2.get(e10, t10));
          if (t10.kind === tj.FETCH) {
            if (!d2) return null;
            if ((null == (i2 = d2.value) ? void 0 : i2.kind) !== tD.FETCH) throw Object.defineProperty(new e6(`Expected cached value for cache key ${JSON.stringify(e10)} to be a "FETCH" kind, got ${JSON.stringify(null == (o2 = d2.value) ? void 0 : o2.kind)} instead.`), "__NEXT_ERROR_CODE", { value: "E653", enumerable: false, configurable: true });
            let r3 = ey.getStore(), n3 = [...t10.tags || [], ...t10.softTags || []];
            if (n3.some((e11) => {
              var t11, n4;
              return (null == (t11 = this.revalidatedTags) ? void 0 : t11.includes(e11)) || (null == r3 || null == (n4 = r3.pendingRevalidatedTags) ? void 0 : n4.some((t12) => t12.tag === e11));
            })) return t8.debug && console.log("IncrementalCache: expired tag", e10), null;
            let a3 = e3.getStore();
            if (a3) {
              let t11 = e9(a3);
              t11 && (t8.debug && console.log("IncrementalCache: rdc:set", e10), t11.fetch.set(e10, d2.value));
            }
            let s3 = t10.revalidate || d2.value.revalidate, l3 = (performance.timeOrigin + performance.now() - (d2.lastModified || 0)) / 1e3 > s3, u3 = d2.value.data;
            return tY(n3, d2.lastModified) ? null : (t0(n3, d2.lastModified) && (l3 = true), { isStale: l3, value: { kind: tD.FETCH, data: u3, revalidate: s3 } });
          }
          if ((null == d2 || null == (n2 = d2.value) ? void 0 : n2.kind) === tD.FETCH) throw Object.defineProperty(new e6(`Expected cached value for cache key ${JSON.stringify(e10)} not to be a ${JSON.stringify(t10.kind)} kind, got "FETCH" instead.`), "__NEXT_ERROR_CODE", { value: "E652", enumerable: false, configurable: true });
          let h2 = null, { isFallback: p2 } = t10, f2 = this.cacheControls.get(t6(e10));
          if ((null == d2 ? void 0 : d2.lastModified) === -1) u2 = -1, c2 = -31536e6;
          else {
            let r3 = performance.timeOrigin + performance.now(), n3 = (null == d2 ? void 0 : d2.lastModified) || r3;
            if (void 0 === (u2 = false !== (c2 = this.calculateRevalidate(e10, n3, this.dev ?? false, t10.isFallback)) && c2 < r3 || void 0) && ((null == d2 || null == (a2 = d2.value) ? void 0 : a2.kind) === tD.APP_PAGE || (null == d2 || null == (s2 = d2.value) ? void 0 : s2.kind) === tD.APP_ROUTE)) {
              let e11 = null == (l2 = d2.value.headers) ? void 0 : l2[m];
              if ("string" == typeof e11) {
                let t11 = e11.split(",");
                t11.length > 0 && (tY(t11, n3) ? u2 = -1 : t0(t11, n3) && (u2 = true));
              }
            }
          }
          return d2 && (h2 = { isStale: u2, cacheControl: f2, revalidateAfter: c2, value: d2.value, isFallback: p2 }), !d2 && this.prerenderManifest.notFoundRoutes.includes(e10) && (h2 = { isStale: u2, value: null, cacheControl: f2, revalidateAfter: c2, isFallback: p2 }, this.set(e10, h2.value, { ...t10, cacheControl: f2 })), h2;
        }
        async set(e10, t10, r2) {
          if ((null == t10 ? void 0 : t10.kind) === tD.FETCH) {
            let r3 = e3.getStore(), n3 = r3 ? e9(r3) : null;
            n3 && (t8.debug && console.log("IncrementalCache: rdc:set", e10), n3.fetch.set(e10, t10));
          }
          if (this.disableForTestmode || this.dev && !r2.fetchCache) return;
          e10 = this._getPathname(e10, r2.fetchCache);
          let n2 = JSON.stringify(t10).length;
          if (r2.fetchCache && n2 > 2097152 && !this.hasCustomCacheHandler && !r2.isImplicitBuildTimeCache) {
            let t11 = `Failed to set Next.js data cache for ${r2.fetchUrl || e10}, items over 2MB can not be cached (${n2} bytes)`;
            if (this.dev) throw Object.defineProperty(Error(t11), "__NEXT_ERROR_CODE", { value: "E1003", enumerable: false, configurable: true });
            console.warn(t11);
            return;
          }
          try {
            var i2;
            !r2.fetchCache && r2.cacheControl && this.cacheControls.set(t6(e10), r2.cacheControl), await (null == (i2 = this.cacheHandler) ? void 0 : i2.set(e10, t10, r2));
          } catch (t11) {
            console.warn("Failed to update prerender cache for", e10, t11);
          }
        }
      }
      if (e.i(64445), e.i(40049).default.unstable_postpone, false === ("Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("needs to bail out of prerendering at this point because it used") && "Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      RegExp("\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)"), RegExp("\\n\\s+at __next_metadata_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_viewport_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_outlet_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_instant_validation_boundary__[\\n\\s]");
      var re = e.i(3466);
      let rt = globalThis, rr = rt.prisma ?? (() => {
        let e10 = process.env.DATABASE_URL || "", t10 = "phase-production-build" === process.env.NEXT_PHASE || "build" === process.env.npm_lifecycle_event;
        if (!t10 && (e10.includes(".supabase.co:5432") || e10.includes(".supabase.com:5432")) && (console.warn("[PRISMA] \u26A0\uFE0F  Using Supabase Session Mode (port 5432) - limited pool size!"), console.warn("[PRISMA] \u{1F4A1} Consider switching to Transaction Mode (port 6543) for better pooling"), e10.includes(":5432"))) {
          let t11 = new URL(e10.replace(":5432", ":6543"));
          t11.searchParams.set("pgbouncer", "true"), t11.searchParams.has("connection_limit") || t11.searchParams.set("connection_limit", "1"), e10 = t11.toString(), console.log("[PRISMA] \u2705 Converted to Transaction Mode (port 6543) for runtime");
        }
        if (e10.includes(":6543") && !t10) {
          let t11 = new URL(e10);
          t11.searchParams.has("pgbouncer") || (t11.searchParams.set("pgbouncer", "true"), e10 = t11.toString()), t11.searchParams.has("connection_limit") || t11.searchParams.set("connection_limit", "1");
        }
        return new re.PrismaClient({ log: ["error"], datasources: { db: { url: e10 } } });
      })();
      rt.prisma || (rt.prisma = rr);
      let rn = ["super-admin", "admin", "api", "auth", "login", "favicon.ico", "robots.txt", "sitemap.xml", "assets", "data", "_next"];
      e.s(["config", 0, { matcher: ["/((?!_next/static|_next/image).*)"] }, "middleware", 0, function(e10) {
        let { pathname: t10 } = e10.nextUrl;
        if (t10.startsWith("/_next") || t10.startsWith("/assets") || t10.startsWith("/data") || t10.startsWith("/api") || "/favicon.ico" === t10 || "/favicon.png" === t10 || "/robots.txt" === t10 || "/sitemap.xml" === t10 || "/" === t10) return es.next();
        if ("/super-admin" === t10 || t10.startsWith("/super-admin/")) {
          let e11 = t10.split("/").filter(Boolean);
          return e11.length >= 2 && "super-admin" === e11[1] ? new es(null, { status: 404 }) : es.next();
        }
        let r2 = t10.split("/").filter(Boolean);
        if (r2.length >= 2 && "admin" === r2[1]) return new es(null, { status: 404 });
        if (r2.length > 0) {
          var n2;
          if (n2 = r2[0], rn.includes(n2.toLowerCase())) return new es(null, { status: 404 });
        }
        return es.next();
      }], 99446);
      let ri = { ...e.i(99446) }, ro = "/middleware", ra = ri.middleware || ri.default;
      if ("function" != typeof ra) throw new class extends Error {
        constructor(e10) {
          super(e10), this.stack = "";
        }
      }(`The Middleware file "${ro}" must export a function named \`middleware\` or a default function.`);
      let rs = (e10) => tw({ ...e10, IncrementalCache: t8, incrementalCacheHandler: null, page: ro, handler: async (...e11) => {
        try {
          return await ra(...e11);
        } catch (i2) {
          let t10 = e11[0], r2 = new URL(t10.url), n2 = r2.pathname + r2.search;
          throw await s(i2, { path: n2, method: t10.method, headers: Object.fromEntries(t10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/proxy", routeType: "proxy", revalidateReason: void 0 }), i2;
        }
      } });
      async function rl(e10, t10) {
        let r2 = await rs({ request: { url: e10.url, method: e10.method, headers: _(e10.headers), nextConfig: { basePath: "", i18n: "", trailingSlash: false, experimental: { cacheLife: { default: { stale: 300, revalidate: 900, expire: 4294967294 }, seconds: { stale: 30, revalidate: 1, expire: 60 }, minutes: { stale: 300, revalidate: 60, expire: 3600 }, hours: { stale: 300, revalidate: 3600, expire: 86400 }, days: { stale: 300, revalidate: 86400, expire: 604800 }, weeks: { stale: 300, revalidate: 604800, expire: 2592e3 }, max: { stale: 300, revalidate: 2592e3, expire: 31536e3 } }, authInterrupts: false, clientParamParsingOrigins: [] } }, page: { name: ro }, body: "GET" !== e10.method && "HEAD" !== e10.method ? e10.body ?? void 0 : void 0, waitUntil: t10.waitUntil, requestMeta: t10.requestMeta, signal: t10.signal || new AbortController().signal } });
        return null == t10.waitUntil || t10.waitUntil.call(t10, r2.waitUntil), r2.response;
      }
      e.s(["default", 0, rs, "handler", 0, rl], 42738);
    }]);
  }
});

// .next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0i6abj3.js
var require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_0i6abj3 = __commonJS({
  ".next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0i6abj3.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0i6abj3.js", { otherChunks: ["chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0a9gg_0.js", "chunks/[root-of-the-server]__0x0qbhs._.js"], runtimeModuleIds: [38022] }]), (() => {
      let e;
      if (!Array.isArray(globalThis.TURBOPACK)) return;
      let t = ["NEXT_DEPLOYMENT_ID", "NEXT_CLIENT_ASSET_SUFFIX"];
      var r, n = ((r = n || {})[r.Runtime = 0] = "Runtime", r[r.Parent = 1] = "Parent", r[r.Update = 2] = "Update", r);
      let o = /* @__PURE__ */ new WeakMap();
      function u(e2, t2) {
        this.m = e2, this.e = t2;
      }
      let l = u.prototype, i = Object.prototype.hasOwnProperty, a = "u" > typeof Symbol && Symbol.toStringTag;
      function s(e2, t2, r2) {
        i.call(e2, t2) || Object.defineProperty(e2, t2, r2);
      }
      function c(e2, t2) {
        let r2 = e2[t2];
        return r2 || (r2 = f(t2), e2[t2] = r2), r2;
      }
      function f(e2) {
        return { exports: {}, error: void 0, id: e2, namespaceObject: void 0 };
      }
      function d(e2, t2) {
        s(e2, "__esModule", { value: true }), a && s(e2, a, { value: "Module" });
        let r2 = 0;
        for (; r2 < t2.length; ) {
          let n2 = t2[r2++], o2 = t2[r2++];
          if ("number" == typeof o2) if (0 === o2) s(e2, n2, { value: t2[r2++], enumerable: true, writable: false });
          else throw Error(`unexpected tag: ${o2}`);
          else "function" == typeof t2[r2] ? s(e2, n2, { get: o2, set: t2[r2++], enumerable: true }) : s(e2, n2, { get: o2, enumerable: true });
        }
        Object.seal(e2);
      }
      function h(e2, t2) {
        (null != t2 ? c(this.c, t2) : this.m).exports = e2;
      }
      l.s = function(e2, t2) {
        let r2, n2;
        null != t2 ? n2 = (r2 = c(this.c, t2)).exports : (r2 = this.m, n2 = this.e), r2.namespaceObject = n2, d(n2, e2);
      }, l.j = function(e2, t2) {
        var r2, n2;
        let u2, l2, a2;
        null != t2 ? l2 = (u2 = c(this.c, t2)).exports : (u2 = this.m, l2 = this.e);
        let s2 = (r2 = u2, n2 = l2, (a2 = o.get(r2)) || (o.set(r2, a2 = []), r2.exports = r2.namespaceObject = new Proxy(n2, { get(e3, t3) {
          if (i.call(e3, t3) || "default" === t3 || "__esModule" === t3) return Reflect.get(e3, t3);
          for (let e4 of a2) {
            let r3 = Reflect.get(e4, t3);
            if (void 0 !== r3) return r3;
          }
        }, ownKeys(e3) {
          let t3 = Reflect.ownKeys(e3);
          for (let e4 of a2) for (let r3 of Reflect.ownKeys(e4)) "default" === r3 || t3.includes(r3) || t3.push(r3);
          return t3;
        } })), a2);
        "object" == typeof e2 && null !== e2 && s2.push(e2);
      }, l.v = h, l.n = function(e2, t2) {
        let r2;
        (r2 = null != t2 ? c(this.c, t2) : this.m).exports = r2.namespaceObject = e2;
      };
      let p = Object.getPrototypeOf ? (e2) => Object.getPrototypeOf(e2) : (e2) => e2.__proto__, m = [null, p({}), p([]), p(p)];
      function b(e2, t2, r2) {
        let n2 = [], o2 = -1;
        for (let t3 = e2; ("object" == typeof t3 || "function" == typeof t3) && !m.includes(t3); t3 = p(t3)) for (let r3 of Object.getOwnPropertyNames(t3)) n2.push(r3, /* @__PURE__ */ function(e3, t4) {
          return () => e3[t4];
        }(e2, r3)), -1 === o2 && "default" === r3 && (o2 = n2.length - 1);
        return r2 && o2 >= 0 || (o2 >= 0 ? n2.splice(o2, 1, 0, e2) : n2.push("default", 0, e2)), d(t2, n2), t2;
      }
      function y(e2) {
        return "function" == typeof e2 ? function(...t2) {
          return e2.apply(this, t2);
        } : /* @__PURE__ */ Object.create(null);
      }
      function g(e2) {
        let t2 = K(e2, this.m);
        if (t2.namespaceObject) return t2.namespaceObject;
        let r2 = t2.exports;
        return t2.namespaceObject = b(r2, y(r2), r2 && r2.__esModule);
      }
      function w(e2) {
        let t2 = e2.indexOf("#");
        -1 !== t2 && (e2 = e2.substring(0, t2));
        let r2 = e2.indexOf("?");
        return -1 !== r2 && (e2 = e2.substring(0, r2)), e2;
      }
      function O(e2) {
        return "string" == typeof e2 ? e2 : e2.path;
      }
      function _() {
        let e2, t2;
        return { promise: new Promise((r2, n2) => {
          t2 = n2, e2 = r2;
        }), resolve: e2, reject: t2 };
      }
      l.i = g, l.A = function(e2) {
        return this.r(e2)(g.bind(this));
      }, l.t = "function" == typeof __require ? __require : function() {
        throw Error("Unexpected use of runtime require");
      }, l.r = function(e2) {
        return K(e2, this.m).exports;
      }, l.f = function(e2) {
        function t2(t3) {
          if (t3 = w(t3), i.call(e2, t3)) return e2[t3].module();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }
        return t2.keys = () => Object.keys(e2), t2.resolve = (t3) => {
          if (t3 = w(t3), i.call(e2, t3)) return e2[t3].id();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }, t2.import = async (e3) => await t2(e3), t2;
      };
      let k = Symbol("turbopack queues"), j = Symbol("turbopack exports"), C = Symbol("turbopack error");
      function P(e2) {
        e2 && 1 !== e2.status && (e2.status = 1, e2.forEach((e3) => e3.queueCount--), e2.forEach((e3) => e3.queueCount-- ? e3.queueCount++ : e3()));
      }
      l.a = function(e2, t2) {
        let r2 = this.m, n2 = t2 ? Object.assign([], { status: -1 }) : void 0, o2 = /* @__PURE__ */ new Set(), { resolve: u2, reject: l2, promise: i2 } = _(), a2 = Object.assign(i2, { [j]: r2.exports, [k]: (e3) => {
          n2 && e3(n2), o2.forEach(e3), a2.catch(() => {
          });
        } }), s2 = { get: () => a2, set(e3) {
          e3 !== a2 && (a2[j] = e3);
        } };
        Object.defineProperty(r2, "exports", s2), Object.defineProperty(r2, "namespaceObject", s2), e2(function(e3) {
          let t3 = e3.map((e4) => {
            if (null !== e4 && "object" == typeof e4) {
              if (k in e4) return e4;
              if (null != e4 && "object" == typeof e4 && "then" in e4 && "function" == typeof e4.then) {
                let t4 = Object.assign([], { status: 0 }), r4 = { [j]: {}, [k]: (e5) => e5(t4) };
                return e4.then((e5) => {
                  r4[j] = e5, P(t4);
                }, (e5) => {
                  r4[C] = e5, P(t4);
                }), r4;
              }
            }
            return { [j]: e4, [k]: () => {
            } };
          }), r3 = () => t3.map((e4) => {
            if (e4[C]) throw e4[C];
            return e4[j];
          }), { promise: u3, resolve: l3 } = _(), i3 = Object.assign(() => l3(r3), { queueCount: 0 });
          function a3(e4) {
            e4 !== n2 && !o2.has(e4) && (o2.add(e4), e4 && 0 === e4.status && (i3.queueCount++, e4.push(i3)));
          }
          return t3.map((e4) => e4[k](a3)), i3.queueCount ? u3 : r3();
        }, function(e3) {
          e3 ? l2(a2[C] = e3) : u2(a2[j]), P(n2);
        }), n2 && -1 === n2.status && (n2.status = 0);
      };
      let v = function(e2) {
        let t2 = new URL(e2, "x:/"), r2 = {};
        for (let e3 in t2) r2[e3] = t2[e3];
        for (let t3 in r2.href = e2, r2.pathname = e2.replace(/[?#].*/, ""), r2.origin = r2.protocol = "", r2.toString = r2.toJSON = (...t4) => e2, r2) Object.defineProperty(this, t3, { enumerable: true, configurable: true, value: r2[t3] });
      };
      function E(e2, t2) {
        throw Error(`Invariant: ${t2(e2)}`);
      }
      v.prototype = URL.prototype, l.U = v, l.z = function(e2) {
        throw Error("dynamic usage of require is not supported");
      }, l.g = globalThis;
      let U = u.prototype, x = /* @__PURE__ */ new Map();
      l.M = x;
      let R = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map();
      async function $(e2, t2, r2) {
        let n2;
        if ("string" == typeof r2) return q(e2, t2, A(r2));
        let o2 = r2.included || [], u2 = o2.map((e3) => !!x.has(e3) || R.get(e3));
        if (u2.length > 0 && u2.every((e3) => e3)) return void await Promise.all(u2);
        let l2 = r2.moduleChunks || [], i2 = l2.map((e3) => M.get(e3)).filter((e3) => e3);
        if (i2.length > 0) {
          if (i2.length === l2.length) return void await Promise.all(i2);
          let r3 = /* @__PURE__ */ new Set();
          for (let e3 of l2) M.has(e3) || r3.add(e3);
          for (let n3 of r3) {
            let r4 = q(e2, t2, A(n3));
            M.set(n3, r4), i2.push(r4);
          }
          n2 = Promise.all(i2);
        } else {
          for (let o3 of (n2 = q(e2, t2, A(r2.path)), l2)) M.has(o3) || M.set(o3, n2);
        }
        for (let e3 of o2) R.has(e3) || R.set(e3, n2);
        await n2;
      }
      U.l = function(e2) {
        return $(n.Parent, this.m.id, e2);
      };
      let T = Promise.resolve(void 0), S = /* @__PURE__ */ new WeakMap();
      function q(t2, r2, o2) {
        let u2 = e.loadChunkCached(t2, o2), l2 = S.get(u2);
        if (void 0 === l2) {
          let e2 = S.set.bind(S, u2, T);
          l2 = u2.then(e2).catch((e3) => {
            let u3;
            switch (t2) {
              case n.Runtime:
                u3 = `as a runtime dependency of chunk ${r2}`;
                break;
              case n.Parent:
                u3 = `from module ${r2}`;
                break;
              case n.Update:
                u3 = "from an HMR update";
                break;
              default:
                E(t2, (e4) => `Unknown source type: ${e4}`);
            }
            let l3 = Error(`Failed to load chunk ${o2} ${u3}${e3 ? `: ${e3}` : ""}`, e3 ? { cause: e3 } : void 0);
            throw l3.name = "ChunkLoadError", l3;
          }), S.set(u2, l2);
        }
        return l2;
      }
      function A(e2) {
        return `${e2.split("/").map((e3) => encodeURIComponent(e3)).join("/")}`;
      }
      U.L = function(e2) {
        return q(n.Parent, this.m.id, e2);
      }, U.R = function(e2) {
        let t2 = this.r(e2);
        return t2?.default ?? t2;
      }, U.P = function(e2) {
        return `/ROOT/${e2 ?? ""}`;
      }, U.q = function(e2, t2) {
        h.call(this, `${e2}`, t2);
      }, U.b = function(e2, r2, n2, o2) {
        let u2 = "SharedWorker" === e2.name, l2 = [n2.map((e3) => A(e3)).reverse(), ""];
        for (let e3 of t) l2.push(globalThis[e3]);
        let i2 = new URL(A(r2), location.origin), a2 = JSON.stringify(l2);
        return u2 ? i2.searchParams.set("params", a2) : i2.hash = "#params=" + encodeURIComponent(a2), new e2(i2, o2 ? { ...o2, type: void 0 } : void 0);
      };
      let N = /\.js(?:\?[^#]*)?(?:#.*)?$/;
      l.w = function(t2, r2, o2) {
        return e.loadWebAssembly(n.Parent, this.m.id, t2, r2, o2);
      }, l.u = function(t2, r2) {
        return e.loadWebAssemblyModule(n.Parent, this.m.id, t2, r2);
      };
      let I = {};
      l.c = I;
      let K = (e2, t2) => {
        let r2 = I[e2];
        if (r2) {
          if (r2.error) throw r2.error;
          return r2;
        }
        return L(e2, n.Parent, t2.id);
      };
      function L(e2, t2, r2) {
        let n2 = x.get(e2);
        if ("function" != typeof n2) throw Error(function(e3, t3, r3) {
          let n3;
          switch (t3) {
            case 0:
              n3 = `as a runtime entry of chunk ${r3}`;
              break;
            case 1:
              n3 = `because it was required from module ${r3}`;
              break;
            case 2:
              n3 = "because of an HMR update";
              break;
            default:
              E(t3, (e4) => `Unknown source type: ${e4}`);
          }
          return `Module ${e3} was instantiated ${n3}, but the module factory is not available.`;
        }(e2, t2, r2));
        let o2 = f(e2), l2 = o2.exports;
        I[e2] = o2;
        let i2 = new u(o2, l2);
        try {
          n2(i2, o2, l2);
        } catch (e3) {
          throw o2.error = e3, e3;
        }
        return o2.namespaceObject && o2.exports !== o2.namespaceObject && b(o2.exports, o2.namespaceObject), o2;
      }
      function W(t2) {
        let r2, n2 = function(e2) {
          if ("string" == typeof e2) return e2;
          if (e2) return { src: e2.getAttribute("src") };
          if ("u" > typeof TURBOPACK_NEXT_CHUNK_URLS) return { src: TURBOPACK_NEXT_CHUNK_URLS.pop() };
          throw Error("chunk path empty but not in a worker");
        }(t2[0]);
        return 2 === t2.length ? r2 = t2[1] : (r2 = void 0, !function(e2, t3) {
          let r3 = 1;
          for (; r3 < e2.length; ) {
            let n3, o2 = r3 + 1;
            for (; o2 < e2.length && "function" != typeof e2[o2]; ) o2++;
            if (o2 === e2.length) throw Error("malformed chunk format, expected a factory function");
            let u2 = e2[o2];
            for (let u3 = r3; u3 < o2; u3++) {
              let r4 = e2[u3], o3 = t3.get(r4);
              if (o3) {
                n3 = o3;
                break;
              }
            }
            let l2 = n3 ?? u2, i2 = false;
            for (let n4 = r3; n4 < o2; n4++) {
              let r4 = e2[n4];
              t3.has(r4) || (i2 || (l2 === u2 && Object.defineProperty(u2, "name", { value: "module evaluation" }), i2 = true), t3.set(r4, l2));
            }
            r3 = o2 + 1;
          }
        }(t2, x)), e.registerChunk(n2, r2);
      }
      function B(e2, t2, r2 = false) {
        let n2;
        try {
          n2 = t2();
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return !r2 || n2.__esModule ? n2 : b(n2, y(n2), true);
      }
      l.y = async function(e2) {
        let t2;
        try {
          t2 = await import(e2);
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return t2 && t2.__esModule && t2.default && "default" in t2.default ? b(t2.default, y(t2), true) : t2;
      }, B.resolve = (e2, t2) => __require.resolve(e2, t2), l.x = B, e = { registerChunk(e2, t2) {
        let r2 = function(e3) {
          if ("string" == typeof e3) return e3;
          let t3 = decodeURIComponent(e3.src.replace(/[?#].*$/, ""));
          return t3.startsWith("") ? t3.slice(0) : t3;
        }(e2);
        F.add(r2), function(e3) {
          let t3 = D.get(e3);
          if (null != t3) {
            for (let r3 of t3) r3.requiredChunks.delete(e3), 0 === r3.requiredChunks.size && X(r3.runtimeModuleIds, r3.chunkPath);
            D.delete(e3);
          }
        }(r2), null != t2 && (0 === t2.otherChunks.length ? X(t2.runtimeModuleIds, r2) : function(e3, t3, r3) {
          let n2 = /* @__PURE__ */ new Set(), o2 = { runtimeModuleIds: r3, chunkPath: e3, requiredChunks: n2 };
          for (let e4 of t3) {
            let t4 = O(e4);
            if (F.has(t4)) continue;
            n2.add(t4);
            let r4 = D.get(t4);
            null == r4 && (r4 = /* @__PURE__ */ new Set(), D.set(t4, r4)), r4.add(o2);
          }
          0 === o2.requiredChunks.size && X(o2.runtimeModuleIds, o2.chunkPath);
        }(r2, t2.otherChunks.filter((e3) => {
          var t3;
          return t3 = O(e3), N.test(t3);
        }), t2.runtimeModuleIds));
      }, loadChunkCached(e2, t2) {
        throw Error("chunk loading is not supported");
      }, async loadWebAssembly(e2, t2, r2, n2, o2) {
        let u2 = await H(r2, n2);
        return await WebAssembly.instantiate(u2, o2);
      }, loadWebAssemblyModule: async (e2, t2, r2, n2) => H(r2, n2) };
      let F = /* @__PURE__ */ new Set(), D = /* @__PURE__ */ new Map();
      function X(e2, t2) {
        for (let r2 of e2) !function(e3, t3) {
          let r3 = I[t3];
          if (r3) {
            if (r3.error) throw r3.error;
            return;
          }
          L(t3, n.Runtime, e3);
        }(t2, r2);
      }
      async function H(e2, t2) {
        let r2;
        try {
          r2 = t2();
        } catch (e3) {
        }
        if (!r2) throw Error(`dynamically loading WebAssembly is not supported in this runtime as global was not injected for chunk '${e2}'`);
        return r2;
      }
      let z = globalThis.TURBOPACK;
      globalThis.TURBOPACK = { push: W }, z.forEach(W);
    })();
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image).*))(\\\\.json)?[\\/#\\?]?$"] }];
    require_node_modules_next_dist_esm_build_templates_edge_wrapper_0a9gg_0();
    require_root_of_the_server_0x0qbhs();
    require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_0i6abj3();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "typescript": { "ignoreBuildErrors": false }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.js", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [], "qualities": [75], "unoptimized": true, "customCacheHandler": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": { "serverFunctions": true, "browserToTerminal": "warn" }, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "C:\\Users\\hiwa\\Desktop\\legend", "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "appNewScrollHandler": false, "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "cachedNavigations": false, "partialFallbacks": false, "dynamicOnHover": false, "varyParams": false, "prefetchInlining": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 7, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "imgOptSkipMetadata": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "strictRouteTypes": false, "viewTransition": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": true, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "gestureTransition": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": "warn", "lockDistDir": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": false, "turbopackInferModuleSideEffects": true, "turbopackPluginRuntimeStrategy": "childProcesses", "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.js", "turbopack": { "root": "C:\\Users\\hiwa\\Desktop\\legend" }, "distDirRoot": ".next" };
var BuildId = "wJsBIE6DCy1p2nOwGTu1Z";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/api/admin/backfill-slugs", "regex": "^/api/admin/backfill\\-slugs(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/backfill\\-slugs(?:/)?$" }, { "page": "/api/admin/branding", "regex": "^/api/admin/branding(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/branding(?:/)?$" }, { "page": "/api/admin/categories", "regex": "^/api/admin/categories(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/categories(?:/)?$" }, { "page": "/api/admin/categories/reorder", "regex": "^/api/admin/categories/reorder(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/categories/reorder(?:/)?$" }, { "page": "/api/admin/check-session", "regex": "^/api/admin/check\\-session(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/check\\-session(?:/)?$" }, { "page": "/api/admin/feedback", "regex": "^/api/admin/feedback(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/feedback(?:/)?$" }, { "page": "/api/admin/items", "regex": "^/api/admin/items(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/items(?:/)?$" }, { "page": "/api/admin/items/reorder", "regex": "^/api/admin/items/reorder(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/items/reorder(?:/)?$" }, { "page": "/api/admin/login", "regex": "^/api/admin/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/login(?:/)?$" }, { "page": "/api/admin/logout", "regex": "^/api/admin/logout(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/logout(?:/)?$" }, { "page": "/api/admin/menu", "regex": "^/api/admin/menu(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/menu(?:/)?$" }, { "page": "/api/admin/sections", "regex": "^/api/admin/sections(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/sections(?:/)?$" }, { "page": "/api/admin/sections/reorder", "regex": "^/api/admin/sections/reorder(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/sections/reorder(?:/)?$" }, { "page": "/api/admin/settings", "regex": "^/api/admin/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/settings(?:/)?$" }, { "page": "/api/admin/theme", "regex": "^/api/admin/theme(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/theme(?:/)?$" }, { "page": "/api/admin/ui-settings", "regex": "^/api/admin/ui\\-settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/ui\\-settings(?:/)?$" }, { "page": "/api/debug/db-check", "regex": "^/api/debug/db\\-check(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/debug/db\\-check(?:/)?$" }, { "page": "/api/feedback", "regex": "^/api/feedback(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/feedback(?:/)?$" }, { "page": "/api/media/upload", "regex": "^/api/media/upload(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/media/upload(?:/)?$" }, { "page": "/api/menu", "regex": "^/api/menu(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/menu(?:/)?$" }, { "page": "/api/platform-settings", "regex": "^/api/platform\\-settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/platform\\-settings(?:/)?$" }, { "page": "/api/r2/presign", "regex": "^/api/r2/presign(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/r2/presign(?:/)?$" }, { "page": "/api/r2/upload", "regex": "^/api/r2/upload(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/r2/upload(?:/)?$" }, { "page": "/api/r2/verify", "regex": "^/api/r2/verify(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/r2/verify(?:/)?$" }, { "page": "/api/restaurant", "regex": "^/api/restaurant(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/restaurant(?:/)?$" }, { "page": "/api/restaurants/slugs", "regex": "^/api/restaurants/slugs(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/restaurants/slugs(?:/)?$" }, { "page": "/api/super-admin/admins", "regex": "^/api/super\\-admin/admins(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/super\\-admin/admins(?:/)?$" }, { "page": "/api/super-admin/check-session", "regex": "^/api/super\\-admin/check\\-session(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/super\\-admin/check\\-session(?:/)?$" }, { "page": "/api/super-admin/login", "regex": "^/api/super\\-admin/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/super\\-admin/login(?:/)?$" }, { "page": "/api/super-admin/logout", "regex": "^/api/super\\-admin/logout(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/super\\-admin/logout(?:/)?$" }, { "page": "/api/super-admin/platform-settings", "regex": "^/api/super\\-admin/platform\\-settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/super\\-admin/platform\\-settings(?:/)?$" }, { "page": "/api/super-admin/restaurants", "regex": "^/api/super\\-admin/restaurants(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/super\\-admin/restaurants(?:/)?$" }, { "page": "/api/theme", "regex": "^/api/theme(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/theme(?:/)?$" }, { "page": "/api/ui-settings", "regex": "^/api/ui\\-settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/ui\\-settings(?:/)?$" }, { "page": "/data/menu", "regex": "^/data/menu(?:/)?$", "routeKeys": {}, "namedRegex": "^/data/menu(?:/)?$" }, { "page": "/data/restaurant", "regex": "^/data/restaurant(?:/)?$", "routeKeys": {}, "namedRegex": "^/data/restaurant(?:/)?$" }, { "page": "/data/theme", "regex": "^/data/theme(?:/)?$", "routeKeys": {}, "namedRegex": "^/data/theme(?:/)?$" }, { "page": "/super-admin", "regex": "^/super\\-admin(?:/)?$", "routeKeys": {}, "namedRegex": "^/super\\-admin(?:/)?$" }, { "page": "/super-admin/login", "regex": "^/super\\-admin/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/super\\-admin/login(?:/)?$" }], "dynamic": [{ "page": "/api/admin/categories/[id]", "regex": "^/api/admin/categories/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/categories/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/items/[id]", "regex": "^/api/admin/items/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/items/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/sections/[id]", "regex": "^/api/admin/sections/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/sections/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/media/[id]", "regex": "^/api/media/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/media/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/restaurant/[slug]", "regex": "^/api/restaurant/([^/]+?)(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/api/restaurant/(?<nxtPslug>[^/]+?)(?:/)?$" }, { "page": "/api/super-admin/restaurants/[slug]", "regex": "^/api/super\\-admin/restaurants/([^/]+?)(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/api/super\\-admin/restaurants/(?<nxtPslug>[^/]+?)(?:/)?$" }, { "page": "/api/[slug]/admin/bootstrap", "regex": "^/api/([^/]+?)/admin/bootstrap(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/api/(?<nxtPslug>[^/]+?)/admin/bootstrap(?:/)?$" }, { "page": "/api/[slug]/admin/theme", "regex": "^/api/([^/]+?)/admin/theme(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/api/(?<nxtPslug>[^/]+?)/admin/theme(?:/)?$" }, { "page": "/api/[slug]/public/menu-bootstrap", "regex": "^/api/([^/]+?)/public/menu\\-bootstrap(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/api/(?<nxtPslug>[^/]+?)/public/menu\\-bootstrap(?:/)?$" }, { "page": "/api/[slug]/public/menu-items", "regex": "^/api/([^/]+?)/public/menu\\-items(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/api/(?<nxtPslug>[^/]+?)/public/menu\\-items(?:/)?$" }, { "page": "/assets/[id]", "regex": "^/assets/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/assets/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/welcome/[slug]", "regex": "^/welcome/([^/]+?)(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/welcome/(?<nxtPslug>[^/]+?)(?:/)?$" }, { "page": "/[slug]", "regex": "^/([^/]+?)(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPslug>[^/]+?)(?:/)?$" }, { "page": "/[slug]/admin-portal", "regex": "^/([^/]+?)/admin\\-portal(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPslug>[^/]+?)/admin\\-portal(?:/)?$" }, { "page": "/[slug]/admin-portal/branding", "regex": "^/([^/]+?)/admin\\-portal/branding(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPslug>[^/]+?)/admin\\-portal/branding(?:/)?$" }, { "page": "/[slug]/admin-portal/feedback", "regex": "^/([^/]+?)/admin\\-portal/feedback(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPslug>[^/]+?)/admin\\-portal/feedback(?:/)?$" }, { "page": "/[slug]/admin-portal/login", "regex": "^/([^/]+?)/admin\\-portal/login(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPslug>[^/]+?)/admin\\-portal/login(?:/)?$" }, { "page": "/[slug]/admin-portal/menu-builder", "regex": "^/([^/]+?)/admin\\-portal/menu\\-builder(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPslug>[^/]+?)/admin\\-portal/menu\\-builder(?:/)?$" }, { "page": "/[slug]/admin-portal/settings", "regex": "^/([^/]+?)/admin\\-portal/settings(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPslug>[^/]+?)/admin\\-portal/settings(?:/)?$" }, { "page": "/[slug]/admin-portal/theme", "regex": "^/([^/]+?)/admin\\-portal/theme(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPslug>[^/]+?)/admin\\-portal/theme(?:/)?$" }, { "page": "/[slug]/admin-portal/typography", "regex": "^/([^/]+?)/admin\\-portal/typography(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPslug>[^/]+?)/admin\\-portal/typography(?:/)?$" }, { "page": "/[slug]/feedback", "regex": "^/([^/]+?)/feedback(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPslug>[^/]+?)/feedback(?:/)?$" }, { "page": "/[slug]/menu", "regex": "^/([^/]+?)/menu(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPslug>[^/]+?)/menu(?:/)?$" }, { "page": "/[slug]/super-admin", "regex": "^/([^/]+?)/super\\-admin(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPslug>[^/]+?)/super\\-admin(?:/)?$" }, { "page": "/[slug]/super-admin/login", "regex": "^/([^/]+?)/super\\-admin/login(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/(?<nxtPslug>[^/]+?)/super\\-admin/login(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/", "dataRoute": "/index.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_global-error": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_not-found": { "initialStatus": 404, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_not-found", "dataRoute": "/_not-found.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/super-admin": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/super-admin", "dataRoute": "/super-admin.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/super-admin/login": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/super-admin/login", "dataRoute": "/super-admin/login.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "e6e59624e6772b576ba46f7bf386051e", "previewModeSigningKey": "36a9d05330f093df1eb7fa4ff0a19663dc52f73fc1c6c905687784de4e7246fb", "previewModeEncryptionKey": "1d01b5f20475297cb5582a7141f873f818c5b92849f46012be40c41fbdaa2ea1" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0a9gg_0.js", "server/edge/chunks/[root-of-the-server]__0x0qbhs._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0i6abj3.js"], "name": "middleware", "page": "/", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0i6abj3.js", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image).*))(\\\\.json)?[\\/#\\?]?$", "originalSource": "/((?!_next/static|_next/image).*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "wJsBIE6DCy1p2nOwGTu1Z", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "MbQcldIwmJS10g4wm99ROkre6Xw4mQVGzNO/PQyrzB4=", "__NEXT_PREVIEW_MODE_ID": "e6e59624e6772b576ba46f7bf386051e", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "1d01b5f20475297cb5582a7141f873f818c5b92849f46012be40c41fbdaa2ea1", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "36a9d05330f093df1eb7fa4ff0a19663dc52f73fc1c6c905687784de4e7246fb" } } }, "sortedMiddleware": ["/"], "functions": {} };
var AppPathRoutesManifest = { "/[slug]/admin-portal/branding/page": "/[slug]/admin-portal/branding", "/[slug]/admin-portal/feedback/page": "/[slug]/admin-portal/feedback", "/[slug]/admin-portal/login/page": "/[slug]/admin-portal/login", "/[slug]/admin-portal/menu-builder/page": "/[slug]/admin-portal/menu-builder", "/[slug]/admin-portal/page": "/[slug]/admin-portal", "/[slug]/admin-portal/settings/page": "/[slug]/admin-portal/settings", "/[slug]/admin-portal/theme/page": "/[slug]/admin-portal/theme", "/[slug]/admin-portal/typography/page": "/[slug]/admin-portal/typography", "/[slug]/feedback/page": "/[slug]/feedback", "/[slug]/menu/page": "/[slug]/menu", "/[slug]/page": "/[slug]", "/[slug]/super-admin/login/page": "/[slug]/super-admin/login", "/[slug]/super-admin/page": "/[slug]/super-admin", "/_global-error/page": "/_global-error", "/_not-found/page": "/_not-found", "/api/[slug]/admin/bootstrap/route": "/api/[slug]/admin/bootstrap", "/api/[slug]/admin/theme/route": "/api/[slug]/admin/theme", "/api/[slug]/public/menu-bootstrap/route": "/api/[slug]/public/menu-bootstrap", "/api/[slug]/public/menu-items/route": "/api/[slug]/public/menu-items", "/api/admin/backfill-slugs/route": "/api/admin/backfill-slugs", "/api/admin/branding/route": "/api/admin/branding", "/api/admin/categories/[id]/route": "/api/admin/categories/[id]", "/api/admin/categories/reorder/route": "/api/admin/categories/reorder", "/api/admin/categories/route": "/api/admin/categories", "/api/admin/check-session/route": "/api/admin/check-session", "/api/admin/feedback/route": "/api/admin/feedback", "/api/admin/items/[id]/route": "/api/admin/items/[id]", "/api/admin/items/reorder/route": "/api/admin/items/reorder", "/api/admin/items/route": "/api/admin/items", "/api/admin/login/route": "/api/admin/login", "/api/admin/logout/route": "/api/admin/logout", "/api/admin/menu/route": "/api/admin/menu", "/api/admin/sections/[id]/route": "/api/admin/sections/[id]", "/api/admin/sections/reorder/route": "/api/admin/sections/reorder", "/api/admin/sections/route": "/api/admin/sections", "/api/admin/settings/route": "/api/admin/settings", "/api/admin/theme/route": "/api/admin/theme", "/api/admin/ui-settings/route": "/api/admin/ui-settings", "/api/debug/db-check/route": "/api/debug/db-check", "/api/feedback/route": "/api/feedback", "/api/media/[id]/route": "/api/media/[id]", "/api/media/upload/route": "/api/media/upload", "/api/menu/route": "/api/menu", "/api/platform-settings/route": "/api/platform-settings", "/api/r2/presign/route": "/api/r2/presign", "/api/r2/upload/route": "/api/r2/upload", "/api/r2/verify/route": "/api/r2/verify", "/api/restaurant/[slug]/route": "/api/restaurant/[slug]", "/api/restaurant/route": "/api/restaurant", "/api/restaurants/slugs/route": "/api/restaurants/slugs", "/api/super-admin/admins/route": "/api/super-admin/admins", "/api/super-admin/check-session/route": "/api/super-admin/check-session", "/api/super-admin/login/route": "/api/super-admin/login", "/api/super-admin/logout/route": "/api/super-admin/logout", "/api/super-admin/platform-settings/route": "/api/super-admin/platform-settings", "/api/super-admin/restaurants/[slug]/route": "/api/super-admin/restaurants/[slug]", "/api/super-admin/restaurants/route": "/api/super-admin/restaurants", "/api/theme/route": "/api/theme", "/api/ui-settings/route": "/api/ui-settings", "/assets/[id]/route": "/assets/[id]", "/data/menu/route": "/data/menu", "/data/restaurant/route": "/data/restaurant", "/data/theme/route": "/data/theme", "/page": "/", "/super-admin/login/page": "/super-admin/login", "/super-admin/page": "/super-admin", "/welcome/[slug]/page": "/welcome/[slug]" };
var FunctionsConfigManifest = { "version": 1, "functions": {} };
var PagesManifest = { "/404": "pages/404.html", "/500": "pages/500.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: constructNextUrl(internalEvent.url, `/${detectedLocale}`)
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream3({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location2, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location2)) {
    return location2;
  }
  const locationURL = new URL(location2);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  if (finalRevalidate !== CACHE_ONE_YEAR) {
    const sMaxAge = Math.max(finalRevalidate - age, 1);
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate
    });
    const isStale = sMaxAge === 1;
    if (isStale) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {});
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = Boolean(event.headers.rsc);
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath ?? "/") || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const tags = getTagsFromValue(cachedData.value);
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
