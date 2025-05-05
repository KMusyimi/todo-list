import { JSX, useCallback, useEffect, useId, useState } from "react";
import moment from "moment";
import { useSearchParams } from "react-router-dom";

interface DateProps {
    dateParam: string | null;
    filterChange: (key: string, value: string | null) => void
}


function Dates({ filterChange, dateParam }: DateProps) {
    const [moments,] = useState(() => moment());

    const id = useId();
    
    useEffect(()=> {
        const selectedDate: HTMLButtonElement | null = document.querySelector('.date-btn.selected') ;
        if(selectedDate){
            selectedDate.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);


    const Dates = useCallback(() => {
        const currentDate = moments.format("YYYY-MM-DD");
        const currentDay = moments.weekday();
        const prevDay = currentDay - 1;

        return Array.from(Array(7)).map((_, idx) => {
            const weekDay = moment().weekday(prevDay + idx);
            const fmtDate = weekDay.format('YYYY-MM-DD');
            const date = weekDay.format('DD');
            const selected = !dateParam ? currentDate === fmtDate : (dateParam === fmtDate ? true : false);
            return (
                <button className={selected ? 'date-btn bg-gradient selected' : 'date-btn'
                } key={`day-${id + idx.toString()}`}
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => { 
                        filterChange('date', currentDate === fmtDate ? null : fmtDate) 
                        e.currentTarget.scrollIntoView({behavior:'smooth', block:'start'});
                    }}>
                    <p className="day"> {moment(weekDay).format('ddd')} </p>
                    <p className="date"> {date} </p>
                </button>);
        })
    }, [dateParam, filterChange, id, moments])


    return <Dates />

}

export default function Calendar(): JSX.Element {
    const [moments, setMoments] = useState<moment.Moment | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const dateParam = searchParams.get('date');

    useEffect(() => {
        setMoments(() => moment(dateParam ?? Date.now()));
    }, [dateParam]);

    const handleFilterChange = useCallback((key: string, value: string | null) => {
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
                <h1>{moments?.calendar().split(' ')[0]} · {moments?.format("ll").split(/,/g)[0]}</h1>
            </header>
            <div className="calendar">
                <Dates filterChange={handleFilterChange} dateParam={dateParam} />
            </div>
        </>)
}