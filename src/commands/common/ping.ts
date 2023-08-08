import { ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/command";

export default new Command({
    name: "ping",
    type: ApplicationCommandType.ChatInput,
    description: "Replies with your current ping",
    async run({interaction}) {
        interaction.reply(`pong! 🏓`);
    }
})