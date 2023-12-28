import axios from "axios";
import { OPER } from "../store";
import React, { useState } from "react";
import { Form, Button, Popconfirm, Modal, message } from "antd";
import { initFilter, getFormItem } from "./utils";
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const useDelete = ({ url = "", data = {}, success = null, keys = [] }) => {
  const handleDel = () => {
    // 请求..
    message.success("删除成功");
    success && success();
  };

  const DeleteEle = (
    <React.Fragment>
      {OPER.isDelete && (
        <Form.Item>
          {keys.length === 0 ? (
            <Button icon={<DeleteOutlined />} size="small" disabled>
              批量删除
            </Button>
          ) : (
            <Popconfirm
              title="批量删除"
              description="你确定要删除吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={handleDel}
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                批量删除
              </Button>
            </Popconfirm>
          )}
        </Form.Item>
      )}
    </React.Fragment>
  );

  return [DeleteEle];
};

const useFilter = (config = []) => {
  const [filter, setFilter] = useState(initFilter(config));
  const [refresh, setRefresh] = useState(false);

  const handleResetFilter = () => {
    setFilter(initFilter(config));
    setRefresh(!refresh);
  };

  const handleDateChange = ([startField, endField], [startTime, endTime]) => {
    setFilter({ ...filter, [startField]: startTime, [endField]: endTime });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFilter({ ...filter, [name]: value });
  };

  const FormItemEles = getFormItem(config, {
    filter,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
  });
  const handleSearch = () => {
    setRefresh(!refresh); // 通知查询
  };

  const HandlerEles = [
    <Form.Item>
      <Button
        type="primary"
        size="small"
        onClick={handleSearch}
        icon={<SearchOutlined />}
      >
        查询
      </Button>
    </Form.Item>,
    <Form.Item>
      <Button
        type="primary"
        size="small"
        onClick={handleResetFilter}
        icon={<ReloadOutlined />}
      >
        重置
      </Button>
    </Form.Item>,
  ];

  return {
    filter,
    FilterEles: [...FormItemEles, ...HandlerEles],
    filterRefresh: refresh,
  };
};

const usePagination = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [pageRefresh, setPageRefresh] = useState(false);

  const config = {
    size: "small",
    showQuickJumper: false,
    total: pagination.total,
    current: pagination.page,
    showSizeChanger: true,
    onChange: (current) => {
      setPagination({
        ...pagination,
        page: current,
      });
      setPageRefresh(() => !pageRefresh);
    },
    pageSize: pagination.pageSize,
    onShowSizeChange: (page, pageSize) => {
      setPagination({
        page,
        pageSize,
      });
      setPageRefresh(() => !pageRefresh);
    },
  };

  return {
    pagination,
    pageRefresh,
    setPagination,
    paginationConfig: config,
  };
};

const useSelect = () => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const rowSelection = {
    onChange: (selectedKeys) => {
      setSelectedKeys(selectedKeys);
    },
    selectedRowKeys: selectedKeys,
  };

  return { selectedKeys, rowSelection, setSelectedKeys };
};

const useModal = (
  config = [
    {
      title: "详情",
      action: "detail",
      getComponent: <div>详情</div>,
    },
  ]
) => {
  const [modal, setModal] = useState({
    isShow: false,
    record: null,
    action: "",
  });
  const handleCancel = () => {
    setModal({
      isShow: false,
      record: null,
      action: "",
    });
  };

  //对话框信息
  let modalProps = {
    open: modal.isShow,
    onCancel: handleCancel,
    maskClosable: false,
    footer: null,
  };

  const currentModal = config.find((item) => item.action === modal.action);
  if (currentModal) {
    const { action, getComponent, ...other } = currentModal;
    modalProps = {
      ...modalProps,
      ...other,
    };
  }

  const ModalEle = (
    <Modal width="80%" {...modalProps}>
      {currentModal && currentModal.getComponent(modal.record)}
    </Modal>
  );

  return { ModalEle, modal, setModal };
};

const useTimer = (interval, handler) => {
  const [isTimerOpen, setTimerOpen] = useState(false);

  useEffect(() => {
    let timer;

    // 启动定时器
    if (isTimerOpen) {
      timer = setInterval(() => {
        handler();
      }, interval);

      // 第一次加载时手动触发一次请求
      handler();
    } else {
      // 清除定时器
      clearInterval(timer);
    }

    // 在组件卸载时清除定时器，防止内存泄漏
    return () => {
      clearInterval(timer);
    };
  }, [isTimerOpen]); // 当 isTimerOpen 改变时重新运行 useEffect

  return {
    setTimerOpen,
  };
};

export default {
  useModal,
  useDelete,
  useSelect,
  usePagination,
  useFilter,
  useTimer,
};
