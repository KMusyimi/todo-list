import {JSX, useCallback, useId, useState} from "react";
import {daysInWeekArr} from "../utils.ts";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { BsDot } from "react-icons/bs";
import { MdOutlineClear } from "react-icons/md";

interface DateProps{
    filterChange: (key: string, value: string | null) => void
}


function Dates({ filterChange }: DateProps) {

    const [currentDate,] = useState(() => new Date());
    const id = useId();
    
    const getDates = useCallback(()=>{
        const startDay = currentDate.getDay();
        const strDate = currentDate.toISOString().slice(0, 10);
        const arrDays = [...daysInWeekArr.slice(startDay - 1), ...daysInWeekArr.slice(0, startDay - 1)];
        return arrDays.map((daysStr, idx) => {
            const date = new Date();
            // d.getDate() - d.getDay() + idx, we take the current day (23), remove the day of week (0 for Sunday, 2 for Tuesday... Basically we calculate the last Sunday date) et add number of days to have every date in the week.
            const day = date.setDate(date.getDate() - date.getDay() + (startDay - 1 + idx));
            const formatDate: string = new Date(day).toISOString().slice(0, 10);
            const dateWeek = formatDate.substring(formatDate.lastIndexOf('-') + 1);

            const dateStr = moment().format('YYYY-MM-') + dateWeek;

            return (
                <button className={strDate === formatDate ? 'date-btn today' : 'date-btn'
                } key={`day-${id + idx.toString()}`}
                    type="button"
                    onClick={() => { filterChange('date', dateStr) }}>
                    <div className="day"> {daysStr.slice(0, 3)} </div>
                    < div className="date"> {dateWeek} </div>
                </button>)
        })
    }, [currentDate, filterChange, id])

   
    return <>{getDates()}</>

}

export default function Calendar(): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();
    const filterDate = searchParams.get('date');

    const headerDate = moment(filterDate ?? Date.now()).format('lll').split(' ').slice(0, 2).join(' ').replace(/,/g, '');


    const handleFilterChange = useCallback((key: string, value: string | null)=> {
        setSearchParams(prevParams => {
            if (value === null) {
                prevParams.delete(key);
            } else {
                prevParams.set(key, value);
            }
            return prevParams;
        })
    }, [setSearchParams]);


    

    return (
    <>
        <header>
            <h1>{ moment(filterDate?? Date.now()).calendar().split(' ')[0]}<BsDot />{headerDate}</h1>
        </header>
        {filterDate && <div className="btn-container">
            <button type="button" className="clear-btn" onClick={()=> {handleFilterChange('date', null)}}> <MdOutlineClear /> clear filter</button>

        </div>}
        <div className="calendar">
            <Dates filterChange={handleFilterChange}/>
        </div>
    </>)
}