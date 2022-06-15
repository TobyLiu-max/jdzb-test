import React, { useState } from 'react'
import { Menu, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import './App.css'

const initData = [
  {
    key: 'sub1', label: 'Navigation Two', children: [
      {
        key: '5', label: "Option 5"
      },
      {
        key: '6', label: "Option 6"
      },
      {
        key: '7', label: "Option 7"
      }
    ]
  },
  {
    key: 'sub2', label: 'Navigation Three', children: [
      {
        key: '10', label: "Option 10"
      },
      {
        key: '11', label: "Option 11"
      },
      {
        key: '12', label: "Option 12"
      }
    ]
  }
]

// 根据选中的侧边栏的 key，找到对应的 label
const findLabel = (items, keyPath) => {
  function find(data, keyPath) {
    const key = keyPath.pop()
    for (let i = 0; i < data.length; i++) {
      if (key === data[i].key) {
        if (data[i].children && data[i].children.length > 0) {
          return find(data[i].children, keyPath)
        } else {
          return data[i].label
        }
      }
    }
  }
  return find(items, [...keyPath])
}

// 修改当前选中侧边栏的label
const setMenuItems = (items, inputData) => {
  const { keyPath, value } = inputData
  function find(data, keyPath) {
    const key = keyPath.pop()
    for (let i = 0; i < data.length; i++) {
      if (key === data[i].key) {
        if (data[i].children && data[i].children.length > 0) {
          return find(data[i].children, keyPath)
        } else {
          data[i].label = value
        }
      }
    }
  }
  find(items, [...keyPath])
  return items
}

const rootSubmenuKeys = ['sub1', 'sub2'];

const App = () => {
  const [items, setItems] = useState(initData)
  const [inputData, setInputData] = useState({ keyPath: [], value: '' })
  const [openKeys, setOpenKeys] = useState([]);
  const [menuKeys, setMenuKeys] = useState({
    key: 1,
    defaultOpenKeys: [],
    defaultSelectedKeys: []
  })

  const onClick = (e) => {
    const lable = findLabel(items, e.keyPath)
    setInputData({ keyPath: e.keyPath, value: lable })
  };


  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onChange = (e) => {
    setInputData({ keyPath: inputData.keyPath, value: e.target.value })
  }

  const onSave = () => {
    const data = setMenuItems(items, inputData)
    const defaultOpenKeys = [...inputData.keyPath].reverse().slice(0, -1)
    const defaultSelectedKeys = inputData.keyPath.slice(0, 1)
    setItems(data)
    setMenuKeys({
      key: menuKeys.key + 1,
      defaultOpenKeys,
      defaultSelectedKeys
    })
  }

  return (
    <div className='app'>
      <Menu
        onClick={onClick}
        style={{
          width: 256,
        }}
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={items}
        key={menuKeys.key}
        defaultOpenKeys={menuKeys.defaultOpenKeys}
        defaultSelectedKeys={menuKeys.defaultSelectedKeys}
      />
      <div className='content'>
        <Input style={{ width: '200px', marginRight: '20px' }} value={inputData.value} onChange={onChange} />
        <Button onClick={onSave}>保存</Button>
      </div>
    </div>

  );
};

export default App;