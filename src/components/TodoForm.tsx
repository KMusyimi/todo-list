import {JSX} from "react";
import {Form} from "react-router-dom";

export default function TodoForm(): JSX.Element {
    return (<>
        <Form replace={true} method="post">

            <label htmlFor={'title'}> title: </label>
            < input type={'text'}
                    id={'title'}
                    name={'title'}
                    className={'form-input'}
                    placeholder={'Eg. bake a cake..'}
                    required/>

            <label htmlFor={'due-date'}> due date: </label>
            < input type={'date'}
                    id={'due-date'}
                    name={'due-date'}
                    className={'form-input'}
                    min={new Date().toISOString().slice(0, 10)}
                    required/>

            <fieldset>
                <legend>Select todo priority</legend>
                < div className={'radio-container'}>
                    <input id={'high'} type={'radio'} name={'priority'} value={1}/>
                    <label htmlFor={'high'}> high </label>
                </div>
                < div className={'radio-container'}>
                    <input id={'medium'} type={'radio'} name={'priority'} value={2}/>
                    <label htmlFor={'medium'}> medium </label>
                </div>
                < div className={'radio-container'}>
                    <input id={'low'} type={'radio'} name={'priority'} value={3}/>
                    <label htmlFor={'low'}> low </label>
                </div>
            </fieldset>
            < label htmlFor={'description'}> description: </label>
            < textarea id={'description'} name={'description'} className={'form-input'}
                       placeholder={'Enter a brief description'} maxLength={350}> </textarea>
            < label htmlFor={'notes'}> notes: </label>
            < textarea id={'notes'}
                       name={'notes'}
                       className={'form-input'}
                       placeholder={'Add any additional notes'}
                       maxLength={150}> </textarea>
            < button type="submit"> + Add Task</button>
        </Form>
    </>)
}