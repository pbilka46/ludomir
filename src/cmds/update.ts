import chalk from "chalk";
import semver, {SemVer} from "semver";
import BlueBird from "bluebird";
import lineReader from "line-reader";
import fs from "fs";
import clipboardy from "clipboardy";

import {releasesDir, releasesFile, toolName, toolNameCapitalized} from "../setup";
import { init}  from "./init";
import dayjs from "dayjs";
import {createHeader} from "../modules/release";

const semanticVersionPattern = /^([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?()/;

// @ts-ignore
const calculateLine = (lines) => {
    let index = 0;
    lines.forEach((line: string) => {
        if ((line.startsWith('..') && line !== '\n')) {
            index++;
        }
    })
}

const readLastVersion = (): SemVer => {
    const versions = [] as Array<string>;
    const eachLine = BlueBird.promisify(lineReader.eachLine);
    // @ts-ignore
    return eachLine(releasesFile, function(line: any) {
        const execSemantic = semanticVersionPattern.exec(line);
        if (execSemantic) {
            versions.push(execSemantic[0]);
        }
    }).then(function() {
        return semver.sort(versions)[versions.length - 1]
    }).catch(function(err: any) {
        console.error(err);
    });
}

const createReleaseEntry = (version: string, entries: Array<string>) => {
    let release = "";
    entries.forEach((entry: string) => {
        release += `-${entry}\n`
    })
    return `${createHeader(version, dayjs().format("YYYY-MM-DD"))}${release}`;
}


export const update = async (...args: string[]) => {
    const [version] = args;
    if (!version) {
        console.log(chalk.blueBright("Usage: update [VERSION]"));
        return ;
    }

    if (!semver.valid(version)) {
        console.log(chalk.redBright(`${toolNameCapitalized} found invalid version. Make sure you follow semantic versioning - {major.minor.patch}`))
        console.log(chalk.blueBright(`Example: ${toolName} update 2.3.9`));
        return ;
    }


    const lastVersion = await readLastVersion();

    if (semver.lte(version, lastVersion)) {
        console.log(chalk.blueBright(`Provided version (${version}) is lower than the last one. Make sure you are upgrading.`));
        console.log(chalk.blueBright(`Last version: ${lastVersion}`));

        return ;
    } else {

        if (!fs.existsSync(releasesFile)) {
            console.log(chalk.blueBright(`${toolNameCapitalized} Ludo couldn't find ${releasesFile} file. Initializing...`));
            init();
        }

        fs.readdir(releasesDir, async (err: any, files: any[]) => {
            if (err) throw err;

            const entries: string[] = [];
            files.forEach((file: any) => {
                const filePath = `${releasesDir}/${file}`;
                try {
                    const data = fs.readFileSync(filePath, 'utf8')
                    entries.push(data);
                    fs.unlinkSync(filePath);
                } catch (err) {
                }
            })

            if (entries.length === 0) {
                console.log(chalk.blueBright(`${toolNameCapitalized} could not find any messages to make a release.`));
            }

            if (entries.length > 0) {
                const before = fs.readFileSync(`${releasesFile}`, 'utf8')
                const release = createReleaseEntry(version, entries)
                const next = `\n${release}${before}\n`;
                fs.writeFileSync(releasesFile, next);
                clipboardy.writeSync(release)
                console.log(chalk.blueBright(release));
                console.log(chalk.blueBright(`Ludo updated ${releasesFile} with the content above and already copied to clipboard.`))
            }
        })
    }
}
