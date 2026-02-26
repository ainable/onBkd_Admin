import { Avatar, Button, Dropdown, Image, Menu, message, Popconfirm, Space } from 'antd';
import '../../../style/location.css'
import { HiOutlineDotsVertical } from "react-icons/hi";
// import EditFaqData from './EditFaqData';
import { useAuth } from '../../../authentication/context/authContext';
import { deleteFaqItem } from '../../../service/api_services';
import EditFaq from './EditFaq';
import {  AiOutlineDelete } from "react-icons/ai";



function FaqAction({ faqEditDtata, ShowAllFAQList }) {
    const { token } = useAuth()

    const cancel = (e) => {
        console.log(e);
        message.error('Click on No');
    };


    const deleteHandler = async () => {
        const body = {
            faqId: faqEditDtata?._id,
        }
        try {
            await deleteFaqItem(token, body)
                .then((res) => {
                    console.log("  faq delete ", res);
                    if (res.data.code == 201) {
                        message.success(res.data.message);
                        ShowAllFAQList()
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (error) {
            console.log(error);
        }
    }
    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <EditFaq faqEditDtata={faqEditDtata} ShowAllFAQList={ShowAllFAQList} />
                    ),
                },
                {
                    key: '2',
                    label: (
                        <Popconfirm
                            title="Delete the FAQ"
                            description="Are you sure to delete this FAQ?"
                            onConfirm={() => deleteHandler()}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <AiOutlineDelete /> Delete Faq
                        </Popconfirm>

                    ),
                },



            ]}
        />
    );




    return (

        <>
            <Space direction="vertical">
                <Space wrap>
                    <Dropdown overlay={menu} placement="bottomRight" trigger={['click']} >
                        <Button type='link' variant='primary' icon={<HiOutlineDotsVertical className='option_icon' />} onClick={(event) => {
                            // If you don't want click extra trigger collapse, you can prevent this:
                            event.stopPropagation();
                        }}></Button>
                    </Dropdown>

                </Space>
            </Space>
        </>
    )
}



export default FaqAction