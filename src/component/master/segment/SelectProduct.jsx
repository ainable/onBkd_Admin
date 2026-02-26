


// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { AutoComplete, Form, Spin } from 'antd';
// import { useAuth } from '../../../authentication/context/authContext';
// import { fetchSearchProduct } from '../../../service/api_services';
// import { debounce } from 'lodash';

// const SelectProduct = ({ setProductCode }) => {
//     const { token } = useAuth();
//     const [form] = Form.useForm();
//     const [vendorList, setVendorList] = useState([]);
//     const [current, setCurrent] = useState(1);
//     const [searchInput, setSearchInput] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const observer = useRef();

//     const shawSearchProduct = async () => {
//         if (isLoading) return;
//         setIsLoading(true);
//         try {
//             const res = await fetchSearchProduct(token, current, searchInput);
//             if (res.status === 200) {
//                 setVendorList((prev) => [...prev, ...res.data.data]);
//             }
//         } catch (error) {
//             console.log(error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         shawSearchProduct(); // Fetch initial data
//     }, [current, searchInput]);

//     useEffect(() => {
//         const debouncedSearch = debounce(handleSearch, 1000);
//         return () => {
//             debouncedSearch.cancel();
//         };
//     }, [searchInput]);

//     const handleSearch = (label) => {
//         setSearchInput(label);
//         setVendorList([]); // Clear vendor list for new search
//         setCurrent(1); // Reset pagination
//     };

//     const handleSelect = (value, option) => {
//         setProductCode(option.id);
//     };

//     const lastOptionElementRef = useCallback((node) => {
//         if (isLoading) return;
//         if (observer.current) observer.current.disconnect();
//         observer.current = new IntersectionObserver((entries) => {
//             if (entries[0].isIntersecting) {
//                 setCurrent((prev) => prev + 1);
//             }
//         });
//         if (node) observer.current.observe(node);
//     }, [isLoading]);

//     return (
//         <div className='assign_model'>
//             <Form layout="vertical" form={form}>
//                 <Form.Item
//                     rules={[
//                         {
//                             required: true,
//                             message: "Please Select Product",
//                         },
//                     ]}
//                     label="Search Product"
//                     name="productCode">
//                     <AutoComplete
//                         options={vendorList.map((option, index) => ({
//                             label: option.productName,
//                             value: option.productName,
//                             id: option.productCode,
//                             key: option.productCode,
//                             ref: index === vendorList.length - 1 ? lastOptionElementRef : null, // Attach ref to the last element
//                         }))}
//                         onSearch={handleSearch}
//                         placeholder="Search Product"
//                         onSelect={handleSelect}
//                         filterOption={false} // Disable default filtering
//                         dropdownRender={(menu) => (
//                             <>
//                                 {menu}
//                                 {isLoading && <div   style={{ padding: 8 }}><Spin /></div>}
//                             </>
//                         )}
//                     />
//                 </Form.Item>
//             </Form>
//         </div>
//     );
// };

// export default SelectProduct;



// export default BrandSelect
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Select, Skeleton, Spin, message } from 'antd';
import debounce from 'lodash/debounce'; // Import debounce from lodash
import { useAuth } from '../../../authentication/context/authContext';
import { FetchDropProductList } from '../../../service/api_services';


const { Option } = Select;

const ProductSelect = ({ setXlsFile }) => {
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

    // const handleChange = (value) => {
    //     setProductCode(value);
    // };

    return (
        <div className="add_product_custome">
            <Form.Item
                label="Select Product"
                name="productCode"
                rules={[
                    {
                        required: setXlsFile!=null ? true : false,
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
                    // onChange={handleChange}
                    style={{ width: '100%' }}
                >
                    {data.map((item) => (
                        <Option key={item.productCode} value={item.productCode}
                            label={capitalize(item.productName)}>
                            {capitalize(item.productName)}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </div>
    );
};

export default ProductSelect;
