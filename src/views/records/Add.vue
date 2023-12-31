<script setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { storeToRefs } from 'pinia';

import { useOperationsStore, useAlertStore, useRecordsStore } from '@/stores';
import { router } from '@/router';

const operationsStore = useOperationsStore();
const recordsStore = useRecordsStore();
const alertStore = useAlertStore();

const { operations } = storeToRefs(operationsStore);

operationsStore.getAll()

let title = 'Add Operation';
let { record } = storeToRefs(recordsStore);

const schema = Yup.object().shape({
    operation_id: Yup.array()
        .required('Operation is required'),    
});

function onSelectType (event) {
    const type = event.target.value.split(',')[1];
    recordsStore.selectedType = type;
}

async function onSubmit(values) {
    try {
        const {entry1, operation_id, entry2 } = values;
        const [id, type] = operation_id;

        let user_input_numbers = [entry1, entry2];
        if (type === 'square_root') {
            if(!entry1 || entry1 === '') {
                alertStore.error('Number 1 is mandatory on this kind of operation')
                return;
            }
            user_input_numbers = [entry1]
        } else  if (type === 'random_string') {
            user_input_numbers = []
        } else {
            if(!entry1 || entry1 === '') {
                alertStore.error('Number 1 is mandatory on this kind of operation')
                return;
            }
            // check number 2
            if(!entry2 || entry2 === '') {
                alertStore.error('Number 2 is mandatory on this kind of operation')
                return;
            }
        }
        // 
        const payload = {
            operation_id: id,   
            user_input_numbers
        }
        // let message;
        const { data, code, message } = await recordsStore.create(payload);
        if (code === 402) {
            record = { error: message };
            alertStore.error(message);
            return;
        }
        
        await router.push('/records');
        alertStore.success(data.operation_response);
    } catch (error) {
        alertStore.error(error.message);
        record = { error: error.message }
    }
}
</script>

<template>
    <h1>{{title}}</h1>
    <template v-if="!(record?.loading || record?.error)">
        <Form @submit="onSubmit" :validation-schema="schema" :initial-values="record" v-slot="{ errors, isSubmitting }">
            <div class="form-row">
                <div class="form-group col">
                    <label>Number 1</label>
                    <Field name="entry1" type="number" class="form-control" :class="{ 'is-invalid': errors.entry1 }" />
                    <div class="invalid-feedback">{{ errors.entry1 }}</div>
                </div>
                <div class="form-group col">
                    
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col">
                    <label>Operation</label>
                    <Field 
                        name="operation_id" 
                        as="select"
                        class="form-control" 
                        :class="{ 'is-invalid': errors.operation_id }"
                        @change="onSelectType($event)"
                    >
                        <option value="" selected>select one</option>
                        <option 
                            v-for="operation in operations" 
                            :key="operation.id"
                            :value="[operation.id, operation.type]"
                        >
                            {{operation.type}}
                        </option>
                    </Field>
                    <div class="invalid-feedback">{{ errors.operation_id }}</div>
                </div>
                <div class="form-group col">

                </div>
            </div>
            <div class="form-row">
                <div class="form-group col">
                    <label>Number 2</label>
                    <Field name="entry2" type="number" class="form-control" :class="{ 'is-invalid': errors.entry2 }" />
                    <div class="invalid-feedback">{{ errors.entry2 }}</div>
                </div>
                <div class="form-group col">
                    
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="isSubmitting">
                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                    Save
                </button>
                <router-link to="/records" class="btn btn-link">Cancel</router-link>
            </div>
        </Form>
    </template>
    <template v-if="record?.loading">
        <div class="text-center m-5">
            <span class="spinner-border spinner-border-lg align-center"></span>
        </div>
    </template>
    <template v-if="record?.error">
        <div class="text-center m-5">
            <div class="text-danger">Error loading record: {{record.error}}</div>
        </div>
    </template>
</template>
