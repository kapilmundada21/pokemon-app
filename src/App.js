import { useState, useEffect } from "react";
import { Model } from "./components/Model";
import { IoIosArrowDown } from 'react-icons/io';
import { AiOutlineCloseCircle } from 'react-icons/ai';

function App() {

  const [pokemonApi, setPokemonApi] = useState({});
  const [pokemonApi1, setPokemonApi1] = useState({});
  const [openModel, setOpenModel] = useState(false);
  const [statsDropdown, setStatsDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState("")
  const [typeInput, setTypeInput] = useState("Normal")
  const [genderInput, setGenderInput] = useState("Male")
  const [searchArr, setSearchArr] = useState(undefined)
  const [statsInput, setStatsInput] = useState({
    hp : 50,
    attack : 50,
    defense : 50,
    speed : 50,
    spAttack : 50,
    spDefense : 50
  })

  const fetchData = async () => {
    let mainURL = `https://pokeapi.co/api/v2/pokemon/`;
    let url = `https://pokeapi.co/api/v2/pokemon/1/`;
    let mainData = await fetch(mainURL);
    let mainParsedData = await mainData.json();
    let data = await fetch(url); 
    let parsedData = await data.json();
    setPokemonApi(mainParsedData); 
    setPokemonApi1(parsedData); 
  }

  const handelModel = (e) => {
    e.preventDefault()
    setOpenModel(true)
  }

  const closeModel = () => {
    setOpenModel(false)
  }

  const toggleStatsDropdown = ()=>{
    if(statsDropdown){
      setStatsDropdown(false);
    }
    else{
      setStatsDropdown(true);
    }
  }

  useEffect(() => {
    fetchData();
    console.log(pokemonApi);
    console.log(pokemonApi1);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const arr = pokemonApi.results;

  const handelChange = (e) => {
    if(e.target.name === "search"){
      setSearchInput(e.target.value)
      setSearchArr(arr.find((o) => o.name === e.target.value))
    }
    else if(e.target.name === "type"){
      setTypeInput(e.target.value)
    }
    else if(e.target.name === "gender"){
      setGenderInput(e.target.value)
    }
    else if(e.target.name === "hp"){
      setStatsInput({
        ...statsInput,
        hp : e.target.value
      })
    }
    else if(e.target.name === "attack"){
      setStatsInput({
        ...statsInput,
        attack : e.target.value
      })
    }
    else if(e.target.name === "defense"){
      setStatsInput({
        ...statsInput,
        defense : e.target.value
      })
    }
    else if(e.target.name === "speed"){
      setStatsInput({
        ...statsInput,
        speed : e.target.value
      })
    }
    else if(e.target.name === "sp-attack"){
      setStatsInput({
        ...statsInput,
        spAttack : e.target.value
      })
    }
    else if(e.target.name === "sp-def"){
      setStatsInput({
        ...statsInput,
        spDefense : e.target.value
      })
    }
  }

  return (
    <>
    {openModel && <Model closeModel={closeModel} />}
    <div className="p-10 bg-[#deeded]">

      <nav className="mb-16 space-y-4">
        <div className="flex items-center">
          <h1 className="p-4 border-r-2 border-black text-3xl font-bold">Pokemon App</h1>
          <span className="p-4">Search for any Pokemon that exist on Planet</span>
        </div>
        <div className="flex space-x-10">
          <div className="flex flex-col w-2/5 space-y-2">
            <label htmlFor="search">Search by</label>
            <input type="search" name="search" id="search" placeholder="Name or Number" value={searchInput} onChange={handelChange} className="bg-[#c9dde2] p-3 rounded-lg w-full" />
          </div>
          <div className="flex flex-col w-1/5 space-y-2">
            <label htmlFor="type">Type</label>
            <select name="type" id="type" className="bg-[#c9dde2] p-3 rounded-lg w-full" value={typeInput} onChange={handelChange}>
              <option value="normal">Normal</option>
              <option value="fighting">Fighting</option>
              <option value="flying">Flying</option>
              <option value="poison">Poison</option>
              <option value="ground">Ground</option>
              <option value="rock">Rock</option>
            </select>
          </div>
          <div className="flex flex-col w-1/5 space-y-2">
            <label htmlFor="type">Gender</label>
            <select name="gender" id="gender" className="bg-[#c9dde2] p-3 rounded-lg w-full" value={genderInput} onChange={handelChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="flex flex-col w-1/5 space-y-2">
            <label htmlFor="type">Stats</label>
            <button onClick={()=>{toggleStatsDropdown()}} className="flex justify-between items-center bg-[#c9dde2] p-3 rounded-lg w-full text-left">HP +5 More <IoIosArrowDown /> </button>
          </div>
        </div>
        {statsDropdown && <div className="ml-[65%] z-10 border-2 border-black">
          <div className="p-6">
            <div className="flex justify-between pb-6">
              <span className="font-bold text-xl">Select Stats</span>
              <button onClick={()=>{toggleStatsDropdown()}}><AiOutlineCloseCircle className="text-xl" /></button>
            </div>
            <div className="flex justify-between py-2">
              <label htmlFor="type">HP</label>
              <input type="range" name="hp" id="hp" className="w-72" value={statsInput.hp} onChange={handelChange} />
            </div>
            <div className="flex justify-between py-2">
              <label htmlFor="type">Attack</label>
              <input type="range" name="attack" id="attack" className="w-72" value={statsInput.attack} onChange={handelChange} />
            </div>
            <div className="flex justify-between py-2">
              <label htmlFor="type">Defense</label>
              <input type="range" name="defense" id="defense" className="w-72" value={statsInput.defense} onChange={handelChange} />
            </div>
            <div className="flex justify-between py-2">
              <label htmlFor="type">Speed</label>
              <input type="range" name="speed" id="speed" className="w-72" value={statsInput.speed} onChange={handelChange} />
            </div>
            <div className="flex justify-between py-2">
              <label htmlFor="type">Sp. Attack</label>
              <input type="range" name="sp-attack" id="sp-attack" className="w-72" value={statsInput.spAttack} onChange={handelChange} />
            </div>
            <div className="flex justify-between py-2">
              <label htmlFor="type">Sp. Def</label>
              <input type="range" name="sp-def" id="sp-def" className="w-72" value={statsInput.spDefense} onChange={handelChange} />
            </div>
            <div className="pt-3 space-x-4 flex justify-end">
              <button type="reset" className="py-1 px-2 border-2 border-blue-700 rounded-lg text-blue-700 items-center">Reset</button>
              <button type="button" className="py-1 px-3 border-2 border-blue-700 rounded-lg bg-blue-700 text-white items-center">Apply</button>
            </div>
          </div>
        </div>}
      </nav>

      <div className="grid grid-cols-6 gap-8">

        {arr && !searchArr && arr.map((items, index)=>{
          return <div key={items.name} className="flex flex-col justify-center items-center border-2 border-dashed rounded-lg border-black bg-[#edc2c4]">
          <button onClick={handelModel} className="">
          <div className="my-4">
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${index+1}.svg`} height="150px" width="150px" alt="pokemon" />
          </div>
          <div className="text-center pb-4 flex flex-col">
            <span className="font-bold">{items.name}</span>
            <span>{index+1}</span>
          </div>
          </button>
        </div>
        })}

        {searchArr && <div key={searchArr.name} className="flex flex-col justify-center items-center border-2 border-dashed rounded-lg border-black bg-[#edc2c4]">
          <button onClick={handelModel} className="">
          <div className="my-4">
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${searchArr.url.charAt(34)}.svg`} height="150px" width="150px" alt="pokemon" />
          </div>
          <div className="text-center pb-4 flex flex-col">
            <span className="font-bold">{searchArr.name}</span>
            {/* <span>{searchIndex}</span> */}
            <span>{searchArr.url.charAt(34)}</span>
          </div>
          </button>
        </div>
        }
        
      </div>

    </div>
    </>
  );
}

export default App;
