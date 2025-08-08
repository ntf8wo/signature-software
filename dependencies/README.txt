Windows 7 运行依赖库说明
====================

为了确保互动签名系统在 Windows 7 上正常运行，可能需要以下依赖库。
注意：大多数现代 Windows 7 系统已经预装了这些组件，只有在出现运行问题时才需要手动安装。

可能需要的依赖库：
----------------

1. .NET Framework 4.6 或更高版本
   - 重要性：高（Electron 应用必需）
   - 大多数 Windows 7 SP1 系统已预装
   - 如果缺失，可从以下地址下载：
     https://dotnet.microsoft.com/download/dotnet-framework/net46

2. Visual C++ 2015-2019 Redistributable (x86)
   - 重要性：中（Electron 主要依赖）
   - 文件名：vc_redist.x86.exe
   - 可从以下地址下载：
     https://support.microsoft.com/zh-cn/help/2977003/the-latest-supported-visual-c-downloads

3. Visual C++ 2013 Redistributable (x86)
   - 重要性：低（某些原生模块可能需要）
   - 文件名：vcredist_2013_x86.exe
   - 可从以下地址下载：
     https://support.microsoft.com/zh-cn/help/4032938/update-for-visual-c-2013-redistributable-package

4. Visual C++ 2012 Redistributable (x86)
   - 重要性：低（较少使用）
   - 文件名：vcredist_2012_x86.exe
   - 可从以下地址下载：
     https://www.microsoft.com/zh-cn/download/details.aspx?id=30679

5. Visual C++ 2010 Redistributable (x86)
   - 重要性：低（非常旧的依赖）
   - 文件名：vcredist_2010_x86.exe
   - 可从以下地址下载：
     https://www.microsoft.com/zh-cn/download/details.aspx?id=26999

项目创建者操作指南：
------------------

1. 下载常用依赖库：
   - 重点下载 .NET Framework 4.6 和 Visual C++ 2015-2019 Redistributable
   - 这两个是最常需要的组件

2. 将下载的安装包放入此目录（dependencies）：
   - vc_redist.x86.exe （Visual C++ 2015-2019）
   - NDP46-KB3045557-x86-x64-AllOS-ENU.exe （.NET Framework 4.6）

3. 如果包含这些文件，安装程序会尝试自动安装它们

用户安装说明：
------------

1. 首先尝试直接运行安装程序
2. 如果程序正常运行，无需额外操作
3. 如果出现错误或程序无法启动：
   a. 检查 Windows 7 是否已更新到 SP1
   b. 手动安装 .NET Framework 4.6
   c. 手动安装 Visual C++ 2015-2019 Redistributable
   d. 重新启动计算机
   e. 再次尝试运行程序

故障排除：
-------

常见错误及解决方案：

1. "无法启动此程序，因为计算机中丢失 api-ms-win-crt-runtime-l1-1-0.dll"
   - 解决方案：安装 Visual C++ 2015-2019 Redistributable

2. "无法找到指定模块"
   - 解决方案：安装对应的 Visual C++ Redistributable

3. 白屏或程序启动后无响应
   - 解决方案：确认已安装 .NET Framework 4.6

4. "应用程序无法正常启动(0xc000007b)"
   - 解决方案：安装所有版本的 Visual C++ Redistributable (x86)

注意事项：
-------

1. 所有依赖库都需要安装 x86 (32位) 版本，即使您的系统是 64 位
2. 安装依赖库通常需要管理员权限
3. 安装完成后，建议重启计算机以确保所有组件正确加载
4. 如果问题仍然存在，请查看应用程序日志或联系技术支持