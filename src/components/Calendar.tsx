import { CSSProperties, JSX, useCallback, useEffect, useId, useState } from "react";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { ActiveDates } from "../api";
import { PiDotFill } from "react-icons/pi";

interface DateProps {
    dateParam: string | null;
    filterChange: (key: string, value: string | null) => void;
    activeDates: ActiveDates | null | undefined;
}


function Dates({ filterChange, dateParam, activeDates }: DateProps): JSX.Element {
    const completedStyles = {
        height: '68px',
        gap: '.255em',
        justifyContent: 'center'
    }as CSSProperties;
    const [moments,] = useState(() => moment());
    const [searchParams] = useSearchParams();
    const completed = searchParams.get('tasks');
    const id = useId();

    
    useEffect(()=> {
        const selectedDate: HTMLButtonElement | null = document.querySelector('.date-btn.selected');
        if(selectedDate){
            selectedDate.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, []);
    const handleBtnClick = useCallback((currentDate: string, fmtDate: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        filterChange('date', currentDate === fmtDate ? null : fmtDate)
        e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [filterChange]);

    const RenderDates = useCallback(() => {
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
                    style={completed ? completedStyles: {}}
                    disabled={completed === 'completed'}
                    onClick={handleBtnClick(currentDate, fmtDate)}>
                    <p className="day"> {moment(weekDay).format('ddd')} </p>
                    <p className="date"> {date} </p>
                    {(activeDates && !completed) && 
                    <i className={activeDates[fmtDate] ? "active" : ''}>
                        <PiDotFill /></i>}
                </button>);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeDates, completed,  dateParam, handleBtnClick, id, moments])


    return <RenderDates />

}

export default function Calendar({ activeDates }: { activeDates: ActiveDates | null | undefined }): JSX.Element {
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
                <Dates filterChange={handleFilterChange} dateParam={dateParam} activeDates={activeDates} />
            </div>
        </>)
}