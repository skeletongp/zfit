import { useUsers } from "../../../src/utils/users";
import supabase from "../../../src/utils/supabase";
import validate from "../validate";

describe("useUsers_function", async () => {
  await supabase.auth.signInWithPassword({
    email: import.meta.env.VITE_TEST_EMAIL,
    password: import.meta.env.VITE_TEST_PASSWORD,
  });

  //Tests that params and users is initialized
  it("test_params_and_users", async () => {
    const { params, users } = useUsers();
    expect(typeof params).toEqual("object");
    expect(users.value).toEqual([]);
  });

  //Tests that can retrieve users
  it('test_can_retrieve_users',async()=>{
    const { params, users, getUsers } = useUsers();
    const instance=await getUsers();
    expect(users.value.length).toBeGreaterThan(0)
  })

  //Tests that can retrieve users with contacts
  it('test_can_retrieve_users_w_contacts',async()=>{
    const { params, users, getUsers } = useUsers();
    params.cols="*, contacts(*)"
    await getUsers();
    expect(users.value.length).toBeGreaterThan(0)
  })

  //Tests that can find user by email
  it('test_can_find_user_by_email',async()=>{
    const {findUser} =useUsers();
    const {data}=await findUser(import.meta.env.VITE_TEST_EMAIL,'email');
    console.log(data)
    expect(data).toBeTruthy();
  })
});
