import fs from "fs";
import dayjs from "dayjs";
import chalk from "chalk";
import { releasesDir, releasesFile, toolNameCapitalized } from "../setup";

// const createTitle = (title?: string) => `${title || "Releases:"}\n`;
const createHeader = (version: string, date: any) => `${version} (${date})\n----------------\n`;
const dummyData = `Initialized realases file.\n\n`;


const getInitialHeader = () =>
    `${createHeader("0.1.0", dayjs().format("YYYY-MM-DD"))}${dummyData}`;

export const init = () => {
    if (!fs.existsSync(releasesFile)) {
        fs.writeFile(releasesFile, getInitialHeader(), { flag: 'wx' }, (err: any) => {
            if (err) console.error(err);
        });

        if (!fs.existsSync(releasesDir)) {
            fs.mkdirSync(releasesDir);
        }

        console.log(chalk.blueBright(`${toolNameCapitalized} initialized ${releasesFile} file at the root of the project.`));
    } else {
        console.log(chalk.blueBright(`${toolNameCapitalized} already initialized ${releasesFile} file.`));
    }
}
