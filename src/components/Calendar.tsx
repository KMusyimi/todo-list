import {JSX, useId, useState} from "react";
import {daysInWeekArr} from "../utils.ts";
import moment from "moment";

export default function Calendar(): JSX.Element {
    const [currentDate,] = useState(() => new Date());

    function RenderDates() {
        const id = useId();
        const startDay = currentDate.getDay();
        const strDate = currentDate.toISOString().slice(0, 10);
        const arrDays = [...daysInWeekArr.slice(startDay - 1), ...daysInWeekArr.slice(0, startDay - 1)];

        return arrDays.map((daysStr, idx) => {
            const date = new Date();
            // d.getDate() - d.getDay() + idx, we take the current day (23), remove the day of week (0 for Sunday, 2 for Tuesday... Basically we calculate the last Sunday date) et add number of days to have every date in the week.
            const day = date.setDate(date.getDate() - date.getDay() + (startDay - 1 + idx));
            const formatDate: string = new Date(day).toISOString().slice(0, 10);

            const dateWeek = formatDate.substring(formatDate.lastIndexOf('-') + 1);

            return (
                <button className={strDate === formatDate ? 'date-btn today' : 'date-btn'
                } type="button"
                        key={`day-${id + idx.toString()}`}>
                    <div className="day"> {daysStr.slice(0, 3)} </div>
                    < div className="date"> {dateWeek} </div>
                </button>)
        })

    }
    return (<>
        <header>
            <h1>{moment().calendar().split(' ')[0]}</h1>
        </header>
        <div className="calendar">
            <RenderDates/>
        </div>
    </ >)
}