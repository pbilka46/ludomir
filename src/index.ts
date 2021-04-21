#!/usr/bin/env node
const chalk = require('chalk');
const figlet = require('figlet');

import { toolName } from "./setup";
import { usage, init, add, list, update  } from "./cmds";

const ludo = `
  q-p
 /   \\
(     )
 \`-(-'
    )
`

interface Commands {
    [key: string]: (args?: Array<string>) => void
}

const runCommand = (command: string) => {
    const commands = {
        "init": () => init(),
        "add": (args: Array<string>) => add(...args),
        "list": (args: Array<string>) => list(...args),
        "update": (args: Array<string>) => update(...args),
    } as Commands;

    return commands.hasOwnProperty(command) ? commands[command] : usage;
}

const run = () => {
    console.log(
        chalk.blueBright(
            figlet.textSync(toolName.split("").join("     "))
        ),
        chalk.blueBright(
            `${ludo}\n`
        ),
    );

    const argv = require('minimist')(process.argv.slice(2));

    const rest = argv._.length > 0 ? argv._.slice(1) : [];
    runCommand(argv._[0])(rest);
}

run();
