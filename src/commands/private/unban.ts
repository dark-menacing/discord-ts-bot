import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/command";

export default new Command({
    name: "unban",
    type: ApplicationCommandType.ChatInput,
    dmPermission: false,
    description: "Unbans a user",
    options: [
        {
            name: "username",
            description: "The user you want to unban.",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    async run({interaction, options}) {
        if (!interaction.inCachedGuild()) return;
        const user = options.getString("username", true);

        const {guild} = interaction;

        const {members: memberManager} = guild;

        if (!interaction.member.permissions.has("BanMembers")) {
            interaction.reply({
                content: "You can't unban members.",
                ephemeral: true,
            });
            return;
        }

        const bans = await guild.bans.fetch();
        for (const ban of bans) {
            if (ban[1].user.username == user) {
                await memberManager.unban(ban[1].user);
                await interaction.reply({
                    content: "User unbanned.",
                    ephemeral: true
                });
            }
        }
    }
});