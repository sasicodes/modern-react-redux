import React, { useEffect, useState } from "react";
import styles from "./Task.module.css";
import { TimePicker } from "antd";
import { DatePicker } from "antd";
import moment from "moment";
import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  selectTeam,
  addTask,
  adding,
  updating,
  deleting,
  currentTask,
  resetForm,
  updateTask,
  deleteTask,
} from "./taskSlice";
const { Option } = Select;

const Form = (props) => {
  const [taskMsg, setTaskMsg] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();

  const team = useSelector(selectTeam);
  const addingLoader = useSelector(adding);
  const updatingLoader = useSelector(updating);
  const deletingLoader = useSelector(deleting);
  const currentEditTask = useSelector(currentTask);

  useEffect(() => {
    setTaskMsg(currentEditTask.task_msg);
    setDate(currentEditTask.task_date);
    setTime(currentEditTask.task_time);
    setUserId(currentEditTask.assigned_user);
  }, [currentEditTask]);

  const onSave = () => {
    if (taskMsg.trim() === "" || date === "" || time === "" || userId === "") {
      alert("Please fill out all fields.");
    } else {
      if (currentEditTask.isEdit) {
        dispatch(
          updateTask({
            assigned_user: userId,
            task_date: moment(date).format("YYYY-MM-DD"),
            task_time: moment(time, "hh:mm A").diff(
              moment().startOf("day"),
              "seconds"
            ),
            time_zone: 0,
            task_msg: taskMsg,
            is_completed: 0,
            taskId: currentEditTask.taskId,
          })
        );
      } else {
        dispatch(
          addTask({
            assigned_user: userId,
            task_date: moment(date).format("YYYY-MM-DD"),
            task_time: moment(time, "hh:mm A").diff(
              moment().startOf("day"),
              "seconds"
            ),
            time_zone: 0,
            task_msg: taskMsg,
            is_completed: 0,
          })
        );
      }
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.inputWrapper}>
        <span className={styles.label}>Task Description</span>
        <input
          className={styles.input}
          value={taskMsg}
          onChange={(e) => setTaskMsg(e.target.value)}
          type="text"
        />
      </div>
      <div className={styles.datetime}>
        <div className={styles.inputWrapper + " mr-5"}>
          <span className={styles.label}>Date</span>
          <DatePicker
            defaultValue={moment(date, "DD-MM-YYYY")}
            value={moment(date, "DD-MM-YYYY")}
            onChange={(date) => setDate(date)}
            format={["DD-MM-YYYY"]}
            className={styles.input}
            allowClear={false}
            showToday={false}
          />
        </div>
        <div className={styles.inputWrapper}>
          <span className={styles.label}>Time</span>
          <TimePicker
            use12Hours
            format="hh:mm A"
            className={styles.input}
            onChange={(time) => {
              setTime(time);
            }}
            allowClear={false}
            value={time}
          />
        </div>
      </div>
      <div className={styles.inputWrapper}>
        <span className={styles.label}>Assign User</span>
        <Select
          style={{ width: "100%" }}
          placeholder="Assign to"
          onChange={(id) => setUserId(id)}
          value={userId}
        >
          {team.map((person, i) => {
            return (
              person.user_status === "accepted" && (
                <Option key={i} value={person.user_id}>
                  {person.name}
                </Option>
              )
            );
          })}
        </Select>
      </div>
      <div className={styles.btnWrapper}>
        <div title="Delete">
          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this task?")
              ) {
                dispatch(deleteTask(currentEditTask.taskId));
              }
            }}
          >
            <img
              src={require("../../images/delete.svg").default}
              alt=""
              height={12}
            />
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              props.setShowForm(false);
              dispatch(resetForm());
            }}
            className="mr-5 btn btn-secondary"
          >
            Cancel
          </button>
          <button
            disabled={addingLoader || updatingLoader || deletingLoader}
            onClick={() => onSave()}
            className="btn btn-primary"
          >
            {addingLoader || updatingLoader || deletingLoader
              ? "Loading..."
              : currentEditTask.isEdit
              ? "Update"
              : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
