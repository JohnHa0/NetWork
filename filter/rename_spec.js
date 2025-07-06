function operator(proxies) {
  const filterPattern = /(?:购买|微信|禁止|官网|流量|过期|登录|商业|面板)/i;

  const renameRules = [
    // （保留你原有的 renameRules）
    { pattern: /🇨🇳 中国-(\S+)/g, replacement: "🇨🇳$1" },
    { pattern: /(🇭🇰|🇯🇵|🇰🇷|🇸🇬|🇺🇸|🇬🇧|🇫🇷|🇮🇪|🇦🇺|🇷🇺|🇩🇪|🇮🇳|🇨🇦) 中国-/g, replacement: "$1" },
    { pattern: /(IEPL|IPLC|VPDN)(\s*(专线|传输|中继|商宽))?/g, replacement: "$1" },
    { pattern: /多协议标签交换虚拟专用网/g, replacement: "MPLS" },
    { pattern: /固接/g, replacement: "固网" },
    { pattern: /(\s*(C|L)\s*)(\d+)/g, replacement: " $2$3" },
    { pattern: /1Gbps/gi, replacement: "1G" },
    { pattern: /500Mbps/gi, replacement: "500M" },
    { pattern: /(\d+)Mbps/gi, replacement: "$1M" },
    { pattern: /([1-9])倍/gi, replacement: "x$1" },
    { pattern: /(\d)[xX]/g, replacement: "x$1" },
    { pattern: /(油尖旺御金·国峯|京畿道板桥|전라북도 전주시)/g, replacement: "" },
    { pattern: /(Equinix|Legacy Magic|Magic)\s*/g, replacement: "" },
    { pattern: /(HBO TVB|Netflix 动画疯|Netflix|动画疯)/gi, replacement: "NF" },
    { pattern: /(環球全域電訊|名氣通電訊)/g, replacement: "HGC" },
    { pattern: /(台湾固网|HiNet)/g, replacement: "TW" },
    { pattern: /🏴‍☠️虚通链接PVCC/g, replacement: "🏴‍☠️虚通" },
    { pattern: /Next generation AnyPath®.*?CloudBlades \d*/gi, replacement: "DIZTNA" },
    { pattern: /永久虚通路连/g, replacement: "虚通" },
    { pattern: /ASYNCHRONOUS TRANSFERMODE/gi, replacement: "ATM" },
    { pattern: /(高级|实验性|临时接入|原生游戏解锁|中继|传输)/g, replacement: "" },
    { pattern: /(班加罗尔|बेंगलुरु|एयरटेल)/g, replacement: "" },
    { pattern: /ソフトバンク|SoftBank/gi, replacement: "SB" },
    { pattern: /Rakuten/gi, replacement: "RK" },
    { pattern: /docomo/gi, replacement: "DCM" },
    { pattern: /KDDI/gi, replacement: "KDDI" },
    { pattern: /NTT/gi, replacement: "NTT" },
    { pattern: /\s{2,}/g, replacement: " " },
    { pattern: /([^ ])(🇨🇳|🇭🇰|🇯🇵|🇰🇷|🇺🇸|🇸🇬|🇫🇷|🇷🇺|🇮🇳|🇨🇦|🇬🇧|🇩🇪|🇮🇪|🏴‍☠️)/g, replacement: "$1 $2" },
    { pattern: /(NF)\s+(NF)/g, replacement: "$1" }
  ];

  const nameCount = {}; // 用于追踪重名次数

  return proxies
    .filter(proxy => !filterPattern.test(proxy.name)) // 过滤敏感关键词
    .map(proxy => {
      let newName = proxy.name;
      for (const rule of renameRules) {
        newName = newName.replace(rule.pattern, rule.replacement);
      }
      newName = newName.trim();

      // 去重处理
      if (nameCount[newName]) {
        nameCount[newName] += 1;
        newName = `${newName}-${nameCount[newName]}`;
      } else {
        nameCount[newName] = 1;
      }

      return {
        ...proxy,
        name: newName
      };
    });
}
