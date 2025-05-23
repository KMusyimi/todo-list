import {JSX, useId} from "react";
import {Form, useNavigation} from "react-router-dom";

export default function Intro({recommendations}: {
    recommendations: {
        names: string[];
        id: string;
    } | null
}): JSX.Element {
    const id = useId();
    const navigation = useNavigation();
    const renderRec = (recs: string[] | undefined) => {
        if (recs) {
            return recs.map((rec, idx) => {
                return (<label htmlFor={rec} key={`rec-${id + idx.toString()}`}>
                    <input type="radio" name="projectName" id={rec} value={rec}/>
                    {rec}
                </label>);
            });
        }
        return <p>No recommendations.</p>;
    }
    return (
        <div className="intro-container">
            <header>
                <h1>Pick a new project to get started</h1>
            </header>

            <Form method="post">
                <input type="hidden" name="iconColor" value={'#102E50'}/>

                <fieldset>
                    <legend>recommended</legend>
                    <div id="label-container" className={recommendations?"label-wrapper": 'label-wrapper empty'}>
                        {renderRec(recommendations?.names)}
                    </div>
                </fieldset>
                <button type="submit" className="continue-btn"
                        disabled={navigation.state === 'submitting'}> {navigation.state === 'submitting' ? 'Creating project...' : 'Continue'} </button>
            </Form>

        </div>);
}