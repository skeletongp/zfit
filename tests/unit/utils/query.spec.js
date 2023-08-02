import { useQuery } from "../../../src/utils/query";
import supabase from "../../../src/utils/supabase";

describe("useQuery_util", async () => {
  await supabase.auth.signInWithPassword({
    email: import.meta.env.VITE_TEST_EMAIL,
    password: import.meta.env.VITE_TEST_PASSWORD,
  });
  //Tests that params is initiliazed
  it("test_params", () => {
    const { params } = useQuery("users");
    expect(typeof params).toEqual("object");
  });

  //Tests that getting data
  it("test_get_data", async () => {
    const { params, getData } = useQuery("users");
    params.paginate = true;
    params.searchables = "name";
    params.search = "isma";
    const instance = await getData();
    console.log(instance)
    expect(instance.data.length).toBeGreaterThan(0);
  });

  //Tests that finding data
  it("test_find_data", async () => {
    const { findData } = useQuery("users");
    const instance = await findData("email", import.meta.env.VITE_TEST_EMAIL);
    expect([200, 406]).toContain(instance.status);
  });

  //Tests that can get data with perPage and page null
  it("test_page_and_perpage_null", async () => {
    const { params, getData } = useQuery("users");
    params.paginate = true;
    params.page = null;
    params.perPage = null;
    const instance = await getData();
    expect(instance.data.length).toBeGreaterThan(0);
  });
  //Tests that can get data with cols null
  it("test_cols_null", async () => {
    const { params, getData } = useQuery("users");
    params.cols = null;
    const instance = await getData();
    expect(instance.data.length).toBeGreaterThan(0);
  });

  //Tests that can get data with orderBy and ascend null
  it("test_order_by_and_ascend_null", async () => {
    const { params, getData } = useQuery("users");
    params.orderBy = null;
    params.ascend = null;
    const instance = await getData();
    expect(instance.data.length).toBeGreaterThan(0);
  });

  //Tests that can filter data
  it('test_filter_data',async()=>{
    const {params, getData}=useQuery('users');
    params.filter=[{key: "email", value: import.meta.env.VITE_TEST_EMAIL}]
    const {data}=await getData();
    expect(data.length).toBeGreaterThan(0);
  })
});
