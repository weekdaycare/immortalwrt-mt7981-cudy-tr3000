async function updateDownloadLinksAndTimesByIndex() {
  const API_URL = "https://api.github.com/repos/weekdaycare/immortalwrt-mt7981-cudy-tr3000/releases";
  
  // 配置映射表：匹配规则、对应的 ID、以及是否为 uboot
  const CONFIG = [
    { id: "256M", timeId: "time-256M", match: n => n.startsWith("immortalwrt-"), assetMatch: n => n.includes("256mb") && n.includes("sysupgrade.bin") },
    { id: "128M", timeId: "time-128M", match: n => n.startsWith("immortalwrt-"), assetMatch: n => !n.includes("256mb") && !n.includes("ubootmod") && n.includes("sysupgrade.bin") },
    { id: "128M_U", timeId: "time-128M-ubootmod", match: n => n.startsWith("immortalwrt-"), assetMatch: n => n.includes("ubootmod") && n.includes("sysupgrade.bin") },
    { id: "U128", timeId: "time-uboot-128M", match: n => n.startsWith("uboot-"), isReleaseLink: true },
    { id: "U256", timeId: "time-uboot-256M", match: n => n.startsWith("uboot-"), isReleaseLink: true }
  ];

  try {
    const res = await fetch(API_URL);
    if (!res.ok) return;
    const releases = (await res.json()).filter(r => !r.prerelease && !r.draft);

    const linkElements = document.querySelectorAll(".item.grid-4 > a");

    CONFIG.forEach((conf, index) => {
      // 1. 找到符合名称规则的最新 Release
      const latest = releases.find(r => conf.match((r.name || "").toLowerCase()));
      if (!latest || !linkElements[index]) return;

      // 2. 更新发布时间
      const timeElem = document.getElementById(conf.timeId);
      if (timeElem) {
        timeElem.textContent = new Date(latest.published_at).toLocaleString("zh-CN");
      }

      // 3. 更新下载链接
      if (conf.isReleaseLink) {
        // 如果是 Uboot 类型，直接跳转到 Release 页面
        linkElements[index].href = latest.html_url;
      } else if (conf.assetMatch) {
        // 如果是固件类型，从 assets 列表中寻找匹配的文件
        const asset = latest.assets.find(a => conf.assetMatch(a.name.toLowerCase()));
        if (asset) {
          linkElements[index].href = asset.browser_download_url;
        }
      }
    });
  } catch (err) {
    console.error("Update failed:", err);
  }
}

// 路由监听逻辑优化
function runUpdate() {
  // 如果你的首页路径是 "/"，请保留此判断
  if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    updateDownloadLinksAndTimesByIndex();
  }
}

// 初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runUpdate);
} else {
  runUpdate();
}

// 劫持 History API 适配单页应用跳转
["pushState", "replaceState"].forEach(type => {
  const original = history[type];
  history[type] = function() {
    original.apply(this, arguments);
    runUpdate();
  };
});
window.addEventListener("popstate", runUpdate);