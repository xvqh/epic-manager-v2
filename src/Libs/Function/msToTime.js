module.exports = async (duration) => {
    const days = parseInt(duration / (1000 * 60 * 60 * 24));
    const hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    const minutes = parseInt((duration / (1000 * 60)) % 60);
  
    return `${days ? `${days} jour${days > 1 ? "s" : ""}, ` : ""}${days || hours ? `${hours} heure${hours > 1 ? "s" : ""}, ` : ""}${days || hours || minutes ? `${minutes} minute${minutes > 1 ? "s" : ""}` : ""}`;
  }