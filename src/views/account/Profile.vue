<script setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';

import { storeToRefs } from 'pinia';

import { useUsersStore, useAlertStore, useAuthStore } from '@/stores';
import { router } from '@/router';

const usersStore = useUsersStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();

let { user } = storeToRefs(authStore)


let title = 'My Profile';

const schema = Yup.object().shape({
    username: Yup.string()
        .required('Username is required')
        .email(),
    status: Yup.string()
        .required('Status is required'),
    balance: Yup.number()
        .required('balance is required'),
    admin: Yup.string()
        .required('Type is required'),
    password: Yup.string()
        .transform(x => x === '' ? undefined : x)
        // password optional in edit mode
        .concat(user ? null : Yup.string().required('Password is required'))
        .min(6, 'Password must be at least 6 characters')
});

async function onSubmit(values) {
    try {
        let message;
        if (user) {
            await usersStore.update(user.value.id, values)
            message = 'User updated';
        } else {
            await usersStore.create(values);
            message = 'User added';
        }
        console.log(router.currentRoute);
        await router.push('/');
        alertStore.success(message);
    } catch (error) {
        alertStore.error(error);
    }
}
</script>

<template>
    <h1>{{title}}</h1>
    <template v-if="!(user?.loading || user?.error)">
        <Form @submit="onSubmit" :validation-schema="schema" :initial-values="user" v-slot="{ errors, isSubmitting }">
            <div class="form-row">
                <div class="form-group col">
                    <label>Username</label>
                    <Field name="username" type="email" class="form-control" :class="{ 'is-invalid': errors.username }" />
                    <div class="invalid-feedback">{{ errors.username }}</div>
                </div>
                <div class="form-group col">
                    <label>
                        Password
                        <em v-if="user">(Leave blank to keep the same password)</em>
                    </label>
                    <Field name="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
                    <div class="invalid-feedback">{{ errors.password }}</div>
                </div>
            </div>
            <div v-if="user.admin" class="form-row">
                <div class="form-group col">
                    <label>Status</label>
                    <Field 
                        name="status" 
                        as="select"
                        class="form-control" 
                        :class="{ 'is-invalid': errors.status }"
                    >
                        <option value="" selected></option>
                        <option 
                            v-for="status in ['active', 'inactive']" 
                            :key="status"
                            :value="status"
                            :selected="user && user.status === status"
                        >
                            {{status}}
                        </option>
                    </Field>
                    <div class="invalid-feedback">{{ errors.status }}</div>
                </div>
                <div class="form-group col">
                    <label>
                        Admin
                    </label>
                    <Field 
                        name="admin" 
                        as="select"
                        class="form-control" 
                        :class="{ 'is-invalid': errors.admin }"
                    >
                        <option value="" selected></option>
                        <option 
                            v-for="admin in [true, false]" 
                            :key="admin"
                            :value="admin"
                            :selected="user && user.admin === admin"
                        >
                            {{admin}}
                        </option>
                    </Field>
                    <div class="invalid-feedback">{{ errors.admin }}</div>
                </div>
            </div>
            <div v-if="user.admin" class="form-row">
                <div class="form-group col">
                    <label>Balance</label>
                    <Field name="balance" type="number" class="form-control" :class="{ 'is-invalid': errors.balance }" />
                    <div class="invalid-feedback">{{ errors.balance }}</div>
                </div>
                <div class="form-group col">
                   
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="isSubmitting" name="save">
                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                    Save
                </button>
                <router-link to="/users" class="btn btn-link">Cancel</router-link>
            </div>
        </Form>
    </template>
    <template v-if="user?.loading">
        <div class="text-center m-5">
            <span class="spinner-border spinner-border-lg align-center"></span>
        </div>
    </template>
    <template v-if="user?.error">
        <div class="text-center m-5">
            <div class="text-danger">Error loading user: {{user.error}}</div>
        </div>
    </template>
</template>
