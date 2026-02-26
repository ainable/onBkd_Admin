import { useState, useEffect } from "react";
import { FetchAllBrandList, FetchAllCategorItemList, FetchAllCategoryList, fetchAllBranchList } from "../service/api_services";

export const CategoryHook = (token) => {
  const [categoryList, setCategoryList] = useState(null)
  const [current, setCurrent] = useState(1);
  const [defaultCatId, setDefaultCatId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await FetchAllCategoryList(token, current);
      console.log("ctegory ", response)
      if (response.status == 200) {
        setCategoryList(response.data.data.paginatedData);
        setDefaultCatId(response.data.data.paginatedData[0].categoryID);

        setLoading(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(true);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token]);
  return { categoryList, loading, defaultCatId };
};

export const BrandHook = (token) => {
  const [brandList, setBrandList] = useState(null)
  const [current, setCurrent] = useState(1);

  const [loading, setLoading] = useState(false);



  const fetchBranchData = async () => {
    try {
      const response = await FetchAllBrandList(token, current);
      console.log("response", response)
      if (response.status == 200) {
        setBrandList(response.data.data.paginatedData);
        // setCurrent(prevPage => prevPage + 1);
        setLoading(true)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(true);
    }
  };
  useEffect(() => {
    fetchBranchData();
  }, [token]);
  return { brandList, loading, fetchBranchData };
};


export const CategoryItemHook = (token, categoryId) => {
  const [categoryItemList, setCategoryItemList] = useState(null)
  const [defaultCatItemId, setDefaultCatItemId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await FetchAllCategorItemList(token, categoryId);
      if (response.status == 200) {
        setCategoryItemList(response.data.data);
        setDefaultCatItemId(response.data.data[0].categoryItemID);

        setLoading(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(true);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token, categoryId]);
  return { categoryItemList, loading, defaultCatItemId };
};

export const BranchHook = (token) => {
  const [branchList, setBranchList] = useState(null)
  const [defaultBranchId, setDefaultBranchId] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetchAllBranchList(token);
      if (response.status == 200) {
        setBranchList(response.data.data.data);
        setDefaultBranchId(response.data.data.data[0]._id);
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(true);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token]);
  return { branchList, loading, defaultBranchId };
};