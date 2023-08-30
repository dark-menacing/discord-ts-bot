import { ApplicationCommandOptionType, ApplicationCommandType, ColorResolvable, EmbedBuilder } from "discord.js";
import { config } from "../..";
import { Command } from "../../structs/types/command";

export default new Command({
    name: "ban",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    description: "Bans a user",
    options: [
        {
            name: "user",
            description: "The user you want to ban.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "reason",
            description: "The reason you want to ban.",
            type: ApplicationCommandOptionType.String
        }
    ],
    async run({interaction, options}) {
        if (!interaction.inCachedGuild()) return;
        const user = options.getUser("user", true);
        const reason = options.getString("reason") || "No reason provided";

        const {guild} = interaction;

        const {members: memberManager} = guild;

        if (!interaction.member.permissions.has("BanMembers")) {
            interaction.reply({
                content: "You can't ban members.",
                ephemeral: true,
            });
            return;
        }

        const embed = new EmbedBuilder()
        .setTitle('User Banned!')
        .setDescription(`User ${user} has been banned by ${interaction.user}, by the following reason: ${reason}`)
        .setColor(config.colors.blue as ColorResolvable)
        .setAuthor({
            name: "craig tucker",
            iconURL: interaction.user.avatarURL() || undefined,
        })
        .setTimestamp();

        const DMEmbed = new EmbedBuilder()
        .setTitle('You have been banned.')
        .setDescription(`You have been banned by ${interaction.user}, for the following reason: ${reason}`)
        .setColor(config.colors.red as ColorResolvable)
        .setAuthor({
            name: "craig tucker",
            iconURL: interaction.user.avatarURL() || undefined,
        })
        .setTimestamp();

        (await user.createDM()).send({embeds: [DMEmbed]});
        await memberManager.ban(user.id, {reason});
        await interaction.reply({embeds: [embed]});
    }
})