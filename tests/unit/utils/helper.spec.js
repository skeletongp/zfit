import { presentConfirm, loading, useModal } from "../../../src/utils/helper";
import { modalController } from "@ionic/vue";

describe('test_helperFunction',()=>{
    
    //Test that present confirm works
    it("Alert must be presented",async()=>{
        const alert=await presentConfirm('Test title', 'Test subheader');
        expect(alert.presented).toBe(true);
    })

    //Test that loading works
    it("Loading must be presented",async()=>{
        const load=await loading(true);
        expect(load.presented).toBe(true);
        const unload=await loading(false);
        expect(unload.presented).toBe(false);
    })

    //Test that loadin dismiss works
    it("Loading must be dismissed",async()=>{
        const load=await loading();
        expect(load.presented).toBe(false);
    })
})

describe("test_useModal",()=>{

    //Tests that modal can open
    it('isOpen must be true',async()=>{
        const {isOpen, openModal}= useModal();
        openModal();
        expect(isOpen.value).toBe(true);
    })

    //Tests that modal can close
    it('isOpen must be false',async()=>{
        const {isOpen, closeModal}= useModal();
        closeModal();
        expect(isOpen.value).toBe(false);
    })

    //Tests that modal open afetar trigger modalDidPresent
    it('onModalDidPresent must turn isOpen to true',async()=>{
        const {isOpen, onModalDidPresent}= useModal();
        onModalDidPresent();
        expect(isOpen.value).toBe(true);
    })

     //Tests that modal open afetar trigger modalDidDismiss
     it('onModalDidDismiss must turn isOpen to false',async()=>{
        const {isOpen, onModalDidDismiss}= useModal();
        onModalDidDismiss();
        expect(isOpen.value).toBe(false);
    })
})