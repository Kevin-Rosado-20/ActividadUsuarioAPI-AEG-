import { createApp } from "vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import PrimeVue from "primevue/config";
import 'primeflex/primeflex.css';
import Aura from "@primevue/themes/aura";
import App from "./App.vue";

import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmationService from "primevue/confirmationservice";

const app = createApp(App);

app.component("InputText", InputText);
app.component("PassWord", Password);
app.component("DialogModal", Dialog);
app.component("ButtonPrime", Button);
app.component("DataTable", DataTable);
app.component("ColumnPrime", Column);
app.component("ConfirmDialog", ConfirmDialog);

app.use(router);
app.use(VueAxios, axios);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ConfirmationService); 

app.mount("#app");

export { app };
