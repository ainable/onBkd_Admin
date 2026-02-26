import React, { useState, useEffect, useCallback } from 'react';
import { Form, Select, Spin, message } from 'antd';
import debounce from 'lodash/debounce'; // Import debounce from lodash
import { useAuth } from '../../authentication/context/authContext';
import { fetchAllBranchList } from '../../service/api_services';

const { Option } = Select;

const SelectedBranch = ({ setBranchId, isFilter }) => {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();

    const fetchData = async (page) => {

        setFetching(true);
        try {
            const res = await fetchAllBranchList(token, page, searchInput);
            console.log(res)
            if (res.data.code === 200) {
                const newData = res.data.data.data;
                setData(newData);
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
    }, [page]);


    const handleScroll = (event) => {
        const { target } = event;
        if (!fetching && hasMore && target.scrollTop + target.offsetHeight === target.scrollHeight) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleChange = (value) => {
        setBranchId(value);
        // setCurrent(1)
    };

    return (
        <Form.Item
            label={isFilter ? "Select Branch" : ""}
            name="branchCode"
            rules={[
                {
                    required: false,
                    message: 'Please Select Branch!',
                },
            ]}

        >
            <Select
                showSearch
                size={isFilter ? "large" : "middle"}
                allowClear
                loading={fetching}
                // value={brandId}
                placeholder="Select Branch"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={(searchText) => debouncedSearch(searchText)} // Use the debounced handler
                onPopupScroll={handleScroll}
                onChange={handleChange}
                style={{ width: isFilter ? "100%" : '220px' }}
            >
                {data.map((item) => (
                    <Option key={item.branchCode} value={item.branchCode}>
                        {capitalize(item.branchName)}
                    </Option>
                ))}
            </Select>
        </Form.Item>
    );
};

export default SelectedBranch;
