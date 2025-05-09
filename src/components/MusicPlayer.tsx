import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverArt: string;
}

interface MusicPlayerProps {
  currentSong?: Song;
  onNext?: () => void;
  onPrevious?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentSong,
  onNext,
  onPrevious
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-white/5 border-t border-white/10 p-4 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
      <div className="max-w-7xl mx-auto flex items-center space-x-6">
        {/* Cover Art */}
        <div className="relative w-16 h-16 group">
          <img
            src={currentSong.coverArt}
            alt={currentSong.title}
            className="w-full h-full rounded-lg object-cover shadow-[0_0_10px_rgba(0,255,255,0.3)] group-hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* Song Info */}
        <div className="flex-1">
          <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] font-bold">{currentSong.title}</h3>
          <p className="text-white/70 text-sm">{currentSong.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onPrevious}
            className="text-white/70 hover:text-[#00FFFF] transition-all duration-200 hover:scale-110"
          >
            <SkipBack size={24} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full backdrop-blur-md bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all duration-200 hover:scale-110 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={onNext}
            className="text-white/70 hover:text-[#00FFFF] transition-all duration-200 hover:scale-110"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-white/50 text-sm">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00FFFF] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            />
            <span className="text-white/50 text-sm">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="text-white/70 hover:text-[#00FFFF] transition-all duration-200 hover:scale-110"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00FFFF] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
          />
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />
    </div>
  );
};

export default MusicPlayer;