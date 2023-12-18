const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "youtube",
  description: "Bắt đầu YouTube",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["yt"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {require("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Bạn phải ở trong một kênh thoại để phát nội dung nào đó!**"
      );
    if (
      !message.member.voice.channel
        .permissionsFor(message.guild.me)
        .has("CREATE_INSTANT_INVITE")
    )
      return client.sendTime(
        message.channel,
        "❌ | **Bot không có Quyền tạo lời mời**"
      );

    let Invite = await message.member.voice.channel.activityInvite(
      "880218394199220334"
    ); //Made using discordjs-activity package
    let embed = new MessageEmbed()
      .setAuthor(
        "YouTube Together",
        "https://cdn.discordapp.com/emojis/749289646097432667.png?v=1"
      )
      .setColor("#FF0000").setDescription(`
Using **YouTube Together** you can watch YouTube with your friends in a Voice Channel. Click *Join YouTube Together* to join in!

__**[Join YouTube Together](https://discord.com/invite/${Invite.code})**__

⚠ **Note:** This only works in Desktop
`);
    message.channel.send(embed);
  },
  SlashCommand: {
    options: [],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | Bạn phải ở trong một kênh thoại để sử dụng lệnh này."
        );
      if (
        !member.voice.channel
          .permissionsFor(guild.me)
          .has("CREATE_INSTANT_INVITE")
      )
        return client.sendTime(
          interaction,
          "❌ | **Bot không có Quyền tạo lời mời**"
        );

      let Invite = await member.voice.channel.activityInvite(
        "755600276941176913"
      ); //Made using discordjs-activity package
      let embed = new MessageEmbed()
        .setAuthor(
          "YouTube Together",
          "https://cdn.discordapp.com/emojis/749289646097432667.png?v=1"
        )
        .setColor("#FF0000").setDescription(`
Using **YouTube Together** you can watch YouTube with your friends in a Voice Channel. Click *Join YouTube Together* to join in!

__**[Join YouTube Together](https://discord.com/invite/${Invite.code})**__

⚠ **Note:** This only works in Desktop
`);
      interaction.send(embed.toJSON());
    },
  },
};
