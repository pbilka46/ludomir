#!/usr/bin/env node
const chalk = require('chalk');
const figlet = require('figlet');

import { toolNameDefault, ludoASCII } from "./setup";
import { usage } from "./cmds";
import commands from "./modules/commands";


const runCommand = (command: string) => {
    return commands.hasOwnProperty(command) ? commands[command].run : usage;
}
// deleting
// fix bug with blank space after release
// add date timestamp to correctly display messages in order

const run = () => {
    console.log(
        chalk.bgBlueBright.bgBlue(
            figlet.textSync(toolNameDefault.split("").join("     "))
        ),
        chalk.blueBright(
            `${ludoASCII}\n`
        ),
    );

    const argv = require('minimist')(process.argv.slice(2));

    const rest = argv._.length > 0 ? argv._.slice(1) : [];
    runCommand(argv._[0])(rest);
}

run();
