import { useRoutines, useNewRoutine } from "../../../src/utils/routines";
import validate from "../validate";
describe('useRoutines_function', () => {
    // Tests that params and routines are initialized correctly
    it('test_initialization', () => {
        const { params, routines } = useRoutines();
        expect(typeof params).toEqual("object");
        expect(routines.value).toEqual([]);
    });

    // Tests that getRoutines function fetches data and pushes it to routines array
    it('test_get_routines', async () => {
        const { routines, getRoutines } = useRoutines();
        const instance=await getRoutines();
        expect(instance.status).toEqual(200);
    });

    // Tests that onSearch function clears routines array and calls getRoutines function
    it('test_on_search', async () => {
        const { routines, params, onSearch } = useRoutines();
        params.search="Ex"
        const instance=await onSearch();
        expect(instance.status).toEqual(200);
    });
});


describe('useNewRoutine_function', () => {
    // Tests that routine and rules are initialized
    it('test_initialization', () => {
        const { routine, rules } = useNewRoutine();
        expect(typeof routine).toEqual("object");
        expect(typeof rules).toEqual("object");
    });

    //Tests that saveRoutine save item in data base and restart routine
    it('test_saving_routine', async ()=>{
        const {routine, saveRoutine} = useNewRoutine();
        const res=await saveRoutine(routine);
        const isEmpty=Object.keys(routine).every((key)=>routine[key]==null);
        expect(res).toEqual(false)
        expect(isEmpty).toEqual(true)
    })

    //Test that resetRoutine works properly
    it('test_reset_routine',()=>{
        const {routine, resetRoutine} =useNewRoutine();
        const isEmpty=Object.keys(routine).every((key)=>routine[key]==null);
        resetRoutine();
        expect(isEmpty).toEqual(true)

    })

    //Tests that rules validates name, description and image
    it('test_rules',async()=>{
        const {routine, rules}=useNewRoutine();
        routine.name="";
        routine.description="";
        routine.image="";
        const errors=await validate(routine, rules);
        expect(errors.name).toBeTruthy();
        expect(errors.description).toBeTruthy();
        expect(errors.image).toBeTruthy();
    }) 

    //Tests that rules validates name and description min
    it('test_min',async()=>{
        const {routine, rules}=useNewRoutine();
        routine.name="Pepe";
        routine.description="Test short";
        const errors=await validate(routine, rules);
        expect(errors.name).toBeTruthy();
        expect(errors.description).toBeTruthy();
    })

    //Tests that rules validates image type url
    it('test_image_url',async()=>{
        const {routine, rules}=useNewRoutine();
        routine.image="testcontent";
        const errors=await validate(routine, rules);
        expect(errors.image).toBeTruthy();
    })

    //Tests that rules validation pass
    it('test_validation_pass',async()=>{
        const {routine, rules}=useNewRoutine();
        routine.name="Name of the object";
        routine.description="Short description just for testing purposes";
        routine.image="https://vitest.dev/logo-shadow.svg";
        const result=await validate(routine, rules);
        expect(result).toEqual(true);
      
    })

   
});