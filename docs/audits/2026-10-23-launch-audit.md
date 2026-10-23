# Filmcraft 上线前审计与修复

日期：2026-10-23。工作流：launch-audit all + security-scan。未执行部署或 git commit。

## 检查结果

| 维度   | 检查范围                                             | 发现的问题                                                                               | 已修复                                                                                                            | 仍需关注                                                     |
| ------ | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 响应式 | 390、768、1440px；公开指南、政策、登录与应用壳层     | 平板导航拥挤、点击区域偏小                                                               | 导航断点、40px 以上控件、表格分页换行与长文本处理                                                                 | 已测公开页面无横向页面溢出                                   |
| 主题   | 全局 tokens、公共组件、后台通用组件                  | 浅色与暗色使用同一配色；固定白色高亮及代码块配色                                         | 独立浅色 tokens、语义颜色、浅暗主题切换及持久化验证                                                               | 暗色保持默认；浅色也可使用                                   |
| SEO    | 中英文 16 个公开页面、sitemap、robots、llms          | 政策页缺少社交标签、旧品牌爬虫文案、站点结构化数据定位不符                               | 唯一标题、canonical、3 个语言链接、OG/Twitter、站点 JSON-LD、XML 转义、私有路径排除                               | 生产域名仍沿用当前部署配置，正式域名上线时应核对 canonical   |
| 性能   | 本地生产构建的 Lighthouse 移动/桌面测试              | 未压缩资源、大图、字体体积、访客加载用户菜单等                                           | HTML gzip、JS/CSS 预压缩、缓存策略、响应式 WebP、标题字体 90KB→15KB、原生语言选择和 FAQ、按需用户菜单、首图预加载 | 手机模拟 LCP 仍高于 2.5 秒目标；需在实际 Cloudflare 域名复测 |
| 安全   | 全部服务端接口与敏感流程；待提交代码、依赖和忽略配置 | 依赖漏洞、失效角色仍有权限、危险跳转、跨站写请求、限流绕过、D1 伪事务、重复退款/回调风险 | 升级依赖、权限撤销、跳转过滤、Origin 检查、私有响应禁止缓存、限流加固、批处理与幂等保护、忽略数据库及私钥文件     | D1 支付和其他依赖交互事务的功能保持禁用，见下文              |

## Lighthouse 结果

分数顺序：性能 / 无障碍 / 最佳实践 / SEO。生产构建、本地 HTTP、Lighthouse 13.5 模拟；不是线上真实用户 Core Web Vitals。

| 场景         | 分数                  | LCP   | CLS   | TBT  |
| ------------ | --------------------- | ----- | ----- | ---- |
| 手机，390px  | 91 / 100 / 100 / 100  | 3.4 s | 0.014 | 0 ms |
| 桌面，1440px | 100 / 100 / 100 / 100 | 0.8 s | 0     | 0 ms |

手机首次测量为 73 分，优化后 91 分。没有测量真实用户 INP，不宣称全站 CWV 已全部达标。

报告与截图位于 gitignored 的 `data/audits/2026-10-23/`，避免把大量诊断产物加入提交。

## 安全复查

- `security-scan --worktree`：扫描通过，无密钥、禁止提交文件或忽略配置问题。
- `pnpm audit --registry=https://registry.npmjs.org`：生产及开发依赖共 841 项，Critical / High / Moderate / Low 均为 0。
- 客户端产物检查：未包含当前配置的 AUTH_SECRET 或 CONFIG_ENCRYPTION_KEY。
- 八项回归测试通过：危险跳转、跨站写请求、缓存/错误信息、失效与过期角色、退款幂等与金额校验、D1 参数化批处理、限流、D1 交互事务拒绝执行。
- 隔离 SQLite 的生产接口测试通过：管理员登录、匿名拒绝、普通用户提权拒绝、工单归属、跨站管理请求拒绝、伪装图片拒绝、会话令牌禁止缓存。测试不写远程 D1。
- 支付回调事务内增加行锁和重放检查；没有进行真实支付或外部商户端到端测试。
- `pnpm build`、Cloudflare Workers 兼容构建、`tsc --noEmit`、`git diff --check` 通过。

## 运行限制

1. D1 不支持交互式事务。原来兼容层会直接执行回调并产生部分提交，现在会在回调执行前拒绝。后台配置、页脚与工单改为原子操作；支付 checkout 在收款前返回 503。依赖交互事务的积分扣减/退款、带积分的 AI 任务、邀请码兑换等不可在 D1 上启用，须先实现专用原子批处理。指南页面正常使用。
2. `VITE_FILMCRAFT_WEB_URL` 尚未配置，在线页面提供真实的可用状态与自行运行说明，不能视为在线编辑器已上线。
3. 未部署。生产环境的 AUTH_SECRET、CONFIG_ENCRYPTION_KEY、域名与实际 Cloudflare 响应仍需在正式发布时验证。
4. Ego 的普通截图因窗口最小化及系统辅助访问权限受限而不可用；视口和主题通过浏览器 DOM 验证，暗色最终截图使用 Lighthouse 捕获。浅色没有完成独立截图审阅。

## 复现

```sh
pnpm build
pnpm exec tsc --noEmit
pnpm exec tsx --test scripts/tests/launch-security.test.ts
node scripts/tests/api-security.mjs
python3 .claude/skills/security-scan/scripts/scan_staged.py --worktree
pnpm audit --registry=https://registry.npmjs.org
```

修复依据：[TanStack Start 安全公告](https://github.com/TanStack/router/security/advisories/GHSA-qx66-fv34-fjm8)、[Cloudflare D1 原子批处理文档](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch)。
