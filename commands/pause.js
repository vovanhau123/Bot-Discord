const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "pause",
  description: "Tạm dừng âm nhạc",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: [],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Không có gì đang chơi ngay bây giờ...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Bạn phải ở trong một kênh thoại để sử dụng lệnh này!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        "❌ | **Bạn phải ở cùng kênh thoại với tôi để sử dụng lệnh này!**"
      );
    if (player.paused)
      return client.sendTime(
        message.channel,
        "❌ | **Âm nhạc đã bị tạm dừng!**"
      );
    player.pause(true);
    let embed = new MessageEmbed()
      .setAuthor(`Paused!`, client.botconfig.IconURL)
      .setColor(client.botconfig.EmbedColor)
      .setDescription(`Type \`${GuildDB.prefix}resume\` để tiếp tục chơi!`);
    await message.channel.send(embed);
    await message.react("✅");
  },

  SlashCommand: {
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
          "❌ | **Bạn phải ở trong một kênh thoại để sử dụng lệnh này.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          "❌ | **Bạn phải ở cùng kênh thoại với tôi để sử dụng lệnh này!**"
        );

      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Không có gì đang chơi ngay bây giờ...**"
        );
      if (player.paused)
        return client.sendTime(interaction, "Âm nhạc đã bị tạm dừng!");
      player.pause(true);
      client.sendTime(interaction, "**⏸ Paused!**");
    },
  },
};
