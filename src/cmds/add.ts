import chalk from "chalk";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import {releasesDir} from "../setup";

export const add = (...args: string[]) => {
    if (args.length === 0) {
        console.log(chalk.blueBright("Usage: add [MESSAGES...]"));
        return;
    }

    if (!fs.existsSync(releasesDir)) {
        fs.mkdirSync(releasesDir);
    }

    let count = 0;
    args.forEach((arg, index) => {
        const msg = arg;
        const hash = uuidv4();
        try {
            fs.writeFileSync(`${releasesDir}/${hash}`, msg, { flag: 'wx' });
            count++;
        } catch (e) {
            throw e;
        }
    })

    console.log(chalk.blueBright(`Ludomir added ${count} message(s).`));
}