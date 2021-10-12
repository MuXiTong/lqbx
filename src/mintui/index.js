import Vue from 'vue'

import { 
    Button, 
    Cell , 
    Header , 
    DatetimePicker , 
    Tabbar , 
    TabItem , 
    Field , 
    // IndexList, 
    IndexSection,
    Search,
    // Lazyload,
    Picker,
    Popup,
    InfiniteScroll,
    Spinner,
    Actionsheet,
    Checklist,
    Switch,
} from 'mint-ui'

Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(Header.name, Header)
Vue.component(DatetimePicker.name, DatetimePicker)
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(Field.name, Field)
// Vue.component(IndexList.name, IndexList);
Vue.component(IndexSection.name, IndexSection);
Vue.component(Search.name, Search);
Vue.component(Picker.name, Picker);
Vue.component(Popup.name, Popup);
Vue.component(Spinner.name, Spinner);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Checklist.name, Checklist);
Vue.component(Switch.name, Switch);
// Vue.use(Lazyload);
Vue.use(InfiniteScroll);