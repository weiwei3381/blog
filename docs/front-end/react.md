# React实践

## React-router 路由

首先安装`npm install react-router-dom --save`

在`react-router-dom`中可以引用`Outlet`组件，当做插槽用

```tsx
// MainLayout.tsx

import React, { FC } from "react";
import { Outlet } from "react-router-dom";

const MainLayout: FC = () => {
  return (
    <>
      <div>MainLayout Header</div>
      <div>
        {/* 下面的是框架的插槽 */}
        <Outlet />
      </div>
      <div>MainLayout footer</div>
    </>
  );
};

export default MainLayout;
```


构建`router`路由

```tsx
import React, { FC } from "react";
import { createBrowserRouter } from "react-router-dom";

// 路由配置
// 先放公用组件Layout等，然后在Layout中在加入其他的
const routerConfig = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "*", element: <NotFound /> }, // 404路由，一般写在最后，没有匹配上兜底使用
    ],
  },
]);

export default routerConfig;
```

在App.tsx中使用路由

```tsx
import React, { FC } from "react";
import { RouterProvider } from "react-router-dom";
import routerConfig from "./router";

const App: FC = () => {
  return <RouterProvider router={routerConfig} />;
};

export default App;
```

## 初始化项目

初始化项目：`npx create-react-app jira --template typescript`

在`tsconfig.json`中配置`baseUrl`就可以解决相对路径的问题

使用[prettier](https://prettier.io/)进行代码格式化统一，使用`npm install --save-dev --save-exact prettier`安装依赖，在项目根目录使用`.prettierrc.json`进行配置，使用`.prettierignore`文件配置不需要格式化的文件，但是默认prettier是手动格式化的，可以借助[Pre-commit Hook](https://prettier.io/docs/en/precommit.html)进行自动格式化，然后再配置ESLint，因为prettier与ESLint有冲突

**规范git提交**：使用commitlint规范git提交。

**mook方案**：1. mock.js进行请求拦截，只支持ajax，不支持fetch。2. 接口管理工具，例如swagger，moco，yapi，rap，工具强大，配置复杂；3.json-server，配置简单，自定义高，无法自定义改api文档。

在开发和生产环境使用不同变量：`.env`是生产环境变量，`.env.development`是开发环境变量，在代码中使用`process.env.[变量名]`使用，在`npm start`时候使用开发环境，当`npm build`时使用生产环境

**RestAPI**：GET是查询，POST是增加，PUT是替换（全量替换），PATCH是修改（修改一部分）

符号`?.`，使用`[表达式].[属性]`时，如果表达式是undifined，这个代码会报错，可以将其改为`[表达式]?.[属性]`就不会报错了

使用模块`qs`，可以将一个对象转换成为url中的参数形式

使用`!!变量`可以将任意变量转换为布尔值，`变量*1`可以将string型数字转为数值型

在onchange事件中，会碰到输入一个汉字，提交很多个拼音的问题，类似下图这样。

![提交很多个拼音的问题](https://ftp.bmp.ovh/imgs/2021/09/8a4fee45f72d7b3d.png)

解决办法是使用类似于`debounce`函数

```js
const debounce = (func, delay) => {
    let timeout;
    return (...params) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function(){
            func(...params)
        }, delay)
    }

}
```

Typescript中不常见的数据类型，**tuple**是“数量固定，类型可以各不相同”的数组，**array**中的变量类型必须一致。unknown是严格版本的**any**，可以代替any。ts在很多情况下帮我们自动推断类型，所以有些情况下不需要声明类型。