
const PLAN_IDS = { m1: 1, m3: 2, m6: 3, y1: 4 };
const PLAN_NAMES = { m1: '30 Günlük', m3: '3 Aylık', m6: '6 Aylık', y1: '1 Yıllık' };
const EPOCH = Date.UTC(2020, 0, 1);
const DAY = 86400000;
const B32 = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const enc = new TextEncoder();
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS }
});
const b64ToBytes = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const bytesToB64url = (b) => btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const hex = (buf) => [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('');
function b32enc(buf) {
  let bits = 0, val = 0, out = '';
  for (const b of buf) { val = (val << 8) | b; bits += 8; while (bits >= 5) { out += B32[(val >>> (bits - 5)) & 31]; bits -= 5; } }
  if (bits > 0) out += B32[(val << (5 - bits)) & 31];
  return out;
}
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function hmacHex(key, msg) {
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', k, enc.encode(msg)));
}
const normOrder = (s) => String(s || '').trim().replace(/^#/, '').replace(/\s+/g, '');
const normEmail = (s) => String(s || '').trim().toLowerCase();
const normMid = (s) => String(s || '').trim().toUpperCase();
let signKey = null;
async function getSignKey(env) {
  if (signKey) return signKey;
  const raw = b64ToBytes(env.SIGNING_KEY); // tweetnacl: 32 bayt tohum + 32 bayt açık anahtar
  if (raw.length !== 64) throw new Error('SIGNING_KEY hatalı');
  const jwk = { kty: 'OKP', crv: 'Ed25519', d: bytesToB64url(raw.slice(0, 32)), x: bytesToB64url(raw.slice(32)), ext: false };
  try { signKey = await crypto.subtle.importKey('jwk', jwk, { name: 'Ed25519' }, false, ['sign']); signKey.alg = 'Ed25519'; }
  catch { signKey = await crypto.subtle.importKey('jwk', jwk, { name: 'NODE-ED25519', namedCurve: 'NODE-ED25519' }, false, ['sign']); signKey.alg = 'NODE-ED25519'; }
  return signKey;
}
async function makeLicense(env, planKey, machineId, startMs) {
  const planId = PLAN_IDS[planKey];
  if (!planId) throw new Error('Bilinmeyen paket');
  const midHash = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(machineId.replace(/-/g, '').toUpperCase()))).slice(0, 8);
  const days = Math.max(0, Math.floor((startMs - EPOCH) / DAY));
  const payload = new Uint8Array(12);
  payload[0] = 1; payload[1] = planId; payload.set(midHash, 2); payload[10] = (days >> 8) & 255; payload[11] = days & 255;
  const key = await getSignKey(env);
  const alg = key.alg === 'Ed25519' ? { name: 'Ed25519' } : { name: 'NODE-ED25519' };
  const sig = new Uint8Array(await crypto.subtle.sign(alg, key, payload));
  const all = new Uint8Array(76); all.set(payload, 0); all.set(sig, 12);
  return 'ZETX-' + b32enc(all).match(/.{1,6}/g).join('-');
}
function planFor(env, order) {
  let map = {};
  try { map = JSON.parse(env.PRODUCT_PLANS || '{}'); } catch {}
  const ids = String(order.productid || '').split(',').map((s) => s.trim());
  for (const id of ids) if (map[id]) return map[id];
  const name = String(order.productlist || '').toLocaleLowerCase('tr-TR');
  if (/(1|bir)\s*y[ıi]l|12\s*ay|y[ıi]ll[ıi]k/.test(name)) return 'y1';
  if (/6\s*ay/.test(name)) return 'm6';
  if (/3\s*ay/.test(name)) return 'm3';
  if (/30\s*g[üu]n|1\s*ay|ayl[ıi]k/.test(name)) return 'm1';
  return null;
}
async function readOsb(request) {
  const type = request.headers.get('content-type') || '';
  let res = null, hash = null;
  if (type.includes('application/json')) {
    const body = await request.json();
    if (Array.isArray(body)) { res = body[0] && (body[0].value ?? body[0]); hash = body[1] && (body[1].value ?? body[1]); }
    else { res = body.res; hash = body.hash; }
  } else {
    const form = await request.formData();
    res = form.get('res'); hash = form.get('hash');
    if (!res || !hash) { const vals = [...form.values()].map(String); res = res || vals[0]; hash = hash || vals[1]; }
  }
  return { res: res && String(res), hash: hash && String(hash) };
}
async function handleOsb(request, env) {
  if (!env.SHOPIER_USER || !env.SHOPIER_PASS) return new Response('not configured', { status: 500 });
  const { res, hash } = await readOsb(request).catch(() => ({}));
  if (!res || !hash) return new Response('Missing parameter', { status: 401 });
  const expected = await hmacHex(env.SHOPIER_PASS, res + env.SHOPIER_USER);
  if (!safeEqual(expected, hash.toLowerCase())) return new Response('Unauthorized', { status: 401 });
  let o;
  try { o = JSON.parse(new TextDecoder().decode(b64ToBytes(res))); } catch { return new Response('Bad data', { status: 400 }); }
  const orderId = normOrder(o.orderid);
  if (!orderId) return new Response('Bad data', { status: 400 });
  const existing = await env.ORDERS.get('order:' + orderId, 'json');
  const rec = existing || {
    orderId, email: normEmail(o.email), buyer: `${o.buyername || ''} ${o.buyersurname || ''}`.trim(),
    productid: String(o.productid ?? ''), productlist: String(o.productlist ?? ''), price: o.price, currency: o.currency,
    note: String(o.customernote || '').slice(0, 200), test: o.istest == 1 || o.istest === true || o.istest === '1',
    plan: null, at: Date.now(), machines: [], revoked: false
  };
  rec.plan = rec.plan || planFor(env, o);
  await env.ORDERS.put('order:' + orderId, JSON.stringify(rec));
  return new Response('success', { status: 200, headers: { 'Content-Type': 'text/plain' } });
}
async function tooMany(env, ip) {
  const k = 'rl:' + ip;
  const n = parseInt((await env.ORDERS.get(k)) || '0', 10);
  if (n >= 20) return true;
  await env.ORDERS.put(k, String(n + 1), { expirationTtl: 3600 });
  return false;
}
async function handleActivate(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'Geçersiz istek' }, 400); }
  const orderId = normOrder(body.order), email = normEmail(body.email), mid = normMid(body.machineId);
  if (!orderId || !email || !/^[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/.test(mid)) return json({ ok: false, error: 'Sipariş numarası, e-posta ve makine kimliği gerekli.' }, 400);
  const ip = request.headers.get('cf-connecting-ip') || 'x';
  const rec = await env.ORDERS.get('order:' + orderId, 'json');
  if (!rec || !safeEqual(rec.email, email)) {
    if (await tooMany(env, ip)) return json({ ok: false, error: 'Çok fazla deneme. 1 saat sonra tekrar deneyin.' }, 429);
    return json({ ok: false, error: 'Sipariş bulunamadı. Sipariş numarasını ve ödeme yaptığınız e-posta adresini kontrol edin. Ödemeyi yeni yaptıysanız 1-2 dakika bekleyin.' }, 404);
  }
  if (rec.revoked) return json({ ok: false, error: 'Bu sipariş iptal edilmiş. Destek için iletişime geçin.' }, 403);
  if (rec.test && env.ALLOW_TEST !== '1') return json({ ok: false, error: 'Bu bir test siparişidir.' }, 403);
  if (!rec.plan) return json({ ok: false, error: 'Siparişteki paket tanınamadı. Destek için iletişime geçin.' }, 409);
  const max = parseInt(env.MAX_MACHINES || '1', 10);
  if (!rec.machines.includes(mid)) {
    if (rec.machines.length >= max) return json({ ok: false, error: 'Bu sipariş başka bir bilgisayarda etkinleştirilmiş. Bilgisayar değiştirdiyseniz destek için iletişime geçin.' }, 409);
    rec.machines.push(mid);
    rec.activatedAt = rec.activatedAt || Date.now();
    await env.ORDERS.put('order:' + orderId, JSON.stringify(rec));
  }
  const key = await makeLicense(env, rec.plan, mid, rec.at);
  return json({ ok: true, key, plan: PLAN_NAMES[rec.plan] });
}
async function handleAdmin(request, env) {
  let b; try { b = await request.json(); } catch { return json({ ok: false }, 400); }
  if (!env.ADMIN_TOKEN || !safeEqual(String(b.token || ''), env.ADMIN_TOKEN)) return json({ ok: false, error: 'Yetkisiz' }, 401);
  const id = normOrder(b.order);
  const k = 'order:' + id;
  if (b.action === 'list') {
    const l = await env.ORDERS.list({ prefix: 'order:', limit: 1000 });
    const out = [];
    for (const x of l.keys) out.push(await env.ORDERS.get(x.name, 'json'));
    return json({ ok: true, orders: out.sort((a, c) => c.at - a.at) });
  }
  if (b.action === 'create') { // elle sipariş ekleme (ör. çekiliş hediyesi, havale ile ödeme)
    if (!id || !b.email || !PLAN_IDS[b.plan]) return json({ ok: false, error: 'order, email ve plan (m1/m3/m6/y1) gerekli' }, 400);
    const rec = { orderId: id, email: normEmail(b.email), buyer: String(b.buyer || ''), productid: '', productlist: 'Elle eklendi', price: b.price ?? 0, plan: b.plan, at: Date.now(), machines: [], revoked: false, manual: true };
    await env.ORDERS.put(k, JSON.stringify(rec));
    return json({ ok: true, order: rec });
  }
  const rec = await env.ORDERS.get(k, 'json');
  if (!rec) return json({ ok: false, error: 'Sipariş yok' }, 404);
  if (b.action === 'reset') rec.machines = [];
  else if (b.action === 'revoke') rec.revoked = true;
  else if (b.action === 'unrevoke') rec.revoked = false;
  else if (b.action === 'setplan' && PLAN_IDS[b.plan]) rec.plan = b.plan;
  else if (b.action !== 'get') return json({ ok: false, error: 'Bilinmeyen işlem' }, 400);
  if (b.action !== 'get') await env.ORDERS.put(k, JSON.stringify(rec));
  return json({ ok: true, order: rec });
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
      if (request.method === 'GET' && url.pathname === '/') return json({ ok: true, service: 'ZETX Lisans Sunucusu' });
      if (request.method === 'POST' && url.pathname === '/shopier/osb') return await handleOsb(request, env);
      if (request.method === 'POST' && url.pathname === '/activate') return await handleActivate(request, env);
      if (request.method === 'POST' && url.pathname === '/admin') return await handleAdmin(request, env);
      return json({ ok: false, error: 'Bulunamadı' }, 404);
    } catch (e) {
      return json({ ok: false, error: 'Sunucu hatası' }, 500);
    }
  }
};
