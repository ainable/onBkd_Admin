
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Select, Skeleton, Spin, message } from 'antd';
import debounce from 'lodash/debounce'; // Import debounce from lodash
import { useAuth } from '../../authentication/context/authContext';
import { FetchDropProductList } from '../../service/api_services';


const { Option } = Select;

const UpdateIngradient = ({ ingredients }) => {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


    const fetchData = async (page) => {
        setFetching(true);
        try {
            const res = await FetchDropProductList(token, page, searchInput);
            if (res.data.code === 200) {
                const newData = res.data.data;
                if (searchInput != '') {
                    setData(newData);
                } else {
                    setData((prevData) => [...prevData, ...newData]);
                }
                setHasMore(newData.length != 0);
                setFetching(false);
            }
        } catch (error) {
            console.log('Failed to fetch data:', error);
            setFetching(false);
        }
    };

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((value) => {
            setPage(1); // Reset pagination when a new search occurs
            setData([]); // Clear previous data
            setSearchInput(value); // Set the search input value
        }, 1000), // Delay of 300ms
        []
    );

    useEffect(() => {
        fetchData(page);
    }, [page, searchInput]);

    const handleScroll = (event) => {
        const { target } = event;
        if (!fetching && hasMore && target.scrollTop + target.offsetHeight === target.scrollHeight) {
            setPage((prevPage) => prevPage + 1);
        }
    };



    return (
        <div className="add_product_custome">
            <Form.Item
                label="Select Ingredient Product"
                name="ingredients"
                rules={[
                    {
                        required: true,
                        message: 'Please Select prodcut',
                    },
                ]}
            >
                <Select
                    mode='multiple'
                    showSearch
                    allowClear
                    placeholder="Select Product"
                    notFoundContent={fetching ? <Skeleton active /> : null}
                    filterOption={false}
                    onSearch={(searchText) => debouncedSearch(searchText)} // Use the debounced handler
                    onPopupScroll={handleScroll}
                    style={{ width: '100%' }}
                >
                    {data.map((item) => (
                        <Option key={item.productCode} value={item.productCode}
                            label={capitalize(item.productName)}>
                            <span>{capitalize(item.productName)}-{item.packSize}</span>
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </div>
    );
};

export default UpdateIngradient;
