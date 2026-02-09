import Navbar from './navbar.js';
import Login from './login.js';

const Register = {
    template: `
        <div class="register">
            <h2>Register Component</h2>
        </div>
    `
};

const Profilo = {
    template: `
        <div class="profilo">
            <h2>Profilo</h2>
            <p>Qui puoi prenderti a mazzate</p>
        </div>
    `
};

const App = {
    template:`
        <div id="app">
        <Navbar 
        :active-component="currentComponent"
        :logged="isLogged"
        @component-change="handleComponentChange"
        @logout="handleLogout"
        />
        
        <main class="content">
        <component :is="currentComponent"
         @login-success="handleLoginSuccess"
         />
        </main>
        </div>
    `,

    components: {
        Navbar,
        Login,
        Register,
        Profilo,
    },

    data(){
        return {
            currentComponent: 'Login',
            isLogged: false,
            savedEmail: '', // Per ricordare l'email
            userData: null
        };
    },
    methods: {
        handleComponentChange(componentName) {
            this.currentComponent = componentName;
        },

        handleLogout() {
            this.isLogged = false;
            this.currentComponent = 'Login';
            this.userData = null;
            alert('Logged out');
        },

        handleLoginSuccess(userData) {
            console.log('Login successo in App:', userData);
            this.isLogged = true;
            this.userData = userData;
            this.savedEmail = userData.email; // Salva email per futuro
            this.currentComponent = 'profilo';
        }
    }
};

const app = Vue.createApp(App);
app.mount('#app');