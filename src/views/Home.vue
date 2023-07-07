<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia';
import Chart from 'chart.js/auto'

import { useAuthStore, useOperationsStore, useRecordsStore, useUsersStore } from '@/stores';

const el = ref()



const authStore = useAuthStore();
const operationsStore = useOperationsStore();
const recordsStore = useRecordsStore();
const usersStore = useUsersStore();
const { user } = storeToRefs(authStore);
let chart1, chart2, chart3, chart4;
function buildChart1() {
    const ctx = document.getElementById('myChart1');
    const mapTypes = {};
    const mapCount = {};
    operationsStore.operations.forEach((o) => {
        mapTypes[o.type] = o.id
        mapCount[o.id] = 0
    })
    
    recordsStore.records.forEach((r) => {
        // r.operation_id
        mapCount[r.operation_id._id] += 1
    })
    console.log(mapTypes, mapCount)
    
    chart1 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(mapTypes),
            datasets: [{
                label: '# of Operations',
                data: Object.values(mapCount),
                borderWidth: 1
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

function buildChart2() {
    const ctx = document.getElementById('myChart2');
    const mapTypes = {};
    const mapCount = {};
    operationsStore.operations.forEach((o) => {
        mapTypes[o.type] = o.id
        mapCount[o.id] = 0
    })
    
    recordsStore.records.forEach((r) => {
        // r.operation_id
        mapCount[r.operation_id._id] += r.operation_id.cost
    })
    console.log(mapTypes, mapCount)
    
    chart2 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(mapTypes),
            datasets: [{
                label: 'Amount spent by Operation',
                data: Object.values(mapCount),
                borderWidth: 1
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

function buildChart3() {
    const ctx = document.getElementById('myChart3');
    const mapTypes = {
        admin: 0,
        user: 0,
    };
    for(const o of [...usersStore.users]) {
        const userType = o.admin ? 'admin' : 'user'
        mapTypes[userType] += 1
    }
    
    console.log(mapTypes)
    
    chart3 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(mapTypes),
            datasets: [{
                label: '# users per type',
                data: Object.values(mapTypes),
                borderWidth: 1
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

function buildChart4() {
    const ctx = document.getElementById('myChart4');
    const mapUsers = {};
    const mapCount = {};
    [...usersStore.users].forEach((o) => {
        mapUsers[o.username] = o.id
        mapCount[o.id] = 0
    })
    
    recordsStore.records.forEach((r) => {
        // r.operation_id
        mapCount[r.user_id._id] += r.operation_id.cost
    })
    console.log(mapUsers, mapCount)
    
    chart4 = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(mapUsers),
            datasets: [{
                label: 'Amount spent by User',
                data: Object.values(mapCount),
                borderWidth: 1
            }],
        },
        options: { 
            // scales: { y: { beginAtZero: true }, },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
}

onBeforeUnmount(() => {
    chart1.destroy()
    chart2.destroy()
    chart3.destroy()
    chart4.destroy()
});

onMounted(() => {
    // el.value // <div>
        (async () => {
            await operationsStore.getAll();
            recordsStore.pageSize = 99999999; // max number or records
            await recordsStore.getAll();
            usersStore.pageSize = 99999999; // max number or records
            await usersStore.getAll();
            setTimeout(() => {
                buildChart1();
                buildChart2();
                buildChart3();
                buildChart4();
            }, 500);
        })();
    })
    
</script>

<template>
    <div v-if="user">
        <div class="container-fluid">
            <div class="d-flex p-2 mb-2">
                <div class="order-1 mr-2 border">
                    <h1>Hi {{user.username}}!</h1>
                    <p>You're logged as {{user.admin ? 'admin' : 'user'}}.</p>
                    <p><router-link v-if="user.admin" to="/users">Manage Users</router-link></p>
                    <p><router-link v-if="user.admin" to="/operations">Manage Operations</router-link></p>
                    <p><router-link to="/records">See all my calculations</router-link></p>
                    <p><router-link to="/records/add">Add new calculation</router-link></p>
                    
                    <p><router-link to="/profile">Manage my profile</router-link></p>
                    
                    <!-- <p><router-link v-if="user.admin" to="/create_operation">New Calcultator UI - POC only</router-link></p> -->
                </div>
                <div class="order-2 mr-2 border">
                    <canvas id="myChart1" style="height: 30vh;"></canvas>
                </div>
                <div class="order-3 mr-2 border">
                    <canvas id="myChart2" style="height: 30vh;"></canvas>
                </div>
            </div>
            <div class="d-flex p-2 mb-2">
                <div class="order-1 mr-2 border">
                    <canvas id="myChart3" style="height: 30vh;"></canvas>
                </div>
                <div class="order-2 mr-2 border">
                    <canvas id="myChart4" style="height: 15vh;"></canvas>
                </div>
                <div class="order-3 mr-2 border">
                    <canvas id="myChart5" style="height: 25vh;"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>
