import chalk from "chalk";
import { releasesFile, toolNameCapitalized, toolName, releasesDir } from "../setup";
import commands from "../modules/commands";



const getBlankSpaces = (commandLength: number) => {
    const commandFullLength = Object.keys(commands).map(cmd => {
        return commands[cmd].options.join().length + cmd.length
    })
    const max = Math.max(...commandFullLength);

    let blankSpaces = "";
    for (let i = 0; i < (max - commandLength); i++) {
        blankSpaces += " ";
    }

    return blankSpaces;
}

export const usage = () => {
    console.log(
        chalk.blueBright(
            `Hi I'm ${toolNameCapitalized} - a wise and hardworking rat.`
        )
    );
    console.log(
        chalk.blueBright(
            `I will create and help you maintain "${releasesFile}" file per your project.\n`
        )
    );

    console.log(chalk.blueBright(`Usage: ${toolName} [ACTION]\n`));
    console.log(chalk.blueBright("Actions:\n"));

    Object.keys(commands).forEach(command => {
        const current = commands[command];
        const opts = "options" in current ? current.options : [];
        const blankSpaces = getBlankSpaces(command.length + opts.join().length)
        console.log(chalk.blueBright(`${command} ${opts.join()} ${blankSpaces}  -${current.description}`));
    })


    console.log(chalk.blueBright("\nExamples:\n"));
    console.log(chalk.blueBright(`${toolName} init`));
    console.log(chalk.blueBright(`${toolName} add "Initialized ${toolNameCapitalized}" "something2"`));
    console.log(chalk.blueBright(`${toolName} release 0.1.1`));
}