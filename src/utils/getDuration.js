function getDuration(file) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);

    audio.onloadedmetadata = () => {
      resolve(Math.round(audio.duration));
    };
  });
}

export default getDuration;
