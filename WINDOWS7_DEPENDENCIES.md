# Windows 7 运行依赖说明

由于您的项目基于 Electron v13.6.9 开发，该版本支持 Windows 7 系统，但需要一些必要的运行库才能正常运行。为确保在 Windows 7 系统上顺利运行，用户需要安装以下依赖：

## 必需的运行库

### 1. .NET Framework 4.6 或更高版本
- Electron 应用在 Windows 上需要 .NET Framework 4.6 或更高版本
- 部分 Windows 7 SP1 系统可能无法直接安装 .NET Framework 4.6，需要先升级系统

### 2. Visual C++ 运行库
Electron 基于 Chromium 和 Node.js，需要以下 Visual C++ 运行库组件：
- Visual C++ 2015-2019 Redistributable (x86) - 14.29.xxxxx 或更高版本
- Visual C++ 2013 Redistributable (x86) - 12.0.xxxxx 或更高版本
- Visual C++ 2012 Redistributable (x86) - 11.0.xxxxx 或更高版本
- Visual C++ 2010 Redistributable (x86) - 10.0.xxxxx 或更高版本

### 3. 其他建议设置
- 确保 Windows 7 使用 Aero 主题（某些 Electron 功能依赖）
- 如果遇到显示问题，可以尝试添加启动参数 `--disable-gpu`

## 打包时包含运行库的方法

为了方便用户使用，建议在打包时将必要的运行库包含在安装包中。可以通过以下方式实现：

### 方法一：使用 electron-builder 配置
在 `package.json` 中添加额外的配置：

```json
{
  "build": {
    "nsis": {
      "include": "build/installer.nsh",
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

### 方法二：创建 NSIS 脚本
创建 [build/installer.nsh](file:///f:/signature-project/build/installer.nsh) 文件，内容如下：

```nsis
!macro customInstall
  ; 检查并安装 .NET Framework 4.6
  ; 检查并安装 Visual C++ 运行库
  ; 可以使用 NSIS 的逻辑来判断是否需要安装
!macroend
```

## 推荐做法

1. 将常用的 Visual C++ 运行库安装包放在项目中：
   - [vc_redist.x86.exe](file:///f:/signature-project/vc_redist.x86.exe) (Visual C++ 2015-2019 Redistributable)
   - [vcredist_x86.exe](file:///f:/signature-project/vcredist_x86.exe) (Visual C++ 2013 Redistributable)

2. 在 README 中添加 Windows 7 用户的特殊说明：
   - 提供详细的安装步骤
   - 列出所需的依赖库
   - 提供故障排除指南

## 故障排除

如果在 Windows 7 上遇到问题，请尝试以下解决方案：

1. 以管理员身份运行程序
2. 兼容性模式运行（设置为 Windows 7 或 Vista）
3. 添加启动参数 `--disable-gpu`
4. 确保系统已安装所有必需的运行库
5. 检查防火墙和杀毒软件设置