#!/usr/bin/env node
/**
 * PostToolUse 钩子：助手写入或修改 src/content 下的 .md 文件后，用站点自带的指令检查脚本查这一个文件。
 *
 * 只在三个条件都满足时运行，否则什么也不做：
 *   1. 文件在当前项目的 src/content/ 下
 *   2. 扩展名是 .md
 *   3. 项目 package.json 里有 directives:check 脚本，且 scripts/check-directives.mjs 存在（新版 Vergil 主题）
 *
 * 结果：
 *   有错误   退出码 2，错误写到 stderr，Claude Code 会交给助手去改
 *   只有提示 退出码 0，提示作为 additionalContext 交给助手
 *   检查脚本自己跑挂了  退出码 1，只在记录里提示，不打断助手
 *
 * 不拼 shell 命令：用 execFile 以参数数组调用 node。
 */
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHECK_SCRIPT = 'scripts/check-directives.mjs';
const MAX_INPUT = 1024 * 1024;

function readStdin() {
    return new Promise((resolve) => {
        let data = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => {
            data += chunk;
            if (data.length > MAX_INPUT) process.stdin.destroy();
        });
        process.stdin.on('end', () => resolve(data));
        process.stdin.on('close', () => resolve(data));
    });
}

function isInside(parent, child) {
    const rel = path.relative(parent, child);
    return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function hasCheckScript(root) {
    try {
        const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
        return Boolean(pkg?.scripts?.['directives:check']) && fs.existsSync(path.join(root, CHECK_SCRIPT));
    } catch {
        return false;
    }
}

async function main() {
    let input;
    try {
        input = JSON.parse(await readStdin());
    } catch {
        return 0;
    }

    const filePath = input?.tool_input?.file_path;
    const projectDir = process.env.CLAUDE_PROJECT_DIR || input?.cwd;
    if (typeof filePath !== 'string' || typeof projectDir !== 'string' || !filePath || !projectDir) return 0;

    const root = path.resolve(projectDir);
    const file = path.resolve(root, filePath);
    if (path.extname(file).toLowerCase() !== '.md') return 0;
    if (!isInside(path.join(root, 'src', 'content'), file)) return 0;
    if (!fs.existsSync(file) || !hasCheckScript(root)) return 0;

    const rel = path.relative(root, file);
    const result = await new Promise((resolve) => {
        execFile(
            process.execPath,
            [path.join(root, CHECK_SCRIPT), rel],
            { cwd: root, timeout: 50_000, maxBuffer: 4 * 1024 * 1024 },
            (error, stdout, stderr) => resolve({ code: error ? (typeof error.code === 'number' ? error.code : -1) : 0, stdout, stderr }),
        );
    });

    const output = result.stdout.trim();
    if (result.code === 1 && /\s错误\s/.test(output)) {
        process.stderr.write(`Vergil 指令检查没通过（pnpm directives:check ${rel}），改掉下面的错误后再继续：\n${output}\n`);
        return 2;
    }
    if (result.code !== 0) {
        process.stderr.write(`directives:check 没能运行：${(result.stderr || output).trim().slice(0, 2000)}\n`);
        return 1;
    }
    if (/\s提示\s/.test(output)) {
        process.stdout.write(JSON.stringify({
            hookSpecificOutput: {
                hookEventName: 'PostToolUse',
                additionalContext: `Vergil 指令检查（${rel}）没有错误，但有提示，确认这些内容是不是故意这么写的：\n${output}`,
            },
        }));
    }
    return 0;
}

process.exitCode = await main();
