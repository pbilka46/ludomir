import chalk from "chalk";
import semver, {SemVer} from "semver";
import BlueBird from "bluebird";
import lineReader from "line-reader";
import fs from "fs";
import dayjs from "dayjs";
import clipboardy from "clipboardy";

import {releasesDir, releasesFile, toolName, toolNameCapitalized} from "../setup";
import { init}  from "./init";
import {createHeader} from "../modules/release";

const semanticVersionPattern = /^([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?()/;

const readLines = () => {
    const lines = [] as Array<string>;

    const eachLine = BlueBird.promisify(lineReader.eachLine);
    // @ts-ignore
    return eachLine(releasesFile, function(line: any) {
        lines.push(line);
    }).then(function () {
      return lines;
    });
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
    let rls = "";
    entries.forEach((entry: string, index:number) => {
        rls += `-${entry}`
        if (index < entries.length) {
            rls += "\n"
        }
    })
    return `${createHeader(version, dayjs().format("YYYY-MM-DD"))}${rls}`;
}

const mapLinesToContent = (lines: Array<string>) => {
    let content = "";
    lines.forEach((line: string, index: number) => {
        content += line;
        if (index < lines.length) {
            content += "\n"
        }
    })

    return content;
}

export const release = async (...args: string[]) => {
    const [version] = args;
    if (!version) {
        console.log(chalk.blueBright("Usage: release [VERSION]"));
        return ;
    }

    if (!semver.valid(version)) {
        console.log(chalk.redBright(`${toolNameCapitalized} found invalid version. Make sure you follow semantic versioning - {major.minor.patch}`))
        console.log(chalk.blueBright(`Example: ${toolName} release 2.3.9`));
        return ;
    }


    const lastVersion = await readLastVersion();

    if (semver.lte(version, lastVersion)) {
        console.log(chalk.redBright(`Provided version (${version}) is lower than the last one. Make sure you are upgrading.`));
        console.log(chalk.blueBright(`Last version: ${lastVersion}`));

        return ;
    } else {

        if (!fs.existsSync(releasesFile)) {
            console.log(chalk.blueBright(`${toolNameCapitalized} couldn't find ${releasesFile} file. Initializing...`));
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
                    // fs.unlinkSync(filePath);
                } catch (err) {
                }
            });

            if (entries.length === 0) {
                console.log(chalk.redBright(`${toolNameCapitalized} could not find any messages to make a release.`));
                console.log(chalk.blueBright(`Make sure you have added some messages before making release.`));
                console.log(chalk.blueBright(`To add new message, type ${toolName} add "your message"`));
            }

            if (entries.length > 0) {
                const newRelease = createReleaseEntry(version, entries)

                const currentLines = await readLines();
                const beforeContent = mapLinesToContent(currentLines.slice(0, 4));
                const nextContent = mapLinesToContent(currentLines.slice(4, currentLines.length - 1));
                const finalContent = `${beforeContent}${newRelease}${nextContent}`;

                fs.writeFileSync(releasesFile, finalContent);
                clipboardy.writeSync(newRelease)
                console.log(chalk.blueBright(newRelease));
                console.log(chalk.blueBright(`Ludo updated ${releasesFile} with the content above and already copied to clipboard.`))
            }
        })
    }
}
