# VBA使用速览

## 一般设置

**显示开发工具**：`文件`-`选项`-`自定义功能区`-在“自定义功能区”下方勾选`开发工具`，即可在菜单中显示开发工具。

![选择开发工具](https://pic.imgdb.cn/item/65ab3e0e871b83018a854533.jpg)

**代码编辑基本设置**：在vba编辑器中，选择`工具`-`选项`，在“编辑器”标签栏的`自动语法检测`部分，把勾取消掉，就不会每次语法出问题就谈对话框了。

![关闭自动语法检测](https://pic.imgdb.cn/item/65ab3f8b871b83018a8a1433.jpg)

## 基本语法



## Excel的VB中使用正则表达式

需要处理的列大概长这样

```text
术前血压119/67mmHg     心率（99次／分）　　　血氧饱和度（99％） 
术中血压121/68mmHg     心率（101次／分）　　　血氧饱和度（98％）
术后血压113/64mmHg     心率（105次／分）　　　血氧饱和度（99％）
```

在excel中使用vb将其拆分为以下形式：

![excel拆分](https://pic.imgdb.cn/item/61227f1e44eaada739fa2e02.jpg)

所使用的vb语句如下：

```vb
Option Explicit

' 根据阶段和项目获取信息
Function getInfo(content As String, phase As String, item As String)
    Dim phaseString() As String, allInfo As String
    
    phaseString = VBA.Split(content, Chr(10))
    allInfo = ""
    If UBound(phaseString) = 3 Then
        If phase = "术前" Then
            allInfo = phaseString(1)
        ElseIf phase = "术中" Then
            allInfo = phaseString(2)
        ElseIf phase = "术后" Then
            allInfo = phaseString(3)
        End If
    ElseIf UBound(phaseString) = 2 Then
        If phase = "术前" Then
            allInfo = phaseString(0)
        ElseIf phase = "术中" Then
            allInfo = phaseString(1)
        ElseIf phase = "术后" Then
            allInfo = phaseString(2)
        End If
    End If
    
    Dim reg As Object, mc As Object, result As String
    Set reg = CreateObject("VBScript.RegExp")
    If item = "血压" Then
        reg.Pattern = "血[压](.+)?mm"
        Set mc = reg.Execute(allInfo)
        result = mc.item(0).submatches(0)
    ElseIf item = "心率" Then
        reg.Pattern = "（(\d+)?次／分"
        Set mc = reg.Execute(allInfo)
        result = mc.item(0).submatches(0)
    ElseIf item = "血氧饱和度" Then
        reg.Pattern = "（(\d+)?％"
        Set mc = reg.Execute(allInfo)
        result = mc.item(0).submatches(0)
    End If

    getInfo = result
End Function
```