import Navbar from './navbar.js';
import Login from './login.js';

const Register = {
    template: `
        <div class="register">
            <h2>Register Component</h2>
        </div>
    `
};

const Sparcheggio = {
    template: `
        <div class="sparcheggio">
            <h2>Sparcheggio Component</h2>
            <p>Qui puoi prenotare il parcheggio</p>
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
        Sparcheggio,
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
            this.currentComponent = 'Sparcheggio';
        }
    }
};

const app = Vue.createApp(App);
app.mount('#app');