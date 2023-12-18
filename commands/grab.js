const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
let d;

module.exports = {
  name: "grab",
  description: "Lưu bài hát hiện tại vào Tin nhắn trực tiếp của bạn",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["save"],
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
    if (!player.playing)
      return client.sendTime(
        message.channel,
        "❌ | **Không có gì đang chơi ngay bây giờ...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Bạn phải ở trong một kênh thoại để phát nội dung nào đó!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        "❌ | **Bạn phải ở cùng kênh thoại với tôi để sử dụng lệnh này!**"
      );
    let GrabEmbed = new MessageEmbed()
      .setAuthor(
        `Song saved`,
        client.user.displayAvatarURL({
          dynamic: true,
        })
      )
      .setThumbnail(
        `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
      )
      .setURL(player.queue.current.uri)
      .setColor(client.botconfig.EmbedColor)
      .setTitle(`**${player.queue.current.title}**`);

    // Check if duration matches duration of livestream

    if (player.queue.current.duration == 9223372036854776000) {
      d = "Live";
    } else {
      d = prettyMilliseconds(player.queue.current.duration, {
        colonNotation: true,
      });
    }
    GrabEmbed.addField(`⌛ khoảng thời gian: `, `\`${d}\``, true)
      .addField(`🎵 tác giả: `, `\`${player.queue.current.author}\``, true)
      .addField(
        `▶ Play:`,
        `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}play ${
          player.queue.current.uri
        }\``
      )
      .addField(`🔎 Đã lưu trong:`, `<#${message.channel.id}>`)
      .setFooter(
        `Người sử dụng: ${player.queue.current.requester.tag}`,
        player.queue.current.requester.displayAvatarURL({
          dynamic: true,
        })
      );
    message.author.send(GrabEmbed).catch((e) => {
      return message.channel.send("**❌ DMs của bạn bị vô hiệu hóa**");
    });

    client.sendTime(message.channel, "✅ | **Kiểm tra dms của bạn!**");
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
      const user = client.users.cache.get(interaction.member.user.id);
      const member = guild.members.cache.get(interaction.member.user.id);
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Không có gì đang chơi ngay bây giờ...**"
        );
      if (!player.playing)
        return client.sendTime(
          interaction,
          "❌ | **Không có gì đang chơi ngay bây giờ...**"
        );
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
      try {
        let embed = new MessageEmbed()
          .setAuthor(`Song saved: `, client.user.displayAvatarURL())
          .setThumbnail(
            `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
          )
          .setURL(player.queue.current.uri)
          .setColor(client.botconfig.EmbedColor)
          .setTimestamp()
          .setTitle(`**${player.queue.current.title}**`);
        if (player.queue.current.duration == 9223372036854776000) {
          d = "Live";
        } else {
          d = prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          });
        }
        embed
          .addField(`⌛ Thời lượng: `, `\`${d}\``, true)
          .addField(`🎵 Tác giả: `, `\`${player.queue.current.author}\``, true)
          .addField(
            `▶ Play:`,
            `\`${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
            }play ${player.queue.current.uri}\``
          )
          .addField(`🔎 Saved:`, `<#${interaction.channel_id}>`)
          .setFooter(
            `Người sử dụng: ${player.queue.current.requester.tag}`,
            player.queue.current.requester.displayAvatarURL({
              dynamic: true,
            })
          );
        user.send(embed);
      } catch (e) {
        return client.sendTime(interaction, "**❌DM của bạn bị vô hiệu hóa**");
      }

      client.sendTime(interaction, "✅ | **Check your DMs!**");
    },
  },
};
