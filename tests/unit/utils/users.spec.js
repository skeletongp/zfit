import { useUsers, useNewUser } from "../../../src/utils/users";
import supabase from "../../../src/utils/supabase";


describe("useUsers_function", async () => {
  beforeEach(async () => {
    await supabase.auth.signOut();
  });
 

  //Tests that params and users is initialized
  it("test_params_and_users", async () => {
    const { params, users } = useUsers();
    expect(typeof params).toEqual("object");
    expect(users.value).toEqual([]);
  });

  //Tests that admin can retrieve users
  it('test_admin_can_get_users',async()=>{
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { params, users, getUsers } = useUsers();
    const instance=await getUsers();
    expect(users.value.length).toBeGreaterThan(3)
  })

  //Tests that admin can retrieve users with contacts
  it('test_admin_can_retrieve_users_w_contacts',async()=>{
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { params, users, getUsers } = useUsers();
    params.cols="*, contacts(*)"
    await getUsers();
    expect(users.value.length).toBeGreaterThan(0)
  })

  //Tests that trainer can get users
  it('test_trainer_can_get_users', async()=>{
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_TRAINER_EMAIL,
      password: import.meta.env.VITE_TRAINER_PASSWORD,
    });
    const {data:{user}}=await supabase.auth.getUser();
    const { users, getUsers } = useUsers();
    await getUsers();
    const filtered=users.value.filter((usr)=>{return usr.id==user.id || usr.trainer_id==user.id})
    expect(users.value.length).toEqual(filtered.length);
  })

   //Tests that client can get just self
   it('test_client_can_get_just_self', async()=>{
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_CLIENT_EMAIL,
      password: import.meta.env.VITE_CLIENT_PASSWORD,
    });
    const { users, getUsers } = useUsers();
    await getUsers();
    expect(users.value.length).toEqual(1);
  })

  //Tests that user can get just self
  it('test_user_can_get_just_self', async()=>{
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_USER_EMAIL,
      password: import.meta.env.VITE_USER_PASSWORD,
    });
    const { users, getUsers } = useUsers();
    await getUsers();
    expect(users.value.length).toEqual(1);
  })

  

  //Tests that can find user by email
  it('test_can_find_user_by_email',async()=>{
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const {findUser} =useUsers();
    const {data}=await findUser(import.meta.env.VITE_USER_EMAIL,'email');
    expect(data.email).toBeDefined();
    expect(data.email).toEqual(import.meta.env.VITE_USER_EMAIL);
  })
});
