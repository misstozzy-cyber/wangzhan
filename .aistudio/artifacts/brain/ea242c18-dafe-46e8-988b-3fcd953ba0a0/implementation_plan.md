# 首页次级文本区块滚动渐显动画 (Homepage Scroll Reveal)

为首页首屏以下的各个次级内容与文本区块添加统一的 **Scroll Reveal（滚动渐显 + 柔和上浮）** 动效，使用 Framer Motion 的视口触发机制（`whileInView`）与现有的 Lenis 平滑滚动自然配合，营造连贯的意式画廊浏览节奏。

### User Review & Critical Decisions

> [!NOTE]
> 所有滚动渐显动画仅使用合成器属性（`opacity` 与 `transform: translateY`），并统一采用项目的丝滑阻尼曲线 `SILK = cubic-bezier(0.22, 1, 0.36, 1)`，在元素进入视口时触发一次（`once: true`），避免反复闪烁并保证 60fps 流畅度。

- **动效参数规范**：
  - **位移与透明度**：初始状态 `opacity: 0, y: 28px` → 进入视口后 `opacity: 1, y: 0px`。
  - **缓动与时长**：`duration: 0.95s–1.1s`，`ease: [0.22, 1, 0.36, 1]`，同区块内的标签（Micro Kicker）、主标题、正文段落与数据指标采用 `0.08s–0.12s` 的阶梯延迟（Stagger Delay）。
  - **触发阈值**：`viewport={{ once: true, amount: 0.2, margin: "-8% 0px" }}`，在用户平滑滚动至区块时恰到好处地浮现。

### 1. Overview & Core Concept

- **What It Does**：当访客沿首页向下滚动时，各章节的编号标签、二级标题、说明段落、工厂与材料统计数据、以及底部行动号召文案依次轻柔淡入并向上舒展就位。
- **Key Value**：消除静态文本突然出现的生硬感，使次级内容与首屏高反差衬线主标题、Lenis 惯性平滑滚动形成统一的画廊叙事韵律。

### 2. User Experience & Visual Design

- **覆盖的首页次级文本区块**：
  1. **`01 — Material`（材料章节）**：章节编号标签在进入视口时渐显上浮；底部 4 组核心指标（`2012`、`11,000 m²`、`260`、`50+`）按列依次阶梯淡入上浮（保留原有的逐词滚动高亮效果）。
  2. **`02 — Profiles`（截面比例章节）**：左侧章节标签 `02 — Profiles`、二级标题 `Every profile, drawn to scale.` 以及右侧大号计数器块在进入舞台时柔和渐显上浮。
  3. **`03 — Pixel`（像素霓虹章节）**：在全屏展开画面的底部文字区中，为左侧标题组与右侧描述段落/按钮增加层次分明的渐显上浮配合。
  4. **`04 — Range`（四大产品家族）**：顶部标题区（`04 — Range`、`Four families of linear light.` 及右侧 `All 115 models` 按钮）与卡片底部的产品家族标题、描述文案实现阶梯式滚动渐显。
  5. **`05 — Factory`（深圳智造工厂）**：顶部 `05 — Factory` 标签、标题 `Made end to end in Shenzhen.`、右侧工艺描述段落、4 组工厂规模数据指标，以及底部 `Inside the factory` 按钮依次阶梯淡入上浮。
  6. **`06 — Certified`（国际认证章节）**：顶部 `06 — Certified` 标签、认证徽标跑马灯容器与底部认证说明段落依次渐显上浮。
  7. **`Closing`（底部样品申请模块）**：在现有标题动画基础上，为说明正文 `Free engineering samples...` 与底部双按钮组（`Contact us` / `Download catalogues`）补齐阶梯延迟的渐显上浮效果。

### 3. Key Product Decisions & Trade-Offs

- **Decision 1**：单次触发（`once: true`）+ 纯合成器动画（`opacity` + `y`）
  - *Chosen Approach*：使用 Framer Motion `whileInView` 配合 `viewport={{ once: true }}`，仅动画化 `opacity` 和 `y`（`translateY`）。
  - *Why*：与 Lenis 平滑滚动配合时不会引起任何布局重排（Reflow）或滚动卡顿，且用户向上回看页面时内容立即可读，无需再次等待动画播放。

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌────────────────────────────────────────────────────────────────────┐
│                     HomePage (Lenis SmoothScroll)                  │
└─────────────────────────────────┬──────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│               Secondary Text Sections Scroll Reveal                │
│  • Curve: SILK [0.22, 1, 0.36, 1] | Initial: { opacity: 0, y: 28 } │
│  • Viewport: { once: true, margin: "-8% 0px" }                     │
├────────────────────────────────────────────────────────────────────┤
│  ├─ 01 Material  → Kicker + 4 Staggered Stat Blocks                │
│  ├─ 02 Profiles  → Kicker + H2 Title + Right Counter Block         │
│  ├─ 03 Pixel     → Staggered Title Group + Description & CTA       │
│  ├─ 04 Families  → Header Row + Card Text Captions                 │
│  ├─ 05 Factory   → Kicker + H2 + Prose + 4 Stats + CTA Button      │
│  ├─ 06 Certified → Kicker + Marquee Row + Caption Paragraph        │
│  └─ 07 Closing   → H2 Title + Staggered Prose + Dual CTA Buttons   │
└────────────────────────────────────────────────────────────────────┘
```
