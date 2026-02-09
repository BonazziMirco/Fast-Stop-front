// login.js
const Login = {
    template: `
        <div class="login-component">
            <h1>Login</h1>

            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        v-model="formData.email"
                        placeholder="inserisci email"                        
                    >
                </div>

                <div class="form-group">
                    <label for="password">Password:</label>
                    <div class="password-container">
                        <input
                            :type="passwordFieldType"
                            id="password"
                            v-model="formData.password"
                            placeholder="inserisci password"
                        >
                        <button 
                            type="button" 
                            @click="togglePassword"
                            class="toggle-password"
                        >
                            {{ showPassword ? 'Nascondi' : 'Mostra' }}
                        </button>
                    </div>
                </div>

                <button type="submit" class="submit-btn">Accedi</button>
            </form>

            <div v-if="message" class="message">
                <p>{{ message }}</p>
            </div>
        </div>
    `,

    data() {
        return {
            formData: {
                email: '',
                password: ''
            },
            showPassword: false,
            message: ''
        };
    },

    computed: {
        passwordFieldType() {
            return this.showPassword ? 'text' : 'password';
        }
    },

    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },

        handleLogin() {
            // Reset messaggio precedente
            this.message = '';

            // Validazione base
            if (!this.formData.email || !this.formData.password) {
                this.message = 'Per favore, compila tutti i campi';
                return;
            }

            this.$emit('login-success', {
                email: this.formData.email
            });
        }
    }
}

export default Login;