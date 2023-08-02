import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "../../../src/store/userStore";

describe('userStore', () => {
    setActivePinia(createPinia());

    //Tests that is getting user
    it('test_get_user',()=>{
        const userStore=useUserStore();
        const oldUser={name: "test"};
        localStorage.setItem('zfitLoggedUser', JSON.stringify(oldUser));
        const user=userStore.getUser;
        expect(user).toEqual(oldUser);
    })

    //Tests that is setting user
    it('test_set_user',()=>{
        const userStore=useUserStore();
        const oldUser={name: "test"};
        userStore.setUser(oldUser);
        const user=userStore.getUser;
        expect(user).toEqual(oldUser);
    })
})
