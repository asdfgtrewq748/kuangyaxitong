# MCP 服务器配置指南

## 当前配置状态

| 服务器 | 状态 | 功能 |
|--------|------|------|
| filesystem | ✅ 可用 | 文件系统读写 |
| memory | ✅ 可用 | 知识图谱记忆 |
| sequential-thinking | ✅ 可用 | 结构化思考 |
| git | ✅ 已安装 | Git 仓库操作 |
| blender | ❌ 需VC++ | 3D建模(需安装Build Tools) |
| postgres | ❌ 无入口 | 数据库(包有问题) |

---

## 已配置的 MCP 服务器

### 1. filesystem - 文件系统
- 命令: `npx -y @modelcontextprotocol/server-filesystem`
- 功能: 安全的文件读写操作

### 2. memory - 知识图谱记忆
- 命令: `npx -y @modelcontextprotocol/server-memory`
- 功能: AI 长期记忆，构建实体关系图

### 3. sequential-thinking - 结构化思考
- 命令: `npx -y @modelcontextprotocol/server-sequential-thinking`
- 功能: 将复杂任务分解为有序步骤

### 4. git - Git 仓库操作
- 命令: `uvx mcp-server-git`
- 功能: 分支管理、提交历史、代码分析

---

## 安装 Blender MCP (可选)

Blender MCP 需要安装 Visual C++ Build Tools:

1. 下载: https://visualstudio.microsoft.com/visual-cpp-build-tools/
2. 安装时选择 "Desktop development with C++"
3. 重启终端后运行:
   ```bash
   uv tool install blender-mcp
   ```

---

## 添加到 Claude Code

### 方法一: 直接编辑设置
1. 打开 VSCode 设置 (Ctrl + ,)
2. 搜索 "mcp" 或 "claude"
3. 找到 MCP Servers 配置
4. 粘贴 `mcp-config.json` 内容

### 方法二: 命令行配置
```bash
# Claude Code CLI
claude mcp add filesystem "npx -y @modelcontextprotocol/server-filesystem d:\\xiangmu\\kuangyaxitong"
claude mcp add memory "npx -y @modelcontextprotocol/server-memory"
claude mcp add sequential-thinking "npx -y @modelcontextprotocol/server-sequential-thinking"
claude mcp add git "uvx mcp-server-git --repository d:\\xiangmu\\kuangyaxitong"
```

---

## 验证安装

```bash
# 检查已安装的 npm 包
npm list -g --depth=0 | grep mcp

# 检查已安装的 uv 工具
uv tool list
```

---

## 资源链接

- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers) - 200+ MCP 服务器合集
- [官方 MCP 服务器](https://github.com/modelcontextprotocol/servers)
- [MCP 官方文档](https://modelcontextprotocol.io/)
