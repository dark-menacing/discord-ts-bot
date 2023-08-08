import { CommandInteractionOptionResolver } from "discord.js";
import { client } from '../..';
import { Event } from "../../structs/types/event";

export default new Event({
    name: 'interactionCreate',
    run(interaction) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            const options = interaction.options as CommandInteractionOptionResolver;
            
            command.run({client, interaction, options});
        }
        if (interaction.isModalSubmit()) client.modals.get(interaction.customId)?.(interaction);
        if (interaction.isButton()) client.buttons.get(interaction.customId)?.(interaction); 
        if (interaction.isStringSelectMenu()) client.selects.get(interaction.customId)?.(interaction);   
    },
});