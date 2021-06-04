import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserToken,
  getTeam,
  getTasks,
  selectCount,
  selectList,
  isLoading,
  showForm,
  setShowForm,
  setTask,
} from "./taskSlice";
import styles from "./Task.module.css";
import Form from "./Form";
import TaskItem from "./TaskItem";

export function Task() {
  const count = useSelector(selectCount);
  const tasks = useSelector(selectList);
  const loading = useSelector(isLoading);
  const showFormBool = useSelector(showForm);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserToken());
    dispatch(getTasks());
    dispatch(getTeam());
    return () => undefined;
  }, []);

  return (
    <div>
      <div className={styles.container}>
        <div>
          <div
            className={`${styles.bar} ${
              (showForm || tasks.length > 0) && styles.noBRadius
            }`}
          >
            <span>
              Tasks<span>{count}</span>
            </span>
            <button
              title="Create a task"
              onClick={() => {
                dispatch(setShowForm(true));
                dispatch(
                  setTask({
                    assigned_user: "",
                    task_date: new Date(),
                    task_time: "",
                    time_zone: 0,
                    task_msg: "",
                    is_completed: 0,
                  })
                );
              }}
            >
              +
            </button>
          </div>
          {showFormBool && (
            <Form setShowForm={(bool) => dispatch(setShowForm(bool))} />
          )}
          {tasks.length ? (
            <div>
              {tasks?.map((task, i) => {
                return !task.hide && <TaskItem key={i} task={task} />;
              })}
            </div>
          ) : loading ? (
            <div style={{ textAlign: "center", marginTop: 50 }}>Loading...</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
