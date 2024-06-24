# React+nestJS全栈开发

## 初始化react项目

使用 create-react-app 创建一个名为`react-demo`的TypeScript 项目，并引入 antd。

`npx create-react-app react-demo --template typescript`

安装完毕后使用`npm start`进入项目，此时浏览器会访问 http://localhost:3000/，看到 `Welcome to React` 的界面就算成功了。

然后引入antd，下面命令针对不同的包管理器：

```shell
npm install antd --save  # 针对npm
yarn add antd  # 针对yarn
pnpm install antd --save  # 针对pnpm

# 然后安装antd的图标
pnpm install @ant-design/icons --save  
```

修改 `src/App.tsx`，引入 antd 的按钮组件。

```tsx
import React， {FC} from "react";
import { Button, Select } from "antd";

const App: FC = () => {
  return (
    <div>
      <Button type="primary">提交</Button>
      <Select style={{ minWidth: "150px" }}></Select>
    </div>
  );
};

export default App;

```

保存之后就可以看效果了。

## 添加prettier支持

Prettier 是一个代码格式化工具，可以格式化代码，但不具备代码检查功能，使用方式：一是下载vscode中的 Prettier 插件，二是在项目中安装 `npm i prettier -D` ，然后在项目根目录下创建配置文件（`.prettierrc.js`）进行配置；如果两种方式都使用了，那么prettier配置文件的优先级首先是当前项目根目录下的配置文件；

prettier的配置项文件常见的一般都有两种格式：js或者json；
js后缀文件名为`.prettierrc.js`,写起来方便一点，不用给属性名添加双引号；
json后缀的文件名为`.prettierrc.json`，写起来比较繁琐，必须严格遵守json语法；

下面为常见配置：

```js
// 配置几个常用的就可以
module.exports = {
    // 一行最多多少个字符
    "printWidth": 150,
    // 指定每个缩进级别的空格数
    "tabWidth": 2,
    // 使用制表符而不是空格缩进行
    "useTabs": false,
    // 在语句末尾打印分号
    "semi": true,
    // 使用单引号而不是双引号
    "singleQuote": true,
    // 更改引用对象属性的时间 可选值"<as-needed|consistent|preserve>"
    "quoteProps": 'as-needed',
    // 在JSX中使用单引号而不是双引号
    "jsxSingleQuote": false,
    // 多行时尽可能打印尾随逗号。（例如，单行数组永远不会出现逗号结尾。） 可选值"<none|es5|all>"，默认none
    "trailingComma": 'es5',
    // 在对象文字中的括号之间打印空格
    "bracketSpacing": true,
    // jsx 标签的反尖括号需要换行
    "jsxBracketSameLine": false,
    // 在jsx中把'>' 是否单独放一行
    "bracketSameLine": false,
    // 在单独的箭头函数参数周围包括括号 always：(x) => x \ avoid：x => x
    "arrowParens": 'always',
    // 这两个选项可用于格式化以给定字符偏移量（分别包括和不包括）开始和结束的代码
    "rangeStart": 0,
    "rangeEnd": Infinity,
    // 指定要使用的解析器，不需要写文件开头的 @prettier
    "requirePragma": false,
    // 不需要自动在文件开头插入 @prettier
    "insertPragma": false,
    // 使用默认的折行标准 always\never\preserve
    "proseWrap": 'preserve',
    // 指定HTML文件的全局空格敏感度 css\strict\ignore
    "htmlWhitespaceSensitivity": 'css',
    // Vue文件脚本和样式标签缩进
    "vueIndentScriptAndStyle": false,
    // 换行符使用 lf 结尾是 可选值"<auto|lf|crlf|cr>"
    "endOfLine": 'lf'
};
```

## 添加css支持

### 增加classnames

安装`classnames`模块，可以方便根据逻辑增加或者改变react组件中的类名，`npm install classnames -S`

### 使用css module

即对css进行模块管理，每个css文件都当做单独的模块，命名为`xxx.module.css`，其目的就是为每个classname增加后缀名，不让他们重复，creat-react-app原生支持css module

在使用中如果出现`找不到模块“./MainLayout.module.css”或其相应的类型声明`类似的错误，可以在根目录增加文件`global.d.ts`
```ts
// global.d.ts

declare module "*.css";
declare module "*.scss";
```

然后在`tsconfig.json`中增加该文件引入。

```json
// tsconfig.json

"include": ["src", "./global.d.ts"]
```

### 使用sass

sass属于预处理css样式之一，使用前先安装`npm install sass -S`，然后就可以像使用model css一样使用了，只是命名规则换成了`XXX.module.scss`

## 数据管理

### 使用useContext和useReducer管理数据

以待办事项todoList应用为例

**第一步**，创建存储文件`store.ts`

```ts
// store.ts文件

import { nanoid } from "nanoid";

export type TodoType = {
  id: string;
  title: string;
};

// 初始状态
const initalState: TodoType[] = [
  { id: nanoid(5), title: "吃饭" },
  { id: nanoid(5), title: "睡觉" },
];

export default initalState;
```

**第二步**，创建`reducer.ts`

```ts
// reducer.ts文件

import { TodoType } from "./store";

export type ActionType = {
  type: string;
  payload?: any; // 附加的内容
};

// reducer就两个状态，分别是增加和删除
export default function reducer(state: TodoType[], action: ActionType) {
  switch (action.type) {
    case "add":
      return state.concat(action.payload);
    case "delete":
      return state.filter((todo) => todo.id !== action.payload);
    default:
      throw new Error();
  }
}

```

**第三步**，在`context.tsx`中使用`createContext`方法创建Context，其中需要传state和dispatch即可。

```ts
// context.tsx文件

import { createContext } from "react";
import initalState from "./store";
import { ActionType } from "./reducer";

export const todoContext = createContext({
  state: initalState,
  dispatch: (action: ActionType) => {},
});
```
**第四步**，在`index.tsx`中引入所有组件，然后引入`todoContext.Provider`将所有需要使用的组件都包住，传递的值就是`useReducer`导出去的`state`和`dispatch`。 

```tsx
// index.tsx文件

import React, { FC, useReducer } from "react";
import List from "./List";
import InputForm from "./InputForm";
import reducer from "./reducer";
import initalState from "./store";
import { todoContext } from "./context";

const TodoReducer: FC = () => {
  const [state, dispatch] = useReducer(reducer, initalState);
  return (
    <todoContext.Provider value={{ state, dispatch }}>
      <List />
      <InputForm />
    </todoContext.Provider>
  );
};

export default TodoReducer;
```

**第五步**，在react组件中使用Context获取state和dispatch，在待办事项使用效果如下：

![列表页](https://pic.imgdb.cn/item/666b1955d9c307b7e95fce21.png)

```tsx
// List.tsx  列表页，有删除按钮可以删除某个待办事项

import React, { FC, useContext } from "react";
import { todoContext } from "./context";

const List: FC = () => {
  // 通过useContext获取state和dispatch
  const { state, dispatch } = useContext(todoContext);

  // 删除待办事项的方法
  function del(id: string) {
    dispatch({
      type: "delete",
      payload: id,
    });
  }

  return (
    <p>
      <ul>
        {state.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <button
              onClick={() => {
                del(todo.id);
              }}
            >
              删除
            </button>
          </li>
        ))}
      </ul>
    </p>
  );
};

export default List;

```

在新增待办事项位置使用的代码如下：

```tsx
// InputForm.tsx文件，用于输入新增的待办事项

import React, { ChangeEvent, FC, useContext, useState } from "react";
import { todoContext } from "./context";
import { nanoid } from "nanoid";

const InputForm: FC = () => {
  // 通过useContext获取state和dispatch
  const { state, dispatch } = useContext(todoContext);
  const [value, setValue] = useState(""); // 令输入框为受控组件

  //  受控组件的onchange事件绑定组件
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  //   提交的事件
  function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    // 如果没有值则直接返回
    if (!value.trim()) return;
    const newTodo = {
      id: nanoid(5),
      title: value,
    };
    // 派发新增的reducer
    dispatch({
      type: "add",
      payload: newTodo,
    });
    setValue(""); // 清空输入框
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="input-new">你需要做什么工作</label>
      <br />
      <input
        id="input-new"
        type="text"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">增加#{state.length + 1}</button>
    </form>
  );
};

export default InputForm;

```
### 使用redux管理数据

还是以待办事项应用为例，完成后的样子如下图所示：

![待办事项](https://pic.imgdb.cn/item/666b1e9fd9c307b7e96979d0.png)

**第一步**，redux可以管理多类数据，首先定义数据类型，初始值，Slice分片（包括分片名称，reducer等）

```ts
// 文件位置：store/todoList.ts

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

// 定义单个待办事项的类型
export type TodoItemType = {
  id: string; // 待办事项id
  title: string; // 待办事项名称
  isComplete: boolean; // 待办事项是否完成
};

// 定义初始值
const INIT_STATE: TodoItemType[] = [
  {
    id: nanoid(5),
    title: "吃饭",
    isComplete: false,
  },
  {
    id: nanoid(5),
    title: "睡觉",
    isComplete: true,
  },
];

// 定义数据存储的分片
const todoListSlice = createSlice({
  name: "todoList",
  initialState: INIT_STATE,
  reducers: {
    // 增加待办的reducer，传入state和payload，其中payload需要传入泛型
    addTodo(state: TodoItemType[], action: PayloadAction<TodoItemType>) {
      return [action.payload, ...state];
    },
    // 删除待办的reducer
    removeTodo(state: TodoItemType[], action: PayloadAction<{ id: string }>) {
      const { id: removedId } = action.payload;
      return state.filter((todo) => todo.id !== removedId);
    },
    // 将待办事项在完成和未完成之间转换的reducer
    toggleCompleted(
      state: TodoItemType[],
      action: PayloadAction<{ id: string }>
    ) {
      const { id: toggleId } = action.payload;
      return state.map((todo) => {
        if (todo.id !== toggleId) return todo;
        return {
          ...todo,
          isComplete: !todo.isComplete,
        };
      });
    },
  },
});

// 导出action
export const { addTodo, removeTodo, toggleCompleted } = todoListSlice.actions;
// 导出reducer
export default todoListSlice.reducer;
```

**第二步**，定义redux存储的Store。
```tsx
// 文件位置：store/store.ts

import { configureStore } from "@reduxjs/toolkit";
import countReducer from "./count";
import todoReducer, { TodoItemType } from "./todoList";

// 定义不同Slice使用的类型，名称也要与Slice中的名称保持一致
export type StateType = {
  count: number;
  todoList: TodoItemType[];
};

// 定义存储，其中reducer中传入的todoList是分片的名称，todoReducer是从Slice中导出来的
export default configureStore({
  reducer: {
    count: countReducer,
    todoList: todoReducer,
  },
});

```

**第三步**，在TodoList组件中使用redux

```tsx
// 文件位置：TodoList.tsx

import React, { FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { nanoid } from "nanoid";
import { StateType } from "./store/store";
import { TodoItemType } from "./store/todoList";
import {
  addTodo,
  toggleCompleted,
  removeTodo,
} from "./store/todoList";


const TodoList: FC = () => {
  const [value, setValue] = useState(""); // 受控组件使用的value
  
  // 使用redux中的变量需要使用useSelector的查询hook，由于查询后得到的值为unknown，所以需要as定一下类型
  const todoList = useSelector<StateType>(
    (state) => state.todoList
  ) as TodoItemType[];

  // 通过useDispatch的hook获取dispatch函数
  const dispatch = useDispatch();

  return (
    <>
      <p>Todo List Demo</p>
      <ul>
        {todoList.map((todo) => (
          <>
            <li
              style={{ textDecoration: todo.isComplete ? "line-through" : "" }}
              key={todo.id}
              onClick={() => {
                // 转换是否完成reducer，payload传入id即可
                dispatch(toggleCompleted({ id: todo.id }));
              }}
            >
              {todo.title}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // 删除则派发删除的reducer，payload传入id
                  dispatch(removeTodo({ id: todo.id }));
                }}
              >
                x
              </button>
            </li>
          </>
        ))}
      </ul>
      <input value={value} onChange={(e) => setValue(e.target.value)} />

      <button
        onClick={() => {
          dispatch(
            // 增加待办的reducer，传入新的待办事项
            addTodo({
              id: nanoid(5),
              isComplete: false,
              title: value,
            })
          );
          setValue("");
        }}
      >
        增加
      </button>
    </>
  );
};

export default TodoList;

```

**最后**，在app.tsx中使用provider包裹下层组件

```tsx
文件：app.tsx

import { Provider } from "react-redux";
import store from "./store/store";
import TodoList from "./TodoList";

const App: FC = () => {
  return (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
};

export default App;
```
## 创建前端Mock项目

在后端还没有对接前，可使用node.js创建前端Mock项目，对接相应的api。

### 设置统一的API

返回值统一为json格式，主要有3个内容：
1. **errno**，数值型，表示错误编号，这个必须有，该值为0表示没有发生错误
2. **data**，表示返回数据，any类型
3. **msg**，表示错误信息，string类型
实例如下:

```ts
// 返回值情况

// 1.正常返回值情况
{
  errno: 0,
  data: {id: 1001}
}
// 2.出现错误情况
{
  errno: 1001,
  msg: "登陆时必须输入用户名和密码"
}

```

### 创建mock api内容

**第一步**，新建node.js项目，使用`npm init -y`初始化package.json，然后使用命令`npm install mockjs -S`安装[mock.js](http://mockjs.com/)，mockjs的主要作用是生成随机数据。

然后再创建mock的api方法，新建mock的文件夹，里面每个文件导出对应的api方法，然后在`mock/index.js`中合并导出，使得能够灵活扩展，例如`test.js`方法：

```js
// mock/test.js

const Mock = require("mockjs");  // 引入mockjs
// 导出数组，其中每个对象都是一个api，包括url，method和返回值
module.exports = [
  {
    url: "/api/test",
    method: "get",
    response() {
      return {
        errno: 0,
        data: { name: Mock.Random.cname() },
      };
    },
  },
];

```

例如`history.js`文件：

```js
// mock/history.js

const Mock = require("mockjs");
const Random = Mock.Random;

module.exports = [
  {
    url: "/api/history/:id", // 获取历史实验记录
    method: "get",
    response() {
      return {
        errno: 0,
        data: {
          id: Random.id(),
          simulateTime: Random.date(),
          title: Random.ctitle(),
        },
      };
    },
  },
  {
    url: "/api/history",  // 用post情况获取id
    method: "post",
    response() {
      return {
        errno: 0,
        data: {
          id: Random.id(),
        },
      };
    },
  },
];
```

然后再在mock文件夹中创建`index.js`文件，用来合并所有mock api。

```js
// mock/index.js
const test = require("./test");
const history = require("./history");

// 把所有的mock api合并成一个数组
const mockList = [...test, ...history];

module.exports = mockList;

```

### 安装koa服务器

使用`npm install koa koa-router -S` 安装相应库。

然后在根目录创建`index.js`,里面的内容如下：

```js
// index.js

const Koa = require("koa");
const Router = require("koa-router");
const mockList = require("./mock");

const app = new Koa();
const router = new Router();

// 定义异步函数用来模拟网络请求延时
async function getRes(fn) {
  return new Promise((resolve) => {
    // 使用setTimeout函数延时1秒执行
    setTimeout(() => {
      const res = fn();
      resolve(res);
    }, 1000);
  });
}

// 遍历mock的每一项
mockList.forEach((mock) => {
  // 取出mock的网址、方法和响应函数
  const { url, method, response } = mock;
  // 在router中拿到对应的方法，如get， post等，然后传递函数
  router[method](url, async (ctx) => {
    const res = await getRes(response); // 延时拿到响应
    ctx.body = res; // 将响应赋给上下文的body中
  });
});

app.use(router.routes());
app.listen(3001); // koa监听3001端口，注意不要与react的3000端口重复
```

### 启动服务器

安装nodemon， `npm install nodemon --save-dev`，nodemon会监听js文件中的修改并自动重启服务器。然后在`package.json`中增加一条命令用nodemon启动index.js，代码如下：
```json
// package.json

  "scripts": {
    "dev": "nodemon index.js"
  },
```

然后在命令行中使用`npm run dev`即可启动服务器，浏览器可以直接测试get方式的请求，但是，对于post方法的请求，需要使用第三方工具例如[postman](https://www.postman.com/)进行测试。

### 使用devserver代理解决跨域问题

使用`craco.js`解决跨域问题，[craco](https://github.com/dilanx/craco)是一个对于create-react-app项目的配置覆盖工具，在前端项目中运行`npm i -D @craco/craco`进行安装。

然后安装说明步骤，首先在项目根目录新建`craco.config.js`的配置文件，然后在前端项目（不是mock服务器项目）的`package.json`文件中，把start、build和test的`react-scripts`改为`craco`，如下图所示：

![修改craco的package.json设置](https://pic.imgdb.cn/item/666fc277d9c307b7e9cc542d.png)

然后在`craco.config.js`写入下面内容，目的是确保所有以`/api`开头的api都能使用mock服务的3001端口进行：

```js
// craco.config.js

module.exports = {
  devServer: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
};
```

这时，在项目中使用fetch 就可获得mock数据：

```ts
  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => {
        console.log("data:", data);
      });
  }, []);
```

### 安装axios获取mock数据

[axios](https://www.axios-http.cn/)是一个node.js的网络请求库，使用`npm install axios -S`进行安装，然后就可以使用了。下面是使用axios的实例：

```ts
import axios from "axios";

axios.get("/api/test").then((res) => {
  console.log("axios data:", res.data);
});

```

在项目中，可以新建`services`的文件夹，下面新建`ajax.ts`的文件，用于所有使用的axios实例：

```ts
// services/ajax.ts

import { message } from "antd";
import axios from "axios";

// 创建axios的实例，设置超时时间为10秒
const instance = axios.create({
  timeout: 10 * 1000,
});

// 定义返回值类型
export type ResType = {
  errno: number;
  data?: ResDataType;
  msg?: string;
};

// 定义返回值中的数据类型
export type ResDataType = {
  [key: string]: any;
};

// 统一为响应设置拦截器，
instance.interceptors.response.use((res) => {
  const resData = (res.data || {}) as ResType; // 将返回值设置为统一类型
  const { errno, data, msg } = resData;

  // 如果错误类型不等于0，则说明有错误发生
  if (errno !== 0) {
    if (msg) {
      // 用antd的message控件显示错误信息
      message.error(msg);
    }
    // 抛出错误信息
    throw new Error(msg);
  }
  // 如果没有错误，则应该有data，则返回data， 由于拦截器要求返回值为any，所以需要重新设置为any类型
  return data as any;
});

// 默认导出axios的实例
export default instance;

```

使用该实例也比较简单，以history页面api为例：

```ts
import axios, { ResDataType } from "./ajax";

export async function getHistoryService(id: string): Promise<ResDataType> {
  const url = `/api/history/${id}`; // 拼接目标url
   // 获取结果数据, 其中axios.post方法已经被拦截器拦截过一次了
  const data = (await axios.post(url)) as ResDataType;
  return data;
}

```

## 使用nest.js搭建node.js后端

### 创建nest项目

使用下面命令创建nest项目，默认为typescript项目，如果需要开启typescript项目的严格模式，则需要将`--strict`传递给`nest new`命令。

```shell
npm i -g @nestjs/cli
nest new project-name
```

安装完成后，使用`npm run start:dev`启动开发模式，修改后自动重启生效。

### 创建模块

在命令行中使用`nest g module simulate`创建模块，然后在入口模块文件`app.module.ts`中能看到`imports: [SimulateModule],`

然后使用`nest g controller simulate --no-spec`安装simulate模块对应的控制器，且不生成测试文件

使用`nest g service simulate --no-spec`生成simulate模块对应的服务

### 路由设置

在`simulate.controller.ts`中，修改下面代码：

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('simulate')
export class SimulateController {
  @Get()  // get请求
  findAll() {
    // 使用`http://localhost:3005/simulate`返回该内容
    return {
      list: ['a', 'b', 'c'],
      count: 10,
    };
  }

  @Get('test')
  getTest(): string {
    // 使用`http://localhost:3005/simulate/test`返回该内容
    return 'simulate test';
  }
}
```

在`main.ts`中可以修改端口号和设置全局前缀

```ts
// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 全局前缀，即在所有的路由前面都加上api/
  await app.listen(3005); // 设置监听的端口号
}
bootstrap();
```

#### 获取路由参数

为了获取浏览器带过来的形如"?keyword=123&type=4"的参数。

```ts
// simulate.controller.ts

import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { SimulateDto } from './dto/simulate.dto';

@Controller('simulate')
export class SimulateController {
  // 获取网址中形如"?keyword=aaa&page=123"的参数，使用@Query('参数名')
  @Get()
  findAll(
    @Query('keyword') k1: string, // 获取keyword参数，赋给keyword变量
    @Query('page') page: number, // 获取type参数，并赋给type变量
  ) {
    return {
      page: page,
      keyword: k1,
      list: ['a', 'b', 'c'],
      count: 10,
    };
  }

  // 获取网址中形如"simulate/xxx"中的xxx的参数，使用@Param
  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      id,
      title: 'aaa',
    };
  }

  // 获取patch更新中的body内参数，需要先创建对应的dto文件，然后通过对应到dto上去获取
  // 获取的方式是@Body
  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() simulateDto: SimulateDto) {
    console.log('simulateDto', simulateDto);
    return {
      id,
      title: 'aaa',
      desc: 'bbb',
    };
  }
}
```

测试body内的参数时，使用postman的对应方法，然后选择body里面“raw”，格式选择“json”，直接在下面写json内容。

#### 统一路由返回格式

为了将返回格式统一为下面格式：
```
{
  "errno": "表示错误代码，number类型，0表示无错误",
  "data": "表示正常返回的数据",
  "msg": "表示错误时的消息"
}
```
需要使用拦截器和过滤器。

**第一步**，创建nest拦截器transform：`nest g interceptor transform`，然后找到对应的`transform`文件夹下的`transform.interceptor.ts`文件,修改为：

```ts
// transform/transform.interceptor.ts

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // 当data存在时，那表明为正常返回格式，
        // 需要加上errno=0，并且将内容包在data中
        return {
          errno: 0,
          data,
        };
      }),
    );
  }
}

```

然后在`main.ts`中增加拦截器内容

```ts
// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局前缀，即在所有的路由前面都加上api/
  app.setGlobalPrefix('api');
  // 全局拦截器，当正常返回数据时统一返回格式
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3005); // 设置监听的端口号
}
bootstrap();

```

**第二步**，创建过滤器http-exception, `nest g filter http-exception`，会在`http-exception`文件夹下创建`http-exception.filter.ts`文件。

```ts
// http-exception/http-exception.filter.ts

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

// http错误的全局过滤器
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // 获取错误消息，默认为服务器错误
    const message = exception.message || '服务器错误';
    // 设定返回值，错误时默认errno为-1，日期和网址路径先留着
    response.status(status).json({
      errno: -1,
      msg: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

然后还需要在`main.ts`中增加一行全局过滤器

```ts
// main.ts（只显示新增部分）

import { HttpExceptionFilter } from './http-exception/http-exception.filter';

// 全局过滤器，当抛出异常时统一返回格式
app.useGlobalFilters(new HttpExceptionFilter());
```

测试错误时，可以使用下面代码：

```ts
// simulate\simulate.controller.ts（新增内容）

import {HttpException, HttpStatus} from '@nestjs/common';

// 测试错误代码
@Get('test')
getTest(): string {
  throw new HttpException('自定义错误', HttpStatus.BAD_REQUEST);
}
```

### 使用mongodb数据库

可以按照[教程](https://www.runoob.com/mongodb/mongodb-window-install.html)安装mongodb服务，然后记得要安装mongodb的GUI数据库管理软件mongodb compass，进入之后创建数据库database和collection。

为了将mongodb集成到nest.js中去，可以参考nest的文档，里面有一章是专门讲mongo的，首先安装相关依赖：`npm i @nestjs/mongoose mongoose`，然后在`app.module.ts`中增加下面代码：

```ts
// app.module.ts

import { MongooseModule } from '@nestjs/mongoose';

// 其中尽量写ip地址而不是localhost,加上默认的端口，然后humanDB是需要连接的数据库名称
@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/humanDB')]
})
```

### 将设置抽离出单独的配置

文档地址在[nestjs的配置地址](https://docs.nestjs.com/techniques/configuration)，安装配置所需的依赖：`npm i --save @nestjs/config`，

然后在`app.module.ts`中增加

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}
```

然后在根目录下新建文件`.env`，内容如下：
```shell
MONGO_HOST=127.0.0.1
MONGO_PORT=27017
MONGO_DATABASE=humanDB
```

然后在代码中就可以使用`process.env.MONGO_PORT`来引入`27017`这个端口了，改造后的`app.module.ts`如下：

```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SimulateModule } from './simulate/simulate.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`,
    ),
    SimulateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

### 增加schemas

参考[mongodb设置页面](https://docs.nestjs.com/techniques/mongodb)，首先新建`schemas`文件夹，然后建立`simulate.schema.ts`文件如下：

```ts
// simulate.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SimulateDocument = HydratedDocument<Simulate>;

@Schema({
  timestamps: true, // 记录时间戳,包括更新时间updatedAT和创建时间createdAt
})
export class Simulate {
  // 设置为必填属性
  @Prop({ required: true })
  title: string;

  @Prop()
  desc: string;

  //   其他字段待补充
}

export const SimulateSchema = SchemaFactory.createForClass(Simulate);

```

然后在`simulate.module.ts`中，增加相关内容

```ts
// simulate/simulate.module.ts

import { MongooseModule } from '@nestjs/mongoose';
import { Simulate, SimulateSchema } from './schemas/simulate.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Simulate.name, schema: SimulateSchema }])],
  controllers: [SimulateController],
  providers: [SimulateService],
})
export class SimulateModule {}
```

之后在humanDB数据库中就能看到`simulates`的集合了。

### 使用service对数据进行增删改查

在`simulate.service.ts`改成下面形式，service主要是采用控制反转和依赖注入的方式，跟java的框架spring很像，不过它采用的方式是在`constructor`方法内部利用传参的方式注入依赖。

```ts
// simulate/simulate.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Simulate } from './schemas/simulate.schema';
import { Model } from 'mongoose';

@Injectable()
export class SimulateService {
  constructor(
    // 依赖注入，注入Simulate数据
    @InjectModel(Simulate.name) private readonly simulateModel: Model<Simulate>,
  ) {}

  // 新增数据
  async create() {
    const simulate = new this.simulateModel({
      title: 'title' + Date.now(),
      desc: 'desc',
    });

    return await simulate.save();
  }

  // 查找单个数据
  async findOne(id: string) {
    return this.simulateModel.findById(id);
  }

  // 查找指定元素并删除
  async delete(id: string) {
    return await this.simulateModel.findByIdAndDelete(id);
  }

  async update(id: string, updateData: any) {
    return await this.simulateModel.updateOne({ _id: id }, updateData);
  }

  // 查找所有
  // 结构数据并赋予默认值
  async findAllList({ keyword = '', page = 1, pageSize = 10 }) {
    const whereOpt: any = {}; // 自定义搜索条件
    // 如果关键词有值，则搜索title内容
    if (keyword) {
      const reg = new RegExp(keyword, 'i'); // 用正则表达式搜索
      whereOpt.title = { $regex: reg }; // 标题增加正则表达式用于模糊搜索
    }
    return await this.simulateModel
      .find(whereOpt)
      .sort({ _id: -1 }) // 按照id逆序排序，其中mongodb的id值为_id
      .skip((page - 1) * pageSize) // 分页，即跳过前几条
      .limit(pageSize); // 限制只显示pageSize内容
  }

  async countAll({ keyword = '' }) {
    const whereOpt: any = {}; // 自定义搜索条件
    // 如果关键词有值，则搜索title内容
    if (keyword) {
      const reg = new RegExp(keyword, 'i'); // 用正则表达式搜索
      whereOpt.title = { $regex: reg }; // 标题增加正则表达式用于模糊搜索
    }
    // 求出所有的数量
    return await this.simulateModel.countDocuments(whereOpt);
  }
}


```

然后在控制器controller中也可以使用类似的方式注入service方法，就可以使用service中的方法

```ts
// simulate/simulate.controller.ts

import { Body, Controller, Get, Param, Patch, Query, Post, Delete } from '@nestjs/common';
import { SimulateDto } from './dto/simulate.dto';
import { SimulateService } from './simulate.service';

@Controller('simulate')
export class SimulateController {
  // 在constructor方法中，注入对应所需的service
  constructor(private readonly simulateService: SimulateService) {}

  // 利用post方法新增数据
  @Post()
  async create() {
    // 调用service的新增数据方法，在数据库中新增数据内容
    return await this.simulateService.create();
  }

  // 获取网址中形如"?keyword=aaa&page=123"的参数，使用@Query('参数名')
  @Get()
  async findAll(
    @Query('keyword') keyword: string, // 获取keyword参数，赋给keyword变量
    @Query('page') page: number, // 获取type参数，并赋给type变量
    @Query('pageSize') pageSize: number, // 获取type参数，并赋给type变量
  ) {
    // 获得某页的list
    const list = await this.simulateService.findAllList({ keyword, page, pageSize });
    // 获得结果的总数
    const count = await this.simulateService.countAll({ keyword });

    return {
      list,
      count,
    };
  }

  // 获取网址中形如"simulate/xxx"中的xxx的参数，使用@Param
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // 调用service的根据id找对象的方法
    return await this.simulateService.findOne(id);
  }

  // 获取patch更新中的body内参数，需要先创建对应的dto文件，然后通过对应到dto上去获取
  // 获取的方式是@Body
  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() simulateDto: SimulateDto) {
    return await this.simulateService.update(id, simulateDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return await this.simulateService.delete(id);
  }
}


```

### 创建user模块

使用下面命令创建模块
```bash
nest g module user
nest g service user --no-spec
nest g controller user --no-spec
```

**第一步**，增加schema
```ts
// user\schemas\user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  // 设置为必填属性，且不同相同
  @Prop({ required: true, unique: true })
  username: string; // 用户名

  @Prop({ required: true })
  password: string; // 密码

  @Prop()
  nickname: string; // 昵称
}

export const UserSchema = SchemaFactory.createForClass(User);
```

**第二步**，修改model文件，加入schema文件

```ts
// user/user.module.ts

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}

```

**第三步**，将schema中的User注入到service文件之中，然后写相关数据库方法

```ts
// user\user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  // 依赖注入user模型
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(userData: CreateUserDto) {
    const newUser = new this.userModel(userData);
    return await newUser.save();
  }

  // 根据用户名和密码找到对应的用户
  async findOne(username: string, password: string) {
    return await this.userModel.findOne({ username, password });
  }
}
```

第四步，写路由对应的方法，由于在创建用户的实话需要用post方法在body中传输数据，所以还需要写对应的dto文件

```ts
// user\dto\create-user.dto.ts

export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly nickname?: string; // 用户昵称可以没有
}
```

然后写对应的路由方法：

```ts
import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  // 依赖注入，注入用户service
  constructor(private readonly userService: UserService) {}

  // 创建用户的方法
  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    try {
      // 尝试创建用户，如果出现错误则抛出
      return await this.userService.create(userDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
```

### 创建auth模块

auth模块需要使用userService中的功能，因此需要在之前创建的UserModule中，把UserService给export出去。

```ts
// src\user\user.module.ts

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  exports: [UserService],  // 将UserService导出出去
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}

```

在auth.module.ts中引入对应的module
```ts
// src\auth\auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule], // 引入UserModule
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

```

然后在src\auth\auth.service.ts中写相关的数据库操作代码

```ts
// src\auth\auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  // 依赖注入userService
  constructor(private readonly userService: UserService) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findOne(username, password);
    // 找不到用户，则抛出异常
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 下面代码主要解决返回值带密码的问题
    // user是数据库数据，用toObject方法获取他的原始数据
    // 然后结构对象，分成password属性和其他属性，只返回其他属性
    const { password: p, ...userInfo } = user.toObject(); // eslint-disable-line

    return userInfo; // 不返回password字段
  }
}

```

在controller路由中使用对应的功能

```ts
// src\auth\auth.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  // 依赖注入authService模块
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() userInfo: CreateUserDto) {
    const { username, password } = userInfo;

    return await this.authService.signIn(username, password);
  }
}

```

### 使用JWT功能

在官网的[鉴权](https://docs.nestjs.com/security/authentication)部分，首先安装对应的模块`npm install @nestjs/jwt -S`。

首先更新AuthModule以导入新的依赖项并配置JwtModule

```ts
// src\auth\auth.module.ts

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    UserModule,
    // 增加Jwt Module
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' }, // jwt过期时间
    }),
  ], // 引入UserModule
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
```

其中`jwtConstants`需要新建一个常量文件，把jwt相关的常量放进去

```ts
// src\auth\constants.ts

// 鉴权内容的常量
export const jwtConstants = {
  secret: '123@abc',  // jwt token的密钥
};
```

Service内容修改如下：

```ts
// src\auth\auth.service.ts 

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // 依赖注入userService和jwtService
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findOne(username, password);
    // 找不到用户，则抛出异常
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 下面代码主要解决返回值带密码的问题
    // user是数据库数据，用toObject方法获取他的原始数据
    // 然后结构对象，分成password属性和其他属性，只返回其他属性
    // 不返回password字段
    const { password: p, ...userInfo } = user.toObject(); // eslint-disable-line

    return {
      // 将用户内容使用jwt加密成token，并返回给客户端
      token: this.jwtService.sign(userInfo),
    };
  }
}
```

在其他接口，如果要校验用户的token，则可以新建guard文件，进行统一校验，校验成功后，会把用户信息放到request的user属性中去。

```ts
// src\auth\auth.guard.ts

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // 获取http的request
    const token = this.extractTokenFromHeader(request); // 获取包裹在header中的token
    // 如果没有token则返回未授权错误
    if (!token) {
      throw new UnauthorizedException('用户未登录');
    }
    try {
      // 用jwt对传入的token进行验证，解密后的payload就是之前传入的userInfo
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 把用户信息userInfo放到请求的‘user’中去了
      request['user'] = payload; // 实际得到的是userInfo
    } catch {
      throw new UnauthorizedException('登录信息无效');
    }
    return true;
  }

  // 从headers中抽取jwt token
  private extractTokenFromHeader(request: Request): string | undefined {
    // 在headers中的authorization字段值，按照空格进行拆分，取Bearer后面的值
    // ??表示的意思与||很像，只是不会把0排除掉，例如0||5返回5，而0??5返回0
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

```

在接口文件中，通过增加`@UseGuards(AuthGuard)`让相关接口跑token鉴权的代码，会把鉴权的结果自动附在请求Request的user属性上，然后通过`@Request() req` 拿到请求的req，将user可以打印出来。

```ts
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  // 依赖注入authService模块
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() userInfo: CreateUserDto) {
    const { username, password } = userInfo;

    return await this.authService.signIn(username, password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    // 打印请求上面附加的user情况
    return req.user;
  }
}
```

### 增加全局验证

当前验证方式必须要在每个需要验证的路由上增加`@UseGuards(AuthGuard)`，但是在大多数情况下都是反过来，即默认需要验证登录信息，只有部分路由需要不验证，那么设置如下。

首先，修改`auth.module.ts`文件，增加providers中的设置，确保每个路由都跑`AuthGuard`方法

```ts
// src\auth\auth.module.ts（部分修改）

import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

providers: [
  AuthService,
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
  ],
```
然后，自定义`Public`装饰器，在不需要登录验证的路由上增加该装饰器即可。在`auth`中新增`decorators`文件夹，新增`public.decorator.ts`装饰器。

```ts
// auth\decorators\public.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
// 装饰器命名规则为都字母大写，自定义Public装饰器，用来声明哪些路由不需要走鉴权流程
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

```


然后，修改`auth.guard.ts`，对于所有带public的路由不进行验证。

```ts
// src\auth\auth.guard.ts(部分修改)

import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取isPublic的值
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 如果当前路由是public，则不需要走下面的鉴权流程了
      return true;
    }

    const request = context.switchToHttp().getRequest(); // 获取http的request
    const token = this.extractTokenFromHeader(request); // 获取包裹在header中的token
    // 如果没有token则返回未授权错误
    if (!token) {
      throw new UnauthorizedException('用户未登录');
    }
    try {
      // 用jwt对传入的token进行验证，解密后的payload就是之前传入的userInfo
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 把用户信息userInfo放到请求的‘user’中去了
      request['user'] = payload; // 实际得到的是userInfo
    } catch {
      throw new UnauthorizedException('登录信息无效');
    }
    return true;
  }
}
```

如果某些路由不需要验证，则在路由上增加`@Public()`即可，例如登录路由：

```ts
  @Public()
  @Post('login')
  async login(@Body() userInfo: CreateUserDto) {
    const { username, password } = userInfo;

    return await this.authService.signIn(username, password);
  }
```

在其他路由上使用传入的用户信息时，以创建simulate实验数据为例，先在`simulate.schema.ts`文件中增加`author`属性

```ts
// src\simulate\schemas\simulate.schema.ts（部分修改）

 @Prop()
  author: string; // 作者
```
在Service中增加数据库使用用户名的内容。

```ts
// src\simulate\simulate.service.ts（部分修改）

  // 新增数据
  async create(username: string) {
    const simulate = new this.simulateModel({
      title: 'title' + Date.now(),
      desc: 'desc',
      author: username,
    });

    return await simulate.save();
  }
```

在controller中增加使用场景

```ts
// src\simulate\simulate.controller.ts（部分修改）

// 利用post方法新增数据
@Post()
async create(@Request() req) {
  const { username } = req.user; // 获取用户信息
  // 调用service的新增数据方法，在数据库中新增数据内容
  return await this.simulateService.create(username);
}
```



## React Router

安装`react-router-dom`的 4.0 版本, 4.0 版本不需要路由配置, 一切皆组件.react-router 是基础包, dom 包会安装基础包.

`react-router-dom`核心用法有:

- `HashRouter`和`BrowserRouter`
- `Router`: `path`, `exact`, `component`, `render`, 加上 exact 表示精准匹配`<Router exact path="/`>
- `NavLink`, `Link` 导航用, 使用 to 属性可以跳转, to 也可以传对象
- `Switch`, 用`Switch`只会匹配到第一个, 否则会找到所有符合要求的 Link
- `Redirect`, 重定向

HashRouter 是用"#"开头, 没有#开头则是浏览器 Router, Router 是路由, Route 是下面的子节点.

![Router用法](https://s1.ax1x.com/2020/04/07/G6LGRg.png)

## 使用

1. 混合组件化开发, 组件和 link 都在同一页面

```jsx
import {HashRouter, Route, Link, Switch} from 'react-router-dom'
import Main from other

export Home = () => {
    return (
        <HashRouter>
            <Link to="/">Home</Link>
        </HashRouter>
    )
    // 混合组件化开发
    <Switch>
        <Route exact={true} path="/" component={Main}>
    </Switch>
}
```

也可以采用配置开发, 先配置导航, 然后在需要显示的地方用{this.props.children}代替, 然后在 Router 节点的子节点写上导航节点, 然后内容写上各个子节点.
![混合式开发导航页面写法](https://s1.ax1x.com/2020/04/07/GcCE7Q.png)
![混合式开发Router写法](https://s1.ax1x.com/2020/04/07/GcCSfI.png)

可以使用`/:value`获取变量, 然后在组件中使用`this.props.match.value`可以获取到值. 如果不加在`Route`中不加`path`属性, 则可以创建`NoMatch`页面保证所有访问不到的页面都路由到 404 页面, 一般这种路由放到最后一个, 保证找不到页面的时候才跳转。

实现主页面的平级关系, 将所有的路由都包裹在`<App>`中, App 中使用`this.props.children`显示所有内容.

路由嵌套一般使用`render`属性进行, `render`接收一个函数, 返回一个组件, 返回组件又可以再进行判断, 例如 `render={()=><Router></Router>}`。
