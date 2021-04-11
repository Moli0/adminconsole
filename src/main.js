import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import elementui from 'element-plus'

import 'element-plus/lib/theme-chalk/index.css';
import '../public/static/Content/Frame/bootstrap/css/bootstrap.css'
import '../public/static/Content/Frame/layui/css/layui.css'
import '../public/static/Content/Css/Index.css'
import '../public/static/Content/Css/calendar.css'
import '../public/static/Content/Css/Site.css'


const app = createApp(App);

app.use(router);

app.use(elementui);

app.mount('#app');
