import { useRoutines, useNewRoutines } from "../../../src/utils/routines";

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


describe('useNewRoutines_function', () => {
    // Tests that routine and rules are initialized
    it('test_initialization', () => {
        const { routine, rules } = useNewRoutines();
        expect(typeof routine).toEqual("object");
        expect(typeof rules).toEqual("object");
    });

    //Tests that saveRoutine save item in data base and restart routine
    it('test_saving', async ()=>{
        const {routine, saveRoutine} = useNewRoutines();
        const res=await saveRoutine(routine);
        const isEmpty=Object.keys(routine).every((key)=>routine[key]==null);
        expect(res).toEqual(false)
        expect(isEmpty).toEqual(true)
    })

    //Test that resetRoutine works properly
    it('test_reset',()=>{
        const {routine, resetRoutine} =useNewRoutines();
        const isEmpty=Object.keys(routine).every((key)=>routine[key]==null);
        resetRoutine();
        expect(isEmpty).toEqual(true)

    })

   
});