import { ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/command";

export default new Command({
    name: "ping",
    type: ApplicationCommandType.ChatInput,
    description: "Replies with pong",
    run({interaction}) {
        interaction.reply('bing chilling');
    }
})