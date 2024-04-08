import "./Content.scss";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Divider, Select, List, Button, Spin } from "antd";
import { useState, useEffect } from "react";
import { MinusSquareOutlined, CheckCircleOutlined } from "@ant-design/icons";
import axios from "axios";
const Content = () => {
  const [user, setUser] = useState([]);
  const [select, setSelect] = useState();
  const [spin, setSpin] = useState();
  const getAllUser = async () => {
    const apiUrl = "https://jsonplaceholder.typicode.com/users";
    try {
      const response = await axios.get(apiUrl);
      if (response) {
        setUser(response.data);
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await getAllUser();
    };

    fetchData();
  }, []);
  const options = user.map((user) => ({
    value: user.id,
    label: user.name
  }));
  const onChange = (value) => {
    setSpin(true);
    setTimeout(() => {
      setSelect(value);
      setSpin(false);
    }, 100);
  };
  const onSearch = (searchText) => {
    console.log("Search:", searchText);
  };
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const apiUrl = `https://jsonplaceholder.typicode.com/users/${select}/todos`;
    try {
      const response = await axios.get(apiUrl);
      if (response) {
        setData(response.data);
        setLoading(false);
        calculateTask(response.data);
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    loadMoreData();
  }, [select]);
  const [loadings, setLoadings] = useState({});
  const markTaskAsDone = async (taskId) => {
    try {
      await axios.patch(
        `https://jsonplaceholder.typicode.com/todos/${taskId}`,
        { completed: true }
      );
      console.log(`Task with id ${taskId} marked as done.`);
      setCompleted((prev) => prev + 1);
    } catch (error) {
      console.error(`Error marking task with id ${taskId} as done:`, error);
    }
  };
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => ({
      ...prevLoadings,
      [index]: true
    }));
    markTaskAsDone(index);

    setTimeout(() => {
      setLoadings((prevLoadings) => ({
        ...prevLoadings,
        [index]: false
      }));
      setData((prevData) =>
        prevData.map((item) =>
          item.id === index ? { ...item, completed: true } : item
        )
      );
    }, 800);
  };
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const calculateTask = (tasks) => {
    const completedTasks = tasks.filter((task) => task.completed);
    setCompleted(completedTasks.length);
    setTotal(tasks.length);
  };
  return (
    <div className="content">
      <div className="body-content">
        <div className="content-user">
          <Divider orientation="left" orientationMargin="0">
            User
          </Divider>
          <Select
            showSearch
            style={{
              width: 200
            }}
            placeholder="Select user"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={filterOption}
            options={options}
          />
        </div>
        <div className="content-table">
          <Divider orientation="left" orientationMargin="0">
            Tasks
          </Divider>
          <List
            bordered
            id="scrollableDiv"
            style={{
              height: 510,
              overflow: "auto"
            }}
          >
            {select && (
              <>
                {spin ? (
                  <>
                    <Spin style={{ marginTop: "17px" }} />
                  </>
                ) : (
                  <>
                    <InfiniteScroll
                      dataLength={data.length}
                      scrollableTarget="scrollableDiv"
                    >
                      <List
                        dataSource={data.sort((a, b) => {
                          if (a.completed === false && b.completed === true)
                            return -1;
                          if (a.completed === true && b.completed === false)
                            return 1;
                          return 0;
                        })}
                        renderItem={(item) => (
                          <List.Item key={item.id}>
                            {item.completed === false ? (
                              <>
                                <span className="title">
                                  <MinusSquareOutlined
                                    style={{
                                      color: "orange",
                                      marginRight: "4px",
                                      backgroundColor: "#ffffff"
                                    }}
                                  />
                                  {item.title}
                                </span>
                                <Button
                                  type="default"
                                  className="button"
                                  loading={loadings[item.id]}
                                  onClick={() => enterLoading(item.id)}
                                >
                                  Mark done
                                </Button>
                              </>
                            ) : (
                              <>
                                <span className="title">
                                  <CheckCircleOutlined
                                    style={{
                                      color: "rgb(17, 209, 17)",
                                      marginRight: "5px"
                                    }}
                                  />
                                  {item.title}
                                </span>
                              </>
                            )}
                          </List.Item>
                        )}
                      />
                    </InfiniteScroll>
                  </>
                )}
              </>
            )}
          </List>
          <div className="countTask">
            <span>
              Done {completed}/{total} tasks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Content;
