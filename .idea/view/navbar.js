const Navbar = {
    template: document.getElementById('navbar-template').innerHTML,


    props: {
        activeComponent: {
            type: String,
            required: true
        },
        logged: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        setActiveComponent(componentName) {
            this.$emit('component-change', componentName);
        },

        logout() {
            this.$emit('logout');
        }
    }

};

export default Navbar;