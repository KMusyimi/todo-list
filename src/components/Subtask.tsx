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
        return (<section className="subtask-section" key={id}>
          <FetcherCellOnInput taskId={taskId} intent="complete" action={action}>
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
          <h3>{title}</h3>
        </section>)

      }
    })}</div>)
}