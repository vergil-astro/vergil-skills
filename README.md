<div align="center">

# Vergil Skills

</div>

<details>
<summary>简体中文（点击展开 / 收起）</summary>

<div align="center">

**给 Vergil 站点写文章、排版的 agent 插件。**

写作和排版规则来自 [kami](https://github.com/tw93/kami)，指令用的是 [Vergil 主题](https://github.com/vergil-astro/vergil-astro-theme)的内容指令。改完文章会自动检查指令写法。

</div>

## 安装

在 Claude Code 里运行：

```text
/plugin marketplace add vergil-astro/vergil-skills
/plugin install vergil@vergil-astro
```

插件里有一个写作技能 `/vergil:writing` 和一个自动检查的钩子。需要主题带 `pnpm directives:ref` 和 `pnpm directives:check` 两个命令，旧版主题请先升级。

更新：`claude plugin marketplace update vergil-astro && claude plugin update vergil@vergil-astro`，然后运行 `/reload-plugins`。

### 其他 agent（Skills CLI）

```bash
npx skills add vergil-astro/vergil-skills
```

适用于 Codex CLI、Cursor 等。这样只装到写作技能，没有自动检查；技能会要求助手写完自己跑一遍 `pnpm directives:check`。

## 用法

装好以后在站点根目录直接跟助手说要做什么：

> 帮我排版一下 `src/content/blog/my-post.md`

> 根据这些笔记写一篇从 Hexo 迁到 Astro 的文章

技能有两种模式。

默认是排版。你的原话一个字不改，它只整理标题、段落、列表、表格和中英文混排的空格标点，再加上合适的指令，结果写到 `<原文件名>.enhanced.md`。写作上的问题会列出来给你看，不替你改。

让它起稿、改写或润色时就是写作模式。它按 kami 的写作规则来写，成稿默认放进 `src/content/blog/`，frontmatter 里带着 `draft: true`，等你看过再发。它不会编东西，缺的事实留成 `[TODO]`。

两种模式都会先判断文章类型（技术文章、教程、随笔、游记、测评、项目介绍）和该排得多满（克制、适中、丰富），再按这两点挑指令。

## 指令从哪来

技能里不再抄指令的写法。助手用到哪个指令，就在站点里跑 `pnpm directives:ref <指令名>` 查当前主题版本的写法；写完跑 `pnpm directives:check <文件>` 检查。主题升级了指令，技能不用跟着改。

## 自动检查

助手每次写入或修改 `src/content/` 下的 `.md` 文件，钩子都会对这个文件跑一遍站点的 `directives:check`：

- 有错误：错误连同行号交回给助手，它接着改
- 只有提示：提示交给助手，确认是不是故意这么写的
- 项目里没有 `directives:check`（不是 Vergil 站点，或主题较旧）：什么也不做

## 搭配 kami

[kami](https://github.com/tw93/kami) 是 Tw93 做的文档排版系统。技能里已经带了它写作和排版规则的摘要，如果再装上 kami 技能，助手会去读 kami 的完整参考，包括写作规则、反模式清单、装饰的减法原则和图表选型。kami 自己的模板、配色和 PDF 流程不会用上，文章长什么样由 Vergil 主题决定。

```bash
# 装到 ~/.agents/skills，Codex 直接读，Claude Code 那边会自动建软链接
npx skills add tw93/kami -a claude-code codex -g -y

# 或者作为 Claude Code 插件安装
/plugin marketplace add tw93/kami
/plugin install kami@kami
```

## 常用指令

| 指令 | 用途 |
|------|------|
| `callout` | 信息、提示、警告、危险提示框 |
| `panel` | 代码并排对比 |
| `tabs` | 可切换的内容块 |
| `timeline` | 按时间讲的经历 |
| `folding` | 折叠段落 |
| `grid` | 多栏布局 |
| `photo` / `gallery` | 摄影框和画廊 |
| `copy` | 一键复制块 |
| `mermaid` | 流程图、架构图 |
| `ann` | 手绘箭头和批注 |
| `ghcard` | GitHub 仓库和用户卡片 |

完整列表在站点里运行 `pnpm directives:ref`。

## License

MIT

</details>

<details open>
<summary>English (click to collapse / expand)</summary>

<div align="center">

**An agent plugin for writing and formatting posts on a Vergil site.**

Its writing and typesetting rules come from [kami](https://github.com/tw93/kami), and it uses the content directives of the [Vergil theme](https://github.com/vergil-astro/vergil-astro-theme). It checks directive syntax after every edit.

</div>

## Install

In Claude Code, run:

```text
/plugin marketplace add vergil-astro/vergil-skills
/plugin install vergil@vergil-astro
```

The plugin contains a writing skill, `/vergil:writing`, and a hook that checks your posts. It needs a theme that has the `pnpm directives:ref` and `pnpm directives:check` scripts; update older themes first.

To update: `claude plugin marketplace update vergil-astro && claude plugin update vergil@vergil-astro`, then run `/reload-plugins`.

### Other agents (Skills CLI)

```bash
npx skills add vergil-astro/vergil-skills
```

Works with Codex CLI, Cursor, and others. This installs the writing skill only, without the automatic check; the skill tells the assistant to run `pnpm directives:check` itself when it's done.

## Usage

Once it's installed, open your site's root folder and tell your assistant what you want:

> Format `src/content/blog/my-post.md` with Vergil directives

> Write a post about migrating from Hexo to Astro, based on these notes

The skill has two modes.

Formatting is the default. Your wording stays exactly as it is. It only tidies up headings, paragraphs, lists, tables, and the spacing and punctuation in mixed Chinese and English text, then adds directives where they fit and writes the result to `<original>.enhanced.md`. Writing problems it finds are listed for you, not rewritten.

When you ask it to draft, rewrite, or polish, it switches to writing mode. It follows kami's writing rules and saves the post to `src/content/blog/` by default, with `draft: true` in the frontmatter so you can review it before publishing. It doesn't make things up: missing facts are left as `[TODO]`.

In both modes it first works out what kind of post it is (tech blog, tutorial, life notes, travel, review, or project showcase) and how much formatting fits (minimal, default, or rich), then picks directives based on both.

## Where the Directives Come From

The skill no longer carries its own copy of the directive syntax. When the assistant needs a directive, it runs `pnpm directives:ref <name>` in your site to get the syntax for the theme version you run, and `pnpm directives:check <file>` when it's done. When the theme changes a directive, the skill doesn't need an update.

## Automatic Check

Every time the assistant writes or edits a `.md` file under `src/content/`, the hook runs your site's `directives:check` on that file:

- Errors: handed back to the assistant with line numbers, and it fixes them
- Warnings only: handed to the assistant so it can confirm the content is intentional
- No `directives:check` in the project (not a Vergil site, or an older theme): does nothing

## Works Better with kami

[kami](https://github.com/tw93/kami) is a document typesetting system by Tw93. This skill already carries a digest of its writing and typesetting rules. If the kami skill is installed too, the assistant reads kami's full references: writing rules, anti-patterns, the subtractive rule for decoration, and diagram selection. kami's own templates, colors, and PDF pipeline aren't used, because the Vergil theme decides how the post looks.

```bash
# Installs to ~/.agents/skills: Codex reads it directly, and Claude Code gets a symlink
npx skills add tw93/kami -a claude-code codex -g -y

# Or install it as a Claude Code plugin
/plugin marketplace add tw93/kami
/plugin install kami@kami
```

## Common Directives

| Directive | Use for |
|-----------|---------|
| `callout` | Info, tip, warning, and danger alerts |
| `panel` | Side-by-side code comparison |
| `tabs` | Switchable content blocks |
| `timeline` | Stories told in order |
| `folding` | Collapsible sections |
| `grid` | Multi-column layouts |
| `photo` / `gallery` | Photo frames and galleries |
| `copy` | One-click copy blocks |
| `mermaid` | Flowcharts and architecture diagrams |
| `ann` | Handwritten arrows and margin notes |
| `ghcard` | GitHub repo and user cards |

For the full list, run `pnpm directives:ref` in your site.

## License

MIT

</details>
