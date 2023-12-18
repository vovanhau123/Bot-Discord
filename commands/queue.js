const { MessageEmbed } = require("discord.js");
const _ = require("lodash");
const prettyMilliseconds = require("pretty-ms");
let d;

module.exports = {
  name: "queue",
  description: "Hiển thị tất cả các bài hát hiện đang được yêu thích",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["q"],
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

    if (!player.queue || !player.queue.length || player.queue === 0) {
      let QueueEmbed = new MessageEmbed()
        .setAuthor("Currently playing", client.botconfig.IconURL)
        .setColor(client.botconfig.EmbedColor)
        .setDescription(
          `[${player.queue.current.title}](${player.queue.current.uri})`
        )
        .addField("Người sử dụng", `${player.queue.current.requester}`, true)
        .setThumbnail(player.queue.current.displayThumbnail());

      // Check if the duration matches the duration of a livestream
      if (player.queue.current.duration == 9223372036854776000) {
        QueueEmbed.addField("Thời lượng", `\`Live\``, true);
      } else {
        QueueEmbed.addField(
          "Thời lượng",
          `${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`[${prettyMilliseconds(player.position, {
            colonNotation: true,
          })} / ${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}]\``
        );
      }

      return message.channel.send(QueueEmbed);
    }

    let Songs = player.queue.map((t, index) => {
      t.index = index;
      return t;
    });

    let ChunkedSongs = _.chunk(Songs, 10); //How many songs to show per-page

    let Pages = ChunkedSongs.map((Tracks) => {
      let SongsDescription = Tracks.map((t) => {
        let d;
        // Check if duration matches duration of livestream
        if (t.duration == 9223372036854776000) {
          d = "Live";
        } else {
          d = prettyMilliseconds(t.duration, { colonNotation: true });
        }
        return `\`${t.index + 1}.\` [${t.title}](${
          t.uri
        }) \n\`${d}\` **|** Được yêu cầu bởi: ${t.requester}\n`;
      }).join("\n");

      let Embed = new MessageEmbed()
        .setAuthor("Queue", client.botconfig.IconURL)
        .setColor(client.botconfig.EmbedColor)
        .setDescription(
          `**Hiện đang chơi:** \n[${player.queue.current.title}](${player.queue.current.uri}) \n\n**Up Next:** \n${SongsDescription}\n\n`
        )
        .addField("Tổng số bài hát: \n", `\`${player.queue.totalSize - 1}\``, true);

      // Check if duration matches duration of livestream
      if (player.queue.duration >= 9223372036854776000) {
        d = "Live";
      } else {
        d = prettyMilliseconds(player.queue.duration, { colonNotation: true });
      }

      Embed.addField("Tổng chiều dài: \n", `\`${d}\``, true).addField(
        "Người sử dụng:",
        `${player.queue.current.requester}`,
        true
      );

      if (player.queue.current.duration == 9223372036854776000) {
        Embed.addField("Thời lượng bài hát hiện tại:", "`Live`");
      } else {
        Embed.addField(
          "Thời lượng bài hát hiện tại::",
          `${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`${prettyMilliseconds(player.position, {
            colonNotation: true,
          })} / ${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}\``
        );
      }

      Embed.setThumbnail(player.queue.current.displayThumbnail());

      return Embed;
    });

    if (!Pages.length || Pages.length === 1)
      return message.channel.send(Pages[0]);
    else client.Pagination(message, Pages);
  },
  SlashCommand: {
    /*
    options: [
      {
          name: "page",
          value: "[page]",
          type: 4,
          required: false,
          description: "Enter the page of the queue you would like to view",
      },
  ],
  */
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Không có gì đang chơi ngay bây giờ...**"
        );

      if (!player.queue || !player.queue.length || player.queue === 0) {
        let QueueEmbed = new MessageEmbed()
          .setAuthor("Currently playing", client.botconfig.IconURL)
          .setColor(client.botconfig.EmbedColor)
          .setDescription(
            `[${player.queue.current.title}](${player.queue.current.uri})`
          )
          .addField("Người sử dụng", `${player.queue.current.requester}`, true)
          .setThumbnail(player.queue.current.displayThumbnail());
        if (player.queue.current.duration == 9223372036854776000) {
          QueueEmbed.addField("Thời lượng", `\`Live\``, true);
        } else {
          QueueEmbed.addField(
            "Thời lượng",
            `${
              client.ProgressBar(
                player.position,
                player.queue.current.duration,
                15
              ).Bar
            } \`[${prettyMilliseconds(player.position, {
              colonNotation: true,
            })} / ${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}]\``
          );
        }
        return interaction.send(QueueEmbed);
      }

      let Songs = player.queue.map((t, index) => {
        t.index = index;
        return t;
      });

      let ChunkedSongs = _.chunk(Songs, 10); //How many songs to show per-page

      let Pages = ChunkedSongs.map((Tracks) => {
        let SongsDescription = Tracks.map((t) => {
          let d;
          // Check if duration matches duration of livestream
          if (t.duration == 9223372036854776000) {
            d = "Live";
          } else {
            d = prettyMilliseconds(t.duration, { colonNotation: true });
          }
          return `\`${t.index + 1}.\` [${t.title}](${
            t.uri
          }) \n\`${d}\` **|** Được yêu cầu bởi: ${t.requester}\n`;
        }).join("\n");

        let Embed = new MessageEmbed()
          .setAuthor("Queue", client.botconfig.IconURL)
          .setColor(client.botconfig.EmbedColor)
          .setDescription(
            `**Hiện đang chơi:** \n[${player.queue.current.title}](${player.queue.current.uri}) \n\n**Up Next:** \n${SongsDescription}\n\n`
          )
          .addField(
            "Tổng số bài hát: \n",
            `\`${player.queue.totalSize - 1}\``,
            true
          );

        // Check if duration matches duration of livestream
        if (player.queue.duration >= 9223372036854776000) {
          d = "Live";
        } else {
          d = prettyMilliseconds(player.queue.duration, {
            colonNotation: true,
          });
        }

        Embed.addField("Tổng chiều dài: \n", `\`${d}\``, true).addField(
          "Người sử dụng:",
          `${player.queue.current.requester}`,
          true
        );

        if (player.queue.current.duration == 9223372036854776000) {
          Embed.addField("Thời lượng bài hát hiện tại:", "`Live`");
        } else {
          Embed.addField(
            "Thời lượng bài hát hiện tại:",
            `${
              client.ProgressBar(
                player.position,
                player.queue.current.duration,
                15
              ).Bar
            } \`${prettyMilliseconds(player.position, {
              colonNotation: true,
            })} / ${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}\``
          );
        }

        Embed.setThumbnail(player.queue.current.displayThumbnail());

        return Embed;
      });

      if (!Pages.length || Pages.length === 1)
        return interaction.send(Pages[0]);
      else client.Pagination(interaction, Pages);
    },
  },
};
