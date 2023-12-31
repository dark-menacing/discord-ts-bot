import { ApplicationCommandData, ButtonInteraction, Collection, CommandInteraction, CommandInteractionOptionResolver, ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js";
import { ExtendedClient } from "../ExtendedClient";

interface CommandProps {
    client: ExtendedClient,
    interaction: CommandInteraction,
    options: CommandInteractionOptionResolver
};

export type ComponentsButtons = Collection<string, (interaction: ButtonInteraction) => any>
export type ComponentsSelect = Collection<string, (interaction: StringSelectMenuInteraction) => any>
export type ComponentsModal = Collection<string, (interaction: ModalSubmitInteraction) => any>

interface CommandComponents {
    buttons?: ComponentsButtons,
    select?: ComponentsSelect;
    modals?: ComponentsModal
}

export type CommandType = ApplicationCommandData & CommandComponents & {
    run(props: CommandProps): any
}

export class Command {
    constructor(options: CommandType){
        Object.assign(this, options);
    }
}