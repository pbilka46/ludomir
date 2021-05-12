import fs from "fs";
import {releasesDir} from "../setup";
import chalk from "chalk";

export interface ReleaseEntry {
    fileName: string,
    content: string
}

export const getReleaseEntries = () => {
    const entries: Array<ReleaseEntry> = [];
    const fileNames = fs.readdirSync(releasesDir);
    fileNames.forEach(fileName => {
        try {
            const content = fs.readFileSync(`${releasesDir}/${fileName}`, 'utf8')
            entries.push({
                fileName,
                content
            });
        } catch (err) {
            console.error(err)
        }
    })

    return entries;
}

export const list = (...args: string[]) => {
    const entries = getReleaseEntries();
    if (entries.length > 0) {
        console.log(chalk.blueBright("Ludo found history entries for you:\n"));
        entries.forEach(entry => console.log(chalk.blueBright(entry.content)));
    } else {
        console.log(chalk.blueBright(`Ludo couldn't find any messages to make a release.`));
    }
}