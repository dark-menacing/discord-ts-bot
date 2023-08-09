import { ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/command";

export default new Command({
    name: "ping",
    type: ApplicationCommandType.ChatInput,
    description: "Replies with pong",
    async run({interaction}) {
        interaction.reply({
            content: `pong! 🏓`,
            ephemeral: true,
        });
    }
})