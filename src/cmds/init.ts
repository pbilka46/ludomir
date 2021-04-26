import fs from "fs";
import dayjs from "dayjs";
import chalk from "chalk";
import {releasesDir, releasesFile, toolName, toolNameCapitalized} from "../setup";
import semver from "semver";

const createTitle = (title?: string) => `.. :changelog:\n${title || "Releases:"}\n\n\n`;
const createHeader = (version: string, date: any) => `${version} (${date})\n----------------\n`;
const initialMessage = `Initialized realases file with ${toolNameCapitalized}.\n\n`;

export const initialVersion = "0.1.0";

const getInitialHeader = (title: string, version: string) => {
    const fileTitle = title ? title : "";
    const initVersion = version ? version : initialVersion;
    return `${createTitle(fileTitle)}${createHeader(initVersion, dayjs().format("YYYY-MM-DD"))}${initialMessage}`;
}

export const init = (...args: string[]) => {
    const [title, version] = args;

    if (!title) {
        console.log(chalk.redBright(`Missing ${releasesFile} file title.`))
        console.log(chalk.blueBright(`Example: ${toolName} init "MyProject" 2.3.9 (optional)`));
        return ;
    }

    if (!semver.valid(version)) {
        console.log(chalk.redBright(`${toolNameCapitalized} found invalid version. Make sure you follow semantic versioning - {major.minor.patch}`))
        console.log(chalk.blueBright(`Example: ${toolName} release 2.3.9`));
        return ;
    }

    if (fs.existsSync(releasesFile)) {
        console.log(chalk.blueBright(`${toolNameCapitalized} already initialized ${releasesFile} file.`));
        return ;
    } else {
        fs.writeFile(releasesFile, getInitialHeader(title, version), { flag: 'wx' }, (err: any) => {
            if (err) console.error(err);
        });

        if (!fs.existsSync(releasesDir)) {
            fs.mkdirSync(releasesDir);
        }

        console.log(chalk.blueBright(`${toolNameCapitalized} initialized ${releasesFile} file at the root path of the project.`));
    }
}
