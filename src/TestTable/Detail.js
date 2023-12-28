import React from "react";
import { Tag, Descriptions } from "antd";

function ShowDetailInfo(props) {
  let { formatList, data, column = 3 } = props;
  return (
    <Descriptions size="small" column={column}>
      {formatList.map((item) => {
        let des = item.render
          ? item.render(data[item.dataIndex], data)
          : data[item.dataIndex];
        if (typeof des === "number") {
          //数字0显示不出，所以转为字符串显示
          des = des + "";
        }

        let span = item.span ? item.span : 1;
        return (
          <Descriptions.Item label={item.title} span={span}>
            {des || "--"}
          </Descriptions.Item>
        );
      })}
    </Descriptions>
  );
}

export default ({ data }) => {
  const display = [
    {
      title: "请求时间",
      dataIndex: "inform_time",
    },
    {
      title: "类型",
      dataIndex: "inform_type",
      render: () => "主备切换",
    },
    {
      title: "平台名称",
      dataIndex: "req_psname",
    },
    {
      title: "平台IP",
      dataIndex: "req_ip",
    },
    {
      title: "平台资源编码",
      dataIndex: "req_ebrid",
    },
    {
      title: "平台区域码",
      dataIndex: "req_region_code",
    },
    {
      title: "平台区域名称",
      dataIndex: "req_region_name",
    },
    {
      title: "通知对象",
      dataIndex: "inform_pnumbers",
      render: (v) => v.join(", "),
    },
    {
      title: "通知内容",
      dataIndex: "inform_content",
    },
    {
      title: "通知结果",
      dataIndex: "inform_result",
      render: (v) =>
        v === 0 ? (
          <Tag color="#87d068">成功</Tag>
        ) : (
          <Tag color="#f50">失败</Tag>
        ),
    },
    {
      title: "描述",
      dataIndex: "err_desc",
    },
  ];
  return <ShowDetailInfo formatList={display} data={data} />;
};
