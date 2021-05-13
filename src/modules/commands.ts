import {add, init, list, release, deleteMessage} from "../cmds";
import {releasesFile} from "../setup";
import { initialVersion } from "../cmds/init";

interface Commands {
    [key: string]: {
        options: Array<string>,
        description: string,
        run:   (args?: Array<string> | Array<number>) => void
    }
}
const commands = {
    "init": {
        options: [`[TITLE] [VERSION?] (options def. ${initialVersion})`],
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
    "delete": {
        options: [],
        description: `Deletes added message(s). Run first to map them.`,
        run: (args: Array<number>) => deleteMessage(...args),
    },
    "release": {
        options: ["[VERSION]"],
        description: `Updates ${releasesFile} file with new messages under [VERSION]. Clears temporary messages.`,
        run: (args: Array<string>) => release(...args),
    }
} as Commands;

export default commands;