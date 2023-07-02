<script setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useOperationsStore, useAlertStore } from '@/stores';
import { router } from '@/router';

const operationsStore = useOperationsStore();
const alertStore = useAlertStore();
const route = useRoute();
const id = route.params.id;

let title = 'Add Operation Type';
let operation = null;
if (id) {
    // edit mode
    title = 'Edit Operation Type';
    ({ operation } = storeToRefs(operationsStore));
    operationsStore.getById(id);
}

const schema = Yup.object().shape({
    cost: Yup.string()
        .required('Cost is required'),
    status: Yup.string()
        .required('Status is required'),
    type: Yup.string()
        .required('Type is required'),
});

async function onSubmit(values) {
    try {
        let message;
        if (operation) {
            await operationsStore.update(operation.value.id, values)
            message = 'Operation updated';
        } else {
            await operationsStore.create(values);
            message = 'Operation added';
        }
        await router.push('/operations');
        alertStore.success(message);
    } catch (error) {
        alertStore.error(error);
    }
}
</script>

<template>
    <h1>{{title}}</h1>
    <template v-if="!(operation?.loading || operation?.error)">
        <Form @submit="onSubmit" :validation-schema="schema" :initial-values="operation" v-slot="{ errors, isSubmitting }">
            <div class="form-row">
                <div class="form-group col">
                    <label>
                        Type
                    </label>
                    <Field 
                        name="type" 
                        as="select"
                        class="form-control" 
                        :class="{ 'is-invalid': errors.type }"
                    >
                        <option value="" selected></option>
                        <option 
                            v-for="type in ['addition', 'subtraction', 'multiplication', 'division', 'square_root', 'random_string']" 
                            :key="type"
                            :value="type"
                            :selected="operation && operation.type === type"
                        >
                            {{type}}
                        </option>
                    </Field>
                    <div class="invalid-feedback">{{ errors.type }}</div>
                </div>
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
                            :selected="operation && operation.status === status"
                        >
                            {{status}}
                        </option>
                    </Field>
                    <div class="invalid-feedback">{{ errors.status }}</div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col">
                    <label>Cost</label>
                    <Field name="cost" type="number" class="form-control" :class="{ 'is-invalid': errors.cost }" />
                    <div class="invalid-feedback">{{ errors.cost }}</div>
                </div>
                <div class="form-group col">
                    
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="isSubmitting">
                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                    Save
                </button>
                <router-link to="/operations" class="btn btn-link">Cancel</router-link>
            </div>
        </Form>
    </template>
    <template v-if="operation?.loading">
        <div class="text-center m-5">
            <span class="spinner-border spinner-border-lg align-center"></span>
        </div>
    </template>
    <template v-if="operation?.error">
        <div class="text-center m-5">
            <div class="text-danger">Error loading operation: {{operation.error}}</div>
        </div>
    </template>
</template>
