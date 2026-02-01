async function updateDownloadLinksAndTimesByIndex() {
  const API_URL = "https://api.github.com/repos/weekdaycare/immortalwrt-mt7981-cudy-tr3000/releases";
  
  // 配置映射表：匹配规则、对应的 ID、以及是否为 uboot
  const CONFIG = [
    { id: "256M", timeId: "time-256M", match: n => n.startsWith("256m-") },
    { id: "128M", timeId: "time-128M", match: n => n.startsWith("128m-") },
    { id: "128M_U", timeId: "time-128M-ubootmod", match: n => n.includes("ubootmod") },
    { id: "U128", timeId: "time-uboot-128M", match: n => n.startsWith("uboot-128m") },
    { id: "U256", timeId: "time-uboot-256M", match: n => n.startsWith("uboot-256m") }
  ];

  try {
    const res = await fetch(API_URL);
    if (!res.ok) return;
    const releases = (await res.json()).filter(r => !r.prerelease && !r.draft);

    const linkElements = document.querySelectorAll(".item.grid-4 > a");

    CONFIG.forEach((conf, index) => {
      // 找到第一个匹配的 release（API 默认最新在前）
      const latest = releases.find(r => conf.match((r.name || "").toLowerCase()));
      if (!latest || !linkElements[index]) return;

      // 更新时间
      const timeElem = document.getElementById(conf.timeId);
      if (timeElem) timeElem.textContent = latest.published_at.replace(/[TZ]/g, " ").trim();

      // 更新链接
      if (conf.id.startsWith("U")) {
        linkElements[index].href = latest.html_url;
      } else {
        const asset = latest.assets.find(a => a.browser_download_url.includes("sysupgrade.bin"));
        if (asset) linkElements[index].href = asset.browser_download_url;
      }
    });
  } catch (err) {
    console.error("Update failed:", err);
  }
}

// 路由监听逻辑优化
function runUpdate() {
  if (window.location.pathname === "/") updateDownloadLinksAndTimesByIndex();
}

// 初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runUpdate);
} else {
  runUpdate();
}

// 劫持 History API
["pushState", "replaceState"].forEach(type => {
  const original = history[type];
  history[type] = function() {
    original.apply(this, arguments);
    runUpdate();
  };
});
window.addEventListener("popstate", runUpdate);