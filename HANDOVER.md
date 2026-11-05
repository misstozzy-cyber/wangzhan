# TYRIA LIGHTING 官网项目 — 任务交接文档 (HANDOVER FOR CURSOR)

> **交付目标**：深圳市天瑞亚照明科技有限公司（TYRIA LIGHTING，Since 2012）面向全球照明设计师与工程商的全英文 B2B 官方网站。  
> **工作区目录**：`c:\Users\30882\Desktop\网站`  
> **原始工程资产源**：`F:\TYRIA\TYRIA` (118 份 PDF 规格书、6 本 2026 总目录、259 组 IES/LDT 配光文件及测试报告)  
> **目标 GitHub 仓库**：`https://github.com/zzyxiangnian-star/-`  

---

## 1. 为什么刚刚 Git Push 很慢？（核心瓶颈与立即可行方案）

### 原因诊断
本地代码仓库中已完成首个 Commit（`a45ff3d`），但包含的文件中：
- 源码 + WebP 高清产品图片：**仅约 24 MB**。
- `public/downloads/`（规格书 PDF + 目录 PDF + 测试报告）：**高达 855 MB**！
  - 其中 `public/downloads/catalogs/cat-neon-v2.pdf` 单文件即 **71.8 MB**。
  - Git 打包并在本地代理（`127.0.0.1:7890`）上传近 900MB 的大包到 GitHub 会极为缓慢或引发超时。

### 给 Cursor / 用户的极速解决方案（3 选 1）

#### 方案 A（强烈推荐，30 秒推完）：仅推源码 + 图片，PDF 外置
将 `public/downloads/` 移出 Git 跟踪（或加入 `.gitignore`），PDF 大文件后续托管到腾讯云 COS / 阿里云 OSS / Vercel Blob / GitHub Releases：
```bash
# 1. 撤销上一个包含 855MB 的大提交（保留文件改动）
git reset HEAD~1

# 2. 在 .gitignore 追加 downloads 目录
echo "public/downloads/" >> .gitignore

# 3. 重新添加并提交（此时仓库仅 25MB，几秒即可推完）
git add .
git commit -m "feat: complete TYRIA LIGHTING architectural B2B website (source & webp assets)"
git push -u origin main
```

#### 方案 B：如果必须把 855MB PDF 全推到 GitHub
需要确保代理畅通与 postBuffer 足够大，耐心等待上传：
```bash
git config http.postBuffer 1048576000
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999
git push -u origin main --progress
```

#### 方案 C：使用 GitHub Pages / Vercel
直接部署编译产物或关联 GitHub 仓库自动 CI 部署。

---

## 2. 当前已 100% 建设完成的工程资产清单

项目采用 **React 19 + TypeScript 5.7 + Vite 6 + Tailwind CSS + Framer Motion + React Router v7**。
执行 `npm run build` 已经通过，零 TypeScript 报错，已生成完整 `dist/`。

### 2.1 自动化数据管线 (`scripts/extract_tyria_assets.py`)
- 已从 `F:\TYRIA\TYRIA` 自动提取生成结构化数据：
  - `src/data/products.json`：**115 款产品**（109 款来自独立规格书，6 款来自目录专属系列）。
  - `src/data/ies_library.json`：**380 条**带色温与功率的 IES/LDT 配光文件索引。
  - `src/data/catalogs.json`：**6 本** 2026 官方产品总目录 PDF 元数据。
  - `src/data/factory_certs.json`：**31 张**车间设备实拍 + **9 张**国际认证证书图。
- 提取并压缩了 115 款产品的高清暗底实拍大图（`public/assets/products/*/hero.webp`，已通过亮度阈值过滤掉白底 Logo）。

### 2.2 全局上下文与核心状态
- **全局色温引擎** (`src/context/GlowContext.tsx` + `src/utils/kelvinToRGB.ts`)：
  - Tanner Helland 算法实现 1600K–12000K 开尔文到 RGB 转换，实时驱动 `--glow` 与 `--glow-rgb` CSS 变量。
  - 导航栏集成 Kelvin 滑块与快捷预设（1800K、2400K、2700K、3000K、4000K、6500K 等）。
  - 支持物理拨杆开关切换 Darkroom (深色) / Studio (浅色) 主题。
- **B2B 询价篮** (`src/context/InquiryContext.tsx` + `src/components/common/InquiryDrawer.tsx`)：
  - `localStorage` 持久化，支持任意产品一键加入询价。
  - 支持配置 Webhook (`VITE_INQUIRY_ENDPOINT`)，支持一键格式化生成 WhatsApp 询价清单（`+86 189 3869 3458`），支持邮件客户端发送。
- **并排参数对比抽屉** (`src/components/common/CompareDrawer.tsx`)：
  - 支持任意 2–4 款型号底部抽屉横向并排对比。

### 2.3 8 大创新交互组件 (All Implemented)
1. **LightOnHero** (`src/components/home/LightOnHero.tsx`)：2 秒 SVG 连续圆角霓虹路径描边起辉 + 鼠标聚光灯透视底层等宽型号阵列 + 统计计数条。
2. **ProfileCrossSectionSVG** (`src/components/products/ProfileCrossSectionSVG.tsx`)：根据真实宽高 `size.w` 与 `size.h` 参数化动态渲染 1:1 比例截面，发光面随全局色温发光。
3. **ProfileAtlas** (`src/components/products/ProfileAtlas.tsx`)：1:1 截面图谱墙，带 0–50mm 可拖动游标卡尺实时过滤安装槽宽，支持“1:1 截面墙”与“W×H 散点坐标平面”双视图。
4. **BendLab** (`src/components/home/BendLab.tsx`)：三次贝塞尔曲线物理弯曲实验室，实时通过一阶/二阶导数计算最小曲率半径，若小于规格书极限半径立即变红报警。
5. **LightTheBuilding** (`src/components/home/LightTheBuilding.tsx`)：建筑夜景综合体，点击 6 大工程照明热点（外立面、屋顶轮廓、中庭360°、办公室、暗槽、泳池）分区点亮并推荐型号。
6. **GlareCompare** (`src/components/home/GlareCompare.tsx`)：左右拖动滑块对比普通霓虹与 UGR<19 蜂窝防眩霓虹切光角与眩光指数。
7. **BentoFamilies** (`src/components/home/BentoFamilies.tsx`)：6 大产品家族不对称 Bento 网格 + Why Tyria 核心工艺条。
8. **SEOHead** (`src/components/common/SEOHead.tsx`)：页面级独立 `<title>`、Meta Description 与 JSON-LD 结构化数据。

### 2.4 页面路由矩阵 (`src/App.tsx`)
- `/`：首页
- `/products/neon-flex/atlas`：1:1 截面图谱独立页
- `/products`, `/products/:family`, `/products/:family/:series`：多维筛选产品列表页
- `/product/:id`：产品详情页（含拆解视图 Exploded View、等宽参数表、安装图解、IES/PDF 下载）
- `/spec-finder`：高密度参数数据库（支持 10 维过滤、多列排序、一键导出 CSV）
- `/designer-hub`：设计师配光中心（380+ 份 IES/LDT 筛选检索 + 一次性留资解锁）
- `/applications`：应用场景深度方案页
- `/factory`：从芯片到卷盘横向时间线 + 实验室设备实拍 + 认证证书灯箱墙 + 双工厂坐标
- `/about`：关于天瑞亚（11,000 m²、260 人、15 名工程师）
- `/contact`：联系与免费样品申请表单（承诺 12 小时内响应）
- `*`：404 页面

---

## 3. 常用开发与构建指令

```bash
# 1. 本地启动开发预览服务 (默认端口 5173)
npm run dev

# 2. 生产构建打包 (输出至 dist/)
npm run build

# 3. 本地预览生产产物
npm run preview

# 4. 如需重新从 F 盘解析并提取数据
python scripts/extract_tyria_assets.py
```

---

## 4. Cursor 建议接手跟进事项

1. **Git 仓库推送**：执行上述 **方案 A**，将 `public/downloads/` 加入 `.gitignore`，快速完成代码推送到 `https://github.com/zzyxiangnian-star/-`。
2. **打包体积优化（非必须，但推荐）**：在 `vite.config.ts` 中配置 `rollupOptions.output.manualChunks`，将 `react-router-dom`、`framer-motion`、`lucide-react` 分包，消除 500kB chunk 警告。
3. **真实参数逐项校对**：参考 `walkthrough.md` 中列出的 6 条待核实数据（大部分常规参数已就绪，主要为 6 款目录专属型号的参数微调）。
4. **部署上线**：推送到 GitHub 后，可直接一键导入 Vercel / Netlify / 阿里云，或开启 GitHub Actions 部署至 GitHub Pages。
