import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { formatTimestamp } from "../../../utils/video";

const themeColor = '#43a3f0';
const sliderBg = '#ffffff40';

// *******************************************************
// TOOLTIP RAIL
// *******************************************************
const railStyle = {
    position: "absolute",
    width: "100%",
    height: 40,
    transform: "translate(0%, -50%)",
    cursor: "pointer",
    zIndex: 300,
};

const railCenterStyle = {
    position: "absolute",
    width: "100%",
    height: 8,
    transform: "translate(0%, -50%)",
    borderRadius: 4,
    pointerEvents: "none",
    backgroundColor: sliderBg
};


export class TooltipRail extends Component {
    state = {
        value: null,
        percent: null,
    };

    onMouseEnter = () => {
        document.addEventListener('mousemove', this.onMouseMove);
    };

    onMouseLeave = () => {
        this.setState({ value: null, percent: null });
        document.removeEventListener('mousemove', this.onMouseMove);
    };

    onMouseMove = (e) => {
        const { activeHandleID, getEventData } = this.props;

        if (activeHandleID) {
            this.setState({ value: null, percent: null });
        } else {
            this.setState(getEventData(e));
        }
    };

    render() {
        const { value, percent } = this.state;
        const { activeHandleID, getRailProps } = this.props;

        return (
            <Fragment>
                {!activeHandleID && value ? (
                    <div
                        style={{
                            left: `${percent}%`,
                            position: 'absolute',
                            marginLeft: '-11px',
                            marginTop: '-35px',
                        }}
                    >
                        <div className="tooltip">
                            <span className="tooltiptext">{formatTimestamp(value)}</span>
                        </div>
                    </div>
                ) : null}
                <div
                    style={railStyle}
                    {...getRailProps({
                        onMouseEnter: this.onMouseEnter,
                        onMouseLeave: this.onMouseLeave,
                    })}
                />
                <div style={railCenterStyle} />
            </Fragment>
        );
    }
}

// *******************************************************
// RAIL
// *******************************************************
const railOuterStyle = {
    position: "absolute",
    width: "100%",
    height: 40,
    transform: "translate(0%, -50%)",
    cursor: "pointer"
    // border: "1px solid grey"
};

const railInnerStyle = {
    position: "absolute",
    width: "100%",
    height: 8,
    transform: "translate(0%, -50%)",
    borderRadius: 4,
    pointerEvents: "none",
    backgroundColor: sliderBg
};

export function SliderRail({ getRailProps }) {
    return (
        <Fragment>
            <div style={railOuterStyle} {...getRailProps()} />
            <div style={railInnerStyle} />
        </Fragment>
    );
}

SliderRail.propTypes = {
    getRailProps: PropTypes.func.isRequired
};

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
export function Handle({
    domain: [min, max],
    handle: { id, value, percent },
    disabled,
    getHandleProps
}) {
    return (
        <Fragment>
            <div
                style={{
                    left: `${percent}%`,
                    position: "absolute",
                    transform: "translate(-50%, -50%)",
                    WebkitTapHighlightColor: "rgba(0,0,0,0)",
                    zIndex: 5,
                    width: 24,
                    height: 42,
                    cursor: "pointer",
                    // border: "1px solid white",
                    backgroundColor: "none"
                }}
                {...getHandleProps(id)}
            />
            <div
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                style={{
                    left: `${percent}%`,
                    position: "absolute",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.3)",
                    backgroundColor: disabled ? "#666" : "#fff"
                }}
            />
        </Fragment>
    );
}

Handle.propTypes = {
    domain: PropTypes.array.isRequired,
    handle: PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired
    }).isRequired,
    getHandleProps: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

Handle.defaultProps = {
    disabled: false
};

// *******************************************************
// TRACK COMPONENT
// *******************************************************
export function Track({ source, target, getTrackProps, disabled }) {
    return (
        <div
            style={{
                position: "absolute",
                transform: "translate(0%, -50%)",
                height: 8,
                zIndex: 1,
                backgroundColor: disabled ? "#999" : themeColor,
                borderRadius: 4,
                cursor: "pointer",
                left: `${source.percent}%`,
                width: `${target.percent - source.percent}%`
            }}
            {...getTrackProps()}
        />
    );
}

Track.propTypes = {
    source: PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired
    }).isRequired,
    target: PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired
    }).isRequired,
    getTrackProps: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

Track.defaultProps = {
    disabled: false
};

// *******************************************************
// TICK COMPONENT
// *******************************************************
export function Tick({ tick, count, format }) {
    return (
        <div>
            <div
                style={{
                    position: "absolute",
                    marginTop: 14,
                    width: 1,
                    height: 5,
                    backgroundColor: "rgb(200,200,200)",
                    left: `${tick.percent}%`
                }}
            />
            <div
                style={{
                    position: "absolute",
                    marginTop: 22,
                    fontSize: 10,
                    textAlign: "center",
                    fontFamily: "Arial, san-serif",
                    marginLeft: `${-(100 / count) / 2}%`,
                    width: `${100 / count}%`,
                    left: `${tick.percent}%`
                }}
            >
                {format(tick.value)}
            </div>
        </div>
    );
}

Tick.propTypes = {
    tick: PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired
    }).isRequired,
    count: PropTypes.number.isRequired,
    format: PropTypes.func.isRequired
};

Tick.defaultProps = {
    format: d => d
};
