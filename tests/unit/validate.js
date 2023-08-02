
import { Form } from 'ant-design-vue';
import Schema from 'async-validator';
Schema.warning = function(){};
import { reactive } from 'vue';
const useForm = Form.useForm;
export default  async (fields, rules) => {
  const {resetFields, validate, validateInfos}=useForm(fields, reactive(rules))
  return validate().then(async res=>{
     return true;
  }).catch(errors=>{
    const errores= {}
    errors.errorFields.forEach((err)=>errores[err.name]=err.errors[0]);
    return errores;
  })
   
  };