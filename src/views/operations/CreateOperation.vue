<script setup>
import { useRoute } from 'vue-router';

import { useAlertStore, useCalculateStore } from '@/stores';
import { router } from '@/router';

const calculateStore = useCalculateStore();
const alertStore = useAlertStore();
const route = useRoute();

const onClick = async (value) => {
    calculateStore.input(value);
}
</script>

<template>
        <div class="container">
            <div id="calc" class="text-center">
              <div id="display">
              <div id="result"><p>{{calculateStore.result}}</p></div>
              <div id="previous"><p>{{calculateStore.previous}}</p></div>
              </div>
                <div id="keyboard">
                <div class="row">
                  <button @click="onClick('7')" class="btn btn-info" value="7">7</button>
                  <button @click="onClick('8')" class="btn btn-info" value="8">8</button>
                  <button @click="onClick('9')" class="btn btn-info" value="9">9</button>
                  <button @click="onClick('ce')" class="btn btn-danger" value="ce">CE</button>
                  <button @click="onClick('rnd')" class="btn btn-danger" value="rnd">RND</button>
                </div>
                <div class="row">
                  <button @click="onClick('4')" class="btn btn-info" value="4">4</button>
                  <button @click="onClick('5')" class="btn btn-info" value="5">5</button>
                  <button @click="onClick('6')" class="btn btn-info" value="6">6</button>
                  <button @click="onClick('/')" class="btn btn-warning" value="/">/</button>
                  <button @click="onClick('*')" class="btn btn-warning" value="*">*</button>
                </div>
                <div class="row">
                  <button @click="onClick('1')" class="btn btn-info" value="1">1</button>
                  <button @click="onClick('2')" class="btn btn-info" value="2">2</button>
                  <button @click="onClick('3')" class="btn btn-info" value="3">3</button>
                  <button @click="onClick('+')" class="btn btn-warning" value="+">+</button>
                  <button @click="onClick('-')" class="btn btn-warning" value="-">-</button>
                  
                </div>
                <div class="row last-row">
                  <button @click="onClick('0')" class="btn btn-info btn-zero" value="0">0</button>
                  <button @click="onClick('.')" class="btn btn-warning" value=".">.</button>
                  <button @click="onClick('sqrt')" class="btn btn-warning" value="sqrt">sqrt</button>
                  <button @click="onClick('=')" class="btn btn-success" value="=">=</button>
                </div>
              </div>
            </div>
          </div>
</template>

<style scoped>
@import '@/assets/calculator.css';
</style>