import { defineStore } from 'pinia';
import { useAlertStore } from '@/stores';

const operators = ['-', '+', '/', '*', 'ce', 'rnd', 'sqrt', '=']

export const useCalculateStore = defineStore({
    id: 'calculate',
    state: () => ({
        result: '0',
        previous: '0',
        _current_cursor: '',
        _queue: [],
        _maxlenght: 3,
    }),
    actions: {
        reset () {
            this._queue = [];
            this.previous = '0';
            this.result = '0';
            this._current_cursor = '';
        },
        createOperation () {
            if(this._queue.length === 0) {
                return;
            }
            const alertStore = useAlertStore();
            alertStore.success('calculating');    
            const calculate = eval(`${this._queue.join(' ')}`);
            this._queue = [];
            console.log('calculate', calculate);
        },
        input(value) {
            console.log('input ' + !Number.isNaN(value), value);

            if(value === 'ce') {
                this.reset();
                return;
            }

            if(value === 'rnd') {
                this.reset();
                this.previous = 'rnd()';
                this.result = 'rnd()';
                return;
            }

            

            if(operators.indexOf(value) < 0) {
                this._current_cursor = `${this._current_cursor}${value}`;
                this.result = this._current_cursor;
                this.previous = this._queue.length === 0 ? this._current_cursor : this._queue.join(' ');
            } else {
                if(this._current_cursor !== '')
                {
                    this._queue.push(this._current_cursor);
                }
                // this._current_cursor = value;
                
                if(value !== '=') {
                    this._queue.push(value);
                }
                this.previous = this._queue.join(' ');
                this._current_cursor = '';
            }

            if(this._queue.length >= this._maxlenght) {
                this.createOperation();
            } else {
                // return;
            }   

            // this.alert = { message, type: 'alert-success' };
            
        },
    }
});
