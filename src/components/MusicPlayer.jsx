import { Group, ActionIcon, Slider } from '@mantine/core';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

export default function MusicPlayer({
  url,
  audioRef,
  onTogglePlay,
  isPlaying,
  onChangeSong,
  duration,
  setIsPlaying,
}) {
  const [time, setTime] = useState(0);

  const handleTimeUpdate = () => {
    setTime(audioRef.current.currentTime);
  };

  useEffect(() => {
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    };
  }, [audioRef]);

  useEffect(() => {
    audioRef.current.onended = () => {
      setTime(0);
      setIsPlaying(false);
    };
  }, [audioRef]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time % 60);
    return `${minutes}:${seconds}`;
  };

  const handleChange = (value) => {
    setTime(value);
    audioRef.current.currentTime = value;
  };

  return (
    <div className='music-player-container'>
      <div className='music-player'>
        <Group position='apart'>
          <Group>
            <ActionIcon
              color='cyan'
              size='xl'
              onClick={() => onChangeSong('PREV')}
            >
              <FiSkipBack size='1.75rem' />
            </ActionIcon>
            <ActionIcon color='cyan' size='xl' onClick={onTogglePlay}>
              {isPlaying ? (
                <FiPause size='1.75rem' />
              ) : (
                <FiPlay size='1.75rem' />
              )}
            </ActionIcon>
            <ActionIcon
              color='cyan'
              size='xl'
              onClick={() => onChangeSong('NEXT')}
            >
              <FiSkipForward size='1.75rem' />
            </ActionIcon>
          </Group>
          <Group>
            <p>{formatTime(time)}</p>
            <Slider
              w='300px'
              min={0}
              max={duration}
              value={time}
              label={(value) => formatTime(value)}
              color='cyan'
              onChange={handleChange}
            />
            <p>{formatTime(duration)}</p>
          </Group>
        </Group>
        <audio src={url} ref={audioRef} />
      </div>
    </div>
  );
}

MusicPlayer.propTypes = {
  url: PropTypes.string,
  audioRef: PropTypes.object,
  onTogglePlay: PropTypes.func,
  isPlaying: PropTypes.bool,
  onChangeSong: PropTypes.func,
  duration: PropTypes.number,
  setIsPlaying: PropTypes.func,
};
