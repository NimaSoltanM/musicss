import { useState, useRef } from 'react';
import MusicPicker from './components/MusicPicker';
import { Container, Text } from '@mantine/core';
import MusicPlayer from './components/MusicPlayer';
import getDuration from './utils/getDuration';

function App() {
  const [songs, setSongs] = useState([]);
  const [url, setUrl] = useState('');
  const audioRef = useRef('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSongIndex, setActiveSongIndex] = useState(0);

  const playSongHandler = (index) => {
    setActiveSongIndex(index);
    const song = songs[index];

    setSongs((prevSongs) =>
      prevSongs.map((songItem) => {
        return songItem === song
          ? { ...songItem, active: true }
          : { ...songItem, active: false };
      })
    );

    const { file } = song;

    const newUrl = URL.createObjectURL(file);

    if (url) {
      URL.revokeObjectURL(url);
    }

    setUrl(newUrl);

    setIsPlaying(false);
  };

  const addSongHandler = async (files) => {
    const songs = await Promise.all(
      files.map(async (file) => {
        const duration = await getDuration(file);
        return {
          file,
          duration,
          active: false,
        };
      })
    );

    setSongs((prevSongs) => [...prevSongs, ...songs]);

    console.log(songs);
  };

  const togglePlayHandler = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else if (audioRef.current.played) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const changeSongHandler = (action) => {
    if (action === 'NEXT') {
      const nextIndex = activeSongIndex + 1;
      if (nextIndex < songs.length) {
        playSongHandler(nextIndex);
      }
    }

    if (action === 'PREV') {
      const prevIndex = activeSongIndex - 1;
      if (prevIndex >= 0) {
        playSongHandler(prevIndex);
      }
    }
  };

  return (
    <>
      <Container>
        <MusicPicker onAdd={addSongHandler} songs={songs} />

        {songs.map((song, index) => (
          <div
            className={`card ${song.active && 'active'}`}
            key={song.file.name}
            onClick={() => playSongHandler(index)}
          >
            <Text
              variant='gradient'
              gradient={{ from: 'cyan', to: 'purple', deg: 45 }}
              sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
              fz='md'
              fw={500}
            >
              {song.file.name}
            </Text>
          </div>
        ))}
      </Container>

      {songs.length && url ? (
        <MusicPlayer
          url={url}
          audioRef={audioRef}
          onTogglePlay={togglePlayHandler}
          isPlaying={isPlaying}
          onChangeSong={changeSongHandler}
          duration={songs[activeSongIndex].duration}
          setIsPlaying={setIsPlaying}
        />
      ) : null}
    </>
  );
}

export default App;
