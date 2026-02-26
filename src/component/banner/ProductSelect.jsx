


// export default BrandSelect
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Select, Skeleton, Spin, message } from 'antd';
import debounce from 'lodash/debounce'; // Import debounce from lodash
import { useAuth } from '../../authentication/context/authContext';
import { FetchAllBrandList, FetchAllProductList, FetchDropProductList } from '../../service/api_services';

const { Option } = Select;

const ProductSelect = ({ setNavigateName, brandId }) => {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchInput, setSearchInput] = useState('');

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

    const handleChange = (value) => {
        console.log("value:", value);
        const catObj = data.find(item => item.productCode === value);
        console.log("catObj:", catObj);
        if (catObj) {
            setNavigateName(catObj.productName);
        } else {
            setNavigateName(""); // or some default
        }
    };

    return (
        <Form.Item
            label="Select Product"
            name="navigateToId"
            rules={[
                {
                    required: true,
                    message: 'Please Select prodcut',
                },
            ]}
        >
            <Select
                showSearch
                allowClear
                value={brandId}
                placeholder="Select Product"
                notFoundContent={fetching ? <Skeleton active /> : null}
                filterOption={false}
                onSearch={(searchText) => debouncedSearch(searchText)} // Use the debounced handler
                onPopupScroll={handleScroll}
                onChange={handleChange}
                style={{ width: '100%' }}
            >
                {data.map((item) => (
                    <Option key={item.productCode} value={item.productCode} label={item.productName}>
                        {item.productName}
                    </Option>
                ))}
            </Select>
        </Form.Item>
    );
};

export default ProductSelect;
