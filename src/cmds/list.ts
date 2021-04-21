import fs from "fs";
import {releasesDir} from "../setup";
import chalk from "chalk";

export const list = (...args: string[]) => {
    fs.readdir(releasesDir, (err: any, files: any[]) => {
        if (err) throw err;

        const entries: string[] = [];
        files.forEach((file: any) => {
            try {
                const data = fs.readFileSync(`${releasesDir}/${file}`, 'utf8')
                entries.push(data);
            } catch (err) {
                console.error(err)
            }
        })

        if (entries.length > 0) {
            console.log(chalk.blueBright("Ludo found history entries for you:\n"));
            entries.forEach(entry => console.log(chalk.blueBright(entry)));
        } else {
            console.log(chalk.blueBright(`Ludo couldn't find anything to make a release.`));
        }
    })
}