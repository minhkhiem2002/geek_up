import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Divider, Select, List, Button, Spin } from 'antd';
import { MinusSquareOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import './Content.scss'
const Content = () => {
  const queryClient = useQueryClient();
  const [select, setSelect] = useState();
  const [spin, setSpin] = useState();
  const [tasks, setTasks] = useState([]);
  const [loadings, setLoadings] = useState({});
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const getAllUser = async () => {
    const apiUrl = 'https://jsonplaceholder.typicode.com/users';
    try {
      const response = await axios.get(apiUrl);
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching users from API');
    }
  };
  
  const loadMoreData = async (key,selectValue) => {
    const apiUrl = `https://jsonplaceholder.typicode.com/users/${key}/todos`;
    try {
      const cachedData = queryClient.getQueryData(['todos', key]);
      if (cachedData) {
        setTasks(cachedData);
        calculateTask(cachedData);
        return cachedData;
      } else {
        const response = await axios.get(apiUrl);
        if (response) {
          setTasks(response.data);
          calculateTask(response.data);
          queryClient.setQueryData(['todos', key], response.data);
          return response.data;
        }
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching tasks from API');
    }
  };
  
  
  const markTaskAsDone = async (taskId) => {
    try {
      await axios.patch(
        `https://jsonplaceholder.typicode.com/todos/${taskId}`,
        { completed: true }
      );
      console.log(`Task with id ${taskId} marked as done.`);
      setCompleted((prev) => prev + 1);
      const prevTasks = queryClient.getQueryData(['todos', select]);
      if (prevTasks) {
        const updatedTasks = prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        );
        queryClient.setQueryData(['todos', select], updatedTasks);
      }
    } catch (error) {
      console.error(`Error marking task with id ${taskId} as done:`, error);
      throw new Error('Error marking task as done');
    }
  };
  const { data: user, isLoading: userLoading } = useQuery({queryKey: ['users'], queryFn: getAllUser});
  const { data: todo, isLoading, isError } = useQuery({queryKey: ['todos', select], queryFn: () => loadMoreData(select), 
    enabled: !!select,
    keepPreviousData: true
  });
  const options = user?.map(user => ({
    value: user.id,
    label: user.name
  })) || [];

  const onChange = value => {
    setSpin(true);
    setSelect(value);
      setSpin(false);
  };
  const onSearch = (searchText) => {
    console.log("Search:", searchText);
  };
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const enterLoading = async (taskId) => {
      setLoadings((prevLoadings) => ({
        ...prevLoadings,
        [taskId]: true
      }));
    
      try {
        await markTaskAsDone(taskId);
        setLoadings((prevLoadings) => ({
          ...prevLoadings,
          [taskId]: false
        }));
        setTasks((prevTasks) =>
          prevTasks.map((item) =>
            item.id === taskId ? { ...item, completed: true } : item
          )
        );
      } catch (error) {
        console.error('Error marking task as done:', error);
      }
    };
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
            style={{ width: 200 }}
            placeholder="Select user"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={filterOption}
            options={options}
            loading={userLoading}
          />
        </div>
        <div className="content-table">
          <Divider orientation="left" orientationMargin="0">
            Tasks
          </Divider>
          <List
            bordered
            id="scrollableDiv"
            style={{ height: 510, overflow: 'auto' }}
          >
            {select && (
              <>
                {spin ? (
                  <Spin style={{ marginTop: '17px' }} />
                ) : (
                  
                  <List
                    dataSource={tasks?.sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1) || []}
                    loading={isLoading}
                    renderItem={item => (
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
                )}
              </>
            )}
          </List>
          <div className="countTask">
            <span>Done {completed}/{total} tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
