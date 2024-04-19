module.exports = async (interaction, content, components, ctxEmbed, embedString) => {
  const defaultFooter = {
    text: 'ⲈpicBots',
    iconURL: 'https://media.discordapp.net/attachments/1002173915549937714/1076559635563167895/Illustration_sans_titre.png?width=676&height=676',
    Timestamp: true
  };

  const options = {
    content: content ?? null,
    embeds: embedString ? [embedString && !embedString.color ? { ...embedString, color: parseInt(process.env.COLOR, 16) } : embedString] : null,
    components: components ?? [],
  };

  if (options.embeds && options.embeds.length > 0 && !options.embeds[0].footer) {
    options.embeds[0].footer = defaultFooter;
  }

  return ctxEmbed ? options.embeds[0] : await interaction.reply(components ? options : {});
};
