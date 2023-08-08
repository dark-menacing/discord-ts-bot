import { client } from "../..";
import { Event } from "../../structs/types/event";

export default new Event({
    name: 'ready',
    once: true,
    run() {
        const {commands} = client

        console.log(`${client.user?.tag} is ready to be used!`);
        console.log(`${commands.size} Commands Loaded.`);
    },
})