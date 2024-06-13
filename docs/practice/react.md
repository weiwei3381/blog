# React实战

## 初始化react项目

使用 create-react-app 创建一个名为`react-demo`的TypeScript 项目，并引入 antd。

`npx create-react-app react-demo --template typescript`

安装完毕后使用`npm start`进入项目，此时浏览器会访问 http://localhost:3000/，看到 `Welcome to React` 的界面就算成功了。

然后引入antd，下面命令针对不同的包管理器：

```shell
npm install antd --save  # 针对npm
yarn add antd  # 针对yarn
pnpm install antd --save  # 针对pnpm
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
