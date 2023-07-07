const { spawn } = require('child_process');
const chalk = require('chalk');


function build () {
    console.log(chalk.yellow('-> ', chalk.underline.bgBlue('Attempting to build the SPA') + ' ...'))
    const child = spawn('npm', ['run', 'build']);

    child.stdout.on('data', (data) => {
        console.log(chalk.yellow(data))
        // console.log(`stdout:\n${data}`);
    });

    child.stderr.on('data', (data) => {
        console.log(chalk.bgMagenta(data))
    });

    child.on('error', (error) => {
        console.log(chalk.bgRed(error.message))
    });

    child.on('close', (code) => {
        if(code == 0) {
            console.log(chalk.green('==========>>>>>> The SPA is built\n\n'))
            serve();
        } else {
            console.log(chalk.red(`child process exited with code ${code}`))
            process.exit(code)
        }
    });
}

let express;
function serve () {
    console.log(chalk.yellow('-> ', chalk.underline.bgBlue('Attempting to server the SPA') + ' ...'))
    express = spawn('node', ['server.js']);

    express.stdout.on('data', (data) => {
        console.log(chalk.yellow(data))
        e2e();
        // console.log(`stdout:\n${data}`);
    });

    express.stderr.on('data', (data) => {
        console.log(chalk.bgMagenta(data))
    });

    express.on('error', (error) => {
        console.log(chalk.bgRed(error.message))
    });

    express.on('close', (code) => {
        if(code == 0) {
            console.log(chalk.green('==========>>>>>> The SPA being served \n\n'))
            e2e();
        } else {
            console.log(chalk.red(`child process exited with code ${code}`))
            express.stdin.pause();
            express.kill('SIGINT');
            process.exit(code)
        }
    });
}

function e2e () {
    console.log(chalk.yellow('-> ', chalk.underline.bgBlue('Attempting to run e2e') + ' ...'))
    const child = spawn('npm', ['run', 'e2e']);

    child.stdout.on('data', (data) => {
        console.log(chalk.yellow(data))
        // console.log(`stdout:\n${data}`);
    });

    child.stderr.on('data', (data) => {
        console.log(chalk.bgMagenta(data))
    });

    child.on('error', (error) => {
        console.log(chalk.bgRed(error.message))
        console.log(chalk.bgMagenta('killing express'))
        express.stdin.pause();
        express.kill('SIGINT');
    });

    child.on('close', (code) => {
        if (code == 0) {
            console.log(chalk.green('==========>>>>>> Test is OK \n\n'))
        } else {
            console.log(chalk.red(`Test is NOT OK - child process exited with code ${code}`))
        }
        console.log(chalk.bgMagenta('killing express'));
        express.stdin.pause();
        express.kill('SIGINT');
        process.exit(code)
    });
}



build()