/* eslint-disable react/no-array-index-key */

import PageContent from '@/components/PageContent';
import {
  getGoods,
  getGoodsClassify,
  addGood,
  deleteGood,
  deleteGoodList,
  updateGood,
} from '@/services/api/ConfigThing';
import { DownOutlined, PoweroffOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, {
  ModalForm,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Popconfirm, Select, Space, Tree, Upload } from 'antd';
import { Row, Col, Menu, Image } from 'antd';
import { values } from 'lodash';
import { format } from 'prettier';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import styles from 'index.less';
import { text } from 'express';
import { request } from 'umi';
import { rules } from '.eslintrc';
const { SubMenu } = Menu;
const data = ['物资种类', '物资信息', '物资预警', '预警规则'];

const dataItem: any = [
  {
    id: '1',
    lastModel: '照明类',
    goods: '气球灯灯体',
    des: '',
    specs: '',
    mode: 'RFID',
    count: '9',
    imageUrl: '',
    blank: '',
  },
  {
    id: '2',
    lastModel: '照明类',
    goods: '气球灯灯体',
    des: '',
    specs: '',
    mode: 'RFID',
    count: '9',
    imageUrl: '',
    blank: '',
  },
];
function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const SysConfig: React.FC = () => {
  const [list, setList] = useState([]);
  // 所有节点数据
  const [treeData, setTreeData] = useState([]);
  // 选中的节点数据
  const [selectNodeData, setSelectNodeData] = useState<{
    parentId: string;
  }>();
  // 类别
  const [filter, setFilter] = useState({});
  // 页面显示最大条数
  const [pageSize, setPageSize] = useState(10);
  // 页数
  const [pageNum, setPageNum] = useState(1);
  // 页面条数
  const [pageList, setPageList] = useState([]);
  // 新增表单控制参数
  const [modelForm, setmodelForm] = useState(false);
  // 编辑表单控制参数
  const [modalEditForm, setModalEditForm] = useState(false);
  // 数据总条数
  const [pageTotal, setPageTotal] = useState(0);
  // 新增表单的dom
  const restFormRef = useRef<ProFormInstance>();
  // 编辑表单的dom
  const restEditFormRef = useRef<ProFormInstance>();
  // 数据展示表单的dom
  const domRef = useRef<ActionType>();
  // 编辑表单的数据对应项
  const [thingMessage, setThingMessage] = useState<{
    lastModel: string;
    goods: string;
    des: string;
    specs: string;
    type: number;
    imageUrl: string;
    parentId: number;
  }>({ lastModel: '', goods: '', des: '', specs: '', type: 0, imageUrl: '', parentId: 0 });
  // 删除列表
  const [deleteList, setDeleteList] = useState([]);

  const resquestData = async () => {
    const res = await getGoods({ filter, pageSize, pageNum });
    console.log('tigger request');
    setPageList(res.content.list);
    setPageTotal(res.content.total);
    const result = {
      data: res.content.list,
      total: res.content.total,
      success: true,
    };
    return Promise.resolve(result);
  };
  const columns = [
    {
      title: 'classifty',
      dataIndex: 'lastModel',
      hideInSearch: true,
    },
    {
      title: 'name',
      dataIndex: 'goods',
    },
    {
      title: 'Describe',
      dataIndex: 'des',
    },
    {
      title: 'Specification',
      dataIndex: 'specs',
      hideInSearch: true,
    },
    {
      title: 'Mode',
      dataIndex: 'type',
      render: (selectType: any) => {
        if (selectType === 1) {
          return <span>RFID</span>;
        } else {
          return <span>二维码</span>;
        }
      },
      renderFormItem: () => {
        const columnslist = [
          { id: 1, name: 'RFID' },
          { id: 2, name: '二维码' },
        ];
        return (
          <Select
            key="searchSelcet"
            placeholder="请选择"
            // filterOption={true}
            // onSearch={handleSearch}
          >
            {columnslist.map((item) => {
              return <Select.Option key={item.id} value={item.id} children={item.name} />;
            })}
          </Select>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'count',
      hideInSearch: true,
    },
    {
      title: 'Picture',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      hideInSearch: true,
      render: (url: any) => {
        return <Image width={30} src={url} />;
      },
    },
    {
      title: 'Operation',
      hideInSearch: true,
      render: (dataMessage: any) => (
        <Space size="middle">
          <a
            onClick={() => {
              console.log('2');
            }}
          >
            相关物资
          </a>
          <a
            onClick={() => {
              setModalEditForm(true);
              console.log(dataMessage);
              setThingMessage(dataMessage);

              restEditFormRef.current?.setFieldsValue({
                goods: dataMessage.goods,
                parentId: dataMessage.parentId,
                des: dataMessage.des,
                specs: dataMessage.specs,
                type: dataMessage.type,
              });
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => {
              deleteGood(dataMessage.id).then(() => {
                console.log(pageList);
                if (pageList.length === 1) {
                  setPageNum(pageNum - 1);
                } else {
                  domRef.current?.reload();
                }
              });
              console.log(dataMessage.id);
            }}
            onCancel={() => {
              console.log('from disappear');
            }}
            okText="是的"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);
  useEffect(() => {
    getGoodsClassify().then((datavalue: any) => {
      const tempTest = datavalue.content;
      // tempTest.forEach((tempdata: string) => {
      //     console.log(tempdata)
      // });
      const [getTree] = tempTest.map((tempdata: any) => {
        return tempdata.children;
      });
      const selectList: any = [];
      // eslint-disable-next-line prefer-const
      for (let i of getTree) {
        // eslint-disable-next-line prefer-const
        let temp: any = {};
        temp.value = i.id;
        temp.label = i.goods;
        selectList.push(temp);
      }
      setList(selectList);
      console.log(getTree);
      console.log(selectList);
      setTreeData(tempTest);
    });
    console.log(1);
  }, []);

  // useEffect(()=>{
  //     getGoods({filter, pageSize, pageNum}).then((datagoods: any)=>{
  //         console.log(datagoods.content.list)
  //         setList(datagoods.content.list);
  // //         // const tempTest=datagoods.content
  // //         // const list =tempTest.map((data: any)=>{
  // //         //     return data.list
  // //         // })
  // //         // console.log(list)
  //     })
  // },[filter, pageNum, pageSize])
  return (
    <PageContent>
      <Row justify="center" align="top">
        <Col span={4}>
          <Menu mode="inline">
            <SubMenu key="01" title="物资管理">
              {data.map((name) => (
                <Menu.Item key={name}>{name}</Menu.Item>
              ))}
            </SubMenu>
          </Menu>
        </Col>
        <Col span={4}>
          <div>
            <Tree
              showLine
              switcherIcon={<DownOutlined />}
              defaultExpandAll={true}
              treeData={treeData}
              fieldNames={{
                title: 'goods',
                key: 'id',
              }}
              onSelect={(nodedata: any, e: any) => {
                const selectNode = { parentId: e.node.id };
                const temp: any = filter;
                temp.parentId = e.node.id;
                console.log(temp);

                // 刷新一次 请求一次
                if (domRef.current != null && temp.parentId > 1) {
                  setFilter(temp);
                  domRef.current.reload();
                  console.log(pageNum);
                  setSelectNodeData(selectNode);
                  console.log(selectNode);
                }
                // console.log(typeof(nodedata));
              }}
            />
          </div>
        </Col>
        <Col flex="auto">
          <ProTable
            columns={columns}
            actionRef={domRef}
            request={resquestData}
            pagination={{
              // 分页设置
              pageSize: pageSize,
              current: pageNum,
              onChange: (page, _pageSize) => {
                console.log(page);
                console.log(pageNum);
                setPageNum(page);
                setPageSize(_pageSize);
              },
            }}
            // async ()=>{
            // await  getGoods({filter, pageSize, pageNum}).then((datagoods: any)=>{
            //     setList(datagoods.content.list);
            //     setPageList(datagoods.content.total)
            // })
            // return {
            //     data:list,
            //     total: pageList,
            //     success: true,
            // }
            // }}
            rowKey="id"
            rowSelection={{
              onChange: (key: any) => {
                console.log(key);
                setDeleteList(key);
              },
            }}
            tableAlertRender={() => {
              return false;
            }}
            tableAlertOptionRender={() => {
              return false;
            }}
            toolBarRender={() => [
              <Space>
                <Button icon={<PoweroffOutlined />}>导出</Button>
                <Button
                  key="add"
                  onClick={() => {
                    console.log('tigger add');
                    setmodelForm(true);
                  }}
                  icon={<PoweroffOutlined />}
                >
                  添加
                </Button>
                <Button
                  key="delete"
                  onClick={() => {
                    console.log(deleteList);
                    deleteGoodList(deleteList);
                    domRef.current?.reload();
                  }}
                  icon={<PoweroffOutlined />}
                >
                  删除
                </Button>
              </Space>,
            ]}
            search={{
              labelWidth: 'auto',
              // eslint-disable-next-line @typescript-eslint/no-shadow
              // 搜索栏自定义
              optionRender: ({ form }) => [
                <Button
                  key="reset1"
                  onClick={() => {
                    setFilter({});
                    form?.resetFields();
                    console.log(form);
                    form?.submit();
                  }}
                >
                  重置
                </Button>,
                <Button
                  key="search"
                  onClick={() => {
                    if (form != null) {
                      // 获取表单文本值
                      const tempGoods = form.getFieldsValue();
                      if (tempGoods != null) {
                        tempGoods.parentId = selectNodeData?.parentId;
                        // 设置搜索值
                        setFilter(tempGoods);
                      }
                      console.log('searchFormData=', form.getFieldsValue());
                      form?.submit();
                      console.log(tempGoods);
                    }
                  }}
                >
                  搜索
                </Button>,
              ],
            }}
          />
        </Col>
      </Row>
      <ModalForm
        className="ant-css"
        title="新增"
        visible={modelForm}
        formRef={restFormRef}
        onFinish={async (value) => {
          console.log(value);
          addGood(value).then(() => {
            if (pageList.length === pageSize && pageNum === pageTotal) {
              setPageNum(pageNum + 1);
            } else {
              domRef.current?.reload();
            }
          });
          restFormRef.current?.resetFields();
          setmodelForm(false);
        }}
        modalProps={{
          onCancel: () => {
            setmodelForm(false);
          },
        }}
        layout="horizontal"
        width={520}
      >
        <ProForm.Item>
          <Space direction="vertical" size="middle" align="center">
            <ProFormSelect
              key="goodskey"
              options={list}
              label="类型"
              name="parentId"
              width={'sm'}
              rules={[
                {
                  required: true,
                  message: '请输入类型',
                },
              ]}
            />
            <ProFormText
              label="名称"
              name="goods"
              width={'sm'}
              rules={[
                {
                  required: true,
                  message: '请输入名称',
                },
              ]}
            />
            <ProFormText
              label="描述"
              name="des"
              width={'sm'}
              rules={[
                {
                  required: true,
                  message: '请输入描述',
                },
              ]}
            />
            <ProFormText
              label="规格"
              name="specs"
              width={'sm'}
              rules={[
                {
                  required: true,
                  message: '请输入规格',
                },
              ]}
            />
            <ProFormSelect
              label="识别方式"
              name="type"
              width={'sm'}
              options={[
                { value: `1`, label: `RFID` },
                { value: `2`, label: `二维码` },
              ]}
              rules={[
                {
                  required: true,
                  message: '请输入识别方式',
                },
              ]}
            />
            <ProFormUploadButton
              label="图片"
              name="upLoadImage"
              action=""
              listType="picture-card"
            />
            <ProFormUploadButton label="附件" name="upload" action="upload.do" />
          </Space>
        </ProForm.Item>
      </ModalForm>

      <ModalForm
        title="编辑"
        visible={modalEditForm}
        formRef={restEditFormRef}
        onFinish={async (value) => {
          console.log(value);
          if (value !== {}) {
            const temp = Object.assign(thingMessage, value);
            updateGood(temp);
            message.success('编辑成功');
            // domRef.current?.reload();
            console.log('s');
            console.log(temp);
          }
          setModalEditForm(false);
        }}
        modalProps={{
          onCancel: () => {
            setModalEditForm(false);
          },
        }}
        layout="horizontal"
        width={520}
      >
        <ProForm.Item>
          <Space direction="vertical" size="middle" align="center">
            <ProFormSelect
              // 左侧文本值
              label="类型"
              key="goodskey"
              options={list}
              fieldProps={{
                //这里使用了select的onChange方法，必须使用这样的写法来进行调用onChange方法
                onChange: (val) => console.log(val),
              }}
              name="parentId"
              width={'sm'}
              rules={[
                {
                  required: true,
                  message: '请输入类型',
                },
              ]}
            />
            <ProFormText
              label="名称"
              name="goods"
              width={'sm'}
              rules={[
                {
                  required: true,
                  message: '请输入名称',
                },
              ]}
            />
            <ProFormText
              label="描述"
              name="des"
              width={'sm'}
              rules={[
                {
                  required: true,
                  message: '请输入描述',
                },
              ]}
            />
            <ProFormText
              label="规格"
              name="specs"
              width={'sm'}
              rules={[
                {
                  required: true,
                  message: '请输入规格',
                },
              ]}
            />
            <ProFormSelect
              label="识别方式"
              name="type"
              width={'sm'}
              options={[
                { value: 1, label: `RFID` },
                { value: 2, label: `二维码` },
              ]}
              rules={[
                {
                  required: true,
                  message: '请输入识别方式',
                },
              ]}
            />
            <ProFormUploadButton
              label="图片"
              name="imageUrl"
              action=""
              listType="picture-card"
              fieldProps={{
                onPreview: () => {},
              }}
            />
            <ProFormUploadButton label="附件" name="upload" action="upload.do" />
          </Space>
        </ProForm.Item>
      </ModalForm>
    </PageContent>
  );
};
export default SysConfig;
