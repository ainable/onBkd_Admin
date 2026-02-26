import { Card, Table } from 'antd'
import React from 'react'

function ReportTable({ column, tableData, filterForm, isReport }) {


    return (
        <div >
            <Table
                columns={column}
                loading={isReport}
                sticky
                title={filterForm}
                dataSource={tableData}
                scroll={{ x: 1000 }}
                pagination={{
                    showSizeChanger: false,
                    pageSize: 10,
                }}

            />
        </div>
    )
}

export default ReportTable