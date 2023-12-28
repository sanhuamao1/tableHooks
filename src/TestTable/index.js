import React, { useState, useEffect } from "react";
import { Form, Table, Tag } from "antd";
import TableGenerator from "../TableGenerator";
import Detail from "./Detail";
import { LIST_RES } from "../store";
const { useFilter, usePagination, useSelect, useDelete, useModal } =
  TableGenerator;

const TestTable = () => {
  // 生成过滤组件
  const { FilterEles, filterRefresh } = useFilter([
    {
      name: "name",
      label: "平台名称",
      type: "inputString", // 字符串输入框
    },
    {
      name: "status",
      label: "状态",
      type: "select", // 选择器组件
      initValue: 0,
      options: [
        { value: 0, label: "全部状态" },
        { value: 1, label: "成功" },
        { value: 2, label: "失败" },
      ],
    },
    {
      name: ["start_date", "end_date"],
      label: ["开始日期", "结束日期"],
      type: "dateRange",
    },
  ]);
  const { pagination, pageRefresh, paginationConfig, setPagination } =
    usePagination();
  const { selectedKeys, rowSelection, setSelectedKeys } = useSelect();
  const { ModalEle, setModal } = useModal([
    {
      title: "详情",
      action: "detail",
      getComponent: (record) => <Detail data={record} />,
    },
  ]);
  const [list, setList] = useState([]);

  const [DeleteEle] = useDelete({
    url: "ajax/deleteItem.json",
    data: {
      uuids: selectedKeys,
    },
    success: () => {
      setSelectedKeys([]);
      getList();
    },
    keys: selectedKeys,
  });

  // 触发刷新
  useEffect(() => {
    getList();
  }, [pageRefresh, filterRefresh]);

  const columns = [
    {
      title: "序号",
      width: 50,
      align: "center",
      render: (v, r, index) =>
        index + 1 + (pagination.page - 1) * pagination.pageSize,
    },
    {
      title: "平台名称",
      width: 180,
      dataIndex: "req_psname",
    },
    {
      title: "请求时间",
      width: 140,
      dataIndex: "inform_time",
    },
    {
      title: "通知对象",
      width: 180,
      dataIndex: "inform_pnumbers",
      render: (v) => v.join(", "),
    },
    {
      title: "通知内容",
      width: 200,
      dataIndex: "inform_content",
    },
    {
      title: "通知结果",
      width: 80,
      dataIndex: "inform_result",
      render: (v) =>
        v === 0 ? (
          <Tag color="#87d068">成功</Tag>
        ) : (
          <Tag color="#f50">失败</Tag>
        ),
    },
    {
      title: "操作",
      width: 60,
      render: (v, record) => (
        <React.Fragment>
          <a
            onClick={() => {
              setModal({
                action: "detail",
                isShow: true,
                record,
              });
            }}
          >
            详情
          </a>
        </React.Fragment>
      ),
    },
  ];

  const getList = () => {
    // 请求数据
    const data = LIST_RES.data;
    setList(data.list);
    setPagination({
      ...pagination,
      page: data.page,
      total: data.total,
    });
  };

  return (
    <React.Fragment>
      <Form layout="inline">
        {DeleteEle}
        {FilterEles}
      </Form>
      <Table
        {...{
          columns,
          dataSource: list || [],
          rowSelection,
          pagination: paginationConfig,
          rowKey: "inform_uuid",
        }}
      />
      {ModalEle}
    </React.Fragment>
  );
};

export default TestTable;
