import {
    Tabs,
    TabPane,
    Calendar,
    Image,
    Popconfirm,
    Popover,
    Button,
    Divider,
    Input,
    message,
    Menu,
    Select,
    SelectOption,
    InputNumber,
    MenuItem,
    SubMenu,
    Progress,
    RangePicker,
    DatePicker,
    Drawer,
    Textarea,
    Form,
    FormItem
  } from "ant-design-vue";
  
  function antd(app) {
    app.component(Tabs.name, Tabs);
    app.component(TabPane.name, TabPane);
    app.component(Calendar.name, Calendar);
    app.component(Image.name, Image);
    app.component(Popconfirm.name, Popconfirm);
    app.component(Popover.name, Popover);
    app.component(Button.name, Button);
    app.component(Divider.name, Divider);
    app.component(Input.name, Input);
    app.component(Menu.name, Menu);
    app.component(MenuItem.name, MenuItem);
    app.component(SubMenu.name, SubMenu);
    app.component(Select.name, Select);
    app.component(InputNumber.name, InputNumber);
    app.component('ASelectOption', SelectOption);
    app.component(Progress.name, Progress);
    app.component(RangePicker.name, RangePicker);
    app.component(Drawer.name, Drawer);
    app.component(Textarea.name, Textarea);
    app.component(Form.name, Form);
    app.component(FormItem.name, FormItem);
    app.component(DatePicker.name, DatePicker);
  
    app.config.globalProperties.$message = message;
  }
  
  export default antd;
  