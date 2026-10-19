/* 日记本 v1.0.1 — 构建于 20261019035553（由 tools/build-app.mjs 自动生成，请勿手工修改） */
(function () {
'use strict';
var __defs = {};
var __cache = {};
function __m(id) {
  if (__cache[id]) return __cache[id];
  var def = __defs[id];
  if (!def) throw new Error("模块未打包: " + id);
  var mod = {};
  __cache[id] = mod;
  var returned = def.fn(mod);
  if (returned) { for (var k in returned) mod[k] = returned[k]; }
  def.exports.forEach(function (pair) { if (mod[pair[0]] === undefined) mod[pair[0]] = returned && returned[pair[0]]; });
  return mod;
}
/* ================= js/core/utils.js ================= */
__defs["js/core/utils.js"] = { exports: ["$","$$","el","clear","escapeHtml","uid","sleep","debounce","throttle","clamp","round","sum","avg","range","WEEK_CN","LUNAR_MONTH_CN","LUNAR_DAY_CN","toKey","fromKey","todayKey","addDays","addMonths","daysInMonth","monthMatrix","formatCN","relativeCN","timeCN","lunarCN","solarTermCN","festivalCN","memStore","local","bytesToB64","b64ToBytes","bytesToText","textToBytes","toast","confirmDialog","downloadBlob","isMobile","isStandalone","isIOS","countWords","htmlToText","pickFiles","downloadText","safeFileName"], fn: function (module) {

/* ==========================================================================
 * 日记本 App —— 核心工具库
 * 纯浏览器端，无任何外部依赖，可离线运行。
 * ========================================================================== */

/* ----------------------------- DOM 小工具 ------------------------------ */

const $_core_utils = (sel, root = document) => root.querySelector(sel);
const $$_core_utils = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** 创建元素：el('div', {class:'a', text:'x', onclick:fn}, [child, ...]) */
function el_core_utils(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k === 'dataset' && typeof v === 'object') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : String(v));
  }
  const list = Array.isArray(children) ? children : [children];
  for (const c of list) {
    if (c === null || c === undefined || c === false) continue;
    node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  return node;
}

function clear_core_utils(node) {
  while (node && node.firstChild) node.removeChild(node.firstChild);
  return node;
}

function escapeHtml_core_utils(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ------------------------------- 基础值 -------------------------------- */

function uid_core_utils(prefix = 'id') {
  const rnd = (globalThis.crypto?.getRandomValues
    ? Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => b.toString(16).padStart(2, '0')).join('')
    : Math.random().toString(16).slice(2).padEnd(16, '0').slice(0, 16));
  return `${prefix}_${Date.now().toString(36)}_${rnd}`;
}

const sleep_core_utils = (ms) => new Promise((r) => setTimeout(r, ms));

function debounce_core_utils(fn, ms = 300) {
  let t = null;
  const wrapped = (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
  wrapped.cancel = () => clearTimeout(t);
  wrapped.flush = (...args) => {
    clearTimeout(t);
    fn(...args);
  };
  return wrapped;
}

function throttle_core_utils(fn, ms = 100) {
  let last = 0;
  let timer = null;
  let lastArgs = null;
  return (...args) => {
    lastArgs = args;
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        last = Date.now();
        fn(...lastArgs);
      }, ms - (now - last));
    }
  };
}

const clamp_core_utils = (v, min, max) => Math.min(max, Math.max(min, v));
const round_core_utils = (v, n = 0) => Math.round(v * 10 ** n) / 10 ** n;
const sum_core_utils = (arr) => arr.reduce((a, b) => a + b, 0);
const avg_core_utils = (arr) => (arr.length ? sum_core_utils(arr) / arr.length : 0);
const range_core_utils = (n) => Array.from({ length: n }, (_, i) => i);

/* ------------------------------- 日期 ---------------------------------- */

const WEEK_CN_core_utils = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const LUNAR_MONTH_CN_core_utils = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
const LUNAR_DAY_CN_core_utils = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

/** Date 或 'YYYY-MM-DD' → 'YYYY-MM-DD'（本地时区，不经过 UTC 偏移） */
function toKey_core_utils(date = new Date()) {
  if (typeof date === 'string') {
    const m = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  }
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fromKey_core_utils(key) {
  const [y, m, d] = String(key).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

const todayKey_core_utils = () => toKey_core_utils(new Date());

function addDays_core_utils(date, n) {
  const d = date instanceof Date ? new Date(date) : fromKey_core_utils(date);
  d.setDate(d.getDate() + n);
  return d;
}

function addMonths_core_utils(date, n) {
  const d = date instanceof Date ? new Date(date) : fromKey_core_utils(date);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  d.setDate(Math.min(day, daysInMonth_core_utils(d)));
  return d;
}

function daysInMonth_core_utils(date) {
  const d = date instanceof Date ? date : fromKey_core_utils(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function monthMatrix_core_utils(year, month /* 1-12 */, weekStart = 0) {
  const first = new Date(year, month - 1, 1);
  const lead = (first.getDay() - weekStart + 7) % 7;
  const total = daysInMonth_core_utils(first);
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(year, month - 1, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function formatCN_core_utils(key, style = 'full') {
  const d = typeof key === 'string' ? fromKey_core_utils(key) : key;
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const w = WEEK_CN_core_utils[d.getDay()];
  if (style === 'short') return `${m}月${day}日`;
  if (style === 'week') return w;
  if (style === 'ym') return `${y}年${m}月`;
  return `${y}年${m}月${day}日 ${w}`;
}

function relativeCN_core_utils(key) {
  const t = todayKey_core_utils();
  const diff = Math.round((fromKey_core_utils(t) - fromKey_core_utils(key)) / 86400000);
  if (diff === 0) return '今天';
  if (diff === 1) return '昨天';
  if (diff === 2) return '前天';
  if (diff === -1) return '明天';
  if (diff > 0 && diff < 7) return `${diff} 天前`;
  if (diff < 0 && diff > -7) return `${-diff} 天后`;
  return '';
}

function timeCN_core_utils(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** 极简农历（1900-2100 常用节气/农历换算，够日记本展示用） */
const LUNAR_INFO_core_utils = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6,
  0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50,
  0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60,
  0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2,
  0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5,
  0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0,
  0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58,
  0x05ac0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0,
  0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3,
  0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0,
  0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63,
];

function lunarCN_core_utils(date) {
  const d = typeof date === 'string' ? fromKey_core_utils(date) : new Date(date);
  let offset = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(1900, 0, 31)) / 86400000);
  if (offset < 0 || offset > 40000) return '';
  let year = 1900;
  while (year < 2101) {
    const days = lunarYearDays_core_utils(year);
    if (offset < days) break;
    offset -= days;
    year++;
  }
  const leap = leapMonth_core_utils(year);
  let isLeap = false;
  let month = 1;
  while (month <= 12) {
    let days;
    if (leap > 0 && month === leap + 1 && !isLeap) {
      isLeap = true;
      days = leapDays_core_utils(year);
    } else {
      days = lunarMonthDays_core_utils(year, month);
    }
    if (isLeap && month === leap + 1) isLeap = true;
    if (offset < days) break;
    offset -= days;
    if (isLeap && month === leap + 1) isLeap = false;
    month++;
  }
  const dayName = LUNAR_DAY_CN_core_utils[offset] || '';
  const monthName = (isLeap ? '闰' : '') + (LUNAR_MONTH_CN_core_utils[month - 1] || '');
  if (offset === 0) return monthName + '初一';
  return dayName === '初一' ? monthName : dayName;
}

function leapMonth_core_utils(y) { return LUNAR_INFO_core_utils[y - 1900] & 0xf; }
function leapDays_core_utils(y) { return leapMonth_core_utils(y) ? ((LUNAR_INFO_core_utils[y - 1900] & 0x10000) ? 30 : 29) : 0; }
function lunarMonthDays_core_utils(y, m) { return (LUNAR_INFO_core_utils[y - 1900] & (0x10000 >> m)) ? 30 : 29; }
function lunarYearDays_core_utils(y) {
  let s = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) s += (LUNAR_INFO_core_utils[y - 1900] & i) ? 1 : 0;
  return s + leapDays_core_utils(y);
}

/** 二十四节气（近似算法，误差 ±1 天，日记展示足够） */
const SOLAR_TERMS_core_utils = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];

function solarTermCN_core_utils(date) {
  const d = typeof date === 'string' ? fromKey_core_utils(date) : new Date(date);
  const y = d.getFullYear();
  const base = [6.11, 20.84, 4.6295, 19.4599, 6.3826, 21.4155, 5.59, 20.888, 6.318, 21.86, 6.5, 22.2,
    7.928, 23.65, 8.35, 23.95, 8.44, 23.822, 9.098, 24.218, 8.218, 23.08, 7.9, 22.6];
  const century = y >= 2000 ? 0 : 1;
  for (let i = 0; i < 24; i++) {
    const minute = i % 2 === 0 ? 0 : 30; // 奇数项在 30 分
    const day = Math.floor(base[i] + 0.2422 * (y % 100) - Math.floor((y % 100) / 4) + (century === 0 ? 0 : 1)) - (minute ? 0 : 0);
    const targetMonth = Math.floor(i / 2) + 1;
    if (d.getMonth() + 1 === targetMonth && d.getDate() === day) return SOLAR_TERMS_core_utils[i];
  }
  return '';
}

/** 节日（公历 + 农历常见） */
function festivalCN_core_utils(date) {
  const d = typeof date === 'string' ? fromKey_core_utils(date) : new Date(date);
  const solar = {
    '1-1': '元旦', '2-14': '情人节', '3-8': '妇女节', '3-12': '植树节', '4-1': '愚人节',
    '5-1': '劳动节', '5-4': '青年节', '6-1': '儿童节', '7-1': '建党节', '8-1': '建军节',
    '9-10': '教师节', '10-1': '国庆节', '12-24': '平安夜', '12-25': '圣诞节',
  };
  const k = `${d.getMonth() + 1}-${d.getDate()}`;
  if (solar[k]) return solar[k];
  const lunar = lunarCN_core_utils(d);
  const map = { 正月初一: '春节', 正月十五: '元宵节', 五月初五: '端午节', 七月初七: '七夕', 八月十五: '中秋节', 九月初九: '重阳节', 腊月初八: '腊八节' };
  if (map[lunar]) return map[lunar];
  return '';
}

/* ---------------------------- 存储小工具 -------------------------------- */

/** IndexedDB 不可用（如 file:// 或隐私模式）时的兜底存储 */
const memStore_core_utils = (() => {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
})();

const local_core_utils = (() => {
  let ok = false;
  try {
    const t = '__dsh_test__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    ok = true;
  } catch { ok = false; }
  const store = ok ? window.localStorage : memStore_core_utils;
  return {
    available: ok,
    get(key, fallback = null) {
      try {
        const raw = store.getItem(key);
        return raw === null || raw === undefined ? fallback : JSON.parse(raw);
      } catch { return fallback; }
    },
    set(key, value) {
      try { store.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
    },
    del(key) {
      try { store.removeItem(key); } catch { /* ignore */ }
    },
  };
})();

/* ------------------------------- 编码 ---------------------------------- */

function bytesToB64_core_utils(bytes) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < arr.length; i += CHUNK) s += String.fromCharCode.apply(null, arr.subarray(i, i + CHUNK));
  return btoa(s);
}

function b64ToBytes_core_utils(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToText_core_utils(bytes) { return new TextDecoder().decode(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)); }
function textToBytes_core_utils(text) { return new TextEncoder().encode(text); }

/* -------------------------------- 提示 --------------------------------- */

let toastHost_core_utils = null;
function toast_core_utils(message, opts = {}) {
  const { duration = 2400, type = 'info' } = opts;
  if (!toastHost_core_utils) {
    toastHost_core_utils = el_core_utils('div', { class: 'toast-host' });
    document.body.appendChild(toastHost_core_utils);
  }
  const node = el_core_utils('div', { class: `toast toast-${type}`, text: message });
  toastHost_core_utils.appendChild(node);
  requestAnimationFrame(() => node.classList.add('show'));
  setTimeout(() => {
    node.classList.remove('show');
    setTimeout(() => node.remove(), 320);
  }, duration);
  return node;
}

function confirmDialog_core_utils(message, { title = '请确认', okText = '确定', cancelText = '取消', danger = false } = {}) {
  return new Promise((resolve) => {
    const overlay = el_core_utils('div', { class: 'modal-overlay' });
    const box = el_core_utils('div', { class: 'modal-box modal-confirm' }, [
      el_core_utils('h3', { class: 'modal-title', text: title }),
      el_core_utils('p', { class: 'modal-message', text: message }),
      el_core_utils('div', { class: 'modal-actions' }, [
        el_core_utils('button', { class: 'btn btn-ghost', text: cancelText, onclick: () => close(false) }),
        el_core_utils('button', { class: `btn ${danger ? 'btn-danger' : 'btn-primary'}`, text: okText, onclick: () => close(true) }),
      ]),
    ]);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));
    const onKey = (e) => { if (e.key === 'Escape') close(false); };
    document.addEventListener('keydown', onKey);
    function close(val) {
      document.removeEventListener('keydown', onKey);
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 240);
      resolve(val);
    }
  });
}

/* -------------------------------- 其它 --------------------------------- */

function downloadBlob_core_utils(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = el_core_utils('a', { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 4000);
}

function isMobile_core_utils() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function isStandalone_core_utils() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isIOS_core_utils() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/** 纯文本长度（中文按字计） */
function countWords_core_utils(text = '') {
  const plain = String(text).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim();
  const cjk = (plain.match(/[\u3400-\u9fff\u3040-\u30ff\uf900-\ufaff]/g) || []).length;
  const words = (plain.replace(/[\u3400-\u9fff\u3040-\u30ff\uf900-\ufaff]/g, ' ').match(/[A-Za-z0-9_'’-]+/g) || []).length;
  return cjk + words;
}

function htmlToText_core_utils(html = '') {
  const div = document.createElement('div');
  div.innerHTML = String(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n');
  return (div.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
}

function pickFiles_core_utils({ accept = '*/*', multiple = false } = {}) {
  return new Promise((resolve) => {
    const input = el_core_utils('input', { type: 'file', accept, multiple: multiple ? '' : null, style: { display: 'none' } });
    document.body.appendChild(input);
    input.addEventListener('change', () => {
      const files = Array.from(input.files || []);
      input.remove();
      resolve(files);
    }, { once: true });
    // 取消选择时也回收
    window.addEventListener('focus', () => setTimeout(() => { if (document.body.contains(input)) { input.remove(); resolve([]); } }, 800), { once: true });
    input.click();
  });
}

/** 下载文本/JSON */
function downloadText_core_utils(text, filename, mime = 'text/plain;charset=utf-8') {
  downloadBlob_core_utils(new Blob([text], { type: mime }), filename);
}

function safeFileName_core_utils(name = '', fallback = 'file') {
  const cleaned = String(name).replace(/[\\/:*?"<>|\r\n\t]/g, '_').replace(/\s+/g, ' ').trim();
  return cleaned || fallback;
}

return { "$": $_core_utils, "$$": $$_core_utils, "el": el_core_utils, "clear": clear_core_utils, "escapeHtml": escapeHtml_core_utils, "uid": uid_core_utils, "sleep": sleep_core_utils, "debounce": debounce_core_utils, "throttle": throttle_core_utils, "clamp": clamp_core_utils, "round": round_core_utils, "sum": sum_core_utils, "avg": avg_core_utils, "range": range_core_utils, "WEEK_CN": WEEK_CN_core_utils, "LUNAR_MONTH_CN": LUNAR_MONTH_CN_core_utils, "LUNAR_DAY_CN": LUNAR_DAY_CN_core_utils, "toKey": toKey_core_utils, "fromKey": fromKey_core_utils, "todayKey": todayKey_core_utils, "addDays": addDays_core_utils, "addMonths": addMonths_core_utils, "daysInMonth": daysInMonth_core_utils, "monthMatrix": monthMatrix_core_utils, "formatCN": formatCN_core_utils, "relativeCN": relativeCN_core_utils, "timeCN": timeCN_core_utils, "lunarCN": lunarCN_core_utils, "solarTermCN": solarTermCN_core_utils, "festivalCN": festivalCN_core_utils, "memStore": memStore_core_utils, "local": local_core_utils, "bytesToB64": bytesToB64_core_utils, "b64ToBytes": b64ToBytes_core_utils, "bytesToText": bytesToText_core_utils, "textToBytes": textToBytes_core_utils, "toast": toast_core_utils, "confirmDialog": confirmDialog_core_utils, "downloadBlob": downloadBlob_core_utils, "isMobile": isMobile_core_utils, "isStandalone": isStandalone_core_utils, "isIOS": isIOS_core_utils, "countWords": countWords_core_utils, "htmlToText": htmlToText_core_utils, "pickFiles": pickFiles_core_utils, "downloadText": downloadText_core_utils, "safeFileName": safeFileName_core_utils };
} };
/* ================= js/core/crypto.js ================= */
__defs["js/core/crypto.js"] = { exports: ["randomBytes","cryptoAvailable","sha256Hex","makeVerifier","verifyPassword","timingSafeEqual","encryptJSON","decryptJSON","keyFingerprint","passwordStrength","weakPasswordMessage"], fn: function (module) {
var { "bytesToB64": bytesToB64, "b64ToBytes": b64ToBytes, "textToBytes": textToBytes, "bytesToText": bytesToText } = __m("js/core/utils.js");
/* ==========================================================================
 * 日记本 App —— 加密模块
 *  · 账号密码：PBKDF2-SHA256 派生 + 随机盐（不保存明文密码）
 *  · 上锁日记：AES-GCM 256 位加密，密钥由「上锁密码」派生，仅本次会话内存持有
 * ========================================================================== */



const PBKDF2_ITER_core_crypto = 150000;
const subtle_core_crypto = globalThis.crypto?.subtle_core_crypto;

const cryptoAvailable_core_crypto = !!subtle_core_crypto;

function randomBytes_core_crypto(n = 16) {
  const b = new Uint8Array(n);
  if (globalThis.crypto?.getRandomValues) crypto.getRandomValues(b);
  else for (let i = 0; i < n; i++) b[i] = Math.floor(Math.random() * 256);
  return b;
}



/** 纯 JS SHA-256（crypto.subtle 不可用时的兜底，例如非安全上下文） */
function sha256Hex_core_crypto(text) {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const bytes = textToBytes(String(text));
  const bitLen = bytes.length * 8;
  const withPad = new Uint8Array((((bytes.length + 9) >> 6) + 1) << 6);
  withPad.set(bytes);
  withPad[bytes.length] = 0x80;
  const dv = new DataView(withPad.buffer);
  dv.setUint32(withPad.length - 4, bitLen >>> 0);
  dv.setUint32(withPad.length - 8, Math.floor(bitLen / 0x100000000));
  const w = new Uint32Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let off = 0; off < withPad.length; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
  }
  return H.map((x) => x.toString(16).padStart(8, '0')).join('');
}

/* ------------------------- 账号密码：派生与校验 ------------------------- */

async function makeVerifier_core_crypto(password, saltB64) {
  const salt = saltB64 ? b64ToBytes(saltB64) : randomBytes_core_crypto(16);
  if (subtle_core_crypto) {
    const key = await subtle_core_crypto.importKey('raw', textToBytes(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await subtle_core_crypto.deriveBits({ name: 'PBKDF2', salt, iterations: PBKDF2_ITER_core_crypto, hash: 'SHA-256' }, key, 256);
    return { salt: bytesToB64(salt), verifier: bytesToB64(new Uint8Array(bits)), algo: 'pbkdf2' };
  }
  // 兜底：加盐迭代 SHA-256（安全性弱于 PBKDF2，但保证功能可用）
  let digest = `${saltB64 || bytesToB64(salt)}::${password}`;
  for (let i = 0; i < 20000; i++) digest = sha256Hex_core_crypto(digest + i);
  return { salt: saltB64 || bytesToB64(salt), verifier: digest, algo: 'sha256-iter' };
}

async function verifyPassword_core_crypto(password, record) {
  if (!record) return false;
  const { verifier } = await makeVerifier_core_crypto(password, record.salt);
  return timingSafeEqual_core_crypto(verifier, record.verifier);
}

function timingSafeEqual_core_crypto(a = '', b = '') {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* --------------------------- 上锁日记：AES-GCM -------------------------- */

const ITER_LOCK_core_crypto = 120000;

async function deriveAesKey_core_crypto(password, saltBytes) {
  if (subtle_core_crypto) {
    const base = await subtle_core_crypto.importKey('raw', textToBytes(password), 'PBKDF2', false, ['deriveKey']);
    return subtle_core_crypto.deriveKey(
      { name: 'PBKDF2', salt: saltBytes, iterations: ITER_LOCK_core_crypto, hash: 'SHA-256' },
      base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'],
    );
  }
  throw new Error('当前环境不支持加密（需要 HTTPS 或 localhost 打开）');
}

/** 加密任意可 JSON 序列化的数据 → { v, salt, iv, data } */
async function encryptJSON_core_crypto(obj, password) {
  const salt = randomBytes_core_crypto(16);
  const iv = randomBytes_core_crypto(12);
  const key = await deriveAesKey_core_crypto(password, salt);
  const plain = textToBytes(JSON.stringify(obj));
  const cipher = await subtle_core_crypto.encrypt({ name: 'AES-GCM', iv }, key, plain);
  return { v: 1, algo: 'AES-GCM', salt: bytesToB64(salt), iv: bytesToB64(iv), data: bytesToB64(new Uint8Array(cipher)) };
}

async function decryptJSON_core_crypto(payload, password) {
  if (!payload || !payload.data) throw new Error('密文为空');
  const salt = b64ToBytes(payload.salt);
  const iv = b64ToBytes(payload.iv);
  const key = await deriveAesKey_core_crypto(password, salt);
  const plain = await subtle_core_crypto.decrypt({ name: 'AES-GCM', iv }, key, b64ToBytes(payload.data));
  return JSON.parse(bytesToText(new Uint8Array(plain)));
}

/** 记录某条上锁日记的密钥指纹，便于校验密码是否正确（不含明文信息） */
async function keyFingerprint_core_crypto(password, saltB64) {
  const salt = b64ToBytes(saltB64);
  if (subtle_core_crypto) {
    const base = await subtle_core_crypto.importKey('raw', textToBytes(`fp::${password}`), 'PBKDF2', false, ['deriveBits']);
    const bits = await subtle_core_crypto.deriveBits({ name: 'PBKDF2', salt, iterations: 1000, hash: 'SHA-256' }, base, 128);
    return bytesToB64(new Uint8Array(bits));
  }
  return sha256Hex_core_crypto(`fp::${saltB64}::${password}`).slice(0, 32);
}

/** 密码强度评估：0-4 */
function passwordStrength_core_crypto(pwd = '') {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Za-z]/.test(pwd) && /\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(4, score);
}

function weakPasswordMessage_core_crypto(pwd = '') {
  if (!pwd || pwd.length < 6) return '密码至少 6 位';
  return '';
}

return { "randomBytes": randomBytes_core_crypto, "cryptoAvailable": cryptoAvailable_core_crypto, "sha256Hex": sha256Hex_core_crypto, "makeVerifier": makeVerifier_core_crypto, "verifyPassword": verifyPassword_core_crypto, "timingSafeEqual": timingSafeEqual_core_crypto, "encryptJSON": encryptJSON_core_crypto, "decryptJSON": decryptJSON_core_crypto, "keyFingerprint": keyFingerprint_core_crypto, "passwordStrength": passwordStrength_core_crypto, "weakPasswordMessage": weakPasswordMessage_core_crypto };
} };
/* ================= js/core/font-subset.js ================= */
__defs["js/core/font-subset.js"] = { exports: ["TrueTypeFont","buildCmap","concat","assembleTtf","COMMON_HANZI","COMMON_CODES"], fn: function (module) {

/* ==========================================================================
 * 日记本 · TrueType 字体解析与子集化
 *  用途：
 *   1) PDF 导出时把中文字体内嵌进文件（体积可控、不乱码）
 *   2) tools/make-pdf-font.mjs 离线给系统字体「瘦身」，产出 assets/fonts/pdf-cjk.ttf
 *  纯 JS 实现，浏览器与 Node 均可用。
 * ========================================================================== */

/** 解析 TrueType 字体（glyf 轮廓，含复合字形） */
class TrueTypeFont_core_font_subset {
  constructor(buffer) {
    this.data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    this.view = new DataView(this.data.buffer, this.data.byteOffset, this.data.byteLength);
    this.tables = {};
    const numTables = this.view.getUint16(4);
    for (let i = 0; i < numTables; i++) {
      const off = 12 + i * 16;
      const tag = String.fromCharCode(this.data[off], this.data[off + 1], this.data[off + 2], this.data[off + 3]);
      this.tables[tag] = { offset: this.view.getUint32(off + 8), length: this.view.getUint32(off + 12) };
    }
    if (!this.tables.head || !this.tables.cmap || !this.tables.glyf || !this.tables.loca) {
      throw new Error('不是可用的 TrueType 字体（缺少 head/cmap/glyf/loca）');
    }
    this.unitsPerEm = this.view.getUint16(this.tables.head.offset + 18);
    this.indexToLocFormat = this.view.getInt16(this.tables.head.offset + 50);
    this.numGlyphs = this.view.getUint16(this.tables.maxp.offset + 4);
    this.cmap = this.parseCmap();
    this.locations = null;
  }

  parseCmap() {
    const { offset } = this.tables.cmap;
    const numTables = this.view.getUint16(offset + 2);
    let best = null;
    for (let i = 0; i < numTables; i++) {
      const rec = offset + 4 + i * 8;
      const platform = this.view.getUint16(rec);
      const encoding = this.view.getUint16(rec + 2);
      const sub = offset + this.view.getUint32(rec + 4);
      if (sub >= this.data.length) continue;
      const format = this.view.getUint16(sub);
      const score = (platform === 3 && encoding === 1) || platform === 0 || (platform === 3 && encoding === 10) ? 2 : 1;
      if (format === 4 && (!best || score > best.score)) best = { sub, format, score };
      else if (format === 12 && (!best || score >= best.score)) best = { sub, format, score: score + 1 };
    }
    if (!best) throw new Error('字体缺少可用的 cmap 子表');
    return best.format === 4 ? this.parseCmap4(best.sub) : this.parseCmap12(best.sub);
  }

  parseCmap4(sub) {
    const map = new Map();
    const segCount = this.view.getUint16(sub + 6) / 2;
    const endBase = sub + 14;
    const startBase = endBase + segCount * 2 + 2;
    const deltaBase = startBase + segCount * 2;
    const rangeBase = deltaBase + segCount * 2;
    for (let s = 0; s < segCount; s++) {
      const end = this.view.getUint16(endBase + s * 2);
      const start = this.view.getUint16(startBase + s * 2);
      const delta = this.view.getInt16(deltaBase + s * 2);
      const rangeOffset = this.view.getUint16(rangeBase + s * 2);
      if (start === 0xffff) continue;
      for (let c = start; c <= end && c !== 0xffff; c++) {
        let gid;
        if (rangeOffset === 0) gid = (c + delta) & 0xffff;
        else {
          const addr = rangeBase + s * 2 + rangeOffset + (c - start) * 2;
          if (addr + 1 >= this.data.length) continue;
          gid = this.view.getUint16(addr);
          if (gid !== 0) gid = (gid + delta) & 0xffff;
        }
        if (gid) map.set(c, gid);
      }
    }
    return map;
  }

  parseCmap12(sub) {
    const map = new Map();
    const nGroups = this.view.getUint32(sub + 12);
    for (let g = 0; g < nGroups; g++) {
      const rec = sub + 16 + g * 12;
      const start = this.view.getUint32(rec);
      const end = this.view.getUint32(rec + 4);
      const startGid = this.view.getUint32(rec + 8);
      if (end - start > 0x10000) continue;
      for (let c = start; c <= end; c++) map.set(c, startGid + (c - start));
    }
    return map;
  }

  glyphId(code) { return this.cmap.get(code) || 0; }

  loadLocations() {
    if (this.locations) return this.locations;
    const { offset } = this.tables.loca;
    const count = this.numGlyphs + 1;
    const locs = new Uint32Array(count);
    for (let i = 0; i < count; i++) {
      locs[i] = this.indexToLocFormat === 0 ? this.view.getUint16(offset + i * 2) * 2 : this.view.getUint32(offset + i * 4);
    }
    this.locations = locs;
    return locs;
  }

  glyphData(gid) {
    const locs = this.loadLocations();
    const start = this.tables.glyf.offset + locs[gid];
    const end = this.tables.glyf.offset + locs[gid + 1];
    return this.data.subarray(start, end);
  }

  glyphWidth(gid) {
    if (!this.tables.hmtx) return 1000;
    const numberOfHMetrics = this.view.getUint16(this.tables.hmtx.offset);
    const idx = Math.min(gid, Math.max(0, numberOfHMetrics - 1));
    const adv = this.view.getUint16(this.tables.hmtx.offset + 4 + idx * 4);
    return (adv / this.unitsPerEm) * 1000;
  }

  /** 收集字形（含复合字形依赖），返回升序原字形 id 列表 */
  collectGlyphs(gids) {
    const set = new Set([0]);
    const queue = [...gids];
    while (queue.length) {
      const gid = queue.pop();
      if (gid == null || set.has(gid) || gid >= this.numGlyphs) continue;
      set.add(gid);
      const data = this.glyphData(gid);
      if (data.length < 10) continue;
      const nc = (data[0] << 8) | data[1];
      if (nc < 0) {
        let p = 10;
        while (p + 4 <= data.length) {
          const flags = (data[p] << 8) | data[p + 1];
          queue.push((data[p + 2] << 8) | data[p + 3]);
          p += 4;
          p += (flags & 0x0001) ? 4 : 2;
          if (flags & 0x0008) p += 2;
          else if (flags & 0x0040) p += 4;
          else if (flags & 0x0080) p += 8;
          if (!(flags & 0x0020)) break;
        }
      }
    }
    return [...set].sort((a, b) => a - b);
  }

  /**
   * 生成子集字体
   * @param {number[]} codes 需要保留的 Unicode 代码点
   * @returns {{ data: Uint8Array, gidToNew: Map<number,number>, numGlyphs: number }}
   */
  subset(codes) {
    const wanted = codes.map((c) => this.glyphId(c)).filter(Boolean);
    const sortedGids = this.collectGlyphs(wanted);
    const gidToNew = new Map(sortedGids.map((g, i) => [g, i]));
    const numGlyphs = sortedGids.length;

    // glyf + loca
    const chunks = [];
    const newLocs = [0];
    let glyfLength = 0;
    for (const gid of sortedGids) {
      let data = this.glyphData(gid);
      if (data.length) {
        if (data.length % 4 !== 0) {
          const padded = new Uint8Array(data.length + (4 - (data.length % 4)));
          padded.set(data);
          data = padded;
        }
        if (data.length >= 10 && ((data[0] << 8) | data[1]) < 0) data = remapComposite_core_font_subset(data, gidToNew);
      }
      chunks.push(data);
      glyfLength += data.length;
      newLocs.push(glyfLength);
    }
    const glyf = concat_core_font_subset(chunks);

    const loca = new Uint8Array((numGlyphs + 1) * 4);
    const locaView = new DataView(loca.buffer);
    newLocs.forEach((v, i) => locaView.setUint32(i * 4, v));

    // hmtx
    const numberOfHMetrics = this.tables.hmtx ? this.view.getUint16(this.tables.hmtx.offset) : 0;
    const hmtx = new Uint8Array(numGlyphs * 4);
    const hmtxView = new DataView(hmtx.buffer);
    sortedGids.forEach((g, i) => {
      const idx = Math.min(g, Math.max(0, numberOfHMetrics - 1));
      const adv = this.tables.hmtx ? this.view.getUint16(this.tables.hmtx.offset + 4 + idx * 4) : this.unitsPerEm;
      const lsb = this.tables.hmtx ? this.view.getInt16(this.tables.hmtx.offset + 4 + idx * 4 + 2) : 0;
      hmtxView.setUint16(i * 4, adv);
      hmtxView.setInt16(i * 4 + 2, lsb);
    });

    // cmap（代码点 → 新字形 id）
    const codeToNew = new Map();
    for (const [code, gid] of this.cmap) {
      const mapped = gidToNew.get(gid);
      if (mapped) codeToNew.set(code, mapped);
    }

    const tables = [];
    const copy = (tag, transform) => {
      const t = this.tables[tag];
      if (!t) return;
      let bytes = this.data.subarray(t.offset, t.offset + t.length);
      if (transform) bytes = transform(bytes);
      tables.push({ tag, bytes });
    };
    copy('head', (bytes) => {
      const out = new Uint8Array(bytes);
      const v = new DataView(out.buffer, out.byteOffset, out.byteLength);
      v.setInt32(8, 0);
      v.setInt16(50, 1);
      return out;
    });
    copy('hhea');
    copy('maxp', (bytes) => {
      const out = new Uint8Array(bytes);
      new DataView(out.buffer, out.byteOffset, out.byteLength).setUint16(4, numGlyphs);
      return out;
    });
    tables.push({ tag: 'hmtx', bytes: hmtx });
    tables.push({ tag: 'loca', bytes: loca });
    tables.push({ tag: 'glyf', bytes: glyf });
    tables.push({ tag: 'cmap', bytes: buildCmap_core_font_subset(codeToNew) });
    if (this.tables['OS/2']) copy('OS/2');
    if (this.tables.post) copy('post');
    if (this.tables.name) copy('name');

    tables.sort((a, b) => (a.tag < b.tag ? -1 : 1));
    return { data: assembleTtf_core_font_subset(tables), gidToNew, numGlyphs };
  }
}

/** 构建 cmap 表：支持 format 4（BMP 常用）与 format 12（补充平面） */
function buildCmap_core_font_subset(codeToNewGid) {
  const entries = [...codeToNewGid.entries()].filter(([, g]) => g).sort((a, b) => a[0] - b[0]);

  // ---- format 4（0x0000-0xFFFF）----
  const bmp = entries.filter(([c]) => c <= 0xffff);
  const segments = [];
  for (const [code, gid] of bmp) {
    const last = segments[segments.length - 1];
    if (last && code === last.end + 1 && gid === last.startGid + (code - last.start)) last.end = code;
    else segments.push({ start: code, end: code, start: gid, delta: (gid - code) & 0xffff, startGid: gid, useDelta: true });
  }
  // 结束段
  segments.push({ start: 0xffff, end: 0xffff, delta: 1, startGid: 0, useDelta: true });

  const segCount = segments.length;
  const segX2 = segCount * 2;
  const length = 16 + segX2 * 4 + 2 + bmp.length * 2;
  const sub4 = new Uint8Array(length);
  const v4 = new DataView(sub4.buffer);
  const searchRange = 2 * 2 ** Math.floor(Math.log2(segCount));
  v4.setUint16(0, 4);
  v4.setUint16(2, length);
  v4.setUint16(4, 0);
  v4.setUint16(6, segX2);
  v4.setUint16(8, searchRange);
  v4.setUint16(10, Math.floor(Math.log2(segCount)));
  v4.setUint16(12, segX2 - searchRange);
  let p = 14;
  for (const s of segments) { v4.setUint16(p, s.end); p += 2; }
  v4.setUint16(p, 0); p += 2;
  for (const s of segments) { v4.setUint16(p, s.start); p += 2; }
  for (const s of segments) { v4.setInt16(p, s.delta); p += 2; }
  for (const s of segments) { v4.setUint16(p, 0); p += 2; } // idRangeOffset 全 0 → 用 delta
  for (const [, gid] of bmp) { v4.setUint16(p, gid); p += 2; }

  // ---- format 12（补充平面；没有就不生成）----
  const ext = entries.filter(([c]) => c > 0xffff);
  let sub12 = null;
  if (ext.length) {
    const groups = [];
    for (const [code, gid] of ext) {
      const last = groups[groups.length - 1];
      if (last && code === last.end + 1 && gid === last.startGid + (code - last.start)) last.end = code;
      else groups.push({ start: code, end: code, startGid: gid });
    }
    const len12 = 16 + groups.length * 12;
    sub12 = new Uint8Array(len12);
    const v12 = new DataView(sub12.buffer);
    v12.setUint16(0, 12);
    v12.setUint16(2, 0);
    v12.setUint32(4, len12);
    v12.setUint32(8, 0);
    v12.setUint32(12, groups.length);
    groups.forEach((g, i) => {
      const off = 16 + i * 12;
      v12.setUint32(off, g.start);
      v12.setUint32(off + 4, g.end);
      v12.setUint32(off + 8, g.startGid);
    });
  }

  const numTables = sub12 ? 2 : 1;
  const header = new Uint8Array(4 + numTables * 8);
  const hv = new DataView(header.buffer);
  hv.setUint16(0, 0);
  hv.setUint16(2, numTables);
  let off = 4;
  hv.setUint16(off, 3); hv.setUint16(off + 2, 1); hv.setUint32(off + 4, 4 + numTables * 8);
  off += 8;
  if (sub12) {
    hv.setUint16(off, 3); hv.setUint16(off + 2, 10); hv.setUint32(off + 4, 4 + numTables * 8 + sub4.length);
  }
  return sub12 ? concat_core_font_subset([header, sub4, sub12]) : concat_core_font_subset([header, sub4]);
}

function remapComposite_core_font_subset(data, gidToNew) {
  const out = new Uint8Array(data);
  const view = new DataView(out.buffer, out.byteOffset, out.byteLength);
  let p = 10;
  while (p + 4 <= out.length) {
    const flags = view.getUint16(p);
    const compGid = view.getUint16(p + 2);
    view.setUint16(p + 2, gidToNew.get(compGid) || 0);
    p += 4;
    p += (flags & 0x0001) ? 4 : 2;
    if (flags & 0x0008) p += 2;
    else if (flags & 0x0040) p += 4;
    else if (flags & 0x0080) p += 8;
    if (!(flags & 0x0020)) {
      if (p < out.length) view.setUint16(p, 0);
      break;
    }
  }
  return out;
}

function concat_core_font_subset(arrays) {
  const total = arrays.reduce((a, b) => a + b.length, 0);
  const out = new Uint8Array(total);
  let p = 0;
  for (const a of arrays) { out.set(a, p); p += a.length; }
  return out;
}

function assembleTtf_core_font_subset(tables) {
  const numTables = tables.length;
  const searchRange = 2 ** Math.floor(Math.log2(numTables)) * 16;
  const entrySelector = Math.floor(Math.log2(numTables));
  const rangeShift = numTables * 16 - searchRange;
  let offset = 12 + numTables * 16;
  const records = [];
  const bodies = [];
  for (const t of tables) {
    const pad = (4 - (offset % 4)) % 4;
    if (pad) { bodies.push(new Uint8Array(pad)); offset += pad; }
    records.push({ tag: t.tag, offset, length: t.bytes.length });
    bodies.push(t.bytes);
    offset += t.bytes.length;
  }
  const header = new Uint8Array(12);
  const hv = new DataView(header.buffer);
  hv.setUint32(0, 0x00010000);
  hv.setUint16(4, numTables);
  hv.setUint16(6, searchRange);
  hv.setUint16(8, entrySelector);
  hv.setUint16(10, rangeShift);
  const dir = new Uint8Array(numTables * 16);
  const dv = new DataView(dir.buffer);
  records.forEach((r, i) => {
    const off = i * 16;
    for (let k = 0; k < 4; k++) dir[off + k] = r.tag.charCodeAt(k);
    dv.setUint32(off + 4, 0);
    dv.setUint32(off + 8, r.offset);
    dv.setUint32(off + 12, r.length);
  });
  return concat_core_font_subset([header, dir, ...bodies]);
}

/** 常用汉字表（3500 常用字 + 日记高频字），用于字体子集化 */
/** 常用汉字表：GB2312 全字集（6763 字，覆盖日常读写 99.9% 用字） */
const COMMON_HANZI_core_font_subset = '啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐恰洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座亍丌兀丐廿卅丕亘丞鬲孬噩丨禺丿匕乇夭爻卮氐囟胤馗毓睾鼗丶亟鼐乜乩亓芈孛啬嘏仄厍厝厣厥厮靥赝匚叵匦匮匾赜卦卣刂刈刎刭刳刿剀剌剞剡剜蒯剽劂劁劐劓冂罔亻仃仉仂仨仡仫仞伛仳伢佤仵伥伧伉伫佞佧攸佚佝佟佗伲伽佶佴侑侉侃侏佾佻侪佼侬侔俦俨俪俅俚俣俜俑俟俸倩偌俳倬倏倮倭俾倜倌倥倨偾偃偕偈偎偬偻傥傧傩傺僖儆僭僬僦僮儇儋仝氽佘佥俎龠汆籴兮巽黉馘冁夔勹匍訇匐凫夙兕亠兖亳衮袤亵脔裒禀嬴蠃羸冫冱冽冼凇冖冢冥讠讦讧讪讴讵讷诂诃诋诏诎诒诓诔诖诘诙诜诟诠诤诨诩诮诰诳诶诹诼诿谀谂谄谇谌谏谑谒谔谕谖谙谛谘谝谟谠谡谥谧谪谫谮谯谲谳谵谶卩卺阝阢阡阱阪阽阼陂陉陔陟陧陬陲陴隈隍隗隰邗邛邝邙邬邡邴邳邶邺邸邰郏郅邾郐郄郇郓郦郢郜郗郛郫郯郾鄄鄢鄞鄣鄱鄯鄹酃酆刍奂劢劬劭劾哿勐勖勰叟燮矍廴凵凼鬯厶弁畚巯坌垩垡塾墼壅壑圩圬圪圳圹圮圯坜圻坂坩垅坫垆坼坻坨坭坶坳垭垤垌垲埏垧垴垓垠埕埘埚埙埒垸埴埯埸埤埝堋堍埽埭堀堞堙塄堠塥塬墁墉墚墀馨鼙懿艹艽艿芏芊芨芄芎芑芗芙芫芸芾芰苈苊苣芘芷芮苋苌苁芩芴芡芪芟苄苎芤苡茉苷苤茏茇苜苴苒苘茌苻苓茑茚茆茔茕苠苕茜荑荛荜茈莒茼茴茱莛荞茯荏荇荃荟荀茗荠茭茺茳荦荥荨茛荩荬荪荭荮莰荸莳莴莠莪莓莜莅荼莶莩荽莸荻莘莞莨莺莼菁萁菥菘堇萘萋菝菽菖萜萸萑萆菔菟萏萃菸菹菪菅菀萦菰菡葜葑葚葙葳蒇蒈葺蒉葸萼葆葩葶蒌蒎萱葭蓁蓍蓐蓦蒽蓓蓊蒿蒺蓠蒡蒹蒴蒗蓥蓣蔌甍蔸蓰蔹蔟蔺蕖蔻蓿蓼蕙蕈蕨蕤蕞蕺瞢蕃蕲蕻薤薨薇薏蕹薮薜薅薹薷薰藓藁藜藿蘧蘅蘩蘖蘼廾弈夼奁耷奕奚奘匏尢尥尬尴扌扪抟抻拊拚拗拮挢拶挹捋捃掭揶捱捺掎掴捭掬掊捩掮掼揲揸揠揿揄揞揎摒揆掾摅摁搋搛搠搌搦搡摞撄摭撖摺撷撸撙撺擀擐擗擤擢攉攥攮弋忒甙弑卟叱叽叩叨叻吒吖吆呋呒呓呔呖呃吡呗呙吣吲咂咔呷呱呤咚咛咄呶呦咝哐咭哂咴哒咧咦哓哔呲咣哕咻咿哌哙哚哜咩咪咤哝哏哞唛哧唠哽唔哳唢唣唏唑唧唪啧喏喵啉啭啁啕唿啐唼唷啖啵啶啷唳唰啜喋嗒喃喱喹喈喁喟啾嗖喑啻嗟喽喾喔喙嗪嗷嗉嘟嗑嗫嗬嗔嗦嗝嗄嗯嗥嗲嗳嗌嗍嗨嗵嗤辔嘞嘈嘌嘁嘤嘣嗾嘀嘧嘭噘嘹噗嘬噍噢噙噜噌噔嚆噤噱噫噻噼嚅嚓嚯囔囗囝囡囵囫囹囿圄圊圉圜帏帙帔帑帱帻帼帷幄幔幛幞幡岌屺岍岐岖岈岘岙岑岚岜岵岢岽岬岫岱岣峁岷峄峒峤峋峥崂崃崧崦崮崤崞崆崛嵘崾崴崽嵬嵛嵯嵝嵫嵋嵊嵩嵴嶂嶙嶝豳嶷巅彳彷徂徇徉後徕徙徜徨徭徵徼衢彡犭犰犴犷犸狃狁狎狍狒狨狯狩狲狴狷猁狳猃狺狻猗猓猡猊猞猝猕猢猹猥猬猸猱獐獍獗獠獬獯獾舛夥飧夤夂饣饧饨饩饪饫饬饴饷饽馀馄馇馊馍馐馑馓馔馕庀庑庋庖庥庠庹庵庾庳赓廒廑廛廨廪膺忄忉忖忏怃忮怄忡忤忾怅怆忪忭忸怙怵怦怛怏怍怩怫怊怿怡恸恹恻恺恂恪恽悖悚悭悝悃悒悌悛惬悻悱惝惘惆惚悴愠愦愕愣惴愀愎愫慊慵憬憔憧憷懔懵忝隳闩闫闱闳闵闶闼闾阃阄阆阈阊阋阌阍阏阒阕阖阗阙阚丬爿戕氵汔汜汊沣沅沐沔沌汨汩汴汶沆沩泐泔沭泷泸泱泗沲泠泖泺泫泮沱泓泯泾洹洧洌浃浈洇洄洙洎洫浍洮洵洚浏浒浔洳涑浯涞涠浞涓涔浜浠浼浣渚淇淅淞渎涿淠渑淦淝淙渖涫渌涮渫湮湎湫溲湟溆湓湔渲渥湄滟溱溘滠漭滢溥溧溽溻溷滗溴滏溏滂溟潢潆潇漤漕滹漯漶潋潴漪漉漩澉澍澌潸潲潼潺濑濉澧澹澶濂濡濮濞濠濯瀚瀣瀛瀹瀵灏灞宀宄宕宓宥宸甯骞搴寤寮褰寰蹇謇辶迓迕迥迮迤迩迦迳迨逅逄逋逦逑逍逖逡逵逶逭逯遄遑遒遐遨遘遢遛暹遴遽邂邈邃邋彐彗彖彘尻咫屐屙孱屣屦羼弪弩弭艴弼鬻屮妁妃妍妩妪妣妗姊妫妞妤姒妲妯姗妾娅娆姝娈姣姘姹娌娉娲娴娑娣娓婀婧婊婕娼婢婵胬媪媛婷婺媾嫫媲嫒嫔媸嫠嫣嫱嫖嫦嫘嫜嬉嬗嬖嬲嬷孀尕尜孚孥孳孑孓孢驵驷驸驺驿驽骀骁骅骈骊骐骒骓骖骘骛骜骝骟骠骢骣骥骧纟纡纣纥纨纩纭纰纾绀绁绂绉绋绌绐绔绗绛绠绡绨绫绮绯绱绲缍绶绺绻绾缁缂缃缇缈缋缌缏缑缒缗缙缜缛缟缡缢缣缤缥缦缧缪缫缬缭缯缰缱缲缳缵幺畿巛甾邕玎玑玮玢玟珏珂珑玷玳珀珉珈珥珙顼琊珩珧珞玺珲琏琪瑛琦琥琨琰琮琬琛琚瑁瑜瑗瑕瑙瑷瑭瑾璜璎璀璁璇璋璞璨璩璐璧瓒璺韪韫韬杌杓杞杈杩枥枇杪杳枘枧杵枨枞枭枋杷杼柰栉柘栊柩枰栌柙枵柚枳柝栀柃枸柢栎柁柽栲栳桠桡桎桢桄桤梃栝桕桦桁桧桀栾桊桉栩梵梏桴桷梓桫棂楮棼椟椠棹椤棰椋椁楗棣椐楱椹楠楂楝榄楫榀榘楸椴槌榇榈槎榉楦楣楹榛榧榻榫榭槔榱槁槊槟榕槠榍槿樯槭樗樘橥槲橄樾檠橐橛樵檎橹樽樨橘橼檑檐檩檗檫猷獒殁殂殇殄殒殓殍殚殛殡殪轫轭轱轲轳轵轶轸轷轹轺轼轾辁辂辄辇辋辍辎辏辘辚軎戋戗戛戟戢戡戥戤戬臧瓯瓴瓿甏甑甓攴旮旯旰昊昙杲昃昕昀炅曷昝昴昱昶昵耆晟晔晁晏晖晡晗晷暄暌暧暝暾曛曜曦曩贲贳贶贻贽赀赅赆赈赉赇赍赕赙觇觊觋觌觎觏觐觑牮犟牝牦牯牾牿犄犋犍犏犒挈挲掰搿擘耄毪毳毽毵毹氅氇氆氍氕氘氙氚氡氩氤氪氲攵敕敫牍牒牖爰虢刖肟肜肓肼朊肽肱肫肭肴肷胧胨胩胪胛胂胄胙胍胗朐胝胫胱胴胭脍脎胲胼朕脒豚脶脞脬脘脲腈腌腓腴腙腚腱腠腩腼腽腭腧塍媵膈膂膑滕膣膪臌朦臊膻臁膦欤欷欹歃歆歙飑飒飓飕飙飚殳彀毂觳斐齑斓於旆旄旃旌旎旒旖炀炜炖炝炻烀炷炫炱烨烊焐焓焖焯焱煳煜煨煅煲煊煸煺熘熳熵熨熠燠燔燧燹爝爨灬焘煦熹戾戽扃扈扉礻祀祆祉祛祜祓祚祢祗祠祯祧祺禅禊禚禧禳忑忐怼恝恚恧恁恙恣悫愆愍慝憩憝懋懑戆肀聿沓泶淼矶矸砀砉砗砘砑斫砭砜砝砹砺砻砟砼砥砬砣砩硎硭硖硗砦硐硇硌硪碛碓碚碇碜碡碣碲碹碥磔磙磉磬磲礅磴礓礤礞礴龛黹黻黼盱眄眍盹眇眈眚眢眙眭眦眵眸睐睑睇睃睚睨睢睥睿瞍睽瞀瞌瞑瞟瞠瞰瞵瞽町畀畎畋畈畛畲畹疃罘罡罟詈罨罴罱罹羁罾盍盥蠲钅钆钇钋钊钌钍钏钐钔钗钕钚钛钜钣钤钫钪钭钬钯钰钲钴钶钷钸钹钺钼钽钿铄铈铉铊铋铌铍铎铐铑铒铕铖铗铙铘铛铞铟铠铢铤铥铧铨铪铩铫铮铯铳铴铵铷铹铼铽铿锃锂锆锇锉锊锍锎锏锒锓锔锕锖锘锛锝锞锟锢锪锫锩锬锱锲锴锶锷锸锼锾锿镂锵镄镅镆镉镌镎镏镒镓镔镖镗镘镙镛镞镟镝镡镢镤镥镦镧镨镩镪镫镬镯镱镲镳锺矧矬雉秕秭秣秫稆嵇稃稂稞稔稹稷穑黏馥穰皈皎皓皙皤瓞瓠甬鸠鸢鸨鸩鸪鸫鸬鸲鸱鸶鸸鸷鸹鸺鸾鹁鹂鹄鹆鹇鹈鹉鹋鹌鹎鹑鹕鹗鹚鹛鹜鹞鹣鹦鹧鹨鹩鹪鹫鹬鹱鹭鹳疒疔疖疠疝疬疣疳疴疸痄疱疰痃痂痖痍痣痨痦痤痫痧瘃痱痼痿瘐瘀瘅瘌瘗瘊瘥瘘瘕瘙瘛瘼瘢瘠癀瘭瘰瘿瘵癃瘾瘳癍癞癔癜癖癫癯翊竦穸穹窀窆窈窕窦窠窬窨窭窳衤衩衲衽衿袂袢裆袷袼裉裢裎裣裥裱褚裼裨裾裰褡褙褓褛褊褴褫褶襁襦襻疋胥皲皴矜耒耔耖耜耠耢耥耦耧耩耨耱耋耵聃聆聍聒聩聱覃顸颀颃颉颌颍颏颔颚颛颞颟颡颢颥颦虍虔虬虮虿虺虼虻蚨蚍蚋蚬蚝蚧蚣蚪蚓蚩蚶蛄蚵蛎蚰蚺蚱蚯蛉蛏蚴蛩蛱蛲蛭蛳蛐蜓蛞蛴蛟蛘蛑蜃蜇蛸蜈蜊蜍蜉蜣蜻蜞蜥蜮蜚蜾蝈蜴蜱蜩蜷蜿螂蜢蝽蝾蝻蝠蝰蝌蝮螋蝓蝣蝼蝤蝙蝥螓螯螨蟒蟆螈螅螭螗螃螫蟥螬螵螳蟋蟓螽蟑蟀蟊蟛蟪蟠蟮蠖蠓蟾蠊蠛蠡蠹蠼缶罂罄罅舐竺竽笈笃笄笕笊笫笏筇笸笪笙笮笱笠笥笤笳笾笞筘筚筅筵筌筝筠筮筻筢筲筱箐箦箧箸箬箝箨箅箪箜箢箫箴篑篁篌篝篚篥篦篪簌篾篼簏簖簋簟簪簦簸籁籀臾舁舂舄臬衄舡舢舣舭舯舨舫舸舻舳舴舾艄艉艋艏艚艟艨衾袅袈裘裟襞羝羟羧羯羰羲籼敉粑粝粜粞粢粲粼粽糁糇糌糍糈糅糗糨艮暨羿翎翕翥翡翦翩翮翳糸絷綦綮繇纛麸麴赳趄趔趑趱赧赭豇豉酊酐酎酏酤酢酡酰酩酯酽酾酲酴酹醌醅醐醍醑醢醣醪醭醮醯醵醴醺豕鹾趸跫踅蹙蹩趵趿趼趺跄跖跗跚跞跎跏跛跆跬跷跸跣跹跻跤踉跽踔踝踟踬踮踣踯踺蹀踹踵踽踱蹉蹁蹂蹑蹒蹊蹰蹶蹼蹯蹴躅躏躔躐躜躞豸貂貊貅貘貔斛觖觞觚觜觥觫觯訾謦靓雩雳雯霆霁霈霏霎霪霭霰霾龀龃龅龆龇龈龉龊龌黾鼋鼍隹隼隽雎雒瞿雠銎銮鋈錾鍪鏊鎏鐾鑫鱿鲂鲅鲆鲇鲈稣鲋鲎鲐鲑鲒鲔鲕鲚鲛鲞鲟鲠鲡鲢鲣鲥鲦鲧鲨鲩鲫鲭鲮鲰鲱鲲鲳鲴鲵鲶鲷鲺鲻鲼鲽鳄鳅鳆鳇鳊鳋鳌鳍鳎鳏鳐鳓鳔鳕鳗鳘鳙鳜鳝鳟鳢靼鞅鞑鞒鞔鞯鞫鞣鞲鞴骱骰骷鹘骶骺骼髁髀髅髂髋髌髑魅魃魇魉魈魍魑飨餍餮饕饔髟髡髦髯髫髻髭髹鬈鬏鬓鬟鬣麽麾縻麂麇麈麋麒鏖麝麟黛黜黝黠黟黢黩黧黥黪黯鼢鼬鼯鼹鼷鼽鼾齄';

/** 常用字表：ASCII + 中英标点 + 常用汉字（覆盖日常书写 99% 以上用字） */
const COMMON_CODES_core_font_subset = (() => {
  const codes = new Set();
  for (let c = 0x20; c <= 0x7e; c++) codes.add(c);
  // 常用中文标点与符号
  const punct = '　、。〃〈〉《》「」『』【】〔〕〖〗！＂＃％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝～·—…“”‘’《》〈〉×÷°′″※→←↑↓■□●○◆◇★☆♥♪¥€£§¶©®™';
  for (const ch of punct) codes.add(ch.codePointAt(0));
  const full = '！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～';
  for (const ch of full) codes.add(ch.codePointAt(0));
  // 常用汉字（按频次排列的 3500 字表 + 常用扩展）
  const common = COMMON_HANZI_core_font_subset;
  for (const ch of common) codes.add(ch.codePointAt(0));
  return [...codes];
})();

return { "TrueTypeFont": TrueTypeFont_core_font_subset, "buildCmap": buildCmap_core_font_subset, "concat": concat_core_font_subset, "assembleTtf": assembleTtf_core_font_subset, "COMMON_HANZI": COMMON_HANZI_core_font_subset, "COMMON_CODES": COMMON_CODES_core_font_subset };
} };
/* ================= js/core/image-engine.js ================= */
__defs["js/core/image-engine.js"] = { exports: ["loadImageFromBlob","imageToCanvas","canvasToBlob","makeThumbnail","getCanvasSize","rotateBlob","sketchify","analyzeTone","hexToRgb","rgbToHex","dominantColor","gradientBlob","circleBlob","SKETCH_PRESETS","newImageMeta"], fn: function (module) {
var { "clamp": clamp, "uid": uid } = __m("js/core/utils.js");
/* ==========================================================================
 * 日记本 App —— 图像处理引擎（纯本地，无需联网）
 *  · 图片 → 素描 / 线稿 / 炭笔 / 水彩淡彩（分块异步，不卡界面）
 *  · 缩略图、压缩、旋转、取主色调（用于自动配色）
 * ========================================================================== */



/* ------------------------------ 载入工具 ------------------------------- */

async function loadImageFromBlob_core_image_engine(blob) {
  if (!blob) throw new Error('图片为空');
  if ('createImageBitmap' in window) {
    try { return await createImageBitmap(blob); } catch { /* 回退 */ }
  }
  const url = URL.createObjectURL(blob);
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('图片解码失败'));
      img.src = url;
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
}

function imageToCanvas_core_image_engine(img, maxSide = 0) {
  const sw = img.width || img.naturalWidth;
  const sh = img.height || img.naturalHeight;
  if (!sw || !sh) throw new Error('无法读取图片尺寸');
  const scale = maxSide && Math.max(sw, sh) > maxSide ? maxSide / Math.max(sw, sh) : 1;
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

function canvasToBlob_core_image_engine(canvas, type = 'image/jpeg', quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('图片导出失败'))), type, quality);
  });
}

async function makeThumbnail_core_image_engine(blob, maxSide = 480, quality = 0.8) {
  const img = await loadImageFromBlob_core_image_engine(blob);
  const canvas = imageToCanvas_core_image_engine(img, maxSide);
  return canvasToBlob_core_image_engine(canvas, 'image/jpeg', quality);
}

function getCanvasSize_core_image_engine(canvas) { return { width: canvas.width, height: canvas.height }; }

async function rotateBlob_core_image_engine(blob, degrees = 90) {
  const img = await loadImageFromBlob_core_image_engine(blob);
  const src = imageToCanvas_core_image_engine(img);
  const rad = (degrees * Math.PI) / 180;
  const out = document.createElement('canvas');
  const swap = Math.abs(degrees) % 180 === 90;
  out.width = swap ? src.height : src.width;
  out.height = swap ? src.width : src.height;
  const ctx = out.getContext('2d');
  ctx.translate(out.width / 2, out.height / 2);
  ctx.rotate(rad);
  ctx.drawImage(src, -src.width / 2, -src.height / 2);
  return canvasToBlob_core_image_engine(out, 'image/jpeg', 0.92);
}

/* ------------------------------ 像素工具 ------------------------------- */

function toGray_core_image_engine(data, w, h) {
  const g = new Float32Array(w * h);
  for (let i = 0, p = 0; i < g.length; i++, p += 4) {
    g[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
  }
  return g;
}

/** 可分离盒式模糊（近似高斯，速度远快于真高斯） */
function boxBlur_core_image_engine(src, w, h, radius) {
  if (radius <= 0) return src.slice();
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  const win = radius * 2 + 1;
  // 横向
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let acc = 0;
    for (let x = -radius; x <= radius; x++) acc += src[row + clamp(x, 0, w - 1)];
    for (let x = 0; x < w; x++) {
      tmp[row + x] = acc / win;
      const add = src[row + clamp(x + radius + 1, 0, w - 1)];
      const sub = src[row + clamp(x - radius, 0, w - 1)];
      acc += add - sub;
    }
  }
  // 纵向
  for (let x = 0; x < w; x++) {
    let acc = 0;
    for (let y = -radius; y <= radius; y++) acc += tmp[clamp(y, 0, h - 1) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = acc / win;
      const add = tmp[clamp(y + radius + 1, 0, h - 1) * w + x];
      const sub = tmp[clamp(y - radius, 0, h - 1) * w + x];
      acc += add - sub;
    }
  }
  return out;
}

function gaussianBlur_core_image_engine(src, w, h, radius) {
  let out = boxBlur_core_image_engine(src, w, h, Math.max(1, Math.round(radius * 0.6)));
  out = boxBlur_core_image_engine(out, w, h, Math.max(1, Math.round(radius * 0.6)));
  return out;
}

/**
 * 三次盒式模糊 ≈ 高斯（预览用，比两次快约 1/3；半径按等效高斯换算）
 * 两次盒式的等效高斯 sigma ≈ 0.6r，三次 ≈ 0.8r
 */
function fastBlur_core_image_engine(src, w, h, radius) {
  const r = Math.max(1, Math.round(radius * 0.45));
  let out = boxBlur_core_image_engine(src, w, h, r);
  out = boxBlur_core_image_engine(out, w, h, r);
  out = boxBlur_core_image_engine(out, w, h, r);
  return out;
}

/** Sobel 梯度（返回强度 0-255） */
function sobel_core_image_engine(gray, w, h) {
  const mag = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const tl = gray[i - w - 1], t = gray[i - w], tr = gray[i - w + 1];
      const l = gray[i - 1], r = gray[i + 1];
      const bl = gray[i + w - 1], b = gray[i + w], br = gray[i + w + 1];
      const gx = (tr + 2 * r + br) - (tl + 2 * l + bl);
      const gy = (bl + 2 * b + br) - (tl + 2 * t + tr);
      mag[i] = Math.min(255, Math.hypot(gx, gy) * 0.25);
    }
  }
  return mag;
}

/**
 * 轮廓锐化（3×3 非极大值抑制）
 * 只保留"比周围更像线"的像素，线条更细更干净；
 * 同时把孤立噪点（周围毫无边缘）压掉，避免线稿里满屏灰点。
 */
function sharpenEdges_core_image_engine(mag, w, h) {
  const out = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const c = mag[i];
      if (c <= 0) { out[i] = 0; continue; }
      if (c < mag[i - 1] || c < mag[i + 1] || c < mag[i - w] || c < mag[i + w]) { out[i] = c * 0.2; continue; }
      // 周围 8 邻域最大值，用于判断是"孤点"还是"连续线条"
      let nb = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const v2 = mag[i + dy * w + dx];
          if (v2 > nb) nb = v2;
        }
      }
      out[i] = nb < c * 0.5 ? c * 0.35 : c;
    }
  }
  return out;
}

function mulberry32_core_image_engine(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* --------------------------- 素描主体算法 ------------------------------ */

/**
 * 将图片转换为素描图
 * @param {Blob|HTMLImageElement|HTMLCanvasElement} input
 * @param {object} opts
 *   style: pencil | line | charcoal | wash
 *   strength: 0-1 铅笔浓度
 *   contrast: 0.5-2 对比度
 *   grain: 0-1 纸张颗粒
 *   threshold: 0-0.5 线条阈值
 *   maxSide: 输出最大边（像素），默认 1600
 *   paper: 纸张底色，默认 '#fdfbf5'
 *   progress: (ratio, stage) => void
 * @returns {Promise<{blob: Blob, canvas: HTMLCanvasElement, width:number, height:number}>}
 */
/**
 * 将图片转换为手绘风格
 *
 * 风格 style：
 *   pencil   铅笔素描 —— 石墨灰调 + 单向排线阴影（最像手工素描）
 *   line     钢笔线稿 —— 只留轮廓，线条干净
 *   charcoal 炭笔速写 —— 浓重明暗，阴影用交叉排线
 *   wash     水墨淡彩 —— 保留一点原色，水墨味
 *
 * 参数：
 *   strength   笔触浓度 0.1~1（越大越深）
 *   contrast   对比度 0.6~1.8
 *   grain      纸张颗粒 0~1
 *   threshold  线条阈值 0~0.4（越小抓到的线条越多）
 *   maxSide    输出最长边像素（0 = 原尺寸）
 *   paper      纸张底色，默认 '#fdfbf5'
 *   fast       true 时用更快的模糊（实时预览用）
 *   progress   (ratio, stage) => void
 * @returns {Promise<{blob: Blob, canvas: HTMLCanvasElement, width:number, height:number, style:string}>}
 */
async function sketchify_core_image_engine(input, opts = {}) {
  const {
    style = 'pencil',
    strength = 0.6,
    contrast = 1.1,
    grain = 0.35,
    threshold = 0.12,
    maxSide = 1600,
    paper = '#fdfbf5',
    fast = false,
    progress = null,
  } = opts;

  const report = (r, s) => { try { progress?.(clamp(r, 0, 1), s); } catch { /* ignore */ } };

  report(0.05, '读取图片');
  const img = input instanceof Blob ? await loadImageFromBlob_core_image_engine(input) : input;
  if (!img) throw new Error('图片内容为空');
  const srcCanvas = imageToCanvas_core_image_engine(img, maxSide);
  const w = srcCanvas.width;
  const h = srcCanvas.height;
  const ctx = srcCanvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, w, h);
  const gray = toGray_core_image_engine(imageData.data, w, h);

  report(0.3, '分离明暗');
  const radius = Math.max(1.5, Math.max(w, h) / 160);
  const blurred = fast ? fastBlur_core_image_engine(gray, w, h, radius) : gaussianBlur_core_image_engine(gray, w, h, radius);

  // 轮廓：铅笔 / 钢笔 / 炭笔都要用（之前只有铅笔和钢笔算，炭笔会崩）
  // 关键：轮廓必须在**轻模糊**图上算——用重模糊图会把边缘抹平，画出来的线又淡又虚
  const needEdges = style === 'pencil' || style === 'line' || style === 'charcoal';
  report(0.5, style === 'line' ? '提取线条' : '生成笔触');
  let edges = null;
  if (needEdges) {
    // 半径要够大：太小会把 JPEG 噪点/渐变颗粒当成线条，线稿会很脏
    const edgeRadius = clamp(Math.max(w, h) / 400, 1.6, 3.2);
    const edgeBase = fast
      ? fastBlur_core_image_engine(gray, w, h, edgeRadius)
      : gaussianBlur_core_image_engine(gray, w, h, edgeRadius);
    edges = sharpenEdges_core_image_engine(sobel_core_image_engine(edgeBase, w, h), w, h);
  }

  report(0.7, '铺纸张纹理');
  const rnd = mulberry32_core_image_engine(20240607);
  const out = ctx.createImageData(w, h);
  const o = out.data;
  const paperRGB = hexToRgb_core_image_engine(paper);

  // 「反相模糊」：亮部背面被周围暗部侵蚀，得到中间调 → 用它控制下笔压力
  // （不要用颜色减淡公式：它会把亮部直接爆成 255，整张图变成白纸）
  const invBlur = new Float32Array(w * h);
  for (let k = 0; k < invBlur.length; k++) invBlur[k] = 255 - blurred[k];
  // 音调/笔压：模糊半径小一些，细节才不会糊掉
  const softInv = fast ? fastBlur_core_image_engine(invBlur, w, h, Math.max(1, radius * 0.3)) : gaussianBlur_core_image_engine(invBlur, w, h, Math.max(1, radius * 0.3));
  // 归一化到实际动态范围，避免整体偏亮/偏暗
  let imin = Infinity;
  let imax = -Infinity;
  for (let k = 0; k < softInv.length; k++) {
    if (softInv[k] < imin) imin = softInv[k];
    if (softInv[k] > imax) imax = softInv[k];
  }
  const ispan = Math.max(24, imax - imin);
  const exposure = 0.78 + strength * 0.5;      // 整体笔压（随浓度）
  let toneMap = new Float32Array(w * h);
  for (let k = 0; k < toneMap.length; k++) {
    const nr = clamp((softInv[k] - imin) / ispan, 0, 1);
    toneMap[k] = clamp(255 * Math.pow(nr, 0.72) * exposure, 0, 255);
  }
  // 把"轻模糊"的中间调混回来一部分：大关系来自模糊图，细节来自原图，
  // 这样才有手工素描的丰富层次，而不是一块光滑的灰
  {
    const detailInv = fast ? fastBlur_core_image_engine(invBlur, w, h, 1.1) : boxBlur_core_image_engine(invBlur, w, h, 1);
    let dmin = Infinity;
    let dmax = -Infinity;
    for (let k = 0; k < detailInv.length; k++) {
      if (detailInv[k] < dmin) dmin = detailInv[k];
      if (detailInv[k] > dmax) dmax = detailInv[k];
    }
    const dspan = Math.max(24, dmax - dmin);
    const mix = 0.34;
    for (let k = 0; k < toneMap.length; k++) {
      const nr = clamp((detailInv[k] - dmin) / dspan, 0, 1);
      const detailTone = clamp(255 * Math.pow(nr, 0.72) * exposure, 0, 255);
      toneMap[k] = toneMap[k] * (1 - mix) + detailTone * mix;
    }
  }
  const toneBase = toneMap;

  /* ------------------------- 各风格的着色函数 ------------------------- */

  const depth = clamp(120 + strength * 120, 90, 236);              // pencil：最深能压到多深
  const charcoalDepth = clamp(150 + strength * 85, 150, 235);      // charcoal：最深处
  const penDark = 255 - clamp(120 + strength * 105, 120, 235);     // line：最深处
  const edgeGain = clamp(1.15 + (0.3 - threshold) * 3.2, 0.6, 2.6);

  /** 铅笔：石墨灰调 + 单向排线阴影，轮廓再压深 */
  const shadePencil = (x, y, e, pressure) => {
    if (pressure < 11 && e < 24) return 251 + rnd() * 3;
    const ts = Math.pow(clamp(pressure / 255, 0, 1), 0.86);
    let v = 252 - ts * depth;
    // 单向排线：中暗部叠加，模拟手工排线的笔触走向
    if (ts > 0.2) {
      const spread = Math.min(9, 3.2 + ts * 8);
      const ang = -0.62 + Math.sin(y * 0.0035) * 0.18;
      const p = x * Math.cos(ang) + y * Math.sin(ang);
      const phase = Math.abs((((p % spread) + spread) % spread) - spread / 2) / (spread / 2);
      if (phase > 0.5) {
        const stroke = (ts - 0.2) * 0.3 * (1 - ts * 0.6) + (rnd() - 0.5) * 0.05;
        v -= Math.max(0, stroke) * (255 - v);
      }
    }
    // 轮廓：亮部也要有线条，否则整体太平
    if (e > 22) {
      const eN = clamp(((e - 22) * edgeGain) / 255, 0, 1);
      v -= eN * (150 - ts * 80);
    }
    return v;
  };

  /**
   * 钢笔：白底黑线（线稿风）。
   * 不做"自适应阈值"——阈值方案在平滑照片上会把所有像素判成非线条，整张变白纸。
   * 改用强对比曲线：弱边缘直接压成纸白，中强边缘迅速转黑，得到干净的实心线条。
   */
  const penGain = clamp(5.2 - threshold * 9, 2.2, 5.2);
  const shadeLine = (x, y, e) => {
    const raw = Math.min(1, (e * penGain) / 110);
    if (raw <= 0.06) return 250 + rnd() * 5;          // 非线条：干净的纸白（滤掉噪点）
    const eN = Math.pow(raw, 0.28);                   // 对比曲线：中强边缘迅速变黑
    const v = 250 - eN * (250 - penDark);
    const wobble = (rnd() - 0.5) * 5;
    return v + wobble * (1 - eN);
  };

  /** 炭笔：大块明暗 + 交叉排线，颗粒更重 */
  const shadeCharcoal = (x, y, e, pressure) => {
    const ts = Math.pow(clamp((pressure / 255) * (0.8 + strength * 0.5), 0, 1), 0.85);
    let v = 250 - ts * charcoalDepth;
    if (ts > 0.1) {
      const w1 = Math.abs(((((x + y * 0.5) % 7) + 7) % 7) - 3.5);
      const w2 = Math.abs(((((-x * 0.7 + y) % 11) + 11) % 11) - 5.5);
      if (w1 < 2.5) v -= ts * 42 * (1 - w1 / 2.5) + (rnd() - 0.5) * 4;
      if (w2 < 3.0) v -= ts * 54 * (1 - w2 / 3.0) + (rnd() - 0.5) * 5;
    }
    if (e > 18) v -= clamp(((e - 18) * 1.5) / 255, 0, 1) * 165;
    v += (rnd() - 0.5) * (9 + strength * 15);
    return v;
  };

  /** 水墨：灰调为主，混入约四分之一原色，暗部偏冷 */
  const shadeWash = (x, y, pressure, sr, sg, sb) => {
    const toneN = clamp(pressure / 255, 0, 1);
    const ink = 248 - Math.pow(toneN * 0.98, 0.8) * (120 + strength * 80);
    const colorMix = 0.3;
    const r = ink * (1 - colorMix) + (sr * 0.55 + ink * 0.45) * colorMix;
    const g = ink * (1 - colorMix) + (sg * 0.55 + ink * 0.45) * colorMix;
    const b = ink * (1 - colorMix) + (sb * 0.55 + ink * 0.45) * colorMix;
    const wet = (rnd() - 0.5) * 6;
    return [r + wet, g + wet, b + wet + toneN * 6];
  };

  /* ----------------------------- 主循环 ----------------------------- */

  const isWash = style === 'wash';
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const p = i * 4;
      const e = edges ? edges[i] : 0;
      const tone = toneBase[i];
      let r;
      let g;
      let b;

      if (isWash) {
        [r, g, b] = shadeWash(x, y, tone, imageData.data[p], imageData.data[p + 1], imageData.data[p + 2]);
      } else if (style === 'line') {
        r = g = b = shadeLine(x, y, e);
      } else if (style === 'charcoal') {
        r = g = b = shadeCharcoal(x, y, e, tone);
      } else {
        r = g = b = shadePencil(x, y, e, tone);
      }

      // 对比度
      r = (r - 128) * contrast + 128;
      g = (g - 128) * contrast + 128;
      b = (b - 128) * contrast + 128;

      // 纸张颗粒（暗部更明显，像铅笔压进纸纹）
      if (grain > 0) {
        const lum = (r + g + b) / 3;
        const amt = grain * 38 * (0.35 + (255 - lum) / 255);
        const n = (rnd() - 0.5) * amt;
        r += n; g += n; b += n;
      }

      // 压到纸张底色上（避免纯白刺眼）
      o[p] = clamp(paperRGB.r * 0.35 + r * 0.65, 0, 255);
      o[p + 1] = clamp(paperRGB.g * 0.35 + g * 0.65, 0, 255);
      o[p + 2] = clamp(paperRGB.b * 0.35 + b * 0.65, 0, 255);
      o[p + 3] = 255;
    }
    if (y % 64 === 0) report(0.7 + (y / h) * 0.25, '绘制像素');
  }

  const outCanvas = document.createElement('canvas');
  outCanvas.width = w;
  outCanvas.height = h;
  outCanvas.getContext('2d').putImageData(out, 0, 0);

  report(0.97, '压缩输出');
  const blob = await canvasToBlob_core_image_engine(outCanvas, 'image/jpeg', 0.92);
  report(1, '完成');
  return { blob, canvas: outCanvas, width: w, height: h, style };
}

/**
 * 分析一张素描结果的明暗分布（用于自检：防止出现"整张白纸"）
 * @returns {{mean:number, darkRatio:number, min:number, max:number, std:number}}
 */
async function analyzeTone_core_image_engine(blob) {
  const img = await loadImageFromBlob_core_image_engine(blob);
  const canvas = imageToCanvas_core_image_engine(img, 360);
  const { width: w, height: h } = canvas;
  const d = canvas.getContext('2d').getImageData(0, 0, w, h).data;
  let sum = 0; let sum2 = 0; let min = 255; let max = 0; let dark = 0;
  const n = w * h;
  for (let i = 0; i < n; i++) {
    const p = i * 4;
    const v = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2];
    sum += v; sum2 += v * v;
    if (v < min) min = v;
    if (v > max) max = v;
    if (v < 170) dark++;
  }
  const mean = sum / n;
  return { mean, min, max, darkRatio: dark / n, std: Math.sqrt(Math.max(0, sum2 / n - mean * mean)) };
}

function hexToRgb_core_image_engine(hex = '#ffffff') {
  const m = String(hex).replace('#', '');
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const num = parseInt(full || 'ffffff', 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex_core_image_engine({ r, g, b }) {
  const to = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** 计算图片主色调（用于主题自动配色） */
async function dominantColor_core_image_engine(blob, { saturate = 1.15 } = {}) {
  const img = await loadImageFromBlob_core_image_engine(blob);
  const canvas = imageToCanvas_core_image_engine(img, 64);
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  let r = 0, g = 0, b = 0, n = 0;
  const buckets = new Map();
  for (let p = 0; p < data.length; p += 4) {
    if (data[p + 3] < 128) continue;
    r += data[p]; g += data[p + 1]; b += data[p + 2]; n++;
    const key = `${data[p] >> 5}-${data[p + 1] >> 5}-${data[p + 2] >> 5}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }
  if (!n) return '#7b4b2a';
  let best = null;
  for (const [k, count] of buckets) if (!best || count > best.count) best = { k, count };
  if (best) {
    const [br, bg, bb] = best.k.split('-').map((v) => Number(v) * 32 + 16);
    r = (r / n) * 0.4 + br * 0.6;
    g = (g / n) * 0.4 + bg * 0.6;
    b = (b / n) * 0.4 + bb * 0.6;
  } else { r /= n; g /= n; b /= n; }
  const avg = (r + g + b) / 3;
  const boost = (v) => clamp(avg + (v - avg) * saturate, 0, 255);
  return rgbToHex_core_image_engine({ r: boost(r), g: boost(g), b: boost(b) });
}

/** 生成一张渐变色卡（用于主题预览、占位图） */
function gradientBlob_core_image_engine(colors = ['#7b4b2a', '#c9a227'], size = 480) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, size, size);
  colors.forEach((c, i) => grad.addColorStop(i / Math.max(1, colors.length - 1), c));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return canvasToBlob_core_image_engine(canvas, 'image/jpeg', 0.85);
}

/** 把图片裁成圆形头像 */
async function circleBlob_core_image_engine(blob, size = 256) {
  const img = await loadImageFromBlob_core_image_engine(blob);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  const s = Math.min(img.width || size, img.height || size);
  ctx.drawImage(img, ((img.width || size) - s) / 2, ((img.height || size) - s) / 2, s, s, 0, 0, size, size);
  ctx.restore();
  return canvasToBlob_core_image_engine(canvas, 'image/png');
}

const SKETCH_PRESETS_core_image_engine = [
  { id: 'pencil', name: '铅笔素描', desc: '柔和灰调，最像手工铅笔稿', opts: { style: 'pencil', strength: 0.6, contrast: 1.12, grain: 0.35 } },
  { id: 'line', name: '钢笔线稿', desc: '只保留轮廓，适合做插图', opts: { style: 'line', strength: 0.8, contrast: 1.25, grain: 0.12, threshold: 0.1 } },
  { id: 'charcoal', name: '炭笔速写', desc: '浓重对比，明暗强烈', opts: { style: 'charcoal', strength: 0.75, contrast: 1.3, grain: 0.55 } },
  { id: 'wash', name: '水墨淡彩', desc: '留一点原色，水墨风', opts: { style: 'wash', strength: 0.55, contrast: 1.05, grain: 0.3 } },
];

function newImageMeta_core_image_engine(extra = {}) {
  return { id: uid('img'), sketch: false, ...extra };
}

return { "loadImageFromBlob": loadImageFromBlob_core_image_engine, "imageToCanvas": imageToCanvas_core_image_engine, "canvasToBlob": canvasToBlob_core_image_engine, "makeThumbnail": makeThumbnail_core_image_engine, "getCanvasSize": getCanvasSize_core_image_engine, "rotateBlob": rotateBlob_core_image_engine, "sketchify": sketchify_core_image_engine, "analyzeTone": analyzeTone_core_image_engine, "hexToRgb": hexToRgb_core_image_engine, "rgbToHex": rgbToHex_core_image_engine, "dominantColor": dominantColor_core_image_engine, "gradientBlob": gradientBlob_core_image_engine, "circleBlob": circleBlob_core_image_engine, "SKETCH_PRESETS": SKETCH_PRESETS_core_image_engine, "newImageMeta": newImageMeta_core_image_engine };
} };
/* ================= js/core/storage.js ================= */
__defs["js/core/storage.js"] = { exports: ["DEFAULT_SETTINGS","storageBackend","backendReason","idbAvailable","isFallbackMode","storageInfo","__setInjectedBackend","currentSession","currentAccountId","setSession","normalizeEmail","isValidEmail","findAccountByEmail","getAccount","listAccounts","putAccount","registerAccount","loginAccount","logout","updateAccount","changePassword","vaultGet","vaultSet","vaultDel","vaultKeys","vaultAll","vaultClearAccount","settingsGet","settingsSet","defaultSettings","deepMerge","entryKey","emptyEntry","getEntry","saveEntry","deleteEntry","listEntryDates","listEntries","putImage","getImage","deleteImage","imageURL","gcImages","putFont","listFonts","deleteFont","rememberUnlock","getUnlockedPassword","forgetUnlock","lockVaultAll","isUnlocked","ensureStorageReady","exportBackup","importBackup"], fn: function (module) {
var { "uid": uid, "toKey": toKey, "local": local, "bytesToB64": bytesToB64, "b64ToBytes": b64ToBytes } = __m("js/core/utils.js");
var { "makeVerifier": makeVerifier, "verifyPassword": verifyPassword } = __m("js/core/crypto.js");
/* ==========================================================================
 * 日记本 App —— 数据层（IndexedDB）
 *  · 账号表 accounts：邮箱 + 密码校验值（PBKDF2），不存明文密码
 *  · 保险箱 vault：按 (账号ID, 键) 存储，实现「数据与邮箱绑定、账号之间隔离」
 *  · 资源表 assets：图片/字体等二进制，按 (账号ID, 资源ID) 存储
 * ========================================================================== */




const DB_NAME_core_storage = 'riji-ben';
const DB_VERSION_core_storage = 2;              // v1.0.1：升版以修复「空壳数据库」（有版本号但没有表）
const STORE_ACCOUNTS_core_storage = 'accounts';
const STORE_VAULT_core_storage = 'vault';
const STORE_ASSETS_core_storage = 'assets';
const REQUIRED_STORES_core_storage = [STORE_ACCOUNTS_core_storage, STORE_VAULT_core_storage, STORE_ASSETS_core_storage];
const SESSION_KEY_core_storage = 'riji.session.v1';

let dbPromise_core_storage = null;

/* ------------------------- 降级存储（localStorage） ------------------------- */

/**
 * IndexedDB 是首选；但在 file:// 直接打开、隐私模式、存储被禁用等情况下，
 * 浏览器可能完全不给用。这里提供一套 localStorage 降级实现，
 * 保证「注册 / 登录 / 写日记 / 加密上锁 / 导出」都仍然可用。
 * 限制：图片会转成 data URL 存进 localStorage，容量受浏览器配额（约 5MB）限制。
 */
const FALLBACK_core_storage = createFallbackStore_core_storage();
/** 取降级存储适配器（惰性创建，避免启动时就触碰 localStorage） */
let fallbackInstance_core_storage = null;
function fallbackStore_core_storage() {
  if (!fallbackInstance_core_storage) fallbackInstance_core_storage = FALLBACK_core_storage;
  return fallbackInstance_core_storage;
}

function createFallbackStore_core_storage() {
  const PREFIX = (aid) => `riji.fb.${aid}.`;
  let memory = null;

  const storage = (() => {
    try {
      const t = '__riji_fb_test__';
      window.localStorage.setItem(t, '1');
      window.localStorage.removeItem(t);
      return window.localStorage;
    } catch {
      if (!memory) {
        const map = new Map();
        memory = {
          getItem: (k) => (map.has(k) ? map.get(k) : null),
          setItem: (k, v) => map.set(k, String(v)),
          removeItem: (k) => map.delete(k),
          key: (i) => [...map.keys()][i] ?? null,
          get length() { return map.size; },
        };
      }
      return memory;
    }
  })();

  const read = (key, dflt = null) => {
    try { const raw = storage.getItem(key); return raw == null ? dflt : JSON.parse(raw); } catch { return dflt; }
  };
  const write = (key, value) => {
    try { storage.setItem(key, JSON.stringify(value)); return true; }
    catch (err) {
      const quota = /quota|exceed/i.test(String(err && err.name) + String(err && err.message));
      throw new Error(quota ? '本机存储空间不足（离线模式下容量约 5MB），请减少图片或改用本地服务器打开' : `保存失败：${err.message}`);
    }
  };
  const del = (key) => { try { storage.removeItem(key); } catch { /* 忽略 */ } };
  const prefixOf = (key) => key.slice(key.lastIndexOf('.') + 1); // riji.fb.<aid>.<key>

  const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
  const dataUrlToBlob = (url) => {
    const [meta, b64] = String(url).split(',');
    const mime = (/data:([^;]+)/.exec(meta) || [, 'image/png'])[1];
    const bin = atob(b64 || '');
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  };

  return {
    available: true,
    // 账号
    listAccounts_core_storage: () => read('riji.fb.accounts', []),
    putAccount_core_storage: (account) => {
      const all = read('riji.fb.accounts', []).filter((a) => a.id !== account.id);
      all.push(account);
      write('riji.fb.accounts', all);
      return account;
    },
    findAccountByEmail_core_storage: (email) => read('riji.fb.accounts', []).find((a) => a.email === email) || null,
    getAccount_core_storage: (id) => read('riji.fb.accounts', []).find((a) => a.id === id) || null,
    // 键值
    vaultGet_core_storage: (aid, key, dflt = null) => read(PREFIX(aid) + key, dflt),
    vaultSet_core_storage: (aid, key, value) => { write(PREFIX(aid) + key, value); return value; },
    vaultDel_core_storage: (aid, key) => del(PREFIX(aid) + key),
    vaultAll_core_storage: (aid, prefix = '') => {
      const out = [];
      const head = PREFIX(aid);
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (!k || !k.startsWith(head)) continue;
        const short = k.slice(head.length);
        if (prefix && !short.startsWith(prefix)) continue;
        out.push({ key: short, value: read(k) });
      }
      return out;
    },
    // 图片（转 data URL）
    putImage_core_storage: async (aid, blob, meta = {}) => {
      const record = {
        aid, id: meta.id, blob,
        type: blob.type || 'image/png', size: blob.size || 0,
        width: meta.width || 0, height: meta.height || 0,
        kind: meta.kind || 'photo', createdAt: Date.now(), name: meta.name || '',
      };
      const dataUrl = await blobToDataUrl(blob);
      write(PREFIX(aid) + `asset:${meta.id}`, { ...record, blob: undefined, dataUrl });
      return record;
    },
    getImage_core_storage: (aid, id) => {
      const row = read(PREFIX(aid) + `asset:${id}`, null);
      if (!row) return null;
      return { ...row, blob: dataUrlToBlob(row.dataUrl) };
    },
    deleteImage_core_storage: (aid, id) => del(PREFIX(aid) + `asset:${id}`),
    listImages: (aid) => {
      const rows = [];
      const head = PREFIX(aid);
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (!k || !k.startsWith(head) || !k.startsWith('asset:', head.length)) continue;
        rows.push(read(k));
      }
      return rows;
    },
    deleteAssets: (aid) => {
      const head = PREFIX(aid);
      const keys = [];
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (k && k.startsWith(head)) keys.push(k);
      }
      keys.forEach((k) => del(k));
    },
    /** 估算占用（用于提示容量） */
    usage: () => {
      let bytes = 0;
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (!k || !k.startsWith('riji.fb.')) continue;
        bytes += (k.length + String(storage.getItem(k) || '').length) * 2;
      }
      return bytes;
    },
  };
}

/* ------------------------------ IndexedDB ------------------------------ */

/** 存储后端状态：'idb' | 'fallback'，由 openDB() 探测后决定 */
let storageBackend_core_storage = (typeof indexedDB !== 'undefined' && indexedDB !== null) ? 'idb' : 'fallback';
let backendReason_core_storage = storageBackend_core_storage === 'fallback' ? '当前环境不支持 IndexedDB' : '';
const idbAvailable_core_storage = storageBackend_core_storage === 'idb';

/** 是否正在使用降级存储（localStorage） */
function isFallbackMode_core_storage() { return storageBackend_core_storage === 'fallback'; }
function storageInfo_core_storage() {
  return {
    backend_core_storage: storageBackend_core_storage,
    reason: backendReason_core_storage,
    usageBytes: storageBackend_core_storage === 'fallback' ? fallbackStore_core_storage().usage() : 0,
    fileProtocol: location.protocol === 'file:',
  };
}

/** 没有任何数据库 → 交给可注入的适配器（测试用） */
let injectedBackend_core_storage = null;
function __setInjectedBackend_core_storage(adapter, reason = 'injected') {
  injectedBackend_core_storage = adapter || null;
  storageBackend_core_storage = adapter ? 'injected' : 'idb';
  backendReason_core_storage = adapter ? reason : '';
  dbPromise_core_storage = null;
}

function openRaw_core_storage(version) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME_core_storage, version);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_ACCOUNTS_core_storage)) {
        const s = db.createObjectStore(STORE_ACCOUNTS_core_storage, { keyPath: 'id' });
        s.createIndex('email', 'email', { unique: true });
      }
      if (!db.objectStoreNames.contains(STORE_VAULT_core_storage)) {
        const s = db.createObjectStore(STORE_VAULT_core_storage, { keyPath: ['aid', 'key'] });
        s.createIndex('aid', 'aid', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_ASSETS_core_storage)) {
        const s = db.createObjectStore(STORE_ASSETS_core_storage, { keyPath: ['aid', 'id'] });
        s.createIndex('aid', 'aid', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('数据库打开失败'));
    req.onblocked = () => reject(new Error('数据库被其它标签页占用，请关闭其他「日记本」页面后重试'));
  });
}

function closeDB_core_storage(db) { try { db.close(); } catch { /* 忽略 */ } }

/**
 * 打开数据库，并确保三张表都存在。
 * ⚠️ 修复 v1.0.0 的一个严重问题：如果数据库「有版本号但没有表」（上次初始化中途失败
 *    留下的空壳），再次打开时 onupgradeneeded 不会触发，导致注册/登录永久失败。
 *    这里每次打开都做一次体检，缺表就自动升版重建。
 */
function openDB_core_storage() {
  if (storageBackend_core_storage === 'fallback') return Promise.reject(new Error(`当前环境不支持 IndexedDB（${backendReason_core_storage}）`));
  if (storageBackend_core_storage === 'injected') return Promise.resolve(injectedBackend_core_storage);
  if (dbPromise_core_storage) return dbPromise_core_storage;

  dbPromise_core_storage = (async () => {
    // 1) 正常打开
    let db = await openRaw_core_storage(DB_VERSION_core_storage);
    // 2) 体检：表是否齐全
    const missing = REQUIRED_STORES_core_storage.filter((s) => !db.objectStoreNames.contains(s));
    if (!missing.length) return db;

    // 3) 缺表 → 升版重建（这是「空壳数据库」的修复路径）
    console.warn(`[日记本] 数据库缺少表 ${missing.join(', ')}，正在自动修复…`);
    const nextVersion = db.version + 1;
    closeDB_core_storage(db);
    db = await openRaw_core_storage(nextVersion);
    const stillMissing = REQUIRED_STORES_core_storage.filter((s) => !db.objectStoreNames.contains(s));
    if (stillMissing.length) {
      closeDB_core_storage(db);
      throw new Error(`数据库修复失败（仍缺 ${stillMissing.join(', ')}）。可尝试清除本站数据后重开。`);
    }
    console.info('[日记本] 数据库已修复');
    return db;
  })();

  dbPromise_core_storage = dbPromise_core_storage.catch(async (err) => {
    dbPromise_core_storage = null;
    // 打开失败 → 自动降级到 localStorage，至少保证能用
    if (storageBackend_core_storage === 'idb') {
      storageBackend_core_storage = 'fallback';
      backendReason_core_storage = err && err.message ? err.message : 'IndexedDB 不可用';
      console.warn('[日记本] IndexedDB 不可用，已切换到降级存储：', backendReason_core_storage);
      return fallbackStore_core_storage();
    }
    throw err;
  });
  return dbPromise_core_storage;
}

/** 存储后端统一入口（IndexedDB db 对象 或 降级适配器） */
function backend_core_storage() {
  if (storageBackend_core_storage === 'fallback') return Promise.resolve(fallbackStore_core_storage());
  return openDB_core_storage();
}

/* ------------------------------ 会话管理 ------------------------------- */

let session_core_storage = local.get(SESSION_KEY_core_storage, null); // { accountId, email, nickname }

function currentSession_core_storage() { return session_core_storage; }
function currentAccountId_core_storage() { return session_core_storage?.accountId || null; }

function setSession_core_storage(next) {
  session_core_storage = next;
  if (next) local.set(SESSION_KEY_core_storage, next);
  else local.del(SESSION_KEY_core_storage);
  return session_core_storage;
}

/* ------------------------------ 账号管理 ------------------------------- */

function normalizeEmail_core_storage(email = '') { return String(email).trim().toLowerCase(); }

function isValidEmail_core_storage(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizeEmail_core_storage(email));
}

/** 小工具：把 IDBRequest 包成 Promise */
function reqPromise_core_storage(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function findAccountByEmail_core_storage(email) {
  const norm = normalizeEmail_core_storage(email);
  const b = await backend_core_storage();
  if (storageBackend_core_storage !== 'idb') return b.findAccountByEmail(norm);
  const t = b.transaction(STORE_ACCOUNTS_core_storage, 'readonly');
  const r = t.objectStore(STORE_ACCOUNTS_core_storage).index('email').get(norm);
  const hit = await reqPromise_core_storage(r);
  return hit || null;
}

async function getAccount_core_storage(id) {
  const b = await backend_core_storage();
  if (storageBackend_core_storage !== 'idb') return b.getAccount(id);
  const t = b.transaction(STORE_ACCOUNTS_core_storage, 'readonly');
  const hit = await reqPromise_core_storage(t.objectStore(STORE_ACCOUNTS_core_storage).get(id));
  return hit || null;
}

async function listAccounts_core_storage() {
  const b = await backend_core_storage();
  if (storageBackend_core_storage !== 'idb') return b.listAccounts();
  const t = b.transaction(STORE_ACCOUNTS_core_storage, 'readonly');
  const rows = await reqPromise_core_storage(t.objectStore(STORE_ACCOUNTS_core_storage).getAll());
  return rows || [];
}

async function putAccount_core_storage(account) {
  const b = await backend_core_storage();
  if (storageBackend_core_storage !== 'idb') return b.putAccount(account);
  return new Promise((resolve, reject) => {
    const t = b.transaction(STORE_ACCOUNTS_core_storage, 'readwrite');
    t.objectStore(STORE_ACCOUNTS_core_storage).put(account);
    t.oncomplete = () => resolve(account);
    t.onerror = () => reject(t.error);
  });
}

/** 注册账号 */
async function registerAccount_core_storage({ email, password, nickname = '' }) {
  const normEmail = normalizeEmail_core_storage(email);
  if (!isValidEmail_core_storage(normEmail)) throw new Error('请输入正确的邮箱地址');
  if (!password || password.length < 6) throw new Error('密码至少 6 位');
  const exist = await findAccountByEmail_core_storage(normEmail);
  if (exist) throw new Error('该邮箱已注册，请直接登录');
  const { salt, verifier, algo } = await makeVerifier(password);
  const account = {
    id: uid('acc'),
    email: normEmail,
    nickname: nickname || normEmail.split('@')[0],
    verifier,
    salt,
    algo,
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
    avatar: '',
    settings: null,
  };
  await putAccount_core_storage(account);
  await setSession_core_storage({ accountId: account.id, email: account.email, nickname: account.nickname });
  return account;
}

/** 登录 */
async function loginAccount_core_storage({ email, password }) {
  const normEmail = normalizeEmail_core_storage(email);
  const account = await findAccountByEmail_core_storage(normEmail);
  if (!account) throw new Error('该邮箱尚未注册，请先注册');
  const ok = await verifyPassword(password, { salt: account.salt, verifier: account.verifier });
  if (!ok) throw new Error('密码不正确');
  account.lastLoginAt = Date.now();
  await putAccount_core_storage(account);
  await setSession_core_storage({ accountId: account.id, email: account.email, nickname: account.nickname });
  return account;
}

function logout_core_storage() {
  setSession_core_storage(null);
  lockVaultAll_core_storage();
}

async function updateAccount_core_storage(accountId, patch) {
  const account = await getAccount_core_storage(accountId);
  if (!account) throw new Error('账号不存在');
  const next = { ...account, ...patch };
  await putAccount_core_storage(next);
  if (session_core_storage && session_core_storage.accountId === accountId) {
    setSession_core_storage({ accountId, email: next.email, nickname: next.nickname });
  }
  return next;
}

async function changePassword_core_storage(accountId, oldPassword, newPassword) {
  const account = await getAccount_core_storage(accountId);
  const ok = await verifyPassword(oldPassword, { salt: account.salt, verifier: account.verifier });
  if (!ok) throw new Error('原密码不正确');
  if (!newPassword || newPassword.length < 6) throw new Error('新密码至少 6 位');
  const { salt, verifier, algo } = await makeVerifier(newPassword);
  const next = { ...account, salt, verifier, algo };
  await putAccount_core_storage(next);
  return next;
}

/* --------------------------- 保险箱（键值存储） -------------------------- */

function requireAccount_core_storage() {
  if (!session_core_storage?.accountId) throw new Error('尚未登录');
  return session_core_storage.accountId;
}

async function vaultGet_core_storage(key, dflt = null) {
  const aid = requireAccount_core_storage();
  if (storageBackend_core_storage !== 'idb') return fallbackStore_core_storage().vaultGet(aid, key, dflt);
  const db = await backend_core_storage();
  const t = db.transaction(STORE_VAULT_core_storage, 'readonly');
  const row = await reqPromise_core_storage(t.objectStore(STORE_VAULT_core_storage).get([aid, key]));
  return row ? row.value : dflt;
}

async function vaultSet_core_storage(key, value) {
  const aid = requireAccount_core_storage();
  if (storageBackend_core_storage !== 'idb') return fallbackStore_core_storage().vaultSet(aid, key, value);
  const db = await backend_core_storage();
  await new Promise((resolve, reject) => {
    const t = db.transaction(STORE_VAULT_core_storage, 'readwrite');
    t.objectStore(STORE_VAULT_core_storage).put({ aid, key, value, updatedAt: Date.now() });
    t.oncomplete = resolve;
    t.onerror = () => reject(t.error);
  });
  return value;
}

async function vaultDel_core_storage(key) {
  const aid = requireAccount_core_storage();
  if (storageBackend_core_storage !== 'idb') { fallbackStore_core_storage().vaultDel(aid, key); return; }
  const db = await backend_core_storage();
  await new Promise((resolve, reject) => {
    const t = db.transaction(STORE_VAULT_core_storage, 'readwrite');
    t.objectStore(STORE_VAULT_core_storage).delete([aid, key]);
    t.oncomplete = resolve;
    t.onerror = () => reject(t.error);
  });
}

async function vaultKeys_core_storage(prefix = '') {
  const aid = requireAccount_core_storage();
  if (storageBackend_core_storage !== 'idb') {
    return fallbackStore_core_storage().vaultAll(aid, prefix).map((r) => r.key);
  }
  const db = await backend_core_storage();
  const t = db.transaction(STORE_VAULT_core_storage, 'readonly');
  const rows = await reqPromise_core_storage(t.objectStore(STORE_VAULT_core_storage).index('aid').getAll(IDBKeyRange.only(aid)));
  return (rows || []).map((r) => r.key).filter((k) => !prefix || k.startsWith(prefix));
}

async function vaultAll_core_storage(prefix = '') {
  const aid = requireAccount_core_storage();
  if (storageBackend_core_storage !== 'idb') return fallbackStore_core_storage().vaultAll(aid, prefix);
  const db = await backend_core_storage();
  const t = db.transaction(STORE_VAULT_core_storage, 'readonly');
  const rows = await reqPromise_core_storage(t.objectStore(STORE_VAULT_core_storage).index('aid').getAll(IDBKeyRange.only(aid)));
  return (rows || []).filter((r) => !prefix || r.key.startsWith(prefix));
}

async function vaultClearAccount_core_storage(aid = requireAccount_core_storage()) {
  if (storageBackend_core_storage !== 'idb') { fallbackStore_core_storage().deleteAssets(aid); return; }
  const db = await backend_core_storage();
  await new Promise((resolve, reject) => {
    const t = db.transaction([STORE_VAULT_core_storage, STORE_ASSETS_core_storage], 'readwrite');
    for (const store of [STORE_VAULT_core_storage, STORE_ASSETS_core_storage]) {
      const idx = t.objectStore(store).index('aid');
      const r = idx.openKeyCursor(IDBKeyRange.only(aid));
      r.onsuccess = () => {
        const cursor = r.result;
        if (cursor) { t.objectStore(store).delete(cursor.primaryKey); cursor.continue(); }
      };
    }
    t.oncomplete = resolve;
    t.onerror = () => reject(t.error);
  });
}

/* ------------------------------- 设置 --------------------------------- */

const DEFAULT_SETTINGS_core_storage = {
  theme: 'linen',            // 主题 id
  bg: { type: 'preset', value: 'linen', imageId: null, opacity: 0.5, blur: 0 },
  cover: { style: 'leather', color: '#7b4b2a', title: '日记本', subtitle: '' },
  paper: { style: 'cream', lines: true, lineGap: 30, margin: 18, texture: 0.5 },
  font: { family: 'LXGW WenKai', size: 17, lineHeight: 1.85, letterSpacing: 0.2 },
  ink: { color: '#2b2b33', highlight: '#ffe9a8' },
  handwriting: { styleId: 'kai', jitter: 0.5, slant: 3, inkBleed: 0.4, sizeScale: 1 },
  weather: { enabled: true, city: '', lat: null, lon: null, auto: true, provider: 'open-meteo' },
  ai: {
    provider: 'local',                 // local | openai | anthropic | custom
    endpoint: '', apiKey: '', model: '',
    sketch: { strength: 0.6, style: 'pencil', contrast: 1.1, grain: 0.35, threshold: 0.12 },
    handwriting: { engine: 'font' },
  },
  lock: { enabled: false, autoLockMinutes: 5 },
  export: { format: 'pdf', includeImages: true, includeWeather: true, paper: 'a5', email: '' },
  sound: { pageTurn: true, volume: 0.35 },
  ui: { weekStart: 0, showLunar: true, showWeatherIcon: true, haptics: true },
  createdAt: Date.now(),
};

async function settingsGet_core_storage() {
  const saved = await vaultGet_core_storage('settings', null);
  return deepMerge_core_storage(structuredCloneSafe_core_storage(DEFAULT_SETTINGS_core_storage), saved || {});
}

async function settingsSet_core_storage(patch) {
  const cur = await settingsGet_core_storage();
  const next = deepMerge_core_storage(cur, patch || {});
  await vaultSet_core_storage('settings', next);
  return next;
}

function defaultSettings_core_storage() { return structuredCloneSafe_core_storage(DEFAULT_SETTINGS_core_storage); }

function structuredCloneSafe_core_storage(obj) {
  try { return structuredClone(obj); } catch { return JSON.parse(JSON.stringify(obj)); }
}

function deepMerge_core_storage(base, patch) {
  if (Array.isArray(patch)) return patch.slice();
  if (patch === null || patch === undefined) return base;
  if (typeof patch !== 'object') return patch;
  const out = (base && typeof base === 'object' && !Array.isArray(base)) ? { ...base } : {};
  for (const [k, v] of Object.entries(patch)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = deepMerge_core_storage(out[k], v);
    else out[k] = v;
  }
  return out;
}

/* ------------------------------- 日记 --------------------------------- */

const entryKey_core_storage = (dateKey) => `entry:${dateKey}`;

function emptyEntry_core_storage(dateKey) {
  return {
    date: dateKey,
    title: '',
    weather: null,
    mood: '',
    location: '',
    body: '',
    drawings: [],        // 手写图层 [{id, imageId, x, y, w, h}]
    images: [],          // 图片 [{id, thumbId, caption, layout, sketch}]
    tags: [],
    locked: false,
    revisions: [],       // 批改历史 [{at, body, title, note}]
    createdAt: Date.now(),
    updatedAt: Date.now(),
    wordCount: 0,
  };
}

async function getEntry_core_storage(dateKey) {
  const key = typeof dateKey === 'object' ? toKey(dateKey) : dateKey;
  const raw = await vaultGet_core_storage(entryKey_core_storage(key), null);
  if (!raw) return null;
  return { ...emptyEntry_core_storage(key), ...raw };
}

async function saveEntry_core_storage(entry) {
  const date = toKey(entry.date);
  const prev = await vaultGet_core_storage(entryKey_core_storage(date), null);
  const next = { ...emptyEntry_core_storage(date), ...prev, ...entry, date, updatedAt: Date.now() };
  await vaultSet_core_storage(entryKey_core_storage(date), next);
  return next;
}

async function deleteEntry_core_storage(dateKey) {
  const key = typeof dateKey === 'object' ? toKey(dateKey) : dateKey;
  const entry = await getEntry_core_storage(key);
  if (entry) {
    for (const img of entry.images || []) await deleteImage_core_storage(img.id);
    for (const d of entry.drawings || []) if (d.imageId) await deleteImage_core_storage(d.imageId);
  }
  await vaultDel_core_storage(entryKey_core_storage(key));
}

async function listEntryDates_core_storage() {
  const keys = await vaultKeys_core_storage('entry:');
  return keys.map((k) => k.slice(6)).sort();
}

async function listEntries_core_storage() {
  const rows = await vaultAll_core_storage('entry:');
  return rows
    .map((r) => ({ ...emptyEntry_core_storage(r.key.slice(6)), ...r.value }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* ------------------------------- 图片 --------------------------------- */

async function putImage_core_storage(blob, meta = {}) {
  if (!blob) throw new Error('图片数据为空');
  const aid = requireAccount_core_storage();
  const id = meta.id || uid('img');
  const record = {
    aid,
    id,
    blob,
    type: blob.type || 'image/png',
    size: blob.size || 0,
    width: meta.width || 0,
    height: meta.height || 0,
    kind: meta.kind || 'photo', // photo | sketch | drawing | background | fontPreview
    createdAt: Date.now(),
    name: meta.name || '',
  };
  if (storageBackend_core_storage !== 'idb') return fallbackStore_core_storage().putImage(aid, blob, record);
  const db = await backend_core_storage();
  await new Promise((resolve, reject) => {
    const t = db.transaction(STORE_ASSETS_core_storage, 'readwrite');
    t.objectStore(STORE_ASSETS_core_storage).put(record);
    t.oncomplete = resolve;
    t.onerror = () => reject(t.error);
  });
  return record;
}

async function getImage_core_storage(id) {
  if (!id) return null;
  const aid = requireAccount_core_storage();
  if (storageBackend_core_storage !== 'idb') return fallbackStore_core_storage().getImage(aid, id);
  const db = await backend_core_storage();
  const row = await new Promise((resolve, reject) => {
    const t = db.transaction(STORE_ASSETS_core_storage, 'readonly');
    const r = t.objectStore(STORE_ASSETS_core_storage).get([aid, id]);
    r.onsuccess = () => resolve(r.result || null);
    r.onerror = () => reject(r.error);
  });
  return row || null;
}

async function deleteImage_core_storage(id) {
  if (!id) return;
  const aid = requireAccount_core_storage();
  if (storageBackend_core_storage !== 'idb') { fallbackStore_core_storage().deleteImage(aid, id); return; }
  const db = await backend_core_storage();
  await new Promise((resolve, reject) => {
    const t = db.transaction(STORE_ASSETS_core_storage, 'readwrite');
    t.objectStore(STORE_ASSETS_core_storage).delete([aid, id]);
    t.oncomplete = resolve;
    t.onerror = () => reject(t.error);
  });
}

async function imageURL_core_storage(id) {
  const rec = await getImage_core_storage(id);
  if (!rec) return '';
  return URL.createObjectURL(rec.blob);
}

/** 清理没有被任何日记引用的图片 */
async function gcImages_core_storage() {
  const aid = requireAccount_core_storage();
  const entries = await listEntries_core_storage();
  const used = new Set();
  for (const e of entries) {
    for (const img of e.images || []) { used.add(img.id); if (img.thumbId) used.add(img.thumbId); }
    for (const d of e.drawings || []) if (d.imageId) used.add(d.imageId);
  }
  const settings = await settingsGet_core_storage();
  if (settings.bg?.imageId) used.add(settings.bg.imageId);
  let rows;
  if (storageBackend_core_storage !== 'idb') {
    rows = fallbackStore_core_storage().listImages(aid);
  } else {
    const db = await backend_core_storage();
    rows = await new Promise((resolve, reject) => {
      const t = db.transaction(STORE_ASSETS_core_storage, 'readonly');
      const r = t.objectStore(STORE_ASSETS_core_storage).index('aid').getAll(IDBKeyRange.only(aid));
      r.onsuccess = () => resolve(r.result || []);
      r.onerror = () => reject(r.error);
    });
  }
  let removed = 0;
  for (const row of rows) {
    if (row.kind === 'font' || row.kind === 'fontPreview') continue;
    if (!used.has(row.id)) { await deleteImage_core_storage(row.id); removed++; }
  }
  return removed;
}

/* ------------------------------ 字体资源 ------------------------------- */

async function putFont_core_storage({ name, family, dataUrl, blob, source = 'imported' }) {
  const aid = requireAccount_core_storage();
  const id = uid('font');
  const record = { aid, id, name, family, dataUrl: dataUrl || '', size: blob?.size || 0 };
  if (blob) await putImage_core_storage(blob, { id, kind: 'font', name });
  await vaultSet_core_storage(`font:${id}`, { ...record, source, createdAt: Date.now() });
  return record;
}

async function listFonts_core_storage() {
  const rows = await vaultAll_core_storage('font:');
  return rows.map((r) => r.value).filter(Boolean);
}

async function deleteFont_core_storage(id) {
  await vaultDel_core_storage(`font:${id}`);
  await deleteImage_core_storage(id);
}

/* --------------------------- 上锁状态（内存） --------------------------- */

/** 已解锁的密钥集合：{ entryDate: password }，仅存内存，刷新即失效 */
const unlockedKeys_core_storage = new Map();

function rememberUnlock_core_storage(dateKey, password) { unlockedKeys_core_storage.set(dateKey, password); }
function getUnlockedPassword_core_storage(dateKey) { return unlockedKeys_core_storage.get(dateKey) || null; }
function forgetUnlock_core_storage(dateKey) { unlockedKeys_core_storage.delete(dateKey); }
function lockVaultAll_core_storage() { unlockedKeys_core_storage.clear(); }
function isUnlocked_core_storage(dateKey) { return unlockedKeys_core_storage.has(dateKey); }

/** 重新抛出存储层初始化错误（供启动时诊断用） */
async function ensureStorageReady_core_storage() {
  await backend_core_storage();
  return storageInfo_core_storage();
}

/* --------------------------- 导入 / 导出备份 --------------------------- */

async function exportBackup_core_storage({ includeImages = true } = {}) {
  const account = await getAccount_core_storage(requireAccount_core_storage());
  const entries = await listEntries_core_storage();
  const settings = await settingsGet_core_storage();
  const fonts = await listFonts_core_storage();
  const payload = {
    app: '日记本',
    version: 1,
    exportedAt: new Date().toISOString(),
    account: { email: account.email, nickname: account.nickname },
    settings,
    fonts,
    entries,
    images: [],
  };
  if (includeImages) {
    const aid = requireAccount_core_storage();
    let rows;
    if (storageBackend_core_storage !== 'idb') {
      rows = fallbackStore_core_storage().listImages(aid).map((r) => ({ ...r, blob: null }));
      // 降级模式：图片已经是 data URL，直接带上
      for (const r of rows) payload.images.push({ id: r.id, type: r.type, kind: r.kind, width: r.width, height: r.height, dataUrl: r.dataUrl });
    } else {
      const db = await backend_core_storage();
      rows = await new Promise((resolve, reject) => {
        const t = db.transaction(STORE_ASSETS_core_storage, 'readonly');
        const r = t.objectStore(STORE_ASSETS_core_storage).index('aid').getAll(IDBKeyRange.only(aid));
        r.onsuccess = () => resolve(r.result || []);
        r.onerror = () => reject(r.error);
      });
      for (const row of rows) {
        const buf = new Uint8Array(await row.blob.arrayBuffer());
        payload.images.push({ id: row.id, type: row.type, kind: row.kind, width: row.width, height: row.height, data: bytesToB64(buf) });
      }
    }
  }
  return payload;
}

async function importBackup_core_storage(payload, { overwrite = true } = {}) {
  if (!payload || !Array.isArray(payload.entries)) throw new Error('备份文件格式不正确');
  for (const img of payload.images || []) {
    if (img.dataUrl) {
      // 来自降级模式的备份：直接还原 data URL 记录
      const bin = atob(String(img.dataUrl).split(',')[1] || '');
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      await putImage_core_storage(new Blob([bytes], { type: img.type || 'image/png' }), { id: img.id, type: img.type, kind: img.kind, width: img.width, height: img.height });
      continue;
    }
    const bytes = b64ToBytes(img.data);
    const blob = new Blob([bytes], { type: img.type || 'image/png' });
    await putImage_core_storage(blob, { id: img.id, type: img.type, kind: img.kind, width: img.width, height: img.height });
  }
  for (const entry of payload.entries) {
    const exist = await getEntry_core_storage(entry.date);
    if (exist && !overwrite) continue;
    await saveEntry_core_storage(entry);
  }
  if (payload.settings) await settingsSet_core_storage(payload.settings);
  return { entries: payload.entries.length, images: (payload.images || []).length };
}



return { "DEFAULT_SETTINGS": DEFAULT_SETTINGS_core_storage, "storageBackend": storageBackend_core_storage, "backendReason": backendReason_core_storage, "idbAvailable": idbAvailable_core_storage, "isFallbackMode": isFallbackMode_core_storage, "storageInfo": storageInfo_core_storage, "__setInjectedBackend": __setInjectedBackend_core_storage, "currentSession": currentSession_core_storage, "currentAccountId": currentAccountId_core_storage, "setSession": setSession_core_storage, "normalizeEmail": normalizeEmail_core_storage, "isValidEmail": isValidEmail_core_storage, "findAccountByEmail": findAccountByEmail_core_storage, "getAccount": getAccount_core_storage, "listAccounts": listAccounts_core_storage, "putAccount": putAccount_core_storage, "registerAccount": registerAccount_core_storage, "loginAccount": loginAccount_core_storage, "logout": logout_core_storage, "updateAccount": updateAccount_core_storage, "changePassword": changePassword_core_storage, "vaultGet": vaultGet_core_storage, "vaultSet": vaultSet_core_storage, "vaultDel": vaultDel_core_storage, "vaultKeys": vaultKeys_core_storage, "vaultAll": vaultAll_core_storage, "vaultClearAccount": vaultClearAccount_core_storage, "settingsGet": settingsGet_core_storage, "settingsSet": settingsSet_core_storage, "defaultSettings": defaultSettings_core_storage, "deepMerge": deepMerge_core_storage, "entryKey": entryKey_core_storage, "emptyEntry": emptyEntry_core_storage, "getEntry": getEntry_core_storage, "saveEntry": saveEntry_core_storage, "deleteEntry": deleteEntry_core_storage, "listEntryDates": listEntryDates_core_storage, "listEntries": listEntries_core_storage, "putImage": putImage_core_storage, "getImage": getImage_core_storage, "deleteImage": deleteImage_core_storage, "imageURL": imageURL_core_storage, "gcImages": gcImages_core_storage, "putFont": putFont_core_storage, "listFonts": listFonts_core_storage, "deleteFont": deleteFont_core_storage, "rememberUnlock": rememberUnlock_core_storage, "getUnlockedPassword": getUnlockedPassword_core_storage, "forgetUnlock": forgetUnlock_core_storage, "lockVaultAll": lockVaultAll_core_storage, "isUnlocked": isUnlocked_core_storage, "ensureStorageReady": ensureStorageReady_core_storage, "exportBackup": exportBackup_core_storage, "importBackup": importBackup_core_storage };
} };
/* ================= js/features/handwriting.js ================= */
__defs["js/features/handwriting.js"] = { exports: ["bytesToB64","htmlToText","HANDWRITING_PRESETS","getPreset","presetFontStack","registerFont","blobToDataUrl","isFontLoaded","htmlToRuns","renderHandwriting","renderFontCard","importFontFile","fontStackFor"], fn: function (module) {
var { "clamp": clamp, "htmlToText": htmlToText, "uid": uid, "bytesToB64": bytesToB64 } = __m("js/core/utils.js");
var { "canvasToBlob": canvasToBlob, "getCanvasSize": getCanvasSize } = __m("js/core/image-engine.js");
/* ==========================================================================
 * 日记本 App —— 手写字体引擎
 *  · 把输入的文字按选定「手写字体」渲染成手写稿（逐字抖动/倾斜/墨迹渗化）
 *  · 支持内置系统手写字体 + 用户导入的字体文件（TTF/OTF/WOFF）
 *  · 输出为图片，可插入日记当手写页；也用于字体预览卡片
 * ========================================================================== */




/* ---------------------------- 内置手写字体 ------------------------------ */

/** 第一代内置的「手写风格」字体栈：优先系统手写字体，缺失时自动降级 */
const HANDWRITING_PRESETS_features_handwriting = [
  {
    id: 'kai',
    name: '楷体手写',
    desc: '端正清秀，最接近日常钢笔字',
    stack: ['KaiTi', 'STKaiti', 'Kaiti SC', '楷体', 'LXGW WenKai', 'Noto Serif SC', 'serif'],
    slant: 1.5, sizeScale: 1, letterSpacing: 0.02,
  },
  {
    id: 'xingkai',
    name: '行楷连笔',
    desc: '带连笔的行楷，书写感强',
    stack: ['STXingkai', '华文行楷', 'Xingkai SC', 'KaiTi', '楷体', 'serif'],
    slant: 4, sizeScale: 1.02, letterSpacing: -0.01,
  },
  {
    id: 'xinwei',
    name: '新魏碑体',
    desc: '碑帖风格，硬朗有力',
    stack: ['STXinwei', '华文新魏', 'Xinwei SC', 'SimHei', '黑体', 'sans-serif'],
    slant: 0.5, sizeScale: 1.04, letterSpacing: 0.03,
  },
  {
    id: 'caiyun',
    name: '彩云手写',
    desc: '随性手写体，适合短句题记',
    stack: ['STCaiyun', '华文彩云', 'Caiyun SC', 'STXingkai', 'serif'],
    slant: 3, sizeScale: 1.05, letterSpacing: 0.05,
  },
  {
    id: 'heiti',
    name: '清爽黑体',
    desc: '现代简洁，电子手账风',
    stack: ['PingFang SC', 'HarmonyOS Sans SC', 'Microsoft YaHei', 'Heiti SC', 'sans-serif'],
    slant: 0, sizeScale: 1, letterSpacing: 0.01,
  },
  {
    id: 'songti',
    name: '宋刻印刷',
    desc: '书卷气，适合长文',
    stack: ['Songti SC', 'SimSun', '宋体', 'Noto Serif SC', 'serif'],
    slant: 0, sizeScale: 1, letterSpacing: 0.02,
  },
];

function getPreset_features_handwriting(id) {
  return HANDWRITING_PRESETS_features_handwriting.find((p) => p.id === id) || HANDWRITING_PRESETS_features_handwriting[0];
}

function presetFontStack_features_handwriting(id) {
  return getPreset_features_handwriting(id).stack.join(', ');
}

/** 用户导入的字体：通过 FontFace API 注册到文档 */
const loadedFonts_features_handwriting = new Map();

async function registerFont_features_handwriting({ family, dataUrl, blob }) {
  if (loadedFonts_features_handwriting.has(family)) return loadedFonts_features_handwriting.get(family);
  let src = dataUrl;
  if (!src && blob) {
    src = await blobToDataUrl_features_handwriting(blob);
  }
  if (!src) throw new Error('字体数据为空');
  const face = new FontFace(family, `url(${src})`);
  await face.load();
  document.fonts.add(face);
  loadedFonts_features_handwriting.set(family, face);
  return face;
}

function blobToDataUrl_features_handwriting(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function isFontLoaded_features_handwriting(family) { return loadedFonts_features_handwriting.has(family) || document.fonts.check(`16px "${family}"`); }

/* ------------------------------ 文本解析 ------------------------------- */

/** 把 HTML 日记正文拆成带样式的文本片段（只保留手写渲染需要的粗体/斜体/标题信息） */
function htmlToRuns_features_handwriting(html) {
  const container = document.createElement('div');
  container.innerHTML = String(html || '');
  const runs = [];

  const walk = (node, style) => {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent;
        if (text) runs.push({ text, ...style });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();
        if (tag === 'br') { runs.push({ text: '\n', ...style }); continue; }
        if (!child.textContent && tag !== 'img') continue;
        if (tag === 'img') {
          runs.push({ text: '［图片］', ...style, marker: 'image', src: child.getAttribute('src') || '' });
          continue;
        }
        const next = { ...style };
        if (['b', 'strong'].includes(tag)) next.bold = true;
        if (['i', 'em'].includes(tag)) next.italic = true;
        if (['u'].includes(tag)) next.underline = true;
        if (['h1', 'h2', 'h3'].includes(tag)) { next.heading = tag; next.bold = true; }
        walk(child, next);
        if (['p', 'div', 'h1', 'h2', 'h3', 'li', 'blockquote', 'tr'].includes(tag)) runs.push({ text: '\n', ...style });
      }
    }
  };
  walk(container, {});
  // 合并相邻同样式片段
  const merged = [];
  for (const run of runs) {
    const last = merged[merged.length - 1];
    if (last && !run.marker && !last.marker && last.bold === run.bold && last.italic === run.italic
      && last.underline === run.underline && last.heading === run.heading) {
      last.text += run.text;
    } else merged.push({ ...run });
  }
  return merged;
}

/* ------------------------------ 渲染核心 ------------------------------- */

function mulberry32_features_handwriting(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function paperBackground_features_handwriting(ctx, w, h, paper) {
  ctx.fillStyle = paper.color || '#fdfaf1';
  ctx.fillRect(0, 0, w, h);
  if (paper.lines) {
    ctx.strokeStyle = paper.lineColor || 'rgba(120,110,95,0.18)';
    ctx.lineWidth = 1;
    const gap = paper.lineGap || 34;
    for (let y = gap; y < h; y += gap) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
      ctx.stroke();
    }
  }
  if (paper.margin) {
    ctx.strokeStyle = paper.marginColor || 'rgba(190,90,90,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paper.margin + 0.5, 0);
    ctx.lineTo(paper.margin + 0.5, h);
    ctx.stroke();
  }
  if (paper.texture > 0) {
    const rnd = mulberry32_features_handwriting(97531);
    const count = Math.round(w * h * 0.00008 * paper.texture);
    ctx.fillStyle = 'rgba(120,100,80,0.05)';
    for (let i = 0; i < count; i++) ctx.fillRect(rnd() * w, rnd() * h, 1, 1);
  }
}

/**
 * 把手写文本渲染到画布
 * @param {string|Array} content HTML 字符串或 runs 数组
 * @param {object} options 见下方默认值
 * @returns {Promise<{canvas, blob, width, height, pages}>}
 */
async function renderHandwriting_features_handwriting(content, options = {}) {
  const {
    width = 1000,
    padding = 64,
    fontSize = 34,
    lineHeight = 1.75,
    fontStack = presetFontStack_features_handwriting('kai'),
    inkColor = '#20304a',
    jitter = 0.5,          // 0-1 逐字位置抖动
    slant = 2,             // 额外倾斜角度（度）
    inkBleed = 0.35,       // 0-1 墨迹渗化
    sizeScale = 1,
    letterSpacing = 0.02,
    paper = { color: '#fdfaf1', lines: false, lineGap: 34, margin: 0, texture: 0.35 },
    seed = Math.floor(Math.random() * 1e9),
    maxHeight = 4000,
    title = '',
    dateText = '',
  } = options;

  const runs = Array.isArray(content) ? content : htmlToRuns_features_handwriting(content);
  const rnd = mulberry32_features_handwriting(seed);

  const measureCanvas = document.createElement('canvas');
  const mctx = measureCanvas.getContext('2d');
  const innerWidth = width - padding * 2;
  const baseLine = Math.round(fontSize * lineHeight);

  const lines = [];
  let current = { items: [], width: 0, style: {} };
  let maxLineWidth = 0;

  const fontFor = (style, scale = sizeScale) => {
    const size = Math.round(fontSize * scale * (style.heading === 'h1' ? 1.5 : style.heading === 'h2' ? 1.28 : style.heading === 'h3' ? 1.12 : 1));
    const weight = style.bold ? '600' : '400';
    const italic = style.italic ? 'italic ' : '';
    return `${italic}${weight} ${size}px ${fontStack}`;
  };

  const pushLine = () => {
    lines.push(current);
    maxLineWidth = Math.max(maxLineWidth, current.width);
    current = { items: [], width: 0, style: current.style };
  };

  for (const run of runs) {
    const style = { bold: !!run.bold, italic: !!run.italic, underline: !!run.underline, heading: run.heading || null, marker: run.marker || null };
    mctx.font = fontFor(style);
    const spacing = fontSize * letterSpacing;
    const chunks = String(run.text).split(/(\n)/);
    for (const chunk of chunks) {
      if (chunk === '\n') { pushLine(); continue; }
      if (!chunk) continue;
      // 英文按单词聚合，中文按字
      const tokens = chunk.match(/[A-Za-z0-9'’\-_.@]+|\s+|[^\s]/g) || [];
      for (const token of tokens) {
        const w = mctx.measureText(token).width + spacing * token.length;
        if (current.width + w > innerWidth && current.items.length) pushLine();
        current.items.push({ text: token, style, width: w });
        current.width += w;
      }
    }
  }
  if (current.items.length) pushLine();

  const headerH = title ? Math.round(fontSize * 2.6) : (dateText ? Math.round(fontSize * 1.6) : 0);
  const contentH = lines.length * baseLine + 24;
  const height = clamp(Math.ceil(headerH + contentH + padding * 2), Math.round(fontSize * 6), maxHeight);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  paperBackground_features_handwriting(ctx, width, height, paper);
  ctx.textBaseline = 'alphabetic';

  let y = padding + (title ? fontSize * 2.1 : dateText ? fontSize * 1.25 : 0);

  if (title) {
    ctx.save();
    ctx.font = `600 ${Math.round(fontSize * 1.7)}px ${fontStack}`;
    ctx.fillStyle = inkColor;
    ctx.globalAlpha = 0.94;
    const off = (rnd() - 0.5) * jitter * 3;
    ctx.translate(padding + off, y);
    ctx.rotate(((rnd() - 0.5) * jitter * 1.2 + slant * 0.4) * Math.PI / 180);
    ctx.fillText(title, 0, 0);
    ctx.restore();
    y += fontSize * 0.9;
  }
  if (dateText) {
    ctx.save();
    ctx.font = `400 ${Math.round(fontSize * 0.62)}px ${fontStack}`;
    ctx.fillStyle = inkColor;
    ctx.globalAlpha = 0.6;
    ctx.fillText(dateText, padding, y);
    ctx.restore();
    y += fontSize * 0.75;
  }
  if (title || dateText) {
    ctx.strokeStyle = 'rgba(60,50,40,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, y + fontSize * 0.3);
    ctx.lineTo(width - padding, y + fontSize * 0.3);
    ctx.stroke();
    y += fontSize * 0.9;
  }

  const baseline0 = y + fontSize;
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const lineY = baseline0 + li * baseLine;
    let x = padding;
    // 整行的统一起伏，模拟手写基线不稳
    const lineWave = (rnd() - 0.5) * jitter * 3.4;
    for (const item of line.items) {
      ctx.font = fontFor(item.style);
      const jx = (rnd() - 0.5) * jitter * 2.6;
      const jy = lineWave + (rnd() - 0.5) * jitter * 2.2;
      const scale = 1 + (rnd() - 0.5) * jitter * 0.09;
      const rot = ((rnd() - 0.5) * jitter * 4 + slant) * Math.PI / 180;
      ctx.save();
      ctx.translate(x + jx, lineY + jy);
      ctx.rotate(rot);
      ctx.scale(scale, scale);
      // 墨迹渗化：用多层低透明度描边模拟
      ctx.fillStyle = inkColor;
      if (inkBleed > 0.02) {
        ctx.globalAlpha = clamp(0.18 * inkBleed, 0.03, 0.25);
        ctx.filter = 'blur(1px)';
        ctx.fillText(item.text, 0, 0);
        ctx.filter = 'none';
        ctx.globalAlpha = clamp(0.92 - inkBleed * 0.18, 0.6, 0.98);
      } else {
        ctx.globalAlpha = 0.94;
      }
      ctx.fillText(item.text, 0, 0);
      if (item.style.underline) {
        const w = ctx.measureText(item.text).width;
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = inkColor;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, fontSize * 0.16);
        ctx.lineTo(w, fontSize * 0.16);
        ctx.stroke();
      }
      ctx.restore();
      x += item.width;
    }
  }

  const blob = await canvasToBlob(canvas, 'image/png');
  const size = getCanvasSize(canvas);
  return { canvas, blob, width: size.width, height: size.height, lines: lines.length, seed };
}

/** 生成字体预览卡片（设置页用） */
async function renderFontCard_features_handwriting(preset, text = '今天也要好好写日记', options = {}) {
  const width = options.width || 720;
  const height = options.height || 220;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = options.background || '#fdfaf1';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(150,130,110,0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, width - 2, height - 2);

  const stack = Array.isArray(preset.stack) ? preset.stack.join(', ') : preset.stack;
  ctx.fillStyle = '#20304a';
  ctx.font = `400 40px ${stack}`;
  ctx.fillText(text.slice(0, 12), 32, 78);
  ctx.font = `400 22px ${stack}`;
  ctx.globalAlpha = 0.62;
  ctx.fillText(`${preset.name} · 1234567890 ABC`, 32, 122);
  ctx.globalAlpha = 0.45;
  ctx.font = `400 17px ${stack}`;
  ctx.fillText('春有百花秋有月，夏有凉风冬有雪', 32, 164);
  ctx.globalAlpha = 1;

  return canvasToBlob(canvas, 'image/jpeg', 0.85);
}

/* --------------------------- 手写字体资源包 ----------------------------- */

/**
 * 从字体文件导入自定义手写字体
 * 返回可用于 storage.putFont 的记录
 */
async function importFontFile_features_handwriting(file) {
  if (!file) throw new Error('未选择字体文件');
  const name = file.name.replace(/\.(ttf|otf|woff2?|ttc)$/i, '');
  const family = `UserFont_${name.replace(/[^\w\u4e00-\u9fff]/g, '')}_${uid('f').slice(-5)}`;
  const dataUrl = await blobToDataUrl_features_handwriting(file);
  await registerFont_features_handwriting({ family, dataUrl });
  return { name, family, dataUrl, size: file.size, source: 'imported' };
}

function fontStackFor_features_handwriting(settings, userFonts = []) {
  const styleId = settings?.handwriting?.styleId || 'kai';
  const preset = getPreset_features_handwriting(styleId);
  const userFamilies = userFonts.map((f) => `"${f.family}"`);
  const stacks = [...(styleId.startsWith('user:') ? [`"${styleId.slice(5)}"`] : []), ...userFamilies, ...preset.stack];
  return stacks.join(', ');
}



return { "bytesToB64": bytesToB64, "htmlToText": htmlToText, "HANDWRITING_PRESETS": HANDWRITING_PRESETS_features_handwriting, "getPreset": getPreset_features_handwriting, "presetFontStack": presetFontStack_features_handwriting, "registerFont": registerFont_features_handwriting, "blobToDataUrl": blobToDataUrl_features_handwriting, "isFontLoaded": isFontLoaded_features_handwriting, "htmlToRuns": htmlToRuns_features_handwriting, "renderHandwriting": renderHandwriting_features_handwriting, "renderFontCard": renderFontCard_features_handwriting, "importFontFile": importFontFile_features_handwriting, "fontStackFor": fontStackFor_features_handwriting };
} };
/* ================= js/features/ai.js ================= */
__defs["js/features/ai.js"] = { exports: ["SKETCH_PRESETS","renderHandwriting","htmlToRuns","localSketch","localHandwriting","AI_PROVIDERS","hasCloudAI","toSketch","toHandwriting","textToCardImage","tidyText"], fn: function (module) {
var { "sketchify": sketchify, "SKETCH_PRESETS": SKETCH_PRESETS } = __m("js/core/image-engine.js");
var { "renderHandwriting": renderHandwriting, "htmlToRuns": htmlToRuns, "presetFontStack": presetFontStack } = __m("js/features/handwriting.js");
var { "blobToDataUrl": blobToDataUrl, "htmlToText": htmlToText } = __m("js/features/handwriting.js");
/* ==========================================================================
 * 日记本 App —— AI 适配层
 *  第一代：内置「本地算法」引擎（无需联网、无需密钥，开箱可用）
 *  已预留云端接口：OpenAI / Anthropic / 自定义端点，填入 Key 即可切换
 * ========================================================================== */







/* ----------------------------- 本地引擎 -------------------------------- */

async function localSketch_features_ai(input, opts = {}, onProgress = null) {
  const preset = SKETCH_PRESETS.find((p) => p.id === (opts.presetId || 'pencil')) || SKETCH_PRESETS[0];
  const merged = { ...preset.opts, ...(opts.overrides || {}) };
  const started = Date.now();
  const result = await sketchify(input, { ...merged, progress: onProgress });
  return {
    ...result,
    engine: 'local',
    presetId: preset.id,
    presetName: preset.name,
    elapsed: Date.now() - started,
  };
}

async function localHandwriting_features_ai(content, opts = {}) {
  const started = Date.now();
  const result = await renderHandwriting(content, { fontStack: opts.fontStack || presetFontStack('kai'), ...opts });
  return { ...result, engine: 'local', elapsed: Date.now() - started };
}

/* ---------------------------- 云端接口（预留） --------------------------- */

const AI_PROVIDERS_features_ai = [
  { id: 'local', name: '本地算法（推荐，离线可用）', needsKey: false, note: '设备端计算，照片不会离开手机' },
  { id: 'openai', name: 'OpenAI 兼容接口', needsKey: true, defaultEndpoint: 'https://api.openai.com/v1', defaultModel: 'gpt-image-1', note: '需自备 API Key' },
  { id: 'anthropic', name: 'Anthropic Claude', needsKey: true, defaultEndpoint: 'https://api.anthropic.com/v1', defaultModel: 'claude-sonnet-4-5', note: '需自备 API Key' },
  { id: 'custom', name: '自建/自定端点', needsKey: true, defaultEndpoint: '', defaultModel: '', note: '填写你自己的 HTTP 接口' },
];

function hasCloudAI_features_ai(config = {}) {
  return config.provider && config.provider !== 'local' && !!config.endpoint;
}

/**
 * 云端素描转换（预留实现）
 * 约定：请求体 { task:'sketch', image: dataURL, options }；响应 { image: dataURL } 或 { url }
 */
async function cloudSketch_features_ai(input, config, opts = {}) {
  const dataUrl = input instanceof Blob ? await blobToDataUrl(input) : String(input);
  const endpoint = config.endpoint.replace(/\/$/, '');
  const headers = { 'Content-Type': 'application/json' };
  let body;

  if (config.provider === 'anthropic') {
    headers['x-api-key'] = config.apiKey;
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
    body = JSON.stringify({
      model: config.model || 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: '把这张照片转成干净的手绘铅笔素描线稿，保持构图与主要细节，只输出图片。' },
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: dataUrl.split(',')[1] } },
        ],
      }],
    });
  } else {
    if (config.apiKey) headers.Authorization = `Bearer ${config.apiKey}`;
    body = JSON.stringify({
      task: 'sketch',
      model: config.model || 'gpt-image-1',
      image: dataUrl,
      options: { style: opts.presetId || 'pencil', strength: opts.strength ?? 0.6 },
    });
  }

  const res = await fetch(endpoint, { method: 'POST', headers, body });
  if (!res.ok) throw new Error(`云端 AI 返回 ${res.status}：${(await res.text()).slice(0, 180)}`);
  const json = await res.json();
  const out = json.image || json.dataURL || json.url || json.data?.[0]?.b64_json || json.content?.[0]?.text;
  if (!out) throw new Error('云端 AI 未返回可用图片');
  return { blob: await urlToBlob_features_ai(out.startsWith('data:') || out.startsWith('http') ? out : `data:image/png;base64,${out}`), engine: config.provider };
}

async function urlToBlob_features_ai(url) {
  const res = await fetch(url);
  return res.blob();
}

/* ---------------------------- 统一对外接口 ------------------------------ */

/**
 * 图片 → 素描
 * @param {Blob|HTMLImageElement} input
 * @param {object} config settings.ai
 * @param {object} opts { presetId, overrides, onProgress }
 */
async function toSketch_features_ai(input, config = {}, opts = {}) {
  const provider = config.provider || 'local';
  if (provider !== 'local') {
    try {
      return await cloudSketch_features_ai(input, config, opts);
    } catch (err) {
      console.warn('[AI] 云端转换失败，回退本地算法：', err.message);
      const local = await localSketch_features_ai(input, opts, opts.onProgress);
      return { ...local, fallbackReason: err.message };
    }
  }
  return localSketch_features_ai(input, opts, opts.onProgress);
}

/**
 * 文字 → 手写稿
 * @param {string} html 富文本正文
 * @param {object} config settings.handwriting / settings.ai
 * @param {object} opts 传给渲染引擎
 */
async function toHandwriting_features_ai(html, config = {}, opts = {}) {
  const plain = htmlToText(html);
  if (!plain) throw new Error('还没有内容可以转换');
  return localHandwriting_features_ai(html, {
    fontStack: opts.fontStack || presetFontStack(config.styleId || 'kai'),
    jitter: config.jitter ?? 0.5,
    slant: config.slant ?? 2,
    inkBleed: config.inkBleed ?? 0.35,
    sizeScale: config.sizeScale ?? 1,
    ...opts,
  });
}

/** 用文字生成一张「题记卡」图片（可做日记插图或背景） */
async function textToCardImage_features_ai(text, opts = {}) {
  const {
    width = 900,
    fontStack = presetFontStack('kai'),
    background = '#fdfaf1',
    inkColor = '#20304a',
    fontSize = 46,
    padding = 70,
  } = opts;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  const lines = String(text).split(/\n/).flatMap((l) => wrap_features_ai(l, 14));
  canvas.height = Math.max(300, padding * 2 + lines.length * fontSize * 1.7);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(120,100,80,0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);
  ctx.fillStyle = inkColor;
  ctx.font = `400 ${fontSize}px ${fontStack}`;
  ctx.textBaseline = 'top';
  lines.forEach((line, i) => {
    ctx.fillText(line, padding, padding + i * fontSize * 1.7);
  });
  const { canvasToBlob } = await __m("js/core/image-engine.js");
  const blob = await canvasToBlob(canvas, 'image/png');
  return { blob, canvas };
}

function wrap_features_ai(text, per) {
  const out = [];
  for (let i = 0; i < text.length; i += per) out.push(text.slice(i, i + per));
  return out.length ? out : [''];
}

/** 简易「AI 润色」占位：本地做排版优化（去多余空行、统一标点），云端可替换 */
function tidyText_features_ai(html) {
  return String(html)
    .replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/，{2,}/g, '，')
    .replace(/。{2,}/g, '。')
    .replace(/\n{3,}/g, '\n\n');
}



return { "SKETCH_PRESETS": SKETCH_PRESETS, "renderHandwriting": renderHandwriting, "htmlToRuns": htmlToRuns, "localSketch": localSketch_features_ai, "localHandwriting": localHandwriting_features_ai, "AI_PROVIDERS": AI_PROVIDERS_features_ai, "hasCloudAI": hasCloudAI_features_ai, "toSketch": toSketch_features_ai, "toHandwriting": toHandwriting_features_ai, "textToCardImage": textToCardImage_features_ai, "tidyText": tidyText_features_ai };
} };
/* ================= js/features/audio.js ================= */
__defs["js/features/audio.js"] = { exports: ["unlockAudio","pageFlipSound","lockSound","successSound","vibrate","haptics"], fn: function (module) {

/* ==========================================================================
 * 日记本 · 氛围模块（翻页音效 + 震动反馈）
 *  音效用 WebAudio 实时合成，不依赖任何音频文件，完全离线
 * ========================================================================== */

let audioCtx_features_audio = null;

function ctx_features_audio() {
  if (!audioCtx_features_audio) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx_features_audio = new AC();
  }
  if (audioCtx_features_audio.state === 'suspended') audioCtx_features_audio.resume().catch(() => {});
  return audioCtx_features_audio;
}

/** 需要用户手势后才能播放，启动时调用一次解锁 */
function unlockAudio_features_audio() {
  const c = ctx_features_audio();
  if (!c) return;
  if (c.state === 'suspended') c.resume().catch(() => {});
}

/** 纸张翻页：两段滤波噪声，先「唰」后「啪」 */
function pageFlipSound_features_audio(volume = 0.35) {
  const c = ctx_features_audio();
  if (!c) return;
  const duration = 0.44;
  const buffer = c.createBuffer(1, Math.ceil(c.sampleRate * duration), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    // 先强后弱，尾巴上带一点轻响
    const env = Math.exp(-t * 5.2) * (1 - t) + Math.exp(-Math.abs(t - 0.82) * 46) * 0.5;
    data[i] = (Math.random() * 2 - 1) * env;
  }
  const src = c.createBufferSource();
  src.buffer = buffer;

  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(1400, c.currentTime);
  lp.frequency.exponentialRampToValueAtTime(4200, c.currentTime + 0.18);
  lp.frequency.exponentialRampToValueAtTime(900, c.currentTime + duration);

  const hp = c.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 320;

  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), c.currentTime + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);

  src.connect(hp).connect(lp).connect(gain).connect(c.destination);
  src.start();
  src.stop(c.currentTime + duration + 0.02);
}

/** 上锁：轻微的「咔嗒」 */
function lockSound_features_audio(volume = 0.3) {
  const c = ctx_features_audio();
  if (!c) return;
  const osc = c.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(180, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(90, c.currentTime + 0.08);
  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.12);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.14);
}

/** 成功提示音（保存 / 解锁） */
function successSound_features_audio(volume = 0.22) {
  const c = ctx_features_audio();
  if (!c) return;
  [660, 990].forEach((f, i) => {
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;
    const gain = c.createGain();
    const start = c.currentTime + i * 0.08;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.24);
    osc.connect(gain).connect(c.destination);
    osc.start(start);
    osc.stop(start + 0.26);
  });
}

/** 震动 */
function vibrate_features_audio(pattern = 12, enabled = true) {
  if (!enabled) return;
  try { navigator.vibrate?.(pattern); } catch { /* ignore */ }
}

const haptics_features_audio = {
  light: () => vibrate_features_audio(10),
  medium: () => vibrate_features_audio(18),
  success: () => vibrate_features_audio([12, 40, 18]),
  error: () => vibrate_features_audio([26, 60, 26]),
};

return { "unlockAudio": unlockAudio_features_audio, "pageFlipSound": pageFlipSound_features_audio, "lockSound": lockSound_features_audio, "successSound": successSound_features_audio, "vibrate": vibrate_features_audio, "haptics": haptics_features_audio };
} };
/* ================= js/features/export.js ================= */
__defs["js/features/export.js"] = { exports: ["escapeHtml","safeFileName","htmlToText","countWords","crc32","ZipWriter","buildDocx","loadPdfFont","parseTrueType","probeImageSize","PDFDocument","buildDiaryPDF","splitBody","buildMailto","shareFile"], fn: function (module) {
var { "escapeHtml": escapeHtml, "safeFileName": safeFileName, "htmlToText": htmlToText, "countWords": countWords } = __m("js/core/utils.js");
var { "getImage": getImage } = __m("js/core/storage.js");
var { "hexToRgb": hexToRgb } = __m("js/core/image-engine.js");
var { "TrueTypeFont": TrueTypeFont } = __m("js/core/font-subset.js");
/* ==========================================================================
 * 日记本 · 文档导出
 *  · Word(.docx)：手写 WordprocessingML + 自研 ZIP 打包（CompressionStream 压缩）
 *  · PDF：自研 PDF 生成器（内嵌系统 TrueType 字体子集，中文不乱码）
 *  · 邮件发送：系统分享面板 / mailto 打开邮件客户端
 * ========================================================================== */






/* ============================ 1. ZIP 打包 ============================== */

const CRC_TABLE_features_export = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32_features_export(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE_features_export[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

async function deflateRaw_features_export(bytes) {
  if (typeof CompressionStream === 'undefined') return null;
  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch { return null; }
}

/** 极简 ZIP 写入器（压缩或存储） */
class ZipWriter_features_export {
  constructor() { this.entries = []; }

  async add(name, data, { compress = true } = {}) {
    const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : (data instanceof Uint8Array ? data : new Uint8Array(data));
    const crc = crc32_features_export(bytes);
    let method = 0;
    let payload = bytes;
    if (compress) {
      const packed = await deflateRaw_features_export(bytes);
      if (packed && packed.length < bytes.length) { method = 8; payload = packed; }
    }
    this.entries.push({ name, bytes, payload, method, crc, size: bytes.length, compressedSize: payload.length });
  }

  async blob(mime = 'application/zip') {
    const chunks = [];
    const central = [];
    let offset = 0;
    const enc = new TextEncoder();
    const d = new Date();
    const dosTime = ((d.getHours() & 0x1f) << 11) | ((d.getMinutes() & 0x3f) << 5) | ((d.getSeconds() / 2) & 0x1f);
    const dosDate = (((d.getFullYear() - 1980) & 0x7f) << 9) | (((d.getMonth() + 1) & 0x0f) << 5) | (d.getDate() & 0x1f);

    for (const e of this.entries) {
      const nameBytes = enc.encode(e.name);
      const local = new Uint8Array(30 + nameBytes.length);
      const dv = new DataView(local.buffer);
      dv.setUint32(0, 0x04034b50, true);
      dv.setUint16(4, 20, true);
      dv.setUint16(6, 0x0800, true);
      dv.setUint16(8, e.method, true);
      dv.setUint16(10, dosTime, true);
      dv.setUint16(12, dosDate, true);
      dv.setUint32(14, e.crc, true);
      dv.setUint32(18, e.compressedSize, true);
      dv.setUint32(22, e.size, true);
      dv.setUint16(26, nameBytes.length, true);
      dv.setUint16(28, 0, true);
      local.set(nameBytes, 30);
      chunks.push(local, e.payload);

      const cd = new Uint8Array(46 + nameBytes.length);
      const cv = new DataView(cd.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true);
      cv.setUint16(10, e.method, true);
      cv.setUint16(12, dosTime, true);
      cv.setUint16(14, dosDate, true);
      cv.setUint32(16, e.crc, true);
      cv.setUint32(20, e.compressedSize, true);
      cv.setUint32(24, e.size, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint32(42, offset, true);
      cd.set(nameBytes, 46);
      central.push(cd);
      offset += local.length + e.payload.length;
    }

    const centralSize = central.reduce((a, c) => a + c.length, 0);
    const end = new Uint8Array(22);
    const ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(8, this.entries.length, true);
    ev.setUint16(10, this.entries.length, true);
    ev.setUint32(12, centralSize, true);
    ev.setUint32(16, offset, true);

    return new Blob([...chunks, ...central, end], { type: mime });
  }
}

/* ============================ 2. Word 导出 ============================= */

const xmlEsc_features_export = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;')
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');

const CONTENT_TYPES_features_export = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="png" ContentType="image/png"/>
<Default Extension="jpeg" ContentType="image/jpeg"/>
<Default Extension="jpg" ContentType="image/jpeg"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

const ROOT_RELS_features_export = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

function stylesXml_features_export(fontName, fontSize) {
  const sz = Math.round(fontSize * 2);
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr>
<w:rFonts w:ascii="${xmlEsc_features_export(fontName)}" w:eastAsia="${xmlEsc_features_export(fontName)}" w:hAnsi="${xmlEsc_features_export(fontName)}"/>
<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>
</w:rPr></w:rPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/>
<w:pPr><w:jc w:val="center"/><w:spacing w:before="240" w:after="120"/></w:pPr>
<w:rPr><w:b/><w:sz w:val="${Math.round(fontSize * 1.9 * 2)}"/></w:rPr></w:style>
</w:styles>`;
}

/** 富文本 HTML → Word 段落数组 */
function htmlToParagraphs_features_export(html) {
  const container = document.createElement('div');
  container.innerHTML = String(html || '');
  const paras = [];
  const flushInline = (node) => {
    const runs = [];
    const walk = (n, style) => {
      for (const child of n.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          const t = child.textContent.replace(/\u00a0/g, ' ');
          if (t) runs.push({ text: t, ...style });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const tag = child.tagName.toLowerCase();
          if (tag === 'br') { runs.push({ text: '\n', ...style }); continue; }
          if (tag === 'img') { paras.push({ image: child.getAttribute('src') }); continue; }
          const next = { ...style };
          if (['b', 'strong'].includes(tag)) next.bold = true;
          if (['i', 'em'].includes(tag)) next.italic = true;
          if (tag === 'u') next.underline = true;
          if (tag === 'span' && child.style.color) next.color = child.style.color;
          walk(child, next);
        }
      }
    };
    walk(node, {});
    if (runs.some((r) => r.text.trim())) paras.push({ runs });
  };

  const blockTags = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'LI', 'BLOCKQUOTE', 'TR', 'SECTION', 'ARTICLE', 'FIGURE']);
  const children = Array.from(container.childNodes);
  if (!children.some((c) => c.nodeType === 1 && blockTags.has(c.tagName))) {
    flushInline(container);
  } else {
    for (const child of children) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.textContent.trim()) paras.push({ runs: [{ text: child.textContent }] });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();
        if (tag === 'img') { paras.push({ image: child.getAttribute('src') }); continue; }
        if (tag === 'hr') { paras.push({ divider: true }); continue; }
        if (tag === 'figure' || tag === 'div') {
          const img = child.querySelector?.('img');
          if (img) { paras.push({ image: img.getAttribute('src') }); continue; }
        }
        if (['h1', 'h2', 'h3'].includes(tag)) { flushInline(child); if (paras.length) paras[paras.length - 1].heading = tag; }
        else if (tag === 'ul' || tag === 'ol') {
          for (const li of child.querySelectorAll('li')) {
            const text = li.textContent.trim();
            if (text) paras.push({ runs: [{ text: `· ${text}` }] });
          }
        } else flushInline(child);
      }
    }
  }
  return paras;
}

function runsXml_features_export(runs, { inkColor = '20304a' } = {}) {
  let xml = '';
  const lines = [[]];
  for (const r of runs) {
    const parts = String(r.text).split('\n');
    parts.forEach((p, i) => {
      if (i > 0) lines.push([]);
      if (p) lines[lines.length - 1].push({ ...r, text: p });
    });
  }
  lines.forEach((lineRuns, li) => {
    if (li > 0) xml += '<w:r><w:br/></w:r>';
    for (const r of lineRuns) {
      const props = [];
      if (r.bold) props.push('<w:b/>');
      if (r.italic) props.push('<w:i/>');
      if (r.underline) props.push('<w:u w:val="single"/>');
      if (r.color) {
        const { r: cr, g: cg, b: cb } = hexToRgb(r.color);
        props.push(`<w:color w:val="${[cr, cg, cb].map((v) => v.toString(16).padStart(2, '0')).join('')}"/>`);
      }
      xml += `<w:r>${props.length ? `<w:rPr>${props.join('')}</w:rPr>` : `<w:rPr><w:color w:val="${inkColor}"/></w:rPr>`}<w:t xml:space="preserve">${xmlEsc_features_export(r.text)}</w:t></w:r>`;
    }
  });
  return xml;
}

/**
 * 生成 Word 文档
 * @param {Array} entries
 * @param {object} options { fontName, fontSize, includeImages, includeWeather, title, author, imagesResolver }
 */
async function buildDocx_features_export(entries, options = {}) {
  const {
    fontName = '楷体',
    fontSize = 12,
    includeImages = true,
    includeWeather = true,
    title = '我的日记本',
    author = '',
    pageBreakPerEntry = true,
    imagesResolver = getImage,
  } = options;

  const zip = new ZipWriter_features_export();
  const media = [];
  let doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
 xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
<w:body>`;

  doc += `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="480" w:after="240"/></w:pPr>
    <w:r><w:rPr><w:b/><w:sz w:val="${fontSize * 4}"/></w:rPr><w:t xml:space="preserve">${xmlEsc_features_export(title)}</w:t></w:r></w:p>`;
  if (author) {
    doc += `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="480"/></w:pPr><w:r><w:rPr><w:sz w:val="${fontSize * 2}"/></w:rPr><w:t xml:space="preserve">${xmlEsc_features_export(author)}</w:t></w:r></w:p>`;
  }
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? -1 : 1));
  if (sorted.length) {
    doc += `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="${fontSize * 2}"/></w:rPr><w:t xml:space="preserve">${xmlEsc_features_export(`${sorted[0].date} 至 ${sorted[sorted.length - 1].date} · 共 ${sorted.length} 篇`)}</w:t></w:r></w:p>`;
  }

  const pushMedia = async (blob, baseName, rec = {}) => {
    const ext = (blob.type || 'image/png').includes('jpeg') || (blob.type || '').includes('jpg') ? 'jpeg' : 'png';
    const name = `media/${baseName}${media.length + 1}.${ext}`;
    media.push({
      name,
      bytes: new Uint8Array(await blob.arrayBuffer()),
      relId: `rIdImg${media.length + 1}`,
      width: rec.width || 600,
      height: rec.height || 400,
    });
    return media[media.length - 1];
  };

  for (const entry of sorted) {
    if (pageBreakPerEntry) doc += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
    const heading = entry.title?.trim() || `${entry.date} 的日记`;
    doc += `<w:p><w:pPr><w:spacing w:before="360" w:after="80"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="${fontSize * 3}"/></w:rPr><w:t xml:space="preserve">${xmlEsc_features_export(heading)}</w:t></w:r></w:p>`;
    const metaParts = [entry.date];
    if (includeWeather && entry.weather) {
      metaParts.push(`${entry.weather.city || ''} ${entry.weather.text || ''} ${entry.weather.temp != null ? `${entry.weather.temp}℃` : ''}`.trim());
    }
    if (entry.mood) metaParts.push(`心情：${entry.mood}`);
    if (entry.location) metaParts.push(entry.location);
    doc += `<w:p><w:pPr><w:spacing w:after="200"/></w:pPr><w:r><w:rPr><w:sz w:val="${fontSize * 1.6}"/><w:color w:val="888888"/></w:rPr><w:t xml:space="preserve">${xmlEsc_features_export(metaParts.filter(Boolean).join('  ·  '))}</w:t></w:r></w:p>`;

    for (const p of htmlToParagraphs_features_export(entry.body || '')) {
      if (p.image) {
        if (!includeImages) continue;
        const idMatch = /img:\/\/([^"')]+)/.exec(p.image);
        if (!idMatch) continue;
        const rec = await imagesResolver(idMatch[1]).catch(() => null);
        if (!rec) continue;
        doc += imageParagraph_features_export(await pushMedia(rec.blob, 'image', rec));
        continue;
      }
      if (p.divider) {
        doc += '<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:color="CCCCCC"/></w:pBdr></w:pPr></w:p>';
        continue;
      }
      const headingProps = p.heading ? '<w:spacing w:before="240" w:after="100"/>' : '<w:spacing w:after="120" w:line="360" w:lineRule="auto"/>';
      doc += `<w:p><w:pPr>${headingProps}<w:ind w:firstLine="${fontSize * 2 * 9}"/></w:pPr>${runsXml_features_export(p.runs)}</w:p>`;
    }

    // 手写图层：整张图片插入
    for (const d of entry.drawings || []) {
      if (!includeImages || !d.imageId) continue;
      const rec = await imagesResolver(d.imageId).catch(() => null);
      if (!rec) continue;
      doc += imageParagraph_features_export(await pushMedia(rec.blob, 'hand', rec));
    }
  }

  doc += `<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="851" w:footer="992" w:gutter="0"/></w:sectPr>`;
  doc += '</w:body></w:document>';

  await zip.add('[Content_Types].xml', CONTENT_TYPES_features_export);
  await zip.add('_rels/.rels', ROOT_RELS_features_export);
  await zip.add('word/document.xml', doc);
  await zip.add('word/styles.xml', stylesXml_features_export(fontName, fontSize));
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${media.map((m) => `<Relationship Id="${m.relId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${m.name.replace('word/', '')}"/>`).join('\n')}
</Relationships>`;
  await zip.add('word/_rels/document.xml.rels', rels);
  for (const m of media) await zip.add(m.name, m.bytes, { compress: false });

  return zip.blob('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
}

function imageParagraph_features_export(media) {
  const ratio = media.height && media.width ? media.height / media.width : 0.75;
  const w = 480;
  const h = Math.round(w * ratio);
  return `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="160"/></w:pPr>
  <w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">
    <wp:extent cx="${w * 9525}" cy="${h * 9525}"/>
    <wp:docPr id="${Math.floor(Math.random() * 10000)}" name="Picture"/>
    <a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
      <pic:pic><pic:nvPicPr><pic:cNvPr id="0" name="image"/><pic:cNvPicPr/></pic:nvPicPr>
      <pic:blipFill><a:blip r:embed="${media.relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
      <pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${w * 9525}" cy="${h * 9525}"/></a:xfrm>
      <a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>
    </a:graphicData></a:graphic>
  </wp:inline></w:drawing></w:r></w:p>`;
}

/* ============================= 3. PDF 导出 ============================= */

/** 内嵌中文字体：默认读取 assets/fonts/pdf-cjk.ttf（由 tools/make-pdf-font.mjs 生成） */
let cachedFont_features_export = null;
let cachedFontPromise_features_export = null;

/**
 * 读取字体字节。优先用内联字体（__RIJI_PDF_FONT__）：
 * 单文件版 / 双击 index.html 时无法 fetch 本地文件（file:// 下 fetch 被禁），
 * 所以把字体以 base64 内联进 HTML，这里直接解码，不发起任何请求。
 */
function readInlinedFont_features_export() {
  const inline = globalThis.__RIJI_PDF_FONT__;
  if (!inline) return null;
  try {
    if (inline instanceof ArrayBuffer) return inline;
    if (inline instanceof Uint8Array) return inline.buffer.slice(inline.byteOffset, inline.byteOffset + inline.byteLength);
    // data:font/ttf;base64,xxxx
    const b64 = String(inline).split(',')[1] || '';
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  } catch (err) {
    console.warn('[日记本] 内联字体解析失败，回退到请求字体文件', err);
    return null;
  }
}

function loadPdfFont_features_export(url = 'assets/fonts/pdf-cjk.ttf') {
  if (cachedFont_features_export) return Promise.resolve(cachedFont_features_export);
  if (cachedFontPromise_features_export) return cachedFontPromise_features_export;

  const inlined = readInlinedFont_features_export();
  if (inlined) {
    try {
      cachedFont_features_export = new TrueTypeFont(inlined);
      cachedFontPromise_features_export = Promise.resolve(cachedFont_features_export);
      return cachedFontPromise_features_export;
    } catch (err) {
      console.warn('[日记本] 内联字体不可用，回退到请求字体文件', err);
    }
  }

  cachedFontPromise_features_export = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`字体加载失败 ${res.status}`);
      return res.arrayBuffer();
    })
    .then((buf) => { cachedFont_features_export = new TrueTypeFont(buf); return cachedFont_features_export; })
    .catch((err) => { cachedFontPromise_features_export = null; throw err; });
  return cachedFontPromise_features_export;
}

function parseTrueType_features_export(buffer) { return new TrueTypeFont(buffer); }

/** 探测 JPEG/PNG 像素尺寸（PDF 的 Image XObject 需要真实宽高） */
function probeImageSize_features_export(bytes, mimeOrIsJpeg = 'image/jpeg') {
  const isJpeg = typeof mimeOrIsJpeg === 'boolean' ? mimeOrIsJpeg : !/png/i.test(String(mimeOrIsJpeg));
  try {
    if (!isJpeg) {
      if (bytes.length >= 24) {
        const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        return { width: v.getUint32(16), height: v.getUint32(20) };
      }
    } else {
      let p = 2;
      while (p + 9 < bytes.length) {
        if (bytes[p] !== 0xff) { p++; continue; }
        const marker = bytes[p + 1];
        const len = (bytes[p + 2] << 8) | bytes[p + 3];
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return { width: (bytes[p + 7] << 8) | bytes[p + 8], height: (bytes[p + 5] << 8) | bytes[p + 6] };
        }
        p += 2 + len;
      }
    }
  } catch { /* 探测失败用默认值 */ }
  return { width: 1000, height: 1000 };
}

/** ToUnicode CMap（分块，每块最多 100 条，符合 PDF 规范） */
function buildToUnicodeCMap_features_export(codes) {
  const list = codes.filter((c) => c > 0 && c <= 0xffff).sort((a, b) => a - b);
  const chunks = [];
  for (let i = 0; i < list.length; i += 100) chunks.push(list.slice(i, i + 100));
  const body = chunks.map((chunk) => `${chunk.length} beginbfchar
${chunk.map((c) => `<${c.toString(16).padStart(4, '0')}> <${c.toString(16).padStart(4, '0')}>`).join('\n')}
endbfchar`).join('\n');
  return `/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def
/CMapName /Adobe-Identity-UCS def
/CMapType 2 def
1 begincodespacerange
<0000> <FFFF>
endcodespacerange
${body}
endcmap
CMapName currentdict /CMap defineresource pop
end
end`;
}

/** 简易 PDF 生成器：页面坐标从左上角起算，支持内嵌中文 TrueType 子集 */
class PDFDocument_features_export {
  constructor({ width = 595.28, height = 841.89, font = null, fontName = 'F1' } = {}) {
    this.width = width;
    this.height = height;
    this.font = font;
    this.fontName = fontName;
    this.pages = [];
    this.page = null;
    this.usedCodes = new Set();
    this.newPage();
  }

  static A4 = { width: 595.28, height: 841.89 };
  static A5 = { width: 419.53, height: 595.28 };

  newPage() {
    this.page = { ops: [], images: [] };
    this.pages.push(this.page);
    return this.page;
  }

  _op(str) { this.page.ops.push(str); }

  toBottom(y) { return this.height - y; }

  text(content, x, y, { size = 12, color = [0.13, 0.16, 0.23], charSpace = 0 } = {}) {
    const chars = Array.from(String(content)).filter((c) => c !== '\r' && c !== '\n' && c !== '\t');
    if (!chars.length) return;
    const hexParts = [];
    for (const ch of chars) {
      const cp = ch.codePointAt(0);
      if (cp > 0xffff) continue; // 补充平面字符暂不内嵌
      this.usedCodes.add(cp);
      hexParts.push(cp.toString(16).padStart(4, '0'));
    }
    if (!hexParts.length) return;
    this._op(`BT ${color[0].toFixed(3)} ${color[1].toFixed(3)} ${color[2].toFixed(3)} rg /${this.font ? this.fontName : 'F0'} ${size} Tf ${charSpace} Tc 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm <${hexParts.join('')}> Tj ET`);
  }

  line(x1, y1, x2, y2, { width = 0.7, color = [0.75, 0.72, 0.68] } = {}) {
    this._op(`${color[0]} ${color[1]} ${color[2]} RG ${width} w [] 0 d ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  }

  rect(x, y, w, h, { fill = null, stroke = null, width = 0.7 } = {}) {
    if (fill) this._op(`${fill[0]} ${fill[1]} ${fill[2]} rg ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);
    if (stroke) this._op(`${stroke[0]} ${stroke[1]} ${stroke[2]} RG ${width} w ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S`);
  }

  /** 插入图片（y 为页面顶部起算的坐标） */
  async image(blob, x, y, w, h, { name } = {}) {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const isJpeg = /jpe?g/i.test(blob.type || name || '');
    const { width: pxW, height: pxH } = probeImageSize_features_export(bytes, isJpeg);    const total = this.pages.reduce((a, p) => a + p.images.length, 0) + 1;
    const img = { bytes, isJpeg, width: w, height: h, x, y, pxWidth: pxW, pxHeight: pxH, ref: `Im${total}`, objNum: 0 };
    const dy = this.height - y - h;
    this.page.images.push(img);
    this._op(`q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${dy.toFixed(2)} cm /${img.ref} Do Q`);
    return img;
  }

  build() {
    const enc = (s) => new TextEncoder().encode(s);
    const objects = [];
    const usedCodes = [...this.usedCodes].sort((a, b) => a - b);
    const hasFont = !!this.font;

    const subset = hasFont ? this.font.subset(usedCodes) : null;

    const catalogNum = 1;
    const pagesNum = 2;
    const fontNum = 3;
    const fontFileNum = hasFont ? 4 : null;
    const descendantNum = hasFont ? 5 : null;
    const toUnicodeNum = hasFont ? 6 : null;
    const descNum = hasFont ? 7 : null;

    const contentNums = [];
    let cursor = hasFont ? 8 : 4;
    this.pages.forEach((p) => {
      contentNums.push(cursor++);
      for (const img of p.images) img.objNum = cursor++;
    });
    const pageNums = this.pages.map(() => cursor++);

    const addObject = (num, data) => { objects[num - 1] = data; };

    addObject(catalogNum, `<< /Type /Catalog /Pages ${pagesNum} 0 R >>`);
    addObject(pagesNum, `<< /Type /Pages /Count ${this.pages.length} /Kids [${pageNums.map((n) => `${n} 0 R`).join(' ')}] >>`);

    if (hasFont) {
      // 字体程序：子集 TTF，FlateDecode 压缩（若浏览器支持）
      const raw = subset.data;
      const head = `<< /Length ${raw.length} /Length1 ${raw.length} >>\nstream\n`;
      addObject(fontFileNum, { raw: [enc(head), raw, enc('\nendstream')] });

      const cmapStream = enc(buildToUnicodeCMap_features_export(usedCodes));
      addObject(toUnicodeNum, { raw: [enc(`<< /Length ${cmapStream.length} >>\nstream\n`), cmapStream, enc('\nendstream')] });

      const widths = usedCodes
        .map((c) => `${c} [${Math.round(this.font.glyphWidth(this.font.glyphId(c)))}]`)
        .join(' ');
      addObject(descNum, `<< /Type /FontDescriptor /FontName /RijiBen /Flags 4 /FontBBox [-1000 -1000 3000 3000] /ItalicAngle 0 /Ascent 880 /Descent -220 /CapHeight 700 /StemV 80 /FontFile2 ${fontFileNum} 0 R >>`);
      addObject(descendantNum, `<< /Type /Font /Subtype /CIDFontType2 /BaseFont /RijiBen /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor ${descNum} 0 R /DW 1000 /W [${widths}] /CIDToGIDMap /Identity >>`);
      addObject(fontNum, `<< /Type /Font /Subtype /Type0 /BaseFont /RijiBen /Encoding /Identity-H /DescendantFonts [${descendantNum} 0 R] /ToUnicode ${toUnicodeNum} 0 R >>`);
      void subset;
    } else {
      addObject(fontNum, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    }

    // 图片对象
    this.pages.forEach((p) => {
      for (const img of p.images) {
        const head = enc(`<< /Type /XObject /Subtype /Image /Width ${img.pxWidth} /Height ${img.pxHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter ${img.isJpeg ? '/DCTDecode' : '/FlateDecode'} /Length ${img.bytes.length} >>\nstream\n`);
        addObject(img.objNum, { raw: [head, img.bytes, enc('\nendstream')] });
      }
    });

    // 内容流与页面
    this.pages.forEach((p, i) => {
      const content = p.ops.join('\n');
      const stream = enc(content);
      const xobj = p.images.length ? ` /XObject << ${p.images.map((im) => `/${im.ref} ${im.objNum} 0 R`).join(' ')} >>` : '';
      const res = `<< /Font << /F1 ${fontNum} 0 R /F0 ${fontNum} 0 R >>${xobj} >>`;
      addObject(contentNums[i], { raw: [enc(`<< /Length ${stream.length} >>\nstream\n`), stream, enc('\nendstream')] });
      addObject(pageNums[i], `<< /Type /Page /Parent ${pagesNum} 0 R /MediaBox [0 0 ${this.width.toFixed(2)} ${this.height.toFixed(2)}] /Resources ${res} /Contents ${contentNums[i]} 0 R >>`);
    });

    // 序列化（用 TextEncoder 精确统计字节偏移，避免 CJK/特殊字符造成的长度偏差）
    const maxNum = Math.max(pageNums[pageNums.length - 1] || 0, objects.length);
    const utf8 = (s) => new TextEncoder().encode(s);
    const parts = [utf8('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n')];
    let byteLength = parts[0].length;
    const objOffsets = [];
    for (let i = 0; i < maxNum; i++) {
      const obj = objects[i];
      if (obj === undefined) continue;
      objOffsets[i] = byteLength;
      const header = utf8(`${i + 1} 0 obj\n`);
      parts.push(header);
      byteLength += header.length;
      if (typeof obj === 'string') {
        const chunk = utf8(obj);
        parts.push(chunk);
        byteLength += chunk.length;
      } else {
        for (const chunk of obj.raw) {
          const bytes = typeof chunk === 'string' ? utf8(chunk) : chunk;
          parts.push(bytes);
          byteLength += bytes.length;
        }
      }
      parts.push(utf8('\nendobj\n'));
      byteLength += 8;
    }

    const xrefOffset = byteLength;
    let xref = `xref\n0 ${maxNum + 1}\n0000000000 65535 f \n`;
    for (let i = 0; i < maxNum; i++) {
      xref += objOffsets[i] === undefined
        ? '0000000000 65535 f \n'
        : `${String(objOffsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    xref += `trailer\n<< /Size ${maxNum + 1} /Root ${catalogNum} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    parts.push(utf8(xref));

    return new Blob(parts, { type: 'application/pdf' });
  }
}

/* ---------------------- PDF 排版（日记 → PDF） ---------------------- */

/**
 * 把日记数组渲染成 PDF
 * @param {Array} entries
 * @param {object} options { font, pageSize, fontSize, margin, lineHeight, inkColor,
 *                           includeImages, includeWeather, title, author, imagesResolver, paperLines }
 */
async function buildDiaryPDF_features_export(entries, options = {}) {
  const {
    font = null,
    pageSize = 'A5',
    fontSize = 11,
    margin = 48,
    lineHeight = 1.95,
    inkColor = '#20304a',
    includeImages = true,
    includeWeather = true,
    title = '我的日记本',
    author = '',
    imagesResolver = getImage,
    paperLines = true,
  } = options;

  const size = pageSize === 'A4' ? PDFDocument_features_export.A4 : PDFDocument_features_export.A5;
  const doc = new PDFDocument_features_export({ ...size, font, fontName: 'F1' });
  const { r, g, b } = hexToRgb(inkColor);
  const ink = [r / 255, g / 255, b / 255];
  const contentWidth = doc.width - margin * 2;
  const lineH = fontSize * lineHeight;

  let y = margin;

  const drawPaper = () => {
    if (!paperLines) return;
    const bottom = doc.height - margin;
    for (let yy = margin + lineH; yy < bottom; yy += lineH) {
      doc.line(margin, doc.toBottom(yy), doc.width - margin, doc.toBottom(yy), { color: [0.87, 0.85, 0.81], width: 0.4 });
    }
    doc.line(margin - 9, doc.toBottom(margin), margin - 9, doc.toBottom(bottom), { color: [0.86, 0.62, 0.62], width: 0.6 });
  };

  const newPage = () => { doc.newPage(); y = margin; drawPaper(); };
  const ensure = (need) => { if (y + need > doc.height - margin) newPage(); };

  const writeText = (text, opts = {}) => {
    const { size: fs = fontSize, indent = 0, color = ink, align = 'left' } = opts;
    const per = Math.max(8, Math.floor((contentWidth - indent) / fs));
    const lines = [];
    let cur = '';
    let count = 0;
    for (const ch of String(text)) {
      const w = /[\u2e80-\u9fff\uff00-\uffef\u3000-\u303f]/.test(ch) ? 1 : 0.55;
      if (ch === '\n' || count + w > per) {
        lines.push(cur);
        if (ch === '\n') { cur = ''; count = 0; continue; }
        cur = ch;
        count = w;
      } else {
        cur += ch;
        count += w;
      }
    }
    if (cur) lines.push(cur);
    for (const line of lines) {
      ensure(fs * lineHeight);
      const width = Array.from(line).reduce((a, ch) => a + (/[\u2e80-\u9fff\uff00-\uffef]/.test(ch) ? fs : fs * 0.55), 0);
      const x = align === 'center' ? Math.max(margin, (doc.width - width) / 2) : margin + indent;
      doc.text(line, x, doc.toBottom(y + fs), { size: fs, color });
      y += fs * lineHeight;
    }
  };

  // 封面
  y = doc.height / 3;
  writeText(title, { size: fontSize * 2.6, align: 'center' });
  y += fontSize * 1.4;
  if (author) writeText(author, { size: fontSize * 1.2, align: 'center', color: [0.4, 0.4, 0.45] });
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? -1 : 1));
  if (sorted.length) {
    y += fontSize;
    writeText(`${sorted[0].date}  —  ${sorted[sorted.length - 1].date}`, { size: fontSize, align: 'center', color: [0.45, 0.45, 0.5] });
    writeText(`共 ${sorted.length} 篇日记 · 导出时间 ${new Date().toLocaleString('zh-CN')}`, { size: fontSize * 0.85, align: 'center', color: [0.55, 0.55, 0.6] });
  }

  for (const entry of sorted) {
    doc.newPage();
    y = margin;
    drawPaper();

    const heading = entry.title?.trim() || `${entry.date} 的日记`;
    writeText(heading, { size: fontSize * 1.7 });
    y += 3;
    const meta = [entry.date];
    if (includeWeather && entry.weather) {
      meta.push(`${entry.weather.city || ''} ${entry.weather.text || ''} ${entry.weather.temp != null ? `${entry.weather.temp}℃` : ''}`.trim());
    }
    if (entry.mood) meta.push(`心情 ${entry.mood}`);
    writeText(meta.filter(Boolean).join('  ·  '), { size: fontSize * 0.82, color: [0.45, 0.45, 0.5] });
    doc.line(margin, doc.toBottom(y + 3), doc.width - margin, doc.toBottom(y + 3), { color: [0.8, 0.78, 0.74], width: 0.5 });
    y += lineH * 0.7;

    const { paragraphs, images } = splitBody_features_export(entry.body || '');
    for (const para of paragraphs) {
      if (para.marker) {
        const imgMeta = images.shift();
        if (!includeImages || !imgMeta?.id) continue;
        const rec = await imagesResolver(imgMeta.id).catch(() => null);
        if (!rec) continue;
        const canvasW = contentWidth;
        const ratio = (rec.height || 3) / (rec.width || 4) || 0.75;
        const canvasH = Math.min(doc.height - margin * 2 - 20, canvasW * ratio);
        ensure(canvasH + 12);
        await doc.image(rec.blob, margin + (contentWidth - canvasW) / 2, y, canvasW, canvasH, { name: rec.name });
        y += canvasH + 12;
        continue;
      }
      if (!para.text?.trim()) { y += lineH * 0.35; continue; }
      writeText(para.text, { indent: fontSize * 2 });
      y += lineH * 0.12;
    }

    for (const d of entry.drawings || []) {
      if (!includeImages || !d.imageId) continue;
      const rec = await imagesResolver(d.imageId).catch(() => null);
      if (!rec) continue;
      const canvasW = contentWidth * 0.92;
      const ratio = (rec.height || 3) / (rec.width || 4) || 0.75;
      const canvasH = Math.min(doc.height - margin * 2 - 20, canvasW * ratio);
      ensure(canvasH + 12);
      await doc.image(rec.blob, margin + (contentWidth - canvasW) / 2, y, canvasW, canvasH, { name: rec.name });
      y += canvasH + 12;
    }
  }

  // 页码
  doc.pages.forEach((p, i) => {
    doc.page = p;
    doc.text(`${i + 1} / ${doc.pages.length}`, doc.width / 2 - 14, 24, { size: 8.5, color: [0.55, 0.55, 0.6] });
  });

  return doc.build();
}

/** 把富文本正文拆成「段落 / 图片占位」序列 */
function splitBody_features_export(html) {
  const container = document.createElement('div');
  container.innerHTML = String(html || '');
  const paragraphs = [];
  const images = [];
  const walk = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const t = child.textContent.replace(/\s+/g, ' ');
        if (t.trim()) paragraphs.push({ text: t });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();
        if (tag === 'img') {
          const m = /img:\/\/([^"')]+)/.exec(child.getAttribute('src') || '');
          images.push({ id: m ? m[1] : null, alt: child.getAttribute('alt') || '' });
          paragraphs.push({ marker: true });
          continue;
        }
        if (tag === 'figure') {
          const img = child.querySelector('img');
          if (img) {
            const m = /img:\/\/([^"')]+)/.exec(img.getAttribute('src') || '');
            images.push({ id: m ? m[1] : null, alt: '' });
            paragraphs.push({ marker: true });
            const cap = child.querySelector('figcaption');
            if (cap?.textContent?.trim()) paragraphs.push({ text: cap.textContent.trim() });
          }
          continue;
        }
        if (tag === 'br') { paragraphs.push({ text: '\n' }); continue; }
        if (tag === 'hr') { paragraphs.push({ text: '— — —' }); continue; }
        const before = paragraphs.length;
        walk(child);
        if (paragraphs.length > before && ['p', 'div', 'li', 'h1', 'h2', 'h3', 'blockquote'].includes(tag)) {
          paragraphs.push({ text: '\n' });
        }
      }
    }
  };
  walk(container);
  return { paragraphs, images };
}

/* ============================= 4. 邮件发送 ============================= */

function buildMailto_features_export({ to = '', subject = '', body = '' }) {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body).slice(0, 1800)}`;
}

/** 优先用系统分享面板（手机端可直接选「邮件」App 并带附件） */
async function shareFile_features_export(blob, filename, { title = '日记本导出', text = '', to = '' } = {}) {
  const file = new File([blob], filename, { type: blob.type });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], title, text });
    return { shared: true };
  }
  const { downloadBlob } = await __m("js/core/utils.js");
  downloadBlob(blob, filename);
  if (to || text) window.location.href = buildMailto_features_export({ to, subject: title, body: text });
  return { shared: false };
}



return { "escapeHtml": escapeHtml, "safeFileName": safeFileName, "htmlToText": htmlToText, "countWords": countWords, "crc32": crc32_features_export, "ZipWriter": ZipWriter_features_export, "buildDocx": buildDocx_features_export, "loadPdfFont": loadPdfFont_features_export, "parseTrueType": parseTrueType_features_export, "probeImageSize": probeImageSize_features_export, "PDFDocument": PDFDocument_features_export, "buildDiaryPDF": buildDiaryPDF_features_export, "splitBody": splitBody_features_export, "buildMailto": buildMailto_features_export, "shareFile": shareFile_features_export };
} };
/* ================= js/features/weather.js ================= */
__defs["js/features/weather.js"] = { exports: ["WMO","weatherInfo","CITY_TABLE","getPosition","nearestCity","readWeatherCache","rememberLocation","lastLocation","fetchWeather","fetchWeatherByCity","weatherSVG","weatherSVGDataUrl","greetByHour","weatherSuggestion"], fn: function (module) {
var { "local": local } = __m("js/core/utils.js");
/* ==========================================================================
 * 日记本 App —— 天气模块
 *  · 数据源：Open-Meteo（免费、免密钥、无需注册）
 *  · 定位：浏览器定位 → 上次记忆的城市 → 手动输入城市（内置常用城市表）
 *  · 图标：内置漫画插图风 SVG（手绘描边 + 表情），随天气/昼夜切换
 * ========================================================================== */



const CACHE_KEY_features_weather = 'riji.weather.v1';
const GEO_CACHE_KEY_features_weather = 'riji.geo.v1';

/* ------------------------------ WMO 天气码 ------------------------------ */

const WMO_features_weather = {
  0: { text: '晴', kind: 'sunny' },
  1: { text: '晴间多云', kind: 'partly' },
  2: { text: '多云', kind: 'partly' },
  3: { text: '阴', kind: 'cloudy' },
  45: { text: '有雾', kind: 'fog' },
  48: { text: '雾凇', kind: 'fog' },
  51: { text: '毛毛雨', kind: 'drizzle' },
  53: { text: '小雨', kind: 'drizzle' },
  55: { text: '中雨', kind: 'rain' },
  56: { text: '冻雨', kind: 'sleet' },
  57: { text: '强冻雨', kind: 'sleet' },
  61: { text: '小雨', kind: 'rain' },
  63: { text: '中雨', kind: 'rain' },
  65: { text: '大雨', kind: 'heavy-rain' },
  66: { text: '冻雨', kind: 'sleet' },
  67: { text: '强冻雨', kind: 'sleet' },
  71: { text: '小雪', kind: 'snow' },
  73: { text: '中雪', kind: 'snow' },
  75: { text: '大雪', kind: 'heavy-snow' },
  77: { text: '米雪', kind: 'snow' },
  80: { text: '阵雨', kind: 'rain' },
  81: { text: '强阵雨', kind: 'heavy-rain' },
  82: { text: '暴雨', kind: 'heavy-rain' },
  85: { text: '阵雪', kind: 'snow' },
  86: { text: '强阵雪', kind: 'heavy-snow' },
  95: { text: '雷阵雨', kind: 'thunder' },
  96: { text: '雷阵雨伴冰雹', kind: 'thunder' },
  99: { text: '强雷暴伴冰雹', kind: 'thunder' },
};

function weatherInfo_features_weather(code) {
  return WMO_features_weather[Number(code)] || { text: '未知', kind: 'cloudy' };
}

/** 常用城市坐标表（离线可用，避免反复请求地理编码） */
const CITY_TABLE_features_weather = [
  { name: '北京', lat: 39.9042, lon: 116.4074 },
  { name: '上海', lat: 31.2304, lon: 121.4737 },
  { name: '广州', lat: 23.1291, lon: 113.2644 },
  { name: '深圳', lat: 22.5431, lon: 114.0579 },
  { name: '杭州', lat: 30.2741, lon: 120.1551 },
  { name: '南京', lat: 32.0603, lon: 118.7969 },
  { name: '成都', lat: 30.5728, lon: 104.0668 },
  { name: '重庆', lat: 29.563, lon: 106.5516 },
  { name: '武汉', lat: 30.5928, lon: 114.3055 },
  { name: '西安', lat: 34.3416, lon: 108.9398 },
  { name: '天津', lat: 39.3434, lon: 117.3616 },
  { name: '苏州', lat: 31.2989, lon: 120.5853 },
  { name: '长沙', lat: 28.2282, lon: 112.9388 },
  { name: '郑州', lat: 34.7466, lon: 113.6254 },
  { name: '青岛', lat: 36.0671, lon: 120.3826 },
  { name: '厦门', lat: 24.4798, lon: 118.0894 },
  { name: '昆明', lat: 24.8801, lon: 102.8329 },
  { name: '哈尔滨', lat: 45.8038, lon: 126.5349 },
  { name: '沈阳', lat: 41.8057, lon: 123.4315 },
  { name: '济南', lat: 36.6512, lon: 117.1201 },
  { name: '福州', lat: 26.0745, lon: 119.2965 },
  { name: '合肥', lat: 31.8206, lon: 117.2272 },
  { name: '南昌', lat: 28.6829, lon: 115.8579 },
  { name: '贵阳', lat: 26.6470, lon: 106.6302 },
  { name: '南宁', lat: 22.8170, lon: 108.3665 },
  { name: '兰州', lat: 36.0611, lon: 103.8343 },
  { name: '乌鲁木齐', lat: 43.8256, lon: 87.6168 },
  { name: '拉萨', lat: 29.6520, lon: 91.1721 },
  { name: '海口', lat: 20.0444, lon: 110.1999 },
  { name: '香港', lat: 22.3193, lon: 114.1694 },
  { name: '澳门', lat: 22.1987, lon: 113.5439 },
  { name: '台北', lat: 25.0330, lon: 121.5654 },
];

/* -------------------------------- 定位 --------------------------------- */

function getPosition_features_weather({ timeout = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('设备不支持定位')); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      (err) => reject(new Error(err.code === 1 ? '定位权限被拒绝，请在设置里选择城市' : '定位失败，请手动选择城市')),
      { enableHighAccuracy: false, timeout, maximumAge: 10 * 60 * 1000 },
    );
  });
}

function nearestCity_features_weather(lat, lon) {
  let best = null;
  let bestD = Infinity;
  for (const c of CITY_TABLE_features_weather) {
    const d = (c.lat - lat) ** 2 + (c.lon - lon) ** 2;
    if (d < bestD) { bestD = d; best = c; }
  }
  return bestD < 4 ? best : null; // 约 200km 内才认为匹配
}

/* ------------------------------ 天气请求 -------------------------------- */

function cacheKey_features_weather(lat, lon) { return `${lat.toFixed(2)},${lon.toFixed(2)}`; }

function readWeatherCache_features_weather(lat, lon, maxAgeMs = 30 * 60 * 1000) {
  const all = local.get(CACHE_KEY_features_weather, {});
  const hit = all[cacheKey_features_weather(lat, lon)];
  if (hit && Date.now() - hit.at < maxAgeMs) return hit.data;
  return null;
}

function writeWeatherCache_features_weather(lat, lon, data) {
  const all = local.get(CACHE_KEY_features_weather, {});
  all[cacheKey_features_weather(lat, lon)] = { at: Date.now(), data };
  local.set(CACHE_KEY_features_weather, all);
}

function rememberLocation_features_weather(loc) { local.set(GEO_CACHE_KEY_features_weather, { ...loc, at: Date.now() }); }
function lastLocation_features_weather() { return local.get(GEO_CACHE_KEY_features_weather, null); }

/**
 * 拉取当前天气 + 当日概况
 * @returns {Promise<{ code, kind, text, temp, tempMax, tempMin, humidity, windSpeed, feelsLike, isDay, sunrise, sunset, city, lat, lon, at, offline? }>}
 */
async function fetchWeather_features_weather({ lat, lon, city = '', force = false } = {}) {
  let pos = { lat, lon };
  if (pos.lat == null || pos.lon == null) {
    const cached = lastLocation_features_weather();
    if (cached?.lat != null) pos = cached;
  }
  if (pos.lat == null || pos.lon == null) {
    const p = await getPosition_features_weather();
    pos = { lat: p.lat, lon: p.lon };
  }
  if (!force) {
    const cached = readWeatherCache_features_weather(pos.lat, pos.lon);
    if (cached) return { ...cached, cached: true };
  }
  if (!navigator.onLine) {
    const cached = readWeatherCache_features_weather(pos.lat, pos.lon, Number.MAX_SAFE_INTEGER);
    if (cached) return { ...cached, offline: true, cached: true };
    throw new Error('当前无网络，可在设置中手动填写天气');
  }

  const url = 'https://api.open-meteo.com/v1/forecast'
    + `?latitude=${pos.lat.toFixed(4)}&longitude=${pos.lon.toFixed(4)}`
    + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m'
    + '&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset'
    + '&timezone=auto&forecast_days=1';

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`天气服务返回 ${res.status}`);
  const json = await res.json();
  const cur = json.current || {};
  const daily = json.daily || {};
  const info = weatherInfo_features_weather(cur.weather_code);
  const data = {
    code: cur.weather_code,
    kind: info.kind,
    text: info.text,
    temp: Math.round(cur.temperature_2m ?? 0),
    feelsLike: Math.round(cur.apparent_temperature ?? cur.temperature_2m ?? 0),
    humidity: Math.round(cur.relative_humidity_2m ?? 0),
    windSpeed: Math.round(cur.wind_speed_10m ?? 0),
    isDay: cur.is_day !== 0,
    tempMax: Math.round(daily.temperature_2m_max?.[0] ?? 0),
    tempMin: Math.round(daily.temperature_2m_min?.[0] ?? 0),
    sunrise: daily.sunrise?.[0] || '',
    sunset: daily.sunset?.[0] || '',
    city: city || nearestCity_features_weather(pos.lat, pos.lon)?.name || lastLocation_features_weather()?.city || '当前位置',
    lat: pos.lat,
    lon: pos.lon,
    at: Date.now(),
  };
  writeWeatherCache_features_weather(pos.lat, pos.lon, data);
  rememberLocation_features_weather({ lat: pos.lat, lon: pos.lon, city: data.city });
  return data;
}

/** 通过城市名解析坐标并取天气（内置表 + 在线地理编码兜底） */
async function fetchWeatherByCity_features_weather(cityName, { force = true } = {}) {
  const name = String(cityName || '').trim();
  if (!name) throw new Error('请输入城市名');
  let hit = CITY_TABLE_features_weather.find((c) => c.name === name || c.name.includes(name) || name.includes(c.name));
  if (!hit) {
    if (!navigator.onLine) throw new Error(`离线时只支持内置城市（如 北京 / 上海 / ${CITY_TABLE_features_weather[5].name}）`);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=zh&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      const r = json.results?.[0];
      if (r) hit = { name: r.name, lat: r.latitude, lon: r.longitude };
    }
    if (!hit) throw new Error('没有找到这个城市，请换个名称试试');
  }
  return fetchWeather_features_weather({ lat: hit.lat, lon: hit.lon, city: hit.name, force });
}

/* ---------------------------- 漫画风天气图标 ---------------------------- */

const OUTLINE_features_weather = '#3a3226';

/** 生成内联 SVG 图标（漫画插图风格：粗描边、暖色、笑脸） */
function weatherSVG_features_weather(kind, { size = 96, animate = true } = {}) {
  const S = size;
  const common = `width="${S}" height="${S}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"`;
  const face = (cx, cy, r = 7, dark = false) => `
    <circle cx="${cx - 6}" cy="${cy - 4}" r="2.2" fill="${dark ? '#fff8e6' : OUTLINE_features_weather}"/>
    <circle cx="${cx + 6}" cy="${cy - 4}" r="2.2" fill="${dark ? '#fff8e6' : OUTLINE_features_weather}"/>
    <path d="M ${cx - 7} ${cy + 3} q 7 6 14 0" stroke="${dark ? '#fff8e6' : OUTLINE_features_weather}" stroke-width="2.4" stroke-linecap="round" fill="none"/>
    <circle cx="${cx - 13}" cy="${cy + 3}" r="3" fill="#ff9d9d" opacity="0.55"/>
    <circle cx="${cx + 13}" cy="${cy + 3}" r="3" fill="#ff9d9d" opacity="0.55"/>`;

  const sunRays = (cx, cy, r1, r2, color = '#f6a623') => Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return `<line x1="${cx + Math.cos(a) * r1}" y1="${cy + Math.sin(a) * r1}" x2="${cx + Math.cos(a) * r2}" y2="${cy + Math.sin(a) * r2}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`;
  }).join('');

  const cloudShape = (cx, cy, scale = 1, fill = '#eef3f8', stroke = OUTLINE_features_weather) => `
    <g transform="translate(${cx} ${cy}) scale(${scale})">
      <path d="M -34 12 a 17 17 0 0 1 3 -33 a 22 22 0 0 1 42 -3 a 15 15 0 0 1 6 29 z"
        fill="${fill}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
    </g>`;

  const drop = (x, y, color = '#5eb0f0') => `<path d="M ${x} ${y} c 5 8 8 11 8 15 a 8 8 0 0 1 -16 0 c 0 -4 3 -7 8 -15 z" fill="${color}" stroke="${OUTLINE_features_weather}" stroke-width="3" stroke-linejoin="round"/>`;
  const flake = (x, y) => `<g stroke="#8fd3ff" stroke-width="3.4" stroke-linecap="round"><line x1="${x - 7}" y1="${y}" x2="${x + 7}" y2="${y}"/><line x1="${x}" y1="${y - 7}" x2="${x}" y2="${y + 7}"/><line x1="${x - 5}" y1="${y - 5}" x2="${x + 5}" y2="${y + 5}"/><line x1="${x - 5}" y1="${y + 5}" x2="${x + 5}" y2="${y - 5}"/></g>`;

  let inner = '';
  switch (kind) {
    case 'sunny':
      inner = `${sunRays(60, 60, 32, 46)}<circle cx="60" cy="60" r="28" fill="#ffc93c" stroke="${OUTLINE_features_weather}" stroke-width="4"/>${face(60, 60, 7)}`;
      break;
    case 'partly':
      inner = `${sunRays(42, 44, 20, 30)}<circle cx="42" cy="44" r="18" fill="#ffc93c" stroke="${OUTLINE_features_weather}" stroke-width="4"/>
        ${cloudShape(70, 68, 0.92)}${face(70, 70, 5)}`;
      break;
    case 'cloudy':
      inner = `${cloudShape(48, 56, 0.8, '#dde6ef')}${cloudShape(70, 68, 1)}${face(70, 70, 5)}`;
      break;
    case 'fog':
      inner = `${cloudShape(60, 48, 0.95)}<g stroke="${OUTLINE_features_weather}" stroke-width="4" stroke-linecap="round" opacity="0.85">
        <line x1="24" y1="80" x2="66" y2="80"/><line x1="38" y1="92" x2="96" y2="92"/><line x1="30" y1="104" x2="78" y2="104"/></g>`;
      break;
    case 'drizzle':
      inner = `${cloudShape(60, 50, 1)}${drop(44, 76)}${drop(60, 82)}${drop(76, 76)}`;
      break;
    case 'rain':
      inner = `${cloudShape(60, 46, 1)}${drop(40, 74)}${drop(56, 82)}${drop(72, 74)}${drop(64, 98)}`;
      break;
    case 'heavy-rain':
      inner = `${cloudShape(60, 42, 1.05, '#c9d6e4')}${drop(38, 68)}${drop(54, 76)}${drop(70, 68)}${drop(46, 92)}${drop(62, 98)}${drop(78, 90)}`;
      break;
    case 'sleet':
      inner = `${cloudShape(60, 46, 1)}${drop(44, 74)}${flake(64, 80)}${drop(82, 72)}`;
      break;
    case 'snow':
      inner = `${cloudShape(60, 46, 1, '#f4f9ff')}${flake(44, 78)}${flake(62, 88)}${flake(80, 78)}`;
      break;
    case 'heavy-snow':
      inner = `${cloudShape(60, 42, 1.05, '#f4f9ff')}${flake(38, 70)}${flake(58, 78)}${flake(78, 70)}${flake(48, 96)}${flake(68, 100)}`;
      break;
    case 'thunder':
      inner = `${cloudShape(60, 44, 1.05, '#c3cbd8')}
        <path d="M 62 62 l -16 30 h 14 l -8 26 l 26 -36 h -14 l 10 -20 z" fill="#ffd54a" stroke="${OUTLINE_features_weather}" stroke-width="3.4" stroke-linejoin="round"/>`;
      break;
    default:
      inner = `${cloudShape(60, 60, 1)}${face(60, 62, 6)}`;
  }
  const anim = animate
    ? `<animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="3.6s" repeatCount="indefinite"/>`
    : '';
  return `<svg ${common} class="weather-svg"><g>${anim}${inner}</g></svg>`;
}

/** 生成 data URL，方便插入到 <img> 或导出文档 */
function weatherSVGDataUrl_features_weather(kind, opts = {}) {
  const svg = weatherSVG_features_weather(kind, { animate: false, ...opts });
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/* ------------------------------ 小时/时段 ------------------------------- */

function greetByHour_features_weather(date = new Date()) {
  const h = date.getHours();
  if (h < 5) return '夜深了';
  if (h < 9) return '早上好';
  if (h < 12) return '上午好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  if (h < 23) return '晚上好';
  return '夜深了';
}

function weatherSuggestion_features_weather(data) {
  if (!data) return '';
  const t = data.temp;
  const tips = [];
  if (data.kind?.includes('rain') || data.kind === 'thunder') tips.push('记得带伞');
  if (data.kind?.includes('snow')) tips.push('路面湿滑，注意保暖');
  if (t >= 33) tips.push('高温注意补水');
  if (t <= 3) tips.push('天冷多穿点');
  if (data.humidity >= 85) tips.push('湿度较大');
  if (data.windSpeed >= 25) tips.push('风有点大');
  return tips.slice(0, 2).join(' · ');
}

return { "WMO": WMO_features_weather, "weatherInfo": weatherInfo_features_weather, "CITY_TABLE": CITY_TABLE_features_weather, "getPosition": getPosition_features_weather, "nearestCity": nearestCity_features_weather, "readWeatherCache": readWeatherCache_features_weather, "rememberLocation": rememberLocation_features_weather, "lastLocation": lastLocation_features_weather, "fetchWeather": fetchWeather_features_weather, "fetchWeatherByCity": fetchWeatherByCity_features_weather, "weatherSVG": weatherSVG_features_weather, "weatherSVGDataUrl": weatherSVGDataUrl_features_weather, "greetByHour": greetByHour_features_weather, "weatherSuggestion": weatherSuggestion_features_weather };
} };
/* ================= js/ui/viewport.js ================= */
__defs["js/ui/viewport.js"] = { exports: ["applyViewportMetrics","lockScroll","unlockScroll","resetScrollLock","isScrollLocked","ensureCaretVisible","initViewport"], fn: function (module) {
var { "debounce": debounce } = __m("js/core/utils.js");
/* ==========================================================================
 * 视口 / 虚拟键盘管理
 *
 * 解决的问题（手机网页版最常见的一类"界面乱跳"）：
 *  1. 弹出键盘后，浏览器可视区域变小，但 CSS 的 100vh / 92vh 不会跟着变
 *     → 面板比屏幕还高，底部按钮被顶出屏幕，整页被迫滚动；
 *  2. 输入框获得焦点时，浏览器为了露出光标会滚动整个页面 → 顶栏/工具栏被顶走；
 *  3. 弹层打开时背景页面还能滚 → 手指一划整页跟着动。
 *
 * 做法：
 *  · 用 visualViewport 把"真正的可视高度"写进 CSS 变量 --app-vvh，
 *    所有依赖视口高度的面板改用这个变量（并保留 vh 作为兜底）；
 *  · 键盘弹出时给 <html> 加 .keyboard-open，让面板贴住可见区域底部；
 *  · 弹层打开时锁住页面滚动（fixed body + 记录 scrollY，关闭后原样还原）；
 *  · 焦点变化 / 键盘弹出后，只在"内部滚动容器"里把光标挪进可见区，
 *    绝不让整页滚动。
 * ========================================================================== */



const HTML_ui_viewport = document.documentElement;
const BODY_ui_viewport = document.body;

/** 键盘高度超过这个值就认为"键盘弹出来了"（排除地址栏收缩等小幅变化） */
const KEYBOARD_MIN_ui_viewport = 120;

let inited_ui_viewport = false;
let lockCount_ui_viewport = 0;
let savedScrollY_ui_viewport = 0;

/* --------------------------- 视口尺寸同步 --------------------------- */

function currentViewportHeight_ui_viewport() {
  const vv = window.visualViewport;
  if (vv && vv.height) return Math.round(vv.height);
  return Math.round(window.innerHeight);
}

function keyboardHeight_ui_viewport() {
  const vv = window.visualViewport;
  if (!vv) return 0;
  // innerHeight 是布局视口高度；visualViewport.height 是可见高度
  const kb = Math.round(window.innerHeight - vv.height - (vv.offsetTop || 0));
  return kb > 0 ? kb : 0;
}

/** 把当前视口尺寸写进 CSS 变量，并维护 keyboard-open 类 */
function applyViewportMetrics_ui_viewport() {
  const vh = currentViewportHeight_ui_viewport();
  const kb = keyboardHeight_ui_viewport();
  const top = Math.round(window.visualViewport?.offsetTop || 0);
  HTML_ui_viewport.style.setProperty('--app-vvh', `${vh}px`);
  HTML_ui_viewport.style.setProperty('--app-vv-top', `${top}px`);
  HTML_ui_viewport.style.setProperty('--app-kb', `${kb}px`);
  const open = kb >= KEYBOARD_MIN_ui_viewport;
  HTML_ui_viewport.classList.toggle('keyboard-open', open);
  return { vh, kb, open };
}

/* ------------------------- 页面滚动锁 ------------------------- */

/**
 * 锁住页面滚动。
 * 用 position:fixed 而不是 overflow:hidden —— iOS Safari 只认前者，
 * 否则输入框获得焦点时整页照样会被顶上去。
 */
function lockScroll_ui_viewport() {
  lockCount_ui_viewport++;
  if (lockCount_ui_viewport > 1) return;
  savedScrollY_ui_viewport = window.scrollY || HTML_ui_viewport.scrollTop || 0;
  BODY_ui_viewport.style.position = 'fixed';
  BODY_ui_viewport.style.top = `-${savedScrollY_ui_viewport}px`;
  BODY_ui_viewport.style.left = '0';
  BODY_ui_viewport.style.right = '0';
  BODY_ui_viewport.style.width = '100%';
  HTML_ui_viewport.classList.add('scroll-locked');
}

/** 解除滚动锁（引用计数；关闭后恢复到原来的滚动位置） */
function unlockScroll_ui_viewport() {
  lockCount_ui_viewport = Math.max(0, lockCount_ui_viewport - 1);
  if (lockCount_ui_viewport > 0) return;
  restoreBody_ui_viewport();
}

/** 兜底：无视计数直接恢复（弹层异常退出时用） */
function resetScrollLock_ui_viewport() {
  lockCount_ui_viewport = 0;
  restoreBody_ui_viewport();
}

function restoreBody_ui_viewport() {
  const wasLocked = BODY_ui_viewport.style.position === 'fixed';
  BODY_ui_viewport.style.position = '';
  BODY_ui_viewport.style.top = '';
  BODY_ui_viewport.style.left = '';
  BODY_ui_viewport.style.right = '';
  BODY_ui_viewport.style.width = '';
  HTML_ui_viewport.classList.remove('scroll-locked');
  if (wasLocked) {
    // 关掉桌面端不该有的键盘态
    HTML_ui_viewport.classList.remove('keyboard-open');
    window.scrollTo(0, savedScrollY_ui_viewport);
  }
}

function isScrollLocked_ui_viewport() { return lockCount_ui_viewport > 0; }

/* --------------------------- 光标可见性 --------------------------- */

function activeEditable_ui_viewport() {
  const el = document.activeElement;
  if (!el || el === BODY_ui_viewport || el === HTML_ui_viewport) return null;
  const tag = el.tagName;
  const editable = tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  return editable ? el : null;
}

/** 光标所在位置（contenteditable 用 range，取不到就退回元素本身） */
function caretRect_ui_viewport(el) {
  const sel = window.getSelection?.();
  if (sel && sel.rangeCount && el.contains(sel.anchorNode)) {
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    if (rect && (rect.height || rect.width)) return rect;
  }
  return el.getBoundingClientRect();
}

/**
 * 让光标可见，但**只滚动最近的内部滚动容器**，不动整个页面。
 * 这是"界面固定"的关键：浏览器默认会滚动页面，我们改成滚容器。
 */
function ensureCaretVisible_ui_viewport({ margin = 28 } = {}) {
  const el = activeEditable_ui_viewport();
  if (!el) return;

  // 找到最近的可滚动祖先（在弹层内部才算）
  let scroller = null;
  let node = el.parentElement;
  while (node && node !== BODY_ui_viewport) {
    const style = getComputedStyle(node);
    const canScroll = /(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 2;
    if (canScroll) { scroller = node; break; }
    node = node.parentElement;
  }
  if (!scroller) return;

  const caret = caretRect_ui_viewport(el);
  const box = scroller.getBoundingClientRect();
  // 可见区间（扣掉一点余量，避免光标贴着边缘被工具栏挡住）
  const top = box.top + margin;
  const bottom = box.bottom - margin;

  if (caret.bottom > bottom) {
    scroller.scrollTop += Math.ceil(caret.bottom - bottom);
  } else if (caret.top < top) {
    scroller.scrollTop -= Math.ceil(top - caret.top);
  }
}

/* ------------------------------ 初始化 ------------------------------ */

function initViewport_ui_viewport() {
  if (inited_ui_viewport) return;
  inited_ui_viewport = true;
  applyViewportMetrics_ui_viewport();

  const onResize = debounce(() => {
    applyViewportMetrics_ui_viewport();
    // 键盘动画结束后再把光标挪进可见区，效果更稳
    ensureCaretVisible_ui_viewport();
  }, 120);

  const vv = window.visualViewport;
  if (vv) {
    vv.addEventListener('resize', onResize);
    // offsetTop 变化时（iOS 键盘把页面顶上去）也要重算
    vv.addEventListener('scroll', () => applyViewportMetrics_ui_viewport());
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  // 焦点进入输入区域：先等一帧（键盘还没弹），键盘动画后再校正一次
  document.addEventListener('focusin', (e) => {
    const el = e.target;
    if (!el || !(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
    if (isScrollLocked_ui_viewport()) {
      // 页面已被锁住，浏览器没法滚整页；这里只处理内部容器的可见性
      requestAnimationFrame(() => ensureCaretVisible_ui_viewport());
      setTimeout(() => ensureCaretVisible_ui_viewport(), 260);
    }
  }, true);

  document.addEventListener('focusout', () => {
    // 失去焦点后键盘会收起，重算视口
    setTimeout(() => { applyViewportMetrics_ui_viewport(); }, 160);
  }, true);
}

return { "applyViewportMetrics": applyViewportMetrics_ui_viewport, "lockScroll": lockScroll_ui_viewport, "unlockScroll": unlockScroll_ui_viewport, "resetScrollLock": resetScrollLock_ui_viewport, "isScrollLocked": isScrollLocked_ui_viewport, "ensureCaretVisible": ensureCaretVisible_ui_viewport, "initViewport": initViewport_ui_viewport };
} };
/* ================= js/ui/modal.js ================= */
__defs["js/ui/modal.js"] = { exports: ["toast","confirmDialog","openModal","closeModal","closeTopOverlay","openSheet","showProgress","hideProgress","openImageViewer","pickOption","promptDialog"], fn: function (module) {
var { "$": $, "el": el, "clear": clear, "toast": toast, "confirmDialog": confirmDialog } = __m("js/core/utils.js");
var { "lockScroll": lockScroll, "unlockScroll": unlockScroll, "resetScrollLock": resetScrollLock, "ensureCaretVisible": ensureCaretVisible } = __m("js/ui/viewport.js");
/* ==========================================================================
 * 日记本 · 弹层系统（模态框 / 底部面板 / 进度 / 图片查看器 / 选择器）
 * 统一管理动画、手势下滑关闭、返回键（history）与焦点
 * ========================================================================== */




const stack_ui_modal = [];

/* ---------------------------- 返回键 / 历史 ---------------------------- */
/**
 * 弹层与系统返回键（Android 的返回手势/按键）的配合：
 *  · 打开弹层时往历史里压一条记录；
 *  · 用户按返回键 → 关掉最上层弹层，而不是直接退出 App；
 *  · 用户点页面里的关闭按钮 → 主动消费掉那条历史记录，避免历史越积越多。
 */
const HISTORY_FLAG_ui_modal = '__rijiOverlay';
let consumeCount_ui_modal = 0;

function pushOverlayHistory_ui_modal() {
  try { history.pushState({ [HISTORY_FLAG_ui_modal]: Date.now() }, ''); } catch { /* 忽略 */ }
}

function consumeOverlayHistory_ui_modal() {
  try {
    if (history.state && history.state[HISTORY_FLAG_ui_modal]) {
      consumeCount_ui_modal++;
      history.back();
    }
  } catch { /* 忽略 */ }
}

try {
  window.addEventListener('popstate', () => {
    if (consumeCount_ui_modal > 0) { consumeCount_ui_modal--; return; }
    const top = stack_ui_modal[stack_ui_modal.length - 1];
    if (top) { try { top.close(); } catch { /* 忽略 */ } }
  });
} catch { /* 忽略 */ }

/** 同一时刻只允许一层弹层：先关掉已有的，避免面板叠层造成误操作 */
function closeAllOverlays_ui_modal() {
  while (stack_ui_modal.length) {
    const top = stack_ui_modal[stack_ui_modal.length - 1];
    try { top.close(); } catch { stack_ui_modal.pop(); }
  }
  // 兜底清理可能残留的节点
  for (const sel of ['.sheet-overlay', '.modal-overlay']) {
    document.querySelectorAll(sel).forEach((n) => n.remove());
  }
  // 计数可能因强删而失衡，这里统一复位（打开新弹层时会重新上锁）
  resetScrollLock();
}

/* ------------------------------- 模态框 -------------------------------- */

function openModal_ui_modal({ title = '', content = null, actions = null, maxWidth = 420, dismissible = true, onClose = null, className = '' }) {
  // 对话框可以浮在面板之上（例如在「我的」页里弹「改昵称」），
  // 只关掉其它对话框，不要连下面的页面一起关掉。
  for (let i = stack_ui_modal.length - 1; i >= 0; i--) {
    if (stack_ui_modal[i].type === 'modal') {
      try { stack_ui_modal[i].close(); } catch { stack_ui_modal.splice(i, 1); }
    }
  }
  document.querySelectorAll('.modal-overlay').forEach((n) => n.remove());
  const overlay = el('div', { class: 'modal-overlay' });
  const box = el('div', { class: `modal-box ${className}`.trim(), style: maxWidth ? { maxWidth: `${maxWidth}px` } : {} });
  if (title) box.appendChild(el('h3', { class: 'modal-title', text: title }));
  if (content) box.appendChild(content);
  if (actions) box.appendChild(el('div', { class: 'modal-actions' }, actions));
  overlay.appendChild(box);
  $('#modalRoot').appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));

  const entry = { overlay, close: (result) => closeModal_ui_modal(entry, result), type: 'modal' };
  stack_ui_modal.push(entry);
  lockScroll();         // 弹层期间锁住背景页面，避免手指一划整页跟着动
  pushOverlayHistory_ui_modal(); // 返回键先关弹层

  const onBackdrop = (e) => { if (e.target === overlay && dismissible) entry.close(); };
  overlay.addEventListener('click', onBackdrop);
  const onKey = (e) => { if (e.key === 'Escape' && dismissible) entry.close(); };
  document.addEventListener('keydown', onKey);

  entry._cleanup = () => {
    document.removeEventListener('keydown', onKey);
    overlay.removeEventListener('click', onBackdrop);
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 260);
    const idx = stack_ui_modal.indexOf(entry);
    if (idx >= 0) stack_ui_modal.splice(idx, 1);
    unlockScroll();   // 关闭后恢复页面滚动
    consumeOverlayHistory_ui_modal();
    onClose?.(entry._result);   // 把结果交给 onClose，否则 promptDialog 拿不到输入值
  };
  return { overlay, box, close: entry.close };
}

function closeModal_ui_modal(entry, result) {
  if (!entry) return;
  entry._result = result;
  entry._cleanup?.();
}

function closeTopOverlay_ui_modal() {
  const top = stack_ui_modal[stack_ui_modal.length - 1];
  if (top) { top.close(); return true; }
  return false;
}

/* ------------------------------ 底部面板 ------------------------------- */

function openSheet_ui_modal({
  title = '', subtitle = '', body = null, footer = null, size = 'auto',
  dismissible = true, onClose = null, headExtra = null, showGrab = true, bodyClass = '',
  /** 全屏页面模式：铺满整屏、无圆角、不可下滑关闭、关闭按钮变成返回箭头 */
  fullscreen = false,
}) {
  closeAllOverlays_ui_modal();
  const overlay = el('div', { class: `sheet-overlay${fullscreen ? ' fullscreen' : ''}` });
  const sizeClass = fullscreen ? 'fullscreen' : (size === 'tall' ? 'tall' : size === 'half' ? 'half' : '');
  const panel = el('div', { class: `sheet-panel ${sizeClass}`.trim() });
  if (showGrab && !fullscreen) panel.appendChild(el('div', { class: 'sheet-grab' }));

  const closeBtn = el('button', {
    class: `icon-btn${fullscreen ? ' sheet-back' : ''}`,
    html: fullscreen ? '←' : '✕',
    'aria-label': fullscreen ? '返回' : '关闭',
    onclick: () => entry.close(),
  });
  const titleBox = el('div', { class: 'sheet-head-text' }, [
    el('h2', { text: title }),
    subtitle ? el('div', { class: 'sub', text: subtitle }) : null,
  ]);
  // 全屏页面按 App 习惯把返回箭头放左上角；普通面板仍是右上角关闭
  const head = el('div', { class: 'sheet-head' }, fullscreen
    ? [closeBtn, titleBox, el('div', { class: 'spacer' }), headExtra || null]
    : [titleBox, el('div', { class: 'spacer' }), headExtra || null, closeBtn]);
  panel.appendChild(head);

  const bodyNode = el('div', { class: `sheet-body-scroll ${bodyClass}`.trim() });
  if (body) bodyNode.appendChild(body);
  panel.appendChild(bodyNode);
  if (footer) panel.appendChild(footer);

  overlay.appendChild(panel);
  $('#sheetRoot').appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));

  const entry = {
    overlay, panel, body: bodyNode, close: (result) => {
      entry._result = result;
      entry._cleanup?.();
    }, type: 'sheet',
  };
  stack_ui_modal.push(entry);
  lockScroll();        // 面板打开期间锁住背景页面
  pushOverlayHistory_ui_modal(); // 让系统返回键先关弹层，而不是直接退出 App

  // 下滑关闭（仅当面板内容滚到顶部时）。全屏页面不启用，避免整页被拖走。
  let startY = null;
  let startX = null;
  let dragging = false;
  const onTouchStart = (e) => {
    if (fullscreen || !dismissible) return;
    if (bodyNode.scrollTop > 2) { startY = null; return; }
    const t = e.touches[0];
    startY = t.clientY; startX = t.clientX; dragging = false;
  };
  const onTouchMove = (e) => {
    if (startY == null) return;
    const t = e.touches[0];
    const dy = t.clientY - startY;
    const dx = t.clientX - startX;
    if (!dragging && Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) dragging = true;
    if (dragging && dy > 0) {
      panel.style.transition = 'none';
      panel.style.transform = `translateY(${dy}px)`;
    }
  };
  const onTouchEnd = (e) => {
    if (startY == null) return;
    const t = e.changedTouches[0];
    const dy = t.clientY - startY;
    panel.style.transition = '';
    panel.style.transform = '';
    startY = null;
    if (dragging && dy > 110) entry.close();
  };
  overlay.addEventListener('touchstart', onTouchStart, { passive: true });
  overlay.addEventListener('touchmove', onTouchMove, { passive: true });
  overlay.addEventListener('touchend', onTouchEnd, { passive: true });

  const onBackdrop = (e) => { if (e.target === overlay && dismissible) entry.close(); };
  overlay.addEventListener('click', onBackdrop);

  entry._cleanup = () => {
    overlay.removeEventListener('click', onBackdrop);
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 340);
    const idx = stack_ui_modal.indexOf(entry);
    if (idx >= 0) stack_ui_modal.splice(idx, 1);
    unlockScroll();
    consumeOverlayHistory_ui_modal();   // 清掉打开时压入的那条历史记录
    onClose?.(entry._result);
  };
  return entry;
}

/* ------------------------------ 进度遮罩 ------------------------------- */

let progressEntry_ui_modal = null;

function showProgress_ui_modal({ title = '处理中…', note = '', percent = null } = {}) {
  hideProgress_ui_modal();
  const bar = el('div', { class: 'progress-bar', style: percent == null ? { display: 'none' } : {} }, [el('span')]);
  const noteNode = el('p', { text: note });
  const overlay = el('div', { class: 'progress-overlay' }, [
    el('div', { class: 'progress-card' }, [
      el('div', { class: 'spinner' }),
      el('h4', { text: title }),
      noteNode,
      bar,
    ]),
  ]);
  $('#progressRoot').appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));
  progressEntry_ui_modal = {
    overlay, noteNode, bar,
    update: ({ note: n, percent: p, title: t } = {}) => {
      if (n != null) noteNode.textContent = n;
      if (t != null) overlay.querySelector('h4').textContent = t;
      if (p != null) {
        bar.style.display = '';
        bar.firstChild.style.width = `${Math.round(p * 100)}%`;
      }
    },
    close: () => {
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 260);
      progressEntry_ui_modal = null;
    },
  };
  return progressEntry_ui_modal;
}

function hideProgress_ui_modal() {
  if (progressEntry_ui_modal) { progressEntry_ui_modal.close(); progressEntry_ui_modal = null; }
}

/* ---------------------------- 图片查看器 ------------------------------ */

function openImageViewer_ui_modal(src, { caption = '', actions = [] } = {}) {
  // 查看器允许叠在面板之上，但同类查看器只保留一个
  document.querySelectorAll('.viewer-overlay').forEach((n) => n.remove());
  const overlay = el('div', { class: 'viewer-overlay' });
  const img = el('img', { src, alt: caption });
  const bar = el('div', { class: 'viewer-bar' }, actions);
  const closeBtn = el('button', { class: 'viewer-close', html: '✕', 'aria-label': '关闭', onclick: () => close() });
  overlay.append(img, bar, closeBtn);
  if (caption) overlay.appendChild(el('div', { class: 'viewer-caption', text: caption, style: { position: 'absolute', top: 'calc(20px + env(safe-area-inset-top))', left: '50%', transform: 'translateX(-50%)', color: '#f3e8d6', fontSize: '13px', opacity: '0.8', maxWidth: '80vw', textAlign: 'center' } }));
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));
  lockScroll();
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  const close = () => {
    document.removeEventListener('keydown', onKey);
    overlay.classList.remove('show');
    unlockScroll();
    setTimeout(() => overlay.remove(), 280);
  };
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  return { close, overlay };
}

/* ------------------------------ 选择器 -------------------------------- */

function pickOption_ui_modal({ title = '请选择', options = [], value = null, columns = 1 }) {
  return new Promise((resolve) => {
    const list = el('div', { class: 'picker-list' });
    let current = value;
    const render = () => {
      clear(list);
      for (const opt of options) {
        const item = el('button', {
          class: `picker-item ${current === opt.value ? 'active' : ''}`,
          onclick: () => { current = opt.value; sheet.close(current); resolve(current); },
        }, [
          opt.icon ? el('span', { text: opt.icon, style: { fontSize: '18px' } }) : null,
          el('span', { style: { flex: '1' } }, [
            el('b', { text: opt.label, style: { display: 'block', fontSize: '14px', fontWeight: '500' } }),
            opt.desc ? el('small', { text: opt.desc, style: { color: 'var(--text-3)', fontSize: '11.5px' } }) : null,
          ]),
          current === opt.value ? el('span', { text: '✓', style: { color: 'var(--brand)' } }) : null,
        ]);
        list.appendChild(item);
      }
    };
    render();
    const sheet = openSheet_ui_modal({
      title, body: list, size: 'half',
      onClose: () => resolve(current),
    });
    void columns;
  });
}

function promptDialog_ui_modal({
  title = '请输入', label = '', value = '', placeholder = '', type = 'text', okText = '确定',
  hint = '', maxLength = null, multiline = false,
}) {
  return new Promise((resolve) => {
    const input = multiline
      ? el('textarea', { class: 'textarea', placeholder, rows: 4, maxlength: maxLength || null })
      : el('input', { class: 'input', type, value, placeholder, maxlength: maxLength || null });
    if (multiline) input.value = value; else input.value = value;
    const field = el('label', { class: 'field' }, [
      label ? el('span', { class: 'field-label', text: label }) : null,
      input,
      hint ? el('p', { class: 'field-hint', text: hint }) : null,
    ]);
    const modal = openModal_ui_modal({
      title,
      content: field,
      actions: [
        el('button', { class: 'btn btn-ghost', text: '取消', onclick: () => modal.close(null) }),
        el('button', {
          class: 'btn btn-primary', text: okText,
          onclick: () => modal.close(input.value),
        }),
      ],
      // 统一在这里解析：用户点确定 → 拿到输入值；取消/返回键/点遮罩 → null
      onClose: (result) => resolve(result == null ? null : result),
    });
    setTimeout(() => input.focus(), 120);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !multiline) { modal.close(input.value); }
    });
  });
}



return { "toast": toast, "confirmDialog": confirmDialog, "openModal": openModal_ui_modal, "closeModal": closeModal_ui_modal, "closeTopOverlay": closeTopOverlay_ui_modal, "openSheet": openSheet_ui_modal, "showProgress": showProgress_ui_modal, "hideProgress": hideProgress_ui_modal, "openImageViewer": openImageViewer_ui_modal, "pickOption": pickOption_ui_modal, "promptDialog": promptDialog_ui_modal };
} };
/* ================= js/ui/calendar.js ================= */
__defs["js/ui/calendar.js"] = { exports: ["WEEK_CN","daysInMonth","countWords","toast","openCalendar","entryRow","streak","openSearch","openDateJump"], fn: function (module) {
var { "el": el, "clear": clear, "toKey": toKey, "fromKey": fromKey, "todayKey": todayKey, "formatCN": formatCN, "lunarCN": lunarCN, "festivalCN": festivalCN, "solarTermCN": solarTermCN, "monthMatrix": monthMatrix, "daysInMonth": daysInMonth, "addMonths": addMonths, "countWords": countWords, "htmlToText": htmlToText, "WEEK_CN": WEEK_CN, "toast": toast } = __m("js/core/utils.js");
var { "openSheet": openSheet, "openModal": openModal } = __m("js/ui/modal.js");
var { "listEntries": listEntries } = __m("js/core/storage.js");
/* ==========================================================================
 * 日记本 · 日历与日期选择
 *  · 月历视图：农历/节日/节气、写作标记、加锁标记
 *  · 三种模式：浏览（点日期跳转）、挑选（多选导出）、范围
 *  · 日记清单：按月列出所有日记，支持单条打开
 * ========================================================================== */





const WEEK_LABELS_ui_calendar = ['日', '一', '二', '三', '四', '五', '六'];

/**
 * 打开日历
 * @param {object} opts
 *   mode: 'browse' | 'pick'
 *   selected: Set<string>
 *   entries: 传入则复用，否则自行读取
 *   onPickDate(dateKey) 浏览模式点击日期
 *   onConfirm(Set<string>) 挑选模式确认
 *   onOpenEntry(dateKey)
 */
async function openCalendar_ui_calendar(opts = {}) {
  const {
    mode = 'browse',
    selected = new Set(),
    onPickDate = null,
    onConfirm = null,
    onOpenEntry = null,
    title = null,
  } = opts;

  const entries = opts.entries || await listEntries();
  const entryMap = new Map(entries.map((e) => [e.date, e]));
  const chosen = new Set(selected);
  let cursor = opts.cursor ? fromKey(opts.cursor) : fromKey(todayKey());

  const gridWrap = el('div');
  const listWrap = el('div');
  const monthLabel = el('div', { class: 'cal-month' });
  const footInfo = el('div', { style: { fontSize: '12.5px', color: 'var(--text-3)' } });

  const renderMonth = () => {
    monthLabel.textContent = `${cursor.getFullYear()} 年 ${cursor.getMonth() + 1} 月`;
    clear(gridWrap);

    const head = el('div', { class: 'cal-weekdays' }, WEEK_LABELS_ui_calendar.map((w) => el('span', { text: w })));
    const grid = el('div', { class: 'cal-grid' });
    const cells = monthMatrix(cursor.getFullYear(), cursor.getMonth() + 1);
    const today = todayKey();

    for (const date of cells) {
      if (!date) { grid.appendChild(el('div', { class: 'cal-cell blank' })); continue; }
      const key = toKey(date);
      const entry = entryMap.get(key);
      const isToday = key === today;
      const isSelected = chosen.has(key);
      const sub = festivalCN(date) || solarTermCN(date) || (opts.showLunar === false ? '' : lunarCN(date));
      const cell = el('button', {
        class: ['cal-cell',
          isToday ? 'today' : '',
          isSelected ? 'selected' : '',
          entry ? 'has-entry' : '',
          entry?.locked ? 'locked' : '',
          isSelected && mode === 'pick' ? 'marked' : ''].filter(Boolean).join(' '),
        onclick: () => handleCellClick(key),
      }, [
        el('span', { class: 'cal-num', text: String(date.getDate()) }),
        sub ? el('span', { class: 'cal-sub', text: String(sub).slice(0, 3) }) : null,
        entry ? el('span', { class: 'cal-dot' }) : null,
      ]);
      if (entry?.weather?.kind) {
        cell.title = `${key} · ${entry.title || '无标题'}${entry.weather?.text ? ` · ${entry.weather.text}` : ''}`;
      }
      grid.appendChild(cell);
    }

    gridWrap.append(head, grid, buildLegend());

    // 本月日记清单
    clear(listWrap);
    const monthPrefix = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
    const monthEntries = entries.filter((e) => e.date.startsWith(monthPrefix));
    if (monthEntries.length) {
      const group = el('div', { class: 'cal-month-group' }, [
        el('h3', { text: `本月 ${monthEntries.length} 篇` }),
      ]);
      for (const entry of monthEntries) {
        group.appendChild(entryRow_ui_calendar(entry, { mode, chosen, onToggle: () => togglePick(entry.date), onOpen: onOpenEntry }));
      }
      listWrap.appendChild(group);
    } else {
      listWrap.appendChild(el('div', { class: 'empty-state' }, [
        el('div', { class: 'icon', text: '🗓' }),
        el('h4', { text: '这个月还没有日记' }),
        el('p', { text: '点上面的日期，或直接回到今天开始写吧。' }),
      ]));
    }
  };

  const buildLegend = () => el('div', { class: 'cal-legend' }, [
    el('span', {}, [el('i', { style: { background: 'var(--brand)' } }), '有日记']),
    el('span', {}, [el('i', { style: { background: 'var(--accent)' } }), '已上锁']),
    el('span', {}, [el('i', { style: { background: 'var(--brand-2)', borderRadius: '2px' } }), '今天']),
  ]);

  const handleCellClick = (key) => {
    if (mode === 'pick') { togglePick(key); return; }
    if (opts.selectionMode === 'range') { togglePick(key); return; }
    onPickDate?.(key);
    sheet.close();
  };

  const togglePick = (key) => {
    if (chosen.has(key)) chosen.delete(key); else chosen.add(key);
    updateFoot();
    renderMonth();
  };

  const updateFoot = () => {
    if (mode === 'pick') {
      footInfo.textContent = chosen.size ? `已选 ${chosen.size} 天` : '点日期勾选要导出的日记';
    } else {
      const total = entries.length;
      footInfo.textContent = `共 ${total} 篇日记 · 连续记录 ${streak_ui_calendar(entries)} 天`;
    }
  };

  renderMonth();
  updateFoot();

  const headExtra = el('button', {
    class: 'icon-btn', html: '⌖', title: '回到今天',
    onclick: () => { cursor = fromKey(todayKey()); renderMonth(); },
  });

  const body = el('div', {}, [
    el('div', { class: 'cal-head' }, [
      el('button', { class: 'cal-nav', html: '‹', 'aria-label': '上个月', onclick: () => { cursor = addMonths(cursor, -1); renderMonth(); } }),
      monthLabel,
      el('button', { class: 'cal-nav', html: '›', 'aria-label': '下个月', onclick: () => { cursor = addMonths(cursor, 1); renderMonth(); } }),
    ]),
    gridWrap,
    listWrap,
  ]);

  const footer = mode === 'pick'
    ? el('div', { class: 'sheet-foot' }, [
      footInfo,
      el('div', { class: 'spacer' }),
      el('button', { class: 'btn btn-ghost btn-sm', text: '全选本月', onclick: () => selectMonth() }),
      el('button', { class: 'btn btn-primary', text: '确定', onclick: () => { onConfirm?.(new Set(chosen)); sheet.close(); } }),
    ])
    : el('div', { class: 'sheet-foot' }, [
      footInfo,
      el('div', { class: 'spacer' }),
      el('button', {
        class: 'btn btn-secondary btn-sm', text: '选择导出…',
        onclick: () => {
          sheet.close();
          openCalendar_ui_calendar({ ...opts, mode: 'pick', selected: chosen });
        },
      }),
    ]);

  function selectMonth() {
    const prefix = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
    const all = entries.filter((e) => e.date.startsWith(prefix));
    const everySelected = all.length && all.every((e) => chosen.has(e.date));
    for (const e of all) {
      if (everySelected) chosen.delete(e.date); else chosen.add(e.date);
    }
    updateFoot();
    renderMonth();
  }

  const sheet = openSheet({
    title: title || (mode === 'pick' ? '选择要导出的日记' : '我的日记日历'),
    subtitle: mode === 'pick' ? '可以按天勾选，也可以在下面整月切换' : '点击日期查看当天的日记',
    body,
    footer,
    size: 'tall',
    headExtra,
  });

  return sheet;
}

/** 一行日记摘要（用于日历清单和搜索结果） */
function entryRow_ui_calendar(entry, { mode = 'browse', chosen = new Set(), onToggle = null, onOpen = null } = {}) {
  const preview = htmlToText(entry.body || '').replace(/\s+/g, ' ').slice(0, 80);
  const selected = chosen.has(entry.date);
  const row = el('div', { class: `entry-row ${selected ? 'selected' : ''}` });
  if (mode === 'pick') {
    row.appendChild(el('div', { class: 'check', text: '✓' }));
  }
  const info = el('div', { class: 'info' }, [
    el('b', { text: entry.title?.trim() || `${entry.date} 的日记` }),
    el('p', { text: preview || '（还没有写内容）' }),
    el('div', { class: 'tags' }, [
      el('span', { class: 'chip chip-ghost', text: entry.date }),
      entry.locked ? el('span', { class: 'chip', style: { background: 'color-mix(in srgb, var(--accent) 16%, transparent)', color: 'var(--accent)' }, text: '🔒 已上锁' }) : null,
      entry.weather?.text ? el('span', { class: 'chip chip-ghost', text: `${entry.weather.text} ${entry.weather.temp ?? ''}°` }) : null,
      entry.wordCount ? el('span', { class: 'chip chip-ghost', text: `${entry.wordCount} 字` }) : null,
      (entry.revisions?.length || 0) > 0 ? el('span', { class: 'chip chip-ghost', text: `批改 ${entry.revisions.length} 次` }) : null,
    ]),
  ]);
  row.appendChild(info);
  row.addEventListener('click', () => {
    if (mode === 'pick') onToggle?.();
    else onOpen?.(entry.date);
  });
  return row;
}

/** 连续记录天数 */
function streak_ui_calendar(entries) {
  const dates = new Set(entries.map((e) => e.date));
  let count = 0;
  let cursor = fromKey(todayKey());
  if (!dates.has(toKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dates.has(toKey(cursor))) return 0;
  }
  while (dates.has(toKey(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

/** 搜索日记（标题 + 正文） */
async function openSearch_ui_calendar({ onOpen = null } = {}) {
  const entries = await listEntries();
  const input = el('input', { class: 'input', type: 'search', placeholder: '搜索标题或内容…' });
  const results = el('div', { style: { marginTop: '14px' } });

  const run = () => {
    const q = input.value.trim().toLowerCase();
    clear(results);
    if (!q) {
      results.appendChild(el('div', { class: 'empty-state' }, [
        el('div', { class: 'icon', text: '🔍' }),
        el('h4', { text: '输入关键词开始搜索' }),
        el('p', { text: '可以搜标题、正文、标签；已上锁的日记内容不会出现在结果里。' }),
      ]));
      return;
    }
    const hits = entries.filter((e) => {
      const text = `${e.title || ''} ${e.locked ? '' : htmlToText(e.body || '')} ${(e.tags || []).join(' ')}`.toLowerCase();
      return text.includes(q);
    });
    if (!hits.length) {
      results.appendChild(el('div', { class: 'empty-state' }, [
        el('div', { class: 'icon', text: '🫙' }),
        el('h4', { text: '没有找到相关日记' }),
        el('p', { text: `试试别的关键词，或者换一个字再搜。` }),
      ]));
      return;
    }
    results.appendChild(el('div', { class: 'cal-month-group' }, [el('h3', { text: `找到 ${hits.length} 篇` })]));
    for (const entry of hits) {
      const row = entryRow_ui_calendar(entry, { onOpen: (date) => { sheet.close(); onOpen?.(date); } });
      // 高亮关键词
      const preview = row.querySelector('p');
      if (preview && !entry.locked) {
        preview.innerHTML = highlight_ui_calendar(preview.textContent, q);
      }
      results.appendChild(row);
    }
  };

  input.addEventListener('input', debounceLocal_ui_calendar(run, 180));
  const sheet = openSheet({ title: '搜索日记', body: el('div', {}, [input, results]), size: 'tall' });
  run();
  setTimeout(() => input.focus(), 200);
  return sheet;
}

function highlight_ui_calendar(text = '', q = '') {
  const idx = text.toLowerCase().indexOf(q);
  if (idx < 0) return escapeLocal_ui_calendar(text);
  return `${escapeLocal_ui_calendar(text.slice(0, idx))}<mark style="background:color-mix(in srgb, var(--brand-3) 55%, transparent);border-radius:3px;padding:0 2px">${escapeLocal_ui_calendar(text.slice(idx, idx + q.length))}</mark>${escapeLocal_ui_calendar(text.slice(idx + q.length))}`;
}

function escapeLocal_ui_calendar(s = '') {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function debounceLocal_ui_calendar(fn, ms) {
  let t = null;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/** 日期快速跳转：选择年 / 月 */
async function openDateJump_ui_calendar({ onPick }) {
  const entries = await listEntries();
  const years = new Set(entries.map((e) => Number(e.date.slice(0, 4))));
  years.add(new Date().getFullYear());
  const sorted = [...years].sort((a, b) => b - a);

  const content = el('div', {});
  const yearRow = el('div', { class: 'city-grid' });
  const monthRow = el('div', { class: 'city-grid' });
  let year = new Date().getFullYear();

  const renderMonths = () => {
    clear(monthRow);
    const prefix = String(year);
    const monthsWith = new Set(entries.filter((e) => e.date.startsWith(prefix)).map((e) => Number(e.date.slice(5, 7))));
    for (let m = 1; m <= 12; m++) {
      monthRow.appendChild(el('button', {
        class: `city-chip ${m === new Date().getMonth() + 1 && year === new Date().getFullYear() ? 'active' : ''}`,
        text: `${m} 月${monthsWith.has(m) ? ' ·' : ''}`,
        onclick: () => {
          modal.close();
          onPick?.(`${year}-${String(m).padStart(2, '0')}-01`);
        },
      }));
    }
  };

  for (const y of sorted) {
    yearRow.appendChild(el('button', {
      class: `city-chip ${y === year ? 'active' : ''}`,
      text: `${y}`,
      onclick: () => {
        year = y;
        clear(yearRow);
        for (const yy of sorted) {
          yearRow.appendChild(el('button', {
            class: `city-chip ${yy === year ? 'active' : ''}`, text: `${yy}`,
            onclick: (e) => { year = yy; [...yearRow.children].forEach((c) => c.classList.remove('active')); e.currentTarget.classList.add('active'); renderMonths(); },
          }));
        }
        renderMonths();
      },
    }));
  }
  renderMonths();
  content.append(el('p', { class: 'field-label', text: '年份' }), yearRow, el('p', { class: 'field-label', text: '月份' }), monthRow);

  const modal = openModal({ title: '跳转到某个月', content });
}



return { "WEEK_CN": WEEK_CN, "daysInMonth": daysInMonth, "countWords": countWords, "toast": toast, "openCalendar": openCalendar_ui_calendar, "entryRow": entryRow_ui_calendar, "streak": streak_ui_calendar, "openSearch": openSearch_ui_calendar, "openDateJump": openDateJump_ui_calendar };
} };
/* ================= js/ui/diagnostics.js ================= */
__defs["js/ui/diagnostics.js"] = { exports: ["openDiagnostics"], fn: function (module) {
var { "el": el, "clear": clear, "toast": toast, "countWords": countWords, "downloadBlob": downloadBlob } = __m("js/core/utils.js");
var { "openSheet": openSheet } = __m("js/ui/modal.js");
var { "currentSession": currentSession, "getEntry": getEntry, "saveEntry": saveEntry, "deleteEntry": deleteEntry, "settingsGet": settingsGet, "putImage": putImage, "deleteImage": deleteImage, "getImage": getImage } = __m("js/core/storage.js");
var { "encryptJSON": encryptJSON, "decryptJSON": decryptJSON, "makeVerifier": makeVerifier, "verifyPassword": verifyPassword, "keyFingerprint": keyFingerprint } = __m("js/core/crypto.js");
var { "sketchify": sketchify, "canvasToBlob": canvasToBlob } = __m("js/core/image-engine.js");
var { "renderHandwriting": renderHandwriting, "getPreset": getPreset } = __m("js/features/handwriting.js");
var { "buildDocx": buildDocx, "buildDiaryPDF": buildDiaryPDF, "loadPdfFont": loadPdfFont } = __m("js/features/export.js");
var { "fetchWeather": fetchWeather, "weatherSVG": weatherSVG } = __m("js/features/weather.js");
/* ==========================================================================
 * 日记本 · 功能自检
 *  在真实浏览器里逐项检查：运行环境 / 数据库 / 加密 / 图片素描 / 手写渲染 /
 *  文档导出 / 天气接口。用来快速确认「这台设备上功能是否正常」。
 * ========================================================================== */










/** 生成一张测试用图片（渐变 + 圆 + 线条，便于观察素描效果） */
async function makeTestPhoto_ui_diagnostics() {
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 520;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 720, 520);
  grad.addColorStop(0, '#8fc7e8');
  grad.addColorStop(1, '#f6e7c1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 720, 520);
  ctx.fillStyle = '#3f6b4a';
  ctx.beginPath();
  ctx.arc(210, 300, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c04434';
  ctx.beginPath();
  ctx.arc(500, 200, 78, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2b3a55';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(60, 460);
  ctx.bezierCurveTo(240, 360, 420, 520, 680, 400);
  ctx.stroke();
  ctx.fillStyle = '#2f2a24';
  ctx.font = '600 44px sans-serif';
  ctx.fillText('测试图片 Test 123', 60, 90);
  return canvasToBlob(canvas, 'image/png');
}

const CHECKS_ui_diagnostics = [
  {
    id: 'env',
    name: '运行环境',
    hint: '加密 / 离线 / 存储能力',
    async run() {
      const issues = [];
      const LAN_HTTP = !window.isSecureContext && !/^https:/i.test(location.protocol);
      if (!window.isSecureContext) {
        issues.push(LAN_HTTP
          ? '当前是 HTTP 访问，浏览器把「加密（WebCrypto）」列为不安全功能'
          : '非安全上下文（建议用 http://localhost 或 HTTPS 打开）');
      }
      if (!globalThis.crypto?.subtle) issues.push('缺少 WebCrypto，上锁日记将不可用');
      if (!('indexedDB' in window)) issues.push('缺少 IndexedDB，无法保存数据');
      if (!('serviceWorker' in navigator)) issues.push('不支持 Service Worker（离线缓存不可用，其他功能正常）');
      const fatal = issues.some((i) => i.includes('无法保存数据'));
      let detail = issues.length ? issues.join('；') : `协议 ${location.protocol} · ${navigator.userAgent.includes('Mobile') ? '移动端' : '桌面端'} · 屏幕 ${window.innerWidth}×${window.innerHeight}`;
      if (LAN_HTTP) {
        detail += '\n💡 想让手机也能用加密上锁：把 App 装成真正的应用（见 构建/README-安装说明.md），'
          + '或让页面走 HTTPS / 用电脑的 localhost 打开。其他功能不受影响。';
      }
      return { ok: !fatal, detail };
    },
  },
  {
    id: 'storage',
    name: '数据库读写',
    hint: '日记的保存与读取',
    async run() {
      if (!currentSession()?.accountId) return { ok: false, detail: '尚未登录账号' };
      const date = '1970-01-01';
      const prev = await getEntry(date);
      await saveEntry({ date, title: '自检临时数据', body: '<p>self check</p>', wordCount: 2 });
      const back = await getEntry(date);
      const ok = back?.title === '自检临时数据';
      // 还原
      if (prev) await saveEntry(prev); else await deleteEntry(date);
      return { ok, detail: ok ? '写入 / 读取 / 清理均正常' : '读回的数据与写入不一致' };
    },
  },
  {
    id: 'crypto',
    name: '加密与密码',
    hint: '上锁日记的 AES-GCM 加解密',
    async run() {
      if (!window.isSecureContext || !globalThis.crypto?.subtle) {
        return {
          ok: false,
          detail: '当前环境不支持 WebCrypto：HTTP 访问（尤其是局域网地址）下浏览器会禁用加密。'
            + '\n换用 http://localhost 打开、给站点配 HTTPS，或把 App 打包成安装版即可正常上锁。',
        };
      }
      const payload = { body: '绝密内容：今天偷吃了两个橘子。', title: '测试' };
      const enc = await encryptJSON(payload, 'test-1234');
      const dec = await decryptJSON(enc, 'test-1234');
      const ok = dec.body === payload.body;
      let wrongRejected = false;
      try { await decryptJSON(enc, 'wrong-password'); } catch { wrongRejected = true; }
      const { salt, verifier } = await makeVerifier('我的登录密码');
      const loginOk = await verifyPassword('我的登录密码', { salt, verifier });
      const fp1 = await keyFingerprint('abc', salt);
      const fp2 = await keyFingerprint('abc', salt);
      return {
        ok: ok && wrongRejected && loginOk && fp1 === fp2,
        detail: `加解密 ${ok ? '正常' : '异常'} · 错误密码 ${wrongRejected ? '已拒绝' : '未拒绝'} · 登录校验 ${loginOk ? '正常' : '异常'}`,
      };
    },
  },
  {
    id: 'image',
    name: '图片转素描',
    hint: '本地算法（铅笔素描）',
    async run() {
      const t0 = performance.now();
      const photo = await makeTestPhoto_ui_diagnostics();
      const res = await sketchify(photo, { style: 'pencil', strength: 0.6, contrast: 1.1, grain: 0.35, maxSide: 640 });
      const ms = Math.round(performance.now() - t0);
      window.__rijiTestSketch = res.blob;
      return {
        ok: res.blob.size > 2000,
        detail: `${res.width}×${res.height} · ${(res.blob.size / 1024).toFixed(0)} KB · 耗时 ${ms}ms`,
      };
    },
  },
  {
    id: 'handwriting',
    name: '文字转手写',
    hint: '按选定字体渲染手写稿',
    async run() {
      const t0 = performance.now();
      const preset = getPreset('kai');
      const res = await renderHandwriting(
        '<p>自检手写渲染：写下的日子不会消失。</p><p>1234567890 ABC abc</p>',
        { fontStack: preset.stack.join(', '), jitter: 0.5, inkBleed: 0.35, width: 900, maxHeight: 1200 },
      );
      const ms = Math.round(performance.now() - t0);
      if (!res || !res.blob) throw new Error('渲染没有返回图片数据');
      window.__rijiTestHandwriting = res.blob;
      return {
        ok: res.blob.size > 3000,
        detail: `${res.width}×${res.height} · ${(res.blob.size / 1024).toFixed(0)} KB · 字体栈 ${preset.stack[0]} · 耗时 ${ms}ms`,
      };
    },
  },
  {
    id: 'pdf',
    name: 'PDF 导出',
    hint: '内嵌中文字体',
    async run() {
      const t0 = performance.now();
      let font = null;
      let fontNote = '未内嵌字体（将回落为英文基础字体）';
      try {
        font = await loadPdfFont('assets/fonts/pdf-cjk.ttf');
        fontNote = `已加载字体，${font.numGlyphs} 个字形`;
      } catch (err) {
        fontNote = `字体加载失败：${err.message}（可运行 tools/make-pdf-font.mjs 生成）`;
      }
      const entries = [{
        date: '2025-01-01',
        title: '导出功能自检',
        weather: { city: '杭州', text: '晴', temp: 12 },
        mood: '🙂',
        wordCount: 20,
        body: '<p>这是一段用于验证 PDF 导出的中文文本，包含标点符号：，。！？；：“”《》。</p><p>Paragraph with English and numbers 2025.</p>',
        images: [],
        drawings: [],
      }];
      const blob = await buildDiaryPDF(entries, {
        font, pageSize: 'a5', title: '自检文档', imagesResolver: async () => null,
      });
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const head = new TextDecoder('latin1').decode(bytes.slice(0, 8));
      const tailOk = new TextDecoder('latin1').decode(bytes.slice(-8)).includes('EOF');
      const ms = Math.round(performance.now() - t0);
      window.__rijiTestPdf = blob;
      return {
        ok: head.startsWith('%PDF') && tailOk && bytes.length > 3000,
        detail: `${(bytes.length / 1024).toFixed(1)} KB · 耗时 ${ms}ms · ${fontNote}`,
      };
    },
  },
  {
    id: 'docx',
    name: 'Word 导出',
    hint: 'ZIP + WordprocessingML',
    async run() {
      const t0 = performance.now();
      const blob = await buildDocx([{
        date: '2025-01-01',
        title: '导出功能自检',
        weather: { city: '杭州', text: '晴', temp: 12 },
        wordCount: 12,
        body: '<p><b>加粗</b>、<i>斜体</i>、<u>下划线</u>，以及中文标点：，。！？</p>',
        images: [],
        drawings: [],
      }], { fontName: '楷体', title: '自检文档', imagesResolver: async () => null });
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;
      const ms = Math.round(performance.now() - t0);
      window.__rijiTestDocx = blob;
      return {
        ok: isZip && bytes.length > 1500,
        detail: `${(bytes.length / 1024).toFixed(1)} KB · 耗时 ${ms}ms · ZIP 头 ${isZip ? '正常' : '异常'}`,
      };
    },
  },
  {
    id: 'weather',
    name: '天气服务',
    hint: 'Open-Meteo 免密钥接口',
    async run() {
      if (!navigator.onLine) return { ok: false, detail: '当前设备无网络（可离线写作，天气会保留上次结果）' };
      const t0 = performance.now();
      const data = await fetchWeather({ lat: 30.2741, lon: 120.1551, city: '杭州', force: true });
      const ms = Math.round(performance.now() - t0);
      return {
        ok: typeof data.temp === 'number',
        detail: `${data.text} ${data.temp}℃（${data.tempMin}~${data.tempMax}℃）· 湿度 ${data.humidity}% · 耗时 ${ms}ms`,
      };
    },
  },
  {
    id: 'image-io',
    name: '图片存取',
    hint: '图片写入数据库并读回',
    async run() {
      const photo = window.__rijiTestSketch || await makeTestPhoto_ui_diagnostics();
      const rec = await putImage(photo, { kind: 'photo', name: 'self-check' });
      const back = await getImage(rec.id);
      const ok = !!back && back.size === photo.size;
      await deleteImage(rec.id);
      return { ok, detail: ok ? `写入 ${(photo.size / 1024).toFixed(0)} KB 并正确读回` : '读回的数据大小不一致' };
    },
  },
];

/**
 * 打开自检面板
 * @param {object} ctx { settings }
 */
async function openDiagnostics_ui_diagnostics(ctx = {}) {
  const list = el('div', {});
  const summary = el('div', { class: 'field-hint', style: { marginBottom: '12px' }, text: '点「开始自检」，会逐项验证这台设备上的功能是否正常。' });
  const actions = el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' } });

  const renderResults = (results) => {
    clear(list);
    for (const item of results) {
      const control = el('div', { class: 'control' });
      const row = el('div', { class: 'set-item' }, [
        el('div', {
          class: 'info',
          style: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
        }, [
          el('span', {
            text: item.state === 'ok' ? '✅' : item.state === 'fail' ? '❌' : item.state === 'running' ? '⏳' : '•',
            style: { fontSize: '16px', lineHeight: '1.4' },
          }),
          el('div', { style: { flex: '1', minWidth: '0' } }, [
            el('b', { text: item.name }),
            el('small', { text: item.detail || item.hint }),
            item.ms != null ? el('small', { text: `耗时 ${item.ms}ms`, style: { color: 'var(--text-3)' } }) : null,
          ]),
        ]),
        control,
      ]);
      // 素描 / 手写 / 文档类结果给出预览或下载
      if (item.id === 'image' && window.__rijiTestSketch) {
        control.appendChild(el('button', {
          class: 'btn btn-ghost btn-sm', text: '看素描',
          onclick: async () => {
            const { openImageViewer } = await __m("js/ui/modal.js");
            openImageViewer(URL.createObjectURL(window.__rijiTestSketch));
          },
        }));
      } else if (item.id === 'handwriting' && window.__rijiTestHandwriting) {
        control.appendChild(el('button', {
          class: 'btn btn-ghost btn-sm', text: '看手写稿',
          onclick: async () => {
            const { openImageViewer } = await __m("js/ui/modal.js");
            openImageViewer(URL.createObjectURL(window.__rijiTestHandwriting));
          },
        }));
      } else if ((item.id === 'pdf' && window.__rijiTestPdf) || (item.id === 'docx' && window.__rijiTestDocx)) {
        control.appendChild(el('button', {
          class: 'btn btn-ghost btn-sm', text: '下载样张',
          onclick: () => {
            const blob = item.id === 'pdf' ? window.__rijiTestPdf : window.__rijiTestDocx;
            downloadBlob(blob, `自检样张-${item.id}.${item.id === 'pdf' ? 'pdf' : 'docx'}`);
          },
        }));
      }
      list.appendChild(row);
    }
  };

  const runAll = async () => {
    const results = CHECKS_ui_diagnostics.map((c) => ({ id: c.id, name: c.name, hint: c.hint, state: 'running', detail: '正在检查…' }));
    renderResults(results);
    let passed = 0;
    for (let i = 0; i < CHECKS_ui_diagnostics.length; i++) {
      const check = CHECKS_ui_diagnostics[i];
      const t0 = performance.now();
      try {
        const res = await check.run();
        results[i] = { ...results[i], state: res.ok ? 'ok' : 'fail', detail: res.detail, ms: Math.round(performance.now() - t0) };
        if (res.ok) passed++;
      } catch (err) {
        const friendly = !window.isSecureContext && !globalThis.crypto?.subtle
          ? '当前是 HTTP 访问（尤其是局域网 IP），浏览器禁用了 WebCrypto，因此加密不可用。'
            + '\n解法：用 http://localhost 打开、给站点配置 HTTPS，或把 App 打包成安装版（见 构建/README-安装说明.md）。'
          : `异常：${err.message}`;
        results[i] = { ...results[i], state: 'fail', detail: friendly, ms: Math.round(performance.now() - t0) };
      }
      renderResults(results);
      summary.textContent = `进度 ${i + 1}/${CHECKS_ui_diagnostics.length} · 通过 ${passed} 项`;
      await new Promise((r) => setTimeout(r, 60));
    }
    const total = CHECKS_ui_diagnostics.length;
    summary.textContent = `自检完成：${passed} / ${total} 项通过${passed === total ? ' 🎉 一切正常' : '（未通过的项见下方说明）'}`;
    toast(passed === total ? '自检全部通过' : `有 ${total - passed} 项需要留意`, { type: passed === total ? 'success' : 'warn' });
  };

  actions.append(
    el('button', { class: 'btn btn-primary', text: '开始自检', onclick: runAll }),
    el('button', {
      class: 'btn btn-ghost btn-sm', text: '只测导出',
      onclick: async () => {
        const subset = CHECKS_ui_diagnostics.filter((c) => ['pdf', 'docx'].includes(c.id));
        const results = subset.map((c) => ({ id: c.id, name: c.name, hint: c.hint, state: 'running', detail: '正在检查…' }));
        renderResults(results);
        for (let i = 0; i < subset.length; i++) {
          const t0 = performance.now();
          try {
            const res = await subset[i].run();
            results[i] = { ...results[i], state: res.ok ? 'ok' : 'fail', detail: res.detail, ms: Math.round(performance.now() - t0) };
          } catch (err) {
            results[i] = { ...results[i], state: 'fail', detail: `异常：${err.message}` };
          }
          renderResults(results);
        }
      },
    }),
    el('button', {
      class: 'btn btn-ghost btn-sm', text: '清空测试数据',
      onclick: async () => {
        window.__rijiTestSketch = null;
        window.__rijiTestHandwriting = null;
        window.__rijiTestPdf = null;
        window.__rijiTestDocx = null;
        toast('已清空自检产生的临时数据');
      },
    }),
  );

  const body = el('div', {}, [
    summary,
    actions,
    el('div', { class: 'divider' }),
    list,
    el('div', { class: 'divider' }),
    el('p', {
      class: 'field-hint',
      html: `自检不会改动你已有的日记（写入的临时记录会立即清理）。<br>
      如果「PDF 导出」提示字体加载失败，请在本机运行一次
      <code>node tools/make-pdf-font.mjs</code> 生成 <code>assets/fonts/pdf-cjk.ttf</code>。`,
    }),
  ]);

  const sheet = openSheet({
    title: '功能自检',
    subtitle: '在这台设备 / 这个浏览器上逐项验证',
    size: 'tall',
    body,
  });

  const hint = el('div', { class: 'field-hint', style: { marginBottom: '6px' }, text: `当前账号：${currentSession()?.email || '未登录'} · 日记篇数将在自检后统计` });
  body.insertBefore(hint, summary);
  settingsGet().then((s) => {
    const draft = el('small', { text: `主题 ${s.theme} · 手写字体 ${s.handwriting?.styleId || 'kai'} · 纸张 ${s.paper?.style || 'cream'}`, style: { color: 'var(--text-3)', display: 'block', marginBottom: '10px' } });
    hint.after(draft);
  }).catch(() => {});

  void ctx;
  void countWords;
  void weatherSVG;
  return sheet;
}

return { "openDiagnostics": openDiagnostics_ui_diagnostics };
} };
/* ================= js/ui/drawing.js ================= */
__defs["js/ui/drawing.js"] = { exports: ["openDrawingBoard"], fn: function (module) {
var { "el": el, "clamp": clamp, "pickFiles": pickFiles } = __m("js/core/utils.js");
var { "openSheet": openSheet, "showProgress": showProgress, "hideProgress": hideProgress, "toast": toast } = __m("js/ui/modal.js");
var { "canvasToBlob": canvasToBlob } = __m("js/core/image-engine.js");
/* ==========================================================================
 * 日记本 · 手写板 / 涂鸦画布
 *  · 钢笔 / 铅笔 / 毛笔 / 荧光笔 / 橡皮，压感粗细，撤销重做
 *  · 输出 PNG，可直接插入日记（作为手写图层）
 * ========================================================================== */





const PENS_ui_drawing = [
  { id: 'pen', name: '钢笔', icon: '🖊', width: 2.6, alpha: 1, taper: true },
  { id: 'pencil', name: '铅笔', icon: '✏️', width: 2.2, alpha: 0.62, grain: true },
  { id: 'brush', name: '毛笔', icon: '🖌', width: 7, alpha: 0.92, taper: true, soft: true },
  { id: 'marker', name: '荧光笔', icon: '🖍', width: 14, alpha: 0.32, flat: true },
  { id: 'eraser', name: '橡皮', icon: '🧽', width: 18, erase: true },
];

const COLORS_ui_drawing = ['#20304a', '#111111', '#2f6f4f', '#a5382a', '#2f5aa5', '#8a5a15', '#7a3f8f', '#b5563c'];
const PAPERS_ui_drawing = [
  { id: 'paper', name: '纸张', color: '#fffdf6' },
  { id: 'grid', name: '方格', color: '#fffdf6', grid: true },
  { id: 'line', name: '横线', color: '#fffdf6', line: true },
  { id: 'transparent', name: '透明', color: 'rgba(0,0,0,0)' },
];

/**
 * 打开手写板
 * @param {object} opts { title, width, height, background, onDone(blob, meta), initialImage }
 */
async function openDrawingBoard_ui_drawing(opts = {}) {
  const W = opts.width || 1400;
  const H = opts.height || 1000;

  const canvas = el('canvas', { width: W, height: H });
  const ctx = canvas.getContext('2d');
  let pen = PENS_ui_drawing[0];
  let color = opts.color || COLORS_ui_drawing[0];
  let paper = PAPERS_ui_drawing[0];
  let sizeScale = 1;
  const undoStack = [];
  const redoStack = [];

  const paintPaper = () => {
    ctx.clearRect(0, 0, W, H);
    if (paper.id !== 'transparent') {
      ctx.fillStyle = paper.color;
      ctx.fillRect(0, 0, W, H);
      if (paper.grid) {
        ctx.strokeStyle = 'rgba(120,130,150,0.22)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= W; x += 48) { ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); ctx.stroke(); }
        for (let y = 0; y <= H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); ctx.stroke(); }
      }
      if (paper.line) {
        ctx.strokeStyle = 'rgba(120,130,150,0.25)';
        ctx.lineWidth = 1;
        for (let y = 72; y <= H; y += 72) { ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); ctx.stroke(); }
      }
    }
  };

  const snapshot = () => {
    try { undoStack.push(ctx.getImageData(0, 0, W, H)); } catch { /* 跨域保护 */ }
    if (undoStack.length > 24) undoStack.shift();
    redoStack.length = 0;
  };

  const restore = (stack, other) => {
    const data = stack.pop();
    if (!data) return;
    try { other.push(ctx.getImageData(0, 0, W, H)); } catch { /* ignore */ }
    ctx.putImageData(data, 0, 0);
  };

  paintPaper();
  if (opts.initialImage) {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(W / img.width, H / img.height, 1);
      ctx.drawImage(img, (W - img.width * scale) / 2, (H - img.height * scale) / 2, img.width * scale, img.height * scale);
    };
    img.src = typeof opts.initialImage === 'string' ? opts.initialImage : URL.createObjectURL(opts.initialImage);
  }

  /* ------------------------------ 绘制逻辑 ------------------------------ */
  let drawing = false;
  let last = null;
  let lastTime = 0;

  const pos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    const pressure = t.pressure && t.pressure > 0 && t.pressure !== 0.5 ? t.pressure : null;
    return {
      x: ((t.clientX - rect.left) / rect.width) * W,
      y: ((t.clientY - rect.top) / rect.height) * H,
      pressure,
    };
  };

  const startStroke = (e) => {
    e.preventDefault();
    snapshot();
    drawing = true;
    last = pos(e);
    lastTime = performance.now();
    drawDot(last);
  };

  const drawDot = (p) => {
    const w = pen.width * sizeScale * (p.pressure ? 0.6 + p.pressure : 1);
    ctx.save();
    ctx.globalAlpha = pen.alpha;
    ctx.globalCompositeOperation = pen.erase ? 'destination-out' : 'source-over';
    if (pen.soft) {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, w * 2.2);
      grad.addColorStop(0, color);
      grad.addColorStop(0.6, `${color}b0`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, w * 2.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = pen.erase ? '#000' : color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.6, w / 2), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const moveStroke = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const p = pos(e);
    const dt = Math.max(1, performance.now() - lastTime);
    const speed = Math.hypot(p.x - last.x, p.y - last.y) / dt;
    // 速度越快线条越细，模拟真实笔触
    const speedFactor = pen.taper ? clamp(1.25 - speed * 0.55, 0.45, 1.3) : 1;
    const w = pen.width * sizeScale * speedFactor * (p.pressure ? 0.6 + p.pressure : 1);

    ctx.save();
    ctx.globalAlpha = pen.alpha;
    ctx.globalCompositeOperation = pen.erase ? 'destination-out' : 'source-over';
    ctx.strokeStyle = pen.erase ? '#000' : color;
    ctx.lineWidth = Math.max(0.7, w);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (pen.grain) {
      ctx.setLineDash([1, 1.6]);
      ctx.globalAlpha = pen.alpha * 0.9;
    }
    if (pen.flat) ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.quadraticCurveTo(last.x, last.y, (last.x + p.x) / 2, (last.y + p.y) / 2);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.restore();

    last = p;
    lastTime = performance.now();
  };

  const endStroke = () => {
    if (!drawing) return;
    drawing = false;
    last = null;
  };

  canvas.addEventListener('touchstart', startStroke, { passive: false });
  canvas.addEventListener('touchmove', moveStroke, { passive: false });
  canvas.addEventListener('touchend', endStroke, { passive: true });
  canvas.addEventListener('touchcancel', endStroke, { passive: true });
  canvas.addEventListener('mousedown', startStroke);
  window.addEventListener('mousemove', moveStroke);
  window.addEventListener('mouseup', endStroke);

  /* ------------------------------ 工具界面 ------------------------------ */
  const penRow = el('div', { class: 'pen-row' });
  const renderPens = () => {
    penRow.innerHTML = '';
    for (const p of PENS_ui_drawing) {
      penRow.appendChild(el('button', {
        class: `pen-btn ${pen.id === p.id ? 'active' : ''}`,
        text: p.icon, title: p.name,
        onclick: () => { pen = p; renderPens(); },
      }));
    }
    penRow.appendChild(el('div', { class: 'tool-sep' }));
    for (const c of COLORS_ui_drawing) {
      penRow.appendChild(el('button', {
        class: `pen-btn ${color === c ? 'active' : ''}`,
        style: { background: c, width: '32px', height: '32px', minWidth: '32px' },
        title: c,
        onclick: () => { color = c; pen = PENS_ui_drawing[0]; renderPens(); },
      }));
    }
    penRow.appendChild(el('div', { class: 'tool-sep' }));
    for (const pp of PAPERS_ui_drawing) {
      penRow.appendChild(el('button', {
        class: `pen-btn ${paper.id === pp.id ? 'active' : ''}`,
        text: pp.id === 'grid' ? '▦' : pp.id === 'line' ? '≣' : pp.id === 'transparent' ? '◌' : '▢',
        title: `纸张：${pp.name}`,
        onclick: () => {
          snapshot();
          const keep = ctx.getImageData(0, 0, W, H);
          paper = pp;
          paintPaper();
          ctx.putImageData(keep, 0, 0, 0, 0, W, H);
          renderPens();
        },
      }));
    }
  };
  renderPens();

  const sizeVal = el('span', { class: 'val', text: sizeScale.toFixed(1) });
  const sizeSlider = el('input', {
    type: 'range', min: '0.4', max: '3', step: '0.1', value: String(sizeScale),
    oninput: (e) => { sizeScale = Number(e.target.value); sizeVal.textContent = sizeScale.toFixed(1); },
  });

  const tools = el('div', { class: 'canvas-tools' }, [
    penRow,
    el('div', { class: 'slider-row' }, [
      el('span', { text: '粗细' }),
      sizeSlider,
      sizeVal,
      el('button', { class: 'tool-btn', text: '↶', title: '撤销', onclick: () => restore(undoStack, redoStack) }),
      el('button', { class: 'tool-btn', text: '↷', title: '重做', onclick: () => restore(redoStack, undoStack) }),
      el('button', {
        class: 'tool-btn', text: '清空', title: '清空画布',
        onclick: () => { snapshot(); paintPaper(); },
      }),
    ]),
  ]);

  const stage = el('div', { class: 'canvas-stage' }, [canvas]);

  const sheet = openSheet({
    title: opts.title || '手写 / 涂鸦',
    subtitle: '用手指或触控笔直接写，写完插入日记',
    size: 'tall',
    fullscreen: true,   // 全屏页面
    body: el('div', { class: 'editor-wrap' }, [stage, tools]),
    footer: el('div', { class: 'sheet-foot' }, [
      el('button', {
        class: 'btn btn-ghost btn-sm', text: '插入图片…',
        onclick: async () => {
          const files = await pickFiles({ accept: 'image/*' });
          if (!files[0]) return;
          const img = new Image();
          img.onload = () => {
            const scale = Math.min(W / img.width, H / img.height, 1);
            ctx.drawImage(img, (W - img.width * scale) / 2, (H - img.height * scale) / 2, img.width * scale, img.height * scale);
          };
          img.src = URL.createObjectURL(files[0]);
        },
      }),
      el('div', { class: 'spacer' }),
      el('button', { class: 'btn btn-ghost', text: '取消', onclick: () => sheet.close() }),
      el('button', {
        class: 'btn btn-primary', text: '✓ 插入日记',
        onclick: async () => {
          showProgress({ title: '正在保存手写稿…' });
          try {
            const blob = await canvasToBlob(canvas, 'image/png');
            await opts.onDone?.(blob, {
              width: W, height: H,
              transparent: paper.id === 'transparent',
            });
            hideProgress();
            sheet.close();
            toast('手写稿已插入', { type: 'success' });
          } catch (err) {
            hideProgress();
            toast(`保存失败：${err.message}`, { type: 'error' });
          }
        },
      }),
    ]),
    onClose: () => {
      window.removeEventListener('mousemove', moveStroke);
      window.removeEventListener('mouseup', endStroke);
    },
  });

  // 视口适配：让画布在面板里尽量大
  requestAnimationFrame(() => {
    const box = stage.getBoundingClientRect();
    const ratio = W / H;
    let w = box.width - 24;
    let h = box.height - 24;
    if (w / h > ratio) w = h * ratio; else h = w / ratio;
    canvas.style.width = `${Math.floor(w)}px`;
    canvas.style.height = `${Math.floor(h)}px`;
  });

  return sheet;
}

return { "openDrawingBoard": openDrawingBoard_ui_drawing };
} };
/* ================= js/ui/sketch.js ================= */
__defs["js/ui/sketch.js"] = { exports: ["openSketchStudio","batchSketch"], fn: function (module) {
var { "el": el, "clamp": clamp, "toast": toast, "sleep": sleep } = __m("js/core/utils.js");
var { "openSheet": openSheet, "showProgress": showProgress, "hideProgress": hideProgress } = __m("js/ui/modal.js");
var { "SKETCH_PRESETS": SKETCH_PRESETS, "toSketch": toSketch } = __m("js/features/ai.js");
var { "sketchify": sketchify } = __m("js/core/image-engine.js");
var { "loadImageFromBlob": loadImageFromBlob, "imageToCanvas": imageToCanvas } = __m("js/core/image-engine.js");
/* ==========================================================================
 * 日记本 · 素描工坊（图片 → 素描）
 *  · 本地算法实时预览，可调「浓度 / 对比 / 颗粒 / 线条阈值 / 纸张」
 *  · 处理完成后可「插入日记」或「设为 App 背景」
 *  · 云端 AI 已在 ai.js 预留，设置里填好 Key 后会自动优先使用
 * ========================================================================== */







const PAPERS_ui_sketch = [
  { id: '#fdfaf1', name: '米白' },
  { id: '#ffffff', name: '纯白' },
  { id: '#f7ecd8', name: '牛皮' },
  { id: '#eef2f6', name: '冷灰' },
];

/**
 * 打开素描工坊
 * @param {object} opts { blob, settings, mode: 'insert'|'background', onDone(blob, meta), onCancel }
 */
async function openSketchStudio_ui_sketch(opts = {}) {
  const { blob, settings = {}, onDone, onCancel } = opts;
  let done = false;
  const finish = () => { done = true; };
  const aiConfig = settings.ai || {};
  const initial = aiConfig.sketch || {};

  let presetId = opts.presetId || 'pencil';
  let params = {
    strength: initial.strength ?? 0.6,
    contrast: initial.contrast ?? 1.12,
    grain: initial.grain ?? 0.35,
    threshold: initial.threshold ?? 0.12,
    paper: opts.paper || '#fdfaf1',
  };
  let resultBlob = blob;
  let resultMeta = { engine: 'none' };

  const preview = el('div', { class: 'studio-preview' });
  const previewImg = el('img', { alt: '预览' });
  const progressMask = el('div', { class: 'progress-mask' }, [
    el('div', { class: 'spinner' }),
    el('div', { class: 'mask-text', text: '正在转换…' }),
  ]);
  preview.append(previewImg, progressMask);

  /* ------------------------------ 预览控制 ------------------------------ */
  let sourceImage = null;
  let renderToken = 0;

  const setBusy = (busy, text = '正在转换…') => {
    preview.classList.toggle('busy', busy);
    progressMask.querySelector('.mask-text').textContent = text;
  };

  const quickPreview = async () => {
    const token = ++renderToken;
    setBusy(true, '正在转换…');
    try {
      const preset = SKETCH_PRESETS.find((p) => p.id === presetId) || SKETCH_PRESETS[0];
      const merged = { ...preset.opts, ...params, style: preset.opts.style, maxSide: 900, paper: params.paper, fast: true };
      const { blob: out } = await sketchify(sourceImage, merged);
      if (token !== renderToken) return;
      const url = URL.createObjectURL(out);
      previewImg.src = url;
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      resultBlob = out;
      resultMeta = { engine: 'local', presetId, presetName: preset.name };
    } catch (err) {
      if (token === renderToken) toast(`转换失败：${err.message}`, { type: 'error' });
    } finally {
      if (token === renderToken) setBusy(false);
    }
  };

  const debouncedPreview = (() => {
    let t = null;
    return (...args) => { clearTimeout(t); t = setTimeout(() => quickPreview(...args), 260); };
  })();

  /* ------------------------------ 界面构建 ------------------------------ */
  const presetGrid = el('div', { class: 'studio-presets' });
  const renderPresets = () => {
    presetGrid.innerHTML = '';
    for (const p of SKETCH_PRESETS) {
      presetGrid.appendChild(el('button', {
        class: `preset-card ${presetId === p.id ? 'active' : ''}`,
        onclick: async () => {
          presetId = p.id;
          params = { ...params, ...p.opts };
          renderPresets();
          renderParams();
          await quickPreview();
        },
      }, [
        el('b', { text: p.name }),
        el('small', { text: p.desc }),
      ]));
    }
  };

  const paramWrap = el('div');
  const renderParams = () => {
    paramWrap.innerHTML = '';
    const rows = [
      { key: 'strength', label: '铅笔浓度', min: 0.1, max: 1, step: 0.05 },
      { key: 'contrast', label: '对比度', min: 0.6, max: 1.8, step: 0.02 },
      { key: 'grain', label: '纸张颗粒', min: 0, max: 1, step: 0.05 },
      { key: 'threshold', label: '线条阈值', min: 0, max: 0.4, step: 0.01 },
    ];
    for (const row of rows) {
      const valNode = el('span', { text: String(params[row.key].toFixed(2)) });
      paramWrap.appendChild(el('div', { class: 'param-row' }, [
        el('div', { class: 'label' }, [el('span', { text: row.label }), valNode]),
        el('input', {
          type: 'range', min: String(row.min), max: String(row.max), step: String(row.step),
          value: String(params[row.key]),
          oninput: (e) => {
            params[row.key] = Number(e.target.value);
            valNode.textContent = params[row.key].toFixed(2);
            debouncedPreview();
          },
        }),
      ]));
    }
    // 纸张底色
    const swatches = el('div', { class: 'swatch-row' });
    for (const p of PAPERS_ui_sketch) {
      swatches.appendChild(el('button', {
        class: `swatch ${params.paper === p.id ? 'active' : ''}`,
        style: { background: p.id },
        title: p.name,
        onclick: async () => { params.paper = p.id; renderParams(); await quickPreview(); },
      }));
    }
    paramWrap.appendChild(el('div', { class: 'param-row' }, [
      el('div', { class: 'label' }, [el('span', { text: '纸张底色' })]),
      swatches,
    ]));
  };

  renderPresets();
  renderParams();

  const body = el('div', {}, [
    preview,
    el('p', { class: 'field-hint', style: { marginBottom: '10px' }, text: aiConfig.provider && aiConfig.provider !== 'local'
      ? `当前 AI 引擎：${aiConfig.provider}（失败会自动回退本地算法）`
      : '当前使用本地算法，照片不会离开手机；在「设置 → AI 引擎」可切换云端接口。' }),
    presetGrid,
    paramWrap,
    el('div', { class: 'divider' }),
    el('div', { class: 'set-item' }, [
      el('div', { class: 'info' }, [
        el('b', { text: '高清输出' }),
        el('small', { text: '按原图分辨率重新转换一次（更清晰，稍慢）' }),
      ]),
      el('div', { class: 'control' }, [
        el('button', {
          class: 'btn btn-ghost btn-sm', text: '生成高清版',
          onclick: async () => {
            const progress = showProgress({ title: '正在生成高清素描…', percent: 0 });
            try {
              const preset = SKETCH_PRESETS.find((p) => p.id === presetId) || SKETCH_PRESETS[0];
              const merged = { ...preset.opts, ...params, style: preset.opts.style, maxSide: 2000, paper: params.paper };
              const out = await sketchify(sourceImage, {
                ...merged,
                progress: (r, s) => progress.update({ percent: r, note: s }),
              });
              resultBlob = out.blob;
              const url = URL.createObjectURL(out.blob);
              previewImg.src = url;
              toast(`高清素描已生成（${out.width}×${out.height}）`, { type: 'success' });
            } catch (err) {
              toast(`生成失败：${err.message}`, { type: 'error' });
            } finally {
              hideProgress();
            }
          },
        }),
      ]),
    ]),
  ]);

  const insertText = opts.mode === 'background' ? '设为 App 背景' : '插入到日记';

  const sheet = openSheet({
    title: '图片转素描',
    subtitle: 'AI 效果：把照片变成手绘素描，再插入日记或做成背景',
    size: 'tall',
    body,
    footer: el('div', { class: 'sheet-foot' }, [
      el('button', {
        class: 'btn btn-ghost btn-sm', text: '原图插入',
        onclick: async () => {
          await onDone?.(blob, { engine: 'none', original: true });
          finish();
          sheet.close();
        },
      }),
      el('div', { class: 'spacer' }),
      el('button', { class: 'btn btn-ghost', text: '取消', onclick: () => sheet.close() }),
      el('button', {
        class: 'btn btn-primary', text: insertText,
        onclick: async () => {
          showProgress({ title: '正在保存…' });
          try {
            await onDone?.(resultBlob, { ...resultMeta, params });
            finish();
            hideProgress();
            sheet.close();
            toast('素描已保存', { type: 'success' });
          } catch (err) {
            hideProgress();
            toast(`保存失败：${err.message}`, { type: 'error' });
          }
        },
      }),
    ]),
    onClose: () => { renderToken++; if (!done) onCancel?.(); },
  });

  // 首次渲染
  try {
    sourceImage = await loadImageFromBlob(blob);
    previewImg.src = URL.createObjectURL(blob);
    await sleep(30);
    // 若配置了云端 AI，优先尝试云端，失败自动回退
    if (aiConfig.provider && aiConfig.provider !== 'local' && aiConfig.endpoint) {
      setBusy(true, '正在调用云端 AI…');
      try {
        const out = await toSketch(sourceImage, aiConfig, { presetId, onProgress: (r, s) => setBusy(true, s || '转换中…'), overrides: params });
        resultBlob = out.blob;
        const url = URL.createObjectURL(out.blob);
        previewImg.src = url;
        resultMeta = { engine: out.engine, presetId };
        if (out.fallbackReason) toast(`云端失败已回退本地：${out.fallbackReason}`, { type: 'warn', duration: 3600 });
        setBusy(false);
      } catch (err) {
        setBusy(false);
        toast(`云端 AI 失败：${err.message}`, { type: 'warn' });
        await quickPreview();
      }
    } else {
      await quickPreview();
    }
  } catch (err) {
    toast(`图片读取失败：${err.message}`, { type: 'error' });
  }

  void imageToCanvas;
  void clamp;
  return sheet;
}

/**
 * 批量处理（例如一次性把多张照片转成素描做背景候选）
 */
async function batchSketch_ui_sketch(blobs, settings = {}) {
  const out = [];
  const progress = showProgress({ title: '批量转换中…', percent: 0 });
  try {
    for (let i = 0; i < blobs.length; i++) {
      const preset = SKETCH_PRESETS.find((p) => p.id === (settings.presetId || 'pencil')) || SKETCH_PRESETS[0];
      const res = await sketchify(blobs[i], { ...preset.opts, ...(settings.overrides || {}) });
      out.push(res.blob);
      progress.update({ percent: (i + 1) / blobs.length, note: `${i + 1} / ${blobs.length}` });
    }
  } finally {
    hideProgress();
  }
  return out;
}

return { "openSketchStudio": openSketchStudio_ui_sketch, "batchSketch": batchSketch_ui_sketch };
} };
/* ================= js/ui/editor.js ================= */
__defs["js/ui/editor.js"] = { exports: ["MOODS","openEditor"], fn: function (module) {
var { "el": el, "clear": clear, "toast": toast, "countWords": countWords, "htmlToText": htmlToText, "debounce": debounce, "safeFileName": safeFileName, "uid": uid, "pickFiles": pickFiles, "clamp": clamp, "sleep": sleep } = __m("js/core/utils.js");
var { "openSheet": openSheet, "openModal": openModal, "openImageViewer": openImageViewer, "showProgress": showProgress, "hideProgress": hideProgress, "promptDialog": promptDialog, "confirmDialog": confirmDialog, "pickOption": pickOption } = __m("js/ui/modal.js");
var { "openDrawingBoard": openDrawingBoard } = __m("js/ui/drawing.js");
var { "openSketchStudio": openSketchStudio } = __m("js/ui/sketch.js");
var { "toHandwriting": toHandwriting, "tidyText": tidyText } = __m("js/features/ai.js");
var { "makeThumbnail": makeThumbnail, "rotateBlob": rotateBlob, "getCanvasSize": getCanvasSize, "loadImageFromBlob": loadImageFromBlob, "imageToCanvas": imageToCanvas } = __m("js/core/image-engine.js");
var { "weatherSVG": weatherSVG } = __m("js/features/weather.js");
/* ==========================================================================
 * 日记本 · 日记编辑器
 *  · 富文本（加粗/斜体/标题/对齐/列表/引用/颜色/高亮）
 *  · 插入图片（原图 / 素描）、手写稿、涂鸦、分隔线
 *  · 文字一键转手写字体（渲染成手写稿插入）
 *  · 自动草稿 + 批改历史（可回看与还原）
 * ========================================================================== */









const MOODS_ui_editor = ['😊', '😄', '😌', '😐', '😔', '😢', '😠', '😴', '🤔', '🥳', '😍', '🤒'];

/**
 * 打开编辑器
 * @param {object} opts
 *   dateKey, entry, settings, fontStack
 *   onSave({ title, body, mood, drawings, images, note })
 *   onNeedImage(blob, meta) => Promise<{id, thumbId}>   由 app 负责写库
 *   onLockToggle()
 *   onOpenRevisions()
 */
async function openEditor_ui_editor(opts) {
  const {
    dateKey, entry = {}, settings = {}, fontStack, onSave, onPersistImage, onLockToggle, onOpenRevisions,
  } = opts;

  const draftKey = `riji.draft.${dateKey}`;
  const state = {
    title: entry.title || '',
    body: entry.body || '',
    mood: entry.mood || '',
    drawings: [...(entry.drawings || [])],
    images: [...(entry.images || [])],
    dirty: false,
    lastSavedAt: entry.updatedAt || null,
    saving: false,
  };

  const titleInput = el('input', { class: 'editor-title', placeholder: '给今天起个标题…', maxlength: 60 });
  titleInput.value = state.title;

  const bodyEl = el('div', {
    class: 'editor-body',
    contenteditable: 'true',
    spellcheck: 'false',
    'data-placeholder': '今天发生了什么？写下来吧…',
  });
  bodyEl.innerHTML = state.body || '<p><br></p>';

  const statusLeft = el('span', { class: 'saved', text: '未修改' });
  const statusRight = el('span', { text: '' });

  /* ------------------------------ 工具栏 ------------------------------ */
  const toolbar = el('div', { class: 'editor-toolbar' });

  const exec = (cmd, value = null) => {
    bodyEl.focus();
    try { document.execCommand(cmd, false, value); } catch { /* ignore */ }
    markDirty();
    refreshToolState();
  };

  const toolBtn = (label, title, onclick, opts2 = {}) => el('button', {
    class: `tool-btn ${opts2.active ? 'active' : ''}`,
    title, text: label, type: 'button',
    onmousedown: (e) => e.preventDefault(),
    onclick,
  });

  const refreshToolState = () => {
    for (const btn of toolbar.querySelectorAll('[data-cmd]')) {
      try { btn.classList.toggle('active', document.queryCommandState(btn.dataset.cmd)); } catch { /* ignore */ }
    }
  };

  const cmdBtn = (label, cmd, title, value = null) => {
    const btn = toolBtn(label, title, () => exec(cmd, value));
    btn.dataset.cmd = cmd;
    return btn;
  };

  const buildToolbar = () => {
    clear(toolbar);
    toolbar.append(
      cmdBtn('B', 'bold', '加粗'),
      cmdBtn('I', 'italic', '斜体'),
      cmdBtn('U', 'underline', '下划线'),
      cmdBtn('S', 'strikeThrough', '删除线'),
      el('div', { class: 'tool-sep' }),
      toolBtn('H1', '大标题', () => exec('formatBlock', 'H1')),
      toolBtn('H2', '小标题', () => exec('formatBlock', 'H2')),
      toolBtn('¶', '正文', () => exec('formatBlock', 'P')),
      el('div', { class: 'tool-sep' }),
      toolBtn('≡', '左对齐', () => exec('justifyLeft')),
      toolBtn('≣', '居中', () => exec('justifyCenter')),
      cmdBtn('•', 'insertUnorderedList', '项目符号'),
      cmdBtn('1.', 'insertOrderedList', '编号列表'),
      toolBtn('❝', '引用', () => exec('formatBlock', 'BLOCKQUOTE')),
      el('div', { class: 'tool-sep' }),
      toolBtn('🖼', '插入图片', () => insertImageFlow()),
      toolBtn('✍️', '手写稿 → 插入', () => handwritingFlow()),
      toolBtn('🎨', '涂鸦画板', () => drawingFlow()),
      toolBtn('—', '分隔线', () => { exec('insertHorizontalRule'); markDirty(); }),
      el('div', { class: 'tool-sep' }),
      toolBtn('A', '笔墨颜色', () => pickInkColor()),
      toolBtn('🖍', '荧光高亮', () => exec('hiliteColor', settings.ink?.highlight || '#ffe9a8')),
      toolBtn('🧹', '整理排版', () => {
        const clean = tidyText(bodyEl.innerHTML);
        if (clean !== bodyEl.innerHTML) { bodyEl.innerHTML = clean; markDirty(); toast('排版已整理'); }
        else toast('已经很整齐了');
      }),
      toolBtn('↶', '撤销', () => exec('undo')),
      toolBtn('↷', '重做', () => exec('redo')),
      el('div', { class: 'tool-sep' }),
      toolBtn('🌤', '插入天气', () => insertWeather()),
      toolBtn('😊', '今天心情', () => pickMood()),
      toolBtn('🕘', '批改历史', () => onOpenRevisions?.()),
      toolBtn(entry.locked ? '🔒' : '🔓', entry.locked ? '这篇已上锁' : '给这篇上锁', () => onLockToggle?.()),
    );
  };

  buildToolbar();

  /* ------------------------------ 图片处理 ---------------------------- */

  const insertImageFlow = async () => {
    const files = await pickFiles({ accept: 'image/*', multiple: true });
    if (!files.length) return;
    for (const file of files) {
      if (file.size > 12 * 1024 * 1024) { toast(`${file.name} 超过 12MB，已跳过`, { type: 'warn' }); continue; }
      const choice = await pickOption({
        title: `「${file.name.slice(0, 18)}」怎么插入？`,
        options: [
          { value: 'original', label: '插入原图', desc: '保持照片原样', icon: '🖼' },
          { value: 'sketch', label: 'AI 转素描后插入', desc: '变成手绘素描放进日记', icon: '✏️' },
          { value: 'sketch-bg', label: '转素描并设为 App 背景', desc: '同时保存为背景图', icon: '🎨' },
        ],
      });
      if (!choice) continue;
      if (choice === 'original') {
        await attachImage(file, { kind: 'photo' });
      } else {
        await new Promise((resolve) => {
          let settled = false;
          const finish = () => { if (!settled) { settled = true; resolve(); } };
          openSketchStudio({
            blob: file,
            settings,
            mode: choice === 'sketch-bg' ? 'background' : 'insert',
            onDone: async (blob, meta) => {
              try {
                await attachImage(blob, { kind: meta.engine === 'none' ? 'photo' : 'sketch', meta });
                if (choice === 'sketch-bg') await opts.onSetBackground?.(blob, meta);
              } finally { finish(); }
            },
            onCancel: finish,
          });
        });
      }
    }
  };

  const attachImage = async (blob, { kind = 'photo', meta = {} } = {}) => {
    showProgress({ title: '正在加入日记…' });
    try {
      const record = await onPersistImage(blob, { kind, name: safeFileName(`日记-${dateKey}`), meta });
      const { url, thumbUrl } = record;
      const fig = el('figure', { class: 'img-frame', 'data-id': record.id, contenteditable: 'false' }, [
        el('img', { src: url, alt: '', 'data-id': record.id }),
        el('figcaption', { contenteditable: 'true', text: meta.caption || (kind === 'sketch' ? '素描' : '') }),
      ]);
      insertNodeAtCursor(fig);
      state.images.push({ id: record.id, thumbId: record.thumbId, sketch: kind === 'sketch', caption: meta.caption || '', layout: 'center' });
      markDirty();
      toast(kind === 'sketch' ? '素描已插入' : '图片已插入', { type: 'success' });
    } catch (err) {
      toast(`插入失败：${err.message}`, { type: 'error' });
    } finally {
      hideProgress();
    }
  };

  const insertNodeAtCursor = (node) => {
    bodyEl.focus();
    const sel = window.getSelection();
    const ensureP = () => {
      if (!bodyEl.contains(sel?.anchorNode) || !sel.rangeCount) {
        bodyEl.appendChild(el('p', {}, [el('br')]));
        const range = document.createRange();
        range.selectNodeContents(bodyEl.lastChild);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    };
    ensureP();
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(node);
    // 图片后补一个可编辑段落
    const after = el('p', {}, [el('br')]);
    node.after(after);
    const newRange = document.createRange();
    newRange.selectNodeContents(after);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    bindImageTools();
  };

  const bindImageTools = () => {
    for (const img of bodyEl.querySelectorAll('img')) {
      if (img.dataset.bound) continue;
      img.dataset.bound = '1';
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.preventDefault();
        const fig = img.closest('figure') || img;
        showImageTools(fig, img);
      });
    }
  };

  let floatTools = null;
  const closeFloatTools = () => { floatTools?.remove(); floatTools = null; };
  document.addEventListener('click', (e) => {
    if (floatTools && !floatTools.contains(e.target)) closeFloatTools();
  });

  const showImageTools = (fig, img) => {
    closeFloatTools();
    const rect = img.getBoundingClientRect();
    floatTools = el('div', {
      class: 'float-img-tools',
      style: {
        left: `${clamp(rect.left, 8, window.innerWidth - 300)}px`,
        top: `${clamp(rect.bottom + 8, 8, window.innerHeight - 60)}px`,
      },
    });
    const id = img.getAttribute('data-id') || fig.getAttribute('data-id');
    const actions = [
      ['查看大图', () => openImageViewer(img.src, { caption: fig.querySelector('figcaption')?.textContent || '' })],
      ['加/改说明', async () => {
        const cap = await promptDialog({ title: '图片说明', value: fig.querySelector('figcaption')?.textContent || '', placeholder: '写一句备注' });
        if (cap == null) return;
        let capNode = fig.querySelector('figcaption');
        if (!capNode) { capNode = el('figcaption', { contenteditable: 'true' }); fig.appendChild(capNode); }
        capNode.textContent = cap;
        const rec = state.images.find((i) => i.id === id);
        if (rec) rec.caption = cap;
        markDirty();
      }],
      ['AI 转素描', async () => {
        closeFloatTools();
        const res = await fetch(img.src);
        const blob = await res.blob();
        openSketchStudio({
          blob, settings, mode: 'insert',
          onDone: async (out, meta) => {
            await attachImage(out, { kind: 'sketch', meta });
          },
        });
      }],
      ['旋转', async () => {
        closeFloatTools();
        const res = await fetch(img.src);
        const rotated = await rotateBlob(await res.blob(), 90);
        removeImageNode(fig, id);
        await attachImage(rotated, { kind: 'photo' });
      }],
      ['移到左边', () => { fig.style.textAlign = 'left'; markDirty(); }],
      ['移到右边', () => { fig.style.textAlign = 'right'; markDirty(); }],
      ['删除', () => { removeImageNode(fig, id); }],
    ];
    for (const [label, fn] of actions) {
      floatTools.appendChild(el('button', { text: label, onclick: (e) => { e.stopPropagation(); fn(); } }));
    }
    document.body.appendChild(floatTools);
  };

  const removeImageNode = (fig, id) => {
    fig.remove();
    state.images = state.images.filter((i) => i.id !== id);
    if (id) opts.onDeleteImage?.(id).catch?.(() => {});
    markDirty();
    closeFloatTools();
  };

  /* --------------------------- 手写 / 涂鸦 ---------------------------- */

  const handwritingFlow = async () => {
    const text = htmlToText(bodyEl.innerHTML);
    if (!text.trim()) { toast('先写点文字，再转成手写稿吧'); return; }
    const style = await pickOption({
      title: '选择手写字体风格',
      options: [
        { value: 'kai', label: '楷体手写', desc: '端正清秀', icon: '🖊' },
        { value: 'xingkai', label: '行楷连笔', desc: '带连笔的书写感', icon: '🖋' },
        { value: 'xinwei', label: '新魏碑体', desc: '硬朗有力', icon: '🪶' },
        { value: 'caiyun', label: '彩云手写', desc: '随性手写', icon: '🎐' },
        { value: 'custom', label: '当前设置的手写字体', desc: '用设置里的字体与抖动参数', icon: '⚙️' },
      ],
    });
    if (!style) return;
    const progress = showProgress({ title: '正在把你的文字写成手写稿…', percent: 0.2 });
    try {
      const hwSettings = style === 'custom'
        ? { ...settings.handwriting }
        : { ...settings.handwriting, styleId: style };
      const fontStackForStyle = await opts.getFontStack?.(hwSettings.styleId) || fontStack;
      const result = await toHandwriting(bodyEl.innerHTML, hwSettings, {
        fontStack: fontStackForStyle,
        inkColor: settings.ink?.color || '#20304a',
        paper: { color: '#fdfaf1', lines: settings.paper?.lines !== false, lineGap: 34, texture: 0.3 },
        maxHeight: 6000,
        dateText: dateKey,
      });
      progress.update({ percent: 0.8, note: '插入到手写图层…' });
      const record = await onPersistImage(result.blob, { kind: 'drawing', name: `手写稿-${dateKey}` });
      state.drawings.push({
        id: uid('draw'), imageId: record.id, thumbId: record.thumbId,
        width: result.width, height: result.height, createdAt: Date.now(), mode: 'text-to-handwriting', styleId: hwSettings.styleId,
      });
      markDirty();
      toast('手写稿已加入这篇日记（保存后可见）', { type: 'success', duration: 3200 });
    } catch (err) {
      toast(`转换失败：${err.message}`, { type: 'error' });
    } finally {
      hideProgress();
    }
  };

  const drawingFlow = async () => {
    openDrawingBoard({
      title: '手写 / 涂鸦',
      width: 1400,
      height: 1000,
      color: settings.ink?.color || '#20304a',
      onDone: async (blob, meta) => {
        const record = await onPersistImage(blob, { kind: 'drawing', name: `涂鸦-${dateKey}` });
        state.drawings.push({
          id: uid('draw'), imageId: record.id, thumbId: record.thumbId,
          width: meta.width, height: meta.height, createdAt: Date.now(), mode: 'freehand',
        });
        markDirty();
      },
    });
  };

  /* ------------------------------ 小工具 ------------------------------ */

  const pickInkColor = () => {
    const colors = ['#20304a', '#111111', '#2f6f4f', '#a5382a', '#2f5aa5', '#8a5a15', '#7a3f8f'];
    const wrap = el('div', { class: 'swatch-row' });
    const modal = openModal({
      title: '选择笔墨颜色',
      content: wrap,
    });
    for (const c of colors) {
      wrap.appendChild(el('button', {
        class: 'swatch', style: { background: c },
        onclick: () => { exec('foreColor', c); modal.close(); },
      }));
    }
  };

  const insertWeather = async () => {
    const w = entry.weather || {};
    const text = `${w.text || '天气'} ${w.temp != null ? `${w.temp}℃` : ''} ${w.city || ''}`.trim();
    if (!text) { toast('还没有天气数据，可以在设置里配置城市'); return; }
    const html = `${weatherSVG(w.kind || 'cloudy', { size: 40, animate: false })}<span> ${text}</span>`;
    exec('insertHTML', `<p>${html}</p>`);
  };

  const pickMood = () => {
    const wrap = el('div', { class: 'mood-row' });
    const modal = openModal({ title: '今天心情如何？', content: wrap });
    for (const m of MOODS_ui_editor) {
      wrap.appendChild(el('button', {
        class: `mood-btn ${state.mood === m ? 'active' : ''}`, text: m,
        onclick: () => { state.mood = state.mood === m ? '' : m; markDirty(); modal.close(); },
      }));
    }
  };

  /* ------------------------------ 状态 -------------------------------- */

  function markDirty() {
    state.dirty = true;
    statusLeft.className = 'dirty';
    statusLeft.textContent = '未保存';
    scheduleAutosave();
    updateCount();
  }

  function updateCount() {
    state.title = titleInput.value;
    state.body = bodyEl.innerHTML;
    const words = countWords(htmlToText(bodyEl.innerHTML));
    statusRight.textContent = `${words} 字 · ${dateKey}`;
  }

  const saveDraft = debounce(() => {
    if (!state.dirty) return;
    try {
      sessionStorage.setItem(draftKey, JSON.stringify({
        title: titleInput.value, body: bodyEl.innerHTML, at: Date.now(),
      }));
    } catch { /* ignore */ }
  }, 1200);

  const scheduleAutosave = () => {
    saveDraft();
  };

  titleInput.addEventListener('input', markDirty);
  bodyEl.addEventListener('input', () => { markDirty(); refreshToolState(); });
  bodyEl.addEventListener('keyup', refreshToolState);
  bodyEl.addEventListener('mouseup', refreshToolState);
  bodyEl.addEventListener('paste', (e) => {
    // 只保留纯文本，图片走插入按钮
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
    markDirty();
  });

  // 恢复未保存草稿
  const draft = (() => { try { return JSON.parse(sessionStorage.getItem(draftKey) || 'null'); } catch { return null; } })();
  if (draft && draft.at > (entry.updatedAt || 0) && (draft.body !== state.body || draft.title !== state.title)) {
    const restore = await confirmDialog('发现上次未保存的草稿，要恢复吗？', { title: '恢复草稿', okText: '恢复草稿', cancelText: '丢弃' });
    if (restore) {
      titleInput.value = draft.title || '';
      bodyEl.innerHTML = draft.body || '';
    }
  }

  bindImageTools();
  updateCount();

  /* ------------------------------ 面板 -------------------------------- */

  const status = el('div', { class: 'editor-status' }, [
    statusLeft,
    el('div', { class: 'spacer' }),
    statusRight,
  ]);

  const panelBody = el('div', { class: 'editor-wrap' }, [
    toolbar,
    el('div', { class: 'editor-canvas-wrap' }, [titleInput, bodyEl]),
    status,
  ]);

  const sheet = openSheet({
    title: '写日记',
    subtitle: `${dateKey} · 自动保存草稿`,
    size: 'tall',
    showGrab: false,
    fullscreen: true,   // 全屏页面，不再是从底部升起的面板
    body: panelBody,
    footer: el('div', { class: 'sheet-foot' }, [
      el('button', {
        class: 'btn btn-ghost btn-sm', text: '插入图片',
        onclick: () => insertImageFlow(),
      }),
      el('button', {
        class: 'btn btn-ghost btn-sm', text: '手写',
        onclick: () => drawingFlow(),
      }),
      el('div', { class: 'spacer' }),
      el('button', {
        class: 'btn btn-ghost', text: '取消',
        onclick: async () => {
          if (state.dirty) {
            const ok = await confirmDialog('还有修改没有保存，确定放弃吗？', { title: '放弃修改', okText: '放弃', danger: true });
            if (!ok) return;
          }
          sheet.close();
        },
      }),
      el('button', {
        class: 'btn btn-primary', text: '保存',
        onclick: async () => {
          state.title = titleInput.value.trim();
          state.body = bodyEl.innerHTML;
          state.saving = true;
          try {
            await onSave?.({
              title: state.title,
              body: state.body,
              mood: state.mood,
              drawings: state.drawings,
              images: state.images,
              wordCount: countWords(htmlToText(state.body)),
            });
            state.dirty = false;
            statusLeft.className = 'saved';
            statusLeft.textContent = `已保存 ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
            try { sessionStorage.removeItem(draftKey); } catch { /* ignore */ }
            sheet.close();
          } catch (err) {
            statusLeft.className = 'dirty';
            statusLeft.textContent = '保存失败';
            toast(`保存失败：${err.message}`, { type: 'error', duration: 5000 });
          } finally {
            state.saving = false;
          }
        },
      }),
    ]),
    onClose: async () => {
      closeFloatTools();
      if (state.dirty) {
        try {
          sessionStorage.setItem(draftKey, JSON.stringify({ title: titleInput.value, body: bodyEl.innerHTML, at: Date.now() }));
        } catch { /* ignore */ }
      }
    },
  });

  setTimeout(() => bodyEl.focus(), 260);
  void sleep;
  void getCanvasSize;
  void makeThumbnail;
  void loadImageFromBlob;
  void imageToCanvas;

  return {
    sheet,
    state,
    getContent: () => ({ title: titleInput.value, body: bodyEl.innerHTML }),
    appendDrawing: (drawing) => { state.drawings.push(drawing); markDirty(); },
    setTitle: (t) => { titleInput.value = t; markDirty(); },
  };
}



return { "MOODS": MOODS_ui_editor, "openEditor": openEditor_ui_editor };
} };
/* ================= js/ui/export-ui.js ================= */
__defs["js/ui/export-ui.js"] = { exports: ["formatCN","openExportCenter"], fn: function (module) {
var { "el": el, "clear": clear, "toast": toast, "formatCN": formatCN, "countWords": countWords, "htmlToText": htmlToText, "safeFileName": safeFileName, "isMobile": isMobile, "downloadBlob": downloadBlob } = __m("js/core/utils.js");
var { "openSheet": openSheet, "openModal": openModal, "showProgress": showProgress, "hideProgress": hideProgress, "pickOption": pickOption } = __m("js/ui/modal.js");
var { "listEntries": listEntries, "getEntry": getEntry, "settingsGet": settingsGet, "getImage": getImage } = __m("js/core/storage.js");
var { "buildDocx": buildDocx, "buildDiaryPDF": buildDiaryPDF, "shareFile": shareFile, "buildMailto": buildMailto } = __m("js/features/export.js");
var { "getPreset": getPreset } = __m("js/features/handwriting.js");
/* ==========================================================================
 * 日记本 · 导出中心
 *  勾选日期 → 生成 Word(.docx) / PDF → 保存到手机 或 发送到邮箱
 *  也支持直接调用系统分享面板（手机端可分享到邮件/微信/云盘）
 * ========================================================================== */







/**
 * 打开导出中心
 * @param {object} opts { selected: Set<string>, entries, settings, onDone }
 */
async function openExportCenter_ui_export_ui(opts = {}) {
  const settings = opts.settings || await settingsGet();
  const entries = opts.entries || await listEntries();
  const chosen = new Set(opts.selected || []);
  let format = settings.export?.format === 'docx' ? 'docx' : 'pdf';
  let paper = settings.export?.paper || 'a5';
  let fontName = opts.fontName || (getPreset(settings.handwriting?.styleId || 'kai').name.includes('行楷') ? '华文行楷' : '楷体');
  let includeImages = settings.export?.includeImages !== false;
  let includeWeather = settings.export?.includeWeather !== false;
  let email = settings.export?.email || '';

  const listWrap = el('div');
  const summary = el('div', { class: 'field-hint' });

  /* ------------------------------ 选择区 ------------------------------ */
  const renderList = () => {
    clear(listWrap);
    const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1));
    if (!sorted.length) {
      listWrap.appendChild(el('div', { class: 'empty-state' }, [
        el('div', { class: 'icon', text: '📭' }),
        el('h4', { text: '还没有可导出的日记' }),
        el('p', { text: '先去写几篇，再回来打印成册吧。' }),
      ]));
      return;
    }
    for (const entry of sorted) {
      const selected = chosen.has(entry.date);
      const row = el('div', { class: `entry-row ${selected ? 'selected' : ''}` }, [
        el('div', { class: 'check', text: '✓' }),
        el('div', { class: 'info' }, [
          el('b', { text: entry.title?.trim() || `${entry.date} 的日记` }),
          el('p', { text: htmlToText(entry.body || '').replace(/\s+/g, ' ').slice(0, 60) || '（空）' }),
          el('div', { class: 'tags' }, [
            el('span', { class: 'chip chip-ghost', text: entry.date }),
            el('span', { class: 'chip chip-ghost', text: `${entry.wordCount || countWords(htmlToText(entry.body || ''))} 字` }),
            (entry.images?.length || 0) + (entry.drawings?.length || 0) > 0
              ? el('span', { class: 'chip chip-ghost', text: `${(entry.images?.length || 0) + (entry.drawings?.length || 0)} 张图` }) : null,
          ]),
        ]),
      ]);
      row.addEventListener('click', () => {
        if (chosen.has(entry.date)) chosen.delete(entry.date); else chosen.add(entry.date);
        renderList();
        updateSummary();
      });
      listWrap.appendChild(row);
    }
  };

  const updateSummary = () => {
    const list = [...chosen].sort();
    if (!list.length) {
      summary.textContent = '还没有勾选任何日记';
      return;
    }
    const words = entries.filter((e) => chosen.has(e.date))
      .reduce((a, e) => a + (e.wordCount || countWords(htmlToText(e.body || ''))), 0);
    summary.textContent = `已选 ${list.length} 篇 · 约 ${words} 字 · ${list[0]} → ${list[list.length - 1]}`;
  };

  const toolbar = el('div', { class: 'cal-tools', style: { justifyContent: 'flex-start', marginBottom: '12px' } }, [
    el('button', {
      class: 'btn btn-ghost btn-sm', text: '打开日历勾选',
      onclick: async () => {
        const { openCalendar } = await __m("js/ui/calendar.js");
        openCalendar({
          mode: 'pick', selected: chosen, entries,
          onConfirm: (set) => {
            chosen.clear();
            for (const d of set) chosen.add(d);
            renderList();
            updateSummary();
          },
        });
      },
    }),
    el('button', {
      class: 'btn btn-ghost btn-sm', text: '选最近 7 天',
      onclick: () => {
        const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 7);
        sorted.forEach((e) => chosen.add(e.date));
        renderList(); updateSummary();
      },
    }),
    el('button', {
      class: 'btn btn-ghost btn-sm', text: '全选',
      onclick: () => { entries.forEach((e) => chosen.add(e.date)); renderList(); updateSummary(); },
    }),
    el('button', {
      class: 'btn btn-ghost btn-sm', text: '清空选择',
      onclick: () => { chosen.clear(); renderList(); updateSummary(); },
    }),
  ]);

  /* ------------------------------ 选项区 ------------------------------ */
  const formatRow = el('div', { class: 'format-row' });
  const renderFormat = () => {
    clear(formatRow);
    formatRow.append(
      el('button', {
        class: `format-card ${format === 'pdf' ? 'active' : ''}`,
        onclick: () => { format = 'pdf'; renderFormat(); },
      }, [el('b', { text: 'PDF' }), el('small', { text: '排版固定，最适合打印成册' })]),
      el('button', {
        class: `format-card ${format === 'docx' ? 'active' : ''}`,
        onclick: () => { format = 'docx'; renderFormat(); },
      }, [el('b', { text: 'Word' }), el('small', { text: '.docx 可继续编辑' })]),
    );
  };
  renderFormat();

  const options = el('div', {}, [
    el('div', { class: 'set-item' }, [
      el('div', { class: 'info' }, [el('b', { text: '纸张' }), el('small', { text: 'PDF 分页尺寸' })]),
      el('button', {
        class: 'btn btn-ghost btn-sm', text: paper === 'a4' ? 'A4' : 'A5',
        onclick: async () => {
          const v = await pickOption({ title: '纸张尺寸', options: [{ value: 'a5', label: 'A5（手账）' }, { value: 'a4', label: 'A4（打印纸）' }], value: paper });
          if (!v) return;
          paper = v;
          renderOptions();
        },
      }),
    ]),
    el('div', { class: 'set-item' }, [
      el('div', { class: 'info' }, [el('b', { text: '手写字体' }), el('small', { text: 'Word 里使用的字体名（需电脑装有该字体）' })]),
      el('button', {
        class: 'btn btn-ghost btn-sm', text: fontName,
        onclick: async () => {
          const v = await pickOption({
            title: '导出字体',
            options: [
              { value: '楷体', label: '楷体', desc: '最通用' },
              { value: '华文行楷', label: '华文行楷', desc: '行书感强' },
              { value: '华文新魏', label: '华文新魏', desc: '硬朗' },
              { value: '宋体', label: '宋体', desc: '印刷体' },
            ],
            value: fontName,
          });
          if (!v) return;
          fontName = v;
          renderOptions();
        },
      }),
    ]),
    checkboxItem_ui_export_ui('包含图片与手写稿', '取消后只导出文字', includeImages, (v) => { includeImages = v; }),
    checkboxItem_ui_export_ui('包含天气与地点信息', '', includeWeather, (v) => { includeWeather = v; }),
    el('label', { class: 'field', style: { marginTop: '10px' } }, [
      el('span', { class: 'field-label', text: '发送到邮箱（导出后可直接调用邮件 App）' }),
      el('input', {
        class: 'input', type: 'email', value: email, placeholder: 'you@example.com',
        oninput: (e) => { email = e.target.value.trim(); },
      }),
    ]),
  ]);

  const renderOptions = () => { /* 选项较简单，直接重建 */ 
    const btn = options.querySelector('.set-item button.btn-ghost');
    if (btn) btn.textContent = paper === 'a4' ? 'A4' : 'A5';
    const btns = options.querySelectorAll('.set-item button.btn-ghost');
    if (btns[1]) btns[1].textContent = fontName;
  };

  const preview = el('div', { class: 'export-preview' }, [
    el('h4', { text: settings.cover?.title || '我的日记本' }),
    el('p', { text: '封面 → 每篇一页：日期、天气、正文、图片与手写稿，页脚带页码。' }),
  ]);

  const body = el('div', {}, [
    toolbar,
    summary,
    el('div', { class: 'divider' }),
    listWrap,
    el('div', { class: 'divider' }),
    el('p', { class: 'field-label', text: '导出格式' }),
    formatRow,
    preview,
    el('p', { class: 'field-label', text: '导出选项' }),
    options,
  ]);

  renderList();
  updateSummary();

  /* ------------------------------ 生成逻辑 ---------------------------- */
  const doExport = async ({ share = false, mail = false } = {}) => {
    const dates = [...chosen].sort();
    if (!dates.length) { toast('请先勾选要导出的日记'); return; }
    const picked = [];
    for (const d of dates) {
      const entry = entries.find((e) => e.date === d) || await getEntry(d);
      if (!entry) continue;
      if (entry.locked) { toast(`${d} 已上锁，已跳过（请先解锁再导出）`, { type: 'warn' }); continue; }
      picked.push(entry);
    }
    if (!picked.length) { toast('没有可导出的内容'); return; }

    const progress = showProgress({ title: '正在生成文档…', percent: 0.05, note: `共 ${picked.length} 篇` });
    try {
      const stamp = new Date().toISOString().slice(0, 10);
      let blob;
      let filename;
      if (format === 'docx') {
        blob = await buildDocx(picked, {
          fontName, fontSize: 12, includeImages, includeWeather,
          title: settings.cover?.title || '我的日记本',
          author: settings.cover?.subtitle || '',
          imagesResolver: getImage,
        });
        filename = safeFileName(`日记本-${stamp}.docx`);
      } else {
        // PDF 需要内嵌中文字体；未打包字体时自动降级为 Word
        let font = null;
        try {
          progress.update({ percent: 0.15, note: '加载中文字体…' });
          const { loadPdfFont } = await __m("js/features/export.js");
          font = await loadPdfFont(settings.export?.fontUrl || 'assets/fonts/pdf-cjk.ttf');
        } catch {
          font = null;
        }
        if (!font) {
          progress.update({ note: '未找到内嵌中文字体，改用 Word 导出…' });
          blob = await buildDocx(picked, {
            fontName, fontSize: 12, includeImages, includeWeather,
            title: settings.cover?.title || '我的日记本',
            imagesResolver: getImage,
          });
          filename = safeFileName(`日记本-${stamp}.docx`);
          toast('PDF 需要内置字体文件（docs 里有说明），本次已导出为 Word', { type: 'warn', duration: 4200 });
        } else {
          blob = await buildDiaryPDF(picked, {
            font, pageSize: paper, fontSize: 11.5, includeImages, includeWeather,
            title: settings.cover?.title || '我的日记本',
            author: settings.cover?.subtitle || '',
            imagesResolver: getImage,
          });
          filename = safeFileName(`日记本-${stamp}.pdf`);
        }
      }
      progress.update({ percent: 0.95, note: '整理文件…' });
      hideProgress();

      if (share) {
        const res = await shareFile(blob, filename, {
          title: settings.cover?.title || '我的日记本',
          text: `共 ${picked.length} 篇日记`,
          to: email,
        });
        toast(res.shared ? '已打开分享面板' : '文件已保存，并打开邮件客户端', { type: 'success' });
      } else if (mail) {
        downloadBlob(blob, filename);
        const mailto = buildMailto({
          to: email,
          subject: `${settings.cover?.title || '我的日记本'}（${picked.length} 篇）`,
          body: `附件：${filename}\n\n（手机浏览器无法自动附带附件，请在下载完成后手动把文件添加到这封邮件里）\n\n导出日期：${stamp}`,
        });
        window.location.href = mailto;
        toast('文件已保存，邮件已打开，请手动附上文件', { type: 'success', duration: 4200 });
      } else {
        downloadBlob(blob, filename);
        toast(`已生成 ${filename}`, { type: 'success' });
      }
      opts.onDone?.({ blob, filename, count: picked.length, format });
    } catch (err) {
      hideProgress();
      toast(`导出失败：${err.message}`, { type: 'error' });
    }
  };

  const footer = el('div', { class: 'sheet-foot' }, [
    el('button', { class: 'btn btn-ghost btn-sm', text: '保存到手机', onclick: () => doExport({}) }),
    el('button', { class: 'btn btn-ghost btn-sm', text: '分享 / 发送', onclick: () => doExport({ share: true }) }),
    el('div', { class: 'spacer' }),
    isMobile() ? null : el('button', { class: 'btn btn-ghost btn-sm', text: '邮件发送', onclick: () => doExport({ mail: true }) }),
    el('button', { class: 'btn btn-primary', text: '生成文档', onclick: () => doExport({}) }),
  ].filter(Boolean));

  const sheet = openSheet({
    title: '导出成册',
    subtitle: '勾选日期 → 生成 Word / PDF → 保存或发送到邮箱',
    size: 'tall',
    body,
    footer,
  });

  return { sheet, getSelection: () => new Set(chosen) };
}

function checkboxItem_ui_export_ui(title, desc, checked, onChange) {
  const input = el('input', { type: 'checkbox' });
  input.checked = checked;
  input.addEventListener('change', () => onChange(input.checked));
  return el('div', { class: 'set-item' }, [
    el('div', { class: 'info' }, [el('b', { text: title }), desc ? el('small', { text: desc }) : null]),
    el('div', { class: 'control' }, [el('label', { class: 'switch' }, [input, el('span', { class: 'switch-track' })])]),
  ]);
}



return { "formatCN": formatCN, "openExportCenter": openExportCenter_ui_export_ui };
} };
/* ================= js/ui/flipbook.js ================= */
__defs["js/ui/flipbook.js"] = { exports: ["$","Flipbook"], fn: function (module) {
var { "$": $, "el": el, "sleep": sleep, "isMobile": isMobile } = __m("js/core/utils.js");
/* ==========================================================================
 * 日记本 · 翻页引擎
 *  · 3D 纸张翻页动画（前进 / 后退两种手势）
 *  · 页面内容由外部渲染函数提供，支持拖动、键盘、按钮三种操作
 * ========================================================================== */



class Flipbook_ui_flipbook {
  /**
   * @param {object} opts
   *   bookEl, currentEl, underEl, flipLayerEl
   *   renderPage(key, targetEl) => Promise<void>|void
   *   onBeforeFlip(from, to, dir) => Promise<boolean>|boolean  返回 false 可取消
   *   duration: 动画时长 ms
   */
  constructor(opts) {
    this.bookEl = opts.bookEl;
    this.currentEl = opts.currentEl;
    this.underEl = opts.underEl;
    this.flipLayer = opts.flipLayerEl;
    this.renderPage = opts.renderPage;
    this.onBeforeFlip = opts.onBeforeFlip;
    this.duration = opts.duration ?? 640;
    this.onAfterFlip = opts.onAfterFlip;
    this.ready = false;
    this.key = null;
    this.animating = false;
    this.ignoreKeys = () => false;
    this._bindGestures();
    this._bindKeys();
  }

  /* ---------------------------- 页面切换 ---------------------------- */

  async show(key, { animate = false, direction = 'forward', force = false } = {}) {
    if (this.key === key && this.ready && !force) return;
    const previous = this.key;
    this.key = key;
    if (!animate || !this.ready || !previous || previous === key) {
      await this.renderPage(key, this.currentEl);
      this.ready = true;
      return;
    }
    if (this.animating) return;
    await this.flipTo(key, direction);
  }

  /** 执行一次翻页动画 */
  async flipTo(nextKey, direction = 'forward') {
    if (this.animating) return;
    if (this.onBeforeFlip) {
      const ok = await this.onBeforeFlip(this.key, nextKey, direction);
      if (ok === false) return;
    }
    this.animating = true;
    const fromKey = this.key;
    const dur = this.prefersReduced() ? 0 : this.duration;

    if (dur === 0) {
      await this.renderPage(nextKey, this.currentEl);
      this.key = nextKey;
      this.animating = false;
      await this.onAfterFlip?.(nextKey, direction);
      return;
    }

    // 前进：正面是「旧页」，翻走它露出下面的新页
    // 后退：背面是「新页」，从背面翻回来
    const flipPage = el('div', { class: `flip-page ${direction}` });
    flipPage.style.setProperty('--flip-dur', `${dur}ms`);
    const shade = el('div', { class: 'flip-shade' });
    flipPage.appendChild(shade);
    const back = el('div', { class: 'flip-back' });
    back.appendChild(el('div', { class: 'flip-back-lines' }));
    flipPage.appendChild(back);
    this.flipLayer.appendChild(flipPage);

    if (direction === 'forward') {
      const holder = el('div', { class: 'page-stage' });
      flipPage.insertBefore(holder, back);
      try { await this.renderPage(fromKey, holder); } catch (err) { console.warn('翻页动画层渲染失败', err); }
      this.currentEl.style.visibility = 'hidden';
      try { await this.renderPage(nextKey, this.currentEl); } finally { this.currentEl.style.visibility = ''; }
    } else {
      back.classList.add('page-stage', 'back-face');
      try { await this.renderPage(nextKey, back); } catch (err) { console.warn('翻页背面渲染失败', err); }
      this.currentEl.style.visibility = 'hidden';
      try { await this.renderPage(nextKey, this.currentEl); } finally { this.currentEl.style.visibility = ''; }
    }
    this.key = nextKey;

    // 播放动画
    this.bookEl.classList.add('flipping');
    requestAnimationFrame(() => { shade.style.opacity = direction === 'forward' ? '0.6' : '0.4'; });
    await sleep(dur * 0.9);
    flipPage.style.transition = 'opacity 0.16s';
    flipPage.style.opacity = '0.001';
    await sleep(dur * 0.1 + 40);
    flipPage.remove();
    this.bookEl.classList.remove('flipping');
    this.animating = false;
    await this.onAfterFlip?.(nextKey, direction);
  }

  _clonePage(sourceEl) {
    const clone = el('div', { style: { position: 'absolute', inset: '0' } });
    clone.innerHTML = sourceEl.innerHTML;
    // 复用当前滚动位置
    const srcBody = sourceEl.querySelector('.sheet-body');
    const dstBody = clone.querySelector('.sheet-body');
    if (srcBody && dstBody) dstBody.scrollTop = srcBody.scrollTop;
    return clone;
  }

  /* ---------------------------- 手势支持 ---------------------------- */

  _bindGestures() {
    let startX = 0;
    let startY = 0;
    let tracking = false;
    let locked = null;

    const overlayOpen = () => !!document.querySelector('.sheet-overlay, .modal-overlay, .progress-overlay, .viewer-overlay');

    const onStart = (e) => {
      if (this.animating || overlayOpen()) { tracking = false; return; }
      const t = e.touches ? e.touches[0] : e;
      startX = t.clientX; startY = t.clientY;
      tracking = true; locked = null;
    };
    const onMove = (e) => {
      if (!tracking) return;
      if (overlayOpen()) { tracking = false; return; }
      const t = e.touches ? e.touches[0] : e;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (locked == null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        locked = Math.abs(dx) > Math.abs(dy) * 1.35 ? 'x' : 'y';
      }
      if (locked === 'x' && Math.abs(dx) > 12 && e.cancelable) e.preventDefault?.();
    };
    const onEnd = (e) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches ? e.changedTouches[0] : e;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (locked !== 'x') return;
      if (Math.abs(dx) < 58 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      this.onSwipe?.(dx < 0 ? 'next' : 'prev');
    };

    this.bookEl.addEventListener('touchstart', onStart, { passive: true });
    this.bookEl.addEventListener('touchmove', onMove, { passive: false });
    this.bookEl.addEventListener('touchend', onEnd, { passive: true });
    this.bookEl.addEventListener('touchcancel', () => { tracking = false; }, { passive: true });
    if (!isMobile()) {
      this.bookEl.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
    }
  }

  _bindKeys() {
    document.addEventListener('keydown', (e) => {
      if (this.ignoreKeys()) return;
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (['input', 'textarea'].includes(tag) || document.activeElement?.isContentEditable) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { this.onSwipe?.('next'); e.preventDefault(); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { this.onSwipe?.('prev'); e.preventDefault(); }
    });
  }

  prefersReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}



return { "$": $, "Flipbook": Flipbook_ui_flipbook };
} };
/* ================= js/ui/profile.js ================= */
__defs["js/ui/profile.js"] = { exports: ["openProfilePage"], fn: function (module) {
var { "el": el, "toast": toast, "clear": clear, "downloadBlob": downloadBlob, "safeFileName": safeFileName, "pickFiles": pickFiles, "formatCN": formatCN } = __m("js/core/utils.js");
var { "openSheet": openSheet, "promptDialog": promptDialog, "showProgress": showProgress, "hideProgress": hideProgress, "confirmDialog": confirmDialog } = __m("js/ui/modal.js");
var { "currentSession": currentSession, "listAccounts": listAccounts, "listEntries": listEntries, "getAccount": getAccount, "updateAccount": updateAccount, "changePassword": changePassword, "exportBackup": exportBackup, "importBackup": importBackup, "logout": logout, "storageInfo": storageInfo, "settingsGet": settingsGet } = __m("js/core/storage.js");
/* ==========================================================================
 * 日记本 · 「我的」页面
 * 展示当前账号资料（昵称 / 邮箱 / 注册时间）、使用统计，
 * 并提供改昵称、改密码、切换账号、备份导入导出、设置、退出登录等入口。
 * ========================================================================== */




// 设置页与自检页需要 app.js 注入的回调，这里通过 ctx 传入，避免重复接线

const VERSION_ui_profile = (typeof window !== 'undefined' && window.__RIJI_VERSION__) || '1.0.1';

function fmtBytes_ui_profile(bytes) {
  if (!bytes || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function fmtDate_ui_profile(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 统计：日记篇数 / 总字数 / 图片张数 */
function computeStats_ui_profile(entries) {
  let words = 0;
  let images = 0;
  for (const e of entries) {
    words += Number(e.wordCount) || 0;
    images += (e.images?.length || 0) + (e.drawings?.length || 0);
  }
  return { entries: entries.length, words, images };
}

/** 当前登录账号 id（updateAccount / changePassword 都需要它） */
function session2AccountId_ui_profile() {
  const s = currentSession();
  if (!s?.accountId) throw new Error('尚未登录');
  return s.accountId;
}

function openProfilePage_ui_profile(ctx = {}) {
  const session = currentSession() || {};
  let account = null;
  let stats = { entries: 0, words: 0, images: 0 };

  const body = el('div', { class: 'profile' });
  const sheet = openSheet({
    title: '我的',
    subtitle: '账号资料与使用统计',
    fullscreen: true,
    body,
    onClose: () => { /* 关闭时无需额外处理 */ },
  });

  /* ------------------------------ 渲染 ------------------------------ */

  const render = () => {
    clear(body);
    const nickname = account?.nickname || session.nickname || (session.email || '').split('@')[0] || '我';
    const email = account?.email || session.email || '';
    const initial = (nickname || '我').trim().slice(0, 1).toUpperCase();

    /* 顶部资料卡 */
    body.appendChild(el('div', { class: 'profile-hero' }, [
      el('div', { class: 'profile-avatar', text: initial }),
      el('div', { class: 'profile-meta' }, [
        el('b', { text: nickname }),
        el('span', { text: email }),
        el('small', { text: `注册于 ${fmtDate_ui_profile(account?.createdAt)}` }),
      ]),
      el('button', {
        class: 'btn btn-ghost btn-sm', text: '编辑',
        onclick: () => editNickname(),
      }),
    ]));

    /* 统计 */
    body.appendChild(el('div', { class: 'profile-stats' }, [
      el('div', {}, [el('b', { text: String(stats.entries) }), el('span', { text: '篇日记' })]),
      el('div', {}, [el('b', { text: stats.words.toLocaleString('zh-CN') }), el('span', { text: '总字数' })]),
      el('div', {}, [el('b', { text: String(stats.images) }), el('span', { text: '张图片' })]),
    ]));

    /* 条目 */
    const item = (icon, title, desc, control) => el('div', { class: 'set-item' }, [
      el('div', { class: 'info' }, [
        el('b', { text: `${icon}  ${title}` }),
        desc ? el('small', { text: desc }) : null,
      ]),
      el('div', { class: 'control' }, Array.isArray(control) ? control : [control]),
    ]);

    const group1 = el('div', { class: 'set-group' }, [
      item('✏️', '昵称', nickname, el('button', {
        class: 'btn btn-ghost btn-sm', text: '修改', onclick: () => editNickname(),
      })),
      item('🔑', '登录密码', '定期更换更安全', el('button', {
        class: 'btn btn-ghost btn-sm', text: '修改密码', onclick: () => editPassword(),
      })),
      item('👥', '切换账号', `${stats.accounts || 0} 个已保存账号`, el('button', {
        class: 'btn btn-ghost btn-sm', text: '切换', onclick: () => switchAccount(),
      })),
    ]);

    const group2 = el('div', { class: 'set-group' }, [
      item('📤', '导出全部数据', '生成 JSON 备份，换手机时用', el('button', {
        class: 'btn btn-ghost btn-sm', text: '导出', onclick: () => doExport(),
      })),
      item('📥', '导入数据备份', '会与现有日记合并', el('button', {
        class: 'btn btn-ghost btn-sm', text: '导入', onclick: () => doImport(),
      })),
    ]);

    const group3 = el('div', { class: 'set-group' }, [
      item('🎨', '个性化设置', '主题 / 背景 / 字体 / 天气', el('button', {
        class: 'btn btn-ghost btn-sm', text: '打开', onclick: () => { sheet.close(); ctx.onOpenSettings?.(); },
      })),
      item('🩺', '功能自检', '检查各项能力是否正常', el('button', {
        class: 'btn btn-ghost btn-sm', text: '自检',
        onclick: async () => {
          sheet.close();
          const { openDiagnostics } = await __m("js/ui/diagnostics.js");
          openDiagnostics({ settings: await settingsGet() });
        },
      })),
      item('ℹ️', '关于日记本', `版本 ${VERSION_ui_profile} · 数据只存在本机`, el('span', { class: 'profile-ver', text: VERSION_ui_profile })),
    ]);

    body.append(group1, group2, group3);

    /* 退出登录 */
    body.appendChild(el('button', {
      class: 'btn btn-danger profile-logout', text: '退出登录',
      onclick: () => doLogout(),
    }));
    body.appendChild(el('p', {
      class: 'profile-tip',
      text: '日记与图片只保存在这台设备上，不会上传到任何服务器。卸载或清除浏览器数据会丢失，请定期导出备份。',
    }));
  };

  /* ------------------------------ 动作 ------------------------------ */

  async function editNickname() {
    const cur = account?.nickname || '';
    const next = await promptDialog({
      title: '修改昵称',
      label: '昵称',
      value: cur,
      placeholder: '给自己起个名字',
      maxLength: 20,
    });
    if (next == null) return;
    const name = String(next).trim();
    if (!name) { toast('昵称不能为空', { type: 'warn' }); return; }
    await updateAccount(session2AccountId_ui_profile(), { nickname: name });
    account = { ...account, nickname: name };
    toast('昵称已更新', { type: 'success' });
    render();
  }

  async function editPassword() {
    const oldPwd = await promptDialog({ title: '修改密码', label: '当前密码', type: 'password' });
    if (oldPwd == null) return;
    const newPwd = await promptDialog({ title: '修改密码', label: '新密码（至少 6 位）', type: 'password' });
    if (newPwd == null) return;
    if (String(newPwd).length < 6) { toast('新密码至少 6 位', { type: 'warn' }); return; }
    try {
      await changePassword(session2AccountId_ui_profile(), oldPwd, newPwd);
      toast('密码已修改', { type: 'success' });
    } catch (err) {
      toast(`修改失败：${err.message}`, { type: 'error' });
    }
  }

  async function switchAccount() {
    const accounts = await listAccounts();
    if (!accounts.length) { toast('还没有其它账号', { type: 'warn' }); return; }
    sheet.close();
    // 交给设置页的账号面板处理（已有完整逻辑）
    ctx.onOpenSettings?.();
  }

  async function doExport() {
    const progress = showProgress({ title: '正在打包备份…' });
    try {
      const payload = await exportBackup({ includeImages: true });
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      hideProgress();
      downloadBlob(blob, safeFileName(`日记本备份-${new Date().toISOString().slice(0, 10)}.json`, 'backup.json'));
      toast('备份已导出', { type: 'success' });
    } catch (err) {
      hideProgress();
      toast(`导出失败：${err.message}`, { type: 'error' });
    }
  }

  async function doImport() {
    const files = await pickFiles({ accept: 'application/json,.json' });
    if (!files[0]) return;
    const progress = showProgress({ title: '正在导入…' });
    try {
      const text = await files[0].text();
      const res = await importBackup(JSON.parse(text), { overwrite: true });
      hideProgress();
      toast(`已导入 ${res.entries} 篇日记`, { type: 'success' });
      await load();
      render();
    } catch (err) {
      hideProgress();
      toast(`导入失败：${err.message}`, { type: 'error' });
    }
  }

  async function doLogout() {
    const ok = await confirmDialog('日记不会被删除，下次用同一邮箱登录即可继续写。', {
      title: '退出登录？',
      okText: '退出',
      danger: true,
    });
    if (!ok) return;
    logout();
    location.reload();
  }

  /* ------------------------------ 载入 ------------------------------ */

  async function load() {
    const session2 = currentSession() || {};
    account = session2.accountId ? await getAccount(session2.accountId) : null;
    const entries = (await listEntries()).filter(Boolean);
    stats = computeStats_ui_profile(entries);
    try {
      stats.accounts = (await listAccounts()).length;
      const info = storageInfo();
      stats.usage = info?.usageBytes || 0;
    } catch { /* 忽略 */ }
  }

  load().then(render).catch((err) => {
    clear(body);
    body.appendChild(el('p', { class: 'field-hint', text: `加载失败：${err.message}` }));
  });

  return sheet;
}

return { "openProfilePage": openProfilePage_ui_profile };
} };
/* ================= js/ui/sheet.js ================= */
__defs["js/ui/sheet.js"] = { exports: ["toast","htmlToText","relativeCN","imageObjectURL","revokeImageURLs","renderDiaryPage","sanitizeBody","hydrateBodyImages","renderLockedPage","verifyLockPassword","weatherBadge","isUnlocked"], fn: function (module) {
var { "el": el, "clear": clear, "formatCN": formatCN, "toKey": toKey, "fromKey": fromKey, "lunarCN": lunarCN, "festivalCN": festivalCN, "solarTermCN": solarTermCN, "relativeCN": relativeCN, "timeCN": timeCN, "htmlToText": htmlToText, "escapeHtml": escapeHtml, "toast": toast } = __m("js/core/utils.js");
var { "getImage": getImage, "getUnlockedPassword": getUnlockedPassword, "rememberUnlock": rememberUnlock } = __m("js/core/storage.js");
var { "verifyPassword": verifyPassword, "decryptJSON": decryptJSON } = __m("js/core/crypto.js");
var { "weatherSVG": weatherSVG } = __m("js/features/weather.js");
/* ==========================================================================
 * 日记本 · 日记内页渲染
 *  · 正常页 / 空白页 / 上锁页（密码键盘）
 *  · 图片与手写图层展示
 * ========================================================================== */






/* ------------------------------ 图片渲染 ------------------------------- */

const urlCache_ui_sheet = new Map();

async function imageObjectURL_ui_sheet(imageId) {
  if (!imageId) return '';
  if (urlCache_ui_sheet.has(imageId)) return urlCache_ui_sheet.get(imageId);
  const rec = await getImage(imageId);
  if (!rec) return '';
  const url = URL.createObjectURL(rec.blob);
  urlCache_ui_sheet.set(imageId, url);
  return url;
}

function revokeImageURLs_ui_sheet() {
  for (const url of urlCache_ui_sheet.values()) URL.revokeObjectURL(url);
  urlCache_ui_sheet.clear();
}

/* ------------------------------ 内页渲染 ------------------------------- */

/**
 * 渲染一页日记
 * @param {HTMLElement} host
 * @param {object} ctx { entry, dateKey, settings, userFonts, callbacks }
 */
async function renderDiaryPage_ui_sheet(host, ctx) {
  const { entry, dateKey, settings, callbacks = {} } = ctx;
  clear(host);
  host.className = 'sheet';

  const fontFamily = ctx.fontStack || 'var(--font-hand)';
  host.style.setProperty('--reader-font', fontFamily);
  host.style.setProperty('--reader-size', `${settings.font?.size || 17}px`);
  host.style.setProperty('--reader-line', String(settings.font?.lineHeight || 1.85));
  host.style.setProperty('--reader-spacing', `${settings.font?.letterSpacing ?? 0.2}px`);
  const lineH = Math.round((settings.font?.size || 17) * (settings.font?.lineHeight || 1.85));
  host.style.setProperty('--reader-line-h', `${lineH}px`);
  host.style.setProperty('--page-ink', settings.ink?.color || 'var(--ink)');

  if (entry?.locked) { renderLockedPage_ui_sheet(host, ctx); return; }

  /* ---------------- 页眉 ---------------- */
  const date = fromKey(dateKey);
  const dayNum = date.getDate();
  const week = formatCN(dateKey, 'week');
  const lunar = lunarCN(date);
  const fest = festivalCN(date) || solarTermCN(date);
  const isToday = dateKey === toKey(new Date());

  const head = el('div', { class: 'sheet-head' });
  const dateRow = el('div', { class: 'sheet-date' }, [
    el('span', { class: 'sheet-day', text: String(dayNum).padStart(2, '0') }),
    el('span', { class: 'sheet-ym', text: `${date.getFullYear()} / ${String(date.getMonth() + 1).padStart(2, '0')} · ${week}` }),
    el('span', {
      class: 'sheet-lunar',
      html: `${escapeHtml(lunar)}${fest ? `<br><b style="color:var(--accent)">${escapeHtml(fest)}</b>` : ''}`,
    }),
  ]);
  // 页眉：左列放日期/标题/信息，右列固定放操作按钮（窄屏也不重叠、不挤压标题）
  const headText = el('div', { class: 'sheet-head-text' }, [
    dateRow,
    entry?.title ? el('h2', { class: 'sheet-title', text: entry.title }) : null,
  ]);
  const actions = el('div', { class: 'sheet-actions' }, [
    iconAction_ui_sheet('✎', '编辑这篇日记', () => callbacks.onEdit?.(dateKey)),
    iconAction_ui_sheet(entry?.locked ? '🔒' : '🔓', '上锁 / 解锁', () => callbacks.onToggleLock?.(dateKey)),
    iconAction_ui_sheet('⋯', '更多操作', () => callbacks.onMore?.(dateKey)),
  ]);
  head.appendChild(el('div', { class: 'sheet-head-top' }, [headText, actions]));

  const metaBits = [];
  if (relativeCN(dateKey) && isToday) metaBits.push('今天');
  if (entry?.weather?.text) {
    metaBits.push(el('span', {
      class: 'sheet-weather',
      html: `${settings.ui?.showWeatherIcon === false ? '' : weatherSVG(entry.weather.kind || 'cloudy', { size: 20, animate: false })}<span>${escapeHtml(entry.weather.text)} ${entry.weather.temp != null ? `${entry.weather.temp}°` : ''} ${entry.weather.city ? `· ${escapeHtml(entry.weather.city)}` : ''}</span>`,
    }));
  }
  if (entry?.mood) metaBits.push(el('span', { text: entry.mood }));
  if (entry?.location) metaBits.push(el('span', { text: `📍 ${entry.location}` }));
  if (entry?.wordCount) metaBits.push(el('span', { text: `${entry.wordCount} 字` }));
  if (entry?.updatedAt && !isToday) metaBits.push(el('span', { text: `最后修改 ${timeCN(entry.updatedAt)}` }));
  if ((entry?.revisions?.length || 0) > 0) metaBits.push(el('span', { text: `批改 ${entry.revisions.length} 次` }));
  if (metaBits.length) {
    const metaRow = el('div', { class: 'sheet-meta' });
    metaBits.forEach((bit, i) => {
      if (i) metaRow.appendChild(el('span', { text: '·', style: { opacity: '0.5' } }));
      metaRow.appendChild(typeof bit === 'string' ? el('span', { text: bit }) : bit);
    });
    headText.appendChild(metaRow);
  }
  host.appendChild(head);
  /* ---------------- 正文 ---------------- */
  const body = el('div', { class: 'sheet-body' });
  if (settings.paper?.lines === false) body.classList.add('no-lines');

  const hasContent = !!(entry && (entry.body?.trim() || entry.drawings?.length || entry.images?.length));
  if (!hasContent) {
    body.appendChild(el('div', { class: 'sheet-empty' }, [
      el('div', { class: 'hint-arrow', text: isToday ? '✍️' : '📄' }),
      el('div', { class: 'big', text: isToday ? '今天还没有落笔' : '这一天还是空白' }),
      el('div', {
        class: 'small',
        html: isToday
          ? '点下面的「写日记」开始记录，<br>也可以用「手写」直接写在本子上。'
          : '想补写这一天吗？<br>点下方按钮补上，或去日历翻别的日子。',
      }),
      el('button', {
        class: 'btn btn-secondary btn-sm', text: isToday ? '开始写今天' : '补写这一天',
        style: { marginTop: '10px' },
        onclick: () => callbacks.onEdit?.(dateKey),
      }),
    ]));
  } else {
    body.innerHTML = sanitizeBody_ui_sheet(entry.body || '');
    await hydrateBodyImages_ui_sheet(body, callbacks);
    // 图片（照片 / 素描）——存在 entry.images 里，之前只用来判断"非空"却没渲染出来
    for (const item of entry.images || []) {
      if (!item?.id) continue;
      const src = await imageObjectURL_ui_sheet(item.thumbId || item.id);
      const full = await imageObjectURL_ui_sheet(item.id);
      if (!src && !full) continue;
      const layout = item.layout || 'center';
      const wrap = el('figure', { class: `inline-image layout-${layout}${item.sketch ? ' is-sketch' : ''}` }, [
        el('img', { src: src || full, alt: item.caption || (item.sketch ? '素描' : '照片'), loading: 'lazy' }),
      ]);
      if (item.caption) wrap.appendChild(el('figcaption', { text: item.caption }));
      wrap.addEventListener('click', () => callbacks.onViewImage?.(full || src, item.caption || '图片'));
      body.appendChild(wrap);
    }
    // 手写图层
    for (const d of entry.drawings || []) {
      if (!d.imageId) continue;
      const url = await imageObjectURL_ui_sheet(d.imageId);
      if (!url) continue;
      const wrap = el('div', { class: 'inline-drawing' }, [
        el('img', { src: url, alt: '手写稿', loading: 'lazy' }),
      ]);
      wrap.addEventListener('click', () => callbacks.onViewImage?.(url, '手写稿'));
      body.appendChild(wrap);
    }
  }
  host.appendChild(body);

  // 印章装饰
  const stamp = settings.cover?.stamp || entry?.mood || '';
  if (settings.ui?.stamp !== false && (stamp || isToday)) {
    host.appendChild(el('div', { class: `sheet-stamp ${stamp ? '' : 'plain'}`, text: stamp || '今日' }));
  }
}

function iconAction_ui_sheet(icon, title, onclick) {
  return el('button', { text: icon, title, 'aria-label': title, onclick });
}

/** 清洗正文 HTML：只允许安全标签与 img:// 图片协议 */
function sanitizeBody_ui_sheet(html) {
  const allowed = new Set(['P', 'DIV', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'SPAN', 'H1', 'H2', 'H3',
    'UL', 'OL', 'LI', 'BLOCKQUOTE', 'HR', 'IMG', 'FIGURE', 'FIGCAPTION', 'MARK', 'A', 'SUB', 'SUP']);
  const container = document.createElement('div');
  container.innerHTML = String(html || '');
  const walk = (node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.COMMENT_NODE) { child.remove(); continue; }
      if (child.nodeType !== Node.ELEMENT_NODE) continue;
      const tag = child.tagName;
      if (!allowed.has(tag)) {
        // 保留文本内容，去掉标签
        const text = document.createTextNode(child.textContent || '');
        child.replaceWith(text);
        continue;
      }
      for (const attr of Array.from(child.attributes)) {
        const name = attr.name.toLowerCase();
        const value = attr.value;
        if (tag === 'IMG') {
          if (name === 'src' && !/^(img:\/\/|data:image\/|blob:)/i.test(value)) child.removeAttribute('src');
          else if (!['src', 'alt', 'data-id', 'data-caption', 'loading', 'width', 'height', 'style'].includes(name)) child.removeAttribute(name);
        } else if (name === 'style') {
          if (/expression|javascript:/i.test(value)) child.removeAttribute(name);
        } else if (!['class', 'href', 'title'].includes(name)) {
          child.removeAttribute(name);
        }
      }
      if (tag === 'A') { child.setAttribute('rel', 'noopener noreferrer'); child.setAttribute('target', '_blank'); }
      walk(child);
    }
  };
  walk(container);
  return container.innerHTML;
}

/** 把 img:// 协议换成真实 blob URL，并绑定点击查看 */
async function hydrateBodyImages_ui_sheet(root, callbacks = {}) {
  const imgs = Array.from(root.querySelectorAll('img'));
  for (const img of imgs) {
    const src = img.getAttribute('src') || '';
    const m = /^img:\/\/(.+)$/.exec(src);
    if (m) {
      const url = await imageObjectURL_ui_sheet(m[1]);
      if (url) img.src = url;
      else { img.replaceWith(el('span', { class: 'chip chip-ghost', text: '［图片已丢失］' })); continue; }
    }
    if (img.dataset.bound) continue;
    img.dataset.bound = '1';
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      callbacks.onViewImage?.(img.src, img.alt || '');
    });
  }
}

/* ------------------------------ 锁定页 --------------------------------- */

function renderLockedPage_ui_sheet(host, ctx) {
  const { entry, dateKey, callbacks = {} } = ctx;
  clear(host);
  host.className = 'sheet';

  const wrap = el('div', { class: 'lock-sheet' });
  wrap.append(
    el('div', { class: 'lock-icon', text: '🔒' }),
    el('div', { class: 'lock-title', text: '这篇日记上了锁' }),
    el('div', { class: 'lock-note', text: `${dateKey} 的日记已加密保存，输入当天设置的密码即可查看。` }),
  );

  // 环境不支持加密时（例如用局域网 HTTP 打开），直接把原因和解法讲清楚
  const cryptoReady = !!(globalThis.crypto && globalThis.crypto.subtle);
  if (!cryptoReady) {
    wrap.append(
      el('div', {
        class: 'lock-note',
        style: { color: 'var(--danger)', maxWidth: '300px' },
        text: '当前打开方式下，浏览器禁止了加密功能（WebCrypto），所以无法解密这篇日记。'
          + '\n请改用 http://localhost 打开、给页面配置 HTTPS，或安装成 App（见 构建/README-安装说明.md）。',
      }),
    );
    host.appendChild(wrap);
    return;
  }

  const digits = el('div', { class: 'lock-digits' });
  const boxes = [];
  const isNumeric = /^\d{4,6}$/.test(entry?.lockHint || '') || entry?.lockType === 'pin';
  const length = isNumeric ? Math.min(6, Math.max(4, (entry?.lockHint || '').length || 4)) : 0;

  if (length) {
    for (let i = 0; i < length; i++) {
      const box = el('div', { class: 'lock-digit' });
      boxes.push(box);
      digits.appendChild(box);
    }
    wrap.appendChild(digits);
  }

  let input = '';
  const setInput = (val) => {
    input = val;
    boxes.forEach((b, i) => { b.textContent = input[i] ? '●' : ''; b.classList.toggle('filled', !!input[i]); });
  };

  const errorNode = el('div', { class: 'lock-note', style: { color: 'var(--danger)', minHeight: '18px' } });

  if (length) {
    const pad = el('div', { class: 'lock-pad' });
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'];
    for (const k of keys) {
      pad.appendChild(el('button', {
        text: k,
        onclick: async () => {
          if (k === '⌫') { setInput(input.slice(0, -1)); errorNode.textContent = ''; return; }
          if (k === '✓') {
            if (input.length < length) { errorNode.textContent = `还差 ${length - input.length} 位`; return; }
            await attempt();
            return;
          }
          if (input.length >= length) return;
          errorNode.textContent = '';
          setInput(input + k);
        },
      }));
    }
    wrap.appendChild(pad);
    wrap.appendChild(el('div', { class: 'lock-note', style: { opacity: '0.55', fontSize: '11.5px' }, text: '输完 4 位后点 ✓ 确认' }));
  } else {
    const pwd = el('input', { class: 'input', type: 'password', placeholder: '输入密码', style: { maxWidth: '240px', textAlign: 'center' } });
    const btn = el('button', {
      class: 'btn btn-primary', text: '解锁',
      onclick: async () => { await attempt(pwd.value); },
    });
    pwd.addEventListener('keydown', (e) => { if (e.key === 'Enter') attempt(pwd.value); });
    wrap.append(el('div', { style: { display: 'flex', gap: '8px', width: '100%', maxWidth: '320px' } }, [pwd]), btn);
    setTimeout(() => pwd.focus(), 200);
    wrap._pwdInput = pwd;
  }

  wrap.appendChild(errorNode);
  host.appendChild(wrap);

  async function attempt(value = input) {
    if (!value) return;
    try {
      errorNode.textContent = '正在校验…';
      const payload = entry.lockPayload;
      if (!payload) throw new Error('加密数据缺失');
      const verifier = await verifyLockPassword_ui_sheet(value, entry);
      if (!verifier) {
        errorNode.textContent = '密码不对，再试一次';
        host.querySelector('.lock-sheet')?.classList.add('lock-shake');
        setTimeout(() => host.querySelector('.lock-sheet')?.classList.remove('lock-shake'), 460);
        setInput('');
        return;
      }
      const data = await decryptJSON(payload, value);
      errorNode.textContent = '';
      rememberUnlock(dateKey, value);
      // 用解密后的内容替换页面
      await callbacks.onUnlocked?.(dateKey, data);
    } catch (err) {
      const noCrypto = !globalThis.crypto?.subtle;
      errorNode.textContent = noCrypto
        ? '当前打开方式下浏览器禁用了加密（WebCrypto），无法解密。请改用 localhost / HTTPS，或安装成 App。'
        : (err.message || '解锁失败，请重试');
      setInput('');
    }
  }
}

/** 校验上锁密码（通过 keyFingerprint 比对，避免解密开销） */
async function verifyLockPassword_ui_sheet(password, entry) {
  const { keyFingerprint } = await __m("js/core/crypto.js");
  if (!entry?.lockFingerprint || !entry?.lockSalt) return false;
  const fp = await keyFingerprint(password, entry.lockSalt);
  return fp === entry.lockFingerprint;
}

/* ------------------------------ 天气小图标 ----------------------------- */

function weatherBadge_ui_sheet(kind, text) {
  return el('span', { html: `${weatherSVG(kind, { size: 22, animate: false })}<span>${escapeHtml(text || '')}</span>` });
}

function isUnlocked_ui_sheet(dateKey) { return !!getUnlockedPassword(dateKey); }



return { "toast": toast, "htmlToText": htmlToText, "relativeCN": relativeCN, "imageObjectURL": imageObjectURL_ui_sheet, "revokeImageURLs": revokeImageURLs_ui_sheet, "renderDiaryPage": renderDiaryPage_ui_sheet, "sanitizeBody": sanitizeBody_ui_sheet, "hydrateBodyImages": hydrateBodyImages_ui_sheet, "renderLockedPage": renderLockedPage_ui_sheet, "verifyLockPassword": verifyLockPassword_ui_sheet, "weatherBadge": weatherBadge_ui_sheet, "isUnlocked": isUnlocked_ui_sheet };
} };
/* ================= js/ui/settings.js ================= */
__defs["js/ui/settings.js"] = { exports: ["THEMES","PAPER_STYLES","INK_COLORS","openSettings"], fn: function (module) {
var { "el": el, "clear": clear, "toast": toast, "pickFiles": pickFiles, "safeFileName": safeFileName, "downloadBlob": downloadBlob, "downloadText": downloadText, "confirmDialog": confirmDialog, "uid": uid, "isIOS": isIOS, "isStandalone": isStandalone } = __m("js/core/utils.js");
var { "openModal": openModal, "openSheet": openSheet, "showProgress": showProgress, "hideProgress": hideProgress, "promptDialog": promptDialog, "pickOption": pickOption } = __m("js/ui/modal.js");
var { "settingsGet": settingsGet, "settingsSet": settingsSet, "putImage": putImage, "deleteImage": deleteImage, "exportBackup": exportBackup, "importBackup": importBackup, "gcImages": gcImages, "listFonts": listFonts, "putFont": putFont, "deleteFont": deleteFont, "updateAccount": updateAccount, "changePassword": changePassword, "logout": logout, "currentSession": currentSession, "listAccounts": listAccounts, "vaultClearAccount": vaultClearAccount } = __m("js/core/storage.js");
var { "openSketchStudio": openSketchStudio } = __m("js/ui/sketch.js");
var { "imageObjectURL": imageObjectURL } = __m("js/ui/sheet.js");
var { "HANDWRITING_PRESETS": HANDWRITING_PRESETS, "importFontFile": importFontFile, "registerFont": registerFont, "renderFontCard": renderFontCard, "getPreset": getPreset } = __m("js/features/handwriting.js");
var { "AI_PROVIDERS": AI_PROVIDERS } = __m("js/features/ai.js");
var { "CITY_TABLE": CITY_TABLE, "fetchWeatherByCity": fetchWeatherByCity } = __m("js/features/weather.js");
var { "blobToDataUrl": blobToDataUrl } = __m("js/features/handwriting.js");
var { "loadImageFromBlob": loadImageFromBlob, "dominantColor": dominantColor } = __m("js/core/image-engine.js");
/* ==========================================================================
 * 日记本 · 设置中心
 *  主题 / 背景（含 AI 素描背景）/ 纸张 / 字体 / 笔墨 / 手写参数
 *  AI 引擎 / 天气城市 / 上锁策略 / 导出偏好 / 账号与数据备份
 * ========================================================================== */












const THEMES_ui_settings = [
  { id: 'linen', name: '亚麻皮革', colors: ['#7b4b2a', '#c9a227'] },
  { id: 'ink', name: '水墨青蓝', colors: ['#33415c', '#7d8fb3'] },
  { id: 'sakura', name: '樱花粉', colors: ['#a8556a', '#e3a9b7'] },
  { id: 'forest', name: '森林绿', colors: ['#3f6b4a', '#8fb787'] },
  { id: 'night', name: '暖夜暗色', colors: ['#b98a5a', '#22262f'] },
  { id: 'knight', name: '骑士黑金', colors: ['#1f6feb', '#f2b632'] },
];

const PAPER_STYLES_ui_settings = [
  { id: 'cream', name: '米色纸', color: '#fbf5e6' },
  { id: 'white', name: '纯白纸', color: '#ffffff' },
  { id: 'kraft', name: '牛皮纸', color: '#f0e2c8' },
  { id: 'blue', name: '淡蓝纸', color: '#eef4fb' },
  { id: 'pink', name: '樱花纸', color: '#fdf1f3' },
  { id: 'dark', name: '夜读纸', color: '#22262f' },
];

const INK_COLORS_ui_settings = ['#2b2a30', '#20304a', '#111111', '#2f6f4f', '#a5382a', '#2f5aa5', '#7a3f8f', '#8a5a15'];

/**
 * 打开设置面板
 * @param {object} ctx { onChanged(settings) }
 */
async function openSettings_ui_settings(ctx = {}) {
  let settings = await settingsGet();
  let userFonts = await listFonts();

  // 背景图的 blob URL 在刷新后失效，这里重新解析一次用于预览
  if (settings.bg?.imageId && !settings.bg.imageUrl) {
    try {
      settings.bg.imageUrl = await imageObjectURL(settings.bg.imageId);
    } catch { /* 忽略 */ }
  }

  const body = el('div');

  const apply = async (patch, { silent = false } = {}) => {
    settings = await settingsSet(patch);
    ctx.onChanged?.(settings, patch);
    if (!silent) toast('已保存设置', { duration: 1200 });
    return settings;
  };

  const group = (title, children) => el('div', { class: 'set-group' }, [
    el('h3', { text: title }),
    ...children,
  ]);

  const item = (title, desc, control) => el('div', { class: 'set-item' }, [
    el('div', { class: 'info' }, [
      el('b', { text: title }),
      desc ? el('small', { text: desc }) : null,
    ]),
    el('div', { class: 'control' }, Array.isArray(control) ? control : [control]),
  ]);

  const toggle = (checked, onChange) => {
    const input = el('input', { type: 'checkbox' });
    input.checked = !!checked;
    input.addEventListener('change', () => onChange(input.checked));
    return el('label', { class: 'switch' }, [input, el('span', { class: 'switch-track' })]);
  };

  const slider = (value, { min, max, step, onInput, format = (v) => String(v) }) => {
    const valNode = el('span', { class: 'val', text: format(value), style: { minWidth: '34px', textAlign: 'right', fontFamily: 'var(--font-num)' } });
    const input = el('input', {
      type: 'range', min: String(min), max: String(max), step: String(step), value: String(value),
      oninput: () => { valNode.textContent = format(Number(input.value)); onInput(Number(input.value)); },
    });
    return el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '140px' } }, [input, valNode]);
  };

  /* ============================ 渲染 ============================ */

  const render = () => {
    clear(body);

    /* ---------------- 主题 ---------------- */
    const themeGrid = el('div', { class: 'set-grid' });
    for (const t of THEMES_ui_settings) {
      themeGrid.appendChild(el('button', {
        class: `theme-card ${settings.theme === t.id ? 'active' : ''}`,
        onclick: async () => { await apply({ theme: t.id }, { silent: true }); render(); },
      }, [
        el('div', {
          class: 'swatch-bg',
          style: { background: `linear-gradient(140deg, ${t.colors[0]}, ${t.colors[1]})` },
        }, [el('span', { text: '日记本' })]),
        el('div', { class: 'name', text: t.name }),
      ]));
    }
    body.appendChild(group('主题风格', [themeGrid]));

    /* ---------------- 背景 ---------------- */
    const bg = settings.bg || {};
    const bgPreview = el('div', {
      class: 'bg-preview',
      style: {
        background: bg.imageUrl ? `url(${bg.imageUrl})` : 'linear-gradient(140deg, var(--brand-2), var(--brand))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: String(1),
      },
    }, [el('div', { class: 'sample-text', text: '看看背景效果' })]);

    body.appendChild(group('App 背景', [
      bgPreview,
      el('div', { class: 'cal-tools', style: { justifyContent: 'flex-start', marginBottom: '10px' } }, [
        el('button', {
          class: 'btn btn-secondary btn-sm', text: '上传图片做背景',
          onclick: () => pickBackgroundImage(),
        }),
        el('button', {
          class: 'btn btn-secondary btn-sm', text: '拍照/选图 → AI 素描背景',
          onclick: () => pickBackgroundImage({ sketch: true }),
        }),
        bg.imageId ? el('button', {
          class: 'btn btn-ghost btn-sm', text: '移除图片',
          onclick: async () => {
            await deleteImage(bg.imageId);
            await apply({ bg: { imageId: null, imageUrl: '' } }, { silent: true });
            render();
          },
        }) : null,
      ]),
      item('背景不透明度', '让背景更淡一点，文字更清楚', slider(bg.opacity ?? 0.5, {
        min: 0.05, max: 1, step: 0.05,
        format: (v) => `${Math.round(v * 100)}%`,
        onInput: async (v) => { await apply({ bg: { opacity: v } }, { silent: true }); },
      })),
      item('背景虚化', '轻微模糊背景，突出日记内容', slider(bg.blur ?? 0, {
        min: 0, max: 12, step: 1,
        format: (v) => `${v}px`,
        onInput: async (v) => { await apply({ bg: { blur: v } }, { silent: true }); },
      })),
      item('启用背景', '关闭后使用纯色背景', toggle(bg.enabled !== false, async (v) => {
        await apply({ bg: { enabled: v } }, { silent: true });
      })),
    ]));

    /* ---------------- 纸张 ---------------- */
    const paperGrid = el('div', { class: 'set-grid' });
    for (const p of PAPER_STYLES_ui_settings) {
      paperGrid.appendChild(el('button', {
        class: `theme-card ${settings.paper?.style === p.id ? 'active' : ''}`,
        onclick: async () => { await apply({ paper: { style: p.id, color: p.color } }, { silent: true }); render(); },
      }, [
        el('div', { class: 'swatch-bg', style: { background: p.color } }),
        el('div', { class: 'name', text: p.name }),
      ]));
    }
    body.appendChild(group('纸张', [
      paperGrid,
      item('显示横线', '像真实日记本一样的横格线', toggle(settings.paper?.lines !== false, async (v) => {
        await apply({ paper: { lines: v } }, { silent: true });
      })),
      item('行距', '', slider(settings.paper?.lineGap ?? 30, {
        min: 22, max: 44, step: 2, format: (v) => `${v}px`,
        onInput: async (v) => { await apply({ paper: { lineGap: v } }, { silent: true }); },
      })),
      item('纸张质感', '添加细微纤维噪点', slider(settings.paper?.texture ?? 0.5, {
        min: 0, max: 1, step: 0.1, format: (v) => `${Math.round(v * 100)}%`,
        onInput: async (v) => { await apply({ paper: { texture: v } }, { silent: true }); },
      })),
    ]));

    /* ---------------- 字体 ---------------- */
    const fontList = el('div', { class: 'font-list' });
    for (const p of HANDWRITING_PRESETS) {
      const stack = p.stack.join(', ');
      fontList.appendChild(el('button', {
        class: `font-card ${settings.handwriting?.styleId === p.id ? 'active' : ''}`,
        onclick: async () => { await apply({ handwriting: { styleId: p.id } }, { silent: true }); render(); },
      }, [
        el('div', { class: 'preview' }, [
          el('div', { class: 'sample', style: { fontFamily: stack }, text: '今天也要好好写日记' }),
          el('small', { text: `${p.name} · ${p.desc}` }),
        ]),
        settings.handwriting?.styleId === p.id ? el('span', { text: '✓', style: { color: 'var(--brand)', fontSize: '18px' } }) : null,
      ]));
    }
    for (const f of userFonts) {
      fontList.appendChild(el('button', {
        class: `font-card ${settings.handwriting?.styleId === `user:${f.family}` ? 'active' : ''}`,
        onclick: async () => {
          await registerFont({ family: f.family, dataUrl: f.dataUrl }).catch(() => {});
          await apply({ handwriting: { styleId: `user:${f.family}` } }, { silent: true });
          render();
        },
      }, [
        el('div', { class: 'preview' }, [
          el('div', { class: 'sample', style: { fontFamily: `"${f.family}"` }, text: '导入的手写字体' }),
          el('small', { text: `${f.name} · 我导入的字体` }),
        ]),
        el('span', {
          text: '🗑', title: '删除字体',
          style: { fontSize: '15px', padding: '6px' },
          onclick: async (e) => {
            e.stopPropagation();
            const ok = await confirmDialog(`删除字体「${f.name}」？`, { title: '删除字体', danger: true, okText: '删除' });
            if (!ok) return;
            await deleteFont(f.id);
            userFonts = await listFonts();
            render();
          },
        }),
      ]));
    }

    body.appendChild(group('手写字体', [
      el('p', { class: 'field-hint', style: { marginBottom: '10px' }, text: '这套字体用于：App 内正文字体、以及「文字一键转手写稿」的渲染效果。' }),
      fontList,
      el('div', { class: 'cal-tools', style: { justifyContent: 'flex-start', marginTop: '10px' } }, [
        el('button', {
          class: 'btn btn-secondary btn-sm', text: '导入字体文件（.ttf/.otf）',
          onclick: async () => {
            const files = await pickFiles({ accept: '.ttf,.otf,.woff,.woff2,font/*' });
            if (!files[0]) return;
            const progress = showProgress({ title: '正在导入字体…' });
            try {
              const info = await importFontFile(files[0]);
              await putFont(info);
              userFonts = await listFonts();
              hideProgress();
              toast(`字体「${info.name}」已导入`, { type: 'success' });
              render();
            } catch (err) {
              hideProgress();
              toast(`导入失败：${err.message}`, { type: 'error' });
            }
          },
        }),
      ]),
      item('字号', '', slider(settings.font?.size ?? 17, {
        min: 13, max: 26, step: 1, format: (v) => `${v}px`,
        onInput: async (v) => { await apply({ font: { size: v } }, { silent: true }); },
      })),
      item('行高', '', slider(settings.font?.lineHeight ?? 1.85, {
        min: 1.3, max: 2.6, step: 0.05, format: (v) => v.toFixed(2),
        onInput: async (v) => { await apply({ font: { lineHeight: v } }, { silent: true }); },
      })),
      item('字间距', '', slider(settings.font?.letterSpacing ?? 0.2, {
        min: 0, max: 3, step: 0.1, format: (v) => `${v.toFixed(1)}px`,
        onInput: async (v) => { await apply({ font: { letterSpacing: v } }, { silent: true }); },
      })),
    ]));

    /* ---------------- 手写渲染参数 ---------------- */
    body.appendChild(group('手写渲染细节', [
      el('p', { class: 'field-hint', style: { marginBottom: '10px' }, text: '把输入的文字渲染成手写稿时，这些参数决定「像不像手写」。' }),
      item('手写抖动', '每个字的自然错落程度', slider(settings.handwriting?.jitter ?? 0.5, {
        min: 0, max: 1, step: 0.05, format: (v) => `${Math.round(v * 100)}%`,
        onInput: async (v) => { await apply({ handwriting: { jitter: v } }, { silent: true }); },
      })),
      item('倾斜角度', '整体向右倾斜的度数', slider(settings.handwriting?.slant ?? 2, {
        min: -6, max: 10, step: 0.5, format: (v) => `${v}°`,
        onInput: async (v) => { await apply({ handwriting: { slant: v } }, { silent: true }); },
      })),
      item('墨迹渗化', '模拟纸张吸墨的晕染感', slider(settings.handwriting?.inkBleed ?? 0.35, {
        min: 0, max: 1, step: 0.05, format: (v) => `${Math.round(v * 100)}%`,
        onInput: async (v) => { await apply({ handwriting: { inkBleed: v } }, { silent: true }); },
      })),
      item('笔墨颜色', '正文与手写稿的墨水色', (() => {
        const row = el('div', { class: 'swatch-row' });
        for (const c of INK_COLORS_ui_settings) {
          row.appendChild(el('button', {
            class: `swatch ${settings.ink?.color === c ? 'active' : ''}`,
            style: { background: c },
            onclick: async () => { await apply({ ink: { color: c } }, { silent: true }); render(); },
          }));
        }
        return row;
      })()),
      item('预览手写效果', '生成一张样张看看', el('button', {
        class: 'btn btn-ghost btn-sm', text: '生成样张',
        onclick: async () => {
          const progress = showProgress({ title: '正在生成手写样张…' });
          try {
            const { renderHandwriting } = await __m("js/features/handwriting.js");
            const stack = await ctx.getFontStack?.(settings.handwriting?.styleId) || getPreset(settings.handwriting?.styleId || 'kai').stack.join(', ');
            const res = await renderHandwriting(
              '<p>窗外的风把树叶翻了个面，像翻过一页纸。</p><p>今天也要好好写日记，写下的日子不会消失。</p>',
              {
                fontStack: stack,
                jitter: settings.handwriting?.jitter,
                slant: settings.handwriting?.slant,
                inkBleed: settings.handwriting?.inkBleed,
                inkColor: settings.ink?.color,
                paper: { color: '#fdfaf1', lines: true, lineGap: 34, texture: 0.3 },
                width: 900,
                maxHeight: 1400,
              },
            );
            hideProgress();
            const url = URL.createObjectURL(res.blob);
            const { openImageViewer } = await __m("js/ui/modal.js");
            openImageViewer(url);
          } catch (err) {
            hideProgress();
            toast(`生成失败：${err.message}`, { type: 'error' });
          }
        },
      })),
    ]));

    /* ---------------- AI ---------------- */
    const ai = settings.ai || {};
    const providerOptions = AI_PROVIDERS.map((p) => ({ value: p.id, label: p.name, desc: p.note, icon: p.id === 'local' ? '📱' : '☁️' }));
    body.appendChild(group('AI 引擎', [
      item('素描 / 手写引擎', ai.provider === 'local' ? '当前：本地算法（离线可用，隐私最好）' : `当前：${AI_PROVIDERS.find((p) => p.id === ai.provider)?.name || ai.provider}`, el('button', {
        class: 'btn btn-ghost btn-sm', text: '切换',
        onclick: async () => {
          const v = await pickOption({ title: '选择 AI 引擎', options: providerOptions, value: ai.provider || 'local' });
          if (!v) return;
          const def = AI_PROVIDERS.find((p) => p.id === v);
          await apply({ ai: { provider: v, endpoint: ai.endpoint || def.defaultEndpoint || '', model: ai.model || def.defaultModel || '' } }, { silent: true });
          render();
        },
      })),
      ai.provider && ai.provider !== 'local' ? el('div', {}, [
        item('接口地址', '例如 https://api.openai.com/v1', el('input', {
          class: 'input', style: { width: '180px' }, value: ai.endpoint || '', placeholder: 'https://…',
          onchange: async (e) => { await apply({ ai: { endpoint: e.target.value.trim() } }, { silent: true }); },
        })),
        item('API Key', '只保存在本机浏览器里，不会上传', el('input', {
          class: 'input', style: { width: '180px' }, type: 'password', value: ai.apiKey || '', placeholder: 'sk-…',
          onchange: async (e) => { await apply({ ai: { apiKey: e.target.value.trim() } }, { silent: true }); },
        })),
        item('模型名称', '按服务商文档填写', el('input', {
          class: 'input', style: { width: '180px' }, value: ai.model || '', placeholder: '模型名',
          onchange: async (e) => { await apply({ ai: { model: e.target.value.trim() } }, { silent: true }); },
        })),
      ]) : null,
      el('p', { class: 'field-hint', text: '本地算法：照片在手机上直接转换，不需要网络；云端 AI 效果上限更高，但需要自备 API Key，且照片会上传到该服务商。' }),
    ]));

    /* ---------------- 天气 ---------------- */
    const weather = settings.weather || {};
    const cityGrid = el('div', { class: 'city-grid' });
    for (const c of CITY_TABLE.slice(0, 18)) {
      cityGrid.appendChild(el('button', {
        class: `city-chip ${weather.city === c.name ? 'active' : ''}`,
        text: c.name,
        onclick: async () => {
          const progress = showProgress({ title: `正在获取${c.name}的天气…` });
          try {
            const data = await fetchWeatherByCity(c.name);
            hideProgress();
            await apply({ weather: { city: c.name, lat: c.lat, lon: c.lon, auto: false } }, { silent: true });
            ctx.onWeather?.(data);
            toast(`${c.name}：${data.text} ${data.temp}℃`, { type: 'success' });
            render();
          } catch (err) {
            hideProgress();
            toast(`获取失败：${err.message}`, { type: 'error' });
          }
        },
      }));
    }
    body.appendChild(group('天气与位置', [
      item('自动定位', '使用手机定位获取当地天气（需授权）', toggle(weather.auto !== false, async (v) => {
        await apply({ weather: { auto: v } }, { silent: true });
        ctx.onWeatherRefresh?.();
      })),
      item('当前城市', weather.city || '未设置（将尝试定位）', el('button', {
        class: 'btn btn-ghost btn-sm', text: '手动输入',
        onclick: async () => {
          const name = await promptDialog({ title: '输入城市名', placeholder: '如：杭州', hint: '离线时只支持内置的常用城市' });
          if (!name) return;
          const progress = showProgress({ title: '正在查询…' });
          try {
            const data = await fetchWeatherByCity(name);
            hideProgress();
            await apply({ weather: { city: data.city, lat: data.lat, lon: data.lon, auto: false } }, { silent: true });
            ctx.onWeather?.(data);
            render();
          } catch (err) {
            hideProgress();
            toast(err.message, { type: 'error' });
          }
        },
      })),
      el('p', { class: 'field-hint', text: '常用城市：' }),
      cityGrid,
      item('显示漫画天气图标', '关闭后只显示文字', toggle(settings.ui?.showWeatherIcon !== false, async (v) => {
        await apply({ ui: { showWeatherIcon: v } }, { silent: true });
      })),
      item('显示农历 / 节气', '', toggle(settings.ui?.showLunar !== false, async (v) => {
        await apply({ ui: { showLunar: v } }, { silent: true });
      })),
      item('翻页音效', '纸质翻页的沙沙声', toggle(settings.sound?.pageTurn !== false, async (v) => {
        await apply({ sound: { pageTurn: v } }, { silent: true });
      })),
      item('震动反馈', '翻页与保存时的轻微震动', toggle(settings.ui?.haptics !== false, async (v) => {
        await apply({ ui: { haptics: v } }, { silent: true });
      })),
    ]));

    /* ---------------- 上锁策略 ---------------- */
    body.appendChild(group('隐私与上锁', [
      item('自动重新上锁', '离开 App 一段时间后需要重新输密码', el('button', {
        class: 'btn btn-ghost btn-sm',
        text: `${settings.lock?.autoLockMinutes ?? 5} 分钟`,
        onclick: async () => {
          const v = await pickOption({
            title: '自动重新上锁',
            options: [1, 3, 5, 10, 30].map((m) => ({ value: m, label: `${m} 分钟`, desc: m === 5 ? '推荐' : '' })),
            value: settings.lock?.autoLockMinutes ?? 5,
          });
          if (v) { await apply({ lock: { autoLockMinutes: v } }, { silent: true }); render(); }
        },
      })),
      item('上锁日记的加密方式', 'AES-GCM 256 位，密钥由密码派生，忘记密码无法找回', el('span', { class: 'chip', text: '已启用' })),
    ]));

    /* ---------------- 导出偏好 ---------------- */
    body.appendChild(group('导出偏好', [
      item('默认导出格式', '', el('button', {
        class: 'btn btn-ghost btn-sm',
        text: settings.export?.format === 'docx' ? 'Word (.docx)' : 'PDF',
        onclick: async () => {
          const v = await pickOption({
            title: '默认导出格式',
            options: [
              { value: 'pdf', label: 'PDF', desc: '排版固定，适合打印成册', icon: '📕' },
              { value: 'docx', label: 'Word (.docx)', desc: '可再编辑，字体使用系统手写字体', icon: '📘' },
            ],
            value: settings.export?.format || 'pdf',
          });
          if (v) { await apply({ export: { format: v } }, { silent: true }); render(); }
        },
      })),
      item('纸张尺寸', '影响 PDF 分页效果', el('button', {
        class: 'btn btn-ghost btn-sm', text: settings.export?.paper === 'a4' ? 'A4' : 'A5（手账常见）',
        onclick: async () => {
          const v = await pickOption({
            title: '纸张尺寸',
            options: [{ value: 'a5', label: 'A5', desc: '手账本常见尺寸' }, { value: 'a4', label: 'A4', desc: '标准打印纸' }],
            value: settings.export?.paper || 'a5',
          });
          if (v) { await apply({ export: { paper: v } }, { silent: true }); render(); }
        },
      })),
      item('导出时包含图片', '', toggle(settings.export?.includeImages !== false, async (v) => {
        await apply({ export: { includeImages: v } }, { silent: true });
      })),
      item('导出时包含天气', '', toggle(settings.export?.includeWeather !== false, async (v) => {
        await apply({ export: { includeWeather: v } }, { silent: true });
      })),
      item('默认收件邮箱', '导出后可一键发送到这个邮箱', el('input', {
        class: 'input', type: 'email', style: { width: '190px' },
        value: settings.export?.email || currentSession()?.email || '',
        placeholder: 'you@example.com',
        onchange: async (e) => { await apply({ export: { email: e.target.value.trim() } }, { silent: true }); },
      })),
    ]));

    /* ---------------- 账号与数据 ---------------- */
    const session = currentSession();
    body.appendChild(group('账号与数据', [
      item('当前账号', session?.email || '本地账号', el('button', {
        class: 'btn btn-ghost btn-sm', text: '切换账号',
        onclick: async () => {
          const accounts = await listAccounts();
          const v = await pickOption({
            title: '切换账号',
            options: accounts.map((a) => ({ value: a.id, label: a.email, desc: `最近登录 ${new Date(a.lastLoginAt || a.createdAt).toLocaleDateString('zh-CN')}`, icon: a.id === session?.accountId ? '✓' : '👤' })),
            value: session?.accountId,
          });
          if (!v || v === session?.accountId) return;
          ctx.onSwitchAccount?.(v);
        },
      })),
      item('昵称', session?.nickname || '', el('button', {
        class: 'btn btn-ghost btn-sm', text: '修改',
        onclick: async () => {
          const name = await promptDialog({ title: '修改昵称', value: session?.nickname || '', maxLength: 16 });
          if (!name) return;
          await updateAccount(session.accountId, { nickname: name });
          ctx.onAccountChanged?.();
          render();
        },
      })),
      item('修改登录密码', '修改后请牢记新密码', el('button', {
        class: 'btn btn-ghost btn-sm', text: '修改',
        onclick: () => changePasswordFlow(),
      })),
      item('导出全部数据备份', '生成 JSON 备份文件，可在新手机导入', el('button', {
        class: 'btn btn-ghost btn-sm', text: '导出备份',
        onclick: async () => {
          const progress = showProgress({ title: '正在打包备份…' });
          try {
            const payload = await exportBackup({ includeImages: true });
            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            hideProgress();
            downloadBlob(blob, safeFileName(`日记本备份-${new Date().toISOString().slice(0, 10)}.json`, 'backup.json'));
            toast('备份已导出', { type: 'success' });
          } catch (err) {
            hideProgress();
            toast(`导出失败：${err.message}`, { type: 'error' });
          }
        },
      })),
      item('导入数据备份', '会与现有日记合并（同日期以备份为准）', el('button', {
        class: 'btn btn-ghost btn-sm', text: '选择文件',
        onclick: async () => {
          const files = await pickFiles({ accept: 'application/json,.json' });
          if (!files[0]) return;
          const progress = showProgress({ title: '正在导入…' });
          try {
            const text = await files[0].text();
            const res = await importBackup(JSON.parse(text), { overwrite: true });
            hideProgress();
            toast(`已导入 ${res.entries} 篇日记`, { type: 'success' });
            ctx.onChanged?.(await settingsGet(), {});
          } catch (err) {
            hideProgress();
            toast(`导入失败：${err.message}`, { type: 'error' });
          }
        },
      })),
      item('清理无用图片', '删除没有被任何日记引用的图片，释放空间', el('button', {
        class: 'btn btn-ghost btn-sm', text: '清理',
        onclick: async () => {
          const progress = showProgress({ title: '正在清理…' });
          try {
            const removed = await gcImages();
            hideProgress();
            toast(removed ? `已清理 ${removed} 张无用图片` : '没有需要清理的图片', { type: 'success' });
          } catch (err) {
            hideProgress();
            toast(`清理失败：${err.message}`, { type: 'error' });
          }
        },
      })),
      item('清空当前账号的日记', '危险操作：删除该邮箱下的所有日记与图片', el('button', {
        class: 'btn btn-danger btn-sm', text: '清空',
        onclick: async () => {
          const ok = await confirmDialog('确定清空当前账号的所有日记吗？此操作不可恢复！', { title: '危险操作', danger: true, okText: '我确定清空' });
          if (!ok) return;
          const twice = await promptDialog({ title: '再次确认', label: '输入「清空」两个字确认', placeholder: '清空' });
          if (twice !== '清空') { toast('已取消'); return; }
          await vaultClearAccount();
          toast('已清空', { type: 'success' });
          ctx.onChanged?.(await settingsGet(), {});
          ctx.onDataCleared?.();
        },
      })),
      item('退出登录', '数据仍保留在本机，登录同邮箱即可找回', el('button', {
        class: 'btn btn-ghost btn-sm', text: '退出',
        onclick: async () => {
          const ok = await confirmDialog('退出后需要重新输入邮箱密码登录。', { title: '退出登录', okText: '退出' });
          if (!ok) return;
          logout();
          location.reload();
        },
      })),
    ]));

    /* ---------------- 关于 ---------------- */
    const installHint = isIOS()
      ? 'iOS：在 Safari 中点「分享 → 添加到主屏幕」即可像 App 一样使用。'
      : 'Android：在 Chrome 菜单里选「安装应用 / 添加到主屏幕」。';
    body.appendChild(group('关于', [
      el('div', { class: 'set-item' }, [
        el('div', { class: 'info' }, [
          el('b', { text: '日记本 · 第一代' }),
          el('small', { text: '离线优先 · 数据只在本机 · 支持 Word/PDF 导出' }),
        ]),
        el('span', { class: 'chip', text: isStandalone() ? '已安装' : '浏览器中' }),
      ]),
      item('功能自检', '逐项验证这台设备上的功能是否正常', el('button', {
        class: 'btn btn-ghost btn-sm', text: '开始自检',
        onclick: async () => {
          const { openDiagnostics } = await __m("js/ui/diagnostics.js");
          openDiagnostics({ settings });
        },
      })),
      el('p', { class: 'field-hint', text: installHint }),
      el('p', { class: 'field-hint', text: '打包成 Android / iOS 安装包：见项目 docs/打包安装说明.md（Capacitor 一键构建）。' }),
    ]));
  };

  /* ============================ 行为 ============================ */

  const pickBackgroundImage = async ({ sketch = false } = {}) => {
    const files = await pickFiles({ accept: 'image/*' });
    if (!files[0]) return;
    const file = files[0];
    const process = async (blob, meta = {}) => {
      const progress = showProgress({ title: '正在保存背景…' });
      try {
        const rec = await putImage(blob, { kind: 'background', name: safeFileName(file.name) });
        const url = URL.createObjectURL(rec.blob);
        await apply({ bg: { imageId: rec.id, imageUrl: url, enabled: true, type: sketch ? 'sketch' : 'photo' } }, { silent: true });
        try {
          const color = await dominantColor(rec.blob);
          await apply({ cover: { color } }, { silent: true });
        } catch { /* ignore */ }
        hideProgress();
        toast('背景已更新', { type: 'success' });
        render();
      } catch (err) {
        hideProgress();
        toast(`设置失败：${err.message}`, { type: 'error' });
      }
    };
    if (sketch) {
      openSketchStudio({
        blob: file, settings, mode: 'background',
        onDone: (blob, meta) => process(blob, meta),
        onCancel: () => {},
      });
    } else {
      await process(file);
    }
  };

  const changePasswordFlow = async () => {
    const oldPwd = await promptDialog({ title: '修改密码', label: '当前密码', type: 'password' });
    if (oldPwd == null) return;
    const newPwd = await promptDialog({ title: '修改密码', label: '新密码（至少 6 位）', type: 'password' });
    if (!newPwd) return;
    try {
      await changePassword(currentSession().accountId, oldPwd, newPwd);
      toast('密码已修改', { type: 'success' });
    } catch (err) {
      toast(err.message, { type: 'error' });
    }
  };

  render();

  const sheet = openSheet({
    title: '个性化设置',
    subtitle: '主题 · 背景 · 字体 · AI · 隐私 · 数据',
    size: 'tall',
    body,
  });

  return { sheet, render, getSettings: () => settings };
}



return { "THEMES": THEMES_ui_settings, "PAPER_STYLES": PAPER_STYLES_ui_settings, "INK_COLORS": INK_COLORS_ui_settings, "openSettings": openSettings_ui_settings };
} };
/* ================= js/app.js ================= */
__defs["js/app.js"] = { exports: ["state","boot","openEntryEditor","saveEntryContent","toggleLockFlow","refreshEntries","renderCurrent","persistImage","normalizeEmail","downloadBlob","safeFileName","revokeImageURLs","hydrateBodyImages","putFont","presetFontStack","getPreset","HANDWRITING_PRESETS","nearestCity","lastLocation","greetByHour","isStandalone","dominantColor","debounce","fromKey","toKey","todayKey","deleteEntry","showProgress","hideProgress","el","clear"], fn: function (module) {
var { "$": $, "$$": $$, "el": el, "clear": clear, "toast": toast, "confirmDialog": confirmDialog, "toKey": toKey, "fromKey": fromKey, "todayKey": todayKey, "formatCN": formatCN, "lunarCN": lunarCN, "festivalCN": festivalCN, "solarTermCN": solarTermCN, "timeCN": timeCN, "htmlToText": htmlToText, "countWords": countWords, "debounce": debounce, "downloadBlob": downloadBlob, "safeFileName": safeFileName, "pickFiles": pickFiles, "sleep": sleep, "isStandalone": isStandalone, "local": local } = __m("js/core/utils.js");
var { "settingsGet": settingsGet, "settingsSet": settingsSet, "getEntry": getEntry, "saveEntry": saveEntry, "listEntries": listEntries, "deleteEntry": deleteEntry, "putImage": putImage, "deleteImage": deleteImage, "currentSession": currentSession, "registerAccount": registerAccount, "loginAccount": loginAccount, "logout": logout, "listAccounts": listAccounts, "normalizeEmail": normalizeEmail, "isValidEmail": isValidEmail, "lockVaultAll": lockVaultAll, "isUnlocked": isUnlocked, "getUnlockedPassword": getUnlockedPassword, "rememberUnlock": rememberUnlock, "forgetUnlock": forgetUnlock, "putFont": putFont, "listFonts": listFonts, "storageInfo": storageInfo, "isFallbackMode": isFallbackMode, "ensureStorageReady": ensureStorageReady, "__setInjectedBackend": __setInjectedBackend } = __m("js/core/storage.js");
var { "encryptJSON": encryptJSON, "decryptJSON": decryptJSON, "keyFingerprint": keyFingerprint, "passwordStrength": passwordStrength, "weakPasswordMessage": weakPasswordMessage } = __m("js/core/crypto.js");
var { "Flipbook": Flipbook } = __m("js/ui/flipbook.js");
var { "renderDiaryPage": renderDiaryPage, "hydrateBodyImages": hydrateBodyImages, "imageObjectURL": imageObjectURL, "revokeImageURLs": revokeImageURLs } = __m("js/ui/sheet.js");
var { "initViewport": initViewport } = __m("js/ui/viewport.js");
var { "loadPdfFont": loadPdfFont } = __m("js/features/export.js");
var { "openCalendar": openCalendar, "openSearch": openSearch, "streak": streak } = __m("js/ui/calendar.js");
var { "openEditor": openEditor } = __m("js/ui/editor.js");
var { "openSettings": openSettings } = __m("js/ui/settings.js");
var { "openProfilePage": openProfilePage } = __m("js/ui/profile.js");
var { "openExportCenter": openExportCenter } = __m("js/ui/export-ui.js");
var { "openSheet": openSheet, "openModal": openModal, "showProgress": showProgress, "hideProgress": hideProgress, "promptDialog": promptDialog, "pickOption": pickOption, "openImageViewer": openImageViewer } = __m("js/ui/modal.js");
var { "openDrawingBoard": openDrawingBoard } = __m("js/ui/drawing.js");
var { "openSketchStudio": openSketchStudio } = __m("js/ui/sketch.js");
var { "weatherSVG": weatherSVG, "fetchWeather": fetchWeather, "fetchWeatherByCity": fetchWeatherByCity, "nearestCity": nearestCity, "lastLocation": lastLocation, "greetByHour": greetByHour, "weatherSuggestion": weatherSuggestion } = __m("js/features/weather.js");
var { "registerFont": registerFont, "getPreset": getPreset, "presetFontStack": presetFontStack, "HANDWRITING_PRESETS": HANDWRITING_PRESETS, "fontStackFor": fontStackFor, "renderHandwriting": renderHandwriting } = __m("js/features/handwriting.js");
var { "tidyText": tidyText } = __m("js/features/ai.js");
var { "pageFlipSound": pageFlipSound, "successSound": successSound, "lockSound": lockSound, "unlockAudio": unlockAudio, "haptics": haptics } = __m("js/features/audio.js");
var { "makeThumbnail": makeThumbnail, "dominantColor": dominantColor, "loadImageFromBlob": loadImageFromBlob } = __m("js/core/image-engine.js");
/* ==========================================================================
 * 日记本 · 主程序
 *  启动流程 / 邮箱登录 / 翻页日记 / 编辑与保存 / 上锁 / 天气 / 主题
 * ========================================================================== */






















/* ============================== 全局状态 ============================== */
// 用 const 声明的对象：内部字段可变，导出绑定保持稳定（打包成单文件时也安全）
const state_app = {
  ready: false,
  settings: null,
  entries: [],
  dates: [],
  index: 0,
  fontStack: 'var(--font-hand)',
  userFonts: [],
  weather: null,
  weatherError: '',
  locked: false,
  lastActive: Date.now(),
};

let flip_app = null;
let clockTimer_app = null;

/* ============================== 启动 ============================== */
let booted_app = false;

async function boot_app() {
  // 防止重复初始化（模块脚本可能在 DOMContentLoaded 前后各触发一次，
  // 重复初始化会导致监听器重复绑定、面板叠层等难查的问题）
  if (booted_app) return;
  booted_app = true;

  const tips = ['正在准备纸张与墨水…', '正在翻开第一页…', '正在热一壶茶…'];
  let ti = 0;
  const tipTimer = setInterval(() => {
    ti = (ti + 1) % tips.length;
    const node = $('#splashTip');
    if (node) node.textContent = tips[ti];
  }, 1100);

  try {
    // 先接管视口：键盘弹出时界面要固定，不能跟着跳
    initViewport();
    bindGlobalUI_app();
    await checkStorageHealth_app();

    const session = currentSession();
    if (!session?.accountId) {
      showAuthScreen_app();
    } else {
      await enterApp_app();
    }
  } catch (err) {
    console.error(err);
    toast(`启动失败：${err.message}`, { type: 'error', duration: 6000 });
    $('#splash')?.classList.add('gone');
    showAuthScreen_app();
  } finally {
    clearInterval(tipTimer);
    document.body.classList.remove('booting');
  }
}

/* ============================== 存储健康检查 ============================== */

const BANNER_KEY_app = 'riji.banner.dismissed.v1';

/**
 * 启动时确认存储可用：
 *  · 优先使用 IndexedDB（容量大，图片随便放）
 *  · 若不可用（例如用 file:// 直接双击打开、隐私模式），自动降级到 localStorage
 *  · 无论哪种情况都不阻断使用，只在界面上说明清楚
 */
async function checkStorageHealth_app() {
  let info;
  try {
    info = await ensureStorageReady();
  } catch (err) {
    showStorageBanner_app({
      level: 'error',
      title: '存储初始化失败',
      text: `日记无法保存：${err.message}。请改用本地服务器打开（双击「启动预览.bat」），或清除本站数据后重试。`,
      dismissible: false,
    });
    return;
  }

  const isFile = location.protocol === 'file:';
  if (info.backend === 'fallback') {
    showStorageBanner_app({
      level: isFile ? 'warn' : 'error',
      title: isFile ? '当前是「直接双击打开」模式' : '已启用兼容存储模式',
      text: isFile
        ? '这种模式下日记保存在浏览器的 localStorage 里（容量约 5MB，图片多了可能存不下），而且清除浏览器数据会丢失。'
          + '建议：双击主目录的「启动预览.bat」用本地服务器打开，或在手机上「添加到主屏幕」使用。'
        : `IndexedDB 不可用（${info.reason || '未知原因'}），已自动切换到兼容存储。功能都能用，但容量受限。`,
      dismissible: true,
    });
    console.warn('[日记本] 降级存储模式：', info);
  } else if (isFile) {
    showStorageBanner_app({
      level: 'warn',
      title: '建议用本地服务器打开',
      text: '直接双击 index.html 时，浏览器会限制部分能力（离线缓存不可用；联网相关功能可能受限）。'
        + '双击主目录的「启动预览.bat」体验最完整，手机上「添加到主屏幕」则完全不受影响。',
      dismissible: true,
    });
  }
}

function showStorageBanner_app({ level = 'warn', title = '', text = '', dismissible = true }) {
  const host = $('#storageBanner');
  if (!host) return;
  if (dismissible && local.get(BANNER_KEY_app, false)) return;

  clear(host);
  host.className = `storage-banner ${level}`;
  host.appendChild(el('div', { class: 'banner-icon', text: level === 'error' ? '⚠️' : 'ℹ️' }));
  const infoBox = el('div', { class: 'banner-body' }, [
    el('b', { text: title }),
    el('div', { class: 'banner-text', text }),
  ]);
  host.appendChild(infoBox);
  if (dismissible) {
    host.appendChild(el('button', {
      class: 'banner-close', text: '✕', title: '知道了',
      onclick: () => { local.set(BANNER_KEY_app, true); host.classList.add('hidden'); },
    }));
  }
  host.classList.remove('hidden');
}

/* ============================== 登录界面 ============================== */
let authMode_app = 'login';

function showAuthScreen_app() {
  $('#splash')?.classList.add('gone');
  $('#app')?.classList.add('hidden');
  $('#authScreen')?.classList.remove('hidden');
  bindAuthUI_app();
}

function bindAuthUI_app() {
  const form = $('#authForm');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';

  for (const tab of $$('.auth-tab')) {
    tab.addEventListener('click', () => {
      authMode_app = tab.dataset.mode;
      $$('.auth-tab').forEach((t) => t.classList.toggle('active', t === tab));
      $('#registerOnly').hidden = authMode_app !== 'register';
      $('#authSub').textContent = authMode_app === 'register'
        ? '注册一个邮箱账号，日记只与这个邮箱绑定'
        : '用邮箱登录，每个邮箱一套独立的日记';
      $('#authSubmit').textContent = authMode_app === 'register' ? '创建我的日记本' : '进入我的日记本';
      $('#authError').hidden = true;
    });
  }

  $('#togglePwd')?.addEventListener('click', () => {
    const input = $('#authPassword');
    input.type = input.type === 'password' ? 'text' : 'password';
  });

  $('#authPassword2')?.addEventListener('input', () => {
    const pwd = $('#authPassword').value;
    const s = passwordStrength(pwd);
    const bar = $('#pwdMeterBar');
    const colors = ['#c04434', '#c9852b', '#c9a227', '#7fae4a', '#3f8f5f'];
    bar.style.width = `${(s / 4) * 100}%`;
    bar.style.background = colors[s];
    $('#pwdHint').textContent = `密码强度：${['很弱', '较弱', '一般', '不错', '很强'][s]}`;
  });

  $('#btnAccounts')?.addEventListener('click', async () => {
    const accounts = await listAccounts().catch(() => []);
    if (!accounts.length) { toast('还没有保存过的账号'); return; }
    const content = el('div', { class: 'account-list' });
    const modal = openModal({
      title: '选择账号',
      content,
      actions: [el('button', { class: 'btn btn-ghost', text: '关闭', onclick: () => modal.close() })],
    });
    for (const a of accounts) {
      content.appendChild(el('button', {
        class: 'account-item',
        onclick: () => {
          modal.close();
          $('#authEmail').value = a.email;
          $('#authPassword').focus();
          $('#authError').hidden = true;
        },
      }, [
        el('div', { class: 'avatar', text: (a.nickname || a.email)[0].toUpperCase() }),
        el('div', { class: 'meta' }, [
          el('b', { text: a.nickname || a.email.split('@')[0] }),
          el('small', { text: a.email }),
        ]),
        el('span', { class: 'chip chip-ghost', text: `${((Date.now() - (a.lastLoginAt || a.createdAt)) / 86400000).toFixed(0)} 天前` }),
      ]));
    }
  });

  $('#btnLocalOnly')?.addEventListener('click', async () => {
    const ok = await confirmDialog('离线试用会创建一个本地账号（名为「本机用户」）。你随时可以用邮箱注册正式账号，数据互不影响。', {
      title: '离线试用', okText: '开始试用',
    });
    if (!ok) return;
    try {
      const email = `local_${Date.now().toString(36)}@local.app`;
      await registerAccount({ email, password: 'local-guest', nickname: '本机用户' });
      await enterApp_app();
    } catch (err) {
      toast(err.message, { type: 'error' });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorNode = $('#authError');
    errorNode.hidden = true;
    const email = $('#authEmail').value.trim();
    const password = $('#authPassword').value;
    const next = $('#authPassword2')?.value || '';

    if (!isValidEmail(email)) { showAuthError_app('请输入正确的邮箱地址'); return; }
    if (weakPasswordMessage(password)) { showAuthError_app(weakPasswordMessage(password)); return; }
    if (authMode_app === 'register' && password !== next) { showAuthError_app('两次输入的密码不一致'); return; }

    const btn = $('#authSubmit');
    btn.disabled = true;
    btn.textContent = authMode_app === 'register' ? '正在创建…' : '正在登录…';
    try {
      if (authMode_app === 'register') {
        await registerAccount({ email, password, nickname: $('#authNickname')?.value.trim() || '' });
      } else {
        await loginAccount({ email, password });
      }
      await enterApp_app();
    } catch (err) {
      showAuthError_app(err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = authMode_app === 'register' ? '创建我的日记本' : '进入我的日记本';
    }
  });
}

function showAuthError_app(msg) {
  const node = $('#authError');
  node.textContent = msg;
  node.hidden = false;
  haptics.error();
}

/* ============================== 进入主界面 ============================== */
async function enterApp_app() {
  $('#authScreen')?.classList.add('hidden');
  $('#splash')?.classList.remove('gone');
  $('#splashTip').textContent = '正在打开你的日记本…';

  state_app.settings = await settingsGet();
  state_app.userFonts = await listFonts();
  await loadUserFonts_app();
  applySettings_app();
  await refreshEntries_app({ keepPosition: false });

  setupFlipbook_app();
  renderCurrent_app({ animate: false });
  startClock_app();
  refreshWeather_app();

  $('#app')?.classList.remove('hidden');
  await sleep(420);
  $('#splash')?.classList.add('gone');
  state_app.ready = true;

  makeSureToday_app();
}

async function loadUserFonts_app() {
  for (const f of state_app.userFonts) {
    if (!f.dataUrl) continue;
    try { await registerFont({ family: f.family, dataUrl: f.dataUrl }); } catch { /* ignore */ }
  }
}

function applySettings_app() {
  const s = state_app.settings || {};
  document.body.dataset.theme = s.theme || 'linen';
  state_app.fontStack = fontStackFor(s, state_app.userFonts);

  // 纸张与笔墨
  const root = document.documentElement;
  if (s.paper?.color) root.style.setProperty('--paper', s.paper.color);
  if (s.ink?.color) root.style.setProperty('--ink', s.ink.color);
  if (s.paper?.lineGap) root.style.setProperty('--paper-line-gap', `${s.paper.lineGap}px`);
  if (s.cover?.color) root.style.setProperty('--brand', s.cover.color);

  // 背景
  const bgLayer = $('#bgLayer');
  const bg = s.bg || {};
  document.body.classList.toggle('has-bg', !!(bg.imageId && bg.enabled !== false));
  if (bg.imageId && bg.enabled !== false) {
    // 每次启动都用当前会话的 blob URL 重新解析（刷新后 blob URL 会失效）
    imageObjectURL(bg.imageId).then((url) => {
      if (!url) return;
      if (bgLayer) {
        bgLayer.style.backgroundImage = `url("${url}")`;
        bgLayer.style.backgroundSize = 'cover';
        bgLayer.style.backgroundPosition = 'center';
        bgLayer.style.filter = bg.blur ? `blur(${bg.blur}px)` : '';
        bgLayer.style.transform = bg.blur ? 'scale(1.06)' : '';
        bgLayer.style.opacity = String(bg.opacity ?? 0.5);
        bgLayer.style.setProperty('--bg-dim', String(1 - (bg.opacity ?? 0.5)));
      }
    }).catch(() => {});
  } else if (bgLayer) {
    bgLayer.style.backgroundImage = '';
    bgLayer.style.filter = '';
    bgLayer.style.opacity = '0';
  }

  // 文字与界面
  if (s.cover?.title) document.title = `${s.cover.title} · 日记本`;
}

/* ============================== 日记数据 ============================== */
async function refreshEntries_app({ keepPosition = true } = {}) {
  const entries = await listEntries();
  entries.sort((a, b) => (a.date < b.date ? 1 : -1));
  state_app.entries = entries;
  state_app.dates = entries.map((e) => e.date);
  const today = todayKey();
  if (!state_app.dates.includes(today)) {
    // 今天还没有日记时，也允许翻到「今天」这张空白页
    state_app.dates.unshift(today);
    state_app.entries.unshift(null);
  }
  if (!keepPosition) state_app.index = 0;
  else state_app.index = Math.max(0, Math.min(state_app.index, state_app.dates.length - 1));
  updateIndicator_app();
}

function currentDateKey_app() { return state_app.dates[state_app.index] || todayKey(); }
function currentEntry_app() { return state_app.entries[state_app.index] || null; }

function makeSureToday_app() {
  const today = todayKey();
  const idx = state_app.dates.indexOf(today);
  if (idx > 0) {
    state_app.index = idx;
    flip_app?.show(today, { animate: false });
    renderCurrent_app({ animate: false });
  }
}

/* ============================== 翻页引擎 ============================== */
function setupFlipbook_app() {
  if (flip_app) return;
  flip_app = new Flipbook({
    bookEl: $('#book'),
    currentEl: $('#pageCurrent'),
    underEl: $('#pageUnder'),
    flipLayerEl: $('#flipLayer'),
    duration: 660,
    ignoreKeys: () => !!document.querySelector('.sheet-overlay, .modal-overlay, .progress-overlay'),
    onBeforeFlip: async (from, to, dir) => {
      const s = state_app.settings || {};
      if (s.sound?.pageTurn !== false) pageFlipSound(s.sound?.volume ?? 0.35);
      if (s.ui?.haptics !== false) haptics.light();
      const idx = state_app.dates.indexOf(to);
      if (idx >= 0) state_app.index = idx;
      updateIndicator_app();
      return true;
    },
    onAfterFlip: () => {
      updateNavButtons_app();
      renderWeatherBar_app();
    },
    renderPage: async (key, host) => {
      const entries = await listEntries();
      const entry = entries.find((e) => e.date === key) || null;
      state_app.entries = entries.sort((a, b) => (a.date < b.date ? 1 : -1));
      await renderDiaryPage(host, {
        entry: entry ? await resolveLockedBody_app(entry) : null,
        dateKey: key,
        settings: state_app.settings,
        fontStack: state_app.fontStack,
        callbacks: pageCallbacks_app(),
      });
    },
  });
  flip_app.onSwipe = (dir) => navigate_app(dir === 'next' ? 1 : -1);

  $('#btnPrev')?.addEventListener('click', () => navigate_app(-1));
  $('#btnNext')?.addEventListener('click', () => navigate_app(1));
}

function pageCallbacks_app() {
  return {
    onEdit: (dateKey) => openEntryEditor_app(dateKey),
    onToggleLock: (dateKey) => toggleLockFlow_app(dateKey),
    onMore: (dateKey) => openEntryMenu_app(dateKey),
    onViewImage: (url, caption) => openImageViewer(url, { caption }),
    onUnlocked: async (dateKey, data) => {
      successSound(0.2);
      haptics.success();
      toast('已解锁', { type: 'success', duration: 1400 });
      await refreshEntries_app();
      renderCurrent_app({ animate: true });
      void data;
    },
  };
}

/**
 * 上锁的日记：如果本会话已解锁，就把明文替换回来
 * 注意：返回对象的 locked 必须是 false，否则渲染层会直接渲染锁屏页
 * （内存里的这份「已解锁视图」不影响磁盘上的密文，保存时仍会重新加密）
 */
async function resolveLockedBody_app(entry) {
  if (!entry?.locked) return entry;
  const pwd = getUnlockedPassword(entry.date);
  if (!pwd || !entry.lockPayload) return entry;
  try {
    const data = await decryptJSON(entry.lockPayload, pwd);
    return { ...entry, ...data, locked: false, wasLocked: true, unlockedNow: true };
  } catch {
    forgetUnlock(entry.date);
    return entry;
  }
}

async function navigate_app(delta) {
  const next = state_app.index + delta;
  if (next < 0 || next >= state_app.dates.length) {
    haptics.error();
    toast(delta > 0 ? '已经是最新的一篇啦' : '已经翻到最早的一篇', { duration: 1600 });
    return;
  }
  state_app.index = next;
  const key = state_app.dates[next];
  await flip_app.show(key, { animate: true, direction: delta > 0 ? 'forward' : 'backward' });
  updateNavButtons_app();
  renderWeatherBar_app();
}

/** 重新渲染当前页（force：即使日期没变也重绘，用于保存后刷新） */
function renderCurrent_app({ animate = false, force = true } = {}) {
  const key = currentDateKey_app();
  flip_app.show(key, { animate, direction: 'forward', force });
  updateNavButtons_app();
}

function updateNavButtons_app() {
  $('#btnPrev')?.classList.toggle('disabled', state_app.index >= state_app.dates.length - 1);
  $('#btnNext')?.classList.toggle('disabled', state_app.index <= 0);
  const key = currentDateKey_app();
  const entry = currentEntry_app();
  const main = $('#dateMain');
  const sub = $('#dateSub');
  if (main) main.textContent = formatCN(key);
  if (sub) {
    const bits = [];
    if (entry) {
      // 已写下的日子：优先显示标题，让顶栏一眼看出这天写了什么
      if (entry.title?.trim()) bits.push(entry.title.trim().slice(0, 12));
      if (entry.weather?.text) bits.push(`${entry.weather.text} ${entry.weather.temp != null ? `${entry.weather.temp}°` : ''}`.trim());
      if (entry.wordCount) bits.push(`${entry.wordCount} 字`);
      if (entry.revisions?.length) bits.push(`批改 ${entry.revisions.length} 次`);
    } else {
      const lunar = lunarCN(key);
      const fest = festivalCN(key) || solarTermCN(key);
      if (lunar) bits.push(lunar);
      if (fest) bits.push(fest);
    }
    sub.textContent = bits.join(' · ') || (entry ? '已写下这一天' : '还没有写下这一天');
  }
  $('#btnEdit')?.classList.toggle('active', !!entry);
}

function updateIndicator_app() {
  const host = $('#pageIndicator');
  if (!host) return;
  clear(host);
  const total = state_app.dates.length;
  const max = 7;
  const start = Math.max(0, Math.min(state_app.index - 3, total - max));
  for (let i = start; i < Math.min(total, start + max); i++) {
    host.appendChild(el('span', { class: i === state_app.index ? 'on' : '' }));
  }
}

/* ============================== 天气与时钟 ============================== */
function startClock_app() {
  const tick = () => {
    const now = new Date();
    const t = $('#clockTime');
    const d = $('#clockDate');
    if (t) t.textContent = timeCN(now);
    if (d) d.textContent = `${WEEK_SHORT_app[now.getDay()]} ${lunarCN(now) || ''}`.trim();
  };
  tick();
  clearInterval(clockTimer_app);
  clockTimer_app = setInterval(tick, 15000);
}
const WEEK_SHORT_app = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

async function refreshWeather_app({ force = false } = {}) {
  const s = state_app.settings || {};
  if (s.weather?.enabled === false) { renderWeatherBar_app(); return; }
  try {
    let data;
    if (s.weather?.auto === false && s.weather?.lat != null) {
      data = await fetchWeather({ lat: s.weather.lat, lon: s.weather.lon, city: s.weather.city, force });
    } else if (s.weather?.lat != null && s.weather?.city) {
      data = await fetchWeather({ lat: s.weather.lat, lon: s.weather.lon, city: s.weather.city, force });
    } else {
      const p = await fetchWeather({ force });
      data = p;
    }
    state_app.weather = data;
    state_app.weatherError = '';
  } catch (err) {
    state_app.weatherError = err.message;
  }
  renderWeatherBar_app();
}

function renderWeatherBar_app() {
  const iconHost = $('#weatherIcon');
  const s = state_app.settings || {};
  const data = state_app.weather;
  if (iconHost) {
    clear(iconHost);
    if (s.ui?.showWeatherIcon !== false && data) {
      iconHost.innerHTML = weatherSVG(data.kind, { size: 50, animate: true });
    } else {
      iconHost.innerHTML = weatherSVG('cloudy', { size: 44, animate: false });
    }
  }
  const temp = $('#weatherTemp');
  const desc = $('#weatherDesc');
  const meta = $('#weatherMeta');
  if (!data) {
    if (temp) temp.textContent = '--°';
    if (desc) desc.textContent = state_app.weatherError ? '天气不可用' : '天气加载中…';
    if (meta) meta.textContent = state_app.weatherError ? '可在设置里手动选择城市' : '';
    return;
  }
  if (temp) temp.textContent = `${data.temp}°`;
  if (desc) desc.textContent = `${data.text}${data.isDay === false ? '（夜）' : ''}`;
  if (meta) {
    const bits = [
      data.city,
      `${data.tempMin}° ~ ${data.tempMax}°`,
      data.humidity != null ? `湿度 ${data.humidity}%` : '',
      weatherSuggestion(data),
    ].filter(Boolean);
    meta.textContent = bits.join(' · ');
  }
}

/* ============================== 编辑器与会话保存 ============================== */

/** 当前会话中新建图片的统一入口：写库 + 生成缩略图 + 返回可用 URL */
async function persistImage_app(blob, { kind = 'photo', name = '', meta = {} } = {}) {
  const thumbBlob = await makeThumbnail(blob, 520, 0.78).catch(() => null);
  let dims = {};
  try {
    const img = await loadImageFromBlob(blob);
    dims = { width: img.width || meta.width || 0, height: img.height || meta.height || 0 };
  } catch { dims = { width: meta.width || 0, height: meta.height || 0 }; }

  const rec = await putImage(blob, { kind, name, ...dims });
  let thumbRec = null;
  if (thumbBlob) thumbRec = await putImage(thumbBlob, { kind: `${kind}-thumb`, name: `${name}-thumb` });

  const url = await imageObjectURL(rec.id);
  const thumbUrl = thumbRec ? await imageObjectURL(thumbRec.id) : url;
  return { id: rec.id, thumbId: thumbRec?.id || null, url, thumbUrl };
}

async function openEntryEditor_app(dateKey = currentDateKey_app()) {
  const key = typeof dateKey === 'string' ? dateKey : currentDateKey_app();
  let entry = await getEntry(key);
  if (entry?.locked && !isUnlocked(key)) {
    toast('这篇日记已上锁，请先解锁再编辑', { type: 'warn' });
    return;
  }
  if (entry?.locked) entry = await resolveLockedBody_app(entry);

  const editor = await openEditor({
    dateKey: key,
    entry: entry || { date: key, images: [], drawings: [] },
    settings: state_app.settings,
    fontStack: state_app.fontStack,
    getFontStack: async (styleId) => {
      const stack = fontStackFor({ ...state_app.settings, handwriting: { ...state_app.settings.handwriting, styleId } }, state_app.userFonts);
      return stack;
    },
    onPersistImage: (blob, meta) => persistImage_app(blob, meta),
    onDeleteImage: async (id) => { await deleteImage(id); },
    onSetBackground: async (blob) => {
      const rec = await putImage(blob, { kind: 'background', name: `背景-${key}` });
      const url = URL.createObjectURL(rec.blob);
      await saveSettings_app({ bg: { imageId: rec.id, imageUrl: url, enabled: true, type: 'sketch' } });
      toast('已设为 App 背景', { type: 'success' });
    },
    onLockToggle: async () => {
      // 先保存，再走加锁流程
      const content = editor.getContent();
      await saveEntryContent_app(key, content);
      toggleLockFlow_app(key);
    },
    onOpenRevisions: () => openRevisions_app(key),
    onSave: async (content) => {
      const res = await saveEntryContent_app(key, content);
      await refreshEntries_app();
      renderCurrent_app({ animate: true });
      if (state_app.settings.sound?.pageTurn !== false) successSound(0.18);
      haptics.success();
      return res;
    },
  });
  return editor;
}

/** 保存正文（含批改历史与上锁状态处理） */
async function saveEntryContent_app(key, content) {
  const prev = (await getEntry(key)) || {};
  const wasLocked = !!prev.locked;
  const pwd = getUnlockedPassword(key);
  // 已解锁的加密日记：磁盘上的 body 是空的，用于对比的基线应是解密后的内容
  const isUnlockedLocked = wasLocked && !!pwd;
  const decrypted = isUnlockedLocked ? await resolveLockedBody_app(prev) : null;
  const baseBody = isUnlockedLocked ? (decrypted?.body || '') : (prev.body || '');
  const baseTitle = isUnlockedLocked ? (decrypted?.title || '') : (prev.title || '');

  const merged = {
    ...prev,
    date: key,
    title: content.title ?? baseTitle,
    mood: content.mood ?? prev.mood ?? '',
    drawings: content.drawings ?? prev.drawings ?? [],
    images: content.images ?? prev.images ?? [],
    wordCount: content.wordCount ?? countWords(htmlToText(content.body || '')),
    weather: prev.weather || (key === todayKey() && state_app.weather ? {
      text: state_app.weather.text, kind: state_app.weather.kind, temp: state_app.weather.temp,
      city: state_app.weather.city, code: state_app.weather.code,
    } : null),
    createdAt: prev.createdAt || Date.now(),
  };

  const newBody = content.body ?? baseBody;
  const changed = baseBody !== newBody || baseTitle !== (content.title ?? baseTitle);
  if (changed && (baseBody || baseTitle)) {
    merged.revisions = [
      ...(prev.revisions || []),
      { at: Date.now(), body: baseBody, title: baseTitle, note: '编辑前的版本' },
    ].slice(-30);
  }

  if (wasLocked && pwd) {
    // 保持上锁：重新加密
    const payload = {
      body: newBody, title: merged.title, mood: merged.mood,
      drawings: merged.drawings, images: merged.images, wordCount: merged.wordCount,
    };    const lockSalt = prev.lockSalt;
    const enc = await encryptJSON(payload, pwd);
    const next = {
      ...merged,
      body: '',
      locked: true,
      lockPayload: enc,
      lockSalt,
      lockFingerprint: await keyFingerprint(pwd, lockSalt),
      lockHint: prev.lockHint || '',
      lockType: prev.lockType || 'text',
      updatedAt: Date.now(),
    };
    await saveEntry(next);
    return next;
  }

  const next = { ...merged, body: newBody, locked: false, lockPayload: null, updatedAt: Date.now() };
  await saveEntry(next);
  return next;
}

async function saveSettings_app(patch) {
  state_app.settings = await settingsSet(patch);
  applySettings_app();
  return state_app.settings;
}

/* ============================== 上锁 / 解锁 ============================== */
async function toggleLockFlow_app(dateKey) {
  const entry = await getEntry(dateKey);
  if (!entry) { toast('这篇还没有内容，先写点什么吧'); return; }
  if (entry.locked) {
    // 解锁（并询问是否解除上锁）
    if (!isUnlocked(dateKey)) {
      toast('请先在页面上输入密码解锁');
      return;
    }
    const remove = await confirmDialog('这篇日记已经解锁。要「解除上锁」，让它以后不再需要密码吗？', {
      title: '解除上锁', okText: '解除上锁', cancelText: '保持上锁',
    });
    if (!remove) return;
    const pwd = getUnlockedPassword(dateKey);
    const data = await decryptJSON(entry.lockPayload, pwd).catch(() => null);
    if (!data) { toast('解密失败', { type: 'error' }); return; }
    await saveEntry({
      ...entry,
      ...data,
      locked: false,
      lockPayload: null,
      lockSalt: null,
      lockFingerprint: null,
      updatedAt: Date.now(),
    });
    forgetUnlock(dateKey);
    lockSound(0.22);
    toast('已解除上锁', { type: 'success' });
  } else {
    await lockEntryFlow_app(dateKey, entry);
    return;
  }
  await refreshEntries_app();
  renderCurrent_app({ animate: true });
}

async function lockEntryFlow_app(dateKey, entry) {
  const choice = await pickOption({
    title: '选择上锁方式',
    options: [
      { value: 'pin', label: '数字密码（4-6 位）', desc: '解锁时用键盘输入，最快', icon: '🔢' },
      { value: 'text', label: '文字密码', desc: '可以用一句只有你知道的话', icon: '🔤' },
    ],
  });
  if (!choice) return;

  const pwd = await promptDialog({
    title: '设置上锁密码',
    label: choice === 'pin' ? '数字密码（4-6 位）' : '密码（至少 4 位）',
    type: choice === 'pin' ? 'password' : 'password',
    hint: '⚠️ 密码不会被保存，忘记后无法找回这篇日记，请务必牢记。',
    placeholder: choice === 'pin' ? '如 2468' : '输入密码',
  });
  if (!pwd) return;
  if (choice === 'pin' && !/^\d{4,6}$/.test(pwd)) { toast('数字密码需要 4-6 位数字'); return; }
  if (pwd.length < 4) { toast('密码至少 4 位'); return; }

  const again = await promptDialog({ title: '再输一次', label: '确认密码', type: 'password' });
  if (again !== pwd) { toast('两次输入不一致', { type: 'error' }); return; }

  const progress = showProgress({ title: '正在加密这篇日记…' });
  try {
    const payload = {
      body: entry.body || '', title: entry.title || '', mood: entry.mood || '',
      drawings: entry.drawings || [], images: entry.images || [], wordCount: entry.wordCount || 0,
    };
    const enc = await encryptJSON(payload, pwd);
    const lockSalt = enc.salt;
    const next = {
      ...entry,
      body: '',
      title: entry.title || '',
      locked: true,
      lockPayload: enc,
      lockSalt,
      lockFingerprint: await keyFingerprint(pwd, lockSalt),
      lockHint: choice === 'pin' ? '0'.repeat(pwd.length) : '',
      lockType: choice,
      updatedAt: Date.now(),
    };
    await saveEntry(next);
    rememberUnlock(dateKey, pwd);
    hideProgress();
    lockSound(0.3);
    haptics.medium();
    toast('已上锁，只有输入密码才能查看', { type: 'success' });
    state_app.settings = await settingsSet({ lock: { enabled: true } });
    await refreshEntries_app();
    renderCurrent_app({ animate: true });
  } catch (err) {
    hideProgress();
    toast(`上锁失败：${err.message}`, { type: 'error' });
  }
}

/* ============================== 批改历史 ============================== */
async function openRevisions_app(dateKey) {
  const entry = await getEntry(dateKey);
  if (!entry) return;
  const revisions = [...(entry.revisions || [])].reverse();
  const body = el('div', {});
  if (!revisions.length) {
    body.appendChild(el('div', { class: 'empty-state' }, [
      el('div', { class: 'icon', text: '📝' }),
      el('h4', { text: '还没有批改记录' }),
      el('p', { text: '每次修改并保存后，旧版本会自动留档在这里。' }),
    ]));
  } else {
    body.appendChild(el('p', { class: 'field-hint', text: `共 ${revisions.length} 个历史版本（最多保留 30 个）。点「还原」可把这篇日记退回到那个版本。` }));
    for (const rev of revisions) {
      const item = el('div', { class: 'revision-item' }, [
        el('div', { class: 'head' }, [
          el('b', { text: rev.title || '（无标题）' }),
          el('span', { text: new Date(rev.at).toLocaleString('zh-CN') }),
        ]),
        el('div', { class: 'diff', text: htmlToText(rev.body || '').slice(0, 220) || '（空白版本）' }),
        el('div', { style: { marginTop: '8px', display: 'flex', gap: '8px' } }, [
          el('button', {
            class: 'btn btn-ghost btn-sm', text: '查看全文',
            onclick: () => openModal({
              title: rev.title || `${dateKey} 的历史版本`,
              content: el('div', { style: { maxHeight: '60vh', overflowY: 'auto', fontSize: '14px', lineHeight: '1.8' }, html: `<div>${rev.body || '（空白）'}</div>` }),
              maxWidth: 560,
            }),
          }),
          el('button', {
            class: 'btn btn-secondary btn-sm', text: '还原到这个版本',
            onclick: async () => {
              const ok = await confirmDialog('还原会用这个旧版本覆盖当前内容（当前内容会再存一份历史）。', { title: '还原版本', okText: '还原' });
              if (!ok) return;
              const current = await getEntry(dateKey);
              await saveEntry({
                ...current,
                title: rev.title || '',
                body: rev.body || '',
                revisions: [...(current.revisions || []), { at: Date.now(), body: current.body || '', title: current.title || '', note: '还原前自动备份' }].slice(-30),
                updatedAt: Date.now(),
              });
              toast('已还原到该版本', { type: 'success' });
              await refreshEntries_app();
              renderCurrent_app({ animate: true });
              sheet.close();
            },
          }),
        ]),
      ]);
      body.appendChild(item);
    }
  }
  const headExtra = el('button', {
    class: 'icon-btn', text: '✎', title: '继续编辑',
    onclick: () => { sheet.close(); openEntryEditor_app(dateKey); },
  });
  const sheet = openSheet({
    title: `批改历史 · ${dateKey}`,
    subtitle: '看看这篇日记改过哪些地方',
    size: 'tall',
    body,
    headExtra,
  });
  return sheet;
}

/* ============================== 单篇更多操作 ============================== */
async function openEntryMenu_app(dateKey) {
  const entry = await getEntry(dateKey);
  const sheet = openSheet({
    title: `${dateKey} 的日记`,
    subtitle: entry?.title || '选择要做的操作',
    size: 'half',
    body: el('div', { class: 'picker-list' }, [
      menuItem_app('✎', '编辑这篇日记', '修改内容、插图、手写', () => { sheet.close(); openEntryEditor_app(dateKey); }),
      menuItem_app('🕘', '批改历史', `已有 ${entry?.revisions?.length || 0} 个历史版本`, () => { sheet.close(); openRevisions_app(dateKey); }),
      menuItem_app(entry?.locked ? '🔓' : '🔒', entry?.locked ? '上锁设置 / 解除上锁' : '给这篇日记上锁', '用密码保护这一天', () => { sheet.close(); toggleLockFlow_app(dateKey); }),
      menuItem_app('📤', '导出这一天', '生成 Word / PDF', () => { sheet.close(); openExportCenter({ selected: new Set([dateKey]), entries: state_app.entries.filter(Boolean) }); }),
      menuItem_app('🖼', '插入图片 / 素描', '从相册选图，可转素描', () => { sheet.close(); openEntryEditor_app(dateKey); }),
      menuItem_app('✍️', '手写这一页', '直接用手指写', async () => {
        sheet.close();
        openDrawingBoard({
          title: `${dateKey} 手写页`,
          onDone: async (blob, meta) => {
            const rec = await persistImage_app(blob, { kind: 'drawing', name: `手写-${dateKey}` });
            const prev = (await getEntry(dateKey)) || {};
            await saveEntry({
              ...prev,
              date: dateKey,
              drawings: [...(prev.drawings || []), { id: `draw_${Date.now()}`, imageId: rec.id, thumbId: rec.thumbId, width: meta.width, height: meta.height, createdAt: Date.now(), mode: 'freehand' }],
              updatedAt: Date.now(),
            });
            await refreshEntries_app();
            renderCurrent_app({ animate: true });
            toast('手写页已加入', { type: 'success' });
          },
        });
      }),
      menuItem_app('🎨', '设为 App 背景', '用这天的图片或素描做背景', () => { sheet.close(); pickBackgroundFromDay_app(dateKey); }),
      menuItem_app('🗑', '删除这篇日记', '不可恢复，请谨慎', async () => {
        sheet.close();
        const ok = await confirmDialog(`确定删除 ${dateKey} 的日记吗？此操作不可恢复。`, { title: '删除日记', danger: true, okText: '删除' });
        if (!ok) return;
        await deleteEntry(dateKey);
        await refreshEntries_app();
        renderCurrent_app({ animate: true });
        toast('已删除', { type: 'success' });
      }),
    ]),
  });
  return sheet;
}

function menuItem_app(icon, label, desc, onclick) {
  return el('button', { class: 'picker-item', onclick }, [
    el('span', { text: icon, style: { fontSize: '18px' } }),
    el('span', { style: { flex: '1' } }, [
      el('b', { text: label, style: { display: 'block', fontSize: '14px', fontWeight: '500' } }),
      desc ? el('small', { text: desc, style: { color: 'var(--text-3)', fontSize: '11.5px' } }) : null,
    ]),
    el('span', { text: '›', style: { color: 'var(--text-3)' } }),
  ]);
}

async function pickBackgroundFromDay_app(dateKey) {
  const entry = await getEntry(dateKey);
  const candidates = [
    ...(entry?.images || []).map((i) => ({ id: i.id, label: i.caption || '日记插图', kind: 'photo' })),
    ...(entry?.drawings || []).map((d) => ({ id: d.imageId, label: '手写稿', kind: 'drawing' })),
  ].filter((c) => c.id);
  if (!candidates.length) {
    openSketchStudio({
      blob: await pickFiles({ accept: 'image/*' }).then((f) => f[0]),
      settings: state_app.settings,
      mode: 'background',
      onDone: async (blob) => setBackgroundBlob_app(blob),
    }).catch?.(() => {});
    return;
  }
  const v = await pickOption({
    title: '选择要做背景的图片',
    options: [...candidates.map((c) => ({ value: c.id, label: c.label, icon: '🖼' })),
      { value: '__new__', label: '从相册新增一张', icon: '➕' }],
  });
  if (!v) return;
  if (v === '__new__') {
    const files = await pickFiles({ accept: 'image/*' });
    if (!files[0]) return;
    openSketchStudio({
      blob: files[0], settings: state_app.settings, mode: 'background',
      onDone: (blob, meta) => setBackgroundBlob_app(blob, meta),
    });
    return;
  }
  const url = await imageObjectURL(v);
  await saveSettings_app({ bg: { imageId: v, imageUrl: url, enabled: true, type: 'photo' } });
  toast('背景已更新', { type: 'success' });
}

async function setBackgroundBlob_app(blob, meta = {}) {
  const rec = await putImage(blob, { kind: 'background', name: '背景' });
  const url = URL.createObjectURL(rec.blob);
  await saveSettings_app({ bg: { imageId: rec.id, imageUrl: url, enabled: true, type: 'sketch' } });
  toast('背景已更新', { type: 'success' });
  void meta;
}

/* ============================== 全局 UI 绑定 ============================== */
function bindGlobalUI_app() {
  $('#btnCalendar')?.addEventListener('click', () => openCalendarWithState_app());
  $('#btnCalendar2')?.addEventListener('click', () => openCalendarWithState_app());
  $('#btnSearchTop')?.addEventListener('click', () => {
    openSearch({
      onOpen: async (dateKey) => {
        const idx = state_app.dates.indexOf(dateKey);
        if (idx < 0) { await refreshEntries_app(); }
        const i = state_app.dates.indexOf(dateKey);
        if (i >= 0) {
          state_app.index = i;
          await flip_app.show(dateKey, { animate: true, direction: 'forward' });
          updateNavButtons_app();
        }
      },
    });
  });
  $('#btnEdit')?.addEventListener('click', () => openEntryEditor_app());
  $('#btnWriteHand')?.addEventListener('click', () => openDrawingBoard({
    title: `${currentDateKey_app()} 手写页`,
    onDone: async (blob, meta) => {
      const dateKey = currentDateKey_app();
      const rec = await persistImage_app(blob, { kind: 'drawing', name: `手写-${dateKey}` });
      const prev = (await getEntry(dateKey)) || {};
      await saveEntry({
        ...prev,
        date: dateKey,
        drawings: [...(prev.drawings || []), { id: `draw_${Date.now()}`, imageId: rec.id, thumbId: rec.thumbId, width: meta.width, height: meta.height, createdAt: Date.now(), mode: 'freehand' }],
        updatedAt: Date.now(),
      });
      await refreshEntries_app();
      renderCurrent_app({ animate: true });
      toast('手写页已加入这篇日记', { type: 'success' });
    },
  }));
  $('#btnImage')?.addEventListener('click', async () => {
    const dateKey = currentDateKey_app();
    const files = await pickFiles({ accept: 'image/*', multiple: true });
    if (!files.length) return;
    for (const file of files) {
      const choice = await pickOption({
        title: `插入「${file.name.slice(0, 16)}」`,
        options: [
          { value: 'original', label: '原图插入', desc: '保持照片原样', icon: '🖼' },
          { value: 'sketch', label: 'AI 转素描', desc: '变成手绘素描再插入', icon: '✏️' },
          { value: 'background', label: '设为 App 背景', desc: '可先转成素描', icon: '🎨' },
        ],
      });
      if (!choice) continue;
      if (choice === 'original') {
        const rec = await persistImage_app(file, { kind: 'photo', name: file.name });
        await appendImageToDay_app(dateKey, rec, file.name);
      } else {
        await new Promise((resolve) => {
          let settled = false;
          const done = () => { if (!settled) { settled = true; resolve(); } };
          openSketchStudio({
            blob: file, settings: state_app.settings,
            mode: choice === 'background' ? 'background' : 'insert',
            onDone: async (blob, meta) => {
              try {
                if (choice === 'background') await setBackgroundBlob_app(blob, meta);
                else {
                  const rec = await persistImage_app(blob, { kind: 'sketch', name: `素描-${file.name}` });
                  await appendImageToDay_app(dateKey, rec, '素描');
                }
              } finally { done(); }
            },
            onCancel: done,
          });
        });
      }
    }
  });
  $('#btnAI')?.addEventListener('click', () => openAIMenu_app());
  $('#btnMore')?.addEventListener('click', () => openMoreMenu_app());
  const openMenuSettings = () => openSettings({
    getFontStack: async (styleId) => fontStackFor({ ...state_app.settings, handwriting: { ...state_app.settings.handwriting, styleId } }, state_app.userFonts),
    onChanged: async (settings, patch) => {
      state_app.settings = settings;
      if (patch && (patch.handwriting || patch.font)) {
        state_app.userFonts = await listFonts();
        await loadUserFonts_app();
      }
      applySettings_app();
      renderCurrent_app({ animate: false });
      renderWeatherBar_app();
    },
    onWeather: (data) => { state_app.weather = data; renderWeatherBar_app(); },
    onWeatherRefresh: () => refreshWeather_app({ force: true }),
    onSwitchAccount: async (accountId) => {
      const accounts = await listAccounts();
      const acc = accounts.find((a) => a.id === accountId);
      if (!acc) return;
      const pwd = await promptDialog({ title: `登录 ${acc.email}`, label: '密码', type: 'password' });
      if (!pwd) return;
      try {
        await loginAccount({ email: acc.email, password: pwd });
        toast('已切换账号', { type: 'success' });
        location.reload();
      } catch (err) {
        toast(err.message, { type: 'error' });
      }
    },
    onAccountChanged: () => { /* 昵称变更无需重载 */ },
    onDataCleared: async () => {
      await refreshEntries_app();
      renderCurrent_app({ animate: false });
    },
  });

  $('#btnMenu')?.addEventListener('click', () => openMenuSettings());
  // 「我的」：账号资料 / 统计 / 备份 / 退出
  $('#btnProfile')?.addEventListener('click', () => openProfilePage({
    onOpenSettings: () => openMenuSettings(),
  }));

  // 自动重新上锁
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      state_app.lastActive = Date.now();
      return;
    }
    const minutes = state_app.settings?.lock?.autoLockMinutes ?? 5;
    if (Date.now() - state_app.lastActive > minutes * 60000) {
      lockVaultAll();
      toast('已自动重新上锁，再次输入密码查看加密日记', { duration: 2600 });
      renderCurrent_app({ animate: false });
    }
  });

  window.addEventListener('online', () => refreshWeather_app({ force: true }));

  // 首次交互解锁音频
  const unlock = () => { unlockAudio(); document.removeEventListener('touchstart', unlock); document.removeEventListener('click', unlock); };
  document.addEventListener('touchstart', unlock, { once: true });
  document.addEventListener('click', unlock, { once: true });
}

async function appendImageToDay_app(dateKey, rec, caption = '') {
  const prev = (await getEntry(dateKey)) || {};
  await saveEntry({
    ...prev,
    date: dateKey,
    images: [...(prev.images || []), { id: rec.id, thumbId: rec.thumbId, caption, layout: 'center', sketch: caption === '素描' }],
    updatedAt: Date.now(),
  });
  await refreshEntries_app();
  renderCurrent_app({ animate: true });
  toast('图片已加入日记', { type: 'success' });
}

function openCalendarWithState_app() {
  openCalendar({
    entries: state_app.entries.filter(Boolean),
    cursor: currentDateKey_app(),
    showLunar: state_app.settings.ui?.showLunar !== false,
    onPickDate: async (dateKey) => {
      let idx = state_app.dates.indexOf(dateKey);
      if (idx < 0) { await refreshEntries_app(); idx = state_app.dates.indexOf(dateKey); }
      if (idx < 0) { toast('这一天还没有日记'); return; }
      const direction = idx > state_app.index ? 'forward' : 'backward';
      state_app.index = idx;
      await flip_app.show(dateKey, { animate: true, direction });
      updateNavButtons_app();
      renderWeatherBar_app();
    },
    onOpenEntry: async (dateKey) => {
      const idx = state_app.dates.indexOf(dateKey);
      if (idx >= 0) { state_app.index = idx; await flip_app.show(dateKey, { animate: true, direction: 'backward' }); }
      updateNavButtons_app();
    },
  });
}

function openAIMenu_app() {
  const sheet = openSheet({
    title: 'AI 工具',
    subtitle: '本地算法优先，可在设置里切换云端',
    size: 'half',
    body: el('div', { class: 'picker-list' }, [
      menuItem_app('✏️', '图片转素描', '把照片变成手绘素描再插入', async () => {
        sheet.close();
        const files = await pickFiles({ accept: 'image/*' });
        if (!files[0]) return;
        const dateKey = currentDateKey_app();
        openSketchStudio({
          blob: files[0], settings: state_app.settings, mode: 'insert',
          onDone: async (blob, meta) => {
            const rec = await persistImage_app(blob, { kind: 'sketch', name: `素描-${dateKey}` });
            await appendImageToDay_app(dateKey, rec, meta.presetName || '素描');
          },
        });
      }),
      menuItem_app('🖋', '文字转手写字体', '把这篇日记的正文渲染成手写稿', () => {
        sheet.close();
        openEntryEditor_app(currentDateKey_app()).then?.(() => {});
      }),
      menuItem_app('🎨', '图片转素描背景', '换成素描风格的 App 背景', async () => {
        sheet.close();
        const files = await pickFiles({ accept: 'image/*' });
        if (!files[0]) return;
        openSketchStudio({
          blob: files[0], settings: state_app.settings, mode: 'background',
          onDone: (blob, meta) => setBackgroundBlob_app(blob, meta),
        });
      }),
      menuItem_app('🧹', '整篇排版整理', '自动清理多余空行与重复标点', async () => {
        sheet.close();
        const dateKey = currentDateKey_app();
        const entry = await getEntry(dateKey);
        if (!entry?.body) { toast('这篇还没有内容'); return; }
        const clean = tidyText(entry.body);
        if (clean === entry.body) { toast('已经很整齐了'); return; }
        await saveEntry({ ...entry, body: clean, updatedAt: Date.now() });
        await refreshEntries_app();
        renderCurrent_app({ animate: true });
        toast('排版已整理', { type: 'success' });
      }),
    ]),
  });
  return sheet;
}

function openMoreMenu_app() {
  const dateKey = currentDateKey_app();
  const entry = currentEntry_app();
  const sheet = openSheet({
    title: '更多',
    subtitle: `${dateKey} · ${entry?.title || '空白页'}`,
    size: 'half',
    body: el('div', { class: 'picker-list' }, [
      menuItem_app('🗓', '日历回看', '按日期翻看以前的日记', () => { sheet.close(); openCalendarWithState_app(); }),
      menuItem_app('📤', '导出成册', '勾选日期导出 Word / PDF', () => { sheet.close(); openExportCenter({ entries: state_app.entries.filter(Boolean) }); }),
      menuItem_app('🕘', '批改历史', `这篇有 ${entry?.revisions?.length || 0} 个历史版本`, () => { sheet.close(); openRevisions_app(dateKey); }),
      menuItem_app(entry?.locked ? '🔓' : '🔒', entry?.locked ? '上锁设置' : '给这篇上锁', '用密码保护这一天', () => { sheet.close(); toggleLockFlow_app(dateKey); }),
      menuItem_app('🎨', '个性化设置', '主题 / 背景 / 字体 / 天气 / 数据', () => { sheet.close(); $('#btnMenu')?.click(); }),
      menuItem_app('🖼', '设为背景', '用这天的图片做 App 背景', () => { sheet.close(); pickBackgroundFromDay_app(dateKey); }),
      menuItem_app('🌤', '手动刷新天气', state_app.weather ? `${state_app.weather.city || ''} ${state_app.weather.text} ${state_app.weather.temp}°` : '获取当地天气', () => {
        sheet.close();
        refreshWeather_app({ force: true });
      }),
      menuItem_app('📅', '跳转到今天', formatCN(todayKey()), async () => {
        sheet.close();
        await refreshEntries_app();
        const idx = state_app.dates.indexOf(todayKey());
        state_app.index = Math.max(0, idx);
        await flip_app.show(currentDateKey_app(), { animate: true, direction: 'backward' });
        updateNavButtons_app();
      }),
      menuItem_app('ℹ️', '使用小贴士', '几个让日记更好用的小技巧', () => { sheet.close(); showTips_app(); }),
    ]),
  });
  return sheet;
}

function showTips_app() {
  openModal({
    title: '使用小贴士',
    maxWidth: 460,
    content: el('div', { style: { fontSize: '13.5px', lineHeight: '1.9', color: 'var(--text-2)' }, html: `
      <p><b>翻页</b>：在纸面上左右滑动，或点两侧箭头；电脑上可用 ← → 键。</p>
      <p><b>手写</b>：底部「手写」按钮可直接用手指写字，写完会作为一整页手写稿插进当天日记。</p>
      <p><b>文字转手写</b>：在编辑器里点 ✍️，会把你写的文字用选定字体渲染成手写稿。</p>
      <p><b>素描</b>：底部「图片」或「AI」都能把照片转成铅笔素描，也可以直接做成背景。</p>
      <p><b>上锁</b>：日记页右上角 🔒 可给这一天设置密码，内容会用 AES-GCM 加密保存。</p>
      <p><b>导出</b>：「更多 → 导出成册」勾选日期即可生成 Word / PDF，方便打印装订。</p>
      <p><b>添加到主屏幕</b>：浏览器菜单里选「安装应用」，就能像 App 一样全屏使用。</p>
    ` }),
    actions: [el('button', { class: 'btn btn-primary', text: '知道了', onclick: () => { document.querySelector('.modal-overlay')?.remove(); } })],
  });
}

/* ============================== 生命周期 ============================== */
window.addEventListener('error', (e) => {
  console.error('[日记本] 运行时错误', e.error || e.message);
});
window.addEventListener('unhandledrejection', (e) => {
  console.warn('[日记本] 未处理的 Promise 拒绝', e.reason);
  const msg = e.reason?.message;
  if (msg && state_app.ready) toast(msg.slice(0, 80), { type: 'error' });
});

document.addEventListener('DOMContentLoaded', boot_app);
if (document.readyState !== 'loading') boot_app();
/* 注册 Service Worker（离线可用） */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((err) => console.warn('SW 注册失败', err));
  });
}

/* 调试 / 自检接口：打包成单文件后没有独立模块可 import，用这个入口做端到端验证
   （键名一律加引号，避免被打包器当作标识符改名） */
try {
  window.__RIJI__ = {
    version: typeof window.__RIJI_VERSION__ !== 'undefined' ? window.__RIJI_VERSION__ : 'dev',
    build: typeof window.__RIJI_BUILD__ !== 'undefined' ? window.__RIJI_BUILD__ : 'dev',
    'state': state_app,
    'boot': boot_app,
    'openEntryEditor': openEntryEditor_app,
    'saveEntryContent': saveEntryContent_app,
    'toggleLockFlow': toggleLockFlow_app,
    'openRevisions': openRevisions_app,
    'persistImage': persistImage_app,
    'refreshEntries': refreshEntries_app,
    'renderCurrent': renderCurrent_app,
    'currentDateKey': currentDateKey_app,
    'currentEntry': currentEntry_app,
    'saveSettings': saveSettings_app,
    'lockEntryFlow': lockEntryFlow_app,
    'renderHandwriting': renderHandwriting,
    'getPreset': getPreset,
    // 用于验证 PDF 中文字体是否可用（单文件版靠内联字体，file:// 下无法 fetch）
    'loadPdfFont': loadPdfFont,
    'logout': logout,
    'storage': {
      info: storageInfo,
      isFallback: isFallbackMode,
      ready: ensureStorageReady,
      setInjected: __setInjectedBackend,
    },
    'selfTest': () => ({
      version: window.__RIJI_VERSION__ || 'dev',
      hasFlipbook: !!flip_app,
      entryCount: state_app.entries.filter(Boolean).length,
      dateCount: state_app.dates.length,
      theme: document.body.dataset.theme,
      fontStack: state_app.fontStack,
      paper: state_app.settings?.paper?.style,
      ink: state_app.settings?.ink?.color,
      bundled: typeof window.__RIJI_BUILD__ !== 'undefined',
    }),
  };
} catch (err) {
  console.warn('调试接口注册失败', err);
}



return { "state": state_app, "boot": boot_app, "openEntryEditor": openEntryEditor_app, "saveEntryContent": saveEntryContent_app, "toggleLockFlow": toggleLockFlow_app, "refreshEntries": refreshEntries_app, "renderCurrent": renderCurrent_app, "persistImage": persistImage_app, "normalizeEmail": normalizeEmail, "downloadBlob": downloadBlob, "safeFileName": safeFileName, "revokeImageURLs": revokeImageURLs, "hydrateBodyImages": hydrateBodyImages, "putFont": putFont, "presetFontStack": presetFontStack, "getPreset": getPreset, "HANDWRITING_PRESETS": HANDWRITING_PRESETS, "nearestCity": nearestCity, "lastLocation": lastLocation, "greetByHour": greetByHour, "isStandalone": isStandalone, "dominantColor": dominantColor, "debounce": debounce, "fromKey": fromKey, "toKey": toKey, "todayKey": todayKey, "deleteEntry": deleteEntry, "showProgress": showProgress, "hideProgress": hideProgress, "el": el, "clear": clear };
} };
__m("js/app.js");
})();