import React, { useState, useEffect, useCallback } from 'react';
import { Form, Select, Skeleton, Spin, message } from 'antd';
import debounce from 'lodash/debounce'; // Import debounce from lodash
import { useAuth } from '../../authentication/context/authContext';
import { FetchAllBrandList } from '../../service/api_services';

const { Option } = Select;

const SelecteBrandData = ({ setBrandId, brandId, isFilter }) => {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchInput, setSearchInput] = useState('');

    const fetchData = async (page) => {
        setFetching(true);
        try {
            const res = await FetchAllBrandList(token, page, searchInput);
            if (res.data.code === 200) {
                const newData = res.data.data.paginatedData;
                setData((prevData) => [...prevData, ...newData]);
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
        setBrandId(value);
        // ShowAllProductsList();

    };

    return (
        <Form.Item
            label={isFilter ? "Select Brand" : ""}
            name={isFilter ? "brnadId" : "navigateToId"}

        >
            <Select
                showSearch
                allowClear
                size={isFilter ? 'large' : "middle"}
                onClear={() => setSearchInput("")}
                value={brandId}
                placeholder="Select Brand"
                notFoundContent={fetching ? <Skeleton active /> : null}
                filterOption={false}
                onSearch={(searchText) => debouncedSearch(searchText)} // Use the debounced handler
                onPopupScroll={handleScroll}
                onChange={handleChange}
                style={{ width: isFilter ? "100%" : '220px' }}
            >
                {data.map((item) => (
                    <Option key={item.brandID} value={item.brandID}>
                        {item.brandName}
                    </Option>
                ))}
            </Select>
        </Form.Item>
    );
};

export default SelecteBrandData;
