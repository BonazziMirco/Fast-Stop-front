import Navbar from './navbar.js';

const Login = {
    template: '<div>' +
        '<h2>Login Component</h2>' +
        '<button @click="$parent.handleLogin">Login</button>' +
        '</div>'
    };

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
        <component :is="currentComponent" />
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
        };
    },
    methods: {
        handleComponentChange(componentName) {
            this.currentComponent = componentName;
        },

        handleLogout() {
            this.isLogged = false;
            this.currentComponent = 'Login';
            alert('Logged out');
        },

        handleLogin(){
            this.isLogged = true;
            this.currentComponent = 'Sparcheggio';
        }
    }
};

const app = Vue.createApp(App);
app.mount('#app');