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
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DATABASE}`,
    ),
    SimulateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

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
