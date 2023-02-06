import { useState, useEffect } from "react";
import { Model } from "./components/Model";

function App() {

  const [pokemonApi, setPokemonApi] = useState({});
  const [pokemonApi1, setPokemonApi1] = useState({});
  const [openModel, setOpenModel] = useState(false);
  
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

  useEffect(() => {
    fetchData();
    console.log(pokemonApi);
    console.log(pokemonApi1);
  }, [])
  const arr = pokemonApi.results;


  return (
    <div className="p-10 bg-[#deeded]">

      <nav className="mb-16 space-y-4">
        <div className="flex items-center">
          <h1 className="p-4 border-r-2 border-black text-3xl font-bold">Pokemon App</h1>
          <span className="p-4">Search for any Pokemon that exist on Planet</span>
        </div>
        <div className="flex space-x-10">
          <div className="flex flex-col w-2/5 space-y-2">
            <label htmlFor="search">Search by</label>
            <input type="search" name="search" id="search" placeholder="Name or Number" className="bg-[#c9dde2] p-3 rounded-lg w-full" />
          </div>
          <div className="flex flex-col w-1/5 space-y-2">
            <label htmlFor="type">Type</label>
            <select name="type" id="type" className="bg-[#c9dde2] p-3 rounded-lg w-full">
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
            <select name="type" id="type" className="bg-[#c9dde2] p-3 rounded-lg w-full">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="flex flex-col w-1/5 space-y-2">
            <label htmlFor="type">Stats</label>
            <select name="type" id="type" className="bg-[#c9dde2] p-3 rounded-lg w-full">
              <option value="normal">Normal</option>
              <option value="fighting">Fighting</option>
              <option value="flying">Flying</option>
              <option value="poison">Poison</option>
              <option value="ground">Ground</option>
              <option value="rock">Rock</option>
            </select>
          </div>
        </div>
      </nav>

      {openModel && <Model />}

      <div className="grid grid-cols-6 gap-8">

        {arr && arr.map((items, index)=>{
          return <div key={items.name} className="flex flex-col justify-center items-center border-2 border-dashed rounded-lg border-black bg-[#edc2c4]">
          <div>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/7.png" height="200px" width="200px" alt="pokemon" />
          </div>
          <div className="text-center pb-4 flex flex-col">
            <span className="font-bold">{items.name}</span>
            <span>{index+1}</span>
          </div>
        </div>
        })}
        
      </div>
    </div>
  );
}

export default App;
