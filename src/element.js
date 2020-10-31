import Vue from "vue";
import {
  Pagination,
  Dialog,
  Avatar,
  Autocomplete,
  Drawer,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Checkbox,
  Select,
  Option,
  Button,
  Tooltip,
  Tag,
  Tabs,
  TabPane,
  Slider,
  Row,
  Col,
  Collapse,
  CollapseItem,
  Link,
  Divider,
  Loading,
  Message,
  Notification,
} from "element-ui";

Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Drawer);
Vue.use(Avatar);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Tooltip);
Vue.use(Tag);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Slider);
Vue.use(Row);
Vue.use(Col);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Link);
Vue.use(Divider);

Vue.use(Loading.directive);

// Vue.prototype.$loading = Loading.service;
// Vue.prototype.$msgbox = MessageBox;
// Vue.prototype.$alert = MessageBox.alert;
// Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
