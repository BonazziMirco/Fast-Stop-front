
    const { createApp } = Vue;

    createApp({
        data() {
            return {
                formData: {email: '',password: ''},
                message: '',
                showPassword: false,
                count: 0
            };
        },

        computed: {
            passwordFieldType(){
                return this.showPassword ? 'text' : 'password';
            }
        },
        methods: {

            async handleLogin() {
                console.log('Email:', this.formData.email);
                console.log('Password:', this.formData.password);

                if(!this.validateForm()){
                    if (!this.formData.email.includes('@')) {
                        this.message = 'Inserisci un\'email valida';
                        return;
                    }
                    else {
                        this.message = 'compila tutto bastardo';
                    }

                }
                else{
                    this.message = 'sto processando...';
                    this.count++;
                }

            },

            validateForm() {
                if (!this.formData.email || !this.formData.password) {

                    return false;
                }
                return true;
            },

            show(){
                this.showPassword = !this.showPassword;
            }

        }
    }).mount('#app');




