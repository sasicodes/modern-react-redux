import React from "react";
import styles from "./Task.module.css";
import moment from "moment";
import { setTask, updateTask } from "./taskSlice";
import { useDispatch } from "react-redux";

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();

  return (
    <div className={styles.listContainer}>
      <div className={styles.listItem}>
        <img src={task.user_icon} alt="" height={30} width={30} />
        <div className={styles.listDetail}>
          <span>{task.task_msg}</span>
          <small className="red">
            {moment(task.task_date).format("DD/MM/YYYY")}
          </small>
        </div>
      </div>
      <div>
        <button
          onClick={() =>
            dispatch(
              setTask({
                assigned_user: task.assigned_user,
                task_date: moment(task.task_date_time_in_utc, "YYYY-MM-DD"),
                task_time: moment(task.task_date_time_in_utc),
                time_zone: 0,
                task_msg: task.task_msg,
                is_completed: 0,
                taskId: task.id,
                isEdit: true,
              })
            )
          }
          className={styles.edit}
          title="Edit"
        >
          <img
            src={require("../../images/pencil.svg").default}
            alt=""
            height={12}
          />
        </button>
        <button
          className={styles.complete}
          title="Mark as complete"
          onClick={() =>
            dispatch(
              updateTask({
                assigned_user: task.assigned_user,
                task_date: task.task_date,
                task_time: task.task_time,
                time_zone: task.time_zone,
                task_msg: task.task_msg,
                is_completed: 1,
                taskId: task.id,
              })
            )
          }
        >
          <img
            src={require("../../images/tick.svg").default}
            alt=""
            height={12}
          />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
