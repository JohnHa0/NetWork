function operator(proxies) {
  const filterPattern = /.?购买|微信|禁止|官网|流量|过期|登录|商业|面板|下架/;

  const renameRules = [
    // 国家/地区简化
    { pattern: /🇨🇳 中国-(\S+)/g, replacement: "🇨🇳$1" },
    { pattern: /(🇭🇰|🇯🇵|🇰🇷|🇸🇬|🇺🇸|🇬🇧|🇫🇷|🇮🇪|🇦🇺|🇷🇺|🇩🇪|🇮🇳|🇨🇦) 中国-/g, replacement: "$1" },

    // 专线/协议类型
    { pattern: /(IEPL|IPLC|VPDN)(\s*(专线|传输|中继|商宽))?/g, replacement: "$1" },
    { pattern: /多协议标签交换虚拟专用网/g, replacement: "MPLS" },
    { pattern: /固接/g, replacement: "固网" },

    // 节点序号规范
    { pattern: /(\s*(C|L)\s*)(\d+)/g, replacement: " $2$3" },

    // ➕ 保留速率，统一格式为 G/M
    { pattern: /1Gbps/gi, replacement: "1G" },
    { pattern: /500Mbps/gi, replacement: "500M" },
    { pattern: /(\d+)Mbps/gi, replacement: "$1M" },
    // 倍率识别与标准化
    { pattern: /([1-9])倍/gi, replacement: "x$1" },
    { pattern: /(\d)[xX]/g, replacement: "x$1" },  // 替换 1x → x1
    // 完全删除速率
    // { pattern: /\s*(\d+Mbps|1Gbps)/gi, replacement: "" },



    // 位置信息精简
    { pattern: /(油尖旺御金·国峯|京畿道板桥|전라북도 전주시)/g, replacement: "" },
    { pattern: /(Equinix|Legacy Magic|Magic)\s*/g, replacement: "" },
    { pattern: /(|游戏专线|原生游戏解锁)/g, replacement: "游戏" },

    // 解锁服务统一为 NF
    { pattern: /(HBO TVB|Netflix 动画疯|Netflix|动画疯)/gi, replacement: "NF" },

    // 运营商统一缩写
    { pattern: /(環球全域電訊|名氣通電訊)/g, replacement: "HGC" },
    { pattern: /(台湾固网|HiNet)/g, replacement: "TW" },

    // 特殊节点名称简化
    { pattern: /🏴‍☠️虚通链接PVCC/g, replacement: "🏴‍☠️虚通" },
    { pattern: /Next generation AnyPath®.*?CloudBlades \d*/gi, replacement: "DIZTNA" },
    { pattern: /永久虚通路连/g, replacement: "虚通" },
    { pattern: /ASYNCHRONOUS TRANSFERMODE/gi, replacement: "ATM" },

    // 不必要的描述性信息
    { pattern: /(高级|实验性|临时接入|中继|传输)/g, replacement: "" },
    

    // 印度无用信息去除
    { pattern: /(班加罗尔|बेंगलुरु|एयरटेल)/g, replacement: "" },

    // 日本运营商统一缩写
    { pattern: /ソフトバンク|SoftBank/gi, replacement: "SB" },
    { pattern: /Rakuten/gi, replacement: "RK" },
    { pattern: /docomo/gi, replacement: "DCM" },
    { pattern: /KDDI/gi, replacement: "KDDI" },
    { pattern: /NTT/gi, replacement: "NTT" },

    // 清理和格式优化
    { pattern: /\s{2,}/g, replacement: " " },  // 多余空格
    { pattern: /([^ ])(🇨🇳|🇭🇰|🇯🇵|🇰🇷|🇺🇸|🇸🇬|🇫🇷|🇷🇺|🇮🇳|🇨🇦|🇬🇧|🇩🇪|🇮🇪|🏴‍☠️)/g, replacement: "$1 $2" },
    { pattern: /(NF)\s+(NF)/g, replacement: "$1" }  // 合并 NF
  ];

  return proxies
    .filter(proxy => !filterPattern.test(proxy.name)) // 过滤掉匹配关键词的节点
    .map(proxy => {
      let newName = proxy.name;
      for (const rule of renameRules) {
        newName = newName.replace(rule.pattern, rule.replacement);
      }
      return {
        ...proxy,
        name: newName.trim()
      };
    });
}
