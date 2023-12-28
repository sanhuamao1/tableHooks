import React from "react";
import { Form, DatePicker, Input, Select } from "antd";
const { RangePicker } = DatePicker;

export const initFilter = (arr) => {
  const obj = {};
  arr.forEach((item) => {
    switch (item.type) {
      case "inputString":
        obj[item.name] = item.initValue || "";
        break;
      case "select":
        obj[item.name] = item.initValue || 0;
        break;
      case "dateRange":
        item.name.forEach((name) => {
          obj[name] = "";
        });
        break;
      default:
        break;
    }
  });

  return obj;
};
export const getFormItem = (
  arr,
  { filter, handleInputChange, handleSelectChange, handleDateChange }
) => {
  const Eles = [];
  arr.forEach((item) => {
    const name = item.name;
    const label = item.label;
    const value = filter[name];
    switch (item.type) {
      case "inputString":
        Eles.push(
          <Form.Item>
            <Input
              size="small"
              placeholder={label}
              name={name}
              value={value}
              onChange={handleInputChange}
            />
          </Form.Item>
        );
        break;
      case "select":
        Eles.push(
          <Form.Item>
            <Select
              size="small"
              style={{ width: 120 }}
              onChange={(v) => {
                handleSelectChange(name, v);
              }}
              name={name}
              value={value}
              options={item.options}
            />
          </Form.Item>
        );
        break;
      case "dateRange":
        Eles.push(
          <Form.Item>
            <RangePicker
              onChange={(dates) => {
                handleDateChange(name, dates);
              }}
              value={[filter[name[0]], filter[name[1]]]}
              placeholder={label}
              size="small"
            />
          </Form.Item>
        );
      default:
        break;
    }
  });

  return Eles;
};
