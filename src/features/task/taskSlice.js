import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  count: 0,
  list: [],
  team: [],
  loading: false,
  adding: false,
  updating: false,
  deleting: false,
  showTaskForm: false,
  task: {
    assigned_user: "",
    task_date: new Date(),
    task_time: "",
    time_zone: 0,
    task_msg: "",
    is_completed: 0,
  },
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setCount: (state, action) => {
      state.count = action.payload;
    },
    decrementCount: (state, action) => {
      state.count--;
    },
    setTasks: (state, action) => {
      state.list = action.payload;
    },
    setTeam: (state, action) => {
      state.team = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAdding: (state, action) => {
      state.adding = action.payload;
    },
    setUpdating: (state, action) => {
      state.updating = action.payload;
    },
    setDeleting: (state, action) => {
      state.deleting = action.payload;
    },
    setShowForm: (state, action) => {
      state.showTaskForm = action.payload;
    },
    resetForm: (state) => {
      let old = JSON.parse(JSON.stringify(state.list));
      old.forEach((task) => (task.hide = false));
      state.list = old;
    },
    setTask: (state, action) => {
      state.showTaskForm = true;
      state.task = action.payload;
      if (action.payload.taskId) {
        let old = JSON.parse(JSON.stringify(state.list));
        const index = old.findIndex(
          (task) => task.id === action.payload.taskId
        );
        if (index !== -1) {
          old[index].hide = true;
          state.list = old;
        }
      }
    },
  },
});

export const {
  setTasks,
  setCount,
  setTeam,
  setLoading,
  setAdding,
  setUpdating,
  setDeleting,
  setShowForm,
  setTask,
  resetForm,
  decrementCount,
} = taskSlice.actions;

export const selectCount = (state) => state.task.count;
export const selectList = (state) => state.task.list;
export const selectTeam = (state) => state.task.team;
export const isLoading = (state) => state.task.loading;
export const adding = (state) => state.task.adding;
export const updating = (state) => state.task.updating;
export const deleting = (state) => state.task.deleting;
export const showForm = (state) => state.task.showTaskForm;
export const currentTask = (state) => state.task.task;

export const getUserToken = () => async (dispatch) => {
  try {
    if (
      !localStorage.getItem("user-token") ||
      localStorage.getItem("user-token") === "undefined" ||
      !localStorage.getItem("user-id") ||
      localStorage.getItem("user-id") === "undefined"
    ) {
      let response = await axios({
        method: "post",
        url: "https://stage.api.sloovi.com/login",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          email: "smithcheryl@yahoo.com",
          password: "12345678",
        },
      });
      if (response.data?.code === 200) {
        localStorage.setItem("user-token", response.data?.results?.token);
        dispatch(getUserId());
      }
    }
  } catch (error) {
    console.log("🚀 ~ file: taskSlice.js ~ getUserToken ~ error", error);
  }
};

export const getUserId = () => async () => {
  try {
    let response = await axios.get("https://stage.api.sloovi.com/user", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response.data?.code === 200) {
      localStorage.setItem("user-id", response.data?.results?.user_id);
    }
  } catch (error) {
    console.log("🚀 ~ file: taskSlice.js ~ getUserId ~ error", error);
  }
};

export const getTasks = () => async (dispatch) => {
  if (localStorage.getItem("user-token")) {
    dispatch(setLoading(true));
    let response = await axios.get(
      "https://stage.api.sloovi.com/task/lead_6996a7dcdddc4af3b4f71ccb985cea38",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data?.code === 200) {
      let array = response.data?.results;
      array.sort((a, b) => b.modified - a.modified);
      dispatch(setTasks(array));
      dispatch(setCount(array.length));
    }
    dispatch(setLoading(false));
  } else {
    dispatch(getUserToken());
    dispatch(setLoading(false));
  }
};

export const getTeam = () => async (dispatch) => {
  if (localStorage.getItem("user-token")) {
    let response = await axios.get("https://stage.api.sloovi.com/team", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response.data?.code === 200) {
      dispatch(setTeam(response.data?.results?.data));
    }
  } else {
    dispatch(getUserToken());
  }
};

export const addTask = (data) => async (dispatch, getState) => {
  if (localStorage.getItem("user-token")) {
    dispatch(setAdding(true));
    let response = await axios({
      method: "post",
      url: "https://stage.api.sloovi.com/task/lead_6996a7dcdddc4af3b4f71ccb985cea38",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data,
    });
    if (response.data?.code === 201) {
      let oldList = JSON.parse(JSON.stringify(getState().task.list));
      oldList.push(response.data.results);
      dispatch(setTasks(oldList));
      dispatch(setCount(oldList.length));
      dispatch(setShowForm(false));
      dispatch(resetForm());
    }
    dispatch(setAdding(false));
  } else {
    dispatch(setAdding(false));
    dispatch(getUserToken());
  }
};

export const updateTask = (data) => async (dispatch, getState) => {
  if (localStorage.getItem("user-token")) {
    dispatch(setUpdating(true));
    let taskId = data.taskId;
    delete data.taskId;
    let response = await axios({
      method: "put",
      url: `https://stage.api.sloovi.com/task/lead_6996a7dcdddc4af3b4f71ccb985cea38/${taskId}`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data,
    });
    if (response.data?.code === 202) {
      let old = JSON.parse(JSON.stringify(getState().task.list));
      const index = old.findIndex(
        (task) => task.id === response.data?.results.id
      );
      if (index !== -1) {
        old[index] = response.data?.results;
      }
      dispatch(setTasks(old));
      dispatch(setShowForm(false));
      dispatch(resetForm());
    }
    dispatch(setUpdating(false));
  } else {
    dispatch(setUpdating(false));
    dispatch(getUserToken());
  }
};

export const deleteTask = (taskId) => async (dispatch, getState) => {
  if (localStorage.getItem("user-token")) {
    dispatch(setDeleting(true));
    let response = await axios({
      method: "delete",
      url: `https://stage.api.sloovi.com/task/lead_6996a7dcdddc4af3b4f71ccb985cea38/${taskId}`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response.data?.code === 204) {
      let old = JSON.parse(JSON.stringify(getState().task.list));
      const index = old.findIndex((task) => task.id === taskId);
      if (index !== -1) {
        old.splice(index, 1);
      }
      dispatch(setTasks(old));
      dispatch(setShowForm(false));
      dispatch(resetForm());
      dispatch(decrementCount());
    }
    dispatch(setDeleting(false));
  } else {
    dispatch(setDeleting(false));
    dispatch(getUserToken());
  }
};

export default taskSlice.reducer;
