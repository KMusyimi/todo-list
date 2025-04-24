import { SubTaskEntity } from "../api";
import { FetcherCellOnInput } from "../Views/TaskLayout";

export default function SubTask({ taskId, subtask }: { taskId: string, subtask: SubTaskEntity[] }) {
  return (<>{subtask.map(sub => {
    if (sub) {
      const { id, title, status } = sub;
      return (<section key={id}>.
        <FetcherCellOnInput taskId={taskId} intent="complete" action=".">
          <label htmlFor={`sub-${id}`}>
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
  })}</>)
}