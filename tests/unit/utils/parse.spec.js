import * as parse from "../../../src/utils/parse"
import supabase from "../../../src/utils/supabase";


describe('parseFuntions',()=>{

    //Tests thast returning object with integers
    it('test_pagination',()=>{
        const {from, to}=parse.getPagination(1,10);
        expect(from).toEqual(0);
        expect(to).toEqual(9);
    })

    //Tests that filterOptions return data
    it('test_filterOption',()=>{
        const options=[
            {value: 1, label:"First value"},
            {value: 2, label:"Second value"},
            {value: 3, label:"Third value"},
        ]
        const input="First"

        options.forEach((opt)=>{
            const res=parse.filterOption(input, opt);
            if(opt.value==1){
                expect(res).toEqual(true);
            } else{
                expect(res).toEqual(false);
            }
        })

    })

    //Tests that is uploading file
    it('test_upload', async()=>{
       await supabase.auth.signInWithPassword({
            email: import.meta.env.VITE_TEST_EMAIL,
            password: import.meta.env.VITE_TEST_PASSWORD
        })
        const file= await parse.upload(dataURL, "test", true);
        expect(typeof file).toEqual('string');
    }) 
     //Tests that is uploading failed file
     it('test_upload_fail', async()=>{
        await supabase.auth.signInWithPassword({
             email: import.meta.env.VITE_TEST_EMAIL,
             password: import.meta.env.VITE_TEST_PASSWORD
         })
         const file= await parse.upload(dataURL,'test');
         expect(typeof file).toEqual('object');
     })

    //Tests that present loading
    it('test_loading',async()=>{
        const loading=await parse.ionLoading();
        expect(loading.presented).toEqual(true);
    })

    //Tests that format number to money
    it('test_format_money',()=>{
        const cant=2534;
        const nonNumber="test";
        const formatted=parse.formatMoney(cant);
        const formatted2=parse.formatMoney(nonNumber);
        expect(formatted).toEqual('$2,534')
        expect(formatted2).toEqual('$0')
    })
})

const dataURL="https://mikogujxrkylpxslwcva.supabase.co/storage/v1/object/public/zfit_storage/icon.png"