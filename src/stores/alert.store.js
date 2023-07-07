import { defineStore } from 'pinia';
import Swal from 'sweetalert2';



export const useAlertStore = defineStore({
    id: 'alert',
    state: () => ({
        alert: null
    }),
    actions: {
        success(message) {
            this.alert = { message, type: 'alert-success' };
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                },
            })
            Toast.fire({
                icon: 'info',
                title: 'Info',
                text: message,
                // confirmButtonText: 'Cool',
            });
        },
        error(message) {
            this.alert = { message, type: 'alert-danger' };
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                },
            })
            Toast.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                // confirmButtonText: 'Cool',
            });
        },
        clear() {
            this.alert = null;
        }
    }
});
