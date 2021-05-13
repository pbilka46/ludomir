import {getReleaseEntries, ReleaseEntry} from "./list";
import fs from "fs";
import chalk from "chalk";
import {releasesDir, toolName, toolNameCapitalized} from "../setup";
const readline = require('readline');

const shouldProceed = (query: string) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, (ans: string) => {
        rl.close();
        resolve(ans);
    }))
}

const validNums = (args: Array<number>, entries: Array<ReleaseEntry>) => {
    args.forEach((arg => {
        if (arg < 0 || arg >= entries.length) {
            return false;
        }
    }));

    return true;
}

export const deleteMessage = async (...args: number[]) => {

    const entries = getReleaseEntries();
    if (!args.length) {
        if (!entries.length) {
            console.log(chalk.blueBright(`${toolNameCapitalized} didn't find any messages to delete.`))
        } else {
            console.log(chalk.blueBright("Ludo found history entries:\n"));
            entries.forEach((entry: ReleaseEntry, index: number) => {
                console.log(`${index}. ${entry.content}`);
            });

            console.log(chalk.blueBright(`Delete release entries using numbers above.`))
            console.log(chalk.blueBright(`Example: ${toolName} delete 1 2`));
        }
    } else {
        if (!entries.length) {
            console.log(chalk.blueBright(`${toolNameCapitalized} didn't find any messages to delete.`))
            return;
        }

        if (!validNums(args, entries)) {
            console.log(chalk.redBright(`Wrong number, provide some of these: ${entries.map((entry, id) => id)}`));
            return;
        }

        console.log(chalk.blueBright(`${toolNameCapitalized} will delete following:`));
        entries.forEach((entry: ReleaseEntry) => {
            console.log(chalk.blueBright(`${entry.content}`));
        });

        const proceed = await shouldProceed(chalk.redBright("Are you sure about that? (y/n)")) as string;

        if (proceed.toLowerCase() === "y") {
            args.forEach(arg => {
                const entry = entries[arg];
                fs.unlinkSync(`${releasesDir}/${entry.fileName}`);
            })
            console.log(chalk.blueBright(`${toolNameCapitalized} removed release entries.`));
        } else if(proceed.toLowerCase() === "n") {
            console.log(chalk.blueBright("Ok!"));
        } else {
            console.log(chalk.redBright("Unknown input."));
        }
    }
}