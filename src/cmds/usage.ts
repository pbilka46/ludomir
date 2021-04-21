import chalk from "chalk";
import { releasesFile, toolNameCapitalized, toolName, releasesDir } from "../setup";

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
    console.log(chalk.blueBright(`init                   - Initializes ${releasesFile} file`));
    console.log(chalk.blueBright("add [MESSAGE(s)]       - Adds message(s) to the new release"));
    console.log(chalk.blueBright("list.ts                - Lists added message(s) to release"));
    console.log(chalk.blueBright(`update [VERSION|x.y.z] - Updates ${releasesFile} file with new messages under [VERSION]. Clears temporary messages.\n`));

    console.log(chalk.blueBright("Examples:\n"));
    console.log(chalk.blueBright(`${toolName} init`));
    console.log(chalk.blueBright(`${toolName} add "Initialized ${toolNameCapitalized}" "something2"`));
    console.log(chalk.blueBright(`${toolName} update 0.1.1`));
}