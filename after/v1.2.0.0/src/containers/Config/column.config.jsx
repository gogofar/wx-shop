/**
 * Author：tantingting
 * Time：2017/8/21
 * Description：Description
 * 呵呵
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Button, Table, Modal, Form } from 'antd'
import './config.scss'
import {getColumnList, addColimnItem, editColimnItem, editListItem, addColumnQuery, addColumn, delColimnItem, editColimnSort} from '../../actions/column.action'
const { TextArea } = Input
const FormItem = Form.Item
let columns = []
const confirm = Modal.confirm
const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
}
class ColumnConfig extends Component {
    constructor () {
        super()
        this.state = {
            'visible': false
        }
    }
    componentWillMount () {
        const {dispatch} = this.props
        columns = [{
            title: '专栏类型名称',
            width: '25%',
            dataIndex: 'lk_column_name'
        }, {
            title: '显示顺序',
            dataIndex: 'lk_column_sort',
            width: '15%',
            render: (text, record) => {
                return <Input style={{'width': '50%'}} value={record.lk_column_sort} onBlur={(e) => dispatch(editColimnSort({'lk_column_sort': e.target.value}, record.key, record.lk_column_id))} onChange={(e) => this.changeSort(e, record.key, record.lk_column_id)} />
            }
        }, {
            title: '备注',
            width: '40%',
            dataIndex: 'lk_column_remark'
        }, {
            title: '操作',
            render: (text, record) => {
                return <div className="goods-operate">
                    {/* <a className="mr15" onClick={() => {
                        this.getEditData(record)
                    }}>编辑</a> */}
                    <a onClick={() => this.delColItem(record)}>删除</a>
                </div>
            }
        }]
        dispatch(getColumnList())
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(addColumn({'list': []}))
    }
    /* 删除 */
    delColItem (record) {
        const {dispatch} = this.props
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                dispatch(delColimnItem({'lk_column_id': record.lk_column_id}, record.key))
            },
            onCancel () {}
        })
    }
    getEditData (item) {
        const {dispatch} = this.props
        dispatch(addColumnQuery(item))
        dispatch(addColumn({'type': 'edit'}))
        this.setState({'visible': true})
    }
    changeSort = (e, index, id) => {
        this.props.dispatch(editListItem({'lk_column_sort': e.target.value}, index))
    }
    submitForm = () => {
        const { form, dispatch, column, query } = this.props
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            form.resetFields()
            this.setState({ visible: false })
            column.type === 'edit' ? dispatch(editColimnItem({...values}, query.key, query.lk_column_id)) : dispatch(addColimnItem({...values}))
        })
    }
    render () {
        const {getFieldDecorator} = this.props.form
        const {list, query, dispatch, column} = this.props
        return <div className="recommend-config common">
            <Button type="primary" icon="plus" onClick={() => { dispatch(addColumn({'type': 'add'})); this.setState({'visible': !this.state.visible}) }}>新建</Button>
            <Table className="center-table mt30" columns={columns} dataSource={!list.length ? [] : list.map((item, index) => ({...item, 'key': index}))} bordered pagination={false}/>
            {/*
                新增/修改专栏
            */}
            <Modal className="common" title={column.type === 'edit' ? '编辑专栏' : '新建专栏'} visible={this.state.visible} onOk={() => this.submitForm()} onCancel={() => this.setState({ 'visible': false })}
                okText="确认"
                cancelText="取消"
            >
                <Form>
                    <FormItem label="专栏名称" {...formItemLayout}>
                        {getFieldDecorator('lk_column_name', {
                            rules: [{
                                required: true, message: '请填写专栏名称！'
                            }],
                            initialValue: query.lk_column_name
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="备注" {...formItemLayout}>
                        {getFieldDecorator('lk_column_remark', {
                            initialValue: query.lk_column_remark
                        })(<TextArea rows="6" />)}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    return {
        column: state.column,
        query: state.column.query,
        list: state.column.list
        /* list: state.column.list.sort((a, b) => {
            return (!a.lk_column_sort ? 0 : parseInt(a.lk_column_sort)) - (!b.lk_column_sort ? 0 : parseInt(b.lk_column_sort))
        }) */
    }
}

export default connect(mapStateToProps)(Form.create()(ColumnConfig))
