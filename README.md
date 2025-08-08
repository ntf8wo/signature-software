# 互动签名系统

专业互动签名系统，适用于需要电子签名交互的场景。

## 系统要求

### Windows 7 兼容性说明

本系统基于 Electron v13.6.9 开发，该版本是最后一个支持 Windows 7 的稳定版本。为了确保在 Windows 7 上正常运行，您的系统需要满足以下要求：

1. **操作系统**：Windows 7 SP1 或更高版本
2. **.NET Framework**：4.6 或更高版本
3. **Visual C++ 运行库**：
   - Visual C++ 2015-2019 Redistributable (x86)
   - Visual C++ 2013 Redistributable (x86)
   - Visual C++ 2012 Redistributable (x86)
   - Visual C++ 2010 Redistributable (x86)

### 推荐配置

- Windows 7 SP1 64位或更高版本
- 4GB RAM 或更多
- 2GB 可用磁盘空间
- Aero 主题启用（某些功能依赖）

## 安装说明

### Windows 7 安装步骤

1. 如果尚未安装，请先安装 [.NET Framework 4.6](https://dotnet.microsoft.com/download/dotnet-framework)
2. 安装 Visual C++ 运行库（如果系统提示缺少相关组件）
3. 运行安装程序，按照提示完成安装

### 故障排除

如果在 Windows 7 上遇到问题，请尝试以下解决方案：

1. **以管理员身份运行程序**
2. **兼容性模式运行**：
   - 右键点击程序图标
   - 选择"属性"
   - 进入"兼容性"选项卡
   - 勾选"以兼容模式运行这个程序"并选择"Windows 7"
3. **添加启动参数**：
   - 右键点击程序快捷方式
   - 选择"属性"
   - 在"目标"字段末尾添加 `--disable-gpu`
4. **检查防火墙设置**：
   - 确保程序被允许通过防火墙

## 开发说明

### 项目结构

```
.
├── public/                 # 前端资源文件
├── main.js                 # Electron 主进程
├── package.json            # 项目配置
└── WINDOWS7_DEPENDENCIES.md # Windows 7 依赖说明
```

### 运行开发版本

```bash
npm install
npm start
```

### 打包应用

```bash
# 打包标准版本
npm run dist

# 打包Web安装程序（较小，依赖网络下载组件）
npm run dist:win7
```

## 技术栈

- Electron v13.6.9
- Express v4.19.2
- WebSocket (ws) v7.5.10
- HTML5 + JavaScript (原生)

## 许可证

MIT