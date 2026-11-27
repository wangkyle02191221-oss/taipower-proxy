const UPSTREAM = {
  json: "https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/loadpara.json",
  txt: "https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/loadpara.txt",
  genary: "https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/genary.txt",
  genaryjson: "https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/genary.json",
  areaperc: "https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/genloadareaperc.csv",
  fueltype: "https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/loadfueltype_1.csv",
  areas: "https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/loadareas_1.csv",
  powermessage: "https://service.taipower.com.tw/data/opendata/apply/file/d006020/001.json",
  unitgeneration: "https://service.taipower.com.tw/data/opendata/apply/file/d006001/001.json",
  regionalcurve: "https://service.taipower.com.tw/data/opendata/apply/file/d006019/001.csv",
};
const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.9,*/*;q=0.8",
  "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
  "Referer": "https://www.google.com/",
};
module.exports = async (req, res) => {
  const file = req.query.file;
  const upstream = UPSTREAM[file];
  if (!upstream) {
    res.status(400).send("Unknown file: " + file);
    return;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const r = await fetch(upstream, {
      headers: BROWSER_HEADERS,
      signal: controller.signal,
    });
    const buf = Buffer.from(await r.arrayBuffer());
    const ct = r.headers.get("content-type");
    if (ct) res.setHeader("content-type", ct);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("X-Upstream-Status", String(r.status));
    res.status(r.status).send(buf);
  } catch (e) {
    res.status(502).send("Upstream error: " + (e && e.message ? e.message : e));
  } finally {
    clearTimeout(timer);
  }
};
