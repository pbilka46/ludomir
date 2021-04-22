import {add, init, list, release} from "../cmds";
import {releasesFile} from "../setup";
import { initialVersion } from "../cmds/init";

interface Commands {
    [key: string]: {
        options: Array<string>,
        description: string,
        run:   (args?: Array<string>) => void
    }
}
const commands = {
    "init": {
        options: [`[VERSION?] (options def. ${initialVersion})`],
        description: `Initializes ${releasesFile} file`,
        run: (args: Array<string>) => init(...args)
    },
    "add": {
        options: ["[MESSAGES...]"],
        description: `Adds message(s) to the new release`,
        run: (args: Array<string>) => add(...args),
    },
    "list": {
        options: [],
        description: `Lists added message(s) to release`,
        run: (args: Array<string>) => list(...args),
    },
    "release": {
        options: ["[VERSION]"],
        description: `Updates ${releasesFile} file with new messages under [VERSION]. Clears temporary messages.`,
        run: (args: Array<string>) => release(...args),
    }
} as Commands;

export default commands;