import React, { forwardRef } from "react";

import { Icon } from 'semantic-ui-react';
import { Slider, Rail, Tracks } from "react-compound-slider";
import { TooltipRail, SliderRail, Track } from "./Slider";
import { formatTimestamp } from "../../../utils/video";

const Controls = forwardRef(
  (
    {
      onSeekMouseDown,
      onSeekMouseUp,
      onRewind,
      onPlayPause,
      onFastForward,
      playing,
      onMute,
      muted,
      playbackRate,
      onPlaybackRateChange,
      onToggleFullScreen,
      volume,
      onVolumeChange,
      currentTime,
      duration,
      isFullscreen,
      seeking,
      jumpedTime,
      videoType
    },
    ref
  ) => {

    const sliderStyle = {
      position: "relative",
      width: "100%"
    };
    return (
      <div ref={ref} className="controlsContainer">
        {duration &&
          <div className="controls">
            <Icon
              size="large"
              onClick={onPlayPause}
              // className="control action"
              name={playing ? 'pause' : 'play'}
            />
            {!['twitch'].includes(videoType) &&
              <div className="timestamps elapsed" style={{ width: duration > 3600 ? '50px' : '40px' }}>
                <span>{seeking ? formatTimestamp(jumpedTime) : formatTimestamp(currentTime)}</span>
              </div>
            }
            <div className='seekSlider'>
              {!['twitch'].includes(videoType) &&
                <Slider
                  mode={1}
                  step={1}
                  domain={[0, +duration]}
                  rootStyle={sliderStyle}
                  // onSlideStart={onSeekMouseDown}
                  onSlideEnd={onSeekMouseUp}
                  values={seeking ? [jumpedTime] : [currentTime]}
                >
                  <Rail>
                    {(railProps) => <TooltipRail {...railProps} />}
                  </Rail>
                  <Tracks right={false}>
                    {({ tracks, getTrackProps }) => (
                      <div>
                        {tracks.map(({ id, source, target }) => (
                          <Track
                            key={id}
                            source={source}
                            target={target}
                            getTrackProps={getTrackProps}
                          />
                        ))}
                      </div>
                    )}
                  </Tracks>
                </Slider>
              }
            </div>
            {!['twitch'].includes(videoType) &&
              <div className="timestamps total">
                <span>{formatTimestamp(duration)}</span>
              </div>
            }
            <Icon
              size="large"
              onClick={onMute}
              // className="control action"
              name={muted ? 'volume off' : (volume > 0.5 ? 'volume up' : 'volume down')}
              title="Mute"
            />

            <div className='volumeSlider'>
              <Slider
                mode={1}
                step={0.1}
                domain={[0, 1]}
                rootStyle={sliderStyle}
                onUpdate={onVolumeChange}
                // onChange={this.onVolumeChange}
                values={[muted ? 0 : volume]}
              >
                <Rail>
                  {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
                </Rail>
                <Tracks right={false}>
                  {({ tracks, getTrackProps }) => (
                    <div>
                      {tracks.map(({ id, source, target }) => (
                        <Track
                          key={id}
                          source={source}
                          target={target}
                          getTrackProps={getTrackProps}
                        />
                      ))}
                    </div>
                  )}
                </Tracks>
              </Slider>
            </div>
            {/* <div className="playback">
            <Button onClick={() => onPlaybackRateChange(((playbackRate + 0.25) % 2.25))}>{playbackRate}x</Button> */}
            {/* <Popup
              trigger={<Button>{playbackRate}x</Button>}
              content={<div>
                <Button.Group vertical>
                  {[0.5, 1, 1.5, 2].map((rate) => (
                    <Button
                      key={rate}
                      onClick={() => onPlaybackRateChange(rate)}
                    >
                      {rate}x
                    </Button>
                  ))}
                </Button.Group>
              </div>}
              on='click'
              // hoverable
              pinned
            /> */}
            {/* </div> */}
            <Icon
              size='large'
              onClick={onToggleFullScreen}
              name={isFullscreen ? 'compress' : 'expand'}
            />
          </div>
        }
      </div >
    );
  }
);

export default Controls;
