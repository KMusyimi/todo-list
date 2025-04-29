import { SubTaskEntity } from "../api";
import { FetcherCellOnInput } from "../Views/TaskLayout";

interface SubTaskParams{
  taskId: string, subtask: SubTaskEntity[], action: string
}

export default function SubTask({ taskId, subtask, action }: SubTaskParams) {
  return (
  <div className="subtask-container">{
    subtask.map(sub => {
      if (sub) {
        const { id, title, status } = sub;
        return (
        <section className={status === 'completed'? `subtask-section ${status}`:"subtask-section"} key={id}>
          <FetcherCellOnInput taskId={taskId} intent="complete-subtask" action={action}>
            <input type="hidden" name="id" value={id} />
            <label className="complete-label" htmlFor={`sub-${id}`}>
              <input
                className="form-checkbox"
                type="checkbox"
                id={`sub-${id}`}
                name={'status'}
                disabled={status === 'completed'}
                value={'completed'} required />
            </label>
          </FetcherCellOnInput>
            {status === 'completed' ? <s className="subtask-title">{title}</s> :<h3 className="subtask-title"> {title}</h3>}
        </section>)

      }
    })}</div>)
}