import React, { useEffect, useState } from 'react';
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import './LiveClockStyle.css';

export const Clock = ({ timeTillDate, timeFormat }) => {
    const [days, setDays] = useState(undefined);
    const [hours, setHours] = useState(undefined);
    const [minutes, setMinutes] = useState(undefined);
    const [seconds, setSeconds] = useState(undefined);

    useEffect(() => {
        const interval = setInterval(() => {
            const then = new Date(timeTillDate);
            const now = new Date();
            const countdown = differenceInSeconds(then, now);
            const days = Math.floor(countdown / 86400);
            const hours = Math.floor((countdown % 86400) / 3600);
            const minutes = Math.floor((countdown % 3600) / 60);
            const seconds = countdown % 60;

            setDays(days);
            setHours(hours);
            setMinutes(minutes);
            setSeconds(seconds);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeTillDate]);

    const daysRadius = mapNumber(days, 30, 0, 0, 360);
    const hoursRadius = mapNumber(hours, 24, 0, 0, 360);
    const minutesRadius = mapNumber(minutes, 60, 0, 0, 360);
    const secondsRadius = mapNumber(seconds, 60, 0, 0, 360);

    if (!seconds) {
        return null;
    }

    return (
        <div>
            <h1>Countdown</h1>
            <div className='countdown-wrapper'>
                {days !== undefined && (
                    <div className='countdown-item'>
                        <SVGCircle radius={daysRadius} />
                        {days}
                        <span>days</span>
                    </div>
                )}
                {hours !== undefined && (
                    <div className='countdown-item'>
                        <SVGCircle radius={hoursRadius} />
                        {hours}
                        <span>hours</span>
                    </div>
                )}
                {minutes !== undefined && (
                    <div className='countdown-item'>
                        <SVGCircle radius={minutesRadius} />
                        {minutes}
                        <span>minutes</span>
                    </div>
                )}
                {seconds !== undefined && (
                    <div className='countdown-item'>
                        <SVGCircle radius={secondsRadius} />
                        {seconds}
                        <span>seconds</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const SVGCircle = ({ radius }) => (
    <svg className='countdown-svg'>
        <path fill="none" stroke="#333" strokeWidth="4" d={describeArc(50, 50, 48, 0, radius)} />
    </svg>
);

const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
    return d;
};

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

const mapNumber = (number, in_min, in_max, out_min, out_max) => {
    return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

export default Clock;