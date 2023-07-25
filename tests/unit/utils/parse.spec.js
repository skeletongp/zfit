import * as parse from "../../../src/utils/parse"
import supabase from "../../../src/utils/supabase";
import { loadingController } from "@ionic/vue";

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
        const file= await parse.upload(dataURL,'test');
        expect(typeof file).toEqual('string');
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

const dataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAilBMVEVHcExHiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9Hiv9WkbhyAAAALXRSTlMA6fH5rdwnAiEH0+btgEEEhIdflMmPDhUatIxwnWlXMNV1EEtIpjajv9fMK6VUL25nAAACmklEQVRYw61X6ZqqMAwFpqwFZBXZdNDRcWbk/V/vYsvSlrL25oefHzQhPTk5TSWJb7p29kGkQtuGagT8s6ZLG+zgxtZHTdmHFbuHle6nyqq5ZlWnFe6JJ9eTZmfHBXe9hPWcxea8/9+T3risWpYqD3A470VaGWeBwfUPlMEZgtw1rqaum1fDzQFKLG3WXAsUT/E5uWS9t/J9YzZ7vH0rtdb4R92alI1g3nuofG6C2rn5eQ05+ow/6F4UxjRIDxIhap3efV+9zaHskRiXvP2n81wBVE1J/Ntn4QLlqQAhgU9bv2yJpxkZIB8AeI5CTphLgqj1j8t2/8stq6dDgGLoH9w+arKi1wy184+ubG2+RrJwCZwwdIILKQRGm8Nr+FxiMxm1K51eFiyH5IybAeA93v9y/LjC9KcJYDo2JQQOp3ecukJLPznM1iJWCSKNbf2GE59mXxk6gQdHVuCDyhB3tdv8jTEm1Pe5sgSpHNKOzbo1KoH5y9ezXxKHLwzvQdJQKvBIgTNhDqkwsGXjGb0CZP2UqQCKMeqrs+QzfTGTAJ1C3hYPB3IJBH6mA/yYbF8BKWLV6TJ3LlyInSLwIgk1h3wcawvXAgJF1IKqhMBUzQnZY80jtoo+DSVEeYtQgnAuACE5mEC2eADhLQiDKFxGYSIJU1m4mYTbWVBQ9N2S9uoP6H2ielL66u2TdVw8JOu7DpY2gWrX0fa2AodNdhyuRAn61tpyvGMHfMbLyfYBg5oyyh0jDik5T33HkEUMWgpV17VjXpNtONaWDYOmdOqmLDbZlaPurZux7qNU1wzbRtGtAZyJZ3HcN/ye3XdzYY6duHDU9UKxlq48bfRg/6UL8edP5NpXw3KJKbMXT9lb03CCV9//cPnedv3/B03WKCmdQSV1AAAAAElFTkSuQmCC"