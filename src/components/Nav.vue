<script setup>
import Swal from 'sweetalert2';
import { useAuthStore, useUsersStore } from '@/stores';

const authStore = useAuthStore();
const usersStore = useUsersStore();

// const canvas = document.createElement('canvas')
// document.body.appendChild(canvas);

const html = `
    <video id="video" width="320" height="320" autoplay></video>
    <canvas id="canvas" width="320" height="320" style="display: none;"></canvas>
`;

async function changePhoto() {
    try {
        const s = Swal.fire({

            // icon: 'success',
            title: 'Take you photo',
            html,
            // text: 'Do you want to continue',
            confirmButtonText: 'save',
            showCancelButton: true,
            customClass: {
                confirmButton: 'btn btn-sm btn-success mb-2',
                cancelButton: 'btn btn-sm mb-2',
            }
        })
        
        const video = document.querySelector("#video");
        // const take_photo = document.querySelector("#take_photo");
        // console.log('xxxxx',video);
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

        let canvas = document.querySelector("#canvas");
        video.srcObject = stream;

        const { isConfirmed, isDismissed } = await s;
            if (isConfirmed) {

            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            // console.log(video, canvas.getContext('2d'))
            let image_data_url = canvas.toDataURL('image/jpeg');

            // let base64str = image_data_url.substr(22);
            // let decoded = atob(base64str);
            let base64Length = image_data_url.length - (image_data_url.indexOf(',') + 1);
            let padding = (image_data_url.charAt(image_data_url.length - 2) === '=') ? 2 : ((image_data_url.charAt(image_data_url.length - 1) === '=') ? 1 : 0);
            let fileSize = (base64Length * 0.75 - padding) / 1024; // kb
            
            if(fileSize > 100) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'The photo can not have more than 100kb',
                })
                return;
            }

            // data url of the image
            console.log(image_data_url);
            // authStore.photo = image_data_url;

            await usersStore.update(authStore.user._id, {
                photo: image_data_url,
            });
        }
    } catch (error) {
        console.error(error)
    }
}
</script>

<template>
    <nav v-if="authStore.user" class="navbar navbar-expand navbar-dark bg-dark">
        <router-link to="/" class="navbar-brand"><img src="https://www.truenorth.co/favicon-32x32.png" alt="TrueNorth"/> TrueNorth</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                <li class="nav-item">
                    <router-link to="/users" class="nav-item nav-link" v-if="authStore.isAdmin">Users</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/operations" class="nav-item nav-link" v-if="authStore.isAdmin">Operation's Type</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/records" class="nav-item nav-link">Calculated Operations</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/create_operation"  v-if="authStore.isAdmin" class="nav-item nav-link">New UI</router-link>
                </li>
            </ul>
            <form onsubmit="return false;" class="form-inline my-2 my-lg-0 logout">
                <button @click="authStore.logout()" class="btn btn-link nav-item nav-link">Logout</button>
                <div v-if="authStore.user.photo !== null" class="circular-portrait">
                    <img @click="changePhoto" class="photo" :src="authStore.user.photo" :alt="authStore.user?.username" :title="authStore.user?.username" />
                </div>
                <div v-else class="circular-portrait">
                    <img @click="changePhoto" class="photo" src="http://localhost:8080/selfie.png" :alt="authStore.user?.username" :title="authStore.user?.username" />
                </div>
                
            </form>
        </div>

        
    </nav>
</template>
<style>
@import '@/assets/nav.css';
</style>