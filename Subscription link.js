#
function main(config) {
  if (!config || typeof config !== "object") return config;

  // 1. 填写两个订阅链接
  const FIRST_URL = "填写您第一个订阅链接";
  const SECOND_URL = "填写您第二个订阅链接";

  const FIRST_PROVIDER = "MyNodeProvider";
  const SECOND_PROVIDER = "NodeProvider2";

  // 第二个订阅专用测速组
  const EXCLUSIVE_GROUPS = ["HK Node", "TW Node", "US Node"];

  // 2. 确保 Provider 容器存在
  if (
    !config["proxy-providers"] ||
    typeof config["proxy-providers"] !== "object" ||
    Array.isArray(config["proxy-providers"])
  ) {
    config["proxy-providers"] = {};
  }

  // 3. 第一个订阅：沿用原稳定脚本设置
  config["proxy-providers"][FIRST_PROVIDER] = {
    type: "http",
    url: FIRST_URL,
    interval: 86400,
    path: "./proxy_providers/MyNodeProvider.yaml",
    "health-check": {
      enable: true,
      interval: 600,
      url: "https://www.gstatic.com/generate_204"
    }
  };

  // 4. 第二个订阅：专供三个测速组
  config["proxy-providers"][SECOND_PROVIDER] = {
    type: "http",
    url: SECOND_URL,
    interval: 86400,
    path: "./proxy_providers/NodeProvider2.yaml"
  };

  // 5. 第一个订阅沿用原来的挂载方式
  // 不挂载到三个专属测速组
  if (Array.isArray(config["proxy-groups"])) {
    for (const group of config["proxy-groups"]) {
      if (!group || !group.name) continue;
      if (EXCLUSIVE_GROUPS.includes(group.name)) continue;
      if (["DIRECT", "REJECT"].includes(group.type)) continue;

      if (!Array.isArray(group.use)) {
        group.use = [];
      }

      if (!group.use.includes(FIRST_PROVIDER)) {
        group.use.push(FIRST_PROVIDER);
      }
    }
  }

  return config;
}
